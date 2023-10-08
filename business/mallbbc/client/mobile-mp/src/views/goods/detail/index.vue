<!-- 商品详情页 -->
<template>
	<view class="detail_wrapper" @click="resetSomeStatus">
        <w-loading ref="loading"></w-loading>
        <!-- 顶部固定空白 -->
        <view class="fix_blank" :style="{height: fix_blank_height}"></view>

        <!-- 透明遮罩层 -->
        <view class="mask" @click="showNavMenu = false" v-if="showNavMenu"></view>

        <!-- 顶部导航栏 -->
        <u-navbar title="商品详情" :bgColor="bgColor">
            <template v-slot:left>
                <view class="navbar_capsule" :style="[navbar_capsule_style]">
                    <u-icon name="home" size="24" color="#222" @click="goHome" v-if="showHome"></u-icon>
                    <text class="iconfont icon_arrow_left" v-else @click="$Router.back()"></text>
                    <view class="line"></view>
                    <u-icon name="list" size="22" color="#222" @click="showNavMenu = !showNavMenu"></u-icon>

                    <view class="menu" v-show="showNavMenu">
                        <view v-for="(item, i) in nav_menu_list" :key="i"
                            @click="navTo(item.path)" 
                            class="menu_item" 
                            :class="[{'menu_line': i < nav_menu_list.length - 1}]">
                            <u-icon :name="item.icon" size="24" color="#222"></u-icon>
                            <text class="item_txt">{{item.value}}</text>
                        </view>
                    </view>
                </view>
            </template>
            <template v-slot:center>
                <view class="input_wrapper" :style="[input_capsule_style]" @click="toSearchPage">
                    <u-icon name="search" size="20" color="#222" ></u-icon>
                    <text class="search_txt">搜索</text>
                </view>
            </template>
        </u-navbar>
        
        <SkeletonDetail v-if="loadingDetail" :mainImage="mainImage"/>

		<view class="container" v-else>
			
			<!-- 图片轮播图dom start -->
			<view class="carousel" :style="{top: fix_blank_height}">
				<swiper class="swiper-box" @change="change" :current="current" :duration="duration">
					<block v-if="goodsData && goodsData.images && goodsData.images.length>0">
						<!-- @click="prviewImage(index)" -->
						<swiper-item class="swiper-item" v-for="(item,index) in goodsData.images" :key="index">
							<view class="image-wrapper" @click="previewImg(index)">
								<image :src="item" class="loaded" mode="aspectFit"></image>
							</view>
						</swiper-item>
					</block>

				</swiper>
				<!-- 这里轮播点用组件，不用自带的 -->
				<customSwiperDot mode="nav" :dotNum="goodsData.images.length" :currentIndex="current" background="rgba(14,14,14,.2)" :swiperDotStyle="{position:'absolute',bottom:'60rpx',right:'30rpx'}"></customSwiperDot>
			</view>

			<view :style="{width:'750rpx',height:(730 + statusBarHeight*2) +'rpx' ,background:'transparent'}" ref="space" id="nav1"></view>

            <!-- 从商品名称开始的下面所有内容 -->
            <view class="max_content_box" :style="{marginTop: showFeatherEntry?'-34rpx':'0'}">
                <!-- 通过商品onSale商品上架状态来显示活动标签dom 因为查询价格的接口如果没有查询到价格 一律按照下架商品处理-->
                <template v-if="onSale">
                    <promotionPrice 
                        :goodsData="goodsData"
                        :attendPromotion="attendPromotion"
                        :priceInfo="goodsPriceInfo"
                        @initGoodsDetail="getGoodsDetail"
                        @updatePromotionInfo="updatePromotionInfo"
                        @clearPromotionInfo="clearPromotionInfo"
                        @initFullDisList="initFullDisList"
                        @promotionDone="promotionDone"
                    />        
                </template>

				<!-- 商品关键信息卡 -->
				<view class="good-key-information-card"  :style="{paddingTop: priceLoading ? '20rpx' : '0'}">
					<!-- 价格部分 -->
					<view class="price-card" v-if="!attendPromotion">
						<!--价格-->
                        <template v-if="!priceLoading">
                            <!-- 展示价格 -->
                            <template v-if="goodsPriceInfo.salePrice">
                                <!-- 有比价 -->
                                <template v-if="isShowJdLable">
                                    <view class="net-price-wrapper">
                                        <view class="net-price-left">
                                            <view class="net-price-box discount-box">
                                                <text class="label">实惠价</text>
                                                <view class="current-price num-font">
                                                    <text>¥</text>
                                                    <text class="price-int">{{getPriceNumber(goodsPriceInfo.salePrice,'int')}}</text>
                                                    <text>{{getPriceNumber(goodsPriceInfo.salePrice,'decimal')}}</text>
                                                </view>
                                            </view>
                                            
                                            <view class="net-price-box">
                                                <image class="vs-icon" :src="vsIcon" mode="" />
                                                <text class="label">京东到手价</text>
                                                <view class="current-price num-font">
                                                    <text>¥</text>
                                                    <text class="price-int">{{getPriceNumber(goodsPriceInfo.supplierReferencePrice,'int')}}</text>
                                                    <text>{{getPriceNumber(goodsPriceInfo.supplierReferencePrice,'decimal')}}</text>
                                                </view>
                                                <view class="separator"></view>
                                                <view @click="showIntroduce" class="compare-price">
                                                    <text class="label">前往京东比价</text>
                                                    <image class="right-btn" :src="rightIcon" />
                                                </view>
                                                
                                            </view>

                                        </view>

                                        <view class="net-price-right">
                                            <view class="current-price num-font">
                                                <text>¥</text>
                                                <text class="price-int">{{getPriceNumber(savePrice,'int')}}</text>
                                                <text>{{getPriceNumber(savePrice,'decimal')}}</text>
                                            </view>
                                        </view>
                                    </view>
                                </template>

                                <!-- 无比价 -->
                                <view class="price-wrapper" v-else>
                                    <view class="current-price num-font">
                                        ¥<span class="price-int">{{getPriceNumber(goodsPriceInfo.salePrice,'int')}}</span>
                                        <span>{{getPriceNumber(goodsPriceInfo.salePrice,'decimal')}}</span>
                                    </view>
                                </view>
                            </template>
                            <!-- 无价格 -->
                            <view class="price-wrapper" v-else>
                                <view class="current-price num-font">
                                    ¥<span class="price-int">暂无报价</span>
                                </view>
                            </view>
                        </template>
					</view>

					<!-- 优惠和活动 -->
					<!-- <view class="discount-activity">
						<view class="discount-list">
							<view class="discount-wrapper" v-for="(item,index) in discountList" :key="index">
								{{`满${item.full}减${item.reduce}`}}
								<view class="circle left_circle"></view>
								<view class="circle right_circle"></view>
							</view>
						</view>

						<view class="activity-button">
							<span>活动</span>
							<span></span>
						</view>
					</view> -->

                    <!-- 优惠标签组件 -->
                    <!-- 第一阶段：只更改优惠标签的样式，然后初步制订了规则。 -->
                    <!-- 规则：优惠券和满优惠只显示面额最大的，满优惠中满减打折的暂不显示，有且只各显示一个，后续还有免息、积分项需要展示，等待接口后续完善再改 -->
                    <view class="good-info-box" :class="isShowJdLable ? '' : 'no-jd-label'">
                        <view :class="{preferential:onSale && attendPromotion}" v-if="couponIconList.length>0 || fullPreferentialIconList.length>0">
                            <preferential
                            iconSize="large"
                            :couponList="couponIconList"
                            :fullList="fullPreferentialIconList"
                            >
                            <!-- 右部插槽：领券按钮 -->
                            <template #right>
                                <view class="right_content" @click="authProxyHandler(showPanel, couponIconList.length)">
                                    {{
                                        couponIconList.length > 0 ? '领券' : fullPreferentialIconList.length > 0 ? '优惠' : ''
                                    }}
                                </view>
                            </template>
                            </preferential>
                        </view>
                        
                        
                        <!-- 商品名称  @longpress.stop="showCopyPanel" 暂时屏蔽掉商品名称复制的功能-->
                        <view class="good-name">
                            <tagIcon class="tag-icon" v-if="isShowJdLable" :iconArr="[{ businessType: 'discount', iconType: 'detailText' }]" />
                            <text class="sku-name">
                                {{ goodsData.skuName || '' }}
                            </text>
                            <view class="showMaskBox showMaskSkuBox" v-if="is_show_maskNum">
                                <view class="showMask" @click="copyStr(goodsData.skuName)">复制
                                    <view class="sanjiao"></view>
                                </view>
                            </view>
                        </view>

                        <!-- 商品编号 2023/02/15 屏蔽掉商品编号 因为商品编号前端加了很多字母 怕用户以为乱码-->
                        <view v-if="false" class="good-code-purchase-time">
                            <view class="good-code" v-if="goodsData.sku" @longpress.stop="showCopyPanel">商品编号：{{goodsData.sku}}
                                <view class="showMaskBox showMaskSkuBox" v-if="is_show_maskNum">
                                    <view class="showMask" @click="copyStr(goodsData?goodsData.sku:'')">复制
                                        <view class="sanjiao"></view>
                                    </view>
                                </view>
                            </view>
                        </view>

                    </view>
				</view>
                <view class="goods_operator_con">
                    <view class="goods_operator">
                        
                        <!--分享-->
                        <view class="collect-enjoy">
                            <view class="enjoy">
                                <button class="share_btn" open-type="share">
                                    <view class="iconshare"></view>
                                    <text>分享</text>
                                </button>
                            </view>
                        </view>
                        <!-- 收藏 -->
                        <view class="flex_row_start_center collection" @click="authProxyHandler(collectGoods)">
                            <view class="collectIcon" v-if="goodsData.follow" :class="{collectedIconMove:goodsData.follow ,collectedIcon:!goodsData.follow}"></view>
                            <view class="collectIcon noCollectIcon" v-else></view>
                            <view class="text">{{goodsData.follow ? '已收藏' : '收藏'}}</view>
                        </view>
                        <!-- 要优惠 -->
                        <view class="flex_row_start_center demandDiscount">
                            <view class="follow_discount_tip" v-if="followDiscountLoading && showFollowDiscount"></view>
                            <view @click="authProxyHandler(followDiscount)" class="follow_discount flex_row_start_center">
                                <view class="money_image" ></view>
                                <text class="text">要优惠</text>
                            </view>
                        </view> 
                    </view>
                </view>
                <!-- 赠品 start -->
                <view class="gift-container" v-if="showDiscount">
                    <view class="gift" :style="{borderRadius: showFeatherEntry ? '20rpx 20rpx 0px 0px' : '20rpx'}">
                        <view class="good-gift-choose">
                            <view class="gift_title">优惠</view>
                            <view class="gift_right_content">
                                <view class="gift_content" @click="showGiftModel('gift')" v-if="giftObj.giftList&&giftObj.giftList.length>0">
                                    <text class="gift_content_icon">赠品</text>
                                    <text class="gift_content_text">{{giftObj.giftList[0].name}}</text>
                                    <image :src="rightArrowGray" class="gift_right"></image>
                                </view>
                                <view class="gift_content" @click="showGiftModel('attachment')" v-if="giftObj.attachmentList&&giftObj.attachmentList.length>0">
                                    <text class="gift_content_icon">附件</text>
                                    <text class="gift_content_text">{{giftObj.attachmentList[0].name}}</text>
                                    <image :src="rightArrowGray" class="gift_right"></image>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
                <!-- 赠品 end -->

				<!-- 活动 start -->
                <view class="activity-container" :style="{paddingBottom: showFeatherEntry? 0: '20rpx'}">
                    <view class="activity" v-if="(couponList && couponList.length > 0)||(fullDisList && fullDisList.length > 0)">
                        <view class="activity_left">
                            <view class="activity_coupons_tips">活动</view>
                        </view>
                        <view class="activity_right">
                            <!-- 领券 start -->
                                <view class="activity_coupons" v-if="couponList && couponList.length > 0" @click.prevent="authProxyHandler(openCouponModel)">
                                    <view class="activity_coupons_left">
                                        <view class="activity_coupons_center">
                                            <text class="activity_coupons_title">领券</text>
                                            <view class="activity_coupons_list">
                                                <template v-for="(item,index) in couponList">
                                                    <view class="activity_coupons_pre flex_row_center_center"
                                                        v-if="index < 2" :key="index">
                                                        {{item.couponContent}}
                                                    </view>
                                                </template>
                                            </view>
                                        </view>
                                    </view>
                                    <view class="activity_conpons_right">
                                        <image :src="rightArrowGray" mode=""></image>
                                    </view>
                                </view>
                            <!-- 领券 end -->
                            <!-- 满优惠 start -->
                                <view class="activity_full" v-if="fullDisList && fullDisList.length > 0" @click="openFullDisModel">
                                    <view class="full_discount" v-for="(item, index) in fullDisList" :key="index">
                                        <text class="full_discount_title">满减</text>
                                        <view class="full_discount_list">
                                            <block v-for="(item1, index1) in item.extendInfoList" :key="index1">
                                                <rich-text :nodes="formatePromotionDes(item1, item)"></rich-text>
                                            </block>
                                        </view>
                                    </view>
                                </view>
                            <!-- 满优惠 end -->
                        </view>
                    </view>
                </view>
                <!-- 活动 end -->

                <!-- 鹅毛情 start -->
                <view class="emaoqing" v-if="showFeatherEntry">
                    <giveGiftEntry @click="authProxyHandler(showSpecModel,'buy','custom')" :customGiftFlag="!(disabledOperate)"></giveGiftEntry>
                </view>
                <!-- 鹅毛情 end -->

				<!-- 规格卡和服务内容 start -->
                <view class="discount-specifications-con">
                    <view class="discount-specifications" :style="{marginTop: showFeatherEntry ? '-20rpx' : 0}">
                        <view class="spec_con" @click="showSpecModelPop()" :style="{borderRadius:(showDiscount||!!ifcApplyUrl)?'0rpx':'10px'}">
                            <view class="spec_left">
                                <view class="spec_left_title">已选</view>
                                <view class="spec_left_content" v-if="goodsData.specValues">
                                    {{goodsData.specValues}}, {{currentSpecNum}}件
                                </view>
                                <view class="spec_left_content" v-else>默认</view>
                            </view>
                            <image :src="rightArrowGray" class="spec_right"></image>
                        </view>
                    </view>
                </view>
				
                <!-- 发货地址及运费 start -->
                <expressDelivery :goodsData="goodsData" :choosedAddress="choosedAddress" @getAddressInfo="getAddressInfo" :promiseTime="promiseTime"></expressDelivery>
                <!-- 发货地址及运费 end -->

				<!-- 服务tips start -->
                <view v-if="serviceLabels && serviceLabels.length > 0" class="service-container">
                    <view class="service">
                        <view class="service_con">
                            <template v-for="(item, index) in serviceLabels">
                                <view class="service_pre" :class="item.iconClass" v-if="!!item.name" :key="index">
                                    <view class="iconBg" v-if="item.name === '京东物流' || item.name === '厂家配送'"><image mode="widthFix" :src="airplaneImg" /></view>
                                    <text>{{ item.name }}</text>
                                </view>
                            </template>
                        </view>
                    </view>
                </view>
				
                <!-- 服务tips end -->

				<!-- 店铺 start -->
                <view class="shop-con">
                    <view class="shop">
                        <!-- Todo 根据需求 9007 与产品 梁杰斌 核对后 为了减弱过多交互对用户的影响 暂时进行屏蔽处理 2021.11.30-->
                        <!-- <view class="shop_des" @click="goShopHome()"> -->
                        <view class="shop_des">
                            <view class="shop_des_image">
                                <view class="ownStoreLogo" v-if="storeInfo.storeId=='6'"></view>
                                <image :src="storeInfo.storeLogo" mode="" class="" v-else></image>
                            </view>
                            <view class="shop_des_con">
                                <view class="shop_con_title">{{storeInfo.storeName}}</view>
                                <view class="shop_con_type">
                                    <view class="shop_type" v-if="storeInfo.ownShop == 1">自营</view>
                                    <view class="shop_follow_num" v-if="false">
                                        {{storeInfo.followNumber ? storeInfo.followNumber : 0 }}人关注
                                    </view>
                                </view>
                            </view>
                        </view>
                        <view class="shop_des_list" v-if="storeInfo.descriptionScore">
                            <view class="shop_des_pre">
                                <text>描述相符</text>
                                <view class="shop_des_pre_score">
                                    <text>{{filters.toFixNum(storeInfo.descriptionScore,1)}}分</text>
                                    <image
                                        :src="storeInfo.descriptionScore > 4 ? this.iconGaoImage : storeInfo.descriptionScore < 2 ? this.iconDiImage : this.iconZhongImage"
                                        mode=""></image>
                                </view>
                            </view>
                            <view class="shop_des_pre">
                                <text>服务态度</text>
                                <view class="shop_des_pre_score">
                                    <text>{{filters.toFixNum(storeInfo.serviceScore,1)}}分</text>
                                    <image
                                        :src="storeInfo.serviceScore > 4 ? this.iconGaoImage : storeInfo.serviceScore < 2 ? this.iconDiImage : this.iconZhongImage"
                                        mode=""></image>
                                </view>
                            </view>
                            <view class="shop_des_pre">
                                <text>发货速度</text>
                                <view class="shop_des_pre_score">
                                    <text>{{filters.toFixNum(storeInfo.deliverScore,1)}}分</text>
                                    <image
                                        :src="storeInfo.deliverScore > 4 ? this.iconGaoImage : storeInfo.deliverScore < 2 ? this.iconDiImage : this.iconZhongImage"
                                        mode=""></image>
                                </view>
                            </view>
                        </view>
                        <!-- Todo 根据需求 9007 与产品核对后 为了减小过多交互操作对用户的影响 暂时进行屏蔽处理 -->
                        <view class="shop_links" v-if="false">
                            <image :src="imgUrl + 'goods/go_store.png'" mode="" @click="goShopHome()"></image>
                        </view>
                    </view>
                </view>
				<!-- 商品详情 start -->
				<view class="detail-desc" id="nav4">
					<view class="spec_param" v-if="goodsParameterList && goodsParameterList.length > 0">
						<view class="spec_param_title">
							<view class="redLine"></view>
							<text>规格参数</text>
						</view>
						<view class="spec_param_list" :class="{open_param:openGoodsParam}">
							<view class="spec_param_pre" v-for="(item,index) in goodsParameterList" :key="index">
								<view>{{item.parameterName}}</view>
								<view>{{item.parameterValue}}</view>
							</view>
						</view>
						<view class="spec_param_fold" @click="handleGoodsParam" v-if="goodsParameterList.length > 5">
							<text>{{openGoodsParam ?"收起" :"展开"}}</text>
							<text class="iconfont" :class="openGoodsParam ?'icon_arrow_up':'icon_arrow_down'"></text>
						</view>
					</view>
					<view class="detail-desc_title params_html_title" v-if="(goodsData && (goodsData.params))">
						<view class="redLine"></view>
						<text>商品参数</text>
					</view>
					<view class="params_html" v-if="goodsData && (goodsData.params)">
						<table cellpadding="0" cellspacing="1" width="100%" border="0" class="Ptable">
							<tbody v-for="(item, _index) in showGoodsDataParamsList" :key="_index">
								<tr v-if="item.isGroup" class="bold">
									<th colspan="2">{{item.groupName || ''}}</th>
								</tr>
								<tr class="wxflex" v-else :key="_index">
									<td>{{item.name || ''}}</td>
									<td>{{item.values.join('') || ''}}</td>
								</tr>
							</tbody>
						</table>
                        <!-- 展开/收起按钮 -->
                        <view class="spec_param_fold" @click="handleGoodsDataParam" v-if="goodsDataParamsList.length > 6">
							<text class="fold_name">{{openGoodsDataParams ?"收起" :"展开"}}</text>
							<text class="iconfont" :class="openGoodsDataParams ?'icon_arrow_up':'icon_arrow_down'"></text>
						</view>
					</view>
					<view class="detail-desc_title">
						<view class="redLine"></view>
						<text>商品详情</text>
					</view>
					<view class="detail_introduction">
                        <view class="detail_introduction_item" v-for="(item, index) in detailImgList" :key="index">
                            <image :src="item" mode="widthFix"></image>
                        </view>
					</view>
					<view class="detail-desc_title" v-if="goodsData && goodsData.wareQD">
						<view class="redLine"></view>
						<text>商品包装</text>
						<view class="detail-line"></view>
					</view>
					<view class="wareQD_html" v-if="goodsData&&goodsData.wareQD">
						<rich-text :nodes="getNodes(goodsData.wareQD)" class="bz_html"></rich-text>
					</view>
					<view class="detail-desc_title" v-if="judgeShowPriceRule()">
						<view class="redLine"></view>
						<text>价格说明</text>
						<view class="detail-line"></view>
					</view>
					<view class="priceRuleWrap" v-if="judgeShowPriceRule()">
						<rich-text :nodes="getNodes(priceRule)" class="bz_html"></rich-text>
					</view>
			    </view>

				<!-- 底部提示 -->
				<view class="noMore">
					<view class="tips"></view>
					<view class="text">到底啦</view>
					<view class="tips"></view>
				</view>
			</view>
			<!--  底部区域 start -->
            <view :class="['bottomArea','centered_around',iosHairPhone ? 'iosBottomPadding' : 'androidBottomPadding']">
                <!-- 库存下架，无货，区域销售 等相关遮罩层提示 start-->
                <statetips
				    v-if="!onSale || !hasStock || !areaLimit"
                    :stopSales="onSale"
                    :hasStock="hasStock"
                    :areaLimit="areaLimit"
                />
                <!-- 巨拾惠 -->
                <!-- 底部操作菜单 btn_emq_home.svg start -->
                <view class="page_bottom" v-if="isJushihuiApp">
                    <view class="leftIcon flex_row_around_center">
						<btn-customer class="btn-customer" :showCard="true" :title="goodsData.skuName" :name="'['+sku+']'"
                            :path='`/views/goods/detail/index?sku=${sku}`'
                            :image="goodsData.mainImage">
							<view class="btn-content">
								<image class="icon" :src="kefuImage"></image>
								<text class="btn-txt">客服</text>
							</view>
                        </btn-customer>
                        <view @click="gotoCart" class="p_b_btn" v-if="isJushihuiApp">
                            <text class="iconfont icon_cart fontScaleIgnore"></text>
                            <text class="show_text">购物车</text>
                            <text class="cart_num" v-if="cartNum > 0">{{cartNum > 99 ? '99+' : cartNum}}</text>
                        </view>
                        <view @click="authProxyHandler(showSpecModel, 'buy','custom')" class="p_b_btn" v-if="showFeatherEntry">
                            <text class="iconfont icon_icon_common_songli fontScaleIgnore"></text>
                            <text class="show_text">送礼</text>
                        </view>
                    </view>
                    <!--商品已下架 start -->
                    <view class="action_btn_group_jushihiu" v-if="goodsData.state != 1">
                        <button type="primary" class="action_btn not_stock flex_row_center_center fontScaleIgnore">商品已下架</button>
                    </view>
                    <!--商品已下架 end -->

                    <!--库存不足start -->
                    <view class="action_btn_group_jushihiu"
                        v-else-if="!hasStock">
                        <button type="primary" class="action_btn not_stock flex_row_center_center fontScaleIgnore"
                            @click="authProxyHandler(showSpecModel)">库存不足</button>
                    </view>
                    <!--库存不足 end -->

                    <!-- 一起买 -->
                    <view class="action_btn_group_jushihiu" :class="{disable: !!disabledOperate}" v-else-if="attendECBuying">
                        <view type="primary" class="action_btn ecbuy_btn flex_row_center_center fontScaleIgnore"
                            @click="authProxyHandler(showSpecModel)">一起买</view>
                    </view>
                    
                    <!-- 普通商品 start -->
                    <view class="action_btn_group_jushihiu" :class="{disable: !!disabledOperate}" v-else>
                        <view type="primary" class="action_btn add_cart_btn flex_row_center_center fontScaleIgnore"
                            @click="authProxyHandler(showSpecModel, 'add')">加入购物车</view>
                        <view type="primary" class="action_btn buy_now_btn flex_row_center_center fontScaleIgnore"
                            @click="authProxyHandler(showSpecModel,'buy')">立即购买</view>
                    </view>
                    <!-- 普通商品 end -->
                </view>
             
                <!-- 底部操作菜单 end -->
            </view>
		</view>

		<!-- 规格弹框 start -->
		<bottomPopup ref="specModel" type="bottom" height="calc(100vh - 256rpx)" :showTitle="false" class="spec_model">
			<view class="spec_model_con">
				<view class="spec_model_content" :class="{android_spec_content: !iosHairPhone}">
                    <view class="spec_model_top_bg"></view>
					<view class="spec_model_top">
						<view class="spec_model_goods">
							<view class="spec_goods_image"
								v-if="goodsData && goodsData.images && goodsData.images[0]">
								<image :src="goodsData.images[0]" mode="aspectFit"></image>
							</view>

							<view class="spec_goods_right">
								<view class="spec_goods_price_con">
									<view class="spec_prices" :class="{hide: priceLoading}">
										<!-- 正常商品start -->
										<view class="spec_goods_price num-font" v-if="goodsPriceInfo.salePrice">
											<text>￥</text>
											<text>{{getPriceNumber(goodsPriceInfo.salePrice,'int')}}</text>
											<text>{{getPriceNumber(goodsPriceInfo.salePrice,'decimal')}}</text>
										</view>
										<!-- 正常商品end -->
										<!-- 无价格的商品start -->
										<view class="spec_goods_price num-font" v-else>
											<text>￥</text>
											<text>暂无报价</text>
										</view>
										<!-- 无价格的商品end -->
									</view>
								</view>
								<!-- 已下架商品 start -->
								<view class="spec_goods_des" v-if="goodsData.state!=1">
									商品已下架
								</view>
								<!-- 已下架商品 end -->
								<!-- 普通商品 start -->
                                <block v-else>
                                    <view class="spec_goods_des">
                                        已选规格：
                                        <text
                                            v-if="goodsData.specValues">{{goodsData.specValues}}</text>
                                        <text v-else>默认</text>
                                    </view>
                                    <view class="spec_goods_num">
                                        已选数量：
                                        <text>*{{currentSpecNum}}</text>
                                    </view>
                                </block>
								
								<!-- 普通商品 end -->
							</view>
						</view>

					</view>

                    <!-- 地址信息 -->
                    <view class="address_info" @click="showAddressList" v-if="choosedAddress.telMobile && choosedAddress.memberName">
                        <img
                            src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_weizhi.svg"
                            mode="scaleToFill"
                        />
                        <view class="address_detail">
                            <view class="detail">{{`${choosedAddress.detailAddress}`}}</view>
                            <view class="contact_people" v-if="choosedAddress.telMobile">{{`${choosedAddress.memberName} ${choosedAddress.telMobile}`}}</view>
                        </view>
                        <img src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_rightarrow_gray.svg" class="skip_icon" />
                    </view>

					<!-- 当有区域销售和无货的时候，此时样式需要特殊处理 -->
					<scroll-view scroll-y="true" class="spec_content" :class="{disable: !!disabledOperate, android_spec_content: !iosHairPhone}">
						<view class="spec_list" v-if="specs && specs.length > 0">
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
								购买数量
								<text v-if='goodsData.lowestBuy>1'>{{goodsData.lowestBuy}}件起购</text>
							</view>
							<view class="spec_num_right">
								<text @click="editNum('reduce')" :class="{no_edit:currentSpecNum<=goodsData.lowestBuy}">-</text>
								<input type="number" v-model="currentSpecNum" @blur="editNum('blur', $event)" @input="editNum('edit', $event)" maxlength="3" class="inputBox"
									cursor-spacing="0" :cursor="currentSpecNum.toString().length" />
								<text @click="editNum('add')" :class="{no_edit:noAdd}">+</text>
							</view>
						</view>
					</scroll-view>
				</view>
				
				<template>
					<!-- 规格弹框的底部按钮 start -->

					<block>
						<!-- 商品下架 start -->
						<view :class="['spec_btn',iosHairPhone ? 'iosBottomPadding' : 'androidBottomPadding']" v-if="goodsData.state!=1">
							<button type="primary" class="spec_not_stock spec_btn_only">商品已下架</button>
						</view>
						<!-- 商品下架 end -->
						<!--库存不足 start -->
						<view :class="['spec_btn',iosHairPhone ? 'iosBottomPadding' : 'androidBottomPadding']"
							v-else-if="!hasStock">
							<button type="primary" class="spec_not_stock spec_btn_only">库存不足</button>
						</view>
						<!--库存不足 end -->
                        <!-- 一起买 -->
                        <view :class="['spec_btn',!!disabledOperate ? 'disable' : '',iosHairPhone ? 'iosBottomPadding' : 'androidBottomPadding']"  v-if="showSpecModelType == '' && attendECBuying">
                            <button class="spec_buy_btn spec_btn_only" @click="authProxyHandler(buy)">一起买</button>
                        </view>

						<!-- 普通商品 start-->
						<block v-else>
							<view :class="['spec_btn',!!disabledOperate ? 'disable' : '',iosHairPhone ? 'iosBottomPadding' : 'androidBottomPadding']"  v-if="showSpecModelType == ''">
								<button class="spec_add_cart_btn" @click="authProxyHandler(addCart)">加入购物车</button>
								<button class="spec_buy_btn" @click="authProxyHandler(buy)">立即购买</button>
							</view>
							<view :class="['spec_btn',!!disabledOperate ? 'disable' : '',iosHairPhone ? 'iosBottomPadding' : 'androidBottomPadding']" v-if="showSpecModelType == 'add'">
								<button class="spec_add_cart_btn spec_btn_only" @click="authProxyHandler(addCart)">加入购物车</button>
							</view>
							<view :class="['spec_btn',!!disabledOperate ? 'disable' : '',iosHairPhone ? 'iosBottomPadding' : 'androidBottomPadding']" v-if="showSpecModelType == 'buy'">
								<button class="spec_buy_btn spec_btn_only" @click="authProxyHandler(buy)">立即购买</button>
							</view>
						</block>

						<!-- 普通商品 end-->
					</block>
				</template>

			</view>
			<!-- 规格弹框的底部按钮 end -->
		</bottomPopup>

		<!-- 地址选择的弹窗 start -->
		<bottomPopup ref="addressChooseComp" type="bottom" showType="show" text="配送地址" height="832rpx">
			<addressChoose ref="addressChoose"
				v-model="choosedAddress"
				:useLocation="true"
				@close="addressPopClose"
				:isOpen="true"
			/>
		</bottomPopup>
		<!-- 地址选择的弹窗 end -->

        <!-- 赠品和附件的弹窗 start -->
        <bottomPopup ref="giftModel" type="bottom" text="优惠" conBackground="#fff" height="980rpx">
            <view class="gift_model-content-box">
                <view class="title">
                    <text class="title-name">{{giftPopType}}</text>
                </view>
                <view class="gift-list">
                    <scroll-view scroll-y="true" style='height:100%;'>
                        <ul>
                            <li v-for="(item, index) in giftPopList" :key="index">
                                <view class="top-content box">
                                    <text class="content">{{item.name}}<text v-if="!!item.requirement">(条件: {{item.requirement}}，赠完即止)</text></text>
                                </view>
                                <view class="num box">x{{item.num}}</view>
                            </li>
                        </ul>
                    </scroll-view>
                </view>
            </view>
        </bottomPopup>
        <!-- 赠品和附件的弹窗 end -->	

		<!-- 优惠券弹框 start -->
		<bottomPopup ref="couponModel" type="bottom" text="领取优惠券">
			<view class="coupon_model">
				<scroll-view :class="['coupon_model_list',iosHairPhone ? 'iosBottomPadding' : 'androidBottomPadding']" scroll-y="true">
					<view class="my_coupon_pre" v-for="(item,index) in couponList" :key="index">
						
						<view class="coupon_pre_top">
							<view class="coupon_pre_left fontScaleIgnore">
								<!-- 固定券 start -->
								<view class="coupon_pre_price" v-if="item.couponType == 1">
									<text class="unit num-font" :style="{fontSize:fitfontSize['small'][item.publishValue.toString().length]}">¥ </text>
									<text class="price_int num-font" :style="{fontSize:fitfontSize['big'][item.publishValue.toString().length]}">{{item.publishValue}}</text>
								</view>
								<!-- 固定券 end -->
								<!-- 折扣券 start -->
								<view class="coupon_pre_price" v-if="item.couponType == 2">
									<view class=""></view>
									<text
										class="price_int num-font">{{filters.toSplit(filters.toFixNum(item.publishValue,1))[0]}}</text>.
									<text
										class="price_decimal num-font">{{filters.toSplit(filters.toFixNum(item.publishValue,1))[1]}}</text>
									<text class="price_decimal">折</text>
								</view>
								<!-- 折扣券 end -->
								<!-- 随机券 start -->
								<view class="coupon_pre_price" v-if="item.couponType == 3" :style="{fontSize:getRandomSmallFontSize(item)}">
                                    <text class="unit num-font">¥ </text>
                                    <text class="price_int num-font" :style="{fontSize:getRandomFontSize(item)}">{{getPriceNumber(item.randomMin,'int')}}</text>
                                    <text class="price_decimal num-font" v-if="getPriceNumber(item.randomMin,'decimal')!='.00'">{{getPriceNumber(item.randomMin,'decimal')}}</text>
                                    <text class="unit">~</text>
                                    <text class="unit num-font">¥ </text>
                                    <text class="price_int num-font" :style="{fontSize:getRandomFontSize(item)}">{{getPriceNumber(item.randomMax,'int')}}</text>
                                    <text class="price_decimal num-font" v-if="getPriceNumber(item.randomMax,'decimal')!='.00'">{{getPriceNumber(item.randomMax,'decimal')}}</text>
                                </view>
								<!-- 随机券 end -->
								<view class="coupon_pre_active" :style="{fontSize:fitfontSize['active'][item.couponContent.length]}">{{item.couponContent}}</view>
							</view>
							<view class="coupon_pre_cen">
								<view class="coupon_pre_title">{{item.couponName}}</view>
								<view class="coupon_pre_time lineH16" v-if="item.publishStartTime.indexOf(':')==-1">{{item.publishStartTime}}~{{item.publishEndTime}}</view>
								<view class="coupon_pre_time lineH12" v-else>
									<view>{{item.publishStartTime}}~</view>
									<view>{{item.publishEndTime}}</view>
								</view>
								<view class="coupon_pre_rules" @click="descriptionOpen(item.couponId)">
									<text>使用规则</text>
									<image :src="item.isOpen ? upTriangleImage : downTriangleImage"
											mode="" draggable="false"></image>
								</view>
							</view>
							<view class="kacao kacao1" v-if="item.receivedState != 3 || item.notUseCount!=0" :class="{kacao1_notUse:item.publishStartTime.indexOf(':')==-1}"></view>
							<view class="kacao kacao2" v-else :class="{kacao2_haveExpired:item.publishStartTime.indexOf(':')==-1}"></view>
							<view class="coupon_pre_right">
								<view v-if="item.receivedState == 1" class="coupon_right haveReceived">
									<view class="coupon_progress" v-if="item.receivedState == 1">
										已抢{{item.robbedRate}}%
										<view class="progress_con">
											<progress :percent="item.robbedRate" stroke-width="3" activeColor="#FFFFFF"
												backgroundColor="rgba(255,255,255,0.5)" borderRadius='2px' />
										</view>
									</view>
									<view @click="goReceive(item)">立即领取</view>
								</view>
								<view v-else-if="item.receivedState == 2" class="coupon_right haveNotUse">
									<view>已领取</view>
									<view @click="goGoodsList(item)">去使用</view>
								</view>
								<view v-else class="coupon_right haveExpired">
									<view v-if="item.notUseCount == 0">
										<image src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/coupon/icon_common_yiqiangwan.svg" mode="" draggable="false" />
									</view>
									<view v-else class="coupon_right haveNotUse">
										<view>已领取</view>
										<view @click="goGoodsList(item)">去使用</view>
									</view>
								</view>
							</view>
						</view>

						<view class="coupon_rules" v-if="item.isOpen == true">
							<view>优惠券类型：<text class="coupon_type_text">【{{item.storeId==0?'平台优惠券':'店铺优惠券'}}】</text></view>
							<view class="coupon_rules_title"><text>{{item.description}}</text></view>
						</view>
						<view class="coupon_type fontScaleIgnore" :class="{suiji:item.couponType==3,zhekou:item.couponType==2}">{{item.couponTypeValue}}</view>
					</view>
				</scroll-view>
			</view>
		</bottomPopup>
		<!-- 优惠券弹框 end -->	

        <!-- 满优惠弹框 start -->
		<bottomPopup ref="fullDisModel" type="bottom" text="满减">
			<view class="fulldis_model">
				<scroll-view class="fulldis_model_list" scroll-y="true">
					<view v-for="(item,index) in fullDisList" :key="index">
						<view class="fulldis_model_pre" v-for="(item1,index1) in item.extendInfoList" :key="index1">
							<view class="fulldis_pre_tips"></view>
							<view class="fulldis_pre_con">
								<rich-text :nodes="formatePromotionDes(item1, item)"></rich-text>
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="full_dis_tips">
					以上优惠仅为初步预估，实际以结算最终价格为准！
				</view>
			</view>
		</bottomPopup>
		<!-- 满优惠弹框 end -->
		
        <!-- 登录弹窗 start-->
        <bottomPopup ref="authPopup" type="bottom" height="auto" :showTitle="false" conBackground="#fff">
            <AuthComp @confirm="confirm" @cancel="cancel" />
        </bottomPopup>
        <!-- 登录弹窗 end -->

        <TimelineMask v-if="showTimeLineMask"/>

        <!-- 生成微信分享图片image的海报 -->
        <poster 
            v-if="postlist && postlist.length" 
            :list="postlist" 
            background-color="#FFF" 
            :width="400" 
            :height="320"
            ref="poster"
            @on-success="posterSuccess" 
            @on-error="posterError"
        >
        </poster>
        <!-- 遮罩层-->
        <view v-if="showFollowDiscount" class="yindao_mask" @click="clickPageView" @touchstart="clickPageView"></view>
        
        <!-- 要优惠弹窗 -->
        <Toast class="toast" v-if="isShowFollowDiscountToast" :mask="true">
            <template #toast-icon>
                <image src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/goods/icon_setp_sel3_white.svg"></image>
            </template>
            <template #toast-title>已收到您的反馈</template>
            <template #toast-body>商品有优惠活动我们将第一时间通知您！</template>
        </Toast>
        
        <!-- 去比价引导弹窗 -->
        <uniPopup ref="introducePopup" bgColor="transparent">
            <view class="popup_box">
                <view class="title">
                    <image mode="heightFix" :src="introduceVSImg" />
                    <image class="close" mode="heightFix" @click="$refs.introducePopup.close()" src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/close.png"></image>
                </view>
                <view class="content">
                    <image :src="introduceImg" mode="widthFix" />
                </view>
                <view class="bottom">
                    <view class="copy-btn" @click="copyStr(goodsData && goodsData.sku ? String(goodsData.sku).replace(/[^\d]/g, '') : '', 'bijia')">
                        复制商品编号
                    </view>
                </view>
            </view>
        </uniPopup>
	</view>
