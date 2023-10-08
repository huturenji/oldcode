<!-- 余额明细页面 -->
<template>
    <view class="content">
        <view class="navbar">
            <view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{current: tabCurrentIndex === index}"
             @click="tabClick(index)">
                {{item.text}}
            </view>
        </view>

        <swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
            <swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
                <scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadData">

                    <view v-if="tabItem.loadingState != 'first_loading'&&tabItem.rechargeList.length == 0" class="empty_part flex_column_start_center">
                        <view class="img"></view>
                        <text>{{$L('还没有数据哦')}}～</text>

                    </view>
                    <!-- 余额列表 -->
                    <template v-if="tabItem.rechargeList.length > 0">
                        <view v-for="(item,index) in tabItem.rechargeList" :key="index" class="log-item flex_row_between_center b_b"
                         @click="viewDetail(item.rechargeId)">
                            <view class="left flex_column_start_start">
                                <text class="type">{{item.payStateValue}}</text>

                                <text class="time">{{item.createTime}}</text>
                            </view>
                            <view class="right flex_row_end_center">
                                <text :class="{amount:true,add:item.type==2,flag:true}">+</text>
                                <text :class="{amount:true,add:item.type==2}">{{item.payAmount}}</text>
                                <text class="iconfont icon_arrow_right"></text>
                            </view>

                        </view>
                    </template>
                    <loadingState v-if="tabItem.loadingState == 'first_loading'||tabItem.rechargeList.length > 0" :state='tabItem.loadingState' />
                </scroll-view>
            </swiper-item>
        </swiper>
    </view>
</template>

<script>
import loadingState from "@/components/loading/loading.vue";
import {
    mapState
} from 'vuex';
export default {
    components: {
        loadingState
    },
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            tabCurrentIndex: 0,
            navList: [{
                state: 0,
                text: this.$L('全部'),
                loadingState: 'first_loading',
                rechargeList: [],
                current: 1 //分页
            },
            {
                state: 1,
                text: '充值成功',
                loadingState: 'first_loading',
                rechargeList: [],
                current: 1 //分页
            },
            {
                state: 2,
                text: '待充值',
                loadingState: 'first_loading',
                rechargeList: [],
                current: 1 //分页
            }
            ],
            stopPullDownRefresh: false //是否下拉刷新中
        };
    },
    mounted(){
        /**
             * 修复app端点击除全部订单外的按钮进入时不加载数据的问题
             * 替换onLoad下代码即可
             */
        // #ifndef MP
        this.loadData()
        // #endif
        // #ifdef MP
        this.loadData()
        // #endif
    },
    onLoad() {
        // /**
        //  * 修复app端点击除全部订单外的按钮进入时不加载数据的问题
        //  * 替换onLoad下代码即可
        //  */
        // // #ifndef MP
        // this.loadData()
        // // #endif
        // // #ifdef MP
        // this.loadData()
        // // #endif

    },
    computed: {
        ...mapState(['userInfo'])
    },
    //下拉刷新
    onPullDownRefresh() {
        let index = this.tabCurrentIndex;
        let navItem = this.navList[index];
        navItem.loadingState = 'first_loading';
        navItem.rechargeList = [];
        navItem.current = 1;
        this.stopPullDownRefresh = true; //下拉刷新状态
        this.loadData();
    },
    methods: {
        //获取订单列表
        loadData(source) {
            //将订单挂载到tab列表下,起到缓存的效果，避免多次请求
            let index = this.tabCurrentIndex;
            let navItem = this.navList.filter(item => item.state == index)[0];
            // let state = navItem.state;

            if (source === 'tabChange' && navItem.loadingState !== 'first_loading') {
                //tab切换只有第一次需要加载数据
                return;
            }
            if (navItem.loadingState === 'loading') {
                //防止重复加载
                return;
            }

            if (navItem.loadingState == 'no_more_data') {
                //已经没有数据，无需再请求
                return;
            }

            let param = {};
            param.url = 'v3/member/front/balanceRecharge/list';
            param.data = {};
            param.data.pageSize = 10;
            param.data.current = navItem.current;
            navItem.loadingState = navItem.loadingState == 'first_loading' ? navItem.loadingState : 'loading';
            if (navItem.state == 1) {
                param.data.payState = 2;
            } else if (navItem.state == 2) {
                param.data.payState = 1;
            }
            this.$request(param).then(res => {
                if (res.state == 200) {
                    navItem.rechargeList = navItem.rechargeList.concat(res.data.list);
                    let hasMore = this.$checkPaginationHasMore(res.data.pagination); //是否还有数据
                    if (hasMore) {
                        navItem.current++;
                        navItem.loadingState = 'allow_loading_more';
                    } else {
                        navItem.loadingState = 'no_more_data';
                    }
                } else {
                    this.$api.msg(res.msg);
                }
                if (this.stopPullDownRefresh) {
                    this.stopPullDownRefresh = false;
                    uni.stopPullDownRefresh();
                }
            }).catch(() => {
                //异常处理
            })
        },

        //swiper 切换
        changeTab(e) {
            this.tabCurrentIndex = e.target.current;
            this.loadData('tabChange');
        },
        //顶部tab点击
        tabClick(index) {
            this.tabCurrentIndex = index;
        },
        //马上去逛逛事件
        goGoodsList() {
            this.$Router.push({path:'/standard/product/list',query:{showStoreTabs: false}})
        },
        //查看详情
        viewDetail(id) {
            this.$Router.push({path:'/pages/recharge/detail',query:{rechargeId:id}})
        }
    }
}
</script>

