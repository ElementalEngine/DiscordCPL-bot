import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

import { config } from '../../config'
import {
  ChannelController,
  MentionsController,
  VoiceController,
} from '../../controllers'
import { addOptionalMentions, shuffleArray } from '../../utils'

export const data = addOptionalMentions(
  new SlashCommandBuilder()
    .setName('teamgen')
    .setDescription('Send a randomly generated team suggestion')
)

export const execute = async (interaction: ChatInputCommandInteraction) => {
  if (
    !ChannelController.isChannel(interaction, config.discord.channels.commands)
  )
    return
  const members = await MentionsController.addOrRemoveMentionedUsers(
    interaction,
    await VoiceController.getUsersInVoiceChannel(interaction)
  )
  if (members.length < 2)
    return interaction.reply({
      content: 'You cannot generate teams with less than 2 players.',
      ephemeral: true,
    })
  const shuffled = shuffleArray(members)
  const teams = [
    shuffled.slice(0, Math.ceil(shuffled.length / 2)),
    shuffled.slice(Math.ceil(shuffled.length / 2), shuffled.length),
  ]
  interaction.channel?.send({
    embeds: [
      {
        title: 'Team Generator',
        color: 0x006dff,
        fields: [
          {
            name: 'Team 1',
            value: teams[0].join('\n'),
            inline: true,
          },
          {
            name: 'Team 2',
            value: teams[1].join('\n'),
            inline: true,
          },
        ],
      },
    ],
  })
  interaction.reply({ content: 'Teams generated', ephemeral: true })
  interaction.deleteReply()
}
