<!-- 支付页面 -->
<template>
    <view>
        <cash-register v-if="showCashregister" ref='cashRegister' @load='onPayLoad' @changeState='changeState' @openResultPanel='openResultPanel' @getPayInfo="getPayInfo" />
        <resultPanel ref='resultPanel' :panelText='text' :operationStage='operationStage' @change='onResultPopChange'>
            <template #present v-if="text.showBtn">
                <view class="present" v-if='paySuccess'>
                    <!-- 鹅毛情支付成功分享微信好友收礼的人的时候，选择的礼物卡片列表 -->
                    <presentCard ref="presentCard" @choose="choose" @viewMore="viewMore"/>
                </view>
            </template>
            
            <template #btnGroup v-if="text.showBtn">
                <view class="btn cursorp" v-if='payFailed' @click='rePay'>重新支付</view>
                <view v-else class="btnGroup">
                    <!-- 暂时屏蔽掉该按钮 2022-09-24 -->
                    <!-- <view>
                        <view @click="toOrderDetail">返回鹅毛情首页</view>
                    </view> -->
                    <view v-if="paySuccess">
                        <btnFactory :btnInfo="{ type: 'weixin' }" :info="giftInfo" :otherProps="{ choosedCardIndex }"></btnFactory>
                        <btnFactory :btnInfo="{ type: 'bizmate' }" :info="giftInfo" :otherProps="{ choosedCardIndex }"></btnFactory>
                    </view>
                </view>
            </template>
        </resultPanel>

        <!-- 分享弹框 start -->
        <view class="share_model" v-if="share_model" @touchmove.stop.prevent="()=>{}">
            <view class="bizmateshareWrap">
                <share @close="share_model=false" :shareOptions="shareOptions" :supportTypes="supportTypes" :showCopy="false"></share>
            </view>
        </view>
        <!-- 分享弹框 end -->
    </view>
</template>
<script>
import cashRegister from './components/cashRegister'
import resultPanel from './components/resultPanel'
import presentCard from '@/components/gift/presentCard'
import btnFactory from "@/components/button/btnFactory.vue";
import share from '@/components/share/index.vue';
import { getEmaoqingShareInfo } from '@/views/gift/common/lib/until';
import { isNotEmpty } from '@/utils/common.js'

