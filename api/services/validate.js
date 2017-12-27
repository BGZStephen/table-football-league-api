/**
 * Validate existance of keys on an object, return array of string represented
 * error messages if any keys are missing.
 * @param {Object} object object to validate existance of keys on.
 * @param {Object} params an object representation of expected keys whos values represent
 *                        an error message to send if key is missing on.
 * @param {String} params.message error message to return if validation fails.
 * @param {String} params.type expected object value type.
 */
function validateObject(object, params) {
  const errorArray = [];
  Object.keys(params).forEach(function(param) {
    if(!object[param]) {
      return errorArray.push(params[param])
    }

    if (param.type === 'string' && typeof object[param] !== 'string') {
      return errorArray.push(params[param])
    }

    if (param.type === 'number' && typeof object[param] !== 'number') {
      return errorArray.push(params[param])
    }

    if (param.type === 'object' && typeof object[param] !== 'object') {
      return errorArray.push(params[param])
    }

    if (param.type === 'array' && (typeof object[param] !== 'object' && object[param].constructor !== Array)) {
      return errorArray.push(params[param])
    }

    if (param.type === 'date' && (object[param] instanceof Date === false)) {
      return errorArray.push(params[param])
    }
  })

  if(errorArray.length > 0) {
    throw new Error(errorArray)
  }
}

module.exports = validate;
