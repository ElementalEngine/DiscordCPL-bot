import { ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { getVoiceChannelMembers } from '../utils/voice-members';
import { MAX_MENTIONS } from '../config/constants';

export async function collectParticipants(
  interaction: ChatInputCommandInteraction
): Promise<GuildMember[]> {
  const { guild, options, user } = interaction;
  if (!guild) return [];

  // 1) Voice-channel participants
  const voiceMembers = await getVoiceChannelMembers(interaction);
  const participants = new Map<string, GuildMember>(
    voiceMembers.map(member => [member.id, member])
  );

  // 2) Manual include/exclude
  for (let i = 1; i <= MAX_MENTIONS; i++) {
    const suffix = i === 1 ? '' : `${i}`;
    const includeKey = `includeuser${suffix}`;
    const excludeKey = `excludeuser${suffix}`;

    const includeUser = options.getUser(includeKey);
    if (includeUser) {
      const memberToAdd =
        guild.members.cache.get(includeUser.id) ||
        await guild.members.fetch(includeUser.id).catch(() => null);
      if (memberToAdd) participants.set(memberToAdd.id, memberToAdd);
    }

    const excludeUser = options.getUser(excludeKey);
    if (excludeUser) participants.delete(excludeUser.id);
  }

  // 3) Invoker self-include, respecting self-exclusion
  const selfExcluded = options.getUser('excludeuser')?.id === user.id;
  if (!selfExcluded) {
    const invoker =
      guild.members.cache.get(user.id) ||
      (await guild.members.fetch(user.id).catch(() => null));
    if (invoker && !participants.has(user.id)) {
      participants.set(user.id, invoker);
    }
  }

  return Array.from(participants.values());
}
