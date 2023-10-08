
import { getJsonFile } from '@/utils/common';
import config from '@/common/lib/config';

//获取用户相关的信息
function getUserInfo(){
    return new Promise(async resolve => {
        try {
            
            let userInfo = getApp().globalData.userParams;
            // console.log('userInfo', userInfo)
            
            //整合基本用户参数
            let baseConfig = {
                partnerid: userInfo.userId,//客户id
                uname: userInfo.userName,//客户名称
                realname: userInfo.userName,//客户真实姓名
                tel: userInfo.userPhone //客户电话,
            };

            //整合自定义参数
            var args = {
                ...baseConfig,
                渠道名称: userInfo.channelName, //渠道名称(银行来源)
                企业名称: userInfo.companyName, //企业名称
                渠道id: userInfo.channelId, //渠道id(银行来源)
                企业id: userInfo.companyId,//企业id
                channelId: userInfo.channelId,
                companyId: userInfo.companyId
            }

            //自定义参数新增环境变量参数，服务端用来做智齿的离线消息功能的
            let envData = await getEnvJson(); //获取环境变量
            if (envData && envData.project && envData.env){
                args = {
                    ...args,
                    namespace: envData.project + envData.env // mallbbcg2-dev/sit/uat/pro
                }
            }
            // console.log('args', args)
            
            // 整合最终的参数
            let userConfig = {
                ...baseConfig,
                params: JSON.stringify(args)
            }
            // console.log('userConfig', userConfig)
            resolve(userConfig);
        } catch (error) {
            console.log(error);
            resolve({});
        }
        
    })
}

function getEnvJson(){
    return new Promise(async resolve => {
        try {
            let data = await getJsonFile(config.ENV_CONFIG_PATH);
            resolve(data)
        } catch (error) {
            resolve(false)
        }
    })
}


export default getUserInfo;