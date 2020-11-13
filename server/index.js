const Koa = require('koa');
const _static = require('koa-static');
const body = require('koa-better-body');
const path = require('path');
const cors = require('koa-cors');
const app = new Koa();
const router = require('./router');
const koa_jwt = require('koa-jwt'); //验证token的
// 搞定静态资源
app.use(_static('./www'));
app.use(_static('./upload')); //才能被访问到

app.use((ctx,next)=>{
    return next().catch((err)=>{
        if(err.status==401){
            ctx.status=401;
            ctx.body = 'token无效'

        }else{
            throw err;
        }

    })

});
//解决跨域
app.use(cors({
	origin: () => '*'
}));
//post  上传
app.use(body({
	uploadDir: path.resolve(__dirname, './upload/img'),
	keepExtensions: true
}));


app.use(
koa_jwt({
    secret:"aaa"
})
.unless({ path: [
	/^\/reg$/,
	/^\/login$/,
	/^\/admin\/login$/,
	/^\/common\/upload$/,
	/^\/img/,
	/^\/get_goods_list$/,
	/^\/get_goods_detail/
	] })  
//不验证注册和登录接口的token

)





app.use(router.routes());
app.listen(8000, (err) => {
	if (err) {
		console.log(err);
		return;
	}
	console.log('服务器启动了，端口8000')
})
