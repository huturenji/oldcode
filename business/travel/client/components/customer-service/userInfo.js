
var functional = SnTravel.functional;
let { baseRequestHandler, getEnvConfig } = functional;

//获取用户相关的信息
function getUserInfor(){
    return new Promise(async (resolve) => {
        try {
            let userInfo = new baseRequestHandler().getUserParam();
            // console.log('userInfo', userInfo)
            
            //整合基本用户参数
            let baseConfig = {
                partnerid: userInfo.userId, //客户id
                uname: userInfo.userName, //客户名称
                realname: userInfo.userName, //客户真实姓名
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
            
            let envData = await getEnvConfig(); //获取env.json的配置文件
            if (envData && envData.project && envData.env){
                args = {
                    ...args,
                    namespace: envData.project + envData.env  // travel-dev/sit/uat/pro
                }
            }
            // console.log('args', args)

            // 整合最终的参数
            let userConfig = {
                ...baseConfig,
                params: JSON.stringify(args)
            }
            
            resolve(userConfig);
        } catch (error) {
            console.log(error);
            resolve({});
        }
        
    })
}


export default getUserInfor;