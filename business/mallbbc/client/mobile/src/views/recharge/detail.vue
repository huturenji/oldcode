<template>
    <view class="container flex_column_start_start">
        <view class="top flex_column_start_center">
            <view class="member_info flex_row_center_center">
                <view class="avatar" :style="{backgroundImage: 'url('+userCenterData.memberAvatar+')'}" />
                <text class="name">{{rechargeDetail.memberName}}</text>
            </view>
            <view :class="{amount:true,success:rechargeDetail.rechargeState==2,flex_row_center_center:true}">
                <text class="flag">+</text>
                <text>{{rechargeDetail.payAmount}}</text>
            </view>
            <view class="tip">{{$L('交易金额')}}</view>
        </view>
        <view v-for="(item,key,index) in detail" :key='index' class="detail_item flex_row_between_center">
            <text class="left">{{item.name}}</text>
            <text class="right">{{item.value}}</text>
        </view>
        <view v-if='rechargeDetail.payState==1' class="recharge_btn flex_row_center_center" @click="confirmRecharge">{{$L('继续充值')}}</view>
    </view>
</template>

<script>
import {
    mapState
} from 'vuex';
export default {
    data() {
        return {
            rechargeDetail: {}, //充值数据
            detail: [],
            rechargeId:'' //充值id
        };
    },
    onLoad() {
        // if(this.$Route.query.rechargeId){
        //     this.rechargeId = this.$Route.query.rechargeId;
        //     this.getDetail(this.$Route.query.rechargeId);
        // }
    },
    computed: {
        ...mapState(['userInfo', 'userCenterData'])
    },
    mounted() {
        if (this.$Route.query.rechargeId){
            this.rechargeId = this.$Route.query.rechargeId;
            this.getDetail(this.$Route.query.rechargeId);
        }
    },
    methods: {
        //获取充值详情
        getDetail(id) {
            this.$request({
                url: 'v3/member/front/balanceRecharge/detail',
                data: {
                    key: this.userInfo.access_token,
                    rechargeId: id
                }
            }).then(res => {
                if (res.state == 200) {
                    this.rechargeDetail = res.data;
                    if (res.data.rechargeState == 2) {
                        this.detail.push({
                            name: '交易状态',
                            value: res.data.payStateValue
                        });
                        this.detail.push({
                            name: '交易方式',
                            value: res.data.rechargeName
                        });
                        this.detail.push({
                            name: '交易时间',
                            value: res.data.createTime
                        });
                        this.detail.push({
                            name: '交易单号',
                            value: res.data.rechargeSn
                        });
                        this.detail.push({
                            name: '交易流水号',
                            value: res.data.tradeSn
                        });
                    } else {
                        this.detail.push({
                            name: '交易状态',
                            value: res.data.payStateValue
                        });
                        this.detail.push({
                            name: '交易时间',
                            value: res.data.createTime
                        });
                    }
                } else {
                    this.$api.msg(res.msg);
                }
            }).catch(() => {
                //异常处理
            })
        },
        //继续充值
        confirmRecharge() {
            this.$Router.push({path:'/pages/recharge/recharge',query:{rechargeSn:this.rechargeDetail.rechargeSn,payMethodType:'rechargeDetail',rechargeId:this.rechargeId}})
        }
    }
}
</script>

<style lang='scss'>
    page {
        background: #ffffff;
        width: 750rpx;
        margin: 0 auto;
        .container {
            margin-top: 20rpx;
            flex: 1;
            background: #fff;

            .top {
                width: 100%;
                height: 26.54vh;
                border-bottom: 1rpx solid rgba(0, 0, 0, .1);

                .member_info {
                    margin-top: 7.12vh;

                    .avatar {
                        background-size: cover;
                        background-position: center center;
                        background-repeat: no-repeat;
                        width: 51rpx;
                        height: 51rpx;
                        overflow: hidden;
                        background-color: #F8F6F7;
                        border-radius: 50%;
                    }

                    .name {
                        color: $main-font-color;
                        font-size: 32rpx;
                        margin-left: 10rpx;
                    }
                }

                .amount {
                    color: $main-third-color;
                    font-size: 48rpx;
                    font-weight: bold;
                    margin-top: calcAdaptHeight(40);

                    &.success {
                        color: #FF2121;
                    }

                    .flag {
                        margin-top: -5rpx;
                        margin-right: 3rpx;
                    }
                }

                .tip {
                    color: $main-third-color;
                    font-size: 28rpx;
                    margin-top: calcAdaptHeight(12);
                }
            }

            .detail_item {
                width: 100%;
                padding: calcAdaptHeight(50) 40rpx 0;

                .left {
                    color: $main-font-color;
                    font-size: 28rpx;
                }

                .right {
                    color: $main-third-color;
                    font-size: 26rpx;
                }
            }

            .recharge_btn {
                position: absolute;
                left: 50%;
                transform: translateX(-375rpx);
                bottom: 40rpx;
                width: 670rpx;
                margin: 0 40rpx;
                height: 88rpx;
                background: linear-gradient(-90deg, rgba(252, 29, 28, 1) 0%, rgba(255, 122, 24, 1) 100%);
                box-shadow: 0px 3rpx 20rpx 0px rgba(252, 31, 28, 0.26);
                border-radius: 44rpx;
                color: #fff;
                font-size: 36rpx;
            }
        }
    }

    uni-page-body {
        display: flex;
        height: 100%;
    }
</style>
