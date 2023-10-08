import DMTProperties from "../../common/Properties";
import BaseProcessors from "../../processors/BaseProcessors";
/**
 *HTTP后置处理管理器
 */
class HttpPostProcessors extends BaseProcessors {
  constructor() {
    super();
    //给缓存赋值
    this.addHttpPostProcessorMap();
  }

  /**
   * @httpResponse ,http请求的返回数据。后置处理需要填充这个参数
   * 给后置处理缓存 赋值，每新加一个 接口的处理，都需要在这里手动 修改代码。   *
   */
  addHttpPostProcessorMap() {
    const that = this;
    /***这是2个demo，请不要删除 start*/
    //这是一个虚拟接口的Demo，返回自定义数据
    this.addProcessor2Cache("/DMT/getBpProductCategoriesTest", function (
      httpResponse
    ) {
      let response = {
        base64: 0,
        code: 0,
        data: {
          TotalPageCount: 0,
          BpProductCategories: [
            {
              BpProductCategoryId: 670,
              BpProductCategoryOrder: -2147483648,
              BpProductCategoryName: "电脑、办公李冠群",
              BpProductCategoryType: 0,
              BpProductParentCategoryId: 0
            },
            {
              BpProductCategoryId: 652,
              BpProductCategoryOrder: 2147483647,
              BpProductCategoryName: "数码李冠群",
              BpProductCategoryType: 0,
              BpProductParentCategoryId: 0
            }
          ],
          TotalRecord: 0
        },
        zip: 0
      };
      console.log("postProcessor 4 /DMT/getBpProductCategoriesTest");
      return response;
    });
    //这是一个真实接口demo，返回后置处理数据。
    this.addProcessor2Cache("/order/getBpProductCategories", function (
      httpResponse
    ) {
      let response = JSON.parse(JSON.stringify(httpResponse));
      // debugger
      if (
        response.data &&
        response.data.BpProductCategories &&
        response.data.BpProductCategories.length > 0
      ) {
        for (let i = 0; i < 3; i++) {
          response.data.BpProductCategories[i].BpProductCategoryName +=
            "，刘德华";
        }
      }
      console.log("postProcessor 4 /order/getBpProductCategories");
      return response;
    });
    /***这是2个demo，请不要删除 end*/

    //订单列表接口 后置处理，订单的状态需要中台转换成可视化的数据。
    this.addProcessor2Cache("/order/v1/list", function (httpResponse) {
      let response = httpResponse;
      // debugger
      if (response.result && response.result.orders) {
        for (let i = 0; i < response.result.orders.length; i++) {
          //订单状态的装换
          response.result.orders[
            i
          ].orderStateText = DMTProperties.getOrderStateProp(
            response.result.orders[i].orderState
          );
          //处理商品的图片URL
          if (
            response.result.orders[i].products &&
            response.result.orders[i].products.length > 0
          ) {
            for (
              let j = 0;
              j < response.result.orders[i].products.length;
              j++
            ) {
              var item = response.result.orders[i].products[j];
              item.imageUrl = DMTProperties.getFullImgPath(item.imageUrl);
            }
          }
        }
      }
      return response;
    });
    //订单详情接口 后置处理，订单的状态需要中台转换成可视化的数据。
    this.addProcessor2Cache("/order/v1/getDetail", function (httpResponse) {
      let response = httpResponse;
      // debugger;
      if (response.result && response.result.order) {
        //订单状态的转换
        response.result.order.orderStateText = DMTProperties.getOrderStateProp(
          response.result.order.orderState
        );
        //支付方式的说明
        response.result.order.paymentTypeText = DMTProperties.getPaymentTypeProp(
          response.result.order.paymentType
        );
        //时间格式化
        response.result.order.createTime = DMTProperties.getapplyTimeProp(
          response.result.order.createTime
        );
        response.result.order.paymentTime = DMTProperties.getapplyTimeProp(
          response.result.order.paymentTime
        );
      }
      //物流信息处理
      if (response.result && response.result.orderExpress) {
        that.processExpressInfo(response.result.orderExpress);
      }
      //处理商品的图片URL
      if (response.result.products && response.result.products.length > 0) {
        for (let j = 0; j < response.result.products.length; j++) {
          var item = response.result.products[j];
          item.imageUrl = DMTProperties.getFullImgPath(item.imageUrl);
        }
      }
      //发票信息转换
      if (response.result && response.result.orderInvoice) {
        that.transformInvoice(response.result.orderInvoice);
      }
      return response;
    });
    //查询订单物流信息
    this.addProcessor2Cache("/getDeliveryInfo", function (
      httpResponse
    ) {
      let response = httpResponse;
      //物流信息处理
      if (response.result) {
        that.processExpressInfo(response.result);
      }
      return response;
    });
    //查询发票详情 后置处理，接口返回开票时间、发票类型、开票状态需要转换
    this.addProcessor2Cache("/order/v1/getInvoiceInfo", function (httpResponse) {
      let response = httpResponse;
      if (response.result && response.result.orderInvoice) {
        that.transformInvoice(response.result.orderInvoice);
      }
      return response;
    });
    //商品列表接口 后置处理。
    this.addProcessor2Cache("/product/v1/search", function (httpResponse) {
      let response = httpResponse;
      if (response.result && response.result.hitResult) {
        for (let i = 0; i < response.result.hitResult.length; i++) {
          //列表的图片地址转换
          response.result.hitResult[i].imageUrl = DMTProperties.getFullImgPath(
            response.result.hitResult[i].imageUrl,
            "n1"
          );
        }
      }
      return response;
    });
    //商品详情接口 后置处理。
    this.addProcessor2Cache("/product/v1/getDetail", function (httpResponse) {
      let response = httpResponse;
      if (response.result && response.result.detail) {
        for (let i = 0; i < response.result.detail.length; i++) {
          //图片地址转换
          response.result.detail[i].imagePath = DMTProperties.getFullImgPath(
            response.result.detail[i].imagePath,
            "n0"
          );
        }
      }
      return response;
    });
    //商品赠品接口 后置处理。
    this.addProcessor2Cache("/product/v1/listSkuGift", function (httpResponse) {
      let response = httpResponse;
      if (response.result && response.result.skuGiftAndAttachmentInfoList && response.result.skuGiftAndAttachmentInfoList.length > 0) {
        for (let i = 0; i < response.result.skuGiftAndAttachmentInfoList.length; i++) {
          let item = response.result.skuGiftAndAttachmentInfoList[i];
          if(!!item.giftList && item.giftList.length > 0){
            for(let j = 0; j < item.giftList.length; j++){
              if(!!item.giftList[j].imagePath){
                //赠品图片地址转换
                item.giftList[j].imagePath = DMTProperties.getFullImgPath(
                  item.giftList[j].imagePath,
                  "n0"
                );
              }              
            }
          }
          if(!!item.attachmentList && item.attachmentList.length > 0){
            for(let j = 0; j < item.attachmentList.length; j++){
              if(!!item.attachmentList[j].imagePath){
                //附件图片地址转换
                item.attachmentList[j].imagePath = DMTProperties.getFullImgPath(
                  item.attachmentList[j].imagePath,
                  "n0"
                );
              }

              
            }
          }
        }
      }
      return response;
    });
    //商品详情摘要接口 后置处理。
    this.addProcessor2Cache("/product/v1/getSummary", function (
      httpResponse
    ) {
      let response = httpResponse;
      if (response.result && response.result.detail) {
        for (let i = 0; i < response.result.detail.length; i++) {
          //图片地址转换
          response.result.detail[i].imagePath = DMTProperties.getFullImgPath(
            response.result.detail[i].imagePath,
            "n0"
          );
        }
      }
      return response;
    });
    //购物车列表接口 后置处理。
    this.addProcessor2Cache("/cart/v1/list", function (httpResponse) {
      let response = httpResponse;
      if (response.result && response.result.list) {
        for (let i = 0; i < response.result.list.length; i++) {
          //列表的图片地址转换
          response.result.list[i].imageUrl = DMTProperties.getFullImgPath(
            response.result.list[i].imageUrl
          );
        }
      }
      return response;
    });
    //收藏列表接口 后置处理。
    this.addProcessor2Cache("/follow/v1/listItem", function (httpResponse) {
      let response = httpResponse;
      if (response.result && response.result.content) {
        for (let i = 0; i < response.result.content.length; i++) {
          //列表的图片地址转换
          response.result.content[i].picture = DMTProperties.getFullImgPath(
            response.result.content[i].picture
          );
        }
      }
      return response;
    });
    //收藏列表接口 后置处理。
    this.addProcessor2Cache("/follow/v1/getItemDetail", function (httpResponse) {
      let response = httpResponse;
      if (response.result && response.result) {
        //列表的图片地址转换
        response.result.picture = DMTProperties.getFullImgPath(
          response.result.picture
        );
      }
      return response;
    });
    //地址列表接口 后置处理。
    this.addProcessor2Cache("/listAddress", function (httpResponse) {
      let response = httpResponse;
      // debugger;
      if (response.result && response.result.list) {
        for (let i = 0; i < response.result.list.length; i++) {
          //全量地址
          response.result.list[i].fullAddress =
            response.result.list[i].area + response.result.list[i].address;
          //全量地址,不带斜杠
          response.result.list[i].fullAddress2 = response.result.list[
            i
          ].fullAddress.replaceAll("/", "");
        }
      }
      return response;
    });
    //授权协议列表接口 后置处理。增加字段fsHost，前端调用者自己拼接
    this.addProcessor2Cache("/getAppProtocols", function (
      httpResponse
    ) {
      let response = httpResponse;
      // debugger;
      if (response.result && response.result.channelProtocolForApps) {
        for (
          let i = 0;
          i < response.result.channelProtocolForApps.length;
          i++
        ) {
          //pdf地址 https://bplusdev.sinosun.com:18180/mall/file/v1
          //"https://bpdev.sinosun.com:18195/static/swplib/bp/pdfView/web/demo.pdf";
          response.result.channelProtocolForApps[
            i
          ].fsHost = DMTProperties.getSinosunFsOrigin();
          response.result.channelProtocolForApps[
            i
          ].protocolFileUrlFull = DMTProperties.getFullfsPath(
            response.result.channelProtocolForApps[i].protocolFileUrl
          );
          response.result.channelProtocolForApps[
            i
          ].protocolFilePreviewUrlFull = DMTProperties.getFullfsPath(
            response.result.channelProtocolForApps[i].protocolFilePreviewUrl
          );
        }
      }
      return response;
    });
  }

