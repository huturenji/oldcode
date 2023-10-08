// 引入mockjs
import Mock from "mockjs";
//获取mock.Random对象 Mock.Random 是一个工具类，用于生成各种随机数据。
// const Random = Mock.Random;
// eslint-disable-next-line
function invoiceDataFun(options){
    console.log('options',options);
    return Mock.mock(
        {
            "code": 0,
            "rdesc": null,
            "zip": 0,
            "base64": 0,
            "data": {
                "InvoiceInfo": [
                    {
                        "IsDefault": 0,
                        "CpyId": 13,
                        "BankAccount": "55151515151515151",
                        "ProdId": 1,
                        "PurchaserName": "南京站日",
                        "UaId": 4294967491,
                        "CompanyAddress": "你点击发到你那",
                        "InvoiceTitleType": 1,
                        "IsCommon": 0,
                        "createTime": 1542116293000,
                        "invoiceTitleId": "5oSPcU2eEGpshkofPFV",
                        "IsDelete": 0,
                        "UpdateTime": "2018-11-13 21:38:13",
                        "PhoneNumber": "156748955565",
                        "TaxNumber": "4499943949",
                        "DepositBank": "丰富的"
                    }
                ]
            }
        }
    )
}
// 设置4秒后再响应
//Mock.setup({ timeout: 500 }); 
//Mock.mock( /user\/getInvoiceInfo/, 'post', invoiceDataFun);
//Mock.mock( /user\/modifyInvoiceInfo/, 'post', invoiceDataFun);
