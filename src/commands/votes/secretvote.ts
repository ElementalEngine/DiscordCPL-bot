import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import SecretVoteService from '../../services/votes/secret-vote.service';
import { addMentionOptions, ensureChannel, ensurePermissions } from '../../utils';
import { config } from '../../config';

const dataBuilder = new SlashCommandBuilder();

dataBuilder.setName('secretvote');
dataBuilder.setDescription('Initiate a secret Yes/No vote among participants');

dataBuilder.addStringOption(option =>
  option
    .setName('type')
    .setDescription('Vote category: cc, scrap, irrel, remap')
    .setRequired(true)
    .addChoices(
      { name: 'CC', value: 'cc' },
      { name: 'Scrap', value: 'scrap' },
      { name: 'Irrel', value: 'irrel' },
      { name: 'Remap', value: 'remap' }
    )
);

dataBuilder.addStringOption(option =>
  option
    .setName('vote-question')
    .setDescription('Additional vote parameters')
    .setRequired(true)
);

addMentionOptions(dataBuilder);

export const data = dataBuilder;

export async function execute(interaction: ChatInputCommandInteraction) {
  const allowedChannels = [
    config.discord.channels.civ7commands,
    config.discord.channels.civ6commands
  ];

  if (
    !ensureChannel(interaction, allowedChannels) ||
    !ensurePermissions(interaction, [config.discord.roles.Civ7Rank])
  ) {
    return;
  }

  const service = new SecretVoteService(interaction.client);
  await service.secretVote(interaction);
}
