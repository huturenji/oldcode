<!-- 都在买页面 -->
<template>
    <view ref="container" class="container"  @click="hideFilterList()" @longpress="hideFilterList()" @touchmove="hideFilterList()"> 
        <!-- 都在买的商品 start-->
        <view class="goods_list_buy flex_column_start_start" v-if="isLoaded">
            <view class="renwubg"></view>
            <view class="flex_column_center_end filterBox">
                <view class="flex_row_center_center filterText" @click.stop="FilterListCtrl">{{filterText}}<view :class="showFilterList?'down':'up'" class="sanjiao"></view></view>
                <view class="flex_column_center_center filterListBox" v-if="showFilterList">
                    <view v-for="(item,index) in filterList" :key="index" @click.stop="changeFilter(item)" class="flex_column_center_center filterItem"  :class="{active:currentIndex==item.value}">{{item.text}}</view>
                </view>
            </view>
            
            <template v-for="(item,index) in skuList">
                <view :key='index' class="billboardWrap" v-if="immersive">
                    <view class="zhuzi_1"></view>
                    <view class="zhuzi_2"></view>
                    <thumbBillboard :goods_info="item" :isLoaded="isLoaded" :showThumbTips="true"/>
                </view>
            </template>
            <!-- 空白页 start-->
            <view v-if="!immersive" class="flex_column_center_center empty_part">
                <view class="flex_column_start_center empty_content">
                    <view class="imgWrap"></view>
                    <text class="tip_con">{{$L('未有朋友购买过商品')}}</text>
                    <view class="ope_btn flex_row_center_center" @click="gotoIndex()">
                        {{$L('去商城浏览')}}
                    </view>
                </view>
            </view> 
            <!-- 空白页 end-->
        </view>
        <!-- 骨架图 -->
        <view class="goods_list_buy flex_column_start_start" v-else>
            <view class="renwubg"></view>
            <view class="flex_column_center_end filterBox">
                <view class="flex_row_center_center filterText" @click.stop="FilterListCtrl">{{filterText}}<view :class="showFilterList?'down':'up'" class="sanjiao"></view></view>
                <view class="flex_column_center_center filterListBox" v-if="showFilterList">
                    <view v-for="(item,index) in filterList" :key="index" @click.stop="changeFilter(item)" class="flex_column_center_center filterItem"  :class="{active:currentIndex==item.value}">{{item.text}}</view>
                </view>
            </view>
            <view v-for="i in countNum" :key='i' class="billboardWrap">
                <view class="zhuzi_1"></view>
                <view class="zhuzi_2"></view>
                <view class="billboard_wrap_no">
                    <view class="goods_billboard_item_h flex_row_start_start">
                    <view class="animated-img"></view>
                    <view class="right flex_column_between_start">
                        <view>
                            <view class="animated-background animated-name"></view>
                            <view class="animated-background animated-name"></view>
                        </view>
                        <view class="first-animated-background animated-price"></view>
                    </view>
                    </view>
                    <view class="bottomInfo_no">
                        <view class="animated-background animated-left"></view>
                        <view class="animated-background animated-right"></view>
                    </view>
                </view>
            </view>
        </view>
        <loadingState v-if="(loadingState != 'first_loading' || (loadingState == 'first_loading' && loadType==2)) && immersive" 
        :state='loadingState' stateColor='#fff' loadingImg='icon_common_wprocess.png' 
        :class="(loadingState == 'first_loading' && loadType==2)?'change':'noChange'" mTop="500rpx"/>
        <view class="floatBut icon-btn" :class="{hide:floatButHide}" @click="gotoIndex()">
        </view>
    </view>
</template>

<script>
import thumbBillboard from "@/components/goods/thumb/thumb-billboard.vue";
import loadingState from "@/components/loading/loading.vue";
import orderHandler from '@/components/order/handler';

