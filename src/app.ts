import { config } from './config';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as cors from 'cors';
import * as errorUtils from './utils/error-utils';
import * as Debug from 'debug';

const debug = Debug('api')

// bootstrap models
require('./models');

// db connection
mongoose.connect(config.database, {
  useCreateIndex: true,
  useNewUrlParser: true
});

mongoose.connection.on('connected', () => {
  debug('DB connected')
});

mongoose.connection.on('error', (err) => {
  debug(`DB connection error: ${err}`)
})

const app = express()

// middlewares
app.use(cors())

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

app.use('/', require('./routes/public'));

// error handlers
app.use(errorUtils.logErrors);
app.use(errorUtils.errorHandler);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  debug(`Server started on port ${port}, environment ${config.env}`)
});
