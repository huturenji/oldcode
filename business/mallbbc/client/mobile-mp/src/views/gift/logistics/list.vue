<!-- 查看物流页面 -->
<template>
    <view class="package_wrap">
        <w-loading ref="loading"></w-loading>
        <view @click="gotoTraceDetail(item)" v-for="(item, index) in packageList" :key="index" class="package_item">
            <view class="title">包裹{{index+1}}</view>
            <view class="content">
                <view class="left"><img :src="imgUrl + 'order/icon_mall_songhuo.svg'" alt=""/></view>
                <view class="right">
                    <view class="name">{{getRemark(item)}}</view>
                    <view class="icon_right"><img :src="rightArrowGray" alt=""/></view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>

import orderHandler from '@/views/components/order/handler';
import { setStorageSync } from '@/utils/common.js';

export default {
    components: {
            
    },
    data() {
        return {
            rightArrowGray: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_rightarrow_gray.svg',
             
            orderSn: '', //订单号
            packageList: [] //包裹列表
        }
    },

    mounted(){
        this.orderSn = this.$Route.query.orderSn; //初始化订单号
        this.getTrace(this.orderSn); //初始化快递物流信息
    },
        
    methods: {
        //初始化物流信息
        getTrace(orderSn){
            return new Promise(() => {
                let param = {orderSn};       
                this.$refs?.loading?.open();        
                orderHandler.getTrace(param).then(res => {
                    if (res.state == 200 && res.data.traces) {
                        this.packageList = res.data.traces
                    } else {
                        uni.showToast({
                            title: res.msg,
                            icon: 'none'
                        })
                    }
                }).catch(() => {
                    //异常处理
                }).finally(()=>{
                    this.$refs?.loading?.close();
                })
            })
        },

        // 获取物流信息
        getRemark(item){
            try {
                return item.tracesResultState.acceptStation;
            } catch (error) {
                return "暂无物流信息"
            }
        },

        // 跳转到物流详情
        gotoTraceDetail(item){
            // 将包裹信息存入缓存
            setStorageSync('packageItem', item);
            this.$Router.push({
                path:'/views/gift/logistics/detail',
                query:{
                    orderSn: this.orderSn,
                    detailFrom: 'cache' //物流信息来自哪里 说明来自前端缓存localstorage
                }
            })
        }


    }
}
</script>

<style lang='scss'>
    page {
        width: 750rpx;
        margin: 0 auto;
    }
    .package_item{
        margin-top: 30rpx;
        cursor: pointer;
        .content{
            display: flex;
            padding: 30rpx 36rpx;
            background: #fff;
            .left{
                width: 44rpx;
                margin-top: 5rpx;
                img{
                    width: 32rpx;
                    height: auto;
                }
                
                
            }
            .right{
                flex: 1;
                display: flex;
                align-items: center;
                .name{
                    flex: 1;
                    font-size: 26rpx;
                    color: #666;
                    text-align: justify;
                }
                .icon_right{
                    width: 30rpx;
                    text-align: right;
                    img{
                        width: 12rpx;
                        height: auto;
                    }
                    
                }
            }
        }
        .title{
            font-size: 26rpx;
            padding-left: 30rpx;
            margin-bottom: 16rpx;

        }
    }
    
</style>

