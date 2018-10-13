const mongoose = require('mongoose');
const validate = require('validate.js');

const Player = mongoose.model('Player');
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
  const playerId = req.body.id || req.params.id;

  if (!playerId) {
    return res.error({statusCode: 400, message: 'PlayerID is required'})
  }

  const player = await Player.findById(ObjectId(playerId))

  if (!player) {
    return res.error({statusCode: 404, message: 'Player not found'})
  }

  if (!req.context) {
    req.context = {};
  }

  req.context.player = player;

  next();
}

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
  res.json(req.context.player);
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
  const player = req.context.player;

  if (req.body.name) {
    player.name = req.body.name;
  }

  if (req.body.position.striker) {
    player.position.striker = true;
  } else {
    player.position.striker = false;
  }

  if (req.body.position.defender) {
    player.position.defender = true;
  } else {
    player.position.defender = false;
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
  load,
  create,
  getOne,
  search,
  updateOne,
}
