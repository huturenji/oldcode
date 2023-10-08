<!-- 我的优惠券历史 -->
<template>
    <view class="my_coupon"  ref="contentDom">
        <view class="my_coupon_nav" ref="navDom">
            <!-- 一级分类 -->
            <tabs 
                class="tab1"
                :list="navList"
                :current="tabCurrentIndex1" 
                :showScrollBar="false"
                :itemStyle="{height: '90rpx'}"  
                @change="handleNav"         
            >
                <template v-slot:content="{navItem}">
                    <view class="item_container flex_row_center_center" :class="{activeTab:tabCurrentIndex1==navItem.index}">
                        <view class="name">{{ navItem.item.text }}</view>
                    </view>
                </template>
                <template slot="slideBlock">
                    <view class="slide"></view>
                </template>
            </tabs>
            <!-- 二级分类 -->
            <tabs 
                class="tab2"
                :list="navList[tabCurrentIndex1].stateList"
                :current="navList[tabCurrentIndex1].currentIndex2" 
                :showScrollBar="false"
                :itemStyle="{height: '88rpx'}"  
                @change="handleNavState"         
            >
                <template v-slot:content="{navItem}">
                    <view class="item_container1 flex_row_center_center" :class="{activeTab:navList[tabCurrentIndex1].currentIndex2==navItem.index}">
                        <text>{{ navItem.item.text }}</text>
                    </view>
                </template>
            </tabs>
        </view>
        <!-- 优惠券 -->
        <view class="my_coupon_content">
            <scroll-view class="list-scroll-content" scroll-y @scrolltolower="load" :lower-threshold="150" :scroll-top="scrollTop" @scroll="getScrollTop">
                    <view class="my_coupon_list" v-if="tabItem.couponList && tabItem.couponList.length && tabItem.loaded" :ref="`couponListDom_${tabCurrentIndex1}_${tabCurrentIndex2}`">
                        <view v-for="(item,index) in tabItem.couponList" :key="index">
                            <couponItem :couponItem="item" v-if="tabCurrentIndex1==0"></couponItem>
                            <expressCouItem :couponItem="item" v-if="tabCurrentIndex1==1"></expressCouItem>
                            <consumptionCouItem :couponItem="item" @openQrCode="openQrCode" v-if="tabCurrentIndex1==2"></consumptionCouItem>
                        </view>
                    </view>
                <loadingState  :state='tabItem.loadingState' mTop='400rpx' v-if="tabItem.loadingState=='first_loading' || tabItem.loadingState=='loading' || (tabItem.loadingState=='no_more_data' && tabItem.couponList.length>0 && tabItem.showNoMoreDataTips)" class="loadingState"/>
                <view class="no_data" v-if="tabItem.isShow && tabItem.loaded">
                    <view class="imgWrap"></view>
                    <text v-if="tabCurrentIndex1==0">{{$L('暂无优惠券，去领券中心看看吧')}}~</text>
                    <text v-else-if="tabCurrentIndex1==1">{{$L('暂无运费券')}}~</text>
                    <text v-else>{{$L('暂无消费券')}}~</text>
                    <!-- <view class="go_coupon_center" @click="goCouponCenter">{{$L('前往领券中心')}}</view> -->
                </view>                  
            </scroll-view>
        </view>
    </view>
</template>
<script>
import loadingState from "@/components/loading/loading.vue";
import tabs from "@/components/tab/custom";
import {
    mapState
} from 'vuex';
import {fitFontSize} from '@/utils/common.js'
import goodsHandler from '@/components/goods/handler';
import couponItem from '@/components/coupon/couponItem.vue';
import expressCouItem from '@/components/coupon/expressCouItem.vue';
import consumptionCouItem from '@/components/coupon/consumptionCouItem.vue';

