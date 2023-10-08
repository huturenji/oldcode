<!-- 查看物流页面 -->
<template>
    <view class="package_wrap">
        <view @click="gotoTraceDetail(item)" v-for="(item, index) in packageList" :key="index" class="package_item">
            <view class="title">包裹{{index+1}}</view>
            <view class="content">
                <view class="left"><img :src="imgUrl + 'order/icon_mall_songhuo.svg'" alt=""/></view>
                <view class="right">
                    <view class="name">{{getRemark(item)}}</view>
                    <view class="icon_right"><img :src="imgUrl + 'common/icon/icon_common_rightarrow.svg'" alt=""/></view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import {
    mapState
} from 'vuex';
import orderHandler from '@/components/order/handler';  
export default {
    components: {
            
    },
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            orderSn: '', //订单号
            packageList: [] //包裹列表
        }
    },

    mounted(){
        this.orderSn = this.$Route.query.orderSn; //初始化订单号
        this.getTrace(this.orderSn); //初始化快递物流信息
    },
        
    
    computed: {
        ...mapState(['hasLogin', 'userInfo', 'userCenterData'])
    },
        
    methods: {
        //初始化物流信息
        getTrace(orderSn){
            return new Promise(() => {
                let param = {orderSn};       
                uni.showLoading()         
                orderHandler.getTrace(param).then(res => {
                    uni.hideLoading();
                    if (res.state == 200 && res.data.traces) {
                        this.packageList = res.data.traces
                    } else {
                        this.$api.msg(res.msg);
                    }
                }).catch(() => {
                    //异常处理
                    uni.hideLoading();
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
            this.$setStorageSync('packageItem', item);
            this.$Router.push({
                path:'/views/order/logistics/detail',
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
        background: $bg-color-split;
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

