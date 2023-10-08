<template>
  <!--酒店手动退款模块-->
  <div class="manualRefundHotel">
    <div class="normalUI" v-if="exceptionProcessedStatus >= 0 && exceptionProcessedStatus <= 3">
      <div
        class="buttonAble"
        :class="{'buttonNoAble': receiveBtnUnable}"
        @click.stop="showProcessStartDialog"
      >{{receiveBtnText}}</div>
      <div class="bookBtnWrap">
        <div
          class="buttonAble"
          :class="{'buttonNoAble':bookBtnUnable,'buttonResultOk':exceptionProcessedStatus==2}"
          @click.stop="showHotelRefundDialog"
        >{{bookBtnText}}</div>
        <div class="addReceodShow content" v-if="isShowReceiveTip">
          <div class="content">{{addReceodNameTips}}</div>
        </div>
      </div>
      <div v-transfer-dom :show="isLoading">
        <Loading :show="isLoading" :text="loadingText" class="couponLoading"></Loading>
      </div>
      <div v-transfer-dom v-show="submitRefundHotel">
        <manualRefundHotelPop
          :toGetMsg="isToGetMsg"
          :orderItem="orderItem"
          @closeHotelRefundPop="closeHotelRefundPop"
          @submitManualRefund="submitManualRefund"
        />
      </div>
    </div>
    <div class="emptyUI" v-else></div>
  </div>
</template>

<script>
import InfoLabel from "biscomponents/infolabel/msglabel.vue";
const manualRefundHotelPop = () => import("./hotelconfirm.vue");
import utils from "bislibs/utils";
import  * as travelfun from "bislibs/traveloperationfun.js";
import tmHandler from "bislibs/requesthandler/traveloperationhandler.js";

