import personalHandler from '@/views/components/personal/handler.js';
import { updateUserInfo as updateUserInfo_ } from '@/utils/auth/index';
import { isChinaMainlandPhoneNumber } from '@/utils/common';
import store from '@/store';

let hasLogin = false;
/**
 * 
 * @returns 会员信息
 */
const getMemberInfo = async () => {
    try {
        const res = await personalHandler.memberInfo();
        if (res.state == 200) {
            store.commit('updateMemberInfo', res.data);
            return Promise.resolve(res.data)
        } else {
            uni.showToast({
                title: res.msg,
                icon: 'none'
            })
            return Promise.resolve(null)
        }
    } catch (error) {
        return Promise.resolve(null)
    }
}

/**
 * 
 * @return 是否登陆成功
 */
const login = async () => {
    let memberInfo = await getMemberInfo();
    if (isChinaMainlandPhoneNumber(memberInfo?.memberMobile)) {
        console.log('登录成功')
        return true;
    } else {
        console.log('身份验证失败')
        return false
    }
}


/**
 * 
 * @param {更新用户电话号信息} phoneNumber 
 * @returns
 */
const updateUserInfo = (phoneNumber) => {
    return new Promise(resolve => {
        updateUserInfo_({ phoneNumber }).then(res => {
            if (!!res && res.state == 200) { // 说明更新g2用户信息成功，且手机号塞到了memberInfo中
                resolve(true);
            } else if (res.state == 89101006) {
                console.log('该手机号已经被注册了', res);
                resolve(true);
            } else {
                console.log('更新用户手机号失败', res);
                resolve(null);
            }
        }).catch(e => {
            console.log(e);
            resolve(null);
        })
    })
}

/**
 * 
 * @param {执行上下文} ctx 
 * @param {需要更新的参数} param 
 * @param {是否页面回退} back 默认false
 * @returns 更新后的会员信息
 */
const updateMemberInfo = (ctx, param, back = false) => {
    return new Promise(async resolve => {
        try {
            let resolveData = await personalHandler.updateMemberInfo(param)
            if (resolveData.state == 200) {
                store.state.memberInfo = { ...store.state.memberInfo, ...param };
                back && setTimeout(() => {
                    ctx?.$Router.back();
                }, 300);
            } else {
                uni.showToast({
                    title: resolveData.msg
                })
                resolve(null)
            }

        } catch (error) {
            resolve(null)
        }
    })



}

/**
 * 同时只会在一个页面进行登录授权，所以可以反复利用同一个authKey监听登录授权事件
 * @param {this} ctx 上下文
 * @param {接下来要执行的函数}   action | authProxyHandler | next 
 * @param  {...any} param 
 * @returns
 */
const authProxyHandler = async (ctx, authKey = undefined, next = undefined, ...param) => {

    // 如果登录过了直接放
    if (hasLogin || await login()) {
        hasLogin = true;
        next?.apply(ctx, param);
        return
    }


    if (!authKey) {
        console.error('请在使用页面指定监听键名')
        return
    }


    // 打开授权弹窗
    ctx?.$refs?.authPopup?.open();

    // 防止重复点击订阅事件
    uni.$off(authKey);
    // 订阅授权行为
    uni.$once(authKey, flag => {
        if (flag) {
            next?.apply(ctx, param);
        }
    })
}

export { getMemberInfo, updateUserInfo, updateMemberInfo, login, authProxyHandler }