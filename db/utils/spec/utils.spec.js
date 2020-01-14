const { expect } = require('chai');
const { formatDates, makeRefObj, formatComments } = require('../utils');

describe('formatDates', () => {
	it('takes an array and returns an array', () => {
		const testArr = [];
		const actual = formatDates(testArr);
		const expected = [];
		expect(actual).to.eql(expected);
	});
	it('takes an array with an object with UXI timestamp formatted created_at and returns a new array which is identical but created_at is now a javascript date object', () => {
		const testArr = [
			{
				title: 'Running a Node App',
				topic: 'coding',
				author: 'jessjelly',
				body:
					'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
				created_at: 1471522072389
			}
		];
		const actual = formatDates(testArr);
		const expected = [
			{
				title: 'Running a Node App',
				topic: 'coding',
				author: 'jessjelly',
				body:
					'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
				created_at: new Date(1471522072389 * 1000)
			}
		];
		expect(actual).to.eql(expected);
	});
	it('takes an array with multiple objects with UXI timestamp formatted created_at and returns a new array which is identical but created_at is now a javascript date object', () => {
		const testArr = [
			{
				title: 'Running a Node App',
				topic: 'coding',
				author: 'jessjelly',
				body:
					'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
				created_at: 1471522072389
			},
			{
				title: "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
				topic: 'coding',
				author: 'jessjelly',
				body:
					'Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to take things even further, and put its cognitive capabilities to use solving a whole new range of problems around the world.',
				created_at: 1500584273256
			}
		];
		const actual = formatDates(testArr);
		const expected = [
			{
				title: 'Running a Node App',
				topic: 'coding',
				author: 'jessjelly',
				body:
					'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
				created_at: new Date(1471522072389 * 1000)
			},
			{
				title: "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
				topic: 'coding',
				author: 'jessjelly',
				body:
					'Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to take things even further, and put its cognitive capabilities to use solving a whole new range of problems around the world.',
				created_at: new Date(1500584273256 * 1000)
			}
		];
		expect(actual).to.eql(expected);
	});
	it('does not mutate the original array', () => {
		const testArr = [
			{
				title: 'Running a Node App',
				topic: 'coding',
				author: 'jessjelly',
				body:
					'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
				created_at: 1471522072389
			}
		];
		const testArrCopy = [
			{
				title: 'Running a Node App',
				topic: 'coding',
				author: 'jessjelly',
				body:
					'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
				created_at: 1471522072389
			}
		];
		const actual = formatDates(testArr);
		expect(testArr).to.eql(testArrCopy);
	});
	describe('makeRefObj', () => {
		it('takes an array and returns an object', () => {
			const testArr = [];
			const actual = makeRefObj(testArr);
			const expected = {};
			expect(actual).to.eql(expected);
		});
		it('returns a reference object with the key and value specified in params when passed an array with one object', () => {
			const testArr = [
				{
					username: 'tickle122',
					name: 'Tom Tickle',
					avatar_url: 'https://www.spiritsurfers.net/monastery/wp-content/uploads/_41500270_mrtickle.jpg'
				}
			];
			const actual = makeRefObj(testArr, 'username', 'name');
			const expected = { tickle122: 'Tom Tickle' };
			expect(actual).to.eql(expected);
		});
		it('returns a reference object with multiple key-value pairs using the key and value specified in params when passed an array with multiple objects', () => {
			const testArr = [
				{
					username: 'tickle122',
					name: 'Tom Tickle',
					avatar_url: 'https://www.spiritsurfers.net/monastery/wp-content/uploads/_41500270_mrtickle.jpg'
				},
				{
					username: 'grumpy19',
					name: 'Paul Grump',
					avatar_url: 'https://www.tumbit.com/profile-image/4/original/mr-grumpy.jpg'
				}
			];
			const actual = makeRefObj(testArr, 'username', 'name');
			const expected = { tickle122: 'Tom Tickle', grumpy19: 'Paul Grump' };
			expect(actual).to.eql(expected);
		});
		it('does not mutate the original array', () => {
			const testArr = [
				{
					username: 'tickle122',
					name: 'Tom Tickle',
					avatar_url: 'https://www.spiritsurfers.net/monastery/wp-content/uploads/_41500270_mrtickle.jpg'
				}
			];
			const testArrCopy = [
				{
					username: 'tickle122',
					name: 'Tom Tickle',
					avatar_url: 'https://www.spiritsurfers.net/monastery/wp-content/uploads/_41500270_mrtickle.jpg'
				}
			];
			makeRefObj(testArr, 'username', 'name');
			expect(testArr).to.eql(testArrCopy);
		});
	});
	describe('formatComments', () => {
		it('takes an array and returns an array', () => {
			const testArr = [];
			const actual = formatComments(testArr);
			const expected = [];
			expect(actual).to.eql(expected);
		});
		it('takes an array with one object and changes the specified values and keys', () => {
			const testArr = [
				{
					body:
						'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
					belongs_to: 'The People Tracking Every Touch, Pass And Tackle in the World Cup',
					created_by: 'tickle122',
					votes: -1,
					created_at: 1468087638932
				}
			];
			const testRefObj = { tickle122: 1 };
			const actual = formatComments(testArr, testRefObj, 'created_by', 'belongs_to', 'author', 'article_id');
			const expected = [
				{
					body:
						'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
					article_id: 1,
					author: 'tickle122',
					votes: -1,
					created_at: 1468087638932
				}
			];
			expect(actual).to.eql(expected);
		});
		it('takes an array with multiple objects and changes their specified values and keys', () => {
			const testArr = [
				{
					body:
						'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
					belongs_to: 'The People Tracking Every Touch, Pass And Tackle in the World Cup',
					created_by: 'tickle122',
					votes: -1,
					created_at: 1468087638932
				},
				{
					body: 'Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.',
					belongs_to: 'Making sense of Redux',
					created_by: 'grumpy19',
					votes: 7,
					created_at: 1478813209256
				}
			];
			const testRefObj = {
				tickle122: 1,
				grumpy19: 2
			};
			const actual = formatComments(testArr, testRefObj, 'created_by', 'belongs_to', 'author', 'article_id');
			const expected = [
				{
					body:
						'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
					article_id: 1,
					author: 'tickle122',
					votes: -1,
					created_at: 1468087638932
				},
				{
					body: 'Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.',
					article_id: 2,
					author: 'grumpy19',
					votes: 7,
					created_at: 1478813209256
				}
			];
			expect(actual).to.eql(expected);
		});
		it('does not mutate', () => {
			const testArr = [
				{
					body:
						'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
					belongs_to: 'The People Tracking Every Touch, Pass And Tackle in the World Cup',
					created_by: 'tickle122',
					votes: -1,
					created_at: 1468087638932
				}
			];
			const testArrCopy = [
				{
					body:
						'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
					belongs_to: 'The People Tracking Every Touch, Pass And Tackle in the World Cup',
					created_by: 'tickle122',
					votes: -1,
					created_at: 1468087638932
				}
			];
			const testRefObj = { tickle122: 1 };
			const actual = formatComments(testArr, testRefObj, 'created_by', 'belongs_to', 'author', 'article_id');

			expect(testArr).to.eql(testArrCopy);
		});
	});
});
