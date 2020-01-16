exports.formatDates = (list) => {
	const newArr = [ ...list ];

	const newObjs = newArr.map((article) => ({ ...article }));
	newObjs.map((article) => (article.created_at = new Date(article.created_at * 1000)));

	return newObjs;
};

exports.makeRefObj = (data, key, value) => {
	const obj = {};
	data.forEach((entry) => {
		obj[entry[key]] = entry[value];
	});
	return obj;
};

exports.formatComments = (comments, articleRef, oldKeyOne, oldKeyTwo, newKeyOne, newKeyTwo) => {
	const newArr = [ ...comments ];

	const newObjs = newArr.map((commentObj) => ({ ...commentObj }));

	newObjs.forEach((commentObj) => {
		commentObj.author = commentObj.created_by;
		commentObj.article_id = articleRef[commentObj.belongs_to];
		delete commentObj.created_by;
		delete commentObj.belongs_to;
	});

	return newObjs;
};
