<template>
    <view class="hotSale" >
        <view class="hotSaleTop">
            <view
                class="hotSaleTopLeft"
                :style="{backgroundImage: decoItem.props.leftText.title?'':'url(' + decoItem.props.leftText.img + ')'}"
                @click="goDetail(decoItem.props.leftText)"
            >
                {{ decoItem.props.leftText.title }}
            </view>
            <view
                class="hotSaleTopRight"
                :style="{backgroundImage: decoItem.props.rightText.title?'':'url(' + decoItem.props.rightText.img + ')'}"
                @click="goDetail(decoItem.props.rightText)"
            >
                {{ decoItem.props.rightText.title }}
            </view>
        </view>
        <view class="hotSaleGoods">
            <!-- <scroll-view scroll-x show-scrollbar="false"> -->
                <thumb v-for="item in goodsList()" :key="item.sku" :goods="item" class="goodsItem" :showThumbTips="true"></thumb>
            <!-- </scroll-view> -->
        </view>
    </view>
</template>

<script>
import pullProdouctPriceMixin from '@/common/mixin/pullProdouctPriceMixin'
import thumb from '@/common/components/thumb/thumb-decorate-h.vue';
import mixin from "@/common/components/decorate/common/mixin/index";
import { skipTo } from '@/utils/common.js'

export default {
    mixins: [pullProdouctPriceMixin, mixin],
    name: "deco-goods-hotsale",
    components: {
        thumb
    },
    data() {
        return {
            // 该数据结构是为了方便使用公共的listBySku相关方法
            goodsData: {
                data: {
                    ids: [],
                    info: [],
                    done: false
                }
            }
        }
    },
    props: {
        decoItem:{
            type: Object,
            default: () => {}
        }
    },
    mounted() {
        this.initData(this.decoItem)
        this.decoItem.data[0].info.compareList&&this.decoItem.data[0].info.compareList.sort((a,b)=>a.salePrice-b.salePrice)
    },
    methods:{
        initData(data) {
            this.goodsData.data = data.data
            this.initDecoGoodsData(this.goodsData, data.props.filterNosaleGoods);//在pullProdouctPriceMixin中
        },
        goodsList() {
            let list = []
            try {
                list = this.goodsData.data[0].info
            } catch (error) {
                list = []
            }
            return list
        },
        goDetail(item) {
            skipTo(item,this)
        }
    }
}
</script>

<style lang="scss" scoped>
    .hotSale{
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        .hotSaleTop{
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin: 0 30rpx 0 30rpx;
            .hotSaleTopLeft{
                width: 100rpx;
                height: 40rpx;
                font-size: 34rpx;
                font-weight: 600;
                color: #222222;
                background-repeat: no-repeat;
                background-position: center;
                background-size: 100% 100%;
            }
            .hotSaleTopRight{
                width: 100rpx;
                height: 32rpx;
                font-size: 24rpx;
                font-weight: 400;
                color: #222222;
                background-repeat: no-repeat;
                background-position: center;
                background-size: 100% 100%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
        .hotSaleGoods{
            width: 100%;
            display: flex;
            overflow-x: auto !important;
            flex-wrap: nowrap;
            // white-space: nowrap;
            .goodsItem{
                flex-shrink: 0;
                border-radius: 0;
                overflow: hidden;
                box-sizing: border-box;
                width: 640rpx;
                margin-right: 20rpx;
                margin-top: 0;
               
            }
            .goodsItem:first-child{
                margin-left: 30rpx;
            }
        }
    }
</style>