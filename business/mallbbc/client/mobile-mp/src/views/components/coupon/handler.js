import request from '@/utils/request';

export default {
    /**
     * 获取卡密券
     * @param {*} param 
    */
     getListReceiveByPwd(param = {}){
        return request({
            url: '/v3/promotion/front/activity/listReceiveByPwd',
            method: 'POST',
            data: param,
            header: {
                "Content-Type": "application/json"
            }
        })
    }
}