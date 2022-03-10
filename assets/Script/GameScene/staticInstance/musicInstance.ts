import { MusicResUrl } from "../Enum/Enum"
import { Util } from "../Util"

/** 音频单例 */
export class musicInstance {
    private static instance: musicInstance

    private constructor() {}

    static getInstance(): musicInstance {
        if(!this.instance) {
            this.instance = new musicInstance()
        }
        return this.instance
    }


    /** 
     * playMusic 播放背景音乐 
     * playEffect 播放音效
     */
    async playGameStart() {
        const audio = await Util.loadMusic(MusicResUrl.gameStart)
        audio && cc.audioEngine.playEffect(audio, false)
    }

    async playMars() {
        const audio = await Util.loadMusic(MusicResUrl.Mars)
        audio && cc.audioEngine.playMusic(audio, true)
    }

    async playBoom() {
        const audio = await Util.loadMusic(MusicResUrl.boom)
        audio && cc.audioEngine.playEffect(audio, false)
    }

    async playBiu() {
        const audio = await Util.loadMusic(MusicResUrl.biu)
        audio && cc.audioEngine.playEffect(audio, false)
    }
}