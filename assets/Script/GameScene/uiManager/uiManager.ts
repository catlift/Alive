const {ccclass, property} = cc._decorator;

import { StaticInstance } from "../staticInstance/staticInstance";

@ccclass
export default class uiManager extends cc.Component {

    @property({
        type: cc.Node,
        tooltip: "hpNode children"
    })
    hpNodes: cc.Node | undefined = undefined

    @property({
        type: cc.Node,
        tooltip: "gold, pos"
    })
    gold: cc.Node | undefined = undefined

    @property({
        type: cc.Label,
        tooltip: "gold count"
    })
    goldLabel: cc.Label | undefined = undefined

    @property({
        type: cc.Label,
        tooltip: "killed enemy label count"
    })
    scoreLabel: cc.Label | undefined = undefined

    @property({
        type: cc.Label,
        tooltip: "nuclearBombCount label"
    })
    bombLabel: cc.Label | undefined = undefined

    @property({
        type: cc.Node,
        tooltip: "gameOver"
    })
    gameOverNode: cc.Node | undefined = undefined

    public pos: cc.Vec2 = cc.v2(0, 0)

    _hpCount: number = 5
    get hpCount(): number {
        return this._hpCount
    }
    set hpCount(value: number) {
        if(value < 0) value = 0
        if(value > 5) value = 5
        this._hpCount = value
        for(let i = 0; i < this.hpNodes.children.length; i++) {
            if(i < value) this.hpNodes.children[i].active = true
            else this.hpNodes.children[i].active = false
        }
        if(value <= 0) this.gameOverNode.active = true
    }

    _goldCount: number = 0
    get goldCount(): number {
        return this._goldCount
    }
    set goldCount(value: number) {
        this._goldCount = value
        this.goldLabel.string = this._goldCount.toString()
    }

    _scoreCount: number = 0
    get scoreCount(): number {
        return this._scoreCount
    }
    set scoreCount(value: number) {
        if(value < 0) value = 0
        this._scoreCount = value
        this.scoreLabel.string = this._scoreCount.toString()
    }

    _bombCount: number = 99
    get bombCount(): number {
        return this._bombCount
    }
    set bombCount(value: number) {
        /** min */
        if(value <= 0) value = 0
        /** max */
        // if(value >= 1) value = 1
        this._bombCount = value
        this.bombLabel.string = this._bombCount.toString()
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        StaticInstance.setUIManager(this)
    }

    start () {
        this.gameOverNode.active = false
        this.pos = this.gold.parent.getPosition()
        this.goldLabel.string = "0"
        this.scoreLabel.string = "0"
        this.bombLabel.string = "9"
    }

    // update (dt) {}
}
