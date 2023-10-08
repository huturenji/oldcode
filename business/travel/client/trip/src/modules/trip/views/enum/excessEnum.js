/*
 功能：行程超标异常 键值对
author：hepan
date：2019年3月18日
 */

/**
 * 标题文本
 */
const title = {
    excess: ['超标信息', '差旅标准', '超标原因'],
    abnormal: ['异常信息', '出差行程', '异常原因']
}

/**
 * 预订信息键值对
 */
const infoKey = {
    hotel: [
        {name: '入住酒店', key: 'hotelName'},
        {name: '入住房型', key: 'hotelRoomType'},
        {name: '入住时间', key: 'checkInDate'},
        {name: '入住人', key: 'passengers'},
        {name: '消费金额', key: 'totalAmount'}
    ],
    flight: [
        {name: '航班', key: 'airLine'},
        {name: '舱位', key: 'cabinType'},
        {name: '出发时间', key: 'startTime'},
        {name: '乘客', key: 'passengers'},
        {name: '消费金额', key: 'totalAmount'}
    ],
    train: [
        {name: '车次', key: 'trainNo'},
        {name: '坐席', key: 'trainSeatType'},
        {name: '出发时间', key: 'startTime'},
        {name: '乘客', key: 'passengers'},
        {name: '消费金额', key: 'totalAmount'}
    ]
}

/**
 * 超标文本
 */
const excessText = {
    hotel: {text: '预订房间均价', key: 'averagePrice'},
    flight: {text: '预订航班舱位为', key: 'cabinType'},
    train: {text: '预订列车座席为', key: 'trainSeatType'},
    car: {text: '预订商务用车车型为', key: 'vehicleType'}
}

/**
 * 异常文本
 */
const abnormalText = {
    hotel: '预订酒店不在出差行程之内',
    flight: '预订航班不在出差行程之内',
    train: '预订列车不在出差行程之内',
    car: '预订商务用车不在出差行程之内'
}

const orderType = {
    1: 'flight',
    2: 'hotel',
    3: 'train',
    6: 'car'
}
const tripTypes = [
    {code:0,name:'全部'},
    {code:1,name:'机票'},
    {code:3,name:'火车票'},
    {code:2,name:'酒店'}
    // {code:6,name:'商务用车'},
]

/**
 * 车型配置
 */
export let carTypeData = {
    'ECONOMIC':{name: '经济型'},
    'COMFORTABLE':{name: '舒适型'},
    'COMMERCLAL':{name: '商务型'},
    'LUXURIOUS':{name: '豪华型'}
}


/**
 * 车型差标配置
 */
export let criterionCarTypeData = {
    '0': '经济型',
    '1': '舒适型',
    '2': '商务型',
    '3': '豪华型'
}

export let CarlimitTypeData = {
    1:'每单限额'
}

/**
 * 获取标题文本
 * @param abnormalFlag 异常标识 
 */
function getTitle (abnormalFlag) {
    return !!abnormalFlag ? title[abnormalFlag] : []
}

/**
 * 获取预订信息键值对
 * @param type 订单类型 
 */
function getInfoKey (type) {
    return !!type ? infoKey[type] : []
}

/**
 * 获取超标文本
 * @param type 订单类型 
 */
function getExcessText (type) {
    return !!type ? excessText[type] : {}
}

/**
 * 获取异常文本
 * @param type 订单类型 
 */
function getAbnormalText (type) {
    return !!type ? abnormalText[type] : ''
}

/**
 * 获取订单类型
 * @param type 订单类型 
 */
function getOrderType (type) {
    return !!type ? orderType[type] : ''
}

/**
 * 默认头像
 */
const defaultImg = {src: require('../../../../assets/img/trip/user_default.png')}

export {getTitle, getInfoKey, getExcessText, getAbnormalText, getOrderType, tripTypes, defaultImg}

