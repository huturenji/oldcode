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
    //   urlRegExp: /supplieraccess\/v1\/supplier\/list/,
    //   urlType: "get",
    //   mockRes: {
    //     resultCode: 0,
    //     resultMessage: "success",
    //     result: {
    //       "pageCount": 5,
    //       "pageSize": 20,
    //       "pageIndex": 1,
    //       "resultCount": 35,
    //       "supplierDetailResults": [
    //         {
    //           "supplierShortName": "京东VOP",
    //           "supplierType": "JD",
    //         },
    //         {
    //           "supplierShortName": "淘宝联盟",
    //           "supplierType": "3223",
    //         },
    //         {
    //           "supplierShortName": "拼多多联盟",
    //           "supplierType": "434344",
    //         },
    //         {
    //           "supplierShortName": "苏宁联盟",
    //           "supplierType": "5454gg",
    //         },

        //       ]
        //     }
        //   }
        // });
        mockDataArray.push({
            urlRegExp: /search\/v1\/searchForOperation/,
            urlType: "post",
            mockRes: {
                resultCode: 0,
                resultMessage: "ok",
                result: {
                    "pageCount": 5,
                    "pageSize": 20,
                    "pageIndex": 1,
                    "resultCount": 35,
                    "hitResultVOList": [
                        {
                            "skuName": "Apple iPhone 13 (A2634) 512GB 蓝色 支持移动联通电信5G 双卡双待手机",
                            "supplierType": "JD",
                            "sku": "11111",
                            "mainImage": "https://img11.360buyimg.com/n1/s150x150_jfs/t1/26610/11/9243/53159/5c7ccff8E0bf8c8fa/c3473a8ca1ae0617.jpg",
                            "supplierName": "京东VOP",
                            "storeName": "京东紫荆店",
                            "price": "13555.25",
                            "specify": "蓝色，512G"
                        },
                        {
                            "skuName": "Apple iPhone 13 (A2634) 512GB 蓝色 支持移动联通电信5G 双卡双待手机",
                            "supplierType": "sdsddssdss",
                            "sku": "22222",
                            "mainImage": "https://img11.360buyimg.com/n1/s150x150_jfs/t1/26610/11/9243/53159/5c7ccff8E0bf8c8fa/c3473a8ca1ae0617.jpg",
                            "supplierName": "京东VOP",
                            "storeName": "京东紫荆店",
                            "price": "13545.25",
                            "specify": "蓝色，512G"
                        },
                        {
                            "skuName": "Apple iPhone 13 (A2634) 512GB 蓝色 支持移动联通电信5G 双卡双待手机",
                            "supplierType": "sdsddssdss",
                            "sku": "33333",
                            "mainImage": "https://img11.360buyimg.com/n1/s150x150_jfs/t1/26610/11/9243/53159/5c7ccff8E0bf8c8fa/c3473a8ca1ae0617.jpg",
                            "supplierName": "苏宁",
                            "storeName": "京东紫荆店",
                            "specify": "蓝色，512G",
                            "price": "1355.25"
                        },
                        {
                            "skuName": "Apple iPhone 13 (A2634) 512GB 蓝色 支持移动联通电信5G 双卡双待手机",
                            "supplierType": "sdsddssdss",
                            "sku": "44444",
                            "mainImage": "https://img11.360buyimg.com/n1/s150x150_jfs/t1/26610/11/9243/53159/5c7ccff8E0bf8c8fa/c3473a8ca1ae0617.jpg",
                            "supplierName": "淘宝",
                            "specify": "蓝色，512G",
                            "storeName": "京东紫荆店",
                            "price": "13555.25"
                        }

                    ]
                }
            }
        });
    // mockDataArray.push({
    //   urlRegExp: /productgroup\/v1\/page/,
    //   urlType: "post",
    //   mockRes: {
    //     resultCode: 0,
    //     resultMessage: "ok",
    //     result: {
    //       total: 12,
    //       pageSize: 10,
    //       pageNum: 1,
    //       pages: 2,
    //       records: [
    //         {
    //           groupName: "洋河蓝色经典-天之蓝",
    //           id: '1222',
    //           itemList: [
    //             {
    //               "skuName": "Apple iPhone 13 (A2634) 512GB 蓝色 支持移动联通电信5G 双卡双待手机",
    //               "groupId": "sdsddssdss",
    //               "sku": "33333",
    //               "mainImage": "https://img11.360buyimg.com/n1/s150x150_jfs/t1/26610/11/9243/53159/5c7ccff8E0bf8c8fa/c3473a8ca1ae0617.jpg",
    //               "supplierType": "淘宝",
    //               "storeName": "京东紫荆店",
    //               "price": "13555.25",
    //               "specify": "蓝色，512G",
    //             },
    //           ],
    //         },
    //       ],
    //     }
    //   }
    // });
    // mockDataArray.push({
    //   urlRegExp: /productgroup\/v1\/detail/,
    //   urlType: "post",
    //   mockRes: {
    //     resultCode: 0,
    //     resultMessage: "ok",
    //     result: {
    //       groupName: "Apple iPhone 13 (A2634) 512GB 蓝色",
    //       id: '1222',
    //       itemList: [
    //         {
    //           "skuName": "Apple iPhone 13 (A2634) 512GB 蓝色 支持移动联通电信5G 双卡双待手机",
    //           "groupId": "sdsddssdss",
    //           "sku": "33333",
    //           "mainImage": "https://img11.360buyimg.com/n1/s150x150_jfs/t1/26610/11/9243/53159/5c7ccff8E0bf8c8fa/c3473a8ca1ae0617.jpg",
    //           "supplierType": "淘宝",
    //           "storeName": "京东紫荆店",
    //           "price": "13555.25",
    //           "specify": "蓝色，512G",
    //         },
    //         {
    //           "skuName": "Apple iPhone 13 (A2634) 512GB 蓝色 支持移动联通电信5G 双卡双待手机",
    //           "groupId": "sdsddssdss",
    //           "sku": "33333",
    //           "mainImage": "https://img11.360buyimg.com/n1/s150x150_jfs/t1/26610/11/9243/53159/5c7ccff8E0bf8c8fa/c3473a8ca1ae0617.jpg",
    //           "supplierType": "淘宝",
    //           "storeName": "京东紫荆店",
    //           "price": "13555.25",
    //           "specify": "蓝色，512G",
    //         },
    //       ],
    //     }
    //   }
    // });
    // mockDataArray.push({
    //   urlRegExp: /productgroup\/v1\/add/,
    //   urlType: "post",
    //   mockRes: {
    //     resultCode: 0,
    //     resultMessage: "ok"
    //   }
    // });
    // mockDataArray.push({
    //   urlRegExp: /productgroup\/v1\/update/,
    //   urlType: "post",
    //   mockRes: {
    //     resultCode: 0,
    //     resultMessage: "ok"
    //   }
    // });
    // mockDataArray.push({
    //   urlRegExp: /productgroup\/v1\/del/,
    //   urlType: "post",
    //   mockRes: {
    //     resultCode: 0,
    //     resultMessage: "ok"
    //   }
    // });
    }
    return mockDataArray;
}
