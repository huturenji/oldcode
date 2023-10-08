/**
 * 我的商旅接口和方法处理工厂
 * @author zhangbin
 */

//引入公共的配置文件
// import functional from 'platform/functional';
let { functional } = SnTravel;

class MyCouponHandler extends functional.baseRequestHandler{

    async isMobileModuleEnabled(){
        try {
            const response = await this.request('/channel/v1/getChannel', null, {method: 'get'});
            const value = response.result.channelAccessConfigs.find(config => config.configKey == 'enableMobileModule')
            return value && value.configValue === 'true'
        } catch (e){
            console.error('isMobileModuleEnabled failed! ' + e)
            return false;
        }
    }

    /**
     * 获取订单数量
     */    
    getCouponList(param){
        return this.request('/cashcoupon/v1/listMemberCashcoupon', param);
    }
}


Object.assign(MyCouponHandler.prototype, functional);
export default new MyCouponHandler();