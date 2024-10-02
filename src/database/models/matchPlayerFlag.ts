import { DataTypes } from '@odyssoft/tsorm'

import { CiscoBotSchema } from '../schema'

export interface IMatchPlayerFlag {
  match: number
  player: number
  flag: string
  createdAt?: string
  updatedAt?: string
}

export const MatchPlayerFlags = CiscoBotSchema.createModel<IMatchPlayerFlag>(
  'matchplayerflags',
  {
    match: {
      type: DataTypes.integer,
      primaryKey: true,
    },
    player: {
      type: DataTypes.integer,
      primaryKey: true,
    },
    flag: {
      type: DataTypes.varchar(255),
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
