import './webpackConfig.js';//必须第一行执行
/**
 * 与app交互的jsbridge函数
 */
import {adapter, polyfill, getChannelMapper, getAppNameByChannelId} from 'sino/adapter'
import auth from 'sino/auth'
import utils from 'sino/common/utils'
import constant from 'sino/constant'
import bridgeMethods from 'sino/bridge'
import message from 'sino/postMessage'

/**
 * 初始化
 */
(function initState(){
    //执行bridge的初始化事件
    bridgeMethods.onSdkLoad && bridgeMethods.onSdkLoad();
    //初始化signData
    const signData = utils.getUrlParam('signData')
    utils.isNotEmpty(signData) && sessionStorage.setItem('signData', signData) 
})()

async function getAppName(channelId){
    //1. 有提供channelId，则优先从配置中拿
    if(utils.isNotEmpty(channelId)){
        return getAppNameByChannelId(channelId)
    }
    //2. 无参数时默认从jsbridge拿
    let appName = await bridgeMethods._getAppName();
    if(utils.isNotEmpty(appName)){
        return appName
    }
    //3. jsbridge若未提供则再从配置拿
    return getAppNameByChannelId(await bridgeMethods.getChannelId())
}

export var sino = Object.assign(
    {getChannelMapper, getAppName},//提供渠道名和渠道id的映射关系
    bridgeMethods, //jsbridge函数
    {auth: polyfill(adapter(auth))}, //授权
    {constant}, //常量
    {message},//frame间通信
    {
        getPlatform: utils.getPlatform, 
        getNavigatorType: utils.getNavigatorType, 
        isInSinoEnv: utils.isInSinoEnv,
        openedByBizmateWeb: utils.openedByBizmateWeb
    }, //工具函数
);