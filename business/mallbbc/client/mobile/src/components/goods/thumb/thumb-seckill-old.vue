<!-- 联盟秒杀商品组件：横向展示，一行一个，商品列表页面
    点击进入商品详情页
    加入购物车事件
-->
<template name="thumb-seckill-old">
    <view class="goods_item" @click="goGoodsDetail">
        <view class="goods_item_top">
            <view class="goods_img_wrap">
              <imgThumb :imgSrc="goodsItem.mainImage" showThumbTips :noSale="promotionNoSale(goodsItem)" />
            </view>

            <view class="goods_item_wrap">
                <view class="itemTop">
                    <view class="goods_name">
                        <text class="storeLogo ownStoreLogo" v-if="goodsItem.storeId=='6'"></text>
                        <img :src="goodsItem.storeLogo" class="storeLogo" v-if="goodsItem.storeId!='6' && goodsItem.storeLogo"/>
                        <text>{{ goodsItem.skuName }}</text>
                    </view>
                    <!-- 已开始和进行中进度条 -->
                    <view v-if="props.showProgress && goodsItem.stageState == 2" class="progress-box">
                        <view class="progress-con" v-if="goodsItem.hasStock && goodsItem.canPurchase">
                            <view class="leftRoom"></view>
                            <view class="progress">
                                <view class="real-progress" :style="{width:parseInt(goodsItem.secKillProgress)*216/100+'rpx'}">
                                </view>
                            </view>
                            <view class="rightRoom"></view>
                            <view class="lightningBox" :style="{left:(goodsItem.hasStock && goodsItem.canPurchase)?(parseInt(goodsItem.secKillProgress)*216/100 - 2)+'rpx':(216-18)+'rpx'}">
                                <view class="lightning"></view>
                                <view class="right-progress-text" :style="{left:parseInt(goodsItem.secKillProgress)>=50?(parseInt(goodsItem.secKillProgress)==100?'-50rpx':'-40rpx'):'40rpx',color:parseInt(goodsItem.secKillProgress)>=50?'#fff':'#f30300'}">{{goodsItem.secKillProgress}}</view>
                            </view>
                        </view>
                    <view  v-else class="allProgress" :style="{width:'252rpx'}">{{$L('100%')}}</view>
                    <view class="lightningBox lightningBoxAll" v-if="!goodsItem.hasStock || !goodsItem.canPurchase"><view class="lightning"></view></view>
                    </view>
                    <!-- 即将开始进度条 -->
                    <view v-if="props.showProgress && goodsItem.stageState == 1" class="progress-box-will"></view>

                    <view class="limit">
                        <view class="limitNum" v-if="props.showMaxNum">{{$L('限量')}}&nbsp;{{goodsItem.promotionStock}}&nbsp;{{$L('件')}}</view>
                        <view v-if="props.showBuyNum">{{$L('|')}}</view>
                        <view class="haveBuyNum" v-if="props.showBuyNum">
                            <view v-if="goodsItem.stageState == 1" class="sold_out_num">{{$L('已抢 0 件')}}</view>
                            <view v-else class="sold_out_num">{{$L('已抢')}}&nbsp;{{(!goodsItem.hasStock || !goodsItem.canPurchase)?goodsItem.promotionStock:goodsItem.buyQuantity}}&nbsp;{{$L('件')}}</view>
                        </view>
                    </view>
                </view>
                <view class="itemBottom">
                    <view class="goods_bottom_left" v-if="goodsItem.salePrice">
                        <view class="goods_price num-font fitFont">
                            <text class="small_price">￥</text>
                            <text class="big_price">{{$getPartNumber(goodsItem.promotionPrice,'int')}}</text>
                            <text class="small_price">{{$getPartNumber(goodsItem.promotionPrice,'decimal')}}</text>
                        </view>
                         <view class="old_price num-font">￥{{$getPartNumber(goodsItem.salePrice,'int')}}{{$getPartNumber(goodsItem.salePrice,'decimal')}}</view>
                    </view>
                    <view class="goods_bottom_left noSale flex_row_start_center" v-else>{{$L('暂无报价')}}</view>
                    <view class="itemBottomRight">
                        <!-- 去抢购 -->
                        <view v-if="goodsItem.stageState == 2">
                            <view v-if="goodsItem.secKillProgress !='100%' && goodsItem.hasStock && goodsItem.canPurchase" class="goods_bottom_right buyButton" @click.stop="goGoodsDetail">{{$L('去抢购')}}</view>
                            <view v-else class="sold_out_wrap buyButton" @click.stop="haveSoldOut">{{$L('已抢光')}}</view>
                        </view>
                        <view v-if="goodsItem.stageState == 1">
                            <view class="set_remind_btn buyButton" v-if="!goodsItem.remind" @click.stop="setRemind" :class="{cancel_remind_btn:!goodsItem.salePrice}">{{$L('设置提醒')}}</view>
                            <view class="cancel_remind_btn buyButton" v-else @click.stop="setRemind">{{$L('取消提醒')}}</view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import { mapState } from 'vuex';
