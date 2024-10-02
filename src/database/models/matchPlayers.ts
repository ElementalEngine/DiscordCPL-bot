import { DataTypes } from '@odyssoft/tsorm'

import { CiscoBotSchema } from '../schema'

export interface IMatchPlayer {
  match: number
  player: number
  leader: string
  position: number
  createdAt?: string
  updatedAt?: string
}

export const MatchPlayers = CiscoBotSchema.createModel<IMatchPlayer>(
  'matchplayers',
  {
    match: {
      type: DataTypes.integer,
      primaryKey: true,
    },
    player: {
      type: DataTypes.integer,
      primaryKey: true,
    },
    leader: {
      type: DataTypes.varchar(255),
      required: true,
    },
    position: {
      type: DataTypes.integer,
      required: true,
    },
    createdAt: {
      type: DataTypes.datetime,
      default: 'CURRENT_TIMESTAMP',
    },
    updatedAt: {
      type: DataTypes.datetime,
      default: 'CURRENT_TIMESTAMP',
    },
  }
)
