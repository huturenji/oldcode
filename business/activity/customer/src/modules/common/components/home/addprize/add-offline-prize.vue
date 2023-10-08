<template>
  <div>
    <div :class="{ allPrizesofline: offlinePrizes.length }">
      <div v-for="(item, index) in offlinePrizes" :key="index" class="oneprize">
        <div class="line1">
          <span class="theName">{{ "奖品" + numTranspor(index) }}</span>
          <el-button
            class="thedelbtn"
            round
            icon="el-icon-delete"
            @click="deleteOnlinePrize(index)"
          ></el-button>
        </div>
        <div class="line2">
          <el-radio-group
            v-model="item.offPrizeType"
            @change="(value) => onprizetypechange(value, item)"
          >
            <el-radio
              v-for="(type, typeindex) in offPrizeTypes"
              :key="typeindex"
              :label="type.label"
            >
              <span>
                {{ type.name }}
                <el-tooltip effect="dark" :content="tipcontent" placement="top-start">
                  <div class="criclecontent" v-if="type.label=='xnjp'">？</div>
                </el-tooltip>
             </span>
            </el-radio>
          </el-radio-group>
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
            v-model.trim="item.name"
            clearable
            maxlength="50"
            placeholder="请输入奖品名称"
            style="width: 350px"
          />
        </namedcomp>
        <namedcomp
          compName="奖品图片"
          align="start"
          nocolon
          requiredAfter
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
              formatCustom="['jpg', 'jpeg', 'png']"
              :defaultList="item.logoDefaults"
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
          requiredAfter
          style="margin-bottom: 10px"
        >
          <div slot="component">
            <div class="awardtype">
              <el-radio-group v-model="item.exchangeType">
                <el-radio
                  v-for="(type, typeindex) in getawardingTypes(
                    item.offPrizeType
                  )"
                  :key="typeindex"
                  :label="type.label"
                  >{{ type.name }}
                </el-radio>
              </el-radio-group>
              <el-tooltip
                v-if="item.offPrizeType != 'swjp'"
                effect="dark"
                placement="top-start"
              >
                <div slot="content" v-html="tipAwardcontent"></div>
                <div class="criclecontent">？</div>
              </el-tooltip>
              <el-button v-if="(item.exchangeType == 'bpluscode' && item.offPrizeType == 'syyhq')" class="useAuto" @click="useAutoLink(index,'syyhq')" size="small" type="primary" >使用领奖地址</el-button>
              <el-button v-if="(item.exchangeType == 'bpluscode' && item.offPrizeType == 'syyhq')" class="useAuto" @click="useAutoLink(index,'syyhqauto')" size="small" type="primary" >使用一元购领奖地址</el-button>
            
            </div>
            <div
              v-if="
                (item.exchangeType == 'offline' &&
                  item.offPrizeType == 'swjp') ||
                ((item.exchangeType == 'othercode' ||
                  item.exchangeType == 'offline') &&
                  item.offPrizeType == 'xnjp')
              "
              class="rewardtip"
            >
              <div class="namebox">兑奖提示</div>
              <el-input
                v-model.trim="item.exchangePrompt"
                clearable
                maxlength="50"
                placeholder="兑奖提示"
                style="width: 250px"
              />
            </div>
            <div
              v-if="
                (item.exchangeType == 'othercode' &&
                  item.offPrizeType == 'xnjp') ||
                (item.exchangeType == 'bpluscode' &&
                  item.offPrizeType == 'syyhq')||
                (item.exchangeType == 'bpluscode' &&
                  item.offPrizeType == 'syhb')
              "
              
            >
              <div class="rewardtip">
                <div class="namebox">{{`${['syyhq','syhb'].includes(item.offPrizeType)?'网页':''}`}}领取链接</div>
                <el-input
                  v-model.trim="item.exchangeUrl"
                  clearable
                  maxlength="400"
                  placeholder="请输入领取链接"
                  style="width: 400px"
                />
              </div>
            </div>
            <div
              v-if="
                (item.exchangeType == 'bpluscode' &&
                  item.offPrizeType == 'syyhq') ||
                (item.exchangeType == 'othercode' &&
                  item.offPrizeType == 'xnjp') ||
                (item.exchangeType == 'bpluscode' &&
                  item.offPrizeType == 'syhb')
              "
              class="codebox"
            >
              <div class="namebox duijiangname">上传兑奖码</div>
              <el-upload
                class="upload-demo"
                :before-upload="(file) => beforeVoucherUpload(file, item)"
                :on-remove="
                  (file, fileList) => removeVoucher(file, fileList, item)
                "
                :on-error="uploaderror"
                :file-list="item.voucherfile"
              >
                <el-button size="small" type="primary" icon="el-icon-upload2"
                  >请选择文件</el-button
                >
                <span slot="tip" class="upload__tip warring"
                  >请上传Excel文件</span
                >
              </el-upload>
              <div class="downbox" @click="downTemplate(item.offPrizeType)">
                下载模板
              </div>
            </div>
          </div>
        </namedcomp>
      </div>
    </div>
    <el-button type="primary" class="addbtnofline" @click="addOfflinePrize"
      >+添加奖品</el-button
    >
  </div>