import activityMinxin from './minxin/activity.js'
import promotionHandler from "@/views/promotion/common/handler";
import imgThumb from "@/components/goods/thumb/imgThumb.vue";
import {fitFontSize} from '@/utils/common.js'

export default {
    name: "thumb-seckill-old",
    components: {
        imgThumb
    },
    mixins:[activityMinxin],
    data() {
        return {
            
        }
    },
    props: {
        goodsItem: {
            type: Object
        },
        props: {
            type: Object
        }
    },
    computed: {
        ...mapState(['hasLogin'])
    },
    mounted() {
        setTimeout(() => {
            let fontDom = document.getElementsByClassName('fitFont');
            fitFontSize(fontDom);
        },500)
    },
    methods: {
        //进入商品详情页
        goGoodsDetail() {
            try {
                let sku = this.goodsItem.sku;
                this.$Router.push({
                    path: '/standard/product/detail',
                    query: {
                        sku
                    }
                });
            } catch (error) {
                console.log("跳转到商品详情出错", error);
            }
        },
        // 设置/取消提醒
        setRemind(){
            if (!this.goodsItem.salePrice) {
                uni.showToast({
                    title:'该商品暂不可售，去看看别的吧！',
                    icon:'none'
                })
                return
            }

            if (this.hasLogin){
                let param = {
                    productId : this.goodsItem.productId || this.goodsItem.id
                }
                promotionHandler.setSeckillRemind(param).then((res)=>{
                    if (res.state == 200) {
                        uni.showToast({
                            title: res.msg,
                            icon:'none'
                        })
                        this.$set(this.goodsItem,'remind',!this.goodsItem.remind)
                    } else {
                        uni.showToast({
                            title:res.msg,
                            icon:'none'
                        })
                    }
                });
            } else {
                this.$Router.push('/pages/public/login')
            }
        },
        // 已抢完
        haveSoldOut(){
            uni.showToast({
                title:'该商品已抢完，去看看别的吧！',
                icon:'none'
            })
        }
    }
}
</script>

