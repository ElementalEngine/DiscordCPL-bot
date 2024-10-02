import { Router } from 'express'

import { AuthController } from '../controllers'
import JoinRoutes from './join'

const router = Router()

const Routes = () => {
  router.get(
    '/',
    AuthController.Validate,
    AuthController.FetchDiscord,
    AuthController.FetchDiscordConnections,
    AuthController.ValidateSteam,
    AuthController.RegisterUser
  )

  router.use('/join', JoinRoutes())

  return router
}

export default Routes
