
import ServerProcessors from "../ServerProcessors";
import RouterUtil from "./routerUtil"
import mongodb from "../mongoDB/mgdb"
import router4Product from "../../../expansion/mall/server/router/router4Product"
import router4Cart from "../../../expansion/mall/server/router/router4Cart"
import router4Follow from "../../../expansion/mall/server/router/router4Follow"
import router4Address from "../../../expansion/mall/server/router/router4Address"
/**
 * 路由注册总入口对象，所有的业务接口的注册都放到这里
 */
class routerEntry {
  constructor(serverApp) {
    this.initEntry(serverApp);
  }
  /**
   * 初始化操作
   * @param {*} serverApp 入参，服务器对象
   */
  initEntry(serverApp) {
    this.initAttributes(serverApp)
    this.loadEntryMethod();
    this.loadBusinessModules();
    this.loadExitMethod();
  }
  /**
   * 属性初始化方法
   * @param {*} serverApp 
   */
  initAttributes(serverApp) {
    this.app = serverApp;
    this.router = require("express").Router();
  }
  /**
   * 全局的路由入口方法，这里可以加载 前置处理代码；这里的前置处理是对于
   * 接收到的所有的请求而言的，一般是解密、请求解析等操作。
   * 注意：这里的前置请求跟proxy代理模式的前置请求是不一样的。一个是client端的请求预处理，一个是server端的接收预处理。
   * 这个方法无论执行了什么操作，一定是要调用next方法，将控制权转移。
   */
  loadEntryMethod() {
    const that = this;
    this.app.all("*", function (req, res, next) {
      console.log("---->Access the entry method");
      RouterUtil.setCrosHeader(res);
      //数据库操作示范
      // that.operationDB();

      ServerProcessors.executeProcess("/DMT/printReq", req);
      ServerProcessors.executeProcess(req.originalUrl, req);

      next(); // pass control to the next handler
    });
  }
  /**
   * 全局的路由出口方法，这里可以加载 公共处理。
   * 比如 统一给返回值 加密，格式化检查等
   */
  loadExitMethod() {
    this.app.all("*", function (req, res, next) {
      console.log("<-----Access the exit method.");
      //我们自定义sourceData是待处理的数据
      if (res.sourceData) {
        let result = res.sourceData;
        result = ServerProcessors.executeProcess("/DMT/commonDataHandler", result);
        //数据处理完成，返回数据
        res.send(result);
      } else {
        //没有sourceData说明这个请求 没有被任何的 业务组件匹配到，继续执行
        next();
      }
    });
  }
  /**
   * 路由业务方法注册，所有的业务中间件 分模块在这里注册
   */
  loadBusinessModules() {
    //商品模块的业务中间件注册 "/product/:version";
    new router4Product(this.app, this.router, "/product/:version")
    //购物车模块的业务中间件注册 /cart/:version
    new router4Cart(this.app, this.router, "/cart/:version")
    //收藏夹模块的业务中间件注册 "/follow/:version"
    new router4Follow(this.app, this.router, "/follow/:version")
    //地址模块的业务中间件注册 /customer-profile/:version
    new router4Address(this.app, this.router, "/customer-profile/:version")
  }

  /**
   * 这个方法做了2个代码范例：
   * 1、如何在express项目中处理代码异常。核心思路就是：express组件异常必须调用next方法，传递错误信息到错误组件
   * ，统一捕获并处理。这里是一个异步代码异常的处理规范。同步代码不用关心，express会自动捕获。
   * 参考文档https://www.expressjs.com.cn/guide/error-handling.html
   * 2、如何在express项目中调用数据库模块。哪个express的组件需要数据库，直接引用即可，注意处理好错误捕获。
   * 我们可以在express中间件的总入口调用一下数据库初始化操作，就像目前的情况。
   * @param {*} next 
   */
  operationDB(next) {
    //数据库查询操作。异步操作的异常捕获，使用promise包裹异步操作。
    Promise.resolve().then(function () {
      mongodb.findData("user", null, function () {
        console.log("docs=" + docs)
      })
    }).catch(next) // Errors will be passed to Express.     
  }
}
export default routerEntry;