  /**
   * 将发票对象一些数据进行处理
   * @param {*} invoice
   */
  transformInvoice(invoice) {
    if (!invoice) {
      return;
    }
    //开票类型转换
    invoice.invoiceTypeText = DMTProperties.getInvoiceTitleTypeProp(
      invoice.invoiceType
    );
    //开票类型转换
    invoice.invoiceCategoryText = DMTProperties.getInvoiceCategoryProp(
      invoice.invoiceCategory
    );
    //开票状态转换
    invoice.InvoiceStateText = DMTProperties.getInvoiceStateProp(
      invoice.invoiceState
    );
    //开票时间转换
    // invoice.applyTimeText = DMTProperties.getapplyTimeProp(
    //  invoice.applyTime
    // );
  }

  /**
   * 处理订单的物流信息
   * @param {*} expressInfo
   */
  processExpressInfo(expressInfo) {
    //物流信息处理
    if (expressInfo) {
      //时间格式化
      if (expressInfo.expectedDeliveryTime && expressInfo.expectedDeliveryTimeRange) {
        expressInfo.expectedDeliveryTime =
          DMTProperties.getapplyTimeProp(expressInfo.expectedDeliveryTime, 2) +
          expressInfo.expectedDeliveryTimeRange;
      }
      if (expressInfo.expectedReservedDeliveryTime && expressInfo.expectedReservedDeliveryTimeRange) {
        expressInfo.expectedReservedDeliveryTime =
          DMTProperties.getapplyTimeProp(
            expressInfo.expectedReservedDeliveryTime,
            2
          ) + expressInfo.expectedReservedDeliveryTimeRange;
      }
      //物流信息列表化
      let eRouters = expressInfo.routeInfos || expressInfo.expressRouteInfos;
      if (eRouters) {
        var list = [];
        for (let j = 0; j < eRouters.length; j++) {
          var routeInfo = eRouters[j];
          let routeState = DMTProperties.getExpressOrderState(routeInfo.state);
          for (let k = 0; k < routeInfo.remarkAndTime.length; k++) {
            var item = {
              remark: routeInfo.remarkAndTime[k].remark,
              time: DMTProperties.getapplyTimeProp(
                routeInfo.remarkAndTime[k].time
              )
            };
            if (k == 0) {
              item.state = routeState;
            }
            if (routeInfo.state == "1" || routeInfo.state == "2") {
              item.phone = routeInfo.remarkAndTime[k].phone;
              item.name = routeInfo.remarkAndTime[k].name;
            }
            list.push(item);
          }
        }
        expressInfo.expressRouteInfosUI = list;
      }
    }
  }
}

export default new HttpPostProcessors();
