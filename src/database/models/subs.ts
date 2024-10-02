import { DataTypes } from '@odyssoft/tsorm'

import { CiscoBotSchema } from '../schema'

export interface ISubs {
  id: number
  count: number
}

export const Subs = CiscoBotSchema.createModel<ISubs>('subs', {
  id: {
    type: DataTypes.integer,
    primaryKey: true,
    required: true,
  },
  count: {
    type: DataTypes.integer,
    required: true,
  },
})
