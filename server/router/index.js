const Router = require('koa-router');
const login = require('./login.js')
const reg = require('./reg.js')
const {
	upload
} = require('./common.js')
const {
	admin_login
} = require('./admin.js')
const {
	edit_user,
	query_user,
	del_user,
	add_user
} = require('./user.js')
const {
	edit_goods,
	query_goods,
	del_goods,
	add_goods,
	get_goods_detail
} = require('./goods.js')
const {
	add_fav,
	get_fav_list
} = require('./fav.js')
// 路由
const router = new Router();
//登录
router.post('/login', login)
router.post('/reg', reg)


//这是管理端用户的增删改查操作

router.get('/getusers', query_user); //查询
router.post('/edit_user', edit_user); //改
router.post('/del_user', del_user); //删除
router.post('/add_user', add_user); //删除

router.get('/get_goods_list', query_goods); //查询 
router.post('/edit_goods', edit_goods); //改
router.post('/del_goods', del_goods); //删除
router.post('/add_goods', add_goods); //删除
router.get('/get_goods_detail', get_goods_detail); //获取商品详情

// 收藏接口

router.post('/add_fav', add_fav); //加入收藏
router.get('/get_fav_list', get_fav_list); //获取收藏列表



//图片上传接口 他接收一个文件  返回一个路径  应该写成公共的 

router.post('/common/upload', upload)

//这是管理员端的接口
router.post('/admin/login', admin_login)


module.exports = router;
