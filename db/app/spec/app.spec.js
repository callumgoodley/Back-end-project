process.env.NODE_ENV = 'test';
const app = require('../app');
const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('sams-chai-sorted'));
const connection = require('../../connection');
const types = require('pg').types;

describe('/api', () => {
	beforeEach(() => connection.seed.run());
	after(() => connection.destroy());
	describe('/topics', () => {
		it('GET 200: responds with an array of topic objects', () => {
			return request(app).get('/api/topics').expect(200).then((topics) => {
				expect(topics.body.topics).to.be.an('array');
				expect(topics.body.topics[0]).to.contain.keys('slug', 'description');
			});
		});
	});
	describe('/users', () => {
		it('GET 200: responds with an array of user topic objects', () => {
			return request(app).get('/api/users').then((user) => {
				expect(user.body.user).to.be.an('array');
				expect(user.body.user[0]).to.contain.keys('username', 'name', 'avatar_url');
			});
		});
		describe('/:username', () => {
			it('GET 200: responds with a specified user object according to username', () => {
				return request(app).get('/api/users/butter_bridge').then((user) => {
					expect(user.body).to.be.an('object');
					expect(user.body).to.contain.keys('username', 'name', 'avatar_url');
					expect(user.body.username).to.equal('butter_bridge');
				});
			});
			it('GET 404: responds with 404 not found when a request is made on for username that does not exist', () => {
				return request(app).get('/api/users/callumgoodley').expect(404);
			});
		});
	});
	describe('/articles', () => {
		it('GET 200: responds with an array of topic objects', () => {
			return request(app).get('/api/articles').expect(200).then((articles) => {
				expect(articles.body.articles).to.be.an('array');
				expect(articles.body.articles[0]).to.contain.keys(
					'article_id',
					'title',
					'body',
					'votes',
					'topic',
					'author',
					'created_at'
				);
			});
		});
		describe('/:article_id', () => {
			it('GET 200: responds with a specified article object according to article_id', () => {
				return request(app).get('/api/articles/1').then((article) => {
					expect(article.body).to.be.an('object');
					expect(article.body).to.contain.keys(
						'article_id',
						'title',
						'body',
						'votes',
						'topic',
						'author',
						'created_at',
						'comment_count'
					);
					expect(article.body.article_id).to.equal(1);
					expect(article.body.comment_count).to.equal(13);
				});
			});
			it('takes increment votes obj and adds the value to article votes', () => {
				return request(app).patch('/api/articles/1').send({ inc_votes: 1 }).expect(200).then((res) => {
					expect(res.body).to.eql({
						article_id: 1,
						title: 'Living in the shadow of a great man',
						body: 'I find this existence challenging',
						votes: 101,
						topic: 'mitch',
						author: 'butter_bridge',
						created_at: '+050843-01-19T05:02:51.000Z',
						comment_count: 13
					});
				});
			});
			it('GET 404: responds with 404 not found when a valid request is made for article that does not exist', () => {
				return request(app).get('/api/articles/43364').expect(404);
			});
			it('GET 400: responds with 400 when a invalid request is made', () => {
				return request(app).get('/api/articles/43g364').expect(400);
			});
			describe('/comments', () => {
				it.only('takes an object of username and body then responds with users comment', () => {
					return request(app)
						.get('/api/articles/1/comments')
						.send({ username: 'callumG', body: 'I love coding' })
						.expect(201)
						.then((res) => {
							console.log(res.body);
							expect(res.body).to.eql({ username: 'callumG', body: 'I love coding' });
						});
				});
			});
		});
	});
});
