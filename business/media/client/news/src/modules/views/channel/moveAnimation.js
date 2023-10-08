/**
 * 加入购物车动画效果
 * new AddCart([终点dom])
 * start([鼠标事件], config) 开始做类抛物线运动（二次方贝塞尔曲线）
 */
export default class moveAnimation{
    constructor(endDom){
        this.zoomDuringTime = 0.5;//缩放动画的时间
        this.endPoint={};//终点位置
        this.config = {
            clone: true,
            offset: {x: 0, y: 0},
            zoomType: 'end',//缩放方式 end：在终点时缩放消失；linear：从一开始就进行缩放，终点时完全消失
            startAnimation: '',//开场动画 twinkle：闪烁
            endAnimation: ''//结束动画 shake:抖动
        }
        this.init(endDom);
        return this;
    }
    /**
     * 初始化
     * @param {*} endDom 终点dom
     */
    init(endDom){
        this.endDom = endDom;//终点dom
        this.getEndPoint(endDom);//计算终点位置
    }
    /**
     * 拷贝一份dom做动画
     */
    createVirDom(dom){
        let virDom = dom.cloneNode(true);//拷贝一份
        let rect = dom.getBoundingClientRect();
        //拷贝所有计算后的样式
        // eslint-disable-next-line no-use-before-define
        let domStyle = getStyle(dom);
        let styleText = domStyle.cssText;
        if(!styleText){//IE上拿不到计算后的cssText，只能遍历获取
            for(let i=0; i< domStyle.length; i++){
                let key = domStyle.item(i);
                styleText += key + ':' + domStyle.getPropertyValue(key) + ';';
            }
        }
        virDom.setAttribute('style', styleText);
        //设置定位和起始dom重叠
        virDom.style.position = 'absolute';
        virDom.style.zIndex = '999';
        virDom.style.left = rect.left + 'px';
        virDom.style.top = rect.top + 'px';
        return document.body.appendChild(virDom);
    }
    /**
     * 计算终点位置。位于终点dom的中心位置
     * @param {*} endDom 
     */
    getEndPoint(endDom){
        let rect = endDom.getBoundingClientRect();
        this.endPoint.zoomP = {
            y: rect.top,
            x: rect.left
        }
        this.endPoint.y = rect.top + endDom.offsetHeight / 2;
        this.endPoint.x = rect.left + endDom.offsetWidth / 2;
    }
    /**
     * 根据起始位置对终点矫正（减去起始dom一半的偏移）
     * @param {*} dom 执行动画的dom
     */
    resumeEndPoint(dom, offset){
        if(!offset){
            offset = {x:0, y:0};
        }
        if(offset.x=='left'){
            this.endPoint.x -= this.endDom.offsetWidth / 2;
        }else if(offset.x=='right'){
            this.endPoint.x += this.endDom.offsetWidth / 2 - dom.offsetWidth;
        }else {
            this.endPoint.x -= (dom.offsetWidth / 2 - (!isNaN(offset.x) && offset.x ? offset.x : 0));
        }
        
        if(offset.y=='top'){
            this.endPoint.y -= this.endDom.offsetHeight / 2;
        }else if(offset.y=='bottom'){
            this.endPoint.y += this.endDom.offsetHeight / 2 - dom.offsetHeight;
        }else {
            this.endPoint.y -= (dom.offsetHeight / 2 - (!isNaN(offset.y) && offset.y ? offset.y : 0));
        }
    }
    /**
     * 移动坐标
     * @param {*} data 
     */
    move(data){
        this.animationDom.style.top=data.y+'px';
        this.animationDom.style.left=data.x+'px';
    }
    /**
     * 缩放动画：消失
     */
    zoom(zoom, time){
        this.animationDom.style.transform = `scale(${zoom})`;
        this.animationDom.style.transition = `transform ${time}s`;
    }
    /**
     * 开始做抛物线运动
     * @param {*} e 原生鼠标点击事件
     * @param {*} config 配置：
     * offset 终点偏移量,字符串表示对齐方式，比如左上角对其（left top）,右下角对齐（right bottom）,数值表示以中心对齐为基准的具体偏移量
     * x:left/right/[数值]，y:top/bottom/[数值]
     * (偏移方向为右下角，即x向右偏移，y向下偏移。负值为反方向)。默认不偏移，在终点Dom正中心 
     * target 生成动画的dom，默认是触发事件的dom
     * clone 是否克隆target进行动画。默认true
     */
    async start(e, config={}){
        Object.assign(this.config, config);
        if(!this.config.target){
            this.config.target = e.target;
        }
        let target = this.config.target;
        let that = this;
        return new Promise(async (resolve, reject) => {
            try{
                // 如果good_box正在运动
                this.finger = {};
                let topPoint = {};
                this.resumeEndPoint(target, this.config.offset);
                let rect = target.getBoundingClientRect();
                this.finger['x'] = rect.left;
                this.finger['y'] = rect.top;
                if (this.finger['y'] < this.endPoint['y']) {
                    topPoint['y'] = this.finger['y'] - 50;
                } else {
                    topPoint['y'] = this.endPoint['y'] - 50;
                }
                topPoint['x'] = Math.abs(this.finger['x'] - this.endPoint['x']) / 2;
                if (this.finger['x'] > this.endPoint['x']) {
                    topPoint['x'] = (this.finger['x'] - this.endPoint['x']) / 2 + this.endPoint['x'];
                } else {
                    topPoint['x'] = (this.endPoint['x'] - this.finger['x']) / 2 + this.finger['x'];
                }
                this.linePos = this.bezier([this.finger, topPoint, this.endPoint], 30);
                this.animationDom = this.config.clone ? this.createVirDom(target) : target;
    
                await that.startBezierAnimation();
                resolve(that);
            }catch(err){
                console.error(err);
                reject();
            }
        })
    }
    /**
     * 开始执行动画效果
     */
    startBezierAnimation() {
        var that = this;
        return new Promise((resolve)=>{
            const time = 20;
            var index = 0,
                bezier_points = this.linePos,
                len = bezier_points.length - 1;
            this.timer = setInterval(()=> {
                index++;
                that.move({
                    x: bezier_points[index]['x'],
                    y: bezier_points[index]['y']
                })
                if(that.config.zoomType == 'linear'){
                    that.zoom(1 - 0.9 / len * index, 0);
                }
                //到达终点时执行消失动画并停止抛物线动画
                if (index >= len) {
                    if(that.config.zoomType == 'end'){
                        that.zoom(0, this.zoomDuringTime);
                    }
                    that.stopBezierAnimation();
                    resolve();
                }
            }, time);
        })
    }
    /**
     * 停止动画并删除动画dom对象
     */
    stopBezierAnimation(){
        let that = this;
        clearInterval(this.timer);
        //缩放动画执行完成后，移除动画dom
        setTimeout(()=>{
            that.animationDom.remove();
        }, this.zoomDuringTime*1000);
    }

