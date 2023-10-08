<!-- 消费券详情 -->
<template>
    <view class="consumption_detail_container">
        <u-navbar title="消费券详情" :bgColor="useState=='1'?(scrollFlag?'#FF711E':'transparent'):'#EFF2F5'" autoBack :titleStyle="{ color: useState=='1'?'#fff':'#222', 'font-weight': 'bold' }">
        </u-navbar>
        <view class="consumption_detail_box" :class="{gray:useState!='1'}" v-if="loaded && detail">
            <scroll-view class="scroll_box" scroll-y>
                <view class="consumption_detail">
                    <view class="voucher_state flex_row_center_center" v-if="useState!='1'">
                        <img :src="useState=='2'?radioSel:warningIcon"/>
                        <text>{{useState=='2'?'已核销':'已过期'}}</text>
                    </view>
                    <!-- 券码信息 -->
                    <view class="voucher_info">
                        <view class="top_part">
                            <view class="voucher_info_item flex_row_start_start">
                                <view class="left flex_column_center_center">
                                    <view class="coupon_pre_price num-font" :style="{opacity:showPrice?1:0}" v-if="detail.publishValue && detail.couponType != 2">
                                        <text class="unit num-font" :style="{fontSize:fitfontSize['small'][detail.publishValue.toString().length]}">¥ </text>
                                        <text class="price_int num-font" :style="{fontSize:fitfontSize['big'][detail.publishValue.toString().length]}">{{detail.publishValue}}</text>
                                    </view>
                                    <view class="coupon_pre_price" v-if="detail.publishValue && detail.couponType == 2">
                                        <text class="price_int">{{detail.publishValue/10}}</text>
                                        <text class="price_decimal">折</text>
                                    </view>
                                    <view  v-if="detail.couponContent" class="coupon_pre_active" :style="{fontSize:fitfontSize['active'][detail.couponContent.length]}">
                                        {{detail.couponContent}}
                                    </view>
                                </view>
                                <view class="right">
                                    <view class="name flex_row_start_center" v-if="detail.couponName"><view>{{detail.couponName}}</view></view>
                                    <view class="maxDeductionValue flex_row_center_center" v-if="detail.couponType == 2 && detail.discountLimitAmount">最多优惠<text class="num-font">{{detail.discountLimitAmount}}</text>元</view>
                                    <view class="date" v-if="detail.effectiveStart && detail.effectiveEnd" :class="{padding0:detail.couponType == 2 && detail.discountLimitAmount}">{{maskTime(detail.effectiveStart)}}~{{maskTime(detail.effectiveEnd)}}</view>
                                </view>
                                <view class="voucher_icon flex_row_center_center">
                                    <text>消费券</text>
                                </view>
                            </view>
                        </view>
                        <view class="line_box"></view>
                        <view class="voucher_codeImg flex_column_center_center" v-if="useState=='1'">
                            <view @click="enlargeQrcode" v-show="!showQrcode">
                                <qrcode :options="{ size: qrCodeObj.size, code: qrCodeObj.value }" />
                            </view>
                            
                            <view @click="enlargeQrcode" class="tips">点击可放大查看</view>
                        </view>
                        <view class="voucher_code">
                            <view>券码</view>
                            <view class="code" :class="{invalidCode:useState!='1'}">{{formateNumber(detail.couponCode)}}</view>
                        </view>
                    </view>
                    <!-- 店铺信息 -->
                    <view class="store_info">
                        <view class="applicable_store">
                            <view class="title flex_row_between_center">
                                <view class="title_left flex_row_start_center">
                                    <view>适用门店</view>
                                    <view class="flag" :class="{allStore:detail.useShopType!=0}">{{detail.useShopType==0?'指定门店':'所有门店'}}</view>
                                </view>
                                <view class="title_right" @click="showMoreStore">更多适用门店</view>
                            </view>
                            <view class="store_list" v-if="storeList && storeList.length>0">
                                <view class="store_item flex_row_start_start" v-for="(item,index) in storeList.slice(0,1)" :key="index">
                                    <view class="store_logo">
                                        <image v-if="item.logo" :src="item.logo"/>
                                        <image v-else :src="storeLogo"/>
                                    </view>
                                    <view class="store_info_detail">
                                        <view class="store_name">{{item.shopName}}</view>
                                        <view class="store_address">{{item.areaInfo+item.address}}</view>
                                        <view class="store_phone" v-if="isPC">{{item.servicePhone.join(', ')}}</view>
                                        <view class="store_phone" v-else>
                                            <text v-for="(temp, index1) in item.servicePhone" :key="index1" @click="tel(temp)">{{index1==(item.servicePhone.length-1) ? temp : (temp+',')}}</text>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </view>
                        <view class="applicable_time flex_row_between_start">
                            <view class="title_left">可用时段</view>
                            <view>
                                <text v-for="(item,index) in detail.extendInfoVOList" :key="index">
                                    {{item.week.replaceAll(',','、')+' '+'['+item.period.replaceAll(',','、')+'] '}}
                                    <text v-if="index<detail.extendInfoVOList.length-1">;</text>
                                </text>
                            </view>
                        </view>
                        <view class="use_rules">
                            <view class="title flex_row_between_center">
                                <view class="title_left">使用规则</view>
                                <view @click="showRules" :class="{down_arrow:!showRulesFlag}"></view>
                            </view>
                            <view class="rules_content" v-if="showRulesFlag">
                                <text>{{rules}}</text>
                            </view>
                        </view>
                    </view>
                    <!-- 核验信息 -->
                    <view class="writeOff_info" v-if="useState == '2' && detail.couponCheckMemberVO">
                        <view class="writeOff_item flex_row_between_center">
                            <view class="title">核验人</view>
                            <view class="content">{{detail.couponCheckMemberVO.verifyUserName}}</view>
                        </view>
                        <view class="writeOff_item flex_row_between_center">
                            <view class="title">核验时间</view>
                            <view class="content">{{detail.couponCheckMemberVO.verifyTime}}</view>
                        </view>
                        <view class="writeOff_item flex_row_between_start">
                            <view class="title">核验门店</view>
                            <view class="content">{{detail.couponCheckMemberVO.verifyStore}}</view>
                        </view>
                    </view>

                </view>
            </scroll-view>
        </view>
        <view class="no_data" v-if="loaded && !detail">
            <view class="img"></view>
            <text>暂无内容</text>
        </view>
        <view class="qrcode_popup flex_row_center_center" v-if="showQrcode" @click="hideQrcode">
            <qrcode :options="{ size: qrCodeObj1.size, code: qrCodeObj1.value }"/>
        </view>
    </view>
