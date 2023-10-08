<template>
    <view class="bg">
        <template v-if="showPage">
            <u-navbar title="鹅毛情礼单" :bgColor="bgColor" leftIconColor="#fff" :titleStyle="{ color: '#fff', 'font-weight': 'bold' }">
                <template slot="left" >
                    <u-icon name="home" size="25" color="#fff" @click="goHome"></u-icon>
                </template>
            </u-navbar>
            <scroll-view class="scroll-view" @click.stop="hideToast" scroll-y>
                <!-- 定位再页面顶部的贺卡 -->
                <view class="heka" v-if="!showSvga && !isPC" :style="[hekaStyle]" @click="showSvga=true"></view>
                <view class="content">
                    <block v-if="isToReceive">
                        <view class="logo"></view>
                        <image class="slogan" :src="sloganUrl" mode="widthFix"></image>
                    </block>
    
    
                    <view class="warningWrap" v-if='isExpired && !data.isReceiver'>
                        <image src="warningImage" class="warningImg"></image>
                        <view class="warningText">礼物已超时失效了</view>
                    </view>
    
                    <view class="warningWrap" v-if="!isSelf">
                        <image src="warningImage" class="warningImg"></image>
                        <view class="warningText">礼物已经领完了</view>
                    </view>
    
                    <view class="warningWrap_receive" v-if="isReceiverReceived">
                        <view class="received-icon">
                            <image src="warningImage" class="warningImg"></image>
                            <text class="text">礼物已领取</text>
                        </view>
                        <view class="received-tips">
                            <text>快去看看礼物到哪里了</text>
                            <text>|</text>
                            <text @click="toGiftDetail(data.receiverFeatherOrderVO.featherId)">查看物流详情</text>
                            <view @click="toGiftDetail(data.receiverFeatherOrderVO.featherId)">
                                <image class="right-arrow" src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_rightarrow_red.svg">
                                </image>
                            </view>
                        </view>
                    </view>
    
                    <!-- 加这一层block是为了区分v-else的作用域 -->
                    <block>
                        <block v-if="isToReceive">
                            <view class="toReceiveGoodsWrap" v-for="(item, index) in giftInfo" :key="index">
                                <thumbGiftDetail :goodsInfo='item.orderProductListVOList' :storeName='item.storeName'
                                    :featherId='data.receiverFeatherOrderVO.featherId'>
                                    <template #head>
                                        <image class="lihe" :src="liheUrl" mode="widthFix"></image>
                                    </template>
                                </thumbGiftDetail>
                            </view>
    
                            <!-- 填写地址领取礼物 -->
                            <address-comp ref="address" @selectAddress="selectAddress" />
                        </block>
    
                        <!-- 别人超时未领取 或者 已被领取 -->
                        <block v-else>
                            <view class="GoodsWrap" v-for="(item, index) in giftInfo" :key="index">
                                <thumbGiftDetail :goodsInfo='item.orderProductListVOList' :storeName='item.storeName'
                                    :featherId='data.receiverFeatherOrderVO.featherId'>
                                    <template #head>
                                        <image class="lihe" :src="liheUrl" mode="widthFix"></image>
                                    </template>
                                </thumbGiftDetail>
                                <!-- 了解鹅毛情 -->
                                <view @click="previewEmaoqing" class="emq_introduce" v-if="!isToReceive">
                                    <image :src="emqIntroduceUrl" mode="widthFix"></image>
                                </view>
                            </view>
                            <view @click="goHome" class="btn">我要送礼</view>
                        </block>
                    </block>
    
    
                    <view class="tips-wrap" v-if="isToReceive">
                        <view class="receive-tips">
                            <view class="receive-tips-con">
                                <text>剩余</text>
                                <text class="time num-font" v-if="formateTime.days != '00'">{{ formateTime.days }}天</text>
                                <text class="time num-font">{{ formateTime.hours }}小时{{ formateTime.minutes }}分</text>
                                <text>未收礼将自动失效</text>
                            </view>
                        </view>
    
                        <view class="receive-tips" v-if="current == 2">
                            <view class="receive-tips-con" style="padding-bottom: 20px;">
                                已完成收礼，快去看看礼物到哪里了
                            </view>
                            <btnFactory type="viewDetail" :giftInfo='data' size='big'></btnFactory>
                        </view>
                    </view>
                </view>
            </scroll-view>
        </template>

        <!-- 收礼物初始化动画-->
        <template v-if="showSvga && !isPC">
            <svga 
                :src="presentCardSrc" 
                :style="svgaStyle"
                :loops="1"
                width="344px"
                height="618px"
                contentMode="AspectFill"
                @done="showSvga=false"
            />
            <!-- 礼物动画的遮罩蒙层 -->
            <view @click="showSvga=false" class="svga-mask"></view>
        </template>
    </view>
