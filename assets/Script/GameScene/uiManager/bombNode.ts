import { BulletType } from "../bulletManager/bulletFactory";
import { ExplosionType } from "../Enum/Enum";
import { StaticInstance } from "../staticInstance/staticInstance"

const {ccclass, property} = cc._decorator;

@ccclass
export default class bombNode extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
    }

    onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
    }

    // update (dt) {}

    onTouchStart() {
        if(!StaticInstance.uimanager.bombCount) return
        let bullet = StaticInstance.bulletFactroy.createBullet(BulletType.C, cc.v2(0, 0), 200, "default")
        bullet.setPosition(0, -(cc.winSize.height / 2))
        cc.tween(bullet)
            .to(3, {position: cc.v3(0, 0, 0)})
            .call(() => {
                /** 回收 */
                StaticInstance.bulletFactroy.bulletPools[BulletType.C].put(bullet)
                /** 产生爆炸 */
                StaticInstance.explosionFactroy.createExplosion(ExplosionType.explosion_03, cc.v2(0, 0))
            })
            .start()
        StaticInstance.uimanager.bombCount -= 1
    }
}
