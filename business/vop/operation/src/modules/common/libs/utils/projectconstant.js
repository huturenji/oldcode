/**
 * 项目中不允许直接调用libs的对象。
 * 项目的公共常量 功能：libs里面基础数据已经引入，通过libsConstant暴露。
 */
//上传组件的默认地址，项目的全局配置
// export const uploadUrl = "//jsonplaceholder.typicode.com/posts/"
export const uploadUrl = window.origin + "/mall" + "/file/v1/upload?c=static&p=/mallvop/file&n="
//运营地址导航首页对象 
export const breadcrumbHome = [{ title: "运营管理", routePath: "" }]

export let btnValue = [
    { title: "今天", key: 0, iscutOneDate: false },
    { title: "昨天", key: 1, iscutOneDate: true },
    { title: "近7天", key: 6, iscutOneDate: false },
    { title: "近30天", key: 29, iscutOneDate: false }
]

//发票类型
export const getInvoiceTypeArr = () => {
    return [
        {
            text: "增值税专用发票",
            value: "SPECIAL"
        },
        {
            text: "普通发票",
            value: "NORMAL"
        }
        // {
        //     text: "全部",
        //     value: "ALL",
        // },
    ]
}

//发票申请状态 INVOICING:开票中,INVOICED:申请开票成功,INVOICED_FAIL:申请开票失败
export const getInvoiceApplyArr = () =>{
    return [
        {
            text: "全部",
            value: "ALL",
            color:"#000"
        },
        {
            text: "开票申请中",
            value: "INVOICING",
            color:"#000"
        },
        {
            text: "开票申请成功",
            value: "INVOICED",
            color:"#23b45d"
        },
        {
            text: "开票申请失败",
            value: "INVOICED_FAIL",
            color:"#f56c6c"
        }
    ]
}

export const getInvoiceStatusAllArr = () =>{
    return [
        {
            text: "开票成功",
            value: "INVOICED"
        },
        {
            text: "全部",
            value: "ALL"
        },
        {
            text: "未开票",
            value: "UN_INVOICED"
        },
        {
            text: "开票失败",
            value: "FAILED_INVOICED"
        }       
    ]
}

export const orderStateMap = {
    UNPAID: "待付款",
    // WAIT_FOR_DELIVERY: "待发货",
    WAIT_TO_SIGN: "待收货",
    COMPLETED: "已完成",
    SEPARATED: "已拆单",
    // CLOSED: "已关闭",
    CANCELLED: "已取消"
}

export const invoiceStateMap = {
    UN_INVOICED: '待开票',
    INVOICED: '已开票',
    RE_INVOICING: '换开中',
    RE_INVOICED: '已换开'
}

export const invoiceTypeMap = {
    SPECIAL: '增值税专用发票',
    ELECTRONIC: '电子发票'
}

export const payTypeMap = {
    NO_PAY: '未支付',
    WX_PAY: '微信',
    ALI_PAY: '支付宝',
    WALLET_PAY: '老板付',
    UNION_PAY: '银联支付',
    INBANK_PAY: '行内转账',
    COMPANYWALLET_PAY: '企业支付',
    WX_PAY_TEST: '微信测试',
    ALI_PAY_TEST: '支付宝测试'
}

export const expressStateMap = {
    ORDER_CREATED: '已下单',
    REPOSITORY_PROCESSING: '仓库处理中',
    DELIVERING: '运输中',
    DISPATCHING: '派送中',
    SIGNED: '已签收',
    FAILED: '签收失败',
    CANCELLED: '取消',
    UNKOWN: '未知'
}

export const typeMap = {
    10: "退货",
    20: "换货",
    30: "维修"
}

export const stepMap = {
    10: "审核阶段",
    20: "审核不通过",
    21: "客服审核",
    22: "商家审核",
    31: "平台收货",
    32: "商家收货",
    33: "平台处理",
    34: "商家处理",
    40: "用户确认",
    50: "完成",
    60: "取消"
}

export const statusMap = {
    1: "待处理",
    2: "已处理"
}

export const feedBackTypeMap = {
    1: "订单问题",
    2: "系统问题",
    3: "客服问题",
    4: "其他"
}

export const pickwareTypeMap = {
    4: "上门取件",
    40: "客户发货"
}

export let pageSizeOpts = [
    5,
    10,
    20,
    50,
    100
]

export function getCopyHost(){    
    let hostMap={
        "bplusdev.sinosun.com":"https://bplusdev.sinosun.com:18180",
        "bplussit.sinosun.com":"https://bplussit.sinosun.com:18380",
        "bplus-uat.sinosun.com":"https://bplus-uat.sinosun.com",
        "cloud.sinosun.com":"https://cloud.sinosun.com"
    }    
    return hostMap[window.location.hostname] || window.location.hostname
}