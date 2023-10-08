<template>
    <view class="shop_homepage">
        <!-- 透明遮罩层 -->
        <view class="transparent_mask" v-if="transparent_mask" @tap="hideMask"></view>
        <view class="content">
            <!-- 搜索 -->
            <view class="fixed_top_status_bar" v-if="!searchShow"></view>
            <view  class="search" v-if="!searchShow"> 
                <view></view>
                <view v-if="shop_open" class="search_input" @tap="goSearch">
                    <image :src="imgUrl+'common/icon/shop_list_search.png'"></image>
                    <input :placeholder="$L('搜索店铺内商品')" disabled="true" />
                </view>
                <view v-if="shop_open" class="more_tips">
                    <image class="more" :src="imgUrl+'common/icon/more1.png'" @tap="moreTips"></image>
                    <block v-if="tips_show">
                        <view class="triangle-up"> </view>
                        <view class="tips">
                            <template v-for="(item, index) in tips">
                                <button v-if="item.guestShow || !disabledModule" :key="index" class="tips_pre" @tap="handleLink" :data-link="item.tips_link"
                                 :open-type="item.type" :data-type="item.type" plain="true">
                                    <text class="iconfont" :class="item.tips_img"></text>
                                    <text>{{item.tips_name}}</text>
                                </button>
                            </template>
                            
                        </view>
                    </block>
                </view>
            </view>
            <!-- 搜索 -->

            <view class="fixed_top_status_bar" :style="'opacity:'+scrollTopH/100"></view>
            <view class="search1" v-if="(!homePage || searchShow)&&shop_open">
                <view class="search_input" @tap="goSearch">
                    <image :src="imgUrl+'common/icon/shop_list_search.png'"></image>
                    <input :placeholder="$L('搜索店铺内商品')" disabled="true" />
                </view>
                <view class="more_tips">
                    <image class="more" :src="imgUrl+'common/icon/more.png'" @tap="moreTips"></image>
                    <block v-if="tips_show">
                        <view class="triangle-up"> </view>
                        <view class="tips">
                            <template v-for="(item, index) in tips">
                                <button :key="index"  v-if="item.guestShow || !disabledModule" class="tips_pre" @tap="handleLink" :data-link="item.tips_link"
                                :open-type="item.type" :data-type="item.type" plain="true">
                                    <image :src="item.tips_img"></image>
                                    <text>{{item.tips_name}}</text>
                                </button>
                            </template>
                        </view>
                    </block>
                </view>
            </view>
            <!-- 店铺信息-->
            <view class="shop_des" v-if="shop_open" :style="'background-image:url(' + ((homePage || searchShow || fenlei) ? store_banner : '') + ');background-size:100% 100%;background-repeat:no-repeat;'">
                <view class="des_top" v-if="homePage">
                    <view class="shop_info" :style="'opacity:'+(1-(scrollTopH)/60)">
                        <view class="info_left" @tap="handleStoreIntroduction" :data-vid="vender_detail.storeId">
                            <image class="avat" :src="vender_detail.storeLogoUrl" mode="aspectFill"></image>
                            <view class="info_des">
                                <view class="info_top">
                                    <text>{{vender_detail.storeName}}</text>
                                    <image :src="imgUrl+'common/icon/icon_common_rightarrow.svg'"></image>
                                    <text v-if="vender_detail.isOwnShop == 1">{{$L('自营')}}</text>
                                </view>
                                <view class="info_bot">
                                    <image :src="imgUrl+'goods/renqizhi.png'"></image>
                                    <!-- 暂时屏蔽 -->
                                    <text v-if="false">人气：{{vender_detail.followNumber}}</text>
                                </view>
                            </view>
                        </view>
                    </view>
                    <!-- 店铺首页，全部分类，商品上新，优惠券 -->
                    <view class="select_nav" v-if="!fenlei && !no_content_decor" :style="'opacity:'+(1-(scrollTopH)/160)">
                        <template v-for="(item, idx) in navList">
                            <view :key="idx" v-if="!!!item.displayNone" class="nav_item" @tap="tabItemTap(idx)" :data-idx="idx">
                                <image :src="idx == currentTabIndex || (currentTabIndex == 0 && index == 0) && isSelect ? item.selImgUrl : item.imgUrl"></image>
                                <text>{{item.name}}</text>
                            </view>
                        </template>
                    </view>
                    <!-- 店铺未装修不显示店铺首页 -->
                    <view class="select_nav" v-if="!fenlei && no_content_decor" :style="'opacity:'+(1-(scrollTopH)/160)">
                        <template v-for="(item, idx) in navList1">
                            <view :key="idx" v-if="!!!item.displayNone" class="nav_item" @tap="tabItemTap(idx)" :data-idx="idx">
                                <image :src="idx == currentTabIndex || (currentTabIndex == 0 && index == 0) && isSelect ? item.selImgUrl : item.imgUrl"></image>
                                <text>{{item.name}}</text>
                            </view>
                        </template>
                    </view>
                </view>
                <view :class="homePage ? 'des_con' : 'des_con1'" v-if="!fenlei" :style="'overflow:' + ((no_content_decor || no_content_productList || no_content_newProductList || no_content_coupon) ? 'hidden' : 'auto')">
                    <!-- 店铺首页 -->
                    <view class="home_decoration" v-if="home_decoration && !no_content_decor&& is_load_home_dec">
                        <home-deco  ref="homeDecoComp" :deco_info="deco_data" :store_width='width' :store_height='height' :is_show_top='is_show_top'
                         :store_page_img='home_page_img' :is_from_found="false" :store_id='vid'></home-deco>
                        <!-- <view class="no_content" wx:if="{{no_content_decor}}">
                        <view class="img"></view>
                        <text>店铺暂未装修~</text>
                    </view> -->
                    </view>
                    <!-- 全部商品 -->
                    <view class="all_commodities" v-if="all_commodities">
                        <view :class="'all_commodities_nav ' + (searchShow ? 'nav1' : '')" v-if="all_commodities">
                            <view class="comprehensive" @tap="commoditiesNav" data-index="0">
                                <text :class="'pre_title ' + (commodNavIdx == 0 ? 'active' : '')">{{$L('综合')}}</text>
                            </view>
                            <view :class="'sales_volume ' + (commodNavIdx == 1 ? 'active' : '')" @tap="commoditiesNav" data-index="1"
                             data-isAscendingOrder="0">{{$L('销量')}}</view>
                            <view class="price" @tap="commoditiesNav" data-index="2">
                                <text :class="'pre_title ' + (commodNavIdx == 2 ? 'active' : '')">{{$L('价格')}}</text>
                                <view class="price_switch">
                                    <image class="xiala_up" :src="commodNavIdx == 2 && isAscendingOrder == 1 ? imgUrl+'common/icon/xiala_up1.png' : imgUrl+'common/icon/xiala_up.png'"></image>
                                    <image class="xiala_down" :src="commodNavIdx != 2 ? imgUrl+'common/icon/xiala_down.png' : commodNavIdx == 2 && isAscendingOrder == 1 ? imgUrl+'common/icon/xiala_down.png' : imgUrl+'common/icon/xiala_down1.png'"></image>
                                </view>
                            </view>
                            <view :class="'sales_volume ' + (commodNavIdx == 5 ? 'active' : '')" @tap="commoditiesNav" data-index="5" v-if="false">人气</view>
                            <view class="layout" @tap="layoutSwitch">
                                <image :src="grid_list ? imgUrl+'goods/fenlei1.png' : imgUrl+'goods/fenlei2.png'"></image>
                            </view>
                        </view>
                        <block v-if="productList && productList.length">
                            <!-- 商品列表 -->
                            <view>
                                <!-- 竖向列表 -->
                                
                                <view v-show="grid_list" class="goods_list">
                                    <!-- 竖向的商品瀑布流展示 -->
                                    <waterfall :add-time="0" v-model="productList" ref="uWaterfall">
                                        <template v-slot:left="{leftList}">
                                            <!-- 这里编写您的内容，item为您传递给v-model的数组元素 -->
                                            <thumbStoreV v-for="(item, index) in leftList" :key="index" :goodsItem="item" :showCart="false" />
                                        </template>
                                        <template v-slot:right="{rightList}">
                                            <thumbStoreV v-for="(item, index) in rightList" :key="index" :goodsItem="item" :showCart="false" />
                                        </template>
                                    </waterfall>
                                </view>
                                

                                <!-- 横向列表 -->
                                <view v-show="!grid_list">
                                    <thumbStoreH v-for="(item, index) in productList" :key="index" :goodsItem="item" :showCart="false"  />
                                </view>
                        
                            </view>
                            <view class="is_more">{{hasmore ? '数据加载中...' : '数据加载完毕~'}}</view>
                        </block>
                        <!-- 无商品 -->
                        <block v-if="no_content_productList">
                            <view class="no_content">
                                <view class="img"></view>
                                <text>{{$L('暂无任何商品')}}~</text>
                            </view>
                        </block>
                    </view>
                    <!-- 商品上新 -->
                    <view class="new_products" v-if="new_products">
                        <block v-if="new_productList && new_productList.length">
                            <!-- 商品列表 -->
                            <view class>
                                <view v-for="(item, index) in new_productList" :key="index" class="new_products_pre">
                                    <view class="new_products_top">
                                        <text class="line"></text>
                                        <view class="new_products_title">
                                            <image :src="imgUrl+'goods/shijian_title.png'"></image>
                                            <text>{{item.onLineTime}}{{$L('上新')}}</text>
                                        </view>
                                        <text class="line"></text>
                                    </view>
                                    <view class="all_commodities_list">
                                        <view v-for="(item1, index2) in item.goodsVOList" :key="index2" class="list_pre" @tap="goods_detail(item1.sku,item1.spu)">
                                            <view class="pre_img">
                                                <!-- <image :src="item1.mainImage" mode='aspectFit'></image> -->
                                                <!-- <coverImage :src="item1.mainImage" width="345" height="345"></coverImage> -->
                                                <view class="image" :style="'background-image:url('+item1.mainImage+')'"></view>
                                            </view>
                                            <view class="pre_des">
                                                <view class="des_name">{{item1.skuName}}</view>
                                                <view class="des_info">{{item1.goodsBrief}}</view>
                                                <!-- <view class="time_limited_discount">限时折扣</view> -->
                                                <!-- <view v-for="(item2, index) in item1.limited_activities" :key="index" class="discount">
                                                    <view class="time_limited_discount" :style="'background:linear-gradient(to right,' + item2.color[0] + ',' + item2.color[1] + ');'">{{item2.name}}</view>
                                                </view> -->
                                                <view class="des_desc">
                                                    <view class="commodity_price num-font"><text>￥</text><text>{{$getPartNumber(item1.goodsPrice,'int')}}</text><text>{{$getPartNumber(item1.goodsPrice,'decimal')}}</text></view>
                                                    <text class="salenum" v-if="item1.goodsPrice < 999999.99">{{item1.actualSales}}{{$L('人已付款')}}</text>
                                                </view>
                                            </view>
                                        </view>
                                    </view>
                                </view>
                            </view>
                            <view class="is_more" style="margin:10rpx 0 30rpx;">{{hasmore ? '数据加载中...' : '数据加载完毕~'}}</view>
                        </block>
                        <block v-if="no_content_newProductList">
                            <view class="no_content">
                                <view class="img"></view>
                                <text>{{$L('暂无商品上新')}}~</text>
                            </view>
                        </block>
                    </view>
                    <!-- 优惠券 -->
                    <view class="coupon" v-if="coupon">
                        <block v-if="!no_content_coupon && !disabledModule">
                            <!-- 优惠券列表 -->
                            <view class>
                                <view v-for="item in couponList" class="coupon_pre" :key="item.id">
                                    <view class="conpon_des" :style="'background-image:url(' + (imgUrl + 'goods/coupon_bg.png') + '); background-size:100%'">
                                        <view class="conpon_des_top">
                                            <!-- <view class="{{item.receivedNum == item.limitReceive ? 'coupon_des_left1' : item.have == 0 ? 'coupon_des_left' : 'coupon_des_left1'}}">{{item.redinfo_money}}<text class="yuan">元</text></view> -->
                                            <view class="coupon_des_left fontScaleIgnore" v-if="item.couponType == 1">{{item.publishValue}}<text class="yuan">元</text></view>
                                            <view class="coupon_des_left fontScaleIgnore" v-if="item.couponType == 2">{{item.publishValue}}<text class="yuan">折</text></view>
                                            <view class="coupon_des_left fontScaleIgnore" v-if="item.couponType == 3">{{item.randomMax}}<text class="yuan">元</text></view>
                                            <!-- <view v-else-if="item.have < item.red_rach_max" class="coupon_des_left">{{item.limitQuota}}<text class="yuan">元</text></view> -->
                                            <!-- <view v-else class="coupon_des_left1">{{item.limitQuota}}<text class="yuan">元</text></view> -->
                                            <view class="coupon_des_con">
                                                <!-- {{item.receivedNum != item.limitReceive && item.have == 0}} -->
                                                <view class="progress-box" style="display:flex" v-if="item.receivedNum != item.publishNum && item.have < item.red_rach_max">
                                                    <progress :percent="item.per" backgroundColor="#FFFFFF" activeColor="#FF0000" font-size="22rpx"
                                                     border-radius="5rpx" stroke-width="3" style="width:60%;height: 25%;border: 1rpx solid #FF0000; border-right:2rpx solid #FF0000;border-radius:5rpx"></progress>
                                                    <text class="progress_text">{{$L('')}}已抢{{item.per}}%</text>
                                                </view>
                                                <view class="full_reduction">{{item.couponName}}</view>
                                                <view class="validity fontScaleIgnore">{{$L('有效期')}}：{{item.publishStartTime}}-{{item.publishEndTime}}</view>
                                            </view>
                                            <!-- <view class="coupon_des_right {{item.receivedNum == item.limitReceive ? 'coupon_des_right1' : item.have == 0 ? '' : 'coupon_des_right1'}}" bindtap="receive" data-redid="{{item.id}}">
                                            <text>{{item.receivedNum == item.limitReceive ? '已抢完' : item.have < item.red_rach_max ? '立即领取' : '已领取'}}</text>
                                            <text>{{item.have == 0 && item.receivedNum != item.limitReceive ? '已领取' : item.receivedNum == item.limitReceive ? '已抢完' : item.have < item.red_rach_max ? '立即领取' : '' }}</text>
                                        </view> -->
                                            <view class="coupon_des_right1" v-if="item.isReceive == 3">
                                                <text>{{$L('已抢完')}}</text>
                                            </view>
                                            <view class="coupon_des_right" @tap="receive" :data-couponid="item.couponId" v-if="item.isReceive == 1">
                                                <text>{{$L('立即领取')}}</text>
                                            </view>
                                            <view class="coupon_des_right1" v-if="item.isReceive == 2">
                                                <text>{{$L('已领取')}}</text>
                                            </view>
                                        </view>
                                        <view class="conpon_des_bot">
                                            <view class="conpon_show" @tap="handleOpen">
                                                <view :class="'text ' + (conpon_show ? 'text2' : 'text1')"><text>{{$L('使用规则')}}</text>：{{item.useTypeValue}}</view>
                                            </view>
                                        </view>
                                    </view>
                                </view>
                            </view>
                            <view class="is_more" style="margin-top:20rpx;">{{hasmore ? '数据加载中...' : '数据加载完毕~'}}</view>
                        </block>
                        <block v-else>
                            <view class="no_content">
                                <view class="img"></view>
                                <text>{{$L('暂无优惠券')}}~</text>
                            </view>
                        </block>
                    </view>
                </view>
                <!-- 分类 -->
                <view class="fenlei" v-if="fenlei">
                    <view>
                        <view class="fenlei_lists" v-if="classifyList && classifyList.length > 0">
                            <view v-for="(item, index) in classifyList" :key="index" class="fenlei_pre">
                                <view class="fenlei_pre_top" :data-stc_id="item.innerLabelId" :data-stc_name="item.innerLabelName" @tap="handleProClas">
                                    <view class="fenlei_pre_title">{{item.innerLabelName}}</view>
                                    <image src="goods/right_bg.png"></image>
                                </view>
                                <view class="fenlei_list" v-if="item && item.children && item.children.length > 0">
                                    <text v-for="(item1, index2) in item.children" :key="index2" :data-stc_id="item1.innerLabelId" :data-stc_name="item1.innerLabelName"
                                     @tap="handleProClas">{{item1.innerLabelName}}</text>
                                </view>
                            </view>
                        </view>
                        <view class="fenlei_lists" v-if="no_content_fenlei">
                            <view class="no_fenlei">
                                <image :src="imgUrl + 'goods/no_product.png'"></image>
                                <text>{{$L('暂无商品分类')}}</text>
                            </view>
                        </view>
                    </view>
                    <!-- 推荐商品 -->
                    <view class="all_commodities_list all_commodities_list1" v-if="recommend_productList && recommend_productList.length">
                        <view class="commodities_list">
                            <view v-for="(item, index) in recommend_productList" :key="index" class="list_pre" :data-gid="item.gid" @tap="goods_detail">
                                <view class="pre_img">
                                    <image :src="item.goods_image_url" mode='aspectFit'></image>
                                </view>
                                <view class="pre_des">
                                    <view class="des_name">{{item.goods_name}}</view>
                                    <view class="des_info">{{item.goods_jingle}}</view>
                                    <!-- <view class="time_limited_discount">限时折扣</view> -->
                                    <view v-for="(item1, index2) in item.limited_activities" :key="index2" class="discount">
                                        <view class="time_limited_discount" :style="'background:linear-gradient(to right,' + item1.color[0] + ',' + item1.color[1] + ');'">{{item1.name}}</view>
                                    </view>
                                    <view class="des_desc">
                                        <view class="commodity_price num-font"><text>￥</text><text>{{filters.toSplit(item.goods_price)[0]}}</text>.<text>{{filters.toSplit(item.goods_price)[1]}}</text></view>
                                        <text class="salenum" v-if="item.goods_price < 999999.99">{{item.goods_salenum}}{{$L('人已付款')}}</text>
                                    </view>
                                </view>
                            </view>
                        </view>
                        <view class="is_more">{{hasmore ? '数据加载中...' : '数据加载完毕~'}}</view>
                    </view>
                </view>
            </view>
            <!-- 店铺不存在 -->
                <view class="empty_sort_page" v-if="!shop_open">
                    <view class="empty_img"></view>
                    <view class="empty_text">{{$L('店铺不存在或已关闭')}}~</view>
                </view>
        </view>
        <!-- 底部tab栏 -->
        <view class="tabbar" v-if="shop_open" :style="'bottom:'+bottomSateArea">
            <template v-for="(item, idx) in tabBarList" >
                <view v-if="!!!item.displayNone" :key="idx" class="tabbar_pre" @tap="hanbleTab" :data-idx="idx">
                    <image :src="idx == tabcurrentTabIndex || index == 0 && tabisSelect ? item.selImgUrl : item.imgUrl"></image>
                    <text :class="idx == tabcurrentTabIndex || index == 0 && tabisSelect ? 'pre_sel' : ''">{{item.name}}</text>
                </view>
            </template>
            <view class="tabbar_pre" @tap="gotoCustomerServiceModule" :data-idx="idx" v-if='!disabledModule'>
                <image :src="imgUrl+'goods/chat_service.png'"></image>
                <text class="">客服</text>
            </view>
        </view>

        <!-- 分享 -->
        <view class="select-wrap" catchtouchmove="touchmoveshare" v-if="shareWrap2">
            <view class="bizmateshareWrap">
                <share @close="shareWrap2=false" :shareOptions="shareOptions" :supportTypes="supportTypes"></share>
            </view>
            <view class="share-mode" v-if="false">
                <!-- #ifdef APP-PLUS -->
                <view class="ul">
                    <view @tap.stop="bbcShare(0,'WXSceneSession')" class="item">
                        <image :src="imgUrl+'goods/wx_share.png'" mode="widthFix"></image>
                        <text>{{$L('微信好友')}}</text>
                    </view>
                    <view @tap.stop="bbcShare(0,'WXSenceTimeline')" class="item">
                        <image :src="imgUrl+'goods/pyq_share.png'" mode="widthFix"></image>
                        <text>{{$L('微信朋友圈')}}</text>
                    </view>
                </view>
                <!-- #endif -->
                <!-- #ifdef H5 -->
                <view class="is_h5_share" v-if="!iswx">
                    <view class="share-img" @tap="prevImg">
                        <image :src="share_img_h5" mode="widthFix"></image>
                    </view>
                    <image :src="imgUrl + 'goods/fx_share_code.png'" mode="aspectFit" class="h5_share_tips"></image>
                </view>
                <view class="is_h5_public_share" v-if="iswx" @tap="closeShare">
                    <image :src="imgUrl+'goods/wx_share_tip.png'" mode="widthFix" class="wx_share_img"></image>
                </view>
                
                <view class="close" @tap="closeShare" v-if="!iswx">
                    <image :src="imgUrl+'common/icon/store_no_good_cancel.png'"></image>
                </view>
                <!-- #endif -->
                <!-- #ifndef H5 -->
                <view class="close" @tap="closeShare">
                    <image :src="imgUrl+'common/icon/store_no_good_cancel.png'"></image>
                </view>
                <!-- #endif -->
            </view>
        </view>

        <!-- 底部站位栏 -->
        <view class="iphone_view" :style="'height:'+bottomSateArea"></view>

    </view>
