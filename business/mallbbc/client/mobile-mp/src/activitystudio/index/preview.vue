<template>
    <view class="luck-draw" :style="contentBg">
        <view class="activity_rule" :style="rule_style" @click="toActivityRulePage" v-if="type"></view>
        <view :class="[contentClass[this.type]]" >
            <!-- 标题 -->
            <view class="luckTitle" :style="draw_title" v-if="type"></view>

            <template v-if="type === 1">
                <turntable
                    ref="turntable"
                    class="turnPage"
                    :prizeList="prizeList"
                    :prize-index="prizeIndex"
                    :turns-run="turnsRun"
                    :turnsNumber="7"
                    :checkRun="checkRun"
                    @start-turns="startTurns"
                    @end-turns="endTurns"
                />
            </template>

            <template v-if="type === 2">
                <hiteggs :num="3" :rowNum="3" :checkRun="checkRun" @hit="hit" />
            </template>

            <template v-if="type === 3">
                <squarenine
                    ref="squarenine"
                    :prize-list="prizeList"
                    :prize-index="prizeIndex"
                    :checkRun="checkRun"
                    @start-turns="startSquarenine"
                    @end-turns="endSquarenine"
                />
            </template>

            <template v-if="type === 4">
                <giftrain
                    ref="giftrain"
                    :rainRun="rainRun"
                    :rainTime="10000"
                    :checkRun="checkRun"
                    @startClick="startClick"
                    @gameOver="rainOver"
                    @start="rainStart"
                />
            </template>

            <!-- 剩余抽奖次数 -->
            <view class="tips" :style="tipsStyle" v-if="type">
                您今天还有{{ count === -1 ? '无数' : count }}次抽奖机会
            </view>
        </view>

        <!-- 无活动缺省图 -->
        <view v-if="!type && !loading" class="emptyBox">
            <image src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/empty/icon_defpage_zwnr.png" mode="widthFix" />
            <view>暂无抽奖活动</view>
        </view>

        <uni-popup ref="lotteryResultPopup" :isMaskClick="false">
            <Result
                :activityId="activityId"
                :lotteryInfo="winPrizeInfo"
                :ifPreview="true"
                :previewType="previewType"
                @closeLotteryResultModal="closeLotteryResultModal"
                @drawAgain="drawAgain"
            ></Result>
        </uni-popup>
        <uni-popup ref="tipsPopup" type="dialog">
            <uni-popup-dialog
                type="warning"
                :content="tipsMessage"
                :duration="2000"
            ></uni-popup-dialog>
        </uni-popup>
    </view>
</template>

<script>
import luckDrawMixins from './mixins/index.js'
import { getActivityDetail, getPreActivityDetail } from '@/activitystudio/common/lib/handler.js'
import { setDefaultImage } from '@/utils/common.js'
import turntable from "@/activitystudio/components/turntable";
import hiteggs from "@/activitystudio/components/hiteggs";
import squarenine from "@/activitystudio/components/squarenine";
import giftrain from "@/activitystudio/components/giftrain";
import Result from "@/activitystudio/components/result/result.vue";
import uniPopup from '@/common/components/uni-popup/uni-popup.vue';
import uniPopupDialog from '@/common/components/uni-popup/uni-popup-dialog.vue';
export default {
    mixins: [luckDrawMixins],
    data() {
        return {
            previewType: false
        }
    },
    components: {
        turntable,
        hiteggs,
        squarenine,
        giftrain,
        Result,
        uniPopup,
        uniPopupDialog
    },
    onLoad({ type }) {
        this.previewType = Boolean(type)
    },
    methods: {
        // 获得抽奖活动详情
        getLuckDetail() {
            // 预览抽奖 previewType 存在时使用 activityId 临时的接口
            if (this.previewType) {
                getPreActivityDetail({ activityId: this.activityId })
                    .then(async res => {
                        if (res.resultCode === 0) {
                            this.detailCallBack(res)
                        } else if(this.errCode.hasOwnProperty(res.resultCode)) {
                            uni.showToast({ title: this.errCode[res.resultCode], icon: 'none' })
                        } else {
                            uni.showToast({ title: res.resultMessage, icon: 'none' })
                        }
                    })
                    .catch(() => {
                        uni.showToast({ title: '抽奖页面加载失败！', icon: 'none' })
                    })
                    .finally(e => {
                        this.loading = false;
                        uni.hideLoading();
                    })
            } else {
                getActivityDetail({ activityId: this.activityId })
                    .then(async res => {
                        if (res.resultCode === 0) {
                            this.detailCallBack(res)
                        } else if(this.errCode.hasOwnProperty(res.resultCode)) {
                            uni.showToast({ title: this.errCode[res.resultCode], icon: 'none' })
                        } else {
                            uni.showToast({ title: res.resultMessage, icon: 'none' })
                        }
                    })
                    .catch(() => {
                        uni.showToast({ title: '抽奖页面加载失败！', icon: 'none' })
                    })
                    .finally(e => {
                        this.loading = false;
                        uni.hideLoading();
                    })
            }
        },
        detailCallBack(res) {
            // 先获取剩余抽奖次数
            // 获取次数之前先判断是否为伴正事打开，不是则为0次。 2022/08/15修改
            this.count = 5
            const type = res.result.toolId
            // 大转盘和九宫格需要根据屏幕高度进行缩放兼容不同手机尺寸
            this.setScale(type)

            // 获取奖品集合 对大转盘和九宫格填充谢谢参与
            if (res.result.prizeList) {
                res.result.prizeList.forEach(item => setDefaultImage(item))
                this.setEmptyPrize(res.result.prizeList, type)
            }

            // 1-待启动；2-已启用；3-已结束
            this.activityState = 2

            // 设置抽奖类型
            this.type = type
            this.setTitle()
        },
        // 获取抽奖次数
        getResetCount() {
            this.count -= 1
        },
        // 模拟中奖结果
        getLuckResult() {
            return new Promise(resolve => {
                const index = Math.floor(Math.random() * this.prizeList.length)
                this.prizeIndex = index
                if (this.prizeList[index].name === '谢谢参与') {
                    resolve(null)
                } else {
                    resolve(this.prizeList[index])
                    // 中奖后将数据存放于 storage
                    uni.setStorage({
                        key: 'lotteryInfo',
                        data: JSON.stringify(this.prizeList[index]),
                        success: function () {}
                    })
                }
            })
        },
        // 跳转规则页
        toActivityRulePage() {
            let url = `/activitystudio/rule/index?activityId=${this.activityId}`
            if (this.previewType) {
                url += '&type=1'
            }
            uni.navigateTo({ url });
        },
    }
};
</script>

<style lang="scss" scoped>
@import './style/index.scss';
</style>
