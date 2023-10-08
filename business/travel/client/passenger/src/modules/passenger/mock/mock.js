// 引入mockjs
import Mock from "mockjs";
//获取mock.Random对象 Mock.Random 是一个工具类，用于生成各种随机数据。
const Random = Mock.Random;
//获取乘客列表mock数据的开关
let mockQueryPassenger = false;

// mock一组乘客数据数据 
function psgDataFun(options){
    console.log('options',options);
    return Mock.mock({
        "resultCode": 0,
        "rdesc": null,
        "zip": 0,
        "base64": 0,
        "result": {
            "passengerList|2-6": [
                {
                    "firstName|1": ['li','zhang','fei','liu'],// 随机生成一个常见的英文名。,
                    "LastOrder": '@boolean',//Random.boolean()返回一个随机的布尔值
                    "birthday": Random.date('yyyy/MM/dd'), //生成一个随机日期,可加参数定义日期格式
                    "gender|1": [1,2],
                    "ProdId|+1": 1,
                    "idType": "护照",
                    "operatorCompanyId": 40019,
                    "idNum": "@id", //即为Random.id()
                    "phone": "18745451214",
                    "userUserId": "@guid",
                    "idCode|1": [1],
                    "lastName": Random.first(),// 随机生成一个常见的英文姓。
                    "operatorUserId": 4294968782,
                    "userType": 2,
                    "email":"@email"
                }
            ]
        }
    })
}

if (mockQueryPassenger){
    Mock.mock( /passenger\/queryPassenger/, 'post', psgDataFun);
}
// 不设置延时很有可能遇到坑，这里需要留意，因为真实的请求是需要时间的，mock不设置延时则是马上拿到数据返回，这两个情况不同可能导致在接口联调时出现问题。
//所以最好要先设置延时请求到数据。
//延时400s请求到数据
Mock.setup({
    timeout: 10
})