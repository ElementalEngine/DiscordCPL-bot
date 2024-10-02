import { DataTypes } from '@odyssoft/tsorm'

import { config } from '../../config'
import { CiscoBotSchema } from '../schema'

export interface ICivs {
  id: number
  name: string
  createdAt?: string
  updatedAt?: string
}

export const Civs = CiscoBotSchema.createModel<ICivs>('civs', {
  id: {
    type: DataTypes.integer,
    primaryKey: true,
    required: true,
  },
  name: {
    type: DataTypes.varchar(255),
    required: true,
    unique: true,
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
