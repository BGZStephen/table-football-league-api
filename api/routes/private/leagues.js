const mongoose = require('mongoose');
const winston = require('winston');
const errorHandler = require('../../services/error-handler');

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
async function create(req, res) {
  try {
    if (!req.body.name) {
      return errorHandler.apiError(res, 'League name is required', 500);
    }

    await checkExistingLeague(null, {name: req.body.name});

    const league = new League({
      createdOn: new Date(),
      name: req.body.name,
      administrators: [req.body.userId],
    });

    await league.save();
    res.json(league);
  } catch (error) {
    winston.error(error);
    res.sendStatus(500);
  }
}

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
async function getOne(req, res) {
  res.json(req.league);
}

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
async function getAll(req, res) {
  const leagues = await League.find({});
  res.json(leagues);
}

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
async function deleteOne(req, res) {
  const league = req.league;
  try {
    await league.remove();
    res.status(200).send();
  } catch (error) {
    winston.error(error);
    res.sendStatus(500);
  }
}

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
async function updateOne(req, res) {
  const league = req.league;
  const updateFields = 'name'.split(' ');
  const updateParams = {};

  try {
    Object.keys(req.body).forEach(function (key) {
      if(updateFields.indexOf(key)) {
        updateParams[key] = req.body[key];
      }

      if (req.body.administrators) {
        league.updateAdministrators(req.body.administrators);
      }

      if (req.body.teams) {
        league.updateTeams(req.body.teams);
      }

      if (req.body.fixtures) {
        league.updateFixtures(req.body.fixtures);
      }
    })

    await League.update({_id: ObjectId(req.params.id)}, updateParams);
    const league = await League.findById(ObjectId(req.params.id));
    res.json(league);
  } catch (error) {
    winston.error(error);
    res.sendStatus(500);
  }
}

/**
 * Chexk existance of a league against an expected result
 * @param {Boolean} expected expected outcome
 * @param {Object} query an object representing a mongoose query to use for existance checking
 */
async function checkExistingLeague(expected, query) {
  const result = await League.findOne(query);

  if (expected && result !== expected) {
    return errorHandler.apiError(res, 'Team not found', 404);
  } else {
    return errorHandler.apiError(res, 'Team already exists', 500);
  }
}

module.exports = {
  deleteOne,
  updateOne,
  create,
  getOne,
  getAll,
}
