<template>
    <!--推荐商品-->
    <view :style="[styles]">
        <!-- 商品骨架图部分 -->
        <view v-if="showSkeletonLoading">
            <thumbSkeleton
                :showType="skeletonType[decoProps.show_style]"
                :quantity="dealNumber()"
            />
        </view>

        <template v-else-if="!showSkeletonLoading && goodsListNum() > 0">
            <view class="recommend_goods_wrap">
                <view class="tjsp_title">{{ decoItem.props.title }}</view>
                <view class="rec_goods_wrap">

                    <!-- 对应装修的商品展示模式为：一行一个 -->
                    <template v-if="decoProps.show_style=='bijia'">
                        <thumbDecorateH v-for="item in renderGoodsList()" :key="item.sku" :goods="item" borderRadius="16" :showThumbTips="true" />
                    </template>

                    <!-- 对应装修的商品展示模式为：大图 -->
                    <template v-if="decoProps.show_style=='datubijia'">
                        <thumbDecorateBigH class="goods_item" v-for="item in renderGoodsList()" :key="item.sku" :goodsItem="item" borderRadius="16" :showThumbTips="true" />
                    </template>

                    <!-- 对应装修的商品展示模式为：一行两个和一行两个2 -->
                    <template v-if="decoProps.show_style === 'half_rank' || decoProps.show_style=='small'">
                        <view class="twoGoodsList">
                            <view class="column">
                                <thumbDecorateV class="goods_item" v-for="item in twoGoodsList(0)" borderRadius="16" :key="item.sku" :goodsItem="item" :showThumbTips="true" />
                            </view>
                            <view class="column">
                                <thumbDecorateV class="goods_item" v-for="item in twoGoodsList(1)" borderRadius="16" :key="item.sku" :goodsItem="item" :showThumbTips="true" />
                            </view>
                        </view>
                    </template>
                    <loadingState :state='loadingStates()' v-if="showLoading()" />
                    <view class="no_more" v-if="showMoreDataDivider()">
                        <noMoreDataDivider />
                    </view>
                </view>
            </view>
        </template>

        <block v-else>
            <view class="no_goods">
                <view class="no_goods_text">
                    <view class="img"></view>
                    <text>暂无数据</text>
                </view>
            </view>
        </block>
    </view>
</template>

<script>
import loadingState from "@/common/components/loading/loading.vue";
import mixin from "@/common/components/decorate/common/mixin/index";
import pullProdouctPriceMixin from '@/common/mixin/pullProdouctPriceMixin'
import noMoreDataDivider from "@/common/components/division/index.vue";
import thumbSkeleton from '@/common/components/thumb/thumb-skeleton.vue';
import thumbDecorateH from '@/common/components/thumb/thumb-decorate-h.vue';
import thumbDecorateV from '@/common/components/thumb/thumb-decorate-v.vue';
import thumbDecorateBigH from "@/common/components/thumb/thumb-decorate-big-h.vue";
import goodsHandler from "@/views/components/goods/handler.js";
import { checkPaginationHasMore } from '@/utils/common';

