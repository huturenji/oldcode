/**
 * 封装HTTP请求方法
 */
class DMTHttpClient {
  constructor() {
    this.request = require("request");
  }
  /**
   * 封装HTTP请求方法
   * @param {*} url 
   * @param {*} method 
   * @param {*} param { body: {}, header: {} }
   */
  httpRequest(
    url,
    method = "get",
    param = { body: {}, header: {} }
  ) {
    const that = this;
    var reqOptions = {
      url: url,
      method: method,
      // json: true,//设置为true，表示返回数据体 解析成json数据，且数据头必须有"content-type": "application/json;charset=UTF-8",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        authorization: 1,
        bplusAppkey: 123,
        channelId: 1,
        companyId: 1,
        userId: 1
      }
    };
    if (method == "post" && param && param.body) {
      reqOptions.body = JSON.stringify(param.body);
    }
    if (param && param.header) {
      reqOptions.headers = param.header;
    }
    return new Promise((res, rej) => {
      that.request(reqOptions, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          res(JSON.parse(body) || body);
        } else {
          console.error("error=" + error || JSON.stringify(response));
          rej(error || JSON.stringify(response));
        }
      });
    });
  };
}
export default new DMTHttpClient()
