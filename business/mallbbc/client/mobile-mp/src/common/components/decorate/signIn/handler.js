import request from '@/utils/request';

export default {

    /**
     * @description: 查询签到活动状态
     * @param {*} data
     * @return {*}
     */   
    async getActivityStatus(data = {}) {
        const res = await request({
            url: '/v3/marketing/front/sign/isActivityUsed',
            data
        })
        return this.handlerRes(res);
    },

    /**
     * @description: 获取今日是否签到
     * @param {*} data
     */    
    async getIsSignToday(data = {}) {
        const res = await request({
            method: 'post',
            url: '/v3/marketing/front/sign/isSign',
            data
        })
        return this.handlerRes(res);
    },

    /**
     * @description: 获取累计签到天数
     * @param {*} data
     * @param {*} config
     */   
    async getTotalSignDays(data = {}) {
        const res = await request({
            url: '/v3/marketing/front/sign/countSign',
            data,
            method: 'post',
        })
        return this.handlerRes(res);
    },

    /**
     * @description: 获取签到记录
     * @param {*} data
     */    
    async getSignRecord(data = {}) {
        const res = await request({
            url: '/v3/marketing/front/sign/doSign',
            data,
            method: 'post',
        })
        return this.handlerRes(res);
    },

    /**
     * @description: 获取个人信息
     */    
    async getUserCenterData() {
        const res = await request({
            url: '/v3/member/front/member/getInfo',
        })
        return this.handlerRes(res);
    },

    handlerRes(res) {
        if (res?.state === 200) {
            return res.data;
        } else {
            uni.showToast({
                title: res.msg || '请求错误',
                icon: 'none'
            })
            return Promise.reject(false);
        }
    }

}
