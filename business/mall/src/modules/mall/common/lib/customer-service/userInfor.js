
import baseRequestHandler from 'common/lib/requestHandler/base.js';

//获取用户相关的信息
function getUserInfor(){
    return new Promise((resolve, reject) => {
        try {
            let userInfo = new baseRequestHandler().getUserParam();
            // console.log('userInfo', userInfo)
            var args = {
                渠道名称:userInfo.channelName, //渠道名称(银行来源)
                企业名称: userInfo.cpyName, //企业名称
                渠道id: userInfo.prodId, //渠道id(银行来源)
                企业id: userInfo.cpyId, //企业id
            }

            let userConfig = {
                partnerid: userInfo.uaId,//客户名称
                uname: userInfo.userName,//客户名称
                realname: userInfo.userName,//客户真实姓名
                tel: userInfo.userPhone, //客户电话,
                params: JSON.stringify(args),
            };
            
            resolve(userConfig);
        } catch (error) {
            console.log(error);
            resolve({});
        }
        
    })
}



export default getUserInfor;