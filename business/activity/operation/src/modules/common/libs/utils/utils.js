import {utils } from "opcl";
/**
     * 按照指定格式格式化时间
     * @param {String} formater 要格式的格式
     * @param {Date} t 要格式的时间，如果不传默认格式化当前时间
     * @param {Boolean} isDecimal  是否是十位
     * dateFormater('YYYYMMDD') ==> 20200306
     *  dateFormater('YYMMDD') ==> "200306"
     */
 export function dateFormater(formater, t, isDecimal = true) {
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

// 手机号的验证 最大数字13位（86+11位手机号）或11位手机号
export function checkMobile(mobile) {
    let regMobile = /(^1[3-9]\d{9}$)/;
    let regMobile1 = /(^861[3-9]\d{9}$)/;
    if (!mobile) {
        utils.showToast("手机号不能为空，请输入手机号！");
        return false;
    } else if (!regMobile.test(mobile) && !regMobile1.test(mobile)) {
        utils.showToast('请输入正确的手机号!');
        return false;
    } 
    return true;
}

// 密码验证，6～20位，由英文、数字和符号组成的验证
export function checkPwd(pwd,tips="密码") {
    if (pwd.length == 0){
        utils.showToast(tips+"不能为空，请输入密码！");
    } else if (pwd.length < 6 || pwd.length > 20) {
        utils.showToast('请输入6~20位的密码');
        return false;
    } else if (/[\u4E00-\u9FA5]/g.test(pwd)) {
        utils.showToast(tips+'不可以有中文～');
        return false;
    } else if (!(/^\S*$/.test(pwd))) {
        utils.showToast(tips+'中不可以有空格～');
        return false;
    }
    return true;
}

// 字符串复制
export function copyText(str){
    var input = document.createElement("input");
    input.value = str;
    input.readOnly = 'readonly';
    document.body.appendChild(input);
    input.select();
    input.setSelectionRange(0, input.value.length);
    document.execCommand('Copy');
    document.body.removeChild(input);
    utils.showToast("复制成功")
}

export function validatePass(rule, value, callback) {
    if (!value || value.length === 0 || value === '') {
        callback(new Error('密码不能为空'));
    }
    if (value.length < 6 || value.length > 20) {
        callback(new Error('请输入6~20位的密码'));
        return false;
    } else if (/[\u4E00-\u9FA5]/g.test(value)) {
        callback(new Error('密码不可以有中文～'));
        return false;
    } else if (!(/^\S*$/.test(value))) {
        callback(new Error('密码中不可以有空格～'));
        return false;
    }
    callback()
}