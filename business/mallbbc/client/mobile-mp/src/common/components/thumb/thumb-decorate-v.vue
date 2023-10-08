<template name="goodsItem">
    <view class="goods_item" @click="goGoodsDetail(goodsItem)">
        <view class="goods-img">
            <imgThumb :imgSrc="goodsItem.mainImage||''" showThumbTips :noSale="judgeNoSale(goodsItem)" />
        </view>
        <view class="goodsNameWrap">
             
            <view class="goods-name">
                <!-- 实惠icon -->
                <tagIcon v-if="isShowJdLable" />
                {{ goodsItem.skuName }}
            </view>
        </view>

        <view class="bottom-wrapper" v-if="goodsItem.salePrice">      
            <!-- 活动信息 -->
            <activityTags :goods_info="goodsItem"></activityTags>

            <!-- todo 注释活动信息 -->
            <!-- <view class="activity_con" v-if="goodsItem.activityList && goodsItem.activityList.length > 0">
                <block v-for="(item, index) in goodsItem.activityList" :key="index">
                    <view
                        class="act_label ladder_group"
                        v-if="item.promotionType == 105"
                    >
                        {{ item.promotionName }}
                    </view>
                    <view
                        class="discount-label num-font"
                        v-if="
                        item.promotionType == 201 || 
                        item.promotionType == 202 ||
                        item.promotionType == 203 ||
                        item.promotionType == 204
                        "
                    >
                        {{ getDiscountContent(item.promotionType,item.descriptionList) }}
                    </view>           

                    <view class="act_label preSale" v-if="item.promotionType == 103">
                        {{ item.promotionName }}
                    </view>

                    <view
                        class="act_label spellGroup"
                        v-if="item.promotionType == 102"
                    >
                        {{ item.promotionName }}
                    </view>
                </block>
            </view> -->



            <!-- 京东到手价 -->
            <block v-if="isShowJdLable">
                <discountPriceTag 
                    :showVsIcon="false" 
                    :supplierReferencePrice="goodsItem.supplierReferencePrice" 
                    :showPrice="goodsItem.salePrice">
                </discountPriceTag>
            </block>

            <view v-else class="price-wrapper num-font" :class="{promotion: isShowActivity}">
                <text>￥</text>
                <text class="int">{{ getPartNumber(goodsItem.salePrice, 'int') }}</text>
                <text>{{ getPartNumber(goodsItem.salePrice, 'decimal') }}</text>
                <view class="promotion_sheng" v-if="isShowActivity">
                    <img src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/goods/icon_sousuo_jiangjia.svg" alt="">
                    降 ¥{{ Number(accSub(goodsItem.originalSalePrice, goodsItem.salePrice)).toFixed(2) }}
                </view>
            </view>

            <view
                class="price_after_seckill"
                v-if="isShowActivity"
            >
                <text class="price_content num-font">
                    ¥{{ getPartNumber(goodsItem.originalSalePrice, "int") }}{{ getPartNumber(goodsItem.originalSalePrice, "decimal") }}
                </text>
            </view>

            <!-- 店铺信息 -->
            <view class="storeInfo">
                <view class="storeName">{{ goodsItem.storeName }}</view>
            </view>
        </view>

        <template v-else>
            <view class="sketch_wrap">
                <view class="first-animated-background animated-price"></view>
                <view class="animated-background animated-storeLogo"></view>
            </view>
        </template>
    </view>
</template>

<script>
import { isNotEmpty, repeatArray, getPartNumber, accSub } from "@/utils/common.js";
import imgThumb from '@/common/components/thumb/imgThumb.vue';
import tagIcon from '@/common/components/tagIcon';
// import logisticsIcon from '@/common/components/thumb-goods-tags/logistics-icon.vue'
import discountPriceTag from '@/common/components/thumb-goods-tags/discount-price-tag.vue';
import activityTags from '@/common/components/thumb-goods-tags/activity-tags.vue';
import activityMinxin from './minxin/activity.js'
import goodsHandler from "@/views/components/goods/handler.js";

