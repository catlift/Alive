const {ccclass, property} = cc._decorator;

import { StaticInstance } from "../staticInstance/staticInstance";
import { EnemyType } from "../Enum/Enum"
import { Util } from "../Util"
import { Easing } from "../staticInstance/easingInstance"

@ccclass
export default class enemyCreate extends cc.Component {

	public flyTween: any | undefined = undefined

    // LIFE-CYCLE CALLBACKS:

    start(): void {

		let startTime: number = 5
		let delayTime: number = 6

		/** 定时器（间隔，重复） */
		this.schedule(() => {
			/** flyTypeNum 贝塞尔曲线的方式， 以及定时器执行次数（生成的数量） */
			let flyTypeNum: number = Math.floor(Util.randomNumber(0, 9))
			/** 定时器（调用创建 enemy 的函数，间隔， 执行次数（创建架数）） */
			this.schedule(() => this.createEnemy(EnemyType.small, flyTypeNum, undefined), 0.75, flyTypeNum < 5 ? 5 : flyTypeNum)
		}, startTime, cc.macro.REPEAT_FOREVER)
		this.schedule(() => {
			/** 获取一个 0 ---- 8 的随机整数 */
			let flyTypeNum: number = Math.floor(Util.randomNumber(0, 9))
			/** 定时器（调用创建 enemy 的函数，间隔， 执行次数（创建架数）） */
			this.schedule(() => this.createEnemy(EnemyType.meduim), 2, flyTypeNum < 4 ? 4 : flyTypeNum)
		}, delayTime, cc.macro.REPEAT_FOREVER, startTime + 1 * delayTime)
		this.schedule(() => {
			/** 获取一个 0 ---- 8 的随机整数 */
			let flyTypeNum: number = Math.floor(Util.randomNumber(0, 9))
			/** 定时器（调用创建 enemy 的函数，间隔， 执行次数（创建架数）） */
			this.schedule(() => this.createEnemy(EnemyType.big), 3, flyTypeNum < 4 ? 4 : flyTypeNum)
		}, delayTime * 2, cc.macro.REPEAT_FOREVER, startTime + 2 * delayTime)
		this.schedule(() => {
			this.scheduleOnce(()=> this.createEnemy(EnemyType.boss, undefined, true))
		}, delayTime * 2, cc.macro.REPEAT_FOREVER, startTime + 2 * delayTime)
	}

	/** createEnemy(飞机类型，tween动画，创建数量，是否为boss) */
	createEnemy(type: EnemyType, flyTypeNum ?: number, boss ?: boolean): void {
		/** 从节点池拿取节点 */
		let enemy: cc.Node = StaticInstance.enemyFactroy.createEnemy(type, cc.v2(0, -1), 200)
		/** 初始必须设置位置，或者在 enemyBase 的 reuse 的时候设置初始化位置，不然节点池回收会有问题 */
		let randomX1 = Math.floor(Math.random() * cc.winSize.width/2)
		let randomX2 = Math.random() < 0.5 ? -randomX1 : randomX1
		enemy.setPosition(cc.v2(randomX2, cc.winSize.height/2 + enemy.height))
		
		if(flyTypeNum) {
			/** 执行 cc.tween */
			this.flyBezier(flyTypeNum, enemy, type)
		}else {
			boss ? this.flyBoss(enemy) : this.flyToEnd(enemy)
		}
	}

	/** 贝塞尔曲线移动 */
	flyBezier(flyTypeNum: number, enemy: cc.Node, type: EnemyType): void {
		let self = this
		/** 动态加载 */
		cc.resources.load("flyType", function(err: any, res: cc.JsonAsset) {
			if(err) {
				cc.error(err.message || err)
				return
			}

			let data: any = undefined
			/** 根据 typeNum 选择不同的 flyType */
			switch(flyTypeNum) {
				case 0:
					data = res.json.flyType_01
					break;
				case 1:
					data = res.json.flyType_02
					break;
				case 2:
					data = res.json.flyType_03
					break;
				case 3:
					data = res.json.flyType_04
					break;
				case 4:
					data = res.json.flyType_05
					break;
				case 5:
					data = res.json.flyType_06
					break;
				case 6:
					data = res.json.flyType_07
					break;
				case 7:
					data = res.json.flyType_08
					break;
				case 8:
					data = res.json.flyType_09
					break;
			}
			/**
			 * map() 方法创建一个新数组，其结果是 该数组中 的 每个元素 都调用一个提供的函数后返回的结果
			 * 这里最后返回的是一个 cc.bezierTo
			 */
			let actions = data.map((param: any[]) => {
				let array = param.slice(1).map(p => cc.v2(p))
				return cc.bezierTo(5, array)
			})
			
			/** 因为 actions 是一个数组，并且最长就为 2（flyType.json 决定的）  */
			if(actions.length > 1){
				self.flyTween = cc.tween(enemy).then(actions[0]).then(actions[1]).call(() => {
					StaticInstance.enemyFactroy.enemyPools[type].put(enemy)
				}).start()
			}else {
				self.flyTween = cc.tween(enemy).then(actions[0]).call(() => {
					StaticInstance.enemyFactroy.enemyPools[type].put(enemy)
				}).start()
			}
		})
	}

	/** 直线 tween */
	flyToEnd(enemy: cc.Node) {
		/** tween 的 easing 动画 */
		let easAni = Easing.easingTs()
		/** 速度 */
		let speed: number = 200
		/** 目标点 */
		let endPos: cc.Vec3 = cc.v3(enemy.x, -(cc.winSize.height/2 + cc.winSize.height/2), 0)
		/** 时间 */
		let time: number = Math.abs(endPos.y / speed)
		/** 执行缓动 */
		cc.tween(enemy).to(time, {position: endPos}, {easing: easAni}).start()
	}

	/** boss 专属 */
	flyBoss(enemy: cc.Node) {
		/** tween 的 easing 动画 */
		let easAni = Easing.easingTs() 
		/** 速度 */
		let speed: number = 200
		/** 出现后停留的位置 */
		let endPos: cc.Vec3 = cc.v3(enemy.x, cc.winSize.height/3, 0)
		/** 时间计算 */
		let time: number = Math.abs(endPos.y / speed)
		/** 第一个缓动，boss 出现 */
		let flyVisiblty = cc.tween().to(time, {position: endPos})
		/** 左右坐标确定 */
		let leftEndX = -(cc.winSize.width/2 - enemy.width/2)
		let rightEndX = cc.winSize.width/2 - enemy.width/2
		/** 左右缓动 */
		let flyRToL = cc.tween().to(time * 2, {position: cc.v2(leftEndX, endPos.y)}, {easing: easAni}).to(time * 2, {position: cc.v2(rightEndX, endPos.y)}, {easing: easAni})
		let flyLToR = cc.tween().to(time * 2, {position: cc.v2(rightEndX, endPos.y)}, {easing: easAni}).to(time * 2, {position: cc.v2(leftEndX, endPos.y)}, {easing: easAni})

		if(enemy.x < 0) cc.tween(enemy).then(flyVisiblty).then(flyLToR).repeatForever().start()
		else cc.tween(enemy).then(flyVisiblty).then(flyRToL).repeatForever().start()
	}
}
