<!-- 物流和待付款卡片 -->
<template name="expressAndUnpaidCard">
    <view>
        <view class="expressCard" v-if="notPayOrderList.length === 0 && traceArray && traceArray.length > 0">
            <swiper class="expressCardBox" :current="currentIndex" @change="changeIndex" :autoplay="isAutoplay" interval="5000">
                <swiper-item v-for="(item,index) in traceArray" :key="index" class="expressCardItem" @click="openExpressPop(item)">
                    <view class="item-img">
                        <image :src="item.productInfos[0].mainImage"></image>
                    </view>
                    <view class="item-text">
                        {{item.tracesResultState.remark == null ? item.tracesResultState.acceptStation:item.tracesResultState.remark}}
                    </view>
                    <view class="item-line"></view>
                    <view class="item-date">
                        {{ getAcceptTime(item) }}
                    </view>
                </swiper-item>
            </swiper>
                <view class="expressCardDot" v-if="traceArray && traceArray.length > 1">
                    <dot :dotNum="traceArray.length" :currentIndex="currentIndex" :dotColor="'#bdbdbd'" :activeDotColor="'#666666'"/>
                </view>
                <view v-else class="expressCardN"></view>
        </view>
        <view class="unpaidCard" v-if="notPayOrderList && notPayOrderList.length > 0">
            <swiper class="unpaidCardBox" :current="currentIndex" @change="changeUnpaidSwiperIndex" :autoplay="isAutoplay" interval="5000">
                <swiper-item v-for="(item,index) in notPayOrderList" :key="index" class="unpaidCardItem">
                    <view class="item-img">
                        <image :src="item.orderProductListVOList[0].mainImage"></image>
                    </view>
                    <unpaid-countdown :orderItem="item"></unpaid-countdown>
                    <view class="item-btn" @click.stop="toPay(item.orderSn)">去付款</view>
                </swiper-item>
            </swiper>
            <view class="unpaidCardDot" v-if="notPayOrderList && notPayOrderList.length > 1">
                <dot :dotNum="notPayOrderList.length" :currentIndex="currentIndex" :dotColor="'#bdbdbd'" :activeDotColor="'#666666'"/>
            </view>
            <view v-else class="unpaidCardN"></view>
        </view>
        <uni-popup ref='expressPopup' @touchmove.stop.prevent="moveHandle">
            <view class="expressPopDom">
                <view class="expressPopContent">
                    <swiper :current="currentIndex" @change="changeIndex">
                        <swiper-item v-for="(item,index) in traceArray" :key="index" >
                            <view class="top">
                                <view class="top-img">
                                        <image :src="item.productInfos[0].mainImage"></image>
                                </view>
                                <view class="top-text">{{item.productInfos[0].skuName}}</view>
                            </view>
                            <view class="line"></view>
                            <scroll-view class="scrollContainer" scroll-y="true">
                                <view class="ownStep">
                                    <view class="step-content" :class="{active:index==0}" v-for="(item,index) in item.tracesResult.routeList" :key="index">
                                        <view class="step-time">
                                            <view class="days">{{item.day}}</view>
                                            <view class="time">{{item.time}}</view>
                                        </view>
                                        <view class="step-line">
                                            <view class="vertical" :class="{active:index==0}"></view>
                                            <view class="circle" :class="{active:index==0}"></view>
                                            <view class="vertical"></view>
                                        </view>
                                        <view class="desc">{{item.desc}}</view>
                                    </view>
                                </view>
                            </scroll-view>
                            <view class="line"></view>
                        </swiper-item>
                    </swiper>
                </view>
                <view class="expressPopDot"  v-if="traceArray && traceArray.length > 1">
                    <dot :dotNum="traceArray.length" :currentIndex="currentIndex" :dotColor="'rgba(49,59,222,0.40)'" :activeDotColor="'rgba(49,59,222,0.70)'"/>
                </view>
                <view v-else class="expressPopN"></view>
                <view class="expressPopCheck">
                    <text @click="lookLogistics(orderSn,expressNumber)">查看物流信息</text>
                    <text @click="lookLogistics(orderSn,expressNumber)" class="iconfont icon_arrow_right"></text>
                </view>
                <view class="expressPopClose">
                    <image @click="closeExpressPop" :src="imgUrl + 'common/icon/close_screen.png'" mode=""></image>
                </view>
            </view>
        </uni-popup>
    </view>
</template>


