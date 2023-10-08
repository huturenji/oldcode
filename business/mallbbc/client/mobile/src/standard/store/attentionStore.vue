<template>
    <view class="container">
        <view v-if="isShow == true">
            <view class="special_care_wrap" v-if="!is_show_empty && storeList.length>0">
                <view class="shop_content"  v-for="(item,index) in storeList" :key="index">
                    <view class="shop_tips" v-if="(storeData.topNumber > 0 && index == 0) || (storeData.topNumber == 0 && index == 0) || (storeData.topNumber > 0 && index == storeData.topNumber)">
                        <!-- 特别关注 -->
                        <image :src="imgUrl+'goods/special_focus.png'" mode="" class="attention_icon" v-if="storeData.topNumber > 0 && index == 0"></image>
                        <!-- 普通关注 -->
                        <image :src="imgUrl+'goods/common_concern.png'" mode="" class="attention_icon" v-if="(storeData.topNumber == 0 && index == 0) || (storeData.topNumber > 0 && index == storeData.topNumber)"></image>
                    </view>
                    <view class="shop_item special_care" @touchstart="touchStart($event,item.storeId)" @touchmove="touchMove($event,item.storeId)"  :style="{left:is_show_btn && item.storeId == storeId?'-160rpx':'0'}"
                    :class="{shop_item_nogoods:item.goodsList.length == 0}"
                    >
                        <view class="shop_detail_wrap">
                            <!-- <coverImage :src="item.storeLogo" width="80" height="80" class="shop_img"></coverImage> -->
                            <view class="shop_img" :style="'background-image:url('+item.storeLogo+')'"></view>
                            <view class="shop_info">
                                <view class="shop_name">{{item.storeName}}</view>
                                <view class="attention_num">
                                    <image :src="imgUrl+'goods/self_support.png'" mode="" class="self_support_icon" v-if="item.isOwnStore == 1"></image>
                                    <text class="attention_text">{{$L('关注')}}{{item.followNumber}}</text>
                                </view>
                            </view>
                        </view>
                        <view class="shop_img_wrap">
                            <template v-for="(goodsItem,goodsIndex) in item.goodsList">
                                <view class="shop_goods_box"  :key="goodsIndex" v-if="goodsIndex < 3" @click="toGoodsDetail(goodsItem.defaultProductId,goodsItem.spu)">
                                    <!-- <image :src="goodsItem.mainImage" mode="heightFix" class="shop_goods_pic"></image> -->
                                    <!-- <coverImage :src="goodsItem.mainImage" class="shop_goods_pic"></coverImage> -->
                                    <view class="shop_goods_pic" :style="'background-image:url('+goodsItem.mainImage+')'"></view>
                                    <view class="shop_goods_price">
                                        <text class="small_price">￥</text><text class="big_price">{{$getPartNumber(goodsItem.goodsPrice,'int')}}</text><text class="small_price">{{$getPartNumber(goodsItem.goodsPrice,'decimal')}}</text>
                                    </view>
                                </view>
                            </template>
                        </view>

                        <view class="operate_btn_wrap" :class="{operate_btn_wrap_nogoods:item.goodsList == 0}"
                        >
                            <view class="special_focus_btn operate_btn" @click="setSpecialFocus(item.followId,item.isTop)" v-if="item.isTop == 0" :style="{height:item.goodsList.length == 0?'81rpx':'162rpx'}">
                                <view class="">{{$L('设为')}}</view>
                                <view class="">{{$L('特别关注')}}</view>
                            </view>
                            <view class="cancel_focus_btn operate_btn cancel_special_focus_btn" @click="cancelFocus(item.followId,item.isTop,'special')" v-if="item.isTop == 1" :style="{height:item.goodsList.length == 0?'81rpx':'162rpx',background:'#FF9518'}">
                                <view class="">{{$L('取消')}}</view>
                                <view class="">{{$L('特别关注')}}</view>
                            </view>
                            <view class="cancel_focus_btn operate_btn" @click="cancelFocus(item.storeId,item.isTop)" :style="{height:item.goodsList.length == 0?'81rpx':'162rpx'}">取消关注</view>
                        </view>
                    </view>
                </view>
            </view>
            <!-- 无关注店铺列表空页面 -->
            <view class="empty_page" v-if="is_show_empty && storeList.length == 0">
                <view class="empty_img"></view>
                <view class="empty_text">{{$L('暂无关注')}}</view>
            </view>
            <!-- 暂时屏蔽掉推荐商品列表 屏蔽日期:2022-9-22-->
            <!-- <recommendGoods ref='recomment_goods' v-if="is_show_empty"/> -->
            <loadingState :state='loadingState' v-if="recommendLen == 0"/>
        </view>
    </view>
