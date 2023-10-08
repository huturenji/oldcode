<template>
  <div class="warp">
    <div class="onlineWarp" v-if="hasOnlineGood">
      <i class="el-icon-success"></i>
      <div class="success">创建成功</div>
      <SNTag type="warning" :text="xieyiTxt" />
      <div class="kefu">如有疑问，请联系客服：{{ companyInfo.account.phone }}</div>
      <div class="infoWarp">
        <div class="key">开户名</div>
        <div class="value">{{ companyInfo.account.name }}</div>
      </div>
      <div class="infoWarp">
        <div class="key">开户银行</div>
        <div class="value">{{ companyInfo.account.bank }}</div>
      </div>
      <div class="infoWarp">
        <div class="key">账号</div>
        <div class="value">{{ companyInfo.account.number }}</div>
      </div>
      <div class="infoWarp">
        <div class="key">金额</div>
        <div class="value last">
          <div class="price">￥</div>
          <div class="price num">{{ companyInfo.orderAmount }}</div>
        </div>
      </div>
      <div class="ok" @click="createOK">确定</div>
    </div>
    <div class="offlineWarp" v-else>
      <i class="el-icon-success"></i>
      <div class="success">创建成功</div>
      <div class="ok offOk" @click="createOK">确定</div>
    </div>
  </div>
</template>
<script>
import homelHandler from "bislibs/requestHandler/homehandler";
const SNTag = () => import("../sn-tag.vue");
export default {
  components: {
    SNTag,
  },
  props: {
    //在线类型奖品的总金额
    onlineTotalPrice: {
      type: Number,
      default: 0,
    },
    //奖品的类型，在线还是线下的。数据来源于new-lotttery的传入，跟缓存数据无关。
    hasOnlineGood: {
      type: Boolean,
      default: false,
    },
    inputData: {
      type: Object,
      default: {},
    }
  },
  data() {
    return {
      companyInfo: {
        account:{
          phone:'',
          name:'',
          bank:'',
          number:'',
        }
      },
      path_activityList: "/activity/list",
      xieyiTxt:
        "为确保活动正常进行，请将订单金额转入以下对公账户。如已与本公司签订活动合作协议的，请参考协议条款完成付款事宜。",
    };
  },
  created() {},
  mounted() {
    //如果是含有线上奖品，需要网络请求一些数据
    if (this.hasOnlineGood) {
        this.getOrderDeatil(this.inputData.result.orderId) 
    }
  },
  computed: {},
  methods: {
    //获取抽奖奖品
    getOrderDeatil(orderNo) {
        let _this = this;
        _this.$iLoading.show();
        let params = {
            orderNo:orderNo
        };
        homelHandler
            .detailOrder(params)
            .then((result) => {
                _this.$iLoading.hide();
                if (result.resultCode === 0) {
                    _this.companyInfo = result.result
                }
            })
            .catch((e) => {
                _this.$iLoading.hide();
            });
    },
    createOK() {
      this.$router.push({ path: this.path_activityList });
    },
  },
};
</script>
<style lang="less" scoped>
.el-icon-success {
  width: 63px;
  height: 63px;
  font-size: 63px;
  color: #23c343;
}
.warp {
  width: 100%;
  padding-top: 20px;
  .onlineWarp,
  .offlineWarp {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    .success {
      margin-top: 10px;
      font-size: 18px;
      font-weight: 600;
      color: #222;
      margin-bottom: 16px;
    }
    img {
      width: 300px;
      height: 170px;
      margin-bottom: 10px;
    }
    .kefu {
      margin: 16px 0 24px 0;
      color: #4e5969;
      font-size: 14px;
    }
    .infoWarp {
      margin-bottom: 16px;
      display: flex;
      width: 300px;
      .key {
        width: 100px;
        text-align: left;
        color: #4e5969;
      }
      .value {
        flex: 1;
        color: #1d2129;
      }
      .last {
        height: 30px;
        display: flex;
        align-items: baseline;
        .price {
          color: #f76560;
          font-size: 14px;
        }
        .num {
          font-size: 20px;
        }
      }
    }
    .ok {
      margin-top: 40px;
      width: 60px;
      height: 32px;
      background: #409eff;
      border-radius: 2px;
      color: #fff;
      line-height: 32px;
      text-align: center;
      cursor: pointer;
    }
    // .ok:hover {
    //   background-color: #666;
    // }
    .offOk {
      margin-top: 32px;
    }
  }
}
</style>