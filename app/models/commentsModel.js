const connection = require('../../db/connection');

const selectComments = () => {
	return connection.select('*').from('comments');
};

const selectCommentById = (comment_id) => {
	return connection('comments').first('*').where('comment_id', comment_id).then((result) => {
		return result;
	});
};

const checkCommentExists = (increment_by, comment_id) => {
	return connection.select('*').from(`comments`).where(`comment_id`, comment_id).then((result) => {
		if (result.length === 0)
			return Promise.reject({
				status: 404,
				msg: 'Not Found'
			});
		else return 0;
	});
};

const incrementVote = (increment_by, comment_id) => {
	if (!increment_by) increment_by = 0;
	return connection('comments')
		.select('*')
		.where('comment_id', comment_id)
		.increment('votes', increment_by)
		.returning('*')
		.then((comment) => {
			if (comment.length === 0 && comment_id) {
				return checkCommentExists(increment_by, comment_id);
			} else if (!increment_by) {
				return comment[0];
			}
			return comment[0];
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
