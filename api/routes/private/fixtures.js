const moment = require('moment');
const mongoose = require('mongoose');
const validate = require('validate.js');
const { Router } = require('express');
const rest = require('api/utils/rest');

const router = Router();
const Fixture = mongoose.model('Fixture');
const ObjectId = mongoose.Types.ObjectId;

async function load(req, res, next) {
  const fixtureId = req.body.id || req.params.id;

  if (!fixtureId) {
    return res.error({statusCode: 400, message: 'FixtureID is required'})
  }

  const fixture = await Fixture.findById(ObjectId(fixtureId))

  if (!fixture) {
    return res.error({statusCode: 404, message: 'Fixture not found'})
  }

  req.context.fixture = fixture;

  next();
}

async function create(req, res) {
  const validatorErrors = validate(req.body, {
    date: {
      presence: {message: 'Date is required'}
    },
  }, {format: "flat"})

  if (validatorErrors) {
    return res.error({message: validatorErrors, statusCode: 400});
  }

  if (req.body.date && moment(req.body.date).isBefore(moment().startOf('day'))) {
    return res.error({message: 'Fixture dates must be in the future', statusCode: 400});
  }

  if (!req.body.teams || req.body.teams.length !== 2) {
    return res.error({message: '2 Teams are required for a fixture', statusCode: 400});
  }
    
  const teamOne = await mongoose.model('Team').findById(ObjectId(req.body.teams[0]))
  const teamTwo = await mongoose.model('Team').findById(ObjectId(req.body.teams[1]))

  if (!teamOne || !teamTwo) {
    return res.error({message: 'Team not found', statusCode: 400});
  }

  for (const teamOnePlayer of teamOne.players) {
    for (const teamTwoPlayer of teamTwo.players) {
      if (teamOnePlayer._id === teamTwoPlayer._id) {
        return res.error({message: 'Fixtures cannot contain teams with the same players', statusCode: 400});
      }
    }
  }

  const fixture = await Fixture.create({
    createdBy: req.context.user._id,
    date: req.body.date,
    teams: req.body.teams,
  })

  await fixture.save();
  res.json(fixture);
}

async function search(req, res) {
  let query = {};
  let populators = '';

  if (req.query.teams) {
    populators += 'teams';
  }
  
  if (req.query.limit || !Number.isNaN(parseInt(req.query.limit))) {
    req.query.limit = parseInt(req.query.limit);
  } else {
    req.query.limit = null;
  }
  
  let fixtures = await Fixture.find(query).limit(req.query.limit).populate(populators);
  
  if (req.query.player) {
    fixtures = fixtures.filter(fixture => {
      for (const team of fixture.teams) {
        for (const player of team.players) {
          if (ObjectId(req.query.player).equals(player)) {
            return true;
          }
        }
      }
    });
  }

  res.json(fixtures);
}

async function getOne(req, res) {
  let populators = '';

  if (req.query.teams) {
    populators += 'teams';
  }

  if (req.query.players) {
    populators = {
      path: 'teams',
      populate: {
        path: 'players',
        model: 'Player'
      }
    };
  }

  if (populators) {
    await req.context.fixture.populate(populators).execPopulate();
  }

  res.json(req.context.fixture);
}

async function updateOne(req, res) {
  const fixture = req.context.fixture;

  if (req.body.date) {
    if (moment(req.body.date).isBefore(moment().startOf('day'))) {
      return res.error({message: 'Fixture dates must be in the future', statusCode: 400});
    }

    fixture.date = req.body.date;
  }

  if (req.body.teams) {
    if (req.body.teams.length !== 2) {
      return res.error({message: '2 Teams are required for a fixture', statusCode: 400});
    }

    const teamOne = await mongoose.model('Team').findById(ObjectId(req.body.teams[0]._id))
    const teamTwo = await mongoose.model('Team').findById(ObjectId(req.body.teams[1]._id))

    if (!teamOne || !teamTwo) {
      return res.error({message: 'Team not found', statusCode: 400});
    }

    for (const teamOnePlayer of teamOne.players) {
      for (const teamTwoPlayer of teamTwo.players) {
        if (teamOnePlayer._id === teamTwoPlayer._id) {
          return res.error({message: 'Fixtures cannot contain teams with the same players', statusCode: 400});
        }
      }
    }

    fixture.teams = req.body.teams;
  }

  await fixture.save();
  res.json(fixture);
}

router.post('/', rest.asyncwrap(create));
router.get('/search', rest.asyncwrap(search));
router.all('/:id*', rest.asyncwrap(load));
router.get('/:id', getOne);
router.put('/:id', rest.asyncwrap(updateOne));

module.exports = {
  router,
  __load: load,
  __getOne: getOne,
  __create: create,
  __search: search
};
