const { selectUsers, selectUsersById } = require('../models/usersModel');

const getUsers = (req, res, next) => {
	selectUsers()
		.then((user) => {
			res.status(200).send({ user });
		})
		.catch(next);
};

const getUsersById = (req, res, next) => {
	const params = req.params;
	const username = params.username;
	selectUsersById(username)
		.then((user) => {
			res.status(200).send({ user }.user);
		})
		.catch(next);
};

module.exports = { getUsers, getUsersById };