</template>

<script module="filters" lang="wxs" src="../../utils/filter.wxs"></script>

<script>
    import {pageUnfilled} from '@/utils/common.js'
    import waterfall from "@/components/waterfall/index";
    import thumbStoreH from "@/components/goods/thumb/thumb-store-h.vue";
    import thumbStoreV from "@/components/goods/thumb/thumb-store-v.vue";
    import HomeDeco from '@/components/decorate'
    import share from '@/components/share/index.vue'
    import shareHandler from '@/utils/shareHandler.js';
    import goodsHandler from '@/components/goods/handler';
    let imgUrl = getApp().globalData.imgUrl; //引用全局变量，图片域名
    // 加载js
    //引用全局变量，图片域名
    // 加载js
    import {
        getSceneParam,
        isWeiXinBrower
    } from "../../utils/common";
    import {
        mapState,mapMutations,mapGetters
    } from 'vuex';
    // 引入客服的功能
    import customerService from '@/common/lib/customer-service';
    export default {
        data() {
            return {
                // index: '',
                bid: '',
                vid: '',
                store_list: [],
                searchVal: '', //搜索框内的值
                searchList: [],
                show: false,
                searchShow: false,
                currentTabIndex: 0, //选项卡，默认综合排序
                isSelect: false,
                navList: [{
                    "name": "店铺首页",
                    "imgUrl": imgUrl + "goods/qiyeyunicon.png",
                    "selImgUrl": imgUrl + 'goods/qiyeyunicon_sel.png',
                }, {
                    "name": "全部商品",
                    "imgUrl": imgUrl + "goods/shangpin.png",
                    "selImgUrl": imgUrl + 'goods/shangpin_sel.png',
                }, {
                    "name": "商品上新",
                    "imgUrl": imgUrl + "goods/iconfont37newtag.png",
                    "selImgUrl": imgUrl + 'goods/shangxin_sel.png',
                    "displayNone": true,
                }, {
                    "name": "优惠券",
                    "imgUrl": imgUrl + 'goods/youhuiquan1.png',
                    "selImgUrl": imgUrl + 'goods/youhuiquan.png',
                }],
                navList1: [{
                    "name": "全部商品",
                    "imgUrl": imgUrl + "goods/shangpin.png",
                    "selImgUrl": imgUrl + 'goods/shangpin_sel.png'
                }, {
                    "name": "商品上新",
                    "imgUrl": imgUrl + "goods/iconfont37newtag.png",
                    "selImgUrl": imgUrl + 'goods/shangxin_sel.png',
                    "displayNone": true,
                }, {
                    "name": "优惠券",
                    "imgUrl": imgUrl + 'goods/youhuiquan1.png',
                    "selImgUrl": imgUrl + 'goods/youhuiquan.png'
                }],
                tabBarList: [{
                    "name": "首页",
                    "imgUrl": imgUrl + 'goods/bar1.png',
                    "selImgUrl": imgUrl + 'goods/bar1_sel.png'
                }, {
                    "name": "商品",
                    "imgUrl": imgUrl + 'goods/dianpu.png',
                    "selImgUrl": imgUrl + 'goods/dianpu_sel.png'
                }, {
                    "name": "分类",
                    "imgUrl": imgUrl + 'goods/fenlei.png',
                    "selImgUrl": imgUrl + 'goods/fenlei_sel.png',
                    "displayNone": true,
                }],
                is_favorites: '0', //是否被收藏
                vender_detail: {}, //店铺详情
                home_decoration: true, //店铺首页
                productList: [], //全部商品列表
                current: '1', //默认第一页
                all_commodities: false, //全部商品是否显示
                commodNavIdx: '0', //商品列表nav默认第一项
                isAscendingOrder: 1, //是否升序
                grid_list: true, //是否是两列grid_list布局
                new_products: false, //全部上新
                new_productList: [], //全部上新列表
                coupon: false, //优惠券
                couponList: [], //优惠券列表
                conpon_show: false, //优惠券规则展开
                tabcurrentTabIndex: 0, //默认选中首页
                tabisSelect: false, //tabbar的状态
                homePage: true, //首页显示
                fenlei: false, //分类
                classifyList: [], //店铺分类
                isReceive: false, //优惠券是否已领取
                decorationData: [], //店铺装修数据
                imgUrl: getApp().globalData.imgUrl, //图片地址
                no_more: false, //没有更多数据了
                share_img: '', //点击右上角的分享，分享店铺图片
                share_name: '', //点击右上角分享，分享店铺的名称
                recommend_product: {}, //推荐商品
                recommend_productList: [], //推荐商品列表
                no_recomment_goods: false, //店铺无推荐商品
                no_content_decor: false, //店铺装修无数据
                no_content_productList: false, //店铺无商品列表数据
                no_content_newProductList: false, //店铺无上新列表数据
                no_content_coupon: false, //店铺无优惠券数据
                no_content_fenlei: false, //店铺无分类数据
                store_banner: '', //店铺首页banner图
                hasmore: true, //有无更多
                tips_show: false, //三点分享更多按钮
                tips: [{
                    tips_img: 'icon_bnj',
                    tips_name: '首页',
                    tips_link: '/',
                    type: 'switchTab',
                    guestShow:true
                }, {
                    tips_img: 'icon_category',
                    tips_name: '分类',
                    tips_link: '/pages/category/category',
                    type: 'switchTab',
                    guestShow:true
                }, {
                    tips_img: "icon_share",
                    tips_name: '分享',
                    tips_link: '',
                    type: 'share',
                    guestShow:false
                }, {
                    tips_img: 'icon_cart',
                    tips_name: '购物车',
                    tips_link: '/pages/cart/cart',
                    type: 'switchTab',
                    guestShow:false
                }, {
                    tips_img: 'icon_personalcenter',
                    tips_name: '我的',
                    tips_link: '/pages/tabbar/personalcenter',
                    type: 'switchTab',
                    guestShow:true
                }],
                transparent_mask: false,
                key: "",
                index: -1,
                scrollTopH: 0,
                bottomSateArea: getApp().globalData.bottomSateArea, //iphone手机底部一条黑线的高度
                shareWrap2: false, // 展示分享弹层
                iswx: false,
                share_img_h5: '',
                pageSize: 10,
                client: '',
                deco_data: null, //首页装修数据
                home_page_img: [],
                width: '',
                height: '',
                is_show_top: false,
                shop_open:true,
                is_load_home_dec:false,
                idx:'',
                shareOptions:{},//分享所需的参数
                requestLock: false,
                supportTypes:[]//当前渠道下支持的H5 sharetype
            };
        },

        components: {
            HomeDeco,
            share,
            thumbStoreV,
            thumbStoreH,
            waterfall
        },
        props: {},
        async mounted() {
            if (this.$Route.query.scene) {
                let url = decodeURIComponent(this.$Route.query.scene);

                if (getSceneParam(url, 'vid')) {
                    this.$Route.query.vid = getSceneParam(url, 'vid');
                }
            }else{
                this.$Route.query.vid = this.$Route.query.vid;
            }
            let sc_name = this.$Route.query.sc_name;
            let vid = this.$Route.query.vid;
            this.searchVal = sc_name,
            this.vid = vid
            this.$bbcStatEvent({behaviorType:'spv',storeId:this.vid});
            // this.isCollection(); //是否已被收藏
            await this.getShopHome(); //获取店铺首页装修
            this.iswx = this.$isWeiXinBrower();
            if (this.$Route.query.good_list) {
                if (this.no_content_decor) {
                    this.tabItemTap(0)
                } else {
                    this.tabItemTap(1)
                }
            }
            this.venderDetail(); //店铺详情
            this.iswx = this.$isWeiXinBrower();
        },
        computed: {
            ...mapState(['userCenterData','hasLogin']),
            ...mapGetters(['disabledModule']),
        },
        onShow() {
            if (this.showState == 1) {
                this.getGoodsDetail(this.sku);
            }
            //页面再次打开时注册转发信息
            if(!!this.vender_detail.storeId){
                this.setThirdShare();
            }
        },
        // 加载更多
        onReachBottom(e) {
            let {
                all_commodities,
                new_products,
                coupon,
                fenlei,
                hasmore
            } = this;
            if (hasmore) {
                if (all_commodities) {
                    this.getProductList(); //全部商品列表
                } else if (new_products) {
                    this.getNewProductList(); //获取商品上新数据
                } else if (coupon) {
                    this.getCouponList(); //获取优惠券列表
                } else if (fenlei) {
                    this.getShopClassify(); //获取店铺分类

                    // this.getRecommendProductList();
                }
            }
        },

        /**
         * 用户点击右上角分享
         */
        onShareAppMessage: function(options) {
            return {
                title: this.vender_detail.storeName,
                path: this.vender_detail.shareLink,
                imageUrl: this.vender_detail.storeLogoUrl
            };
        },
        methods: {
            ...mapMutations(['saveChatBaseInfo']),
            go_back() {
                this.$Router.back(1)
            },
            gotoCustomerServiceModule(){
                this.$moduleGate(this.gotoCustomerService)
            },
             //跳转到客服系统
            async gotoCustomerService(){  
                if(!this.hasLogin){
                    // this.$api.msg('请登录')
                    return
                }
                let url = await customerService.run(1).catch(e=>{
                    console.log(e)
                });
                this.$openCustomerServicePage(url)
            },

            //三点更多分享
            moreTips() {
                let {
                    tips_show
                } = this;
                this.tips_show = !tips_show,
                    this.transparent_mask = true
            },

            //隐藏透明遮罩层
            hideMask() {
                this.transparent_mask = false,
                    this.tips_show = false
            },

            //三点更多分享
            moreTips() {
                let {
                    tips_show
                } = this;
                this.tips_show = !tips_show,
                    this.transparent_mask = true
            },

            //隐藏透明遮罩层
            hideMask() {
                this.transparent_mask = false,
                    this.tips_show = false
            },

            //三点分享链接
            handleLink(e) {
                let that = this;
                let link = e.currentTarget.dataset.link;
                let type = e.currentTarget.dataset.type;
                if (type != 'share') {
                    that.$Router.push(link)
                } else { //点击了分享
                    // #ifndef MP-WEIXIN
                    // 调用APP分享
                    sinosdk.sino.sharePanel({}).then((res)=>{
                        if(res.ret == "404"){
                            that.supportTypes = res?.responseData?.enableTypes;
                            that.shareWrap2 = true;
                        }
                    }).catch((err) => {
                        console.log(err);
                        that.shareWrap2 = true;
                    });

                    // this.$weiXinBrowerShare(1, {
                    //     title: this.vender_detail.storeName,
                    //     desc: '刚刚看到一个不错的店铺，快来看看~',
                    //     link: this.vender_detail.shareLink,
                    //     imgUrl: this.vender_detail.storeLogoUrl,
                    // });
                    // #endif
                }
                that.tips_show = false
            },
            /**
             * 处理分享所需数据
             */
            async setShareInfo(){
                let that = this;
                if(!!!this.vender_detail.storeId){ return } //等有数据了，才能去分享
                let location = window.location;
                let locationHref = location.href;
                let userParams = getApp().globalData.userParams;
                let callBackUrl = locationHref;
                let appInfo = {};
                try {
                    appInfo = await shareHandler.getAppConfig();
                } catch (error) {
                }
                let appId = appInfo.appId || '268435729';
                let appName = '比N家';
                that.shareOptions = {
                    title : this.vender_detail.storeName, // 分享标题          
                    desc : '刚刚看到一个不错的店铺，快来看看', // 分享描述           
                    link : callBackUrl, // 分享链接          
                    imgUrl : this.vender_detail.storeLogoUrl || require('../../static/shared/user/logo.png'), // 分享图标,图片绝对地址   
                    appId: appId+'',//小应用Id
                    appName: appInfo.appName || appName || '比N家',//小应用名字,无合法appId时使用appName
                    contentType : 'link', // 分享类型,music、video或link，不填默认为link
                }
            },
            /**
             * setThirdShare
             */
            setThirdShare(){
                // #ifdef H5
                let that = this;
                //设置第三方（微信、朋友圈等）分享信息
                let location = window.location;
                let locationHref = location.href;
                let appName = '商云';
                let userParams = getApp().globalData.userParams;
                let callBackUrl = locationHref;
                let shareInfo = {
                    title:this.vender_detail.storeName, // 分享标题 
                    desc:'刚刚看到一个不错的店铺，快来看看', // 分享描述   
                    link:callBackUrl, // 分享链接  
                    imgUrl: this.vender_detail.storeLogoUrl || require('../../static/shared/user/logo.png'), // 分享图标,图片绝对地址 
                }
                //设置二次分享
                shareHandler.setThirdShareInfo(shareInfo);
                // #endif
            },            
            //分享 type：分享类型 0 图文 2图片，scene 场景 WXSceneSession：分享朋友  WXSenceTimeline：分享朋友圈
            bbcShare: function(type, scene) {
                let shareData = {};
                if (type == 0) {
                    shareData.href = this.vender_detail.shareLink;
                    shareData.title = this.vender_detail.storeName;
                    shareData.summary = '刚刚看到一个不错的店铺，快来看看~';
                    shareData.imageUrl = this.vender_detail.storeLogoUrl;
                } else if (type == 2) {
                    shareData.imageUrl = this.storeLogoUrl;
                }
                this.$weiXinAppShare(type, scene, shareData);
                this.closeShare(); //关闭分享
            },


            closeShare() {
                this.shareWrap2 = false
            },

            downloadImg() {
                let {
                    shareImg
                } = this;
                wx.downloadFile({
                    url: shareImg,
                    success: res => {
                        if (res.statusCode == 200) {
                            wx.saveImageToPhotosAlbum({
                                filePath: res.tempFilePath,
                                success: result => {
                                    if (result.errMsg == 'saveImageToPhotosAlbum:ok') {
                                        wx.showToast({
                                            title: '已保存到本地',
                                        })
                                        this.closeShare();
                                    } else {
                                        wx.showToast({
                                            title: '保存失败',
                                            icon: 'none'
                                        })
                                    }
                                }
                            })
                        } else {
                            wx.showToast({
                                title: '下载失败',
                                icon: 'none'
                            })
                        }
                    }
                })
            },

            prevImg() {
                wx.previewImage({
                    urls: [this.shareImg],
                })
            },

            //获取滚动条的当前位置
            onPageScroll: function(e) {
                this.tips_show=false
                this.scrollTopH = e.scrollTop;
                if (e.scrollTop > 170) {
                    this.searchShow = true
                } else if (this.fenlei && e.scrollTop > 80) {
                    this.searchShow = true
                } else {
                    this.searchShow = false
                }
            },

            //点击去搜索
            goSearch() {
                this.$Router.push({path:'/standard/store/productSearch',query:{vid:this.vid}})
            },

            //清空搜索输入框内容
            cancel() {
                this.searchVal = '';
                this.searchShow = false;
                this.searchVal = '',
                    this.searchShow = false
                this.getProductList();
            },

            //去商品介绍页
            handleStoreIntroduction(e) {
                let vid = e.currentTarget.dataset.vid;
                this.$Router.push({path:'/standard/store/storeIntroduction',query:{vid}})
            },
            //获取店铺首页装修
            async getShopHome() {
                // #ifdef H5
                this.client = 'h5'
                // #endif

                // #ifdef APP-PLUS
                switch (uni.getSystemInfoSync().platform) {
                    case 'android':
                        this.client = 'android'
                        break;
                    case 'ios':
                        this.client = 'ios'
                        break;
                    default:
                        break;
                }
                // #endif

                // #ifdef MP
                this.client = 'weixinXcx'
                // #endif
                let that = this;
                let {
                    vid
                } = that;

                if (vid) {
                    let param = {};
                    param.data = {}
                    param.data.storeId = vid
                    param.data.os = this.client
                    param.url = 'v3/system/front/deco/storeIndex';
                
                    await this.$request(param).then(async res => {
                        this.is_load_home_dec = true
                        if (res.state == 200) {
                            if (res.data.data != '' && res.data.data) {
                        

                                this.deco_data = JSON.parse(res.data.data);
                                this.no_content_decor = false
                        
                            } else {
                                // this.tabItemTap(0)
                                this.no_content_decor = true
                                this.deco_data = null
                                this.all_commodities = true
                                this.getProductList()
                            }
                            if (res.data.showTip != null) {
                                this.home_page_img = JSON.parse(res.data.showTip)
                                const {
                                    windowWidth,
                                    windowHeight
                                } = uni.getSystemInfoSync();
                                this.width = this.home_page_img[0].width || windowWidth * 0.75 * 1.8;
                                this.height = this.home_page_img[0].height || windowHeight * 0.56 * 1.8;
                            }
                        } else if(res.state == 257){
                            this.shop_open=false
                        } else {
                            this.$api.msg(res.msg);
                        }
                    }).catch((e) => {
                        //异常处理
                    })
                }
            },

            // 获取全部商品列表
            getProductList() {
                if(this.requestLock){
                    return;
                }
                let that = this
                let commodNavIdx = that.commodNavIdx
                let isAscendingOrder = that.isAscendingOrder
                let param = {}
                if (that.searchVal) {
                    param.keyword = that.searchVal;
                }
                // isAscendingOrder
                param.pageIndex = that.current
                param.pageSize = this.pageSize
                if (commodNavIdx == 2) {
                    if (isAscendingOrder == 1) {
                        param.sort = 3
                    } else {
                        param.sort = 4
                    }
                } else {
                    param.sort = commodNavIdx
                }
                param.storeAndSupplierInfos = [{storeId: that.vid,}];
                uni.showLoading()
                this.requestLock = true;
                goodsHandler.search(param).then(res => {
                    this.requestLock = false;
                    if (res.state == 200) {
                        if (res.data.list.length == 0) {
                            that.no_content_productList = true
                        } else {
                            if (that.current == 1) {
                                that.productList = res.data.list
                            } else {
                                that.productList = that.productList.concat(res.data.list);
                            }
                            if(pageUnfilled(res.data.pagination, this.pageSize)){
                                this.current++;
                                this.getProductList();
                                return;
                            }
                            let hasmore = this.$hasMoreByPageCount(res.data.pagination); //是否还有数据
                            if (hasmore) {
                                that.current++;
                            }
                            that.hasmore = hasmore
                        }
                        uni.hideLoading()
                    }
                }).catch((e)=>{
                    this.requestLock = false;
                    console.error(e)
                }).finally(e=>{
                    uni.hideLoading()
                })
            },

            // 获取商品上新列表
            getNewProductList() {
                let that = this
                let param = {}
                param.pageSize = that.pageSize
                param.current = that.current
                param.storeId = that.vid
                if (this.searchVal) {
                    data.keyword = this.searchVal;
                }
                goodsHandler.getNewGoods(param).then(res => {
                    if (res.state == 200) {
                        if (res.data.list.length == 0) {
                            that.no_content_newProductList = true
                        } else {
                            if (that.current == 1) {
                                that.new_productList = res.data.list
                            } else {
                                that.new_productList = that.new_productList.concat(res.data.list);
                            }
                            let hasmore = this.$checkPaginationHasMore(res.data.pagination); //是否还有数据
                            if (hasmore) {
                                that.current++;
                            }
                            that.hasmore = hasmore
                        }
                    } else {
                        this.$api.msg(res.msg)
                    }
                })


            },

            //优惠券列表
            getCouponList() {
                let that = this
                let param = {
                    pageSize: that.pageSize,
                    current: that.current,
                    storeId: that.vid
                }
                goodsHandler.getStoreCouponList(param).then(res => {
                    if (res.state == 200) {
                        if (res.data.list.length == 0) {
                            that.no_content_coupon = true
                        } else {
                            if (that.current == 1) {
                                that.couponList = res.data.list
                            } else {
                                that.couponList = that.couponList.concat(res.data.list);
                            }
                            let hasmore = this.$checkPaginationHasMore(res.data.pagination); //是否还有数据
                            if (hasmore) {
                                that.current++;
                            }
                            that.hasmore = hasmore
                        }
                    } else {
                        this.$api.msg(res.msg)
                    }
                })
            },

            //领取优惠券
            receive(e) {
                let that = this;
                this.$moduleGate(()=>{
                    let param = {
                        couponId: e.currentTarget.dataset.couponid
                    }
                    goodsHandler.receiveCoupon(param).then(res => {
                        if (res.state == 200) {
                            uni.showToast({
                                title: '领取成功',
                                icon: 'none',
                                duration: 1500 //持续的时间

                            });
                            that.getCouponList();
                        } else {
                            this.$api.msg(res.msg)
                        }
                    })
                })
            },

            //优惠券规则展开
            handleOpen() {
                this.conpon_show = !this.conpon_show
            },

            //选项卡切换
            tabItemTap(idx) {
                //记录上次点击的对象的序号
                var oldidx = this.currentTabIndex; //记录当前点击的对象的序号

                var currentIdx = idx;
                this.hasmore = true

                if (oldidx == currentIdx) {
                    var isSelect = this.isSelect
                    this.currentTabIndex = currentIdx
                    this.isSelect = !isSelect
                } else {
                    this.currentTabIndex = currentIdx
                    this.isSelect = true

                    if (this.no_content_decor) {
                        //无装修数据时：不显示装修模块，从全部商品开始显示
                        if (currentIdx == 0) {
                            this.home_decoration = true
                            this.homePage = true
                            this.coupon = false
                            this.all_commodities = this.no_content_decor ? true : false
                            this.new_products = false
                            this.fenlei = false
                            this.currentTabIndex = '0'
                            this.current = '1'
                            this.getProductList(); //全部商品列表
                        }

                        if (currentIdx == 1) {
                            this.home_decoration = false
                            this.new_products = true
                            this.all_commodities = false
                            this.coupon = false
                            this.current = '1'
                            this.getNewProductList(); //获取商品上新数据
                        } else if (currentIdx == 2) {
                            this.home_decoration = false
                            this.coupon = true
                            this.all_commodities = false
                            this.new_products = false
                            this.current = '1'
                            this.getCouponList(); //获取优惠券列表
                        } else {
                            this.home_decoration = true
                            this.all_commodities = true
                            this.new_products = false
                            this.coupon = false
                            this.current = '1'
                        }
                    } else {
                        //有装修数据时，默认显示装修模块
                        if (currentIdx == 0) {
                            this.home_decoration = true
                            this.new_products = false
                            this.all_commodities = false
                            this.coupon = false
                            this.current = '1'
                        }

                        if (currentIdx == 1) {
                            this.home_decoration = false
                            this.all_commodities = true
                            this.new_products = false
                            this.coupon = false
                            this.current = '1'
                            this.getProductList(); //全部商品列表
                        } else if (currentIdx == 2) {
                            this.home_decoration = false
                            this.new_products = true
                            this.all_commodities = false
                            this.coupon = false
                            this.current = '1'
                            this.getNewProductList(); //获取商品上新数据
                        } else if (currentIdx == 3) {
                            this.home_decoration = false
                            this.coupon = true
                            this.all_commodities = false
                            this.new_products = false
                            this.current = '1'
                            this.getCouponList(); //获取优惠券列表
                        } else {
                            this.home_decoration = true
                            this.all_commodities = false
                            this.new_products = false
                            this.coupon = false
                            this.current = '1'
                        }
                    }
                }

                if(currentIdx==4){
                }


            },

            //底部tabbar的切换
            hanbleTab(e) {
                this.hideMask();
                this.current = 1
                //切换时回到页面的顶部
                if (uni.pageScrollTo) {
                    //判断这个方法是否可用
                    uni.pageScrollTo({
                        scrollTop: 0
                    });
                } else {
                    uni.showModal({
                        title: '提示',
                        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
                    });
                }

                this.hasmore = true
                //记录上次点击的对象的序号

                var oldidx = this.tabcurrentTabIndex; //记录当前点击的对象的序号

                var currentIdx = e.currentTarget.dataset.idx;

                if (oldidx == currentIdx) {
                    var tabisSelect = this.tabisSelect;
                    this.tabcurrentTabIndex = currentIdx
                    this.tabisSelect = !tabisSelect
                } else {
                    if (currentIdx != 3) {
                        this.tabcurrentTabIndex = currentIdx
                        this.tabisSelect = true
                    }

                    if (currentIdx == 0) {
                        this.home_decoration = true
                        this.homePage = true
                        this.coupon = false
                        this.all_commodities = this.no_content_decor ? true : false
                        this.new_products = false
                        this.fenlei = false
                        this.currentTabIndex = '0'
                        this.current = '1';
                        
                    } else if (currentIdx == 1) {
                        this.home_decoration = false
                        this.homePage = false
                        this.coupon = false
                        this.all_commodities = true
                        this.new_products = false
                        this.fenlei = false
                        this.current = '1'
                        this.getProductList(); //全部商品列表
                    } else if (currentIdx == 2) {
                        this.homePage = true
                        this.coupon = false
                        this.all_commodities = false
                        this.new_products = false
                        this.fenlei = true
                        this.getShopClassify(); //获取店铺分类
                    }else {
                        // this.getRecommendProductList(); //获取店铺推荐商品
                        this.homePage = false
                        this.coupon = false
                        this.all_commodities = false
                        this.new_products = false
                        this.fenlei = false
                    }
                }
            },

            //商品列表tab切换
            commoditiesNav(e) {
                this.hasmore = true //切换时回到页面的顶部
                if (uni.pageScrollTo) {
                    //判断这个方法是否可用
                    uni.pageScrollTo({
                        scrollTop: 0
                    });
                } else {
                    uni.showModal({
                        title: '提示',
                        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
                    });
                }

                let that = this,
                commodNavIdx = e.currentTarget.dataset.index;
                that.commodNavIdx = commodNavIdx
                that.current = 1

                if (commodNavIdx == 2) {
                    that.isAscendingOrder = that.isAscendingOrder == 1 ? 0 : 1
                }
                this.productList = []
                that.getProductList();
            },

            // 获取店铺分类
            getShopClassify() {
                let that = this,
                    vid = that.vid;
                let param = {}
                param.data = {}
                param.data.storeId = vid
                param.url = 'v3/seller/front/store/storeCategory'
                this.$request(param).then(res => {
                    if (res.state == 200) {
                        if (res.data.length == 0) {
                            this.no_content_fenlei = true
                        } else {
                            //如果是初次加载，直接赋值，否则数据追加
                            if (that.current == '1') {
                                let classifyList = res.data;

                                this.classifyList = classifyList
                            } else {
                                let classifyList = res.data;
                                this.classifyList = that.classifyList.concat(classifyList)
                            }
                        }
                    } else {
                        this.$api.msg(res.msg);
                    }
                }).catch((e) => {
                    //异常处理
                })
            },

            //去商品分类列表
            handleProClas(e) {
                let stc_id = e.currentTarget.dataset.stc_id; // let stc_name = e.currentTarget.dataset.stc_name;
                this.$Router.push({path:'/standard/store/productSearch',query:{storeInnerLabelId:stc_id,vid:this.vid}})
            },

            //布局切换
            layoutSwitch() {
                this.grid_list = !this.grid_list
            },

            // 商品详情
            goods_detail(sku, spu) {
                this.$Router.push({path:'/standard/product/detail',query:{sku,spu}})
            },

            // 商铺首页详情
            venderDetail(e) {
                let that = this;
                let {
                    vid
                } = that;

                if (vid) {
                    let param = {};
                    param.data = {}
                    param.data.storeId = vid
                    param.url = 'v3/seller/front/store/detail';
                    this.$request(param).then(res => {
                        if (res.state == 200) {
                            let vender_detail = res.data;
                            this.vender_detail = vender_detail
                            this.share_img = vender_detail.storeLogoUrl
                            this.share_name = vender_detail.storeName
                            this.store_banner = vender_detail.storeBackdropUrl
                            this.share_img_h5 = 'data:image/png;base64,' + vender_detail.storeQRCode
                            this.is_favorites = vender_detail.isFollow

                            // this.$weiXinBrowerShare(1, {
                            //     title: this.vender_detail.storeName,
                            //     desc: '刚刚看到一个不错的店铺，快来看看~',
                            //     link: this.vender_detail.shareLink,
                            //     imgUrl: this.vender_detail.storeLogoUrl,
                            // });
                            this.setShareInfo();
                            this.setThirdShare();
                        } else {
                            this.$api.msg(res.msg);
                        }
                    }).catch((e) => {
                        //异常处理
                    })
                }
            },

            // 收藏-取消收藏
            collect(e) {
                let that = this;
                let {
                    vid,
                    is_favorites
                } = that;
                let param = {};
                param.data = {}
                param.data.storeIds = vid
                param.data.isCollect = is_favorites == 'false' ? 'true' : 'false'
                param.url = 'v3/member/front/followStore/edit';
                param.method = 'POST'
                this.$request(param).then(res => {
                    if (res.state == 200) {
                        this.$api.msg(res.msg);
                        this.is_favorites = this.is_favorites == 'false' ? 'true' : 'false';
                        this.vender_detail.followNumber = res.data.followNumber;
                        if(this.is_favorites){
                            this.$bbcStatEvent({behaviorType:'fol',storeId:vid}) //统计埋点
                        }
                    } else {
                        this.$api.msg(res.msg);
                    }
                }).catch((e) => {
                    //异常处理
                })
            },

            //获取搜索框内的值
            searchInput(e) {
                this.searchVal = e.detail.value
                this.getProductList();
            },

            //搜索
            search() {
                this.getProductList();
            },

            getmore() {
                let that = this;

                if (!that.flag && that.search_hasmore) {
                    that.search();
                }
            },

            back() {
                this.searchList = []
                this.show = false
                this.searchPn = 1;
                this.search_hasmore = true;
            }

        }
    };
