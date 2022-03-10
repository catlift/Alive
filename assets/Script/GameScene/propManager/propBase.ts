const {ccclass, property} = cc._decorator;

import PropFactory from "./propFactory"
import { PropType } from "../Enum/Enum";

@ccclass
export default class propBase extends cc.Component {

	/** move direction */
	_moveDir: cc.Vec2 = new cc.Vec2(0, 0)
	get moveDir(): cc.Vec2 {
		return this._moveDir
	}
	set moveDir(value: cc.Vec2) {
		this._moveDir.x = value.x
		this._moveDir.y = value.y
	}
	
	/** move speed */
	_moveSpeed: number = 0
	get moveSpeed(): number {
		return this._moveSpeed
	}
	set moveSpeed(value: number) {
		if(value < 0) return
		this._moveSpeed = value
	}
	
	/** prop Factory */
	private propFactory: PropFactory | undefined = undefined
	/** prop Type */
	private tag: PropType | undefined = undefined

    // LIFE-CYCLE CALLBACKS:

	/** cc.NodePool() get() --> reuse() */
	reuse(propFactory: PropFactory, type: PropType, dir: cc.Vec2, speed: number): void {
		this.propFactory = propFactory
		this.tag = type
		this.moveDir = dir
		this.moveSpeed = speed
	}
	
	/** cc.NodePool() put() --> unuse */
	unuse(): void {
		
	}
	
	update(dt: number): void {
		if(this.moveSpeed === 0) {
			return
		}
		if(this.moveDir.x !== 0) {
			this.node.x += this.moveDir.x * this.moveSpeed * dt
		}
		if(this.moveDir.y !== 0) {
			this.node.y += this.moveDir.y * this.moveSpeed * dt
		}
		/** 反弹 */
		if(this.node.x > Math.abs(cc.winSize.width/2)) {
			this.moveDir.x = -this.moveDir.x
		}
		/** 回收 */
		if(this.node.y > Math.abs(cc.winSize.height/2)) {
			this.propFactory.propPools[this.tag].put(this.node)
		}
	}
	
	/** 碰撞后回调 */
	onCollisionEnter (other: cc.Collider, self: cc.Collider): void {
	 //    cc.log("碰撞 other", other.node)
		/** 从节点池回收这个节点 */
		this.propFactory.propPools[this.tag].put(self.node)
	}
}
