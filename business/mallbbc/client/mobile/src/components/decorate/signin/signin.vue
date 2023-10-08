<template>
    <view class="signin" v-margin="decoItem">
        <!-- 签到活动背景 -->
        <view style="font-size: 0;">
            <image :src="decoItem.props.signInBgImg" style="width: 100%;" mode="widthFix" />
        </view>
        <!-- 签到按钮 -->
        <img class="signBtn" :style="setBtnStyle()" :src="decoItem.props.signInImg" v-show="!isSignIn || !decoItem.props.signInDoneImg" @click="signIn" />
        <img class="signBtn" :style="setBtnStyle()" :src="decoItem.props.signInDoneImg" v-show="isSignIn && decoItem.props.signInDoneImg" />

        <!-- 已累计签到天数 -->
        <view class="signTips" v-if="decoItem.props.isShowCount" :style="setTipsStyle()">{{ signInCount }}</view>
        <!-- 已连续签到天数 -->
        <view class="signTips" v-if="decoItem.props.isShowCount" :style="setTipsStyle()">{{ signInCountContinuous }}</view>

        <!-- 签到奖励弹窗 -->
        <view v-transfer-dom>
            <uni-popup ref="popup" :mask-click="false">
                <view class="popup_box">
                    <view class="center center1" v-if="signinReward.hasPrize">
                        <!-- 每日签到奖励 -->
                        <view class="oneLevelType1 flex_column_center_center" v-if="signinReward.oneLevelType === 1 && signinReward.hasPrize">
                            <!-- 优惠券 -->
                            <view v-if="signinReward.couponType">【{{ signinReward.prizeName }}】</view>
                            <!-- 红包 -->
                            <view v-if="signinReward.randomAmount">【{{ signinReward.randomAmount }}元红包】</view>
                            <!-- 云豆 -->
                            <view v-if="signinReward.integral">【{{ signinReward.integral }}个云豆】</view>
                        </view>
                        <!-- 累计签到奖励 -->
                        <view class="oneLevelType2 flex_column_center_center" v-if="signinReward.oneLevelType === 2 && signinReward.twoLevelType==2 && signinReward.hasPrize">
                            <view>您已累计签到<text>{{ signInCount }}</text>天</view>
                            <!-- 优惠券 -->
                            <view v-if="signinReward.couponType">{{ signinReward.prizeName }}</view>
                            <!-- 红包 -->
                            <view v-if="signinReward.randomAmount">【{{ signinReward.randomAmount }}元红包】</view>
                            <!-- 云豆 -->
                            <view v-if="signinReward.integral">【{{ signinReward.integral }}个云豆】</view>
                        </view>
                        <!-- 连续签到奖励 -->
                        <view class="oneLevelType2 flex_column_center_center" v-if="signinReward.oneLevelType === 2 && signinReward.twoLevelType==1 && signinReward.hasPrize">
                            <view>您已连续签到<text>{{ signInCountContinuous }}</text>天</view>
                            <!-- 优惠券 -->
                            <view v-if="signinReward.couponType">{{ signinReward.prizeName }}</view>
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
                        <image :src="imgUrl + 'common/icon/close_screen.png'" mode="widthFix"></image>
                    </view>
                    <view class="confirmBtn" @click="closePop"></view>
                </view>
            </uni-popup>
        </view>
    </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { isNotEmpty } from '@/utils/common.js'
