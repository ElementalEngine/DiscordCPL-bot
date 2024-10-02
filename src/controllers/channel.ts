import { CommandInteraction } from 'discord.js'

export const ChannelController = {
  isChannel: (interaction: CommandInteraction, channel: string) => {
    if (interaction.channel?.id !== channel) {
      interaction.reply({
        content: `This command can only be used in the #${channel} channel.`,
        ephemeral: true,
      })
      return false
    }
    return true
  },
}
