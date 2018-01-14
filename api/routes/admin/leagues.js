const mongoose = require('mongoose');
const winston = require('winston');
const AsyncWrap = require('../../utils/async-wrapper');

const League = mongoose.model('League');

/**
 * @api {delete} /leagues/:id delete a league
 * @apiName DeleteOne
 * @apiGroup League
 *
 * @apiParam {req} Express request object.
 * @apiParam {req.params} request url parameters
 * @apiParam {req.params.id} league ID.
 * @apiParam {res} Express response object object.
 *
 * @apiSuccess {StatusCode} 200.
 */
const deleteOne = AsyncWrap(async function (req, res) {
  await req.league.remove();
  res.status(200).send();
})

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
  deleteOne
}
