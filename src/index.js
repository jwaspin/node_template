require('dotenv').config();

const fs = require('fs');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');

const apiRoutes = require('./api/routes.js');
const logger = require('./logger/logger.js');

const PORT = process.env.PORT || 8888;

const app = express();
app.use(bodyParser.json());
app.use(compression());

const httpServer = http.createServer(app);

app.all('*', (req, res, next) => {
  const { remoteAddress } = req.connection;
  const ip = req.headers['x-forwarded-for'];
  const message = `\n${new Date()}\n${req.method} ${req.url}\nremote: ${remoteAddress}\nforward: ${ip}`;
  logger.info(message);
  next();
});

app.get('/', (req, res) => {
  const dir = `${__dirname}/`;
  if (fs.existsSync(`${dir}index.html`)) {
    res.sendFile(`${dir}index.html`, () => {
      logger.info('index.html sent');
    });
  } else {
    res.status(501).send('Page unavailable, please try again later');
    logger.warn('Cannot find index.html');
  }
});

app.get('/health', (req, res) => {
  res.status(200).end();
});

app.use('/api', apiRoutes);

httpServer.listen(PORT, () => {
  logger.info(`NODE_ENV: ${process.env.NODE_ENV}`);
  logger.info(`API listening on port ${PORT}`);
});
