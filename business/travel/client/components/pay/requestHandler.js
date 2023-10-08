var functional = SnTravel.functional;
class requestHandler extends functional.baseRequestHandler{
    constructor(){
        super();
    }

    async getCashCouponSwitch(){
        try{
            const response = await this.request('/channel/v1/getChannel', null, {method: 'get'});
            const value = response.result.channelAccessConfigs.find(config => config.configKey == 'cashcouponSwitch')
            return value && value.configValue === 'true'
        }catch(e){
            console.error('getCashCouponSwitch failed! ' + e)
        }
    }

    /**
     * 获取优惠券列表
     * @param param
     * @return {*}
     */
    async getCashCouponList(){
        //先判断开关
        if(!(await this.getCashCouponSwitch())){
            return []
        }
        //服务端这个接口只返回可用的代金券，不包含useState
        const response = (await this.request('/payment/v1/listCashcoupon', null, {method:'get'}))
        try{
            response.result.cashcoupons = response.result.cashcoupons.map(coupon => {
                coupon.useState = '1'
                return coupon
            });
        }catch(e){}
        return response
    }
}
export default new requestHandler();