<template>
    <view class="detail_wrapper">
        <view v-if="isLoading" class="container" @click="hideCopyMask()" @longpress="hideCopyMask()" @touchmove="hideCopyMask()">
            <!-- 顶部的导航 start -->
            <topNav
                v-if="showTopNav"
                ref="topNav"
                :immersive="immersive"
                :hasRecommendGoods="hasRecommendGoods"
                :titleBarHeight="titleBarHeight"
                :titleHeight="titleHeight"
                :right_nav_show="right_nav_show"
                :top_nav_show="top_nav_show"
                :opacityObj="opacityObj"
                :currentNav="currentNav"
                @clickNav="clickNav"
            />
            <!-- 顶部的导航 end -->

            <!-- swiper-images start -->
            <swiper-images
                :images="goodsData.images||[]"
                :video="goodsData.video||''"
                :current="current"
                :carouselImgTransform="carouselImgTransform"
                :goodsPriceInfo="goodsPriceInfo"
                :showMask='true'
                @change="change"
            />
             <!-- swiper-images end -->

            <!-- 占位轮播图的dom 因为轮播图目前是定位fixed的 start -->
            <view :style="{width:'750rpx',height:'730rpx',background:'transparent'}" ref="space" id="nav1"></view>
            <!-- 占位轮播图的dom end -->

            <!-- 从商品名称开始的下面所有内容 -->
            <view class="max_content_box">
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


                <!-- 商品属性 start-->
                <view class="introduce_section" :style="{paddingTop:isShowJdLable?'0':'30rpx'}">
                    <!-- 商品没有参加活动【attendPromotion】，或者是下架【!onSale】的商品，显示正常的商品价格模块 -->
                    <view :class="['price_part',isShowJdLable ? 'jd_bj_bg' : '']" v-if="!onSale || !attendPromotion">
                        <view class="sell_price num-font" v-if="goodsPriceInfo.salePrice && onSale">
                            <text class="affordable_text" v-if="isShowJdLable">实惠价</text>
                            <text class="unit">¥ </text>
                            <text
                                class="price_int">{{$getPartNumber(goodsPriceInfo.salePrice,'int')}}</text>
                            <text
                                class="price_decimal">{{$getPartNumber(goodsPriceInfo.salePrice,'decimal')}}</text>
                        </view>
                        <view v-if="isShowJdLable" class="bijia-box">
                            <!-- 京东到手价 -->
                            <view class="net-price num-font">
                                <text class="compare_icon"></text>
                                <text>京东到手价</text>
                                <text class="actual_price"> ¥{{$getPartNumber(goodsPriceInfo.supplierReferencePrice,'int')}}{{$getPartNumber(goodsPriceInfo.supplierReferencePrice,'decimal')}}</text>
                            </view>
                            <view class="separator"></view>
                            <text class="to_jd_title" @click="$refs.jdPopup.open()">前往京东比价</text>
                            <!-- 比价指引图按钮 -->
                            <img class="right_vs" :src="imgUrl + 'goods/btn_common_rightarrow2.png'" alt="" @click="$refs.jdPopup.open()" />
                        </view>
                        
                        <!-- 下架的商品一律显示暂无报价 -->
                        <view class="not_price" v-if="(!goodsPriceInfo.salePrice && !priceLoading) || !onSale">
                            <text class="unit">¥ </text>
                            <text class="not_price_tips">暂无报价</text>
                        </view>

                        <view v-if="isShowJdLable && goodsPriceInfo.supplierReferencePrice && goodsPriceInfo.salePrice" :class="{ 'price_sheng': true, 'filled': discountAmount.length > 5 }">
                            <text class="unit">￥</text>
                            <text class="price_int">{{ $getPartNumber(discountAmount, "int") }}</text>
                            <text class="price_decimal">{{ $getPartNumber(discountAmount, "decimal") }}</text>
                        </view>
                    
                    </view>

                    <view :class="[isShowJdLable ? 'price_info_part' : 'price_info_part_normal']">
                        <!-- 优惠标签组件 -->
                        <!-- 第一阶段：只更改优惠标签的样式，然后初步制订了规则。 -->
                        <!-- 规则：优惠券和满优惠只显示面额最大的，满优惠中满减打折的暂不显示，有且只各显示一个，后续还有免息、云豆项需要展示，等待接口后续完善再改 -->
                        <preferential
                        v-if="couponIconList.length>0 || fullPreferentialIconList.length>0"
                        iconSize="large"
                        :couponList="couponIconList"
                        :fullList="fullPreferentialIconList"
                        >
                        <!-- 右部插槽：领券按钮 -->
                        <template #right>
                            <view class="right_content" @click="showPanel(couponIconList.length)">
                                {{
                                    couponIconList.length > 0 ? '领券' : fullPreferentialIconList.length > 0 ? '优惠' : ''
                                }}
                            </view>
                        </template>
                        </preferential>

                        <view class="showMaskBox" v-if="is_show_mask"><view class="showMask" @click="copyStr(goodsData?goodsData.skuName:'')">复制<view class="sanjiao"></view></view></view>
                        <view class="goods_name" @longpress.stop="showOperate()" :style="{userSelect:userSelect}">
                            <!-- <i v-if="unionName&&goodsData.ownShop==1" class="union_name">
                                <i :style="{ backgroundColor: unionNameBg }">{{ unionName }}</i>
                            </i> -->
                            <discount-tag :type="goodsPriceInfo.tags && goodsPriceInfo.tags[0]" source="detail" v-if="isShowJdLable" />
                            {{goodsData?goodsData.skuName:''}}
                        </view>
                        <view class="row_box flex_row_between_center ">
                            <!-- 屏蔽掉商品详情的商品编号 2023-02-15 -->
                            <!-- <view class="goods_productId fontScaleIgnore" @longpress.stop="showOperateNum()" :style="{userSelect:userSelect}">{{$L('商品编号')+'：'+(goodsData?goodsData.sku:'')}}<view class="showMaskBox showMaskSkuBox" v-if="is_show_maskNum"><view class="showMask" @click="copyStr(goodsData?goodsData.sku:'')">复制<view class="sanjiao"></view></view></view></view> -->
                            <view class="saleVolumeBox" v-if="saleVolume>0"><span class="saleVolume fontScaleIgnore">{{saleVolume+$L('个朋友买过')}}</span></view>
                        </view>
                        <view class="goods_operation flex_row_between_center">
                            <view class="flex_row_start_center share" @click="goShare">
                                <view class="iconshare"></view>
                                <view class="text">{{$L('分享')}}</view>
                            </view>    
                            <view class="flex_row_start_center collection" @click="collectGoodsModule" v-if="!disabledModule">
                                <view class="collectIcon" v-if="goodsData.follow" :class="{collectedIconMove:goodsData.follow ,collectedIcon:!goodsData.follow}"></view>
                                <view class="collectIcon noCollectIcon" v-else></view>
                                <view class="text">{{goodsData.follow ? $L("已收藏") : $L("收藏")}}</view>
                            </view>
                            <view class="flex_row_start_center demandDiscount" v-if="!disabledModule">
                                <view class="follow_discount_tip" v-if="followDiscountLoading && showFollowDiscount"></view>
                                <view @click="followDiscount" class="follow_discount flex_row_start_center">
                                    <view class="money_image" ></view>
                                    <text class="text">要优惠</text>
                                </view>
                            </view> 
                        </view>
                    </view>

                    
                </view>
                <!-- 商品属性 end -->

                <!-- 一起买sologon图片说明 -->
                <view v-if="valiInfo(buyTogetherInfo)" class="activitySlogan"></view>

                <!-- 阶梯团 进度 start -->
                <view v-if="valiInfo(ladderInfo)&&ladderInfo.ruleList&&ladderInfo.ladder_run==2">
                    <ladderProgress :ladderInfo="ladderInfo"></ladderProgress>
                </view>
                <!-- 阶梯团 进度 end -->

                <!-- 拼团成员列表 start -->
                <view class="pin_group_con" v-if="valiInfo(pinInfo)">
                    <pinGroupList :spu="pinInfo.spu" :spellId="pinInfo.spellId" @handleJoinGroup="handleJoinGroup"></pinGroupList>
                </view>
                <!-- 拼团成员列表 end -->
                
               
                <!-- 赠品 start -->
                <view class="gift" v-if="showDiscount" :style="{borderRadius:'10px 10px 0px 0px'}">
                    <view class="good-gift-choose">
                        <view class="gift_title">{{$L('优惠')}}</view>
                        <view class="gift_right_content">
                            <view class="gift_content" @click="showGiftModel('gift')" v-if="giftObj.giftList&&giftObj.giftList.length>0">
                                <text class="gift_content_icon">赠品</text>
                                <text class="gift_content_text">{{giftObj.giftList[0].name}}</text>
                                <image :src="imgUrl+'common/icon/icon_common_rightarrow.svg'" class="gift_right"></image>
                            </view>
                            <view class="gift_content" @click="showGiftModel('attachment')" v-if="giftObj.attachmentList&&giftObj.attachmentList.length>0">
                                <text class="gift_content_icon">附件</text>
                                <text class="gift_content_text">{{giftObj.attachmentList[0].name}}</text>
                                <image :src="imgUrl+'common/icon/icon_common_rightarrow.svg'" class="gift_right"></image>
                            </view>
                        </view>
                    </view>
                </view>
                <!-- 赠品 end -->

                <!-- 鹅毛情 start -->
                <view class="emaoqing" v-if="showFeatherEntry">
                    <gift-entry @click="showSpecModel('buy','custom')" />
                </view>
                <!-- 鹅毛情 end -->

                <!-- 选择规格 start -->
                <view class="spec_con" @click="showSpecModelPop()" :style="{borderRadius:(!showFeatherEntry)?'0rpx':'10px 10px 0px 0px',marginTop:showFeatherEntry?'-60rpx':'0'}">
                    <view class="spec_left">
                        <view class="spec_left_title">{{$L('已选')}}</view>
                        <view class="spec_left_content" v-if="goodsData.specValues">
                            {{goodsData.specValues}}, {{currentSpecNum}}件
                        </view>
                        <view class="spec_left_content" v-else>{{$L('默认')}}</view>
                    </view>
                    <image :src="imgUrl+'common/icon/icon_common_rightarrow.svg'" class="spec_right"></image>
                </view>
                <!-- 选择规格 end -->


                <!-- 发货地址及运费 start -->
                <!-- 禅道任务号41080 商品详情页屏蔽地址切换与运费 2022/08/01 -->
                <!-- <view class="deliver_goods" v-if="deliverInfo && false" @click="showAddressList">
                    <view class="deliver_goods_con">
                        <view class="deliver_goods_left">
                            <view class="deliver_goods_title">{{$L('送至')}}</view>
                            <view class="deliver_goods_address">
                                <view class="iconWrap">
                                    <text class="iconfont icon_location"></text>
                                </view>
                                <text :class="{addressDefault:!choosedAddress.provinceCode}">{{choosedAddress.provinceCode?`${choosedAddress.addressAll}${choosedAddress.detailAddress}`:'请选择地址'}}</text>
                            </view>
                        </view>
                        <view class="line" v-if="deliverInfo.expressFee!=undefined"></view>
                        <view class="deliver_goods_center" v-if="deliverInfo.expressFee!=undefined">
                            {{$L('快递')}}:{{filters.toFix(deliverInfo.expressFee)}}元
                        </view>
                        <view class="deliver_goods_right" v-if="false">{{$L('已销')}}{{goodsData.saleNum ? goodsData.saleNum : 0}}</view>
                    </view>
                </view> -->
                <expressDelivery :goodsData="goodsData" :choosedAddress="choosedAddress" @getAddressInfo="getAddressInfo" :imgUrl="imgUrl" :promiseTime="promiseTime"></expressDelivery>

                <!-- 发货地址及运费 end -->


                <!-- 服务tips start -->
                <service :goodsData="goodsData" :jdLogistics="goodsData.jdLogistics == 1" />
                <!-- 服务tips end -->

                <!-- 活动 start -->
                <view class="activity" v-if="!disabledModule && ((couponList && couponList.length > 0)||(fullDisList && fullDisList.length > 0))">
                    <view class="activity_left">
                        <view class="activity_coupons_tips">{{$L('活动')}}</view>
                    </view>
                    <view class="activity_right">
                        <!-- 领券 start -->
                            <view class="activity_coupons" v-if="couponList && couponList.length > 0" @click.prevent="openCouponModel">
                                <view class="activity_coupons_left">
                                    <view class="activity_coupons_center">
                                        <text class="activity_coupons_title">{{$L('领券')}}</text>
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
                                    <image :src="imgUrl+'common/icon/icon_common_rightarrow.svg'" mode=""></image>
                                </view>
                            </view>
                        <!-- 领券 end -->
                        <!-- 满优惠 start -->
                            <view class="activity_full" v-if="fullDisList && fullDisList.length > 0" @click="openFullDisModel">
                                <view class="full_discount" v-for="(item, index) in fullDisList" :key="index">
                                    <text class="full_discount_title">满减</text>
                                    <view class="full_discount_list">
                                        <block v-for="(item1, index1) in item.extendInfoList" :key="index1">
                                            <richTextCustom :decoItem="formatePromotionDes(item1,item)"></richTextCustom>
                                        </block>
                                    </view>
                                </view>
                            </view>
                        <!-- 满优惠 end -->
                    </view>
                </view>
                <!-- 活动 end -->

                <!-- 优惠券弹框 start -->
                <bottomPopup ref="couponModel" type="bottom" text="优惠">
                    <view class="coupon_model">
                        <scroll-view class="coupon_model_list" scroll-y="true">
                            <view class="coupon_tips">可领优惠券</view>
                            <view class="my_coupon_pre" v-for="(item,index) in couponList" :key="index">
                                <view class="coupon_pre_top">
                                    <view class="coupon_pre_left fontScaleIgnore">
                                        <!-- 固定券 start -->
                                        <view class="coupon_pre_price" v-if="item.couponType == 1">
                                            <text class="unit" :style="{fontSize:fitfontSize['small'][item.publishValue.toString().length]}">¥ </text>
                                            <text class="price_int" :style="{fontSize:fitfontSize['big'][item.publishValue.toString().length]}">{{item.publishValue}}</text>
                                        </view>
                                        <!-- 固定券 end -->
                                        <!-- 折扣券 start -->
                                        <view class="coupon_pre_price" v-if="item.couponType == 2">
                                            <view class=""></view>
                                            <text
                                                class="price_int">{{filters.toSplit(filters.toFixNum(item.publishValue,1))[0]}}</text>.
                                            <text
                                                class="price_decimal">{{filters.toSplit(filters.toFixNum(item.publishValue,1))[1]}}</text>
                                            <text class="price_decimal">{{$L('折')}}</text>
                                        </view>
                                        <!-- 折扣券 end -->
                                        <!-- 随机券 start -->
                                        <view class="coupon_pre_price" v-if="item.couponType == 3" :style="{fontSize:getRandomSmallFontSize(item)}">
                                            <text class="unit">¥ </text>
                                            <text class="price_int" :style="{fontSize:getRandomFontSize(item)}">{{$getPartNumber(item.randomMin,'int')}}</text>
                                            <text class="price_decimal" v-if="$getPartNumber(item.randomMin,'decimal')!='.00'">{{$getPartNumber(item.randomMin,'decimal')}}</text>
                                            <text class="unit">~</text>
                                            <text class="unit">¥ </text>
                                            <text class="price_int" :style="{fontSize:getRandomFontSize(item)}">{{$getPartNumber(item.randomMax,'int')}}</text>
                                            <text class="price_decimal" v-if="$getPartNumber(item.randomMax,'decimal')!='.00'">{{$getPartNumber(item.randomMax,'decimal')}}</text>
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
                                            <text>{{$L('使用规则')}}</text>
                                            <image :src="item.isOpen ? imgUrl + 'common/icon/uptriangle2@2x.png' : imgUrl + 'common/icon/btn_common_downtriangle2@2x.png'"
                                                    mode="" draggable="false"></image>
                                        </view>
                                    </view>
                                    <view class="kacao kacao1" v-if="item.receivedState != 3 || item.notUseCount!=0" :class="{kacao1_notUse:item.publishStartTime.indexOf(':')==-1}"></view>
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
                                            <view class="get_link" @click="goReceive(item)">{{$L('立即领取')}}</view>
                                        </view>
                                        <view v-else-if="item.receivedState == 2" class="coupon_right haveNotUse">
                                            <!-- <image :src="imgUrl + 'coupon/icon_yhq_yilingqu.svg'" mode="" draggable="false"></image> -->
                                            <view>{{$L('已领取')}}</view>
                                            <view @click="goGoodsList(item)">{{$L('去使用')}}</view>
                                        </view>
                                        <view v-else class="coupon_right haveExpired">
                                            <view v-if="item.notUseCount == 0">
                                                <image :src="imgUrl + 'coupon/icon_common_yiqiangwan.svg'" mode="" draggable="false" />
                                            </view>
                                            <view v-else class="coupon_right haveNotUse">
                                                <view>{{$L('已领取')}}</view>
                                                <view @click="goGoodsList(item)">{{$L('去使用')}}</view>
                                            </view>
                                        </view>
                                    </view>
                                </view>

                                <view class="coupon_rules" v-if="item.isOpen == true">
                                    <view>{{$L('优惠券类型：')}}<text class="coupon_type_text">{{$L('【')}}{{item.storeId==0?'平台优惠券':'店铺优惠券'}}{{$L('】')}}</text></view>
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
                                        <richTextCustom :decoItem="formatePromotionDes(item1,item)"></richTextCustom>
                                    </view>
                                </view>
                            </view>
                        </scroll-view>
                        <view class="full_dis_tips">
                            {{$L('以上优惠仅为初步预估，实际以结算最终价格为准！')}}
                        </view>
                    </view>
                </bottomPopup>
                <!-- 满优惠弹框 end -->

                <!-- 店铺评价 start -->
                <store-rate :storeInfo="storeInfo"/>
                <!-- 店铺评价 end -->

                <!-- 店铺推荐 start-->
                <view class="store_recommend" id="nav3" v-if="hasRecommendGoods">
                    <view class="store_recommend_top">
                        <view class="store_recommend_title">{{$L('店铺推荐')}}</view>
                    </view>
                    <view class="store_recommend_list">
                        <template v-for="(item,index) in recommendedList">
                            <view class="store_recommend_pre" :key="index"
                                @click="goProductDetail(item.sku)" v-if="index < 6">
                                <view class="store_reco_pre_image">
                                    <image :src="item.mainImage" mode=""></image>
                                    <view class="store_reco_pre_price">
                                        <text class="unit">¥</text>
                                        <text class="price_int">{{$getPartNumber(item.salePrice,'int')}}</text>
                                        <text class="price_decimal">{{$getPartNumber(item.salePrice,'decimal')}}</text>
                                    </view>
                                </view>
                                <view class="store_reco_pre_name">{{item.skuName}}</view>
                            </view>
                        </template>
                    </view>
                </view>
                <!-- 店铺推荐 end -->

                <!-- 商品详情 start -->
                <view class="detail-desc" id="nav4">
                    <introduction 
                        :goodsDetail="goodsData"
                        :specsList="specsList"
                        :params="goodsData.params"
                        :introduction="goodsData.detail || ''"
                        :wareQD="goodsData.wareQD || ''"
                        :goodsParamsTop="goodsParamsTop"
                        :specsParamsTop="specsParamsTop"
                    />
                </view>
                <!-- 商品详情 end -->

                <!-- 京东比价弹窗 -->
                <uni-popup ref="jdPopup" :mask-click="false">
                    <view class="jd_vs_yindao">
                        <view class="title">
                            <img src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/mallbbc/img/icon_xq_VS.png" alt="" />
                        </view>
                        <view class="close" @click="$refs.jdPopup.close()">
                            <img :src="imgUrl + 'common/icon/close.svg'" alt="">
                        </view>
                        <view class="content">
                            <image style="width: 100%;" src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/mallbbc/img/bg_xq_yingdao.png" mode="widthFix" />
                        </view>
                        <view class="bottom">
                            <view class="copyBtn" @click="copySku">复制商品编号</view>
                        </view>
                    </view>
                </uni-popup>
            </view>
            
            <!-- 到底啦 start -->
            <toTheEnd />
            <!-- 到底啦 end -->
            

            <!--  底部区域 start -->
            <view class="bottomArea centered_around">
                <!-- 库存下架，无货，区域销售 等相关遮罩层提示 start-->
                <statetips
                    :stopSales="onSale"
                    :hasStock="hasStock"
                    :areaLimit="areaLimit"
                />
                
                
                <!-- 底部操作菜单 start -->
                <view class="page_bottom" v-if="!disabledModule">
                    <view class="leftIcon">
                        <view url="/" open-type="switchTab" @click="gotoCustomerServiceModule" class="p_b_btn">
                            <view>
                                <text class="iconfont icon_customerservice fontScaleIgnore"></text>
                                <text class="show_text">{{$L('客服')}}</text>
                            </view>
                        </view>
                        <view @click="goShopCartModule" class="p_b_btn">
                            <view>
                                <text class="iconfont icon_cart fontScaleIgnore"></text>
                                <text class="show_text">{{$L('购物车')}}</text>
                                <text class="cart_num" v-if="cartNum > 0">{{cartNum > 99 ? '99+' : cartNum}}</text>
                            </view>
                        </view>

                        <view v-if="showFeatherEntry" @click="showSpecModel('buy','custom')" class="p_b_btn gift_footer_btn" >
                            <view>
                                <text class="iconfont icon_icon_common_songli fontScaleIgnore"></text>
                                <text class="show_text">送礼</text>
                                <template v-if="showGiftGuide">
                                    <img class="yindao_bottom" :src="imgUrl+'gift/btn_xiangqing_songli.svg'"/>
                                    <img class="yindao_top" :src="imgUrl+'gift/icon_emq_yingdao.png'"/>
                                </template>
                            </view>
                        </view>
                    </view>

                    <!-- 底部的操作按钮 start -->
                    <footer-option 
                        :secKillInfo="secKillInfo"
                        :buyTogetherInfo="buyTogetherInfo"
                        :preSellInfo="preSellInfo"
                        :ladderInfo="ladderInfo"
                        :pinInfo="pinInfo"
                        :goodsData="goodsData"
                        :hasStock="hasStock"
                        :areaLimit="areaLimit"
                        :disabled="disabledOperate"
                        :seckillStock="seckillStock"
                        :onSale="onSale"
                        @showSpecModel="showSpecModel"
                    />
                    <!-- 底部的操作按钮 end -->

                </view>
                <!-- 底部操作菜单 end -->
            </view>
            <!--  底部区域 end -->

            <!-- 分享弹框 start -->
            <view class="share_model" v-if="share_model" @touchmove.stop.prevent="moveHandle">
                <view class="bizmateshareWrap">
                    <share @close="share_model=false" :shareOptions="shareOptions"  :supportTypes="supportTypes" :needJudgeChannelSupportWechat="false"></share>
                </view>
            </view>
            <!-- 分享弹框 end -->
         

            <!-- 规格弹框 start -->
            <bottomPopup ref="specModel" type="bottom" :showTitle="false" class="spec_model">
               <specs-comp
                    :secKillInfo="secKillInfo"
                    :buyTogetherInfo="buyTogetherInfo"
                    :preSellInfo="preSellInfo"
                    :ladderInfo="ladderInfo"
                    :pinInfo="pinInfo"
                    :goodsData="goodsData"
                    :hasStock="hasStock"
                    :disabled="disabledOperate"
                    :seckillStock="seckillStock"
                    :onSale="onSale"
                    :goodsPriceInfo="goodsPriceInfo"
                    :pinButState="pinButState"
                    :currentSpecNum="currentSpecNum"
                    :showSpecModelType="showSpecModelType"
                    :specs="specs"
                    :sku="sku"
                    :images="goodsData.images||[]"
                    :choosedAddress="choosedAddress"
                    @editNum="editNum"
                    @changeSpecSku="changeSpecSku"
                    @buy="buy"
                    @addCart="addCart"
                    @openAddressChooseModal="showAddressList"
               />
            </bottomPopup>
            <!-- 规格弹框 end -->

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
        </view>
        <view v-if="soldOut" class="flex_column_start_center soldOut">
            <view class="img"></view>
            <text class="tip_con">{{errorMsg}}</text>
        </view>

        <!-- 鹅毛情引导页透明遮罩层-->
        <view v-if="showGiftGuide || showFollowDiscount" class="gift_yindao_mask" @click="clickPageView"></view>

        <toast class="toast" v-if="isShowFollowDiscountToast" :mask="true">
            <template #toast-icon>
                <image :src="imgUrl + 'gift/icon_setp_sel3_white.svg'"></image>
            </template>
            <template #toast-title>已收到您的反馈</template>
            <template #toast-body>商品有优惠活动我们将第一时间通知您！</template>
        </toast>
        <!-- 随机优惠券 start -->
        <view :class="{'hide':!rondomMod,'random_coupon':true}" style="position: fixed;width: 750rpx;height:100vh;background:rgba(0,0,0,0.6);z-index: 1000;top:0">
            <view class="random_coupon_bg" :style="{backgroundImage:'url(' + imgUrl + 'coupon/random_bg.png)'}" @click="goMyCoupon()">
                <view class="random_coupon_price">￥{{rondomDes.publishValue}}</view>
                <view class="random_coupon_des">{{rondomDes.couponContent}}</view>
                <view class="close_btn" :style="{backgroundImage:'url(' + imgUrl + 'common/icon/close_screen.png)'}" @click.stop="close"></view>
            </view>
        </view>
        <!-- 随机优惠券 end -->
        <view id="mapContainer" style="display:none;"></view>
    </view>
