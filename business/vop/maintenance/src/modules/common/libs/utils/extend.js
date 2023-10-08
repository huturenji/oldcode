/*
 功能：扩展方法，公共方法
author：yangguang
date：2016年12月15日
 */
import Vue from 'vue';

/*******************************原生方法 prototype start*****************************************/
/**
 * 时间格式化
 * @param {Object} fmt
 */
Date.prototype.format = function (fmt) {
    var showDayArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "E+": showDayArr[this.getDay()], //周
        "D+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/i.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

/**
 * 数组是否包含元素
 * @param {Object} ele
 */
Array.prototype.contains = function (ele) {
    for (var i in this) {
        if (this[i] == ele) { return true; }
    }
    return false;
}

/**
 * 字符串全部替换
 * @param {Object} s1
 * @param {Object} s2
 */
String.prototype.replaceAll = function (s1, s2) {
    return this.replace(new RegExp(s1, "gm"), s2); //g全局   
}

/**
 * 判断两个字符串是否相等（不区分大小写）
 * @param {Object} s1
 * @param {Object} s2
 */
String.prototype.compare = function (str) {
    //不区分大小写
    if (this.toLowerCase() == str.toLowerCase()) {
        return true; // 正确
    } 
    return false; // 错误

}
/*******************************原生方法 end*****************************************/

/******************************自定义方法 start**************************************/
/**
 * 根据key获取cookie的值
 * @param {Object} key
 */
export function getCookie(key) {
    if (!!getStorage(key)) {
        if ("travel_userCoInf" == key) {
            return decodeURI(getStorage(key));
        } 
        return getStorage(key);

    }
    var str = document.cookie; // 获取Cookie字符串     
    if (!str || str.indexOf(key + "=") < 0) // 寻找name=     
    { return; }
    var cookies = str.split("; "); // 用;将所有的Cookie分隔开     
    for (var i = 0; i < cookies.length; i++) {
        // 遍历每个Cookie     
        var cookie = cookies[i]; // 当前Cookie     
        if (cookie.indexOf(key + "=") == 0) {
            // 如果名字为name     
            var value = cookie.substring(key.length + 1); // 获取value     
            return decodeURI(value); // 将value解码，并返回     
        }
    }
}

/**
 * 设置cookie
 * @param {Object} key      key
 * @param {Object} value       值
 * @param {Object} expiredays  失效时间
 */
export function setCookie(key, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = key + "=" + encodeURI(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString() + ";path=/");
}

/**
 * 删除cookie
 * @param {Object} key
 */
function delCookie(key) {
    var curVal = getCookie(key);
    var exp = new Date();
    exp.setTime(exp.getTime() - 10);
    if (null != curVal) {
        document.cookie = key + '=' + encodeURI(curVal) + ';expires=' + exp.toGMTString();
    }
}
/**
 * 设置storage
 * @param {Object} key
 * @param {Object} value
 */
export function setStorage(key, value) {
    if (window.localStorage) {
        var storage = window.localStorage;
        storage.setItem(key, value);
    } else {
        setCookie(key, value, cacheExpiredays);
    }
}

/**
 * 获取storage
 * @param {Object} key
 */
export function getStorage(key) {
    if (window.localStorage) {
        var storage = window.localStorage;
        if ("undefined" != typeof (storage.getItem(key)) && null != storage.getItem(key) && "" != storage.getItem(key)) {
            return storage.getItem(key);
        } 
        return "";

    } 
    getCookie(key);

}
/**
 * 删除storage
 * @param {Object} key
 */
export function deleteStorage(key) {
    if (window.localStorage) {
        localStorage.removeItem(key);
    } else {
        delCookie(key);
    }

}

/**
 * 设置sessionStorage
 * @param {Object} key
 * @param {Object} value
 */
export function setSessionStorage(key, value) {
    if (window.sessionStorage) {
        var storage = window.sessionStorage;
        if (!storage.getItem(key)) {
            storage.setItem(key, value);
        }
    }
}

/**
 * 获取sessionStorage
 * @param {Object} key
 */
export function getSessionStorage(key) {
    if (window.sessionStorage) {
        var storage = window.sessionStorage;
        if ("undefined" != typeof (storage.getItem(key)) && null != storage.getItem(key) && "" != storage.getItem(key)) {
            return storage.getItem(key);
        } 
        return "";

    }
}
/**
 * 获取当前url的参数 
 */
export function getUrlParams() {
    var url = window.location.href;
    var regexP = /[^#&\?]+=[^#&\?]*/ig, res = {};
    var ms = url.match(regexP);
    if (ms) {
        for (var i = 0; i < ms.length; i++) {
            var arr = ms[i].split('=');
            res[arr[0]] = decodeURI(arr[1]);
        }
    }
    return res;
}

/**
 * 获取当前函数的节流函数(就是在xx毫秒内只能触发一次func)
 * 
 * @param {any} func 
 * @param {any} context func的上下文环境
 */
export function throttle(func, context) {
    if (throttle.ready) {
        throttle.ready = false;
        func.call(context);
        window.setTimeout(function () {
            throttle.ready = true;
        }, 1000);
    }
}
throttle.ready = true;

/**
 * 给数字num前面补零，不足length的前面补length-num.length个零，超过length的前面截取
 * @param {Object} num
 * @param {Object} length
 */
export function prefixInteger(num, length) {
    var nums = (num + '').replace(/d/g, '');
    return (Array(length).join('0') + nums).slice(-length);
}


//数组补位
export function pad(num, n) {
    var len = num.toString().length;
    while (len < n) {
        num = "0" + num;
        len++;
    }
    return num;
}
/**
 * 插入特定位置的字符串
 * @param str 原字符串
 * @param flg 插入字符
 * @param sn  插入位置
 * @returns {String}
 */
export function insert_flg(str, flg, sn) {
    var newstr = "";

    if (3 > str.length) { //如果sn为负数
        str = pad(str, 3);
        sn = 1;
    }

    var arr = str.split("");

    for (var i = 0; i < arr.length; i++) {
        if (i == sn) {
            newstr += flg;
        }
        newstr += arr[i];
    }

    return newstr;
}

/**
 * 字符串整数相加
 * @param {Object} a
 * @param {Object} b
 */
export function sumStrings(a, b) {
    a = a || '';
    b = b || '';
    a = a + "";
    b = b + "";
    var res = '', c = 0;
    a = a.split('');
    b = b.split('');
    while (a.length || b.length || c) {
        c += ~~a.pop() + ~~b.pop();
        res = c % 10 + res;
        c = c > 9;
    }
    return res.replace(/^0+/, '');
}


/**
 * 字符串相减  返回两个数的绝对值
 * @param {Object} a
 * @param {Object} b
 */
export function minusString(a, b) { //先判断a与b的大小
    var negativeFlag = false;//负数标识
    a = a || '';
    b = b || '';
    a = a + "";
    b = b + "";
    var res = '', c = 0, temp = '';
    if (a.length < b.length) { //比较a与b的大小，如果a小于b则对调
        negativeFlag = true;
    } else if (a.length == b.length) {
        var a1 = a.split('');
        var b1 = b.split('');
        while (a1.length) {
            var a2 = ~~a1.shift();
            var b2 = ~~b1.shift();
            if (a2 > b2) {
                break;
            } else if (a2 < b2) {
                negativeFlag = true;
                break;
            }
        }
    }
    if (negativeFlag) {
        temp = a;
        a = b;
        b = temp;
    }
    a = a.split('');
    b = b.split('');
    while (a.length || b.length) {
        c += ~~a.pop() - ~~b.pop() + 10;
        res = c % 10 + res;
        c = c > 9 ? 0 : -1;
    }
    return res.replace(/^0+/, '');
}
/**
 * 格式化数据   100-->1.00元   
 * @param {Object} ms
 */
export function moneyStringFixTwo(ms) {
    var moneyDis = "";
    ms = ms + "";
    ms = ms.replace(/[^\d]/g, '');
    if (ms.length < 3) { //小数
        ms = pad(ms, 3);
    }
    moneyDis = insert_flg(ms, ".", (ms.length - 2));
    var l = moneyDis.split(".")[0].split("").reverse(),
        r = moneyDis.split(".")[1],
        t = "";
    for (var i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }
    var moneyDisBig = t.split("").reverse().join("") + "." + r + "元";
    return moneyDisBig;
}

/**
 * 字符串加上小数点，保留两位小数，增加单位   
 * @param {Object} ms
 * @param {Object} type -- 单位 可以传入空  （100 -> 1.00）
 */
export function stringFixTwoWithType(ms, type) {
    var moneyDis = "";
    ms = ms + "";

    //兼容历史数据开始，content中的金额可能为245.6，245.32等 
    if (ms.indexOf(".") > 0) {
        var dotnum = ms.split(".")[1];
        if (dotnum.length == 1) {
            ms = ms + "0";
        } else if (dotnum.length == 0) {
            ms = ms + "00";
        } else if (dotnum.length > 2) { //兼容历史金额数据为58129.99999999999
            var value = parseFloat(ms);
            value = (ms / 100).toFixed(2);
            ms = value + "";
        }
        ms = ms.replace(/,/g, "").replace(".", "");
    }
    //兼容历史数据结束，content中的金额可能为245.6，245.32等 
    if (ms.indexOf(".") < 0) {
        if (ms.length < 3) {
            ms = pad(ms, 3);
        }
        moneyDis = insert_flg(ms, ".", (ms.length - 2));
    }
    return moneyDis + type;
}

/**
 * 转换Arr为加上str型数据
 * @param {Object} arr 列表字段
 * @param {Object} arrJson 列表数据
 * @param {Object} str  插入字符串
 */
export function transArrToStr(arr, arrJson, str) {
    var result = "";
    if (0 > arr.length) {
        return result;
    }
    arr.forEach(function (i) {
        result += "${" + (arrJson[i] || '0') + "}" + str;
    });

    if (0 < result.length) {
        result = result.substr(0, result.length - 1);
    }
    return result;
}

/**
 * 金额转大写 传入不带小数点的正整数   至少三位
 * @param {Object} num
 */
export function moneyUppercase(num) {
    var Num = num + "";
    Num = insert_flg(Num, ".", (Num.length - 2));
    var part = Num.split(".");
    var newchar = "";
    var perchar = "";
    var tmpnewchar = "";
    for (var i = part[0].length - 1; i >= 0; i--) {
        if (part[0].length > 20) { tipsBox("数字过大，无法计算"); return ""; }
        tmpnewchar = "";
        perchar = part[0].charAt(i);
        switch (perchar) {
        case "0": tmpnewchar = "零" + tmpnewchar; break;
        case "1": tmpnewchar = "壹" + tmpnewchar; break;
        case "2": tmpnewchar = "贰" + tmpnewchar; break;
        case "3": tmpnewchar = "叁" + tmpnewchar; break;
        case "4": tmpnewchar = "肆" + tmpnewchar; break;
        case "5": tmpnewchar = "伍" + tmpnewchar; break;
        case "6": tmpnewchar = "陆" + tmpnewchar; break;
        case "7": tmpnewchar = "柒" + tmpnewchar; break;
        case "8": tmpnewchar = "捌" + tmpnewchar; break;
        case "9": tmpnewchar = "玖" + tmpnewchar; break;
        // no default
        }
        switch ((part[0].length - i - 1) % 8) {
        case 0:
            switch ((part[0].length - i - 1) / 8) {
            case 0:
                tmpnewchar = tmpnewchar + "元";
                break;
            case 1:
                tmpnewchar = tmpnewchar + "亿";
                break;
            default:
                break;
            }

            break;
        case 1: if (perchar != 0) { tmpnewchar = tmpnewchar + "拾"; } break;
        case 2: if (perchar != 0) { tmpnewchar = tmpnewchar + "佰"; } break;
        case 3: if (perchar != 0) { tmpnewchar = tmpnewchar + "仟"; } break;
        case 4: if (part[0].substr(0, 4) > 0) { tmpnewchar = tmpnewchar + "万"; } break;
        case 5: if (perchar != 0) { tmpnewchar = tmpnewchar + "拾"; } break;
        case 6: if (perchar != 0) { tmpnewchar = tmpnewchar + "佰"; } break;
        case 7: if (perchar != 0) { tmpnewchar = tmpnewchar + "仟"; } break;
        // no default
        }
        newchar = tmpnewchar + newchar;
    }
    if (Num.indexOf(".") != -1) {
        if (part[1].length > 2) {
            part[1] = part[1].substr(0, 2)
        }
        for (var ind = 0; ind < part[1].length; ind++) {
            tmpnewchar = "";
            perchar = part[1].charAt(ind)
            switch (perchar) {
            case "0": tmpnewchar = "零" + tmpnewchar; break;
            case "1": tmpnewchar = "壹" + tmpnewchar; break;
            case "2": tmpnewchar = "贰" + tmpnewchar; break;
            case "3": tmpnewchar = "叁" + tmpnewchar; break;
            case "4": tmpnewchar = "肆" + tmpnewchar; break;
            case "5": tmpnewchar = "伍" + tmpnewchar; break;
            case "6": tmpnewchar = "陆" + tmpnewchar; break;
            case "7": tmpnewchar = "柒" + tmpnewchar; break;
            case "8": tmpnewchar = "捌" + tmpnewchar; break;
            case "9": tmpnewchar = "玖" + tmpnewchar; break;
            // no default
            }
            if (ind == 0) { tmpnewchar = tmpnewchar + "角"; }
            if (ind == 1) { tmpnewchar = tmpnewchar + "分"; }
            newchar = newchar + tmpnewchar;
        }
    }
    while (newchar.search("零零") != -1) {
        newchar = newchar.replace("零零", "零");
    }
    newchar = newchar.replace("零亿", "亿");
    newchar = newchar.replaceAll("零万", "万");
    newchar = newchar.replace("亿万", "亿");
    newchar = newchar.replace("零元", "元");
    newchar = newchar.replace("零角", "");
    newchar = newchar.replace("零分", "");
    if (newchar == "") {
        newchar = "零元";
    }
    if (newchar.charAt(newchar.length - 1) == "元") {
        newchar = newchar + "整";
    }
    if (newchar.charAt(newchar.length - 1) == "拾" || newchar.charAt(newchar.length - 1) == "佰" || newchar.charAt(newchar.length - 1) == "仟" || newchar.charAt(newchar.length - 1) == "万") {
        newchar = newchar + "元整";
    }
    if (newchar == "元整") {
        newchar = "零元";
    }
    if (newchar.substring(0, 1) == "元") {
        newchar = newchar.substring(1, newchar.length);
    }
    return newchar;
}

/**
 * 判断对象是否为空，为空返回true，否则返回false
 * @param {Object} e
 */
/* eslint-disable */
export function isEmptyObject(e) {
    for (var t in e) {
        return !1;
    }
    return !0
}
/* eslint-enable */
/**
 * 判断a与b是否相等 暂时用来比较对象，后续需要扩展为比较任意对象
 * @param {Object} x
 * @param {Object} y
 */
export function isEqual(x, y) {
    if (x === y) {
        return true;
    }

    // If they are not strictly equal, they both need to be Objects 
    if (!(x instanceof Object) || !(y instanceof Object)) {
        return false;
    }

    //They must have the exact same prototype chain,the closest we can do is
    //test the constructor. 
    if (x.constructor !== y.constructor) {
        return false;
    }

    for (var p in x) {
        //Inherited properties were tested using x.constructor === y.constructor
        
        if (Object.prototype.hasOwnProperty.call(x, p)) {
            // Allows comparing x[ p ] and y[ p ] when set to undefined 
            if (!Object.prototype.hasOwnProperty.call(y, p)) {
                return false;
            }

            // If they have the same strict value or identity then they are equal 
            if (x[p] === y[p]) {
                continue;
            }

            // Numbers, Strings, Functions, Booleans must be strictly equal 
            if (typeof (x[p]) !== "object") {
                return false;
            }

            // Objects and Arrays must be tested recursively 
            if (!isEqual(x[p], y[p])) {
                return false;
            }
        }
    }

    for (p in y) {
        // allows x[ p ] to be set to undefined 
        if (Object.prototype.hasOwnProperty.call(y, p) && !Object.prototype.hasOwnProperty.call(x, p)) {
            return false;
        }
    }
    return true;
}
/**
 * 数据转换  utf16转utf8
 * @param {Object} str
 */
export function utf16to8(str) {
    var out, i, len, c;
    out = "";
    len = str.length;
    for (i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        } else {
            out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        }
    }
    return out;
}

/**
 * 跳转页面
 * @param {Object} url
 */
export function openPage(url) {
    CheckNetWork(function () {
        window.open(url);
    }, this);
}

/**
 * 重定向页面
 * @param {Object} url
 */
// export function locationPage(url) {
// CheckNetWork(function () {
//  window.location.href = url;
// }, this);
// }

/**
 * 返回页面
 * @param {Object} url
 */
export function goBackPage(url) {
    CheckNetWork(function () {
        goBackFunction(url);
    }, this);
}

/**
 * 检查网络状态
 * @param {Object} func   函数名
 * @param {Object} content  上下文
 */
export function CheckNetWork(func, content) {
    CheckNetWorkFunction().then(function (statusData) {
        if (statusData.contectState) {
            if (func) {
                func.call(content);
            }
        } else {
            showToast('网络连接不可用', 'middle');
        }
        return statusData;
    })
}

/**
 * 判断是否PC端
 */
export function isPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
    }
    return flag;
}


