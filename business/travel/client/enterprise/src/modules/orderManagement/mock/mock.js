// 引入mockjs
import Mock from "mockjs";
//获取mock.Random对象 Mock.Random 是一个工具类，用于生成各种随机数据。
// const Random = Mock.Random;
function invoiceDataFun(options){ // eslint-disable-line
    console.log('options',options);
    return Mock.mock(
        {
            "code": 0,
            "rdesc": null,
            "zip": 0,
            "base64": 0,
            "data": {
                "TotalPageCount": 2,
                "TotalRecord": 32,
                "TrainOrders": [
                    {
                        "OrderTime": "2018/11/14 18:13",
                        "EndCity": "北京",
                        "PayStatus": 0,
                        "EndTime": "2018/11/14 22:12",
                        "PayAmount": 43.5,
                        "UseType": 1,
                        "StartTime": "2018/11/14 20:19",
                        "OrderNo": "6L7fTcmmoTUeD1GRxyC",
                        "OrgName": "未分组",
                        "hasTui": false,
                        "PayType": 0,
                        "OrderStatus": "ALREADY_REFUND",
                        "ScheduledPersonName": "李",
                        "StartCity": "天津",
                        "IsHasTui": false,
                        "Passengers": "leblamjames",
                        "TrainNo": "2590",
                        "SeatType": 8,
                        "ChangeAndRefundStatus": "NONE",
                        "DepartmentId": -3,
                        "ProductionId": "1"
                    },
                    {
                        "OrderTime": "2018/11/14 18:00",
                        "EndCity": "天津南",
                        "PayStatus": 0,
                        "EndTime": "2018/11/16 08:04",
                        "PayAmount": 79.5,
                        "UseType": 1,
                        "StartTime": "2018/11/16 07:30",
                        "OrderNo": "VNPBmtuBUvZYRfAIqvO",
                        "OrgName": "未分组",
                        "hasTui": false,
                        "PayType": 0,
                        "OrderStatus": "ALREADY_REFUND",
                        "ScheduledPersonName": "李",
                        "StartCity": "北京南",
                        "IsHasTui": false,
                        "Passengers": "leblamjames",
                        "TrainNo": "G4219",
                        "SeatType": 3,
                        "ChangeAndRefundStatus": "NONE",
                        "DepartmentId": -3,
                        "ProductionId": "1"
                    }
                ],
                "FlightOrders": [
                    {
                        "OrderTime": "2018/11/19 18:44",
                        "ArriveTime": "2018/11/20 00:55",
                        "EAirportName": "天河国际机场",
                        "DepartCityName": "北京",
                        "SAirportName": "首都国际机场",
                        "OrderNo": "pyOHC9kPtJTSs4G8PpM",
                        "OrgName": "未分组",
                        "hasTui": false,
                        "FlightNo": "CZ6586",
                        "hasGai": false,
                        "OrderStatus": "ALREADY_CANCEL",
                        "ScheduledPersonName": "李",
                        "DepartTime": "2018/11/19 22:25",
                        "ProductionId": "1",
                        "PayStatus": 0,
                        "ArriveCityName": "武汉",
                        "PayAmount": 450.0,
                        "UseType": 1,
                        "PayType": 0,
                        "AirLineName": "南方航空",
                        "IsHasTui": false,
                        "IsHasGai": false,
                        "Passengers": "leblam/james",
                        "ChangeAndRefundStatus": "",
                        "DepartmentId": -3
                    },
                    {
                        "OrderTime": "2018/11/19 18:33",
                        "ArriveTime": "2018/11/20 10:35",
                        "EAirportName": "天河国际机场",
                        "DepartCityName": "大连",
                        "SAirportName": "大连国际机场",
                        "OrderNo": "jgeL6KWwRAyEHRRaBpw",
                        "OrgName": "未分组",
                        "hasTui": false,
                        "FlightNo": "CZ6425",
                        "hasGai": false,
                        "OrderStatus": "ALREADY_CANCEL",
                        "ScheduledPersonName": "李",
                        "DepartTime": "2018/11/20 08:10",
                        "ProductionId": "1",
                        "PayStatus": 0,
                        "ArriveCityName": "武汉",
                        "PayAmount": 620.0,
                        "UseType": 1,
                        "PayType": 0,
                        "AirLineName": "南方航空",
                        "IsHasTui": false,
                        "IsHasGai": false,
                        "Passengers": "leblam/james",
                        "ChangeAndRefundStatus": "",
                        "DepartmentId": -3
                    },
                    {
                        "OrderTime": "2018/11/19 18:09",
                        "ArriveTime": "2018/11/20 10:35",
                        "EAirportName": "天河国际机场",
                        "DepartCityName": "大连",
                        "SAirportName": "大连国际机场",
                        "OrderNo": "vC9FjOo2Wqc79J5vjf7",
                        "OrgName": "未分组",
                        "hasTui": false,
                        "FlightNo": "CZ6425",
                        "hasGai": false,
                        "OrderStatus": "ALREADY_CANCEL",
                        "ScheduledPersonName": "李",
                        "DepartTime": "2018/11/20 08:10",
                        "ProductionId": "1",
                        "PayStatus": 0,
                        "ArriveCityName": "武汉",
                        "PayAmount": 620.0,
                        "UseType": 1,
                        "PayType": 0,
                        "AirLineName": "南方航空",
                        "IsHasTui": false,
                        "IsHasGai": false,
                        "Passengers": "leblam/james",
                        "ChangeAndRefundStatus": "",
                        "DepartmentId": -3
                    }
                ]
            }
        }
    )
}
// 设置4秒后再响应
Mock.setup({ timeout: 1500 }); 
//Mock.mock( /orderManagement\/getOrderOfAllTypes/, 'post', invoiceDataFun);
var dataStatis = {
    "code": 0,
    "rdesc": null,
    "zip": 0,
    "base64": 0,
    "data": {
        "SpendingAmount": 142.0,
        "TotalRefundAmount": 230.0,
        "HotelOrderNum": 0,
        "TrainRefundAmount": 0.0,
        "RefundOrderNum": 4,
        "HotelRefundAmount": 230.0,
        "TrainOrderAmount": 0.0,
        "TrainOrderNum": 3,
        "TotalOrderNum": 3,
        "PayAmountByPayType": {
            "钱包直接扣款": 142.0,
            "微信支付": 0.0
        },
        "FlightOrderAmount": 0.0,
        "FlightOrderNum": 0,
        "HotelOrderAmount": 142.0,
        "TotalPayAmountAllPayTypes": 142.0,
        "FlightRefundAmount": 0.0
    }
}
Mock.mock(/orderManagement\/getDataStatistics/, 'post', dataStatis);
