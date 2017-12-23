const mongoose = require('mongoose');
const winston = require('winston');
const errorHandler = require('../../services/error-handler');
const validate = require('../../services/validate')

const Fixture = mongoose.model('Fixture');

/**
 * @api {get} /admin/fixtures get all Fixtures
 * @apiName GetAll
 * @apiGroup Fixture
 *
 * @apiParam {req} Express request object.
 * @apiParam {res} Express response object object.
 *
 * @apiSuccess {object} Fixture objects.
 */
async function getAll() {
  try {
    const fixtures = await Fixture.find({});
    res.json(fixtures);
  } catch (error) {
    winston.error(error);
    res.sendStatus(500);
  }
}

module.exports = {
  getAll,
}
