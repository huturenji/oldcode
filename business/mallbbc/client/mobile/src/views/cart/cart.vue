<!-- 购物车 -->
<template>
    <view :style="{paddingBottom: containerPaddingBottom}" @click="closeMask">
        <!-- #ifndef MP-WEIXIN -->
        <uni-nav-bar color='#333' :left-icon="nav_left_icon" :title="$L('')">
            <block slot="left">
                <view class="adressBar" @click="showAddressList">
                    <text class="iconfont icon_location fontScaleIgnore"></text>
                    <text class="deliver_goods_title fontScaleIgnore">{{$L('配送至:')}}</text>
                    <text class="adressMark fontScaleIgnore" v-if="choosedAddress && choosedAddress.provinceCode">{{choosedAddress.detailAddress}}</text>
                    <text v-else class="adressDefault fontScaleIgnore">{{$L('请添加地址')}}</text>
                </view>
            </block>
            <template slot="right">
                <text class="navbarTxt fontScaleIgnore" @click="manageCart">{{ topRightText }}</text>
            </template>   
        </uni-nav-bar>
        <!-- #endif -->
        <!-- #ifdef MP-WEIXIN -->
        <view class="cart_header"
            v-if="tempList && tempList.storeCartGroupList && tempList.storeCartGroupList.length > 0">
            <view class="cart_header_text" v-if="settings && settings.length > 0">
                <image :src="settings[1]" mode="" v-if="settings[1]"></image>
                <text v-if="settings[0]">{{settings[0]}}</text>
            </view>
            <view class="cart_header_btn" @click="manageCart">{{topRightText}}</view>
        </view>
        <!-- #endif -->
        <view class="attribute_dom">
            <view :class="[currentTab === 0 ? 'check' : '',allData,text]" @click="getCartAllData()">{{$L('全部 [')}}{{allNum}}{{$L(']')}}</view>
            <view :class="[reduceNum === 0 ? 'noData' : currentTab === 1 ? 'check' : '',text]" @click="getCartReduceData()">{{$L('降价 [')}}{{reduceNum}}{{$L(']')}}</view>
            <view class="filter" >{{$L('')}}</view>
        </view>
        <view class="cart-list-box">
            <view class="cart-list">
                <view class="shop_list_wrap" v-if="tempData.storeCartGroupList && tempData.storeCartGroupList.length>0">
                    <view class="shop_item" v-for="(item1) in tempData.storeCartGroupList" :key="item1.storeId">
                        <view class="shop_item_top_box" :class="{pad10:item1.freightState==1 && item1.storeOriginalFreight>0}">
                        <view class="shop_item_top">
                            <!-- 店铺这一层级的选中与非选中 -->
                            <text :class="[shopCheckStyle(item1)]" @click="changeSelectState('shop', item1)"></text>

                            <view style="display: flex;align-items: center;" @click.stop="toShopDetail(item1)">
                                <view :class="{ownStore:item1.storeId==6}" class="shop_icon"></view>
                                <view class="shop_name">{{item1.storeName}}</view>
                            </view>
                            <image :src="imgUrl+'goods/coupon.png'" mode="" class="coupon_icon"
                                @click="getShopCouponModule(item1.storeId)" v-if="!editFlag && item1.hasCoupon"></image>
                        </view>
                        <!-- 凑单减运费  1.有配规则并且开启。2.该店铺下有勾选商品。3.已勾选商品运费大于0并且有能减免的希望。4.当前已勾选商品运费小于运费抵扣金额6元-->
                        <view v-if="item1.freightState==1 && item1.storeOriginalFreight>0" class="freight_box">
                            <view v-if="item1.makeUpGoodsAmount>0" class="freight_con flex_row_between_center">
                                <view class="freight_con_box flex_row_start_center">
                                    <view class="makeUp_amount">{{`还差`}}
                                        <text class="num-font">{{item1.makeUpGoodsAmount}}</text>{{item1.freightDeference==-1?'元免运费':'可减'}}
                                        <text v-if="item1.freightDeference!=-1"><text class="num-font">{{item1.freightDeference}}</text>{{`元运费`}}</text>
                                    </view>
                                    <view @click="openFreightRules(item1.storeId)" class="ruels_tips"></view>
                                </view>
                                <view class="add_on_amount" @click="makeUpAmount(item1.link)">{{$L('去凑单')}}</view>
                            </view>
                            <view v-else class="freight_con flex_row_start_center">
                                <view v-if="item1.freightDeference==-1" class="makeUp_amount">{{$L('已免运费')}}</view>
                                <view v-else class="makeUp_amount">{{$L('已减 ')}}<text class="num-font">{{item1.freightDeference}}</text>{{$L(' 元运费')}}</view>
                                <view @click="openFreightRules(item1.storeId)" class="ruels_tips"></view>
                            </view>
                        </view>
                        </view>
                        <!-- 购物车列表 -->
                        <view v-for="(item2,index2) in item1.promotionCartGroupList" :key="unitKey(item2)">
                            <template v-if="item2.promotionType!=0 && item2.extraInfoVOList">
                                <view class="common_border" v-if="index2!=0"></view>
                                <view class="discountWrap">
                                    <view class="discount_icon">{{$L('满减')}}</view>
                                    <view class="discount_content omit2">
                                        {{promotionContext(item2)}}
                                        <!-- <view class="discount_left" v-for="(promotionItem,ind) in item2.extraInfoVOList" :key="ind">
                                            <view class="promotion_text">
                                                <view class="discount_text">
                                                    <richText :decoItem="formatePromotionDes(promotionItem)"></richText>
                                                    <text v-if="ind != (item2.extraInfoVOList.length-1)">{{$L(',')}}</text>
                                                </view>
                                            </view>
                                        </view> -->
                                    </view>
                                </view>
                            </template>
                            <view class="discount_activity" v-for="(item,index) in item2.cartList" :key="item.cartId">
                                <view class="common_border" v-if="index == 0&&index2!=0&&!(item2.promotionType!=0 && item2.extraInfoVOList)"></view>
                                <view class="cart-item">
                                    <!-- 长按商品出现蒙层及操作 start -->
                                    
                                    <swiper-action
                                        @cellOpen="curOperateId = item.sku"
                                        @cellMoving="cellMoving => isCellMoving = cellMoving"
                                        :cellShow="curOperateId === item.sku"
                                    >
                                        <view class="image-wrapper flex_row_start_center">
                                            <!-- 商品这一层级的选中与非选中 -->
                                            <text :class="[goodsCheckStyle(item)]" @click="changeSelectState('goods', item)"></text>

                                            <view class="goods-img" @click.stop="goGoodsDetail(item.sku,item.spu)">
                                                <image :src="item.mainImage"></image>
                                                <view class="mask" v-if="item.productState == 3">
                                                    <view class="text">
                                                        <view>{{$L('库 存')}}</view>
                                                        <view>{{$L('不 足')}}</view>
                                                    </view>
                                                </view>
                                            </view>
                                        </view>
                                        <view class="item-right">
                                            <view class="right_top"
                                                @click.stop="goGoodsDetail(item.sku,item.spu)">
                                                <view
                                                    :class="item.productState==3?'title stock_not_enough':'title'">{{item.skuName}}</view>
                                                <text class="attr" v-if="item.specInfo">{{item.specInfo}}</text>
                                            </view>
                                            <!-- <view class="goods_spec">{{item.specValues}}</view> -->
                                            <view v-if="item.reduction" class="reduce">{{$L('比加入时下降')}}{{item.reductionPrice}}{{ $L('元') }}</view>
                                            <!--活动描述 start-->
                                            <view v-if="item.singlePromotion!=null && (item.singlePromotion.promotionType == 106 || item.singlePromotion.promotionType==104)" class="ecbuy">
                                                <activeLabel
                                                :activeName="item.singlePromotion.promotionName" 
                                                :startTime="item.singlePromotion.startTime" 
                                                :endTime="item.singlePromotion.endTime" 
                                                @activeNoticeEvevt="getCartData"
                                                ></activeLabel>
                                            </view>
                                            <!--活动描述 end-->
                                            <view class="goods_min_number fontScaleIgnore" v-if='item.lowestBuy>1'>{{item.lowestBuy}}件起购</view>
                                            <view class="changegoods">
                                                <view class="trade_spec_btn"
                                                    v-if="!editFlag"
                                                    @click="showspecBox(item)">
                                                    <text class="omit">{{item.specValues}}</text>
                                                    <text v-if="item.specValues!='默认'" class="iconfont icon_arrow_down"></text>
                                                </view>
                                                <view class="trade_promotion_btn"
                                                    v-if="!editFlag && item.attendFullReduction"
                                                    @click="showPromotionBox(item,item2)">
                                                    <text>{{$L('换促销')}}</text>
                                                    <text class="iconfont icon_arrow_down"></text>
                                                </view>
                                            </view>
                                            <view class="right_bottom flex_row_between_center">
                                                <view class="right_bottom_left fontScaleIgnore">
                                                    <view class="price_wrap price_wrap_hide num-font"
                                                        >
                                                        <text class="unit rmb">¥</text><text
                                                            class="price_int">{{item.isShowCloseBtn ==
                                                            true?item.productPrice:$getPartNumber(item.productPrice,'int')}}</text><text
                                                            class="price_decimal">{{item.isShowCloseBtn ==
                                                            true?'':$getPartNumber(item.productPrice,'decimal')}}</text>
                                                    </view>
                                                </view>
                                                <view :class="item.productState == 3?'goods_num_wrap':'exceed_price_wrap'">

                                                    <block>
                                                        <uni-number-box
                                                            class="step"
                                                            :min="item.lowestBuy ? item.lowestBuy : 1"
                                                            :value="item.buyNum"
                                                            :inputClass="'cartInput'+item.cartId"
                                                            @change="numberChange($event,item)"
                                                        >
                                                        </uni-number-box>
                                                    </block>
                                                    <block v-if="item.isShowCloseBtn == true">
                                                        <image :src="closeImg" mode="" class="close_img"
                                                            @click="closeBigPriceBox(item.cartId,item.spu)">
                                                        </image>
                                                    </block>
                                                </view>
                                            </view>
                                            <view v-if="item.takeHomePrice!=null && item.takeHomePrice<item.productPrice" class="takeHomePriceBox flex_row_start_center">
                                                <text>{{$L('预估到手价')}}</text>
                                                <view class="price_box">
                                                    <text class="unit">¥ </text>
                                                    <text class="num-font big">{{$getPartNumber(item.takeHomePrice,'int')}}</text>
                                                    <text class="num-font small">{{$getPartNumber(item.takeHomePrice,'decimal')}}</text>
                                                </view>
                                            </view>
                                            <!-- 参考京东 暂时屏蔽划线价 只显示实时价 2022/6/14 吴嘉琪 6/29加上-->
                                            <view v-if='item.productOriginalPrice && item.singlePromotion && item.singlePromotion.state == 2' class='del_price rmb fontScaleIgnore'>
                                                <text class="unit">¥</text>
                                                <text>{{$getPartNumber(item.productOriginalPrice,'int')}}</text>
                                                <text>{{$getPartNumber(item.productOriginalPrice,'decimal')}}</text>
                                            </view>
                                        </view>
                                        <template slot="right">
                                            <view class="rightContent flex_row_center_center">
                                                <view
                                                    class="move"
                                                    @click.stop="operateCartGoodsModule(item)"
                                                    v-if="item.isShowCollectBtn == true"
                                                >
                                                    <view>
                                                        <view>{{$L('移入')}}</view>
                                                        <view>{{$L('收藏')}}</view>
                                                    </view>
                                                </view>
                                                <view class="del" @click.stop="operateCartGoods('del',item)">
                                                    {{$L('删除')}}
                                                </view>
                                            </view>
                                        </template>
                                    </swiper-action>
                                <!-- 长按商品出现蒙层及操作 end -->
                                </view>
                                <view v-if="item.isBuyTogetherPromotion" class="ecbuyTips">
                                    <view class="text">当前商品正在参与【一起买】活动，请前往商品详情查看购买。</view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
                <!-- 空白页 start-->
                <view
                    v-if="loadedDataFlag && tempData.storeCartGroupList && tempData.storeCartGroupList.length==0"
                    class="flex_column_start_center empty_part">
                    <view class="img"></view>
                    <text class="tip_con">{{$L('这里空空如也~快去商品中心加购商品吧！')}}</text>
                    <view class="ope_btn flex_row_center_center" @click="goGoodsList()">
                        {{$L('马上去逛逛')}}
                    </view>
                </view>
                <!-- 空白页 end-->
                <!-- 失效购物车列表 -->
                <view class="invalid_list_wrap" v-if="tempData.invalidList&&tempData.invalidList.length>0">
                    <view class="invalid_list_title_wrap">
                        <view class="invalid_list_title">
                            <text>{{$L('失效商品')}}{{tempData.invalidList.length}}{{$L('件')}}</text>
                            <text @click="clearFailureGoods('open')">{{$L('清空失效商品')}}</text>
                        </view>
                        <view class="common_border"></view>
                    </view>
                    <view class="invalid_list_content">
                        <view class="invalid_list_item" v-for="(item2,index2) in tempList.invalidList" :key="index2">
                            <view class="invalid_icon">{{$L('失效')}}</view>
                            <view class="invalid_img">
                                <image :src="item2.mainImage" mode=""></image>
                            </view>
                            <view class="invalid_goods_wrap">
                                <view class="invalid_goods_name">{{item2.skuName}}</view>
                                <text class="invalid_goods_spec" v-if="item2.specValues">{{item2.specValues}}</text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <!-- 底部菜单栏 -->
            <view class="action-section flex_row_between_center" :style="{zIndex:detailsPopupShow?1000:195}" :class="{action_section_edit:editFlag}"
                v-if="tempList.storeCartGroupList && tempList.storeCartGroupList.length > 0">
                <view @click="check(tempList.checkedAll)" class="checkbox flex_row_start_center ">
                    <text :class="[checkState(tempList.checkedAll)]"></text>
                    <text class="check_all_tit">{{$L(' 全选')}}</text>
                </view>
                <!-- 去结算样式 start -->
                <template v-if='!editFlag'>
                    <view class="total-box">
                        <view class="money" :class="{marTop:tempList.totalDiscount && tempList.totalDiscount > 0}">
                            <text>合计：</text>
                            <view class="price_wrap num-font">
                                <text class="unit fontScaleIgnore">¥</text><text
                                    class="price_int fontScaleIgnore">{{$getPartNumber(tempList.totalAmount,'int')}}</text><text
                                    class="price_decimal fontScaleIgnore">{{$getPartNumber(tempList.totalAmount,'decimal')}}</text>
                            </view>
                        </view>
                        <!-- 合计显示优惠的金额 -->
                        <view class="money discount" v-if="tempList.totalDiscount && tempList.totalDiscount > 0">
                            <text>已减：</text>
                            <view class="price_wrap num-font">
                                <text class="unit fontScaleIgnore">¥</text><text
                                    class="price_int fontScaleIgnore">{{$getPartNumber(tempList.totalDiscount,'int')}}</text><text
                                    class="price_decimal fontScaleIgnore">{{$getPartNumber(tempList.totalDiscount,'decimal')}}</text>
                            </view>
                            <view @click="showDiscountDetails" class="discount_details flex_row_start_center">
                                <view>{{$L('优惠明细')}}</view>
                                <view class="triangle_iocn" :class="{triangle_iocn_down:detailsPopupShowFlag}"></view>
                            </view>
                        </view>
                    </view>
                    <button type="primary" class="no-border confirm-btn flex_row_center_center" @click="createOrderModule">
                        {{$L('结算')}}<text class="settle_num">({{tempList.totalCheck}})</text>
                    </button>
                </template>
                <!-- 去结算样式 end -->
                <!-- 点击管理之后的样式 start -->
                <template v-if="editFlag">
                    <view class="flex_row_end_center">
                        <view class="fast_del" @click="openFastDelBox">
                            <text class="iconfont icon_clean"></text>
                            <view class="fast_del_text">{{$L('快速清理')}}</view>
                        </view>
                        <view class="move_collect flex_row_center_center" @click="batchCollectModule"
                            v-if="tempList.isShowCollectBtn">{{$L('移入收藏夹')}}</view>
                        <view class="del_more flex_row_center_center" @click="batchDelete('open')">{{$L('删除所选')}}</view>
                    </view>
                </template>
                <!-- 点击管理之后的样式 end -->
            </view>
        </view>
        <!--  todo 暂时屏蔽掉购物车页面 最下侧的推荐甄选商品列表的功能 屏蔽日期：2021/11/18 -->
        <!-- 推荐商品 start -->
        <!-- 暂时屏蔽掉推荐商品列表 屏蔽日期:2022-9-22 -->
        <!-- <template v-if="false">
            <recommendGoods ref='recomment_goods' @onAddedCartSucc="onAddedCartSucc" />
        </template> -->
        <!-- 推荐商品 end-->
        <!-- 快速清理弹窗 -->
        <bottomPopup ref="fastdelPoppup" type="bottom" :showTitle="false" :showCloseBtn="false" class="fast_del_model" height="928rpx">
            <view class="fast_del_box">
                <view class="fast_del_content">
                    <view class="fast_del_top">
                        <view class="top_text">
                            <view class="fast_del_top_text strong">{{$L('快速清理')}}</view>
                            <view class="fast_del_top_calc" v-if="orderList && orderList.goodsNum > 0">
                                <view class="fast_del_top_main strong">{{orderList.totalCheck}}</view>
                                <view>{{$L('/')}}</view>
                                <view>{{orderList.goodsNum}}</view>
                            </view>
                        </view>
                        <view class="top_icon">
                            <view class="top_icon_content">
                                <image :src="imgUrl+'common/icon/btn_common_close1.svg'" mode="" @click="closeFastDelBox"></image>
                            </view>
                        </view>
                    </view>
                    <scroll-view scroll-y="true" class="fast_del_middle">
                        <view class="fast_del_list" v-if="orderList && orderList.goodsNum > 0">
                            <view v-for="(item,index) in orderList.goodsList" :key="index">
                                <view class="fast_del_item" v-if="item && item.List && item.List.length > 0">
                                    <view class="fast_del_name">
                                        <view @click="checkAll(index)" class="checkbox flex_row_start_center ">
                                            <view class="checkAllIcon nor" v-if="!item.isCheckedAll"></view>
                                            <view class="checkAllIcon sel" v-else-if="item.isCheckedAll"></view>
                                            <text class="check_name">{{item.name}}</text>
                                        </view>
                                    </view>
                                    <view class="fast_del_desc">
                                        <view class="fast_del_desc_item"  v-for="(item1,ind) in item.List" :key="ind" @click="singleCheck(index,ind)">
                                            <view class="single_check" >
                                                <view class="checkAllIcon nor" v-if="!item1.isChecked"></view>
                                                <view class="checkAllIcon sel" v-else-if="item1.isChecked"></view>
                                            </view>
                                            <view class="good_img">
                                                <view class="mask" v-if="index == 0">
                                                    <view v-if="item1.productState == 3" class="text">
                                                        <view>{{$L('库 存')}}</view>
                                                        <view>{{$L('不 足')}}</view>
                                                    </view>
                                                    <view v-else class="text">{{$L('下架')}}</view>
                                                </view>
                                                <image :src="item1.mainImage" mode=""></image>
                                            </view>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </view>
                        <view v-else class="fast_del_empy">
                             <view class="fast_del_empy_content">
                                <view class="content_img"></view>
                                <view class="tip_con">{{$L('暂无商品')}}</view>
                            </view>
                        </view>
                    </scroll-view>
                    <view class="fast_del_bottom" v-if="orderList && orderList.goodsNum > 0">
                        <view class="move_collect flex_row_center_center" @click="batchCollectModule('fastCollect')" >
                            <text class="move_text">{{$L('移入收藏')}}</text>
                        </view>
                        <view class="del_more flex_row_center_center" @click="batchDelete('fastDelete')">
                            <text class="del_text">{{$L('删除')}}</text>
                        </view>
                    </view>
                </view>
            </view>
        </bottomPopup>
        <!-- 快速清理弹窗 -->
        <!-- 换促销弹框 -->
        <bottomPopup ref="popup" type="bottom" :showTitle="false">
            <view class="promotion_box">
                <block v-for="(item,index) in promotion_goods_info" :key="index">
                    <view class="promotion_goods_wrap">
                        <view class="promotion_goods_img_wrap">
                            <image :src="item.mainImage" mode="aspectFit" class="promotion_goods_img"></image>
                        </view>
                        <view class="promotion_goods_right">
                            <view class="promotion_goods_price">
                                <view class="promotion_goods_price_now">
                                    <text class="small_price">￥</text>
                                    <text class="big_price">{{$getPartNumber(item.productPrice,'int')}}</text>
                                    <text class="small_price">{{$getPartNumber(item.productPrice,'decimal')}}</text>
                                </view>
                            </view>
                            <view class="promotion_goods_spec">
                                {{$L('已选：')}}{{item.specValues == ''?'默认规格':item.specValues}}
                            </view>
                        </view>
                    </view>
                    <scroll-view class="promotion_rules_wrap" scroll-y="true">
                        <view class="promotion_rules_title">{{$L('修改促销')}}</view>
                        <view class="promotion_rule_item" v-for="(item2,index2) in promotion_list" :key="index2" @click="changePromotion(index2,item2.desctiption,item2.promotionId,item2.promotionType)">
                            <text :class="[checkState(promotionId == item2.promotionId && promotionType==item2.promotionType)]"></text>
                            <template>
                                <view class="promotion_text_wrapper">
                                    <view class="promotion_text" v-for="(promotionItem,ind) in item2.discountExtendInfoList" :key="ind">
                                        <view>{{getDiscount(item2.promotionType,promotionItem)}}</view>
                                        <!-- <richText :decoItem="formatePromotionDes(promotionItem)"></richText> -->
                                    </view>
                                </view>
                                
                            </template>
                        </view>
                    </scroll-view>
                </block>
                <view class="confirm_btn_wrap">
                    <view class="confirm_btn" @click="confirmChangePromotion">{{$L('确定')}}</view>
                </view>
            </view>
        </bottomPopup>

        <!-- 换规格弹框 -->
        <bottomPopup ref="specpopup" type="bottom" :showTitle="false">
            <view class="spec_model_content">
                <view class="spec_model_top">
                    <view class="spec_model_goods">
                        <view class="spec_goods_image" v-if="goodsData && goodsData.mainImage">
                            <image :src="goodsData.mainImage" mode="aspectFit"></image>
                        </view>
                        <view class="spec_goods_right">
                            <view class="spec_goods_price_con">
                                <view class="spec_prices">
                                    <!-- 正常商品start -->
                                    <view class="spec_goods_price num-font" v-if="goodsData && goodsData.productPrice">
                                        <text>￥</text>
                                        <text>{{$getPartNumber(goodsData.productPrice,'int')}}</text>
                                        <text>{{$getPartNumber(goodsData.productPrice,'decimal')}}</text>
                                    </view>
                                    <!-- 正常商品end -->

                                    <!-- 暂无报价start -->
                                    <view class="spec_goods_price num-font"
                                    v-else
                                    >
                                        <text>￥</text>
                                        <text class="no_price">暂无报价</text>
                                    </view>
                                    <!-- 暂无报价end -->
                                </view>
                            </view>
                            <!-- 普通商品 start -->
                            <view class="spec_goods_des">
                                {{$L('已选规格')}}：
                                <text v-if="goodsData && goodsData.specValues" class="des_detail">{{goodsData.specValues}}</text>
                                <text v-else>{{$L('默认')}}</text>
                            </view>
                            <!-- 普通商品 end -->

                        </view>
                    </view>
                </view>

                <!-- 当有区域销售和无货的时候，此时样式需要特殊处理 -->
                <scroll-view scroll-y="true" class="spec_content" >
                    <view class="spec_list" v-if="specs && specs.length > 0">
                        <view class="spec_list_pre" v-for="(item,index) in specs" :key="index">
                            <view class="spec_list_pre_name">{{item.specName}}</view>
                            <template v-for="(item1,index1) in item.specAttrList">
                                <block v-if="item && item.specAttrList && item.specAttrList.length > 0"
                                    :key='index1'>
                                    <view class="spec_list_pre_desc"
                                        :class="{spec_list_pre_desc_active:arrhaveitem(preSku,item1.skus),spec_list_pre_desc_disabled:'isDisable'==setSpecSkuType(goodsData.sku,item1.skus,item.dim)}" :key="index1" @click="changeSpecSku(goodsData.sku,item1.skus,item.dim)">
                                        <view class="spec_list_pre_con">
                                            <text>{{item1.specValue}}</text>
                                        </view>
                                    </view>
                                </block>
                            </template>
                        </view>             
                    </view>
                    
                </scroll-view>
                <view class="confirm_btn_wrap">
                    <view class="confirm_btn" @click="confirmChangespecon()">{{$L('确定')}}</view>
                </view>
            </view>
        </bottomPopup>

        <!-- 优惠券弹框 start -->
        <bottomPopup ref="couponPopup" type="bottom" text="领取优惠券">
            <view class="coupon_model">
                <!-- 有优惠券 -->
                <scroll-view class="coupon_model_list" scroll-y="true" v-if="coupon_list && coupon_list.length>0">
                    <view class="my_coupon_pre" v-for="(item,index) in coupon_list" :key="index">
                        <view class="coupon_pre_top">
                            <view class="coupon_pre_left fontScaleIgnore">
                                <!-- 固定券 start -->
                                <view class="coupon_pre_price fitFont" v-if="item.couponType == 1">
                                    <text class="unit">¥ </text>
                                    <text class="price_int">{{item.publishValue}}</text>
                                </view>
                                <!-- 固定券 end -->
                                <!-- 折扣券 start -->
                                <view class="coupon_pre_price fitFont" v-if="item.couponType == 2">
                                    <view class=""></view>
                                    <text
                                        class="price_int">{{filters.toSplit(filters.toFixNum(item.publishValue,1))[0]}}</text>.
                                    <text
                                        class="price_decimal">{{filters.toSplit(filters.toFixNum(item.publishValue,1))[1]}}</text>
                                    <text class="price_decimal">{{$L('折')}}</text>
                                </view>
                                <!-- 折扣券 end -->
                                <!-- 随机券 start -->
                                <view class="coupon_pre_price fitFont" v-if="item.couponType == 3">
                                    <text class="unit">¥ </text>
                                    <text class="price_int">{{$getPartNumber(item.randomMin,'int')}}</text>
                                    <text class="price_decimal" v-if="$getPartNumber(item.randomMin,'decimal')!='.00'">{{$getPartNumber(item.randomMin,'decimal')}}</text>
                                    <text class="unit">~</text>
                                    <text class="unit">¥ </text>
                                    <text class="price_int">{{$getPartNumber(item.randomMax,'int')}}</text>
                                    <text class="price_decimal" v-if="$getPartNumber(item.randomMax,'decimal')!='.00'">{{$getPartNumber(item.randomMax,'decimal')}}</text>
                                </view>
                                <!-- 随机券 end -->
                                <view class="coupon_pre_active" :style="{fontSize:fitfontSize['active'][item.couponContent.length]}">{{item.couponContent}}</view>
                            </view>
                            <view class="coupon_pre_cen">
                                <view class="coupon_pre_title">{{item.couponName}}</view>
                                <view class="coupon_pre_time lineH16 fontScaleIgnore" v-if="item.publishStartTime.indexOf(':')==-1">{{item.publishStartTime}}~{{item.publishEndTime}}</view>
                                <view class="coupon_pre_time lineH12 fontScaleIgnore" v-else>
                                    <view>{{item.publishStartTime}}~</view>
                                    <view>{{item.publishEndTime}}</view>
                                </view>
                                <view class="coupon_pre_rules" @click="descriptionOpen(item.couponId)">
                                    <text>{{$L('使用规则')}}</text>
                                    <image :src="item.isOpen ? imgUrl + 'common/icon/uptriangle2@2x.png' : imgUrl + 'common/icon/btn_common_downtriangle2@2x.png'"
                                            mode="" draggable="false"></image>
                                </view>
                            </view>
                            <view class="kacao kacao1" v-if="item.receivedState != 3" :class="{kacao1_notUse:item.publishStartTime.indexOf(':')==-1}"></view>
                            <view class="kacao kacao2" v-else :class="{kacao2_haveExpired:item.publishStartTime.indexOf(':')==-1}"></view>
                            <view class="coupon_pre_right">
                                <view v-if="item.receivedState == 1" class="coupon_right haveReceived">
                                    <view class="coupon_progress" v-if="item.receivedState == 1">
                                        {{$L('已抢')}}{{item.robbedRate}}%
                                        <view class="progress_con">
                                            <progress :percent="item.robbedRate" stroke-width="3" activeColor="#FFFFFF"
                                                backgroundColor="rgba(255,255,255,0.5)" borderRadius='2px' />
                                        </view>
                                    </view>
                                    <view @click="goReceive(item)">{{$L('立即领取')}}</view>
                                </view>
                                <view v-else-if="item.receivedState == 2" class="coupon_right"><image :src="imgUrl + 'coupon/icon_yhq_yilingqu.svg'" mode="" draggable="false"></image></view>
                                <view v-else class="coupon_right haveExpired"><image :src="imgUrl + 'coupon/icon_common_yiqiangwan.svg'" mode="" draggable="false" /></view>
                            </view>
                        </view>
                        <view class="coupon_rules" v-if="item.isOpen == true">
                            <view>{{$L('优惠券类型：')}}<text class="coupon_type_text">{{$L('【')}}{{item.storeId==0?'平台优惠券':'店铺优惠券'}}{{$L('】')}}</text></view>
                            <view class="coupon_rules_title"><text>{{item.description}}</text></view>
                        </view>
                        <view class="coupon_type fontScaleIgnore" :class="{suiji:item.couponType==3,zhekou:item.couponType==2}">{{item.couponTypeValue}}</view>
                    </view>
                </scroll-view>
                <!-- 无优惠券 -->
                <view class="empty_coupon_wrap" v-if="coupon_list && coupon_list.length == 0">
                    <view class="empty_coupon_img"></view>
                    <view class="empty_coupon_text">{{$L('该店铺暂无优惠券~')}}</view>
                </view>
            </view>
        </bottomPopup>
        <!-- 优惠券弹框 end -->
        <!-- 商品全部，部分无货弹窗 start-->
        <view id="store_no_good" v-if="store_show_no_good" @touchmove.stop.prevent="moveHandle">
            <view class="content">
                <view class="content_title">
                    <text> {{no_good_info.stateValue}}</text>
                    <image @tap="hide_good_dialog" :src="imgUrl+'common/icon/store_no_good_cancel.png'" mode=""></image>
                </view>
                <view class="good_list">
                    <view v-for="(item,index) in no_good_info.productList" :key='index' class="good_item">
                        <image :src="item.mainImage" mode=""></image>
                        <view class="good_info">
                            <view class="good_name">
                                {{item.skuName}}
                            </view>
                            <view class="good_spec">
                                <text>{{item.specValues}}</text>
                            </view>
                            <text class="num">*{{item.buyNum}}</text>
                        </view>
                    </view>
                </view>
                <view class="part_no_goods_another">
                    <view class="return" @click="refreshCartInfo">
                        {{$L('确定')}}
                    </view>
                </view>
            </view>
        </view>
        <!-- 商品全部，部分无货弹窗 end-->
        <uni-popup ref="clearPopup" type="dialog" @change='popChange'>
            <uni-popup-dialog type="input" title="提示" content="确定清空所有失效商品?" :duration="2000"
                @confirm="clearFailureGoods('confirm')"></uni-popup-dialog>
        </uni-popup>
        <!-- 商品全部，部分无货弹窗 end-->
        <uni-popup ref="batchDelPopup" type="dialog" @change='popChange'>
            <uni-popup-dialog type="input" title="提示" :content="`确定删除${tempList.totalCheck}件商品?`" :duration="2000"
                @confirm="batchDelete('confirm')"></uni-popup-dialog>
        </uni-popup>
        <!-- 地址弹窗 start -->
        <bottomPopup ref="addressChooseComp" type="bottom" showType="show" text="配送地址" height="832rpx">
            <addressChoose
                v-model="choosedAddress"
                :useLocation="true"
                @close="addressPopClose"
            />
        </bottomPopup>
        <!-- 地址弹窗 end -->
        <!-- 随机优惠券 start -->
        <view :class="{'hide':!rondomMod,'random_coupon':true}" style="position: fixed;width: 750rpx;height:100vh;background:rgba(0,0,0,0.6);z-index: 1000;top:0">
            <view class="random_coupon_bg" :style="{backgroundImage:'url(' + imgUrl + 'coupon/random_bg.png)'}" @click="goMyCoupon()">
                <view class="random_coupon_price">￥{{rondomDes.publishValue}}</view>
                <view class="random_coupon_des">{{rondomDes.couponContent}}</view>
                <view class="close_btn" :style="{backgroundImage:'url(' + imgUrl + 'common/icon/close_screen.png)'}" @click.stop="close"></view>
            </view>
        </view>
        <!-- 随机优惠券 end -->
        <!-- 优惠明细弹框 start -->
        <bottomPopup ref="detailsPopup" type="bottom" height="832rpx" :showTitle="false">
            <view class="details_box">
                <view class="details_title flex_row_center_center">{{$L('优惠明细')}}</view>
                <view class="goods_amount flex_row_between_center">
                    <text>{{$L('商品总额')}}</text>
                    <text class="num-font">￥{{getTotalAmount}}</text>
                </view>
                <view class="goods_amount flex_row_between_center discount_amount">
                    <text>{{$L('共优惠')}}</text>
                    <text class="num-font">-￥{{tempList.totalDiscount}}</text>
                </view>
                <view class="details_rules_tips">{{$L('以上优惠不包括平台优惠、红包、云豆，请在确认页查看')}}</view>
            </view>
        </bottomPopup>
        <!-- 优惠明细弹框 end -->
        <!-- 运费规则弹框 start -->
        <uniPopup ref="freightRules">
            <view class="freightRules_box flex_column_between_start">
                <view>
                    <view class="title flex_row_center_center">{{$L('运费凑单说明')}}</view>
                    <view class="con">
                        <scroll-view :scroll-y="true" :show-scrollbar="true" class="scrollY">
                            <view v-if="freightRulesObj">
                                <view v-if="freightRulesObj.baseFreight!=-1">{{$L('1、店铺基础运费：')}}<text class="num-font">{{freightRulesObj.baseFreight}}</text>{{$L('元；')}}</view>
                                <view v-else>{{$L('1、店铺基础运费：具体以订单内显示的金额为准；')}}</view>
                                <view>
                                    {{$L('2、该店铺订单金额满')}}
                                    <text class="num-font" v-if="freightRulesObj.storeFreightFullAmount">{{freightRulesObj.storeFreightFullAmount}}</text>元
                                    <text v-if="freightRulesObj.freightDeference==-1">{{$L('免运费。')}}</text>
                                    <text v-else>减<text class="num-font">{{freightRulesObj.freightDeference}}</text>元运费。</text>
                                </view>
                                <view class="rules_tips">
                                    {{$L('注：店铺订单金额是指订单内该店铺所有商品的销售价*数量之和再扣除店铺优惠（包括店铺优惠券和店铺满减等）之后的金额，不包括平台优惠。')}}
                                </view>
                            </view>
                        </scroll-view>
                    </view>
                </view>
                <view class="close flex_row_center_center" @click="closeFreightRules">{{$L('我知道了')}}</view>
                <view class="close_icon" @click="closeFreightRules"></view>
            </view>
        </uniPopup>
        <!-- 运费规则弹框 end -->
    </view>
