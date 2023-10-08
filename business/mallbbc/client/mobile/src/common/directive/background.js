import {isEmpty} from '@/utils/common.js'

/**
 * 【指令参数说明】
 * arg: reverse 表示是否反转样式，若为true，则value必须是一个长度为2的数组
 * modifiers: self | parent 背景挂载到当前节点or父节点上。如果不设置，默认为self
 */
/**
 * 透明度转换
 * @param {*} value 
 * @returns 
 */
function _opacityTransfer(dom, value){
    //单位转换
    if (value > 1){
        value /= 100;
    }
    dom.style.opacity = value;
    dom.style.filter = 'alpha(' + value + ' * 100)';
}

function drawBg(el, binding){
    const rendered = el.rendered;//是否已渲染过
    //已渲染，且新旧数据相同时不处理
    if (!!rendered
        && JSON.stringify(binding.oldValue) == JSON.stringify(binding.value)//因场景固定，只考虑简单比较
        && binding.oldArg == binding.arg//参数相同
    ){
        return;
    }
    try {
        //没有数据时不处理
        let bgData = binding.value;
        if (Object.prototype.toString.call(bgData) == '[object Object]'){
            bgData = [bgData]
        }
        
        if (isEmpty(bgData)){
            el.style.background = 'none';
            return;
        }

        let reverse = binding.arg && bgData.length > 1;//是否反转背景.需要大于1条数据，才可反转
        let index = reverse ? (bgData.length > 1 ? 1 : 0) : 0
        let data = bgData[index];
        el.style.backgroundColor = data.color || '';//背景颜色
        el.style.backgroundImage = data.img ? `url(${data.img})` : '';//背景图片
        el.style.backgroundPosition = `${data.left || 0} ${data.top || 0}`;//背景位置
        el.style.backgroundRepeat = 'no-repeat';//不重复
        let bgHeight = data.bgHeight?.endsWith('%') ? data.bgHeight : (data.bgHeight ? data.bgHeight + 'px' : 'auto')
        el.style.backgroundSize = `${data.bgWidth || '100%'} ${bgHeight}`//背景大小
        el.style.backgroundAttachment = data.scroll === false ? 'fixed' : 'scroll';//是否随内容滚动，默认滚动
        _opacityTransfer(el, data.opacity);//透明度
        el.rendered = true;
    } catch (e){
        console.warn(e);
    }
}

/**
 * 根据装修数据渲染背景
 */
export default {
    name: 'background',
    directive: {
        inserted(el, binding){
            drawBg(el, binding);
        },
        update(el, binding){
            drawBg(el, binding);
        }
    }
}