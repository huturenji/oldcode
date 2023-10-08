import store from '../store'
import {OPERATION_STAGE} from '../constant'
class H5Pay{
    constructor(){
        this.frameId = 'h5PayFrame'
        this.holdingOn = false;
    }

    init(){
        this.resetFrames();
    }

    resetFrames(){
        this.holdingOn = false;
        let frame = document.getElementById(this.frameId);
        if(frame){
            frame.remove();
            return true;
        }
        return false;
    }

    /**
     * 页面重定向到第三方支付网站的H5支付方式，以微信H5支付为例
     * 微信H5支付
     * 方案说明：1.新开的窗口，并在新窗口的中转页中重定向到微信的支付链接，当从微信回来后，关闭中转页的窗口，并弹出用户选择框
     *          2.在IOS中，新窗口是ios打开的，并非是window.open原生方法打开的，所以新窗口和本窗口失联，两者间无法用opener或postMessage来交互，只能用监听localStorage的方式来判断新窗口是否已关闭
     *          （由于是公共组件，不适合用jsBridge的refreshPageFunction）
     *          3.由于是异步回调中使用window.open，在ios中由于安全策略会被拦截，所以必须注册extendUtils.overwriteWindowopenFunction
     * 备注：不可用iframe，ios中的iframe会被当做新窗口打开，造成ios和安卓的代码交互不一致；不可用location.href，否则会有更多问题；只能新开窗口
     *
     */
    urlRedirect(url) {
        let that = this;
        this.init();
        location.href=url;
        //不使用iframe+redirectUri的模式，否则ios上无法从微信回到伴正事。代码保留。
        // if(Utils.isNotEmpty(store.state.config.redirectUri)){
        //     url += '&redirect_url=' + store.state.config.redirectUri;
        // }
        // if(store.state.depends.snutils.getNavigatorType().toLowerCase() == 'ios'){
        //     url += '&sswbv_multipage=false';
        // }
        // const iframe = document.createElement('iframe')
        // iframe.id = this.frameId
        // iframe.style.display ='none'
        // iframe.setAttribute('src', url)
        // iframe.setAttribute('sandbox','allow-top-navigation allow-scripts')
        // document.body.appendChild(iframe);
        setTimeout(()=>{
            that.h5PayComplete();//这里必须延迟执行，否则支付还未打开，就响应相关事件了
        }, 1000)
        return true;
    }

    /**
     * 新开页面
     */
    openPage(url){
        let that = this;
        sinosdk.sino.openThirdApplet({url});
        setTimeout(()=>{
            that.h5PayComplete();//这里必须延迟执行，否则支付还未打开，就响应相关事件了
        }, 500)
    }

    /**
     * 提交一段form表单然后跳转到第三方页面的支付方式
     * 到第三方页面后，支付过程完全在第三方进行，支付完成后需要回到当前页面。
     * 回到当前页面的方式同重定向的跳转方式，用定时器扫描缓存来判断用户的支付动作，并弹出支付确认框
     *
     * 注意：需要加上nextAll_multipage=false，表示中转页之后的所有页面都在单页面打开。【只针对IOS有效】 否则在IOS上，银联的表单会弹出两次（IOS版T信的处理机制导致）
     */
    innerHTMLForm(form) {
        let that = this;
        this.init()
        form.replace('<form','<form target="_self"');//PC上必须要打开新窗口，否则回退有问题
        const iframe = document.createElement('iframe')
        iframe.id = this.frameId
        iframe.style.background='#fff';
        iframe.style.position = 'absolute';
        iframe.style.left = 0;
        iframe.style.top = 0;
        iframe.style.width ='100%';
        iframe.style.height ='100%';
        iframe.style.border = 'none';
        let zIndex = parseInt(store.state.config.zIndex);
        iframe.style.zIndex = isNaN(zIndex) ? 9999 : zIndex + 9;
        iframe.setAttribute('sandbox','allow-top-navigation allow-forms allow-same-origin allow-scripts')
        document.body.appendChild(iframe);
        iframe.contentDocument.body.innerHTML = form;
        iframe.contentDocument.querySelector('form').submit();
        this.holdingOn = true;
        setTimeout(()=>{
            that.h5PayComplete();//这里必须延迟执行，否则支付还未打开，就响应相关事件了
        }, 1000)
        return true;
    }

    submitForm(form, target){
        let div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.left = 0;
        div.style.top = 0;
        div.height = '0px';
        div.style.visibility = 'hidden';
        div.style.zIndex = -1;
        div.innerHTML = form;
        document.body.appendChild(div);
        let formDom = div.querySelector('form');
        if(target){
            formDom.setAttribute('target',target);
        }
        formDom.submit();
        this.holdingOn = true;
        setTimeout(()=>{
            that.h5PayComplete();//这里必须延迟执行，否则支付还未打开，就响应相关事件了
        }, 1000)
        return true
    }


    h5PayComplete(){
        store.commit('setOperationStage', OPERATION_STAGE.WAITING)
    }

}

export default new H5Pay();
