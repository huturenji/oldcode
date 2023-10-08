let messageWatcher;
/**
 * 监听子页面关闭时回传的参数
 * @param {*} message 
 */
window.receiveMessage = function receiveMessage(message){
    messageWatcher && messageWatcher(message);
}
/**
 * 打开新页面
 * @param {*} url 
 */
export function open(url){
    window.open(url);
    return {
        ret: 0
    }
}

export function openApplet(param){
    sessionStorage.setItem('appletId', param.appId)
    open(param.url)
    return {
        ret: 0
    }
}

export function openThirdApplet(data){
    open(data.url);
    return {
        ret: 0
    }
}

/**
 * 回退页面
 * @param {*} url 无用，仅为和jsbridge接口一致
 * @param {*} backSteps 回退步数
 * @param {*} loadData 
 */
 export function back(url='', backSteps=1, loadData=''){
    let _window = window;
    let openerList = [_window];
    let stop = () => backSteps < 0
    if(backSteps <= 0 ){
        backSteps = 1
    }
    while(!stop()){
        backSteps--;
        if(_window.opener){
            openerList.push(_window.opener);
            _window = _window.opener
        }
    }
    openerList.reverse();
    _window && _window.opener && _window.opener.receiveMessage && _window.opener.receiveMessage(JSON.stringify({refreshData: loadData}))
    
    openerList.forEach(currWindow => {
        currWindow.close();
    })
}

export function onChildWindowClose(callback){
    messageWatcher = callback;
}