import { fontOverFlow, getStyle } from '@/utils/common.js'

// 设置元素内字号自适应
function fitFontSize(dom, count) {
    let domList = Array.from(dom.childNodes)
    // 是否每个子元素都大于等于12px
    let isAllMin = true
    for (let i = 0; i < domList.length; i++) {
        let size = parseInt(getStyle(domList[i], 'fontSize'))
        if ((count || count === 0) && ((count % domList.length) === i)) {
            size = size > 12 ? size - 1 : 12
            domList[i].style.fontSize = size + 'px'
        }

        if (size > 12) { isAllMin = false }
    }

    // "子元素和"大于元素 并且有子元素字号大于12px时进行递归调用
    if (fontOverFlow(dom) && !isAllMin) {
        fitFontSize(dom, (count || count === 0) ? count + 1 : 0)
    }
}


export default {
    name: 'fitFontSize',
    directive: {
        inserted(el){
            fitFontSize(el);
        },
        update(el){
            fitFontSize(el);
        }
    }
}