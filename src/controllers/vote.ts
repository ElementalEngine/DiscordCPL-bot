import {
  ButtonBuilder,
  ChatInputCommandInteraction,
  ButtonStyle,
  EmbedBuilder,
  ActionRowBuilder,
  DiscordjsErrorCodes,
} from 'discord.js'

import {
  EMOJI_NO,
  EMOJI_QUESTION,
  EMOJI_YES,
  VOTE_TIMER_SV,
  config,
} from '../config'
import { ChannelController } from './channel'
import { MentionsController } from './mentions'
import { VoiceController } from './voice'

let voteInProgress = false

export const VoteController = {
  canVote: (interaction: ChatInputCommandInteraction) => {
    if (voteInProgress) {
      interaction.reply({
        content: 'There is already a vote in progress.',
        ephemeral: true,
      })
      return false
    }
    if (
      !ChannelController.isChannel(
        interaction,
        config.discord.channels.civ7commands
      )
    )
      return false
    return true
  },

  secretVote: async (interaction: ChatInputCommandInteraction) => {
    const canvote = VoteController.canVote(interaction)
    if (!canvote)
      return interaction.reply({ content: 'Cannot vote.', ephemeral: true })
    voteInProgress = true
    const members = await MentionsController.addOrRemoveMentionedUsers(
      interaction,
      await VoiceController.getUsersInVoiceChannel(interaction)
    )
    const votes: any = { yes: 0, no: 0 }
    const type = interaction.options.getString('type')
    const params = interaction.options.getString('params')

    const newMembers = members.filter(({ id }) => !params!.includes(id))

    // if (members.length < 2) {
    //   interaction.reply({
    //     content: 'You cannot start a vote with less than 2 players.',
    //     ephemeral: true,
    //   })
    // }
    const embed = new EmbedBuilder()
      .setTitle(`:spy: Secret Vote :spy:`)
      .setDescription(
        `Question: ${type} ${params} ${EMOJI_QUESTION}${EMOJI_QUESTION}`
      )
      .setTimestamp()

    const yes = new ButtonBuilder()
      .setCustomId('yes')
      .setLabel('Yes')
      .setEmoji('👍')
      .setStyle(ButtonStyle.Secondary)

    const no = new ButtonBuilder()
      .setCustomId('no')
      .setLabel('No')
      .setEmoji('👎')
      .setStyle(ButtonStyle.Secondary)

    const row = new ActionRowBuilder().addComponents(yes, no)
    const main = await interaction.reply({
      content: 'Vote started.',
      ephemeral: true,
    })
    const promises: Promise<any>[] = newMembers.map(async (member) => {
      //  @ts-ignore
      const message = await member.send({ embeds: [embed], components: [row] })
      return message
        .awaitMessageComponent({ time: VOTE_TIMER_SV })
        .then(async ({ customId }) => {
          votes[customId]++
          await message.edit({
            content: `You have voted ${customId}`,
            embeds: [],
            components: [],
          })
        })
        .catch((error: DiscordjsErrorCodes.InteractionCollectorError) => {
          const reason = error.toString().split('reason: ')[1]
          if (reason === 'time') votes.yes++
        })
    })
    Promise.all(promises).then(async () => {
      if (interaction.channel?.isTextBased() && 'send' in interaction.channel) {
        await interaction.channel.send({
          embeds: [
            {
              title: `:spy: Secret Vote :spy:`,
              description: `Question: ${type} ${params} ${EMOJI_QUESTION}${EMOJI_QUESTION}`,
              fields: [
                { name: `${EMOJI_YES} Yes`, value: `${votes.yes}`, inline: true },
                { name: `${EMOJI_NO} No`, value: `${votes.no}`, inline: true },
              ],
            },
          ],
        })
      }
      voteInProgress = false
      main.delete()
    })
  },
  
  civilization7DraftVote: async (interaction: ChatInputCommandInteraction) => {
    const canvote = VoteController.canVote(interaction)
    if (!canvote)
      return interaction.reply({ content: 'Cannot vote.', ephemeral: true })
    voteInProgress = true
    const members = await MentionsController.addOrRemoveMentionedUsers(
      interaction,
      await VoiceController.getUsersInVoiceChannel(interaction)
    )
  },

  civilization6DraftVote: async (interaction: ChatInputCommandInteraction) => {
    const canvote = VoteController.canVote(interaction)
    if (!canvote)
      return interaction.reply({ content: 'Cannot vote.', ephemeral: true })
    voteInProgress = true
    const members = await MentionsController.addOrRemoveMentionedUsers(
      interaction,
      await VoiceController.getUsersInVoiceChannel(interaction)
    )
  }
}
