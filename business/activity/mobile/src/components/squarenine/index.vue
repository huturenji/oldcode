<template>
    <view class="squarenine">
        <view :class="`squarenine_box size_${giftLength}`">
            <!-- 开始按钮 -->
            <view class="start" @click="startDraw">
                <view></view>
            </view>
            <!-- 奖品列表 -->
            <view v-for="(item, i) in prizeList" :key="'luckmarquee'+ i" :class="[`gift gift_${i + 1}`]">
                <view class="activeBorder" v-show="index == i"></view>
                <view class="gift_img">
                    <image :src="item.imgUrl" />
                </view>
                <view class="desc">{{ item.name }}</view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        props: {
            // 奖品列表
            prizeList: {
                type: Array,
                required: true
            },
            // 中奖奖品的 index
            prizeIndex: {
                type: Number || String,
                default: -1
            },
            checkRun: {
                type: Function,
                default: () => { return true }
            }
        },
        data() {
            return {
                giftLength: this.prizeList.length,
                lock: false,
                index: 0,  // 当前转动的索引
                lastIndex: 0, // 上一轮转动的索引
                cellNumber: 0, // 已经转动的格数
                timer: null,
                // 大转盘转动速率，分别对应开始，快速，临近结束三个阶段
                speedObj: {
                    0: 60,
                    1: 30,
                    2: 150
                }
            }
        },
        computed: {
            // 预抽奖，转动多少次进入抽奖环节
            circleNum() {
                if (this.giftLength === 8) {
                    return 80
                } else {
                    return 84
                }
            }
        },
        methods: {
            rollMarquee() {
                this.cellNumber += 1;
                let idx = this.index; // 当前转动到哪个位置
                const count = this.giftLength; // 总共有多少个位置
                idx += 1;
                if (idx > count - 1) {
                    idx = 0;
                }
                this.index = idx;
                this.getPrize();
            },
            getPrize() {
                // 当前转动次数符合条件 && 转动到中奖位置
                // 这一轮需要预转动的个数，要减去上次的索引
                const currentCell = this.circleNum - this.lastIndex
                if (this.cellNumber > currentCell && this.prizeIndex === this.index) {
                    // 清除转动定时器
                    this.timer && clearTimeout(this.timer);
                    //恢复默认值和初始值
                    this.timer = null;
                    this.cellNumber = 0;
                    this.index = this.prizeIndex;
                    this.lastIndex = this.prizeIndex
                    setTimeout(() => {
                        this.$emit('end-turns');
                        this.lock = false;
                    }, 500);
                } else {
                    // 转动速度
                    let speed
                    if (this.cellNumber < currentCell * 0.25) {
                        speed = this.speedObj[0];
                    } else if (this.cellNumber < (currentCell - 5)) {
                        speed = this.speedObj[1];
                    } else {
                        if ((currentCell + this.prizeIndex) - this.cellNumber > 5) {
                            speed = this.speedObj[1];
                        } else {
                            speed = this.speedObj[2];
                        }
                    }
                    // 开始转动抽奖
                    this.timer = setTimeout(this.rollMarquee, speed);
                }
            },
            startDraw() {
                if(!this.lock && this.checkRun()) {
                    this.lock = true;
                    // 开始转动修改为经判断后再进行
                    this.$emit('start-turns', () => {
                        this.rollMarquee();
                    });
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
.squarenine {
    position: relative;
    width: 750rpx;
    height: 950rpx;
    padding: 200rpx 100rpx;
    border-radius: 16rpx;
    background: url('@/static/shared/squarenine/bg_cj_jgg_waikuang.png')no-repeat center;
    background-size: 100% 100%;

    .squarenine_box {
        .gift .desc {
            color: #de4321;
        }

        .activeBorder {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            background: url("@/static/shared/squarenine/icon_cj_jgg_sel.svg") no-repeat center;
            background-size: 100% 100%;
            z-index: 99;
        }
    }

    .squarenine_box.size_8 {
        position: relative;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;

        .gift_1, .gift_3, .gift_5, .gift_7 {
            background: url("@/static/shared/squarenine/icon_cj_jgg_gezi1.png") no-repeat center;
        }
        
        .gift_2, .gift_4, .gift_6, .gift_8 {
            background: url("@/static/shared/squarenine/icon_cj_jgg_gezi2.png") no-repeat center;
        }

        .start {
            position: relative;
            top: 190rpx;
            left: 190rpx;
            width: 168rpx;
            height: 168rpx;
            overflow: hidden;
            border-radius: 10rpx;
            background: url("@/static/shared/squarenine/icon_cj_jgg_bg.png") no-repeat center;
            background-size: 100% 100%;

            view {
                width: 100%;
                height: 100%;
                background: url("@/static/shared/squarenine/icon_cj_jgg_choujiang2.png") no-repeat center;
                background-size: 100% 100%;
                animation: startMove 1.5s linear 0s infinite;
            }
        }

        .gift {
            list-style: none;
            position: absolute;
            width: 168rpx;
            height: 168rpx;
            background-size: 100% 100%;

            .gift_img {
                margin: 20rpx auto 12rpx;
                width: 68rpx;
                height: 68rpx;
                border-radius: 8rpx;
                overflow: hidden;

                image {
                    width: 100%;
                    height: 100%;
                }
            }

            .desc {
                max-width: 280rpx;
                margin: 0 auto;
                text-align: center;
                font-size: 22rpx;
                font-weight: 500;
                padding: 0 16rpx;
                height: 47rpx;
                line-height: 24rpx;
                display: -webkit-box;
                overflow: hidden;
                word-break: break-all; /* break-all(允许在单词内换行。) */
                -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
                -webkit-line-clamp: 2; /** 显示的行数 **/
            }
        }
        // 上面三个
        .gift_1, .gift_2, .gift_3 {
            top: 12rpx;
        }
        // 左边三个
        .gift_1, .gift_7, .gift_8 {
            left: 12rpx;
        }
        // 竖向中间两个
        .gift_2, .gift_6 {
            left: 190rpx;
        }
        // 横向中间两个
        .gift_4, .gift_8 {
            top: 190rpx;
        }
        // 右边三个
        .gift_3, .gift_4, .gift_5 {
            left: 368rpx;
        }
        // 下面三个
        .gift_5,.gift_6, .gift_7 {
            top: 368rpx;
        }
    }

    .squarenine_box.size_12 {
        position: relative;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;

        .gift_1, .gift_4, .gift_7, .gift_10 {
            background: url("@/static/shared/squarenine/icon_cj_jgg_gezi1.png") no-repeat center;
        }
        
        .gift_2, .gift_3, .gift_5, .gift_6, .gift_8, .gift_9, .gift_11, .gift_12 {
            background: url("@/static/shared/squarenine/icon_cj_jgg_gezi2.png") no-repeat center;
        }

        .start {
            position: relative;
            top: 155rpx;
            left: 155rpx;
            width: 240rpx;
            height: 240rpx;
            overflow: hidden;
            border-radius: 10rpx;
            background: url("@/static/shared/squarenine/icon_cj_jgg_bg.png") no-repeat center;
            background-size: 100% 100%;

            view {
                width: 100%;
                height: 100%;
                background: url("@/static/shared/squarenine/icon_cj_jgg_choujiang2.png") no-repeat center;
                background-size: 100% 100%;
                animation: startMove 1.5s linear 0s infinite;
            }
        }

        .gift {
            list-style: none;
            position: absolute;
            width: 124rpx;
            height: 124rpx;
            background-size: 100% 100%;

            .gift_img {
                margin: 14rpx auto 6rpx;
                width: 50rpx;
                height: 50rpx;
                border-radius: 8rpx;
                overflow: hidden;

                image {
                    width: 100%;
                    height: 100%;
                }
            }

            .desc {
                max-width: 120rpx;
                margin: 0 auto;
                text-align: center;
                font-size: 21rpx;
                font-weight: 500;
                padding: 0 16rpx;
                height: 47rpx;
                line-height: 23rpx;
                display: -webkit-box;
                overflow: hidden;
                word-break: break-all; /* break-all(允许在单词内换行。) */
                -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
                -webkit-line-clamp: 2; /** 显示的行数 **/
            }
        }

        // 上面三个
        .gift_1, .gift_2, .gift_3, .gift_4 {
            top: 12rpx;
        }
        // 左边三个
        .gift_1, .gift_10, .gift_11, .gift_12 {
            left: 12rpx;
        }
        // 竖向中间两个
        .gift_2, .gift_9 {
            left: 146rpx;
        }
        .gift_3, .gift_8 {
            left: 280rpx;
        }
        // 横向中间两个
        .gift_5, .gift_12 {
            top: 146rpx;
        }
        .gift_6, .gift_11 {
            top: 280rpx;
        }

        // 右边三个
        .gift_4, .gift_5, .gift_6, .gift_7 {
            left: 414rpx;
        }
        // 下面三个
        .gift_7, .gift_8, .gift_9, .gift_10 {
            top: 414rpx;
        }
    }
}

@keyframes startMove {
	0% {
        -webkit-transform: scale(1);
        transform: scale(1);
	}
	25% {
        -webkit-transform: scale(1.05);
        transform: scale(1.05);
	}
	50% {
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
	}
	75% {
        -webkit-transform: scale(1.05);
        transform: scale(1.05);
	}
	100% {
        -webkit-transform: scale(1.0);
        transform: scale(1.0);
	}
}
</style>
