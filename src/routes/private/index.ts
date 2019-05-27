import { teamRoutes } from './teams'
import { userRoutes } from './users'
import { Router } from "express";
import { gameRoutes } from './games';

const router = Router();

router.use('/teams', teamRoutes);
router.use('/users', userRoutes);
router.use('/games', gameRoutes);

module.exports = router;