export default {
    components: {cashRegister, resultPanel, btnFactory, share, presentCard},
    data(){
        let imgUrl = getApp().globalData.imgUrl;
        return {
            resultPopState: false,//结果弹窗的状态（打开/关闭）
            operationStage: null,
            loadingTimer: null,
            imgUrl: imgUrl,
            text: {
                body: '付款确认中，请稍候', 
                tip: '',
                img: imgUrl + 'loading/icon_common_bprocess.png',
                class: 'loading-icon',
                icon: null
            },
            share_model: false, //分享弹框控制
            shareOptions: {}, //分享所需的参数
            supportTypes: ['bizmate'], //当前渠道下支持的H5 sharetype
            giftInfo: {
                featherId: this.$Route.query.featherId
            },
            leftTime: '24小时',
            choosedCardIndex: 0 //当前选择的图片封面
        }
    },
    computed: {
        payFailed() {
            return this.operationStage == window.sinopay.OPERATION_STAGE.FAILED
        },
        paySuccess() {
            return this.operationStage == window.sinopay.OPERATION_STAGE.SUCCESS
        },
        showCashregister(){
            return !isNotEmpty(window.featherPayResult);
        }
    },
    onShow() {  
        //监听按钮事件,先取消再监听，避免多次监听导致触发多次
        uni.$off('giftShare', this.setShareInfo);
        uni.$on('giftShare', this.setShareInfo);
    },
    mounted(){
        // 为了修复bug74870 【pro-鹅毛情】伴正事用鹅毛情支付完成之后再支付完成页面会重新弹出支付窗口【该bug描述很清楚，即移动端微信支持成功后，点击贺卡的查看更多，再点击单个的贺卡，此时，页面重新展示了支付列表，会出问题】
        // 本质上的问题是因为微信支付是H5支付，前端重新location.href了，这样就导致了 从微信h5回来之后，页面重新reload了 会重新走mounted
        this.initFeatherPayResult()
    },
    onHide(){
        //取消监听，避免多页面监听导致触发多次
        uni.$off('giftShare', this.setShareInfo);
    },
    methods: {
        initFeatherPayResult(){
            if(isNotEmpty(window.featherPayResult)){
                this.changeState(window.sinopay.OPERATION_STAGE.SUCCESS);
                this.openResultPanel();
                setTimeout(()=>{
                    try {
                        console.log('window.featherPayResult', window.featherPayResult);
                        this.$refs.presentCard.choosePresent(window.featherPayResult);
                    } catch (error) {
                        console.log('error', error);
                    }
                    window.featherPayResult = null;
                }, 200)
            }
        },
        viewMore(){
            // window.featherPayResult的值用来记录当前选中的卡片的索引index
            window.featherPayResult = 0;
        },
        choose(index){
            this.choosedCardIndex = index;
        },
        onPayLoad(sinoPayInstance) {
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
                this.text = {body: '支付失败', img: this.imgUrl + 'order/icon_common_failure.png', class: 'failed', showBtn: true};
                break;
            case window.sinopay.OPERATION_STAGE.SUCCESS:      
                this.stopTimeout();
                document.title = '结果' 
                this.text = {
                    body: '支付成功',
                    tip: `朋友无需支付任何费用，快将礼单送出吧！`,
                    img: this.imgUrl + 'order/icon_common_success.png',
                    class: 'success',
                    showBtn: true
                }
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
        stopTimeout(){
            clearTimeout(this.loadingTimer);
            this.loadingTimer = null;
        },
        /**
             * 跳转鹅毛情页面
             */
        async toOrderDetail(){
            let url = `/gift`
            if (this.h5PayBack){
                url += `&redirectTo=${encodeURIComponent('/')}`
            }
            uni.redirectTo({
                url: url
            })
        },
        openResultPanel(){
            this.$refs.resultPanel.open();
        },
        /**
         * 重新支付
        */
        rePay(){
            this.$refs.resultPanel.close();
        },
        onResultPopChange(e){
            this.resultPopState = e.show;
        },
        refresh(){
            //弹出支付结果时，页面不做reload
            return !this.resultPopState;
        },
        /**
         * 覆盖页面回退事件
         * 无论是否支付成功都返回鹅毛情首页
        */
        onPageBack(){
            //如果H5支付正在进行，则先关闭H5支付
            if (this.sinoPayInstance.isOnH5Pay()){
                this.sinoPayInstance.closeH5Pay();
                return;
            }
            if (this.operationStage == window.sinopay.OPERATION_STAGE.FAILED || this.operationStage == window.sinopay.OPERATION_STAGE.SUCCESS) {
                this.toOrderDetail()
                return;
            }

            uni.showModal({
                content: '确认离开支付页面？',
                cancelText: '确认离开',
                confirmText: '继续支付',
                success: res => {
                    if (res.cancel) {
                        this.toOrderDetail()
                    }
                }
            })
        },
        // 获取支付信息，里面包含鹅毛情分享信息
        getPayInfo(data) {
            if (data.orderSourceInfo && data.orderSourceInfo.orderSource === 'FEATHER') {
                // this.giftInfo.featherId = data.orderSourceInfo.orderSourceId
                this.leftTime = data.orderSourceInfo.expiredToReceive
            }
        },
        /**
         * 处理分享所需数据
         * @param number featherId
         */
        async setShareInfo(featherId){
            let that = this;
            try {
                that.shareOptions = await getEmaoqingShareInfo(featherId);
                that.share_model = true;
            } catch (error) {
                console.log('分享失败',error)
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
.pay-result-container {
    position: relative;
    height: 100%;
    background: #fff;
    .content{
        height: 100%;
        display: flex;
        flex-direction: column;
        text-align: center;

        .top{
            margin-top: calc(var(--titleBarFillHeight, 0px) + 128rpx);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        .icon{
            display: flex;
            align-items: center;
            justify-content: center;
            width: 120rpx;
            height: 120rpx;

    
            img{
                width: 100%;
                height: 100%;
            }

            &.success{
                color: #23cda7;
            }

            &.failed{
                color: #ff4e3a;
            }

            &.loading-icon{
                border-radius: 60rpx;
                background-color: #F6F9FD;
                img{
                    animation: cricelLoading 1s steps(12, end) infinite;
                    width: 64rpx;
                    height: 64rpx;
                }
            }
        }
        .label{
            color: #222;
            font-size: 36rpx;
            font-weight: bold;
            margin-top: 56rpx;
        }

        .btn{
            position: absolute;
            left: 30rpx;
            right: 30rpx;
            top: 50%;
            transform: translateY(-50%);
            background: #E82B29;
            height: 88rpx;
            line-height: 88rpx;
            font-size: 30rpx;
            text-align: center;
            color: #fff;
            border-radius: 20rpx;
        }
    }

    @-webkit-keyframes cricelLoading {
        0% {
            transform: rotate3d(0,0,1,0deg);
        }
        100% {
            transform: rotate3d(0,0,1,360deg);
        }
        }
        @keyframes cricelLoading {
        0% {
            transform: rotate3d(0,0,1,0deg);
        }
        100% {
            transform: rotate3d(0,0,1,360deg);
        }
    }
}

.result-popup{
    ::v-deep uni-view.uni-transition{
        top: 0;
    }
    ::v-deep .uni-popup__wrapper-box{
        bottom: 0;
        height: 100%;
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

::v-deep .info {
    margin-top: 28rpx !important;
    padding: 0 100rpx;
    font-size: 28rpx;
    color: #999;
}

.btnGroup {
    padding: 160rpx 40rpx 0 40rpx;
    display: flex;
    justify-content: space-between;
    height: 160rpx;

    > view {
        flex: 1;
        display: flex;
        justify-content: space-between;
        ::v-deep .btnFactory{
            flex: 1
        }
        ::v-deep .btn-weixin{
            width: 96%;
            text-align: center;
            height: 80rpx;
            line-height: 80rpx;
            border-radius: 20rpx;
            font-size: 30rpx;
            font-weight: bold;
            cursor: pointer;
            margin: 0 auto !important;
            background: #fff;
            color: #f30300;
            border: 2rpx solid #f30300;
            display: flex;
            align-items: center;
        }
        ::v-deep .btn-bizmate{
            width: 96%;
            text-align: center;
            height: 80rpx;
            line-height: 80rpx;
            display: flex;
            align-items: center;
            border-radius: 20rpx;
            font-size: 30rpx;
            font-weight: bold;
            cursor: pointer;
            margin: 0 auto !important;
        }

    }
}
.present{
    margin-top: 80rpx;
}
</style>