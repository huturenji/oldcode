<template>
  <div id="manualBookFlightBox">
    <div id="manualBookFlightBoxbg"></div>
    <div id="manualBookFlightContent">
      <div class="closeBtn" @click.stop="close"></div>
      <p class="boxhead">{{title}}</p>
      <div class="msgDetail">
        <manualBookFlightMsg :msgFlight="orderMsg" :orderBase="orderItem" />
      </div>
      <div class="recordForm">
        <div class="conditionDiv">
          <label class="conditionTitle">补录状态：</label>
          <Select class="inSelect" v-model="recordType">
            <Option
              v-for="type in recordTypeArr"
              :key="type.value"
              :value="type.value"
            >{{type.text}}</Option>
          </Select>
          <div class="settlePriceDesc" :class="{'conditionDivUnable':recordType != 1}">
            <div>原机票价：{{alineLineFare}}</div>
            <div>补录时的机票价不能超过原机票价</div>
          </div>          
        </div>
        <!-- <div class="conditionDiv" :class="{'conditionDivUnable':recordType != 1}">
          <label class="conditionTitle">补录时机票价：</label>
          <input
            type="text"
            v-model.trim="outData.settlePrice"
            maxlength="64"
            :placeholder="placeholder1"
            :disabled="recordType!=1"
          />
          <div class="settlePriceDesc" :class="{'conditionDivUnable':recordType != 1}">
            <div>原机票价：{{alineLineFare}}</div>
            <div>补录时的机票价不能超过原机票价</div>
          </div>
        </div> -->
        <div class="conditionDiv" :class="{'conditionDivUnable':recordType != 1}">
          <label class="conditionTitle">供应商：</label>
          <Select class="inSelect" v-model="outData.providerType" :disabled="recordType!=1">
            <Option
              v-for="provider in providerTypeArr"
              :key="provider.providerType"
              :value="provider.providerType"
            >{{provider.providerName}}</Option>
          </Select>
          <label
            class="conditionOperation"
            :class="{'conditionOperationUn':recordType != 1}"
            @click.stop="gotoThirdOrder"
          >去订票</label>
        </div>
        <div class="conditionDiv" :class="{'conditionDivUnable':recordType != 1}">
          <label class="conditionTitle">供应商订单编号：</label>
          <input
            type="text"
            v-model.trim="outData.outTradeNo"
            maxlength="64"
            :placeholder="placeholder2"
            :class="{'unAbleInput':recordType!=1}"
            :disabled="recordType!=1"
          />
        </div>
        <div class="conditionDiv">
          <label class="conditionTitle">备注：</label>
          <input
            type="text"
            v-model.trim="outData.remark"
            maxlength="64"
            :placeholder="placeholder8"
          />
        </div>
      </div>
      <div class="boxbtn">
        <a class="clickbtn confirm" href="javascript:void(0);" @click.stop="saveData">保存</a>
      </div>
    </div>
  </div>
</template>

<script>
const manualBookFlightMsg = () => import("./flightinfo.vue");
import tmHandler from "bislibs/requesthandler/traveloperationhandler.js";
import utils from "bislibs/utils";

