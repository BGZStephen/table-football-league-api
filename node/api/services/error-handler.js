const winston = require('winston');

function apiError(res, message, statusCode) {
  winston.error(`API Error: ${message}`);
  return res.status(statusCode).send(message)
}

module.exports = {
  apiError
}
