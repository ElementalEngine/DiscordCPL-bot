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

  for (let i = 1; i <= MAX_MENTIONS; i++) {
    const suffix = i === 1 ? '' : `${i}`;
    const includeKey = `includeuser${suffix}`;
    const excludeKey = `excludeuser${suffix}`;

    const incUser = interaction.options.getUser(includeKey);
    if (incUser && interaction.guild) {
      const gm =
        interaction.guild.members.cache.get(incUser.id) ??
        await interaction.guild.members.fetch(incUser.id).catch(() => null);
      if (gm) memberMap.set(gm.id, gm);
    }

    const excUser = interaction.options.getUser(excludeKey);
    if (excUser) memberMap.delete(excUser.id);
  }

  return Array.from(memberMap.values());
}
