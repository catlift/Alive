const {ccclass, property} = cc._decorator;

import { StaticInstance } from "../staticInstance/staticInstance"
import { PropType } from "../Enum/Enum"

import prop_hp from "./prop/prop_hp"
import prop_bullet from "./prop/prop_bullet"
import prop_gold from "./prop/prop_gold"
import prop_nuclearBomb from "./prop/prop_nuclearBomb"

@ccclass
export default class propFactory extends cc.Component {

	@property({
		type: cc.Prefab,
		tooltip: "prop prefab"
	})
	propPrefab: cc.Prefab[] = []
	
	propPools: cc.NodePool[] = []

    // LIFE-CYCLE CALLBACKS:

    onLoad (): void {
		/** 管理脚本 */
		StaticInstance.setPropFactroy(this)

		/** 初始化节点池 */
		this.initPropPool()
	}
	
	/** init prop cc.NodePool() */
	initPropPool(): void {
		/** new cc.NodePool() --> prop.ts */
		this.propPools[PropType.hp] = new cc.NodePool(prop_hp)
		this.propPools[PropType.bullet] = new cc.NodePool(prop_bullet)
		this.propPools[PropType.gold] = new cc.NodePool(prop_gold)
		this.propPools[PropType.nuclearBomb] = new cc.NodePool(prop_nuclearBomb)
		
		/** 存入 prop */
		this.putPrefabInPool(PropType.hp, 100)
		this.putPrefabInPool(PropType.bullet, 100)
		this.putPrefabInPool(PropType.gold, 300)
		this.putPrefabInPool(PropType.nuclearBomb, 50)
	}
	
	/** 生成 prop 节点，放入节点池 */
	putPrefabInPool(type: PropType, count: number): void {
		for(let i = 0; i < count; i++) {
			let prop: cc.Node | undefined = cc.instantiate(this.propPrefab[type])
			this.propPools[type].put(prop)
		}
	}
	
	/** 从节点池 propPools 拿取 prop节点 */
	createProp(type: PropType, dir: cc.Vec2, speed: number, pos: cc.Vec2): cc.Node {
		let prop: cc.Node | undefined = undefined
		/** 当节点池里没有空闲节点时，初始化一个节点，并放入节点池 */
		if(this.propPools[type].size() < 0) {
			prop = cc.instantiate(this.propPrefab[type])
			this.propPools[type].put(prop)
		}
		/** 有就拿 */
		prop = this.propPools[type].get(this, type, dir, speed)
		prop.setPosition(pos)
		/** 加入节点树 */
		this.node.addChild(prop)
		
		return prop
	}
}
