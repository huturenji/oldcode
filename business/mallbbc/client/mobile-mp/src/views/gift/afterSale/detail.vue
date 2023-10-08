<!-- 退款详情页面 -->
<template>
    <scroll-view class="container" scroll-y v-if="allData && isShow">

        <view class="main_content">
            <!--
                退货退款状态：100-买家申请仅退款；101-买家申请退货退款；102-买家退货给商家；200-商家同意退款申请；201-商家同意退货退款申请；202-商家拒绝退款申请(退款关闭/拒收关闭)；203-商家确认收货；300-平台确认退款(已完成)
                afsType 售后服务端类型，1-退货退款单（需关联处理退款金额），2-换货单，3-仅退款单
            -->

            <!-- 退款状态 start -->
            <view class="order_state">
                <!-- 等待商家处理 待发货 - 退款中 start-->
                <block v-if="allData.state == 101">
                    <view class="state_title">
                        <image :src="refundProgressImage" mode=""></image>
                        <text>{{allData.stateValue}}</text>
                    </view>
                    <view class="state_time" v-if="deadline"> 还剩 {{deadline}} 自动确认 </view>
                </block>
                <!-- 等待商家处理 待发货 - 退款中 end-->

                <!-- 等待商家收货  start-->
                <block v-if="allData.state == 102">
                    <view class="state_title">
                        <image :src="refundProgressImage" mode=""></image>
                        <text>{{allData.stateValue}}</text>
                    </view>
                    <view class="state_time" v-if="deadline"> 还剩 {{deadline}} 自动确认 </view>
                </block>
                <!-- 等待商家收货  end-->

                <!-- 商家同意退款申请  等待平台审核退款 start-->
                <block v-if="allData.state == 200">
                    <view class="state_title">
                        <image :src="refundProgressImage" mode=""></image>
                        <text>{{allData.stateValue}}</text>
                    </view>
                </block>
                <!-- 商家同意退款申请  end-->

                <!-- 卖家同意申请  start   -->
                <block v-if="allData.state == 201">
                    <view class="state_title">
                        <image :src="refundProgressImage" mode=""></image>
                        <text>{{allData.stateValue}}{{allData.pickWareMethod==4? '请等待上门取件': '请退货并填写物流信息'}} </text>
                    </view>
                    <view class="state_time" v-if="deadline"> 还剩 {{deadline}} 自动取消退款申请 </view>
                </block>
                <!-- 卖家同意申请  end-->

                <!-- 卖家拒绝申请  start-->
                <block v-if="allData.state == 202">
                    <view class="state_title">
                        <image src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/close_screen.png" mode=""></image>
                        <text>{{allData.stateValue}}</text>
                    </view>
                    <view class="state_time refund_reason" v-if="allData.refuseReason">{{allData.refuseReason}}</view>
                </block>
                <!-- 卖家拒绝申请  end-->

                <!-- 商家确认收货 等待平台同意 start-->
                <block v-if="allData.state == 203">
                    <view class="state_title">
                        <image :src="refundProgressImage" mode=""></image>
                        <text>{{allData.stateValue}}</text>
                    </view>
                </block>
                <!-- 商家确认收货  end-->

                <!-- 商家同意退款申请  等待平台审核退款 start-->
                <block v-if="allData.state == 240">
                    <view class="state_title">
                        <image :src="refundProgressImage" mode=""></image>
                        <text>{{allData.stateValue}}</text>
                    </view>
                </block>
                <!-- 商家同意退款申请  end-->

                <!-- 商家同意退款申请  等待用户确认 start-->
                <block v-if="allData.state == 270">
                    <view class="state_title">
                        <image :src="refundProgressImage" mode=""></image>
                        <text>{{allData.stateValue}}</text>
                    </view>
                </block>
                <!-- 商家同意退款申请  end-->

                <!-- 商家同意退款申请  等待用户确认 start-->
                <block v-if="allData.state == 280">
                    <view class="state_title">
                        <image :src="refundProgressImage" mode=""></image>
                        <text>{{allData.stateValue}}</text>
                    </view>
                </block>
                <!-- 商家同意退款申请  end-->

                <!-- 退款退货  退款成功 -->
                <block v-if="allData.state == 300">
                    <view class="state_title">
                        <image :src="imgUrl+'common/icon/dagou.png'" mode=""></image>
                        <text>{{allData.stateValue}}</text>
                    </view>
                    <view class="state_time" v-if="allData.completeTime">{{allData.completeTime}}</view>
                </block>
            </view>
            <!-- 退款状态 end -->

            <!-- 退货地址 及 换货地址 -->
            <view class="refund_address"
                v-if="allData.afsAddress && allData.afsAddress != 'null' && (allData.afsType == 1 || allData.afsType == 2)">
                <image :src="imgUrl+'common/icon/map.png'" mode="" class="refund_address_map"></image>
                <view class="refund_address_des">
                    <text class="refund_address_title">{{sourceType == '' ? '退' : '换'}} 货地址 </text>
                    <view class="refund_address_con">
                        <text>{{allData.platformContactPerson}}</text>
                        <text>{{allData.platformContactPhone}}</text>
                    </view>
                    <view class="refund_address_info">{{allData.afsAddress}}</view>
                </view>
            </view>

            <!-- 退款 退款金额 start -->
            <view class="refund_amount" v-if="allData.afsType == 1">
                <view class="refund_amount_left"> 退款金额 </view>
                <view class="refund_amout_right">
                    <text class="sum"> 总计 :</text>
                    <view class="refund_amout_price">
                        <text class="unit">¥</text>
                        <text class="price_int">{{getPartNumber(allData.returnMoneyAmount,'int')}} </text>
                        <text class="price_decimal">{{getPartNumber(allData.returnMoneyAmount,'decimal')}} </text>
                    </view>
                </view>
            </view>
            <!-- 退款 退款金额 end -->


            <!-- 换货 换货数量 start -->
            <view class="refund_amount" v-if="allData.afsType == 2">
                <view class="refund_amount_left"> 换货数量 </view>
                <view class="refund_amout_right">
                    <view class="refund_amout_price">
                        <text>{{allData.afsNum}}</text>
                    </view>
                </view>
            </view>
            <!-- 换货 换货数量 end -->

            <!-- 维修 维修数量 start -->
            <view class="refund_amount" v-if="allData.afsType == 4">
                <view class="refund_amount_left"> 维修数量 </view>
                <view class="refund_amout_right">
                    <view class="refund_amout_price">
                        <text>{{allData.afsNum}}</text>
                    </view>
                </view>
            </view>
            <!-- 维修 维修数量 end -->

            <view class="speed_det" @click="progressDetails">
                <text> 进度详情 </text>
                <image :src="rightArrowGray" mode=""></image>
            </view>

            <!-- 平台审核 及审核备注 start -->
            <view class="platform_audit" v-if="allData.state == 200 || allData.state == 203 || allData.state == 300">
                <view class="platform_audit_status">
                    <text> 平台审核 </text>
                    <text>{{allData.platformAudit ? allData.platformAudit : '--'}}</text>
                </view>
                <view class="platform_audit_remark">
                    <text> 审核备注 </text>
                    <text>{{allData.platformRemark ? allData.platformRemark : '--'}}</text>
                </view>
            </view>
            <!-- 平台审核 及审核备注 end -->

            <!-- 填写物流单号 start 201商家审核通过，才能发货-->
            <view class="logistics_bill" v-if="allData.showExpressEle && allData.state == 201">
                <text @click="goLogisticsFill"> 填写物流单号 >></text>
            </view>
            <!-- 填写物流单号 end -->

            <!-- 填写物流单号 start 201商家审核通过，才能发货-->
            <view class="logistics_bill" v-if="allData.state == 280">
                <text @click="userConfirm"> 用户确认 </text>
            </view>
            <!-- 填写物流单号 end -->

            <!-- 退款失败，平台拒绝审核，重新申请 202 start -->
            <view class="logistics_bill" v-if="allData.showReSubmitBtn">
                <text @click="goApplyRefund" class="re_apply_refund"> 重新申请 </text>
            </view>
            <!-- 退款失败，平台拒绝审核，重新申请 start -->

            <!-- 等待商家收货并退款 -->
            <view class="refund_logisticsBill" @click="lookLogistics(1)"
                v-if="allData.buyerExpressName && (allData.state == 102 || allData.state == 203 || allData.state == 300)">
                <text> 退货物流 </text>
                <image :src="rightArrowGray" mode=""></image>
            </view>

            <!-- 维修返件物流 -->
            <view class="refund_logisticsBill" @click="lookLogistics(2)"
                v-if="allData.storeExpressName && (allData.state == 280 || allData.state == 300)">
                <text> 商家返件 </text>
                <image :src="rightArrowGray" mode=""></image>
            </view>

            <!-- 订单内商品信息 start -->
            <view class="order_goods">
                <view class="order_goods_title"> {{afsText}}信息 </view>
                <view class="goods_list">
                    <view class="goods_pre">
                        <view class="goods_image">
                            <!-- <coverImage :src="allData.mainImage" width="200" height="200" class="image"></coverImage> -->
                            <view class="image" :style="'background-image:url('+allData.mainImage+')'"></view>
                        </view>
                        <view class="goods_pre_right">
                            <view class="goods_des">
                                <view class="goods_name">{{allData.skuName}}</view>
                                <view class="goods_spec" v-if="allData.specValues">{{allData.specValues}}</view>
                            </view>
                            <view class="goods_prices fontScaleIgnore">
                                <view class="goods_price">
                                    <text class="unit">¥</text>
                                    <text class="price_int">{{getPartNumber(allData.productPrice,'int')}} </text>
                                    <text class="price_decimal">{{getPartNumber(allData.productPrice,'decimal')}}
                                    </text>
                                </view>
                                <view class="goods_num">*{{allData.afsNum}}</view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <!-- 订单内商品信息 end -->

            <!-- 退款信息  start-->
            <view class="order_des">
                <view class="order_des_pre">
                    <text> 售后类型 ：</text>
                    <text>{{ afsText }}</text>
                </view>
                <view class="order_des_pre">
                    <text> {{afsText}}原因 ：</text>
                    <text>{{allData.applyReasonContent}}</text>
                </view>
                <view class="order_des_pre">
                    <text style="white-space: nowrap;"> {{afsText}}说明 ：</text>
                    <text>{{allData.afsDescription==''?'--':allData.afsDescription}}</text>
                </view>
                <view class="refund_voucher" v-if="applyImageList && applyImageList.length > 0">
                    <text> {{afsText}}凭证 ：</text>
                    <view class="refund_img_wrap">
                        <view class="refund_vouhcer_list">
                            <view class="refund_voucher_pre" v-for="(item, index) in applyImageList" :key="index">
                                <image :src="item" mode="aspectFit" @click="preRefundVoucher(index)"></image>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="order_des_pre" v-if="allData.afsType==1">
                    <text> 退款金额 ：</text>
                    <text>￥{{allData.returnMoneyAmount}}</text>
                </view>
                <view class="order_des_pre">
                    <text> 申请时间 ：</text>
                    <text>{{allData.applyTime}}</text>
                </view>
                <view class="order_des_pre">
                    <text> {{afsText}}编号 ：</text>
                    <text>{{allData.afsSn}}</text>
                </view>
                <!-- 4 上门取件  7 客户送货 40 客户发货 -->
                <view class="order_des_pre">
                    <text>{{'商品退回'}}：</text>
                    <text>{{`${allData.pickWareMethod==4?'上门取件':'客户邮寄'}`}}</text>
                </view>
                <view class="order_des_pre" v-if='allData.pickWareMethod==4 && allData.pickWareAddress'>
                    <text>{{'取件地址'}}：</text>
                    <text>
                        <text>{{`${allData.pickWareAddress.addressAll}${allData.pickWareAddress.detailAddress}`}}</text>
                        <text>{{`${allData.pickWareAddress.memberName} ${allData.pickWareAddress.telMobile}`}}</text>
                    </text>
                </view>
                <view class="order_des_pre" v-if='allData.pickWareMethod==40'>
                    <text>{{'退回地址'}}：</text>
                    <text>{{`${allData.storeAddress?allData.storeAddress:''}
                    ${allData.storeContactName?allData.storeContactName:''}
                    ${allData.storeTelphone?allData.storeTelphone:''}`}}</text>
                </view>
                <view class="order_des_pre"
                    v-if="(allData.afsType==2||allData.afsType==4) && allData.receiveWareAddress">
                    <text>{{'收货地址'}}：</text>
                    <text>{{`${allData.receiveWareAddress.addressAll}${allData.receiveWareAddress.detailAddress}
                    ${allData.receiveWareAddress.memberName} ${allData.receiveWareAddress.telMobile}`}}</text>
                </view>
            </view>
            <!-- 退款信息  end-->

            <view v-if="allData.showCancelBtn ">
                <view class="user_cancel">
                    <text @click="userCancel"> 取消申请 </text>
                </view>
            </view>

            <uni-popup ref="popup" type="dialog">
                <uni-popup-dialog type="input" title="提示" :content="`确定取消${afsType==1?'退货':afsType==2?'换货':'维修'}申请`"
                    :duration="2000" @confirm="subCancel">
                </uni-popup-dialog>
            </uni-popup>

        </view>

    </scroll-view>

