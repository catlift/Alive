const {ccclass, property} = cc._decorator;

@ccclass
export default class scrollCamera extends cc.Component {
	
	@property({
		tooltip: "Array, bgList",
		type: cc.Node
	})
	bgList: cc.Node[] = [];

	@property({
		tooltip: "Move speed"
	})
	moveSpeed: number = 200;
	
	@property({
		tooltip: "this node camera",
		type: cc.Camera
	})
	camera: cc.Camera = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
		// 如果需要用代码来摆放图片位置
        this.initBg();
	}
	
	/*
	  每帧更新函数
		*更新摄像机位置
		* 检查循环节点，设置新位置
	*/
    update (dt) {
		// 获取当前节点
		let current = this.bgList[0];
		// 计算当前节点在摄像机中的位置, getWorldToScreenPoint() 将一个世界坐标系下的点转换到屏幕坐标系下
		let pos = this.camera.getWorldToScreenPoint(current.position);
		// 当前节点超出摄像机范围（相当于屏幕大小）
		if(pos.y <= -cc.winSize.height) {
			// 获取背景数组(bgList)最后一个元素
			let last = this.bgList[this.bgList.length - 1];
			// 移除当前节点（超出屏幕的节点）, shift():移除数组第一个下标的元素，bgList[0]
			this.bgList.shift();
			// 在数组末尾增加回这个元素
			this.bgList.push(current);
			// 改变它的位置（新增加的数组元素）
			current.y = last.y + (last.height + current.height) / 2;
		}
		
		// 更新摄像机的位置
		this.node.y += this.moveSpeed * dt;
	}
	
	// 设置图片的位置
	initBg() {
		let node = this.bgList[0];
		if(!node) {
			return;
		}
		node.setPosition(0, 0);
		// 位置摆放
		for(let i = 1; i < this.bgList.length; i++) {
			// 上一个
			let before = this.bgList[i - 1];
			// 当前（下一个）
			node = this.bgList[i];
			// 摆放
			node.setPosition(cc.v2(0, before.y + (before.height + node.height) / 2));
		}
	}
}