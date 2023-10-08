<template>
    <view class="bg" ref="bg">
        <view class="faq-container">
            <view class="faq-content" v-for="(faq, qaIndex) in FAQList" :key="qaIndex">
                <view class="title-wrapper" @click="toggle(faq)">
                    <view>
                        <view class="mark"></view>
                        <view class="title">{{ faq.title }}</view>
                    </view>

                    <view>
                        <image v-if="faq.expandFlag" class="arrow"
                            src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_downarrow_gray.svg"></image>
                        <image v-else class="arrow" :src="imgUrl + 'common/icon/btn_common_rightarrow_gray.svg'">
                        </image>
                    </view>
                </view>
                <view class="content-wrapper" v-show="faq.expandFlag">
                    <block v-if="Array.isArray(faq.content)">
                        <view class="sub-content" v-for="(subContent, subContentIndex) in faq.content"
                            :key="subContentIndex">
                            <view class="sub-title" v-if="subContent.title">
                                {{ subContent.title }}
                            </view>
                            <view class="sub-content-wrapper">
                                <view class="sub-content-value">
                                    <block v-if="!Array.isArray(subContent.content)">{{ subContent.content }}</block>
                                </view>
                            </view>
                        </view>
                    </block>
                    <block v-else>
                        <view class="content-value">
                            {{ faq.content }}
                        </view>
                    </block>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import shareMixin from '@/common/mixin/share';
export default {
    mixins: [shareMixin],
    data() {
        return {
             
            FAQList: [
                {   // 标题
                    title: '鹅毛情是什么？',
                    // 是否展开                    
                    expandFlag: false,
                    // 内容&目录：数组则为子条目，字符串则为具体内容
                    content: "鹅毛情是一个新颖的即时在线送礼小程序。自古有“千里送鹅毛，礼轻情意重”，表示礼物的价值在于送礼者的心意，而非礼物本身的价值，现可通过鹅毛情送出惊喜，传递温情！",
                },
                {
                    title: '怎么送礼物？',
                    expandFlag: false,
                    content: [
                        {
                            title: '',
                            content: '1. 打开“鹅毛情”小程序，浏览礼品进入礼品详情页面'
                        },
                        {
                            title: '',
                            content: '2.确定礼品后，点击送给朋友，购买并完成支付'
                        },
                        {
                            title: '',
                            content: '3. 再点击“用微信送礼单”即可分享给微信好友（包含个人及群聊'
                        }
                    ],
                },
                {
                    title: '朋友如何用？',
                    expandFlag: false,
                    content: [
                        {
                            title: '',
                            content: '1.微信好友收到礼单后点击链接进入礼单详情页面，朋友填写地址即可完成收礼，无需支付任何费用，领取成功后由京东发货并配送到家'
                        },
                        {
                            title: '',
                            content: '2.已领取的礼物可在“我的-我收到的”记录中查看'
                        }
                    ]
                },
                {
                    title: '注意事项',
                    expandFlag: false,
                    content: [
                        {
                            title: '退款说明',
                            content: "礼物若出现无货等特殊情况时，平台会在商品到货后第一时间通知领取。"
                        },
                        {
                            title: '注意事项',
                            content: "礼物超过7天末被领取，将自动发起退款，订单支付的金额将原路退回；已被领取的礼物不支持退款。"
                        },
                        {
                            title: '联系客服',
                            content: "如有其他问题，可联系客服热线：400-855-6588"
                        }
                    ]
                }
            ]
        }
    },
    methods: {
        toggle(item) {
            item.expandFlag = !item.expandFlag
        }
    }
}
</script>

<style lang="scss" scoped>
.bg {
    min-height: 100vh;
    padding-top: 20rpx;
    box-sizing: border-box;
    background-color: #fff;
}

.faq-container {
    padding: 0 48rpx 40rpx;

    .faq-content {
        .title-wrapper {
            padding: 36rpx 0 24rpx;
            display: flex;
            align-items: center;
            justify-content: space-between;

            &>view:nth-child(1) {
                display: flex;
                align-items: center;
            }

            .mark {
                width: 8rpx;
                height: 24rpx;
                background-color: #F30300;
                margin-right: 12rpx;
            }

            .title {
                color: #222;
                font-weight: bold;
                font-size: 28rpx;
            }

            .arrow {
                width: 24rpx;
                height: 24rpx;
                margin-left: 6rpx;
            }

        }

        .content-wrapper {
            padding: 16rpx 28rpx;
            background: #eff2f5;
            border-radius: 16rpx;
            overflow: hidden;

            .content-value {
                font-size: 26rpx;
                text-align: justify;
                color: #666666;
                line-height: 40rpx;
            }
        }
    }

    .sub-content {
        margin-bottom: 20rpx;

        .sub-title {
            font-size: 26rpx;
            color: #222;
            font-weight: bold;
        }

        .sub-content-wrapper {
            margin-top: 8rpx;

            .sub-content-value {
                font-size: 26rpx;
                text-align: justify;
                color: #666666;
                line-height: 40rpx;
            }
        }
    }
}
</style>