//封装的关于统计的方法
import request from './request'
import {
    setStorage,
    setStorageSync,
    getStorageSync,
    getLocation as _getLocation
} from './common.js'
import Base64 from '@/utils/base64.js';
// #ifdef MP-WEIXIN
// var amapFile = require('../static/mp-weixin/libs/amap-wx.js');
// #endif
// #ifdef H5
// var jweixin = require('../jweixin'); //引入微信jssdk//2021-12-21停用微信定位
// #endif 
/** 
 * 初始化统计
 * @params showDebug Boolean 是否开启统计日志，默认false 不开启
 * @zjf-2021-06-27
 */
export async function initStat(showDebug = false, initStatCommonProperty) {
    setStorage({
        key: 'bbcStatShowDebug',
        data: showDebug
    });
    //获取udid
    let uuid = getUUID();
    // #ifdef MP-WEIXIN
    //获取openid
    let code = await uniLogin();
    let openid = await getOpenid(code)
    uuid = openid;
    // #endif

    //获取位置信息
    initStatCommonProperty = {
        ...initStatCommonProperty,
        uuid: uuid
    }
    updateStatCommonProperty(initStatCommonProperty)
}

/** 
 * 获取微信小程序的code
 * @zjf-2021-06-28
 */
export function uniLogin() {
    let code = '';
    return new Promise(resolve => {
        uni.login({
            provider: 'weixin',
            success: res => {
                resolve(res.code)
            },
            fail() {
                resolve(code)
            }
        })
    })
}

/** 
 * 获取微信小程序的openid
 * @params code String uni.login获取到的code
 * @zjf-2021-06-27
 */
export async function getOpenid(code) {
    let openId = '';
    if (!code) {
        return openId;
    }
    let params = {
        url: 'v3/member/front/login/wechat/getOpenId',
        method: 'POST',
        data: {
            code: code,
            source: 2
        }
    }
    await request(params).then(res => {
        if (res.state == 200) {
            openId = res.data;
        }
    })
    return openId;
}

/** 
 * 设置/更新统计的公共属性
 * @params data Object 要更新的属性数据
 * @zjf-2021-06-27
 */
export function updateStatCommonProperty(data) {
    //初始化统计数据
    let source = 'h5';
    // #ifdef APP-PLUS
    source = uni.getSystemInfoSync().platform;
    // #endif
    // #ifdef MP-WEIXIN
    source = 'xcx';
    // #endif
    let target = {
        equipmentType: 2, //设备类型，1-pc，2-移动设备，3-其他
        source: source, //终端名称，pc-pc；h5-H5；android-Android；ios-IOS；xcx-微信小程序
        memberId: 0, //会员id默认为0
        ip: '' //移动端ip默认都为空
    };
    try {
        const value = getStorageSync('bbcStatCommonProperty');
        if (value) {
            target = value;
        }
    } catch (e) {}
    target = {
        ...target,
        ...data
    }; //更新或者新增统计的公共属性
    setStorageSync('bbcStatCommonProperty', target);
}

/** 
 * 同步获取指定key对应的内容
 * @params key 指定的缓存key
 * @zjf-2021-06-27
 */
export function getStatStorage(key) {
    let target = {};
    try {
        const value = getStorageSync(key);
        if (value) {
            target = value;
        }
    } catch (e) {}
    return target;
}

/** 
 * 获取uuid
 * 如：1624819897644-1389918-0ed8161319cedb-22991203
 * Math.random().toString(16).replace('.', '')：0～1的随机数以十六进制显示，并去掉小数点，如：0.f03fb618bf531，并去掉小数点
 * @zjf-2021-06-27
 */
export function getUUID() {
    return "" + Date.now() + '-' + Math.floor(1e7 * Math.random()) + '-' + Math.random().toString(16).replace('.', '') + '-' + String(Math.random() * 31242).replace('.', '').slice(0, 8);
}

/** 
 * 获取地理位置信息,各个终端分别获取
 * @zjf-2021-06-27
 */
export async function getLocation() {
    let locationData = {
        cityCode: '', //城市编码
        cityName: '', //城市名称
        location: '', //经纬度，英文逗号分隔
        provinceCode: '', //省份编码
        provinceName: '' //省份名称
    };
    // #ifdef H5
    locationData = await getH5Location(locationData);
    // #endif 

    // #ifdef APP-PLUS
    locationData = await getAppLocation(locationData);
    // #endif 

    // #ifdef MP-WEIXIN
    // locationData = await getWxXcxLocation(locationData);
    // #endif 

    return locationData;
}

/** 
 * 获取H5的地理位置
 * @zjf-2021-06-28
 */
