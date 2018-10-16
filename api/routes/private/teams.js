const mongoose = require('mongoose');
const validate = require('validate.js');
const { Router } = require('express');
const rest = require('api/utils/rest');

const router = Router();
const Player = mongoose.model('Player');
const Team = mongoose.model('Team');
const ObjectId = mongoose.Types.ObjectId;

/**
 * @api {get} /players/:id Get one player
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {req} Express request object.
 * @apiParam {req.user} User object.
 * @apiParam {res} Express response object object.
 *
 * @apiSuccess {Object} mongoose User object.
 */
async function load(req, res, next) {
  const teamId = req.body.id || req.params.id;

  if (!teamId) {
    return res.error({statusCode: 400, message: 'TeamID is required'})
  }

  const team = await Team.findById(ObjectId(teamId))

  if (!team) {
    return res.error({statusCode: 404, message: 'Team not found'})
  }

  req.context.team = team;

  next();
}

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
  const validatorErrors = validate(req.body, {
    name: {
      presence: {message() {return validate.format('Team name is required')}}
    },
  }, {format: "flat"})

  if (validatorErrors) {
    return res.error({message: validatorErrors, statusCode: 400});
  }

  if (req.body.players.length < 2) {
    return res.error({message: 'Teams require at least 2 players', statusCode: 400});
  }

  for (const player of req.body.players) {
    if (!await Player.findById(player)) {
      return res.error({message: 'Player not found', statusCode: 403});
    }
  }

  const team = new Team({
    name: req.body.name,
    players: req.body.players,
  })

  await team.save()

  res.json(team);
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
  const team = req.context.team;
  let populators = '';

  if (req.query.players) {
    populators = populators + 'players ';
  }

  if (req.query.leagues) {
    populators = populators + 'leagues ';
  }

  if (req.query.fixtures) {
    populators = populators + 'fixtures ';
  }

  if (populators) {
    await team.populate(populators).execPopulate();
  }

  res.json(team);
}

async function search(req, res) {
  const query = {}
  let populators = '';

  if (req.query.name) {
    query.name = req.query.name
  }

  if (req.query.players) {
    populators = populators + 'players ';
  }

  if (req.query.leagues) {
    populators = populators + 'teams ';
  }

  if (req.query.fixtures) {
    populators = populators + 'fixtures ';
  }

  const teams = await Team.find(query).populate(populators)

  res.json(teams);
}

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
async function updateOne(req, res) {
  const team = req.context.team;

  if (req.body.players.length < 2) {
    return res.error({message: 'Teams require at least 2 players', statusCode: 400});
  }

  if (req.body.name) {
    team.name = req.body.name
  }

  if (req.body.players) {
    for (const player of req.body.players) {
      if (!await Player.findById(player)) {
        return res.error({message: 'Player not found', statusCode: 403});
      }
    }

    team.players = req.body.players;
  }


  await team.save();
  res.json(team);
}

router.post('/', rest.asyncwrap(create));
router.get('/search', rest.asyncwrap(search));
router.all('/:id*', rest.asyncwrap(load));
router.get('/:id', getOne);
router.put('/:id', rest.asyncwrap(updateOne));

module.exports = router;
