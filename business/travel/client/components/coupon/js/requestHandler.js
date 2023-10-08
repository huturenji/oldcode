/**
 * 优惠券接口处理工厂，所有的接口请求处理和异常处理都在这里，具体页面中只用写业务代码
 * @author songjun
 */

import extendUtils from './extend.js';

Object.assign(extendUtils.ErrorCodeMap, {
    "46111001": {
        text: '优惠券使用出错，请重试',
        noticeType: extendUtils.NoticeType.TOAST
    },
    "46111002": {
        text: '优惠券使用出错，请重试',
        noticeType: extendUtils.NoticeType.TOAST
    },
    "46111003": {
        text: '优惠券使用出错，请重试',
        noticeType: extendUtils.NoticeType.TOAST
    },
    "46111004": {
        text: '优惠券使用出错，请重试',
        noticeType: extendUtils.NoticeType.TOAST
    }
})
/**
  * 优惠券专用
  * @param {} url 
  * @param {*} data 
  * @param {*} method 
  */
function couponApiCallHander(url, data, method){
    return extendUtils.apiCallHandler(extendUtils.HTTP_CONT.ORIGIN+url,data,method);
}

/**
 * 公共处理请求的方法
 * @param {*} url 
 * @param {*} param 
 * @param {*} callback 异常时的回调
 */
function request(url, param, callback, errCallback){
    return new Promise(function(res,rej){
        couponApiCallHander(url,param).then(function(data){
            if (!!data && data.code==0){
                res(data.data);
            } else {
                callback && callback({code: data.code, rdesc: data.rdesc});
                rej();
                console.info(data.rdesc);
            }
        }).catch((err)=>{
            errCallback && errCallback();
            console.info(err);
            rej();
        })
    });
}

/**
 * 获取优惠券
 * @param {*} productType 产品类型 0=全部、1=机票、2=酒店、3=火车票、4=转账
 * @param {*} openStatus  优惠券状态 0=全部、1=未开始、2=进行中、3=已结束
 * @pageIndex 当前页数
 * @pageSize 每页数量
 */
export function getCouponsByPage(param){
    const url = '/bp/coupon/coupon.findPersonCanReceivedCoupon';
    return request(url, param);
}
export function getCouponsForHome(productType=1,openStatus=2,PageSize=2,PageIndex=1){
    let param = {
        OpenStatus: openStatus,
        ProductType: productType,
        PageSize: PageSize,
        PageIndex: PageIndex
    }
    return getCouponsByPage(param)
}

/**
 * 领取优惠券
 * @param {*} couponNo 优惠券编号
 */
export function useCoupon(couponNo){
    const url = '/bp/coupon/coupon.receiveCoupon';
    const DEFAULT_ERR_MSG = '领取失败';
    let param = {
        CouponNo: couponNo
    }
    return request(url, param, function(data){
        let errMsg = DEFAULT_ERR_MSG;
        switch (data.code){
        case -91:
            errMsg = '优惠券已过期'
            break;
        case -92:
            errMsg = '请勿重复领取'
            break;
        case -93:
            errMsg = '优惠券已领完'
            break;
        case -94:
            errMsg = '优惠券暂停使用，不能领取'
            break;
        case -95:
            errMsg = '您不符合领取条件'
            break;
        default:
            break;    
        }
        extendUtils.showToast(errMsg);
    }, function(){
        extendUtils.showToast(DEFAULT_ERR_MSG);
    });
}

/**
 * 获取当前用户拥有的优惠券
 * @param {*} productType 产品类型 0=全部、1=机票、2=酒店、3=火车票、4=转账
 * @param {*} openStatus   优惠券状态，0=全部、1=可使用、2=已使用、3=已过期
 */
export function getMyCoupons(productType=0,openStatus=0){
    const url = '/bp/coupon/coupon.findPersonalCoupon';
    let param = {
        ProductType: productType,
        Status: openStatus
    }
    return request(url, param);
}

/**
 * 获取当前用户积分总数
 */
export function getTotalScore(){
    const url = '/bp/coupon/couponScore.findTotalScore';
    return request(url, {});
}

/**
 * 获取当前用户积分流水
 */
export function getScoreDetailByPage(pageIndex=1, pageSize=20){
    const url = '/bp/coupon/couponScore.findScoreDetail';
    let param = {
        PageSize: pageSize,
        PageIndex: pageIndex,
        UaId: window.localStorage.getItem('uaId'),
        CpyId: window.localStorage.getItem('cpyId')
    }
    return request(url, param);
}

/* ========== 公用业务处理工具方法 ============ */
/**
 * 获取最优惠的优惠券价格描述
 */  
export function getBestCoupon(obj, callback){
    if (!obj){
        return;
    }
    let couponList = obj.CanUseCoupon;
    if (!couponList || couponList.length==0){
        return;
    }
    let bestCoupon = couponList[0];//接口数据已按价格从高到低排序
    if (Object.keys(obj)[0]=='0'){
        bestCoupon=obj[0]
    }
    callback && callback(bestCoupon);
    if (bestCoupon.CouponType==1){
        return '满'+bestCoupon.FullValue+'减￥'+bestCoupon.CouponValue;
    }
    return '立减￥'+bestCoupon.CouponValue;
    
}

/**
 * 公共方法，打开新窗口前处理路径
 */
export function openPage(url){
    let appName;
    if (url.indexOf('express.html')>-1){
        appName = 'express';
    } else if (url.indexOf('invoiceManage.html')>-1){
        appName ='invoice';
    } else if (url.indexOf('train.html')>-1){
        appName ='train';
    } else if (url.indexOf('hotel.html')>-1){
        appName ='hotel';
    } else if (url.indexOf('flight.html')>-1){
        appName ='flight';
    } else if (url.indexOf('trip.html')>-1){
        appName ='trip';
    } else if (url.indexOf('payLab.html')>-1){
        appName ='pay';
    } else if (url.indexOf('orderDetail.html')>-1 || url.indexOf('myOrder.html')>-1){
        appName = 'order';
    } else if (url.indexOf('personal.html')>-1){
        appName ='mybp';
    } else if (url.indexOf('passenger.html')>-1){
        appName ='passenger';
    } else if (url.indexOf('wallet.html')>-1){
        appName ='coupon';
    } else if (url.indexOf('address.html')>-1){
        appName ='address';
    }
    let prefix = '../../'+appName+'/modules/';
    extendUtils.openPage(prefix + url);
}

