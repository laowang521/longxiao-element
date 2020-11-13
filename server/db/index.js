const mongo = require('mongoose');

mongo.connect('mongodb://localhost:27017/xiaoniu2');

mongo.connection.on('connected', (err) => {
	if (err) {
		console.log(err)
		return
	}
	console.log('数据xiaoniu2连接成功')
});

module.exports = mongo;