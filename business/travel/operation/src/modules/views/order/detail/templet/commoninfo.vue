<template>
  <!--订单信息模块-->
  <div class="orderBaseDiv">
    <div class="orderBaseTop">
      <div class="orderBaseTopContent">
        <div class="orderBaseLine0">
          <div class="orderStatusText" :style="{color:orderStatusColor}">{{orderStatusDes}}</div>
          <div class="orderBaseNote" v-if="recordEmpty">
            <span>{{operationRecords[0].operationDate}}</span>
            <span style="max-width:500px">{{operationRecords[0].operationDesc}}</span>
          </div>
          <div class="orderBaseMore" :class="{blue:changeSty}">
            <div @click="orderMoreNote" v-if="recordEmpty">
              更多
              <img
                src="~/assets//icon_more_search.png"
                alt
              />
            </div>
            <div :class="{orderBaseList:recordEmpty==true}" v-show="listflg">
              <p
                :class="{blue:index==isactive}"
                v-for="(record,index) in operationRecords"
                :key="index"
                @click="changeColor(index)"
              >
                <span>{{record.operationDate}}</span>
                <span :class="{expanded:index==isactive}">{{record.operationDesc}}</span>
              </p>
            </div>
          </div>

          <div @click="gotoCustSer()" class="customerService cursorp">
            <InfoLabel infoName="客服" classForName="infoLabel1" style="display:none">
              <img
                src="~assets//icon_customer_server.png"
                slot="header"
              />
            </InfoLabel>
          </div>
        </div>
        <div class="orderBaseLine1">
          <div>
            <div class="orderNos">
              <InfoLabel
                infoName="商旅通订单号："
                :infoValue="orderBNo||'---'"
                classForName="infoLabel1"
                classForValue="infoLabel2"
              >
                <span style="margin-right: 10px;" slot="middlePoint" />
              </InfoLabel>
              <InfoLabel
                :infoName="providerName+'订单号：'"
                :infoValue="orderBNoOuter||'---'"
                classForName="infoLabel1"
                classForValue="infoLabel2"
              >
                <span style="margin-right: 10px;" slot="middlePoint" />
              </InfoLabel>
              <!-- 此处保险跳转到机票的订单详情 -->
              <InfoLabel
                v-if="isInsurance"
                @click.native="goFlightDetail('机票','Flight',orderDetail.orderBase.relatedOrderNo)"
                :infoName="'机票订单号：'"
                :infoValue="orderDetail.orderBase.relatedOrderNo||'---'"
                classForName="infoLabel1"
                classForValue="infoLabelFlight"
              >
                <span style="margin-right: 10px;" slot="middlePoint" />
              </InfoLabel>
            </div>
            <div class="note" v-if="limitTimeString">
              {{limitTimeType}}已锁定，请在
              <span>{{limitTimeString}}</span>内完成支付，超时订单将取消
            </div>
          </div>
          <div class="orderBaseAmount">
            <InfoLabel
              infoName="总金额"
              :infoValue="'￥' + (payAmount||'---')"
              classForName="infoLabel3"
              classForValue="infoLabel4"
            >
              <span style="margin-right: 5px;" slot="middlePoint" />
            </InfoLabel>
            <div class="showButtonWrap">
              <div class="orderBaseAmount3">明细</div>
              <div class="dialogShow" :style="{height:getDialogHeight}">
                <div class="lineTitle">费用明细</div>
                <div class="lineTotal">
                  <InfoLabel
                    infoName="总金额"
                    :infoValue="'￥' + (payAmount||'---')"
                    classForName="infoLabel3"
                    classForValue="infoLabel4"
                  >
                    <span style="margin-right: 5px;" slot="middlePoint" />
                  </InfoLabel>
                </div>
                <div v-for="item in priceList" :key="item.name">
                  <div class="lineDetail" v-if="item.price > 0 || !!item.price">
                    <div>{{item.name}}</div>
                    <div>
                      <span v-if="item.negative">-</span>
                      ￥{{item.price}}
                      <span
                        v-if="judgeInsurance()"
                      >X{{orderDetail.insuredInfos.length}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="orderBaseLine2">
      <span>预订人 ：{{contactName}}</span>
      <span>联系电话：{{contactMobile}}</span>
    </div>
    <div class="orderBaseLine2">
      <span v-if="userTypeFlag">出行类型：{{userType}}</span>
      <span>支付方式：{{payType}}</span>
      <span>供应商：{{providerName}}</span>
      <span>分销渠道：{{prodName}}</span>
      <span>企业名称：{{cpyName}}</span>
    </div>
  </div>
</template>

<script>
import InfoLabel from "biscomponents/infolabel/msglabel.vue";
const manualBookingFlight = () =>
  import("biscomponents/abnormal-order/flight/flight.vue");
const manualRefundHotel = () =>
  import("biscomponents/abnormal-order/hotel/hotel");
const manualBookingInsurance = () =>
  import("biscomponents/abnormal-order/insurance/insurance.vue");
const manualRefundTrain = () =>
  import("biscomponents/abnormal-order/train/train.vue");
import utils from "bislibs/utils";
import  * as travelfun from "bislibs/traveloperationfun.js";
import tmHandler from "bislibs/requesthandler/traveloperationhandler.js";

export default {
  components: {
    InfoLabel,
    manualBookingFlight,
    manualRefundHotel,
    manualBookingInsurance,
    manualRefundTrain
  },
  props: {
    orderDetail: {
      type: Object,
      required: true
    },
    orderType: {
      type: String,
      required: true
    }
  },
  computed: {
    //订单的退改状态
    partStatus: function() {
      let result;
      let typeCode = this.orderType.toLowerCase();
      if (typeCode == "flight") {
        if (
          utils.showFlightSubStatus(
            this.orderDetail.orderBase && this.orderDetail.orderBase.orderStatus
          )
        ) {
            result = utils.getFlightPartStatus(this.orderDetail.orderBase);
        }
      } else if (typeCode == "train") {
        if (utils.showTrainSubStatus(this.orderDetail.orderInfo && this.orderDetail.orderInfo.orderStatus)) {
            result = utils.getTrainPsgStatusUIName(this.orderDetail.orderInfo);
        }
      }
      return !!result ? result : "";
    },
    orderStatusDes: function() {
      var result;
      let typeCode = this.orderType.toLowerCase();
      if (typeCode == "flight") {
        result = utils.getFlightOrderStatus(
          this.orderDetail.orderBase && this.orderDetail.orderBase.orderStatus
        );
      } else if (typeCode == "train") {
        result = utils.getTrainOrderStatus(this.orderDetail.orderInfo.orderStatus);
      } else if (typeCode == "hotel") {
        result = utils.getHotelOrderStatus(this.orderDetail.orderStatus);
      } else if (typeCode == "insurance") {
        result = utils.getInsuranceOrderStatus(
          this.orderDetail.orderBase && this.orderDetail.orderBase.orderStatus
        );
      } else {
        result = "";
      }
      result += this.partStatus;
      return result;
    },
    orderStatusColor: function() {
      var result;
      let typeCode = this.orderType.toLowerCase();
      if (typeCode == "flight") {
        result = utils.getFlightOrderStatusColor(
          this.orderDetail.orderBase && this.orderDetail.orderBase.orderStatus
        );
      } else if (typeCode == "train") {
        result = utils.getTrainOrderStatusColor(
          this.orderDetail.orderInfo && this.orderDetail.orderInfo.orderStatus
        );
      } else if (typeCode == "hotel") {
        result = utils.getHotelOrderStatusColor(this.orderDetail.orderStatus);
      } else if (typeCode == "insurance") {
        result = utils.getInsuranceOrderStatusColor(
          this.orderDetail.orderBase && this.orderDetail.orderBase.orderStatus
        );
      } else {
        result = "";
      }
      return result;
    },
    cpyName: function() {
      let typeCode = this.orderType.toLowerCase();
      let cpyName;
      if (typeCode == "flight") {
        cpyName =
          this.orderDetail.orderBase && this.orderDetail.orderBase.founderInfo 
          && this.orderDetail.orderBase.founderInfo.companyName;
      } else if (typeCode == "insurance") {
        cpyName =
          this.orderDetail.orderBase && this.orderDetail.orderBase.founderInfo 
          && this.orderDetail.orderBase.founderInfo.companyName;
      } else if (typeCode == "train") {
        cpyName = this.orderDetail.orderInfo.founderInfo 
          && this.orderDetail.orderInfo.founderInfo.companyName;
      } else if (typeCode == "hotel") {
        cpyName = this.orderDetail.companyName;
      }

      return cpyName;
    },
    //是否是保险的
    isInsurance: function() {
      let typeCode = this.orderType.toLowerCase();
      let flag = false;
      if (typeCode == "insurance") {
        flag =
          this.orderDetail.orderBase &&
          this.orderDetail.orderBase.type == "保险" &&
          !!this.orderDetail.orderBase.relatedOrderNo;
      } else {
        flag = false;
      }
      return flag;
    },
    prodName: function() {
      let typeCode = this.orderType.toLowerCase();
      let prodName, channelId;
      if (typeCode == "flight") {
        channelId =
          this.orderDetail.orderBase && this.orderDetail.orderBase.channelId;
        prodName = this.orderDetail.orderBase && this.orderDetail.orderBase.founderInfo 
          && this.orderDetail.orderBase.founderInfo.channelName;  
      } else if (typeCode == "insurance") {
        channelId =
          this.orderDetail.orderBase && this.orderDetail.orderBase.channelId;
          prodName = this.orderDetail.orderBase && this.orderDetail.orderBase.founderInfo 
          && this.orderDetail.orderBase.founderInfo.channelName;  
      } else if (typeCode == "train") {
        channelId = this.orderDetail.orderInfo.channelId;
        prodName = this.orderDetail.orderInfo.channelName;
      } else if (typeCode == "hotel") {
        prodName = this.orderDetail.channelName;
      }
      prodName = prodName || travelfun.getProdNameForId(channelId);
      return prodName;
    },
    contactMobile: function() {
      let typeCode = this.orderType.toLowerCase();
      let contactMobile;
      if (typeCode == "flight") {
        contactMobile =
          this.orderDetail.orderBase && this.orderDetail.orderBase.contactMobile;
      } else if (typeCode == "insurance") {
        contactMobile =
          this.orderDetail.orderBase && this.orderDetail.orderBase.contactPhone;
      } else if (typeCode == "train") {
        contactMobile = this.orderDetail.orderInfo.contactPhone;
      } else if (typeCode == "hotel") {
        contactMobile = this.orderDetail.contactPhone;
      }
      return contactMobile;
    },
    contactName: function() {
      let typeCode = this.orderType.toLowerCase();
      let contactName;
      if (typeCode == "flight") {
        contactName =
          this.orderDetail.orderBase &&
          this.orderDetail.orderBase.founderInfo && 
          this.orderDetail.orderBase.founderInfo.userName;
      } else if (typeCode == "insurance") {
        contactName =
          this.orderDetail.orderBase &&
          (this.orderDetail.orderBase.scheduledPersonName ||
            this.orderDetail.orderBase.contactName);
      } else if (typeCode == "train") {
        contactName = this.orderDetail.orderInfo.founderInfo && 
          this.orderDetail.orderInfo.founderInfo.userName;;
      } else if (typeCode == "hotel") {
        contactName = this.orderDetail.scheduledPersonName;
      }
      return contactName;
    },
    providerName: function() {
      let typeCode = this.orderType.toLowerCase();
      let providerName;
      if (typeCode == "flight") {
        providerName =
          this.orderDetail.orderBase &&
          this.orderDetail.orderBase.providerShortName;
      } else if (typeCode == "insurance") {
        providerName =
          this.orderDetail.orderBase &&
          this.orderDetail.orderBase.providerShortName;
      } else if (typeCode == "train") {
        providerName = this.orderDetail.orderInfo.supplierShortName;
      } else if (typeCode == "hotel") {
        providerName = this.orderDetail.supplierShortName;
      }
      return providerName;
    },
    orderBNo: function() {
      let typeCode = this.orderType.toLowerCase();
      let orderNo;
      if (typeCode == "flight") {
        orderNo =
          this.orderDetail.orderBase && this.orderDetail.orderBase.orderNo;
      } else if (typeCode == "insurance") {
        orderNo =
          this.orderDetail.orderBase && this.orderDetail.orderBase.orderNo;
      } else if (typeCode == "train") {
        orderNo = this.orderDetail.orderInfo.orderNo;
      } else if (typeCode == "hotel") {
        orderNo = this.orderDetail.orderNo;
      }
      return orderNo;
    },
    orderBNoOuter: function() {
      let typeCode = this.orderType.toLowerCase();
      let orderNo;
      if (typeCode == "flight") {
        orderNo =
          this.orderDetail.orderBase &&
          this.orderDetail.orderBase.supplierOrderNo;
      } else if (typeCode == "insurance") {
        orderNo =
          this.orderDetail.orderBase &&
          this.orderDetail.orderBase.supplierOrderNo;
      } else if (typeCode == "train") {
        orderNo = this.orderDetail.orderInfo.providerOrderNo;
      } else if (typeCode == "hotel") {
        orderNo = this.orderDetail.supplierOrderNo;
      }
      return orderNo;
    },
    userType: function() {
      let typeCode = this.orderType.toLowerCase();
      let userType;
      if (typeCode == "flight") {
        userType =
          this.orderDetail.orderBase && this.orderDetail.orderBase.useType;
      } else if (typeCode == "insurance") {
        userType =
          this.orderDetail.orderBase && this.orderDetail.orderBase.useType;
      } else if (typeCode == "train") {
        userType = this.orderDetail.orderInfo.useType;
      } else if (typeCode == "hotel") {
        userType = this.orderDetail.useType;
      }
      return travelfun.getUserType(userType);
    },
    payType: function() {
      let typeCode = this.orderType.toLowerCase();
      let pay = "---";
      if (typeCode == "flight") {
        pay =
          this.orderDetail.orderBase && this.orderDetail.orderBase.payTypeName;
      } else if (typeCode == "insurance") {
        pay =
          this.orderDetail.orderBase && this.orderDetail.orderBase.payTypeName;
      } else if (typeCode == "train") {
        pay = this.orderDetail.orderInfo.payName;
      } else if (typeCode == "hotel") {
        if (this.orderDetail.roomType == 0) {
          return "到店付";
        } else {
          pay = this.orderDetail.payTypeName;
        }
      }
      return pay || "---";
    },
    //订单的总价格
    payAmount: function() {
      let typeCode = this.orderType.toLowerCase();
      let amount;
      //				console.log("payAmount");
      if (typeCode == "flight") {
        //机票直接使用amount字段，以前是前端单独计算的。
        amount =
          this.orderDetail.orderBase && this.orderDetail.orderBase.amount;
      } else if (typeCode == "insurance") {
        amount =
          this.orderDetail.orderBase && this.orderDetail.orderBase.totalFarePremium;
      } else if (typeCode == "train") {
        amount = this.orderDetail.orderInfo.payAmount;
      } else if (typeCode == "hotel") {
        amount = this.orderDetail.payAmount;
      }
      return amount;
    },
    //价格明细列表
    priceList: function() {
      let result = [];
      let typeCode = this.orderType.toLowerCase();
      if (typeCode == "flight") {
        let part1 = [
          {
            name: "机票价",
            price:
              this.orderDetail.orderBase &&
              Number(this.orderDetail.orderBase.totalFare) > 0
                ? this.orderDetail.airLines[0].fare +
                  "*" +
                  this.orderDetail.airLines[0].passengers.length
                : ""
          },
          {
            name: "燃油费",
            price:
              this.orderDetail.orderBase &&
              Number(this.orderDetail.orderBase.totalOil) > 0
                ? this.orderDetail.airLines[0].oil +
                  "*" +
                  this.orderDetail.airLines[0].passengers.length
                : ""
          },
          {
            name: "机建费",
            price:
              this.orderDetail.orderBase &&
              Number(this.orderDetail.orderBase.totalTax) > 0
                ? this.orderDetail.airLines[0].tax +
                  "*" +
                  this.orderDetail.airLines[0].passengers.length
                : ""
          },
          {
            name: "服务费",
            price:
              this.orderDetail.airLines &&
              this.orderDetail.airLines.length > 0 &&
              this.orderDetail.airLines[0].passengers &&
              this.orderDetail.airLines[0].passengers.length > 0 &&
              Number(this.orderDetail.airLines[0].passengers[0].serFee) > 0
                ? this.orderDetail.airLines[0].passengers[0].serFee +
                  "*" +
                  this.orderDetail.airLines[0].passengers.length
                : ""
          },
          {
            name: "补款金额",
            price:
              this.orderDetail.orderBase &&
              Number(this.orderDetail.orderBase.extraMoneyAmount) > 0
                ? Number(this.orderDetail.orderBase.extraMoneyAmount)
                : 0
          }
        ];
        let part2 = [];
        if (
          !!this.orderDetail.insuredCountInfos &&
          this.orderDetail.insuredCountInfos.length > 0
        ) {
          this.orderDetail.insuredCountInfos.forEach(element => {
            let partItem = {};
            partItem.name = element.insuranceName;
            partItem.price =
              Number(element.farePrice) > 0
                ? element.farePrice + "*" + (element.insuredCount || 0)
                : "";
            part2.push(partItem);
          });
        }
        let part3 = [
          {
            name: "快递费",
            price:
              this.orderDetail.orderBase &&
              Number(this.orderDetail.orderBase.expressFareAmount) > 0
                ? Number(
                    this.orderDetail.orderBase.expressFareAmount || 0
                  ) + "*1"
                : 0
          },
          {
            name: "优惠券",
            price:
              this.orderDetail.orderBase &&
              Number(this.orderDetail.orderBase.couponReduceAmount) > 0
                ? this.orderDetail.orderBase.couponReduceAmount
                : "",
            negative: true
          }
        ];

        result = part1.concat(part2, part3);
      } else if (typeCode == "insurance") {
        //保险
        result = [
          {
            name:
              this.orderDetail.insuranceProduct.productShortName,
            price: this.orderDetail.insuranceProduct.farePrice
          }
        ];
      } else if (typeCode == "train") {
        let ticketList=[]
        if (
          this.orderDetail.orderPsgs &&
          this.orderDetail.orderPsgs.length > 0
        ) {
          for (let i = 0; i < this.orderDetail.orderPsgs.length; i++) {
            //乘客有改签单,且必须改签成功的才算。
            let psgHasChange = false;
            let ticket={}
            if (
              this.orderDetail.orderPsgs[i].changeOrderInfoList &&
              this.orderDetail.orderPsgs[i].changeOrderInfoList.length > 0
            ) {
              for(let j = 0;j < this.orderDetail.orderPsgs[i].changeOrderInfoList.length; j++){
                let changeOrder = this.orderDetail.orderPsgs[i].changeOrderInfoList[j]
                if(changeOrder.changeOrderStatus != "CHANGE_FAILED" && changeOrder.changeOrderStatus != "CHANGE_CANCELLED"
                     && changeOrder.changeOrderStatus != "SEAT_TAKEN_FAILED" && changeOrder.changeOrderStatus != "UNCHANGED"){
           
                    ticket.name = changeOrder.seatType + "(改签票)";                 
                    ticket.price = changeOrder.seatPrice;                  
                    ticket.count = 1;

                    psgHasChange = true;
                }
              }
            } 
            if(!psgHasChange) {
              //乘客无改签
              ticket.name = this.orderDetail.orderPsgs[i].seatType;                 
              ticket.price = this.orderDetail.orderPsgs[i].seatPrice;                  
              ticket.count = 1;              
            }
            let hasInlist =false//是否已经存储过
            for(let h=0;h<ticketList.length;h++){
              if(ticketList[h].name == ticket.name && ticketList[h].napriceme == ticket.price){
                ticketList[h].count+=1;              
                hasInlist = true;
                h==ticketList.length
              }
            }
            if(!hasInlist){
              ticketList.push(ticket)
            }
          }
        }

        ticketList.forEach(element => {
          result.push({
            name: element.name,
            price: element.price + "*" + element.count
          }); 
        });

        result = result.concat([
          //   {
          //     name: "保险费",
          //     price:
          //       !!this.orderDetail.orderPsgs &&
          //       this.orderDetail.orderPsgs.length > 0
          //         ? this.orderDetail.orderPsgs[0].saleInsurancePrice +
          //           "*" +
          //           this.orderDetail.orderPsgs.length
          //         : ""
          //   },
          {
            name: "手续费",
            price:
              !!this.orderDetail.orderPsgs &&
              this.orderDetail.orderPsgs.length > 0
                ? this.orderDetail.orderPsgs[0].outTicketPoundage +
                  "*" +
                  this.orderDetail.orderPsgs.length
                : ""
          }
          //   {
          //     name: "优惠券",
          //     price:
          //       Number(this.orderDetail.orderInfo.couponReduceAmount) > 0
          //         ? this.orderDetail.orderInfo.couponReduceAmount
          //         : "",
          //     negative: true
          //   }
        ]);
      } else if (typeCode == "hotel") {
        result = [
          {
            name: this.orderDetail.roomTypeName,
            price: this.orderDetail.payAmount
          }
        ];
        if (!!this.orderDetail.hotelNightlyRates) {
          for (let i = 0; i < this.orderDetail.hotelNightlyRates.length; i++) {
            let item = {
              name: this.orderDetail.hotelNightlyRates[i].currentDate,
              price:
                this.orderDetail.hotelNightlyRates[i].amount +
                "*" +
                this.orderDetail.roomCount +
                "间"
            };
            result.push(item);
          }
        }

        let Coupon = {
          name: "优惠券",
          price:
            Number(this.orderDetail.couponReduceAmount) > 0
              ? this.orderDetail.couponReduceAmount
              : "",
          negative: true
        };
        result.push(Coupon);
      } else {
        result = "";
      }
      return result;
    },
    limitTimeString: function() {
      this.limitTimeFilters();
      return this.limitTimeFilter;
    },
    getDialogHeight: function() {
      let result = 125;
      if (!!this.priceList && this.priceList.length > 0) {
        for (let i = 0; i < this.priceList.length; i++) {
          if (this.priceList[i].price > 0 || !!this.priceList[i].price) {
            result += 40;
          }
        }
      }
      //				console.log('getDialogHeight='+result);
      return result + "px";
    },
    /**
     * 领取、补录功能状态
     */
    exceptionProcessedStatus: function() {
      let resultStatus = -1; //默认状态-1
      let typeCode = this.orderType.toLowerCase();
      if (typeCode == "flight") {
        resultStatus =
          this.orderDetail.orderBase &&
          this.orderDetail.orderBase.bpProductExceptionProcessedStatus;
      } else if (typeCode == "train") {
        resultStatus = this.orderDetail.orderInfo
          .bpProductExceptionProcessedStatus;
      } else if (typeCode == "hotel") {
        resultStatus = this.orderDetail.bpProductExceptionProcessedStatus;
      } else if (typeCode == "insurance") {
        resultStatus = this.orderDetail.bpProductExceptionProcessedStatus;
      }
      return !(
        typeof resultStatus == "undefined" || resultStatus + "" == "null"
      )
        ? resultStatus
        : -1;
    },
    /**
     * 领取按钮的文字显示
     */
    exceptionHandlerID: function() {
      let staffId;
      let typeCode = this.orderType.toLowerCase();
      if (typeCode == "flight") {
        staffId =
          this.orderDetail.orderBase &&
          this.orderDetail.orderBase.customeServiceStaffId;
      } else if (typeCode == "train") {
        staffId = this.orderDetail.orderInfo.customeServiceStaffId;
      } else if (typeCode == "hotel") {
        staffId = this.orderDetail.customeServiceStaffId;
      } else if (typeCode == "insurance") {
        staffId = this.orderDetail.customeServiceStaffId;
      }
      return staffId;
    },
    /**
     * ExceptionOrderId显示
     */
    exceptionOrderId: function() {
      let staffId;
      let typeCode = this.orderType.toLowerCase();
      if (typeCode == "flight") {
        staffId =
          this.orderDetail.orderBase &&
          this.orderDetail.orderBase.exceptionOrderId;
      } else if (typeCode == "train") {
        staffId = this.orderDetail.orderInfo.exceptionOrderId;
      } else if (typeCode == "hotel") {
        staffId = this.orderDetail.exceptionOrderId;
      } else if (typeCode == "insurance") {
        staffId = this.orderDetail.exceptionOrderId;
      }
      return staffId;
    },
    /**
     * 领取按钮的文字显示
     */
    exceptionHandlerName: function() {
      let staff;
      let typeCode = this.orderType.toLowerCase();
      if (typeCode == "flight") {
        staff =
          this.orderDetail.orderBase &&
          this.orderDetail.orderBase.customeServiceStaff;
      } else if (typeCode == "train") {
        staff = this.orderDetail.orderInfo.customeServiceStaff;
      } else if (typeCode == "hotel") {
        staff = this.orderDetail.customeServiceStaff;
      } else if (typeCode == "insurance") {
        staff = this.orderDetail.customeServiceStaff;
      }
      return staff;
    },
    /**
     * 领取按钮的文字显示
     */

    exceptionProFailReason: function() {
      let staff;
      let typeCode = this.orderType.toLowerCase();
      if (typeCode == "flight") {
        staff = this.orderDetail.processFailReason;
      } else if (typeCode == "train") {
        staff = this.orderDetail.orderInfo.processFailReason;
      } else if (typeCode == "hotel") {
        staff = this.orderDetail.processFailReason;
      } else if (typeCode == "insurance") {
        staff = this.orderDetail.processFailReason;
      }
      return staff;
    },
    /**
     * 领取按钮的文字显示
     */
    orderItemFly: function() {
      let result = {
        orderNo: this.orderBNo,
        exceptionOrderId: this.exceptionOrderId,
        payAmount: this.payAmount,
        supplierOrderNo: this.orderBNoOuter,
        providerPhone: this.orderDetail.orderBase
          ? this.orderDetail.orderBase.providerPhone
          : "",
        providerType: this.orderDetail.orderBase
          ? this.orderDetail.orderBase.providerType
          : 0,
        providerShortName: this.orderDetail.orderBase
          ? this.orderDetail.orderBase.providerShortName
          : ""
      };
      return result;
    },
    /**
     * 酒店退款组件参数
     */
    orderItemHotelRefund: function() {
      let result = {
        orderNo: this.orderBNo,
        exceptionOrderId: this.exceptionOrderId
      };
      return result;
    },
    /**
     * 火车票退款组件参数
     */
    orderItemHotelTrain: function() {
      let result = {
        orderNo: this.orderBNo,
        exceptionOrderId: this.exceptionOrderId
      };
      return result;
    },
    orderItemIns: function() {
      let typeCode = this.orderType.toLowerCase();
      if (typeCode == "insurance") {
        //我们以异常单中心的列表为标准，构造统一对象
        let childOrders = [];
        if (
          this.orderDetail.insuredInfos &&
          this.orderDetail.insuredInfos.length > 0
        ) {
          for (
            let i = 0;
            i < this.orderDetail.insuredInfos.length;
            i++
          ) {
            let child = this.orderDetail.insuredInfos[i];
            let item = {
              insuredId: child.childOrderNo,
              status: child.status,
              errorMessage: child.errorMessage,
              cardType: child.insuredCertiType,
              cardNo: child.insuredCertiNo,
              name: child.insuredName,
              premium: child.premium,
              policyNo: child.policyNo,
              insuranceNum: child.insuranceNum,
              phone: child.insuredPhone,
              ticketNum: child.ticketNum,
              gender: child.insuredGender,
              birthDay: child.insuredBirthDay,
              exceptionOrder: child.exceptionOrder
            };
            childOrders.push(item);
          }
        }
        let result = {
          orderNo:
            this.orderDetail.orderBase && this.orderDetail.orderBase.orderNo,
          airLineCode: this.orderDetail.airLineBriefInfo.airLineCode,
          airlineName: this.orderDetail.airLineBriefInfo.airCompanyName,
          flightNo: this.orderDetail.airLineBriefInfo.flightNo,
          departCityName: this.orderDetail.airLineBriefInfo.departCityName,
          arriveCityName: this.orderDetail.airLineBriefInfo.arriveCityName,
          departTime: this.orderDetail.airLineBriefInfo.departTime,
          insuranceName: this.orderDetail.insuranceProduct.productName,
          insuranceShortName: this.orderDetail.insuranceProduct
            .productShortName,
          shortDescription: this.orderDetail.insuranceProduct.shortDescription,
          insPremium: this.orderDetail.insuranceProduct.farePrice,
          bpProductExceptionProcessedStatus: this.orderDetail
            .bpProductExceptionProcessedStatus,
          customeServiceStaff: this.orderDetail.customeServiceStaff,
          customeServiceStaffId: this.orderDetail.customeServiceStaffId,
          exceptionOrderId: this.orderDetail.exceptionOrderId,
          processFailReason: this.orderDetail.exceptionOrderId,
          providerType:
            this.orderDetail.orderBase &&
            this.orderDetail.orderBase.providerType,
          supplierOrderNo:
            tthis.orderDetail.orderBase &&
            his.orderDetail.orderBase.supplierOrderNo,
          providerShortName:
            this.orderDetail.orderBase &&
            this.orderDetail.orderBase.providerShortName,
          providerPhone:
            this.orderDetail.orderBase &&
            this.orderDetail.orderBase.providerPhone,
          insuredInfos: childOrders
        };
        return result;
      } else {
        return {};
      }
    }
  },
  data() {
    return {
      limitTime: 0, //倒计时
      limitTimeFilter: "", //
      limitTimeType: "", //机票是 舱位 车票是 坐席
      timeInterval: null,
      listflg: false,
      changeSty: false,
      isactive: 0,
      operationRecords: [], //订单操作记录列表
      recordEmpty: false,
      userTypeFlag: utils.userTypeSwitch,
      isAbnormal: this.$route.query.isAbnormal //是否来自于异常单中心
    };
  },
  created() {
    this.getOrderRecode();
  },
  mounted() {
    this.timeInterval && clearInterval(this.timeInterval);
  },
  distroyed: function() {
    this.timeInterval && clearInterval(this.timeInterval);
  },
  watch: {},
  methods: {
    /**
     * 获取订单操作记录
     */
    getOrderRecode() {
      let _this = this;
      let data = {
        orderNo: _this.$route.query.orderNo
      };
      let typeCode = this.orderType.toLowerCase();
      if (typeCode == "flight"){        
        tmHandler.getFlightOrderRecode(data).then(
          res => {
            if (res.result.operationRecords && res.resultCode == 0) {
              _this.operationRecords = res.result.operationRecords;
              _this.recordEmpty = true;
            } else {
            }
          },
          function(error) {
            console.info(error);
          }
        );        
      }else{
        tmHandler.getOrderRecode(data).then(
          res => {
            if (res.result.operationRecords && res.resultCode == 0) {
              _this.operationRecords = res.result.operationRecords;
              _this.recordEmpty = true;
            } else {
            }
          },
          function(error) {
            console.info(error);
          }
        );

      }
    },
    limitTimeFormat(value) {
      if (value && value >= 0) {
        return new Date(value * 1000).format("mm分ss秒");
      }
      return "";
    },
    limitTimeFilters() {
      let that = this;
      let typeCode = this.orderType.toLowerCase();
      if (typeCode == "flight") {
        that.limitTimeType = "舱位";
        if (
          this.orderDetail.orderBase &&
          that.orderDetail.orderBase.orderStatus == "UNPAID" &&
          !that.timeInterval
        ) {
          that.limitTime = !!that.orderDetail.orderBase
            ? that.orderDetail.orderBase.remainPayTime
            : 0; //单位秒
          that.setTimerForPay();
        }
      } else if (typeCode == "train") {
        that.limitTimeType = "坐席";
        if (
          that.orderDetail.orderInfo.orderStatus == "UNPAID" &&
          !that.timeInterval
        ) {
          that.limitTime = !!that.orderDetail.orderInfo
            ? that.orderDetail.orderInfo.remainPayTime
            : 0; //单位秒
          that.setTimerForPay();
        }
      }
    },
    setTimerForPay() {
      let that = this;
      if (that.limitTime > 0) {
        that.timeInterval = setInterval(function() {
          if (that.limitTime) {
            if (that.limitTime < 1) {
              clearInterval(that.timeInterval);
            } else {
              that.limitTime = that.limitTime - 1;
              that.limitTimeFilter = that.limitTimeFormat(that.limitTime);
            }
          } else {
            that.timeInterval && clearInterval(that.timeInterval);
            that.limitTimeFilter = that.limitTimeFormat(that.limitTime);
          }
        }, 1000);
      } else {
        that.limitTime = null;
        clearInterval(that.timeInterval);
        that.limitTimeFilter = that.limitTimeFormat(that.limitTime);
      }
    },
    orderMoreNote() {
      this.listflg = !this.listflg;
      this.changeSty = !this.changeSty;
      this.isactive = 0;
      if(this.listflg){
        this.getOrderRecode();
      }
    },
    changeColor(index) {
      this.isactive = index;
    },
    /**
     * 领取、补录功能结果
     */
    mbfRefreshPage() {
      //补录成功，刷新列表数据
      this.$emit("refreshPage");
    },
    //价格明细判断保险的显示与否
    judgeInsurance() {
      return (
        this.orderType.toLowerCase() == "insurance" &&
        this.orderDetail.insuredInfos &&
        this.orderDetail.insuredInfos.length > 0
      );
    },
    /**
     * 跳转到订单详情
     * @param typeName
     * @param typeCode
     */
    goFlightDetail(typeName, typeCode, orderNo) {
      this.$router.push({
        path: "/order/orderDetail",
        query: {
          typeName: typeName,
          typeCode: typeCode,
          orderNo: orderNo,
          isAbnormal: this.$route.query.isAbnormal
        }
      });
    }
  }
};
</script>
<style scoped lang="less">
@import "~styles/common.less";
//订单详情
@font-color-text1: #333333;
//已出票
@font-color-text2: #478aee;
//订单号
@font-color-text3: #7f7f7f;
//总金额数字
@font-color-text4: #f39800;
//退票成功
@font-color-text5: #25cb67;
//顺丰速递
@font-color-text6: #191919;
.orderBaseDiv {
  padding: 30px 40px;
  background: white;
  margin-bottom: 28px;
  .orderBaseTop {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px dashed @font-color-text3;
    .orderBaseTopContent {
      width: 100%;
    }
  }
  .orderBaseLine0 {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    line-height: 24px;
    .orderBaseNote {
      color: @font-color-text2;
      margin: 0 20px;
      font-size: 14px;
      display: flex;
      span {
        margin: 0 5px;
      }
    }
    .orderBaseMore {
      color: @font-color-text2;
      font-size: 14px;
      position: relative;
      cursor: pointer;
      .orderBaseList {
        color: @font-color-text2;
        position: absolute;
        padding: 20px;
        top: 30px;
        background-color: #fff;
        left: -170px;
        border: 1px solid #999;
        border-radius: 8px;
        box-shadow: 0 0 10px #999;
        z-index: 100000;
        cursor: pointer;
        max-height: 600px;
        overflow-y: auto;
        p {
          line-height: 30px;
          white-space: nowrap;
          display: flex;
          span {
            margin: 0 5px;
          }
          span:nth-child(2) {
            width: 400px;
            white-space: break-spaces;
          }
        }
        .expanded{
           white-space: break-spaces;
        }
      }
    }

    .blue {
      color: blue;
    }
    .orderStatusText {
      font-weight: bold;
      font-size: 24px;
    }
    .customerService {
      display: flex;
      align-content: flex-end;
      img {
        height: 20px;
        width: 20px;
      }
    }
  }
  .orderBaseLine1 {
    display: flex;
    justify-content: space-between;
    padding-bottom: 6px;
    margin-top: 30px;
    .note {
      margin: 10px 0;
      span {
        color: #25cb67;
      }
    }
    .orderNos {
      display: flex;
      > div {
        margin-right: 40px;
      }
    }
    .orderBaseAmount {
      display: flex;
      justify-content: space-around;
      align-items: baseline;
      .showButtonWrap {
        position: relative;
        margin-left: 20px;
        .orderBaseAmount3 {
          color: @font-color-text2;
          font-size: 14px;
        }
        .dialogShow {
          display: none;
          position: absolute;
          top: 30px;
          right: 0;
          height: 220px;
          width: 480px;
          padding: 20px;
          box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.5);
          background: #fff;
          z-index: 1;
          border-radius: 5px;
          overflow-y: scroll;
          .lineTitle {
            font-size: large;
            color: #333333;
            text-align: center;
            width: 30%;
            margin: 0 auto;
          }
          .lineTotal {
            font-size: x-large;
            // width: 30%;
            margin: 10px auto;
            display: flex;
            justify-content: center;
          }
          .lineDetail {
            border-top: 1px dashed #ebebeb;
            color: #333;
            font-size: 14px;
            display: flex;
            justify-content: space-between;
            div {
              margin: 10px 0;
            }
          }
        }
        .addReceodShow {
          position: absolute;
          display: none;
          top: 25px;
          right: 0;
          // height: 35px;
          line-height: 20px;
          width: 100px;
          padding: 5px;
          box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.5);
          background: #fff;
          z-index: 1;
          border-radius: 5px;
          .content {
            color: #7f7f7f;
            text-align: center;
          }
        }
      }
      .showButtonWrap:hover .dialogShow {
        display: block;
      }
      .showButtonWrap:hover .addReceodShow {
        display: block;
      }
    }
  }
  .orderBaseLine2 {
    display: flex;
    justify-content: flex-start;
    margin: 20px 0px 14px 0px;
    span {
      margin-right: 40px;
      color: @font-color-text1;
      font-size: 14px;
    }
  }
}
</style>
