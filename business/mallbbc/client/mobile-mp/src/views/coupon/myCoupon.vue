<!-- 我的优惠券 -->
<template>
    <view class="my_coupon">
        <view class="my_coupon_nav">
            <tabs 
                class="tab"
                :list="navList"
                :current="tabCurrentIndex" 
                :showScrollBar="false"
                :itemStyle="{height: '90rpx'}"  
                @change="handleNav"         
            >
                <template slot="slideBlock">
                    <view class="slide"></view>
                </template>
            </tabs>
        </view>
        <view class="helpTips flex_row_center_center" @click="showHelpTips" v-if="showHelpTipsButt && tabCurrentIndex==0" :class="{backgroundfff: !filterFlag}">使用帮助</view>
        <view class="my_coupon_content">
            <swiper duration="300" @change="changeTab" :current="tabCurrentIndex" class="swiper-box">
                <swiper-item  class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
                    <scroll-view class="list-scroll-content" scroll-y @scrolltolower="load" :lower-threshold="150">
                        <view class="my_coupon_list" v-if="tabItem.couponList.length&&tabItem.loaded">
                            <template v-if="tabIndex==0">
                                <couponItem :key="index" :couponItem="item" v-for="(item,index) in tabItem.couponList" @changeRulesState="changeRulesState($event,index)"></couponItem>
                            </template>
                            <template v-if="tabIndex==1">
                                <expressCouItem :key="index" :couponItem="item" v-for="(item,index) in tabItem.couponList"></expressCouItem>
                            </template>
                            <template v-if="tabIndex==2">
                                <consumptionCouItem :key="index" :couponItem="item" v-for="(item,index) in tabItem.couponList" @openQrCode="openQrCode"></consumptionCouItem>
                            </template>
                        </view>
                        <loadingState  :state='tabItem.loadingState' mTop='400rpx' v-if="tabItem.loadingState=='first_loading' || tabItem.loadingState=='loading' || (tabItem.loadingState=='no_more_data' && tabItem.couponList.length>0 && tabItem.showNoMoreDataTips)" class="loadingState"/>
                        <view class="no_data" v-if="tabItem.isShow && tabItem.loaded">
                            <view class="imgWrap"></view>
                            <text v-if="tabIndex==0">暂无优惠券，去领券中心看看吧~</text>
                            <text v-else-if="tabIndex==1">暂无运费券~</text>
                            <text v-else>暂无消费券~</text>
                        </view>            
                    </scroll-view>
                </swiper-item>
            </swiper>
        </view>
        <view class="fixed_bottom flex_row_center_center">
            <view class="history flex_row_center_center" @click="goCoupunHistory()">历史记录</view>
            <view class="toCoupunCenter flex_row_center_center" @click="goCouponCenter()"><view>前往领券中心</view></view>
        </view>
        <uniPopup ref="helpTips">
            <view class="helpTips_box flex_column_center_center">
                <view class="helpTips_title"></view>
                <view class="helpTips_con">
                    <scroll-view :scroll-y="true" :show-scrollbar="true" class="scrollY">
                        <view>{{ helpTipsCon }}</view>
                    </scroll-view>
                </view>
                <view class="close"><view @click="closeHelpTips" class="flex_row_center_center">我知道了</view></view>
            </view>
        </uniPopup>
        <uniPopup ref="qrPop">
            <view class="qrPop_container flex_row_center_center">
                <qrcode :options="{ size: qrCodeObj.size, code: qrCodeObj.value }" />
            </view>
        </uniPopup>
    </view>
