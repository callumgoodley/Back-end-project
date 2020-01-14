const connection = require('../connection');

const selectTopics = () => {
	return connection.select('*').from('topics');
};

module.exports = { selectTopics };
