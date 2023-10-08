import request from '@/utils/request';
export default {
    /**
     * 领取红包
     * @param {*} param 
    */
    receiveRedpacket(param) {
        return request({
            url: '/v3/redpacket/front/redpacket/receiveCoupon',
            data: param
        })
    },
    /**
     * 查看红包信息
     * @param {*} param 
    */
     getByPassword(param) {
        return request({
            url: '/v3/redpacket/front/redpacket/getByPassword',
            data: param
        })
    }
}