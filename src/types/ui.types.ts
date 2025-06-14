import {
  ActionRowBuilder,
  ButtonBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder,
} from 'discord.js';

export type ButtonRow = ActionRowBuilder<ButtonBuilder>;
export type SelectRow = ActionRowBuilder<StringSelectMenuBuilder>;

export interface PaginationManagerOptions {
  prefix: string;
  embeds: EmbedBuilder[];
  ephemeral?: boolean;
  timeoutMs?: number;
}
