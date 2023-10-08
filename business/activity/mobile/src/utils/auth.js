import config from '@/common/lib/config';
let PATH = `./thirdparty/auth/swp-serviceAuth.js?t=${TIMESTAMP_ENV}`

/**
 * 获取新的b+ token
 */
export function getBplusToken() {
    return new Promise(async resolve => {
        sinosdk.sino.auth.getToken(PATH, Object.assign({}, config.AUTH_CONFIG)).then(
            async data => {
                window.authorization = data;
                setUserParams()
                resolve(authorization.getToken());
            }
        ).catch(e => {
            console.error('getBplusToken error：'+e)
            resolve();
        })
    })
}

// 设置个人信息
function setUserParams() {
    // 授权信息
    if (!getApp().globalData.userParams.hasOwnProperty('userId')) {
        getApp().globalData.userParams = authorization.getUserInfo()
    }
    
    // 获取用户信息
    if (!getApp().globalData.userBaseParams.hasOwnProperty('userId')) {
        getApp().globalData.userBaseParams = authorization.getTchatUserInfo()
    }
}