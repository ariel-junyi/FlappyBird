// 管子类
function Pipe(pipe_up, pipe_down, step, x) {
	// 上管子
	this.pipe_up = pipe_up;
	// 下管子
	this.pipe_down = pipe_down;
	// 步长
	this.step = step;
	// 图片的x值
	this.x = x;

	this.up_height = parseInt(Math.random() * 249) + 1;
	this.down_height = 250 - this.up_height;
	this.count = 0;
}
// 创建管子
Pipe.prototype.createPipe = function(){
	return new Pipe(this.pipe_up, this.pipe_down, this.step, this.x);
}


