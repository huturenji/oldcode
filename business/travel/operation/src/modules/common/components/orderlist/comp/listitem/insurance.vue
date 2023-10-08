<template>
  <div class="order-item">
    <orderItemSummary :orderItem="orderItem || orderItem"></orderItemSummary>
    <div class="order-detail">
      <div class="order-detail-block">
        <div>
          <div class="InsuranceTitle">{{productShortName}}</div>
        </div>
        <div class="travel-info">
          <div>
            <span>{{departCityName}}</span>
            <span v-if="arriveCityName">——</span>
            <span>{{arriveCityName}}</span>
          </div>
          <span class="seat" v-if="airCompanyName">{{airCompanyName}}</span>
          <span class="seat" v-if="flightNo">{{flightNo}}</span>
        </div>
        <div v-if="departTime" class="travel-info">{{departTime}}</div>
      </div>

      <div class="order-detail-block">
        <div class="sub-label">被保人</div>
        <div class="single-text travel-person">{{InsuredNames}}</div>
      </div>
      <div class="order-detail-block">
        <div class="sub-label">金额</div>
        <div class="single-text red-font">￥{{amount}}</div>
      </div>
      <div class="order-detail-block">
        <div class="sub-label">订单状态</div>
        <div
          class="single-text"
          :class="['payStatus-'+(orderItem && orderItem.payStatus||orderItem.payStatus||0)]"
          :style="{color:orderStatusColor}"
        >{{orderStatus}}</div>
      </div>
      <div class="order-detail-block">
        <div class="sub-label">支付方式</div>
        <div class="single-text single-text1">{{payType}}</div>
        <div v-if="userTypeFlag"
          class="userTypeDiv"
          :class="'diff-'+(orderItem && orderItem.useType||orderItem.useType)"
        >{{userType}}</div>
      </div>
      <div
        class="order-detail-block centerBlock lastBlock"       
      >
        <div
          v-if="!orderItem.isAbnormal"
          class="button primary cursorp"
          @click.stop="goDetail(orderItem.type,orderItem.typeCode,orderItem&&orderItem.orderNo||orderItem.orderNo)"
        >订单详情</div>
        <!-- 领取和补录UI -->
        <div v-if="orderItem.isAbnormal && !(typeof PExceptionProcessedStatus== 'undefined' || PExceptionProcessedStatus + '' == 'null')">
          <manualBookingInsurance 
            v-if="!orderItem.bpProductExceptionType || orderItem.bpProductExceptionType == 2 || orderItem.bpProductExceptionType == 8"           
            :exceptionProcessedStatus="PExceptionProcessedStatus"
            :handlerId="PHandlerId"
            :handlerName="PHandlerName"
            :proFailReason="ProFailReason"          
            :orderItem="orderItemIns"
            @refreshPage="mbfRefreshPage"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const orderItemSummary = () => import("./listitemheader.vue");
const manualBookingInsurance = () =>
import("biscomponents/abnormal-order/insurance/insurance.vue");
import utils from "bislibs/utils";
import  * as travelfun from "bislibs/traveloperationfun.js";

