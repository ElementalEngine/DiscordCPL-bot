//  Civs from stats table
import { DataTypes } from '@odyssoft/tsorm'

import { config } from '../../config'
import { CiscoBotSchema } from '../schema'

export interface IPlayerciv {
  player: number
  civ: number
  count: number
  createdAt?: string
  updatedAt?: string
}

export const Playercivs = CiscoBotSchema.createModel<IPlayerciv>('playercivs', {
  player: {
    type: DataTypes.integer,
    primaryKey: true,
    required: true,
  },
  civ: {
    type: DataTypes.integer,
    primaryKey: true,
    required: true,
  },
  count: {
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
})
