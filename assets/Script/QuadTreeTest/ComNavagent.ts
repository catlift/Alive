const { ccclass, property } = cc._decorator;

/** 本代码来自：https://forum.cocos.org/t/topic/109742/4 */

@ccclass
export default class ComNavagent extends cc.Component {
    @property
    private is_debug = false;

    private anim_com: cc.Animation;
    private grapgics: cc.Graphics;
    private road_data_set = [];

    private isMoving: boolean = false;

    private roadNode = null;                // 绘画路径点
    private callBack = null;                // 到达终点回调

    onLoad() {
        this.anim_com = this.node.getComponent(cc.Animation);
        var clips = this.anim_com.getClips();
        var clip = clips[0];

        this.roadNode = new cc.Node();
        this.roadNode.name = "road";
        this.roadNode.parent = this.node.parent.parent;
        this.grapgics = this.roadNode.addComponent(cc.Graphics);

        this.grapgics.fillColor = cc.Color.GREEN;
        var paths = clip.curveData.paths;
        //console.log(paths);

        this.road_data_set = [];

        for (let k in paths) {
            if (paths[k].props.position.length == 0) continue;
            var road_data = paths[k].props.position;
            this.gen_path_data(road_data);
        }

        if (this.is_debug) {
            this.draw_roads();
        }

        //this.initNavagent(1, 200);
    }


    update(dt) {
        if (this.isMoving == false) return;

        this.passedTime += dt;

        if (this.passedTime > this.walkTime) {
            dt = this.passedTime - this.walkTime;
        }

        this.node.x += this.vec_x * dt;
        this.node.y += this.vec_y * dt;

        if (this.passedTime >= this.walkTime) {
            this.nextStep++;
            this.walkToNext();
        }
    }


    // 所有路线点的集合
    get_road_set() {
        return this.road_data_set;
    }

    // 生成点
    gen_path_data(road_data) {
        var ctrl1 = null;
        var start_point = null;
        var end_point = null;
        var ctrl2 = null;

        var road_curve_path = [];
        for (var i = 0; i < road_data.length; i++) {
            var key_frame = road_data[i];
            if (ctrl1 !== null) {
                road_curve_path.push([start_point, ctrl1, ctrl1, cc.v2(key_frame.value[0], key_frame.value[1])]);
            }

            start_point = cc.v2(key_frame.value[0], key_frame.value[1]);

            for (var j = 0; j < key_frame.motionPath.length; j++) {
                end_point = cc.v2(key_frame.motionPath[j][0], key_frame.motionPath[j][1]);
                ctrl2 = cc.v2(key_frame.motionPath[j][2], key_frame.motionPath[j][3]);
                if (ctrl1 === null) {
                    ctrl1 = ctrl2;
                }
                // 贝塞尔曲线 start_point, ctrl1, ctrl2, end_point
                road_curve_path.push([start_point, ctrl1, ctrl2, end_point]);
                ctrl1 = cc.v2(key_frame.motionPath[j][4], key_frame.motionPath[j][5]);
                start_point = end_point;
            }
        }

        //console.log(road_curve_path);

        var one_road = [road_curve_path[0][0]];

        for (var index = 0; index < road_curve_path.length; index++) {
            start_point = road_curve_path[index][0];
            ctrl1 = road_curve_path[index][1];
            ctrl2 = road_curve_path[index][2];
            end_point = road_curve_path[index][3];

            var OFFSET = 16;
            var len = this.bezier_length(start_point, ctrl1, ctrl2, end_point);
            var count = len / OFFSET;
            count = Math.floor(count);
            var t_delta = 1 / count;
            var t = t_delta;

            for (var i = 0; i < count; i++) {
                var x = start_point.x * (1 - t) * (1 - t) * (1 - t) +
                    3 * ctrl1.x * t * (1 - t) * (1 - t) +
                    3 * ctrl2.x * t * t * (1 - t) +
                    end_point.x * t * t * t;
                var y = start_point.y * (1 - t) * (1 - t) * (1 - t) +
                    3 * ctrl1.y * t * (1 - t) * (1 - t) +
                    3 * ctrl2.y * t * t * (1 - t) +
                    end_point.y * t * t * t;
                one_road.push(cc.v2(x, y));
                t += t_delta;
            }
        }

        //console.log(one_road);
        this.road_data_set.push(one_road);
    }

