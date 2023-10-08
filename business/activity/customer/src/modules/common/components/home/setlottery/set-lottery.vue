<template>
  <div class="setlottery">
    <div class="operationbox">
      <div class="settingbox">
        <namedcomp>
          <div slot="compName" class="copmnamebox">
            <div class="title">
              <span>活动名称</span> <span class="xing">*</span>
            </div>
          </div>
          <div slot="component">
            <el-input
              v-model.trim="settingData.activityName"
              clearable
              maxlength="60"
              placeholder="请输入活动名称"
              style="width: 270px"
              ref="focusId"  
            />
            <div
              class="errnametip"
              v-if="
                !!settingData.activityName &&
                settingData.activityName.length > 60
              "
            >
              活动名称不要超过六十个字符
            </div>
            <div
              class="errnametip"
              v-if="!!canNext && !settingData.activityName"
            >
              请输入活动名称
            </div>
          </div>
        </namedcomp>
        <namedcomp>
          <div slot="compName" class="copmnamebox">
            <div class="title">
              <span>中奖总概率</span> <span class="xing">*</span>
            </div>
          </div>
          <div slot="component">
            <div>
              <el-input
                size="mini"
                v-model="settingData.winProbability"
                :style="{ margin: '5px 0', width: '80px' }"
                @input="filterNumberAndDot()"
              >
                <div class="gailvUnit" slot="suffix">%</div>
              </el-input>
              <div
                class="errnametip"
                v-if="!!canNext && !parseFloat(settingData.winProbability || 0)"
              >
                中奖总概率不能为0
              </div>
            </div>
          </div>
        </namedcomp>
        <div class="codeboxWrap">
            <div class="codebox">
                <div class="namebox duijiangname">抽奖资格</div>
                <el-upload
                class="upload-demo"
                :before-upload="(file) => beforeVoucherUpload(file,)"
                :on-remove="(file, fileList) => removeVoucher()"
                :on-error="uploaderror"
                :file-list="voucherfile"
                >
                <el-button size="small" type="primary" icon="el-icon-upload2"
                    >请选择文件</el-button
                >
                <span slot="tip" class="upload__tip warring"
                    >请上传Excel文件</span
                >
                </el-upload>
                <div class="downbox" @click="downTemplate()">
                下载模板
                </div>
                
                <el-button class="clearData" @click="removeVoucher" size="small" type="primary" >清空数据</el-button
                >
            </div>
        </div>
        <div class="codeboxDataWrap" v-if="!!settingData.inviteUserList && settingData.inviteUserList.length>0">
            <div class="codeDatabox">
                <el-table
                    :data="settingData.inviteUserList"
                    stripe
                    :header-cell-style="{ background: '#F7F8FA',color:'#1d2129' }"
                    size="mini"
                    >
                    <el-table-column
                    align="center"
                    prop="inviteUserTag"
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
        <div class="gailvbox">
          <div class="gailvline2">
            <div>预计抽奖人次</div>
            <el-input-number
              size="mini"
              v-model="settingData.personTimes"
              :precision="0"
              :step="1"
              :min="0"
              :controls="showControls"
              :style="{ margin: '5px 30px', width: '80px' }"
            ></el-input-number>
            <div class="prizeNums">{{ "预计奖品数\t" + getPrizeNums() }}</div>
            <el-button type="primary" @click="getWinProbability"
              >计算</el-button
            >
          </div>
          <!-- <div class="errnametip" v-if="!settingData.personTimes">
            预计抽奖人次不能为0
          </div> -->
        </div>
        <namedcomp>
          <div slot="compName" class="copmnamebox">
            <div class="title">
              <span>抽奖次数限制</span> <span class="xing">*</span>
            </div>
            <div class="tip">（每人）</div>
          </div>
          <div slot="component">
            <div class="timesline">
              <div class="timeName">总限制</div>
              <el-input-number
                size="mini"
                v-model="settingData.numRafflesTotal"
                :precision="0"
                :controls="showControls"
                :step="1"
                :disabled="settingData.noNumRafflesTotal"
                :min="0"
                :style="{ margin: '5px', width: '80px' }"
              ></el-input-number>
              <div>次</div>
              <el-checkbox
                :style="{ marginLeft: '15px' }"
                v-model="settingData.noNumRafflesTotal"
                label="true"
                @change="checkboxChange('noNumRafflesTotal')"
                >{{ unlimitedtext }}</el-checkbox
              >
            </div>
            <div class="timesline">
              <div class="timeName">每日限制</div>
              <el-input-number
                size="mini"
                v-model="settingData.numRafflesDay"
                :precision="0"
                :step="1"
                :controls="showControls"
                :disabled="settingData.noNumRafflesDay"
                :min="0"
                :style="{ margin: '5px', width: '80px' }"
              ></el-input-number>
              <div>次</div>
              <el-checkbox
                :style="{ marginLeft: '15px' }"
                v-model="settingData.noNumRafflesDay"
                label="true"
                @change="checkboxChange('noNumRafflesDay')"
                >{{ unlimitedtext }}</el-checkbox
              >
            </div>
            <div
              class="errnametip"
              v-if="
                !settingData.noNumRafflesTotal &&
                !settingData.numRafflesTotal &&
                !settingData.noNumRafflesDay &&
                !settingData.numRafflesDay
              "
            >
              抽奖次数限制不能为空
            </div>
            <div
              class="errnametip"
              v-else-if="
                !settingData.noNumRafflesTotal && !!settingData.noNumRafflesDay
              "
            >
              总限制有限制，每日限制不能无限制
            </div>
            <div
              class="errnametip"
              v-else-if="
                !!settingData.numRafflesDay &&
                !!settingData.numRafflesTotal &&
                !settingData.noNumRafflesTotal &&
                settingData.numRafflesDay > settingData.numRafflesTotal
              "
            >
              {{ unlimitedErrText }}
            </div>
          </div>
        </namedcomp>
        <namedcomp>
          <div slot="compName" class="copmnamebox">
            <div class="title">
              <span>中奖次数限制</span>
            </div>
            <div class="tip">（每人）</div>
          </div>
          <div slot="component">
            <div class="timesline">
              <div class="timeName">总限制</div>
              <el-input-number
                size="mini"
                v-model="settingData.numWinTotal"
                :precision="0"
                :step="1"
                :disabled="settingData.noNumWinTotal"
                :min="0"
                :controls="showControls"
                :style="{ margin: '5px', width: '80px' }"
              ></el-input-number>
              <div>次</div>
              <el-checkbox
                :style="{ marginLeft: '15px' }"
                v-model="settingData.noNumWinTotal"
                label="true"
                @change="checkboxChange('noNumWinTotal')"
                >{{ unlimitedtext }}</el-checkbox
              >
            </div>
            <div class="timesline">
              <div class="timeName">每日限制</div>
              <el-input-number
                size="mini"
                v-model="settingData.numWinDay"
                :precision="0"
                :step="1"
                :controls="showControls"
                :disabled="settingData.noNumWinDay"
                :min="0"
                :style="{ margin: '5px', width: '80px' }"
              ></el-input-number>
              <div>次</div>
              <el-checkbox
                :style="{ marginLeft: '15px' }"
                v-model="settingData.noNumWinDay"
                label="true"
                @change="checkboxChange('noNumWinDay')"
                >{{ unlimitedtext }}</el-checkbox
              >
            </div>
            <div
              class="errnametip"
              v-if="!!settingData.noNumWinDay && !settingData.noNumWinTotal"
            >
              总限制有限制，每日限制不能无限制
            </div>
            <div
              class="errnametip"
              v-else-if="
                !!settingData.numWinDay &&
                settingData.numWinTotal &&
                !settingData.noNumWinTotal &&
                settingData.numWinDay > settingData.numWinTotal
              "
            >
              {{ unlimitedErrText }}
            </div>
          </div>
        </namedcomp>
        <namedcomp>
          <div slot="compName" class="copmnamebox">
            <div class="title">
              <span>活动规则</span>
            </div>
          </div>
          <div slot="component">
            <div class="wangedit">
              <div id="editorElemToolbar" class="editorElemToolbar"></div>
              <div id="editorElemContent" class="editorElemContent"></div>
              <div class="maxlength">
                {{ txtNumbers + "/" + txtMaxlength }}
              </div>
            </div>
            <div class="errnametip" v-if="txtNumbers > txtMaxlength">
              {{ ruleMoreLengthErrText }}
            </div>
          </div>
        </namedcomp>
      </div>
    </div>
    <div class="privewbox">
      <preview
        class="compBox"
        :previewData="previewData"
        :count="settingData.numRafflesDay"
      ></preview>
    </div>
  </div>
