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
    '5': '台胞证',
    '6': '台湾通行证',
    '7': '回乡证',
    '9': '其他',
};

/**
 * 获取旅客证件名字
 * @param status
 * @returns {*}
 */
export function getCardTypeName(status){
    try{
        return cardTypes[status.toString()];
    }catch(e){
        return "身份证";
    }
}
/**
 * 旅客性别的键值对
 */
export const GenderNameTypes = {
    '1': '男',
    '2': '女',
};
/**
 * 获取旅客性别
 * @param status
 * @returns {*}
 */
export function getGenderName(status){
    return status ? GenderNameTypes[status.toString()]:"---";
}
/**
 * 身份证号码部分隐藏，用*代替，只保留前四位和后三位，示例：6234********329
 * @param {d} cardNo 
 */
export function getFormatCardNo(cardNo){
    if(!!cardNo && cardNo.length>7){
        var multiX="";
        for(var i=0;i<cardNo.length-7;i++){
            multiX+="*";
        }
        return cardNo.substr(0,4) + multiX + cardNo.substr(cardNo.length-3,3);
    }else{
        return cardNo;
    }
}
/** ========================================证件类型end========================================== */