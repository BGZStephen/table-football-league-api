const express = require('express');
const Users = require('./users');
const Website = require('./website');
const Middleware = require('../middleware');
const router = express.Router();

router.all('/*', Middleware.authorizeWebsiteRoute)
router.post('/users', Users.create);
router.post('/users/authenticate', Users.authenticate);

router.post('/website/contact-form', Website.contactFormSubmission);

module.exports = router;
