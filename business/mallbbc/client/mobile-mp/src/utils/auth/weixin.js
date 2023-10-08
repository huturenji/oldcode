// 项目中所有涉及微信小程序的授权方法功能

import { getOpenId, getWxPhone } from '@/utils/auth/handler';
import config from '@/common/lib/config'

class Authorization {
    constructor (){
        this.provider = ""; // 服务供应商
        // 小程序当前登录人的用户信息 
        this.userInfo = {
            openid: '',
            session_key: '',
            unionid: ''
        }; 
    }

    // weixin小程序授权获取openId
    getWxOpenId(){
        let that = this;
        return new Promise(async (resolve) => {
           try {
                // 先获取服务供应商 目前是weixin
                this.provider = await that.getProvider()
                let code = await that.getWxCode();
                if (!!code){
                    let data = await that.getOpenId(code);
                    if (!!data){
                        that.userInfo = data;
                        resolve(that.userInfo)
                    } else {
                        resolve(null);
                        console.log('获取openId失败：', data);
                    }
                } else {
                    resolve(null);
                    console.log('小程序code获取失败：', code);
                }
           } catch (error) {
                resolve(null)
                console.log('小程序授权失败：', error);
           }
            
        })
    }

    // 获取服务供应商
    getProvider(){
        let defultProvider = 'weixin';
        return new Promise((resolve) => {
            uni.getProvider({
                service: 'oauth',
                success(res) {
                    if(res.errMsg === 'getProvider:ok') {
                        if (!!res.provider && !!res.provider.length){
                            resolve(res.provider[0])
                        } else {
                            resolve(defultProvider)  
                        }
                    } else {
                        resolve(defultProvider)
                    }
                }, 
                fail: err => {
                    resolve(defultProvider)
                }
            })
        })
    }

    // 获取微信小程序的code
    getWxCode(){
        let that = this;
        return new Promise(async (resolve) => {
            // 先获取服务供应商 目前是weixin
            this.provider = await that.getProvider()
            uni.login({
                provider: that.provider,
                success(res) {
                    if(res.errMsg === 'login:ok') {
                        if (!!res.code){
                            resolve(res.code);
                        } else {
                            resolve(null)  
                        }
                    } else {
                        resolve(null)
                    }
                }, 
                fail: err => {
                    resolve(null)
                }
            })
        })
    }

    // 通过code获取手机号
    getPhoneByCode(code){
        return new Promise(resolve => {
            if(!code){resolve(null);}
            getWxPhone({
                code,
                weixinAppletType: config.MINI_CONFIG.WX_APPLET_TYPE //微信小程序的环境类型

            }).then(res =>{
                if (res.resultCode == 0 && !!res.result && res.result.phoneNumber){
                    resolve(res.result.phoneNumber);
                } else {
                    resolve(null);
                }
            }).catch(e => {
                resolve(null)
            })
        })
    }
    

    // 通过服务端的接口获取小程序用户的openId 
    // tips：使用该接口的时候要注意一下，在admin平台要配置对应的小程序id：appid和小程序秘钥 appsecret
    getOpenId(code){
        return new Promise(resolve => {
            getOpenId({
                code, 
                source: 2, // 2代表微信小程序
                weixinAppletType: config.MINI_CONFIG.WX_APPLET_TYPE //微信小程序的环境类型
            }).then(res =>{
                if (res.resultCode == 0 && !!res.result){
                    resolve(res.result);
                } else {
                    resolve(null);
                }
            }).catch(e => {
                resolve(null)
            })
        })
    }

    // 获取微信小程序地图定位
    getLocation(){
        return new Promise(resolve => {
            uni.authorize({
                scope: 'scope.userFuzzyLocation',
                success() {
                    uni.getFuzzyLocation({
                        type: 'gcj02',
                        isHighAccuracy: true,
                        success: function (res) {
                            uni.chooseLocation({
                                latitude: res.latitude,
                                longitude: res.longitude,
                                success(data){
                                    console.log(data)
                                    if(data.errMsg == 'chooseLocation:ok' && data.address){
                                        resolve(data)
                                    }else{
                                        console.log('address字段有问题');
                                        resolve(null);
                                    }
                                 },
                                fail(e){
                                    console.log('chooseLocation方法调用失败', e);
                                    resolve(null);
                                }
                            })
                        },
                        fail(e){
                            console.log('getLocation方法调用失败', e);
                            resolve(null);
                        }
                    });
                },
                fail(e) {
                    console.log('用户拒绝了地址定位权限', e);
                    uni.showModal({
                        confirmColor: '#f30300',
                        cancelColor: '#999',
                        title: '提示',
                        content: '您拒绝了该小程序访问您的地址权限，请在设置中打开该权限，才能使用地址定位的功能哦~',
                        success (res) {
                            if (res.confirm) { //确定
                                uni.openSetting(); //拉取用户设置
                            } else if (res.cancel) {}
                        }
                    })
                    resolve(null);
                }
            })
        })
    }

    // 获取微信地址
    getWxAddress() {
        return new Promise(resolve => {
            uni.authorize({
                scope: 'scope.address',
                success() {
                    uni.chooseAddress({
                        success(data) {
                            resolve(data);
                        },
                        fail(res) {
                            if (res.errMsg == 'chooseAddress:cancel'){
                                resolve(null);
                            }
                        },
                    })
                },
                fail(res) {
                    uni.showModal({
                        title: '您已拒绝导入微信地址权限',
                        content: '是否进入权限管理，调整授权？',
                        success(res) {
                            if (res.confirm) {
                                uni.openSetting({
                                    success(res) {}
                                });
                            } else if (res.cancel) {
                                // uni.showToast({
                                //     title: "已取消",
                                //     icon: "none",
                                // })
                                return
                            }
                        }
                    })
                    resolve(null);
                },
            })
        })
    }

}

export default new Authorization();