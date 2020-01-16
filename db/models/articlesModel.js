const connection = require('../connection');

const selectArticles = () => {
	return connection.select('*').from('articles');
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

const postComment = () => {
	console.log('HELLO');
};

// for changeArticle we're adding one to the vote - don't use update something similar that accounts for everything you care about looking after

module.exports = { selectArticles, selectArticlesById, incrementVote, postComment };
