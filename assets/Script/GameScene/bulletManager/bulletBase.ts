const {ccclass, property} = cc._decorator;

import { ExplosionType } from "../Enum/Enum"
import { StaticInstance } from "../staticInstance/staticInstance"
import BulletFactory,{ BulletType } from "./bulletFactory"

@ccclass
export default class bulletBase extends cc.Component {

    /** move direction */
	_moveDir: cc.Vec2 = new cc.Vec2(0, 0);
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
	
	/** bullet type tag */
	private tag: BulletType | undefined = undefined
	
	/** bullet factory */
	private bulletFactory: BulletFactory | undefined = undefined

    // LIFE-CYCLE CALLBACKS:
	
	/**
	 * cc.NodePool get() --> reuse
	 * 从节点池取出的时候初始化属性
	*/
	reuse(bulletFactory: BulletFactory, type: BulletType, dir: cc.Vec2, speed: number): void {
		this.bulletFactory = bulletFactory
		this.tag = type
		this.moveSpeed = speed
		this.moveDir = dir
	}
	
	/** cc.NodePool put(prefab) */
	unuse(): void {
		
	}

    update (dt: number): void {
		if(this.moveSpeed === 0) {
			return
		}
		if(this.moveDir.x !== 0) {
			this.node.x += this.moveDir.x * this.moveSpeed * dt
		}
		if (this.moveDir.y !== 0) {
		    this.node.y += this.moveDir.y * this.moveSpeed * dt
		}
		/** 超出屏幕，回收 */
		if(this.node.x > Math.abs(cc.winSize.width/2) || this.node.y > Math.abs(cc.winSize.height/2)) {
			/** 从节点池回收这个节点 */
			this.bulletFactory.bulletPools[this.tag].put(this.node)
			// cc.log("回收成功")
		}
	}
	
	/** 碰撞后回调 */
	onCollisionEnter (other: cc.Collider, self: cc.Collider): void {
	    // cc.log("碰撞 other", other.node)
		
		/** 生成子弹击中效果 */
		let pos = self.node.getPosition()
		StaticInstance.explosionFactroy.createExplosion(ExplosionType.explosion_02, pos)

		/** 从节点池回收这个节点 */
		this.bulletFactory.bulletPools[this.tag].put(self.node)
	}
}
