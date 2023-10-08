import constant from 'constant';
export default {
    enableAgreement: true,
    enableAuthorize: true,//是否开启授权
    userInfoParams: ['userId','companyId','channelId'],//用户基本信息属性
    //授权白名单
    urlWhiteList: [],//不会进行授权流程的URL地址
    apiWhiteList: [],//不会被授权流程打断的接口请求路径
    //缓存的key
    cacheKey: constant.CACHE_KEY,
    channelId: '',
    primaryKey: '',
    disagreeCb: null,//不同意授权协议的自定义回调
    guestUserName: 'guest',//游客用户名
    guestPassword: 'b8ddc828e9564442f568c939f282e0f0',//游客密码 明文：bplusguest（MD5加密）
    version: null,//指定版本号。如果指定，则优先级高于url上的version
    identity: null,//登陆角色
    showDetailCloseBtn: true,//是否展示协议详情上的关闭按钮
}