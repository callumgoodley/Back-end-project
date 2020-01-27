const {
	selectArticles,
	selectArticlesById,
	incrementVote,
	selectComments,
	insertComment
} = require('../models/articlesModel');

const getArticles = (req, res, next) => {
	const query = req.query;
	selectArticles(query)
		.then((articles) => {
			res.status(200).send({ articles });
		})
		.catch(next);
};

const getArticlesById = (req, res, next) => {
	const article_id = req.params.article_id;
	selectArticlesById(article_id)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch(next);
};

const addToArticleVotes = (req, res, next) => {
	const incrementBy = req.body.inc_votes;
	const article_id = req.params.article_id;
	incrementVote(incrementBy, article_id)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch(next);
};

const addComment = (req, res, next) => {
	const commentObj = req.body;
	const article_id = req.params.article_id;

	insertComment(commentObj, article_id)
		.then((comment) => {
			res.status(201).send({ comment });
		})
		.catch(next);
};

const getArticleComments = (req, res, next) => {
	const article_id = req.params.article_id;
	const query = req.query;
	selectComments(article_id, query)
		.then((comments) => {
			res.status(200).send({ comments });
		})
		.catch(next);
};

module.exports = { getArticles, getArticlesById, addToArticleVotes, getArticleComments, addComment };
