const mongo = require('../db')
//
//创建表约束
const Schema = new mongo.Schema({
	username: String,
	password: String,
	auth:[] //知道有权限的概念
});
const adminTable = mongo.model('xn_admin', Schema);

module.exports = adminTable;