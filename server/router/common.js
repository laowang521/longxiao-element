const upload = async (ctx,next)=>{
	
	//接收数据
	
	let fullpath = ctx.request.files[0].path;
	// D:\360MoveData\Users\wjlyq0620\Desktop\notes\xiaoniu\server\upload\img\upload_2293c00f9becc21c59cb0143ad41b5cb.png
	
	 let path = '/img/'+ fullpath.slice(fullpath.lastIndexOf('\\')+1)
	
	  ctx.body=path;
	
	
}



module.exports = {
	upload
}