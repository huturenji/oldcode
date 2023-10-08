<template>
    <view>
        <voucherSucess ref="voucherSucess" v-if='state=="SUCESS"' :panelText='text' @goShare="goShare"/>
        <voucherEmpty v-else />
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
import voucherEmpty from '@/components/voucher/voucherEmpty.vue'
import voucherSucess from '@/components/voucher/voucherSucess.vue';
import share from '@/components/share/index.vue'
import shareHandler from '@/utils/shareHandler.js';
import goodsHandler from '@/components/goods/handler';
export default {
    props: {
        
    },
    components: {
        voucherEmpty,
        share,
        voucherSucess
    },
    data(){
        let imgUrl = getApp().globalData.imgUrl;
        return {
            type: this.$Route.query.type, //类型 NORMAL   VOUCHER  FEATHER 
            orderType: this.$Route.query.orderType, //类型 NORMAL   VOUCHER  FEATHER 
            sku: this.$Route.query.skus ,
            state: this.$Route.query.state, //状态 SUCESS 还是  FAILED 
            imgUrl: imgUrl,
            text:{ 
                tips: '下单成功',
                img: imgUrl + 'order/icon_common_success.png',
                btnText:'查看订单',
                type:''
            },
            goodsData: {},
            share_model: false, //分享弹框
            shareOptions:{},//分享所需的参数
            supportTypes:[]//当前渠道下支持的H5 sharetype            
        }
    },
    mounted(){
        this.setText()
    },
    methods: {
        setText(){
            if (this.type=='NORMAL'&&this.state=='SUCESS'){
                this.text = {
                    tips: '下单成功',
                    img: this.imgUrl + 'order/icon_common_success.png',
                    btnText:'查看订单',
                    type:this.type
                }
                if (this.orderType == 106){
                    this.text.isTogetherBuy = true
                    this.text.btnText2='邀请朋友一起买'
                    this.getGoodsDetail()
                }
                document.title = '支付结果'
            } else if (this.type=='VOUCHER'&&this.state=='SUCESS'){
                this.text = {
                    tips: '您的奖品已领取成功',
                    img: this.imgUrl + 'order/icon_common_success.png',
                    btnText:'查看奖品订单',
                    type:this.type
                }
                document.title = '领奖结果'
            } else if (this.type=='FEATHER'&&this.state=='SUCESS'){
                this.text = {
                    tips: '支付成功',
                    info:'朋友无需支付任何费用，快将礼单送出吧！',
                    img: this.imgUrl + 'order/icon_common_success.png',
                    btnText:'',
                    type:this.type
                }
                document.title = '结果'
            } 
        },
        // 跳转鹅毛情页面
        async togiftDetail(){
            let url = `/gift`
            if (this.h5PayBack){
                url += `&redirectTo=${encodeURIComponent('/')}`
            }
            uni.redirectTo({
                url: url
            })
        },
        onPageBack(){
            let back = ()=>{
                let closeTo = this.$Route.query.closeTo;
                if (!!closeTo){
                    sinosdk.sino.back(null, Math.abs(closeTo));
                } else {
                    this.$Router.back(1);
                }
            }
            if (this.type=='NORMAL'||this.type=='VOUCHER'){
                back();

            } else if (this.type=='FEATHER') {
                this.togiftDetail()
            }
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
        }
    }
}
</script>

<style lang="scss" scoped>
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