const mongoose = require('mongoose');
const validate = require('validate.js');
const { Router } = require('express');
const rest = require('api/utils/rest');

const router = Router();
const Player = mongoose.model('Player');
const Team = mongoose.model('Team');
const ObjectId = mongoose.Types.ObjectId;

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

  const teams = await Team.find(query).populate(populators)

  res.json(teams);
}

async function updateOne(req, res) {
  const team = req.context.team;

  if (req.body.players && req.body.players.length !== 2) {
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

module.exports = {
  router,
  __updateOne: updateOne,
  __search: search
};
