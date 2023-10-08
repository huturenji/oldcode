<template>
    <view class="luck-draw" :style="[contentBg]">
        <!-- 自定义返回按钮 -->
        <view v-if="showBack" @click="goBack" :style="[backStyle]" class="fixed_back">
            <u-icon name="arrow-left" size="22" color="#fff"></u-icon>
        </view>
        <view v-else @click="goHome" :style="[backStyle]" class="fixed_back">
            <u-icon name="home" size="22" color="#fff"></u-icon>
        </view>

        <!-- 活动规则和我的奖品 -->
        <view class="activity_rule" :style="[rule_style]" @click="toActivityRulePage" v-if="type" ></view>
        <view class="winprize_list" :style="[winprize_style]" @click="towinprizelistPage" v-if="type" ref="height"></view>

        <!-- 抽奖主体 -->
        <view :class="[contentClass[type]]" :style="[contentStyle]">
            <!-- 标题 -->
            <view class="luckTitle" :style="[draw_title]" v-if="type"></view>

            <template v-if="type === 1">
                <turntable
                    ref="turntable"
                    class="turnPage"
                    :prizeList="prizeList"
                    :prize-index="prizeIndex"
                    :turns-run="turnsRun"
                    :turnsNumber="7"
                    @checkRun="checkRun"
                    @start-turns="startTurns"
                    @end-turns="endTurns"
                />
            </template>

            <template v-if="type === 2">
                <hiteggs :num="3" :rowNum="3" @checkRun="checkRun" @hit="hit" />
            </template>

            <template v-if="type === 3">
                <squarenine
                    ref="squarenine"
                    :prize-list="prizeList"
                    :prize-index="prizeIndex"
                    @checkRun="checkRun"
                    @start-turns="startSquarenine"
                    @end-turns="endSquarenine"
                />
            </template>

            <template v-if="type === 4">
                <giftrain
                    ref="giftrain"
                    :rainRun="rainRun"
                    :rainTime="10000"
                    @checkRun="checkRun"
                    @startClick="startClick"
                    @gameOver="rainOver"
                    @start="rainStart"
                />
            </template>

            <!-- 剩余抽奖次数 -->
            <view class="tips" :style="[tipsStyle]" v-if="type" ref="offset">
                您今天还有{{ count === -1 ? '无数' : count }}次抽奖机会
            </view>
        </view>

        <!-- 无活动缺省图 -->
        <view v-if="!type && !loading" class="emptyBox">
            <image src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/empty/icon_defpage_zwnr.png" mode="widthFix" />
            <view>暂无抽奖活动</view>
        </view>

        <!-- 抽奖结果弹框 -->
        <uni-popup ref="lotteryResultPopup" :isMaskClick="false">
            <Result
                :activityId="activityId"
                :lotteryInfo="winPrizeInfo"
                :ifPreview="false"
                @closeLotteryResultModal="closeLotteryResultModal"
                @drawAgain="drawAgain"
            ></Result>
        </uni-popup>

        <!-- 弹框 -->
        <uni-popup ref="tipsPopup" type="dialog">
            <uni-popup-dialog
                type="warning"
                :content="tipsMessage"
                :duration="2000"
                @confirm="$refs.tipsPopup.close()"
            ></uni-popup-dialog>
        </uni-popup>
    </view>
</template>

