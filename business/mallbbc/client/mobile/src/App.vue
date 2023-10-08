<script>
/** copyright *** sinosun bbc *** version-v3.0 *** date-2021-07-28 ***主版本v3.0**/
import {
    mapMutations,
    mapState
} from 'vuex';
import { setSession, getSession, filterFlag, isH5, getAppInfo, parseSearch, getBpParam, isNotEmpty} from './utils/common'
import config from '@/common/lib/config';
// #ifdef H5
import {tabBarInstall} from '@/components/decorate/tabBar';
// #endif
//引入数据埋点对象
import sensorHandler from '@/utils/sensorHandler';
import trackHandler from '@/utils/trackHandler';
export default {
    globalData: {
        // #ifdef H5
        apiUrl: window.location.origin + '/mallbbcg2/', //接口请求
        // #endif
        //#ifdef MP-WEIXIN
        apiWxUrl: 'https://bplussit.sinosun.com:18380/mallbbcg2/', //接口请求
        //#endif
        imgUrl: `${isH5() ? '.' : ''}/static/shared/`,//静态资源地址——本地开发 h5的话需要"./" weixin的话需要"/"
        h5AppId: 'wx9019a5f5fb0a0844',//微商城appid
        cateId: '', //首页分类更多跳转分类页对应分类参数。 sino-songjun注：这里必须用number类型
        uploadMaxSize: 20,//上传最大限制，以M为单位
        curLang: 'zh',//当前语言,zh:中文，若为其他语言，需要对应/static/language下面的文件名
        WxXcxGdKey: '9c8f0f53b5eb2e7d4b8f731a2e8b4488',//微信小程序Gdkey
        statShowDebug: false,//是否开启统计的调试
        userParams: {},
        appInfo: { //宿主载体APP的相关信息
            name: '', // app的名字
            logo: '' // app的logo
        }
    },//全局配置
    computed: {
        ...mapState(['hasLogin', 'userInfo', 'userCenterData'])
    },
    created(){
    },
    methods: {
        ...mapMutations(['login', 'logout', 'setUserCenterData','operateMobileTabBarConfig']),
        //判断当前时间是否为今天 并且不是第二天
        isToday(data) {
            return (new Date().toDateString() === data.toDateString()) && (Date.parse(data) < Date.parse(new Date(
                new Date().setHours(23, 59, 59, 59))));
        },
        // 初始化footerbar样式 目前主要是底部的透明加高斯模糊
        initFooterBarStyle(){
            if (filterFlag()){ //说明浏览器支持该属性或者是ios 因为经过测试所有的ios都支持该样式，但是部分安卓是不支持的
                this.$nextTick(()=>{
                    this.footerBarFilter();
                })
            }
        },

        // 移动端手机底部的footerbar新增高斯模糊的效果
        footerBarFilter(){
            let footBarDom = document.querySelector('.uni-tabbar-bottom .uni-tabbar');
            if (!!footBarDom){
                setTimeout(()=>{
                    // 目前UI设计稿提供的高斯模糊的效果就是如下写的样式
                    footBarDom.setAttribute("style","background-color: rgba(234,238,241,0.8) !important; backdrop-filter: blur(14px) !important; -webkit-backdrop-filter: blur(14px) !important");//一次添加多个
                }, 0)
            }
        },
        // 初始化宿主载体app相关的信息
        async initAppInfo(){
            this.globalData.appInfo.name = await getAppInfo('appName');
            this.globalData.appInfo.logo = await getAppInfo('appLogo');
        }
    },
    onLaunch: async function () {
        //判断是否对应渠道app打开
        let preventRender = await trackHandler.initTracker();
        if (preventRender.res){
            uni.redirectTo({url: `/standard/preventRender/index?preventRenderId=${preventRender.channelId}`});
        }
        // let querystr = parseSearch()
        // if(querystr['sku']){
        //     console.log(querystr['sku'])
        //     uni.redirectTo({url: `/standard/product/detail?sku=${querystr['sku']}`});
        // } 
        // #ifdef H5
        //将url上的用户参数存在appData.userParams中 
        let value = SnUtils.getUserPara(config.BP_PARAM) || getSession(config.BP_PARAM);
        isNotEmpty(value) && setSession(config.BP_PARAM, value)

        config.USER_INFO_PARAMS.forEach(p => {
            let paramVaule = getBpParam(value)?.[p];
            if (isNotEmpty(value) && isNotEmpty(paramVaule)) {
                this.globalData.userParams[p] = paramVaule
                setSession(p, paramVaule);
            }
        })
        uni.getSystemInfo({
            success: res => {
                this.globalData.systemInfo = res;
                this.globalData.bottomSateArea = 0; //手机底部安全区域高度
                this.globalData.model = res.model;
                this.globalData.titleBarHeight = 44; //原生的标题高度
                let iphoneXArr = ["iPhone X", "iPhone 11", "iPhone 11 Pro Max", "iPhone XR",
                    "iPhoneXS"]; //iphone手机底部一条黑线
                if (iphoneXArr.indexOf(res.model) != -1) {
                    this.globalData.bottomSateArea = "30rpx";
                }
                this.globalData.statusBarHeight = res.statusBarHeight;
            }
        });
        //借用uniapp tabbar兼容实现页面保活，隐藏uni tabbar todu后续处理好保活后去除uni tabbar
        uni.hideTabBar();
        //h5tabbar install
        window.onTabBarLoad = new Promise(async resolve=> { let tabbar = await tabBarInstall();resolve(tabbar) });

        //获取渠道信息
        this.$request({url: 'v3/channel/front/get', data:{channelId: await sinosdk.sino.getChannelId()}, methods: 'get'}).then(res=>{
            //存储渠道名称
            this.globalData.userParams.channelName = res?.data?.channelName;
            //判断渠道是否关闭
            if (res?.data?.channelState!='1'){
                window.titleBar.reset()
                uni.redirectTo({url: '/standard/emptyPage/index'})
            }
        })

        let storageList = Object.keys(localStorage)
        for (let i = 0; i < storageList.length; i++) {
            if (storageList[i].includes('bbcDecoInfo')) {
                uni.removeStorageSync(storageList[i])
            }
        }
        //数据埋点上报初始化
        sensorHandler.init();
        // #endif

        // 初始化宿主载体app相关的信息
        this.initAppInfo();

        let querystr = parseSearch()
        if(querystr['sku']){
            window.location.replace(location.origin + location.pathname + `#/standard/product/detail?sku=${querystr['sku']}`);
        } 
    },
    onShow: function () {
        setInterval(function () {
            let data = new Date();
            let isToday = (new Date().toDateString() === data.toDateString()) && (Date.parse(data) < Date
                .parse(new Date(new Date().setHours(23, 59, 59, 59)))); //判断当前时间是否为今天并且不为第二天
            if (!isToday) {
                uni.removeSavedFile({
                    key: 'cookie'
                })
            }
        }, 1000);
    },
    onHide: function () { },

    mounted(){
        // 初始化footerbar样式 目前主要是底部的透明加高斯模糊 经UI要求 屏蔽掉该功能2022/03/29
        // this.initFooterBarStyle();

        // 获取购物车商品种类数量
        this.$store.dispatch('getCartNum');
        // 获取地址列表
        this.$store.dispatch('getAddressList');
    }
}
</script>

