const { selectTopics } = require('../models/topicsModel');

const getTopics = function(req, res, next) {
	selectTopics().then((topics) => {
		res.status(200).send({ topics });
	});
	// .catch((next) => {
	// 	next;
	// });
};

module.exports = { getTopics };
