import { Router } from 'express';
import { LobbyLinksController } from '../controllers/lobby-links.controller';

const router = Router();

router.get('/:game/:player/:session', LobbyLinksController.join);

export default router;