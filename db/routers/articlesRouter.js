const articlesRouter = require('express').Router();
const {
	getArticles,
	getArticlesById,
	addToArticleVotes,
	getArticleComments,
	addComment
} = require('../controllers/articlesController');
const { send405Error } = require('../errors/index');

articlesRouter.route('/').get(getArticles).all(send405Error);
articlesRouter.route('/:article_id').get(getArticlesById).patch(addToArticleVotes).all(send405Error);
articlesRouter.route('/:article_id/comments').get(getArticleComments).post(addComment).all(send405Error);

module.exports = articlesRouter;
