const mongoose = require('mongoose');
const winston = require('winston');
const config = require('../../config');
const errorHandler = require('../../services/error-handler');
const validate = require('../../services/validate');

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
async function create(req, res) {
  try {
    validate(req.body, {
      name: 'Team name is required',
      players: 'At least one player is required',
    })

    await checkExistingTeam(null, {name: req.body.name});

    const team = new Team({
      name: req.body.name,
      players: req.body.players,
    })

    await team.save();
    res.json(team);
  } catch (error) {
    res.sendStatus(400);
  }
}

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
async function deleteOne(req, res) {
  const team = req.team;

  try {
    await team.remove();
    res.status(200).send();
  } catch (error) {
    winston.error(error);
    res.sendStatus(400);
  }
}

async function getAll(req, res, next) {
  try {
    const teams = await Team.find({})

    if (teams.length === 0) {
      return errorHandler.apiError(res, 'No teams found', 400);
    }

    res.json(teams);
  } catch (error) {
    winston.error(error);
    res.sendStatus(400);
  }
}

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
async function getOne(req, res) {
  res.json(req.team);
}

/**
 * @api {put} /teams/:id get a team
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
async function updateOne(req, res) {
  const team = req.team;
  const updateFields = 'name'.split(' ');
  const updateParams = {};

  try {

    if (req.body.players) {
      team.updatePlayers(req.body.players);
    }

    if (req.body.fixtures) {
      team.updateFixtures(req.body.fixtures);
    }

    if (req.body.leagues) {
      team.updateLeagues(req.body.leagues);
    }

    Object.keys(req.body).forEach(function (key) {
      if(updateFields.indexOf(key) > -1) {
        team[key] = req.body[key];
      }
    });

    await team.save();
    res.json(team);
  } catch (error) {
    winston.error(error);
    res.sendStatus(400);
  }
}

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

module.exports = {
  create,
  getOne,
  getAll,
  updateOne,
  deleteOne,
}
