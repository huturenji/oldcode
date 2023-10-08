import request from '@/utils/request';

export default {
    /**
     * 获取首页装修数据
     * @param {*} param 
     * @config 自定义外层请求的配置项
    */
    getIndexDeco(param = {}, config = {}){
        return request({
            ...config,
            url: '/v3/system/front/deco/index',
            data: param
        })
    },

    /**
     * 获取专题页装修数据
     * @param {*} param 
     * @config 自定义外层请求的配置项
    */
    getTopicDeco(param = {}, config = {}){
        return request({
            ...config,
            
            url: '/v3/system/front/deco/special',
            data: param,
            header: { "Content-Type": "application/x-www-form-urlencoded" },
        })
    },

    /**
     * 获取tabbar装修数据
     * @param {*} param 
     * @config 自定义外层请求的配置项
    */
    getTabbarDeco(param = {}, config = {}){
        return request({
            ...config,
            url: '/v3/system/front/deco/list',
            data: param
        })
    }

    
};