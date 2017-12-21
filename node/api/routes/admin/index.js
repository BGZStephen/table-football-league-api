const express = require('express');
const Middleware = require('../middleware');
const Users = require('./users');

const router = express.Router();

router.all('/', Middleware.authorizeAdminRoute);
router.all('/users/authenticate', Users.authenticateAdminUser);

module.exports = router;