export default {
    mixins: [pullProdouctPriceMixin, mixin],
    name: "deco-goods",
    components: {
        noMoreDataDivider,
        thumbSkeleton,
        thumbDecorateH,
        thumbDecorateV,
        thumbDecorateBigH,
        loadingState
    },
    props: {
        // 装修数据
        decoItem: {
            type: Object,
            default: () => {}
        },
        isReachBottom:{
            type:Boolean,
            default:false
        }
    },
    data() {
        return {
            decoProps: {},
            skeletonType: {
                small: 'small',
                bijia: 'bijia',
                datubijia: 'datubijia',
                zhexianbijia: 'zhexianbijia',
                half_rank: 'small'
            },
            pageIndex:1,
            hasmore:true,
            loadingState:'first_loading',
            goodsPoolFlag:true,
            showSkeletonLoading: true,
            firstLoad:false
        };
    },
    computed: {
        // 一行两个商品拆分
        twoGoodsList() {
            return (type) => {
                let list = []
                this.renderGoodsList().forEach((item, index) => {
                    if (index % 2 == type) {
                        list.push(item)
                    }
                })
                return list
            }
        }
    },
    mounted() {
        this.decoProps = this.decoItem.props
        this.initData()
        this.initBackgroud(this.decoItem)
        this.initSpace(this.decoItem)
        uni.$off('decoReachBottom')
        uni.$on('decoReachBottom',this.decoReachBottom)
    },
    activated() {
        this.goodsPoolFlag = true
        if(this.decoProps.sources === 'goodsPool'&&this.firstLoad){
            this.getGoodsPoolGoods()
        }
    },
    deactivated() {
        this.goodsPoolFlag = false
    },
    watch:{
            
    },
    methods: {
        // 初始化装修数据
        initData() {
            if (this.decoProps.sources === 'upload') {
                this.initDecoGoodsData(this.decoItem, this.decoProps.filterNosaleGoods, this.decoProps.filterNoSubstantialGoods)
            }else if (this.decoProps.sources === 'goodsPool'){
                this.getGoodsPoolGoods()
            }
        },
        renderGoodsList(){
            return this.decoItem.data[0].info
        },
        loadingStates(){
            let flag
            if(this.decoProps.sources === 'goodsPool'){
                flag = this.loadingState
            }else{
                flag = 'loading'
            }
            return flag
        },
        decoReachBottom(){
            if (this.hasmore&&this.loadingState!=='loading'&&this.decoItem.props.sources === 'goodsPool'&&!this.showSkeletonLoading) {
                this.getGoodsPoolGoods();
            }
        },
        // 获取商品池数据
        getGoodsPoolGoods() {
            let param = {}
            let groupIds = []
            let goodsGroupList = this.decoItem.data[0]?.goodsGroup||[]
            if(goodsGroupList&&goodsGroupList.length>0){
                goodsGroupList.forEach(item=>{
                    groupIds.push(item.groupId)
                })
            }
            param.pageSize = 20 
            param.pageIndex = this.pageIndex
            param.productPoolId = this.decoItem?.data[0]?.goodsPool?.productPoolId
            param.groupIds = groupIds
            this.loadingState = this.loadingState == 'first_loading' ? this.loadingState : 'loading';
            goodsHandler.getGoodsPoolGoods(param).then(async res => {
                if (res.state === 200 && res.data) {
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
                    this.hasmore = checkPaginationHasMore(res.data.pagination)
                    //当上一页请求的数据为单数时，此次请求过滤后的商品数量为0个或者1个时，会导致页面看上去像没有数据了一样，测试认为是bug，作此判断
                    if(this.goodsPoolFlag&&list&&list.length<2&&this.hasmore&&this.decoItem.data[0].info&&this.decoItem.data[0].info.length>8){
                        this.getGoodsPoolGoods()
                    }
                    if((list&&list.length>0)||!this.hasmore){
                        this.showSkeletonLoading = false
                    }
                    // 如果数据没加载完，自动加载下一个数据
                    if(this.pageIndex==1){
                        this.decoItem.data[0].info = list
                    }else{
                        this.decoItem.data[0].info = this.decoItem.data[0].info.concat(list)
                    }
                    if (this.hasmore) {
                        this.pageIndex++;
                        this.loadingState = 'allow_loading_more';
                    } else {
                        this.loadingState = 'no_more_data';
                    }
                    if(this.decoItem.data[0].info&&this.decoItem.data[0].info.length<8&&this.decoProps.sources === 'goodsPool'&&this.hasmore){
                        this.getGoodsPoolGoods()
                    }
                    this.decoItem.data[0].done = true
                    this.firstLoad = true
                }else{
                    this.showSkeletonLoading = false
                    this.decoItem.data[0].done = true
                    this.firstLoad = true
                }
            })
        },
        // 商品的是否参加了活动
        attendPromotion(goods) {
            //天天专场，没有预热。必须满足两个条件 attendPromotion promotionStarted都为true
            if (goods.promotionType == 107) {
                return !!goods.attendPromotion && !!goods.promotionStarted;
            } else {
                return !!goods.attendPromotion;
            }
        },
        /***
         * 处理处理估计图的数量
         * 如果装修的商品数量小于10 骨架图的数量就展示装修的商品数量
         */
        dealNumber(){
            let defaultNumber = 10;
            if (this.decoProps.sources === 'upload'&&this.decoItem.data[0].ids.length < 10){
                defaultNumber = this.decoItem.data[0].ids.length;
            }
            return defaultNumber;
        },
        // 是否显示展示更多了 
        showMoreDataDivider(){
            let flag
            if(this.decoProps.sources === 'goodsPool'){
                flag = this.decoItem.props.isShowMore &&this.loadingState=='no_more_data'?true:false
            }else{
                flag = this.decoItem.props.isShowMore && this.decoItem.data[0].info && this.decoItem.data[0].info.length > 0 && !!this.decoItem.data[0].done;
            }
            return flag
        },
        // 是否显示正在加载中 
        showLoading(){
            let flag 
            if(this.decoProps.sources === 'goodsPool'){
                flag = this.loadingState=='no_more_data'?false:true&&!!this.decoItem.data[0].done
            }else{
                flag = this.decoItem.data[0].info && this.decoItem.data[0].info.length > 0 && !this.decoItem.data[0].done;
            }
            return flag;
        },
        goodsListNum(){
            return this.renderGoodsList().length;
        }
    }
};
</script>

<style lang="scss" scoped>
.recommend_goods_wrap {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 0;
    .tjsp_title {
        width: 100%;
        text-align: center;
        font-size: 32rpx;
        color: #222;
    }
    .rec_goods_wrap {
        width: 750rpx;
        border-radius: 20rpx;

        .no_more{
            width: 100%;
        }
    }
}
.no_goods {
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
            background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/empty/icon_defpage_zwnr.png') center no-repeat;
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
    }
}
</style>