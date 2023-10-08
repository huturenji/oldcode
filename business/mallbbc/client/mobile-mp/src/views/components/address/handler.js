import request from '@/utils/request';

export default {
     /**
     * 获取地址列表
     * @param {*} param 
    */
    getAddressList(){
        return request({
            url: '/v3/member/front/memberAddress/list'
        })
    },

    /**
     * 获取地址详情
     * @param {*} param 
    */
    getAddressDetail(param){
        return request({
            url: '/v3/member/front/memberAddress/detail',
            data: param
        })
    },

    /**
     * 新增地址
     * @param {*} param 
    */
    addAddress(param){
        return request({
            url: '/v3/member/front/memberAddress/add',
            data: param,
            method: 'POST',
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
    },
    /**
     * 编辑地址
     * @param {*} param 
    */
    editAddress(param){
        return request({
            url: '/v3/member/front/memberAddress/edit',
            data: param,
            method: 'POST',
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
    },
    /**
     * 删除地址
     * @param {*} param 
    */
    delAddress(param){
        return request({
            url: '/v3/member/front/memberAddress/del',
            data: param,
            method: 'POST',
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
    },

    /**
     * 地址校验
     * @param {*} param 
    */
    checkAddress(param){
        return request({
            url: '/v3/member/front/memberAddress/addressCheck',
            data: param,
            method: 'POST'
        })
    },

    /**
     * 获取地址
     * @param {*} param 
    */
    getAddressListNew(param){
        return request({
            url: '/v3/system/front/region/getRegionInfoList',
            data: param,
            method: 'GET'
        })
    },

    /**
     * 地址解析三【四】级地址code
     * @param {*} param 
    */
    addressParsing(param){
        return request({
            url: '/v3/member/front/memberAddress/addressParsing',
            data: param,
            method: 'POST',
            header: {
                "Content-Type": "application/json"
            }
        })
    },

    addressCheck(param){
        return request({
            url: '/v3/member/front/memberAddress/addressCheck',
            data: param,
            method: 'POST',
            header: {
                "Content-Type": "application/json"
            }
        })
    }
};