<template>
    <view class="giftrain">
        <view class="giftrain-content" v-show="showMask">
            <view class="timeBefore" v-show="timeBeforeLeft > 0">
                <view :class="'timeBeforeNum timeBeforeNum_' + timeBeforeLeft"></view>
            </view>
            <view class="timeLeft" v-if="isGaming">
                <view>剩余时间</view>
                <view class="num-font">{{ timeLeftStr }}</view>
            </view>
            <!-- 红包 -->
            <img
                v-for="(item, index) in rainList"
                :key="item.id"
                class="giftrain-content-rainimg"
                :style="item.hasSelected ? seclected(item.width, item.height) : rainImgStyle(item.width, item.height, item.x, item.y)"
                @click.stop="touchStart(item)"
                :src="item.img"
            />

            <!-- 红包的点击动画备份 -->
            <img
                v-for="(item, index) in aniList"
                :key="item.id + item.id"
                class="giftrain-content-rainimg giftrainSelect"
                :style="rainImgStyle(item.width, item.height, item.x, item.y)"
                :src="item.img"
            />
        </view>
        <!-- 开始按钮 -->
        <view class="startRain" @click="start"></view>
        <view class="startPointer" v-show="!showMask"></view>
    </view>
</template>

<script>
    import { getQuerySelector } from '@/utils/common'

    export default {
        props: {
            rainWidth: {
                type: Number,
                default: 100,
            },
            rainHeight: {
                type: Number,
                default: 100,
            },
            // 检测是否可进行抽奖
            checkRun: {
                type: Function,
                default: () => { return true }
            },
            // 红包雨时间
            rainTime: {
                type: Number,
                default: 30000,
            },
            // 红包数量
            rainNum: {
                type: Number,
                default: 6
            },
            // 红包图片
            rainImg: {
                type: String,
                default: `${getApp().globalData.imgUrl}giftrain/icon_cj_hby_hongbao.png`
            }
        },
        data() {
            return {
                rainContent: {},
                timeBeforeLeft: 3, // 倒计时开始三秒
                timeLeft: 0, // 游戏时间倒计时
                showMask: false,
                isGaming: false, // 游戏是否进行中 true: 进行中; false: 已结束
                rainList: [],
                aniList: [],
                numList: [],
                gameTimer: null,
                requestAnimationFrame: null,
                leftTimer: null
            }
        },
        computed: {
            timeLeftStr() {
                let m = Math.floor(this.timeLeft / 60)
                let s = this.timeLeft % 60
                m = m >= 10 ? m.toString() : '0' + m
                s = s >= 10 ? s.toString() : '0' + s
                return m + ':' + s
            }
        },
        async mounted() {
            this.timeLeft = parseInt(this.rainTime / 1000)
            this.rainContent = await getQuerySelector('.giftrain', false, this)
        },
        methods: {
            // 点击开始按钮
            start() {
                if (!this.checkRun()) { return }
                this.$emit('startClick')
                this.showMask = true

                let timer
                let setTimeBefore = () => {
                    timer = setTimeout(() => {
                        if (this.timeBeforeLeft === 1) {
                            this.timeBeforeLeft = 0
                            clearTimeout(timer)
                            this.startRain()
                        } else {
                            this.timeBeforeLeft -= 1
                            setTimeBefore()
                        }
                    }, 1000)
                }
                setTimeBefore()
            },
            // 开始游戏
            startRain() {
                this.init();
                this.rainList = [];
                this.aniList = [];
                this.isGaming = true
                this.addRainList();
                this.gameTimer = setTimeout(() => {
                    this.rainOver();
                }, this.rainTime);
                this.render();
                this.computedTime() // 计算剩余时间
                this.$emit("start")
            },
            init() {
                // 重置相关数据
                this.rainList = [];
                this.numList = []
                this.gameTimer && clearTimeout(this.gameTimer);
                this.requestAnimationFrame && window.cancelAnimationFrame(this.requestAnimationFrame);
            },
            computedTime() {
                this.leftTimer = setTimeout(() => {
                    this.timeLeft -= 1
                    if (this.timeLeft > 0) {
                        this.computedTime()
                    }
                }, 1000)
            },
            rainOver() {
                this.$emit("gameOver", this.numList.length)
                this.isGaming = false
                this.timeBeforeLeft = 3  // 重置倒计时三秒
                this.timeLeft = parseInt(this.rainTime / 1000) // 重置游戏倒计时
                this.showMask = false  // 关闭遮罩
                this.leftTimer && clearTimeout(this.leftTimer)
                this.init();
            },
            render() {
                if (!this.isGaming) return;
                let height = this.rainContent.height;
                let x = this.rainContent.width - this.rainWidth;
                this.rainList.forEach((item) => {
                    if (item.y > height + 80) {
                        item.y = 0;
                        item.x = Math.floor(x * Math.random());
                    }
                    item.y += item.speed;
                });
                this.requestAnimationFrame = window.requestAnimationFrame(this.render);
            },
            addRainList() {
                // 红包和金币的数组，比例为 2:1
                let rainList = [
                    { img: `${getApp().globalData.imgUrl}giftrain/icon_cj_hby_hongbao.png`, width: 100, height: 100, rainType: 1 },
                    { img: `${getApp().globalData.imgUrl}giftrain/icon_cj_hby_hongbao.png`, width: 100, height: 100, rainType: 1 },
                    { img: `${getApp().globalData.imgUrl}giftrain/icon_cj_hby_jinbi.png`, width: 50, height: 50, rainType: 2 },
                ]
                let timeout = setInterval(() => {
                    // 从红包和金币雨中随机添加一个
                    let rainRandomIndex = Math.floor(Math.random() * 3)
                    let { img, width, height, rainType } = rainList[rainRandomIndex]
                    let x = this.rainContent.width - width;
                    let rainObj = {
                        id: new Date().getTime().toString(), // 红包的id 作为唯一标识
                        width, // 红包宽度
                        height, // 红包高度
                        img,
                        rainType,
                        hasSelected: false, // 红包是否被选中
                        y: 0, // 用于标记红包下落的距离
                        x: Math.floor(x * Math.random()),
                        speed: Math.floor(Math.random() * 1 + 4), // 红包下落的速度
                    }

                    if (this.rainList.length <= this.rainNum) {
                        this.rainList.push(rainObj);
                    } else {
                        clearInterval(timeout);
                    }
                }, 1000);
            },
            // 点击红包
            touchStart(rainItem) {
                const { width } = rainItem
                if (!this.isGaming) return;
                let x = this.rainContent.width - rainItem.width;
                this.numList.push(rainItem.id)
                let index = this.rainList.findIndex(item => item.id === rainItem.id)
                if (index !== -1) {
                    // 点击红包时出现动效
                    if (rainItem.rainType === 1) {
                        // 备份一个图片
                        let aniObj = JSON.parse(JSON.stringify(rainItem))
                        this.aniList.push(aniObj)

                        this.$set(this.rainList[index], 'hasSelected', true)
                        this.$set(this.rainList[index], 'width', 0)

                        // 300ms 后替换为气泡，再300ms后进行删除
                        setTimeout(() => {
                            aniObj && this.$set(aniObj, 'img', `${getApp().globalData.imgUrl}giftrain/icon_cj_hby_xuanzhong.png`)

                            setTimeout(() => {
                                let indexAni = this.aniList.findIndex(item => item.id === aniObj.id)
                                if (indexAni !== -1) {
                                    this.aniList.splice(indexAni, 1)
                                }
                            }, 250)
                        }, 300)
                    } else {
                        this.$set(this.rainList[index], 'hasSelected', true)
                        this.$set(this.rainList[index], 'width', 0)
                    }

                    // 600毫秒后将点击消失的红包再显示到顶部
                    setTimeout(() => {
                        if (!this.isGaming) return;

                        this.$set(this.rainList[index], 'x', x * Math.random())
                        this.$set(this.rainList[index], 'y', 0)
                        this.$set(this.rainList[index], 'width', width)
                        this.$set(this.rainList[index], 'hasSelected', false)
                    }, 600);
                }
            },
            // 未选中红包样式
            rainImgStyle(w, h, x, y) {
                return {
                    width: w + "px",
                    height: h + "px",
                    left: x + "px",
                    top: -(h + 10) + y + "px"
                };
            },
            // 选中红包样式
            seclected(w, h) {
                return {
                    width: w + "px",
                };
            }
        },
        beforeDestroy() {
            this.gameTimer && clearTimeout(this.gameTimer);
            this.requestAnimationFrame && window.cancelAnimationFrame(this.requestAnimationFrame);
        }
    }
