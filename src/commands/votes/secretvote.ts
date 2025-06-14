import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import SecretVoteService from '../../services/secret-vote.service';
import { addMentionOptions, ensureChannel, ensurePermissions } from '../../utils';
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
  const allowedChannels = [
    config.discord.channels.civ7commands,
    config.discord.channels.civ6commands
  ];

  if (
    !ensureChannel(interaction, allowedChannels) ||
    !ensurePermissions(interaction, [config.discord.roles.Civ7Rank, config.discord.roles.Civ6Rank])
  ) {
    return;
  }

  const service = new SecretVoteService(interaction.client);
  await service.secretVote(interaction);
}
