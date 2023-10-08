import httpPostProcessors from "./processors/HttpPostProcessors";
import httpPreProcessors from "./processors/HttpPreProcessors";
import ajaxHookObj from "./ajaxhook";
import Util from "../common/Util";
/**
 *本地HTTP代理：负责拦截请求，获取控制权。
 *本代理引用后，自动开启拦截Ajax请求。
 *请注意：数据中台的业务，本代理无法满足所有的场景，具体说明如下。
 * 1、有前置处理或者后置处理的Ajax请求，后端有一对一的接口。本代理可以满足。
 * 2、有前、后置处理的中台虚拟的Ajax请求，后端有0个接口。本代理可以满足。请参考下面 interruptAjaxReq , interruptAjaxRes 方法的注释。
 * 3、有前、后置处理的中台虚拟的Ajax请求，后端对应大于1个接口。本代理不满足。根据之前的讨论，
 * 中台不处理这种接口聚合业务。因为本身没有多大意义。
 * 关于中台虚拟的Ajax请求，我们定义必须包含的basePath是 /DMT/，参见属性 DMTVirtualAPIPath
 */
class DMTHttpProxy {
  constructor() {
    //中台的虚拟API的根路径
    this.DMTVirtualAPIPath = "/DMT/";
    //ajaxHook是一个ajax拦截器，小巧有效。通过NPM安装。作为我们DMT的拦截引擎。
    ajaxHookObj(this);
    //一个标记位，标记DMTHttpProxy是否启动拦截器。
    this.ajaxHookTig = false;
    //默认启动ajax拦截引擎
    this.start();
  }

  /**
   * 启动代理的Ajax拦截引擎
   * 这是一个全局的ajax代理拦截，只要是底层通过XMLHTTPRequest发出的请求都会被拦截。
   */
  start() {
    if (this.ajaxHookTig) {
      Util.log(
        "start method:DMTHttpProxy ajaxHook is running!can't start again!",
        [],
        true
      );
      return;
    }
    const that = this;
    //生成ajax请求代理对象。
    that.hookAjax({
      /**
       * 拦截回调方法，后置业务的统一拦截入口。
       * 因为SWPUtil的Ajax封装本质上使用的回调是onreadystatechange。
       * 所以这里只需要拦截它即可，onload回调不需要拦截。
       * @param {*} xhr 注意，这里的xhr是代理对象，不是原生的xhr对象，
       * 我们在这里可以先处理一次response，再返回给客户端回调。
       * 因为原生的xhr对象的response属性是只读的，不可修改。
       */
      onreadystatechange: function(xhr) {
        if (xhr.readyState == 4) {
          //只有readyState等于4，表示ajax请求完成，才去做后置业务处理
          that.interruptAjaxRes(xhr);
          Util.log("onreadystatechange called:xhr=%O", [xhr]);
        }
      },
      /**
       * 拦截请求方法，前置业务的统一拦截入口。
       * @param {*} arg 客户端调用open方法传入的参数，分别是arg[0]请求方式，arg[1]URL和arg[2]是否异步
       * @param {*} xhr 这里是原生的xhr对象。我们在这里拦截，可以对原生的xhr的请求做一些修改。
       */
      open: function(arg, xhr) {
        that.interruptAjaxReq(arg, xhr, 1);
      },
      /**
       * 拦截请求方法，前置业务的统一拦截入口。
       * @param {*} arg 客户端调用send方法传入的参数，一般是body请求体
       * @param {*} xhr 这里是原生的xhr对象。我们在这里拦截，可以对原生的xhr的请求做一些修改。
       */
      send: function(arg, xhr) {
        // xhr.setRequestHeader("authorization", 134000);
        // xhr.setRequestHeader("userId", 1);
        that.interruptAjaxReq(arg, xhr, 2);
      }
    });
    //更改标记位
    that.ajaxHookTig = true;
  }

  /**
   * 关闭ajax拦截引擎
   */
  stop() {
    if (!this.ajaxHookTig) {
      Util.log("stop method:DMTHttpProxy get some error", [], true);
      return;
    }
    this.unHookAjax();
    this.ajaxHookTig = false;
  }

