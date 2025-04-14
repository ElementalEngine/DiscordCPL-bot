import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { VoteController } from '../../controllers';
import { addOptionalMentions } from '../../utils';

export const data = addOptionalMentions(
  new SlashCommandBuilder()
    .setName('civ7draft')
    .setDescription('Initiate a Civ7 draft vote')
    .addStringOption((option) =>
      option
        .setName('gamemode')
        .setDescription('Select game mode: FFA or Team')
        .setRequired(true)
        .addChoices(
          { name: 'ffa', value: 'ffa' },
          { name: 'team', value: 'team' }
        )
    )
    .addStringOption((option) =>
      option
        .setName('startingage')
        .setDescription('Select starting age (antiquity, exploration, modern)')
        .setRequired(true)
        .addChoices(
          { name: 'antiquity', value: 'Antiquity_Age' },
          { name: 'exploration', value: 'Exploration_Age' },
          { name: 'modern', value: 'Modern_Age' }
        )
    )
    .addStringOption((option) =>
      option
        .setName('params')
        .setDescription('Optional parameters (e.g., member exclusions)')
        .setRequired(false)
    ) as SlashCommandBuilder
);

export const execute = async (interaction: ChatInputCommandInteraction) => {
  await VoteController.civilization7DraftVote(interaction);
};
