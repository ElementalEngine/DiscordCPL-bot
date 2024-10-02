import { DataTypes } from '@odyssoft/tsorm'

import { config } from '../../config'
import { CiscoBotSchema } from '../schema'
import { IStats, statsObject } from './stats'

export const CurrentSeason = CiscoBotSchema.createModel<IStats>(
  'current_season',
  statsObject
)