export default {
  props: ["orderItem", "toGetMsg"],
  directives: {},
  components: {
    manualBookFlightMsg
  },
  data() {
    return {
      recordType: -1, //
      recordTypeArr: [
        {
          text: "出票成功",
          value: 1
        },
        {
          text: "出票失败",
          value: 2
        }
      ],
      providerTypeArr: [],
      providerOrderUrl: null, //去订票的地址
      outData: {
        settlePrice: null,
        pnr: null,
        providerType: -1,
        outTradeNo: null,
        ticketInfoList: [],
        remark: null
      },
      ticketNum: [], //电子票号
      title: "补录",
      placeholder0: "请选择补录状态",
      placeholder1: "请输入补录时机票价",
      placeholder2: "请输入供应商订单编号",
      placeholder3: "请输入Pnr",
      placeholder4: "请输入电子客票号",
      placeholder5: "请选择供应商",
      placeholder6: "补录时的机票价不能超过原机票价",
      placeholder7: "请选择供应商或订票地址为空",
      placeholder8: "请输入备注", 
      orderMsg: [], //接口获取的订单信息，用于页面显示
      orderPassengers: [], //订单乘客列表
      alineLineFare: 0 //机票原价
    };
  },
  watch: {
    /**
     * 监听prop动态更新，刷新当前页面数据
     */
    toGetMsg: function(val, oldVal) {
      let that = this;
      if (val != oldVal && !!val) {
        this.initPageForm();
        that.getOrderMsg();
        that.getProviderMsg();
      }
    },
    /**
     * 通过接口获取的订单详情
     */
    orderMsg: function(val, oldVal) {
      let that = this;
      let result = [];
      if (val != oldVal && val && val.length > 0) {
        for (let i = 0; i < val.length; i++) {
          result = result.concat(val[i].passengers);
          //把原机票价格赋值
          that.alineLineFare = val[i].fare;
        }
      }
      //赋值乘客
      that.orderPassengers = result;
    },
    /**
     * 供应商选择，动态获取订票URL
     */
    "outData.providerType": {
      handler: function(val, oldVal) {
        let that = this;
        for (let i = 0; i < that.providerTypeArr.length; i++) {
          if (val == that.providerTypeArr[i].providerType) {
            that.providerOrderUrl = that.providerTypeArr[i].providerUrl;
            break;
          }
        }
      },
      deep: true
    },
    recordType: {
      handler: function(val, oldVal) {
        let that = this;
        if(val==2){//投保失败，重置数据
          that.resetFormData();
        }
      },
      deep: true
    },    
  },
  computed: {},
  created() {
    this.initPageForm();
  },
  mounted() {},
  methods: {
    initPageForm() {
      //默认出票成功
      this.recordType = this.recordTypeArr[0].value;
      this.resetFormData();
    },
    resetFormData(){
      this.outData.settlePrice = null;
      this.outData.pnr = null;
      this.outData.providerType = -1;
      this.outData.outTradeNo = null;
      this.outData.ticketInfoList = [];
      this.outData.remark = null;
      this.ticketNum = [];      
    },
    /**
     * 去第三方网站订票
     */
    gotoThirdOrder() {
      let that = this;
      if (that.recordType != 1) {
        return;
      } else if (that.providerOrderUrl && that.recordType == 1) {
        window.open(that.providerOrderUrl);
      } else {
        utils.showToast(that.placeholder7);
      }
    },
    /**
     * 接口调用订单信息
     */
    getOrderMsg() {
      let that = this;
      // console.log("getOrderMsg");
      let request = {
        bpProductNo: that.orderItem.orderNo
      };
      tmHandler.getBpProduct(request).then(
        function(res) {
          if (0 == res.resultCode && res.result.airLines) {
            that.orderMsg = res.result.airLines;
          } else {
            console.info(res);
          }
        },
        function(error) {
          console.info(error);
        }
      );
    },
    /**
     * 接口调用供应商信息
     */
    getProviderMsg() {
      let that = this;
      let request = {};
      tmHandler.getBpProductProviderInfo(request).then(
        function(res) {
          // console.info("getProviderMsg---" + JSON.stringify(res));
          if (0 == res.resultCode && res.result.providerInfos) {
            that.providerTypeArr = res.result.providerInfos;
          } else {
            console.info(res);
          }
        },
        function(error) {
          console.info(error);
        }
      );
    },
    /**
     * 关闭当前的弹框
     */
    close() {
      this.$emit("closeAddRecordPop");
    },
    /**
     * 保存按钮
     */
    saveData() {
      const that = this;
      if (that.checkFromData()) {
        if (that.recordType == 1) {
          //出票成功带参输出
          let copyData = JSON.parse(JSON.stringify(this.outData));
          delete copyData["settlePrice"]
          delete copyData["pnr"]
          delete copyData["ticketInfoList"]          
 
          that.processOrder(copyData, true);
        } else {
          that.processOrder({remark:this.outData.remark}, false);
        }
      }
    },
    /**
     * 校验页面的输入的数据
     */
    checkFromData() {
      const that = this;
      let result = false;

      if (that.recordType == 1) {
        if (that.outData.providerType == -1) {
          result = false;
          utils.showToast(that.placeholder5);
          return result;
        } else if (!that.outData.outTradeNo) {
          result = false;
          utils.showToast(that.placeholder2);
          return result;
        } else {
          result = true;
          return result;
        }
      } else if (that.recordType == 2) {
        //出票失败
        result = true;
        return result;
      } else {
        result = false;
        utils.showToast(that.placeholder0);
        return result;
      }
    },
    checkTicketNumIsEmpty() {
      const that = this;
      let ticketResult = false;
      for (let i = 0; i < that.ticketNum.length; i++) {
        if (!that.ticketNum[i]) {
          ticketResult = true;
          utils.showToast(that.placeholder4);
          break;
        }
      }
      return ticketResult;
    },
    /**
     * 补录操作
     */
    processOrder(processInfo, isOk) {
      const that = this;
      if (isOk) {
        //补录成功
        let request = processInfo;
        request.exceptionOrderId = that.orderItem.exceptionOrderId;
        tmHandler.buyAirlineTicket(request).then(
          function(res) {
            if (0 == res.resultCode) {
              utils.showToast("补录成功");
              that.$emit("submitAddRecord");
            } else {
              console.info(res);
              utils.showToast(res.resultMessage || "操作失败");
            }
          },
          function(error) {
            console.info(error);
            utils.showToast("操作失败");
          }
        );
      } else {
        //补录失败
        let request = {};
        request.exceptionOrderId = that.orderItem.exceptionOrderId;
        request.remark = processInfo && processInfo.remark || null;

        tmHandler.processFail(request).then(
          function(res) {
            if (0 == res.resultCode) {
              that.$emit("submitAddRecord");
            } else {
              console.info(res);
              utils.showToast(res.resultMessage || "操作失败");
            }
          },
          function(error) {
            console.info(error);
            utils.showToast("操作失败");
          }
        );
      }
    }
  }
};
</script>
<style lang="less">
@import "~styles/common.less";
@import "~styles/variables.less";
@import "~styles/mixins/mixins.less";
@line-height: 32px;
@font-color: #333333;
@placeholder-color: #b2b2b2;
#manualBookFlightBox {
  background: transparent;
  z-index: 199;
}
#manualBookFlightBoxbg {
  position: fixed;
  left: 0px;
  top: 0px;
  bottom: 0px;
  background-color: #000;
  width: 100%;
  /*宽度设置为100%，这样才能使隐藏背景层覆盖原页面*/
  height: 100%;
  filter: alpha(opacity=60);
  /*设置透明度为60%*/
  opacity: 0.6;
  /*非IE浏览器下设置透明度为60%*/
  z-index: 200;  
}

