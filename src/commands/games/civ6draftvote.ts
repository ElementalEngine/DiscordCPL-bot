import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

import { config } from '../../config'
import { ChannelController } from '../../controllers'

export const data = new SlashCommandBuilder()
  .setName('civ6draftvote')
  .setDescription('initiate a game vote')
  .addStringOption((option) =>
    option
      .setName('gametype')
      .setDescription('Choose type of vote options: ffa, teamer')
      .setRequired(true)
      .addChoices(
        { name: 'FFA', value: 'ffa' },
        { name: 'Teamer', value: 'teamer' }
      )
  )
export const execute = async (interaction: ChatInputCommandInteraction) => {
  if (!ChannelController.isChannel(interaction, config.discord.channels.civ6ffavoting))
    return

  const gametype = interaction.options.getString('gametype')
  interaction.reply({ content: `VoteType: ${gametype}`, ephemeral: true })
}
