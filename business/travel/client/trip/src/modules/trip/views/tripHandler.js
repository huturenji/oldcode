/*
 * @Descripttion: 行程公共js方法
 * @version: 
 * @Author: yg
 * @Date: 2019-05-16 15:20:51
 * @LastEditors: yg
 * @LastEditTime: 2019-08-07 09:39:19
 */
//引入公共的配置文件
// import {functional} from 'platform/functional/src/index';
import Bus from './common/bus/bus.js';
// base64解析
import Base64Local from './common/base64/core.js';    
import { Base64 } from 'js-base64';
let { functional } = SnTravel;
let {openPage, dateDiff, showConfirm, indexToWeek, ErrorCodeMap, NETWORK_ERR_SCENE, BisType, NoticeType, USE_TYPE_ENUM} = functional;

const ORIGIN = functional.HTTP_CONT.ORIGIN;
const OPENPAGE_MAP = { //跳转页面的配置文件
    'order':'travel/static/order/index.html#/',
    'flight':'travel/static/flight/index.html#/',
    'train':'travel/static/train/index.html#/',
    'hotel':'travel/static/hotel/index.html#/',
    'car':'travel/static/car/index.html#/',
    'criterion':'travel/static/personal/index.html#/',
    'mobile':'travel/static/mobile/index.html#/'
};   

NETWORK_ERR_SCENE.push('index.html#/');//配置需要展示“网络不给力”的页面
functional.WhiteList.global.push('/cashcoupon/v1/receive');

/*-----------------行程错误码 TRIP_MODULE_ID = "07"-----------------*/
const TripErrorCode = {
    "46070001":{
        text: '超出因公行程限制',
        noticeType: NoticeType.TOAST,
        ignore: true
    },
    "46070002":{
        text: '“行程助手”系统异常，该状态将导致无法因公预订行程，请及时联系客服处理',
        noticeType: NoticeType.CONFIRM,
        showCode: false,
        btnName: ['联系客服', '知道了'],
        bisType: BisType.CONTACTSER,
        phoneNum: functional.BIS_CUSTOMER_SERVICE_PHONE,
        bisStyle: ['color: var(--themeColor)','color: var(--themeColor)']
    },
    "46070003":{
        text: '“行程助手”系统异常，该状态将导致无法因公预订行程，请及时联系客服处理',
        noticeType: NoticeType.CONFIRM,
        showCode: false,
        btnName: ['联系客服', '知道了'],
        bisType: BisType.CONTACTSER,
        phoneNum: functional.BIS_CUSTOMER_SERVICE_PHONE,
        bisStyle: ['color: var(--themeColor)','color: var(--themeColor)']
    },
    "46070006":{
        text: '创建行程失败',
        noticeType: NoticeType.TOAST,
        showCode: true
    },
    "46070007":{
        text: '创建行程失败',
        noticeType: NoticeType.TOAST,
        showCode: true
    },
    "46070010":{
        ignore: true
    }
}
Object.assign(ErrorCodeMap, TripErrorCode);
/** ========================================errorCode end========================================== */

class tripHandler extends functional.baseRequestHandler{

    /**
     * 领取代金券
     */
    receiveCashCoupon(param){
        return this.request('/cashcoupon/v1/receive', param);
    }

    /**
     * 获取火车票时刻表
     */
    getTrainLineByTrainNo(param){
        return this.request('/train/v1/getTrainLineByTrainNo', param);
    }

    /**
     * 创建行程
     */
    createTrip(param){
        return this.request('/trip/v1/createTrip', param);
    }

    /**
     * 获取行程列表
     */
    getTripList(param){
        return this.request('/trip/v1/getTripList', param);
    }

    /**
     * 删除行程 包括历史行程
     */
    deleteTrip(param){
        return this.request('/trip/v1/deleteTrip', param);
    }

    /**
     * 删除行程里面的订单
     */
    deleteOrder(param){
        return this.request('/trip/v1/deleteSubTrip', param);
    }
    
    /**
     * 查询差标异常信息
     * @param {*} param 
     */
    getExcessData(param){
        return this.request('/special-permission/v1/queryBusinessAbnormalMessage', param);
    }


    /************** 删除行程开始*************/ 
    //确认删除行程的弹窗
    confirmDeleteTrip(trip,isHis){
        let that = this;
        let str = '确认删除该行程？';
        showConfirm(str, function(){
            that.deleteTripFun(trip,isHis);
        }, 2, '取消', '删除', null, null, true);
    }
    
    //删除行程的接口
    deleteTripFun(trip, isHis){
        
        let that = this;
        let param = {
            tripNo: trip.tripNo
        }
        that.deleteTrip(param).then(res=>{
            if (res.resultCode == '0'){
                if (isHis){
                    that.reGetHisTripList(); 
                } else {
                    that.reGetTripList();
                }
            }
        }).catch(e=>{
            console.log(e);
            console.log('删除行程失败');
        })
    }