//原OA tipsbox方法
function tipsBox(tipsText, delayTime) {
    var time = 200;
    if (delayTime != undefined) {
        time = delayTime;
    }
    if ($(".tipsBox").length == 0) {
        $("body").append("<div class='tipsBox' style='display:none;position:fixed;width:100%;top:40%;left:0;text-align:center;z-index:2101'><span style='max-width:60%;margin:0 auto;display:inline-block;border-radius:5px;padding:12px 24px;font-size:16px;color:#fff;background:rgba(0,0,0,0.8);box-shadow:1px 1px 5px #b2b2b2'>" + tipsText + "</span></div>");
        $(".tipsBox").stop().delay(time).animate({ opacity: 'show' }, 0).delay(2000).animate({ opacity: 'hide' }, 350, function () { $(".tipsBox").remove() });
        $(document).on("click", ".tipsBox", function () { //点击tipsbox隐藏
            $(".tipsBox").stop().animate({ opacity: 'hide' }, 150, function () { $(".tipsBox").remove() });
        })
    }
}
/**
 * 弹框提示
 * @param {Object} tips  提示内容
 * @param {Object} type  提示类型  text-普通文本  success-提示成功  error-失败提示
 */
export function showToast(tips, position, time) {
    if (self != top) {
        tipsBox(tips, time);
    } else {
        tipsBox(tips, time);
    }

}


