import { userRoutes } from './users'
import { router } from "express";

router.use('/users', userRoutes);

module.exports = router;
