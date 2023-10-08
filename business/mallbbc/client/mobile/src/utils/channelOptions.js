/*
 * @Descripttion: 渠道配置项
 * @version: 
 * @Author: 肖文川
 * @Date: 2022-10-8
 * @LastEditors: xiaowe
 * @LastEditTime: 2022-10-8
 * @detail 渠道控制全局Promise对象，属性值使用说明文档https://docs.qq.com/sheet/DSXdieFZXUUVuS25R?tab=6nxuqh
 */
import request from '@/utils/request';

/**
 * 获取运营平台配置渠道参数
 * @param {*} param 
*/
function getChannelAccessConfig(param = {}){
    return request({
        url: 'v3/channel/front/getAccessConfig',
        data: param
    })
}

/**
 * 获取渠道配置，解析数据
 */
function getChannelOptions(){
    return new Promise(async (resolve,reject) => {
        let query = {
            channelId: await sinosdk.sino.getChannelId(),
            t:new Date().getTime()
        }
        getChannelAccessConfig(query).then(res=>{
            if (res.state == 200 && res.data) {
                let configs = res.data.channelAccessConfigs;
                let resObj = {};
                configs.forEach(item => {
                    if (item.configValue=='true'){
                        resObj[item.configKey] = true;
                    } else if (item.configValue=='false'){
                        resObj[item.configKey] = false;
                    } else {
                        resObj[item.configKey] = item.configValue || '';
                    }
                });
                resolve(resObj);
            } else {
                reject({});
            }
        }).catch(e => {
            console.error(e);
            reject({})
        })
    })
}

export async function channelOptionsInit() {
    let options = await getChannelOptions();
    return options;
}
