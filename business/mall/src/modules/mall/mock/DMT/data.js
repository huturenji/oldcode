import HttpPostProcessors from "./proxy/processors/HttpPostProcessors";
/**
 * 商城mock数据
 */
export default function getMallMockData(Random) {
  let mockDataArray = [];
  let mainSwitchs = {
    paySwitch: true, //支付服务模块mock开关
    productSwitch: true, //商品服务模块mock开关
    orderSwitch: true, //订单模块mock开关
    invoiceSwitch: true, //发票模块mock开关
    addressSwitch: true, //地址模块mock开关
    favoritesSwitch: true, //商品收藏模块mock开关
    channelSwitch: true, //用户授权模块mock开关
    afterSaleSwitch: true, //售后模块mock开关
    cartSwitch: true //购物车模块mock开关
  };

  //发票服务模块mock开关
  //查询B+平台商品分类
  //   mockDataArray.push({
  //     urlRegExp: /order\/getBpProductCategories/,
  //     urlType: "post",
  //     mockRes: {
  //       code: 0,
  //       rdesc: null,
  //       zip: 0,
  //       base64: 0,
  //       data: {}
  //     }
  //   });
  /********************************************下面是支付服务****************/
  //对支付服务添加控制开关
  if (!!mainSwitchs.paySwitch) {
    /**根据渠道Id查询支付方式列表
     * channelId integer(query)渠道id
     */
    mockDataArray.push({
      urlRegExp: /channel\/v1\/getPaymentMethods/,
      urlType: "get",
      mockRes: {
        resultCode: 0,
        resultMessage: "success",
        result: {
          paymentMethods: [
            {
              payType: "WALLET_PAY",
              payTypeName: "老板付",
              icon:
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzQ2NjAyRTQ1ODJEMTFFOUI5QUNGQUJBMDIwOERDNzUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Q0MwQTUwMjI1ODJEMTFFOUI5QUNGQUJBMDIwOERDNzUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDNDY2MDJFMjU4MkQxMUU5QjlBQ0ZBQkEwMjA4REM3NSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDNDY2MDJFMzU4MkQxMUU5QjlBQ0ZBQkEwMjA4REM3NSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgOLlxkAAAdSSURBVHja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"
            },
            {
              payType: "WX_PAY",
              payTypeName: "微信",
              icon:
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzQ2NjAyRTQ1ODJEMTFFOUI5QUNGQUJBMDIwOERDNzUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Q0MwQTUwMjI1ODJEMTFFOUI5QUNGQUJBMDIwOERDNzUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDNDY2MDJFMjU4MkQxMUU5QjlBQ0ZBQkEwMjA4REM3NSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDNDY2MDJFMzU4MkQxMUU5QjlBQ0ZBQkEwMjA4REM3NSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgOLlxkAAAdSSURBVHja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"
            },
            {
              payType: "ALI_PAY",
              payTypeName: "支付宝",
              icon:
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzQ2NjAyRTQ1ODJEMTFFOUI5QUNGQUJBMDIwOERDNzUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Q0MwQTUwMjI1ODJEMTFFOUI5QUNGQUJBMDIwOERDNzUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDNDY2MDJFMjU4MkQxMUU5QjlBQ0ZBQkEwMjA4REM3NSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDNDY2MDJFMzU4MkQxMUU5QjlBQ0ZBQkEwMjA4REM3NSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgOLlxkAAAdSSURBVHja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"
            }
          ]
        }
      }
    });

    /**预支付
     * createOrderPayRequest body
     * {
        "orderNoList": [
          "string"     订单号
        ],
        "payType": "string",  支付类型(WX_PAY:微信,ALI_PAY:支付宝,UNION_PAY:银联,INBANK_PAY:行内转账,WALLET_PAY:企业钱包)
        "totalAmount": 0,   订单金额
        "ipAddress": "string",   ip地址
        "macAddress": "string",   mac地址
        "goodsDesc": "string",    商品描述
        "payMethod": "string",    支付方法（PAGE_PAY、APP_PAY、H5_PAY）
        "qrImgWidth": 0,      二维码宽度(支付宝->PAGE_PAY支付必传)
        "sceneInfo": "string",    
        "frontUrl": "string",   银联支付必传(业务类型，B2C网关支付，手机wap支付)
        "equipmentType": "string"   银联支付必传(业务类型，B2C网关支付，手机wap支付)
      }
    */
    mockDataArray.push({
      urlRegExp: /payment\/v1\/pay\/prePay/,
      urlType: "post",
      mockRes: {
        resultCode: 0,
        resultMessage: "success",
        result: {
          content: "weixin://wxpay/bizpayurl?pr=0QfdiO5",
          thirdTradeNo: "123122122",
          cpyPaySuccess: true
        }
      }
    });

    /**退费
     * applyRefundRequest body
     * {
          "refundNo": "string",   退费单号
          "orderNo": "string",    订单号
          "refundAmount": 0    退费金额
        }
    */
    mockDataArray.push({
      urlRegExp: /payment\/v1\/pay\/applyRefund/,
      urlType: "post",
      mockRes: {
        resultCode: 0,
        resultMessage: "success",
        result: {
          orderNo: "1235545656",
          refundState: "WAIT_REFUND"
        }
      }
    });

    /**根据订单号查询支付订单信息
     * orderNo  string(query) 订单号
     */
    mockDataArray.push({
      urlRegExp: /payment\/v1\/pay\/getOrderInfo/,
      urlType: "get",
      mockRes: {
        resultCode: 0,
        resultMessage: "success",
        result: {
          orderNo: "1006546256",
          channelId: 1234,
          payType: "WX_PAY",
          payState: "PAYING",
          totalAmount: 3466,
          payTime: "2020-03-20 15:30:30"
        }
      }
    });
  }
  /********************************************下面是商品服务****************/
  //商品服务添加控制开关
  if (!!mainSwitchs.productSwitch) {
    /**商品分类展示及查询
     * productCategoryType integer(query)
     * 商品分类类型，0=一级，1=二级，2=三级，默认不填，查询全部分类类型
     * productParentCategoryId integer(query)商品父类型Id
     */
    mockDataArray.push({
      urlRegExp: /product\/v1\/getCategories/,
      urlType: "get",
      mockRes: {
        resultCode: 0,
        resultMessage: "success",
        result: {
          productCategoryList: [
            {
              productCategoryId: 100,
              productParentCategoryId: 0,
              productCategoryName: "热门推荐",
              productCategoryType: 0,
              state: 1,
              productChildrenCategories: [
                {
                  productCategoryId: 200,
                  productParentCategoryId: 100,
                  productCategoryName: "热门分类",
                  productCategoryType: 1,
                  state: 1,
                  productChildrenCategories: [
                    {
                      productCategoryId: 300,
                      productParentCategoryId: 200,
                      productCategoryName: "手机",
                      state: 1,
                      productCategoryType: 2
                    },
                    {
                      productCategoryId: 301,
                      productParentCategoryId: 200,
                      productCategoryName: "手机2",
                      state: 1,
                      productCategoryType: 2
                    },
                    {
                      productCategoryId: 302,
                      productParentCategoryId: 200,
                      productCategoryName: "手机3",
                      state: 1,
                      productCategoryType: 2
                    },
                    {
                      state: 1,
                      productCategoryId: 304,
                      productParentCategoryId: 200,
                      productCategoryName: "手机",
                      productCategoryType: 2
                    },
                    {
                      state: 1,
                      productCategoryId: 305,
                      productParentCategoryId: 200,
                      productCategoryName: "手机",
                      productCategoryType: 2
                    },
                    {
                      state: 1,
                      productCategoryId: 306,
                      productParentCategoryId: 200,
                      productCategoryName: "手机",
                      productCategoryType: 2
                    }
                  ]
                },
                {
                  productCategoryId: 201,
                  productParentCategoryId: 100,
                  productCategoryName: "全网热搜",
                  productCategoryType: 1,
                  productChildrenCategories: [
                    {
                      state: 1,
                      productCategoryId: 307,
                      productParentCategoryId: 201,
                      productCategoryName: "手机",
                      productCategoryType: 2
                    },
                    {
                      state: 1,
                      productCategoryId: 308,
                      productParentCategoryId: 201,
                      productCategoryName: "手机2",
                      productCategoryType: 2
                    },
                    {
                      state: 1,
                      productCategoryId: 309,
                      productParentCategoryId: 201,
                      productCategoryName: "手机3",
                      productCategoryType: 2
                    },
                    {
                      state: 1,
                      productCategoryId: 310,
                      productParentCategoryId: 201,
                      productCategoryName: "手机",
                      productCategoryType: 2
                    },
                    {
                      state: 1,
                      productCategoryId: 311,
                      productParentCategoryId: 201,
                      productCategoryName: "手机",
                      productCategoryType: 2
                    },
                    {
                      state: 1,
                      productCategoryId: 312,
                      productParentCategoryId: 201,
                      productCategoryName: "手机",
                      productCategoryType: 2
                    }
                  ]
                }
              ]
            },
            {
              productCategoryId: 101,
              productParentCategoryId: 0,
              productCategoryName: "电脑办公",
              productCategoryType: 0,
              state: 1,
              productChildrenCategories: [
                {
                  productCategoryId: 200,
                  productParentCategoryId: 101,
                  productCategoryName: "台式电脑",
                  productCategoryType: 1,
                  productChildrenCategories: [
                    {
                      productCategoryId: 300,
                      productParentCategoryId: 200,
                      productCategoryName: "主机",
                      productCategoryType: 2
                    }
                  ]
                },
                {
                  productCategoryId: 201,
                  productParentCategoryId: 101,
                  productCategoryName: "笔记本",
                  productCategoryType: 1,
                  productChildrenCategories: [
                    {
                      productCategoryId: 312,
                      productParentCategoryId: 201,
                      productCategoryName: "联想",
                      productCategoryType: 2
                    }
                  ]
                }
              ]
            },
            {
              productCategoryId: 102,
              productParentCategoryId: 0,
              productCategoryName: "手机数码",
              productCategoryType: 0,
              state: 1,
              productChildrenCategories: [
                {
                  productCategoryId: 200,
                  productParentCategoryId: 102,
                  productCategoryName: "全面屏手机",
                  productCategoryType: 1,
                  productChildrenCategories: [
                    {
                      productCategoryId: 306,
                      productParentCategoryId: 200,
                      productCategoryName: "手机",
                      productCategoryType: 2
                    }
                  ]
                },
                {
                  productCategoryId: 201,
                  productParentCategoryId: 102,
                  productCategoryName: "数据线",
                  productCategoryType: 1,
                  productChildrenCategories: [
                    {
                      productCategoryId: 312,
                      productParentCategoryId: 201,
                      productCategoryName: "手机",
                      productCategoryType: 2
                    }
                  ]
                }
              ]
            },
            {
              productCategoryId: 103,
              productParentCategoryId: 0,
              productCategoryName: "珠宝首饰",
              productCategoryType: 0,
              state: 1,
              productChildrenCategories: [
                {
                  productCategoryId: 200,
                  productParentCategoryId: 103,
                  productCategoryName: "砖石",
                  productCategoryType: 1,
                  productChildrenCategories: [
                    {
                      productCategoryId: 306,
                      productParentCategoryId: 200,
                      productCategoryName: "手机",
                      productCategoryType: 2
                    }
                  ]
                },
                {
                  productCategoryId: 201,
                  productParentCategoryId: 103,
                  productCategoryName: "瑞士手表",
                  productCategoryType: 1,
                  productChildrenCategories: [
                    {
                      productCategoryId: 312,
                      productParentCategoryId: 201,
                      productCategoryName: "手机",
                      productCategoryType: 2
                    }
                  ]
                }
              ]
            },
            {
              productCategoryId: 104,
              productParentCategoryId: 0,
              productCategoryName: "图书音像",
              productCategoryType: 0,
              state: 1,
              productChildrenCategories: [
                {
                  productCategoryId: 200,
                  productParentCategoryId: 104,
                  productCategoryName: "文学",
                  productCategoryType: 1,
                  productChildrenCategories: [
                    {
                      productCategoryId: 306,
                      productParentCategoryId: 200,
                      productCategoryName: "手机",
                      productCategoryType: 2
                    }
                  ]
                },
                {
                  productCategoryId: 201,
                  productParentCategoryId: 104,
                  productCategoryName: "教辅",
                  productCategoryType: 1,
                  productChildrenCategories: [
                    {
                      productCategoryId: 312,
                      productParentCategoryId: 201,
                      productCategoryName: "手机",
                      productCategoryType: 2
                    }
                  ]
                }
              ]
            },
            {
              productCategoryId: 105,
              productParentCategoryId: 0,
              productCategoryName: "母婴童装",
              productCategoryType: 0,
              state: 1,
              productChildrenCategories: [
                {
                  productCategoryId: 200,
                  productParentCategoryId: 105,
                  productCategoryName: "奶粉",
                  productCategoryType: 1,
                  productChildrenCategories: [
                    {
                      productCategoryId: 306,
                      productParentCategoryId: 200,
                      productCategoryName: "有机",
                      productCategoryType: 2
                    }
                  ]
                },
                {
                  productCategoryId: 201,
                  productParentCategoryId: 105,
                  productCategoryName: "尿不湿",
                  productCategoryType: 1,
                  productChildrenCategories: [
                    {
                      productCategoryId: 312,
                      productParentCategoryId: 201,
                      productCategoryName: "手机",
                      productCategoryType: 2
                    }
                  ]
                }
              ]
            },
            {
              productCategoryId: 106,
              productParentCategoryId: 0,
              productCategoryName: "汽车生活",
              productCategoryType: 0,
              state: 1,
              productChildrenCategories: [
                {
                  productCategoryId: 200,
                  productParentCategoryId: 106,
                  productCategoryName: "养护用品",
                  productCategoryType: 1,
                  productChildrenCategories: [
                    {
                      productCategoryId: 306,
                      productParentCategoryId: 200,
                      productCategoryName: "手机",
                      productCategoryType: 2
                    }
                  ]
                },
                {
                  productCategoryId: 201,
                  productParentCategoryId: 106,
                  productCategoryName: "车型",
                  productCategoryType: 1,
                  productChildrenCategories: [
                    {
                      productCategoryId: 312,
                      productParentCategoryId: 201,
                      productCategoryName: "手机",
                      productCategoryType: 2
                    }
                  ]
                }
              ]
            },
            {
              productCategoryId: 107,
              productParentCategoryId: 0,
              productCategoryName: "美妆护肤",
              productCategoryType: 0,
              state: 1,
              productChildrenCategories: [
                {
                  productCategoryId: 200,
                  productParentCategoryId: 107,
                  productCategoryName: "当季主推",
                  productCategoryType: 1,
                  productChildrenCategories: [
                    {
                      productCategoryId: 306,
                      productParentCategoryId: 200,
                      productCategoryName: "手机",
                      productCategoryType: 2
                    }
                  ]
                },
                {
                  productCategoryId: 201,
                  productParentCategoryId: 107,
                  productCategoryName: "拔草推荐",
                  productCategoryType: 1,
                  productChildrenCategories: [
                    {
                      productCategoryId: 312,
                      productParentCategoryId: 201,
                      productCategoryName: "手机",
                      productCategoryType: 2
                    }
                  ]
                }
              ]
            },
            {
              productCategoryId: 108,
              productParentCategoryId: 0,
              productCategoryName: "计生情趣",
              productCategoryType: 0,
              state: 1,
              productChildrenCategories: [
                {
                  productCategoryId: 200,
                  productParentCategoryId: 108,
                  productCategoryName: "男用器具",
                  productCategoryType: 1,
                  productChildrenCategories: [
                    {
                      productCategoryId: 300,
                      productParentCategoryId: 200,
                      productCategoryName: "手机",
                      productCategoryType: 2
                    }
                  ]
                },
                {
                  productCategoryId: 201,
                  productParentCategoryId: 108,
                  productCategoryName: "女士专用",
                  productCategoryType: 1,
                  productChildrenCategories: [
                    {
                      productCategoryId: 307,
                      productParentCategoryId: 201,
                      productCategoryName: "手机",
                      productCategoryType: 2
                    }
                  ]
                }
              ]
            }
          ]
        }
      }
    });

    /**
     * 获取商品价格
     * 
     * {
        "spId": "1",
        "businessType": "COMMODITY",
        "productInfos": [
            {
                "skuId": "123456"
            }
        ]
    }
     */
    mockDataArray.push({
      urlRegExp: /product\/v1\/listUnitPrice/,
      urlType: "post",
      mockRes: {
        result: {
          productPrice: [
            {
              skuId: "123456",
              unitPrice: 156
            }
          ]
        },
        resultMessage: "执行成功",
        resultCode: 0
      }
    });

    /**商品搜索
    * SearchProductRequest   body
    * {
        "keyword": "string",搜索关键字
        "min": 0, 价格区间搜索，低价
        "max": 0, 价格区间搜索，高价
        "brands": "string", 品牌搜索 多个品牌以逗号分隔，需要编码
        "catId": "string", 分类Id,只支持三级类目Id
        "cid1": "string", 一级分类
        "cid2": "string", 二级分类
        "pageNum": 0, Default value : 1
        "pageSize": 0 Default value : 20
        "sortType": "string" 排序规则。sale_desc，price_asc, price_desc
      }  
    */
    mockDataArray.push({
      urlRegExp: /product\/v1\/search/,
      urlType: "post",
      mockRes: HttpPostProcessors.getProcess4Cache("/product/v1/search")({
        resultCode: 0,
        resultMessage: "success",
        result: {
          resultCount: 20,
          pageCount: 2,
          pageSize: 10,
          pageNum: 1,
          brandAggregate: {
            brandList: [
              {
                id: "001",
                name: "三星",
                pinyin: "sx"
              }
            ]
          },
          categoryAggregate: {
            firstCategory: [
              {
                catId: 0,
                count: 2233,
                name: "电脑",
                weight: "2"
              }
            ],
            secondCategory: [
              {
                catId: 2233,
                count: 2320,
                name: "电脑放到",
                weight: "2"
              }
            ],
            thirdCategory: [
              {
                catId: 445,
                count: 333,
                name: "电脑规范",
                weight: "2"
              }
            ]
          },
          hitResult: [
            {
              brand: "三星",
              imageUrl:
                "/jfs/t14749/245/506469347/72873/617a5312/5a2f9356N3e0bc4e6.jpg",
              wareName: "笔记本",
              sku: "123456",
              price: 4999
            }
          ]
        }
      })
    });

    /**商品详情摘要
     * ProductDetailRequest body
     * {
        "sku": [
          "string" 商品编号
        ],
        "supplierId": 1
      }
     */
    mockDataArray.push({
      urlRegExp: /product\/v1\/getSummary/,
      urlType: "post",
      mockRes: HttpPostProcessors.getProcess4Cache("/product/v1/getSummary")(
        {
          resultCode: 0,
          resultMessage: "success",
          result: {
            detail: [
              {
                name: "笔记本",
                price: 123,
                sku: "100005171461",
                supplierId: 1,
                imagePath:
                  "/jfs/t14749/245/506469347/72873/617a5312/5a2f9356N3e0bc4e6.jpg"
              }
            ]
          }
        }
      )
    });

    /**商品详情
     * ProductDetailRequest body
     * {
        "sku": [
          "string" 商品编号
        ],
        "queryExts": "string"展字段，nappintroduction=在移动端展示，nintroduction=在pc端展示，wxintroduction=在微信小程序展示
        "supplierId": 1
      }
     */
    mockDataArray.push({
      urlRegExp: /product\/v1\/getDetail/,
      urlType: "post",
      mockRes: HttpPostProcessors.getProcess4Cache("/product/v1/getDetail")({
        resultCode: 0,
        resultMessage: "success",
        result: {
          detail: [
            {
              saleUnit: "台",
              weight: "2.3",
              productArea: "江西九江",
              wareQD: "笔记本主机 x1 电源适配器 x1",
              imagePath:
                "/jfs/t14749/245/506469347/72873/617a5312/5a2f9356N3e0bc4e6.jpg",
              param:
                "<div cssurl='//sku-market-gw.jd.com/css/pc/100005171461.css?t=1574322635458'></div><div id='zbViewModulesH'  value='20279'></div><input id='zbViewModulesHeight' type='hidden' value='20279'/><div skudesign='100010'></div><div class='ssd-module-wrap' >↵    <div class='ssd-module M15707731610201 animate-M15707731610201' data-id='M15707731610201'>↵        ↵</div>↵<div class='ssd-module M15707731610542 animate-M15707731610542' data-id='M15707731610542'>↵        ↵</div>↵<div class='ssd-module M15707731610743 animate-M15707731610743' data-id='M15707731610743'>↵        ↵</div>↵<div class='ssd-module M15707731610935 animate-M15707731610935' data-id='M15707731610935'>↵        ↵</div>↵<div class='ssd-module M15707731611147 animate-M15707731611147' data-id='M15707731611147'>↵        ↵</div>↵<div class='ssd-module M15707731611398 animate-M15707731611398' data-id='M15707731611398'>↵        ↵</div>↵<div class='ssd-module M15707731611679 animate-M15707731611679' data-id='M15707731611679'>↵        ↵</div>↵<div class='ssd-module M157077316119210 animate-M157077316119210' data-id='M157077316119210'>↵        ↵</div>↵<div class='ssd-module M157077316123611 animate-M157077316123611' data-id='M157077316123611'>↵        ↵</div>↵<div class='ssd-module M157077316127412 animate-M157077316127412' data-id='M157077316127412'>↵        ↵</div>↵<div class='ssd-module M157077316132113 animate-M157077316132113' data-id='M157077316132113'>↵        ↵</div>↵<div class='ssd-module M157077316137215 animate-M157077316137215' data-id='M157077316137215'>↵        ↵</div>↵<div class='ssd-module M157077316142016 animate-M157077316142016' data-id='M157077316142016'>↵        ↵</div>↵<div class='ssd-module M157077316145517 animate-M157077316145517' data-id='M157077316145517'>↵        ↵</div>↵<div class='ssd-module M157077316148818 animate-M157077316148818' data-id='M157077316148818'>↵        ↵</div>↵<div class='ssd-module M157077316152119 animate-M157077316152119' data-id='M157077316152119'>↵        ↵</div>↵<div class='ssd-module M157077316156020 animate-M157077316156020' data-id='M157077316156020'>↵        ↵</div>↵<div class='ssd-module M157077316159121 animate-M157077316159121' data-id='M157077316159121'>↵        ↵</div>↵<div class='ssd-module M157077316165423 animate-M157077316165423' data-id='M157077316165423'>↵        ↵</div>↵↵</div>↵<!-- 2019-11-14 03:56:22 --> ↵<link rel='stylesheet' type='text/css' href='//sku-market-gw.jd.com/css/pc/100005171461.css?t=1583120226993' media='all' />",
              state: "1",
              sku: "100056989",
              brandName: "联想（Lenovo）",
              upc: "100005171461;6941192212328",
              category: "670;671;672",
              name: "笔记本",
              introduction:
                "<div cssurl='//sku-market-gw.jd.com/css/pc/100005171461.css?t=1574322635458'></div><div id='zbViewModulesH'  value='20279'></div><input id='zbViewModulesHeight' type='hidden' value='20279'/><div skudesign='100010'></div><div class='ssd-module-wrap' >↵    <div class='ssd-module M15707731610201 animate-M15707731610201' data-id='M15707731610201'>↵        ↵</div>↵<div class='ssd-module M15707731610542 animate-M15707731610542' data-id='M15707731610542'>↵        ↵</div>↵<div class='ssd-module M15707731610743 animate-M15707731610743' data-id='M15707731610743'>↵        ↵</div>↵<div class='ssd-module M15707731610935 animate-M15707731610935' data-id='M15707731610935'>↵        ↵</div>↵<div class='ssd-module M15707731611147 animate-M15707731611147' data-id='M15707731611147'>↵        ↵</div>↵<div class='ssd-module M15707731611398 animate-M15707731611398' data-id='M15707731611398'>↵        ↵</div>↵<div class='ssd-module M15707731611679 animate-M15707731611679' data-id='M15707731611679'>↵        ↵</div>↵<div class='ssd-module M157077316119210 animate-M157077316119210' data-id='M157077316119210'>↵        ↵</div>↵<div class='ssd-module M157077316123611 animate-M157077316123611' data-id='M157077316123611'>↵        ↵</div>↵<div class='ssd-module M157077316127412 animate-M157077316127412' data-id='M157077316127412'>↵        ↵</div>↵<div class='ssd-module M157077316132113 animate-M157077316132113' data-id='M157077316132113'>↵        ↵</div>↵<div class='ssd-module M157077316137215 animate-M157077316137215' data-id='M157077316137215'>↵        ↵</div>↵<div class='ssd-module M157077316142016 animate-M157077316142016' data-id='M157077316142016'>↵        ↵</div>↵<div class='ssd-module M157077316145517 animate-M157077316145517' data-id='M157077316145517'>↵        ↵</div>↵<div class='ssd-module M157077316148818 animate-M157077316148818' data-id='M157077316148818'>↵        ↵</div>↵<div class='ssd-module M157077316152119 animate-M157077316152119' data-id='M157077316152119'>↵        ↵</div>↵<div class='ssd-module M157077316156020 animate-M157077316156020' data-id='M157077316156020'>↵        ↵</div>↵<div class='ssd-module M157077316159121 animate-M157077316159121' data-id='M157077316159121'>↵        ↵</div>↵<div class='ssd-module M157077316165423 animate-M157077316165423' data-id='M157077316165423'>↵        ↵</div>↵↵</div>↵<!-- 2019-11-14 03:56:22 --> ↵<link rel='stylesheet' type='text/css' href='//sku-market-gw.jd.com/css/pc/100005171461.css?t=1583120226993' media='all' />",
              sheet: "印张（图书商品）",
              isbn: "ISBN（图书商品）",
              editer: "编者（图书商品）",
              printNo: "印次（图书商品）",
              author: "作者（图书商品）",
              packNum: "装数量（图书商品）",
              printTime: "印刷时间（图书商品）",
              papers: "用纸（图书商品）",
              package: "用纸（图书商品）",
              proofreader: "用纸（图书商品）",
              publishTime: "用纸（图书商品）",
              pages: "用纸（图书商品）",
              authorDesc: "用纸（图书商品）",
              transfer: "用纸（图书商品）",
              drawer: "用纸（图书商品）",
              language: "用纸（图书商品）",
              batchNo: "用纸（图书商品）",
              press: "用纸（图书商品）",
              foreignname: "用纸（图书商品）",
              format: "用纸（图书商品）",
              performer: "用纸（图书商品）",
              soundtrack: "用纸（图书商品）",
              actor: "用纸（图书商品）",
              region: "用纸（图书商品）",
              voiceover: "用纸（图书商品）",
              director: "用纸（图书商品）",
              languageSubtitled: "用纸（图书商品）",
              media: "用纸（图书商品）",
              screenRatio: "用纸（图书商品）",
              episode: "用纸（图书商品）",
              mvdWxjz: "用纸（图书商品）",
              publishingCompany: "用纸（图书商品）",
              singer: "用纸（图书商品）",
              languagePronunciation: "用纸（图书商品）",
              productionCompany: "用纸（图书商品）",
              audioEncodingChinese: "用纸（图书商品）",
              authors: "用纸（图书商品）",
              aka: "用纸（图书商品）",
              copyright: "用纸（图书商品）",
              compose: "用纸（图书商品）",
              screenwriter: "用纸（图书商品）",
              languageDubbed: "用纸（图书商品）",
              length: "用纸（图书商品）",
              releaseDate: "用纸（图书商品）",
              price: 4999
            }
          ]
        }
      })
    });

    /**
     * 商品详情获取销售属性
     * 入参
     * {
     *  sku: "string" 商品编号，只支持单个查询
     *  supplierId:1
     * }
     */
    mockDataArray.push({
      urlRegExp: /product\/v1\/spec\/getSpec/,
      urlType: "post",
      mockRes: {
        resultCode: 0,
        resultMessage: "success",
        result: {
          spec: [
            {
              sku: "1235452",
              spec: "笔记本电脑"
            }
          ]
        }
      }
    });

    /**
     * 商品详情批量获取销售属性
     * 入参
     * {
     *   sku: "string" 商品编号，只支持单个查询
     *   supplierId:1
     * }
     */
    mockDataArray.push({
      urlRegExp: /product\/v1\/spec\/getSimilar/,
      urlType: "post",
      mockRes: {
        resultCode: 0,
        resultMessage: "success",
        result: {
          spec: [
            {
              dim: 0,
              saleName: "颜色",
              saleAttrList: [
                {
                  imagePath: "string",
                  saleValue: "白色",
                  skuIds: [1235452, 1235455]
                },
                {
                  imagePath: "string",
                  saleValue: "黑色",
                  skuIds: [1235455]
                }
              ]
            },
            {
              dim: 0,
              saleName: "尺寸",
              saleAttrList: [
                {
                  imagePath: "string",
                  saleValue: "6寸",
                  skuIds: [1235452]
                },
                {
                  imagePath: "string",
                  saleValue: "7寸",
                  skuIds: [1235455]
                }
              ]
            }
          ]
        }
      }
    });
  }
  /********************************************下面是订单****************/
  //订单模块添加控制开关
  if (!!mainSwitchs.orderSwitch) {
    /**查询B+商品订单列表
       * {
        "pageSize": 0,
        "pageNum": 0,
        "channelId": 0,
        "companyId": 0,
        "userId": 0,
        "queryExt": {
          "orderState": 0,
          "ext": "string"
        }
      }
       */
    mockDataArray.push({
      urlRegExp: /order\/v1\/list/,
      urlType: "post",
      mockRes: HttpPostProcessors.getProcess4Cache("/order/v1/list")({
        resultCode: 0,
        resultMessage: "success",
        result: {
          total: 0,
          pages: 0,
          orders: [
            {
              channelId: "31",
              companyId: "123",
              userId: "1231321",
              parentOrderNo: "12021244656",
              orderNo: "12003266541",
              channelOrderNo: "1212",
              supplierOrderNo: "2er434343",
              orderState: 1,
              orderType: 0,
              orderSource: 0,
              productTotal: "3344",
              paymentAmount: "38890",
              quantity: 1,
              createTime: "2020-03-03 10:05:05",
              paymentTime: "2020-03-03 10:05:05",
              paymentType: 1,
              paymentFlowNo: "wewe",
              deleteState: 0,
              remark: "时代大",
              paymentExpiredDeadline: "1584367714",
              products: [
                {
                  sku: "212212",
                  name: "联想小新Air14",
                  imageUrl:
                    "/jfs/t14749/245/506469347/72873/617a5312/5a2f9356N3e0bc4e6.jpg",
                  productTotal: "3344",
                  unitPrice: "2323",
                  purchaseUnitPrice: "344",
                  quantity: 1,
                  productType: 0,
                  skuClassify: 0,
                  specification: "颜色：小新 14 双通道 R5 8G 1T+256G",
                  masterSku: "23232",
                  categoryId: 0,
                  unitWeight: "台",
                  unitSize: "22"
                }
              ]
            },
            {
              channelId: "31",
              companyId: "123",
              userId: "1231321",
              parentOrderNo: "12021244656",
              orderNo: "12003266542",
              channelOrderNo: "1212",
              supplierOrderNo: "2er434343",
              orderState: 2,
              orderType: 0,
              orderSource: 0,
              productTotal: "3344",
              paymentAmount: "38890",
              quantity: 1,
              createTime: "2020-03-03 10:05:05",
              paymentTime: "2020-03-03 10:05:05",
              paymentType: 1,
              paymentFlowNo: "wewe",
              deleteState: 0,
              products: [
                {
                  sku: "212212",
                  name: "联想小新Air14",
                  imageUrl:
                    "/jfs/t14749/245/506469347/72873/617a5312/5a2f9356N3e0bc4e6.jpg",
                  productTotal: "3344",
                  unitPrice: "2323",
                  purchaseUnitPrice: "344",
                  quantity: 1,
                  productType: 0,
                  skuClassify: 0,
                  specification: "颜色：小新 14 双通道 R5 8G 1T+256G",
                  masterSku: "23232",
                  categoryId: 0,
                  unitWeight: "台",
                  unitSize: "22"
                },
                {
                  sku: "212212",
                  name: "联想小新Air14",
                  imageUrl:
                    "/jfs/t14749/245/506469347/72873/617a5312/5a2f9356N3e0bc4e6.jpg",
                  productTotal: "3344",
                  unitPrice: "2323",
                  purchaseUnitPrice: "344",
                  quantity: 1,
                  productType: 0,
                  skuClassify: 0,
                  specification: "颜色：小新 14 双通道 R5 8G 1T+256G",
                  masterSku: "23232",
                  categoryId: 0,
                  unitWeight: "台",
                  unitSize: "22"
                }
              ]
            },
            {
              channelId: "31",
              companyId: "123",
              userId: "1231321",
              parentOrderNo: "12021244656",
              orderNo: "12003266543",
              channelOrderNo: "1212",
              supplierOrderNo: "2er434343",
              orderState: 5,
              orderType: 0,
              orderSource: 0,
              productTotal: "3344",
              paymentAmount: "38890",
              quantity: 1,
              createTime: "2020-03-03 10:05:05",
              paymentTime: "2020-03-03 10:05:05",
              paymentType: 1,
              paymentFlowNo: "wewe",
              deleteState: 0,
              products: [
                {
                  sku: "212212",
                  name: "联想小新Air14",
                  imageUrl:
                    "/jfs/t14749/245/506469347/72873/617a5312/5a2f9356N3e0bc4e6.jpg",
                  productTotal: "3344",
                  unitPrice: "2323",
                  purchaseUnitPrice: "344",
                  quantity: 1,
                  productType: 0,
                  skuClassify: 0,
                  specification: "颜色：小新 14 双通道 R5 8G 1T+256G",
                  masterSku: "23232",
                  categoryId: 0,
                  unitWeight: "台",
                  unitSize: "22"
                },
                {
                  sku: "212212",
                  name: "联想小新Air14",
                  imageUrl:
                    "/jfs/t14749/245/506469347/72873/617a5312/5a2f9356N3e0bc4e6.jpg",
                  productTotal: "3344",
                  unitPrice: "2323",
                  purchaseUnitPrice: "344",
                  quantity: 1,
                  productType: 0,
                  skuClassify: 0,
                  specification: "颜色：小新 14 双通道 R5 8G 1T+256G",
                  masterSku: "23232",
                  categoryId: 0,
                  unitWeight: "台",
                  unitSize: "22"
                },
                {
                  sku: "212212",
                  name: "联想小新Air14",
                  imageUrl:
                    "/jfs/t14749/245/506469347/72873/617a5312/5a2f9356N3e0bc4e6.jpg",
                  productTotal: "3344",
                  unitPrice: "2323",
                  purchaseUnitPrice: "344",
                  quantity: 1,
                  productType: 0,
                  skuClassify: 0,
                  specification: "颜色：小新 14 双通道 R5 8G 1T+256G",
                  masterSku: "23232",
                  categoryId: 0,
                  unitWeight: "台",
                  unitSize: "22"
                }
              ]
            },
            {
              channelId: "31",
              companyId: "123",
              userId: "1231321",
              parentOrderNo: "12021244656",
              orderNo: "12003266544",
              channelOrderNo: "1212",
              supplierOrderNo: "2er434343",
              orderState: 4,
              orderType: 0,
              orderSource: 0,
              productTotal: "3344",
              paymentAmount: "38890",
              quantity: 1,
              createTime: "2020-03-03 10:05:05",
              paymentTime: "2020-03-03 10:05:05",
              paymentType: 1,
              paymentFlowNo: "wewe",
              deleteState: 0,
              products: [
                {
                  sku: "212212",
                  name: "联想小新Air14",
                  imageUrl:
                    "/jfs/t14749/245/506469347/72873/617a5312/5a2f9356N3e0bc4e6.jpg",
                  productTotal: "3344",
                  unitPrice: "2323",
                  purchaseUnitPrice: "344",
                  quantity: 1,
                  productType: 0,
                  skuClassify: 0,
                  specification: "颜色：小新 14 双通道 R5 8G 1T+256G",
                  masterSku: "23232",
                  categoryId: 0,
                  unitWeight: "台",
                  unitSize: "22"
                },
                {
                  sku: "212212",
                  name: "联想小新Air14",
                  imageUrl:
                    "/jfs/t14749/245/506469347/72873/617a5312/5a2f9356N3e0bc4e6.jpg",
                  productTotal: "3344",
                  unitPrice: "2323",
                  purchaseUnitPrice: "344",
                  quantity: 1,
                  productType: 0,
                  skuClassify: 0,
                  specification: "颜色：小新 14 双通道 R5 8G 1T+256G",
                  masterSku: "23232",
                  categoryId: 0,
                  unitWeight: "台",
                  unitSize: "22"
                },
                {
                  sku: "212212",
                  name: "联想小新Air14",
                  imageUrl:
                    "/jfs/t14749/245/506469347/72873/617a5312/5a2f9356N3e0bc4e6.jpg",
                  productTotal: "3344",
                  unitPrice: "2323",
                  purchaseUnitPrice: "344",
                  quantity: 1,
                  productType: 0,
                  skuClassify: 0,
                  specification: "颜色：小新 14 双通道 R5 8G 1T+256G",
                  masterSku: "23232",
                  categoryId: 0,
                  unitWeight: "台",
                  unitSize: "22"
                },
                {
                  sku: "212212",
                  name: "联想小新Air14",
                  imageUrl:
                    "/jfs/t14749/245/506469347/72873/617a5312/5a2f9356N3e0bc4e6.jpg",
                  productTotal: "3344",
                  unitPrice: "2323",
                  purchaseUnitPrice: "344",
                  quantity: 1,
                  productType: 0,
                  skuClassify: 0,
                  specification: "颜色：小新 14 双通道 R5 8G 1T+256G",
                  masterSku: "23232",
                  categoryId: 0,
                  unitWeight: "台",
                  unitSize: "22"
                },
                {
                  sku: "212212",
                  name: "联想小新Air14",
                  imageUrl:
                    "/jfs/t14749/245/506469347/72873/617a5312/5a2f9356N3e0bc4e6.jpg",
                  productTotal: "3344",
                  unitPrice: "2323",
                  purchaseUnitPrice: "344",
                  quantity: 1,
                  productType: 0,
                  skuClassify: 0,
                  specification: "颜色：小新 14 双通道 R5 8G 1T+256G",
                  masterSku: "23232",
                  categoryId: 0,
                  unitWeight: "台",
                  unitSize: "22"
                }
              ]
            }
          ]
        }
      })
    });

    /**查询B+商品订单详情
     * orderNo  string(query) B+商城订单编号
     */
    mockDataArray.push({
      urlRegExp: /order\/v1\/getDetail/,
      urlType: "post",
      mockRes: HttpPostProcessors.getProcess4Cache("/order/v1/getDetail")({
        resultCode: 0,
        resultMessage: "success",
        result: {
          order: {
            channelId: "2323",
            companyId: "2333",
            userId: "2123232321",
            parentOrderNo: "4002156564659",
            orderNo: "12003266541",
            flowId: "12gf266541",
            needApprove: 0, //是否需要审批，0=不需要，1=需要
            channelOrderNo: "R444444444444",
            supplierOrderNo: "E343333333333",
            orderState: 5,
            orderType: 0,
            orderSource: 0,
            productTotal: "44",
            paymentAmount: "34343",
            quantity: 1,
            createTime: "1584367714",
            paymentTime: "1584367714",
            paymentType: 100,
            // paymentType: "INBANK_PAY_UAT",
            paymentTypeName:"老板付--UAT",
            paymentFlowNo: "wewewwewe",
            deleteState: 0,
            remark: "时代大厦多所多所多",
            paymentExpiredDeadline: "86387"
          },
          products: [
            {
              sku: "32",
              name: "联想小新Air14 ",
              imageUrl:
                "/jfs/t14749/245/506469347/72873/617a5312/5a2f9356N3e0bc4e6.jpg",
              productTotal: "22323",
              unitPrice: "213",
              purchaseUnitPrice: "33",
              quantity: 1,
              productType: 0,
              skuClassify: 0,
              specification: "颜色：小新 14 双通道 R5 8G 1T+256G",
              masterSku: "334",
              categoryId: 0,
              unitWeight: "台",
              unitSize: "32323"
            }
          ],
          receiverInfo: {
            province: "江西",
            provinceCode: "122",
            city: "九江市",
            cityCode: "222",
            district: "江西九江市",
            districtCode: "333",
            townCode: "六一接到",
            town: "233",
            address: "江西九江市",
            name: "刘德华",
            phone: "15666666666"
          },
          orderExpress: {
            carrierNo: "1546565562",
            carrier: "京东物流",
            waybillNo: "文343434",
            expectedDeliveryTime: "1584367714",
            expectedDeliveryTimeRange: "9:00-15:00",
            expectedReservedDeliveryTime: "1584367714",
            expectedReservedDeliveryTimeRange: "9:00-15:00",
            freight: "34",
            weight: "23",
            expressRouteInfos: [
              {
                state: "1",
                remarkAndTime: [
                  {
                    remark: "货物已完成配送，感谢您选择京东物流",
                    time: "1584367714",
                    phone: "139784579562",
                    name: "快递员小宋"
                  }
                ]
              }
            ]
          },
          orderInvoice: {
            invoiceType: 2,
            invoiceTitle: "深圳兆日科技股份有限公司",
            invoiceContent: "商品明细",
            invoiceUrl: [
              "/jfs/t14749/245/506469347/72873/617a5312/5a2f9356N3e0bc4e6.jpg"
            ],
            invoiceState: 2,
            invoiceProcess: "订单下单，订单完成，发票开具"
          }
        }
      })
    });

    /**
     * 创建B+订单
     * CreateOrderRequest
{
    "order": {
        "channelId": 0, 渠道Id
        "companyId": 0,企业Id
        "userId": 0,用户Id
        "parentOrderNo": "string",父订单号,当此字段不为空时，说明有拆单,拆单原因，不同的仓库或者是商品供应商
        "orderNo": "string",订单编号，当父订单号不为空时，为子订单号
        "channelOrderNo": "string",来自渠道的订单编号(例如银企通)
        "supplierOrderNo": "string",来自供应商的订单编号(例如京东)
        "orderState": 0,订单状态，0=全部，1=待审批；2=待付款；4=待收货,5=已完成；6=已取消
        "orderType": 0,订单类型：0=所有订单类型 1=机票，2=酒店，3=火车票，4=快递，5=保险，6=用车，7=商品
        "orderSource": 0,订单来源，0=正常单，1=售后服务单产生的订单,2=秒杀单
        "productTotal": "string",商品金额总计=商品销售价之和
        "paymentAmount": "string",订单实付金额，单位人民币
        "quantity": 0,购买商品数量
        "createTime": "string",订单创建时间,Unix 时间戳，单位为秒，单位不返回
        "paymentTime": "string",订单支付时间,Unix 时间戳，单位为秒，单位不返回
        "paymentType": 0,支付方式，1=微信，2=支付宝，3=老板付，7=银联支付，8=行内转账
        "paymentFlowNo": "string",支付流水号
        "deleteState": 0,订单删除状态，0=未删除，1=已删除
        "remark": "string",订单备注
        "paymentExpiredDeadline": "string"订单支付时间,Unix 时间戳，单位为秒，单位不返回
         flowId: "12gf266541",
         needApprove:0,//是否需要审批，0=不需要，1=需要        
    },
    "products": [
        {
            "sku": "string",商品sku编号
            "supplierId": "string",供应商Id
            "name": "string",购买商品名称
            "imageUrl": "string",商品图片
            "productTotal": "string",商品总价格，单位：人民币
            "unitPrice": "string",商品销售单价，单位：人民币
            "purchaseUnitPrice": "string",商品供应商结算价
            "quantity": 0,商品数量
            "productType": 0,商品类型，0=主商品，1=附加 ，2=赠品
            "skuClassify": 0,大小件标记，1=中小件，2=大家电
            "specification": "颜色：小新 14 双通道 R5 8G 1T+256G",商品销售属性
            "masterSku": "string",主商品skuid，如果本身是主商品，则null
            "categoryId": 0,商品分类
            "unitWeight": "string",每个商品重量，单位：kg,单位不返回
            "unitSize": "string"给个商品大小，单位：cm
        }
    ],
    "orderInvoice": {
        "invoiceType": 0,发票类型,2=增值税专用发票，3=电子发票
        "invoiceTitle": "深圳兆日科技股份有限公司",发票抬头
        "invoiceContent": "商品明细",发票内容
        "invoiceUrl": [
            "string"
        ],
        "invoiceState": 0,发票状态，0=未开票，1=已开票
        "invoiceProcess": "订单下单，订单完成，发票开具" 发票进度
    },
    "orderExpress": {
        "carrierNo": "string",快递公司编号
        "carrier": "京东物流",快递公司名称，国内承运人
        "waybillNo": "string",快递订单号，运单号
        "expectedDeliveryTime": "string",中小件预计送达日期,Unix 时间戳，单位为秒，单位不返回
        "expectedDeliveryTimeRange": "9:00-15:00",中小件预计送达时间范围
        "expectedReservedDeliveryTime": "string",家电预计送达日期,Unix 时间戳，单位为秒，单位不返回
        "expectedReservedDeliveryTimeRange": "9:00-15:00",家电预计送达时间范围
        "freight": "string",运费,单位：人民币
        "weight": "string",货物总重量,单位：kg,单位不返回
        "expressRouteInfos": [
            {
                "state": "string",物流状态，0=运输中，1=配送中，2=已签收
                "remarkAndTime": [
                    {
                        "remark": "货物已完成配送，感谢您选择京东物流",物流信息
                        "time": "string",物流时间,Unix 时间戳，单位为秒，单位不返回
                        "phone": "string",配送人员手机号
                        "name": "string"配送员姓名
                    }
                ]
            }
        ]
    },
    "receiverInfo": {
        "province": "string",省份
        "provinceCode": "string",省份编码
        "city": "string",城市
        "cityCode": "string",城市编码
        "district": "string",县区
        "districtCode": "string",县区编码
        "address": "string",收货人详细地址
        "name": "string",收货人姓名
        "phone": "string"收货人电话
    }
}
     */
    mockDataArray.push({
      urlRegExp: /order\/v1\/order\/createOrder/,
      urlType: "post",
      mockRes: {
        resultCode: 0,
        resultMessage: "OK",
        result: {
          orderNo: "12355655"
        }
      }
    });
    /**
     * 更新商城订单
     * 
     * {
        "orderNo": "string",
        "orderState": 0,
        "flowId": "string",
        "orderInvoice": {
            "invoiceType": 0,
            "invoiceCategory": 0,
            "invoiceTitle": "深圳兆日科技股份有限公司",
            "invoiceContent": "商品明细",
            "invoiceUrl": [
                "string"
            ],
            "invoiceState": 0,
            "taxNo": "string",
            "registerAddress": "string",
            "registerPhone": "string",
            "account": "string",
            "bank": "string",
            "address": "string",
            "phone": "string",
            "email": "string",
            "invoiceProcess": "订单下单，订单完成，发票开具"
        },
        "receiverInfo": {
            "province": "string",
            "provinceCode": "string",
            "city": "string",
            "cityCode": "string",
            "district": "string",
            "districtCode": "string",
            "address": "string",
            "name": "string",
            "phone": "string"
        }
    }
     * 
     * 
     */
    mockDataArray.push({
      urlRegExp: /order\/v1\/order\/updateOrderDetail/,
      urlType: "post",
      mockRes: {
        resultCode: 0,
        resultMessage: "OK",
        result: {
          bpOrderNo: "12355655"
        }
      }
    });
    /**
     * 更新商城订单审批状态
     * {
          "orderNo": "string",订单编号
          "formNo": "string",表单编号
          "formState": 0,表单状态，1、已审批，2、已取消
          "signData": "string"签名
        }
     * 
     */
    mockDataArray.push({
      urlRegExp: /order\/v1\/order\/updateOrderApproveState/,
      urlType: "post",
      mockRes: {
        resultCode: 0,
        resultMessage: "OK"
      }
    });
    /**取消B+订单
     * CancelOrderRequest   body
     * {"orderNo": "string"}
     */
    mockDataArray.push({
      urlRegExp: /order\/v1\/order\/cancelOrder/,
      urlType: "post",
      mockRes: {
        resultCode: 0,
        resultMessage: "OK"
      }
    });
    /**查询运费
     * GetFreightRequest   body
     * {
        "skuList": [
          {
            "skuId": "string",
            "num": 0
          }
        ],
        "provinceCode": "string",
        "cityCode": "string",
        "districtCode": "string",
        "townCode": "string"
      }
     */
    mockDataArray.push({
      urlRegExp: /order\/v1\/order\/getFreight/,
      urlType: "post",
      mockRes: {
        resultCode: 0,
        resultMessage: "success",
        result: {
          freight: "63",
          baseFreight: "10",
          remoteRegionFreight: "20",
          remoteSku: "12122"
        }
      }
    });
    /**获取订单号
     *
     */
    mockDataArray.push({
      urlRegExp: /order\/v1\/order\/getOrderNo/,
      urlType: "get",
      mockRes: {
        resultCode: 0,
        resultMessage: "success",
        result: {
          orderNo: "T5545454444444444"
        }
      }
    });
    /**查询预计配送时间
     * GetPromiseTipsRequest   body
     * {
        "skuList": [
            {
              "skuId": "string",
              "num": 0
            }
          ],
          "provinceCode": "string",
          "cityCode": "string",
          "districtCode": "string",
          "townCode": "string"
        }
     */
    mockDataArray.push({
      urlRegExp: /order\/v1\/order\/getPromiseTips/,
      urlType: "post",
      mockRes: {
        resultCode: 0,
        resultMessage: "success",
        result: {
          promiseTips: [
            {
              sku: "1222",
              promiseTip: "23:10前下单，预计<b>明天(07月26日)</b>送达"
            }
          ]
        }
      }
    });
    /**查询订单物流信息
     * GetOrderExpressRouteInfosRequest   body
     * {
          "orderNo": "string"
        }
     */
    mockDataArray.push({
      urlRegExp: /order\/v1\/getDeliveryInfo/,
      urlType: "post",
      mockRes: HttpPostProcessors.getProcess4Cache(
        "/getDeliveryInfo"
      )({
        resultCode: 0,
        resultMessage: "success",
        result: {
          carrierNo: "1546565562",
          carrier: "京东物流",
          waybillNo: "文343434",
          expectedDeliveryTime: "1584367714",
          expectedDeliveryTimeRange: "9:00-15:00",
          expectedReservedDeliveryTime: "1584367714",
          expectedReservedDeliveryTimeRange: "9:00-15:00",
          freight: "34",
          weight: "23",
          routeInfos: [
            {
              state: "1",
              remarkAndTime: [
                {
                  remark: "货物已完成配送，感谢您选择京东物流",
                  time: "1584367714",
                  phone: "139784579562",
                  name: "快递员小宋"
                }
              ]
            }
          ]
        }
      })
    });
    /**查询订单发票信息
     * GetOrderInvoiceRequest    body
     * {
          "orderNo": "string"
        }
     */
    mockDataArray.push({
      urlRegExp: /order\/v1\/getInvoiceInfo/,
      urlType: "post",
      mockRes: HttpPostProcessors.getProcess4Cache("/order/v1/getInvoiceInfo")({
        resultCode: 0,
        resultMessage: "success",
        result: {
          orderInvoice: {
            invoiceType: 2,
            invoiceCategory: 3,
            invoiceTitle: "深圳兆日科技股份有限公司",
            invoiceContent: "商品明细",
            invoiceUrl: [
              "/jfs/t14749/245/506469347/72873/617a5312/5a2f9356N3e0bc4e6.jpg"
            ],
            invoiceState: 0,
            taxNo: "334444",
            registerAddress: "湖北省武汉市东湖高新区",
            registerPhone: "134565247889",
            account: "15455222412222",
            bank: "招商银行武汉分行",
            address: "湖北省武汉市东湖高新区",
            phone: "13545878956",
            email: "122133@qq.com",
            invoiceProcess: "订单下单，订单完成，发票开具"
          }
        }
      })
    });
    /**查询商品大小件标记
     * GetSkuClassifyRequest    body
     * {
          "skuList": [
            {
              "skuId": "string",
              "num": 0
            }
          ],
          "provinceCode": "string",
          "cityCode": "string",
          "districtCode": "string",
          "townCode": "string"
        }
     */
    mockDataArray.push({
      urlRegExp: /order\/v1\/order\/getSkuClassify/,
      urlType: "post",
      mockRes: {
        resultCode: 0,
        resultMessage: "success",
        result: {
          skuClassifyMaps: [
            {
              sku: "100780", // 1000116表示sku;2表示类型（2具体指大家电）"
              skuClassify: 1 // 100780表示sku;1表示类型（1具体指中小件）"1000116"':"2
            }
          ]
        }
      }
    });

    /**
     * 查询收货人信息
     * {
          "orderNo": "string"
        }
     */
    mockDataArray.push({
      urlRegExp: /order\/v1\/order\/getReceiverInfo/,
      urlType: "post",
      mockRes: {
        resultCode: 0,
        resultMessage: "success",
        result: {
          receiverInfo: {
            province: "江西",
            provinceCode: "122",
            city: "九江市",
            cityCode: "222",
            district: "江西九江市",
            districtCode: "333",
            townCode: "六一接到",
            town: "233",
            address: "江西九江市",
            name: "刘德华",
            phone: "15666666666"
          }
        }
      }
    });
  }
  /********************************************下面是发票****************/
  //发票模块添加控制开关
  if (!!mainSwitchs.invoiceSwitch) {
    /**换开发票
     * CreateInvoiceRequest   body
      {
        "userId": 0,   用户编号
        "companyId": 0,   公司编号
        "channelId": 0,    渠道编号
        "orderNo": "string",   订单编号
        "invoiceType": 0,    发票类型:0=电子增值税普通发票,1=增值税普通发票(纸票)
        "phone": "string",    联系电话
        "email": "string",    电子邮箱
        "content": "string",   发票内容
        "title": {
          "type": 0,   抬头类型：0=个人，1=企业
          "name": "string",   抬头名称
          "tax": "string",    税号
          "address": "string",    公司地址
          "phone": "string",    公司电话
          "account": "string",     公司账号
          "bank": "string"     开户行
      }
    */
    mockDataArray.push({
      urlRegExp: /finance\/v1\/invoice\/reAdd/,
      urlType: "post",
      mockRes: {
        resultCode: 0,
        resultMessage: "success",
        result: {}
      }
    });
  }
  /********************************************下面是地址服务****************/
  //地址服务添加控制开关
  if (!!mainSwitchs.addressSwitch) {
    /**收货地址相关接口-添加收货地址
      userId	string($varchar)
      用户id
      companyId	string($varchar)
      公司id
      channelId	string($varchar)
      渠道id
      area	string($varchar)
      收货地址省市区
      address	string($varchar)
      详细地址
      phone	string($varchar)
      收货人电话
      name	string($varchar)
      收货人姓名
      tags	string($varchar)
      地址标签
      default	boolean
      default: false
      是否默认
      addressCode	string($varchar)
      省市区镇地址代码：1|2|3|4
    */
    mockDataArray.push({
      urlRegExp: /customer-profile\/v1\/addAddress/,
      urlType: "post",
      mockRes: {
        resultCode: 0,
        resultMessage: "添加成功",
        result: true
      }
    });
    /**收货地址相关接口-查询所有收货地址
     * userId integer (query)用户编号，
     * companyId integer(query)公司编号
     * channelId integer(query)渠道编号，
     */
    mockDataArray.push({
      urlRegExp: /customer-profile\/v1\/listAddress/,
      urlType: "post",
      mockRes: HttpPostProcessors.getProcess4Cache("/listAddress")({
        resultCode: 0,
        resultMessage: "string",
        result: {
          list: [
            {
              id: 1,
              userId: 45661222,
              companyId: 20201244,
              channelId: 1024,
              area: "湖北省武汉市东湖高新区",
              address: "光谷智慧园10栋",
              phone: "13784895522",
              name: "刘德华",
              tags: "公司",
              default: true,
              addressCode: "420000|420100|420111|421103"
            },
            {
              id: 2,
              userId: 45661222,
              companyId: 20201244,
              channelId: 1024,
              area: "湖北省武汉市东湖高新区",
              address: "光谷大道保利时代",
              phone: "13784895522",
              name: "刘德华",
              tags: "家",
              default: false,
              addressCode: "420000|420100|420111|421103"
            },
            {
              id: 3,
              userId: 45661222,
              companyId: 20201244,
              channelId: 1024,
              area: "陕西省西安市高新区",
              address: "大唐足浴",
              phone: "13784895522",
              name: "高原",
              tags: "公司",
              default: false,
              addressCode: "420000|420100|420111|421103"
            }
          ]
        }
      })
    });

    /**收货地址相关接口-编辑收货地址
     *id	string($varchar)
      userId	string($varchar)
      用户id
      companyId	string($varchar)
      公司id
      channelId	string($varchar)
      渠道id
      area	string($varchar)
      收货地址省市区
      address	string($varchar)
      详细地址
      phone	string($varchar)
      收货人电话
      name	string($varchar)
      收货人姓名
      tags	string($varchar)
      地址标签
      default	boolean
      default: false
      是否默认
      addressCode	string($varchar)
      省市区镇地址代码：1|2|3|4
    */
    mockDataArray.push({
      urlRegExp: /customer-profile\/v1\/updateAddress/,
      urlType: "post",
      mockRes: {
        resultCode: 0,
        resultMessage: "操作成功",
        result: true
      }
    });
    /**收货地址相关接口-删除收货地址
     * 入参是query类型，跟在URL上的。
     * ids string (query)	要删除的地址编号数组，
     */
    mockDataArray.push({
      urlRegExp: /customer-profile\/v1\/deleteAddress/,
      urlType: "post",
      mockRes: {
        resultCode: 0,
        resultMessage: "操作成功",
        result: true
      }
    });
    //收货地址相关接口-查询省份
    mockDataArray.push({
      urlRegExp: /supplier\/v1\/getProvince/,
      urlType: "get",
      mockRes: {
        result: {
          list: [
            {
              id: "1",
              name: "北京"
            },
            {
              id: "31",
              name: "新疆"
            },
            {
              id: "4",
              name: "重庆"
            },
            {
              id: "19",
              name: "广东"
            },
            {
              id: "3",
              name: "天津"
            },
            {
              id: "15",
              name: "浙江"
            },
            {
              id: "52993",
              name: "港澳"
            },
            {
              id: "20",
              name: "广西"
            },
            {
              id: "11",
              name: "内蒙古"
            },
            {
              id: "30",
              name: "宁夏"
            },
            {
              id: "21",
              name: "江西"
            },
            {
              id: "32",
              name: "台湾"
            },
            {
              id: "14",
              name: "安徽"
            },
            {
              id: "24",
              name: "贵州"
            },
            {
              id: "27",
              name: "陕西"
            },
            {
              id: "8",
              name: "辽宁"
            },
            {
              id: "6",
              name: "山西"
            },
            {
              id: "29",
              name: "青海"
            },
            {
              id: "22",
              name: "四川"
            },
            {
              id: "12",
              name: "江苏"
            },
            {
              id: "5",
              name: "河北"
            },
            {
              id: "26",
              name: "西藏"
            },
            {
              id: "84",
              name: "钓鱼岛"
            },
            {
              id: "16",
              name: "福建"
            },
            {
              id: "9",
              name: "吉林"
            },
            {
              id: "2",
              name: "上海"
            },
            {
              id: "17",
              name: "湖北"
            },
            {
              id: "23",
              name: "海南"
            },
            {
              id: "25",
              name: "云南"
            },
            {
              id: "28",
              name: "甘肃"
            },
            {
              id: "18",
              name: "湖南"
            },
            {
              id: "13",
              name: "山东"
            },
            {
              id: "7",
              name: "河南"
            },
            {
              id: "10",
              name: "黑龙江"
            }
          ]
        },
        resultMessage: "success",
        resultCode: 0
      }
    });

    /**收货地址相关接口-查询城市
     * 入参是query类型，跟在URL上的。
     * id  string (query)	省份id，
     */
    mockDataArray.push({
      urlRegExp: /supplier\/v1\/getCity/,
      urlType: "get",
      mockRes: {
        result: {
          list: [
            {
              id: "131",
              name: "奉节县"
            },
            {
              id: "48207",
              name: "永川区"
            },
            {
              id: "48132",
              name: "荣昌区"
            },
            {
              id: "48131",
              name: "璧山区"
            },
            {
              id: "134",
              name: "忠县"
            },
            {
              id: "137",
              name: "石柱县"
            },
            {
              id: "113",
              name: "万州区"
            },
            {
              id: "128",
              name: "黔江区"
            },
            {
              id: "48133",
              name: "铜梁区"
            },
            {
              id: "129",
              name: "武隆区"
            },
            {
              id: "50953",
              name: "沙坪坝区"
            },
            {
              id: "123",
              name: "潼南区"
            },
            {
              id: "48206",
              name: "长寿区"
            },
            {
              id: "51027",
              name: "高新区"
            },
            {
              id: "4164",
              name: "城口县"
            },
            {
              id: "48204",
              name: "江津区"
            },
            {
              id: "119",
              name: "南川区"
            },
            {
              id: "50951",
              name: "南岸区"
            },
            {
              id: "48202",
              name: "巴南区"
            },
            {
              id: "133",
              name: "云阳县"
            },
            {
              id: "50954",
              name: "大渡口区"
            },
            {
              id: "50950",
              name: "江北区"
            },
            {
              id: "51026",
              name: "渝中区"
            },
            {
              id: "50952",
              name: "九龙坡区"
            },
            {
              id: "50995",
              name: "綦江区"
            },
            {
              id: "138",
              name: "彭水县"
            },
            {
              id: "130",
              name: "丰都县"
            },
            {
              id: "114",
              name: "涪陵区"
            },
            {
              id: "126",
              name: "大足区"
            },
            {
              id: "136",
              name: "巫山县"
            },
            {
              id: "132",
              name: "开州区"
            },
            {
              id: "139",
              name: "垫江县"
            },
            {
              id: "48205",
              name: "渝北区"
            },
            {
              id: "141",
              name: "秀山县"
            },
            {
              id: "135",
              name: "巫溪县"
            },
            {
              id: "48201",
              name: "合川区"
            },
            {
              id: "48203",
              name: "北碚区"
            },
            {
              id: "140",
              name: "酉阳县"
            },
            {
              id: "51028",
              name: "北部新区"
            },
            {
              id: "115",
              name: "梁平区"
            }
          ]
        },
        resultMessage: "success",
        resultCode: 0
      }
    });

    /**收货地址相关接口-查询区县
     * 入参是query类型，跟在URL上的。
     * id  string (query)	城市id，
     */
    mockDataArray.push({
      urlRegExp: /supplier\/v1\/getCounty/,
      urlType: "get",
      mockRes: {
        result: {
          list: [
            {
              id: "58518",
              name: "昌元街道"
            },
            {
              id: "48174",
              name: "河包镇"
            },
            {
              id: "48184",
              name: "龙集镇"
            },
            {
              id: "48167",
              name: "安富街道"
            },
            {
              id: "48183",
              name: "荣隆镇"
            },
            {
              id: "48163",
              name: "县城内"
            },
            {
              id: "48181",
              name: "远觉镇"
            },
            {
              id: "48173",
              name: "仁义镇"
            },
            {
              id: "48179",
              name: "清流镇"
            },
            {
              id: "48170",
              name: "直升镇"
            },
            {
              id: "48171",
              name: "路孔镇"
            },
            {
              id: "48172",
              name: "清江镇"
            },
            {
              id: "48176",
              name: "吴家镇"
            },
            {
              id: "48175",
              name: "古昌镇"
            },
            {
              id: "48169",
              name: "双河街道"
            },
            {
              id: "58519",
              name: "昌州街道"
            },
            {
              id: "48182",
              name: "清升镇"
            },
            {
              id: "48180",
              name: "盘龙镇"
            },
            {
              id: "48177",
              name: "观胜镇"
            },
            {
              id: "48166",
              name: "广顺街道"
            },
            {
              id: "48178",
              name: "铜鼓镇"
            },
            {
              id: "48168",
              name: "峰高街道"
            }
          ]
        },
        resultMessage: "success",
        resultCode: 0
      }
    });

    /**收货地址相关接口-查询镇/街道
     * 入参是query类型，跟在URL上的。
     * id  string (query)	区县id，
     */
    mockDataArray.push({
      urlRegExp: /supplier\/v1\/getTown/,
      urlType: "get",
      mockRes: {
        resultCode: 0,
        resultMessage: "string",
        result: {
          list: [
            {
              id: "421102",
              name: "珞南街道"
            },
            {
              id: "421103",
              name: "关山街道"
            },
            {
              id: "421104",
              name: "狮子山街道"
            },
            {
              id: "421105",
              name: "张家湾街道"
            },
            {
              id: "421106",
              name: "梨园街道"
            },
            {
              id: "421107",
              name: "卓刀泉街道"
            },
            {
              id: "421111",
              name: "洪山街道"
            },
            {
              id: "421112",
              name: "和平街道"
            },
            {
              id: "421113",
              name: "青菱街道"
            },
            {
              id: "421114",
              name: "天兴乡"
            }
          ]
        }
      }
    });
  }
  /********************************************下面是商品收藏夹****************/
  //商品收藏添加控制开关
  if (!!mainSwitchs.favoritesSwitch) {
    /**商品收藏夹-添加到收藏夹
     * 入参对象
     * {
        "userId": 0,
        "companyId": 0,
        "channelId": 0,
        "skus": [
          {
            "sku": "string",
            "supplierId": 0
          }
        ]
      }
    */
    mockDataArray.push({
      urlRegExp: /follow\/v1\/addItem/,
      urlType: "post",
      mockRes: {
        resultCode: 0,
        resultMessage: "添加收藏成功",
        result: true
      }
    });

    /**商品收藏夹-单个获取收藏数据
     * 入参 body。
     * {
     *    "sku": string 用户编号，
     *    "supplierId": 0
     *    "userId":integer 用户编号，
     *    "companyId":integer 公司编号
     *    "channelId":integer 渠道编号，
     * }
     */
    mockDataArray.push({
      urlRegExp: /follow\/v1\/getItemDetail/,
      urlType: "post",
      mockRes: HttpPostProcessors.getProcess4Cache("/follow/v1/getItemDetail")({
        resultCode: 0,
        resultMessage: "ok",
        result: {
          id: 15,
          userId: 45661222,
          companyId: 20201244,
          channelId: 1024,
          sku: 45884455,
          supplierId: 1,
          name:
            "海信（Hisense） HZ55E3D-J 55英寸 全面屏 AI语音 4K HDR 人工智能电视",
          price: 1599,
          picture:
            "/jfs/t14749/245/506469347/72873/617a5312/5a2f9356N3e0bc4e6.jpg",
          status: 1
        }
      })
    });

    /**商品收藏夹-查询所有收藏商品
     * 入参 body
     * {
     *    "userId":integer 用户编号，
     *    "companyId":integer 公司编号
     *    "channelId":integer渠道编号，
     *    "pageIndex":integer 页码，
     *    "pageSize":integer 每页容量
     * }
     */
    mockDataArray.push({
      urlRegExp: /follow\/v1\/listItem/,
      urlType: "post",
      mockRes: HttpPostProcessors.getProcess4Cache("/follow/v1/listItem")({
        resultCode: 0,
        resultMessage: "success",
        result: {
          pageIndex: 1,
          pageSize: 20,
          totalPages: 1,
          content: [
            {
              id: 15,
              userId: 45661222,
              companyId: 20201244,
              channelId: 1024,
              sku: 45884455,
              supplierId: 1,
              name:
                "海信（Hisense） HZ55E3D-J 55英寸 全面屏 AI语音 4K HDR 人工智能电视",
              price: 1599,
              picture:
                "/jfs/t14749/245/506469347/72873/617a5312/5a2f9356N3e0bc4e6.jpg",
              status: 1
            },
            {
              id: 16,
              userId: 45661222,
              companyId: 20201244,
              channelId: 1024,
              sku: 45884456,
              supplierId: 1,
              name:
                "海信（Hisense） HZ55E3D-J 55英寸 全面屏 AI语音 4K HDR 人工智能电视",
              price: 1799,
              picture:
                "/jfs/t14749/245/506469347/72873/617a5312/5a2f9356N3e0bc4e6.jpg",
              status: 1
            },
            {
              id: 17,
              userId: 45661222,
              companyId: 20201244,
              channelId: 1024,
              sku: 45884457,
              supplierId: 1,
              name: "三星 SAMSUNG Fold 夜雾银 12GB折叠屏【尊享版】",
              price: 15999,
              picture:
                "https://img11.360buyimg.com/n5/s54x54_jfs/t1/58896/29/14739/273318/5dbbee5bE4f8f5944/788946c6bfa850f9.jpg",
              status: 1
            },
            {
              id: 18,
              userId: 45661222,
              companyId: 20201244,
              channelId: 1024,
              sku: 45884458,
              supplierId: 1,
              name:
                "海信（Hisense） HZ55E3D-J 55英寸 全面屏 AI语音 4K HDR 人工智能电视",
              price: 1599,
              picture:
                "/jfs/t14749/245/506469347/72873/617a5312/5a2f9356N3e0bc4e6.jpg",
              status: 1
            },
            {
              id: 19,
              userId: 45661222,
              companyId: 20201244,
              channelId: 1024,
              sku: 45884459,
              supplierId: 1,
              name: "三星 SAMSUNG Fold 夜雾银 12GB折叠屏【尊享版】",
              price: 15999,
              picture:
                "https://img11.360buyimg.com/n5/s54x54_jfs/t1/58896/29/14739/273318/5dbbee5bE4f8f5944/788946c6bfa850f9.jpg",
              status: 1
            },
            {
              id: 20,
              userId: 45661222,
              companyId: 20201244,
              channelId: 1024,
              sku: 458844578,
              supplierId: 1,
              name:
                "海信（Hisense） HZ55E3D-J 55英寸 全面屏 AI语音 4K HDR 人工智能电视",
              price: 1599,
              picture:
                "/jfs/t14749/245/506469347/72873/617a5312/5a2f9356N3e0bc4e6.jpg",
              status: 1
            }
          ]
        }
      })
    });

    /**商品收藏夹-批量删除收藏
     * 入参 body。
     * {
        "skus": [
            {
              "sku": "string",
              "supplierId": 0
            }
          ] 要删除的商品编号集合，
     *    "userId":integer 用户编号，
     *    "companyId":integer 公司编号
     *    "channelId":integer 渠道编号，
     * }
     */
    mockDataArray.push({
      urlRegExp: /follow\/v1\/deleteItem/,
      urlType: "post",
      mockRes: {
        resultCode: 0,
        resultMessage: "删除收藏成功",
        result: true
      }
    });
  }
  /********************************************下面是购物车模块****************/
  //购物车模块添加控制开关
  if (!!mainSwitchs.cartSwitch) {
    /**
     * 购物车新增商品
     * 入参 body
     *  {
          "channelId": 0,  渠道Id
          "companyId": 0,  企业Id
          "userId": 0,     用户Id
          "goods":[
            {
              "sku":"string"     商品编号
              "SupplierId":"string"    供应商ID
              "quantity":0     购买数量
              "name": "string",  商品名称
              "specification": "string",  商品规格
              "imageUrl": "string"  商品图片URL
            }
          ]
       }
     */
    mockDataArray.push({
      urlRegExp: /cart\/v1\/cartGoods\/add/,
      urlType: "post",
      mockRes: {
        resultCode: 0,
        resultMessage: "新增商品成功"
      }
    });

    /**
     * 购物车删除商品
     * 入参 body
     *  {
          "channelId": 0,  渠道ID
          "companyId": 0,  企业ID
          "userId": 0,     用户ID
          "delAll": true,  是否全部删除(true:全部删除 false:部分删除)
          "goods": [
            {
              "sku": "string",  商品编号
              "supplierId": "string"  供应商id
            }
          ]
        }
     */
    mockDataArray.push({
      urlRegExp: /cart\/v1\/cartGoods\/delete/,
      urlType: "post",
      mockRes: {
        resultCode: 0,
        resultMessage: "删除商品成功"
      }
    });

    /**
     * 购物车设置商品数量
     * 入参 body
     * {
          "channelId": 0,   渠道ID
          "companyId": 0,   企业ID
          "userId": 0,      用户ID
          "sku": "string",  商品编号
          "supplierId": "string",  供应商ID
          "quantity": 0   商品数量
        }
     */
    mockDataArray.push({
      urlRegExp: /cart\/v1\/cartGoods\/setQuantity/,
      urlType: "post",
      mockRes: {
        resultCode: 0,
        resultMessage: "设置商品数量成功"
      }
    });

    /**
     * 查询购物车中商品
     * 入参
     * channelId   integer (query)  渠道ID
     * companyId   integer (query)  企业ID
     * userId      integer (query)  用户ID
     */
    mockDataArray.push({
      urlRegExp: /cart\/v1\/list/,
      urlType: "get",
      mockRes: HttpPostProcessors.getProcess4Cache("/cart/v1/list")({
        resultCode: 0,
        resultMessage: "true",
        result: {
          list: [
            {
              sku: "100005171461",
              quantity: 10,
              supplierId: 100,
              addTime: "2020-03-18 15:36:30",
              updateTime: "2020-03-18 15:36:30",
              name: "戴尔笔记本",
              specification: "颜色：小新 14 双通道 R5 8G 1T+256G",
              imageUrl:
                "jfs/t1/96017/27/13397/237609/5e573236E7450e13c/b5c2588c3143d677.png"
            }
          ]
        }
      })
    });
  }
  /********************************************下面是用户授权模块****************/
  //用户授权模块添加控制开关
  if (!!mainSwitchs.channelSwitch) {
    /**
     * 查询渠道授权协议列表
     * 入参
     * channelId integer (query) 渠道ID
      }
     */
    mockDataArray.push({
      urlRegExp: /channel\/v1\/getAppProtocols/,
      urlType: "get",
      mockRes: HttpPostProcessors.getProcess4Cache("/getAppProtocols")({
        resultCode: 0,
        resultMessage: "ok",
        result: {
          channelProtocolForApps: [
            {
              protocolId: "12222",
              protocolName: "用户授权协议书",
              protocolFileUrl:
                "https://bpdev.sinosun.com:18195/static/swplib/bp/pdfView/web/demo.pdf",
              // channelName: "厦门银行",
              protocolFilePreviewUrl:
                "/bp/pdfView/web/demo.pdf"
              // protocolRichText: "<h2>用户授权书</h2>"
            },
            {
              protocolId: "12222",
              protocolName: "用户使用协议书",
              protocolFileUrl:
                "https://bpdev.sinosun.com:18195/static/swplib/bp/pdfView/web/Java8.pdf",
              // channelName: "厦门银行",
              protocolFilePreviewUrl:
                "https://bpdev.sinosun.com:18195/static/swplib/bp/pdfView/web/demo2.pdf"
              // protocolRichText: "<h2>用户授权书</h2>"
            },
            {
              protocolId: "12222",
              protocolName: "用户使用手册",
              protocolFileUrl:
                "https://bpdev.sinosun.com:18195/static/swplib/bp/pdfView/web/JavaSE8.pdf",
              // channelName: "厦门银行",
              protocolFilePreviewUrl:
                "https://bpdev.sinosun.com:18195/static/swplib/bp/pdfView/web/viewer.html?t=1584971239007?file=OpenAPI.pdf"
              // protocolRichText: "<h2>用户授权书</h2>"
            }
          ]
        }
      })

    });
    /**
     * 用户是否同意协议
     * 入参
     * param body 
        {
            "logUserConsents": [
                {
                    "userId": 0,
                    "companyId": 0,
                    "channelId": 0,
                    "protocolId": 0,
                    "approval": true
                }
            ]
        }
     */
    mockDataArray.push({
      urlRegExp: /channel\/v1\/logUserConsent/,
      urlType: "post",
      mockRes: {
        resultCode: 0,
        resultMessage: "ok"
      }
    });
    /**
     * 查询用户同意的协议列表; APP端使用
     * 入参
     * channelId query 渠道ID
     * userId  query 用户编号
     * companyId  query 用户所在企业ID
     * 
     */
    mockDataArray.push({
      urlRegExp: /channel\/v1\/getUserConsent/,
      urlType: "get",
      mockRes: {
        resultCode: 0,
        resultMessage: "string",
        result: {
          protocolIds: [
            0
          ]
        },
      }
    });
  }
  //售后模块的控制开关
  if (!!mainSwitchs.afterSaleSwitch) {
    var serviceCode = [10, 20, 30]//服务类型码：退货(10)、换货(20)、维修(30)
    //服务单环节：申请中(10)、客服审核中(20)、客服审核不通过(21)、供应商审核中(30)、供应商审核不通过(31)、供应商审核取消(32)
    //、供应商处理中(40)、客服处理中(50)、用户确认中(60)、完成(70)、取消(80)
    var serviceSteps = [10, 20, 21, 30, 31, 32, 40, 50, 60, 70, 80]
    //状态：已创建(1)、客服审核不通过(2)、客服审核通过(3)、供应商审核取消(4)、供应商审核不通过(5)、供应商审核通过(6)、供应商处理完成(7)、待用户确认(8)、完成(9)、取消(10)
    var states = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    //是否可取消： 0代表否，1代表是
    var cancelstates = [1, 0]
    mockDataArray.push({
      urlRegExp: /postsale\/v1\/listPersonalServiceRequest/,
      urlType: "get",
      mockRes: {
        "resultCode": 0,
        "resultMessage": "string",
        "result": {
          "total": 5,
          "pages": 1,
          "pageSize": 10,
          "pageNum": 0,
          "serviceInfoList": [
            {
              "serviceId": "dsdsdssds",
              "customerExpect": serviceCode[Random.integer(0, 2)],
              "applyTime": 1589187756,
              "orderId": "1jkjjjdjdjdjd",
              "wareId": "100005171461",
              "skuNum": Random.integer(1, 10),
              "allowOperations": [1,2],//获取服务单允许的操作列表：列表为空代表不允许操作；列表包含1代表取消
              "wareName": "戴尔笔记本",
              "skuImagePath": "https://img13.360buyimg.com/n0/jfs/t1/96017/27/13397/237609/5e573236E7450e13c/b5c2588c3143d677.png",
              "unitPrice": "1522.00",
              "serviceStep": serviceSteps[Random.integer(0, 10)],
              "state": states[Random.integer(0, 10)],
              "cancel": cancelstates[Random.integer(0, 1)]
            }
          ]
        }
      }
    });
    //查询某订单中某商品是否可以提交售后服务
    mockDataArray.push({
      urlRegExp: /postsale\/v1\/getServiceableItems/,
      urlType: "get",
      mockRes: {
        "resultCode": 0,
        "resultMessage": "string",
        "result": {
          "availableNum": 1
        }
      }

    });
    mockDataArray.push({
      urlRegExp: /postsale\/v1\/getServiceCategory/,
      urlType: "get",
      mockRes: {
        "resultCode": 0,
        "resultMessage": "string",
        "result": {
          "postsaleTypes": [
            {
              "code": "10",//服务类型码：退货(10)、换货(20)、维修(30)
              "name": "退货"//服务类型名称：退货、换货、维修
            },
            {
              "code": "20",//服务类型码：退货(10)、换货(20)、维修(30)
              "name": "换货"//服务类型名称：退货、换货、维修
            },
            {
              "code": "30",//服务类型码：退货(10)、换货(20)、维修(30)
              "name": "维修"//服务类型名称：退货、换货、维修
            }
          ]
        }
      }

    });
    //根据订单号、商品编号查询商品取件方式
    mockDataArray.push({
      urlRegExp: /postsale\/v1\/getProductRecallMethods/,
      urlType: "get",
      mockRes: {
        "resultCode": 0,
        "resultMessage": "string",
        "result": {
          "pickwareTypes": [
            {//取件响应码：上门取件(4)、客户发货(40)
              "code": "4",
              "name": "上门取件"//服务类型名称：上门取件、客户发货
            },
            {//取件响应码：上门取件(4)、客户发货(40)
              "code": "40",
              "name": "客户发货"//服务类型名称：上门取件、客户发货
            }
          ]
        }
      }

    });
    //查询申请原因类型,app用户必须填写售后类型查询，客户经理不填售后类型查询所有
    var applyReasons = ["质量问题", "发错货", "商品损坏", "商品降价", "商品与页面描述不符", "缺少件", "质保期外问题", "商品故障", "其他"]
    mockDataArray.push({
      urlRegExp: /postsale\/v1\/getSubmittingReason/,
      urlType: "get",
      mockRes: {//申请原因列表: 质量问题、发错货、商品损坏、商品降价、商品与页面描述不符、 缺少件、质保期外问题、商品故障、其他
        "resultCode": 0,
        "resultMessage": "string",
        "result": {
          "applyReasons": applyReasons
        }
      }

    });
    //取消已经生成的服务单
    mockDataArray.push({
      urlRegExp: /postsale\/v1\/cancelServiceRequest/,
      urlType: "post",
      mockRes: {
        "resultCode": 0,
        "resultMessage": "string"
      }

    });
    //收到退款或者收到换货的商品，核实无货后，可以调用确认服务单接口更新状态为完成
    mockDataArray.push({
      urlRegExp: /postsale\/v1\/closeServiceRequest/,
      urlType: "post",
      mockRes: {
        "resultCode": 0,
        "resultMessage": "string"
      }

    });
    //如果商品物流选择第三方配送时，使用此接口
    mockDataArray.push({
      urlRegExp: /postsale\/v1\/updateRecallDispatchInfo/,
      urlType: "post",
      mockRes: {
        "resultCode": 0,
        "resultMessage": "string"
      }

    });
    //查询服务单明细信息
    var needReports = [0, 1]//是不是需要检测报告：0不是 1是
    var packages = [0, 10, 20]//包装描述：0无包装 10包装完整 20包装破损
    var detailType = [10, 20, 30]//明细类型：主商品(10), 赠品(20), 附件(30)，拍拍取主商品就可以
    mockDataArray.push({
      urlRegExp: /postsale\/v1\/getServiceRequestDetail/,
      urlType: "post",
      mockRes: {
        "resultCode": 0,
        "resultMessage": "string",
        "result": {
          "serviceInfoDTO": {
            "serviceId": "12222222",
            "applyTime": 1589187756000,
            "orderId": "12222222",
            "supplierId": 1,
            "spOrderId": "jdwwwwww",
            "customerExpect": serviceCode[Random.integer(0, 2)],
            "applyReasonType": applyReasons[Random.integer(0, 8)],
            "questionDesc": "一点不好用",
            "questionPic": "jfs/t1/96017/27/13397/237609/5e573236E7450e13c/b5c2588c3143d677.png,jfs/t1/96017/27/13397/237609/5e573236E7450e13c/b5c2588c3143d677.png",
            "needDetectionReport": needReports[Random.integer(0, 1)],
            "hasPackage": needReports[Random.integer(0, 1)],//是不是有包装：0没有 1有
            "packageDesc": packages[Random.integer(0, 2)],
            "hasInvoice": needReports[Random.integer(0, 1)],//是不是有发票：0没有 1有
            "skuNum": Random.integer(0, 10),
            "serviceStep": serviceSteps[Random.integer(0, 10)],
            "state": states[Random.integer(0, 10)],
            "allowOperations": [1,2],//获取服务单允许的操作列表：列表为空代表不允许操作；列表包含1代表取消
            "paymentAmount": "1350"
          },
          "serviceCustomerInfoDTO": {
            "customerContactName": "李生达",
            "customerTel": "02788555555",
            "customerMobilePhone": "13945884552",
            "customerEmail": "13945884552@my.com",
            "customerPostcode": "420100"
          },
          //售后联系信息
          "servicepostSalesAddressInfoDTO": {
            "address": "上海京东大厦",
            "tel": "021598974555",
            "linkMan": "李京东",
            "postCode": "420000"
          },
          //客户发货信息
          // "serviceExpressInfoDTO": {
          //   "serviceId": "ssssde11e11e",
          //   "freightMoney": "9.00",//运费:单位为元，精确到小数点后两位
          //   "expressCompany": "百世快递",
          //   "deliverDate": "2020-04-11 15:25:15",//客户发货日期：格式为yyyy-MM-dd HH:mm:ss
          //   "expressCode": "15432422422434232432"
          // },
          //退款
          "serviceFinanceDetailInfoDTOs": [
            {
              "refundWay": 9,//退款方式 9-原路返回
              "status": 1,//状态 1-成功
              "statusName": "成功",
              "refundPrice": "95",
              "wareId": "2323232332rrrr",
              "wareName": "华为平板",
              "b2bPayType": 0,//B2B支付方式
              "b2bPayFlag": 0//个人/企业
            }
          ],
          "serviceTrackInfoDTOs": [
            {
              "serviceId": "12222222",
              "title": "商品京东已收货",
              "context": "你的服务单12273商品已收到",
              "createDate": "2020-04-11 15:25:15",
              "createName": "小李",
              "createPin": "lixiao"
            },
            {
              "serviceId": "12222222",
              "title": "提交申请",
              "context": "不想要了，有质量问题",
              "createDate": "2020-04-13 15:25:15",
              "createName": "小李",
              "createPin": "lixiao"
            }
          ],
          "serviceDetailInfoDTOs": [
            {
              "wareId": "2323232332rrrr",
              "wareName": "华为平板",
              "wareBrand": "华为",
              "detailType": detailType[Random.integer(0, 2)],
              "wareDescribe": "看我附件的描述",//附件描述
              "quantity": Random.integer(1, 3),
              "skuImagePath": "https://img13.360buyimg.com/n0/jfs/t1/96017/27/13397/237609/5e573236E7450e13c/b5c2588c3143d677.png",
              "purchasePrice": "1500",
              "unitPrice": "500",
              "freight": "30",//单个商品均摊运费
              "discount": "0"//单个商品均摊优惠
            }
          ],
          //取件信息
          "asPickwareDTO": {
            "pickwareType": 4,//取件方式：4上门取件 40 客户发货
            "pickwareProvince": "湖北省",//取件省，取件方式为4（上门取件）时，必填
            "pickwareCity": "武汉市",
            "pickwareCounty": "汉口区",
            "pickwareVillage": "上海路街道",
            "pickwareAddress": "上海路187号",
            "pickwareFullAddress": "湖北省武汉市汉口区上海路街道上海路187号"
          },
          //收件信息
          "asReturnwareDTO": {
            "returnwareType": 0,//收件方式:10自营配送 20第三方配送
            "returnwareProvince": "湖北省",
            "returnwareCity": "武汉市",
            "returnwareCounty": "江夏区",
            "returnwareVillage": "同心街道",
            "returnwareAddress": "光谷大道180号",
            "returnwareFullAddress": "湖北省武汉市江夏区光谷大道180号"
          }
        }
      }

    });
    //发起售后申请
    mockDataArray.push({
      urlRegExp: /postsale\/v1\/submitServiceRequest/,
      urlType: "post",
      mockRes: {
        "resultCode": 0,
        "resultMessage": "string"
      }

    });
    //统计服务单数量
    mockDataArray.push({
      urlRegExp: /postsale\/v1\/getMyServiceStatistics/,
      urlType: "get",
      mockRes: {
        "result": {
          "number": 10
        },
        "resultCode": 0,
        "resultMessage": "string"
      }

    });
  }
  return mockDataArray;
}
