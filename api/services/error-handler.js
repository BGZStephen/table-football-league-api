const winston = require('winston');

/**
 * prepare api error for error middleware
 * @param {object} params params object.
 * @param {string} params.message custom error message.
 * @param {number} params.statusCode error status code.
 */
function apiError(params, next) {
  res.context.clientError = true;
  res.context.message = params.message || 'Something went wrong';
  res.context.statusCode = params.statusCode || 500;
  next();
}

module.exports = {
  apiError
}
