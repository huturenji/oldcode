/**
 用户信息枚举类
 功能：公共常量、键值对
author：songjun
date：2018年11月1日
 */

/** ========================================证件类型start========================================== */
/**
 * 旅客证件的键值对
 */
export const cardTypes = {
    '0': '身份证',
    '1': '护照',
    '4': '港澳通行证',
    '5': '台胞证（台湾居民往来大陆通行证）',
    '6': '台湾通行证',
    '7': '回乡证（港澳居民往来内地通行证）',
    '8': '外国人永久居留身份证',
    '9': '其他'
};

/**
 * 获取旅客证件名字
 * @param status
 * @returns {*}
 */
export function getCardTypeName(status){
    try {
        return cardTypes[status.toString()];
    } catch (e){
        return "身份证";
    }
}
/** ========================================证件类型end========================================== */