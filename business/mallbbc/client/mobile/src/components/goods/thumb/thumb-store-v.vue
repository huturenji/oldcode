<!-- 
    店铺展示的竖向商品列表
    目前在用的位置包括如下位置：

    1.店铺首页的全部商品
    
-->
<template name="goodsItem">
    <view class="goods_item" @click="goGoodsDetail(goodsItem)">
        <view class="goods-img">
            <imgThumb 
                :imgSrc="goodsItem.mainImage" 
            />
        </view>
        <view class="goodsNameWrap">
            <view class="goods-name">{{goodsItem.skuName}}</view>
        </view>
        <view class="storeInfo">
            <view class="img_container" :style="bgStyle"></view>
            <view class="storeName">{{goodsItem.storeName}}</view>
        </view>
        <view class="bottom_wrap">
            <view class="price num-font">
                <text class="unit">￥</text>
                <text class="price_int">{{$getPartNumber(goodsItem.salePrice,'int')}}</text>
                <text class="price_decimal">{{$getPartNumber(goodsItem.salePrice,'decimal')}}</text>
            </view>
            
            <img v-if="!disabledModule && showCart" class="cart_img" :src="cartIcon" @click.stop="addCart()" />
            
        </view>
    </view>
</template>

<script>
import {
    mapState, mapGetters, mapMutations
} from 'vuex';
import cartMixin from '@/common/mixin/cartMixin'
import imgThumb from "@/components/goods/thumb/imgThumb.vue";
export default {
    name: "thumb-store-v",
    mixins: [cartMixin],
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            icon2:getApp().globalData.imgUrl+'cart/add2.png',
            icon3:getApp().globalData.imgUrl+'common/icon/add.png',
            icon4:getApp().globalData.imgUrl+'common/icon/add3.png',
            icon_url:'',//加车图标
            goods_pic:'' , //商品图片
            goods_sale:'', //销量
            isIos: uni.getSystemInfoSync().platform == 'ios' //是否ios手机
        }
    },
    components: {
        imgThumb
    },
    computed: {
        ...mapState(['userInfo', 'hasLogin']),
        ...mapMutations(['addGoods']),
        ...mapGetters(['disabledModule']),
        cartIcon(){
            switch (this.icon_type){
            case 1:
                return this.imgUrl+'cart/add-cart.png'
            case 2:    
                return this.icon2;
            case 3:
                return this.icon3;
            case 4:
                return this.icon4;
            default:
                return this.imgUrl+'cart/add-cart.png'
            }
        },

        // 默认店铺图片
        defaultStoreImg(){
            return `${this.imgUrl}goods/icon_common_dianpu_nor.svg`
        },

        bgStyle(){
            return {
                'background': `url(${this.goodsItem.storeLogo || this.defaultStoreImg}) top center  / cover no-repeat`,
                'background-size': 'cover'
            }
        }
    },
    props: {
        // 商品item对象
        goodsItem: {
            type: Object,
            value: {}
        },

        // 加入购物车icon的图标样式类别
        icon_type:{
            type:Number
        },

        // 是否显示加入购物车的按钮
        showCart:{
            type: Boolean,
            default: true
        }
    },
    methods: {

        //进入商品详情页
        goGoodsDetail(goodsItem) {
            this.$Router.push({path:'/standard/product/detail',query:{sku:goodsItem.sku}})
        },

        // 加入购物车
        addCart(){
            let that = this;
            this.$addCart({
                goodsItem: this.goodsItem,
                onSuccess(data){
                    that.$emit('onAddedCartSucc',data)
                    // 先把页面数据添加到购物车, 之后再请求接口获取完整数据
                    if (!that.goodsItem.productPrice) {
                        that.goodsItem.productPrice = that.goodsItem.salePrice;
                    }
                    that.addGoods(that.goodsItem)
                }
            })
        }
            
            
    }
}
</script>

<style scoped lang='scss'>
.goods_item{
    margin: 10rpx;
    background: #fff;
    border-radius: 20rpx;
    box-shadow: -2rpx 0rpx 40rpx -4rpx rgba(156,159,169,0.10); 
    overflow: hidden;
    .goods-img{
        width: 100%;
        height: 340rpx;
        overflow: hidden;
        ::v-deep uni-image{
            border-radius: 20rpx 20rpx 0 0 !important;
        }
        ::v-deep img{
            width: 100%;
            height: auto;
            display: block;
        }
    }
    .goodsNameWrap{
            max-height: 0.76rem;
            overflow: hidden;
            margin: 20rpx 0;
        }

    .goodsNameWrap .goods-name{
        width: 100%;
        padding:0 20rpx;
        font-size: 30rpx;
        color: #222222;
        line-height: 126%;
        
        font-weight: bold;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
    }

    .storeInfo{
        margin-top: 16rpx;
        padding: 0 20rpx;
        display: flex;
        align-items: center;
        width: 100%;
        .img_container{
            width: 28rpx;
            height: 28rpx;
            overflow: hidden;
            border-radius: 50%;
            
            img{
                width: 28rpx;
                height: auto;
            }
        }
        .storeName{
            font-size: 26rpx;
            line-height: 36rpx;
            height: 36rpx;
            // flex: 1;

            max-width: 250rpx;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            margin-left: 8rpx;
            color: #a4acb2;
        }
    }

    .bottom_wrap{
        padding:16rpx 20rpx 32rpx 20rpx;
        position: relative;
        display: flex;
        justify-content: space-between;

        .price{
            color: var(--confirmBtnBgColor2);
            .unit{
                letter-spacing: -2px;
                font-size: 32rpx;
            }
            .price_int{
                font-size: 40rpx;
            
            }
            .price_decimal{
                font-size: 40rpx;
                
            }
        }


        .cart_img{
            position: absolute;
            bottom: 26rpx;
            right: 20rpx;
            width: 42rpx;
            height: auto;
        }

    }
}
</style>
