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
			return request(app).get('/api/topics').expect(200).then((res) => {
				expect(res.body).to.be.an('array');
				expect(res.body[0]).to.contain.keys('slug', 'description');
			});
		});
	});
	describe('/users', () => {
		it('GET 200: responds with an array of user user objects', () => {
			return request(app).get('/api/users').then((user) => {
				expect(user.body).to.be.an('array');
				expect(user.body[0]).to.contain.keys('username', 'name', 'avatar_url');
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
		it('GET 200: responds with an array of article objects', () => {
			return request(app).get('/api/articles').expect(200).then((articles) => {
				expect(articles.body).to.be.an('array');
				expect(articles.body[0]).to.contain.keys(
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
		it('GET 200: responds with an array of article objects sorted by the created_at in descending order as default', () => {
			return request(app).get('/api/articles').expect(200).then((res) => {
				expect(res.body).to.be.an('array');
				expect(res.body).to.be.sortedBy('created_at', { descending: true });
			});
		});
		it('GET 200: responds with an array of article objects sorted by the topic specified in query and ordered as specified', () => {
			return request(app).get('/api/articles?sort_by=votes&&order_by=asc').expect(200).then((res) => {
				expect(res.body).to.be.an('array');
				expect(res.body).to.be.sortedBy('votes', { ascending: true });
			});
		});
		it.only('GET 200: responds with an array of article objects by a certain author', () => {
			return request(app).get('/api/articles?author=icellusedkars').expect(200).then((res) => {
				expect(res.body).to.be.an('array');
				expect(res.body[0]).to.contain.keys(
					'article_id',
					'title',
					'body',
					'votes',
					'topic',
					'author',
					'created_at'
				);
				expect(res.body[0].author).to.equal('icellusedkars');
			});
		});
		it.only('GET 200: responds with an array of article objects that on a certain topic', () => {
			return request(app).get('/api/articles?topic=cats').expect(200).then((res) => {
				expect(res.body).to.be.an('array');
				expect(res.body[0]).to.contain.keys(
					'article_id',
					'title',
					'body',
					'votes',
					'topic',
					'author',
					'created_at'
				);
				expect(res.body[0].topic).to.equal('cats');
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
				it('POST 201: takes an object of username and body then responds with users comment', () => {
					return request(app)
						.post('/api/articles/1/comments')
						.send({ username: 'butter_bridge', body: 'VERY NICE' })
						.expect(201)
						.then((res) => {
							expect(res.body).to.be.an('object');
							expect(res.body).to.contain.keys(
								'comment_id',
								'author',
								'article_id',
								'votes',
								'created_at',
								'body'
							);
							expect(res.body.author).to.equal('butter_bridge');
							expect(res.body.body).to.equal('VERY NICE');
						});
				});
				it('GET 200: responds with an array of comments for a given article', () => {
					return request(app).get('/api/articles/1/comments').expect(200).then((res) => {
						expect(res.body).to.be.an('array');
						expect(res.body[0]).to.contain.keys(
							'comment_id',
							'author',
							'article_id',
							'votes',
							'created_at',
							'body'
						);
						expect(res.body[0].article_id).to.equal(1);
					});
				});
				it('GET 200: responds with an array of comment objects ordered most recent first as a default i.e. created_at & descending', () => {
					return request(app).get('/api/articles/1/comments').expect(200).then((res) => {
						expect(res.body).to.be.sortedBy('created_at', { descending: true });
					});
				});
				it('GET 200: responds with an array of comment objects sorted by the column specified in query and ordered as specified', () => {
					return request(app)
						.get('/api/articles/1/comments?sort_by=votes&&order_by=asc')
						.expect(200)
						.then((res) => {
							expect(res.body).to.be.sortedBy('votes', { ascending: true });
						});
				});
			});
		});
	});
});
