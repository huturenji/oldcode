<template>
    <view class="hiteggs">
        <view
            v-for="(item, index) in eggList"
            :key="index"
            class="eggs-item"
            :style="[{ width: 100 / rowNum + '%' }]"
        >
            <image mode="widthFix" class="intactImg" :src="intactImg" @click="hitEggs(index)" v-if="!item.isHit" />
            <image mode="widthFix" v-if="item.isHit" class="splitImg" :src="splitImg" />
            <!-- 锤子图片 -->
            <image mode="widthFix" v-if="index == hitIndex" class="hammer" :src="hammer" />
        </view>
    </view>
</template>
<script>

export default {
    props: {
        // 金蛋数量
        num: {
            type: Number,
            default: 9
        },
        rowNum: {
            type: Number,
            default: 3
        },
        // 金蛋图片
        intactImg: {
            type: String,
            default: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/activitystudio/hiteggs/icon_cj_zjd_jindan.png'
        },
        // 锤子图片
        hammer: {
            type: String,
            default: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/activitystudio/hiteggs/icon_cj_zjd_chuizi.png'
        },
        // 已砸金蛋图片
        splitImg: {
            type: String,
            default: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/activitystudio/hiteggs/icon_cj_zjd_jindan2.png'
        }
    },
    data() {
        return {
            eggList: [],
            hitIndex: -1,
            hitClick: false // 砸蛋锁
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            this.eggList = []
            for (let i = 0; i < this.num; i++) {
                this.eggList.push({
                    id: i,
                    isHit: false
                })
            }
        },
        hitEggs(index) {
            this.$emit('checkRun', (isRun) => {
                if (this.hitClick || !isRun) return
                this.hitClick = true
                this.hitIndex = index

                // 一秒钟后砸开
                setTimeout(() => {
                    this.$set(this.eggList[index], 'isHit', true)
                    this.hitIndex = -1

                    // 由业务执行玩操作后解开砸蛋锁
                    this.$emit('hit', () => {
                        this.hitClick = false
                    })
                }, 1500)
                // 每次砸完操作后金蛋恢复原状,设置时间 > 1500用户才会看到金蛋被砸的效果
                setTimeout(() => {
                    this.$set(this.eggList[index], 'isHit', false)
                }, 2000)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.hiteggs {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0 40rpx;

    .eggs-item {
        margin-bottom: 40rpx;
        position: relative;
        transition: all 0.3s ease;
        padding: 0 20rpx;

        .intactImg {
            width: 100%;

            &.hide {
                opacity: 0;
            }
        }

        .splitImg {
            position: absolute;
            width: calc(100% - 40rpx);
            left: 20rpx;
            bottom: 4rpx;
        }

        .hammer {
            width: 130rpx;
            position: absolute !important;
            top: -52rpx;
            right: -50rpx;
            transform: rotate(-50deg);
            animation: shake-rotate 1.5s linear 0s infinite;
            z-index: 99;
        }
    }
}

@keyframes shake-rotate {
    0% {
        -webkit-transform: rotate(-10deg);
        transform: rotate(-10deg);
    }

    12% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }

    25% {
        -webkit-transform: rotate(10deg);
        transform: rotate(10deg);
    }

    38% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }

    50% {
        -webkit-transform: rotate(-10deg);
        transform: rotate(-10deg);
    }

    62% {
        -webkit-transform: rotate(5deg);
        transform: rotate(5deg);
    }

    75% {
        -webkit-transform: rotate(20deg);
        transform: rotate(20deg);
    }

    88% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }

    100% {
        -webkit-transform: rotate(-20deg);
        transform: rotate(-20deg);
    }
}
</style>
