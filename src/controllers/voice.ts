import {
  CommandInteraction,
  GuildMember,
  GuildChannel,
  MessagePayload,
  MessageCreateOptions,
  Collection,
} from 'discord.js'

export const VoiceController = {
  getUsersInVoiceChannel: async (
    interaction: CommandInteraction
  ): Promise<GuildMember[]> => {
    const member = interaction.member as GuildMember
    const channel = member.voice.channel as GuildChannel
    if (!channel) {
      await interaction.reply({
        content: 'You need to join a voice channel first!',
        ephemeral: true,
      })
      return []
    }
    return [...channel.members.map((member) => member as GuildMember)]
  },

  messageUsersInVoiceChannel: async (
    interaction: CommandInteraction,
    message: string | MessagePayload | MessageCreateOptions
  ) => {
    const member = interaction.member as GuildMember
    const channel = member.voice.channel as GuildChannel
    console.log({ channel })
    if (!channel) {
      await interaction.reply({
        content: 'You need to join a voice channel first!',
        ephemeral: true,
      })
      return
    }
    channel.members.forEach((member) => {
      member.send(message)
    })
    interaction.reply({ content: 'Message sent!', ephemeral: true })
    interaction.deleteReply()
  },
}
