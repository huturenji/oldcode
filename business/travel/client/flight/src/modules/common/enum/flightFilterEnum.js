/**
 机票筛选条件
 功能：公共常量、键值对
 author：songjun
 date：2019年6月20日
 */

/**
 * 筛选条件对应显示的文字
 */
export const FlightFilterName = {
    DEPART_TIME: '起飞时间',
    AIRPORT: '机场',
    FLIGHT_TYPE: '机型',
    CABIN: '舱位',
    COMPANY: '航空公司',
    DIRECTION: '仅看直飞',
    HIDE_SHARE: '隐藏共享航班'
}

/**
 * 筛选条件对应的选项，可能是一对多。比如机场的筛选条件：名称只有一个，但选项有两个——起飞机场和降落机场
 */
export const FlightFilterKeyValue = {
    DEPART_TIME: ['DEPART_TIME'],
    AIRPORT: ['DEPART_AIRPORT', 'ARRIVE_AIRPORT'],
    FLIGHT_TYPE: ['FLIGHT_TYPE'],
    CABIN: ['CABIN'],
    COMPANY: ['COMPANY']
}

/**
 * “不限”选项的值
 */
export const NOLIMIT = {value:'-1', text:'不限'};

/**
 * 静态选项值
 */
export const FlightFilterOptions = {
    DEPART_TIME: [
        {value: '00:00-06:00', text: '00:00-06:00'},
        {value: '06:00-12:00', text: '06:00-12:00'},
        {value: '12:00-18:00', text: '12:00-18:00'},
        {value: '18:00-23:59:59', text: '18:00-24:00'}//IOS上用24:00去new Date()，会报错，所以要用23:59:59
    ],
    FLIGHT_TYPE: [
        {value: '大型机', text: '大型机'},
        {value: '中型机', text: '中型机'},
        {value: '小型机', text: '小型机'},
        {value: '其它', text: '其它'}
    ],
    CABIN: [
        {value: '0', text: '经济舱'},
        {value: '1,2', text: '头等舱/商务舱'}
    ]
}
