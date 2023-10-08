/**
 * Flip动画
 * FLIP是 First、Last、Invert和 Play四个单词首字母的缩写，是一种实现动画方案，可参考https://www.w3cplus.com/javascript/animating-layouts-with-the-flip-technique.html
 */
export default class Flip {

    constructor(option) {
        this.option = {
            easing: "cubic-bezier(0,0,0.32,1)",
            duration: 500
        }
        this.init();
        Object.assign(this.option, option);
    }

    init(){
        this.startDom = null;
        this.prePosition = {};
        this.finishPoint = null;
    }

    /**
     * 检测是否是dom
     */
    isDOM(obj) {
        if(typeof HTMLElement === 'object'){
            return obj instanceof HTMLElement;
        }
        return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
    }
    /**
     * 获取dom
     * @param {*} el 字符串表示选择器，返回匹配到的第一个元素；或Dom元素；否则抛出异常
     */
    getDom(el) {
        if (typeof (el) == 'string') {
            return document.querySelector(el);
        } else if (this.isDOM(el)) {
            return el
        }
        throw new Error('el is not a selector or a HTMLElement');
    }

    /**
     * 设置移动的终点
     * @param {*} el 
     * @param {*} origin 移动到终点的哪个位置，默认终点的中心
     */
    setFinishPoint(el, origin='center'){
        this.finishPoint = this.getDom(el);
        this.endPointOrigin = origin;
    }

    /**
     * 读取dom的原始位置信息
     * @param {*} el 
     */
    read(el) {
        this.startDom = this.getDom(el);
        this.prePosition = {
            left: el.getBoundingClientRect().left,
            top: el.getBoundingClientRect().top
        }
    }

    /**
     * 执行动画
     * @param {*} el 实际执行动画的dom
     */
    play(el = this.startDom) {
        if (!el) {
            return;
        }
        try{
            const keyframes = [];
            let currPosition = {
                left: el.getBoundingClientRect().left,
                top: el.getBoundingClientRect().top
            }
            let invert = {
                left: this.prePosition.left - currPosition.left,
                top: this.prePosition.top - currPosition.top
            }
            //偏移到初始位置
            keyframes.push(
                {
                    transform: `translate(${invert.left}px, ${invert.top}px)`
                }
            )
            //如果设置了动画终点，则计算路径到终点的路径
            if(!!this.finishPoint){
                let endPosition = {
                    left: this.finishPoint.getBoundingClientRect().left,
                    top: this.finishPoint.getBoundingClientRect().top
                }
                let endInvert = {
                    left: this.prePosition.left - endPosition.left,
                    top: this.prePosition.top - endPosition.top
                }
                //偏移到初始位置
                keyframes.push(
                    {
                        transform: `translate(${endInvert.left}px, ${endInvert.top}px)`
                    }
                )
            }else{
                //没有终点时，最终需要去掉偏移
                keyframes.push(
                    { 
                        transform: "translate(0, 0)" 
                    }
                )
            }

            const options = {
                duration: this.option.duration,
                easing: this.option.easing
            }

            el.animate(keyframes, options)
        }catch(e){
            console.info(e);
        }
    }
    
}