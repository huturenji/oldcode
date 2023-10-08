/* 酒店常量
 * @Descripttion: 
 * @version: 
 * @Author: xiaowe
 * @Date: 2019年11月26日
 * @LastEditors: xiaowe
 * @LastEditTime: 2019年11月26日16:23:10
 */

/**
 * 酒店服务类型
 */
export let hotelServerTypeList = [
    {name:"免费wifi",type:"1"},
    {name:"收费wifi",type:"2"},
    {name:"免费宽带",type:"3"},
    {name:"收费宽带",type:"4"},
    {name:"免费停车场",type:"5"},
    {name:"收费停车场",type:"6"},
    {name:"免费接机服务",type:"7"},
    {name:"收费接机服务",type:"8"},
    {name:"室内游泳池",type:"9"},
    {name:"室外游泳池",type:"10"},
    {name:"健身房",type:"11"},
    {name:"商务中心",type:"12"},
    {name:"会议室",type:"13"},
    {name:"酒店餐厅",type:"14"},
    {name:"叫醒服务",type:"15"},
    {name:"行李寄存",type:"16"},
    {name:"双床",type:"17"},
    {name:"大床",type:"18"}
]
/**
 * 酒店服务数据
 */
export let hotelServerData = {
    "1":{domStr:"<span class='free'>免费</span>WiFi",iconUrl:require('../../../assets/img/hotel/server/icon_hotel_wifi.svg')},
    "2":{domStr:"<span class='noFree'>收费</span>WiFi",iconUrl:require('../../../assets/img/hotel/server/icon_hotel_wifi.svg')},
    "3":{domStr:"<span class='free'>免费</span>宽带",iconUrl:require('../../../assets/img/hotel/server/icon_hotel_broadband.svg')},
    "4":{domStr:"<span class='noFree'>收费</span>宽带",iconUrl:require('../../../assets/img/hotel/server/icon_hotel_broadband.svg')},
    "5":{domStr:"<span class='free'>免费</span>停车场",iconUrl:require('../../../assets/img/hotel/server/icon_hotel_parking.svg')},
    "6":{domStr:"<span class='noFree'>收费</span>停车场",iconUrl:require('../../../assets/img/hotel/server/icon_hotel_parking.svg')},
    "7":{domStr:"<span class='free'>免费</span>接机服务",iconUrl:require('../../../assets/img/hotel/server/icon_hotel_jiejifuwu.svg')},
    "8":{domStr:"<span class='noFree'>收费</span>接机服务",iconUrl:require('../../../assets/img/hotel/server/icon_hotel_jiejifuwu.svg')},
    "9":{domStr:"室内游泳池",iconUrl:require('../../../assets/img/hotel/server/icon_hotel_swimmingpool1.svg')},
    "10":{domStr:"室外游泳池",iconUrl:require('../../../assets/img/hotel/server/icon_hotel_swimmingpool2.svg')},
    "11":{domStr:"健身房",iconUrl:require('../../../assets/img/hotel/server/icon_hotel_gym.svg')},
    "12":{domStr:"商务中心",iconUrl:require('../../../assets/img/hotel/server/icon_hotel_business.svg')},
    "13":{domStr:"会议室",iconUrl:require('../../../assets/img/hotel/server/icon_hotel_meetingroom.svg')},
    "14":{domStr:"酒店餐厅",iconUrl:require('../../../assets/img/hotel/server/icon_hotel_restaurant.svg')},
    "15":{domStr:"叫醒服务",iconUrl:require('../../../assets/img/hotel/server/icon_hotel_wake.svg')},
    "16":{domStr:"行李寄存",iconUrl:require('../../../assets/img/hotel/server/icon_hotel_baggage.svg')},
    "17":{domStr:"双床",iconUrl:require('../../../assets/img/hotel/server/icon_hotel_twinbed.svg')},
    "18":{domStr:"大床",iconUrl:require('../../../assets/img/hotel/server/icon_hotel_bigbed.svg')}
}
