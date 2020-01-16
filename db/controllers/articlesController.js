const { selectArticles, selectArticlesById, incrementVote, postComment } = require('../models/articlesModel');

const getArticles = (req, res, next) => {
	selectArticles()
		.then((articles) => {
			res.status(200).send({ articles });
		})
		.catch(next);
};

const getArticlesById = (req, res, next) => {
	const article_id = req.params.article_id;
	selectArticlesById(article_id)
		.then((article) => {
			res.status(200).send({ article }.article);
		})
		.catch(next);
};

const addToArticleVotes = (req, res, next) => {
	const incrementBy = req.body.inc_votes;
	const article_id = req.params.article_id;
	incrementVote(incrementBy, article_id)
		.then((article) => {
			res.status(200).send({ article }.article);
		})
		.catch(next);
};
const addArticleComment = () => {
	console.log('HELLO');
	postComment();
};

module.exports = { getArticles, getArticlesById, addToArticleVotes, addArticleComment };
