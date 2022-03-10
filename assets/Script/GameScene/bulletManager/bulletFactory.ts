const {ccclass, property} = cc._decorator;

import { StaticInstance } from "../staticInstance/staticInstance"

import bullet_01 from "./bullet/bullet_01"
import bullet_02 from "./bullet/bullet_02"
import bullet_03 from "./bullet/bullet_03"

/** enum bullet type */
export enum BulletType {
	/** 基础的 player bullet, 类似流星 */
	A = 0,
	/** 基础的 enemy bullet, 类似圆形 */
	B = 1,
	/** 基础的 player bullet, 类似流星, 改变成红色 */
	C = 2
}

@ccclass
export default class bulletFactory extends cc.Component {

	@property({
		type: cc.Prefab,
		tooltip: "bullet prefab"
	})
	bulletPrefab: cc.Prefab[] = []
	
	/** bullet cc.nodePool list */
	bulletPools: cc.NodePool[] = []

    // LIFE-CYCLE CALLBACKS:

    onLoad (): void {
		/** 管理脚本 */
		StaticInstance.setBulletFactroy(this)

		/** 节点池初始化 */
		this.initNodePool();
	}
	
	initNodePool(): void {
		/** new cc.NodePool() --> bullet.ts */
		this.bulletPools[BulletType.A] = new cc.NodePool(bullet_01)
		this.bulletPools[BulletType.B] = new cc.NodePool(bullet_02)
		this.bulletPools[BulletType.C] = new cc.NodePool(bullet_03)
		
		/** 存 bullet */
		this.putPrefabInPool(BulletType.A, 200)
		this.putPrefabInPool(BulletType.B, 400)
		this.putPrefabInPool(BulletType.C, 200)
	}
	
	/** 生成 bullet node ，放入 bulletPools[] */
	putPrefabInPool(type: BulletType, count: number): void {
		for(let i = 0; i < count; i++) {
			let bullet: cc.Node | undefined = cc.instantiate(this.bulletPrefab[type])
			this.bulletPools[type].put(bullet)
		}
	}
	
	/** 从 bulletPools 拿出 bullet */
	createBullet(type: BulletType, dir: cc.Vec2, speed: number, group: string): cc.Node {
		let bullet: cc.Node | undefined = undefined
		/** 如果 bulletPools 里面没有了，就初始化一个新 bullet node，再放入 bulletPools  */
		if(this.bulletPools[type].size() <= 0) {
			bullet = cc.instantiate(this.bulletPrefab[type])
			this.bulletPools[type].put(bullet)
		}
		/** get() ---> reuse() , get()里面有参数的话，reuse() 也要注意对应写 */
		bullet = this.bulletPools[type].get(this, type, dir, speed)
		// cc.log(this.bulletPools[type])
		/** 分组，group */
		bullet.group = group
		/** 增加到节点树 */
		this.node.addChild(bullet)
		
		return bullet
	}
}
