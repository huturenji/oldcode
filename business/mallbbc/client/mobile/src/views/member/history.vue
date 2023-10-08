<!-- 我的足迹页面 -->
<template>
    <view class="container flex_column_start_start">
        <!-- #ifndef MP-WEIXIN -->
        <!-- @clickLeft="goBack" :left-icon="nav_left_icon"-->
        <uni-nav-bar fixed='true' color='#333' status-bar='true'  :right-text="topRightText" title=""
         @clickRight='clearHistory' ></uni-nav-bar>
         <!-- #endif -->
        <!-- #ifdef MP-WEIXIN -->
        <view class="clear_history" v-if="historyList.length > 0">
            <view class="clear_history_text" v-if="settings && settings.length > 0">
                <image :src="settings[1]" mode="" v-if="settings[1]"></image>
                <text v-if="settings[0]">{{settings[0]}}</text>
            </view>
            <view class="clear_history_btn"  @click="clearHistory">{{$L('清空')}}</view>
        </view>
        <!-- #endif-->
        <!-- 空白页 start-->
        <view v-if="!historyList.length&&loadingState != 'first_loading'" class="flex_column_start_center empty_part" :class="{empty_part_FF:recommendLen == 0 && historyList.length == 0}">
            <view class="img"></view>
            <text class="tip_con">{{$L('暂无浏览的足迹哦')}}~</text>
            <view class="ope_btn flex_row_center_center" @click="goGoodsList()">
                {{$L('马上去逛逛')}}
            </view>
        </view>
        <!-- 空白页 end-->

        <!-- 足迹里的商品 start-->
        <view v-if='historyList.length' class="goods_list flex_column_start_start">
            <view class="history_item flex_column_start_start" v-for="(item,index) in historyList" :key='index'>
                <view class="time_tag flex_row_center_center">
                    {{item.time}}
                </view>
                <view v-for="(item_goods,index_goods) in item.productLookLogInfoList" :key='index_goods' @touchstart="handleTouchStart($event,item_goods.followId)" @touchmove="handleTouchMove($event,item_goods.followId)">
                    <thumbHistory  :goods_info="item_goods" :isWeiXinBrower="isWeiXinBrower"
                 @delGoods='delHistoryGoods' :goods_index='index_goods' :item_index='index_goods' @goShare="shareGoods1"    :style="{left:is_show_btn && followId == item_goods.followId?'-160rpx':'0'}" :left="is_show_btn && followId == item_goods.followId"/>
                </view>
                
            </view>
        </view>
        <loadingState v-if="loadingState == 'first_loading'||historyList.length > 0" :state='loadingState' :showEndFlag='showEndFlag' />
        <!-- 足迹里的商品 end-->

        <!-- 推荐商品 start-->
        <!-- 暂时屏蔽掉推荐商品列表 屏蔽日期:2022-9-22
        <view v-if='!hasMore || !historyList.length'>
            <recommendGoods ref='recomment_goods' />
        </view>-->
        <!-- 推荐商品 end-->
        <uni-popup ref="popup" type="dialog">
            <uni-popup-dialog type="input" :title="$L('提示')" :content="$L('确定清空浏览记录吗？')" :duration="2000" before-close="true" @close="cancleEmpty"
             @confirm="confirmEmpty"></uni-popup-dialog>
        </uni-popup>


        <!-- 微信浏览器分享提示  start-->
        <view class="wx_brower_share_mask" v-if="showWeiXinBrowerTip">
                <view class="wx_brower_share_top_wrap">
                    <image :src="imgUrl+'goods/wx_share_tip.png'" mode="widthFix" @tap="closeShareModel" class="wx_brower_share_img"></image>
            </view>
        </view>
        <!-- 微信浏览器分享提示  end-->
        <!-- 分享弹框 start -->
        <view class="share_model" v-if="share_model" @touchmove.stop.prevent="moveHandle">
            <view class="share_model_list">
                <!-- #ifdef H5 -->
                <view class="share_model_pre" @tap.stop="bbcShareBrower" v-if="isWeiXinBrower">
                    <image :src="imgUrl+'goods/wx_share.png'" mode=""></image>
                    <text>{{$L('微信好友')}}</text>
                </view>
                <!-- #endif -->
                <!-- #ifdef MP-WEIXIN -->
                <button open-type="share" class="share_model_pre">
                    <image :src="imgUrl+'goods/wx_share.png'" mode=""></image>
                    <text>{{$L('微信好友')}}</text>
                </button>
                <!-- #endif -->
                <!-- #ifdef APP-PLUS -->
                <view class="share_model_pre" @tap.stop="bbcShare(0,'WXSceneSession')">
                    <image :src="imgUrl+'goods/wx_share.png'" mode=""></image>
                    <text>{{$L('微信好友')}}</text>
                </view>
                <view class="share_model_pre" @tap.stop="bbcShare(0,'WXSenceTimeline')">
                    <image :src="imgUrl+'goods/wechat_moments.png'" mode=""></image>
                    <text>{{$L('微信朋友圈')}}</text>
                </view>
                <!-- #endif -->
            </view>
            <view class="share_model_close" @click="closeShareModel">
                <image :src="imgUrl+'common/icon/close_screen.png'" mode=""></image>
            </view>
        </view>
        <!-- 分享弹框 end -->

    </view>
