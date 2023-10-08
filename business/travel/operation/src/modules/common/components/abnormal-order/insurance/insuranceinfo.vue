<template>
  <div id="manualBookInsureMsg">
    <!-- 保险详情 -->
    <div class="Insurance_box">
      <div class="orderBaseInfo">
        <div>商旅通订单号：{{msgInsure.orderNo}}</div>
        <div>供应商：{{parseProviderName()}}</div>
        <div>供应商订单号：{{msgInsure.supplierOrderNo}}</div>
      </div>
      <div class="flight_top">
        <img :src="require('assets//airlogo/'+ getAirLogo(msgInsure.airLineCode)+'.png')" />
        <div>{{msgInsure.airLineName}}{{msgInsure.flightNo}}</div>
        <div class="city">
          <span v-if="!!msgInsure.departCityName">{{msgInsure.departCityName}}</span>
          <span v-if="!!msgInsure.arriveCityName">—</span>
          <span v-if="!!msgInsure.arriveCityName">{{msgInsure.arriveCityName}}</span>
        </div>
        <div v-if="!!msgInsure.departTime" class="date">{{msgInsure.departTime}}</div>
      </div>
      <div class="insurance_detals">
        <div class="title">
          <span class="name">{{msgInsure.insuranceShortName}}</span>
          <span class="shot_name">{{msgInsure.shortDescription}}</span>
        </div>
        <div v-if="msgInsure.insuredInfos && msgInsure.insuredInfos.length>0" class="insurance_psg">
          <div v-for="(item, index) in childInsureList" :key="index" class="psg_item">
            <div class="tableLine" :class="{'darkBg':index==0}">
              <span>{{item.name}}</span>
              <span class="span2">{{item.cardType}}</span>
              <span class="span4">{{item.cardNo}}</span>
              <span>{{item.gender}}</span>
              <span class="span2">{{item.birthDay}}</span>
              <span class="span3">{{item.phone}}</span>
              <span class="span2">{{item.ticketNum}}</span>
              <span v-if="item.policyNo" class="span2">{{item.policyNo}}</span>
              <span>{{item.insuranceNum}}</span>
              <span>{{item.premium}}</span>
            </div>
            <div v-if="item.excetpionOrder" class="errorBox">
              <div class="imgDiv" />
              <div>{{item.errorTip}}</div>
              <div class="errmsg">{{item.errorMessage}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import utils from "bislibs/utils";
import  * as travelfun from "bislibs/traveloperationfun.js";
import InfoLabel from "biscomponents/infolabel/msglabel.vue";
export default {
  props: ["msgInsure"],
  directives: {},
  components: { InfoLabel },
  data() {
    return {
      headerLine: [
        "姓名",
        "证件类型",
        "证件号码",
        "性别",
        "出生日期",
        "手机号码",
        "票号",
        "保单号",
        "份数",
        "单价"
      ], //表头
      childInsureList: [] //保单列表
    };
  },
  watch: {
    /**
     * 监听prop动态更新，刷新当前页面数据
     */
    msgInsure: function(val, oldVal) {
      let that = this;
      // 动态赋值页面数据
      if (val && val.insuredInfos && val.insuredInfos.length > 0) {
        let result = [];
        let tabline = {
          name: that.headerLine[0],
          cardType: that.headerLine[1],
          cardNo: that.headerLine[2],
          gender: that.headerLine[3],
          birthDay: that.headerLine[4],
          phone: that.headerLine[5],
          ticketNum: that.headerLine[6],
          policyNo: that.headerLine[7],
          insuranceNum: that.headerLine[8],
          premium: that.headerLine[9]
        };
        //投保失败或者没有指定类型
        if(val.bpProductExceptionType==2 || !val.bpProductExceptionType){
          delete tabline["policyNo"]
        }
        result.push(tabline);
        for (let i = 0; i < val.insuredInfos.length; i++) {
          let insure = val.insuredInfos[i];
          let psgIDs = val.bpProductExceptionPsgIds || [];
          if (psgIDs.indexOf(insure.insuredId) != -1) {
            tabline = {
              name: insure.name,
              cardType: that.parseCardType(insure.cardType),
              cardNo: insure.cardNo,
              gender: that.parseGender(insure.gender),
              birthDay: new Date(insure.birthDay || "").format("yyyyMMdd"),
              phone: insure.phone,
              ticketNum: insure.ticketNum,
              policyNo: insure.policyNo||"---",
              insuranceNum: insure.insuranceNum + "份",
              premium: "￥" + insure.premium,
              excetpionOrder: insure.exceptionOrder || !!insure.errorMessage,
              errorTip: that.orderStatusDes(insure.status),
              errorMessage: "原因：" + insure.errorMessage
            };
            //投保失败或者没有指定类型
            if(val.bpProductExceptionType==2 || !val.bpProductExceptionType){
              delete tabline["policyNo"]
            }            
            result.push(tabline);
          }
        }
        that.childInsureList = result;
      }
    }
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    //供应商名称
    parseProviderName() {
      return (
        this.msgInsure.providerShortName ||
        travelfun.getProviderNameForId(this.msgInsure.providerType)
      );
    },
    /**
     * 解析证件的展示
     */
    parseCardType(cardType) {
      return utils.getCardTypeName(parseInt(cardType));
    },
    /**
     * 解析性别
     */
    parseGender(param) {
      return utils.getGenderName(parseInt(param));
    },
    /**
     * 动态获取航司Logo
     */
    getAirLogo(airCode) {
      return utils.getAirCpyLogo(airCode);
    },
    orderStatusDes(status) {
      return utils.getInsuranceOrderStatus(status);
    }
  }
};
</script>
<style scoped lang="less">
@import "~styles/common.less";
@import "~styles/variables.less";
@import "~styles/mixins/mixins.less";
#manualBookInsureMsg {
  background: #ffffff;
  .Insurance_box {
    margin-bottom: 0px;
    .orderBaseInfo {
      background: #478aee;
      font-size: 12px;
      color: #ffffff;
      display: flex;
      margin: 0 15px;
      padding: 10px 10px 0 10px;
      // justify-content: space-between;
      word-break: break-all;
      & > div {
        margin-right: 30px;
      }
    }
    .flight_top {
      margin: 0 15px;
      padding: 0 10px;
      font-size: 12px;
      background: #478aee;
      height: 30px;
      line-height: 30px;
      color: #fff;
      & > div {
        float: left;
      }
      .city {
        margin-left: 30px;
      }
      .date {
        margin-left: 30px;
      }
      img {
        float: left;
        margin-top: 5px;
        // margin-left: -15px;
        margin-right: 5px;
        width: 20px;
        height: auto;
      }
    }
    .insurance_detals {
      padding: 10px 20px;
      background: #fff;
      .title {
        max-width: 700px;
        .name {
          font-weight: bold;
          flex: 1;
        }
        .shot_name {
          flex: 3;
        }
        // border-bottom: 1px solid #ddd;
        padding-bottom: 10px;
        // margin-bottom: 20px;
        font-size: 16px;
        display: flex;
      }
      .insurance_psg {
        .psg_item {
          margin-bottom: 10px;
          border-bottom: 1px solid #e2e2e2;
          .tableLine {
            display: flex;
            justify-content: space-between;
            background: #ffffff;
            padding: 5px 0;
            font-size: 12px;
          }
          .darkBg {
            background: #e2e2e2;
          }
          span {
            // margin-right: 30px;
            width: 50px;
            word-break: break-all;
          }
          .span2 {
            width: 80px;
          }
          .span3 {
            width: 100px;
          }
          .span4 {
            width: 130px;
          }
          .errorBox {
            font-size: 12px;
            padding: 0 10px;
            color: red;
            display: flex;
            .imgDiv {
              margin-right: 5px;
              height: 16px;
              width: 16px;
              background: url(~assets//icon_mail_alert.png)
                no-repeat;
              background-size: 16px;
            }
            .errmsg {
              margin-left: 10px;
              word-break: break-all;
            }
          }
        }
      }
    }
  }
}
</style>




