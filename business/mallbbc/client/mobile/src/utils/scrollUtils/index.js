import _ScrollLock from './lock'

export const ScrollLock = _ScrollLock;

/**
* 获取已滚动高度
*/
export function getScrollTop(scrollContainer){  
    let scrollTop = 0;
    if (scrollContainer instanceof Document){
        scrollTop = document.body.scrollTop || document.documentElement.scrollTop; //兼容个不同浏览器的滚动距离
    } else if (scrollContainer instanceof HTMLElement){
        scrollTop = scrollContainer.scrollTop
    }
    return scrollTop
}
/**
 * 获取容器高度
 */
export function getClientHeight(scrollContainer){
    let clientHeight = 0;
    if (scrollContainer instanceof Document){
        clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
    } else if (scrollContainer instanceof HTMLElement){
        clientHeight = scrollContainer.clientHeight;
    }
    return clientHeight
}
/**
 * 获取可滚动区域高度
 */
export function getScrollHeight(scrollContainer){
    let scrollHeight = 0;
    if (scrollContainer instanceof Document){
        scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    } else if (scrollContainer instanceof HTMLElement){
        scrollHeight = scrollContainer.scrollHeight;
    }
    return scrollHeight;
}

/**
  * 滚动是否触底
  */
export function reachScrollBottom(scrollContainer){
    let scrollHeight = getScrollHeight(scrollContainer);
    let scrollTop = getScrollTop(scrollContainer);
    let clientHeight = getClientHeight(scrollContainer);
    return scrollHeight - (scrollTop + clientHeight) < 1
}