</template>

<script>
import loadingState from "@/components/loading/loading.vue";
// import recommendGoods from "@/components/goods/recommend.vue"
export default {
    data(){
        return {
            is_show_btn:false, //是否展示右侧操作按钮
            startX:'',
            startY:'',
            is_show_empty:false, //是否展示空页面
            storeId:'',
            imgUrl:getApp().globalData.imgUrl,
            isShow:true,
            loadingState: 'first_loading',
            pageSize: 10,
            current: 1,
            loading: false,//是否加载数据
            hasMore: true,//是否还有数据
            storeList:[], //关注店铺列表
            storeData:{}, //店铺数据
            recommendLen:0 //推荐商品总数
        }
    },
    components:{
        loadingState
        // recommendGoods
    },
    mounted(){
        this.getStoreList();
        // 父页面接收子组件recommend——goods.vue传过来的值
        uni.$on("recommendGoods",(options)=>{
            this.recommendLen = JSON.parse(options.recommendLen)
        })
    },
    onLoad(){
        // this.getStoreList();
        // // 父页面接收子组件recommend——goods.vue传过来的值
        // uni.$on("recommendGoods",(options)=>{
        // this.recommendLen = JSON.parse(options.recommendLen)
        // })
    },
    onShow(){
        this.recommendLen=0;
        this.getStoreList();
    },
    onHide() {
        this.storeId = -1
    },
    onReachBottom(){
        if (this.is_show_empty){
            this.$refs.recomment_goods.getMoreData();
        } else if (this.hasMore){
            this.getStoreList();
        }
    },
    methods:{
        getStoreList(){
            let param = {}
            param.url = 'v3/member/front/followStore/list?pageSize='+this.pageSize+'&current='+this.current
            param.method = 'GET'
            this.loadingState = this.loadingState == 'first_loading'?this.loadingState:'loading';
            this.$request(param).then(res=>{
                if (res.state == 200){
                    if (this.current == 1){
                        this.storeData = res.data;
                        this.storeList = res.data.storeList;
                    } else {
                        this.storeData = res.data;
                        this.storeList = this.storeList.concat(res.data.storeList);
                    }
                    this.hasMore = this.$checkPaginationHasMore(res.data.pagination)
                    if (this.hasMore){
                        this.current++;
                        this.loadingState = 'allow_loading_more'
                    } else {
                        this.loadingState = 'no_more_data';
                    }
                    if (this.storeList.length == 0){
                        this.is_show_empty = true;
                    } else {
                        this.is_show_empty = false;
                    }
                }
                this.loading = false
            })
        },
        touchStart(e){
            this.startX = e.touches[0].clientX;
            this.startY = e.touches[0].clientY;
        },
        touchMove(e,storeId){
            this.storeId = storeId
            // 获得当前坐标
            this.currentX = e.touches[0].clientX;
            this.currentY = e.touches[0].clientY;
            const x = this.startX - this.currentX; //横向移动距离
            const y = Math.abs(this.startY - this.currentY); //纵向移动距离，若向左移动有点倾斜也可以接受
            
            if (x > 5) {
                //向左滑显示
                e.preventDefault()
                this.is_show_btn = true
            } else if (x < 5) {
                //向右滑隐藏
                this.is_show_btn = false
            }
            
            if (y>150){
                this.is_show_btn = false
            }
        },
        // 设为特别关注
        setSpecialFocus(followId){
            let param = {}
            param.url = 'v3/member/front/followStore/editSpecial'
            param.method = 'POST'
            param.data = {
                followId:followId,
                isTop:1
            }
            this.$request(param).then(res=>{
                if (res.state == 200){
                    this.storeId = -1
                    this.is_show_btn = false
                    uni.showToast({
                        title:'特别关注成功！'
                    })
                    setTimeout(()=>{
                        this.getStoreList()
                        this.storeId = ''
                        this.isShow = false
                        this.isShow = true
                    },1500)
                }
            })
        },
        // 取消关注
        cancelFocus(followId,isTop,type){
            let param = {}
            param.data = {}
            if (type != 'special'){ //普通取消关注
                param.url = 'v3/member/front/followStore/edit'
                param.data.isCollect = false
                param.data.storeIds = followId
            } else { //取消特别关注
                param.url = 'v3/member/front/followStore/editSpecial'
                param.data.followId = followId
                param.data.isTop = 0
            }
            param.method = 'POST'
            this.$request(param).then(res=>{
                if (res.state == 200){
                    this.storeId = -1
                    this.is_show_btn = false
                    uni.showToast({
                        title:'取消关注成功！'
                    })
                    setTimeout(()=>{
                        this.getStoreList()
                        this.storeId = ''
                        this.isShow = false
                        this.isShow = true
                    },1500)
                }
            })
        },
        
        toGoodsDetail(sku,spu){
            this.$Router.push({path:'/standard/product/detail',query:{sku,spu}})
        }
    }
}
</script>

