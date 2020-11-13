const goodsTable = require('../model/goods.js');
const fs = require('fs')
const crypto = require('crypto');
const MM = 'aaa';
//改
const edit_goods = async (ctx) => {
	//获取数据
	let {
		_id,
		goodsname,
		img,
		price,
		color,
		stock,
		pics,
		detail
	} = ctx.request.fields;
	//校验数据
	if (!_id || !goodsname||!price) {
		ctx.body = {
			code: 0,
			msg: "参数错误"
		}
		return;
	}
	//  

	//存起来

	let update_user = await goodsTable.updateOne({
		_id
	}, {
		$set: {
			goodsname,
			img,
			price,
			color,
			stock,
			pics,
			detail
		}
	})


	if (update_user.ok) {
		ctx.body = {
			code: 1,
			msg: "修改成功"
		}

	} else {

		ctx.body = {
			code: 0,
			msg: "修改失败"
		}
	}

}
//新增
const add_goods = async (ctx) => {
	//获取数据
	let {
		goodsname,
		img,
		price,
		color,
		stock,
		pics,
		detail
	} = ctx.request.fields;
	//校验数据
	if (!goodsname||!price) {
	ctx.body = {
		code: 0,
		msg: "参数错误"
	}
	return;
	}
	
	

	

	//  


	let new_user =  new goodsTable({
	goodsname,
	img,
	price,
	color,
	stock,
	pics,
	detail
	});
	
	  let add_result = await new_user.save()

	if (add_result._id) {
		ctx.body = {
			code: 1,
			msg: "新增成功",
			data:add_result
		}

	} else {
		ctx.body = {
			code: 0,
			msg: "新增失败"
		}
	}
}

//获取用户数据的   查
// $ne 不等于
const query_goods = async (ctx, next) => {
	
	//我需要查一下用户的总数量
	//查条数

	let {skip,limit} = ctx.request.query;
	
	
	let count = await goodsTable.find({
		not_sell: {
			$ne: 1
		}
	}).count();
	
	//专门查数据
	let data = await goodsTable.find({
		not_sell: {$ne: 1}
	}).skip(skip-0).limit(limit-0)
	// 返回了所有的  没被删除的用户数据   12
	
	
	// skip(0).limit(10)    1-10
	// skip(10).limit(10)    11-20
	// skip(20).limit(10)    21-30
	
	
	// skip 跳
	// limit  取几条
	
	ctx.body = {
		code: 1,
		count,
		data: data
	}
}

//删除的方法

const del_goods = async (ctx) => {
	//拿到刚才的_id

	let {
		_id,
		photo
	} = ctx.request.fields;

	//根据这个ID删除相对应的数据

	// let res = await goodsTable.deleteOne({
	// 		_id
	// 	});

	let res = await goodsTable.updateOne({
		_id
	}, {
		$set: {
			not_sell: 1
		}
	});

	//删除图片的操作  
	console.log('../upload/' + photo);

	// fs.unlink('./upload/img/upload_7dc9b249d3d79ccf148f4ba3726126b3.png',err=>{

	// 	console.log(err)


	// })


	if (res.ok) {
		
          try{
          	fs.unlinkSync('./upload/' + photo);
			ctx.body = {
				code: 1,
				msg: '删除成功'
			};
          }catch(e){
			  
			  ctx.body = {
			  	code: 1,
			  	msg: '删除成功'
			  };
			  
          	//TODO handle the exception
          }




		

	} else {
		ctx.body = {
			code: 0,
			msg: '删除失败',
			data: res
		};
	}

}

//根据商品ID获取商品详情

const  get_goods_detail= async (ctx)=>{
	
	//获取到goods_id
	// 去查数据库
	let {goods_id} = ctx.request.query;
	
	if(!goods_id){
		ctx.body={
			code:0,
			msg:'参数错误'
		};
		return;
	}
	
let res = await	goodsTable.findOne({
		_id:goods_id
	});
	
	if(res&&res._id){
		ctx.body={
			code:1,
			msg:'获取成功',
			data:res
		};
		
	}else{
		
		ctx.body={
			code:0,
			msg:'获取失败'
		};
	}
	
	
	
	
	
	
}


module.exports = {
	edit_goods,
	query_goods,
	del_goods,
	add_goods,
	get_goods_detail
}
