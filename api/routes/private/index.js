const express = require('express');
const rest = require('api/utils/rest')
const authentication = require('./authentication');
const fixtures = require('./fixtures');
const leagues = require('./leagues');
// const Users = require('./users');
const teams = require('./teams');
const players = require('./players');
const router = express.Router();


router.all('/*', rest.asyncwrap(authentication.validateUser), rest.asyncwrap(authentication.loadUser))
// router.get('/users/search', Users.search);
// router.get('/users/:id', Users.getOne);
// router.put('/users/:id', Users.updateOne);

router.post('/players', rest.asyncwrap(players.create));
router.get('/players/search', rest.asyncwrap(players.search));
router.all('/players/:id*', players.load);
router.get('/players/:id', players.getOne);
router.put('/players/:id', rest.asyncwrap(players.updateOne));

router.post('/leagues', rest.asyncwrap(leagues.create));
router.get('/leagues/search', rest.asyncwrap(leagues.search));
// router.get('/leagues/:id', Leagues.getOne);
// router.put('/leagues/:id', Leagues.updateOne);

router.post('/teams', rest.asyncwrap(teams.create));
router.get('/teams/search', rest.asyncwrap(teams.search));
router.all('/teams/:id*', rest.asyncwrap(teams.load));
router.get('/teams/:id', teams.getOne);
router.put('/teams/:id', rest.asyncwrap(teams.updateOne));

router.post('/fixtures', rest.asyncwrap(fixtures.create));
router.get('/fixtures/search', rest.asyncwrap(fixtures.get));
router.all('/fixtures/:id*', rest.asyncwrap(fixtures.load));
router.get('/fixtures/:id', fixtures.getOne);
router.put('/fixtures/:id', rest.asyncwrap(fixtures.updateOne));

module.exports = router;
