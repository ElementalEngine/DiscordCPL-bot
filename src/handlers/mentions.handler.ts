import { ChatInputCommandInteraction, GuildMember } from 'discord.js';

// Toggle each optionally-passed `userX` in/out of the members list.

export async function toggleMentionedUsers(
  interaction: ChatInputCommandInteraction,
  members: GuildMember[]
): Promise<GuildMember[]> {
  for (let i = 0; i < 15; i++) {
    const opt = i === 0 ? 'user' : `user${i + 1}`;
    const user = interaction.options.getUser(opt);
    if (!user || !interaction.guild) continue;

    const member = interaction.guild.members.cache.get(user.id);
    if (!member) continue;

    const idx = members.findIndex(m => m.id === member.id);
    if (idx > -1) {
      members.splice(idx, 1);
    } else {
      members.push(member);
    }
  }
  return members;
}