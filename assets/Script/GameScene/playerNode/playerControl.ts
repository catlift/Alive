const {ccclass, property} = cc._decorator;

import { playerAni } from "../Enum/Enum";

@ccclass
export default class playerControl extends cc.Component {

	@property({
		type: cc.Node,
		tooltip: "player"
	})
	target: cc.Node | undefined = undefined
	
	@property({
		type: cc.Animation,
		tooltip: "player Animation Component"
	})
	AniComponent: cc.Animation | undefined = undefined
	
	/** animation state */
	Ani: string = "idle"
	
	tween: cc.Tween<cc.Node>

	isHit: boolean = false

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
		/** 注册监听 touch 事件 */
		this.onTouch()
	}
	
	update(dt: number): void {
		/** 边界检测 */
		if(this.target.x > cc.winSize.width/2) this.target.x = cc.winSize.width/2
		if(this.target.x < -cc.winSize.width/2) this.target.x = -cc.winSize.width/2
		if(this.target.y > cc.winSize.height/2) this.target.y = cc.winSize.height/2
		if(this.target.y < -cc.winSize.height/2) this.target.y = -cc.winSize.height/2
	}
	
	/** 注册监听 touch 事件 */
	onTouch(): void {
		/** 关闭多点触摸 */
		cc.macro.ENABLE_MULTI_TOUCH = false

		/** 当前节点 触摸 监听 */
		this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
		this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
		this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this)
		this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this)
	}
	
	/** 注销 touch */
	onDestroy(): void {
		this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
		this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
		this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this)
		this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this)
	}
	
	/** touch start */
	onTouchStart(event: cc.Event.EventTouch): void {
		/** 获取触点位置对象 */
		let delta = event.getLocation()
		/** 将 delta 相对于 this.node(本次是相对于 playerNode 节点, 不是 player 节点) 进行转换坐标 */
		let pos: cc.Vec2 = this.node.convertToNodeSpaceAR(delta)
		/** 直接改变位置太生硬 */
		// this.target.position = pos
		/** 用 tween */
		// this.tween = cc.tween(this.target)
		// 	.to(0.1, { position: cc.v3(pos.x, pos.y, 0) } )
		// 	.start()
		/** 位置判断，改变动画 */
		this.changeAni()
	}
	
	/** touch move */
	onTouchMove(event: cc.Event.EventTouch): void {
		// this.tween.stop()
		/** 获取触点距离上一次事件移动的距离对象 */
		let delta = event.getDelta()
		/** 当前 target 位置+增量，更新节点位置 */
		this.target.x += delta.x
		this.target.y += delta.y
		/** 位置判断，改变动画 */
		this.changeAni()
	}
	
	/** touch end */
	onTouchEnd(): void {
		/** touchend idle */
		this.setAnimation(playerAni.idle)
	}
	
	/** 屏幕两边动画不相同 */
	changeAni(): void {
		if(this.isHit) return
		if(this.target.x > 0) this.setAnimation(playerAni.toRight)
		if(this.target.x < 0) this.setAnimation(playerAni.toLeft)
	}
	
	/** this.target Animation component play */
	setAnimation(animation): void {
		/** 如果 animation 不存在 或者 和上一次相同 */
		if(!animation || animation == this.Ani) return
		/** 赋值 */
		this.Ani = animation
		/** 播放动画 */
		this.AniComponent.play(animation)
	}
}
