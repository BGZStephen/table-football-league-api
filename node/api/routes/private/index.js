const express = require('express');
const Multer  = require('multer')
const Fixtures = require('./fixtures');
const Middleware = require('../middleware');
const Leagues = require('./leagues');
const Users = require('./users');
const Teams = require('./teams');

const upload = Multer({ dest: 'uploads/' })
const router = express.Router();

router.all('/*', Middleware.authorizeRoute);
router.get('/users', Users.getAll);
router.all('/users/:id', Users.validateUser, Middleware.fetchResource);
router.get('/users/:id', Users.getOne);
router.put('/users/:id', Users.updateOne);
router.delete('/users/:id', Users.deleteOne);
router.post('users/:id/profile-image', upload.single('profileImage'), Users.setProfileImage);

router.get('/leagues', Leagues.getAll);
router.post('/leagues', Leagues.create);
router.all('/leagues/:id', Middleware.fetchResource);
router.get('/leagues/:id', Leagues.getOne);
router.delete('/leagues/:id', Leagues.deleteOne);
router.put('/leagues/:id', Leagues.updateOne);

router.get('/teams', Teams.getAll);
router.post('/teams', Teams.create);
router.all('/teams/:id', Middleware.fetchResource);
router.get('/teams/:id', Teams.getOne);
router.delete('/teams/:id', Teams.deleteOne);
router.put('/teams/:id', Teams.updateOne);

router.post('/fixtures', Fixtures.create);
router.get('/fixtures', Fixtures.getAll);
router.all('/fixtures/:id', Middleware.fetchResource);
router.get('/fixtures/:id', Fixtures.getOne);
router.put('/fixtures/:id', Fixtures.updateOne);
router.delete('/fixtures/:id', Fixtures.deleteOne);

module.exports = router;
