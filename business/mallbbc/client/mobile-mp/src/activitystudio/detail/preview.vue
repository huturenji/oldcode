<!-- 预览奖品详情-未兑换 -->
<template>
    <view class="container">
        <view class="win_get">
            <view class="content_wrap">
                <!-- 图片区 -->
                <image class="prize_img" :src="winPrizeInfo.imgUrl"> </image>

                <view class="prize_congratulation">恭喜你获得</view>

                <!-- 商品名称 -->
                <view class="prize_name">
                    {{ `[${winPrizeInfo.name}]` }}
                </view>

                <!-- 线上奖品领取按钮 -->
                <view class="btn_wrapper">
                    <button
                        v-if="winPrizeInfo.sku"
                        type="warn"
                        class="searchBtn"
                        :disabled="true"
                        @click="getLottery"
                    >
                        立即兑奖
                    </button>

                    <!-- 线下奖品领取按钮 -->
                    <button v-else type="warn" class="searchBtn" :disabled="true">
                        保存兑奖凭证
                    </button>
                </view>

                <!-- 保存兑奖凭证 -->
                <view
                    v-if="winPrizeInfo.sku"
                    class="save_voucher"
                    :style="{ opacity: '0.5' }"
                    @click.prevent="saveAwardProof"
                >
                    保存兑奖凭证
                </view>

                <!-- 中奖信息 -->
                <view class="prize_info" v-if="false">
                    <view class="info_title"> 中奖相关信息 </view>
                    <view class="info_item">
                        <view>活动名称：</view>
                        <view class="activity_content">
                            {{ winPrizeInfo.activityName }}
                        </view>
                    </view>
                    <view class="info_item">
                        <view>中奖时间：</view>
                        <view>{{ winPrizeInfo.winTime }}</view>
                    </view>
                    <view class="info_item">
                        <view>主办企业：</view>
                        <view>{{ winPrizeInfo.companyName }}</view>
                    </view>
                </view>
            </view>
            <view class="activity_rule" @click="toActivityRulePage">活动规则</view>
        </view>
    </view>
</template>

<script>
export default {
    name: "previewRedeemPage",
    data() {
        return {
            // 获奖信息
            winPrizeInfo: {},
            activityId: '',
            previewType: false
        };
    },
    onLoad({ activityId, type }) {
        this.activityId = activityId
        this.previewType = Boolean(type)
    },
    mounted() {
        uni.getStorage({
            key: 'lotteryInfo',
            success: (res) => {
                this.winPrizeInfo = JSON.parse(res.data)
            }
        })
    },
    methods: {
        // 跳转活动规则页
        toActivityRulePage() {
            let url = `/activitystudio/rule/index?activityId=${this.activityId}`
            if (this.previewType) {
                url += '&type=1'
            }
            uni.navigateTo({ url });
        },
        // 立即领取
        getLottery() {},
    },
};
</script>
<style lang="scss" scoped>
@import './style/index.scss';
</style>