export default {
    name: "thumb-decorate-v",
    components: {
        imgThumb,
        tagIcon,
        // logisticsIcon,
        discountPriceTag,
        activityTags
    },
    mixins:[activityMinxin],
    data() {
        return {
            icon2: getApp().globalData.imgUrl + "cart/add2.png",
            icon3: getApp().globalData.imgUrl + "common/icon/add.png",
            icon4: getApp().globalData.imgUrl + "common/icon/add3.png",
            icon_url: "", //加车图标
            goods_pic: "", //商品图片
            goods_sale: "", //销量
            isIos: uni.getSystemInfoSync().platform == "ios", //是否ios手机
            getPartNumber
        };
    },
    computed: {
        cartIcon() {
            switch (this.icon_type) {
            case 1:
                return this.imgUrl + "cart/add-cart.png";
            case 2:
                return this.icon2;
            case 3:
                return this.icon3;
            case 4:
                return this.icon4;
            default:
                return this.imgUrl + "cart/add-cart.png";
            }
        },

        // 默认店铺图片
        defaultStoreImg() {
            return `${this.imgUrl}goods/icon_common_dianpu_nor.svg`;
        },

        bgStyle() {
            return {
                background: `url(${
                    this.goodsItem.storeLogo || this.defaultStoreImg
                }) top center  / cover no-repeat`,
                "background-size": "cover"
            };
        },
        // 活动数据list
        activityList() {
            let activityList = [];
            if (
                !!this.goodsItem &&
                !!this.goodsItem.activityList &&
                !!this.goodsItem.activityList.length
            ) {
                activityList = repeatArray(
                    this.goodsItem.activityList,
                    "promotionName"
                );
            }
            return activityList;
        },
        isShowJdLable() {
            return goodsHandler.isShowJdLable(this.goodsItem);
        },

        isJdLogistics() {
            return goodsHandler.isJdLogistics(this.goodsItem);
        },
        isShowActivity() {
            return this.acitivityType(this.goodsItem.activityList) && this.ifStarted
        }
    },
    props: {
        // 商品item对象
        goodsItem: {
            type: Object,
            value: {}
        },

        // 加入购物车icon的图标样式类别
        icon_type: {
            type: Number
        },

        // 是否显示加入购物车的按钮
        showCart: {
            type: Boolean,
            default: true
        },
    },
    mounted() {
    },
    methods: {
        accSub,
        //进入商品详情页
        goGoodsDetail({ sku, storeId, mainImage }) {
            try {
                this.$Router.push({
                    path: '/views/goods/detail/index',
                    query: {
                        sku, 
                        storeId,
                        mainImage
                    }
                });
            } catch (error) {
                console.log("跳转到商品详情出错", error);
            }
        },
        // isShowJdLable(goods) {
        //     return goodsHandler.isShowJdLable(goods);
        // }
    },
    watch:{
        'goodsItem.activityList':{
            handler(val){
                if (val){
                    const sckillInfo = val.filter(item=>[104, 106, 107].includes(item.promotionType));
                    if (sckillInfo.length > 0){
                        let seckillSeconds = this.calcRemainingSeconds(sckillInfo[0].startTime,sckillInfo[0].endTime);
                    }
                }
            },
            immediate:true
        }
    }
};
</script>

<style scoped lang='scss'>
.discount-label {
    display: inline-block;
    height: 32rpx;
    border: 1rpx solid #f30300;
    border-radius: 4rpx;
    padding: 0 16rpx;
    text-align: center;
    color: #f30300;
    font-size: 20rpx;
    font-weight: bold;
    margin-right: 12rpx;
    margin-bottom: 14rpx;
}

.sketch_wrap {
    padding: 0 20rpx 32rpx 20rpx;
}

.animated-background {
    animation-name: placeHolderShimmer;
    animation-duration: 0.75s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
    animation-timing-function: ease;
    background: #eaeff4;
    position: relative;
}
@keyframes placeHolderShimmer {
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0.15;
    }
}
.first-animated-background {
    animation-name: placeHolderShimmer;
    animation-duration: 0.75s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
    animation-timing-function: ease;
    background: var(--skeletonBg);
    position: relative;
}
.animated-price {
    width: 132rpx;
    height: 28rpx;
    margin-top: 16rpx;
    border-bottom: 1px solid #ededed;
    border-radius: 10rpx;
}
.animated-storeLogo {
    margin-top: 32rpx;
    width: 100%;
    height: 28rpx;
    border-bottom: 1px solid #ededed;
    border-radius: 10rpx;
}

