// ui/embeds.ts

import { EmbedBuilder, ColorResolvable } from 'discord.js';

export function createBaseEmbed(
  botName = 'MyBot',
  color: ColorResolvable = '#5865F2'
): EmbedBuilder {
  return new EmbedBuilder().setColor(color).setFooter({ text: botName }).setTimestamp();
}

export function createErrorEmbed(message: string, botName = 'MyBot'): EmbedBuilder {
  return createBaseEmbed(botName, '#E74C3C')
    .setTitle('❌ Error')
    .setDescription(message);
}

export function createSuccessEmbed(message: string, botName = 'MyBot'): EmbedBuilder {
  return createBaseEmbed(botName, '#2ECC71')
    .setTitle('✅ Success')
    .setDescription(message);
}

export function createInfoEmbed(
  title: string,
  description: string,
  botName = 'CPL Bot',
  color: ColorResolvable = '#3498DB'
): EmbedBuilder {
  return createBaseEmbed(botName, color).setTitle(title).setDescription(description);
}
