import { ChatInputCommandInteraction, GuildMember } from 'discord.js';

export function ensureChannel(
  interaction: ChatInputCommandInteraction,
  allowed: string[]
): boolean {
  if (!allowed.includes(interaction.channelId)) {
    interaction.reply({
      content: `You can only run this in ${allowed.map(c => `<#${c}>`).join(' or ')}`,
      ephemeral: true,
    });
    return false;
  }
  return true;
}

export function ensurePermissions(
  interaction: ChatInputCommandInteraction,
  allowedRoles: string[]
): boolean {
  const member = interaction.member as GuildMember;
  if (!allowedRoles.some(r => member.roles.cache.has(r))) {
    interaction.reply({
      content: `You need one of these roles: ${allowedRoles.map(r => `<@&${r}>`).join(', ')}`,
      ephemeral: true,
    });
    return false;
  }
  return true;
}