import { ChatInputCommandInteraction }       from 'discord.js';
import { execute as executeCiv6Vote }        from '../commands/votes/civ6-vote';
import { execute as executeCiv7Vote }        from '../commands/votes/civ7-vote';
// import SecretVoteService                    from '../services/secret.vote';

export class VotesController {
  static async startCiv6Vote(interaction: ChatInputCommandInteraction) {
    return executeCiv6Vote(interaction);
  }

  static async startCiv7Vote(interaction: ChatInputCommandInteraction) {
    return executeCiv7Vote(interaction);
  }

  static async startSecretVote(interaction: ChatInputCommandInteraction) {
    // const svc = new SecretVoteService(interaction.client);
    //return svc.secretVote(interaction);
  }
}