  /**
   * 拦截ajax的请求。如有前置业务，执行前置业务。
   * 请注意：本拦截方法是没有返回值的。原因如下：
   * 拦截器AjaxHook的所有方法如open、send等返回值类型是一个布尔值，为true时会阻断对应的请求。
   * 我们逻辑上不会阻断任何请求（包括中台虚拟的请求），所以我们的拦截方法和前置业务方法都不要返回值
   * @param {*} arg 调用者使用xhr.open和send时传入的参数
   * @param {*} xhr 原生的xhr方法
   * @param {*} from from=1，表示拦截open方法；from=2表示拦截send方法。
   * 因为open的参数在send方法无法获取到，必须拦截2次，适应不同的拦截需求
   */
  interruptAjaxReq(arg, xhr, from) {
    try {
        Util.log("interruptAjaxReq called:request=%s,from=%s", [
            JSON.stringify(xhr),
            from
        ]);
    } catch (e) {

    }
    
    //如果是open方法，开始前置处理
    if (from == 1) {
      //原始的open参数，我们保存一份，到原生的xhr。后置处理等多处会用到
      xhr.requsetOpenArg = Array.from(arg);
      //是否针对接口增加了 业务处理
      let findUlrProcess = httpPreProcessors.getProcess4Cache(
        xhr.requsetOpenArg[1]
      );
      //执行前置处理方法,参数是open的参数。这里的处理指的是对URL做一番改动。
      if (findUlrProcess && findUlrProcess.open) {
        //赋值改变的URL
        arg[1] = findUlrProcess.open(xhr.requsetOpenArg[1]);
      }
    }
    //如果是send方法，开始前置处理
    if (from == 2) {
      //是否针对接口增加了 业务处理
      let findUlrProcess = httpPreProcessors.getProcess4Cache(
        xhr.requsetOpenArg[1]
      );
      //执行前置处理方法,参数是send发送的数据。这里的处理指的是对body做一番改动。
      if (findUlrProcess && findUlrProcess.send) {
        //send方法，为了能够原生xhr使用改动后的body对象，赋值给一个新字段sendAgrs。
        xhr.sendAgrs = findUlrProcess.send(arg, xhr);
      } else {
        xhr.sendAgrs = arg;
      }
    }
  }

  /**
   * 拦截ajax的回调。如果有后置业务，执行后置业务。
   *请注意：后置处理包括2种场景：1是真实的ajax请求返回了数据，2是中台虚拟的ajax请求返回了，通过特定的URL来判断
   * @param {*} xhr 中台的代理对象，原生xhr对象，请访问xhr.xhr
   */
  interruptAjaxRes(xhr) {
    if (xhr.readyState != 4) {
      //HTTP 响应已经完全接收。其他状态不需要处理。
      return;
    }
    //是否针对接口增加了 业务处理
    let findUlrProcess = httpPostProcessors.getProcess4Cache(
      xhr.responseURL || (xhr.xhr && xhr.xhr.requsetOpenArg[1])
    );
    if (findUlrProcess) {
      //HTTP 响应正常。对应场景1，真实接口数据正常返回，直接获取返回对象
      if (xhr.status == 200 && xhr.responseType.indexOf("json") != -1) {
        let postParam =
          Util.type(xhr.response) == "object"
            ? JSON.parse(JSON.stringify(xhr.response))
            : JSON.parse(xhr.response);
        //这里是商城的数据结构，返回resultCode=0表示业务正常。其实这个判断也不太应该放到这里，因为相当于代理跟具体的接口实现耦合了。
        if(postParam && postParam.resultCode == 0){
          let postRes = findUlrProcess(postParam);
          xhr.response = postRes;
        }else{
          xhr.response = postParam;
        }    
        return;
      }
      //HTTP 响应不正常。对应场景2，虚拟接口数据的返回，我们希望模拟一个200状态和自定义数据给调用者。
      if (
        xhr.status != 200 &&
        xhr.xhr &&
        xhr.xhr.requsetOpenArg[1] &&
        xhr.xhr.requsetOpenArg[1].indexOf(this.DMTVirtualAPIPath) != -1
      ) {
        xhr.responseType = "json";
        xhr.response = findUlrProcess();
        xhr.status = 200;
        return;
      }
    }
  }
}

export default new DMTHttpProxy();
