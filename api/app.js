global.ENV = process.env.NODE_ENV || 'development';
const config = require('./config')
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const winston = require('winston');
const errorUtils = require('./utils/error-utils');

// bootstrap models
require('./models');

// db connection
mongoose.connect(config.database);

mongoose.connection.on('connected', () => {
  winston.info('Database connection successful');
});

mongoose.connection.on('error', (error) => {
  winston.error(`Error: ${error}`);
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

app.use('/admin', require('./routes/admin'));
app.use('/private', require('./routes/private'));
app.use(require('./routes/public'));

// error handlers
app.use(errorUtils.logErrors);
app.use(errorUtils.errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  app.emit("appStarted");
	winston.info(`Server started successfully`);
});
