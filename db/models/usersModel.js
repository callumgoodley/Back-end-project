const connection = require('../connection');

const selectUsers = () => {
	return connection.select('*').from('users');
};

module.exports = { selectUsers };
