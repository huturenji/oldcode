import './webpackConfig.js';//必须第一行执行
import * as module from './module';
import extendUtils from './utils'
import constant from './constant';

/**
 * 从scope中获取对象
 * @param {*} envName 对象名，支持xx.xx的格式
 * @param {*} scope 
 * @returns 
 */
 function getEnvTarget(envName, scope = window) {
    let result = null;
    if (!envName) {
        return result;
    }
    envName.split('.').forEach(name => {
        if (!result) {
            result = scope[name]
        } else {
            result = result[name];
        }
    })
    return result;
}

/**
 * 
 * @param {*} envName 依赖对象名称，可以是 xx.xx的结构。会依据此名称从window下递归获取实例
 * @param {*} envConfig 依赖对象实例。例如：{sinosdk: {name: 'sinosdk', value:[sinosdk的对象], path: [sinosdk的路径]}}
 * @returns 
 */
 async function checkEnv(envName, envConfig) {
    //检测依赖环境是否已存在
    let envObj = getEnvTarget(envName);
    //依赖对象不存在则从envConfig中获取
    if (!envObj) {
        let config = (envConfig || {})[envName]
        if (!config || Object.keys(config).length == 0) {
            throw `未找到${envName}，请提供配置`
        }
        //直接通过name获取依赖对象。如果未获取到，则依次从value中获取，从path中下载
        envObj = getEnvTarget(config.name)
        if (envObj) {
            return
        }
        if (config.value) {
            return
        }
        if (config.path) {
            try {
                await new Promise(resolve => {
                    extendUtils.loadScript({
                        url: config.src,
                        onload() {
                            resolve();
                        },
                        onerror() {
                            reject()
                        }
                    })
                })
            } catch (e) {
                console.error(e);
                throw `配置路径下未找到${envName}:  ${config.path}`
            }
            return;
        }
    }
}

export async function install(config, options={}){
    //当前页面的路由。如果路由是重定向的，则route.path无法获取到当前真实的path，因此自己截取
    let path = location.hash.substring(1, location.hash.indexOf('?'));
    //如果授权流程未开启，或页面在白名单中，则不走授权流程，直接完成
    if(config.urlWhiteList && config.urlWhiteList.some(url=>{return path.startsWith(url)})){
        return;
    }
    let _config = extendUtils.deepClone(config);//深拷贝，解除与原对象的关联
    _config.identity = _config.identity || extendUtils.getVersionFromUrl();
    //检测依赖环境
    await checkEnv('SnUtils', options.depends);
    if(config.runEnv == 'bizmate'){
        await checkEnv('sinosdk.sino', options.depends)
    }
    
    return module.run(_config, options);
}

export let ROLE = constant.IDENTITY;