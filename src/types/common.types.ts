export type UnixSeconds = number;

export type SnowflakeString = string;

export type GameType = 'civ6' | 'civ7';


export interface VoteOption {
  emoji: string;
  label: string;
}

export interface VoteSettings {
  options: VoteOption[];
  timeoutMs?: number;
  /** Maximum votes allowed per user. Defaults to 1 */
  maxVotesPerUser?: number;
  /** Skip tie break and return all winners */
  skipTieBreak?: boolean;
  secret?: boolean;
}

export interface VoteResult {
  winner: string;
  tally: Record<string, number>;
}

export interface ActiveVoteSession {
  messageId: string;
  options: VoteOption[];
  voters: string[];
  startedAt: number;
  endsAt: number;
  isSecret: boolean;
}