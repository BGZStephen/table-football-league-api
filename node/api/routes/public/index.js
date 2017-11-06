const express = require('express');
const Users = require('./users');
const Leagues = require('./leagues');
const router = express.Router();

router.get('/users', Users.getAll);
router.get('/users/:id', Users.getOne);
router.post('/users', Users.create);
router.post('/users/authenticate', Users.authenticate);

router.get('/leagues', Leagues.getAll);
router.post('/leagues', Leagues.create);
router.all('/leagues/:id', Leagues.fetchLeague)
router.get('/leagues/:id', Leagues.getOne);

module.exports = router;
