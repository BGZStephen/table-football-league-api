const express = require('express');
const rest = require('api/utils/rest')
const fixtures = require('./fixtures');
// const Leagues = require('./leagues');
// const Users = require('./users');
const teams = require('./teams');
const players = require('./players');

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

router.post('/players', rest.asyncwrap(players.create));
router.get('/players/search', rest.asyncwrap(players.search));
router.all('/players/:id*', players.load);
router.get('/players/:id', players.getOne);
router.put('/players/:id', rest.asyncwrap(players.updateOne));

// router.get('/leagues', Leagues.getAll);
// router.post('/leagues', Leagues.create);
// router.get('/leagues/search', Leagues.search);
// // router.all('/leagues/:id*', Middleware.fetchResource);
// router.get('/leagues/:id', Leagues.getOne);
// router.put('/leagues/:id', Leagues.updateOne);

router.post('/teams', rest.asyncwrap(teams.create));
router.get('/teams/search', rest.asyncwrap(teams.search));
router.all('/teams/:id*', rest.asyncwrap(teams.load));
router.get('/teams/:id', teams.getOne);
router.put('/teams/:id', rest.asyncwrap(teams.updateOne));

router.post('/fixtures', rest.asyncwrap(fixtures.create));
router.get('/fixtures/search', rest.asyncwrap(fixtures.get));
router.all('/fixtures/:id*', rest.asyncwrap(fixtures.load));
router.get('/fixtures/:id', fixtures.getOne);
router.put('/fixtures/:id', rest.asyncwrap(fixtures.updateOne));
// router.post('/fixtures/:id/submit-score', Fixtures.submitScore);

module.exports = router;
