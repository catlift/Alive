const {ccclass, property} = cc._decorator;

@ccclass
export default class gameOver extends cc.Component {

    @property(cc.Node)
    bg: cc.Node | undefined = undefined

    @property(cc.Node)
    test: cc.Node | undefined = undefined

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.bg.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)

        this.schedule(function(){
            cc.tween(this.test)
            .to(1, {scale: 1.2})
            .to(1, {scale: 1})
            .start()
        }, 3)
    }

    onDestroy() {
        this.bg.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
    }

    onTouchStart() {
        cc.director.loadScene("GameScene")
    }
}
