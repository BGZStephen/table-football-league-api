const mongoose = require('mongoose');
const validate = require('validate.js');

const Fixture = mongoose.model('Fixture');
const ObjectId = mongoose.Types.ObjectId;

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

  if (req.body.teams.length !== 2) {
    return res.error({message: '2 Teams are required for a fixture', statusCode: 400});
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
async function get() {
  let query = {};
  let populators = null;

  if (req.query.teamId) {
    query.teams = req.query.teamId;
  }

  if (req.query.leagueId) {
    query.leagueId = req.query.leagueId;
  }

  if (req.query.teams) {
    populators = populators + 'teams ';
  }

  if (req.query.league) {
    populators = populators + 'leagueId ';
  }

  const fixtures = await Fixture.find(query);

  if (populators) {
    await fixture.populate(populators.trim()).execPopulate();
  }

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
async function getOne() {
  let populators = null;

  if (req.query.teams) {
    populators = populators + 'teams ';
  }

  if (req.query.league) {
    populators = populators + 'leagueId ';
  }

  if (populators) {
    await req.fixture.populate(populators.trim()).execPopulate();
  }

  res.json(req.fixture);
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
  const fixture = req.fixture;
  const updateFields = 'teams date type'.split(' ');
  const updateParams = {};

  if (req.body.teams) {
    for (const teamId of fixture.teams) {
      if (req.body.teams.indexOf(teamId) === -1) {
        await fixture.removeTeam(teamId);
      }
    }
  }

  Object.keys(req.body).forEach(function (key) {
    if(updateFields.indexOf(key)) {
      fixture[key] = req.body[key];
    }
  })

  await fixture.save();
  res.json(fixture);
}

module.exports = {
  create,
  get,
  getOne,
  updateOne,
}
