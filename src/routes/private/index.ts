import { teamRoutes } from './teams'
import { Router } from "express";

const router = Router();

router.use('/teams', teamRoutes);

module.exports = router;