</script>

<style lang="scss" scoped>
.giftrain {
    position: fixed;
    width: 750rpx;
    height: 100%;
    top: 0;
    left: 50%;
    transform: translateX(-50%);

    .startRain {
        position: absolute;
        left: 50%;
        bottom: 80rpx;
        transform: translateX(-50%);
        width: 500rpx;
        height: 120rpx;
        background: url('@/static/shared/giftrain/icon_cj_hby_anniu.png') no-repeat center;
        background-size: 100% 100%;
        cursor: pointer;
    }

    .startPointer {
        position: absolute;
        width: 120rpx;
        height: 120rpx;
        bottom: 34rpx;
        right: 140rpx;
        background: url('@/static/shared/giftrain/icon_cj_hby_shou.png') no-repeat center;
        background-size: 100% 100%;
        animation: pointerMove 1s linear 0s infinite;
    }
}

.giftrain-content {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-color: rgba(0,0,0,0.7);
    z-index: 99;

    .timeBefore {
        position: absolute;
        width: 600rpx;
        height: 600rpx;
        top: 45%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: url('@/static/shared/giftrain/icon_cj_hby_circle.png') no-repeat center;
        background-size: 100% 100%;

        .timeBeforeNum {
            position: absolute;
            width: 260rpx;
            height: 260rpx;
            top: 50%;
            left: 50%;
            animation: numAni 1s linear 0s infinite;

            &.timeBeforeNum_3 {
                background: url('@/static/shared/giftrain/icon_cj_hby_3.png') no-repeat center;
                background-size: 100% 100%;
            }

            &.timeBeforeNum_2 {
                background: url('@/static/shared/giftrain/icon_cj_hby_2.png') no-repeat center;
                background-size: 100% 100%;
            }

            &.timeBeforeNum_1 {
                background: url('@/static/shared/giftrain/icon_cj_hby_1.png') no-repeat center;
                background-size: 100% 100%;
            }
        }
    }

    .timeLeft {
        position: absolute;
        top: 60rpx;
        left: 0;
        width: 100%;
        text-align: center;
        color: #fff;

        view:first-child {
            font-size: 32rpx;
            margin-bottom: 32rpx;
        }

        view:last-child {
            font-size: 56rpx;
        }
    }

    .giftrain-content-rainimg {
        position: absolute;
        z-index: 100;
    }

    .giftrainSelect {
        animation: rainAni 0.6s linear 0s 1;
    }
}

