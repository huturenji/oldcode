<template>
    <view class="redpacket_container">
        <Tree :treeData="ruleList" />
    </view>
</template>

<script>
import { Tree } from "@/views/components/tree/tree";
export default {
    components: { Tree },
    data() {
        return {
            ruleList: [
                {
                    level: 1,
                    // 标题
                    title: '什么是红包',
                    content: "红包是巨拾惠商城的一种虚拟资产，可用于购买实物商品时抵扣支付金额(不含运费) 。",
                },
                {
                    level: 1,
                    // 标题
                    title: '红包的获取',
                    content: "参与巨拾惠商城各种活动可以获得相应的红包奖励，具体以实际活动为准。",
                },
                {
                    level: 1,
                    title: '红包使用规则',
                    content: [
                        {
                            level: 2,
                            title: '1.红包不可提现，不可转赠他人，不可为他人付款。单个红包不拆分、不找零、不兑换。',
                            content: ''
                        },
                        {
                            level: 2,
                            title: '2.红包有效期:红包有其相应的有效期，过期作废且不予补发。',
                            content: ' '
                        },
                        {
                            level: 2,
                            title: '3.红包使用范围: 红包仅限在巨拾惠商城购买实物商品使用，不可用于抵扣运费和购买虚拟商品及服务，比如虚拟业务、话费充值及投资类等。',
                            content: ' '
                        },
                        {
                            level: 2,
                            title: '4.红包支持与优惠券、运费券等优惠方式同时使用，且支持叠加多个红包，叠加的红包金额最大不超过订单扣除各种优惠后的支付金额 (不含运费)。',
                            content: ''
                        },
                        {
                            level: 2,
                            title: '5.红包退还说明:',
                            content: [
                                {
                                    level: 3,
                                    content: '1) 使用红包下单，若订单未拆分，则订单取消后，返还订单中已使用的红包;若订单被拆分，则取消全部拆分的订单后，返还订单中已使用的红包;若只取消部分子订单，则子订单中已使用的红包将不予返还。返还红包的原始有效期不变。'
                                },
                                {
                                    level: 3,
                                    content: '2)使用红包下单，若同一支付订单中全部商品发生售后退货，则返还商品下单时已使用的红包;若同一支付订单中仅部分商品发生售后退货，则退货商品对应已使用的红包将不予返还。返还红包的原始有效期不变。'
                                }
                            ]
                        },
                    ],
                },
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
.redpacket_container {
    min-height: 100vh;
    box-sizing: border-box;
    background-color: #fff;
    padding: 20rpx 48rpx 40rpx;
}

::v-deep .tree_title_wrap1 {
    padding: 36rpx 0 24rpx;
    display: flex;
    align-items: center;
    justify-content: flex-start;
}
::v-deep .tree_title_wrap1::before {
    content: '';
    display: block;
    width: 8rpx;
    height: 24rpx;
    background-color: #F30300;
    margin-right: 12rpx;
}

::v-deep .tree_content_wrap1 {
    padding: 16rpx 28rpx;
    background: #eff2f5;
    border-radius: 16rpx;
    overflow: hidden;
}

// 一级标题样式
::v-deep .tree_title1 {
    color: #222;
    font-weight: bold;
    font-size: 30rpx;
}

// 二级标题样式
::v-deep .tree_title2 {
    font-size: 26rpx;
    color: #666666;
    font-weight: bold;
    margin-bottom: 12rpx;
}

// 一级内容样式
::v-deep .tree_content1 {
    font-size: 26rpx;
    text-align: justify;
    color: #666666;
    line-height: 40rpx;
}

// 三级内容样式
::v-deep .tree_content3 {
    font-size: 26rpx;
    color: #666666;
    line-height: 40rpx;
    font-weight: 400;
    margin-bottom: 12rpx;
}

</style>