</template>
<script>
import { utils } from "opcl";
import {
  lifecycleKeyMap,
  getLifecycleItem,
  geSettingLotteryData,
  getAddPrizeData,
} from "bislibs/home/newlottery-lifecycle";
import {read as xlsxRead,utils as xlsxUtils} from 'xlsx';
const preview = () => import("biscomponents/home/priview/preview-lottery.vue");
import { downLoad_front } from "bislibs/utils/index";
import E from "wangeditor";
export default {
  props: {
    //这里的点击 下一步 的结果集，因为本页面 UE 要求错误提示在页面显示，不需要toast
    canNext: {
      type: Object,
      default: null,
    },
  },
  components: {
    preview,
  },
  data() {
    return {
      settingData: geSettingLotteryData().settingData,
      newLotteryAuth: true,
      showControls: false,
      unlimitedtext: "无限制",
      unlimitedErrText: "每日限制不能大于总限制",
      ruleMoreLengthErrText: "不能超过2000字",
      previewData: {
        goodsType: 1, //添加的商品是线上还是线下
        onlinePrizes: [],
        offlinePrizes: [],
      }, //预览所需数据
      txtNumbers: 0, //实时统计的输入字数
      editortext: "", //输入的字符串，包含样式
      txtMaxlength: 2000,
      firstLoad:false,//是否已经执行了mounted，是否是首次执行
    };
  },
  watch: {
    txtNumbers: {
      handler(val) {
        if (val > this.txtMaxlength) {
          this.editortext = this.editortext.substring(0, this.txtMaxlength);

          this.editorComp.txt.clear();
          this.editorComp.txt.html(this.editortext);
        }
      },
      immediate: true,
    },
  },
  created() {},
  mounted() {
    //首次进来会执行一次
    this.firstLoad = true;    
    this.initWangEdtor();
    this.getGoodsData();
    // this.$refs.focusId && this.$refs.focusId.focus()   
  },
  activated(){
    //防止与mounted重复执行
    if(!this.firstLoad){
      this.getGoodsData();
      // this.$refs.focusId && this.$refs.focusId.focus()         
    }
  },
  deactivated(){
    this.firstLoad = false;        
  },
  methods: {
    /**
     * 下载模板文件
     */
    downTemplate() {
      const that = this;
      that.$iLoading.show();
      downLoad_front('inviteUser');

      setTimeout(() => {
        that.$iLoading.hide();
      }, 1000);
    },
    /**
     * 选择模板文件
     */
    beforeVoucherUpload(file) {
      const name = file.name;
      if (name.indexOf(".xls") != -1 || name.indexOf(".xlsx") != -1) {
        this.loadExcle(file);
      } else {
        utils.showToast("请选择正确的文件格式");
      }
      return false;
    },
    /**
     * 删除模板文件
     */
    removeVoucher() {
        this.$set(this.settingData, "inviteUserList", []);
    },
    /**
     * 解析模板数据
     */
    loadExcle(file){
        let that = this
        let rABS = true;
        const f = file;
        let reader = new FileReader();
        if (rABS) {reader.readAsBinaryString(f);} else {reader.readAsArrayBuffer(f);}
        reader.onload = function(e){
            var data = e.target.result;
            if (!rABS) {data = new Uint8Array(data);}
            var workbook = xlsxRead(data, {
                type: rABS ? 'binary' : 'array'
            });
            // 假设我们的数据在第一个标签
            var first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
            // XLSX自带了一个工具把导入的数据转成json
            var jsonArr = xlsxUtils.sheet_to_json(first_worksheet, {header:1});
            // 通过自定义的方法处理Json
            const res = that.handleImpotedJson(jsonArr);
        };
    },
    
    // 解析导入的公司
    handleImpotedJson(data){
        try {
            let jsonData = data.filter((item)=>item.length > 0)
            if(!!jsonData.length && jsonData.length > 0){
                //长度校验
                if(jsonData.length == 0){
                    utils.showToast(`上传失败,数据为空`);
                    return;
                }
                // 整合商品详情的入参
                let inviteUserList = [];
                for(let index = 0; index < jsonData.length; index++) {
                    const ele = jsonData[index];
                    if(Array.isArray(ele)&&ele.length>0){
                        if(index==0){
                            if(ele[0]!='用户ID' || ele[1]!='企业ID' || ele[2]!='渠道ID'){
                                utils.showToast(`格式错误,请检查第${index+1}行数据`);
                                return
                            }
                        }else{
                            if(!!!ele[0]){
                                utils.showToast(`用户ID不能为空,请检查第${index+1}行数据`);
                                return
                            }
                            if(!!!ele[2]){
                                utils.showToast(`渠道ID不能为空,请检查第${index+1}行数据`);
                                return
                            }
                            inviteUserList.push({
                                inviteUserTag: ele[0],
                                companyId: ele[1],
                                channelId: ele[2]
                            });
                        }
                    }
                }
                this.$set(this.settingData, "inviteUserList", inviteUserList);
            }
        } catch (error) {
            utils.showToast('解析失败,请按格式上传!');
        }
    },    
    //奖品数量
    getPrizeNums() {
      let prizes = getLifecycleItem(lifecycleKeyMap.ADD_PRIZE).resultData
      let prizeList = prizes.online.concat(prizes.offline)

      let totalNum = 0
      prizeList.forEach(element => {
          totalNum = this.$math.chain(totalNum).add(element.num);
      });
      return totalNum
    },
    getWinProbability() {
      if (this.$math.equal(this.settingData.personTimes, 0)) {
        utils.showToast("预计抽奖人次不能为0");
        return;
      }
      this.settingData.winProbability = this.$math
        .chain(this.getPrizeNums())
        .divide(this.settingData.personTimes)
        .multiply(100)
        .done()
        .toFixed(2);
      this.filterNumberAndDot();
    },
    //获取预览所需商品信息
    getGoodsData() {
      this.previewData.onlinePrizes = getAddPrizeData().onlinePrizes;
      this.previewData.offlinePrizes = getAddPrizeData().offlinePrizes;
    },
    initWangEdtor() {
      this.editorComp = new E("#editorElemToolbar", "#editorElemContent");
      // debugger;
      // 关闭粘贴样式的过滤
      // this.editorComp.config.pasteFilterStyle = false;
      this.editorComp.config.placeholder = "请输入抽奖说明";

      this.editorComp.config.menus = [
        // 菜单配置
        "fontSize", // 字号
        "foreColor", // 文字颜色
        // "backColor", // 背景颜色
        // "head", // 标题
        "bold", // 粗体
        "italic", // 斜体
        "underline", // 下划线
        "strikeThrough", // 删除线
        "list", // 列表
        "justify", // 对齐方式
        // "fontName", // 字体
        // "link", // 插入链接
        // "quote", // 引用
        // "emoticon", // 表情
        // "image", // 插入图片
        // "table", // 表格
        // "code", // 插入代码
        // "undo", // 撤销
        // "redo" // 重复
      ];
      // 自定义配置颜色（字体颜色、背景色）
      this.editorComp.config.colors = [
        "#000000",
        "#1c487f",
        "#191919",
        "#23c7ad",

        "#25cb67",
        "#333333",
        "#3864A7",
        "#407cd6",

        "#4d80bf",
        "#46acc8",
        "#478aee",
        "#666666",

        "#7b5ba1",
        "#8baa4a",
        "#999999",
        "#a9a9a9",

        "#b2b2b2",
        "#B5d0f9",
        "#c2c2c2",
        "#c24f4a",

        "#cccccc",
        "#d7d7d7",
        "#e7e7e7",
        "#eeece0",

        "#ecf3fd",
        "#e5e5e5",
        "#f9963b",
        "#f2f3f5",

        "#f25e3d",
        "#f83939",
        "#f8a339",
        "#ff4e4e",

        "#ff8b03",
        "#ffebeb",
        "#ffffff",
      ];

      // 把这个html通过submit的方法传入父组件
      this.editorComp.config.onchange = (html) => {
        //监听txt的变化
        this.editortext = this.editorComp.txt.text();
        this.txtNumbers = (this.editortext && this.editortext.length) || 0;
        this.settingData.activityRule = html;
        this.settingData.editortext = this.editortext;
        // console.log(this.settingData.activityRule.length);
      };
      // 取消自动 focus
      this.editorComp.config.focus = false
      this.editorComp.create(); // 创建富文本实例
      //赋初值
      this.editorComp.txt.html(this.settingData.activityRule);
    },
    filterNumberAndDot() {
      let value = this.settingData.winProbability;

      value = value
        .replace(/[^\d.]/g, "") //将非数字和点以外的字符替换成空
        .replace(/^\./g, "") //验证第一个字符是数字而不是点
        .replace(/\.{2,}/g, ".") //出现多个点时只保留第一个
        .replace(".", "$#$") // 1、将数字的点替换成复杂字符$#$
        .replace(/\./g, "") // 2、将字符串的点直接清掉
        .replace("$#$", ".") // 3、将复杂字符再转换回点
        .replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); //只能输入两个小数
      if (value.indexOf(".") < 0 && value != "") {
        value = parseFloat(value);
      } else if (value.indexOf(".") > 1 && value[0] === "0") {
        value = parseFloat(value);
      }
      if (value > 100) {
        value = (100.0).toFixed(2);
      }
      // this.$set向响应式对象中添加一个属性，并确保这个新属性同样是响应式的，且触发视图更新

      //调用方法：this.$set( target, key, value )
      // target：要更改的数据源(可以是对象或者数组)
      // key：要更改的具体数据
      // value ：重新赋的值
      this.$set(this.settingData, "winProbability", value.toString());
    },
    /**
     * 不限制输入，清空 数字
     */
    checkboxChange(type) {
      if (type == "noNumWinDay") {
        this.settingData.numWinDay = this.settingData.noNumWinDay
          ? undefined
          : 1;
      } else if (type == "noNumWinTotal") {
        this.settingData.numWinTotal = this.settingData.noNumWinTotal
          ? undefined
          : 1;
      } else if (type == "noNumRafflesDay") {
        this.settingData.numRafflesDay = this.settingData.noNumRafflesDay
          ? undefined
          : 1;
      } else if (type == "noNumRafflesTotal") {
        this.settingData.numRafflesTotal = this.settingData.noNumRafflesTotal
          ? undefined
          : 1;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.setlottery {
  display: flex;
  height: calc(~"100vh - 305px");
  overflow: auto;
  .operationbox {
    flex: 1;
    .settingbox {
      border: 1px solid #e2e2e2;
      padding: 10px;
      /deep/ .el-input__inner {
        padding-left: 5px;
        padding-right: 5px;
      }
      .errnametip {
        color: red;
        font-size: x-small;
      }
      .gailvUnit {
        display: flex;
        align-items: center;
        height: 100%;
      }
      
        .codebox {
            display: flex;
            padding: 5px;
            .namebox {
                width: 120px;
                padding-left: 16px
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
            .clearData{
                margin-left: 10px;
            }
        }
        .codeboxDataWrap{
            padding: 5px 21px;
            .codeDatabox{
                max-height:300px;
                overflow-y: auto;
                border: 1px solid #e2e2e2;
            }

        }

      .gailvbox {
        margin-left: 20px;
        background: #f2f2f2;
        padding: 10px 20px;
        .gailvline2 {
          display: flex;
          background: #f2f2f2;
          align-items: center;
          .prizeNums {
            margin-right: 30px;
          }
        }
      }
      .copmnamebox {
        width: 120px;
        padding-left: 16px;
        .title {
          display: flex;
          .xing {
            color: red;
          }
        }
        .tip {
          color: gray;
        }
      }
      .timesline {
        display: flex;
        margin-bottom: 10px;
        align-items: center;
        .timeName {
          width: 60px;
        }
      }
      .wangedit {
        position: relative;
        .editorElemToolbar {
          border: 1px solid #e2e2e2;
          border-bottom: none;
        }
        .editorElemContent {
          border: 1px solid #e2e2e2;
          height: 150px;
          width: 500px;
          /deep/ ul,
          ul li {
            list-style-type: initial;
          }
        }
        .maxlength {
          position: absolute;
          right: 5px;
          bottom: 5px;
          z-index: 10000;
          background: transparent;
          color: black;
        }
      }
    }
  }
  .privewbox {
    flex: 1;
    display: flex;
    justify-content: center;
  }
}
</style>