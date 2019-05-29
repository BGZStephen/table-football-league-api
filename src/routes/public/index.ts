import { userRoutes } from './users'
import { Router } from "express";
import { setUserContext } from './middleware';
import { asyncwrap } from '../../utils/rest';

const router = Router();

router.all('*', asyncwrap(setUserContext));
router.use('/users', userRoutes);

module.exports = router;
