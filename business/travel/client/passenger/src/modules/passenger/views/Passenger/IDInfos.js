/*
 功能：证件类型相关数据
author：yg
date：2018年11月21日
 */
import Vue from 'vue';
/**
 * 证件类型Arr
 */
export const IDTypeArr = [
    {key: 0, value: '身份证'},
    {key: 1, value: '护照'},
    {key: 5, value: '台胞证（台湾居民往来大陆通行证）'},
    {key: 8, value: '外国人永久居留身份证'},
    {key: 9, value: '港澳台居民居住证'}
];
    
/**
 * 证件类型Map
 */
export const IDTypeMap = {
    0: '身份证',
    1: '护照',
    5: '台胞证',
    8: '外国人永久居留身份证',
    9: '港澳台居民居住证'
};
/**
 * 英文名显示证件类型
 */
export const surnameIDMap = {
    "1":'护照',
    "5": '台胞证',
    "8": '外国人永久居留身份证'
};
/**
 * 显示英文名
 * IDCode  证件类型
 */
export function showSurname(IDCode){
    return !!surnameIDMap[IDCode.toString()];
}

/**
 * 名称规则  0表示姓名 1表示英文（主要是护照）
 */
export const nameRuleMap = {
    '0':{
        title:'姓名填写规范',
        rdetail:'如乘客姓名中包含生僻字、繁体字或姓名过长等情况，请仔细阅读',
        desc:'1.姓名需与所持证件的姓名一致。2.姓名中间不要输入空格或其他符号。3.少数民族的乘客，若需购买火车票，需要输入姓名中的 “·” ，如“阿布都·买买提”；如需购买机票，可直接输入“阿布都买买提”。4.姓名较长，汉字超过15个或英文字母超过30个，需按照姓名中的第一个汉字或英文字母开始，按顺序连续输入15个汉字或30个英文字母。5.生僻字可用拼音代替，拼音之后不可再输入汉字，需用拼音代替。例如：“周垚飞”可输入为“周yaofei”。6.中国香港、中国台湾、中国澳门的护照不支持国内航班，请改用其他证件输入。'
    },
    '1':{
        title:'填写规范',
        rdetail:'填写信息前请仔细阅读',
        desc:'1.姓与名必须使用英文字母填写，请确保与所持证件一致。2.姓与名总长度需小于等于24个字符，如超过长度，请先联系航司确认缩写信息后填写。3.护照姓名中如有Middle name，请填写到Given name栏中，姓名中如含有特殊符号".  -" 等时，无需录入特殊符号。4.部分航司可能有特殊要求，如有疑问请联系 航司。'
    }
}
//除了护照之外的其他证件类型均使用身份证姓名格式，后续可能有修改，所以使用map相等来处理
nameRuleMap['5'] = nameRuleMap['8'] = nameRuleMap['1'];
nameRuleMap['9'] = nameRuleMap['0'];

/**
 * 证件样例规则
 */
export const IDRuleMap = {
    '4':{
        title:'港澳通行证实例',img:require('./img/IDRule/4.png')
    },
    '5':{
        title:'台胞证实例',img:require('./img/IDRule/5.png')
    },
    '6':{
        title:'台湾通行证实例',img:require('./img/IDRule/6.png')
    },
    '7':{
        title:'回乡证实例',img:require('./img/IDRule/7.png')
    }
}


/**
 * 显示证件样例规则
 * @param {Object} IDCode  证件类型
 */
export function showIDTips(IDCode){
    return !!IDRuleMap[IDCode];
}

/**
 * 验证中文名
 * @param {Object} name
 */
export function isName(name){
    //与服务端保持一致
    let reg = /^[\u4e00-\u9fa5]+[a-zA-Z]+$|^[\u4e00-\u9fa5]+([·]?[\u4e00-\u9fa5]+$)|^[a-zA-Z]{2,}$|^[A-Z\s]{2,}$/;
    return reg.test(name);
}

/**
 * 验证英文名
 * @param {Object} name
 */
export function isSurname(name){
    let reg = /^[a-zA-Z]{1,30}$/;//与服务端保持一致
    return reg.test(name);
}
/**
 * 显示英文名过滤器
 */
Vue.filter('showSurname',function(value){
    return !!surnameIDMap[value];
});

/**
 * 显示证件样例
 */
Vue.filter('showIDTips',function(value){
    return !!IDRuleMap[value];
});
