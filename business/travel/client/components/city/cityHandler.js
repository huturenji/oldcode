/*
 * @Descripttion: h火车模块公共js方法
 * @version: 
 * @Author: yg
 * @Date: 2019-05-16 15:20:51
 * @LastEditors: yg
 * @LastEditTime: 2019-05-24 11:26:34
 */
var functional = SnTravel.functional;
class cityHandler extends functional.baseRequestHandler{
    constructor(){
        super();
        this.conf = null;
    }

    /**
     * 筛选城市
     */
    searchCity(url ,param){
        return this.request(url ,param,{method:'get'});
    }
}
Object.assign(cityHandler.prototype, functional);
export default new cityHandler();