//success pop
function successPop(successText, delayTime) {
    var time = 200;
    if (delayTime != undefined) {
        time = delayTime;
    }
    $("body").append('<div class="sub_prompt_box"><div class="sub_prompt"><div></div><span>' + successText + '</span></div></div>');
    $(".sub_prompt_box").stop().delay(time).animate({ opacity: 'show' }, 0).delay(time).animate({ opacity: 'hide' }, 350, function () { $(".sub_prompt_box").remove() });

}

export function showSuccessPop(successText, delayTime) {
    successPop(successText, delayTime)
}


//TODO 统一使用vux控件
/**
 *
 * @param {Object} content      内容
 * @param {Object} rightFunction   右侧按钮点击事件
 * @param {Object} title        title
 * @param {Object} type         类型       1-单个按钮  2-两个按钮  3-多个按钮      默认为两个按钮
 * @param {Object} strLeftBtn   左侧按钮
 * @param {Object} strRightBtn  右侧按钮
 * @param {Object} leftFunction   左侧按钮点击事件
 * @param {Object} H5Flag       是否调用H5方法
 */
export function showConfirm(content, rightFunction, type, strLeftBtn, strRightBtn, title, leftFunction) {
    // eslint-disable-next-line no-redeclare
    var type = type || 2; //默认两个按钮  
    Vue.$vux.confirm.show({ //显示confirm弹窗   暂时屏蔽H5方法
        title: title || '',
        content: content,
        confirmText: strRightBtn,
        cancelText: strLeftBtn,
        showCancelButton: type == 2,
        onShow() {
            console.log('show')
        },
        onHide() {
            console.log('hide')
        },
        onCancel() {
            leftFunction();
        },
        onConfirm() {
            rightFunction();
        }
    });
}

