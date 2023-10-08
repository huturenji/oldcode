<template>
    <!-- 商品评分组件 -->
    <view class="rate" v-if="show">
        <view class="shop_des">
            <view class="shop_des_image">
                <view class="ownStoreLogo" v-if="storeInfo.storeId=='6'"></view>
                <image :src="storeInfo.storeLogo" mode="" class="" v-else></image>
            </view>
            <view class="shop_des_con">
                <view class="shop_con_title">{{storeInfo.storeName}}</view>
                <view class="shop_con_type">
                    <view class="shop_type" v-if="storeInfo.ownShop == 1">{{$L('自营')}}</view>
                    <view class="shop_follow_num" v-if="false">
                        {{storeInfo.followNumber ? storeInfo.followNumber : 0 }}{{$L('人关注')}}
                    </view>
                </view>
            </view>
        </view>
        <view class="shop_des_list">
            <view class="shop_des_pre">
                <text>{{$L('描述相符')}}</text>
                <view class="shop_des_pre_score flex_row_center_center">
                    <text>{{filters.toFixNum(storeInfo.descriptionScore,1)}}{{$L('分')}}</text>
                    <view :class="{high:storeInfo.descriptionScore > 4,low:storeInfo.descriptionScore < 2}" class="middle"></view>
                </view>
            </view>
            <view class="shop_des_pre">
                <text>{{$L('服务态度')}}</text>
                <view class="shop_des_pre_score flex_row_center_center">
                    <text>{{filters.toFixNum(storeInfo.serviceScore,1)}}{{$L('分')}}</text>
                    <view :class="{high:storeInfo.serviceScore > 4,low:storeInfo.serviceScore < 2}" class="middle"></view>
                </view>
            </view>
            <view class="shop_des_pre">
                <text>{{$L('发货速度')}}</text>
                <view class="shop_des_pre_score flex_row_center_center">
                    <text>{{filters.toFixNum(storeInfo.deliverScore,1)}}{{$L('分')}}</text>
                    <view :class="{high:storeInfo.deliverScore > 4,low:storeInfo.deliverScore < 2}" class="middle"></view>
                </view>
            </view>
        </view>
    </view>
</template>
<script module="filters" lang="wxs" src="@/utils/filter.wxs"></script>
<script>
export default {
    props:{  
        storeInfo:{
            type: Object,
            default: () => {}
        }
    },
    computed:{
        show(){
            return this.storeInfo && Object.keys(this.storeInfo).length > 0;
        }
    }
}
</script>
<style scoped lang='scss'>
/* 店铺 start */
.rate {
    background-color: #FFFFFF;
    margin-top: 20rpx;
    padding: 24rpx 30rpx 28rpx;
    border-radius: 20rpx 20rpx 0rpx 0rpx;

    .shop_des {
        display: flex;
        align-items: center;

        .shop_des_image {
            width: 96rpx;
            height: 96rpx;
            border-radius: 15rpx;
            .ownStoreLogo {
                width: 100%;
                height: 100%;
                background: var(--storeLogo);
                background-size: 100% 100%;
            }
            image {
                width: 96rpx;
                height: 96rpx;
                border-radius: 15rpx;
            }
        }

        .shop_des_con {
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin-left: 16rpx;

            .shop_con_title {
                font-size: 32rpx;
                
                font-weight: 600;
                color: #222222;
                line-height: 44rpx;
            }

            .shop_con_type {
                display: flex;
                align-items: center;
                margin-top: 8rpx;

                .shop_type {
                    padding: 4rpx 8rpx;
                    line-height: 20rpx;
                    border: 2rpx solid var(--tagColor);
                    border-radius: 6rpx;
                    color: var(--tagColor);
                    font-size: 20rpx;
                    font-weight: 500;
                    
                    letter-spacing: 1.82rpx;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .shop_follow_num {
                    font-size: 24rpx;
                    
                    font-weight: 500;
                    color: #999999;
                    line-height: 45rpx;
                    margin-left: 20rpx;
                }
            }
        }
    }

    .shop_des_list {
        display: flex;
        align-items: center;
        margin-top: 46rpx;
        justify-content: space-between;
        .shop_des_pre {
            display: flex;
            align-items: center;
            white-space: nowrap;
            flex-wrap: wrap;
            // flex:33.33% 1 0;
            justify-content: center;
            position: relative;

            &::after {
                content: '';
                position: absolute;
                width: 2rpx;
                height: 20rpx;
                background: #d8d8d8;
                right: -18rpx;
                top: 50%;
                transform: translateY(-50%);
            }
            &:last-child::after {
                content: none;
            }
            .shop_des_pre_score{
                .middle {
                    width: 32rpx;
                    height: 32rpx;
                    background:url('@/static/shared/goods/icon_bnj_zhong.svg') center no-repeat;
                    background-size: 100% 100%;
                    &.high {
                        background:var(--scoreHighImg);
                        background-size: 100% 100%;
                    }
                    &.low {
                        background:url('@/static/shared/goods/icon_bnj_di.svg') center no-repeat;
                        background-size: 100% 100%;
                    }
                }
                text:nth-of-type(1) {
                    font-size: 26rpx;
                    
                    color: var(--tagColor);
                    line-height: 36rpx;
                    margin: 0 4rpx;
                }
            }


            text:nth-of-type(1) {
                font-size: 26rpx;
                
                color: #222222;
                line-height: 36rpx;
            }


            image {
                width: 32rpx;
                height: 32rpx;
            }
        }
    }

    .shop_links {
        height: 108rpx;
        border-top: 1rpx solid #f2f2f2;
        display: flex;
        justify-content: space-between;
        padding: 0 149rpx 0 161rpx;
        box-sizing: border-box;
        align-items: center;
        transform: rotateZ(360deg);
        image {
            width: 172rpx;
            height: 48rpx;
        }
    }
}

/* 店铺 end */
</style>