<template>
    <view class="guide-con" v-if="showIndexGuide && !hasViewedIndexGuide">
        <view class="guide-inner" :style="{ height: `calc(100% - ${totalTabbarHeight})`, bottom: totalTabbarHeight }">
            <block v-for="step in steps" :key="step.stepIndex">

                <view v-show="stepIndex == step.stepIndex" :class="`step${step.stepIndex + 1}`">

                    <!-- 跳过按钮 -->
                    <view class="skip" @click="setViewedIndexGuide">跳过</view>

                    <!-- 购物引导页比较复杂，单独写 -->
                    <block v-if="step.stepIndex == 0">
                        <view class="tip-image-wrapper1">
                            <image mode="widthFix" class="tip-image1" :class="{ 'show-slide-guide': slideGuideVisible }"
                                :src="step.tipImage1()"></image>
                            <image mode="widthFix" class="tip-image2" :src="step.tipImage2()"></image>
                            <image mode="widthFix" class="tip-image3" :src="step.tipImage3()"></image>
                            <image mode="widthFix" class="tip-image4" :class="{ 'show-slide-guide': slideGuideVisible }"
                                :src="step.tipImage4()"></image>
                            <view class="scroll-box">
                                <view class="scroll-image"
                                    :style="{ 'backgroundPositionY': `${backgroundPositionYPercent1}%`, 'transform': `translateY(${transformYPercent}%)` }">
                                </view>
                                <view class="scroll-image"
                                    :style="{ 'backgroundPositionY': `${backgroundPositionYPercent2}%`, 'transform': `translateY(${transformYPercent}%)` }">
                                </view>
                            </view>
                        </view>
                    </block>
                    <block v-else>
                        <view :class="`tip-image-wrapper${step.stepIndex + 1}`">
                            <image mode="widthFix" class="tip-image" :src="step.tipImage()"></image>
                        </view>
                    </block>

                    <!-- 下一步按钮 -->
                    <view :class="`next-step-image-wrapper${step.stepIndex + 1}`">
                        <image mode="widthFix" class="next-step-image" :src="step.nextStepImage()" @click="nextStep">
                        </image>
                    </view>

                    <!-- 底部tabbar突出显示 -->
                    <view :class="`tab-image-wrapper${step.stepIndex + 1}`"
                        :style="{ bottom: `calc(-1 * ${totalTabbarHeight})` }">
                        <image mode="heightFix" class="tab-image" :src="step.tabImage()"
                            :style="{ height: totalTabbarHeight }"></image>
                    </view>
                </view>
            </block>
        </view>

    </view>
</template>

<script>

