const {ccclass, property} = cc._decorator;

import ExplosionBase from "../explosionBase"

@ccclass
export default class explosion_01 extends ExplosionBase {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    onEnable(): void {
        this.aniCom.play("explosion_01")
    }
   
    explosionFinished(): void {
        this.explosionFactory.explosionPools[this.tag].put(this.node)
        // cc.log("回收成功")
    }
}
