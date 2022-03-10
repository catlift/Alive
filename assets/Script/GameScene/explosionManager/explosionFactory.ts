const {ccclass, property} = cc._decorator;

import { ExplosionType } from "../Enum/Enum";
import { StaticInstance } from "../staticInstance/staticInstance"

import explosion_01 from "./explosion/explosion_01"
import explosion_02 from "./explosion/explosion_02"
import explosion_03 from "./explosion/explosion_03";

@ccclass
export default class explosionFactory extends cc.Component {

    /** expolsion 数组节点池 */
    explosionPools: cc.NodePool[] = []

    @property({
        type: cc.Prefab,
        tooltip: "explosion prefabs array"
    })
    explosionPrefab: cc.Prefab[] = []

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        /** 管理脚本 */
        StaticInstance.setExplosionFactroy(this)

        /** 节点池初始化 */
        this.initPool()
    }

    /** 初始化 */
    initPool(): void {
        /** 确定传递脚本 */
        this.explosionPools[ExplosionType.explosion_01] = new cc.NodePool(explosion_01)
        this.explosionPools[ExplosionType.explosion_02] = new cc.NodePool(explosion_02)
        this.explosionPools[ExplosionType.explosion_03] = new cc.NodePool(explosion_03)

        /** 将节点放入节点池 */
        this.putPrefabInPool(ExplosionType.explosion_01, 300)
        this.putPrefabInPool(ExplosionType.explosion_02, 300)
        this.putPrefabInPool(ExplosionType.explosion_03, 20)
    }

    /** 将预制体初始化,生成节点,放入节点池 */
    putPrefabInPool(type: ExplosionType, count: number): void {
        for(let i = 0; i < count; i++) {
            let explosion: cc.Node = cc.instantiate(this.explosionPrefab[type])
            this.explosionPools[type].put(explosion)
        }
    }

    /** 从节点池拿取节点 */
    createExplosion(type: ExplosionType, pos: cc.Vec2){
        let explosion: cc.Node | undefined = undefined
        /** 判断节点池是否有多余节点 */
        if(this.explosionPools[type].size() <= 0) {
            explosion = cc.instantiate(this.explosionPrefab[type])
            this.explosionPools[type].put(explosion)
        }
        explosion = this.explosionPools[type].get(this, type)
        explosion.setPosition(pos)
        this.node.addChild(explosion)

        return explosion
    }
}
