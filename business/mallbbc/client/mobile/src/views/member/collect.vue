<!-- 我的收藏页面 -->
<template>
    <view class="container" :class="{container_FF: recommendLen == 0 && collectList.length == 0}" ref="container">
        <uni-nav-bar
            v-if="collectList && collectList.length > 0"
            fixed='true'
            color='#333'
            left-icon=""
            right-text=""
            :title="$L('')"
        >
            <template slot="right">
                <view @click="manageCollectGoods">
                    <text class="manageTxt">{{manageCollectText}}</text>
                </view>
            </template>
        </uni-nav-bar>

        <!-- 空白页 start-->
        <view v-if="!collectList.length&&loadingState != 'first_loading'" class="flex_column_start_center empty_part"
            :class="{empty_part_FF:recommendLen == 0 && collectList.length == 0}">
            <view class="img"></view>
            <text class="tip_con">{{$L('暂无收藏的商品哦')}}~</text>
            <view class="ope_btn flex_row_center_center" @click="goGoodsList()">
                {{$L('马上去逛逛')}}
            </view>
        </view>
        <!-- 空白页 end-->

        <!-- 收藏的商品 start-->
        <view v-if='collectList.length' class="goods_list flex_column_start_start">
            <view v-for="item in collectList" :key='item.sku'>
                <swiper-action
                    @cellOpen="followId = item.sku"
                    @cellMoving="cellMoving => isCellMoving = cellMoving"
                    :cellShow="followId === item.sku"
                >
                    <thumbCollect 
                    :ref="`thumbCollect_${item.sku}`"
                    :goods_info="item" :isGoDetail="!isCellMoving" :editShowState="editShowState" @collectSelectedId="collectSelectedId"
                    @cancelSelectedId="cancelSelectedId" />
                    
                    <template slot="right">
                        <view class="goodsDelBtn" @click.stop="singleDelCollectionGood(item)">
                            <view class="flex_column_center_center ">
                                <view class="img"></view>
                                <view class="del">{{$L('删除')}}</view>
                            </view>
                        </view>
                    </template>
                </swiper-action>
            </view>
        </view>

        <loadingState v-if="loadingState != 'first_loading' && collectList.length > 0" :state='loadingState' 
            :style="{paddingBottom: !editShowState ? 'var(--safe-area-inset-bottom)' : 'calc(120rpx + var(--safe-area-inset-bottom))'}"/>
        <!-- 收藏的商品 end-->

        <!-- 推荐商品 start-->
        <!-- <view v-show='!hasMore'>
            <recommendGoods ref='recomment_goods' />
        </view> -->
        <!-- 推荐商品 end-->

        <!-- 微信浏览器分享提示  start-->
        <view class="wx_brower_share_mask" v-if="showWeiXinBrowerTip">
            <view class="wx_brower_share_top_wrap">
                <image :src="imgUrl+'goods/wx_share_tip.png'" mode="widthFix" @tap="closeShareModel"
                    class="wx_brower_share_img"></image>
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

        <!-- 管理收藏工具栏 -->
        <view class="action-section flex_row_between_center" :style="{bottom:editShowState?'0rpx':'calc(-120rpx - var(--safe-area-inset-bottom)'}" >
                <view class="checkbox flex_row_start_center" @click="selectedHandle">
                    <text :class="[allSelectedStyle]"></text>
                    <text class="check_all_tit">{{$L('全选')}}</text>
                </view>
                <!-- 点击管理之后的样式 start -->
                <template>
                    <view class="flex_row_end_center">
                        <view class="move_collect flex_row_center_center" @click="addToCart"
                            v-if="true">{{$L('加入购物车')}}</view>
                        <view class="del_more flex_row_center_center" @click="batchDelete()">{{$L('删除所选')}}</view>
                    </view>
                </template>
                <!-- 点击管理之后的样式 end -->
            </view>

    </view>
</template>

<script>
// import recommendGoods from "@/components/goods/recommend.vue"
import thumbCollect from "@/components/goods/thumb/thumb-collect.vue";
import loadingState from "@/components/loading/loading.vue";
import swiperAction from '@/components/swiper-action'
import personalHandler from "@/components/personal/handler";
import {
    mapState
} from 'vuex';
import cartHandler from '../../components/cart/handler.js';
import { reachScrollBottom, ifIphoneSeries } from '@/utils/common.js'

