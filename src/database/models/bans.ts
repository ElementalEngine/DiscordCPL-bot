import { DataTypes } from '@odyssoft/tsorm'

import { config } from '../../config'
import { CiscoBotSchema } from '../schema'

export interface IBans {
  id: number
  player: number
  ends: string
  type: 'major' | 'minor' | 'moderate' | 'quit'
  tier: number
  createdAt?: string
  updatedAt?: string
}

export const Bans = CiscoBotSchema.createModel<IBans>('bans', {
  id: {
    type: DataTypes.integer,
    primaryKey: true,
    required: true,
  },
  player: {
    type: DataTypes.integer,
    required: true,
  },
  ends: {
    type: DataTypes.datetime,
    required: true,
  },
  type: {
    type: DataTypes.varchar(10),
    required: true,
  },
  tier: {
    type: DataTypes.integer,
    default: 0,
  },
  createdAt: {
    type: DataTypes.datetime,
    default: 'CURRENT_TIMESTAMP',
  },
  updatedAt: {
    type: DataTypes.datetime,
    default: 'CURRENT_TIMESTAMP',
  },
})
