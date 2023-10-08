<template>
  <div class="selectGood">
    <div class="del">
      <i class="el-icon-delete" @click="deletegood"></i>
    </div>
    <div class="opeationbox">
      <gooditem :good="good" />
      <el-input-number
        class="inputnum"
        size="small"
        v-model="good.num"
        :precision="0"
        :step="1"
        :min="1"
        @change="handleChange"
      ></el-input-number>
    </div>
  </div>
</template>
<script>
import gooditem from "./goodItem.vue";
export default {
  components: {
    gooditem,
  },
  props: {
    good: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {
    deletegood() {
      this.$emit("delgood", this.good.goodId);
    },
    handleChange(value) {
      this.$emit("updateNum", { goodid: this.good.goodid, num: value });
    },
  },
};
</script>
<style lang="less" scoped>
.selectGood {
  display: flex;
  background: white;
  border: 1px solid #e2e2e2;
  // border-bottom: none;
  padding: 15px 50px 15px 0;
  .opeationbox {
    position: relative;
    flex: 1;
    .inputnum {
      position: absolute;
      bottom: 0px;
      right: 0;
    }
  }
  .del {
    cursor: pointer;
    width: 20px;
    display: flex;
    align-items: center;
    margin: 0 5px 0 10px;
    color: red;
  }
}
</style>