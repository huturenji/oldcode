<template>
<div class="loading-container">
    <div class="loading-mask"></div>
    <div class="loading-content">
        <div class="loading-animate"></div>
        <div class="loading-text">{{ text }}</div>
    </div>
</div>
</template>
<script>
export default {
  data() {
      return {
      }
  },
  props: {
    text: String,
  },
}
</script>
<style lang="less" scoped>
.loading-container{
  position: relative;
  text-align: center;
  .loading-mask{
    position: fixed;
    top:0;
    bottom:0;
    left:0;
    right:0;
    background: transparent;
    z-index: 1999;
  }
  .loading-content{
    position: fixed;
    left: 50%;
    top: 45%;
    z-index: 300;
    transform: translate(-50%,-45%);
    text-align: center;
    color:#fff;
    .loading-animate{
      display: inline-block;
      width: 0.44rem;
      height: 0.44rem;
      margin: 25px 0 10px;
      vertical-align: middle;
      animation: cricleLoading 1s steps(12, end) infinite;
      background: transparent url("~themes/default/img/loading_gray.png") no-repeat;
      background-size:100%;
    }
    .loading-text{
      font-size: 14px;
      color: #333;
    }
  }
}
@-webkit-keyframes cricleLoading {
  0% {
    transform: rotate3d(0,0,1,0deg);
  }
  100% {
    transform: rotate3d(0,0,1,360deg);
  }
}
@keyframes cricleLoading {
  0% {
    transform: rotate3d(0,0,1,0deg);
  }
  100% {
    transform: rotate3d(0,0,1,360deg);
  }
}
</style>
