const articlesRouter = require('express').Router();
const {
	getArticles,
	getArticlesById,
	addToArticleVotes,
	addArticleComment
} = require('../controllers/articlesController');

articlesRouter.route('/').get(getArticles);
articlesRouter.route('/:article_id').get(getArticlesById).patch(addToArticleVotes);
articlesRouter.route('/:article_id/comments').post(addArticleComment);

module.exports = articlesRouter;
