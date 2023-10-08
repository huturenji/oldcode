<!-- 红包规则 -->
<template>
    <view class="redpacket_rules">
        <view v-for="(item,index) in helpTipsCon" :key="index" class="rules_item" :class="{last_rules_item:index == helpTipsCon.length-1}">
            <view class="title">{{item.title}}</view>
            <view class="content">
                <view v-for="(item1,index1) in item.content" :key="index1" class="content_item">
                    <view class="tit">{{item1.tit}}</view>
                    <template v-if="item1.con.length>0">
                        <view v-for="(item2,index2) in item1.con" :key="index2" class="con" :class="{first_con:index2==0}">{{item2}}</view>
                    </template>
                    
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            helpTipsCon:[
                {
                    title:'什么是红包?',
                    content:[{tit:'红包是巨拾惠商城的一种虚拟资产，可用于购买实物商品时抵扣支付金额(不含运费) 。',con:[]}]
                },
                {
                    title:'红包的获取',
                    content:[{tit:'参与巨拾惠商城各种活动可以获得相应的红包奖励，具体以实际活动为准。',con:[]}]
                },
                {
                    title:'红包使用规则',
                    content:[
                        {tit:'1.红包不可提现，不可转赠他人，不可为他人付款。单个红包不拆分、不找零、不兑换。',con:[]},
                        {tit:'2.红包有效期:红包有其相应的有效期，过期作废且不予补发。',con:[]},
                        {tit:'3.红包使用范围: 红包仅限在巨拾惠商城购买实物商品使用，不可用于抵扣运费和购买虚拟商品及服务，比如虚拟业务、话费充值及投资类等。',con:[]},
                        {tit:'4.红包支持与优惠券、运费券等优惠方式同时使用，且支持叠加多个红包，叠加的红包金额最大不超过订单扣除各种优惠后的支付金额 (不含运费)。',con:[]},
                        {
                            tit:'5.红包退还说明 ：',
                            con:[
                                '1) 使用红包下单，若订单未拆分，则订单取消后，返还订单中已使用的红包;若订单被拆分，则取消全部拆分的订单后，返还订单中已使用的红包;若只取消部分子订单，则子订单中已使用的红包将不予返还。返还红包的原始有效期不变。',
                                '2) 使用红包下单，若同一支付订单中全部商品发生售后退货，则返还商品下单时已使用的红包;若同一支付订单中仅部分商品发生售后退货，则退货商品对应已使用的红包将不予返还。返还红包的原始有效期不变。'
                            ]
                        }
                    ]
                }
            ] //红包规则内容
        };
    },
    mounted(){
        // this.getHelpTips();
    },
    methods: {
        // 获取红包规则内容
        // getHelpTips(){
        //     let param={};
        //     param.data = {};
        //     param.data.names = 'redpacket_user_help';
        //     param.url = 'v3/system/front/setting/getSettings';
        //     param.method = 'GET';
        //     this.$request(param).then(res => {
        //         if (res.state == 200) {
        //             this.helpTipsCon = res.data[0] || '';
        //             this.helpTipsCon = this.helpTipsCon.replace(/\n/g,'\n\n').trim()
        //         }
        //     })
        // }
    }

}
</script>

<style lang="scss">
.redpacket_rules {
    min-height: 100%;
    padding: 0 48rpx 20rpx;
    background: #fff;
    .rules_item {
        line-height: 40rpx;
        font-size: 30rpx;
        color: #666666;
        white-space: pre-wrap;
        
        .title {
            padding-top: 34rpx;
            height: 100rpx;
            line-height: 42rpx;
            font-weight: bold;
            color: #222222;
            &::before {
                content: '';
                display: inline-block;
                margin-right: 12rpx;
                margin-bottom: -2rpx;
                width:8rpx;
                height: 24rpx;
                background: #f30300;
            }
        }
        .content {
            padding: 16rpx 28rpx;
            font-size: 26rpx;
            border-radius: 16rpx;
            color: #666666;
            background: #f5f6f8;
            .content_item {
                padding-bottom: 12rpx;
                &:last-of-type {
                    padding-bottom: 8rpx;
                }
                .tit {
                    line-height: 40rpx;
                }
                .con {
                    line-height: 40rpx;
                    margin-top: 12rpx;
                    &.first_con {
                        margin-top: 4rpx;
                    }
                }
            }
            
        }
        &.last_rules_item {
            margin-top: 18rpx;
            .tit {
                font-weight: bold;
            }
        }
    }
}
    
</style>