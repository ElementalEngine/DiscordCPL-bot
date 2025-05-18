import { ChatInputCommandInteraction } from 'discord.js';
import SecretVoteService from '../services/votes/secret-vote.service';
import Civ7DraftService from '../services/votes/civ7-draft.service';

export class VotesController {
  static async startSecretVote(interaction: ChatInputCommandInteraction) {
    const service = new SecretVoteService(interaction.client);
    return service.secretVote(interaction);
  }

  static async startCiv7Draft(interaction: ChatInputCommandInteraction) {
    const service = new Civ7DraftService(interaction.client);
    return service.civ7Draft(interaction);  
  }
}
