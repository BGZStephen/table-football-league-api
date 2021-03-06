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

mongoose.connection.on('error', (err: Error) => {
  debug(`DB connection error: ${err}`)
})

const app = express()

// middlewares
app.use(cors())

// body partser initialize
app.use(bodyParser.json());

app.use(function(req: express.Request, res: express.Response, next: express.NextFunction) {
  res.error = function(params) {
    res.statusMessage = params.message;
    return res.status(params.statusCode).send(params.message)
  };

  next();
});

app.use('/', require('./routes/public'));
app.use('/private', require('./routes/private'));

// error handlers
app.use(errorUtils.logErrors);

const port = parseInt(process.env.PORT) || 3000;

app.listen(port, () => {
  debug(`Server started on port ${port}, environment ${config.env}`)
});
