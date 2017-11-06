const express = require('express');
const router = express.Router();
const Leagues = require('./leagues');
const Users = require('./users');

router.all('/users/:id', Users.validateUser, Users.fetchUser);
router.put('/users/:id', Users.updateOne);
router.delete('/users/:id', Users.deleteOne);

// router.get('/leagues', Leagues.getAll);
// router.get('/leagues/:id', Leagues.getOne);
// router.post('/leagues', Leagues.create);

module.exports = router;
