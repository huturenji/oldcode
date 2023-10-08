<template>
    <view class="simpleDetail" v-if="goodsData">
        <view class="bigImg" :style="'backgroundImage:url('+goodsData.mainImage+')'">
        </view>
        <view class="contentWrap">
            <view class="goods_name">{{goodsData?goodsData.skuName:''}}</view>
            <view class="spec_con">
                <view class="spec_left">
                    <view class="spec_left_title">{{$L('型号：')}}</view>
                    <view class="spec_left_content" v-if="goodsData.specValues">
                        {{goodsData.specValues}}
                    </view>
                    <view class="spec_left_content" v-else>{{$L('默认')}}</view>
                </view>
            </view>
            <template  v-if="attendPromotion">
                <view class="priceWrap">
                    <view class="sell_price num-font" v-if="buyTogetherInfo.promotionPrice">
                        <text class="unit">¥ </text>
                        <text
                            class="price_int">{{$getPartNumber(buyTogetherInfo.promotionPrice,'int')}}</text>
                        <text
                            class="price_decimal">{{$getPartNumber(buyTogetherInfo.promotionPrice,'decimal')}}</text>
                    </view>
                </view>
                <view class="flex_row_between_center" v-show="!!goodsPriceInfo.originalSalePrice">
                    <view v-if="goodsPriceInfo.originalSalePrice" class="originalSale num-font">
                        <view>¥{{goodsPriceInfo.originalSalePrice}}</view>
                    </view>
                    <activeLabel :activeName="'一起买'" :startTime="buyTogetherInfo.startTime" :endTime="buyTogetherInfo.endTime" :distanceEndTime="buyTogetherInfo.distanceEndTime" class="activeLabel"></activeLabel>
                </view>
            </template>

            <template v-else>
                <view class="priceWrap">
                    <view class="sell_price num-font" v-if="goodsPriceInfo.salePrice">
                        <text class="unit">¥ </text>
                        <text
                            class="price_int">{{$getPartNumber(goodsPriceInfo.salePrice,'int')}}</text>
                        <text
                            class="price_decimal">{{$getPartNumber(goodsPriceInfo.salePrice,'decimal')}}</text>
                    </view>
                    <view class="sell_price num-font" v-if="!goodsPriceInfo.salePrice && !priceLoadingState">
                        <text class="unit">¥ </text>
                        <text class="not_price">暂无报价</text>
                    </view>
                </view>
            </template>
        </view>
        <view class="spec_btn">
            <button class="spec_buy_btn spec_btn_only" @click="goShare">{{'邀请朋友一起买'}}</button>
        </view>
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
import share from '@/components/share/index.vue'
import shareHandler from '@/utils/shareHandler.js';
import {
    mapState,
    mapGetters
} from 'vuex';
// 引入客服的功能
//库存状态枚举
import stockEnum from '@/common/lib/enum/stock';
import goodsHandler from '@/components/goods/handler';
import promotionHandler from "@/views/promotion/common/handler";
import { promotionEnum } from '@/common/lib/enum/promotion'
import activeLabel from '@/components/activeLabel/activeLabel.vue';
import pullProdouctPriceMixin from '@/common/mixin/pullProdouctPriceMixin'
export default {
    mixins: [pullProdouctPriceMixin],
    components: {
        share,
        activeLabel
    },
    data() {
        return {
            goodsPriceInfo: {}, //商品价格相关的信息
            isLoading: false,
            priceLoadingState : true, // 避免出现“暂无报价”闪现的问题
            goodsData: null,//商品详情数据
            share_model: false, //分享弹框
            shareOptions:{},//分享所需的参数
            supportTypes:[],//当前渠道下支持的H5 sharetype
            promotionEnum: promotionEnum,//商品参加活动枚举
            promotionId: '', //一起买活动id
            promotionInfo: {},//当前商品参加的一级活动的详情
            buyTogetherInfo:{}
            
        };
    },
    created(){
    },
    computed: {
        ...mapState(['hasLogin', 'userInfo', 'userCenterData', 'cartNum']),
        ...mapGetters(['disabledModule']),
        // 商品的是否参加了活动
        attendPromotion(){
            //天天专场，没有预热。必须满足两个条件 attendPromotion promotionStarted都为true
            return !!this.goodsPriceInfo.attendPromotion ;
        }

    },

    async mounted() {
        this.sku = this.$Route.query.sku;
        this.getGoodsDetail(); // 获取商品详情
        this.source = 3;
    },
    onShow() {
        //页面再次打开时注册转发信息
        if (!!this.goodsData){
            //2022-10-28临时屏蔽商品详情的微信分享
            // this.setThirdShare();
        }
    },
    methods: {

        //获取商品价格相关的信息【批量接口】
        getGoodsPrice(){
            this.priceLoadingState = true;
            return new Promise(resolve => {
                let param = {
                    products: [
                        {
                            sku: this.sku,
                            categoryId1: this.goodsData.categoryId1,
                            categoryId2: this.goodsData.categoryId2,
                            categoryId3: this.goodsData.categoryId3,
                            storeId: this.goodsData.storeId
                        }
                    ]
                }
                goodsHandler.getProductPrice(param).then(res => {
                    if (res.state == 200 && res.data?.products?.length > 0){
                        let list = res.data.products                    
                        this.goodsPriceInfo = list[0];
                    }
                    this.priceLoadingState = false;
                    resolve(true)
                }).catch(e => {
                    console.log(e);
                    resolve(true)
                })
            })
        },
        valiInfo(info) {
            return JSON.stringify(info) != '{}'
        },
        //获取商品参加活动相关的列表
        getActivityList(){
            let param = {
                sku: this.sku,
                specialofferState:3,
                disocuntState:2,
                storeId: this.goodsData.storeId
            }
            promotionHandler.getPromotionList(param).then(res => {
                if (res.state == 200 && res.data?.activityList){
                    if (res.data.activityList.length > 0){
                        // 整合一级活动详情数据 
                        let oneLevelList = res.data.activityList.filter(item => {
                            return item.promotionGrade == 1
                        });
                            // 经与服务端人员沟通，一个商品只能参加一个以及活动，所以如果商品参加了一级活动有且只有一条一级活动数据【一级活动目前包括： 秒杀 拼团 阶梯团 预售 一起买】
                        if ( oneLevelList.length > 0){
                            this.promotionInfo = oneLevelList[0];
                            this.getPromotionInfo();
                        }
                    }
                }
            })

        },
        //整合活动详情相关的数据
        getPromotionInfo(){
            let promotionId = this.promotionInfo.promotionId; //活动id
            if (promotionId && this.promotionInfo.promotionType == this.promotionEnum.ECBUY.type) {
                this.promotionId = this.promotionInfo.promotionId;
                this.getEcbuy()
            } else {
                this.buyTogetherInfo = {}
            }
        },

        //获取活动详情
        getEcbuy() {
            let param = {};
            param.stageId = this.promotionInfo?.stageId;
            param.promotionId = this.promotionInfo?.promotionId;
            param.sku = this.sku;
            promotionHandler.getBuyTogether(param).then(res => {
                if (res.state == 200) {
                    let result = res.data;
                    this.buyTogetherInfo = result;
                } else {
                    this.$api.msg(res.msg);
                }
            })
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
                        this.getGoodsPrice();
                        // 查询商品参加活动相关的信息
                        this.getActivityList();
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
                imgUrl : this.goodsData.images[0] || require('../../../static/shared/user/logo.png'), // 分享图标,图片绝对地址  
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
                imgUrl: this.goodsData.images[0] || require('../../../static/shared/user/logo.png') // 分享图标,图片绝对地址 
            }
            //设置二次分享
            shareHandler.setThirdShareInfo(shareInfo);
            // #endif
        },
        //去分享
        goShare() {
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
        //关闭分享弹框
        closeShareModel() {
            this.share_model = false;
            this.showWeiXinBrowerTip = false;
            this.poster = false;
        },
        //去商品详情页面
        goGoodsDetail(sku) {
            this.$Router.push({
                path: '/standard/product/detail',
                query: {
                    sku: sku
                }
            })
        },
        // 获取商品的库存状态
        getListStock(currentSpecNum) {

            let that = this;
            return new Promise((resolve, reject) => {
                if (!!this.choosedAddress.provinceCode && !!this.choosedAddress.cityCode && !!this.choosedAddress.districtCode){
                    goodsHandler.checkStock({
                        skuInfos:[{
                            sku: this.sku,
                            num: currentSpecNum
                        }],
                        provinceCode: this.choosedAddress.provinceCode,
                        cityCode: this.choosedAddress.cityCode,
                        districtCode: this.choosedAddress.districtCode,
                        townCode: this.choosedAddress.townCode
                    }).then(res=>{
                        if (res.state == 200 && res.data && res.data.skuStockList && res.data.skuStockList.length > 0){
                            try {
                                that.hasStock = stockEnum[res.data.skuStockList[0].stockState].hasStock;
                                resolve(that.hasStock);
                            } catch (error) {
                                resolve(true);
                            }
                        }
                    }).catch(() => {
                        reject(false)
                    })
                }
            })
        },

        // 获取商品的区域限售状态
        getListAreaLimit() {
            if (!!this.choosedAddress.provinceCode && !!this.choosedAddress.cityCode && !!this.choosedAddress.districtCode){
                goodsHandler.checkAreaPurchase({
                    skus:[this.sku],
                    provinceCode: this.choosedAddress.provinceCode,
                    cityCode: this.choosedAddress.cityCode,
                    districtCode: this.choosedAddress.districtCode,
                    townCode: this.choosedAddress.townCode
                }).then(res=>{
                    if (res.state == 200 && res.data && res.data.skuPurchaseList && res.data.skuPurchaseList.length > 0){
                        try {
                            this.areaLimit = res.data.skuPurchaseList[0].canPurchase;
                            if (!!this.areaLimit){
                                // 更新商品的运费
                                this.getUserEx();
                            }
                        } catch (error) {

                        }
                    }
                })
            }
        }
    }
}
</script>

