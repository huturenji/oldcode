import config from '@/common/lib/config'
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
 * 删除字符中的所有的空格
 * @returns 
 */
export function trimAllStr(str){
    return str.replace(/\s/g, '');
}

/**
 * 
 * @param {时间戳} timestamp 
 * @param {指定格式模板} pattern 
 *  yyyy	2020	输入几个y就是几位数字的年份
    M MM	7 07	月份数字，复数的M当小于10则会追加0
    d dd	3 03	月的某天，复数的d当小于10则会追加0
    H HH	0..23	小时（24小时制），复数的h当小于10则会追加0
    h hh	1..12	小时（12小时制），复数的h当小于10则会追加0
    m mm	0..59	分钟，复数的m当小于10则会追加0
    s ss	0..59	秒数，复数的s当小于10则会追加0
    S SS SSS	0..999	带分数的秒钟，复数的S当小于10则会追加0
    w ww	1..7	指定日期的星期中的第几天，复数的w当小于10则会追加0
    W	一..天	指定日期的星期中的第几天，汉字一 二 三 四 五 六 天
    q	1..4	季度
 * @returns format(date, 'yyyy年MM月dd日 HH时mm分ss秒 第w天 第q季度') ： 2022年10月27日 08时45分02秒 第4天 第4季度
 */
export function formatDate(timestampOrDate, pattern) {
    let d = new Date(timestampOrDate);
    const date = {
        "M+": d.getMonth() + 1,
        "d+": d.getDate(),
        "H+": d.getHours(),
        "h+": (d.getHours() + 1) % 12 || 12,
        "m+": d.getMinutes(),
        "s+": d.getSeconds(),
        "q+": Math.floor((d.getMonth() + 3) / 3),
        "w+": d.getDay()
    };
    if (/(y+)/i.test(pattern)) {
        pattern = pattern.replace(
            RegExp.$1,
            (d.getFullYear() + "").substring(4 - RegExp.$1.length)
        );
    }
    if (/(S+)/.test(pattern)) {
        const ms = d.getMilliseconds();
        pattern = pattern.replace(
            RegExp.$1,
            RegExp.$1.length === 1
                ? ms
                : ("000" + ms).substring(("" + ms).length)
        );
    }
    if (/(W+)/.test(pattern)) {
        const weeks = { 1: "一", 2: "二", 3: "三", 4: "四", 5: "五", 6: "六", 0: "天" };
        pattern = pattern.replace(RegExp.$1, weeks[date["w+"]]);
    }
    for (const k in date) {
        if (new RegExp("(" + k + ")").test(pattern)) {
            pattern = pattern.replace(
                RegExp.$1,
                RegExp.$1.length === 1
                    ? date[k]
                    : ("00" + date[k]).substring(("" + date[k]).length)
            );
        }
    }
    return pattern;
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

// 清除所有的业务参数缓存
export function removeShopStorage(){
    let cachKeys = Object.values(config.STORAGE_CACHE_KEY);
    cachKeys?.forEach(item => {
        removeStorageSync(item)
    })
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
            setTimeout(function(){
                //超时后移除锁
                delete LOCK_ROOM[group]
            }, timeout || 1000);
            task && task();
            return false;
        }
        return true;
    };
})();

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

/*
 * 对象深拷贝
 */
export function openUrl(url) {
    if(!url){ return }
    uni.navigateTo({
        url: `/views/thirdlink/index?link=${encodeURIComponent(url)}`
    })
}


/*
 * 是否是微信小程序平台
 */
export function isMPWEIXIN(){
    return process.env.UNI_PLATFORM.toLowerCase() == 'mp-weixin';
}

/*
 * 是否是微信小程序pc端
 */
export function isWechatPC(){
    return uni.getSystemInfoSync().osName.toLowerCase() == 'windows';
}
/*
 * 是否是微信小程序安卓端
 */
export function isAndroid(){
    return uni.getSystemInfoSync().osName.toLowerCase() == 'android';
}
/*
 * 是否是微信小程序ios端
 */
