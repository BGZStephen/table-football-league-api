const mongoose = require('mongoose');
const winston = require('winston');
const validate = require('../../services/validate')
const AsyncWrap = require('../../utils/async-wrapper');

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
const create = AsyncWrap(async function (req, res) {
  validate(req.body, {
    date: {message: 'A date is required for the fixture', type: 'date'},
    teams: {message: 'Teams are required', type: 'array'},
    type: {message: 'Fixture type is required', type: 'string'},
  })

  const fixture = new Fixture({
    createdOn: Date.now(),
    date: req.body.date,
    teams: req.body.teams,
    type: req.body.type,
    leagueId: req.body.leagueId,
  })

  await fixture.save();
  res.json(fixture);
})

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
const getOne = AsyncWrap(async function () {
  let populators = null;

  if (req.query.teams) {
    populators = populators + 'teams ';
  }

  if (req.query.league) {
    populators = populators + 'leagueId ';
  }

  if (populators) {
    await req.team.populate(populators.trim()).execPopulate();
  }

  res.json(req.fixture);
})

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
const updateOne = AsyncWrap(async function (req, res) {
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
})

/**
 * @api {put} /fixtures/:id/submit-score submit a fixture score
 * @apiName SubmitScore
 * @apiGroup Fixture
 *
 * @apiParam {req} Express request object.
 * @apiParam {req.body} Fixture score params
 * @apiParam {req.body.homeTeam} home team score parameters
 * @apiParam {req.body.homeTeam.goalsScored} home team goals scored
 * @apiParam {req.body.homeTeam.goalsConceded} home team goals conceded
 * @apiParam {req.body.awayTeam} away team score parameters
 * @apiParam {req.body.awayTeam.goalsScored} away team goals scored
 * @apiParam {req.body.awayTeam.goalsConceded} away team goals conceded
 * @apiParam {res} Express response object object.
 *
 * @apiSuccess {object} Updated Fixture object.
 */
const submitScore = AsyncWrap(async function (req, res) {
  validate(req.body, {
    homeTeam: {message: 'A home team is required', type: 'string'},
    awayTeam: {message: 'An away team is required', type: 'string'},
  })

  const fixture = req.fixture;
  const params = {
    homeTeam: {
      _id: req.body.homeTeam._id,
      goalsScored: req.body.homeTeam.goalsScored,
      goalsConceded: req.body.homeTeam.goalsScored,
    },
    awayTeam: {
      _id: req.body.awayTeam._id,
      goalsScored: req.body.awayTeam.goalsScored,
      goalsConceded: req.body.awayTeam.goalsScored,
    }
  }

  await fixture.submitScore(params)
  res.json(fixture)
})

module.exports = {
  create,
  getOne,
  updateOne,
  submitScore,
}
