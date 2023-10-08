<!-- 支付页面 -->
<template>
    <view>
        <cash-register ref='cashRegister' @load='onPayLoad' @changeState='changeState' @openResultPanel='openResultPanel' @getPayInfo="getPayInfo" @failInfo="updateFailInfo">
        </cash-register>
        <resultPanel ref='resultPanel' :panelText='text' :operationStage='operationStage' @change='onResultPopChange'>
            <template #btnGroup v-if="text.showBtn">
                <view class="btn cursorp" v-if='payFailed' @click='rePay'>重新支付</view>
                <view v-else-if="!payFailed && isTogetherBuy" class="together_buy">
                    <view class="btn_share_buy cursorp" @click='goShare'>邀请朋友一起买</view>
                    <view class="btn_view_order cursorp" @click='toOrderDetail'>查看订单</view>
                </view>
                <view class="btn cursorp" v-else @click='toOrderDetail'>查看订单</view>
            </template>
        </resultPanel>
        <!-- 分享弹框 start -->
        <view class="share_model" v-if="share_model" @touchmove.stop.prevent="moveHandle">
            <view class="bizmateshareWrap">
                <share @close="share_model=false" :shareOptions="shareOptions" :supportTypes="supportTypes"></share>
            </view>
        </view>
        <!-- 分享弹框 end -->        
    </view>
