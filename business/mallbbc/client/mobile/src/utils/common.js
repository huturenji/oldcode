import {
    lang_en
} from "@/static/shared/common/language/en.js";
import config from '../common/lib/config' //引入微信浏览器分享的jssdk
import customerService from '@/common/lib/customer-service';
import CryptoJS from "crypto-js"
import goodsHandler from '@/components/goods/handler';
// import orderHandler from '@/components/order/handler';
import Router from '../router.js'
import store from '@/store';
import Vue from 'vue'
import addressHandler from '@/components/address/handler';
import { colorMap } from '@/common/lib/enum/color'

// #ifdef H5
var jweixin = require('../jweixin');
// #endif
/**
 * 当前分页返回的数据是否被填满
 */
export let pageUnfilled = (function(){
    let seriesPageDataLength = 0;
    return ({current,pageCount,pageSize: currPageSize}, fullPageSize) => {
        let result = current < pageCount && (currPageSize + seriesPageDataLength) < fullPageSize;
        if (result){
            seriesPageDataLength += currPageSize
        } else {
            seriesPageDataLength = 0;
        }
        return result;
    }
})()

/**
 * 是否是在微信小程序环境
 */
export function inMiniprogram(){
    return config.MINIPROGRAM_CONFIG.IN_MINIPROGRAM
}

/**
 * 根据pageCount来判断是否还有下一页（场景：缺货或限售有可能过滤一些数据）
 * @returns 
 */
export function hasMoreByPageCount({
    current,
    pageCount
}) {
    return current < pageCount;
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

// 检查字符串是否全是空格
export function checkSpace(str) {
    return str.trim() == "" ? true : false;
}

/* 
 * 替换指定位置的字符
 * str 
 * startIndex 要替换的字符串的开始位置
 * stopIndex  要替换的字符串的结束位置
 * replacetext  指定位置要替换成的内容
 */
export function replaceConByPosition(str, startIndex, stopIndex, replacetext) {
    let target_str = str.substring(0, startIndex - 1) + replacetext + str.substring(stopIndex + 1);
    return target_str;
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

//乘法函数，用来得到精确的乘法结果 js计算浮点数是有问题的
export function accMul(arg1, arg2){
    var m=0,s1=arg1.toString(),s2=arg2.toString();
    try { m+=s1.split(".")[1].length } catch (e){}
    try { m+=s2.split(".")[1].length } catch (e){}
    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
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

// 手机号的验证
export function checkMobile(mobile) {
    let regMobile = /^1[3,4,5,6,7,8,9][0-9]{9}$/;
    if (!mobile) {
        this.$api.msg('请输入手机号!');
        return false;
    } else if (!regMobile.test(mobile)) {
        this.$api.msg('请输入正确的手机号!');
        return false;
    } 
    return true;
}

//座机和移动手机号码的验证
export function checkTel(mobile){
    let regMobile = /(1[3-9]\d{9}$)/;
    let regTel = /(\d{4}-)\d{6,8}/
    if (!mobile) {
        this.$api.msg('请输入电话号码!');
        return false;
    } else if (!regMobile.test(mobile) && !regTel.test(mobile)) {
        this.$api.msg('请输入正确的电话号码!');
        return false;
    } 
    return true;
}

// 6～20位，由英文、数字或符号组成的验证
export function checkPwd(pwd) {
    if (pwd.length < 6) {
        this.$api.msg('密码最少6位哦～');
        return false;
    } else if (pwd.length > 20) {
        this.$api.msg('密码最多20位哦～');
        return false;
    } else if (/[\u4E00-\u9FA5]/g.test(pwd)) {
        this.$api.msg('密码不可以有中文哦～');
        return false;
    } else if (!(/^\S*$/.test(pwd))) {
        this.$api.msg('密码中不可以有空格哦～');
        return false;
    } 
    return true;
}

//设置cookie，判断首页是否弹出开屏
export function setCookie() {
    setStorage({
        key: 'cookie',
        data: 'cookie'
    });
}
//设置cookie，判断店铺首页是否弹出开屏
export function setStoreIsCookie(vid) {
    setStorage({
        key: 'storeIsCookie' + vid,
        data: 'storeIsCookie' + vid
    });
}
//设置cookie，判断积分商城首页是否弹出开屏
export function setPointIsCookie() {
    setStorage({
        key: 'pointIsCookie',
        data: 'pointIsCookie'
    });
}

// 登录成功的页面跳转
export function loginGoPage() {
    const pages = getCurrentPages();
    let fromurl = getStorageSync('fromurl');
    if (fromurl) {
        removeStorage({
            key: 'fromurl',
            success: function () { }
        });

        //#ifdef H5 ||MP-WEIXIN
        Router.replaceAll({ path: fromurl.url, query: fromurl.query })
        return;
        //#endif
        /* eslint-disable */
        if (fromurl.url.indexOf("pages/tabbar/personalcenter") > -1) {
            Router.pushTab(fromurl.url)
        } else if (pages.length > 1) {
            Router.back(1)
        } else {
            Router.replace({ path: fromurl.url, query: fromurl.query })
        }
        return
        /* eslint-enable */
    }
    //#ifdef H5
    Router.replaceAll('/pages/tabbar/personalcenter')
    return;
    //#endif
    /* eslint-disable */
    if (pages.length > 1) {
        Router.back(1)
    } else {
        Router.pushTab(`/pages/tabbar/personalcenter`)
    }
    /* eslint-enable */
}

// 数字格式化为以w为单位，保留2为小数
export function formatW(num) {
    return num > 10000 ? (num / 10000).toFixed(1) * 1 + 'w' : num;
}

// 邮箱的验证
export function checkEmail(email) {
    let reg = /^([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$/;
    if (!email) {
        this.$api.msg('请输入邮箱!');
        return false;
    } else if (!reg.test(email)) {
        this.$api.msg('请输入正确的邮箱!');
        return false;
    } 
    return true;
}

// 装修地址跳转
export function diyNavTo(val) {
    if (val.link_type == 'url') {
        //链接地址,只有h5可以跳转外部链接，其他端都不可以
        //ifdef H5
        window.location.href = val.link_value;
        //endif
        // #ifdef APP-PLUS
        /* eslint-disable */
        plus.runtime.openURL(url) //这里默认使用外部浏览器打开而不是内部web-view组件打开
        /* eslint-enable */
        // #endif

        // #ifdef MP
        /* eslint-disable */
        Router.push({ path: '/pages/index/skip_to', query: { url } })
        /* eslint-enable */
        // #endif
    } else if (val.link_type == 'keyword') {
        //关键词
        Router.push({ path: '/standard/product/list', query: { keyword: encodeURIComponent(val.link_value), source: 'search' } })
    } else if (val.link_type == 'goods') {
        //商品
        Router.push({ path: '/standard/product/detail', query: { sku: val.info.defaultProductId, spu: val.info.spu } })
    } else if (val.link_type == 'category') {
        //商品分类
        let query = {
            categoryId: val.info.categoryId
        }
        if (val.info.grade == 3) {
            query.pid = val.info.pid
        }
        Router.push({ path: '/standard/product/list', query })
    } else if (val.link_type == 'topic') {
        //专题
        Router.push({ path: '/pages/topic/index', query: { id: val.info.decoId ? val.info.decoId : val.info.id } })
    } else if (val.link_type == 'voucher_center') {
        this.$Router.push('/pages/coupon/couponCenter')
    } else if (val.link_type == 'brand_home') {
        this.$Router.push('/pages/public/brand')
    }
}

//获取购物车数量 分两种情况 一种是未登录的情况，在缓存中取值 一种是已经登陆的情况，在接口中取值
export function getCartNumFun(cartData){
    try {
        if (!!!cartData){ return 0 }
        let num = 0;
        let list = cartData.storeCartGroupList
        if (list && list.length > 0){
            list.forEach(item => {
                let promotionCartGroupList = item.promotionCartGroupList;
                if (promotionCartGroupList && promotionCartGroupList.length>0 && promotionCartGroupList[0] && promotionCartGroupList[0].cartList && promotionCartGroupList[0].cartList.length>0){
                    let cartList = promotionCartGroupList[0].cartList;
                    cartList.forEach(() => {
                        num++
                    })
                }
            })
        }

        return num;

    } catch (error) {
        console.log(error)
        return 0;
    }
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
 * 判断是否是微信pc浏览器
 */
export function isWeiXinPCBrower() {
    let ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/WindowsWechat/i) == 'windowswechat') {
        return true; // 微信pc中打开
    } 
    return false; 
}


/** 
 * 判断是否是微信浏览器
 * 
 * @zjf-2020-11-06
 */
export function isWeiXinBrower() {
    //#ifdef H5
    let ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true; // 微信中打开
    } 
    return false; // 普通浏览器中打开
    //#endif
    //#ifndef H5
    /* eslint-disable */
    return false;
    /* eslint-enable */
    //#endif
}

/** 
 * 微信浏览器里面的分享功能
 * type 分享类型  1 为微信好友分享 2为微信朋友圈分享
 * shareData  分享数据数组 里面的参数分别如下：
 *     title: '', // 分享标题
 *     desc: '', // 分享描述
 *     link: '', // 分享链接
 *     imgUrl: '', // 分享图片
 *     type: '', // 分享类型,music、video或link，不填默认为link
 *     dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
 * isTs 是否推手模块，默认false
 * @zjf-2020-11-06
 */
export function weiXinBrowerShare(type, shareData) {
    let tar_url = getApp().globalData.apiUrl + 'v3/member/front/login/wxjsConf?source=1';

    uni.request({
        url: tar_url,
        method: 'GET',
        data: {
            // url: getApp().globalData.apiUrl
            url:location.origin + location.pathname
        },
        success(res) {
            let data = res.data;
            // #ifdef H5
            jweixin.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: data.data.appId, // 必填，公众号的唯一标识
                timestamp: data.data.timestamp, // 必填，生成签名的时间戳
                nonceStr: data.data.nonceStr, // 必填，生成签名的随机串
                signature: data.data.signature, // 必填，签名
                jsApiList: ["updateAppMessageShareData", "updateTimelineShareData"] // 必填，需要使用的JS接口列表
            });
            jweixin.ready(function () {
                //type无意义，在这里去掉判断
                // if (type == 1) {
                //获取“分享给朋友”按钮点击状态及自定义分享内容接口
                jweixin.updateAppMessageShareData({
                    title: shareData.title != undefined ? shareData.title : '', // 分享标题
                    desc: shareData.desc != undefined ? shareData.desc : '', // 分享描述
                    link: shareData.link != undefined
                        ? shareData.link :
                        '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: shareData.imgUrl, // 分享图标
                    type: '', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {

                    }
                })
                // } else if (type == 2) {
                //获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
                wx.updateTimelineShareData({
                    title: shareData.title != undefined ? shareData.title : '', // 分享标题
                    link: shareData.link != undefined
                        ? shareData.link :
                        '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: shareData.imgUrl, // 分享图标
                    success: function () {
                        // 设置成功
                    }
                })

                // }
            })
            //#endif
        }
    })
}

/** 
 * APP微信分享功能
 * type 分享类型  0 图文 2 图片
 * scene 场景  WXSceneSession 分享朋友   WXSenceTimeline 分享朋友圈
 * shareData  分享数据数组 里面的参数分别如下：
 *   1、图文数据
 *     href: '', // 分享链接
 *     title: '', // 分享标题
 *     summary: '', // 分享描述
 *     imageUrl: '', // 分享图片
 *   2、图片数据
 *     imageUrl: '', // 分享图片
 * 
 * @zjf-2020-11-12
 */
export function weiXinAppShare(type, scene, shareData) {
    if (type == 0) {
        //分享图文
        uni.share({
            provider: "weixin",
            scene: scene,
            type: type, //0为图文
            href: shareData.href,
            title: shareData.title,
            summary: shareData.summary,
            imageUrl: shareData.imageUrl, //图片,图片过大的话不展示，建议小于20kb
            success: function () { },
            fail: function () { }
        });
    } else if (type == 2) {
        //分享图片
        uni.share({
            provider: "weixin",
            scene: scene,
            type: type, //2为图片
            imageUrl: shareData.imageUrl, //图片,图片过大的话不展示，建议小于20kb
            success: function () {
            },
            fail: function () {
            }
        });
    }
}

/** 
 * 获取浏览器地址参数
 * variable 为参数名，存在的话返回具体值，否则返回false
 * 
 * @zjf-2020-11-17
 */
export function getQueryVariable(variable) {
    let query = window.location.search.substring(1);
    let vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return false;
}

/** 
 * 微信浏览器里面的支付
 * payData  支付数据数组 里面的参数分别如下：
 *     timestamp: '',  // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
 *     nonceStr: '', // 支付签名随机串，不长于 32 位
 *     package: '', // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
 *     signType: '', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
 *     paySign: '', // 支付签名
 *     appId: '', 
 *     success: function (res) { // 支付成功后的回调函数 }
 *    fail: function (res) { // 失败时执行的回调函数 }
 *     complete: function (res) { // 接口调用完成时执行的回调函数，无论成功或失败都会执行 }
 *     cancel: function (res) { // 用户点击取消时的回调函数，仅部分有用户取消操作的api才会用到 }
 *     trigger: function (res) { // 监听Menu中的按钮点击时触发的方法，该方法仅支持Menu中的相关接口 }
 * 
 * @zjf-2020-11-06
 */
export function weiXinBrowerPay(payData) {
    let tar_url = getApp().globalData.apiUrl + 'v3/member/front/login/wxjsConf?source=1';
    uni.request({
        url: tar_url,
        method: 'GET',
        data: {
            url: location.href
        },
        success(res) {
            let data = res.data;
            // #ifdef H5
            jweixin.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: data.data.appId, // 必填，公众号的唯一标识
                timestamp: data.data.timestamp, // 必填，生成签名的时间戳
                nonceStr: data.data.nonceStr, // 必填，生成签名的随机串
                signature: data.data.signature, // 必填，签名
                jsApiList: ['chooseWXPay', 'scanQRCode'] // 必填，需要使用的JS接口列表
            });
            jweixin.ready(function () {
                jweixin.chooseWXPay(payData);
            })
            //#endif
        }
    })
}

