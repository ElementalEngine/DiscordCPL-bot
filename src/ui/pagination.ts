import {
  ChatInputCommandInteraction,
  ButtonInteraction,
  Interaction,
  Message,
  EmbedBuilder,
} from 'discord.js';
import { createPaginationRow } from './buttons';
import { PaginationManagerOptions } from '../types/ui.types';


export class PaginationManager {
  private currentPage = 0;
  private message!: Message;
  private readonly opts: Required<PaginationManagerOptions>;

  constructor(opts: PaginationManagerOptions) {
    this.opts = {
      prefix: opts.prefix,
      embeds: opts.embeds,
      ephemeral: opts.ephemeral ?? false,
      timeoutMs: opts.timeoutMs ?? 120_000,
    };
  }

  public async send(interaction: ChatInputCommandInteraction) {
    const { prefix, embeds, ephemeral, timeoutMs } = this.opts;
    const row = createPaginationRow(prefix, true, embeds.length <= 1);

    this.message = await interaction.reply({
      embeds: [embeds[0]],
      components: [row],
      ephemeral,
      fetchReply: true,
    });

    const filter = (i: Interaction) =>
      i.isButton() &&
      (i.customId === `${prefix}_prev` || i.customId === `${prefix}_next`) &&
      i.message.id === this.message.id;

    const collector = this.message.createMessageComponentCollector({
      filter,
      time: timeoutMs,
    });

    collector.on('collect', async (btn: ButtonInteraction) => {
      if (btn.customId === `${prefix}_prev`) {
        this.currentPage = Math.max(0, this.currentPage - 1);
      } else {
        this.currentPage = Math.min(embeds.length - 1, this.currentPage + 1);
      }

      const disablePrev = this.currentPage === 0;
      const disableNext = this.currentPage === embeds.length - 1;
      const newRow = createPaginationRow(prefix, disablePrev, disableNext);

      await btn.update({
        embeds: [embeds[this.currentPage]],
        components: [newRow],
      });
    });

    collector.on('end', () => {
      const disabledRow = createPaginationRow(prefix, true, true);
      this.message.edit({ components: [disabledRow] }).catch(() => null);
    });
  }
}
