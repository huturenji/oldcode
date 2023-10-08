import PostProcessors from "../../processors/PostProcessors";
import controllerBase from "../../../../core/server/router/controllerBase";
import DMTHttpClient from "../../../../core/server/http/DMTHttpClient"
/**
 * 商品模块的控制器，负责业务逻辑，输出具体的数据，
 * PostProcessors在这里调用,
 */
class controller4Product extends controllerBase {
  constructor() {
    super()
    this.initResource();
  }
  /**
   * 做一些准备工作
   */
  initResource() {
    this.serverPath = this.host["dev"] + this.server["product"]
    this.fs = require("fs"); //文件模块   
    this.path = require("path"); //系统路径模块
  }
  /**
   * 组装本模块的接口全量地址
   */
  getFullServerPath(path) {
    return this.serverPath + path
  }
  /**
   * 商品分类
   * @param {*} req 
   */
  getCategoryList(req) {
    const that = this;
    return new Promise((res, rej) => {
      //文件路径，__dirname为当前运行js文件的目录
      // console.log("__dirname=" + __dirname);
      let file = that.path.join(__dirname, "../../../../asset/text/category.txt");
      // console.log("file=" + file);
      //读取json文件
      that.fs.readFile(file, "utf-8", function (err, data) {
        let resData;
        if (err) {
          resData = "文件读取失败";
        } else {
          resData = PostProcessors.executeProcess(req.originalUrl, data);
        }
        res(resData);
      });
    });
  };
  /**
   * 商品列表
   * @param {*} req 
   */
  searchProduct(req) {
    const that = this;
    let returnData;
    let url = that.getFullServerPath("/product/searchProduct")
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
   * 商品详情
   * @param {*} req 
   */
  getDetail(req) {
    const that = this;
    let returnData;
    let url = that.getFullServerPath("/product/getDetail")
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
   * 商品详情摘要
   * @param {*} req 
   */
  getDetailSummary(req) {
    const that = this;
    let returnData;
    let url = that.getFullServerPath("/product/getDetailSummary")
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
export default new controller4Product()
