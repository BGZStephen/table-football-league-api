const express = require('express');
const Users = require('./users');
const router = express.Router();

router.get('/users', Users.getAll);
router.get('/users/:id', Users.getOne);
router.post('/users', Users.create);
router.post('/users/authenticate', Users.authenticate);

router.post('/leagues', Leagues.create);

module.exports = router;
