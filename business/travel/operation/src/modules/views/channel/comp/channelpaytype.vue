<template>
  <div class="payment-edit-content">
    <section>
      <div class="row">
        <div class="left required">请选择支付方式：</div>
        <div class="right">
          <template
            v-if="!!formData.paymentPlatformTypes && formData.paymentPlatformTypes.length!=0"
          >
            <div class="pay-type-container">
              <div
                class="firstLevel"
                v-for="pay in formData.paymentPlatformTypes"
                :key="pay.channelId"
              >
                <div class="firstLine">
                  <span
                    @click.stop="pay.selected = !pay.selected"
                    class="itemIcon"
                    :class="pay.selected ? 'check' : 'uncheck'"
                  ></span>
                  <img
                    class="itemIcon1"
                    :src="pay.icon||require('assets//upload.png')"
                  />
                  <div class="itemName">
                    <span>{{pay.payTypeName}}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <span class="info-label">未获取到支付方式</span>
          </template>
          <div
            class="error-msg"
            v-if="formData.validateMsg.paymentPlatformTypesErrorMsg"
          >{{formData.validateMsg.paymentPlatformTypesErrorMsg}}</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import tmHandler from "bislibs/requesthandler/traveloperationhandler.js";

export default {
  props: {
    inputData: {
      //页面操作数据
      type: Object,
      required: true,
      default: {
        paymentPlatforms: []
      }
    },
    value: {
      //v-model
      type: [Object, String],
      default: {}
    }
  },
  directives: {},
  components: {},
  data() {
    return {
      //表单数据
      formData: {
        paymentPlatformTypes: [], //支付平台类型集合
        validateMsg: {} //校验结果
      }
    };
  },
  computed: {},
  activated() {},
  created() {},
  mounted() {},
  watch: {
    /**
     * 输入数据初始化
     */
    inputData: {
      handler(val, oldVal) {
        let that = this;
        // "";
        if (!!val && !!val.paymentPlatforms) {
          that.afterGetPlatforms(val.paymentPlatforms);
        }
      },
      immediate: true,
      deep: true
    },
    "formData.paymentPlatformTypes": {
      handler(val, oldVal) {
        let that = this;
        //如果数据不为空了，我们跑一下这个检验
        that.validateFormMsgPayTypes(that.formData);
      },
      //   immediate: true,
      deep: true
    }
  },
  methods: {
    /**
     * 处理支付方式处理，用于页面的逻辑。where=1 是新增，where=2是编辑
     */
    afterGetPlatforms(payments) {
      const that = this;
      that.formData.paymentPlatformTypes = JSON.parse(JSON.stringify(payments));
      //清空支付方式列表数据
    },
    /**
     * 校验 支付方式
     */
    validateFormMsgPayTypes(data) {
      const that = this;
      //清空上一次的校验
      // delete that.formData.validateMsg["paymentPlatformTypesErrorMsg"];
      let result = true;
      let errorMsg;
      // ""
      if (this.noSelectedPay()) {
        errorMsg = "请开启至少一种支付方式";
        // that.$set(
        //   that.formData.validateMsg,
        //   "paymentPlatformTypesErrorMsg",
        //   errorMsg
        // );
        // utils.showToast(errorMsg);
        result = false;
      }

      that.submit(true, result, errorMsg); //给v-model赋值
      return result;
    },

    /**
     * 是否没有选择支付方式？
     */
    noSelectedPay(){
      const that = this;
      let result = true;
      for (let j = 0; j < that.formData.paymentPlatformTypes.length; j++) {
        if (that.formData.paymentPlatformTypes[j].selected) {
            result = false
            break;
        }
      }
      return result
    },

    /**
     * 提交v-model
     */
    submit(fromValid, vaildResult, errorMsg) {
      const that = this;
      // console.log("submit.v-model");
      if (!fromValid) {
        //非必要的字段，我们调用一次校验
        that.validateFormMsgPayTypes(that.formData);
        return;
      }
      // "";
      let requestBody = { payTypeList: [] };
      //去掉未被选中的支付方式
      for (let j = 0; j < that.formData.paymentPlatformTypes.length; j++) {
        let selectItem = JSON.parse(
          JSON.stringify(that.formData.paymentPlatformTypes[j])
        );
        if (selectItem.selected) {
          delete selectItem["selected"];
          requestBody.payTypeList.push(selectItem);
        }
      }
      //返回输入数据
      var outData = {
        requestData: requestBody,
        vaildResult: vaildResult,
        errorMsg: errorMsg
      };

      this.$emit("input", outData); //v-model
    }
  }
};
</script>
<style scoped lang="less">
@import "~styles/common.less";
@import "~styles/variables.less";
@import "~styles/mixins/mixins.less";

