const express = require('express');
const tempRoutes = require('./temp/routes.js');

const api = express();

api.use('/temp', tempRoutes);

module.exports = api;