</template>

<script module="filters" lang="wxs" src="@/utils/filter.wxs"></script>
<script>
    import TimelineMask from '@/common/components/timeline-mask/index';
    import AuthComp from '@/common/components/auth/auth-comp';
    import Toast from '@/views/components/toast/toast';
    import { promotionEnum } from '@/common/lib/enum/promotion';
    import promotionPrice from "@/views/components/promotion/index.vue" 
    import shareMixin from '@/common/mixin/share';
	import giveGiftEntry from '@/views/components/gift/give_gift_entry';
	import BtnCustomer from '@/common/components/button/btn-customer';
    import customSwiperDot from '@/common/components/swiper-dot/index.vue'; // 轮播点组件
	import goodsHandler from '@/views/components/goods/handler'; // 商品服务
	import bottomPopup from '@/common/components/uni-popup/uni-popup-bottom.vue'; // 底部弹出层
	import {supplierTypeEnum, priceRule} from '@/common/lib/enum/product'; // 供应商枚举
	import loadingShade from '@/common/components/loading/loading.vue';// 加载组件 
    import tagIcon from '@/common/components/tagIcon'; // 商品图片左下角优惠图标
	import wxGoodsDetailMixin from '@/views/goods/detail/wxGoodsDetailMixin';// 小程序商品详情富文本处理混入
	import { getPartNumber, getStorageSync, isNotEmpty, setStorageSync, isAndroid, skipTo, judgeSceneTimeLine, getLaunchOptions, getAddressFromMap } from '@/utils/common.js'
    import cartMixin from '@/common/mixin/cartMixin'
    import addressChoose from "@/common/components/address/select";
	import stockEnum from '@/common/lib/enum/stock';
	import statetips from "@/views/components/goods/statetips.vue"; // 商品状态提示
	import config from '@/common/lib/config.js';
	import decorateHandler from '@/common/components/decorate/handler';
	import promotionHandler from "@/views/components/promotion/common/handler";
    import { authProxyHandler } from '@/utils/auth/auth.js';
    import systemMixin from '@/common/mixin/system.js'
	import poster from "@/views/components/poster/index.vue"; // 生成海报的组件
	import SkeletonDetail from "@/views/components/goods/skeleton-detail.vue"; // 生成海报的组件
    import personalHandler from "@/views/components/personal/handler";
    import preferential from '@/common/components/preferential/preferential.vue';
    import uniPopup from '@/common/components/uni-popup/uni-popup.vue';
    import expressDelivery from '@/views/components/goods/expressDelivery.vue';
    import orderHandler from '@/views/components/order/handler';
	var weRich = require('we-rich');
    const amapFile = require('@/utils/tool/amap-wx.130.js');
    import { mapMutations} from 'vuex';

	export default {
		name: 'goods-detail',
		mixins:[wxGoodsDetailMixin, cartMixin, shareMixin, systemMixin],
		components:{
			BtnCustomer,
			customSwiperDot,
			bottomPopup,
			loadingShade,
			giveGiftEntry,
			addressChoose,
			statetips,
            promotionPrice,
            AuthComp,
            TimelineMask,
            poster,
            tagIcon,
            Toast,
            preferential,
            uniPopup,
            SkeletonDetail,
            expressDelivery
		},
		data(){
			return {
                loadingDetail: true, // 正在加载详情数据
                mainImage: '',
                upTriangleImage: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/uptriangle2%402x.png',
                downTriangleImage: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_downtriangle2%402x.png',
                kefuImage: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_wode_kefu.svg',
                rightArrowGray: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_rightarrow_gray.svg',
                iconDiImage: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/goods/icon_bnj_di.svg',
                iconGaoImage: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/goods/icon_bnj_gao.svg',
                iconZhongImage: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/goods/icon_bnj_zhong.svg',
                vsIcon: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_VS.svg',
                rightIcon: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_rightarrow2.svg',
                nav_menu_list:[
                    {
                        icon: 'home',
                        value: '首页',
                        path: '/pages/index/index'
                    },
                    {
                        icon: 'search',
                        value: '搜索',
                        path: '/views/search/index'
                    }
                ],
                showNavMenu: false,
                bgColor: 'transparent',
                authKey: 'authed-goods-detail', // 登录授权事件健名
				 
				goodsData: {}, // 商品详情数据
				current: 0, // 轮播图默认显示第一页
				sku: '', // 货品id
				spu: '', // 商品id
                storeId: '', // 店铺id
				goodsParameterList:[], // 规格参数列表
				openGoodsParam: false, // 规格参数超出5行，点击展开，收起
                openGoodsDataParams: false,
				supplierTypeEnum: supplierTypeEnum, // 显示价格说明的供应商枚举
				duration:500, // 轮播切换速度
				currentSpecNum: 1, //当前规格弹框中的购买数量
				storeInfo: {}, //店铺信息
				specs: [], //商品规格列表
				soldOut:false, //是否已下架
				clickCollect:false, //是否点击收藏
				priceRule:priceRule,//价格说明的内容
				goodsPriceInfo: {}, //商品价格相关的信息
				discountList:[
					{
						full:10,
						reduce:2
					},
					{
						full:100,
						reduce:20
					},
					{
						full:500,
						reduce:20
					}
				], // 模拟优惠券数据
				titleBarHeight:0, //titleBar高度
				choosedAddress: {}, //选中的地址对象
				showAddressPop: false, //控制地址右侧弹窗的变量
				preSellInfo: {}, // 预售商品详情信息
				showSpecModelType: '', //规格弹框的底部按钮的显示类型默认：加入购物车及立即购买都有add：加入购物车buy：立即购买nosocket库存不足
				hasStock: true,//该商品是否有库存 true=有库存， false=没有库存
				areaLimit: true, //是否区域可售 true=区域可售， false=区域不可售
                putOn:true,//商品是否上下架state=1上架state=0下架 true=上架，false=下架
				customFlag:false, //点击立即购买是否跳转到定制的（鹅毛情）确认订单页
				compareList:[],// 比价列表信息
				hasPreviewCacheKey: 'hasPreviewedFeather', // 是否用户点击过了解鹅毛情的缓存key
				onSale: true, // 商品是否上下架state=1上架state=0下架 true=上架，false=下架
				giftObj:{},  //赠品相关
                giftPopType:'', //赠品附件类型
                giftPopList:[], //赠品附件的详细值
				couponList: [], //优惠券列表
				fullDisList: [], //满优惠列表
				goReceiveBg: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/coupon/coupon_pre_bg.png', //立即领取背景
                finishReceiveBg: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/coupon/finishReceiveBg.png', //已抢完背景
                hasReceiveBg: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/coupon/hasReceiveBg.png', //已领取背景
                fitfontSize:{
                    'active':{19:'22rpx',20:'22rpx',21:'20rpx',22:'20rpx'},
                    'big':{1:'56rpx',2:'56rpx',3:'56rpx',4:'56rpx',5:'52rpx',6:'48rpx',7:'40rpx',8:'36rpx',9:'32rpx',10:'28rpx',11:'24rpx'},
                    'small':{1:'28rpx',2:'28rpx',3:'28rpx',4:'28rpx',5:'24rpx',6:'24rpx',7:'24rpx',8:'24rpx',9:'24rpx',10:'24rpx',11:'24rpx'},
                    'bigRandom':{1:'56rpx',2:'50rpx',3:'40rpx',4:'30rpx',5:'24rpx',6:'22rpx',7:'22rpx',8:'22rpx'},
                    'smallRandom':{1:'24rpx',2:'24rpx',3:'24rpx',4:'24rpx',5:'24rpx',6:'20rpx',7:'20rpx',8:'20rpx'},
                    'smallRandomInt':{1:'28rpx',2:'28rpx',3:'28rpx',4:'28rpx',5:'24rpx',6:'24rpx',7:'24rpx',8:'24rpx'},
                    'bigRandomInt':{1:'56rpx',2:'56rpx',3:'56rpx',4:'52rpx',5:'40rpx',6:'34rpx',7:'30rpx',8:'28rpx'},
                    'bigRandomInt2':{1:'56rpx',2:'56rpx',3:'46rpx',4:'36rpx',5:'32rpx',6:'26rpx',7:'26rpx',8:'24rpx'}
                },
				// currentComp: '',
				// currentApi: '',
				// promotionId: '', //活动id
				// promotionInfo: {}, //活动详情简要
				// promotionDetail: {}, //活动详细的信息
				// promotionLoading: true, // 都在买loading
				is_show_maskNum: false,
				priceLoading: true, // 获取价格接口的loading状态
                imageUrl: '', // 分享卡片图片
                pricePromise: null,
                postlist: [],
                followDiscountLoading: false, // 引导页请求数据成功的loading状态
                showFollowDiscountPop: true, // 要优惠引导提示，默认显示 
                isShowFollowDiscountToast: false, // 要优惠接口请求成功后的toast显示
                couponIconList: [], // 优惠券标签集合
                fullPreferentialIconList: [], // 满优惠标签集合
                airplaneImg: "https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/icon_xq_feiji.svg",
                introduceImg: "https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/goods/bg_xq_yingdao.png",
                introduceBtnImg: "https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/goods/icon_common_bijia.png",
                introduceVSImg: "https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/goods/icon_xq_VS.png",
                promiseTime: '', // 物流送达时间
                addressCode: {} // 地址省市区编码（地址切换前）
                
			}
		},
        onPageScroll({ scrollTop }) {
            if(this.showNavMenu){
                this.showNavMenu = false;
            }

            if(scrollTop > 3){
                let opacity = scrollTop / 100;
                opacity = opacity > 1 ? 1 : opacity;
                this.bgColor = `rgba(255, 255, 255, ${opacity})`;
            }else{
                this.bgColor = 'transparent';
            }

        },
        // 设置当前页面分享到朋友
        onShareAppMessage(option) {
            let shareMessage = {
                path: `/views/goods/detail/index?sku=${this.sku}&storeId=${this.storeId}`,
                imageUrl: this.imageUrl || this.defaultShareImage,
                title: `[好友推荐]${this.goodsData.skuName}`
            }
            // 全局混入share.js
            let share = this.setShareAppMessage(shareMessage)
            return share;
        },

        //分享到朋友圈
        onShareTimeline() {
            const bean =  {
                title: `[￥${this.goodsPriceInfo.salePrice}] ${this.goodsData.skuName}`,
                query: `sku=${this.sku}&storeId=${this.storeId}&goodsPriceInfo=${JSON.stringify(this.goodsPriceInfo)}`, // 分享的参数 a=1&b=2
                imageUrl: this.defaultShareImage,
            }
            return bean;
        },
		computed: {
            savePrice() {
                return ((this.goodsPriceInfo.supplierReferencePrice * 100 - this.goodsPriceInfo.salePrice * 100) / 100).toFixed(2)
            },
            savePriceInt() {
                return getPartNumber(this.savePrice,'int')
            },
            showTimeLineMask() {
                return judgeSceneTimeLine();
            },
            defaultShareImage(){
                try{
                    return this.goodsData.images[0]
                }catch(e){
                    return ''
                }
            },
  
            // 是否显示要优惠引导
            showFollowDiscount(){
                return this.showFollowDiscountPop && !getStorageSync('hasViewedFollowDiscount');
            },
            fix_blank_height(){
                return this.statusBarHeight*2 + 'rpx';
            },
            // 胶囊高度
            input_capsule_style() {
                const {width, height, right} = this.capsuleInfo;
                return {
                    width: this.windowWidth - (width + this.windowWidth - right + 20) * 2 + 'px',
                    height: height + 'px',
                    borderRadius: height / 2 + 'px',
                }
            },
            // 左侧胶囊样式
            navbar_capsule_style() {
                const {width, height, right} = this.capsuleInfo;
                return {
                    width: width + 'px',
                    height: height + 'px',
                    borderRadius: height / 2 + 'px',
                    marginLeft: (this.windowWidth - right - 13) + 'px'
                }

            },
            /**
             * 该变量用来判断当该商品下架或者缺货的时候，相关按钮不能操作的
             */
            disabledOperate(){
                return !this.hasStock || !this.areaLimit || !this.onSale;
            },

            /**
			 * 是否显示鹅毛情的入口 只有京东发货和售后的商品才支持鹅毛情
			 */
            showFeatherEntry(){
                const ecBuying = this.attendECBuying
                // 正在参加一起买活动，不显示鹅毛情入口
               return !ecBuying && this.jdSelf && (this.goodsData.ownShop == 1);   
            },

            // 正在参加一起买活动
            attendECBuying(){
                return  this.goodsPriceInfo.attendPromotion && this.goodsPriceInfo.promotionStarted && this.goodsPriceInfo.promotionType == 106;
            },

            // 是否是京东自营，并且京东发货
            jdSelf(){
                return goodsHandler.isJdSelf(this.goodsData);
            },


			/**
			 * 商品详情展示的服务相关数据整合
			 */
            serviceLabels(){
                let expressTips1 = '', expressTips2 = '', borderStyle = 'gray';
                if(this.goodsData.supplierType == 'JD'){
					expressTips1 = '京东自营';
                    expressTips2 = '厂家配送'
                    borderStyle = '';
                    if (this.goodsData.jdLogistics == 1) {
                        expressTips2 = '京东物流'  
					} 
                } else if(this.goodsData.supplierType == 'EHSY'){
                    expressTips1 = '西域发货';
                    expressTips2 = '西域售后'
                }

                let sevenTips = '';
                if(!!this.goodsData.returnDesc){
                    sevenTips = this.goodsData.returnDesc;
                }

                let lables = [];
                try {
                    if (expressTips1) {
                        lables.push({
                            iconClass: borderStyle,
                            name: expressTips1
                        })
                    } 
                    if (expressTips2) {
                        lables.push({
                            iconClass: borderStyle,
                            name: expressTips2
                        })
                    }
                    if (sevenTips) {
                        lables.push({
                            iconClass: 'gray',
                            name: sevenTips || ''
                        })
                    }
                } catch (error) {
                    console.log(error)
                } finally {
                    return lables;
                }
            },
            /**
			 * 是否显示优惠栏
			 */
            showDiscount(){
                return (!!this.giftObj.giftList && !!this.giftObj.giftList.length > 0) || (!!this.giftObj.attachmentList && !!this.giftObj.attachmentList.length > 0);
            },

            // 商品的是否参加了活动
            attendPromotion(){
                return goodsHandler.attendPromotion(this.goodsPriceInfo);
            },
            // 计算随机金额Int的字号大小
            getRandomFontSize() {
                return (item) => {
                    let size = '64rpx'
                    let intLength = 1
                    if (item?.randomMin && item?.randomMax) {
                        intLength = getPartNumber(item.randomMin,'int').toString().length + getPartNumber(item.randomMax,'int').toString().length
                    }
                    if (getPartNumber(item.randomMin,'decimal')!='.00' && getPartNumber(item.randomMax,'decimal')!='.00') {
                        size = this.fitfontSize['bigRandom'][intLength]
                    } else if (getPartNumber(item.randomMin,'decimal')=='.00' && getPartNumber(item.randomMax,'decimal')=='.00') {
                        size = this.fitfontSize['bigRandomInt'][intLength]
                    } else {
                        size = this.fitfontSize['bigRandomInt2'][intLength]
                    }
                    
                    return size
                }
            },
            // 计算随机金额Decimal的字号大小
            getRandomSmallFontSize() {
                return (item) => {
                    let size = '32rpx'
                    let intLength = 1
                    if (item?.randomMin && item?.randomMax) {
                        intLength = getPartNumber(item.randomMin,'int').toString().length + getPartNumber(item.randomMax,'int').toString().length
                    }
                    if (getPartNumber(item.randomMin,'decimal')!='.00' && getPartNumber(item.randomMax,'decimal')!='.00') {
                        size = this.fitfontSize['smallRandom'][intLength]
                    } else {
                        size = this.fitfontSize['smallRandomInt'][intLength]
                    }
                    return size
                }
            },
            // 是否展示实惠标签
            isShowJdLable() {
                return this.onSale && goodsHandler.isShowJdLable(this.goodsPriceInfo)
            },
            // 
            goodsDataParamsList() {
                let arr = [];
                if (this.goodsData && this.goodsData.params) {
                    this.goodsData.params.forEach(item => {
                        item.isGroup = true;
                        arr = arr.concat([item, ...item.attrs])
                    })
                    return arr
                } else {
                    return arr
                }
            },
            showGoodsDataParamsList() {
                return this.openGoodsDataParams ? this.goodsDataParamsList : this.goodsDataParamsList.slice(0, 6)
            }

		},
		watch:{
			// 监听地址选择
            choosedAddress: {
                handler(val){
                    const { provinceCode } = val || {};
                    if (!!provinceCode && this.sku) {
                        this.updateGoodsInfos();
                        this.showDeliverInfo(val);
                    }
                },
                deep: true
            },
            couponList: {
                handler(val){
                    this.couponIconList = this.getMaxCouponList(val);
                }
            },
            fullDisList: {
                handler(val){
                    let filterList = val.filter(item => {
                        return item.promotionType === 201 || item.promotionType === 202;
                    })
                    this.fullPreferentialIconList = this.getMaxFullPreferentialList(filterList);
                }
            }
			// 监听库存
            // hasStock(val){
            //     // 库存需要等接口返回数据,此处需要等待DOM渲染结束后计算DOM属性值
            //     setTimeout(()=>{
            //         // this.getBottomQuery();
            //     },400)
            // }
        },
        onLoad(){
			this.mainImage = this.$Route.query.mainImage;
        },
        onShow(){
            // 分享朋友圈 此时直接用query上面传递的价格信息
            if(judgeSceneTimeLine()){
                let options = getLaunchOptions();
                this.goodsPriceInfo = JSON.parse(options.query.goodsPriceInfo); 
            }
        },  
        
		mounted(){
			// 获取路由传递的参数
			const { sku, spu, storeId } = this.$Route.query;
			this.sku = sku;
			this.spu = spu;
            this.storeId = storeId;
			this.getGoodsDetail(); // 获取商品详情
            // 首次进入获取对应信息
            if (isNotEmpty(this.choosedAddress)) {
                this.updateGoodsInfos();
            }
		},
		methods: {
            ...mapMutations(['updateCartNumById', 'updateCartNum','updatePositionInfo','addGoods']),
            getPartNumber,
            isAndroid,
            /**
             * 获取最大面额的优惠券
             * @param {*} list 优惠券数据
             * @returns array
             */
            getMaxCouponList(list){
                let maxCouponItem = {};
                let maxCoupon = 0;

                list.forEach(item => {
                    if (item.publishValue > maxCoupon) {
                        maxCoupon = item.publishValue;
                        maxCouponItem = item;
                    }
                });
                if (maxCouponItem.couponContent === '无门槛') {
                    return [`无门槛${maxCoupon}元`]
                } 
                return maxCouponItem.couponContent ? [`${maxCouponItem.couponContent}元`] :[]
            },
            /**
             * 获取满优惠最大额度
             * @param {*} list 满优惠数据
             * @returns array
             */
            getMaxFullPreferentialList(list){
                let promotionArr = [];
                list.forEach(item => {
                    item.extendInfoList.forEach(childItem => {
                        promotionArr.push(childItem.promotionDescription);
                    })
                });
                let maxQuota = 0;
                let condition = 0;
                promotionArr.forEach(item => {
                    const firstLeftBrackets = item.indexOf('<');
                    const firstRightBrackets = item.indexOf('>');
                    const lastLeftBrackets = item.lastIndexOf('<');
                    const lastRightBrackets = item.lastIndexOf('>');
                    let quota = parseFloat(item.substring(lastLeftBrackets + 1, lastRightBrackets));
                    if (quota > maxQuota) {
                        maxQuota = quota;
                        condition = parseFloat(item.substring(firstLeftBrackets + 1, firstRightBrackets));
                    }
                })
                if (maxQuota === 0 || condition ===0){
                    return []
                }
                return [`满${condition}减${maxQuota}元`]
            },
            //收藏、取消收藏事件
            collectGoods() {

                personalHandler.editFollowProduct({
                    isCollect: !this.goodsData.follow,
                    memberFollowProductList : [{
                        categoryId3: this.goodsData.categoryId3,
                        mainImage: this.goodsData.mainImage,
                        sku: this.goodsData.sku,
                        skuName: this.goodsData.skuName,
                        skuPrice: this.goodsPriceInfo.salePrice,
                        spu: this.goodsData.spu,
                        storeId: this.goodsData.storeInf.storeId,
                        storeName:this.goodsData.storeInf.storeName
                    }]
                }).then(res => {
                    if (res.state == 200) {
                        this.goodsData.follow = !this.goodsData.follow;
                        uni.$emit("updateCollection", this.goodsData)
                        // 上报收藏/取消收藏行为
                        this.$bbcStatEvent({
                            behaviorType: 'fav',
                            sku: this.goodsData.sku,
                            storeId: this.goodsData.storeId
                        })
                    }
                    uni.showToast({
                        icon: 'none',
                        title: res.msg
                    })
                }).catch((e) => {
                    //异常处理
                })
                
            },
            // 点击了页面
            clickPageView(){
                this.setViewedFollowDiscountGuide();
            },
            // 点击了要优惠
            setViewedFollowDiscountGuide(){
                // 要优惠引导不显示
                if(!this.showFollowDiscount){
                    // 设置要优惠不显示
                    this.showFollowDiscountPop = false;
                    return
                }
                this.showFollowDiscountPop = false;
                setStorageSync('hasViewedFollowDiscount', 1);
            },
            // 用户点击 要优惠 按钮
            followDiscount() {
                if(this.attendPromotion || this.isShowJdLable) {
                    uni.showToast({
                        title: '当前商品价格已是最低~',
                        icon: 'none',
                        duration: 1500
                    })
                    return
                }
                const { mainImage, sku, skuName, storeId, storeName } = this.goodsData;
                const param = {
                    mainImage,
                    sku,
                    skuName,
                    storeId,
                    storeName
                }
                goodsHandler.followDiscount(param).then(res=>{
                    if(res.state === 200){
                        this.showFollowDiscountToast();
                    }else{
                        console.error(res.message);
                    }
                    
                })
            },
            showFollowDiscountToast() {
                this.isShowFollowDiscountToast = true;
                this.maskTimer && clearInterval(this.maskTimer);
                this.maskTimer = setTimeout(() => {
                    this.hideFollowDiscountToast()
                }, 3000);
            },
            hideFollowDiscountToast() {
                this.isShowFollowDiscountToast = false;
            },
			// /***
			//  * 跳转到购物车页面
			//  */
			gotoCart(){
                this.$Router.push({
                    path: '/views/cart/index'
                })
			},
            //初始化满优惠列表数据
            initFullDisList(list){
                this.fullDisList = list;
            },
			/*
			 * 点击播放按钮,或者视频播放结束隐藏视频组件
			 * @param type 播放开关
			 */
            playVideo(type) {
                if (type == 'on') {
                    this.playVFlag = true
                } else if (type == 'end') {
                    this.playVFlag = false
                }

            },
			/*
			 * 轮播图切换
			 * @param e 切换对象
			 */
            change(e) {
                this.current = e.target.current;
            },
			/*
			 * 预览图片
			 * @param item 轮播对象
			 */
            prviewImage(item){
                this.$nextTick(()=>{
                    this.$refs.prImgs.initImage(item)
                })
            },
			/*
			 * 获取商品详情信息
			 */
			getGoodsDetail() {
                return new Promise((resolve, reject)=>{
                    goodsHandler.getDetail({
                        sku: this.sku, //货品sku
						showToWX: true
                    }).then(async res => {
                        this.loadingDetail = false; // 详情数据加载结束
                        if (res.state == 200) {
                            const _this = this;
                            this.goodsData = res.data; //详情信息
                            this.spu = res.data.spu;
                            this.initWxNodes(res.data.detail || ''); //初始化小程序商品详情nodes wxGoodsDetailMixin.js里面
                            //用户修改后的数量大于最小购买量的不再修改为最小购买量
                            this.currentSpecNum = (!!res.data.lowestBuy && (this.currentSpecNum<res.data.lowestBuy))?res.data.lowestBuy:this.currentSpecNum;
                            this.specs = res.data.specs || []; //规格列表
                            // 兼容服务端不返回规格的情况
                            if (this.goodsData.specValues && this.goodsData.specValues !== '默认' && !this.specs.length) {
                                this.specs.push({
                                    dim: 1,
                                    specName: '规格',
                                    specAttrList: [{ imagePath: res.data.mainImage, skus: [this.sku], specValue: res.data.specValues }]
                                })
                            }
                            this.storeInfo = res.data.storeInf; //店铺信息
							this.onSale = res.data.state == 1 ? true : false;
                            this.goodsParameterList = [];
                            if (this.goodsData.brandName) {
                                this.goodsParameterList.push({
                                    parameterName: '品牌',
                                    parameterValue: this.goodsData.brandName
                                })
                            }
                            // 展示物流送达信息
                            if (this.choosedAddress?.provinceCode) {
                                this.showDeliverInfo(this.choosedAddress)
                            } else {
                                uni.authorize({
                                    scope: 'scope.userFuzzyLocation',
                                    success() {
                                        var myAmapFun = new amapFile.AMapWX({key:config.GD_KEY});
                                        myAmapFun.getRegeo({
                                            success: async data => {
                                                let address = data[0].regeocodeData?.formatted_address || data[0].name;
                                                //成功回调
                                                const sinoAddressInfo = await getAddressFromMap(address)
                                                // 更新赠品和收获时间等相关信息
                                                _this.showDeliverInfo(sinoAddressInfo)
                                                _this.updateGoodsInfos();
                                                _this.updatePositionInfo(sinoAddressInfo)
                                            },
                                            fail: function(info){
                                                //失败回调
                                                console.error('定位失败：',info)
                                            }
                                        })
                                    }
                                })
                            }
                            
                            // this.initActivityData(this.sku);
							
                            resolve(res.state)

                            // // 查询商品价格相关的信息goodsVideo
                            this.pricePromise = this.getGoodsPrice();
                            // // 查询商品参加活动相关的信息
                            // this.getActivityList();

							this.getDecoraData(); //获取装修数据中装修的优惠券信息

                            // 初始化商品详情分享图片的画报
                            await this.$nextTick()
                            this.initPoster();
                            
                        } else {
                            //错误提示
                            this.soldOut = true;
                            if (res.state==300){
                                this.errorMsg = '商品已下架';
                                setTimeout(function(){
									uni.showToast({
										title: this.errorMsg,
										icon:'none'
									})
                                }.bind(this),1000)
                            } else {
                                this.errorMsg = res.msg;
                                setTimeout(function(){
									uni.showToast({
										title: res.msg,
										icon:'none'
									})
                                }.bind(this),1000)
                            }
                        }
                        //if(!this.compareList.length > 0){
                        //    this.activeShadow = true;
                        //}
                        // this.immersive = (!window?.titleBarHeight || window?.titleBarHeight==0)?false:true;
                        resolve(res.state);
                    }).then(() => {
                        // this.$nextTick(()=>{})
                        // // this.getGoodsComment(); //评价信息，2022-1-7暂时屏蔽查询评论信息
                        // this.getRecommend(); //获取店铺推荐商品列表
                        // if (!isGoodsChange) {
                        //     // this.getCouponList(); //获取优惠券列表
                        //     this.getDecoraData(); //获取装修数据中装修的优惠券信息
                        // }
                        // // this.fullDiscountList(); //获取满优惠列表
                        // this.boundScrollTop = this.$refs.space?.$el.offsetHeight - (this.immersive?this.titleBarHeight:50);

                    }).then(() => {
                        //this.getSelectorQuery();
                    }).then(()=>{
                        // this.boundScrollTop = this.$refs.space?.$el && this.$refs.space?.$el.offsetHeight - (this.immersive?this.titleBarHeight:50);
                    }).then(async () => {
                        //await this.$nextTick();
                        //this.getBottomQuery();

                        
                    }).finally(()=>{
                        this.loadingDetail = false; // 详情数据加载结束
                    })
                })
            },

            /***
             * 初始化分享图片
             */
            async initPoster(){
                await this.pricePromise;
                this.postlist = [
                    {
                        type: 'image',
                        path: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/share/share_goods_card.png',
                        x: 0,
                        y: 0,
                        width: 400,
                        height: 320
                    },
                    {
                        type: 'image',
                        // path替换成你自己的图片，注意需要在小程序开发设置中配置域名
                        path: this.defaultShareImage,
                        x: 28,
                        y: 42,
                        width: 160,
                        height: 160
                    },
                    {
                        type: 'text',
                        x: 224,
                        y: 54,
                        text:'限时特价',
                        size: 25,
                        color: '#000000'
                    },
                    {
                        type: 'text',
                        x: 218,
                        y: 90,
                        text: isNotEmpty(this.goodsPriceInfo.salePrice)?`￥${this.goodsPriceInfo.salePrice.toFixed(2)}`:'',
                        size: 28,
                        color: '#ed1212'
                    },
                  ]
            },

            /*
			 * 获取商品价格相关的信息【批量接口】
			 */
            getGoodsPrice(){
                this.$refs?.loading?.open();
                return new Promise(resolve => {
                    let param = {
                        products: [
                            {
                                sku: this.sku,
                                categoryId1: this.goodsData.categoryId1,
                                categoryId2: this.goodsData.categoryId2,
                                categoryId3: this.goodsData.categoryId3,
                                storeId: this.goodsData.storeId,
                            }
                        ]
                    }
                    this.priceLoading = true;
                    goodsHandler.getProductPrice(param).then(res => {
                        this.$refs?.loading?.close();
                        if(res.state == 200 && res.data?.products?.length > 0){
                            this.goodsPriceInfo = res.data.products[0];
                        } else {
                            this.noPriceFun();
                        }
                        resolve(true)
                    }).catch(e => {
                        this.noPriceFun();
                        resolve(true)
                    }).finally(()=>{
                        this.priceLoading = false;
                        this.$refs?.loading?.close();
					})
                })
            },
            /**
			 * 查询完价格后，如果没有查询到价格或者查询价格接口报错，此时将价格信息置空，同时按照商品下架处理该场景
			 */
            noPriceFun(){
                if(!judgeSceneTimeLine()){
                    this.goodsPriceInfo = {} // 查询接口没有返回的时候，此时直接置空价格对象
                    this.onSale = false; // 将商品按下架状态处理
                }
            },  		
			
            /*
			 * 将html标签转成rich-text支持nodes格式
			 */
            getNodes(nodes, type){
                try {
                    return weRich.parse(nodes);
                } catch (error) {
                    return ''
                }
            },
			/*
			 * 调整价格显示规则
			 */
			judgeShowPriceRule(){
                return this.goodsData && ((this.supplierTypeEnum[this.goodsData.supplierType]||{}).showPriceRule||false)
            },
			/**
			 * 获取价格
			 * @param number 价格数字
			 */
			getPriceNumber(number,type){
				return getPartNumber(number,type);
			},
            /**
             * 切换商品规格id
             * @param {str} sku 当前所选商品id，beforeChange
             * @param {arr} skuIds 商品规格list
             * @param {arr} dim 维度
             */
            async changeSpecSku(sku,skuIds,dim){
                let that = this;
                let tempList = that.getDimSkus(sku,skuIds,dim); //获取每个维度下的skuIds
                let tempListFilter=tempList.reduce((a, b) => a.filter(c => b.includes(c))); //获取每个维度skuIds的交集
                this.cacheSpec = {
                     sku:tempListFilter[0],
                     skuIds:skuIds,
                     dim:dim
                };
                if(tempListFilter.length > 0){
                    this.sku=tempListFilter[0];
                    // that.getSaleVolume();
                    //切换规格之后 需要更新相应的库存 赠品 区域销售等等
                    that.updateGoodsInfos();
                    let state = await that.getGoodsDetail(true);
                    that.duration = 1;
                    that.current = 0;
                    setTimeout(function(){
                        that.duration = 500;
                    },500)
                    if (state!=200){
                        this.sku = sku;
                    }
                }else{
                    return false;
                }
            },			
			/*
			 * 打开商品规格的弹窗
			 */
            showSpecModelPop(){
                this.showSpecModelType = '';
                this.$refs.specModel.open();
            },
			/*
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
                if(0 == tempListFilter.length){
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
                for(let i=0;i<length;i++){
                    let value = this.specs[i];
                    if(dim == value.dim){//点击的按钮所属的维度
                        resList.push(skuIds);
                    }else{//非当前维度
                        let len = value.specAttrList.length;
                        for(let j=0;j<len;j++){
                            if (that.arrhaveitem(sku,value.specAttrList[j].skus)) {
                                resList.push(value.specAttrList[j].skus);
                            }
                        }
                    }
                }
                return resList;
            },
			/**
			 * 更新商品的相关信息
			 */
            updateGoodsInfos() {
                // 有默认地址时取choosedAddress, 否则从定位获取到的addressCode里取
                let dataSource = isNotEmpty(this.choosedAddress) ? this.choosedAddress : this.addressCode;
                const { provinceCode, cityCode, districtCode, townCode } = dataSource || {};
                if (!!provinceCode && !!cityCode && !!districtCode && !!this.sku) {
                    // 获取赠品和附件相关数据
                    this.getListSkuGift(provinceCode, cityCode, districtCode, townCode);
                    //获取区域限售状态
                    this.getListAreaLimit(provinceCode, cityCode, districtCode, townCode);
                    //获取商品库存状态
                    this.getListStock(provinceCode, cityCode, districtCode, townCode);
                }
            },
			/**
			 * 获取赠品
			 */
            getListSkuGift(provinceCode, cityCode, districtCode, townCode) {
                goodsHandler.getGift({
                    skuInfos:[{
                        sku: this.sku,
                        num: this.currentSpecNum
                    }],
                    provinceCode,
                    cityCode,
                    districtCode,
                    townCode,
                    // show:true
                }).then(res=>{
                    if(res.state == 200){
                        const defaultObj = {
                            giftList:[],
                            attachmentList:[]
                        }
                        this.giftObj = res.data.skuGiftAndAttachmentInfoList[0]||defaultObj
                    }
                })
            },

            /**
			 * 获取商品的库存状态
			 */
            getListStock(provinceCode, cityCode, districtCode, townCode) {
                let that = this;
                return new Promise((resolve, reject) => {
                    goodsHandler.checkStock({
                        skuInfos:[{
                            sku: this.sku,
                            num: this.currentSpecNum
                        }],
                        provinceCode,
                        cityCode,
                        districtCode,
                        townCode
                    }).then(res=>{
                        if(res.state == 200 && res.data && res.data.skuStockList && res.data.skuStockList.length > 0){
                            try {
                                that.hasStock = stockEnum[res.data.skuStockList[0].stockState].hasStock;
                                resolve(that.hasStock);
                            } catch (error) {
                                resolve(true);
                            }
                        }
                    }).catch(e => {
                        reject(false)
                    })
                })
            },

            /**
			 * 获取商品的区域限售状态
			 */
            getListAreaLimit(provinceCode, cityCode, districtCode, townCode) {
                goodsHandler.checkAreaPurchase({
                    skus:[this.sku],
                    provinceCode,
                    cityCode,
                    districtCode,
                    townCode,
                }).then(res=>{
                    if(res.state == 200 && res.data && res.data.skuPurchaseList && res.data.skuPurchaseList.length > 0){
                        try {
                            this.areaLimit = res.data.skuPurchaseList[0].canPurchase;
                            if(!!this.areaLimit){
                                // 更新商品的运费
                                this.getUserEx();
                            }
                        } catch (error) {

                        }
                    }
                })
            },
            /**
			 * 编辑数量
			 */
            async editNum(type,e){
                let that = this;
                that.currentSpecNum = that.currentSpecNum.toString().replace(/\D/g, '');
                let activityLimitNumber = 0; //活动的限购数量 0代表不限购
                if (that.secKillInfo && that.secKillInfo.state == 2) { //秒杀活动进行中
                    activityLimitNumber = that.secKillInfo.upperLimit;
                } 
                if (type == 'blur'){
                    if(that.currentSpecNum == ""){
                        setTimeout(() => {
                            that.currentSpecNum = that.goodsData.lowestBuy || 1;
                        }, 0)
                        return
                    }
                    if (that.currentSpecNum < 1 || that.currentSpecNum < that.goodsData.lowestBuy) {
                        setTimeout(() => {
                            that.currentSpecNum = that.goodsData.lowestBuy || 1;
                            uni.showToast({
                                title:'不能少于最少购买量',
                                icon:'none'
                            })
                        }, 0)
                        return;
                    }
                }
                if (type == 'add'){
                    if(that.noAdd){ //功能上不能增加
                        if(0 != activityLimitNumber && that.currentSpecNum > activityLimitNumber){
                            uni.showToast({
                                title: '限购数量' + activityLimitNumber,
                            icon: 'none'
                            })
                        }
                        return
                    } else{
                        that.currentSpecNum++;
                    }
                }else if(type == 'reduce'){
                    that.noAdd = false;
                    if(that.currentSpecNum <= that.goodsData.lowestBuy || that.currentSpecNum<=0){
                        uni.showToast({
                            title: '不能少于最少购买量',
                            icon: 'none'
                        })
                        return
                    }else{
                        that.currentSpecNum--;
                    }
                }else if(type == 'edit'){
                    if(that.currentSpecNum == ""){
                        return
                    }
                    if (that.currentSpecNum == 0) {
                        setTimeout(() => {
                            that.currentSpecNum = that.goodsData.lowestBuy || 1;
                        }, 0)
                        return;
                    }
                    if(that.currentSpecNum[0] == '0' ){
                        setTimeout(() => {
                            that.currentSpecNum = that.currentSpecNum.substring(1);
                        }, 0)
                        return
                    }
                }
                //判断是否超出限购数量时加购数量的限制
                if(0 != activityLimitNumber && that.currentSpecNum > activityLimitNumber){ //加购数量> 限购数
                    that.noAdd = true;
                    setTimeout(() => {
                        that.currentSpecNum = activityLimitNumber;
                    }, 0)
                    uni.showToast({
                        title: '限购数量' + activityLimitNumber,
                        icon: 'none'
                    })
                    return
                }
                if (that.currentSpecNum >= 999) {
                    that.noAdd = true;
                    setTimeout(() => {
                        that.currentSpecNum = 999;
                    }, 0)
                    return
                }
                // 购买数量变更的时候，更新赠品附件相关数据
                that.updateGoodsInfos()
            },
			/**
			 * 校验信息
			 * @param {object} info 对象
			 */
			valiInfo(info) {
                return JSON.stringify(info) != '{}'
            },
			
			/*
			 * 获取页面元素模块距离顶部的距离
			 */
            getSelectorQuery() {
                let query = uni.createSelectorQuery().in(this);
                // 获取状态栏的高度
                let statusBarHeight = 0;
                // #ifdef APP-PLUS
                let systemInfo = uni.getSystemInfoSync();

                statusBarHeight = systemInfo.statusBarHeight;
                // #endif
                //获取对应模块到顶部的距离
                query.select('#nav1').boundingClientRect((res) => {
                    if (res) {
                        this.nav1ScrollTop = res.top - (this.immersive?this.titleBarHeight:50 + statusBarHeight);
                    }
                }).exec()
                // query.select('#nav2').boundingClientRect((res) => {
                //     if (res) {
                //         this.nav2ScrollTop = res.top - (this.immersive?this.titleBarHeight:50 + statusBarHeight);
                //     }
                // }).exec()
                // this.$nextTick(function() {
                //     if (this.recommendedList && this.recommendedList.length > 0) { //有店铺推荐模块
                //         query.select('#nav3').boundingClientRect((res) => {
                //             if (res) {
                //                 this.nav3ScrollTop = res.top - (this.immersive?this.titleBarHeight:50 + statusBarHeight);
                //             }
                //         }).exec()
                //     }
                // })
                query.select('#nav4').boundingClientRect((res) => {
                    if (res) {
                        this.nav4ScrollTop = res.top - (this.immersive?this.titleBarHeight:50 + statusBarHeight);
                    }
                }).exec()
            },
            confirm(flag){
                uni.$emit(this.authKey, flag);
                this.$refs.authPopup.close();

            },
            cancel(){
                uni.$emit(this.authKey, false);
                this.$refs.authPopup.close();
            },

            authProxyHandler(next, ...param){
                if(!judgeSceneTimeLine()){
                    authProxyHandler(this, this.authKey, next, ...param);
                }
            },
        
			/*
			 * 打开规格弹框
			 */
            showSpecModel(type, custom='') {
				
                // 区域限售和无货的时候 按钮屏蔽
                if(this.disabledOperate){return}
                if (custom == 'custom'){
                    this.customFlag = true;
                } else {
                    this.customFlag = false;
                }
                //如果是购买操作，并且商品总库存为0
                if ((type === 'buy' || typeof type !== 'string') && !this.hasStock) {
                    return;
                }
                if (type == 'add') {
                    if(this.disabledOperate){return}
                    this.showSpecModelType = 'add'
                } else if (type == 'buy') {
                    if(this.disabledOperate){return}
                    this.showSpecModelType = 'buy'
                } else if (type == 'offshelf') {
                    this.showSpecModelType = 'offshelf'
                } else if (type == 'nosocket') {
                    this.showSpecModelType = 'nosocket'
                } else if (type == 'pinAlone' && this.valiInfo(this.pinInfo)) {
                    this.pinButState = 0
                } else if (type == 'pinLeague' && this.valiInfo(this.pinInfo)) {
                    this.pinButState = 1
                } else if ((!type) && this.valiInfo(this.pinInfo)) {
                    this.pinButState = 2
                } else if (type == 'joinLeague') {
                    this.pinButState = 3
                } else {
                    this.showSpecModelType = ''
                }
                this.$forceUpdate()
                this.$refs.specModel.open();
            },
			/*
			 * 立即购买按钮回调
			 */
            buy(arg){
                if(this.disabledOperate){
                    return
                }
                this.buyFun(arg);
                
            },
            // 给缓存中放置订单也所需要的大量的数据
            setParamForStorageOfConfirm(){
                const { storeName, skuName, specValues, mainImage, lowestBuy, ownShop } = this.goodsData;

                let goodsData = [{
                    ownShop,
                    storeId: this.storeInfo.storeId,
                    storeName,
                    productList: [{
                        storeName,
                        skuName, 
                        specValues,
                        mainImage, 
                        buyNum: this.currentSpecNum,
                        price: this.goodsPriceInfo.salePrice,
                        sku: this.sku,
                    }],
                    products: [{
                        storeName,
                        storeId: this.storeInfo.storeId,
                        sku: this.sku,
                        number: this.currentSpecNum,
                        notAttendDiscount: false,
                        salePrice: this.goodsPriceInfo.salePrice,
                        categoryId3: this.goodsPriceInfo.categoryId3,
                        cidPath: `${this.goodsPriceInfo.categoryId3}/${this.goodsPriceInfo.categoryId3}/${this.goodsPriceInfo.categoryId3}`,
                        voucherCode: '',
                        // 秒杀、一起买、天天专场
                        specialOfferVO: !!this.goodsPriceInfo.promotionId ? {
                            promotionDes: this.goodsPriceInfo.promotionDes,
                            promotionId: this.goodsPriceInfo.promotionId,
                            promotionType: this.goodsPriceInfo.promotionType,
                            stageId: this.goodsPriceInfo.stageId
                        }: null
                    }]
                }]
                // 先清空：购物车，鹅毛情，普通订单，抽奖兑换都会放置此缓存数据
                setStorageSync('orderConfirm', '')
                setStorageSync('orderConfirm', { goodsData })
            },
			/*
			 * 确认下单
			 */
            buyFun(arg) {
                this.setParamForStorageOfConfirm()
				
                this.$refs?.loading?.open();
                //从这里跳转页面后置为1，从一个页面返回回来，将在onShow里调用getGoodsDetail
                this.showState = 1
                let query = {
                    orderType: 1,
                    ifcart: 2,
                }
                let path = '/views/order/confirm/index';
                if (this.customFlag) { // 鹅毛情下单
                    if(getStorageSync(this.hasPreviewCacheKey)){ // 说明用户已经浏览了了解鹅毛情页面
                        query = {
                            ...query,
                            FEATHER_ORDER: true,
                        }
                    } else { //用户没有浏览了解鹅毛情页面
                        path = '/views/gift/preview/index'
                        query = {
                            ...query,
                            showFeatherConfirmBtn: 1, // 显示底部立即送礼按钮
                        }
                    }
                } 
                this.$Router.push({
                    path,
                    query
                })
                this.$refs?.loading?.close();
            },
			/* 
			 * 加入购物车
			 */
            addCart(){
                let that = this;
                if(!!this.disabledOperate){
                    return
                }
				that.addCartFun();
            },
			/**
			 * 加入购物车功能
			 */
            addCartFun() {
                let that = this;
                let preVal = this.$store.state.cartNum;
                // 更新购物车数量
                this.updateCartNumById(this.sku);
                this.cartNum = this.$store.state.cartNum;
                const { mainImage, sku, skuName, storeId, storeName, specValues } = this.goodsData;
                const goodsItem = {
                    mainImage, sku, skuName, storeId, storeName,
                    num: this.currentSpecNum,
                    isChecked: 1,
                    productPrice: this.goodsPriceInfo.salePrice,
                    buyNum: this.currentSpecNum,
                    specValues,
                }

                // 加入购物车的方法在cartMixin里面
                this.$addCart({
                    num: this.currentSpecNum,
                    addressId: this.choosedAddress.addressId,
                    storeId,
                    goodsItem,
                    onSuccess() {
                        that.addGoods(goodsItem)
                        that.$refs.specModel.close();
                    },
                    onError() {
                        // 回退购物车数量
                        that.updateCartNum(preVal)
                        that.cartNum = preVal;
                    }, 
                })
            },
			/**
			 * 关闭地址选择的弹窗
			 */
            addressPopClose() {
                this.$refs.addressChooseComp.close();
            },
            // 打开筛选框选择地址列表
            showAddressList(){
                this.$refs.addressChooseComp.open();
            },
			/**
			 * 返回首页
			 */
			goToHomePage() {
                uni.switchTab({
                    url: '/pages/index/index'
                })
			},
			/**
			 * 赠品模态框
			 * @param {string} type 类型
			 */
            showGiftModel(type){
                 if(!!type&&type == 'gift'){//点击的赠品
                    this.giftPopType = '赠品'
                    this.giftPopList = this.giftObj.giftList;
                }else if(!!type&&type == 'attachment'){//点击的附件
                    this.giftPopType = '附件'
                    this.giftPopList = this.giftObj.attachmentList;
                }
                this.$refs.giftModel.open()
            },
			/**
			 * 获取领券中心装修数据
			 */
            getDecoraData(){
                let param = {
                    decoId: config.COUPON_TOPIC_ID,
                    type: 'topic'
                }
                let deco_data = [] //装修数据
                let couponIds = [] //装修优惠券ID
                decorateHandler.getTopicDeco(param).then(res => {
                    if (res.state == 200) {
                        if (res.data.data == null){
                            deco_data = []
                            return
                        } else {
                            deco_data = JSON.parse(res.data.data || "[]");
                        }
                    }
                    // 遍历装修数据获取优惠券Id集合
                    deco_data?.forEach((item)=>{
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
                            couponIds = couponIdList
                        }
                    })
                    // 根据优惠券ID获取优惠券List
                    this.getDecoCouponList(couponIds)
                })
            },
            /**
			 * 获取优惠券数据
			 */
            getDecoCouponList(couponIds) {
                if (couponIds.length === 0) {
                    return
                }
                let param = {};
                param.couponIds = couponIds;
                goodsHandler.couponCenter(param).then(res => {
                    if (res.state == 200) {				
                        let result = res.data.couponList.filter((item)=>{
                            if (item.storeId == 0 || item.storeId == this.storeInfo.storeId){
                                item.isOpen = false;
                                if (item.receivedState == 3) {
                                    item.couponBg = this.finishReceiveBg;
                                }
                                if (item.receivedState == 2) {
                                    item.couponBg = this.hasReceiveBg;
                                }
                                if (item.receivedState == 1) {
                                    item.couponBg = this.goReceiveBg;
                                }
                            }
							
                            var skusjudge = !item.skus?.length || -1<item.skus?.split(',')?.findIndex((i)=>{return i == this.sku});
                            var catjudge = !item.couponCategoryVO || item.couponCategoryVO.categoryId == this.goodsData[`categoryId${item.couponCategoryVO.grade}`];
                            return (item.storeId == 0 || item.storeId == this.storeInfo.storeId) && skusjudge && catjudge
                        })
                        this.couponList = result;			
                    }
                }).catch((e) => {

                })
            },
             
			/**
			 * 领券弹窗
			 */
			openCouponModel() {
                this.$refs.couponModel.open();
            },
			/**
			 * 立即领取
			 */
            goReceive(item) {
                let that = this;
				let couponId = item.couponId
				let param = {couponId};
				goodsHandler.receiveCoupon(param).then(res => {
					if (res.state == 200) {
						let result = res.data;
						uni.showToast({
							title:'领取成功！',
							icon:'none'
						})
						that.getDecoraData();
						if(item.couponType == 3){    //随机优惠券
							that.rondomMod = true;
							that.rondomDes = result;
						}
					} else {
						uni.showToast({
							title:res.msg,
							icon:'warning'
						})
						that.getDecoraData();
					}
				}).catch((e) => {
					//异常处理
				})
            },
			/**
			 * 规则展开
			 */
            descriptionOpen(couponId) {
                this.couponList.map(item => {
                    if (item.couponId == couponId) {
                        if (item.description != '') {
                            item.isOpen = !item.isOpen
                            this.$forceUpdate()
                        }
                    }
                })
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
            /**
             * 格式化满优惠活动描述
             * @param Object 满优惠活动对象
            */
            formatePromotionDes(promotionItem,item){
                let promotionType = item.promotionType
                let resStr = promotionItem.promotionDescription;
                const firstLeftBrackets = resStr.indexOf('<');
                const lastLeftBrackets = resStr.lastIndexOf('<');
                const firstRightBrackets = resStr.indexOf('>');
                const lastRightBrackets = resStr.lastIndexOf('>');
                const fullPrice = resStr.substring(firstLeftBrackets + 1, firstRightBrackets);
                const discount = resStr.substring(lastLeftBrackets + 1, lastRightBrackets);
                const content = resStr.substring(lastRightBrackets+1, resStr.length);
                if (promotionType === 201) {
                    let _fullPrice = this.getNum(fullPrice)
                    let _discount = this.getNum(discount)
                    resStr = `满${_fullPrice}减${_discount}${content}`
                }
                if (promotionType === 202) {
                    let _fullPrice = this.getNum(fullPrice)
                    let _discount = this.getNum(discount)
                    resStr = `每满${_fullPrice}减${_discount}${content}`
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
                    resStr = `满${_fullPrice}打${_discount}${content}`
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
                    resStr = `${fullPrice}件${_discount}${content}`
                }
                try {
                    resStr = resStr.replace('元','').replace(/[\d]/g, function(num) {
                        return "<span style='color:#f30300'>" + num + "</span>"
                    }).replace(/[\.]/g, function(num) {
                        return "<span style='color:#f30300'>" + num + "</span>"
                    }).replace(/x[\d]/g, function(num) {
                        return "<span style='color:#f30300'>" + num + "</span>"
                    }).replace(/;/g,function(num) {
                        return "<br>"
                    })

                    //满减赠送的优惠券已领完判断
                    if(0 === promotionItem.couponCountRemaining){
                        resStr += "（已领完）"
                    }
                } catch (error) {
                }
                return resStr;
            },
            
            

			//获取商品参加活动相关的列表
			initActivityData(sku){
                if(!!!sku){ return }
				// 初始化活动相关的接口之前，清空活动相关详情
				this.initFullDisList([]);

				return new Promise(resolve => {
					let param = {
						sku,
                        storeId: this.goodsData.storeId,
						specialofferState:3,
						disocuntState:2
					}
					promotionHandler.getPromotionList(param).then(res => {
						if (res.state == 200 && res.data?.activityList && res.data?.activityList.length > 0){
							if (res.data.activityList.length > 0){
								// 整合满优惠列表数据
								let fullDisList = res.data.activityList.filter(item => {
									return item.promotionGrade != 1
								})
								this.initFullDisList(fullDisList);

								// // 整合一级活动详情数据 
								// let oneLevelList = res.data.activityList.filter(item => {
								// 	return item.promotionGrade == 1
								// });

								// // 经与服务端人员沟通，一个商品只能参加一个以及活动，所以如果商品参加了一级活动有且只有一条一级活动数据【一级活动目前包括： 秒杀 拼团 阶梯团 预售 一起买 天天专场】
								// if (oneLevelList.length > 0){
								// 	this.promotionInfo = oneLevelList[0]; // 更新活动的简要信息
								// 	this.getPromotionInfo(this.promotionInfo);
								// } else {}
							}
						}
						resolve(true)
					}).catch(e => {
						console.log(e);
						resolve(true)
					})
				})                 
			},
			//满优惠弹框
            openFullDisModel() {
                this.$refs.fullDisModel.open();
            },
			//sku长按事件
            showCopyPanel() {
                if(this.is_show_maskNum){
                    this.is_show_maskNum = false;
                    setTimeout(function(){
                        this.is_show_maskNum = true;
                    }.bind(this),300)
                }else{
                    this.is_show_maskNum = true;
                }
                this.is_show_mask = false;
            },
			/**
             * 复制字符串
             */
            copyStr (str, type) {
                uni.setClipboardData({
					data: str,
					success: function () {
						uni.showToast({
							title:'复制成功！'
						})
					}
				});
                if (type === 'bijia') {
                    this.$refs.introducePopup.close()
                } else {
                    this.is_show_maskNum = false;
                }
            },
			/**
			 * 重置状态
			 */
			resetSomeStatus(){
				// 重置剪切板弹框状态
				if (this.is_show_maskNum) {
					this.is_show_maskNum = false
				}
			},
            /**
             * 预览图片
             */
            previewImg(current){
                uni.previewImage({
                    current,
                    urls: this.goodsData.images
                })
            },
			// 活动相关接口请求完成
            promotionDone(){
                this.promotionLoading = false;
                this.followDiscountLoading = true;
            },
            //更新活动信息
            updatePromotionInfo(promotion){
                if (promotion.promotionType == promotionEnum.SECKILL.type) { // 秒杀
                    this.secKillInfo = promotion;
                } 
                
                // else if (promotion.promotionType == promotionEnum.PRESELL.type) { // 预售
                //     this.preSellInfo = promotion;
                // } else if (promotion.promotionType == promotionEnum.PINGROUP.type) { //拼团
                //     this.pinInfo = promotion;
                // } else if (promotion.promotionType == promotionEnum.LADDER.type) { //阶梯团
                //     this.ladderInfo = promotion;
                else if (promotion.promotionType == promotionEnum.ECBUY.type) { //一起买
                    this.buyTogetherInfo = promotion;
                } 
                this.promotionLoading = false;
                // if (promotion.promotionType == promotionEnum.DAILY.type){ //天天专场 目前天天专场活动是没有详情接口的
                // }
            },
            // 清空活动信息
            clearPromotionInfo(){
                // this.preSellInfo = {};
                // this.pinInfo = {};
                // this.ladderInfo = {};
                this.secKillInfo = {};
                this.buyTogetherInfo = {};
            },
            toSearchPage() {
                this.$Router.push({
                    path: '/views/search/index',
                    query: {
                        keyword: this.keyword
                    }
                })
            },
            navTo(path){
                this.showNavMenu = false;
                
                if(path == '/pages/index/index' || path == '/pages/mine/index'){
                    uni.switchTab({
                        url: path
                    })
                }else{
                    this.$Router.push({
                        path
                    })
                }
            },
            posterError(err) {
                this.imageUrl = this.defaultShareImage;
            },
            posterSuccess(url) {
                // 生成成功，会把临时路径在这里返回
                this.imageUrl = url;
            },
            /**
             * 展示优惠面板
             * couponLength 优惠券数据长度
             */
            showPanel(couponLength){
                if (couponLength > 0){
                    this.$refs.couponModel.open();
                } else {
                    this.$refs.fullDisModel.open();
                }
            },
            //去优惠券对应的商品列表
            goGoodsList(item) {
                if(item.linkInfo!=null){
                    let tempLinkInfo = item.linkInfo.replace(/wx_url/g,"url");
                    let skipUrl={};
                    try{
                        skipUrl=JSON.parse(tempLinkInfo);
                        skipTo(skipUrl,this);
                    }catch(error){
                        this.goDefaultGoodsList(item);
                    }
                }else{
                    this.goDefaultGoodsList(item);
                }

            },
            goDefaultGoodsList(item){
                let params = {}
                if (item.storeId > 0) {
                    params.storeId=item.storeId
                }
                if (item.useType == 2 && item.skus) { ////指定商品 跳转到活动商品列表页面
                    params.skus = item.skus;
                    this.$Router.push({
                        path: '/views/coupon/list/index',
                        query: {
                            source: 'coupon',
                            ...params
                        }
                    })
                    return 
                } else if (item.useType == 3 && item.couponCategoryVO) { //指定分类 跳转到商品列表页面
                    params.categoryIds = item.couponCategoryVO.categoryId
                }
                this.$Router.push({
                    path: '/views/goods/list/index',
                    query: {
                        source: 'coupon',
                        ...params
                    }
                })
            },
            // 打开指引dialog
            showIntroduce() {
                this.$refs.introducePopup.open()
            },
            /**
             * 切换或者获得地址信息
             */
            getAddressInfo() {
                this.showAddressList()
            },
            /**
             * 展示物流信息
             */
            async showDeliverInfo(codeInfo){
                const { provinceCode, cityCode, districtCode, townCode } = codeInfo

                const { storeId, sku } = this.goodsData

                if(!storeId || !sku){
                    return
                }
                
                const promiseParam = {
                    provinceCode,
                    cityCode,
                    districtCode,
                    townCode,
                    skuNumList: [
                        {
                            storeId,
                            sku,
                            num: this.currentSpecNum
                        }
                    ]
                }
                this.addressCode = codeInfo
                
                const calendarInfo = await orderHandler.getPromiseCalendar(promiseParam)
                if(calendarInfo.state == 200 && calendarInfo.data?.productPromiseCalendars.length > 0 && calendarInfo.data?.productPromiseCalendars?.[0]?.promiseTime){
                    this.promiseTime = `${calendarInfo.data?.productPromiseCalendars[0].promiseTime}`
                } else {
                    this.promiseTime = '';
                }
            },
            /**
             * 规格弹窗地址切换
             */
            changeAddress(info){
                if(info.provinceCode){
                    this.choosedAddress = info
                }
            },
            handleGoodsDataParam() {
                this.openGoodsDataParams = !this.openGoodsDataParams;
                if (!this.openGoodsDataParams) {
                    uni.createSelectorQuery()
                        .select('.params_html_title')
                        .boundingClientRect((con) => {
                            // 获取点击要跳转的锚点信息
                            uni.createSelectorQuery()
                                .select(".detail_wrapper")
                                .boundingClientRect((res) => {
                                    uni.pageScrollTo({
                                        selector: ".params_html_title", // 滑动的元素
                                        scrollTop: con.top - res.top - this.navHeight, // 到达距离顶部的top值
                                    });
                                })
                                .exec();
                            })
                        .exec();
                }
            }
		}
        
	}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
