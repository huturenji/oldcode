<template>
    <!-- 商品规格组件 -->
    <view class="spec_model_con">
        <!-- 顶部商品图 swiper 图片点击的时候，图片方法手势缩放的功能 -->
        <photoswipe ref="prImgs" :imgs.sync="images"></photoswipe>
        <view class="spec_model_content">
            <view class="spec_model_top">
                <view class="spec_model_goods">
                    <view class="spec_goods_image" v-if="goodsData && goodsData.images && goodsData.images[0]" @click="prviewImage(0)">
                        <image :src="goodsData.images[0]" mode="aspectFit"></image>
                    </view>
                    <view class="spec_goods_right">
                        <view class="spec_goods_price_con">
                            <view class="spec_prices">
                                <!-- 立即秒杀进行中 start -->
                                <view class="spec_goods_price num-font" v-if="secKillInfo && secKillInfo.state == 2 && goodsPriceInfo.salePrice">
                                    <text>￥</text>
                                    <text>{{$getPartNumber(goodsPriceInfo.salePrice,'int')}}</text>
                                    <text>{{$getPartNumber(goodsPriceInfo.salePrice,'decimal')}}</text>
                                </view>
                                <!-- 立即秒杀进行中 end -->

                                <!-- 一起买进行中 start -->
                                <view class="spec_goods_price num-font"
                                    v-else-if="buyTogetherInfo && buyTogetherInfo.state == 2">
                                    <text>￥</text>
                                    <text>{{$getPartNumber(buyTogetherInfo.promotionPrice,'int')}}</text>
                                    <text>{{$getPartNumber(buyTogetherInfo.promotionPrice,'decimal')}}</text>
                                </view>
                                <!-- 一起买进行中 end -->

                                <!-- 预售 start -->
                                <!-- 立即付定金 start -->
                                <view class="spec_goods_price num-font"
                                    v-else-if="preSellInfo && preSellInfo.type == 1&&preSellInfo.pre_run==2">
                                    <text>￥</text>
                                    <text>{{$getPartNumber(preSellInfo.firstMoney,'int')}}</text>
                                    <text>{{$getPartNumber(preSellInfo.firstMoney,'decimal')}}</text>
                                </view>
                                <!-- 立即付定金 end -->
                                <!-- 全款 start -->
                                <view class="spec_goods_price num-font"
                                    v-else-if="preSellInfo && preSellInfo.type == 2&&preSellInfo.pre_run==2">
                                    <text>￥</text>
                                    <text>{{$getPartNumber(preSellInfo.presellPrice,'int')}}</text>
                                    <text>{{$getPartNumber(preSellInfo.presellPrice,'decimal')}}</text>
                                </view>
                                <!-- 全款 end -->
                                <!-- 预售 end -->

                                <!-- 阶梯团start -->
                                <view class="spec_goods_price num-font" v-else-if="valiInfo(ladderInfo)">
                                    <text>￥</text>
                                    <text>{{$getPartNumber(ladderInfo.advanceDeposit,'int')}}</text>
                                    <text>{{$getPartNumber(ladderInfo.advanceDeposit,'decimal')}}</text>
                                </view>
                                <!-- 阶梯团end -->

                                <!-- 拼团start -->
                                <view class="spec_goods_price num-font"
                                    v-else-if="valiInfo(pinInfo)&&pinButState">
                                    <text>￥</text>
                                    <text>{{$getPartNumber(pinInfo.leaderPrice?(pinButState==3?pinInfo.spellPrice:pinInfo.leaderPrice):pinInfo.spellPrice,'int')}}</text>
                                    <text>{{$getPartNumber(pinInfo.leaderPrice?(pinButState==3?pinInfo.spellPrice:pinInfo.leaderPrice):pinInfo.spellPrice,'decimal')}}</text>
                                </view>
                                <!-- 拼团end -->

                                <!-- 正常商品start -->
                                <view class="spec_goods_price num-font"
                                    v-else-if="goodsPriceInfo.salePrice">
                                    <text>￥</text>
                                    <text>{{$getPartNumber(goodsPriceInfo.salePrice,'int')}}</text>
                                    <text>{{$getPartNumber(goodsPriceInfo.salePrice,'decimal')}}</text>
                                </view>
                                <!-- 正常商品end -->

                                <!-- 暂无报价start -->
                                <view class="spec_goods_price num-font"
                                    v-else>
                                    <text>￥</text>
                                    <text class="no_price">暂无报价</text>
                                </view>
                                <!-- 暂无报价end -->
                            </view>
                            <!-- 活动标识 start -->
                            <view class="sec_kill_tips"
                                v-if="secKillInfo && (secKillInfo.state == 2)">
                                {{$L('限时秒杀')}}
                            </view>
                            <view class="pre_sale_tips"
                                v-if="valiInfo(preSellInfo)&&preSellInfo.pre_run==2">{{$L("预售")}}
                            </view>
                            <text class="ladder_regiment_tips"
                                v-if="valiInfo(ladderInfo)">{{$L('阶梯团')}}</text>
                            <text class="pin_tips"
                                v-if="valiInfo(pinInfo)&&pinButState">{{$L('拼团')}}</text>
                            <!-- 活动标识 end -->
                        </view>
                        <!-- 已下架商品 start -->
                        <view class="spec_goods_des" v-if="!onSale">
                            {{$L('商品已下架')}}
                        </view>
                        <!-- 已下架商品 end -->
                        <!-- 普通商品 start -->
                        <view class="spec_goods_des" v-else>
                            {{$L('已选规格')}}：
                            <text v-if="goodsData.specValues" class="des_detail">{{goodsData.specValues}}</text>
                            <text v-else>{{$L('默认')}}</text>
                        </view>
                        <!-- 普通商品 end -->

                        <!-- 已选数量 start -->
                        <view class="spec_goods_number">
                            {{$L('已选数量')}}：
                            <text class="num_detail">*{{currentSpecNum}}</text>
                        </view>
                        <!-- 已选数量 end -->
                    </view>
                </view>
            </view>

            <!-- 地址信息 -->
            <view class="address_info" @click="openAddressChooseModal" v-if="choosedAddress.telMobile && choosedAddress.memberName">
                <img
                    src="@/static/shared/gift/btn_common_weizhi.svg"
                    mode="scaleToFill"
                />
                <view class="address_detail">
                    <view class="detail">{{`${choosedAddress.detailAddress}`}}</view>
                    <view class="contact_people" v-if="choosedAddress.telMobile">
                        <text>{{choosedAddress.memberName}}</text>
                        <text >{{choosedAddress.telMobile|formateTel}}</text>
                    </view>
                </view>
                <img src="@/static/shared/common/icon/icon_common_rightarrow.svg" class="skip_icon" />
            </view>

            <!-- 当有区域销售和无货的时候，此时样式需要特殊处理 -->
            <scroll-view scroll-y="true" class="spec_content" :style="{height:`calc(80vh - 200rpx - 120rpx - ${choosedAddress.telMobile ? '158rpx' : '60rpx'} - var(--safe-area-inset-bottom))`}" :class="{disable: !!disabled}">
                <view class="spec_list" >
                    <view v-if="specs && specs.length > 0">
                        <view class="spec_list_pre" v-for="(item,index) in specs" :key="index">
                            <view class="spec_list_pre_name">{{item.specName}}</view>
                            <template v-for="(item1,index1) in item.specAttrList">
                                <block v-if="item && item.specAttrList && item.specAttrList.length > 0"
                                    :key='index1'>
                                    <view class="spec_list_pre_desc"
                                        :class="{spec_list_pre_desc_active:arrhaveitem(sku,item1.skus),spec_list_pre_desc_disabled:'isDisable'==setSpecSkuType(goodsData.sku,item1.skus,item.dim)}" :key="index1" @click="changeSpecSku(goodsData.sku,item1.skus,item.dim)">
                                        <view class="spec_list_pre_con">
                                            <image :src="item1.imagePath" mode="" v-if="item1.imagePath"></image>
                                            <text>{{item1.specValue}}</text>
                                        </view>
                                    </view>
                                </block>
                            </template>
                        </view>
                    </view>
                    <view class="spec_num">
                        <view class="spec_num_left">
                            {{$L('购买数量')}}
                            <text v-if='goodsData.lowestBuy>1'>{{goodsData.lowestBuy}}件起购</text>
                        </view>
                        <view class="spec_num_right">
                            <text @click="editNum('reduce')" :class="{no_edit:currentSpecNum<=goodsData.lowestBuy}">-</text>
                            <input type="number" v-model="currentSpecNum" @blur="($event)=>{editNum('blur', $event)}" @input="($event)=>{editNum('edit', $event)}" maxlength="3" class="inputBox"
                                cursor-spacing="0" :cursor="currentSpecNum.toString().length" />
                            <text @click="editNum('add')" :class="{no_edit:noAdd}">+</text>
                        </view>
                    </view>                
                </view>
                
            </scroll-view>
        </view>
        
        <template v-if='!disabledModule'>
            <!-- 规格弹框的底部按钮 start -->
            <!-- 秒杀商品start -->
            <block v-if="secKillInfo && secKillInfo.state == 2 ">
                <view class="spec_btn" :class="{disable: !!disabled}" v-if="showSpecModelType == 'add'">
                    <button class="spec_add_cart_btn spec_btn_only" @click="addCart">{{$L('加入购物车')}}</button>
                </view>
                <template v-else>
                    <!-- 秒杀已抢完 start -->
                    <view class="spec_btn"
                        v-if="!hasStock || !areaLimit || !seckillStock">
                        <button type="primary" class="spec_not_stock spec_btn_only">{{$L('已抢完')}}</button>
                    </view>
                    <!-- 秒杀已抢完 end -->
                    <!--立即秒杀 start -->
                    <view class="spec_btn" @click="buy" v-else>
                        <button type="primary" class="spec_seckill_btn spec_btn_only" :class="{disable: !!disabled}">{{$L('立即秒杀')}}</button>
                    </view>
                    <!--立即秒杀 end -->
                </template>
            </block>
            <!-- 秒杀商品end -->
            <block v-else-if="buyTogetherInfo && buyTogetherInfo.state == 2 ">
                <view class="spec_btn"
                    v-if="!hasStock">
                    <button type="primary" class="spec_not_stock spec_btn_only">{{$L('库存不足')}}</button>
                </view>
                <view v-else class="spec_btn" @click="buy">
                    <button type="primary" class="spec_ecbuy_btn" :class="{disable: !!disabled}">{{$L('一起买')}}</button>
                </view>
            </block>
            <!-- 预售活动 start -->
            <block v-else-if="valiInfo(preSellInfo)&&preSellInfo.pre_run==2">
                <view class="spec_btn"
                    v-if="!hasStock">
                    <button type="primary" class="spec_not_stock spec_btn_only">{{$L('库存不足')}}</button>
                </view>
                <!--立即付定金/全款支付 start -->
                <view class="spec_btn" v-else @click="buy">
                    <button type="primary"
                        :class="{spec_deposit_btn:preSellInfo.type == 1,spec_seckill_btn:preSellInfo.type == 2,spec_btn_only:true}">{{preSellInfo.type == 1?`${$L("立即付定金")}￥${preSellInfo.firstMoney}`:$L("立即购买")}}</button>
                </view>
                <!--立即付定金/全款支付 end -->
            </block>
            <!-- 预售活动 end -->
            <!-- 阶梯团活动start -->
            <block v-else-if="valiInfo(ladderInfo)&&ladderInfo.ladder_run==2">

                <view class="spec_btn"
                    v-if="!hasStock">
                    <button type="primary" class="spec_not_stock spec_btn_only">{{$L('库存不足')}}</button>
                </view>
                <view class="spec_btn" v-else>
                    <view @click="buy" class="specifications_btn2">
                        <text>{{$L('立即付定金')}}</text>
                    </view>
                </view>
            </block>
            <!-- 阶梯团活动end -->
            <!-- 拼团活动start -->
            <block v-else-if="valiInfo(pinInfo)&&pinInfo.state == 1">
                <view class="spec_btn"
                    v-if="!hasStock">
                    <button type="primary" class="spec_not_stock spec_btn_only">{{$L('库存不足')}}</button>
                </view>
                <block v-else>
                    <view class="spec_btn" v-if="!pinButState" @click="buy('aloneBuy')">
                        <button type="primary" class="specifications_bottom_btn3 num-font">
                            <text>{{$L("单独买")}}</text>
                            <text>(￥{{pinInfo.salePrice}})</text>
                        </button>
                    </view>
                    <view class="spec_btn" v-if="pinButState==1" @click="buy">
                        <button type="primary" class="specifications_bottom_btn4 num-font">
                            <text>{{$L("去开团")}}</text>
                            <text>￥{{pinInfo.leaderIsPromotion==1?pinInfo.leaderPrice:pinInfo.spellPrice}}</text>
                        </button>
                    </view>
                    <view class="spec_btn num-font" v-if="pinButState==2">
                        <view class="specification_add" @tap="buy('aloneBuy')">
                            <text>￥{{pinInfo.salePrice}}</text>
                            <text>{{$L("单独买")}}</text>
                        </view>
                        <view class="specification_buy num-font" @tap="buy">
                            <text>￥{{pinInfo.leaderIsPromotion==1?pinInfo.leaderPrice:pinInfo.spellPrice}}</text>
                            <text>{{$L("去开团")}}</text>
                        </view>
                    </view>
                    <view class="spec_btn num-font" v-if="pinButState==3" @click="buy">
                        <button type="primary" class="specifications_bottom_btn4">
                            <text>{{$L("去参团")}}</text>
                            <text>(￥{{pinInfo.spellPrice}})</text>
                        </button>
                    </view>
                </block>

            </block>
            <!-- 拼团活动end -->
            <block v-else>
                <!-- 商品下架 start -->
                <view class="spec_btn" v-if="!onSale">
                    <button type="primary" class="spec_not_stock spec_btn_only">{{$L('商品已下架')}}</button>
                </view>
                <!-- 商品下架 end -->
                <!--库存不足 start -->
                <view class="spec_btn"
                    v-else-if="!hasStock">
                    <button type="primary" class="spec_not_stock spec_btn_only">{{$L('库存不足')}}</button>
                </view>
                <!--库存不足 end -->
                <!-- 普通商品 start-->
                <block v-else>
                    <view class="spec_btn" :class="{disable: !!disabled}"  v-if="showSpecModelType == ''">
                        <button class="spec_add_cart_btn" @click="addCart">{{$L('加入购物车')}}</button>
                        <button class="spec_buy_btn" @click="buy">{{$L('立即购买')}}</button>
                    </view>
                    <view class="spec_btn" :class="{disable: !!disabled}" v-if="showSpecModelType == 'add'">
                        <button class="spec_add_cart_btn spec_btn_only" @click="addCart">{{$L('加入购物车')}}</button>
                    </view>
                    <view class="spec_btn" :class="{disable: !!disabled}" v-if="showSpecModelType == 'buy'">
                        <button class="spec_buy_btn spec_btn_only" @click="buy">{{$L('立即购买')}}</button>
                    </view>
                </block>

                <!-- 普通商品 end-->
            </block>
            <!-- 规格弹框的底部按钮 end -->
        </template>
    </view>
