<template>
  <div class="goodsitem">
    <div class="imgbox">
      <el-image class="img" :src="good.mainImage||good.imgUrl" lazy fit="cover">
        <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
        </div>
      </el-image>
    </div>
    <div class="textbox">
      <div class="goodname" style="-webkit-box-orient: vertical">
        {{ good.skuName||good.name }}
      </div>
      <div class="goodprice">
        <div class="pricebox">
          <div class="moneyUnit">￥</div>
          <div class="money">
            {{ good.price.toFixed(2) }}
          </div>
        </div>
        <div class="clickicons">
          <el-input-number size="mini" v-model="good.addCount" @change="handleChange" :min="0" label="奖品数量"></el-input-number>
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
  },
  data() {
    return {};
  },
  created() {},
  mounted() {
    // console.log(this.good)
  },
  methods: {
    handleChange(){
      let that = this
      // console.log(that.good.number)
      that.$emit("changeNum",that.good);
    }
  },
};
</script>
<style lang="less" scoped>
.goodsitem {
  display: flex;
  background: white;
  margin-bottom: 15px;
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
  .imgbox .img{width: 100%;height: 100%;}
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