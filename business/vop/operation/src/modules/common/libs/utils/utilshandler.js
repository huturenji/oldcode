/**
 * 项目中不允许直接调用libs的对象。必须通过utilsHandler来引用，主要是上面import的对象
 * 项目的工具方法类，包含项目中用到的所有的业务相关的方法
 */

import {
    getInvoiceApplyArr,
    getInvoiceTypeArr,
    getInvoiceStatusAllArr
} from "./projectconstant";
class utilshandler {
    /**
   * 重定向页面
   * @param {*} address
   */
    relocationPage(address) {
        if (self != top) {
            window.parent.location.href = address;
        } else {
            location.href = address;
        }
    }

    /**
   * 检验URL，从服务器拿过来的规则
   */
    isValidUrl(url) {
        var patrn = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+).)+([A-Za-z0-9-~\\/])+$/;
        if (!patrn.exec(url)) {
            return false;
        } 
        return true;
    
    }

    /**
   * 检验非法文件名
   */
    isIllegalName(name){
        let patrn = /[@+#%]/im;
        return patrn.test(name);
    }

    /**
   * 检验email是否有效
   */
    isVaildEmail(source) {
        var reg = /^\w+([-\.]\w+)*@\w+([\.-]\w+)*\.\w{2,4}$/;
        return reg.test(source);
    }

    /**
   * 是否是有效的名字，汉字 英文 数字 _-/
   * @param {*} input
   */
    isVailidName(input) {
        var reg = /^[\w\u4e00-\u9fa5\-\/]+$/;
        return reg.test(input);
    }

    /**
   * 是否是自然数
   * @param {*} input
   */
    isPositiveInteger(input) {
        var reg = /^\+?[1-9]\d*$/;
        return reg.test(input);
    }

    /**
   * 是否是自然数
   * @param {*} input
   */
    isNaturalNumber(input) {
        var reg = /^[0-9]*$/;
        return reg.test(input);
    }

    /**
   * 是否是url
   * @param {*} input
   */
    isVailidUrl(input) {
        var reg = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
        return reg.test(input);
    }

    /**
   * 页面数据显示默认还是数据
   * @value 要显示的
   * @empty 默认显示
   * @return {*}
   */
    showValueOrDeault(value, empty = "---") {
        if (value == 0) {
            //数值0
            if (isNaN(parseInt(value))) {
                return empty;
            } 
            return value;
      
        } else if (!!value) {
            return value;
        } 
        return empty;
    
    }

    /**
   * JS的实现下载文件功能。这个不会让浏览器弹出数据框
   * @param url 下载地址，也可以是一个blob对象，必选
   * @param saveName 保存文件名，可选
   */
    downloadFileSameOrigin(url, saveName) {
        if (typeof url == "object" && url instanceof Blob) {
            url = URL.createObjectURL(url); // 创建blob地址
        }
        var aLink = document.createElement("a");
        aLink.href = url;
        aLink.download = saveName || ""; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效

        var event;
        if (window.MouseEvent) {
            event = new MouseEvent("click");
        } else {
            event = document.createEvent("MouseEvents");
            event.initMouseEvent(
                "click",
                true,
                false,
                window,
                0,
                0,
                0,
                0,
                0,
                false,
                false,
                false,
                false,
                0,
                null
            );
        }
        aLink.dispatchEvent(event);
    }

    /**
   * JS的实现下载文件功能。这个不会让浏览器弹出数据框, 本方法解决了跨域地址不能设置名字的问题
   * @param url 下载地址，也可以是一个blob对象，必选
   * @param fileName 保存文件名，可选
   */
    downloadFile(url, fileName) {
        var x = new XMLHttpRequest();
        x.open("GET", url, true);
        x.responseType = "blob";
        x.onload = function() {
            var urls = window.URL.createObjectURL(x.response);
            var a = document.createElement("a");
            a.href = urls;
            a.download = fileName;
            a.click();
        };
        x.send();
    }

    /**
   * iview的级联选择组件，需要将源数据转换成组件指定的结构。
   * @param {*} sData 源数据
   * @param {*} isDir 是否目录
   */
    getCascaderList(sData, isDir = true) {
        let resultArray = [];
        for (let i = 0; i < sData.length; i++) {
            let key = sData[i].companyId || sData[i].channelId;
            let value = sData[i].companyName || sData[i].channelName;
            if (!key || !value) {
                continue;
            }

            let item = {
                value: key,
                label: value
            };
            if (isDir) {
                item.loading = false;
                item.children = [];
            }
            resultArray.push(item);
        }
        return resultArray;
    }

    /**
   * 对一个数组去重，得到满足条件的非重复的数组
   * @param {*} array 要去重复的原数组
   * @param {*} isUniq 去重判断标准方法
   */
    uniqArray(array, isUniq) {
        var temp = [];
        var index = [];
        var l = array.length;
        for (var i = 0; i < l; i++) {
            for (var j = i + 1; j < l; j++) {
                if (isUniq(array[i], array[j])) {
                    i++;
                    j = i;
                }
            }
            temp.push(array[i]);
            index.push(i);
        }
        return temp;
    }

    /**
   * 由日期 2018-11-21 格式获取 星期几 周几
   * @param {*} day  格式化的日期
   *  @param {*} type 1返回 星期几 2返回周几
   */
    getChinaWeekDay(day, type = 1) {
        var weekArray = ["日", "一", "二", "三", "四", "五", "六"];
        let num = new Date(day).getDay();
        return (type == 1 ? "星期" : "周") + weekArray[num];
    }

    /**
   * 因为1970年1月1 是周4   所以（天数+4）/7 取整 就是周数  如果相同就是同一周反之就不是
   * 经过测试,是以星期一作为每周的第一天的
   */
    isSameWeek(old, now) {
        var oneDayTime = 1000 * 60 * 60 * 24;
        var old_count = parseInt(old.getTime() / oneDayTime);
        var now_other = parseInt(now.getTime() / oneDayTime);
        return parseInt((old_count + 4) / 7) == parseInt((now_other + 4) / 7);
    }

    isSameMonth(start, end) {
        return (
            new Date(start).getFullYear() == new Date(end).getFullYear() &&
      new Date(start).getMonth() == new Date(end).getMonth()
        );
    }

    /**
   *
   */
    replaceLoginUrl() {
    //为了keycolak重定向之后，URL的纯洁性，登录成功后，手动将URL修改成vue路径页面，去掉keycolak的登录参数。
    //区分标记位是 redirectUriTag的变量?tag=1
        if (location.href.indexOf("?tag=1") != -1) {
            window.history.replaceState(
                window.history.state,
                null,
                location.href.substring(0, location.href.indexOf("?tag=1"))
            );
        }
    }

    /**
   * 分页的数量设置
   * @returns
   *
   */
    getPageSizeOpts() {
        return [5, 10, 20, 50, 100];
    }
    /**
   * 数组去重
   * @param {JSONObject} arr
   * @param {String} key
   */

    removedDuplicate(arr, keys) {
        let obj = {};
        arr = arr.reduce(function(item, next) {
            // eslint-disable-next-line no-unused-expressions
            obj[next[keys]] ? "" : (obj[next[keys]] = true && item.push(next));
            return item;
        }, []);
        return arr;
    }

    /**
   * 过滤两个数组的相同项
   * @param {*} allArr
   * @param {*} CheckArr
   */
    filterCommonData(allArr, CheckArr) {
        let arr = [];
        arr = allArr.filter((user) => {
            return CheckArr.includes(user.userId);
        });
        return arr;
    }

    // 返回两个数组不同
    getArrEqual(arr1, arr2) {
        let newArr = [];
        for (let i = 0; i < arr2.length; i++) {
            for (let j = 0; j < arr1.length; j++) {
                if (arr1[j] === arr2[i]) {
                    newArr.push(arr1[j]);
                }
            }
        }
        return newArr;
    }

    /**
   * 格式化金钱
   * @param {Number} num
   * ThousandNum(20190214) => "20,190,214"
   */
    ThousandNum(num) {
        return num == 0
            ? "0"
            : !!num && num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // 用户输入实时校验
    verifiNum(value) {
        let resultValue = value;
        if (resultValue !== "" && resultValue !== 0) {
            if (resultValue.indexOf(".") == 0) {
                resultValue = 0 + resultValue;
            }
            resultValue = resultValue.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符
            resultValue = resultValue.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
            resultValue = resultValue
                .replace(".", "$#$")
                .replace(/\./g, "")
                .replace("$#$", ".");
            resultValue = resultValue.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); //只能输入两个小数
        }
        return resultValue;
    }

    // 失去焦点之后校验
    blurVerificationNum(value) {
        let resultValue = value;
        if (resultValue == "" || !Number(resultValue)) {
            resultValue = "0";
        }
        if (resultValue.indexOf(".") < 0 && resultValue != "") {
            //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
            if (resultValue.indexOf("0") == 0 && resultValue.length > 1) {
                resultValue = resultValue.substr(1);
            }
        }
        let pront = resultValue.indexOf(".");
        if (!resultValue[pront + 1]) {
            resultValue = resultValue.substring(0, resultValue.length - 1);
        }
        return resultValue;
    }

    /**
   * 按照指定格式格式化时间
   * @param {String} formater 要格式的格式
   * @param {Date} t 要格式的时间，如果不传默认格式化当前时间
   * @param {Boolean} isDecimal  是否是十位
   * dateFormater('YYYYMMDD') ==> 20200306
   *  dateFormater('YYMMDD') ==> "200306"
   */
    dateFormater(formater, t, isDecimal = true) {
        let date = !isDecimal
                ? t
                    ? new Date(t)
                    : new Date()
                : t
                    ? new Date(t * 1000)
                    : new Date(),
            Y = date.getFullYear() + "",
            M = date.getMonth() + 1,
            D = date.getDate(),
            H = date.getHours(),
            m = date.getMinutes(),
            s = date.getSeconds();
        return formater
            .replace(/YYYY|yyyy/g, Y)
            .replace(/YY|yy/g, Y.substr(2, 2))
            .replace(/MM/g, (M < 10 ? "0" : "") + M)
            .replace(/DD/g, (D < 10 ? "0" : "") + D)
            .replace(/HH|hh/g, (H < 10 ? "0" : "") + H)
            .replace(/mm/g, (m < 10 ? "0" : "") + m)
            .replace(/ss/g, (s < 10 ? "0" : "") + s);
    }

    getInvoiceTypeStr(status) {
        let find = getInvoiceTypeArr().find((item) => {
            return item.value === status;
        });
        return (find && find.text) || "";
    }

    getInvoiceApplyStr(status) {
        let find = getInvoiceApplyArr().find((item) => {
            return item.value === status;
        });
        return (find && find.text) || "";
    }

    getInvoiceApplyColor(status) {
        let find = getInvoiceApplyArr().find((item) => {
            return item.value === status;
        });
        return (find && find.color) || "#000";
    }

    getInvoiceStatusStr(status) {
        let find = getInvoiceStatusAllArr().find((item) => {
            return item.value === status;
        });
        return (find && find.text) || "";
    }

    getInvoiceStatusArr() {
        return getInvoiceStatusAllArr().splice(2);
    }

    //将数字（整数）转为汉字，从零到一亿亿，
    convertToChinaNum(num) {
        var arr1 = new Array(
            "零",
            "一",
            "二",
            "三",
            "四",
            "五",
            "六",
            "七",
            "八",
            "九"
        );
        var arr2 = new Array(
            "",
            "十",
            "百",
            "千",
            "万",
            "十",
            "百",
            "千",
            "亿",
            "十",
            "百",
            "千",
            "万",
            "十",
            "百",
            "千",
            "亿"
        ); //可继续追加更高位转换值
        if (!num || isNaN(num)) {
            return "零";
        }
        var english = num.toString().split("");
        var result = "";
        for (var i = 0; i < english.length; i++) {
            var des_i = english.length - 1 - i; //倒序排列设值
            result = arr2[i] + result;
            var arr1_index = english[des_i];
            result = arr1[arr1_index] + result;
        }
        //将【零千、零百】换成【零】 【十零】换成【十】
        result = result.replace(/零(千|百|十)/g, "零").replace(/十零/g, "十");
        //合并中间多个零为一个零
        result = result.replace(/零+/g, "零");
        //将【零亿】换成【亿】【零万】换成【万】
        result = result.replace(/零亿/g, "亿").replace(/零万/g, "万");
        //将【亿万】换成【亿】
        result = result.replace(/亿万/g, "亿");
        //移除末尾的零
        result = result.replace(/零+$/, "");
        //将【零一十】换成【零十】
        //result = result.replace(/零一十/g, '零十');//貌似正规读法是零一十
        //将【一十】换成【十】
        result = result.replace(/^一十/g, "十");
        return result;
    }

    getUrlParams() {
        var url = window.location.href;
        var regexP = /[^#&\?]+=[^#&\?]*/gi,
            res = {};
        var ms = url.match(regexP);
        if (ms) {
            for (var i = 0; i < ms.length; i++) {
                var arr = ms[i].split("=");
                res[arr[0]] = decodeURI(arr[1]);
            }
        }
        return res;
    }

    msgFormat(res){
        let time = new Date(res * 1000);
        let { y, m, d, h, M, s } = {
            y: time.getFullYear(),
            m:
            time.getMonth() > 8
                ? time.getMonth() + 1
                : `0${time.getMonth() + 1}`,
            d: time.getDate() > 9 ? time.getDate() : `0${time.getDate()}`,
            h: time.getHours() > 9 ? time.getHours() : `0${time.getHours()}`,
            M: time.getMinutes() > 9 ? time.getMinutes() : `0${time.getMinutes()}`,
            s: time.getSeconds() > 9 ? time.getSeconds() : `0${time.getSeconds()}`

        };
        return `${y}-${m}-${d} ${h}:${M}:${s}`;    
    }

    copyToClipboard(data){
        var save = function (e){
            e.clipboardData.setData('text/plain',data);//下面会说到clipboardData对象
            e.preventDefault();//阻止默认行为
        }
        document.addEventListener('copy',save);
        document.execCommand("copy");//使文档处于可编辑状态，否则无效
        document.removeEventListener('copy',save);
    }
}

const handler = new utilshandler();

export default Object.assign(
    {},
    {
        relocationPage: handler.relocationPage,
        isValidUrl: handler.isValidUrl,
        isVaildEmail: handler.isVaildEmail,
        isVailidName: handler.isVailidName,
        isPositiveInteger: handler.isPositiveInteger,
        isNaturalNumber: handler.isNaturalNumber,
        isVailidUrl: handler.isVailidUrl,
        showValueOrDeault: handler.showValueOrDeault,
        downloadFileSameOrigin: handler.downloadFileSameOrigin,
        downloadFile: handler.downloadFile,
        getCascaderList: handler.getCascaderList,
        uniqArray: handler.uniqArray,
        getChinaWeekDay: handler.getChinaWeekDay,
        isSameWeek: handler.isSameWeek,
        isSameMonth: handler.isSameMonth,
        replaceLoginUrl: handler.replaceLoginUrl,
        getPageSizeOpts: handler.getPageSizeOpts,
        removedDuplicate: handler.removedDuplicate,
        filterCommonData: handler.filterCommonData,
        getArrEqual: handler.getArrEqual,
        ThousandNum: handler.ThousandNum,
        verifiNum: handler.verifiNum,
        blurVerificationNum: handler.blurVerificationNum,
        dateFormater: handler.dateFormater,
        getInvoiceTypeStr: handler.getInvoiceTypeStr,
        getInvoiceApplyStr: handler.getInvoiceApplyStr,
        getInvoiceApplyColor: handler.getInvoiceApplyColor,
        getInvoiceStatusStr: handler.getInvoiceStatusStr,
        getInvoiceStatusArr: handler.getInvoiceStatusArr,
        getInvoiceTypeArr: getInvoiceTypeArr,
        convertToChinaNum: handler.convertToChinaNum,
        getUrlParams: handler.getUrlParams,
        msgFormat: handler.msgFormat,
        copyToClipboard: handler.copyToClipboard,
        isIllegalName:handler.isIllegalName
    }
);
