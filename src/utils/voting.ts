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

// Lock helpers for voting operations

const channelLocks = new Set<string>();
const userLocks = new Set<string>();
let voteInProgress = false;

let setupQueue: Promise<void> = Promise.resolve();

/** Ensure vote setup steps run sequentially. */
export async function withVoteSetupLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = setupQueue.then(fn);
  setupQueue = run.then(
    () => {},
    () => {}
  );
  return run;
}

export function acquireChannelLock(id: string): boolean {
  if (channelLocks.has(id)) return false;
  channelLocks.add(id);
  return true;
}

export function releaseChannelLock(id: string): void {
  channelLocks.delete(id);
}

export function acquireUserLock(id: string): boolean {
  if (userLocks.has(id)) return false;
  userLocks.add(id);
  return true;
}

export function releaseUserLock(id: string): void {
  userLocks.delete(id);
}

export function acquireVoteLock(): boolean {
  if (voteInProgress) return false;
  voteInProgress = true;
  return true;
}

export function releaseVoteLock(): void {
  voteInProgress = false;
}

export function isVoteInProgress(): boolean {
  return voteInProgress;
}