<style lang="scss">
page{
    background-color: $bg-color-split;
}
::-webkit-scrollbar{
  display: none;
}
.container{
    width:750rpx;
    box-sizing: border-box;
    overflow: hidden;
    margin: 0 auto;
    .special_care_wrap,.common_care_wrap{
        width: 100%;
        border-radius: 15rpx;
        padding: 20rpx;
        overflow: hidden;
        .shop_content{
            background: #FFFFFF;
            overflow: hidden;
            .shop_tips{
                padding-top: 30rpx;
                margin-top: 20rpx;
                .attention_icon{
                    width:137rpx;
                    height:40rpx;
                }
            }
        }
        .shop_item{
            position: relative;
            border-bottom: 1rpx solid #F2F2F2;
            transition: all 0.3s;
            background: #FFFFFF;
            padding-top: 30rpx;
            &.shop_item_nogoods{
                height: 202rpx;
            }
            .shop_detail_wrap{
                display: flex;
                width:100%;
                height:80rpx;
                padding:0 20rpx;
                box-sizing: border-box;
                position:relative;
                margin-bottom:30rpx;
                .shop_img{
                    background-position: center center;
                    background-repeat: no-repeat;
                    background-size: cover;
                    width:80rpx;
                    height: 80rpx;
                    margin-right:20rpx;
                    border-radius: 50%;
                    background-color: #f8f8f8;
                }
                .shop_info{
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    .shop_name{
                        width:330rpx;
                        font-size:30rpx;
                        color:#2d2d2d;
                        font-weight: bold;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                    }
                    .attention_num{
                        display: flex;
                        align-items: center;
                        .self_support_icon{
                            width:50rpx;
                            height:24rpx;
                            margin-right:10rpx;
                        }
                        .attention_text{
                            font-size:24rpx;
                            color:#999;
                        }
                    }
                }
                .shop_more_icon{
                    width:6rpx;
                    height:30rpx;
                    position: absolute;
                    right:20rpx;
                    top:0;
                }
            }
            .shop_img_wrap{
                padding:0 20rpx 20rpx 20rpx;
                display: flex;
                .shop_goods_box{
                    width: 216rpx;
                    height: 216rpx;
                    border-radius: 10rpx;
                    position:relative;
                    margin-right:10rpx;
                    .shop_goods_pic{
                        background-position: center center;
                        background-repeat: no-repeat;
                        background-size: cover;
                        width: 216rpx;
                        height: 216rpx;
                        background-color: #f8f8f8;
                        border-radius: 10rpx;
                    }
                    .shop_goods_price{
                        width: 216rpx;
                        height:36rpx;
                        color:#fff;
                        text-align: center;
                        line-height: 36rpx;
                        position:absolute;
                        bottom:0;
                        left:0;
                        background-color: rgba(0,0,0,0.3);
                        border-radius: 0 0 10rpx 10rpx;
                        display: inline-block;
                        .small_price{
                            font-size:20rpx;
                        }
                        .big_price{
                            font-size: 24rpx;
                        }
                    }
                }
            }
            .shop_img_wrap>view:last-child{
                margin-right: 0;
            }
            .operate_btn_wrap{
                position:absolute;
                top: 0;
                width:160rpx;
                height: 374rpx;
                right: -160rpx;
                display: flex;
                flex-direction: column;
                justify-content: center;
                border-bottom: 1rpx solid #F2F2F2;
                background: #FFFFFF;
                &.operate_btn_wrap_nogoods{
                    height: 202rpx;
                }
                .operate_btn{
                    width:160rpx;
                    height:162rpx;
                    font-size:28rpx;
                    color:#fff;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding:0 24rpx;
                    box-sizing: border-box;
                    transition: all 0.3s;
                }
                .special_focus_btn{
                    background-color: #FF9518 !important;
                    flex-direction: column !important;
                }
                .cancel_focus_btn{
                    background-color: #FF0D24;
                }
            }
        }
    }
}
.empty_page{
    width:750rpx;
    height:543rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top:120rpx;
    .empty_img{
        width:210rpx;
        height:210rpx;
        margin-bottom:24rpx;
        background: var(--emptyImg);
        background-size: 100% 100%;
    }
    .empty_text{
        font-size:26rpx;
        color:#666;
    }
}
.cancel_special_focus_btn{
    flex-direction: column;
}
.common_care_wrap{
    margin-top:20rpx;
}
</style>
