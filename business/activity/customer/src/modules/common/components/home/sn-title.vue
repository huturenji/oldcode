<template>
  <div class="snTitle">
    <div class="divider"></div>
    <div class="theName">{{ title }}</div>
  </div>
</template>

<script>
export default {
  name: "sn-title",
  props: {
    //title的名字
    title: {
      type: String,
      default: "",
    },
  },

  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style scoped lang="less">
.snTitle {
  display: flex;
  .theName {
    font-size: 14px;
    font-weight: bold;
  }
  .divider {
    width: 2px;
    height: 20px;
    background: #478aee;
    margin-right: 8px;
  }
}
</style>