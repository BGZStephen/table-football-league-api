function validate(object, params) {
  const errorArray = [];
  Object.keys(params).forEach(function(param) {
    if(!object[param]) {
      errorArray.push(params[param])
    }
  })

  if(errorArray.length > 0) {
    throw new Error(errorArray)
  }
}

module.exports = validate;
