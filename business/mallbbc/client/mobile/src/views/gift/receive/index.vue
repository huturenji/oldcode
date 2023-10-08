<!-- 鹅毛情收下礼物页面 -->
<template>
    <view>
        <template v-if="showPage">
            

            <!-- 用来占位顶部title栏的 -->
            <view class="zhanwei" :style="{opacity: 1}"></view>
            <view class="receive_gift" v-if="gift_info.length > 0">
                <!-- 定位再页面顶部的贺卡 -->
                <view class="heka" v-if="!showSvga" @click="showSvga=true"></view>

                <!-- 动图logo+sologon 待收礼或者当前领取人已收礼才显示该logo -->
                <view v-if="(allData.status==giftStatusMap.TO_RECEIVE)"  class="top_wrap">
                    <view class="logo"></view>
                    <view class="sologo"></view>
                </view>
    
                <!-- 礼物已被自己领取 -->
                <view v-if="(allData.status==giftStatusMap.RECEIVED && allData.isReceiver)"  class="top_tips_self">
                    <view class="hasdone">
                        <image :src="imgUrl+'order/warning@2x.png'"></image>
                        <text class="notMoreGift">礼物已经领完了</text>
                    </view>
                    <view class="views_tips">
                        <text class="where">快去看看礼物到哪里了</text>
                        <text @click="viewGiftDetail" class="view_gift">查看物流详情<image :src="imgUrl+'common/icon/btn_common_rightarrow_red.svg'"></image></text>
                    </view>
    
                </view>
    
                <!-- 礼物已被别人领取 -->
                <view v-if="(allData.status==giftStatusMap.RECEIVED && !allData.isReceiver)"  class="top_tips">
                    <image :src="imgUrl+'order/warning@2x.png'"></image>
                    <text class="notMoreGift">礼物已经领完了</text>
                </view>
    
                <!-- 礼物已失效 -->
                <view v-if="(allData.status==giftStatusMap.EXPIRED)"  class="top_tips">
                    <image :src="imgUrl+'order/warning@2x.png'"></image>
                    <text class="notMoreGift">礼物已超时失效了</text>
                </view>
                
                <view class="receive_wrapper" :class="{receive_wrapper_specail: !toReceive}">
                    <!-- 商品部分 -->
                    <view class="receive_gift_con" :class="{receive_gift_specail: !toReceive}" v-for="(item, index) in gift_info" :key="index">
                        <receiveGift 
                            :gift_info="item" 
                        />
                    </view>
                    <!-- 待收礼显示部分 -->
                    <template v-if="allData.status == giftStatusMap.TO_RECEIVE">
                        <!-- 填写地址 -->
                        <view class="address_tips">填写地址领取礼物</view>
                        <addressInfo ref="addressInfo"/>
                        <!-- 倒计时 -->
                        <view class="receive-tips">
                            <view class="receive_tips_con">
                                <text>剩余</text>
                                <text class="time" v-if="formateTime.days!='00'"><text class="num-font">{{formateTime.days}}</text>天</text>
                                <text class="time"><text class="num-font">{{formateTime.hours}}</text>小时<text class="num-font">{{formateTime.minutes}}</text>分</text>
                                <text>未收礼将自动失效</text>
                            </view>
                        </view>
                    </template>
    
                    <!-- 已失效或者已被领取 显示部分 -->
                    <template v-else-if="allData.status==giftStatusMap.EXPIRED || (allData.status==giftStatusMap.RECEIVED)">
                        <view class="operation_process">
                            <image mode="widthFix" @click="viewFeather" src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/mallbbc/img/bg_emq_xqemq.svg"></image>
                        </view>
                        <view class="fix_btn">
                            <!-- 已收礼  收礼人 != 当前点击分享查看的伴正事用户 || 礼物超时未领取已失效-->
                            <btnFactory :btnInfo="{ type: 'goGiveGift' }" size="big"></btnFactory>
                        </view>
                    </template>
                </view>
            </view>
        </template>
        

        <!-- 收礼物初始化动画 @click.native="showSvga=false"-->
        <template v-if="showSvga">
            <svga 
                :src="presentCardSrc" 
                :containerStyle="svgaStyle"
                :loops="1"
                :width="344"
                :height="618"
                @done="showSvga=false"
            />
            <!-- 礼物动画的遮罩蒙层 -->
            <view @click="showSvga=false" class="svga-mask"></view>
        </template>
    </view>
