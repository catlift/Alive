const {ccclass, property} = cc._decorator;

import { StaticInstance } from "../staticInstance/staticInstance"

import { BulletType } from "../bulletManager/bulletFactory"

@ccclass
export default class playerCollisionEnter extends cc.Component {
	
	/** 发射子弹的匿名函数 */
	callBack: () => void

	/** 发射间隔 */
	private shootTime: number = 0.2

    // LIFE-CYCLE CALLBACKS:
	
	start(): void {
		this.node.parent.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
		this.node.parent.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this)
		this.node.parent.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this)
	}
	
	onDestroy(): void {
		this.node.parent.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
		this.node.parent.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this)
		this.node.parent.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this)
	}

    // update (dt) {}
	
	onTouchStart(event: cc.Event.EventTouch): void {
		let self = this
		this.callBack = function() {
			StaticInstance.weapon.weaponTypeA(BulletType.A, cc.v2(0, 1), "player_bullet", self.node, 15)
			StaticInstance.weapon.weaponTypeA(BulletType.A, cc.v2(0, 1), "player_bullet", self.node, -15)
		}
		this.schedule(this.callBack, this.shootTime)
	}
	
	onTouchEnd(event: cc.Event.EventTouch): void {
		this.unschedule(this.callBack)
	}
	
	/** 碰撞后回调 */
	onCollisionEnter (other: cc.Collider, self: cc.Collider): void {
		// cc.log("碰撞 other", other.node)
		// if(other.node.group === "prop_bullet") 
		if(other.node.group === "prop_hp") StaticInstance.uimanager.hpCount += 1
		if(other.node.group === "enemy" || other.node.group === "enemy_bullet") {
			StaticInstance.uimanager.hpCount -= 1
			if(StaticInstance.uimanager.hpCount <= 0) {
				// self.node.destroy()
				self.node.active = false
			}
		}
	}

	/** 帧事件 */
	toLeftAni() {
		this.node.getComponent(cc.Animation).play("left")
	}
	toRightAni() {
		this.node.getComponent(cc.Animation).play("right")
	}
}
