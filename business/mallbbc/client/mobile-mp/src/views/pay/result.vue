<template>
    <view class="bg-content">
        <!-- 自定义titleBar start -->
		<u-navbar title="结果" placeholder autoBack></u-navbar>
		<!-- 自定义titleBar end -->
        <view class="content">
            <view class="img-text">
                <image class="img" :src="resultEnum[state].img"></image>
                <view class="text">{{resultEnum[state].text}}</view>
            </view>

            <!--  只有鹅毛情的支付成功的结果页，才显示卡片 -->
            <view class="present" v-if="showPresentCard">
                <!-- 鹅毛情支付成功分享微信好友收礼的人的时候，选择的礼物卡片列表 -->
                <presentCard ref="presentCard" @choose="choose" />
            </view>
            <view class="btnWrap">
                <!-- 支付中 -->
				<template v-if="state == 0">

				</template>
				<!-- 支付成功 -->
				<template v-if="state == 1">
					<view v-if="!featherId" class="btn btn_view" @click="viewOrder()">查看订单</view>
					<view class="btn btn_index" @click="toIndex()">去首页</view>
                    <button v-if="!!featherId" class="btn" open-type="share">微信分享送礼单</button>
				</template>

				<!-- 支付失败或者支付取消 -->
				<template v-if="state == 2 || state == 3">
					<view class="btn" @click="viewOrder">查看订单</view>
				</template>
            </view>
            <view class="official-accounts">
                <view class="img-left">
                    <img class="official-accounts-img" src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/order/icon_common_zhaorifuwuhao.png" alt="">
                </view>
                <view class="des-text">
                    <text class="official-accounts-name">兆日服务公众号</text>
                    <text class="official-accounts-des">关注接收最新活动和福利通知</text>
                </view>
                <view class="follow-btn" @click="followOfficialAccounts">关注</view>
            </view>
        </view>
    </view>
</template>

<script>
import shareMixin from '@/common/mixin/share';
import presentCard from '@/views/components/gift/presentCard';
import { isNotEmpty, openUrl } from '@/utils/common';
export default {
    mixins: [shareMixin],
    components: {
        presentCard
    },
    data() {
        return {
            totalAmount: 0,
            paySn: '', //支付单号
            featherId: '',
            state: 0,
			orderNo: '', //订单号
            resultEnum: {
                0: {
                    img: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/icon_common_inprogress.svg',
                    text: '支付中'
                },
                1: {
                    img: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/icon_common_success.svg',
                    text: '支付成功'
                },
                2: {
                    img: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/icon_common_failure.svg',
                    text: '支付失败'
                },
                3: {
                    img: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/icon_common_warning.svg',
                    text: '支付取消'
                }
            },
            cardIndex: 0 //选择的贺卡的索引
        }
    },
    onLoad() {

    },
    computed:{
        // 是否显示鹅毛情贺卡 支付成功的鹅毛情订单才显示
        showPresentCard(){
            return this.state == 1 && isNotEmpty(this.featherId)
        },
    },
    async mounted() {
        this.state = this.$Route.query.state;
        this.featherId = this.$Route.query.featherId;
    },
    // 设置当前页面分享到朋友
    onShareAppMessage(option) {
        let shareMessage = {
            path: `/views/gift/receive/index?featherId=${this.featherId}&cardIndex=${this.cardIndex}`,
            imageUrl: `https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/card/${this.cardIndex}/share.png`
        }
        // 全局混入share.js
        let share = this.setShareAppMessage(shareMessage)
         
        return share;
    },
    methods: {
        choose(index){
            this.cardIndex = index;
        },
        toIndex() {
            uni.switchTab({
                url: '/pages/index/index'
            })
        },
        // 查看订单
        viewOrder() {
            // 鹅毛情订单
            if(!!this.featherId){
                this.$Router.replace({
                    path: '/views/gift/list/index',
                    query: {}
                })              
            }else{
                this.$Router.replace({
                    path: '/views/order/list/index'
                })
            }
        },
        // 关注公众号
        followOfficialAccounts() {
            openUrl('https://mp.weixin.qq.com/s/qH9xSrW6fKXRiQFhDzUH1w', '关注公众号')
        }
    }
}
</script>

<style scoped lang="scss">
.bg-content {
    overflow: hidden;
    min-height: 100vh;
    background: #fff;

    .content {
        width: 100vw;
        min-height: 100vh;
        background: linear-gradient(180deg,#ffffff, #f5f6f8 24%, #eff2f5);
        margin-top: 56rpx;
        display: flex;
        flex-direction: column;
        align-items: center;

		.btnWrap{
			width: 100%;
			margin-top: 40rpx;
			display: flex;
            padding: 0 56rpx;
            box-sizing: border-box;
            justify-content: space-between;
			.btn {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 304rpx;
                height: 84rpx;
                border: 1.6rpx solid #f30300;
                border-radius: 44rpx;
                background-color: #fff;
                font-size: 30rpx;
                font-weight: 600;
                color: #f30300;
				// &.btn_repay, &.btn_view{
				// 	background-color: $main-color;
				// 	color: #fff;
				// }
                &.btn_index{
                    background-color: #f30300;
					color: #FFF;
                    // border: 2rpx solid #999999;
                }
			}
		}

        .img-text {
			text-align: center;
            font-size: 0;
            .img {
                width: 112rpx;
                height: 112rpx;
            }

            .text {
                margin-top: 20rpx;
                height: 50rpx;
                font-size: 36rpx;
                font-weight: 600;
                color: #222;
            }
        }

        .official-accounts {
            display: flex;
            align-items: center;
            width: 710rpx;
            height: 152rpx;
            background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/order/bg_zf_gongzhonghao.png') no-repeat;;
            background-color: #FFF;
            padding: 24rpx 24rpx 24rpx 28rpx;
            margin-top: 48rpx;
            border-radius: 20rpx;
            .img-left {
                width: 104rpx;
                height: 104rpx;
                margin-right: 20rpx;
                .official-accounts-img {
                    width: 100%;
                    height: 100%;
                }
            }
            .des-text {
                display: flex;
                flex-direction: column;
                .official-accounts-name {
                    font-size: 32rpx;
                    font-weight: 600;
                    color: #222222;
                    margin-bottom: 6rpx;
                }
                .official-accounts-des {
                    font-size: 26rpx;
                    color: #83898d;
                }
            }
            .follow-btn {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 136rpx;
                height: 64rpx;
                margin-left: 64rpx;
                border: 1.6rpx solid #325abe;
                border-radius: 33.6rpx;
                font-size: 28rpx;
                font-weight: 600;
                color: #325abe;
            }
        }

        
    }
}
.present{
    margin-top: 80rpx;
    width: 100%;
}
</style>
