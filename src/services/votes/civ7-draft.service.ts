import {
  ChatInputCommandInteraction,
  GuildMember,
  Client,
  TextChannel,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ComponentType,
  Message,
  User,
  MessageReaction,
  PartialMessageReaction,
  PartialUser
} from 'discord.js';
import { civ7Leaders } from '../../data/civ7';
import {
  CIV7_VOTE_SETTINGS,
  VOTE_TIMER_DRAFT,
  EMOJI_ERROR,
  EMOJI_PARTICIPANTS,
  EMOJI_FINISHED
} from '../../config/constants';
import { collectParticipants } from '../../handlers/collect-participants.handler';
import { acquireChannelLock, releaseChannelLock } from '../../utils';
import { CoreVoteService, VoteSetting } from './core-vote.service';

export default class Civ7DraftService {
  private core!: CoreVoteService;
  private masterMsg!: Message;
  private banMsg!: Message;

  constructor(private client: Client) {}

  public async civ7Draft(interaction: ChatInputCommandInteraction): Promise<void> {
    const chanId = interaction.channelId;
    if (!acquireChannelLock(chanId)) {
      await interaction.reply({ content: `${EMOJI_ERROR} A draft is already running.`, ephemeral: true });
      return;
    }
    try {
      await interaction.reply({ content: 'Setting up draft vote…', ephemeral: true });
      const participants = await collectParticipants(interaction);
      if (participants.length < 2) {
        releaseChannelLock(chanId);
        await interaction.editReply({ content: `${EMOJI_ERROR} Need at least 2 participants.` });
        return;
      }

      const gameMode = interaction.options.getString('gamemode', true)!;
      const startingAge = interaction.options.getString('startingage', true)!;

      // VoteSettings: everything except Leader Ban, but we DO need Leader Ban options for tally!
      const settings: VoteSetting[] = Object.entries(CIV7_VOTE_SETTINGS).map(
        ([name, opts]) =>
          name === 'Leader Ban'
            ? { name, options: civ7Leaders.map(l => ({ emoji: `<:${l.leader}:${l.emoji_ID}>`, label: l.leader })) }
            : { name, options: opts }
      );

      const channel = (await this.client.channels.fetch(chanId)) as TextChannel;
      // Master embed
      const embed = new EmbedBuilder()
        .setTitle('Civ7 Game Settings Vote')
        .setDescription(`Game Mode: **${gameMode}**\nStarting Age: **${startingAge}**`)
        .addFields([
          { name: `${EMOJI_PARTICIPANTS} Participants`, value: participants.map(u => `<@${u.id}>`).join(' '), inline: false },
          { name: '​', value: 'Vote on each setting below!', inline: false },
          ...settings.map(s => ({ name: s.name, value: 'Pending votes...', inline: true }))
        ])
        .setFooter({ text: 'Voting will timeout in 10 minutes.' });
      this.masterMsg = await channel.send({ embeds: [embed] });

      // Core service
      this.core = new CoreVoteService(participants, settings, this.masterMsg);

      // Buttons for each category except Leader Ban
      for (const s of settings.filter(s => s.name !== 'Leader Ban')) {
        const opts = s.options;
        const rows: ActionRowBuilder<ButtonBuilder>[] = [];
        for (let i = 0; i < opts.length; i += 4) {
          const row = new ActionRowBuilder<ButtonBuilder>();
          for (const o of opts.slice(i, i + 4)) {
            row.addComponents(
              new ButtonBuilder()
                .setCustomId(`civ7-${s.name}-${o.emoji}`)
                .setEmoji(o.emoji)
                .setLabel(o.label)
                .setStyle(ButtonStyle.Secondary)
            );
          }
          rows.push(row);
        }
        const btnMsg = await channel.send({ content: `**${s.name}**`, components: rows });
        const coll = btnMsg.createMessageComponentCollector({ componentType: ComponentType.Button, time: VOTE_TIMER_DRAFT });
        coll.on('collect', async btn => {
          const uid = btn.user.id;
          if (this.core.hasVoted(s.name, uid)) {
            await btn.reply({ content: '❌ Already voted here.', ephemeral: true });
            return;
          }
          this.core.recordVote(s.name, btn.customId.split('-').pop()!, btn.user);
          await btn.deferUpdate();
          await this.refreshMaster();
        });
        coll.on('end', () => {
          rows.forEach(r => r.components.forEach(c => (c as ButtonBuilder).setDisabled(true)));
          btnMsg.edit({ components: rows }).catch(() => {});
        });
      }

      // Leader bans: pre-seed with all leader emojis
      this.banMsg = await channel.send({ content: '**Leader bans**\nReact with the emoji of the leader to ban.' });
      for (const l of civ7Leaders) {
        try {
          await this.banMsg.react(l.emoji_ID);
        } catch (e) {
          // If an emoji is unavailable, log and skip
          // console.warn('Failed to react:', l.leader, e);
        }
      }
      const banColl = this.banMsg.createReactionCollector({ time: VOTE_TIMER_DRAFT });
      banColl.on('collect', (reaction, user) => this.onBanChange(reaction, user));
      banColl.on('remove', (reaction, user) => this.onBanChange(reaction, user));

      // Finish button
      const finishRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId('civ7-finish')
          .setLabel(`${EMOJI_FINISHED} Finish Voting`)
          .setStyle(ButtonStyle.Success)
      );
      const finishMsg = await channel.send({
        content: `**Finish Voting**\nWaiting: ${participants.map(u => `<@${u.id}>`).join(' ')}`,
        components: [finishRow]
      });
      const finishColl = finishMsg.createMessageComponentCollector({ componentType: ComponentType.Button, time: VOTE_TIMER_DRAFT });
      finishColl.on('collect', async btn => {
        const uid = btn.user.id;
        if (!participants.some(p => p.id === uid)) {
          await btn.reply({ content: '❌ Not a participant.', ephemeral: true });
          return;
        }
        this.core.markFinished(uid);
        await btn.deferUpdate();
        const left = participants.filter(p => !this.core.isFinished(p.id));
        await finishMsg.edit({
          content: `**Finish Voting**\nWaiting: ${left.length ? left.map(u => `<@${u.id}>`).join(' ') : 'None—done!'}`
        });
        if (left.length === 0) finishColl.stop();
      });

      finishColl.on('end', async () => {
        const results = this.core.tallyVotes();
        const final = EmbedBuilder.from(this.masterMsg.embeds[0])
          .setTitle('Civ7 Game Settings Vote (Closed)')
          .setFields(
            this.masterMsg.embeds[0].data.fields!.map(f => ({
              name: f.name,
              value:
                f.name === `${EMOJI_PARTICIPANTS} Participants`
                  ? f.value
                  : `**${results[f.name] || '—'}**`,
              inline: f.inline!
            }))
          );
        await this.masterMsg.edit({ embeds: [final] });
        await this.banMsg.delete().catch(() => {});
        await finishMsg.delete().catch(() => {});
        // TODO: Also delete category button messages if you want total cleanup
        releaseChannelLock(chanId);
      });

      await interaction.editReply({ content: '✅ Draft vote started!' });
    } catch (err) {
      releaseChannelLock(chanId);
      await interaction.editReply({ content: `${EMOJI_ERROR} Error starting vote.` });
      throw err;
    }
  }

  // Handler for both add and remove, handles threshold logic for bans
  private onBanChange(reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) {
    if (!this.banMsg || reaction.message.id !== this.banMsg.id || user.bot) return;
    // Find the leader for this emoji
    let found = civ7Leaders.find(l => l.emoji_ID === reaction.emoji.id);
    if (!found) return;
    const emoji = `<:${found.leader}:${found.emoji_ID}>`;
    const count = reaction.count ?? 0;
    const threshold = Math.ceil(this.core.participants.length / 2);
    if (count >= threshold) {
      this.core.recordVote('Leader Ban', emoji, user as User);
    } else {
      this.core.removeVote('Leader Ban', emoji, user as User);
    }
    void this.refreshMaster();
  }

  private async refreshMaster() {
    const results = this.core.tallyVotes();
    const embed = EmbedBuilder.from(this.masterMsg.embeds[0]);
    embed.setFields(
      embed.data.fields!.map(f => ({
        name: f.name,
        value:
          f.name === `${EMOJI_PARTICIPANTS} Participants`
            ? f.value
            : `**${results[f.name] || 'Pending votes...'}**`,
        inline: f.inline!
      }))
    );
    await this.masterMsg.edit({ embeds: [embed] });
  }
}
