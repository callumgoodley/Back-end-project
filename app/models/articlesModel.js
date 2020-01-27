const connection = require('../../db/connection');

const checkAuthorExists = (queryObj) => {
	const key = Object.keys(queryObj)[0];
	const value = queryObj[key];
	return connection.select('*').from(`users`).where(`username`, value).then((result) => {
		if (result.length === 0)
			return Promise.reject({
				status: 404,
				msg: 'Not Found'
			});
		else return [];
	});
};
const checkTopicExists = (queryObj) => {
	const key = Object.keys(queryObj)[0];
	const value = queryObj[key];
	return connection.select('*').from(`topics`).where(`slug`, value).then((result) => {
		if (result.length === 0)
			return Promise.reject({
				status: 404,
				msg: 'Not Found'
			});
		else return [];
	});
};

const checkArticleExists = (article_id) => {
	return connection.select('*').from('articles').where('article_id', article_id).then((result) => {
		if (result.length === 0)
			return Promise.reject({
				status: 404,
				msg: 'Not found'
			});
		else return [];
	});
};

const selectArticles = (queryObj) => {
	return connection
		.select('articles.*')
		.count({ comment_count: 'comment_id' })
		.from('articles')
		.leftJoin('comments', 'articles.article_id', 'comments.article_id')
		.orderBy(queryObj.sort_by || 'created_at', queryObj.order || 'desc')
		.groupBy('articles.article_id')
		.modify((query) => {
			if (queryObj.author) query.where({ 'articles.author': queryObj.author });
			if (queryObj.topic) query.where({ 'articles.topic': queryObj.topic });
		})
		.then((articles) => {
			if (articles.length === 0 && queryObj.author) {
				return checkAuthorExists(queryObj);
			} else if (articles.length === 0 && !queryObj.topic) {
				return Promise.reject({
					status: 404,
					msg: 'Not Found'
				});
			} else {
				return articles;
			}
		})
		.then((articles) => {
			if (articles.length === 0 && queryObj.topic) {
				return checkTopicExists(queryObj);
			} else if (articles.length === 0 && !queryObj.author) {
				return Promise.reject({
					status: 404,
					msg: 'Not Found'
				});
			} else {
				return articles;
			}
		});
};

const selectArticlesById = (article_id) => {
	return connection
		.first('articles.*')
		.count({ comment_count: 'comment_id' })
		.from('articles')
		.leftJoin('comments', 'articles.article_id', 'comments.article_id')
		.orderBy('article_id')
		.groupBy('articles.article_id')
		.where('articles.article_id', article_id)
		.then((article) => {
			if (!article)
				return Promise.reject({
					status: 404,
					msg: 'Not found'
				});
			article.comment_count = Number(article.comment_count);
			return article;
		});
};

const incrementVote = (incrementBy, article_id) => {
	return connection
		.first('articles.*')
		.count({ comment_count: 'comment_id' })
		.from('articles')
		.leftJoin('comments', 'articles.article_id', 'comments.article_id')
		.orderBy('article_id')
		.groupBy('articles.article_id')
		.where('articles.article_id', article_id)
		.then((article) => {
			if (!incrementBy) return article;
			if (typeof incrementBy !== 'number')
				return Promise.reject({
					status: 400,
					msg: 'Bad request'
				});
			article.comment_count = Number(article.comment_count);
			return article;
		})
		.then((article) => {
			article.votes += incrementBy;
			return article;
		});
};

const insertComment = (comment, article_id) => {
	if ('username' in comment && 'body' in comment) {
		const formatComment = { ...comment };
		formatComment.author = formatComment.username;
		formatComment.article_id = article_id;
		delete formatComment.username;

		return connection('comments')
			.insert(formatComment)
			.returning('*')
			.where({
				article_id: formatComment.article_id,
				body: formatComment.body,
				author: formatComment.author
			})
			.then((comment) => {
				return comment[0];
			});
	} else
		return Promise.reject({
			status: 400,
			msg: 'Bad request'
		});
};

const selectComments = (article_id, query) => {
	return connection
		.select('comments.*')
		.from('comments')
		.where({
			article_id: article_id
		})
		.orderBy(query.sort_by || 'created_at', query.order || 'desc')
		.then((comments) => {
			if (comments.length === 0 && article_id) {
				return checkArticleExists(article_id);
			} else if (comments.length === 0 && !article_id) {
				return Promise.reject({
					status: 404,
					msg: 'Not Found'
				});
			} else {
				return comments;
			}
		});
};

module.exports = { selectArticles, selectArticlesById, incrementVote, selectComments, insertComment };
