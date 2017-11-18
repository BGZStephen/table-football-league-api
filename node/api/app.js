global.ENV = process.env.NODE_ENV || 'development';
const config = require('./config')
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const winston = require('winston');

// make models globally available
require('./models');

// db connection
mongoose.connect('mongodb://stephen:klapaucius@ds137540.mlab.com:37540/bgzstephen-table-football-league');

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

app.use(require('./routes/public'));
app.use(require('./routes/private'));

const port = 3000;
app.listen(port, () => {
  app.emit("appStarted");
	winston.info(`Server started successfully`);
});
