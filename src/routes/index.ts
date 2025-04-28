import { Router } from 'express';
import lobbyLinks from './lobbyLinks.routes';


export default function Routes() {
  const router = Router();

  router.use('/lobby', lobbyLinks);

  // …router.use('/other', otherRoutes);

  return router;
}
