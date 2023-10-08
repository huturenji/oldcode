<template>
  <div class="stateaction">
    <div class="leftbox">
      <slot name="component"></slot>
    </div>
    <div class="btnbox">
      <el-button v-if="isShowleftbtn" @click="onclickL">{{
        leftbtntext
      }}</el-button>
      <el-button v-if="isShowrightbtn" type="primary" @click="onclickR">{{
        rightbtntext
      }}</el-button>
    </div>
    <div class="rightBox" :style="{ visibility: 'hidden' }">
      <slot name="component"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "state-action",
  props: {
    type: {
      type: String,
      default: "progress",
    },
    leftbtntext: {
      type: String,
      default: "上一步",
    },
    rightbtntext: {
      type: String,
      default: "下一步",
    },
  },
  watch: {
    //动态控制两个按钮的显隐
    type: {
      handler() {
        this.isShowleftbtn =
          this.type == this.typeArr[1] || this.type == this.typeArr[2];
        this.isShowrightbtn =
          this.type == this.typeArr[0] || this.type == this.typeArr[2];
      },
      immediate: true,
    },
  },
  data() {
    return {
      typeArr: ["start", "end", "progress"], //默认是 progress， 状态 start 只有一个 下一步 按钮， end 只有一个 返回 按钮
      isShowleftbtn: true,
      isShowrightbtn: true,
      isShowFiller: false, //右边的填充物，为了保证 中间的 按钮 div 居中 设置的
    };
  },
  created() {},
  mounted() {},
  methods: {
    onclickL() {
      this.$emit("leftClick");
    },
    onclickR() {
      this.$emit("rightClick");
    },
  },
};
</script>

<style scoped lang="less">
.stateaction {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  border: 1px solid #e2e2e2;
  border-radius: 5px;
  box-shadow: 0px -10px 0px 0px #e2e2e2;
  .rightBox .leftbox {
    flex: 1;
  }
  .btnbox {
    flex: 1;
    display: flex;
    justify-content: center;
  }
}
</style>