export function getH5Location(locationData) {
    return new Promise(resolve => {
        _getLocation({
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 10000, //超过10秒后停止定位，默认：无穷大
            maximumAge: 10000, //定位结果缓存0毫秒，默d认：0
            convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
            showButton: false, //显示定位按钮，默认：true
            showMarker: false, //定位成功后在定位到的位置显示点标记，默认：true
            showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
            panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
            zoomToAccuracy:true //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        }).then(res=>{
            locationData.location = res.position.lng + ',' + res.position.lat;
            if (res.addressComponent.city != '') {
                locationData.provinceName = res.addressComponent.province.substring(0, res.addressComponent.province.length - 1);
                locationData.provinceCode = res.addressComponent.adcode;
                locationData.cityName = res.addressComponent.city;
                locationData.cityCode = res.addressComponent.citycode;
            }
            resolve(locationData);
        }).catch(()=>{
            resolve(locationData);
        })
    })
}

/** 
 * 获取APP的地理位置
 * @zjf-2021-06-28
 */
export function getAppLocation(locationData) {
    return new Promise(resolve => {
        uni.getLocation({
            geocode: true,
            success: function(res) {
                locationData.location = res.longitude + ',' + res.latitude;
                locationData.cityName = res.address.city;
                if (res.address.city == res.address.province) {
                    locationData.provinceName = res.address.city.substring(0, res.address.city
                        .length - 1);
                }
                resolve(locationData);
            },
            fail: function(err) {
                console.log('获取位置失败', err)
                resolve(locationData);
            }
        })
    })
}

/** 
 * 获取微信小程序的地理位置
 * @zjf-2021-06-28
 */
// export function getWxXcxLocation(locationData) {
//     return new Promise(resolve => {
//         var myAmapFun = new amapFile.AMapWX({
//             key: getApp().globalData.WxXcxGdKey
//         });
//         uni.getSetting({
//             success: function(res) {
//                 if (res.authSetting['scope.userLocation']) {
//                     myAmapFun.getRegeo({
//                         success: function(data) {
//                             let temp = data[0].regeocodeData.addressComponent;
//                             locationData.location = data[0].regeocodeData.aois[0]
//                                 .location;
//                             if (temp.city.length != undefined && temp.city.length ==0) {
//                                 locationData.provinceName = temp.province.substring(0,
//                                     temp.province.length - 1);
//                                 locationData.cityName = temp.province;
//                             } else {
//                                 locationData.provinceName = temp.province;
//                                 locationData.cityName = temp.city;
//                             }
//                             resolve(locationData)
//                         }
//                     })

//                 } else {
//                     uni.showModal({
//                         title: '提示',
//                         content: '您好,需要开启地理位置信息才能为您推荐更多的好物',
//                         showCancel: false,
//                         success(modalres) {
//                             if (modalres.confirm) {
//                                 uni.authorize({
//                                     scope: 'scope.userLocation',
//                                     success() {
//                                         myAmapFun.getRegeo({
//                                             success: function(data) {
//                                                 let temp = data[0]
//                                                     .regeocodeData
//                                                     .addressComponent;
//                                                 locationData.location = data[0].regeocodeData.aois[0].location;
//                                                 if (temp.city.length != undefined && temp.city.length == 0) {
//                                                     locationData.provinceName =temp.province.substring(0,temp.province.length - 1);
//                                                     locationData
//                                                         .cityName = temp
//                                                             .province;
//                                                 } else {
//                                                     locationData.provinceName = temp.province;
//                                                     locationData
//                                                         .cityName = temp
//                                                             .city;
//                                                 }
//                                                 resolve(locationData);
//                                             }
//                                         })
//                                     },
//                                     fail() {
//                                         resolve(locationData);
//                                     }

//                                 });
//                             }
//                         }

//                     });
//                 }
//             },
//             complete: function() {}
//         })
//     })
// }

/** 
 * 获取设备信息，各个设备分别获取
 * @zjf-2021-06-27
 */
export function getSystemInfo() {
    uni.getSystemInfo({
        "success": function(t) {
            console.info('设备信息：', t);
        }
    })
}

/** 
 * 统计事件
 * @params params Object 参数
 * @zjf-2021-06-27
 */
export async function bbcStatEvent(data) {
    //将data和公共属性合并得到最终要发送的数据
    let bbcStatCommonProperty = getStatStorage('bbcStatCommonProperty');
    let userParams = getApp().globalData.userParams;
    let targetParams = {
        ...bbcStatCommonProperty,
        ...data,
        channelId:userParams.channelId,
        companyId:userParams.companyId

    };
    //没有位置信息的话 要获取位置信息（暂时注释掉，否则在app无定位权限时，会不停的弹出获取定位权限的提示）
    // if (!targetParams.location) {
    //     //获取位置信息
    //     let location = await getLocation();
    //     targetParams = {
    //         ...targetParams,
    //         ...location
    //     };
    //     updateStatCommonProperty(location)
    // }
    //日志开启的话需要打印数据
    const bbcStatShowDebug = getStorageSync('bbcStatShowDebug');
    if (bbcStatShowDebug) {
        console.info('统计传输数据: ', targetParams);
    }
    //发送请求
    let params = {
        url: 'v3/statistics/front/member/behavior/save',
        method: 'POST',
        data: {
            u: Base64.base64Encode(JSON.stringify(targetParams))
        },
        header: {
            "Content-Type": "application/json"
        }
    }
    request(params).then(() => {}).catch(()=>{})
}
