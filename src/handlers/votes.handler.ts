import { ChatInputCommandInteraction } from 'discord.js';
import { VotesController }             from '../controllers/voting.controller';

export async function handleVoteInteraction(interaction: ChatInputCommandInteraction) {
  switch (interaction.commandName) {
    case 'civ6draft':
      return VotesController.startCiv6Vote(interaction);

    case 'civ7-vote':
      return VotesController.startCiv7Vote(interaction);

    case 'secret':
    case 'secret-vote':
      return VotesController.startSecretVote(interaction);

    default:
      return interaction.reply({
        content: '❌ Unknown vote type.',
        ephemeral: true
      });
  }
}