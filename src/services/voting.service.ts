import {
  ChatInputCommandInteraction,
  GuildMember,
  TextChannel,
  MessageReaction,
  Client,
  Message
} from 'discord.js';

import {
  VoteSettings,
  VoteOption,
  ActiveVoteSession,
  VoteResult
} from '..//types/common.types';

import {
  parseVoteOptions,
  getMajorityThreshold,
  hasMajority,
  countValidVotes,
  pickVoteWinner
} from '../utils/voting';

export class VotingService {
  private activeSessions: Map<string, ActiveVoteSession> = new Map();

  async startVote(
    channel: TextChannel,
    members: GuildMember[],
    rawOptions: [string, string][],
    settings: VoteSettings,
    client: Client
  ): Promise<VoteResult> {
    const voteOptions = parseVoteOptions(rawOptions);
    const message = await channel.send({
      content: `Voting started. React to vote!`,
    });

    for (const option of voteOptions) {
      await message.react(option.emoji);
    }

    const session: ActiveVoteSession = {
      messageId: message.id,
      options: voteOptions,
      voters: members.map(m => m.id),
      startedAt: Date.now(),
      endsAt: Date.now() + (settings.timeoutMs ?? 120000),
      isSecret: settings.secret ?? false
    };

    this.activeSessions.set(message.id, session);

    await this.waitForVotes(client, message, session);

    const tally = await this.tallyVotes(message, session);
    const winner = pickVoteWinner(tally);

    return { winner, tally };
  }

  private async waitForVotes(client: Client, message: Message, session: ActiveVoteSession): Promise<void> {
    return new Promise(resolve => {
      const timeout = session.endsAt - Date.now();
      setTimeout(() => resolve(), timeout);
    });
  }

  private async tallyVotes(message: Message, session: ActiveVoteSession): Promise<Record<string, number>> {
    const tally: Record<string, number> = {};

    for (const option of session.options) {
      const reaction = message.reactions.resolve(option.emoji);
      if (!reaction) continue;
      const count = await countValidVotes(reaction, session.voters);
      tally[option.label] = count;
    }

    return tally;
  }
}
