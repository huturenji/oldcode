<template>
    <view class="compare" v-if="compareList.length > 0" :style="{paddingLeft:compareList.length>3?'20rpx':'30rpx'}" :class="{backgroundfff: !filterFlag}">
        <!-- 内容 -->
        <view class="info" :class="{active: showAll}">
            <view @click.stop="changeItem(item)" class="info_item" :class="{showcurrent: item.sku == currentSku}" v-for="(item,index) in dealList" :key="index">
                <!-- 2022-07-22 干掉最低字样 -->
                <!-- <view v-if="item.isMin" class="low">
                    <image :src="imgUrl+'goods/icon_bnj_jiaobiaoc.svg'" ></image>
                </view> -->
                <view class="info_img">
                    <view class="ownStoreLogo" v-if="item.storeId=='6'"></view>
                    <image :src="item.storeLogo" v-else></image>
                </view>
                <view class="info_price">
                    <text class="unit">¥</text>
                    <text class="price_int num-font">{{$getPartNumber(item.salePrice,'int')}}</text>
                    <text class="price_decimal num-font">{{$getPartNumber(item.salePrice,'decimal')}}</text>
                </view>
            </view>
        </view>
    </view>

</template>
<script>
import { filterFlag } from '@/utils/common.js'
export default {
    props:{
        //接收比价信息列表
        currentSku:{
            type:String
        },
        compareList:{
            type:Array
        }
    },
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            upArrow: false,
            showAll: false,
            minIndex: 0,
            filterFlag: true //是否支持高斯模糊
        }
    },
    computed:{
        dealList(){
            return this.compareList.map((item, index)=>{
                return {
                    ...item,
                    isMin: this.calcMinPrice()==index?true:false
                }
            })
        }
    },
    
    mounted(){
        this.filterFlag = filterFlag();
    },
    methods: {
        changeItem(item){
            if (item.sku == this.currentSku){
                return 
            }
            this.$emit('change', item)
        },
        clickArrow(){
            this.upArrow = !this.upArrow;
            this.showAll = !this.showAll;
            this.$emit('clickArrow', this.upArrow);
        },
        calcMinPrice(){
            let list = this.compareList.map((item)=>{ return 100*(parseFloat(item.salePrice).toFixed(2)) })
            let min = Math.min(...list)
            return list.findIndex((item)=>{ return item == min })
        }
    }
}
</script>
<style scoped lang='scss'>
.compare{
    width: 750rpx;
    height: 104rpx;
    // flex-wrap: wrap;
    font-size: 28rpx;
    backdrop-filter: blur(16px);
    position: relative;
    background: linear-gradient(270deg,rgba(216,232,223,0.60), rgba(255,221,221,0.60));
    padding-left: 30rpx;
    overflow-x: scroll;
    &.backgroundfff{
        background: #fff linear-gradient(270deg,rgba(216,232,223,0.60), rgba(255,221,221,0.60));
    }
    
    .boxShadow{
        width: 750rpx;
        height: 1rpx;
        background:#ffffff;
        box-shadow: 0px 0px 10px 0px rgba(117,118,129,0.47);
    }
    .info{
        width: fit-content;
        height: 100%;
        display: flex;
        align-items: center;
        z-index: 10;
        transition: all .3s;
        &.active{
            max-height: 500rpx;
            transform: rotate(0deg);
        }
        .info_item{
            background:#ffffff;
            height: 72rpx;
            // &:nth-of-type(3n){
            //     margin-right: 0rpx;
            // }
            &.showcurrent{
                border: 3rpx solid var(--tagColor);
                color: var(--tagColor);
            }
            width: 216rpx;
            height: 72rpx;           
            border-radius: 10rpx;
            margin-right: 20rpx;
            display: flex;
            align-items: center;
            position: relative;
            // .low{
            //     position: absolute;
            //     width: 56rpx;
            //     height: 56rpx;
            //     top: 0rpx;
            //     right: 0rpx;
            //     image{
            //         width: 56rpx;
            //         height: 56rpx;
            //     }
            // }
            .info_img{
                width: 44rpx;
                height: 44rpx;
                border-radius: 50%;
                margin-left: 12rpx;
                image{
                    border-radius: 50%;
                    width: 44rpx;
                    height: 44rpx;
                }
                .ownStoreLogo {
                    width: 100%;
                    height: 100%;
                    background: var(--storeLogo);
                    background-size: 100% 100%;
                }
            }
            .info_price{
                .unit{
                    font-size: 28rpx;
                    font-weight: normal;
                    margin-left: 8rpx;
                }
                .price_int{
                    font-size: 32rpx;
                    font-weight: normal;
                }
                .price_decimal {
                    font-size: 20rpx;
                    font-weight: normal;
                }
            }
        }
        
    }
}
</style>