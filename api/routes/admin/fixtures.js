const mongoose = require('mongoose');
const winston = require('winston');
const errorHandler = require('../../services/error-handler');
const validate = require('../../services/validate')
const AsyncWrap = require('../../utils/async-wrapper');

const Fixture = mongoose.model('Fixture');

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
const deleteOne = AsyncWrap(async function () {
  await req.fixture.remove();
  res.status(200).send();
})

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
  deleteOne,
  getAll,
}
