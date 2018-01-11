const mongoose = require('mongoose');
const config = require('../../config');
const errorHandler = require('../../services/error-handler');
const validate = require('../../services/validate');
const AsyncWrap = require('../../utils/async-wrapper');

const User = mongoose.model('User');
const Team = mongoose.model('Team');
const ObjectId = mongoose.Types.ObjectId;

/**
 * @api {post} /teams create a new Team
 * @apiName CreateTeam
 * @apiGroup Team
 *
 * @apiParam {req} Express request object.
 * @apiParam {req.body} team parameters object object.
 * @apiParam {req.body.name} new Team name.
 * @apiParam {req.body.players} Array of player ID's to form the team.
 * @apiParam {res} Express response object object.
 *
 * @apiSuccess {object} new Team object.
 */
const create = AsyncWrap(async function (req, res) {
  validate(req.body, {
    name: {message: 'Team name is required', type: 'string'},
    players: {message: 'At least one player is required', type: 'array'}
  })

  await checkExistingTeam(null, {name: req.body.name});
  const users = await checkUsersExist(req.body.players);

  const team = new Team({
    name: req.body.name,
    players: req.body.players,
  })

  await team.save();
  res.json(team);
})

/**
 * @api {delete} /teams/:id delete a team
 * @apiName DeleteOne
 * @apiGroup Team
 *
 * @apiParam {req} Express request object.
 * @apiParam {req.params} request url parameters
 * @apiParam {req.params.id} team ID.
 * @apiParam {res} Express response object object.
 *
 * @apiSuccess {StatusCode} new Team object.
 */
const deleteOne = AsyncWrap(async function (req, res) {
  await req.team.team.remove();
  res.status(200).send();
})

/**
 * @api {get} /teams/:id get a team
 * @apiName GetOne
 * @apiGroup Team
 *
 * @apiParam {req} Express request object.
 * @apiParam {req.team} Team onject fetched by middleware
 * @apiParam {res} Express response object object.
 *
 * @apiSuccess {object} Team object.
 */
const getOne = AsyncWrap(async function (req, res) {
  res.json(req.team);
})

/**
 * @api {put} /teams/:id update a team
 * @apiName UpdateOne
 * @apiGroup Team
 *
 * @apiParam {req} Express request object.
 * @apiParam {req.team} Team onject fetched by middleware
 * @apiParam {req.body} Team update params object.
 * @apiParam {req.body.name} updated Team name.
 * @apiParam {req.body.players} players params object.
 * @apiParam {req.body.players.add} array of players to add.
 * @apiParam {req.body.players.remove} array of players to remove.
 * @apiParam {req.body.fixtures} fixtures params object.
 * @apiParam {req.body.fixtures.add} array of fixtures to add.
 * @apiParam {req.body.fixtures.remove} array of fixtures to remove.
 * @apiParam {req.body.leagues} leagues params object.
 * @apiParam {req.body.leagues.add} array of leagues to add.
 * @apiParam {req.body.leagues.remove} array of leagues to remove.
 * @apiParam {res} Express response object object.
 *
 * @apiSuccess {object} updated Team object.
 */
const updateOne = AsyncWrap(async function (req, res) {
  const team = req.team;
  const updateFields = 'name'.split(' ');
  const updateParams = {};

  Object.keys(req.body).forEach(function (key) {
    if(updateFields.indexOf(key) > -1) {
      team[key] = req.body[key];
    }
  });

  await team.save();
  res.json(team);
})

/**
 * Chexk existance of a team against an expected result
 * @param {Boolean} expected expected outcome
 * @param {Object} query an object representing a mongoose query to use for existance checking
 */
async function checkExistingTeam(expected, query) {
  const result = await Team.findOne(query);

  if (expected && result !== expected) {
    return errorHandler.apiError(res, 'Team not found', 404);
  } else {
    return errorHandler.apiError(res, 'Team already exists', 500);
  }
}

/**
 * check that an array of userId's corresponds to valid users. If users exist, return them.
 * @param {Array} users array of users
 * @param {String} errorMessage error message to show if check fails
 */
async function checkUsersExist(users, errorMessage) {
  const validUsers = []
  for (const user of users) {
    const validUser = await User.findOne(ObjectId(user))
    if (!validUser) {
      return errorHandler.apiError(res, `${errorMessage} Player not found.`, 400);
    } else {
      validUsers.push(validUser)
    }
  }

  return validUsers;
}

module.exports = {
  create,
  getOne,
  updateOne,
  deleteOne,
}
