import { Schema, model, Document } from 'mongoose';
import { Edition, EDITIONS } from './edition.model';
import { GameType, GAMETYPES } from './gameType.model';

export interface ISeasonStats extends Document {
  _id: number;
  edition: Edition;
  gameType: GameType;
  games: number;
  wins: number;
  first: number;
  subbedIn: number;
  subbedOut: number;
  mu: number;
  sigma: number;
  lastModified: Date;
}

const seasonStatsSchema = new Schema<ISeasonStats>(
  {
    _id:         { type: Number,   required: true },
    edition:     { type: String,   enum: EDITIONS,    required: true },
    gameType:    { type: String,   enum: GAMETYPES,   required: true },
    games:       { type: Number,   default: 0 },
    wins:        { type: Number,   default: 0 },
    first:       { type: Number,   default: 0 },
    subbedIn:    { type: Number,   default: 0 },
    subbedOut:   { type: Number,   default: 0 },
    mu:          { type: Number,   default: 1250 },
    sigma:       { type: Number,   default: 150 },
    lastModified:{ type: Date,     default: Date.now },
  },
  { collection: 'seasonStats' }
);
seasonStatsSchema.index({ edition: 1, gameType: 1, games: -1 });
export const SeasonStatsModel = model<ISeasonStats>('SeasonStats', seasonStatsSchema);