export default {
  props: {
    orderItem: {
      //订单列表数据
      type: Object,
      required: true
    },
    mailPreData: {
      //邮寄报销凭证必要的数据
      type: Object,
      default: {
        proviceCityCounty: {}, //省市区数据
        senderAddressList: [], //发件人数据
        expressCompanies: [] //快递公司数据
      }
    }
  },
  directives: {},
  components: {
    orderItemSummary,
    manualBookingInsurance
  },
  data() {
    return {
      userTypeFlag: utils.userTypeSwitch,
      expressList: [], //物流信息列表
      expressArr: [] //物流公司列表
    };
  },
  computed: {
    //快递公司logo
    expressLogo: function() {
      //类似于飞机票的logo，拼接成本地的图片
      return travelfun.getExpressLogo(this.orderItem.expressInfo);
    },
    //订单状态
    orderStatus: function() {
      let status =
        (this.orderItem && this.orderItem.orderStatus) ||
        this.orderItem.orderStatus;
      return utils.getInsuranceOrderStatus(status);
    },
    customersArr: function() {
      return this.orderItem.passengers
        ? this.orderItem.passengers.split(",")
        : [];
    },
    //支付方式
    payType: function() {
      return this.orderItem.payTypeName  || this.orderItem.paymentPlatform 
					&& this.orderItem.paymentPlatform.payTypeName || travelfun.getDefaultName();
    },
    userType: function() {
      let utype =
        (this.orderItem && this.orderItem.useType) ||
        this.orderItem.useType;
      return travelfun.getUserType(utype);
    },
    //名字
    productShortName: function() {
      return (
        (this.orderItem.insuranceProduct &&
          this.orderItem.insuranceProduct.productShortName) ||
        this.orderItem.insuranceShortName || this.orderItem.productShortName
      );
    },
    //起飞城市
    departCityName: function() {
      return (
        this.orderItem.departCityName
      );
    },
    //到达城市
    arriveCityName: function() {
      return (
        this.orderItem.arriveCityName
      );
    },
    airCompanyName: function() {
      return (
        this.orderItem.airLineName || this.orderItem.airCompanyName
      );
    },
    flightNo: function() {
      return (
        this.orderItem.flightNo
      );
    },
    departTime: function() {
      return (
        this.orderItem.departTime
      );
    },
    InsuredNames: function() {
      if(this.orderItem.passengers){
        return this.orderItem.passengers
      }else if(this.orderItem.insuredInfos){
        let result="";
        for(let i=0;i<this.orderItem.insuredInfos.length;i++){
          result+= this.orderItem.insuredInfos[i].name;
          result+= (i==this.orderItem.insuredInfos.length-1)?"":","
        }
        return result;
      }else{
        return ""
      }

    },
    amount: function() {
      return (
        (this.orderItem && this.orderItem.amount) ||
        this.orderItem.payAmount
      );
    },
    PExceptionProcessedStatus: function() {
      return (
        (this.orderItem ?
          this.orderItem.bpProductExceptionProcessedStatus:null) ||
        this.orderItem.bpProductExceptionProcessedStatus
      );
    },
    PHandlerId: function() {
      return (
        (this.orderItem &&
          this.orderItem.customeServiceStaffId) ||
        this.orderItem.customeServiceStaffId
      );
    },
    PHandlerName: function() {
      return (
        (this.orderItem &&
          this.orderItem.customeServiceStaff) ||
        this.orderItem.customeServiceStaff
      );
    },
    ProFailReason: function() {
      return (
        (this.orderItem &&
          this.orderItem.processFailReason) ||
        this.orderItem.processFailReason
      );
    },
    orderItemIns: function() {
      //我们以异常单中心的列表为标准，构造统一对象
          
      //保险单价
      this.orderItem.insPremium = this.orderItem.insuredInfos ? this.orderItem.insuredInfos[0].premium : 0;
      return this.orderItem;
    },
    orderStatusColor: function() {
      let status =
        (this.orderItem && this.orderItem.orderStatus) ||
        this.orderItem.orderStatus;      
        return utils.getInsuranceOrderStatusColor(status);
    },       
  },
  watch: {
    mailPreData: {
      handler(val, oldVal) {
        let that = this;
        if (val != oldVal && !!val) {
          //快递公司数据列表
          that.expressArr = !!that.mailPreData.expressCompanies
            ? that.mailPreData.expressCompanies
            : that.expressArr;
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    //快递公司数据列表
    // this.expressArr = !!this.mailPreData.expressCompanies ? this.mailPreData.expressCompanies : this.expressArr;
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
    // document.body.addEventListener('click', function(e){
    //     if (e.target.className.indexOf('showButton') < 0) {
    //         that.showDialogWuliu = false;
    //     }
    // }, true)
  },
  beforeDestroy() {
    let that = this;
    // document.body.removeEventListener("click", function(e){
    //     if (e.target.className.indexOf('showButton') < 0) {
    //         that.showDialogWuliu = false;
    //     }
    // }, true)
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
    },
    /**
     * 领取、补录功能结果
     */
    mbfRefreshPage() {
      //补录成功，刷新列表数据
      this.$emit("refreshPage");
    }
  }
};
</script>
<style lang="less">
@import "./listitem.less";
.couponLoading {
  width: 150px;
  .weui-toast {
    width: 150px;
  }
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