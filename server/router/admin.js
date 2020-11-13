const crypto = require('crypto');
const MM = 'aaa';
const jwt = require('jsonwebtoken');
const adminTable = require('../model/admin.js');


let admin_login = async (ctx, next) => {

	let {
		username,
		password
	} = ctx.request.fields;
	// console.log(username,password);
	//校验数据
	if (!/^[a-zA-Z]\w{3,11}$/.test(username)) {
		ctx.body = {
			code: 0,
			msg: "用户名格式错误"
		}
		return;
	}
	if (!/^\w{6,12}$/.test(password)) {
		ctx.body = {
			code: 0,
			msg: "密码格式错误"
		}
		return;
	}
	
	//判断用户名是否存在
let query_user = await adminTable.findOne({
		username
	});
	
	//findOne 如果找不到 会返回null  找到了会返回查询到的数据
	if(!query_user){
		ctx.body={
			code:0,
			msg:"用户不存在"
		}
		return;
	}
	
	const hash = crypto.createHash('sha1')
		.update(password + MM)
		.digest('hex');
	//验证密码对不对
	
	let query_pwd = await adminTable.findOne({
		username,
		password:hash
	});
	//如果没找到 会返回null 证明密码错了
	if(!query_pwd){
		ctx.body={
			code:0,
			msg:"密码错误"
		}
		return;
	}
	
	
	const token = jwt.sign({
		username
	}, MM, {
		expiresIn: '2h'
	})
	
	ctx.body={
		code:1,
		msg:"登录成功",
		data:{
			_id:query_pwd._id,
			username,
			token
		}
	}


}

module.exports = {
	admin_login
}
