import {
  APIEmbedField,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js'

import { config } from '../../config'
import { ChannelController } from '../../controllers'

export const data = new SlashCommandBuilder()
  .setName('lobbylink')
  .setDescription('Send a link to the current lobby')
  .addStringOption((option) =>
    option
      .setName('steamlink')
      .setDescription('The game to get the lobby link for')
      .setRequired(true)
  )
  .addStringOption((option) =>
    option.setName('hostrules').setDescription('Send with host rules')
  )

export const execute = async (interaction: ChatInputCommandInteraction) => {
  if (
    !ChannelController.isChannel(
      interaction,
      config.discord.channels.lobbylinks
    )
  )
    return
  const steamlink = interaction.options.getString('steamlink')
  if (!steamlink?.startsWith('steam://joinlobby/'))
    return interaction.reply({
      content: 'Invalid lobby link',
      ephemeral: true,
    })
  const link = steamlink.replace(
    'steam://joinlobby/',
    `http://${config.host}:${config.port}/join/`
  )
  const hostrules = interaction.options.getString('hostrules')
  const fields: APIEmbedField[] = []
  if (hostrules)
    fields.push({
      name: 'Host Rules',
      value: hostrules,
      inline: false,
    })

  interaction.channel?.send({
    embeds: [
      {
        title: `Join ${interaction.user.username}'s Lobby`,
        description: `Lobby Link: [Steam Lobby](${link})`,
        color: 0x00ff00,
        url: link,
        fields,
      },
    ],
  })

  interaction.reply({ content: 'Lobby link sent', ephemeral: true })
  interaction.deleteReply()
}