.goods_item {
    margin: 5px;
    background: #fff;
    border-radius: 20rpx;
    box-shadow: -2rpx 0rpx 40rpx -4rpx rgba(156, 159, 169, 0.1);
    overflow: hidden;
    ::v-deep .u-wrap{
        background-position: center top !important; 
    }
    .bottom-wrapper {
        padding: 0 18rpx;
    }
    .price-wrapper {
        overflow: hidden;
        color: #222222;
        &.promotion {
            color: #f30300;
        }
        font-size: 28rpx;
        .int{
            font-size: 40rpx;
        }

        .promotion_sheng {
            position: relative;
            display: inline-block;
            height: 32rpx;
            line-height: 32rpx;
            background-color: #f30300;
            white-space: nowrap;
            font-size: 22rpx;
            color: #fff;
            padding: 0 6rpx 0 20rpx;
            margin-left: 12rpx;
            border-radius: 0 6rpx 6rpx 0;

            img {
                position: absolute;
                width: 28rpx;
                height: 36rpx;
                top: -4rpx;
                left: -6rpx;
            }
        }
           
    }
    .price_after_seckill {
        .price_content {
            font-size: 24rpx;
            color: #a4acb2;
            text-decoration: line-through;
        }
    }
    .goods-img {
        width: 100%;
        min-height: 280rpx;
        overflow: hidden;
        border-radius: 20rpx 20rpx 0 0 !important;
        ::v-deep image {
            border-radius: 20rpx 20rpx 0 0 !important;
        }
        ::v-deep img {
            width: 100%;
            height: auto;
            display: block;
        }
    }
    .goodsNameWrap {
        max-height: 76rpx;
        overflow: hidden;
        margin: 20rpx 0;
    }

    .goodsNameWrap .goods-name {
        max-height: 76rpx;
        width: 100%;
        padding: 0 20rpx;
        font-size: 28rpx;
        color: #222222;
        line-height: 38rpx;
        font-weight: bold;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        word-break: break-all;
    }
    .storeInfo {
        margin-top: 8rpx;
        margin-bottom: 32rpx;
        display: flex;
        align-items: center;
        width: 100%;
        .img_container {
            width: 28rpx;
            height: 28rpx;
            overflow: hidden;
            border-radius: 50%;
            &.ownStoreLogo {
                background: var(--storeLogo);
                background-size: 100% 100%;
            }

            img {
                width: 28rpx;
                height: auto;
            }
        }
        .storeName {
            height: 34rpx;
            font-size: 24rpx;
            font-weight: 400;
            text-align: justify;
            color: #999;
            line-height: 34rpx;
        }
    }

    .activity_con {
        display: flex;
        font-size: 22rpx;
        color: #ffffff;
        margin-top: 20rpx;
        padding: 0 0 0 20rpx;
        flex-wrap: wrap;
        .act_label {
            margin-right: 12rpx;
            margin-bottom: 4rpx;
            line-height: 32rpx;
            padding: 0 8rpx;
            font-size: 20rpx;
            color: #f30300;
            border: 2rpx solid #f30300;
            border-radius: 6rpx;
        }
        .activeLabelWrap{
            width: 100%;
            display: flex;
        }
        .ladder_group {

        }
  }

    .bottom_wrap {
        padding: 4rpx 20rpx;
        position: relative;

        .price {
            color: var(--confirmBtnBgColor2);
            min-height: 48rpx;
            .unit {
                letter-spacing: -2px;
                font-size: 28rpx;
            }
            .price_int {
                font-size: 40rpx;
            }
            .price_decimal {
                font-size: 28rpx;
            }
            .price_title {
                font-size: 20rpx;
                color: #f30300;
                position: relative;
                left: 4rpx;
                top:-4rpx
            }
        }

        .cart_img {
            position: absolute;
            bottom: 26rpx;
            right: 20rpx;
            width: 42rpx;
            height: auto;
        }
    }
    
}

.circle{
    width: 15rpx;
    height: 15rpx;
    border-radius: 50%;
    position: absolute;
    background-color: #fff;
    top:50%;
    transform:translateY(-50%);
}
.left_circle{
    left: -11rpx;
}
.right_circle{
    right: -11rpx;
}

</style>
