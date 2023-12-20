<template>
  <div>
    <page404 :tipsText="tipsText"></page404>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //复写如下的字段
      tipsText: "找不到这个页面啊！！",
    };
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>