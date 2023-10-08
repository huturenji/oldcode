<!--抽奖弹窗页-->
<template>
    <view
        :class="['container', ifGetPrize ? 'win_prize_bg' : 'not_win_prize_bg']"
    >
        <view class="content_wrap">
            <view class="content">
                <image class="lottery_img" :src="lotteryInfo.imgUrl"> </image>
                <view class="lottery_name">
                    {{ ifGetPrize ? `[${lotteryInfo.name}]` : "哎呀，差一点就中奖啦！" }}
                </view>
                <view class="get_btn">
                    <view class="searchBtn" @click="checkPrizeDetail">
                        {{ ifGetPrize ? "立即领奖" : "再玩一次" }}
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
export default {
    name: "result",
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
        }
    },
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl
        };
    },
    computed: {
        // 是否获奖
        ifGetPrize() {
            return this.lotteryInfo.name !== "谢谢参与";
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
                } else {
                    url = `/pages/redeem-page/redeem-page?winCertificate=${winCertificate}&activityId=${this.activityId}`
                }
                uni.navigateTo({ url });
                this.$emit("closeLotteryResultModal");
            } else {
                this.$emit('drawAgain');
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
        padding-top: 280rpx;
        overflow: hidden;

        .content {
            padding: 24rpx 40rpx 48rpx 40rpx;
            text-align: center;
            .lottery_img {
                width: 192rpx;
                height: 192rpx;
                border-radius: 6rpx;
            }
            .lottery_name {
                margin: 24rpx 0 70rpx;
                font-size: 28rpx;
                text-align: center;
                text-overflow: ellipsis; /* 超出部分省略号 */
                overflow: hidden;
                word-break: break-all; /* break-all(允许在单词内换行。) */
                -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
                -webkit-line-clamp: 2; /** 显示的行数 **/
                display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
            }
            .good_name_other_class {
                margin-bottom: 64rpx;
            }

            .activityRule {
                font-size: 28rpx;
                margin: 20rpx 0;
            }

            .activityRule {
                text-align: left;
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
.win_prize_bg,
.not_win_prize_bg {
    background-repeat: no-repeat;
    background-size: 100% 100%;
}

.win_prize_bg {
    background-image: url("@/static/shared/images/bg_lql_zhongjiang.png");
}

.not_win_prize_bg {
    background-image: url("@/static/shared/images/bg_lql_weizhongjiang.png");
}
</style>
