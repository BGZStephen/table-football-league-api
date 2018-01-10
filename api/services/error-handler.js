const winston = require('winston');

/**
 * upload a single file to cloudinary
 * @param {Object} res express res object to handle returning.
 * @param {String} message custom error message.
 * @param {Number} statusCode error status code.
 */
function apiError(message, statusCode, next) {
  res.context.clientError = true;
  res.context.message = message || 'Something went wrong';
  res.context.statusCode = statusCode || 500;
  next();
}

module.exports = {
  apiError
}
