/*
 * @Descripttion: 酒店js方法
 * @version: 
 * @Author: xwc
 * @Date: 2019年5月28日16:59:41
 * @LastEditors: xwc
 * @LastEditTime: 2019年5月28日16:59:48
 */
var functional = SnTravel.functional;
let {openPage,ErrorCodeMap,NoticeType} = functional;
const ORIGIN = functional.HTTP_CONT.ORIGIN;
/**
 * 引入酒店新的服务端错误码
 * VERINVOICE_MODULE_ID = "01" 
 */
const CheckHotelErrorCodeMap = {
    "46010004": {
        text:'该酒店已不可预订，请选择其他酒店',
        noticeType: NoticeType.TOAST
    }
}
Object.assign(ErrorCodeMap,CheckHotelErrorCodeMap);

class HotelMarketingHandler extends functional.baseRequestHandler{
    constructor(){
        super();
        // 调试数据userId、companyId、channelId
        this.conf = null;
    }

    /**
     * 获取酒店城市
     */
    getHotelCitys(param){
        return this.request('/hotel/v1/getHotelCitys',param,{method:'get'});
    }

    /**
     * 获取推荐酒店列表
     */
    getMarketingHotelList(param){
        return this.request('/hotel/v1/getHotelBookingHistory',param);
    }

    /**
     * 获取酒店优惠券
     */
    findPersonalCoupon(param){
        return this.request('/bp/coupon/coupon.findPersonalCoupon',param);
    }

    /**
     * 获取酒店详情
     */
    getHotelDetail(param){
        return this.request('/hotel/v1/getHotelDetail',param,{method:'post',noZipFlag:true});
    }

    /**
    * 拆小应用openpage跳转问题 重写
    */
    handlerOpenPage(url ,href,oFlag=false){
        let newUrl = '';

        let preUrl = null;

        for (const key in functional.OPENPAGE_MAP) {
            if (url.indexOf(key) > -1) {
                preUrl = functional.OPENPAGE_MAP[key];
                break;
            }
        }

        newUrl = preUrl ? (ORIGIN + preUrl + url) : url;

        if (href && href == 'href'){
            window.location.href = functional.urlProxy(newUrl);
        } else {
            openPage(newUrl,oFlag);
        }
    } 
}
Object.assign(HotelMarketingHandler.prototype, functional);
export default new HotelMarketingHandler();