<template>
    <view class="signin">
        <!-- 签到活动背景 -->
        <view style="font-size: 0;">
            <image :src="decoItem.props.signInBgImg" style="width: 100%;" mode="widthFix" />
        </view>
        <!-- 签到按钮 -->
        <img :class="['signBtn', getIsSign ? 'showBtn' : '' ]" :style="[setBtnStyle]" mode="widthFix"  :src="isSignIn ? decoItem.props.signInDoneImg : decoItem.props.signInImg" @click="signIn" />
        <!-- 累计签到天数 -->
        <view :class="['signTips', getCounts ? 'showBtn' : '' ]" v-if="decoItem.props.isShowCount" :style="[setTipsStyle]">{{ signInCount }}</view>
        <!-- 连续签到天数 -->
        <!-- <view class="signTips" v-if="decoItem.props.isShowCount" :style="[setTipsStyle]">{{ signInCountContinuous }}</view> -->

        <!-- 签到奖励弹窗 -->
        <uni-popup ref="popup" :mask-click="false">
            <view class="popup_box">
                <view class="center center1" v-if="signinReward.hasPrize">
                    <!-- 每日签到奖励 -->
                    <view :class="signinReward.oneLevelType === 1 ? 'oneLevelType1 flex_column_center_center' : 'oneLevelType2 flex_column_center_center'">
                        <!-- 累计签到奖励 -->
                        <!-- oneLevelType: 1表示首次签到 2为非首次 twoLevelType: 1为连续签到 2为累计签到 -->
                        <view v-if="signinReward.oneLevelType === 2"> {{ signinReward.twoLevelType == 2 ? '您已累计签到' : '您已连续签到' }}<text class="num-font">{{ signInCount }}</text>天</view>
                        <!-- 优惠券 -->
                        <view v-if="signinReward.couponType">【{{ signinReward.prizeName }}】</view>
                        <!-- 红包 -->
                        <view v-if="signinReward.randomAmount">【{{ signinReward.randomAmount }}元红包】</view>
                        <!-- 云豆 -->
                        <view v-if="signinReward.integral">【{{ signinReward.integral }}个云豆】</view>
                    </view>
                </view>
                <!-- 奖励已领完 -->
                <view class="center center2" v-if="!signinReward.hasPrize">
                    <view class="oneLevelType3">
                        <view>当前奖励已领完</view>
                    </view>
                </view>
                <view @click="closePop" class="closeIcon">
                    <image src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/close_screen.png" mode="widthFix"></image>
                </view>
                <view class="confirmBtn" @click="closePop"></view>
            </view>
        </uni-popup>
    </view>
</template>

<script>
import { isNotEmpty, setStorageSync } from "@/utils/common.js";
import dataHandler from "./handler";
import uniPopup from '@/common/components/uni-popup/uni-popup.vue';
import config from '@/common/lib/config.js';

