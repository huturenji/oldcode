/**
 运营订单中心业务二级菜单类型定义
 功能：公共常量、键值对
author：liguanqun
date：2019年08月1日
 */

/** ========================================运营订单中心二级菜单 业务类型 start========================================== */

/**
*查询运营运营订单中心二级菜单 业务类型
@type 下标 0-N
*/
export function getBusinessType(type){
    return BusinessTypes[type];
}
/**
 * 运营订单中心二级菜单 业务类型
 */
export const BusinessTypes = [
    {
        typeCode:"Flight",
        typeName:"机票",

    },
    {
        typeCode:"Train",
        typeName:"火车票",

    },
    {
        typeCode:"Hotel",
        typeName:"酒店",

    },
    {
        typeCode:"Express",
        typeName:"快递",

    },     
    {
        typeCode:"Taxi",
        typeName:"打车",

    },    
    {
        typeCode:"Insurance",
        typeName:"保险",

    },                               
]
/** ========================================运营首页菜单end========================================== */