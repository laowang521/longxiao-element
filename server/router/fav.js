const UserTable = require('../model/user.js');
const goodsTable = require('../model/goods.js');

const add_fav = async (ctx) => {

	///
	const {
		_id,
		goods_id
	} = ctx.request.fields;

	if (!_id || !goods_id) {
		ctx.body = {
			code: 0,
			msg: '参数错误'
		}
		return;
	}


	let res = await UserTable.updateOne({
		_id
	}, {
		$addToSet: {
			fav_list: goods_id
		}
	})
	if (res.ok) {
		ctx.body = {
			code: 1,
			msg: "加入收藏成功"
		}

	} else {

		ctx.body = {
			code: 0,
			msg: "收藏失败"
		}
	}

}


const get_fav_list = async (ctx) => {
	//  _id   用户ID
	//  skip   limit 
	let {
		_id,
		skip,
		limit
	} = ctx.request.query;

	//我们获取到用户的收藏的商品列表  先查用户表

	let get_goodsid = await UserTable.findOne({
		_id
	}, {
		fav_list: 1
	});

	let list = get_goodsid.fav_list;
	if (list.length === 0) {
		ctx.body = {
			code: 0,
			msg: "暂无记录"
		}
		return;
	}

	let goods_list_result = await goodsTable.find({
		_id: {
			$in: list
		}
	}).skip(skip - 0).limit(limit - 0)
	if (goods_list_result) {

		ctx.body = {
			code: 1,
			msg: "获取成功",
			data: goods_list_result
		}

	}




}



module.exports = {
	add_fav,
	get_fav_list

}





// {
//     "_id" : ObjectId("5fa11947e4127917b8638f36"),
//     "username" : "xiaoniu2",
//     "password" : "f5a6017e4cc398a4ae5c4b15a782ca0f2c32513f",
//     "mobile" : "13112345678",
//     "__v" : 0,
//     "age" : 21,
//     "gender" : null,
//     "photo" : "img/upload_1d85e6d63809953a9372aa27ccfc9d3c.png",
//     "is_del" : 1,
// 	"fav_list":[
// 			{
// 				"_id":'asds',
// 				"goodsname":"小牛追风",
// 				"price":1212,
// 				"img":"asdas.png"
// 			},
// 			{
// 				"_id":'asds',
// 				"goodsname":"小牛追风2",
// 				"price":1202,
// 				"img":"asdas.png"
// 			}
// 	]
// }


// fav 表   
// {
//    user_id: 小牛    goods1,
//    user_id: 小牛    goods2,
//    user_id: 小牛    goods3,

// }
