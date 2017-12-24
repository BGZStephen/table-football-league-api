const express = require('express');
const Middleware = require('../middleware');
const Users = require('./users');
const Teams = require('./teams');
const Leagues = require('./leagues');
const Fixtures = require('./fixtures');

const router = express.Router();

router.all('/*', Middleware.authorizeAdminRoute);
router.get('/users', Users.getAll);
router.all('/users/:id*', Middleware.fetchResource);
router.get('/users/:id', Users.getOne);
router.put('/users/:id', Users.updateOne);
router.delete('/users/:id', Users.deleteOne);
router.post('/users/authenticate', Users.authenticateAdminUser);

router.get('/teams', Teams.getAll);

router.get('/leagues', Leagues.getAll);

router.get('/fixtures', Fixtures.getAll);

module.exports = router;
