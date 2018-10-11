const mongoose = require('mongoose');
const validate = require('validate.js');

const Player = mongoose.model('Player');
const ObjectId = mongoose.Types.ObjectId;

/**
 * @api {post} /users Create a User
 * @apiName CreateUser
 * @apiGroup User
 *
 * @apiParam {req} Express request object.
 * @apiParam {req.body}
 * @apiParam {req.body.firstName} user first name
 * @apiParam {req.body.lastName} user last name
 * @apiParam {req.body.email} user email
 * @apiParam {req.body.password} user password
 *
 * @apiSuccess {User, JWT} new User object + json web token.
 */
async function create(req, res) {
  const validatorErrors = validate(req.body, {
    name: {
      presence: {message() {return validate.format('Name is required')}}
    },
  }, {format: "flat"})

  if (validatorErrors) {
    return res.error({message: validatorErrors, statusCode: 403});
  }

  const existingPlayer = await Player.findOne({name: req.body.name})

  if (existingPlayer) {
    return res.error({message: 'Player already exists', statusCode: 400});
  }

  const player = new Player({
    name: req.body.name,
    position: {
      striker: req.body.striker,
      defender: req.body.defender
    }
  })

  await player.save();

  res.json(player);
}

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
async function getOne(req, res) {
  let populators = '';

  if (req.query.teams) {
    populators += 'teams ';
  }

  if (req.query.leagues) {
    populators += 'leagues ';
  }

  if (req.query.fixtures) {
    populators += 'fixtures ';
  }

  if (populators) {
    await req.user.populate(populators).execPopulate();
  }

  res.json(req.user);
}

/**
 * @api {put} /users/:id Update one user
 * @apiName GetAllUsers
 * @apiGroup User
 *
 * @apiParam {req} Express request object.
 * @apiParam {req.user} User object.
 * @apiParam {req.body} Update parameters object.
 * @apiParam {req.body.firstName} first name to update.
 * @apiParam {req.body.lastName} last name to update.
 * @apiParam {req.body.email} email to update.
 * @apiParam {req.body.password} password to update.
 * @apiParam {req.body.username} username to update.
 * @apiParam {res} Express response object object.
 *
 * @apiSuccess {Object} updated User object.
 */
async function updateOne(req, res) {
  const player = req.player;

  if (req.body.name) {
    req.player.name = name;
  }

  if (req.body.striker) {
    req.player.striker = true;
  } else {
    req.player.striker = false;
  }

  if (req.body.defender) {
    req.player.defender = true;
  } else {
    req.player.defender = false;
  }

  await player.save();
  res.json(player);
}

async function search(req, res) {
  const query = {}

  if (req.query.name) {
    query.name = name;
  }

  const players = await Player.find(query)

  res.json(players);
}

module.exports = {
  create,
  getOne,
  search,
  updateOne,
}
