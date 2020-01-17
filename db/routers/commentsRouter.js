const commentsRouter = require('express').Router();
const { getComments } = require('../controllers/articlesController');

commentsRouter.route('/').get(getComments);

module.exports = { commentsRouter };