import handler from '@/components/personal/handler'
import goodsHandler from "@/components/goods/handler";

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
    watch: {
        decoItem: {
            handler(val) {
                if (isNotEmpty(val) && this.isDecoReady) {
                    this.initData(JSON.parse(JSON.stringify(val)))
                    // 获取个人信息
                    handler.getInfo().then(res => {
                        if (res.state === 200) {
                            this.isLoaded += 1
                            this.setUserCenterData(res.data)
                        }
                    })
                }
            },
            deep: true,
            immediate: true
        }
    },
    computed: {
        ...mapState(["userCenterData"])
    },
    components: {
        
    },
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            companyName: '',
            signActivityId: '', // 签到活动id
            isUsed: null, //当前活动是否可用
            isLoaded: 0,
            isLoading: false,
            isSignIn: false, //今日是否签到
            signInCount: 0, //累计签到天数
            signInCountContinuous:0,//连续签到天数
            signinRewardList: [], // 签到奖励列表
            signinReward: {} // 当前弹框显示的签到奖励
        };
    },
    methods: {
        ...mapMutations(['setUserCenterData']),
        initData(data) {
            // 获取公司名称
            sinosdk.sino.getUserInfo().then(res => {
                this.companyName = res.cpyName
                this.isLoaded += 1
            })

            try {
                this.signActivityId = data.data[0].info.signActivityId

                if (!this.signActivityId) { return }
                // 查询签到活动状态
                this.isActivityUsed()
            } catch (error) {
                // uni.showToast({ title: '签到活动已失效！', icon: 'none' })
            }
        },
        isActivityUsed(){
            let param = {};
            param.activityId = this.signActivityId
            goodsHandler.isActivityUsed(param).then(res => {
                if (res.state == 200) {
                    this.isUsed = res.data
                    this.getIsSignToday()
                    this.getTotalSignDays()
                } else {
                }
            })
                
        },
        getIsSignToday() {
            // 获取今日是否签到
            let param = {};
            param.signActivityId = this.signActivityId
            goodsHandler.isSign(param).then(res => {
                if (res.state === 200) {
                    this.isSignIn = res.data
                    this.isLoaded += 1
                } else {
                    this.isSignIn = true
                    uni.showToast({ title: res.msg, icon: 'none' })
                }
            })
            
        },
        // 获取累计签到天数
        getTotalSignDays() {
            let param = {};
            param.signActivityId = this.signActivityId
            goodsHandler.countSign(param).then(res => {
                if (res.state === 200) {
                    this.signInCount = res.data?.addCount
                    this.signInCountContinuous = res.data?.countinueCount
                }
            })
        },
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
        // 签到
        signIn() {
            // 不属于预览装修页时才能点击签到
            if (!this.isLoading && this.isLoaded === 3 && !this.isSignIn && this.$Route.path.indexOf('preview') == -1) {
                this.isLoading = true

                // 活动已失效
                if (this.isUsed === false) {
                    uni.showToast({ title: '签到活动已失效！', icon: 'none' })
                    return
                }

                let param = {
                    signActivityId: this.signActivityId,
                    memberId: this.userCenterData.memberId,
                    memberMobile: this.userCenterData.memberMobile,
                    memberName: this.userCenterData.memberName,
                    memberNickName: this.userCenterData.memberNickName,
                    companyName: this.companyName
                };
                // 获取签到记录
                goodsHandler.doSign(param).then(res => {
                    if (res.state === 200) {
                        this.isSignIn = true
                        this.signInCount += 1
                        this.signInCountContinuous += 1;

                        // 没有奖励时提示签到成功
                        if (res.data.matchRule) {
                            // 奖励列表
                            this.signinRewardList = res.data.memberSignPrizeVOs

                            this.signinReward = this.signinRewardList.shift()
                            this.$refs.popup.open();
                        } else {
                            uni.showToast({
                                title: '签到成功',
                                icon: 'none'
                            })
                        }
                    } else {
                        uni.showToast({ title: res.msg, icon: 'none' })
                    }
                })
            }
        },
        // 关闭弹窗
        closePop(){
            this.$refs.popup.close();
            if (this.signinRewardList.length > 0) {
                this.signinReward = this.signinRewardList.shift()
                this.$refs.popup.open();
            } else {
                // 避免弹框关闭过程中，置空数据导致显示"签到奖励已领完"
                setTimeout(() => {
                    this.signinReward = {}
                }, 1000);
            }
        }
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
    }

    .signBtn {
        cursor: pointer;
    }

    .signTips {
        white-space: nowrap;
    }    
}

.popup_box{
    width: 590rpx;
    position: relative;
    margin-top: -88rpx;

    .closeIcon{
        position: absolute;
        left: 50%;
        bottom: -102rpx;
        width: 48rpx;
        height: 48rpx;
        z-index: 2000;
        transform: translateX(-50%);

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
            background: url('@/static/shared/redpacket/bg_wode_qiandao1.png') center top repeat-y;
            background-size: 100% auto;
        }

        &.center2 {
            background: url('@/static/shared/redpacket/bg_wode_qiandao2.png') center top repeat-y;
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
            // line-height: 240rpx;
            text-align: center;
            color: #fff;
            font-size: 32rpx;
        }

        .oneLevelType1 > view {
            // height: 100%;
            // line-height: 180rpx;
            color: #F30300;
            font-size: 40rpx;
            font-weight: bold;
        }

        .oneLevelType2 > view:first-child {
            height: 44rpx;
            line-height: 44rpx;
            font-size: 32rpx;
            color: #735C5C;

            text {
                color: #f30300;
                margin: 0 8rpx;
                font-weight: bold;
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