export function isIos(){
    return uni.getSystemInfoSync().osName.toLowerCase() == 'ios';
}
/*
 * 是否是判断是否是刘海屏手机
 */
export function isHairSucreen(){
    let res = uni.getSystemInfoSync();
    return res.statusBarHeight > 40;
}

/*
 * 是否是h5平台
 */
export function isH5(){
    return process.env.UNI_PLATFORM.toLowerCase() == 'h5';
}

/****
 * 跳转到登录页面
 */
export function toLogin(){
    uni.redirectTo({
        url: `${config.LOGIN_PATH}`
    })
}

export function getPrimaryKey(){
    let key = !!isNotEmpty(config.ENV) ? `${config.ENV}-${config.SERVICE_NAME}-` : '';
    return key;    
}


/*覆盖storage相关函数 start*/

export function setStorageSync(key, value){
    key = `${getPrimaryKey()}${key}`;
    return uni.setStorageSync(key, value);
}


export function getStorageSync(key){
    key = `${getPrimaryKey()}${key}`;
    return uni.getStorageSync(key);
}


export function removeStorageSync(key){
    key = `${getPrimaryKey()}${key}`;
    return uni.removeStorageSync(key);
}
/*覆盖storage相关函数 end*/
/**
 * 中国大陆手机号
 */
export function isChinaMainlandPhoneNumber(phoneNumber) {
    // 中国大陆的手机号码由11位数字组成，并且以13、14、15、17、18、19开头
    return /^(13|14|15|17|18|19)\d{9}$/.test(phoneNumber);
}

//座机和移动手机号码的验证
export function checkTel(mobile){
    let regMobile = /(1[3-9]\d{9}$)/;
    let regTel = /(\d{4}-)\d{6,8}/
    if (!mobile) {
        uni.showToast({
            title:'请输入电话号码!',
            icon:'none'
        });
        return false;
    } else if (!regMobile.test(mobile) && !regTel.test(mobile)) {
        uni.showToast({
            title:'请输入正确的电话号码!',
            icon:'none'
        });
        return false;
    } 
    return true;
}

/*
 * 判断分页是否还有数据
 */
export function checkPaginationHasMore({
    current,
    pageSize,
    total
}) {
    return current * pageSize < total * 1;
}
/*
 * 返回一个数字的整数和小数
 * number 需要处理的数据
 * type: 要获取的数据 int 整数  decimal 小数
 */
export function getPartNumber(number, type) {
    let target = '';
    if (number == undefined) {
        return '';
    }

    number = number.toString();
    if (type == 'int') {
        target = number.split('.')[0];
    } else if (type == 'decimal') {
        target = number.split('.')[1] != undefined ? ('.' + number.split('.')[1]) : '.00';
        if (target.length < 3) {
            target += '0';
        }
    }
    return target;
}

// 时间戳转22:10:05这种格式
export function getAllTime(countTime){
    let temptDays = parseInt(countTime / 60 / 60 / 24)
    let temptHours = parseInt(countTime / 60 / 60 % 24);
    let temptMinutes = parseInt(countTime / 60 % 60);
    let temptSeconds = parseInt(countTime % 60);
    let days = temptDays > 9 ? temptDays : '0' + temptDays;
    let hours = temptHours > 9 ? temptHours : '0' + temptHours;
    let minutes = temptMinutes > 9 ? temptMinutes : '0' + temptMinutes;
    let seconds = temptSeconds > 9 ? temptSeconds : '0' + temptSeconds;
    return {days:days,hours:hours,minutes:minutes,seconds:seconds}
}


/** 
 * 基于uniapp.uploadFile的多文件上传，支持 跨端
 * fileArray:Array
 * params:Object
 * success:Function
 * @lijm-2021-06-15
 */
