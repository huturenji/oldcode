// import HttpPostProcessors from "../DMT/expansion/travelManagement/processors/HttpPostProcessors";
/**
 * 商城VOPmock数据
 */
export default function getMallMockData() {
    let mockDataArray = [];
    let mainSwitchs = {
        mediaSwitch: true, //支付服务模块mock开关
        supplierSwitch: true, //商品服务模块mock开关
        channelSwitch: true, //用户授权模块mock开关
        industrySiteSwitch: true //订单模块mock开关
    };
    /********************************************下面是用户授权模块****************/
    if (!!mainSwitchs.industrySiteSwitch) {
        // mockDataArray.push({
        //     urlRegExp: /lottery\/v1\/create/,
        //     urlType: "post",
        //     mockRes: {
        //         resultCode: 0,
        //         resultMessage: "ok",

        //     }
        // });
        mockDataArray.push({
            urlRegExp: /lottery\/v1\/listType/,
            urlType: "get",
            mockRes: {
                resultCode: 0,
                resultMessage: "ok",
                result: {
                    "hitResult": [
                        {
                            "name": "大转盘",
                            "typeId": "dzp",
                            "cassifications": ['yx'],
                            "imgUrl": "//img20.360buyimg.com/pop/s590x470_jfs/t1/113379/1/26355/56966/62a9a321E56578405/8f4fb6246f06deab.jpg.webp",
                            "activityTip": "点击对应抽奖按钮，即可抽奖。",
                            "isEnable": true
                        },
                        {
                            "name": "砸金蛋",
                            "typeId": "zjd", "cassifications": ['yx'],
                            "imgUrl": "//img20.360buyimg.com/pop/s590x470_jfs/t1/113379/1/26355/56966/62a9a321E56578405/8f4fb6246f06deab.jpg.webp",
                            "activityTip": "点击对应抽奖按钮，即可抽奖。",
                            "isEnable": true
                        },
                        {
                            "name": "九宫格",
                            "typeId": "jgg",
                            "cassifications": ['yx'],
                            "imgUrl": "//img20.360buyimg.com/pop/s590x470_jfs/t1/113379/1/26355/56966/62a9a321E56578405/8f4fb6246f06deab.jpg.webp",
                            "activityTip": "点击对应抽奖按钮，即可抽奖。",
                            "isEnable": true
                        },
                        {
                            "name": "红包雨",
                            "typeId": "hby",
                            "cassifications": ['yx'],
                            "imgUrl": "//img20.360buyimg.com/pop/s590x470_jfs/t1/113379/1/26355/56966/62a9a321E56578405/8f4fb6246f06deab.jpg.webp",
                            "activityTip": "点击对应抽奖按钮，即可抽奖。",
                            "isEnable": true
                        },
                        {
                            "name": "定时抽奖",
                            "typeId": "dzc",
                            "cassifications": ['nh'],
                            "imgUrl": "//img20.360buyimg.com/pop/s590x470_jfs/t1/113379/1/26355/56966/62a9a321E56578405/8f4fb6246f06deab.jpg.webp",
                            "activityTip": "点击对应抽奖按钮，即可抽奖。",
                            "isEnable": false
                        },
                        {
                            "name": "现场开奖",
                            "typeId": "xck",
                            "cassifications": ['nh'],
                            "imgUrl": "//img20.360buyimg.com/pop/s590x470_jfs/t1/113379/1/26355/56966/62a9a321E56578405/8f4fb6246f06deab.jpg.webp",
                            "activityTip": "点击对应抽奖按钮，即可抽奖。",
                            "isEnable": false
                        }
                    ]
                }
            }
        });
        mockDataArray.push({
            urlRegExp: /goods\/v1\/list/,
            urlType: "get",
            mockRes: {
                resultCode: 0,
                resultMessage: "ok",
                result: {
                    "hitResult": [
                        {
                            goodId: "123f",
                            name: "荣耀70 IMX800三主摄 双曲屏设计 高通骁龙778G Plus 66W快充 5G手机 8GB+256GB 流光水晶",
                            img: "//img20.360buyimg.com/pop/s590x470_jfs/t1/113379/1/26355/56966/62a9a321E56578405/8f4fb6246f06deab.jpg.webp",
                            price: "999.15",
                        },
                        {
                            goodId: "12d3f",
                            name: "陈一凡 小青柑普洱茶 茶叶正宗生晒新会青柑小青桔宫廷普洱新会陈皮普洱茶熟茶柑普橘普桔普茶散装500g",
                            img: "//img20.360buyimg.com/pop/s590x470_jfs/t1/113379/1/26355/56966/62a9a321E56578405/8f4fb6246f06deab.jpg.webp",
                            price: "9.25",
                        },
                        {
                            goodId: "123gf",
                            name: "陈一凡 小青柑普洱茶 茶叶正宗生晒新会青柑小青桔宫廷普洱新会陈皮普洱茶熟茶柑普橘普桔普茶散装500g",
                            img: "//img20.360buyimg.com/pop/s590x470_jfs/t1/113379/1/26355/56966/62a9a321E56578405/8f4fb6246f06deab.jpg.webp",
                            price: "99.50",
                        },
                        {
                            goodId: "123gff",
                            name: "荣耀70 IMX800三主摄 双曲屏设计 高通骁龙778G Plus 66W快充 5G手机 8GB+256GB 流光水晶",
                            img: "//img20.360buyimg.com/pop/s590x470_jfs/t1/113379/1/26355/56966/62a9a321E56578405/8f4fb6246f06deab.jpg.webp",
                            price: "29.00",
                        },
                        {
                            goodId: "12dd3f",
                            name: "陈一凡 小青柑普洱茶 茶叶正宗生晒新会青柑小青桔宫廷普洱新会陈皮普洱茶熟茶柑普橘普桔普茶散装500g",
                            img: "//img20.360buyimg.com/pop/s590x470_jfs/t1/113379/1/26355/56966/62a9a321E56578405/8f4fb6246f06deab.jpg.webp",
                            price: "999.50",
                        },
                        {
                            goodId: "12dd3fs",
                            name: "小米 P40 256GB",
                            img: "//img20.360buyimg.com/pop/s590x470_jfs/t1/113379/1/26355/56966/62a9a321E56578405/8f4fb6246f06deab.jpg.webp",
                            price: "999.00",
                        },
                        {
                            goodId: "12g3gf",
                            name: "荣耀70 IMX800三主摄 双曲屏设计 高通骁龙778G Plus 66W快充 5G手机 8GB+256GB 流光水晶",
                            img: "//img20.360buyimg.com/pop/s590x470_jfs/t1/113379/1/26355/56966/62a9a321E56578405/8f4fb6246f06deab.jpg.webp",
                            price: "199.00",
                        },
                        {
                            goodId: "123ewf",
                            name: "陈一凡 小青柑普洱茶 茶叶正宗生晒新会青柑小青桔宫廷普洱新会陈皮普洱茶熟茶柑普橘普桔普茶散装500g",
                            img: "//img20.360buyimg.com/pop/s590x470_jfs/t1/113379/1/26355/56966/62a9a321E56578405/8f4fb6246f06deab.jpg.webp",
                            price: "9.90",
                        },
                        {
                            goodId: "12df3f",
                            name: "荣耀70 IMX800三主摄 双曲屏设计 高通骁龙778G Plus 66W快充 5G手机 8GB+256GB 流光水晶",
                            img: "//img20.360buyimg.com/pop/s590x470_jfs/t1/113379/1/26355/56966/62a9a321E56578405/8f4fb6246f06deab.jpg.webp",
                            price: "39.90",
                        },
                        {
                            goodId: "12gf3f",
                            name: "荣耀70 IMX800三主摄 双曲屏设计 高通骁龙778G Plus 66W快充 5G手机 8GB+256GB 流光水晶",
                            img: "//img20.360buyimg.com/pop/s590x470_jfs/t1/113379/1/26355/56966/62a9a321E56578405/8f4fb6246f06deab.jpg.webp",
                            price: "122999.00",
                        },
                        {
                            goodId: "12gddf3f",
                            name: "荣耀70 IMX800三主摄 双曲屏设计 高通骁龙778G Plus 66W快充 5G手机 8GB+256GB 流光水晶",
                            img: "//img20.360buyimg.com/pop/s590x470_jfs/t1/113379/1/26355/56966/62a9a321E56578405/8f4fb6246f06deab.jpg.webp",
                            price: "122999.00",
                        },
                        {
                            goodId: "12gffff3f",
                            name: "荣耀70 IMX800三主摄 双曲屏设计 高通骁龙778G Plus 66W快充 5G手机 8GB+256GB 流光水晶",
                            img: "//img20.360buyimg.com/pop/s590x470_jfs/t1/113379/1/26355/56966/62a9a321E56578405/8f4fb6246f06deab.jpg.webp",
                            price: "122999.00",
                        },
                        {
                            goodId: "12gfsww3f",
                            name: "荣耀70 IMX800三主摄 双曲屏设计 高通骁龙778G Plus 66W快充 5G手机 8GB+256GB 流光水晶",
                            img: "//img20.360buyimg.com/pop/s590x470_jfs/t1/113379/1/26355/56966/62a9a321E56578405/8f4fb6246f06deab.jpg.webp",
                            price: "122999.00",
                        },
                        {
                            goodId: "12gfhnh3f",
                            name: "荣耀70 IMX800三主摄 双曲屏设计 高通骁龙778G Plus 66W快充 5G手机 8GB+256GB 流光水晶",
                            img: "//img20.360buyimg.com/pop/s590x470_jfs/t1/113379/1/26355/56966/62a9a321E56578405/8f4fb6246f06deab.jpg.webp",
                            price: "122999.00",
                        },
                        {
                            goodId: "12gddsf3f",
                            name: "荣耀70 IMX800三主摄 双曲屏设计 高通骁龙778G Plus 66W快充 5G手机 8GB+256GB 流光水晶",
                            img: "//img20.360buyimg.com/pop/s590x470_jfs/t1/113379/1/26355/56966/62a9a321E56578405/8f4fb6246f06deab.jpg.webp",
                            price: "122999.00",
                        },
                    ]
                }
            }
        });
        mockDataArray.push({
            urlRegExp: /product\/v1\/listProductPool/,
            urlType: "get",
            mockRes: {
                resultCode: 91100012,
                resultMessage: "ok",
                result: {
                }
            }
        });
        mockDataArray.push({
            urlRegExp: /activity\/v1\/listActivity/,
            urlType: "get",
            mockRes: {
                resultCode: 0,
                resultMessage: "success",
                result: {
                    "hitResult": [
                        {
                            activityId: "SNL1",
                            avtivityName: "企乐融融抽奖抽奖活动1",
                            type: "001",
                            typeName: "砸金蛋",
                            createTime: "2016-09-21  08:50:08",
                            startTime: "2016-09-21  08:50:08",
                            gameNum: "5",
                            prizeNum: "99",
                            state: "待启用",
                            stateType: "1",
                            prizeList: [{
                                name: "华为P50",
                                number: "33"
                            }, {
                                name: "Airpods",
                                number: "33"
                            }, {
                                name: "***线下体验卡",
                                number: "33"
                            }]
                        },
                        {
                            activityId: "SNL2",
                            avtivityName: "企乐融融抽奖抽奖活动2",
                            type: "002",
                            typeName: "大转盘",
                            createTime: "2016-09-21  08:50:08",
                            startTime: "2016-09-21  08:50:08",
                            gameNum: "5",
                            prizeNum: "99",
                            state: "待启用",
                            stateType: "1",
                            prizeList: [{
                                name: "华为P50",
                                number: "33"
                            }, {
                                name: "Airpods",
                                number: "33"
                            }, {
                                name: "***线下体验卡",
                                number: "33"
                            }]
                        },
                        {
                            activityId: "SNL3",
                            avtivityName: "企乐融融抽奖抽奖活动3",
                            type: "003",
                            typeName: "九宫格",
                            createTime: "2016-09-21  08:50:08",
                            startTime: "2016-09-21  08:50:08",
                            gameNum: "5",
                            prizeNum: "99",
                            state: "待启用",
                            stateType: "1",
                            prizeList: [{
                                name: "华为P50",
                                number: "33"
                            }, {
                                name: "Airpods",
                                number: "33"
                            }, {
                                name: "***线下体验卡",
                                number: "33"
                            }]
                        },
                        {
                            activityId: "SNL4",
                            avtivityName: "企乐融融抽奖抽奖活动4",
                            type: "004",
                            typeName: "红包雨",
                            createTime: "2016-09-21  08:50:08",
                            startTime: "2016-09-21  08:50:08",
                            gameNum: "5",
                            prizeNum: "99",
                            state: "已启用",
                            stateType: "2",
                            prizeList: [{
                                name: "华为P50",
                                number: "33"
                            }, {
                                name: "Airpods",
                                number: "33"
                            }, {
                                name: "***线下体验卡",
                                number: "33"
                            }]
                        },
                        {
                            activityId: "SNL5",
                            avtivityName: "企乐融融抽奖抽奖活动5",
                            type: "001",
                            typeName: "砸金蛋",
                            createTime: "2016-09-21  08:50:08",
                            startTime: "2016-09-21  08:50:08",
                            gameNum: "5",
                            prizeNum: "99",
                            state: "已结束",
                            stateType: "3",
                            prizeList: [{
                                name: "华为P50",
                                number: "33"
                            }, {
                                name: "Airpods",
                                number: "33"
                            }, {
                                name: "***线下体验卡",
                                number: "33"
                            }]
                        },
                        {
                            activityId: "SNL6",
                            avtivityName: "企乐融融抽奖抽奖活动6",
                            type: "001",
                            typeName: "砸金蛋",
                            createTime: "2016-09-21  08:50:08",
                            startTime: "2016-09-21  08:50:08",
                            gameNum: "5",
                            prizeNum: "99",
                            state: "待启用",
                            stateType: "1",
                            prizeList: [{
                                name: "华为P50",
                                number: "33"
                            }, {
                                name: "Airpods",
                                number: "33"
                            }, {
                                name: "***线下体验卡",
                                number: "33"
                            }]
                        },
                    ],
                    "resultCount": Math.floor(Math.random() * 30),
                    "pageIndex": 1,
                    "pageSize": 20,
                    "pageCount": 3
                }
            }
        });
        mockDataArray.push({
            urlRegExp: /activitystudio\/lottery\/v1\/createActivity/,
            urlType: "post",
            mockRes: {
                resultCode: '91100007',
                resultMessage: "ok"
            }
        });
        mockDataArray.push({
            urlRegExp: /activity\/v1\/listWiner/,
            urlType: "get",
            mockRes: {
                resultCode: 0,
                resultMessage: "string",
                result: {
                    "hitResult": [{
                        "id": 1,
                        "userName": "张三",
                        "joinTime": "2016-09-21  08:50:08",
                        "winTime": "2016-09-21  08:50:08",
                        "prizeName": "华为P50",
                        "detail": "深圳市福田区深业泰然大厦5C 1605"
                    }, {
                        "id": 2,
                        "userName": "李四",
                        "joinTime": "2016-09-21  08:50:08",
                        "winTime": "2016-09-21  08:50:08",
                        "prizeName": "华为P50",
                        "detail": "深圳市福田区深业泰然大厦5C 1605"
                    }, {
                        "id": 3,
                        "userName": "王五",
                        "joinTime": "2016-09-21  08:50:08",
                        "winTime": "2016-09-21  08:50:08",
                        "prizeName": "华为P50",
                        "detail": "深圳市福田区深业泰然大厦5C 1605"
                    },],
                    "resultCount": Math.floor(Math.random() * 30),
                    "pageIndex": 1,
                    "pageSize": 20,
                    "pageCount": 3
                }
            }
        });
        mockDataArray.push({
            urlRegExp: /activity\/v1\/detailActivity/,
            urlType: "get",
            mockRes: {
                "resultCode": 0,
                "resultMessage": "success",
                "result": {
                    activityId: "SNL1",
                    avtivityName: "企乐融融抽奖抽奖活动1",
                    type: "001",
                    typeName: "砸金蛋",
                    createTime: "2016-09-21  08:50:08",
                    startTime: "2016-09-21  08:50:08",
                    gameNum: "5",
                    state: "待启用",
                    stateType: "1",
                    joinNum: "总限制 5 次；每日限制 1 次",
                    winNum: "总限制不限制；每日限制 1 次",
                    winChance: "5%",
                    tips: "这是抽奖说明这是抽奖说明这是抽奖说明这是抽奖说明这是抽奖说明这是抽奖说明这是抽奖说明这是抽奖说明这是抽奖说明这是抽奖说明这是抽奖说明",
                    prizeNum: "99",
                    totalPrice: '2997.00',
                    activityType: '2',
                    prizeList: [{
                        name: "华为P50",
                        img: "//img20.360buyimg.com/pop/s590x470_jfs/t1/113379/1/26355/56966/62a9a321E56578405/8f4fb6246f06deab.jpg.webp",
                        prizeType: "1",
                        price: "999.00",
                        total: "99",
                        tips: "华为P50华为P50华为P50华为P50华为P50",
                        number: "33"
                    }, {
                        name: "Airpods",
                        img: "//img20.360buyimg.com/pop/s590x470_jfs/t1/113379/1/26355/56966/62a9a321E56578405/8f4fb6246f06deab.jpg.webp",
                        prizeType: "2",
                        price: "999.00",
                        total: "99",
                        tips: "AirpodsAirpodsAirpodsAirpodsAirpods",
                    }, {
                        name: "***线下体验卡",
                        img: "//img20.360buyimg.com/pop/s590x470_jfs/t1/113379/1/26355/56966/62a9a321E56578405/8f4fb6246f06deab.jpg.webp",
                        prizeType: "3",
                        price: "999.00",
                        total: "99",
                        tips: "***线下体验卡***线下体验卡***线下体验卡",
                    }]

                }
            }
        });
        mockDataArray.push({
            urlRegExp: /lottery\/v1\/companyInfo/,
            urlType: "get",
            mockRes: {
                "resultCode": 0,
                "resultMessage": "success",
                "result": {
                    activityType: '2',
                    companyName: "深圳兆日科技有限公司",
                    depositBank: "招商银行泰然支行",
                    account: '1121 4324 1231 4353 5435',
                    totalPrice: '29002.00'
                }
            }
        });
        mockDataArray.push({
            urlRegExp: /order\/v1\/listActivity/,
            urlType: "get",
            mockRes: {
                resultCode: 0,
                resultMessage: "success",
                result: {
                    "hitResult": [
                        {
                            activityId: "123",
                            avtivityName: "xxxx活动",
                            orderId: "001",
                            createTime: "2016-09-21  08:50:08",
                            state: '已支付',
                            totalPrice: '999',
                            prizeList: [{
                                name: "华为P50",
                                number: "33"
                            }, {
                                name: "Airpods",
                                number: "33"
                            }, {
                                name: "***线下体验卡",
                                number: "33"
                            }]
                        },
                        {
                            activityId: "124",
                            avtivityName: "xxxx活动",
                            orderId: "010",
                            createTime: "2016-09-21  08:50:08",
                            state: '待支付',
                            totalPrice: '999',
                            prizeList: [{
                                name: "华为P50",
                                number: "33"
                            }, {
                                name: "Airpods",
                                number: "33"
                            }, {
                                name: "***线下体验卡",
                                number: "33"
                            }]
                        },
                        {
                            activityId: "234",
                            avtivityName: "xxxx活动",
                            orderId: "012",
                            createTime: "2016-09-21  08:50:08",
                            state: '待支付',
                            totalPrice: '999',
                            prizeList: [{
                                name: "华为P50",
                                number: "33"
                            }, {
                                name: "Airpods",
                                number: "33"
                            }, {
                                name: "***线下体验卡",
                                number: "33"
                            }]
                        },
                        {
                            activityId: "567",
                            avtivityName: "xxxx活动",
                            orderId: "999",
                            createTime: "2016-09-21  08:50:08",
                            state: '已支付',
                            totalPrice: '999',
                            prizeList: [{
                                name: "华为P50",
                                number: "33"
                            }, {
                                name: "Airpods",
                                number: "33"
                            }, {
                                name: "***线下体验卡",
                                number: "33"
                            }]
                        },
                        {
                            activityId: "123",
                            avtivityName: "xxxx活动",
                            orderId: "001",
                            createTime: "2016-09-21  08:50:08",
                            state: '已支付',
                            totalPrice: '999',
                            prizeList: [{
                                name: "华为P50",
                                number: "33"
                            }, {
                                name: "Airpods",
                                number: "33"
                            }, {
                                name: "***线下体验卡",
                                number: "33"
                            }]
                        },
                        {
                            activityId: "123",
                            avtivityName: "xxxx活动",
                            orderId: "001",
                            createTime: "2016-09-21  08:50:08",
                            state: '已支付',
                            totalPrice: '999',
                            prizeList: [{
                                name: "华为P50",
                                number: "33"
                            }, {
                                name: "Airpods",
                                number: "33"
                            }, {
                                name: "***线下体验卡",
                                number: "33"
                            }]
                        },
                        {
                            activityId: "123",
                            avtivityName: "xxxx活动",
                            orderId: "001",
                            createTime: "2016-09-21  08:50:08",
                            state: '已支付',
                            totalPrice: '999',
                            prizeList: [{
                                name: "华为P50",
                                number: "33"
                            }, {
                                name: "Airpods",
                                number: "33"
                            }, {
                                name: "***线下体验卡",
                                number: "33"
                            }]
                        },
                        {
                            activityId: "123",
                            avtivityName: "xxxx活动",
                            orderId: "001",
                            createTime: "2016-09-21  08:50:08",
                            state: '已支付',
                            totalPrice: '999',
                            prizeList: [{
                                name: "华为P50",
                                number: "33"
                            }, {
                                name: "Airpods",
                                number: "33"
                            }, {
                                name: "***线下体验卡",
                                number: "33"
                            }]
                        },
                        {
                            activityId: "123",
                            avtivityName: "xxxx活动",
                            orderId: "001",
                            createTime: "2016-09-21  08:50:08",
                            state: '已支付',
                            totalPrice: '999',
                            prizeList: [{
                                name: "华为P50",
                                number: "33"
                            }, {
                                name: "Airpods",
                                number: "33"
                            }, {
                                name: "***线下体验卡",
                                number: "33"
                            }]
                        },
                    ],
                    "resultCount": Math.floor(Math.random() * 30),
                    "pageIndex": 1,
                    "pageSize": 20,
                    "pageCount": 3
                }
            }
        });
    }
    return mockDataArray;
}
