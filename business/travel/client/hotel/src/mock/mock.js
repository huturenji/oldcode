// 引入mockjs
import Mock from "mockjs";
//获取乘客列表mock数据的开关
let MarketingHotel = false;
//获取mock.Random对象 Mock.Random 是一个工具类，用于生成各种随机数据。
const Random = Mock.Random;

// mock一组乘客数据数据 
if(MarketingHotel){
    Mock.mock( /hotel\/getHotelBookingHistory/, 'post', {
        "code": 0,
        "rdesc": null,
        "zip": 0,
        "base64": 0,
        "data":{
            'DataHotel|6': [
                {"DefaultPicture":"@image","MinPrice|100-500":300,"HotelName":'@county(true)',"ProviderType|1-2":2,"HotelId":51801079}
            ]
        }
    });
}

if(MarketingHotel){
    Mock.mock( /trip\/getValidTripList/, 'post', {
        "code": 0,
        "rdesc": null,
        "zip": 0,
        "base64": 0,
        "data|6": [
            {"TripNo|100-500":300,"Name":'出差去大城市'}
        ]
    });
}

// 
// 不设置延时很有可能遇到坑，这里需要留意，因为真实的请求是需要时间的，mock不设置延时则是马上拿到数据返回，这两个情况不同可能导致在接口联调时出现问题。所以最好要先设置延时请求到数据。
//延时400s请求到数据
Mock.setup({
    timeout: 1000
})