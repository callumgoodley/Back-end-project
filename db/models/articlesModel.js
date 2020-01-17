const connection = require('../connection');

const selectArticles = (query) => {
	const { sort_by = 'created_at', order_by = 'desc' } = query;
	return connection.select('*').from('articles').orderBy(sort_by, order_by).then((articles) => {
		return articles;
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
			if (!article)
				return Promise.reject({
					status: 404,
					msg: 'Not found'
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
};

const selectComments = (article_id, query) => {
	return connection
		.select('*')
		.from('comments')
		.where({
			article_id: article_id
		})
		.orderBy(query.sort_by || 'created_at', query.order_by || 'desc')
		.then((comments) => {
			return comments;
		});
};

module.exports = { selectArticles, selectArticlesById, incrementVote, selectComments, insertComment };
