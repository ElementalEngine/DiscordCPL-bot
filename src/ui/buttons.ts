import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from 'discord.js';

export type ButtonRow = ActionRowBuilder<ButtonBuilder>;
export type SelectRow = ActionRowBuilder<StringSelectMenuBuilder>;

export function createYesNoRow(prefix: string, includeEmoji = true, disabled = false): ButtonRow {
  const yesLabel = includeEmoji ? '✅ Yes' : 'Yes';
  const noLabel = includeEmoji ? '❌ No' : 'No';

  const yesBtn = new ButtonBuilder()
    .setCustomId(`${prefix}_yes`)
    .setLabel(yesLabel)
    .setStyle(ButtonStyle.Success)
    .setDisabled(disabled);

  const noBtn = new ButtonBuilder()
    .setCustomId(`${prefix}_no`)
    .setLabel(noLabel)
    .setStyle(ButtonStyle.Danger)
    .setDisabled(disabled);

  return new ActionRowBuilder<ButtonBuilder>().addComponents(yesBtn, noBtn);
}

export function createConfirmCancelRow(
  prefix: string,
  includeEmoji = true,
  disabled = false
): ButtonRow {
  const confirmLabel = includeEmoji ? '✔️ Confirm' : 'Confirm';
  const cancelLabel = includeEmoji ? '❌ Cancel' : 'Cancel';

  const confirmBtn = new ButtonBuilder()
    .setCustomId(`${prefix}_confirm`)
    .setLabel(confirmLabel)
    .setStyle(ButtonStyle.Primary)
    .setDisabled(disabled);

  const cancelBtn = new ButtonBuilder()
    .setCustomId(`${prefix}_cancel`)
    .setLabel(cancelLabel)
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(disabled);

  return new ActionRowBuilder<ButtonBuilder>().addComponents(confirmBtn, cancelBtn);
}

export function createPaginationRow(
  prefix: string,
  disablePrev = false,
  disableNext = false
): ButtonRow {
  const prevBtn = new ButtonBuilder()
    .setCustomId(`${prefix}_prev`)
    .setLabel('◀️ Previous')
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(disablePrev);

  const nextBtn = new ButtonBuilder()
    .setCustomId(`${prefix}_next`)
    .setLabel('Next ▶️')
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(disableNext);

  return new ActionRowBuilder<ButtonBuilder>().addComponents(prevBtn, nextBtn);
}

export function createSelectMenu(
  customId: string,
  placeholder: string,
  choices: Array<{ label: string; value: string; description?: string; emoji?: string }>,
  minValues = 1,
  maxValues = 1,
  disabled = false
): SelectRow {
  const menu = new StringSelectMenuBuilder()
    .setCustomId(customId)
    .setPlaceholder(placeholder)
    .setMinValues(minValues)
    .setMaxValues(maxValues)
    .setDisabled(disabled);

  for (const opt of choices) {
    const option = new StringSelectMenuOptionBuilder()
      .setLabel(opt.label)
      .setValue(opt.value);
    if (opt.description) option.setDescription(opt.description);
    if (opt.emoji) option.setEmoji(opt.emoji);
    menu.addOptions(option);
  }

  return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu);
}
