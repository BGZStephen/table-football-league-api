const express = require('express');
const Multer  = require('multer')
const Fixtures = require('./fixtures');
const Middleware = require('../middleware');
const Leagues = require('./leagues');
const Users = require('./users');
const Teams = require('./teams');

const upload = Multer({ dest: 'uploads/' })
const router = express.Router();

router.all('/*', Middleware.authorizeDashboardRoute);
router.post('/users/getByEmail', Users.getByEmail);
router.all('/users/:id*', Users.validateUser, Middleware.fetchResource);
router.get('/users/:id', Users.getOne);
router.put('/users/:id', Users.updateOne);
router.post('/users/:id/fixtures', Users.getFixtures);
router.post('/users/:id/leagues', Users.getLeagues);
router.post('users/:id/profile-image', upload.single('profileImage'), Users.setProfileImage);

router.get('/leagues', Leagues.getAll);
router.post('/leagues', Leagues.create);
router.all('/leagues/:id*', Middleware.fetchResource);
router.get('/leagues/:id', Leagues.getOne);
router.put('/leagues/:id', Leagues.updateOne);

router.post('/teams', Teams.create);
router.all('/teams/:id*', Middleware.fetchResource);
router.get('/teams/:id', Teams.getOne);
router.put('/teams/:id', Teams.updateOne);

router.post('/fixtures', Fixtures.create);
router.get('/fixtures', Fixtures.get);
router.all('/fixtures/:id*', Middleware.fetchResource);
router.get('/fixtures/:id', Fixtures.getOne);
router.put('/fixtures/:id', Fixtures.updateOne);
router.post('/fixtures/:id/submit-score', Fixtures.submitScore);

module.exports = router;
