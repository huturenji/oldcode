<!--
 * @Author: whchen
 * @Descripttion: 
 * @Date: 2023-04-18 08:52:32
 * @LastEditTime: 2023-04-25 09:52:50
 * @FilePath: \mobile-miniprogram\src\common\components\thumb-goods-tags\discount-price-tag.vue
-->
<template>
    <view class="net-price-wrapper" :class="!showVsIcon ? 'no-padding-right': ''">
        <view class="net-price-left">
            <view class="net-price-box">
                <image v-if="showVsIcon" :src="vsIcon"></image>
                <text class="label" :class="!showVsIcon ? 'small-size' : ''">京东到手价</text>
                <text class="jd-price num-font" 
                    :class="supplierReferencePriceInt.length > 4 ? 'small-size' : ''"
                > 
                    ¥{{supplierReferencePriceInt}}{{getPartNumber(supplierReferencePrice,'decimal')}}
                </text>
            </view>
            <view class="net-price-box discount-box"
                :class="showPriceInt.length > 4 ? 'small-size' :
                        showPriceInt.length === 4 ? 'middle-size' : ''"
            >
                <text class="label">实惠价</text>
                <view class="price-wrapper onsale-price-style num-font">
                    <text>￥</text>
                    <text>{{ showPriceInt }}</text>
                    <text>{{ getPartNumber(showPrice, 'decimal') }}</text>
                </view>
            </view>
        </view>

        <view class="net-price-right">
            <image :src="saveIcon"></image>
            <view class="price-wrapper save-price-style num-font" 
                :class="savePriceInt.length === 3 ? 'middle-size' : 
                        savePriceInt.length === 4 ? 'small-size' : 
                        savePriceInt.length > 4 ? 'micro-size' : ''">
                <text>￥</text>
                <text>{{ savePriceInt }}</text>
                <text>{{ getPartNumber(savePrice, 'decimal') }}</text>
            </view>
        </view>
        
    </view>
</template>

<script>
import { getPartNumber } from '@/utils/common';

export default {
    data() {
        return {
            getPartNumber,
            saveIcon: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/goods/shihui/icon_sousuo_sheng.svg',
            vsIcon: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/goods/vs.svg'
        }
    },
    props: {
        showVsIcon: {
            type: Boolean,
            default: false
        },
        supplierReferencePrice: {
            type: [Number, String],
            default: 0
        },
        showPrice: {
            type: [Number, String],
            default: 0
        }
    },
    
    computed: {
        savePrice() {
            return ((this.supplierReferencePrice * 100 - this.showPrice * 100) / 100).toFixed(2)
        },
        showPriceInt() {
            // const arr = ['9', '99', '999', '9999', '99999']
            // const index = Math.round(Math.random() * 4)
            // return arr[index]
            return getPartNumber(this.showPrice, 'int')
        },
        supplierReferencePriceInt() {
            return getPartNumber(this.supplierReferencePrice,'int')
        },
        savePriceInt() {
            return getPartNumber(this.savePrice,'int')
        }
    }
}
</script>

<style scoped lang="scss">
.net-price-wrapper {
    display: flex;
    /* width: 402rpx; */
    height: 80rpx;
    background: #ffede7;
    border-radius: 12rpx;
    padding: 0 12rpx;
    align-items: center;
    margin-bottom: 12rpx;
    margin-top: 14rpx;
    &.no-padding-right {
        padding: 0 0 0 8rpx;
    }
    .net-price-left {
        flex: 1;
        height: 100%;
        padding-top: 6rpx;
        .net-price-box {
            display: flex;
            align-items: center;
            image {
                width: 24rpx;
                height: 24rpx;
                margin-right: 4rpx;
            }
            .label {
                font-size: 20rpx;
                color: #9e6060;
                margin-left: 0;
                &.small-size {
                    font-size: 18rpx;
                }
            }
            .jd-price {
                font-size: 22rpx;
                color: #9e6060;
                margin-left: 2rpx;
                // &.small-size {
                //     font-size: 20rpx;
                // }
            }
            &.discount-box {
                align-items: flex-end;
                margin-top: -8rpx;
               
                .label {
                    margin-bottom: 6rpx;
                    font-size: 22rpx;
                    color: #F30300;
                }
                .onsale-price-style {
                    &>text {
                        color: #F30300;
                    }

                    &>text:nth-child(1) {
                        font-size: 28rpx;
                    }

                    &>text:nth-child(2) {
                        font-size: 40rpx;
                    }

                    &>text:nth-child(3) {
                        font-size: 28rpx;
                    }
                }

                 &.middle-size {
                    margin-top: -2rpx;
                    .label {
                        margin-bottom: 4rpx;
                    }
                    .onsale-price-style {
                        &>text:nth-child(1) {
                            font-size: 24rpx;
                        }

                        &>text:nth-child(2) {
                            font-size: 34rpx;
                        }

                        &>text:nth-child(3) {
                            font-size: 24rpx;
                        }
                     }
                }
                &.small-size {
                    margin-top: 2rpx;
                    .label {
                        margin-bottom: 2rpx;
                    }
                    .onsale-price-style {
                        &>text:nth-child(1) {
                            font-size: 20rpx;
                        }

                        &>text:nth-child(2) {
                            font-size: 30rpx;
                        }

                        &>text:nth-child(3) {
                            font-size: 22rpx;
                        }
                     }
                }
            }
        }
    }
    .net-price-right {
        position: relative;
        width: 98rpx;
        height: 100%;
        image {
            position: absolute;
            width: 98rpx;
            height: 86rpx;
            top: -4rpx;
            right: 0;
        }
        .save-price-style {
            position: relative;
            z-index: 1;
            padding-left: 4rpx;
            &>text {
                color: #fff;
            }

            &>text:nth-child(1) {
                font-size: 20rpx;
            }

            &>text:nth-child(2) {
                font-size: 28rpx;
            }

            &>text:nth-child(3) {
                font-size: 20rpx;
            }
            &.middle-size {
                &>text:nth-child(1) {
                    font-size: 18rpx;
                }

                &>text:nth-child(2) {
                    font-size: 24rpx;
                }

                &>text:nth-child(3) {
                    font-size: 18rpx;
                } 
            }
            &.small-size {
                &>text:nth-child(1) {
                    font-size: 16rpx;
                }

                &>text:nth-child(2) {
                    font-size: 20rpx;
                }

                &>text:nth-child(3) {
                    font-size: 16rpx;
                } 
            }
            &.micro-size {
                &>text:nth-child(1) {
                    font-size: 14rpx;
                }

                &>text:nth-child(2) {
                    font-size: 18rpx;
                }

                &>text:nth-child(3) {
                    font-size: 14rpx;
                } 
            }
        }
    }
}
</style>
