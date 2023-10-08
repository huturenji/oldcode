import BaseProcessors from "../../../core/processors/BaseProcessors";
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
    this.addProcessor2Cache("/operationservice.getTrainOrderDetail", function (
      httpResponse
    ) {
      let response = JSON.parse(JSON.stringify(httpResponse));
      // debugger
      if (
        response.data &&
        response.data.OrderPsgs &&
        response.data.OrderPsgs.length > 0
      ) {
        for (let i = 0; i < response.data.OrderPsgs.length; i++) {
          response.data.OrderPsgs[i].PsgName +=
            "，刘德华";
        }
      }
      console.log("postProcessor 4 /operationservice.getTrainOrderDetail");
      return response;
    });
    /***这是2个demo，请不要删除 end*/
  }
}

export default new HttpPostProcessors();
