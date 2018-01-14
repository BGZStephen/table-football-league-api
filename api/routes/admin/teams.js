const mongoose = require('mongoose');
const winston = require('winston');
const config = require('../../config');
const validate = require('../../services/validate');
const AsyncWrap = require('../../utils/async-wrapper');

const Team = mongoose.model('Team');

/**
 * @api {delete} /teams/:id delete a team
 * @apiName DeleteOne
 * @apiGroup Team
 *
 * @apiParam {req} Express request object.
 * @apiParam {req.params} request url parameters
 * @apiParam {req.params.id} team ID.
 * @apiParam {res} Express response object object.
 *
 * @apiSuccess {StatusCode} new Team object.
 */
const deleteOne = AsyncWrap(async function (req, res) {
  await req.team.team.remove();
  res.status(200).send();
})

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
  deleteOne,
  getAll,
}
