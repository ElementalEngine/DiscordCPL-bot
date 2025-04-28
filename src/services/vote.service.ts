import {
  ChatInputCommandInteraction,
  ButtonBuilder,
  ActionRowBuilder,
  EmbedBuilder,
  ButtonStyle,
  TextBasedChannel,
  GuildMember,
  Message,
  MessageComponentInteraction,
} from 'discord.js';
import { toggleMentionedUsers } from '../handlers/mentions.handler';
import { getUsersInVoiceChannel } from '../handlers/voice.handler';
import {
  EMOJI_QUESTION,
  EMOJI_YES,
  EMOJI_NO,
  VOTE_TIMER_SV,
} from '../config/constants';

let voteInProgress = false;

export const VoteService = {
  // Guard: ensures no vote is running.
  canVote(interaction: ChatInputCommandInteraction): boolean {
    if (voteInProgress) {
      interaction.reply({ content: 'There is already a vote in progress.', ephemeral: true });
      return false;
    }
    return true;
  },

  async secretVote(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!this.canVote(interaction)) return;
    voteInProgress = true;

    let members = await getUsersInVoiceChannel(interaction);
    members      = await toggleMentionedUsers(interaction, members);

    const type = interaction.options.getString('type', true);
    const params = interaction.options.getString('params', true);
    const question = `Question: ${type} ${params} ${EMOJI_QUESTION}${EMOJI_QUESTION}`;

    const embed = new EmbedBuilder()
      .setTitle(':spy: Secret Vote :spy:')
      .setDescription(question)
      .setTimestamp();

    const yes = new ButtonBuilder()
      .setCustomId('yes')
      .setLabel('Yes')
      .setEmoji('👍')
      .setStyle(ButtonStyle.Secondary);
    const no = new ButtonBuilder()
      .setCustomId('no')
      .setLabel('No')
      .setEmoji('👎')
      .setStyle(ButtonStyle.Secondary);
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(yes, no);

    await interaction.reply({ content: 'Vote started.', ephemeral: true });

    // Send DMs and collect votes
    const votes: VoteCounts = { yes: 0, no: 0 };
    
    interface VoteCounts { yes: number; no: number; }
    interface MemberVote { member: GuildMember; dm: Message; }

    await Promise.all(
      members.map(async (member: GuildMember): Promise<void> => {
        const dm: Message = await member.send({ embeds: [embed], components: [row.toJSON()] });
        try {
          const resp: MessageComponentInteraction = await dm.awaitMessageComponent({ time: VOTE_TIMER_SV });
          votes[resp.customId as keyof VoteCounts]++;
          await dm.edit({ content: `You voted **${resp.customId}**`, embeds: [], components: [] });
        } catch (err: unknown) {
          if (err instanceof Error && err.toString().includes('time')) votes.yes++;
        }
      })
    );

    // Announce results
    const channel = interaction.channel;
      if (channel?.isTextBased() && 'send' in channel) {
        channel.send({
          embeds: [
            new EmbedBuilder()
              .setTitle(':spy: Secret Vote Results')
              .setDescription(question)
              .addFields(
                { name: `${EMOJI_YES} Yes`, value: `${votes.yes}`, inline: true },
                { name: `${EMOJI_NO} No`,  value: `${votes.no}`, inline: true }
              )
              .setTimestamp(),
          ],
        });
      }
    

    // Cleanup
    voteInProgress = false;
    await interaction.deleteReply();
  },

  /**
   * Starts a draft vote: gathers participants and returns them for draft logic.
   */
  async civilization6DraftVote(
    interaction: ChatInputCommandInteraction
  ): Promise<GuildMember[]> {
    if (!this.canVote(interaction)) return [];
    voteInProgress = true;
    const members = await getUsersInVoiceChannel(interaction);
    return toggleMentionedUsers(interaction, members);
  },

  async civilization7DraftVote(
    interaction: ChatInputCommandInteraction
  ): Promise<GuildMember[]> {
    if (!this.canVote(interaction)) return [];
    voteInProgress = true;
    const members = await getUsersInVoiceChannel(interaction);
    return toggleMentionedUsers(interaction, members);
  },
};
