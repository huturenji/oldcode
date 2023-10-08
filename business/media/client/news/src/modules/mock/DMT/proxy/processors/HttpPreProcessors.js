import BaseProcessors from "../../processors/BaseProcessors";
/**
 *HTTP前置处理管理器
 */
class HttpPreProcessors extends BaseProcessors {
    constructor() {
        super();
        //给缓存赋值
        this.addHttpPreProcessorMap();
    }

    /**
   * 给前置处理缓存 赋值，每新加一个 接口的处理，都需要在这里手动 修改代码。
   * 前置处理分为两个方法，open和send。因为open可以拦截URL；send可以拦截body数据。
   */
    addHttpPreProcessorMap() {
    /***这是2个demo，请不要删除 start*/
    //假设这是个get请求，我们需要实现open回调，处理URL。send无业务的话可以不实现。
        this.addProcessor2Cache("/DMT/getBpProductCategoriesTest", {
            open: function(url) {
                console.log("preProcessor 4 open /DMT/getBpProductCategoriesTest");
                let response = url;
                response += "&id=1234";
                return response;
            }
        });
        //假设这是个POST请求，send会发送body数据，我们需要实现send回调，处理body数据。
        this.addProcessor2Cache("/order/getBpProductCategories", {
            open: function(url) {
                console.log("preProcessor 4 open /order/getBpProductCategories");
                let response = url;
                return response;
            },
            send: function(body, xhr) {
                console.log("preProcessor 4 send /order/getBpProductCategories");
                let response = JSON.parse(JSON.stringify(body));
                //修改请求体body数据
                let theBody = JSON.parse(response[0]);
                let data = JSON.parse(theBody.data);
                data.PageCategoryIndex = "1599422";
                theBody.data = JSON.stringify(data);
                theBody.name = "liguanqun";
                response[0] = JSON.stringify(theBody);

                //设置请求头数据
                xhr.setRequestHeader("channelId", 134000);
                return response;
            }
        });
    /***这是2个demo，请不要删除 end*/
    }
}

export default new HttpPreProcessors();
