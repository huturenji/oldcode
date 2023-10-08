import request from '@/utils/request';

export default {
    // 获取使用帮助内容 
    getSettings(data){
        return request({
            url: '/v3/system/front/setting/getSettings',
            header: { "Content-Type": "application/json" },
            data
        })
    }
}