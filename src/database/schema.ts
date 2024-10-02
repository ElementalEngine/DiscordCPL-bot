import { Schema } from '@odyssoft/tsorm'

import { config } from '../config'

export const CiscoBotSchema = new Schema('ciscobot', config.database)