#manualBookFlightContent {
  position: fixed;
  _position: absolute;
  min-width: 700px;
  top: 5%;
  left: calc(~"50% - 370px");  
  margin: 0;
  max-height: 90vh;
  background-color: #fff;
  cursor: pointer;
  z-index: 201;
  text-align: center;
  overflow-y: auto;
  .closeBtn {
    background: url(~assets//icon_close_simple.png) no-repeat right
      #fff;
    height: 20px;
    margin: 5px 5px 0 0;
    background-size: contain;
  }
  .boxhead {
    color: #333333;
    font-weight: bold;
    // margin: 10px;
    font-size: 16px;
    text-align: center;
  }
  .msgDetail {
    border: 1px solid #e2e2e2;
  }
  .recordForm {
    // border: 1px solid #e2e2e2;
    margin: 5px;
    .conditionDiv {
      .flex-box;
      .flex-wrap(wrap);
      justify-content: flex-start;
      align-items: center;
      margin: 8px 0px;
      color: #333333;
      .conditionTitle {
        .flex(none);
        font-size: 14px;
        margin-left: 38px;
        margin-right: 14px;
        line-height: @line-height;
        display: inline-block;
        text-align: end;
        width: 130px;
        &:first-child {
          margin-left: 0;
        }
      }
      .conditionOperation {
        font-size: 14px;
        margin-left: 10px;
        color: #478aee;
        line-height: 30px;
        cursor: pointer;
      }
      .conditionOperationUn {
        color: #bbbbbb;
        cursor: not-allowed;
      }
      .settlePriceDesc {
        font-size: 12px;
        margin-left: 10px;
        text-align: left;
      }
      input {
        .flex(none);
        height: @line-height;
        line-height: @line-height;
        padding: 0px 12px;
        font-size: 14px;
        border: 1px solid #c4c4cc;
        border-radius: @radius-small;
        color: @font-color;
        background-color: initial;
        width: 400px;
      }
      input.unAbleInput::-webkit-input-placeholder { /* WebKit, Blink, Edge */
        color: #bbbbbb;
      }
      .unAbleInput:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
        color: #bbbbbb;
      }
      .unAbleInput::-moz-placeholder { /* Mozilla Firefox 19+ */
        color: #bbbbbb;
      }
      input.unAbleInput:-ms-input-placeholder { /* Internet Explorer 10-11 */
        color: #bbbbbb;
      }
      input.unAbleInput::-ms-input-placeholder { /* Microsoft Edge */
        color: #bbbbbb;
      }      
      .unAbleInput{
        border: 1px solid #bbbbbb;
      }      
      select {
        .flex(none);
        background: initial;
        padding: 0px 12px;
        font-size: 14px;
        border: 1px solid #c4c4cc;
        color: @font-color;
        border-radius: @radius-small;
        height: @line-height;
        outline: none;
        text-align: left;
      }
      .inSelect {
        width: 400px;
      }
    }
    .conditionDivUnable {
      color: #bbbbbb;
    }
  }
  .boxbtn {
    margin-bottom: 30px;
    display: flex;
    justify-content: space-evenly;
    .clickbtn {
      padding: 5px 25px;
      border: 1px solid #e2e2e2;
      border-radius: 2px;
      color: white;
    }
    .cancel {
      background: #bbbbbb;
    }
    .confirm {
      background: #478aee;
    }
  }
}
</style>
<style lang="less">
//因为iview是第三方组件，修改他的样式，不能使用scoped标记，需要单独一个style标签。
@import "~styles/myiview.less";
.ivu-select-selected-value,
.ivu-select-placeholder,
.ivu-select-item {
  text-align: left;
}
</style>