/**
 * 获取类型名称
 * @param {Object} object
 * __getClass(5); // => "Number"
 * __getClass({}); // => "Object"
 * __getClass(/foo/); // => "RegExp"
 * __getClass(''); // => "String"
 * __getClass(true); // => "Boolean"
 * __getClass([]); // => "Array"
 * __getClass(undefined); // => "Window"
 * __getClass(Element); // => "Constructor"
 *
 */
export function getClass(object) {
    return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
}

/*
*  图片转base64
* */
export function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var dataURL = canvas.toDataURL("image/png");
    //return dataURL
    return dataURL.replace("data:image/png;base64,", "");

}


/**
 * 根据数组中的key获取Object中的value并且设置数组值
 * @param {Object} Arr    源数组
 * @param {Object} Object 有数据的对象
 */
export function genArrValueByKey(Arr, Object) {
    var res = JSON.parse(JSON.stringify(Arr));
    res.map(function (item) {
        if ('money' == item.type && Object[item.value]) { //金额
            return item.value = moneyStringFixTwo(Object[item.value]);
        } else if ('date' == item.type && Object[item.value]) { //日期
            return item.value = new Date(Object[item.value] * 1000).format(item.frt);
        } else if (Object[item.value]) { //content内容里面的数据
            return item.value = Object[item.value];
        }
        return item
    });
    return res;
}

