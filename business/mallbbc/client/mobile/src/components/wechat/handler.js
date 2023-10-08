import request from '@/utils/request';
import config from '@/common/lib/config'
// 版本转化枚举 admin配置0， 1， 2对应如下小程序的不同版本
const wxEnum = {
    0: 'release', // 正式版
    1: 'develop', // 测试版/开发版
    2: 'trial' // 体验版
};
export default {
    /**
     * 获取微信小程序的urlscheme接口api
     * @param {*} param 
    */
    getWxURLScheme(param = {}){
        return request({
            url: `${window.location.origin}/bizcloud/user-center/v1/weixin/getURLScheme`,
            data: param,
            method: 'POST',
            header: {
                "Content-Type": "application/json"
            }
        })
    },


    /**
     * 获取admin平台配置的两个小程序相关信息
     * @param type  1=巨拾惠小程序 2=鹅毛情小程序
     * return appletId 小程序原始id
     * return appletType 微信小程序分享类型 正式版:0， 测试版:1， 体验版:2
     */
    async getMiniConfig(type=config.WX_APPLET_TYPE_MALL){
        let channelOptions = await window.getChannelOptions; // 运营后台配置的渠道相关配置
        if(type == config.WX_APPLET_TYPE_MALL){
            return {
                appletId: channelOptions.wxMiniAppletId,
                appletType: channelOptions.shareWxMiniVersion
            }
        } else if(type == config.WX_APPLET_TYPE_FEATHER){
            return {
                appletId: channelOptions.giftWxMiniAppletId,
                appletType: channelOptions.shareGiftWxMiniVersion
            }
        } 
    },

    /***
     * @param data // 获取scheme需要的请求参数
     */
    getScheme(data){
        let that = this;
        return new Promise(resolve => {
            try {
                let param = {
                    expire_interval: 30, //到期失效的 scheme 码的失效间隔天数。生成的到期失效 scheme 码在该间隔时间到达前有效。最长间隔天数为30天。 expire_type 为 1 时必填 // 该值写死, 因为每次都是重新生成一个新的scheme
                    expire_type: 1, //到期失效的 scheme 码失效类型，失效时间：0，失效间隔天数：1 // 该值写死, 因为每次都是重新生成一个新的scheme
                    jump_wxa: {
                        env_version: wxEnum[data.version || 0] || wxEnum[2], //要打开的小程序版本。正式版为"release"，体验版为"trial"，开发版为"develop"，仅在微信外打开时生效。
                        path: data.path, // 通过 scheme 码进入的小程序页面路径，必须是已经发布的小程序存在的页面，不可携带 query。path 为空时会跳转小程序主页。
                        query: data.query //通过 scheme 码进入小程序时的 query，最大1024个字符，只支持数字，大小写英文以及部分特殊字符：`!#$&'()*+,/:;=?@-._~%``
                    },
                    weixinAppletType: data.weixinAppletType //微信小程序的环境类型
                }
                that.getWxURLScheme(param).then(res => {
                    if (res.resultCode == 0 && !!res.result &&!!res.result.openlink){
                        resolve(res.result.openlink);
                    } else {
                        console.log('获取微信小程序scheme失败');
                        resolve(null)
                    }
                }).finally(() => {
                })
            } catch (error) {
                console.log(error);
                resolve(null)
            }
        })
    }
};