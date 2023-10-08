import Mock from "mockjs";
//统一设置异步耗时
Mock.setup({ timeout: 1200 });

let orderList = [];
const count = 65;
for (let i = 0; i < count; i++) {
    orderList.push(
        Mock.mock({
            id: Mock.Random.id(),
            active_no:Mock.mock(/^\d{8}/),
            active_name: Mock.Random.cword(5, 8),
            phone: Mock.mock(/^1[385][1-9]\d{8}/),
            custom_name: Mock.Random.cword(5, 8),
            goods_info: Mock.Random.word(),
            set_method: '线下',
            time: Mock.Random.now("yyyy-MM-dd HH:mm:ss"),
            money: Mock.mock({"money|100-10000.2": 1}).money,
            money_status: Mock.Random.natural(1, 2),  // 已付款  未付款
            status: Mock.Random.natural(1, 2),   // 未审核  已审核  
            checkStatus: Mock.Random.natural(1, 2),   // 通过  拒绝
            skuList:[
                {sku:Mock.mock(/^JD\d{8}/),skuName:'华为P50 256G',price1:6999,price2:6999,price3:6999,num:2,supply:'京东企业购',skuImage:Mock.Random.image('200x200', '#50B347', '#FFF', '1')},
                {sku:Mock.mock(/^JD\d{8}/),skuName:'Mate40 256G',price1:2999,price2:3999,price3:4999,num:2,supply:'京东企业购',skuImage:Mock.Random.image('200x200', '#50B347', '#FFF', '1')},
            ],
            remark:Mock.mock('@csentence'),
            attachUrl:Mock.Random.image('200x100', '#4A7BF7', 'Hello'),
            attachName:'cc.png',
            accountName:Mock.Random.cword(5, 8)+'科技公司',
            accountBank:'招商银行泰然支行',
            accountNo:Mock.mock(/^\d{16}/)
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