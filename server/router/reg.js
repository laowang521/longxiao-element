const UserTable = require('../model/user.js');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const MM = 'aaa';
let reg = async (ctx, next) => {
	//console.log(ctx.query) //获取get方式提交的数据
	//获取到post的数据  ctx.request.fields
	//1.获取数据
	let {
		username,
		password,
		mobile
	} = ctx.request.fields;
	console.log(username, password, mobile)
	//2.校验数据
	
	// 语言包
	if (!/^\w{6,12}$/.test(username)) {
		// 0就是 约定的校验不通过。
		ctx.body = {
			code: 0,
			msg: '账号格式错误'
		}
		return;
	}
	if (!/^\w{6,12}$/.test(password)) {
		ctx.body = {
			code: 0,
			msg: '密码格式错误'
		}
		return;
	}
	if (!/^1[3-9]\d{9}$/.test(mobile)) {
		ctx.body = {
			code: 0,
			msg: '手机号码格式错误'
		}
		return;
	}

	//3.存起来 存到数据库  
	// 引入  连接  创建Schema  model  
	// new 一个表  save()

	//先判断数据库里有没有  防止重复注册
	let query_user = await UserTable.findOne({
		username
	});
	//如果存在说明已经注册过了  return
	//如果不存在  说明没有注册过 可以继续
	// console.log(query_user)  
	//判断重复
	if (query_user && query_user._id) {
		ctx.body = {
			code: 0,
			msg: "用户名已存在"
		}
		return;
	}

	const hash = crypto.createHash('sha1')
		.update(password+MM)
		.digest('hex');
	let add_user = new UserTable({
		username,
		password: hash,
		mobile,
		photo: '',
		gender: '',
		age: ''
	})
	let result = await add_user.save();
	//数据拿到了

	if (result && result._id) {
		//数据保存成功了
		
		const token = jwt.sign({
			username
		}, MM, {
			expiresIn: '2h'
		});
		
		// 盐
		ctx.body = {
			code: 1,
			msg: "注册成功",
			data: {
				token,
				_id:result._id
			} //toekn
		}
	} else {
		ctx.body = {
			code: 0,
			msg: "注册失败"
		}
	}
}
module.exports = reg