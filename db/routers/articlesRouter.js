const articlesRouter = require('express').Router();
const {
	getArticles,
	getArticlesById,
	addToArticleVotes,
	getArticleComments,
	addComment
} = require('../controllers/articlesController');

articlesRouter.route('/').get(getArticles);
articlesRouter.route('/:article_id').get(getArticlesById).patch(addToArticleVotes);
articlesRouter.route('/:article_id/comments').get(getArticleComments).post(addComment);

module.exports = articlesRouter;
