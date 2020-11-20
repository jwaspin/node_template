const fs = require('fs');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');

const apiRoutes = require('./api/routes.js');

const PORT = 80;

const app = express();
app.use(bodyParser.json());
app.use(compression());

var httpServer = http.createServer(app);

app.all('*', (req, res, next) => {
  var remoteAddress = req.connection.remoteAddress;
  var ip = req.headers['x-forwarded-for'];
  var message = `\n${new Date()}\n${req.method} ${req.url}\nremote: ${remoteAddress}\nforward: ${ip}`;
  console.log(message);
  next();
});

app.get('/', (req, res) => {
  var dir = `${__dirname}/`;
  if ( fs.existsSync(`${dir}index.html`) ) {
    res.sendFile(`${dir}index.html`, () => {
      console.log('index.html sent');
    });
  } else {
    res.status(501).send('Page unavailable, please try again later');
    console.log('Cannot find index.html');
  }
});

app.get('/health', (req, res) => {
  res.status(200).end();
});

app.use('/api', apiRoutes);

httpServer.listen(PORT);
