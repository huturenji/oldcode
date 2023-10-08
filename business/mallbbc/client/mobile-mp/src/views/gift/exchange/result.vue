<template>
    <view class="bg-content">
        <view @click="clickMask" v-if="showTips" class="mask"></view>
        <view class="tips-upper" v-if="showTips" :style="{left: tipsLeft}"></view>
        <view class="tips-content" v-if="showTips"></view>
        <view class="content">
            <view class="img-text">
                <image class="img" :src="giftResultEnum[status].img"></image>
                <view class="text">{{ giftResultEnum[status].text }}</view>
            </view>
            <view class="explain">{{ giftResultEnum[status].explain }}</view>
            <view class="btnWrap">
                <view class="btn " @click="goGiftIndex()" v-if="status == 0">
                    {{ giftResultEnum[status].goIndexText }}
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import { getStorageSync, setStorageSync, getCapsuleRect } from '@/utils/common'

export default {
    components: {

    },
    data() {
        return {
            tipsLeft: 0, // 引导页上部分左偏移量
            tipsKey: 'emaoqingTipsShowFlag',
            clickedTips: false,
            status: 0,
            giftResultEnum: {
                0: {
                    img: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/success.svg',
                    text: '领取成功',
                    color: '',
                    explain: '快递小哥正快马加鞭的为您配送，请您留意快递电话',
                    goIndexText: '返回鹅毛情首页',
                    class: 'success',
                },
                1: {
                    img: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/failure%402x.png',
                    color: '#f30300',
                    text: '领取失败',
                    explain: '抱歉，商品太火爆了，过几天再试试吧！商品到货后我们将第一时间通知您',
                    btnText: '我知道了',
                    class: 'fail',
                }
            },
        }
    },
    onLoad() {
        // 设置tips的位置
        this.setTipsPosition();
    },
    mounted() {
        this.status = this.$Route.query.status
    },

    computed: {
        showTips() {
            return !(this.clickedTips || getStorageSync(this.tipsKey));
        }
    },
    methods: {
        setTipsPosition() {
            let rect = getCapsuleRect();
            this.tipsLeft = rect.left + rect.width * 1 / 4 + 'px';
        },
        // 去领取礼物详情
        goGiftDetail() {
            this.$Router.push({
                path: '/views/gift/detail/index',
                query: {
                    featherId: this.$Route.query.featherId
                }
            })
        },
        // 去鹅毛情首页
        goGiftIndex() {
            this.$Router.push({
                path: '/views/gift/list/index',
                query: {
                    currentIndex: 1
                }
            })
        },
        clickMask() {
            this.clickedTips = true;
            setStorageSync(this.tipsKey, true);
        }
    }
}
</script>

<style scoped lang="scss">
.bg-content {
    overflow: hidden;
    min-height: 100vh;
    background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/mallbbc/img/bg_emq_success.png') no-repeat;
    background-size: cover;
    background-position: bottom;
    background-color: #50575C;


    .content {
        width: 550rpx;
        margin: 100rpx auto;
        display: flex;
        flex-direction: column;
        align-items: center;

        .img-text {
            display: flex;

            .img {
                width: 44rpx;
                height: 44rpx;
            }

            .text {
                margin-left: 16rpx;
                height: 50rpx;
                font-size: 36rpx;
                font-weight: 600;
                color: #ffffff;
                line-height: 50rpx;
            }
        }



        .explain {
            margin-top: 20rpx;
            text-align: center;
            color: #C2C2C2;
            height: 80rpx;
            line-height: 40rpx;
            font-size: 28rpx;
            font-weight: 400;
        }

        .btn {
            margin-top: 80rpx;
            width: 552rpx;
            height: 80rpx;
            line-height: 80rpx;
            color: #fff;
            background: #f30300;
            border-radius: 40rpx;
            font-weight: bold;
            font-size: 30rpx;
            text-align: center;
        }
    }
}

.mask {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba($color: #000, $alpha: 0.5);
}

.tips-upper {
    position: absolute;
    width: 80rpx;
    margin-left: -40rpx;
    height: 100rpx;
    background: url("https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/gift/icon_emq_yingdao1.png") no-repeat;
    background-size: auto 100%;
    background-position: 50% 0;
}

.tips-content {
    position: absolute;
    top: 22rpx;
    width: 100%;
    height: 400rpx;
    background: url("https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/gift/icon_emq_yingdao2.png") no-repeat;
    background-size: 100% auto;
    // -webkit-animation: bounce-down 1.6s linear infinite;
    // animation: bounce-down 1.6s linear infinite;
}

@-webkit-keyframes bounce-down {
    25% {
        -webkit-transform: translateY(-4px);
    }

    50%,
    100% {
        -webkit-transform: translateY(0);
    }

    75% {
        -webkit-transform: translateY(4px);
    }
}

@keyframes bounce-down {
    25% {
        transform: translateY(-4px);
    }

    50%,
    100% {
        transform: translateY(0);
    }

    75% {
        transform: translateY(4px);
    }
}
</style>
