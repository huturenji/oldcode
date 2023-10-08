import CryptoJS from "crypto-js"
import config from '@/common/lib/config.js'

/**
 * 根据选择器获取元素 boundingClientRect 信息
 * @param {*} selector  选择器
 * @param {*} isAll  是否全部元素
 * @param {*} components  指定组件范围
 * @returns 
 */
export function getQuerySelector(selector, isAll, components) {
    return new Promise(resolve => {
        try {
            let query = components ? uni.createSelectorQuery().in(components) : uni.createSelectorQuery()
            query[isAll ? 'selectAll' : 'select'](selector).boundingClientRect(res => {
                resolve(res)
            }).exec();
        } catch (error) {
            resolve({})
        }
    })
}

/**
 * 格式化日期
 * @param {*} date  日期对象
 * @param {*} formateType  格式化类型
 * @returns 指定格式日期符串
 */
export function formateDateToString(date,formateType) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    if (formateType === 'yyyy-MM-dd hh:mm:ss'){
        const hour = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        return `${year}-${month < 10 ? '0'+ month : month}-${day < 10 ? '0'+ day : day} ${hour < 10 ? '0'+ hour : hour}:${minutes < 10 ? '0'+ minutes : minutes}:${seconds < 10 ? '0'+ seconds : seconds}`;  
    } else if (formateType === 'yyyy-MM-dd 00:00:00') {
        return `${year}-${month}-${day} 00:00:00`
    } else if (formateType === 'yyyy-MM-dd') {
        return `${year}-${month}-${day}`
    }
}

export var isString = obj => {
    return Object.prototype.toString.call(obj) == '[object String]';
}

export var isArray = obj => {
    return Object.prototype.toString.call(obj) == '[object Array]';
}

export var isObject = obj => {
    return Object.prototype.toString.call(obj) == '[object Object]';
}

export var isNumber = obj => {
    return Object.prototype.toString.call(obj) == '[object Number]';
}

// 检测对象是否为空
export function isEmpty(obj) {
    if (obj == null || obj == undefined) {
        return true;
    }
    if (isString(obj)) {
        return obj.replace(/\s/g, '') == '';
    }
    if (isArray(obj)) {
        return obj.length == 0;
    }
    if (isObject(obj)) {
        return Object.keys(obj).length == 0;        
    }
    return false;
}

// 检测对象是否不为空
export function isNotEmpty(obj) {
    return !isEmpty(obj);
}

/**
 * 加密数据
 * @param {*} data 需要加密的数据
 * @returns {String}
 */
export function encrypt(data) {
    let str = data
    if (typeof data === "object") {
        try {
            str = JSON.stringify(data);
        } catch (error) {
            console.log("encrypt error:", error);
        }
    }
    return CryptoJS.AES.encrypt(str, config.CRY_CODE).toString()
}

/**
 * 解密方法
 * @param data 被加密数据
 * @returns {string}
 */
export function decrypt(data) {
    const bytes = CryptoJS.AES.decrypt(data, config.CRY_CODE)
    return bytes.toString(CryptoJS.enc.Utf8)
}


/*
 * 对象深拷贝
 */
export function deepClone(obj) {
    if (!isObject(obj)) {
        throw new Error('obj 不是一个对象！')
    }

    let cloneObj = isArray() ? [...obj] : { ...obj }
    Reflect.ownKeys(cloneObj).forEach(key => {
        cloneObj[key] = isObject(obj[key]) ? deepClone(obj[key]) : obj[key]
    })

    return cloneObj
}

// 判断是否为伴正事打开
export function isBizMate() {
    return (sinosdk.sino.getPlatform() === sinosdk.sino.constant.RUN_ENV.BIZMATE || sinosdk.sino.getPlatform() === sinosdk.sino.constant.RUN_ENV.TCHAT)
}


/**
 * 节流锁。设置时间内，同一个组的任务只可执行一次，被节流的任务不会被执行
 */
export var throttle = (() => {
    let LOCK_ROOM = {};
    return (task, group, timeout)=>{
        if (group==null || group==undefined || group==''){
            group = 'throttle_default_group'
        }
        //第一个进分组的开启锁
        if (!LOCK_ROOM[group]){
            LOCK_ROOM[group] = true;
            window.setTimeout(function(){
                //超时后移除锁
                delete LOCK_ROOM[group]
            }, timeout || 1000);
            task && task();
            return false;
        }
        return true;
    };
})();

// 座机和移动手机号码的验证
export function checkTel(mobile){
    let regMobile = /(1[3-9]\d{9}$)/;
    let regTel = /(\d{4}-)\d{6,8}/
    if (!mobile) {
        uni.showToast({ title: '请输入电话号码!', icon: 'none' })
        return false;
    } else if (!regMobile.test(mobile) && !regTel.test(mobile)) {
        uni.showToast({ title: '请输入正确的电话号码!', icon: 'none' })
        return false;
    } 
    return true;
}

// 设置抽奖预设图片
export function setDefaultImage(obj) {
    if (obj.imgUrl.indexOf('http') === -1) {
        obj.imgUrl = `${getApp().globalData.imgUrl}images/${obj.imgUrl}.png`
    }
}

// 字符串复制功能
export function copyText(str, type=0, text='复制成功') {
    if (type == 0){ //input
        var input = document.createElement("input");
        input.value = str;
        input.readOnly = 'readonly';
        document.body.appendChild(input);
        input.select();
        input.setSelectionRange(0, input.value.length);
        document.execCommand('Copy');
        document.body.removeChild(input);
    } else if (type == 1) { //textarea
        var textarea = document.createElement("textarea");
        textarea.value = str;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('Copy');
        document.body.removeChild(textarea);
    }
    uni.showToast({
        title: text,
        icon: "none",  
        duration: 1500 
    })
}

// 获取计算属性样式
export function getStyle (obj, attr) {
    if (obj.currentStyle) { // 兼容IE
        return !!attr ? obj.currentStyle[attr] : obj.currentStyle;
    } 
    return !!attr ? window.getComputedStyle(obj, null)[attr] : window.getComputedStyle(obj, null);
}

// 根据高度自适应字体
export function fitFontSize(dom, maxHeight, isMin) {
    let size = parseInt(getStyle(dom, 'fontSize'))
    if (isMin) {
        size -= 1
        dom.style.fontSize = size + 'px'
    }

    let height = parseInt(getStyle(dom, 'height'))
    // "子元素和"大于元素 并且有子元素字号大于12px时进行递归调用
    if (height > maxHeight && size > 12) {
        fitFontSize(dom, maxHeight, true)
    }
}