</template>

<script>
// import recommendGoods from "@/components/goods/recommend.vue"
import thumbHistory from "@/components/goods/thumb/thumb-history.vue";
import loadingState from "@/components/loading/loading.vue";
import uniPopup from '@/components/uni-popup/uni-popup.vue'
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
import {
    mapState
} from 'vuex';
export default {
    components: {
        // recommendGoods,
        thumbHistory,
        loadingState,
        uniPopup,
        uniPopupDialog,
        uniNavBar
    },
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            historyList: [], //足迹列表
            hasMore: true, //是否还有数据
            pageSize: 10,
            current: 1,
            loadingState: 'first_loading',
            showEndFlag: true, //设置为false则不展示最后的加载完成提示
            settings:[], //配置信息
            topRightText:'清空',
            nav_left_icon: 'back', //底部tab进入的话为空，否则为back
            share_model:false, //分享弹框
            isWeiXinBrower:false,//是否微信浏览器
            showWeiXinBrowerTip:false,//微信浏览器分享的提示操作
            recommendLen:0, //推荐商品的length长度
            followId:'',
            startX:'',
            startY:'',
            is_show_btn:false //是否展示
        };
    },
    onLoad() {
        // this.getSettings();
        // #ifdef H5
        // this.isWeiXinBrower = this.$isWeiXinBrower();
        // #endif
        // 父页面接收子组件recommend——goods.vue传过来的值
        // uni.$on("recommendGoods",(options)=>{
        //     this.recommendLen = JSON.parse(options.recommendLen)
        // })
    },
    mounted(){
        this.getSettings();
        // #ifdef H5
        this.isWeiXinBrower = this.$isWeiXinBrower();
        // #endif
        // 父页面接收子组件recommend——goods.vue传过来的值
        uni.$on("recommendGoods",(options)=>{
            this.recommendLen = JSON.parse(options.recommendLen)
        })
    },
    onShow(){
        this.getList();
    },
    computed: {
        ...mapState(['userInfo'])
    },
    onShareAppMessage: function() {
        setTimeout(()=>{
            this.share_model=false;
        },1000);
            
        return {
            title: this.shareGoods.skuName,
            path: '/standard/product/detail?sku='+this.shareGoods.sku+'&spu='+this.shareGoods.spu,
            imageUrl: this.shareGoods.mainImage
        };
    },
    methods: {
        //浏览器分享
        bbcShareBrower() {
            this.showWeiXinBrowerTip = true;
            this.share_model = false;
            this.$weiXinBrowerShare(1,{
                title:this.shareGoods.skuName,
                desc:this.shareGoods.goodsBrief,
                link:this.shareGoods.shareLink,
                imgUrl:this.shareGoods.mainImage
            });
        },

        //分享 type：分享类型 0 图文 2图片，scene 场景 WXSceneSession：分享朋友  WXSenceTimeline：分享朋友圈
        bbcShare: function(type,scene) {
            let shareData = {};
            shareData.href = this.shareGoods.shareLink;
            shareData.title = this.shareGoods.skuName;
            shareData.summary = this.shareGoods.goodsBrief;
            shareData.imageUrl = this.shareGoods.mainImage;
            this.$weiXinAppShare(type,scene,shareData);
            this.closeShareModel();//关闭分享
        },
        //分享当前商品
        shareGoods1(shareGoods){
            this.shareGoods = shareGoods;
            this.share_model = true;
        },
        //关闭分享弹框
        closeShareModel(){
            this.share_model = false;
            this.showWeiXinBrowerTip = false;
        },
        //清空足迹
        clearHistory(){
            this.$refs.popup.open();
        },
        //获取足迹里的商品
        getList() {
            let params = {};
            params.url = 'v3/member/front/productLookLog/list';
            params.method = 'GET';
            params.data = {};
            params.data.pageSize = this.pageSize;
            params.data.current = this.current;
            this.loadingState = this.loadingState == 'first_loading' ? this.loadingState : 'loading';
            this.$request(params).then(res => {
                if (res.state == 200) {
                    if (this.current == 1) {
                        this.historyList = res.data.list;
                    } else {
                        this.historyList = this.historyList.concat(res.data.list);
                    }
                    this.hasMore = this.$checkPaginationHasMore(res.data.pagination); //是否还有数据
                    if (this.hasMore) {
                        this.current++;
                        this.loadingState = 'allow_loading_more';
                    } else {
                        this.loadingState = 'no_more_data';
                    }
                    if (this.historyList.length > 0){
                        this.topRightText = '清空'
                    } else {
                        this.topRightText = ''
                    }
                } else {
                    this.$api.msg(res.msg);
                }
            }).catch(() => {
                //异常处理
            })
        },
        //马上去逛逛事件
        goGoodsList() {
            this.$Router.push({path:'/standard/product/list',query:{showStoreTabs: false}})
        },
        //页面触底事件
        onReachBottom() {
            if (this.hasMore == false) {
                this.$refs.recomment_goods.getMoreData();
            } else {
                this.getList();
            }
        },
        //删除足迹
        delHistoryGoods(itemIndex, goodsIndex, id) {
            this.$request({
                url: 'v3/member/front/productLookLog/del',
                data: {
                    logIds: id
                },
                method: 'POST'
            }).then(res => {
                this.$api.msg(res.msg);
                if (res.state == 200) {
                    //更新页面数据
                    // this.historyList = []

                    if (this.current!=1){
                        this.current-=1
                    }
                    this.getList();
                    // if (this.historyList[itemIndex].productLookLogInfoList.length > 1) {
                    //     //只删除商品
                    //     this.historyList[itemIndex].productLookLogInfoList.splice(goodsIndex, 1);
                    // } else {
                    //     //商品商品和日期
                    //     this.historyList.splice(itemIndex, 1);
                    // }
                    // if (this.historyList.length == 4) {
                    //     this.getList();
                    // }
                }
            }).catch(() => {
                //异常处理
            })
        },
        //取消清空足迹
        cancleEmpty() {
            this.$refs.popup.close();
        },
        //确认清空足迹事件
        confirmEmpty() {
            this.$request({
                url: 'v3/member/front/productLookLog/empty',
                method: 'GET'
            }).then(res => {
                this.$api.msg(res.msg);
                if (res.state == 200) {
                    //更新页面数据
                    this.historyList = [];
                    this.topRightText = '';
                }
                this.cancleEmpty();
            }).catch(() => {
                //异常处理
            })
        },
        //获取配置信息接口
        getSettings(){
            this.$request({
                url: 'v3/system/front/setting/getSettings',
                data: {
                    names: 'basic_site_name,main_site_logo'
                },
                method: 'GET'
            }).then(res => {
                if (res.state == 200) {
                    //更新页面数据
                    this.settings = res.data || [];
                }
            }).catch((res) => {
                this.$api.msg(res.msg);
                //异常处理
            })
        },
        //返回上一页
        goBack(){
            this.$Router.back(1)
        },
        handleTouchStart(e){
            this.startX = e.touches[0].clientX;
            this.startY = e.touches[0].clientY;
        },
        handleTouchMove(e,followId){                
            // 获得当前坐标
            this.followId = followId
            this.currentX = e.touches[0].clientX;
            this.currentY = e.touches[0].clientY;
            const x = this.startX - this.currentX; //横向移动距离
            const y = Math.abs(this.startY - this.currentY); //纵向移动距离，若向左移动有点倾斜也可以接受
                
                
            if (y > 1) {
                e.preventDefault()
            }
                
            if (x > 5) {
                //向左滑显示
                this.is_show_btn = true
            } else if (x < 5) {
                //向右滑隐藏
                this.is_show_btn = false
            }
                
            if (y>150){
                this.is_show_btn = false
            }
        }
    }
}
</script>

