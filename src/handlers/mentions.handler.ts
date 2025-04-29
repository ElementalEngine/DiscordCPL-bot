import { ChatInputCommandInteraction, GuildMember } from 'discord.js';

export async function toggleMentionedUsers(
  interaction: ChatInputCommandInteraction,
  members: GuildMember[]
): Promise<GuildMember[]> {
  const originalIds = new Set(members.map(m => m.id));

  const mentionIds = new Set<string>();
  for (let i = 0; i < 15; i++) {
    const opt = i === 0 ? 'user' : `user${i + 1}`;
    const u = interaction.options.getUser(opt);
    if (u) mentionIds.add(u.id);
  }

  for (const id of mentionIds) {
    const wasInOriginal = originalIds.has(id);
    const idx = members.findIndex(m => m.id === id);

    if (wasInOriginal && idx > -1) {
      members.splice(idx, 1);
    } else if (!wasInOriginal) {
      const member = interaction.guild?.members.cache.get(id);
      if (member) {
        members.push(member);
      }
    }
  }

  return members;
}