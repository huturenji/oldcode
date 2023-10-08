<!-- 地址 -->
<template>
    <view class="deliver_goods" @click="getAddressInfo">
        <view class="deliver_goods_con">
            <view class="deliver_goods_left">
                <view class="deliver_goods_title">送至</view>
                <view class="deliver_goods_address">
                    <text :class="{addressDefault:!choosedAddress.provinceCode}">{{ choosedAddress.addressAll ? choosedAddress.addressAll : currentUserPosition.province ? `${currentUserPosition.province}${currentUserPosition.city}${currentUserPosition.county}${currentUserPosition.town || ''}` : '请选择地址'}}</text>
                </view>
            </view>
            <image src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_rightarrow_gray.svg" class="deliver_goods_right"></image>
        </view>
        <view class="deliver_time" v-if="isNotEmptyPromiseTime()">
            <p>现在下单，预计 <text>{{ dealTime() }}</text>送达</p>
        </view>
    </view>
</template>

<script>
import { isNotEmpty } from '@/utils/common.js'
import { mapState } from 'vuex'
export default {
    name:'expressDelivery',
    props:{
        goodsData: {
            type:Object,
            default: () => {}
        },
        choosedAddress: {
            type:Object,
            default: () => {}
        },
        promiseTime: {
            type:String,
            default: () => ''
        }
    },
    computed:{
        ...mapState(['currentUserPosition']),
    },
    methods:{
        // 打开筛选框选择地址列表 此处两个变量 同时用settimeout是为了动画的展示效果
        getAddressInfo(){
            this.$emit('getAddressInfo')
        },

        isNotEmptyPromiseTime(){
            return isNotEmpty(this.promiseTime)
        },

        // 处理
        dealTime(){
            try {
                this.promiseTime = this.promiseTime.replace(/\（/g, ' (').replace(/\）/g, ') ')
            } catch (error) {
                
            }
            return this.promiseTime
        }
    }
}
</script>

<style lang="scss" scoped>
/* 发货地址及运费 start */
.deliver_goods {
    background: #FFFFFF;
    padding-bottom:20rpx;

    .deliver_goods_con {
        padding: 0 30rpx 10rpx 30rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .deliver_goods_left {
            display: flex;
            align-items: center;

            .deliver_goods_title {
                font-size: 26rpx;
                font-family: PingFang SC;
                font-weight: 400;
                color: #999999;
                line-height: 40rpx;
                margin-right: 28rpx;
            }

            .deliver_goods_address {
                display: flex;
                align-items: center;
                flex: 1;
                .iconWrap {
                    width: 28rpx;
                    height: 40rpx;
                    margin-right: 10rpx;
                    line-height: 40rpx;
                }
                .iconfont {
                    font-size: 28rpx;
                }

                text {
                    display: inline-block;
                    font-size: 26rpx;
                    font-family: PingFang SC;
                    font-weight: 600;
                    color: #222;
                    line-height: 40rpx;
                    max-width: 380rpx;
                    flex: 1;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }


        .deliver_goods_right {
            width: 24rpx;
            height: 24rpx;
        }
    }

    .deliver_time {
        padding-left: 106rpx;

        p {
            color:#999999;
            font-size: 24rpx;

            text {
                color: #F30300;
            }
        }
    }
}

/* 发货地址及运费 end */

</style>