</script>
<style>

    page {
        height: 100%;
        position: relative;
        margin: 0 auto;
    }

    .shop_homepage {
        width: 750rpx;
        background: #F5F5F5;
        height: 100%;
        position: absolute;
    }

    /* 透明遮罩层 */
    .transparent_mask {
        width: 100%;
        height: 100%;
        position: fixed;
        background-color: #FFFFFF;
        top: 0;
        left: 0;
        opacity: 0;
        z-index: 10;
    }

    .content {
        width: 100%;
        /* height: 754rpx; */
        /* background: black; */
        background-size: 100%;
    }

    /* 搜索框 */
    .search {
        width: 750rpx;
        height: 88rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 35rpx;
        box-sizing: border-box;
        position: fixed;
        /* #ifndef APP-PLUS */
        top: var(--titleBarFillHeight, 0px);
        /* #endif */
        /* #ifdef APP-PLUS */
        top: var(--status-bar-height);
        /* #endif */
        z-index: 10;
    }

    .search_input {
        width: 78%;
        height: 65rpx;
        display: flex;
        align-items: center;
        padding-left: 20rpx;
        background: rgba(248, 248, 248, 1);
        border-radius: 33px;
    }
    .search_input uni-input .uni-input-placeholder{
        overflow: visible;
    }

    .search_input1 {
        width: 78%;
        height: 65rpx;
        background: rgba(255, 255, 255, 1);
        border: 2rpx solid rgba(255, 12, 12, 1);
        border-radius: 33rpx;
    }

    .search_input image {
        width: 30rpx;
        height: 30rpx;
        margin-right: 20rpx;
    }

    .search_input input {
        font-size: 28rpx !important;
    }

    .search_input .cancel {
        width: 47rpx;
        height: 47rpx;
    }

    .search input {
        width: 500rpx;
        font-size: 24rpx;
        
        font-weight: 400;
        color: rgba(148, 148, 148, 1);
        line-height: 32rpx;
    }

    /* 三点更多分享 */
    .more_tips {
        position: relative;
    }

    .more {
        width: 50rpx;
        height: 50rpx;
    }

    .triangle-up {
        position: absolute;
        right: 15rpx;
        width: 0;
        height: 0;
        border-left: 15rpx solid transparent;
        border-right: 15rpx solid transparent;
        border-bottom: 20rpx solid #fcfcfc;
        /* transform: rotate(120deg); */
        transform: rotate(0deg);
        box-shadow: -2rpx 2rpx -1rpx 0rpx rgba(102, 102, 102, 0.1);
        z-index: 21;
    }

    .tips {
        position: absolute;
        z-index: 20;
        top: 77rpx;
        right: -15rpx;
        min-width: 226rpx;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 0px 10rpx 0px rgba(102, 102, 102, 0.2);
        opacity: 0.94;
        border-radius: 15rpx;
        display: flex;
        flex-direction: column;
    }

    .tips_pre {
        min-width: 100%;
        height: 88rpx;
        display: flex;
        align-items: center;
        border-bottom: #e6e6e6;
        padding:0 20rpx;
        box-sizing: border-box;
        white-space: nowrap;
        
    }

    button::after {
        border: none;
    }

    button[plain] {
        border: none;
    }

    .tips_pre .iconfont {
        font-size: 44rpx;
        color: #333;
        margin-right: 8rpx;
    }

    .tips_pre text {
        font-size: 26rpx;
        
        font-weight: 500;
        color: #333;
        line-height: 32rpx;
    }

    /* 搜索框 */
    .search1 {
        width: 750rpx;
        height: 88rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 35rpx;
        box-sizing: border-box;
        position: fixed;
        /* #ifdef APP-PLUS */
        top: var(--status-bar-height);
        /* #endif */
        /* #ifndef APP-PLUS */
        top: var(--titleBarFillHeight, 0px);
        /* #endif */
        z-index: 10;
        background: #FFFFFF;
    }

    .search1 .search_input {
        width: 77%;
        height: 65rpx;
        border: 2rpx solid rgba(225, 37, 27, 1);
        border-radius: 33rpx;
        display: flex;
        align-items: center;
        padding-left: 20rpx;
        background: #FFFFFF;
    }

    .search1 .search_input image {
        width: 30rpx;
        height: 30rpx;
        margin-right: 20rpx;
    }

    .search1 .search_input .cancel {
        width: 47rpx;
        height: 47rpx;
    }

    .search1 input {
        width: 500rpx;
        font-size: 24rpx;
        
        font-weight: 400;
        color: rgba(148, 148, 148, 1);
        line-height: 32rpx;
    }

    .search1 .search_text {
        font-size: 30rpx;
        
        font-weight: 500;
        color: rgba(45, 45, 45, 1);
        line-height: 32rpx;
    }

    /* 店铺详情 */
    .shop_des {
        width: 100%;
        color: rgba(255, 255, 255, 1);
        /* #ifndef APP-PLUS */
        padding-top: 88rpx;
        /* #endif */
        /* #ifdef APP-PLUS */
        padding-top: calc(var(--status-bar-height) + 88rpx);
        /* #endif */
        box-sizing: border-box;
        background-size: 100%;
    }

    .des_top {
        width: 100%;
        /* height: 449rpx; */
        height: 290rpx;
    }

    .shop_info {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 31rpx 20rpx 39rpx;
        box-sizing: border-box;
    }

    .info_left {
        width: 100%;
        display: flex;
        align-items: center;
    }

    .info_left .avat {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        margin-right: 16rpx;
    }

    .info_des {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: space-between;
    }

    .info_top {
        display: flex;
        align-items: center;
    }

    .info_top text:nth-of-type(1) {
        font-size: 30rpx;
        
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
        line-height: 32rpx;
    }

    .info_top image {
        width: 40rpx;
        height: 40rpx;
        margin-right: 14rpx;

    }

    .info_top text:nth-of-type(2) {
        min-width: 60rpx;
        min-height: 30rpx;
        padding: 4.4rpx 6rpx;
        background: rgba(252, 28, 28, 1);
        border-radius: 15rpx;
        font-size: 24rpx;
        
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 30rpx;
        text-align: center;
    }

    .info_bot {
        display: flex;
        align-items: center;
        margin-top: 13rpx;
    }

    .info_bot image {
        width: 40rpx;
        height: 40rpx;
        margin-right: 8rpx;
    }

    .info_bot text {
        font-size: 24rpx;
        
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 32rpx;
    }

    .info_right {
        width: 110rpx;
        height: 50rpx;
        background: linear-gradient(-50deg, rgba(252, 28, 28, 1) 0%, rgba(255, 104, 3, 1) 100%);
        box-shadow: 0rpx 3rpx 8rpx 0rpx rgba(252, 28, 28, 0.2);
        border-radius: 25rpx;
        font-size: 26rpx;
        
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .info_right1 {
        width: 110rpx;
        height: 50rpx;
        border: 4rpx solid rgba(255, 255, 255, 1);
        box-shadow: 0rpx 3rpx 8rpx 0rpx rgba(252, 28, 28, 0.2);
        border-radius: 25rpx;
        font-size: 20rpx;
        
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 32rpx;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .select_nav {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .nav_item {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .nav_item image {
        width: 64rpx;
        height: 64rpx;
        margin-bottom: 10rpx;
    }

    .nav_item text {
        font-size: 30rpx;
        
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 32rpx;
    }

    .des_con {
        /* margin-top: -155rpx; */
        width: 100%;
        /* height: calc(100vh - 449rpx); */
        border-radius: 15rpx;
        position: absolute;
        z-index: 5;
        background: #F5F5F5;
    }

    .des_con1 {
        margin-top: 0;
        width: 100%;
        /* height: calc(100vh - 88rpx); */
        background: rgba(255, 255, 255, 1);
        border-radius: 15rpx;
        position: absolute;
        z-index: 5;
    }

    .all_commodities {
        width: 100%;
        box-sizing: border-box;
        padding-bottom: 98rpx;
        box-sizing: border-box;
        border-radius: 15rpx 15rpx 0 0;
        background: #F5F5F5;
    }

    .all_commodities_nav {
        width: 750rpx;
        height: 90rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 40rpx;
        box-sizing: border-box;
        background: #FFFFFF;
        border-radius: 15rpx 15rpx 0 0;
    }

    .nav1 {
        position: fixed;
        /* #ifdef APP-PLUS */
        top: calc(var(--status-bar-height) + 88rpx);
        /* #endif */
        /* #ifndef APP-PLUS */
        top: calc(var(--titleBarFillHeight, 0px) + 88rpx);
        /* #endif */
        z-index: 5;
    }

    .comprehensive {
        display: flex;
        align-items: center;
    }

    .comprehensive .pre_title {
        font-size: 28rpx;
        
        color: rgba(45, 45, 45, 1);
        line-height: 32rpx;
    }

    .all_commodities_nav .active {
        font-size: 30rpx;
        
        font-weight: bold;
        color: rgba(243, 30, 30, 1);
        line-height: 32rpx;
    }

    .comprehensive image {
        width: 14rpx;
        height: 9rpx;
        margin-left: 10rpx;
    }

    .sales_volume {
        font-size: 28rpx;
        
        color: rgba(45, 45, 45, 1);
        line-height: 32rpx;
        display: flex;
        align-items: center;
    }

    .price {
        display: flex;
    }

    .price .pre_title {
        font-size: 28rpx;
        
        color: rgba(45, 45, 45, 1);
        line-height: 32rpx;
    }

    .price .active {
        font-size: 30rpx;
        
        font-weight: bold;
        color: rgba(243, 30, 30, 1);
        line-height: 32rpx;
    }

    .price_switch {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-left: 10rpx;
    }

    .price_switch image {
        width: 14rpx;
        height: 9rpx;
    }

    .price_switch image:nth-child(1) {
        margin-bottom: 5rpx;
    }

    .sales_volume {
        font-size: 28rpx;
        
        color: rgba(45, 45, 45, 1);
        line-height: 32rpx;
    }

    .layout {
        box-sizing: border-box;
        position: relative;
        padding: 0 26rpx 0 0;
        box-sizing: border-box;
    }

    .layout::before {
        content: "";
        width: 1rpx;
        height: 40rpx;
        position: absolute;
        top: 5rpx;
        left: -26rpx;
        background: rgba(187, 187, 187, 1);
    }

    .layout image {
        width: 50rpx;
        height: 50rpx;
    }

    /* 全部商品列表 */
    /* list布局 */
    .list {
        width: 100%;
        background: #F5F5F5;
        padding: 20rpx 20rpx 102rpx;
        box-sizing: border-box;
    }

    .list .list_pre {
        width: 100%;
        background: rgba(255, 255, 255, 1);
        border-radius: 15rpx;
        margin-right: 20rpx;
        margin-bottom: 20rpx;
        display: flex;
    }

    .list .pre_img {
        width: 294rpx;
        height: 294rpx;
        border-radius: 15rpx 0 0 15rpx;
    }

    .list .pre_img .image {
        background-position: center center;
        background-repeat: no-repeat;
        background-size: cover;
        width: 294rpx;
        height: 294rpx;
        border-radius: 15rpx 0 0 15rpx;
    }

    .list .pre_des {
        width: 394rpx;
    }

    .list .pre_des .time_limited_discount {
        /* width:106rpx; */
        padding: 0 11rpx;
        box-sizing: border-box;
        height: 30rpx;
        /* background:linear-gradient(45deg,rgba(255,108,0,1) 0%,rgba(255,192,83,1) 100%); */
        border-radius: 15rpx;
        font-size: 22rpx;
        
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 18rpx;
    }

    .list .list_pre .des_desc {
        margin-top: 43rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .list .list_pre .des_info {
        font-size: 24rpx;
        
        font-weight: 500;
        color: rgba(102, 102, 102, 1);
        width: 310rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        height: 35rpx;
        margin-top: 20rpx;
    }

    /* grid网格布局 */
    .all_commodities_list {
        background: #F5F5F5;
        padding: 20rpx 20rpx 0;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        box-sizing: border-box;
    }

    .product1 {
        margin-top: 90rpx;
        padding-bottom: 4rpx !important;
    }

    .all_commodities_list .list_pre {
        width: 345rpx;
        /* height: 590rpx; */
        background: rgba(255, 255, 255, 1);
        border-radius: 15rpx;
        margin-right: 20rpx;
        margin-bottom: 20rpx;
        padding-bottom: 20rpx;
    }

    .all_commodities_list .list_pre:nth-of-type(2n) {
        margin-right: 0;
    }

    .all_commodities_list .list_pre .pre_img {
        width: 345rpx;
        height: 345rpx;
        border-radius: 15rpx 15rpx 0 0;
        overflow: hidden;
    }

    .all_commodities_list .list_pre .pre_img .image {
        background-position: center center;
        background-size: cover;
        background-repeat: no-repeat;
        width: 345rpx;
        height: 345rpx;
    }

    .all_commodities_list .pre_des {
        padding: 20rpx;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .list .list_pre .pre_des {
        padding: 20rpx 0 20rpx 20rpx;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .all_commodities_list .list_pre .des_name {
        width: 310rpx;
        font-size: 28rpx;
        
        font-weight: 500;
        color: rgba(45, 45, 45, 1);
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        font-weight: bold;
    }

    .list .list_pre .des_name {
        width: 374rpx;
        font-size: 28rpx;
        
        font-weight: 500;
        color: rgba(45, 45, 45, 1);
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        font-weight: bold;
    }

    .all_commodities_list .list_pre .des_info {
        font-size: 24rpx;
        
        font-weight: 500;
        color: rgba(102, 102, 102, 1);
        width: 310rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        height: 39rpx;
        margin-top: 9rpx;
    }

    .list .list_pre .des_info {
        font-size: 24rpx;
        
        font-weight: 500;
        color: rgba(102, 102, 102, 1);
        width: 374rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        height: 39rpx;
        margin-top: 9rpx;
    }

    .discount {
        display: flex;
    }

    .time_limited {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
    }

    .list_pre .time_limited_discount {
        /* width:106rpx; */
        padding: 0 11rpx;
        box-sizing: border-box;
        height: 30rpx;
        /* background:linear-gradient(45deg,rgba(255,108,0,1) 0%,rgba(255,192,83,1) 100%); */
        border-radius: 15rpx;
        font-size: 22rpx;
        
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 39rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 15rpx;
    }

    .all_commodities_list .list_pre .des_desc {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 31rpx;
    }

    .list_pre .des_desc .commodity_price {
        font-size: 34rpx;
        font-weight: normal;
        color: rgba(252, 28, 28, 1);
    }

    .commodity_price {
        font-size: 34rpx;
        color: rgba(252, 28, 28, 1);
        line-height: 32rpx;
        font-weight: normal;
    }

    .commodity_price text:nth-child(1) {
        font-size: 24rpx;
    }

    .list_pre .des_desc .salenum {
        font-size: 22rpx;
        
        font-weight: 500;
        color: rgba(153, 153, 153, 1);
    }
    .des_desc{
        height:60rpx;
    }
    /* 商品上新 */
    .new_products {
        width: 100%;
        background: #F5F5F5;
        border-radius: 15rpx 15rpx 0 0;
        padding-bottom: 100rpx;
        box-sizing: border-box;
    }

    .new_products_pre {
        width: 100%;
        padding-top: 20rpx;
    }

    .new_products_pre:nth-of-type(1) {
        width: 100%;
        padding-top: 40rpx;
    }

    .new_products_top {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .new_products_top .line {
        width: 120rpx;
        height: 1rpx;
        background: rgba(187, 187, 187, 1);
    }

    .new_products_title {
        display: flex;
        align-items: center;
        margin: 0 10rpx;
    }

    .new_products_title image {
        width: 28rpx;
        height: 27rpx;
        margin-right: 9rpx;
    }

    .new_products_title text {
        font-size: 28rpx;
        
        font-weight: bold;
        color: rgba(45, 45, 45, 1);
        line-height: 32rpx;
    }

    /* 优惠券 */
    .coupon {
        width: 100%;
        padding: 20rpx 20rpx 100rpx;
        box-sizing: border-box;
        background: #F5F5F5;
        border-radius: 15rpx 15rpx 0 0;
    }

    .coupon_pre {
        width: 100%;
        width: 711rpx;
        margin-bottom: 20rpx;
        min-height: 257rpx;
    }

    .conpon_des {
        width: 100%;
        width: 711rpx;
        height: 257rpx;
    }

    .conpon_des_top {
        width: 711rpx;
        height: 195rpx;
        display: flex;
        align-items: center;
        margin: 0 10rpx;
    }

    .coupon_des_left,.coupon_des_left.fontScaleIgnore {
        width: 161rpx;
        height: 195rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 48rpx;
        font-family: Adobe Heiti Std;
        font-weight: normal;
        color: rgba(253, 51, 18, 1);
        line-height: 45rpx;
        margin-left: 22rpx;
    }

    .coupon_des_left1 {
        width: 161rpx;
        height: 195rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 48rpx;
        font-family: Adobe Heiti Std;
        font-weight: normal;
        color: rgba(51, 51, 51, 1);
        line-height: 45rpx;
        margin-left: 18rpx;
    }

    .yuan {
        font-size: 24rpx;
        margin-left: 4rpx;
    }

    .coupon_des_con {
        width: 330rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 27rpx;
    }

    .progress-box {
        align-items: center;
        /* height: 32rpx; */
    }

    .progress-box .progress_text {
        font-size: 22rpx;
        
        font-weight: 500;
        font-style: italic;
        color: rgba(253, 51, 18, 1);
        line-height: 32rpx;
        margin-left: 20rpx;
    }

    .full_reduction {
        font-size: 28rpx;
        
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        line-height: 45rpx;
    }

    .validity,.validity.fontScaleIgnore {
        font-size: 22rpx;
        
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
        line-height: 45rpx;
    }

    .coupon_des_right {
        display: flex;
        align-items: flex-start;

    }

    .coupon_des_right text {
        min-width: 140rpx;
        height: 50rpx;
        border-radius: 25px;
        background: rgba(253, 51, 18, 1);
        font-size: 26rpx;
        
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 45rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 10rpx;
    }

    .coupon_des_right1 text {
        width: 140rpx;
        height: 50rpx;
        background: rgba(153, 153, 153, 1);
        border-radius: 25rpx;
        font-size: 30rpx;
        
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 45rpx;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .conpon_des_bot {
        width: 100%;
    }

    .conpon_show {
        display: flex;
        justify-content: space-between;
        padding: 20rpx;
        padding-left: 0;
        box-sizing: border-box;
    }

    .conpon_show .text {
        font-size: 22rpx;
        
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        line-height: 30rpx;
        padding-left: 22rpx;
        width: 615rpx;
        height: auto;
        box-sizing: border-box;
        display: -webkit-box;
        word-break: break-all;
        -webkit-box-orient: vertical;
        /* 要显示多少行就改变line-clamp的数据,此处折叠起来显示一行*/
        -webkit-line-clamp: 1;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .conpon_show .text2 {
        display: -webkit-box;
    }

    .conpon_show .text1 {
        display: block;
    }

    .conpon_show image {
        width: 16rpx;
        height: 9rpx;
    }

    .conpon_rules {
        width: 100%;
        background: #FFFFFF;
        display: flex;
        flex-direction: column;
        padding-left: 22rpx;
        box-sizing: border-box;
    }

    .conpon_rules text {
        font-size: 20rpx;
        
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        line-height: 30rpx;
    }

    /* 分类 */
    .fenlei {
        width: 100%;
        /* height: 100%; */
        border-radius: 15rpx;
        position: absolute;
        z-index: 5;
    }

    .fenlei_lists {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        padding: 20rpx 0 30rpx 0;
        box-sizing: border-box;
        margin-top: -150rpx;
        background: #F5F5F5;
        padding-bottom: 100rpx;
    }

    .fenlei_pre {
        width: 710rpx;
        background: rgba(255, 255, 255, 1);
        border-radius: 15rpx;
        padding: 17rpx 20rpx 0;
        box-sizing: border-box;
        margin-bottom: 20rpx;
    }

    .fenlei_pre_top {
        width: 100%;
        /* height: 71rpx; */
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 0 0 20rpx;
        box-sizing: border-box;
        position: relative;
        margin-bottom: 17rpx;
    }

    .fenlei_pre_title {
        font-size: 34rpx;
        
        font-weight: bold;
        color: rgba(45, 45, 45, 1);
        line-height: 32rpx;
        box-sizing: border-box;
    }

    .fenlei_pre_title::before {
        position: absolute;
        top: 10rpx;
        left: 0rpx;
        bottom: 0;
        content: '';
        width: 4rpx;
        height: 30rpx;
        background: rgba(253, 52, 20, 1);
        border-radius: 2rpx;
    }

    .fenlei_pre_top image {
        width: 50rpx;
        height: 50rpx;
        margin-right: -15rpx;
    }

    .fenlei_list {
        display: flex;
        background: #FFFFFF;
        width: 100%;
        margin-top: 21rpx;
        flex-wrap: wrap;
    }

    .fenlei_list text {
        font-size: 26rpx;
        
        font-weight: 500;
        color: rgba(45, 45, 45, 1);
        width: 325rpx;
        height: 60rpx;
        line-height: 60rpx;
        background: rgba(242, 242, 242, 1);
        border-radius: 6rpx;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
        padding: 0 17rpx;
        box-sizing: border-box;
        margin-bottom: 20rpx;
        margin-right: 20rpx;
        text-align: center;
    }

    .fenlei_list text:nth-of-type(2n) {
        margin-right: 0;
    }

    .no_fenlei {
        box-sizing: border-box;
        margin-top: 200rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 126rpx;
    }

    .no_fenlei image {
        width: 238rpx;
        height: 171rpx;
    }

    .no_fenlei text {
        font-size: 24rpx;
        
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        line-height: 24rpx;
        margin-top: 20rpx;
    }

    /* 推荐商品 */
    .all_commodities_list1 {
        background: #F5F5F5;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        padding: 0 0 100rpx;
        box-sizing: border-box;
    }

    .commodities_list {
        background: #F5F5F5;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        padding: 0 20rpx 0 20rpx;
        box-sizing: border-box;
    }

    .no_more {
        width: 100%;
        display: flex;
        justify-content: center;
    }

    /* tabbar底栏 */
    .tabbar {
        position: fixed;
        bottom: 0;
        z-index: 10;
        width: 750rpx;
        display: flex;
        align-items: center;
        justify-content: space-around;
        box-sizing: border-box;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(86, 86, 86, 0.08);
        padding-bottom: var(--safe-area-inset-bottom); /* 兼容 iOS >= 11.2 */
    }

    .iphone_view {
        position: fixed;
        bottom: 0;
        z-index: 10;
        width: 100%;
        box-sizing: border-box;
        background: rgba(255, 255, 255, 1);
    }

    .tabbar_pre {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 12rpx;
    }

    .tabbar_pre image {
        width: 50rpx;
        height: 50rpx;
    }

    .tabbar_pre text {
        font-size: 22rpx;
        
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        line-height: 32rpx;
    }

    .tabbar_pre .pre_sel {
        font-size: 22rpx;
        
        font-weight: bold;
        color: rgba(252, 39, 25, 1);
        line-height: 32rpx;
    }

    /* 暂无数据 */
    .no_data {
        font-size: 24rpx;
        color: black;
        text-align: center;
    }

    /* 店铺首页装修 */
    .home_decoration {
        padding-bottom: 100rpx;
        box-sizing: border-box;
        border-radius: 15rpx 15rpx 0 0;
    }


    /* 无数据 */
    .no_content {
        margin: 250rpx auto 0;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .no_content .img {
        width: 256rpx;
        height: 256rpx;
        background: var(--conponEmptyImg);
        background-size: 100% 100%;
    }

    .no_content text {
        font-size: 28rpx;
        color: #999999;
    }

    .no_coupon {
        width: 212rpx;
        height: 159rpx;
    }

    /* 加载更多，没有更多 */
    .is_more {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22rpx;
        color: #999999;
        line-height: 22rpx;
        margin: 10rpx 0 30rpx;
        background: #F5F5F5;
    }

    .fixed_top_status_bar {
        position: fixed;
        /* #ifdef APP-PLUS */
        height: var(--status-bar-height);
        /* #endif */
        /* #ifndef APP-PLUS */
        height: var(--titleBarFillHeight, 0px);
        /* #endif */
        top: 0;
        left: 0;
        right: 0;
        z-index: 99;
        background: #fff;
    }

    .search .top_w_b {
        height: 50rpx !important;
        width: 50rpx !important;


    }

    .top_w_b {
        height: 34rpx;
        width: 34rpx;
        margin: 0 0 0 20rpx;
        display: block;
    }

    /* #ifdef H5  */
    .search {
        padding-left: 0;
    }

    .search1 {
        padding-left: 0;
    }

    /* #endif */
    /* #ifdef APP-PLUS  */
    .top_w_b {
        margin-left: 0;
    }

    /* #endif */
    .select-wrap {
        position: fixed;
        top: 0;
        left: 0;
        width: 750rpx;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.45);
        z-index: 9999;
        right: 0;
        margin: 0 auto;
    }

    .select-wrap .share-mode {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .bizmateshareWrap{
        position: absolute;
        left: 0;
        right:0;
        bottom: 0;
    }
    .select-wrap .share-mode .ul {
        display: flex;
        width: 100%;
        justify-content: space-evenly;
        position: fixed;
        bottom: 200rpx;
        z-index: 9999;
    }

    .share-mode .item {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        cursor: pointer;
        border: none;
        margin: 0;
        padding: 0;
        line-height: 1;
        background-color: transparent;
    }

    .share-mode .item::after {
        border: none;
    }

    .share-mode .item image {
        width: 106rpx;
        height: 0;
    }

    .share-mode .item text {
        color: #fff;
        font-size: 24rpx;
        margin-top: 30rpx;
    }

    .select-wrap .close {
        width: 750rpx;
        height: 120rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        bottom: 30rpx;
        z-index: 99999;
    }

    .select-wrap .close image {
        width: 30rpx;
        height: 30rpx;
        /* padding: 30rpx; */
    }

    .is_h5_public_share {
        margin-top: 100rpx;
    }

    .is_h5_share {
        width: 750rpx;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .share-img {
        border-radius: 20%;
        width: 100%;
        display: flex;
        justify-content: center;
    }

    .h5_share_tips {
        width: 400rpx;
        height: 100rpx;
        margin-top: 100rpx;
    }
    .wx_share_img{
        width:500rpx;
        height:500rpx;
        margin-left:100rpx;
    }
    .search .top_w_b_not{
        height: 20px !important;
            width: 20px !important;
    }
    .empty_sort_page {
        width: 100%;
        /* // height: 100vh; */
        background: #F5F5F5;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 340rpx;
    }
    .empty_img {
        width: 210rpx;
        height: 210rpx;
        margin-bottom: 32rpx;
        background: var(--emptyImg);
        background-size: 100% 100%;
    }

    .empty_text {
        font-size: 26rpx;
        color: #999;
    }

    .goods_list{
        padding: 10rpx;
    }
</style>
