<!-- 购物车的全部内容， 主包tabbar和子包views会使用的到 -->
<!-- 购物车页面 -->
<template>
    <view class="cart_wrapper">
        <w-loading ref="loading"></w-loading>

        <!-- 自定义titleBar start -->
        <u-navbar :title="title" placeholder v-if="custom">
            <template slot="left">
            </template>
            <template v-slot:center>
                <view class="flex_row_center_center" >
                    <u-loading-icon size="13" v-if="title == '刷新中'"></u-loading-icon>
                    <text :style="[titleStyle]">{{title}}</text>
                </view>
            </template>
        </u-navbar>
		<!-- 自定义titleBar end -->

        <!-- 顶部的购物车地址和管理部分 start-->
        <view class="address_manage">
            <view class="left_adressBar" @click="showAddressList">
                <image class="img" mode="widthFix" :src="weizhi" />
                <text class="deliver_goods_title">配送至：</text>
                <text class="address" v-if="choosedAddress && choosedAddress.provinceCode">{{ choosedAddress.detailAddress
                }}</text>
                <text v-else class="adressplaceholder">请添加地址</text>
            </view>
            <view class="right_manageBar">
                <text class="navbarTxt" @click="manageCart">{{ titleRightText }}</text>
            </view>
        </view>
        <!-- 顶部的购物车地址和管理部分 end-->
        
        <view class="filter_wrapper flex_row_between_center" :style="{'padding-top': filter_wrapper_padding_top}">
            <view class="filter_item" :class="{'active': tabIndex == 0, 'disable': availableCartNum == 0}" @click="tabChange(0)">
                <text>全部</text>
                <text>[{{ availableCartNum?availableCartNum:0}}]</text>
            </view>
            <view class="filter_item" :class="{'active': tabIndex == 1, 'disable': reductionNum == 0}" @click="tabChange(1)">
                <text>降价</text>
                <text>[{{ reductionNum?reductionNum:0 }}]</text>
            </view>
            <view class="filter_item invisibale"></view>
        </view>

        <!-- 购物车列表 -->
        <view v-if="showData.storeCartGroupList || !hasLogin" class="cart-list-box">
            <scroll-view 
                class="cart-list"
                :enhanced="true"
                :bounces="true"
                :scroll-anchoring="true"
                :enable-passive="true"
                :throttle="false"
                @scroll="scroll"
                @touchstart="touchstart"
                @touchmove="touchmove"
                @touchend="touchend"
                scroll-y
            >
                <!-- 空白页缺省页 start-->
                <view v-if="!cartList.length" class="empty_part">
                    <view>
                        <image class="img" mode="widthFix"
                            src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/empty/icon_defpage_gouwuchemeihuo.png" />
                        <view class="tips">购物车暂无商品</view>
                    </view>
                </view>
                <!-- 空白页缺省页 end-->

                <!-- 店铺列表 -->
                <view class="shop_list_wrap">
                    <view class="shop_item" v-for="(shop, index) in cartList" :key="shop.storeId">
                        <view class="shop_item_top_box" :class="{pad10:shop.freightState==1 && shop.storeOriginalFreight>0}">
                            <view class="shop_item_top" :class="{shop_item_notborder:shop.freightState==1}">
                                <!-- 店铺这一层级的选中与非选中 -->
                                <text :class="[shopCheckStyle(shop)]" @click="changeSelectState('shop', shop)"></text>
                                <!-- 店铺logo+名字 -->
                                <view class="flex_row_start_center">
                                    <view :class="{ownStore:shop.storeId==6}" class="shop_icon"></view>
                                    <view class="shop_name">{{shop.storeName}}</view>
                                </view>

                                <image v-if="!editFlag && shop.hasCoupon" src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/cart/coupon.png" mode=""
                                    class="coupon_icon" @click="getShopCouponModule(shop.storeId)" />
                            </view>
                            <!-- 凑单减运费  1.有配规则并且开启。2.该店铺下有勾选商品。3.已勾选商品运费大于0并且有能减免的希望。4.当前已勾选商品运费小于运费抵扣金额6元-->
                            <view v-if="shop.freightState==1 && shop.storeOriginalFreight>0" class="freight_box">
                                <view v-if="shop.makeUpGoodsAmount>0" class="freight_con flex_row_between_center">
                                    <view class="freight_con_box flex_row_start_center">
                                        <view class="makeUp_amount">还差
                                            <text class="num-font">{{shop.makeUpGoodsAmount}}</text>{{shop.freightDeference==-1?'元免运费':'可减'}}
                                            <text v-if="shop.freightDeference!=-1"><text class="num-font">{{shop.freightDeference}}</text>元运费</text>
                                        </view>
                                        <view @click="openFreightRules(shop.storeId)" class="ruels_tips"></view>
                                    </view>
                                    <view class="add_on_amount" @click="makeUpAmount(shop.miniProgramLink)">去凑单</view>
                                </view>
                                <view v-else class="freight_con flex_row_start_center">
                                    <view v-if="shop.freightDeference==-1" class="makeUp_amount">已免运费</view>
                                    <view v-else class="makeUp_amount">已减<text class="num-font">{{shop.freightDeference}}</text>元运费</view>
                                    <view @click="openFreightRules(shop.storeId)" class="ruels_tips"></view>
                                </view>
                            </view>
                        </view>
                        <!-- 购物车列表 -->
                        <view class="promotion_block" v-for="(promotion, promotionIndex) in shop.promotionCartGroupList" :key="promotion.promotionId">
                            <template v-if="promotion.promotionType!=0 && promotion.extraInfoVOList">
                                <view class="discount_left">
                                    <view class="discount_icon">满减</view>
                                    <view class="promotion_text">
                                        <view class="discount_text">
                                            <rich-text :nodes="promotionContext(promotion)"></rich-text>
                                        </view>
                                    </view>
                                </view>
                            </template>
                            <view class="discount_activity" v-for="(item, cartIndex) in promotion.cartList" :key="item.cartId">
                                <view class="cart-item">
                                    <swiper-action
                                        @cellOpen="curOperateId = item.sku"
                                        @cellMoving="cellMoving => isCellMoving = cellMoving"
                                        :cellShow="curOperateId === item.sku"
                                        class="cart-item-detail"
                                    >
                                        <view class="image-wrapper flex_row_start_start">
                                            <!-- 商品这一层级的选中与非选中 -->
                                            <text :class="[goodsCheckStyle(item)]"
                                                @click="changeSelectState('goods', item)"></text>

                                            <view class="goods-img" @click.stop="goGoodsDetail(item)">
                                                <image :src="item.mainImage"></image>
                                                <view class="mask" v-if="item.productState == 3">
                                                    <view class="text">
                                                        <view>库 存</view>
                                                        <view>不 足</view>
                                                    </view>
                                                </view>
                                            </view>
                                        </view>
                                        <view class="item-right">
                                            <view class="right_top" @click.stop="goGoodsDetail(item)">
                                                <view class="title" :class="{ stock_not_enough: item.productState == 3 }">
                                                    <!-- 实惠icon -->
                                                    <tagIcon v-if="isShowJdLable(item)" />
                                                    {{ item.skuName }}</view>
                                                <text class="attr" v-if="!!item.specInfo">{{ item.specInfo }}</text>
                                            </view>
                                            <view class="switch_spec_promotion flex_row_start_center">
                                                <view class="goods_spec flex_row_between_center" @click="switchSpec(item)">
                                                    <view>{{ item.specValues || '默认' }}</view>
                                                    <text v-show="item.specValues && item.specValues !== '默认' && !editFlag" class="iconfont icon_arrow_down"></text>
                                                </view>
                                                <view class="trade_promotion_btn flex_row_between_center"
                                                    v-if="!editFlag && item.attendFullReduction"
                                                    @click="showPromotionBox(item,promotion)">
                                                    <text>换促销</text>
                                                    <text class="iconfont icon_arrow_down"></text>
                                                </view>
                                            </view>
                                            <view v-if="item.reduction" class="reduce">比加入时下降 {{item.reductionPrice}} 元</view>

                                             <!--活动描述 start-->
                                            <view v-if="item.singlePromotion!=null && (item.singlePromotion.promotionType == 106 || item.singlePromotion.promotionType==104)" class="ecbuy">
                                                <activeLabel
                                                    :promotionType="item.singlePromotion.promotionType"
                                                    :activeName="item.singlePromotion.promotionName" 
                                                    :startTime="item.singlePromotion.startTime" 
                                                    :endTime="item.singlePromotion.endTime" 
                                                    @activeNoticeEvevt="getCartData"
                                                ></activeLabel>
                                            </view>
                                            <!--活动描述 end-->

                                            <view class="goods_min_number " v-if='item.lowestBuy > 1'>{{ item.lowestBuy }}件起购
                                            </view>
                                            <view class="right_bottom flex_row_between_center">
                                                <view class="right_bottom_left ">
                                                    <view class="price_wrap price_wrap_hide num-font" v-if="item.productPrice">
                                                        <text class="unit rmb">¥</text>
                                                        <text class="price_int">{{ item.isShowCloseBtn ==
                                                            true ? item.productPrice : getPartNumber(item.productPrice, 'int')
                                                        }}</text>
                                                        <text class="price_decimal">{{ item.isShowCloseBtn ==
                                                            true ? '' : getPartNumber(item.productPrice, 'decimal') }}</text>
                                                    </view>
                                                </view>
                                                <view :class="item.productState == 3 ? 'goods_num_wrap' : 'exceed_price_wrap'">
                                                    <block>
                                                        <uni-number-box class="step" :min="item.lowestBuy ? item.lowestBuy : 1"
                                                            :value="item.buyNum" @change="numberChange($event, item, index, promotionIndex, cartIndex)"
                                                            >
                                                        </uni-number-box>
                                                    </block>
                                                    <block v-if="item.isShowCloseBtn == true">
                                                        <image :src="closeImg" mode="" class="close_img"
                                                            @click="closeBigPriceBox(item.cartId, item.spu)">
                                                        </image>
                                                    </block>
                                                </view>
                                            </view>
                                            <view v-if="item.takeHomePrice!=null && item.takeHomePrice<item.productPrice" class="takeHomePriceBox flex_row_start_center">
                                                <text>预估到手价</text>
                                                <view class="price_box">
                                                    <text class="unit">¥ </text>
                                                    <text class="num-font big">{{getPartNumber(item.takeHomePrice,'int')}}</text>
                                                    <text class="num-font small">{{getPartNumber(item.takeHomePrice,'decimal')}}</text>
                                                </view>
                                            </view>
                                            <!-- 参考京东 暂时屏蔽划线价 只显示实时价 2022/6/14 吴嘉琪 6/29加上-->
                                            <view
                                                v-if='item.productOriginalPrice && item.singlePromotion && item.singlePromotion.state == 2'
                                                class='del_price rmb '>
                                                <text class="unit">¥</text>
                                                <text>{{ getPartNumber(item.productOriginalPrice, 'int') }}</text>
                                                <text>{{ getPartNumber(item.productOriginalPrice, 'decimal') }}</text>
                                            </view>
                                        </view>
                                        
                                        <template slot="right">
                                            <view class="rightContent flex_row_center_center">
                                                <view
                                                    class="move"
                                                    @click.stop="operateCartGoods('move', item)"
                                                    v-if="item.isShowCollectBtn == true"
                                                >
                                                    <view>
                                                        <view>移入</view>
                                                        <view>收藏</view>
                                                    </view>
                                                </view>
                                                <view class="del" @click.stop="operateCartGoods('del',item)">
                                                    删除
                                                </view>
                                            </view>
                                        </template>
                                    </swiper-action>
                                </view>
                                <view v-if="item.isBuyTogetherPromotion" class="ecbuyTips">
                                    <view class="text">当前商品正在参与【一起买】活动，请前往商品详情查看购买。</view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>

                <!-- 失效购物车列表 tabIndex == 0:全部标签 -->
                <view class="invalid_list_wrap" v-if="tabIndex == 0 && showData.invalidList.length > 0">
                    <view class="invalid_list_title">
                        <text>失效商品{{ showData.invalidList.length }}件</text>
                        <text @click="clearFailureGoods('open')">清空失效商品</text>
                    </view>
                    <view class="invalid_list_content">
                        <view class="invalid_list_item" v-for="(item2, index2) in showData.invalidList" :key="index2">
                            <view class="invalid_icon">失效</view>
                            <view class="invalid_img">
                                <image :src="item2.mainImage" mode=""></image>
                            </view>
                            <view class="invalid_goods_wrap">
                                <view class="invalid_goods_name">{{ item2.skuName }}</view>
                                <text class="invalid_goods_spec" v-if="item2.specValues">{{ item2.specValues }}</text>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="bottom-placeholder"></view>
            </scroll-view>

            <!-- 底部菜单栏 start -->
            <view :class="['action-section',editFlag?'action_section_edit':'']" :style="!detailsPopupShowFlag ? 'z-index: 1000' : ''"
                v-if="cartList && cartList.length > 0">
                <view @click="chooseAll(showData.checkedAll)" class="checkbox flex_row_start_center ">
                    <text :class="[checkState(showData.checkedAll)]"></text>
                    <text class="check_all_tit">全选</text>
                </view>
                <!-- 去结算样式 start -->
                <template v-if='!editFlag'>
                    <view class="total-box">
                        <view class="money" :class="[tempList.totalDiscount && tempList.totalDiscount > 0?'marTop':'']">
                            <text>合计：</text>
                            <view class="price_wrap num-font">
                                <text class="unit ">¥</text><text class="price_int ">{{ getPartNumber(showData.totalAmount,
                                    'int') }}</text><text class="price_decimal ">{{ getPartNumber(showData.totalAmount,
                                    'decimal') }}</text>
                            </view>
                        </view>
                        <!-- 合计显示优惠的金额 -->
                        <view class="money discount" v-if="showData.totalDiscount && showData.totalDiscount > 0">
                            <text>已减：</text>
                            <view class="price_wrap num-font">
                                <text class="unit ">¥</text><text class="price_int ">{{
                                    getPartNumber(showData.totalDiscount, 'int') }}</text><text class="price_decimal ">{{
                                    getPartNumber(showData.totalDiscount, 'decimal') }}</text>
                            </view>
                            <view @click="showDiscountDetails" class="discount_details flex_row_start_center">
                                <view>优惠明细</view>
                                <view class="triangle_iocn" :class="{triangle_iocn_down:detailsPopupShowFlag}"></view>
                            </view>
                        </view>
                    </view>
                    <button class="no-border confirm-btn" @click="checkConfirmOrder" :disabled="isDisabled">
                        结算<text class="settle_num">({{ showData.totalCheck || '0'}})</text>
                    </button>
                </template>
                <!-- 去结算样式 end -->
                <!-- 点击管理之后的样式 start -->
                <template v-if="editFlag">
                    <view class="flex_row_end_center">
                        <view class="fast_del" @click="openFastDelBox">
                            <text class="iconfont icon_clean"></text>
                            <view class="fast_del_text">快速清理</view>
                        </view>
                        <view class="move_collect flex_row_center_center" @click="batchCollect"
                            v-if="showData.isShowCollectBtn">移入收藏夹</view>
                        <view class="del_more flex_row_center_center" @click="batchDelete('open')">删除所选</view>
                    </view>
                </template>
                <!-- 点击管理之后的样式 end -->
            </view>
            <!-- 底部菜单栏 end-->
        </view>


        <!-- 快速清理弹窗 start-->
        <bottomPopup ref="fastdelPoppup" type="bottom" :showTitle="false" :showCloseBtn="false" class="fast_del_model" height="928rpx">
            <view class="fast_del_box">
                <view class="fast_del_content">
                    <view class="fast_del_top">
                        <view class="top_text">
                            <view class="fast_del_top_text strong">快速清理</view>
                            <view class="fast_del_top_calc" v-if="fastClearList && fastClearList.goodsNum > 0">
                                <view class="fast_del_top_main strong">{{ fastClearList.totalCheck }}</view>
                                <view>/</view>
                                <view>{{ fastClearList.goodsNum }}</view>
                            </view>
                        </view>
                        <view class="top_icon">
                            <view class="top_icon_content">
                                <image src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_close1.svg" mode="" @click="closeFastDelBox">
                                </image>
                            </view>
                        </view>
                    </view>
                    <scroll-view scroll-y="true" class="fast_del_middle">
                        <view class="fast_del_list" v-if="fastClearList && fastClearList.goodsNum > 0">
                            <view v-for="(item, index) in fastClearList.goodsList" :key="index">
                                <view class="fast_del_item" v-if="item && item.List && item.List.length > 0">
                                    <view class="fast_del_name">
                                        <view @click="checkAll(index)" class="checkbox flex_row_start_center ">
                                            <view class="checkAllIcon" v-if="!item.isCheckedAll">
                                                <image src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_radio_nor.svg" />
                                            </view>
                                            <view class="checkAllIcon" v-else-if="item.isCheckedAll">
                                                <image src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/icon_setp_sel3_red.svg" />
                                            </view>
                                            <text class="check_name">{{ item.name }}</text>
                                        </view>
                                    </view>
                                    <view class="fast_del_desc">
                                        <view class="fast_del_desc_item" v-for="(item1, ind) in item.List" :key="ind"
                                            @click="singleCheck(index, ind)">
                                            <view class="single_check">
                                                <view class="checkAllIcon" v-if="!item1.isChecked">
                                                    <image src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_radio_nor.svg" />
                                                </view>
                                                <view class="checkAllIcon" v-else-if="item1.isChecked">
                                                    <image src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/icon_setp_sel3_red.svg" />
                                                </view>
                                            </view>
                                            <view class="good_img">
                                                <view class="mask" v-if="index == 0">
                                                    <view v-if="item1.productState == 3" class="text">
                                                        <view>库 存</view>
                                                        <view>不 足</view>
                                                    </view>
                                                    <view v-else class="text">下架</view>
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
                                <image class="content_img"
                                    src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/empty/icon_defpage_zwnr.png" />
                                <view class="tip_con">暂无商品</view>
                            </view>
                        </view>
                    </scroll-view>
                    <view class="fast_del_bottom" v-if="fastClearList && fastClearList.goodsNum > 0">
                        <view class="move_collect flex_row_center_center" @click="batchCollect('fastCollect')">
                            <text class="move_text">移入收藏</text>
                        </view>
                        <view class="del_more flex_row_center_center" @click="batchDelete('fastDelete')">
                            <text class="del_text">删除</text>
                        </view>
                    </view>
                </view>
            </view>
        </bottomPopup>
        <!-- 快速清理弹窗 end-->

        <!-- 规格弹框 start -->
		<bottomPopup ref="specModel" type="bottom" height="60vh" bgColor="#fff" :showTitle="false" class="spec_model">
			<view class="spec_model_con">
				<view class="spec_model_content" :class="isIos() ? 'ios' : ''">
					<view class="spec_model_top">
						<view class="spec_model_goods">
							<view class="spec_goods_image"
								v-if="goodsData && goodsData.mainImage">
								<image :src="goodsData.mainImage" mode="aspectFit"></image>
							</view>
							<view class="spec_goods_right">
								<view class="spec_goods_price_con">
									<view class="spec_prices" :class="{hide: priceLoading}">
										<view class="spec_goods_price num-font" v-if="goodsData.productPrice">
											<text>￥</text>
											<text>{{getPartNumber(goodsData.productPrice,'int')}}</text>
											<text>{{getPartNumber(goodsData.productPrice,'decimal')}}</text>
										</view>
										<view class="spec_goods_price num-font" v-else>
											<text>￥</text>
											<text>暂无报价</text>
										</view>
									</view>
								</view>
	
                                <view class="spec_goods_des">
                                    已选规格：
                                    <text v-if="goodsData.specValues">{{goodsData.specValues}}</text>
                                    <text v-else>默认</text>
                                </view>
							</view>
						</view>
					</view>

					<!-- 当有区域销售和无货的时候，此时样式需要特殊处理 -->
					<scroll-view scroll-y="true" class="spec_content">
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
					</scroll-view>
				</view>
				
				<view :class="['spec_btn', !!disabledOperate ? 'disable' : '']">
                    <button class="spec_add_cart_btn spec_btn_only" @click="doSwitch">确定</button>
                </view>

			</view>
			<!-- 规格弹框的底部按钮 end -->
		</bottomPopup>

        <!-- 换促销弹框 -->
        <bottomPopup ref="popup" type="bottom" :showTitle="false" height="800rpx" bgColor="#fff" conBackground="#fff">
            <view class="promotion_box">
                <view v-for="(item,index) in promotion_goods_info" :key="index" class="promotion_goods_box" :class="isIos() ? 'ios' : ''">
                    <view class="promotion_goods_wrap">
                        <view class="promotion_goods_img_wrap">
                            <image :src="item.mainImage" mode="aspectFit" class="promotion_goods_img"></image>
                        </view>
                        <view class="promotion_goods_right">
                            <view class="promotion_goods_price">
                                <view class="promotion_goods_price_now">
                                    <text class="small_price">￥</text>
                                    <text class="big_price">{{getPartNumber(item.productPrice,'int')}}</text>
                                    <text class="small_price">{{getPartNumber(item.productPrice,'decimal')}}</text>
                                </view>
                            </view>
                            <view class="promotion_goods_spec">
                                已选：{{item.specValues == ''?'默认规格':item.specValues}}
                            </view>
                        </view>
                    </view>
                    <scroll-view class="promotion_rules_wrap" scroll-y="true">
                        <view>
                            <view class="promotion_rules_title">修改促销</view>
                            <view class="promotion_rule_item" v-for="(item2,index2) in promotion_list" :key="index2" @click="changePromotion(index2,item2.desctiption,item2.promotionId,item2.promotionType)">
                                <text :class="[checkState(promotionId == item2.promotionId && promotionType==item2.promotionType)]"></text>
                                <template>
                                    <view class="promotion_text_wrapper"> 
                                        <view class="promotion_text" v-for="(promotionItem,ind) in item2.discountExtendInfoList" :key="ind">
                                            <rich-text :nodes="formatePromotionDes(promotionItem)"></rich-text>
                                        </view>
                                    </view>
                                    
                                </template>
                            </view>
                        </view>
                    </scroll-view>
                </view>
                <view class="confirm_btn_wrap">
                    <view class="confirm_btn" @click="confirmChangePromotion">确定</view>
                </view>
            </view>
        </bottomPopup>
        <!-- 优惠券弹框 start -->
        <bottomPopup ref="couponPopup" type="bottom" text="领取优惠券" bgColor="#F5F5F5">
            <view class="coupon_model">
                <!-- 有优惠券 -->
                <scroll-view class="coupon_model_list" scroll-y="true" v-if="coupon_list && coupon_list.length>0">
                    <view class="my_coupon_pre" v-for="(item,index) in coupon_list" :key="index">
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
                                    <text class="price_int num-font" :style="{fontSize:getRandomFontSize(item)}">{{getPartNumber(item.randomMin,'int')}}</text>
                                    <text class="price_decimal num-font" v-if="getPartNumber(item.randomMin,'decimal')!='.00'">{{getPartNumber(item.randomMin,'decimal')}}</text>
                                    <text class="unit">~</text>
                                    <text class="unit num-font">¥ </text>
                                    <text class="price_int num-font" :style="{fontSize:getRandomFontSize(item)}">{{getPartNumber(item.randomMax,'int')}}</text>
                                    <text class="price_decimal num-font" v-if="getPartNumber(item.randomMax,'decimal')!='.00'">{{getPartNumber(item.randomMax,'decimal')}}</text>
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
                                    <text>使用规则</text>
                                    <image
                                        :src="item.isOpen ? upTriangleImage : downTriangleImage"
                                        draggable="false"></image>
                                </view>
                            </view>
                            <view class="kacao kacao1" v-if="item.receivedState != 3"></view>
                            <view class="kacao kacao2" v-else></view>
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
                                <view v-else-if="item.receivedState == 2" class="coupon_right"><image :src="hasReceiveBg" mode="" draggable="false"></image></view>
                                <view v-else class="coupon_right haveExpired"><image :src="finishReceiveBg" mode="" draggable="false" /></view>
                            </view>
                        </view>
                        <view class="coupon_rules" v-if="item.isOpen == true">
                            <view>优惠券类型：<text class="coupon_type_text">【{{item.storeId==0?'平台优惠券':'店铺优惠券'}}】</text></view>
                            <view class="coupon_rules_title"><text>{{item.description}}</text></view>
                        </view>
                        <view class="coupon_type fontScaleIgnore" :class="{suiji:item.couponType==3,zhekou:item.couponType==2}">{{item.couponTypeValue}}</view>
                    </view>
                </scroll-view>
                <!-- 无优惠券 -->
                <view class="empty_coupon_wrap" v-if="coupon_list && coupon_list.length == 0">
                    <view class="empty_coupon_img"></view>
                    <view class="empty_coupon_text">该店铺暂无优惠券~</view>
                </view>
            </view>
        </bottomPopup>
        <!-- 优惠券弹框 end -->

        <!-- 商品全部，部分无货弹窗 start-->
        <uni-popup ref="clearPopup" type="dialog">
            <uni-popup-dialog type="input" title="提示" content="确定清空所有失效商品?" :duration="2000"
                @confirm="clearFailureGoods('confirm')"></uni-popup-dialog>
        </uni-popup>
        <!-- 商品全部，部分无货弹窗 end-->
        <uni-popup ref="batchDelPopup" type="dialog">
            <uni-popup-dialog type="input" title="提示" :content="`确定删除${showData.totalCheck}件商品?`" :duration="2000"
                @confirm="batchDelete('confirm')"></uni-popup-dialog>
        </uni-popup>


        <!-- 地址弹窗 start -->
        <bottomPopup class="address_bg" ref="addressChooseComp" type="bottom" showType="show" text="配送地址" height="832rpx"
            bgColor="#fff">
            <addressChoose ref="addressChoose" v-model="choosedAddress" @close="addressPopClose" />
        </bottomPopup>
        <!-- 地址弹窗 end -->
        <!-- 优惠明细弹框 start -->
        <bottomPopup ref="detailsPopup" type="bottom" height="832rpx" @change="discountDialogChange" :showTitle="false">
            <view class="details_box">
                <view class="details_title flex_row_center_center">优惠明细</view>
                <view class="goods_amount flex_row_between_center">
                    <text>商品总额</text>
                    <text class="num-font">￥{{getTotalAmount}}</text>
                </view>
                <view class="goods_amount flex_row_between_center discount_amount">
                    <text>共优惠</text>
                    <text class="num-font">-￥{{showData.totalDiscount}}</text>
                </view>
                <view class="details_rules_tips">以上优惠不包括平台优惠、红包、云豆，请在确认页查看</view>
            </view>
        </bottomPopup>
        <!-- 优惠明细弹框 end -->
        <!-- 运费规则弹框 start -->
        <uniPopup ref="freightRules" class="freight_uniPop">
            <view class="freightRules_box flex_column_between_start">
                <view class="freightRules_con">
                    <view class="title flex_row_center_center">运费凑单说明</view>
                    <view class="con">
                        <scroll-view :scroll-y="true" class="scrollY">
                            <view v-if="freightRulesObj">
                                <view v-if="freightRulesObj.baseFreight!=-1">1、店铺基础运费：<text class="num-font">{{freightRulesObj.baseFreight}}</text>元；</view>
                                <view v-else>1、店铺基础运费：具体以订单内显示的金额为准；</view>
                                <view>
                                    2、该店铺订单金额满
                                    <text class="num-font" v-if="freightRulesObj.storeFreightFullAmount">{{freightRulesObj.storeFreightFullAmount}}</text>元
                                    <text v-if="freightRulesObj.freightDeference==-1">免运费。</text>
                                    <text v-else>减<text class="num-font">{{freightRulesObj.freightDeference}}</text>元运费。</text>
                                </view>
                                <view class="rules_tips">
                                    注：店铺订单金额是指订单内该店铺所有商品的销售价*数量之和再扣除店铺优惠（包括店铺优惠券和店铺满减等）之后的金额，不包括平台优惠。
                                </view>
                            </view>
                        </scroll-view>
                    </view>
                </view>
                <view class="close flex_row_center_center" @click="closeFreightRules">我知道了</view>
                <view class="close_icon" @click="closeFreightRules"></view>
            </view>
        </uniPopup>
        <!-- 运费规则弹框 end -->
    </view>
