//引入公共的配置文件
// import {functional} from 'platform/functional/src/index';
import Bus from '../utils/bus.js';
// base64解析
let { functional } = SnTravel;
let {openPage, showConfirm, ErrorCodeMap, NETWORK_ERR_SCENE, BisType, NoticeType, USE_TYPE_ENUM} = functional;

const ORIGIN = functional.HTTP_CONT.ORIGIN;
const OPENPAGE_MAP = { //跳转页面的配置文件
    'order':'travel/static/order/index.html#/',
    'flight':'travel/static/flight/index.html#/',
    'train':'travel/static/train/index.html#/',
    'hotel':'travel/static/hotel/index.html#/',
    'car':'travel/static/car/index.html#/',
    'criterion':'travel/static/personal/index.html#/'
};   

NETWORK_ERR_SCENE.push('index.html#/');//配置需要展示“网络不给力”的页面


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
     * 获取火车票时刻表
     */
    getTrainLineByTrainNo(param){
        return this.request('/train/v1/getTrainLineByTrainNo', param);
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
        let url = that.genAPPUrl('order') + 'detail/'+orderType + '?orderNo=' + orderNo + '&pageFrom=trip'
        openPage(url);
    }

    /**
     * 生成应用url
     * @param {*} appName  应用名称
     */
    genAPPUrl(appName){
        return ORIGIN + OPENPAGE_MAP[appName];
    }

}


Object.assign(tripHandler.prototype, functional);
export default new tripHandler();
