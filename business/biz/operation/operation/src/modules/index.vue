<template>
  <div>
    <keep-alive>
      <router-view
        v-if="$route.meta.keepAlive"
        class="child-view"
      ></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" class="child-view">
    </router-view>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="less">
html {
  height: 100%;
  font-size: 10000/750vw;
}

body {
  margin: 0px;
  padding: 0px;
  height: 100%;
  background-size: cover;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, SimSun, sans-serif;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
  touch-action: none;
}

.child-view {
  position: fixed;
  width: 100%;
  height: 100%;
  transition: all 0.3s;
  -moz-transition: all 0.3s;
  -webkit-transition: all 0.3s;
  -o-transition: all 0.3s;
  backface-visibility: hidden;
  perspective: 1000;
  background: #f2f3f5;
  max-width: auto;
}
</style>

