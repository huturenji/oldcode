<template>
    <!--推荐商品-->
    <view v-margin="decoItem">
        <!-- 商品骨架图部分 -->
        <thumbSkeleton
            v-if="showSkeletonLoading" 
            :showType="skeletonStyle[decoProps.show_style]"
            :quantity="dealNumber()"
        />
        
        <template v-if="!showSkeletonLoading && goodsList.length">
            <view class="tjsp_title" v-if="decoProps.title">{{ decoProps.title }} </view>
            <view class="width100">
                <!-- 标题 -->
                <view v-if="smallCheck" style="width: 100%;">
                    <goodsListWaterfall
                        ref='goodsListWaterfall'
                        :isInOffcanvas="isChildren"
                        :list="goodsList"
                        :addTime="0"
                        :showCart="false"
                        :showMore="decoProps.isShowMore && isloadDone"
                        :showThumbTips="true"
                        mode="replaceAndUpdate"
                    />
                    <loadingState :state='loadingStates' v-if="!isloadDone && !showSkeletonLoading" />
                </view>   
    
                <!-- 对应装修的商品展示模式为：比价列表 -->
                <template v-if="bijiaCheck">
                    <thumbDecoreRow
                        v-for="item in goodsList"
                        class="goods_item" 
                        :key="item.sku"
                        :isInOffcanvas="isChildren"
                        :goods_info="item"
                        :showThumbTips="true"
                    />
                </template>
    
                <!-- 对应装修的商品展示模式为：大图比价 -->
                <template v-if="datubijiaCheck">
                    <thumbDecoreBig class="goods_item" v-for="item in goodsList" :key="item.sku" :goods_info="item" :showThumbTips="true" />
                </template>
    
                <!-- 对应装修的商品展示模式为：一行两个2 -->
                <template v-if="decoProps.show_style === 'half_rank'">
                    <view class="twoGoodsList">
                        <view class="column">
                            <thumbNormalSmall class="goods_item" v-for="item in twoGoodsList(0)" :key="item.sku" :goodsItem="item" :showThumbTips="true" />
                        </view>
                        <view class="column">
                            <thumbNormalSmall class="goods_item" v-for="item in twoGoodsList(1)" :key="item.sku" :goodsItem="item" :showThumbTips="true" />
                        </view>
                    </view>
                </template>
    
                <!-- 都在买一行一个 -->
                <template v-if="decoProps.sources === 'allbuy'">
                    <thumbBillboardNew class="goods_item" v-for="item in goodsList" :key="item.sku" :goodsItem="item" />
                </template>
    
                <!-- loading状态和缺损页 只有非一行两个的模式才有 -->
                <template v-if="decoProps.show_style != 'small'">
                    <loadingState :state='loadingStates' v-if="!isloadDone && !showSkeletonLoading" />
                    <noMoreDataDivider v-if="decoProps.isShowMore && isloadDone" />
                </template>
            </view>
        </template>

        <template v-if="!showSkeletonLoading && goodsList.length === 0 && isloadDone">
            <view class="no_goods">
                <view class="no_goods_text">
                    <view class="img"></view>
                    <text>暂无数据</text>
                </view>
            </view>
        </template>
  </view>
</template>

