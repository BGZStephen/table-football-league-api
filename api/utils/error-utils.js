function logErrors (err, req, res, next) {
  if (global.env === 'development') {
    console.error(err)
  }
  next(err)
}

// handle client errors which have custom error responses
function clientErrorHandler (err, req, res, next) {
  // if stack is available it is not a custom clientError, pass to generic error handler
  if(err.stack) {
    next(err)
  }

  if (req.method === 'POST' || req.method === 'GET' || req.method === 'PUT' || req.method === 'DELETE') {
    res.status(err.statusCode || 500).send({ error: err.message || 'Something went wrong' })
  }
}

// handle all express generated errors with stacks
function errorHandler (err, req, res, next) {
  res.status(500).send({error: err.message});
}

module.exports = {
  logErrors,
  errorHandler,
  clientErrorHandler,
}
