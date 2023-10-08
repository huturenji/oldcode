import Properties from "../../Properties";
import myController from "../controllers/controller4product"
import RouterUtil from "../../../../core/server/router/routerUtil"
import router4Module from "../../../../core/server/router/router4Module";
/**
 * 商品模块的路由配置,
 * 注意：我们的处理结果不能直接调用res.send终结，需要赋值到res.sourceData,继续next
 */
class router4Product extends router4Module {
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
      console.log(time + ",acess product module,version=" + JSON.stringify(req.params));

      next();
    });
    //获取商品分类
    this.router
      .route("/productCategory/getCategoryList")
      .get(function (req, res, next) {
        myController.getCategoryList(req).then(result => {
          RouterUtil.copyDataAndNext(res, result, next)
        });
      });
    //获取商品列表
    this.router.route("/product/searchProduct").post(function (req, res, next) {
      myController.searchProduct(req).then(result => {
        RouterUtil.copyDataAndNext(res, result, next)
      });
    });
    //获取商品详情
    this.router.route("/product/getDetail").post(function (req, res, next) {
      myController.getDetail(req).then(result => {
        RouterUtil.copyDataAndNext(res, result, next)
      });
    });
    //获取商品详情摘要
    this.router.route("/product/getDetailSummary").post(function (req, res, next) {
      myController.getDetailSummary(req).then(result => {
        RouterUtil.copyDataAndNext(res, result, next)
      });
    });
  }

}
export default router4Product;