
export let Deal = [
    {
        text: "资源管理员",
        value: "W"
    },
    {
        text: "主管理员",
        value: "A"
    },
    {
        text: "普通管理员",
        value: "X"
    }
]
export let userLists = [
    {
        servicenum: "1张三",
        oedernumber: 'lisisi.c',
        goodsname: "13888888888",
        ervicetype: "13888888888@163.com",
        reason: "资源管理员",


    },
    {
        servicenum: "2张三",
        oedernumber: 'lisisi.c',
        goodsname: "13888888888",
        ervicetype: "13888888888@163.com",
        reason: "主管理员",


    },
    {
        servicenum: "3张三",
        oedernumber: 'lisisi.c',
        goodsname: "13888888888",
        ervicetype: "13888888888@163.com",
        reason: "普通管理员",


    }
]
export let pageSizeOpts = [
    5,
    10,
    20,
    50,
    100,
]
/**
 * 数组去重
 * @param {JSONObject} arr 
 * @param {String} key 
 */

export function removedDuplicate(arr, keys) {
    let obj = {};
    arr = arr.reduce(function (item, next) {
        obj[next[keys]] ? "" : (obj[next[keys]] = true && item.push(next));
        return item;
    }, []);
    return arr
}
/**
 * 过滤两个数组的相同项
 * @param {*} allArr 
 * @param {*} CheckArr 
 */
export function filterCommonData(allArr, CheckArr) {

    let arr = [];
    arr = allArr.filter(user => {
        return CheckArr.includes(user.userId);
    });
    return arr
}

// 返回两个数组不同
export function getArrEqual(arr1, arr2) {
    let newArr = [];
    for (let i = 0; i < arr2.length; i++) {
        for (let j = 0; j < arr1.length; j++) {
            if (arr1[j] === arr2[i]) {
                newArr.push(arr1[j]);
            }
        }
    }
    return newArr;
}

export let authorilyData = [
    { type: "首页", authList: ["首页"], checkdata: [] },
    {
        type: "供应商管理",
        checkdata: [],
        authList: [
            "新建供应商",
            "查看详情",
            "编辑详情",
            "启用/停用供应商"
        ]
    },
    {
        type: "渠道管理",
        checkdata: [],
        authList: [
            "新建渠道",
            "查看详情",
            "编辑详情",
            "启用/停用渠道"
        ]
    },
    {
        type: "商品下架管理",
        checkdata: [],
        authList: [
            "新建下架规则",
            "查看规则详情",
            "编辑规则",
            "启用/停用规则"
        ]
    },
    {
        type: "商品定价管理",
        checkdata: [],
        authList: [
            "新建定价规则",
            "查看规则详情",
            "编辑规则",
            "启用/停用规则"
        ]
    },
    {
        type: "销售订单",
        checkdata: [],
        authList: [
            "新建定价规则",
            "查看规则详情",
            "编辑规则",
            "启用/停用规则"
        ]
    },
    {
        type: "采购订单",
        checkdata: [],
        authList: [
            "新建定价规则",
            "查看规则详情",
            "编辑规则",
            "启用/停用规则"
        ]
    },
    {
        type: "服务单管理",
        checkdata: [],
        authList: [
            "新建定价规则",
            "查看规则详情",
            "编辑规则",
            "启用/停用规则"
        ]
    },
    {
        type: "客服坐席",
        checkdata: [],
        authList: [
            "新建定价规则",
            "查看规则详情",
            "编辑规则",
            "启用/停用规则"
        ]
    },
    {
        type: "发票重开",
        checkdata: [],
        authList: [
            "新建定价规则",
            "查看规则详情",
            "编辑规则",
            "启用/停用规则"
        ]
    },
    {
        type: "投诉建议",
        checkdata: [],
        authList: [
            "新建定价规则",
            "查看规则详情",
            "编辑规则",
            "启用/停用规则"
        ]
    },
    {
        type: "用户管理",
        checkdata: [],
        authList: [
            "新建定价规则",
            "查看规则详情",
            "编辑规则",
            "启用/停用规则"
        ]
    },
    {
        type: "角色管理",
        checkdata: [],
        authList: [
            "新建定价规则",
            "查看规则详情",
            "编辑规则",
            "启用/停用规则"
        ]
    }
]