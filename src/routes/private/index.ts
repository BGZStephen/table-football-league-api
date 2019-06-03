import { teamRoutes } from './teams'
import { userRoutes } from './users'
import { Router } from "express";
import { gameRoutes } from './games';
import { needsUser } from './middleware';
import { messageRoutes } from './messages';

const router = Router();

router.all('*', needsUser)
router.use('/teams', teamRoutes);
router.use('/users', userRoutes);
router.use('/games', gameRoutes);
router.use('/messages', messageRoutes);

module.exports = router;
