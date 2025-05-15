import { ChatInputCommandInteraction, GuildMember } from 'discord.js';

export async function getVoiceChannelMembers(
  interaction: ChatInputCommandInteraction
): Promise<GuildMember[]> {
  const member = interaction.member;
  if (!member || !('voice' in member) || !member.guild) return [];

  const voiceChannel = member.voice.channel;
  if (!voiceChannel?.members) return [];

  return Array.from(voiceChannel.members.values());
}

export async function notifyVoiceChannelMembers(
  interaction: ChatInputCommandInteraction,
  content: string
): Promise<void> {
  const members = await getVoiceChannelMembers(interaction);
  await Promise.all(
    members.map(async (m) => {
      try {
        await m.send(content);
      } catch {
        /* ignore */
      }
    })
  );
}
