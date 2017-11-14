const express = require('express');
const Users = require('./users');
const Leagues = require('./leagues');
const Middleware = require('../middleware');
const router = express.Router();

router.get('/users', Users.getAll);
router.post('/users', Users.create);
router.post('/users/authenticate', Users.authenticate);
router.all('/users/:id', Middleware.fetchResource)
router.get('/users/:id', Users.getOne);

router.get('/leagues', Leagues.getAll);
router.post('/leagues', Leagues.create);
router.all('/leagues/:id', Middleware.fetchResource)
router.get('/leagues/:id', Leagues.getOne);

module.exports = router;
