import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  GuildMember,
  Message,
  TextBasedChannel,
} from 'discord.js';
import { collectParticipants } from '../handlers/collectParticipants.handler';
import {
  EMOJI_SPY,
  EMOJI_QUESTION,
  EMOJI_YES,
  EMOJI_NO,
  EMOJI_RESULTS,
  EMOJI_ID,
  EMOJI_PARTICIPANTS,
  VOTE_TIMER_SV,
} from '../config/constants';

let voteInProgress = false;

export const VoteService = {
  canVote(interaction: ChatInputCommandInteraction): boolean {
    if (voteInProgress) {
      interaction.reply({ content: 'A vote is already in progress.', ephemeral: true });
      return false;
    }
    return true;
  },

  async secretVote(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!this.canVote(interaction)) return;
    voteInProgress = true;

    const voteId = Math.random().toString(36).substring(2, 8).toUpperCase();
    await interaction.deferReply({ ephemeral: true });

    const members = await collectParticipants(interaction);

    if (members.length < 2) {
      await interaction.editReply({
        content: 'Cannot start vote: need at least two participants.',
        embeds: [],
      });
      voteInProgress = false;
      return;
    }

    const type     = interaction.options.getString('type', true);
    const params   = interaction.options.getString('params', true);
    const question = `${type} ${params}`;
    const mentions = members.map(m => `<@${m.id}>`).join(' ');

    const channel = interaction.channel as TextBasedChannel | null;

    if (channel?.isTextBased()) {
      const startEmbed = new EmbedBuilder()
        .setTitle(`${EMOJI_SPY} Secret Vote ${EMOJI_SPY}`)
        .addFields(
          { name: `${EMOJI_QUESTION} Question`, value: question },
          { name: `${EMOJI_ID} Vote ID`,       value: voteId },
        )
        .setDescription(`${EMOJI_PARTICIPANTS} Participants: ${mentions}`)
        .setTimestamp();
      (channel as any).send({ embeds: [startEmbed] });
    }

    const dmEmbed = new EmbedBuilder()
      .setTitle(`${EMOJI_SPY} Secret Vote ${EMOJI_SPY}`)
      .addFields(
        { name: `${EMOJI_QUESTION} Question`, value: question },
        { name: `${EMOJI_ID} Vote ID`,       value: voteId },
      )
      .setTimestamp();

    const yes = new ButtonBuilder()
      .setCustomId('yes')
      .setLabel('Yes')
      .setEmoji(EMOJI_YES)
      .setStyle(ButtonStyle.Secondary);
    const no  = new ButtonBuilder()
      .setCustomId('no')
      .setLabel('No')
      .setEmoji(EMOJI_NO)
      .setStyle(ButtonStyle.Secondary);
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(yes, no);

    const dmResults: { member: GuildMember; dm: Message }[] = []; 
    const unreachable: GuildMember[] = [];
    for (const member of members) {
      try {
        const dm = await member.send({ embeds: [dmEmbed], components: [row.toJSON()] });
        dmResults.push({ member, dm });
      } catch (err: any) {
        if (err.code === 50007) unreachable.push(member);
      }
    }

    const votes = { yes: 0, no: 0 };
    await Promise.all(
      dmResults.map(async ({ dm }) => {
        try {
          const resp = await dm.awaitMessageComponent({ time: VOTE_TIMER_SV });
          votes[resp.customId as 'yes' | 'no']++;
          await dm.edit({ content: `You voted **${resp.customId}**`, embeds: [], components: [] });
        } catch {
          votes.yes++;
        }
      })
    );

    if (channel?.isTextBased()) {
      const resultEmbed = new EmbedBuilder()
        .setTitle(`${EMOJI_SPY} Secret Vote Results ${EMOJI_SPY}`)
        .addFields(
          { name: `${EMOJI_ID} Vote ID`,             value: voteId },
          { name: `${EMOJI_PARTICIPANTS} Participants`, value: mentions },
          {
            name: `${EMOJI_RESULTS} Results`,
            value: `${EMOJI_YES} Yes\n${votes.yes}\n${EMOJI_NO} No\n${votes.no}`,
          }
        )
        .setTimestamp();
      (channel as any).send({ embeds: [resultEmbed] });
    }

    if (unreachable.length && channel?.isTextBased()) {
      const list = unreachable.map(m => `<@${m.id}>`).join(', ');
      (channel as any).send(`Could not DM: ${list}. They were excluded.`);
    }

    await interaction.editReply({ content: '✅ Vote completed!', embeds: [] });
    voteInProgress = false;
  },



  // /**
  //  * Starts a draft vote: gathers participants and returns them for draft logic.
  //  */
  // async civilization6DraftVote(
  //   interaction: ChatInputCommandInteraction
  // ): Promise<GuildMember[]> {
  //   if (!this.canVote(interaction)) return [];
  //   voteInProgress = true;
  //   const members = await getUsersInVoiceChannel(interaction);
  //   return toggleMentionedUsers(interaction, members);
  // },

  // async civilization7DraftVote(
  //   interaction: ChatInputCommandInteraction
  // ): Promise<GuildMember[]> {
  //   if (!this.canVote(interaction)) return [];
  //   voteInProgress = true;
  //   const members = await getUsersInVoiceChannel(interaction);
  //   return toggleMentionedUsers(interaction, members);
  // },
};
