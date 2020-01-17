const connection = require('../connection');

const selectComments = () => {
	return connection.select('*').from('comments');
};

module.exports = { selectComments };