<script>
import pullProdouctPriceMixin from '@/common/mixin/pullProdouctPriceMixin'
import loadingState from "@/components/loading/loading.vue";
import cartMixin from '@/common/mixin/cartMixin'
import { mapGetters } from "vuex";
import { isNotEmpty } from "@/utils/common.js";
import noMoreDataDivider from "@/components/division/index.vue";
import thumbDecoreRow from "@/components/goods/thumb/thumb-decore-row.vue";
import thumbDecoreBig from "@/components/goods/thumb/thumb-decore-big.vue";
import thumbNormalSmall from '@/components/goods/thumb/thumb-normal-small.vue';
import goodsListWaterfall from "@/components/goods/waterfallList.vue";
import thumbBillboardNew from '@/components/goods/thumb/thumb-billboard-new.vue'; // 都在买一行一个
import thumbSkeleton from '@/components/goods/thumb/thumb-skeleton.vue';
import goodsHandler from '@/components/goods/handler';
import eventsMixin from '../common/mixin/eventsMixin'
export default {
    mixins: [cartMixin, pullProdouctPriceMixin, eventsMixin],
    name: "deco-goods",
    components: {
        noMoreDataDivider,
        thumbDecoreRow,
        thumbDecoreBig,
        thumbNormalSmall,
        goodsListWaterfall,
        thumbBillboardNew,
        thumbSkeleton,
        loadingState
    },
    props: {
        // 装修数据
        decoItem: {
            type: Object,
            default: () => {}
        },
        isDecoReady: {},
        isChildren: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            // 装修组件属性
            decoProps: {}, // 组件的属性
            imgUrl: getApp().globalData.imgUrl,
            showSkeletonLoading: true,
            skeletonStyle: {
                small: 'small',
                bijia: 'bijia',
                datubijia: 'big',
                zhexianbijia: 'zhexianbijia',
                half_rank: 'small'
            },
            pageIndex:1,
            hasmore:true,
            loadingState:'first_loading',
            goodsPoolFlag:true,
            firstLoad:false,
            // 该数据结构是为了方便使用公共的listBySku相关方法
            goodsData: {
                data: {
                    ids: [],
                    info: [],
                    done: false
                }
            }
        };
    },
    activated() {
        this.goodsPoolFlag = true
        if(this.decoProps.sources === 'goodsPool'&&this.firstLoad){
            this.getGoodsPoolGoods()
        }
        
    },
    deactivated() {
        this.goodsPoolFlag =false
    },
    watch: {
        decoItem: {
            handler(val){
                if (isNotEmpty(val) && this.isDecoReady) {
                    this.initData(JSON.parse(JSON.stringify(val)))
                }
            },
            deep: true,
            immediate: true
        }         
    },
    computed: {
        ...mapGetters(["disabledModule"]),
        // 商品列表
        goodsList() {
            return this.goodsData.data.info
        },
        smallCheck(){
            return (this.decoProps.sources == 'upload' || this.decoProps.sources == 'goodsPool')&&this.decoProps.show_style == 'small'
        },
        bijiaCheck(){
            return (this.decoProps.sources == 'upload' || this.decoProps.sources == 'goodsPool')&&(this.decoProps.show_style == 'bijia' || this.decoProps.show_style == 'zhexianbijia')
        },
        datubijiaCheck(){
            return (this.decoProps.sources == 'upload' || this.decoProps.sources == 'goodsPool') && this.decoProps.show_style == 'datubijia'
        },
        // 一行两个商品拆分
        twoGoodsList() {
            return (type) => {
                let list = []
                this.goodsList.forEach((item, index) => {
                    if (index % 2 === type) {
                        list.push(item)
                    }
                })
                return list
            }
        },
        isloadDone() {
            let flag
            if(this.decoProps.sources === 'goodsPool'){
                flag = this.loadingState=='no_more_data'?true:false
            }else{
                flag = this.goodsData.data.done
            }
            return flag
        },
        loadingStates(){
            let flag
            if(this.decoProps.sources === 'goodsPool'){
                flag = this.loadingState
            }else{
                flag = 'loading'
            }
            return flag
        }
    },
    mounted(){
        this.custEvents.addListener('reachBottom', () => {
            if (this.hasmore&&this.loadingState!=='loading'&&this.decoProps.sources === 'goodsPool'&&!this.showSkeletonLoading) {
                this.getGoodsPoolGoods();
            }
        }) 
    },
    methods: {
        // 初始化装修数据
        initData(data) {
            this.decoProps = data.props

            if (this.decoProps.sources === 'upload') {
                this.goodsData.data = data.data[0]
                this.initDecoGoodsData(this.goodsData, this.decoProps.filterNosaleGoods, this.decoProps.filterNoSubstantialGoods)
            } else if (this.decoProps.sources === 'allbuy') {
                this.decoProps.show_style = 'bijia'
                this.getAllBuyGoods()
            }else if (this.decoProps.sources === 'goodsPool'){
                this.getGoodsPoolGoods()
            }
        },
        // 获取都在买数据
        getAllBuyGoods() {
            this.showSkeletonLoading = true
            this.$request({
                url: 'v3/statistics/front/buying/queryOrderList',
                data: {
                    pageSize: 20,
                    current: 1
                }
            }).then(res => {
                if (res.state === 200 && res.data) {
                    const { list } = res.data
                    this.goodsData.data.info = list
                }
                this.showSkeletonLoading = false
                this.goodsData.data.done = true
            })
        },
        // 获取商品池数据
        getGoodsPoolGoods() {
            this.flag = false
            let groupIds = []
            let goodsGroupList = this.decoItem.data[0]?.goodsGroup||[]
            if(goodsGroupList&&goodsGroupList.length>0){
                goodsGroupList.forEach(item=>{
                    groupIds.push(item.groupId)
                })
            }
            let param = {}
            param.pageSize = 20
            param.pageIndex = this.pageIndex
            param.productPoolId = this.decoItem?.data[0]?.goodsPool?.productPoolId
            param.groupIds = groupIds
            this.loadingState = this.loadingState == 'first_loading' ? this.loadingState : 'loading';
            goodsHandler.getGoodsPoolGoods(param).then(async res => {
                if (res.state === 200 && res.data) {
                    goodsHandler.handlePrice(res.data.list)
                    let list = res.data.list.map(item => {
                        return {...item, canPurchase: true, hasStock: true}
                    })
                    if(this.decoProps.filterNoSubstantialGoods){
                        list = list.filter(item => goodsHandler.isShowJdLable(item))
                    }
                    if(this.decoProps.filterNosaleGoods){
                        list = await this.filterGoodsByAddress(list);
                    }else{
                        list = await this.updateGoodsByAddress(list)
                    }
                    this.hasmore = this.$checkPaginationHasMore(res.data.pagination)
                    
                    //当上一页请求的数据为单数时，此次请求过滤后的商品数量为0个或者1个时，会导致页面看上去像没有数据了一样，测试认为是bug，作此判断
                    if(this.goodsPoolFlag&&list&&list.length<2&&this.hasmore&&this.goodsData.data.info.length>8){
                        this.getGoodsPoolGoods()
                    }
                    if((list&&list.length>0)||!this.hasmore){
                        this.showSkeletonLoading = false
                    }
                    // 如果数据没加载完，自动加载下一个数据
                    if(this.pageIndex==1){
                        this.goodsData.data.info = list
                    }else{
                        this.goodsData.data.info = this.goodsData.data.info.concat(list)
                    }
                    if (this.hasmore) {
                        this.pageIndex++;
                        this.loadingState = 'allow_loading_more';
                    } else {
                        this.loadingState = 'no_more_data';
                    }
                    if(this.goodsPoolFlag&&this.goodsData.data.info&&this.goodsData.data.info.length<8&&this.decoProps.sources === 'goodsPool'&&this.hasmore){
                        this.getGoodsPoolGoods()
                    }
                    this.firstLoad = true
                    this.goodsData.data.done = true
                }else{
                    this.showSkeletonLoading = false
                    this.goodsData.data.done = true
                }
            })
        },
        /***
       * 处理处理估计图的数量
       * 如果装修的商品数量小于10 骨架图的数量就展示装修的商品数量
       */
        dealNumber(){
            let defaultNumber = 10;
            if (this.goodsData.data.ids.length < 10 && this.decoProps.sources === 'upload') {
                defaultNumber = this.goodsData.data.ids.length
            }
            return defaultNumber;
        }
    }
};
</script>