<style lang='scss'>
    page {
        width: 750rpx;
        margin: 0 auto;
    }
    .container{
        background: $bg-color-split;

    }
    .clear_history{
        background: #FFFFFF;
        padding: 30rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .clear_history_text{
            display: flex;
            align-items: center;
            image{
                width: 32rpx;
                height: 32rpx;
                margin-right: 10rpx;
            }
            text{
                font-size: 28rpx;
            }
        }
        .clear_history_btn{
            font-size: 28rpx;
        }
    }

    .empty_part {
        display: flex;
        flex: 1;
        width: 100%;
        height: 100%;
        background: #fff;

        .img {
            width: 256rpx;
            height: 256rpx;
            background: var(--emptyImg);
            background-size: 100% 100%;
        }

        .tip_con {
            color: $main-third-color;
            font-size: 28rpx;
        }

        .ope_btn {
            color: $main-color;
            font-size: 28rpx;
            padding: 0 25rpx;
            height: 54rpx;
            background: rgba(252, 28, 28, .1);
            border-radius: 27rpx;
            margin-top: 20rpx;
        }
    }
    .empty_part_FF{
        padding-top: calc((100vh - var(--titleBarFillHeight, 0px))*0.32 - 128rpx - 88rpx);

    }

    .goods_list {
        .history_item {
            border-top: 20rpx solid $bg-color-split;
            background: #fff;
            overflow: hidden;
            .time_tag {
                margin: 20rpx 0;
                /* width: 137rpx; */
                padding: 5rpx 10rpx;
                height: 40rpx;
                background: rgba(252, 28, 28, .05);
                border-radius: 0 20rpx 20rpx 0;
                color: $main-color;
                font-size: 28rpx;
                line-height: 40rpx;
            }
        }

    }
    /* 分享弹框 start */
    .share_model{
        width:750rpx;
        height:100%;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        margin: 0 auto;
        background: rgba(0,0,0,0.6);
        z-index: 100;
    }
    .share_model_list{
        display: flex;
        justify-content: space-around;
        padding: 0 50rpx;
        box-sizing: border-box;
        position: fixed;
        bottom: 150rpx;
        z-index: 110;
        width: 750rpx;
        .share_model_pre{
            display: flex;
            flex-direction: column;
            align-items: center;
            background: transparent;
            border-radius: 0;
            height: auto;
            line-height: auto;
            &::after{
                border-width: 0;
            }
            image{
                width: 105rpx;
                height: 105rpx;
            }
            text{
                font-size: 24rpx;
                
                font-weight: 500;
                color: #FFFFFF;
                line-height: 36rpx;
                margin-top: 30rpx;
            }
        }
    }
    .share_model_close{
        width: 46rpx;
        height: 46rpx;
        bottom: 60rpx;
        position: fixed;
        z-index: 110;
        left: 0;
        right: 0;
        margin: 0 auto;
        image{
            width: 46rpx;
            height: 46rpx;
        }
    }
    button{
        padding: 0;
        margin: 0;
    }
    /* 分享弹框 end */
    uni-page-body {
        display: flex;
        height: 100%;
    }
</style>
