const io = require('@pm2/io')
const express = require('express');
const bodyParser = require('body-parser');
const expressip = require('express-ip');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(expressip().getIpInfoMiddleware);

app.use((req: any, res: any, next: any) => {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN);

  // Request methods you wish to allow
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );

  // Request headers you wish to allow
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type,X-Auth-Code'
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.use(io.expressErrorHandler())

require('./routes')(app);

export default app;