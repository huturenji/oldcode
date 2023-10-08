import BaseProcessors from "../processors/BaseProcessors";
/**
 *server公共业务处理器
 */
class ServerProcessors extends BaseProcessors {
  constructor() {
    super();
    //给缓存赋值
    this.addAllPostProcessor();
  }

  /**
   * @httpResponse ,http请求的返回数据。后置处理需要填充这个参数
   * 给后置处理缓存 赋值，每新加一个 接口的处理，都需要在这里手动 修改代码。   *
   */
  addAllPostProcessor() {
    const that = this;

    //这是一个公共处理方法，用于接口数据返回前的统一处理，比如解密，格式化等
    this.addProcessor2Cache("/DMT/commonDataHandler", function (httpResponse) {
      console.log("postProcessor 4 /DMT/commonDataHandler");
      let response = httpResponse;

      return response;
    });

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

export default new ServerProcessors();
