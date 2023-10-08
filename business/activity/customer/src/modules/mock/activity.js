import Mock from "mockjs";
//统一设置异步耗时
Mock.setup({ timeout: 1000 });

let prizeList = []
const counts = 5;
for (let i = 0; i < counts; i++) {
    prizeList.push(
        Mock.mock({
            sku: Mock.Random.id(),
            name: Mock.Random.cname(),
            img:Mock.Random.image('100x100', '#894FC4', '#FFF', 'png', '666'),
            prizeType: Mock.Random.natural(1, 2),
            price: "999.00",
            total: "9",
            tips: "华为P50华为P50华为P50华为P50华为P50",
            number: "0"
        })
    )
}
let activityList = [];
let winerList = [];
const count = 65;
// list": [
    //       {
    //         "createTime": "2022-07-20T03:16:30.484Z",
    //         "id": 0,
    //         "name": "string",
    //         "prizeList": [
    //           {
    //             "name": "string",
    //             "prizeId": 0,
    //             "remainCount": 0
    //           }
    //         ],
    //         "remainPrizeSum": 0,
    //         "startTime": "2022-07-20T03:16:30.484Z",
    //         "state": 0,
    //         "toolId": 0,
    //         "totalDrawSum": 0
for (let i = 0; i < count; i++) {
    activityList.push(
        Mock.mock({
            id: Mock.Random.id(5,10),
            activityId: Mock.Random.id(5,10),
            avtivityName: Mock.Random.cword(5, 40),
            name: Mock.Random.cword(5, 40),
            type:Mock.Random.pick(['001', '002', '003', '004']),
            typeName: "砸金蛋",
            gameNum:  Mock.Random.natural(10, 999),
            prizeNum:  Mock.Random.natural(0, 20),
            joinNum: "总限制 5 次；每日限制 1 次",
            winNum: "总限制不限制；每日限制 1 次",
            winChance: "5%",
            createTime: Mock.Random.datetime("yyyy-MM-dd HH:mm:ss"),
            startTime: Mock.Random.datetime("yyyy-MM-dd HH:mm:ss"),
            stateType: Mock.Random.natural(1, 3),
            state: "待启用",
            tips: "这是抽奖说明这是抽奖说明这是抽奖说明这是抽奖说明这是抽奖说明这是抽奖说明这是抽奖说明这是抽奖说明这是抽奖说明这是抽奖说明这是抽奖说明",
            totalPrice: '2997.00',
            activityType: Mock.Random.natural(1, 2),
            prizeList:prizeList
        })
    );
    winerList.push(
        Mock.mock({
            id: Mock.Random.id(),
            userName: Mock.Random.cname(),
            createTime: Mock.Random.datetime("yyyy-MM-dd HH:mm:ss"),
            prizeName:Mock.Random.cword(4,19)
})
    )
}
// 获取列表
Mock.mock('/activitystudio/activity/v1/clientActivityList', 'post',(req) => {
    // 假设按照 页数 ，页码 ， 状态 ，名字依次过滤查询
    const { pageIndex, pageSize, type, stateType} = JSON.parse(req.body);
    // console.log(type)
    const mockList = activityList.filter((obj) =>(type != "-10") ? obj.type == type : obj)
                              .filter((obj) => ((stateType != "-10") ? obj.stateType == stateType : obj));
   
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
            "total": mockList.length,
            "list":pageList
        }
    }
})

// 获取详情
Mock.mock('/media/activity/v1/detailActivity', 'post',(req) => {
    let {activityId} = JSON.parse(req.body)
    let detail = activityList.filter((obj) => obj.activityId == activityId )[0]
    return {
        resultCode: 0,
        resultMessage: "新增成功",
        result:detail
    }
})

// 获取中奖人列表/activitystudio/activity/v1/winnerList
Mock.mock('/activitystudio/activity/v1/winnerList', 'post',(req) => {
    let {activityId,pageIndex, pageSize} = JSON.parse(req.body);
    let pageList = winerList.filter(
        (item, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
    );
    return {
        resultCode: 0,
        resultMessage: "ok",
        result:{
            "pageCount":  Math.ceil(winerList.length/pageSize),
            "pageSize": pageSize,
            "pageIndex": pageIndex,
            "total": winerList.length,
            "list":pageList
        }
    }
})

// 获取奖品信息
Mock.mock('/media/activity/v1/getPrize', 'post',(req) => {
    // let editJSON = JSON.parse(req.body)
    // prizeList 
    return {
        resultCode: 0,
        resultMessage: "ok",
        result:prizeList
    }
})
// 补充奖品
Mock.mock('/media/activity/v1/updateprize', 'post',(req) => {
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
    activityList.unshift(item)
    return {
        resultCode: 0,
        resultMessage: "新增成功",
        result:{}
    }
})