    /************** 删除行程结束*************/ 


    /************** 删除订单开始*************/ 
    /**
     * 删除订单方法
     * @type  类型 train flight hotel car
     * @typeObj train flight hotel car对象
     * @trip 行程对象
     * @judgeTime  判断订单是否是已结束的
     * @isHis  判断是来自历史行程的删除
     */
    deleteOrderFun(type,typeObj,trip,judgeTime,isHis){
        let that = this;
        //删除行程下的订单的时候如下情况需要直接删除行程 而不是删除订单
        //1.因私的行程订单
        //2.有特殊授权因公的行程订单
        if (trip.tripTypeEnum == USE_TYPE_ENUM.PRIVATE.name || (trip.tripTypeEnum == USE_TYPE_ENUM.PUBLIC.name && !trip.cause)){ //此时掉删除行程的接口
            that.confirmDeleteTrip(trip,isHis);
        } else {
            let str = '确认删除该卡片？';
            showConfirm(str, function(){
                that.deleteOrderItem(typeObj.orderNo, isHis, trip.tripNo);
            }, 2, '取消', '删除', null, null, true);
        }
    }

    //删除订单方法
    deleteOrderItem(orderNo, isHis, tripNo){
        let that = this;
        that.deleteOrder({subTripNo:orderNo,tripNo:tripNo}).then(res=>{
            if (res.resultCode == '0'){
                if (isHis){
                    that.reGetHisTripList(); 
                } else {
                    that.reGetTripList();
                }
            }
        }).catch(e=>{
            console.log(e);
            console.log('删除订单失败');
        })
    }

    /************** 删除订单结束*************/ 
    //删除完行程后 重新获取行程列表
    reGetTripList(){
        Bus.$emit('reGetTripList');
    }

    //删除完行程后 重新获取历史行程列表
    reGetHisTripList(){
        Bus.$emit('reGetHisTripList');
    }

    /**
     * 打开订单详情
     * @param {Object} orderType   详情类型，分为酒店hotel、火车票train、机票flight
     * @param {Object} orderNo     订单NO
     * @param {Object} isSelf     是否是自己下的订单
     * @param {Object} founderName 下单人      
     */
    openOrderDetail(orderType,orderNo){
        
        let that = this;

        //注释掉为别人预定的不能查看订单详情的场景
        // if (!isSelf) {
        //     var founderName = founderName || '他人';
        //     let des = '该订单由' + founderName + '为您预订，如需改签或退票，请联系' + founderName;
        //     showConfirm(des, null, 1,'', '知道了');
        // }else{
        //     let url = that.genAPPUrl('order') + orderType+'/orderDetail?orderNo='+orderNo+'&pageFrom=trip'
        //     openPage(url);
        // }

        let url = that.genAPPUrl('order') + 'detail/'+orderType + '?orderNo=' + orderNo + '&pageFrom=trip'
        openPage(url);
    }

    /**
     *  下单
     * @param {*} appName   应用
     * @param {*} trip    行程信息
     * @param {*} index   应用在界面的位置
     */
    toOrder(appName, trip, index, type){
        let that = this;
        
        //审批中时，弹窗展示  暂时屏蔽掉审批中的行程不能预定火车票 机票的功能
        // if(trip.tripStatusEnum == 'APPLY'){
        //     showConfirm('出差申请正在审批中，请在审批通过后预订', null, 1, null, '确定', null, null, true);
        // }
        // if(that.isTripInValid(trip)) return;
        
        
        if (!!trip) {
            let newUrl = that.genAPPUrl(appName);
            if (appName == 'car'){ //商务用车只需要传TripNo和pageFrom
                newUrl = newUrl + '?TEntry=' + index + "&tripNo=" + trip.tripNo + "&pageFrom=trip";
            } else if (appName == 'train' || type == 'train'){ //火车票写死跳转到同程
                sinosdk.sino.openThirdApplet({url: 'https://m.ly.com/universal/touch/?refid=85141262#/'})
                return;
            } else {
                let departCityName = trip.departCityName;
                let arriveCityName = trip.arriveCityName;
                //如果该行程没有填写出发地和目的地，此时将出发地和目的地均置为空字符串
                if (!!!departCityName || !!!arriveCityName){
                    departCityName = arriveCityName = ''
                }   

                newUrl = newUrl + '?TEntry=' + index + "&tripNo=" + trip.tripNo + "&startCity=" + departCityName +
                        "&endCity=" + arriveCityName + "&arriveTime=" + new Date(trip.arriveTime).getTime() +
                        "&departTime=" + new Date(trip.departTime).getTime() + "&pageFrom=trip";
                type && (newUrl += '&type=' + type)
            }
            openPage(newUrl);
        } else {
            //TODO SOMETHING
        }
    }

