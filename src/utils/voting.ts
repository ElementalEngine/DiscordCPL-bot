import { MessageReaction } from 'discord.js';
import {
  VoteOption,
  VoteResult
} from '../types/common.types';

export function parseVoteOptions(raw: [string, string][]): VoteOption[] {
  return raw.map(([emoji, label]) => ({ emoji, label }));
}

export function getMajorityThreshold(voterCount: number): number {
  return Math.floor(voterCount / 2) + 1;
}

export function hasMajority(tally: Record<string, number>, totalVoters: number): boolean {
  const threshold = getMajorityThreshold(totalVoters);
  return Object.values(tally).some(count => count >= threshold);
}

export async function countValidVotes(
  reaction: MessageReaction,
  validVoterIds: string[]
): Promise<number> {
  const users = await reaction.users.fetch();
  return users.filter(u => validVoterIds.includes(u.id) && !u.bot).size;
}

export function pickVoteWinner(tally: Record<string, number>): string {
  const sorted = Object.entries(tally).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] ?? '';
}
