const commentsRouter = require('express').Router();
const { getComments, getCommentById, addToCommentVotes, removeComment } = require('../controllers/commentsController');
const { send405Error } = require('../errors/index');

commentsRouter.route('/').get(getComments).all(send405Error);
commentsRouter
	.route('/:comment_id')
	.get(getCommentById)
	.patch(addToCommentVotes)
	.delete(removeComment)
	.all(send405Error);

module.exports = commentsRouter;