export default {
    components: {
        loadingState,
        tabs,
        couponItem,
        expressCouItem,
        consumptionCouItem
    },
    data() {
        return {
            pageSize: 10,
            showState:false,
            requestApi:'', //请求接口：优惠券or运费券
            navList:[
                {
                    text:"优惠券",
                    currentIndex2:0, //每个一级tab管理自己的二级tab
                    stateList:[
                        {
                            text:"已使用",
                            couponList:[],
                            current: 1, //分页
                            useState:'2',
                            loadingState: 'first_loading',
                            loaded:false, //数据是否请求完
                            isShow:false,//接口请求完是否有数据，true没有，false有
                            hasMore: false, //是否还有数据
                            showNoMoreDataTips:false //判断是否显示数据加载完毕的底部tips
                        },
                        {
                            text:"已过期",
                            couponList:[],
                            current: 1, //分页
                            useState:'3',
                            loadingState: 'first_loading',
                            loaded:false, //数据是否请求完
                            isShow:false,//接口请求完是否有数据，true没有，false有
                            hasMore: false, //是否还有数据
                            showNoMoreDataTips:false //判断是否显示数据加载完毕的底部tips
                        },
                        {
                            text:"已失效",
                            couponList:[],
                            current: 1, //分页
                            useState:'5',
                            loadingState: 'first_loading',
                            loaded:false, //数据是否请求完
                            isShow:false,//接口请求完是否有数据，true没有，false有
                            hasMore: false, //是否还有数据
                            showNoMoreDataTips:false //判断是否显示数据加载完毕的底部tips
                        }
                    ]
                },
                {
                    text:"运费券",
                    currentIndex2:0, //每个一级tab管理自己的二级tab
                    stateList:[
                        {
                            text:"已使用",
                            couponList:[],
                            current: 1, //分页
                            useState:'2',
                            loadingState: 'first_loading',
                            loaded:false, //数据是否请求完
                            isShow:false,//接口请求完是否有数据，true没有，false有
                            hasMore: false, //是否还有数据
                            showNoMoreDataTips:false //判断是否显示数据加载完毕的底部tips
                        },
                        {
                            text:"已过期",
                            couponList:[],
                            current: 1, //分页
                            useState:'3',
                            loadingState: 'first_loading',
                            loaded:false, //数据是否请求完
                            isShow:false,//接口请求完是否有数据，true没有，false有
                            hasMore: false, //是否还有数据
                            showNoMoreDataTips:false //判断是否显示数据加载完毕的底部tips
                        },
                        {
                            text:"已失效",
                            couponList:[],
                            current: 1, //分页
                            useState:'4',
                            loadingState: 'first_loading',
                            loaded:false, //数据是否请求完
                            isShow:false,//接口请求完是否有数据，true没有，false有
                            hasMore: false, //是否还有数据
                            showNoMoreDataTips:false //判断是否显示数据加载完毕的底部tips
                        }
                    ]
                },
                {
                    text:"消费券",
                    currentIndex2:0, //每个一级tab管理自己的二级tab
                    stateList:[
                        {
                            text:"全部",
                            couponList:[],
                            current: 1, //分页
                            useState:['2','3'],
                            loadingState: 'first_loading',
                            loaded:false, //数据是否请求完
                            isShow:false,//接口请求完是否有数据，true没有，false有
                            hasMore: false, //是否还有数据
                            showNoMoreDataTips:false //判断是否显示数据加载完毕的底部tips
                        },
                        {
                            text:"已使用",
                            couponList:[],
                            current: 1, //分页
                            useState:['2'],
                            loadingState: 'first_loading',
                            loaded:false, //数据是否请求完
                            isShow:false,//接口请求完是否有数据，true没有，false有
                            hasMore: false, //是否还有数据
                            showNoMoreDataTips:false //判断是否显示数据加载完毕的底部tips
                        },
                        {
                            text:"已过期",
                            couponList:[],
                            current: 1, //分页
                            useState:['3'],
                            loadingState: 'first_loading',
                            loaded:false, //数据是否请求完
                            isShow:false,//接口请求完是否有数据，true没有，false有
                            hasMore: false, //是否还有数据
                            showNoMoreDataTips:false //判断是否显示数据加载完毕的底部tips
                        }
                        
                    ]
                }
            ],
            tabCurrentIndex1:0,
            tabCurrentIndex2:0,
            scrollTop:0
        };
    },
    computed: {
        ...mapState(['hasLogin', 'userInfo']),
        tabItem() {
            return this.navList[this.tabCurrentIndex1].stateList[this.tabCurrentIndex2]
        }
    },
    watch: {
        $route(to) {
            if(to.path == "/pages/coupon/myCouponHistory") {
                let fontDom = document.getElementsByClassName('fitFont');
                fitFontSize(fontDom);
            }
        }
    },
    async mounted(){
        let index = this.tabCurrentIndex1;
        let navItem = this.navList[index];
        navItem.loadingState = 'first_loading';
        this.loadData(this.tabCurrentIndex1,this.tabCurrentIndex2);
    },
    methods: {
        getScrollTop(e) {
            this.scrollTop = e.detail.scrollTop;
        },
        load(){
            this.loadData(this.tabCurrentIndex1,this.tabCurrentIndex2); 
        },
        comeBackMyCoupon(){
            let navItem = this.navList[0];
            navItem.loadingState = 'first_loading';
            navItem.couponList = [];
            navItem.current = 1;
            this.getCouponList();
        },
        //获取优惠券列表
        getCouponList(index1,index2) {
            let tabItem = this.navList[index1].stateList[index2]
            let param = {};
            this.requestApi = index1 == 0?'getMyCouponList':index1 == 1?'getFreightCoupon':'getConsumeCoupon';
            param.pageSize = this.pageSize;
            param.current = tabItem.current;
            if (index1 == 2) {
                param.useStates = tabItem.useState;
            } else {
                param.useState = tabItem.useState;
            }
            tabItem.loadingState = tabItem.loadingState == 'first_loading' ? tabItem.loadingState : 'loading';
            goodsHandler[this.requestApi](param).then(async res => {
                if (res.state == 200) {
                    let result;
                    if (this.requestApi == 'getMyCouponList' || this.requestApi == 'getConsumeCoupon') {
                        result = res.data;
                    } else if (this.requestApi == 'getFreightCoupon') {
                        result = res.data.page;
                    }
                    this.$set(tabItem,'couponList',[...tabItem.couponList,...result.list])
                    if (this.tabCurrentIndex1 == 0) {
                        tabItem.couponList.forEach(item => {
                            this.$set(item,'isOpen',false)
                        })
                    }
                    tabItem.loaded=true;
                    this.tabItem.hasMore = this.$checkPaginationHasMore(result.pagination); //是否还有数据
                    if (tabItem.hasMore) {
                        tabItem.current++;
                        tabItem.loadingState = 'loading';
                    } else {
                        tabItem.loadingState = 'no_more_data';
                    }
                    if (tabItem.couponList.length == 0){
                        tabItem.isShow=true;
                    } else {
                        tabItem.isShow=false;
                    }
                    this.$set(this.navList[index1].stateList,index2,tabItem)
                    await this.$nextTick()
                    // 计算是否需要显示'数据加载完毕'的底部tips
                    if (!tabItem.showNoMoreDataTips){ //变为true了之后就会一直显示tips，避免多次计算
                        let navDomH = this.$refs.navDom.$el.offsetHeight;
                        let contentDomH = this.$refs.contentDom.$el.offsetHeight;
                        let couponListHeight=0;
                        if (!tabItem.isShow){ //有优惠券数据才计算对应高度
                            couponListHeight = this.$refs[`couponListDom_${index1}_${index2}`].$el.offsetHeight;
                        }
                        tabItem.showNoMoreDataTips = couponListHeight > (contentDomH - navDomH)?true:false;
                    }
                    // 金额字号自适应
                    let fontDom = document.getElementsByClassName('fitFont');
                    fitFontSize(fontDom);
                        
                } else {
                    tabItem.loaded=true;
                    tabItem.loadingState = '';
                    this.$api.msg(res.msg);
                }
            }).catch(() => {
                //异常处理
            })
        },
        //点击一级分类
        handleNav({index:type}) {
            this.tabCurrentIndex1 = type;
            this.tabCurrentIndex2 = this.navList[this.tabCurrentIndex1].currentIndex2;
            this.scrollTop = 0;
            this.loadData(this.tabCurrentIndex1,this.tabCurrentIndex2,'tabChange')
            if (this.tabItem.loadingState !== 'first_loading') {
                // 金额字号自适应
                this.$nextTick(() => {
                    let fontDom = document.getElementsByClassName('fitFont');
                    fitFontSize(fontDom);
                })
            }
                
        },
        // 点击二级分类
        handleNavState({index:type}) {
            this.navList[this.tabCurrentIndex1].currentIndex2 = type;
            this.tabCurrentIndex2 = this.navList[this.tabCurrentIndex1].currentIndex2;
            this.scrollTop = 0;
            this.loadData(this.tabCurrentIndex1,this.tabCurrentIndex2,'tabChange')
            if (this.tabItem.loadingState !== 'first_loading') {
                // 金额字号自适应
                this.$nextTick(() => {
                    let fontDom = document.getElementsByClassName('fitFont');
                    fitFontSize(fontDom);
                })
            }
                
        },
        //获取优惠券列表
        loadData(index1,index2,source) {
            //将列表挂载到tab列表下,起到缓存的效果，避免多次请求
            if (source === 'tabChange' && this.tabItem.loadingState !== 'first_loading') {
                //tab切换只有第一次需要加载数据
                return;
            }
            if (this.tabItem.loadingState != 'no_more_data') {
                this.getCouponList(index1,index2)
            }

        }
    }

}
</script>

