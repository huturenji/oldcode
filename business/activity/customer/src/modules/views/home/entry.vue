<template>
  <div class="entry">
    <div v-for="(item, index) in gridDataArr" :key="index">
      <div class="aTitle">{{ item.title }}</div>
      <div class="gridbox">
        <div
          class="lotterybox"
          v-for="(lotttery, index) in item.lottterys || []"
          :key="index"
        >
          <el-image
            :src="lotttery.imgUrl"
            lazy
            fit="cover"
            class="backimg"
          ></el-image>
          <div class="mengban theName" v-if="!lotttery.isEnable">
            {{ notEnbaleText }}
          </div>
          <div class="prebox">
            <span class="theName">
              {{ lotttery.name }}
            </span>
            <el-button
              :type="lotttery.isEnable ? 'primary' : 'info'"
              :plain="!lotttery.isEnable"
              :disabled="!lotttery.isEnable"
              size="mini"
              @click="showConfirm(lotttery)"
              >{{ createText }}</el-button
            >
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      :title="dialogTitiel"
      center
      width="45%"
      close-on-press-escape="false"
      append-to-body="true"
      :visible="confirm2Create"
      @close="confirm2Create = false"
    >
      <div class="confirmCreate">
        <div class="privewbox">
          <el-image
            :src="selLottery && selLottery.previewUrl"
            lazy
            fit="contain"
            class="compBox"
          ></el-image>
        </div>
        <div class="detailbox">
          <div>
            <snTitle title="活动简介"></snTitle>
            <div>{{ selLottery && selLottery.activityTip }}</div>
          </div>
        </div>
      </div>
      <div class="dialogBtnBox">
        <el-button @click="cancleNewLottery()">取消</el-button>
        <el-button type="primary" @click="toNewLottery()">立即创建</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { utils, eventlistenerhandler } from "opcl";
