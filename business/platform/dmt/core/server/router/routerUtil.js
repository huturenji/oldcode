/**
 * 路由的公共方法类 
 */
class RouterUtil {
    /**
     * 将控制器拿到的数据赋值给sourceData,继续next转交控制权。
     * 所有的业务的router中间件都需要自己调用这个方法。
     */
    static copyDataAndNext(res, result, next) {
        res.sourceData = result;
        next();
    }
    /**
     * 设置可以跨域访问
     * @param {*} res
     */
    static setCrosHeader(res) {
        //设置可以跨域访问
        res.header("Access-Control-Allow-Origin", "*"); //访问控制允许来源：所有
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept"
        ); //访问控制允许报头 X-Requested-With: xhr请求
        res.header("Access-Control-Allow-Metheds", "PUT, POST, GET, DELETE, OPTIONS"); //访问控制允许方法
        res.header("X-Powered-By", "nodejs"); //自定义头信息，表示服务端用nodejs
        res.header("Content-Type", "application/json;charset=utf-8");
    }
}
export default RouterUtil;