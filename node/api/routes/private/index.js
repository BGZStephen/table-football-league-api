const express = require('express');
const Leagues = require('./leagues');
const Users = require('./users');
const Fixtures = require('./fixtures');
const Middleware = require('../middleware');
const router = express.Router();

router.all('/users/:id', Users.validateUser, Middleware.fetchResource);
router.put('/users/:id', Users.updateOne);
router.delete('/users/:id', Users.deleteOne);

router.all('/leagues/:id', Middleware.fetchResource);
router.delete('/leagues/:id', Leagues.deleteOne);
router.put('/leagues/:id', Leagues.updateOne);

router.post('/fixtures', Fixtures.create);
router.get('/fixtures', Fixtures.getAll);
router.all('/fixtures/:id', Middleware.fetchResource);
router.get('/fixtures/:id', Fixtures.getOne);
router.put('/fixtures/:id', Fixtures.updateOne);
router.delete('/fixtures/:id', Fixtures.deleteOne);

module.exports = router;
