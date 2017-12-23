const mongoose = require('mongoose');
const winston = require('winston');
const config = require('../../config');
const errorHandler = require('../../services/error-handler');
const validate = require('../../services/validate');

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
async function getAll(req, res, next) {
  try {
    const teams = await Team.find({})

    if (teams.length === 0) {
      return errorHandler.apiError(res, 'No teams found', 400);
    }

    res.json(teams);
  } catch (error) {
    winston.error(error);
    res.sendStatus(400);
  }
}

module.exports = {
  getAll,
}
