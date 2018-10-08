const express = require('express');
const users = require('./users');
const router = express.Router();
const rest = require('api/utils/rest')

router.post('/users', rest.asyncwrap(users.create));
router.post('/users/authenticate', rest.asyncwrap(users.authenticate));

module.exports = router;
