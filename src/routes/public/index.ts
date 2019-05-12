import { userRoutes } from './users'
import { Router } from "express";

const router = Router();

router.use('/users', userRoutes);

module.exports = router;
