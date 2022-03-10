const {ccclass, property} = cc._decorator;

import { StaticInstance } from "../staticInstance/staticInstance"
import { WeaponType } from "../Enum/Enum"
import { BulletType } from "../bulletManager/bulletFactory"

@ccclass
export default class weapon extends cc.Component {

    /** 武器子弹类型 */
    private weaponBtType: BulletType | undefined = undefined

    /** 当前武器的父节点 */
    private weaponParent: cc.Node | undefined = undefined

    /** 武器发射子弹的方向 */
    private weaponDir: cc.Vec2 = new cc.Vec2(0, 0)

    /** 武器发射出的子弹速度 */
    private weaponSpeed: number = 0

    /** 武器发射出的子弹分组 */
    weaponBtGroup: string | undefined = "default"

    /**
     * 直接将武器作为发射器挂载到需要的 玩家、敌人身上--》作为子节点
     * 根据对于的 父节点（玩家、敌人）设置 武器类型、子弹方向、子弹速度、武器分组、、、
     */

	// LIFE-CYCLE CALLBACKS:

	onLoad () {
        this.weaponParent = this.node.parent
        if(this.weaponParent.group === "player") {
            this.weaponBtType = BulletType.A
            this.weaponBtGroup = "player_bullet"
        }else {
            this.weaponBtType = BulletType.B
            this.weaponBtGroup = "enemy_bullet"
        }
    }

	/** 基础直线型, speed 建议 550，每个间隔建议：0.5 */
	weaponTypeA(dir: cc.Vec2, offsetX ?: number): void {
        
        this.weaponSpeed = 550
		/** bulletFactory.ts createBullet(类型，方向，速度，分组) */
		let bullet: cc.Node = StaticInstance.bulletFactroy.createBullet(this.weaponBtType, dir, this.weaponSpeed, this.weaponBtGroup)
		/** 避免子弹角度冲突 */
		bullet.angle = 0
		if(offsetX) bullet.setPosition(this.weaponParent.x + offsetX, this.weaponParent.y)
		else bullet.setPosition(this.weaponParent.x, this.weaponParent.y)
	}

	/** 跟踪子弹，只适合单个目标 */
	
}
