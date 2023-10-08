<template>
    <!-- 商品评分组件 -->
    <view class="service" v-if="goodsData.supplierType == 'JD' || goodsData.returnDesc">
        <view class="service_con">
            <view :class="`${serviceLabels.isSelf ? 'red' : 'gray'}`" v-if="serviceLabels.logistics">
                {{ serviceLabels.logistics }}
            </view>
            <view v-if="serviceLabels.self" :class="`${serviceLabels.isSelf ? 'red' : 'gray'} isSelf`">
                <view>
                    <img :src="imgUrl + 'goods/icon_xq_feiji.svg'" alt="" v-if="serviceLabels.isSelf" >
                </view>
                {{ serviceLabels.self }}
            </view>
            <view v-if="goodsData.returnDesc" class="gray">{{ goodsData.returnDesc }}</view>
        </view>
    </view>
</template>
<script>
export default {
    props:{  
        goodsData:{
            type: Object,
            default: () => {}
        },
        // 是否京东物流
        jdLogistics: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl
        }
    },
    computed:{
        show(){
            return this.goodsData && Object.keys(this.goodsData).length > 0;
        },
        // 商品详情展示的服务相关数据整合
        serviceLabels(){
            let expressTips = {};
            if (this.goodsData.supplierType == 'JD'){
                if (this.jdLogistics){
                    expressTips = {
                        logistics: '京东自营',
                        self: '京东物流',
                        isSelf: true
                    }
                } else {
                    expressTips = {
                        logistics: '京东自营',
                        self: '厂家配送',
                        isSelf: true
                    }
                }
            }
            return expressTips
        }
    }
}
</script>
<style scoped lang='scss'>
 /* 服务 start */
 .service {
    padding: 0 30rpx 28rpx 30rpx;
    background-color: #fff;
    border-radius: 0 0 20rpx 20rpx;
    .service_con {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        padding: 18rpx 24rpx 4rpx 24rpx;
        background: #ffede3;
        border-radius: 12rpx;
        margin-bottom: 18rpx;

        > view {
            font-size: 22rpx;
            height: 32rpx;
            line-height: 32rpx;
            border-radius: 6rpx;
            margin-right: 16rpx;
            margin-bottom: 14rpx;
            padding: 0 8rpx;

            &:last-child {
                margin-right: 0;
            }
        }

        .red {
            position: relative;
            display: flex;
            align-items: center;
            border: 2rpx solid #f30300;
            color: #f30300;
            font-weight: 600;

            &.isSelf {
                padding-left: 0;
            }

            view {
                width: 34rpx;
                height: 32rpx;
                background-color: #f30300;
                margin-right: 8rpx;
                margin-left: -2rpx;
                border-radius: 6rpx 0 0 6rpx;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
        
        .gray {
            color: #806c6c;
            border: 2rpx solid #a98888;
        }
    }
}

/* 服务 end */
</style>