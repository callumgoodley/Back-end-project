const { topicData, articleData, commentData, userData } = require('../data/index.js');

const { formatDates, formatComments, makeRefObj } = require('../utils/utils');

exports.seed = function(knex) {
	return knex.migrate.rollback().then(() => knex.migrate.latest()).then(() => {
		const topicsInsertions = knex('topics').insert(topicData).returning('*');
		const usersInsertions = knex('users').insert(userData).returning('*');

		return Promise.all([ topicsInsertions, usersInsertions ]).then(([ insertedTopicData, insertedUserData ]) => {
			const formattedArticles = formatDates(articleData);

			return knex('articles').insert(formattedArticles).returning('*').then((articleRows) => {
				const articleRef = makeRefObj(articleRows, 'title', 'article_id');
				const formattedComments = formatComments(commentData, articleRef);
				const formattedCommentDates = formatDates(formattedComments);

				return knex('comments').insert(formattedCommentDates);
			});
		});
	});
};
