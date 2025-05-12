// src/services/civ7Draft.helpers.ts
import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from 'discord.js';
import { CIV7_VOTE_SETTINGS, VOTE_TIMER_DRAFT } from '../config/constants';

/**
 * Master embed: live-updating winners.
 * Shows Vote ID, timer, Starting Age, Players, then one inline
 * placeholder field per category, finishing with Leader Bans.
 */
export function buildMasterEmbed(
  voteId: string,
  mentions: string,
  startingAge: string
): EmbedBuilder {
  // convert ms → minutes
  const minutes = VOTE_TIMER_DRAFT / 1000 / 60;

  const embed = new EmbedBuilder()
    .setTitle('🗳️ Civ VII Draft Vote 🗳️')
    .setDescription(
      `**Vote ID:** \`${voteId}\`\n` +
      `You have **${minutes} minute${minutes !== 1 ? 's' : ''}** to complete the vote before it times out.`
    )
    .addFields(
      // full-width
      { name: 'Starting Age', value: `**${startingAge}**`, inline: false },
      { name: 'Players',      value: mentions,                inline: false }
    )
    .setFooter({
      text: `Need ≥50% to win; otherwise highest vote wins • ${minutes}m total`,
    })
    .setTimestamp();

  // one inline placeholder per category
  for (const category of Object.keys(CIV7_VOTE_SETTINGS)) {
    embed.addFields({ name: category, value: '—', inline: true });
  }

  // final full-width field for bans
  embed.addFields({ name: 'Leader Bans', value: '—', inline: false });

  return embed;
}

/**
 * Build button rows for a single category.
 * Up to 4 buttons per row.
 * Custom IDs follow `${category}|${label}` so you can parse them later.
 */
export function buildCategoryButtons(
  category: string,
  opts: { emoji: string; label: string }[]
): ActionRowBuilder<ButtonBuilder>[] {
  const MAX_PER_ROW = 4;
  const rows: ActionRowBuilder<ButtonBuilder>[] = [];
  let row = new ActionRowBuilder<ButtonBuilder>();

  opts.forEach((opt, i) => {
    // start a new row every MAX_PER_ROW buttons
    if (i % MAX_PER_ROW === 0) {
      row = new ActionRowBuilder<ButtonBuilder>();
      rows.push(row);
    }
    row.addComponents(
      new ButtonBuilder()
        .setCustomId(`${category}|${opt.label}`)
        .setEmoji(opt.emoji)
        .setLabel(opt.label)
        .setStyle(ButtonStyle.Secondary)
    );
  });

  return rows;
}
