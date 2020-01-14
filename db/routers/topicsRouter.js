const topicsRouter = require('express').Router();
const { getTopics } = require('../controllers/topicsController');

topicsRouter.route('/').get(getTopics);

module.exports = topicsRouter;
