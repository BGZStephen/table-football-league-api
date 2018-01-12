const mongoose = require('mongoose');
const winston = require('winston');
const errorHandler = require('../../services/error-handler');
const AsyncWrap = require('api/utils/async-wrapper');

const League = mongoose.model('League');

/**
 * @api {get} /leagues get a league
 * @apiName GetAll
 * @apiGroup League
 *
 * @apiParam {req} Express request object.
 * @apiParam {res} Express response object object.
 *
 * @apiSuccess {object} League objects array.
 */
const getAll = AsyncWrap(async function (req, res) {
  const leagues = await League.find({});
  res.json(leagues);
})

module.exports = {
  getAll,
}
