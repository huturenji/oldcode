import request from '@/utils/request';
export default {
    /**
     * 获取购物车数量
     * @param {*} param 
    */
    getWxTemplate(data = {}){
        return request({
            url: '/v3/msg/front/msg/getWxTemplate',
            method: 'POST',
            data,
            header: {
                "Content-Type": "application/json"
            }
        })
    }
}