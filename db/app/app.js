const express = require('express');
const app = express();

const apiRouter = require('../routers/apiRouter');

app.use('/api', apiRouter);

app.use(function(err, req, res, next) {
	console.log(err);
});

module.exports = app;
