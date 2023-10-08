
<template>
  <section>
    <div v-if="isLoading" class="loading-container">
      <span>数据加载中...</span>
    </div>
    <div class="empty-message" v-if="!isLoading&&noFlag">
      <i class="icon"></i>未找到符合要求的订单，请修改条件重新查询
    </div>
    <div class="detailBox" v-if="!isLoading&&!noFlag">
      <div class="title">
        <ul>
          <li>类型</li>
          <li>商旅通订单号</li>
          <li>供应商订单号</li>
          <li>交易时间</li>
          <li>退款金额</li>
          <li>退款方式</li>
          <li>详情</li>
        </ul>
      </div>
      <div class="detailList" v-for="(item,index) in orderList" :key="index">
        <ul>
          <li>
            <img
              :src="require('assets//icon_'+orderType[item.orderType-1].eng+'.png')"
              alt
            />
            {{orderType[item.orderType-1].text}}
          </li>
          <li>{{item.orderNo}}</li>
          <li v-html="OuterOrderFormat(item)"></li>
          <li>{{item.refundDate}}</li>
          <li>{{item.refundAmount}}</li>
          <li v-html="item.payTypeName||'---'"></li>
          <!-- <li v-html="getPaymentNameFn(item.paymentPlatform)"></li> -->
          <li class="cursorp" @click="goDetail(item.orderType,item.orderNo)">查看详情</li>
        </ul>
      </div>
    </div>
    <page :page="pageMethod" @turnPage="pageChange" v-if="!isLoading&&!noFlag"></page>
    <!-- <Page :total="pageMethod.totalRecord" :current="pageMethod.currPage" @on-change="pageChange" v-if="!isLoading&&!noFlag" style="float:right;marginTop:16px;marginRight:24px"></Page> -->
  </section>
</template>
<script>
import tmHandler from "bislibs/requesthandler/traveloperationhandler.js";
import  * as travelfun from "bislibs/traveloperationfun.js";
import EmptyX from "components/empty/emptyxx.vue";
import page from "components/page/page";

export default {
  components: {
    EmptyX,
    page
  },
  props: {
    channelId: { default: null },
    useTypeId: { default: null },
    payTypes: { default: [] },
    companyId: { default: null },
    dateStart: { default: new Date() },
    dateEnd: { default: new Date() },
    searchStatus: { default: "" }
  },
  data() {
    return {
      isLoading: true,
      noFlag: false,
      orderList: [],
      pageMethod: {
        pageSize: 10,
        currPage: 1, // 当前页
        pageCount: 1, // 总页数
        totalRecord: 20
      },
      orderType: [
        { text: "机票", eng: "flight", capital: "Flight" },
        { text: "酒店", eng: "hotel", capital: "Hotel" },
        { text: "火车票", eng: "train", capital: "Train" },
        { text: "快递", eng: "express", capital: "Express" },
        { text: "保险", eng: "insurance", capital: "Insurance" },
        { text: "打车", eng: "taxi", capital: "Taxi" }
      ]
    };
  },
  created: function() {},
  methods: {
    OuterOrderFormat(order) {
      // 中文与单号分行显示
      let orderArr = [];
      orderArr.push(order.providerShortName);
      orderArr.push("<br>");
      orderArr.push(order.supplierOrderNo);
      return orderArr.join("");
    },
    getPaymentNameFn(payment) {
      // 获取支付方式
      let brIndex = travelfun.getPaymentName(payment).indexOf("(");
      let result = travelfun.getPaymentName(payment);
      let newArr = [];
      if (brIndex != -1) {
        newArr = result.split("");
        newArr.splice(brIndex, 0, "<br>"); // ()部分换行
      }
      return newArr.join("") || result;
    },
    pageChange(num) {
      let that = this;
      that.pageMethod.currPage = num;
      that.getRefundList();
    },
    goDetail(orderType, orderNo) {
      let that = this;
      // utils.setSession("travelManageDateStart", that.dateStart.getTime());
      // utils.setSession("travelManageDateEnd", that.dateEnd.getTime());
      // utils.setSession("travelManageCompanyId", that.companyId);
      // utils.setSession("travelManageUseTypeId", that.useTypeId);
      // utils.setSession("travelManagePayTypes", JSON.stringify(that.payTypes));
      // utils.setSession("travelManageProdId", that.channelId);
      // utils.setSession("travelManageCurrPage", that.pageMethod.currPage);
      var orderTypeName = that.orderType[orderType - 1].capital;
      this.$router.push({
        path: "/" + "order/orderDetail",
        query: {
          typeCode: orderTypeName,
          orderNo: orderNo
        }
      });
    },
    // turnPage(newPageNum) {
    //         console.log('末页',newPageNum)
    //     },
    getRefundList() {
      let that = this;
      that.isLoading = true;
      that.noFlag = false;
      that.$parent.totalRefCount = 0;
      let request = {
        pageIndex: that.pageMethod.currPage,
        pageSize: 10,
        companyId: that.companyId == "wuqiye" ? "" : that.companyId,
        queryBeginDate: that.dateStart.format("yyyy-MM-dd"),
        queryEndDate: that.dateEnd.format("yyyy-MM-dd"),
        // queryBeginDate:'2018-05-05',
        // queryEndDate:'2019-04-11',
        channelId: that.channelId,
        useType: that.useTypeId,
        payTypes: that.payTypes
      };
      for (var key in request) {
        if (!request[key] || request[key].length == 0) {
          delete request[key];
        }
      }
      tmHandler.getRefOrders(request).then(
        data => {
          if (
            data.result &&
            data.result.orders &&
            data.result.orders.length != 0
          ) {
            that.pageMethod.pageCount = data.result.totalPageCount; // 总页数
            that.pageMethod.totalRecord = data.result.totalRecord; // 总订单数
            that.orderList = data.result.orders;
            that.$parent.totalRefCount = data.result.totalRefCount;
            that.isLoading = false;
          } else {
            that.noFlag = true;
            that.isLoading = false;
          }
        },
        err => {
          that.isLoading = false;
          console.info(err);
        }
      );
    }
  },
  mounted() {
    let that = this;
    // if (utils.getSession("travelManageDateStart") != undefined) {
    //   that.$parent.dateStart = new Date(
    //     parseInt(utils.getSession("travelManageDateStart"))
    //   );
    //   tmHandler.removeSession("travelManageDateStart");
    // }
    // if (utils.getSession("travelManageDateEnd") != undefined) {
    //   that.$parent.dateEnd = new Date(
    //     parseInt(utils.getSession("travelManageDateEnd"))
    //   );
    //   tmHandler.removeSession("travelManageDateEnd");
    // }
    // if (utils.getSession("travelManageUseTypeId") != undefined) {
    //   that.$parent.useTypeId = utils.getSession("travelManageUseTypeId");
    //   tmHandler.removeSession("travelManageUseTypeId");
    // }
    // if (utils.getSession("travelManageCurrPage") != undefined) {
    //   that.pageMethod.currPage = parseInt(
    //     utils.getSession("travelManageCurrPage")
    //   );
    //   tmHandler.removeSession("travelManageCurrPage");
    // }
    that.$nextTick(() => {
      that.getRefundList();
    });
  },
  watch: {
    searchStatus(val) {
      this.pageMethod.currPage = 1;
      this.getRefundList();
    }
  },
  filters: {}
};
</script>
<style scoped lang="less" type="text/less">
@import "~styles/common.less";
@import "~styles/mixins/mixins.less";
@import "~styles/common.less";
@placeholder-color: #b2b2b2;
@w1: 92px;
@w2: 190px;
@w3: 180px;
@w4: 135px;
@w5: 55px;
@w6: 120px;
@w7: 56px;

