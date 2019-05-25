import { teamRoutes } from './teams'
import { userRoutes } from './users'
import { Router } from "express";

const router = Router();

router.use('/teams', teamRoutes);
router.use('/users', userRoutes);

module.exports = router;