<style lang="scss" scoped>
.tjsp_title {
    width: 100%;
    text-align: center;
    font-size: 32rpx;
    color: #333;
}

.width100 {
    width: 100%;

    .goods_item {
        margin-top: 20rpx;

        &:first-child {
            margin-top: 0;
        }
    }
}


::v-deep .skeleton-wrap {

    .wrap-item {
        margin-top: 20rpx !important;

        &:first-child {
            margin-top: 0 !important;
        }
    }

    .small-part {
        .wrap-item {
            margin-top: 0 !important;
        }
    }
}

.no_goods{
    width: 100%;
    height: 700rpx;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    padding-top: calc(800rpx * 0.32 - 128rpx);
    .no_goods_text{
        display: flex;
        flex-direction: column;
        .img {
            width: 256rpx;
            height: 256rpx;
            background: var(--emptyImg);
            background-size: 100% 100%;
        }

        text {
            color: $main-third-color;
            font-size: 28rpx;
            width: 100%;
            text-align: center;
        }
    }
}

.twoGoodsList {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    width: 100%;

    .column {
        display: flex;
        flex: 1;
        flex-direction: column;
        height: auto;
        overflow: hidden;

        &:first-child {
            padding-right: 10rpx;
        }

        &:last-child {
            padding-left: 10rpx;
        }
    }
}
</style>