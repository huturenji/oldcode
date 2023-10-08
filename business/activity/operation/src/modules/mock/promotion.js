import Mock from "mockjs";
//统一设置异步耗时
Mock.setup({ timeout: 1200 });

let promotionList = [];
const count = 46;
for (let i = 0; i < count; i++) {
    promotionList.push(
        Mock.mock({
            countId: Mock.Random.id(),
            company: '@ctitle(8)公司',
            promotion_name: '@ctitle(10)',
            promotion_type: Mock.Random.natural(1, 4),
            lucky_count: Mock.Random.natural(1, 1000),
            creat_time: Mock.Random.natural(1655050000, 1657109251),
            use_time: Mock.Random.natural(1655050000, 1657109251),
            status: Mock.Random.natural(1, 3),
        })
    );
}

// 获取活动列表
Mock.mock('/media/admin/v1/getPromotionList', 'post',(req) => {
    // 假设按照 页数 ，页码 ， 状态 ，名字依次过滤查询
    const { pageIndex, pageSize, status, company, promotion_type} = JSON.parse(req.body);

    const mockList = promotionList.filter((obj) =>status ? obj.status == status : obj)
    .filter((obj) =>promotion_type ? obj.promotion_type == promotion_type : obj)
    .filter((obj) =>company ? obj.company == company : obj)
                            //   .filter((obj) => (name ? obj.name.indexOf(name) != -1 : obj));
//    const mockList = promotionList;
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
            "hitResultVOList":pageList
        }
    }
})


// // 新增
// Mock.mock('/media/admin/v1/add', 'post',(req) => {
//     let addJSON = JSON.parse(req.body)
//     let item = Object.assign({
//         id: Mock.Random.id(),
//         active_name: Mock.Random.word(),
//         custom_id: Mock.Random.word(),
//         custom_name: Mock.Random.string("upper", 5),
//         goods_info: Mock.Random.word(),
//         set_method: '线下',
//         time: Mock.Random.now("yyyy-MM-dd HH:mm:ss"),
//         money: 100,
//         status: Mock.Random.natural(0, 2)

//     },addJSON)
//     promotionList.unshift(item)
//     return {
//         resultCode: 0,
//         resultMessage: "新增成功",
//         result:{}
//     }
// })

// // 编辑
// Mock.mock('/media/admin/v1/edit', 'post',(req) => {
//     let editJSON = JSON.parse(req.body)
//     promotionList = promotionList.map((row) => {
//         if (row.id == editJSON.id) {
//             // row = { ...row, ...editJSON }    这里不支持...展开语法
//             row = Object.assign(row,editJSON)
//         }
//         return row
//     })
//     return {
//         resultCode: 0,
//         resultMessage: "编辑成功",
//         result:{}
//     }
// })


// // 删除
// Mock.mock('/media/admin/v1/del', 'post',(req) => {
//     const { id } = JSON.parse(req.body)
//     promotionList = promotionList.filter((row) => !id.includes(row.id))
//     return {
//         resultCode: 0,
//         resultMessage: "删除成功",
//         result:{}
//     }
// })