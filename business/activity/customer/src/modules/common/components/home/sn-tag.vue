<template>
  <div class="snTag" :class="type">
    <i v-if="type == 'warning'" class="el-icon-warning"></i>
    <i v-if="type == 'error'" class="el-icon-circle-close"></i>

    <div class="textbox">{{ text }}</div>
  </div>
</template>

<script>
export default {
  name: "sn-tag",
  props: {
    //图标的类型
    type: {
      type: String,
      default: "warning",
    },
    text: {
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
.snTag {
  display: flex;
  align-items: center;
  padding: 10px;
  .textbox {
    margin: 0 10px;
    color: black;
    font-size: 14px;
  }
}
.warning {
  background: #fff7e8;
  border: 1px solid #ff9a2e;
}
.error {
  background: #fef0f0;
  border: 1px solid #f56c6c;
}
.el-icon-warning {
  height: 20px;
  line-height: 20px;
  font-size: 14px;
  color: #ff9a2e;
}
</style>