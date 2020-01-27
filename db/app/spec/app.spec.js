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
	it('INVALID METHOD 405', () => {
		const invalidMethods = [ 'delete' ];
		const methodPromises = invalidMethods.map((method) => {
			return request(app)[method]('/api/topics').expect(405).then(({ body: { msg } }) => {
				expect(msg).to.equal('method not allowed');
			});
		});
		return Promise.all(methodPromises);
	});
	describe('/topics', () => {
		it('GET 200: responds with an array of topic objects', () => {
			return request(app).get('/api/topics').expect(200).then((res) => {
				expect(res.body).to.be.an('object');
				expect(res.body.topics).to.be.an('array');
				expect(res.body.topics[0]).to.contain.keys('slug', 'description');
			});
		});
		it('INVALID METHOD 405', () => {
			const invalidMethods = [ 'patch', 'put', 'delete' ];
			const methodPromises = invalidMethods.map((method) => {
				return request(app)[method]('/api/topics').expect(405).then(({ body: { msg } }) => {
					expect(msg).to.equal('method not allowed');
				});
			});
			return Promise.all(methodPromises);
		});
	});
	describe('/users', () => {
		it('GET 200: responds with an array of user user objects', () => {
			return request(app).get('/api/users').expect(200).then((res) => {
				expect(res.body).to.be.an('object');
				expect(res.body.users).to.be.an('array');
				expect(res.body.users[0]).to.contain.keys('username', 'name', 'avatar_url');
			});
		});
	});
	describe('/:username', () => {
		it('GET 200: responds with a specified user object according to username', () => {
			return request(app).get('/api/users/butter_bridge').expect(200).then((res) => {
				expect(res.body).to.be.an('object');
				expect(res.body.user).to.be.an('object');
				expect(res.body.user).to.contain.keys('username', 'name', 'avatar_url');
				expect(res.body.user.username).to.equal('butter_bridge');
			});
		});
		it('INVALID METHOD 405', () => {
			const invalidMethods = [ 'put' ];
			const methodPromises = invalidMethods.map((method) => {
				return request(app)[method]('/api/topics').expect(405).then(({ body: { msg } }) => {
					expect(msg).to.equal('method not allowed');
				});
			});
			return Promise.all(methodPromises);
		});
		it('GET 404: responds with 404 not found when a request is made on for username that does not exist', () => {
			return request(app).get('/api/users/callumgoodley').expect(404);
		});
	});
	describe('/articles', () => {
		it('GET 200: responds with an array of article objects', () => {
			return request(app).get('/api/articles').expect(200).then((res) => {
				expect(res.body).to.be.an('object');
				expect(res.body.articles).to.be.an('array');
				expect(res.body.articles[0]).to.contain.keys(
					'article_id',
					'title',
					'body',
					'votes',
					'topic',
					'author',
					'created_at',
					'comment_count'
				);
			});
		});
		it('GET 200: responds with an array of article objects sorted by the created_at in descending order as default', () => {
			return request(app).get('/api/articles').expect(200).then((res) => {
				expect(res.body.articles).to.be.sortedBy('create_at', { descending: true });
			});
		});
		it('GET 200: responds with an array of article objects sorted by the topic specified in query and ordered as specified', () => {
			return request(app).get('/api/articles?sort_by=votes&&order=asc').expect(200).then((res) => {
				expect(res.body.articles).to.be.an('array');
				expect(res.body.articles).to.be.sortedBy('votes', { ascending: true });
			});
		});
		it('GET 200: responds with an array of article objects by a certain author', () => {
			return request(app).get('/api/articles?author=icellusedkars').expect(200).then((res) => {
				expect(res.body.articles).to.be.an('array');
				expect(res.body.articles[0]).to.contain.keys(
					'article_id',
					'title',
					'body',
					'votes',
					'topic',
					'author',
					'created_at'
				);
				expect(res.body.articles[0].author).to.equal('icellusedkars');
			});
		});
		it('GET 200: responds with an empty array when author has no articles', () => {
			return request(app).get('/api/articles?author=lurker').expect(200).then((res) => {
				expect(res.body.articles).to.eql([]);
			});
		});
		it('GET 200: responds with an empty array when topic has no articles', () => {
			return request(app).get('/api/articles?topic=paper').expect(200).then((res) => {
				expect(res.body.articles).to.eql([]);
			});
		});
		it('GET 404: responds with 404 not found when provided with a non-existent author', () => {
			return request(app).get('/api/articles?author=not-author').expect(404);
		});
		it('GET 200: responds with an array of article objects that on a certain topic', () => {
			return request(app).get('/api/articles?topic=cats').expect(200).then((res) => {
				expect(res.body.articles).to.be.an('array');
				expect(res.body.articles[0]).to.contain.keys(
					'article_id',
					'title',
					'body',
					'votes',
					'topic',
					'author',
					'created_at'
				);
				expect(res.body.articles[0].topic).to.equal('cats');
			});
		});
		it('GET 404: responds with 404 not found when provided with a non-existent topic', () => {
			return request(app).get('/api/articles?topic=not-topic').expect(404);
		});
		it('INVALID METHOD 405', () => {
			const invalidMethods = [ 'patch', 'put', 'delete' ];
			const methodPromises = invalidMethods.map((method) => {
				return request(app)[method]('/api/topics').expect(405).then(({ body: { msg } }) => {
					expect(msg).to.equal('method not allowed');
				});
			});
			return Promise.all(methodPromises);
		});
		describe('/:article_id', () => {
			it('GET 200: responds with a specified article object according to article_id', () => {
				return request(app).get('/api/articles/1').then((res) => {
					expect(res.body.article).to.be.an('object');
					expect(res.body.article).to.contain.keys(
						'article_id',
						'title',
						'body',
						'votes',
						'topic',
						'author',
						'created_at',
						'comment_count'
					);
					expect(res.body.article.article_id).to.equal(1);
					expect(res.body.article.comment_count).to.equal(13);
				});
			});
			it('PATCH 200: takes increment votes obj and adds the value to article votes', () => {
				return request(app).patch('/api/articles/1').send({ inc_votes: 1 }).expect(200).then((res) => {
					expect(res.body.article).to.be.an('object');
					expect(res.body.article).to.contain.keys(
						'article_id',
						'title',
						'body',
						'votes',
						'topic',
						'author',
						'created_at',
						'comment_count'
					);
					expect(res.body.article.comment_count).to.equal(13);
				});
			});
			it('PATCH 400: responds with with 400 bad request when invalid request is sent', () => {
				return request(app).patch('/api/articles/1').send({ inc_votes: 'hello' }).expect(400);
			});
			it('GET 404: responds with 404 not found when a valid request is made for article that does not exist', () => {
				return request(app).get('/api/articles/43364').expect(404);
			});
			it('INVALID METHOD 405', () => {
				const invalidMethods = [ 'patch', 'put', 'delete' ];
				const methodPromises = invalidMethods.map((method) => {
					return request(app)[method]('/api/topics').expect(405).then(({ body: { msg } }) => {
						expect(msg).to.equal('method not allowed');
					});
				});
				return Promise.all(methodPromises);
			});
			describe('/comments', () => {
				it('GET 200: responds with an array of comments for a given article', () => {
					return request(app).get('/api/articles/1/comments').expect(200).then((res) => {
						expect(res.body).to.be.an('object');
						expect(res.body).to.contain.keys('comments');
						expect(res.body.comments[0].article_id).to.equal(1);
					});
				});
				it('GET 200: responds with an empty array of comments for a given article when it has no comments', () => {
					return request(app).get('/api/articles/2/comments').expect(200).then((res) => {
						expect(res.body).to.eql({ comments: [] });
					});
				});
				it('POST 201: takes an object of username and body then responds with users comment', () => {
					return request(app)
						.post('/api/articles/1/comments')
						.send({ username: 'butter_bridge', body: 'VERY NICE' })
						.expect(201)
						.then((res) => {
							expect(res.body.comment).to.be.an('object');
							expect(res.body.comment).to.contain.keys(
								'comment_id',
								'author',
								'article_id',
								'votes',
								'created_at',
								'body'
							);
							expect(res.body.comment.author).to.equal('butter_bridge');
							expect(res.body.comment.body).to.equal('VERY NICE');
						});
				});
				it('POST 404: responds with 404 not found when post does not have an existing article number', () => {
					return request(app)
						.post('/api/articles/1000000/comments')
						.send({ username: 'butter_bridge', body: 'VERY NICE' })
						.expect(404);
				});
				it('POST 400: responds with 400 bad request when post request does not have the required keys', () => {
					return request(app).post('/api/articles/1/comments').send({ body: 'hello world' }).expect(400);
				});
				it('GET 200: responds with an array of comment objects ordered most recent first as a default i.e. created_at & descending', () => {
					return request(app).get('/api/articles/1/comments').expect(200).then((res) => {
						expect(res.body.comments).to.be.sortedBy('created_at', { descending: true });
					});
				});
				it('GET 200: responds with an array of comment objects sorted by the column specified in query and ordered as specified', () => {
					return request(app)
						.get('/api/articles/1/comments?sort_by=votes&&order_by=asc')
						.expect(200)
						.then((res) => {
							expect(res.body.comments).to.be.sortedBy('votes', { ascending: true });
						});
				});
				it('GET 404: responds with 404 not found when given an article number that does not exist', () => {
					return request(app).get('/api/articles/1000000/comments').expect(404);
				});
				it('GET 400: responds with 400 when not a valid request', () => {
					return request(app).get('/api/articles/not-a-valid-id/comments').expect(400);
				});
				it('GET 400: repsonds with 400 when not valid query', () => {
					return request(app).get('/api/articles/1/comments?sort_by=not-a-valid-column').expect(400);
				});
				it('INVALID METHOD 405', () => {
					const invalidMethods = [ 'patch', 'put', 'delete' ];
					const methodPromises = invalidMethods.map((method) => {
						return request(app)
							[method]('/api/articles/1/comments')
							.expect(405)
							.then(({ body: { msg } }) => {
								expect(msg).to.equal('method not allowed');
							});
					});
					return Promise.all(methodPromises);
				});
			});
		});
	});
	describe('/comments', () => {
		it('GET 200: responds with an array of comments', () => {
			return request(app).get('/api/comments').expect(200).then((res) => {
				expect(res.body).to.be.an('object');
				expect(res.body.comments).to.be.an('array');
				expect(res.body.comments[0]).to.contain.keys(
					'comment_id',
					'author',
					'article_id',
					'votes',
					'created_at',
					'body'
				);
			});
		});
		it('INVALID METHOD 405', () => {
			const invalidMethods = [ 'patch', 'put', 'delete' ];
			const methodPromises = invalidMethods.map((method) => {
				return request(app)[method]('/api/articles/1/comments').expect(405).then(({ body: { msg } }) => {
					expect(msg).to.equal('method not allowed');
				});
			});
			return Promise.all(methodPromises);
		});
		describe('/:comment_id', () => {
			it('GET 200: responds with a comment according to specified comment_id', () => {
				return request(app).get('/api/comments/1').expect(200).then((res) => {
					expect(res.body).to.be.an('object');
					expect(res.body).to.contain.keys(
						'comment_id',
						'author',
						'article_id',
						'votes',
						'created_at',
						'body'
					);
					expect(res.body.comment_id).to.equal(1);
				});
			});
			it('PATCH 200: takes increment votes obj and adds the value to comments votes', () => {
				return request(app).patch('/api/comments/1').send({ inc_votes: -1 }).expect(200).then((res) => {
					expect(res.body).to.be.an('object');
					expect(res.body.comment).to.be.an('object');
					expect(res.body.comment).to.contain.keys(
						'comment_id',
						'author',
						'article_id',
						'votes',
						'created_at',
						'body'
					);
					expect(res.body.comment.votes).to.equal(15);
				});
			});
			it('PATCH 404 gives 404 when non-existent id comment id is used', () => {
				return request(app).patch('/api/comments/10000').send({ inc_votes: -1 }).expect(404);
			});
			it('PATCH 400: responds with 400 bad request when invalid request is made', () => {
				return request(app).patch('/api/comments/1').send({ inc_votes: 'abc' }).expect(400);
			});
			it('PATCH 200: responds with unchanged comment when sent an no inc_votes value on body', () => {
				return request(app).patch('/api/comments/1').send({}).expect(200).then((res) => {
					expect(res.body).to.be.an('object');
					expect(res.body.comment).to.be.an('object');
					expect(res.body.comment).to.contain.keys(
						'comment_id',
						'author',
						'article_id',
						'votes',
						'created_at',
						'body'
					);
					expect(res.body.comment.votes).to.equal(16);
				});
			});
			it('PATCH 400: responds with 400 bad request when when passed an invalid comment_id', () => {
				return request(app).patch('/api/comments/not-a-valid-id').send({ inc_votes: 0 }).expect(400);
			});
			it('INVALID METHOD 405', () => {
				const invalidMethods = [ 'put' ];
				const methodPromises = invalidMethods.map((method) => {
					return request(app)[method]('/api/comments/1').expect(405).then(({ body: { msg } }) => {
						expect(msg).to.equal('method not allowed');
					});
				});
				return Promise.all(methodPromises);
			});
			it('DELETE 204: deletes specified comment according to comment_id', () => {
				return request(app).delete('/api/comments/1').expect(204);
			});
			it('DELETE 400: responds with 400 when passed an invalid comment to delete', () => {
				return request(app).delete('/api/comments/not-a-number').expect(400);
			});
			it('DELETE 404; responds with 404 when passed an non existent comment_id', () => {
				return request(app).delete('/api/comments/1000000000').expect(404);
			});
		});
	});
});
