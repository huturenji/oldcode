<template>
    <div class="order-item">
        <div class="order-summary">
            <div class="orderProvider">
                <img src="~assets//icon_call.png" />
                <label>圆通速递</label>
            </div>
            <div class="order-summary-lines">
                <div class="order-summary-line">
                    <div class="block">
                        <span>订单编号：{{orderItem.orderNo}}</span>
                        <span>{{"运单号："+ (orderItem.supplierOrderNo||'---')}}</span>
                    </div>
                </div>
                <div class="order-summary-line">
                    <div class="block">
                        <span>下单日期：{{orderItem.orderTime}}</span>
                        <div class="inlinespan">下单用户：{{orderItem.scheduledPersonName}}</div>
                        <div class="inlinespan">联系电话：{{orderItem.contactMobile}}</div>
                    </div>
                    <div class="blockright">
                        <div class="inlinespan">分销渠道：{{prodName}}</div>
                        <div class="inlinespan">企业：{{companyName}}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="order-detail">
            <div class="order-detail-block">
                <div>
                    <div>
                        <span class="citys">{{orderItem.departCityName||"深圳"}}</span>
                        <span>——></span>
                        <span class="citys">{{orderItem.arriveCityName||"北京"}}</span>
                    </div>
                </div>
                <div class="seatBox">
                    <span class="seat" v-if="true">物品信息：文件/1.0公斤{{orderItem.airlineName}}</span>
                    <span class="seat" v-if="true">留言：快递小哥来的时候带一个大点的纸箱{{orderItem.flightNo}}</span>
                </div>
                <div class="travel-info">
                    <label class="pos-label pos-label-start">寄</label>
                    <div
                        class="infoDetail"
                        v-if="true"
                    >吴彦祖 15945897562 详细地址：广东省，深圳市，福田区，车公庙泰然八路泰然大厦C座16层福田区，车公庙泰然八路泰然大厦C座16层{{orderItem.sAirportName}}</div>
                </div>
                <div class="travel-info">
                    <label class="pos-label pos-label-end">收</label>
                    <div
                        class="infoDetail"
                        v-if="true"
                    >刘德华 15956893215 详细地址：北京市，海淀区，五道口职业技术学院{{orderItem.eAirportName}}</div>
                </div>
            </div>

            <div class="order-detail-block">
                <div class="sub-label">订单状态</div>
                <div
                    class="single-text"
                    :class="['payStatus-'+orderItem.payStatus,{'part-status-margin':orderItem.partStatus}]"
                >{{orderStatus + partStatus}}</div>
            </div>

            <div
                class="order-detail-block centerBlock"
                style="display: flex;justify-content: center;align-items: center;"
            >
                <div v-show="hasDelivery" class="showButtonWrap">
                    <div class="showButton cursorp">
                        <span>快递</span>
                        <div class="sign" v-show="isSign"></div>
                    </div>
                    <div class="dialogShow cursorp">
                        <div class="lineInfo">
                            <div class="logoBg">
                                <img :src="expressLogo" />
                            </div>
                            <InfoLabel
                                style="align-items: baseline"
                                infoName="运单号"
                                :infoValue="!!orderItem.expressInfo ? orderItem.expressInfo.expressOrderNo:''"
                            ></InfoLabel>
                            <div class="hasReceived" v-if="showReceivedIcon">
                                <img />
                            </div>
                        </div>

                        <div
                            class="lineExpress"
                            v-if="!!orderItem.expressInfo && !!orderItem.expressInfo.expressDetails && orderItem.expressInfo.expressDetails.length>0"
                        >
                            <div class="expressStatus">
                                <div
                                    class="expressStatusCell"
                                    v-for="(item,index) in expressStatusArr"
                                    :key="item"
                                >
                                    <div class="statusTextP" v-if="item.statusLife==2">
                                        <div class="TextPBox">{{item.statusTxt}}</div>
                                        <div class="TextPImg"></div>
                                    </div>
                                    <div
                                        class="statusText"
                                        v-else-if="item.statusLife<3"
                                    >{{item.statusTxt}}</div>
                                    <div class="statusText1" v-else>{{item.statusTxt}}</div>
                                    <div class="statusImgs">
                                        <div
                                            class="expressImgL1"
                                            v-if="index>0 && item.statusLife<3"
                                        ></div>
                                        <div
                                            class="expressImgL"
                                            v-else-if="index>0 && item.statusLife==3"
                                        ></div>
                                        <div v-else class="expressImgE"></div>
                                        <div class="expressImgP" v-if="item.statusLife<3"></div>
                                        <div class="expressImgPF" v-else></div>

                                        <div
                                            class="expressImgL1"
                                            v-if="index<(expressStatusArr.length-1)&& item.statusLife==1"
                                        ></div>
                                        <div
                                            class="expressImgL"
                                            v-else-if="index<(expressStatusArr.length-1)&& item.statusLife>1"
                                        ></div>
                                        <div v-else class="expressImgE"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="telPhones">
                                <div>联系快递员：15912565451</div>
                                <div class="splitLine"></div>
                                <div>联系快递客服：010-45896521</div>
                            </div>
                            <ExpressDetailItem
                                v-for="item in expressList"
                                :key="item.expressLocationTime"
                                v-bind:expressItem="item"
                            />
                        </div>
                        <div class="lineExpressEmpty" v-else>
                            <div>
                                <img
                                    src="~assets///icon_no_express.png"
                                />
                            </div>
                            <div>待快递人员上门揽件，暂无物流信息</div>
                        </div>
                    </div>
                </div>
                <div
                    class="button primary cursorp"
                    @click="goDetail(orderItem.typeName,orderItem.typeCode, orderItem.orderNo)"
                >订单详情</div>
            </div>
        </div>
    </div>
