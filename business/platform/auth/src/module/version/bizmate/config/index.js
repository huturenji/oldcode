import config from 'config';
import constant from 'constant';
export default {...config, ...{
    mode: 'native',//授权模式：'h5' or 'native' or 'sign'
    authSilence: false,//h5授权流程，silence使用iframe，否则使用页面重定向
    silentAuthRedirectUri: null,//h5授权并使用silence模式时，需要提供一个重定向地址，供frame加载，该地址可无内容。 如果不提供，默认使用location.href
    autoUpdateToken: true,//是否自动刷新token
    signData: {//签名授权的数据
        thirdUserId: null, //第三方用户Id
        name: '', //[可选]用户名字
        mobile: '', //[可选]用户手机号
        channelId: null, //渠道ID
        timestamp: null, //时间戳
        signAlg: null, //签名算法 
        sign: null,//上述参数拼接后的签名 
        source: null, //[可选]来源 
        applicationId: null, //[可选]小应用id 
        wxUnionId: null //[可选]小程序联合id
    }
}}