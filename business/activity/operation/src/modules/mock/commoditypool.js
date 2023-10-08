import Mock from "mockjs";
Mock.setup({ timeout: 1200 });


//获取随机数组
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
        { sku: Mock.mock(/JD\d{10}/), skuName: '华为P50 256G', price: 9999, supply: '京东企业购', goodsImage: Mock.Random.image('200x200', '#50B347', '#FFF', '1') },
        { sku: Mock.mock(/JD\d{10}/), skuName: '荣耀Play6T荣耀Play6T 6.74英寸高刷护眼屏 侧边指纹解锁 5000mAh大电池 全网通 5G手机 8GB+128GB 钛空银444444444444444荣耀Play6T荣耀Play6T 6.74英寸高刷护眼屏 侧边指纹解锁 5000mAh大电池 全网通 5G手机 8GB+128GB 钛空银荣耀Play6T荣耀Play6T 6.74英寸高刷护眼屏 侧边指纹解锁 5000mAh大电池 全网通 5G手机 8GB+128GB 钛空银444444444444444荣耀Play6T荣耀Play6T 6.74英寸高刷护眼屏 侧边指纹解锁 5000mAh大电池 全网通 5G手机 8GB+128GB 钛空银', price: 3999, supply: '京东企业购', goodsImage: Mock.Random.image('200x200', '#50B347', '#FFF', '1') },
        { sku: Mock.mock(/JD\d{10}/), skuName: '华为P30 64G', price: 666, supply: '京东企业购', goodsImage: Mock.Random.image('200x200', '#50B347', '#FFF', '1') },
        { sku: Mock.mock(/JD\d{10}/), skuName: '华为P40 256G', price: 6999, supply: '京东企业购', goodsImage: Mock.Random.image('200x200', '#50B347', '#FFF', '1') },
        { sku: Mock.mock(/JD\d{10}/), skuName: '苹果手机10 64G', price: 99, supply: '京东企业购', goodsImage: Mock.Random.image('200x200', '#50B347', '#FFF', '1') },
        { sku: Mock.mock(/JD\d{10}/), skuName: '华为P40 pro 256G', price: 199, supply: '京东企业购', goodsImage: Mock.Random.image('200x200', '#50B347', '#FFF', '1') },
        { sku: Mock.mock(/JD\d{10}/), skuName: '苹果手机11 256G', price: 999, supply: '京东企业购', goodsImage: Mock.Random.image('200x200', '#50B347', '#FFF', '1') },
        { sku: Mock.mock(/JD\d{10}/), skuName: '华为mate50 256G', price: 5999, supply: '京东企业购', goodsImage: Mock.Random.image('200x200', '#50B347', '#FFF', '1') },
        { sku: Mock.mock(/JD\d{10}/), skuName: '华为P50 pro 256G', price: 648, supply: '京东企业购', goodsImage: Mock.Random.image('200x200', '#50B347', '#FFF', '1') },
    ]
}).array

let goodspoolList = [];
const count = 50;
for (let i = 0; i < count; i++) {
    goodspoolList.push(
        Mock.mock({
            id: Mock.Random.id(),
            goodspoolId: Mock.Random.id(),
            goodspoolName: '@ctitle(5)',
            skuList: getRandomArrayElements(skuListItem, Mock.Random.natural(1, 9)),
        })
    );
}

//获取商品池列表
Mock.mock('/media/admin/v1/getcommoditypoolList', 'post', (req) => {
    // 假设按照 页数 ，页码 ， 状态 ，名字依次过滤查询
    const { pageIndex, pageSize, status, checkStatus } = JSON.parse(req.body);
    console.log(JSON.parse(req.body))

    const mockList = goodspoolList.filter((obj) => status ? obj.status == status : obj)
        .filter((obj) => (checkStatus ? obj.checkStatus == checkStatus : obj));
    console.log(mockList)

    const pageList = mockList.filter(
        (item, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
    );
    return {
        resultCode: 0,
        resultMessage: "ok",
        result: {
            "pageCount": Math.ceil(mockList.length / pageSize),
            "pageSize": pageSize,
            "pageIndex": pageIndex,
            "resultCount": mockList.length,
            "hitResult": pageList
        }
    }
})

//商品池详情数据
let goodspoolItem = []
const amount = 100
for (let i = 0; i < amount; i++) {
    goodspoolItem.push(
        Mock.mock({
            sku: Mock.Random.id(),
            goodsName: '@ctitle(5)',
            supply: '@ctitle(5)',
            price: Mock.Random.natural(10, 10000)+'￥',
            skuImage:Mock.Random.image('200x200', '#50B347', '#FFF', '1')
        })
    );
}
let goodspooldetail = [];
goodspooldetail.push(
    Mock.mock({
        "array": [
            { goodspoolId: Mock.Random.id() },
            { goodspoolName: '@ctitle(5)' },
            { goodspoolItem }
        ]
    }).array
)


// 获取商品池详情列表
Mock.mock('/media/admin/v1/getcommoditypoolDeatil', 'post', (req) => {
    // 假设按照 页数 ，页码 ， 状态 ，名字依次过滤查询
    const { pageIndex, pageSize, status, checkStatus } = JSON.parse(req.body);
    // console.log(JSON.parse(req.body))

    const mockList = goodspooldetail.filter((obj) => status ? obj.status == status : obj)
        .filter((obj) => (checkStatus ? obj.checkStatus == checkStatus : obj));
    // console.log(mockList)

    const pageList = mockList.filter(
        (item, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
    );
    return {
        resultCode: 0,
        resultMessage: "ok",
        result: {
            "pageCount": Math.ceil(mockList.length / pageSize),
            "pageSize": pageSize,
            "pageIndex": pageIndex,
            "resultCount": mockList.length,
            "hitResult": pageList
        }
    }
})