</template>
<script module="filters" lang="wxs" src="../../utils/filter.wxs"></script>
<script>
    import { mapState, mapMutations } from 'vuex';
    import uniNumberBox from "@/components/uni-number-box/uni-number-box.vue";
    // import recommendGoods from "@/components/goods/recommend.vue";
    import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue";
    import uniPopup from '@/components/uni-popup/uni-popup.vue';
    import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue';
    import richText from '@/components/decorate/rich-text/rich-text.vue';
    import addressChoose from "@/components/address/select";
    import cartHandler from "@/components/cart/handler";
    import activeLabel from "@/components/activeLabel/activeLabel";
    import goodsHandler from "@/components/goods/handler";
    import activityMinxin from '@/components/goods/thumb/minxin/activity.js'
    import bottomPopup from '@/components/bottom-popup/index.vue'
    import swiperAction from '@/components/swiper-action'
    import decorateHandler from '@/components/decorate/handler';
    import {lockScroll, unlockScroll, isNotEmpty, isEmpty, throttle, fitFontSize, accAdd,skipTo, deepCopy } from '@/utils/common.js'
    export default {
        components: {
            uniNumberBox,
            // recommendGoods,
            activeLabel,
            uniNavBar,
            uniPopup,
            uniPopupDialog,
            richText,
            addressChoose,
            bottomPopup,
            swiperAction
        },
        mixins:[activityMinxin],
        computed: {
            ...mapState(['hasLogin', 'cartData', 'userInfo', 'addressList', 'addressDone', 'defaultAddress']),
            containerPaddingBottom(){
                return !this.tempList.storeCartGroupList ? 0 : 'calc(var(--tabBarHeight) + var(--safe-area-inset-bottom))'
            },
            topRightText(){
                if(this.tempList?.storeCartGroupList?.length > 0){
                    return this.editFlag ? '完成' : '管理'
                }
                return ''
            },
            orderList(){
                if(isEmpty(this.tempList)){
                    return;
                }
                let orderList = {
                    goodsNum: this.tempList.availableCartNum + this.tempList.invalidList.length,
                    totalCheck: 0,
                    goodsList: [
                        {
                            name: '已失效商品',
                            List: this.tempList.invalidList,
                            isCheckedAll:0,
                        },
                        {
                            name: '1年前加入购物车',
                            List:[],
                            isCheckedAll:0,
                        },
                        {
                            name: '半年前加入购物车',
                            List:[],
                            isCheckedAll:0,
                        },
                        {
                            name: '30天前加入购物车',
                            List:[],
                            isCheckedAll:0,
                        },
                        {
                            name: '7天前加入购物车',
                            List:[],
                            isCheckedAll:0,
                        },
                        {
                            name: '7天内加入购物车',
                            List:[],
                            isCheckedAll:0,
                        },
                    ]
                }
                this.operateAllCarts((good, index) => {
                    if (!!good.createTime){
                        if (this.dateFlag(good.createTime,7)){
                            orderList.goodsList[5].List.push({cartId:good.cartId,isChecked:0,mainImage:good.mainImage,productState:good.productState})
                        }else if (this.dateFlag(good.createTime,30)){
                            orderList.goodsList[4].List.push({cartId:good.cartId,isChecked:0,mainImage:good.mainImage,productState:good.productState})
                        }else if (this.dateFlag(good.createTime,180)){
                            orderList.goodsList[3].List.push({cartId:good.cartId,isChecked:0,mainImage:good.mainImage,productState:good.productState})
                        }else if (this.dateFlag(good.createTime,365)){
                            orderList.goodsList[2].List.push({cartId:good.cartId,isChecked:0,mainImage:good.mainImage,productState:good.productState})
                        }else{
                            orderList.goodsList[1].List.push({cartId:good.cartId,isChecked:0,mainImage:good.mainImage,productState:good.productState})
                        }
                    }
                }, this.tempList);
                return orderList;
            },
            //店铺层级的选中样式
            shopCheckStyle(item1){
                return (item1) => {
                    if(item1.lackAll){
                        return 'stock_not_icon iconfont icon_check_radio'
                    }else if(item1.checkedAll){
                        return 'item_check iconfont icon_checked_radio'
                    }else{
                        return 'iconfont icon_check_radio'
                    }
                }
            },
            //商品层级的选中样式
            goodsCheckStyle(item){
                return (item) => {
                    if(this.editFlag){
                        if(item.isChecked){
                            return 'image-wrapper-check item_check iconfont icon_checked_radio'
                        }
                        if(!item.isChecked){
                            return 'image-wrapper-check iconfont icon_check_radio'
                        }
                    }else{
                        if(item.isBuyTogetherPromotion){
                            return 'stock_not_icon iconfont icon_check_radio'
                        }
                        if(item.isChecked && item.productState!=3){
                            return 'image-wrapper-check item_check iconfont icon_checked_radio'
                        }
                        if(!item.isChecked && item.productState!=3){
                            return 'image-wrapper-check iconfont icon_check_radio'
                        }
                        if(item.productState == 3){
                            return 'stock_not_icon iconfont icon_check_radio'
                        }
                        }
                }
            },
            //通用选中样式
            checkState(flag){
                return (flag) => {
                    if(flag){
                        return 'item_check iconfont icon_checked_radio'
                    }else{
                        return 'iconfont icon_check_radio'
                    }
                }
            },
            getTotalAmount() {
                return accAdd(this.tempList?.totalAmount?this.tempList.totalAmount:0,this.tempList?.totalDiscount?this.tempList.totalDiscount:0)
            }
        },
        data() {
            return {
                editFlag: false, //是否编辑标识
                total: 0, //总价格
                allChecked: false, //全选状态  true|false
                empty: false, //空白页现实  true|false
                cartList: [],
                nav_left_icon: '', //底部tab进入的话为空，否则为back
                curOperateId: '', //当前长按的商品购物车id,登录时为cartId，未登录时为goodsId
                tempList: {},
                tempData:{},
                reduceData:{},
                allNum:0,
                reduceNum:0,
                currentTab:0,
                isShowBigNumBox: -1, //是否展示价格过长样式
                isShow: true, //重载页面
                closeImg: getApp().globalData.imgUrl + 'common/icon/recharge_fail.png',
                isShowCloseBtn: false, //是否展示数量加减关闭按钮
                showPrice: '',
                ifOnShow: false, //从其他页面进入时重载当前页面
                isDisabled: false, //结算按钮是否禁用
                imgUrl: getApp().globalData.imgUrl,
                settings: [], //配置信息
                is_show_mask: true,
                is_show_empty: false, //是否显示空页面
                is_checked: true,
                is_show_more_rules: false, //是否展开优惠券使用规则
                coupon_list: null, //优惠券列表
                pageCurrent: 1, //优惠券列表，页
                pageSize: 10, //优惠券列表 每页的条数
                promotion_goods_info: [], //换促销商品信息
                promotion_list: [], //促销列表
                currIndex: 0,
                cartId: '',
                promotionDes: '',
                promotionId: '',
                promotionType: '',
                store_show_no_good: false,
                no_good_info: '',
                choosedAddress: {}, //选中的地址对象
                showAddressPop: false, //控制地址右侧弹窗的变量
                showAddressAnimate: false, //控制地址弹窗显示的动画
                fitfontSize:{
                    'active':{
                        19:'22rpx',
                        20:'22rpx',
                        21:'20rpx',
                        22:'20rpx',

                    }
                },
                rondomMod:false,    //随机弹框
                rondomDes:{},
                isCellMoving: false,
                decoData:[],//优惠券装修数据
                couponIds:[],//优惠券装修ids
                storeCouponList:[],//店铺优惠券信息
                currentStoreId:6, //当前优惠券弹框的storeId
                freightRulesObj:null,
                detailsPopupShowFlag:false,
                detailsPopupShow:false,
                specs:[],//商品规格集
                sku:'',//当前选中的商品规格
                preSku:''//切换规格后的规格
            };
        },
        onHide() {
            // this.ifOnShow = true
            // this.addressPopClose()
        },
        async onShow() {
            uni.showLoading()
            this.editFlag = false;
            this.getVuexAddress()
        },

        mounted() {
            // 注册地址初始化完成事件
            uni.$on('addressRequestDone', this.getVuexAddress)
            try {
                this.getDecoraData()//处理店铺右上角领券显示
            } catch(e) {

            }
        },
        onUnload() {
            uni.$off('addressRequestDone', this.getVuexAddress)
        },
        // todo 暂时屏蔽掉购物车页面 最下侧的推荐甄选商品列表的功能 屏蔽日期：2021/11/18 
        // onReachBottom() {
        //     this.$refs.recomment_goods.getMoreData();
        // },
        watch: {
            //显示空白页
            tempList(e) {
                if (e) {
                    let empty = e.storeCartGroupList && e.storeCartGroupList.length == 0 ? true : false;
                    if (this.empty !== empty) {
                        this.empty = empty;
                    }
                } else {
                    this.empty = true
                }
            },
            watch : {
                '$route' (to, from) {
                    // from 对象中要 router 来源信息.
                    // do your want
                }
            },

            //监听窗口打开状态
            showAddressPop(val){
                if(val){
                    lockScroll();
                }else{
                    unlockScroll();
                }
            },
            choosedAddress: {
                handler(val,oldVal){
                    if(!oldVal?.addressId || val?.addressId == oldVal?.addressId){
                        return
                    }else{
                        this.getCartData();
                    }
                },
                deep: true
            },
            '$store.state.cartData': {
                handler(val) {
                    this.tempList = deepCopy(val);
                    this.handleCartData();
                    if (this.currentTab == 1) {
                        this.getCartReduceData()
                    }
                    this.loadedDataFlag = true;
                },
                deep: true,
                immediate: true,
            }
        },
        // 监听顶部管理按钮
        onNavigationBarButtonTap(e) {
        },
        onPageScroll(e) {
            if (e.scrollTop > 0) {
                this.closeMask()
            }
        },
        methods: {
            ...mapMutations(['login']),
            getVuexAddress() {
                if (this.addressDone) {
                    this.choosedAddress = this.getAddressList();
                    if (this.hasLogin) {
                        this.getCartData();
                    } else {
                        this.initCartData();
                    }
                }
            },
            moveHandle() {},
            //只有promotionId和promotionType才能确定唯一的key标识
            unitKey(item){
                return `${item.promotionId}_${item.promotionType}`
            },
            // 隐藏商品无货弹窗
            hide_good_dialog() {
                this.store_show_no_good = false;
            },
            refreshCartInfo() {
                this.store_show_no_good = false;
                this.getCartData();
            },
            //关闭领取随机优惠券弹框
            close(){
                this.rondomMod = false;
            },
            //去我的优惠券列表页面
            goMyCoupon(){
                this.$Router.push('/pages/coupon/myCoupon')
            },
            /**
             * 处理活动描述
             */
            handlePromotion(product){
                let that = this;
                //处理秒杀描述
                if(product.singlePromotion?.promotionType==104){
                    let startTime = new Date(product.singlePromotion.startTime).getTime();
                    let endTime = new Date(product.singlePromotion.endTime).getTime();
                    function countdown(product){
                        let now = new Date().getTime();
                        let timeSpace = startTime - now;
                        let started = false;//活动是否开始
                        if(timeSpace > 0){
                            started = true;
                        }else{
                            timeSpace = now - endTime;
                        }
                        timeSpace = Math.abs(timeSpace) / 1000;
                        let day = parseInt(timeSpace / 60 / 60 / 24);
                        let hours = parseInt(timeSpace / 60 / 60);
                        let minutes = parseInt(timeSpace / 60 % 60);
                        let seconds = parseInt(timeSpace % 60);
                        // let secKillDay = !!day ? day + '<text class="normal">天</text>' : '';
                        let secKillHr = hours > 9 ? hours : '0' + hours;
                        let secKillMin = minutes > 9 ? minutes : '0' + minutes;
                        let secKillSec = seconds > 9 ? seconds : '0' + seconds;
                        let desc = `<text class='bold'>${secKillHr}:${secKillMin}:${secKillSec}</text>`;
                        if(started){
                            desc = '距离开始还有 ' + desc
                            timeSpace -= 1000;
                        }else{
                            timeSpace = now - endTime;
                            desc = '距离结束还有 ' + desc
                            timeSpace += 1000;
                        }
                        that.$set(product.singlePromotion, 'promotionText', desc);
                    }
                    countdown(product);
                    setInterval(()=>{
                        countdown(product);
                    }, 1000)
                }
            },
            
            getNum(num){
                let _num
                if(num.endsWith('.00')){
                    _num = parseFloat(num).toFixed(0)
                }else if(num.endsWith('0')){
                    _num = parseFloat(num).toFixed(1)
                }else{
                    _num = num
                }
                return _num
            },
            getDiscount(promotionType,item){
                const content = item.promotionDescription;
                const firstLeftBrackets = content.indexOf('<');
                const lastLeftBrackets = content.lastIndexOf('<');
                const firstRightBrackets = content.indexOf('>');
                const lastRightBrackets = content.lastIndexOf('>');
                const fullPrice = content.substring(firstLeftBrackets + 1, firstRightBrackets);
                const discount = content.substring(lastLeftBrackets + 1, lastRightBrackets);
                if (promotionType === 201) {
                    let _fullPrice = this.getNum(fullPrice)
                    let _discount = this.getNum(discount)
                    return `满${' '}${_fullPrice}${' '}减${' '}${_discount}`
                }
                if (promotionType === 202) {
                    let _fullPrice = this.getNum(fullPrice)
                    let _discount = this.getNum(discount)
                    return `每满${' '}${_fullPrice}${' '}减${' '}${_discount}`
                }
                if (promotionType === 203) {
                    let _fullPrice = this.getNum(fullPrice)
                    let _discount 
                    if(discount.startsWith('0')){
                        _discount = parseFloat(discount).toFixed(1)
                    }else if(discount.indexOf('.00')==-1){
                        _discount = parseFloat(discount).toFixed(1).replace('.','')
                    }else{
                        _discount = parseFloat(discount).toFixed(0)
                    }
                    return `满${' '}${_fullPrice}${' '}打${' '}${_discount}${' '}折`
                }
                if (promotionType === 204) {
                    let _discount 
                    if(discount.startsWith('0')){
                        _discount = parseFloat(discount).toFixed(1)
                    }else if(discount.indexOf('.00')==-1){
                        _discount = parseFloat(discount).toFixed(1).replace('.','')
                    }else{
                        _discount = parseFloat(discount).toFixed(0)
                    }
                    return `${' '}${fullPrice}${' '}件${' '}${_discount}${' '}折`
                }
                if(promotionType === null){
                    return item.promotionDescription
                }
                return ``
            },
            //拼接优惠内容，做两行省略
            promotionContext(item){
                let content = ''
                if(!!item.extraInfoVOList&&item.extraInfoVOList.length>0){
                    item.extraInfoVOList.forEach((items,index)=>{
                        let itemContent = this.getDiscount(item.promotionType,items)
                        if(index!=item.extraInfoVOList.length-1){
                            itemContent = itemContent + ';'
                        }
                        if(index != 0){
                            content += `${' '}${itemContent}`
                        }else{
                            content += itemContent
                        }
                    })
                }
                return content
            },
            /**
             * 格式化满优惠活动描述
             * @param Object 满优惠活动对象
            */
            formatePromotionDes(promotionItem){
                let resStr = promotionItem.promotionDescription;
                try {
                    resStr = resStr.replace(/<(.+?)>/g, function(num) {
                        return "<text style='color:#222222'>" + num.slice(1, num.length - 1) + "</text>"
                    }).replace(/x[\d]/g, function(num) {
                        return "<text style='color:#222222'>" + num + "</text>"
                    }).replace(/;/g,function(num) {
                        return "<br>"
                    })
                    //满减赠送的优惠券已领完判断
                    if(0 === promotionItem.couponCountRemaining){
                        resStr += "（已领完）"
                    }
                } catch (error) {
                }
                let decoItem = {
                    props: {
                        text: resStr
                    }
                }
                return decoItem;
            },
            dateFlag(goodTime,otherDay){
                let time = new Date(goodTime.replace(/-/g,"/")).getTime();
                let standTime = new Date().getTime() - otherDay * 1000 * 24 * 60 * 60
                if (time > standTime){
                    return true;
                }else{
                    return false;
                }
            },
            //关闭快速清理弹窗时，将选中效果清除
            clearcheck(){
                this.orderList.totalCheck = 0;
                this.orderList.goodsList.forEach((item,index) => {
                    item.isCheckedAll = 0;
                    item.List.forEach((temp) => {
                        temp.isChecked = 0;
                    })
                })
                this.$forceUpdate()
            },
            handleState(tempList) {
                let list = tempList.storeCartGroupList
                let shop_stock_out = 0 //店铺库存不足数
                // tempList.totalAmount = 0
                list.map(item => {
                    item.promotionCartGroupList.map(item1 => {
                        if (item1.promotionDes) {
                            item1.promotionDes = item1.promotionDes.replace(/<(.+?)>/g, function(num) {
                                return "<text style='color:var(--tagColor)'>" + num.slice(1, num.length - 1) +
                                    "</text>"
                            })
                            item1.promotionDes = item1.promotionDes.replace(/x[\d]/g, function(num) {
                                return "<text style='color:var(--tagColor)'>" + num + "</text>"
                            })
                        }
                        item1.cartList.map(item2 => {
                            let price = item2.productPrice.toString().split('.')[0]
                            item2.isShowCollectBtn = true
                            // if(item2.isChecked == 1){
                            //     tempList.totalAmount += item2.productPrice * item2.buyNum
                            // }
                            if (price.toString().length > 5&&this.isShowBigNumBox != item2.cartId) {
                                item2.isShowBigNumBox = true
                                item2.isShowCloseBtn = false
                            } else if(price.toString().length > 5&&this.isShowBigNumBox == item2.cartId){
                                item2.isShowBigNumBox = false
                                item2.isShowCloseBtn = true
                            }else{
                                item2.isShowBigNumBox = false
                                item2.isShowCloseBtn = false
                            }
                            // if(item2.productState == 3){
                            //     shop_stock_out++
                            // }
                            // if(item1.cartList.length == shop_stock_out){
                            //     item.shopForbidden = true
                            // }else{
                            //     item.shopForbidden = false
                            // }
                            this.handlePromotion(item2);
                        })
                    })
                })
                tempList.isShowCollectBtn = true;
                this.tempList = tempList;
                this.$forceUpdate()
                this.checkNum()
            },
            initCartData() {
                //从缓存获取购物车信息
                this.tempList = uni.getStorageSync('cart_list') == undefined ? [] : uni.getStorageSync('cart_list')
                if (this.tempList != '') {
                    this.tempList.storeCartGroupList.map(item => {
                        item.promotionCartGroupList.map(item1 => {
                            if (item1.promotionDes) {
                                item1.promotionDes = item1.promotionDes.map(i => i.replace(/<(.+?)>/g,
                                    function(num) {
                                        return "<text style='color:var(--tagColor)'>" + num.slice(1, num
                                            .length - 1) + "</text>"
                                    }))
                                item1.promotionDes = item1.promotionDes.map(i => i.replace(/x[\d]/g,
                                    function(num) {
                                        return "<text style='color:var(--tagColor)'>" + num + "</text>"
                                    }))
                            }
                            item1.cartList.map(item2 => {
                                let price = item2.productPrice.toString().split('.')[0]
                                item2.isShowCloseBtn = false
                                if (price.toString().length > 5) {
                                    item2.isShowBigNumBox = true
                                } else {
                                    item2.isShowBigNumBox = false
                                }
                            })
                        })
                    })
                    this.tempList.isShowCollectBtn = false
                    this.tempList = this.tempList;
                    this.$forceUpdate()
                    this.calcTotal();
                } else {
                    this.tempList = {
                        storeCartGroupList: [],
                        invalidList: []
                    }
                }
                uni.hideLoading();
            },
            //从购物车获取数据
            async getCartData(onlyGetCheckedGoods,isDelete=false) {                
                let param = {
                    addressId: this.choosedAddress?.addressId || "",
                }
                if(isNotEmpty(onlyGetCheckedGoods)){
                    param.checked = onlyGetCheckedGoods
                }
                !isDelete && uni.showLoading();
                await this.$store.dispatch('getCartList', param).catch(err => {
                    this.$api.msg(err)
                })
                uni.hideLoading();
                this.loadedDataFlag = true
            },
            // 处理购物车数据(优惠券, 是否选中, 是否有效等)
            handleCartData() {
                if (!this.tempList || !this.tempList.storeCartGroupList) {
                    return;
                }
                this.tempData = this.tempList
                this.tempList.storeCartGroupList.forEach((store)=>{
                    store.promotionCartGroupList.forEach((promotion)=>{
                        promotion.cartList.forEach((item) => {
                            if (item.singlePromotion && item.singlePromotion.promotionType == 106 && Object.keys(item.singlePromotion).length>0 && item.singlePromotion.state == 2){
                                item.isBuyTogetherPromotion = true
                            } else {
                                item.isBuyTogetherPromotion = false
                            }
                        })
                    })
                })
                this.handleStoreCoupon()
                this.refreshCheckState();//这里不能用接口返回的checkedAll，所有checkedAll需要前端来刷新
                this.handleState(this.tempList)
                this.allNum = this.tempList.availableCartNum
                this.reduceNum = this.tempList.reductionNum
                this.reduceData = JSON.parse(JSON.stringify(this.tempList))
                this.reduceData.storeCartGroupList = this.reduceData.storeCartGroupList.filter((store)=>{
                    store.promotionCartGroupList = store.promotionCartGroupList.filter((promotion)=>{
                        promotion.cartList = promotion.cartList.filter((item) => {
                            return item.reduction == true
                        })
                        return promotion.cartList.length != 0
                    })
                    return store.promotionCartGroupList.length !=0
                })
            },
            //全部数据
            getCartAllData(){
                this.currentTab = 0
                this.tempData = this.tempList
            },
            //降价数据
            getCartReduceData(){
                this.currentTab = 1
                this.reduceData.invalidList = []
                this.tempData = this.reduceData
                this.$forceUpdate();
            },
            //请求数据
            async loadData() {
                let list = await this.$api.json('cartList');
                let cartList = list.map(item => {
                    item.checked = true;
                    return item;
                });
                this.cartList = cartList;
                this.calcTotal(); //计算总价
            },
            //监听image加载完成
            onImageLoad(key, index) {
                this.$set(this[key][index], 'loaded', 'loaded');
            },
            navToLogin() {
                this.$Router.push('/pages/public/login')
            },
            //确认订单前，检验商品是否可结算
            testConfirmOrder() {
                this.setGoodsBycartList();
                this.$Router.push({
                    path: '/views/order/confirm/normal',
                    query: {
                        orderType: 1,
                        ifcart: 1
                    }
                })
            },
            /**
             * 跳转下单页之前存储购物车商品数据
             * 
            */
            setGoodsBycartList(){
                this.$setStorageSync('confirmParams', '')
                let cartIdList = []
                let productInfo = this.tempList.storeCartGroupList.map(item => {
                    let storeItemInfo = {}
                    let goodsList = item.promotionCartGroupList.reduce((list, item1) => {
                        let discountVO = item1.promotionId?{
                            promotionId:item1.promotionId,
                            promotionType:item1.promotionType,
                            promotionDes:item1.promotionDes
                        }:null
                        let tempList = []
                        item1.cartList.forEach(goods => {
                            if (goods.isChecked == 1) {
                                storeItemInfo.storeId = goods.storeId
                                storeItemInfo.storeName = goods.storeName
                                storeItemInfo.ownShop = goods.ownShop

                                cartIdList.push({cartId:goods.cartId,sku:goods.sku})
                                tempList.push({
                                    sku:goods.sku,
                                    skuName:goods.skuName,
                                    specValues:goods.specValues,
                                    mainImage:goods.mainImage,
                                    lowestBuy:goods.lowestBuy,
                                    salePrice:goods.productPrice,
                                    ownShop:goods.ownShop,
                                    storeId:goods.storeId,
                                    number:goods.buyNum,
                                    categoryId3:goods.categoryId3,
                                    cidPath:goods.cidPath,
                                    discountVO:discountVO,
                                    specialOfferVO:(goods?.singlePromotion?.promotionId)?{
                                        promotionId:goods.singlePromotion.promotionId,
                                        promotionType:goods.singlePromotion.promotionType,
                                        promotionDes:goods.singlePromotion.promotionDes
                                    }:null,
                                    notAttendDiscount:!!!item1.promotionId
                                })
                            }
                        })

                        return [...list, ...tempList]
                    }, [])
                    return {
                        ...storeItemInfo,
                        products: goodsList
                    }
                }).filter(storeItem => {
                    return storeItem.products.length>0
                })
                let confirmParams = {
                    productInfo:productInfo,
                    cartIdList:cartIdList
                }

                
                // 传到确认订单页使之提前渲染的数据
                this.$setStorageSync('confirmParams',JSON.stringify(confirmParams))
            },
            //快速清理单选
            singleCheck(index,ind){
                if(this.orderList.goodsList[index].List[ind].isChecked == 0){
                    this.orderList.goodsList[index].List[ind].isChecked = 1
                    this.orderList.totalCheck++
                    let num = 0
                    this.orderList.goodsList[index].List.forEach((item, index) => {
                         if(item.isChecked == 1){
                             num++
                         }
                    })
                    if(num == this.orderList.goodsList[index].List.length){
                        this.orderList.goodsList[index].isCheckedAll = 1
                    }

                }else{
                    this.orderList.goodsList[index].List[ind].isChecked = 0
                    this.orderList.totalCheck--
                    this.orderList.goodsList[index].isCheckedAll = this.orderList.goodsList[index].isCheckedAll && 0
                }
                this.$forceUpdate()
            },
            //快速清理全选
            checkAll(index){
                if(this.orderList.goodsList[index].isCheckedAll == 0){
                    this.orderList.goodsList[index].isCheckedAll = 1
                    this.orderList.goodsList[index].List.forEach((item) => {
                        item.isChecked = 1
                    })
                }else{
                    this.orderList.goodsList[index].isCheckedAll = 0
                    this.orderList.goodsList[index].List.forEach((item) => {
                        item.isChecked = 0
                    })
                }
                let total = 0;
                if(this.orderList && this.orderList.goodsNum > 0){
                    this.orderList.goodsList.forEach((item) => {
                        item.List.forEach((temp) => {
                            if(temp.isChecked == 1){
                                total++
                            }
                        })
                    })
                }
                this.orderList.totalCheck = total;
                this.$forceUpdate()
            },
            //全选状态处理 type, index
            check(isCheckedAll) {
                if (this.hasLogin) { //登录
                    let cartIds = ''
                    this.tempList.storeCartGroupList.map(item => {
                        item.promotionCartGroupList.map(item1 => {
                            item1.cartList.map(item2 => {
                                cartIds += item2.cartId + ','
                            })
                        })
                    })
                    cartIds = cartIds.substring(0, cartIds.length - 1)
                    let param = {
                        cartIds,
                        checked: isCheckedAll == 0 ? 1 : 0 
                    }
                    let checkFunc = state => {
                        this.operateAllCarts(cart => {
                            cart.isChecked = state;
                        });
                    }
                    //前置选中操作
                    checkFunc(param.checked)
                    this.refreshCheckState();
                    uni.showLoading();
                    cartHandler.checkedCarts(param).then(res => {
                        if (res.state == 200) {
                            if(!this.editFlag){
                                this.getCartData(true);
                            }else{
                                uni.hideLoading();
                            }
                        } else {
                            uni.hideLoading();
                            this.$api.msg(res.msg)
                            //回滚操作
                            checkFunc(!param.checked)
                        }
                    }).catch(e => {
                        //回滚选中操作
                        checkFunc(!param.checked)
                        console.error(e)
                        uni.hideLoading()
                    })
                } else { //未登录
                    this.tempList.checkedAll = !this.tempList.checkedAll
                    this.tempList.storeCartGroupList.map(item => {
                        item.promotionCartGroupList.map(item1 => {
                            item1.cartList.map(item2 => {
                                if (this.tempList.checkedAll == true) {
                                    item2.isChecked = 1
                                    item.checkedAll = 1
                                } else {
                                    item2.isChecked = 0
                                    item.checkedAll = 0
                                }
                            })
                        })
                    })
                    this.calcTotal()
                    uni.setStorage({
                        key: 'cart_list',
                        data: this.tempList,
                        success: function() {
                            //更新购物车数量和购物车数据
                            // this.isShow = false
                            // this.isShow = true
                        }
                    })
                }
            },
            // 点击商品、店铺状态处理
            changeSelectState(type, cartItem) {
                let isChecked;
                let {cartId, spu, sku=''} = cartItem;
                if (this.hasLogin) { //登录
                    let cartIds = ''
                    if (type == 'goods') { //商品
                        isChecked = cartItem.isChecked;
                        cartIds = cartId

                    } else { // 店铺
                        isChecked = cartItem.checkedAll;
                        this.tempList.storeCartGroupList.map(item => {
                            if (item.storeId == cartItem.storeId) {
                                item.promotionCartGroupList.map(item1 => {
                                    item1.cartList.map(item2 => {
                                        cartIds += item2.cartId + ','
                                    })
                                })
                            }
                        })
                        cartIds = cartIds.substring(0, cartIds.length - 1)
                    }
                    let param = {
                        cartIds: cartIds,
                        checked: isChecked == 1 ? 0 : 1
                    }
                   
                    let checkFunc = function(state){
                        if(type == 'goods'){
                            cartItem.isChecked = state;
                        }else{
                            cartItem.promotionCartGroupList.forEach(promotion => {
                                promotion.cartList.forEach(cart => {
                                    cart.isChecked = state;
                                })
                            })
                        }
                    }
                    //前置选中操作
                    if(!this.editFlag && ((cartItem.singlePromotion?.state == 2 && cartItem.singlePromotion?.promotionType == 106)||cartItem.productState == 3 )){return}
                    checkFunc(param.checked)
                    this.refreshCheckState();
                    uni.showLoading()
                    cartHandler.checkedCarts(param).then(res => {
                        if (res.state == 200) {
                            !this.editFlag ? this.getCartData(true) : uni.hideLoading() ;
                        } else {
                            //回滚选中操作
                            checkFunc(!param.checked)
                            this.$api.msg(res.msg)
                            uni.hideLoading()
                        }
                    }).catch(e=>{
                        //回滚选中操作
                        checkFunc(!param.checked)
                        console.error(e)
                        uni.hideLoading()
                    })
                } else { // 未登录或管理状态编辑
                    let checkedNum = 0 //选中数量
                    let storeId = cartId
                    let shopChecked = 0
                    let cartNum = 0 //购物车数量
                    if (type == 'goods') { //商品
                        this.tempList.storeCartGroupList.map(item => {
                            item.promotionCartGroupList.map(item1 => {
                                item1.cartList.map(item2 => {
                                    if (item2.sku == sku) {

                                        item2.isChecked = item2.isChecked == 0 ? 1 : 0
                                        item1.cartList.map(v => {
                                            if (v.isChecked == 1) {
                                                shopChecked++
                                            }
                                        })
                                        if (item1.cartList.length == shopChecked) {
                                            item.checkedAll = 1
                                        } else {
                                            item.checkedAll = 0
                                        }
                                    }
                                })
                            })
                        })
                    } else { //店铺
                        this.tempList.storeCartGroupList.map(item => {
                            if (item.storeId == storeId) {
                                item.checkedAll = item.checkedAll == 0 ? 1 : 0
                                item.promotionCartGroupList.map(item1 => {
                                    item1.cartList.map(item2 => {
                                        item2.isChecked = item.checkedAll
                                    })
                                })
                            }
                        })
                    }
                    this.tempList.storeCartGroupList.map(item => {
                        item.promotionCartGroupList.map(item1 => {
                            item1.cartList.map(item2 => {
                                if (item2.isChecked == 1) {
                                    checkedNum++
                                }
                            })
                            cartNum += item1.cartList.length
                        })
                    })
                    if (checkedNum == cartNum) {
                        this.tempList.checkedAll = true
                    } else {
                        this.tempList.checkedAll = false
                    }
                    this.calcTotal()
                    if (!this.hasLogin) {
                        uni.setStorage({
                            key: 'cart_list',
                            data: this.tempList,
                            success: function() {
                            }
                        })
                    }
                }
            },
            //购物车数量加减
            numberChange(numObj, itemObj) {
                let that = this;
                let numObjNew=JSON.parse(JSON.stringify(numObj))
                let num = Number(numObjNew.value);
                let preNum = Number(numObjNew.preValue);
                if(num>999){
                    num = 999
                    uni.showToast({
                        title: '超过最大购买量',
                        icon: 'none'
                    })
                }
                if (num < itemObj.lowestBuy) {
                    uni.showToast({
                        title: '商品不能再减少了',
                        icon: 'none'
                    })
                }
                throttle(() => {
                    if (that.hasLogin) { //登录
                        let param = {
                            cartId: itemObj.cartId,
                            number: num > itemObj.lowestBuy ? num : itemObj.lowestBuy,
                            addressId: that.choosedAddress?.addressId || ''
                        }
                        //前置操作
                        itemObj.buyNum = param.number;
                        if (num > itemObj.lowestBuy) {
                            uni.showLoading();
                        }
                        cartHandler.changeCartNum(param).then(res => {
                            if (res.state == 200) {
                                document.querySelector('.cartInput'+itemObj.cartId+' input').value = res.data?.buyNum;
                                itemObj.productState = res.data?.productState;
                                if(itemObj.isChecked && !this.editFlag){
                                    this.getCartData(true);
                                }else{
                                    uni.hideLoading();
                                }
                            }else {
                                uni.hideLoading();
                                that.tempList.storeCartGroupList.map((item,index)=> {
                                    item.promotionCartGroupList.map((item1,index1) => {
                                        item1.cartList.map((item2,index2) => {
                                            if(item2.cartId == itemObj.cartId){
                                                this.$set(that.tempList.storeCartGroupList[index].promotionCartGroupList[index1].cartList[index2], 'buyNum', preNum)
                                                document.querySelector('.cartInput'+itemObj.cartId+' input').value = preNum;
                                            }
                                        })
                                    })
                                })
                                that.$api.msg(res.msg);
                                return
                            }
                        }).catch(e=>{
                            console.error(e);
                            uni.hideLoading();
                        })
                    } else { //未登录
                        this.tempList.storeCartGroupList.map(item => {
                            item.promotionCartGroupList.map(item1 => {
                                item1.cartList.map(item2 => {
                                    if (item2.spu == itemObj.spu) {
                                        item2.buyNum = num - 0
                                    }
                                })
                            })
                        })
                        this.calcTotal()
                        uni.setStorage({
                            key: 'cart_list',
                            data: this.tempList,
                            success: function() {
                                //更新购物车数量和购物车数据
                                // this.isShow = false
                                // this.isShow = true
                            }
                        })
                    }
                }, 450);
            },
            // 批量删除
            batchDelete(type) {
                let cartIds = ''
                let checkedNum = 0
                let tempArr = []
                let goodsIds = ''
                let unLoginArr = []
                if (type == "fastDelete"){
                    this.orderList.goodsList.forEach(item => {
                        item.List.forEach(item1 => {
                            if (item1.isChecked == 1) {
                                checkedNum++
                                cartIds += item1.cartId + ','
                            }
                        })
                    })
                } else {
                    this.tempList.storeCartGroupList.map(item => {
                        item.promotionCartGroupList.map(item1 => {
                            item1.cartList.map(item2 => {
                                if (item2.isChecked == 1) {
                                    checkedNum++
                                    cartIds += item2.cartId + ','
                                    tempArr.push(item2.cartId)
                                    unLoginArr.push(item2.spu)
                                }
                            })
                        })
                    })
                }
                switch (type) {
                    case 'open': {
                        if (checkedNum == 0) {
                            uni.showToast({
                                title: '请选择删除的商品！',
                                icon: 'none'
                            })
                        } else {
                            this.detailsPopupShow = false
                            this.$refs.batchDelPopup.open()
                        }
                        break;
                    }
                    case 'fastDelete': {
                        if (checkedNum == 0) {
                            uni.showToast({
                                title: '请选择删除的商品！',
                                icon: 'none'
                            })
                        } else {
                            this.orderList.totalCheck = checkedNum
                            cartIds = cartIds.substring(0, cartIds.length - 1)
                            let param = {cartIds}
                            cartHandler.deleteCarts(param).then(res => {
                                if (res.state == 200) {
                                    uni.showToast({
                                        title: '删除成功！',
                                        icon: 'none'
                                    })

                                    this.deleteProduct(cartIds.split(','));
                                    this.tempList.isShowCollectBtn = true
                                }
                            })
                        }
                        break;
                    }
                    case 'confirm': {
                        this.$refs.batchDelPopup.close()
                        if (this.hasLogin) { //登录时批量删除
                            cartIds = cartIds.substring(0, cartIds.length - 1)
                            let param = {cartIds}
                            cartHandler.deleteCarts(param).then(res => {
                                if (res.state == 200) {
                                    uni.showToast({
                                        title: '删除成功！',
                                        icon: 'none'
                                    })
                                    this.deleteProduct(cartIds.split(','));
                                }
                            })
                        } else { //未登录时批量删除
                            if (this.tempList.checkedAll == true) {
                                uni.removeStorageSync('cart_list')
                                this.tempList.storeCartGroupList = []
                            } else {
                                this.tempList.storeCartGroupList.forEach((item, index) => {
                                    item.promotionCartGroupList.forEach((item1, index1) => {
                                        item1.cartList.forEach((item2, index2) => {
                                            unLoginArr.forEach(v => {
                                                if (item2.spu == v) {
                                                    item1.cartList.splice(index2, 1)
                                                }
                                            })
                                        })

                                        if (item1.cartList.length == 0) {
                                            item.promotionCartGroupList = []
                                        }
                                        if (item.promotionCartGroupList.length == 0) {
                                            this.tempList.storeCartGroupList.splice(index, 1)
                                        }
                                    })
                                })
                            }
                            uni.showToast({
                                title: '删除成功！',
                                icon: 'none'
                            })
                            //更新购物车数量
                            this.$store.dispatch('getCartNum');
                        }
                        break;
                    }

                }

            },
            operateCartGoodsModule(item){
                this.$moduleGate(this.operateCartGoods('move', item))
            },
            batchCollectModule(type){
                this.$moduleGate(this.batchCollect(type))
            },
            // 批量移入收藏夹
            batchCollect(type) {
                let cartId = ''
                let checkedNum = 0
                if(type == "fastCollect"){
                    this.orderList.goodsList.forEach(item => {
                        item.List.forEach(item1 => {
                            if (item1.isChecked == 1) {
                                checkedNum++
                                cartId += item1.cartId + ','
                            }
                        })
                    })
                } else {
                    this.tempList.storeCartGroupList.map(item => {
                        item.promotionCartGroupList.map(item1 => {
                            item1.cartList.map(item2 => {
                                if (item2.isChecked == 1) {
                                    checkedNum++
                                    cartId += item2.cartId + ','
                                }
                            })
                        })
                    })
                }
                if (checkedNum == 0) {
                    uni.showToast({
                        title: '请选择收藏的商品！',
                        icon: 'none'
                    })
                } else {
                    cartId = cartId.substring(0, cartId.length - 1)
                    let param = {cartIds: cartId}
                    cartHandler.moveToCollection(param).then(res => {
                        if (res.state == 200) {
                            uni.showToast({
                                title: '收藏成功',
                                icon: 'none'
                            })
                            this.curOperateId = ''
                            this.deleteProduct(cartId.split(','));
                            this.tempList.isShowCollectBtn = true
                        }
                    })
                }
            },
            // 计算结算数量及改变按钮样式
            checkNum() {
                let checkedLen = 0
                this.tempList.storeCartGroupList.map(item => {
                    item.promotionCartGroupList.map(item1 => {
                        item1.cartList.map(item2 => {
                            if (item2.isChecked == 1 && item2.productState == 1) {
                                checkedLen++
                            }
                        })
                    })
                })
                // this.tempList.checkedLen = checkedLen
                this.isDisabled = checkedLen == 0 ? true : false

            },
            //计算总价
            calcTotal() {
                // 未登录时计算合计价格,结算数量
                let subTotal = 0
                let checkedNum = 0
                this.tempList.storeCartGroupList.map(item => {
                    item.promotionCartGroupList.map(item1 => {
                        item1.cartList.map(item2 => {
                            if (item2.isChecked == 1) {
                                subTotal += item2.buyNum * item2.productPrice
                                checkedNum++
                            }
                        })
                    })
                })
                this.tempList.totalAmount = subTotal.toFixed(2)
                this.tempList.totalCheck = checkedNum
            },
            createOrderModule(){
                this.$moduleGate(didLogin => this.createOrder(didLogin))
            },
            //创建订单
            async createOrder(didLogin) {
                let _this = this;
                //经过登录流程，需要重新初始化购物车
                if(didLogin){
                    uni.showLoading();
                    await this.getCartData();
                    uni.hideLoading();
                }
                // if (this.hasLogin) { //登录跳转确认下单页
                    let settle_num = 0
                    this.tempList.storeCartGroupList.map(item => {
                        item.promotionCartGroupList.map(item1 => {
                            item1.cartList.map(item2 => {
                                if (item2.isChecked == 1 && item2.productState == 1) {
                                    settle_num++
                                }
                            })
                        })
                    })
                    if (settle_num == 0) {
                        uni.showToast({
                            title: '您还没有选中商品',
                            icon: 'none'
                        })
                    } else {
                        this.testConfirmOrder()
                    }
                // } else { //未登录提示登录
                //     uni.showModal({
                //         title: '提示',
                //         content: '需要先登录才能下单哦~',
                //         confirmText: '去登陆',
                //         cancelText: '我再看看',
                //         success: res => {
                //             if (res.confirm) {
                //                 _this.$Router.push('/pages/public/login')
                //             }
                //         }
                //     })
                // }
            },
            //马上去逛逛事件
            goGoodsList() {
                this.$Router.push({path:'/standard/product/list',query:{showStoreTabs: false}})
            },
            //管理购物车数据
            async manageCart() {
                this.editFlag = !this.editFlag;
                if (this.tempList && this.tempList.storeCartGroupList && this.tempList.storeCartGroupList.length > 0) {
                    if (this.editFlag) {
                        this.is_show_mask = false
                           this.tempList.storeCartGroupList.forEach((item)=>{
                                if (item.checkedAll || this.tempList.checkedAll){
                                    item.promotionCartGroupList.forEach(item1=>{
                                        item1.cartList.forEach(item2 => {
                                            if (item2.productState == 3){
                                                item2.isChecked  = 1;
                                            }
                                        })
                                    })
                                }
                                
                            })                    
                        this.refreshCheckState()
                    } else {
                        this.getCartData(true);
                        this.is_show_mask = true
                    }
                    this.checkNum()
                }
            },
            /*
             *操作商品事件
             * type:move移入收藏夹，del删除商品
             */
            operateCartGoods(type, cartItem) {
                let {cartId, spu} = cartItem;
                if (this.hasLogin) { //登录
                    let param = {}
                    let apiType;
                    if (type == 'move') {
                        apiType = 'moveToCollection'
                        param = {
                            key: this.userInfo.access_token,
                            cartIds: cartId,
                        }
                    } else {
                        apiType = 'deleteCarts'
                        param = {
                            key: this.userInfo.access_token,
                            cartIds: cartId,
                        }
                    }
                    cartHandler[apiType](param).then(res => {
                        if (res.state == 200) {
                            if (type == 'del') {
                                uni.showToast({
                                    title: '删除成功！',
                                    icon: 'none'
                                })
                            } else {
                                this.curOperateId = ''
                                uni.showToast({
                                    title: '收藏成功！',
                                    icon: 'none'
                                })
                            }

                            this.deleteProduct([cartId]);
                        }
                    })
                } else { //未登录删除
                    this.tempList && this.tempList.storeCartGroupList && this.tempList.storeCartGroupList.map((item,
                        index) => {
                        item.promotionCartGroupList.map(item1 => {
                            item1.cartList.map((item2, index2) => {
                                if (item2.spu == spu) {
                                    item1.cartList.splice(index2, 1)
                                }
                            })
                            if (item1.cartList.length == 0) {
                                item.promotionCartGroupList = []
                            }
                            if (item.promotionCartGroupList.length == 0) {
                                this.tempList.storeCartGroupList.splice(index, 1)
                            }
                        })
                    })
                    if (!this.hasLogin) {
                        if (this.tempList.storeCartGroupList.length == 0) {
                            uni.removeStorage({
                                key: 'cart_list',
                                success: function(res) {
                                    // this.isShow = false
                                    // this.isShow = true
                                }
                            })
                        } else {
                            uni.setStorage({
                                key: 'cart_list',
                                data: this.tempList,
                                success: function() {
                                    //更新购物车数量和购物车数据
                                    // this.isShow = false
                                    // this.isShow = true
                                }
                            });
                        }
                    }

                    this.calcTotal()
                    uni.showToast({
                        title: '删除成功！',
                        icon: 'none'
                    })
                    this.tempList = this.tempList;
                }
            },
            //进入商品详情页
            goGoodsDetail(sku, spu) {
                if (this.isCellMoving) { return }
                this.$Router.push({
                    path: '/standard/product/detail',
                    query: {
                        sku,
                        spu
                    }
                })
            },
            // 商品价格过长修改购买数量
            changeBuyNum(cartId, spu) {
                this.isShowBigNumBox = cartId
                this.tempList && this.tempList.storeCartGroupList && this.tempList.storeCartGroupList.map(item => {
                    if (this.hasLogin) {
                        item.promotionCartGroupList.map(item1 => {
                            item1.cartList.map(item2 => {
                                if (item2.cartId == cartId) {
                                    item2.isShowBigNumBox = false
                                    item2.isShowCloseBtn = true
                                    this.$forceUpdate()
                                }
                            })
                        })
                    } else {
                        if (item.spu == spu) {
                            item.isShowBigNumBox = false
                            item.isShowCloseBtn = true
                            this.$forceUpdate()
                        }
                    }

                })
                this.tempList && this.tempList.storeCartGroupList && this.tempList.storeCartGroupList.map(item => {
                    if (this.hasLogin) {
                        item.promotionCartGroupList.map(item1 => {
                            item1.cartList.map(item2 => {
                                if (item.cartId == cartId) {
                                    this.showPrice = item2.productPrice
                                    item2.productPrice = item2.productPrice.toString().split('.')[
                                        0].toString().substr(0, 4) + '...'
                                }
                            })
                        })
                    } else {
                        if (item.spu == spu) {
                            this.showPrice = item.productPrice
                            item.productPrice = item.productPrice.toString().split('.')[0].toString().substr(0,
                                4) + '...'
                        }
                    }
                })
            },
            // 编辑数量关闭数量加减
            closeBigPriceBox(cartId, spu) {
                this.isShowBigNumBox = -1
                this.tempList.storeCartGroupList.map(item => {
                    item.promotionCartGroupList.map(item1 => {
                        item1.cartList.map(item2 => {
                            if (this.hasLogin) {
                                if (item2.cartId == cartId) {
                                    item2.isShowBigNumBox = true
                                    item2.isShowCloseBtn = false
                                }
                            } else {
                                if (item2.spu == spu) {
                                    item2.isShowBigNumBox = true
                                    item2.isShowCloseBtn = false
                                }
                            }
                        })
                    })
                })
                this.getCartData()
            },
            // 清空失效商品
            clearFailureGoods(type) {

                switch (type) {
                    case 'open': {
                        this.detailsPopupShow = false
                        this.$refs.clearPopup.open()
                        break;
                    }
                    case 'confirm': {
                        this.$refs.clearPopup.close()
                        let _this = this
                        let param = {
                            invalidCartList:[]
                        }
                        param.invalidCartList = this.tempList?.invalidList?.map(arr => arr.cartId)
                        cartHandler.clearInvalid(param).then(res => {
                            if (res.state == 200) {
                                _this.tempList.invalidList = []
                                uni.showToast({
                                    title: '清除成功！',
                                    icon: 'none'
                                })
                            }else{
                                _this.$api.msg(res.msg);
                            }
                        })
                        break;
                    }
                }
            },

            // 点击关闭长按蒙层
            closeMask(e) {
                this.is_show_mask = false
            },
            onAddedCartSucc() {
                if (this.hasLogin) {
                    this.getCartData();
                } else {
                    this.initCartData();
                    this.$forceUpdate();
                }
            },
            // 是否展示空页面
            IsShowEmptyPage() {
                if ((this.tempList && this.tempList.cartInfoList.length > 0) && (tempList.invalidList && tempList
                        .invalidList.length > 0)) {
                    this.is_show_empty = false
                } else {
                    this.is_show_empty = true
                }
            },
            // 打开换促销弹框
            async showPromotionBox(item, item2) {
                // 用户点击换促销 自己组装数据
                let tempList = []
                cartHandler.getGoodsTwoActivityList({storeId:item.storeId,sku:item.sku,state:2}).then(res => {
                    if(res.state == 200 && res.data?.discountList){
                        if (res.data.discountList.length > 0){
                            tempList = res.data.discountList
                        }
                    }
                }).then(()=>{
                    //不参与任何优惠活动的处理
                    tempList.push({promotionId:null,promotionType:null,desctiption:"不参与任何优惠活动",discountExtendInfoList:[]})
                    tempList.forEach((item)=>{
                        if(null===item.promotionId){
                            item.discountExtendInfoList.push({
                                couponCountRemaining:-1,
                                promotionDescription:item.desctiption
                            })
                        }
                    })
                    // 执行选中逻辑
                    let promotionId = item2.promotionId ? item2.promotionId:null
                    let promotionType = item2.promotionType ? item2.promotionType:null
                    this.promotion_goods_info = [];
                    this.promotion_goods_info.push({
                        mainImage: item.mainImage,
                        productPrice: item.productPrice,
                        specValues: item.specValues,
                        promotionId: promotionId
                    })
                    this.promotionId = promotionId;
                    this.promotionType = promotionType;
                    this.promotion_list = tempList;
                    this.cartId = item.cartId
                    this.detailsPopupShow = false
                    this.$refs.popup.open();
                })

            },
            //打开快速清理弹窗
            openFastDelBox(){
                this.clearcheck()
                this.detailsPopupShow = false
                this.$refs.fastdelPoppup.open();
            },
            // 关闭快速清理弹窗
            closeFastDelBox() {
                this.clearcheck()
                this.$refs.fastdelPoppup.close();
            },
            packUpCoupon() {
                this.is_show_more_rules = !this.is_show_more_rules
            },
            // 关注店铺
            careStore() {
                this.$Router.push('/standard/store/attentionStore')
            },
            // 去店铺详情
            toShopDetail(item) {
                
            },
            showspecBox(item){
                if(item.specValues=='默认'){
                    return
                }
                uni.showLoading();
                let param = {sku:item.sku}
                this.goodsData = item
                this.sku = item.sku
                this.preSku = item.sku
                cartHandler.getCartSpec(param).then(res=>{
                    uni.hideLoading()
                    if(res.state == 200){
                        this.specs = res.data.specs
                        this.$refs.specpopup.open()
                    }
                })
            },
            /**
             * 切换商品规格id
             * @param {str} sku 当前所选商品id，beforeChange
             * @param {arr} skuIds 商品规格list
             * @param {arr} dim 维度
             */
            async changeSpecSku(sku,skuIds,dim){
                if (this.setSpecSkuType(sku,skuIds,dim) == 'isDisable') {
                    return
                }
                let that = this;
                let tempList = that.getDimSkus(sku,skuIds,dim); //获取每个维度下的skuIds
                let tempListFilter=tempList.reduce((a, b) => a.filter(c => b.includes(c))); //获取每个维度skuIds的交集
                this.preSku = tempListFilter[0]
                if(tempListFilter.length>0){
                    let state = await that.getGoodsDetail(this.preSku);
                    if (state!=200){
                        this.preSku = sku;
                    }
                }else{
                    return false;
                }
            },
            //获取商品详情信息
            getGoodsDetail(sku) {
                uni.showLoading();
                return new Promise((resolve, reject)=>{
                    goodsHandler.getDetail({
                        sku: sku //货品sku
                    }).then(async res => {
                        if (res.state == 200) {
                            let cartId = this.goodsData.cartId
                            this.goodsData = res.data; //详情信息
                            this.goodsData.cartId = cartId
                        }
                        // 查询商品价格相关的信息
                        this.getGoodsPrice(res.data.categoryId1,res.data.categoryId2,res.data.categoryId3,res.data.storeId,sku);
                        resolve(res.state);
                    })
                })
            },
            //获取商品价格相关的信息【批量接口】
            getGoodsPrice(categoryId1,categoryId2,categoryId3,storeId,sku){
                return new Promise(resolve => {
                    let param = {
                        products: [
                            {
                                sku: sku,
                                categoryId1: categoryId1,
                                categoryId2: categoryId2,
                                categoryId3: categoryId3,
                                storeId: storeId,
                            }
                        ]
                    }
                    goodsHandler.getProductPrice(param).then(res => {
                        if(res.state == 200 && res.data?.products?.length > 0){                               
                            this.goodsData.productPrice = res.data.products[0].salePrice;
                        }
                        this.$forceUpdate()
                    }).finally(()=>{
                        uni.hideLoading();
                    })
                })
            },
            //切换规格
            confirmChangespecon(){
                if(this.sku == this.preSku){
                    this.$refs.specpopup.close()
                    return
                }
                uni.showLoading();
                let num = Number(document.querySelector('.cartInput'+this.goodsData.cartId+' input').value)
                let param = {
                    sku:this.preSku,
                    addressId: this.choosedAddress?.addressId || '',
                    cartId: this.goodsData.cartId,
                    number:num>this.goodsData.lowestBuy?num:this.goodsData.lowestBuy
                }
                cartHandler.changeCartSpec(param).then(res=>{
                    if(res.state == 200){
                        this.$refs.specpopup.close()
                        this.getCartData()
                    }else if(res.state == 300){
                        uni.showLoading({
                            title:'对不起，系统繁忙，请稍后再试',
                            icon:'none',
                            duration: 3000
                        })
                        this.$refs.specpopup.close()
                        this.getCartData()
                    }else{
                        uni.showLoading({
                            title:res.msg,
                            icon:'none',
                            duration: 3000
                        })
                        setTimeout(()=>{
                            uni.hideLoading()
                        },3000)
                    }
                })
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
            // 打开优惠券弹框,获取店铺优惠券列表
            getShopCoupon(storeId) {
                if (this.hasLogin) {
                    this.detailsPopupShow = false
                    this.$refs.couponPopup.open()
                    let param = {storeId}
                    uni.showLoading();
                    goodsHandler.getStoreCouponList(param).then(async res => {
                        uni.hideLoading()
                        if (res.state == 200) {
                            this.coupon_list = res.data.list || []
                            this.coupon_list.forEach((item, index) => {
                                item.isOpen = false;
                            })
                            await this.$nextTick()
                            let fontDom = document.getElementsByClassName('fitFont');
                            fitFontSize(fontDom,10);
                        }else{
                            this.coupon_list = []
                        }
                    }).catch(e=>{
                        uni.hideLoading()
                        console.error(e);
                        this.coupon_list = []
                    })
                } else {
                    this.$Router.push('/pages/public/login')
                }
            },
            getShopCouponModule(storeId){
                this.currentStoreId = storeId
                this.detailsPopupShow = false
                this.$refs.couponPopup.open()
                this.storeCouponList.forEach((item, index) => {
                    item.isOpen = false;
                })
                let arr = this.storeCouponList.filter((item)=>{
                    return item.storeId == storeId
                })
                this.coupon_list = arr || []
                setTimeout(()=>{
                    let fontDom = document.getElementsByClassName('fitFont');
                    fitFontSize(fontDom,10);
                },200)
                
            },
            //规则展开
            descriptionOpen(couponId) {
                this.coupon_list && this.coupon_list.map(item => {
                    if (item.couponId == couponId) {
                        if (item.description != '') {
                            item.isOpen = !item.isOpen
                            this.$forceUpdate()
                        }
                    }
                })
            },
            //立即领取
            goReceive(item) {
                let that = this;
                this.$moduleGate(()=>{
                    let couponId = item.couponId
                    let param = {couponId};
                    goodsHandler.receiveCoupon(param).then(res => {
                        if (res.state == 200) {
                            let result = res.data;
                            this.getDecoCouponList()
                            // that.getShopCoupon(item.storeId)
                            that.$api.msg('领取成功!');
                            if(item.couponType == 3){    //随机优惠券
                                this.detailsPopupShow = false
                                that.rondomMod = true;
                                that.rondomDes = result;
                            }
                        } else {
                            this.getDecoCouponList()
                            // that.getShopCoupon(item.storeId)
                            that.$api.msg(res.msg);
                        }
                    }).catch((e) => {
                        //异常处理
                    })
                })
            },
            // 修改促销活动
            changePromotion(index, promotionDes, promotionId, promotionType) {
                this.currIndex = index
                this.promotionDes = promotionDes
                this.promotionId = promotionId
                this.promotionType = promotionType
            },
            // 确定修改促销活动
            confirmChangePromotion() {
                let param = {
                    cartId: this.cartId,
                    promotionId: this.promotionId,
                    promotionType: this.promotionType
                }
                uni.showLoading();
                cartHandler.changePromotion(param).then(async res => {
                    if (res.state == 200) {
                        let cartItem = null;
                        this.operateCartItem(this.cartId, cart => {
                            cartItem = cart;
                        })
                        cartItem.selectedPromotion = res.data;
                        uni.showToast({
                            title: '修改成功！',
                            icon:'none'
                        })
                        this.$refs.popup.close();
                        this.$forceUpdate();
                        await this.getCartData();
                    }else {
                        uni.hideLoading();
                        this.$api.msg(res.msg);
                    }
                }).catch((e) => {
                    uni.hideLoading();
                    //异常处理
                    console.error(e)
                })
            },

            getAddressList() {
                return this.defaultAddress;
            },

            /**
             * 公共函数（防止每个地方都写一遍这个遍历）： 处理单个商品
             */
            operateCartItem(cartId, callback, tempList = this.tempList){
                tempList.storeCartGroupList.some(store => {
                    return store.promotionCartGroupList.some(promotion => {
                        return promotion.cartList.some((cart, index) => {
                            if(cart.cartId == cartId){
                                callback?.(cart, index);
                                return true
                            }
                        })
                    })
                })
            },

            /**
             * 公共函数（防止每个地方都写一遍这个遍历）： 处理每个商品
             */
            operateAllCarts(callback, tempList = this.tempList){
                tempList.storeCartGroupList.forEach(store => {
                    store.promotionCartGroupList.forEach(promotion => {
                        promotion.cartList.forEach((cart, index) => {
                            callback?.(cart, index);
                        })
                    })
                })
            },

            /**
             * 刷新check状态、计算总数量
             */
             refreshCheckState(){
                //更新选中状态
                let checkedAllflag = true
                this.tempList.storeCartGroupList.forEach(store => {
                    //店铺全选
                    store.checkedAll = store.promotionCartGroupList.every(promotion => {
                        let _cartList = promotion.cartList.filter(cart => {
                            //若是管理状态，则所有商品都能被勾选；若是普通状态，则过滤掉不可选的商品
                            return this.editFlag ? true : (!cart.isBuyTogetherPromotion && cart.productState == 1)
                        })
                        return isNotEmpty(_cartList) && _cartList.every(cart => { 
                            return !!cart.isChecked;// 当前是否选中
                        })
                    })
                    if(store.checkedAll == false){
                        checkedAllflag = false
                    }
                })
                if(!!checkedAllflag){
                    this.tempList.checkedAll = true
                }else{
                    this.tempList.checkedAll = false
                }

                //更新数量
                let availableCartNum = 0;
                let totalCheck = 0;
                this.operateAllCarts(cart => {
                    availableCartNum++;
                    if(this.editFlag){
                        !!cart.isChecked && totalCheck++
                    }else{
                        !cart.isBuyTogetherPromotion && cart.productState == 1 && !!cart.isChecked && totalCheck++;
                    }
                })
                this.tempList.totalCheck = totalCheck;
                this.tempList.availableCartNum = availableCartNum;
            },

            /**
             * 删除页面上的商品
             */
            deleteProduct(cartIds){
                //1. 校验所删除商品是否被选中了
                let hasChecked = false;
                this.operateAllCarts(cart => {
                    //不同的业务场景，cartIds的类型可能有字符串或数字。这里兼容判断
                    if((cartIds.indexOf(String(cart.cartId)) > -1 || cartIds.indexOf(cart.cartId) > -1) && !!cart.isChecked){
                        hasChecked = true;
                    }
                })

                //2. 删除指定商品
                //不同的业务场景，cartIds的类型可能有字符串或数字。这里兼容判断
                this.tempList.storeCartGroupList = this.tempList?.storeCartGroupList?.filter((item, index) => {
                    item.promotionCartGroupList = item?.promotionCartGroupList.filter((item1, index1) => {
                        item1.cartList = item1?.cartList.filter((item2, index2) => cartIds.indexOf(String(item2.cartId)) == -1 && cartIds.indexOf(item2.cartId) == -1)
                        return item1.cartList.length != 0
                    })
                    return item.promotionCartGroupList.length != 0

                })
                this.tempList.invalidList = this.tempList?.invalidList?.filter((item,index) => {
                    return cartIds.indexOf(String(item.cartId)) == -1 
                })
                //3.更新availableCartNum           
                this.tempList.availableCartNum -= cartIds.length
                //4.如果有选中了的商品，则需要刷新总价
                this.getCartData(true,true);
                //5.更新购物车数量
                this.$store.dispatch('getCartNum');
            },

            /**
             * uni-popup打开时，阻止父页面滚动
             */
            popChange(e){
                e.show ? lockScroll() : unlockScroll();
            },
            // 打开选择地址列表
            showAddressList(){
                this.detailsPopupShow = false
                this.$refs.addressChooseComp.open();
            },
            // 关闭地址选择的弹窗
            addressPopClose() {
                this.$refs.addressChooseComp.close();
            },
            // 获取领券中心装修数据
            getDecoraData(){
                let param = {
                    decoId: this.$config.COUPON_TOPIC_ID,
                    type: 'topic'
                }
                decorateHandler.getTopicDeco(param).then(res => {
                    if (res.state == 200) {
                        if (res.data.data == null){
                            this.decoData = []
                            return
                        } else {
                            this.decoData = JSON.parse(res.data.data || "[]");
                        }
                    }
                    // 遍历装修数据获取优惠券Id集合
                    this.decoData?.forEach((item)=>{
                        if (item.name == "coupon" && item.props.is_show == true){
                            let couponIdList = []//优惠券的id列表
                            item.data.forEach((coupon)=>{
                                if (coupon.info.length==0) {
                                    return
                                }else{
                                    coupon.info.forEach((item)=>{
                                        if(!item.info.promotionType||item.info.promotionType=='402'){
                                            couponIdList.push(item.info.couponId)
                                        }
                                    })
                                }
                            })
                            this.couponIds = couponIdList
                        }
                    })
                    // 根据优惠券ID获取优惠券List
                    this.getDecoCouponList()
                })
            },
            // 获取优惠券数据
            getDecoCouponList() {
                if (this.couponIds.length === 0) {
                    return
                }
                let param = {};
                param.couponIds = this.couponIds;
                goodsHandler.couponCenter(param).then(res => {
                    if (res.state == 200) {
                        let result = res.data.couponList;
                        result = result.filter((item)=>{
                            if (item.storeId != 0 ){
                                item.isOpen = false;
                            }
                            return item.storeId != 0
                        })
                        this.storeCouponList = result
                        let arr = this.storeCouponList.filter((item)=>{
                            return item.storeId == this.currentStoreId
                        })
                        this.coupon_list = arr || []
                        this.handleStoreCoupon();
                    }
                })
            },
            // 更新店铺优惠券状态
            handleStoreCoupon(){
                if (this.tempList && this.tempList.storeCartGroupList) {
                    this.tempList.storeCartGroupList.forEach(item => {
                        let flag = this.storeCouponList.some((item1)=>{return item.storeId == item1.storeId})
                        this.$set(item,'hasCoupon',flag)
                    })
                }
            },
            showDiscountDetails() {
                if (this.detailsPopupShowFlag) {
                    this.detailsPopupShowFlag = false
                    this.$refs.detailsPopup.close();
                } else {
                    this.detailsPopupShowFlag = true
                    this.detailsPopupShow = true
                    this.$refs.detailsPopup.open();
                }
                
            },
            openFreightRules(storeId) {
                if (this.tempData?.storeCartGroupList) {
                    this.tempData.storeCartGroupList.forEach((item) => {
                        if (item.storeId == storeId) {
                            this.freightRulesObj = item
                        }
                        
                    })
                }
                this.detailsPopupShow = false
                this.$refs.freightRules.open()
            },
            closeFreightRules() {
                this.$refs.freightRules.close();
            },
            makeUpAmount(item) {
                if (item) {
                    let urlObj = {
                        url_type:'url',
                        url:item
                    }
                    skipTo(urlObj,this)
                } else {
                    let hash = '#/'
                    location.href = location.origin + location.pathname + location.search + hash
                }
            }
        }
    }
</script>

<style lang='scss'>
    uni-page-body {
        overflow: auto;
    }

    .num-font {
        font-weight: normal !important;
    }
    // 自定义导航栏按钮宽度
    ::v-deep .uni-navbar__header-btns {
        width: 344rpx;
        justify-content: flex-end;
        height: 88rpx;
        .adressBar{
            height: 88rpx;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            .iconfont{
                color: #222222;
            }
            .deliver_goods_title.fontScaleIgnore{
                font-size: 28rpx;
                font-weight: 600;
                color: #333333;
                margin-right: 10rpx;
            }
            .icon_location.fontScaleIgnore{
                font-size: 36rpx;
                margin-left: 24rpx;
                margin-right: 4rpx;
            }
            .adressMark.fontScaleIgnore{
                font-size: 28rpx;
                font-weight: 600;
                color: #333333;
                line-height: 40rpx;
                max-width: 320rpx;
                -webkit-box-flex: 1;
                -webkit-flex: 1;
                flex: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .adressDefault.fontScaleIgnore{
                color: #C2C2C2 !important;
                font-size: 28rpx;
            }
        }
  
        .navbarTxt.fontScaleIgnore {
            display: inline-block;
            font-weight: 600;
            color: #333333;
            font-size: 28rpx;
        }

        .pkTxt {
            position: relative;
            padding-right: 84rpx;

            &::after {
                content: '';
                position: absolute;
                width: 36rpx;
                height: 36rpx;
                top: 50%;
                transform: translateY(-50%);
                right: 42rpx;
                background: url('@/static/shared/compare/btn_common_VS.png');
                background-size: 100% 100%;
            }
        }
    }
    
    page {
        background-color: $bg-color-split;
        width: 750rpx;
        margin: 0 auto;
    }
    .content{
        position: relative;
    }
    .container {
        padding-bottom: 96rpx;
    }
    .attribute_dom{
        padding: 20rpx 30rpx;
        align-items: center;
        display: flex;
        justify-content: space-between;
        view{
            width: 136rpx;
            height: 56rpx;
            border-radius: 30rpx;
            background: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 26rpx;
            line-height: 32rpx;
            font-weight: 400;
            color: #222222;

        }
        .check{
            font-weight: 600;
            color: var(--tagColor);
        }
        .noData{
            pointer-events: none;
            color: #ccc;
        }
        .filter{
            visibility:hidden;
        }
    }

    .cart_header {
        background: #FFFFFF;
        padding: 30rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .cart_header_text {
            display: flex;
            align-items: center;

            image {
                width: 32rpx;
                height: 32rpx;
                margin-right: 10rpx;
            }

            text {
                font-size: 28rpx;
            }
        }

        .cart_header_btn {
            font-size: 28rpx;
        }
    }
    .cart-list-box {
        height: calc(100vh - 88rpx - 96rpx - var(--titleBarFillHeight, 0px));
        padding: 0 20rpx;
    }

    .cart-list {
        height: calc(100vh - 88rpx - 96rpx - var(--titleBarFillHeight, 0px));
        padding: 0 0 calc(96rpx + var(--safe-area-inset-bottom));
        box-sizing: border-box;
        width: 100%;
        margin: 0 auto;
        overflow-y: scroll;
        border-radius: 16rpx 16rpx 0 0;
    }

    /* 购物车列表项 */
    ::v-deep .swiper-cell-content {
        display: flex;
    }
    
    .cart-item {
        display: flex;
        position: relative;
        // height: 240rpx;
        margin-top: 20rpx;
        height: 100%;

        .rightContent {
            height: 100%;

            .move,
            .del {
                width: 100rpx;
                height: 100%;
                text-align: center;
                font-size: 28rpx;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .move {
                background: var(--cartCollectBg);
                color: var(--confirmBtnTextColor);
            }

            .del {
                background: var(--cartDelBtnBg);
                color: #fff;
            }
        }

        .image-wrapper {
            flex-shrink: 0;
            position: relative;
            background-color: #fff;
            .image-wrapper-check, .stock_not_icon{
                width: 60rpx;
                height: 100%;
                display: flex;
                align-items: center;
            }
            .goods-img {
                position: relative;
                background-size: contain;
                background-position: center center;
                background-repeat: no-repeat;
                width: 160rpx;
                height: 160rpx;
                overflow: hidden;
                background-color: #F8F6F7;
                border-radius: 14rpx;
                image{
                    width: 160rpx;
                    height: 160rpx;
                }
                ::v-deep uni-image {
                    opacity:1 !important;
                }
            }
        }

        .checkbox {
            position: absolute;
            left: -16rpx;
            top: -16rpx;
            z-index: 8;
            font-size: 44rpx;
            line-height: 1;
            padding: 4rpx;
            color: $font-color-disabled;
            background: #fff;
            border-radius: 50px;
        }

        .item-right {
            flex: 1;
            overflow: hidden;
            position: relative;
            padding-left: 24rpx;
            box-sizing: border-box;
            height: 20%;

            .right_top {
                margin-top: 10rpx;
            }

            .goods_spec {
                font-size: 26rpx;
                color: #666;
                margin-top: 10rpx;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;

            }
            .reduce{
                font-size: 24rpx;
                color: #F90208;
            }

            .promotion_desc.fontScaleIgnore{
                display: inline-flex;
                align-items: center;
                max-width: 100%;
                height: 32rpx;
                line-height: 32rpx;
                border-radius: 6rpx;
                background: var(--confirmBtnBgColor2);
                //background: #FCAA17;
                // color: #fff;
                margin: 12rpx 0;
                overflow: hidden;
                border: 2rpx solid var(--confirmBtnBgColor2);
                position: relative;

                .name.fontScaleIgnore{
                    height: 100%;
                    width: 65rpx;
                    position: relative;
                    font-size: 22rpx;
                    font-weight: bold;
                    border-width: 32rpx 7rpx 0 0; 
                    border-style: solid solid none;
                    border-color: var(--confirmBtnBgColor2) transparent transparent;
                    flex: none;
                    color:var(--cartSeckillTagTextColor);
                    text{
                        position: absolute;
                        left: 50%;
                        bottom: 50%;
                        transform: translate(-50%, 0);
                        width: 100%;
                        text-align: center;
                    }
                }
                .desc.fontScaleIgnore{
                    display: inline-block;
                    width: 260rpx;
                    font-size: 24rpx;
                    padding: 0 4rpx;
                    white-space: nowrap;
                    color: var(--confirmBtnBgColor2);
                    ::v-deep{
                        .bold{
                            font-weight: bold;
                        }
                        .normal{
                            font-weight: normal;
                        }
                    }
                    z-index: 1;
                }
                .seckill_font_bg{
                    width           : 268rpx;
                    height          : 38rpx;
                    background-color: #fff;
                    text-align      : center;
                    transform       : skewX(-10deg);
                    position        : absolute;
                    top             : 0rpx;
                    left            : 60rpx;        
                }
            }
            .dcbuy_desc.fontScaleIgnore{
                display: inline-flex;
                align-items: center;
                max-width: 100%;
                height: 32rpx;
                line-height: 32rpx;
                border-radius: 6rpx;
                background: #06C7C3;
                margin: 16rpx 0;
                overflow: hidden;
                position: relative;

                .name.fontScaleIgnore{
                    height: 100%;
                    width: 100rpx;
                    position: relative;
                    font-size: 22rpx;
                    font-weight: bold;
                    border-width: 32rpx 7rpx 0 0; 
                    border-style: solid solid none;
                    border-color: #222222 transparent transparent;
                    flex: none;
                    text{
                        position: absolute;
                        left: 50%;
                        bottom: 50%;
                        transform: translate(-50%, 0);
                        width: 100%;
                        text-align: center;
                        color: #06C7C3;
                    }
                }
                .desc.fontScaleIgnore{
                    display: inline-block;
                    width: 200rpx;
                    font-size: 24rpx;
                    padding: 0 4rpx;
                    white-space: nowrap;
                    color: #222222;
                    ::v-deep{
                        .bold{
                            font-weight: bold;
                        }
                        .normal{
                            font-weight: normal;
                        }
                    }
                    z-index: 1;
                }
                .seckill_font_bg{
                    width           : 0rpx;
                    height          : 38rpx;
                    background-color: #fff;
                    text-align      : center;
                    transform       : skewX(-10deg);
                    position        : absolute;
                    top             : 0rpx;
                    left            : 96rpx;        
                }
            }

            .del_price{
                text-decoration: line-through;
                opacity: 0.6;
                font-size: 28rpx;
                font-weight: bold;
                color: #999999;
                margin-top: 8rpx;
            }
            .takeHomePriceBox {
                margin-top: 12rpx;
                width: fit-content;
                height: 48rpx;
                padding: 0 22rpx;
                border-radius: 24rpx;
                font-size: 20rpx;
                background: var(--takeHomePriceBg);
                color: var(--tagColor);
                .price_box {
                    margin-left: 6rpx;
                    line-height: 34rpx;
                }
                .unit,.small {
                    font-size: 24rpx;
                }
                .big {
                    font-size: 36rpx;
                }
            }
            .ecbuy{
                width: fit-content;
                margin: 16rpx 0;
            }

            .goods_min_number,.goods_min_number.fontScaleIgnore{
                font-size: 26rpx;
                color: var(--tagColor);
                margin-top: 10rpx;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;

            }

            .title {
                color: #222;
                font-size: 26rpx;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                word-break: break-word;
                line-height: 130%;
            }

            .attr {
                font-size: 24rpx;
                line-height: 28rpx;
                color: $main-third-color;
                background-color: #F8F8F8;
                padding: 3rpx 7rpx;
                border-radius: 6rpx;
            }

            .price {
                height: 50rpx;
                line-height: 50rpx;
            }
            .changegoods{
                display: flex;
                margin: 8rpx 0 18rpx 0;
                .trade_spec_btn{
                    max-width: 278rpx;
                    min-width: 116rpx;
                    margin-right: 16rpx;
                    display: flex;
                    justify-content: center;
                    background: #f5f6f8;
                    border-radius: 30rpx;
                    margin-bottom: 6rpx;
                    padding:4rpx 16rpx;
                    text {
                        font-size: 24rpx;
                        
                        font-weight: 500;
                        color: #666666;
                        line-height: 30rpx;
                    }
                    .iconfont {
                        font-size: 16rpx;
                        margin-left: 8rpx;
                        color:#c2c2c2;
                    }
                }
            }
            .trade_promotion_btn {
                display: flex;
                justify-content: center;
                background: #f5f6f8;
                border-radius: 30rpx;
                margin-bottom: 6rpx;
                padding: 4rpx 16rpx;
                text {
                    font-size: 24rpx;
                    
                    font-weight: 500;
                    color: #666666;
                    line-height: 30rpx;
                }
                .iconfont {
                    font-size: 16rpx;
                    margin-left: 8rpx;
                    color:#c2c2c2;
                }
            }
            .right_bottom {
                .right_bottom_left,.right_bottom_left.fontScaleIgnore{
                    margin-top: 6rpx;
                    .price_wrap {
                        color: var(--confirmBtnBgColor2);
                        &.price_wrap_hide {
                            width: 148rpx;
                            // white-space: nowrap;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            word-break: break-all;
                        }

                        .unit,
                        .price_decimal {
                            font-size: 24rpx;
                            font-weight: bold;
                        }

                        .price_int {
                            font-weight: bold;
                            font-size: 34rpx;
                            line-height: 34rpx;
                        }
                    }
                }

                .goods_num_box {
                    height: 50rpx;
                    font-size: 24rpx;
                    font-weight: 600;
                    text-align: center;
                    line-height: 50rpx;
                    color: #2D2D2D;
                    border: 1px solid #f2f2f2;
                    border-radius: 6px;
                    padding: 0 15rpx;
                }
            }
        }

        .del-btn {
            padding: 4rpx 10rpx;
            font-size: 34rpx;
            height: 50rpx;
            color: $font-color-light;
        }
    }
    .ecbuyTips{
        height: 112rpx;
        background: url('@/static/shared/goods/bg_gouwuche_tixing.png') ;
        background-size: 100% 100%;
        padding: 24rpx 22rpx 16rpx 22rpx;
        .text{
            height: 72rpx;
            line-height: 36rpx;
            font-size: 26rpx;
            
            font-weight: 400;
            text-align: justify;
            color: #222222;
            letter-spacing: .82rpx;
        }
    }

    /* 底部栏 */
    .action-section {
        margin: 0 auto;
        /* #ifdef H5 */
        // margin-bottom: calc(var(--safe-area-inset-bottom) + 90rpx);
        // /* #endif */
        position: fixed;
        left: 0rpx;
        bottom: var(--tabBarHeight,0);
        right: 0;
        z-index: 95;
        display: flex;
        align-items: center;
        height: calc(96rpx + var(--safe-area-inset-bottom));
        padding: 0 32rpx var(--safe-area-inset-bottom) 40rpx;
        background: #fff;
        box-shadow: 0px 0px 10px 0px rgba(153, 153, 153, 0.1);
        width: 750rpx;
        &.action_section_edit {
            padding-right: 20rpx;
        }
        .checkbox {
            .iconfont {
                color: #BBBBBB;
                font-size: 44rpx;
            }

            .check_all_tit {
                margin-left: 8rpx;
                color: #333333;
                font-size: 28rpx;
            }
        }

        .clear-btn {
            position: absolute;
            left: 26rpx;
            top: 0;
            z-index: 4;
            width: 0;
            height: 52rpx;
            line-height: 52rpx;
            padding-left: 38rpx;
            font-size: $font-base;
            color: #fff;
            background: $font-color-disabled;
            border-radius: 0 50px 50px 0;
            opacity: 0;
            transition: .2s;

            &.show {
                opacity: 1;
                width: 120rpx;
            }
        }

        .total-box {
            flex: 1;
            // padding-right: 40rpx;
            font-size: 26rpx;
            color: #2D2D2D;
            .money{
                display: flex;
                padding-left: 24rpx;
                color: #222222;
                font-size: 28rpx;
                &.marTop {
                    margin-top: 12rpx;
                }
                .discount_details {
                    margin-left: 24rpx;
                    font-size: 20rpx;
                    font-weight: bold;
                    color: #666666;
                    .triangle_iocn {
                        margin-left: 6rpx;
                        width: 20rpx;
                        height: 20rpx;
                        background: url('@/static/shared/common/icon/uptriangle2@2x.png') center/100% 100% no-repeat;
                        &.triangle_iocn_down {
                            background: url('@/static/shared/common/icon/btn_common_downtriangle2@2x.png') center/100% 100% no-repeat;
                        }
                    }
                }
                &.discount{
                    margin-top: 0rpx;
                    font-size: 20rpx;
                    .price_wrap {
                        height: 28rpx;
                        line-height: 28rpx;
                        font-size: 24rpx;
                        color: #222222;
                        .unit.fontScaleIgnore,
                        .price_decimal.fontScaleIgnore {
                            font-size: 24rpx;
                            font-weight: bold;
                            margin-top: 4rpx;
                        }

                        .price_int.fontScaleIgnore {
                            font-size: 26rpx;
                            line-height: 30rpx;
                            font-weight: bold;
                            margin-left: 2rpx;
                        }
                    }
                }
            }
            .price_wrap {
                color: var(--tagColor);
                .unit.fontScaleIgnore,
                .price_decimal.fontScaleIgnore {
                    font-size: 28rpx;
                    font-weight: bold;
                    margin-top: 4rpx;
                }

                .price_decimal {
                    font-size: 24rpx;
                }

                .price_int {
                    font-weight: bold;
                    font-size: 40rpx;
                    line-height: 34rpx;
                    margin-left: 2rpx;
                }
            }

            .coupon {
                font-size: $font-sm;
                color: $font-color-light;

                text {
                    color: $font-color-dark;
                }
            }
        }

        .confirm-btn {
            width: 176rpx;
            height: 64rpx;
            background: var(--confirmBtnBgColor2);
            border-radius: 35rpx;
            font-size: 28rpx;
            color: var(--confirmBtnTextColor);

            .settle_num {
                font-size: 28rpx;
            }
        }
        .fast_del{
            height: 40rpx;
            display: flex;
            align-items: center;
            .fast_del_text{
                height: 40rpx;
                font-size: 28rpx;
                
                font-weight: bold;
                text-align: left;
                color: #333333;
                line-height: 40rpx;
                padding: 0 34rpx 0 6rpx;
            }
            .icon_clean{
                font-size: 32rpx;
                color:#333333;
            }
        }
        .move_collect {
            min-width: 172rpx;
            height: 64rpx;
            background: #FFFFFF;
            border: 1px solid var(--collectBtn);
            border-radius: 30rpx;
            font-size: 28rpx;
            
            font-weight: 500;
            color: var(--collectBtn);
            line-height: 64rpx;
            padding: 0 10rpx;
            
        }

        .del_more {
            width: 172rpx;
            height: 64rpx;
            border: 1rpx solid var(--deleteCartGoodsBtnBg);
            border-radius: 30rpx;
            font-size: 28rpx;
            
            font-weight: 500;
            color: var(--deleteCartGoodsBtnTextColor);
            line-height: 64rpx;
            margin-left: 20rpx;
            background: var(--prizeColor2);
        }
    }

    /* 复选框选中状态 */
    .action-section .checkbox.checked,
    .cart-item .checkbox.checked {
        color: $uni-color-primary;
    }

    .empty_part {
        display: flex;
        flex: 1;
        width: 100%;
        padding-top: calc((100vh - 88rpx - var(--titleBarFillHeight, 0px))*0.32 - 128rpx);

        .img {
            width: 256rpx;
            height: 256rpx;
            background: var(--cartEmptyImg);
            background-size: 100% 100%;
        }

        .tip_con {
            color: $main-third-color;
            font-size: 28rpx;
        }

        .ope_btn {
            color: var(--confirmBtnTextColor);
            font-size: 28rpx;
            padding: 0 25rpx;
            height: 54rpx;
            background: var(--confirmBtnBgColor2);
            border-radius: 27rpx;
            margin-top: 20rpx;
        }
    }

    .common_border{
        margin-left: 64rpx;
        height: 2rpx;
        background-color: rgba(0, 0, 0, 0.05);
    }
    .invalid_list_wrap {
        background-color: #fff;
        margin: 20rpx 0;
        border-radius: 16rpx;
        padding: 0 20rpx;
        .invalid_list_title {
            width: 100%;
            height: 80rpx;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .invalid_list_title text:nth-child(1) {
            font-size: 30rpx;
            color: #333;
        }

        .invalid_list_title text:nth-child(2) {
            font-size: 24rpx;
            color: var(--radioCheckedColor);
        }

        .invalid_list_content {
            width: 100%;
            padding-bottom: 20rpx;

            .invalid_list_item {
                padding-top: 20rpx;
                display: flex;
                align-items: center;

                .invalid_icon {
                    width: 112rpx;
                    height: 34rpx;
                    font-size: 24rpx;
                    text-align: center;
                    font-weight: 600;
                    color: #2D2D2D;
                    border-radius: 6rpx;
                    background-color: #ddd;
                    // margin-right: 15rpx;
                    line-height: 34rpx;
                }

                .invalid_img {
                    margin-right: 20rpx;

                    image {
                        width: 160rpx;
                        height: 160rpx;
                        border-radius: 14rpx;
                    }
                }

                .invalid_goods_wrap {
                    width: 100%;
                    height: 200rpx;
                    display: flex;
                    flex-direction: column;
                    position: relative;

                    .invalid_goods_name {
                        font-size: 28rpx;
                        /* height:80rpx; */
                        color: #999;
                        font-weight: 600;
                        text-overflow: -o-ellipsis-lastline;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        word-break: break-all;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                    }

                    .invalid_goods_text {
                        position: absolute;
                        bottom: 28rpx;
                        font-size: 24rpx;
                        color: #333;
                        font-weight: 600;
                    }

                    .invalid_goods_spec {
                        font-size: 12px;
                        line-height: 14px;
                        color: #999;
                        background-color: #F8F8F8;
                        padding: 1px 3px;
                        -webkit-border-radius: 3px;
                        border-radius: 3px;
                        margin-top: 8rpx;
                        width: fit-content;
                    }
                }
            }
        }
    }

    .close_img {
        width: 36rpx;
        height: 36rpx;
        margin-left: 6rpx;
    }

    .iconfont {
        font-size: 40rpx;
        color: #BBBBBB;

        &.item_check {
            color: var(--radioCheckedColor) !important;
        }
    }

    .disabled_btn {
        width: 200rpx;
        height: 70rpx;
        border-radius: 35rpx;
        font-size: 28rpx;
        background: #adadad !important;

        .settle_num {
            font-size: 28rpx;
            /* margin-top: 7rpx; */
            /* padding-bottom: 6rpx; */
        }
    }

    .step {
        width: 175rpx;
        /* margin-right: 20rpx; */
    }

    .step ::v-deep .uni-numbox__minus,
    .step ::v-deep .uni-numbox__value,
    .step ::v-deep .uni-numbox__plus {
        border-color: #999;
    }

    .stock_not {
        font-size: 24rpx;
        color: #FF0D24;
        margin-right: 20rpx;
        margin-top: 8rpx;
    }

    .stock_not_enough {
        color: #666666;
    }

    .stock_not_icon {
        color: #eeeeee;
    }
    .fast_del_model {
        .fast_del_box {
            width: 750rpx;
            height: 928rpx;
            margin: 0 auto;
            background: #eff2f5;
            border-radius: 20rpx 20rpx 0rpx 0rpx;
            padding: 32rpx 30rpx calc(120rpx + var(--safe-area-inset-bottom));
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 150;
            .fast_del_content {
                width: 690rpx;
                height: 100%;
                background-color: #eff2f5;
                .fast_del_top {
                    height: 44rpx;
                    font-size: 32rpx;
                    
                    text-align: center;
                    color: #222222;
                    box-sizing: border-box;
                    position: relative;
                    .top_text{
                        height: 44rpx;
                        line-height: 44rpx;
                        display: flex;
                        justify-content: center;
                        align-content: center;
                    }
                    .top_icon{
                        width: 44rpx;
                        height: 44rpx;
                        position: absolute;
                        top: 0rpx;
                        right: 0rpx;
                        display: flex;
                        justify-content: center;
                        align-content: center;
                        .top_icon_content{
                            width: 40rpx;
                            height: 40rpx;
                            image{
                                width: 40rpx;
                                height: 40rpx;
                            }
                        }

                    }
                    .strong{
                        font-weight: 600;
                    }
                    .fast_del_top_text{
                        margin-right: 16rpx;
                        color: #222222;
                    }
                    .fast_del_top_main{
                        color: #222222;
                    }
                    .fast_del_top_calc{
                        color: #A4ACB2;
                        display: flex;
                    }
                }
                .fast_del_middle {
                    background-color: #eff2f5;
                    height: calc(100% - 44rpx);
                    padding-bottom: var(--tabBarHeight);
                    .fast_del_list {
                        padding-top: 30rpx;
                        .fast_del_item {
                            padding-bottom: 48rpx;
                            .fast_del_name{
                                padding-bottom: 20rpx;
                                .checkbox {
                                    .check_name{
                                        height: 40rpx;
                                        font-size: 28rpx;
                                        font-weight: 600;
                                        text-align: left;
                                        color: #222222;
                                        line-height: 40rpx;
                                        padding-left: 15rpx;
                                    }
                                    .checkAllIcon{
                                        width: 44rpx;
                                        height: 44rpx;
                                        &.sel {
                                            background: var(--selectRadio);
                                            background-size: 100% 100%;
                                        }
                                        &.nor {
                                            background: url('@/static/shared/common/icon/btn_common_radio_nor.svg') center no-repeat; 
                                            background-size: 100% 100%;
                                        }
                                        
                                    }
                                }
                            }
                            .fast_del_desc {
                                display: flex;
                                box-sizing: border-box;
                                justify-content: flex-start;
                                flex-wrap: wrap;
                                .fast_del_desc_item{
                                    position: relative;
                                    margin: 0rpx 16rpx 16rpx 0rpx ;
                                    height: 160rpx;
                                    width: 160rpx;
                                    .single_check{
                                        position: absolute;
                                        top: 8rpx;
                                        right: 8rpx;
                                        z-index: 20;
                                        width: 44rpx;
                                        height: 44rpx;
                                        .checkAllIcon{
                                            width: 44rpx;
                                            height: 44rpx;
                                            &.sel {
                                                background: var(--selectRadio);
                                                background-size: 100% 100%;
                                            }
                                            &.nor {
                                                background: url('@/static/shared/common/icon/btn_common_radio_nor.svg') center no-repeat; 
                                                background-size: 100% 100%;
                                            }
                                        }
                                    }
                                    .good_img{
                                        display: flex;
                                        position: relative;
                                        image {
                                            width: 160rpx;
                                            height: 160rpx;
                                            border-radius: 16rpx;
                                        }
                                    }
                                }
                                :nth-child(4n){
                                    margin: 0rpx;
                                }
                            }
                        }
                    }
                    .fast_del_empy{
                        .fast_del_empy_content {
                            width: 690rpx;
                            height: 1052rpx;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                            .content_img{
                                width: 160rpx;
                                height: 160rpx;
                                background: var(--emptyImg);
                                background-size: 100% 100%;
                            }
                            .tip_con{
                                margin-top: 32rpx;
                                height: 40rpx;
                                font-size: 28rpx;
                                font-weight: 400;
                                color: #999999;
                                line-height: 40rpx;
                                letter-spacing: 2.54rpx;
                            }
                        }
                    }
                }
                .fast_del_bottom{
                    height: calc(120rpx + var(--safe-area-inset-bottom));
                    width: 750rpx;
                    background: #fff;
                    padding: 20rpx 30rpx var(--safe-area-inset-bottom);
                    position: fixed;
                    left: 0rpx;
                    bottom: var(--tabBarHeight);
                    right: 0;
                    z-index: 95;
                    display: flex;
                    align-items: center;
                    justify-content:center;
                    font-size: 30rpx;
                    
                    font-weight: 600;
                    text-align: center;
                    .move_collect {
                        width: 100%;
                        height: 80rpx;
                        border: 2rpx solid var(--confirmBtnBgColor2);
                        background: #FFFFFF;
                        border-radius: 100rpx 0rpx 0rpx 100rpx;
                        .move_text{
                            height: 32rpx;
                            color: var(--confirmBtnBgColor2);
                            line-height: 32rpx;
                        }
                    }
                    .del_more {
                        width: 100%;
                        height: 80rpx;
                        border: 2rpx solid var(--confirmBtnBgColor2);
                        border-radius: 0rpx 100rpx 100rpx 0rpx;
                        background: var(--confirmBtnBgColor2);
                        .del_text {
                            height: 32rpx;
                            color: var(--confirmBtnTextColor);
                            line-height: 32rpx;
                        }
                    }
                }
            }
        }
    }
    .promotion_box {
        width: 750rpx;
        height: 100%;
        background-color: #eff2f5;
        border-radius: 16rpx 16rpx 0 0;
        padding: 0 20rpx;
        box-sizing: border-box;

        .promotion_goods_wrap {
            border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);
            display: flex;
            padding: 20rpx 0;

            .promotion_goods_img_wrap {
                width: 180rpx;
                height: 180rpx;
                border-radius: 16rpx;
                margin-right: 20rpx;
                background-color: #eee;

                .promotion_goods_img {
                    width: 180rpx;
                    height: 180rpx;
                    border-radius: 16rpx;
                }
            }

            .promotion_goods_right {
                width: 100%;
                position: relative;

                .promotion_goods_price {
                    display: flex;
                    align-items: flex-end;

                    .promotion_goods_price_now {
                        color: var(--confirmBtnBgColor2);
                        font-weight: bold;
                        margin-right: 20rpx;

                        .small_price {
                            font-size: 24rpx;
                        }

                        .big_price {
                            font-size: 34rpx;
                        }
                    }

                    .promotion_goods_price_old {
                        font-size: 28rpx;
                        color: #999;
                        text-decoration: line-through;
                    }
                }

                .promotion_goods_spec {
                    font-size: 28rpx;
                    color: #333;
                    text-overflow: -o-ellipsis-lastline;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    line-clamp: 2;
                    -webkit-box-orient: vertical;
                    position: absolute;
                    left: 0;
                    bottom: 20rpx;
                }

                .close_icon {
                    width: 30rpx;
                    height: 30rpx;
                    position: absolute;
                    right: 0;
                    top: 0;
                }
            }
        }

        .promotion_rules_wrap {
            height: 530rpx;
            margin-top: 30rpx;
            padding-bottom: calc(var(--safe-area-inset-bottom) + var(--tabBarHeight,0));
            overflow-y: scroll;

            .promotion_rules_title {
                // margin-top: 30rpx;
                font-size: 32rpx;
                color: #333;
                font-weight: bold;
            }

            .promotion_rule_item {
                margin-top: 45rpx;
                display: flex;
                align-items: center;

                .promotion_text_wrapper{
                    display: flex;
                    flex-wrap: wrap;
                    .promotion_text {
                      display: inline-block;
                      font-size: 28rpx;
                      color: #333;
                      margin-left: 24rpx;
                    }
                }


            }
        }

        
    }
    .confirm_btn_wrap {
            width: 750rpx;
            position: fixed;
            z-index: 1000;
            bottom: var(--tabBarHeight,0);
            /* #ifdef MP-WEIXIN */
            bottom: var(--tabBarHeight,0);
            /* #endif */
            left: 0;
            height: calc(120rpx + var(--safe-area-inset-bottom));
            display: flex;
            justify-content: center;
            align-items: center;
            padding-bottom: var(--safe-area-inset-bottom);
            box-shadow: 0px 0px 20px 0px rgba(86, 86, 86, 0.08);

            .confirm_btn {
                width: 690rpx;
                height: 80rpx;
                color: var(--confirmBtnTextColor);
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 30rpx;
                font-weight: 600;
                background: var(--confirmBtnBgColor2);
                border-radius: 40rpx;
            }
        }
    /* 领取优惠券弹框 */
    .coupon_box {
        height: 900rpx;
        background-color: #f5f5f5;
        border-radius: 15rpx 15rpx 0 0;

        .coupon_title {
            height: 90rpx;
            display: flex;
            align-items: center;
            font-size: 32rpx;
            color: #333;
            font-weight: bold;
            justify-content: space-between;
            padding: 0 20rpx 0 30rpx;
            box-sizing: border-box;
            background-color: #fff;

            .close_icon {
                width: 30rpx;
                height: 30rpx;
            }
        }

        .coupon_content_wrap {
            height: 810rpx;
            overflow-y: scroll;
            padding: 0 20rpx 120rpx 20rpx;
            box-sizing: border-box;

            .coupon_item {
                width: 100%;
                margin-top: 20rpx;

                .coupon_top {
                    height: 180rpx;
                    display: flex;
                    align-items: center;
                    background-color: #FFF7F5;
                    border-radius: 15rpx;
                    position: relative;

                    .coupon_price {
                        width: 200rpx;
                        font-size: 60rpx;
                        color: #FF1812;
                        font-weight: bold;
                        display: flex;
                        justify-content: center;
                    }

                    .coupon_rules_wrap {
                        .coupon_rule {
                            font-size: 34rpx;
                            color: #333;
                            font-weight: bold;
                        }

                        .coupon_time {
                            font-size: 28rpx;
                            color: #999;
                            margin-top: 18rpx;
                            font-weight: 400;
                        }
                    }

                    .have_apply {
                        width: 135rpx;
                        height: 50rpx;
                        position: absolute;
                        right: 28rpx;
                        top: 50%;
                        transform: translateY(-50%);
                    }
                }

                .coupon_bottom {
                    font-size: 26rpx;
                    color: #333;
                    padding: 20rpx 30rpx;
                    box-sizing: border-box;
                    background-color: #fff;
                    border-radius: 15rpx;
                    position: relative;

                    .rule_icon {
                        width: 28rpx;
                        height: 28rpx;
                        position: absolute;
                        right: 30rpx;
                        top: 50%;
                        transform: translateY(-50%);
                    }
                }
            }
        }
    }

    .coupon_rule_text {
        width: 581rpx;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .shop_list_wrap {
        .shop_item {
            background-color: #fff;
            border-radius: 16rpx;
            box-sizing: border-box;
            margin-bottom: 16rpx;
            // overflow: visible;
            .freight_box {
                height: 64rpx;
                padding: 0 30rpx 0 84rpx;
                .freight_con {
                    width: 100%;
                    height: 100%;
                    padding: 0 12rpx 0 170rpx;
                    background: url('@/static/shared/cart/bg_gwc_yufeicoudan.svg') left no-repeat;
                    background-size: cover;
                    .freight_con_box {
                        width: calc(100% - 104rpx);
                    }
                    .makeUp_amount {
                        max-width: calc(100% - 30rpx);
                        line-height: 34rpx;
                        font-size: 24rpx;
                        font-weight: bold;
                        color: #222222;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    .ruels_tips {
                        margin-left: 6rpx;
                        width: 24rpx;
                        height: 24rpx;
                        background: url('@/static/shared/common/icon/btn_common_gantanhao.svg') center/100% 100% no-repeat;
                    }
                    .add_on_amount {
                        width: 104rpx;
                        height: 40rpx;
                        text-align: center;
                        line-height: 36rpx;
                        border: 2rpx solid #ff5700;
                        border-radius: 8rpx;
                        font-size: 24rpx;
                        font-weight: bold;
                        color: #ff5700;
                    }
                }
            }
            .shop_item_top_box {
                position: sticky;
                top: 0;
                z-index: 100;
                background: #fff;
                border-radius: 16rpx;
                &.pad10 {
                    padding-bottom: 20rpx;
                }
            }

            .shop_item_top {
                display: flex;
                align-items: center;
                position: relative;
                padding-bottom: 20rpx;
                // border-bottom: 1rpx solid #F2F2F2;
                border-radius: 20rpx 20rpx 0rpx 0rpx;
                padding: 20rpx 24rpx;
                box-sizing: border-box;
                // background: url('@/static/shared/goods/bg_gwc_dianpu.png') no-repeat; 
                // background-size:cover;

                .shop_icon {
                    width: 32rpx;
                    height: 32rpx;
                    margin: 0 12rpx 0 20rpx;
                    background: url('@/static/shared/goods/shop_icon.png') center/100% 100% no-repeat;
                    &.ownStore {
                        height: 32rpx;
                        background: var(--storeLogo);
                        background-size: 100% 100%;
                    }
                }

                .shop_name {
                    font-size: 28rpx;
                    color: #2d2d2d;
                    font-weight: 600;
                    margin-right: 10rpx;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 500rpx;
                }

                .to_right_icon {
                    width: 13rpx;
                    height: 22rpx;
                }

                .coupon_icon {
                    width: 62rpx;
                    height: 30rpx;
                    position: absolute;
                    top: 50%;
                    right: 0;
                    transform: translateY(-50%);
                }
            }
        }
    }

    .discount_activity {
        padding: 0 20rpx 20rpx 24rpx;
        box-sizing: border-box;
    }

    .discountWrap{
        width: 100%;
        display: flex;
        padding: 10rpx 0 10rpx 84rpx;
        .discount_icon {
            width: 58rpx;
            height: 30rpx;
            font-size: 20rpx;
            font-weight: bold;
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #f30300;
            border-radius: 6rpx;
            margin-right: 8rpx;
        }
        .discount_content{
            flex: 1;
            font-size: 24rpx;
            font-weight: bold;
            color: #222222;
        }
    }
    .discount_left {
        margin-right:12rpx;
        display: flex;
        align-items: center;
        &:first-of-type {
            margin-top: 0;
        }
        

        .promotion_text {
            // width: 550rpx;
            display: flex;
            .discount_text {
                font-size: 24rpx;
                font-weight: bold;
                color: #222222;
                display: flex;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space:nowrap;
                ::v-deep .rich_text_wrap {
                    padding: 0;
                    font-size: 24rpx;
                    #top>div>div {
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space:nowrap;
                    }
                }
            }
        }
    }

    .discount_activity_wrap {
        display: flex;
        justify-content: space-between;
        margin-top: 20rpx;
    }

    /* 优惠券弹框 start */
    .coupon_model {
        width: 100%;
        height: 100%;
        background: #F5F5F5;

        .coupon_model_list {
            box-sizing: border-box;
            width: 750rpx;
            height: 100%;
            overflow-x: hidden;
            padding: 0rpx 20rpx;
            box-sizing: border-box;
            padding-bottom: var(--tabBarHeight);
            .my_coupon_pre {
                margin-bottom: 30rpx;
                position: relative;
                &:first-child{
                    margin-top: 30rpx;
                }

                .coupon_pre_top {
                    position: relative;
                    height: 100%;
                    background-size: 100% 100%;
                    display: flex;
                    align-items: stretch;
                    border-radius: 16rpx;
                    overflow: hidden;

                    .coupon_pre_left,.coupon_pre_left.fontScaleIgnore{
                        display: flex;
                        flex-direction: column;
                        width: 192rpx;
                        align-items: center;
                        justify-content: center;
                        padding: 0 8rpx;
                        color: #f30300;
                        background: #fff;

                        .coupon_pre_price {
                            margin-top: 19rpx;
                            font-size: 28rpx;
                            font-family: Source Han Sans CN;
                            font-weight: bold;
                            line-height: 34rpx;
                            .price_int{
                                font-size: 56rpx;
                                font-weight: bold;
                                color: #F30801;
                                font-family: Source Han Sans CN;
                            }
                        }

                        .coupon_pre_active {
                            width: 100%;
                            font-size: 24rpx;
                            font-family: Source Han Sans CN;
                            font-weight: 500;
                            line-height: 24rpx;
                            margin-top: 18rpx;
                            text-align: center;
                        }
                    }

                    .coupon_pre_cen {
                        display: felx;
                        flex-direction: column;
                        flex: 1;
                        padding: 22rpx 0rpx 22rpx 10rpx;
                        color: #222222;
                        background: #fff;

                        .coupon_pre_title {
                            min-height: 72rpx;
                            line-height: 135%;
                            font-size: 28rpx;
                            
                            font-weight: bold;
                            text-overflow: -o-ellipsis-lastline;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            display: -webkit-box;
                            -webkit-line-clamp: 2;
                            line-clamp: 2;
                            word-break: break-all;
                            -webkit-box-orient: vertical;
                        }

                        .coupon_pre_time,.coupon_pre_time.fontScaleIgnore {
                            font-size: 22rpx;
                            
                            line-height: 32rpx;
                            margin: 10rpx 0 2rpx;
                            word-break: break-all;
                            &.lineH16{
                                height: 32rpx;
                                line-height: 32rpx;
                            }
                            &.lineH12{
                                height: 52rpx;
                                line-height: 24rpx;
                            }
                        }

                        .coupon_pre_rules {
                            display: flex;
                            align-items: center;
                            line-height: 32rpx;
                            font-size: 22rpx;
                            text {
                                font-size: 24rpx;
                                
                                font-weight: 500;
                                color: #999999;
                                line-height: 31rpx;
                            }

                            image {
                                width: 24rpx;
                                height: 24rpx;
                                margin-left: 8rpx;
                            }
                        }
                    }
                    .kacao{
                        width: 24rpx;
                        background-size: 24rpx 100%;
                        &.kacao1{
                            background-image: url('@/static/shared/coupon/bg_yhq_xuxian1.1.png');
                        }
                        &.kacao1_notUse{
                            background-image: url('@/static/shared/coupon/bg_yhq_xuxian1.png');
                        }
                        &.kacao2{
                            background-image: url('@/static/shared/coupon/bg_yhq_xuxian3.2.png');
                        }
                        &.kacao2_haveExpired{
                            background-image: url('@/static/shared/coupon/bg_yhq_xuxian3.png');
                        }
                    }

                    .coupon_pre_right {
                        width: 176rpx;
                        background: linear-gradient(152deg,#FF2929 4%, #FC1C1C 100%);
                        .coupon_right{
                            width: 100%;
                            height: 100%;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            color: #ffffff;
                            font-size: 28rpx;
                            &.haveReceived{
                                padding: 32rpx 0 28rpx 0;
                                flex-direction: column;
                                justify-content: space-between;
                            }
                            &.haveExpired{
                                background: #FDC2B8;
                            }
                        }
                        image{
                            width: 160rpx;
                            height: 160rpx;
                            }
                    }
                }

                .coupon_rules {
                    width: 100%;
                    // padding: 20rpx 0 20rpx 43rpx;
                    padding: 36rpx 24rpx 20rpx;
                    text-align: justify;
                    box-sizing: border-box;
                    font-size: 22rpx;
                    
                    font-weight: 500;
                    word-break: break-all;
                    color: #666666;
                    line-height: 30rpx;
                    background: linear-gradient(180deg,#f7f7f7, #ffffff);
                    margin-top: -16rpx;
                    border-radius: 0 0 16rpx 16rpx;

                    .coupon_rules_title {
                        margin: 16rpx 0 0rpx;
                    }
                    .coupon_type_text{
                        color: #222222;
                    }
                }

                .coupon_type.fontScaleIgnore {
                    width: 124rpx;
                    height: 36rpx;
                    line-height: 36rpx;
                    position: absolute;
                    top: 0;
                    left: 0;
                    background: #FFE8E8;
                    font-size: 20rpx;
                    font-weight: 500;
                    color: #f30300;
                    text-align: center;
                    border-radius: 16rpx 0px 20rpx 0px;
                    &.suiji{
                        background: #ffefe2;
                        color: #fe8224;
                    }
                    &.zhekou{
                        background: #e8edff;
                        color: #2455fe;
                    }
                }

                .coupon_progress {
                    width: 100%;
                    top: 10rpx;
                    right: 0rpx;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    font-size: 26rpx;
                    font-family: Source Han Sans CN;
                    font-weight: 400;
                    color: #FFFFFF;
                    line-height: 31rpx;

                    .progress_con {
                        width: 104rpx;
                        margin-top: 8rpx;
                        border-radius: 4rpx;

                        progress {
                            border-radius: 4rpx;
                        }
                    }
                }
            }
        }
    }

    /* 空优惠券 */
    .empty_coupon_wrap {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: calc(800rpx * 0.32 - 128rpx);
        box-sizing: border-box;

        .empty_coupon_img {
            width: 256rpx;
            height: 256rpx;
            background: var(--conponEmptyImg);
            background-size: 100% 100%;
            margin-bottom: 30rpx;
        }

        .empty_coupon_text {
            font-size: 26rpx;
            color: $main-third-color;
        }
    }

    /* 优惠券弹框 end */
    .goods_num_wrap {
        text-align: right;
    }

    .exceed_price_wrap {
        display: flex;
        align-items: center;
    }

    #store_no_good {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    #store_no_good {
        position: fixed;
        top: 0;
        left: 0;
        width: 750rpx;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.6);
        z-index: 999;
        right: 0;
        margin: 0 auto;
    }

    #store_no_good .content {
        width: 580rpx;
        height: 773rpx;
        background-color: white;
        border-radius: 16rpx;

        .content_title {
            margin-top: 24rpx;
            margin-bottom: 24rpx;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 30rpx;
            font-size: 32rpx;
            color: #2D2D2D;

            image {
                width: 22rpx;
                height: 22rpx;
            }
        }

        .good_list {
            height: 593rpx;
            overflow-y: scroll;
            width: 100%;

            .good_item {
                display: flex;
                align-items: center;
                padding: 30rpx;
                border-top: 1rpx solid #f2f2f2;

                image {
                    width: 70rpx;
                    height: 70rpx;
                    border-radius: 6rpx;
                }

                .good_info {
                    margin-left: 20rpx;
                    position: relative;


                    .good_name {
                        width: 382rpx;
                        font-size: 26rpx;
                    }


                    .good_spec {
                        margin-top: 20rpx;
                        font-size: 22rpx;
                    }

                    .num {
                        position: absolute;
                        bottom: 0rpx;
                        right: 0rpx;
                        font-size: 24rpx;
                        color: #333333;
                    }
                }
            }

        }

        .part_no_goods {
            width: 520rpx;
            height: 60rpx;
            font-size: 30rpx;
            color: white;

            display: flex;
            align-items: center;
            margin: 0 auto;
            border-radius: 30rpx;
            margin-top: 15rpx;

            .return {
                width: 50%;
                height: 60rpx;
                line-height: 60rpx;
                background-color: #FF8809;
                text-align: center;
                border-radius: 30rpx 0 0 30rpx;
            }

            .remove {
                width: 50%;
                height: 60rpx;
                line-height: 60rpx;
                background-color: #F90208;
                text-align: center;
                border-radius: 0 30rpx 30rpx 0;
            }
        }
    }

    .part_no_goods_another {
        position: absolute;
        left: 30rpx;
        bottom: 32rpx;
        width: 520rpx;
        height: 60rpx;
        font-size: 30rpx;
        color: white;
        display: flex;
        align-items: center;
        margin: 0 auto;
        border-radius: 30rpx;
        background-color: #F90208;

        .return {
            width: 100%;
            text-align: center;
        }
    }

    ::v-deep .uni-navbar .uni-navbar__header .uni-navbar__header-btns-left{
        width: auto;
        padding:0rpx;
    }
    .random_coupon.hide{
            display: none;
        }
        .random_coupon{
            display: flex;
            justify-content: center;
            padding-top: 250rpx;
            .random_coupon_bg{
                width: 598rpx;
                height: 804rpx;
                background-size: 100% 100%;
                padding-top: 330rpx;
                display: flex;
                flex-direction: column;
                align-items: center;
                position: relative;
                .random_coupon_price{
                    font-size: 68rpx;
                    font-family: PangMenZhengDao;
                    font-weight: 400;
                    color: #D41E04;
                }
                .random_coupon_des{
                    font-size: 30rpx;
                    font-family: Source Han Sans CN;
                    font-weight: 400;
                    color: #E52308;
                    line-height: 34rpx;
                }
                .close_btn{
                    position: absolute;
                    right: 10rpx;
                    top: 22rpx;
                    z-index: 20;
                    width: 57rpx;
                    height: 57rpx;
                    background-size: 100% 100%;
                }
            }
        }
        .details_box {
            height: 100%;
            background: #fff;
            .details_title {
                height: 100rpx;
                font-size: 32rpx;
                font-weight: bold;
                color: #333333;
            }
            .goods_amount {
                padding: 12rpx 40rpx 0;
                line-height: 40rpx;
                font-size: 28rpx;
                color: #666666;
                text:nth-of-type(2) {
                    font-size: 30rpx;
                    line-height: 36rpx;
                    font-weight: bold;
                    color: #222222;
                }
                &.discount_amount {
                    margin-top: 26rpx;
                    text:nth-of-type(2) {
                        color: #f30300;
                    }
                }
            }
            .details_rules_tips {
                margin-top: 8rpx;
                padding: 0 40rpx;
                line-height: 34rpx;
                font-size: 24rpx;
                color: #999999;
            }
        }
        .freightRules_box {
            position: relative;
            width: 590rpx;
            height: 550rpx;
            border-radius: 32rpx;
            background: #ffffff;
            .close_icon {
                position: absolute;
                top: 26rpx;
                right: 26rpx;
                width: 36rpx;
                height: 36rpx;
                background: url('@/static/shared/common/icon/close.svg') center/100% 100% no-repeat;
            }
            .title {
                padding: 42rpx 0 32rpx 0;
                line-height: 42rpx;
                font-size: 30rpx;
                font-weight: bold;
                color:#222222;
            }
            .con {
                padding: 0 30rpx;
                font-size: 28rpx;
                color:#222222;
                .rules_tips {
                    margin-top: 30rpx;
                }
            }
            .close{
                width: 100%;
                height: 90rpx;
                padding: 0 40rpx;
                 border-top: 2rpx solid #E8E8E8;
                font-size: 30rpx;
                color: #222222;
                font-weight: bold;
            }
        }
        
.omit2{
    white-space: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
.omit{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

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
                                    font-weight: 700;
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
                }
            }

            .skip_icon {
                display: block;
                width: 20rpx;
                height: 20rpx;
                margin-top: 6rpx;
            }
        }
        .spec_content {
            height: 530rpx;
            margin-top: 20rpx;
            padding-bottom: calc(var(--safe-area-inset-bottom) + var(--tabBarHeight,0));
            overflow-y: scroll;
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
            
            font-weight: 500;
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
            
            font-weight: 500;
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
button {
    padding: 0;
    margin: 0;
}
.mask{
            padding: 6rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            .text{
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;       
                width: 96rpx;
                height: 96rpx;
                border: 1px dashed #fff;
                border-radius: 50%;
                text-align: center;
                color: #fff;
                font-size: 22rpx;
            }
        
            width: 108rpx;
            height: 108rpx;
            opacity: 0.6;
            background: #000000;
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            z-index: 10;
            transform: translate(-50%,-50%);
            // margin-left: -54rpx;
            // margin-top: -54rpx;
        }
</style>
