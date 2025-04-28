import { Router } from 'express';
import { LobbyLinksController } from '../controllers/lobbyLinks.controller';

const router = Router();

router.get('/:game/:player/:session', LobbyLinksController.join);

export default router;