</template>
<script>
import cashRegister from './components/cashRegister'
import resultPanel from './components/resultPanel'
import share from '@/components/share/index.vue'
import shareHandler from '@/utils/shareHandler.js';
import goodsHandler from '@/components/goods/handler';
export default {
    components: {cashRegister, resultPanel, share},
    data(){
        let imgUrl = getApp().globalData.imgUrl;
        return {
            sinoPayInstance: null,
            operationStage: null,
            resultPopState: false,//结果弹窗的状态（打开/关闭）
            loadingTimer: null,
            imgUrl: imgUrl,
            text: {
                body: '付款确认中，请稍候', 
                tip: '',
                img: imgUrl + 'loading/icon_common_bprocess.png',
                class: 'loading-icon',
                icon: null
            },
            isTogetherBuy:false,//是否一起买的订单
            goodsData: {},
            share_model: false, //分享弹框
            shareOptions:{},//分享所需的参数
            supportTypes:[],//当前渠道下支持的H5 sharetype
            failInfo: '' //失败原因
        }
    },
    computed: {
        payFailed(){
            return this.operationStage == window.sinopay.OPERATION_STAGE.FAILED
        }
    },
    onShow() {
        //页面再次打开时注册转发信息
        if (!!this.goodsData.sku){
            //2022-10-28临时屏蔽商品详情的微信分享
            // this.setThirdShare();
        }
    },   
    methods: {
        onPayLoad(sinoPayInstance){
            this.sinoPayInstance = sinoPayInstance
        },
        /**
         * 支付状态变化时，切换结果面板的文字信息
         */
        changeState(value){
            let that = this;
            this.operationStage = value;
            switch (value){
            case window.sinopay.OPERATION_STAGE.FAILED:
                this.stopTimeout();
                document.title = '结果'
                this.text = {body: '支付失败', img: this.imgUrl + 'order/icon_common_failure.png', class: 'failed', showBtn: true, tip: that.failInfo};
                break;
            case window.sinopay.OPERATION_STAGE.SUCCESS:      
                this.stopTimeout();
                document.title = '结果' 
                this.text = {body: '支付成功', img: this.imgUrl + 'order/icon_common_success.png', class: 'success', showBtn: true};  
                break;
            case window.sinopay.OPERATION_STAGE.END: //目前只有公款转账有这个状态，因此直接用这个判断这个状态并做处理。否则应区分具体支付类型       
                this.toOrderDetail();//公款转账提交成功后直接去订单详情
                break;    
            default:
                //每次变化时都重置定时器
                this.stopTimeout();
                this.loadingTimer = setTimeout(() => {
                    //双重保障，支付终结态了一定不能再更改状态
                    if (this.operationStage == window.sinopay.OPERATION_STAGE.SUCCESS || this.operationStage == window.sinopay.OPERATION_STAGE.FAILED){
                        return;
                    }
                    that.text = {
                        body: '正在查询您的付款结果，请稍候', 
                        tip: '如确认付款成功，请5分钟后刷新订单详情',
                        img: this.imgUrl + 'loading/icon_common_bprocess.png',
                        class: 'loading-icon',
                        showBtn: true
                    }
                }, 10*1000);
                this.text = {
                    body: '付款确认中，请稍候', 
                    img: this.imgUrl + 'loading/icon_common_bprocess.png',
                    class: 'loading-icon'
                }
                break;
            }
        },
        updateFailInfo(tips){
            this.failInfo = tips;
        },
        stopTimeout(){
            clearTimeout(this.loadingTimer);
            this.loadingTimer = null;
        },
        /**
         * 跳转订单详情
         */
        async toOrderDetail(){
            //微信H5支付的结果页有3个历史栈，因此此时不能直接返回历史。按时间顺序分别是： 支付列表->支付列表（微信重定向回来）->订单列表/详情（下面的目标页）
            //orderSnList.length大于1时，说明是多店铺订单，此时应该回到订单列表（因为支付后的orderSn只能查到其中一个店铺的商品）
            // 2022/06/15 禅道需求 40376 前端开发-统一处理支付成功后，“查看订单”按钮跳转到订单列表页面
            // if(!!this.orderSn && this.payInfo.orderSnList.length==1){
            //     let url = `/pages/order/detail?orderSn=${this.orderSn}`
            //     if(this.h5PayBack){
            //         let tabbarHomePage = await this.getTabbarHomePage();
            //         let secondPath = `/pages/order/list?state=0&redirectTo=${tabbarHomePage}`
            //         url += `&redirectTo=${encodeURIComponent(secondPath)}`
            //     }
            //     uni.redirectTo({
            //         url: url
            //     })
            // }else{
            let url = `/pages/order/list?state=0`
            if (this.h5PayBack){
                url += `&redirectTo=${encodeURIComponent('/')}`
            }
            uni.redirectTo({
                url: url
            })
            // }
        },
        /**
        * 获取tabbar首页（调用逻辑暂未使用）
        */
        getTabbarHomePage(){
            return new Promise((resolve)=>{
                window.onTabBarLoad?.then(bar=>{
                    let homePage = bar.getHomePage();
                    resolve(homePage)
                })  
            })
        },
        /**
         * 打开支付结果面板
         */
        openResultPanel(){
            this.$refs.resultPanel.open();
        },
        /**
         * 切换支付结果面板显示状态
         */
        onResultPopChange(show){
            this.resultPopState = show;
        },
        /**
         * 重新支付
         */
        rePay(){
            this.$refs.resultPanel.close();
        },
        /**
         * 注册app刷新事件
         */
        refresh(){
            //弹出支付结果时，页面不做reload
            return !this.resultPopState;
        },
        /**
         * 覆盖页面回退事件
         */
        onPageBack(){
            //如果H5支付正在进行，则先关闭H5支付
            if (this.sinoPayInstance.isOnH5Pay()){
                this.sinoPayInstance.closeH5Pay();
                return;
            }
            let back = ()=>{
                let closeTo = this.$Route.query.closeTo;
                if (!!closeTo){
                    sinosdk.sino.back(null, Math.abs(closeTo));
                } else {
                    this.$Router.back(1);
                }
            }
            if (this.operationStage == window.sinopay.OPERATION_STAGE.SUCCESS || this.operationStage == window.sinopay.OPERATION_STAGE.FAILED){
                back();
                return;
            }
            uni.showModal({
                content: '确认离开支付页面？',
                cancelText: '确认离开',
                confirmText: '继续支付',
                success: res => {
                    if (res.cancel) {
                        back();
                    }
                }
            })
        },
        /**
         * 邀请朋友一起买
         */
        goShare(){
            // 调用APP分享
            //2022-10-28临时屏蔽商品详情的微信分享
            this.share_model = true;
            // sinosdk.sino.sharePanel({}).then((res)=>{
            //     if (res.ret == "404"){
            //         this.supportTypes = res?.responseData?.enableTypes;
            //         this.share_model = true;
            //     }
            // }).catch((err) => {
            //     console.log(err);
            //     this.share_model = true;
            // });           
        },
        //获取商品详情信息
        getGoodsDetail() {
            uni.showLoading();
            return new Promise((resolve)=>{
                goodsHandler.getDetail({
                    sku: this.sku //货品sku
                }).then(async res => {
                    if (res.state == 200) {
                        this.isLoading = true;
                        uni.hideLoading();
                        this.goodsData = res.data; //详情信息
                        this.setShareInfo();
                        //2022-10-28临时屏蔽商品详情的微信分享
                        // this.setThirdShare();
                        resolve(res.state)
                        // 查询商品价格相关的信息
                        // this.getGoodsPrice();
                        // // 查询商品参加活动相关的信息
                        // this.getActivityList();
                    } else if (res.state==300){
                        //错误提示
                        this.errorMsg = '商品已下架';
                        setTimeout(function(){
                            this.$api.msg('商品已下架');
                        }.bind(this),1000)
                    } else {
                        this.errorMsg = res.msg;
                        setTimeout(function(){
                            this.$api.msg(res.msg);
                        }.bind(this),1000)
                    }
                    resolve(res.state);
                }).finally(()=>{
                    uni.hideLoading();
                })
            })
        },

        /**
         * 处理分享所需数据
         */
        async setShareInfo(){
            let that = this;
            if (!!!this.goodsData.sku){ return } //等有数据了，才能去分享
            let location = window.location;
            let callBackUrl = location.origin+location.pathname+'#/standard/product/detail?sku='+this.goodsData.sku;
            let appInfo = {};
            try {
                appInfo = await shareHandler.getAppConfig();
            } catch (error) {
            }
            let appId = appInfo.appId || '268435729';
            let appName = '比N家';
            that.shareOptions = {
                title : this.goodsData.skuName, // 分享标题
                desc : '我在商城发现不错的商品，点击查看', // 分享描述
                link : callBackUrl, // 分享链接
                imgUrl : this.goodsData.images[0] || require('../../static/shared/user/logo.png'), // 分享图标,图片绝对地址  
                appId: appId+'',//小应用Id
                appName: appInfo.appName || appName || '比N家',//小应用名字,无合法appId时使用appName
                contentType : 'link' // 分享类型,music、video或link，不填默认为link
            }
        },

        /**
         * setThirdShare
         */
        setThirdShare(){
            // #ifdef H5
            //设置第三方（微信、朋友圈等）分享信息
            let location = window.location;
            let callBackUrl = location.origin+location.pathname+'#/standard/product/detail?sku='+this.goodsData.sku;
            let shareInfo = {
                title:this.goodsData.skuName, // 分享标题
                desc:'我在商城发现不错的商品，点击查看', // 分享描述
                link:callBackUrl, // 分享链接
                imgUrl: this.goodsData.images[0] || require('../../static/shared/user/logo.png') // 分享图标,图片绝对地址 
            }
            //设置二次分享
            shareHandler.setThirdShareInfo(shareInfo);
            // #endif
        },
        // 获取支付信息，里面包含一起买的订单信息
        getPayInfo(data) {
            if (data && data.orderType == 106) {
                //当前订单是 一起买
                this.isTogetherBuy = true;
                this.sku = this.$Route.query.skus;
                this.sku && this.getGoodsDetail(); // 获取商品详情
            }
        }     
    }
}
</script>
<style lang="scss" scoped>
page {
    width: 750rpx;
    margin: 0 auto;
}