</template>
<script>
import {
  getAddPrizeData,
  num2Chinese,
  getAllGoodbuildinIcons,
  getAllCouponbuildinIcons,
  getAllRedpacketbuildinIcons,
  isManualUploadImg,
  awardingTypes,
  myoffPrizeTypes,
  getBplusExchangeUrl,
} from "bislibs/home/newlottery-lifecycle";
import { downLoad_front } from "bislibs/utils/index";
import { cloudservices, utils } from "opcl";
const mediaFileUpUrl = window.origin + "/media/presign/v1/getUploadUrl";
//新增商品的组件
export default {
  components: {},
  props: {
    inputData: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      offlinePrizes: getAddPrizeData().offlinePrizes, //线下商品 奖品 ，默认有一个 空的,不能删除
      activityId: utils.getStorage("customer_typeId"), //活动类型
      uploadUrl:
        window.origin +
        "/activitystudio" +
        "/file/v1/upload?c=static&p=/activitystudio/file&n=",
      //线下奖品类型

      partGoodBuildinIcons: [], //部分的商品内置图片
      partCouponbuildinIcons: [], //部分的优惠券内置图片
      partRedpacketbuildinIcons: [], //部分的红包内置图片
      tipcontent:
        "虚拟奖品是以数字化形式存在权益，如线上商城的优惠券、付费会员、积分等。",

      tipAwardcontent:
        "凭兑奖码领取的虚拟权益，需提供领取链接并上传相应的兑奖码，其中：" +
        "<br>" +
        "i. 如果有专用领取链接的，请输入对应的专用领取链接，并根据实际情况上传兑奖码；" +
        "<br>" +
        "ii. 如果仅提供了兑奖码的，请上传对应的兑奖码，领取链接建议直接使用本平台默认的领取链接。",
      importType: {
        'syyhq': "coupon_code",
        'xnjp': "exchange_code",
        'syhb': "redpacket_code",
      },
      offPrizeTypes: myoffPrizeTypes,
    };
  },
  watch: {
    offlinePrizes: {
      handler() {
        this.$emit("addofflineok");
        // console.log(this.offlinePrizes);
      },
      deep: true,
      immediate: true,
    },
  },
  created() {},
  mounted() {
    //默认只显示4张图片
    this.partGoodBuildinIcons = getAllGoodbuildinIcons().slice(0, 4);
    //默认只显示4张图片
    this.partCouponbuildinIcons = getAllCouponbuildinIcons().slice(0, 4);
    //默认只显示4张图片
    this.partRedpacketbuildinIcons = getAllRedpacketbuildinIcons().slice(0, 4);
  },
  methods: {
    deleteOnlinePrize(index) {
      this.offlinePrizes.splice(index, 1);
    },

    // 获取各个活动可添加商品的最大值
    getGoodsMaxNum(key) {
      if (key == "2" || key == "4") {
        //砸金蛋和红包雨
        return 12 - getAddPrizeData().onlinePrizes.length;
      } else if (key == "1") {
        //大转盘
        return 11 - getAddPrizeData().onlinePrizes.length;
      } else if (key == "3") {
        //九宫格
        return 11 - getAddPrizeData().onlinePrizes.length;
      } else if (key == "5") {
        return 11 - getAddPrizeData().onlinePrizes.length;
      } else {
        return 1;
      }
    },

    //获取抽奖类型数据
    addOfflinePrize() {
      if (this.offlinePrizes.length == this.getGoodsMaxNum(this.activityId)) {
        utils.showToast("您添加的商品已达上限");
        return;
      }
      this.offlinePrizes.push({
        goodId: this.offlinePrizes.length,
        name: "",
        selectedImg: "", //图片资源本身，手动上传的就是一个在线的地址。预制的图片，就是base64
        selectedImgKey: "", //图片资源的key,手动上传的时候是空。预制图片就是图片名
        num: 1,
        exchangePrompt: "请联系活动主办方领取",
        offPrizeType: "swjp", //线下奖品类型，默认 实物奖品
        exchangeUrl: "", //链接地址
        exchangeType: this.getawardingTypes("swjp")[0].label || "", //线下兑奖方式，默认实物奖品的初始值
        voucherfile: [], //上传的兑奖码文件地址列表
        buildinimgLsit: this.getBuildINimgs("swjp", false), //默认实物奖品的 图片
        prizeSource: 2, //奖品来源：1-线上；2-线下
      });
    },

    logoChange(uploadFileList, index) {
      // console.log("logoChange.selectedImg=", uploadFileList);

      if (uploadFileList && uploadFileList.length > 0) {
        this.offlinePrizes[index].selectedImg = uploadFileList[0].url;
        this.offlinePrizes[index].selectedImgKey = "";
        // this.offlinePrizes[index].fielName = uploadFileList[0].name;
        // this.offlinePrizes[index].logoDefaults = [
        //   {
        //     name: uploadFileList[0].url.substr(
        //       (uploadFileList[0].url.lastIndexOf("/") || 0) + 1
        //     ),
        //     url: uploadFileList[0].url,
        //   },
        // ];
      } else {
        this.offlinePrizes[index].selectedImg = "";
        // this.offlinePrizes[index].fielName = "";
        // this.offlinePrizes[index].logoDefaults = [];
      }
    },
    numTranspor(numindex) {
      return num2Chinese(numindex);
    },
    //展示更多内置图片
    showMoreBImgs(prize, value) {
      prize.showAllimgs = value;
      prize.buildinimgLsit = this.getBuildINimgs(prize.offPrizeType, value);
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
      // console.log("selectBuilding.selectedImg=" + item.selectedImg);
    },
    beforeVoucherUpload(file, item) {
      const name = file.name;
      if (name.indexOf(".xls") != -1 || name.indexOf(".xlsx") != -1) {
        this.uploadUrl = mediaFileUpUrl + encodeURIComponent(file.name);
        this.manualUpload(file, "voucher", item);
      } else {
        utils.showToast("请选择正确的文件格式");
      }
      return false;
      //   return this.autoUpload();
    },
    removeVoucher(file, fileList, item) {
      if (file) {
        item.voucherfile = [];
        item.voucherUrl = undefined;
      }
    },
    uploaderror(err, file, fileList) {
      // console.log(err, file, fileList)
    },
    manualUpload(file, ftype, item) {
      const that = this;
      file.businessType = that.type == "img" ? "logo" : "agreement";
      file.uid = new Date().getTime();
      cloudservices
        .upload2Ceph("/activitystudio/presign/v1/getUploadUrl", [file])
        .then((allRes) => {
          file.url = allRes[0].downLoadUrl;
          if (ftype == "attach") {
            item.fileList = [file];
          } else {
            item.voucherfile = [file];
            item.voucherUrl = file.url;
          }
        })
        .catch(() => {});
    },
    /**
     * 下载模板文件
     */
    downTemplate(type) {
      const that = this;
      that.$iLoading.show();

      let fileType = that.importType[type];
      downLoad_front(fileType);

      setTimeout(() => {
        that.$iLoading.hide();
      }, 1000);
    },
    /**
     * 动态获取兑奖类型
     */
    getawardingTypes(offPrizeType) {
      if (offPrizeType == "swjp") {
        let copy = awardingTypes.slice(0, 2);
        return copy;
      } else if (offPrizeType == "syyhq"||offPrizeType == "syhb") {
        let copy = JSON.parse(JSON.stringify(awardingTypes)).splice(2, 1);
        return copy;
      } else if (offPrizeType == "xnjp") {
        let copy = JSON.parse(JSON.stringify(awardingTypes));
        copy.splice(2, 1);
        return copy;
      } else {
        return JSON.parse(JSON.stringify(awardingTypes));
      }
    },
    /**
     * 动态获取预制图片数组
     */
    getBuildINimgs(offPrizeType, showAllimgs) {
      if (offPrizeType == "swjp" && !showAllimgs) {
        return this.partGoodBuildinIcons;
      } else if (offPrizeType == "swjp" && showAllimgs) {
        return getAllGoodbuildinIcons();
      } else if (offPrizeType == "syyhq" && !showAllimgs) {
        return this.partCouponbuildinIcons;
      } else if (offPrizeType == "syyhq" && showAllimgs){
        return getAllCouponbuildinIcons();
      }else if (offPrizeType == "syhb" && !showAllimgs){
        return this.partRedpacketbuildinIcons;
      }else if (offPrizeType == "syhb" && showAllimgs){
        return getAllRedpacketbuildinIcons();
      }else if (offPrizeType == "xnjp" && !showAllimgs) {
        return this.partCouponbuildinIcons;
      } else if (offPrizeType == "xnjp" && showAllimgs){
        return getAllCouponbuildinIcons();
      }
    },
    /**
     * 切换某个奖品的类型
     */
    onprizetypechange(value, item) {
      //奖品类型切换，兑奖方式、奖品图片需要调整
      item.exchangeType = this.getawardingTypes(value)[0].label;
      //如果是 商云的优惠券和红包，领取链接有默认值，其他的没有
      if (item.exchangeType == "bpluscode") {
        item.exchangeUrl = getBplusExchangeUrl(value);
      } else {
        item.exchangeUrl = "";
      }
      //切换图片选择区域
      this.showMoreBImgs(item, false);
      if (!isManualUploadImg(item)) {
        item.selectedImg = ""; //选中的图片复位清零
        item.selectedImgKey = "";
      }
      // console.log("onprizetypechange", item.exchangeType, item.exchangeUrl);
    },
    /**
     * 商云优惠券使用自动领奖地址
     */
    useAutoLink(index,type){
        this.offlinePrizes[index].exchangeUrl = getBplusExchangeUrl(type);
        utils.showToast(`网页领取链接已设置为${type=='syyhqauto'?'一元购':''}领奖地址`);
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
.allPrizesofline {
  padding: 10px 0;
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
    .line2 {
      margin: 5px;
      padding: 0 15px;
      display: flex;
    }
    .criclecontent {
      display: inline-block;
      background: #88929e;
      width: 12px;
      height: 12px;
      border: 1px solid #88929e;
      border-radius: 50%;
      color: white;
      line-height: 10px;
      font-size: 10px;
      padding-left: 2px;
      margin-left: 5px;
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
    .awardtype {
      display: flex;
      margin-bottom: 10px;
      align-items: center;
    }
    .useAuto{
        margin-left: 10px;
    }
    .rewardtip {
      display: flex;
      align-items: center;
      margin: 10px 0;
      .namebox {
        margin-right: 5px;
      }
    }
    .codebox {
      display: flex;
      .namebox {
        margin-right: 5px;
      }
      .duijiangname {
        margin-top: 6px;
      }
      .upload__tip {
        font-size: 14px;
        color: #86909c;
        margin-left: 10px;
      }
      .warring {
        color: #88929e;
      }
      .downbox {
        margin-top: 6px;
        margin-left: 5px;
        color: #478aee;
        cursor: pointer;
      }
    }
    /deep/ .imgItem .badge {
      top: 8px;
      right: 8px;
      line-height: 11px;
    }
  }
  /deep/.namedcomp .compNameA {
    text-align: left;
    padding-left: 15px;
  }
}
.addbtnofline {
  margin: 3px 20px;
  height: fit-content;
}
</style>