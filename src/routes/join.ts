import { Router } from 'express'

import { config } from '../config'
import { LobbyLinkController } from '../controllers'

const router = Router()

const JoinRoutes = () => {
  router.get('/:game/:player/:session', LobbyLinkController.join)

  return router
}

export default JoinRoutes
