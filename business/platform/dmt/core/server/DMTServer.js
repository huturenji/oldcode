import routerEntry from "./router/routerEntry"
/**
 * express的服务端代码入口，执行服务端程序的初始化操作。
 * 初始化主要操作包括，1、express服务的创建和启动，2、各种业务组件的初始化和加载：详见 startDMTServerApp
 * 
 * 注意：因为目前的需求DMT是一个API数据中台，所以设计和实现上是一个对前台提供API的node Server。
 * 但是，需求可能会改变，很多典型的中台系统是一个对客户端输出HTML的node Server。也就是说 前台的UI也会
 * 归属到中台。这可能对设计和实现带来完全颠覆的改变。
 */
class DMTServer {
  constructor() {
    //执行初始化方法
    this.startDMTServerApp();
  }
  /**
   * 初始化主要操作包括，1、express服务的创建和启动，2、各种业务组件的初始化和加载：
   * 2.1、路由中间件的加载，2.2错误处理中间件的加载，2.3静态资源中间件的加载，
   */
  startDMTServerApp() {
    //express的服务创建与启动
    var express = require("express");
    var app = express();
    var bodyParser = require("body-parser");
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json()); //如果有body，JSON化，可以使用req.body取出来
    //公开服务器上的静态文件给调用者使用，/static是虚拟访问路径，./src/asset是真实的文件路径。
    const path = require("path");
    app.use("/static", express.static(path.join(__dirname, "../../asset")));
    //注册路由，可以通过模块化的加载,importing route
    new routerEntry(app);
    //错误处理:必须提供四个参数以将其标识为错误处理中间件函数
    app.use(function (err, req, res, next) {
      console.error(err.stack);
      res.status(500).send(req.originalUrl + " internal error!");
    });
    //增加一个处理未定义route的方法：一定要放到其他的router的最后面。
    app.use(function (req, res, next) {
      res.status(404).send({ url: req.originalUrl + " not found" });
    });
    //监听本地的端口
    var port = process.env.PORT || 3000;
    app.listen(port);

    console.log("DMT RESTful API server started on:" + port);
  }
}
//启动服务
new DMTServer();