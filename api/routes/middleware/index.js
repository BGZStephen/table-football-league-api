const mongoose = require('mongoose');
const winston = require('winston');
const config = require('../../config')
const errorHandler = require('../../services/error-handler');

const User = mongoose.model('User');
const League = mongoose.model('League');
const Team = mongoose.model('Team');
const ObjectId = mongoose.Types.ObjectId;

/**
 * Fetch a mongoose resource
 * @param {Object} req express request object
 * @param {Object} req.params url params
 * @param {ObjectId} req.params.id resource ID
 * @param {object} res express response object
 * @param {callback} next middleware progression callback
 */
const fetchResource = AsyncWrap(async function (req, res, next) {
  const resources = {
    league: async function(id) {return await League.findById(ObjectId(id))},
    user: async function(id) {return await User.findById(ObjectId(id))},
    team: async function(id) {return await Team.findById(ObjectId(id))},
  }

  const id = req.params.id;
  if (!id) {
    return errorHandler.apiError({message: 'ID is required', statusCode: 400});
  }

  if (!/[A-Fa-f0-9]{24}/g.test(id)) {
    return errorHandler.apiError({message: 'Invalid ID', statusCode: 400});
  }

  // get route resource
  let query = req.url.split('/')[1];

  // strip plural resource names
  if(query.endsWith('s')) {
    query = query.slice(0, query.length -1);
  }
  const resource = await resources[query].call(null, id);

  if(!resource) {
    return errorHandler.apiError({message: 'Resource not found', statusCode: 404});
  }

  req[query] = resource;
  next();
})

/**
 * Validate website authorization token presence in headers for website api calls
 * @param {Object} req express request object
 * @param {Object} req.headers request headers
 * @param {String} [req.headers.authorization] authorization token
 * @param {object} res express response object
 * @param {callback} next middleware progression callback
 */
function authorizeWebsiteRoute(req, res, next) {
  try {
    const authorization = req.headers.authorization;
    if (!authorization || (authorization !== config.authorization.website)) {
      return errorHandler.apiError({message: 'Unauthorized access', statusCode: 401});
    }

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Validate website authorization token presence in headers for dashboard api calls
 * @param {Object} req express request object
 * @param {Object} req.headers request headers
 * @param {String} [req.headers.authorization] authorization token
 * @param {object} res express response object
 * @param {callback} next middleware progression callback
 */
function authorizeDashboardRoute(req, res, next) {
  try {
    const authorization = req.headers.authorization;
    if (!authorization || (authorization !== config.authorization.dashboard)) {
      errorHandler.apiError({message: 'Unauthorized access', statusCode: 401});
    }

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Validate website authorization token presence in headers for admin api calls
 * @param {Object} req express request object
 * @param {Object} req.headers request headers
 * @param {String} [req.headers.authorization] authorization token
 * @param {object} res express response object
 * @param {callback} next middleware progression callback
 */
function authorizeAdminRoute(req, res, next) {
  try {
    const authorization = req.headers.authorization;
    if (!authorization || (authorization !== config.authorization.admin)) {
      return errorHandler.apiError({message: 'Unauthorized access', statusCode: 401});
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  fetchResource,
  authorizeWebsiteRoute,
  authorizeAdminRoute,
  authorizeDashboardRoute,
}
