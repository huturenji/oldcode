<template>
  <div class="goodsitem">
    <div class="imgbox">
      <el-image :src="good.img" lazy fit="cover"></el-image>
    </div>
    <div class="textbox">
      <div class="goodname" style="-webkit-box-orient: vertical">
        {{ '奖品名称：' + good.inputName }}
      </div>
      <div class="goodprice">
        <!-- <div class="pricebox">
          <div class="moneyUnit">￥</div>
          <div class="money">
            {{ good.price }}
          </div>
        </div> -->
        <div class="clickicons">
          <!-- <img
            v-if="selected"
            :src="require('assets/icon_choosed.png')"
            alt=""
          /> -->
          <div v-if="showNum">{{ "数量：" + showNum }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    good: {
      type: Object,
      default: {},
    },
    selected: {
      //是否显示选中效果
      type: Boolean,
      default: false,
    },
    showNum: {
      //是否显示 数量
      type: Number,
      default: 0,
    },
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>
<style lang="less" scoped>
.goodsitem {
  display: flex;
  background: white;
  .checkBox {
    display: flex;
    align-items: center;
    margin: 0 5px;
  }
  .imgbox {
    width: 70px;
    height: 70px;
    margin: 5px;
    border: 1px solid #e2e2e2;
  }
  .textbox {
    margin-left: 5px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    .goodname {
      font-size: 14px;
      max-height: 80px;
      color: black;
      font-weight: bold;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      /*autoprefixer: ignore next */
      -webkit-box-orient: vertical;
      margin-right: 16px;
    }
    .goodprice {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      .pricebox {
        display: flex;
        align-items: baseline;
        color: red;
        .moneyUnit {
          font-size: 14px;
        }
        .money {
          font-size: 18px;
        }
      }
      .clickicons {
        // width: 30px;
        margin-top: -11px;
        img {
          height: 24px;
        }
      }
    }
  }
}
</style>