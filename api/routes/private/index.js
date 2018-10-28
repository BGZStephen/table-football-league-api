const express = require('express');
const rest = require('api/utils/rest')
const authentication = require('./authentication');
const fixtureRoutes = require('./fixtures').router;
const leagueRoutes = require('./leagues').router;
const userRoutes = require('./users').router;
const teamRoutes = require('./teams').router;
const playerRoutes = require('./players').router;
const router = express.Router();

router.all('/*', rest.asyncwrap(authentication.validateUser), rest.asyncwrap(authentication.loadUser))
router.use('/users', userRoutes);
router.use('/players', playerRoutes);
router.use('/teams', teamRoutes);
router.use('/fixtures', fixtureRoutes);
router.use('/leagues', leagueRoutes);

module.exports = router;
