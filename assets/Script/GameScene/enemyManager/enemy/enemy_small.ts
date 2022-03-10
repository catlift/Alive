const {ccclass, property} = cc._decorator;

import enemyBase from "../enemyBase"

@ccclass
export default class enemy_small extends enemyBase {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
		
    }

    // update (dt) {}

    onEnable() {
        this.enemyHp = 2
    }

}
