<template name="recommendGoods">
<view>
    <template v-if="recommendGoods && recommendGoods.length > 0">
        <view>
            <view class="recommend-title">
                <image :src="imgUrl+'member/recommend-title.png'" />
            </view>
            <view class="recommend-goods flex_row_start_start">
                <!-- 竖向的商品瀑布流展示 -->
                <goodsListWaterfall
                    :list="recommendGoods"
                    :icon_type="1"
                    :addTime="0"
                    @onAddedCartSucc="onAddedCartSucc"
                />
            </view>
            <loadingState :state='loadingState'/>
        </view>
    </template>
</view>
</template>

<script>
import goodsListWaterfall from "@/components/goods/waterfallList.vue";
import loadingState from "@/components/loading/loading.vue";
import goodsHandler from '@/components/goods/handler';
export default {
    name: "recommendGoods",
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            recommendGoods: [],
            loadingState: 'first_loading',
            pageSize: 8,
            current: 1,
            hasMore: true//是否还有数据
        }
    },
    props: {
        arriveBotFlag: {
            type: Boolean,
            default: false
        }
    },
    components: {
        goodsListWaterfall,
        loadingState
    },
    created() {
            
    },
    mounted() {
        this.getData();//获取推荐商品数据
    },
    methods: {
        getData() {
            let param = {};

            param.queryType = 'cart';
            // param.queryDetail = 'recommend';
            param.pageSize = this.pageSize;
            param.current = this.current;
            this.loadingState = this.loadingState == 'first_loading'?this.loadingState:'loading';
            goodsHandler.getRecommendList(param).then(res => {
                if (res.state == 200) {
                    if (this.current == 1){
                        this.recommendGoods = res.data.list;
                    } else {
                        this.recommendGoods = this.recommendGoods.concat(res.data.list);
                    }
                    this.hasMore = this.$checkPaginationHasMore(res.data.pagination);//是否还有数据
                    if (this.hasMore){
                        this.current++;
                        this.loadingState = 'allow_loading_more';
                    } else {
                        this.loadingState = 'no_more_data';
                    }
                    // 子组件向父组件传值
                    uni.$emit("recommendGoods",{
                        recommendLen:this.recommendGoods.length
                    })
                } else {
                    //错误提示
                }
            })
        },
        //页面到底部加载更多数据
        getMoreData(){
            if (this.hasMore){
                this.getData();
            }
        },
        onAddedCartSucc(val){
            this.$emit('onAddedCartSucc',val)
        }
    }
}
</script>
<style lang='scss'>
    .list-scroll-content{
        height: 100vh;
    }
    .recommend-title {
        display: flex;
        justify-content: center;

        image {
            width: 387rpx;
            height: 34rpx;
            margin: 30rpx 0;
        }
    }
    .recommend-goods {
        display: flex;
        width: 100%;
        flex-wrap: wrap;
        justify-content: space-between;
        padding:0 20rpx;
        box-sizing: border-box;
    }
</style>
