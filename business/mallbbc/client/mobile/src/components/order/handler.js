import request from '@/utils/request';
import taskLock from '@/utils/taskLock/index.js'
export default {
    onceLock: new taskLock.Once(),
    checkUrl:'v3/business/front/orderOperate/check',
    /**
     * 一个页面生命周期内，只可请求一次。多余请求不会执行
     * @returns 
     */
    async checkOnce(param, config){
        let that = this;
        let opt = {
            ...config,
            url: that.checkUrl,
            method: 'POST',
            header:{"Content-Type": "application/json"},
            data: param
        }
        return new Promise((resolve,reject)=>{
            that.requestOnce(opt).then((res)=>{
                this.onceLock?.release(that.checkUrl)
                resolve(res);
            }).catch((e)=>{
                this.onceLock?.release(that.checkUrl)
                reject(e);
            })

        })
    },
    /**
     * 一个页面生命周期内，只可请求一次。多余请求不会执行
     * @returns 
     */
    async requestOnce(opt){
        let that = this;
        let _arguments = arguments;
        return new Promise((resolve, reject) => {
            let locked = that.onceLock.exec(async function(){
                try {
                    resolve(await request.apply(that, _arguments));
                } catch (e){
                    reject(e);
                }
            }, opt.url)
            if (locked){
                let argumentsStr = _arguments;
                try {
                    argumentsStr = JSON.stringify(_arguments)
                } catch (e){}
                console.warn('multiple request. arguments: ' + (argumentsStr ?? 'null'))
            }
        })
    },
    /**
     * 下单检查
     * @param {*} param 
    */
    check(param){
        return request({
            url: 'v3/business/front/orderOperate/check',
            method: 'POST',
            header:{"Content-Type": "application/json"},
            data: param
        })
    },
    /**
     * 修改订单地址
     * @param {*} param 
    */
    updateAddress(param){
        return request({
            url: 'v3/business/front/orderOperate/updateAddress',
            method: 'POST',
            data: param
        })
    },
    /**
     * 查询配送时间日历
     * @param {*} param 
    */
    getPromiseCalendar(param){
        return request({
            url: 'v3/business/front/orderOperate/getPromiseCalendar',
            method: 'POST',
            header:{"Content-Type": "application/json"},
            data: param
        })
    },
    /**
     * 确认订单
     * @param {*} param 
    */
    confirm(param, config){
        return request({
            ...config,
            url: 'v3/business/front/orderOperate/confirm',
            method: 'POST',
            header:{"Content-Type": "application/json"},
            data: param
        })
    },
    /**
     * 提交订单
     * @param {*} param 
    */
    submit(param, config) {
        return request({
            ...config,
            url: 'v3/business/front/orderOperate/submit',
            method: 'POST',
            header:{"Content-Type": "application/json"},
            data: param
        })
    },
    /**
     * 取消订单
     * @param {*} param 
    */
    cancel(param){
        return request({
            url: 'v3/business/front/orderOperate/cancel',
            method: 'POST',
            header:{"Content-Type": "application/json"},
            data: param
        })
    },
    /**
     * 取消订单
     * @param {*} param 
    */
    cancelOrderResult(param){
        return request({
            url: 'v3/business/front/orderOperate/checkOrderCancelResult',
            method: 'POST',
            header:{"Content-Type": "application/json"},
            data: param
        })
    },
    /**
     * 删除订单
     * @param {*} param 
    */
    delete(param){
        return request({
            url: 'v3/business/front/orderOperate/delete',
            method: 'POST',
            data: param
        })
    },
    /**
     * 确认收货
     * @param {*} param 
    */
    receive(param){
        return request({
            url: 'v3/business/front/orderOperate/receive',
            method: 'POST',
            data: param
        })
    },
    /**
     * 获取订单的物流信息
     * @param {*} param 
    */
    getTrace(param = {}){
        return request({
            url: 'v3/business/front/logistics/order/getTrace',
            data: param
        })
    },
    /**
     * 获取售后订单的物流信息
     * @param {*} param 
    */
    getAftersaleTrace(param = {}){
        return request({
            url: 'v3/postsale/front/after/sale/getTrace',
            data: param
        })
    },
    /**
     * 获取用户有效订单物流列表
     * @param {*} param 
    */
    listOrderTrace(param = {}){
        return request({
            url: 'v3/business/front/logistics/order/listOrderTrace',
            data: param,
            method: 'POST',
            header:{"Content-Type": "application/json"}
        })
    },
    /**
     * 获取都在买订单列表
     * @param {*} param 
    */
    getBillboardList(param = {}){
        return request({
            url: 'v3/statistics/front/buying/queryOrderList',
            data: param
        })
    },

    /**
     * 获取订单详情
     * @param {*} param 
    */
    getOrderDetail(param = {}, config = {}){
        return request({
            ...config,
            url: 'v3/business/front/orderInfo/detail',
            data: param,
            method: 'POST'
        })
    },

    /**
     * 获取订单列表
     * @param {*} param 
    */
    getOrderList(param = {}){
        return request({
            url: 'v3/business/front/orderInfo/myOrderList',
            data: param,
            method: 'POST',
            header:{"Content-Type": "application/json"}
        })
    }
};