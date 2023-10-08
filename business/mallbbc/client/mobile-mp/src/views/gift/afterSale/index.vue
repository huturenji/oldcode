<!-- 选择服务页面 -->
<template>
    <view class="select_service">
        <view class="order_goods">
            <view class="goods_list">
                <view class="goods_pre">
                    <view class="goods_image">
                        <image :src="orderProduct.mainImage" mode="aspectFit"></image>
                    </view>
                    <view class="goods_des">
                        <view class="goods_name">{{orderProduct.skuName}}</view>
                        <view class="goods_spec" v-if="orderProduct.specValues">{{orderProduct.specValues}}</view>
                    </view>
                </view>
            </view>
        </view>
        <!-- 服务方式 start -->
        <view class="uni-list service_list">
            <radio-group>
                <label class="service_pre" v-for="(item,index) in servicelList" :key="index"
                    @click="goApplyRefund(item.value)">
                    <view class="service_pre_left">
                        <view class="service_des">
                            <view class="service_des_top">
                                <text class="service_pre_tip"></text>
                                <text class="service_pre_title">{{item.title}}</text>
                            </view>
                            <view class="servece_pre_content">{{item.content}}</view>
                        </view>
                    </view>
                    <image :src="rightArrowGray" mode="" class="service_right"></image>
                </label>
            </radio-group>
        </view>
        <view v-if='showTips && servicelList.length==0' class="empty-wrapper">
            <div class="img-wrapper">
                <image src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/empty/icon_defpage_zwnr.png"  />

            </div>
            <text>该商品无法售后！</text>
        </view>
        <!-- 服务方式 end -->
    </view>
</template>

<script>
import { afsCheck, selectAfsService } from "@/views/components/aftersale/handler";


let startY = 0,
    moveY = 0,
    pageAtTop = true;
export default {
    components: {

    },
    data() {
        return {
            rightArrowGray: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_rightarrow_gray.svg',
             
            coverTransform: 'translateY(0px)',
            coverTransition: '0s',
            moving: false,
            afsSn: '', //退款单号
            allData: {}, //订单详细信息
            orderProduct: {}, //订单商品列表
            current: '0', //选择服务当前点击的是第0项
            servicelList: [
                // {
                //     title:'仅退款(无需退货)',
                //     content:'没收到货，或与卖家协商同意不用退货仅退款',
                //     value:'0'
                // },
                // {
                //     title:'退货退款',
                //     content:'已收到货，需要退还收到的货物',
                //     value:'1'
                // }
                // ,{
                //     title:'换货',
                //     content:'商品存在质量问题，联系卖家协商换货',
                //     value:'2'
                // },
            ], //   1 退货   2 换货  4 维修
            orderSn: '', //订单号
            orderProductId: '', //订单中商品列表中商品的id
            orderOrder: {}, //订单信息
            orderListLen: 1, //同订单，订单length
            showTips: false,
            sourceType: '', // 页面来源  为orderDetail 订单详情  refundDetail 售后详情 ,这个值要传到下一页面 applyRefund 作为回退用
            oldAfsOrderSn: '' //原来的售后单号 
        }
    },
    async mounted() {
        //退款单号
        this.afsSn = this.$Route.query.afsSn;
        this.orderSn = this.$Route.query.orderSn;
        this.orderProductId = this.$Route.query.orderProductId;
        this.sourceType = this.$Route.query.sourceType; //页面来源
        this.oldAfsOrderSn = this.$Route.query.oldAfsOrderSn ? this.$Route.query.oldAfsOrderSn : ''; //从重新申请过来  要把原来的售后单号带过来, 退款页提交时传过去
        this.getOrderDetail();
        // 获取售后方式
        this.getAfsServiceCheck();
        this.orderListLen = this.$Route.query.orderListLen;
    },
    onShow() {
        this.showTips = false
        // 获取售后方式
        if (this.orderSn) {
            this.getAfsServiceCheck();
        }
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
        //获取订单详情信息 申请退换货
        getOrderDetail() {
            let that = this;
            const param = {
                orderSn: that.orderSn,
                orderProductId: that.orderProductId,
            };

            selectAfsService(param).then(res => {
                if (res.state == 200) {
                    let result = res.data;
                    that.orderProduct = result.orderProduct;
                    that.orderOrder = result.order;
                    that.allData = result || {};
                    that.loadFlag = true;
                } else {

                }
            })

        },
        goApplyRefund(value) {
            let that = this;
            this.servicelList.forEach((item) => {
                if (item.value == value) {
                    // this.current = index;    //不理解为什么这么写,屏蔽了一项后就不对了这是bug
                    this.current = value;
                }
            })
            
            this.$Router.push({
                path: '/views/gift/afterSale/apply',
                query: {
                    serviceType: that.current,
                    orderProductId: that.orderProduct.orderProductId,
                    sourceType: 'selecTService',
                    orderListLen: that.orderListLen,
                    backSource: this.sourceType,
                    oldAfsOrderSn: this.oldAfsOrderSn
                }
            })
        },
        // 可售后性列表
        getAfsServiceCheck() {
            return new Promise((resolve) => {
                const param = {
                    orderSn: this.orderSn,
                };

                afsCheck(param).then(res => {
                    if (res.state == 200) {
                        resolve(res.data)
                        const { data } = res
                        let serviceObj = {}
                        if (data && data.length > 0) {
                            serviceObj = data.find(e => e.orderProductId == this.orderProductId)
                        }
                        if (serviceObj.num) {
                            this.servicelList = serviceObj.afterSaleTypes
                        } else {
                            // todo
                            this.servicelList = []
                            this.showTips = true
                        }
                    } else {
                        this.servicelList = []
                        this.showTips = true
                    }
                }).catch(() => {
                    resolve([])
                })
            })
        }
    }
}
</script>

