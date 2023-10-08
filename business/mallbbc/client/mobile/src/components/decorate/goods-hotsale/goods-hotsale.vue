<template>
    <view class="hotSale" v-margin="decoItem">
        <view class="hotSaleTop">
            <view class="hotSaleTopLeft" :style="{backgroundImage: decoItem.props.leftText.title?'':'url(' + decoItem.props.leftText.img + ')'}" @click="goDetail(decoItem.props.leftText)" >{{decoItem.props.leftText.title}}</view>
            <view class="hotSaleTopRight" :style="{backgroundImage: decoItem.props.rightText.title?'':'url(' + decoItem.props.rightText.img + ')'}" @click="goDetail(decoItem.props.rightText)">{{decoItem.props.rightText.title}}</view>
        </view>
        <view class="hotSaleGoods">
            <!-- <scroll-view scroll-x="true" show-scrollbar="false"> -->
                <thumbUnionBijiaH v-for="(item,index) in goodsList" :key="index" :goods_info="item" class="goodsItem" :showThumbTips="true"></thumbUnionBijiaH>
            <!-- </scroll-view> -->
        </view>

    </view>
</template>

<script>
import pullProdouctPriceMixin from '@/common/mixin/pullProdouctPriceMixin'
import thumbUnionBijiaH from "@/components/goods/thumb/thumb-decore-row.vue";
import {
    skipTo,isNotEmpty
} from '@/utils/common.js'
export default {
    mixins: [pullProdouctPriceMixin],
    name: "deco-goods-hotsale",
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
        },
        isDecoReady: {}
    },
    computed: {
        // 商品列表
        goodsList() {
            return this.goodsData.data.info
        }
    },
    watch: {
        decoItem: {
            handler(val) {
                if (isNotEmpty(val) && this.isDecoReady){
                    this.initData(JSON.parse(JSON.stringify(val)))
                }
            },
            deep: true,
            immediate: true
        }              
    },
    mounted(){
        this.decoItem.data[0].info.compareList&&this.decoItem.data[0].info.compareList.sort((a,b)=>a.salePrice-b.salePrice)
    },
    components: {
        thumbUnionBijiaH
    },
    methods:{
        initData(data) {
            this.goodsData.data = data.data[0]
            this.initDecoGoodsData(this.goodsData, data.props.filterNosaleGoods);//在pullProdouctPriceMixin中
        },
        goDetail(item) {
            skipTo(item,this)
        }
        
    }
}
</script>

<style lang="less">
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
            display: flex;
            overflow-x: auto!important;
            flex-wrap: nowrap;
            // white-space: nowrap;
            width: 100%;
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