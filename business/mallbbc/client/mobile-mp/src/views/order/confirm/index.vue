<!-- 提交订单页面 -->
<template>
    <view>
        <u-navbar title="确认订单" bgColor="#EFF2F5" :titleStyle="{'font-size': '36rpx', color: '#222', 'font-weight': 'bold' }">
            <template slot="left">
                <u-icon name="arrow-left" size="18" color="#222" @click="$Router.back()"></u-icon>
            </template>
        </u-navbar>
        <w-loading ref="loading"></w-loading>
        <view id="container" :style="[topStyle]">
            <view class="giftTitle" v-if="FEATHER_ORDER">
                <view>先支付</view>
                <view>再通过微信送礼单</view>
            </view>
            <!-- 地址 -->
            <view @click="operateAddress" class="address-section" v-else>
                <!-- 地址骨架图 -->
                <view class="order-content-skeleton" v-if="addressLoading">
                    <view class="skeleton_long"></view>
                    <view class="skeleton_middle"></view>
                </view>
                <view class="order-content" v-else>
                    <view class="cen" v-if="!!orderAddress.addressId && !addressLoading">
                        <view class="top flex_row_start_center">
                            <text v-if='orderAddress.isDefault==1' class="symbol-container default-tag">默认</text>
                            <text v-if='!!orderAddress.tags' class="symbol-container">{{orderAddress.tags}}</text>
                            <text>{{orderAddress.addressAll}}</text>
                        </view>
                        <text class="address">{{orderAddress.detailAddress}}</text>
                        <view class="member_info flex_row_start_center">
                            <text class="name">{{orderAddress.memberName}}</text>
                            <text class="mobile">{{orderAddress.telMobile}}</text>
                        </view>
                    </view>
                    <view class="empty_address flex_row_center_center" v-else-if="!addressLoading">
                        <text class="tit">新建收货地址</text>
                    </view>
                    <text class="iconfont icon_arrow_right"></text>
                </view>
            </view>

            <view class="goods-section" v-if="goodsData.length>0">
                <!-- 商品列表 -->
                <view class="store_list block_wrapper" v-for="(item,index) in goodsData" :key='index'>
                    <view class="store_name">
                        <image class="store_logo" :src="storeLogo"></image>
                        <text class="store_name_text">{{item.storeName}}</text>
                    </view>
                    <view class="product_con" v-for="product in item.productList" :key='product.sku'>
                        <view class="g-item flex_row_start_start">
                            <view class="image" :style="{backgroundImage: 'url('+product.mainImage+')'}"></view>
                            <view class="right flex_column_between_start">
                                <view class="flex_column_start_start">
                                    <text class="title">{{product.skuName}}</text>
                                </view>
                                <view class="goods_item_specs">
                                    <text class="goods_item_spec">{{product.specValues || '默认'}}</text>
                                    <text v-if="FEATHER_ORDER" class="goods_item_buynum">*{{product.buyNum}}</text>
                                </view>
                                <view class="goods_item_price_num">
                                    <view class="price-box num-font">
                                        <text class="unit">¥</text>
                                        <text class="price_int">{{getHandlePartNumber(product.price,'int')}}</text>
                                        <text class="price_decimal">{{getHandlePartNumber(product.price,'decimal')}}</text>
                                    </view>

                                    <uni-number-box v-if="!FEATHER_ORDER" class="number_box" :min="product.lowestBuy ? product.lowestBuy : 1"
                                        :max="goodsMaxNum"
                                        :value="product.buyNum" @change="changeGoodsNumber($event, product)"
                                        :margin_right="10">
                                    </uni-number-box>

                                </view>
                            </view>
                        </view>
                        <!-- 商品赠品信息 -->
                        <view class="gift-box" v-if='product.giftList&&product.giftList.length>0'>
                            <view class="gift-box-item" v-for="(giftItem,i) in product.giftList" :key='i'>
                                <text class="gift-box-icon" :class="[giftItem.productType == 2 ? 'gift-color': 'attachment-color']">
                                    {{giftItem.productType==2?'赠品':'附件'}}
                                </text>
                                <text class="gift-box-name" v-if="giftItem.name">{{giftItem.name}}</text>
                                <text class="gift-box-num">x{{giftItem.num}}</text>
                            </view>
                        </view>
                    </view>
        
                    <Skeleton row="3" v-if="!loadFlag"/>
         
                    <!-- 订单信息 -->
                    <view v-else class="yt-list store_info">
                        <!--                        
                        <view class="yt-list-cell-giveaway b-b" v-if="item.sendProductList && item.sendProductList.length > 0">
                            <text class="cell-tit clamp">赠品信息</text>
                            <view class="giveaway_list" v-for="(sendProduct, indexSend) in item.sendProductList" :key="indexSend">
                                <view class="giveaway_item" v-for="(gift,index) in sendProduct.giftList" :key="index">
                                    <view class="giveaway_item_left">
                                        <text class="giveaway_item_index">赠品{{index+1}}：</text>
                                        <text class="giveaway_item_name">{{gift.name}}</text>
                                        <text>（赠完即止）</text>
                                    </view>
                                    <text class="giveaway_item_number">*{{gift.num}}</text>
                                </view>
                            </view>
                        </view>
                                                <view class="yt-list-cell b-b" v-if="item.goodsAmount">
                            <text class="cell-tit clamp">小计</text>
                            <text
                                class="cell-tip">￥{{getHandlePartNumber(item.goodsAmount, 'int')}}{{getHandlePartNumber(item.totalAmount,'decimal')}}</text>
                        </view> 
                    -->

                        <view class="yt-list-cell b-b" v-if="!FEATHER_ORDER">
                            <text class="cell-tit clamp">配送时间</text>
                            <template v-if="!!item.productPromiseCalendars&&item.productPromiseCalendars.length>0">
                            <view v-if="!item.deliveryTimeStr">
                                工作日、双休日与节假日均可送货
                            </view>
                            <view v-else>
                                <view v-if="item.productPromiseCalendars.length>1">
                                    <text @click="openPopup(item,index)">{{item.deliveryTimeStr}}</text>
                                    <text class="iconfont icon_arrow_right"></text>
                                </view>
                                <view v-else>
                                    <view v-if="!!item.deliveryTimeStr" @click="openPopup(item,index,1);showItem(item.deliveryTimeStr);" class="cell-tip voice">
                                        <text v-if="!!item.installTimeStr">大件送货:</text>
                                        <view>{{ item.deliveryTimeStr }}</view>
                                        <text class="iconfont icon_arrow_right"></text>
                                    </view>
                                    <view v-if="!!item.installTimeStr" @click="openPopup(item,index,2)" class="cell-tip voice">
                                        <text>大件安装:</text>
                                        <view>{{ item.deliveryTimeStr }}</view>
                                        <text class="iconfont icon_arrow_right"></text>
                                    </view>
                                </view> 
                            </view>
                            </template>
                            <view v-else>工作日、双休日与节假日均可送货</view>
                        </view>
                        <view class="yt-list-cell b-b"  @click="showFreightDetail(item.expressFeeInfo,item.storeId)">
                            <view class="cell_int">
                                <text class="cell-tit clamp">运费</text>
                                <image v-if="item.expressFeeInfo.state == 1" src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_gantanhao2.png" mode="" @click.stop="showExpressFeeRule(item.storeId)"></image>
                            </view>
                            <text class="cell-tip-bold num-font"
                                :class="[!(item.expressFeeInfo.state==1 && !(item.expressFeeInfo.lowerAmount==-1 || item.expressFeeInfo.originFreight==0)) ? 'mr_20': '']"
                                v-if="loadedData && !!orderAddress.addressId">{{(item.expressFee || (item.expressFee==0 && item.expressFeeInfo.state==1 && item.expressFeeInfo.lowerAmount!=-1 && item.expressFeeInfo.originFreight>0))? ('+￥' +
                                getHandlePartNumber(item.expressFee,'int')+getHandlePartNumber(item.expressFee,'decimal')):'免运费'}}</text>
                            <text v-if="loadedData && !orderAddress.addressId" :style="{color:'#999'}">暂无运费信息，填写收货地址后将自动获取</text>
                            <text class="iconfont icon_arrow_right" v-if="item.expressFeeInfo.state==1 && !(item.expressFeeInfo.lowerAmount==-1 || item.expressFeeInfo.originFreight==0)"></text>
                        </view>   

                        <!-- 订单备注 -->
                        <view class="yt-list-cell b-b"  @click.stop="showRemarkPopup(item.storeId)">
                            <text class="cell-tit clamp">订单备注</text>
                            <text v-if="remarkMap[item.storeId]" class="cell-tip-bold one_line_ellipsis">{{ remarkMap[item.storeId] }}</text>
                            <text v-else style="color: #666; font-size: 28rpx;">给商家备注</text>
                            <text class="iconfont icon_arrow_right"></text>
                        </view>
                    </view>
                </view>
            </view>

            
      
            <Skeleton row="10" v-if="!loadFlag"/>
      
            <!-- 金额与优惠信息-->
            <view v-else class="yt-list block_wrapper">
                <!-- 商品总价 -->
                <view class="yt-list-cell b-b">
                    <text class="cell-tit clamp">商品总价</text>
                    <text
                        class="cell-tip-bold num-font mr_20">￥{{getHandlePartNumber(allData.goodsAmount,'int')}}{{getHandlePartNumber(allData.goodsAmount,'decimal')}}</text>
                </view> 

                <!-- 运费总价 -->
                <view class="yt-list-cell b-b">
                    <text class="cell-tit">运费总价</text>
                    <text v-if="loadedData && !!orderAddress.addressId"
                    class="cell-tip-bold num-font mr_20">{{allData.freightAmount ? ('+￥' + getHandlePartNumber(allData.freightAmount,'int') + getHandlePartNumber(allData.freightAmount,'decimal')) : '免运费'}}</text>
                    <text v-if="loadedData && !orderAddress.addressId" :style="{color:'#999'}">暂无运费信息，填写收货地址后将自动获取</text>
                </view>
                <!-- 立减 -->
                <view class="yt-list-cell b-b" v-if="allData.totalFullDiscount">
                    <text class="cell-tit clamp">立减</text>
                    <text
                        class="cell-tip num-font mr_20">-￥{{getHandlePartNumber(allData.totalFullDiscount,'int')}}{{getHandlePartNumber(allData.totalFullDiscount,'decimal')}}</text>
                </view>
                <!-- 优惠券 -->
                <view class="yt-list-cell b-b" @click="select_couponList" v-if="availableCouponList">
                    <view class="cell-tit">
                        <text class="cell-tit">优惠券</text>
                        <text class="cell-tit cell-tag cell-tip" v-if="availableCouponList.length != 0 && isRecommendCoupon">已选推荐优惠券</text>
                    </view>
                    <text v-if="availableCouponList.length == 0" class="cell-tip voice">无可用优惠券</text>
                    <text v-else class="cell-tip num-font">-￥{{getHandlePartNumber(totalCouponDiscount,'int')}}{{getHandlePartNumber(totalCouponDiscount,'decimal')}}</text>
                    <text class="iconfont icon_arrow_right"></text>
                </view>
                <!-- 运费券 -->
                <view class="yt-list-cell b-b" @click="select_expressCoupon">
                    <text class="cell-tit">运费券</text>
                    <text class="cell-tip voice" v-if="(expressCouList[0].list && expressCouList[0].list.length==0) || !allData.freightAmount">无可用运费券</text>
                    <text class="cell-tip voice " v-if="expressCouList[0].list.length>0 && allData.freightAmount && allData.freightAmount>0 && !expressCouponAmount">请选择运费券</text>
                    <text class="cell-tip voice num-font" v-if="expressCouList[0].list.length>0 && expressCouponAmount>0">-￥{{getHandlePartNumber(expressCouponAmount,'int')}}{{getHandlePartNumber(expressCouponAmount,'decimal')}}</text>
                    <text class="iconfont icon_arrow_right"></text>
                </view>
                <!-- 红包 -->
                <view class="yt-list-cell b-b" @click="select_redpacket">
                    <text class="cell-tit">红包</text>
                    <text class="cell-tip voice arrow_right" v-if="redpacketList.length==0 || (redpacketList.length>0 && maxRedpacketAmount<=0)">无可用红包</text>
                    <text class="cell-tip voice arrow_right" v-if="redpacketList.length>0 && maxRedpacketAmount>0 && redpacketAmount==0">请选择红包</text>
                    <text class="cell-tip num-font" v-if="redpacketList.length>0 && redpacketAmount>0">-￥{{getHandlePartNumber(redpacketAmount,'int')}}{{getHandlePartNumber(redpacketAmount,'decimal')}}</text>
                    <text class="iconfont icon_arrow_right"></text>
                </view>

                <!-- 云豆抵现 -->
                <view class="yt-list-cell b-b" @click="select_integral" v-if="intRuleList[0]==1 && allData.integralList">
                    <view class="cell_int">
                        <text class="cell-tit clamp">云豆</text>
                        <image src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_gantanhao2.png" mode="" @click.stop="showIntRule"></image>
                        <text class="cell-tit" v-if="allData.integralList.length>0 && initPrice>=intRuleList[2] && allData.memberIntegral>=allData.integralScale" :style="{marginLeft:'10rpx'}">
                            可用余额: <text class="num-font">{{allData.memberIntegral}}</text>个
                        </text>
                    </view>
                    <text class="cell-tip" v-if="allData.integralList.length>0 && initPrice>=intRuleList[2] && allData.memberIntegral>=allData.integralScale && allData.integralCashAmount>0">
                        -￥{{getHandlePartNumber(allData.integralCashAmount,'int')}}{{getHandlePartNumber(allData.integralCashAmount,'decimal')}}
                    </text>
                    <text class="cell-tip voice" v-if="allData.integralList.length>0 && initPrice>=intRuleList[2] && allData.memberIntegral>=allData.integralScale && allData.integralCashAmount==0">
                        请选择
                    </text>
                    <text class="cell-tip voice" v-if="allData.integralList.length==0 || initPrice<intRuleList[2] || allData.memberIntegral<allData.integralScale">当前订单不支持使用云豆</text>
                    <text class="iconfont icon_arrow_right"></text>
                </view>
                <view class="divide_line"></view>
                <!-- 合计 -->
                <view class="yt-list-cell b-b" style="text-align: right;">
                    <view class="cell-tit clamp" style="color: #222">合计</view>
                    <view class="num-font flex_row_end_end mr_20">
                        <text class="unit">￥</text>
                        <text class="big_price">{{(allData.totalAmount+'').split('.')[0]}}.</text>
                        <text
                            class="small_price">{{(allData.totalAmount+'').split('.')[1]!=undefined?((allData.totalAmount+'').split('.')[1]):'00'}}
                        </text>
                    </view>
                </view>
            </view>
            
            <view class="yt-list block_wrapper">
                <view class="yt-list-cell b-b" @click="toInvoice" v-if="allData.totalAmount != 0">
                    <text class="cell-tit clamp">发票</text>
                    <text class="cell-tip voice" v-if="!!!invoiceInfo.name">不需要发票</text>
                    <view class="cell-tip voice" v-else><text class="limVoice">{{invoiceInfo.name}}</text><text>{{invoiceContent==1?'商品明细':'商品类别'}}</text></view>
                    <text class="iconfont icon_arrow_right"></text>
                </view>
            </view>
            

            <!-- 金额明细 -->
            <view class="empty_h"></view>
            <!-- 底部 -->
            <view :class="['footer','flex_row_end_center',iosHairPhone ? 'iosBottomPadding' : 'androidBottomPadding']" v-if="isBottomShow && loadFlag">
                <view class="price-content flex_column_center_end">
                    <view class="should_pay num-font flex_row_end_end">
                        <view class="tit">合计:</view>
                        <view class="price">
                            <text class="unit">￥</text>
                            <text class="big_price">{{(allData.totalAmount+'').split('.')[0]}}.</text>
                            <text
                                class="small_price">{{(allData.totalAmount+'').split('.')[1]!=undefined?((allData.totalAmount+'').split('.')[1]):'00'}}
                            </text>
                        </view>
                        
                    </view>
                    <view class="not_pay num-font flex_row_end_end" v-if="allData.totalDiscount > 0">
                        <view class="tit">已省:</view>
                        <view class="price">
                            <text class="unit">￥</text>
                            <text class="small_price">{{(allData.totalDiscount+'').split('.')[0]}}.</text>
                            <text
                                class="small_price">{{(allData.totalDiscount+'').split('.')[1]!=undefined?((allData.totalDiscount+'').split('.')[1]):'00'}}
                            </text>
                        </view>
                    </view>
                </view>
                <text class="submit flex_row_center_center" @click="beforeSubmit">提交订单</text>
            </view>
            
        </view>
        <!-- 商品全部，部分无货弹窗 start-->
        <uniPopup  type="center" ref="noGoodRef">
            <view id="store_no_good" v-if="store_show_no_good" @touchmove.stop.prevent="moveHandle">
                <view class="content">
                    <view class="content_title">
                        <text> {{no_good_info.stateValue}}</text>
                        <image @tap="hide_good_dialog" src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/store_no_good_cancel.png" mode=""></image>
                    </view>
                    <view class="good_list">
                        <view v-for="(item,index) in no_good_info.productList" :key='index' class="good_item">
                            <image :src="item.mainImage" mode=""></image>
                            <view class="good_info">
                                <view class="good_name">
                                    {{item.skuName}}
                                </view>
                                <view class="good_spec">
                                    <text>{{item.specValues || '默认'}}</text>
                                </view>
                                <text class="num">*{{item.buyNum}}</text>
                            </view>
                        </view>

                    </view>
                    <view v-if='no_good_info.state==2 || no_good_info.state==3 || no_good_info.state==4' class="part_no_goods">
                        <view class="return" @click="returnLastPage">
                            返回
                        </view>
                        <view class="remove" @click='clearFailureGoods'>
                            移除无货商品
                        </view>
                    </view>
                    <view v-else-if="no_good_info.state==7" class="part_no_goods_another">
                        <view class="return" @click="upPrice">
                            确定
                        </view>
                    </view>
                    <view class="part_no_goods_another" v-else>
                        <view class="return" @click="returnLastPage">
                            返回
                        </view>
                    </view>
                </view>
            </view>
        </uniPopup>
        <!-- 商品全部，部分无货弹窗 end-->
        <!-- 优惠券弹窗 -->
        <uniPopup ref="couponPopup" type="bottom" @maskClick="closeCouponPop">
            <view class="couponPopup-container">
                <view class="couponHeadBg">
                    <view class="couponHead">
                        <view class="useHelp" v-if="intRuleList[4]" @click="showHelpTips">
                            使用帮助
                        </view>
                        <view class="title">优惠券</view>
                        <view class="closeImg" @click="closeCouponPop">
                            <image src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/close.svg" />
                        </view>
                    </view>
                    <view class="couponClass" v-if="availableCouponList">
                        <view class="nav">
                            <view :class="{default:true,select:currentIndex == index}" v-for="(item,index) in couponList" :key="index" @click="changeCouponClass(index)">
                                <text>
                                    {{item.text}}
                                    <text class="classLength">[<text class="num-font">{{item.listLength}}</text>]</text>
                                </text>
                            </view>
                        </view>
                        <view class="couponMsg" v-if="currentIndex == 0 && availableCouponList.length > 0">
                                <view class="msg">
                                    <view v-if="isRecommendCoupon">
                                        已使用优惠券 
                                        <text class="num">{{couponNum}}</text> 张，共抵扣
                                        <text class="unit">￥</text>
                                        <text class="integer">
                                            {{getHandlePartNumber(totalCouponDiscount,'int')}}
                                        </text>
                                        <text class="decimal">
                                            {{getHandlePartNumber(totalCouponDiscount,'decimal')}}
                                        </text>
                                    </view>
                                    <view v-else>
                                        <view class="msg_please_default" v-if="couponNum > 0">
                                            使用优惠券
                                            <text class="num">{{couponNum}}</text>张，共抵扣
                                            <text class="unit">￥</text>
                                            <text class="integer">
                                                {{getHandlePartNumber(totalCouponDiscount,'int')}}
                                            </text>
                                            <text class="decimal">
                                                {{getHandlePartNumber(totalCouponDiscount,'decimal')}}
                                            </text>
                                        </view>
                                        <view v-else class="msg_please_select">请选择优惠券</view>
                                    </view>
                                </view>
                                <view class="msgBtn" v-if="!isRecommendCoupon">
                                    <text @click="useInitData">使用推荐优惠</text>
                                </view>
                        </view>
                    </view>
                </view>
                <view :class="{couponContent:true,active:currentIndex == 1,couponContent_available: getAvailableClassName}">
                    <scroll-view scroll-y class="couponScroll">
                        <view v-for="(item,classIndex) in couponList" :key="classIndex">
                            <view v-show="currentIndex == classIndex">
                                <view v-if="item.listLength>0" class="couponItem_box">
                                    <view v-for="(reditem, index) in item.list" :key="index" class="couponItem">
                                        <view class="circle_radio a" :for="'red_id_' + index" :data-id="index">
                                            <view class="red_item_wrap">
                                                <view class="red_left">
                                                    <view class="red_left_content flex_row_center_center">
                                                        <view class="red_h1">
                                                            <text class="price_box_white num-font">
                                                                <text class="unit num-font" :style="{fontSize:redpacketFitFontSize['small'][getHandlePartNumber(reditem.value,'int').toString().length]}">¥</text>
                                                                <text class="price_int num-font" :style="{fontSize:redpacketFitFontSize['big'][getHandlePartNumber(reditem.value,'int').toString().length]}">{{getHandlePartNumber(reditem.value,'int')}}</text>
                                                                <text class="price_decimal num-font" :style="{fontSize:redpacketFitFontSize['small'][getHandlePartNumber(reditem.value,'int').toString().length]}">{{handleDecimal(getHandlePartNumber(reditem.value,'decimal'))}}</text>
                                                            </text>
                                                            <block v-if="reditem.couponType==2">折</block>
                                                        </view>
                                                        <view class="red_content fontScaleIgnore" :style="{fontSize:activeSize[reditem.content.length]}">{{reditem.content}}</view>
                                                    </view>
                                                </view>
                                                <view class="coupon_line"></view>
                                                <view class="white_right">
                                                    <view class="white_right_content">
                                                        <view class="red_description">
                                                            <text class="coupon_type fontScaleIgnore" :class="[reditem.storeId==0? 'coupon_type_platform':'coupon_type_store']">
                                                                {{reditem.storeId==0? '平台券': '店铺券'}}
                                                            </text>
                                                            <text class="coupon_name">{{reditem.couponName}}</text>
                                                        </view>
                                                        <view v-if="classIndex == 1" class="red_goGoodsList">
                                                            <text>
                                                                差<text class="red_font">{{reditem.lackAmount}}</text>元可用该券
                                                            </text>
                                                            <text @click="goGoodsList(reditem)" class="red_font">去凑单<text class="iconfont icon_arrow_right"></text></text>
                                                        </view>
                                                        <view class="red_bottom">
                                                            <view>
                                                                <view class="red_useTime">{{reditem.useTime}}</view>
                                                                <!-- <view class="coupon_pre_rules" @click.stop="descriptionOpen(reditem)">
                                                                    <text>使用规则</text>
                                                                    <image :src="reditem.isOpen ? upTriangleImage : downTriangleImage"
                                                                        mode="" draggable="false"></image>
                                                                </view> -->
                                                            </view>
                                                            <view v-if="classIndex == 0" class="red_h3_bottom fontScaleIgnore" @tap="select_coupon(reditem)">
                                                                <view v-if="reditem.checked == true" class="platform_select selected"></view>
                                                                <view v-else class="platform_select notselect"></view>
                                                            </view>
                                                        </view>
                                                    </view>
                                                </view>
                                            </view>
                                            <view class="coupon_rules" v-if="reditem.isOpen">
                                                <view class="coupon_rules_title"><text>{{reditem.description}}</text></view>
                                            </view>
                                        </view>
                                    </view>
                                </view>
                                <view v-else class='empty_content'>
                                    <view class="imgWrap"></view>
                                    <text>暂无优惠券</text>
                                </view>
                            </view>
                        </view>
                    </scroll-view>
                </view>
                <view :class="['couponBottom',iosHairPhone ? 'iosBottomPadding' : 'androidBottomPadding']">
                    <view class="confirm-btn" @click="couponConfirm" v-if="currentIndex == 0">确定</view>
                    
                </view>
            </view>
        </uniPopup>
        <!-- 红包弹窗 -->
        <uni-popup ref="redpacketPopup" type="bottom" @maskClick="close_redpacket">
            <view class="couponPopup-container">
                <view class="couponHead redpacketHead" style="background-color: #fff;">
                    <view class="useHelp" v-if="intRuleList[4]" @click="$Router.push({path: '/views/redpacket/redpacket-usehelp'})">
                        使用帮助
                    </view>
                    <view class="title">红包 [<span>{{redpacketList.length}}</span>]</view>
                    <view class="closeImg" @click="close_redpacket">
                        <img src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/close.svg" />
                    </view>
                </view>
                <view class="redpacket_content" style="background-color: #fff;">
                    <view class="redpacket_content_top flex_column_center_start">
                        <view class="maxRedpacketAmount">本单最大可用红包金额：<span class="num-font">{{maxRedpacketAmount}}</span>元</view>
                        <view class="totalRedpacket">已选中的红包金额：<span class="num-font">{{totalRedpacket}}</span>元</view>
                    </view>
                    <scroll-view scroll-y class="redpacketScroll" v-if="redpacketList && redpacketList.length>0">
                        <view v-for="(item,index) in redpacketList" :key="index" class="redpacket_item_box">
                            <view class="redpacket_item flex_row_start_start">
                                <view class="left flex_row_center_center">
                                    <view class="price_box num-font">
                                        <text class="unit num-font" :style="{fontSize:redpacketFitFontSize['small'][getHandlePartNumber(item.balance,'int').toString().length]}">¥</text>
                                        <text class="price_int num-font" :style="{fontSize:redpacketFitFontSize['int'][getHandlePartNumber(item.balance,'int').toString().length]}">{{getHandlePartNumber(item.balance,'int')}}</text>
                                        <text class="price_decimal num-font" v-if="getHandlePartNumber(item.balance,'decimal')!='.00'" :style="{fontSize:redpacketFitFontSize['decimal'][getHandlePartNumber(item.balance,'int').toString().length]}">{{getDecimalVal(getHandlePartNumber(item.balance,'decimal'))}}</text>
                                    </view>
                                </view>
                                <view class="center flex_row_start_center">
                                     <view class="center_con flex_column_between_start">
                                        <view class="title">{{item.name}}</view>
                                        <view class="original_amount">初始面额：{{item.amount}}元</view>
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
                        <text>暂无可用红包</text>
                    </view>
                </view>
                <view class="couponBottom" :class="[iosHairPhone ? 'iosBottomPadding' : 'androidBottomPadding']">
                    <view class="confirm-btn" @click="redpacketConfirm" >确定</view>
                </view>
            </view>
        </uni-popup>
        <!-- 运费券弹窗 -->
        <uni-popup ref="expressCouponPopup" type="bottom" background-color="#ffffff" @maskClick="close_expressCoupon">
            <view class="expressCoupon-container couponPopup-container">
                <view class="couponHeadBg">
                    <view class="couponHead">
                        <view class="title">运费券</view>
                        <view class="closeImg" @click="close_expressCoupon">
                            <image src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/close.svg" />
                        </view>
                    </view>
                    <view class="couponClass">
                        <view class="nav">
                            <view :class="{default:true,select:currentIndex1 == index}" v-for="(item,index) in expressCouList" :key="index" @click="changeExpressCouClass(index)">
                                <text>
                                    {{item.text}}
                                    <text class="classLength">[<text>{{item.listLength}}</text>]</text>
                                </text>
                            </view>
                        </view>
                    </view>
                </view>

                <view :class="{couponContent:true,active:currentIndex1 == 1}">
                    <scroll-view scroll-y class="couponScroll">
                        <view v-for="(item,classIndex) in expressCouList" :key="classIndex">
                            <view v-show="currentIndex1 == classIndex" class="couponItem_box">
                                <template v-if="item.listLength>0">
                                    <view v-for="(reditem, index) in item.list" :key="index" class="couponItem">
                                        <view class="circle_radio a" :for="'red_id_' + index" :data-id="index">
                                            <view class="red_item_wrap">
                                                <view class="red_left">
                                                    <view class="red_left_content flex_row_center_center">
                                                        <view class="red_h1">
                                                            <view class="price_box_white num-font">
                                                                <text class="unit num-font" :style="{fontSize:redpacketFitFontSize['small'][getHandlePartNumber(reditem.amount,'int').toString().length]}">¥</text>
                                                                <text class="price_int num-font" :style="{fontSize:redpacketFitFontSize['big'][getHandlePartNumber(reditem.amount,'int').toString().length]}">{{getHandlePartNumber(reditem.amount,'int')}}</text>
                                                                <text class="price_decimal num-font" :style="{fontSize:redpacketFitFontSize['small'][getHandlePartNumber(reditem.amount,'int').toString().length]}">{{handleDecimal(getHandlePartNumber(reditem.amount,'decimal'))}}</text>
                                                            </view>
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
                                                        <view v-if="classIndex == 0" class="red_h3_bottom fontScaleIgnore" @tap="select_expressCou(reditem,index)">
                                                            <view v-if="reditem.checked == true" class="expressCou_select selected"></view>
                                                            <view v-if="reditem.checked == false && selectContinued" class="expressCou_select notselect"></view>
                                                            <view v-if="reditem.checked == false && !selectContinued" class="expressCou_select disabledSelect"></view>
                                                        </view>
                                                        
                                                        <view class="red_bottom">
                                                            <view class="red_useTime" v-if="reditem.effectiveStart && reditem.effectiveEnd">{{maskTime(reditem.effectiveStart)}}~{{maskTime(reditem.effectiveEnd)}}</view>
                                                        </view>
                                                    </view>
                                                </view>
                                            </view>
                                        </view>
                                    </view>
                                </template>
                                <view v-else class='empty_content'>
                                    <view class="imgWrap"></view>
                                    <text>暂无运费券</text>
                                </view>
                            </view>
                        </view>
                    </scroll-view>
                </view>
                <view :class="['couponBottom',iosHairPhone ? 'iosBottomPadding' : 'androidBottomPadding']">
                    <view class="confirm-btn" @click="expressCouConfirm" v-if="currentIndex1 == 0">确定</view>
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
                <view class="close"><view @click="closeHelpTips" class="flex_row_center_center">我知道了</view></view>
            </view>
        </uniPopup>
        <!-- 选择配送时间 -->
        <bottomPopup ref="intSendDate" type="bottom" height="820rpx" text="配送时间">
               <view class="promise-date-container">

                        <view class="time_container">
                            <scroll-view scroll-y="true" :class="[showSinglePromiseDate ? 'single_date': 'left_date']">
                                <block v-if="!showSinglePromiseDate"> 
                                    <view class="item aa" @click="clickDateItem(item, index,1)" :class="{active: item.selected}"  v-for="(item, index) in calendarList" :key="index">
                                        {{item.dateStr | dateFormat}}
                                    </view>
                                </block>
                                <block v-else> 
                                    <view class="item" :class="{active: item.selected}" @click="clickDateItem(item, index,1)" v-for="(item, index) in calendarList" :key="index">
                                        <view>{{item.dateStr | dateFormat}}</view>
                                        <text v-if="item.selected" class="item_check iconfont icon_checked_radio"></text>
                                        <text v-else class="iconfont icon_check_radio"></text>
                                    </view>
                                </block>
                            </scroll-view>
                            <scroll-view v-if="!showSinglePromiseDate" scroll-y="true" class="right_date">
                                <view class="item" :class="{active: item.selected}" @click="clickTimeItem(item, index,1)" v-for="(item, index) in timeRangeList" :key="index">
                                    <view>{{item.timeRange}}</view>
                                </view>
                            </scroll-view>
                        </view>
                        <view :class="['btn-box',iosHairPhone ? 'iosBottomPadding' : 'androidBottomPadding']">
                            <view class="btn-handler cursor-btn normal-btn" @click="confirm(1)">
                                <view class="btn-text">确定</view>
                            </view>
                        </view>
                </view>
        </bottomPopup>
        <!-- 选择安装时间 -->
        <bottomPopup ref="intInstallDate" type="bottom" height="820rpx" text="配送时间">
               <view class="promise-date-container">

                        <view class="express_name">
                            <view class="item">安装时间</view>
                        </view>
                        <view class="time_container">
                            <scroll-view scroll-y="true" :class="[ installtimeRangeList.length <= 0 ? 'single_date': 'left_date' ]">
                                <block v-if="installtimeRangeList.length > 0">
                                    <view class="item" @click="clickDateItem(item, index,2)" :class="{active: item.selected}"  v-for="(item, index) in calendarInstallList" :key="index">
                                        <!-- dateRangeList -->
                                        {{item.dateStr | dateFormat}}
                                    </view>
                                </block>
                                <block v-else>
                                    <view class="item" :class="{active: item.selected}" @click="clickDateItem(item, index,2)" v-for="(item, index) in calendarInstallList" :key="index">
                                        <!-- dateRangeList -->
                                        <view>{{item.dateStr | dateFormat}}</view>
                                        <text v-if="item.selected" class="item_check iconfont icon_checked_radio"></text>
                                        <text v-else class="iconfont icon_check_radio"></text>
                                    </view>
                                </block>
                            </scroll-view>
                            <scroll-view v-if="installtimeRangeList.length > 0" scroll-y="true" class="right_date">
                                <view class="item" @click="clickTimeItem(item, index,2)" v-for="(item, index) in installtimeRangeList" :key="index">
                                    <view>{{item.timeRange}}</view>
                                    <text v-if="item.selected" class="item_check iconfont icon_checked_radio"></text>
                                    <text v-else class="iconfont icon_check_radio"></text>
                                </view>
                            </scroll-view>
                        </view>

                        <view :class="['btn-box', iosHairPhone ? 'iosBottomPadding' : 'androidBottomPadding']">
                            <view class="btn-handler cursor-btn normal-btn" @click="confirm(2)">
                                <view class="btn-text">确定</view>
                            </view>
                        </view>
                </view>
        </bottomPopup>
        <!-- 选择商品来选择配送时间 -->
        <bottomPopup ref="SendDatePop" type="bottom" height="900rpx" text="配送时间">
               <view class="promise-date-container">

                    <scroll-view scroll-y="true" class="date-wrap">
                        <view class="item-container" v-for="(item, index) in productPromiseCalendars" :key="index">
                            <view class="imgList">
                                <view class="image_wrap" v-for="(image, i) in item.imgPathList" :key="i">
                                    <image mode="widthFix" :src="image"/>
                                </view>
                            </view>
                            <view v-if="!!item.deliveryTimeStr" @click="clickItem(item, index)" class="des-box">
                                <view class="des-content">
                                    <view class="name">{{item.showName || ''}}送货时间</view>
                                    <view class="time" v-html="item.deliveryTimeStr"></view>
                                </view>
                                <view>
                                    <text class="iconfont icon_arrow_right"></text>
                                </view>
                            </view>
                            <view v-else class="des-box">
                                <view class="des-content">
                                    <view class="name">{{item.showName || ''}}送货时间</view>
                                    <view class="time">{{`工作日、双休日与节假日均可送货`}}</view>
                                </view>
                            </view>
                            <!-- 当大件安装时间日历存在时，才显示 -->
                            <view @click="clickInstallItem(item, index)" class="des-box" v-if="item.calendarDayInstallDays.length > 0">
                                <view class="des-content">
                                    <view class="name">{{item.showName || ''}}安装时间</view>
                                    <view class="time" v-html="item.installTimeStr"></view>
                                </view>
                                <view>
                                    <text class="iconfont icon_arrow_right"></text>
                                </view>
                            </view>
                        </view>
                    </scroll-view>

                    <view :class="['btn-box', iosHairPhone ? 'iosBottomPadding' : 'androidBottomPadding']">
                        <view class="btn-handler cursor-btn normal-btn" @click="closePopup()">
                            <view class="btn-text">确定</view>
                        </view>
                    </view>
                </view>
        </bottomPopup>
        <!-- 云豆抵现弹框 -->
        <bottomPopup ref="integralModel" type="bottom" height="900rpx" :showTitle="false" :showCloseBtn="false" class="intPopup" conBackground="transparent">
            <view class="address_list_con">
                <view class="int_fudai"></view>
                <view class="colse_int_popup" @click="closeInt"></view>
                <view class="member_int flex_column_start_center">
                    <view class="int_title" @click="showIntRule">云豆</view>
                    <view class="int_balance">可用余额：<text class="num-font int_num">{{allData.memberIntegral}}</text>个</view>
                </view>
                <scroll-view scroll-y="true" class="address_list" @touchmove.stop.prevent="moveHandle">
                    <view v-for="(item, index) in allData.integralList" :key="index" class="list" @click="selInt(item)">
                        <view class="wrapper flex_row_start_center">
                            <view class="flex_column_start_start">
                                <view class="address-box">
                                    <text class="int_desc">抵扣</text>
                                    <text class="int_desc redColor">￥
                                        <text class="price_int num-font">{{getHandlePartNumber(item/allData.integralScale,'int')}}</text>
                                        <text class="price_decimal num-font">{{getHandlePartNumber(item/allData.integralScale,'decimal')}}</text>
                                    </text>
                                    <text class="int_desc">使用</text>
                                    <text class="int_desc num-font">{{item}}</text>
                                    <text class="int_desc">云豆</text>
                                </view>
                            </view>
                        </view>
                        <view class="red_h3_bottom fontScaleIgnore">
                            <view v-if="item==tmpInt" class="platform_select selected"></view>
                            <view v-else-if="item>allData.memberIntegral" class="platform_select disabledSelect"></view>
                            <view v-else class="platform_select notselect"></view>
                        </view>
                    </view>
                </scroll-view>
                <view class="other_address">
                    <view class="integral_opt">
                        <view class="no_int" @click="conInt('noInt')">暂不使用云豆</view>
                        <view class="int_con" @click="conInt('confirm')">确定</view>
                    </view>
                </view>
            </view>
        </bottomPopup>
        <!-- 运费凑单说明 -->
        <uni-popup ref="expressTip" type="center">
            <view class="express_tip_con">
                <view class="tips_head">
                    <view class="title_txt">运费凑单说明</view>
                    <view class="close_img" @click.stop="$refs.expressTip.close()">
                        <image mode="widthFix" src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/close.svg" />
                    </view>
                </view>
                <scroll-view class="tips_con" scroll-y="true">
                    <view class="item" v-if="currentStoreInfo.expressFeeInfo.freightAmount != -1" >1、店铺基础运费: {{currentStoreInfo.expressFeeInfo.freightAmount}}元;</view>
                    <view class="item" v-else>1、店铺基础运费: 具体以订单内显示金额为准</view>
                    <view class="item">
                        2、该店铺金额满 {{ currentStoreInfo.expressFeeInfo.fullAmount }} 元
                        <text v-if="currentStoreInfo.expressFeeInfo.lowerAmount == -1">免运费</text>
                        <text v-else>减 {{ currentStoreInfo.expressFeeInfo.lowerAmount }} 元</text>
                    </view>
                </scroll-view>
                <view class="tips_footer">
                    <text class="remark">注：店铺订单金额是指订单内该店铺所有商品的销售价*数量之和再扣除店铺优惠（包括店铺优惠券和店铺满减等）之后的金额，不包括平台优惠。</text>
                </view>
                <view class="divide"></view>
                <view class="express_tip_btn" @click.stop="$refs.expressTip.close()">我知道了</view>
            </view>
        </uni-popup>
        <!-- 云豆规则 -->
        <uni-popup ref="intRule" type="center" >
            <view class="intRule_box flex_column_between_center">
                <view class="intRule_fudai"></view>
                <view class="intRule_top">
                    <view class="int_title">云豆使用规则</view>
                    <view class="int_content">
                        <scroll-view :scroll-y="true">
                            <view class="int_content_title">使用条件</view>
                            <view>1. 订单金额大于<text class="num-font">{{intRuleList[2]}}</text>元（含）。</view>
                            <view>2. 云豆数量大于<text class="num-font">{{intRuleList[1]}}</text>个（含）；具体以页面实际 可用云豆量为准 。</view>
                            <view class="int_content_title last_title">使用数量</view>
                            <view>1. 云豆数量大于<text class="num-font">{{intRuleList[1]}}</text>个（含）。</view>
                            <view>2. <text class="num-font">{{intRuleList[1]}}</text>云豆抵<text class="num-font">1</text>元 。</view>
                        </scroll-view>
                    </view>
                </view>
                <view class="close"><view @click="closeIntRule" class="flex_row_center_center">我知道了</view></view>
            </view>
        </uni-popup>
        <!-- 运费满减明细弹窗 -->
        <uni-popup ref="expressRulesPopup" type="bottom" background-color="#ffffff" @maskClick="close_expressRules">
            <view class="couponPopup-container expressRules-container">
                <view class="couponHead">
                    <view class="title">运费明细</view>
                    <view class="closeImg" @click="close_expressRules">
                        <img src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/close.svg" />
                    </view>
                </view>
                <view v-if="currentStoreInfo">
                    <scroll-view scroll-y class="couponScroll">
                         <view class="details_box">
                            <view class="goods_amount flex_row_between_center">
                                <text class="amount_title">店铺运费</text>
                                <text class="num-font amount_num">￥{{getHandlePartNumber(currentStoreInfo.expressFeeInfo.originFreight,'int')}}{{getHandlePartNumber(currentStoreInfo.expressFeeInfo.originFreight,'decimal')}}</text>
                            </view>
                            <view class="goods_amount flex_row_between_center discount_amount">
                                <text class="amount_title">运费优惠</text>
                                <text class="num-font amount_num" v-if="currentStoreInfo.expressFeeInfo.finalLower!=-1">-￥{{getHandlePartNumber(currentStoreInfo.expressFeeInfo.finalLower,'int')}}{{getHandlePartNumber(currentStoreInfo.expressFeeInfo.finalLower,'decimal')}}</text>
                                <text class="num-font amount_num" v-else>-￥{{getHandlePartNumber(currentStoreInfo.expressFeeInfo.originFreight,'int')}}{{getHandlePartNumber(currentStoreInfo.expressFeeInfo.originFreight,'decimal')}}</text>
                            </view>
                            <view class="rules_tips">
                                订单金额满
                                <text class="num-font voice">{{getHandlePartNumber(currentStoreInfo.expressFeeInfo.fullAmount,'int')}}{{getHandlePartNumber(currentStoreInfo.expressFeeInfo.fullAmount,'decimal')}}</text>元
                                <text v-if="currentStoreInfo.expressFeeInfo.lowerAmount==-1">免运费</text>
                                <text v-else>减运费<text class="num-font voice">{{getHandlePartNumber(currentStoreInfo.expressFeeInfo.lowerAmount,'int')}}{{getHandlePartNumber(currentStoreInfo.expressFeeInfo.lowerAmount,'decimal')}}</text>元</text>
                            </view>
                            <view class="goods_amount flex_row_between_center">
                                <text class="amount_title">店铺运费实付</text>
                                <text class="num-font amount_num redColor">+￥{{getHandlePartNumber(currentStoreInfo.expressFeeInfo.finalFreight,'int')}}{{getHandlePartNumber(currentStoreInfo.expressFeeInfo.finalFreight,'decimal')}}</text>
                            </view>
                        </view>
                    </scroll-view>
                </view>
                <view :class="['couponBottom',iosHairPhone ? 'iosBottomPadding' : 'androidBottomPadding']">
                    <view class="confirm-btn" @click="close_expressRules" >我知道了</view>
                </view>
            </view>
        </uni-popup>
        <!-- 订单备注输入框 -->
        <bottom-popup ref="remarkPopup" type="bottom" height="800rpx" text="订单备注" :showCloseBtn="true" @change="remarkPopupChange">
            <view class="remark_con">
                <view class="textarea_con">
                    <textarea v-model="remark" 
                        :placeholder-style="{color: '#c2c2c2', 'font-size': '28rpx'}"
                        class="textarea" 
                        :maxlength="remarkMaxlength" 
                        placeholder="给商家备注，最多 100 字" 
                        :data-remark-len="`${remark.length}/${remarkMaxlength}`">
                    </textarea>
                </view>

                <view class="remark_btn_con">
                    <view class="remark_btn" @click="confirmRemark">确定</view>
                </view>
            </view>
            
        </bottom-popup>
    </view>