</template>
<script module="filters" lang="wxs" src="@/utils/filter.wxs"></script>

<script>
    import statetips from "./components/statetips.vue"
    import introduction from "./components/introduction.vue" 
    import toTheEnd from "./components/end.vue" 
    import storeRate from "./components/rate.vue" 
    import topNav from "./components/nav.vue" 
    import swiperImages from "./components/swiper.vue" 
    import giftEntry from "./components/gift.vue" 
    import footerOption from "./components/footer.vue" 
    import service from "./components/service.vue" 
    import specsComp from "./components/specs.vue" 
    import promotionPrice from "@/views/promotion/index.vue" 
    import ladderProgress from '@/views/promotion/ladder/components/ladderProgress.vue'
    import pinGroupList from '@/views/promotion/pingroup/components/pinGroupList.vue'
    import toast from '@/components/toast/toast.vue'
    import addressChoose from "@/components/address/select";    
    import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
    import richTextCustom from "@/components/decorate/rich-text/rich-text";
    import share from '@/components/share/index.vue'
    import bottomPopup from '@/components/bottom-popup/index.vue';
    import preferential from '@/components/preferential/preferential.vue';
    import discountTag from '@/components/goods/discountTag.vue'
    import expressDelivery from './components/expressDelivery.vue'
    import { copyText, averageColor, getStorageSync, isNotEmpty, skipTo, getMaxCouponList, getMaxFullPreferentialList, lockScroll, unlockScroll, getLocation, getAddressFromMap, geoLocationByGaode, offLocation, geoLocation, accSub, setBpParam, handleBpParam, isSpecialChouzhou } from '@/utils/common.js'
    import {
        mapState,
        mapMutations,
        mapGetters
    } from 'vuex';
    // 引入客服的功能
    import customerService from '@/common/lib/customer-service';
    //库存状态枚举
    import stockEnum from '@/common/lib/enum/stock';
    import { promotionEnum } from '@/common/lib/enum/promotion'
    import cartMixin from '@/common/mixin/cartMixin'
    import sobot from '@/common/mixin/sobotOut' //智齿客服
    import shareHandler from '@/utils/shareHandler.js';
    import goodsHandler from '@/components/goods/handler';
    import orderHandler from '@/components/order/handler';
    import personalHandler from "@/components/personal/handler";
    import decorateHandler from '@/components/decorate/handler';
    import wxHandler from "@/components/wechat/handler";
    
    export default {
        mixins: [cartMixin, sobot],
        components: {
            statetips,
            introduction,
            toTheEnd,
            storeRate,
            topNav,
            swiperImages,
            giftEntry,
            promotionPrice,
            footerOption,
            service,
            specsComp,
            ladderProgress,
            toast,
            uniPopupDialog,
            richTextCustom,
            pinGroupList,
            share,
            addressChoose,
            bottomPopup,
            preferential,
            discountTag,
            expressDelivery
        },
        data() {
            return {
                sku: '', //货品id
                spu: '', //商品id
                specsList: [], //规格参数列表
                right_nav_show: true, //右侧菜单栏图标是否显示
                top_nav_show: false, //顶部的菜单栏是否展示
                currentNav: 0, //当前点击的默认是第一项
                nav1ScrollTop: 0, //商品模块距离顶部的距离
                nav3ScrollTop: 0, //推荐模块距离顶部的距离
                nav4ScrollTop: 0, //详情模块距离顶部的距离
                carouselImgTransform:'', //向上滑时swiper图片的变化
                secKillInfo: {}, //秒杀活动详情信息
                preSellInfo: {}, // 预售商品详情信息
                ladderInfo: {}, //阶梯团信息
                buyTogetherInfo:{}, //一起买信息
                pinInfo: {}, //拼团信息
                fullDisList: [], //满优惠列表
                isShowFollowDiscountToast: false,
                imgUrl: getApp().globalData.imgUrl,
                goodsData: {},
                share_model: false, //分享弹框
                currentSpecNum: 1, //当前规格弹框中的购买数量
                couponList: [], //优惠券列表
                specs: [], //商品规格列表
                goReceiveBg: getApp().globalData.imgUrl + 'coupon/coupon_pre_bg.png', //立即领取背景
                finishReceiveBg: getApp().globalData.imgUrl + 'coupon/finishReceiveBg.png', //已抢完背景
                hasReceiveBg: getApp().globalData.imgUrl + 'coupon/hasReceiveBg.png', //已领取背景
                current: 0, //轮播图默认显示第一页
                isLoading: false,
                showSpecModelType: '', //规格弹框的底部按钮的显示类型默认：加入购物车及立即购买都有add：加入购物车buy：立即购买nosocket库存不足offshelf商品下架
                recommendedList: [], //店铺推荐列表
                deliverInfo: {}, //发货地及运费信息
                storeInfo: {}, //店铺信息
                spellTeamId: 0, //拼团团队Id
                pinButState: null, //拼团按钮状态,
                showState: 0, //当当前页面进入到下一个页面时，将此值置为1，上一个页面回退到当前页面时，再onShow里判断，防止onShow触发过多
                shareOptions:{},//分享所需的参数
                giftObj:{},  //赠品相关
                giftPopType:'', //赠品附件类型
                giftPopList:[], //赠品附件的详细值
                hasStock: true,//该商品是否有库存 true=有库存， false=没有库存
                areaLimit: true, //是否区域可售 true=区域可售， false=区域不可售
                onSale:true,//商品是否上下架state=1上架state=0下架 true=上架，false=下架
                choosedAddress: {}, //选中的地址对象
                is_show_mask:false,  //复制商品名称弹框
                is_show_maskNum:false,//复制商品sku弹框
                userSelect:'none', //据此判断PC端可选中复制，手机端不能选中
                isIos: uni.getSystemInfoSync().platform == "ios", //是否ios手机
                scrollTop:0, //页面滚动高度
                soldOut:false, //是否已下架
                errorMsg:'', //商品详情报错信息
                immersive:true,
                titleHeight:0, //title栏高度
                titleBarHeight:0, //titleBar高度
                opacityObj:{
                    navListOpacity:'rgba(255,255,255,0)',//nav_list透明度
                    textOpacity:'rgba(0,0,0,0)', //nav_list文字透明度
                    imgOpacity:0 //查看更多图标透明度
                },
                boundScrollTop:0, //向上滚动nav_list透明度变为1的临界值
                duration:500, //轮播切换速度
                promotionEnum: promotionEnum,//商品参加活动枚举
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
                rondomMod:false, //随机弹框
                rondomDes:{},
                averageRgb:'', //计算的平均色
                iconColorArr:[], //titleBar通过计算平均色判断的颜色，'light' or 'dark'
                changeTitleBarColor:'light', //横向swiper改变
                supportTypes:['bizmate', 'wechat'],//当前渠道下支持的H5 sharetype
                saleVolume:0,//有几个朋友买过
                goodsPriceInfo: {}, //商品价格相关的信息
                customFlag:false, //点击立即购买是否跳转到定制的（鹅毛情）确认订单页
                priceLoading: true, // 避免出现“暂无报价”闪现的问题
                hasPreviewCacheKey: 'hasPreviewedFeather', // 是否用户点击过了解鹅毛情的缓存key
                showFollowDiscountPop: true, // 要优惠引导提示，默认显示 
                showGiftGuidePop: true, //是否显示鹅毛情礼物引导页 默认显示
                giftSwitch: false, //admin 运营后台配置的是否打开鹅毛情的开关 默认是false
                promotionLoading: true, // 都在买loading
                followDiscountLoading: false, // 引导页请求数据成功
                couponIconList: [], // 优惠券标签集合
                fullPreferentialIconList: [], // 满优惠标签集合
                promiseTime: '', // 商品预计送达时间
                addressCode: {}, // 切换前的地址信息
                getLocationing: false, //获取定位中
                hoveLocation: false, // 定位是否成功
                goodsParamsTop:0, //商品参数这一行的top值
                specsParamsTop:0, //规格参数这一行的top值
                showTopNav: true
                
            };
        },
        watch:{
            choosedAddress: {
                handler(val){
                    const { provinceCode, cityCode, districtCode, townCode } = val
                    if(!!provinceCode){
                        this.updateGoodsInfos();

                        // 没有地址信息或者四级code有不一致情况，再次请求物流信息
                        if (provinceCode!=this.addressCode?.provinceCode || cityCode!=this.addressCode?.cityCode || districtCode!=this.addressCode?.districtCode || townCode!=this.addressCode?.townCode) {
                            this.showDeliverInfo(val)
                        }
                    }
                },
                deep: true
            },
            couponList: {
                handler(val){
                    this.couponIconList = getMaxCouponList(val);
                }
            },
            fullDisList: {
                handler(val){
                    let filterList = val.filter(item => {
                        return item.promotionType === 201 || item.promotionType === 202;
                    })
                    this.fullPreferentialIconList = getMaxFullPreferentialList(filterList);
                    
                    // this.fullDisList = getMaxFullPreferentialList(val.filter(item => {
                    //     return item.promotionType === 201 || item.promotionType === 202;
                    // }));
                }
            }

        },
        computed: {
            ...mapState(['hasLogin', 'userInfo', 'userCenterData', 'cartNum']),
            ...mapGetters(['disabledModule']),
            /**
             * 该变量用来判断当该商品下架或者缺货的时候，相关按钮不能操作的
             */
            disabledOperate(){
                return !this.hasStock || !this.areaLimit || !this.onSale;
            },
            
            //是否显示优惠栏
            showDiscount(){
                return (!!this.giftObj.giftList && !!this.giftObj.giftList.length > 0) || (!!this.giftObj.attachmentList && !!this.giftObj.attachmentList.length > 0);
            },
            // 是否显示鹅毛情引导页
            showGiftGuide(){
                // admin平台鹅毛情入口打开 并且 控制显示的变量是true 并且 用户没有浏览过
                return this.showFeatherEntry && this.showGiftGuidePop && !!!this.$getStorageSync('hasViewedGiftGuide');
            },

            // 是否显示要优惠引导
            showFollowDiscount(){
                // 如果有鹅毛情引导则不显示要优惠引导
                if(this.showGiftGuide){
                    return false
                }
                return this.showFollowDiscountPop && !!!this.$getStorageSync('hasViewedFollowDiscount');
            },

            //  渠道开启鹅毛情的入口 | 并且只支持自营接入商品即京东企业购 | 并且只有京东发货&京东售后 才支持，厂直商品不支持鹅毛情 | 并且一起买活动正在进行中的商品，不显示鹅毛情的入口
            showFeatherEntry(){
                return !!this.giftSwitch && (this.goodsData.ownShop == 1) && (!!this.jdSelf) && (!this.promotionLoading && this.buyTogetherInfo.state != 2);
            },

            // 是否是京东自营，并且京东发货
            jdSelf(){
                return goodsHandler.isJdSelf(this.goodsData);
            },

            // 该商品详情是否有推荐商品模块
            hasRecommendGoods(){
                return this.recommendedList.length > 0
            },

            // 秒杀商品的秒杀数量限制 promotionStock
            seckillStock(){
                return this.secKillInfo.promotionStock <= 0 ? false : true
            },

            // 商品的是否参加了活动
            attendPromotion(){
                return goodsHandler.attendPromotion(this.goodsPriceInfo);
            },

            isShowJdLable(){
                return this.onSale && goodsHandler.isShowJdLable(this.goodsPriceInfo)
            },
            // 实惠金额
            discountAmount(){
                return parseFloat(accSub(this.goodsPriceInfo.supplierReferencePrice,this.goodsPriceInfo.salePrice)).toFixed(2)
            },
            // 计算随机金额Int的字号大小
            getRandomFontSize() {
                return (item) => {
                    let size = '64rpx'
                    let intLength = 1
                    if (item?.randomMin && item?.randomMax) {
                        intLength = this.$getPartNumber(item.randomMin,'int').toString().length + this.$getPartNumber(item.randomMax,'int').toString().length
                    }
                    if (this.$getPartNumber(item.randomMin,'decimal')!='.00' && this.$getPartNumber(item.randomMax,'decimal')!='.00') {
                        size = this.fitfontSize['bigRandom'][intLength]
                    } else if (this.$getPartNumber(item.randomMin,'decimal')=='.00' && this.$getPartNumber(item.randomMax,'decimal')=='.00') {
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
                        intLength = this.$getPartNumber(item.randomMin,'int').toString().length + this.$getPartNumber(item.randomMax,'int').toString().length
                    }
                    if (this.$getPartNumber(item.randomMin,'decimal')!='.00' && this.$getPartNumber(item.randomMax,'decimal')!='.00') {
                        size = this.fitfontSize['smallRandom'][intLength]
                    } else {
                        size = this.fitfontSize['smallRandomInt'][intLength]
                    }
                    return size
                }
            }
        },
        async mounted() {
            try{
                if(isSpecialChouzhou()){
                    this.showTopNav = false;
                }
            }catch(e){}
            
            this.titleBarHeight = window?.titleBarHeight;
            this.titleHeight =window?.titleHeight;
            this.sku = this.$Route.query.sku;
            this.showState = 0
            this.judgeGiftSwitch(); // 初始化admin后台配置的是否打开鹅毛情的开关
            this.getGoodsDetail(); // 获取商品详情
            this.getSaleVolume(); //获取有几个朋友买过
            this.goTop(); //一键回到页面顶部
            if (handleBpParam(this)?.isShare) {
                this.$bbcStatEvent({behaviorType:'openshare'});
            }
            
            // #ifdef H5
            if(SnUtils.isPC()){
                this.userSelect="text";
                return;
            }
            // #endif
        },
        onShow() {
            if (this.showState == 1) {
                this.getGoodsDetail();
            }
            //页面再次打开时注册转发信息
            if(!!this.goodsData.sku){
                this.setThirdShare();
            }          
        },
        //页面滚动事件
        onPageScroll(res) {
            this.setViewedFollowDiscountGuide();
            this.setViewedGiftGuide();
            this.scrollNavChange(res);
            this.scrollTop = res.scrollTop;
            if (this.scrollTop < this.boundScrollTop + 20){
                this.carouselImgTransform = 'translate(0,'+-1*res.scrollTop/8+'px)';
            }
        },
        methods: {
            ...mapMutations(['setDefaultAddress', 'addGoods']),     
            //初始化满优惠列表数据
            initFullDisList(list){
                this.fullDisList = list;              
            },

            // 清空活动信息
            clearPromotionInfo(){
                this.preSellInfo = {};
                this.pinInfo = {};
                this.ladderInfo = {};
                this.secKillInfo = {};
                this.buyTogetherInfo = {};
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
                } else if (promotion.promotionType == promotionEnum.PRESELL.type) { // 预售
                    this.preSellInfo = promotion;
                } else if (promotion.promotionType == promotionEnum.PINGROUP.type) { //拼团
                    this.pinInfo = promotion;
                } else if (promotion.promotionType == promotionEnum.LADDER.type) { //阶梯团
                    this.ladderInfo = promotion;
                } else if (promotion.promotionType == promotionEnum.ECBUY.type) { //一起买
                    this.buyTogetherInfo = promotion;
                } 
                
                if (promotion.promotionType == promotionEnum.DAILY.type){ //天天专场 目前天天专场活动是没有详情接口的
                }
            },

            // 页面滑动的时候导航的menu菜单都要隐藏
            closeTopNavMenu(){
                try {
                    this.$refs.topNav.top_menu_show = false;    
                    this.$refs.topNav.right_menu_show = false;    
                } catch (error) {
                    
                }
            },

            // 滑动页面的时候，顶部的nav栏显隐处理
            scrollNavChange(res){
                this.closeTopNavMenu();
                
                if (res.scrollTop > 0){
                    this.right_nav_show = false
                    this.top_nav_show = true
                } else {
                    this.right_nav_show = true
                    this.top_nav_show = false
                }

                if (res.scrollTop > 0) {
                    if (this.hasRecommendGoods) { //有推荐
                        if (res.scrollTop >= this.nav3ScrollTop && res.scrollTop < this.nav4ScrollTop) {
                            this.currentNav = 2
                        } else if (res.scrollTop >= this.nav4ScrollTop) {
                            this.currentNav = 3;
                        }
                    } else { //无推荐
                        if (res.scrollTop >= this.nav1ScrollTop && res.scrollTop < this.nav4ScrollTop) {
                            this.currentNav = 0
                        } else if (res.scrollTop >= this.nav4ScrollTop) {
                            this.currentNav = 3
                        }
                    }
                }

                this.titleBarThemeControl()
            },

            //获取页面元素模块距离顶部的距离 done
            async getSelectorQuery() {
                let query = uni.createSelectorQuery().in(this);
                // 获取状态栏的高度
                let statusBarHeight = 0;
                await this.$nextTick()
                query.select('.params_html_title').boundingClientRect((res) => {
                    if (res) {
                        this.goodsParamsTop = res.top + (this.immersive?this.titleBarHeight:50);
                    }
                }).exec()
                query.select('.spec_param_title').boundingClientRect((res) => {
                    if (res) {
                        this.specsParamsTop = res.top + (this.immersive?this.titleBarHeight:50);
                    }
                }).exec()
                //获取对应模块到顶部的距离
                query.select('#nav1').boundingClientRect((res) => {
                    if (res) {
                        this.nav1ScrollTop = res.top - (this.immersive?this.titleBarHeight:50 + statusBarHeight);
                    }
                }).exec()
               
                if (this.hasRecommendGoods) { //有店铺推荐模块
                    query.select('#nav3').boundingClientRect((res) => {
                        if (res) {
                            this.nav3ScrollTop = res.top + (this.immersive?this.titleBarHeight:50 + statusBarHeight);
                        }
                    }).exec()
                }
                
                query.select('#nav4').boundingClientRect((res) => {
                    if (res) {
                        this.nav4ScrollTop = res.top + (this.immersive?this.titleBarHeight:50 + statusBarHeight);
                    }
                }).exec()
            },
            
            //点击nav的导航
            clickNav(navId) {
                this.currentNav = navId;
                let domScrollTop = document.documentElement.scrollTop;
                let toScrollTop;
                // let navbarheight = this.immersive?this.titleBarHeight:50;
                let id = navId+1;
                if(!!document.getElementById('nav'+id) && undefined!=document.getElementById('nav'+id).offsetTop){
                    if (navId==0){
                       toScrollTop = document.getElementById('nav'+(navId+1)).offsetTop; 
                    } else if (navId==2){
                        toScrollTop = this.nav3ScrollTop;
                    } else if (navId==3) {
                        toScrollTop = this.nav4ScrollTop;
                    }
                }else{
                    return;
                }
                let loop = 20;
                let count = 0;
                const step = () => {
                    document.documentElement.scrollTop += ((toScrollTop-domScrollTop) / loop);
                    if (++count < loop) {
                        // 这样是为了兼容ios滑动位置不准确问题
                        if (!this.isIos){
                            window?.requestAnimationFrame(step)
                        } else {
                            uni.pageScrollTo({ 
                                scrollTop: toScrollTop,
                                duration: this.scrollTop < 200 ? 100 : 300
                            });
                        }
                        this.top_nav_show = true;
                    }else{
                       this.immersive?(-1*this.titleBarHeight):-50===toScrollTop && (this.top_nav_show = false);
                    }
                }
                if (!this.isIos){
                    window?.requestAnimationFrame(step)
                } else {
                    uni.pageScrollTo({ 
                        scrollTop: toScrollTop,
                        duration: this.scrollTop < 200 ? 100 : 300
                    });
                }
            },

            //关闭领取随机优惠券弹框
            close(){
                this.rondomMod = false;
            },
            //去我的优惠券列表页面
            goMyCoupon(){
                this.$Router.push('/pages/coupon/myCoupon')
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
            clickPageView(){
                this.setViewedFollowDiscountGuide();
                this.setViewedGiftGuide();
            },
            // 说明预览了鹅毛情引导页
            setViewedGiftGuide(){
                this.showGiftGuidePop = false;
                if(!this.showFeatherEntry){ return }
                this.$setStorageSync('hasViewedGiftGuide', 1);
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
                this.$setStorageSync('hasViewedFollowDiscount', 1);
            },

            // 初始化admin后台配置的是否打开鹅毛情的开关
            async judgeGiftSwitch(){
                let { giftSwitch } = await window.getChannelOptions;
                this.giftSwitch = !!giftSwitch;
            },
            
            // 更新商品的相关信息
            updateGoodsInfos(){
                // 获取赠品和附件相关数据
                this.getListSkuGift();
                //获取区域限售状态
                this.getListAreaLimit();
                //获取商品库存状态
                this.getListStock(this.currentSpecNum);
            },

            //进入详情时请求足迹接口，加入足迹
            addLook() {
                personalHandler.addProductLookLog({
                    mainImage: this.goodsData.mainImage,
                    salePrice: this.goodsPriceInfo.salePrice,
                    sku: this.goodsData.sku,
                    skuName: this.goodsData.skuName,
                    storeId: this.storeInfo.storeId
                }).then(res => {
                    if (res.state == 200) {} else {
                        this.$api.msg(res.msg);
                    }
                })
            },
            
            successSelectAddress(address) { //选择成功回调

            },

            //轮播图切换
            change(e) {
                this.current = e.target.current;
                let findIndex = this.iconColorArr.findIndex(item => {
                    return item.index == this.current;
                })
                this.changeTitleBarColor = this.iconColorArr[findIndex].isLight;
                this.titleBarThemeControl();
            },

            gotoCustomerServiceModule(){
                this.$moduleGate(this.gotoCustomerService)
            },
            //跳转到客服系统
            async gotoCustomerService(){
                if (!this.hasLogin) {
                    return;
                }
                let url = await customerService.run(1, this.zcConfig(), 'product').catch(e=>{
                    console.log(e)
                });
                this.$openCustomerServicePage(url)
            },
            /********
             * 整合在线客服需要拼接的参数（用的在线客服事智齿科技）
             */
            zcConfig(){
                let that = this;
                let location = window.location;
                let callBackUrl = location.href.split('?')[0]+'?sku='+this.goodsData.sku;
                return {
                    card_title: '商品信息', //商品标题（必传）
                    card_url: encodeURIComponent(callBackUrl), //商品信息的商品链接地址（必传）（建议使用encodeURIComponent转义一下，防止链接中带有特殊符号导致参数获取失败）
                    card_desc: encodeURIComponent(this.goodsData.skuName), //商品信息的简述内容（选传）
                    card_note: '￥' + this.$getPartNumber(this.goodsPriceInfo.salePrice,'int')+this.$getPartNumber(this.goodsPriceInfo.salePrice,'decimal'), //2000元 商品标签例：价格（选传）
                    card_picture: encodeURIComponent(this.goodsData.images[0] || require('../../../static/shared/user/logo.png')), //商品的缩略图（选传）（建议使用encodeURIComponent转义一下，防止链接中带有特殊符号导致参数获取失败） 
                }
            },
            
            //回到页面顶部
            goTop() {
                uni.pageScrollTo({
                    scrollTop: 0,
                    duration: 300
                });
                this.currentNav = 0;
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
                        return "<text style='color:var(--tagColor)'>" + num + "</text>"
                    }).replace(/[\.]/g, function(num) {
                        return "<text style='color:var(--tagColor)'>" + num + "</text>"
                    }).replace(/x[\d]/g, function(num) {
                        return "<text style='color:var(--tagColor)'>" + num + "</text>"
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
            

            //获取商品价格相关的信息【批量接口】
            async getGoodsPrice(){
                this.priceLoading = true;
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
                    goodsHandler.getProductPrice(param).then(res => {
                        if(res.state == 200 && res.data?.products?.length > 0){
                            let list = res.data.products;               
                            this.goodsPriceInfo = list[0];
                        } else {
                            this.noPriceFun();
                        }
                        resolve(true)
                    }).catch(e => {
                        this.noPriceFun();
                        console.log(e);
                        resolve(true)
                    }).finally(()=>{
                        this.priceLoading = false;
                    })
                })
            },

            // 查询完价格后，如果没有查询到价格或者查询价格接口报错，此时将价格信息置空，同时按照商品下架处理该场景
            noPriceFun(){
                this.goodsPriceInfo = {} // 查询接口没有返回的时候，此时直接置空价格对象
                this.onSale = false; // 将商品按下架状态处理
            },         

            //获取商品详情信息
            getGoodsDetail(isGoodsChange) {
                uni.showLoading();
                let that = this;
                return new Promise((resolve, reject)=>{
                    goodsHandler.getDetail({
                        sku: this.sku //货品sku
                    }).then(async res => {
                        if (res.state == 200) {
                            this.isLoading = true;
                            this.goodsData = res.data; //详情信息
                            this.spu = res.data.spu;
                            //用户修改后的数量大于最小购买量的不再修改为最小购买量
                            this.currentSpecNum = (!!res.data.lowestBuy && (this.currentSpecNum<res.data.lowestBuy))?res.data.lowestBuy:this.currentSpecNum;
                            this.specs = res.data.specs; //规格列表
                            this.storeInfo = res.data.storeInf; //店铺信息
                            this.$bbcStatEvent({
                                behaviorType: 'gpv',
                                sku: this.sku,
                                storeId: res.data.storeId
                            });
                            this.onSale = res.data.state == 1 ? true : false;
                            this.specsList = [];
                            if (!!this.goodsData.brandName) {
                                this.specsList.push({
                                    parameterName: '品牌',
                                    parameterValue: this.goodsData.brandName
                                })
                            }
                            
                            this.soldOut = false;
                            this.setShareInfo();
                            this.setThirdShare();
                            await this.$nextTick
                            this.dealGoodsImages();
                            //调用我的足迹接口
                            this.addLook();
                            //获取店铺推荐商品列表
                            this.getRecommend(); 
                            this.getDecoraData(); //获取装修数据中装修的优惠券信息
                            this.boundScrollTop = this.$refs.space?.$el.offsetHeight - (this.immersive?this.titleBarHeight:50);
                            this.immersive = (!window?.titleBarHeight || window?.titleBarHeight==0)?false:true;
                            this.getSelectorQuery();
                            // 查询商品价格相关的信息
                            await this.getGoodsPrice();
                            uni.hideLoading();
                        } else {
                            //错误提示
                            this.soldOut = true;
                            if (res.state==300){
                                this.errorMsg = '商品已下架';
                                this.$api.msg(this.errorMsg);
                            } else {
                                this.errorMsg = res.msg;
                                this.$api.msg(res.msg);
                            }
                        }
                        
                        resolve(res.state);
                    }).finally(()=>{
                        uni.hideLoading();
                    })
                })
            },

            // 处理顶部的图片
            dealGoodsImages(){
                let that = this;
                that.goodsData.images && that.goodsData.images.forEach((item,index)=>{
                    averageColor(item, 0, 0, window.titleBarHeight).then(async imgColor =>{
                        that.averageRgb = imgColor;
                        let iconColor= await that.judgeIconColor();
                        that.iconColorArr.push({index,iconColor,isLight:iconColor})
                        if (that.iconColorArr.length == that.goodsData.images.length){
                            let findIndex = that.iconColorArr.findIndex(item => {
                                return item.index == that.current;
                            })
                            that.changeTitleBarColor = that.iconColorArr[findIndex].isLight;
                            that.titleBarThemeControl();
                        }
                    })
                })

            },
                       
            /**
             * 处理分享所需数据
             */
            async setShareInfo(){
                let that = this;
                if(!!!that.goodsData.sku){ return } //等有数据了，才能去分享
                that.shareOptions = await that.getGoodsDetailShareInfo(that.goodsData.sku)                
            },

            /***
             * 构造商品详情分享消息体
             */
            async getGoodsDetailShareInfo(sku){
                let that = this;
                let shareEntryConfig = {
                    path: "/views/goods/detail/index", // 巨拾惠小程序 商品详情页的路由path
                    query: `sku=${sku}` // 巨拾惠小程序 商品详情页的路由query
                }; 

                let shareTransferConfig = {
                    path: "/views/goods/share/index", // 巨拾惠小程序 商品详情页中转页的路由path
                    query: `sku=${sku}` // 巨拾惠小程序 商品详情页中转页的路由query
                }
                
                let miniConfig = await wxHandler.getMiniConfig(that.$config.WX_APPLET_TYPE_MALL); // 运营后台配置的渠道相关配置
                let shareImage = that.goodsData.shareImage; // 用分享的图片处理

                // 修复分享的图片模糊的问题
                try {
                    shareImage = shareImage.replace(/s100x100/g, 's400x400')
                } catch (error) {
                    console.log(error);
                }
                let bpparam = {
                    isShare:true
                }
                return new Promise(async (resolve) => {
                    sinosdk.sino.getAppInfo({'key':'msgSource'}).then(async res=> {
                        let appInfo = JSON.parse(res.value);
                        let callBackUrl = location.href.split('?')[0] + '?sku=' + sku + '&' + that.$config.BP_PARAM + '=' + setBpParam(bpparam); //伴正事分享鹅毛情地址
                        let wxSchemeData = {
                            version: miniConfig.appletType, //微信小程序分享类型 正式版:0， 测试版:1， 体验版:2
                            path: shareEntryConfig.path,
                            query: shareEntryConfig.query,
                            weixinAppletType: that.$config.WX_APPLET_TYPE_MALL
                        }
                        // 伴正事分享鹅毛情的相关信息
                        let shareData = {
                            title : that.goodsData.skuName, // 分享标题
                            wxTitle: that.goodsData.skuName, //分享小程序的title
                            desc : '我在商城发现不错的商品，点击查看', // 分享描述
                            link : callBackUrl, // 分享链接
                            imgUrl : that.goodsData.images[0] || require('../../../static/shared/user/logo.png'), // 分享图标,图片绝对地址  
                            wxImgUrl: shareImage,
                            appId: (appInfo.appId) || '268435729',//小应用Id
                            appName: appInfo.appName || appInfo.whereMsgFrom || '比N家',//小应用名字,无合法appId时使用appName
                            contentType: 'applet', // 分享类型,music、video或link applet[小程序] ，不填默认为link
                            path: `${shareEntryConfig.path}?${shareEntryConfig.query}`, //小程序页面路径；对于小游戏，可以只传入 query 部分，来实现传参效果，如：传入 "?foo=bar"
                            wxSchemeData, //微信小程序scheme参数
                            appletType: miniConfig.appletType, 
                            appletId: miniConfig.appletId,  // 小程序的原始id
                            shareMini: true, //是否需要分享小程序
                            shareTransferConfig,
                            shareEntryConfig
                        }
                        resolve(shareData);
                    }).catch(e=> {
                        console.log(e)
                    })
                })
            },

            /**
             * setThirdShare
             */
            async setThirdShare(){

                let that = this;
                if(!!!that.goodsData.sku){ return } //等有数据了，才能去分享
                let shareInfo = await that.getGoodsDetailShareInfo(that.goodsData.sku)
                //设置二次分享
                shareHandler.setThirdShareInfo(shareInfo);
            },
            
            handleJoinGroup(e) {
                if (e.pinState == 1) {
                    this.spellTeamId = e.spellTeamId
                } else if (e.pinState == 2) {
                } else if (e.pinState == 3) {
                    this.showSpecModel('joinLeague')
                }
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
             * 切换商品规格id
             * @param {str} sku 当前所选商品id，beforeChange
             * @param {arr} skuIds 商品规格list
             * @param {arr} dim 维度
             */
            async changeSpecSku(sku,skuIds,dim){
                let that = this;
                let tempList = that.getDimSkus(sku,skuIds,dim); //获取每个维度下的skuIds
                let tempListFilter=tempList.reduce((a, b) => a.filter(c => b.includes(c))); //获取每个维度skuIds的交集
                this.sku=tempListFilter[0];
                if(tempListFilter.length>0){
                    that.getSaleVolume();
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


            // 加入购物车
            addCart(){
                let that = this;
                if(!!this.disabledOperate){
                    return
                }
                this.$moduleGate(()=>{
                    that.addCartFun();
                })
            },

            //加入购物车功能
            addCartFun() {
                let that = this;
                uni.showLoading();
                const goodsItem = {
                    spu: this.spu,
                    sku: this.sku,
                    goodsPic: this.goodsData.mainImage,
                    mainImage: this.goodsData.mainImage,
                    skuName: this.goodsData.skuName,
                    isChecked: 1,
                    productPrice: this.goodsPriceInfo.salePrice,
                    goodsPrice: this.goodsPriceInfo.salePrice,
                    // productStock: this.remainNum,
                    storeId: this.storeInfo.storeId,
                    storeName: this.storeInfo.storeName,
                }
                this.$addCart({
                    num: this.currentSpecNum,
                    addressId: this.choosedAddress.addressId,
                    storeId: this.storeInfo.storeId,
                    goodsItem,
                    onSuccess(data){
                        uni.hideLoading();
                        // 先把页面数据添加到购物车, 之后再请求接口获取完整数据
                        that.addGoods(goodsItem)
                        that.$refs.specModel.close();
                    },
                    onError(){
                        uni.hideLoading();
                    }
                })
            },

            // 立即购买按钮回调
            buy(arg){
                let that = this;
                if(this.disabledOperate){
                    return
                }
                this.$moduleGate(()=>{
                    that.buyFun(arg);
                })
            },

            //确认下单
            buyFun(arg) {
                if (!this.hasLogin) {
                    return
                }
                let productInfo = [{
                    storeId:this.goodsData.storeId,
                    storeName:this.goodsData.storeName,
                    ownShop:this.goodsData.ownShop,
                    products:[{
                        number: this.currentSpecNum,
                        sku: this.sku,
                        skuName:this.goodsData.skuName,
                        specValues:this.goodsData.specValues==null?'默认':this.goodsData.specValues,
                        mainImage:this.goodsData.mainImage,
                        lowestBuy:this.goodsData.lowestBuy,
                        notAttendDiscount:false,
                        ownShop:this.goodsData.ownShop,
                        salePrice:this.goodsPriceInfo.salePrice,
                        storeId:this.goodsData.storeId,
                        categoryId3:this.goodsData.categoryId3,
                        cidPath:this.goodsData.cidPath,
                    }]
                }]
                let confirmParams = {
                    productInfo:productInfo
                }
                this.$setStorageSync('confirmParams',JSON.stringify(confirmParams))
                this.showState = 1
                let query = {
                    orderType: 1
                }
                if (JSON.stringify(this.pinInfo) != '{}' && this.pinButState == 0) {
                    query.isAloneBuy = true

                } else if (this.valiInfo(this.pinInfo) && (this.pinButState == 1)) {
                    query.isAloneBuy = false
                } else if (this.valiInfo(this.pinInfo) && this.pinButState == 3) {
                    query.isAloneBuy = false
                    query.spellTeamId = this.spellTeamId
                }
                let path = '';
                if (this.customFlag) { // 鹅毛情下单
                    if(this.$getStorageSync(this.hasPreviewCacheKey)){ // 说明用户已经浏览了了解鹅毛情页面
                        path = '/views/order/confirm/gift'
                    } else { //用户没有浏览了解鹅毛情页面
                        path = '/views/gift/preview/index'
                        query = {
                            ...query,
                            showFeatherConfirmBtn: 1
                        }
                    }
                } else { // 正常商品下单
                    path = '/views/order/confirm/normal'
                }
                this.$Router.push({
                    path: path,
                    query
                })
            },
            moveHandle() {},

          
            collectGoodsModule(){
                this.$moduleGate(this.collectGoods)
            },

            //收藏、取消收藏事件
            collectGoods() {
                if (!this.hasLogin) {
                    return;
                } else {
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
                            this.$api.msg(res.msg);
                        } else {
                            this.$api.msg(res.msg);
                        }
                    }).catch((e) => {
                        //异常处理
                    })
                }
            },

            //满优惠弹框
            openFullDisModel() {
                this.$refs.fullDisModel.open();
            },

            // 获取领券中心装修数据
            getDecoraData(){
                let param = {
                    decoId: this.$config.COUPON_TOPIC_ID,
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
            // 获取优惠券数据
            getDecoCouponList(couponIds) {
                if (couponIds.length === 0) {
                    return
                }
                let param = {};
                param.couponIds = couponIds;
                goodsHandler.couponCenter(param).then(async res => {
                    if (res.state == 200) {
                        let result = res.data.couponList;
                        result = result.filter((item)=>{
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
                            var skusjudge = !item.skus?.length||-1<item.skus?.split(',')?.findIndex((i)=>{return i == this.sku});
                            var catjudge = !item.couponCategoryVO || item.couponCategoryVO.categoryId == this.goodsData[`categoryId${item.couponCategoryVO.grade}`];
                            return (item.storeId == 0 || item.storeId == this.storeInfo.storeId) && skusjudge && catjudge
                        })
                        
                        this.couponList = result;  
                    }
                }).catch((e) => {

                })
            },
           
            //领券弹框
            openCouponModel() {
                this.$refs.couponModel.open();
            },

            //规则展开
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
            
            //立即领取
            goReceive(item) {
                let that = this;
                this.$moduleGate(()=>{
                    let couponId = item.couponId
                    let param = {couponId};
                    goodsHandler.receiveCoupon(param).then(res => {
                        if (res.state == 200) {
                            let result = res.data;
                            that.$api.msg('领取成功!');
                            that.getDecoraData();
                            if(item.couponType == 3){    //随机优惠券
                                that.rondomMod = true;
                                that.rondomDes = result;
                            }
                        } else {
                            that.$api.msg(res.msg);
                            that.getDecoraData();
                        }
                    }).catch((e) => {
                        //异常处理
                    })
                })
            },
            //获取店铺推荐商品信息
            getRecommend() {
                let that = this;
                let param = {};
                if(this.storeInfo.storeId){
                    param.storeId = this.storeInfo.storeId;
                }
                param.sku = this.sku;
                goodsHandler.getRecommendList(param).then(res => {
                    if (res.state == 200) {
                        let result = res.data;
                        this.recommendedList = result.recommendSkus;
                        this.getSelectorQuery();
                    } else {
                        this.$api.msg(res.msg);
                    }
                }).catch((e) => {
                    //异常处理
                })
            },
            //去分享
            goShare() {
                this.share_model = true;
                return

                // 2023/3/6 商品详情页的针对商品的分享改用纯h5的商品分享面板来实现，不用app的了
                // 调用APP分享
                sinosdk.sino.sharePanel({}).then((res)=>{
                    if(res.ret == "404"){
                        this.supportTypes = res?.responseData?.enableTypes;
                        this.share_model = true;
                    }
                }).catch((err) => {
                    console.log(err);
                    this.share_model = true;
                });

            },
            //关闭分享弹框
            closeShareModel() {
                this.share_model = false;
                this.showWeiXinBrowerTip = false;
            },

            // 打开商品规格的弹窗
            showSpecModelPop(){
                this.showSpecModelType = '';
                this.$refs.specModel.open();
            },

            //打开规格弹框
            showSpecModel(type, custom='') {
                // 区域限售和无货的时候 按钮屏蔽
                if(this.disabledOperate || !this.seckillStock){return}

                // 打开规格弹窗的时候，首先判断是否是鹅毛情打开的规格弹窗，最后用customFlag字段进行判断跳转哪一个下单页
                if (custom == 'custom'){
                    this.customFlag = true;
                } else {
                    this.customFlag = false;
                }

                if (type == 'add') {
                    this.showSpecModelType = 'add'
                } else if (type == 'buy') {
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
           
            //编辑数量
            async editNum(type, e){
                let that = this;
                if(!!e){
                    that.currentSpecNum = e.target.value || this.goodsData.lowestBuy || '1';
                }
                that.currentSpecNum = Number(that.currentSpecNum);
                let activityLimitNumber = 0; //活动的限购数量 0代表不限购
                if (that.secKillInfo && that.secKillInfo.state == 2) { //秒杀活动进行中
                    activityLimitNumber = that.secKillInfo.upperLimit;
                } else if (this.valiInfo(that.preSellInfo) && that.preSellInfo.startTime) { //预售进行中
                    activityLimitNumber = that.preSellInfo.buyLimit;
                } else if (this.valiInfo(that.buyTogetherInfo) && that.buyTogetherInfo.state == 2) { //一起买进行中
                    activityLimitNumber = that.buyTogetherInfo.upperLimit;
                } else if (this.valiInfo(that.pinInfo)) {
                    activityLimitNumber = that.pinInfo.buyLimit;
                } else if (this.valiInfo(that.ladderInfo)) {
                    activityLimitNumber = that.ladderInfo.buyLimitNum;
                }
                if (type == 'blur'){
                    if(that.currentSpecNum == ""){
                        setTimeout(() => {
                            that.currentSpecNum = that.goodsData.lowestBuy || 1;
                        }, 0)
                        return
                    }
                    if (that.currentSpecNum < 1 || that.currentSpecNum < that.goodsData.lowestBuy) {
                        that.currentSpecNum = that.goodsData.lowestBuy || 1;
                        setTimeout(() => {
                            uni.showToast({
                                title:'不能少于最少购买量',
                                icon:'none'
                            })
                        }, 0)
                        return;
                    }
                }
                if (type == 'add'){
                    that.currentSpecNum++;
                }else if(type == 'reduce'){
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
                //切换规格之后 需要更新相应的库存 赠品 区域销售等等
                that.updateGoodsInfos();


            },
            //关闭规格弹框
            closeSpecModel() {
                this.$refs.specModel.close();
            },
            
            
            goShopCartModule(){
                this.$moduleGate(this.goShopCart)
            },
            //去购物车页面
            goShopCart() {
                this.$Router.push({
                    path: '/pages/cart/cart',
                })
            },
            //去店铺商品列表页面
            toStoreGoodList() {
            },

            
            //去商品详情页
            goProductDetail(sku) {
                //添加time，避免链接完全相同导致的回退异常
                this.$Router.push({
                    path: '/standard/product/detail',
                    query: {
                        sku: sku,
                        time:new Date().getTime()
                    }
                })
            },

            valiInfo(info) {
                return JSON.stringify(info) != '{}'
            },
            

            // 关闭地址选择的弹窗
            addressPopClose() {
                this.$refs.addressChooseComp.close();
            },

            // 打开筛选框选择地址列表 此处两个变量 同时用settimeout是为了动画的展示效果
            showAddressList(){
                this.$refs.addressChooseComp.open();
            },


            //根据地址code和商品id获取运费
            getUserEx() {
                let that = this;
                if(!!!that.choosedAddress.provinceCode){
                    return;
                }
                goodsHandler.getCalculateExpress({
                    provinceCode: this.choosedAddress.provinceCode,
                    cityCode: this.choosedAddress.cityCode,
                    districtCode: this.choosedAddress.districtCode,
                    townCode: this.choosedAddress.townCode,
                    storeId: this.storeInfo.storeId,
                    productList:[
                        {
                            sku: this.sku,
                            number:this.currentSpecNum
                        }
                    ]
                }).then(res => {
                    if (res.state == 200) {
                        this.$set(this.deliverInfo, 'expressFee', res.data)
                    } else {
                        this.$api.msg(res.msg)
                    }
                })
            },
            // 获取赠品
            getListSkuGift() {
                if(!!this.choosedAddress.provinceCode && !!this.choosedAddress.cityCode && !!this.choosedAddress.districtCode){
                    goodsHandler.getGift({
                        skuInfos:[{
                            sku: this.sku,
                            num:this.currentSpecNum
                        }],
                        provinceCode:this.choosedAddress.provinceCode,
                        cityCode:this.choosedAddress.cityCode,
                        districtCode:this.choosedAddress.districtCode,
                        townCode:this.choosedAddress.townCode,
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
                }
            },

            // 获取商品的库存状态
            getListStock(currentSpecNum) {

                let that = this;
                return new Promise((resolve, reject) => {
                    if(!!this.choosedAddress.provinceCode && !!this.choosedAddress.cityCode && !!this.choosedAddress.districtCode){
                    goodsHandler.checkStock({
                        skuInfos:[{
                            sku: this.sku,
                            num: currentSpecNum
                        }],
                        provinceCode: this.choosedAddress.provinceCode,
                        cityCode: this.choosedAddress.cityCode,
                        districtCode: this.choosedAddress.districtCode,
                        townCode: this.choosedAddress.townCode
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
                  }
                })
            },

            // 获取商品的区域限售状态
            getListAreaLimit() {
                if(!!this.choosedAddress.provinceCode && !!this.choosedAddress.cityCode && !!this.choosedAddress.districtCode){
                    goodsHandler.checkAreaPurchase({
                        skus:[this.sku],
                        provinceCode: this.choosedAddress.provinceCode,
                        cityCode: this.choosedAddress.cityCode,
                        districtCode: this.choosedAddress.districtCode,
                        townCode: this.choosedAddress.townCode
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
                }
            },


            // 赠品模态框
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


            // 关闭模态框
            giftModelClose(){
                this.$refs.giftModel.close()
            },

            /**
             * 复制字符串
             */
            copyStr (str) {
                copyText(str);
                this.is_show_mask=false;
                this.is_show_maskNum = false;
            },
            copySku() {
                let jdSku = this.sku.split('JD')[1]
                copyText(jdSku)
            },
            hideCopyMask(){
                this.is_show_mask = false;
                this.is_show_maskNum = false;
            },
            //goods_name长按事件
            showOperate() {
                if(this.is_show_mask){
                    this.is_show_mask = false;
                    setTimeout(function(){
                        this.is_show_mask = true;
                    }.bind(this),300)
                }else{
                    this.is_show_mask = true;
                }
                this.is_show_maskNum = false;
            },
            //sku长按事件
            showOperateNum() {
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
            titleBarTheme(themeMode,backStyle,contentOpacity){
                this.$titleBar.set({
                    title:{
                        themeMode:themeMode,
                        backStyle:backStyle,
                        contentOpacity:contentOpacity
                    },
                    status:{
                        themeMode:themeMode
                    }
                    
                })
            },
            titleBarThemeControl(){
                if (this.scrollTop >= 0 && this.scrollTop < this.boundScrollTop/2){
                    this.titleBarTheme(this.changeTitleBarColor,'solid',1-(this.scrollTop / this.boundScrollTop)*2);
                    this.opacityObj = {navListOpacity:'rgba(255,255,255,'+ (this.scrollTop / this.boundScrollTop) + ')',textOpacity:'rgba(0,0,0,'+ (this.scrollTop / this.boundScrollTop) + ')',imgOpacity:this.scrollTop / this.boundScrollTop};
                } else if (this.scrollTop >= this.boundScrollTop/2 && this.scrollTop <= this.boundScrollTop){
                    this.titleBarTheme('dark','simple',((this.scrollTop-this.boundScrollTop/2) / this.boundScrollTop)*2);
                    this.opacityObj = {navListOpacity:'rgba(255,255,255,'+ (this.scrollTop / this.boundScrollTop) + ')',textOpacity:'rgba(0,0,0,'+ (this.scrollTop / this.boundScrollTop) + ')',imgOpacity:this.scrollTop / this.boundScrollTop};
                } else if (this.scrollTop > this.boundScrollTop){
                    this.titleBarTheme('dark','simple',1);
                    this.opacityObj = {navListOpacity:'rgba(255,255,255,1)',textOpacity:'rgba(0,0,0,1)',imgOpacity:1};
                }
            },
            

            // 判断导航栏图标颜色深浅
            judgeIconColor(){
                let g = this.averageRgb.r*0.299 + this.averageRgb.g*0.587 + this.averageRgb.b*0.114; //值越小颜色越深
                let IconColor;
                if (g >= 192){
                    IconColor = 'dark';
                } else {
                    IconColor = 'light';
                }
                return IconColor;
            },
            
            
            // 获取几个朋友购买了此商品
            getSaleVolume(){
                let param = {};
                param.skuId = this.sku;
                goodsHandler.getSaleVolume(param).then(res=>{
                    if (res.state == 200) {
                        this.saleVolume = res.data || 0;
                    }
                })
            },
            //去优惠券对应的商品列表
            goGoodsList(item) {
                if(item.linkInfo!=null){
                   let skipUrl={};
                   try{
                       skipUrl=JSON.parse(item.linkInfo);
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
                        path: '/pages/activity/activity',
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
                    path: '/standard/product/list',
                    query: {
                        source: 'coupon',
                        ...params
                    }
                })
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
            /**
             * 切换或者获得地址信息
             */
            async getAddressInfo(){
                if((this.choosedAddress && this.choosedAddress.addressId) || this.promiseTime){
                    this.showAddressList()
                } else {
                    if(!this.promiseTime){
                        uni.showModal({
                            content: '将获取你的定位信息，是否同意',
                            success: async (res) => {
                                if (res.confirm) {
                                    let locationInfo = null
                                    uni.showToast({
                                        title:'正在获取定位信息...',
                                        icon:'none',
                                        duration:700
                                    })
                                    if(!this.hoveLocation && !this.getLocationing) {
                                        if (SnUtils.isPC()){ //pc调用h5定位
                                            locationInfo = await this.getLocationByGaode();
                                        } else {
                                            locationInfo = await this.getLocationByApp();
                                        }
                                        if(locationInfo) {
                                            const addressCodeInfo = await getAddressFromMap(locationInfo)
                                            this.choosedAddress = addressCodeInfo
                                        }
                                    }


                                } else if (res.cancel) {
                                    this.showAddressList() 
                                }
                            }
                        })
                    }
                }

            },
            /**
             * 获取定位信息
             */
            getLocationByGaode(){
                let _this = this;
                return new Promise((resolve)=>{
                    var onComplete = function(data){
                        if (_this.hoveLocation){
                            return
                        }
                        resolve(data?.formattedAddress);
                        _this.getLocationing = false;
                        _this.hoveLocation = true;
                        offLocation();//关闭定位
                    }
                    var onError = function(error){
                        uni.showToast({
                            title:error,
                            icon:'none',
                            duration:1500
                        })
                        _this.showAddressList()
                        _this.getLocationing = false
                        offLocation()//关闭定位
                    }
                    //使用高德地图定位
                    geoLocationByGaode(onComplete,onError);
                })
            },
            /**
             * 获取定位信息
             */
            getLocationByApp(){
                let _this = this;
                return new Promise((resolve)=>{
                    var onComplete = function(data){
                        if (_this.hoveLocation){
                            return
                        }
                        resolve(data.regionName);
                        _this.getLocationing = false;
                        _this.hoveLocation = true;
                        offLocation();//关闭定位
                    }
                    var onError = function(error){
                        _this.getLocationing = false
                        if(!hoveLocation){
                            SnUtils.showToast(error)
                            _this.showAddressList();
                        }
                        
                    }
                    //使用app定位
                    geoLocation(onComplete,onError);
                    //如果app定位失败则调用H5定位
                    setTimeout(() => {
                        if (!_this.hoveLocation){
                            _this.getLocationByGaode();
                        }
                    }, 5000);
                })
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
                if(calendarInfo.state == 200 && calendarInfo.data?.productPromiseCalendars.length>0){
                    let time = calendarInfo.data.productPromiseCalendars[0].promiseTime
                    if(typeof time === 'string' && time.indexOf('（') > -1) {
                        this.promiseTime = time.replace(/\（/g, ' (').replace(/\）/g, ') ')
                    } else {
                        this.promiseTime = time
                    }
                }
            },
            /**
             * 规格弹窗地址切换
             */
            changeAddress(info){
                if(info.addressId){
                    this.$setStorageSync('addressId', info.addressId);
                    this.setDefaultAddress()
                }
            },
        }
    }
</script>

<style lang='scss'>
page {
    background: $bg-color-split;
    /* padding-bottom: 100rpx; */
    width: 750rpx;
    margin: 0 auto;
}

.container {
    position: relative;
    padding-bottom: 10rpx;
    overflow: hidden;
    margin-top: calc(-1*var(--titleBarFillHeight));
    padding-bottom: 120rpx;
}   

.addressDefault {
    color: #c2c2c2 !important;
}

    
/* 标题简介 */
.introduce_section {
    background: #fff;
    padding: 30rpx 0;
    margin-bottom: 20rpx;
    border-radius: 20rpx;
    position: relative;

    //价格区域
    .price_part {
        align-items: center;
        margin-bottom: 20rpx;
        padding-left:30rpx;

        .sell_price {
            color: var(--confirmBtnBgColor2);

            .unit {
                font-size: 36rpx;
                font-weight: normal;
            }

            .price_int {
                font-size: 52rpx;
                line-height: 50rpx;
                margin-left: 4rpx;
                font-weight: normal;
            }

            .price_decimal {
                font-size: 26rpx;
                font-weight: normal;
            }

        }
        .not_price {
            color:#222;
            font-weight: bold;
            .unit {
                font-size: 36rpx; 
            }
            .not_price_tips{
                font-size: 36rpx;
                margin-left: 8rpx;
            }
        }

        .original_price {
            color: #949494;
            font-size: 22rpx;
            text-decoration: line-through;
        }

        .bijia-box {
            display: flex;
            align-items:baseline;
            margin-top: 3px;
            opacity: 0.86;

            .net-price {
                color:#fff;
                font-size:24rpx;

                .compare_icon {
                    width: 31rpx;
                    height: 31rpx;
                    display: inline-block;
                    background-image: url('@/static/shared/compare/btn_common_VS.svg');
                    background-repeat: no-repeat;
                    background-size: 100% 100%;
                    transform: translate(-4rpx,6rpx);

                }

                .actual_price{
                    font-size: 26rpx;
                }
            }
            .separator {
                width: 2px;
                height: 8px;
                background-color: #ffb1b1;
                margin: 0 12rpx;
            }
            .bijia-btn {
                height: 36rpx;
            }
            .to_jd_title {
                color:#fff;
                margin-right:4rpx;
                cursor: pointer;
            }
            .right_vs {
                width: 28rpx;
                height: 28rpx;
                cursor: pointer;
                transform:translateY(6rpx)
            }
            
        }
    }

    .jd_bj_bg {
        height: 160rpx;
        background-image: url('@/static/shared/goods/bg_xq_shihui.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        padding: 31rpx 0 16rpx 34rpx;
        position: relative;

        .sell_price{
            color: #fff;
            font-weight: bold;
            

            .affordable_text {
                font-size: 24rpx;
                margin-right:4rpx;
            }
            .unit,.price_decimal {
                
                font-size: 32rpx;
                
            }
            .price_int{
                font-size: 48rpx;
            }
        }

        .price_sheng {
            position: absolute;
            top: 10rpx;
            right:76rpx;
            color: #fff;
            font-size: 24rpx;

            .price_int {
                font-size: 36rpx;
            }

        }
        .filled {
            font-size: 20rpx;
            .price_int {
                font-size: 30rpx;
            }
        }

    }

    .price_info_part {
        padding: 34rpx 30rpx 0 30rpx;
        border-radius:30rpx 30rpx 0 0;
        //z-index:2;
        transform:translateY(-40rpx);
        background:#fff;
    }

    .price_info_part_normal {
        padding: 0 30rpx;
    }

    .goods_name {
        font-size: 30rpx;
        font-weight: 600;
        color: #333333;
        line-height: 143%;
        word-break: break-word;
        margin-bottom: 28rpx;
        user-select: text;
        text-align: justify;
        word-break: break-all;
        // user-select: none;
    }
    .row_box{
        margin-bottom: 26rpx;
        .saleVolumeBox{
            max-width: 340rpx;
            height: 40rpx;
            display: flex;
            justify-content: flex-end;
            .saleVolume.fontScaleIgnore{
                display: block;
                width: fit-content;
                padding: 0 18rpx 0 120rpx;
                height: 40rpx;
                line-height: 40rpx;
                border-radius: 20rpx;
                font-size: 24rpx;
                color: #5374B5;
                overflow: hidden;
                background: url('@/static/shared/goods/icon_dzm_biaoqian.png') left no-repeat;
                background-size: 340rpx 100%;
                word-break: break-all;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
    .goods_operation{
        .share{
            .iconshare{
                width: 40rpx;
                height: 40rpx;
                background: url('@/static/shared/common/icon/btn_common_share.png') center no-repeat;
                background-size: 100% 100%;
            }
        }
        .text{
            height: 34rpx;
            line-height: 34rpx;
            font-size: 24rpx;
            
            font-weight: 400;
            text-align: left;
            color: #666666;
            margin-left:4rpx
        }
        .collection {
            height: 40rpx;
            .collectIcon{
                width: 40rpx;
                height: 40rpx;
                &.collectedIcon{
                    background: url('@/static/shared/common/icon/btn_common_soucang_sel.svg') center no-repeat;
                    background-size: 100% 100%;
                }
                &.collectedIconMove{
                    background: url('@/static/shared/common/icon/btn_common_soucang_sel.svg') center no-repeat;
                    background-size: 100% 100%;
                    animation: mymove 0.3s ease;
                    @keyframes mymove
                    {
                        0% {transform: scale(0);}
                        50% {transform: scale(1.2);}
                        100% {transform: scale(1);}
                    }
                }
                &.noCollectIcon{
                    background: url('@/static/shared/common/icon/btn_common_soucang.png') center no-repeat;
                    background-size: 100% 100%;
                }
            }

        }
        .demandDiscount{
            position: relative;
            .follow_discount_tip {
                position: absolute;
                right: -20rpx;
                bottom: 80rpx;
                width: 362rpx;
                height: 176rpx;
                background: url("@/static/shared/gift/icon_eqm_yyhyingdao.png") no-repeat;
                background-size: contain;
                -webkit-animation: bounce-down 1.6s linear infinite;
                animation: bounce-down 1.6s linear infinite;
            }
            .money_image{
                width: 40rpx;
                height: 40rpx;
                background: url('@/static/shared/goods/btn_common_yaoyouhui_jsh.png') center no-repeat;
                background-size: 100% 100%;
            }
        }
        view {
            .iconfont {
                font-size: 40rpx;
                color: #222222;

                &.active {
                    color: $main-color;
                }
            }

            .show_text {
                color: #222222;
                font-size: 20rpx;

                &.active {
                    color: $main-color;
                }
            }

    
        }
    }
    .showMaskBox{
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        height: 0;
        top:-42rpx;
        z-index: 100;
        &.showMaskSkuBox{
            top:-100rpx;
        }
        .showMask{
            width:190rpx;
            height:80rpx;
            background-color:rgba(0,0,0,1);
            color:#fff;
            display:flex;
            align-items: center;
            justify-content: center;
            border-radius: 20rpx;
            position: relative;
            .sanjiao{
            width: 0;
            height: 0;
            border: 23rpx solid;
            border-top-color: rgba(0,0,0,1);
            border-bottom-color: transparent;
            border-left-color: transparent;
            border-right-color: transparent;
            position: absolute;
            bottom:-44rpx;
            }
        }
    }
    .goods_productId.fontScaleIgnore{
        font-size: 24rpx;
        
        font-weight: 400;
        color: #a4acb2;
        line-height: 40rpx;
        // margin-top: 26rpx;
        padding: 0 20rpx 0 0;
        width:fit-content;
    }

    .coupon-tip {
        align-items: center;
        padding: 4rpx 10rpx;
        background: $uni-color-primary;
        font-size: $font-sm;
        color: #fff;
        border-radius: 6rpx;
        line-height: 1;
        transform: translateY(-4rpx);
    }


}
   
    
.gift {
    padding: 0 30rpx;
    box-sizing: border-box;
    background: #FFFFFF;
    // border-bottom: 1px solid #f2f2f2;
    height: 96rpx;
    border-radius: 10px 10px 0px 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .good-gift-choose {
        width: 100%;
        display: flex;
        align-items: center;
        // padding: 20rpx 0rpx;
        .gift_title {
            font-size: 28rpx;
            
            font-weight: 400;
            color: #999999;
            line-height: 40rpx;
            margin-right: 28rpx;
        }
        .gift_right_content{
            flex:1;
            .gift_content {
                display: flex;
                align-items: center;
                &:nth-child(2){
                    margin-top: 10rpx;
                }
                font-size: 28rpx;
                
                font-weight: 500;
                color: #343434;
                height: 40rpx;
                .gift_content_icon{
                    // width: 56rpx;
                    height: 30rpx;
                    padding: 0 6rpx;
                    // border: 1rpx solid var(--tagColor);
                    border: 1rpx solid #f30300;
                    border-radius: 6rpx;
                    font-size: 20rpx;
                    // color: var(--tagColor);
                    color: #f30300;
                    letter-spacing: 1.82rpx;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .gift_content_text{
                    flex:1;
                    margin-left: 6rpx;
                    
                    font-size: 28rpx;
                    color: #333333;
                    font-weight: 500;
                    line-height: 45rpx;
                    width: 500rpx;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    word-break: break-all;
                }
                .gift_right {
                    width: 24rpx;
                    height: 24rpx;
                }
            }
        }
    }

}

.spec_con {
    position: relative;
    margin-top: -60rpx;
    padding: 28rpx 30rpx;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    min-height: 96rpx;
    background: #FFFFFF;

    .spec_left {
        display: flex;
        .spec_left_title {
            font-size: 26rpx;
            
            font-weight: 400;
            color: #999999;
            line-height: 40rpx;
            margin-right: 28rpx;
        }
        .spec_left_content {
            width: 550rpx;
            word-break: break-all;
            text-align: justify;
            font-size: 26rpx;
            font-weight: 600;
            color: #333333;
            line-height: 40rpx;
            margin-right: 18rpx;
        }
    }

    .spec_right {
        width: 24rpx;
        height: 24rpx;
        margin-top: 8rpx;
    }
}
   

/* 活动 start */
.activity {
    background: #FFFFFF;
    margin-top: 20rpx;
    padding: 30rpx;
    box-sizing: border-box;
    border-radius: 20rpx;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    .activity_left{
        .activity_coupons_tips {
            width: 80rpx;
            height:40rpx;
            font-size: 28rpx;
            
            font-weight: 400;
            color: #999999;
            line-height: 40rpx;
        }
    }
    .activity_right{
        display: flex;
        flex-direction: column;
        /* 领券 start */
        .activity_coupons {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            height: 40rpx;
            // margin-bottom: 8rpx;
            .activity_coupons_left {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                height: 40rpx;
                .activity_coupons_center {
                    display: flex;
                    align-items: center;
                    height: 40rpx;
                    .activity_coupons_title {
                        line-height: 40rpx;
                        font-size: 28rpx;
                        
                        color: var(--tagColor);
                        margin: 0 12rpx 0 0;
                        letter-spacing: 1.82rpx;
                    }
                    .activity_coupons_list {
                        height: 40rpx;
                        display: flex;
                        align-items: center;
                        flex-wrap: wrap;
                        // margin-top: 6rpx;
                        .activity_coupons_pre {
                            width: auto;
                            height: 30rpx;
                            white-space: nowrap;
                            padding: 0 6rpx;
                            font-size: 20rpx;
                            
                            font-weight: 500;
                            color: var(--tagColor);
                            border: 2rpx solid var(--tagColor);
                            border-radius: 6rpx;
                            margin-right: 8rpx;
                        }
                    }
                }
            }
            .activity_conpons_right {
                height: 100%;
                display: flex;
                align-items: center;
                image {
                    width: 24rpx;
                    height: 24rpx;
                }
            }
        }
        /* 领券 end */
        /* 满优惠 start */
        .activity_full{
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            width: 100%;
            // margin-top: 8rpx;
            .full_discount{
                display: flex;
                align-items: flex-start;
                .full_discount_title {
                    // width: 88rpx;
                    padding: 0 10rpx;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 20rpx;
                    
                    font-weight: 500;
                    color: var(--tagColor);
                    border: 2rpx solid var(--tagColor);
                    border-radius: 6rpx;
                    letter-spacing: 1.82rpx;
                    margin-top: 4rpx;
                }
                .full_discount_list {
                    margin-left: 12rpx;
                    line-height: 40rpx;
                    font-size: 28rpx;
                    
                    font-weight: 500;
                    color: #333333;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    word-break: break-all;
                    flex: 1;
                }
            }
        }
        /* 满优惠 end */
    }
}

/* 活动 end */

.full_discount_list view ::v-deep div {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    width: 500rpx;
}

/* 优惠券弹框 start */
.coupon_model {
    width: 100%;
    height: 100%;
    background: #F5F5F5;
    border-radius: 28rpx 28rpx 0 0;
    padding-bottom: var(--safe-area-inset-bottom);

    .coupon_model_list {
        box-sizing: border-box;
        height: 100%;
        width: 750rpx;
        overflow-x: hidden;
        padding: 0rpx 20rpx 0;
        box-sizing: border-box;

        .coupon_tips {
            margin-top: 32rpx;
            font-weight: bold;
            color: #333333;
            font-size: 30rpx;
        }

        .my_coupon_pre {
            margin-top: 16rpx;
            position: relative;
            &:last-child{
                margin-bottom: 30rpx;
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
                        width: fit-content;
                        margin-top: 19rpx;
                        font-size: 28rpx;
                        font-family: Source Han Sans CN;
                        font-weight: bold;
                        line-height: 34rpx;
                        .price_int{
                            font-size: 56rpx;
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

                .coupon_pre_cen,.coupon_pre_cen{
                    display: felx;
                    flex-direction: column;
                    flex: 1;
                    padding: 22rpx 0rpx 22rpx 10rpx;
                    color: #222222;
                    background: #fff;

                    .coupon_pre_title {
                        min-height: 72rpx;
                        line-height: 36rpx;
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

                    .coupon_pre_time {
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
                        &.haveNotUse{
                            padding: 28rpx 0 24rpx 0;
                            flex-direction: column;
                            justify-content: space-between;
                            background: linear-gradient(152deg,#FF2929 4%, #FC1C1C 100%);
                            &>view:first-child{
                                font-size: 26rpx;
                            }
                            &>view:nth-child(2){
                                padding: 4rpx 22rpx;
                                line-height: 20px;
                                background: #fff;
                                color: #f30300;
                                border-radius: 24rpx;
                                font-weight: bold;
                            }
                        }
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

            .get_link {
                color: #fff;
            }
        }
    }
}

/* 优惠券弹框 end */

/* 满优惠弹框 */
.fulldis_model {
    width: 100%;
    height: 100%;
    background: #FFFFFF;

    .fulldis_model_list {
        box-sizing: border-box;
        width: 750rpx;
        height: 700rpx;
        padding-top: 50rpx;
        /* background: #FFFFFF; */

        .fulldis_model_pre {
            display: flex;
            padding-left: 44rpx;
            box-sizing: border-box;
            margin-bottom: 57rpx;
            flex-shrink: 0;

            .fulldis_pre_tips {
                width: 10rpx;
                height: 10rpx;
                background: var(--tagColor);
                border-radius: 50%;
                margin-top: 15rpx;
            }

            .fulldis_pre_con {
                width: 650rpx;
                font-size: 28rpx;
                
                font-weight: bold;
                color: #333333;
                line-height: 39rpx;
                margin-left: 20rpx;
            }
        }
    }

    .full_dis_tips {
        font-size: 22rpx;
        
        font-weight: 500;
        color: #999999;
        line-height: 38rpx;
        padding: 0 69rpx 60rpx 66rpx;
        box-sizing: border-box;
        background: #FFFFFF;
    }
}

/* 店铺推荐 start */
.store_recommend {
    background-color: #FFFFFF;
    margin-top: 20rpx;
    padding-top: 30rpx;

    .store_recommend_top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20rpx;
        margin-bottom: 30rpx;

        .store_recommend_title {
            font-size: 30rpx;
            
            font-weight: 500;
            color: #333333;
            line-height: 45rpx;
        }

        .store_recommend_more {
            text {
                font-size: 26rpx;
                
                font-weight: 500;
                color: #FC281F;
                line-height: 45rpx;
            }

            image {
                width: 12rpx;
                height: 20rpx;
                margin-left: 18rpx;
            }
        }
    }

    .store_recommend_list {
        display: flex;
        flex-wrap: wrap;
        padding: 0 20rpx;

        .store_recommend_pre {
            margin-right: 20rpx;
            margin-bottom: 30rpx;

            &:nth-of-type(3n) {
                margin-right: 0;
            }

            .store_reco_pre_image {
                position: relative;
                width: 223rpx;
                height: 223rpx;
                border-radius: 15rpx;

                image {
                    width: 223rpx;
                    height: 223rpx;
                    border-radius: 15rpx;
                }

                .store_reco_pre_price {
                    width: 223rpx;
                    min-height: 40rpx;
                    background: rgba(0, 0, 0, 0.3);
                    border-radius: 0 0 15rpx 15rpx;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    font-size: 20rpx;
                    
                    font-weight: 500;
                    color: #FFFFFF;
                    text-align: center;

                    text:nth-child(2) {
                        font-size: 26rpx;
                    }
                }
            }

            .store_reco_pre_name {
                font-size: 28rpx;
                
                font-weight: 500;
                color: #2D2D2D;
                line-height: 128%;
                width: 223rpx;
                text-overflow: -o-ellipsis-lastline;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                line-clamp: 2;
                -webkit-box-orient: vertical;
                margin-top: 20rpx;
            }
        }
    }
}

/* 店铺推荐 end */


/*  详情 */
.detail-desc {
    background: #fff;
    overflow-x: hidden;
    padding: 24rpx 30rpx 38rpx;
    box-sizing: border-box;
}
    

.gift_yindao_mask{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,0);
    z-index: 1000;
}

/* 底部操作菜单 */
.bottomArea{
    position: fixed;
    bottom: 0rpx;
    z-index: 95;
    display: flex;
    flex-flow: column;
    width: 750rpx;        
    .page_bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 750rpx;
        background: #fff;
        height: calc(120rpx + var(--safe-area-inset-bottom));
        padding: 0 30rpx 0 12rpx;
        box-shadow: 0px 0px 20px 0px rgba(86, 86, 86, 0.2);
        /* 兼容 iOS < 11.2 */
        padding-bottom: var(--safe-area-inset-bottom);
        /* 兼容 iOS >= 11.2 */
        box-sizing: border-box;
        .leftIcon{
            display: flex;
            flex: 1;
            justify-content: space-evenly;
        }
        .p_b_btn {
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: $font-sm;
            color: $font-color-base;
            flex: 1;
            height: 80rpx;
            position: relative;
            & > view{
                width: 80rpx;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                position: relative;
            }
            &.gift_footer_btn{
                position: relative;
                .yindao_bottom{
                    position: absolute;
                    width: 106rpx;
                    height: auto;
                    max-width: initial;
                    bottom: -14rpx;
                }
                .yindao_top{
                    position: absolute;
                    width: 368rpx;
                    height: auto;
                    max-width: initial;
                    bottom: 94rpx;
                    -webkit-animation: bounce-down 1.6s linear infinite;
                    animation: bounce-down 1.6s linear infinite;
                }
            }

            .image {
                width: 44rpx;
                height: 44rpx;
            }
            .iconfont.fontScaleIgnore{
                font-size: 44rpx;
                color: #333;
            }
            .show_text {
                color: #2D2D2D;
                font-size: 20rpx;

                &.pk_text {
                    // transform: translateY(-4rpx);
                    text-shadow: 0px 3px 10px 0px rgba(147,148,159,0.20); 
                }
            }


            .cart_num {
                position: absolute;
                width: 28rpx;
                height: 28rpx;
                text-align: center;
                background: #f30300;
                border-radius: 50%;
                font-size: 18rpx;
                
                font-weight: 900;
                color: #fff;
                line-height: 28rpx;
                left: 58rpx;
                top: -8rpx;
                z-index: 5;
                box-shadow: 1px 2px 3px 0px rgba(249,3,0,0.24);
            }

        }

        
    }
}

.share_model {
    width: 750rpx;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
    background: rgba(0, 0, 0, 0.6);
    z-index: 999;
    .bizmateshareWrap{
        position: absolute;
        left: 0;
        right:0;
        bottom: 0;
    }
}

.list {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 24rpx 30rpx;
    background: #fff;
    position: relative;
}


.gift_model-content-box{
    padding: 20rpx;
    padding-bottom: var(--safe-area-inset-bottom);
    display: flex;
    height: 100%;
    background-color: #fff;
    overflow: hidden;
    .title{
        padding-right: 10rpx;
        .title-name{
            font-size: 24rpx;
            border: 1px solid var(--tagColor);
            border-radius: 8rpx;
            color: var(--tagColor);
            padding: 2rpx 8rpx;
        }
    }
    .gift-list{
        padding: 0;
        flex:1;
        display: block;
        ul{
            padding: 0;
            list-style: none;
            li{
                cursor: pointer;
                margin-bottom: 20rpx;
                width: 100%;
                .top-content{
                    .content{
                        font-size: 24rpx;
                        line-height: 24rpx;
                        color:#222;
                    }
                }
                .num{
                    font-weight: 600;
                    font-size: 24rpx;
                }
            }
        }
    }
}

.union_name {
    display: inline-flex;
    height: 40rpx;
    line-height: 40rpx;
    margin-right: 10rpx;
    align-items: center;
    justify-content: center;
    vertical-align: top;

    i {
    display: flex;
    padding: 0 8rpx;
    color: #fff;
    font-size: 20rpx;
    border-radius: 6rpx;
    height: 32rpx;
    line-height: normal;
    font-style: normal;
    align-items: center;
    align-content: center;
    justify-content: center;
    }
}
  
.soldOut{
    width: 100%;
    height: 100vh;
    padding-top: calc((100vh - var(--titleBarFillHeight, 0px))*0.32 - 128rpx);
    .img {
        width: 256rpx;
        height: 256rpx;
        background: var(--detailEmptyImg);
        background-size: 100% 100%;
    }

    text {
        font-size: 28rpx;
        color: $main-third-color;
    }
}
.max_content_box{
    position: relative;
    background: #EFF2F5;
    border-radius: 20rpx 20rpx 0 0;
}
.emaoqing{
    margin: 20rpx 0;
}


@-webkit-keyframes bounce-down {
    25% {
        -webkit-transform: translateY(-4px);
    }
    50%, 100% {
        -webkit-transform: translateY(0);
    }
    75% {
        -webkit-transform: translateY(4px);
    }
}
 
@keyframes bounce-down {
    25% {
            transform: translateY(-4px);
    }
    50%, 100% {
            transform: translateY(0);
    }
    75% {
            transform: translateY(4px);
    }
}

.toast{
    padding: 20rpx;

    ::v-deep .toast-content{
        margin-top: 20rpx;
    }

    ::v-deep .toast-icon>image{
        width: 80rpx;
        height: 80rpx;
    }
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
.activitySlogan{
    height: 104rpx;
    background: var(--promotionBg1);
    background-size: 100% 100%;
    border-radius: 10px 10px 0px 0px;
    margin-bottom: -24rpx;
}

/* 优惠标签右侧内容 */
.right_content {
    width: 98rpx;
    height: 44rpx;
    background-image: url("@/static/shared/coupon/bg_xq_huodong.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    font-size: 24rpx;
    color: #fff;
    line-height: 44rpx;
    letter-spacing: 2rpx;
    padding-left: 12rpx;
}
.spec_model ::v-deep .uni-popup__wrapper-box{
    height: 80vh;
}

// 京东vs引导弹窗
.jd_vs_yindao {
    position: relative;
    width: 590rpx;
    height: 68vh;
    padding: 0 44rpx;
    background-color: #fff;
    border-radius: 32rpx;
    display: flex;
    flex-direction: column;
    text-align: center;

    .title {
        width: 100%;
        height: 64rpx;
        img {
            width: 364rpx;
            height: 64rpx;
        }
    }

    .close {
        position: absolute;
        width: 36rpx;
        height: 36rpx;
        top: 24rpx;
        right: 32rpx;
        cursor: pointer;
    }

    .content {
        flex: 1;
        overflow-y: auto;
        margin-top: 40rpx;
    }

    .bottom {
        padding: 18rpx 0 40rpx;
        .copyBtn {
            width: 100%;
            height: 72rpx;
            line-height: 72rpx;
            border-radius: 36rpx;
            color: #fff;
            font-size: 28rpx;
            background: linear-gradient(180deg,#FFB78B 0%,#F30300 100%);
            cursor: pointer;
        }
    }
}
</style>