/** 
 * 通用提示
 * con  String  提示的内容,无特殊要求的话可不传
 * 
 * @zjf-2020-11-18
 */
export function bbcCommonTip(con = '该功能在升级中～') {
    uni.showToast({
        title: con,
        icon: 'none'
    });
}
export function formatPercent(val) {
    return !!val ? val.substring(0, val.length - 1) : ""
}
/** 
 * 获取用户登录模块的终端类型
 * 
 * @zjf-2020-11-23
 */
export function getLoginClient() {
    let client = 1; //终端类型， 1、H5(微信内部浏览器) 2、H5(微信小程序)；3、app
    //#ifdef APP-PLUS
    client = 3;
    //#endif
    //#ifdef MP-WEIXIN
    client = 2;
    //#endif
    //#ifdef H5
    client = 1;
    //#endif
    return client;
}

/**
 * 防止用户多此点击触发事件
 * @ljp - 2021-2-7
 * */
export function frequentyleClick(fn) {
    let that = this;
    if (that.onOff) {
        that.onOff = false;
        fn();
        setTimeout(() => {
            that.onOff = true;
        }, 1500)
    } else {
        //如果一直走else，可能是你没有页面的data下面挂载onOff = true; 不然一直会走else
    }
}
/**
 * h5端页面返回处理，刷新后返回到首页
 * @ww - 2021-2-21
 * */
