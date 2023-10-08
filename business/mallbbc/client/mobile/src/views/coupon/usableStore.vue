<!-- 消费券可用门店列表 -->
<template>
    <view class="store_list_box" ref="contentDom">
        <scroll-view class="store_list_content" @scrolltolower='getMoreData' scroll-y>
            <view class="store_list" v-if="loaded && storeList && storeList.length>0" ref="storeListDom">
                <view class="store_item flex_row_start_start" v-for="(item,index) in storeList" :key="index">
                    <view class="store_logo">
                        <img v-if="item.logo" :src="item.logo"/>
                        <img v-else :src="imgUrl+'common/icon/icon_yhq_dianpu_nor.png'"/>
                    </view>
                    <view class="store_info_detail">
                        <view class="store_name">{{item.shopName}}</view>
                        <view class="store_address">{{item.areaInfo+item.address}}</view>
                        <view class="store_phone" v-if="isPC">{{item.servicePhone.join(', ')}}</view>
                        <view class="store_phone" v-else>
                            <a v-for="(temp, index1) in item.servicePhone" :key="index1" :href="'tel:'+ temp ">{{index1==(item.servicePhone.length-1) ? temp : (temp+',')}}</a>
                        </view>
                    </view>
                </view>
            </view>
            <loadingState :state='loadingState' mTop='400rpx' class="loadingState" :class="{loading:loadingState=='loading'}"
            v-if="loadingState=='first_loading' || loadingState=='loading' || (loadingState=='no_more_data' && storeList && storeList.length>0 && showNoMoreDataTips)"/>
            <view v-if="loaded && (!storeList || storeList.length==0)" class="no_data">
                <view class="imgWrap"></view>
                <text>{{$L('暂无门店信息')}}~</text>
            </view>  
        </scroll-view>
    </view>
</template>
<script>
import goodsHandler from '@/components/goods/handler';
export default {
    components: {
        
    },
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            storeList:[],
            isPC:SnUtils.isPC(),
            pageSize:10,
            current:1,
            loaded:false, //是否加载完成
            hasMore: false, //是否还有数据
            loadingState:'first_loading',
            showNoMoreDataTips:false
            
        };
    },
    computed: {
        
    },
    watch: {
        
    },
    mounted(){
        this.getStoreList()
    },
    methods: {
        //页面触底事件
        getMoreData() {
            uni.$emit('uOnReachBottom')      
            if (this.hasMore) {
                this.getStoreList();
            }
        },
        getStoreList() {
            let param = {
                storeId:this.$Route.query?.storeId,
                pageSize:this.pageSize,
                current:this.current
            }
            if (this.$Route.query?.useShopType==0) {
                param.ids = this.$Route.query?.shopIds
            }
            this.loadingState = this.loadingState == 'first_loading' ? this.loadingState : 'loading';
            goodsHandler.getConsumeStoreList(param).then(async res => {
                if (res.state == 200) {
                    this.storeList = this.storeList.concat(res?.data?.list);
                    this.loaded = true
                    if (this.loadingState == 'first_loading') {
                        this.loadingState = ''
                    }
                    this.hasMore = this.$checkPaginationHasMore(res.data.pagination); //是否还有数据
                    if (this.hasMore) {
                        this.current++
                        this.loadingState = 'loading';
                    } else {
                        this.loadingState = 'no_more_data';
                    }
                    await this.$nextTick()
                    // 计算是否需要显示'数据加载完毕'的底部tips
                    if (!this.showNoMoreDataTips){ //变为true了之后就会一直显示tips，避免多次计算
                        let contentDomH = this.$refs.contentDom.$el.offsetHeight;
                        let storeListHeight=0
                        if (this.storeList && this.storeList.length>0){ //有优惠券数据才计算对应高度
                            storeListHeight = this.$refs.storeListDom.$el.offsetHeight;
                        }
                        this.showNoMoreDataTips = storeListHeight > contentDomH?true:false;
                    }
                    
                } else {
                    this.loadingState = ''
                    this.loaded = true
                    this.$api.msg(res.msg);
                }
            }).catch(() => { 
            })
        }
    }

}
</script>

<style lang="scss">
.store_list_box {
    height: 100%;
    .store_list_content {
        height: 100%;
        .loadingState{
            padding-bottom: calc(40rpx + var(--safe-area-inset-bottom));
        }
    }
    .store_list {
        padding: 0 32rpx;
        overflow-y: scroll;
        >view:last-child {
            margin-bottom: 24rpx;
        }
    }
    .store_item {
        width: 100%;
        margin-top: 24rpx;
        padding: 28rpx 32rpx 28rpx 26rpx;
        background: #ffffff;
        border-radius: 20rpx;
        .store_logo {
            width: 128rpx;
            height: 128rpx;
        }
        .store_info_detail {
            width: calc(100% - 128rpx);
            padding-left: 24rpx;
            .store_name {
                min-height: 36rpx;
                line-height: 36rpx;
                font-size: 28rpx;
                font-weight: bold;
                color: #222222;
                word-break: break-all;
            }
            .store_address {
                margin-top: 16rpx;
                padding-left: 30rpx;
                min-height: 36rpx;
                line-height: 34rpx;
                font-size: 24rpx;
                color: #666666;
                word-break: break-all;
                background: url('@/static/shared/common/icon/weizhi.svg') left 6rpx/24rpx 24rpx no-repeat;
            }
            .store_phone {
                margin-top: 8rpx;
                padding-left: 30rpx;
                font-size: 24rpx;
                line-height: 34rpx;
                word-break: break-all;
                color: #FF711E;
                background: url('@/static/shared/common/icon/btn_common_phone.svg') left 6rpx/24rpx 24rpx no-repeat;
                a {
                    text-decoration:none;
                    color: #FF711E;
                }
            }
        }
    }
    .no_data {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: calc((100vh - var(--titleBarFillHeight, 0px)) * 0.32 - 128rpx);
        .imgWrap {
            width: 256rpx;
            height: 256rpx;
            background: url('@/static/shared/empty/icon_defpage_zwnr.png') center no-repeat;
            background-size: 100%;
        }

        text {
            font-size: 28rpx;
            font-family: Source Han Sans CN;
            font-weight: 400;
            color: $main-third-color;
            margin: 0rpx 0 48rpx;
        }
    }
}
</style>