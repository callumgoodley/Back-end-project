const express = require('express');
const app = express();

const apiRouter = require('../routers/apiRouter');

app.use(express.json());
app.use('/api', apiRouter);

app.use((err, req, res, next) => {
	console.log(err);
	if (err.status) res.status(err.status).send({ msg: err.message });
	else next(err);
});

app.use((err, req, res, next) => {
	const psqlCodes = {
		'42703': err.msg,
		'22P02': err.msg
	};

	if (Object.keys(psqlCodes).includes(err.code)) res.status(400).send({ msg: err.message });
	else next(err);
});

app.use(function(err, req, res, next) {
	res.status(500).send({ msg: 'Internal Server Error' });
});

module.exports = app;