export default {
    components: {
        // recommendGoods,
        thumbCollect,
        loadingState,
        swiperAction
    },
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            collectList: [], //收藏列表
            hasMore: true, //是否还有数据
            pageSize: 10,
            current: 1,
            loadingState: 'first_loading',
            share_model: false, //分享弹框
            isWeiXinBrower: false, //是否微信浏览器
            showWeiXinBrowerTip: false, //微信浏览器分享的提示操作
            recommendLen: 0, //推荐商品的length长度
            followId: '',
            isCellMoving: false,
            manageCollectText: '管理', // 管理收藏商品文本
            editShowState: false, // 编辑选择器展示状态
            selectedId: [], // 选中编号
            ifSelectedAll: false, // 是否全选
            deleteCollectionParams:[], // 删除收藏商品参数集合（用作传参）
            ifRequestFinished:true // 是否请求完毕
        };
    },

    mounted(){
        this.current = 1;
        this.loadingState = 'first_loading';
        this.getList();
        // #ifdef H5
        this.isWeiXinBrower = this.$isWeiXinBrower();
        // #endif
        // 父页面接收子组件recommend——goods.vue传过来的值
        uni.$on("recommendGoods", (options) => {
            this.recommendLen = JSON.parse(options.recommendLen)
        })
        // 兼容iphone6/iphone6 plus无法触发触底的问题
        const ifIphone6 = ifIphoneSeries('iphone6');
        const ifIphone6Plus = ifIphoneSeries('iphone6Plus');
        
        if (ifIphone6 || ifIphone6Plus){
            const scrollDom = document.querySelector('uni-page-body');
            scrollDom.style.cssText = 'height: 100%;overflow-y: auto;'
            
            scrollDom.addEventListener('scroll',()=>{
                const ifReachBottom = reachScrollBottom(scrollDom);        
                if (ifReachBottom && this.hasMore && this.ifRequestFinished ){
                    this.getList();
                }          
            })
        }

    },
    computed: {
        ...mapState(['userInfo', 'userCenterData']),
        // 全选/取消全选
        allSelectedStyle(){
            return this.ifSelectedAll 
                ?'item_check iconfont icon_checked_radio'
                : 'iconfont icon_check_radio';
        }
    },
    onShareAppMessage: function() {
        return {
            title: this.shareGoods.goodsName,
            path: '/standard/product/detail?sku=' + this.shareGoods.sku,
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
            this.$weiXinAppShare(type, scene, shareData);
            this.closeShareModel(); //关闭分享
        },
        //分享当前商品
        shareGoods1(shareGoods) {
            this.shareGoods = shareGoods;
            this.share_model = true;
        },
        //关闭分享弹框
        closeShareModel() {
            this.share_model = false;
            this.showWeiXinBrowerTip = false;
        },
        //获取收藏的商品
        getList() {
            this.ifRequestFinished = false;
            if (this.loadingState == 'first_loading'){
                uni.showLoading();
            }
            let params = {};
            params.url = 'v3/member/front/followProduct/list';
            params.method = 'GET';
            params.data = {};
            params.data.pageSize = this.pageSize;
            params.data.current = this.current;
            this.loadingState = this.loadingState == 'first_loading' ? this.loadingState : 'loading';
            this.$request(params).then(res => {
                uni.hideLoading();
                if (res.state == 200) {
                    if (this.current == 1) {
                        this.collectList = res.data.list;
                        
                    } else {
                        this.collectList = this.collectList.concat(res.data.list);
                    }
                  
                    this.hasMore = this.$checkPaginationHasMore(res.data.pagination); //是否还有数据
                    if (this.hasMore) {
                        this.current++;
                        this.loadingState = 'allow_loading_more';
                    } else {
                        this.loadingState = 'no_more_data';
                    }
                } else {
                    this.$api.msg(res.msg);
                }
                this.ifRequestFinished = true;
            })
        },
        //马上去逛逛事件
        goGoodsList() {
            this.$Router.push({path:'/standard/product/list',query:{showStoreTabs: false}})
        },
        //页面触底事件(目前iphone6系列不支持触发)
        onReachBottom() {
            this.hasMore && this.ifRequestFinished && this.getList();
        },
        // 单独删除收藏商品
        singleDelCollectionGood(goodInfo){
            const deleteGood = this.resetData(goodInfo);
            this.delCollectGoods('singleDelete',deleteGood);
        },
        /*
         * 组装商品数据
         * data: 需要重装的数据
         * return: 返回重装之后的数据
         */
        resetData(data){
            const {categoryId3,mainImage,sku,skuName,skuPrice,spu,storeId,storeName,supplierType,valid} = data;
            return { categoryId3:categoryId3 || "",mainImage,sku,skuName,skuPrice,spu,storeId,storeName,supplierType,valid };
        },
        /*
         * 批量操作：装填要删除的收藏商品
         * collectionList：商品数据的原始对象集合
         * delType：批量操作的类型，batchMore（批量多个），batchSingle（批量单个）
         */
        handleCollectGoods(collectionList,delType){
            if (delType === 'batchMore'){
                this.deleteCollectionParams = collectionList.map(item=>{
                    return this.resetData(item);
                });
            } else {
                this.deleteCollectionParams.push(this.resetData(collectionList[0]));
                if (this.deleteCollectionParams.length === this.collectList.length){
                    this.ifSelectedAll = true;
                }
            }
        },
        //取消收藏
        delCollectGoods(deleteType,deleteData) {
            let params = {
                isCollect: false,
                memberFollowProductList: this.deleteCollectionParams 
            };
            // 若单独删除，则重新装填删除对象
            if (deleteType === 'singleDelete' && deleteData){
                params.memberFollowProductList = [deleteData];
            }
            
            personalHandler.editFollowProduct(params).then(res => {
                if (res.state == 200) {

                    let collectListBak = JSON.parse(JSON.stringify(this.collectList));
                    params.memberFollowProductList.forEach(deleteItem=>{
                        let positionIndex;
                        // eslint-disable-next-line array-callback-return
                        let checkResult = collectListBak.some((item,index)=>{
                            if (item.sku === deleteItem.sku){
                                positionIndex = index;
                                return true;
                            }
                        });
                        
                        if (checkResult){
                            collectListBak.splice(positionIndex,1);
                        }
                    });
                    
                    // 重新显示收藏列表
                    this.collectList = collectListBak;

                    // 如果抽藏列表为空，则取消全选勾选,底部编辑栏隐藏
                    if (this.collectList.length === 0 && this.ifSelectedAll){
                        this.ifSelectedAll = false;
                        this.editShowState = false;
                    }
                    
                    // 清空删除收藏商品的对象集合
                    if (deleteType !== 'singleDelete'){
                        this.deleteCollectionParams = []; 
                    } else {
                        this.$nextTick(()=>{
                            // 如果单独删除，删除之后还需判断剩余商品是否都为选中状态，改变全选按钮状态
                            const checkResult = this.checkSurplusGoodsSeletedStatus();
                            if (checkResult){
                                this.ifSelectedAll = true;
                            }
                        })
                    }
                    
                    
                    this.$api.msg('删除成功');
                } else {
                    this.$api.msg('删除失败');
                    this.followId = ''
                }
            })
        },
        /*
         * 切换管理类型
         */
        manageCollectGoods(){
            this.editShowState = this.manageCollectText === '管理'? true : false;
            this.manageCollectText = this.manageCollectText === '管理'? '完成' : '管理';
            if (!this.editShowState){
                this.ifSelectedAll = false;
                this.batchSwitchSelectedState();
                this.deleteCollectionParams = [];
            }
        },
        /*
         * 选中商品
         * id:商品sku
         */
        collectSelectedId(goodInfo){
            // if (goodInfo.supplierType !== 'JD' || !goodInfo.supplierType){
            //     this.addCartShowFriendlyTips();
            // }
            this.handleCollectGoods([goodInfo],'batchSingle');
        },
        /*
         * 取消选中
         * id:商品sku
         */
        cancelSelectedId(goodInfo){
            let arrayIndex;
            // eslint-disable-next-line array-callback-return
            const result = this.deleteCollectionParams.some((item,index) =>{
                if (item.sku === goodInfo.sku){
                    arrayIndex = index;
                    return true;
                }
            });
            if (result){
                this.deleteCollectionParams.splice(arrayIndex,1);
            }
            if (this.ifSelectedAll){
                this.ifSelectedAll = false;
            }
        },
        // 加入到购物车
        addToCart(){
            if (this.deleteCollectionParams.length === 0){
                uni.showToast({
                    title:'请先选择商品哦~',
                    icon:'none'
                });
                return;
            }
            // 检查是否存在非京东企业购的商品（联盟以后要去掉，提示暂时）
            // const checkResult = this.deleteCollectionParams.some(item => item.supplierType !== 'JD');
            // if (checkResult){
            //     this.$api.msg('非京东企业购平台的商品无法加入购物车哦~');
            //     return;
            // }

            // 检查是否存在非京东企业购的商品（联盟以后要去掉，提示暂时）
            // this.deleteCollectionParams.some(item => !item.valid) && this.$api.msg('失效的商品无法加入购物车');

            uni.showLoading();
            
            // filter(item=>item.valid)
            const newList = this.deleteCollectionParams.map(item =>{
                return { number: 1,sku: item.sku,storeId: item.storeId};     
            });
            let param = {
                cartInfoList:newList,
                addressId: this.$getStorageSync('addressId'),
                isCollectionToCart:true
            }
            cartHandler.addCarts(param).then(res=>{
                uni.hideLoading();
                if (res.state == 200){
                    this.$store.dispatch('getCartNum'); //更新购物车商品数量
                    this.$api.msg('加购成功');
                } else {
                    this.$api.msg(res.msg);
                }
            })
        },
        // 删除所选
        batchDelete(){
            // console.log('this.deleteCollectionParams',this.deleteCollectionParams);
            if (this.deleteCollectionParams.length === 0){
                uni.showToast({
                    title:'请先选择商品哦~',
                    icon:'none'
                });
                return;
            }
            this.delCollectGoods(this.deleteCollectionParams);
        },
        // 全选/取消全选
        selectedHandle(){
            this.ifSelectedAll = !this.ifSelectedAll;

            // 清空选中项（防止全选时重复）
            this.selectedId = [];
            this.deleteCollectionParams = [];
            // console.log('thumbCollect',this.$refs);
            
            // 批量切换商品组件选中状态
            this.batchSwitchSelectedState();
            
            // 组装需要删除的收藏商品
            if (this.ifSelectedAll){
                this.handleCollectGoods(this.collectList,'batchMore');
                // 全选时如果有非京东企业购商品则提示
                // let checkResult = this.collectList.some(item =>{
                //     return item.supplierType !== 'JD';
                // })
                // checkResult && this.addCartShowFriendlyTips();
            }
        },
        // 批量切换商品组件选中状态
        batchSwitchSelectedState(){
            for (const key in this.$refs) {
                if (key.includes('thumbCollect_') && this.$refs[key].length > 0) {
                    this.$refs[key][0].editFlag = this.ifSelectedAll;
                }
            }
        },
        /*
         * 添加购物车提示（添加购物车时会过滤非京东企业购平台商品）
         */
        addCartShowFriendlyTips(){
            uni.showToast({
                title:'非京东企业购平台的商品无法加入购物车哦~',
                icon:'none',
                duration: 2000
            });
            
        },
        /*
         * 检查剩余商品是否都为选中状态
         */
        checkSurplusGoodsSeletedStatus(){
            let result = true;
            for (const key in this.$refs) {
                if (key.includes('thumbCollect_') && this.$refs[key].length > 0) {
                    
                    if (!this.$refs[key][0].editFlag){
                        result = false;
                    }
                }
            }
            return result;
        }

    },
    watch:{
        'collectList.length':{
            handler(val){
                // 如果分页加载新的数据了，并且处于全选状态，则勾选新加载的商品
                if (this.ifSelectedAll && val > 0){
                    this.$nextTick(()=>{
                        this.batchSwitchSelectedState();
                        this.handleCollectGoods(this.collectList,'batchMore');
                    })
                }
                
            }
        }
    }
}
</script>

