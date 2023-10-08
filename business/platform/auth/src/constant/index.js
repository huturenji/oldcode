export default {
    STORAGE_PREFIX: 'sino-auth_',//所有logout时需要删除的缓存的前缀
    SPLIT: '_',
    IDENTITY: {
        GUEST: 'guest',
        USER: 'user',
    },
    //缓存的key
    CACHE_KEY: {
        TOKEN: 'token',
        REFRESH_TOKEN: 'refreshToken',
        //协议
        USER_CONSENT: 'userConsent',
        //用户信息
        IDENTITY: 'bplus_role',
    },
    AUTH_PARAMS_IN_URL: ['idToken','clientId','clientSecret', 'code', 'state', 'session_state'],//登陆授权所需的初始参数
}