<style lang='scss' scoped>
.select_service {
    height: 100%;
    width: 750rpx;
    margin: 0 auto;
    background: #eff2f5;

    .order_goods {
        border-top: 20rpx solid #eff2f5;
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
                        line-height: 139%;
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
            }
        }
    }

    .service_list {
        background-color: #FFFFFF;
        border-top: 20rpx solid #eff2f5;

        .service_pre {
            height: 120rpx;
            display: flex;
            align-items: center;
            padding: 0 30rpx;
            box-sizing: border-box;
            justify-content: space-between;
            border-bottom: 1rpx solid #EEEEEE;

            .service_pre_left {
                display: flex;
                align-items: center;

                .service_des {
                    display: flex;
                    flex-direction: column;

                    .service_des_top {
                        display: flex;
                        align-items: center;

                        .service_pre_tip {
                            background: #FF0000;
                            width: 10rpx;
                            border-radius: 50%;
                            height: 10rpx;
                            margin-right: 20rpx;
                        }

                        .service_pre_title {
                            font-size: 28rpx;
                            font-family: PingFang SC;
                            font-weight: 500;
                            color: #343434;
                            line-height: 45rpx;
                        }
                    }

                    .servece_pre_content {
                        font-size: 24rpx;
                        font-family: PingFang SC;
                        font-weight: 500;
                        color: #9A9A9A;
                        line-height: 45rpx;
                        padding-left: 30rpx;
                    }
                }
            }

            .service_right {
                width: 24rpx;
                height: 24rpx;
            }
        }
    }
    .empty_part {
        padding: 108rpx 0rpx;
        background: #fff;

        image {
            width: 256rpx;
            height: 256rpx;
        }

        text {
            font-size: 28rpx;
        }
    }

    .empty-wrapper {
        color: #999;
        font-size: 28rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .img-wrapper{
            width: 256rpx;
            height: 256rpx;
        }
    }
}
</style>
