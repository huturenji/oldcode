/*
 * @Descripttion: 酒店js方法
 * @version: 
 * @Author: xwc
 * @Date: 2019年5月28日16:59:41
 * @LastEditors: xwc
 * @LastEditTime: 2019年5月28日16:59:48
 */
var functional = SnTravel.functional;
let {openPage} = functional;
const ORIGIN = functional.HTTP_CONT.ORIGIN;
class gotoApplyTravelHandler extends functional.baseRequestHandler{
    constructor(){
        super();
        this.conf = null;
    }

    /**
     * 获取申请出差地址
     */
    getApplyTravelUrl(param){
        return this.request('/channel/v1/getChannel',param,{method:'get'});
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
Object.assign(gotoApplyTravelHandler.prototype, functional);
export default new gotoApplyTravelHandler();