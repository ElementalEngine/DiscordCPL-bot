import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import SecretVoteService from '../../services/secret-vote.service';
import { config } from '../../config';

const builder = new SlashCommandBuilder()
  .setName('secretvote')
  .setDescription('Initiate a secret vote')
  .addStringOption(option =>
    option
      .setName('type')
      .setDescription('Choose vote type: cc, scrap, irrel, remap')
      .setRequired(true)
      .addChoices(
        { name: 'CC', value: 'cc' },
        { name: 'Scrap', value: 'scrap' },
        { name: 'Irrel', value: 'irrel' },
        { name: 'Remap', value: 'remap' }
      )
  )
  .addStringOption(option =>
    option
      .setName('question')
      .setDescription('The question to vote on')
      .setRequired(true)
  );

addMentionOptions(builder as SlashCommandBuilder);

export const data = builder as SlashCommandBuilder;

export async function execute(interaction: ChatInputCommandInteraction) {
  const service = new SecretVoteService(interaction.client);
  await service.secretVote(interaction);
}
