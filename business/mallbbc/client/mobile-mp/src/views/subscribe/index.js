/*
 * @Descripttion: 某个事件订阅相关的消息
 * @Author: mawenshu
 * @Date: 2023-04-12 08:45:39
 */
import subscribeHandler from '@/views/subscribe/handler.js'


function requestSubscribeMessage(tmplIds) {
    return new Promise((resolve, reject) => {
        uni.requestSubscribeMessage({
            tmplIds,
            success: res => {
                console.log(res)
                // 请求成功
                if (res.errMsg == 'requestSubscribeMessage:ok') {
                    //用户确认订阅
                    if (res[tmplIds[0]] == 'accept') {
                        resolve('accept');
                    } else { // 用户拒绝订阅
                        resolve('reject');
                    }
                }
            },
            fail: warn => {
                console.warn('fail', warn)
            },
        })
    })
}


/**
 * 
 * @param {*} ctx 上下文
 * @param {*} tplCodeList 订阅消息类型，一次性最多支持订阅三种消息
 * @param {*} acceptCallback accept会触发
 * @param {*} rejectCallback reject会触发的回调，如果不指定回调，则执行acceptCallback回调
 */
export async function subscribeMessage(ctx, tplCodeList = [], acceptCallback, rejectCallback) {
    if (tplCodeList?.length <= 0) {
        return
    }
    const executeStrategy = {
        accept: acceptCallback,
        reject: rejectCallback || acceptCallback,
    }

    try {
        let { state, data } = await subscribeHandler.getWxTemplate({ tplCodeList });
        if (state == 200) {
            let tmplIds = data.map(ele => ele.templateId);
            let stateMessage = await requestSubscribeMessage(tmplIds);
            executeStrategy[stateMessage]?.call(ctx);
        }
    } catch (error) {
        console.error('subscribeMessage: ', error)
    }

}