</template>
<script>
import loadingState from "@/common/components/loading/loading.vue";
import tabs from './custom.vue'
import {isNotEmpty,filterFlag,checkPaginationHasMore,getQuerySelector} from '@/utils/common.js'
import config from '@/common/lib/config.js';
import goodsHandler from '@/views/components/goods/handler';
import systemHandler from '@/views/components/system/handler';
import uniPopup from '@/common/components/uni-popup/uni-popup.vue'
import couponItem from '@/views/components/coupon/couponItem.vue';
import expressCouItem from '@/views/components/coupon/expressCouItem.vue';
import consumptionCouItem from '@/views/components/coupon/consumptionCouItem.vue';
import qrcode from "@/common/components/qrcode/qrcode.vue";
export default {
    components: {
        loadingState,
        tabs,
        uniPopup,
        couponItem,
        expressCouItem,
        consumptionCouItem,
        qrcode
    },
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            pageSize: 10,
            hasMore: false, //是否还有数据
            showState:false,
            navList:[
                {
                    text:"优惠券",
                    num:0,
                    loadingState: 'first_loading',
                    couponList:[],
                    current: 1, //分页
                    useState: '1',
                    isShow:false,//接口请求完是否有数据，true没有，false有
                    loaded:false, //数据是否请求完
                    showNoMoreDataTips:true //判断是否显示数据加载完毕的底部tips
                },
                {
                    text:"运费券",
                    num:0,
                    loadingState: 'first_loading',
                    couponList:[],
                    current: 1, //分页
                    useState: '1',
                    isShow:false,
                    loaded:false,
                    showNoMoreDataTips:true
                },
                {
                    text:"消费券",
                    num:0,
                    loadingState: 'first_loading',
                    couponList:[],
                    current: 1, //分页
                    useState: ['1'],
                    isShow:false,
                    loaded:false,
                    showNoMoreDataTips:true
                }
            ],
            tabCurrentIndex:0,
            helpTipsCon:'', //使用帮助内容
            showHelpTipsButt:false, //是否显示使用帮助按钮
            filterFlag: true, //是否支持高斯模糊
            requestApi:'', //请求的接口名称
            qrCodeObj:{
                value:'',
                size:440
            }
        };
    },
    computed: {
        
    },
    mounted(){
        this.initLoad()
    },
    methods: {
        initLoad() {
            this.filterFlag = filterFlag();
            this.tabCurrentIndex = this.$Route.query.activeIndex || 0
            this.getCouponList(0)
            this.getCouponList(1)
            this.getCouponList(2)
            this.getHelpTips();
        },
        changeConsumneList() {
            let navItem = this.navList[this.tabCurrentIndex];
            navItem.loadingState = 'first_loading';
            navItem.couponList = [];
            navItem.current = 1;
            this.getCouponList(2)
        },
        // 触底加载更多
        load(){
            this.loadData(); 
        },
        changeRulesState(data,index) {
            this.$set(this.navList[this.tabCurrentIndex].couponList[index],'isOpen',data)
        },
        comeBackMyCoupon(){
            let navItem1 = this.navList[0];
            navItem1.loadingState = 'first_loading';
            navItem1.couponList = [];
            navItem1.current = 1;
            let navItem2 = this.navList[2];
            navItem2.loadingState = 'first_loading';
            navItem2.couponList = [];
            navItem2.current = 1;
            this.getCouponList(0);
            this.getCouponList(2)
        },
        //获取优惠券列表
        getCouponList(tabIndex) {
            let index = tabIndex !== undefined ? tabIndex:this.tabCurrentIndex;
            let navItem = this.navList[index];
            this.requestApi = index == 0?'getMyCouponList':index == 1?'getFreightCoupon':'getConsumeCoupon'
            let param = {};
            param.current = navItem.current;
            param.pageSize = this.pageSize;
            if (index == 2) {
                param.useStates = navItem.useState;
            } else {
                param.useState = navItem.useState;
            }
            navItem.loadingState = navItem.loadingState == 'first_loading' ? navItem.loadingState : 'loading';
            goodsHandler[this.requestApi](param).then(async res => {
                if (res.state == 200) {
                    let result;
                    if (index == 0 || index == 2) {
                        result = res.data;
                    } else if (index == 1) {
                        result = res.data.page;
                    }
                    if (navItem.current == 1) {
                        navItem.couponList = result.list
                    } else {
                        navItem.couponList = navItem.couponList.concat(result.list);
                    }
                    navItem.num = result.pagination.total;
                    if (index == 0) {
                        navItem.couponList.forEach(item => {
                            this.$set(item,'isOpen',false)
                        })
                    }
                        
                    navItem.loaded=true;
                    this.hasMore = checkPaginationHasMore(result.pagination); //是否还有数据
                    if (this.hasMore) {
                        navItem.current++;
                        navItem.loadingState = 'loading';
                    } else {
                        navItem.loadingState = 'no_more_data';
                    }
                    if (navItem.couponList.length == 0){
                        navItem.isShow=true;
                    } else {
                        navItem.isShow=false;
                    }
                    await this.$nextTick()
                    // 计算是否需要显示'数据加载完毕'的底部tips
                    // if (!navItem.showNoMoreDataTips){ //变为true了之后就会一直显示tips，避免多次计算
                    
                    //     let navDomH = await getQuerySelector('.my_coupon_nav', false, this).height;
                    //     let contentDomH = await getQuerySelector('.my_coupon', false, this).height;
                    //     let couponListHeight=0,fixedBottomDomH=0;
                    //     if (!navItem.isShow){ //有优惠券数据才计算对应高度
                    //         fixedBottomDomH = await getQuerySelector('.fixed_bottom', false, this).height;
                    //         couponListHeight = await getQuerySelector('.my_coupon_list', true, this)[index].height;
                    //     }
                    //     navItem.showNoMoreDataTips = couponListHeight > (contentDomH - navDomH - fixedBottomDomH)?true:false;
                    // }
                        
                } else {
                    navItem.loaded=true;
                    navItem.loadingState = '';
                    uni.showToast({ title: res.msg, icon: 'none' })
                }
            })
            // .catch(() => {
            //     //异常处理
            // })
        },
        //点击nav导航
        handleNav({index:type}) {
            this.tabCurrentIndex = type;
        },
        changeTab(e){
            this.tabCurrentIndex = e.target.current;
            this.loadData('tabChange');
        },
        //获取优惠券列表
        loadData(source) {
            //将列表挂载到tab列表下,起到缓存的效果，避免多次请求
            let navItem = this.navList[this.tabCurrentIndex];
            if (source === 'tabChange' && navItem.loadingState !== 'first_loading') {
                //tab切换只有第一次需要加载数据
                return;
            }
            if (navItem.loadingState != 'no_more_data') {
                this.getCouponList()
            }

        },
        //去领券中心页面
        goCouponCenter() {
            this.showState = true
            this.$Router.push({
                path: '/views/topic/index',
                query: {
                    topicId: config.COUPON_TOPIC_ID
                }
            })
        },
        // 去红包历史页面
        goCoupunHistory() {
            this.showState = true
            this.$Router.push('/views/coupon/myCouponHistory')
        },
        // 显示使用帮助
        showHelpTips(){
            this.$refs.helpTips.open();
        },
        // 关闭使用帮助
        closeHelpTips(){
            this.$refs.helpTips.close();
        },
        // 获取使用帮助内容
        getHelpTips(){
            systemHandler.getSettings({names: 'coupon_user_help'})
                .then(res => {
                    if (res.state == 200) {
                        this.helpTipsCon = res.data[0] || '';
                        this.helpTipsCon = this.helpTipsCon.replace(/\n/g,'\n\n').trim()
                        this.showHelpTipsButt = isNotEmpty(this.helpTipsCon)?true:false;
                    }
            })
        },
        // 显示二维码弹框
        openQrCode(item) {
            this.qrCodeObj.value = `${item.couponCode}`
            this.$refs.qrPop.open();
        }
    }

}
</script>

