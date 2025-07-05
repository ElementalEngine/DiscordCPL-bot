import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { VoteSettingOption } from '../types/service';

export function buildSettingsVoteButtons(
  settings: Record<string, VoteSettingOption[]>
): ActionRowBuilder<ButtonBuilder>[] {
  const rows: ActionRowBuilder<ButtonBuilder>[] = [];
  for (const [category, opts] of Object.entries(settings)) {
    let row = new ActionRowBuilder<ButtonBuilder>();
    opts.forEach((opt, i) => {
      // Start new row every 5 buttons
      if (i > 0 && i % 5 === 0) {
        rows.push(row);
        row = new ActionRowBuilder<ButtonBuilder>();
      }
      const btn = new ButtonBuilder()
        .setCustomId(`vote_${category}_${opt.label}`)
        .setLabel(opt.label)
        .setEmoji(opt.emoji)
        .setStyle(ButtonStyle.Primary);
      row.addComponents(btn);
    });
    if (row.components.length) rows.push(row);
  }
  return rows;
}