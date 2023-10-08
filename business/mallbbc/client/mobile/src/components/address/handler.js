import request from '@/utils/request';

export default {
    /**
     * 获取地址列表
     * @param {*} param 
    */
    getAddressList(){
        return request({
            url: 'v3/member/front/memberAddress/list'
        })
    },

    /**
     * 获取地址详情
     * @param {*} param 
    */
    getAddressDetail(param){
        return request({
            url: 'v3/member/front/memberAddress/detail',
            data: param
        })
    },

    /**
     * 编辑地址
     * @param {*} param 
    */
    editAddress(param){
        return request({
            url: 'v3/member/front/memberAddress/edit',
            data: param,
            method: 'POST'
        })
    },

    /**
     * 新增地址
     * @param {*} param 
    */
    addAddress(param){
        return request({
            url: 'v3/member/front/memberAddress/add',
            data: param,
            method: 'POST'
        })
    },

    /**
     * 地址解析三【四】级地址code
     * @param {*} param 
    */
    addressParsing(param){
        return request({
            url: 'v3/member/front/memberAddress/addressParsing',
            data: param,
            method: 'POST',
            header: {
                "Content-Type": "application/json"
            }
        })
    },

    /**
     * 删除地址
     * @param {*} param 
    */
    delAddress(param){
        return request({
            url: 'v3/member/front/memberAddress/del',
            data: param,
            method: 'POST'
        })
    },

    /**
     * 地址检测 是否符合要求
     * @param {*} param 
    */
    checkAddress(param){
        return request({
            url: 'v3/member/front/memberAddress/addressCheck',
            data: param,
            method: 'POST',
            header: {
                "Content-Type": "application/json"
            }
        })
    },

    /**
     * 新增共享地址
     * @param {*} param 
    */
    addCommonAddress(param){
        return request({
            url: 'v3/member/front/customer-profile/addCommonAddress',
            data: param,
            method: 'POST',
            header: {
                "Content-Type": "application/json"
            }
        })
    },

    /**
     * 更新共享地址
     * @param {*} param 
    */
    updateCommonAddress(param){
        return request({
            url: 'v3/member/front/customer-profile/updateCommonAddress',
            data: param,
            method: 'POST',
            header: {
                "Content-Type": "application/json"
            }
        })
    },

    /**
     * 获取共享地址列表
     * @param {*} param 
    */
    listCommonAddress(param){
        return request({
            url: 'v3/member/front/customer-profile/listCommonAddress',
            data: param,
            method: 'POST',
            header: {
                "Content-Type": "application/json"
            }
        })
    },

    /**
     *删除共享地址
     * @param {*} param 
    */
    deleteCommonAddress(param){
        return request({
            url: 'v3/member/front/customer-profile/deleteCommonAddress',
            data: param,
            method: 'POST',
            header: {
                "Content-Type": "application/json"
            }
        })
    }
};