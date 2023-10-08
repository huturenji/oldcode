/**
 运营首页的菜单数据
 功能：公共常量、键值对
author：liguanqun
date：2019年07月1日
 */

/** ========================================运营首页菜单start========================================== */

/**
*查询运营首页的菜单列表
*/
export function  getAirCpyLogo(code){
    if(menuList.indexOf(code)!= -1){
        return code
    }else{
        return "iconDefault"
    }
}
/**
 * 运营首页菜单的数据
 */
export const menuList = ["ZH","3U","8C","8L","9C","9H","all","BK","CA","CN"
,"CO","CU","CX","CZ","dz","EU","FM","FU","G5","GJ"
,"GS","GX","GY","HO","HU","iconDefault","JD","JR","KA","KN"
,"KY","MF","MS","MU","NS","PN","QW","RY","SC","TG"
,"TV","UA","UO","UQ","VD","Y8"]
/** ========================================运营首页菜单end========================================== */