* {
  box-sizing: border-box;
  color: @font-color;
}

.payment-edit-content {
  margin-left: 10px;
  background: #fff;
  height: 100%;

  section {
    padding-top: 10px;
    background: #fff;
    border-radius: 5px;

    .row {
      .clear;
      margin-bottom: 30px;
      font-size: 14px;
      color: #333;

      .info-label {
        color: @label-color;
      }

      .required:before {
        content: "*";
        color: @font-red-color;
        font-size: 12px;
        margin-right: 6px;
      }

      .error-msg {
        color: @font-red-color;
        padding-left: 10px;
        margin-top: 6px;
        font-size: 12px;
        line-height: initial;
      }

      .left {
        float: left;
        width: 150px;
        height: 32px;
        line-height: 32px;
        text-align: right;
        padding-right: 10px;
      }

      .leftNested {
        width: 110px;
      }
      .leftNested1 {
        width: auto;
        padding-left: 10px;
      }
      .right {
        @width: 100%;
        width: @width;
        min-height: 32px;
        line-height: 32px;
        float: left;
        text-align: left;

        .protocol {
          width: 28vw;
        }

        .pay-type-container {
          width: 100%;
          border: 1px solid #e2e2e2;
          border-radius: 2px;
          display: flex;
          flex-wrap: wrap;
          // height: 150px;
          // overflow-y: scroll;
          .firstLevel {
            margin: 0px;
            .firstLine {
              display: flex;
              // justify-content: space-between;
              align-items: center;
              // border-bottom: 1px solid #e2e2e2;
              .itemName {
                margin: 5px 0px;
                display: flex;
                img {
                  height: 16px;
                  width: 16px;
                  margin: 5px;
                }
              }

              .upbtn {
                padding: 2px;
                height: 20px;
                line-height: 20px;
                position: relative;
                cursor: pointer;
                text-decoration: underline;
                color: #999999;
                font-size: 12px;
                overflow: hidden;
                display: inline-block;
                *display: inline;
                *zoom: 1;
                .input {
                  position: absolute;
                  font-size: 100px;
                  right: 0;
                  top: 0;
                  opacity: 0;
                  filter: alpha(opacity=0);
                  cursor: pointer;
                }
              }
              .upbtn:hover {
                // color: #444;
                // background: #eee;
                // border-color: #ccc;
                text-decoration: none;
              }
              // .itemIcon{
              //     height: 18px;
              //     width: 36px;
              //     margin: 0px 10px;
              // }
              // .check{
              //     background: url(~assets//icon_open.png) 0 center no-repeat transparent;
              // }
              // .uncheck{
              //     background: url(~assets//icon_close.png) 0 center no-repeat transparent;
              // }
              .itemIcon {
                height: 16px;
                width: 16px;
                margin: 0px 10px;
              }
              .itemIcon1 {
                height: 16px;
                width: 16px;
              }
              .check {
                background: url(~assets//icon_check.png)
                  0 center no-repeat transparent;
              }
              .uncheck {
                background: url(~assets//icon_uncheck.png)
                  0 center no-repeat transparent;
              }
            }
            .firstLine1 {
              border: none;
            }
          }
        }
      }
    }
  }
}
</style>