<style lang="scss">
    page {
        background: $uni-bg-color;
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
        padding: 90rpx 0 calc(88rpx + var(--safe-area-inset-bottom)) 0;
    }
    .list-scroll-content{
        height: 100%;
    }
    .helpTips{
        width: 100rpx;
        height: 80rpx;
        position: fixed;
        left: 50%;
        margin-left: calc(375rpx - 100rpx);
        top: calc(var(--titleBarFillHeight, 0px) + 118rpx);
        z-index: 5;
        padding: 0 20rpx;
        font-size: 26rpx;
        font-weight: bold;
        color: #f30300;
        border: 2rpx solid #fff;
        border-radius: 40rpx 0 0 40rpx;
        background: rgba(255,255,255,0.8);
        backdrop-filter: blur(16px);
        &.backgroundfff {
            background: rgba(255,255,255,0.9);
        }
    }
    .my_coupon {
        width: 750rpx;
        height: 100%;
        margin: 0 auto;

        .my_coupon_nav {
            height: 90rpx;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            background: #FFFFFF;
            position: fixed;
            top: var(--bar-height);
            z-index: 100;
            width: 750rpx;
            box-sizing: border-box;
            .tab {
                width: 100%;
                padding-bottom: 0 !important; 
            }
            .slide {
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
                .number_box {
                    margin-top: -4rpx;
                }
                .number {
                    font-size: 32rpx;
                }
                &.activeTab {
                    font-size: 32rpx;
                    font-weight: bold;
                    color: #222222;
                    .number {
                        font-size: 34rpx;
                    }
                }
            }

            .my_coupon_nav_pre {
                font-size: 32rpx;
                font-family: PingFang SC;
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
                background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/empty/icon_defpage_zwyhq.png') center no-repeat;
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
                background: #f30300;
                border-radius: 32rpx;
                font-size: 28rpx;
                font-family: PingFang SC;
                font-weight: 600;
                color: #fff;
                text-align: center;
                line-height: 64rpx;
            }
        }
    }
    .fixed_bottom{
        display: flex;
        align-items: center;
        justify-content: center;
        background: #FFFFFF;
        position: fixed;
        bottom: 0;
        z-index: 100;
        width: 750rpx;
        height: calc(88rpx + var(--safe-area-inset-bottom));
        padding-bottom: var(--safe-area-inset-bottom);
        box-sizing: border-box;
        font-size: 30rpx;
        .history,.toCoupunCenter {
            flex: 1;
            height: 100%;
            line-height: 42rpx;
            font-weight: bold;
        }
        .history {
            position: relative;
            color: #222222;
            &::after {
                content: '';
                display:block;
                position: absolute;
                right: 0;
                top: 50%;
                width: 1px;
                height: 20rpx;
                transform: translateY(-50%);
                background: #d8d8d8;
            }
        }
        .toCoupunCenter{
            color: #f30300;
            
            view {
                padding: 0 24rpx;
                background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_rightarrow_red.svg') right center no-repeat;
                background-size: 20rpx 20rpx;
            }
        }
    }
    .helpTips_box{
        width: 590rpx;
        height: 100%;
        position: relative;
        padding-bottom: 40rpx;
        border-radius: 32rpx;
        border: 8rpx solid #e0aa7b;
        background: #ffffff;
        .scrollY{
            min-height: 232rpx;
            max-height: 552rpx;
            white-space: pre-wrap;
        }
        .helpTips_con{
            width: 100%;
            line-height: 40rpx;
            margin: 28rpx 0 40rpx 0;
            overflow-y: scroll;
            padding: 0 40rpx;
            flex: 1;
            font-size: 28rpx;
            color: #222222;
            .noScroll{
                white-space: pre-wrap;
            }
        }
        .helpTips_title{
            width: 272rpx;
            height: 64rpx;
            margin-top: -20rpx;
            background: url("https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/coupon/icon_yhq_help.png") no-repeat;
            background-size: 100% 100%;
        }
        .close{
            width: 100%;
            height: 80rpx;
            padding: 0 40rpx;
            view{
                width: 100%;
                height: 100%;
                border: 2rpx solid #c2c2c2;
                border-radius: 40rpx;
                font-size: 30rpx;
                color: #222222;
                font-weight: bold;

            }
        }
    }
    .qrPop_container {
        // width: 686rpx;
        // height: 686rpx;
        // background: #ffffff;
        // border-radius: 20rpx;
    }
    ::v-deep .uni-transition {
        background: #fff !important;
    }
</style>