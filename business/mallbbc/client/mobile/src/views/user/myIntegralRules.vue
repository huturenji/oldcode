<!-- 我的红包 -->
<template>
    <view class="integral_rules">
        <view class="top">
            <view class="title flex_row_start_center">{{$L('什么是云豆？')}}</view>
            <view class="definition_con content">
                <view>{{definitionObj.definition1}}</view>
                <view><text>[云豆查询]</text> 您可以在“我的-我的云豆”中可查询到您的云豆详细情况。</view>
            </view>
        </view>
        <view class="bottom">
            <view class="title flex_row_start_center">{{$L('云豆使用常见问题')}}</view>
            <view class="question_con content">
                <view v-for="(item,index) in getQuestionList" :key="index" class="question_item">
                    <view class="question_title">{{item.question}}</view>
                    <view v-for="(item1,index1) in item.answer" :key="index1">
                        <view class="answer">{{item1}}</view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>
<script module="filters" lang="wxs" src="../../utils/filter.wxs"></script>
<script>
    export default {
        data() {
            return {
                integral_conversion_ratio:0,
                definitionObj:{
                    definition1:'云豆是巨拾惠小程序用户在巨拾惠小程序签到、赠送等相关活动情况给予的优惠，云豆仅可在巨拾惠小程序使用，如用户帐号暂停使用，巨拾惠将取消该用户帐号内云豆相关使用权益。云豆可用于支付巨拾惠小程序订单，具体以相关规则为准。',
                    definition2:'[云豆查询] 您可以在“我的-我的云豆”中可查询到您的云豆详细情况。'
                },
            };
        },
        computed: {
            getQuestionList() {
                let questionList = [
                    {
                        question:'一 云豆的有效期',
                        answer:[
                            '1  通过签到获得的云豆，有效期最长1年，即从获得云豆开始至次年同日，逾期自动作废（如若交易在使用云豆有效期之外发生退款，该部分云豆不予退还)；例2015年12月31日将清空2014年12月31日客户获得但未使用的云豆。',
                            '2  通过特定活动获得的云豆，有效期以具体活动规则为准。'
                        ]
                    },
                    {
                        question:'二 云豆的兑换比例',
                        answer:[
                            `云豆和人民币兑换比例是100:${this.integral_conversion_ratio}，即100个云豆相当于人民币${this.integral_conversion_ratio}元。`,
                        ]
                    },
                    {
                        question:'三 云豆如何获取',
                        answer:[
                            '用户在巨拾惠进行打卡签到活动或特殊渠道赠送可以获得云豆。',
                        ]
                    },
                    {
                        question:'四 如何查询即将过期的云豆',
                        answer:[
                            '您可以进入“我的->云豆”查看即将过期的云豆数量。',
                        ]
                    }
                ]
                return questionList
            }
        },
        mounted(){
            this.getintegralConRatio();
        },
        methods: {
            // 获取积分抵扣比例
            getintegralConRatio(){
                let param={};
                param.data = {};
                param.data.names = 'integral_conversion_ratio';
                param.url = 'v3/system/front/setting/getSettings';
                param.method = 'GET';
                this.$request(param).then(res => {
                    if (res.state == 200) {
                        this.integral_conversion_ratio = res.data[0]
                        
                    }
                })
            }
        },

    }
</script>

<style lang="scss">
.integral_rules {
    min-height: 100%;
    padding: 0 48rpx 48rpx;
    background: #fff;
    .title {
        height: 100rpx;
        line-height: 42rpx;
        font-size: 30rpx;
        font-weight: bold;
        color: #222;
        &::before {
            content: '';
            display: block;
            width: 48rpx;
            height: 48rpx;
            margin-right: 16rpx;
            background: url("@/static/shared/yundou/icon_yundouguize.png") center/100% 100% no-repeat;
        }
    }
    .content {
        padding: 16rpx 28rpx 24rpx;
        border-radius: 16rpx;
        font-size: 26rpx;
        background: #eff2f5;
        color: #666666;
        .question_title {
            line-height: 42rpx;
            font-weight: bold;
        }
        .answer {
            margin-top: 8rpx;
            line-height: 40rpx;
        }
    }
    .definition_con {
        view {
            line-height: 40rpx;
            text {
                font-weight: bold;
                padding-right: 10rpx;
            }
        }
        >view:last-child {
            margin-top: 16rpx;
        }
    }
    .question_con {
        .question_item {
            margin-top: 20rpx;
        }
    }
}
    
</style>