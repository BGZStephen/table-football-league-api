const express = require('express');
const Leagues = require('./leagues');
const Users = require('./users');
const Middleware = require('../middleware');
const router = express.Router();

router.all('/users/:id', Users.validateUser, Middleware.fetchResource);
router.put('/users/:id', Users.updateOne);
router.delete('/users/:id', Users.deleteOne);

router.all('/leagues/:id', Middleware.fetchResource);
router.delete('/leagues/:id', Leagues.deleteOne);
router.put('/leagues/:id', Leagues.updateOne);

module.exports = router;
