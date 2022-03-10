import { MusicResUrl } from "./Enum/Enum";
import { musicInstance } from "./staticInstance/musicInstance";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    onLoad (): void {
		/** 获取碰撞检测系统 */
		let manager = cc.director.getCollisionManager()
		/** 开启碰撞检测 */
		manager.enabled = true
		/** 开启 debug 绘制 */
		// manager.enabledDebugDraw = true

		/** 锁帧 */
		// cc.game.setFrameRate(60)
		
		this.musicPlay()
	}

	musicPlay() {
		musicInstance.getInstance().playMars()
		musicInstance.getInstance().playGameStart()
	}
}
