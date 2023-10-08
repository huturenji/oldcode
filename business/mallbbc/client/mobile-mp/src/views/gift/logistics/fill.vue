<!-- 填写物流单号页面 -->
<template>
    <view class="select_service">
        <view class="order_goods">
            <view class="goods_list">
                <view class="goods_pre">
                    <view class="goods_image">
                        <image :src="allData.mainImage" mode="aspectFit"></image>
                    </view>
                    <view class="goods_pre_right">
                        <view class="goods_des">
                            <view class="goods_name">{{allData.skuName}}</view>
                            <view class="goods_spec" v-if="allData.specValues">{{allData.specValues}}</view>
                        </view>
                        <view class="goods_prices">
                            <view class="goods_price">
                                <text class="unit">¥</text>
                                <text class="price_int">{{allData.productShowPrice?
                                getPartNumber(allData.productShowPrice,'int'):''}}</text>
                                <text class="price_decimal">{{allData.productShowPrice?
                                getPartNumber(allData.productShowPrice,'decimal'):''}}</text>
                            </view>
                            <view class="goods_num">*{{allData.afsNum}}</view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view class="logistics_des">
            <view class="logistics_pre">
                <view class="logistics_pre_left">
                    <text>*</text>
                    <text>物流单号：</text>
                </view>
                <view class="logistics_pre_right">
                    <input type="text" v-model="logisticsBillNo" placeholder="请填写物流单号" maxlength="20" />
                </view>
            </view>
            <view class="logistics_pre">
                <view class="logistics_pre_left">
                    <text>*</text>
                    <text>物流公司：</text>
                </view>
                <view class="logistics_pre_right" @click="goLogisticsCompany">
                    <text>{{logisticsCompanyData.expressName ? logisticsCompanyData.expressName : '请选择物流公司'}}</text>
                    <image :src="rightArrowGray" mode="aspectFit"></image>
                </view>
            </view>
        </view>
        <view class="submit_txt" @click="submitLogistics">提交</view>
    </view>
</template>

<script>

import { detail, deliverGoods } from "@/views/components/aftersale/handler";
import { getPartNumber } from '@/utils/common';
let startY = 0,
    moveY = 0,
    pageAtTop = true;
