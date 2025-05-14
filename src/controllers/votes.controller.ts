import { ChatInputCommandInteraction } from 'discord.js';
import { VoteService } from '../services/votes';

export class VotesController {
  static async startCiv7Draft(interaction: ChatInputCommandInteraction) {
    return VoteService.civ7Draft(interaction);
  }

  static async startSecretVote(interaction: ChatInputCommandInteraction) {
    return VoteService.secretVote(interaction);
  }

  // when you add Civ 6 draft support you can uncomment:
  // static async startCiv6Draft(interaction: ChatInputCommandInteraction) {
  //   return VoteService.civ6Draft(interaction);
  // }
}