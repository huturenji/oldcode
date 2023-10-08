import { goBackPage } from 'src/jsbridge/bridge-fun.js';
import { reloadPage,showToast } from 'src/tools/extend.js';
import { BisType, ErrorCodeMap, NoticeType, WhiteList } from 'src/enum/errorcode-enum';
import { stateManager } from 'src/tools/pop-state-manager.js'

//TODO 错误码的场景应该更加细化，比如同样的错误码，在首页不提示，在内页正常提示，但在编辑订单页面提示其它的内容

var ErrorCodeInterceptor = (function () {

    var WhiteListFilter = (function(){
        let globalWhiteList = WhiteList.global;
        let popupWhiteList = WhiteList.popup;

        function inGlobalWhiteList(url){
            return filter(url, globalWhiteList);
        }
        function inPopupWhiteList(url){
            return filter(url, popupWhiteList);
        }

        function filter(url, whiteList){
            let flag = false;
            if(!url){
                return flag;
            }
            whiteList.some((whiteUrl)=>{
                if(url.indexOf(whiteUrl)>-1){
                    flag = true;
                    return true;//跳出循环
                }
            })
            return flag;
        }

        return {
            inGlobalWhiteList: inGlobalWhiteList,
            inPopupWhiteList: inPopupWhiteList
        }
    })();

    /**
     * http请求拦截器。根据errorCodeEnum中的配置进行拦截。拦截后有不同的操作，比如刷新，重试，回退，提示等
     */
    class interceptor {
        constructor(props) {
            if(!!props){
                this.code = props.code;
                this.caller = props.caller;//原请求函数
                this.data = props.data;
                this.url = props.url;
            }
            this.noticeCount = [];//提示计数器
            this.confirmPop = null;//弹窗对象，应是单例
        }

        init(props = {}) {
            this.errorObj = null;
            this.popup = null;
            this.code = props.code;
            this.caller = props.caller;//原请求函数
            this.data = props.data;
            this.url = props.url;
            return this
        }
        /**
         * 拦截核心方法
         */
         run(code = this.code,url) {
            return new Promise(async(reslove, rejects) => {
                let errorObj = ErrorCodeMap[code];
                //没有匹配的错误码，直接返回
                if (!errorObj) {
                  if(!!code && !WhiteListFilter.inGlobalWhiteList(this.url)){//如果有错误码但没匹配到，则提示未知错误。如果在白名单中，则不提示。
                    showToast(this.setText(true));
                    rejects();
                  }else{
                    reslove();
                  }
                  return;
                }
                errorObj.href = location.hash;//记住当前错误对象所属的路由
                !this.url && (this.url=url);
                //level为0表示不受任何白名单限制 TODO 对级别的处理应抽象成一个独立的功能
                //全局白名单过滤
                if(errorObj.level!==0 && WhiteListFilter.inGlobalWhiteList(this.url)){
                    reslove();
                    return;
                }

                this.code = code;
                let bisType = errorObj.bisType;

                //多场景处理
                if(errorObj instanceof Array){
                    let flag = false;
                    //这里不能用some循环，因为some的回调必须是同步函数
                    for(let i=0;i<errorObj.length;i++){
                        let obj = errorObj[i];
                        //处理多场景时，每次对象中的errorObj都是多场景中的其中一个
                        this.errorObj = obj;
                        // 按顺序匹配场景，如果匹配到场景，且拦截到了，立即结束匹配。
                        // 如果都没匹配到，则说明全部没拦截到
                        if(await this.errorObjHandler(obj)){
                            bisType = obj.bisType;
                            flag = true;
                            break;
                        }
                    }

                    if(flag){
                        rejects(bisType);
                    }else{
                        reslove();
                    }
                }else{//单场景
                    this.errorObj = errorObj;
                    await this.errorObjHandler(errorObj) ? rejects(bisType) : reslove();
                }
            })
        }

        /**
         *
         * @param errorObj
         * @return {boolean} true 拦截成功；false 未拦截
         */
         async errorObjHandler(errorObj){
            //当前错误对象的场景是否匹配
            if(!this.inSence(errorObj.scene)){
                return false;
            }
            //ignore属性表示不在这里处理
            if(!!errorObj.ignore){
                return true ;
            }
            this.setText();//设置提示文字
            try {
                //记录提示次数
                this.count(errorObj);
                //提示次数判断。如果超过了限制次数，则直接拦截，不提示
                if(!this.limit(errorObj)){
                  return true;
                }
                switch (errorObj.noticeType) {
                    case NoticeType.TOAST://弹出提示信息
                        this.toastHandler();
                        break;
                    case NoticeType.ALERT://弹出提示框
                        this.alertHandler();
                        break;
                    case NoticeType.CONFIRM://弹出确认框
                        this.confirmHandler();
                        break;
                    case NoticeType.POPUP://弹出错误页面
                        //如果在白名单中，则不处理
                        //level为0表示不受任何白名单限制
                        if(errorObj.level!==0 && WhiteListFilter.inPopupWhiteList(this.url)){
                            return false;
                        }
                        this.popupHandler();
                        break;
                    case NoticeType.CUST_ACTION:
                        let result = await errorObj.func && errorObj.func(this.data);
                        return await result;
                    default:
                        return false;
                }
                return true;
            } catch (e) {
                console.log(e)
                return false;
            }
        }

        count(errorObj){
           this.noticeCount.push(errorObj)
        }

        /**
        * 提示语次数限制。针对一个路由页面限制
        */
        limit(errorObj){
          let count = 0;
          this.noticeCount.forEach(notice => {
            if(notice.code == errorObj.code && notice.href == location.hash){
              count++;
            }
          })
          if(count > errorObj.remindTimes){
            return false;
          }
          return true;
        }

        /**
         * 是否在指定场景内
         * @param 场景集合，也就是各场景url的字符串数组。其中这个url是用indexOf匹配的，所以可以给全路径，也可以只给其中一部分，但要能唯一识别它。例：订单列表页面，可写成"static/order/modules/myOrder.html" 或 "order/modules/myOrder.html"。 注意：如果只写到.html，表示匹配全局路由/，如果匹配单个路由，需要加上路由的路径。比如可以配置成：orderDetail.html#/train/orderDetail，表示匹配火车票订单详情
         */
        inSence(senceArr){
            //undefined说明没有设置场景，表示全场景适用
            if(senceArr === undefined){
                return true;
            }
            //设置的场景为null或空数组，表示全场景不适用。
            if(senceArr===null || senceArr.length==0){
                return false;
            }
            let hash = location.hash;
            let paraPositionStart = hash.indexOf('?');
            let routePath = paraPositionStart==-1 ? hash : hash.substring(0, paraPositionStart);
            let pathName = location.pathname + routePath;//地址路径+路由
            return senceArr.some(sence => {
                //复杂参数控制 TODO 等有实际场景了再细化
                // if(sence.constructor == Object){
                //     if(!!sence.whiteList && sence.whiteList.construct == Array){
                //         sence.whiteList.
                //     }
                //     //是否用正则匹配
                //     if(sence.exp === true){
                //         return new RegExp(sence.value).test(pathName);
                //     }
                // }else{//简单字符串
                    return pathName.indexOf(sence);
                // }
            })
        }

        /**
         * 获取地址栏中的路由地址
         */
        getRoutePath(){
            let hash = location.hash;
            let paraPositionStart = hash.indexOf('?');
            return paraPositionStart==-1 ? hash : hash.substring(0, paraPositionStart);
        }

        /**
         * 获取弹窗实例，如果已存在实例，则返回空对象。也就是说，一个页面，只会有一个弹窗。这个弹窗是第一个错误的弹窗。
         */
        getConfirmInstance(){
            //永远只弹一个框出来。如果一个页面有多个接口出错而引发多个弹框，只弹出最先接收到的那个异常的弹窗
            if(document.getElementsByClassName('bis-confirm').length>0){
                return null;
            }
            return new Confirm();

        }

        /**
         * 弹出提示信息
         */
        toastHandler() {
            showToast(this.errorObj.content);
        }

        /**
         * 弹出确认信息
         */
        alertHandler() {
            let that = this;
            let {confirm: confirmText = '确定'} = that.analyseBtnProp(that.errorObj.btnName);//按钮文字
            let {confirm: confirmBisType} = that.analyseBtnProp(that.errorObj.bisType);//按钮默认事件
            let {confirm: confirmFunc} = that.analyseBtnProp(that.errorObj.bisFunc);//用户定义的按钮事件
            let {confirm: confirmStyle} = that.analyseBtnProp(that.errorObj.bisStyle);//用户定义的按钮事件
            let confirm = this.getConfirmInstance();
            confirm && confirm.show({
                content: this.errorObj.content,
                confirmStyle: confirmStyle,
                confirmText: confirmText,
                maskZIndex: 99999999999,
                showCancelButton: false,
                onConfirm: function () {
                    confirmFunc ? confirmFunc(that.data) : that.btnAction(confirmBisType);
                },
            });
        }

        /**
         * 弹出确认框
         */
        confirmHandler() {
            let that = this;
            let {confirm: confirmText = this.errorObj.bisType == BisType.REDO ? '重试' : '确定', cancel: cancelText='取消'} = that.analyseBtnProp(that.errorObj.btnName);//按钮文字
            let {confirm: confirmBisType, cancel: cancelBisType} = that.analyseBtnProp(that.errorObj.bisType);//按钮默认事件
            let {confirm: confirmFunc, cancel: cancelFunc} = that.analyseBtnProp(that.errorObj.bisFunc);//用户定义的按钮事件
            let {confirm: confirmStyle, cancel: cancelStyle} = that.analyseBtnProp(that.errorObj.bisStyle);//用户定义的按钮事件
            let confirm = this.getConfirmInstance();
            confirm && confirm.show({
                content: this.errorObj.content,
                confirmStyle: confirmStyle,
                cancelStyle: cancelStyle,
                confirmText: confirmText,
                cancelText: cancelText,
                showCancelButton: true,
                maskZIndex: 99999999999,
                onConfirm: function () {
                    confirmFunc ? confirmFunc(that.data) : that.btnAction(confirmBisType);
                },
                onCancel: function(){
                    cancelFunc ? cancelFunc(that.data) : that.btnAction(cancelBisType);
                }
            });
        }

        /**
         * 弹出错误窗口
         */
        popupHandler() {
            let that = this;
            return this.createPopup(this.errorObj).createPopup(
                {
                    //目前这种情况只有刷新页面，写死即可
                    "refresh": function () {
                        that.btnAction(BisType.REFRESH);
                    }
                }
            );
        }

        /**
         * 返回弹窗对象（单例）
         *
         */
        createPopup(errorObj) {
            if (!this.popup) {
                this.popup = new Popup(errorObj);
            }
            return this.popup;
        }

        /**
         * 点击错误页面上按钮的具体动作
         * 默认执行rej，即进入原请求的catch。因为对于原请求来说，此时已经是异常情况了。
         */
        btnAction(bisType) {
            //btnRes和btnRej用于区分按钮是否执行了具体的动作（但现在这个没有意义，因为拦截后都统一进入原请求函数的catch块了，按钮执行操作后，不会对原请求函数有影响）
            return new Promise((btnRes, btnRej) => {
                //如果没有操作属性，则不处理
                if (!bisType) {
                    btnRes();
                    return;
                }
                switch (bisType) {
                    case BisType.CLOSE://关闭当前窗口（目前只对弹出框有效）
                        btnRej();
                        break;
                    case BisType.REDO://重试
                        btnRej();
                        break;
                    case BisType.BACKPAGE://返回上一页
                        stateManager.closeTopPop(() => {
                            if (history.length == 1) {
                                goBackPage();
                            } else if (!!stateManager.scope && !!stateManager.scope.$router) {
                                stateManager.scope.$router.back();
                            } else {
                                history.back();
                            }
                            btnRej();
                        });
                        break;
                    case BisType.REFRESH://刷新页面
                        reloadPage();//因为页面要刷新，就不走后面的业务逻辑了
                        break;
                    case BisType.BACKINDEX://返回首页 （todo 暂时没这种场景，所以没实现）
                        btnRej();
                        break;
                    case BisType.CONTACTSER://联系客服
                        callNativeTel(this.errorObj.phoneNum);
                        btnRes();
                        break;
                    default:
                        btnRes();
                        return;
                }
            })
        }

        /**
         * 设置需要显示的提示文字
         * 如果错误对象中的useServerMsg属性为true，则显示data中serverMsgName对应的数据，否则显示text属性
         */
        setText(useServerMsg = false) {
            if(!this.errorObj){
                this.errorObj = {}
            }

            let content = this.errorObj.text;
            if(typeof this.errorObj.text == 'function'){
                content = this.errorObj.text();
            }
            //是否使用服务端的错误信息(没有配置提示语，或指定使用时)
            if (!content || useServerMsg || this.errorObj.useServerMsg) {
                let serverMsgName = this.errorObj.serverMsgName || 'resultMessage';//默认的服务器字段名是resultMessage
                content = this.data[serverMsgName] || content;
            }

            if(content==null || content==undefined || content.trim()==''){
                content = '获取信息失败，请稍后重试'
            }

            if(this.errorObj.showCode){
                content += '<label style="word-break: break-word;">（'+this.code+'）</label>'//不能用span，否则vux的toast会有样式问题
            }
            this.errorObj.content = '<div style="text-align: center;display: flex;flex-direction: column;">'+content+'</div>';
            return this.errorObj.content;
        }

        /**
         * 分析按钮相关的属性，包括名字，默认动作类型，自定义动作事件等
         * @param btnProp 如果是array，则第一个表示确定的名字/动作类型/动作事件，第二个表示取消的；
         *                  如果是其他类型（String或Function），则表示确定的名字/动作类型/动作事件
         */
        analyseBtnProp(btnProp){
            let obj = {};
            if(btnProp instanceof Array){
                btnProp.length>=0 && (obj.confirm = btnProp[0]);
                btnProp.length>=1 && (obj.cancel = btnProp[1]);
            }else{
                obj.confirm = btnProp
            }
            return obj;
        }
    }

    class Confirm {
        constructor(props){
            this.props = {
                content: '',
                cancelText: '取消',
                confirmText: '确定',
                onConfirm: null,
                onCancel: null,
                showCancelButton: true,
                showConfirmButton: true,
            };
            this.init(props);
            return this;
        }

        init(props){
            this.props = Object.assign(this.props, props || {});
        }

        show(props){
            this.init(props);
            this.destory();
            this.case = this.create();
            this.case.style.display = 'block';
        }

        hide(){
            if(!!this.case){
                this.case.style.display = 'none';
            }
        }

        create(){
            //父容器
            let container = document.createElement("div");
            container.classList.add('bis-confirm');

            //遮罩
            let mask = document.getElementsByClassName('bis-mask');
            if(!mask || mask.length==0){
                mask = document.createElement("div")
                mask.classList.add('bis-mask');
                mask.style.cssText = 'position: fixed;z-index: 9999999999999;top: 0;right: 0;left: 0;bottom: 0;background: rgba(0, 0, 0, 0.6);'
                container.appendChild(mask);
            }

            //内容容器
            let dialog = document.createElement("div");
            dialog.classList.add('bis-dialog');
            dialog.style.cssText = 'position: fixed;display: table;z-index: 9999999999999;width: 80%;max-width: 300px;top: 0;right: 0;bottom: 0;left: 0;margin: auto;background-color: #FFFFFF;'
            +'text-align: center;border-radius: 3px;overflow: hidden;';

            //内容
            let content = document.createElement("div");
            content.classList.add('bis-dialog__bd');
            content.innerHTML = this.props.content;
            content.style.cssText = 'text-align: left;padding: .76rem .4rem;font-size: .32rem;overflow-wrap: break-word;word-break: break-all;color: #191919;display: inline-block;'

            //按钮容器
            let footer = document.createElement("div");
            footer.classList.add('bis-dialog__ft');
            footer.style.cssText = 'position: relative;line-height: .92rem;font-size: .32rem;display: -webkit-box;display: -webkit-flex;display: flex;';
            if(this.props.showCancelButton){
                //取消按钮样式
                let btnDefault = document.createElement("a");
                btnDefault.href = 'javascript:;'
                btnDefault.innerHTML = this.props.cancelText;
                btnDefault.classList.add('bis-btn');
                btnDefault.classList.add('bis-btn_default');
                btnDefault.style.cssText = 'display: block;-webkit-box-flex: 1;-webkit-flex: 1;flex: 1;color: #999999;text-decoration: none;-webkit-tap-highlight-color: transparent;position: relative;'+(this.props.cancelStyle || '');
                btnDefault.onclick = ()=>{
                    this.props.onCancel && this.props.onCancel();
                    this.destory();
                }
                footer.appendChild(btnDefault);
            }
            if(this.props.showConfirmButton){
                //确定按钮样式
                let btnPrimary = document.createElement("a");
                btnPrimary.href = 'javascript:;'
                btnPrimary.innerHTML = this.props.confirmText;
                btnPrimary.classList.add('bis-btn');
                btnPrimary.classList.add('bis-btn_primary');
                btnPrimary.style.cssText = 'display: block;-webkit-box-flex: 1;-webkit-flex: 1;flex: 1;color: #478aee;text-decoration: none;-webkit-tap-highlight-color: transparent;position: relative;'+(this.props.confirmStyle || '');
                btnPrimary.onclick = ()=>{
                    this.props.onConfirm && this.props.onConfirm();
                    this.destory();
                }
                footer.appendChild(btnPrimary);
            }
            var style = document.createElement("style");
            document.head.appendChild(style);
            var sheet = style.sheet;
            sheet.insertRule('.bis-confirm .bis-btn::after { content: " ";position: absolute;left: 0;top: 0;width: 1px;bottom: 0;border-left: 1px solid #D5D5D6;color: #D5D5D6;'
            +'-webkit-transform-origin: 0 0;transform-origin: 0 0;-webkit-transform: scaleX(0.5);transform: scaleX(0.5); }', 0); // 支持非IE的现代浏览器
            sheet.insertRule('.bis-confirm .bis-dialog__ft::after {content: " ";position: absolute;left: 0;top: 0;right: 0;height: 1px;border-top: 1px solid #d5d5d6;color: #d5d5d6;'
            +'-webkit-transform-origin: 0 0;transform-origin: 0 0;-webkit-transform: scaleY(.5);transform: scaleY(.5);}', 0); // 支持非IE的现代浏览器


            dialog.appendChild(content);
            dialog.appendChild(footer);
            container.appendChild(dialog);
            document.body.appendChild(container);
            return container;
        }

        destory(){
            if(!!this.case){
                document.body.removeChild(this.case);
            }
        }
    }

    /**
     * 弹窗对象
     */
    class Popup {

        constructor(core) {
            this.primaryId = "errorPop";
            this.visiable = false;
            this.core = core;//弹窗的核心对象，弹窗中的元素都从这个属性中获取
        }

        setCore(core) {
            this.core = core;
            return this;
        }
        /**
         * 销毁弹框
         */
        destoryPopup() {
            if (!!this.visiable) {
                document.body.removeChild(errorPop);
                this.visiable = false;
            }
        }
        /**
         * 绘制错误页面
         * @param {*} btnFunc 页面上的按钮及相应的回调
         */
        createPopup(btnFunc) {
            try {
                if (!!this.popupVisiable) {
                    return false;
                }
                let bgDiv = document.createElement("div");
                bgDiv.style = "position: fixed;top: 0;bottom: 0;left: 0;right: 0;z-index:9999999999999;background: #f2f3f5;display: flex;justify-content: center;align-items: center;"
                bgDiv.id = this.primaryId;

                let contentDiv = document.createElement("div");
                contentDiv.style = "position: relative;line-height: .32rem;font-size: 0.32rem;color: #b2b2b2;text-align: center;";

                let img = document.createElement("img");
                img.src = this.core.iconUri;
                img.style = "width:2.56rem;height:2.56rem;position: absolute;top: -2.56rem;left: calc(50% - 1.28rem);";
                contentDiv.appendChild(img);

                let textDiv = document.createElement("div");
                textDiv.textContent = this.core.text + (this.code ? "（" + this.code + "）" : "");
                textDiv.style = "font-size: .32rem;color: #B2B2B2;";
                contentDiv.appendChild(textDiv);

                //目前只有一个刷新按钮，先这么写，以后有多场景，再考虑这个该怎么布局
                let btnDiv;
                if (Object.keys(btnFunc).length > 0) {
                    let key = Object.keys(btnFunc)[0];
                    btnDiv = document.createElement("img");
                    btnDiv.src = this.core.btnIconUri || "../assets/img/defaultPage/btn_" + key + ".png";
                    btnDiv.style = "margin-top: .6rem;width: .88rem;height: .88rem;cursor:pointer;position: absolute;left: calc(50% - .44rem);";
                    btnDiv.onclick = btnFunc[key];
                    contentDiv.appendChild(btnDiv);
                }

                bgDiv.appendChild(contentDiv);

                let target = this.getCoverTargetByClassName('child-view');
                if (!!target) {
                    target.innerHTML = '';
                    target.style.zIndex = '99999999999';
                    target.appendChild(bgDiv);
                    this.visiable = true;
                    return true;
                }
            } catch (e) {
                console.error("createPopup error:" + e);
            }
            return false;
        }

        /**
         * 根据className获取dom，如果找不到，就返回body
         * @param {*} className
         */
        getCoverTargetByClassName(className) {
            let result;
            //先用className去找dom，并获取第一个
            if (!!className) {
                result = document.getElementsByClassName(className);
                return !!result && result.length > 0 ? result[0] : this.getCoverTargetByClassName();//如果根据className找不到，就拿body返回
            } else {
                return document.body;
            }
        }
    }

    return interceptor;
})()

export const errorCodeInterceptor = new ErrorCodeInterceptor();