</template>
<script>
import {
    mapGetters
} from 'vuex';
import photoswipe from '@/components/photoswipe/photoswipe.vue';
import config from '@/common/lib/config';
// #ifdef H5
const MASKING_TYPE = SnUtils.DataMasking.MASKING_TYPE;
const maskingText = SnUtils.DataMasking.maskingText;
// #endif
const ISDECORATE = config.ISDECORATE;
export default {
    comments:{photoswipe},
    props:{  
        // 图片列表
        images: {
            type: Array,
            default: ()=>[]
        },
        secKillInfo: {
            type: Object,
            default:()=>{}
        },
        buyTogetherInfo: {
            type: Object,
            default:()=>{}
        },
        preSellInfo: {
            type: Object,
            default:()=>{}
        },
        ladderInfo: {
            type: Object,
            default:()=>{}
        },
        pinInfo: {
            type: Object,
            default:()=>{}
        },
        goodsData: {
            type: Object,
            default:()=>{}
        },
        goodsPriceInfo: {
            type: Object,
            default:()=>{}
        },
        specs: {
            type: Array,
            default:()=>[]
        },
        pinButState: {
            type: Number
        },
        currentSpecNum: {
            type: Number,
            default: 1
        },
        hasStock: {
            type: Boolean,
            default:true
        },
        areaLimit: {
            type: Boolean,
            default:true
        },
        disabled: {
            type: Boolean,
            default:false
        },
        seckillStock: {
            type: Boolean,
            default: true
        },
        onSale: {
            type: Boolean,
            default: true
        },
        showSpecModelType: {
            type: String
        },
        sku: {
            type: String
        },
        choosedAddress: {
            type:Object,
            default: ()=>{}
        }
    },
    data(){
        return {
        }
    },
    filters:{
        formateTel: function (value) {
            let newValue
            try {
                newValue = ISDECORATE?maskingText(MASKING_TYPE.TEL,value):value;
            } catch (error) {
            }
            return newValue;
        }
    },
    computed: {
        ...mapGetters(['disabledModule'])
    },
    methods: {
        valiInfo(info) {
            return JSON.stringify(info) != '{}'
        },
        // 编辑规格的数量
        editNum(type, e){
            this.$emit('editNum', type, e)
        },
        /**
         * 商品id是否在商品销售规格列表中
         * @param {str} item
         * @param {arr} arr 商
         * @param {str} key
         */
        arrhaveitem(item,arr,key){
            var isInArr = false;
            var len = arr.length;
            for (var i = 0; i < len; i++) {
                if (!!key ? arr[i][key] == item : arr[i] == item) {
                    isInArr = true;
                    break;
                }
            }
            return isInArr;
        },

        /**
         * 计算规格是否可选
         * @param {str} sku 当前所选商品id
         * @param {arr} skuIds 商品规格list
         * @param {arr} dim 维度
         */
        setSpecSkuType:function(sku,skuIds,dim){
            let that = this;
            let res = '';
            let tempList = that.getDimSkus(sku,skuIds,dim); //获取每个维度下的skuIds
            let tempListFilter=tempList.reduce((a, b) => a.filter(c => b.includes(c))); //获取每个维度skuIds的交集
            if (0 == tempListFilter.length){
                res = 'isDisable';
            }
            return res;
        },

        /**
         * 获取所有维度商品规格id列表
         * @param {str} sku 当前说选商品id，beforeChange
         * @param {arr} skuIds 商品规格list
         * @param {arr} dim 维度
         */
        getDimSkus(sku,skuIds,dim){
            let that = this;
            let resList = [];
            let length = this.specs.length;
            for (let i=0;i<length;i++){
                let value = this.specs[i];
                if (dim == value.dim){ //点击的按钮所属的维度
                    resList.push(skuIds);
                } else { //非当前维度
                    let len = value.specAttrList.length;
                    for (let j=0;j<len;j++){
                        if (that.arrhaveitem(sku,value.specAttrList[j].skus)) {
                            resList.push(value.specAttrList[j].skus);
                        }
                    }
                }
            }
            return resList;
        },


        //切换规格
        changeSpecSku(sku,skuIds,dim){
            if (this.setSpecSkuType(sku,skuIds,dim) == 'isDisable') {
                return
            }
            this.$emit('changeSpecSku', sku, skuIds, dim)
        },

        // 立即购买
        buy(args){
            this.$emit('buy', args)
        },
        // 加入购物车
        addCart(args){
            this.$emit('addCart', args)
        },

        prviewImage(k){
            this.$nextTick(()=>{
                this.$refs.prImgs.initImage(k)
            })
        },
        /**
         * 打开地址选择弹窗
         */
        openAddressChooseModal(){
            this.$emit('openAddressChooseModal')
        }
       
            
    }
}
</script>
<style scoped lang='scss'>
.spec_model_con {
    width: 750rpx;
    height: calc(100% + var(--safe-area-inset-bottom));
    background: #eff2f5;
    border-radius: 10rpx 10rpx 0;
    .spec_model_content {
        height: 100%;
        display: flex;
        flex-direction: column;
        
        .spec_model_top {
            display: flex;
            justify-content: space-between;
            padding: 40rpx 22rpx 20rpx 30rpx;
            box-sizing: border-box;

            .spec_model_goods {
                display: flex;
                align-items: center;

                .spec_goods_image {
                    width: 162rpx;
                    height: 162rpx;
                    background: #EEEEEE;
                    border-radius: 15rpx;

                    image {
                        width: 162rpx;
                        height: 162rpx;
                        border-radius: 15rpx;
                    }
                }

                .spec_goods_right {
                    margin-left: 30rpx;
                    flex-shrink: 0;
                    height: 162rpx;
                    padding-top: 6rpx;

                    .spec_goods_price_con {
                        display: flex;
                        align-items: center;

                        .spec_prices {
                            .spec_goods_price {
                                display: inline-block;
                                

                                text {
                                    font-size: 32rpx;
                                    font-weight: normal;
                                    color: var(--prizeColor4);
                                }

                                text:nth-child(2) {
                                    font-size: 44rpx;
                                    &.no_price{
                                        font-size: 40rpx;
                                    }
                                }
                            }
                        }

                        .sec_kill_tips {
                            width: 130rpx;
                            height: 40rpx;
                            background: linear-gradient(90deg, #FFAA06 0%, #FF8323 0%, #FC5300 0%, #FF1353 100%);
                            border-radius: 20rpx;
                            font-size: 24rpx;
                            
                            font-weight: 500;
                            color: #FFFFFF;
                            text-align: center;
                            line-height: 40rpx;
                            margin-left: 20px;
                        }

                        .pre_sale_tips {
                            width: 76rpx;
                            height: 38rpx;
                            background: linear-gradient(90deg, #891ff7, #da01e8);
                            border-radius: 18rpx;
                            font-size: 22rpx;
                            
                            font-weight: 500;
                            color: #fff;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin-left: 20px;
                        }

                        .ladder_regiment_tips {
                            width: 100rpx;
                            height: 40rpx;
                            background: linear-gradient(90deg, #FF7A18 0%, #FEA10E 100%);
                            border-radius: 20rpx;
                            font-size: 24rpx;
                            
                            font-weight: 500;
                            color: #FFFFFF;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin-left: 20rpx;
                        }

                        .pin_tips {
                            width: 80rpx;
                            height: 40rpx;
                            background: linear-gradient(90deg, #FC1C1C 0%, #FF6C00 100%);
                            border-radius: 20rpx;
                            font-size: 24rpx;
                            
                            font-weight: 500;
                            color: #FFFFFF;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin-left: 20rpx;
                        }
                    }

                    .spec_goods_des,.spec_goods_number {
                        font-size: 26rpx;
                        
                        font-weight: 400;
                        color: #666666;
                        margin-top: 12rpx;
                        width: 450rpx;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;

                        .des_detail,.num_detail {
                            color:#222222
                        }
                    }
                    .spec_goods_number {
                        margin-top: 4rpx;
                    }
                }
            }

            .close_spec {
                width: 30rpx;
                height: 30rpx;
            }
        }
        .address_info {
            width: 710rpx;
            background: #fff;
            border-radius: 20rpx;
            margin: 0 auto;
            display: flex;
            padding: 16rpx 28rpx 20rpx 24rpx;

            img {
                display: block;
                width: 32rpx;
                height: 32rpx;
                margin: 2rpx 6rpx 0 0;
            }

            .address_detail {
                width: 596rpx;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;

                .detail {
                    font-size: 28rpx;
                    font-weight: 500;
                    color: #000;

                }

                .contact_people {
                    font-size: 26rpx;
                    color: #999999;
                    font-weight: 400;
                    margin-top: 8rpx;
                    &>text:first-child {
                        padding-right: 16rpx;
                    }
                }
            }

            .skip_icon {
                display: block;
                width: 20rpx;
                height: 20rpx;
                margin-top: 6rpx;
            }
        }

        // flex 自适应布局 
        // 以下变量解释 
        // 80vh = 整个规格弹窗的高度
        // 200rpx = 顶部商品模块.spec_model_top的高度
        // 120rpx = 底部加入购物车立即购买模块.spec_btn的高度
        // 20rpx = 活动量【弹性】高度 防止贴边贴的太死 
        //  var(--safe-area-inset-bottom) = 底部安全区域 一般指全名屏手机底部的安全区域  - 158rpx 
        .spec_content {
            margin-top: 20rpx;
            //height: calc(80vh - 200rpx - 120rpx - 40rpx - var(--safe-area-inset-bottom));
            &.disable{
                padding-bottom: 60rpx;
            }
            .spec_list {
                margin: 0 20rpx;
                padding: 20rpx 32rpx 0 32rpx;
                background: #fff;
                border-radius: 20rpx;
                margin-bottom: 20rpx;

                .spec_list_pre {

                    .spec_list_pre_name {
                        font-size: 28rpx;
                        
                        font-weight: 500;
                        color: #222;
                        margin-bottom: 30rpx;
                    }

                    .spec_list_pre_desc {
                        display: inline-table;
                        padding: 13rpx 25rpx;
                        box-sizing: border-box;
                        box-sizing: border-box;
                        background: #F5F5F5;
                        border-radius: 50rpx;
                        margin-bottom: 30rpx;
                        margin-right: 30rpx;
                        border: 1rpx solid #F5F5F5;
                        .spec_list_pre_con {
                            display: flex;
                            align-items: center;
                            transform: rotateZ(360deg);
                            text {
                                font-size: 26rpx;
                                
                                font-weight: 500;
                                color: #343434;
                                text-align: center;
                            }

                            image {
                                width: 36rpx;
                                height: 36rpx;
                                margin-right: 20rpx;
                            }
                        }
                    }

                    .spec_list_pre_desc_active {
                        background: #FFFFFF;
                        border: 2rpx solid var(--radioCheckedColor);

                        .spec_list_pre_con {
                            text {
                                color: var(--radioCheckedColor);
                            }
                        }
                    }

                    .spec_list_pre_desc_disabled {
                        background: #F5F5F5;
                        opacity: 0.2;

                        .spec_list_pre_con {
                            text {
                                color: #2D2D2D;
                            }
                        }
                    }
                }

                .spec_num {
                    height: 82rpx;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16rpx 0rpx 16rpx 0rpx;
                    box-sizing: border-box;

                    .spec_num_left {
                        font-size: 28rpx;
                        
                        font-weight: 500;
                        color: #222;

                        text {
                            color: #949494;
                        }
                    }

                    .spec_num_right {
                        width: 182rpx;
                        height: 50rpx;
                        border: 1rpx solid #EDEDED;
                        border-radius: 6rpx;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        font-size: 24rpx;
                        
                        font-weight: bold;
                        color: #A6A6A6;
                        line-height: 30rpx;
                        .inputBox{
                            color: #222222;
                        }

                        text {
                            width: 51rpx;
                            height: 50rpx;
                            text-align: center;
                            line-height: 50rpx;
                            border-left: 1rpx solid #EDEDED;

                            &.no_edit {
                                background: #F8F8F8;
                                opacity: 0.5;
                                color: #949494;
                            }
                        }

                        text:nth-child(1) {
                            color: #949494;
                            border-right: 1rpx solid #EDEDED;
                            border-left: none;
                        }

                        input {
                            width: 78rpx;
                            height: 50rpx;
                            line-height: 50rpx;
                            text-align: center;
                            font-size: 24rpx;
                        }
                    }
                }
            }


        }
    }

    .spec_btn {
        width: 750rpx;
        height: calc(120rpx + var(--safe-area-inset-bottom));
        background: #FFFFFF;
        box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(86, 86, 86, 0.08);
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        bottom: 0;
        /* #ifdef MP-WEIXIN */
        height: calc(98rpx + env(safe-area-inset-top));
        /* #endif */
        /*兼容 IOS<11.2*/
        padding-bottom: var(--safe-area-inset-bottom);
        /*兼容 IOS>11.2*/

        .spec_add_cart_btn {
            width: 345rpx;
            height: 80rpx;
            background: var(--addCartBg2);
            border-radius: 40rpx 0 0 40rpx;
            border: var(--addCartBorder);
            font-size: 30rpx;
            
            font-weight: 500;
            color: var(--buyNowColor);
            text-align: center;
            line-height: 80rpx;
            &.spec_btn_only {
                background: var(--confirmBtnBgColor2);
                color: var(--confirmBtnTextColor);
            }
        }
        .spec_ecbuy_btn{
            width: 100%;
            height: 80rpx;
            background: var(--tagColor);
            border-radius: 40rpx;
            font-size: 30rpx;
            
            font-weight: 500;
            color: var(--prizeColor2);
            text-align: center;
            line-height: 80rpx;
            margin: 0rpx 30rpx;
        }
        .spec_buy_btn {
            width: 345rpx;
            height: 80rpx;
            background: var(--tagColor);
            border-radius: 0 40rpx 40rpx 0;
            font-size: 30rpx;
            
            font-weight: 500;
            color: var(--prizeColor2);
            text-align: center;
            line-height: 80rpx;
        }
        &.disable .spec_add_cart_btn{
            opacity: .4;
        }
        &.disable .spec_buy_btn{
            opacity: .4;
        }
        .spec_not_stock {
            background: var(--buyNowBg1);
            border-radius: 40rpx;
            font-size: 30rpx;
            
            font-weight: 600;
            color: var(--prizeColor2);
            text-align: center;
            opacity: 0.4;
            line-height: 80rpx;
        }

        .spec_seckill_btn {
            &.disable{
                opacity: .4;
            }
            background: var(--tagColor);
            border-radius: 40rpx;
            font-size: 30rpx;
            
            font-weight: 500;
            color: var(--prizeColor2);
            text-align: center;
            line-height: 80rpx;
        }

        .spec_btn_only {
            width: 690rpx;
            height: 80rpx;
            border-radius: 40rpx;
            text-align: center;
            line-height: 80rpx;
        }

        .specifications_btn2 {
            width: 690rpx;
            height: 80rpx;
            background: linear-gradient(45deg, #FF5C00 0%, #FCE000 0%, #FE8300 0%, #FB9721 100%);
            border-radius: 40rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28rpx;
            
            font-weight: 500;
            color: #FFFFFF;
            line-height: 40rpx;
        }

        .specifications_bottom_btn3 {
            width: 690rpx;
            height: 80rpx;
            background: linear-gradient(45deg, #FF5D00 0%, #FCE000 0%, #FE8400 0%, #FB9721 100%);
            border-radius: 40rpx;
            font-size: 28rpx;
            
            font-weight: normal;
            color: #FFFFFF;
            line-height: 40rpx;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .specifications_bottom_btn4 {
            width: 690rpx;
            height: 80rpx;
            background: linear-gradient(45deg, #FB2D2D 0%, #FC572A 100%);
            border-radius: 40rpx;
            font-size: 28rpx;
            
            font-weight: normal;
            color: #FFFFFF;
            line-height: 40rpx;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .specification_add {
            width: 347rpx;
            height: 80rpx;
            background: linear-gradient(45deg, #FF7918 0%, #FEA00D 100%);
            border-radius: 40rpx 0 0 40rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 28rpx;
        }

        .specification_add text:nth-of-type(1),
        .specification_buy text:nth-of-type(1) {
            margin-right: 20rpx;
        }

        .specification_buy {
            width: 343rpx;
            height: 80rpx;
            background: linear-gradient(45deg, #FB2D2D 0%, #FC572A 100%);
            border-radius: 0 40rpx 40rpx 0;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 28rpx;
        }
    }
}
button {
    padding: 0;
    margin: 0;
}
</style>