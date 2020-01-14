process.env.NODE_ENV = 'test';
const app = require('../app');
const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('sams-chai-sorted'));
const connection = require('../../connection');

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
	describe('/users/:username', () => {
		it('GET 200: responds with an array of user topic objects', () => {
			return request(app).get('/api/users').then((user) => {
				expect(user.body.user).to.be.an('array');
				expect(user.body.user[0]).to.contain.keys('username', 'name', 'avatar_url');
			});
		});
		it('GET 200: responds with a specified user object according to username', () => {
			return request(app).get('/api/users/tickle122').then((user) => {
				expect(user.body.user[0]).to.eql({
					username: 'tickle122',
					name: 'Tom Tickle',
					avatar_url: 'https://www.spiritsurfers.net/monastery/wp-content/uploads/_41500270_mrtickle.jpg'
				});
			});
		});
	});
});
