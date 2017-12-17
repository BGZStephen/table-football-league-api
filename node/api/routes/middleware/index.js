const mongoose = require('mongoose');
const winston = require('winston');
const config = require('../../config')
const errorHandler = require('../../services/error-handler');

const User = mongoose.model('User');
const League = mongoose.model('League');
const Team = mongoose.model('Team');
const ObjectId = mongoose.Types.ObjectId;

async function fetchResource(req, res, next) {
  const resources = {
    league: async function(id) {return await League.findById(ObjectId(id))},
    user: async function(id) {return await User.findById(ObjectId(id))},
    team: async function(id) {return await Team.findById(ObjectId(id))},
  }

  const id = req.params.id;
  if (!id) {
    return errorHandler.apiError(res, 'ID is required', 400);
  }

  if (!/[A-Fa-f0-9]{24}/g.test(id)) {
    return errorHandler.apiError(res, 'Invalid ID', 400);
  }

  // get route resource
  let query = req.url.split('/')[1];

  // strip plural resource names
  if(query.endsWith('s')) {
    query = query.slice(0, query.length -1);
  }
  const resource = await resources[query].call(null, id);

  if(!resource) {
    return errorHandler.apiError(res, 'Resource not found', 404);
  }

  req[query] = resource
  next();
}

function authorizeRoute(req, res, next) {
  try {
    const authorization = req.headers.authorization;
    if (!authorization || authorization !== config.authorization) {
      return errorHandler.apiError(res, 'Unauthorized access', 401);
    }

    next();
  } catch (error) {
    winston.error(error)
    res.sendStatus(500);
  }
}

module.exports = {
  fetchResource,
  authorizeRoute,
}
