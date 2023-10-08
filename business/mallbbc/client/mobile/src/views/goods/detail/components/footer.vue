<template>
    <!-- 底部按钮操作 -->
    <view class="footer">
        <!-- 活动商品 start -->
        <block v-if="valiInfo(secKillInfo)&& secKillInfo.state == 2">
            <!-- 秒杀活动  立即秒杀 已抢完 start -->
            <view class="action_btn_group" v-if="secKillInfo.state == 2">
                <template v-if="!disabled && !!seckillStock ">
                    <button type="primary" class="action_btn add_cart_btn flex_row_center_center fontScaleIgnore"
                        @click="showSpecModel('add')">{{$L('加入购物车')}}</button>
                    <button type="primary"
                        class="action_btn instant_second_kill flex_row_center_center fontScaleIgnore"
                        :class="{disable: !!disabled}"
                        @click="showSpecModel"
                        >{{$L('立即秒杀')}}
                    </button>
                </template>
                <button type="primary" class="action_btn seckill_finished flex_row_center_center fontScaleIgnore"
                    @click="showSpecModel" v-else>{{$L('已抢完')}}</button>
            </view>
            <!-- 秒杀活动 立即秒杀 已抢完 end -->
        </block>
        <block v-else-if="valiInfo(buyTogetherInfo)&&buyTogetherInfo.state==2">
            <view class="action_btn_group" v-if="buyTogetherInfo.state == 2">
                <template v-if="onSale">
                    <button v-if="!disabled" type="primary" class="action_btn instant_ecbuy_kill flex_row_center_center fontScaleIgnore"
                        :class="{disable: !!disabled}"
                        @click="showSpecModel"
                        >{{$L('一起买')}} </button>
                    <button v-else type="primary" class="action_btn ecbuy_finished flex_row_center_center fontScaleIgnore"
                        @click="showSpecModel" >{{$L('库存不足')}}</button>                 
                </template>
                <view v-else class="action_btn_group">
                    <button type="primary" class="action_btn not_stock flex_row_center_center fontScaleIgnore">{{$L('商品已下架')}}</button>
                </view>                            
                
            </view>
        </block>
        <block v-else-if="valiInfo(preSellInfo)&&preSellInfo.pre_run==2">
            <!-- 预售活动 立即付定金，全款支付 start -->
            <view class="action_btn_group">
                <block
                    v-if="!hasStock">
                    <button type="primary" class="action_btn not_stock flex_row_center_center fontScaleIgnore"
                        @click="showSpecModel">{{$L('库存不足')}}</button>
                </block>
                <block v-else>
                    <button type="primary" class="action_btn preSale_btn_deposit flex_row_center_center fontScaleIgnore"
                        @click="showSpecModel">立即付定金￥{{preSellInfo.firstMoney}}</button>
                </block>
            </view>
        </block>

        <block v-else-if="valiInfo(ladderInfo)&&ladderInfo.ladder_run==2">
            <view class="action_btn_group">
                <button type="primary" class="action_btn not_stock flex_row_center_center fontScaleIgnore" @click="showSpecModel"
                    v-if="!hasStock">{{$L('库存不足')}}</button>
                <view @tap.stop="showSpecModel" class="ladder_btn" data-type="jtt" v-else>{{$L('立即付定金')}}</view>
            </view>
        </block>

        <block v-else-if="valiInfo(pinInfo)&&pinInfo.state==1">
            <block
                v-if="!hasStock">
                <view class="action_btn_group">
                    <button type="primary" class="action_btn not_stock flex_row_center_center fontScaleIgnore"
                        @click="showSpecModel">{{$L('库存不足')}}</button>
                </view>
            </block>
            <block v-else>
                <view class="pinGroup_btn num-font">
                    <view class="group_shopping_alone" @tap="showSpecModel('pinAlone')" data-alonePin="true">
                        <view class="group_alone_price">￥{{pinInfo.salePrice}}</view>
                        <view class="group_alone_title">单独买</view>
                    </view>
                    <view class="go_group num-font" @tap="showSpecModel('pinLeague')" data-alonePin="false">
                        <view class="go_group_price">￥{{pinInfo.leaderPrice?pinInfo.leaderPrice:pinInfo.spellPrice}}
                        </view>
                        <view class="go_group_title">{{'去开团'}}</view>
                    </view>
                </view>
            </block>
        </block>

        <!-- 活动商品 end -->

        <!-- 正常商品 start -->
        <block v-else>
            <!--商品已下架 start -->
            <view class="action_btn_group" v-if="!onSale">
                <button type="primary" class="action_btn not_stock flex_row_center_center fontScaleIgnore">{{$L('商品已下架')}}</button>
            </view>
            <!--商品已下架 end -->
            <!--库存不足start -->
            <view class="action_btn_group"
                v-else-if="!hasStock">
                <button type="primary" class="action_btn not_stock flex_row_center_center fontScaleIgnore"
                    @click="showSpecModel">{{$L('库存不足')}}</button>
                
            </view>
            <!--库存不足 end -->
            <!-- 普通商品 start -->
            <view class="action_btn_group" :class="{disable: !!disabled}" v-else>
                <button type="primary" class="action_btn add_cart_btn flex_row_center_center fontScaleIgnore"
                    @click="showSpecModel('add')">{{$L('加入购物车')}}</button>
                <button type="primary" class="action_btn buy_now_btn flex_row_center_center fontScaleIgnore"
                    @click="showSpecModel('buy')">{{$L('立即购买')}}</button>
            </view>
            <!-- 普通商品 end -->
        </block>
        <!-- 正常商品 end -->
    </view>
