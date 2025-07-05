import { ID } from './common';

export interface VoteSettingOption {
  emoji: string;
  label: string;
}

/** All the modes you can draft in */
export enum DraftMode {
  WITH_TRADE  = "With Trade",
  NO_TRADE    = "No Trade",
  BLIND       = "Blind",
  RANDOM      = "Random",
  SNAKE       = "Snake",
  DRAFT_2     = "Draft 2",
}

/** Supported Civilization versions */
export type CivVersion = 'civ6' | 'civ7';

/** Leader definition for Civilization versions */
export interface LeaderConfig {
  version: CivVersion;
  name: string;            // unique identifier
  emojiName: string;
  emojiId: string;
  type: string;
}

/** In-memory leader state per draft session */
export interface SessionLeaderState {
  version: CivVersion;
  banned: Set<string>;
  picked: Set<string>;
}

/** Draft session in memory */
export interface DraftSession {
  players: ID[];                 // Discord user IDs
  pools?: Map<ID, LeaderConfig[]>;
  completed: boolean;
}

/** Vote session in memory */
export interface VoteChoice { userId: ID; choice: string; }
export interface VoteSession {
  eventKey: string;
  options: string[];
  votes: VoteChoice[];
  isActive: boolean;
  totalVoters: ID[];
}

/** Starting age pools for Civ7 drafting */
export type AgePool = 'Antiquity_Age' | 'Exploration_Age' | 'Modern_Age';

/** Civ7 civilization definition with associated age pool */
export interface CivConfig {
  civ: string;
  emojiName: string;
  emojiId: string;
  agePool: AgePool;
}

export { ID };
