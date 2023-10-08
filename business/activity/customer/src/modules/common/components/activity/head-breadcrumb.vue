<template>
<div class="headbreadcrumb">
    <div class="lefttit" @click="goback">
        <i class="el-icon-arrow-left icon"></i>
        <p>{{ title }}</p>
    </div>
    <el-button v-show="showbtn" :type="type" @click="tabClick">{{btnName}}</el-button>
</div>
</template>

<script>
export default {
  name: "head-breadcrumb",
  props: {
    title: {
      type: String,
      default: "",
    },
    showbtn:{
      type: Boolean,
      default: false
    },
    btnName: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "default",
    },
  },
  watch: {
    
  },
  data() {
    return {
      showbtn:false
    };
  },
  created() {},
  mounted() {},
  methods: {
    tabClick(){
      this.$emit("tabClick");
    },
    goback(){
      this.$emit("goback");
    }
  },
};
</script>
<style scoped lang="less">
.headbreadcrumb{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 25px;
    font-size: 16px;
    color: #1D2129;
    border-bottom: 1px solid #E5E6E8;
    .lefttit{
        display: flex;
        align-items: center;
        font-weight: 600;
        cursor: pointer;
        .icon{padding-right: 10px;}
    }
}
</style>