/**
财务报表 筛选条件列表字段
功能：公共常量、键值对
author：songjun
date：2018年11月1日
*/

/** ========================================财务报表 列表start========================================== */
/**
* 财务报表筛选条件字段名称 和 对应的接口字段
*/
import * as pconst from './constant'
var userTypeFlag= pconst.userTypeSwitch
export function ConditionNamePairs() {
    var res =
    {
        "序号": "",
        "分销渠道": "channelName",
        "企业名称": "companyName",
        "订单类型": "orderTypeName",
        "商旅通订单号": "orderNo",
        "供应商": "providerTypeName",
        "供应商订单号": "providerOrderNo",
        "支付订单号": "payId",
        "交易日期": "payTime",
        "预订人": "scheduledPersonName",
        "乘机人/入住人": "passengerName",
        "出发地/入住时间": "startCityOrDate",
        "到达地/离店时间": "endCityOrDate",
        "航班号/车次/车牌号": "ticketNo",
        "状态": "orderState",
        "票号/酒店名称/保单号/用车": "ticketName",
        "舱位/房型/座席等级/保险产品名/车型": "onType",
        "支付方式": "payTypeName",
        "销售价": "farePrice",
        "采购价": "purchasePrice",
        "税费": "taxes",
        // "保险销售价":"InsuranceSellPrice",
        // "保险采购价":"InsurancePurchasePrice",
        "退票费": "refundPrice",
        "快递费": "expressFee",
        "改签费": "changeFee",
        "手续费销售价": "handlingFeeSell",
        "手续费采购价": "handlingFeePurchase",
        "退差价": "priceDifference",
        "优惠金额": "discountAmount",
        "应收金额": "amountReceivable",
        "应付金额": "amountPayable",
        "利润": "profit",
        "返利": "rebate",
        "行程单号": "tripNo"
    }
    if (userTypeFlag) {
        res["出行类型"] = "useTypeName"
    }
    return res;
}
//显示类型1，直接显示字段即可
export function ConditionNameType1() {
    var res = [
        "序号",
        "分销渠道",
        "支付方式",
        "订单类型",
        "企业名称",
        "状态",
        "商旅通订单号",
        "供应商",
        "供应商订单号",
        "交易日期",
        "支付订单号",
        "预订人",
        "乘机人/入住人",
        "出发地/入住时间",
        "到达地/离店时间",
        "航班号/车次/车牌号",
        "票号/酒店名称/保单号/用车",
        "舱位/房型/座席等级/保险产品名/车型"];
    if (userTypeFlag) {
        res.push("出行类型")
    }
    return res
}
//显示类型2，字段显示需要做判空统一处理
export const ConditionNameType2 = ["销售价", "采购价", "税费", "保险销售价", "保险采购价", "退票费", "快递费", "改签费",
    "手续费销售价", "手续费采购价", "退差价", "优惠金额", "应收金额", "应付金额", "利润", "返利", "行程单号"];
//显示类型3，字段显示需要做复杂处理，支付方式
export const ConditionNameType3 = []
//显示类型3，字段显示需要做复杂处理，因公因私
export const ConditionNameType4 = []
//显示类型3，字段显示需要做复杂处理，订单状态
export const ConditionNameType5 = []
/**
* 获取配置对应的 显示类型
* @param name
* @returns {*}
*/
export function getConditionsValueType(name) {
    if (ConditionNameType1().indexOf(name) != -1) {
        return 1;
    } else if (ConditionNameType2.indexOf(name) != -1) {
        return 2;
    } else if (ConditionNameType3.indexOf(name) != -1) {
        return 3;
    } else if (ConditionNameType4.indexOf(name) != -1) {
        return 4;
    } else if (ConditionNameType5.indexOf(name) != -1) {
        return 5;
    } else {
        return 1;
    }
}
/**
* 获取配置对应的 字段名称
* @param name
* @returns {*}
*/
export function getConditionsValues(name) {
    try {
        let result = [];
        var value = ConditionNamePairs()[name];
        if (value.indexOf(",") != -1) {
            let vals = value.split(",")
            result = result.concat(vals)
        } else {
            result.push(value)
        }
        return result;
    } catch (e) {
        return "---";
    }
}
/**
* 获取配置对应的 title
* @param name
* @returns {*}
*/
export function getConditionNames() {
    let result = [];
    for (var key in ConditionNamePairs()) {
        result.push(key)
    }
    return result;
}
//UI显示宽度为3的字段，默认是1
export const ConditionDivWidth3 = ["舱位/房型/座席等级/保险产品名/车型"]
//UI显示宽度为2的字段，默认是1
export const ConditionDivWidth2 = ["商旅通订单号", "供应商订单号", "支付订单号", "出发地/入住时间", "到达地/离店时间", "航班号/车次/车牌号", "票号/酒店名称/保单号/用车"]
//UI显示宽度为0的字段，默认是1
export const ConditionDivWidth0 = ["序号"]
/**
* 判断配置对应的 显示宽度是否是3
* @param name
* @returns {*}
*/
export function isConditionDivWidth3(name) {
    return ConditionDivWidth3.indexOf(name) != -1
}
/**
* 判断配置对应的 显示宽度是否是2
* @param name
* @returns {*}
*/
export function isConditionDivWidth2(name) {
    return ConditionDivWidth2.indexOf(name) != -1
}
/**
* 判断配置对应的 显示宽度是否是0
* @param name
* @returns {*}
*/
export function isConditionDivWidth0(name) {
    return ConditionDivWidth0.indexOf(name) != -1
}
/** ========================================财务报表 列表end========================================== */