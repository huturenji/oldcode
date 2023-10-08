import request from '@/utils/request';

export default {
    /**
     * 关闭智齿当前会话
     * @param {*} param 
    */
    endConservation(param = {}){
        return request({
            url: 'v3/msg/front/user/out/endConservation',
            data: param,
            method: 'POST',
            header: {
                "Content-Type": "application/json"
            }
        })
    }

};