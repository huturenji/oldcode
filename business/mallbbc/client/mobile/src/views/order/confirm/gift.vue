<template>
    <view class='container' id="container">
        <!-- 地址 -->
        <view class="gitTitle">
            <view>先支付</view>
            <view>再通过微信/{{appInfo.name}}送礼单</view>
        </view>

        <view class="goods-section flex_column_start_start" v-if="goodsData.length>0">
            <!-- 商品列表 -->
            <view class="store_list" v-for="(item,key,index) in goodsData" :key='index'>
                <view class="store_name">
                    <image class="store_logo" :src="imgUrl+'goods/store_logo.png'"></image>
                    <text class="store_name_text">{{item.storeName}}</text>
                </view>
                <view class="product_con" v-for="(product,key,index) in item.products" :key='index'>
                    <view class="g-item flex_row_start_start">
                        <view class="image" :style="{backgroundImage: 'url('+product.mainImage+')'}"></view>
                        <view class="right flex_column_between_start">
                            <view class="flex_column_start_start">
                                <text class="title">{{product.skuName}}</text>
                            </view>
                            <view class="goods_item_specs">
                                <text class="goods_item_spec">{{product.specValues?product.specValues:'默认'}}</text>
                                <text class="goods_item_buynum">*{{product.number}}</text>
                            </view>
                            <view class="price-box num-font"  v-if="product.salePrice">
                                <text class="unit">¥</text>
                                <text class="price_int">{{$getPartNumber(product.salePrice,'int')}}</text>
                                <text class="price_decimal">{{$getPartNumber(product.salePrice,'decimal')}}</text>
                            </view>
                        </view>
                    </view>
                    <view v-if='product.giftList&&product.giftList.length>0' class="gift-box">
                        <view class="gift-con" v-for="(giftItem,i) in product.giftList" :key='i'>
                            <text class="gift-box-icon" :class="{icon_fujian:giftItem.productType!=2}">{{giftItem.productType==2?'赠品':'附件'}}</text>
                            <text class="gift-box-name" v-if="giftItem.skuName">{{giftItem.skuName}}</text>
                            <text class="gift-box-num">*{{giftItem.buyNum}}</text>
                        </view>
                    </view>
                </view>

                <view class="yt-list store_info" v-if="loadNumber>0">
                    <!-- 满赠商品 -->
                    <view class="yt-list-cell-giveaway" v-if="item.sendProductList && item.sendProductList.length>0">
                        <text class="cell-tit">{{$L('赠品信息')}}</text>
                        <view class="giveaway_list">
                            <view class="giveaway_item" v-for="(giveaway,index) in item.sendProductList" :key="index">
                                <view class="giveaway_item_left">
                                    <text class="giveaway_item_index">{{$L('赠品')}}{{index+1}}：</text>
                                    <text class="giveaway_item_name">{{giveaway.skuName}}</text>
                                    <text>{{$L('（赠完即止）')}}</text>
                                </view>
                                <text class="giveaway_item_number">*{{giveaway.num}}</text>
                            </view>
                        </view>
                    </view>

                    <!-- 备注 -->
                    <view class="yt-list-cell order_remark" v-if="loadNumber>0" @click="open_remark(item.storeId)">
                        <view class="cell-tit">{{$L('订单备注')}}</view>
                        <view class="cell-tip voice arrow_right remark_text" v-if="reMarkMap[item.storeId]"><text>{{reMarkMap[item.storeId]}}</text></view>
                        <view class="cell-tip default_remark_text arrow_right" v-else>{{$L('给商家备注')}}</view>
                    </view>
                </view>
                <view class="default_row_box default_row_box_1" v-else>
                    <view class="default_row_cell default_row_cell_2 animated-background"></view>
                    <view class="default_row_cell default_row_cell_1 animated-background"></view>
                    <view class="default_row_cell animated-background"></view>
                </view>
            </view>

        </view>


        <!-- 发票、平台优惠券 -->
        <template>
            <view class="yt-list" v-if="loadNumber>0">
                <!-- 商品总价 -->
                <view class="yt-list-cell">
                    <view class="cell-tit">{{$L('商品总价')}}</view>
                    <view class="cell-tip voice num-font">￥{{$getPartNumber(allData.goodsAmount,'int')}}{{$getPartNumber(allData.goodsAmount,'decimal')}}</view>
                </view>
                <!-- 运费总价 -->
                <view class="yt-list-cell" @click="showFreightDetail(goodsData[0].expressFeeInfo,goodsData[0].storeId)">
                    <view class="cell-tit clamp">{{$L('运费总价')}}</view>
                    <view class="cell-tip voice num-font" :class="{arrow_right:goodsData[0].expressFeeInfo.state==1 && !(goodsData[0].expressFeeInfo.lowerAmount==-1 || goodsData[0].expressFeeInfo.originFreight==0)}">
                        {{(allData.freightAmount || (goodsData[0].expressFeeInfo.state==1 && goodsData[0].expressFeeInfo.lowerAmount!=-1 && goodsData[0].expressFeeInfo.originFreight>0)) ? ('+￥' + $getPartNumber(allData.freightAmount,'int') + $getPartNumber(allData.freightAmount,'decimal')) : '免运费'}}
                    </view>
                </view>
                <!-- 满减金额 -->
                <view class="yt-list-cell" v-if="allData.totalFullDiscount != 0">
                    <view class="cell-tit">{{$L('立减')}}</view>
                    <view class="cell-tip num-font">-￥{{$getPartNumber(allData.totalFullDiscount,'int')}}{{$getPartNumber(allData.totalFullDiscount,'decimal')}}</view>
                </view>
                <!-- 优惠券 -->
                <view class="yt-list-cell" @click="select_couponList">
                    <view class="cell-tit cell_coupon">
                        <text>{{$L('优惠券')}}</text>
                        <text class="cell_recommend" v-if="allAvailableCouponList.length != 0 && isRecommendCoupon">{{$L('已选推荐优惠券')}}</text>
                    </view>
                    <view v-if="allAvailableCouponList.length == 0" class="cell-tip voice arrow_right">{{$L('无可用优惠券')}}</view>
                    <view v-else class="cell-tip arrow_right num-font">-￥{{$getPartNumber(totalCouponDiscount,'int')}}{{$getPartNumber(totalCouponDiscount,'decimal')}}</view>
                </view>
                <!-- 运费券 -->
                <view class="yt-list-cell" @click="select_expressCoupon">
                    <view class="cell-tit">{{$L('运费券')}}</view>
                    <view class="cell-tip voice arrow_right" v-if="(expressCouList[0].list && expressCouList[0].list.length==0) || !allData.freightAmount">{{$L('无可用运费券')}}</view>
                    <view class="cell-tip voice arrow_right" v-if="expressCouList[0].list.length>0 && allData.freightAmount && allData.freightAmount>0 && !expressCouponAmount">{{$L('请选择运费券')}}</view>
                    <view class="cell-tip arrow_right num-font" v-if="expressCouList[0].list.length>0 && expressCouponAmount>0">-￥{{$getPartNumber(expressCouponAmount,'int')}}{{$getPartNumber(expressCouponAmount,'decimal')}}</view>
                </view>
                <!-- 红包 -->
                <view class="yt-list-cell" @click="select_redpacket">
                    <view class="cell-tit">{{$L('红包')}}</view>
                    <view class="cell-tip voice arrow_right" v-if="redpacketList.length==0 || (redpacketList.length>0 && maxRedpacketAmount<=0)">{{$L('无可用红包')}}</view>
                    <view class="cell-tip voice arrow_right" v-if="redpacketList.length>0 && maxRedpacketAmount>0 && redpacketAmount==0">{{$L('请选择红包')}}</view>
                    <view class="cell-tip arrow_right num-font" v-if="redpacketList.length>0 && redpacketAmount>0">-￥{{$getPartNumber(redpacketAmount,'int')}}{{$getPartNumber(redpacketAmount,'decimal')}}</view>
                </view>
                <!-- 云豆抵现 -->
                <view class="yt-list-cell last-yt-list-cell" v-if="intRuleList[0]==1" @click="select_integral">
                    <view class="cell-tit cell_image">
                        <text>{{$L("云豆")}}</text>
                        <image :src="imgUrl+'common/icon/icon_common_prompt.svg'" mode="" @click.stop="showIntRule"></image>
                        <text class="cell-amount" v-if="allData.integralList && allData.integralList.length>0 && initPrice>=intRuleList[2] && allData.memberIntegral>=allData.integralScale">
                            {{$L('可用余额: ')}}<text class="num-font">{{allData.memberIntegral}}</text>{{$L('个')}}
                        </text>
                    </view>
                    <view class="cell-tip arrow_right num-font" v-if="allData.integralList && allData.integralList.length>0 && initPrice>=intRuleList[2] && allData.memberIntegral>=allData.integralScale && allData.integralCashAmount>0">
                        -￥{{$getPartNumber(allData.integralCashAmount,'int')}}{{$getPartNumber(allData.integralCashAmount,'decimal')}}
                    </view>
                    <view class="cell-tip voice arrow_right"
                    v-if="allData.integralList && allData.integralList.length>0 && initPrice>=intRuleList[2] && allData.memberIntegral>=allData.integralScale && allData.integralCashAmount==0">
                        {{$L('请选择')}}
                    </view>
                    <view class="cell-tip voice arrow_right" v-if="(allData.integralList && allData.integralList.length==0) || initPrice<intRuleList[2] || allData.memberIntegral<allData.integralScale">{{$L('当前订单不支持使用云豆')}}</view>
                </view>
                
                <!-- 合计 -->
                <view class="yt-list-total" style="text-align: right;">
                    <text class="cell-tit">{{$L('合计:')}}</text>
                    <text
                        class="num-font total-amount">￥{{$getPartNumber(allData.totalAmount,'int')}}{{$getPartNumber(allData.totalAmount,'decimal')}}</text>
                </view>
            </view>
            <view class="default_row_box default_row_box_p10" v-else>
                <view class="default_row_cell animated-background"></view>
                <view class="default_row_cell default_row_cell_1 animated-background"></view>
                <view class="default_row_cell default_row_cell_2 animated-background"></view>
                <view class="default_row_cell default_row_cell_1 animated-background"></view>
                <view class="default_row_cell animated-background"></view>
                <view class="default_row_cell default_row_cell_1 animated-background"></view>
                <view class="default_row_cell default_row_cell_2 animated-background"></view>
                <view class="default_row_cell default_row_cell_1 default_row_last_cell animated-background"></view>
            </view>
            <view class="yt-list" v-if="allData.totalAmount != 0 && loadNumber>0">
                <!-- 经陈sir确认，下单金额为0时，不显示开发票和补开发票 2022/07/29 -->
                <view class="yt-list-cell invoice" @click="toInvoice">
                    <view class="cell-tit">{{$L('发票')}}</view>
                    <view class="cell-tip voice arrow_right" v-if="!!!invoiceInfo.name">{{$L('不需要发票')}}</view>
                    <view class="cell-tip voice arrow_right" v-else><text class="limVoice">{{invoiceInfo.name}}</text><text>{{invoiceContent==1?'商品明细':'商品类别'}}</text></view>
                </view>
            </view>
        </template>
        <!-- <view class="empty_h"></view> -->
        <!-- 金额明细 -->
        <view class="empty_h"></view>

        <!-- 底部 -->
        <view class="footer flex_row_end_center" v-if="isBottomShow && loadNumber>0">
            <view class="price-content flex_column_center_end">
                <view class="should_pay flex_row_end_end">
                    <text class="tit">{{$L('合计')}}：</text>
                    <view class="num-font">
                        <text class="unit">￥</text>
                        <text class="big_price">{{$getPartNumber(allData.totalAmount,'int')}}</text>
                        <text
                            class="small_price">{{$getPartNumber(allData.totalAmount,'decimal')}}</text>
                    </view>
                </view>
                <view class="promotion_total" v-if="totalDiscount && totalDiscount>0">
                    已省:<text class="num-font">￥{{$getPartNumber(totalDiscount,'int')}}{{$getPartNumber(totalDiscount,'decimal')}}</text>
                </view>

            </view>
            <text class="submit flex_row_center_center"
                @click="testConfirmOrder">{{$L('提交订单')}}</text>
        </view>
        <view class="footer flex_row_end_center default_footer" v-if="isBottomShow && loadNumber<1">
            <view class="default_footer_left animated-background"></view>
            <view class="default_footer_right animated-background"></view>
        </view>


        <!-- 商品全部，部分无货弹窗 start-->
        <uni-popup ref="noGoodRef" type="center" >
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
                    <view v-if='no_good_info.state==2' class="part_no_goods">
                        <view class="return" @click="returnLastPage">
                            {{$L('返回')}}
                        </view>
                        <view class="remove" @click='clearFailureGoods'>
                            {{$L('移除无货商品')}}
                        </view>
                    </view>
                    <view v-else-if="no_good_info.state==7" class="part_no_goods_another">
                        <view class="return" @click="upPrice">
                            {{$L('确定')}}
                        </view>
                    </view>
                    <view v-else class="part_no_goods_another">
                        <view class="return" @click="returnLastPage">
                            {{$L('返回')}}
                        </view>
                    </view>
                </view>
            </view>
        </uni-popup>
        <!-- 商品全部，部分无货弹窗 end-->


        <!-- 云豆抵现弹框 -->
        <bottomPopup ref="integralModel" type="bottom" height="900rpx" :showTitle="false" :showCloseBtn="false" class="intPopup" conBackground="transparent">
            <view class="address_list_con">
                <view class="int_fudai"></view>
                <view class="colse_int_popup" @click="closeInt"></view>
                <view class="member_int flex_column_start_center">
                    <view class="int_title" @click="showIntRule">{{$L("云豆")}}</view>
                    <view class="int_balance">{{$L("可用余额")}}：<text class="num-font int_num">{{allData.memberIntegral}}</text>{{$L(" 个")}}</view>
                </view>
                <scroll-view scroll-y="true" class="address_list" @touchmove.stop.prevent="moveHandle">
                    <template v-if="allData.integralList && allData.integralList.length>0">
                    <view v-for="(item, index) in allData.integralList" :key="index" class="list" @click="selInt(item)">
                        <view class="wrapper flex_row_start_center">
                            <view class="flex_column_start_start">
                                <view class="address-box">
                                    <text class="int_desc">{{$L("抵扣")}}</text>
                                    <text class="int_desc redColor">￥
                                        <text class="price_int num-font">{{$getPartNumber(item/allData.integralScale,'int')}}</text>
                                        <text class="price_decimal num-font" v-if="$getPartNumber(item/allData.integralScale,'decimal')!='.00'">{{getDecimalVal($getPartNumber(item/allData.integralScale,'decimal'))}}</text>
                                    </text>
                                    <text class="int_desc">{{$L("使用")}}</text>
                                    <text class="int_desc num-font">{{item}}</text>
                                    <text class="int_desc">{{$L('云豆')}}</text>
                                </view>
                            </view>
                        </view>
                        <view class="red_h3_bottom fontScaleIgnore">
                            <view v-if="item==tmpInt" class="platform_select selected"></view>
                            <view v-else-if="item>allData.memberIntegral" class="platform_select disabledSelect"></view>
                            <view v-else class="platform_select notselect"></view>
                        </view>
                    </view>
                    </template>
                </scroll-view>
                <view class="other_address">
                    <view class="integral_opt">
                        <view class="no_int" @click="conInt('noInt')">{{$L("暂不使用云豆")}}</view>
                        <view class="int_con" @click="conInt('confirm')">{{$L("确定")}}</view>
                    </view>
                </view>
            </view>
        </bottomPopup>

        <!-- 云豆规则 -->
        <uni-popup ref="intRule" type="center" >
            <view class="intRule_box flex_column_between_center">
                <view class="intRule_fudai"></view>
                <view class="intRule_top">
                    <view class="int_title">{{$L("云豆使用规则")}}</view>
                    <view class="int_content">
                        <scroll-view :scroll-y="true">
                            <view class="int_content_title">{{$L("使用条件")}}</view>
                            <view>{{$L("1. 订单金额大于")}}<text class="num-font">{{intRuleList[2]}}</text>{{$L("元（含）。")}}</view>
                            <view>{{$L("2. 云豆数量大于")}}<text class="num-font">{{intRuleList[1]}}</text>{{$L("个（含）； 具体以页面实际 可用云豆量为准 。")}}</view>
                            <view class="int_content_title last_title">{{$L("使用数量")}}</view>
                            <view>{{$L("1. 云豆数量大于")}}<text class="num-font">{{intRuleList[1]}}</text>{{$L("个（含）。")}}</view>
                            <view>{{$L("2. ")}}<text class="num-font">{{intRuleList[1]}}</text>{{$L("云豆抵")}}<text class="num-font">1</text>{{$L('元 。')}}</view>
                        </scroll-view>
                    </view>
                </view>
                <view class="close"><view @click="closeIntRule" class="flex_row_center_center">{{$L('我知道了')}}</view></view>
            </view>
        </uni-popup>
        <!-- 优惠券弹窗 -->
        <uni-popup ref="couponPopup" type="bottom" @maskClick="closeCouponPop" @change="popChange" :showTitle="false" :showCloseBtn="false">
            <view class="couponPopup-container">
                <view class="place_background"></view>
                <view class="couponHead">
                    <view class="useHelp" @click="showHelpTips">
                        使用帮助
                    </view>
                    <view class="popup_title">{{$L("优惠券")}}</view>
                    <view class="close_icon" @click="closeCouponPop"></view>
                </view>
                <view class="couponClass">
                    <view class="nav">
                        <view :class="{default:true,select:currentIndex == index}" v-for="(item,index) in couponList" :key="index" @click="changeCouponClass(index)">
                            <text>
                                {{item.text}}
                                <span class="classLength">[<text class="num-font">{{item.listLength}}</text>]</span>
                            </text>
                        </view>
                    </view>
                    <view class="couponMsg" v-if="currentIndex == 0 && allAvailableCouponList.length > 0">
                        <view class="msg">
                            <view v-if="isRecommendCoupon" class="flex_row_start_center">
                                <text>已选推荐优惠，使用优惠券{{couponNum}}张，共抵扣</text> 
                                <span class="unit">￥{{$getPartNumber(totalCouponDiscount,'int')}}{{$getPartNumber(totalCouponDiscount,'decimal')}}</span>
                            </view>
                            <view v-if="!isRecommendCoupon && couponNum > 0" class="flex_row_start_center">
                                <text v-if="couponNum > 0">使用优惠券</text>
                                <text>{{couponNum}}张，共抵扣</text>
                                <span class="unit">￥{{$getPartNumber(totalCouponDiscount,'int')}}{{$getPartNumber(totalCouponDiscount,'decimal')}}</span>
                            </view>
                            <view v-if="!isRecommendCoupon && couponNum <= 0" class="flex_row_start_center select_coupon_tips">请选择优惠券</view>
                        </view>
                        <view class="msgBtn" v-if="!isRecommendCoupon">
                            <text @click="useInitData">使用推荐优惠</text>
                        </view>
                    </view>
                </view>
                <view :class="{couponContent:true,active:currentIndex == 1,couponContent1:currentIndex == 0 && allAvailableCouponList.length > 0}">
                    <scroll-view scroll-y class="couponScroll">
                        <view v-for="(item,classIndex) in couponList" :key="classIndex">
                            <view v-show="currentIndex == classIndex">
                                <view v-if="item.listLength>0">
                                    <view v-for="(reditem, index) in item.list" :key="index" class="couponItem">
                                        <view class="circle_radio a" :for="'red_id_' + index" :data-id="index">
                                            <view class="red_item_wrap">
                                                <view class="red_left">
                                                    <view class="red_left_content">
                                                        <view class="red_h1" v-if="reditem.couponType==2"><text class="num-font">{{reditem.value}}</text>
                                                        {{$L('折')}}
                                                        </view>
                                                        <view v-else class="red_h1 num-font" :style="{fontSize:fitfontSize['small'][$getPartNumber(reditem.value,'int').toString().length]}">
                                                            <text class="small_price">¥</text>
                                                            <text class="big_price" :style="{fontSize:fitfontSize['big'][$getPartNumber(reditem.value,'int').toString().length]}">{{$getPartNumber(reditem.value,'int')}}</text>
                                                            <text class="small_price" v-if="$getPartNumber(reditem.value,'decimal')!='.00'">{{getDecimalVal($getPartNumber(reditem.value,'decimal'))}}</text>
                                                        </view>
                                                        <view class="red_content fontScaleIgnore" :style="{fontSize:activeSize[reditem.content.length]}">{{reditem.content}}</view>
                                                    </view>
                                                </view>
                                                <view class="coupon_line"></view>
                                                <view class="white_right" :class="{white_right_disabled:classIndex==1}">
                                                    <view class="white_right_content">
                                                        <view class="red_top">
                                                            <view class="red_description_box">
                                                                <view class="red_description"><text class="content_type" :class="{store_content_type:reditem.storeId!=0}"><text>{{ reditem.storeId==0?'平台券':'店铺券' }}</text></text>{{reditem.couponName}}</view>
                                                            </view>
                                                            <view v-if="classIndex == 1" class="red_goGoodsList">
                                                                <text>差<span class="num-font">{{reditem.lackAmount}}</span>元可用该券</text>
                                                                <span @click="goGoodsList(reditem)" class="addMore flex_row_start_center">去凑单<text class="iconfont icon_arrow_right"></text></span>
                                                            </view>
                                                        </view>
                                                        
                                                        <view class="red_bottom">
                                                            <view class="red_useTime">{{reditem.useTime}}</view> 
                                                            <view v-if="classIndex == 0" class="red_h3_bottom fontScaleIgnore" @tap="select_coupon(reditem)">
                                                                <view v-if="reditem.checked == true" class="platform_select selected"></view>
                                                                <view v-else class="platform_select notselect"></view>
                                                            </view>
                                                        </view>
                                                    </view>
                                                </view>
                                    
                                            </view>
                                        </view>
                                    </view>
                                </view>
                                <view v-else class='empty_content'>
                                    <view class="imgWrap"></view>
                                    <text>{{$L('暂无优惠券')}}</text>
                                </view>
                            </view>
                        </view>
                    </scroll-view>
                </view>
                <view class="couponBottom" v-if="currentIndex == 0">
                    <view class="confirm-btn" @click="couponConfirm" >{{$L('确定')}}</view>
                </view>
            </view>
        </uni-popup>
        <!-- 红包弹窗 -->
        <uni-popup ref="redpacketPopup" type="bottom" background-color="#ffffff" @maskClick="close_redpacket" @change="popChange">
            <view class="couponPopup-container redpacket-container">
                <view class="couponHead">
                    <view class="useHelp" @click="showRedpacketRules">
                        使用帮助
                    </view>
                    <view class="popup_title">{{$L('红包 [')}}<span class="num-font">{{redpacketList.length}}</span>{{$L(']')}}</view>
                    <view class="close_icon" @click="close_redpacket"></view>
                </view>
                <view class="redpacket_content">
                    <view class="redpacket_content_top flex_column_center_start">
                        <view class="maxRedpacketAmount">{{$L('本单最大可用红包金额：')}}<span class="num-font">{{$getPartNumber(maxRedpacketAmount,'int')}}{{$getPartNumber(maxRedpacketAmount,'decimal')}}{{$L('元')}}</span></view>
                        <view class="totalRedpacket">{{$L('已选中的红包金额：')}}<span class="num-font">{{$getPartNumber(totalRedpacket,'int')}}{{$getPartNumber(totalRedpacket,'decimal')}}{{$L('元')}}</span></view>
                    </view>
                    <scroll-view scroll-y class="redpacketScroll" v-if="redpacketList && redpacketList.length>0">
                        <view v-for="(item,index) in redpacketList" :key="index" class="redpacket_item_box">
                            <view class="redpacket_item flex_row_start_start">
                                <view class="left flex_row_center_center">
                                    <view class="price_box num-font fitFont">
                                        <text class="unit num-font" :style="{fontSize:redpacketFitFontSize['small'][$getPartNumber(item.balance,'int').toString().length]}">¥</text>
                                        <text class="price_int num-font" :style="{fontSize:redpacketFitFontSize['int'][$getPartNumber(item.balance,'int').toString().length]}">{{$getPartNumber(item.balance,'int')}}</text>
                                        <text class="price_decimal num-font" v-if="$getPartNumber(item.balance,'decimal')!='.00'" :style="{fontSize:redpacketFitFontSize['decimal'][$getPartNumber(item.balance,'int').toString().length]}">{{getDecimalVal($getPartNumber(item.balance,'decimal'))}}</text>
                                    </view>
                                </view>
                                <view class="center flex_row_start_center">
                                    <view class="center_con flex_column_between_start">
                                        <view class="title">{{item.name}}</view>
                                        <view class="original_amount">{{$L('初始面额：')}}{{item.amount}}{{$L('元')}}</view>
                                        <view class="valid_date">{{maskTime(item.effectiveStart).trim().substr(0,10)}}~{{maskTime(item.effectiveEnd).trim().substr(0,10)}}</view>
                                    </view>
                                </view>
                                <view class="right">
                                    <view class="red_h3_bottom fontScaleIgnore" @tap="select_redpacket_item(item,index)">
                                        <view v-if="item.checked == true" class="platform_select selected"></view>
                                        <view v-if="item.checked == false && selectRedContinued" class="platform_select notselect"></view>
                                        <view v-if="item.checked == false && !selectRedContinued" class="platform_select disabledSelect"></view>
                                    </view>
                                </view>
                            </view>
                    </view>
                    </scroll-view>
                    <view v-else class='empty_content redpacket_empty'>
                        <view class="imgWrap"></view>
                        <text>{{$L('暂无可用红包')}}</text>
                    </view>
                </view>
                <view class="couponBottom redpacketBottom">
                    <view class="confirm-btn" @click="redpacketConfirm" >{{$L('确定')}}</view>
                </view>
            </view>
        </uni-popup>
        <!-- 运费券弹窗 -->
        <uni-popup ref="expressCouponPopup" type="bottom" @maskClick="close_expressCoupon" @change="popChange" :showTitle="false" :showCloseBtn="false">
            <view class="expressCoupon-container couponPopup-container">
                <view class="place_background"></view>
                <view class="couponHead">
                    <view class="useHelp" v-if="false">
                        使用帮助
                    </view>
                    <view class="popup_title">{{$L("运费券")}}</view>
                    <view class="close_icon" @click="close_expressCoupon"></view>
                </view>
                <view class="couponClass">
                    <view class="nav">
                        <view :class="{default:true,select:currentIndex1 == index}" v-for="(item,index) in expressCouList" :key="index" @click="changeExpressCouClass(index)">
                            <text>
                                {{item.text}}
                                <span class="classLength">[<text>{{item.listLength}}</text>]</span>
                            </text>
                        </view>
                    </view>
                </view>
                <view :class="{couponContent:true,active:currentIndex1 == 1}">
                    <scroll-view scroll-y class="couponScroll">
                        <view v-for="(item,classIndex) in expressCouList" :key="classIndex">
                            <view v-show="currentIndex1 == classIndex">
                                <template v-if="item.listLength>0">
                                    <view v-for="(reditem, index) in item.list" :key="index" class="couponItem">
                                        <view class="circle_radio a" :for="'red_id_' + index" :data-id="index">
                                            <view class="red_item_wrap">
                                                <view class="red_left">
                                                    <view class="red_left_content flex_row_center_center">
                                                        <view class="red_h1 num-font" :style="{fontSize:fitfontSize['small'][$getPartNumber(reditem.amount,'int').toString().length]}">
                                                            <text class="small_price">¥</text>
                                                            <text class="big_price" :style="{fontSize:fitfontSize['big'][$getPartNumber(reditem.amount,'int').toString().length]}">{{$getPartNumber(reditem.amount,'int')}}</text>
                                                            <text class="small_price" v-if="$getPartNumber(reditem.amount,'decimal')!='.00'">{{getDecimalVal($getPartNumber(reditem.amount,'decimal'))}}</text>
                                                        </view>
                                                    </view>
                                                </view>
                                                <view class="coupon_line"></view>
                                                <view class="white_right">
                                                    <view class="white_right_content flex_column_between_start">
                                                        <view class="top_part">
                                                            <view class="expressCou_name">
                                                                <i class="symbol"><i>运费券</i></i>
                                                                {{reditem.name}}
                                                            </view>
                                                            <!-- <view class="expressCou_rules flex_row_center_center">仅限抵扣自营商品运费</view> -->
                                                        </view>
                                                        
                                                        <view class="red_bottom">
                                                            <view class="red_useTime" v-if="reditem.effectiveStart && reditem.effectiveEnd">{{maskTime(reditem.effectiveStart).trim().substr(0,10)}}~{{maskTime(reditem.effectiveEnd).trim().substr(0,10)}}</view>
                                                            <view v-if="classIndex == 0" class="red_h3_bottom fontScaleIgnore" @tap="select_expressCou(reditem,index)">
                                                                <view v-if="reditem.checked == true" class="platform_select selected"></view>
                                                                <view v-if="reditem.checked == false && selectContinued" class="platform_select notselect"></view>
                                                                <view v-if="reditem.checked == false && !selectContinued" class="platform_select disabledSelect"></view>
                                                            </view>
                                                        </view>
                                                    </view>
                                                </view>
                                            </view>
                                        </view>
                                    </view>
                                </template>
                                <view v-else class='empty_content'>
                                    <view class="imgWrap"></view>
                                    <text>{{$L('暂无运费券')}}</text>
                                </view>
                            </view>
                        </view>
                    </scroll-view>
                </view>
                <view class="couponBottom" v-if="currentIndex1 == 0">
                    <view class="confirm-btn" @click="expressCouConfirm" >{{$L('确定')}}</view>
                </view>
            </view>
        </uni-popup>
        <!-- 使用帮助弹窗 -->
        <uniPopup ref="helpTips">
            <view class="helpTips_box flex_column_center_center">
                <view class="helpTips_title"></view>
                <view class="helpTips_con">
                    <scroll-view :scroll-y="true" :show-scrollbar="true" class="scrollY">
                        <view>{{intRuleList[4]}}</view>
                    </scroll-view>
                </view>
                <view class="close"><view @click="closeHelpTips" class="flex_row_center_center">{{$L('我知道了')}}</view></view>
            </view>
        </uniPopup>
        <!-- 运费满减明细弹窗 start-->
        <uni-popup ref="expressRulesPopup" type="bottom" background-color="#ffffff" @maskClick="close_expressRules">
            <view class="couponPopup-container expressRules-container">
                <view class="popup_title">{{$L("运费明细")}}</view>
                <view class="close_icon" @click="close_expressRules"></view>
                <view v-if="currentStoreInfo">
                    <scroll-view scroll-y class="couponScroll">
                         <view class="details_box">
                            <view class="goods_amount flex_row_between_center">
                                <text class="amount_title">{{$L('店铺运费')}}</text>
                                <text class="num-font amount_num">￥{{$getPartNumber(currentStoreInfo.expressFeeInfo.originFreight,'int')}}{{$getPartNumber(currentStoreInfo.expressFeeInfo.originFreight,'decimal')}}</text>
                            </view>
                            <view class="goods_amount flex_row_between_center discount_amount">
                                <text class="amount_title">{{$L('运费优惠')}}</text>
                                <text class="num-font amount_num redColor" v-if="currentStoreInfo.expressFeeInfo.finalLower!=-1">-￥{{$getPartNumber(currentStoreInfo.expressFeeInfo.finalLower,'int')}}{{$getPartNumber(currentStoreInfo.expressFeeInfo.finalLower,'decimal')}}</text>
                                <text class="num-font amount_num redColor" v-else>-￥{{$getPartNumber(currentStoreInfo.expressFeeInfo.originFreight,'int')}}{{$getPartNumber(currentStoreInfo.expressFeeInfo.originFreight,'decimal')}}</text>
                            </view>
                            <view class="rules_tips">
                                {{$L('订单金额满 ')}}
                                <text class="num-font amount">{{$getPartNumber(currentStoreInfo.expressFeeInfo.fullAmount,'int')}}{{$getPartNumber(currentStoreInfo.expressFeeInfo.fullAmount,'decimal')}}</text>{{$L(' 元')}}
                                <text v-if="currentStoreInfo.expressFeeInfo.lowerAmount==-1">{{$L('免运费')}}</text>
                                <text v-else>{{$L('减运费 ')}}<text class="num-font amount">{{$getPartNumber(currentStoreInfo.expressFeeInfo.lowerAmount,'int')}}{{$getPartNumber(currentStoreInfo.expressFeeInfo.lowerAmount,'decimal')}}</text>{{$L(' 元')}}</text>
                            </view>
                            <view class="goods_amount flex_row_between_center">
                                <text class="amount_title">{{$L('店铺运费实付')}}</text>
                                <text class="num-font amount_num">+￥{{$getPartNumber(currentStoreInfo.expressFeeInfo.finalFreight,'int')}}{{$getPartNumber(currentStoreInfo.expressFeeInfo.finalFreight,'decimal')}}</text>
                            </view>
                        </view>
                    </scroll-view>
                </view>
                <view class="couponBottom">
                    <view class="confirm-btn" @click="close_expressRules" >{{$L('我知道了')}}</view>
                </view>
            </view>
        </uni-popup>
        <!-- 运费满减明细弹窗 end-->
        <!-- 订单备注 start -->
        <bottomPopup ref="remarkPopup" type="bottom" height="832rpx" :showTitle="false" :showCloseBtn="false">
            <view class="remark-container">
                <view class="popup_title">{{$L("订单备注")}}</view>
                <view class="close_icon" @click="close_remarkPopup(false)"></view>
                <view class="remark_con">
                    <textarea :placeholder="$L('给商家备注，最多100字')" v-model="tempReMarkMap[currRemarkstoreId]" :adjust-position="true"
                        placeholder-class="placeholder" class="content uni-input" maxlength='100'
                        cursor-spacing="10" @focus="handleFocus" @blur="handleBlur"></textarea>
                    <view class="remark_num">
                        <text>{{currRemarkstoreId?tempReMarkMap[currRemarkstoreId].length:0}}</text>
                        <text>/100</text>
                    </view>
                </view>
                <view class="btn-box">
                    <view class="btn-handler cursor-btn" @click="close_remarkPopup(true)">
                        <view class="btn-text">确定</view>
                    </view>
                </view>
            </view>
        </bottomPopup>
        <!-- 订单备注 end -->
        <!-- 运费规则弹框 start -->
        <uniPopup ref="freightRules">
            <view class="freightRules_box flex_column_between_start">
                <view>
                    <view class="title flex_row_center_center">{{$L('运费凑单说明')}}</view>
                    <view class="con">
                        <scroll-view :scroll-y="true" :show-scrollbar="true" class="scrollY">
                            <view v-if="currentStoreInfo && currentStoreInfo.expressFeeInfo">
                                <view v-if="currentStoreInfo.expressFeeInfo.freightAmount!=-1">{{$L('1、店铺基础运费：')}}<text class="num-font">{{currentStoreInfo.expressFeeInfo.originFreight}}</text>{{$L('元；')}}</view>
                                <view v-else>{{$L('1、店铺基础运费：具体以订单内显示的金额为准；')}}</view>
                                <view>
                                    {{$L('2、该店铺订单金额满')}}
                                    <text class="num-font" v-if="currentStoreInfo.expressFeeInfo.fullAmount">{{currentStoreInfo.expressFeeInfo.fullAmount}}</text>元
                                    <text v-if="currentStoreInfo.expressFeeInfo.lowerAmount==-1">{{$L('免运费。')}}</text>
                                    <text v-else>减<text class="num-font">{{currentStoreInfo.expressFeeInfo.lowerAmount}}</text>元运费。</text>
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