</template>

<script>
import systemMixin from '@/common/mixin/system.js';
import mixin from '@/views/order/confirm/comfirmOrderMixin'
import cartHandler from "@/views/components/cart/handler";
import payHandler from '@/views/components/pay/handler';
import orderHandler from '@/views/components/order/handler';
import {skipTo,getPartNumber,getStorageSync,removeStorageSync,accAdd,accSub, isNotEmpty } from '@/utils/common.js';
import request from '@/utils/request';
import uniPopup from '@/common/components/uni-popup/uni-popup.vue'
import bottomPopup from '@/common/components/uni-popup/uni-popup-bottom.vue'
import config from '@/common/lib/config.js';
import uniNumberBox from "@/common/components/uni-number-box/uni-number-box.vue";
import Skeleton from '@/views/components/order/skeleton-product-info'
import { mapGetters } from 'vuex'

import {subscribeMessage} from '@/views/subscribe/index.js';
import { SUB_PUB_KEY } from '@/views/subscribe/enum.js';

export default {
    components:{
        uniPopup,
        bottomPopup,
        uniNumberBox,
        Skeleton
    },
    data() {
        return {
            firstLoading: true,
            mainImage: '', // 骨架临时占位图
            goodsMaxNum: 999,
            upTriangleImage: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/uptriangle2%402x.png',
            downTriangleImage: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_downtriangle2%402x.png',
            storeLogo: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/goods/store_logo.png',
            FEATHER_ORDER: false,
            maskState: 0, //优惠券面板显示状态
            invoiceInfo: {}, //发票信息
            needInvoice: false, //是否需要发票
            check_agreement: false,
            show_check_icon: getApp().globalData.imgUrl + 'common/icon/register_uncheck.png',
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
            currentIndex:0, //默认选中可用优惠券
            fitfontSize:{1:'64rpx',2:'64rpx',3:'64rpx',4:'56rpx',5:'56rpx',6:'48rpx',7:'40rpx',8:'34rpx',9:'30rpx',10:'26rpx',11:'24rpx'
            },
            unitSize:{1:'32rpx',2:'32rpx',3:'32rpx',4:'28rpx',5:'28rpx',6:'28rpx',7:'28rpx',8:'24rpx',9:'24rpx',10:'22rpx',11:'22rpx'},
            activeSize:{19:'22rpx',20:'22rpx',21:'20rpx',22:'20rpx'},
            redpacketFitFontSize:{
                'small':{1:'28rpx',2:'28rpx',3:'28rpx',4:'28rpx',5:'28rpx',6:'28rpx',7:'24rpx',8:'24rpx'},
                'big':{1:'56rpx',2:'56rpx',3:'56rpx',4:'56rpx',5:'52rpx',6:'44rpx',7:'36rpx',8:'32rpx'}
            },
            addressList: [], // 地址列表
            orderAddress: {}, // 订单地址对象
            couponNum: 0, // 使用优惠券数量
            paySn: '',
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
            loadedData:false,
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
            initPrice:0, //商品总额-运费总额+积分抵扣总额
            ifcart: null,
            currentStoreInfo:null, //当前店铺信息
        }
    },
    onLoad(){
        this.FEATHER_ORDER = this.$Route.query.FEATHER_ORDER;
        this.ifcart = this.$Route.query.ifcart;
        
        this.isAloneBuy = this.$Route.query.isAloneBuy ? this.$Route.query.isAloneBuy : false
        this.spellTeamId = this.$Route.query.spellTeamId ? this.$Route.query.spellTeamId : 0

        let spreaderTmp = getStorageSync('spreaderId');

        if (spreaderTmp) {
            this.spreaderMemberId = spreaderTmp
        }
    },
    async mounted(){
        
        this.getAddressList() // 获取地址列表

        this.getIntRule()
        this.initInvoice(false); // 初始化发票信息

        uni.$on('addressBack', (data) => {
            this.showType = data
        })

        uni.$on('checkEdit', () => {
            this.isCheckBack = true
        })

    },
    mixins: [mixin, systemMixin],

    onShow() {
        this.orderAddress = this.$store.state.defaultAddress;
        if (isNotEmpty(this.$store.state.selectAddress)) {
            this.orderAddress = this.$store.state.selectAddress;
        }
        if (this.ifOnShow) {
            // 初始化发票信息
            this.initInvoice(true);
        }
    },
    computed: {
        ...mapGetters(['getValidAddressList']),
        topStyle(){
            return {
                marginTop: this.navHeight + 'px'
            }
        },
        // 单列配送时间布局显示
        showSinglePromiseDate(){
            return !this.timeRangeList || this.timeRangeList.length <= 0;
        },
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
        },
        getAvailableClassName() {
            return this.currentIndex == 0 && this.availableCouponList?.length > 0
        },
        // 所有店铺的扁平化商品信息:用于请求submit, check接口， ，此对象不适用confirm（已优化）
        flatProducts(){
            return this.goodsData?.flatMap(item =>item.products).map(product => {
                let {sku, number, notAttendDiscount, discountVO} = product;
                return {
                    sku, number, notAttendDiscount, ...discountVO
                }
            });
        },
        // 所有店铺的扁平化商品信息:用于页面显示
        flatProductList(){
            return this.goodsData?.flatMap(item => item.productList);
        },
        // 从所有店铺中筛选出指定店铺  可用优惠券
        storeAvailableCouponList(){
            return (storeId) => {
                return this.availableCouponList.filter(coupon => coupon.storeId == storeId)
            }
        },
        cartIds(){
            let cartIds = "";
            this.flatProductList.forEach(product => cartIds = cartIds.concat(product.cartId, ','));
            return cartIds.substring(0, cartIds.length - 1); // 去逗号返回
        },
    },
    methods: {
        // 有小数点则显示，没有则省略
        handleDecimal(strValue){
            let value = Number(strValue); // 去除小数点后面多余的0
            if(value == 0){
                return ''
            }
            return value.toString().replace(/^0\.?/, '.'); // 去除小数点前面的0
        },
        getParamFromStorage(){
            let { goodsData } = getStorageSync('orderConfirm');
            // 前端缓存中取出来的数据
            this.goodsData = goodsData;

        },
        // 初始化发票
        initInvoice(flag){
            // const is_need_invoice = this.getStorageSync('is_need_invoice')
            const is_need_invoice =flag ? getStorageSync('is_need_invoice') : false; //需求9158 将确认订单页面的“发票”栏默认的逻辑由默认上一次发票抬头修改为“不需要发票”，每次确认订单时均默认不需要发票，若用户需要则点击进入选择发票抬头；
            const invoiceInfo = getStorageSync('invoice_info')
            const invoiceContent = getStorageSync('invoice_content')
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
            if (this.allData.integralList?.length==0 || this.initPrice<this.intRuleList[2] || this.allData.memberIntegral<this.allData.integralScale) {
                return
            }

            this.$refs.integralModel.open()
        },
        remarkPopupChange({show}){
            // 关闭
            if(!show){
                this.remark = '';
                this.currentStoreId = ''
            }else{
                // 打开
            }
        },
        showRemarkPopup(storeId){
            this.currentStoreId = storeId;

            // 当店铺有备注
            this.remark = this.remarkMap[storeId] || '';
            this.$refs.remarkPopup?.open()
        },
        confirmRemark(){
            this.remarkMap[this.currentStoreId] = this.remark;
            this.$refs.remarkPopup?.close()
        },
        showIntRule() {
            this.$refs.intRule.open()
        },
        closeIntRule() {
            this.$refs.intRule.close()
        },

        //选择优惠券
        select_coupon(coupon) {
            this.resetState({clearCouponCode: false});
            this.redpacketCodeList = []
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
                        this.storeAvailableCouponList(item.storeId)?.forEach((item1) => {
                            if (item1.couponCode == value.couponCode){
                                this.$set(item1, 'checked', false)
                            }
                        })
                        this.confirmOrder(2)
                    } else {
                        let flag = this.storeAvailableCouponList(item.storeId)?.some((store) => {
                            return store.checked == true
                        })
                        if (flag){
   
                            this.storeAvailableCouponList(item.storeId)?.forEach((item2) => {
                                if (item2.checked == true){
                                    this.$set(item2, 'checked', false)
                                }
                            })
                        } 
                        this.storeAvailableCouponList(item.storeId)?.forEach((item2) => {
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
        async getAddressList(isShow) {
            this.addressLoading = true;
            this.addressList = this.getValidAddressList;
            this.orderAddress = this.$store.state.defaultAddress;
            if (isNotEmpty(this.$store.state.selectAddress)) {
                this.orderAddress = this.$store.state.selectAddress;
            }

            // 从缓存中取出参数
            this.getParamFromStorage();
            
            // 非鹅毛情订单确认页面, 如果没有收获地址, 直接跳转到收获地址页面让用户新建
            if (!this.FEATHER_ORDER && !this.orderAddress.addressId) {
                setTimeout(() => {
                    this.$Router.push({
                        path: '/views/address/list',
                        query: {
                            from: 'orderConfirm',
                            source: 1
                        }
                    })
                }, 500)
            }
            
            this.addressLoading = false;
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


        /**
         * 
         * @param {*} type 用于切换地址，使用优惠券，获取信息，运费等  type 服务端参数解释 1立即购买 去结算;2 提交订单页 修改优惠券 修改云豆 修改地址 更新页面数据 ;3 提交订单
         * @param {*} failCallback confirm失败回调
         */ 
        confirmOrder(type, failCallback) {
			
            //修改数量后需要清除选中的优惠券红包积分等信息
            let isChangeGoodsNum = !!failCallback;

            let param = {};
            param.data = {};
            // 鹅毛情订单特殊处理
            if(this.FEATHER_ORDER){
                // 鹅毛情相关参数
                param.data.orderSource = 'FEATHER'
                param.data.featherSubmitParamVO = {
                    giverOrReceiver: 0
                }
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
            if(!isChangeGoodsNum){
                param.data.platformCouponCode = this.currentPlatformCouponCode
            }
            param.data.isAloneBuy = this.isAloneBuy //拼团商品是否单独购买
            if (this.spellTeamId != 0) {
                param.data.spellTeamId = this.spellTeamId
            }
            //修改商品数量清空积分数据
            if (this.integral > 0 && !isChangeGoodsNum) {
                param.data.integral = this.integral
            }

            // 店铺信息
            let storeInfoList = []

            this.goodsData.forEach((store) => {
                let storeItem = {}
                storeItem.storeId = store.storeId;
                storeItem.storeName = store.storeName;
                storeItem.ownShop = store.ownShop;
                // products为核心下单参数， 修改商品数量时此参数会变更
                storeItem.products = store.products;

                storeItem.invoiceId = this.invoiceId
                storeItem.storeCouponCode = ""
                storeItem.selectedPromiseCalendars = []

                this.storeAvailableCouponList(store.storeId).forEach(item => {
                    storeItem.storeId = item.storeId
                    //修改商品数量清空优惠券数据
                    if (item.checked == true && !isChangeGoodsNum) {
                        storeItem.storeCouponCode = item.couponCode
                    }
                })
                

                storeInfoList.push(storeItem)

            })  
                 
            param.data.storeInfoList = storeInfoList

            //修改商品数量清空红包数据
            if(!isChangeGoodsNum){
                param.data.redpacketCodeList = this.redpacketCodeList
                param.data.freightCouponCodeList = this.expressCouCodeList
            }

            param.data.source = type
        
            !this.firstLoading && this.$refs?.loading?.open();
            this.firstLoading = false;

            this.loadedData = false
            orderHandler.confirm(param.data).then(res => {
                this.loadedData = true
                if (res.state == 200) {
                    this.allData = res.data;
                    this.goodsData.forEach(storeItem => {
                        let goodsDataItem = res.data.storeGroupList?.find(item => item.storeId == storeItem.storeId);
                        goodsDataItem.products = storeItem.products
                        Object.assign(storeItem, goodsDataItem)
                    });

                    // 整合每个商品的赠品
                    this.integrateProductGiftList();
                    this.IntegrateCalendars();
                    this.isVatInvoice = res.data.vatInvoice;
                    this.totalDiscount = res.data.totalDiscount;
                    this.totalCouponDiscount = res.data?.totalCouponDiscount

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
                    if (this.totalExpressCoupon >= this.allData.freightAmount) {
                        this.initExpressCouData.selectContinued = false
                        this.selectContinued = false
                    } else {
                        this.initExpressCouData.selectContinued = true
                        this.selectContinued = true
                    }

                    
                    this.initPrice = accAdd(accSub(this.allData.goodsAmount,this.allData.totalDiscount),this.allData.integralCashAmount)
                    this.loadFlag = true;
                    // 如果订单金额为0，不显示开发票的功能
                    if (this.allData.totalAmount == 0) {
                        this.needInvoice = false
                        this.invoiceInfo = {}
                        this.invoiceId = ''
                        this.invoiceContent = 1
                    }
                    //接口返回包含店铺和平台所有可用、不可用列表
                    this.availableCouponList = res.data?.availableCouponList
                    this.disabledCouponList = res.data?.disabledCouponList
                    this.availableCouponList?.sort((a,b) => {
                        return a.receiveTime<b.receiveTime?1:-1
                    });
                    this.disabledCouponList?.sort((a,b) => {
                        return a.receiveTime<b.receiveTime?1:-1
                    });
                    //从可用列表中获取当前全部选中的优惠券
                    let temp = this.availableCouponList?.filter((item) =>item.checked == true).map((item)=>item.couponCode)

                    //记录最佳也就是第一次
                    if (type == 1){
                        //最佳优惠券集合
                        this.recommendCouponList = temp
                    }
                    //判断用户操作后 是否还是最佳 也就是判断isRecommendCount和temp的值
                    this.isRecommendCoupon = this.recommendCouponList?.length == temp?.length && this.recommendCouponList?.every(a => temp.some(b => a===b))? true:false;
                    let num = 0
                    this.availableCouponList?.forEach((item) => {
                        this.$set(item, 'isOpen', false)
                        if (item.checked == true){
                            num++
                        }
                        this.couponNum = num
                    })
                    //当前平台优惠券code
                    this.currentPlatformCouponCode = this.availableCouponList?.filter((item) => {
                        return item.storeId == 0 && item.checked == true
                    }).map((item) => {
                        return item.couponCode
                    })[0]
                    this.couponList[0].list = this.availableCouponList
                    this.couponList[0].listLength = this.availableCouponList?.length
                    this.couponList[1].list = this.disabledCouponList
                    this.couponList[1].listLength = this.disabledCouponList?.length
                    this.recommendCouponList?.forEach((item)=>{
                        this.availableCouponList?.forEach((coupon,index) => {
                            if (coupon.couponCode == item){
                                this.availableCouponList?.splice(index,1)
                                this.availableCouponList?.splice(0,0,coupon)
                            }
                        })
                    })
                    // 有默认地址才获取配送时间
                    if (this.orderAddress.addressId) {
                        this.getPromiseCalendar();//获取配送时间
                    }
                } else {
                    failCallback?.call(this)
                    uni.showToast({
                        title:res.msg,
                        icon:'none'
                    })
                }
            }).catch((e) => {
                console.log(e)
                failCallback?.call(this)
                //异常处理
            }).finally(()=>{
                this.$refs?.loading?.close();
            })
        },
        //显示优惠券面板
        toggleMask(type) {
            let timer = type === 'show' ? 10 : 300;
            let state = type === 'show' ? 1 : 0;
            this.maskState = 2;
            setTimeout(() => {
                this.maskState = state;
            }, timer)
        }, 
        /**
         * product 当前商品
         * numObj 当前商品的数量
         **/
        async changeGoodsNumber(numObj, product) {
            if(numObj.value == numObj.preValue){
                return
            }

            // 修改页面显示
            product.buyNum = numObj.value;
            // 变更下单所需要的参数
            this.changeConfirmParam(numObj.value, product);
            // check
            this.changeGoodsNumCheck(numObj.preValue, product, () => {
                product.buyNum = numObj.preValue; 
                this.changeConfirmParam(numObj.preValue, product);
            });
            
        },
        /**
         * 修改商品数量方法
         * @param String 切换的商品数量对象
         * @param Object 商品对象
         * 
        */      
        changeGoodsNumCheck(preNum, product, failureCallback) {
            this.loadedData = false
            
            let param= {};
            param.isAloneBuy = this.isAloneBuy //拼团商品是否单独购买
            param.source = 2;

            param.products = this.flatProducts;
            
            if (this.orderAddress.addressId) {
                param.addressId = this.orderAddress.addressId
                param.receiverInfo = {
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
            this.$refs?.loading?.open();
            orderHandler.checkOnce(param).then(res => {
                this.$refs?.loading?.close();
                if (res.state == 200) {
                    // 如果出现了异常，进行一个回退操作
                    this.confirmOrder(1, failureCallback);
                }else if (res.state == 267) {
                    //2023-3-22原check逻辑移动到confirm进行，todo check接口需要废弃。
                    this.loadedData = true
                    

                    // 库存不足的商品不是当前修改的商品
                    if(res.data?.productList?.findIndex(p => p.sku == product.sku) <= -1){
                        this.confirmOrder(1, failureCallback);
                    }else{
                        failureCallback?.call(this);
                        this.manageUnusualProduct(res);
                    }           
                } else {
                    this.loadedData = true
                    uni.showToast({
                        title: res.msg,
                        icon: 'none'
                    })
                    failureCallback?.call(this);
                }
            }).catch(()=>{
                this.$refs?.loading?.close();
                failureCallback?.call(this);
                this.loadedData = true
            }).finally(()=>{
            })
        }, 
        // 下单成功后根据cartIds删除购物车对应的商品
        async deleteGoodsByCartIds(cartIds){
            const param = {cartIds}
            let {state, msg} = await cartHandler.deleteCarts(param);
            if(state != 200){
                uni.showToast({
                    title: msg,
                    icon: 'none'
                })
            }
            // 更新购物车
            this.$store.dispatch('getCartList')
        },
        // 修改普通订单confirm的必要参数 products
        changeConfirmParam(num, product){
            // 修改接口参数：从所有店铺中查找 sku
            for (let i = 0; i < this.goodsData.length; i++) {
                let storeItem = this.goodsData[i];
                let p =  this.findBySku(storeItem.products, product.sku)
                if(p){
                    p.number = num;
                    break
                }
            }
        },
        
        clearFailureGoods() {
            let invalidSkuList = this.no_good_info?.productList?.map(item => item.sku)
            // 前端移除商品
            this.goodsData.forEach(storeItem => {
                // 数据显示移除
                storeItem.productList = storeItem.productList.filter(product => {
                    return !invalidSkuList.includes(product.sku)
                })
                // 接口参数移除
                storeItem.products = storeItem.products.filter(product => {
                    return !invalidSkuList.includes(product.sku)
                })
            })
            // 移除对应的购物车id
            this.store_show_no_good = false;
            this.$refs.noGoodRef.close();


            this.resetState({
                clearCouponCode: true
            });

            this.confirmOrder(1)
        },
        /**
         * 清空失效商品、切换优惠券、试用推荐优惠前
         */
        resetState({clearCouponCode}){
            clearCouponCode && (this.currentPlatformCouponCode = '');

            this.redpacketCodeList = []; // 清空红包
            this.expressCouCodeList = []; // 清空运费券
            // 清空积分信息
            this.integral = 0; 
            this.tmpInt = 0;
        },
        beforeSubmit(){
            // 提前判断如果金额是0元，则为0元支付，不调用微信pay，直接订阅  && 不是鹅毛情订单
            if (this.allData.totalAmount == 0 && !this.FEATHER_ORDER) {
                subscribeMessage(this, [SUB_PUB_KEY.PAYMENT_SUCCESS_REMINDER], this.submit);
            }else{
                this.submit();
            }
        },

        //提交订单
        submit(gift) {
            // 订单锁
            if (!!this.orderLock){ return }
            this.orderLock = true;
            removeStorageSync('addressId');

            let param = {};
            param.data = {};
            let storeInfoList = []
                
            this.goodsData.forEach(item => {
                let storeItem = {}
                storeItem.invoiceId = this.invoiceId
                storeItem.invoiceContent = this.invoiceContent
                storeItem.storeCouponCode = "";
                storeItem.remark = this.remarkMap[item.storeId] || ''

                this.storeAvailableCouponList(item.storeId).forEach(items => {
                    storeItem.storeId = items.storeId
                    if (items.checked == true) {
                        storeItem.storeCouponCode = items.couponCode
                    }
                })

                storeItem.storeId = item.storeId;
                if (!!item.productPromiseCalendars){
                    item.productPromiseCalendars?.forEach(temp=>{
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
                
                let productPromiseCalendars = JSON.parse(JSON.stringify(item.productPromiseCalendars || [])) || [];
                let selectedPromiseCalendars = [];
                productPromiseCalendars.forEach(items=>{
                    if (!!items.supportDelivery){
                        selectedPromiseCalendars.push(items)
                    }
                })
                // 鹅毛情订单不指定配送时间
                if(!this.FEATHER_ORDER){
                    storeItem.selectedPromiseCalendars = selectedPromiseCalendars
                }
                storeInfoList.push(storeItem)
            })
            param.data.platformCouponCode = this.currentPlatformCouponCode
            param.data.storeInfoList = storeInfoList
            param.data.orderFrom = 5
            if(this.FEATHER_ORDER){
                // 鹅毛情相关参数
                param.data.orderSource = 'FEATHER'
                param.data.featherSubmitParamVO = {
                    giverOrReceiver: 0
                }
            }
            // param.data.addressId = this.orderAddress.addressId
            // 订单接口 addressId 替换为地址相关对象
            if (!this.FEATHER_ORDER && this.orderAddress.addressId) {
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
            param.data.source = 3;
            param.data.products = this.flatProducts;
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

            // 下单新增企业名称字段
            if (!!config.COMPANYNAME){
                param.data.companyName = config.COMPANYNAME;
            }
            // 下单新增渠道名称字段
            if (!!config.CHANNELNAME){
                param.data.channelName = config.CHANNELNAME;
            }
            param.data.redpacketCodeList = this.redpacketCodeList
            param.data.freightCouponCodeList = this.expressCouCodeList
            this.$refs?.loading?.open();
            orderHandler.submit(param.data).then(res => {
                if (res.state == 200) {
                    // 上报购买事件
                    this.$statEvent({
                        behaviorType: 'buy',
                    })
 
                    // 调用支付
                    payHandler.pay(this, { ...res.data });
                    


                    if(this.ifcart == 1){
                        this.deleteGoodsByCartIds(this.cartIds)
                    }
                } else if (res.state == 88106018){ //赠品不足原300
                    //清空skuList
                    this.skuList=[];
                    this.skuList.push(res.msg);
                    uni.showModal({
                        confirmColor: '#f30300',
                        cancelColor: '#999',
                        title: '提示',
                        content: '赠品已无货是否继续提交订单~',
                        confirmText: '继续',
                        cancelText: '我再想想',
                        success: result => {
                            if (result.confirm) {
                                this.beforeSubmit(true)
                            } else {
                                this.skuList=[]
                                this.openOrderLock();
                            }
                        }
                    })
                    this.$refs?.loading?.close();

                } else if (res.state == 88106017){ // 附件不足原301
                    this.skuList.push(res.msg);
                    uni.showModal({
                        confirmColor: '#f30300',
                        cancelColor: '#999',
                        title: '提示',
                        content: '附件已无货是否取消订单~',
                        confirmText: '确定',
                        cancelText: '我再想想',
                        success: result => {
                            if (result.confirm) {
                                // this.submit(true)
                                this.skuList=[]
                                this.openOrderLock();
                            } else {
                                this.skuList=[]
                                this.openOrderLock();
                            }
                        }
                    })
                    this.$refs?.loading?.close();
                } else if (res.state == 88201088){ //余额不足 提示联系客服处理的弹窗
                    uni.showModal({
                        confirmColor: '#f30300',
                        cancelColor: '#999',
                        title: '提示',
                        content: '下单失败，请联系客服处理',
                        confirmText: '确定',
                        cancelText: '取消',
                        success: result => {
                            if (result.confirm) {
                            }
                        }
                    })
                    this.openOrderLock();
                } else if (res.state == 267) {
                    if(res.data.state == 8){
                        const { stateValue, productList } = res.data;
                        uni.showToast({
                            title: stateValue,
                            icon: 'none'
                        });

                        setTimeout(() => {
                            productList.forEach(product => {
                                this.changeGoodsNumber({preValue: product.buyNum, value: product.lowestBuy}, product)
                            })
                        }, 1000);
                        this.openOrderLock();
                        return
                    }
                    this.manageUnusualProduct(res);
                    
                    this.openOrderLock();
                } else {
                    uni.showToast({
                        title:res.msg,
                        icon:'none',
                        duration:2000
                    })
                    this.openOrderLock();
                }
            }).catch((e) => {
                console.error(e)
                //异常处理
                this.openOrderLock();
            }).finally( ()=> {
                this.$refs?.loading?.close(); 
            })
        },
        stopPrevent() {},
        // 跳转我的发票页面
        toInvoice() {
            this.$Router.push({
                path: '/views/invoice/myInvoice',
                query: {
                    isVatInvoice: this.isVatInvoice,
                    applyType: 'confirmOrder',
                    needInvoice: this.needInvoice,
                    invoiceContent: this.invoiceContent
                }
            })
        },
        getIntRule() {
            request({
                url: '/v3/system/front/setting/getSettings',
                data: {
                    names: 'integral_cash_out_is_enable,integral_conversion_ratio,integral_use_lowest_amount,integral_max_deduct_rate,coupon_user_help'
                }
            }).then(res => {
                if (res.state == 200) {
                    this.intRuleList = res.data
                }
            })
        },
        //规则展开
        descriptionOpenStore(value) {
            this.goodsData.forEach(item1=>{
                item1.availableCouponList?.forEach( item => {
                    if (item.couponMemberId == value.couponMemberId) {
                        if (item.description != '') {
                            this.$set(value, 'isOpen', !value.isOpen)
                            this.$set(item, 'isOpen', !item.isOpen)
                            this.$forceUpdate()
                        }
                    }
                })
            })
        },
        descriptionOpenPlat(value) {
            this.platformCouponList.forEach( item => {
                if (item.couponMemberId == value.couponMemberId && item.description != '') {
                    this.$set(item, 'isOpen', !item.isOpen)
                    this.$forceUpdate()
                }
            })
        },
        manageUnusualProduct({ data }) {
            // 只有一个商品，toast提示
            if (this.flatProductList.length <= 1) {
                uni.showToast({
                    title: data?.stateValue,
                    icon: 'none'
                })
                return
            }

            // 限购使用showToast提示
            if (data?.state == 6) {
                uni.showToast({
                    title: '超过商品限购数量',
                    icon: 'none'
                })
                return
            }

            // 下架、全部库存不足、部分库存不足 弹窗
            if ([2, 3, 4].includes(data?.state)) {
                // 过滤出异常商品
                data.productList.forEach(product => {
                    let p = this.findBySku(this.flatProductList, product.sku);
                    Object.assign(product, p);
                })

                this.no_good_info = data;

                this.store_show_no_good = true;
                this.$refs.noGoodRef.open();
            } else {
                uni.showToast({
                    title: res.data?.stateValue || res.msg,
                    icon: 'none'
                })
            }

        },

        findBySku(collection, sku){
            let index = collection.findIndex(product => product.sku == sku);
            if(index > -1){
                return collection[index];
            }

            return null
        },
        //显示优惠券弹窗
        select_couponList(){
            this.$refs.couponPopup.open();
        },
        //关闭优惠券弹窗
        closeCouponPop(){
            this.$refs.couponPopup.close();
        },
        //点击优惠券确定
        couponConfirm(){
            this.$refs.couponPopup.close();
        },
        //切换优惠券类别
        changeCouponClass(index){
            this.currentIndex = index
        },
        //显示优惠卷规则
        showCouonContent(){
            uni.showModal({
                confirmColor: '#f30300',
                cancelColor: '#999',
                title: '优惠券使用帮助',
                content: this.intRuleList[4],
                showCancel:false,
                confirmText:'关闭',
                confirmColor:"#3c76ff"
            })
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
            if (this.redpacketList.length>0) {
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
        //切换运费券类别
        changeExpressCouClass(index){
            this.currentIndex1 = index
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
                let tempLinkInfo = item.linkInfo.replace(/wx_url/g,"url");
                let skipUrl={};
                try {
                    skipUrl=JSON.parse(tempLinkInfo);
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
            // params.storeId=item.storeId
            // if (item.linkInfo != null){
            //     this.$Router.push({
            //         path: '/views/coupon/list/index',
            //         query: {
            //             source: 'coupon',
            //             ...params
            //         }
            //     })
            // } else {
            this.$Router.push({
                path: '/views/goods/list/index',
                query: {
                    source: 'coupon',
                    ...params
                }
            })

            // }
    
        },
        useInitData(){
            this.resetState({clearCouponCode: false});
            this.currentPlatformCouponCode = '';

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
		/*
		* 返回一个数字的整数和小数
		* number 需要处理的数据
		* type: 要获取的数据 int 整数  decimal 小数
		*/
		getHandlePartNumber(number, type){
			return getPartNumber(number, type);
		},
        showFreightDetail(info,storeId) {
            if (info.state == 1 && !(info.lowerAmount == -1 || info.originFreight == 0)) {
                this.setExpressFee(storeId);
                this.$refs.expressRulesPopup.open();
            }
        },
        setExpressFee(storeId){
            if (this?.allData?.storeGroupList) {
                this.currentStoreInfo = this.allData.storeGroupList.filter(item => {
                    return item.storeId == storeId
                })[0]
            }
        },
        showExpressFeeRule(storeId){
            this.setExpressFee(storeId);
            this.$refs?.expressTip.open();
        },
        close_expressRules() {
            this.$refs.expressRulesPopup.close();
        }
    },
    filters:{
        // 优惠劵为整数则补两位小数
        addDecimalPoint(value){
            if (value.length&&value%1==0){
                value=value+'.00'
            }
            return value
        }
    }
}
</script>

<style lang="scss" scoped>
@import './confirmOrder.scss';
</style>
