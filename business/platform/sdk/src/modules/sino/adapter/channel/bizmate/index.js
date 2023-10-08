import {baseAdapter} from '../base'
export let channelIds = {
    dev: '9729',
    sit: '9729',
    uat: '5',
    prod: '11269',
}
export let appName = 'BIZMATE'
export let adapter = Object.assign({}, baseAdapter, {
    onSdkLoad(){
        let proceed = arguments[arguments.length-1];
        //从旧企业购访问index路由，重定向到bbc mobile时，由于bbc没有#/index路由，需要重定向到#/路由
        //只有审批去订购会触发这个场景
        if(location.href.indexOf('/mall/static/shop/index.html#/index')>-1){
            location.replace(location.origin + location.pathname)
        }
        //允许继续执行原函数
        proceed.proceedDefault();
    },
})