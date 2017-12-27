const mongoose = require('mongoose');
const winston = require('winston');
const errorHandler = require('../../services/error-handler');
const validate = require('../../services/validate')

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
  try {
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
    })

    await fixture.save();
    res.json(fixture);
  } catch (error) {
    winston.error(error);
    res.sendStatus(500);
  }
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
  res.json(req.fixture);
}

/**
 * @api {delete} /fixtures/:id delete one Fixture
 * @apiName DelteOne
 * @apiGroup Fixture
 *
 * @apiParam {req} Express request object.
 * @apiParam {req.fixture} Fixture object brought by middleware.
 * @apiParam {res} Express response object object.
 *
 * @apiSuccess {StatusCode} 200.
 */
async function deleteOne() {
  try {
    const fixture = req.fixture;
    await fixture.remove();
    res.status(200).send();
  } catch (error) {
    winston.error(error);
    res.sendStatus(500);
  }
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
  const updateFields = 'teams date type'.split(' ');
  const updateParams = {};

  try {
    Object.keys(req.body).forEach(function (key) {
      if(updateFields.indexOf(key)) {
        updateParams[key] = req.body[key];
      }
    })

    await Fixture.update({_id: ObjectId(req.params.id)}, updateParams);
    const fixture = await Fixture.findById(ObjectId(req.params.id));
    res.json(fixture);
  } catch (error) {
    winston.error(error);
    res.sendStatus(500);
  }
}

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
async function submitScore(req, res) {
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
  try {
    await fixture.submitScore(params)
    res.json(fixture)
  } catch (error) {
    winston.error(error);
    res.sendStatus(400);
  }
}

module.exports = {
  create,
  getOne,
  deleteOne,
  updateOne,
  submitScore,
}
