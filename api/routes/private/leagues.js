const mongoose = require('mongoose');
const errorHandler = require('../../services/error-handler');
const AsyncWrap = require('../../utils/async-wrapper');

const League = mongoose.model('League');
const ObjectId = mongoose.Types.ObjectId;

/**
 * @api {post} /league create a new League
 * @apiName CreateLeague
 * @apiGroup League
 *
 * @apiParam {req} Express request object.
 * @apiParam {req.body} league parameters object object.
 * @apiParam {req.body.name} new League name.
 * @apiParam {req.body.administrators} Array of player ID's to form the administrators.
 * @apiParam {res} Express response object object.
 *
 * @apiSuccess {object} new League object.
 */
const create = AsyncWrap(async function (req, res) {
  if (!req.body.name) {
    errorHandler.apiError({message: 'League name is required', statusCode: 400});
  }

  if (await leagueAlreadyExists({name: req.body.name})) {
    errorHandler.apiError({message: 'A league with that name already exists', statusCode: 400})
  }

  const league = new League({
    createdOn: new Date(),
    name: req.body.name,
    administrators: [req.body.userId],
  });

  await league.save();
  res.json(league);
})

/**
 * @api {get} /leagues/:id get a league
 * @apiName GetOne
 * @apiGroup League
 *
 * @apiParam {req} Express request object.
 * @apiParam {req.league} League onject fetched by middleware
 * @apiParam {res} Express response object object.
 *
 * @apiSuccess {object} League object.
 */
const getOne = AsyncWrap(async function (req, res) {
  res.json(req.league);
})

/**
 * @api {get} /leagues get all leagues
 * @apiName GetAll
 * @apiGroup League
 *
 * @apiParam {req} Express request object.
 * @apiParam {res} Express response object object.
 *
 * @apiSuccess {object} League object.
 */
const getAll = AsyncWrap(async function (req, res) {
  const leagues = await League.find({});
  res.json(leagues);
})

/**
 * @api {delete} /leagues/:id delete a league
 * @apiName DeleteOne
 * @apiGroup League
 *
 * @apiParam {req} Express request object.
 * @apiParam {req.params} request url parameters
 * @apiParam {req.params.id} league ID.
 * @apiParam {res} Express response object object.
 *
 * @apiSuccess {StatusCode} 200.
 */
const deleteOne = AsyncWrap(async function (req, res) {
  await req.league.remove();
  res.status(200).send();
})

/**
 * @api {put} /leagues/:id update a league
 * @apiName UpdateOne
 * @apiGroup League
 *
 * @apiParam {req} Express request object.
 * @apiParam {req.team} League onject fetched by middleware
 * @apiParam {req.body} League update params object.
 * @apiParam {req.body.name} updated Team name.
 * @apiParam {req.body.teams} teams params object.
 * @apiParam {req.body.teams.add} array of teams to add.
 * @apiParam {req.body.teams.remove} array of teams to remove.
 * @apiParam {req.body.fixtures} fixtures params object.
 * @apiParam {req.body.fixtures.add} array of fixtures to add.
 * @apiParam {req.body.fixtures.remove} array of fixtures to remove.
 * @apiParam {req.body.administrators} administrators params object.
 * @apiParam {req.body.administrators.add} array of administrators to add.
 * @apiParam {req.body.administrators.remove} array of administrators to remove.
 * @apiParam {res} Express response object object.
 *
 * @apiSuccess {object} updated League object.
 */
const updateOne = AsyncWrap(async function (req, res) {
  const league = req.league;
  const updateFields = 'name'.split(' ');
  const updateParams = {};

  Object.keys(req.body).forEach(function (key) {
    if(updateFields.indexOf(key)) {
      league[key] = req.body[key];
    }
  })

  if (req.body.administrators) {
    for (const userId of league.administrators) {
      if (req.body.administrators.indexOf(userId) === -1) {
        leage.removeAdministrator(userId);
      } else {
        leage.addAdministrator(userId);
      }
    }
  }

  if (req.body.teams) {
    for (const teamId of req.body.teams) {
      const team = await Team.findById(teamId)
      await team.addLeague(league._id).save();
    }
  }

  if (!req.body.teams) {
    await league.save();
  }

  res.json(league);
})

/**
 * Chexk existance of a league against an expected result
 * @param {Boolean} expected expected outcome
 * @param {Object} query an object representing a mongoose query to use for existance checking
 */

/**
 * Chexk existance of a user against an expected result
 * @param {Boolean} expected expected outcome
 * @param {Object} query an object representing a mongoose query to use for existance checking
*/
async function leagueAlreadyExists(query) {
  return await League.findOne(query) ? true : false;
}

module.exports = {
  deleteOne,
  updateOne,
  create,
  getOne,
  getAll,
}
