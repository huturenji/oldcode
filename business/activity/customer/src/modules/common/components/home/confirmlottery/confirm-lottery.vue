<template>
  <div>
    <div class="warp">
      <div class="infowarp">
        <div class="info" v-if="newedLottery.settings">
          <snTitle title="基础信息"></snTitle>
          <div class="infokeywarp first">
            <div class="infokey">活动名称</div>
            <div class="infovalue">
              {{ newedLottery.settings.activityName }}
            </div>
          </div>
          <div class="infokeywarp" v-if="newedLottery.lotteryType">
            <div class="infokey">抽奖形式</div>
            <div class="infovalue">{{ newedLottery.lotteryType.name }}</div>
          </div>
          <div class="infokeywarp">
            <div class="infokey">中奖总概率</div>
            <div class="infovalue">
              {{ newedLottery.settings.winProbability + "%" }}
            </div>
          </div>
          <div class="infokeywarp">
            <div class="infokey">抽奖资格</div>
            <div class="infovalue">
                <div class="codeDatabox">
                    <el-table
                        :data="newedLottery.settings.inviteUserList"
                        stripe
                        :header-cell-style="{ background: '#F7F8FA',color:'#1d2129' }"
                        size="mini"
                        >
                        <el-table-column
                        align="center"
                        prop="userId"
                        label="用户ID">
                        </el-table-column>
                        <el-table-column
                        align="center"
                        prop="companyId"
                        label="企业ID">
                        </el-table-column>
                        <el-table-column
                        width="120"
                        align="center"
                        prop="channelId"
                        label="渠道ID">
                        </el-table-column>
                    </el-table>
                </div>

            </div>
          </div>
          <div class="infokeywarp">
            <div class="infokey">抽奖次数限制</div>
            <div class="infovalue">
              {{
                getATimeNumStr(
                  newedLottery.settings.numRafflesTotal,
                  newedLottery.settings.noNumRafflesTotal,
                  newedLottery.settings.numRafflesDay,
                  newedLottery.settings.noNumRafflesDay
                )
              }}
            </div>
          </div>
          <div class="infokeywarp">
            <div class="infokey">中奖次数限制</div>
            <div class="infovalue">
              {{
                getATimeNumStr(
                  newedLottery.settings.numWinTotal,
                  newedLottery.settings.noNumWinTotal,
                  newedLottery.settings.numWinDay,
                  newedLottery.settings.noNumWinDay
                )
              }}
            </div>
          </div>
          <div class="infokeywarp">
            <div class="infokey">活动规则</div>
            <div class="infovalue">
              <div v-html="newedLottery.settings.activityRule"></div>
            </div>
          </div>
        </div>
        <div
          class="prize"
          v-if="newedLottery.prize && newedLottery.prize.listMap"
        >
          <snTitle title="奖品信息"></snTitle>
          <div
            v-for="(item, index) in newedLottery.prize.listMap.online"
            :key="index"
            class="goodsWarp"
          >
            <div class="prizeNum">线上奖品（奖品{{ numTranspor(index) }}）</div>
            <div class="prizeName">
              <div class="prizekey">奖品名称</div>
              <div>
                {{ item.inputName }}
              </div>
            </div>
            <div class="goodsBox">
              <gooditem :good="item" :showNum="item.num" />
            </div>
            <div class="prizeName">
              <div class="prizekey">奖品图片</div>
              <img
                v-if="item.selectedImg"
                class="img"
                :src="item.selectedImg"
              />
              <div v-else>未上传</div>
            </div>
            <div class="prizeName">
              <div class="prizekey">兑奖方式</div>
              <div>在线领取</div>
            </div>
          </div>
          <div
            v-for="(item, index) in newedLottery.prize.listMap.offline"
            :key="index"
            class="goodsWarp"
          >
            <div class="prizeNum">
              线下奖品（奖品{{ numTranspor(index) }}）：{{
                getOffPrizeTypes(item.offPrizeType)
              }}
            </div>
            <div class="prizeName">
              <div class="prizekey">奖品名称</div>
              <div>
                {{ item.name }}
              </div>
            </div>
            <div class="prizeName">
               <div class="prizekey">奖品图片</div>
              <img class="img" :src="item.selectedImg" />
            </div>
            <div class="prizeName">
              <div class="prizekey">奖品数量</div>
              <div>{{ item.num }}</div>
            </div>
            <div class="prizeName">
              <div class="prizekey">兑奖方式</div>
              <div>{{ getAwardingTypes(item.exchangeType) }}</div>
            </div>
            <div v-if="item.exchangeType == 'othercode'" class="prizeName">
              <div class="prizekey">领取链接</div>
              <div>{{ item.exchangeUrl }}</div>
            </div>
            <div
              v-if="
                item.exchangeType == 'bpluscode' ||
                item.exchangeType == 'othercode'
              "
              class="prizeName"
            >
              <div class="prizekey">兑奖码</div>
              <img
                class="couponimg"
                :src="require('assets/newactivity/icon_excel.svg')"
                @click="downTemplate(item.voucherUrl)"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="privewbox">
        <preview
          class="compBox"
          :previewData="previewData"
          :count="settingData.numRafflesDay"
          showQRCode
        ></preview>
        <el-button class="btn" type="primary" @click="preview">预览</el-button>
      </div>
      <el-dialog
        title="预览"
        :visible.sync="showPreview"
        :modal-append-to-body="false"
        :destroy-on-close="true"
        width="30%"
        center
      >
        <div class="qrcodeWarp">
          <div>扫一扫即可试用抽奖活动</div>
          <div id="qrcode" class="qrcode" ref="qrcode"></div>
          <div>
            因抽奖活动尚未发布，所以抽奖结果仅为体验效果，不作为领取奖品的凭证
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
const gooditem = () => import("../addprize/goodItem.vue");
const preview = () => import("../priview/preview-lottery.vue");
import {
  num2Chinese,
  getAddPrizeData,
  geSettingLotteryData,
  createPreviewLottery,
  awardingTypes,
  myoffPrizeTypes,
} from "bislibs/home/newlottery-lifecycle";
import QRCode from "qrcodejs2";
const snTitle = () => import("biscomponents/home/sn-title.vue");
import { utils } from "opcl";
export default {
  props: {
    //这里的输入数据，集合了前两部的奖品和活动设置数据
    inputData: {
      type: Object,
      default: {},
    },
  },
  components: {
    gooditem,
    preview,
    snTitle,
  },
  data() {
    return {
      settingData: geSettingLotteryData().settingData,
      newedLottery: {},
      previewData: {
        goodsType: 1, //添加的商品是线上还是线下
        onlinePrizes: [],
        offlinePrizes: [],
      }, //预览所需数据
      link: "",
      showPreview: false,
      preActicityId: "", //预览所需id
      firstLoad: false, //是否已经执行了mounted，是否是首次执行
    };
  },
  watch: {
    inputData: {
      handler() {
        this.getLotteryData();
      },
      immediate: true,
      deep: true,
    },
  },
  created() {},
  mounted() {
    //首次进来会执行一次
    this.firstLoad = true;
    this.getGoodsData();
  },
  activated() {
    //防止与mounted重复执行
    if (!this.firstLoad) {
      this.getGoodsData();
    }
  },
  deactivated() {
    this.firstLoad = false;
  },
  computed: {},
  methods: {
    numTranspor(numindex) {
      return num2Chinese(numindex);
    },
    //弹出预览二维码
    preview() {
      //获取预览活动id后在弹出预览
      createPreviewLottery(this.inputData, this).then((res) => {
        this.preActicityId = res.result.activityId;
        let hostname = window.location.hostname;
        let hostMap = {
          "bplusdev.sinosun.com": "https://bplusdev.sinosun.com:18180",
          "bplussit.sinosun.com": "https://bplussit.sinosun.com:18380",
          "bplus-uat.sinosun.com": "https://bplus-uat.sinosun.com",
          "cloud.sinosun.com": "https://cloud.sinosun.com",
        };
        let link =
          (hostMap[hostname] || "https://cloud.sinosun.com") +
          "/activitystudio/static/mobile/index.html#/pages/luck-draw/preview-luck-draw?type=preview&closeTo=1&activityId=" +
          this.preActicityId;
        this.link = link;
        this.showPreview = true;
        this.$nextTick(() => {
          //等待弹窗渲染再生成二维码，不然会报错
          this.qrcode();
        });
      });
    },
    //生成二维码
    qrcode() {
      let that = this;
      let qrcode = new QRCode("qrcode", {
        width: 250,
        height: 250,
        text: that.link,
      });
    },
    //获取抽奖奖品
    getLotteryData() {
      this.newedLottery = this.inputData;
    },
    //获取预览所需商品信息
    getGoodsData() {
      this.previewData.onlinePrizes = getAddPrizeData().onlinePrizes;
      this.previewData.offlinePrizes = getAddPrizeData().offlinePrizes;
    },
    //根据设置数据，展示中奖次数的说明问题
    getATimeNumStr(totalNum, noSetTotal, dayNum, noSetDay) {
      let totalStr = noSetTotal ? '不限制' : ((totalNum || "0") + '次')
      let dayStr = noSetDay ? '不限制' : ((dayNum || "0") + '次')
      return '总限制' + totalStr + "；每日限制" + dayStr      
    },
    getOffPrizeTypes(type) {
      let find = myoffPrizeTypes.find((item) => {
        return item.label == type;
      });
      return (find && find.name) || "";
    },
    getAwardingTypes(type) {
      let find = awardingTypes.find((item) => {
        return item.label == type;
      });
      return (find && find.name) || "";
    },
    /**
     * 下载模板文件
     */
    downTemplate(fileUrl) {
      const that = this;
      that.$iLoading.show();

      utils.downloadFile(fileUrl, "兑奖码.xlsx");

      setTimeout(() => {
        that.$iLoading.hide();
      }, 1000);
    },
  },
};
</script>
<style lang="less" scoped>
.privewbox {
  padding: 10px 50px;
  .btn {
    margin-top: 10px;
    margin-left: 40%;
  }
}
.qrcodeWarp {
  width: 100%;
  height: 380px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: #e4e4e4 solid 1px;
  padding-top: 15px;
  padding: 10px 20px;
  div {
    width: 100%;
    text-align: center;
    margin-bottom: 15px;
  }
  .qrcode {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .qrcodetitle {
    font-size: 18px;
    font-weight: bold;
  }
}
.warp {
  width: 100%;
  display: flex;
  height: calc(~"100vh - 305px");
  overflow-y: auto;
  .infowarp {
    flex: 1;
    // min-height: 500px;
    border: 1px solid #e4e4e4;
    padding: 20px;
    height: fit-content;
    .info {
      width: 100%;
      color: #222;
      .first {
        margin-top: 20px;
      }
      .infokeywarp {
        display: flex;
        width: 100%;
        padding-right: 50px;
        min-height: 40px;
        padding: 10px 50px 10px 0;
        line-height: 20px;
        .infokey {
          width: 120px;
        }
        .infovalue {
          flex: 1;
          line-height: normal;
          max-height: 200px;
          overflow-y: auto;
          .codeDatabox{
              max-width: 600px;
          }
        }
      }
    }
    .prize {
      .goodsWarp {
        border: #e4e4e4 1px solid;
        padding: 16px;
        margin-top: 16px;
        .goodsBox {
          width: 330px;
          border: #e4e4e4 1px solid;
          padding: 12px;
        }
      }
      .prizeNum {
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        font-weight: bold;
      }
      .prizeName {
        display: flex;
        margin: 10px 0;
        .prizekey {
          width: 120px;
        }
        img {
          width: 63px;
          height: 63px;
          border: 1px solid #e2e2e2;
          padding: 2px;
        }
        .couponimg {
          width: 30px;
          height: 30px;
          cursor: pointer;
        }
      }
      .img {
        width: 32px;
        height: 32px;
      }
      .goodsInfo {
        width: 360px;
        height: 100px;
        padding: 10px;
        border: #e4e4e4 1px solid;
        border-radius: 5px;
        margin-bottom: 20px;
        display: flex;
        .img_item {
          width: 80px;
          height: 80px;
          margin-right: 10px;
        }
        .goodsInfoWarp {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .goodsName {
            word-break: break-all;
          }
          .priceNum {
            display: flex;
            justify-content: space-between;
            .price {
              font-size: 18px;
              font-weight: bold;
            }
            .num {
              height: 27px;
              line-height: 27px;
            }
          }
        }
      }
    }
  }
  .Lottery {
    margin-left: 20px;
    // min-height: 500px;
    width: 375px;
    img {
      width: 100%;
      height: 800px;
    }
  }
  .title {
    width: 100%;
    height: 40px;
    background-color: #f7f8fd;
    padding: 10px;
    line-height: 20px;
    font-size: 18px;
  }
}
.goWarp {
  width: 100%;
  display: flex;
  height: 70px;
  align-items: center;
  box-shadow: #e4e4e4 5px 5px 5px 5px;
  .priceWarp {
    display: flex;
    margin-left: 95px;
    div {
      height: 30px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }
    .price {
      color: red;
    }
    .num {
      font-size: 18px;
    }
  }
  .button {
    display: flex;
    margin-left: 20%;
    div {
      width: 100px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      border: 1px solid #e4e4e4;
      border-radius: 5px;
      margin-left: 20px;
      cursor: pointer;
    }
    .firstBtn {
      background-color: #fff;
    }
    .lastBtn {
      background-color: #999;
      color: #fff;
    }
  }
}
</style>