<template>
  <div>
    <div :class="{ allPrizes: onlinePrizes.length }">
      <div v-for="(item, index) in onlinePrizes" :key="index" class="oneprize">
        <div class="line1">
          <span class="theName">{{ "奖品" + numTranspor(index) }}</span>
          <el-button
            class="thedelbtn"
            round
            icon="el-icon-delete"
            @click="deleteOnlinePrize(index)"
          ></el-button>
        </div>
        <namedcomp
          compName="奖品名称"
          align="start"
          nocolon
          requiredAfter
          style="margin-bottom: 10px"
        >
          <el-input
            slot="component"
            v-model.trim="item.inputName"
            clearable
            maxlength="50"
            placeholder="请输入奖品名称"
            style="width: 350px"
          />
        </namedcomp>
        <namedcomp
          compName="奖品"
          align="start"
          nocolon
          style="margin-bottom: 10px"
        >
          <div class="goodbox" slot="component">
            <gooditem :good="item" />
          </div>
        </namedcomp>
        <namedcomp
          compName="奖品图片"
          align="start"
          nocolon
          style="margin-bottom: 10px"
        >
          <div slot="component" class="goodimgbox">
            <div class="buildInBox">
              <div class="builtinimgs">
                <img
                  v-for="(imgitem, imgindex) in item.buildinimgLsit"
                  :src="imgitem.src"
                  :key="imgindex"
                  alt=""
                  @click="selectBuilding(item, imgitem)"
                  :class="{ selectedimg: item.selectedImgKey == imgitem.key }"
                />
              </div>
              <el-button
                v-if="!item.showAllimgs"
                type="text"
                @click="showMoreBImgs(item, true)"
                >更多<i class="el-icon-arrow-down"></i
              ></el-button>
              <el-button v-else type="text" @click="showMoreBImgs(item, false)"
                >收回<i class="el-icon-arrow-up"></i
              ></el-button>
            </div>
            <uploadfile
              :ref="'manualUpload' + index"
              style="width: 95px"
              :uploadUrl="uploadUrl"
              type="custom"
              :id="index"
              :defaultList="item.logoDefaults"
              formatCustom="['jpg', 'jpeg', 'png']"
              pressinUrl="/activitystudio/presign/v1/getUploadUrl"
              @onUploadChange="logoChange"
            >
              <div slot="finishedArea" slot-scope="scope" class="finishBox">
                <img :src="scope.data.url" />
                <img
                  :src="require('assets/newactivity/icon_toast_check.svg')"
                  alt=""
                  class="okimg"
                />
                <div class="oparationbox">
                  <i
                    class="delimg el-icon-delete"
                    @click="removeUploadFile(index, scope.data)"
                  ></i>
                </div>
              </div>
              <div slot="uploadArea" class="uploadbox">
                <div class="contentbox">
                  <img
                    :src="require('assets/newactivity/btn_picture_add.svg')"
                    alt=""
                  />
                  <div>手动上传</div>
                </div>
              </div>
            </uploadfile>
          </div>
        </namedcomp>
        <namedcomp
          compName="奖品数量"
          align="start"
          nocolon
          requiredAfter
          style="margin-bottom: 10px"
        >
          <el-input-number
            slot="component"
            size="small"
            v-model="item.num"
            :precision="0"
            :step="1"
            :min="1"
          ></el-input-number>
        </namedcomp>
        <namedcomp
          compName="兑奖方式"
          align="start"
          nocolon
          style="margin-bottom: 10px"
        >
          <div slot="component">在线领取</div>
        </namedcomp>
        <namedcomp
          compName="金额小计"
          align="start"
          nocolon
          style="margin-bottom: 10px"
        >
          <div slot="component">￥{{ item.goodTotalPrice }}</div>
        </namedcomp>
      </div>
    </div>
    <div class="addbox">
      <div class="jineslot">
        <div>线上商城商品待结算金额：</div>
        <div class="moneyUnit">￥</div>
        <div class="money">
          {{ onlineGoodsTotalPrice }}
        </div>
      </div>
      <el-button type="primary" class="addbtn" @click="addOnlinePrize"
        >+添加奖品</el-button
      >
    </div>
    <el-dialog
      center
      title="添加线上商品"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      append-to-body="true"
      :visible.sync="selectGoodsDialog"
      @close="addcencel"
      width="60%"
    >
      <div class="dialogContent">
        <div class="left leftFlex">
          <div class="check padding">
            <el-input
              v-if="hasSearchGoods"
              placeholder="请输入姓名/帐号"
              @keyup.enter.native="searchList(searkey)"
              clearable
              style="width: 280px"
              v-model.trim="searkey"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="searchList(searkey)"
              ></el-button>
            </el-input>

            <el-tabs type="border-card" v-model="activeTabName">
              <el-tab-pane
                :name="tab.poolId"
                v-for="(tab, index) in tabsDataSource"
                :key="index"
              >
                <div
                  slot="label"
                  class="labelbox"
                  :class="{ activiteTab: activeTabName == tab.poolId }"
                >
                  <h3>{{ tab.poolName }}</h3>
                </div>
              </el-tab-pane>
            </el-tabs>
            <div class="allGoods">
              <div v-for="(item, index) in dialogAllGoods" :key="index">
                <checkeItem
                  :onegood="item"
                  :selected="isGoodsClicked(item)"
                  @goodclick="goodclick"
                />
              </div>
              <p v-if="loading">加载中...</p>
              <p v-if="!loading && dialogAllGoods.length == 0">暂无数据</p>
            </div>
          </div>
        </div>

        <div class="right">
          <ul class="check padding rightCheck">
            <div v-for="(item, index) in dialogSelectGoods" :key="index">
              <selectItem
                :good="item"
                @delgood="delgood"
                @updateNum="updateNum"
              ></selectItem>
            </div>
            <div v-if="!dialogSelectGoods.length" class="rightempty">
              <h2>尚未添加商品</h2>
            </div>
          </ul>
          <div class="rightfooter">
            <div>
              {{
                "已选：" +
                dialogSelectGoods.length +
                "/" +
                getGoodsMaxNum(activityId)
              }}
            </div>
            <div class="ftprice">
              <div>合计：</div>
              <div class="tprice">￥</div>
              <div class="tprice tpriceSize">{{ selectGoodsTotalPrice }}</div>
            </div>
          </div>
        </div>
      </div>

      <span slot="footer" class="thefooter">
        <el-button @click="addcencel">取 消</el-button>
        <el-button type="primary" @click="addList">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { utils, EventBus, SysEventTypes } from "opcl";
