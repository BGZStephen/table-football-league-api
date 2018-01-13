const mongoose = require('mongoose');
const winston = require('winston');
const errorHandler = require('../../services/error-handler');
const validate = require('../../services/validate')
const AsyncWrap = require('../../utils/async-wrapper');

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
const getAll = AsyncWrap(async function () {
  const fixtures = await Fixture.find({});
  res.json(fixtures);
})

module.exports = {
  getAll,
}
