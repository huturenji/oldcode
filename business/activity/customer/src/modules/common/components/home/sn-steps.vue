<template>
  <div class="snSteps">
    <div v-for="(step, index) in realSteps" :key="index" class="stepbox">
      <div class="infos">
        <div
          v-if="index != realSteps.length - 1"
          class="spaceline"
          :class="{ spacelineNowait: index < active }"
        ></div>
        <div class="icon" :class="{ iconNowait: index <= active }">
          {{ index + 1 }}
        </div>
      </div>
      <div class="title" :class="{ titleActive: active == index }">
        {{ step }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "sn-steps",
  props: {
    //当前的步骤，从0开始计数
    active: {
      type: Number,
      default: 0,
    },
    //步骤的数组
    steps: {
      type: Array,
      default: [],
    },
  },
  watch: {
    //动态控制realSteps 的大小，小于2个的输入将被丢弃
    steps: {
      handler() {
        if (this.steps.length > 1) {
          this.realSteps = this.steps;
        } else {
          this.realSteps = this.defaultSteps;
        }
      },
      immediate: true,
    },
  },
  data() {
    return {
      defaultSteps: ["步骤1", "步骤2"], //默认的步骤条数组
      realSteps: [], //UI显示的步骤数据数组
    };
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style scoped lang="less">
.snSteps {
  display: flex;
  .stepbox {
    flex: 1;
  }
  .infos {
    position: relative;
    text-align: center;
    .icon {
      margin-left: calc(~"50% - 12px");
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 2px solid;
      color: white;
      border-color: #88929e;
      background: #88929e;
    }
    .iconNowait {
      border-color: #478aee;
      background: #478aee;
    }
    .spaceline {
      position: absolute;
      margin: 0 8px;
      height: 2px;
      top: 11px;
      left: calc(~"50% + 12px");
      right: calc(~"-50% + 12px");
      background: #88929e;
    }
    .spacelineNowait {
      background: #478aee;
    }
  }
  .title {
    font-size: 16px;
    text-align: center;
    color: #88929e;
    margin-top: 8px;
  }
  .titleActive {
    color: black;
    font-weight: bold;
  }
}
</style>