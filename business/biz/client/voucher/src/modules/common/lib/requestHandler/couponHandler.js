import base from './base';
import extendUtils from 'common/lib/utils';
extendUtils.WhiteList.global.push('/couponproxy/v1/getCouponVoucher')
class couponHandler extends base{
    constructor(){
        super(); 
    }

    /**
     * 领取卡密
     * @param {*} param 
     */
    getCouponVoucher(param){
        return this.request('/couponproxy/v1/getCouponVoucher',param);
    }

    /**
     * 卡密领取状态
     */
    getReceiveState(param){
        return this.request('/couponproxy/v1/getPwdState', param);
    }
}
export default new couponHandler();