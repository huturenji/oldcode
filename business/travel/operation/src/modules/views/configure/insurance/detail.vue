<template>
  <div class="insuranceProductDetail">
    <!--顶部导航栏-->
    <div class="topNavigation">
      <div class="topNavLeft cursorp" @click="$router.go(-1);">
        <div class="topNavBackBtn"></div>
      </div>
      <div class="topNavMiddle">查看详情</div>
      <div class="topNavRight"></div>
    </div>
    <div class="detailDiv">
      <div class="itemLine" v-for="item in dataDetailList" :key="item.name">
        <div class="name">{{item.name}}</div>
        <div class="value" v-if="item.isHtml" v-html="item.value" />
        <div class="value" v-else>{{item.value}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import utils from "bislibs/utils";

export default {
  directives: {},
  components: {},
  data() {
    return {
      cacheRuleItem: "insuranceProduct",
      insTypeList: {
        1: "航意险",
        2: "航延险",
        3: "航意/航延险",
        4: "误机险",
        5: "交通意外险",
        6: "火车险",
        "AIRLINE_ACCIDENT_INSURANCE":"航空意外险",
        "AIRLINE_DELAY_INSURANCE":"航空延误险",
        "AIRLINE_ACCIDENT_AND_DELAY_INSURANCE":"航意航延组合险",
        "AIRLINE_MISSED_INSURANCE":"航意误机组合险",
        "ACCIDENT_INSURANCE":"交通意外险",
        "TRAIN_INSURANCE":"火车险"
      },
      dataDetail: null, //
      dataDetailList: [] //
    };
  },
  computed: {},
  watch: {},
  created() {
    this.initPageParam();
  },
  mounted() {},
  methods: {
    /**
     * 页面数据赋初值
     */
    initPageParam() {
      let that = this;
      that.dataDetail = JSON.parse(utils.getStorage(this.cacheRuleItem));

      let item = {
        name: "是否启用：",
        value: that.dataDetail.valid == "VALID" ? "是" : "否"
      };
      that.dataDetailList.push(item);
      item = {
        name: "保险简称：",
        value: that.dataDetail.productShortName
      };
      that.dataDetailList.push(item);
      item = {
        name: "产品ID：",
        value: that.dataDetail.productCode
      };
      that.dataDetailList.push(item);
      item = {
        name: "保险类型：",
        value: that.insTypeList[that.dataDetail.productType]
      };
      that.dataDetailList.push(item);
      item = {
        name: "保险全称：",
        value: that.dataDetail.productName
      };
      that.dataDetailList.push(item);
      item = {
        name: "公司名称：",
        value: that.dataDetail.companyName
      };
      that.dataDetailList.push(item);
      item = {
        name: "票面价格：",
        value: that.dataDetail.farePrice
      };
      that.dataDetailList.push(item);
      item = {
        name: "销售价格：",
        value: that.dataDetail.settlePrice
      };
      that.dataDetailList.push(item);
      item = {
        name: "描述：",
        value: that.dataDetail.shortDescription
      };
      that.dataDetailList.push(item);
      item = {
        name: "详情：",
        value: that.dataDetail.detailDescription,
        isHtml: true
      };
      that.dataDetailList.push(item);
    }
  }
};
</script>
<style scoped lang="less">
@import "detail.less";
</style>