/**
 * 数组合并并去重
 * @param {Object} ele
 */
export function delRepeat(arr1, arr2) {
    var arr = arr1.concat(arr2);
    var lastArr = [];
    for (var i = 0; i < arr.length; i++) {
        if (!unique(arr[i], lastArr)) {
            lastArr.push(arr[i]);
        }
    }
    return lastArr;
}
function unique(n, arr) {
    for (var i = 0; i < arr.length; i++) {
        if (n == arr[i]) {
            return true;
        }
    }
    return false;
}


/**
 * 获取字符串字节数
 * @param {Object} str 
 * @return {Object} realLength
 */
export function getBLength(str) {
    var realLength = 0;
    var len = str.length;
    var charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) {
            realLength += 1;
        } else {
            realLength += 2;
        }
    }
    return realLength;
}
/**
 * 邮箱的规则验证 （onblur）
 * @param {} ele
 */
export function checkEmail(value) {
    if (!!value && value != "") {
        //邮箱规则  
        var websiteCheck = /(^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$)|(^$)/.test(value);
        if (!websiteCheck) {
            return false;
        }
    }
    return true;
}
/**
 * 网址的规则验证 （onblur）
 * @param {} ele
 */
export function checkWebsite(value) {
    if (!!value && value != "") {
        var reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;
        if (!reg.test(value)) {
            return false;
        }
    }
    return true;
}


