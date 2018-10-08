global.ENV = process.env.NODE_ENV || 'development';
const config = require('./config')
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const errorUtils = require('./utils/error-utils');
const debug = require('debug')('app');

// bootstrap models
require('./models');

// db connection
mongoose.connect(config.database, {
  useCreateIndex: true,
  useNewUrlParser: true
});

mongoose.connection.on('connected', () => {
  debug('db connected')
});

mongoose.connection.on('error', (err) => {
  debug(`db error: ${err}`)
})

const app = express()

// middlewares
app.use(cors())

// static folder for public views
app.use(express.static(path.join(__dirname, '../public')));

// body partser initialize
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.error = function(params) {
    return res.status(params.statusCode).json({
      message: params.message
    })
  };

  next();
});

app.use('/public', require('./routes/public'));
// app.use('/private', require('./routes/private'));

// error handlers
app.use(errorUtils.logErrors);
app.use(errorUtils.errorHandler);

const port = process.env.PORT || 3000;
app.listen(port);
