import { GameType } from './common.types';

export interface Civ {
  civ: string;
  emojiId: string;             
  agePool: 'Antiquity_Age' | 'Exploration_Age' | 'Modern_Age';
}

export interface Leader {
  leader: string;
  emojiId: string;
  category?: string;            
}

export interface DraftPick {
  name: string;
  emojiId: string;
}
