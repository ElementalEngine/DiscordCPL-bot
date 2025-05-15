import { ChatInputCommandInteraction, GuildMember } from 'discord.js';

export async function getVoiceChannelMembers(
  interaction: ChatInputCommandInteraction
): Promise<GuildMember[]> {
  const guild = interaction.guild;
  if (!guild) return [];

  let member = interaction.member as GuildMember;
  if (!member.voice.channel) {
    member = await guild.members.fetch(interaction.user.id).catch(() => null as any);
    if (!member) return [];
  }

  const channel = member.voice.channel;
  return channel ? Array.from(channel.members.values()) : [];
}