<style lang="scss">
    /* 注意要写在第一行，同时给style标签加入lang="scss"属性 uview-ui基础样式*/
    @import "uview-ui/index.scss";

    /*
        全局体图标——阿里巴巴图标库
    */
    @import './common/css/icons.css';
    /*
        全局公共样式
    */
    @import './common/css/base.css';

    // 全局屏蔽掉顶部导航栏下侧的progress 的loading（2021/10/20），原因是因为与银行的loading重复了
    #router-loadding{
        display: none !important;
    }


    // 底部的tabbar高斯模糊的效果样式实现
    .uni-tabbar-bottom .uni-tabbar{
        .uni-tabbar-border{
            background-color: rgba(211,211,211,0.45) !important;
        }
        .uni-tabbar__icon{
            margin-top: 0px;
        }
    }

    /* 页面wrapper的位置在titlebar下方，tabbar上方 */
    uni-page-wrapper{
        position: absolute;
        top: var(--titleBarFillHeight, 0px);
        left: 0;
        width: 100%;
        background-color: $bg-color-split;
        height: calc(100% - var(--titleBarFillHeight, 0px) - var(--tabBarHeight, 0px) );
        z-index: 0;
    }

    uni-page-body{
        height: 100%;
    }
    
    @media screen and (min-width: 616px){
        uni-page-wrapper{
            left: 50%;
            margin-left: -375rpx;
            width: auto;
        }
    }

    /* 防止uni-page-wrapper的marginTop坍塌 */
    uni-page-body, uni-page-body > uni-view:first-of-type{
        &::before{
            content: '';
            display: block;
            overflow: hidden;
        }
    }

    /* 覆盖uniLoading样式. loading是三倍图，所以所有尺寸放大三倍后再scale缩小 1/3 */
    uni-toast .uni-toast{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: auto;
        min-width: 660rpx;
        min-height: 528rpx;
        margin: 0;
        padding: 96rpx 108rpx 84rpx 108rpx;
        border-radius: 72rpx;
        background: rgba(0,0,0,.8);
        transform: translate(-50%,-50%) scale(0.3333);
        .uni-icon_toast{
            margin: 0;
        }
        .uni-loading{
            margin: 0;
            width: 180px;
            height: 116px;
            background: var(--loadingImg);
            animation: sequenceLoading .8s steps(30,end) infinite;
            -webkit-animation: sequenceLoading .8s steps(30,end) infinite;
        }
        i[class*="uni-icon-"]{
            transform: scale(3);
             margin: 72rpx 0rpx 128rpx 0rpx;
        }
        .uni-icon-error::before{
            font-size: 40px;
        }
        .uni-toast__content{
            margin: 0;
            color: #fff;
            font-size: 84rpx;
            max-width: 1044rpx;
            min-width: 504rpx;
            word-break: keep-all;
            word-wrap: break-word;
            line-height: 120rpx;
        }
    }

    #sinoPay{
        .weui-toast{
            background: rgba(0,0,0,.3);
            width: 270px;
            height: 210px;
            transform: translate(-50%, -50%) scale(0.3333);
            border-radius: 30px;
            display: flex;
            align-items: center;
            flex-direction: column;
            justify-content: center;
            font-size: 36px;
        }
        .weui-loading.weui-icon_toast{
            margin: 0;
            width: 180px;
            height: 128px;
            margin: 0 45px;
            background: var(--loadingImg);
            animation: sequenceLoading .8s steps(30,end) infinite;
            -webkit-animation: sequenceLoading .8s steps(30,end) infinite;
        }
    }
    
    .summary-confirm{
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;

        header{
            background: var(--protocolBg) !important;
            background-size: 308rpx 208rpx, 360rpx 208rpx, 100% !important;
            .icon{
                background: var(--protocolBgIcon) !important;
                background-size: contain !important;
            }
            .title{
                font-weight: normal;
            }
        }

        .protocol-detail-link{
            line-height: 0.44rem !important;
            color: #222 !important;
            .uri{
                color: var(--protocolTitle) !important;
                font-weight: bold;
            }
            .icon{
                height: .44rem !important;
                width: .44rem !important;
                background: var(--protocolRadio) !important;
                background-size: contain;
                &.checked{
                    background: var(--protocolRadioChecked) !important;
                    background-size: contain;
                }
            }
        }

        .btn-group{
            .confirm-btn{
                color: var(--protocolConfirmBtn) !important;
            }
        }
    }
    .protocol-detail{
        top: var(--titleBarFillHeight, 0) !important;
    }
    
    @-webkit-keyframes sequenceLoading{
        0%{background-position: 0px 0;}
        100%{background-position: -5400px 0;}    
    }
    @keyframes sequenceLoading{
        0%{background-position: 0px 0;}
        100%{background-position: -5400px 0;}    
    }
    //uni-app的showModal弹窗样式特殊处理
    .uni-modal{
        border-radius: 10px !important;
        .uni-modal__btn{
            font-size: 32rpx;
            &.uni-modal__btn_default{
                color: #999 !important;
            }
            &.uni-modal__btn_primary{
                color: var(--tagColor)!important;
            }
        }
        
    }

    /* 微信浏览器分享提示 start */
    .wx_brower_share_mask {
        width: 750rpx;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.45);
        position: fixed;
        z-index: 99999;
        top: 0;
    }

    ::-webkit-scrollbar {
        display: none;
    }

    scroll-view ::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
        -webkit-appearance: none;
        background: transparent;
    }

    /* #ifdef H5 */
    page {
        width: 750rpx;
        margin: 0 auto;
    }

    /* #endif */

    .wx_brower_share_top_wrap {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: flex-end;
        align-items: flex-start;
        margin-top: 150rpx;
    }

    .wx_brower_share_top_wrap .wx_brower_share_img {
        width: 450rpx;
        height: 150rpx;
        margin-right: 80rpx;
    }

    .share_h5 {
        width: 100% !important;
        height: 100% !important
    }

    uni-image>img {
        opacity: unset;
        object-fit: contain;
    }

    .share_h5_operate_img {
        width: 440rpx !important;
        height: 120rpx !important;
    }

    .share_h5_close_img {
        width: 50rpx !important;
        height: 50rpx !important;
    }

    .share_h5_img_bottom {
        width: 50rpx !important;
        height: 200rpx !important;
    }

    /* 微信浏览器分享提示 end */

    /* #ifdef MP-WEIXIN */
    .ql-container {
        display: flex;
        align-items: center;
        line-height: 62rpx;
    }

    /* #endif */


    .ql-editor {

        p {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            line-height: 62rpx !important;
        }
    }

    .ql-editor.ql-blank::before {
        color: rgba(0, 0, 0, 0.6);
        content: attr(data-placeholder);
        font-style: normal !important;
        pointer-events: none;
        position: absolute;
        line-height: 62rpx !important;
    }

    view,
    scroll-view,
    swiper,
    swiper-item,
    cover-view,
    cover-image,
    icon,
    text,
    rich-text,
    progress,
    button,
    checkbox,
    form,
    input,
    label,
    radio,
    slider,
    switch,
    textarea,
    navigator,
    audio,
    camera,
    image,
    video {
        box-sizing: border-box;
    }

    /* 骨架屏替代方案 */
    .Skeleton {
        background: #f3f3f3;
        padding: 20upx 0;
        border-radius: 8upx;
    }

    /* 图片载入替代方案 */
    .image-wrapper {
        font-size: 0;
        background: #f3f3f3;
        border-radius: 4px;

        image {
            width: 100%;
            height: 100%;
            opacity: 1;           
        }
    }

    .clamp {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: block;
    }

    .common-hover {
        background: #f5f5f5;
    }

    /*边框*/
    .b-b:after,
    .b-t:after {
        position: absolute;
        z-index: 3;
        left: 0;
        right: 0;
        height: 0;
        content: '';
        transform: scaleY(.5);
        border-bottom: 1rpx solid rgba(0, 0, 0, .1);
    }

    /*边框*/
    .b_b:after,
    .b_t:after {
        position: absolute;
        z-index: 3;
        left: 0;
        right: 0;
        height: 0;
        content: '';
        transform: scaleY(.5);
        border-bottom: 1rpx solid rgba(0, 0, 0, .1);
    }

    .b_b:after {
        bottom: 0;
    }

    .b_t:after {
        top: 0;
    }

    .b-b:after {
        bottom: 0;
    }

    .b-t:after {
        top: 0;
    }

    /* button样式改写 */
    uni-button,
    button {
        height: 80upx;
        line-height: 80upx;
        font-size: $font-lg + 2upx;
        font-weight: normal;

        &.no-border:before,
        &.no-border:after {
            border: 0;
        }
    }

    uni-button[type=default],
    button[type=default] {
        color: $font-color-dark;
    }

    /* input 样式 */
    .input-placeholder {
        color: #999999;
    }

    .placeholder {
        color: #949494;
        font-size: 26rpx;
    }

    ::-webkit-scrollbar {
        display: none;
        width: 0;
        height: 0;
        color: transparent;
        display: flex;
        justify-content: center;
    }

    uni-tabbar .uni-tabbar {
        -webkit-box-shadow: 0px 6rpx 40rpx 0px rgba(147,148,159,0.20);
        box-shadow: 0px 6rpx 40rpx 0px rgba(147,148,159,0.20);
        background: #fff !important;
        width: 750rpx !important;
        left: auto !important;
        right: auto !important;
    }

    uni-tabbar {
        right: 0;
        display: flex;
        justify-content: center;
    }

    uni-page-head .uni-page-head {
        width: 750rpx !important;
        left: auto !important;
        right: auto !important;
    }

    uni-page-head {
        display: flex !important;
        justify-content: center;
    }

    body {
    }

    * {
        -webkit-font-smoothing: subpixel-antialiased
    }

    /* 商品详情页 H5 图文详情强制换行处理 start */
    /* #ifdef H5 */
    .detail-desc p {
        word-break: break-all;
    }

    /* #endif */
    /* 商品详情页 H5 图文详情强制换行处理 end */
    .uni-page-head .uni-page-head-ft .uni-page-head-btn .uni-btn-icon {
        font-size: 40rpx;
        margin-right: 15rpx;
    }

    .uni-popup.spec_model.bottom .uni-transition.fade-out {
        width: 750rpx;
        right: 0;
        left: 0;
        margin: 0 auto;
    }

    .uni-picker-container,
    .uni-picker-toggle,
    .uni-picker-toggle {
        width: 750rpx !important;
        left: 0 !important;
        right: 0 !important;
        margin: 0 auto !important;
    }

    .uni-popup .fade-out {
        width: 750rpx;
        margin: 0 auto;
    }

    .select_address .content_view {
        width: 750rpx;
        margin: 0 auto;
    }

    /* 分页loading */
    .loading {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 80rpx;
        font-size: 24rpx;
        color: #999;
    }

    .spinner {
        display: inline-block;
        vertical-align: middle;
        margin-right: 20rpx;
        font-size: 26rpx;
        width: 26rpx;
        height: 26rpx;
        text-align: left;
        border-radius: 50%;
        box-shadow: inset 0 0 0 3rpx rgba(58, 168, 237, .3);
    }

    .spinner text {
        position: absolute;
        clip: rect(0, 26rpx, 26rpx, 13rpx);
        width: 26rpx;
        height: 26rpx;
        animation: spinner-circle-clipper 1s ease-in-out infinite;
        -webkit-animation: spinner-circle-clipper 1s ease-in-out infinite;
    }

    @keyframes spinner-circle-clipper {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(180deg);
        }
    }

    @-webkit-keyframes spinner-circle-clipper {
        0% {
            -webkit-transform: rotate(0deg);
        }

        100% {
            -webkit-transform: rotate(180deg);
        }
    }

    .spinner text:after {
        position: absolute;
        clip: rect(0, 26rpx, 26rpx, 13rpx);
        width: 26rpx;
        height: 26rpx;
        content: '';
        animation: spinner-circle 1s ease-in-out infinite;
        -webkit-animation: spinner-circle 1s ease-in-out infinite;
        border-radius: 50%;
        box-shadow: inset 0 0 0 3rpx #3aa8ed;
    }

    @keyframes spinner-circle {
        0% {
            transform: rotate(-180deg);
        }

        100% {
            transform: rotate(180deg);
        }
    }

    @-webkit-keyframes spinner-circle {
        0% {
            -webkit-transform: rotate(-180deg);
        }

        100% {
            -webkit-transform: rotate(180deg);
        }
    }
    //处理uni.showtoast组件文字显示模糊的问题
    uni-toast .uni-sample-toast{
        transform: none;
        width: 100%;
    }
    uni-toast .uni-simple-toast__text{
        position: relative;
        left: -50%;
        background-color: rgba(0,0,0,.8);
        border-radius: 16rpx;
        font-size: 28rpx;
        min-width: 304rpx;
        max-width: 650rpx;
        font-weight: 400;
        line-height: 40rpx; 
    }
    .h5--showtabbar uni-page-wrapper::after {
        content: "";
        display: block;
        width: 100%;
        height: var(--tabBarHeight, 0px);
    }

    //用样式屏蔽掉uni-app自带的tabbar
    .uni-tabbar-bottom,.uni-tabbar,.uni-tabbar-bottom .uni-placeholder{
        display: none;
    }
</style>