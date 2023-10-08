<!--
 * @Author: whchen
 * @Descripttion: 
 * @Date: 2023-04-18 08:52:32
 * @LastEditTime: 2023-05-17 09:58:34
 * @FilePath: \mobile-miniprogram\src\common\components\thumb-goods-tags\activity-tags.vue
-->
<template>
    <view class="activity_con" v-if="goods_info.activityList && goods_info.activityList.length > 0">
        <block v-for="(item, index) in goods_info.activityList" :key="index">
        <view class="act_label ladder_group" v-if="item.promotionType == 105">
            {{ item.promotionName }}
        </view>

        <!-- 满优惠 -->
        <view
            class="discount-label num-font"
            v-if="item.promotionType == 201 || item.promotionType == 202 || item.promotionType == 203 || item.promotionType == 204"
        >
            {{ getDiscountContent(item.promotionType, item.descriptionList) }}
        </view>
        <!-- 活动标签 -->
        <view class="activeLabelWrap" v-if="item.promotionType == 104 || item.promotionType == 106 || item.promotionType == 107">
            <activeLabel
                :promotionType="item.promotionType"
                :activeName="item.promotionName"
                :startTime="item.startTime"
                :endTime="item.endTime"
                >
            </activeLabel>
        </view>

        <view class="act_label preSale" v-if="item.promotionType == 103">
            {{ item.promotionName }}
        </view>

        <view class="act_label spellGroup" v-if="item.promotionType == 102">
            {{ item.promotionName }}
        </view>
        </block>
    </view>
</template>

<script>
import activeLabel from '@/common/components/activeLabel/activeLabel'
export default {
    components: { activeLabel },
    data() {
        return {};
    },
    props: {
        goods_info: {
            type: Object,
            default: () => ({}),
        },
    },
    computed: {},
    methods: {
        getNum(num){
            let _num
            if(num.endsWith('.00')){
                _num = parseFloat(num).toFixed(0)
            }else if(num.endsWith('0')){
                _num = parseFloat(num).toFixed(1)
            }else{
                _num = num
            }
            return _num
        },
        getDiscountContent(promotionType, descriptionList) {
            if (descriptionList && descriptionList.length){
                const content = descriptionList[0].promotionDescription;
                const firstLeftBrackets = content.indexOf('<');
                const lastLeftBrackets = content.lastIndexOf('<');
                const firstRightBrackets = content.indexOf('>');
                const lastRightBrackets = content.lastIndexOf('>');
                const fullPrice = content.substring(firstLeftBrackets + 1, firstRightBrackets);
                const discount = content.substring(lastLeftBrackets + 1, lastRightBrackets);
                if (promotionType === 201) {
                    let _fullPrice = this.getNum(fullPrice)
                    let _discount = this.getNum(discount)
                    return `满${_fullPrice}减${_discount}`
                }
                if (promotionType === 202) {
                    let _fullPrice = this.getNum(fullPrice)
                    let _discount = this.getNum(discount)
                    return `每满${_fullPrice}减${_discount}`
                }
                if (promotionType === 203) {
                    let _fullPrice = this.getNum(fullPrice)
                    let _discount 
                    if(discount.startsWith('0')){
                        _discount = parseFloat(discount).toFixed(1)
                    }else if(discount.indexOf('.00')==-1){
                        _discount = parseFloat(discount).toFixed(1).replace('.','')
                    }else{
                        _discount = parseFloat(discount).toFixed(0)
                    }
                    return `满${_fullPrice}打${_discount}折`
                }
                if (promotionType === 204) {
                    let _discount 
                    if(discount.startsWith('0')){
                        _discount = parseFloat(discount).toFixed(1)
                    }else if(discount.indexOf('.00')==-1){
                        _discount = parseFloat(discount).toFixed(1).replace('.','')
                    }else{
                        _discount = parseFloat(discount).toFixed(0)
                    }
                    return `${fullPrice}件${_discount}折`
                }
            }
            return ``
        },
    }
};
</script>

<style scoped lang="scss">
    .activity_con {
        display: flex;
        font-size: 22rpx;
        color: #ffffff;
        margin-top: 18rpx;
        flex-wrap: wrap;
        .act_label {
            margin-right: 12rpx;
            margin-bottom: 4rpx;
            line-height: 32rpx;
            padding: 0 8rpx;
            font-size: 20rpx;
            color: #f30300;
            border: 2rpx solid #f30300;
            border-radius: 6rpx;
        }
        .discount-label {
            display: inline-block;
            height: 32rpx;
            // line-height: 32rpx;
            border: 1rpx solid #f30300;
            border-radius: 4rpx;
            padding: 0 16rpx;
            text-align: center;
            color: #f30300;
            font-size: 20rpx;
            margin-right: 12rpx;
            margin-bottom: 14rpx;
            transform: rotateZ(360deg);
        }
        .activeLabelWrap{
            width: 100%;
            display: flex;
        }
    }
</style>
