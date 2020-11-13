const UserTable = require('../model/user.js');
const fs = require('fs')
const crypto = require('crypto');
const MM = 'aaa';
//改
const edit_user = async (ctx) => {
	//获取数据
	let {
		_id,
		username,
		gender,
		age,
		mobile,
		photo
	} = ctx.request.fields;
	//校验数据
	if (!_id || !/^\w{6,12}$/.test(username)) {
		ctx.body = {
			code: 0,
			msg: "参数错误"
		}
		return;
	}
	//  

	//存起来

	let update_user = await UserTable.updateOne({
		_id
	}, {
		$set: {
			username,
			gender,
			age,
			mobile,
			photo
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
const add_user = async (ctx) => {
	//获取数据
	let {
		username,
		gender,
		age,
		mobile,
		photo,
		password
	} = ctx.request.fields;
	//校验数据
	if (!/^\w{6,12}$/.test(username)||!/^\w{6,12}$/.test(password)) {
	ctx.body = {
		code: 0,
		msg: "参数错误"
	}
	return;
	}
	
	
	let has_user = await UserTable.findOne({
		username
	});
	
	if(has_user){
		ctx.body = {
			code: 0,
			msg: "用户名已存在"
		}
		return;
	}
	

	//  

	//新增一个用户
	const hash = crypto.createHash('sha1')
		.update(password + MM)
		.digest('hex');
		
	let new_user =  new UserTable({
		username,
		password:hash,
		gender,
		age,
		mobile,
		photo
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
const query_user = async (ctx, next) => {
	
	//我需要查一下用户的总数量
	//查条数

	let {skip,limit} = ctx.request.query;
	
	
	let count = await UserTable.find({
		is_del: {
			$ne: 1
		}
	}).count();
	
	//专门查数据
	let data = await UserTable.find({
		is_del: {$ne: 1}
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

const del_user = async (ctx) => {
	//拿到刚才的_id

	let {
		_id,
		photo
	} = ctx.request.fields;

	//根据这个ID删除相对应的数据

	// let res = await UserTable.deleteOne({
	// 		_id
	// 	});

	let res = await UserTable.updateOne({
		_id
	}, {
		$set: {
			is_del: 1
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


module.exports = {
	edit_user,
	query_user,
	del_user,
	add_user
}
