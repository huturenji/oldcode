/**
 * 业务模块的路由配置基类,子类只需要实现自己的loadAPIMethods方法即可。
 * 注意：我们的处理结果不能直接调用res.send终结，需要赋值到res.sourceData,继续next
 */
class router4Module {
  constructor(serverApp, serverRouter, rModulePath) {
    this.app = serverApp;
    this.router = serverRouter;
    this.modulePath = rModulePath
    this.loadAPIMethods();
    this.appLoadRouter()
  }
  /**
   * 加载本模块的所有的API处理组件
   */
  loadAPIMethods() {
  }
  /**
   * 加载router到serverAPP
   */
  appLoadRouter() {
    this.app.use(this.modulePath, this.router);
  }
}
export default router4Module;