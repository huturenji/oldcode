import BaseProcessors from "../../../core/processors/BaseProcessors";
/**
 *中台server的前置处理管理器，这里一般是接收到客户端请求后的一些公用的业务和逻辑，
 *比如解密数据，客户端请求数据的解析等
 */
class PreProcessors extends BaseProcessors {
  constructor() {
    super();
    this.addAllPreProcessor();
  }
  /**
   * 给前置处理缓存 赋值，每新加一个 接口的处理，都需要在这里手动 修改代码。
   * 前置处理有一个方法，入参是express的对象req。可以在这里做的业务一般都是前置的
   * 公共处理解密数据、数据的解析等
   */
  addAllPreProcessor() {
    /***这是1个demo，请不要删除,这个示例做了一个公共业务：打印req请求参数 start*/
    this.addProcessor2Cache("/DMT/printReq", function (req) {
      console.log("preProcessor 4 /DMT/printReq");
      let response = req;
      //获取URL、query，body、header等数据，body处理后赋值
      console.log("originalUrl=" + response.originalUrl);
      console.log("query=" + JSON.stringify(response.query));
      response.body2 = JSON.parse(JSON.stringify(response.body));
      response.body2.name = "liguanqun";
      console.log("body=" + JSON.stringify(response.body2));
      console.log("header.type=" + response.get("content-type"));

      return response;
    });
    /***这是1个demo，请不要删除 end*/
  }
}

export default new PreProcessors();
