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
                    <view v-if="tabItem.loadingState != 'first_loading'&&tabItem.orderList.length == 0" class="empty_part flex_column_start_center">
                        <view class="img"></view>
                        <text>{{$L('这里空空如也~快去商品中心加购商品吧')}}！</text>
                        <button class="flex_row_center_center_goshopping" @click="goGoodsList" plain="true">{{$L('马上去逛逛')}}</button>
                    </view>
                    <!-- 订单列表 -->
                    <template v-if="tabItem.orderList.length > 0">
                    <block v-for="(item,index) in tabItem.orderList" :key="index">
                        <view class="store_item">
                            <view class="store_name">
                                <image class="store_logo" :src="imgUrl+'goods/store_logo.png'"></image>
                                <text class="store_name_text">{{item.storeName}}</text>
                                <!-- <text class="iconfont icon_arrow_right"></text> -->
                                <text class="state_value">{{item.stateValue}}</text>
                            </view>
                            <view  class="order-item" @click="goods_detail(item)">
                                <view class="after_sale_img_wrap">
                                    <view class="after_sale_img" :style="{backgroundImage: 'url('+item.mainImage+')'}"></view>
                                </view>

                                <view class="after_sale_detail">
                                    <view class="after_sale_goods_name_wrap">
                                        <view class="after_sale_goods_name_left">{{item.skuName}}</view>
                                        <view class="after_sale_goods_name_right">{{item.returnMoneyStateValue}}</view>
                                    </view>
                                    <view class="after_sale_spec">
                                        <view class="after_sale_spec_left">{{item.specValues ? item.specValues : ''}}</view>
                                        <view class="after_sale_spec_right">共{{item.afsNum}}{{$L('件')}}</view>
                                    </view>
                                    <view class="after_sale_btn_wrap">
                                        <view class="after_sale_btn" @click.stop="goDetail(item.afsSn,item.afsType)">{{$L('查看详情')}}</view>
                                    </view>
                                </view>
                            </view>
                        </view>

                    </block>
                    </template>
                    <loadingState class="loadingState" v-if="tabItem.loadingState == 'first_loading'||tabItem.orderList.length > 0" :state='tabItem.loadingState' />
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
            flag:0,
            imgUrl: getApp().globalData.imgUrl,
            tabCurrentIndex: 0,
            navList: [{
                state: 0,
                text: '退货',
                loadingState: 'first_loading',
                orderList: [],
                current: 1 //分页
            },
            {
                state: 1,
                text: '换货',
                loadingState: 'first_loading',
                orderList: [],
                current: 1 //分页
            },
            {
                state: 2,
                text: '维修',
                loadingState: 'first_loading',
                orderList: [],
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
        this.tabCurrentIndex = +this.$Route.query.state;
        // #ifndef MP
        this.loadData()
        this.flag=0
        // #endif
        // #ifdef MP
        // if (this.$Route.query.state == 0) {
        //     this.loadData()
        // }
        // #endif
    },
    onLoad() {
        // /**
        //  * 修复app端点击除全部订单外的按钮进入时不加载数据的问题
        //  * 替换onLoad下代码即可
        //  */
        // this.tabCurrentIndex = +this.$Route.query.state;
        // // #ifndef MP
        // this.loadData()
        // // #endif
        // // #ifdef MP
        // if (this.$Route.query.state == 0) {
        // this.loadData()
        // }
        // // #endif

    },
    onShow(){
        if (this.$Route.query.state==0&&this.flag==1){
            this.updataList()
        }
    },
    computed: {
        ...mapState(['userInfo'])
    },
    //下拉刷新
    onPullDownRefresh() {
        let index = this.tabCurrentIndex;
        let navItem = this.navList[index];
        navItem.loadingState = 'first_loading';
        navItem.orderList = [];
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
            //状态处理
            let afsType = ''
            if (navItem.state == 0) {
                afsType = 1; //退货
            } else if (navItem.state == 1) {
                afsType = 2; //换货
            } else if (navItem.state == 2){
                afsType = 4; //维修
            }
            param.url = 'v3/postsale/front/after/sale/list/v1'
            param.method = 'GET';
            param.data = {
                afsType,
                current:navItem.current,
                pageSize:10
            }
            navItem.loadingState = navItem.loadingState == 'first_loading' ? navItem.loadingState : 'loading';

            this.$request(param).then(res => {
                if (res.state == 200) {
                    navItem.orderList = navItem.orderList.concat(res.data.list);
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
        // 更新数据
        updataList() {
            let index = this.tabCurrentIndex;
            let navItem = this.navList[index];
            navItem.loadingState = 'first_loading';
            navItem.orderList = [];
            navItem.current = 1;
            this.stopPullDownRefresh = true; //下拉刷新状态
            this.loadData();
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
            this.flag=1;
            this.$Router.push({path:'/standard/product/list',query:{showStoreTabs: false}})
        },
        //跳转售后详情页
        goDetail(afsSn,afsType) {
            this.flag=1;
            this.$Router.push({path:'/views/order/aftersale/detail',query:{afsSn,afsType}})
        },
    
        //进入商品详情页
        goods_detail(item) {
            this.flag=1;
            this.$Router.push({path:'/standard/product/detail',query:{sku:item.sku}})
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
        .flex_row_center_center_goshopping{
            display: flex;
            justify-content: center;
            align-items: center;
            width: initial;
            min-width: 240rpx; 
        }
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
            font-size: 32rpx;
            color: $main-font-color;
            position: relative;

            &.current {
                color: var(--tagColor);
                font-size: 32rpx;

                &:after {
                    content: '';
                    position: absolute;
                    left: 50%;
                    bottom: 0;
                    transform: translateX(-50%);
                    width: 35rpx;
                    height: 8rpx;
                    background-color: var(--tagColor);
                    border-radius: 4rpx;
                }
            }
        }
    }

    .uni-swiper-item {
        height: auto;
    }
.store_name {
        padding: 30rpx 20rpx;
        margin-top: 20rpx;
        display: flex;
        align-items: center;
        border-bottom: 1rpx solid rgba(0, 0, 0, .1);
         background: #fff;
         position: relative;
        image {
            width: 34rpx;
            height: 32rpx;
        }

        .store_name_text {
            font-size: 32rpx;
            color: #2d2d2d;
            font-weight: bold;
            margin-left: 10rpx;
            max-width: 400rpx;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        .iconfont {
            // width: 13rpx;
            // height: 22rpx;
            font-size: 24rpx;
            margin-left: 10rpx;
        }
        .state_value{
            color: var(--tagColor);
            font-size: 24rpx;
            position: absolute;
            right: 20rpx;
        }
    }
    .order-item {
        min-height:241rpx;
        padding: 0 20rpx;
        box-sizing: border-box;
        background: #fff;
        display:flex;
        align-items: center;
        .after_sale_img_wrap{
            width:200rpx;
            height:200rpx;
            margin-right:25rpx;
            border-radius: 14px;
            .after_sale_img{
                width:200rpx;
                height:200rpx;
                background-size: 100% 100%;
                border-radius: 14px;

            }
        }
        .after_sale_detail{
            width:100%;
            height:100%;
            padding:20rpx 0;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            position:relative;
            .after_sale_goods_name_wrap{
                width:100%;
                display: flex;
                justify-content: space-between;
                .after_sale_goods_name_left{
                    width:365rpx;
                    font-size:28rpx;
                    color:#333;
                    text-overflow: -o-ellipsis-lastline;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    line-clamp: 2;
                    -webkit-box-orient: vertical;
                    text-align: justify;
                }
                .after_sale_goods_name_right{
                    font-size:24rpx;
                    color:#333333;
                }
            }
            .after_sale_spec{
                display:flex;
                
                justify-content: space-between;
                font-size:24rpx;
                margin-top:22rpx;
                .after_sale_spec_left{
                    color:#999999;
                    width:340rpx;
                    text-align: justify;
                }
                .after_sale_spec_right{
                    color:#939393;
                }
            }
            .after_sale_btn_wrap{
                width:100%;
                display:flex;
                justify-content: flex-end;
                margin-top: 20rpx;
                .after_sale_btn{
                    min-width: 150rpx;
                    height: 54rpx;
                    border: 1rpx solid var(--radioCheckedColor);
                    border-radius: 26rpx;
                    font-size: 26rpx;
                    
                    font-weight: 400;
                    color: var(--radioCheckedColor);
                    line-height: 54rpx;
                    text-align: center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    white-space: nowrap;
                    padding: 1rpx 14rpx;
                }
            }
        }
        .goods-box {
            padding: 20rpx 0;
            width: 100%;
            .left {
                .goods-img {
                    background-size: contain;
                    background-position: center center;
                    background-repeat: no-repeat;
                    width: 200rpx;
                    height: 200rpx;
                    overflow: hidden;
                    background-color: #F8F6F7;
                    border-radius: 14rpx;
                    flex-shrink: 0;
                }

                .goods_info {
                    margin-left: 25rpx;
                    padding-top: 10rpx;

                    .goods_name {
                        color: #2D2D2D;
                        font-size: 26rpx;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        word-break: break-all;
                        line-height: 38rpx;
                    }

                    .spec_info {
                        color: #949494;
                        font-size: 24rpx;
                        line-height: 28rpx;
                        background-color: #F8F8F8;
                        padding: 3rpx 7rpx;
                        border-radius: 6rpx;
                        margin-top: 10rpx;
                    }
                }
            }


            .right {
                padding: 0 30rpx 0 24rpx;
                overflow: hidden;
                flex-shrink: 0;

                .price_info {
                    color: $main-font-color;
                    font-weight: bold;
                    align-items: baseline;

                    .unit,
                    .price_decimal {
                        font-size: 24rpx;
                        line-height: 28rpx;
                    }

                    .price_int {
                        font-size: 32rpx;
                        line-height: 32rpx;
                    }
                }

                .goods_num {
                    color: #2D2D2D;
                    font-size: 24rpx;
                }

                .title {
                    font-size: 24rpx;
                    color: $font-color-dark;
                    line-height: 1;
                }

                .attr-box {
                    font-size: 22rpx;
                    color: $font-color-light;
                    padding: 10rpx 12rpx;
                }
            }
        }

        .price-box {
            display: flex;
            justify-content: flex-end;
            align-items: baseline;
            padding: 0 18rpx;
            font-size: 24rpx;
            color: #949494;
            width: 100%;

            .total_price {
                color: #2D2D2D;
                font-weight: bold;
                align-items: baseline;

                .unit,
                .price_decimal {
                    font-size: 24rpx;
                }

                .price_int {
                    font-size: 32rpx;
                    line-height: 32rpx;
                    margin-left: 5rpx;
                }
            }

        }

        .action-box {
            display: flex;
            justify-content: flex-end;
            align-items: flex-start;
            height: 70rpx;
            position: relative;
            padding-right: 20rpx;
            width: 100%;
            padding-bottom: 20rpx;
            margin-top: 10rpx;
        }

        .action-btn {
            width: 125rpx;
            height: 50rpx;
            margin: 0;
            margin-left: 10rpx;
            padding: 0;
            text-align: center;
            line-height: 50rpx;
            font-size: 24rpx;
            color: $main-font-color;
            background: #fff;
            border-radius: 25rpx;

            &:after {
                border-radius: 100rpx;
                border: 1rpx solid rgba(0, 0, 0, 1)
            }

            &.recom {
                color: #fff;
                background: linear-gradient(-90deg, rgba(252, 29, 28, 1), rgba(255, 122, 24, 1));
                box-shadow: 0px 3px 15px 0px rgba(252, 28, 28, 0.26);

                &:after {
                    border: none
                }
            }
        }
    }


    .empty_part {
        padding-top: 108rpx;

        .img {
            width: 256rpx;
            height: 256rpx;
            background: var(--emptyImg);
            background-size: 100% 100%;
            text-align: center;
            color:#999;
        }

        text {
            color: $main-third-color;
            font-size: 28rpx;
        }

        button {
            width: 245rpx;
            height: 66rpx;
            background: var(--applyListBtnBgColor);
            border-radius: 33rpx;
            color: var(--tagColor);
            font-size: 30rpx;
            font-weight: bold;
            margin-top: 29rpx;
            border: none;
        }

        uni-button:after {
            border-radius: 200rpx;
            border-color: #fff;
            border: none;
        }
    }
    .loadingState{
        padding-bottom: var(--safe-area-inset-bottom);
    }
</style>
