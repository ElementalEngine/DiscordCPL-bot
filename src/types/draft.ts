export type GameType = 'civ6' | 'civ7';

export interface Civ {
  civ: string;
  emoji_ID: string;
  age_pool: 'Antiquity_Age' | 'Exploration_Age' | 'Modern_Age';
}

export interface Leader {
  leader: string;
  emoji_ID: string;
  Category?: string;
}

export interface DraftPick {
  name: string;
  emoji_ID: string;
}