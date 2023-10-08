<template>
    <view>
        <template>
            <view class="container" v-if='loadFlag' id="container">
                <!-- 地址 -->
                <view @click="operateAddress" class="address-section">
                    <view class="order-content">
                        <view class="cen" v-if="!!orderAddress.addressId">
                            <view class="top flex_row_start_center">
                                <text v-if='orderAddress.isDefault==1' class="symbol-container default-tag">默认</text>
                                <text v-if='!!orderAddress.tags' class="symbol-container">{{orderAddress.tags}}</text>
                                <text  class="address_all">{{orderAddress.addressAll}}</text>
                            </view>
                            <text class="address">{{orderAddress.detailAddress}}</text>
                            <view class="member_info flex_row_start_center">
                                <text class="name">{{orderAddress.memberName}}</text>
                                <text class="mobile">{{orderAddress.telMobile|formateTel}}</text>
                            </view>
                        </view>
                        <view class="empty_address flex_row_center_center" v-else>
                            <text class="add_icon">+</text>
                            <text class="tit">{{$L('新建收货地址')}}</text>
                        </view>
                        <text class="iconfont icon_arrow_right"></text>
                    </view>
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
                                        <text class="goods_item_spec" v-if="product.specValues">{{product.specValues}}</text>
                                        <text class="goods_item_buynum">*{{product.number}}</text>
                                    </view>
                                    <view class="price-box">
                                        <text class="unit">¥</text>
                                        <text class="price_int">{{ $getPartNumber(product.salePrice,'int') }}</text>
                                        <text class="price_decimal">{{ $getPartNumber(product.salePrice,'decimal') }}</text>
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

                        <view class="yt-list store_info">
                            <template>
                                <view class="yt-list-cell">
                                    <view class="cell-tit">{{$L('配送时间')}}</view>
                                    <template v-if="!!item.productPromiseCalendars&&item.productPromiseCalendars.length>0">
                                        <view v-if="!item.deliveryTimeStr">
                                            <text>工作日、双休日与节假日均可送货</text>
                                        </view>
                                        <block v-else>
                                            <view v-if="item.productPromiseCalendars.length>1" class="cell-tip arrow_right delivery-cell-tip">
                                                <text @click="openPopup(item,index)">{{item.deliveryTimeStr}}</text>
                                            </view>
                                            <view v-else class="arrow_right">
                                                <text v-if="!!item.deliveryTimeStr" @click="openPopup(item,index,1)" class="cell-tip voice">
                                                    <text v-if="!!item.installTimeStr">大件送货:</text>
                                                    <text v-html="item.deliveryTimeStr"></text>
                                                </text>
                                                <text v-if="!!item.installTimeStr" @click="openPopup(item,index,2)" class="cell-tip voice">
                                                    <text >大件安装:</text>
                                                    <text v-html="item.installTimeStr"></text>
                                                </text>
                                            </view>
                                        </block>
                                    </template>
                                    <view v-else><text>工作日、双休日与节假日均可送货</text></view>
                                </view>
                            </template>
                            <view class="yt-list-cell order_remark" @click="open_remark(item.storeId)">
                                <view class="cell-tit">{{$L('订单备注')}}</view>
                                <view class="cell-tip voice arrow_right remark_text" v-if="reMarkMap[item.storeId]"><text>{{reMarkMap[item.storeId]}}</text></view>
                                <view class="cell-tip default_remark_text arrow_right" v-else>{{$L('给商家备注')}}</view>
                            </view>
                        </view>
                    </view>
                </view>
                <!-- 发票、平台优惠券(阶梯团付定金的时候不显示发票、平台优惠券) -->
                <template
                    v-if="!(allData.promotionType==105&&allData.ladderGroupInfo.ladderGroupState==101||(allData.promotionType==103&&allData.presellInfo.presellState==101&&allData.presellInfo.type!=2))">
                    <view class="yt-list">
                        <!-- 商品总价 -->
                        <view class="yt-list-cell">
                            <view class="cell-tit">{{$L('商品总价')}}</view>
                            <view class="cell-tip voice num-font">￥{{$getPartNumber(allData.goodsAmount,'int')}}{{$getPartNumber(allData.goodsAmount,'decimal')}}</view>
                        </view>
                        <!-- 运费总价 -->
                        <view class="yt-list-cell" @click="showFreightDetail(goodsData[0].expressFeeInfo,goodsData[0].storeId)">
                            <view class="cell-tit clamp">{{$L('运费总价')}}</view>
                            <view class="cell-tip num-font voice" :class="{arrow_right:goodsData[0].expressFeeInfo.state==1 && !(goodsData[0].expressFeeInfo.lowerAmount==-1 || goodsData[0].expressFeeInfo.originFreight==0)}">
                                {{(allData.freightAmount || (goodsData[0].expressFeeInfo.state==1 && goodsData[0].expressFeeInfo.lowerAmount!=-1 && goodsData[0].expressFeeInfo.originFreight>0)) ? ('+￥' + $getPartNumber(allData.freightAmount,'int') + $getPartNumber(allData.freightAmount,'decimal')) : '免运费'}}
                            </view>
                        </view>
                        <!-- 满减金额 -->
                        <view class="yt-list-cell" v-if="allData.totalFullDiscount != 0">
                            <view class="cell-tit">{{$L('立减')}}</view>
                            <view class="cell-tip num-font">-￥{{$getPartNumber(allData.totalFullDiscount,'int')}}{{$getPartNumber(allData.totalFullDiscount,'decimal')}}</view>
                        </view>
                        <!-- 合计 -->
                        <view class="yt-list-total" style="text-align: right;">
                            <text class="cell-tit">{{$L('合计:')}}</text>
                            <text
                                class="num-font total-amount">￥{{$getPartNumber(allData.totalAmount,'int')}}{{$getPartNumber(allData.totalAmount,'decimal')}}</text>
                        </view>
                    </view>
                    <view class="yt-list" v-if="allData.totalAmount != 0">
                        <!-- 经陈sir确认，下单金额为0时，不显示开发票和补开发票 2022/07/29 -->
                        <view class="yt-list-cell invoice" @click="toInvoice">
                            <view class="cell-tit">{{$L('发票')}}</view>
                            <view class="cell-tip voice arrow_right" v-if="!!!invoiceInfo.name">{{$L('不需要发票')}}</view>
                            <view class="cell-tip voice arrow_right" v-else><text class="limVoice">{{invoiceInfo.name}}</text><text>{{invoiceContent==1?'商品明细':'商品类别'}}</text></view>
                        </view>
                    </view>
                    <view class="yt-list" v-if="allData.totalAmount != 0">
                        <!-- 经陈sir确认，下单金额为0时，不显示开发票和补开发票 2022/07/29 -->
                        <view class="yt-list-cell" @click="toInvoice">
                            <text class="cell-tit clamp">{{$L('发票')}}</text>
                            <text class="cell-tip voice" v-if="!!!invoiceInfo.name">{{$L('不需要发票')}}</text>
                            <view class="cell-tip voice" v-else><text class="limVoice">{{invoiceInfo.name}}</text><text>{{invoiceContent==1?'商品明细':'商品类别'}}</text></view>
                            <text class="iconfont icon_arrow_right"></text>
                        </view>
                    </view>
                </template>

                <!-- <view class="empty_h"></view> -->
                <!-- 金额明细 -->
                <view class="empty_h"></view>

                <!-- 底部 -->
                <view class="footer flex_row_end_center" v-if="isBottomShow">
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
                        <!-- <view class="promotion_total" v-if="totalDiscount && totalDiscount>0">
                            已省:<text class="num-font">￥{{$getPartNumber(totalDiscount,'int')}}{{$getPartNumber(totalDiscount,'decimal')}}</text>
                        </view> -->
                    </view>
                    <text class="submit flex_row_center_center"
                        @click="testConfirmOrder">{{$L('提交订单')}}</text>
                </view>

                <!-- 选择配送时间 -->
                <bottomPopup ref="intSendDate" type="bottom" height="832rpx" :showTitle="false" :showCloseBtn="false">
                    <view class="promise-date-container">
                            <view class="popup_title">{{$L("配送时间")}}</view>
                            <view class="close_icon" @click="close_intSendDate"></view>
                            <block>
                                <view class="time_container">
                                    <scroll-view scroll-y="true" class="left_date " :class="{singleLeft: !timeRangeList||timeRangeList.length <= 0}">
                                        <block v-if="timeRangeList&&timeRangeList.length > 0"> 
                                            <view class="item" @click="clickDateItem(item, index,1)" :class="{active:item.selected,active_first: item.selected && index==0}"  v-for="(item, index) in calendarList" :key="index">
                                                <view class="item_con">{{item.dateStr | dateFormat}}</view>
                                                <view class="item_bg" v-if="item.selected"></view>
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
                                    <scroll-view v-if="timeRangeList&&timeRangeList.length > 0" scroll-y="true" class="right_date">
                                        <view class="item" @click="clickTimeItem(item, index,1)" v-for="(item, index) in timeRangeList" :key="index" :class="{active_item:item.selected}">
                                            <view class="num-font">{{item.timeRange}}</view>
                                        </view>
                                    </scroll-view>
                                </view>
                            </block>
                            <block>
                                <view class="btn-box">
                                    <view class="btn-handler cursor-btn" @click="confirm(1)">
                                        <view class="btn-text">确定</view>
                                    </view>
                                </view>
                            </block>
                        </view>
                </bottomPopup>
                <!-- 选择安装时间 -->
                <bottomPopup ref="intInstallDate" type="bottom" height="832rpx" :showTitle="false" :showCloseBtn="false">
                    <view class="promise-date-container">
                            <view class="popup_title">{{$L("配送时间")}}</view>
                            <view class="close_icon" @click="close_intSendDate"></view>
                            <block>
                                <view class="express_name">
                                    <view class="item">安装时间</view>
                                </view>
                                <view class="time_container install_time_container">
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
                                <view class="btn-box">
                                    <view class="btn-handler cursor-btn" @click="confirm(2)">
                                        <view class="btn-text">确定</view>
                                    </view>
                                </view>
                            </block>
                        </view>
                </bottomPopup>
                <!-- 选择商品来选择配送时间 -->
                <bottomPopup ref="SendDatePop" type="bottom" height="900rpx" :showTitle="false" :showCloseBtn="false">
                    <view class="promise-date-container">
                            <view class="popup_title">{{$L("配送时间")}}</view>
                            <view class="close_icon" @click="close_intSendDate"></view>
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
                                <view class="btn-box">
                                    <view class="btn-handler cursor-btn" @click="closePopup()">
                                        <view class="btn-text">确定</view>
                                    </view>
                                </view>
                            </block>
                        </view>
                </bottomPopup>
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
            </view>
        </template>

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
import mixin from '@/common/mixin/comfirmOrderMixin'
import {decrypt,skipTo,lockScroll, unlockScroll} from '@/utils/common.js';
import orderHandler from '@/components/order/handler';
import voucherEmpty from '@/components/voucher/voucherEmpty.vue'
import voucherUnavailableVue from '@/components/voucher/voucherUnavailable.vue';
import goodsHandler from '@/components/goods/handler';
export default {
    data() {
        return {
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
            intRuleList: [], //index=0-是否开启云豆抵现（0：不开 1：开） 1-云豆换算比例 2-云豆最低使用金额 3-云豆最高抵现比例
            numbers: 1, // 购买数量 兑换码兑换默认为1
            decryptInfo: {}, // 解密出来的数据 { voucher(兑换码), sku, userId, companyId, channelId } 
            voucherCheckError: false,//奖品申请check接口报错显示联系客服缺省页的控制变量
            voucherCheckUnavailable:false,//奖品申请check接口通过。状态码267 且 res.data.state = 5 时'兑换券不可用'
            reMarkMap: {},
            tempReMarkMap:{},
            currRemarkstoreId:''
        }
    },
    mixins: [mixin],
    components: {
        voucherEmpty,
        voucherUnavailableVue
    },
    async mounted(){
        await this.decryptVoucher()

        this.getVuexAddress()

        uni.$on('addressBack', (data) => {
            this.showType = data
        })
        // 注册地址初始化完成事件
        uni.$on('addressRequestDone', this.getVuexAddress)
        uni.$on('checkEdit', () => {
            this.isCheckBack = true
        })
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
        selInt(e) {
            this.tmpInt = e
        },
        conInt(type) {
            switch (type) {
            case 'confirm': {
                this.integral = this.tmpInt
                this.$refs.integralModel.close()
                this.confirmOrder(2)
                break
            }
            case 'close': {
                this.integral = 0
                this.$refs.integralModel.close()
                break
            }
            case 'noInt': {
                this.integral = 0
                this.confirmOrder(2)
                this.$refs.integralModel.close()
                break
            }
            default:
            }
        },
        select_integral() {
            if (!this.allData.integralList.length&&Number(this.allData.totalAmount)>=this.intRuleList[2]) {
                return
            }

            this.$refs.integralModel.open()
        },
        showIntRule() {
            this.$refs.intRule.open()
        },
        //选择优惠券
        select_coupon(coupon) {
            // 平台券
            if (coupon.storeId == 0){
                this.currentPlatformCouponCode = coupon.checked == true ? '' : coupon.couponCode
                this.confirmOrder(2)
            } else {
                // 店铺券需要特殊校验——每个店铺只能选一张
                this.handlerStore(coupon)
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
        // 解密兑换码等信息
        decryptVoucher() {
            return new Promise((resolve) => {
                try {
                    let paramsStr = decodeURIComponent(this.$Route.query.code)
                    this.decryptInfo = JSON.parse(decrypt(paramsStr))
                    resolve()
                } catch (error) {
                    uni.showToast({ title: '页面访问错误！' })
                }
            })
        },
        // 获取商品详情
        getGoodsDetails(isShow) {
            return new Promise((resolve) => {
                let param = {};
                param.skus = [this.decryptInfo.sku];
                goodsHandler.getListBySkus(param).then(async (res) => {
                    if (res.state == 200) {
                        if (res.data.length > 0) {
                            this.goodsData = res.data.map(item => {
                                return {
                                    ownShop : item.ownShop,
                                    storeName : item.storeName,
                                    storeId : item.storeId,
                                    products : [{
                                        sku:item.sku,
                                        skuName:item.skuName,
                                        specValues:item.specValues,
                                        mainImage:item.mainImage,
                                        lowestBuy:item.lowestBuy,
                                        salePrice:item.salePrice,
                                        number:this.numbers,
                                        categoryId3:item.categoryId3,
                                        cidPath:item.cidPath,
                                        notAttendDiscount:false,
                                        voucherCode: this.decryptInfo.voucherCode // 兑换码
                                    }],
                                    invoiceId : this.invoiceId,
                                    storeCouponCode :this.currentStore.storeId == item.storeId?this.currentStore.storeCouponCode:item.storeCouponCode,
                                    selectedPromiseCalendars : []
                                }
                            })
                            this.goodsData.forEach((item) => {
                                this.$set(this.reMarkMap, item.storeId, '')
                                this.$set(this.tempReMarkMap, item.storeId, '')
                                            
                            })
                            resolve(res.data[0]);
                            await this.confirmOrder(isShow ? 2 : 1);
                        } else {
                            this.voucherCheckError = true;
                        }
                    } else {
                        resolve({});
                        uni.showToast({
                            title: res.msg,
                            icon:'none'
                        })
                        this.voucherCheckError = true;
                    }
                }).catch(() => {
                    resolve({});
                });
            });
        },
        //获取地址列表
        async getAddressList(isShow) {
            try {
                if (this.addressList.length > 0) {
                    this.orderAddress = this.defaultAddress;
                }
            } catch (error) {
                
            }
            this.getGoodsDetails(isShow)
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
            param.data.storeInfoList = this.goodsData
            param.data.source = type

            param.data.orderSource = 'VOUCHER';

            // param.data.userId = this.decryptInfo.userId
            // param.data.companyId = this.decryptInfo.companyId
            // param.data.channelId = this.decryptInfo.channelId

            uni.showLoading({
                title: '加载中'
            })
            orderHandler[handlerType](param.data).then(res => {
                if (res.state == 200) {
                    let result = res.data;
                    this.goodsData = result.storeGroupList;
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
                        this.$set(item, 'remark', '')
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

                    this.getPromiseCalendar();//获取配送时间
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
            // 在提交订单之前对地址进行校验
            if (!this.orderAddress.addressId) {
                uni.showToast({ title: '请选择收货地址', icon: 'none' })
                return
            }
            
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
                
                let productPromiseCalendars = JSON.parse(JSON.stringify(item.productPromiseCalendars || [])) || [];
                let selectedPromiseCalendars = [];
                productPromiseCalendars.forEach(items=>{
                    if (!!items.supportDelivery){
                        selectedPromiseCalendars.push(items)
                    }
                })
                //去除无用字段2023-3-1
                selectedPromiseCalendars.map(selectItem=>{
                    let deleteKeys = ['calendarList','defaultSelectedCalendarDay','calendarDayInstallDays','defaultSelectedInstallDay','installDays','imgPathList','deliveryTimeStr','installTimeStr']
                    deleteKeys.forEach(key=>{
                        delete selectItem[key]
                    })
                    return selectItem;
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
            param.data.orderFrom = this.order_from
            let handlerType = 'submit';
            param.data.source = 3;

            param.data.products = [
                {
                    number: this.numbers,
                    sku: this.decryptInfo.sku, // 商品sku
                    voucherCode: this.decryptInfo.voucherCode, // 兑换码
                    notAttendDiscount:false//非购物车传false，表示用户未选择不使用优惠
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

            let userInfo = getApp().globalData.userParams
            // 下单新增企业名称字段
            if (!!userInfo.companyName){
                param.data.companyName = userInfo.companyName;
            }
            // 下单新增渠道名称字段
            if (!!userInfo.channelName){
                param.data.channelName = userInfo.channelName;
            }
            uni.showLoading({
                title:'加载中...'
            })

            orderHandler[handlerType](param.data).then(res => {
                if (res.state == 200) {
                    this.$bbcStatEvent({
                        behaviorType: 'buy'
                    })

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
                } else {
                    // 奖品详情页提交订单接口报错，统一提示联系客服的缺损页
                    this.voucherCheckError = true;
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

        //根据submit接口返回值，判断页面如何跳转。
        gotoNextPage(res){
            //因为订单优化，取消了payInfo接口，这个afterPayInfoBusinessDone直接赋值true
            this.afterPayInfoBusinessDone = true;
            //orderPayState ==1 来判断 已支付 0元单跳转 zeroPayResult
            if(res.data.orderAmount == 0 && res.data.orderPayState == 1){
                this.$store.dispatch('getCartNum'); //更新购物车商品数量
                this.$Router.push({
                    path: '/views/pay/zeroPayResult',
                    query: {
                        state: 'SUCESS',
                        type:'VOUCHER',
                        closeTo: -1
                    }
                })
                return        
            }
            //orderPayState ==1 来判断 已支付 非0元单跳转 order/list      
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
            //抽奖活动 默认都是0元订单，不需要跳转收银台，只需要跳转 支付成功页面
            console.error('VOUCHER submit get error',res.data.paySn, res.data.orderAmount, res.data.orderPayState)            
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
        //点击优惠券确定
        couponConfirm(){
            unlockScroll()
            this.$refs.couponPopup.close();
        },
        //切换优惠券类别
        changeCouponClass(index){
            this.currentIndex = index
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
        // 关闭配送时间弹框
        close_intSendDate() {
            this.$refs.intSendDate.close();
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
        }
    }
}
</script>

<style lang="scss">
@import './confirmOrder.scss'
</style>