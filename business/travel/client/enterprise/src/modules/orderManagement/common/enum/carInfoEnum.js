/**
 用户信息枚举类
 功能：公共常量、键值对
author：xiaowe
date：2019-9-11
 */

/** ========================================car参数配置start========================================== */
/**
 * 渠道商配置
 */
export let carCpyData = {
    '1':{src: require('../../../../assets/img/car/icon_logo_caocao.svg'), name: '曹操出行'},
    '2':{src: require('../../../../assets/img/car/icon_logo_shenzhou.svg'), name: '神州专车'}
}

/**
 * 车型配置
 */
export let carTypeData = {
    'ECONOMIC':{name: '新能源'},
    'COMFORTABLE':{name: '舒适型'},
    'COMMERCLAL':{name: '商务型'},
    'LUXURIOUS':{name: '豪华型'}
}

/**
 * 取消行程的原因
 */
export let cancelReasonList = [
    {code:1,text:'行程有变化'},
    {code:2,text:'误操作'},
    {code:3,text:'司机来不了'},
    {code:4,text:'司机太远，不愿等待'},
    {code:5,text:'司机限号/堵车无法到来'},
    {code:6,text:'司机不愿意来'},
    {code:7,text:'其它'}
]

/**
 * 司机评分
 */
export let leaveData = {
    '1':'★',
    '2':'★★',
    '3':'★★★',
    '4':'★★★★',
    '5':'★★★★★'
}

/**
 * 标记点配置
 */
export let markerData = {
    'start':{src:'../assets/img/car/icon_taxi_origin.svg',sizeX:29,sizeY:29,positionX:-14,positionY:-29},
    'end':{src:'../assets/img/car/icon_taxi_origin2.svg',sizeX:29,sizeY:29,positionX:-14,positionY:-29},
    'position':{src:'../assets/img/car/icon_map_positive.svg',sizeX:29,sizeY:29,positionX:-10,positionY:-10},
    'car':{src:'../assets/img/car/icon_taxi_car.svg',sizeX:29,sizeY:29,positionX:-14,positionYy:-14},
    'startContent':{positionX:-12,positionY:-30},
    'endContent':{positionX:-12,positionY:-30},
    'carContent':{positionX:-10,positionYy:-10}
}
/**
 * 常量
 */
export const constantData = {


}
/** ========================================car参数配置end========================================== */