<style lang="scss">
    page,
    .content {
        background: $bg-color-split;
        height: 100%;
        width: 750rpx;
        margin: 0 auto;
    }

    .swiper-box {
        height: calc(100% - 40px);
    }

    .list-scroll-content {
        height: 100%;
    }

    .navbar {
        display: flex;
        height: 80rpx;
        padding: 0 5px;
        background: #fff;
        position: relative;
        z-index: 10;

        .nav-item {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            font-size: 28rpx;
            color: $main-font-color;
            position: relative;

            &.current {
                color: $main-color;
                font-size: 32rpx;

                &:after {
                    content: '';
                    position: absolute;
                    left: 50%;
                    bottom: 0;
                    transform: translateX(-50%);
                    width: 35rpx;
                    height: 8rpx;
                    background-color: $main-color;
                    border-radius: 4rpx;
                }
            }
        }
    }

    .uni-swiper-item {
        height: auto;
    }

    .log-item {
        padding: 30rpx;
        background: #fff;
        position: relative;

        &:first-child {
            margin-top: 20rpx;
        }

        &.b_b:after {
            left: 30rpx;
            right: 30rpx;
        }

        .left {
            margin-right: 40rpx;

            .type {
                color: $main-font-color;
                font-size: 30rpx;
                font-weight: bold;
            }

            .desc {
                color: $main-second-color;
                font-size: 26rpx;
                margin: 10rpx 0;
            }

            .time {
                color: $main-third-color;
                font-size: 22rpx;
                margin-top: 10rpx;
            }
        }

        .right {
            .amount {
                color: #949494;
                font-size: 32rpx;

                &.add {
                    color: $main-color;
                }

                &.flag {
                    margin-top: -7rpx;
                    margin-right: 2rpx;
                }
            }

            .iconfont {
                color: #949494;
                font-size: 20rpx;
                margin-left: 19rpx;
            }
        }
    }


    .empty_part {
        margin-top: 108rpx;

        .img {
            width: 256rpx;
            height: 256rpx;
            background: var(--emptyImg);
            background-size: 100% 100%;
        }

        text {
            color: $main-third-color;
            font-size: 28rpx;
        }

        button {
            width: 245rpx;
            height: 66rpx;
            background: rgba(252, 28, 28, .05);
            border-radius: 33rpx;
            color: $main-color;
            font-size: 30rpx;
            font-weight: bold;
            margin-top: 29rpx;
        }

        uni-button:after {
            border-radius: 200rpx;
            border-color: #fff;
        }
    }
</style>