</template>
<script>
import { getPartNumber, setStorageSync } from '@/utils/common';
import { detail, replacementDetail, confirm, cancel } from "@/views/components/aftersale/handler";
import {afsCheck} from "@/views/components/aftersale/handler";

import uniPopup from '@/common/components/uni-popup/uni-popup.vue';
import uniPopupDialog from '@/common/components/uni-popup/uni-popup-dialog.vue';

export default {
    components: {
        uniPopup,
        uniPopupDialog
    },
    data() {
        return {
            rightArrowGray: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_rightarrow_gray.svg',
            refundProgressImage: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/order/refund_progress.png',
            afsType: 2,
            getPartNumber,
             
            coverTransform: 'translateY(0px)',
            coverTransition: '0s',
            moving: false,
            afsSn: '', //退款单号
            allData: {}, //订单详细信息
            orderProductList: [], //订单商品列表
            cancelList: [], //取消原因列表
            current: '0', //取消原因当前点击的是第0项
            reasonId: -1, //取消原因当前点击的原因id
            sourceType: '', //从订单详情页面进入， 来源是换货 :'exchange'     或退货 :''
            deadline: '', //截止日期(根据售后状态，待卖家审核--审核截止时间；待买家发货--发货截止时间；待商家收货--收货退款截止时间)
            isShow: false, //数据是否已完全加载
            orderState: '', //订单状态来源
            applyImageList: [], //退款凭证
            returnLogList: [], //退款日志列表
            secInterval: '',
            enumType: {
                pickUp: 4, // 上门取件    
                mail: 40, // 自行邮寄
                send: 7 // 客户送货,这个不常用
            }
        }
    },
    async mounted() {
        //退款单号
        this.afsSn = this.$Route.query.afsSn;
        this.sourceType = this.$Route.query.sourceType;
        this.afsType = this.$Route.query.afsType;
        uni.setNavigationBarTitle({
            title: this.afsType == 1 ? '退货详情' : this.afsType == 2 ? '换货详情' : this.afsType == 4 ? '维修详情' : ''
        });
        this.getOrderDetail();
    },
    computed: {
        afsText() {
            let text = ''
            if (this.afsType) {
                text = this.afsType == 1
                    ? '退货'
                    :
                    this.afsType == 2
                        ? '换货'
                        :
                        this.afsType == 4 ? '维修' : ''
            }
            return text
        }
    },
    methods: {
        //获取订单详情信息
        getOrderDetail() {
            let that = this;
            let param = {};
            param.afsSn = that.afsSn;

            let func = that.sourceType == 'exchange' ? replacementDetail : detail;

            func(param).then(res => {
                if (res.state == 200) {
                    let result = res.data;
                    that.orderProductList = result.orderProductList;
                    that.applyImageList = result.applyImageList;
                    that.returnLogList = result.returnLogList;
                    that.allData = result || {};
                    that.isShow = true;
                    that.countup();
                } else {
                    uni.showToast({
                        title: res.msg,
                        icon: 'none'
                    })
                }
            }).catch(() => {
                //异常处理
            })
        },
        //计算时间差
        countup() {
            let that = this;
            let endTime = that.allData.deadline; //结束时间
            let endStrs = endTime.split(" ");
            let endTimeStamp = that.strtotime(endStrs[0], endStrs[1]); //结束时间时间戳(毫秒)
            that.countDown(endTimeStamp);
        },
        //倒计时
        countDown(endTimeStamp) {
            let that = this;
            that.secInterval = setInterval(() => {
                let currentTimestamp = new Date().getTime(); //当前时间时间戳 （毫秒数）
                let diffrentTimeStamp = endTimeStamp - currentTimestamp; //相差时间 毫秒数
                if (diffrentTimeStamp == 0) {
                    that.deadline = '';
                    clearInterval(that.secInterval);
                    that.getOrderDetail();
                } else if (diffrentTimeStamp > 0) {
                    //将时间戳转换为天，时，分，秒 并倒计时
                    that.deadline = that.formatDuring(diffrentTimeStamp)
                } else {
                    that.deadline = ''
                }
            }, 1000)
        },
        //将标准格式（2014-08-02 11:23:12）转化为时间戳  函数   参数：time_str为（2014-08-02）   fix_time为（11:23:12）
        strtotime(time_str, fix_time) {
            let time = (new Date()).getTime();
            if (time_str) {
                let str = time_str.split('-');
                if (3 === str.length) {
                    let year = str[0] - 0;
                    let month = str[1] - 0 - 1;
                    var day = str[2] - 0;
                    if (fix_time) {
                        let fix = fix_time.split(':');
                        if (3 === fix.length) {
                            let hour = fix[0] - 0;
                            let minute = fix[1] - 0;
                            time = (new Date(year, month, day, hour, minute)).getTime();
                        }
                    } else {
                        time = (new Date(year, month, day)).getTime();
                    }
                }
            }
            return time;
        },
        //将时间戳转换为时分秒
        formatDuring(mss) {
            let days = parseInt(mss / (1000 * 60 * 60 * 24));
            let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
            // let seconds = ((mss % (1000 * 60)) / 1000).toFixed(0);
            if (days > 0) {
                return days + " 天 " + hours + " 小时 " + minutes + " 分钟 ";
            } else if (hours > 0) {
                return hours + " 小时 " + minutes + " 分钟 ";
            } else if (minutes > 1) {
                return minutes + " 分钟 ";
            } //如果剩 1分钟之内就不让显示
            return ''

        },
        //去填写物流单号页面
        goLogisticsFill() {
            this.$Router.push({ path: '/views/gift/logistics/fill', query: { afsSn: this.afsSn } })
        },
        //去查看物流页面
        lookLogistics(traceType) {
            this.$Router.push({ path: '/views/gift/logistics/detail', query: { afsSn: this.allData.afsSn, type: 'afs', traceType } })
        },
        //去进度详情页面
        progressDetails() {
            this.$Router.push({ path: '/views/gift/afterSale/progress', query: { afsSn: this.afsSn } })
        },
        //退款失败，重新申请
        goApplyRefund() {
            this.$Router.push({
                path: '/views/gift/afterSale/index', query:
                {
                    orderSn: this.allData.orderSn, 
                    orderProductId: this.allData.orderProductId, 
                    sourceType: 'refundDetail', 
                    orderListLen: 1,
                    oldAfsOrderSn: this.afsSn
                }
            });

        },
        // 退款凭证图片预览
        preRefundVoucher(index) {
            uni.previewImage({
                current: this.applyImageList[index],
                urls: this.applyImageList
            })
        },
        // 用户确认
        userConfirm() {
            let param = {};
            param.afsSn = this.allData.afsSn;
            confirm(param).then(res => {
                if (res.state == 200) {
                    this.getOrderDetail();
                } else {
                    uni.showToast({
                        title: res.msg,
                        icon: 'none'
                    })
                }
            }).catch(() => {
                //
            })
        },
        // 打开用户取消弹窗
        userCancel() {
            this.$refs.popup.open()
        },
        // 用户取消提交
        subCancel() {
            this.$refs.popup.close();
            let param = {};
            param.afsSn = this.allData.afsSn;
            cancel(param).then(res => {
                if (res.state == 200) {
                    this.getOrderDetail();
                    this.setAfsCheckToLocalStorage(this.allData.orderSn)
                } else {
                    uni.showToast({
                        title: res.msg,
                        icon: 'none'
                    })
                }
            }).catch(() => {
                //
            })
        },
        setAfsCheckToLocalStorage(orderSn){
            afsCheck({orderSn}).then(res => {
                console.log('取消申请', orderSn, res.data);
                setStorageSync('afsCheckCache', {orderSn, data: res.data});
            })
        }
    }
}
</script>
<style lang='scss'>
.container {
    display: flex;
    flex: 1;
    min-height: 100vh;
    position: relative;
    background-color: #FFFFFF;
    width: 750rpx;
    margin: 0 auto;

    .main_content {
        width: 100%;

        .order_state {
            background: #F30300;
            height: 340rpx;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;

            .state_title {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                padding: 0 10rpx;

                image {
                    width: 45rpx;
                    height: 45rpx;
                    margin-right: 20rpx;
                }

                text {
                    font-size: 38rpx;
                    font-family: PingFang SC;
                    font-weight: bold;
                    color: #FFFFFF;
                    line-height: 110%;
                    word-break: break-all;
                }
            }

            .await {
                margin-bottom: 139rpx;
            }

            .state_time {
                font-size: 24rpx;
                font-family: PingFang SC;
                color: #FFFFFF;
                line-height: 32rpx;
                margin: 22rpx 0 32rpx;
            }

            .refund_reason {
                width: 640rpx;
                text-overflow: -o-ellipsis-lastline;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                line-clamp: 2;
                -webkit-box-orient: vertical;
                margin-bottom: 0;
                text-align: center;
            }
        }

        .refund_address {
            display: flex;
            align-items: flex-end;
            border-bottom: 20rpx solid #F5F5F5;
            padding: 37rpx 0 37rpx 40rpx;
            box-sizing: border-box;

            .refund_address_map {
                width: 34rpx;
                height: 34rpx;
                margin-right: 30rpx;
            }

            .refund_address_des {
                display: flex;
                flex-direction: column;

                .refund_address_title {
                    font-size: 28rpx;
                    font-family: PingFang SC;
                    font-weight: 500;
                    color: #666666;
                    line-height: 42rpx;
                }

                .refund_address_con {
                    display: flex;
                    align-items: center;
                    font-size: 30rpx;
                    font-family: PingFang SC;
                    font-weight: 500;
                    color: #333333;
                    line-height: 45rpx;
                    margin: 38rpx 0 29rpx;

                    text:nth-child(2) {
                        color: #666666;
                        margin-left: 40rpx;
                    }
                }

                .refund_address_info {
                    font-size: 30rpx;
                    font-family: PingFang SC;
                    font-weight: 500;
                    color: #333333;
                    line-height: 42rpx;
                }
            }
        }

        .refund_amount {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 100rpx;
            margin-left: 20rpx;
            padding-right: 20rpx;
            box-sizing: border-box;
            border-bottom: 1rpx solid #E6E6E6;

            .refund_amount_left {
                font-size: 28rpx;
                font-family: PingFang SC;
                font-weight: 500;
                color: #343434;
                line-height: 45rpx;
            }

            .refund_amout_right {
                display: flex;
                align-items: center;

                .sum {
                    font-size: 28rpx;
                    font-family: PingFang SC;
                    font-weight: 400;
                    color: #949494;
                    line-height: 45rpx;
                }

                .refund_amout_price {
                    font-size: 24rpx;
                    font-family: PingFang SC;
                    font-weight: 500;
                    color: #FC1C1C;
                    /* line-height: 45rpx; */
                    display: inline-block;

                    text:nth-child(2) {
                        font-size: 26rpx;
                    }
                }
            }
        }

        .speed_det {
            display: flex;
            align-items: center;
            width: 100%;
            height: 100rpx;
            justify-content: space-between;
            padding: 0 20rpx;
            box-sizing: border-box;

            text {
                font-size: 28rpx;
                font-family: PingFang SC;
                font-weight: 500;
                color: #343434;
                line-height: 45rpx;
            }

            image {
                width: 24rpx;
                height: 24rpx;
            }
        }

        .platform_audit {
            border-top: 20rpx solid #F5F5F5;

            .platform_audit_status {
                display: flex;
                justify-content: space-between;
                padding: 0 20rpx;
                height: 100rpx;
                align-items: center;

                text {
                    font-size: 28rpx;
                    font-family: PingFang SC;
                    font-weight: 500;
                    color: #343434;
                    line-height: 45rpx;
                }
            }

            .platform_audit_remark {
                display: flex;
                justify-content: space-between;
                padding-right: 20rpx;
                padding-top: 20rpx;
                padding-bottom: 20rpx;
                margin-left: 20rpx;
                align-items: flex-start;
                border-top: 1rpx solid #E6E6E6;

                text {
                    font-size: 28rpx;
                    font-family: PingFang SC;
                    font-weight: 500;
                    color: #343434;
                    line-height: 45rpx;
                }

                text:nth-child(2) {
                    width: 560rpx;

                    word-break: break-all;
                    text-align: right;
                }
            }
        }

        .logistics_bill {
            padding: 30rpx 20rpx 30rpx 0;
            box-sizing: border-box;
            display: flex;
            justify-content: flex-end;
            margin-left: 20rpx;
            border-top: 1rpx solid #E6E6E6;

            text {
                height: 68rpx;
                padding: 0 26rpx;
                background: #FFFFFF;
                border: 1rpx solid #FC1C1C;
                font-size: 32rpx;
                font-family: PingFang SC;
                font-weight: 500;
                color: #F40903;
                line-height: 68rpx;
                text-align: center;
                border-radius: 34rpx;
            }

            .re_apply_refund {
                height: 60rpx;
                background: #FFFFFF;
                border: 1rpx solid #FC1C1C;
                border-radius: 30rpx;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }

        .refund_logisticsBill {
            height: 100rpx;
            padding: 0 20rpx;
            box-sizing: border-box;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 20rpx solid #F5F5F5;

            text {
                font-size: 28rpx;
                font-family: PingFang SC;
                font-weight: 500;
                color: #343434;
                line-height: 45rpx;
            }

            image {
                width: 14rpx;
                height: 24rpx;
            }
        }

        .order_goods {
            border-top: 20rpx solid #F5F5F5;

            .order_goods_title {
                font-size: 30rpx;
                font-family: PingFang SC;
                font-weight: 500;
                color: #343434;
                line-height: 74rpx;
                padding-left: 20rpx;
                box-sizing: border-box;
            }

            .goods_list {
                padding-top: 20rpx;
                border-bottom: 1rpx dashed #F2F2F2;

                .goods_pre {
                    display: flex;
                    padding: 0 20rpx;
                    box-sizing: border-box;
                    margin-bottom: 22rpx;

                    .goods_image {
                        width: 200rpx;
                        height: 200rpx;
                        background: #F3F3F3;
                        border-radius: 14px;

                        .image {
                            background-position: center center;
                            background-repeat: no-repeat;
                            background-size: cover;
                            width: 200rpx;
                            height: 200rpx;
                            border-radius: 14rpx;
                        }
                    }

                    .goods_pre_right {
                        display: flex;
                        justify-content: space-between;
                        width: 585rpx;

                        .goods_des {
                            margin-left: 25rpx;
                            padding-top: 8rpx;
                            box-sizing: border-box;

                            .goods_name {
                                width: 340rpx;
                                font-size: 28rpx;
                                font-family: PingFang SC;
                                font-weight: 500;
                                color: #343434;
                                line-height: 39rpx;
                                text-overflow: -o-ellipsis-lastline;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                display: -webkit-box;
                                -webkit-line-clamp: 2;
                                line-clamp: 2;
                                -webkit-box-orient: vertical;
                                height: 40%;
                                word-break: break-all;
                            }

                            .goods_spec {
                                font-size: 24rpx;
                                font-family: PingFang SC;
                                font-weight: 400;
                                color: #949494;
                                line-height: 30rpx;
                                margin-top: 20rpx;
                            }
                        }

                        .goods_prices .goods_prices.fontScaleIgnore {
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: flex-end;

                            .goods_price {
                                text {
                                    display: inline-block;
                                    font-family: PingFang SC;
                                    font-weight: 500;
                                    color: #343434;
                                    line-height: 30rpx;
                                }

                                .unit {
                                    font-size: 24rpx;
                                }

                                .price_int {
                                    font-size: 32rpx;
                                }

                                .price_decimal {
                                    font-size: 24rpx;
                                }
                            }

                            .goods_num {
                                font-size: 24rpx;
                                font-family: PingFang SC;
                                font-weight: 500;
                                color: #2D2D2D;
                                line-height: 30rpx;
                            }

                            .refund_btn {
                                padding: 12rpx 15rpx;
                                box-sizing: border-box;
                                border: 1rpx solid #2D2D2D;
                                border-radius: 25rpx;
                                font-size: 26rpx;
                                line-height: 26rpx;
                                font-family: PingFang SC;
                                font-weight: 400;
                                color: #333333;
                                margin-top: 22rpx;
                            }
                        }
                    }
                }
            }
        }

        .order_des {
            box-sizing: border-box;
            margin-top: 30rpx;
            padding-bottom: 30rpx;

            .order_des_pre {
                font-size: 26rpx;
                font-family: PingFang SC;
                font-weight: 500;
                color: #9A9A9A;
                line-height: 28rpx;
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 30rpx;
                padding: 0 20rpx;
                box-sizing: border-box;

                // white-space: nowrap;
                text {
                    display: block;
                }

                text:nth-child(2) {
                    flex: 1;
                    line-height: 36rpx;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    word-break: break-all;
                }

            }

            .refund_voucher {
                display: flex;
                margin-bottom: 30rpx;
                padding-left: 20rpx;

                text {
                    font-size: 26rpx;
                    font-family: PingFang SC;
                    font-weight: 500;
                    color: #9A9A9A;
                    line-height: 24rpx;
                    display: flex;
                    margin-bottom: 30rpx;
                }

                .refund_img_wrap {
                    max-width: 600rpx;
                    margin-right: 20rpx;
                }

                .refund_vouhcer_list {
                    max-width: 580rpx;
                    padding-right: 20rpx;
                    box-sizing: border-box;
                    white-space: pre-wrap;
                    overflow-x: scroll;

                    .refund_voucher_pre {
                        display: inline-block;
                        width: 156rpx;
                        height: 156rpx;
                        margin-right: 10rpx;

                        image {
                            width: 156rpx;
                            height: 156rpx;
                        }
                    }
                }
            }
        }

        .share_btn {
            width: 100%;
            height: 100rpx;
            background: #FFFFFF;
            border-top: 1rpx solid #EDEDED;
            display: flex;
            align-items: center;
            padding: 0 118rpx;
            box-sizing: border-box;
            justify-content: space-between;

            .share_btn_pre {
                display: flex;
                align-items: center;

                image {
                    width: 28rpx;
                    height: 28rpx;
                    margin-right: 9rpx;
                }

                image:nth-of-type(2) {
                    width: 24rpx;
                    height: 29rpx;
                }

                text {
                    font-size: 26rpx;
                    font-family: PingFang SC;
                    font-weight: 500;
                    color: #333333;
                    line-height: 24rpx;
                }
            }
        }

        .user_cancel {
            padding-bottom: 40rpx;
            box-sizing: border-box;
            display: flex;
            justify-content: center;

            text {
                width: 260rpx;
                height: 56rpx;
                background: #FFFFFF;
                border: 2rpx solid #FC1C1C;
                font-size: 28rpx;
                font-family: PingFang SC;
                font-weight: 500;
                color: #F40903;
                line-height: 56rpx;
                text-align: center;
                border-radius: 28rpx;
            }
        }
    }
}
</style>
