/**
 机票筛选条件
 功能：公共常量、键值对
 author：songjun
 date：2019年6月20日
 */

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