</template>
<script module="filters" lang="wxs" src="@/utils/filter.wxs"></script>
<script>
    import uniNumberBox from "@/common/components/uni-number-box/uni-number-box.vue";
    import uniPopup from '@/common/components/uni-popup/uni-popup.vue';
    import uniPopupDialog from '@/common/components/uni-popup/uni-popup-dialog.vue';
    import addressChoose from "@/common/components/address/select";
    import tagIcon from '@/common/components/tagIcon';
    import swiperAction from '@/common/components/swiper-action/index.vue'
    import bottomPopup from '@/common/components/uni-popup/uni-popup-bottom.vue'
    import { isNotEmpty, isEmpty, throttle, getPartNumber, accAdd, deepClone, setStorageSync, skipTo, isIos } from '@/utils/common.js'
    import cartHandler from "@/views/components/cart/handler";
    import goodsHandler from "@/views/components/goods/handler.js";
    import config from '@/common/lib/config.js';
    import { mapMutations, mapState } from 'vuex';
    import activeLabel from '@/common/components/activeLabel/activeLabel'

    export default {
        components: {
            uniNumberBox,
            uniPopup,
            uniPopupDialog,
            addressChoose,
            bottomPopup,
            tagIcon,
            swiperAction,
            activeLabel
        },
        computed: {
            ...mapState(['hasLogin']),
            showLoading() {
                // 购物车列表不为空的时候不显示loading
                if(this.showData?.storeCartGroupList?.length){
                    return false
                }
                return true
            },
            titleStyle() {
                if (this.title !== '购物车') {
                    return { fontSize: '26rpx', color: 'grey' };
                }
                return { fontSize: '32rpx', color: '#222', 'font-weight': 'bold'};
            },
            // 筛选条件的paddingTop
            filter_wrapper_padding_top(){
                const gap = 20; // 筛选项与上面地址选择之间的间隙
                const addrCompHeight = 74; // 地址筛选的高度
                return addrCompHeight + gap + 'rpx'
            },
			// 右侧管理购物车商品的文案显示
            titleRightText(){
                if(this.showData?.storeCartGroupList?.length > 0){
                    return this.editFlag ? '完成' : '管理'
                }
                return ''
            },
            fastClearList(){
                if(isEmpty(this.showData)){
                    return;
                }
                let orderList = {
                    goodsNum: this.showData.availableCartNum + this.showData.invalidList.length,
                    totalCheck: 0,
                    goodsList: [
                        {
                            name: '已失效商品',
                            List: this.showData.invalidList,
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
                this.operateAllCarts((good) => {
                    if (!!good.createTime) {
                        const { cartId, mainImage, productState } = good;
                        const param = {
                            isChecked: 0,
                            cartId, 
                            mainImage, 
                            productState
                        }
                        if (this.dateFlag(good.createTime, 7)) {
                            orderList.goodsList[5].List.push(param)
                        } else if (this.dateFlag(good.createTime,30)) {
                            orderList.goodsList[4].List.push(param)
                        } else if (this.dateFlag(good.createTime,180)) {
                            orderList.goodsList[3].List.push(param)
                        } else if (this.dateFlag(good.createTime,365)) {
                            orderList.goodsList[2].List.push(param)
                        } else {
                            orderList.goodsList[1].List.push(param)
                        }
                    }
                }, this.showData);
                return orderList;
            },
            //店铺层级的选中样式
            shopCheckStyle(){
                return (item) => {
                    if(item.lackAll){
                        return 'stock_not_icon iconfont icon_check_radio'
                    } else {
                        if (this.editFlag) {
                            if(item.checkedAll) {
                                return 'item_check iconfont icon_checked_radio'
                            } else {
                                return 'iconfont icon_check_radio'
                            }
                        } else {
                            const isBuyTogetherPromotion = item.promotionCartGroupList.map(cartGroup => cartGroup.cartList).flat().find(cart => cart.isBuyTogetherPromotion)
                            if(item.checkedAll && !isBuyTogetherPromotion) {
                                return 'item_check iconfont icon_checked_radio'
                            } else {
                                return 'iconfont icon_check_radio'
                            }
                        }
                    }
                    
                }
            },
            //商品层级的选中样式
            goodsCheckStyle() {
                return (item) => {
                    if (this.editFlag) {
                        if (item.isChecked) {
                            return 'image-wrapper-check item_check iconfont icon_checked_radio'
                        } else {
                            return 'image-wrapper-check iconfont icon_check_radio'
                        }
                    } else {
                        if (item.isBuyTogetherPromotion){
                            return 'stock_not_icon iconfont icon_check_radio'
                        }
                        if (item.productState == 3) {
                            return 'stock_not_icon iconfont icon_check_radio'
                        } else {
                            if (item.isChecked) {
                                return 'image-wrapper-check item_check iconfont icon_checked_radio'
                            } else {
                                return 'image-wrapper-check iconfont icon_check_radio'
                            }
                        }
                    }
                }
            },
            //通用选中样式
            checkState(){
                return (flag) => {
                    if (flag) {
                        return 'item_check iconfont icon_checked_radio'
                    } else {
                        return 'iconfont icon_check_radio'
                    }
                }
            },
            getTotalAmount() {
                return accAdd(this.showData?.totalAmount?this.showData.totalAmount:0,this.showData?.totalDiscount?this.showData.totalDiscount:0)
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
            // 全部数量
            availableCartNum() {
                return this.showData.availableCartNum || 0;
            }, 
            // 降价数量
            reductionNum() {
                return this.showData.reductionNum || 0;
            }, 
            // 购物车列表接口返回的数据
            rawData() {
                return this.$store.state.cartData;
            },
            // 购物车商品数量
            cartNum() {
                return this.$store.state.cartNum;
            },
            // 购物车列表
            cartList() {
                let data = deepClone(this.showData);
                if (this.showData.reductionNum == 0) {
                    this.tabIndex = 0;
                }
                if (this.tabIndex == 1) {
                    data.storeCartGroupList = data.storeCartGroupList.filter((store) => {
                        store.promotionCartGroupList = store.promotionCartGroupList.filter((promotion) => {
                            promotion.cartList = promotion.cartList.filter((item) => {
                                return item.reduction == true
                            })
                            return promotion.cartList.length != 0
                        })
                        return store.promotionCartGroupList.length !=0
                    })
                } 
                return data.storeCartGroupList || [];
            },
        },
        props: {
            custom: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                upTriangleImage: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/uptriangle2%402x.png',
                downTriangleImage: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_downtriangle2%402x.png',
                radioImage: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_radio_nor.svg',
                weizhi: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_weizhi.svg',
                storeLogo: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/goods/store_logo.png',
                upTriangleImage: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/uptriangle2%402x.png',
                downTriangleImage: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_downtriangle2%402x.png',
                hasReceiveBg: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/coupon/icon_yhq_yilingqu.svg',
                finishReceiveBg:'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/coupon/icon_common_yiqiangwan.svg',
                editFlag: false, //是否编辑标识
                total: 0, //总价格
                allChecked: false, //全选状态  true|false
                nav_left_icon: '', //底部tab进入的话为空，否则为back
                curOperateId: '', //当前长按的商品购物车id,登录时为cartId，未登录时为goodsId
                showData: {}, // 购物车列表接口返回的数据 会经过筛选条件变更
                isShowBigNumBox: -1, //是否展示价格过长样式
                isShow: true, //重载页面
                closeImg: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/recharge_fail.png',
                isShowCloseBtn: false, //是否展示数量加减关闭按钮
                showPrice: '',
                ifOnShow: false, //从其他页面进入时重载当前页面
                isDisabled: false, //结算按钮是否禁用
                is_checked: true,
                is_show_more_rules: false, //是否展开优惠券使用规则
                pageCurrent: 1, //优惠券列表，页
                pageSize: 10, //优惠券列表 每页的条数
                coupon_list: null, //优惠券列表
                currIndex: 0,
                cartId: '',
                choosedAddress: {}, //选中的地址对象
                showAddressPop: false, //控制地址右侧弹窗的变量
                showAddressAnimate: false, //控制地址弹窗显示的动画
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
                rondomMod:false,    //随机弹框
                isCellMoving: false,
                decoData:[],//优惠券装修数据
                couponIds:[],//优惠券装修ids
                storeCouponList:[],//店铺优惠券信息
                tabIndex: 0, // 当前筛选标签下标 0:全部 1：降价
                
                currentStoreId:6, //当前优惠券弹框的storeId
                freightRulesObj:null,
                detailsPopupShowFlag: true,
                promotion_goods_info: [], //换促销商品信息
                promotion_list: [], //促销列表
                promotionDes: '',
                promotionId: '',
                promotionType: '',
                title: '购物车',
                triggered: false, // 当前下拉刷新状态
                goodsData: {}, // 切换规格的购物车商品
                specs: [], // 商品的规格列表
                sku: '', // 切换的商品的sku
                priceLoading: false, // 获取价格接口的loading状态
                onSale: true, // 商品是否正常售卖
                preSku: '', // 切换规格之前的sku
                isTop: true, // 是否滚动到顶部
            };
        },
        watch: {
            choosedAddress: {
                handler(val,oldVal) {
                    // 切换地址重新拉取购物车数据
                    if (val.addressId != oldVal.addressId) {
                        this.getCartData();
                    }
                },
                deep: true
            },
            rawData: {
                handler(val) {
                    if (val && val.storeCartGroupList) {
                        this.renderCart()
                    } 
                },
                immediate: true,
                deep: true
            },
            title(val) {
                if (!this.custom) {
                    wx.setNavigationBarTitle({
                        title: val
                    })
                }
            }
        },
        mounted() {
            // 获取券信息
            this.getDecoraData()
        },
    
        methods: {
            isIos,
            // 处理金额的显示
            getPartNumber,
            ...mapMutations(['updateCartData', 'updateCartNum']),
            reloadData() {
                this.editFlag = false;
            },
            // 渲染购物车
            renderCart() {
                this.showData = deepClone(this.rawData);
                if (this.showData.reductionNum == 0) {
                    this.tabIndex = 0;
                }
                this.operateAllCarts((item) => {
                    if (item.singlePromotion && item.singlePromotion.promotionType == 106 && Object.keys(item.singlePromotion).length>0 && item.singlePromotion.state == 2){
                        item.isBuyTogetherPromotion = true
                    } else {
                        item.isBuyTogetherPromotion = false
                    }
                })
                // 这里不能用接口返回的checkedAll，所有checkedAll需要前端来刷新
                this.refreshCheckState();
                this.handleState(this.showData)
                // 处理店铺右上角领券显示
                this.handleStoreCoupon();
            },
            // 判断商品时间是否在n天之后
            dateFlag(goodTime, otherDay) {
                let time = new Date(goodTime.replace(/-/g,"/")).getTime();
                let standTime = new Date().getTime() - otherDay * 1000 * 24 * 60 * 60
                return time > standTime;
            },
            //关闭快速清理弹窗时，将选中效果清除
            clearcheck() {
                this.fastClearList.totalCheck = 0;
                this.fastClearList.goodsList.forEach((item) => {
                    item.isCheckedAll = 0;
                    item.List.forEach((temp) => {
                        temp.isChecked = 0;
                    })
                })
                this.$forceUpdate()
            },
            // 处理商品是否可收藏可删除等
            handleState(showData) {
                this.operateAllCarts((cart) => {
                    let price = cart.productPrice?.toString().split('.')[0] || 0;
                    // 接口未返回该商品是否已经加入收藏, 故所有商品均显示收藏按钮
                    cart.isShowCollectBtn = true
                    if (price.length > 5 && this.isShowBigNumBox != cart.cartId) {
                        cart.isShowCloseBtn = false
                    } else if(price.length > 5) {
                        cart.isShowCloseBtn = true
                    } else {
                        cart.isShowCloseBtn = false
                    }
                }, showData)
                showData.isShowCollectBtn = true;
                this.showData = showData;
                this.$forceUpdate()
                this.checkNum()
            },
            // 切换tab 全部和降价
            tabChange(index) {
                this.tabIndex = index;
            },
            //从购物车获取数据
            async getCartData(onlyGetCheckedGoods) {
                let param = {
                    addressId: this.choosedAddress?.addressId || "",
                }
                if (isNotEmpty(onlyGetCheckedGoods)) {
                    param.checked = onlyGetCheckedGoods
                }
                this.showLoading && this.$refs?.loading?.open();
                await this.$store.dispatch('getCartList', param).catch(err => {
                    uni.showToast({
                        title: err,
                        icon:'none'
                    })
                })
                setTimeout(() => {
                    this.$refs?.loading?.close();
                }, 100)    
            },

            
            //确认订单前，检验商品是否可结算
            checkConfirmOrder() {
                let orderConfirm = this.getOrderConfirmParamFromCartList();
                // 先清空
                setStorageSync('orderConfirm', '')
                setStorageSync('orderConfirm', orderConfirm)
                this.$Router.push({
                    path: '/views/order/confirm/index',
                    query: {
                        orderType: 1,
                        ifcart: 1
                    }
                })
            },
            // 获取下单页的必要参数
            getOrderConfirmParamFromCartList() {
                try {
                    let goodsData = []
                    this.showData?.storeCartGroupList?.forEach(storeItem => {
                        let productList = [];
                        let products = []; //确认订单的必要参数
                        const { storeName, storeId } = storeItem;

                        storeItem.promotionCartGroupList?.forEach(promotionItem => {
                            promotionItem.cartList.forEach(cartItem => {
                                if(cartItem.isChecked == 1){

                                    const { storeId, ownShop, sku, skuName, buyNum, productPrice, stageId, cartId,
                                        categoryId3, cidPath, specValues, mainImage, singlePromotion,
                                        promotionDes, promotionId, promotionType } = cartItem;
                                        
                                    products.push({
                                        storeId,
                                        ownShop,
                                        sku,
                                        number: buyNum,
                                        notAttendDiscount: !!!cartItem.promotionId,
                                        salePrice: productPrice,
                                        categoryId3,
                                        cidPath,
                                        discountVO: {
                                            promotionDes: promotionDes || '',
                                            promotionId,
                                            promotionType,
                                            stageId
                                        },
                                        specialOfferVO: !!singlePromotion?.promotionId ? {
                                            promotionDes: singlePromotion?.promotionDes || '',
                                            promotionId: singlePromotion?.promotionId,
                                            promotionType: singlePromotion?.promotionType,
                                            stageId: singlePromotion?.stageId
                                        } : null
                                    })

                                    
                                    productList.push({
                                        skuName, 
                                        specValues,
                                        mainImage,
                                        buyNum,
                                        storeName,
                                        price: productPrice,
                                        sku,
                                        cartId,
                                    })
                                     
                                }
                            })
                        })
                        if(products.length > 0 && productList.length > 0){
                            goodsData.push({
                                productList,
                                products,
                                storeName,
                                ownShop: products[0].ownShop,
                                storeId,
                            })
                        }
                          
                    })
                    return { goodsData }
                } catch (error) {
                    console.log(error)
                }
            },

            // 快速清理单选
            singleCheck(index, ind) {
                if (this.fastClearList.goodsList[index].List[ind].isChecked == 0) {
                    this.fastClearList.goodsList[index].List[ind].isChecked = 1
                    this.fastClearList.totalCheck++
                    let num = 0
                    this.fastClearList.goodsList[index].List.forEach((item) => {
                        if(item.isChecked == 1){
                            num++
                        }
                    })
                    if (num == this.fastClearList.goodsList[index].List.length) {
                        this.fastClearList.goodsList[index].isCheckedAll = 1
                    }
                } else {
                    this.fastClearList.goodsList[index].List[ind].isChecked = 0
                    this.fastClearList.totalCheck--
                    this.fastClearList.goodsList[index].isCheckedAll = 0
                }
                this.$forceUpdate()
            },
            // 快速清理全选
            checkAll(index) {
                if (this.fastClearList.goodsList[index].isCheckedAll == 0) {
                    this.fastClearList.goodsList[index].isCheckedAll = 1
                    this.fastClearList.goodsList[index].List.forEach((item) => {
                        item.isChecked = 1
                    })
                } else {
                    this.fastClearList.goodsList[index].isCheckedAll = 0
                    this.fastClearList.goodsList[index].List.forEach((item) => {
                        item.isChecked = 0
                    })
                }
                let total = 0;
                if (this.fastClearList && this.fastClearList.goodsNum > 0) {
                    this.fastClearList.goodsList.forEach((item) => {
                        item.List.forEach((temp) => {
                            if(temp.isChecked == 1){
                                total++
                            }
                        })
                    })
                }
                this.fastClearList.totalCheck = total;
                this.$forceUpdate()
            },
            //全选状态处理 type, index
            chooseAll(isCheckedAll) {
				let cartIds = '';
                this.operateAllCarts((cart) => {
                    cartIds += cart.cartId + ','
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
                this.$refs?.loading?.open();
				cartHandler.checkedCarts(param).then(res => {
					if (res.state == 200) {
						if(!this.editFlag){
							this.getCartData(true);
						}
					} else {
						uni.showToast({
							title: res.msg,
							icon:'none'
						})
						//回滚操作
						checkFunc(!param.checked)
					}
				}).catch(e => {
					//回滚选中操作
					checkFunc(!param.checked)
					console.error(e)
				}).finally(() => {
                    if (this.editFlag) {
                        this.$refs?.loading?.close();
                    }
                })
            },
            // 点击商品、店铺状态选中处理
            changeSelectState(type, cartItem) {
                // editFlag 管理状态需要选中
                const editFlag = this.editFlag;
                let isChecked;
                let { cartId, sku, storeId } = cartItem;
				let cartIds = ''
				if (type == 'goods') { //商品
					isChecked = cartItem.isChecked;
					cartIds = cartId
                    if (!editFlag && cartItem.isBuyTogetherPromotion) {
                        return;
                    }
				} else { // 店铺
					isChecked = cartItem.checkedAll;
                    this.showData.storeCartGroupList?.forEach(store => {
                        if (store.storeId == storeId) {
                            store.promotionCartGroupList?.forEach(promotion => {
                                promotion.cartList?.forEach((cart) => {
                                    if (!cart.isBuyTogetherPromotion) {
                                        cartIds += cart.cartId + ','
                                    } 
                                })
                            })
                        }
                    })
					cartIds = cartIds.substring(0, cartIds.length - 1)
				}
				let param = {
					cartIds,
					checked: isChecked == 1 ? 0 : 1
				}
                const store = this.showData.storeCartGroupList.filter(store => store.storeId == storeId)[0] || {};
				let checkFunc = function(state) {
                    let isBuyTogetherPromotion = false;
					if (type == 'goods') {
                        store.promotionCartGroupList.forEach(e => {
                            e.cartList.forEach(item => {
                                if (item.sku == sku) {
                                    item.isChecked = state;
                                }
                            })
                        })
					} else {
						store.promotionCartGroupList.forEach(promotion => {
							promotion.cartList.forEach(cart => {
                                if (!cart.isBuyTogetherPromotion || editFlag) {
                                    cart.isChecked = state;
                                } else {
                                    isBuyTogetherPromotion = false;
                                }
							})
						})
                        store.checkedAll = isBuyTogetherPromotion ? false : !isChecked;
					}
				}
                
				//前置选中操作
				checkFunc(param.checked)
				this.refreshCheckState();
				if (cartItem.productState == 3) { return }
                this.$refs?.loading?.open();
				cartHandler.checkedCarts(param).then(res => {
					if (res.state == 200) {
						!this.editFlag ? this.getCartData(true) : this.$refs?.loading?.close(); ;
					} else {
						//回滚选中操作
						checkFunc(!param.checked)
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
						this.$refs?.loading?.close();
					}
				}).catch(e=>{
					//回滚选中操作
					checkFunc(!param.checked)
					console.error(e)
					this.$refs?.loading?.close();
				})
            },
            //购物车数量加减
            numberChange(numObj, cartItem, storeIndex, promotionIndex, goodsIndex) {
                let that = this;
                let numObjNew = JSON.parse(JSON.stringify(numObj))
                let num = Number(numObjNew.value);
                let preNum = Number(numObjNew.preValue);
                if(num > 999){
                    num = 999
                    uni.showToast({
                        title: '超过最大购买量',
                        icon: 'none'
                    })
                }
                throttle(() => {
					let param = {
						cartId: cartItem.cartId,
						number: num > cartItem.lowestBuy ? num : cartItem.lowestBuy,
						addressId: that.choosedAddress?.addressId || ''
					}
					//前置操作
                    const goods = this.showData.storeCartGroupList[storeIndex].promotionCartGroupList[promotionIndex].cartList[goodsIndex];
                    goods.buyNum = param.number
                    this.$refs?.loading?.open();
                    let reqCartData = false;
					cartHandler.changeCartNum(param).then(res => {
						if (res.state == 200) {
                            if (res.data) {
                                const { buyNum, productState } = res.data;
                                goods.buyNum = buyNum;
                                goods.productState = productState;
                            }
							if(cartItem.isChecked && !this.editFlag){
                                reqCartData = true;
								this.getCartData(true);
							}
						}else {
							goods.buyNum = preNum;
                            uni.showToast({
                                title: res.msg,
                                icon: 'none'
                            })
							return
						}
					}).catch(e=>{
						console.error(e);
                        goods.buyNum = preNum;
					}).finally(() => {
                        !reqCartData && this.$refs?.loading?.close();
                    })
                }, 1000);
            },
            // 批量删除
            batchDelete(type) {
                let cartIds = ''
                let checkedNum = 0
                if (type == "fastDelete") {
                    this.fastClearList.goodsList.forEach(item => {
                        item.List.forEach(item1 => {
                            if (item1.isChecked == 1) {
                                checkedNum++
                                cartIds += item1.cartId + ','
                            }
                        })
                    })
                } else {
                    this.operateAllCarts((cart) => {
                        if (cart.isChecked == 1) {
                            checkedNum++
                            cartIds += cart.cartId + ','
                        }
                    })        
                }
                let cartNum = this.cartNum - checkedNum;
                    cartNum = cartNum < 0 ? 0 : cartNum;
                switch (type) {
                    case 'open': {
                        if (checkedNum == 0) {
                            uni.showToast({
                                title: '请选择删除的商品！',
                                icon: 'none'
                            })
                        } else {
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
                            this.fastClearList.totalCheck = checkedNum
                            cartIds = cartIds.substring(0, cartIds.length - 1)
                            let param = {cartIds}
                            cartHandler.deleteCarts(param).then(res => {
                                if (res.state == 200) {
                                    uni.showToast({
                                        title: '删除成功！',
                                        icon: 'none'
                                    })
                                    this.updateCartNum(cartNum)
                                    this.deleteProduct(cartIds.split(','));
                                    this.showData.isShowCollectBtn = true
                                }
                            })
                        }
                        break;
                    }
                    case 'confirm': {
                        this.$refs.batchDelPopup.close()
						cartIds = cartIds.substring(0, cartIds.length - 1)
						let param = {cartIds}
						cartHandler.deleteCarts(param).then(res => {
							if (res.state == 200) {
								uni.showToast({
									title: '删除成功！',
									icon: 'none'
								})
                                this.updateCartNum(cartNum)
								this.deleteProduct(cartIds.split(','));
							}
						})
                        break;
                    }
                }
            },
            // 批量移入收藏夹
            batchCollect(type) {
                let cartId = ''
                let checkedNum = 0
                if (type == "fastCollect") {
                    this.fastClearList.goodsList.forEach(item => {
                        item.List.forEach(item1 => {
                            if (item1.isChecked == 1) {
                                checkedNum++
                                cartId += item1.cartId + ','
                            }
                        })
                    })
                } else {
                    this.operateAllCarts((cart) => {
                        if (cart.isChecked == 1) {
                            checkedNum++
                            cartId += cart.cartId + ','
                        }
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
                    this.$refs?.loading?.open();
                    cartHandler.moveToCollection(param).then(res => {
                        if (res.state == 200) {
                            uni.showToast({
                                title: '收藏成功',
                                icon: 'none'
                            })
                            this.curOperateId = ''
                            let cartNum = this.cartNum - checkedNum;
                                cartNum = cartNum < 0 ? 0 : cartNum;
                            this.updateCartNum(cartNum)    
                            this.deleteProduct(cartId.split(','));
                            this.showData.isShowCollectBtn = true
                        }
                    }).finally(() => {
                        this.$refs?.loading?.close();
                    })
                }
            },
            // 计算结算数量及改变按钮样式
            checkNum() {
                let checkedLen = 0
                this.operateAllCarts((cart) => {
                    if (cart.isChecked == 1 && cart.productState == 1) {
                        checkedLen++
                    }
                })
                this.isDisabled = checkedLen == 0
            },
            
            //管理购物车数据
            async manageCart() {
                this.editFlag = !this.editFlag;
                if (!!this.showData.storeCartGroupList?.length) {
                    if (this.editFlag) {
                        // 店铺全选但是商铺下有库存不足商品时, 在管理状态下也需要勾选, 因为可能移入收藏夹
                        this.showData.storeCartGroupList.forEach((item)=>{
                            if (item.checkedAll || this.showData.checkedAll){
                                item.promotionCartGroupList.forEach(item1 => {
                                    item1.cartList.forEach(item2 => {
                                        if (item2.productState == 3){
                                            item2.isChecked  = 1;
                                        }
                                    })
                                })
                            }
                        })                    
                    } else {
                        await this.getCartData(true);
                    }
                    this.checkNum()
                }
            },
             /*
             *操作商品事件
             * type: move移入收藏夹，del删除商品
             */
             operateCartGoods(type, cartItem) {
                let cartId = cartItem.cartId;
                let param = {
                    cartIds: cartId,
                }
                let isCollect = type == 'move';
                cartHandler[isCollect ? 'moveToCollection' : 'deleteCarts'](param).then(res => {
                    if (res.state == 200) {
                        if (isCollect) {
                            this.curOperateId = ''
                        }
                        uni.showToast({
                            title: `${isCollect ? '收藏' : '删除'}成功！`,
                            icon: 'none'
                        })
                        let cartNum = this.cartNum - 1;
                            cartNum = cartNum < 0 ? 0 : cartNum;
                        this.updateCartNum(cartNum);
                        this.deleteProduct([cartId + '']);
                    }
                })
            },
            //进入商品详情页
            goGoodsDetail({sku, mainImage, storeId}) {
                if (this.isCellMoving) { return }
                this.$Router.push({
                    path: '/views/goods/detail/index',
                    query: {
                        sku,
                        storeId,
                        mainImage
                    }
                })
            },
            // 编辑数量关闭数量加减
            closeBigPriceBox(cartId) {
                this.isShowBigNumBox = -1;
                this.operateAllCarts((cart) => {
                    if (cart.cartId == cartId) {
                        cart.isShowCloseBtn = false
                    }
                })
                this.getCartData()
            },
            // 切换产品规格
            switchSpec(item) {
                // 没有规格不切换 管理状态下也不切换
                if (!item.specValues || item.specValues === '默认' || this.editFlag) {
                    return;
                }
                const sku = item.sku;
                this.preSku = sku;
                this.$refs?.loading?.open()
                this.goodsData = item;
                this.sku = sku;
                cartHandler.getSimilarProduct({ sku }).then(res => {
                    if (res.state == 200) {
                        this.specs = res.data.specs || [];
                        // 兼容服务端不返回规格的情况
                        if (!this.specs.length) {
                            this.specs.push({
                                dim: 1,
                                specName: '规格',
                                specAttrList: [{ imagePath: item.mainImage, skus: [sku], specValue: item.specValues }]
                            })
                        }
                        this.$refs.specModel.open()
                    }
                }).finally(() => {
                    this.$refs?.loading?.close()
                })
            },
            /**
             * 切换商品规格id
             * @param {str} sku 当前所选商品id，beforeChange
             * @param {arr} skuIds 商品规格list
             * @param {arr} dim 维度
             */
            async changeSpecSku(sku, skuIds, dim){
                if ('isDisable' == this.setSpecSkuType(sku, skuIds, dim)) {
                    return;
                }
                let that = this;
                let tempList = that.getDimSkus(sku, skuIds, dim); //获取每个维度下的skuIds
                let tempListFilter = tempList.reduce((a, b) => a.filter(c => b.includes(c))); //获取每个维度skuIds的交集
                this.sku = tempListFilter[0];
                if (tempListFilter.length) {
                    let state = await that.getGoodsDetail(true);
                    if (state!=200){
                        this.sku = sku;
                    }
                } else {
                    return false;
                }
            },
            /**
             * 计算规格是否可选
             * @param {str} sku 当前所选商品id
             * @param {arr} skuIds 商品规格list
             * @param {arr} dim 维度
            */
            setSpecSkuType(sku,skuIds,dim) {
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
            getDimSkus(sku,skuIds,dim) {
                let resList = [];
                let length = this.specs.length;
                for(let i=0;i<length;i++){
                    let value = this.specs[i];
                    if(dim == value.dim){//点击的按钮所属的维度
                        resList.push(skuIds);
                    }else{//非当前维度
                        let len = value.specAttrList.length;
                        for(let j=0;j<len;j++){
                            if (this.arrhaveitem(sku,value.specAttrList[j].skus)) {
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
            //获取商品详情信息
            getGoodsDetail() {
                let success = false;
                this.$refs?.loading?.open()
                return new Promise((resolve)=>{
                    goodsHandler.getDetail({
                        sku: this.sku //货品sku
                    }).then(async res => {
                        if (res.state == 200) {
                            success = true;
                            let { cartId, buyNum } = this.goodsData;
                            // 保存cartId
                            this.goodsData = res.data; //详情信息
                            this.goodsData.cartId = cartId;
                            this.goodsData.buyNum = buyNum;

                            const { categoryId1, categoryId2, categoryId3, storeId } = res.data;
                            // 查询商品价格相关的信息
                            this.getGoodsPrice(categoryId1, categoryId2, categoryId3, storeId);
                        }
                        resolve(res.state);
                    }).finally(() => {
                        if (!success) {
                            this.$refs?.loading?.close()
                        }
                    })
                })
            },
            /*
			 * 获取商品价格相关的信息【批量接口】
			 */
            getGoodsPrice(categoryId1, categoryId2, categoryId3, storeId) {
                return new Promise(resolve => {
                    let param = {
                        products: [
                            {
                                sku: this.sku,
                                categoryId1,
                                categoryId2,
                                categoryId3,
                                storeId,
                            }
                        ]
                    }
                    this.priceLoading = true;
                    goodsHandler.getProductPrice(param).then(res => {
                        if(res.state == 200 && res.data?.products?.length > 0){
                            this.goodsData.productPrice = res.data.products[0].salePrice;
                            this.onSale = true;
                        } else {
                            this.goodsPriceInfo = {} // 查询接口没有返回的时候，此时直接置空价格对象
                            this.onSale = false; // 将商品按下架状态处理
                        }
                        resolve(true)
                    }).catch(e => {
                        this.goodsPriceInfo = {} // 查询接口没有返回的时候，此时直接置空价格对象
                        this.onSale = false; // 将商品按下架状态处理
                        resolve(true)
                    }).finally(() => {
                        this.priceLoading = false;
                        this.$refs?.loading?.close()
					})
                })
            },
            // 确认切换
            doSwitch() {
                if (this.preSku == this.sku) {
                    this.$refs.specModel.close();
                    return;
                }
                this.$refs?.loading?.open()
                let reqSuccess = false;
                // 最小购买数不为1时候, 需要将购物车里的购买数量更改为最小修改数量
                const { buyNum, cartId, lowestBuy } = this.goodsData;
                const number = lowestBuy && lowestBuy > buyNum ? lowestBuy : buyNum;
                const params = {
                    sku: this.sku,
                    addressId: this.choosedAddress.addressId || '',
                    cartId,
                    number,
                }
                cartHandler.switchSpec(params).then((res) => {
                    if (res.state == 200) {
                        reqSuccess = true;
                        this.getCartData()
                        setTimeout(() => {
                            this.$refs.specModel.close();
                        }, 500);
                    } else {
                        uni.showToast({
                            title: res.msg,
                            icon: 'none'
                        })
                    }
                }).finally(() => {
                    if (!reqSuccess) {
                        this.$refs?.loading?.close()
                    }
                })
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
                                couponCountRemaining: -1,
                                promotionDescription: item.desctiption
                            })
                        } else {
                            item.discountExtendInfoList.forEach(e => {
                                e.promotionDescription = this.getDiscount(item.promotionType, e);
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
                    this.$refs.popup.open();
                })

            },
            // 清空失效商品
            clearFailureGoods(type) {

                switch (type) {
                    case 'open': {
                        this.$refs.clearPopup.open()
                        break;
                    }
                    case 'confirm': {
                        this.$refs.clearPopup.close()
                        let param = {
                            invalidCartList:[]
                        }
                        param.invalidCartList = this.showData?.invalidList?.map(arr => arr.cartId)
                        cartHandler.clearInvalid(param).then(res => {
                            if (res.state == 200) {
                                this.showData.invalidList = []
                                uni.showToast({
                                    title: '清除成功！',
                                    icon: 'none'
                                })
                            }else{
                                uni.showToast({
                                    title: res.msg,
                                    icon: 'none'
                                })
                            }
                        })
                        break;
                    }
                }
            },
            //打开快速清理弹窗
            openFastDelBox(){
                this.clearcheck()
                this.$refs.fastdelPoppup.open();
            },
            // 关闭快速清理弹窗
            closeFastDelBox() {
                this.clearcheck()
                this.$refs.fastdelPoppup.close();
            },
            // 打开某店铺的优惠券弹框
            getShopCouponModule(storeId){
                this.currentStoreId = storeId
                this.$refs.couponPopup.open()
                this.storeCouponList.forEach((item) => {
                    item.isOpen = false;
                })
                let arr = this.storeCouponList.filter((item)=>{
                    return item.storeId == storeId
                })
                this.coupon_list = arr || []
                
            },
            //规则展开
            descriptionOpen(couponId) {
                this.coupon_list?.map(item => {
                    if (item.couponId == couponId) {
                        if (item.description != '') {
                            item.isOpen = !item.isOpen
                        }
                    }
                })
                this.$forceUpdate()
            },
            //立即领取
            goReceive(item) {
                let that = this;
                let couponId = item.couponId
                let param = {couponId};
                cartHandler.receiveCoupon(param).then(res => {
                    if (res.state == 200) {
                        let result = res.data;
                        this.getDecoCouponList()
                        uni.showToast({
							title:'领取成功！',
							icon:'none'
						})
                        if(item.couponType == 3){    //随机优惠券
                            that.rondomMod = true;
                            that.rondomDes = result;
                        }
                    } else {
                        this.getDecoCouponList()
                        uni.showToast({
							title:res.msg,
							icon:'warning'
						})
                    }
                }).catch((e) => {
                    //异常处理
                })
            },


            /**
             * 公共函数（防止每个地方都写一遍这个遍历）： 处理每个商品
             */
            operateAllCarts(callback, showData = this.showData){
                showData.storeCartGroupList?.forEach(store => {
                    store.promotionCartGroupList?.forEach(promotion => {
                        promotion.cartList?.forEach((cart, index) => {
                            callback?.(cart, index);
                        })
                    })
                })
            },

            /**
             * 刷新check状态、计算总数量
             */
             refreshCheckState() {
                // 更新选中状态
                let checkedAllflag = true
                for (let j = 0; j < this.showData.storeCartGroupList.length; j++) {
                    let store = this.showData.storeCartGroupList[j];
                    // 店铺是否全选
                    store.checkedAll = true;
                    for (let i = 0; i < store.promotionCartGroupList.length; i++) {
                        let promotion = store.promotionCartGroupList[i];
                        let uncheckedList = promotion.cartList.filter(e => e.productState == 1 || (e.productState == 3 && this.editFlag)).filter(cart => !cart.isChecked)
                        if (uncheckedList.length) {
                            store.checkedAll = false;
                            break;
                        }
                    }
                    if (!store.checkedAll) {
                        checkedAllflag = false;
                        continue
                    }
                }
                
                this.showData.checkedAll = checkedAllflag;

                // 购物车商品总数
                let availableCartNum = 0;
                // 购物车商品总数
                let totalCheck = 0;
                // 更新购物车商品总数和购物车商品总数
                this.operateAllCarts(cart => {
                    availableCartNum++;
                    if (this.editFlag) {
                        !!cart.isChecked && totalCheck++
                    } else {
                        cart.productState == 1 && !!cart.isChecked && totalCheck++;
                    }
                })
                this.showData.totalCheck = totalCheck;
                this.showData.availableCartNum = availableCartNum + this.showData.invalidList.length;
            },

            /**
             * 删除页面上的商品
             */
            deleteProduct(cartIds) {
                // 是否勾选
                let isChecked = false;
                // 1. 删除指定商品
                this.showData.storeCartGroupList = this.showData?.storeCartGroupList?.filter((item) => {
                    item.promotionCartGroupList = item?.promotionCartGroupList.filter((item1) => {
                        for (let i = 0; i < item1.cartList.length; i++) {
                            let goods = item1.cartList[i];
                            if (goods.isChecked) {
                                isChecked = true;
                                break
                            }
                        }
                        item1.cartList = item1.cartList.filter((item2) => {
                            return !cartIds.includes(item2.cartId + '');
                        })                        
                        return item1.cartList.length != 0
                    })
                    return item.promotionCartGroupList.length != 0
                })
                
                // 2. 更新失效商品列表
                this.showData.invalidList = this.showData.invalidList?.filter((item) => !cartIds.includes(item.cartId + '')) || [];
                // 3. 更新availableCartNum           
                this.showData.availableCartNum -= cartIds.length
                // 4. 如果是降价 更新降价数量
                if (this.tabIndex == 1) {
                    this.showData.reductionNum -= cartIds.length;
                }
                // 5. 如果有选中了的商品，则需要刷新总价
                if (isChecked) {
                    this.getCartData(true);
                }
            },

            
            // 打开选择地址列表
            showAddressList(){
                this.$refs.addressChooseComp.open();
            },
            // 关闭地址选择的弹窗
            addressPopClose() {
                this.$refs.addressChooseComp.close();
            },
            // 获取领券中心装修数据
            getDecoraData() {
                let param = {
                    decoId: config.COUPON_TOPIC_ID,
                    type: 'topic'
                }
                cartHandler.getTopicDeco(param).then(res => {
                    if (res.state == 200 && !!res.data) {
                        if (res.data.data == null){
                            this.decoData = []
                            return
                        } else {
                            this.decoData = JSON.parse(res.data.data || "[]");
                            this.decoData.forEach(item => {
                                // 遍历装修数据获取优惠券Id集合
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
                        }
                    }else{
						console.log('未获取到装修的领券中心装修的数据');
					}
                })
            },
            // 获取优惠券数据
            getDecoCouponList() {
                if (this.couponIds.length === 0) {
                    return
                }
                let param = {};
                param.couponIds = this.couponIds;
                cartHandler.couponCenter(param).then(res => {
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
            handleStoreCoupon() {
                if (this.showData && this.showData.storeCartGroupList) {
                    this.showData.storeCartGroupList.forEach(item => {
                        let flag = this.storeCouponList.some((item1)=>{return item.storeId == item1.storeId})
                        this.$set(item,'hasCoupon',flag)
                    })
                }
            },
            // 显示优惠详情
            showDiscountDetails() {
                if (this.detailsPopupShowFlag) {
                    this.detailsPopupShowFlag = false;
                    this.$refs.detailsPopup.open()
                } else {
                    this.$refs.detailsPopup.close()
                }
            },
            // 优惠详情弹框显隐改变
            discountDialogChange({ show }) {
                // show为false表示关闭弹框
                if (!show) {
                    // 底部z-index是根据detailsPopupShowFlag动态设置的, 延时是为了解决闪动的问题
                    setTimeout(() => {
                        this.detailsPopupShowFlag = true
                    }, 300)
                }
            },
            // 打开运费规则
            openFreightRules(storeId) {
                let item = this.showData.storeCartGroupList?.filter((item) => item.storeId == storeId)
                if (item?.length) {
                    this.freightRulesObj = item[0]
                    this.$refs.freightRules.open()
                }
            },
            closeFreightRules() {
                this.$refs.freightRules.close();
            },
            makeUpAmount(item) {
                if (item && item.indexOf('pages/index/index')==-1) {
                    let urlObj = {
                        url_type:'url',
                        url:item
                    }
                    skipTo(urlObj,this)
                } else {
                    uni.switchTab({
                        url: '/pages/index/index'
                    })
                }
            },
            // 显示实惠标签
            isShowJdLable(goods) {
                return goodsHandler.isShowJdLable(goods);
            },
            /**
             * 格式化满优惠活动描述
             * @param Object 满优惠活动对象
            */
            formatePromotionDes(promotionItem){
                let resStr = promotionItem.promotionDescription;
                try {
                    resStr = resStr.replace(/<(.+?)>/g, function(num) {
                        return "<span style='color:#222222'>" + num.slice(1, num.length - 1) + "</span>"
                    }).replace(/x[\d]/g, function(num) {
                        return "<span style='color:#222222'>" + num + "</span>"
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
            getDiscount(promotionType, item){
                const content = item.promotionDescription;
                const reg = /<.+?>/g, numArr = content.match(reg) || [];
                const fullPrice = numArr[0]?.replace(/<|>/g, '');
                const discount = numArr[1]?.replace(/<|>/g, '');
                if (promotionType === 201) {
                    let _fullPrice = this.getNum(fullPrice)
                    let _discount = this.getNum(discount)
                    return `满${' '}${_fullPrice}${' '}减${' '}${_discount}`
                } else if (promotionType === 202) {
                    let _fullPrice = this.getNum(fullPrice)
                    let _discount = this.getNum(discount)
                    return `每满${' '}${_fullPrice}${' '}减${' '}${_discount}`
                } else if (promotionType === 203) {
                    let _fullPrice = this.getNum(fullPrice)
                    let _discount 
                    if (discount.startsWith('0')) {
                        _discount = parseFloat(discount).toFixed(1)
                    } else if (discount.indexOf('.00') == -1) {
                        _discount = parseFloat(discount).toFixed(1).replace('.','')
                    } else {
                        _discount = parseFloat(discount).toFixed(0)
                    }
                    return `满${' '}${_fullPrice}${' '}打${' '}${_discount}${' '}折`
                } else if (promotionType === 204) {
                    let _discount 
                    if (discount.startsWith('0')) {
                        _discount = parseFloat(discount).toFixed(1)
                    } else if (discount.indexOf('.00')==-1) {
                        _discount = parseFloat(discount).toFixed(1).replace('.','')
                    } else {
                        _discount = parseFloat(discount).toFixed(0)
                    }
                    return `${' '}${fullPrice}${' '}件${' '}${_discount}${' '}折`
                } else if (promotionType === null) {
                    return item.promotionDescription
                }
                return ``
            },
            //拼接优惠内容，做两行省略
            promotionContext(item) {
                let content = ''
                item.extraInfoVOList?.forEach((items) => {
                    let itemContent = this.getDiscount(item.promotionType, items)
                    content += `${' '}${itemContent};`
                })
                content = content.substring(0, content.length - 1).trim();
                return content
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
                cartHandler.changePromotion(param).then(res => {
                    if (res.state == 200) {
                        uni.showToast({
                            title: '修改成功！',
                            icon:'none'
                        })
                        this.$refs.popup.close();
                        this.$refs?.loading?.open()
                        this.getCartData();
                    }else {
                        uni.showToast({
                            title: res.msg,
                            icon:'none'
                        })
                    }
                }).catch((e) => {
                    //异常处理
                    console.error(e)
                })
            },
            scroll({ detail }) {
                if (detail.scrollTop < 1) {
                    this.isTop = true
                } else {
                    this.isTop = false
                }
            },
            touchstart(e) {
                if (this.isTop) {
                    this.touchStartPosition = e.changedTouches[0]?.clientY || 0;
                }
            },
            touchmove(e) {
                if (this.isTop && false) {
                    const clientY = e.changedTouches[0]?.clientY || 0
                    const distance = clientY - this.touchStartPosition;
                    if (distance > 150) {
                        this.title = '松开刷新'
                    } else if (distance > 75) {
                        this.title = '下拉刷新'
                    } else {
                        this.title = '购物车'
                    }
                }
            },
            async touchend(e) {
                if (this.isTop && false) {
                    this.touchEndPosition = e.changedTouches[0]?.clientY || 0;
                    if (this.touchEndPosition - this.touchStartPosition > 150) {
                        this.title = '刷新中';
                        this.$refs?.loading?.open()
                        await this.getCartData();
                        this.title = '购物车';
                        this.isTop = true
                    } else {
                        this.title = '购物车';
                    }
                }
            },
        }
    }
</script>

<style lang='scss' scoped>
@import './cart-comp.scss';
</style>
