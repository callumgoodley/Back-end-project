const dbConfig = require('../knexfile.js');
const knex = require('knex');

const connection = knex(dbConfig);

module.exports = connection;
