const express = require('express');
const users = require('./users');
const router = express.Router();
const rest = require('api/utils/rest')

router.post('/users', rest.asyncwrap(users.create));
router.post('/users/password-reset', rest.asyncwrap(users.createPasswordReset));
router.get('/users/password-reset', rest.asyncwrap(users.checkPasswordResetToken));
router.put('/users/password-reset', rest.asyncwrap(users.updateUserFromPasswordReset));
router.post('/users/authenticate', rest.asyncwrap(users.authenticate));

module.exports = router;