<script>
import mixin from '@/common/mixin/comfirmOrderMixin'
import orderHandler from '@/components/order/handler';
import { getAppInfo } from '@/views/gift/common/lib/until';
import {skipTo,lockScroll, unlockScroll, accSub, accAdd} from '@/utils/common.js';
export default {
    data() {
        return {
            appInfo: getAppInfo(), // app相关的信息
            preParam: {}, //上一个页面的参数
            invoiceInfo: {}, //发票信息
            needInvoice: false, //是否需要发票
            isAloneBuy: false, //拼团是否单独购买
            spreaderMemberId: 0, //专门的推手分享ID设置
            intRuleList: [], //index=0-是否开启云豆抵现（0：不开 1：开） 1-云豆换算比例 2-云豆最低使用金额 3-云豆最高抵现比例
            tmpInt: 0,
            tabCurrentIndex:0,
            //优惠券列表
            couponList:[
                {
                    text:'可用优惠券',
                    list:[],
                    listLength:0
                },
                {
                    text:'不可用优惠券',
                    list:[],
                    listLength:0
                }
            ],
            queryskus:[],//用于跳转到支付页面的参数
            currentIndex:0, //默认选中可用优惠券
            fitfontSize:{
                'small':{1:'28rpx',2:'28rpx',3:'28rpx',4:'28rpx',5:'28rpx',6:'28rpx',7:'24rpx',8:'24rpx'},
                'big':{1:'56rpx',2:'56rpx',3:'56rpx',4:'56rpx',5:'46rpx',6:'38rpx',7:'34rpx',8:'30rpx'}
            },
            activeSize:{19:'22rpx',20:'22rpx',21:'20rpx',22:'20rpx'},
            redpacketCodeList:[], //选中红包id集合
            redpacketList:[], //返回的红包列表
            totalRedpacket:0, //红包总额,主要用于红包列表弹框中显示的
            actualTotalRedpacket:0, //实际选中的红包总额（可大于红包最大可用金额）
            initRedpacketData:{ //备份上一次请求confirm获取的红包数据
                initRedpacketList:[],
                initRedpacketCodeList:[],
                initTotalRedpacket:0,
                initActualTotalRedpacket:0,
                selectRedContinued:true
            },
            selectRedContinued:true, //红包列表剩下的红包是否可选，true-可选，false-不可选
            redpacketAmount:'', //确认订单显示总抵扣金额
            maxRedpacketAmount:0, //可抵扣的红包金额的最大值
            expressCouList:[ //运费券列表
                {
                    text:'可用运费券',
                    list:[],
                    listLength:0
                },
                {
                    text:'不可用运费券',
                    list:[],
                    listLength:0
                }
            ],
            currentIndex1:0, //默认选中可用运费券
            expressCouponAmount:'', //运费券抵扣金额 （主要做显示，不做计算）
            expressCouCodeList:[], //选中运费券id集合
            totalExpressCoupon:0, //选中运费券总额（主要做计算用的，不做显示）
            initExpressCouData:{ //备份上一次请求confirm获取的运费券数据
                initExpressCouList:[], //可用运费券列表
                initExpressCouCodeList:[],
                initTotalExpressCoupon:0,
                selectContinued:true
            },
            selectContinued:true, //运费券列表剩下的运费券是否可选，true-可选，false-不可选
            initPrice:0, //商品总额-运费总额+积分抵扣总额
            loadNumber:0,
            currentStoreInfo:null, //当前店铺信息
            redpacketFitFontSize:{
                'small':{1:'28rpx',2:'28rpx',3:'28rpx',4:'28rpx',5:'28rpx',6:'28rpx',7:'24rpx',8:'24rpx'},
                'int':{1:'56rpx',2:'56rpx',3:'56rpx',4:'56rpx',5:'48rpx',6:'44rpx',7:'36rpx',8:'32rpx'},
                'decimal':{1:'40rpx',2:'40rpx',3:'40rpx',4:'40rpx',5:'32rpx',6:'28rpx',7:'28rpx',8:'24rpx'}
            },
            reMarkMap: {},
            tempReMarkMap:{},
            currRemarkstoreId:''
        }
    },
    async mounted(){
        this.preParam = this.$Route.query;
        this.confirmParams = JSON.parse(this.$getStorageSync('confirmParams'))
        this.goodsData = this.confirmParams.productInfo
        let products = [];
        let allSkuList = this.goodsData.reduce((allList,item) => {
            this.$set(this.reMarkMap, item.storeId, '')
            this.$set(this.tempReMarkMap, item.storeId, '')
            return allList.concat(item.products)
                        
        },[])
        products = allSkuList.map(productItem=>{
            return {
                sku:productItem.sku,
                skuName:productItem.skuName,
                specValues:productItem.specValues,
                mainImage:productItem.mainImage,
                lowestBuy:productItem.lowestBuy,
                salePrice:productItem.salePrice,
                number:productItem.number,
                storeId:productItem.storeId,
                categoryId3:productItem.categoryId3,
                cidPath:productItem.cidPath,
                discountVO:productItem.discountVO,
                specialOfferVO:productItem.specialOfferVO,
                notAttendDiscount:productItem.notAttendDiscount
            }
        })
        this.preParam.products = JSON.stringify(products);
        this.isAloneBuy = this.$Route.query.isAloneBuy ? this.$Route.query.isAloneBuy : false
        this.spellTeamId = this.$Route.query.spellTeamId ? this.$Route.query.spellTeamId : 0

        let spreaderTmp = this.$getStorageSync('spreaderId')
        if (spreaderTmp) {
            this.spreaderMemberId = spreaderTmp
        }
        this.getVuexAddress()
        this.getIntRule()
        this.initInvoice(false); // 初始化发票信息

        uni.$on('addressBack', (data) => {
            this.showType = data
        })
        // 注册地址初始化完成事件
        uni.$on('addressRequestDone', this.getVuexAddress)
        uni.$on('checkEdit', () => {
            this.isCheckBack = true
        })
    },
    mixins: [mixin],
    computed: {
        maskTime() {
            return (time) => {
                let timeStr = ''
                if (time) {
                    timeStr = time.replaceAll('-','.')
                }
                return timeStr
            }
        },
        getDecimalVal() {
            return (val) => {
                let value = ''
                value = val.indexOf('0')==(val.length-1)?val.substring(0,(val.length-1)):val
                return value
            }
        }
    },
    onShow() {
        if (this.ifOnShow) {
            // 初始化发票信息
            this.initInvoice(true);
        }
    },
    watch: {
        allAvailableCouponList: {
            handler(val){
                this.goodsData.forEach(item => {
                    let tempAvailableCouponList = val.filter(item1 => {
                        return item1.storeId == item.storeId
                    })
                    this.$set(item,'availableCouponList',tempAvailableCouponList)
                    
                })
            },
            deep: true,
            immediate: true
        },
        allDisableCouponList: {
            handler(val){
                this.goodsData.forEach(item => {
                    let tempDisabledCouponList = val.filter(item1 => {
                        return item1.storeId == item.storeId
                    })
                    this.$set(item,'disabledCouponList',tempDisabledCouponList)
                    
                })
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        // 初始化发票
        initInvoice(flag){
            // const is_need_invoice = this.$getStorageSync('is_need_invoice')
            const is_need_invoice =flag ? this.$getStorageSync('is_need_invoice') : false; //需求9158 将确认订单页面的“发票”栏默认的逻辑由默认上一次发票抬头修改为“不需要发票”，每次确认订单时均默认不需要发票，若用户需要则点击进入选择发票抬头；
            const invoiceInfo = this.$getStorageSync('invoice_info')
            const invoiceContent = this.$getStorageSync('invoice_content')
            this.needInvoice = is_need_invoice;
            if (!!is_need_invoice) { //需要发票
                this.invoiceInfo = {};
                this.invoiceId = ''
                if (!!invoiceInfo) {
                    this.invoiceInfo = invoiceInfo;
                    this.invoiceId = invoiceInfo.titleId;
                }
                this.invoiceContent = invoiceContent || 1;
            } else { //不需要发票
                this.invoiceInfo = {};
                this.invoiceId = ''
                this.invoiceContent = 1;
            }
        },
        moveHandle() {},
        // 隐藏商品无货弹窗
        hide_good_dialog() {
            this.$refs.noGoodRef.close()
            this.store_show_no_good = false
        },

        select_integral() {
            if (this.allData.integralList.length==0 || this.initPrice<this.intRuleList[2] || this.allData.memberIntegral<this.allData.integralScale) {
                return
            }

            this.$refs.integralModel.open()
        },
        showIntRule() {
            this.$refs.intRule.open()
        },
        closeIntRule() {
            this.$refs.intRule.close()
        },
        //选择优惠券
        select_coupon(coupon) {
            this.redpacketCodeList = [];
            this.integral = 0;
            this.tmpInt = 0;
            // 平台券
            if (coupon.storeId == 0){
                this.currentPlatformCouponCode = coupon.checked == true ? '' : coupon.couponCode
                this.confirmOrder(2)
            } else {
                // 店铺券需要特殊校验——每个店铺只能选一张
                this.handlerStore(coupon)
            }
        },
        // 选择红包
        select_redpacket_item(item,index) {
            let tempValue = this.actualTotalRedpacket;
            if (this.maxRedpacketAmount > 0) {
                if (!item.checked && tempValue >= this.maxRedpacketAmount) {
                    this.$set(this.redpacketList[index],'checked',false)
                    return
                }
                this.selectRedContinued = true
                if (item.checked) {
                    this.redpacketCodeList.splice(this.redpacketCodeList.indexOf(item.code),1)
                    tempValue = accSub(tempValue,item.balance)
                } else {
                    this.redpacketCodeList.push(item.code)
                    tempValue = accAdd(tempValue,item.balance)
                }
                this.$set(this.redpacketList[index],'checked',!item.checked)
                this.actualTotalRedpacket = tempValue
                if (this.actualTotalRedpacket >= this.maxRedpacketAmount) {
                    this.selectRedContinued = false
                }
                this.totalRedpacket = this.actualTotalRedpacket >= this.maxRedpacketAmount ? this.maxRedpacketAmount : this.actualTotalRedpacket
            }
            
        },
        // 选择运费券
        select_expressCou(item,index) {
            let tempValue = this.totalExpressCoupon;
            if (this.allData.freightAmount) {
                if (!item.checked && tempValue >= this.allData.freightAmount) {
                    this.$set(this.expressCouList[0].list[index],'checked',false)
                    return
                }
                this.selectContinued = true
                if (item.checked) {
                    this.expressCouCodeList.splice(this.expressCouCodeList.indexOf(item.code),1)
                    tempValue = accSub(tempValue,item.amount)
                } else {
                    this.expressCouCodeList.push(item.code)
                    tempValue = accAdd(tempValue,item.amount)
                }
                this.$set(this.expressCouList[0].list[index],'checked',!item.checked)
                this.totalExpressCoupon = tempValue
                if (this.totalExpressCoupon >= this.allData.freightAmount) {
                    this.selectContinued = false
                }
            }
            
        },
        handlerStore(value){
            //取消

            this.goodsData.forEach((item) => {
                if (item.storeId == value.storeId){
                    
                    if (value.checked == true){
                        item.availableCouponList.forEach((item1) => {
                            if (item1.couponCode == value.couponCode){
                                this.$set(item1, 'checked', false)
                            }
                        })
                        this.confirmOrder(2)
                    } else {
                        let flag = item.availableCouponList.some((store) => {
                            return store.checked == true
                        })
                        if (flag){
   
                            item.availableCouponList.forEach((item2) => {
                                if (item2.checked == true){
                                    this.$set(item2, 'checked', false)
                                }
                            })
                        } 
                        item.availableCouponList.forEach((item2) => {
                            if (item2.couponCode == value.couponCode){
                                this.$set(item2, 'checked', true)
                            }
                        })
                        this.confirmOrder(2)
                        
                    }
                }
            })
        },
        //获取地址列表
        getAddressList(isShow) {
            if (this.addressList.length > 0) {
                this.orderAddress = this.defaultAddress;
            }
            this.confirmOrder(isShow ? 2 : 1);
        },
        returnLastPage() {
            this.$Router.back(1)
        },
        upPrice(){
            this.confirmOrder(2);
            this.$refs.noGoodRef.close()
            this.store_show_no_good = false
        },

        selInt(e) {
            this.tmpInt = e
        },
        conInt(type) {
            switch (type) {
            case 'confirm': {
                this.integral = this.tmpInt
                this.closeInt()
                this.confirmOrder(2)
                break
            }
            case 'close': {
                this.integral = 0
                this.closeInt()
                break
            }
            case 'noInt': {
                this.integral = 0
                this.confirmOrder(2)
                this.closeInt()
                break
            }
            default:
            }
        },
        closeInt() {
            this.$refs.integralModel.close()
        },
        //用于切换地址，使用优惠券，获取信息，运费等  type 服务端参数解释 1立即购买 去结算;2 提交订单页 修改优惠券 修改云豆 修改地址 更新页面数据 ;3 提交订单 
        confirmOrder(type) {
            let param = {};
            let handlerType = 'confirm';
            param.data = {};
            param.data.orderSource = 'FEATHER'
            param.data.featherSubmitParamVO = {
                giverOrReceiver: 0
            }
            // 订单接口 地址id替换为地址相关对象
            if (this.orderAddress.addressId) {
                param.data.addressId = this.orderAddress.addressId
                param.data.receiverInfo = {
                    name: this.orderAddress.memberName,
                    mobile: this.orderAddress.telMobile,
                    provinceCode: this.orderAddress.provinceCode,
                    cityCode: this.orderAddress.cityCode,
                    districtCode: this.orderAddress.districtCode,
                    townCode: this.orderAddress.townCode,
                    addressAll: this.orderAddress.addressAll,
                    detailAddress: this.orderAddress.detailAddress
                }
            }
            param.data.platformCouponCode = this.currentPlatformCouponCode
            param.data.orderSn = '';
            param.data.isAloneBuy = this.isAloneBuy //拼团商品是否单独购买
            if (this.spellTeamId != 0) {
                param.data.spellTeamId = this.spellTeamId
            }
            if (this.integral > 0) {
                param.data.integral = this.integral
            }
            let storeInfoList = []
            this.goodsData.forEach((store) => {
                let storeitem = {}
                storeitem.ownShop = store.ownShop
                storeitem.storeName = store.storeName
                storeitem.storeId = store.storeId
                storeitem.products = store.products.map(item1 => {
                    return {
                        sku:item1.sku,
                        skuName:item1.skuName,
                        specValues:item1.specValues,
                        mainImage:item1.mainImage,
                        lowestBuy:item1.lowestBuy,
                        salePrice:item1.salePrice,
                        number:item1.number,
                        categoryId3:item1.categoryId3,
                        cidPath:item1.cidPath,
                        discountVO:item1.discountVO,
                        specialOfferVO:item1.specialOfferVO,
                        notAttendDiscount:item1.notAttendDiscount
                    }
                })
                storeitem.invoiceId = this.invoiceId
                storeitem.storeCouponCode = ""
                storeitem.selectedPromiseCalendars = []
                store.availableCouponList && store.availableCouponList.forEach(item => {
                    if (item.checked == true) {
                        storeitem.storeCouponCode = item.couponCode
                    }
                })

                storeInfoList.push(storeitem)

            })
            param.data.storeInfoList = storeInfoList
            param.data.redpacketCodeList = this.redpacketCodeList
            param.data.freightCouponCodeList = this.expressCouCodeList
            param.data.source = type
            if (this.loadNumber>0) {
                uni.showLoading()
            }
            orderHandler[handlerType](param.data).then(res => {
                this.loadNumber +=1
                if (res.state == 200) {
                    let result = res.data;
                    this.goodsData = result.storeGroupList;
                    this.goodsData.forEach(item => {
                        let list = JSON.parse(this.preParam.products)
                        item.products = item.products.map(item1 => {
                            let tempIndex = list.findIndex(tepItem => tepItem.sku == item1.sku)
                            return {
                                ...item1,
                                storeId:item.storeId,
                                categoryId3:list[tempIndex].categoryId3,
                                cidPath:list[tempIndex].cidPath,
                                discountVO:list[tempIndex].discountVO,
                                specialOfferVO:list[tempIndex].specialOfferVO,
                                notAttendDiscount:list[tempIndex].notAttendDiscount
                            }
                        })
                    })
                    this.isVatInvoice = result.isVatInvoice
                    this.totalDiscount = result.totalDiscount;
                    this.totalCouponDiscount = res.data?.totalCouponDiscount;
                    // 红包
                    this.redpacketAmount = res.data?.redpacketAmount
                    this.totalRedpacket = res.data?.redpacketAmount
                    this.redpacketList = res.data?.redpacketVOList
                    this.maxRedpacketAmount = res.data?.maxRedpacketAmount
                    if (this.redpacketList && this.redpacketList.length>0) {
                        let tempList = [],tempValueList = []
                        this.redpacketList.forEach(item => {
                            if (item.checked) {
                                tempList.push(item.code)
                                tempValueList.push(item.balance)
                            }
                        })
                        this.actualTotalRedpacket = tempValueList.reduce((sum,val) => { return sum += val },0)
                        this.initRedpacketData.initActualTotalRedpacket = this.actualTotalRedpacket
                        this.redpacketCodeList = tempList
                        this.initRedpacketData.initRedpacketCodeList = JSON.parse(JSON.stringify(tempList))
                    }
                    
                    this.initRedpacketData.initRedpacketList = JSON.parse(JSON.stringify(res.data?.redpacketVOList))
                    this.initRedpacketData.initTotalRedpacket = res.data?.redpacketAmount
                    if (this.actualTotalRedpacket >= this.maxRedpacketAmount) {
                        this.initRedpacketData.selectRedContinued = false
                        this.selectRedContinued = false
                    } else {
                        this.initRedpacketData.selectRedContinued = true
                        this.selectRedContinued = true
                    }

                    // 运费券
                    this.expressCouponAmount = res.data?.freightCouponAmount;
                    res.data?.availableFreightCouponList!=null && this.$set(this.expressCouList[0],'list',res.data?.availableFreightCouponList) //可用运费券
                    res.data?.disableFreightCouponList!=null && this.$set(this.expressCouList[1],'list',res.data?.disableFreightCouponList) //不可用运费券
                    res.data?.availableFreightCouponList!=null && this.$set(this.expressCouList[0],'listLength',res.data?.availableFreightCouponList.length) //可用运费券
                    res.data?.disableFreightCouponList!=null && this.$set(this.expressCouList[1],'listLength',res.data?.disableFreightCouponList.length) //不可用运费券
                    if (this.expressCouList[0].list && this.expressCouList[0].list.length>0) {
                        let tempList1 = [],tempValue = 0
                        this.expressCouList[0].list.forEach(item => {
                            if (item.checked) {
                                tempList1.push(item.code);
                                tempValue = tempValue + item.amount
                            }
                        })
                        this.expressCouCodeList = tempList1;
                        this.totalExpressCoupon = tempValue;
                        this.initExpressCouData.initTotalExpressCoupon = tempValue;
                        this.initExpressCouData.initExpressCouCodeList = JSON.parse(JSON.stringify(tempList1));
                    }
                    if (res.data?.availableFreightCouponList!=null) {
                        this.initExpressCouData.initExpressCouList = JSON.parse(JSON.stringify(res.data?.availableFreightCouponList)); //可用
                    }

                    this.allData = result;
                    this.initPrice = accAdd(accSub(this.allData.goodsAmount,this.allData.totalDiscount),this.allData.integralCashAmount)
                    if (this.totalExpressCoupon >= this.allData.freightAmount) {
                        this.initExpressCouData.selectContinued = false
                        this.selectContinued = false
                    } else {
                        this.initExpressCouData.selectContinued = true
                        this.selectContinued = true
                    }
                    this.loadFlag = true;
                    // 如果订单金额为0，不显示开发票的功能
                    if (this.allData.totalAmount == 0) {
                        this.needInvoice = false
                        this.invoiceInfo = {}
                        this.invoiceId = ''
                        this.invoiceContent = 1
                    }
                    //接口返回包含店铺和平台所有可用、不可用列表
                    this.allAvailableCouponList = res.data?.availableCouponList
                    this.allDisableCouponList = res.data?.disabledCouponList
                    this.allAvailableCouponList.sort((a,b) => {
                        return a.receiveTime<b.receiveTime?1:-1
                    });
                    this.allDisableCouponList.sort((a,b) => {
                        return a.receiveTime<b.receiveTime?1:-1
                    });
                    //从可用列表中获取当前全部选中的优惠券
                    let temp = this.allAvailableCouponList.filter((item) =>item.checked == true).map((item)=>item.couponCode)

                    //记录最佳也就是第一次
                    if (this.isRecommendCount == 1){
                        //最佳优惠券集合
                        this.recommendCouponList = temp
                    }
                    //判断用户操作后 是否还是最佳 也就是判断isRecommendCount和temp的值
                    this.isRecommendCoupon = this.recommendCouponList.length == temp.length && this.recommendCouponList.every(a => temp.some(b => a===b))? true:false;
                    let num = 0
                    this.allAvailableCouponList.forEach((item) => {
                        this.$set(item, 'isOpen', false)
                        if (item.checked == true){
                            num++
                        }
                        this.couponNum = num
                    })
                    //当前平台优惠券code
                    this.currentPlatformCouponCode = this.allAvailableCouponList.filter((item) => {
                        return item.storeId == 0 && item.checked == true
                    }).map((item) => {
                        return item.couponCode
                    })[0]
                    this.isRecommendCount+=1
                    this.couponList[0].list = this.allAvailableCouponList
                    this.couponList[0].listLength = this.allAvailableCouponList.length
                    this.couponList[1].list = this.allDisableCouponList
                    this.couponList[1].listLength = this.allDisableCouponList.length
                    this.recommendCouponList?.forEach((item)=>{
                        this.allAvailableCouponList.forEach((coupon,index) => {
                            if (coupon.couponCode == item){
                                this.allAvailableCouponList.splice(index,1)
                                this.allAvailableCouponList.splice(0,0,coupon)
                            }
                        })
                    })
                    let allSkuList = this.goodsData.reduce((allList,item) => {
                        let skuList = item.products.map(item1 => {
                            return {
                                sku:item1.sku,
                                num:item1.number
                            }                     
                        })
                        return allList.concat(skuList)
                        
                    },[])
                    this.getListSkuGift(allSkuList)
                    uni.hideLoading();
                } else {
                    uni.hideLoading();
                    this.$api.msg(res.msg);
                }
            }).catch(() => {
                //异常处理
                uni.hideLoading();
            })
        },


        clearFailureGoods() {
            try {
                let productList = this.no_good_info.productList; // 无货的商品列表
                if ( productList && productList.length > 0){
                    for (let i = 0; i < productList.length; i++) {
                        const element = productList[i];
                        this.goodsData.forEach((item => {
                            if (item.products.findIndex(tepItem => tepItem.sku == element.sku) > -1) {
                                item.products.splice(item.products.findIndex(tepItem => tepItem.sku == element.sku),1)
                            }
                        }))
                        let confirmParams = {
                            productInfo:this.goodsData
                        }
                        this.$setStorageSync('confirmParams',JSON.stringify(confirmParams))

                    }
                    
                    this.$refs.noGoodRef.close()
                    this.store_show_no_good = false
                    this.currentPlatformCouponCode = '';
                    this.redpacketCodeList = [];
                    this.expressCouCodeList = [];
                    this.integral = 0;
                    this.tmpInt = 0;
                    this.confirmOrder(1)
                }
            } catch (error) {
                console.log(error);
            }
        },
        //确认订单前，检验商品是否可结算
        testConfirmOrder() {
            if (!this.isSubmitTo) {
                this.showCheck()
                return
            }
            this.submit();
        },

        //提交订单
        submit(gift) {
            this.$removeStorageSync('addressId');
            // #ifdef H5
            this.order_from = 2
            // #endif

            // #ifdef APP-PLUS
            switch (uni.getSystemInfoSync().platform) {
            case 'android':
                this.order_from = 3
                break;
            case 'ios':
                this.order_from = 4
                break;
            default:
                break;
            }
            // #endif

            // #ifdef MP
            this.order_from = 5
            // #endif
            const {
                preParam
            } = this;
            let param = {};
            param.data = {};
            let storeInfoList = []
                
            this.goodsData.forEach(item => {
                let storeitem = {}
                storeitem.invoiceId = this.invoiceId
                storeitem.invoiceContent = this.invoiceContent
                storeitem.remark = this.reMarkMap[item.storeId] || ''
                storeitem.storeCouponCode = ""
                item.availableCouponList.forEach(items => {
                    if (items.checked == true) {
                        storeitem.storeCouponCode = items.couponCode
                    }
                })
                storeitem.storeId = item.storeId
                if (!!item.productPromiseCalendars){
                    item.productPromiseCalendars.forEach(temp=>{
                        let calendarDays = temp.calendarList.filter(items => {
                            return items.selected;
                        })
                        temp["calendarDay"] = calendarDays[0]
                        if (temp.installDays[0]){
                            temp["installDay"] = temp.installDays.filter(items => {
                                return items.selected;
                            })[0]
                        }
                    })
                }
                storeInfoList.push(storeitem)
            })
            param.data.platformCouponCode = this.currentPlatformCouponCode
            // param.data.addressId = this.orderAddress.addressId
            // 订单接口 addressId 替换为地址相关对象
            if (this.orderAddress.addressId) {
                param.data.addressId = this.orderAddress.addressId
                param.data.receiverInfo = {
                    name: this.orderAddress.memberName,
                    mobile: this.orderAddress.telMobile,
                    provinceCode: this.orderAddress.provinceCode,
                    cityCode: this.orderAddress.cityCode,
                    districtCode: this.orderAddress.districtCode,
                    townCode: this.orderAddress.townCode,
                    addressAll: this.orderAddress.addressAll,
                    detailAddress: this.orderAddress.detailAddress
                }
            }
            param.data.storeInfoList = storeInfoList
            param.data.orderFrom = this.order_from
            // 鹅毛情相关参数
            param.data.orderSource = 'FEATHER'
            param.data.featherSubmitParamVO = {
                giverOrReceiver: 0
            }
            let handlerType = 'submit';
            param.data.source = 3;
            param.data.products = JSON.parse(preParam.products).map(item => {
                return {
                    sku:item.sku,
                    number:item.number,
                    notAttendDiscount:item.notAttendDiscount,
                    promotionId:(item?.discountVO?.promotionId)?item.discountVO.promotionId:null,
                    promotionType:(item?.discountVO?.promotionType)?item.discountVO.promotionType:null,
                    promotionDescription:(item?.discountVO?.promotionDes)?item.discountVO.promotionDes:null
                }
            });
            if (this.spellTeamId != 0) {
                param.data.spellTeamId = this.spellTeamId
            }
            if (this.integral > 0) {
                param.data.integral = this.integral
            }
            //不要赠品的列表
            if (gift){
                param.data.notNeedGiftProductCodes = this.skuList
            }

            let userInfo = getApp().globalData.userParams
            // 下单新增企业名称字段
            if (!!userInfo.companyName){
                param.data.companyName = userInfo.companyName;
            }
            // 下单新增渠道名称字段
            if (!!userInfo.channelName){
                param.data.channelName = userInfo.channelName;
            }
            param.data.redpacketCodeList = this.redpacketCodeList
            param.data.freightCouponCodeList = this.expressCouCodeList
            uni.showLoading()
            orderHandler[handlerType](param.data).then(res => {
                if (res.state == 200) {
                    this.$bbcStatEvent({
                        behaviorType: 'buy'
                    })
                    if (!this.isPC) {
                        this.$removeStorageSync('confirmParams');
                    }
                    //订单优化需求 去掉queryPayState，直接根据submit接口的返回值判断页面跳转
                    this.gotoNextPage(res)                    
                } else if (res.state == 88106018){ //赠品不足原300
                    //清空skuList
                    this.skuList=[];
                    this.skuList.push(res.msg);
                    uni.showModal({
                        title: '提示',
                        content: '赠品已无货是否继续提交订单~',
                        confirmText: '继续',
                        cancelText: '我再想想',
                        success: result => {
                            if (result.confirm) {
                                this.submit(true)
                            } else {
                                this.skuList=[]
                                this.openOrderLock();
                                uni.hideLoading();
                            }
                        }
                    })
                    uni.hideLoading();

                } else if (res.state == 88106017){ // 附件不足原301
                    this.skuList.push(res.msg);
                    uni.showModal({
                        title: '提示',
                        content: '附件已无货是否取消订单~',
                        confirmText: '确定',
                        cancelText: '我再想想',
                        success: result => {
                            if (result.confirm) {
                                // this.submit(true)
                                this.skuList=[]
                                this.openOrderLock();
                                uni.hideLoading();
                            } else {
                                this.skuList=[]
                                this.openOrderLock();
                                uni.hideLoading();
                            }
                        }
                    })
                    uni.hideLoading();
                } else if (res.state == 88201088){ //余额不足 提示联系客服处理的弹窗
                    uni.showModal({
                        title: '提示',
                        content: '下单失败，请联系客服处理',
                        confirmText: '确定',
                        cancelText: '取消',
                        success: result => {
                            if (result.confirm) {
                                this.gotoCustomerService();
                            }
                        }
                    })
                    this.openOrderLock();
                    uni.hideLoading();
                } else if (res.state == 267) {
                    // 商品数量不可低于最低起购量
                    if(res.data.state==8){
                        const {stateValue,products} = res.data
                        this.$api.msg(stateValue);
                        setTimeout(()=>{
                            products.forEach((item)=>{
                                this.changeGoodsNumber({preValue:item.number,value:item.lowestBuy},item)
                            })
                        },1000)
                        this.openOrderLock();
                        uni.hideLoading();
                        return 
                    }
                    this.no_good_info_data = res.data;
                    this.handleNoGoods(res.msg)
                    uni.hideLoading();
                } else {
                        
                    this.$api.msg(res.msg);
                    this.openOrderLock();
                    uni.hideLoading();
                }
            }).catch(() => {
                //异常处理
                this.openOrderLock();
                uni.hideLoading();
            }).finally( ()=> {
                    
            })
        },

        //根据submit接口返回值，判断页面如何跳转
        gotoNextPage(res){
            //因为订单优化，取消了payInfo接口，这个afterPayInfoBusinessDone直接赋值true
            this.afterPayInfoBusinessDone = true;

            let isGiftOrder = res.data.orderSourceInfo && res.data.orderSourceInfo.orderSource === 'FEATHER' && res.data.orderSourceInfo.orderSourceId
            //orderPayState ==1 来判断 已支付  0元送礼单跳转zeroPayResult
            if(res.data.orderAmount == 0 && res.data.orderPayState == 1 && isGiftOrder){
                const featherId = res.data.orderSourceInfo.orderSourceId
                this.$Router.replace({
                    path: '/views/pay/zeroPayResult',
                    query: {
                        state: 'SUCESS',
                        type:'FEATHER',
                        featherId
                    }
                })
                return
            }
            //送礼单 非0元单 跳转去支付  
            if(isGiftOrder && res.data.orderAmount != 0){
                const featherId = res.data.orderSourceInfo.orderSourceId
                this.$Router.replace({
                    path: '/views/pay/giftPay',
                    query: {
                        amount: res.data.orderAmount,
                        paySn: res.data.paySn,
                        featherId,
                        orderType:res.data.orderType,
                        orderSource:res.data.orderSource,
                        orderSourceId:res.data.orderSourceId,
                        expiredToReceive:res.data.expiredToReceive,                
                        payMethodType: 'create'
                    }
                })   
                return             
            }
            //已支付 的 非0元单 跳转到 订单列表     
            if(res.data.orderAmount != 0 && res.data.orderPayState == 1){        
                this.$api.msg(res.msg + this.$L(",2s后自动跳转订单列表"));
                setTimeout(()=>{
                    this.$Router.replace({
                        path: '/pages/order/list',
                        query: {
                            state: 0
                        }
                    })
                },2000)
                return
            }
            //默认都是鹅毛请订单 isGiftOrder为false 肯定是 接口出错了
            console.error('gift submit get error',isGiftOrder, res.data.orderAmount, res.data.orderPayState)      
        },

        // 跳转我的发票页面
        toInvoice() {
            this.$Router.push({
                path: '/pages/invoice/myInvoice',
                query: {
                    isVatInvoice: this.isVatInvoice,
                    applyType: 'confirmOrder',
                    needInvoice: this.needInvoice,
                    invoiceContent: this.invoiceContent
                }
            })
        },
        getIntRule() {
            this.$request({
                url: 'v3/system/front/setting/getSettings',
                data: {
                    names: 'integral_cash_out_is_enable,integral_conversion_ratio,integral_use_lowest_amount,integral_max_deduct_rate,coupon_user_help'
                }
            }).then(res => {
                if (res.state == 200) {
                    this.intRuleList = res.data
                }
            })
        },

        //显示优惠券弹窗
        select_couponList(){
            lockScroll()
            this.$refs.couponPopup.open();
        },
        //关闭优惠券弹窗
        closeCouponPop(){
            unlockScroll()
            this.$refs.couponPopup.close();
        },
        // 显示红包弹窗
        select_redpacket() {
            this.redpacketList = JSON.parse(JSON.stringify(this.initRedpacketData.initRedpacketList))
            this.totalRedpacket = this.initRedpacketData.initTotalRedpacket
            this.actualTotalRedpacket = this.initRedpacketData.initActualTotalRedpacket
            this.redpacketCodeList = JSON.parse(JSON.stringify(this.initRedpacketData.initRedpacketCodeList))
            this.selectRedContinued = this.initRedpacketData.selectRedContinued
            this.$refs.redpacketPopup.open();
        },
        // 关闭红包弹窗
        close_redpacket() { 
            this.$refs.redpacketPopup.close();
        },
        // 红包弹窗确认
        redpacketConfirm() {
            if (this.redpacketList && this.redpacketList.length>0) {
                this.confirmOrder(2)
            }
            this.$refs.redpacketPopup.close();
        },
        // 显示运费券弹窗
        select_expressCoupon() {
            this.$set(this.expressCouList[0],'list',JSON.parse(JSON.stringify(this.initExpressCouData.initExpressCouList)))
            this.expressCouCodeList = JSON.parse(JSON.stringify(this.initExpressCouData.initExpressCouCodeList))
            this.totalExpressCoupon = this.initExpressCouData.initTotalExpressCoupon
            this.selectContinued = this.initExpressCouData.selectContinued
            this.$refs.expressCouponPopup.open();
        },
        // 关闭运费券弹窗
        close_expressCoupon() {
            this.$refs.expressCouponPopup.close();
        },
        // 运费券弹窗确认
        expressCouConfirm() {
            if (this.expressCouList[0].list?.length>0) {
                this.confirmOrder(2)
            }
            this.$refs.expressCouponPopup.close();
        },
        //点击优惠券确定
        couponConfirm(){
            unlockScroll()
            this.$refs.couponPopup.close();
        },
        //切换优惠券类别
        changeCouponClass(index){
            this.currentIndex = index
        },
        //切换运费券类别
        changeExpressCouClass(index){
            this.currentIndex1 = index
        },
        popChange(e){
            e.show ? lockScroll() : unlockScroll();
        },
        //显示优惠卷规则
        showCouonContent(){
            uni.showModal({
                title: '优惠券使用帮助',
                content: this.intRuleList[4],
                showCancel:false,
                confirmText:'关闭',
                confirmColor:"#3c76ff"
            })
        },
        //展开规则
        descriptionOpen(value){
            let index = this.currentIndex == 0 ? 0 : 1
            this.couponList[index]?.list.forEach(item => {
                if (item.couponMemberId == value.couponMemberId) {
                    this.$set(item, 'isOpen', !item.isOpen)
                    this.$forceUpdate()
                }
            })
        },
        //去优惠券对应的商品列表
        goGoodsList(item){
            if (item.linkInfo!=null){
                let skipUrl={};
                try {
                    skipUrl=JSON.parse(item.linkInfo);
                    skipTo(skipUrl,this);
                } catch (error){
                    this.gotoDefaultList(item);
                }
            } else {
                this.gotoDefaultList(item);
            }
        },
        gotoDefaultList(item){
            let params = {}
            params.storeId=item.storeId
            if (item.linkInfo != null){
                this.$Router.push({
                    path: '/pages/activity/activity',
                    query: {
                        source: 'coupon',
                        ...params
                    }
                })
            } else {
                this.$Router.push({
                    path: '/standard/product/list',
                    query: {
                        source: 'coupon',
                        ...params
                    }
                })

            }
    
        },
        useInitData(){
            this.currentPlatformCouponCode = '';
            this.redpacketCodeList = [];
            this.integral = 0;
            this.tmpInt = 0;
            this.confirmOrder(1)
        },
        // 显示使用帮助
        showHelpTips(){
            this.$refs.helpTips.open();
        },
        // 关闭使用帮助
        closeHelpTips(){
            this.$refs.helpTips.close();
        },
        // 显示运费明细弹框
        showFreightDetail(info,storeId) {
            if (info.state==1 && !(info.lowerAmount==-1 || info.originFreight==0)) {
                if (this?.allData?.storeGroupList) {
                    this.currentStoreInfo = this.allData.storeGroupList.filter(item => {
                        return item.storeId == storeId
                    })[0]
                }
                this.$refs.expressRulesPopup.open();

            }
        },
        // 关闭运费明细弹框
        close_expressRules() {
            this.$refs.expressRulesPopup.close();
        },
        // 显示订单备注弹框
        open_remark(storeId) {
            this.currRemarkstoreId = storeId
            this.tempReMarkMap[this.currRemarkstoreId] = this.reMarkMap[this.currRemarkstoreId]
            this.$refs.remarkPopup.open();
        },
        // 关闭订单备注弹框
        close_remarkPopup(flag=false) {
            if (flag) {
                this.reMarkMap[this.currRemarkstoreId] = this.tempReMarkMap[this.currRemarkstoreId]
            }
            this.$refs.remarkPopup.close();
        },
        // 显示运费规则弹框
        showFreightRule(info,storeId) {
            if (info.state == 1) {
                if (this?.allData?.storeGroupList) {
                    this.currentStoreInfo = this.allData.storeGroupList.filter(item => {
                        return item.storeId == storeId
                    })[0]
                }
                this.$refs.freightRules.open();
            }
        },
        // 关闭运费规则弹框
        closeFreightRules() {
            this.$refs.freightRules.close();
        },
        // 显示红包使用规则
        showRedpacketRules() {
            this.$Router.push('/views/coupon/redpacket-rules')
        },
        handleNoGoods(msg) {
            let allSkuList = this.goodsData.reduce((allList,item) => {
                return allList.concat(item.products)
                        
            },[])
            if ((allSkuList.length == 1 && this.no_good_info_data.state == 2) || this.no_good_info_data.state == 1 || (this.no_good_info_data.state == 2 && allSkuList.length == this.no_good_info_data.productList.length)) {
                this.$api.msg(msg);
            } else {
                let productList = []
                this.no_good_info_data.productList.forEach(item => {
                    let tepIndex = allSkuList.findIndex(item1 => item1.sku == item.sku)
                    if (tepIndex>-1) {
                        productList.push(
                            {
                                sku: allSkuList[tepIndex].sku,
                                skuName: allSkuList[tepIndex].skuName,
                                specValues: allSkuList[tepIndex].specValues,
                                mainImage: allSkuList[tepIndex].mainImage,
                                price: allSkuList[tepIndex].salePrice,
                                lowestBuy: allSkuList[tepIndex].lowestBuy,
                                buyNum: allSkuList[tepIndex].number,
                                giftList: allSkuList[tepIndex].giftList
                            }
                        )
                    }
                })
                this.no_good_info = {
                    state:this.no_good_info_data.state,
                    stateValue:this.no_good_info_data.stateValue,
                    productList:productList
                }
                this.store_show_no_good = true
                this.$refs.noGoodRef.open()
                this.openOrderLock();
            }
            
        }
    }
}
</script>

<style lang="scss">
@import './confirmOrder.scss'
</style>
<style lang="scss" scoped>
.gitTitle {
    height: 140rpx;
    padding: 18rpx 0 32rpx 30rpx;
    display: flex;
    flex-direction: column;
    border-radius: 20rpx;
    background: #fff url('@/static/shared/order/icon_dingdan_xuxian.png') bottom left/88rpx 6rpx repeat-x;

    view:first-child {
        line-height: 50rpx;
        font-size: 36rpx;
        font-weight: bold;
        color: #222;
    }

    view:last-child {
        margin-top: 4rpx;
        font-size: 26rpx;
        color: #999;
    }
}
</style>