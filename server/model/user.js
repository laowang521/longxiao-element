const mongo = require('../db')
//创建用户表约束
const userSchema = new mongo.Schema({
	username: String,
	password: String,
	photo: String,
	mobile: String,
	gender: String,
	age: Number,
	is_del:Number,
	fav_list:Array  //存放收藏的商品ID
});
const UserTable = mongo.model('xn_user', userSchema);

module.exports = UserTable;