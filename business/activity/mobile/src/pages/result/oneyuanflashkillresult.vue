<!--抽奖弹窗页-->
<template>
    <view class="container win_prize_yyg_bg">
        <view class="content_wrap">
            <view class="content" :class="{getPrize:ifGetPrize}">
                <image class="lottery_img yyg" :mode="'aspectFit'" :src="lotteryInfo.imgUrl"> </image>
                <view class="lottery_name">
                    {{ ifGetPrize ? 'wow，恭喜您秒杀成功，快去一元下单吧~': '很遗憾，您来晚一步，下期好运哦~' }}
                </view>
                <view class="get_btn">
                    <view class="searchBtn" @click="checkPrizeDetail">
                        {{ ifGetPrize ? "去下单" : "我知道了" }}
                    </view>
                </view>
            </view>
        </view>
        <view class="close_wrap" @click="cancel">
            <image :src="`${imgUrl}images/icon_search_clean.svg`" />
        </view>
    </view>
</template>

<script>
import { getPrizeDetail } from '@/common/lib/handler.js'
export default {
    name: "oneyuanflashkillresult",
    props: {
        activityId: {
            type: String,
        },
        lotteryInfo: {
            type: Object,
        },
        ifPreview: {
            type: Boolean,
            default: () => false
        },
        // 是否为临时活动id
        previewType: {
            type: Boolean,
            default: () => false
        },
    },
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            isYyms:true,//是否一元秒杀
            winCertificate:'',//中奖凭证
            winPrizeInfo: {},//中奖信息
        };
    },
    computed: {
        // 是否获奖
        ifGetPrize() {
            return this.lotteryInfo.name !== "谢谢参与" && this.lotteryInfo.name !== "很遗憾，您来晚一步，下期好运哦~";
        },
    },
    methods: {
        // 取消
        cancel() {
            this.$emit("closeLotteryResultModal");
        },
        // 查看商品详情
        checkPrizeDetail() {
            if (this.ifGetPrize) {
                const winCertificate = this.lotteryInfo.winCertificate
                let url = ''
                if (this.ifPreview) {
                    url = `/pages/redeem-page/preview-redeem-page?activityId=${this.activityId}`
                    if (this.previewType) {
                        url += '&type=1'
                    }
                    uni.navigateTo({ url });
                } else {
                    url = `/pages/redeem-page/redeem-page?winCertificate=${winCertificate}&activityId=${this.activityId}`
                    this.winCertificate = winCertificate;
                    //一元秒杀去下单
                    this.getWinDetail()
                }
                this.$emit("closeLotteryResultModal");
            } else {
                this.$emit('closeLotteryResultModal');
            }
        },
        // 一元秒杀去下单,获取兑换凭证信息
        getWinDetail() {
            getPrizeDetail({ winCertificate: this.winCertificate })
                .then(res => {
                    if (res.resultCode === 0) {
                        let prizeInfo = res.result;
                        prizeInfo.name = res.result.prizeName;
                        this.winPrizeInfo = prizeInfo;
                        this.getOnlineLottery();
                    } else {
                        uni.showToast({ title: res.resultMessage, icon: 'none' })
                    }
                })
        },
        // 立即领取
        getOnlineLottery() {
            // 领取类型
            // exchangeType: 1 线上奖品 前往商城订单页下单领取
            // exchangeType: 2 不显示领奖按钮 只能保存兑奖凭证
            // exchangeType: 3 跳转到地址页领取
            // exchangeType: 4 商云优惠券跳转g2优惠券页面， 虚拟商品弹框提示
            if (this.winPrizeInfo.exchangeType === 1) {
                this.receiveOnLinePrize()
            } else if(this.winPrizeInfo.exchangeType === 3) {
                uni.navigateTo({ url: `/pages/address/index?winCertificate=${this.winCertificate}&activityId=${this.activityId}` });
            } else if(this.winPrizeInfo.exchangeType === 4) {
                if (this.winPrizeInfo.offlinePrizeType === 1) {//商云优惠券
                    let url = ''
                    if (this.winPrizeInfo.exchangeUrl) {
                        url = `${this.winPrizeInfo.exchangeUrl}?password=${this.winPrizeInfo.voucherCode}`
                    } else {
                        url = window.location.origin + `/${config.DOMAIN_NAME}/static/mobile/index.html#/pages/coupon/receive?password=${this.winPrizeInfo.voucherCode}`
                    }
                    sinosdk.sino.openApplet({
                        appId: '268435729',
                        url: url
                    })
                } else if (this.winPrizeInfo.offlinePrizeType === 3) {
                    this.$refs.voucherCodeModal.open();
                    this.$nextTick(() => {
                        let dom = document.querySelector('.voucherText')
                        fitFontSize(dom, 72)
                    })
                } else if (this.winPrizeInfo.offlinePrizeType === 4) {//商云红包
                    let url = ''
                    if (this.winPrizeInfo.exchangeUrl) {
                        url = `${this.winPrizeInfo.exchangeUrl}?password=${this.winPrizeInfo.voucherCode}`
                    } else {
                        url = window.location.origin + `/${config.DOMAIN_NAME}/static/mobile/index.html#/pages/redpacket/receive?password=${this.winPrizeInfo.voucherCode}`
                    }
                    sinosdk.sino.openApplet({
                        appId: '268435729',
                        url: url
                    })
                }
            } else {
                uni.showToast({ title: '未查到中奖信息', icon: 'none' })
            }
        },
        // 领取线上奖品
        receiveOnLinePrize() {
            // 已领取则显示已领取弹窗
            if (this.winPrizeInfo.state === 1) {
                let params = {
                    sku: this.winPrizeInfo.sku,
                    voucherCode: this.winPrizeInfo.voucherCode,
                    userId: getApp().globalData.userParams.userId,
                    channelId: getApp().globalData.userParams.channelId,
                    companyId: getApp().globalData.userParams.companyId
                }

                // 数据加解密
                let encryptStr = encrypt(params)
                encryptStr = encodeURIComponent(encryptStr)
                const url = window.location.origin + `/${config.DOMAIN_NAME}/static/mobile/index.html#/views/order/confirm/voucher?code=` + encryptStr
                    
                // 打开小应用 回调为关闭页面的回调
                sinosdk.sino.openApplet({
                    appId: '268435729',
                    url: url
                })
            } else if (this.winPrizeInfo.state === 2) {
                this.$refs.prizeReceived.open();
            }
        },
    }
};
</script>
<style lang="scss" scoped>
.container {
    position: relative;
    width: 608rpx;
    height: 852rpx;
    margin-top: -60rpx;

    .content_wrap {
        padding-top: 260rpx;
        overflow: hidden;

        .content {
            padding: 0 40rpx 48rpx 40rpx;
            text-align: center;
            .lottery_img {
                &.yyg{
                    width: 254rpx;
                    height: 254rpx;
                    border-radius: 16rpx;
                }
            }
            .lottery_name {
                margin: 10rpx 0 40rpx;
                height: 80rpx;
                font-size: 28rpx;
                text-align: center;
                text-overflow: ellipsis; /* 超出部分省略号 */
                overflow: hidden;
                word-break: break-all; /* break-all(允许在单词内换行。) */
                -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
                -webkit-line-clamp: 2; /** 显示的行数 **/
                display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
            }
            .get_btn {
                .searchBtn {
                    margin: 0 auto;
                    width: 498rpx;
                    height: 84rpx;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: #fff;
                    font-size: 30rpx;
                    background: url('@/static/shared/images/btn.png');
                    background-size: 100% 100%;
                    cursor: pointer;
                }
            }
            &.getPrize{
                .lottery_img{
                    &.yyg{
                        background:#fff;
                        width: 254rpx;
                        height: 254rpx;
                        border-radius: 16rpx;
                    }
                }
            }
        }
    }
    .close_wrap {
        width: 60rpx;
        height: 60rpx;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 36rpx;
        position: absolute;
        left: 50%;
        bottom: -88rpx;
        transform: translateX(-50%);
        cursor: pointer;

        image {
            width: 100%;
            height: 100%;
        }
    }
}
.win_prize_yyg_bg {
    background-image: url("@/static/shared/images/bg_yiyuan_zhongjiang.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
}

</style>
