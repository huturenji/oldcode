import Properties from "../../Properties";
import myController from "../controllers/controller4Personal"
import RouterUtil from "../../../../core/server/router/routerUtil"
import router4Module from "../../../../core/server/router/router4Module";
/**
 * follow模块的路由配置,
 * 注意：我们的处理结果不能直接调用res.send终结，需要赋值到res.sourceData,继续next
 */
class router4Follow extends router4Module {
  constructor(serverApp, serverRouter, rModulePath) {
    super(serverApp, serverRouter, rModulePath)
  }
  /**
   * 加载本模块的所有的API处理组件
   */
  loadAPIMethods() {
    // 放在前面，必须先走一次这个方法，这里可以写一些本模块的公共处理
    this.router.use(function timeLog(req, res, next) {
      let time = Properties.getapplyTimeProp(Date.now());
      console.log(time + ",acess follow module,version=" + JSON.stringify(req.params));

      next();
    });
    //获取列表
    this.router
      .route("/follow/list")
      .post(function (req, res, next) {
        myController.followlist(req).then(result => {
          RouterUtil.copyDataAndNext(res, result, next)
        });
      });
    //获取单个
    this.router
      .route("/follow/get")
      .post(function (req, res, next) {
        myController.followget(req).then(result => {
          RouterUtil.copyDataAndNext(res, result, next)
        });
      });
  }
}
export default router4Follow;