export default {
  directives: {},
  components: {
    InfoLabel,
    manualRefundHotelPop
  },
  props: {
    /**
     * 手工退款状态码，0=待领取，1=已领取，2=出票成功，3=出票失败
     */
    exceptionProcessedStatus: {
      type: Number,
      default: -1,
      required: true
    },
    /**
     * 手工退款 处理人ID
     */
    handlerId: {
      type: String,
      required: false
    },
    /**
     * 手工退款 处理人姓名
     */
    handlerName: {
      type: String,
      required: false
    },
    /**
     * 手工退款 异常订单信息
     */
    orderItem: {
      type: Object,
      default: {
        orderNo: null,
        exceptionOrderId: null
      },
      required: true
    }
  },

  data() {
    return {
      isLoading: false, //是否显示提交加载框
      loadingText: "领取中...", //提交加载框提示语
      submitRefundHotel: false, //显示退款弹框
      isToGetMsg: false, //是否退款弹框要获取详情数据
      addReceodNameTips: "需要先领取" //退款按钮提示语
    };
  },
  created() {},
  mounted() {},
  watch: {
    /**
     * 手工退款状态码，0=待领取，1=已领取，2=出票成功，3=出票失败
     */
    exceptionProcessedStatus: {
      handler(val, oldVal) {},
      immediate: true,
      deep: true
    }
  },
  computed: {
    /**
     * 领取按钮的文字显示
     */
    receiveBtnText: function() {
      return travelfun.getProcessOrderName(
        this.exceptionProcessedStatus,
        this.handlerId,
        this.handlerName
      );
    },
    /**
     * 领取按钮状态是否不可点击，true不可点击、false可点击
     *
     */
    receiveBtnUnable: function() {
      let result =
        this.exceptionProcessedStatus == 3 ||
        this.exceptionProcessedStatus == 2 ||
        this.exceptionProcessedStatus == 1;
      return result;
    },
    /**
     * 退款按钮显示文字
     */
    bookBtnText: function() {
      let result = "";
      if (
        this.exceptionProcessedStatus == 0 ||
        this.exceptionProcessedStatus == 1 ||
        this.exceptionProcessedStatus == 3
      ) {
        //退款失败的订单不会在异常订单中移除，继续显示 退款，需要能够操作退款
        result = "退款";
      } else if (this.exceptionProcessedStatus == 2) {
        result = "退款成功";
      }
      return result;
    },
    /**
     * 退款按钮状态是否置灰,true置灰，false不置灰
     *
     */
    bookBtnUnable: function() {
      //待领取状态或非本人领取 置灰
      console.log("exceptionProcessedStatus="+this.exceptionProcessedStatus)
      let result =
        this.exceptionProcessedStatus == 0 ||
        (this.exceptionProcessedStatus == 1 &&
          !travelfun.isTheSameAccount(this.handlerId, this.handlerName));

      return result;
    },
    /**
     * 退款按钮是否显示 领取 提示框
     *
     */
    isShowReceiveTip: function() {
      //待领取状态 需要提示先领取
      let result = this.exceptionProcessedStatus == 0;
      return result;
    }
  },
  methods: {
    /**
     * 领取确认弹框
     */
    showProcessStartDialog() {
      const that = this;
      if (!that.receiveBtnUnable) {
        //非置灰情况，弹出确认框
        let title = "确定领取？";
        let content = "领取后其他用户将不能再领取。";
        travelfun.showConfirm(
          content,
          function() {
            //确定
            that.processStartRequest(that.orderItem.exceptionOrderId);
          },
          2,
          "取消",
          "确定",
          title,
          function() {
            //取消
          },
          true
        );
      } else {
        //置灰的情况，点击事件不响应
        // console.log("")
        return;
      }
    },
    /**
     * 接口调用领取
     */
    processStartRequest(orderNo) {
      let that = this;
      //   console.log("processStartRequest");
      var loginInfo = JSON.parse(utils.getStorage("TOMLoginInfo"));
      let request = {
        exceptionOrderId: orderNo,
        handlerId: tmHandler.userInfo && tmHandler.userInfo.userId,
        handlerName: tmHandler.userInfo && tmHandler.userInfo.userName
      };

      that.isLoading = true;
      tmHandler.processStart(request).then(
        function(res) {
          that.isLoading = false;
          if (0 == res.resultCode) {
            //领取成功，刷新当前页面数据
            that.$emit("refreshPage");
          } else {
            console.info(res);
            utils.showToast(res.resultMessage || "领取失败");
          }
        },
        function(error) {
          that.isLoading = false;
          console.info(error);
        }
      );
    },
    /**
     * 弹出退款页面
     *
     */
    showHotelRefundDialog() {
      const that = this;
      //已领取并且是当前登录人，弹出确认框
      if (
        that.exceptionProcessedStatus == 1 &&
        travelfun.isTheSameAccount(that.handlerId, that.handlerName)
      ) {
        that.isToGetMsg = true;
        that.openHotelRefundPop();
      } else {
        return;
      }
    },
    /**
     * 退款框显示
     */
    openHotelRefundPop() {
      this.submitRefundHotel = true;
    },
    /**
     * 退款框关闭
     */
    closeHotelRefundPop() {
      this.submitRefundHotel = false;
      this.isToGetMsg = false;
    },
    /**
     * 提交退款功能
     */
    submitManualRefund() {
      this.closeHotelRefundPop();
      //退款成功，刷新页面数据
      this.$emit("refreshPage");
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
.manualRefundHotel {
  background: white;
  .normalUI {
    width: 130px;

    .buttonAble {
      margin: 0px auto 0;
      width: 100px;
      line-height: 19px;
      color: @primary;
      border: 1px solid @primary;
      text-align: center;
      border-radius: 2px;
      cursor: pointer;
      // float: right;
      font-size: 12px;
      margin-top: 5px;
      word-break: break-all;
      &:hover {
        background: @primary;
        color: #fff;
      }
    }

    .buttonNoAble {
      float: none;
      cursor: auto;
      color: #7f7f7f;
      border: 1px solid #7f7f7f;
      &:hover {
        background: #fff;
        color: #7f7f7f;
      }
    }
    .buttonResultOk {
      float: none;
      color: #51d25e;
      cursor: auto;
      border: 1px solid #51d25e;
      &:hover {
        background: #fff;
        color: #51d25e;
      }
    }
    .buttonResultFail {
      float: none;
      color: red;
      cursor: auto;
      border: 1px solid red;
      &:hover {
        background: #fff;
        color: red;
      }
    }
    .bookBtnWrap {
      position: relative;
      margin-bottom: 10px;
      .addReceodShow {
        position: absolute;
        display: none;
        top: 25px;
        left: 15px;
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
    .bookBtnWrap:hover .addReceodShow {
      display: block;
    }
  }
  .emptyUI {
    font-size: 20px;
  }
}
</style>