/******************************自定义方法 end**************************************/


/***************************VUE过滤器 start**************************************/


/**
 * 对时间格式的转换
 */
Vue.filter('dateFrt', function (value, formatDate) {
    var text = '';
    if (formatDate.serverFormat == 'timestamp') {
        var dateVelue = Number(value);
        if (isNaN(dateVelue)) {
            text = value;//兼容差旅二级明细中的历史数据是字符串“2017/12/25”的问题
        } else {
            text = new Date(dateVelue * 1000).format(formatDate.format);
        }
    } else if (formatDate.serverFormat == 'YYYYMMDD') {
        var dataStr = value.substring(0, 4) + '-' + value.substring(4, 6) + '-' + value.substring(6, 8);
        text = new Date(dataStr).format(formatDate.format);
    } else {
        var dateVelues = Number(value);
        if (isNaN(dateVelues)) {
            text = value;//兼容差旅二级明细中的历史数据是字符串“2017/12/25”的问题
        } else {
            text = new Date(dateVelues * 1000).format(formatDate);
        }
    }
    return text;
});
/**
 * 计算字符串的真实长度汉字1，字符0.5，向上取整
 * str  传入的字符串
 */
Vue.filter('strTrueLength', function (str) {
    var re = /[\u4E00-\u9FA5]/g; //中文字符的正则
    var tempL = str.length;
    var tempCL = 0;
    if ('' == str.match(re) || null == str.match(re)) {
        tempCL = 0;
    } else {
        tempCL = str.match(re).length;
    }
    var tempTL = Math.ceil((tempL - tempCL) * 0.5 + tempCL)
    return tempTL;//返回字符串真实长度汉字1，字符0.5，向上取整
});


