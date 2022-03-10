const {ccclass, property} = cc._decorator;

import { StaticInstance } from "../staticInstance/staticInstance";

import { Util } from "../Util"
import EnemyFactory from "./enemyFactory"
import { EnemyType, PropType, ExplosionType } from "../Enum/Enum"
import { musicInstance } from "../staticInstance/musicInstance";

@ccclass
export default class enemyBase extends cc.Component {

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
	
	/** enemy type */
	private tag: EnemyType | undefined = undefined
	
	/** enemyFactory */
	private enemyFactory: EnemyFactory | undefined = undefined

	/** hp */
	_enemyHp: number = 0
	get enemyHp(): number {
		return this._enemyHp
	}
	set enemyHp(value: number) {
		if(value < 0) value = 0
		this._enemyHp = value
		/** 从节点池回收这个节点 */
		if(this._enemyHp <= 0) this.enemyFactory.enemyPools[this.tag].put(this.node)
	}

	/** 发射子弹的匿名函数 */
	callBack: () => void

    // LIFE-CYCLE CALLBACKS:
	
	/** 
	 * cc.NodePool() get() --> reuse
	 * 从节点池取出来的时候初始化属性
	*/
	reuse(enemyFactory: EnemyFactory, type: EnemyType, dir: cc.Vec2, speed: number): void {
		this.enemyFactory = enemyFactory
		this.tag = type
		this.moveDir = dir
		this.moveSpeed = speed
	}
	
	/** 
	 * cc.NodePool() put(prefab) --> unuse()
	*/
	unuse(): void {
		
	}

	update (dt: number): void {
		// if(this.moveSpeed === 0) {
		// 	return
		// }
		// if(this.moveDir.x !== 0) {
		// 	this.node.x += this.moveDir.x * this.moveSpeed * dt
		// }
		// if (this.moveDir.y !== 0) {
		//     this.node.y += this.moveDir.y * this.moveSpeed * dt
		// }
		/** 超出屏幕，回收 */
		if(this.node.x > Math.abs(cc.winSize.width/2) || this.node.y < -cc.winSize.height/2) {
			/** 注销定时器 */
			this.unschedule(this.callBack)
			/** 停止这个节点的所以 tween */
			cc.Tween.stopAllByTarget(this.node)
			/** 从节点池回收这个节点 */
			this.enemyFactory.enemyPools[this.tag].put(this.node)
		}
	}
	
    /** 碰撞后回调 */
    onCollisionEnter (other: cc.Collider, self: cc.Collider): void {
		/** 注销定时器 */
		this.unschedule(this.callBack)
		/** gold 图案位置 */
		let goldPos = StaticInstance.uimanager.pos
		/** 怪物碰撞时的位置 */
		let pos: cc.Vec2 = self.node.getPosition()
		// cc.log("碰撞 other", other.node)

		/** 减去 enemyHp */
		if(other.node.group === "player_bullet") {
			this.enemyHp -= 1
		}else {
			this.enemyHp = 0
		}
		/** 生命值归零时 */
		if(this.enemyHp <= 0) {
			/** 先停止 tween */
			cc.Tween.stopAllByTarget(self.node)
			/** 生成爆炸 */
			StaticInstance.explosionFactroy.createExplosion(ExplosionType.explosion_01, pos)
			/** 播放音乐 */
			musicInstance.getInstance().playBoom()
			/** 增加击杀数 */
			StaticInstance.uimanager.scoreCount += 1
			/** 生成 prop */
			let randomA: number = Math.random()
			let randomB: number = Math.random()
			/** 掉落概率 */
			randomA < 0.3 ? ( randomB < 0.5 ?
				StaticInstance.propFactroy.createProp(PropType.bullet, this.moveDir, this.moveSpeed, pos)
				: StaticInstance.propFactroy.createProp(PropType.hp, this.moveDir, this.moveSpeed, pos) )
			: this.playGoldFlyAnim(pos, cc.v2(goldPos.x, goldPos.y))
		}
	}
	
	/** 
	 * enemyPos: enemy死亡的时候的位置，也是 gold 的起始点 
	 * endPos: 就是 gold UI 的位置，也是 gold 要到达的地方
	 * radius: 半径，gold 是根据 enemyPos 和 radius 围成的一个圆来生成的
	 */
	playGoldFlyAnim(enemyPos: cc.Vec2, endPos: cc.Vec2, radius: number = 130) {
		/** 生成的 gold 数量，不是实际加的哦，只是个效果 */
		let count = Math.random() * 3 + 2
		/** 调用 Util.ts 方法  */
		let points = Util.getCirclePoints(radius, enemyPos, count)
		let goldNodeList = points.map( pos => {
			let prop_gold = StaticInstance.propFactroy.createProp(PropType.gold, cc.v2(0, 0), this.moveSpeed, enemyPos)
			return {
				node: prop_gold,
				stPos: enemyPos,
				mdPos: pos,
				enPos: endPos,
				dis: (pos as any).sub(endPos).mag()
			}
		})
		goldNodeList = goldNodeList.sort((a, b) => {
			if(a.dis - b.dis > 0) return 1
			if(a.dis - b.dis < 0) return -1
			return 0
		})

		/** 执行掉落动画 */
		goldNodeList.forEach((item, idx) => {
			cc.tween(item.node)
				.to(0.3, {position: cc.v3(item.mdPos.x, item.mdPos.y, 0)})
				.delay(idx * 0.01)
				.to(0.5, {position: cc.v3(item.enPos.x, item.enPos.y, 0)})
				.call(() => {
					/** 回收 */
					StaticInstance.propFactroy.propPools[PropType.gold].put(item.node)
				})
				.start()
		})

		/** 对应 gold 数量增加 */
		StaticInstance.uimanager.goldCount += 5
	}

	
}