</template>

<script>
import utils from "bislibs/utils";
import  * as travelfun from "bislibs/traveloperationfun.js";
const InfoLabel = () => import("biscomponents/infolabel/msglabel.vue");
const ExpressDetailItem = () => import("biscomponents/express/listitem.vue");

export default {
    props: {
        orderItem: {
            //订单列表数据
            type: Object,
            required: true
        }
    },
    directives: {
     },
    components: {
        InfoLabel,
        ExpressDetailItem,
    },
    data() {
        return {
            expressStatusArr: [
                {
                    statusLife: 1, //状态的生命周期，已过期1，当前状态2，未过期3，
                    statusTxt: "已揽件",
                    detailArr: [
                        "2019-07-22 15：40",
                        "快递员：黎明  15423125698"
                    ]
                },
                {
                    statusLife: 1,
                    statusTxt: "已揽件",
                    detailArr: [
                        "2019-07-22 15：40",
                        "快递员：黎明  15423125698"
                    ]
                },
                {
                    statusLife: 2,
                    statusTxt: "已揽件",
                    detailArr: [
                        "2019-07-22 15：40",
                        "快递员：黎明  15423125698"
                    ]
                },
                {
                    statusLife: 3,
                    statusTxt: "已揽件",
                    detailArr: []
                }
            ],
            expressList: [], //物流信息列表
            InvoiceStatusName1: "邮寄报销凭证", //按钮提示语
            InvoiceStatusName2: "已寄送报销凭证", //按钮提示语
            isSign: true //快递是否签收
        };
    },
    computed: {
        //供应商名称
        providerName: function() {
            return getProviderNameForId(this.orderItem.providerType);
        },
        //分销商名称
        prodName: function() {
            return travelfun.getProdNameForId(this.orderItem.channelId);
        },
        //企业名称
        companyName: function() {
            return this.orderItem.companyName;
        },
        //快递公司logo
        expressLogo: function() {
            //类似于飞机票的logo，拼接成本地的图片
            return travelfun.getExpressLogo(this.orderItem.expressInfo);
        },
        //订单状态
        orderStatus: function() {
            return utils.getFlightOrderStatus(this.orderItem.orderStatus);
        },
        customersArr: function() {
            return this.orderItem.passengers
                ? this.orderItem.passengers.split(",")
                : [];
        },
        cabinType: function() {
            return travelfun.getCabinTypeName(this.orderItem.cabinType);
        },
        //订单的退改状态
        partStatus: function() {
            if (utils.showFlightSubStatus(this.orderItem.orderStatus)) {
                return utils.getFlightPartStatus(this.orderItem);
            }
            return "";
        },
        //支付方式
        payType: function() {
            return travelfun.getPaymentName(
                this.orderItem.paymentPlatform,
                this.orderItem.payType
            );
        },
        payStatus: function() {
            return travelfun.getPayStatus(this.orderItem.payStatus);
        },
        userType: function() {
            return travelfun.getUserType(this.orderItem.useType);
        },

        hasDelivery: function() {
            //是否已经邮寄,快递信息不为空
            let isDelivery =
                !!this.orderItem.expressInfo &&
                !!this.orderItem.expressInfo.expressOrderNo;
            // return isDelivery;
            return true;
        },
        InvoiceStatus: function() {
            //需要报销凭证，并且没有邮寄,目前没有这样的数据
            let isDelivery =
                !!this.orderItem.expressInfo &&
                !!this.orderItem.expressInfo.expressOrderNo;
            if (isDelivery) {
                return this.InvoiceStatusName2;
            } else {
                return this.InvoiceStatusName1;
            }
        },
        /**
         * 快递已签收标记
         */
        showReceivedIcon: function() {
            let result = false;
            let that = this;
            if (
                !!this.orderItem.expressInfo &&
                !!this.orderItem.expressInfo.expressStatusAndTime
            ) {
                for (
                    let i = 0;
                    i < this.orderItem.expressInfo.expressStatusAndTime.length;
                    i++
                ) {
                    if (
                        this.orderItem.expressInfo.expressStatusAndTime[i]
                            .status == "已签收"
                    ) {
                        that.isSign = false;
                        result = true;
                        break;
                    }
                }
            }
            return result;
        }
    },
    watch: {},
    created() {
        //物流列表信息
        this.expressList =
            !!this.orderItem.expressInfo &&
            !!this.orderItem.expressInfo.expressDetails &&
            this.orderItem.expressInfo.expressDetails.length > 0
                ? this.orderItem.expressInfo.expressDetails
                : this.expressList;
        for (let i = 0; i < this.expressList.length; i++) {
            if (i == 0) {
                this.expressList[i].isLastPoint = true;
            } else if (i == this.expressList.length - 1) {
                this.expressList[i].isFirstPoint = true;
            }
        }
        let that = this;
    },
    beforeDestroy() {
        let that = this;
    },
    methods: {
        /**
         * 跳转到订单详情
         * @param typeName
         * @param typeCode
         */
        goDetail(typeName, typeCode, orderNo) {
            this.$router.push({
                path: "/order/orderDetail",
                query: {
                    typeName: typeName,
                    typeCode: typeCode,
                    orderNo: orderNo,
                    isAbnormal:this.orderItem.isAbnormal
                }
            });
            // this.$emit('goDetail', typeName, typeCode, orderNo);
        }
    }
};
</script>
<style lang="less">
@import '~styles/common.less';