import homelHandler from "bislibs/requestHandler/homehandler";
import { setCurrentLottery } from "bislibs/home/newlottery-lifecycle";
const snTitle = () => import("biscomponents/home/sn-title.vue");
export default {
  components: {
    snTitle,
  },
  data() {
    return {
      gridDataArr: [],
      AllCassifications: [
        { key: "yx", name: "营销活动抽奖" },
        { key: "nh", name: "公司年会抽奖" },
      ],
      path_newlottery: "/home/newlottery",
      newLotteryAuth: true,
      confirm2Create: false, //是否弹框
      selLottery: null,
      notEnbaleText: "开发中...",
      createText: "创建",
      dialogTitiel: "创建抽奖活动",
    };
  },
  created() {},
  mounted() {
    this.getLotteryTypes();
  },
  methods: {
    //获取抽奖类型数据
    getLotteryTypes() {
      let that = this;
      // that.$iLoading.show();
      // homelHandler
      //   .listLotteryType()
      //   .then((result) => {
      //     that.$iLoading.hide();
         
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //     that.$iLoading.hide();
      //   });
      
            let tempList = [
                {
                    "name": "大转盘",
                    "toolId": "1",
                    "cassifications": ['yx'],
                    "imgUrl": require('themes/default/img/icon/dzp.png'),
                    "previewUrl": require('themes/default/img/icon/dzp_view.png'),
                    "activityTip": "点击对应抽奖按钮，即可抽奖。",
                    "isEnable": true
                },
                {
                    "name": "砸金蛋",
                    "toolId": "2", 
                    "cassifications": ['yx'],
                    "imgUrl": require('themes/default/img/icon/zjd.png'),
                    "previewUrl": require('themes/default/img/icon/zjd_view.png'),
                    "activityTip": "点击对应抽奖按钮，即可抽奖。",
                    "isEnable": true
                },
                {
                    "name": "九宫格",
                    "toolId": "3",
                    "cassifications": ['yx'],
                    "imgUrl":require('themes/default/img/icon/jgg.png'),
                    "previewUrl":require('themes/default/img/icon/jgg_view.png'),
                    "activityTip": "点击对应抽奖按钮，即可抽奖。",
                    "isEnable": true
                },
                {
                    "name": "红包雨",
                    "toolId": "4",
                    "cassifications": ['yx'],
                    "imgUrl": require('themes/default/img/icon/hby.png'),
                    "previewUrl": require('themes/default/img/icon/hby_view.png'),
                    "activityTip": "点击对应抽奖按钮，即可抽奖。",
                    "isEnable": true
                },
                {
                    "name": "现场开奖",
                    "toolId": "5",
                    "cassifications": ['nh'],
                    "imgUrl": require('themes/default/img/icon/pic_home_xianchangkaijiang.png'),
                    "previewUrl": require('themes/default/img/icon/pic_home_xianchangkaijiang.png'),
                    "activityTip": "点击对应抽奖按钮，即可抽奖。",
                    "isEnable": true
                },
                {
                    "name": "定时抽奖",
                    "toolId": "dzc",
                    "cassifications": ['nh'],
                    "imgUrl":require('themes/default/img/icon/kaifa1.png'),
                    "previewUrl": require('themes/default/img/icon/kaifa1.png'),
                    "activityTip": "点击对应抽奖按钮，即可抽奖。",
                    "isEnable": false
                }          
            ]
            let yxList = [];
            let nhList = [];
            tempList.length &&
              tempList.forEach((element) => {
                if (
                  element.cassifications.indexOf(
                    that.AllCassifications[0].key
                  ) != -1
                ) {
                  yxList.push(JSON.parse(JSON.stringify(element)));
                }
                if (
                  element.cassifications.indexOf(
                    that.AllCassifications[1].key
                  ) != -1
                ) {
                  nhList.push(JSON.parse(JSON.stringify(element)));
                }
              });
            that.gridDataArr.push({
              title: that.AllCassifications[0].name,
              lottterys: yxList,
            });
            that.gridDataArr.push({
              title: that.AllCassifications[1].name,
              lottterys: nhList,
            });
    },
    showConfirm(lotttery) {
      if (!this.newLotteryAuth) {
        utils.showToast("没有权限");
        return;
      }
      this.selLottery = lotttery;
      // console.log(this.selLottery,homelHandler.userInfo)
      this.confirm2Create = true;
    },
    cancleNewLottery() {
      this.selLottery = null;
      this.confirm2Create = false;
    },
    toNewLottery() {
      // utils.showToast("创建优惠券");
      this.confirm2Create = false;
      setCurrentLottery(this.selLottery);
      this.$router.push({ path: this.path_newlottery});
    },
  },
};
</script>
<style lang="less" scoped>
.entry {
  padding: 24px;
  background: white;
  // height: 100%;
}
.gridbox {
  display: flex;
  flex-flow: wrap;
}
.aTitle {
  padding-top: 24px;
  font-size: 16px;
  font-weight: bold;
  color: black;
}
.theName {
  font-size: 14px;
  font-weight: bold;
}
.lotterybox {
  width: 165px;
  height: 195px;
  border: 1px solid #e2e2e2;
  position: relative;
  margin-right: 16px;
  margin-top: 16px;

  .backimg {
    position: absolute;
    width: 163px;
    height: 153px;
  }
  .prebox {
    position: absolute;
    width: 163px;
    margin-top: 153px;
    height: 40px;
    display: flex;
    background: white;
    justify-content: space-around;
    align-items: center;
    color: black;
  }
  .mengban {
    position: absolute;
    width: 163px;
    height: 153px;
    background: black;
    color: white;
    opacity: 0.6;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.confirmCreate {
  display: flex;
  height: 60vh;
  border-top: 1px solid #e2e2e2;
  padding-top: 15px;
  .privewbox {
    flex: 1;
    display: flex;
    justify-content: center;
    margin-right: 25px;
    .compBox {
      overflow-y: scroll;
      margin: 0 10px;
    }
  }
  .detailbox {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 10px 0;
  }
}
.dialogBtnBox {
  display: flex;
  justify-content: center;
  border-top: 1px solid #e2e2e2;
  padding-top: 15px;
}
</style>