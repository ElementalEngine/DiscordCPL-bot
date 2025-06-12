import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { config } from '../../config';
import { addMentionOptions, ensureChannel, ensurePermissions } from '../../utils';
// import Civ7DraftService from '../../services/voting.service';

const builder = new SlashCommandBuilder()
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
        { name: 'Antiquity',   value: 'Antiquity_Age'    },
        { name: 'Exploration', value: 'Exploration_Age'  },
        { name: 'Modern',      value: 'Modern_Age'       }
      )
  );

addMentionOptions(builder as SlashCommandBuilder);

export const data = builder as SlashCommandBuilder;

export async function execute(interaction: ChatInputCommandInteraction) {
  const allowedChannels = [
    config.discord.channels.civ7ffavoting,
    config.discord.channels.civ7teamvoting
  ];

  if (
    !ensureChannel(interaction, allowedChannels) ||
    !ensurePermissions(interaction, [config.discord.roles.Civ7Rank, config.discord.roles.Civ6Rank])
  ) {
    return;
  }

  // await new Civ7DraftService(interaction.client).civ7Draft(interaction);
}
