<template>
  <grid-layout :menuList="allMenuList"></grid-layout>
</template>

<script>
import menuList from "bislibs/menu/menu";
export default {
  name: "menuyw",
  data() {
    return {
      allMenuList: [],
    };
  },
  mounted() {
    this.allMenuList = this.getAllMenus();
  },
  methods: {
    getAllMenus() {
      return Object.create(menuList).menu;
    },
  },
};
</script>
<style lang="less" scoped>
</style>
