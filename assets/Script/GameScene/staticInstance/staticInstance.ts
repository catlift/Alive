/** 
 * 静态单例
 * 管理互相调用的脚本
 */
import BulletFactroy from "../bulletManager/bulletFactory"
import PropFactory from "../propManager/propFactory"
import EnemyFactory from "../enemyManager/enemyFactory"
import ExplosionFactory from "../explosionManager/explosionFactory"
import UIManager from "../uiManager/uiManager"
import WeaponFactroy from "../weaponManager/weapon"

export class StaticInstance {
    static bulletFactroy: BulletFactroy | undefined = undefined
    static propFactroy: PropFactory | undefined = undefined
    static enemyFactroy: EnemyFactory | undefined = undefined
    static explosionFactroy: ExplosionFactory | undefined = undefined
    static uimanager: UIManager | undefined = undefined
    static weapon: WeaponFactroy | undefined = undefined

    static setBulletFactroy(context: BulletFactroy) {
        this.bulletFactroy = context
    }

    static setPropFactroy(context: PropFactory) {
        this.propFactroy = context
    }

    static setEnemyFactroy(context: EnemyFactory) {
        this.enemyFactroy = context
    }

    static setExplosionFactroy(context: ExplosionFactory) {
        this.explosionFactroy = context
    }

    static setUIManager(context: UIManager) {
        this.uimanager = context
    }

    static setWeapon(context: WeaponFactroy) {
        this.weapon = context
    }
}