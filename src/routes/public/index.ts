import { userRoutes } from './users'
import { Router } from "express";
import * as middleware from './middleware';
import { asyncwrap } from '../../utils/rest';

const router = Router();

router.all('*', asyncwrap(middleware.setUserContext));
router.use('/users', userRoutes);

module.exports = router;
