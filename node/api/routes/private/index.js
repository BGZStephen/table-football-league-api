const express = require('express');
const router = express.Router();
const Leagues = require('./leagues');
const Users = require('./users');

router.all('/users/:id', Users.validateUser, Users.fetchUser);
router.put('/users/:id', Users.updateOne);
router.delete('/users/:id', Users.deleteOne);

router.all('/leagues/:id', Leagues.fetchLeague);
router.delete('/leagues/:id', Leagues.delteOne);
router.put('/leagues/:id', Leagues.updateOne);

module.exports = router;
