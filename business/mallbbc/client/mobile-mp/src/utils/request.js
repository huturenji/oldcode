import { isNotEmpty, isEmpty, judgeSceneTimeLine } from '@/utils/common';
import { getToken as getBbcAccessToken, reAuthorize } from '@/utils/auth/index';
import { getToken as getBplusAccessToken } from '@/utils/auth/unionAuth';
import config from '@/common/lib/config';
import safeRequest from '@/utils/safeRequest'

let reAuthTimes = 0;//重试授权计数

export default async function request(opt) {

    opt = opt || {};
    opt.url = opt.url || '';
    opt.data = opt.data || null;
    opt.method = opt.method || 'GET';
    let otherParam = {};
    if (!opt.responseType) {
        opt.header = opt.header || Object.assign({}, opt.header);
        otherParam.dataType = 'json'
    } else {
        otherParam.responseType = opt.responseType;
    }

    
    if (!!opt.noAuth) { // 不需要授权
        opt.header.Authorization = 'Basic ZnJvbnQ6ZnJvbnQ=';
    } else {
        let token = await getBbcAccessToken(); // 鹅毛情和巨拾惠用bbc token 
        if(isNotEmpty(opt.serviceName) && opt.serviceName == config.ACTIVITY_SERVICE_NAME){ // 如果是抽奖活动的话，此时应该用b+token
            token = await getBplusAccessToken(); 
        }
        opt.header.Authorization = 'Bearer ' + token;
    }

    let userParams = getApp().globalData.userParams;

    // 做个渠道id和公司id的兼容以防取不到值
    if(isEmpty(userParams.channelId)){
        userParams = {...userParams, channelId: config.CHANNELID}
    }

    if(isEmpty(userParams.companyId)){
        userParams = {...userParams, companyId: config.COMPANYID}
    }

    let userData = {}

    //业务侧要求用自己的参数时：业务侧已带用户参数，则不替换，未带的用户参数自动填充
    if (opt.fillUserParam == false) {
        let channelId = opt?.data?.channelId ?? userParams.channelId;
        if (isNotEmpty(channelId)){
            userData.channelId = channelId
        }
        let companyId = opt?.data?.companyId ?? userParams.companyId;
        if (isNotEmpty(companyId)){
            userData.companyId = companyId
        }
        let userId = opt?.data?.userId ?? userParams.userId;
        if (isNotEmpty(userId)){
            userData.userId = userId
        }
    } else {
        isNotEmpty(userParams.channelId) && (userData.channelId = userParams.channelId);
        isNotEmpty(userParams.companyId) && (userData.companyId = userParams.companyId);
        isNotEmpty(userParams.userId) && (userData.userId = userParams.userId);
    }

    // 如果是分享朋友圈此时此时写死游客的userId
    if(judgeSceneTimeLine()){
        userData = Object.assign({}, userData, {
            userId: 'fb7b4e63-d89e-4d6c-a85e-531768a51314' // 游客的userId
        })
    }

    if (opt.data) {
        if (typeof opt.data == 'string'){ //jsonString处理
            try {
                opt.data = JSON.stringify(Object.assign({}, JSON.parse(opt.data), userData));
            } catch (e){ console.error(e) }
        } else {
            opt.data = Object.assign({}, opt.data, userData);
        }
    } else {
        opt.data = userData;
    }
    let prexUrl = config.BSL_CONFIG.app.default_bsl_switch === true ? '/' : `${getApp().globalData.apiUrl}`
    let url = `${prexUrl}${opt.serviceName ? opt.serviceName : config.SERVICE_NAME}${opt.url}`
    return new Promise(async (resolve, reject) => {
        //封装bsl请求参数
        let safeParam = await safeRequest.packageParams({url, method: opt.method, data: opt.data, header: opt.header}, {enableBsl: opt.enableBsl, encryption: opt.encryption});
        uni.request({
            ...safeParam,
            ...otherParam,
            success: async res => {
                try {
                    res.data = await safeRequest.unpackageParams(res.data, safeParam)
                } catch (e) {
                    res.data = e;
                    console.error('bsl service error! ' + JSON.stringify(e))
                }
                if (res.statusCode == 200){
                    if ((res.data.code == 401 || res.data.state == 266 || res.data.state == 89101008) && reAuthTimes < 3){ //token校验失败后重新执行一次tokenExchange流程
                        await reAuthorize();
                        reAuthTimes += 1;
                        //重新授权后重新执行一次当前请求
                        resolve(request(opt));
                    }
                    // 请求参数是否有时间戳, 有时间戳则返回
                    if (opt.data.localTimestamp) {
                        res.data.localTimestamp = opt.data.localTimestamp;
                    }
                    resolve(res.data);
                }else if(res.statusCode == 401){
                    await reAuthorize();
                    //重新授权后重新执行一次当前请求
                    resolve(request(opt));
                } else {
                    console.log('请求出错：', res);
                    reject(res);
                }
            },
            fail: async err => {
                console.log('请求出错：', err);
                reject(err);
            },
            complete: (res) => {}
        })
    })
}
