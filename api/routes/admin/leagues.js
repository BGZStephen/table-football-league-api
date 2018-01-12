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
async function getAll(req, res) {
  try {
    const leagues = await League.find({});
    res.json(leagues);
  } catch (error) {
    winston.error(error);
    res.sendStatus(500);
  }
}

module.exports = {
  getAll,
}