export default {
    components: {
        thumbBillboard,
        loadingState
    },
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            skuList: [], //商品列表
            initSkuList:[],//最初请求的100条数据
            hasMore: true, //是否还有数据
            pageSize: 100,
            current: 1,
            localCurrent:1, //本地分页索引
            loadingState: 'first_loading',
            time:null,//更多资讯按钮是否隐藏的定时器
            floatButHide:false,//更多资讯按钮是否隐藏
            immersive:true,//是否是沉浸式
            isLoaded:false,
            countNum:4,//缺省页面的占位纯色卡片个数
            filterList:[ //筛选列表。顺序展示，1：下单时间倒序 2：购买人数从大到小。
                {
                    value:'1',
                    text:'时间'
                },
                {
                    value:'2',
                    text:'人数'
                }
            ],
            filterText:'时间', //显示的筛选条件
            showFilterList:false, //是否显示筛选弹框
            currentIndex:'1', //当前显示的筛选条件索引
            bgColor:'',
            loadType:1 //加载数据方式 1 mounted时加载或者hasmore时加载，2 改变筛选条件时请求
        };
    },
    created(){
        if (this.immersive){
            this.titleBarTheme(false);
        } else {
            this.titleBarTheme(true);
        }
    },
    async mounted(){
        this.current = 1;
        this.localCurrent = 1;
        this.loadingState = 'first_loading';
        await this.getList();
        this.getLocalList()
    },
    onShow() {
    },
    computed: {
    },
    onPageScroll(e) {
        if (!!this.time){
            clearTimeout(this.time)
        }
        this.floatButHide = true;
        this.time = setTimeout(() => {
            this.floatButHide = false;
        }, 300);
        let opacity
        if (this.immersive){
            if (e.scrollTop > 0) {
                if(window.titleHeight + window.statusHeight!=0){
                    opacity = e.scrollTop / (window.titleHeight + window.statusHeight - 1);
                }else{
                    opacity = 1
                }
                opacity = opacity > 1 ? 1 : opacity;
                this.bgColor = `rgba(255, 255, 255, ${opacity})`;
                this.titleBarTheme(true,opacity);
            } else {
                opacity = 0
                this.bgColor = 'transparent';
                this.titleBarTheme(false,opacity);
            }
        }
    },
    methods: {
        setTitleBarBackground(opacity){
            this.$titleBar.set({
                title: {
                    background: this.bgColor,
                    opacity:opacity
                },
                status: {
                    background: this.bgColor,
                    opacity:opacity
                }
            })
        },
        /**
             * 跳转首页
             */
        gotoIndex(){
            this.$openBBCPage(location.origin+location.pathname+'#/');
        },
        // 改变筛选条件
        async changeFilter(item){
            this.loadingState = 'first_loading';
            this.loadType=2;
            this.current = 1;
            this.localCurrent = 1;
            this.filterText = item.text;
            this.currentIndex = item.value;
            this.skuList = [];
            this.initSkuList = []
            await this.getList()
            this.getLocalList()
            this.showFilterList = false;
        },
        // 控制筛选列表显隐
        FilterListCtrl(){
            this.showFilterList = !this.showFilterList;
        },
        // 隐藏筛选列表
        hideFilterList(){
            this.showFilterList = false;
        },
        //获取商品
        getList() {
            return new Promise((resolve) => {
                let params = {}; 
                params.pageSize = this.pageSize;
                params.current = this.current;
                params.flag= this.currentIndex;
                this.loadingState = this.loadingState == 'first_loading' ? this.loadingState : 'loading';
                orderHandler.getBillboardList(params).then(res => {
                    this.isLoaded =true;
                    if (res.state == 200) {
                        this.initSkuList = res.data.list;
                        if (this.initSkuList.length > 0){
                            this.immersive = true;
                        } else {
                            this.immersive = false;
                        }
                    } else {
                        this.loadingState = '';
                        this.$api.msg(res.msg);
                    }
                    resolve()
                }).catch(() => {
                    this.loadingState = '';
                    resolve();
                });
            })
            
        },
        getLocalList(){
            if (this.loadingState == 'loading') {
                setTimeout(() => {
                    this.judgeHasMore()
                },500)
            } else {
                this.judgeHasMore()
            }
        },
        // 判断本地分页是否分页
        judgeHasMore() {
            this.skuList = this.skuList.concat(this.initSkuList.slice((this.localCurrent-1)*10,this.localCurrent*10));
            this.hasMore = this.$checkPaginationHasMore({current:this.localCurrent,pageSize:10,total:this.initSkuList.length}); //是否还有数据
            if (this.hasMore) {
                this.localCurrent++;
                this.loadingState = 'loading';
            } else {
                this.loadingState = 'no_more_data';
            }
        },
        //马上去逛逛事件
        goGoodsList() {
            this.$Router.push({path:'/standard/product/list',query:{showStoreTabs: false}})
        },
        //页面触底事件
        onReachBottom() {
            if (this.hasMore) {
                this.getLocalList();
            }
        },
        // 设置titleBar样式
        titleBarTheme(reverse,opacity){
            if (reverse){
                this.$titleBar.set({
                    title: {
                        show: true,
                        showTitle: true,
                        themeMode: 'dark',
                        background: this.bgColor,
                        opacity:opacity
                    },
                    status: {
                        show: true,
                        themeMode: 'dark',
                        background: this.bgColor,
                        opacity:opacity
                    }
                })
            } else {
                this.$titleBar.set({
                    title: {
                        show: false,
                        showTitle: false,
                        themeMode: 'light',
                        background: this.bgColor,
                        opacity:opacity
                    },
                    status: {
                        show: false,
                        themeMode: 'light',
                        background: this.bgColor,
                        opacity:opacity
                    }
                })
            }
        }
    }
}
</script>

