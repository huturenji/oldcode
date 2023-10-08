import PostProcessors from "../../processors/PostProcessors";
import controllerBase from "../../../../core/server/router/controllerBase";
import DMTHttpClient from "../../../../core/server/http/DMTHttpClient"
/**
 * 个人中心模块的控制器，负责业务逻辑，输出具体的数据，
 * PostProcessors在这里调用,
 * 主要包括购物车、收藏夹、地址3个服务
 */
class controller4Personal extends controllerBase {
  constructor() {
    super()
    this.initResource();
  }
  /**
   * 做一些准备工作
   */
  initResource() {
    this.serverPath = {
      cart: this.host["dev"] + this.server["cart"],
      follow: this.host["dev"] + this.server["follow"],
      address: this.host["dev"] + this.server["address"],
    }
  }
  /**
   * 组装本模块的接口全量地址
   */
  getFullServerPath(type, path) {
    return this.serverPath[type] + path
  }
  /**
   * 购物车列表
   * @param {*} req 
   */
  cartGoodslist(req) {
    const that = this;
    let returnData;
    let url = that.getFullServerPath("cart", "/cartGoods/list")
    //post请求需要body和header
    let param = that.copyReqBodyAndHeader(req)

    return new Promise(res => {
      DMTHttpClient
        .httpRequest(url, "post", param)
        .then(result => {
          returnData = PostProcessors.executeProcess(req.originalUrl, result);
          res(returnData);
        })
        .catch(error => {
          console.error(error);
          returnData = error || "error";
          res(returnData);
        });
    });
  };
  /**
   * 收藏列表
   * @param {*} req 
   */
  followlist(req) {
    const that = this;
    let returnData;
    let url = that.getFullServerPath("follow", "/follow/list")
    //post请求需要body和header
    let param = that.copyReqBodyAndHeader(req)

    return new Promise(res => {
      DMTHttpClient
        .httpRequest(url, "post", param)
        .then(result => {
          returnData = PostProcessors.executeProcess(req.originalUrl, result);
          res(returnData);
        })
        .catch(error => {
          console.error(error);
          returnData = error || "error";
          res(returnData);
        });
    });
  };
  /**
   * 收藏列表
   * @param {*} req 
   */
  followget(req) {
    const that = this;
    let returnData;
    let url = that.getFullServerPath("follow", "/follow/get")
    //post请求需要body和header
    let param = that.copyReqBodyAndHeader(req)

    return new Promise(res => {
      DMTHttpClient
        .httpRequest(url, "post", param)
        .then(result => {
          returnData = PostProcessors.executeProcess(req.originalUrl, result);
          res(returnData);
        })
        .catch(error => {
          console.error(error);
          returnData = error || "error";
          res(returnData);
        });
    });
  };
  /**
   * 地址列表
   * @param {*} req 
   */
  addresslist(req) {
    const that = this;
    let returnData;
    let url = that.getFullServerPath("address", "/address/list")
    //post请求需要body和header
    let param = that.copyReqBodyAndHeader(req)

    return new Promise(res => {
      DMTHttpClient
        .httpRequest(url, "post", param)
        .then(result => {
          returnData = PostProcessors.executeProcess(req.originalUrl, result);
          res(returnData);
        })
        .catch(error => {
          console.error(error);
          returnData = error || "error";
          res(returnData);
        });
    });
  };
}
export default new controller4Personal()
