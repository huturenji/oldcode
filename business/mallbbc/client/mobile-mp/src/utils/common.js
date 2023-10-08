import config from '@/common/lib/config'
import addressHandler from '@/views/components/address/handler';
import { colorMap } from '@/common/lib/enum/color'

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



// 设置抽奖预设图片
export function setDefaultImage(obj) {
    if (obj.imgUrl.indexOf('http') === -1) {
        obj.imgUrl = `https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/activitystudio/images/${obj.imgUrl}.png`
    }
}


/**
 * 格式化日期
 * @param {*} date  日期对象
 * @param {*} formateType  格式化类型
 * @returns 指定格式日期符串
 */
export function formateDateToString(date, formateType) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    if (formateType === 'yyyy-MM-dd hh:mm:ss'){
        return `${year}-${month < 10 ? '0'+ month : month}-${day < 10 ? '0'+ day : day} ${hour < 10 ? '0'+ hour : hour}:${minutes < 10 ? '0'+ minutes : minutes}:${seconds < 10 ? '0'+ seconds : seconds}`;  
    } else if (formateType === 'yyyy-MM-dd 00:00:00') {
        return `${year}-${month}-${day} 00:00:00`
    } else if (formateType === 'yyyy-MM-dd') {
        return `${year}-${month}-${day}`
    } else if (formateType === 'hh:mm:ss') {
        return `${hour < 10 ? '0'+ hour : hour}:${minutes < 10 ? '0'+ minutes : minutes}:${seconds < 10 ? '0'+ seconds : seconds}`;  
    } else if (formateType === 'hh:mm') {
        return `${hour < 10 ? '0'+ hour : hour}:${minutes < 10 ? '0'+ minutes : minutes}`;  
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
// 装修跳转
export async function skipTo(item, context) {
    try {
        let { url, url_type, ...query } = item;
        let sku = item.info?.sku;
        if (url_type == 'url') { //跳转链接地址
            if (!url) {
                uni.showToast({
                    title: '功能正在开发中，敬请期待...',
                    icon: 'none',
                    duration: 700
                })
                return
            }
            try {
                if (query) {
                    Object.keys(query).forEach(e => {
                        url = url + (url.includes('?') ? '&' : '?') + e + '=' + JSON.stringify(query[e])
                    })
                }
                if (RegExp('^/pages.*').test(url)) {
                    uni.switchTab({ url })
                } else {
                    uni.navigateTo({ url })
                }
            } catch (e) { }

        } else if (url_type == 'goods' && isNotEmpty(sku)) { //跳转商品详情页
            context.$Router.push({ path: '/views/goods/detail/index', query: { sku } })
        } else if (url_type == 'category') { // 分类列表
            context.$Router.push({ path: '/views/goods/list/index', query: { categoryId: url } })
        } else if (url_type == 'keyword') { // 关键词
            if (url == 'kefu') {
                return
            }
            context.$Router.push({ path: '/views/goods/list/index', query: { keyword: url, source: 'search' } })
        } else if (url_type == 'topic') { //跳转专题页
            context.$Router.push({ path: '/views/topic/index', query: { topicId: (item.info.decoId ? item.info.decoId : item.info.id) } })
        } else if (url_type == 'third_url') { // 第三方链接地址
            let title = item.tabName??''
            openUrl(url, isNotEmpty(title)?title:'')
        } 
    } catch (error) {
        console.log(error);
    }
}

// 获取启动时的参数
export function getLaunchOptions(){
    return uni.getLaunchOptionsSync()
}

// 判断是否是分享朋友圈进来的场景
export function judgeSceneTimeLine(){
    return getLaunchOptions().scene == config.TIME_LINE_SCHNE
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
    return (task, group, timeout) => {
        if (group == null || group == undefined || group == '') {
            group = 'throttle_default_group'
        }
        //第一个进分组的开启锁
        if (!LOCK_ROOM[group]) {
            LOCK_ROOM[group] = true;
            setTimeout(function () {
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
    // 对常见的“非”值，直接返回原来值
	if ([null, undefined, NaN, false].includes(obj)) return obj
	if (typeof obj !== 'object' && typeof obj !== 'function') {
		// 原始类型直接返回
		return obj
	}
	const o = isArray(obj) ? [] : {}
	for (const i in obj) {
		if (obj.hasOwnProperty(i)) {
			o[i] = typeof obj[i] === 'object' ? deepClone(obj[i]) : obj[i]
		}
	}
	return o
}

/*
 * 对象深拷贝
 */
export function openUrl(url, title='') {
    if (!url) { return };
    uni.navigateTo({
        url: `/views/webview/index?link=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
    })
}

/*
 * 是否是微信小程序pc端
 */
export function isPC() {
    return uni.getSystemInfoSync().osName.toLowerCase() == 'windows';
}
/*
 * 是否是微信小程序安卓端
 */
export function isAndroid() {
    return uni.getSystemInfoSync().osName.toLowerCase() == 'android';
}
/*
 * 是否是微信小程序ios端
 */
export function isIos() {
    return uni.getSystemInfoSync().osName.toLowerCase() == 'ios';
}
/*
 * 是否是判断是否是刘海屏手机
 */
export function isHairSucreen() {
    let res = uni.getSystemInfoSync();
    return res.statusBarHeight > 40;
}


export function getPrimaryKey() {
    let key = !!isNotEmpty(config.ENV) ? `${config.ENV}-${config.SERVICE_NAME}-` : '';
    return key;
}


/*覆盖storage相关函数 start*/
export function setStorage(obj) {
    obj.key = `${getPrimaryKey()}${obj.key}`;
    return uni.setStorage(obj);
}

export function setStorageSync(key, value) {
    key = `${getPrimaryKey()}${key}`;
    return uni.setStorageSync(key, value);
}

export function getStorage(obj) {
    obj.key = `${getPrimaryKey()}${obj.key}`;
    return uni.getStorage(obj);
}

export function getStorageSync(key) {
    key = `${getPrimaryKey()}${key}`;
    return uni.getStorageSync(key);
}

export function removeStorage(obj) {
    obj.key = `${getPrimaryKey()}${obj.key}`;
    return uni.removeStorage(obj);
}

export function removeStorageSync(key) {
    key = `${getPrimaryKey()}${key}`;
    return uni.removeStorageSync(key);
}
/*覆盖storage相关函数 end*/
/**
 * 中国大陆手机号
 */
export function isChinaMainlandPhoneNumber(phoneNumber) {
    // 中国大陆的手机号码由11位数字组成，并且以1开头
    return /^1[3-9]\d{9}$/.test(phoneNumber);
}

//座机和移动手机号码的验证
export function checkTel(mobile) {
    let regMobile = /(1[3-9]\d{9}$)/;
    let regTel = /(\d{4}-)\d{6,8}/
    if (!mobile) {
        uni.showToast({
            title: '请输入电话号码!',
            icon: 'none'
        });
        return false;
    } else if (!regMobile.test(mobile) && !regTel.test(mobile)) {
        uni.showToast({
            title: '请输入正确的电话号码!',
            icon: 'none'
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
export function getAllTime(countTime) {
    let temptDays = parseInt(countTime / 60 / 60 / 24)
    let temptHours = parseInt(countTime / 60 / 60 % 24);
    let temptMinutes = parseInt(countTime / 60 % 60);
    let temptSeconds = parseInt(countTime % 60);
    let days = temptDays > 9 ? temptDays : '0' + temptDays;
    let hours = temptHours > 9 ? temptHours : '0' + temptHours;
    let minutes = temptMinutes > 9 ? temptMinutes : '0' + temptMinutes;
    let seconds = temptSeconds > 9 ? temptSeconds : '0' + temptSeconds;
    return { days: days, hours: hours, minutes: minutes, seconds: seconds }
}

//隐藏小程序返回首页按钮【小房子】
export function hideHomeButton() {
    uni.hideHomeButton && uni.hideHomeButton()
}

export function copyText(data) {
    uni.setClipboardData({ data })
}

export const IMAGE_TYPES = ['jpg', 'jpeg', 'png', 'bmp', 'gif']


/*
 * 返回上页vm对象
 */
export function prePage() {
    let pages = getCurrentPages();
    let pre_page = pages[pages.length - 2];
    let page = pre_page.$vm;
    return page;
}

//阿拉伯数字转中文数字
export function toChinesNum(num) {
    let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    let unit = ["", "十", "百", "千", "万"];
    num = parseInt(num);
    let getWan = (temp) => {
        let newNum = "";
        if (temp >= 10 && temp <= 19) { //10-19特殊处理 即删掉前面的‘一’
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

// 检查字符串是否全是空格
export function checkSpace(str) {
    return str.trim() == "" ? true : false;
}

/**
 * 获取小程序胶囊rect对象
 */
export function getCapsuleRect() {
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

// 数组对象根据某个key去重去重
export function repeatArray(arr, key) {
    let obj = {};
    let newArr = [];
    newArr = arr.reduce((cur, next) => {
        /* eslint-disable */
        obj[next[key]] ? "" : obj[next[key]] = true && cur.push(next);
        /* eslint-enable */
        return cur;
    }, []);
    return newArr;
}


// 判断是否支持高斯模糊
export function filterFlag() {
    try {
        let flag = ('backdropFilter' in document.body.style) || ('backdropFilter' in document.documentElement.style); //是否支持高斯模糊
        let filter_flag = (!!flag || uni.getSystemInfoSync().platform == 'ios') //说明浏览器支持该属性或者是ios 因为经过测试所有的ios都支持该样式，但是部分安卓是不支持的
        return filter_flag;
    } catch (error) {
        return false;
    }
}

/**
 * 获取url上的参数
 * @param {String} key 获取指定key的参数值。如果不传则返回所有参数的key->value对象
 * @param {String} 指定解析的url，默认是当前网址  
 */
export function getUrlParams(key, url) {
    var regexP = /[^#&?]+=[^#&?]*/ig,
        res = {};
    var ms = url.match(regexP);
    if (ms) {
        for (var i = 0; i < ms.length; i++) {
            var arr = ms[i].split('=');
            res[arr[0]] = decodeURIComponent(arr[1]);
        }
    }
    if (key != undefined && key != null && key != '') {
        let _value = null;
        Object.keys(res).forEach((_key) => {
            if (key.toUpperCase() == _key.toUpperCase()) {
                _value = res[_key];
            }
        });
        return _value != null && _value != undefined && _value != 'null' && _value != 'undefined' ? _value : null;
    }
    return res;
}

//获取显示区域的尺寸、滚动位置等信息
export function getViewportInfo(){
    return new Promise(resolve => {
        try {
            uni.createSelectorQuery().selectViewport().boundingClientRect(res => {
                resolve(res)
            }).exec();
        } catch (error) {
            resolve({})
        }
    })
}


export function toFix(value) {
    return Number(value).toFixed(2); // 将字符串数字转成纯数字 此处2为保留两位小数，保留几位小数，这里写几    
}

// 价格分割
export function toSplit(value) {
    return value.toString().split('.');
}

/**
 ** 减法函数，用来得到精确的减法结果
 ** 说明：javascript的减法结果会有误差，在两个浮点数相减的时候会比较明显。这个函数返回较为精确的减法结果。
 ** 调用：accSub(num1,num2)
 ** 返回值：num1减去num2的精确结果
 **/
 export function accSub(num1, num2) {
    var r1, r2, m, n;
    try { r1 = num1.toString().split(".")[1].length; }catch (e) { r1 = 0; }
    try { r2 = num2.toString().split(".")[1].length; }catch (e) { r2 = 0; }
    m = Math.pow(10, Math.max(r1, r2)); //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((num1 * m - num2 * m) / m).toFixed(n);
}

// 加法函数
export function accAdd(num1, num2) {
    var r1, r2, m, c;
    try { r1 = num1.toString().split(".")[1].length; }catch (e) { r1 = 0; }
    try { r2 = num2.toString().split(".")[1].length; }catch (e) { r2 = 0; }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
        var cm = Math.pow(10, c);
        if (r1 > r2) {
            num1 = Number(num1.toString().replace(".", ""));
            num2 = Number(num2.toString().replace(".", "")) * cm;
        } else {
            num1 = Number(num1.toString().replace(".", "")) * cm;
            num2 = Number(num2.toString().replace(".", ""));
        }
    } else {
        num1 = Number(num1.toString().replace(".", ""));
        num2 = Number(num2.toString().replace(".", ""));
    }
    return (num1 + num2) / m;
}

/**
 * 根据定位的字符串解析当前的在兆日code
 * @param {*} fullAddress 地址字符串
 */
 export function getAddressFromMap(fullAddress){
    return new Promise((resolve) => {
        addressHandler.addressParsing({
            supplierId: "1",
            addressInfo: fullAddress
        }).then(res=>{
            if (res.state == 200 && !!res.data && !!res.data.provinceCode){
                let chooseItem = {
                    province:res.data.province,
                    city:res.data.city,
                    county:res.data.county,
                    town:res.data.town,
                    provinceCode: res.data.provinceCode,
                    cityCode: res.data.cityCode,
                    districtCode: res.data.countyCode,
                    townCode: res.data.townCode?res.data.townCode:'',
                    addressAll: `${res.data.province ? res.data.province : ''}${res.data.city ?res.data.city : ''}${res.data.county ? res.data.county : ''}${res.data.town ? res.data.town : ''}`,
                    detailAddress: `${res.data.exactAddress ? res.data.exactAddress : ''}`
                }
                resolve(chooseItem)
            } else {
                resolve({})
            }
        }).catch(e=>{
            console.error(e);
            resolve({})
        })
    })
}

export function rgbToHex(rgb) {
    let _this = rgb;
    let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    if (/^(rgb|RGB)/.test(_this)) {
        let aColor = _this.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
        let strHex = "#";
        for (let i = 0; i < aColor.length; i++) {
            let hex = Number(aColor[i]).toString(16);
            hex = String(hex).length == 1 ? 0 + '' + hex : hex; // 保证每个rgb的值为2位
            if (hex === "0") {
                hex += hex;
            }
            strHex += hex;
        }
        if (strHex.length !== 7) {
            strHex = _this;
        }
        return strHex;
    } else if (reg.test(_this)) {
        let aNum = _this.replace(/#/, "").split("");
        if (aNum.length === 6) {
            return _this;
        } else if (aNum.length === 3) {
            let numHex = "#";
            for (let i = 0; i < aNum.length; i += 1) {
                numHex += (aNum[i] + aNum[i]);
            }
            return numHex;
        }
    } else if (colorMap[_this]) {
        return colorMap[_this];
    } else {
        return _this;
    }
}

/**
* JS颜色十六进制转换为rgb或rgba,返回的格式为 rgba（255，255，255，0.5）字符串
* @param {string} color 为传入的十六进制的色值
* @param {number} alpha rgba的透明度
*/
export function colorToRgba(color, alpha = 1) {
    color = rgbToHex(color)
    // 十六进制颜色值的正则表达式
    let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
    /* 16进制颜色转为RGB格式 */
    let sColor = color.toLowerCase()
    if (sColor && reg.test(sColor)) {
        if (sColor.length === 4) {
            var sColorNew = '#'
            for (let i = 1; i < 4; i += 1) {
                sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
            }
            sColor = sColorNew
        }
        // 处理六位的颜色值
        let sColorChange = []
        for (let i = 1; i < 7; i += 2) {
            sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
        }
        // return sColorChange.join(',')
        return 'rgba(' + sColorChange.join(',') + ',' + alpha + ')'
    } else if (color === 'transparent') {
        return 'rgba(255, 255, 255, 0)'
    } else {
        return sColor
    }
}


/** 
 * base64加密
 * @params data String 要加密的字符串
 * @zjf-2021-06-28
 */
export function base64Encode(data) {
    let b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let o1,
        o2,
        o3,
        h1,
        h2,
        h3,
        h4,
        bits,
        i = 0,
        ac = 0,
        enc = '',
        tmp_arr = [];
    if (!data) {
        return data;
    }
    data = utf8Encode(data);
    do {
        o1 = data.charCodeAt(i++);
        o2 = data.charCodeAt(i++);
        o3 = data.charCodeAt(i++);

        bits = o1 << 16 | o2 << 8 | o3;

        h1 = bits >> 18 & 0x3f;
        h2 = bits >> 12 & 0x3f;
        h3 = bits >> 6 & 0x3f;
        h4 = bits & 0x3f;
        tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
    } while (i < data.length);

    enc = tmp_arr.join('');

    switch (data.length % 3) {
    case 1:
        enc = enc.slice(0, -2) + '==';
        break;
    case 2:
        enc = enc.slice(0, -1) + '=';
        break;
    default:    
    }

    return enc;
}

export function utf8Encode(string) {
    string = (string + '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    let utftext = '',
        start,
        end;
    let stringl = 0,
        n;

    start = end = 0;
    stringl = string.length;

    for (n = 0; n < stringl; n++) {
        let c1 = string.charCodeAt(n);
        let enc = null;

        if (c1 < 128) {
            end++;
        } else if ((c1 > 127) && (c1 < 2048)) {
            enc = String.fromCharCode((c1 >> 6) | 192, (c1 & 63) | 128);
        } else {
            enc = String.fromCharCode((c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128);
        }
        if (enc !== null) {
            if (end > start) {
                utftext += string.substring(start, end);
            }
            utftext += enc;
            start = end = n + 1;
        }
    }

    if (end > start) {
        utftext += string.substring(start, string.length);
    }

    return utftext;
}

export function getDateRange(rangeType) {
    const date = new Date();
    const dataRange = { startDate:'', endDate:'' };
    switch (rangeType) {
    case 'month': // 一月内
        dataRange.startDate = formateDateToString(new Date(date.setDate(date.getDate() - 30)),'yyyy-MM-dd hh:mm:ss');
        dataRange.endDate = formateDateToString(new Date(),'yyyy-MM-dd hh:mm:ss');          
        break;
    case 'threeMonths': // 三月内
        dataRange.startDate = formateDateToString(new Date(date.setDate(date.getDate() - 90)),'yyyy-MM-dd hh:mm:ss');
        dataRange.endDate = formateDateToString(new Date(),'yyyy-MM-dd hh:mm:ss');          
        break;
    case 'sixMonths': // 六月内
        dataRange.startDate = formateDateToString(new Date(date.setDate(date.getDate() - 180)),'yyyy-MM-dd hh:mm:ss');
        dataRange.endDate = formateDateToString(new Date(),'yyyy-MM-dd hh:mm:ss');          
        break;
    case 'currentYear': // 今年
        dataRange.startDate = formateDateToString(new Date(`${date.getFullYear()}-01-01`),'yyyy-MM-dd hh:mm:ss');
        dataRange.endDate = formateDateToString(new Date(),'yyyy-MM-dd hh:mm:ss');          
        break;
    case 'lastYear': // 去年
        dataRange.startDate = formateDateToString(new Date(`${date.getFullYear() - 1}-01-01`),'yyyy-MM-dd hh:mm:ss');
        dataRange.endDate = formateDateToString(new Date(`${date.getFullYear() - 1}-12-31`),'yyyy-MM-dd hh:mm:ss');          
        break;
    case 'previousYear': // 前年
        dataRange.startDate = formateDateToString(new Date(`${date.getFullYear() - 2}-01-01`),'yyyy-MM-dd hh:mm:ss');
        dataRange.endDate = formateDateToString(new Date(`${date.getFullYear() - 2}-12-31`),'yyyy-MM-dd hh:mm:ss');          
        break;              
    default:
        break;
    }
    return dataRange;
}