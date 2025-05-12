import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { ensureChannel, ensurePermissions } from '../../services/commandGuards.service';
import { config } from '../../config';
import { addOptionalMentions } from '../../utils';
import { VoteService } from '../../services/vote.service';

export const data = addOptionalMentions(
  new SlashCommandBuilder()
    .setName('civ7draft')
    .setDescription('Initiate a Civ7 draft vote')
    .addStringOption(option =>
      option
        .setName('gamemode')
        .setDescription('Select game mode: FFA or Team')
        .setRequired(true)
        .addChoices(
          { name: 'ffa',   value: 'ffa'   },
          { name: 'team',  value: 'team'  }
        )
    )
    .addStringOption(option =>
      option
        .setName('startingage')
        .setDescription('Select starting age')
        .setRequired(true)
        .addChoices(
          { name: 'Antiquity',  value: 'Antiquity_Age'   },
          { name: 'Exploration', value: 'Exploration_Age' },
          { name: 'Modern',      value: 'Modern_Age'      }
        )
    ) as SlashCommandBuilder
);

export async function execute(interaction: ChatInputCommandInteraction) {
  const gamemode = interaction.options.getString('gamemode', true);
  const allowedChannelId =
    gamemode === 'ffa'
      ? config.discord.channels.civ7ffavoting
      : config.discord.channels.civ7teamvoting;

  if (!ensureChannel(interaction, [allowedChannelId])) return;
  if (!ensurePermissions(interaction, [config.discord.roles.Civ7Rank])) return;

  await VoteService.civ7Draft(interaction);
}
