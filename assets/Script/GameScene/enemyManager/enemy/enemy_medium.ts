const {ccclass, property} = cc._decorator;

import enemyBase from "../enemyBase"

@ccclass
export default class enemy_medium extends enemyBase {
    
    onEnable() {
        this.enemyHp = 5
    }
}
