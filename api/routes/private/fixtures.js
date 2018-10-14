const moment = require('moment');
const mongoose = require('mongoose');
const validate = require('validate.js');

const Fixture = mongoose.model('Fixture');
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
  const fixtureId = req.body.id || req.params.id;

  if (!fixtureId) {
    return res.error({statusCode: 400, message: 'FixtureID is required'})
  }

  const fixture = await Fixture.findById(ObjectId(fixtureId))

  if (!fixture) {
    return res.error({statusCode: 404, message: 'Fixture not found'})
  }

  if (!req.context) {
    req.context = {};
  }

  req.context.fixture = fixture;

  next();
}

/**
 * @api {post} /fixtures create a new Fixture
 * @apiName CreateFixture
 * @apiGroup Fixture
 *
 * @apiParam {req} Express request object.
 * @apiParam {req.body} league parameters object object.
 * @apiParam {req.body.date} date for the fixture.
 * @apiParam {req.body.teams} both teams for the fixture.
 * @apiParam {req.body.type} friendly / league fixture type.
 * @apiParam {res} Express response object object.
 *
 * @apiSuccess {object} new Fixture object.
 */
async function create(req, res) {
  const validatorErrors = validate(req.body, {
    date: {
      presence: {message() {return validate.format('Date is required')}}
    },
  }, {format: "flat"})

  if (validatorErrors) {
    return res.error({message: validatorErrors, statusCode: 400});
  }

  if (req.body.teams) { 
    if (req.body.teams.length !== 2) {
      return res.error({message: '2 Teams are required for a fixture', statusCode: 400});
    }
    
    const teamOne = await mongoose.model('Team').findById(ObjectId(req.body.teams[0]))
    const teamTwo = await mongoose.model('Team').findById(ObjectId(req.body.teams[1]))

    if (teamOne || teamTwo) {
      return res.error({message: 'Team not found', statusCode: 400});
    }

    for (const teamOnePlayer of teamOne) {
      for (const teamTwoPlayer of teamTwo) {
        if (teamOnePlayer._id === teamTwoPlayer._id) {
          return res.error({message: 'Fixtures cannot contain teams with the same players', statusCode: 400});
        }
      }
    }
  }

  const fixture = new Fixture({
    createdOn: Date.now(),
    date: req.body.date,
    teams: req.body.teams,
  })

  await fixture.save();
  res.json(fixture);
}

/**
 * @api {get} /fixtures get fixtures based on a query
 * @apiName Get
 * @apiGroup Fixture
 *
 * @apiParam {req} Express request object.
 * @apiParam {req.fixture} Fixture object brought by middleware.
 * @apiParam {res} Express response object object.
 *
 * @apiSuccess {object} Fixture object.
 */
async function get(req, res) {
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

  const fixtures = await Fixture.find(query).limit(req.query.limit).populate(populators);

  res.json(fixtures);
}

/**
 * @api {get} /fixtures/:id get one Fixture
 * @apiName GetOne
 * @apiGroup Fixture
 *
 * @apiParam {req} Express request object.
 * @apiParam {req.fixture} Fixture object brought by middleware.
 * @apiParam {res} Express response object object.
 *
 * @apiSuccess {object} Fixture object.
 */
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

/**
 * @api {put} /fixtures/:id update one Fixture
 * @apiName UpdateOne
 * @apiGroup Fixture
 *
 * @apiParam {req} Express request object.
 * @apiParam {req.body} Fixture update params
 * @apiParam {req.body.teams} Updated teams for the fixture
 * @apiParam {req.body.date} Updated date for the fixture
 * @apiParam {req.body.type} Updated type for the fixture
 * @apiParam {res} Express response object object.
 *
 * @apiSuccess {object} Updated Fixture object.
 */
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

module.exports = {
  load,
  create,
  get,
  getOne,
  updateOne,
}
