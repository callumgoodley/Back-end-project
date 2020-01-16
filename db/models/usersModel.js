const connection = require('../connection');

const selectUsers = () => {
	return connection.select('*').from('users');
};

const selectUsersById = (username) => {
	return connection('users').first('*').where('username', username).then((result) => {
		if (!result)
			return Promise.reject({
				status: 404,
				msg: 'Not found'
			});
		return result;
	});
};

module.exports = { selectUsers, selectUsersById };