    /**
     * 验证行程是否合法
     * @param {Object} trip  行程信息
     */
    isTripInValid(trip) {
        var dataArr = new Date(Date.parse(trip.arriveTime));
        var today = new Date(Date.parse(new Date().format('yyyy/MM/dd')));
        //判断时间和行程的状态必须是申请中
        return (!!trip.flowId && dataArr < today) || trip.tripStatusEnum == 'APPLY';
    }

    /**
    * 计算相隔时间
    * @param {Object} startTime  开始时间
    * @param {Object} endTime  结束时间
    */
    countTime(startTime, beginTime, endTime, type){
        let that = this;
        let difArr = dateDiff(beginTime, startTime);
        let str = '';
        let strType = '出发';
        if (type == 'hotel'){
            strType = '入住'
        }
        if (difArr.length > 0){
            if (difArr[0] == '0'){
                if (difArr[1] == '0'){
                    if (difArr[2] == '0'){
                        str = that.judgeTriping(endTime, type);
                    } else {
                        str = difArr[2] + '分后' + strType;
                    }
                } else {
                    str = difArr[1] + '小时后' + strType;
                }
            } else if (type=='hotel' || difArr[1] == '0'){
                str = difArr[0] + '天后' + strType;
            } else {
                str = difArr[0] + '天' + difArr[1] + '小时后' + strType;
            }
        } else {
            str = that.judgeTriping(endTime, type);
        }
        return str;
    }

    //判断是否在行程中
    judgeTriping(endTime, type){
        let str = '';
        if (type == 'hotel'){
            let todayTime = new Date(new Date().format('yyyy/MM/dd')).getTime();
            if (endTime >= todayTime){
                str = '入住中';
            } else {
                str = '已结束';
            }
        } else {
            let nowTime = new Date().getTime();
            if (endTime >= nowTime){
                str = '行程中';
            } else {
                str = '已结束';
            }
        }
        return str;
    }

    /**
    * 计算相隔时间
    * @param {Object} startTime  开始时间
    * @param {Object} endTime  结束时间
    */
    runTime(startTime,endTime){
        let difArr = dateDiff(endTime,startTime);
        return 0<difArr.length
            ?(difArr[0] == 0 ? '' : (difArr[0] + '天')) + 
        difArr[1] + '小时' + difArr[2] +'分'
            :'';
    }

    /**
    * 时间转换为年月
    * @param {Object} date  时间
    */
    handleDate2Month(date) {
        return new Date(date).format('MM月dd日')
    }

    /**
    * 时间转换为年月
    * @param {Object} date  时间
    */
    handleDate(date) {
        return new Date(date).format('yyyy年MM月dd日')
    }

    /**
     * 计算总时间天数
     * @param {Object} startTime  开始时间
     * @param {Object} endTime  结束时间
     */
    handleTotalDay(startTime,endTime) {
        return parseInt((endTime-startTime) / (24 * 3600 * 1000));
    }

    /**
     * 时间转换星期
     * @param {Object} num  星期几
     * @param {Object} type 格式
     */
    genWeek(num, type){
        return indexToWeek(num, type);
    }
  
    /**
     * 跳转到差标页面
     * @param {*} appName  应用名称
     * @param {*} url 
     */
    goCriterion(appName, url){
        //获取差标应用url
        openPage(this.genAPPUrl(appName)+url);
    }

    /**
     * 打开地图
     * @param {*} appName 
     * @param {*} url
     */
    showMap(appName,url){
        openPage(this.genAPPUrl(appName)+url);
    }

    /**
     * 生成应用url
     * @param {*} appName  应用名称
     */
    genAPPUrl(appName){
        return ORIGIN + OPENPAGE_MAP[appName];
    }

    //Base64Local为非正规和规范的base64加解码方法，咱们自己在后面加了一个“=”号。
    //此处银企通审批和商旅审批后续都会改成行业规范的base64加解码库（js-base64）但是为了兼容之前部署的银行版本，此处需要针对旧的做一个兼容
    //解析银企通出差条转过来的参数
    getBuyTicketParam(data){
        data = data.replace(/\s+/g,""); //去掉空格
        let buyTicketParam = {};
        try {
            buyTicketParam = JSON.parse(Base64.decode(decodeURIComponent(data)));
            console.log('外部标准的js-base64库加解码');
        } catch (err) {
            buyTicketParam = JSON.parse(Base64Local.decode(decodeURIComponent(data)));
            console.log('本地的base加解码');
        } 
        return buyTicketParam; 
    }
}


Object.assign(tripHandler.prototype, functional);
export default new tripHandler();
