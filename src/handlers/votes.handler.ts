import { ChatInputCommandInteraction } from 'discord.js';
import { VotesController }            from '../controllers/votes.controller';

export async function handleVoteInteraction(interaction: ChatInputCommandInteraction) {
  const sub = interaction.options.getSubcommand(true);
  switch (sub) {
    case 'civ7':
      return VotesController.startCiv7Draft(interaction);
    case 'secret':
      return VotesController.startSecretVote(interaction);
    // case 'civ6':
    //   return VotesController.startCiv6Draft(interaction);
    default:
      return interaction.reply({
        content: '❌ Unknown vote type.',
        ephemeral: true,
      });
  }
}
