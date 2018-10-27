const mongoose = require('mongoose');
const validate = require('validate.js');
const rest = require('api/utils/rest');
const { Router } = require('express')

const router = Router();
const Player = mongoose.model('Player');
const ObjectId = mongoose.Types.ObjectId;

async function load(req, res, next) {
  const playerId = req.body.id || req.params.id;

  if (!playerId) {
    return res.error({statusCode: 400, message: 'PlayerID is required'})
  }

  const player = await Player.findById(ObjectId(playerId))

  if (!player) {
    return res.error({statusCode: 404, message: 'Player not found'})
  }

  req.context.player = player;

  next();
}

async function create(req, res) {
  const validatorErrors = validate(req.body, {
    name: {
      presence: {message: 'Name is required'}
    },
  }, {format: "flat"})

  if (validatorErrors) {
    return res.error({message: validatorErrors, statusCode: 400});
  }

  const existingPlayer = await Player.findOne({name: req.body.name})

  if (existingPlayer) {
    return res.error({message: 'Player already exists', statusCode: 400});
  }

  const player = await Player.create({
    createdBy: req.context.user._id,
    name: req.body.name,
    position: {
      striker: req.body.striker,
      defender: req.body.defender
    }
  })

  res.json(player);
}

async function getOne(req, res) {
  res.json(req.context.player);
}

async function updateOne(req, res) {
  const player = req.context.player;

  if (req.body.name) {
    player.name = req.body.name;
  }

  if (req.body.position.striker !== null && req.body.position.striker !== undefined) {
    player.position.striker = req.body.position.striker;
  }

  if (req.body.position.defender !== null && req.body.position.defender !== undefined) {
    player.position.defender = req.body.position.defender;
  }

  if (req.body.userId === null) {
    player.userId = null;
  }

  if (req.body.userId && req.body.userId !== null) {
    const user = await mongoose.model('User').findById(ObjectId(req.body.userId));
    if (!user) {
      return res.error({statusCode: 404, message: 'User not found'})
    }

    const existingLinkedPlayer = await mongoose.model('Player').findOne({userId: ObjectId(req.body.userId)})

    if (existingLinkedPlayer) {
      return res.error({statusCode: 404, message: 'User already has an assigned player'})
    }

    player.userId = req.body.userId;
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

router.post('/', rest.asyncwrap(create));
router.get('/search', rest.asyncwrap(search));
router.all('/:id*', rest.asyncwrap(load));
router.get('/:id', getOne);
router.put('/:id', rest.asyncwrap(updateOne));

module.exports = {
  router,
  __load: load,
  __create: create,
};