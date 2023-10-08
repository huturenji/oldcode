import GradientColor from './utils/gradientColor'
/**
 * 动画基类
 */
export default class BaseAnimation {
    constructor() {

    }

    /**
     * 动态添加样式
     */
    addStyle(id, styleText) {
        // 创建style标签
        const style = document.getElementById(id) || document.createElement('style');
        style.id = id;
        // 设置style属性
        style.type = 'text/css';
        // 将 keyframes样式写入style内
        style.innerHTML = styleText;
        // 将style样式存放到head标签
        document.head.appendChild(style);
    }

    /**
     * 颜色渐变的js函数处理。获取两个颜色的中间色值集合
     * @param {*} startColor  起始颜色
     * @param {*} endColor  终止颜色
     * @param {*} step 分割成step份
     */
    gradientColor(startColor, endColor, step) {
        return new GradientColor(startColor, endColor, step);
    }
    
}