section {
  .empty-message {
    .flex(auto);
    .flex-box;
    .flex-flow(column);
    .align-items(center);
    padding-top: 160px;
    padding-bottom: 160px;
    font-size: 14px;
    color: @placeholder-color;
    text-align: center;
    .icon {
      display: block;
      width: 81px;
      height: 92px;
      background: url(~assets//icon_empty.png)
        no-repeat 0 0 transparent;
      margin-bottom: 16px;
    }
  }
  .loading-container {
    text-align: center;
    height: 60px;
    font-size: 20px;
    line-height: 30px;
    padding-bottom: 160px;
    span {
      margin-top: 34px;
      height: 30px;
      text-align: center;
      padding-left: 35px;
      color: #7f7f7f;
      display: inline-block;
      background: url(~assets//loading.gif) no-repeat left;
      background-size: contain;
    }
  }

  box-sizing: border-box;
  padding: 24px 24px 100px;
  // height: 750px;
  //  height: 1134px;
  width: 100%;
  margin-top: 16px;
  background-color: #fff;
  border-radius: 2px;
  .detailBox {
    box-sizing: border-box;
    width: 100%;
    // max-height: 456px;
    max-height: 840px;
    border: 1px solid #ebebeb;
    border-radius: 4px;
    .title {
      height: 36px;
      background-color: #ebebeb;
      font-size: 12px;
      color: @fc-label;
      ul {
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 24px 0 17px;
        li {
          text-align: center;
          &:first-child {
            width: @w1;
            text-align: right;
          }
          &:nth-child(2) {
            width: @w2;
          }
          &:nth-child(3) {
            width: @w3;
          }
          &:nth-child(4) {
            width: @w4;
          }
          &:nth-child(5) {
            width: @w5;
          }
          &:nth-child(6) {
            width: @w6;
          }
          &:nth-child(7) {
            width: @w7;
          }
        }
      }
    }
    .detailList {
      color: @fc-normal;
      font-size: 14px;
      padding: 0 24px 0 17px;
      &:nth-child(2n + 1) {
        background-color: #f7f7f7;
      }
      ul {
        height: 80px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        li {
          text-align: center;
          &:first-child {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: @w1;
            img {
              width: 24px;
              height: 24px;
            }
          }
          &:nth-child(2) {
            width: @w2;
          }
          &:nth-child(3) {
            width: @w3;
          }
          &:nth-child(4) {
            width: @w4;
          }
          &:nth-child(5) {
            width: @w5;
          }
          &:nth-child(6) {
            width: @w6;
          }
          &:last-child {
            color: @font-blue;
            width: @w7;
          }
        }
      }
    }
  }
}
</style>
<style>
.ivu-page li {
  min-width: 24px;
  height: 24px;
  line-height: 24px;
}
</style>



