const {ccclass, property} = cc._decorator;

import ExplosionBase from "../explosionBase"

@ccclass
export default class explosion_02 extends ExplosionBase {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    onEnable(): void {
        this.aniCom.play("explosion_02")
    }
}
