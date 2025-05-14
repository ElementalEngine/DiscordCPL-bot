// src/services/votes/votes.embeds.ts
import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from 'discord.js';

import {
  CIV7_VOTE_SETTINGS,
  CIV6_VOTE_SETTINGS,
  VOTE_TIMER_DRAFT,
  EMOJI_SPY,
  EMOJI_QUESTION,
  EMOJI_ID,
  EMOJI_PARTICIPANTS,
  EMOJI_YES,
  EMOJI_NO,
  EMOJI_RESULTS,
} from '../../config/constants';
import { VoteSettingOption } from '../../config/constants';

/* -------------------------------------------------------------------------- */
/*                          Secret Vote Embeds                                */
/* -------------------------------------------------------------------------- */
export function buildSecretStartEmbed(
  voteId: string,
  question: string,
  mentions: string
): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle(`${EMOJI_SPY} Secret Vote ${EMOJI_SPY}`)
    .addFields(
      { name: `${EMOJI_QUESTION} Question`,   value: question },
      { name: `${EMOJI_ID} Vote ID`,           value: voteId   },
    )
    .setDescription(`${EMOJI_PARTICIPANTS} Participants: ${mentions}`)
    .setTimestamp();
}

export function buildSecretDmEmbed(
  voteId: string,
  question: string
): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle(`${EMOJI_SPY} Secret Vote ${EMOJI_SPY}`)
    .addFields(
      { name: `${EMOJI_QUESTION} Question`, value: question },
      { name: `${EMOJI_ID} Vote ID`,       value: voteId   },
    )
    .setTimestamp();
}

export function buildSecretResultEmbed(
  voteId: string,
  mentions: string,
  votes: { yes: number; no: number }
): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle(`${EMOJI_SPY} Secret Vote Results ${EMOJI_SPY}`)
    .addFields(
      { name: `${EMOJI_ID} Vote ID`,               value: voteId },
      { name: `${EMOJI_PARTICIPANTS} Participants`, value: mentions },
      {
        name: `${EMOJI_RESULTS} Results`,
        value: `${EMOJI_YES} Yes: ${votes.yes}\n${EMOJI_NO} No: ${votes.no}`,
      }
    )
    .setTimestamp();
}

/* -------------------------------------------------------------------------- */
/*                         YES / NO button row                                */
/* -------------------------------------------------------------------------- */
export function createYesNoRow(): ActionRowBuilder<ButtonBuilder> {
  const yesBtn = new ButtonBuilder()
    .setCustomId('yes')
    .setLabel('Yes')
    .setEmoji(EMOJI_YES)
    .setStyle(ButtonStyle.Secondary);
  const noBtn = new ButtonBuilder()
    .setCustomId('no')
    .setLabel('No')
    .setEmoji(EMOJI_NO)
    .setStyle(ButtonStyle.Secondary);
  return new ActionRowBuilder<ButtonBuilder>().addComponents(yesBtn, noBtn);
}

/* -------------------------------------------------------------------------- */
/*                          Shared Poll Embed                                 */
/* -------------------------------------------------------------------------- */
export function buildCategoryPollEmbed(
  category: string,
  opts: VoteSettingOption[]
): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle(category)
    .setDescription(opts.map(o => `${o.emoji} ${o.label}`).join('\n'))
    .setTimestamp();
}

/* -------------------------------------------------------------------------- */
/*                          Button rows for category                           */
/* -------------------------------------------------------------------------- */
export function buildCategoryButtons(
  category: string,
  opts: VoteSettingOption[]
): ActionRowBuilder<ButtonBuilder>[] {
  const MAX_PER_ROW = 4;
  const rows: ActionRowBuilder<ButtonBuilder>[] = [];
  let row = new ActionRowBuilder<ButtonBuilder>();

  opts.forEach((opt, i) => {
    if (i % MAX_PER_ROW === 0) {
      row = new ActionRowBuilder<ButtonBuilder>();
      rows.push(row);
    }
    row.addComponents(
      new ButtonBuilder()
        .setCustomId(`${category}|${opt.label}`)
        .setLabel(opt.label)
        .setEmoji(opt.emoji)
        .setStyle(ButtonStyle.Secondary)
    );
  });

  return rows;
}

/* -------------------------------------------------------------------------- */
/*                          Civ VII Draft Embed                               */
/* -------------------------------------------------------------------------- */
export function buildCiv7MasterEmbed(
  voteId: string,
  mentions: string,
  startingAge: string
): EmbedBuilder {
  const mins = VOTE_TIMER_DRAFT / 1000 / 60;
  const embed = new EmbedBuilder()
    .setTitle('🗳️ Civ VII Draft Vote 🗳️')
    .setDescription(`You have **${mins} minutes** to vote before it times out.`)
    .addFields(
      { name: 'Starting Age', value: `**${startingAge}**`, inline: false },
      { name: 'Players',      value: mentions,               inline: false },
      { name: 'Vote ID',      value: voteId,                 inline: false }
    )
    .setFooter({ text: `Need ≥50% to win; otherwise highest vote wins • ${mins}m total` })
    .setTimestamp();

  for (const category of Object.keys(CIV7_VOTE_SETTINGS)) {
    embed.addFields({ name: category, value: '—', inline: true });
  }
  embed.addFields({ name: 'Leader Bans', value: '—', inline: false });

  return embed;
}

/* -------------------------------------------------------------------------- */
/*                          Civ VI Draft Embed                                */
/* -------------------------------------------------------------------------- */
export function buildCiv6MasterEmbed(
  voteId: string,
  mentions: string
): EmbedBuilder {
  const mins = VOTE_TIMER_DRAFT / 1000 / 60;
  const embed = new EmbedBuilder()
    .setTitle('🗳️ Civ VI Draft Vote 🗳️')
    .setDescription(`You have **${mins} minutes** to vote before it times out.`)
    .addFields(
      { name: 'Players', value: mentions, inline: false },
      { name: 'Vote ID', value: voteId,    inline: false }
    )
    .setFooter({ text: `Need ≥50% to win; otherwise highest vote wins • ${mins}m total` })
    .setTimestamp();

  for (const category of Object.keys(CIV6_VOTE_SETTINGS)) {
    embed.addFields({ name: category, value: '—', inline: true });
  }

  return embed;
}
