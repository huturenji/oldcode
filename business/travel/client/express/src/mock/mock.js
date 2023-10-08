// 引入mockjs
import Mock from "mockjs";
//获取乘客列表mock数据的开关
let ExpressMockOpen = false;
//获取mock.Random对象 Mock.Random 是一个工具类，用于生成各种随机数据。
const Random = Mock.Random;

//获取订单列表
if(ExpressMockOpen){
    Mock.mock( /express.getExpressOrders/, 'post', {
        "code": 0,
        "rdesc": null,
        "zip": 0,
        "base64": 0,
        "data":{
            'ExpressOrders|6': [
                {
                    'ExpressOrderNo':'88888888888844',
                    'OuterExpressOrderNo':'55555555555',
                    'OrderNoForExpress':'222222',
                    'SenderInfo':{
                        'Name':'名字1',
                        'Phone':'13877157575',
                        'Area':'武汉',
                        'Address':'@county(true)',
                    },
                    'ReceiverInfo':{
                        'Name':'名字2',
                        'Phone':'13877157575',
                        'Area':'西安',
                        'Address':'@county(true)',
                    },
                    'ExpressCompanyInfo':{
                        "ExpressCompanyNo":1,
                        "ExpressCompanyCode":1,
                        "ExpressCompanyName":'顺丰快递',
                        "ExpressCompanyPhone":'13888888888'
                    },
                    "ExpressDetails": [
                        {
                        "ExpressLocationTime": "2019‐05‐19 13:26:04",
                        "ExpressLocationNo": "RNfORJnP2ZYvGElepHv",
                        "ExpressLocationDesc": "客户 签收人: 菜鸟驿站 已签收 感谢使用圆通速递，期待再次为您服务18049414755",
                        "OuterExpressOrderNo": "600189574609286394",
                        "ExpressStatus": "SIGNED"
                        },
                        {
                        "ExpressLocationTime": "2019‐05‐19 10:33:44",
                        "ExpressLocationNo": "qh2Ojfse678q6WAXOAH",
                        "ExpressLocationDesc": "快件已暂存至西安鑫汇苑社区店菜鸟驿站，如有疑问请联系18049414755",
                        "OuterExpressOrderNo": "600189574609286394",
                        "ExpressStatus": "SENT_SCAN"
                        },
                        {
                        "ExpressLocationTime": "2019‐05‐19 08:28:15",
                        "ExpressLocationNo": "lCSmo0Snu8wM2Iri3Uv",
                        "ExpressLocationDesc": "【陕西省西安市西郊四部公司】 派件人: 刘荣旗 派件中 派件员电话15029091625",
                        "OuterExpressOrderNo": "600189574609286394",
                        "ExpressStatus": "SENT_SCAN"
                        },
                        {
                        "ExpressLocationTime": "2019‐05‐18 15:35:25",
                        "ExpressLocationNo": "tXsRNiQmYYGksi73QO2",
                        "ExpressLocationDesc": "【西安转运中心】 已收入",
                        "OuterExpressOrderNo": "600189574609286394",
                        "ExpressStatus": "TRANSPORTING"
                        },
                        {
                        "ExpressLocationTime": "2019‐05‐18 06:21:06",
                        "ExpressLocationNo": "1wG9nXpUfI0HP3jHbJq",
                        "ExpressLocationDesc": "【襄阳转运中心】 已发出 下一站 【西安转运中心】",
                        "OuterExpressOrderNo": "600189574609286394",
                        "ExpressStatus": "TRANSPORTING"
                        },
                        {
                        "ExpressLocationTime": "2019‐05‐17 19:53:18",
                        "ExpressLocationNo": "iTHUAAZrs4zmJqL5NlK",
                        "ExpressLocationDesc": "【武昌转运中心】 已收入",
                        "OuterExpressOrderNo": "600189574609286394",
                        "ExpressStatus": "TRANSPORTING"
                        },
                        {
                        "ExpressLocationTime": "2019‐05‐17 12:59:03",
                        "ExpressLocationNo": "qlAImLnhdal9G756Hke",
                        "ExpressLocationDesc": "【湖北省市场部公司】 已打包",
                        "OuterExpressOrderNo": "600189574609286394",
                        "ExpressStatus": "TRANSPORTING"
                        },
                        {
                        "ExpressLocationTime": "2019‐05‐17 12:03:10",
                        "ExpressLocationNo": "FA0HAhzkL1ZEeHnP0wd",
                        "ExpressLocationDesc": "【湖北省市场部公司】 已收件",
                        "OuterExpressOrderNo": "600189574609286394",
                        "ExpressStatus": "GOT"
                        }
                    ],
                    'ExpressStatusAndTime':[
                        // {'Status':'WAIT_TO_ACCEPT','Time':'2019-07-11 12:12:00'},
                        // {'Status':'ACCEPT','Time':'2019-07-11 12:12:00'},
                        {'Status':'GOT','Time':'2019-07-11 12:12:00'},
                        // {'Status':'TRANSPORTING','Time':'2019-07-13 12:12:00'},
                        // {'Status':'SENT_SCAN','Time':'2019-07-14 12:12:00'},
                        // {'Status':'SIGNED','Time':'2019-07-15 12:12:00'},
                        // {'Status':'CANCELLED','Time':'2019-07-11 12:12:00'},
                    ],
                    'ExpressContactPhone':'13898989899'
                }
            ]
        }
    });
}
//取消订单
if(ExpressMockOpen){
    Mock.mock( /express.cancelExpressOrder/, 'post', {
        "code": 0,
        "rdesc": null,
        "zip": 0,
        "base64": 0,
        "data":{
            'IsSuccess': true
        }
    });
}
//删除订单
if(ExpressMockOpen){
    Mock.mock( /express.deleteExpressOrder/, 'post', {
        "code": 0,
        "rdesc": null,
        "zip": 0,
        "base64": 0,
        "data":{
            'IsSuccess': true
        }
    });
}
//预估快递费用
if(ExpressMockOpen){
    Mock.mock( /express.getRoughExpressOrderPrice/, 'post', {
        "code": 0,
        "rdesc": null,
        "zip": 0,
        "base64": 0,
        "data":{
            'RoughExpressOrderPrice':22,
            'PrimaryOrderPrice':10,
            'SecondaryOrderPrice':12,
            'SecondaryOrderPricePerKg':6
        }
    });
}
//快递下单
if(ExpressMockOpen){
    Mock.mock( /express.createExpressOrder/, 'post', {
        "code": 0,
        "rdesc": null,
        "zip": 0,
        "base64": 0,
        "data":{
            'ExpressOrderNo': '88884444',
            'OuterExpressOrderNo': '44447777',
        }
    });
}
//查询所有快递公司
if(ExpressMockOpen){
    Mock.mock( /express.getExpressCompanies/, 'post', {
        "code": 0,
        "rdesc": null,
        "zip": 0,
        "base64": 0,
        "data":{
            'ExpressCompanies': [
                {"ExpressCompanyNo":1,"ExpressCompanyCode":1,"ExpressCompanyName":'顺丰快递',"ExpressCompanyPhone":'13888888888'},
                {"ExpressCompanyNo":2,"ExpressCompanyCode":2,"ExpressCompanyName":'圆通快递',"ExpressCompanyPhone":'13888888889'}
            ]
        }
    });
}
//查询快递单号所属快递公司
if(ExpressMockOpen){
    Mock.mock( /express.identifyExpressCompany/, 'post', {
        "code": 0,
        "rdesc": null,
        "zip": 0,
        "base64": 0,
        "data":{
            'ExpressCompanies': [
                {"ExpressCompanyNo":3,"ExpressCompanyCode":3,"ExpressCompanyName":'快递100',"ExpressCompanyPhone":'13888888889'},
                {"ExpressCompanyNo|1-2":1,"ExpressCompanyCode|1-2":1,"ExpressCompanyName":'@county(true)',"ExpressCompanyPhone":'13888888888'}
            ],
            'RequestId':2
        }
    });
}
// 查询快递物流详情
if(ExpressMockOpen){
    Mock.mock( /express.getExpressDetail/, 'post', {
        "code": 46060014,
        "rdesc": null,
        "zip": 0,
        "base64": 0,
        "data":{
            'ExpressOrderDetail': {
                'ExpressOrderNo':'13888888888',
                'OuterExpressOrderNo':'55555555555',
                'ExpressCompanyInfo':{
                    "ExpressCompanyNo":1,
                    "ExpressCompanyName":'顺丰快递',
                    "ExpressCompanyCode":1,
                    "ExpressCompanyPhone":'13888888888'
                },
                "ExpressDetails": [
                    {
                    "ExpressLocationTime": "2019‐05‐19 13:26:04",
                    "ExpressLocationNo": "RNfORJnP2ZYvGElepHv",
                    "ExpressLocationDesc": "客户 签收人: 菜鸟驿站 已签收 感谢使用圆通速递，期待再次为您服务18049414755",
                    "OuterExpressOrderNo": "600189574609286394",
                    "ExpressStatus": "SIGNED"
                    },
                    {
                    "ExpressLocationTime": "2019‐05‐19 10:33:44",
                    "ExpressLocationNo": "qh2Ojfse678q6WAXOAH",
                    "ExpressLocationDesc": "快件已暂存至西安鑫汇苑社区店菜鸟驿站，如有疑问请联系18049414755",
                    "OuterExpressOrderNo": "600189574609286394",
                    "ExpressStatus": "GOT"
                    },
                    {
                    "ExpressLocationTime": "2019‐05‐19 08:28:15",
                    "ExpressLocationNo": "lCSmo0Snu8wM2Iri3Uv",
                    "ExpressLocationDesc": "【陕西省西安市西郊四部公司】 派件人: 刘荣旗 派件中 派件员电话15029091625",
                    "OuterExpressOrderNo": "600189574609286394",
                    "ExpressStatus": "SENT_SCAN"
                    },
                    {
                    "ExpressLocationTime": "2019‐05‐18 15:35:25",
                    "ExpressLocationNo": "tXsRNiQmYYGksi73QO2",
                    "ExpressLocationDesc": "【西安转运中心】 已收入",
                    "OuterExpressOrderNo": "600189574609286394",
                    "ExpressStatus": "TRANSPORTING"
                    },
                    {
                    "ExpressLocationTime": "2019‐05‐18 06:21:06",
                    "ExpressLocationNo": "1wG9nXpUfI0HP3jHbJq",
                    "ExpressLocationDesc": "【襄阳转运中心】 已发出 下一站 【西安转运中心】",
                    "OuterExpressOrderNo": "600189574609286394",
                    "ExpressStatus": "TRANSPORTING"
                    },
                    {
                    "ExpressLocationTime": "2019‐05‐17 19:53:18",
                    "ExpressLocationNo": "iTHUAAZrs4zmJqL5NlK",
                    "ExpressLocationDesc": "【武昌转运中心】 已收入",
                    "OuterExpressOrderNo": "600189574609286394",
                    "ExpressStatus": "TRANSPORTING"
                    },
                    {
                    "ExpressLocationTime": "2019‐05‐17 12:59:03",
                    "ExpressLocationNo": "qlAImLnhdal9G756Hke",
                    "ExpressLocationDesc": "【湖北省市场部公司】 已打包",
                    "OuterExpressOrderNo": "600189574609286394",
                    "ExpressStatus": "TRANSPORTING"
                    },
                    {
                    "ExpressLocationTime": "2019‐05‐17 12:03:10",
                    "ExpressLocationNo": "FA0HAhzkL1ZEeHnP0wd",
                    "ExpressLocationDesc": "【湖北省市场部公司】 已收件",
                    "OuterExpressOrderNo": "600189574609286394",
                    "ExpressStatus": "GOT"
                    }
                ],
                'ExpressStatusAndTime':[
                    // {'Status':'WAIT_TO_ACCEPT','Time':'2019-07-11 12:12:00'},
                    // {'Status':'ACCEPT','Time':'2019-07-11 12:12:00'},
                    {'Status':'GOT','Time':'2019-07-11 12:12:00'},
                    // {'Status':'TRANSPORTING','Time':'2019-07-13 12:12:00'},
                    // {'Status':'SENT_SCAN','Time':'2019-07-14 12:12:00'},
                    // {'Status':'SIGNED','Time':'2019-07-15 12:12:00'},
                    // {'Status':'CANCELLED','Time':'2019-07-11 12:12:00'},
                ],
                'ExpressContactPhone':'13898989899',
                'FilghtOrderNo':'F10906734441054208'
            }
        }
    });
}
// 查询快递订单详情
if(ExpressMockOpen){
    Mock.mock( /express.getExpressOrderDetail/, 'post', {
        "code": 0,
        "rdesc": null,
        "zip": 0,
        "base64": 0,
        "data":{
            'ExpressOrderDetail': {
                'ExpressOrderNo':'13888888888',
                'OuterExpressOrderNo':'55555555555',
                'SenderInfo':{
                    'Name':'名字1',
                    'Phone':'13877157575',
                    'Area':'武汉',
                    'Address':'@county(true)',
                },
                'ReceiverInfo':{
                    'Name':'名字2',
                    'Phone':'13877157575',
                    'Area':'西安',
                    'Address':'@county(true)',
                },
                'ExpressCompanyInfo':{
                    "ExpressCompanyNo":1,
                    "ExpressCompanyName":'顺丰快递',
                    "ExpressCompanyCode":1,
                    "ExpressCompanyPhone":'13888888888'
                },
                "ExpressDetails": [
                    // {
                    // "ExpressLocationTime": "2019‐05‐19 10:33:44",
                    // "ExpressLocationNo": "qh2Ojfse678q6WAXOAH",
                    // "ExpressLocationDesc": "快件已暂存至西安鑫汇苑社区店菜鸟驿站，如有疑问请联系18049414755",
                    // "OuterExpressOrderNo": "600189574609286394",
                    // "ExpressStatus": "TRANSPORTING"
                    // },
                    // {
                    // "ExpressLocationTime": "2019‐05‐19 13:26:04",
                    // "ExpressLocationNo": "RNfORJnP2ZYvGElepHv",
                    // "ExpressLocationDesc": "客户 签收人: 菜鸟驿站 已签收 感谢使用圆通速递，期待再次为您服务18049414755",
                    // "OuterExpressOrderNo": "600189574609286394",
                    // "ExpressStatus": "SIGNED"
                    // },
                    // {
                    // "ExpressLocationTime": "2019‐05‐19 10:33:44",
                    // "ExpressLocationNo": "qh2Ojfse678q6WAXOAH",
                    // "ExpressLocationDesc": "快件已暂存至西安鑫汇苑社区店菜鸟驿站，如有疑问请联系18049414755",
                    // "OuterExpressOrderNo": "600189574609286394",
                    // "ExpressStatus": "SENT_SCAN"
                    // },
                    // {
                    // "ExpressLocationTime": "2019‐05‐19 08:28:15",
                    // "ExpressLocationNo": "lCSmo0Snu8wM2Iri3Uv",
                    // "ExpressLocationDesc": "【陕西省西安市西郊四部公司】 派件人: 刘荣旗 派件中 派件员电话15029091625",
                    // "OuterExpressOrderNo": "600189574609286394",
                    // "ExpressStatus": "SENT_SCAN"
                    // },
                    // {
                    // "ExpressLocationTime": "2019‐05‐18 15:35:25",
                    // "ExpressLocationNo": "tXsRNiQmYYGksi73QO2",
                    // "ExpressLocationDesc": "【西安转运中心】 已收入",
                    // "OuterExpressOrderNo": "600189574609286394",
                    // "ExpressStatus": "TRANSPORTING"
                    // },
                    // {
                    // "ExpressLocationTime": "2019‐05‐18 06:21:06",
                    // "ExpressLocationNo": "1wG9nXpUfI0HP3jHbJq",
                    // "ExpressLocationDesc": "【襄阳转运中心】 已发出 下一站 【西安转运中心】",
                    // "OuterExpressOrderNo": "600189574609286394",
                    // "ExpressStatus": "TRANSPORTING"
                    // },
                    // {
                    // "ExpressLocationTime": "2019‐05‐17 19:53:18",
                    // "ExpressLocationNo": "iTHUAAZrs4zmJqL5NlK",
                    // "ExpressLocationDesc": "【武昌转运中心】 已收入",
                    // "OuterExpressOrderNo": "600189574609286394",
                    // "ExpressStatus": "TRANSPORTING"
                    // },
                    // {
                    // "ExpressLocationTime": "2019‐05‐17 12:59:03",
                    // "ExpressLocationNo": "qlAImLnhdal9G756Hke",
                    // "ExpressLocationDesc": "【湖北省市场部公司】 已打包",
                    // "OuterExpressOrderNo": "600189574609286394",
                    // "ExpressStatus": "TRANSPORTING"
                    // },
                    // {
                    // "ExpressLocationTime": "2019‐05‐17 12:03:10",
                    // "ExpressLocationNo": "FA0HAhzkL1ZEeHnP0wd",
                    // "ExpressLocationDesc": "【湖北省市场部公司】 已收件",
                    // "OuterExpressOrderNo": "600189574609286394",
                    // "ExpressStatus": "GOT"
                    // }
                ],
                'ExpressStatusAndTime':[
                    // {'Status':'WAIT_TO_ACCEPT','Time':'2019-07-11 12:12:00'},
                    {'Status':'ACCEPT','Time':'2019-07-11 12:12:00'},
                    {'Status':'GOT','Time':'2019-07-11 12:12:00'},
                    // {'Status':'TRANSPORTING','Time':'2019-07-13 12:12:00'},
                    // {'Status':'SENT_SCAN','Time':'2019-07-14 12:12:00'},
                    // {'Status':'SIGNED','Time':'2019-07-15 12:12:00'},
                    // {'Status':'CANCELLED','Time':'2019-07-11 12:12:00'},
                ],
                'ExpressContactPhone':'13898989899',
                'CargoInfo':{
                    'Name':'衣服',
                    'Weight':'2'
                },
                'SendStartTime':'2019-08-9 12:12:00',
                'SendEndTime':'2019-08-9 14:12:00',
                'Remark':'多带点透明胶带',
                'ExpressOrderType':'1',
                'ExpressOrderTime':'2019-07-15 12:12:00',
                'FilghtOrderNo':'650012585858585858'
            }
        }
    });
}


// 不设置延时很有可能遇到坑，这里需要留意，因为真实的请求是需要时间的，mock不设置延时则是马上拿到数据返回，这两个情况不同可能导致在接口联调时出现问题。所以最好要先设置延时请求到数据。
//延时400s请求到数据
Mock.setup({
    timeout: 1000
})