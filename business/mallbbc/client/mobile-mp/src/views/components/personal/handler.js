import request from '@/utils/request';

export default {
    /**
     * 获取个人用户的订单角标数量信息
     * @param {*} param 
    */
    getInfo(){
        return request({
            url: '/v3/member/front/member/getInfo'
        })
    },
    // 用户信息
    memberInfo(){
        return request({
            url: '/v3/member/front/member/memberInfo'
        })
    },
    // 更新用户信息
    updateMemberInfo(param){
        return request({
            url: '/v3/member/front/member/updateInfo',
            data: param,
            method: 'POST',
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
    },
    /**
     * 收藏和取消商品
     * @param {*} param 
    */
    editFollowProduct(param = {}){
        return request({
            url: '/v3/member/front/followProduct/edit',
            data: param,
            method: 'POST',
            header: {
                "Content-Type": "application/json"
            }
        })
    },

    /**
     * 足迹接口，加入足迹
     * @param {*} param 
    */
    addProductLookLog(param = {}){
        return request({
            url: '/v3/member/front/productLookLog/add',
            data: param,
            method: 'POST',
            header: {
                "Content-Type": "application/json"
            }
        })
    },

    /**
     * 获取用户的云豆
     * @param {*} param 
    */
    getMemberIntegral(param = {}){
        return request({
            url: '/v3/integral/front/integralMember/getMemberIntegral',
            method: 'POST',
            data: param,
            header: {
                "Content-Type": "application/json"
            }
        })
    },

    getCollect(){
        return request({
            url: '/v3/member/front/followProduct/list'
        })
    },
    /**
     * 获取用户的积分
     * @param {*} param 
    */
    getMemberIntegralList(param = {}){
        return request({
            url: '/v3/integral/front/integralMember/list',
            data: param
        })
    }
};