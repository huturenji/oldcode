import { isNotEmpty } from '@/utils/common'

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

    let token = authorization.getToken();
    
    //opt.noAuth表示不需要token相关逻辑
    if (false) {
        opt.header.Authorization = 'Basic ZnJvbnQ6ZnJvbnQ=';
    } else {
        opt.header.Authorization = 'Bearer ' + token;
    }

    let userParams = getApp().globalData.userParams;
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
    if (opt.data) {
        //如果不是formData类型，则使用处理后的参数对象，否则使用原始值
        if (!(opt.data instanceof FormData)) {
            if (typeof opt.data == 'string'){ //jsonString处理
                try {
                    opt.data = JSON.stringify(Object.assign({}, JSON.parse(opt.data), userData));
                } catch (e){ console.error(e) }
            } else {
                opt.data = Object.assign({}, opt.data, userData);
            }
        }
    } else {
        opt.data = userData;
    }
    let url = getApp().globalData.apiUrl + opt.url
    return new Promise((resolve, reject) => {
        uni.request({
            url: url,
            data: opt.data,
            method: opt.method,
            header: opt.header,
            ...otherParam,
            success: async res => {
                if (res.statusCode == 200){
                    resolve(res.data);
                }else{
                    console.log('请求出错：', res);
                    reject(res);
                }
            },
            fail: err => {
                console.log('请求出错：', err);
                reject(err);
            },
            complete: (res) => {
                
            }
        })
    })
}