</template>
<script>

import qrcode from "@/common/components/qrcode/qrcode.vue";
import uniPopup from '@/common/components/uni-popup/uni-popup.vue'
import goodsHandler from '@/views/components/goods/handler';
import {isNotEmpty, isPC } from '@/utils/common.js'
export default {
    components: {
        qrcode,
        uniPopup
    },
    data() {
        return {
            radioSel:'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/icon_setp_sel3_red.svg',
            warningIcon:'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/icon_common_warning.svg',
            storeLogo:'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/icon_yhq_dianpu_nor.png',
            showRulesFlag:false, //是否展开使用规则
            scrollFlag:false, //页面是否滚动
            storeList:[], //店铺信息列表
            qrCodeObj:{ //二维码配置
                value:'',
                size:328
            },
            qrCodeObj1:{ //弹窗二维码配置
                value:'',
                size:440
            },
            useState:'1',
            fitfontSize:{
                'active':{19:'22rpx',20:'22rpx',21:'20rpx',22:'20rpx'},
                'big':{1:'56rpx',2:'56rpx',3:'56rpx',4:'56rpx',5:'52rpx',6:'48rpx',7:'40rpx',8:'36rpx',9:'32rpx',10:'28rpx',11:'24rpx'},
                'small':{1:'28rpx',2:'28rpx',3:'28rpx',4:'28rpx',5:'24rpx',6:'24rpx',7:'24rpx',8:'24rpx',9:'24rpx',10:'24rpx',11:'24rpx'}
            },
            detail:{},
            showPrice:false, //是否显示价格，主要是为了规避金额字号自适应时的变化过程被看见
            loaded:false, //数据是否加载完毕
            rules:'',
            isPC:true,
            timer:null,
            showQrcode:false
        };
    },
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
        formateNumber() {
            return (s) => {
                let str = ''
                if (isNotEmpty(s)) {
                    str = s.toString().replace(/[0-9a-zA-Z]{4}(?=.)/g, '$& ')
                } else {
                    str = ''
                }
                return str
            }
        }
    },
    watch: {
        
    },
    onPageScroll(e) {
        if (e.scrollTop > 0) {
            this.scrollFlag = true
        } else {
            this.scrollFlag = false
        }
    },
    mounted(){
        this.isPC = isPC()
        this.useState = this.$Route.query.useState
        this.getCouponDetail()
    },
    destroyed() {
        clearTimeout(this.timer)
    },
    methods: {
        tel(phone) {
            wx.makePhoneCall({
                phoneNumber: phone,
            success : function(){
                // console.log("拨打电话成功!")
            },
            fail: function(){
                // console.log("拨打电话失败！")
            }
            })
        },
        showMoreStore() {
            this.$Router.push({
                path: '/views/coupon/usableStore',
                query:{
                    storeId:this.detail?.storeId,
                    shopIds:this.detail?.shopIds,
                    useShopType:this.detail?.useShopType
                }
            })
        },
        showRules() {
            this.showRulesFlag = !this.showRulesFlag
        },
        enlargeQrcode() {
            this.showQrcode = true;
        },
        hideQrcode() {
            this.showQrcode = false;
        },
        getStoreList() {
            let param = {
                storeId:this.detail.storeId
            }
            if (this.detail.useShopType==0) {
                param.ids = this.detail.shopIds
            }
            goodsHandler.getConsumeStoreList(param).then(res => {
                if (res.state == 200) {
                    this.storeList = res?.data.list;
                    
                } else {
                    this.$api.msg(res.msg);
                }
            }).catch(() => { 
            })
        },
        getCouponDetail() {
            return new Promise(resolve => {
                let param = {
                    couponMemberId:this.$Route.query.couponMemberId
                }
                goodsHandler.getConsumDetail(param).then(async res => {
                    if (res.state == 200) {
                        this.detail = res?.data;
                        if (this.detail.description) {
                            this.rules = this.detail.description.replace(/\n/g,'\n\n').trim()
                        }
                        await this.getStoreList()
                        this.showPrice = true
                        this.qrCodeObj.value = this.detail?.couponCode;
                        this.qrCodeObj1.value = this.detail?.couponCode;
                        this.useState = this.detail?.useState;
                        if (this.useState == 1) {
                            this.timer = setTimeout(async() => {
                                resolve(await this.getCouponDetail())
                            }, 2000)
                        } else {
                            resolve()
                            try {
                                const pages = getCurrentPages(); //当前页面栈
                                if (pages.length > 1) {
                                    const beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
                                    beforePage.$vm.changeConsumneList(); //触发上个面中的方法 获取优惠券列表*getCouponList为上个页面的方法*
                                }
                            } catch (error) {
                            
                            }
                        }
                    
                    } else {
                        // this.$api.msg(res.msg);
                        this.timer = setTimeout(async() => {
                            resolve(await this.getCouponDetail())
                        }, 2000)
                    }
                    this.loaded = true
                }).catch(() => {
                    this.loaded = true
                    this.timer = setTimeout(async() => {
                        resolve(await this.getCouponDetail())
                    }, 2000)
                })
            })
            
        }
    }

}
</script>

