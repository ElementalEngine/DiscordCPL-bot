import { DataTypes } from '@odyssoft/tsorm'

import { CiscoBotSchema } from '../schema'

export interface IMatch {
  id: number
  validation_message_id?: number
  gametype: string
  status?: 'validated' | 'waiting'
  createdAt?: string
  updatedAt?: string
}

export const Match = CiscoBotSchema.createModel<IMatch>('match', {
  id: {
    type: DataTypes.integer,
    autoIncrement: true,
    primaryKey: true,
  },
  gametype: {
    type: DataTypes.varchar(16),
    required: true,
  },
  status: {
    type: DataTypes.enum(['validated', 'waiting']),
  },
  validation_message_id: {
    type: DataTypes.integer,
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