<style lang='scss' scoped>
    page {
        width: 750rpx;
        margin: 0 auto;
    }
    .container{
        background: linear-gradient(180deg,#8EB6FE 1%, #8EB6FE);
        margin-top: calc(-1*var(--titleBarFillHeight));
        min-height: 100vh;
        position: relative;
        .change{
            position: absolute;
            z-index: 10;
            right: 0;
            left: 0;
            top: 0;
            bottom: 0;
            margin: 0 auto;
            
        }
        .noChange{
           position: static; 
        }
    }
    .billboard_wrap_no{
        position:relative;
        transition: all 0.3s;
        padding: 58rpx 30rpx 30rpx;
        border-radius: 16rpx;
        background: url('@/static/shared/billboard//bg_dzm_kapian.svg') no-repeat;
        background-size: 100% auto;
        .goods_billboard_item_h{
            margin-bottom: 24rpx;
            .animated-img{
                width: 240rpx;
                height: 240rpx;
                border-radius: 16rpx;
                overflow: hidden;
                background: var(--loadingImageBg);
                background-size: 100% 100%;
            }
            .right{
                margin-left: 24rpx;
                .animated-name{
                    width: 386rpx;
                    height: 28rpx;
                    background: #EAEFF4;
                    border-radius: 6rpx;
                    margin-bottom: 24rpx;
                }
                .animated-price{
                    margin-top: 54rpx;
                    width:132rpx;
                    height: 28rpx;
                    border-radius: 6rpx;
                }
            }
        }
    }
    .bottomInfo_no{
        display: flex;
        justify-content:space-between;
        color: $main-third-color;
        height:28rpx;
        background: #fff;
        margin-bottom: 8rpx;
        .animated-left,.animated-right{
            width:164rpx;
            height:28rpx;
            background: #EAEFF4;
            border-radius: 6rpx;
        }
    }
    .animated-background {
        animation-name: placeHolderShimmer;
        animation-duration: 0.75s;
        animation-iteration-count: infinite;
        animation-direction: alternate;
        animation-timing-function: ease;
        background: #EAEFF4;
        position: relative;
    }
    @keyframes placeHolderShimmer {
        0% {
            opacity:1;
        }
        100% {
            opacity:0.15;
        }
    }
    .first-animated-background {
        animation-name: placeHolderShimmer;
        animation-duration: 0.75s;
        animation-iteration-count: infinite;
        animation-direction: alternate;
        animation-timing-function: ease;
        background: var(--skeletonBg);
        position: relative;
    }
    .empty_part {
        display: flex;
        flex: 1;
        width: 100%;
        padding:100rpx 0 32rpx 0;
        background: url('@/static/shared/billboard//bg_dzm_kapian.svg') top no-repeat;
        background-size: 100% auto;
        .empty_content{
            padding-top: calc((100vh - 422rpx - 32rpx)*0.32 - 100rpx - 64rpx); //422为最上面背景的高，32为empty_part底部padding，100为empty_part的上padding，64为缺省图片高的一半
            flex: 1;
            width: 100%;
            height: 100%;
            background: #fff;
            border-radius: 0 0 20rpx 20rpx;
        }
        .imgWrap {
            width: 128rpx;
            height: 128rpx;
            margin-bottom: 72rpx;
            background: var(--emptyImg);
            background-size: 100%;
        }

        .tip_con {
            color: $main-third-color;
            font-size: 28rpx;
        }

        .ope_btn {
            width: 440rpx;
            color: var(--buyNowColor);
            font-size: 32rpx;
            height: 88rpx;
            line-height: 88rpx;
            background: var(--confirmBtnBgColor2);
            border-radius: 88rpx;
            margin-top: 40rpx;
            text-align: center;
            cursor: pointer;
        }
    }

    .empty_part_FF {
        height: auto;
        padding-top: 200rpx;

    }

    .goods_list_buy {
        padding: 422rpx 20rpx 0;
        overflow-x: hidden;
        width:750rpx;
        min-height: 100vh;
        
        background: url('@/static/shared/billboard//bg_dzm_bg.png') no-repeat top;
        background-size: 100% auto;
        position: relative;
        &>view:nth-of-type(3){
            .zhuzi_1{
                width: 0;
                height: 0;
                background: unset;
                position: unset;
                left: unset;
                top: unset;
            }
            .zhuzi_2{
                width: 0;
                height: 0;
                background: unset;
                position: unset;
                left: unset;
                top: unset;
            }
        }
        .renwubg{
            width:328rpx;
            height: 296rpx;
            background: url('@/static/shared/billboard//bg_dzm_ren.png') no-repeat;
            background-size: 100% auto;
            position: absolute;
            top: 240rpx;
            left: 104rpx;
            z-index: 2;
        }
        .billboardWrap{
            width: 100%;
            position: relative;
            .zhuzi_1{
                width: 22rpx;
                height: 20rpx;
                background: url('@/static/shared/billboard//icon_dzm_yuanzhu.svg') no-repeat;
                position: absolute;
                left: 134rpx;
                top: 0rpx;
            }
            .zhuzi_2{
                width: 22rpx;
                height: 20rpx;
                background: url('@/static/shared/billboard//icon_dzm_yuanzhu.svg') no-repeat;
                position: absolute;
                right: 134rpx;
                top: 0rpx;
            }
        }
    }

    .floatBut{
        position: fixed;
        z-index: 1;
        right: 40rpx;
        bottom: 128rpx;
        width: 112rpx;
        height: 112rpx;
        background: var(--gengduoshangpin);
        background-size: 100%;
        border-radius: 50%;
        transition: all 0.3s;
        user-select: none;
        cursor: pointer;
        box-shadow: 0 6rpx 24rpx 0 rgba(132,132,132,0.24);
        &.hide{
            opacity: 0.5;
        }
    }
    @media screen and (min-width: 550px){
        .floatBut {
            right: 50%;
            margin-right: -335rpx;
        } 
    }
    .filterBox{
        position: absolute;
        top: 340rpx;
        right: 20rpx;
        z-index: 12;
        font-size: 26rpx;
        font-weight: 600;
        color: #222222;
        .filterText{
            width: 144rpx;
            height: 64rpx;
            margin-bottom: 18rpx;
            line-height: 64rpx;
            border-radius: 32rpx;
            background: #ffffff;
            opacity: 0.9;
            text-align: center;
            .sanjiao{
                width: 12rpx;
                height: 12rpx;
                margin-left: 8rpx;
                &.down{
                   background: url('@/static/shared/common/icon/xiala_down.png') center no-repeat;
                   background-size: 100% 100%;
                }
                &.up{
                   background: url('@/static/shared/common/icon/xiala_up.png') center no-repeat;
                   background-size: 100% 100%;
                }
            }
        }
        .filterListBox{
            width: 210rpx;
            height: 144rpx;
            padding: 16rpx 0;
            border-radius: 16rpx;
            background: #ffffff;
            box-shadow: 0px 6px 10px 0px rgba(147,148,159,0.43); 
            .filterItem{
                position: relative;
                width: calc(100% - 40rpx);
                flex: 1;
                margin: 0 20px;
                &:first-child::after{
                    display: block;
                    content: "";
                    position: absolute;
                    bottom: 0;
                    width: 100%;
                    // height: 1px;
                    border-bottom: 1px solid #e8e8e8;
                    box-shadow: 0px 6px 10px 0px rgba(147,148,159,0.43); 
                }
                &.active{
                    color: var(--tagColor);
                }
            }
        }
    }
   
</style>
