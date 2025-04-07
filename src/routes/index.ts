import { Router } from 'express'

import JoinRoutes from './join'

const router = Router()

const Routes = () => {
  router.use('/join', JoinRoutes())

  return router
}

export default Routes
