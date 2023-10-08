<!-- 商品组件：横向展示，一行一个，商品列表页面
    点击进入商品详情页
    加入购物车事件
-->
<template name="goodsCollectItemH">
    <view class="goods_h_item flex_row_start_start" @click="goGoodsDetail(goodsItem)">
        <view class="goods-img" :style="{backgroundImage: 'url('+(goodsItem.mainImage)+')'}"></view>
        <view class="right flex_column_between_start">
            <view class="top flex_column_start_start" style="width: 100%;">
                <view class="goods-name">{{goodsItem.skuName}}</view>
                <text class="goods-brief">{{goodsItem.goodsBrief}}</text>
            </view>
            
            <view class="bottom flex_column_start_between">
                <view class="goods-price flex_row_start_center">
                    <view class="left">
                        <view class="num-font">
                            <text class="unit">￥</text>
                            <text class="price_int">{{$getPartNumber(goodsItem.salePrice,'int')}}</text>
                            <text class="price_decimal">{{$getPartNumber(goodsItem.salePrice,'decimal')}}</text>
                        </view>
                    </view>
                </view>
            </view>
            <!-- 加入购物车 -->
            <img v-if="!disabledModule && showCart" class="cart_img" :src="cartIcon" @click.stop="addCart()" />
        </view>
    </view>
</template>

<script>
import {mapState, mapGetters, mapMutations} from 'vuex';
import cartMixin from '@/common/mixin/cartMixin'
export default {
    name: "thumb-store-h",
    mixins: [cartMixin],
    components: {
            
    },
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl
        }
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
        }
    },
    props: {
        goodsItem: {
            type: Object,
            value: {}
        },
        // 是否显示加入购物车的按钮
        showCart:{
            type: Boolean,
            default: true
        }
    },
    created() {

    },
    methods: {
        //进入商品详情页
        goGoodsDetail(goodsItem) {
            this.$Router.push({
                path: '/standard/product/detail',
                query: {
                    sku: goodsItem.sku
                }
            })
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

<style lang='scss'>
    .goods_h_item {
        width: 100%;
        background: #fff;
        padding: 20rpx;
        overflow: hidden;
        background: #fff;
        border-top: 1rpx solid #f5f5f5;
        /* &:first-child {
            padding-top: 20rpx;
        } */

        .goods-img {
            background-size: cover;
            background-position: center center;
            background-repeat: no-repeat;
            width: 290rpx;
            height: 290rpx;
            overflow: hidden;
            border-radius: 16rpx;
            background-color: #F8F6F7;
            flex-shrink: 0;
        }

        .right {
            height: 290rpx;
            padding: 10rpx 0 0rpx;
            width: 420rpx;
            padding-left: 20rpx;
            position: relative;
        }

        .goods-name {
            font-size: 28rpx;
            color: $com-main-font-color;
            line-height: 135%;
            min-height: 76rpx;
            overflow: hidden;
            font-weight: bold;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            word-break: break-all;
        }

        .goods-brief {
            color: $main-third-color;
            font-size: 22rpx;
            margin-top: 10rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 100%;
        }

        .goods-price {
            width: 100%;
            margin-bottom: 6rpx;

            .left {
                color: var(--confirmBtnBgColor2);
            

                .unit{
                    letter-spacing: -2px;
                    font-size: 32rpx;
                }

                .price_int,
                .price_decimal {
                    font-size: 40rpx;
                    
                }

                .sales {
                    color: $main-third-color;
                    font-size: 22rpx;
                    margin-left: 26rpx;
                    margin-top: 2rpx;
                }
            }

            image {
                width: 42rpx;
                height: 42rpx;
            }
        }
    }

    .activity_con {
        display: flex;
        font-size: 22rpx;
        color: #ffffff;

        .act_label {
            height: 32rpx;
            border-radius: 15rpx;
            line-height: 32rpx;
            padding: 0 10rpx;
            margin-left: 10rpx;
        }

        .ladder_group {
            background: linear-gradient(22deg, #FE901E 0%, #FEAD28 100%);
        }

        .discounts {
            background: linear-gradient(17deg, #AB32CC 0%, #D20FA6 100%);
        }

        .secKill {
            background: linear-gradient(to right, #fc5300, #ff1353);
        }

        .preSale {
            background: linear-gradient(to right, #a62fcd, #ff006c);
        }

        .act_label:nth-child(1) {
            margin-left: 0rpx;
        }

        .spellGroup {
            background: linear-gradient(to right, #ff6000, #ff9c00);
        }

    }

    .store_enter {
        display: flex;
        font-size: 24rpx;
        align-items: center;
        margin-bottom: 8rpx;
    }

    .stroe_name {
        max-width: 200rpx;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #666666;
    }

    .store_enter_btn {
        color: #333333;
        font-weight: bold;
        margin-left: 10rpx;

    }

    .store_enter_image {
        width: 11rpx;
        height: 19rpx;
        margin-left: 10rpx;
    }
    .cart_img{
        position: absolute;
        bottom: 26rpx;
        right: 20rpx;
        width: 42rpx;
        height: auto;
    }
    
</style>
