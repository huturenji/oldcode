<template>
    <view class="gift">
        <view class="gift_nav centered_around">
            <tabs 
                class="tab"
                :list="navList"
                :current="tabCurrentIndex" 
                keyName="text" 
                :itemStyle="{height: '88rpx',width:'50%'}"
                :inactiveStyle="{color: '#222222', transform: 'scale(1)',fontSize:'30rpx',padding:'0 18rpx'}"
                :activeStyle="{color: '#F30300', transform: 'scale(1.1)', transformOrigin:'center bottom', fontWeight:'bold',transition: 'transform .3s',fontSize:'36rpx',padding:'0 18rpx'}"     
                lineWidth="40rpx"
                lineHeight="8rpx"    
                @tabChange="handleNav"                        
            ></tabs>
        </view>

        <view class="gift_content">
            <swiper duration="300" @change="changeTab" :current="tabCurrentIndex" class="swiper-box">
                <swiper-item  class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
                    <scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadData" :lower-threshold="150">
                        <!-- 礼品项 -->
                        <view class="gift_list" v-if="tabItem.giftList.length>0">
                            <view class="gift_item_box" v-for="(item,index) in tabItem.giftList" :key="index">
                                <thumbGift :gift_info="item" :tabCurrent="tabItem.stateValue" @cancelResult="cancelResult" @giftCanceled="giftCanceled"></thumbGift>
                            </view>
                        </view>
                        <!-- 缺省页 -->
                        <view class="no_data flex_column_start_center" v-if="tabItem.loadingState === 'no_data'">
                            <image :src="imgUrl + 'empty/icon_defpage_zwnr.png'" mode=""></image>
                            <text>{{$L('暂无礼品')}}~</text>
                        </view>
                        <!-- loading和暂无更多 -->
                        <loadingState state='loading' v-show="tabItem.loadingState === 'loading'" />
                        <noMoreDataDivider color="#999999" v-show="tabItem.loadingState === 'no_more_data'" />
                    </scroll-view>
                </swiper-item>
            </swiper>
        </view>
        <!-- 分享弹框 start -->
        <view class="share_model" v-if="share_model" @touchmove.stop.prevent="()=>{}">
            <view class="bizmateshareWrap">
                <share @close="share_model=false" :shareOptions="shareOptions" :supportTypes="supportTypes" :showCopy="false"></share>
            </view>
        </view>
        <!-- 分享弹框 end -->
    </view>
</template>

<script>
import tabs from "@/components/tab/base";
import thumbGift from "@/components/gift/thumb-gift.vue";
import noMoreDataDivider from "@/components/division/index.vue";
import loadingState from "@/components/loading/loading.vue";
import giftHandler from '@/components/gift/handler';
import share from '@/components/share/index.vue';
import { getEmaoqingShareInfo } from '@/views/gift/common/lib/until';
import { giftType } from './common/lib/enum.js';

