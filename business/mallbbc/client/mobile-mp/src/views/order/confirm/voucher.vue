<template>
    <view>
        <view class="container" id="container">
            <w-loading ref="loading"></w-loading>
            <!-- 地址骨架图 -->
            <view class="order-content-skeleton" v-if="addressLoading">
                <view class="skeleton_long"></view>
                <view class="skeleton_middle"></view>
            </view>
            <!-- 地址 -->
            <view @click="operateAddress" class="address-section">
                <view class="order-content">
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
                        <text class="add_icon">+</text>
                        <text class="tit">新建收货地址</text>
                    </view>
                    <text class="iconfont icon_arrow_right" v-if="!addressLoading"></text>
                </view>
            </view>

            <view class="goods-section" v-if="goodsData.length>0">
                <!-- 商品列表 -->
                <view class="store_list block_wrapper" v-for="(item, index) in goodsData" :key='index'>
                    <view class="store_name">
                        <image class="store_logo" :src="storeLogo"></image>
                        <text class="store_name_text">{{item.storeName}}</text>
                    </view>
                    <view class="product_con" v-for="(product,index) in item.productList" :key='index'>
                            <view class="g-item flex_row_start_start">
                                <view class="image" :style="{backgroundImage: 'url('+product.mainImage+')'}"></view>
                                <view class="right flex_column_between_start">
                                    <view class="flex_column_start_start">
                                        <text class="title">{{product.skuName}}</text>
                                    </view>
                                    <view class="goods_item_specs">
                                        <text class="goods_item_spec">{{product.specValues || '默认'}}</text>
                                        <text class="goods_item_buynum">*{{product.buyNum}}</text>
                                    </view>
                                    <block v-if="loadFlag">
                                        <view class="price-box">
                                            <text class="unit">¥</text>
                                            <text class="price_int">{{ getPartNumber(product.price,'int') }}</text>
                                            <text class="price_decimal">{{ getPartNumber(product.price,'decimal') }}</text>
                                        </view>
                                        <view v-if='product.giftList&&product.giftList.length>0'>
                                            <view class="gift-box" v-for="(giftItem,i) in product.giftList" :key='i'>
                                                <text class="gift-box-icon">{{giftItem.productType==2?'赠品':'附件'}}</text>
                                                <text class="gift-box-name" v-if="giftItem.skuName">{{giftItem.skuName}}</text>
                                                <text class="gift-box-num">x{{giftItem.buyNum}}</text>
                                            </view>
                                        </view>
                                    </block>
                                </view>
                            </view>
                    </view>
                    <block v-if="loadFlag">
                        <view class="yt-list store_info">
                            <view class="yt-list-cell b-b">
                                <text class="cell-tit clamp ">配送时间</text>
                                <template v-if="!!item.productPromiseCalendars&&item.productPromiseCalendars.length>0">
                                <view class="cell-tip-bold" v-if="!item.deliveryTimeStr">
                                    <text>工作日、双休日与节假日均可送货</text>
                                </view>
                                <view v-else>
                                    <view v-if="item.productPromiseCalendars.length>1">
                                        <text class="cell-tip-bold" @click="openPopup(item, index)">{{item.deliveryTimeStr}}</text>
                                        <text class="iconfont icon_arrow_right"></text>
                                    </view>
                                    <view v-else>
                                        <view v-if="!!item.deliveryTimeStr" @click="openPopup(item, index, 1)" class="cell-tip voice">
                                            <text v-if="!!item.installTimeStr">大件送货:</text>
                                            <view class="cell-tip-bold" v-html="item.deliveryTimeStr"></view>
                                            <text class="iconfont icon_arrow_right"></text>
                                        </view>
                                        <view v-if="!!item.installTimeStr" @click="openPopup(item, index, 2)" class="cell-tip voice">
                                            <text>大件安装:</text>
                                            <view class="cell-tip-bold" v-html="item.installTimeStr"></view>
                                            <text class="iconfont icon_arrow_right"></text>
                                        </view>
                                    </view>
                                </view>
                                </template>
                                <view v-else><text>工作日、双休日与节假日均可送货</text></view>
                            </view>
                        </view>
                    
                        <!-- 订单备注 -->
                        <view class="yt-list-cell b-b"  @click.stop="showRemarkPopup(item.storeId)">
                            <text class="cell-tit clamp">订单备注</text>
                            <text v-if="remarkMap[item.storeId]" class="cell-tip-bold one_line_ellipsis">{{ remarkMap[item.storeId] }}</text>
                            <text v-else style="color: #666; font-size: 28rpx;">给商家备注</text>
                            <text class="iconfont icon_arrow_right"></text>
                        </view>
                    </block>
                    <block v-else>
                        <view class="order-info-skeleton animated-opacity">
                            <view class="skeleton_long"></view>
                            <view class="skeleton_short"></view>
                            <view class="skeleton_middle"></view>
                            <view class="skeleton_long"></view>
                            <view class="skeleton_middle"></view>
                            <view class="skeleton_long"></view>
                            <view class="skeleton_long"></view>
                            <view class="skeleton_short"></view>
                            <view class="skeleton_middle"></view>
                            <view class="skeleton_long"></view>
                            <view class="skeleton_middle"></view>
                            <view class="skeleton_long"></view>
                            <view class="skeleton_long"></view>
                            <view class="skeleton_short"></view>
                            <view class="skeleton_middle"></view>
                            <view class="skeleton_long"></view>
                            <view class="skeleton_middle"></view>
                            <view class="skeleton_long"></view>
                        </view>
                    </block>
                </view>
            </view>
            <!-- 发票、平台优惠券-->
            <view class="yt-list block_wrapper" v-if="loadFlag">
                <!-- 商品金额 -->
                <view class="yt-list-cell b-b">
                    <text class="cell-tit clamp">商品总价</text>
                    <text
                        class="cell-tip num-font">￥{{getPartNumber(allData.goodsAmount,'int')}}{{getPartNumber(allData.goodsAmount,'decimal')}}</text>
                </view>
                <!-- 运费总额 -->
                <view class="yt-list-cell b-b" >
                    <text class="cell-tit clamp">运费总价</text>
                    <text
                        class="cell-tip num-font">{{allData.freightAmount ? ('+￥' + getPartNumber(allData.freightAmount,'int') + getPartNumber(allData.freightAmount,'decimal')) : '免运费'}}</text>
                </view>
                <!-- 合计 -->
                <view class="yt-list-cell b-b" style="text-align: right;">
                    <text class="cell-tit clamp">合计</text>
                    <text
                        class="cell-tip num-font">￥{{getPartNumber(allData.totalAmount,'int')}}{{getPartNumber(allData.totalAmount,'decimal')}}</text>
                </view>
            </view>

            <!-- 金额明细 -->
            <view class="empty_h"></view>

            <!-- 底部 -->
            <view :class="['footer','flex_row_end_center',iosHairPhone ? 'iosBottomPadding' : 'androidBottomPadding']" v-if="loadFlag && isBottomShow">
                <view class="price-content flex_column_center_end">
                    <view class="should_pay flex_row_end_end">
                        <text class="tit">合计:</text>
                        <text class="price">
                            <text class="unit">￥</text>
                            <text class="big_price">{{(allData.totalAmount+'').split('.')[0]}}.</text>
                            <text
                                class="small_price">{{(allData.totalAmount+'').split('.')[1]!=undefined?((allData.totalAmount+'').split('.')[1]):'00'}}
                            </text>
                        </text>
                    </view>
                </view>
                <text class="submit flex_row_center_center" @click="authProxyHandler(beforeSubmit)">提交订单</text>
            </view>
        </view>
        <view class="footer_skeleton" v-if="!loadFlag">
            <view></view>
        </view>
        <!-- 选择配送时间 -->
        <bottomPopup ref="intSendDate" type="bottom" height="820rpx" text="配送时间">
            <view class="promise-date-container">
                <view class="time_container">
                    <scroll-view scroll-y="true" :class="[showSinglePromiseDate ? 'single_date': 'left_date']">
                        <block v-if="!showSinglePromiseDate"> 
                            <view class="item" @click="clickDateItem(item, index,1)" :class="{active: item.selected}"  v-for="(item, index) in calendarList" :key="index">
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
                        <view class="item" :class="{active: item.selected}"  @click="clickTimeItem(item, index,1)" v-for="(item, index) in timeRangeList" :key="index">
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
                <block>
                    <view class="express_name">
                        <view class="item">安装时间</view>
                    </view>
                    <view class="time_container">
                        <scroll-view scroll-y="true" class="left_date " :class="{singleLeft: installtimeRangeList.length <= 0}">
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
                </block>
                <block>
                    <view :class="['btn-box',iosHairPhone ? 'iosBottomPadding' : 'androidBottomPadding']">
                        <view class="btn-handler cursor-btn normal-btn" @click="confirm(2)">
                            <view class="btn-text">确定</view>
                        </view>
                    </view>
                </block>
            </view>
        </bottomPopup>
        <!-- 选择商品来选择配送时间 -->
        <bottomPopup ref="SendDatePop" type="bottom" height="900rpx" text="配送时间">
            <view class="promise-date-container">
                <block>
                    <view class="date-wrap">
                        <view class="item-container" v-for="(item, index) in productPromiseCalendars" :key="index">
                            <!-- {{item.imgPathList}} -->
                            <view class="imgList">
                                <text v-for="(temp, i) in item.imgPathList" :key="i"><img :src="temp" alt=""></text>
                            </view>
                            <view v-if="!!item.deliveryTimeStr" @click="clickItem(item, index)" class="des-box">
                                <view class="des-content">
                                    <view class="name">{{item.showName}}送货时间</view>
                                    <view class="time" v-html="item.deliveryTimeStr"></view>
                                </view>
                                <view>
                                    <text class="iconfont icon_arrow_right"></text>
                                </view>
                            </view>
                            <view v-else class="des-box">
                                <view class="des-content">
                                    <view class="name">{{item.showName}}送货时间</view>
                                    <view class="time">{{`工作日、双休日与节假日均可送货`}}</view>
                                </view>
                            </view>
                            <!-- 当大件安装时间日历存在时，才显示 -->
                            <view @click="clickInstallItem(item, index)" class="des-box" v-if="item.calendarDayInstallDays.length > 0">
                                <view class="des-content">
                                    <view class="name">{{item.showName}}安装时间</view>
                                    <view class="time" v-html="item.installTimeStr"></view>
                                </view>
                                <view>
                                    <text class="iconfont icon_arrow_right"></text>
                                </view>
                            </view>
                        </view>
                    </view>
                </block>
                <block>
                    <view :class="['btn-box',iosHairPhone ? 'iosBottomPadding' : 'androidBottomPadding']">
                        <view class="btn-handler cursor-btn normal-btn" @click="closePopup()">
                            <view class="btn-text">确定</view>
                        </view>
                    </view>
                </block>
            </view>
        </bottomPopup>
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

        <!-- 登录弹窗 start-->
        <bottomPopup ref="authPopup" type="bottom" height="auto" :showTitle="false" conBackground="#fff">
            <AuthComp @confirm="confirmAuth" @cancel="cancel" />
        </bottomPopup>
        <!-- 登录弹窗 end -->

        <!-- 奖品详情check接口报错的联系客服缺省页  -->
        <template v-if="voucherCheckError">
            <voucherEmpty />
        </template>
        <template v-if="voucherCheckUnavailable">
            <voucherUnavailableVue />
        </template>
    </view>
