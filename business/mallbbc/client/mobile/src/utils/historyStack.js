const HISTORY_KEY = 'bizcloud_page_history'

function routerToString(router){
    if (!router){
        return;
    }
    return router.path + '_' + router.query.hisStamp
}

export function updateHistory(to){
    let history = sessionStorage.getItem(HISTORY_KEY);
    history = history ? JSON.parse(history) : [];
    let toStr = routerToString(to);
    let hisLength = history.length;
    if (hisLength > 1){
        //to的页面在history中有，说明是在回退历史。 有可能回退一步，也可能回退多步
        let _index = history.indexOf(toStr)
        if (_index > -1){
            history.slice(0, _index + 1);
            sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history))
            return;
        }
    }
    to.query.hisStamp = new Date().getTime();//生成一个主键来标识
    history.push(routerToString(to));
    sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history))
}