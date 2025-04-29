import { CommandInteraction, GuildMember } from 'discord.js';

export async function getUsersInVoiceChannel(
  interaction: CommandInteraction
): Promise<GuildMember[]> {
  const member = interaction.member as GuildMember;
  const channel = member.voice.channel;
  if (!channel) {
    return [];
  }
  return [...channel.members.values()] as GuildMember[];
}

export async function messageUsersInVoiceChannel(
  interaction: CommandInteraction,
  message: string
): Promise<void> {
  const member = interaction.member as GuildMember;
  const channel = member.voice.channel;
  if (!channel) {
    return;
  }

  channel.members.forEach((m) => {
    m.send(message).catch(() => {
    });
  });
}
