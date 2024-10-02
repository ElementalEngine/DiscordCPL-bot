import { DataTypes } from '@odyssoft/tsorm'

import { CiscoBotSchema } from '../schema'

export interface IPlayer {
  id?: number
  discord?: string
  steam: string
  username: string
  displayname: string
  createdAt?: string
  updatedAt?: string
}

export const Player = CiscoBotSchema.createModel<IPlayer>('player', {
  id: {
    type: DataTypes.integer,
    autoIncrement: true,
    primaryKey: true,
  },
  discord: {
    type: DataTypes.varchar(30),
    unique: true,
  },
  steam: {
    type: DataTypes.varchar(30),
    unique: true,
  },
  username: {
    type: DataTypes.varchar(255),
    required: true,
  },
  displayname: {
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
})
