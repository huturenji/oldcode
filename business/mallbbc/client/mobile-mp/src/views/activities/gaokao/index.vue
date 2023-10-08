<!-- 支付页面 -->
<template>
    <view class="container">
        <u-navbar title="答题" autoBack :bgColor="navbarBgColor" :titleStyle="{ color: titleColor }"></u-navbar>
        <view class="subject_header"></view>
        <view class="subject_container">
            <view>
                <view class="title">
                    问题 <text style="font-size: 36rpx;margin: 0 4rpx;">{{ current }}</text> / 5
                </view>
                <view class="question">{{ currentSubject.question }}</view>
                <view class="options">
                    <view
                        v-for="(item, index) in currentSubject.options"
                        :key="item"
                        @click="answer(index)"
                        :class="[answerClass(index)]"
                    >
                        <image v-if="answerClass(index) === 'right'" src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/operations/gaokao/right.svg" />
                        <image v-if="answerClass(index) === 'wrong'" src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/operations/gaokao/wrong.svg" />
                        <text>{{ item }}</text>
                    </view>
                </view>
            </view>
            <view v-if="current === 5 && myAnswer !== null" class="next confirm" @click="next"></view>
            <view v-else @click="next" class="next"></view>
            <view class="banner" :style="[{ backgroundImage: 'url(' + bannerMap[current] +')' }]"></view>
        </view>
    </view>
</template>
<script>
import { subjects } from './subject.js'

export default {
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            subjectList: [],
            current: 1,
            myAnswer: null,
            rightCount: 0,
            bannerMap: {
                1: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/operations/gaokao/pic_gaokao_banner1.png',
                2: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/operations/gaokao/pic_gaokao_banner2.png',
                3: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/operations/gaokao/pic_gaokao_banner3.png',
                4: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/operations/gaokao/pic_gaokao_banner4.png',
                5: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/operations/gaokao/pic_gaokao_banner5.png'
            },
            pointRange: {
                0: [400, 500],
                1: [400, 500],
                2: [589, 609],
                3: [620, 649],
                4: [660, 689],
                5: [700, 729]
            },
            navbarBgColor: 'transparent',
            titleColor: '#fff',
        }
    },
    onPageScroll(e) {
        if (e.scrollTop > 60) {
            this.navbarBgColor = '#fff';
            this.titleColor = '#000';
        } else {
            this.navbarBgColor = 'transparent';
            this.titleColor = '#fff';
        }
    },
    computed: {
        currentSubject() {
            return this.subjectList[this.current - 1] || {}
        },
        // 回答 正确/错误 class
        answerClass() {
            return index => {
                let answerClass = ''
                if (this.myAnswer !== null) {
                    if (this.myAnswer === index && this.myAnswer === this.currentSubject.answer) {
                        answerClass = 'right'
                    } else if (this.myAnswer === index && this.myAnswer !== this.currentSubject.answer) {
                        answerClass = 'wrong'
                    } else if (this.myAnswer !== this.currentSubject.answer && index === this.currentSubject.answer) {
                        answerClass = 'right'
                    }
                }
                return answerClass
            }
        }
    },
    mounted() {
        this.initSubject()
    },
    methods: {
        // 初始化题目
        initSubject() {
            let list = []
            let rangeMap = {
                0: 3,
                1: 3,
                2: 5,
                3: 5,
                4: 4
            }
            // 巨拾惠中随机取一题
            for (let i = 0; i < subjects.length; i++) {
                let index = Math.floor(Math.random() * rangeMap[i])
                list.push(subjects[i][index])
            }

            this.subjectList = list
        },
        answer(index) {
            if (this.myAnswer !== null) { return }
            if (index === this.currentSubject.answer) {
                this.rightCount += 1
            }
            this.myAnswer = index
        },
        next() {
            if (this.myAnswer === null) { return }
            if (this.current === 5) {
                this.confirm()
                return
            }

            this.myAnswer = null
            this.current += 1
        },
        confirm() {
            let min = this.pointRange[this.rightCount][0]
            let max = this.pointRange[this.rightCount][1]
            let point = Math.floor(Math.random() * (max - min)) + min
            this.$Router.push({
                path: '/views/activities/gaokao/score',
                query: {
                    score: point
                }

            })
        }
    }
}
</script>
<style lang="scss" scoped>
.container {
    width: 100%;
    min-height: 100vh;
    padding-top: 200rpx;
    background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/operations/gaokao/pic_gaokao_datibeijing.png');
    background-size: 100% 100%;

    .subject_header {
        height: 176rpx;
        background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/operations/gaokao/pic_gaokao_dati1.png');
        background-size: 100% 100%;
    }

    > .subject_container {
        position: relative;
        padding: 76rpx 120rpx 32rpx;
        height: 1200rpx;
        border-radius: 20rpx;
        background-color: #fff;
        margin-bottom: 10rpx;
        background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/operations/gaokao/pic_gaokao_dati2.png');
        background-size: 100% 100%;

        > view:first-child {
            .title {
                font-size: 32rpx;
                color: #086457;
                text-align: center;
            }

            .question {
                font-size: 30rpx;
                margin: 40rpx 20rpx;
                color: #fff;
            }

            .options > view {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                padding: 20rpx;
                line-height: 50rpx;
                font-size: 28rpx;
                color: #003f52;
                border-radius: 9999rpx;
                background: linear-gradient(180deg,#eafaff 3%, #a8eaff 99%);
                font-weight: bold;
                margin-top: 28rpx;
                word-break: break-all;

                &.right {
                    background: linear-gradient(180deg,#46d9c5 0%, #00ae90 99%);
                    border: 3rpx solid #fff;
                    line-height: 47rpx;
                    color: #fff;
                }

                &.wrong {
                    background: linear-gradient(180deg,#ffac5c 0%, #f72525 99%);
                    border: 3rpx solid #fff;
                    line-height: 47rpx;
                    color: #fff;
                }

                > image {
                    width: 36rpx;
                    height: 36rpx;
                    margin-right: 10rpx;
                }
            }
        }

        .next {
            position: absolute;
            left: 50%;
            top: 690rpx;
            transform: translateX(-50%);
            width: 370rpx;
            height: 112rpx;
            background-image: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/operations/gaokao/btn_gaokao_xiayiti.png');
            background-size: 100% 100%;

            &.confirm {
                background-image: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/operations/gaokao/btn_gaokao_tijiao.png');
            }
        }

        .banner {
            position: absolute;
            left: 50%;
            bottom: 120rpx;
            transform: translateX(-50%);
            width: 656rpx;
            height: 172rpx;
            background-size: 100% 100%;
        }
    }
}
</style>