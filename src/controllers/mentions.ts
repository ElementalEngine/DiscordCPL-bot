import { ChatInputCommandInteraction, GuildMember } from 'discord.js'

export const MentionsController = {
  addOrRemoveMentionedUsers: async (
    interaction: ChatInputCommandInteraction,
    members: GuildMember[]
  ): Promise<GuildMember[]> => {
    for (let i = 0; i < 14; i++) {
      const user = interaction.options.getUser(
        i === 0 ? `user` : `user${Number(i) + 1}`
      )
      if (user) {
        const member = interaction.guild?.members.cache.get(user.id)
        if (member) {
          const memb = members.find(({ id }) => id === member.id)
          memb
            ? (members = members.filter(({ id }) => id !== member.id))
            : members.push(member)
        }
      }
    }
    return members
  },
}
