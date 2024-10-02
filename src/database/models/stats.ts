import { DataTypes } from '@odyssoft/tsorm'

import { config } from '../../config'
import { CiscoBotSchema } from '../schema'

export interface IStats {
  player: number
  gametype: 'FFA' | 'PBC' | 'Teamer'
  mu: number
  sigma: number
  games: number
  wins: number
  first: number
  subbedIn: number
  subbedOut: number
  createdAt?: string
  updatedAt?: string
}

export const statsObject = {
  player: {
    type: DataTypes.integer,
    primaryKey: true,
    required: true,
  },
  gametype: {
    type: DataTypes.varchar(16),
    primaryKey: true,
    required: true,
  },
  first: {
    type: DataTypes.integer,
    default: 0,
  },
  games: {
    type: DataTypes.integer,
    default: 0,
  },
  subbedIn: {
    type: DataTypes.integer,
    default: 0,
  },
  subbedOut: {
    type: DataTypes.integer,
    default: 0,
  },
  wins: {
    type: DataTypes.integer,
    default: 0,
  },
  mu: {
    type: DataTypes.decimal(30, 20),
    default: config.trueskill.MU,
  },
  sigma: {
    type: DataTypes.decimal(30, 20),
    default: config.trueskill.SIGMA,
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

export const Stats = CiscoBotSchema.createModel<IStats>('stats', statsObject)
