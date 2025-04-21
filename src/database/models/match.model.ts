import { Schema, model, Document } from 'mongoose';

export interface IMatch extends Document {
  _id: number;
  validationMsgId?: number;
  players: { id: number; [key: string]: any }[];
  timestamp: Date;
  [key: string]: any;
}

const matchSchema = new Schema<IMatch>({
  _id:             { type: Number, required: true },
  validationMsgId: { type: Number },
  players:         { type: Array, default: [] },
  timestamp:       { type: Date, default: Date.now },
}, { strict: false });

export const WaitingMatchModel = model<IMatch>('WaitingMatch', matchSchema, 'matchs_waiting');
export const ValidatedMatchModel = model<IMatch>('ValidatedMatch', matchSchema, 'matchs_validated');