<script>
import mixin from '@/common/mixin/orderMixin' //订单混入
import dot from '@/components/swiper-dot/index.vue';
import orderHandler from '@/components/order/handler';
import { formateDateToString } from '@/utils/common.js'
import unpaidCountdown from '@/components/order/unpaidCountdown.vue'
export default {
    mixins:[mixin],
    name: "expressCard",
    components:{
        dot,
        unpaidCountdown
    },
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            orderTracesData:[],//用户的订单物流数据
            currentIndex:0,//当前物流信息索引
            orderSn:'',//当前物流订单
            isAutoplay:true,
            maxNum: 5, //默认最多显示5条物流信息
            notPayOrderList:[] // 待付款订单数据
        }
    },
    created(){
        this.getOrderTraceList(1)
        this.getOrderListNotPay()
    },
    computed:{
        traceArray(){
            return this.orderTracesData?.slice(0, this.maxNum)
        }
    },
    methods: {
        changeIndex(e){
            this.currentIndex = e.detail.current;
            this.orderSn = this.orderTracesData[this.currentIndex]?.orderSn
            this.expressNumber = this.orderTracesData[this.currentIndex]?.tracesResult?.expressNumber
        },
        changeUnpaidSwiperIndex(e){
            this.currentIndex = e.detail.current;
        },
        closeExpressPop(){
            this.isAutoplay = true
            this.$refs.expressPopup.close()
        },
        openExpressPop(){
            this.isAutoplay = false
            this.$refs.expressPopup.open()
        },
        //获取用户有效订单物流列表
        getOrderTraceList(){
            let param = {days:1};
            orderHandler.listOrderTrace(param).then(res => {
                if (res.state == 200){
                    this.orderTracesData = res.data.orderTraces;
                    if (!!this.orderTracesData) {
                        this.orderTracesData = this.orderTracesData.filter((item) => {
                            return item.tracesResult.routeList?.length>0
                        })
                        if (!!this.orderTracesData) {
                            this.orderSn = this.orderTracesData[0]?.orderSn
                            this.expressNumber = this.orderTracesData[0]?.tracesResult?.expressNumber
                            this.orderTracesData?.forEach((item)=>{
                                item.tracesResult.routeList = item.tracesResult.routeList.map((temp) => {
                                    let time = temp.acceptTime.substr(11,5)
                                    let day = temp.acceptTime.substr(5,5).replace('-','/')
                                    if (new Date().getDate() == new Date(temp.acceptTime).getDate()){
                                        day = '今天'
                                    }
                                    return {
                                        "day":day,
                                        "time":time,
                                        "desc":temp.acceptStation
                                    }
                                })
                            })
                        }
                    }
                }
            })
        },
        /**
         * 获得配送时间
         */
        getAcceptTime(item){
            return formateDateToString(new Date(item.tracesResultState.acceptTime),'MM月dd日') 
        },
        /**
         * 获得待付款订单数据
         */
        getOrderListNotPay(){
            orderHandler.getOrderList({orderState: 10, pageSize:this.maxNum, current:1}).then(res=>{
                if(res.state === 200){
                    this.notPayOrderList = res.data.list
                }
            })
        },
        /**
         * 去支付
         * @orderSn 订单号
         */
        toPay(orderSn){
            this.$Router.push({
                path:'/pages/order/detail',
                query: {
                    orderSn
                }
            })
        }
    }
}
</script>