</template>
<script>
export default {
    props:{  
        secKillInfo: {
            type: Object,
            default:()=>{}
        },
        buyTogetherInfo: {
            type: Object,
            default:()=>{}
        },
        preSellInfo: {
            type: Object,
            default:()=>{}
        },
        ladderInfo: {
            type: Object,
            default:()=>{}
        },
        pinInfo: {
            type: Object,
            default:()=>{}
        },
        goodsData: {
            type: Object,
            default:()=>{}
        },
        hasStock: {
            type: Boolean,
            default:true
        },
        disabled: {
            type: Boolean,
            default:false
        },
        seckillStock: {
            type: Boolean,
            default: true
        },
        onSale: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        valiInfo(info) {
            return JSON.stringify(info) != '{}'
        },

        showSpecModel(type){
            this.$emit('showSpecModel', type)
        }
            
    }
}
</script>
<style scoped lang='scss'>
.footer{
    overflow: hidden;
    margin-left: 24rpx;
    height: 72rpx;
    display: flex;
}
.action_btn_group {
    display: flex;
    height: 72rpx;
    overflow: hidden;

    .action_btn.fontScaleIgnore {
        height: 100%;
        font-size: 30rpx;
        font-weight: 600;

        &::after {
            border: none;
        }
    }

    .add_cart_btn {
        padding: 0;
        width: 196rpx;
        border-radius: 36rpx 0 0 36rpx;
        font-weight: 600;
        background: var(--addCartBg);
        color: var(--addCartColor);
        border: var(--addCartBorder);
        border-right: var(--addCartBorderR);
    }

    .buy_now_btn {
        padding: 0;
        width: 196rpx;
        background: var(--buyNowBg1);
        color: var(--prizeColor2);
        border-radius: 0 36rpx 36rpx 0;
        font-weight: 600;
    }
    &.disable{
        .add_cart_btn{
            opacity: .4;
        }
        .buy_now_btn{
            opacity: .4;
        }
    }

    .not_stock {
        width: 420rpx;
        background: var(--buyNowBg1);
        color: var(--prizeColor2);
        border-radius: 35rpx;
        opacity: .4;
    }
    .click_order{
        width: 420rpx;
        background: #F30300;
        border-radius: 35rpx;
        &.cancel_order{
            opacity: .4;
        }
    }

    .instant_second_kill {
        &.disable{
            opacity: .4;
        }
        height: 70rpx;
        
        font-weight: 500;
        color: var(--prizeColor2);
        line-height: 30rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 197rpx;
        background: var(--buyNowBg1);
        border-radius: 0 35rpx 35rpx 0;
    }
    .instant_ecbuy_kill {
        border-radius: 36rpx;
        height: 72rpx;
        
        font-weight: 500;
        color: var(--prizeColor2);
        line-height: 30rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 466rpx;
        background: var(--buyNowBg1);
    }
    .ecbuy_finished {
        width: 420rpx;
        background: var(--buyNowBg1);
        color: var(--prizeColor2);
        border-radius: 35rpx;
        opacity: .4;
    }

    .instant_pay_deposit {
        width: 420rpx;
        height: 70rpx;
        background: linear-gradient(45deg, #FF7A18 0%, #FEA10E 100%);
        border-radius: 35rpx;
        font-size: 28rpx;
        
        font-weight: 500;
        color: #FFFFFF;
        line-height: 26rpx;
    }

    .seckill_finished {
        width: 420rpx;
        height: 70rpx;
        background: #999999;
        border-radius: 35rpx;
        font-size: 28rpx;
        
        font-weight: 500;
        color: #FFFFFF;
        line-height: 30rpx;
    }

    .preSale_btn_deposit {
        width: 420rpx;
        height: 70rpx;
        background: linear-gradient(45deg, #FF7A18 0%, #FEA10E 100%);
        border-radius: 35rpx;
        font-size: 28rpx;
        
        font-weight: 500;
        line-height: 30rpx;
        padding: 0 20rpx;
    }

    .preSale_btn_buy {
        height: 70rpx;
        background: linear-gradient(45deg, rgba(252, 45, 45, 1) 0%, rgba(253, 87, 43, 1) 100%);
        border-radius: 0 35rpx 35rpx 0;
        font-size: 28rpx;
        
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 30rpx;
        padding: 0 30rpx;
    }
}

.ladder_btn {
    width: 420rpx;
    height: 70rpx;
    background: linear-gradient(45deg, rgba(255, 122, 24, 1) 0%, rgba(254, 161, 14, 1) 100%);
    border-radius: 35rpx;
    font-size: 28rpx;
    
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    line-height: 70rpx;
    text-align: center;
}
/* 拼团购买按钮start */
 
.pinGroup_btn {
    display: flex;
}

.group_shopping_alone {
    width: 223rpx;
    height: 70rpx;
    background: linear-gradient(45deg, rgba(255, 121, 24, 1) 0%, rgba(254, 160, 13, 1) 100%);
    border-radius: 34rpx 0 0 34rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.group_alone_price {
    font-size: 24rpx;
    
    font-weight: normal;
    color: rgba(255, 255, 255, 1);
    line-height: 30rpx;
}

.group_alone_title {
    font-size: 24rpx;
    
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    line-height: 30rpx;
}

.go_group {
    width: 197rpx;
    height: 70rpx;
    background: linear-gradient(45deg, rgba(251, 45, 45, 1) 0%, rgba(252, 87, 42, 1) 100%);
    border-radius: 0 34rpx 34rpx 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.go_group_price {
    font-size: 24rpx;
    
    font-weight: normal;
    color: rgba(255, 255, 255, 1);
    line-height: 30rpx;
}

.go_group_title {
    font-size: 24rpx;
    
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    line-height: 30rpx;
}


/* 拼团购买按钮end */

</style>