.order-item {
  border: 1px solid @border;
  border-radius: @radius-small;
  padding: 0 24px 0 20px;
  margin-bottom: 20px;
  width: 978px;
  font-size: 14px;

  .order-summary {
    // height: 40px;
    // line-height: 40px;
    align-items: center;
    display: flex;
    padding: 10px 0px;

    .orderProvider {
      display: flex;
      border-right: 1px solid #e5e5e5;
      flex: 0 0 120px;
      margin-right: 10px;
      height: 35px;
      line-height: 35px;

      img {
        margin: 0px 10px;
      }
    }

    .order-summary-lines {
      flex: auto;
    }

    .order-summary-line {
      height: 25px;
      line-height: 25px;
      display: flex;
      justify-content: space-between;

      .block {
        flex: 1 1 500px;
        display: flex;
        align-content: start;
      }

      .blockright {
        flex: 1 1 250px;
        display: flex;
        justify-content: flex-end;

        img {
          height: 14px;
          width: 15px;
          margin-left: 3px;
        }
      }

      .inlinespan {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        color: #191919;
        margin-left: 10px;
        font-size: x-small;
        width: auto;
        //			max-width: 120px  	
      }

      .inlinespan1 {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        color: #191919;
        // margin-left: 10px;
        font-size: x-small;
        width: auto;
        //			max-width: 120px  	
      }
    }

    .flex-box;

    label {
      //   .flex(0 0 60px);
      //    text-indent: 5px;
      font-size: medium;
      color: black;
      //   font-weight: bolder;
    }

    span {
      .flex(none);
      color: @font-color;
      font-size: x-small;
      margin-right: 10px;
    }

    img {
      width: 20px;
      height: 20px;
      align-self: center
    }

    .icon {
      display: inline-block;
      flex: 0 0 20px;

      &.icon-flight {
        background: url(~assets//icon_flight.png) no-repeat 0px 11px transparent;
      }

      &.icon-train {
        background: url(~assets//icon_train.png) no-repeat 0px 11px transparent;
      }

      &.icon-hotel {
        background: url(~assets//icon_hotel.png) no-repeat 0px 11px transparent;
      }
    }

    &>span {
      .flex(none);
      color: @font-color;
      font-size: smaller;

      //   & > span {
      //  color: @label-color;
      //   }
      &:nth-of-type(1) {
        margin-right: 0px;
        //      width: 230px;
      }

      &:nth-of-type(2) {
        margin-left: 10px;
        margin-right: 10px;
      }

      //   &:nth-of-type(3) {
      //      width: 140px;
      //   }
      &:nth-of-type(4) {
        margin-left: 0.3rem;
        margin-right: 10px;
        //      width: 140px;
      }

      &:nth-of-type(5) {
        margin-left: 0.2rem;
        //      margin-right: 10px;
        //      width: 140px;
      }

      &:nth-of-type(6) {
        .flex(flex-end);
        //    	margin-left: 0.1rem;
        //      margin-right: 10px;
        //      width: 140px;
      }
    }

    .staff-btn {
      .flex(none);
      .flex-box;
      background: url(~assets//icon_staff_nor.png) no-repeat 0px 10px transparent;
      justify-content: flex-end;
      cursor: pointer;
      text-indent: 22px;
      margin: 0;

      &:hover {
        background-image: url(~assets//icon_staff_hov.png);
      }
    }
  }

  .order-detail {
    .flex-box;
    .flex(none);
    padding: 10px 0 10px;
    border-top: 1px solid @border;

    .order-detail-block {
      position: relative;
      width: 130px;
      .flex-box;
      .flex-flow(column);
      .justify-content(flex-start);

      &:not(:last-child) {
        border-right: 1px solid @border;
      }

      &:first-child {
        width: 700px;
        display: block;

        &>div {
          .flex-box;

          div {
            margin-right: 20px;
          }

          span {
            .flex(1);
          }
        }

        .seatBox {
          margin: 10px 0px;
        }

        .seat {
          .flex(none);
          margin-right: 10px;

          &:last-child {
            margin-left: 10px;
          }
        }

        .citys {
          font-size: medium;
          color: black;
          font-weight: bolder;
        }

        .seatOne {
          .flex(none);
          margin-right: 10px;
          width: 110px;
        }
      }

      //   &:nth-of-type(2) {
      //     .flex(0 0 90px);
      //   }

      //   &:nth-of-type(3) {
      //     .flex(0 0 130px);
      //   }

      .travel-info {
        margin: 5px 0;

        .pos-label {
          //   width: 32px;
          flex: 0 0 32px;
          height: 21px;
          line-height: 21px;
          color: #fff;
          text-align: center;
          margin-right: 12px;
          position: relative;

          &.pos-label-start {
            background: #F39800;
          }

          &.pos-label-end {
            background: #478aee;
          }
        }

        .infoDetail {
          margin: 0 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        span {
          margin: 0 5px;
          .flex(none) !important;
        }

      }

      .travelTime {
        margin-left: 30px;
        vertical-align: middle;
        line-height: 80px;

        span {
          font-weight: bold;
        }
      }

      .single-text {
        margin: 50px 10px 0;
        line-height: 24px;

        &.muti-person {
          margin-top: 30px;
        }

        &.double-person,
        &.with-vouch,
        &.part-status-margin {
          margin-top: 40px;
        }

        &.payStatus-0 {
          /*未支付*/
          color: @font-red-color;
        }

        &.payStatus-2 {
          /*已退款*/
          color: @font-green-color;
        }
      }

      .single-text1 {
        text-align: center;
      }

      .userTypeDiv {
        text-align: center;
        margin: 0 35px;
        border-radius: 3px;
        font-size: small;
        color: white;

        &.diff-0 {
          //			    	因公
          background: #f39800;
        }

        &.diff-1 {
          //			    	因私
          background: #478aee;
        }
      }

      .part-status {
        width: 60px;
        text-align: center;
        background: #FFB843;
        color: #fff;
        margin-left: 10px;
      }

      .red-font {
        color: @font-red-color;
      }

      .sub-label {
        position: absolute;
        top: 2px;
        left: 10px;
        color: @label-color;
      }

      .button {
        margin: 0px auto 0;
        width: 100px;
        line-height: 19px;
        color: #478aee;
        border: 1px solid #478aee;
        text-align: center;
        border-radius: 2px;
        cursor: pointer;
        float: right;
        font-size: 12px;

        &:hover {
          background: @primary;
          color: #fff;
        }
      }
    }

    .vouch {
      color: @primary;
      padding-left: 10px;
    }

  }

  .btnPopover {
    button {
      background: none;
      border: none;
      outline: none;
      color: #333333;
      //			&:hover,&.selected{
      //				color: #FFFFFF;
      //			}
    }
  }



}

.showButtonWrap {
  position: relative;
  margin-bottom: 10px;

  .showButton {
    text-align: center;
    cursor: pointer;

    span {
      background: url(~assets//icon_express_gray.png) no-repeat left;
      padding-left: 20px;
      background-size: 15px;
      font-size: 12px;
      color: #333333;
    }
  }

  .dialogShow {
    position: absolute;
    display: none;
    top: 30px;
    right: 0;
    height: fit-content;
    height: -moz-fit-content;
    height: -webkit-fit-content;
    width: 480px;
    padding: 20px;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, .5);
    background: #fff;
    z-index: 1;
    border-radius: 5px;

    .lineInfo {
      display: flex;
      border-bottom: 1px dashed #7F7F7F;
      padding-bottom: 10px;

      .logoBg {
        // width: 25px;
        height: 25px;
        background: #fff;
        margin-right: 30px;
      }

      img {
        width: 25px;
        height: 25px;
        margin-right: 40px;
      }

      .hasReceived {
        margin-left: 60px;

        img {
          width: 72px;
          height: 57px;
          background: url(~assets///icon_mail_received.png) no-repeat left;
        }
      }
    }

    .lineExpress {
      //   overflow: scroll;
      //   height: 150px;
      margin-top: 10px;

      iframe {
        width: 100%;
      }

      .telPhones {
        display: flex;
        justify-content: space-around;
        border-bottom: 1px dashed #7F7F7F;
        padding-bottom: 10px;
        margin-bottom: 20px;

        .splitLine {
          width: 1px;
          height: 15px;
          background: #7F7F7F;
        }
      }

      .expressStatus {
        background-color: #fff;
        padding: 20px 0px;
        color: #333;
        font-size: 14px;
        display: flex;
        flex-flow: wrap;
        // width: 1280px;

        .expressStatusCell {
          width: 100px;

          .statusImgs {
            display: flex;
            justify-content: center;
          }

          .expressImgP {
            background: url(~assets///icon_express_true.png) no-repeat;
            background-size: 100% 100%;
            width: 20px;
            height: 20px;
          }

          .expressImgPF {
            background: url(~assets///icon_express_false.png) no-repeat;
            background-size: 100% 100%;
            width: 20px;
            height: 20px;
          }

          .expressImgL {
            background: url(~assets///icon_express_colum.png) no-repeat;
            background-size: 100% 100%;
            width: 40px;
            height: 3px;
            align-self: center;
          }

          .expressImgL1 {
            background: url(~assets///icon_express_colum1.png) no-repeat;
            background-size: 100% 100%;
            width: 40px;
            height: 3px;
            align-self: center;
          }

          .expressImgE {
            background: transparent;
            background-size: 100% 100%;
            width: 40px;
            height: 3px;
            align-self: center;
          }

          .statusTextP {
            font-size: 14px;
            // text-align: center;
            color: #ffffff;
            height: 30px;

            .TextPBox {
              background: #478aee;
              border-radius: 4px;
              padding: 2px 10px;
              width: fit-content;
              margin: 0 auto;
            }

            .TextPImg {
              background: url(~assets///icon_express_tip.png) no-repeat;
              background-size: 100% 100%;
              width: 10px;
              margin: 0 auto;
              height: 5px;
            }
          }

          .statusText {
            // font-weight: bold;
            font-size: 14px;
            text-align: center;
            color: #333333;
            height: 30px;
          }

          .statusText1 {
            // font-weight: bold;
            font-size: 14px;
            text-align: center;
            color: #999999;
            height: 30px;
          }

          .statusDetailCell {
            text-align: center;
          }
        }
      }
    }

    .lineExpressEmpty {
      text-align: center;
      margin-top: 20px;

      img {
        width: 54px;
        height: 54px;
        // background: url(~assets///icon_no_express.png) no-repeat center;                    
      }
    }
  }
}

.showButtonWrap:hover .dialogShow {
  display: block;
}

.sign {
    position: absolute;
    top: 3px;
    right: -5px;
    width: 6px;
    height: 6px;
    background-color: #f00;
    border-radius: 50%;
}
</style>