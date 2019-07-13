function Game(ctx, bird, pipe, land, mountain) {
	this.ctx = ctx;
	this.bird = bird;
	this.pipeArr = [pipe];
	this.land = land;
	this.mountain = mountain;
	this.timer = null;
	this.iframe = null;

	this.init();
}
// 初始化
Game.prototype.init = function(){
	this.start();
	this.bindEvent();
}
// 渲染山
Game.prototype.renderMountain = function(){
	var img = this.mountain.img;
	this.mountain.x -= this.mountain.step;

	if(this.mountain.x < -img.width){
		this.mountain.x = 0;
	}

	this.ctx.drawImage(img, this.mountain.x, this.mountain.y)
	this.ctx.drawImage(img, this.mountain.x + img.width, this.mountain.y)
	this.ctx.drawImage(img, this.mountain.x + img.width * 2, this.mountain.y)
}
// 渲染地面
Game.prototype.renderLand = function(){
	var img = this.land.img;

	this.land.x -= this.land.step;

	if(this.land.x < -img.width){
		this.land.x = 0;
	}

	this.ctx.drawImage(img, this.land.x, this.land.y)
	this.ctx.drawImage(img, this.land.x + img.width, this.land.y)
	this.ctx.drawImage(img, this.land.x + img.width * 2, this.land.y)
}
Game.prototype.start = function(){
	var that = this;
	this.timer = setInterval(function(){
		that.iframe++;

		that.clear();
		that.renderMountain();
		that.renderLand();
		that.renderBird();
		if(!(that.iframe % 10)){
			that.bird.fly();
		}
		that.bird.fallDown();

		if(!(that.iframe % 65)){
			that.createPipe();
		}
		that.movePipe();
		that.renderPipe();
		that.clearPipe();
		that.renderBirdPoints();
		that.renderPipePoints();
		that.check();

	}, 20)
}
// 清屏
Game.prototype.clear = function(){
	this.ctx.clearRect(0, 0, 360, 512);
	
}
// 渲染鸟
Game.prototype.renderBird = function(){
	var img = this.bird.img;

	this.ctx.save();
	this.ctx.translate(this.bird.x, this.bird.y);

	var deg = this.bird.state === 'D' ? Math.PI / 180 * this.bird.speed : -Math.PI / 180 * this.bird.speed;
	this.ctx.rotate(deg);

	this.ctx.drawImage(img, -img.width / 2, -img.height / 2);
	this.ctx.restore();

}
// 绑定事件
Game.prototype.bindEvent = function(){
	var that = this;
	this.ctx.canvas.onclick = function(){
		that.bird.goUp();
	}
}
// 渲染管子
Game.prototype.renderPipe = function(){
	var that = this;
	this.pipeArr.forEach(function(value){
		//获取上管子的图片
		var img_up = value.pipe_up;
		var img_x = 0;
		var img_y = img_up.height - value.up_height;
		var img_w = img_up.width;
		var img_h = value.up_height;
		var canvas_x = that.ctx.canvas.width - value.step * value.count;
		var canvas_y = 0;
		var canvas_w = img_up.width;
		var canvas_h = value.up_height;
		that.ctx.drawImage(img_up, img_x, img_y, img_w, img_h, canvas_x, canvas_y, canvas_w, canvas_h);

		//获取下馆子的图片
		var img_down = value.pipe_down;
		var img_down_x = 0;
		var img_down_y = 0;
		var img_down_w = img_down.width;
		var img_down_h = value.down_height;
		var canvas_down_x = that.ctx.canvas.width - value.step * value.count;
		var canvas_down_y = value.up_height + 150;
		var canvas_down_w = img_down.width;
		var canvas_down_h = value.down_height;
		that.ctx.drawImage(img_down, img_down_x, img_down_y, img_down_w, img_down_h, canvas_down_x, canvas_down_y, canvas_down_w, canvas_down_h);

	})
}
// 管子的移动
Game.prototype.movePipe = function(){
	this.pipeArr.forEach(function(value){
		value.count++;
	})
}
// 创建多根管子
Game.prototype.createPipe = function(){
	var pipe = this.pipeArr[0].createPipe();
	this.pipeArr.push(pipe);
}
// 清除管子
Game.prototype.clearPipe = function(){
	for(var i = 0; i < this.pipeArr.length; i++){
		var pipe = this.pipeArr[i];
		if(pipe.x - pipe.step * pipe.count < - pipe.pipe_up.width){
			this.pipeArr.splice(i, 1);
			return;
		}
	}
	// this.pipeArr.forEach(function(value, index){
	// 	var pipe = value;
	// 	if(pipe.x - pipe.pipe_up.width){
	// 		this.pipeArr.splice(index, 1);
	// 		return;
	// 	}
	// })
}
// 渲染鸟的四个点
Game.prototype.renderBirdPoints = function() {
	// 定义鸟的A点
	var Bird_A = {
		x: -this.bird.img.width / 2 + 5 + this.bird.x,
		y: -this.bird.img.height / 2 + 5 + this.bird.y
	}
	var Bird_B = {
		x: Bird_A.x + this.bird.img.width - 10,
		y: Bird_A.y
	}
	var Bird_C = {
		x: Bird_A.x,
		y: Bird_A.y + this.bird.img.height - 10
	}
	var Bird_D = {
		x: Bird_B.x,
		y: Bird_C.y
	}

	this.ctx.beginPath();
	// 移动画笔到某个位置
	this.ctx.moveTo(Bird_A.x, Bird_A.y);
	this.ctx.lineTo(Bird_B.x, Bird_B.y);
	this.ctx.lineTo(Bird_D.x, Bird_D.y);
	this.ctx.lineTo(Bird_C.x, Bird_C.y);
	this.ctx.closePath();

	this.ctx.strokeStyle = 'blue';
	this.ctx.stroke();
}

