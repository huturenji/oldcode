<template>
  <div class="channel-edit-content">
    <header>
      <a class="icon-back" @click="$router.go(-1)"></a>
      <span class="title">{{docTitle}}</span>
    </header>

    <section>
      <div class="row">
        <div class="left required">渠道名称：</div>
        <div class="right">
          <input
            type="text"
            placeholder="如有多套环境，请找行长确认，需清晰表示当前环境"
            v-model.trim="formData.channelName"
            maxlength="64"
          />
          <div
            class="error-msg"
            v-if="formData.validateMsg.productionChannelNameErrorMsg"
          >{{formData.validateMsg.productionChannelNameErrorMsg}}</div>
        </div>
      </div>

      <div class="row">
        <div class="left required">渠道ID：</div>
        <div class="right">
          <input
            type="text"
            placeholder="请找行长确认"
            v-model.trim="formData.channelId"
            maxlength="9"
          />
          <div
            class="error-msg"
            v-if="formData.validateMsg.productionChannelIdErrorMsg"
          >{{formData.validateMsg.productionChannelIdErrorMsg}}</div>
        </div>
      </div>

      <div class="row">
        <div class="left required">消息推送路径：</div>
        <div class="right">
          <input
            type="text"
            placeholder="请找行长确认"
            v-model.trim="formData.pushMessageUrl"
            maxlength="256"
          />
          <div
            class="error-msg"
            v-if="formData.validateMsg.productionMsgPushPathErrorMsg"
          >{{formData.validateMsg.productionMsgPushPathErrorMsg}}</div>
        </div>
      </div>

      <div class="row">
        <div class="left">审批去申请路径：</div>
        <div class="right">
          <input
            type="text"
            placeholder="可选配置，请找行长确认"
            v-model.trim="formData.approveTravelUrl"
            maxlength="256"
          />
          <div
            class="error-msg"
            v-if="formData.validateMsg.productionApprovalPathErrorMsg"
          >{{formData.validateMsg.productionApprovalPathErrorMsg}}</div>
        </div>
      </div>

      <div class="row">
        <div class="left">企业发票抬头路径：</div>
        <div class="right">
          <input
            type="text"
            placeholder="可选配置，请找行长确认"
            v-model.trim="formData.companyInvoiceTitleUrl"
            maxlength="256"
          />
          <div
            class="error-msg"
            v-if="formData.validateMsg.productionInvoiceTitleErrorMsg"
          >{{formData.validateMsg.productionInvoiceTitleErrorMsg}}</div>
        </div>
      </div>      

      <div class="oneline">对接伴正事下列配置都不再需要，保留默认值即可。但对接T信是必需的，请逐一确认！</div>

      <div class="row">
        <div class="left required">产品域ID：</div>
        <div class="right">
          <input type="text" placeholder="该配置T信必需，请找行长确认。"
            v-model.trim="formData.zoneId" maxlength="64" />
          <div
            class="error-msg"
            v-if="formData.validateMsg.productionYuIdErrorMsg"
          >{{formData.validateMsg.productionYuIdErrorMsg}}</div>
        </div>
      </div>

      <div class="row">
        <div class="left required">应用ID：</div>
        <div class="right">
          <input
            type="text"
            placeholder="该配置T信必需，请使用默认值"
            v-model.trim="formData.applicationId"
            maxlength="64"
          />
          <div
            class="error-msg"
            v-if="formData.validateMsg.productionAppIdErrorMsg"
          >{{formData.validateMsg.productionAppIdErrorMsg}}</div>
        </div>
      </div>

      <div class="row">
        <div class="left required">应用密钥：</div>
        <div class="right">
          <input
            type="text"
            placeholder="该配置T信必需，请使用默认值"
            v-model.trim="formData.applicationKey"
            maxlength="64"
          />
          <div
            class="error-msg"
            v-if="formData.validateMsg.productionSecretKeyErrorMsg"
          >{{formData.validateMsg.productionSecretKeyErrorMsg}}</div>
        </div>
      </div>

      <div class="row">
        <div class="left required">授权认证请求路径：</div>
        <div class="right">
          <input
            type="text"
            placeholder="该配置T信必需，请找行长确认。"
            v-model.trim="formData.authorizedCertificationUrl"
            maxlength="256"
          />
          <div
            class="error-msg"
            v-if="formData.validateMsg.productionChannelPathErrorMsg"
          >{{formData.validateMsg.productionChannelPathErrorMsg}}</div>
        </div>
        <div
          class="rightMore"
          v-if="!!channelId && !!productionResData && productionResData.authorizedCertificationUrl 
                    == formData.authorizedCertificationUrl"
        ></div>
      </div>

      <div class="formList">
        <h3>选择渠道业务</h3>
        <div v-for="item in formArray" :key="item.name" class="formItem">
          <!-- <div class="formBase" @click.stop="selectBusType(item)">
                        <span class="itemIcon" :class="item.show ? 'check' : 'uncheck'"></span>
                        <span>{{item.name}}</span>
          </div>-->
          <div class="formBase2">{{item.name}}</div>
          <channelFormPay
            v-if="item.show && formCompNamePay==item.componentName"
            v-model="channelFormPayModel"
            :inputData="channelFormPayInputData"
          ></channelFormPay>
          <channelFormServiceLA
            v-else-if="item.show && formCompNameSLA==item.componentName"
            v-model="channelFormSLAModel"
            :inputData="channelFormSLAInitData"
          ></channelFormServiceLA>
          <agreementcomp  
            v-else-if="item.show && formCompNamePCL==item.componentName" 
            :dataArray="channelFormPCLInitData" 
            @onDataChange="getOutputList"
          ></agreementcomp>
        </div>
      </div>
    </section>

    <operationlogs v-if="!!this.channelId"></operationlogs>
    <div class="save-btn cursorp" @click="submit">保存</div>
    <Loading :show="loading" text="正在保存配置，请稍候"></Loading>
  </div>
