const usersRouter = require('express').Router();
const { getUsers, getUsersById } = require('../controllers/usersController');
const { send405Error } = require('../errors/index');

usersRouter.route('/').get(getUsers).all(send405Error);
usersRouter.route('/:username').get(getUsersById).all(send405Error);
module.exports = usersRouter;
