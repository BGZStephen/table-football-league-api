function logErrors (err, req, res, next) {
  if (global.env === 'development') {
    console.error(err)
  }
  next(err)
}

// handle client errors which have custom error responses
function clientErrorHandler (err, req, res, next) {
  if (res.context.clientError) {
    return res.status(res.context.statusCode).send({message: res.context.message})
  }

  next(err);
}

// handle all express generated errors with stacks
function errorHandler (err, req, res, next) {
  res.status(500).send({message: err.message});
}

module.exports = {
  logErrors,
  errorHandler,
  clientErrorHandler,
}