</template>

<script>
import tmHandler from "bislibs/requesthandler/traveloperationhandler.js";
import utils from "bislibs/utils";
// import  * as travelfun from "bislibs/traveloperationfun.js";
const channelFormPay = () => import("./comp/channelpaytype.vue");
const channelFormServiceLA = () => import("./comp/channelprotocol.vue");
const agreementcomp = () => import("./comp/agreementcomp.vue");
const operationlogs = () => import("./comp/operationlogs.vue");
export default {
  directives: {},
  components: {
    channelFormPay,
    channelFormServiceLA,
    agreementcomp,
    operationlogs
  },
  data() {
    return {
      loading: false,
      channelId: this.$route.query && this.$route.query.channelId,
      productionResData: null, //编辑时候从接口获取的原始数据
      //表单数据
      formData: {
        id:null,//数据库id
        channelName: null, ///产品渠道名称，中文名（T信，商旅通，金贝等）
        channelId: null, // 产品渠道Id，1=T信，4=商旅通，4098=金贝
        applicationId: "268435518", // 应用Id,银企通第三方授权分配的应用ID,
        applicationKey: "268435518", // 应用密钥,银企通第三方授权分配的应用密钥,
        authorizedCertificationUrl: "https://bizmateuat.sinosun.com/bizmate/sso123", //产品渠道访问路径
        pushMessageUrl: null, //消息推送路径
        approveTravelUrl: null, //申请审批路径
        companyInvoiceTitleUrl: null, //企业发票抬头路径
        zoneId: "0", //产品域ID
        validateMsg: {} //校验结果
      },
      formCompNamePay: "channelFormPay",
      formCompNameSLA: "serviceAuthLetter",
      formCompNamePCL: "protocolConfig",
      formArray: [
        {
          name: "支付方式",
          show: true,
          componentName: "channelFormPay"
        },
        {
          name: "服务授权",
          show: true,
          componentName: "serviceAuthLetter"
        },
        {
          name: "协议配置",
          show: true,
          componentName: "protocolConfig"
        }        
      ], //业务组件数据集
      channelFormPayModel: null, //支付方式组件的数据
      channelFormPayInputData: {
        paymentPlatforms: null,
        where: 1,
        otherPaymentData: {}
      }, //支付方式组件的默认赋值
      channelFormSLAModel: "", //授权协议的组件数据，HTML格式文本
      channelFormSLAInitData: null, //授权协议初始化入参，object格式
      channelFormPCLModel:"",//协议配置组件返回的数据
      channelFormPCLInitData: null //协议配置初始化入参，object格式      
    };
  },
  computed: {
    docTitle: function() {
      return (!!this.channelId ? "编辑" : "新增") + "分销渠道";
    }
  },
  activated() {},
  created() {
    const that = this;
    document.title = that.docTitle;
    if (that.channelId) {
      that.getChannel();
    } else {
      //获取支付方式列表
      that.getPaymentPlatforms();
      that.protocolCompToNet()
    }
  },
  mounted() {},
  watch: {
    "formData.channelName": function(val, oldVal) {
      let that = this;
      if (!!val) {
        //如果数据不为空了，我们跑一下这个检验
        that.validateFormChannelName(that.formData);
      }
    },
    "formData.channelId": function(val, oldVal) {
      let that = this;
      if (!!val) {
        //如果数据不为空了，我们跑一下这个检验
        that.validateFormChannelId(that.formData);
      }
    },
    "formData.applicationId": function(val, oldVal) {
      let that = this;
      if (!!val) {
        //如果数据不为空了，我们跑一下这个检验
        that.validateFormAppId(that.formData);
      }
    },
    "formData.applicationKey": function(val, oldVal) {
      let that = this;
      if (!!val) {
        //如果数据不为空了，我们跑一下这个检验
        that.validateFormSecretKey(that.formData);
      }
    },
    "formData.authorizedCertificationUrl": function(val, oldVal) {
      let that = this;
      if (!!val) {
        //如果数据不为空了，我们跑一下这个检验
        that.validateFormChannelPath(that.formData);
      }
    },
    "formData.pushMessageUrl": function(val, oldVal) {
      let that = this;
      if (!!val) {
        //如果数据不为空了，我们跑一下这个检验
        that.validateFormMsgPushPath(that.formData);
      }
    },
    "formData.approveTravelUrl": function(val, oldVal) {
      let that = this;
      //如果数据不为空了，我们跑一下这个检验
      that.validateFormApprovalPath(that.formData);
    },
    "formData.companyInvoiceTitleUrl": function(val, oldVal) {
      let that = this;
      //如果数据不为空了，我们跑一下这个检验
      that.validateFormInvoiceTitle(that.formData);
    },    
    "formData.zoneId": function(val, oldVal) {
      let that = this;
      //如果数据不为空了，我们跑一下这个检验
      that.validateFormProductionYuId(that.formData);
    }
  },
  methods: {
    /**
     * 获取支付方式列表
     */
    getPaymentPlatforms() {
      const that = this;
      return new Promise((resolve, reject) => {
        let request = {};
        tmHandler.getPaymentPlatforms(request).then(
          function(res) {

            if (0 == res.resultCode && !!res.result && !!res.result.payTypes) {
              that.channelFormPayInputData.paymentPlatforms =
                res.result.payTypes;

              for (
                let i = 0;
                i < that.channelFormPayInputData.paymentPlatforms.length;
                i++
              ) {
                let inputItem =
                  that.channelFormPayInputData.paymentPlatforms[i];
                inputItem.selected = false;
                if (that.channelFormPayInputData.selectPayments) {
                  for (
                    let j = 0;
                    j < that.channelFormPayInputData.selectPayments.length;
                    j++
                  ) {
                    let selectItem =
                      that.channelFormPayInputData.selectPayments[j];
                    if (inputItem.payType == selectItem.payType) {
                      inputItem.selected = true;
                      j = that.channelFormPayInputData.selectPayments.length;
                    }
                  }
                }
              }

              resolve(1);
            } else {
              resolve(0);
            }
          },
          function(error) {
            console.info(error);
            reject();
          }
        );
      });
    },

    /**
     * 根据id获取渠道设置
     */
    getChannel() {
      const that = this;
      const defaultErrorMsg = "获取渠道配置失败";
      return new Promise((resolve, reject) => {
        if (!that.channelId) {
          reject();
        }
        let request = { channelId: that.channelId };
        tmHandler
          .getProductionChannelById(request)
          .then(function(res) {            
            //新增时返回ProductionChannelNo，编辑时返回IsSuccess
            if (0 == res.resultCode && !!res.result) {
              that.productionResData = res.result; //将原始数据缓存一份。

              that.formData.channelName = res.result.channelName;
              that.formData.channelId = res.result.channelId;
              that.formData.id = res.result.id;
              that.formData.applicationId = res.result.applicationId;
              that.formData.applicationKey = res.result.applicationKey;
              that.formData.authorizedCertificationUrl =
                res.result.authorizedCertificationUrl;
              that.formData.pushMessageUrl = res.result.pushMessageUrl;              
              that.formData.approveTravelUrl = res.result.approveTravelUrl;
              that.formData.companyInvoiceTitleUrl = res.result.companyInvoiceTitleUrl;
              that.formData.zoneId = res.result.zoneId;

              if (res.result.payTypes && res.result.payTypes.length > 0) {
                //如果接口有数据，需要赋值已选中的支付方式
                // that.formArray[0].show = true;
                that.channelFormPayInputData.selectPayments =
                  res.result.payTypes;
                // that.channelFormPayInputData.paymentPlatforms =
                //     res.result.payTypes;
                // that.channelFormPayInputData.otherPaymentData = otherPaymentData;
                // that.channelFormPayInputData.where = 2;
              }
              //拉取全量的支付列表数据
              that.getPaymentPlatforms();

              //整理 授权服务的初始化数据

              if (!!res.result.protocol) {
                that.channelFormSLAInitData = res.result.protocol;
              } else {
                that.channelFormSLAInitData = {};
              }
              //整理协议配置的初始化数据
              if (!!res.result.protocolConfigList && res.result.protocolConfigList.length > 0) {
                that.channelFormPCLInitData = []
                res.result.protocolConfigList.forEach(element => {
                  let  pcItem = {
                    id: element.protocolId,
                    name: element.protocolName,
                    fielName: element.protocolUrl.substr(
                      (element.protocolUrl.lastIndexOf("/") || 0) + 1 ),
                    fileUrl: element.protocolUrl,
                    uploadDefault: [],
                  }
                  //加载已有的图片
                  if (element.protocolUrl) {
                      pcItem.uploadDefault.push({
                          name: pcItem.fielName,
                          url: element.protocolUrl,
                      });
                  }                  
                  that.channelFormPCLInitData.push(pcItem)
                });
              } else {
                that.protocolCompToNet();
              }              

              resolve(1);
            } else {
              utils.showToast(res.resultMessage || defaultErrorMsg);
              resolve(0);
            }
          })
          .catch(e => {
            that.protocolCompToNet();
            utils.showToast(defaultErrorMsg);
            console.error("获取渠道配置失败:" + e);
            reject();
          });
      });
    },
    /**
     * 没有数据的时候，默认显示一个协议配置框
     */
    protocolCompToNet(){
      this.channelFormPCLInitData = [{
        id: "",
        name: "",
        fielName: "",
        fileUrl: "",
        uploadDefault: [],
      }];
    },
    /**
     * 表单校验
     */
    validateForm(data) {
      const that = this;
      let result = true;
      //清空上一次的校验
      // that.formData.validateMsg = {};
      if (!that.validateFormChannelName(data)) {
        result = false;
        return result;
      }
      if (!that.validateFormChannelId(data)) {
        result = false;
        return result;
      }
      if (!that.validateFormAppId(data)) {
        result = false;
        return result;
      }
      if (!that.validateFormSecretKey(data)) {
        result = false;
        return result;
      }
      if (!that.validateFormChannelPath(data)) {
        result = false;
        return result;
      }
      if (!that.validateFormMsgPushPath(data)) {
        result = false;
        return result;
      }
      if (!that.validateFormApprovalPath(data)) {
        result = false;
        return result;
      } 
      if (!that.validateFormInvoiceTitle(data)) {
        result = false;
        return result;
      }
      if (!that.validateFormProductionYuId(data)) {
        result = false;
        return result;
      } else {
        return result;
      }
    },
    /**
     * 校验 ApprovalPath，应该是可选的
     */
    validateFormApprovalPath(data) {
      const that = this;
      //清空上一次的校验
      delete that.formData.validateMsg["productionApprovalPathErrorMsg"];
      let result = true;
      //可选字段，只检查有输入的时候有效性
      if (
        !!data.approveTravelUrl &&
        !utils.isValidUrl(data.approveTravelUrl)
      ) {
        that.$set(
          that.formData.validateMsg,
          "productionApprovalPathErrorMsg",
          "请输入有效的路径"
        );
        utils.showToast("请输入有效的路径");
        result = false;
      }
      return result;
    },
    /**
     * 校验 InvoiceTitle，应该是可选的
     */
    validateFormInvoiceTitle(data) {
      const that = this;
      //清空上一次的校验
      delete that.formData.validateMsg["productionInvoiceTitleErrorMsg"];
      let result = true;
      //可选字段，只检查有输入的时候有效性
      if (
        !!data.companyInvoiceTitleUrl &&
        !utils.isValidUrl(data.companyInvoiceTitleUrl)
      ) {
        that.$set(
          that.formData.validateMsg,
          "productionInvoiceTitleErrorMsg",
          "请输入有效的路径"
        );
        utils.showToast("请输入有效的路径");
        result = false;
      }
      return result;
    },    
    /**
     * 校验 zoneId
     */
    validateFormProductionYuId(data) {
      const that = this;
      //清空上一次的校验
      delete that.formData.validateMsg["productionYuIdErrorMsg"];
      let result = true;
      //可选字段，只检查有输入的时候有效性
      if (that.checkInputIsEmpty(data.zoneId)) {
          that.$set(
              that.formData.validateMsg,
              "productionYuIdErrorMsg",
              "请输入产品域ID"
          );
          utils.showToast("请输入产品域ID");
          result = false;
      }
      return result;
    },
    checkInputIsEmpty(inVal){
      return inVal==null || inVal== undefined ||!inVal.toString() || inVal.toString()=='NaN'
    },
    /**
     * 校验 MsgPushPath
     */
    validateFormMsgPushPath(data) {
      const that = this;
      //清空上一次的校验
      delete that.formData.validateMsg["productionMsgPushPathErrorMsg"];
      let result = true;
      if (!data.pushMessageUrl) {
        that.$set(
          that.formData.validateMsg,
          "productionMsgPushPathErrorMsg",
          "请输入消息推送路径"
        );
        utils.showToast("请输入消息推送路径");
        result = false;
      } else if (!utils.isValidUrl(data.pushMessageUrl)) {
        that.$set(
          that.formData.validateMsg,
          "productionMsgPushPathErrorMsg",
          "请输入有效的路径"
        );
        utils.showToast("请输入有效的路径");
        result = false;
      }
      return result;
    },
    /**
     * 校验 ChannelPath
     */
    validateFormChannelPath(data) {
      const that = this;
      //清空上一次的校验
      delete that.formData.validateMsg["productionChannelPathErrorMsg"];
      let result = true;
      if (!data.authorizedCertificationUrl) {
        that.$set(
          that.formData.validateMsg,
          "productionChannelPathErrorMsg",
          "请输入授权认证请求路径"
        );
        utils.showToast("请输入授权认证请求路径");
        result = false;
      } else if (!utils.isValidUrl(data.authorizedCertificationUrl)) {
        that.$set(
          that.formData.validateMsg,
          "productionChannelPathErrorMsg",
          "请输入有效的路径"
        );
        utils.showToast("请输入有效的路径");
        result = false;
      }
      return result;
    },
    /**
     * 校验 SecretKey
     */
    validateFormSecretKey(data) {
      const that = this;
      //清空上一次的校验
      delete that.formData.validateMsg["productionSecretKeyErrorMsg"];
      let result = true;
      if (!data.applicationKey) {
        that.$set(
          that.formData.validateMsg,
          "productionSecretKeyErrorMsg",
          "请输入应用密钥"
        );
        utils.showToast("请输入应用密钥");
        result = false;
      }
      return result;
    },
    /**
     * 校验AppId
     */
    validateFormAppId(data) {
      const that = this;
      //清空上一次的校验
      delete that.formData.validateMsg["productionAppIdErrorMsg"];
      let result = true;
      if (!data.applicationId) {
        that.$set(
          that.formData.validateMsg,
          "productionAppIdErrorMsg",
          "请输入应用ID"
        );
        utils.showToast("请输入应用ID");
        result = false;
      }
      return result;
    },
    /**
     * 校验渠道ID
     */
    validateFormChannelId(data) {
      const that = this;
      //清空上一次的校验
      delete that.formData.validateMsg["productionChannelIdErrorMsg"];
      let result = true;
      if (that.checkInputIsEmpty(data.channelId)) {
        that.$set(
          that.formData.validateMsg,
          "productionChannelIdErrorMsg",
          "请输入渠道ID"
        );
        utils.showToast("请输入渠道ID");
        result = false;
      } else if (isNaN(data.channelId)) {
        that.$set(
          that.formData.validateMsg,
          "productionChannelIdErrorMsg",
          "渠道ID必须是数字"
        );
        utils.showToast("渠道ID必须是数字");
        result = false;
      } else {
        data.channelId = parseInt(data.channelId);
      }
      return result;
    },
    /**
     * 校验名字
     */
    validateFormChannelName(data) {
      const that = this;
      //清空上一次的校验
      delete that.formData.validateMsg["productionChannelNameErrorMsg"];
      let result = true;
      if (!data.channelName) {
        that.$set(
          that.formData.validateMsg,
          "productionChannelNameErrorMsg",
          " 请输入渠道名称"
        );
        utils.showToast("请输入渠道名称");
        result = false;
      }
      return result;
    },
    /**
     * 提交表单
     */
    submit() {
      const that = this;
      //表单校验
      if (!that.validateForm(that.formData)) {
        return;
      }
      //提交的数据结构
      let channelInfo = {
        channelInfo: JSON.parse(JSON.stringify(that.formData))
      };
      delete channelInfo.channelInfo["validateMsg"];
      if (that.checkInputIsEmpty(channelInfo.channelInfo.zoneId)) {
        delete channelInfo.channelInfo["zoneId"];
      }
      if (!channelInfo.channelInfo.approveTravelUrl) {
        delete channelInfo.channelInfo["approveTravelUrl"];
      }
      if (!channelInfo.channelInfo.companyInvoiceTitleUrl) {
        delete channelInfo.channelInfo["companyInvoiceTitleUrl"];
      }      
      if (that.checkInputIsEmpty(channelInfo.channelInfo.id)) {
        delete channelInfo.channelInfo["id"];
      }      

      let requestBody;
      // //如果没有选择 支付方式
      if (!that.channelFormPayModel) {
        console.log('channelFormPayModel is null,some error')
        requestBody = channelInfo;
      } else {
        //支付方式组件 表单校验 失败
        if (!that.channelFormPayModel.vaildResult) {
          //提示报错信息
          utils.showToast(that.channelFormPayModel.errorMsg);
          return;
        } else {
          //支付方式组件 表单校验 成功
          requestBody = JSON.parse(
            (
              JSON.stringify(channelInfo) +
              JSON.stringify(that.channelFormPayModel.requestData)
            ).replace(/}{/, ",")
          );
        }
      }
      //如果没有选择 授权方式
      if (!that.channelFormSLAModel) {
        // requestBody = JSON.parse(JSON.stringify(that.formData));
        //将授权方式设置为空数组
        requestBody.channelProtocol = {};
      } else {
        //授权方式组件 表单校验 失败
        if (!that.channelFormSLAModel.vaildResult) {
          //提示报错信息
          utils.showToast(that.channelFormSLAModel.errorMsg);
          return;
        } else {
          //授权方式组件 表单校验 成功
          requestBody = JSON.parse(
            (
              JSON.stringify(requestBody) +
              JSON.stringify(that.channelFormSLAModel.requestData)
            ).replace(/}{/, ",")
          );
          //如果数据有为空的情况，那就去掉这个入参
          if(JSON.stringify(requestBody.channelProtocol)=='{}' || !requestBody.channelProtocol.protocolSummary
            || !requestBody.channelProtocol.protocolUrl || !requestBody.channelProtocol.protocolName){
            // delete requestBody['channelProtocol']
            requestBody.channelProtocol = {}
          }
        }
      }
      //如果没有选择 协议配置
      if (!that.channelFormPCLModel) {
        // requestBody = JSON.parse(JSON.stringify(that.formData));
        //将协议配置设置为空数组
        requestBody.protocolConfigList = [];
      } else {
        //授权方式组件 表单校验 失败
        if (!that.channelFormPCLModel.vaildResult) {
          //提示报错信息
          utils.showToast(that.channelFormPCLModel.errorMsg);
          return;
        } else {
          //授权方式组件 表单校验 成功
          requestBody = JSON.parse(
            (
              JSON.stringify(requestBody) +
              JSON.stringify(that.channelFormPCLModel.requestData)
            ).replace(/}{/, ",")
          );
          //如果数据有为空的情况，那就去掉这个入参
          if(JSON.stringify(requestBody.protocolConfigList)=='[]' || !requestBody.protocolConfigList[0].protocolName
            || !requestBody.protocolConfigList[0].protocolUrl){
              requestBody.protocolConfigList=[]
            // delete requestBody['protocolConfigList']
          }          
        }
      }

      requestBody.validateMsg = undefined;
      requestBody.operator = tmHandler.userInfo ? tmHandler.userInfo.userName||tmHandler.userInfo.userName:"";

      let defaultErrorMsg = "新增配置失败";
      if (that.channelId) {
        defaultErrorMsg = "更新配置失败";

        that.loading = true;
        tmHandler
          .updateProductionChannel(requestBody)
          .then(function(res) {
            that.loading = false;
            //新增时返回ProductionChannelNo，编辑时返回IsSuccess
            if (0 == res.resultCode) {
              that.$router.go(-1);
              utils.showToast("保存成功");
            } else {
              utils.showToast(res.resultMessage || defaultErrorMsg);
            }
          })
          .catch(e => {
            that.loading = false;
            utils.showToast(defaultErrorMsg);
            console.error("新增配置失败:" + e);
          });
      } else {
        that.loading = true;
        tmHandler
          .addProductionChannel(requestBody)
          .then(function(res) {
            that.loading = false;
            //新增时返回ProductionChannelNo，编辑时返回IsSuccess
            if (0 == res.resultCode) {
              that.$router.go(-1);
              utils.showToast("保存成功");
            } else {
              utils.showToast(res.resultMessage || defaultErrorMsg);
            }
          })
          .catch(e => {
            that.loading = false;
            utils.showToast(defaultErrorMsg);
            console.error("新增配置失败:" + e);
          });
      }
    },
    /**
     * 接受组件返回值
     */
    getOutputList(dataList) {
        this.channelFormPCLModel = dataList;
    },    
  }
};
</script>
<style scoped lang="less">
@import "edit.less";
</style>
<style lang="less">
.channel-edit-content .ivu-select-placeholder {
  font-size: 12px !important;
  color: #999 !important;
}
.el-input {
  height: 32px !important;
}
.el-input__icon {
  line-height: initial !important;
}
.channel-edit-content .el-input__inner {
  color: #333333;
  height: 32px;
  line-height: 32px;
  font-size: 12px;
  padding-left: 12px;
}
.channel-edit-content .el-input__inner::-webkit-input-placeholder {
  color: #999999;
}
.channel-edit-content .el-input__inner::-moz-placeholder {
  color: #999999;
}
.channel-edit-content .el-input__inner:-ms-input-placeholder {
  color: #999999;
}
</style>