export function back() {
    // #ifdef H5
    const currentpages = getCurrentPages()
    if (currentpages.length > 1) {
        // uni.navigateBack(1)
        Router.back(1)
        return;
    }
    //重新定向跳转页面
    // uni.reLaunch({
    // url: '/pages/index/index'
    // })
    Router.replaceAll('/')
    return;
    // #endif
    // #ifndef H5
    /* eslint-disable */
    const pages = getCurrentPages()
    if (pages.length > 1) {
        // uni.navigateBack(1)
        Router.back(1)
        return;
    } 
    // uni.reLaunch({
    // 	url: '/pages/index/index'
    // })
    Router.replaceAll('/pages/index/index')
    // #endif H5
    /* eslint-enable */
}

/*
 * 获取当前语言下的数据 —— Object类型
 * 返回对象  语言数据对象
 * @zjf-2020-12-28
 * */
export function getCurLanguage(key) {
    let curLang = getApp().globalData.curLang;
    if (curLang == 'zh') {
        return key;
    } 
    const language = {
        'en': lang_en
    }
    let curData = language[curLang][key];
    return curData != undefined && curData ? curData : '语言包中缺少该数据'; //此处不要翻译
}

/*
 * 判断是否显示聊天页面的时间,2条消息之间间隔超过3分钟显示
 * 返回Boolean类型
 * preMsgTime 上一条消息的发送时间，curMsgTime该条消息的发送时间
 * @zjf-2021-03-05
 * */
export function isShowTime(preMsgTime, curMsgTime) {
    let res = false;

    // #ifdef APP-PLUS
    if (uni.getSystemInfoSync().platform === 'ios' && preMsgTime != undefined && curMsgTime != undefined) { //ios系统不识别该时间格式，进行专门格式化
        let arr = [preMsgTime, curMsgTime].map(item => item.toString().split(/[- :]/))
        let newDate = arr.map(item => item = new Date(item[0], item[1] - 1, item[2], item[3], item[4], item[5]))
        if (Date.parse(newDate[1]) * 1 - Date.parse(newDate[0]) * 1 > 3 * 60 * 1000) {
            res = true;
        }
    } else if (uni.getSystemInfoSync().platform === 'android' && preMsgTime != undefined && curMsgTime != undefined) {
        if (Date.parse(new Date(curMsgTime.toString().replace(/-/g, '/'))) * 1 - Date.parse(new Date(preMsgTime
            .toString().replace(/-/g, '/'))) * 1 > 3 * 60 * 1000) {
            res = true;
        }
    }
    // #endif

    // #ifndef APP-PLUS
    if (Date.parse(new Date(curMsgTime.toString().replace(/-/g, '/'))) * 1 - Date.parse(new Date(preMsgTime.toString().replace(/-/g, '/'))) * 1 > 3 * 60 * 1000) {
        res = true;
    }
    // #endif

    return res;
}

/*
 * 格式化聊天时间
 * 返回格式化后的数据，字符串类型
 * time 时间戳 13位
 * @zjf-2021-03-05
 * */
export function formatChatTime(time) {
    // #ifdef APP-PLUS
    if (uni.getSystemInfoSync().platform === 'ios') { //ios系统不识别该时间格式，进行专门格式化
        let arr = time.split(/[- :]/)
        let newDate = new Date(
            arr[0],
            arr[1] - 1,
            arr[2],
            arr[3],
            arr[4],
            arr[5]
        )
        return format(newDate, 'yyyy年MM月dd日 hh:mm')
    } 
    return format(new Date(time), 'yyyy年MM月dd日 hh:mm');
    // #endif

    // #ifndef APP-PLUS
    /* eslint-disable */
    return format(new Date(time.toString().replace(/-/g, '/')), 'yyyy年MM月dd日 hh:mm');
    /* eslint-enable */
    // #endif
}

