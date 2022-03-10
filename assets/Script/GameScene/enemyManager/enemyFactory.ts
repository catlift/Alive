const {ccclass, property} = cc._decorator;

import { StaticInstance } from "../staticInstance/staticInstance";
import { EnemyType } from "../Enum/Enum";

import enemy_small from "./enemy/enemy_small"
import enemy_medium from "./enemy/enemy_medium"
import enemy_big from "./enemy/enemy_big"
import enemy_boss from "./enemy/enemy_boss";

@ccclass
export default class enemyFactory extends cc.Component {
	
	@property({
		type: cc.Prefab,
		tooltip: "enemy type prefab"
	})
	enemyPrefab: cc.Prefab[] = []
	
	/** enemy cc.nodePool list */
	enemyPools: cc.NodePool[] = []

    // LIFE-CYCLE CALLBACKS:

    onLoad (): void {
		/** 管理脚本 */
		StaticInstance.setEnemyFactroy(this)

		/** 节点池初始化 */
		this.initEnemyPool()
	}
	
	/** init enemy cc.NodePool() */
	initEnemyPool(): void {
		/** new cc.NodePool() --> enemy.ts */
		this.enemyPools[EnemyType.small] = new cc.NodePool(enemy_small)
		this.enemyPools[EnemyType.meduim] = new cc.NodePool(enemy_medium)
		this.enemyPools[EnemyType.big] = new cc.NodePool(enemy_big)
		this.enemyPools[EnemyType.boss] = new cc.NodePool(enemy_boss)
		
		/** 存储 enemy */
		this.putPrefabInPool(EnemyType.small, 200)
		this.putPrefabInPool(EnemyType.meduim, 100)
		this.putPrefabInPool(EnemyType.big, 100)
		this.putPrefabInPool(EnemyType.boss, 20)
	}
	
	/** 生成 enemy 节点， 放入enemyPools[] */
	putPrefabInPool(type: EnemyType, count: number): void {
		for(let i = 0; i < count; i++) {
			let enemy: cc.Node | undefined = cc.instantiate(this.enemyPrefab[type])
			this.enemyPools[type].put(enemy)
		}
	}
	
	/** 从 enemyPools[] 中拿取 enemy */
	createEnemy(type: EnemyType, dir: cc.Vec2, speed: number): cc.Node {
		let enemy: cc.Node | undefined = undefined
		/** 如果节点池里面没有了，就新创建一个 enemy节点并放入节点池 */
		if(this.enemyPools[type].size() <= 0) {
			enemy = cc.instantiate(this.enemyPrefab[type])
			this.enemyPools[type].put(enemy)
		}
		/** 
		 * 节点池有就拿取节点 
		 * get() --> reuse()
		*/
		enemy = this.enemyPools[type].get(this, type, dir, speed)
		/** 将 enemy 加入节点树 */
		this.node.addChild(enemy)
		
		return enemy
	}
}