.btn{
    position: absolute;
    left: 30rpx;
    right: 30rpx;
    top: 50%;
    transform: translateY(-50%);
    height: 88rpx;
    line-height: 88rpx;
    font-size: 30rpx;
    text-align: center;
    border-radius: 40rpx ;
    color: var(--payendBtntxtcolor1);
    background: var(--payendBtnbgcolor1);    
}
.together_buy{
    padding: 80rpx 20rpx 0 20rpx;
    display: flex;
    justify-content: space-between;
    height: 160rpx;
    .btn_share_buy{
        width: 96%;
        text-align: center;
        height: 80rpx;
        line-height: 80rpx;
        border-radius: 40rpx;
        font-size: 30rpx;
        font-weight: bold;
        cursor: pointer;
        margin: 0 6rpx;
        background: var(--payendBtnbgcolor2);
        color: var(--payendBtntxtcolor2);
        border: 2rpx solid var(--payendBtntxtcolor2);
    }
    .btn_view_order{
        padding: 0 34rpx;
        text-align: center;
        color: var(--payendBtntxtcolor3);
        background: var(--payendBtnbgcolor3);    
        width: 96%;
        height: 80rpx;
        line-height: 80rpx;
        border-radius: 40rpx;
        font-size: 30rpx;
        font-weight: bold;
        cursor: pointer;
        margin: 0 6rpx;
    }
}

.share_model {
    width: 750rpx;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
    background: rgba(0, 0, 0, 0.6);
    z-index: 999;
}
.bizmateshareWrap{
    position: absolute;
    left: 0;
    right:0;
    bottom: 0;
}
</style>