<style scoped lang='scss'>
.expressCard{
    .expressCardBox{
        position: relative;
        height: 128rpx;
        background: #eff2f5;
        border-radius: 12rpx;
        padding: 16rpx;
        .expressCardItem{
            display: flex;
            align-items: center;
            .item-img{
                image{
                    height: 96rpx;
                    width: 96rpx;
                }
            }
            .item-text{
                width: 374rpx;
                margin-left: 16rpx;
                font-size: 26rpx;
                color: #222222;
                font-weight: 400;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                line-clamp: 2;
                -webkit-box-orient: vertical;
                word-break: break-all;
                margin-right: 18rpx;
            }

            .item-line {
                height: 40rpx;
                border: 1rpx solid #e8e8e8;
                margin-right: 15rpx;
            }

            .item-date{
                height: 36rpx;
                font-size: 24rpx;
                
                font-weight: 400;
                text-align: justify;
                color: #666666;
                line-height: 36rpx;
                margin-bottom: 8rpx;
            }
        }
    }
    .expressCardDot{
        width: 100%;
        height: 20rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 16rpx 0rpx;
    }
    .expressCardN{
        width: 100%;
        height: 20rpx;
        padding: 16rpx 0rpx;
    }
}
.unpaidCard{
    .unpaidCardBox{
        position: relative;
        height: 128rpx;
        background: #eff2f5;
        border-radius: 12rpx;
        padding: 16rpx;
        .unpaidCardItem{
            display: flex;
            align-items: center;
            .item-img{
                image{
                    height: 96rpx;
                    width: 96rpx;
                }
            }
            .item-text{
                width: 374rpx;
                margin-left: 23rpx;
                font-size: 26rpx;
                color: #222222;
                font-weight: 400;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                line-clamp: 2;
                -webkit-box-orient: vertical;
                word-break: break-all;
                margin-right: 18rpx;

                .unpaid-text {
                    font-size: 30rpx;
                    color: #222222;
                    font-weight: bold;
                    margin-bottom: 12rpx
                }

                .unpaid-remainder {
                    color: #666666;
                    font-size: 26rpx;
                }
            }

            .item-btn {
                width: 136rpx;
                height: 52rpx;
                line-height: 52rpx;
                text-align: center;
                border-radius: 28rpx;
                border: 2rpx solid #06c7c3;
                color: #06C7C3;
                font-weight: bold;
                cursor: pointer;
            }
        }
    }
    .unpaidCardDot{
        width: 100%;
        height: 20rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 16rpx 0rpx;
    }
    .unpaidCardN{
        width: 100%;
        height: 20rpx;
        padding: 16rpx 0rpx;
    }
}
.expressPopDom{
    width: 658rpx;
    height: auto;
    border-radius: 32rpx;
    display: flex;
    flex-direction: column;
    background: linear-gradient(180deg,#626bff 0%,#93bdff 47%, #93bdff 2%,rgba(246,249,253,1),rgba(246,249,253,0.77));
    backdrop-filter: blur(32rpx);
    padding: 30rpx 18rpx;
    position: relative;
    top: -50rpx;
    .expressPopContent{
        width: 622rpx;
        height: 812rpx;
        background: linear-gradient(180deg,#ffffff, #ffffff);
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        padding: 20rpx 20rpx 0rpx 20rpx;
        display: flex;
        flex-direction: column;
        ::v-deep uni-swiper {
            height: 100% !important;
        }
        .top{
            height: 160rpx;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0rpx 16rpx;
            .top-img{
                image{
                    border-radius: 10rpx;
                    height: 128rpx;
                    width: 128rpx;
                }
            }
            .top-text{
                margin-left: 24rpx;
                font-size: 32rpx;
                
                font-weight: 600;
                text-align: justify;
                color: #0a0a0a;
                line-height: 44rpx;
                height: 88rpx;
                width: 400rpx;
                overflow: hidden;//溢出内容隐藏
                text-overflow: -o-ellipsis-lastline;
                text-overflow: ellipsis;//文本溢出部分用省略号表示
                display: -webkit-box;//特别显示模式
                -webkit-line-clamp: 2;//行数
                line-clamp: 2;
                -webkit-box-orient: vertical;//盒子中内容竖直排列
                word-break: break-all;
            }
        }
        .line{
            margin: 10rpx 10rpx;
            height: 2rpx;
            background-color: rgba(49,59,222,0.10);
        }
        .scrollContainer{
            height: 574rpx;
            .ownStep{
                .step-content{
                    display: flex;
                    align-items: center;
                    color: #999999;
                    &.active{
                        color: #222222;
                    }
                    .step-time{
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        
                        font-weight: 400;
                        text-align: justify;
                        width: 80rpx;
                        height: 80rpx;
                        .days{
                            height: 36rpx;
                            font-size: 26rpx;
                            line-height: 36rpx;
                        }
                        .time{
                            height: 26rpx;
                            font-size: 20rpx;
                            line-height: 24rpx;
                        }
                    }
                    .step-line{
                        width: 28rpx;
                        margin: 0rpx 30rpx;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        .vertical{
                            width: 2rpx;
                            height: 42rpx;
                            border: 2rpx solid #c2c2c2;
                            &.active{
                                border: 2rpx solid #ffffff;
                            }
                        }
                        .circle{
                            width: 22rpx;
                            height: 22rpx;
                            background: #ffffff;
                            border: 2rpx solid #c2c2c2;
                            border-radius: 50%;
                            box-sizing: border-box;
                            margin: 4rpx 0rpx;
                            &.active{
                                border:none;
                                background: var(--logisticCircle);
                            }
                        }
                    }
                    .desc{
                        width: 396rpx;
                        height: 68rpx;
                        font-size: 24rpx;
                        
                        font-weight: 400;
                        text-align: justify;
                        line-height: 34rpx;
                        overflow: hidden;
                        text-overflow: -o-ellipsis-lastline;
                        text-overflow: ellipsis;//文本溢出部分用省略号表示
                        display: -webkit-box;//特别显示模式
                        -webkit-line-clamp: 2;//行数
                        line-clamp: 2;
                        -webkit-box-orient: vertical;//盒子中内容竖直排列
                        word-break: break-all;
                    }
                }
            }
            .ownStep .step-content:last-of-type{
                .vertical:last-child{
                    border: 2rpx solid #ffffff;
                }
            }
        }
    }
    .expressPopDot{
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #ffffff;
        border-radius: 0rpx 0rpx 20rpx 20rpx;
        padding: 0rpx 30rpx 20rpx 30rpx;
    }
    .expressPopDotN{
        width: 100%;
        height: 20rpx;
        background: #ffffff;
        border-radius: 0rpx 0rpx 20rpx 20rpx;
    }
    .expressPopCheck{
        margin-top: 26rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 26rpx;
        
        font-weight: 400;
        text-align: justify;
        color: #222222;
        height: 36rpx;
        line-height: 36rpx;
        .icon_arrow_right{
            font-size: 20rpx;
            margin-left: 10rpx;
        }
    }
    .expressPopClose{
        position: absolute;
        bottom: -108rpx;
        left: 50%;
        width: 50rpx;
        height: 50rpx;
        margin-left: -25rpx;
        image{
            width: 48rpx;
            height: 48rpx;
        }
    }
}
</style>