const { selectComments, selectCommentById, incrementVote, deleteComment } = require('../models/commentsModel');

const getComments = (req, res, next) => {
	selectComments()
		.then((comments) => {
			res.status(200).send({ comments });
		})
		.catch(next);
};

const getCommentById = (req, res, next) => {
	const comment_id = req.params.comment_id;
	selectCommentById(comment_id)
		.then((comment) => {
			res.status(200).send(comment);
		})
		.catch(next);
};

const addToCommentVotes = (req, res, next) => {
	const comment_id = req.params.comment_id;
	const incrementBy = req.body.inc_votes;
	incrementVote(incrementBy, comment_id)
		.then((comment) => {
			res.status(200).send(comment);
		})
		.catch(next);
};

const removeComment = (req, res, next) => {
	const comment_id = req.params.comment_id;
	deleteComment(comment_id)
		.then(() => {
			res.status(204).send();
		})
		.catch(next);
};

module.exports = { getComments, getCommentById, addToCommentVotes, removeComment };
