const winston = require('winston');

/**
 * upload a single file to cloudinary
 * @param {Object} res express res object to handle returning.
 * @param {String} message custom error message.
 * @param {Number} statusCode error status code.
 */
function apiError(res, message, statusCode) {
  winston.error(`API Error: ${message}`);
  return res.status(statusCode).json(message)
}

module.exports = {
  apiError
}
