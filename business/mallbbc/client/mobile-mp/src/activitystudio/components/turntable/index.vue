<template>
    <view class="turn">
        <view class="ring"></view>
        <view
            class="turntableContent"
        >
            <view
                class="turntable"
                :style="{ transform: rotateAngle, transition: rotateTransition }"
            >
                <!-- 转盘底图 -->
                <image
                    style="width: 100%;height: 100%;"
                    :src="`https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/activitystudio/turntable/bg_cj_${prizeList.length}.png`"
                    mode="scaleToFill"
                />
                <!-- 图片文字信息 -->
                <view class="prize">
                    <view v-for="(item, index) in prizeList" class="item" :style="[getRotateAngle(index)]" :key="index">
                        <view class="text">{{ getRadiusName(item.name) }}</view>
                        <view class="drawTable-img" :style="{ 'width': prizeCtrlEnum[prizeList.length].imgWidth, 'height': prizeCtrlEnum[prizeList.length].imgWidth, 'bottom':prizeCtrlEnum[prizeList.length].imgPositionBottom }">
                            <image :src="item.imgUrl" />
                        </view>
                    </view>
                </view>
            </view>
            <!-- 指针 -->
            <view class="pointer" @click="startTurns"></view>
        </view>
        <view class="turnBottom"></view>
    </view>
</template>

<script>
export default {
    props: {
        size: {
            type: Number,
            default: 560
        },
        // 转盘数据
        prizeList: {
            required: true,
            type: Array
        },
        // 转盘转动后指针停在区间的索引
        prizeIndex: {
            type: Number,
            default: -1
        },
        // 控制转盘转动
        turnsRun: {
            type: Boolean,
            default: false
        },
        // 转动圈数
        turnsNumber: {
            type: Number,
            default: 5
        },
        // 转动需要持续的时间 (秒)
        turnsTime: {
            default: 5,
        }
    },
    watch: {
        turnsRun(nRun) {
            if (nRun) {
                this.rotate(this.prizeIndex);
            }
        }
    },
    data() {
        return {
            // 设置指针默认指向的位置,现在是默认指向2个扇形之间的边线上
            rotateAngle: 'rotate(0)',
            rotateTransition: '',
            lock: false,  // 用来锁定转盘，避免同时多次点击转动
            startRotateDegree: 0, // 开始转动的角度
            prizeImgWidth: '',
            prizeCtrlEnum:{//奖品数量相关配置1.nameLength名字展示最大长度，2.nameSize名字字号，3.imgWidthRule图片宽高规则,4.imgPositionBottom图片距离中心的位置
                4:{nameLength:12,nameSize:35,imgWidth:'80rpx',imgPositionBottom:'110rpx'},
                6:{nameLength:9,nameSize:35,imgWidth:'80rpx',imgPositionBottom:'120rpx'},
                8:{nameLength:6,nameSize:35,imgWidth:'80rpx',imgPositionBottom:'120rpx'},
                10:{nameLength:4,nameSize:35,imgWidth:'64rpx',imgPositionBottom:'120rpx'},
                12:{nameLength:3,nameSize:35,imgWidth:'58rpx',imgPositionBottom:'140rpx'}
            }
        }
    },
    mounted() {

    },
    methods: {
        getRotateAngle(index) {
            const angle = (360 / this.prizeList.length) * index + 180 / this.prizeList.length;
            return {
                transform: `rotate(${angle}deg)`
            };
        },
        canBeRotated() {
            if (this.lock) {
                return false;
            }
            return true;
        },
        // 开始事件
        startTurns() {
            // 判断是否可以转动
            this.$emit('checkRun', (isRun) => {
                if (!this.canBeRotated() || !isRun) {
                    return false;
                }
                // 先上锁, 触发开始游戏
                this.lock = true;
                this.$emit('start-turns');
            })
        },
        rotate(index) {
            const turnsTimeNum = this.turnsTime;
            const rotateAngleValue =
                this.startRotateDegree +
                this.turnsNumber * 360 +
                360 -
                (180 / this.prizeList.length + (360 / this.prizeList.length) * index) -
                (this.startRotateDegree % 360);
            
            this.startRotateDegree = rotateAngleValue;
            this.rotateAngle = `rotate(${rotateAngleValue}deg)`;
            this.rotateTransition = `transform ${turnsTimeNum}s cubic-bezier(0.250, 0.460, 0.455, 0.995)`;
            setTimeout(() => {
                this.$emit('end-turns');
                this.lock = false;
            }, turnsTimeNum * 1000 + 500);
        },
        getRadiusName(name){
            let length = name.length;
            let maxLength = this.prizeCtrlEnum[this.prizeList.length].nameLength;
            let text = length > maxLength ? (name.slice(0, maxLength - 1) + '...') : name;
            return text
        }
    }
}
</script>

<style lang="scss" scoped>
.turn {
    width: 750rpx;
    height: 750rpx;
    position: relative;
    margin-bottom: 100rpx;

    .ring {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/activitystudio/turntable/icon_cj_dzp_waipan.png')no-repeat center;
        background-size: 105% 105%;
        z-index: 98;
    }

    .turnBottom {
        position: absolute;
        left: 0;
        bottom: -100rpx;
        width: 100%;
        height: 480rpx;
        background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/activitystudio/turntable/icon_cj_dzp_dizuo.png')no-repeat center;
        background-size: 100% 100%;
        z-index: 10;
    }
}

.turntableContent {
    position: absolute;
    width: 560rpx;
    height: 560rpx;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    overflow: hidden;
    z-index: 99;

    .pointer {
        position: absolute;
        width: 240rpx;
        height: 240rpx;
        left: 50%;
        top: 50%;
        z-index: 99;
        transform: translate(-50%, -50%);
        background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/activitystudio/turntable/icon_cj_dzp_choujiang.png') no-repeat center;
        background-size: 100% 100%;
    }

    .drawTable-name {
        position: absolute;
        left: 50%;
        top: 40rpx;
        transform: translateX(-50%);
        font-size: 26rpx;
        text-align: center;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .drawTable-img {
        position: absolute;
        /*要居中就要50% - 宽度 / 2*/
        left: 50%;
        bottom: 84rpx;
        transform: translateX(-50%);
        height: auto;

        image {
            width: 100%;
            height: 100%;
            border-radius: 8rpx;
        }
    }

    .turntable {
        position: relative;
        width: 560rpx;
        height: 560rpx;

        .turntableCanvas_class {
            width: 560rpx;
            height: 560rpx;
        }
    }
    .prize {
        position: absolute;
        left: 25%;
        top: 0;
        width: 280rpx;
        height: 280rpx;

        .item {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            transform-origin: center bottom;
            .text{
                color: #ff0000;
                font-size: 24rpx;
                padding: 20rpx;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
}
</style>
