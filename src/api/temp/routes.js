const express = require('express');
const handle = require('./handlers.js');

const temp_app = express();

temp_app.all('*', (req, res, next) => {
    console.log('temp_app.all *');
    next();
});

temp_app.get('/', handle.temp_handler);

module.exports = temp_app;
