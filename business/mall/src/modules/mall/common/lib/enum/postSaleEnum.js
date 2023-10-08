//售后模块

//售后类型
export const CUSTOMER_EXPECT_LIST = [
    {
        code: 10,
        key: 'icon_mall_tuihuo',
        name: '退货'
    }, {
        code: 20,
        key: 'icon_mall_huanhuo',
        name: '换货'
    }, {
        code: 30,
        key: 'icon_mall_weixiu',
        name: '维修'
    }
];

//逆向配送方式
export const PICKWARE_TYPE_LIST = [
    {
        code: 40,
        name: '客户发货'
    }, {
        code: 4,
        name: '上门取件'
    }
];

//售后状态
export const STATE_LIST = [
    {
        code: 1,
        name: '已创建'
    }, {
        code: 2,
        name: '客服审核不通过'
    }, {
        code: 3,
        name: '客服审核通过'
    }, {
        code: 4,
        name: '供应商审核取消'
    }, {
        code: 5,
        name: '供应商审核不通过'
    }, {
        code: 6,
        name: '供应商审核通过'
    }, {
        code: 7,
        name: '供应商处理完成'
    }, {
        code: 8,
        name: '待用户确认'
    }, {
        code: 9,
        name: '完成'
    }, {
        code: 10,
        name: '取消'
    }
];
    //售后服务进度
export const SERVICE_STEP_LIST = [
    {
        code: 10,
        name: '申请中'
    }, {
        code: 20,
        name: '客服审核中'
    }, {
        code: 21,
        name: '客服审核不通过'
    }, {
        code: 30,
        name: '供应商审核中'
    }, {
        code: 31,
        name: '供应商审核不通过'
    }, {
        code: 32,
        name: '供应商审核取消'
    }, {
        code: 40,
        name: '供应商处理中'
    }, {
        code: 50,
        name: '客服处理中'
    }, {
        code: 60,
        name: '用户确认中'
    }, {
        code: 70,
        name: '服务单完成'
    }, {
        code: 80,
        name: '服务单取消'
    }
];