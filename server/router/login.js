const UserTable = require('../model/user.js');
const crypto = require('crypto');
const MM = 'aaa';
const jwt = require('jsonwebtoken');
let login = async (ctx, next) => {
	//获取数据
	let {
		username,
		password
	} = ctx.request.fields;
	//校验
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
	//判断存不存在  不存在返回  存在了继续
	let query_user = await UserTable.findOne({
		username,
		is_del:{$ne:1}
	});

	//如果找到  证明存在
	if (query_user && query_user._id) {

		//判断密码
		console.log(password)

		const hash = crypto.createHash('sha1')
			.update(password + MM)
			.digest('hex');
		let query_data = await UserTable.findOne({
			username,
			password: hash
		});
		//这些写是和的关系 

		if (query_data) {
			
			const token = jwt.sign({
				username: query_data.username
			}, MM, {
				expiresIn: '2h'
			})

			ctx.body = {
				code: 1,
				msg: "登录成功",
				data: {
					token,
					_id:query_data._id
				} //toekn
			}

		} else {
			ctx.body = {
				code: 0,
				msg: "密码错误"

			}
		}

	} else {

		ctx.body = {
			code: 0,
			msg: "您还未注册"
		}

	}

}

module.exports = login;