<script>
import luckDrawMixins from './mixins/index.js'
import { getActivityDetail, remainCount, startToDraw } from '@/activitystudio/common/lib/handler.js'
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
            noCountCode: [91100008, 91100009], // 抽奖次数已用完状态码
            showBack: false
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
    computed: {
        drawCount() {
            // 活动未开始和结束后显示抽奖次数为0
            if (this.activityState === 2) {
                return this.count === -1 ? '无数': this.count
            } else {
                return 0
            }
        },
        backStyle(){
            let statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
            // 获取微信胶囊的位置信息 width,height,top,right,left,bottom
			const custom = uni.getMenuButtonBoundingClientRect()
            let navigationBarHeight = custom.height + (custom.top - statusBarHeight) * 2
            let top = statusBarHeight;
            try {
                top = parseInt((navigationBarHeight - 25) / 2) + statusBarHeight
            } catch (error) {
            }
            return {
                top: top  + 'px'
            }
        }
    },
    created(){
        this.judgeShowBack();
    },
    methods: {
        // 获取抽奖活动详情
        getLuckDetail() {
            this.loading = true;
            uni.showLoading()
            if (!this.activityId) {
                this.loading = false;
                uni.hideLoading();
                return
            }
            getActivityDetail({ activityId: this.activityId })
                .then(async res => {
                    if (res.resultCode === 0) {
                        
                        // 先获取剩余抽奖次数
                        await this.getResetCount()
                        const type = res.result.toolId
                        // 大转盘和九宫格需要根据屏幕高度进行缩放兼容不同手机尺寸
                        this.setScale(type)

                        // 获取奖品集合 对大转盘和九宫格填充谢谢参与
                        if (res.result.prizeList) {
                            res.result.prizeList.forEach(item => setDefaultImage(item))
                            this.setEmptyPrize(res.result.prizeList, type)
                        }

                        // 1-待启动；2-已启用；3-已结束
                        this.activityState = res.result.state;
                        if (this.activityState === 1 || this.activityState === 3) {
                            this.count = 0;
                            this.tipsMessage = this.activityState === 1 ? '活动未开始' : '活动已结束';
                            this.$refs.tipsPopup.open();
                        }
                        // 设置抽奖类型
                        this.type = type
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
        },
        // 更新剩余抽奖机会
        // 获取次数之前先判断是否为伴正事打开，不是则为0次。 2022/08/15修改
        getResetCount() {
            return new Promise(reolve => {
                remainCount({ activityId: this.activityId })
                    .then(res => {
                        if (res.resultCode === 0) {
                            this.count = res.result
                        } else {
                            this.count = 0
                            uni.showToast({ title: res.resultMessage, icon: 'none' })
                        }
                    })
                    .catch(err => {
                        uni.showToast({ title: '抽奖次数获取失败', icon: 'none' })
                        this.count = 0
                    })
                    .finally(() => {
                        reolve()
                    })
            })
        },
        // 获取抽奖结果 中奖: {}; 未中奖: null; 出错: 'err' userName mobile
        getLuckResult() {
            const { userPhone: mobile, userName } = getApp().globalData.userParams;
            return new Promise(resolve => {
                startToDraw({ activityId: this.activityId })
                    .then(res => {
                        if (res.resultCode === 0) {
                            if (!res.result.result) {
                                // 未中奖
                                // 大转盘和九宫格从未中奖数据中随机拿到一个索引
                                if (this.type === 1 || this.type === 3) {
                                    let emptyList = []
                                    this.prizeList.forEach((item, index) => {
                                        if (item.name === '谢谢参与') {
                                            emptyList.push(index)
                                        }
                                    })
                                    const randomIndex = Math.floor(Math.random() * emptyList.length)
                                    this.prizeIndex = emptyList[randomIndex]
                                }
                                resolve(null)
                            } else {
                                // 中奖
                                let prizeResult = res.result.prizeInfo
                                prizeResult.name = res.result.prizeInfo.prizeName
                                this.prizeList.forEach((item, index) => {
                                    if (item.prizeId === prizeResult.prizeId) {
                                        this.prizeIndex = index
                                    }
                                })
                                setDefaultImage(prizeResult)
                                resolve(prizeResult)
                            }
                        } else if(this.noCountCode.includes(res.resultCode)) {
                            uni.showToast({ title: '抱歉，您的抽奖次数已用完', icon: 'none' })
                            resolve('err')
                        } else if(this.errCode.hasOwnProperty(res.resultCode)) {
                            uni.showToast({ title: this.errCode[res.resultCode], icon: 'none' })
                            this.activityState = 3
                            this.tipsMessage = this.errCode[res.resultCode];
                            resolve('err')
                        } else {
                            uni.showToast({ title: res.resultMessage, icon: 'none' })
                            resolve(null)
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                        uni.showToast({ title: '活动太火爆了，稍后再试！', icon: 'none' })
                        resolve('err')
                    })
            })
        },
        // 跳转规则页
        toActivityRulePage() {
            uni.navigateTo({ url: `/activitystudio/rule/index?activityId=${this.activityId}` });
        },
        towinprizelistPage(){
            uni.navigateTo({ url: `/activitystudio/list/index?activityId=${this.activityId}` })
        },
        // 回退
        goBack(){
            uni.navigateBack()
        },
        judgeShowBack(){
            const pages = getCurrentPages(); //当前页面栈
            this.showBack = pages && pages.length > 1 
        },
        goHome() {
            uni.switchTab({
                url: '/pages/index/index'
            })
        }, 
    }
};
</script>

<style lang="scss" scoped>
@import './style/index.scss';
</style>