<style lang="scss">
.consumption_detail_container {
    min-height: 100%;
    .no_data {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: calc((100vh - 176rpx) * 0.32 - 128rpx);
        .img {
            width: 256rpx;
            height: 256rpx;
            background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/empty/icon_defpage_zwnr.png') center no-repeat;
            background-size: 100% 100%;
        }
        text{
            font-size: 28rpx;
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
            color: $main-third-color;
        }
    }
}
.consumption_detail_box {
    height: 100vh;
    padding-top: 200rpx;
    overflow: scroll;
    background: linear-gradient(-45deg, #FC6106 0%, #FF985B 100%);
    &.gray {
        background: transparent;
    }
    .scroll_box {
        height: 100%;
    }
    .consumption_detail {
        padding: 0 34rpx 32rpx 30rpx;
    }
    .voucher_state {
        padding: 8rpx 0 34rpx;
        font-size: 48rpx;
        color: #222222;
        font-weight: bold;
        img {
            width: 48rpx;
            height: 48rpx;
        }
        text {
            padding-left: 12rpx;
            line-height: 66rpx;
        }
    }
    .voucher_info {
        border-radius: 20rpx;
        overflow: hidden;
        position: relative;
        
        .top_part {
            position: relative;
            z-index: 10;
            .voucher_info_item {
                position: relative;
                min-height: 172rpx;
                overflow: hidden;
                background: #FFF4EF;
                .left {
                    width: 202rpx;
                    height: 100%;
                    margin-top: 42rpx;
                    padding: 0 10rpx;
                    .coupon_pre_price {
                        height: 68rpx;
                        line-height: 68rpx;
                        font-size: 28rpx;
                        color: #FF711E;
                        .price_int {
                            font-size: 56rpx;
                        }
                        .price_decimal {
                            font-size: 32rpx;
                        }
                    }
                    .coupon_pre_active {
                        margin-top: 16rpx;
                        line-height: 24rpx;
                        font-size: 24rpx;
                        font-weight: 500;
                        color: #ff711e;
                        word-break: break-all;
                    }
                }
                .right {
                    width: calc(100% - 202rpx);
                    margin: 24rpx 0 22rpx 0;
                    color: #222222;
                    .name {
                        min-height: 72rpx; 
                        padding-right: 24rpx;
                        >view {
                            line-height: 36rpx;
                            font-size: 28rpx;
                            font-family: PingFang SC;
                            font-weight: bold;
                            color: #222222;
                            word-break: break-all;
                        }
                    }
                    .maxDeductionValue {
                        width: fit-content;
                        height: 32rpx;
                        margin:10rpx 0 0 0;
                        padding: 0 10rpx;
                        font-size: 20rpx;
                        color: #ff711e;
                        border: 1px solid #ff711e;
                        border-radius: 6rpx;
                    }
                    .date {
                        padding-top: 22rpx;
                        font-size: 22rpx;
                        line-height: 32rpx;
                        &.padding0 {
                            padding-top: 0;
                        }
                    }
                }
                .voucher_icon {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 124rpx;
                    height: 36rpx;
                    font-size: 20rpx;
                    font-weight: bold;
                    color: #EB5700;
                    background: #FFC3A5;
                    border-radius: 0px 0px 20rpx 0rpx;
                }
            }
            
        }
        .line_box {
            width: 100%;
            height: 36rpx;
            background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/coupon/bg_yhq_beijing.png') center/100% 100% no-repeat;
        }
        .voucher_codeImg {
            padding: 46rpx 0 14rpx;
            background: #fff;
            .tips {
                margin-top: 20rpx;
                font-size: 24rpx;
                line-height: 34rpx;
                color: #999999;
            }
        }
        .voucher_code {
            padding:26rpx 10rpx 52rpx 40rpx;
            font-size: 28rpx;
            background: #fff;
            color: #222222;
            font-weight: bold;
            .code {
                margin-top: 8rpx;
                font-size: 34rpx;
                line-height: 48rpx;
                &.invalidCode {
                    color: #999999;
                    text-decoration:  line-through;
                }
            }
        }
    }
    .store_info {
        margin-top: 24rpx;
        padding: 32rpx 0 6rpx 32rpx;
        border-radius: 20rpx;
        background: #fff;
        .applicable_store {
            padding-right: 32rpx;
            .title {
                font-size: 28rpx;
                .title_left {
                    width: 300rpx;
                    line-height:unset;
                    .flag {
                        width: fit-content;
                        height: 32rpx;
                        line-height: 32rpx;
                        margin-left: 20rpx;
                        padding: 0 12rpx;
                        font-size: 20rpx;
                        font-weight: bold;
                        color: #F30300;
                        border: 1px solid #F30300;
                        border-radius: 6rpx;
                        &.allStore {
                            color: #06C7C3;
                            border: 1px solid #06C7C3;
                        }
                    }
                }
                .title_right {
                    padding-right: 32rpx;
                    line-height: 40rpx;
                    font-weight: bold;
                    color: #222222;
                    background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_rightarrow_gray.svg') right center/24rpx 24rpx no-repeat;
                }
            }
            .store_list {
                margin-top: 24rpx;
                .store_item {
                    width: 100%;
                    margin-top: 24rpx;
                    padding: 20rpx;
                    background: #eff2f5;
                    border-radius: 12rpx;
                    .store_logo {
                        width: 128rpx;
                        height: 128rpx;
                        border-radius: 16rpx;
                        overflow: hidden;
                    }
                    .store_info_detail {
                        width: calc(100% - 128rpx);
                        padding-left: 24rpx;
                        .store_name {
                            min-height: 36rpx;
                            line-height: 36rpx;
                            font-size: 28rpx;
                            font-weight: bold;
                            color: #222222;
                            // text-overflow: -o-ellipsis-lastline;
                            // overflow: hidden;
                            // text-overflow: ellipsis;
                            // display: -webkit-box;
                            // -webkit-line-clamp: 2;
                            // line-clamp: 2;
                            // -webkit-box-orient: vertical;
                            word-break: break-all;
                        }
                        .store_address {
                            margin-top: 20rpx;
                            padding-left: 30rpx;
                            min-height: 36rpx;
                            line-height: 34rpx;
                            font-size: 24rpx;
                            color: #666666;
                            word-break: break-all;
                            background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_weizhi.svg') left 6rpx/24rpx 24rpx no-repeat;
                        }
                        .store_phone {
                            margin-top: 4rpx;
                            padding-left: 30rpx;
                            font-size: 24rpx;
                            line-height: 34rpx;
                            word-break: break-all;
                            color: #FF711E;
                            background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_phone.svg') left 6rpx/24rpx 24rpx no-repeat;
                            a {
                                text-decoration:none;
                                color: #FF711E;
                            }
                        }
                    }
                }
            }
        }
        .applicable_time {
            margin-top: 22rpx;
            padding: 20rpx 32rpx 20rpx 0;
            border-bottom: 2rpx solid #e8e8e8;
            border-top: 2rpx solid #e8e8e8;
            &>view:nth-child(2) {
                flex: 1;
                font-size: 28rpx;
                font-weight: bold;
                color: #222222;
                // word-break: break-all;
                text-align: right;
            }
        }
        .use_rules {
            padding-right: 32rpx;
            .title {
                padding: 30rpx 0 32rpx;
                .title_left {
                    line-height: 34rpx;
                }
                >view:nth-child(2) {
                    width: 50rpx;
                    height: 24rpx;
                    background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_uparrow1.svg') right center/24rpx 24rpx no-repeat;
                    &.down_arrow {
                        background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_downarrow1.svg') right center/24rpx 24rpx no-repeat;
                    }
                }
            }
            .rules_content {
                padding-bottom: 34rpx;
                line-height: 34rpx;
                font-size: 24rpx;
                color: #666666;
            }
        }
        .title_left {
            width: 200rpx;
            font-size: 28rpx;
            line-height: 40rpx;
            color: #666666;
        }
    }
    .writeOff_info {
        margin-top: 24rpx;
        padding:0 0 12rpx 32rpx;
        border-radius: 20rpx;
        background: #fff;
        .writeOff_item {
            padding: 28rpx 32rpx 28rpx 0;
            border-bottom: 1px solid #e8e8e8;
            font-size: 28rpx;
            .title {
                width: 150rpx;
                line-height: 40rpx;
                color: #666666;
            }
            .content {
                flex: 1;
                text-align: right;
                font-weight: bold;
                color: #222222;
            }
        }
        &>view:last-child {
            border: none;
        }
    }
    
}
.qrcode_popup {
    height: 100%;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 999;
    background: #fff;
}
</style>