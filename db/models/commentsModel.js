const connection = require('../connection');

const selectComments = () => {
	return connection.select('*').from('comments');
};

const selectCommentById = (comment_id) => {
	return connection('comments').first('*').where('comment_id', comment_id).then((result) => {
		return result;
	});
};

const incrementVote = (incrementBy, comment_id) => {
	return connection('comments').first('*').where('comment_id', comment_id).then((comment) => {
		comment.votes += incrementBy;
		return comment;
	});
};

const deleteComment = (comment_id) => {
	return connection('comments').where('comment_id', comment_id).del();
};
module.exports = { selectComments, selectCommentById, incrementVote, deleteComment };
