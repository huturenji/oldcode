/**
 * 订单服务状态枚举，所有状态在这里声明和转换
 * 拒绝在业务代码中硬编码状态值。所有状态都应使用这个枚举中的对象属性
 * 【说明】理论上，一种state可能对应多种订单状态，因此这里将state和statu分开了。
 *        但商城目前的statu比较少，因此和state是一一对应的，但请保留这种写法，便于后续扩展
 */

export const OrderState = {
    ALL: {
        code: 0,
        name: '全部'
    },//全部
    UNAPPROVAL: {
        code: 1,
        name: '待审批'
    },//待审批
    UNPAID: {
        code: 2,
        name: '待付款'
    },//待付款
    // UNDELIVERY: {
    //     code: 3,
    //     name: '待发货'
    // },//待发货
    UNRECEIVED: {
        code: 4,
        name: '待收货'
    },//待收货
    COMPLETE: {
        code: 5,
        name: '已完成'
    },//已完成
    CANCELED: {
        code: 6,
        name: '已取消'
    },//已取消
}


// 智齿科技的订单与商城订单status对应的map
// 订单状态，1: '待付款',2: '待发货',3: '运输中', 4: '派送中',5: '已完成', 6: '待评价',7: '已取消',
export const zcOrderStateMap = {
    [OrderState.CANCELED.code]: 7,
    [OrderState.UNPAID.code]: 1,
    [OrderState.UNRECEIVED.code]: 4,
    [OrderState.COMPLETE.code]: 5,
}


export const OrderStatusEnum = {
    UNAPPROVAL:{//待审批
        code: 1,
        state: OrderState.UNAPPROVAL.code,
        name: '待审批',
        classLabel: 'unapproval',
    },
    UNPAID: {//未支付
        code: 2,
        state: OrderState.UNPAID.code,
        name: '待付款',
        classLabel: 'unpaid',
    },
    // UNDELIVERY: {//待发货
    //     code: 3,
    //     state: OrderState.UNDELIVERY.code,
    //     name: '待发货'
    //     classLabel: {
    //         detail: 'undelivered',
    //     }
    // },
    UNDELIVERED: {//待收货
        code: 4,
        state: OrderState.UNRECEIVED.code,
        name: '待收货',
        classLabel: 'unreceived',
    },
    COMPLETE: {//已完成
        code: 5,
        state: OrderState.COMPLETE.code,
        name: '已完成',
        classLabel: 'complete',
    },
    CANCELED: {//取消
        code: 6,
        state: OrderState.CANCELED.code,
        name: '已取消',
        classLabel: 'canceled',
    },
}
//申请采购审批单状态
// flowStatus 表单的状态，0：审批中，1：审批通过 ， 2：审批不通过  ，3：撤销，
export const FlowStatus = {
	'0':{
		src: require('../../../../../themes/default/img/order/snapshot/components/approveInfo/icon_work_pendingtrial.svg'), 
		text: '待审批', 
		tips: '申请成功,待审批', 
        tipsColor:'colorYellow',
        actionType:'UPDATA',
        formState:0
    },
    '1':{
		src: require('../../../../../themes/default/img/order/snapshot/components/approveInfo/icon_work_pass.svg'), 
		text: '已通过', 
		tips: '采购申请已同意',
        tipsColor:'colorGreen',
        actionType:'UPDATEAPPROVESTATE',
        formState:1
    },
	'2':{
		src: require('../../../../../themes/default/img/order/snapshot/components/approveInfo/icon_work_refuse.svg'), 
		text: '已拒绝', 
		tips: '采购申请已拒绝',
        tipsColor:'colorRed',
        actionType:'UPDATEAPPROVESTATE',
        formState:2
    },
	'3':{
		src: require('../../../../../themes/default/img/order/snapshot/components/approveInfo/icon_work_repeal.svg'), 
		text: '已撤销', 
		tips: '采购申请已撤销',
        tipsColor:'colorGray',
        actionType:'UPDATEAPPROVESTATE',
        formState:2
    },
	'canceled':{
		src: require('../../../../../themes/default/img/order/snapshot/components/approveInfo/icon_work_repeal.svg'), 
		text: '已取消', 
		tips: '订单已取消',
        tipsColor:'colorGray',
        actionType:'UPDATEAPPROVESTATE',
        formState:2
    },
}


/**-----------Functions-------------**/
/**
 * 获取订单状态
 * @param  {...any} nameArr 返回所需要的状态，不传则返回所有 
 */
export function getOrderStates(...nameArr){
    var result = {}
    if(!!nameArr){
        nameArr.forEach(name=>{
            result[name] = OrderState[name];
        })
        return result;
    }else{
        return OrderState;
    }
}

export function getOrderStatus(code, payload={}){
    let result = {};
    if(!!code){
        Object.keys(OrderStatusEnum).some(key=>{
            if(OrderStatusEnum[key].code == code){
                result = OrderStatusEnum[key];
                return true;
            }
        })
    }
    //公款转账的订单直接显示“支付中”
    if(code == 2 && (payload.paymentType || '').indexOf('TRANSFER_PAY')>-1){
        result = JSON.parse(JSON.stringify(result))//深拷贝
        result.name = '支付中'
    }
    return result;
}

//大小件标记，1=中小件，2=大件 100代表苏宁
export const skuClassifyMap = {
    2: '大件',
    1: '中小件',
    100: '快递'
}

//涉及厂家配送的商品，送达时间展示的文字提示
export const factoryDateTips = '工作日、双休日与节假日均可送货';