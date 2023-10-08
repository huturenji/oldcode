<template>
  <div id="manualBookInsureBox">
    <div id="manualBookInsureBoxbg"></div>
    <div id="manualBookInsureContent">
      <div class="closeBtn" @click.stop="close"></div>
      <p class="boxhead">{{title}}</p>
      <div class="scroolContent">
        <div class="msgDetail">
          <manualBookInsureMsg :msgInsure="orderMsg" />
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
          </div>
          <div class="conditionDiv" :class="{'conditionDivUnable':recordType != 1}">
            <label class="conditionTitle">补录保费单价：</label>
            <input
              type="text"
              v-model.trim="outData.settlePrice"
              maxlength="64"
              :placeholder="placeholder1"
              :class="{'unAbleInput':recordType!=1}"
              :disabled="recordType!=1"
            />
            <div class="settlePriceDesc" :class="{'conditionDivUnable':recordType != 1}">
              <div>原保费单价：{{orderItem.insPremium}}</div>
              <div>{{placeholder6}}</div>
            </div>
          </div>
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
            >去购买</label>
          </div>
          <div
            class="conditionDiv"
            :class="{'conditionDivUnable':(recordType != 1||!!orderItem.supplierOrderNo)}"
          >
            <label class="conditionTitle">供应商订单编号：</label>
            <input
              type="text"
              v-model.trim="outData.outTradeNo"
              maxlength="64"
              :placeholder="placeholder2"
              :class="{'unAbleInput':recordType!=1}"
              :disabled="recordType!=1 || !!orderItem.supplierOrderNo"
            />
          </div>
          <div
            class="conditionDiv"
            v-for="(people,index) in orderPassengers"
            :key="people.insuredId"
            :class="{'conditionDivUnable':recordType != 1}"
          >
            <label class="conditionTitle">{{people.name}}的电子保单号：</label>
            <input
              type="text"
              v-model.trim="ticketNum[index]"
              :placeholder="'请输入'+people.name+'的电子保单号'"
              maxlength="64"
              :class="{'unAbleInput':recordType!=1}"
              :disabled="recordType!=1"
            />
          </div>
        </div>
        <div class="boxbtn">
          <a class="clickbtn confirm" href="javascript:void(0);" @click.stop="saveData">保存</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const manualBookInsureMsg = () => import("./insuranceinfo");
