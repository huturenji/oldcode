<template>
    <view class="container">
        <view class="rule_title">活动规则</view>
        <view class="rule_content" v-html="rule"></view>
    </view>
</template>

<script>
import { getActivityDetail, getPreActivityDetail } from '@/common/lib/handler.js'

export default {
    name: "rule",
    data() {
        return {
            activityId: '',
            type: '',
            rule: ''
        }
    },
    onLoad({ activityId, type }) {
        // activityId 活动id;  type 活动类型 存在时为临时活动id
        this.activityId = activityId
        this.type = type

        this.getLuckDetail()
    },
    methods: {
        // 获取活动信息，拿到活动规则
        getLuckDetail() {
            if (!this.activityId) {
                return
            }
            if (this.type) {
                getPreActivityDetail({ activityId: this.activityId })
                    .then(res => {
                        if (res.resultCode === 0) {
                            // 设置活动规则
                            this.rule = res.result.desc
                        } else {
                            uni.showToast({ title: '活动规则加载失败！', icon: 'none' })
                        }
                    })
                    .catch(() => {
                        uni.showToast({ title: '活动规则加载失败！', icon: 'none' })
                    })
            } else {
                getActivityDetail({ activityId: this.activityId })
                    .then(res => {
                        if (res.resultCode === 0) {
                            // 设置活动规则
                            this.rule = res.result.desc
                        } else {
                            uni.showToast({ title: '活动规则加载失败！', icon: 'none' })
                        }
                    })
                    .catch(() => {
                        uni.showToast({ title: '活动规则加载失败！', icon: 'none' })
                    })
            }
        }
    },
};
</script>

<style lang="scss" scoped>
uni-page-body {
    height: 100%;
}
.container {
    background: #ffffff;
    padding: 0 40rpx;
    height: 100%;
    overflow: scroll;
    .rule_title {
        height: 84rpx;
        padding-top: 32rpx;
        padding-bottom: 16rpx;
        font-size: 28rpx;
        font-weight: bold;
    }

    .rule_content{
        height: calc(100% - 84rpx);
        padding-bottom: 20rpx;
        overflow: scroll;
    }
}
</style>