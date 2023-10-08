/**
商城客服系统统一的工具类
目前客服系统用的第三方（智齿科技）
官方api链接地址：https://www.sobot.com/developerdocs/web/web_api.html
接入方式有两种：

第一种（一期暂定用的此种方式）：
<!--链接对接方式，可以显示订单卡片-->
<a href='https://chaten.sobot.com/chat/h5/v2/index.html?sysnum=dcce9016106c4275adca76544d320c18&order_status=1&create_time=1586414406391&order_code=121212&order_url=http://www.sobot.com&goods_count=2&total_fee=1000&goods=[{"name":"saaadad","pictureUrl":"https://img.sobot.com/console/common/face/admin.png"}]' target="_blank">欢迎咨询</a>

第二种：
<!--组件对接方式，没有显示订单卡片-->
<script>
    (function (w, d, e, x) {
    w[e] = function () {
        w.cbk = w.cbk || []
        w.cbk.push(arguments);
    }
    x = d.createElement("script");
    x.async = true;
    x.id = "zhichiScript";
    // ***为您的自定义域名
    x.src = "https://chaten.sobot.com/chat/frame/v2/entrance.js?sysnum=dcce9016106c4275adca76544d320c18";
    d.body.appendChild(x);
    })(window, document, "zc");

var goods = [{"name":"saaadad","pictureUrl":encodeURIComponent("https://img.sobot.com/console/common/face/admin.png")}];
zc("config", {
    order_status: 1,
    create_time: "1586414406391",
    order_code: 11111,
    order_url: encodeURIComponent("http://www.sobot.com"),
    goods_count: 2,
    total_fee: 1000, //（以分为单位，total_fee=1000相当与total_fee=10.00元，不支持小数）
    goods: JSON.stringify([{"name":"saaadad","pictureUrl":encodeURIComponent("https://img.sobot.com/console/common/face/admin.png")}]),
});
*/
import globalConfig from '@/common/lib/config';
import getUserInfo from './userInfo';

const ZC_URL = globalConfig.ZC_URL; //客服对接应用的url
const ZC_SDK_URL = 'https://chaten.sobot.com/chat/frame/v2/entrance.js?sysnum=dcce9016106c4275adca76544d320c18'; //客服对接JS-SDK的js

class Customer {
    constructor(){
        this.settingConfig = {};
        this.userConfig = {}; //用户信息的相关配置项
        this.productConfig = {}; //商品卡片的相关配置项
        this.orderConfig = {}; //订单信息的相关配置项
    }

    initSettingConfig() {
        let themeObj = window.themeObj;
        this.settingConfig = {//系统的相关配置项，
            color: themeObj.config.zcServiceThemeColor, //聊天的主题颜色
            type:2 //仅人工客服模式
        }
    }

    /**
     * 初始化智齿科技组件JS-SDK
     * 需要注意的一点事，必须页面dom渲染完后，在进行此次操作
     */
    initZcSdk(){
        (function (w, d, e, x) {
            w[e] = function () {
                w.cbk = w.cbk || []
                w.cbk.push(arguments);
            }
            x = d.createElement("script");
            x.async = true;
            x.id = "zhichiScript";
            x.className="zhiCustomBtn"; //该class绑定到自定义按钮上 第一步
            // ***为您的自定义域名
            x.src = ZC_SDK_URL;
            d.body.appendChild(x);
        })(window, document, "zc"); 
        zc("config",{
            custom:true //设置自定义生效 第二步
            // anchor:true, // true 新窗口打开咨询页 false 打开悬浮窗咨询页（默认值）
        })  
    }
    

    // 获取相关的客服配置项
    getConfig(config={}, type){
        if (!!type){
            this[type + 'Config'] = config;
            return Object.assign({}, this[type + 'Config'], this.userConfig, this.settingConfig); //不管是productConfig和orderConfig否需要拼接userConfig和settingConfig
        }
        return Object.assign({}, this.userConfig, this.settingConfig);
    }


    /********
     * 整合在线客服需要拼接的参数对象为url参数形式
     */
    getWholeZcUrl(zcConfig, symbol="&"){
        if (Object.keys(zcConfig).length <= 0){ return }
        let str = ''
        for (var key in zcConfig){
            str += `${symbol}${key}=${zcConfig[key]}`
        }
        return `${ZC_URL}${str}`;
    }

    /**
     * 
     * @param {*} mode 运行的模式 1=url模式即第一种，返回全路径； 2=config模式 即第二种 
     * @param {*} config 
     */
    run(mode=1, config, type){
        //获取完用户信息后，在进行后续的操作
        return new Promise((resolve, reject) => {
            getUserInfo().then(data => {
                this.userConfig = data;
                this.initSettingConfig();
                let zcConfig = this.getConfig(config, type);
                if (mode == 1){ //链接对接方式
                    resolve(this.getWholeZcUrl(zcConfig));
                } else if (mode == 2){ // js-sdk对接方式
                    this.setZcConfig(zcConfig);
                    resolve('done');
                }
            }).catch(e=>{
                console.log(e);
                reject(e)
            })
        })
    }

    /**
     * 初始化组件的对接方式
     */
    setZcConfig(zcConfig){
        zc("config", zcConfig);
    }
}

export default new Customer();