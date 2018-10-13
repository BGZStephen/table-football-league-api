const express = require('express');
const rest = require('api/utils/rest')
// const Fixtures = require('./fixtures');
// const Leagues = require('./leagues');
// const Users = require('./users');
// const Teams = require('./teams');
const Players = require('./players');

const router = express.Router();

/**
 * @api {all} /users/:id decode & validate a user JWT
 * @apiName ValidateUser
 * @apiGroup User
 *
 * @apiParam {req} Express request object.
 * @apiParam {req.user} User object.
 * @apiParam {req.headers} Submitted http headers
 * @apiParam {req.headers.token} json web token to decode
 * @apiParam {res} Express response object object.
 * @apiParam {next} Express middleware progression callback.
 *
 * @apiSuccess {next} continue to next middleware.
 */
async function validateUser(req, res, next) {
  const decoded = await jwt.verify(req.headers['x-access-token'], config.jwtSecret);

  if(!ObjectId(decoded.data.id).equals(ObjectId(req.params.id))) {
    return res.error({message: 'Invalid token', statusCode: 401});
  }

  next();
}

router.all('/', rest.asyncwrap(validateUser))
// router.post('/users/getByEmail', Users.getByEmail);
// router.get('/users/search', Users.search);
// // router.all('/users/:id*', Users.validateUser, Middleware.fetchResource);
// router.get('/users/:id', Users.getOne);
// router.put('/users/:id', Users.updateOne);
// router.post('/users/:id/fixtures', Users.getFixtures);
// router.post('/users/:id/leagues', Users.getLeagues);
// router.post('users/:id/profile-image', upload.single('profileImage'), Users.setProfileImage);

router.post('/players', Players.create);
router.get('/players/search', Players.search);
router.all('/players/:id*', Players.load);
router.get('/players/:id', Players.getOne);
router.put('/players/:id', Players.updateOne);

// router.get('/leagues', Leagues.getAll);
// router.post('/leagues', Leagues.create);
// router.get('/leagues/search', Leagues.search);
// // router.all('/leagues/:id*', Middleware.fetchResource);
// router.get('/leagues/:id', Leagues.getOne);
// router.put('/leagues/:id', Leagues.updateOne);

// router.post('/teams', Teams.create);
// router.get('/teams/search', Teams.search);
// // router.all('/teams/:id*', Middleware.fetchResource);
// router.get('/teams/:id', Teams.getOne);
// router.put('/teams/:id', Teams.updateOne);

// router.post('/fixtures', Fixtures.create);
// router.get('/fixtures', Fixtures.get);
// // router.all('/fixtures/:id*', Middleware.fetchResource);
// router.get('/fixtures/:id', Fixtures.getOne);
// router.put('/fixtures/:id', Fixtures.updateOne);
// router.post('/fixtures/:id/submit-score', Fixtures.submitScore);

module.exports = router;