export default {
    data() {
        return {
            stepIndex: 0,
            steps: [
                {
                    stepIndex: 0,
                    nextStepImage: () => this.imgUrl + 'guide/step1_nextstep.png',
                    tipImage1: () => this.imgUrl + 'guide/step1_tip1.png',
                    tipImage2: () => this.imgUrl + 'guide/step1_tip2.png',
                    tipImage3: () => this.imgUrl + 'guide/step1_tip3.png',
                    tipImage4: () => this.imgUrl + 'guide/step1_huadong.png',
                    tabImage: () => this.imgUrl + 'guide/step1_tab.png'
                },
                {
                    stepIndex: 1,
                    nextStepImage: () => this.imgUrl + 'guide/step2_nextstep.png',
                    tipImage: () => this.imgUrl + 'guide/step2_tip.png',
                    tabImage: () => this.imgUrl + 'guide/step2_tab.png'
                },
                {
                    stepIndex: 2,
                    nextStepImage: () => this.imgUrl + 'guide/step3_nextstep.png',
                    tipImage: () => this.imgUrl + 'guide/step3_tip.png',
                    tabImage: () => this.imgUrl + 'guide/step3_tab.png'
                }
            ],
            imgUrl: getApp().globalData.imgUrl,

            showIndexGuide: true, // 是否显示首页引导，优先于缓存中的判断
            backgroundPositionYPercent1: 0, // 第一个滚动背景图的初始位置： 百分比值
            backgroundPositionYPercent2: 0, // 第二个滚动背景图的初始位置： 百分比值， 因为有过渡效果，稍微往下调了一下
            transformYPercent: 0, // 两张滚动图的Y偏移量， 第一张图滚动完成之后，两个图的位置总体向上移动100%
            slideGuideVisible: false,
            tabbarHeight: '55px',
            tabbarBorder: 0,
            totalTabbarHeight: '55px'
        }
    },
    computed: {
        // 判断是否已经浏览过首页引导
        hasViewedIndexGuide() {
            let hasViewGuideFlag = this.$getStorageSync('hasViewedIndexGuide');
            return hasViewGuideFlag;
        }
    },
    created() {
        this.getTabbarData();
        this.setBackgroundTransition();
    },
    beforeDestroy() {
        this.clearTimeout(this.timer);
    },
    methods: {
        // 设置引导图宽高等属性
        async getTabbarData() {
            let { config } = await window.onTabBarLoad;

            if (config?.visible) {
                this.tabbarHeight = config.height;
                this.tabbarBorder = config.borderDisplay ? config.borderWidth : '0';
                this.totalTabbarHeight = Number(this.tabbarHeight.replace('px', '')) + Number(this.tabbarBorder.replace('px', '')) + 'px';
            }

        },
        clearTimeout(timerId) {
            if (timerId) {
                clearTimeout(timerId);
                timerId = null;
            }
        },
        // 下一步
        nextStep() {
            // 最后一步
            if (this.stepIndex >= this.steps.length - 1) {
                this.setViewedIndexGuide();
                return
            }
            this.stepIndex += 1;

        },
        // 设置浏览过了首页引导
        setViewedIndexGuide() {
            this.$setStorageSync('hasViewedIndexGuide', true);
            this.showIndexGuide = false; // 隐藏引导页
            this.$nextTick(this.$destroy);
        },
        sleep(timeout) {
            return new Promise(resolve => {
                this.clearTimeout(this.timer);
                this.timer = setTimeout(() => {
                    resolve()
                }, timeout)
            })

        },
        setBackgroundTransition() {
            this.$nextTick(async () => {
                // 等待1.5s在过渡
                await this.sleep(2000);
                this.backgroundPositionYPercent1 = 100;
                // 第一张图滑动6s + 多停顿 0.5s
                await this.sleep(8500);
                this.slideGuideVisible = true;
                // 引导经过2s过渡开启
                await this.sleep(2000);
                this.slideGuideVisible = false;
                // 引导经过2s过渡关闭+ 多停顿 0.5s
                await this.sleep(2500);
                this.transformYPercent = -100;
                // 等待切换到第二张图 经过1.5s切换到下一张图，
                await this.sleep(3000);

                this.backgroundPositionYPercent2 = 100;
            })

        }
    }
}

</script>