export default {
    components: {
        tabs,
        thumbGift,
        noMoreDataDivider,
        share,
        loadingState
    },
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            firstLoading: true,
            tabCurrentIndex:0, //当前index
            navList:[
                {
                    text: "我送出的",
                    giftList: [],
                    current: 1, //分页
                    state: 0,
                    stateValue: giftType['GIVED'],
                    loadingState: "first_loading",
                    isloading: false // 用于避免多次触底重复加载数据
                },
                {
                    text: "我收到的",
                    giftList: [],
                    current: 1, //分页
                    state: 1,
                    stateValue: giftType['RECEIVED'],
                    loadingState: "first_loading",
                    isloading: false
                }
            ],
            giftType: giftType,
            share_model: false,//分享弹框控制
            shareOptions: {},//分享所需的参数
            supportTypes: ['bizmate'] //当前渠道下支持的H5 sharetype
        };
    },
    mounted(){
        /* 这里parseInt是因为如果在路由中取的tabIndex='0',在进到鹅毛情列表之后第1个tabItem用的不是activeStyle的样式
        而是inactiveStyle的样式，但是下面的小横线却在第一个。tabIndex='1'进来没有问题。猜测可能是因为current从路由中取的是字符串导致的这原因 */
        this.tabCurrentIndex = this.$Route.query.tabIndex ? parseInt(this.$Route.query.tabIndex) : 0;
        let navItem = this.navList[this.tabCurrentIndex];
        navItem.loadingState = 'first_loading';
        navItem.giftList = [];
        navItem.current = 1;
        if (this.firstLoading) {
            this.firstLoading = false
            uni.showLoading()
        }
        this.loadData();
    },
    onShow() {  
        //监听按钮事件,先取消再监听，避免多次监听导致触发多次
        uni.$off('giftShare', this.setShareInfo);
        uni.$on('giftShare', this.setShareInfo);
    },
    onHide(){
        //取消监听，避免多页面监听导致触发多次
        uni.$off('giftShare', this.setShareInfo);
    },
    activated(){
        this.changeStatus();
    },
    computed: {},
    methods: {
        // 当礼物详情状态改变时，外面列表的状态也跟着一起变
        // featherObj
        //   - type: del (删除该项) / change (修改状态)
        //   - featherId: 列表项id
        changeStatus(){
            let giftList = this.navList[this.tabCurrentIndex].giftList
            if (!!window.featherObj && giftList.length > 0) {
                let index = giftList.findIndex(item => item.featherId == window.featherObj.featherId)
                if (index === -1) {
                    window.featherObj = null;
                    return
                }

                if (window.featherObj.type === 'del') {
                    giftList.splice(index, 1)
                } else if (window.featherObj.type === 'change') {
                    this.$set(giftList[index], 'status', window.featherObj.status)
                    this.$set(giftList[index], 'used', window.featherObj.used)
                }
                window.featherObj = null;
            } else {
                window.featherObj = null;
            }
        },
        // 点击已取消的礼物的去支付、取消送礼按钮
        giftCanceled(){
            this.changeStatus();
        },
        // 取消送礼结果（成功or失败）,前端删除这条数据，不重新请求接口
        cancelResult(data) {
            // 成功时执行
            if (data.result){
                let navItem = this.navList.filter(item => item.state == this.tabCurrentIndex)[0];
                let index = navItem.giftList.findIndex(item => item.featherId == data.featherId)
                if (index !== -1) {
                    navItem.giftList.splice(index, 1)
                    if (navItem.giftList.length === 0) {
                        navItem.loadingState = 'no_data'
                    }
                }
            }
        },
        // 获取鹅毛情礼物订单列表
        getGiftList() {
            let navItem = this.navList.filter(item => item.state == this.tabCurrentIndex)[0];
            let param = {};
            param.pageSize = 10;
            param.current = navItem.current;
            param.type = this.tabCurrentIndex;

            navItem.loadingState = navItem.loadingState == 'first_loading' ? 'first_loading' : 'loading';
            navItem.isloading = true
            giftHandler.getGiftList(param).then(res => {
                uni.hideLoading()
                navItem.isloading = false
                if (res.state == 200 && res.data.list) {
                    if (navItem.current == 1) {
                        navItem.giftList = res.data.list
                    } else {
                        navItem.giftList = navItem.giftList.concat(res.data.list);
                    }

                    let hasMore = this.$checkPaginationHasMore(res.data.pagination); //是否还有数据
                    if (navItem.giftList.length === 0) {
                        navItem.loadingState = 'no_data';
                    } else if (hasMore) {
                        navItem.current++;
                        navItem.loadingState = 'allow_loading_more';
                    } else {
                        navItem.loadingState = 'no_more_data';
                    }
                } else {
                    this.$api.msg(res.msg);
                }
            }).catch(() => {
                //异常处理  
                uni.hideLoading()           
            })
        },
        
        loadData(source) {
            //将订单挂载到tab列表下,起到缓存的效果，避免多次请求
            let navItem = this.navList.filter(item => item.state == this.tabCurrentIndex)[0];
            
            if (source === 'tabChange' && navItem.loadingState !== 'first_loading') {
                //tab切换只有第一次需要加载数据
                return;
            }
            if (source === 'tabChange' && navItem.loadingState == 'first_loading'){
                uni.showLoading()
            }

            //防止重复加载
            if (navItem.isloading) {
                return;
            }
            if (navItem.loadingState != 'no_more_data'){
                this.getGiftList()
            }
        },
        // swiper切换
        changeTab(e){
            this.tabCurrentIndex = e.target.current;
            this.loadData('tabChange');
        },
        //点击nav导航
        handleNav({index:state}) {
            this.tabCurrentIndex = state;
        },
        /**
         * 处理分享所需数据
         * @param number featherId
         */
        async setShareInfo(featherId){
            let that = this;
            try {
                that.shareOptions = await getEmaoqingShareInfo(featherId);
                that.share_model = true;
            } catch (error) {
                console.log('分享失败',error)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    page,
    .gift {
        position: relative;
        background: $bg-color-split;
        height: 100%;
        width: 750rpx;
        margin: 0 auto;
    }
    .swiper-box {
        flex: 1;
        height: 0;
    }
    .gift_content{
        height: 100%;
        display: flex;
        flex-direction: column;
        padding-top: 88rpx;
    }
    .list-scroll-content{
        height: 100%;

        ::v-deep .noMore-data{
            box-sizing: content-box;
            padding-bottom: var(--safe-area-inset-bottom);
        }
    }
    .gift_nav{
        width: 750rpx;
        position: fixed;
        top: var(--titleBarFillHeight, 0px);
        z-index: 100;
        background: #fff;
    }
    .gift_list {
        .gift_item_box{
            padding: 0 20rpx;
        }
    }

    .share_model {
        width: 750rpx;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        margin: 0 auto;
        background: rgba(0, 0, 0, 0.6);
        z-index: 999;
    }
    .bizmateshareWrap{
        position: absolute;
        left: 0;
        right:0;
        bottom: 0;
    }
    
    .no_data {
        padding-top: calc((100vh - 268rpx)*0.39 - 128rpx);

        image {
            width: 256rpx;
            height: 256rpx;
        }

        text {
            color: $main-third-color;
            font-size: 28rpx;
        }
    }
</style>