    // 计算两点的距离
    bezier_length(start_point, ctrl1, ctrl2, end_point) {
        // t[0,1] t分成20等份 1/20 = 0.05
        var prev_point = start_point;
        var length = 0;
        var t = 0.05;
        for (var i = 0; i < 20; i++) {
            var x = start_point.x * (1 - t) * (1 - t) * (1 - t) +
                3 * ctrl1.x * t * (1 - t) * (1 - t) +
                3 * ctrl2.x * t * t * (1 - t) +
                end_point.x * t * t * t;
            var y = start_point.y * (1 - t) * (1 - t) * (1 - t) +
                3 * ctrl1.y * t * (1 - t) * (1 - t) +
                3 * ctrl2.y * t * t * (1 - t) +
                end_point.y * t * t * t;
            var now_point = cc.v2(x, y);
            var dir = now_point.sub(prev_point);
            prev_point = now_point;
            length += dir.mag();

            t += 0.05;
        }
        return length;
    }

    // 显示路径点
    draw_roads() {
        this.grapgics.clear();

        for (var j = 0; j < this.road_data_set.length; j++) {
            var path = this.road_data_set[j];

            for (var i = 0; i < path.length; i++) {
                this.grapgics.moveTo(path[i].x - 2, path[i].y + 2);
                this.grapgics.lineTo(path[i].x - 2, path[i].y - 2);
                this.grapgics.lineTo(path[i].x + 2, path[i].y - 2);
                this.grapgics.lineTo(path[i].x + 2, path[i].y + 2);
                this.grapgics.close();
            }
        }

        this.grapgics.fill();
    }



    private roadData = [];
    private nextStep = 1;
    private walkTime = 0;
    private speed = 0;
    private vec_x = 0;
    private vec_y = 0;
    private passedTime = 0;     // 每一步的计时器
    /**
     * 开始移动
     * @param roadIndex     路径点，该节点上绑定的position动画
     * @param speed         移动速度
     * @param callBack      导航结束回调
     */
    initNavagent(roadIndex, speed, callBack?) {
        this.roadData = this.road_data_set[roadIndex];
        this.nextStep = 1;
        this.walkTime = 0;
        this.speed = speed;
        this.callBack = callBack;
        if (this.roadData.length == null || this.roadData.length < 2) {
            return false;
        }
        else {
            this.node.setPosition(this.roadData[0].x, this.roadData[0].y);
            this.walkToNext();
            return true;
        }
    }

    // 移动到下个点
    walkToNext() {
        // 导航结束，移除指示线
        if (this.nextStep >= this.roadData.length) {
            this.isMoving = false;
            this.callBack && this.callBack();
            this.roadNode.destroy();
            return;
        }

        let src = this.node.getPosition();
        let dst = this.roadData[this.nextStep];
        let dir = dst.sub(src);
        let len = dir.mag();
        if (len <= 0) {
            this.nextStep++;
            this.walkToNext();
            return;
        }
        this.walkTime = len / this.speed;
        this.vec_x = this.speed * dir.x / len;
        this.vec_y = this.speed * dir.y / len;
        this.passedTime = 0;
        this.isMoving = true;
    }

    // 继续导航
    continueNav() {
        this.isMoving = true;
    }

    // 停止导航
    pauseNav() {
        this.isMoving = false;
    }

    onDestroy() {
        this.roadNode.destroy();
    }

    // 改变速度
    alterSpeed(speed) {
        this.speed = speed;
    }
}