</template>

<script>
import thumbGiftDetail from '@/views/components/goods/thumb/thumb-gift-detail'
import { getGiftDetail } from '@/views/components/gift/handler'
import btnFactory from '@/views/components/button/btnFactory'
import addressComp from '@/views/components/gift/addressComp'
import { getAllTime, isPC } from '@/utils/common';
import { giftStatusMap, giftUsedMap } from '@/common/lib/enum/gift'
import shareMixin from '@/common/mixin/share';
import systemMixin from '@/common/mixin/system.js'
import svga from '@/views/components/svga/index.vue';
export default {
    mixins: [shareMixin, systemMixin],
    components: {
        addressComp,
        thumbGiftDetail,
        btnFactory,
        svga
    },
    data() {
        return {
            warningImg: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/icon_common_warning.svg',
            bgColor: 'transparent',
            showPage: false,
            liheUrl: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/mallbbc/img/icon_emq_lihe.svg',
            emqIntroduceUrl: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/mallbbc/img/bg_emq_xqemq.png',
            sloganUrl: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/mallbbc/img/icon_emq_slogan.svg',
             
            giftStatusMap: giftStatusMap,
            giftUsedMap: giftUsedMap,
            giftInfo: [],//商品信息
            data: {},//订单信息
            countDownTimer: null, //定时器
            distanceTime: 0, //距离失效还剩多少时间
            current: 0,
            isSelf: true,// 是否是领取人查看
            featherId: '',
            cardIndex: null,
            showSvga: true,
            isPC: isPC()
        }
    },
    mounted() {
       
    },
    onPageScroll({ scrollTop }) {
        if (scrollTop <= 4) {
            this.bgColor = 'transparent';
        } else {
            this.bgColor = '#080809';
        }
    },
    onLoad() {
        
    },
    onShow() {
        // 初始化显示收礼卡片动画的index
        this.cardIndex = this.$Route.query.cardIndex || 0;
        // 此处replace必须写在onShow钩子里面。因为分享h5卡片要重定向 
        this.featherId = this.$Route.query.featherId;
        // 初始化的时候由于现实鹅毛的动画
        this.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#020202',
        })
        // 获取鹅毛情详情
        this.getGiftInfo()
    },
    // 设置当前页面分享到朋友
    onShareAppMessage(option) {
        let shareMessage = {
            path: `/views/gift/receive/index?featherId=${this.featherId}&cardIndex=${this.cardIndex}`,
            imageUrl: `https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/card/${this.cardIndex}/share.png`
        }
        // 全局混入share.js
        let share = this.setShareAppMessage(shareMessage)
         
        return share;
    },
    computed: {
        formateTime() {
            return getAllTime(this.distanceTime);
        },
        isToReceive() {
            return this.data.status == giftStatusMap.TO_RECEIVE;
        },
        isReceiverReceived() {
            return this.data.isReceiver && this.data.status == giftStatusMap.RECEIVED;
        },
        // 已失效
        isExpired() {
            return this.data.status == giftStatusMap.EXPIRED;
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
                zIndex: '10000',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }
        },
        hekaStyle() {
            return {
                'top': (this.navHeight) + 'px', // 该变量在system.js 混入里面
            }
        }
    },
    methods: {
        goHome(){
            uni.switchTab({
                url: '/pages/index/index'
            })
        },
    
        /*****
         * 设置titlebar 样式
         */
        setNavigationBarColor(config = {}) {
            uni.setNavigationBarColor({
                frontColor: config.frontColor,
                backgroundColor: config.backgroundColor
            })
        },
        hideToast() {
            this.$refs.address?.hideToast();
        },
        toGiftDetail(featherId) {
            this.$Router.push({
                path: '/views/gift/detail/index',
                query: {
                    featherId
                }
            })
        },
        //获取鹅毛情礼物
        getGiftInfo() {
            let params = {}
            params.featherId = this.featherId
            getGiftDetail(params).then(res => {
                if (res.state == 200) {
                    // 延时显示dom 优先展示贺卡动画
                    setTimeout(()=>{
                        this.showPage = true;
                    }, 600)

                    // 找到一个函数主商品的订单
                    let orderDetailVOs = res.data?.orderDetailVOs.filter(orderDetailVO => {
                        let childOrdersVOS = orderDetailVO.childOrdersVOS.filter(childOrdersVO => {
                            let hasProduct = childOrdersVO.orderProductListVOList.some(orderProduct => {
                                return orderProduct.productType == 0;
                            })
                            return hasProduct;
                        })
                        return childOrdersVOS?.length > 0;
                    })


                    this.giftInfo = orderDetailVOs[0].childOrdersVOS || [];
                    this.data = res.data;
                    // ios识别2022-08-18中的'-'有问题，故这里转换成'/'去兼容
                    if (this.isToReceive) {
                        this.distanceTime = parseInt((new Date(this.data.expiredTime.replace(/-/g, '/')).getTime() - new Date().getTime()) / 1000);
                        this.setTimer();
                    }
                    // current主要用于进度条
                    if (this.isToReceive) { //0 待收礼
                        this.current = 0;
                    } else if (this.data.status == giftStatusMap.RECEIVED) { //1 已收礼
                        if (this.data.isReceiver) { //查询人==收礼人
                            if (this.data.receiverFeatherOrderVO.used == giftUsedMap.UNUSED) { //0 未兑换（即未填写地址）
                                this.current = 1;
                            } else { //1 已兑换
                                this.current = 2;
                            }
                        } else {
                            this.isSelf = false;
                        }
                    } else { //2 已失效

                    }
                } else {
                    this.showPage = false;
                    uni.showToast({
                        title: res.msg,
                        icon: 'none'
                    })
                }
            })
        },
        // 失效设置定时器
        setTimer() {
            this.countDownTimer = setTimeout(() => {
                this.distanceTime--
                if (this.distanceTime > 0) {
                    this.setTimer()
                } else {
                    clearTimeout(this.countDownTimer)
                    this.getGiftInfo();
                }
            }, 1000)
        },
        // 导入更新了地址
        selectAddress(addressData) {
        },
        previewEmaoqing() {
            this.$Router.push({
                path: '/views/gift/preview/index'
            })
        }
    }
}
</script>