import tmHandler from "bislibs/requesthandler/traveloperationhandler.js";
import utils from "bislibs/utils";
import NP from "number-precision";
export default {
  props: ["orderItem", "toGetMsg"],
  directives: {},
  components: {
    manualBookInsureMsg
  },
  data() {
    return {
      recordType: -1, //
      recordTypeArr: [
        {
          text: "投保成功",
          value: 1
        },
        {
          text: "投保失败",
          value: 2
        }
      ],
      providerTypeArr: [],
      providerOrderUrl: null, //去订票的地址
      outData: {
        settlePrice: null,
        providerType: -1,
        outTradeNo: null,
        psgInfoList: []
      },
      ticketNum: [], //电子票号
      title: "补录",
      placeholder0: "请选择补录状态",
      placeholder1: "请输入补录时保费价格",
      placeholder2: "请输入供应商订单编号",
      placeholder4: "请输入电子保单号",
      placeholder5: "请选择供应商",
      placeholder6: "补录时的保费单价不能超过原保费单价",
      placeholder7: "请选择供应商或购买地址为空",
      orderMsg: {}, //接口获取的订单信息，用于页面显示
      orderPassengers: [] //订单乘客列表
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
      if (val != oldVal && val && val.insuredInfos) {
        //赋值乘客
        for (let i = 0; i < val.insuredInfos.length; i++) {
          let insure = val.insuredInfos[i];
          let psgIDs = val.bpProductExceptionPsgIds||[];
          //只有异常的乘客才需要输入
          if (
            (insure.exceptionOrder || !!insure.errorMessage) &&
            psgIDs.indexOf(insure.insuredId) != -1
          ) {
            result.push(insure);
          }
        }
      }
      that.orderPassengers = result;
    },
    /**
     * 供应商选择，动态获取订票URL
     */
    "outData.providerType": {
      handler: function(val, oldVal) {
        let that = this;
        that.getProviderUrl(val);
      },
      deep: true
    },
    recordType: {
      handler: function(val, oldVal) {
        let that = this;
        if (val == 2) {
          //投保失败，重置数据
          that.resetFormData();
        }
      },
      deep: true
    }
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
    resetFormData() {
      this.outData.settlePrice = null;
      //进入补录页面，默认展示当前订单供应商类型
      this.outData.providerType = this.orderItem.providerType || -1;
      this.outData.outTradeNo = this.orderItem.supplierOrderNo || null;
      this.outData.psgInfoList = [];
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
      that.orderMsg = that.orderItem || {};
    },
    /**
     * 接口调用供应商信息
     */
    getProviderMsg() {
      let that = this;
      let request = {};
      tmHandler.getBpInsuredProductProviderInfo(request).then(
        function(res) {
          // console.info("getProviderMsg---" + JSON.stringify(res));
          if (0 == res.resultCode && res.result.providerInfos) {
            that.providerTypeArr = res.result.providerInfos;
            //主动获取一次购买地址
            that.getProviderUrl(that.outData.providerType);
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
     * 根据type赋值URL
     */
    getProviderUrl(val) {
      let that = this;
      for (let i = 0; i < that.providerTypeArr.length; i++) {
        if (val == that.providerTypeArr[i].providerType) {
          that.providerOrderUrl = that.providerTypeArr[i].providerUrl;
          break;
        }
      }
    },
    /**
     * 关闭当前的弹框
     */
    close() {
      this.$emit("closeAddRecordPop");
    },
    /**
     * 保存操作
     */
    saveData() {
      const that = this;
      if (that.checkFromData()) {
        if (that.recordType == 1) {
          //出票成功带参输出
          let copyData = JSON.parse(JSON.stringify(this.outData));
          //电子票号动态赋值
          for (let i = 0; i < that.orderPassengers.length; i++) {
            //这里默认ticketNum的顺序与orderPassengers是一致的，只要下标一致，就能对应起来。
            let ticketInfo = {
              cardNo: that.orderPassengers[i].cardNo,
              name: that.orderPassengers[i].name,
              providerInsuredNo: that.orderPassengers[i].insuredId,
              policyNo: that.ticketNum[i] //用户输入的保单号
            };
            copyData.psgInfoList.push(ticketInfo);
          }
          that.processOrder(copyData);
        } else {
          that.processOrder();
        }
      }
    },
    /**
     * 校验页面的输入的数据
     */
    checkFromData() {
      const that = this;
      let result = false;
      // debugger;
      if (that.recordType == 1) {
        //投保成功
        if (!that.outData.settlePrice) {
          result = false;
          utils.showToast(that.placeholder1);
          return result;
        } else if (isNaN(parseFloat(that.outData.settlePrice))) {
          result = false;
          utils.showToast(that.placeholder1);
          return result;
        } else if (
          NP.minus(that.orderItem.insPremium, that.outData.settlePrice) < 0
        ) {
          result = false;
          utils.showToast(that.placeholder6);
          return result;
        } else if (that.outData.providerType == -1) {
          result = false;
          utils.showToast(that.placeholder5);
          return result;
        } else if (!that.outData.outTradeNo) {
          result = false;
          utils.showToast(that.placeholder2);
          return result;
        } else if (
          that.ticketNum &&
          that.ticketNum.length != that.orderPassengers.length
        ) {
          result = false;
          utils.showToast(that.placeholder4);
          return result;
        } else if (
          that.ticketNum &&
          that.ticketNum.length == that.orderPassengers.length &&
          that.checkTicketNumIsEmpty()
        ) {
          result = false;
          utils.showToast(that.placeholder4);
          return result;
        } else {
          result = true;
          return result;
        }
      } else if (that.recordType == 2) {
        //投保失败
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
    processOrder(processInfo) {
      const that = this;
      // debugger
      if (processInfo) {
        //补录成功
        let request = processInfo;
        request.exceptionOrderId = that.orderItem.exceptionOrderId;
        tmHandler.buyInsurance(request).then(
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
#manualBookInsureBox {
  background: transparent;
  z-index: 199;
}
#manualBookInsureBoxbg {
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

#manualBookInsureContent {
  position: fixed;
  _position: absolute;
  margin: 0;
  min-width: 740px;
  // height: -webkit-fit-content;
  // height: fit-content;
  top: 5%;
  // bottom: 5%;
  // max-height: 90vh;
  left: calc(~"50% - 370px");
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
  .scroolContent {
    max-height: 80vh;
    overflow-y: auto;
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
        width: 150px;
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
        width: 350px;
      }
      input.unAbleInput::-webkit-input-placeholder {
        /* WebKit, Blink, Edge */
        color: #bbbbbb;
      }
      .unAbleInput:-moz-placeholder {
        /* Mozilla Firefox 4 to 18 */
        color: #bbbbbb;
      }
      .unAbleInput::-moz-placeholder {
        /* Mozilla Firefox 19+ */
        color: #bbbbbb;
      }
      input.unAbleInput:-ms-input-placeholder {
        /* Internet Explorer 10-11 */
        color: #bbbbbb;
      }
      input.unAbleInput::-ms-input-placeholder {
        /* Microsoft Edge */
        color: #bbbbbb;
      }
      .unAbleInput {
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
        width: 350px;
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