export default {
    name: "deco-signin",
    props: {
        // 装修数据
        decoItem: {
            type: Object,
            default: () => {}
        },
        isDecoReady: {}
    },
    components: {
        uniPopup
    },
    watch: {
        decoItem: {
            handler(val) {
                if (isNotEmpty(val)) {
                    this.initData(JSON.parse(JSON.stringify(val)))
                    // 获取个人信息
                    this.getInfo();
                }
            },
            deep: true,
            immediate: true
        }
    },
    computed: {
        // 设置签到按钮位置
        setBtnStyle() {
            let style = {}        
            
            if (this.decoItem.props.isShowSignInXY && this.decoItem.props.signInXY && this.decoItem.props.signInXY.length === 2) {
                style.left = `${this.decoItem.props.signInXY[0]}%`
                style.top = `${this.decoItem.props.signInXY[1]}%`
            }

            if (this.decoItem.props.signImgWidth) {
                style.width = `${this.decoItem.props.signImgWidth * 2}rpx`
            }
            // 如果没有设置背景, 为了显示签到按钮, 将签到的定位方式设置为相对定位
            if (!this.decoItem.props.signInBgImg) {
                style.position = 'relative';
            }
            return style
        },
        setTipsStyle() {
            let style = {}  
            if (this.decoItem.props.countXY && this.decoItem.props.countXY.length === 2) {
                style.left = `${this.decoItem.props.countXY[0]}%`
                style.top = `${this.decoItem.props.countXY[1]}%`
                style.color = this.decoItem.props.countColor
                style.fontSize = `${parseInt(this.decoItem.props.countFontSize)*2}rpx`
                style.fontWeight = this.decoItem.props.isCountBold ? 'bold': 'normal'
            }
            return style
        },
    },
    data() {
        return {
            signActivityId: '', // 签到活动id
            isUsed: null, //当前活动是否可用
            isLoading: false,
            isSignIn: false, //今日是否签到
            signInCount: 0, //累计签到天数
            signInCountContinuous:0,//连续签到天数
            signinRewardList: [], // 签到奖励列表
            signinReward: {}, // 当前弹框显示的签到奖励
            userCenterData: {}, // 用户信息
            getCounts: false, // 是否获取签到次数
            getIsSign: false, // 是否签到
        };
    },
    methods: {
        initData(data) {
            this.signActivityId = data.data[0]?.info?.signActivityId
            if (!this.signActivityId) { return }
            // 查询签到活动状态
            dataHandler.getActivityStatus({ activityId: this.signActivityId })
                .then(res => {
                    this.isUsed = res;
                    this.getIsSignToday()
                    this.getTotalSignDays()
                }).catch((err) => {
                    console.error(err)
                })
            
        },
        // 获取今日是否签到
        getIsSignToday() {
            dataHandler.getIsSignToday({ signActivityId: this.signActivityId }).then(res => {
                this.isSignIn = res;
                this.getIsSign = true;
            }).catch((err) => {
                console.error(err)        
            })
        },
        // 获取累计签到天数
        getTotalSignDays() {
            dataHandler.getTotalSignDays({signActivityId: this.signActivityId }).then(res => {
                this.signInCount = res?.addCount || 0;
                this.signInCountContinuous = res?.countinueCount || 0;
                this.getCounts = true;
            }).catch((err) => {
                console.error(err)
            })
        },

        // 签到
        signIn() {
            if (!this.isLoading && !this.isSignIn && this.getIsSign && this.getCounts) {
                this.isLoading = true

                // 活动已失效
                if (this.isUsed === false) {
                    uni.showToast({ title: '签到活动已失效！', icon: 'none' })
                    return
                }

                const { userCenterData, signActivityId } = this;
                const { memberId, memberMobile, memberName, memberNickName, } = userCenterData;
                const data = {
                    signActivityId,
                    memberId,
                    memberMobile,
                    memberName,
                    memberNickName,
                    companyName: config.COMPANYNAME 
                }

                // 获取签到记录
                dataHandler.getSignRecord(data).then((res) => {
                    this.isSignIn = true
                    this.signInCount += 1;
                    this.signInCountContinuous += 1;

                    // 没有奖励时提示签到成功
                    if (res.matchRule) {
                        // 奖励列表
                        this.signinRewardList = res.memberSignPrizeVOs;

                        this.signinReward = this.signinRewardList.shift()
                        this.$refs.popup.open();
                    } else {
                        uni.showToast({
                            title: '签到成功',
                            icon: 'none'
                        })
                    }
                    
                }).catch((err) => {
                    console.error(err)
                }).finally(() => {
                    this.isLoading = false;
                });
            }
        },
        // 关闭弹窗
        closePop() {
            this.$refs.popup.close();
            if (this.signinRewardList.length > 0) {
                this.signinReward = this.signinRewardList.shift()
                this.$refs.popup.open();
            } else {
                setTimeout(() => {
                    this.signinReward = {}
                }, 500);
            }
        },
        async getInfo() {
            dataHandler.getUserCenterData().then(res => {
                this.userCenterData = res;
                setStorageSync('userCenterData', res);
            }).catch((err) => {
                console.error(err)
            })
        },
    }
};
</script>

<style lang="scss" scoped>
.signin {
    position: relative;
    width: 100%;

    .signBtn,
    .signTips {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        opacity: 0;
    }

    .signTips {
        white-space: nowrap;
    }   
    .showBtn {
        opacity: 1;
    } 
}

.popup_box{
    width: 590rpx;
    margin-top: -88rpx;
    position: relative;

    .closeIcon{
        position: absolute;
        left: 50%;
        bottom: -102rpx;
        transform: translateX(-50%);
        width: 48rpx;
        height: 48rpx;
        z-index: 2000;

        image{
            width: 48rpx;
            height: 48rpx;
        }
    }

    .confirmBtn {
        position: absolute;
        left: 50%;
        bottom: 48rpx;
        width: 460rpx;
        height: 88rpx;
        transform: translateX(-50%);
        border-radius: 40rpx;
        background: transparent;
    }

    .center{
        width: 100%;
        height: 760rpx;
        padding: 426rpx 100rpx 180rpx 100rpx;

        &.center1 {
            background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/coupon/bg_wode_qiandao1.png') center top repeat-y;
            background-size: 100% auto;
        }

        &.center2 {
            background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/coupon/bg_wode_qiandao2.png') center top repeat-y;
            background-size: 100% auto;
            .oneLevelType3 {
                margin-top: 84rpx;
                height: 42rpx;
                line-height: 42rpx;
                font-size: 30rpx;
                color: #6E2929;
            }
        }

        .oneLevelType1,
        .oneLevelType2 {
            width: 100%;  //设置宽度
            height: 100%;
            text-align: center;
        }

        .oneLevelType3 {
            width: 100%;  //设置宽度
            height: 100%;
            text-align: center;
            color: #fff;
            font-size: 32rpx;
        }

        .oneLevelType1 > view {
            color: #F30300;
            font-size: 40rpx;
        }

        .oneLevelType2 > view:first-child {
            height: 44rpx;
            line-height: 44rpx;
            font-size: 32rpx;
            color: #735C5C;

            text {
                color: #f30300;
                margin: 0 8rpx;
                font-size: 36rpx;
            }
        }

        .oneLevelType2 > view:last-child {
            margin-top: 12rpx;
            height: 56rpx;
            line-height: 56rpx;
            color: #F30300;
            font-size: 40rpx;
            font-weight: bold;
        }
    }
}

::v-deep .uni-popup > .uni-transition:first-child {
    background-color: rgba(0, 0, 0, 0.7) !important;
}
</style>