import {
  getTotalPrice,
  getAddPrizeData,
  isGoodsSelect,
  num2Chinese,
  getAllGoodbuildinIcons,
  isManualUploadImg,
} from "bislibs/home/newlottery-lifecycle";
import homelHandler from "bislibs/requestHandler/homehandler";
import checkeItem from "./add-online-checkeItem.vue";
import selectItem from "./add-online-selectItem.vue";
import gooditem from "./goodItem.vue";
//新增商品的组件
export default {
  components: {
    checkeItem,
    selectItem,
    gooditem,
  },
  props: {
    inputData: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      onlinePrizes: getAddPrizeData().onlinePrizes, //线上商品 奖品 列表
      dialogAllGoods: [], //线上商品列表
      dialogTwoGoods: [], //弹框的双商品列表
      dialogSelectGoods: getAddPrizeData().dialogSelectGoods, //弹框上选中的列表
      dialogSelectGoodsMap: getAddPrizeData().dialogSelectGoodsMap, //弹框上选中的列表
      selectGoodsDialog: false,
      selectGoodsTotalPrice: "0.00", //弹框选择的总价格
      hasSearchGoods: false, //是否显示商品搜索框，暂时屏蔽，后续可能需要添加
      loading: false, //搜索的标记位
      searkey: "", //商品池搜索关键字
      tabsDataSource: [], //商品池标签
      activeTabName: null, //选中的效果
      activityId: utils.getStorage("customer_typeId"), //活动类型
      uploadUrl:
        window.origin +
        "/activitystudio" +
        "/file/v1/upload?c=static&p=/activitystudio/file&n=",
      partGoodBuildinIcons: [], //部分的商品内置图片
      onlineGoodsTotalPrice: 0, //线上商品金额总计，跟页面下方的 金额总计是一个东西
    };
  },
  watch: {
    onlinePrizes: {
      handler() {
        // console.log("watch.onlinePrizes", this.onlinePrizes);
        this.$emit("addonlineok");
        //这里页面上也要显示总金额，不改动原来的逻辑，在这个页面新增变量
        this.onlineGoodsTotalPrice = getTotalPrice(this.onlinePrizes, this);
      },
      deep: true,
      immediate: true,
    },
    dialogSelectGoods: {
      handler() {
        // 更新总价格
        this.selectGoodsTotalPrice = getTotalPrice(
          this.dialogSelectGoods,
          this
        );
      },
      deep: true,
      immediate: true,
    },
    //切换商品池标签
    activeTabName: {
      handler() {
        if (!!this.activeTabName && this.activeTabName != "0") this.getGoods();
      },
      immediate: true,
    },
  },
  created() {},
  mounted() {
    this.addSysEvent();
    //默认只显示4张图片
    this.partGoodBuildinIcons = getAllGoodbuildinIcons().slice(0, 4);
  },
  methods: {
    /**
     * 当收到接口层发出的超时消息后，主页面弹框提示用户。
     */
    addSysEvent() {
      const that = this;
      EventBus.addEventListener(SysEventTypes.USER_OP_TIMEOUT_EVENT, (evt) => {
        // console.log(evt);
        if (evt.type == SysEventTypes.USER_OP_TIMEOUT_EVENT) {
          that.addcencel();
        }
      });
    },
    deleteOnlinePrize(index) {
      this.onlinePrizes.splice(index, 1);
    },

    getGoodPools() {
      let that = this;
      that.$iLoading.show();
      that.loading = true;
      homelHandler
        .listGoodsPools({ pageIndex: 1, pageSize: 1000 })
        .then((result) => {
          that.$iLoading.hide();
          if (!!result && result.resultCode == 0) {
            this.tabsDataSource = result.result.productPoolList;
            if (!!this.tabsDataSource && this.tabsDataSource.length > 0) {
              this.activeTabName = this.tabsDataSource[0].poolId;
            }
          }
        })
        .catch((err) => {
          console.log(err);
          that.$iLoading.hide();
          that.loading = true;
        });
    },
    getGoods() {
      let that = this;
      that.$iLoading.show();
      homelHandler
        .listGoods({ poolId: this.activeTabName, pageIndex: 1, pageSize: 1000 })
        .then((result) => {
          that.$iLoading.hide();
          that.loading = false;
          if (!!result && result.resultCode == 0) {
            this.dialogAllGoods = result.result.productList.map(function (
              item
            ) {
              item.goodId = item.sku;
              item.name = item.skuName;
              item.img = item.mainImage;
              item.price = item.settlePrice;
              return item;
            });
            let resultArr = [];
            let twogoodArr = [];
            for (let i = 0; i < this.dialogAllGoods.length; i++) {
              if (i % 2 == 0) {
                twogoodArr.push(this.dialogAllGoods[i]);
              } else {
                twogoodArr.push(this.dialogAllGoods[i]);
                resultArr.push(JSON.parse(JSON.stringify(twogoodArr)));
                twogoodArr = [];
              }
            }
            //奇数的时候，循环结束，手动push一次数据
            if (twogoodArr.length > 0) {
              resultArr.push(JSON.parse(JSON.stringify(twogoodArr)));
            }

            this.dialogTwoGoods = resultArr;
          }
        })
        .catch((err) => {
          console.log(err);
          that.$iLoading.hide();
          that.loading = false;
        });
    },
    // 获取各个活动可添加商品的最大值
    getGoodsMaxNum(key) {      
      if (key == "2" || key == "4") {
        //砸金蛋和红包雨
        return 12 - getAddPrizeData().offlinePrizes.length;
      } else if (key == "1") {
        //大转盘
        return 11 - getAddPrizeData().offlinePrizes.length;
      } else if (key == "3") {
        //九宫格
        return 11 - getAddPrizeData().offlinePrizes.length;
      } else if (key == "5") {
        return 11 - getAddPrizeData().offlinePrizes.length;        
      } else {
        return 1;
      }
    },
    goodclick(item) {
      let isSelect = isGoodsSelect(item);
      if (
        !isSelect &&
        this.dialogSelectGoods.length == this.getGoodsMaxNum(this.activityId)
      ) {
        utils.showToast("您添加的商品已达上限");
        return;
      }

      if (isSelect) {
        // utils.showToast("已添加了");
        let index = this.dialogSelectGoods.findIndex((goodItem) => {
          return item.goodId == goodItem.goodId;
        });
        this.dialogSelectGoods.splice(index, 1);
      } else {
        //选中的列表
        let copy = JSON.parse(JSON.stringify(item));
        //请注意 下面的属性 一定要在添加到 列表之前 初始化完成。这样才能被watch监视到变化
        copy.num = 1;
        copy.inputName = copy.name;
        copy.poolId = this.activeTabName;
        copy.selectedImg = "";
        copy.selectedImgKey = "";
        copy.buildinimgLsit = this.getBuildINimgs(false);
        copy.prizeSource = 1; //奖品来源：1-线上；2-线下
        copy.exchangeType = 1; //兑换方式：1-在线领取；2-线下领取；3-邮寄；4-凭兑奖码领取

        let find = this.tabsDataSource.find((item) => {
          return item.poolId == this.activeTabName;
        });
        copy.poolName = find.poolName;
        this.dialogSelectGoods.splice(this.dialogSelectGoods.length, 0, copy);
      }
    },
    //获取抽奖类型数据
    addOnlinePrize() {
      this.selectGoodsDialog = true;
      //弹框之后，开始加载商品
      this.getGoodPools();
      //每次弹框，默认加载已经选择的商品
      this.dialogSelectGoods = getAddPrizeData().dialogSelectGoods = JSON.parse(
        JSON.stringify(getAddPrizeData().onlinePrizes)
      );
    },
    /**
     * 添加选中的数据
     */
    addList() {
      //每次选择 需要手动给缓存赋值一次
      getAddPrizeData().onlinePrizes = this.onlinePrizes = JSON.parse(
        JSON.stringify(this.dialogSelectGoods)
      );
      //弹框消失
      this.addcencel();
    },
    /**
     * 弹框消失
     */
    addcencel() {
      this.selectGoodsDialog = false;
      this.dialogAllGoods = [];
      this.dialogTwoGoods = [];
      this.tabsDataSource = [];
      this.activeTabName = null;

      this.dialogSelectGoods = getAddPrizeData().dialogSelectGoods = [];
    },
    searchList(key) {},

    delgood(goodId) {
      let index = this.dialogSelectGoods.findIndex((item) => {
        return item.goodId == goodId;
      });
      this.dialogSelectGoods.splice(index, 1);
    },

    updateNum({ goodid, num }) {
      let find = this.dialogSelectGoods.find((item) => {
        return item.goodId == goodid;
      });
      find && (find.num = num);
    },
    numTranspor(numindex) {
      return num2Chinese(numindex);
    },
    //判断搜索的商品是否已经被选中了
    isGoodsClicked(goods) {
      return isGoodsSelect(goods);
    },
    /**
     * 上传图片
     */
    logoChange(uploadFileList, index) {
      if (uploadFileList && uploadFileList.length > 0) {
        this.onlinePrizes[index].selectedImg = uploadFileList[0].url;
        this.onlinePrizes[index].selectedImgKey = "";
        // this.onlinePrizes[index].fielName = uploadFileList[0].name;
        // this.onlinePrizes[index].logoDefaults = [
        //   {
        //     name: uploadFileList[0].url.substr(
        //       (uploadFileList[0].url.lastIndexOf("/") || 0) + 1
        //     ),
        //     url: uploadFileList[0].url,
        //   },
        // ];
      } else {
        this.onlinePrizes[index].selectedImg = "";
        // this.onlinePrizes[index].fielName = "";
        // this.onlinePrizes[index].logoDefaults = [];
      }
    },
    //展示更多内置图片
    showMoreBImgs(prize, value) {
      prize.showAllimgs = value;
      prize.buildinimgLsit = this.getBuildINimgs(value);
    },
    /**
     * 动态获取预制图片数组
     */
    getBuildINimgs(showAllimgs) {
      if (!showAllimgs) {
        return this.partGoodBuildinIcons;
      } else {
        return getAllGoodbuildinIcons();
      }
    },
    //选中某个预制图片
    selectBuilding(item, imgitem) {
      //如果已经选择了上传的文件，这里不能再选择。
      if (isManualUploadImg(item)) {
        utils.showToast("请先删除手动上传的图片");
        return;
      }
      //如果是已经选择的，再次点击说明是取消了
      if (item.selectedImgKey == imgitem.key) {
        item.selectedImg = "";
        item.selectedImgKey = "";
        return;
      }
      item.selectedImg = imgitem.src;
      item.selectedImgKey = imgitem.key;
    },
    /**
     * 手动控制删除
     */
    removeUploadFile(index, file) {
      let upcomp = this.$refs["manualUpload" + index][0];
      upcomp && upcomp.handleRemove(file, 2);
    },
  },
};
</script>
<style lang="less" scoped>
.allPrizes {
  padding-top: 10px;
  .oneprize {
    border: 1px solid #e2e2e2;
    margin-bottom: 16px;
    .line1 {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      background: #f7f8fa;
      height: 44px;
      margin-bottom: 10px;
      .theName {
        font-size: 14px;
        font-weight: bold;
      }
      .thedelbtn {
        border: none;
        color: red;
        background: transparent;
      }
    }
    .goodbox {
      border: 1px solid #e2e2e2;
      width: 350px;
    }
    .goodimgbox {
      // display: flex;
      .buildInBox {
        display: flex;
        align-items: flex-start;
        .builtinimgs {
          display: flex;
          width: 350px;
          flex-wrap: wrap; //流式布局自动换行
          // margin-bottom: 10px;
          max-height: 155px;
          overflow-y: auto;
          img {
            width: 62px;
            height: 62px;
            margin-right: 15px;
            margin-bottom: 15px;
            border: 1px solid #e2e2e2;
            padding: 1px;
          }
          .selectedimg {
            border: 1px solid #478aee;
          }
        }
      }
      .finishBox {
        position: relative;
        width: 60px;
        height: 60px;
        img {
          width: 60px;
          height: 60px;
        }
        .okimg {
          width: 15px;
          height: 15px;
          position: absolute;
          top: 0;
          left: 0;
        }
        .delimg {
          width: 16px;
          height: 16px;
          cursor: pointer;
          color: red;
          bottom: 0;
        }
        .oparationbox {
          position: absolute;
          text-align: center;
          bottom: 0;
          left: 0;
          right: 0;

          z-index: 10;
          background: black;
          opacity: 0.5;
        }
      }
      .uploadbox {
        display: flex;
        align-items: center;
        justify-content: center;
        background: gainsboro;
        width: 60px;
        height: 60px;
        font-size: 12px;
        img {
          width: 20px;
          height: 20px;
        }
        .contentbox {
          color: #478aee;
          text-align: center;
        }
      }
    }
  }
  /deep/.namedcomp .compNameA {
    text-align: left;
    padding-left: 15px;
  }
}
.addbox {
  display: flex;
  align-items: center;
  border: 1px solid #e2e2e2;
}
.jineslot {
  display: flex;
  align-items: baseline;
  padding: 15px;
  .money {
    color: red;
    font-size: 18px;
  }
  .moneyUnit {
    color: red;
  }
}
.addbtn {
  margin: 3px 20px;
  height: fit-content;
}
.dialogContent {
  display: flex;
  border-top: 1px solid #e2e2e2;
  border-bottom: 1px solid #e2e2e2;
  padding: 30px 0;

  .left,
  .right {
    flex: 1;

    border: 1px solid #ccc;
    .ttile {
      display: block;
      line-height: 40px;
      padding-left: 24px;
      font-weight: 600;
      box-sizing: border-box;
      font-size: 14px;
      background: rgba(248, 248, 248, 1);
      border-radius: 4px 4px 0px 0px;
      color: #666666;
      b {
        font-size: 12px;
        font-weight: 400;
        color: #666666;
      }
      ul {
        background: #f2f2f2;
        padding: 10px;
      }
    }
  }
  .leftFlex {
    height: 50vh;
    overflow-x: auto;
  }
  .rightCheck {
    height: calc(~"50vh - 60px");
    overflow-y: auto;
  }
  .right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 10px;
    .ttile {
      b {
        font-weight: 600;
      }
      b:nth-child(1) {
        color: #478aee;
      }
    }
    .rightempty {
      text-align: center;
      margin-top: 15vh;
    }
    .rightfooter {
      display: flex;
      justify-content: space-between;
      border-top: 1px solid #e2e2e2;
      padding-top: 10px;
      .ftprice {
        display: flex;
        justify-content: end;
        align-items: baseline;

        .tprice {
          color: red;
        }
        .tpriceSize {
          font-size: 18px;
        }
      }
    }
  }
  .check {
    border-top: 0;
    margin: 0;
    li {
      list-style: none;
      margin: 12px 10px 12px 30px;
      .showomfp {
        color: #333333;
        display: inline-block;
        background-color: #fff;
        padding-left: 0;
        line-height: 20px;
        height: 20px;
        &:nth-child(1) {
          width: 80px;
        }
        &:nth-child(2) {
          width: 150px;
        }
      }
    }
  }
  .labelbox {
    display: flex;
    color: #88929e;
    h3 {
      font-weight: bold;
    }
  }
  .activiteTab {
    color: black;
  }
  .labelbox:hover {
    color: black;
  }
  .allGoods {
    background: #f2f2f2;
    padding: 5px;
    height: calc(~"50vh - 45px");
    overflow-y: auto;
  }
}
.thefooter {
  display: flex;
  justify-content: center;
}
/deep/.el-tabs--border-card > .el-tabs__content {
  padding: 1px;
}
</style>