</template>

<script>
import mixin from '@/views/order/confirm/comfirmOrderMixin';
import { getPartNumber, getStorageSync } from '@/utils/common.js';
import orderHandler from '@/views/components/order/handler';
import voucherEmpty from '@/views/components/voucher/voucherEmpty.vue'
import voucherUnavailableVue from '@/views/components/voucher/voucherUnavailable.vue';
import bottomPopup from '@/common/components/uni-popup/uni-popup-bottom.vue'
import AuthComp from '@/common/components/auth/auth-comp';
import { authProxyHandler } from '@/utils/auth/auth.js';
import { subscribeMessage } from '@/views/subscribe/index.js';
import { SUB_PUB_KEY } from '@/views/subscribe/enum.js';
import config from '@/common/lib/config.js';
import goodsHandler from '@/views/components/goods/handler';
import payHandler from '@/views/components/pay/handler';
export default {
    data() {
        return {
            firstLoading: true,
            storeLogo: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/goods/store_logo.png',
            authKey: 'authed-voucher',
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
            numbers: 1, // 购买数量 兑换码兑换默认为1
            decryptInfo: {}, // 解密出来的数据 { voucher(兑换码), sku, userId, companyId, channelId } 
            voucherCheckError: false, // 奖品申请check接口报错显示联系客服缺省页的控制变量
            voucherCheckUnavailable: false, // 奖品申请check接口通过。状态码267 且 res.data.state = 5 时'兑换券不可用'
            getPartNumber
        }
    },
    mixins: [mixin],
    components: {
        voucherEmpty,
        voucherUnavailableVue,
        bottomPopup,
        AuthComp
    },
    onShow() {
    },
    onLoad(){

    },
    async mounted(){
        this.decryptInfo = {
            sku: this.$Route.query.sku,
            voucherCode: this.$Route.query.voucherCode
        }

        this.getAddressList()

        uni.$on('addressBack', (data) => {
            this.showType = data
        })
 
        uni.$on('checkEdit', () => {
            this.isCheckBack = true
        })
    },
    computed: {
        // 单列配送时间布局显示
        showSinglePromiseDate(){
            return !this.timeRangeList || this.timeRangeList.length <= 0;
        },
    },
    methods: {
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
        buildGoodsData(data){
            let { 
                ownShop, storeId, storeName, specValues, mainImage, stageId,
                salePrice, sku, skuName, categoryId3, cidPath, promotionDes, promotionId, promotionType
            } = data

            this.goodsData = [{
                ownShop,
                storeId,
                storeName
            }]

            this.goodsData[0].productList = [{
                storeName,
                skuName, 
                specValues,
                mainImage, 
                buyNum: 1,
                price: salePrice,
                sku,
            }]

            this.goodsData[0].products =  [{
                storeName,
                storeId,
                sku,
                number: 1,
                notAttendDiscount: false,
                salePrice,
                categoryId3,
                cidPath,
                voucherCode: this.decryptInfo.voucherCode, // 兑换码
                // 秒杀、一起买、天天专场
                specialOfferVO:!!promotionId? {
                    promotionDes,
                    promotionId,
                    promotionType,
                    stageId
                }: null
            }]
        },
        async listBySku(sku){
            try {
                this.$refs?.loading?.open();
                let res = await goodsHandler.getListBySkus({skus: [sku]});
                if(res.state == 200 && res.data?.length > 0){
                    return Promise.resolve(res.data)
                }else{
                    uni.showToast({
                        title: '当前商品暂时缺货，火速补货中，请稍后再试',
                        icon: 'none'
                    })
                    return Promise.resolve(null)
                }
            } catch (error) {
                return Promise.resolve(null)
            } finally {
                this.$refs?.loading?.close();
            }
        },
        confirmAuth(flag){
            uni.$emit(this.authKey, flag);
            this.$refs.authPopup.close();

        },
        cancel(){
            uni.$emit(this.authKey, false);
            this.$refs.authPopup.close();
        },
        authProxyHandler(next, ...param){
            authProxyHandler(this, this.authKey, next, ...param);
        },
    
        //获取地址列表
        async getAddressList(isShow) {
            this.orderAddress = this.$store.state.defaultAddress;
            this.addressLoading = false;
            // 获取完整的sku信息
            let skuInfos = await this.listBySku(this.$Route.query.sku);
            if(!skuInfos || skuInfos.length == 0){
                return;
            }
            this.buildGoodsData(skuInfos[0]);
            this.confirmOrder(isShow ? 2 : 1);
        },
        
        //用于切换地址，使用优惠券，获取信息，运费等  type 服务端参数解释 1立即购买 去结算;2 提交订单页 修改优惠券 修改云豆 修改地址 更新页面数据 ;3 提交订单 
        confirmOrder(type) {
            // 
            let param = {};
            let handlerType = 'confirm';
            param.data = {};
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
            param.data.platformCouponCode = this.platformCouponCode
            param.data.orderSn = '';

            if (this.integral > 0) {
                param.data.integral = this.integral
            }
             // 店铺信息
             let storeInfoList = []

            this.goodsData.forEach((store) => {
                let storeItem = {}
                storeItem.storeId = store.storeId;
                storeItem.storeName = store.storeName;
                storeItem.ownShop = store.ownShop;
                // products为核心下单参数
                storeItem.products = store.products;
                storeItem.invoiceId = this.invoiceId

                if (this.currentStore.storeId == store.storeId) {
                    storeItem.remark = this.currentStore.remark
                    storeItem.storeCouponCode = this.currentStore.storeCouponCode
                    storeItem.storeId = this.currentStore.storeId
                } else {
                    storeItem.remark = store.remark
                    storeItem.storeCouponCode = store.storeCouponCode
                    storeItem.storeId = store.storeId
                }
                storeItem.selectedPromiseCalendars = []
                storeInfoList.push(storeItem)

            })  
            
            param.data.storeInfoList = storeInfoList
            param.data.source = type
            param.data.isCart = false;

            param.data.orderSource = 'VOUCHER';

            !this.firstLoading && this.$refs?.loading?.open();
            this.firstLoading = false;
            orderHandler[handlerType](param.data).then(res => {
                if (res.state == 200) {
                    let result = res.data;

                    this.goodsData.forEach(storeItem => {
                        let fitStoreItem = res.data.storeGroupList?.find(resStoreItem => resStoreItem.storeId == storeItem.storeId);
                        Object.assign(storeItem, fitStoreItem)
                    })
                    this.IntegrateCalendars()
                    this.isVatInvoice = result.isVatInvoice
                    this.totalDiscount = result.totalDiscount
                    this.allData = result;
                    this.totalCouponDiscount = res.data?.totalCouponDiscount
                    this.loadFlag = true;
                    if (this.integral==0) {
                        this.initPrice = Number(this.allData.totalAmount) + Number(this.allData.totalDiscount);
                    }
                    //接口返回包含店铺和平台所有可用、不可用列表
                    this.availableCouponList = res.data?.availableCouponList
                    this.disabledCouponList = res.data?.disabledCouponList
                    this.availableCouponList?.sort((a,b) => {
                        return a.receiveTime<b.receiveTime?1:-1
                    });
                    this.disabledCouponList.sort((a,b) => {
                        return a.receiveTime<b.receiveTime?1:-1
                    });
                    //从可用列表中获取当前全部选中的优惠券
                    let temp = this.availableCouponList?.filter((item) =>item.checked == true).map((item)=>item.couponCode)

                    //记录最佳也就是第一次
                    if (this.isRecommendCount == 1){
                        //最佳优惠券集合
                        this.recommendCouponList = temp
                    }
                    //判断用户操作后 是否还是最佳 也就是判断isRecommendCount和temp的值
                    this.isRecommendCoupon = this.recommendCouponList.length == temp.length && this.recommendCouponList.every(a => temp.some(b => a===b))? true:false;
                    let num = 0
                    this.availableCouponList?.forEach((item) => {
                        this.$set(item, 'remark', '')
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
                    this.isRecommendCount+=1
                    this.couponList[0].list = this.availableCouponList
                    this.couponList[0].listLength = this.availableCouponList?.length
                    this.couponList[1].list = this.disabledCouponList
                    this.couponList[1].listLength = this.disabledCouponList.length
                    this.recommendCouponList?.forEach((item)=>{
                        this.availableCouponList?.forEach((coupon,index) => {
                            if (coupon.couponCode == item){
                                this.availableCouponList?.splice(index,1)
                                this.availableCouponList?.splice(0,0,coupon)
                            }
                        })
                    })
                    if (this.orderAddress.addressId) {
                        this.getPromiseCalendar();//获取配送时间
                    }
                } else {
                    this.voucherCheckError = true;
                    uni.showToast({ title: res.msg, icon: 'none' })
                }
            }).catch(() => {
                //异常处理
                
            }).finally(()=>{
                this.$refs?.loading?.close();
            })
        },
        beforeSubmit(){
            // 提前判断如果金额是0元，则为0元支付，不调用微信pay，直接订阅
            if (this.allData.totalAmount == 0) {
                subscribeMessage(this, [SUB_PUB_KEY.PAYMENT_SUCCESS_REMINDER], this.submit);
            }else{
                this.submit();
            }
        },
        //提交订单
        submit(gift) {
            // 在提交订单之前对地址进行校验
            if (!this.orderAddress.addressId) {
                uni.showToast({ title: '请选择收货地址', icon: 'none' })
                return
            }
            let param = {};
            param.data = {};
            let storeInfoList = []
                
            this.goodsData.forEach(item => {
                let storeitem = {}
                storeitem.invoiceId = this.invoiceId
                storeitem.invoiceContent = this.invoiceContent
                storeitem.remark = item.remark                
                storeitem.storeCouponCode = ""
                item.availableCouponList?.forEach(items => {
                    if (items.checked == true) {
                        storeitem.storeCouponCode = items.couponCode
                    }
                })

                storeitem.storeId = item.storeId
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
                productPromiseCalendars?.forEach(items=>{
                    if (!!items.supportDelivery){
                        selectedPromiseCalendars.push(items)
                    }
                })
                storeitem.selectedPromiseCalendars = selectedPromiseCalendars
                storeInfoList.push(storeitem)
            })
            param.data.platformCouponCode = this.currentPlatformCouponCode
            // 订单接口 addressId 替换为地址相关对象
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
            param.data.storeInfoList = storeInfoList
            param.data.orderFrom = 5
            let handlerType = 'submit';
            param.data.source = 3;

            param.data.isCart = false;
            param.data.products = [
                {
                    number: this.numbers,
                    sku: this.decryptInfo.sku, // 商品sku
                    voucherCode: this.decryptInfo.voucherCode, // 兑换码
                    notAttendDiscount: false,  //非购物车传false，表示用户未选择不使用优惠
                }
            ];
            param.data.orderSource = 'VOUCHER';

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

            this.$refs?.loading?.open();

            orderHandler[handlerType](param.data).then(res => {
                if (res.state == 200) {
                    // 上报购买事件
                    this.$statEvent({
                        behaviorType: 'buy',
                    })
                    payHandler.pay(this, { ...res.data });
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
                            }
                        }
                    })
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
                            } else {
                                this.skuList=[]
                                this.openOrderLock();
                            }
                        }
                    })
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
                } else {
                    // 奖品详情页提交订单接口报错，统一提示联系客服的缺损页
                    this.voucherCheckError = true;
                    this.openOrderLock();
                }
            }).catch(() => {
                //异常处理
                this.openOrderLock();
            }).finally( ()=> {
                this.$refs?.loading?.close();
            })
        },
    }
}
</script>

<style lang="scss">
@import './confirmOrder.scss';
.authed-btn {
    margin: 0;
    padding: 0;
    background: none;
}
.authed-btn::after{
    display: none;
}
</style>