<style lang="scss" scoped>
.guide-con {
    background-color: rgba($color: #000000, $alpha: 0.7);
    height: 100%;
    width: 750rpx;
    position: fixed;
    bottom: 0;
    left: calc((100% - 750rpx) / 2);
    z-index: 999;

    .guide-inner {
        background: transparent;
        width: 750rpx;
        position: absolute;
        left: calc(50% - 750rpx/2);
    }
}

.skip {
    width: 180rpx;
    height: 68rpx;
    border: 2rpx solid #ffffff;
    border-radius: 16rpx;
    color: #fff;
    font-size: 28rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: calc(14% - var(--titleBarFillHeight));
    right: 54rpx;
    z-index: 11;
}

.tip-image-wrapper1 {
    position: absolute;
    width: 638rpx;
    right: 54rpx;
    bottom: 0;

    .scroll-box {
        border-radius: 16rpx;
        position: absolute;
        bottom: 312rpx;
        width: 638rpx;
        height: 440rpx;
        overflow: hidden;

        .scroll-image:nth-child(1) {
            height: 440rpx;
            background-repeat: no-repeat;
            background-size: 100% auto;
            background-image: url('@/static/shared/guide/step1_yqm.png');
            transition: transform 1.5s cubic-bezier(1, -0.12, .95, .97), background-position 8s cubic-bezier(.17, 0, .78, 1);
        }

        .scroll-image:nth-child(2) {
            height: 440rpx;
            background-repeat: no-repeat;
            background-size: 100% auto;
            background-image: url('@/static/shared/guide/step1_mrms.png');
            transition: transform 1.5s cubic-bezier(1, -0.12, .95, .97), background-position 3s cubic-bezier(.17, 0, .78, 1);
        }
    }

    .show-slide-guide {
        opacity: 1 !important;
        visibility: visible !important;
    }

    .tip-image1 {
        width: 360rpx;
        height: 48rpx;

        position: absolute;
        z-index: 10;
        left: calc(50% - 180rpx);
        bottom: 364rpx;
        opacity: 0;
        visibility: hidden;
        transition: all 1s linear;
    }

    .tip-image2 {
        width: 650rpx;
        height: 240rpx;

        position: absolute;
        bottom: 780rpx;
        left: -12rpx;
    }

    .tip-image3 {
        width: 300rpx;
        height: 316rpx;

        position: absolute;
        bottom: 0;
        left: 10rpx;
    }

    .tip-image4 {
        width: 44rpx;
        height: 294rpx;

        position: absolute;
        bottom: 388rpx;
        right: 38rpx;
        z-index: 10;
        opacity: 0;
        visibility: hidden;
        transition: all 1s linear;
        -webkit-animation: shaking 2s linear infinite;
        animation: shaking 2s linear infinite;
    }
}

.tip-image-wrapper2,
.tip-image-wrapper3 {
    position: absolute;
    bottom: 0;
    right: 54rpx;
}

.tip-image-wrapper3 {
    .tip-image {
        width: 408rpx;
        height: 320rpx;
    }
}

.next-step-image-wrapper1 {
    position: absolute;
    bottom: 206rpx;
    right: 54rpx;
}

.next-step-image-wrapper2,
.next-step-image-wrapper3 {
    position: absolute;
    bottom: 262rpx;
    right: 54rpx;
}


.next-step-image {
    width: 200rpx;
    height: 68rpx;
}


.tab-image-wrapper1 {
    position: absolute;
    left: 30rpx;
    display: flex;

    .tab-image {
        width: 110rpx;
    }
}

.tab-image-wrapper2 {
    position: absolute;
    left: 200rpx;
    display: flex;

    .tab-image {
        width: 170rpx;
    }
}

.tab-image-wrapper3 {
    position: absolute;
    left: 374rpx;
    display: flex;

    .tab-image {
        width: 170rpx;
    }
}


@-webkit-keyframes shaking {
    25% {
        -webkit-transform: translateY(-10rpx);
    }

    50%,
    100% {
        -webkit-transform: translateY(0);
    }

    75% {
        -webkit-transform: translateY(10rpx);
    }
}

@keyframes shaking {
    25% {
        transform: translateY(-10rpx);
    }

    50%,
    100% {
        transform: translateY(0);
    }

    75% {
        transform: translateY(10rpx);
    }
}

@media screen and (max-height: 640px) {

    /*当屏幕g高度小于640px时，应用下面的CSS样式*/
    .step1 {
        .tip-image-wrapper1 {
            bottom: -150rpx;

            .tip-image3 {
                width: 150rpx;
                height: 170rpx;
                bottom: 150rpx;
                left: 20rpx;
            }


        }

        .next-step-image-wrapper1 {
            bottom: 30rpx;

        }
    }

}
</style>