export default {
    components: {

    },
    data() {
        return {
            rightArrowGray: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_rightarrow_gray.svg',
            getPartNumber,
             
            coverTransform: 'translateY(0px)',
            coverTransition: '0s',
            moving: false,
            afsSn: '', //退款单号
            allData: {}, //订单详细信息
            orderProductList: [], //订单商品列表
            logisticsBillNo: '', //物流单号
            contactNumber: '', //联系电话
            expressId: '', //物流公司的id
            logisticsCompanyData: {} //物流公司的信息
        }
    },
    async mounted() {
        //退款单号
        this.afsSn = this.$Route.query.afsSn;
        this.initData();
        this.getOrderDetail();
    },
    methods: {
        initData() {
        },

        /**
             *  会员卡下拉和回弹
             *  1.关闭bounce避免ios端下拉冲突
             *  2.由于touchmove事件的缺陷（以前做小程序就遇到，比如20跳到40，h5反而好很多），下拉的时候会有掉帧的感觉
             *    transition设置0.1秒延迟，让css来过渡这段空窗期
             *  3.回弹效果可修改曲线值来调整效果，推荐一个好用的bezier生成工具 http://cubic-bezier.com/
             */
        coverTouchstart(e) {
            if (pageAtTop === false) {
                return;
            }
            this.coverTransition = 'transform .1s linear';
            startY = e.touches[0].clientY;
        },
        coverTouchmove(e) {
            moveY = e.touches[0].clientY;
            let moveDistance = moveY - startY;
            if (moveDistance < 0) {
                this.moving = false;
                return;
            }
            this.moving = true;
            if (moveDistance >= 80 && moveDistance < 100) {
                moveDistance = 80;
            }

            if (moveDistance > 0 && moveDistance <= 80) {
                this.coverTransform = `translateY(${moveDistance}px)`;
            }
        },
        coverTouchend() {
            if (this.moving === false) {
                return;
            }
            this.moving = false;
            this.coverTransition = 'transform 0.3s cubic-bezier(.21,1.93,.53,.64)';
            this.coverTransform = 'translateY(0px)';
        },
        //获取订单详情信息
        getOrderDetail() {
            let that = this;
            let param = {};
            param.afsSn = that.afsSn;
            detail(param).then(res => {
                if (res.state == 200) {
                    let result = res.data;
                    that.orderProductList = result.orderProductList;
                    that.allData = result || {};
                    that.loadFlag = true;
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

        //获取联系电话
        getContactNumber(e) {
            let that = this;
            that.contactNumber = e.detail.value;
        },
        //去物流公司页面
        goLogisticsCompany() {
            this.$Router.push('/views/gift/logistics/company')
        },
        //电话号的校验
        validateTel(tel) { //校验电话
            if (tel != "") {
                var strRegex = /^(13|14|15|17|18)\d{9}$/;
                if (!strRegex.test(tel)) {
                    return false;
                }
            }
            return true;
        },
        //提交物流信息
        submitLogistics() {
            let that = this;
            // let isValidate = that.validateTel(that.contactNumber)
            if (that.logisticsBillNo == '') {
                uni.showToast({
                    title: '请填写物流单号！',
                    icon: "none"
                });
                return
            }
            let reg = /^[0-9a-zA-Z]{1,20}$/g;
            if (!reg.test(that.logisticsBillNo)) {
                uni.showToast({
                    title: '请输入正确的物流单号！',
                    icon: "none"
                });
                return
            }
            if (JSON.stringify(that.logisticsCompanyData) == '{}' || that.logisticsCompanyData == {}) {
                uni.showToast({
                    title: '请选择物流公司！',
                    icon: "none"
                });
                return
            }

            let param = {};
            param.afsSn = that.afsSn; //售后服务单号
            param.expressId = that.logisticsCompanyData.expressId; //物流公司的id
            param.logisticsNumber = that.logisticsBillNo; //快递单号
            deliverGoods(param).then(res => {
                if (res.state == 200) {
                    uni.showToast({
                        title: res.msg,
                        icon: 'none'
                    })
                    let pages = getCurrentPages();
                    let beforePage = pages[pages.length - 2]; //上一页
                    beforePage.$vm.getOrderDetail(); //更新上一页数据 售后订单详情页面
                    this.$Router.back(1)
                } else {
                    uni.showToast({
                        title: res.msg,
                        icon: 'none'
                    })
                }
            }).catch(() => {
                //异常处理
            })
        }
    }
}
</script>

<style lang='scss'>
.select_service {
    width: 750rpx;
    margin: 0 auto;
    background: #F5F5F5;

    .order_goods {
        border-top: 20rpx solid #F5F5F5;
        background-color: #FFFFFF;

        .goods_list {
            padding: 20rpx 0;

            .goods_pre {
                display: flex;
                padding: 0 20rpx;
                box-sizing: border-box;

                .goods_image {
                    width: 200rpx;
                    height: 200rpx;
                    background: #F3F3F3;
                    border-radius: 14px;

                    image {
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

                    .goods_prices {
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

    .logistics_des {
        width: 100%;
        background-color: #FFFFFF;

        .logistics_pre {
            padding-right: 20rpx;
            height: 112rpx;
            box-sizing: border-box;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-left: 20rpx;
            border-bottom: 1rpx solid #EDEDED;

            .logistics_pre_left {
                text:nth-child(1) {
                    font-size: 28rpx;
                    font-family: PingFang SC;
                    font-weight: 500;
                    color: #FC1C1C;
                    line-height: 45rpx;
                    margin-right: 10rpx;
                }

                text:nth-child(2) {
                    font-size: 28rpx;
                    font-family: PingFang SC;
                    font-weight: 500;
                    color: #333333;
                    line-height: 45rpx;
                }
            }

            .logistics_pre_right {
                display: flex;
                align-items: center;

                text {
                    font-size: 26rpx;
                    font-family: PingFang SC;
                    font-weight: 400;
                    color: #999999;
                    line-height: 45rpx;
                }

                input {
                    font-size: 26rpx;
                    font-family: PingFang SC;
                    font-weight: 400;
                    color: #999999;
                    line-height: 45rpx;
                    text-align: right;
                }

                image {
                    width: 12rpx;
                    height: 24rpx;
                    margin-left: 15rpx;
                }
            }
        }

        .logistics_pre:nth-last-of-type(1) {
            border-bottom: none;
        }
    }

    .submit_txt {
        width: 668rpx;
        height: 88rpx;
        background: #F30300;
        border-radius: 40px;
        font-size: 36rpx;
        font-family: PingFang SC;
        font-weight: 500;
        color: #FFFFFF;
        line-height: 88rpx;
        position: fixed;
        bottom: 40rpx;
        z-index: 10;
        margin: 0 41rpx;
        text-align: center;
    }
}
</style>