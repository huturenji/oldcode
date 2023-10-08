<template>
    <view class="wrap">
        <view v-for="(item,index) in goodsInfo" :key="index"  @click="viewDetail()">
            <view v-if="item.productType == 0">
                <view class="img">
                    <imgThumb :imgSrc="item.mainImage"/>
                </view>
                <view class="nameWrap">
                    <view class="name"><text class="store" v-if="!!item.storeName">{{item.storeName}}</text><text>{{item.skuName}}</text></view>
                    <view class="spec">{{item.specValues||''}}</view>
                </view>
            </view>
            <view v-else class="giftWarp">
                <view class="leftText">{{giftType[item.productType].text}}</view>
                <view class="giftImg">
                    <imgThumb :imgSrc="item.mainImage"/>
                </view>
                <view class="nameWrap">
                    <view class="name">
                        {{item.skuName}}
                    </view>
                    <view class="spec">
                        {{item.specValues||''}}
                    </view>
                </view>
                <view class="productNum">
                    *{{item.productNum}}
                </view>
            </view>
        </view> 
    </view>
</template>
<script>
import imgThumb from "@/common/components/thumb/imgThumb";
export default {
    props:{
        goodsInfo:{
            type: Array,
            default: () => []
        },
        featherId:{
            type:String,
            default:''
        }
    },
    components:{ imgThumb },
    data(){
        return{
            giftType:{
                1:{
                    text:'附件'
                },
                2:{
                    text:'赠品'
                }
            }
        }
    },
    mounted(){
        
    },
    methods:{
        //去详情
        viewDetail(){
            this.$Router.push({
                path:'/views/gift/detail/index',
                query:{
                    featherId:this.featherId
                }
            })
        }

    }
}
</script>
<style lang="scss" scoped>
    .wrap{
        width: 100%;
    }
    .name{
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
        font-weight: bold;
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
    .spec{
        color: #999;
        font-size: 28rpx;
        text-align: left;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: bold;
    }
    .img{
        height: 650rpx;
    }
    .giftWarp{
        height: 192rpx;
        border: 2rpx dashed #ff8366;
        border-radius: 16rpx;
        margin-top: 24rpx;
        position: relative;
        overflow: hidden;
        display: flex;
        padding: 20rpx;
        .leftText{
            color: #fff;
            font-size: 20rpx;
            width: 140rpx;
            height: 40rpx;
            background-color: #f30300;
            text-align: center;
            line-height: 40rpx;
            transform: rotate(-45deg);
            position: absolute;
            left: -40rpx;
            top: 6rpx;
            z-index: 10;
        }
        .giftImg{
            width: 148rpx;
            height:148rpx;
            margin-right: 20rpx;
        }
        .nameWrap{
            width: 360rpx;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin-right: 48rpx;
            height: 150rpx;
            .name{
                font-size: 26rpx;
                color: #222;
                padding-top: 0;
            }
            .spec{
                font-size: 22rpx;
                color: #999;
            }
        }
    }
</style>