// 渲染管子的八个点
Game.prototype.renderPipePoints = function() {
	for (var i = 0; i < this.pipeArr.length; i++) {
		// 获取一根管子
		var pipe = this.pipeArr[i];

		// 绘制上管子的四个点
		var pipe_A = {
			x: pipe.x - pipe.step * pipe.count,
			y: 0
		}
		var pipe_B = {
			x: pipe_A.x + pipe.pipe_up.width,
			y: 0
		}
		var pipe_C = {
			x: pipe_A.x,
			y: pipe.up_height
		}
		var pipe_D = {
			x: pipe_B.x,
			y: pipe_C.y
		}

		this.ctx.beginPath();
		this.ctx.moveTo(pipe_A.x, pipe_A.y);
		this.ctx.lineTo(pipe_B.x, pipe_B.y);
		this.ctx.lineTo(pipe_D.x, pipe_D.y);
		this.ctx.lineTo(pipe_C.x, pipe_C.y);
		this.ctx.closePath();

		this.ctx.strokeStyle = 'blue';
		this.ctx.stroke();

		// 绘制下管子的四个点
		var pipe_down_A = {
			x: pipe.x - pipe.step * pipe.count,
			y: pipe.up_height + 150
		}
		var pipe_down_B = {
			x: pipe_down_A.x + pipe.pipe_up.width,
			y: pipe_down_A.y
		}
		var pipe_down_C = {
			x: pipe_down_A.x,
			y: pipe_down_A.y + pipe.down_height
		}
		var pipe_down_D = {
			x: pipe_down_B.x,
			y: pipe_down_C.y
		}

		this.ctx.beginPath();
		this.ctx.moveTo(pipe_down_A.x, pipe_down_A.y);
		this.ctx.lineTo(pipe_down_B.x, pipe_down_B.y);
		this.ctx.lineTo(pipe_down_D.x, pipe_down_D.y);
		this.ctx.lineTo(pipe_down_C.x, pipe_down_C.y);
		this.ctx.closePath();

		this.ctx.strokeStyle = 'blue';
		this.ctx.stroke();
	}
}

// 碰撞检测的方法
Game.prototype.check = function() {
	for (var i = 0; i < this.pipeArr.length; i++) {
		// 获取一根管子
		var pipe = this.pipeArr[i];

		// 绘制上管子的四个点
		var pipe_A = {
			x: pipe.x - pipe.step * pipe.count,
			y: 0
		}
		var pipe_B = {
			x: pipe_A.x + pipe.pipe_up.width,
			y: 0
		}
		var pipe_C = {
			x: pipe_A.x,
			y: pipe.up_height
		}
		var pipe_D = {
			x: pipe_B.x,
			y: pipe_C.y
		}

		// 绘制下管子的四个点
		var pipe_down_A = {
			x: pipe.x - pipe.step * pipe.count,
			y: pipe.up_height + 150
		}
		var pipe_down_B = {
			x: pipe_down_A.x + pipe.pipe_up.width,
			y: pipe_down_A.y
		}
		var pipe_down_C = {
			x: pipe_down_A.x,
			y: pipe_down_A.y + pipe.down_height
		}
		var pipe_down_D = {
			x: pipe_down_B.x,
			y: pipe_down_C.y
		}
		var Bird_A = {
			x: -this.bird.img.width / 2 + 5 + this.bird.x,
			y: -this.bird.img.height / 2 + 5 + this.bird.y
		}
		var Bird_B = {
			x: Bird_A.x + this.bird.img.width - 10,
			y: Bird_A.y
		}
		var Bird_C = {
			x: Bird_A.x,
			y: Bird_A.y + this.bird.img.height - 10
		}
		var Bird_D = {
			x: Bird_B.x,
			y: Bird_C.y
		}

		// 用Bird_B点与pipe_C点进行比较
		if (Bird_B.x >= pipe_C.x && Bird_B.y <= pipe_C.y && Bird_A.x <= pipe_C.x) {
			console.log('撞到上管子了');
			this.gameOver();
		}

		if (Bird_D.x >= pipe_down_A.x && Bird_D.y >= pipe_down_A.y && Bird_A.x <= pipe_down_C.x) {
			console.log('撞到下管子了');
			this.gameOver();
		} 

	}
}

// 结束游戏
Game.prototype.gameOver = function() {
	clearInterval(this.timer);
}

























