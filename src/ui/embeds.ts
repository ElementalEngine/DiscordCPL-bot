// src/ui/embeds.ts

import { EmbedBuilder } from 'discord.js';
import { VoteSettingOption } from '../types/service';

/**
 * Build a settings-vote embed.
 *
 * @param title     The embed title
 * @param settings  Map of category → available option emojis/labels
 * @param defaults  Optional default choice per category
 */
export function buildSettingsVoteEmbed(
  title: string,
  settings: Record<string, VoteSettingOption[]>,
  defaults: Record<string, string> = {}
): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription('Click the buttons below to vote on each category.');

  for (const [category, opts] of Object.entries(settings)) {
    const line = opts.map(o => `${o.emoji} ${o.label}`).join('  ');
    const def  = defaults[category] ? ` (default: ${defaults[category]})` : '';
    embed.addFields({ name: category, value: `${line}${def}`, inline: false });
  }

  return embed;
}
