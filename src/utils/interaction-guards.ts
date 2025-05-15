import { ChatInputCommandInteraction, GuildMember } from 'discord.js';

export function ensureChannel(
  interaction: ChatInputCommandInteraction,
  allowedChannelIds: string[]
): boolean {
  if (!allowedChannelIds.includes(interaction.channelId)) {
    interaction.reply({
      content: `You can only run this command in: ${allowedChannelIds
        .map(id => `<#${id}>`)
        .join(', ')}`,
      ephemeral: true
    });
    return false;
  }
  return true;
}

export function ensurePermissions(
  interaction: ChatInputCommandInteraction,
  allowedRoleIds: string[]
): boolean {
  const member = interaction.member as GuildMember;
  if (!allowedRoleIds.some(roleId => member.roles.cache.has(roleId))) {
    interaction.reply({
      content: `You need one of these roles: ${allowedRoleIds
        .map(id => `<@&${id}>`)
        .join(', ')}`,
      ephemeral: true
    });
    return false;
  }
  return true;
}

const channelVoteLocks = new Set<string>();
const userVoteLocks = new Set<string>();

export function acquireChannelLock(channelId: string): boolean {
  if (channelVoteLocks.has(channelId)) return false;
  channelVoteLocks.add(channelId);
  return true;
}

export function releaseChannelLock(channelId: string): void {
  channelVoteLocks.delete(channelId);
}

export function acquireUserLock(userId: string): boolean {
  if (userVoteLocks.has(userId)) return false;
  userVoteLocks.add(userId);
  return true;
}
export function releaseUserLock(userId: string): void {
  userVoteLocks.delete(userId);
}