<style lang='scss'>
    page {
        background: $bg-color-split;
        width: 750rpx;
        margin: 0 auto;
    }
    .simpleDetail{
        padding: 20rpx;
        .bigImg{
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
            height: 624rpx;
            border-radius: 20rpx 20rpx 0 0;
            overflow: hidden;
        }
        .contentWrap{
            background: #FFFFFF;
            padding: 24rpx 36rpx 36rpx;
            border-radius: 0 0 20rpx 20rpx;
            .activeLabel {
                width: fit-content;
            }
            .goods_name {
                font-size: 32rpx;
                font-weight: 600;
                color: #222222;
                line-height: 150%;
                word-break: break-word;
                user-select: text;
                word-break: break-all;
                text-align: justify;
                min-height: 48rpx;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
            }
            .goods_productId{
                font-size: 24rpx;
                
                font-weight: 400;
                color: #a4acb2;
                line-height: 40rpx;
                padding: 0 20rpx 0 0;
                width:fit-content;
            }
            .priceWrap {
                display: flex;
                flex-direction: column;
                padding-top: 10rpx;
                .sell_price {
                    color: #222;
                    font-weight: normal;
                    .unit {
                        font-size: 28rpx;
                    }
                    .price_int {
                        font-size: 40rpx;
                        line-height: 48rpx;
                        margin-left: 4rpx;
                    }
                    .price_decimal {
                        font-size: 28rpx;
                    }
                }
                .original_price {
                    padding-top: 4rpx;
                    color: #a4acb2;
                    font-size: 24rpx;
                    line-height: 28rpx;
                    text-decoration: line-through;
                }
            }
            .originalSale{
                color: #999;
                font-size: 26rpx;
                text-decoration:line-through;
            }
            .spec_con {
                background: #FFFFFF;
                padding-top: 4rpx;
                .spec_left {
                    display: flex;
                    align-items: center;
                    box-sizing: border-box;
                    display: flex;
                    align-items: center;
                    .spec_left_title {
                        font-size: 28rpx;
                        
                        font-weight: 400;
                        color: #999999;
                        line-height: 48rpx;
                    }
                    .spec_left_content {
                        flex: 1;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        word-break: break-all;
                        font-size: 28rpx;
                        
                        font-weight: 500;
                        color: #999999;
                    }
                }
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
        .spec_btn {
            position: fixed;
            width:750rpx;
            margin:0 auto;
            left: 0;
            right: 0;
            bottom: 0;
            padding: 32rpx 30rpx calc(32rpx + var(--safe-area-inset-bottom));
            .spec_buy_btn {
                border-radius: 80rpx;
                text-align: center;
                line-height: 80rpx;
                height: 80rpx;
                background: var(--confirmBtnBgColor2);
                font-size: 30rpx;
                
                font-weight: 700;
                color: var(--confirmBtnTextColor);
                text-align: center;
            }
        }
    }
</style>
