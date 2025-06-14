import { ChatInputCommandInteraction } from 'discord.js';
import SecretVoteService from '../services/secret-vote.service';
import DraftService from '../services/draft.service';

export class VotesController {
  static async startSecretVote(interaction: ChatInputCommandInteraction) {
    const service = new SecretVoteService(interaction.client);
    return service.secretVote(interaction);
  }

  static async startCiv7Draft(interaction: ChatInputCommandInteraction) {
    const service = new DraftService(interaction.client);
    return service.startDraft(interaction, 'civ7');
  }
}
