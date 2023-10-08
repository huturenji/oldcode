import request from '@/utils/request';

export default {
    /**
     * 获取商品参加的活动列表
     * @param {*} param 
    */
    getPromotionList(param){
        return request({
            url: '/v3/promotion/front/activity/detail',
            method: 'GET',
            header:{"Content-Type": "application/json"},
            data: param
        })
    },
    /**
     * 获取秒杀商品详情
     * @param {*} param 
    */
    getSeckillDetail(param = {}){
        return request({
            url: '/v3/specialoffer/front/common/getProductInfo',
            data: param,
            header:{"Content-Type": "application/json"}
        })
    },
    /**
     * 设置/取消秒杀服务的提醒功能
     * @param {*} param 
    */
    setSeckillRemind(param = {}){
        return request({
            url: '/v3/specialoffer/front/common/isRemind',
            data: param,
            header:{"Content-Type": "application/json"}
        })
    },
    /**
     * 获取预售商品详情
     * @param {*} param 
    */
    getPresaleDetail(param = {}){
        return request({
            url: '/v3/promotion/front/preSell/detail',
            data: param
        })
    },

    /**
     * 获取拼团商品详情
     * @param {*} param 
    */
    getPinInfoDetail(param = {}){
        return request({
            url: '/v3/promotion/front/spell/detail',
            data: param
        })
    },
    /**
     * 获取阶梯团商品详情
     * @param {*} param 
    */
    getLadderDetail(param = {}){
        return request({
            url: '/v3/promotion/front/ladder/group/detail',
            data: param
        })
    },
    /**
     * 获取一起买商品详情
     * @param {*} param 
    */
    getBuyTogether(param = {}){
        return request({
            url: '/v3/specialoffer/front/common/getProductInfo',            
            data: param,
            header:{"Content-Type": "application/json"}
        })
    },

    /**
     * 设置/取消一起买服务的提醒功能
     * @param {*} param 
    */
    setBuyTogetherRemind(param = {}){
        return request({
            url: '/v3/specialoffer/front/common/isRemind',
            data: param,
            header:{"Content-Type": "application/json"}
        })
    }

    
};