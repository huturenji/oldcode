<template>
  <div id="mailSucessBox">
    <div id="mailSucessBoxbg"></div>
    <div id="mailSucessContent">
      <div class="closeBtn" @click.stop="closeSuc"></div>
      <div class="top">
        <img src="~assets///order_sucess.png">
        <p class="boxhead">下单成功</p>
      </div>
      <div class="detail">{{showDetail}}</div>
      <div class="boxbtn">
        <span class="clickbtn confirm" @click.stop="closeSuc">确定</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["mailResponse"],
  components: {},
  data() {
    return {};
  },
  computed: {
    showDetail: function() {
      return (
        "下单成功（" +
        this.mailResponse +
        "），待快递员上门揽件；如需查看物流信息，请前往订单中心。"
      );
    }
  },
  methods: {
    closeSuc() {
      this.$emit("closeSucBox");
    }
  }
};
</script>
<style lang="less">
@import "~styles/common.less";
@import "~styles/variables.less";
@import "~styles/mixins/mixins.less";
#mailSucessBox {
  background: transparent;
  z-index: 299;
}
#mailSucessBoxbg {
  position: fixed;
  left: 0px;
  top: 0px;
  bottom: 0px;
  background-color: #000;
  width: 100%;
  /*宽度设置为100%，这样才能使隐藏背景层覆盖原页面*/
  height: 100%;
  filter: alpha(opacity=60);
  /*设置透明度为60%*/
  opacity: 0.6;
  /*非IE浏览器下设置透明度为60%*/
  z-index: 300;
}

#mailSucessContent {
  position: fixed;
  _position: absolute;
  margin: 0;
  width: 600px;
  height: fit-content;
  top: 30%;
  left: 35%;
  background-color: #fff;
  cursor: pointer;
  z-index: 301;
  text-align: center;
  .closeBtn {
    background: url(~assets//icon_close_simple.png) no-repeat right
      #fff;
    height: 20px;
    margin: 10px 10px 0 0;
    background-size: contain;
  }
  .top {
    text-align: center;
    img {
      width: 36px;
      height: 36px;
    }
    .boxhead {
      color: #191919;
      font-weight: bold;
      margin: 10px;
      font-size: 14px;
      text-align: center;
    }
  }
  .detail {
    margin: 20px;
  }
  .boxbtn {
    margin-bottom: 30px;
    display: flex;
    justify-content: space-evenly;
    .clickbtn {
      padding: 5px 25px;
      border: 1px solid #e2e2e2;
      border-radius: 2px;
      color: white;
    }
    .cancel {
      background: #7f7f7f;
    }
    .confirm {
      background: #478aee;
    }
  }
}
</style>
<style lang="less">
// .ivu-input{
//     border:null;
// }
// .ivu-input:hover{
//     border:null;
// }
</style>




