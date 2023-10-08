<template>
  <div class="checkgood normalborder" @click="onGoodClick(onegood)">
    <div class="checkBox">
      <img
        v-if="selected"
        style="width: 16px; height: 16px; border: 1px solid #e2e2e2"
        :src="require('assets/icon_check.png')"
        :fit="fit"
      />
      <img
        v-else
        style="width: 16px; height: 16px; border: 1px solid #e2e2e2"
        :src="require('assets/icon_uncheck.png')"
        :fit="fit"
      />
    </div>
    <gooditem :good="onegood" />
  </div>
</template>
<script>
import gooditem from "./goodItem.vue";
export default {
  components: {
    gooditem,
  },
  props: {
    onegood: {
      type: Object,
      default: {},
    },
    selected: {
      type: Boolean,
      default: false,
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
  },
};
</script>
<style lang="less" scoped>
.checkgood {
  display: flex;
  background: white;
  border: 1px solid #e2e2e2;
  border-bottom: none;
  padding: 15px 50px 15px 0;
  .checkBox {
    display: flex;
    align-items: center;
    margin: 0 5px 0 10px;
  }
  .normalborder {
    border: 1px solid #e2e2e2;
  }
}
</style>