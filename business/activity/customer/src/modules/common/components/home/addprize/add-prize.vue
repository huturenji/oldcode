<template>
  <div class="adddprize">
    <div class="operationbox">
      <SNTag type="warning" :text="tabsSelTip" />
      <div
        :name="item.name"
        v-for="(item, index) in tabsDataSOurce"
        :key="index"
        class="tabbox"
      >
        <div class="labelbox activiteTab">
          <snTitle :title="item.label1"></snTitle>
          <div>{{ item.label2 }}</div>
        </div>
        <div>
          <addonlineprize v-if="item.name == '1'" @addonlineok="addonlineok" />
          <addofflineprize
            v-if="item.name == '2'"
            @addofflineok="addofflineok"
          />
        </div>
      </div>
    </div>
    <div class="privewbox" >
      <preview v-if="isYingxiaoActivity()" class="compBox" :previewData="previewData"></preview>
    </div>
  </div>
</template>
<script>
import { getAddPrizeData, isYingxiaoActivity } from "bislibs/home/newlottery-lifecycle";
//新增商品的组件
const preview = () => import("../priview/preview-lottery.vue");
const addofflineprize = () => import("./add-offline-prize.vue");
const addonlineprize = () => import("./add-online-prize.vue");
const SNTag = () => import("../sn-tag.vue");
const snTitle = () => import("biscomponents/home/sn-title.vue");
export default {
  components: {
    preview,
    addonlineprize,
    addofflineprize,
    SNTag,
    snTitle,
  },
  props: {
    inputData: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      tabsSelTip: "温馨提示：可以同时添加线上和线下的奖品",
      tabsDataSOurce: [
        {
          name: "1",
          label1: "线上",
          label2: "（添加线上商城商品）",
        },
        {
          name: "2",
          label1: "线下",
          label2: "（添加自有商品）",
        },
      ],
      previewData: {
        onlinePrizes: [],
        offlinePrizes: [],
      }, //预览所需数据
    };
  },
  created() {},
  mounted() {},
  methods: {
    addonlineok() {
      //发送事件，让主页面来拉一次数据
      this.$emit("addgoodsok");
      this.previewData.onlinePrizes = getAddPrizeData().onlinePrizes;
    },
    addofflineok() {
      this.previewData.offlinePrizes = getAddPrizeData().offlinePrizes;
    },
    //判断是否是营销类活动
    isYingxiaoActivity(){
        return isYingxiaoActivity()
    },    
  },
};
</script>
<style lang="less" scoped>
.adddprize {
  display: flex;
  height: calc(~"100vh - 305px");
  overflow: auto;
  .operationbox {
    flex: 1;
  }
  .privewbox {
    flex: 1;
    display: flex;
    justify-content: center;
  }
}
.labelbox {
  display: flex;
  align-items: center;
  color: #88929e;
  margin-bottom: 10px;
  h3 {
    font-weight: bold;
  }
}
.activiteTab {
  color: black;
}
.labelbox:hover {
  color: black;
}
.tabbox {
  margin: 10px 0;
  // border-bottom: 1px solid #e2e2e2;
}
</style>