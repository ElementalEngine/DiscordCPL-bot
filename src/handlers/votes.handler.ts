import { ChatInputCommandInteraction } from 'discord.js';
import { VotesController }             from '../controllers';

export async function handleVoteInteraction(interaction: ChatInputCommandInteraction) {
  const sub = interaction.options.getSubcommand(true);
  switch (sub) {
    case 'civ7':
      return VotesController.startCiv7Draft(interaction);
    case 'secret':
      return VotesController.startSecretVote(interaction);
    default:
      return interaction.reply({ content: '❌ Unknown vote type.', ephemeral: true });
  }
}
