/**
 *订单模块的定制需求开发配置表，目前金贝渠道对于订单应用有一些定制需求，
 *我们需要一个地方统一配置定制需求开发，达到指定渠道有指定业务。
 *
 */

import extendUtils from 'orderCommon/extend.js';
//import requestHandler from './requestHandler.js';
/*-----------------商旅通的小应用列表，罗列了商旅通所有的小应用的名字-----------------*/ 
const BusinessTripAPPList = {
    TRAIN: "Train",//火车票
    FLIGHT: "Flight",//飞机票
    HOTEL: "Hotel",//酒店
    ORDER: "Order",//订单
    TRIP: "Trip",//行程
    ADDRESS: "Address",//常用地址
    COUPON: "Coupon",//优惠券
    EXPRESS: "Express",//快递
    CO_ORDER: "CoOrder"//企业订单管理
}
/*-----------------定制功能开关的取值-----------------*/ 
const ConfigValues = {
    ENABLE: 1,//使用
    DISABLE: 2,//禁用，屏蔽
    UN_AVAILABLE: 3//置灰，不可用
}
/*-----------------定制功能的名字，一般是固定的-----------------*/ 
const ConfigsName = {
    ORDER_SELECTION:"OrderSelection",//订单筛选 功能
    ENDORSE_TRAIN:"EndorseTrain",//火车票改签 功能
    REIMBURSEMENT:"Reimbursement"//报销凭证 功能
}
/*-----------------渠道号 映射表，将数字编码的渠道号用自然语义表达-----------------*/ 
const BusinessTripChannels = {
    JINBEI:4098,//金贝南通农商银行的渠道号
    TCHAT:1,//T信的渠道号
    GANSU_BANK:4866//甘肃银行的渠道号
}
/*-----------------商旅通订单小应用的定制功能开关配置表，这是原始数据集，后期来源于网络-----------------*/ 
var OrderCustomConfigs_RawData = {}
//赋值金贝渠道配置数据集
function setJinBeiData(){
    //下面是动态给配置表赋值，因为都是常量，我们只能动态赋值，不能在声明中赋值。
    OrderCustomConfigs_RawData[BusinessTripChannels.JINBEI] = {}
    OrderCustomConfigs_RawData[BusinessTripChannels.JINBEI][ConfigsName.ORDER_SELECTION] = ConfigValues.DISABLE;
    OrderCustomConfigs_RawData[BusinessTripChannels.JINBEI][ConfigsName.REIMBURSEMENT] = ConfigValues.DISABLE;
    OrderCustomConfigs_RawData[BusinessTripChannels.JINBEI][ConfigsName.ENDORSE_TRAIN] = ConfigValues.UN_AVAILABLE;
}

/**
 *获取某个渠道的配置总表
 *
 *@prodId number
 */
function getCustomConfigs_Raw(prodId){
    return OrderCustomConfigs_RawData[prodId+""];
}
/**
 *通过当前渠道的配置总表
 *
 *@prodId number
 */
export function getMyCustomConfigs_Raw(){
    setJinBeiData();
    return getCustomConfigs_Raw(extendUtils.getUserPara('ProdId'));
}

/**
 *获取当前小应用的名字
 */
export function getCurrentApp(){
    return BusinessTripAPPList.ORDER;
}

/*-----------------提供给订单应用前端使用的配置数据集-----------------*/ 
//前端要使用的配置对象
export var AppConfigs={
    //订单列表的筛选 功能
    OrderListFilter:{
        DisPlay:true,
        CSS:"",
        DefaultValue:undefined
    },
    //报销凭证 功能
    Reimburse:{
        DisPlay:true,
        CSS:"",
        DefaultValue:undefined
    },    
    //火车票订单改签 功能
    TrainOrderEndorse:{
        DisPlay:true,
        CSS:"",
        DefaultValue:undefined
    }
}

/**
 *
 *将原始配置数据集 处理一下 ，转换为前端使用的数据集，放到AppConfigs里面
 * 
 */
function getMyCustomConfigs(rawData){
    //获取原始配置表
    var rawConfigs = rawData ? rawData : getMyCustomConfigs_Raw()
    if (!!rawConfigs){
        //根据原始配置表的取值，通过一系列的运算或者逻辑，转换成前端使用的配置对象,包含3个值DisPlay（页面是否显示，布尔值）
        //，CSS（页面若显示，如何显示，样式名字），DefaultValue（无论显示与否，业务默认取值，Object类型，根具体业务相关）
        //订单列表的筛选 赋值
        AppConfigs.OrderListFilter.disPlay = rawConfigs[ConfigsName.ORDER_SELECTION] == ConfigValues.ENABLE ? true : false;
        AppConfigs.OrderListFilter.CSS = AppConfigs.OrderListFilter.disPlay ? "filter" :"";
        AppConfigs.OrderListFilter.DefaultValue = undefined;
        //火车票订单改签 赋值
        AppConfigs.trainOrderEndorse.disPlay = rawConfigs[ConfigsName.ENDORSE_TRAIN] != ConfigValues.DISABLE ? true : false;
        AppConfigs.trainOrderEndorse.CSS = AppConfigs.trainOrderEndorse.disPlay ? (rawConfigs[ConfigsName.ENDORSE_TRAIN]== ConfigValues.UN_AVAILABLE?"endorseGray":"endorse") : "";
        AppConfigs.trainOrderEndorse.DefaultValue = undefined;
        //报销凭证赋值
        AppConfigs.reimburse.disPlay = rawConfigs[ConfigsName.REIMBURSEMENT] == ConfigValues.ENABLE ? true : false;
        AppConfigs.reimburse.CSS = AppConfigs.reimburse.disPlay ? "reimbursement" :"";
        AppConfigs.reimburse.DefaultValue = undefined;    
    } else {
        console.log("this prod no configs");
    }
}

/**
 * 通过渠道号获取当前小应用对应的定制功能配置表，来自于网络或者配置
 * 返回值,就是AppConfigs
 */
export function getAPPCustomConfigs(){
    return new Promise((resolve)=>{
        // let param = {
        //     ProdId:extendUtils.getUserPara('ProdId'),
        //     App:getCurrentApp()
        // }
        /** 后期可能会从网络获取，这里先留下这个代码
        requestHandler.getAppCustomConfigs(param).then(response=>{
            if(response.data){
                //将网络数据处理一下，变成前端需要的数据
                getMyCustomConfigs(response.data)
                //将处理好的数据返回给前端
                res(AppConfigs)
            }else{
                rej()
            }
        })
        **/
        //将网络数据处理一下，变成前端需要的数据
        getMyCustomConfigs()
        //将处理好的数据返回给前端
        resolve(AppConfigs)
    })
}
