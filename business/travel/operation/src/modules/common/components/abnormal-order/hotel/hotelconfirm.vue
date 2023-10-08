<template>
  <div id="manualRefundHotelBox">
    <div id="manualRefundHotelBoxbg"></div>
    <div id="manualRefundHotelContent">
      <div class="closeBtn" @click.stop="close"></div>
      <p class="boxhead">{{title}}</p>
      <div class="refundDetail">
        <div class="detailTitle">退款明细</div>
        <div class="amountDetailList">
          <div class="amountDetail" v-for="item in refundDetailList" :key="item">
            <div class="headerName">{{item.title}}</div>
            <div class="amount" :class="{'amountTotal':item.redColor}">{{item.amount}}</div>
          </div>
        </div>
      </div>

      <div class="boxbtn">
        <a class="clickbtn cancel" href="javascript:void(0);" @click.stop="close">取消</a>
        <a class="clickbtn confirm" href="javascript:void(0);" @click.stop="saveData">确定退款</a>
      </div>
    </div>
    <div v-transfer-dom :show="isLoading">
      <Loading :show="isLoading" :text="loadingText" class="couponLoading"></Loading>
    </div>    
  </div>
</template>

<script>
import tmHandler from "bislibs/requesthandler/traveloperationhandler.js";
import utils from "bislibs/utils";
export default {
  props: ["orderItem", "toGetMsg"],
  directives: {},
  components: {},
  data() {
    return {
      isLoading:false,
      loadingText: "退款中...", //提交加载框提示语          
      refundDetailList: [], //退款显示的 表格明细数据
      title: "退款",
      orderDetail:null,//通过接口获取补录信息
    };
  },
  watch: {
    /**
     * 监听prop动态更新，刷新当前页面数据
     */
    toGetMsg: function(val, oldVal) {
      let that = this;
      if (val != oldVal && !!val) {
        that.initPageForm();
        that.getBpDetail();
      }
    }
  },
  computed: {},
  created() {
    this.initPageForm();
  },
  mounted() {},
  methods: {
    initPageForm() {
      this.refundDetailList = [];
    },
    /**
     * 接口调用订单信息
     */
    getBpDetail() {
      let that = this;
      // console.log("getBpDetail");
      let request = {
        bpProductNo: that.orderItem.orderNo
      };
      tmHandler.getHotelDetailByBpProductNo(request).then(
        function(res) {
          if (0 == res.resultCode && res.result) {
            that.orderDetail = res.result
            that.getUIRefundDetail(that.orderDetail);
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
     * 接口组装退款明细信息
     */
    getUIRefundDetail(bpDetail) {
      let that = this;
      let result = [];
      let temp = {
        title: "订单总额",
        amount: "￥" + Number(bpDetail.totalPayAmount||0).toFixed(2)
      };
      result.push(temp);
      temp = {
        title: "优惠券扣减",
        amount: "￥" + Number(bpDetail.coupon||0).toFixed(2)
      };
      result.push(temp);
      temp = {
        title: "实付金额",
        amount: "￥" + Number(bpDetail.actualPayAmount||0).toFixed(2)
      };
      result.push(temp);
      temp = {
        title: "酒店扣费",
        amount: "￥" + Number(bpDetail.providerDeductAmount||0).toFixed(2)
      };
      result.push(temp);
      temp = {
        title: "实退金额",
        amount: "￥" + Number(bpDetail.travelBusinessRefundToConsumer||0).toFixed(2),
        redColor: true
      };
      result.push(temp);
      //赋值给UI展示
      that.refundDetailList = result;
    },

    /**
     * 关闭当前的弹框
     */
    close() {
      this.$emit("closeHotelRefundPop");
    },
    /**
     * 确认退款
     */
    saveData() {
      const that = this;
      let sucessMsg = "退款成功";
      let failMsg = "退款失败,请稍后重试";
      let request = {
        orderNo: that.orderItem.orderNo,
        exceptionOrderId: that.orderItem.exceptionOrderId,
        refundAmount: that.orderDetail.travelBusinessRefundToConsumer
      };
      that.isLoading = true;
      tmHandler.applyRefund(request).then(
        function(res) {
          that.isLoading = false;          
          if (0 == res.resultCode && res.result.success) {
            that.$emit("submitManualRefund");
            utils.showToast(sucessMsg);
          } else {
            console.info(res);
            utils.showToast(failMsg);
          }
        },
        function(error) {
          that.isLoading = false;          
          console.info(error);
          utils.showToast(failMsg);
        }
      );
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
#manualRefundHotelBox {
  background: transparent;
  z-index: 199;
}
#manualRefundHotelBoxbg {
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

#manualRefundHotelContent {
  position: fixed;
  _position: absolute;
  margin: 0;
  width: 800px;
  height: fit-content;
  top: 10%;
  left: 20%;
  background-color: #fff;
  cursor: pointer;
  z-index: 201;
  text-align: center;
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
  .refundDetail {
    margin: 10px;
    background: white;
    padding: 20px 50px;
    .detailTitle {
      color: #7f7f7f;
      font-size: 12px;
      text-align: left;
      margin-bottom: 5px;
    }
    .amountDetailList {
      display: flex;
      justify-content: flex-start;
    }
    .amountDetail {
      width: 150px;
      .headerName {
        color: #333333;
        font-size: 14px;
        font-weight: bold;
        background: #e2e2e2;
        padding: 10px;
      }
      .amount {
        color: #333333;
        font-size: 14px;
        padding: 10px;
      }
      .amountTotal {
        color: red;
      }
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




