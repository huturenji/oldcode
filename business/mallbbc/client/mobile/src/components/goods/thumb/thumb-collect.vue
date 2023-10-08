<!-- 商品组件：横向展示，一行一个，商品列表页面
    点击进入商品详情页
    加入购物车事件
-->
<template name="goodsItemH">
    <view class="collection_wrap" :style="{left:left == true?'-160rpx':'0'}">
        <view class="goods_h_item flex_row_start_start" @click="goGoodsDetail(goods_info)">
            <view class="goods_check flex_row_start_center" v-if="editShowState">
                <text :class="[goodsCheckStyle]" @click.stop="changeSelectState"></text>
            </view>
            <view class="goods-img">
                <imgThumb :imgSrc="goods_info.mainImage" :loadingImgMode="1"/>
                <view class="invalid_tips" v-if="!goods_info.valid">已失效</view>
            </view>
            <view class="right flex_column_between_start">
                <view class="top flex_column_start_start" style="width: 100%;">
                    <text class="goods-name">{{goods_info.skuName}}</text>
                    <text class="goods-brief" v-if="goods_info.spuBrief">{{goods_info.spuBrief}}</text>
                </view>
                <view class="goods-price flex_row_between_center">
                    <view class="left flex_row_start_end num-font">
                        <text class="unit">¥</text>
                        <text class="price_int">{{this.$getPartNumber(goods_info.skuPrice,'int')}}</text>
                        <text class="price_decimal">{{this.$getPartNumber(goods_info.skuPrice,'decimal')}}</text>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import imgThumb from "@/components/goods/thumb/imgThumb.vue";
import { mapState } from 'vuex';

export default {
    name: "thumb-collect",
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            is_show_btn:false, //是否展示
            followId:'',
            startX:'',
            startY:'',
            editFlag: false //是否勾选编辑标识
            
        }
    },
    components: {
        imgThumb
    },
    props: {
        goods_info: {
            type: Object,
            value: {}
        },
        isWeiXinBrower:{
            type:Boolean
        },
        left:{
            type:Boolean
        },
        isGoDetail: {
            type: Boolean
        },
        // 编辑器显示状态
        editShowState: {
            type:Boolean
        }
    },
    computed: {
        ...mapState(['hasLogin']),
        //商品层级的选中样式
        goodsCheckStyle(){
            return this.editFlag
                ? 'image-wrapper-check item_check iconfont icon_checked_radio' :
                'image-wrapper-check iconfont icon_check_radio';
        }
    },
    methods: {
        //分享商品
        goShare(goods_info){
            this.$emit("goShare", goods_info)
        },
        //进入商品详情页
        goGoodsDetail(goods_info) {
            if (!this.isGoDetail) { return }
            try {
                let sku = goods_info.sku;
                let path = '/standard/product/detail'
                if (!!goods_info.state&&goods_info.state == "2"){
                    this.$api.msg("此商品所在店铺已关闭");
                } else {
                    this.$Router.push(
                        {
                            path,
                            query: {
                                sku
                            }
                        }
                    )
                }
                

            } catch (error) {
                console.log('跳转到商品详情出错', error)
            }
        },
        //删除收藏商品
        delGoods(id) {
            this.$emit("delGoods", id);
        },
        // 点击商品
        changeSelectState() {
            this.editFlag = !this.editFlag;
            if (this.editFlag){
                this.$emit('collectSelectedId',this.goods_info)
            } else {
                this.$emit('cancelSelectedId',this.goods_info)
            }
        }
    }
}
</script>

<style lang='scss'>
    .collection_wrap{
        position:relative;
        transition: all 0.3s;
    }
    .goods_h_item {
        width: 710rpx;
        background: #fff;
        padding: 0 20rpx 20rpx;
        overflow: hidden;
        background: #fff;
        /* position: absolute; */
        &:first-child {
            padding-top: 20rpx;
        }

        .goods_check {
            height: 290rpx;
        }
        .image-wrapper-check {
            width: 60rpx;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .iconfont {
            color: #bbb
        }

        .item_check {
            color: var(--radioCheckedColor);
        }

        .goods-img {
            background-position: center center;
            background-repeat: no-repeat;
            background-size: cover;
            width: 290rpx;
            height: 290rpx;
            overflow: hidden;
            border-radius: 16rpx;
            background-color: #F8F6F7;
            flex-shrink: 0;
            position: relative;

            .invalid_tips {
                text-align: center;
                position: absolute;
                bottom: 0px;
                width: 100%;
                height: 23px;
                line-height: 23px;
                background: rgba(0, 0, 0, 0.5);
                color: #fff;
            }
        }

        .right {
            height: 290rpx;
            padding: 10rpx 0 30rpx;
            width: 420rpx;

            .top {
                padding-left: 20rpx;
            }
        }

        .goods-name {
            font-size: 28rpx;
            color: #222222;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            word-break:break-all;
            font-weight: 500;
        }

        .goods-brief {
            color: $main-third-color;
            font-size: 24rpx;
            margin-top: 10rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 100%;
        }

        .goods-price {
            padding: 0 20rpx;
            width: 100%;
            margin-top: 15rpx;

            .left {
                color: var(--confirmBtnBgColor2);
                align-items: baseline;
                font-weight: normal;

                .unit,
                .price_decimal {
                    font-size: 24rpx;
                }

                .price_int {
                    font-size: 38rpx;
                    line-height: 38rpx;
                }

            }

            .iconfont {
                font-size: 45rpx;
                color: $main-font-color;
            }

            image {
                width: 42rpx;
                height: 42rpx;
            }
        }
    }
    
    .operate_wrap{
        position:absolute;
        width:160rpx;
        height:330rpx;
        display: flex;
        flex-direction: column;
        right: -162rpx;
        top:0;
        background-color: #fff;
        box-sizing: border-box;
        .operate_btn{
            width:160rpx;
            height:96rpx;
            font-size:28rpx;
            color:#fff;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #FF9518;
            transition: all 0.3s;
        }
        .share_btn{
            background: #FF9518;
        }
        .to_shop_btn{
            background: #FDBF19;
            border-top-right-radius: 10rpx;
        }
        .delete_btn {
            background-color: #ff4e3a;
            width: 100%;
            height: 100%;
            color: #fff;
            font-size: 28rpx;

            > view {
                height: 50%;
                text-align: center;

                &.u-icon--right {
                    flex-direction: column-reverse;
                }
            }
        }
    }
</style>
