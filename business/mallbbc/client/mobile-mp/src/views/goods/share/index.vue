<template>
    <view>       
        <view v-if="!loading" class="box">
            <view class="goods_wrap">
                <view class="goods">
                    <image v-if="imageSrc" :src="imageSrc" mode="widthFix"></image>
                </view>
            </view>
            <view class="name_wrap">
                <view class="name">
                    <text class="store">{{goodsDetail.storeName}}</text>
                    <text class="skuName">{{goodsDetail.skuName}}</text>
                    <view class="specs" v-if="goodsDetail.specValues">
                        {{goodsDetail.specValues}}
                    </view>
                </view>
            </view>
            <view class="btn_wrap">
                <button class="share_btn" open-type="share">分享商品</button>
            </view>
        </view>
        <!-- 生成微信分享图片image的海报 -->
        <poster 
            v-if="postlist && postlist.length" 
            :list="postlist" 
            background-color="#FFF" 
            :width="400" 
            :height="320"
            ref="poster"
            @on-success="posterSuccess" 
            @on-error="posterError"
        >
        </poster>
    </view>
</template>

<script>
import goodsHandler from '@/views/components/goods/handler'
import shareMixin from '@/common/mixin/share';
import poster from "@/views/components/poster/index.vue"; // 生成海报的组件
import { isNotEmpty } from '@/utils/common.js'
export default {
    mixins: [shareMixin],
    components: {
        poster
    },
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            sku: '', // 商品sku
            goodsDetail: {},
            loading: true,
            imageUrl: '', // 分享卡片图片
            pricePromise: null,
            postlist: [],
            goodsPriceInfo: {}
        }
    },
    computed:{
        imageSrc(){
            return this.goodsDetail?.images?.[0]
        },
        defaultShareImage(){
            try{
                return this.goodsDetail.images[0]
            }catch(e){
                return ''
            }
        },
    },
    mounted() {},
    onShow() {
        this.sku = this.$Route.query.sku;
        this.getGoodsDetail()
    },
    // 设置当前页面分享到朋友
    onShareAppMessage(option) {
        let shareMessage = {
            title: `[好友推荐]${this.goodsDetail.skuName}`,
            path: `/views/goods/detail/index?sku=${this.sku}&storeId=${this.goodsDetail.storeId || ''}`,
            imageUrl: this.imageUrl || this.defaultShareImage
        }
        // 全局混入share.js
        let share = this.setShareAppMessage(shareMessage)
        return share;
    },
    methods: {
        getGoodsDetail(){
            let param = {sku: this.sku}
            goodsHandler.getDetail(param).then(async res => {
                if(res.state == 200 && res.data){
                    this.goodsDetail = res.data
                    // 查询商品价格相关的信息goodsVideo
                    this.pricePromise = this.getGoodsPrice();

                    // 初始化商品详情分享图片的画报
                    await this.$nextTick()
                    this.initPoster();
                } else {
                   uni.showToast({
                        title: res.msg,
                        icon: "none",
                   })
                }
            }).catch(e => {
                console.log(e);
            }).finally(() => {
                setTimeout(() => {
                    this.loading = false
                }, 0)
            })
        },
        
        /*
        * 获取商品价格相关的信息【批量接口】
        */
        getGoodsPrice(){
            return new Promise(resolve => {
                let param = {
                    products: [
                        {
                            sku: this.sku,
                            categoryId1: this.goodsDetail.categoryId1,
                            categoryId2: this.goodsDetail.categoryId2,
                            categoryId3: this.goodsDetail.categoryId3,
                            storeId: this.goodsDetail.storeId,
                        }
                    ]
                }
                this.priceLoading = true;
                goodsHandler.getProductPrice(param).then(res => {
                    if(res.state == 200 && res.data?.products?.length > 0){
                        this.goodsPriceInfo = res.data.products[0];
                    } else {
                    }
                    resolve(true)
                }).catch(e => {
                    console.log(e);
                    resolve(true)
                }).finally(()=>{
                    uni.hideLoading();
                    this.priceLoading = false;
                })
            })
        },

        /***
         * 初始化分享图片
         */
        async initPoster(){
            await this.pricePromise;
            this.postlist = [
                {
                    type: 'image',
                    path: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/share/share_goods_card.png',
                    x: 0,
                    y: 0,
                    width: 400,
                    height: 320
                },
                {
                    type: 'image',
                    // path替换成你自己的图片，注意需要在小程序开发设置中配置域名
                    path: this.defaultShareImage,
                    x: 28,
                    y: 42,
                    width: 160,
                    height: 160
                },
                {
                    type: 'text',
                    x: 224,
                    y: 54,
                    text:'限时特价',
                    size: 25,
                    color: '#000000'
                },
                {
                    type: 'text',
                    x: 218,
                    y: 90,
                    text: isNotEmpty(this.goodsPriceInfo.salePrice)?`￥${this.goodsPriceInfo.salePrice.toFixed(2)}`:'',
                    size: 28,
                    color: '#ed1212'
                },
                ]
        },
        posterError(err) {
            console.log('生成海报失败', err)
            this.imageUrl = this.defaultShareImage;
        },
        posterSuccess(url) {
            // 生成成功，会把临时路径在这里返回
            this.imageUrl = url;
        }
    }
}
</script>

<style scoped lang="scss">
.box {
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 0;
    .goods_wrap{
        width: 100%;
        padding: 32rpx 20rpx 0rpx 20rpx;
        .goods{
            width: 100%;
            background-color: #fff;
            border-radius: 20rpx 20rpx 0 0;
            overflow: hidden;
            padding: 48rpx 48rpx 0;
            image{
                width: 100%;
                border-radius: 8rpx;
            }
            
        }
    }
    .name_wrap{
        width: 100%;
        padding: 0rpx 20rpx;
        .name{
            backdrop-filter: blur(28rpx);
            -webkit-backdrop-filter: blur(28rpx);
            background: rgba(247,255,253,0.50);
            border-radius: 0 0 20rpx 20rpx;
            margin-top: -40rpx;
            padding: 24rpx 36rpx 48rpx 36rpx;
            width: 100%;
            font-size: 32rpx;
            line-height: 48rpx;
            overflow: hidden;
            .store{
                display: flex;
                align-items: center;
                height: 30rpx;
                padding: 0rpx 12rpx;
                background-color: #F30300;
                color: #fff;
                font-size: 20rpx;
                border-radius: 6rpx;
                float: left;
                margin-top: 10rpx;
                margin-right: 10rpx;
            }
        }
        .specs{
            color: #999;
            font-size: 28rpx;
            margin-top: 24rpx;
        }
    }

    .btn_wrap{
        width: 100%;
        padding: 0 74rpx;
        display: flex;
        .share_btn {
            flex: 1;
            width: 100%;
            margin-top: 80rpx;
            padding: 0 54rpx;
            height: 80rpx;
            line-height: 80rpx;
            text-align: center;
            color: #fff;
            border-radius: 44rpx;
            background: #f30300;
            font-size: 30rpx;
        }
    }
}
</style>
