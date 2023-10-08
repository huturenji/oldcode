<template>
    <view class="wrap">
        <slot name="head"></slot>
        <view v-for="(item,index) in goodsInfo" :key="index" class="item" v-if="item.productType == 0">
            <view class="imageWrap"><image class="img" :src="item.mainImage" mode="widthFix"></image></view>
            <view class="nameWrap" >
                <view class="name"><text class="store">{{storeName}}</text><text>{{item.skuName}}</text></view>
                <view class="desc">
                    <view class="spec">{{item.specValues||''}}</view>
                    <view class="num" v-if="item.productNum">
                        数量: *<text>{{item.productNum}}</text>
                    </view> 
                </view>
            </view>
        </view> 
    </view>
</template>
<script>
export default {
    props:{
        goodsInfo:{
            type: Array,
            default: () => []
        },
        storeName:{
            type: String,
            default: ''
        }
    },
    data(){
        return{
            
        }
    },
    mounted(){
        
    },
    methods:{
        
    }
}
</script>
<style lang="scss" scoped>
    .wrap{
        width: 100%;
    }
    .nameWrap{
        backdrop-filter: blur(25.2rpx);
        -webkit-backdrop-filter: blur(25.2rpx);
        background: rgba(255,255,255,0.8);
        border-radius: 0 0 18rpx 18rpx;
        color: #222;
        font-size: 30rpx;
        padding: 32rpx;
        margin-top: -10rpx;
    }
    .item{
        width: 100%;
    }
    .name{
        font-weight: bold;
        padding-top: 10rpx;
        width: 100%;
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        margin-bottom: 10rpx;
        font-size: 32rpx;
        text-align: left;
        .store{
            padding: 2rpx 10rpx;
            height: 30rpx;
            background: #f30300;
            border-radius: 6rpx;
            color: #fff;
            line-height: 30rpx;
            text-align: center;
            font-size: 20rpx;
            vertical-align: center;
            margin-right: 10rpx;
            margin-top: 6rpx;
            font-weight: bold;
        }
    }
    .desc {
        display: flex;
        align-items: flex-start;

        .spec {
            flex-shrink: 1;
            font-size: 24rpx;
            height: 44rpx;
            line-height: 44rpx;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }

        .num {
            flex-shrink: 0;
            font-size: 24rpx;
            height: 44rpx;
            line-height: 44rpx;
            width: 140rpx;
            text-align: right;
        }
    }
    .spec, .num{
        color: #666;
        font-size: 28rpx;
        text-align: left;
    }
    .btn{
        height: 56rpx;
        border-radius: 56rpx;
        border: #333 1px solid;
        line-height: 56rpx;
        text-align: center;
        width: fit-content;
        margin: 0 auto;
        padding: 0 30rpx;
    }
    .img{
        width: 100%;
        height: 682rpx;
        border-radius: 18rpx 18rpx 0 0;
    }
</style>