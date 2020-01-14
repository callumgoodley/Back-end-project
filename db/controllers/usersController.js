const { selectUsers } = require('../models/usersModel');

const getUsers = (req, res, next) => {
	console.log(req.body);
	selectUsers().then((user) => {
		res.status(200).send({ user });
	});
	// .catch(next);
};

module.exports = { getUsers };
