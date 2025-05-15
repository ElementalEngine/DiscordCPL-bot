import { Client, TextChannel, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, ButtonInteraction } from 'discord.js';
import { VOTE_TIMER_DRAFT, EMOJI_RESULTS } from '../../config/constants';
import { VoteSettingOption } from '../../config/constants';

export default abstract class BaseVoteService {
  protected client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  protected async collectCategoryVotes(
    channel: TextChannel,
    categories: Record<string, VoteSettingOption[]>,
    timer: number = VOTE_TIMER_DRAFT
  ): Promise<Record<string, Record<string, number>>> {
    const allResults: Record<string, Record<string, number>> = {};

    for (const [category, options] of Object.entries(categories)) {
      const rows = [] as ActionRowBuilder<ButtonBuilder>[];
      for (let i = 0; i < options.length; i += 5) {
        const row = new ActionRowBuilder<ButtonBuilder>();
        options.slice(i, i + 5).forEach(opt => {
          row.addComponents(
            new ButtonBuilder()
              .setCustomId(`vote_${category}_${opt.label}`)
              .setEmoji(opt.emoji)
              .setLabel(opt.label)
              .setStyle(ButtonStyle.Primary)
          );
        });
        rows.push(row);
      }

      const prompt = await channel.send({
        content: `📊 Vote for **${category}**:`,
        components: rows
      });

      const tally: Record<string, number> = {};
      options.forEach(o => { tally[o.label] = 0; });
      const collector = prompt.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: timer
      });

      collector.on('collect', async (interaction: ButtonInteraction) => {
        const label = interaction.customId.split(`vote_${category}_`)[1];
        if (tally[label] !== undefined) {
          tally[label]++;
          await interaction.reply({
            content: `Your vote for **${category}**: **${label}**`,
            ephemeral: true
          });
        }
      });

      await new Promise<void>(resolve => collector.on('end', () => resolve()));

      await channel.send(
        `${EMOJI_RESULTS} Results for **${category}**: ` +
        Object.entries(tally)
          .map(([opt, count]) => `\`${opt}\`: **${count}**`)
          .join(', ')
      );

      allResults[category] = tally;
    }

    return allResults;
  }

  protected async collectBanVotes(
    channel: TextChannel,
    items: string[],
    timer: number = VOTE_TIMER_DRAFT
  ): Promise<string[]> {
    return [];
  }
}
