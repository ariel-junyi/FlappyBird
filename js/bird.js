// 鸟类
function Bird(imgArr, x, y) {
	// 图片数组
	this.imgArr = imgArr;
	// 随机出来一个索引值
	this.index = parseInt(Math.random() * imgArr.length);
	// 确定一张图片
	this.img = this.imgArr[this.index];
	// 鸟的x值
	this.x = x;
	// 鸟的y值
	this.y = y;

	// 定义鸟的状态 D: down   U: up
	this.state = 'D' 

	this.speed = 0;
}
// 飞翔
Bird.prototype.fly = function(){
	this.index++;
	if(this.index > this.imgArr.length - 1){
		this.index = 0;
	}
	this.img = this.imgArr[this.index];
}
// 下降
Bird.prototype.fallDown = function(){
	if(this.state === 'D'){
		this.speed++;
		this.y += Math.sqrt(this.speed);
	}else{
		this.speed--;
		if(this.speed === 0){
			this.state = 'D';
			return;
		}
		this.y -= Math.sqrt(this.speed);
	}
}
// 上升
Bird.prototype.goUp = function(){
	this.state = 'U';
	this.speed = 23;
}