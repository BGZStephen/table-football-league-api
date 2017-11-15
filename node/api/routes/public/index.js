const express = require('express');
const Users = require('./users');
const Leagues = require('./leagues');
const Website = require('./website');
const Middleware = require('../middleware');
const router = express.Router();

router.get('/users', Users.getAll);
router.post('/users', Users.create);
router.post('/users/authenticate', Users.authenticate);
router.all('/users/:id', Middleware.fetchResource)
router.get('/users/:id', Users.getOne);

router.get('/leagues', Leagues.getAll);
router.post('/leagues', Leagues.create);
router.all('/leagues/:id', Middleware.fetchResource)
router.get('/leagues/:id', Leagues.getOne);

router.post('/website/contact-form', Website.contactFormSubmission);

module.exports = router;