<style lang='scss' scoped>
    .goods_item {
        width:100%;
        background-color: #fff;
        border-radius: 16rpx;
        padding:30rpx 30rpx 30rpx 20rpx;
        box-sizing: border-box;
        margin-bottom:20rpx;

        .goods_item_top{
            display: flex;
            .goods_img_wrap{
                width: 33%;
                border-radius: 12rpx;
                margin-right: 8%;
                display: flex;
                align-items: center;
                justify-content: center;
                
                .goods_img{
                    width: 100%;
                    border-radius: 15rpx;
                }
            }

            .goods_item_wrap{
                flex: 1;
                position: relative;
                display: flex;
                flex-direction: column;
                justify-content: space-between;

                .goods_name{
                    font-size:30rpx;
                    color:#2D2D2D;
                    font-weight: 600;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    word-break: break-word;

                    .storeLogo{
                        width:36rpx;
                        height: 36rpx;
                        vertical-align: text-top;
                        margin-right: 10rpx;

                        &.ownStoreLogo {
                            display: inline-block;
                            width:36rpx;
                            height: 36rpx;
                            margin-top: 2rpx;
                            background: var(--storeLogo);
                            background-size: 100% 100%;
                        }
                    }
                }

                .progress-box{
                    width: 252rpx;
                    height:24rpx;
                    margin-top: 16rpx;
                    position: relative;

                    .allProgress{
                        width: 100%;
                        background: var(--seckillProgress);
                        height: 100%;
                        color: #ffffff;
                        font-size: 18rpx;
                        line-height: 24rpx;
                        text-align: right;
                        padding-right: 24rpx;
                        border-radius: 12rpx;
                        overflow: hidden;
                    }

                    .progress-con{
                        width: 252rpx;
                        height:24rpx;
                        display: flex;
                        border-radius: 12rpx;
                        overflow: hidden;
                        background: var(--seckillProgressBg);
                    }

                    .leftRoom,.rightRoom{
                        width:18rpx;
                        height: 24rpx;
                    }

                    .leftRoom{
                        background: var(--seckillProgress);
                    }

                    .rightRoom{
                        //   background: #feecec;
                    }

                    .progress{
                        width:216rpx;
                        height: 24rpx;
                        background: var(--seckillProgressBg);
                        display: flex;
                        position: relative;

                        .real-progress{
                            background: var(--seckillProgress);
                            height: 100%;
                            color: #ffffff;
                            font-size: 18rpx;
                            line-height: 24rpx;
                            text-align: right;
                            //   padding-right: 24rpx;
                        }
                    }

                    .lightningBox{
                        height: 36rpx;
                        width: 36rpx;
                        position: absolute;
                        top: -3px;
                        display: flex;

                        &.lightningBoxAll{
                            right: -18rpx;
                        }

                        .lightning{
                            width: 36rpx;
                            height: 36rpx;
                            background: url('@/static/shared/seckill/icon_bnj_xsth_yiqiang@2x.png') center no-repeat;
                            background-size:36rpx 36rpx;
                        }

                        .right-progress-text{
                            position: absolute;
                            height: 36rpx;
                            line-height: 36rpx;
                            font-size: 18rpx;
                            text-align: right;
                        }
                    }
                }

                .progress-box-will{
                    width: 252rpx;
                    height: 24rpx;
                    background: var(--seckillProgressBg);
                    border-radius: 12rpx;
                    margin-top: 16rpx;
                }

                .limit {
                    display: flex;
                    font-size: 22rpx;
                    color: #222222;
                    margin-top: 12rpx;
                    .limitNum{
                        margin-right: 4rpx;
                    }
                    .haveBuyNum{
                        margin-left: 4rpx;
                    }
                }

                .itemBottom{
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;

                    .goods_bottom_left {
                        width:calc(100% - 170rpx);
                        &.noSale {
                            height: 100%;
                            padding-bottom: 4rpx;
                            font-size: 34rpx;
                            font-weight: bold;
                            color: #222;
                        }
                    }

                    .goods_price{
                        width: fit-content;
                        color: var(--confirmBtnBgColor2);
                        font-size: 28rpx;
                        font-weight: normal;
                        .big_price{
                            font-size: 44rpx;
                        }
                    }

                    .old_price{
                        font-size: 24rpx;
                        height: 28rpx;
                        line-height: 28rpx;
                        font-weight: normal;
                        text-decoration:  line-through;
                        color: #999999;
                    }

                    .itemBottomRight{
                        margin-bottom: 6rpx;

                        .buyButton{
                            width: 160rpx;
                            height: 68rpx;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            font-weight: bold;
                            font-size: 30rpx;
                            color: #fff;
                            border-radius: 34rpx;
                            background: var(--activeTextBg);
                            box-shadow: 0px 4rpx 8rpx 0px var(--activityBtnShadow);
                            white-space: nowrap;
                            &.sold_out_wrap{
                                opacity: 0.4;
                            }
                            &.cancel_remind_btn{
                                opacity: 0.4;
                            }
                        }
                    }
                }
            }
        }

        .goods_item_bottom{
            display: flex;
            .limitNum,.haveBuyNum{
                height: 40rpx;
                padding: 0 10rpx;
                background-color: gray;
                margin-right: 20rpx;
                border-radius: 20rpx;
                color: #fff;
            }
        }
    }
</style>
