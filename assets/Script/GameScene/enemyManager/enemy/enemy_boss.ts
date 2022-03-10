const {ccclass, property} = cc._decorator;

import enemyBase from "../enemyBase";

@ccclass
export default class enemy_boss extends enemyBase {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }
    
    onEnable(): void {
        this.enemyHp = 50
    }

    // update (dt) {}
}
