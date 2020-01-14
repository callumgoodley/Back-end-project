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
		(commentObj[newKeyOne] = commentObj[oldKeyOne]),
			(commentObj[newKeyTwo] = articleRef[commentObj[oldKeyOne]]),
			delete commentObj[oldKeyOne];
		delete commentObj[oldKeyTwo];
	});

	return newObjs;
};
