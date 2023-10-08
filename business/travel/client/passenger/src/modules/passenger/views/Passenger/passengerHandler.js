/*
 * @Descripttion: 乘客模块公共js方法
 * @version: 
 * @Author: zb
 * @Date: 2019-05-16 15:20:51
 * @LastEditors: zb
 * @LastEditTime: 2019-05-24 11:26:34
 */
// import functional from "platform/functional"
let { functional } = SnTravel;
let {ErrorCodeMap, NoticeType, getUrlParams} = functional;

/**
 * 引入乘客管理的错误码
 */
const PassengerErrorCodeMap = {
    /*-----------------常用旅客 PASSENGER_MODULE_ID = "08"-----------------*/
    "46080001":{
        text:'信息保存失败，请退出当前页面重新编辑',
        noticeType: NoticeType.TOAST//todo 暂用toast
    },
    "46080002":{
        text: '姓名校验失败，请重新编辑',
        noticeType: NoticeType.TOAST
    },
    "46080003":{
        text: '该证件号码已存在',
        noticeType: NoticeType.TOAST
    },
    "46080004":{
        text: '常用乘客证件号码重复',
        noticeType: NoticeType.TOAST
    },
    "46080005":{
        text: '请填写正确的证件号码',
        noticeType: NoticeType.TOAST
    },
    "80100101":{
        text: '请填写正确的证件号码',
        noticeType: NoticeType.TOAST
    },
    "46080007":{
        text: '请填写证件有效期截止日期',
        noticeType: NoticeType.TOAST
    },
    "80119002":{
        text: '证件号码已存在',
        noticeType: NoticeType.TOAST
    },
    "80119006":{
        text: '该人员信息已存在',
        noticeType: NoticeType.TOAST
    },
    "46080008":{
        text: '身份信息未经核验，需持证件原件到车站售票窗口办理核验',
        noticeType: NoticeType.ALERT,
        showCode: false
    },
    "46080009":{
        text: '身份信息已核验成功',
        noticeType: NoticeType.TOAST
    }
};
Object.assign(ErrorCodeMap, PassengerErrorCodeMap);
/** ========================================errorCode end========================================== */
class passengerHandler extends functional.baseRequestHandler{

    /**
     * 获取旅客列表
     */
    queryPassenger(param){
        return this.request('/common-passenger/v1/queryPassenger', param);
    }

    /**
     * 人员删除
     */
    deletePassengers(param){
        return this.request('/common-passenger/v1/deletePassengers', param);
    }

    /**
     * 更新人员
     */
    updatePassengers(param){
        return this.request('/common-passenger/v1/updatePassengers', param);
    }

    /**
     * 获取国家地区数据
     */
    selectCountry(param){
        return this.request('/common-passenger/v1/selectCountry', param);
    }

    /**
     * 验证身份信息
     */
    identityVerification(param){
        return this.request('/common-passenger/v1/identityVerification', param);
    }

    /**
     * 查询身份信息验证结果
     */
    queryIdentityVerification(param){
        return this.request('/common-passenger/v1/queryIdentityVerification', param);
    }
    

    /** 
    * 获取T信的UAId
    */
    getTChatUaId(){
        let that = this;
        return new Promise((resolve) => {
            if (!!that.uaId){
                let uaId = that.uaId;
                resolve(uaId)
            } else {
                let uaId = getUrlParams().uaId;
                resolve(uaId);
            }
        })
    }

    /** 
    * 获取T信的用户姓名
    */
    getTChatUsername(){
        let that = this;
        return new Promise((resolve) => {
            if (!!that.userName){
                let userName = that.userName;
                resolve(userName)
            } else {
                resolve('')
            }
        })
    }

    /**
     *自行实现数组的findIndex
     */
    findIndex(array, value) {
        let _index = -1;
        if (!array || array.length == 0) {
            return _index;
        }
        let _value = value;
        let _key = null;

        //value是函数，则直接用函数匹配
        if (value.constructor === Function) {
            array.some((obj, index) => {
                if (value(obj)) {
                    _index = index;
                    return true;
                }
                return false
            })
            return _index;
        }

        //value是对象，则取第一个key进行过滤
        //其他情况，直接用value匹配过滤
        if (value.constructor === Object) {
            let keys = Object.keys(value);
            if (keys.length == 0) {
                return _index;
            }
            _key = keys[0];
            _value = value[_key];
        }
        array.some((obj, index) => {
            if (!!_key && obj.constructor === Object) {
                obj = obj[_key];
            }
            if (obj == _value) {
                _index = index;
                return true;
            }
            return false
        })
        return _index;
    } 
}
 

Object.assign(passengerHandler.prototype, functional);

export default new passengerHandler();