const connection = require('../connection');

const selectUsers = () => {
	return connection.select('*').from('users');
};

const selectUsersById = (username) => {
	return connection('users').first('*').where('username', username).then((user) => {
		if (!user)
			return Promise.reject({
				status: 404,
				msg: 'Not found'
			});
		return { user };
	});
};

module.exports = { selectUsers, selectUsersById };
