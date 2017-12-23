const express = require('express');
const Middleware = require('../middleware');
const Users = require('./users');
const Teams = require('./teams');

const router = express.Router();

router.all('/', Middleware.authorizeAdminRoute);
router.get('/users', Users.getAll);
router.post('/users/authenticate', Users.authenticateAdminUser);

router.get('/teams', Teams.getAll);

module.exports = router;