export function multifileUpload({ fileArray, params, success, fail }) {
    if (!fileArray || !params) {
        return '';
    }
    let promiseArray = [];
    fileArray.forEach((item, index) => {
        params.filePath = item;
        params.formData.file = item;
        //将每个请求封装成promise
        promiseArray[index] = uni.uploadFile(params)
    })
    if (success && typeof success === 'function') {
        //当所有请求完成后，调用success回调，返回请求后的reponse
        Promise.all(promiseArray).then((res) => {
            let data = []
            res.forEach((item) => {
                if (JSON.parse(item[1].data).state === 200) {
                    data.push(JSON.parse(item[1].data))
                }
            })
            if (data.length) {
                success(data);
            }
            //如果有失败回调，则返回失败信息
            if (fail && typeof fail === 'function') {
                let errData = '';
                // let tempStatus = res.some((item) => {
                //     if (JSON.parse(item[1].data).state != 200) {
                //         errData = JSON.parse(item[1].data);
                //         return true;
                //     }
                //     return false;
                // })
                fail(errData || { status: 200, msg: 'no errors' })
            }
        })
    }

}


//乘法函数，用来得到精确的乘法结果 js计算浮点数是有问题的
export function accMul(arg1, arg2){
    var m=0,s1=arg1.toString(),s2=arg2.toString();
    try { m+=s1.split(".")[1].length } catch (e){}
    try { m+=s2.split(".")[1].length } catch (e){}
    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
}


//隐藏小程序返回首页按钮【小房子】
export function hideHomeButton(){
    uni.hideHomeButton && uni.hideHomeButton()
}


export function copyText(data){
    uni.setClipboardData({ data })
}

export const IMAGE_TYPES = ['jpg', 'jpeg', 'png', 'bmp', 'gif']


/*
 * 返回上页vm对象
 */
export function prePage () {
    let pages = getCurrentPages();
    let pre_page = pages[pages.length - 2];
    let page = pre_page.$vm;
    return page;
}

//阿拉伯数字转中文数字
export function toChinesNum(num){
    let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    let unit = ["", "十", "百", "千", "万"];
    num = parseInt(num);
    let getWan = (temp) => {            
        let newNum = "";
        if (temp >= 10 && temp<=19){ //10-19特殊处理 即删掉前面的‘一’
            newNum = unit[1]; //'十'
            let strArr = temp.toString().split("");
            newNum = newNum + ((strArr[1] == 0) ? '' : changeNum[strArr[1]]);
        } else {
            let strArr = temp.toString().split("").reverse();
            for (var i = 0; i < strArr.length; i++) {
                newNum = (i == 0 && strArr[i] == 0 ? "" : (i > 0 && strArr[i] == 0 && strArr[i - 1] == 0 ? "" : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i]))) + newNum;
            }
        }
        return newNum;
    }   
    let overWan = Math.floor(num / 10000);
    let noWan = num % 10000;
    if (noWan.toString().length < 4) { noWan = "0" + noWan; }
    return overWan ? getWan(overWan) + "万" + getWan(noWan) : getWan(num);
}


/**
 * 获取小程序胶囊rect对象
 */
export function getCapsuleRect(){
    return uni.getMenuButtonBoundingClientRect();
}

// 单文件
export function uploadFile(param) {
    return new Promise((resolve, reject) => {
        uni.uploadFile({
            ...param,
            success: result => {
                let data = JSON.parse(result.data);
                resolve(data);
            },
            fail: (error) => {
                // 头像上传任务创建失败，排除上传头像字段
                reject(error);
            }
        })
    })

}
// 下载文件
export function downloadFile(param) {
    return new Promise((resolve, reject) => {
        uni.downloadFile({
            url: param.url,
            success: res => {
                resolve({
                    ...res,
                    state: res.statusCode
                })
            },
            fail: error => {
                reject(error)
            }
        })
    })
}

// 拨打电话的功能
export function callPhone(phone){
    uni.makePhoneCall({
        phoneNumber: phone
    });
}

//扫码的功能
export function scan(){
    return new Promise((resolve, reject) => {
        uni.scanCode({
            success: function (res) {
                resolve(res)
            },
            fail: function (res) {
                reject(res)
                console.log('扫码失败：' + res);
            }
        });
    })
}