<style lang='scss' scoped>
    page {
        width: 750rpx;
        margin: 0 auto;
        // background-color: #f5f5f5;
    }

    .container {
        background: $bg-color-split;
    }

    .empty_part {
        display: flex;
        flex: 1;
        width: 100%;
        height: 100%;

        .img {
            width: 256rpx;
            height: 256rpx;
            background: var(--collectEmptyImg);
            background-size: 100% 100%;
        }

        .tip_con {
            color: $main-third-color;
            font-size: 28rpx;
        }

        .ope_btn {
            color: var(--buyNowColor);
            font-size: 28rpx;
            padding: 0 25rpx;
            height: 54rpx;
            background: var(--confirmBtnBgColor2);
            border-radius: 27rpx;
            margin-top: 20rpx;
        }
    }

    .empty_part_FF {
        height: auto;
        padding-top: calc((100vh - var(--titleBarFillHeight, 0px)) * 0.32 - 128rpx);

    }

    .goods_list {
        border-top: 20rpx solid $bg-color-split;
        width: 750rpx;
        overflow-x: hidden;
        padding:0 20rpx 20rpx;
    }

    /* 分享弹框 start */
    .share_model {
        width: 750rpx;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        margin: 0 auto;
        background: rgba(0, 0, 0, 0.6);
        z-index: 100;
    }

    .share_model_list {
        display: flex;
        justify-content: space-around;
        padding: 0 50rpx;
        box-sizing: border-box;
        position: fixed;
        bottom: 150rpx;
        z-index: 110;
        width: 750rpx;

        .share_model_pre {
            display: flex;
            flex-direction: column;
            align-items: center;
            background: transparent;
            border-radius: 0;
            height: auto;
            line-height: auto;

            &::after {
                border-width: 0;
            }

            image {
                width: 105rpx;
                height: 105rpx;
            }

            text {
                font-size: 24rpx;
                
                font-weight: 500;
                color: #FFFFFF;
                line-height: 36rpx;
                margin-top: 30rpx;
            }
        }
    }

    .share_model_close {
        width: 46rpx;
        height: 46rpx;
        bottom: 60rpx;
        position: fixed;
        z-index: 110;
        left: 0;
        right: 0;
        margin: 0 auto;

        image {
            width: 46rpx;
            height: 46rpx;
        }
    }

    button {
        padding: 0;
        margin: 0;
    }

    /* 分享弹框 end */

    .goodsDelBtn {
        width: 160rpx;
        height: 100%;
        background-color: var(--confirmBtnBgColor2);
        color: var(--confirmBtnTextColor);
        font-size: 28rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        .img {
            width: 30rpx;
            height: 30rpx;
            margin-bottom: 18rpx;
            background: var(--deleteBtnIcon);
            background-size: 100% 100%;
        }
       
    }

    ::v-deep .uni-navbar__header-btns {
        width: 328rpx;
        justify-content: flex-end;
    }

    ::v-deep .swiper-cell {
        border-radius: 16rpx;
        margin-bottom: 20rpx;
    }

    .pkTxt {
        font-weight: 600;
        color: #333333;
        font-size: 28rpx;
        position: relative;
        padding-right: 48rpx;

        &::after {
            content: '';
            position: absolute;
            width: 36rpx;
            height: 36rpx;
            top: 50%;
            transform: translateY(-50%);
            right: 2rpx;
            background: url('@/static/shared/compare/btn_common_VS.png');
            background-size: 100% 100%;
        }
    }

    .manageTxt {
        margin-left: 48rpx;
        font-size: 28rpx;
        color: #333333;
        font-weight: 600;
        cursor: pointer;
    }

    /* 底部栏 */
    .action-section {
        width: 750rpx;
        margin: 0 auto;
        /* #ifdef H5 */
        // margin-bottom: calc(var(--safe-area-inset-bottom) + 90rpx);
        // /* #endif */
        position: fixed;
        left: 0rpx;
        right: 0;
        z-index: 95;
        display: flex;
        align-items: center;
        height: calc(120rpx + var(--safe-area-inset-bottom));
        padding: 0 20rpx var(--safe-area-inset-bottom);
        background: #fff;
        box-shadow: 0px 0px 10px 0px rgba(153, 153, 153, 0.1);
        transition: bottom .2s ease .1s;

        .checkbox {
            .iconfont {
                color: #BBBBBB;
                font-size: 32rpx;
                margin-right: 10rpx;
            }

            .item_check {
                color: var(--radioCheckedColor);
            }

            .check_all_tit {
                color: #949494;
                font-size: 26rpx;
            }
        }

        .move_collect {
            min-width: 180rpx;
            height: 60rpx;
            background: #FFFFFF;
            border: 1px solid var(--collectBtn);
            border-radius: 30rpx;
            font-size: 28rpx;
            
            font-weight: 500;
            color: var(--collectBtn);
            line-height: 60rpx;
            padding: 0 10rpx;
            
        }

        .del_more {
            width: 180rpx;
            height: 60rpx;
            border: 1rpx solid var(--tagColor);
            border-radius: 30rpx;
            font-size: 28rpx;
            
            font-weight: 500;
            color: var(--tagColor);
            line-height: 60rpx;
            margin-left: 20rpx;
        }
    }
</style>
