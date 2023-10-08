import request from '@/utils/request';

export default {
    /**
     * 订阅或取消天天专场活动
     * @param {*} param 
    */
    subscribeOrCancel(param = {}){
        return request({
            url: '/v3/specialoffer/front/buyEveryday/subscribeOrCancel',
            data: param,
            method: 'GET',
            header: {
                "Content-Type": "application/json"
            }
        })
    },

    /**
     * 天天专场一周活动预告列表
     * @param {*} param 
    */
    getDailyList(param){
        return request({
            url: '/v3/specialoffer/front/buyEveryday/listPreview',
            method: 'GET',
            header:{"Content-Type": "application/json"},
            data: param
        })
    }
};