@keyframes pointerMove {
	0% {
        -webkit-transform: scale(1);
        transform: scale(1);
	}
	25% {
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
	}
	50% {
        -webkit-transform: scale(1.2);
        transform: scale(1.2);
	}
	75% {
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
	}
	100% {
        -webkit-transform: scale(1);
        transform: scale(1);
	}
}

@keyframes numAni {
	0% {
        -webkit-transform: translate(-50%, -50%) scale(0);
        transform: translate(-50%, -50%) scale(0);
	}
	25% {
        -webkit-transform: translate(-50%, -50%) scale(1);
        transform: translate(-50%, -50%) scale(1);
	}
	100% {
        -webkit-transform: translate(-50%, -50%) scale(1.0);
        transform: translate(-50%, -50%) scale(1.0);
	}
}

@keyframes rainAni {
	0% {
        -webkit-transform: scale(1);
        transform: scale(1);
	}
	25% {
        -webkit-transform: scale(0.6);
        transform: scale(0.6);
	}
	50% {
        -webkit-transform: scale(0.3);
        transform: scale(0.3);
	}
	75% {
        -webkit-transform: scale(0.25);
        transform: scale(0.25);
	}
	100% {
        -webkit-transform: scale(0.2);
        transform: scale(0.2);
	}
}
</style>
