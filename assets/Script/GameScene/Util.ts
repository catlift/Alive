import { MusicResUrl } from "./Enum/Enum"

export class Util {
	/** 
	 * 在 min 和 max 之间随机小数
	 * @param {number} min
	 * @param {number} max
	*/
	static randomNumber(min: number, max: number): number {
		return min + Math.random() * (max - min)
	}
	
	/** 
	 * 随机角度转换向量
	 * @param minAngle 最小角度
	 * @param maxAngle 最大角度
	*/
	static randomDir(minAngle: number, maxAngle: number): cc.Vec2 {
		let angle = this.randomNumber(minAngle, maxAngle)
		/** 
		 * 度数转弧度
		 * https://docs.cocos.com/creator/2.4/api/zh/classes/misc.html#degreestoradians
		*/
		let rad = cc.misc.degreesToRadians(angle)
		return cc.v2(Math.cos(rad), Math.sin(rad))
	}

	/**
	 * 以某点为圆心，生成圆周上等分点的坐标
	 * 
	 * @param {number} radius 半径
	 * @param {cc.Vec2} pos 圆心坐标
	 * @prame {number} count 等分点数量
	 * @param {number} [randomScope=80] 等分点的随机波动范围
	 * @return {cc.Vec2[]} 返回等分点坐标
	 */
	static getCirclePoints(radius: number, pos: cc.Vec2, count: number, randomScope: number = 60): cc.Vec2[] {
		let points = []
		/** 弧度 */
		let radians = (Math.PI / 180) * Math.round(360 / count)
		for(let i = 0; i < count; i++) {
			let x = pos.x + radius * Math.sin(radians * i)
			let y = pos.y + radius * Math.cos(radians * i)
			/** unshift： 将指定的元素插入 points 数组 */
			points.unshift(cc.v3(x + Math.random() * randomScope, y + Math.random() * randomScope, 0))
		}
		return points
	}

	/**
	 * 加载音频
	 */
	static loadMusic(url: MusicResUrl): Promise<cc.AudioClip | undefined> {
		return new Promise((resolve, reject) => {
			cc.loader.loadRes(url, cc.AudioClip, (err, audioClip) => {
				if(err) resolve(undefined)
				resolve(audioClip)
			})
		})
	}
}