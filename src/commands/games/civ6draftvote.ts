import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { VoteController } from '../../controllers';
import { addOptionalMentions } from '../../utils';

export const data = addOptionalMentions(
  new SlashCommandBuilder()
    .setName('civ7draft') 
    .setDescription('Description of your command')
    .addStringOption((option) =>
      option
        .setName('gamemode')
        .setDescription('Select game mode: FFA or Team')
        .setRequired(true)
        .addChoices(
          { name: 'ffa', value: 'ffa' },
          { name: 'team', value: 'team' },
          { name: '2v2', value: '2v2' },
          { name: 'duel', value: 'duel' },
        )
    )
    .addStringOption((option) =>
      option
        .setName('params')
        .setDescription('Optional parameters (e.g., member exclusions or include)')
        .setRequired(false)
    ) as SlashCommandBuilder
);

export const execute = async (interaction: ChatInputCommandInteraction) => {
  await VoteController.civilization6DraftVote(interaction); 
};
