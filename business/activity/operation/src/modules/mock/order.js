import Mock from "mockjs";
//统一设置异步耗时
Mock.setup({ timeout: 1200 });
function getRandomArrayElements(arr, count) {
    var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
}
let skuListItem = Mock.mock({
    "array": [
        {sku:Mock.mock(/^JD\d{8}/),skuName:'华为P50 256G',price1:6999,price2:6999,price3:6999,num:2,supply:'京东企业购',skuImage:Mock.Random.image('200x200', '#50B347', '#FFF', '1')},
        {sku:Mock.mock(/^JD\d{8}/),skuName:'荣耀Play6T荣耀Play6T 6.74英寸高刷护眼屏 侧边指纹解锁 5000mAh大电池 全网通 5G手机 8GB+128GB 钛空银444444444444444荣耀Play6T荣耀Play6T 6.74英寸高刷护眼屏 侧边指纹解锁 5000mAh大电池 全网通 5G手机 8GB+128GB 钛空银荣耀Play6T荣耀Play6T 6.74英寸高刷护眼屏 侧边指纹解锁 5000mAh大电池 全网通 5G手机 8GB+128GB 钛空银444444444444444荣耀Play6T荣耀Play6T 6.74英寸高刷护眼屏 侧边指纹解锁 5000mAh大电池 全网通 5G手机 8GB+128GB 钛空银',price1:2999,price2:3999,price3:4999,num:6,supply:'京东企业购',skuImage:Mock.Random.image('200x200', '#50B347', '#FFF', '1')},
        {sku:Mock.mock(/^JD\d{8}/),skuName:'苹果手机 128G',price1:5666,price2:5666,price3:5888,num:7,supply:'京东企业购',skuImage:Mock.Random.image('200x200', '#50B347', '#FFF', '1')},
        {sku:Mock.mock(/^JD\d{8}/),skuName:'荣耀平板 黑色',price1:999,price2:399,price3:499,num:5,supply:'京东企业购',skuImage:Mock.Random.image('200x200', '#50B347', '#FFF', '1')},
        {sku:Mock.mock(/^JD\d{8}/),skuName:'VR 眼镜',price1:564,price2:564,price3:564,num:12,supply:'京东企业购',skuImage:Mock.Random.image('200x200', '#50B347', '#FFF', '1')},
        {sku:Mock.mock(/^JD\d{8}/),skuName:'小熊饼干 袋装',price1:12,price2:12,price3:12,num:24,supply:'京东企业购',skuImage:Mock.Random.image('200x200', '#50B347', '#FFF', '1')},
    ]
  }).array
let orderList = [];
const count = 65;
for (let i = 0; i < count; i++) {
    orderList.push(
        Mock.mock({
            id: Mock.Random.id(),             //订单流水号
            active_no:Mock.mock(/^\d{8}/),    // 活动编号
            active_name: Mock.Random.cword(5, 7)+'活动',
            phone: Mock.mock(/^1[385][1-9]\d{8}/),
            custom_name: Mock.Random.cword(5, 7)+'公司',
            goods_info: Mock.Random.word(),
            set_method: '线下',
            time: Mock.Random.now("yyyy/MM/dd HH:mm:ss"),
            money: Mock.mock({"money|100-10000.2": 1}).money,
            money_status: Mock.Random.natural(1, 2),  // 已付款  未付款
            status: Mock.Random.natural(1, 2),   // 未审核  已审核  
            checkStatus: Mock.Random.natural(1, 2),   // 通过  拒绝
            skuList:getRandomArrayElements(skuListItem,Mock.Random.natural(2,4)),
            remark:Mock.mock('@csentence'),
            attachUrl:Mock.Random.image('200x100', '#4A7BF7', 'Hello'),
            attachName:'cc.png',
            operate:Mock.Random.cname()
        })
    );
}

// 获取列表
Mock.mock('/media/admin/v1/getOrderList', 'post',(req) => {
    // 假设按照 页数 ，页码 ， 状态 ，名字依次过滤查询
    const { pageIndex, pageSize, status, checkStatus} = JSON.parse(req.body);
    console.log(JSON.parse(req.body))

    const mockList = orderList.filter((obj) =>status ? obj.status == status : obj)
                              .filter((obj) => (checkStatus ? obj.checkStatus == checkStatus: obj));
    console.log(mockList)
   
    const pageList = mockList.filter(
        (item, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
    );
    return {
        resultCode: 0,
        resultMessage: "ok",
        result:{
            "pageCount":  Math.ceil(mockList.length/pageSize),
            "pageSize": pageSize,
            "pageIndex": pageIndex,
            "resultCount": mockList.length,
            "hitResult":pageList
        }
    }
})

// 新增
Mock.mock('/media/admin/v1/add', 'post',(req) => {
    let addJSON = JSON.parse(req.body)
    let item = Object.assign({
        id: Mock.Random.id(),
        active_name: Mock.Random.word(),
        custom_id: Mock.Random.word(),
        custom_name: Mock.Random.string("upper", 5),
        goods_info: Mock.Random.word(),
        set_method: '线下',
        time: Mock.Random.now("yyyy-MM-dd HH:mm:ss"),
        money: 100,
        status: Mock.Random.natural(0, 2)

    },addJSON)
    orderList.unshift(item)
    return {
        resultCode: 0,
        resultMessage: "新增成功",
        result:{}
    }
})

// 编辑
Mock.mock('/media/admin/v1/edit', 'post',(req) => {
    let editJSON = JSON.parse(req.body)
    orderList = orderList.map((row) => {
        if (row.id == editJSON.id) {
            // row = { ...row, ...editJSON }    这里不支持...展开语法
            row = Object.assign(row,editJSON)
        }
        return row
    })
    return {
        resultCode: 0,
        resultMessage: "编辑成功",
        result:{}
    }
})


// 删除
Mock.mock('/media/admin/v1/del', 'post',(req) => {
    const { id } = JSON.parse(req.body)
    orderList = orderList.filter((row) => !id.includes(row.id))
    return {
        resultCode: 0,
        resultMessage: "删除成功",
        result:{}
    }
})


// 获取详情
Mock.mock('/media/admin/v1/getOrderDeatil', 'post',(req) => {
    const { id } = JSON.parse(req.body)
    const item = orderList.filter((row) => id.includes(row.id))[0]
    return {
        resultCode: 0,
        resultMessage: "获取成功",
        hitResult:item
    }
})


// 审核通过
Mock.mock('/media/admin/v1/checkSuccess', 'post',(req) => {
    let editJSON = JSON.parse(req.body)
    orderList = orderList.map((row) => {
        if (row.id == editJSON.id) {
            // row = { ...row, ...editJSON }    这里不支持...展开语法
            row = Object.assign(row,editJSON)
        }
        return row
    })
    return {
        resultCode: 0,
        resultMessage: "编辑成功",
        result:{}
    }
})

// 上传
// Mock.mock('/media/file/v1/upload?c=static&p=/media/file&n=cc.png', 'post',(req) => {
//     console.log(2222,req)
//     return {
//         resultCode: 0,
//         resultMessage: "编辑成功",
//         result:{}
//     }
// })