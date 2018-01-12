const mongoose = require('mongoose');
const winston = require('winston');
const config = require('../../config');
const errorHandler = require('../../services/error-handler');
const validate = require('../../services/validate');
const AsyncWrap = require('api/utils/async-wrapper');

const Team = mongoose.model('Team');

/**
 * @api {get} /admin/teams get all Teams
 * @apiName GetAll
 * @apiGroup Team
 *
 * @apiParam {req} Express request object.
 * @apiParam {res} Express response object object.
 *
 * @apiSuccess {object} Team objects.
 */
const getAll = AsyncWrap(async function (req, res, next) {
  const teams = await Team.find({})
  res.json(teams);
})

module.exports = {
  getAll,
}