</template>

<script>
import giftHandler from '@/components/gift/handler';
import receiveGift from "@/components/gift/thumb-receive-gift.vue";
import btnFactory from "@/components/button/btnFactory.vue";
import { giftStatusMap, giftUsedMap } from '@/views/gift/common/lib/enum.js'
import { getAllTime } from '@/utils/common';
import addressInfo from '../exchange/index'; // 填写地址的相关信息组件
import svga from '@/components/svga/index.vue';

export default {
    data(){
        return {
            imgUrl: getApp().globalData.imgUrl,
            allData:{}, //返回的全部数据
            gift_info:[], //卡片信息
            giftStatusMap:giftStatusMap,
            giftUsedMap:giftUsedMap,
            current:0,
            featherId:'',
            countDownTimer: null, //定时器
            distanceTime: 0, //距离失效还剩多少时间
            showPage: false,
            opacity: 0, //为了做沉浸式加的占位图的透明度
            cardIndex: null,
            showSvga: true // 是否显示svga格式的动画
        }
    },

    components: {
        receiveGift,
        btnFactory,
        addressInfo,
        svga
    },

    computed:{
        formateTime(){
            return getAllTime(this.distanceTime); 
        },
        // 是否是待领取或者是自己领取时看到的
        toReceive(){
            let flag;
            if (this.allData.status==giftStatusMap.TO_RECEIVE){
                flag = true;
            } else if (this.allData.status==giftStatusMap.EXPIRED || this.allData.status==giftStatusMap.RECEIVED){
                flag = false;
            }
            return flag
        },

        // 卡片动画图片地址
        presentCardSrc(){
            return `https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/card/${this.cardIndex}/animate.svga`
        },
        // 动画容器的样式
        svgaStyle(){
            return {
                position: 'fixed',
                top: '0',
                bottom: '0',
                left: '0',
                right: '0',
                zIndex: 10000,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }
        }
    },
  
    mounted(){
    },
    onShow(){
        this.cardIndex = this.$Route.query.cardIndex || 0;
        this.featherId = this.$Route.query.featherId;
        this.getReceiveGift();
    },
    onPageScroll(e){
        if (e.scrollTop >= 0 && e.scrollTop <= window.titleBarHeight){
            this.opacity = e.scrollTop / window.titleBarHeight;
        } else {
            this.opacity = 1;
        }
    },
    methods:{
        // 查看详情
        viewGiftDetail() {
            this.$Router.push({ path: '/views/gift/detail/index', query: { featherId: this.getFeatherId() } })
        },
        // 选取featherId
        getFeatherId(){
            let featherId = '';
            if (this.allData.status == giftStatusMap.TO_RECEIVE){
                featherId = this.featherId;
            } else if (this.allData.status == giftStatusMap.RECEIVED) {
                featherId = this.allData.receiverFeatherOrderVO?.featherId
            }
            return featherId
        },

        //跳转到了解鹅毛情的页面
        viewFeather(){
            this.$Router.push({
                path: '/views/gift/preview/index',
                query: {
                    showFeatherConfirmBtn: 0 //不显示立即送礼
                }
            })
        },
        // 获取礼物订单详情
        getReceiveGift(){
            if (!this.featherId){ return }
            let param = {
                featherId: this.featherId
            };
            // uni.showLoading();
            giftHandler.getGiftDetail(param).then(res => {
                if (res.state == 200){
                    this.gift_info = res.data?.orderDetailVOs[0]?.childOrdersVOS || [];
                    this.allData = res.data;
                    
                    // current主要用于进度条
                    if (this.allData.status == giftStatusMap.TO_RECEIVE){ //0 待收礼
                        this.current = 0;
                    } else if (this.allData.status == giftStatusMap.RECEIVED){ //1 已收礼
                        if (this.allData.isReceiver){ //查询人==收礼人
                            if (this.allData.giverOrReceiver == 0){ //送礼人的信息，场景：从聊天对话框进
                                if (this.allData.receiverFeatherOrderVO.used == giftUsedMap.UNUSED){ //0 未兑换（即未填写地址）
                                    this.current = 1;
                                } else { //1 已兑换
                                    this.current = 2;
                                } 
                            } else if (this.allData.giverOrReceiver == 1){ //收礼人信息 场景：我领取之后从我的推送进
                                if (this.allData.used == giftUsedMap.UNUSED){ //0 未兑换（即未填写地址）
                                    this.current = 1;
                                } else { //1 已兑换
                                    this.current = 2;
                                } 
                            }
                            
                        } else {
                            
                        }
                    } else { //2 已失效
                        
                    }
                    // ios识别2022-08-18中的'-'有问题，故这里转换成'/'去兼容
                    if (this.allData.status == giftStatusMap.TO_RECEIVE){
                        this.distanceTime = parseInt((new Date(this.allData.expiredTime.replace(/-/g,'/')).getTime() - new Date().getTime())/1000);
                        this.setTimer();
                    }
                    

                } else {
                    this.$api.msg(res.msg);
                }
            }).catch((e)=>{
                console.log(e);
            }).finally(() => {
                // uni.hideLoading();
                // 延时显示dom 优先展示贺卡动画
                setTimeout(()=>{
                    this.showPage = true;
                }, 200)
            })
        },
   
        // 失效设置定时器
        setTimer(){
            this.countDownTimer = setTimeout(() => {
                this.distanceTime--
                if (this.distanceTime > 0) {
                    this.setTimer()
                } else {
                    clearTimeout(this.countDownTimer)
                    this.getReceiveGift();
                }
            }, 1000)
        },

        /***
         * 出发三地址联动的反选
         */
        giftAddressAnalyse(result){
            this.$refs?.addressInfo?.giftAddressAnalyse(result)
        },

        // 收下礼物
        receiveGift(){
            let param = {};
            param.voucherCode = this.allData.voucherCode;
            uni.showLoading();
            giftHandler.receiveGift(param).then(res =>{
                uni.hideLoading();
                if (res.state == 200){
                    this.$Router.push({path:'/views/gift/exchange/index',query:{featherId:this.featherId}})
                } else {
                    this.$api.msg(res.msg);
                }
            }).catch(()=>{
                uni.hideLoading();
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.receive_wrapper{
    padding: 92rpx 50rpx calc(146rpx + var(--safe-area-inset-bottom));
    &.receive_wrapper_specail{
        padding-top: 0;
    }
}
.content_wrapper{
    background: rgba(46,54,67,0.79);
    border-radius: 20rpx;
    backdrop-filter: blur(6rpx);
}

.receive_gift{
    width: 100%;
    min-height: 100vh;
    padding-top: var(--titleBarHeight);
    background: #222 url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/mallbbc/img/emao_bg.png');
    background-position: center top;
    background-repeat: repeat-y;
    background-size: 100% auto;
    position: relative;
    .heka{
        position: fixed;
        top: calc(var(--titleBarHeight) + 18rpx);
        right: 28rpx;
        width: 80rpx;
        height: 116rpx;
        background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/gift/btn_emq_heka.png') center no-repeat;
        background-size: 100% auto;
        z-index: 300;
    }
    .receive_gift_con{
        padding: 40rpx 32rpx;
        width: 100%;
        height: 968rpx;
        background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/mallbbc/img/bg_emq_heibg.png') center no-repeat;
        background-size: contain;
        padding-top: 258rpx;
        margin-top: -170px;
        &.receive_gift_specail{
            background: rgba(46,54,67,0.79);
            border-radius: 20rpx 20rpx 0 0;
            backdrop-filter: blur(6rpx);
            padding: 32rpx 32rpx;
            margin-top: 0rpx;
            height: auto;
        }
    }
   
    .operation_process{
        background: rgba(46,54,67,0.79);
        border-radius: 0 0 20rpx 20rpx;
        backdrop-filter: blur(6rpx);
        padding: 0 32rpx 32rpx 32rpx;
        image{
            width: 100%;
        }
    }
}
@-webkit-keyframes sequenceLogo{
    0%{background-position: 0px 0;}
    100%{background-position: -18700px 0;}    
}
@keyframes sequenceLogo{
    0%{background-position: 0px 0;}
    100%{background-position: -18700px 0;}    
}
.top_wrap{
    width: 100%;
    position: relative;
    z-index: 200;
    height: 170px;
   .logo{
        position: relative;
        width: 187px;
        height: 120px;
        background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/mallbbc/img/gift_spirite.png') center no-repeat;
        background-size: auto 100%;
        animation: sequenceLogo 4s steps(100, end) infinite;
        -webkit-animation: sequenceLogo 4s steps(100, end) infinite;
        left: 24rpx;
        top: -2rpx;
   }
   .sologo{
        position: absolute;
        width: 750rpx;
        height: 220rpx;
        background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/mallbbc/img/icon_emq_slogan.svg') no-repeat;
        background-size: 100% auto;
        background-position: left top;
        left: 0rpx;
        right: 0rpx;
        top: 62px;
   }
    
}
.address_tips{
    font-size: 32rpx;
    word-wrap: break-all;
    font-weight: 600;
    color: #fff;
    margin-top: 48rpx;
    margin-bottom: 20rpx;
}
.receive-tips{
    width: 100%;
    text-align: center;
    font-size: 0;
    color: #999;
    .receive_tips_con{
        width: 100%;
        font-size: 28rpx;
        .time{
            font-weight: normal;
            color: #fff;
        }
        text:first-child{
            margin-right: 8rpx;
        }
        text:last-child{
            margin-left: 8rpx;
        }
    }
}
.receive_tips{
    font-size: 26rpx;
    color: #e8e8e8;
    line-height: 36px;
    margin-bottom: 40rpx;
    margin-top: 40rpx;
}

.fix_btn{
    position: fixed;
    width: 750rpx;
    bottom: 0;
    left: calc((100vw - 750rpx) / 2);;
    right: 0;
    z-index: 10;
    background: rgba(2, 2, 2, 1);
    height: calc(140rpx + var(--safe-area-inset-bottom));
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 68rpx var(--safe-area-inset-bottom);
    ::v-deep .btnFactory{
        flex: 1;
        height: 80rpx;
        line-height: 80rpx;
        text-align: center;
        color: #fff;
        font-size: 30rpx;
        background-color: #F30300;
        border-radius: 40rpx;
        cursor: pointer;
    }
    

}
.top_tips{
    width: 100%;
    height: 158rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    image{
        width: 48rpx;
        height: 48rpx;
        margin-right: 16rpx;
    }
    text{
        font-size: 36rpx;
        color: #fff;
        font-weight: bold;
    }
}
.top_tips_self{
    width: 100%;
    padding-top: 18rpx;
    padding-bottom: 34rpx;
    .hasdone{
        display: flex;
        justify-content: center;
        align-items: center;
        image{
            width: 48rpx;
            height: 48rpx;
            margin-right: 16rpx;
        }
        text{
            font-size: 36rpx;
            color: #fff;
            font-weight: bold;
        }
    }
    .views_tips{
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 26rpx;
        color: #fff;
        margin-top: 20rpx;
        margin-bottom: 34rpx;
        
        .where{
            position: relative;
            padding-right: 16rpx;
            &::after{
                content: "";
                width: 2rpx;
                height: 18rpx;
                background: rgba(216,216,216,0.80);
                position: absolute;
                right: 0rpx;
                top: 10rpx;
            }
        }
        .view_gift{
            padding-left: 16rpx;
            color: $main-color;
            image{
                width: 20rpx;
                height: 20rpx;
                margin-left: 2rpx;
            }
        }
    }
}
.zhanwei{
    width: 750rpx;
    height: var(--titleBarHeight);
    position: fixed;
    top: 0;
    z-index: 1000;
    background: #020202;
    opacity: 1;
}
.svga-mask{
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0,0,0,.7);
    z-index: 200;
}

</style>
