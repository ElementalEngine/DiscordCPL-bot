import { ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { getVoiceChannelMembers } from '../utils/voice-members';
import { MAX_MENTIONS } from '../config/constants';

export async function collectParticipants(
  interaction: ChatInputCommandInteraction
): Promise<GuildMember[]> {
  const voiceMembers = await getVoiceChannelMembers(interaction);
  const memberMap = new Map<string, GuildMember>(
    voiceMembers.map(m => [m.id, m])
  );

  // Apply include/exclude overrides
  for (let i = 1; i <= MAX_MENTIONS; i++) {
    const suffix    = i === 1 ? '' : String(i);
    const includeKey = `includeuser${suffix}`;
    const excludeKey = `excludeuser${suffix}`;

    const inc = interaction.options.getUser(includeKey);
    if (inc) {
      const gm = interaction.guild?.members.cache.get(inc.id);
      if (gm) memberMap.set(gm.id, gm);
    }

    const exc = interaction.options.getUser(excludeKey);
    if (exc) {
      memberMap.delete(exc.id);
    }
  }

  return Array.from(memberMap.values());
}
