const mongo = require('../db')
//创建用户表约束

const Schema = new mongo.Schema({
	goodsname: String, //商品名字
	img: String,  //商品主图片
	price: String,
	color: String,
	stock: String, //库存
	pics: Array, //轮播图
	detail:String,
	not_sell:Number, //是否在售
});

const goodsTable = mongo.model('xn_good', Schema);

module.exports = goodsTable;