<template>
  <div class="twogoods">
    <div
      v-for="(onegood, index) in twogood"
      :key="index"
      class="normalborder"
      :class="{ selectedborder: onegood.clicked }"
      @click="onGoodClick(onegood)"
    >
      <gooditem :good="onegood" :selected="isGoodsClicked(onegood)" />
    </div>
  </div>
</template>
<script>
import gooditem from "./goodItem.vue";
import { isGoodsSelect } from "bislibs/home/newlottery-lifecycle";
export default {
  components: {
    gooditem,
  },
  props: {
    twogood: {
      type: Object,
      default: [],
    },
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {
    onGoodClick(onegood) {
      this.$emit("goodclick", onegood);
    },
    //判断搜索的商品是否已经被选中了
    isGoodsClicked(goods) {
      return isGoodsSelect(goods);
    },
  },
};
</script>
<style lang="less" scoped>
.twogoods {
  display: flex;
  justify-content: space-around;
  margin-bottom: 10px;
  .normalborder {
    border: 1px solid #e2e2e2;
  }
  .selectedborder {
    border: 1px solid #478aee;
  }
}
</style>