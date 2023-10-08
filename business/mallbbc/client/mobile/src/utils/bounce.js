/**
 * 阻止IOS回弹
 * container 必须有明确的高度、同时要有 overflow: auto
 */

const BOUNCE_DURATION = 0.6;//回弹动效时间。单位：秒
const DEFAULT_CONFIG = {
    el: window.document,//绑定弹性的dom
    scrollEl: window.document,//实际滚动区域的dom（和el不一定一样）
    bounce: undefined,//总开关，此属性有值时，优先用此值
    bounceTop: false,//是否顶部弹性
    bounceBottom: false,//是否底部弹性
    maxMove: 500,//最大移动距离
    thresholdTop: 90,//（顶部弹性）触发事件阈值
    thresholdBottom: 80,//（底部弹性）触发事件阈值
    dampingFactor: 0.35//阻尼系数
}
export default class Bounce {
    constructor (_config, events) {
        this.set(_config);
        this.events = events;
        this._startPoint = null
        this._moveY = null
        this._handleStart = null
        this._handleMove = null
        this._handleEnd = null
        this.init();
    }

    /**
     * 配置/更新参数
     */
    set(_config){
        this.config = Object.assign({}, DEFAULT_CONFIG, _config);
        if (this.config.bounce === false){
            this.config.bounceTop = this.config.bounceBottom = false
        }
        if (this.config.bounce === true){
            this.config.bounceTop = this.config.bounceBottom = true
        }
    }

    init () {
        if (this._handleStart === null || this._handleMove === null || this._handleEnd === null) {
            this._handleStart = this._touchstartEvent.bind(this, this)
            this._handleMove = this._touchmoveEvent.bind(this, this, this.config.el)
            this._handleEnd = this._touchendEvent.bind(this, this)
        }

        this.remove();
        this.config.el.addEventListener('touchstart', this._handleStart)
        this.config.el.addEventListener('touchmove', this._handleMove, {
            passive: false
        })
        this.config.el.addEventListener('touchend', this._handleEnd)
    }

    /**
     * 抛出事件
     */
    emit(name, ...args){
        this.events[name]?.(...args)
    }

    remove(){
        if (this.config.el){
            this.config.el.removeEventListener('touchstart', this._handleStart)
            this.config.el.removeEventListener('touchmove', this._handleMove)
            this.config.el.removeEventListener('touchend', this._handleEnd)
        }
    }

    /**
     * 获取滚动高度
     */
    _getScrollTop (el) { 
        if (!el){
            return 0;
        }
        if (el instanceof Document){
            return document.body.scrollTop || document.documentElement.scrollTop; //兼容个不同浏览器的滚动距离
        }
        return el.scrollTop
        
    }

    /**
     * 滚动内容的高度
     */
    _getScrollHeight (el) {
        if (!el){
            return 0;
        }
        if (el instanceof Document){
            return Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
        }
        return el.scrollHeight;
        
    }

    /**
     * 滚动容器的高度
     */
    _getClientHeight (el) {
        if (!el){
            return 0;
        }
        if (el instanceof Document){
            return document.documentElement.clientHeight || document.body.clientHeight;
        }
        return el.clientHeight;
        
    }

    /**
     * 获取手指位置
     */
    _getPoint (e) {
        //注意这里要用pageX、pageY，因为应计算页面的实际滑动举例
        return {
            x: e.touches ? e.touches[0].pageX : e.clientX,
            y: e.touches ? e.touches[0].pageY : e.clientY
        }
    }

    /**
     * 在可以阻止的时候阻止滚动行为
     */
    _preventDefault (e) {
        // cancelable:是否可以被禁用; defaultPrevented:是否已经被禁用
        if (e.cancelable && !e.defaultPrevented) { e.preventDefault() }
    }

    _touchstartEvent (context, e) {
        context._startPoint = context._getPoint(e)
        context._moveY = 0;
    }

    _touchmoveEvent (context, el, e) {
        if (!context._startPoint) { return } 
        let curPoint = context._getPoint(e) // 当前点
        context._moveY = curPoint.y - context._startPoint.y // 和起点比,移动的距离,大于0向下拉,小于0向上拉
        // 如果在顶部
        if (context.reachEdge('top')) { 
            context.bouncing('Top', e);
            return 
        }

        // 如果在底部
        if (context.reachEdge('bottom')) { 
            context.bouncing('Bottom', e);
        } 
    }

    _touchendEvent (context) {
        context._startPoint = null
        //触发弹性时
        if (this.config.bounceTop || this.config.bounceBottom){
            //触发事件
            let triggered = context.triggerEvent()
            //回弹
            if (this.config.el.style){
                !triggered && (this.config.el.style.transition = `transform ${BOUNCE_DURATION}s`);
                this.config.el.style.transform = 'translateY(0px)';
            }
        }
    }

    /**
     * 是否触顶or触底
     * @param {*} direction: top/bottom
     * @returns 
     */
    reachEdge(direction){
        const scrollTop = this._getScrollTop(this.config.scrollEl) // 当前滚动条的距离
        
        //触顶
        if (direction == 'top') {
            return this._moveY > 0 && scrollTop <= 0;
        }
        //触底
        
        const scrollHeight = this._getScrollHeight(this.config.scrollEl) // 滚动内容的高度
        const clientHeight = this._getClientHeight(this.config.scrollEl) // 滚动容器的高度
        const toBottom = scrollHeight - clientHeight - scrollTop // 滚动条距离底部的距离
        // 如果在底部
        return this._moveY < 0 && toBottom < 1
        

    }

    /**
     * 弹性动效
     * @returns 
     */
    bouncing(direction, event){
        //阻止浏览器默认事件。只禁止当前config.el的滚动事件
        if (!this.config['bounce' + direction]){
            this._preventDefault(event)
            return;
        }
        let diff = event.changedTouches[0].pageY - this._startPoint.y
        const height = diff <= this.config.maxMove ? diff : this.config.maxMove;
        if (this.config.el.style){
            // 为了清除卡顿问题，需要清除过渡效果
            this.config.el.style.transition = "none";
            // 阻尼系数0.3
            this.config.el.style.transform = `translateY(${this.config.dampingFactor * height}px)`;
        }
    }

    /**
     * 根据方向触发相关事件
     */
    triggerEvent(){
        if (!this._moveY){
            return
        }
        let direction = this._moveY > 0 ? 'Top' : 'Bottom'
        let moveY = Math.abs(this._moveY)
        if (this.config['bounce' + direction] && moveY > 0 && moveY * this.config.dampingFactor > this.config['threshold' + direction]){ 
            //判断是否触顶or触底
            if (this.reachEdge(direction.toLowerCase())){
                this.emit('onBounce' + direction)
                return true;
            }
        }
        return false;
    }
}
