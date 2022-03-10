const {ccclass, property} = cc._decorator;

import { ExplosionType } from "../Enum/Enum"
import ExplosionFactory from "./explosionFactory"

@ccclass
export default class expolsionBase extends cc.Component {

    public explosionFactory: ExplosionFactory | undefined = undefined
    
    public tag: ExplosionType | undefined = undefined

    public aniCom: cc.Animation |undefined = undefined

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.aniCom = this.node.getComponent(cc.Animation)
    }

    /** get() --> reuse() */
    reuse(explosionFactory: ExplosionFactory, type: ExplosionType): void {
        this.explosionFactory = explosionFactory
        this.tag = type
    }

    unuse() {

    }

    /** 帧事件 explosionFinished */
    explosionFinished(): void {
        this.explosionFactory.explosionPools[this.tag].put(this.node)
        // cc.log("回收成功")
    }
}