    /**
     * 绘制（一个顶点的）贝塞尔曲线路径
     * @param {*} points 
     * @param {*} part 动画帧数
     */
    bezier(points, part) {
        let sx = points[0]['x'];
        let sy = points[0]['y'];
        let cx = points[1]['x'];
        let cy = points[1]['y'];
        let ex = points[2]['x'];
        let ey = points[2]['y'];
        var bezier_points = [];
        // 起始点到控制点的x和y每次的增量
        var changeX1 = (cx - sx) / part;
        var changeY1 = (cy - sy) / part;
        // 控制点到结束点的x和y每次的增量
        var changeX2 = (ex - cx) / part;
        var changeY2 = (ey - cy) / part;
        //循环计算
        for (var i = 0; i <= part; i++) {
            // 计算两个动点的坐标
            var qx1 = sx + changeX1 * i;
            var qy1 = sy + changeY1 * i;
            var qx2 = cx + changeX2 * i;
            var qy2 = cy + changeY2 * i;
            // 计算得到此时的一个贝塞尔曲线上的点
            var lastX = qx1 + (qx2 - qx1) * i / part;
            var lastY = qy1 + (qy2 - qy1) * i / part;
            // 保存点坐标
            var point = {};
            point['x'] = lastX;
            point['y'] = lastY;
            bezier_points.push(point);
        }

        return bezier_points;
    }
}

function getStyle(obj){
    if (obj.currentStyle) {
        return obj.currentStyle;
    } 
    return document.defaultView.getComputedStyle(obj, null);
    
}