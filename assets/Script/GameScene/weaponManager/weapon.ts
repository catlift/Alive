const {ccclass, property} = cc._decorator;

import { StaticInstance } from "../staticInstance/staticInstance"
import { WeaponType } from "../Enum/Enum"
import { BulletType } from "../bulletManager/bulletFactory"

@ccclass
export default class weapon extends cc.Component {

	// LIFE-CYCLE CALLBACKS:

	onLoad () {
        StaticInstance.setWeapon(this)
    }

	/** 基础直线型, speed 建议 550，每个间隔建议：0.5 */
	weaponTypeA(type: BulletType, dir: cc.Vec2, group: string, parent: cc.Node, offsetX ?: number): void {
		/** bulletFactory.ts createBullet(类型，方向，速度，分组) */
		let bullet: cc.Node = StaticInstance.bulletFactroy.createBullet(type, dir, 550, group)
		/** 避免子弹角度冲突 */
		bullet.angle = 0
		if(offsetX) bullet.setPosition(parent.x + offsetX, parent.y)
		else bullet.setPosition(parent.x, parent.y)
	}

	/** 跟踪子弹，只适合单个目标 */
	
}
