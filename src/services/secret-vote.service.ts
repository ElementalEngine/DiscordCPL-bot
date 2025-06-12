import {
  Client,
  ChatInputCommandInteraction,
  GuildMember,
  TextChannel,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ComponentType,
  ButtonInteraction
} from 'discord.js';
import {
  VOTE_TIMER_SV,
  EMOJI_YES,
  EMOJI_NO,
  EMOJI_RESULTS,
  EMOJI_SPY,
  EMOJI_PARTICIPANTS,
  EMOJI_QUESTION,
  EMOJI_ERROR
} from '../config/constants';
import { collectParticipants } from '../handlers';
import {
  acquireChannelLock,
  releaseChannelLock,
  acquireUserLock,
  releaseUserLock
} from '../utils';

export default class SecretVoteService {
  constructor(private client: Client) {}

  public async secretVote(
    interaction: ChatInputCommandInteraction
  ): Promise<void> {
    const channelId = interaction.channelId;
    if (!acquireChannelLock(channelId)) {
      await interaction.reply({
        content: `${EMOJI_RESULTS} A vote is already running in this channel.`,
        ephemeral: true
      });
      return;
    }

    await interaction.deferReply({ ephemeral: true });

    // Parse required options
    let type: string;
    let question: string;
    try {
      type = interaction.options.getString('type', true);
      question = interaction.options.getString('question', true);
    } catch {
      await interaction.followUp({
        content: `${EMOJI_ERROR} Missing required vote options.`,
        ephemeral: true
      });
      releaseChannelLock(channelId);
      return;
    }

    // Gather participants
    const participants: GuildMember[] = await collectParticipants(interaction);
    if (participants.length < 2) {
      await interaction.followUp({
        content: `${EMOJI_ERROR} You need at least **2** participants to start a secret vote.`,
        ephemeral: true
      });
      releaseChannelLock(channelId);
      return;
    }

    const mentionList = participants.map(m => `<@${m.id}>`).join(' ');

    // Initial embed
    const initialEmbed = new EmbedBuilder()
      .setTitle(`${EMOJI_SPY} Secret Vote ${EMOJI_SPY}`)
      .addFields(
        { name: `${EMOJI_PARTICIPANTS} Participants`, value: mentionList },
        { name: `${EMOJI_QUESTION} Question`,     value: `**${type}**: ${question}` },
        { name: `${EMOJI_RESULTS} Results`,      value: 'Pending votes...' }
      );

    const chan = (await this.client.channels.fetch(
      channelId
    )) as TextChannel;
    const voteMessage = await chan.send({ embeds: [initialEmbed] });

    let yesCount = 0;
    let noCount = 0;

    // DM voting
    await Promise.all(
      participants.map(async member => {
        if (!acquireUserLock(member.id)) return;
        let prompt: any;
        try {
          const dm = await member.createDM();
          const yesBtn = new ButtonBuilder()
            .setCustomId(`sv_${interaction.id}_${member.id}_yes`)
            .setEmoji(EMOJI_YES)
            .setLabel('Yes')
            .setStyle(ButtonStyle.Success);
          const noBtn = new ButtonBuilder()
            .setCustomId(`sv_${interaction.id}_${member.id}_no`)
            .setEmoji(EMOJI_NO)
            .setLabel('No')
            .setStyle(ButtonStyle.Danger);
          const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            yesBtn,
            noBtn
          );

          prompt = await dm.send({
            content:
              `${EMOJI_SPY} Secret Vote initiated by **${interaction.user.tag}**\n` +
              `**Question:** **${type}**: ${question}`,
            components: [row]
          });

          const response = await prompt.awaitMessageComponent({
            filter: (i: ButtonInteraction) =>
              i.user.id === member.id &&
              i.customId.startsWith(`sv_${interaction.id}_${member.id}`),
            componentType: ComponentType.Button,
            time: VOTE_TIMER_SV
          });

          const vote = response.customId.endsWith('_yes') ? 'Yes' : 'No';
          if (vote === 'Yes') yesCount++;
          else noCount++;

          // Update DM with vote
          await prompt.edit({
            content:
              `${EMOJI_SPY} Secret Vote initiated by **${interaction.user.tag}**\n` +
              `**Question:** **${type}**: ${question}\n` +
              `Your vote: ${vote}`,
            components: []
          });
        } catch {
          // Timeout counts as Yes
          yesCount++;
          if (prompt) {
            await prompt.edit({
              content:
                `${EMOJI_SPY} Secret Vote initiated by **${interaction.user.tag}**\n` +
                `**Question:** **${type}**: ${question}\n` +
                `**No response. Counted as Yes.**`,
              components: []
            });
          }
        } finally {
          releaseUserLock(member.id);
        }
      })
    );

    // Final embed update
    const finalEmbed = EmbedBuilder.from(initialEmbed).setFields(
      { name: `${EMOJI_PARTICIPANTS} Participants`, value: mentionList },
      { name: `${EMOJI_QUESTION} Question`,     value: `**${type}**: ${question}` },
      { name: `${EMOJI_RESULTS} Results`,      value: `${EMOJI_YES} **${yesCount}** vs ${EMOJI_NO} **${noCount}**` }
    );

    await voteMessage.edit({ embeds: [finalEmbed] });
    releaseChannelLock(channelId);
    await interaction.deleteReply();
  }
}
