const postMessage = {}
/**
 * 获取特定的iframe对象
 * @param {*} clazz iframe对象集合
 * @returns 
 */
postMessage.getFrame = (clazz = 'bpFrame') => {
    return document.querySelectorAll('.' + clazz)
}

/**
 * 向指定iframe或window对象发送postMessage消息
 * @param {*} eventName 
 * @param {*} target 
 * @returns 
 */
postMessage.broadcastEvent = (target, eventName, data) => {
    if (!target){
        return;
    }
    try {
        target.postMessage({
            type: 'appEvent',
            eventName,
            data
        }, location.origin)
    } catch (e){
        console.error('broadcastEvent error: ' + e);
    }
}

/**
 * 向iframe广播事件
 * @param {*} eventName 
 * @param {*} clazz 
 * @returns 是否已广播
 */
postMessage.broadcastEventToFrame = (eventName, data, clazz) => {
    let frames = postMessage.getFrame(clazz);
    if (frames && frames.length > 0){
        frames.forEach(frame => {
            postMessage.broadcastEvent(frame.contentWindow, eventName, data)
        })
        return true;
    }
    return false;
}

/**
 * 监听message事件
 * @param {*} eventName 
 * @param {*} func 
 * @param {*} context 
 * @returns 
 */
postMessage.addEventListener = (eventName, func, context) => {
    const handler = e => {
        if(e.origin !== location.origin){
            return
        }
        if(e.data.type == 'appEvent' && e.data.eventName == eventName){
            func && func.call(context, e.data);
        }
    }
    window.addEventListener('message', handler)
    return () => {
        window.removeEventListener('message', handler)
    }
}

export default postMessage