export function format(date, fmt) {
    let o = {
        "y+": date.getFullYear(), //年
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
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

export function getPrimaryKey(){
    let key;
    // #ifdef H5
    let userParams = (getApp().globalData || this?.globalData?.userParams)?.userParams;
    key = `${userParams?.userId ?? ''}_${userParams?.companyId ?? ''}_${userParams?.channelId ?? ''}_${config.CLIENT_NAME ?? ''}` ?? '';
    // #endif

    //#ifdef MP-WEIXIN
    key = '';
    //#endif
    
    return key;
}

// 返回用户唯一key
export function getUserKey() {
    return `${getPrimaryKey()}_`
}

/*覆盖storage相关函数 start*/

export function setStorage(obj){
    obj.key = `${getPrimaryKey()}_${obj.key}`;
    return uni.setStorage(obj);
}

export function setStorageSync(key, value){
    key = `${getPrimaryKey()}_${key}`;
    return uni.setStorageSync(key, value);
}

export function getStorage(obj){
    obj.key = `${getPrimaryKey()}_${obj.key}`;
    return uni.getStorage(obj);
}

export function getStorageSync(key){
    key = `${getPrimaryKey()}_${key}`;
    return uni.getStorageSync(key);
}

export function removeStorage(obj){
    obj.key = `${getPrimaryKey()}_${obj.key}`;
    return uni.removeStorage(obj);
}

export function removeStorageSync(key){
    key = `${getPrimaryKey()}_${key}`;
    return uni.removeStorageSync(key);
}

export function setSession(key, value){
    key = `${config.CLIENT_NAME}_${key}`;
    return sessionStorage.setItem(key, value);
}

export function getSession(key){
    key = `${config.CLIENT_NAME}_${key}`;
    return sessionStorage.getItem(key);
}

export function removeSession(key){
    key = `${config.CLIENT_NAME}_${key}`;
    return sessionStorage.removeItem(key);
}

/*覆盖storage相关函数 end*/

/**
 * 获取json文件
 * @param {Object} path json文件地址
 */
export function getJsonFile(path) {
    return new Promise((resolve, reject) => {
        var req = new XMLHttpRequest();
        req.open('GET', path, true);
        req.setRequestHeader('Accept', 'application/json');
        req.onreadystatechange = function () {
            if (req.readyState == 4) {
                if (req.status == 200) {
                    try {
                        resolve(JSON.parse(req.responseText))
                    } catch (e) {
                        console.error(e);
                        reject()
                    }
                } else {
                    console.error('get json file failed! http state is: ' + req.status)
                    reject()
                }
            }
        };
        req.send();
    })
}

/**
 * 获取url上的参数
 * @param {String} key 获取指定key的参数值。如果不传则返回所有参数的key->value对象
 * @param {String} 指定解析的url，默认是当前网址  
 * @param {Boolean} 参数是否decode
 */
export function getUrlParams(key, url = window.location.href, nodecode = false) {
    var regexP = /[^#&?]+=[^#&?]*/ig,
        res = {};
    var ms = url.match(regexP);
    if (ms) {
        for (var i = 0; i < ms.length; i++) {
            var arr = ms[i].split('=');
            res[arr[0]] = nodecode?arr[1]:decodeURIComponent(arr[1]);
        }
    }
    if (key!=undefined && key!=null && key!=''){
        let _value = null;
        Object.keys(res).forEach((_key)=>{
            if (key.toUpperCase() == _key.toUpperCase()){
                _value = res[_key];
            }
        });
        return _value!=null && _value!=undefined && _value!='null' && _value!='undefined' ? _value : null;
    }
    return res;
}

/**
 * 返回url上URL_STABLE_PARAMS的相关属性值
 * @returns 
 */
export function getUrlStableParamValue(){
    return Object.fromEntries(config.URL_STABLE_PARAMS.map((key) => {
        return [key, getUrlParams(key)]
    }).filter(arr => isNotEmpty(arr[1])))
}

export function openBBCPage(url){
    let split = url.indexOf('?') == -1 ? '?' : '&'
    sinosdk.sino.removeBackListener();//解除app返回事件监听，防止打开第三方页面后，点击回退报错
    let query = 'closeTo=1';
    let urlParams = getUrlParams();
    config.URL_STABLE_PARAMS.forEach(key => {
        if (isNotEmpty(urlParams[key])){
            query += `&${key}=${urlParams[key]}`
        }
    })
    sinosdk.sino.open(url + split + query);//backTo=-1会在appEventMixin中处理，点击回退时直接关闭页面
}

export function openCustomerServicePage(url){
    // 此处涉及客服的跳转只能用window.open方法，不能用sinoSDK的方法，因为该方法在mpass【乌鲁木齐银行】上有问题 会导致h5卡片显示为encode的乱码
    window.open(url);
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
        return 'rgba(' + sColorChange.join(',') + ',' + alpha + ')'
    } else if (color === 'transparent') {
        return 'rgba(255, 255, 255, 0)'
    } 
    return sColor
    
}

export function openThirdApplet(url){
    sinosdk.sino.openThirdApplet({url:url})
}
export function agreementFlag(item){
    return new Promise((resolve,reject) => {
        if (Object.prototype.hasOwnProperty.call(item,'agreement')){
            if (item.agreement == ""){
                resolve(true)
            } else {
                getStorage({
                    key: item.url,
                    success: () => {
                        resolve(true)
                    },
                    fail: () => {
                        Vue.prototype.$agreeMent.showTip({
                            content: item.agreement,
                            cancelText: "不同意",
                            confirmText: "同意" 
                        }).$on('confirm', () => {
                            console.log("同意协议");
                            setStorage({
                                key: item.url,
                                data: true
                            })
                            resolve(true)
                        }).$on('cancel', () => {
                            reject(false)
                        });
                    }
                })
            }
        } else {
            resolve(true)
        }
    })
}

// ，
/**
 * 判断跳转页面时候的相关规则
 * 目前只有一个场景，即判断url参数来校验当前时间是否在抽奖活动范围内
 * @param {*} url 配置跳转的url路径
 * @param {*} key url上参数key
 * @returns true 代表校验通过可以跳转  false代表校验不通过，不能跳转
 */
export function judgeUrlParamsRules(item, key="rules"){
    if(isEmpty(item.url) && isEmpty(item.rules)){ return true } // 没有url的跳转场景，此时默认返回true，即不需要判断规则，可以跳转
    try {
        let rulesStr = isEmpty(item.rules) ? getUrlParams(key, item.url, true) : item.rules;
        let rules = JSON.parse(decodeURIComponent(rulesStr))
        let startTime = rules.interval[0]
        let endTime = rules.interval[1]
        let nowDate = new Date().getTime()
        let defaultTips = '该活动不在有效时间范围内，请查阅活动规则'
        if (nowDate < startTime || nowDate > endTime){
            uni.showToast({
                title: isNotEmpty(item.rulesTips) ? item.rulesTips : defaultTips,
                icon: 'none',
                duration: 1000
            })
            return false
        }
    } catch (error) {
        
    }
    return true
}

//根据标记给url添加参数格式为a=$b$
export function urlAddParambyTag(url){
    let res = url;
    try {
        let urlParams = getUrlParams(null,url,true);
        let userCenter = store.state.userCenterData;
        let userInfo = getApp().globalData.userParams;
        let userParams = {
            memberId:userCenter.memberId,
            memberName:userCenter.memberName,
            memberNickName:userCenter.memberNickName,
            memberAvatar:userCenter.memberAvatar,
            ...userInfo
        }
        for (var objKey in urlParams) {
            if(!!urlParams[objKey]){
                let bpparamStr = decodeURIComponent(urlParams[objKey])
                let bpparamTags = bpparamStr.match(/\$.*?\$/g);
                bpparamTags?.forEach(tag=>{
                    let key = tag.replace(/\$/g,'');
                    !!userParams[key] && (bpparamStr = bpparamStr.replace(tag,userParams[key]));
                })
                if(objKey==config.BP_PARAM){
                    bpparamStr = encodeURIComponent(bpparamStr);
                }
                res = res.replace(`${objKey}=${urlParams[objKey]}`,`${objKey}=${bpparamStr}`)
            }
        }

    } catch (error) {
        console.log(error)
    }
    return res;
}

// 装修跳转
export async function skipTo( item, context, target='_blank' ) {
    let action = target == 'self' ? 'replace' : 'push';//重定向或前进路由
    let url = item.url
    if(!judgeUrlParamsRules(item)){ return } // 判断跳转的url 是否符合规则
    let sku = item.info?.sku
    // let seckillId = item.info?.seckillId
    if (item.url_type == 'url') { //跳转链接地址
        if (!url){
            uni.showToast({
                title: '功能正在开发中，敬请期待...',
                icon: 'none',
                duration: 700
            })
            return
        }
        if (await agreementFlag(item)){
            let urlObj = {}
            try {
                urlObj = new URL(url)
            } catch (e){}
            if (urlObj.origin + urlObj.pathname == location.origin + location.pathname){
                let paramIndex = urlObj.hash.indexOf('?');
                let query = {}
                if (paramIndex > -1){
                    let searchParams = new URLSearchParams(urlObj.hash.split('?')[1]);
                    for (var pair of searchParams.entries()) {
                        query[pair[0]] = pair[1]
                    }
                }
                context.$Router[action]({path: urlObj.hash.substring(1, paramIndex==-1 ? urlObj.hash.length : paramIndex), query})
            } else {
                openBBCPage(urlAddParambyTag(url))
            }
        }
    } else if (item.url_type == 'third_url') { 
        if (!url){
            uni.showToast({
                title: '功能正在开发中，敬请期待...',
                icon: 'none',
                duration: 700
            })
            return
        }
        if (await agreementFlag(item)){
            openThirdApplet(urlAddParambyTag(url))
        }
    } else if (item.url_type == 'openBbcPage_url') {
        if (!url){
            uni.showToast({
                title: '功能正在开发中，敬请期待...',
                icon: 'none',
                duration: 700
            })
            return
        }
        if (await agreementFlag(item)){
            openBBCPage(urlAddParambyTag(url))
        }
    } else if (item.url_type == 'applet_url') {
        if (!url){
            uni.showToast({
                title: '功能正在开发中，敬请期待...',
                icon: 'none',
                duration: 700
            })
            return
        }
        if (await agreementFlag(item)){
            if (inBrowser()){
                window.open(urlAddParambyTag(url));
                return;
            }
            if (!!item.appletId){
                sinosdk.sino.openApplet({
                    url:urlAddParambyTag(url),
                    appId: item.appletId
                });
            }
        }
    } else if (item.url_type == 'goods') { //跳转商品详情页
        context.$Router[action]({path:'/standard/product/detail',query:{sku,spu:url}})
    } else if (item.url_type == 'category') { // 分类列表
        context.$Router[action]({path:'/standard/product/list',query:{categoryIds:url}})
    } else if (item.url_type == 'keyword') { // 关键词
        if (context.store_id){
            context.$Router[action]({path:'/standard/product/list',query:{keyword:url,source:'search',storeId:context.store_id}})
        } else {
            context.$Router[action]({path:'/standard/product/list',query:{keyword:url,source:'search'}})
        }
    } else if (item.url_type == 'topic') { //跳转专题页
        context.$Router[action]({path:'/pages/topic/index',query:{id:(item.info.decoId ? item.info.decoId : item.info.id)}})
    } else if (item.url_type == 'brand_home') { //品牌列表
        context.$Router[action]('/pages/public/brand')
    } else if (item.url_type == 'ladder_group') { //阶梯团
        context.$Router[action]('/standard/ladder/index/index')
    } else if (item.url_type == 'presale') { //预售入口页
        context.$Router[action]('/standard/presale/index/list')
    } else if (item.url_type == 'voucher_center') { //优惠券领券中心
        context.$Router[action]('/pages/coupon/couponCenter')
    } else if (item.url_type == 'point') { //积分商城首页
        context.$Router[action]('/standard/point/index/index')
    } else if (item.url_type == 'svideo_center') { //短视频列表
        context.$Router[action]('/extra/svideo/svideoList')
    } else if (item.url_type == 'live_center') { //直播列表
        context.$Router[action]('/extra/live/liveList')
    } else if (item.url_type == 'spreader_center') { //推手中心
        if (!context.hasLogin) {
            // uni.showToast({
            // title: '请登录～',
            // icon: 'none',
            // duration: 700
            // })
        } else {
            context.$Router[action]('/extra/tshou/index/index')
        }

    } else if (item.url_type == 'live') { //直播播放页面
        context.$Router[action]({path:'/extra/live/livePlay',query:{live_id:url}})
    } else if (item.url_type == 'svideo') { //短视频播放页面
        context.$Router[action]({path:'/extra/svideo/svideoPlay',query:{video_id:url.videoId,label_id:url.labelId,author_id:url.authorId}})
    } else if (item.url_type == 'spell_group') {
        context.$Router[action]('/standard/pinGroup/index/index')
    } else if (item.url_type == 'sign_center') {
        if (!context.hasLogin) {
            
        } else {
            context.$Router[action]('/standard/signIn/signIn')
        }
    } else if (item.url_type == 'store'){ //说明是跳转店铺首页中转页面
        context.$Router[action]({path:'/standard/store/transfer', query:{storeId: item.storeId, supplierType: polyfill(item.supplierTypes)}})
    } else if (item.url_type == 'customer-service') { // 跳转客服页
        let kefuUrl = await customerService.run(1).catch(e => {
            console.log(e)
        });
        openCustomerServicePage(kefuUrl)
    } else if ( item.url_type == 'confirm_order'){ // 装修的商品一起购买
        if (!item.info.products || item.info.products.length <= 0){
            console.log('没有装修一起购买的商品');
            return
        }
        setStorageSync('confirmParams','')
        let goodsData = []
        uni.showLoading()
        await goodsHandler.getListBySkus({skus:item.info.ids}).then((res) => {
            if (res.state == 200) {
                if (res.data.length > 0) {
                    goodsData = res.data
                } else {
                    uni.showToast({
                        title: "当前商品暂时缺货，火速补货中，请稍后再试",
                        icon:'none'
                    })
                }
            } else {
                goodsData = []
                uni.showToast({
                    title: "当前商品暂时缺货，火速补货中，请稍后再试",
                    icon:'none'
                })
            }
            uni.hideLoading()
        }).catch(() => {
            goodsData = []
            uni.hideLoading()
        });
        let productInfo = []
        let tempProductInfo = []
        if (goodsData.length>0) {
            
            goodsData.forEach(goodsItem1 => {
                let targetIndex1 = item.info.products.findIndex(tempItem => tempItem.sku == goodsItem1.sku)
                let goodsIndex = tempProductInfo.findIndex(tempItem1 => tempItem1.storeId == goodsItem1.storeId )
                if (goodsIndex > -1) {
                    tempProductInfo[goodsIndex].products.push({
                        sku:goodsItem1.sku,
                        skuName:goodsItem1.skuName,
                        mainImage: goodsItem1.mainImage,
                        number:targetIndex1>-1?item.info.products[targetIndex1].number:1,
                        salePrice: goodsItem1.salePrice,
                        specValues:item.info.products[targetIndex1].specValues==null?'默认':item.info.products[targetIndex1].specValues,
                        lowestBuy:goodsItem1.lowestBuy,
                        notAttendDiscount:false,
                        ownShop:goodsItem1.ownShop,
                        storeId:goodsItem1.storeId,
                        categoryId3:goodsItem1.categoryId3,
                        cidPath:goodsItem1.cidPath,
                        specialOfferVO:(goodsItem1?.promotionId)
                            ?{
                                promotionId:goodsItem1.promotionId,
                                promotionType:goodsItem1.promotionType
                            }
                            :null
                    })
                } else {
                    tempProductInfo.push({
                        storeId : goodsItem1.storeId,
                        storeName : goodsItem1.storeName,
                        ownShop : goodsItem1.ownShop,
                        products:[{
                            sku:goodsItem1.sku,
                            skuName:goodsItem1.skuName,
                            mainImage: goodsItem1.mainImage,
                            number:targetIndex1>-1?item.info.products[targetIndex1].number:1,
                            salePrice: goodsItem1.salePrice,
                            specValues:item.info.products[targetIndex1].specValues==null?'默认':item.info.products[targetIndex1].specValues,
                            lowestBuy:goodsItem1.lowestBuy,
                            notAttendDiscount:false,
                            ownShop:goodsItem1.ownShop,
                            storeId:goodsItem1.storeId,
                            categoryId3:goodsItem1.categoryId3,
                            cidPath:goodsItem1.cidPath,
                            specialOfferVO:(goodsItem1?.promotionId)
                                ?{
                                    promotionId:goodsItem1.promotionId,
                                    promotionType:goodsItem1.promotionType
                                }
                                :null
                        }]
                    })
                }
            })
            productInfo = tempProductInfo
            let confirmParams = {
                productInfo:productInfo
            }
            setStorageSync('confirmParams',JSON.stringify(confirmParams))
            context.$Router[action]({
                path:'/views/order/confirm/normal'
            })

        }
    }
}

//数据兼容处理
export function polyfill(item){
    let str = item;
    if (!!Array.isArray(item)){
        str = item.join(',');
    }
    return str;
}

export function assignUrlParam(key, value, url=location.href){
    //合并参数
    function assign (urlParam){
        let index = urlParam.indexOf('?');
        if (index==-1){
            return urlParam + '?' + key + '=' + value;
        }
        let urlArr = urlParam.split('?');
        let params = urlArr[1].split('&');
        let exit = false;//url中是否存在这个key
        params = params.map(keyValues=>{
            let arr = keyValues.split('=');
            if (key == arr[0]){
                exit = true;
                return keyValues = key + '=' + value;
            }
            return keyValues;
        })
        //不存在则新增
        if (!exit){
            params.push(key + '=' + value);
        }
        return urlArr[0] + '?' +params.join('&');
    }
    //判断是否有路由
    let hashIndex = url.indexOf('#');
    if (hashIndex==-1){
        return assign(url);
    }
    let hash = url.substring(hashIndex, url.length);
    return url.substring(0, hashIndex) + assign(hash)
}

// 获取计算属性样式
export function getStyle (obj, attr) {
    if (obj.currentStyle) { // 兼容IE
        return !!attr ? obj.currentStyle[attr] : obj.currentStyle;
    } 
    return !!attr ? window.getComputedStyle(obj, null)[attr] : window.getComputedStyle(obj, null);
}

// 数组对象根据某个key去重去重
export function repeatArray(arr, key) {
    let obj = {};
    let newArr = [];
    newArr = arr.reduce((cur,next) => {
        /* eslint-disable */
        obj[next[key]] ? "" : obj[next[key]] = true && cur.push(next);
        /* eslint-enable */
        return cur;
    }, []);
    return newArr;
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

export var isString = obj => {
    return Object.prototype.toString.call(obj) == '[object String]';
}

export var isArray = obj => {
    return Object.prototype.toString.call(obj) == '[object Array]' || Object.prototype.toString.call(obj) == '[object NodeList]';
}

export var isObject = obj => {
    return Object.prototype.toString.call(obj) == '[object Object]';
}

export var isNumber = obj => {
    return Object.prototype.toString.call(obj) == '[object Number]';
}

export var isEmpty = obj => {
    if (obj==null || obj==undefined){
        return true;
    }
    if (isString(obj)){
        return obj.replace(/\s/g, '') == '';
    }
    if (isArray(obj)){
        return obj.length == 0;
    }
    if (isObject(obj)){
        return Object.keys(obj).length == 0;        
    }
    return false;
}

export var isStrictEmpty = obj => {
    return isEmpty(obj) || obj == 'undefined' || obj == 'null'
}

export var isNotEmpty = obj => {
    return !isEmpty(obj);
}

export var isNotStrictEmpty = obj => {
    return !isStrictEmpty(obj);
}

export function lockScroll(domTag='body') {
    try {
        let dom;
        if (isString(domTag)){
            dom = document.querySelector(domTag);
        }
        //防止多次加锁
        if (dom.dataset.lockScroll){
            return;
        }
        dom.dataset.lockScroll = true;
        let style = getStyle(dom);
        let scrollTop = dom.scrollTop;
        let {overflow, position, top} = style;
        dom.dataset.cacheScroll = overflow;
        dom.dataset.cacheScrollTop = scrollTop;
        dom.dataset.cachePosition = position;
        dom.dataset.cachePositionTop = top;

        dom.style.position = 'relative';
        // 为了解决下拉弹框用此方法在部分手机上在点击时整个页面会滑到其他位置，而不是点击时的位置的问题
        if (domTag!='body') {
            dom.style.top = scrollTop * -1 + 'px';
        }
        dom.style.overflow = 'hidden';
    } catch (e) {
        console.error(e)
    }
}

export function unlockScroll(dom='body') {
    try {
        if (isString(dom)){
            dom = document.querySelector(dom);
        }
        delete dom.dataset.lockScroll;
        dom.style.position = dom.dataset.cachePosition;
        dom.style.top = dom.dataset.cachePositionTop;
        dom.style.overflow = dom.dataset.cacheScroll;
        dom.scrollTop = parseInt(dom.dataset.cacheScrollTop);

        delete dom.dataset.cacheScroll;
        delete dom.dataset.cacheScrollTop;
        delete dom.dataset.cachePosition;
        delete dom.dataset.cachePositionTop;
    } catch (e) {
        console.error(e)
    }
}

/**
 * 获取app用户字号缩放值并设置页面缩放
 */
export function setFontScale(){
    try {
        sinosdk.sino.getAppInfo({key:'fontScale'}).then((res)=>{
            let MIN_PC_WIDTH = 616;
            if (!!res.value&&''!=res.value&&0!=res.value && document.documentElement.clientWidth < MIN_PC_WIDTH){
                document.documentElement.style.fontSize=((res.value*10000/750)+'vw')
            }
        })
    } catch (e){
        console.error(e);
    }
}

/** 
 * 微信上关闭页面
 */
export function closePageOnWinxin() {
    // 兼容ios关闭，采用延时关闭，还有备用方案history.go(-2);
    setTimeout(()=>{
        jweixin.closeWindow();
    }, 0)
}

/****
 * 初始化高德js
 */
export function initMap(callBack){
    const ID = 'amap'
    let script = document.getElementById(ID);
    if (script){
        callBack?.();
        return
    }
    SnUtils.loadScript({
        src: config.GD_MAP,
        id: ID,
        onload: function() {        
            callBack?.();
        }
    });
}

/**
 * 高德获取当前定位的位置
 */
export function getLocation(option = {}) {
    return new Promise((resolve, reject) => {
        initMap(()=>{
            AMap.plugin("AMap.Geolocation", function() {
                var geolocation = new AMap.Geolocation(Object.assign({
                    // 是否使用高精度定位，默认：true
                    enableHighAccuracy: false,
                    // 设置定位超时时间，默认：无穷大
                    timeout: 5000,
                    //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                    zoomToAccuracy: true     
                }, option));

                //判断是否是ios系统，如果是，则调用远程定位方法
                // if (AMap.UA.ios) {
                //     //使用远程定位，见 remogeo.js
                //     var remoGeo = new RemoGeoLocation();
                //     //替换方法
                //     navigator.geolocation.getCurrentPosition = function () {
                //         return remoGeo.getCurrentPosition.apply(remoGeo, arguments);
                //     };
                //     //替换方法
                //     navigator.geolocation.watchPosition = function () {
                //         return remoGeo.watchPosition.apply(remoGeo, arguments);
                //     };
                // }
    
                geolocation.getCurrentPosition()
                AMap.event.addListener(geolocation, 'complete', onComplete)
                AMap.event.addListener(geolocation, 'error', onError)
    
                function onComplete (data) {
                    // data是具体的定位信息
                    resolve(data);
                }
                function onError (data) {
                    // 定位出错
                    console.log('定位出错', data)
                    reject(data);
                }                    
            });
        })
    });
}

export function geoLocationByGaode (complete, error) {
    AMap.plugin('AMap.Geolocation', function () {
        let amapGeolocation = new AMap.Geolocation({
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 10000, //超过10秒后停止定位，默认：无穷大
            maximumAge: 0, //定位结果缓存0毫秒，默d认：0
            convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
            showButton: false, //显示定位按钮，默认：true
            showMarker: false, //定位成功后在定位到的位置显示点标记，默认：true
            showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
            panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
            zoomToAccuracy:true //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        })
        amapGeolocation.getCurrentPosition()
        AMap.event.addListener(amapGeolocation, 'complete', onComplete)
        AMap.event.addListener(amapGeolocation, 'error', onError)
        function onComplete (data) {
            // data是具体的定位信息
            // let point = extendUtils.gaoDeToBaidu(data.position.lng, data.position.lat);
            // let res = {
            //     type:data.type,
            //     point: point,
            //     address_detail: {
            //         city: data.addressComponent.city
            //     },
            //     address:data.formattedAddress,
            //     addressObj:data
            // }
            complete(data)
        }
        function onError () {
            error('获取定位失败，请手动添加地址！')
            // 定位出错
        }
    })
}

/*****************************获取定位，使用app提供的定位API获取定位 start***************/
/**
 * 获取定位信息
 * 1.app方法获取定位分为getLocationFunction，locationNotify，locationObserver；
 * 2.getLocationFunction为单次获取定位，直接调用即可，部分银行app单独调用会失败（例如北京银行2022-2-25之前的版本）；
 * 3.locationNotify，locationObserver为成对使用，持续获取位置信息，先调用locationObserver通知app开启定位，然后通过locationNotify持续获取回调，还可通过locationObserver方法关闭定位；
 * 4.首次安装app并进入需要获取用户授权获取定位信息，部分老版本app只能通过locationObserver方才才能触发授权；
 * @param {Object} onComplete  成功回调
 * @param {Object} onError     失败回调
 */
export function geoLocation (onComplete, onError) {
    try {
        //2022-2-25兼容老银行，这里采用多种方式定位，业务侧成功获取到后不再接受后续的回调数据，下面的方法的顺序不能改，如果先调用LocationObserver，再调用GetLocationFunction，GetLocationFunction会返回低精度且缺失city的数据导致定位失败
        //使用浏览器定位不准，将定位修改为调用app方法
        sinosdk.sino.getLocationFunction().then((result)=>{
            console.log('GetLocationFunction is success')
            _location(result,'GetLocationFunction');
        });
        sinosdk.sino.onLocationChange((result)=>{
            console.log('LocationNotify is successs');
            _location(JSON.parse(result),'LocationNotify');
        });
        sinosdk.sino.switchLocationObserver({observerType: 0});
    } catch (e) {
        console.error('catch app location is fail api location start')
        onError('获取定位信息失败')
    }

    function _location(result){
        if (result.retCode == 0 && 0!==result.data.longitude) {
            onComplete(result.data);
        } else {
            console.error('app location is fail on error')
            onError('获取定位失败，请手动添加地址！')
        }
    }  
}
/**
 * 关闭定位
 */
export function offLocation () {
    sinosdk.sino.switchLocationObserver({observerType: 1});
}

/**
 * 是否是公款转账支付
 */
export function isTransferPay(state){
    return state?.indexOf('TRANSFER_PAY') > -1
}

export function isHomePage(){
    return '#'+config.INDEX_ROUTE_PATH == location.hash.split('?')[0]
}

export function inBrowser(){
    return sinosdk.sino.getPlatform() == sinosdk.sino.constant.RUN_ENV.BROWSER;
}


export function switchReturnBtn(state){
    if (SnUtils?.isPC()){
        sinosdk.sino.showReturnBtn(state);
    } else {
        window.titleBar.set({
            showBack: state
        })
    }
}

/**
 * rgb转换为rgba添加透明通道
 */
export function rgbToRgba(color, alp) {
    let rgbaAttr = color.match(/[\d.]+/g);
    if (rgbaAttr.length >= 3) {
        let r, g, b;
        r = rgbaAttr[0];
        g = rgbaAttr[1];
        b = rgbaAttr[2];
        return 'rgba(' + r + ',' + g + ',' + b + ',' + alp + ')';
    }
}
/**
 * rgba转换为rgb，去除透明通道
 */
export function rgbaToRgb(color) {
    let rgbaAttr = color.match(/[\d.]+/g);
    if (rgbaAttr.length >= 3) {
        let r, g, b;
        r = rgbaAttr[0];
        g = rgbaAttr[1];
        b = rgbaAttr[2];
        return 'rgb(' + r + ',' + g + ',' + b + ')';
    }
    return '';
}
/**
 * 获取rgba色值的透明度
 */
export function getRgbaAlp(color) {
    let alp = 1;
    let rgbaReg = /rgba\([\d ]+(?:\,([\d. ]+)){3}\)/;
    if (rgbaReg.test(color)) {
        alp = color.replace(rgbaReg, '$1');
    }
    return alp;
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

// 判断当前dom是否超出父级dom
export function fontOverFlow(dom) {
    let parent = dom.parentElement;
    let parentStyle = getStyle(parent);
    return dom.offsetWidth > dom.parentElement.offsetWidth - parseFloat(parentStyle.paddingLeft) - parseFloat(parentStyle.paddingRight);
}

// 判断数组中的值是否都相等
export function isAllEqual(array) {
    if (array.length > 0) {
        return !array.some(function(value) {
            return value !== array[0];
        });
    }
    return true;
}

// 金额字号自动缩放
export function fitFontSize(dom,minSize=12) {
    Array.from(dom).forEach((item)=>{
        var children=item.childNodes;
        let breakLoop=false;
        let list;
        while (!!fontOverFlow(item) && !breakLoop){
            // debugger
            list = [];
            children.forEach((citem)=>{
                if (citem.nodeType==1){
                    citem.style.fontSize = parseInt(getStyle(citem, 'fontSize')) - 1 + 'px';
                    if (parseInt(citem.style.fontSize) <= minSize){
                        citem.style.whiteSpace = 'normal';
                        citem.style.lineHeight = 'initial';
                        citem.style.fontSize = minSize+'px';
                    }
                    list.push(parseInt(getStyle(citem, 'fontSize')));
                    if (list.length>1 && isAllEqual(list)){
                        breakLoop = true;
                    } else {
                        breakLoop = false;
                    }
                }
            })

        }
    })
}

/**
 * 用于计算子元素（一般是数组）是否超过了父元素
 * @param parent 父级dom元素，原生dom或者VueComponet对象都行
 * @param children 数组类型。原生dom或者VueComponet对象都行
 */
export function domOverflow(parent, children) {
    if(!parent || !children){
        return;
    }
    parent = parent.$el || parent;
    let totalWidth = 0;
    function calcRealWidth(domStyle){
        return getNumeralVal(domStyle.width) + getNumeralVal(domStyle.marginLeft) + getNumeralVal(domStyle.marginRight)
    }
    function getNumeralVal(val){
        val = parseFloat(val);
        //非数字的不参与计算
        if(isNaN(val)){
            return 0
        }
        return val;
    }
    Array.prototype.forEach.call(children, child => {
        let dom = child.$el || child;
        if (dom instanceof Element) { //需要判断是不是Element节点，因为$refs返回的，可能是一个comment节点
            let style = getStyle(dom);
            if(style.display!='none') {
                totalWidth += calcRealWidth(style);
            }
        }
    })
    let parentStyle = getStyle(parent)
    return totalWidth > calcRealWidth(parentStyle);
}

// 字符串复制功能
export function copyText(str,type=0,text='复制成功') {
    if (type == 0){ //input
        var input = document.createElement("input");
        input.value = str;
        input.readOnly = 'readonly';
        document.body.appendChild(input);
        input.select();
        input.setSelectionRange(0, input.value.length);
        document.execCommand('Copy');
        document.body.removeChild(input);
    } else if (type == 1){ //textarea
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
 * 根据日期范围类型
 * @param {*} rangeType  范围类型
 * @returns 日期范围对象
 */
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
    } else if (formateType == 'MM月dd日'){
        return `${month}月${day}日`; 
    }
}
//是否是微信小程序平台
export function isMPWEIXIN(){
    return process.env.UNI_PLATFORM.toLowerCase() == 'mp-weixin';
}

//是否是h5平台
export function isH5(){
    return process.env.UNI_PLATFORM.toLowerCase() == 'h5';
}

// 对象深拷贝
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
/**
 * @description 深度克隆
 * @param {object} obj 需要深度克隆的对象
 * @returns {*} 克隆后的对象或者原值（不是对象）
 */
export function deepCopy(obj) {
    // 对常见的“非”值，直接返回原来值
    if ([null, undefined, NaN, false].includes(obj)) { return obj }
    if (typeof obj !== 'object' && typeof obj !== 'function') {
        // 原始类型直接返回
        return obj
    }
    const o = Object.prototype.toString.call(obj) === '[object Array]' ? [] : {}
    for (const i in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, i)) {
            o[i] = typeof obj[i] === 'object' ? deepCopy(obj[i]) : obj[i]
        }
    }
    return o
}
/** 
获取图片的平均色
* @param {String} url 图片地址
* @param {Object} imageElement 图片元素
* @param {Number} imageX 截取点的横坐标
* @param {Number} imageWidth 截取图片的宽
    **/
export function averageColor(url,imageX=0,imageY=0,imageHeight,imageWidth) {
    return new Promise(resolve => {
        var canvas = document.createElement('canvas');
        var context = canvas.getContext &&canvas.getContext('2d');
        var xhr = new XMLHttpRequest();
        xhr.onload = function () { //兼容IE10浏览器不支持crossOrigin
            // eslint-disable-next-line no-shadow
            var url = URL.createObjectURL(this.response);
            let img = new Image();
            img.src = url;
            img.crossOrigin = 'anonymous';
            var imgData, width, height,length;
            var rgb = { r: 0, g: 0, b: 0 };
            var count = 0;
            height = canvas.height = imageHeight || 375;
            width = canvas.width = imageWidth || 375;
            img.style.width = width + 'px';
            img.style.height = height + 'px';
            img.onload = function(){
                context.drawImage(img, 0, 0);
                imgData = context.getImageData(imageX, imageY, width, height);
                length = imgData.data.length;
                for (var i = 0; i < length; i += 4) {
                    rgb.r += imgData.data[i];
                    rgb.g += imgData.data[i + 1];
                    rgb.b += imgData.data[i + 2];
                    count++;
                }
                rgb.r = Math.floor(rgb.r / count);
                rgb.g = Math.floor(rgb.g / count);
                rgb.b = Math.floor(rgb.b / count);
                URL.revokeObjectURL(url);
                resolve(rgb)
            }
        }
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.send();
    })
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

/**
  * 滚动条是否触底
  * @param scrollDocument 滚动DOM对象
  */
export function reachScrollBottom(scrollDocument){
    let scrollHeight = 0;
    let scrollTop = 0;
    let clientHeight = 0;
    if (scrollDocument instanceof Document){
        scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
        scrollTop = document.documentElement.scrollTop || document.body.scrollTop; //兼容个不同浏览器的滚动距离
        clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
    } else {
        scrollHeight = scrollDocument.scrollHeight;
        scrollTop = scrollDocument.scrollTop;
        clientHeight = scrollDocument.clientHeight;
    }
    return scrollHeight - (scrollTop + clientHeight) < 1
}

/**
  * 判断当前苹果手机类型(后期可补充)
  * @param iphoneType:苹果机型
  */
export function ifIphoneSeries(iphoneType){
    const iphoneSeriesInfo = {
        iphone6:{
            width:375,// 屏幕宽度
            height:667,// 屏幕高度
            devicePixelRatio:2 // 设备像素比
        },
        iphone6Plus:{
            width:414,
            height:736,
            devicePixelRatio:3
        }
    };
    let result = false; // 判断结果
    if (iphoneSeriesInfo[iphoneType] && checkTypeResult(iphoneSeriesInfo[iphoneType])){
        result = true;
    }

    return result;

    function checkTypeResult(typeInfo){
        const { width,height,devicePixelRatio } = typeInfo;
        return /iphone/gi.test(window.navigator.userAgent) &&
        window.devicePixelRatio &&
        window.devicePixelRatio === devicePixelRatio &&
        window.screen.width === width &&
        window.screen.height === height;
    }
}

/***
 * 初始化用户的相关信息
 * @param key:需要获取的信息
 */
export function getAppInfo(key){
    return new Promise(resolve => {
        sinosdk.sino.getAppInfo({key}).then(function(res){
            if (!!res.value){ 
                resolve(res.value)
            } else {
                resolve(null)
            }
        }).catch(()=>{
            resolve(null)
        })
    })
}

/**
 * 计算一个元素距离上边缘的offsetTop
 * tips: offsetTop计算的是当前元素距离父元素顶部的高度，多层嵌套则需要递归叠加offsetTop
 * @param {*} target 需要计算offsetTop的元素
 * @param {*} topEdge 指定的祖先元素
 * @returns target与topEdge之间的距离
 */
export function getOffsetTop(target, topEdge){
    let sumOffsetTop = (_target, sum=0) => {
        sum += _target.offsetTop
        if (_target.offsetParent === topEdge){
            return sum
        }
        return sumOffsetTop(_target.offsetParent, sum)
    }
    return sumOffsetTop(target)
}
/**
 * 获取最大面额的优惠券
 * @param {*} list 优惠券数据
 * @returns array
 */
export function getMaxCouponList(list){
    let maxCouponItem = {};
    let maxCoupon = 0;
    list.forEach(item => {
        if (item.publishValue > maxCoupon) {
            maxCoupon = item.publishValue;
            maxCouponItem = item;
        }
    });
    if (maxCouponItem.couponContent === '无门槛') {
        return [`无门槛${maxCoupon}元`]
    } 
    if(maxCouponItem.couponType==3){
        return maxCouponItem.couponContent ? [`${maxCouponItem.couponContent}`] :[]
    }
    return maxCouponItem.couponContent ? [`${maxCouponItem.couponContent}元`] :[]
}

/**
 * 获取满优惠最大额度
 * @param {*} list 满优惠数据
 * @returns array
 */
export function getMaxFullPreferentialList(list) {
    let promotionArr = [];
    list.forEach(item => {
        item.extendInfoList.forEach(childItem => {
            promotionArr.push(childItem.promotionDescription);
        })
    });
    let maxQuota = 0;
    let condition = 0;
    promotionArr.forEach(item => {
        const firstLeftBrackets = item.indexOf('<');
        const firstRightBrackets = item.indexOf('>');
        const lastLeftBrackets = item.lastIndexOf('<');
        const lastRightBrackets = item.lastIndexOf('>');
        let quota = parseFloat(item.substring(lastLeftBrackets + 1, lastRightBrackets));
        if (quota > maxQuota) {
            maxQuota = quota;
            condition = parseFloat(item.substring(firstLeftBrackets + 1, firstRightBrackets));
        }
    })
    if (maxQuota === 0 || condition ===0){
        return []
    }
    return [`满${condition}减${maxQuota}元`]
}

/**
 * 将参数放到url上
 */
export function setUserParamOnUrl(data){
    try {
        let hash = isNotEmpty(location.hash) ? location.hash : '#/';
        let search = isNotEmpty(location.search) ? location.search.substring(1) : ''
        if (isNotEmpty(search)){
            hash += (hash.indexOf('?') > -1 ? '&' : '?') + search
        }
        hash = updateStableParams(hash, data)
        //更新url参数
        history.replaceState(window.history.state, '', location.origin + location.pathname + hash);
    } catch (e) {
        console.error('setUserParamOnUrl error!', e)
    }
}

/**
 * 更新url上的参数
 * @param {*} url 字符串中只能含有一个?。如果有2个?, 业务侧自己处理成1个再调用本方法
 * @param {*} data 待更新的参数
 * @returns 
 */
export function updateStableParams(url, data){
    if (isEmpty(url) || isEmpty(data)){
        return url;
    }
    try {
        //删除最后一个/
        if (url.endsWith('/')){
            url = url.substring(0, url.length - 1)
        }
        let arr = url.split('?')
        let oldParamArr = []
        if (arr.length > 1){
            oldParamArr = arr[1].split('&');
        }
        let entries = oldParamArr.map(kv => {
            let kvArr = kv.split('=');
            return [[kvArr[0]], kvArr.length > 1 ? kvArr[1] : '']
        })
        let oldParaObj = Object.fromEntries(entries)
        Object.keys(data).forEach(key => {
            oldParaObj[key] = data[key];
        })
        arr[0] = arr[0] == '#' ? '#/' : arr[0];
        return arr[0] + '?' + Object.entries(oldParaObj).map(entry => `${entry[0]}=${entry[1]}`).join('&')
    } catch (e){
        console.error(e);
        return url
    }
}


/**
 * 解析url上的查询字符串
 */
export function parseSearch(){
    // 取得没有开头问号的查询字符串
    let qs = (location.search.length > 0 ? location.search.substring(1) : "")
    let args = {}
     
    const qsArr = qs.split("&").map((item)=>item.split("="))
    qsArr.forEach(el=>{
        let name = decodeURIComponent(el[0])
        let value = decodeURIComponent(el[1])
        args[name] = value
    })
    return args;
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

export function handleBpParam(context) {
    let param = {}
    let paramStr = context.$Route.query[config.BP_PARAM]
    if (paramStr && getBpParam(paramStr)) {
        param = getBpParam(paramStr)
    }
    return param
}

// 解密bp-param
export function getBpParam(data) {
    return config.getBpParam(data)
}

// 加密bp-param
export function setBpParam(data) {
    return config.setBpParam(data)
}

// 处理分享的url
export function setShareUrl(url,channelId) {
    let callBackUrl = ''
    if (url.indexOf(config.BP_PARAM+'=') === -1 && channelId) {
        let bpparam = {
            channelId:channelId
        }
        if (url.indexOf('?') === -1) {  
            callBackUrl = url + '?' + config.BP_PARAM+'=' + setBpParam(bpparam)
        } else {
            callBackUrl = url + '&' + config.BP_PARAM+'=' + setBpParam(bpparam)
        }
    }
    return callBackUrl
}

// 是否是安卓手机
export function isAndroid(){
    let u = window.navigator.userAgent;
    return u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
}

// 是否是稠州银行cobank容器安卓手机并且有bpParam
export function isSpecialChouzhou(){
    let u = window.navigator.userAgent;
    let chouzhouUa = 'cobank'
    let isChouzhouBank = u.toUpperCase().indexOf(chouzhouUa.toUpperCase()) > -1;
    let bpParam = SnUtils.getUserPara('bp-param');
    let isBpparam = isNotEmpty(bpParam);
    let isAnd = isAndroid();
    return isAnd && isChouzhouBank && isBpparam;
}

/**
 * 重置title
 */
export function resetTileText(){
    if(sinosdk.sino.getPlatform()==sinosdk.sino.constant.RUN_ENV.WEBOA && uni.getStorageSync('weboa_topic_title')){
        document.title = uni.getStorageSync('weboa_topic_title')
    }
}