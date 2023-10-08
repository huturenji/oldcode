<template>
    <div
        class="loading-container"
        :style="{position}"
    >
        <div class="loading-mask"></div>
        <div class="loading-content">
            <div class="container">
                <div class="loading-animate"></div>
                <div class="loading-text">
                    {{ text }}
                </div>
            </div>
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
        show: Boolean,
        text: {
            type: String,
            default:''
        },
        position:{
            type: String,
            default:'fixed'
        }
    }
}
</script>
<style lang="less" scoped>
.loading-container{
    text-align: center;
    width: 100%;
    height: 100%;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: 1999;
  .loading-mask{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
  .loading-content{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color:#fff;
    .container{
      text-align: center;
      position: relative;
    }
    .loading-animate{
      position: absolute;
      width: 0.44rem;
      height: 0.44rem;
      left: 50%;
      top:0;
      margin-left: -0.22rem;
      animation: cricleLoading 1s steps(12, end) infinite;
      background: transparent url("~themes/default/img/loading_gray.png") no-repeat;
      background-size:100%;
    }
    .loading-text{
      font-size: 14px;
      margin-top: 0.6rem;
      color: #333;
    }
  }
}
@-webkit-keyframes cricleLoading {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes cricleLoading {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
