import utils from 'sino/common/utils';
import constant from 'sino/constant'
/**
 * 调用native相关能力
 */

/**
 * 打电话
 */
export function callTel(tel){
　　var a = document.createElement("a");
　　a.href = "tel:" + tel;
　　a.click()
}

/**
 * 预览pdf文件
 */
export function filePreview(path){
    if(!path){
        return;
    }
    const iframe = document.createElement('iframe')
    iframe.style.position = 'relative';
    iframe.style.width ='0px';
    iframe.style.height ='0px';
    iframe.style.border = 'none';
    iframe.style.visibility = 'hidden';
    iframe.style.zIndex = -1;
    iframe.src = path.previewUrl;
    document.body.appendChild(iframe);
}

// 浏览器保存图片到本地（blob模式）
export function saveImage(base64Data) {

    let blobFile = null;
    let fileFullName = "";
    try {
        // 获得文件后缀
        const fileSuffix = base64Data
            .split(";")[0]
            .split("/")[1];

        // 拼装文件全名
        fileFullName = `${new Date().getTime()}.${fileSuffix}`;

        // 将base64格式图片转化为blob对象
        const binStr = window.atob(base64Data.split(",")[1]),
            len = binStr.length,
            arr = new Uint8Array(len);

        for (let i = 0; i < len; i++) {
            arr[i] = binStr.charCodeAt(i);
        }

        // 转化为Blob对象
        blobFile = new Blob([arr], {
            type: `image/${fileSuffix}`,
        });
    } catch (error) {
        console.error("请确保传递base64格式的二进制文件流；", error);
    }

    // 考虑兼容下IE
    if (typeof window.navigator.msSaveBlob !== "undefined") {
        window.navigator.msSaveBlob(blobFile, fileFullName);
    } else {
        const a = document.createElement("a");

        // 设置下载文件名以及格式
        a.download = fileFullName;

        // 创建url
        a.href = URL.createObjectURL(blobFile);

        // 注册点击事件
        const event = new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window,
        });

        // 触发点击事件
        a.dispatchEvent(event);

        // 移除a标签
        a.remove();

        // 释放url
        URL.revokeObjectURL(blobFile); // 释放url
    }
}

export async function isLogined(){
    //小程序或者weboa都是已登录的
    const isLogin = (utils.getPlatform() == constant.RUN_ENV.WECHAT_MINI_APP || utils.getPlatform() == constant.RUN_ENV.WECHAT_H5)
                    || utils.openedByBizmateWeb()
    return {
        ret: 0,
        responseData: {
            status: isLogin ? 1 : 0
        }
    };
}

export async function login(){
    return {
        state: 1
    }
}

export async function getNetInfo(){
    //返回固定值
    return {
        retCode: 0,
        contectState: true,
        macAddress: '00-FF-23-B5-B7-AA',
        ip: '192.168.0.1',
        netType: '0'
    }
}

export async function getUserInfo(){
    //小程序从bp-param中获取
    if(utils.getPlatform() == constant.RUN_ENV.WECHAT_MINI_APP || utils.getPlatform() == constant.RUN_ENV.WECHAT_H5){
        const bpParam = utils.getBpParam()
        return {
            UAId: bpParam.openId,
            cpyId: bpParam.channelId,//小程序的企业id与渠道id相同
            uPhone: '',
            uName: '',
            cpyName: '微信小程序'
        }
    }
    //如果是web版bizmate打开的，则用此种方式获取
    let userData = utils.decodeSignData(utils.getSignData());
    if(utils.isNotEmpty(userData)){
        return {
            UAId: userData.userId,
            cpyId: userData.cpyId,
            uPhone: '',
            uName: ''
        }
    }
    return {}
}
