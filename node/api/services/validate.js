/**
 * Validate existance of keys on an object, return array of string represented
 * error messages if any keys are missing.
 * @param {Object} object object to validate existance of keys on.
 * @param {Object} params an object representation of expected keys whos values represent
 *                        an error message to send if key is missing on .
 */
function validate(objectToValidate, validationParams) {
  const errorArray = [];
  Object.keys(validationParams).forEach(function(param) {
    if(!objectToValidate[param]) {
      errorArray.push(params[param])
    }
  })

  if(errorArray.length > 0) {
    throw new Error(errorArray)
  }
}

module.exports = validate;
