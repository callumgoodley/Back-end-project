const { selectComments } = require('../models/commentsModel');

const getComments = (req, res, next) => {
	selectComments().then(() => {
		console.log('hello');
	});
};

module.exports = { getComments };
