// 引入mockjs
import Mock from "mockjs";
//获取mock.Random对象 Mock.Random 是一个工具类，用于生成各种随机数据。
const Random = Mock.Random;
function invoiceDataFun(options){
    console.log('options',options);
    return  Mock.mock({
        "code": 0,
        "rdesc": null,
        "zip": 0,
        "base64": 0,
        "data": {
            "InvoiceCreatedDate":Random.date('yyyy/MM/dd'),
            "InvoiceCode":123,
            "InvoiceNum":789,
            "TaxAmount":'5元',
            "BuyerName":'商旅通深圳',
            "SellerName":'商旅123',
            "InvoicePdfUrl":Random.image('200x100', '#00405d', '#FFF', 'Mock.js'),
            "InvoiceJpgUrl":Random.image('200x100', '#00405d', '#FFF', 'Mock.js'),
        }
    })
}

// Mock.mock( /invoice\/getInvocieDetail/, 'post', invoiceDataFun);