<style lang="scss">
    page {
        background: $bg-color-split;
        height: 100%;
    }
    .swiper-box {
        flex: 1;
        height: 0;
    }
    .my_coupon_content{
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 178rpx 0 0 0;
    }
    .list-scroll-content{
        height: 100%;
        overflow-y: auto;
    }
    .my_coupon {
        width: 750rpx;
        height: 100%;
        margin: 0 auto;

        .my_coupon_nav {
            background: #FFFFFF;
            position: fixed;
            top: var(--bar-height);
            z-index: 100;
            width: 750rpx;
            box-sizing: border-box;
            .tab1 {
               padding-bottom: 0 !important; 
            }
            .tab2 {
                padding:0 18rpx;
                padding-bottom: 0 !important;
                ::v-deep .tabs__wrapper__nav {
                    &>view:first-of-type {
                        justify-content: flex-start;
                    }
                    &>view:nth-last-of-type(2) {
                        justify-content: flex-end;
                    }
                }
            }
            
            ::v-deep .slide {
                width: 48rpx;
                height: 8rpx;
                margin-top: -20rpx;
                background: #f30300;
                border-radius: 4rpx;
            }
            .item_container {
                margin-top: -8rpx;
                padding: 0 18rpx;
                font-size: 30rpx;
                color: #222222;
                .name {
                    padding-right: 8rpx;
                }
                &.activeTab {
                    font-size: 32rpx;
                    font-weight: bold;
                    color: #f30300;
                    .number {
                        font-size: 34rpx;
                    }
                }
            }
            .item_container1 {
                width: 140rpx;
                height: 56rpx;
                font-size: 26rpx;
                background: #eff2f5;
                border-radius: 28rpx;
                color: #666666;
                &.activeTab {
                    background: #ffeaea;
                    border: 1px solid #f30300;
                    border-radius: 34rpx;
                    color: #f30300;
                }
                
            }

            .my_coupon_nav_pre {
                font-size: 32rpx;
                
                font-weight: 500;
                color: #333333;
                line-height: 39rpx;
                padding: 26rpx 0;
            }
        }
        .my_coupon_center {
            background: #FFFFFF;

            image {
                width: 717rpx;
                height: 245rpx;
            }
        }

        .my_coupon_list {
            display: flex;
            flex-direction: column;
            padding: 0 15px;
        }

        .no_data {
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-top: calc((100vh - 90rpx - var(--titleBarFillHeight, 0px)) * 0.32 - 128rpx);
            .imgWrap {
                width: 256rpx;
                height: 256rpx;
                // background: var(--conponEmptyImg);
                background: url('@/static/shared/empty/icon_defpage_zwyhq.png') center no-repeat;
                background-size: 100%;
            }

            text {
                font-size: 28rpx;
                font-family: Source Han Sans CN;
                font-weight: 400;
                color: $main-third-color;
                margin: 0rpx 0 48rpx;
            }

            .go_coupon_center {
                width: 228rpx;
                height: 64rpx;
                // background: var(--confirmBtnBgColor2);
                background: #f30300;
                border-radius: 32rpx;
                font-size: 28rpx;
                
                font-weight: 600;
                // color: var(--buyNowColor);
                color: #fff;
                text-align: center;
                line-height: 64rpx;
            }
        }
    }
    .loadingState{
        padding-bottom: calc(20rpx + var(--safe-area-inset-bottom));
    }
</style>