<style scoped lang="scss">
.bg {
    background-color: rgb(43, 39, 39);
    background-image: url("https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/mallbbc/img/emao_bg.png");
    background-size: 750rpx 100%;
}

.scroll-view {
    box-sizing: border-box;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: left;
    .heka{
        position: fixed;
        right: 14px;
        width: 80rpx;
        height: 116rpx;
        background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/gift/btn_emq_heka.png') center no-repeat;
        background-size: 100% auto;
        z-index: 300;
    }
    .content {
        margin-top: 120rpx;
        padding: 0 56rpx 80rpx;
        overflow: hidden;
    }

    .logo {
        position: absolute;
        width: 187px;
        height: 120px;
        background: url(https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/mallbbc/img/gift_spirite.png) center no-repeat;
        background-size: auto 100%;
        animation: sequenceLogo 4s steps(100, end) infinite;
        -webkit-animation: sequenceLogo 4s steps(100, end) infinite;
        left: 12px;
        top: 54px;
        z-index: 2;
    }

    .slogan {
        position: absolute;
        left: 0;
        top: 240rpx;
        z-index: 2;
    }

    .warningWrap {
        padding: 60rpx 0 72rpx;
        display: flex;
        justify-content: center;
        align-items: center;

        .warningImg {
            width: 48rpx;
            height: 48rpx;
        }

        .warningText {
            height: 56rpx;
            font-size: 40rpx;
            color: #fff;
            line-height: 56rpx;
            font-weight: 600;
            margin-left: 12rpx;
        }        
    }
    .warningWrap_receive{
        padding: 60rpx 0 72rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .received-icon {
            display: flex;
            align-items: center;

            image {
                width: 48rpx;
                height: 48rpx;
                margin-right: 16rpx;
            }

            .text {
                height: 50rpx;
                font-size: 36rpx;
                font-weight: bold;
                color: #ffffff;
                line-height: 50rpx;
            }
        }
        .received-tips {
            margin-top: 18rpx;
            display: flex;
            align-items: center;

            text:nth-child(1) {
                height: 36rpx;
                font-size: 26rpx;
                color: #ffffff;
                line-height: 36rpx;
            }

            text:nth-child(2) {
                margin: 0 16rpx;
                color: #D8D8D8;
            }

            text:nth-child(3) {
                height: 36rpx;
                font-size: 26rpx;
                font-weight: bold;
                color: #f30300;
                line-height: 36rpx;
            }

            .right-arrow {
                margin-left: 4rpx;
                width: 20rpx;
                height: 20rpx;
            }
        }
    }
    .toReceiveGoodsWrap {
        border-radius: 20rpx;
        margin-top: 100rpx;
        padding: 240rpx 32rpx 32rpx;
        background-image: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/mallbbc/img/bg_emq_heibg.svg');
        background-repeat: no-repeat;
        background-size: cover;
        background-position: 0 0;

        ::v-deep .wrap {
            position: relative;
        }

        .lihe {
            position: absolute;
            width: 200rpx;
            left: 50%;
            top: -56rpx;
            margin-left: -50px;
        }

    }

    .GoodsWrap {
        position: relative;
        background-color: #2E3643;
        padding: 32rpx;
        border-radius: 20rpx;

        .emq_introduce {
            background-color: #2E3643;
            border-radius: 20rpx;
            margin-top: 30rpx;
        }

        .lihe {
            position: absolute;
            width: 200rpx;
            left: 50%;
            top: -24rpx;
            margin-left: -100rpx;
        }
    }

    .toReceiveGoodsWrap,
    .GoodsWrap {
        font-size: 0;
    }


    .tips-wrap {
        border-radius: 0 0 20rpx 20rpx;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;

        .receive-tips {
            padding: 32rpx 0;

            .receive-tips-con {
                text-align: center;
                width: 100%;
                font-size: 28rpx;
                color: #999;

                .time {
                    color: #FFF;
                }

                text:first-child {
                    margin-right: 8rpx;
                }

                text:last-child {
                    margin-left: 8rpx;
                }
            }
        }
    }
}

.btn {
    margin-top: 80rpx;
    text-align: center;
    width: 100%;
    height: 80rpx;
    line-height: 80rpx;
    color: #fff;
    background: #f30300;
    border-radius: 40rpx;
    font-weight: bold;
    font-size: 30rpx;
}

@-webkit-keyframes sequenceLogo {
    0% {
        background-position: 0px 0;
    }

    100% {
        background-position: -18700px 0;
    }
}

@keyframes sequenceLogo {
    0% {
        background-position: 0px 0;
    }

    100% {
        background-position: -18700px 0;
    }
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
