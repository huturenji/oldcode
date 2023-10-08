
import utils from 'sino/common/utils';
import bridgeMethod from 'sino/bridge/base';

let modules = require.context('./', true, /index\.js$/);//只匹配纯英文+数字+下划线的文件夹名，暂不考虑其他带特殊字符的文件夹名
export function getAdapters(modules){
    //获取所有渠道配置目录
    //遍历得到文件夹下的index.js（每个渠道配置的根路径下必须暴露一个index.js。 index.js中必须export channelIds和adapter)
    let requireAll = requireContext => requireContext.keys()
                    .map(key => {
                        let module = requireContext(key);
                        let name = key.substring(2, key.indexOf('/', 2)).replace('-', '_')
                        return {
                            name: name,
                            channelIds: module.channelIds,
                            adapter: module.adapter,
                            appName: module.appName
                        }
                    })
                    .filter(_module => utils.isNotEmpty(_module.channelIds));

    return requireAll(modules);
}

/**
 * 
 * @param {*} methodName 需要定制的函数名
 * @param {*} hanndler 原函数体
 * @param {*} argumentsList 原函数参数集合
 * @param {*} proceed 是否继续执行原函数
 * @returns 
 */
export async function channelInterceptor(methodName, hanndler, argumentsList, proceed){
    let channelId = await bridgeMethod.getChannelId();//拿到当前channelId
    let matchAdapterList = getAdapters(modules).filter(adapter => Object.values(adapter.channelIds).some(idStr => idStr.replace(/\s/g,'').split(',').indexOf(String(channelId)) > -1));
    //没有配置该渠道
    if(matchAdapterList.length == 0){
        return hanndler.apply(this, argumentsList);
    }
    if(matchAdapterList.length > 1){
        throw '渠道id配置中，存在相同的渠道号！'
    }
    let matchAdapter = matchAdapterList[0];
    let matchHandler = matchAdapter.adapter[methodName];
    //找到定制的函数
    if(matchHandler){
        return matchHandler.apply(this, [...argumentsList, hanndler, proceed]);
    }else{
        return hanndler.apply(this, argumentsList);
    }
}

/**
 * 提供渠道名和渠道id的映射关系
 */
let adapterModules = require.context('sino/adapter/channel', true, /index\.js$/)
export function getChannelMapper(){
     return getAdapters(adapterModules).reduce((result, cur) => {
         return Object.assign({}, result, {
             [cur.name]: {
                 channelIds: Object.values(cur.channelIds).filter(id=>utils.isNotEmpty(id)).reduce((sum, cur)=>sum.concat(cur.split(',')), []), 
                 channelIdObj: cur.channelIds,
                 appName: cur.appName || ''
             }
         })
     }, {})
 }
 
 export function getAppNameByChannelId(channelId){
    const adapter = getAdapters(adapterModules);
    let index = adapter.findIndex(adapter => Object.values(adapter.channelIds).some(idStr => idStr.split(',').indexOf(String(channelId)) > -1))
    return adapter[index] ? (adapter[index].appName || '') : ''
 }