import {
  CommandInteraction,
  GuildMember,
  GuildChannel,
  MessagePayload,
  MessageCreateOptions,
} from 'discord.js';

export async function getUsersInVoiceChannel(
  interaction: CommandInteraction
): Promise<GuildMember[]> {
  const member = interaction.member as GuildMember;
  const channel = member.voice.channel as GuildChannel;
  if (!channel) {
    await interaction.reply({
      content: 'You need to join a voice channel first!',
      ephemeral: true,
    });
    return [];
  }
  return [...channel.members.values()] as GuildMember[];
}

export async function messageUsersInVoiceChannel(
  interaction: CommandInteraction,
  message: string | MessagePayload | MessageCreateOptions
): Promise<void> {
  const member = interaction.member as GuildMember;
  const channel = member.voice.channel as GuildChannel;
  if (!channel) {
    await interaction.reply({
      content: 'You need to join a voice channel first!',
      ephemeral: true,
    });
    return;
  }

  // fire‐and‐forget DMs
  for (const [, m] of channel.members) {
    m.send(message).catch(() => {
    });
  }

  await interaction.reply({ content: 'Message sent!', ephemeral: true });
  await interaction.deleteReply();
}
