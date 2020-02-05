const connection = require('../../db/connection');

const selectComments = () => {
	return connection.select('*').from('comments');
};

const selectCommentById = (comment_id) => {
	return connection('comments').first('*').where('comment_id', comment_id).then((result) => {
		return result;
	});
};

const incrementVote = (incrementBy, comment_id) => {
	return connection('comments')
		.first('*')
		.where('comment_id', comment_id)
		.increment('votes', increment_by)
		.then((comment) => {
			if (!comment) {
				return Promise.reject({
					status: 404,
					msg: 'Not found'
				});
			} else if (!incrementBy) {
				return comment;
			}
			comment.votes += incrementBy;
			return comment;
		});
};

const deleteComment = (comment_id) => {
	return connection.select('*').from('comments').where('comment_id', comment_id).then((result) => {
		if (result.length === 0)
			return Promise.reject({
				status: 404,
				msg: 'Not found'
			});
		else return connection('comments').where('comment_id', comment_id).del();
	});
};
module.exports = { selectComments, selectCommentById, incrementVote, deleteComment };
