<template>
  <div id="mailbox">
    <div id="mailboxbg"></div>
    <div id="mailContent">
      <div class="closeBtn" @click.stop="close"></div>
      <p class="boxhead">{{title}}</p>
      <div class="credentials">
        <span class="leftTitle">报销凭证：</span>
        <div>
            <div class="info1">{{mailInfoArrUI[0].index+"."+mailInfoArrUI[0].content}}</div>
            <div class="infoUI">
                <span
                class="normal"
                v-for="(item,position) in mailInfoArrUI"
                :key="item.index" v-show="item.index !=1"
                >{{(position+1)+"."+item.content}}</span>
            </div>
        </div>
      </div>
      <div class="credentials">
        <span class="leftTitle">快递公司：</span>
        <template v-if="!!expressCpyUI && expressCpyUI.length!=0">
          <div class="cpy-container">
            <div class="label " v-for="cpy in expressCpyUI" :key="cpy.expressCompanyNo" @click="selectSomeCpy(cpy)">
                <span class="check-icon cursorp" :class="isSelectCpy(cpy) ? 'check' : 'uncheck'" />
                <img class="cpyicon" :src="getLogoUrl(cpy)"/>   
            </div>  
          </div>
        </template>
      </div>
      <div class="addressBox">
        <div class="leftSide">
          <div class="leftbox">
            <div class="icon"></div>
            <span @click.stop="openCommonAddress" class="utag" v-if="showComonAdressUI">常用地址</span>
          </div>
        </div>
        <div class="rightSide">
          <addressInputView ref="addrSender" :addressType="1" :addressData="senderAddressData" :proviceCityCounty="proviceCityCounty" :showComp="showComp"></addressInputView>
        </div>
        <div v-transfer-dom id="popTips" v-show="popTips2">
          <div id="popTipsBg"></div>    
          <div id="popTipsrightSide2">
            <div class="closeBtnRightSide2" @click.stop="closePopTip2"></div>
            <div class="text">您可以在此处设置常用的寄件地址</div>
            <div class="btns">
              <span class="btn" @click.stop="closePopTip2">暂不设置</span>
              <span class="btn1" @click.stop="openSetAdress()">立即设置</span>
            </div>
          </div>
        </div>
      </div>
      <div class="addressBox">
        <div class="leftSide">
          <div class="icon2"></div>
        </div>
        <div class="rightSide">
          <addressInputView ref="addrReceiver" :addressType="2" :addressData="receiverAddressData" :inputable="false" :proviceCityCounty="proviceCityCounty" :showComp="showComp"></addressInputView>
        </div>
        <div v-transfer-dom id="popTips" v-show="popTips1">
          <div id="popTipsBg"></div>  
          <div id="popTipsrightSide">
            <div class="closeBtnRightSide" @click.stop="closePopTip1"></div>
            <div class="text">系统将根据订单信息自动填写收件地址</div>
            <div class="ok" @click.stop="closePopTip1">知道了</div>
          </div>
        </div>
      </div>
      <div class="boxbtn">
        <a class="clickbtn cancel" href="javascript:void(0);" @click.stop="close">取消</a>
        <a class="clickbtn confirm" href="javascript:void(0);" @click.stop="confirmMail">立即邮寄</a>
      </div>
      <div v-transfer-dom class="setAdress" v-show="showSetAdress">
        <setAddressCard
          @closeSetAddress="closesetAdress"
          @getInputAddr="setSenderAddress"
          :address="editAddress"
          :proviceCityCounty="proviceCityCounty"
          :showComp="showComp"
        ></setAddressCard>
      </div>
      <div v-transfer-dom class="commonAdress" v-show="showComonAdress">
        <comAddressCard
          @closeComonAdress="closeComonAdress"
          @setAddress="openSetAdress"
          @onItemClick="setSenderAddress"
          :addressList="senderAddressList"
        ></comAddressCard>
      </div>
    </div>
  </div>
</template>

<script>
const setAddressCard = () => import("biscomponents/mail/setaddress/setaddress.vue");
const comAddressCard = () => import("biscomponents/mail/confirmaddress/confirmaddress.vue");
const addressInputView = () => import("biscomponents/mail/addressinput/addressinput.vue");
import tmHandler from 'bislibs/requesthandler/traveloperationhandler.js';   
import utils from 'bislibs/utils';
import  * as travelfun from "bislibs/traveloperationfun.js";
export default {
    props: [
    "orderItem",
    "title",
    "itineraries",
    "expressCpy",
    "ifShowTips",
    "proviceCityCounty",
    "senderAddressList",
    "showComp",
    ],
    directives: {
     },  
    components: {
        setAddressCard,
        comAddressCard,
        addressInputView,
    },
  data() {
    return {
      formDataValue: {
        toMailInfo: [], //要邮寄的内容
        selectCpys: [], //选中的公司
        senderAddress: {
          //发送者的地址
          name: "",
          phone: "",
          area: "",
          address: ""
        },
        receiverAddress: {
          //收货人的地址
          name: "",
          phone: "",
          area: "",
          address: ""
        },
        validateMsg: {}
      },
      //邮寄内容列表
      mailInfoArr: [
        {
          index: 1,
          content: "行程单(" + this.itineraries + ")",
          dispaly: true
        },
        {
          index: 2,
          content: "保险发票",
          dispaly: this.orderItem.hasIsu
        },
        {
          index: 3,
          content: "退票手续费收据",
          dispaly: this.orderItem.hasRefundOrder
        }
      ],
      popTips1: this.ifShowTips, //首次进入提示弹框1
      popTips2: false, //首次进入提示弹框2
      showSetAdress: false, //是否展示设置地址页面
      showComonAdressUI: true, //是否展示常用地址UI提示
      showComonAdress: false, //是否展示常用地址页面
      editAddress: {}, //要编辑的地址
      senderAddressList: [], //寄件人地址列表
      senderAddressData: {},//寄件人地址数据结构
      receiverAddressData: {},//收件人地址数据结构
    };
  },
  watch:{
    /**
     * 监听prop动态更新，刷新当前页面数据
     */
    ifShowTips: function(val, oldVal) {
      let that = this;
      if (val != oldVal && !!val) {
        that.popTips1 = val;
      }
    },
    orderItem: function(val, oldVal) {
      let that = this;
      if (val != oldVal && !!val) {
        if(!!this.orderItem && !!this.orderItem.orderNo && this.orderItem.expressFlag == '1'){
          that.getmailAddress(this.orderItem.orderNo);
        }
         that.mailInfoArr[1].dispaly =  val.hasIsu;
         that.mailInfoArr[2].dispaly =  val.hasRefundOrder;
         that.mailInfoArrUI = that.setmailInfoArrUI();
      }
    },
    itineraries:function(val, oldVal) {
      let that = this;
      if (val != oldVal && !!val) {
         that.mailInfoArr[0].content =  "行程单(" + val + ")";
         that.mailInfoArrUI = that.setmailInfoArrUI();
      }
    },
    proviceCityCounty: function(val, oldVal) {
        let that = this;
        if (val != oldVal && !!val) {
        }
    },       
    senderAddressList:function(val, oldVal) {
      let that = this;
      if (val != oldVal && !!val) {
        if(!!this.senderAddressList && this.senderAddressList.length >0){
          this.setSenderAddress(this.senderAddressList[0]);
        }
      }
    },    
  },
  computed: {
    /**
     * 要显示的报销凭证信息
     */
    mailInfoArrUI: function() {
      return this.setmailInfoArrUI();
    },
    /**
     * 要显示的快递公司信息
     */
    expressCpyUI: function() {
      return JSON.parse(JSON.stringify(this.expressCpy));
    },
  },
  created() {

    // console.log("mailpop"+ !!this.orderItem.orderNo)
    //获取寄件收件人信息
    if (!!this.orderItem && !!this.orderItem.orderNo && this.orderItem.expressFlag == '1') {
      this.getmailAddress(this.orderItem.orderNo);
    }
    if(!!this.senderAddressList && this.senderAddressList.length >0){
       this.setSenderAddress(this.senderAddressList[0]);
    }
    //默认选中第一个快递公司
    if(!!this.expressCpyUI && this.expressCpyUI.length>0){
        this.selectSomeCpy(this.expressCpyUI[0]);
    }
  },
  mounted(){},
  methods: {
    getLogoUrl(info){
        return travelfun.getExpressLogo(info, 1);				
    },          
    /**
     * 动态设置要显示的保险信息
     */
    setmailInfoArrUI(){
      let result = [];
      for (let i = 0; i < this.mailInfoArr.length; i++) {
        if (this.mailInfoArr[i].dispaly) {
          result.push(JSON.parse(JSON.stringify(this.mailInfoArr[i])));
        }
      }
      //给提交表单赋值提交内容
      this.formDataValue.toMailInfo = result;
      return result;          
    },
    /**
     * 关闭当前的弹框
     */
    close() {
      this.$emit("closeBox");
      //清除输入的内容
    //   this.$refs.addrSender.clearCheckError();
    //   this.$refs.addrReceiver.clearCheckError();
    },
    /**
     * 立即邮寄
     */
    confirmMail() {
      if (this.checkFromData()) {
        this.$emit("submitMail", this.formDataValue);
      }
    },
    /**
     * 校验页面的输入的数据
     */
    checkFromData() {
      let result = true;
      let sendData = this.$refs.addrSender.getInputVaule();
      let receData = this.$refs.addrReceiver.getInputVaule();
      if (!sendData) {
        result = false;
      }else{
        this.formDataValue.senderAddress=sendData
      }
      if(!receData){
        result = false;
      }else{
          this.formDataValue.receiverAddress=receData
      }
        if(!(!!this.formDataValue.selectCpys && this.formDataValue.selectCpys.length>0)){
            result = false;
            utils.showToast("请选择快递公司")
        }
      return result;
    },
    /**
     * 选中某个公司
     */
    selectSomeCpy(expressCpy) {
      if (this.isSelectCpy(expressCpy)) {
        this.formDataValue.selectCpys.splice(this.formDataValue.selectCpys.indexOf(expressCpy), 1);
      } else if (this.formDataValue.selectCpys.length < 1) {
        this.formDataValue.selectCpys.push(expressCpy);
      } else {
        this.formDataValue.selectCpys.splice(0, this.formDataValue.selectCpys.length);
        this.formDataValue.selectCpys.push(expressCpy);
      }
    },
    /**
     * 是否选择了某公司
     */
    isSelectCpy(expressCpy) {
      let result = false;
      for (let i = 0; i < this.formDataValue.selectCpys.length; i++) {
        if (this.formDataValue.selectCpys[i].expressCompanyNo == expressCpy.expressCompanyNo) {
          result = true;
          break;
        }
      }
      return result;
    },
    /**
     * 跳转到常用地址
     */
    openCommonAddress() {
      this.showComonAdress = true;
    },
    /**
     * 关闭常用地址
     */
    closeComonAdress() {
      this.showComonAdress = false;
    },
    /**
     * 关闭首次进入的提示弹框，
     */
    closePopTip1() {
      this.popTips1 = false;
      utils.setStorage("mailBoxPopTips1", 0);
      this.popTips2 = this.showComonAdressUI ? true : false;
    },
    /**
     * 关闭首次进入的提示弹框，
     */
    closePopTip2() {
      this.popTips2 = false;
    },
    /**
     * 设置新地址地址
     */
    openSetAdress(item) {
      this.closeComonAdress();
      this.closePopTip2();
      if (!!item) {
        //编辑地址
        this.editAddress = item;
        this.editAddress.areaArray = travelfun.getAreaToArray(item.area);
      } else {
        this.editAddress = {};
      }
      this.showSetAdress = true;
    },
    /**
     * 设置新地址地址
     */
    closesetAdress() {
      this.showSetAdress = false;
      //每次寄件人地址有更新，新建或者更新，重新刷新常用联系人数据
      this.$emit("getSenderInfos");
    },
    /**
     * 设置寄件人地址
     */
    setSenderAddress(item) {
      this.closeComonAdress();
    //清空报错信息
    if(!!this.$refs.addrSender){
        this.$refs.addrSender.clearCheckError();      
    }
      //给prop动态赋值
      this.senderAddressData = item;
      this.senderAddressData.areaArray = travelfun.getAreaToArray(item.area);
    },
    /**
     * 设置收件人地址
     */
    setReceverAddress(item) {
      //给prop动态赋值
      this.receiverAddressData = item;
      this.receiverAddressData.areaArray = travelfun.getAreaToArray(item.area);
    },
    /**
     * 获取收件人地址列表
     */
    getmailAddress(orderNo) {
      let _this = this;
      let request = {
        orderNo: orderNo
      };
      tmHandler.getSenderAndReceiverInfo(request)
      .then(
        function(res) {
          if (res && 0 == res.resultCode && !!res.result.expressOrderDetail && !!res.result.expressOrderDetail.receiverInfo) {
            _this.setReceverAddress(res.result.expressOrderDetail.receiverInfo);
          } else {
            console.info(res);
            utils.showToast("获取失败");
          }
        },
        function(error) {
          console.info(error);
        }
      );
    },
  }
};
</script>
<style lang="less">
@import "~styles/common.less";
@import "~styles/variables.less";
@import "~styles/mixins/mixins.less";
#mailbox {
  background: transparent;
  z-index: 199;
}
#mailboxbg {
  position: fixed;
  left: 0px;
  top: 0px;
  bottom: 0px;
  background-color: #000;
  width: 100%;
  /*宽度设置为100%，这样才能使隐藏背景层覆盖原页面*/
  height: 100%;
  filter: alpha(opacity=60);
  /*设置透明度为60%*/
  opacity: 0.6;
  /*非IE浏览器下设置透明度为60%*/
  z-index: 200;
}

#mailContent {
  position: fixed;
  _position: absolute;
  margin: 0;
  width: 600px;
  height: fit-content;
  top: 15%;
  left: 35%;
  background-color: #fff;
  cursor: pointer;
  z-index: 201;
  text-align: center;
  .closeBtn {
    background: url(~assets//icon_close_simple.png) no-repeat right
      #fff;
    height: 20px;
    margin: 10px 10px 0 0;
    background-size: contain;
  }
  .boxhead {
    color: #191919;
    font-weight: bold;
    margin: 10px;
    font-size: 14px;
    text-align: center;
  }
  .credentials {
    font-size: 12px;
    display: flex;
    border-bottom: 1px dashed #e2e2e2;
    margin: 0px 40px;
    padding-bottom: 10px;
    align-items: center;

    .leftTitle {
      margin-right: 20px;
      flex: 0 0 60px;
    }
    .info1{
        text-align: left;
    }
    .infoUI{
        display: flex;
        >span{
            flex: 1;
        }
        .normal {
        margin-right: 10px;
        text-align: left;
        }
    }
    // >span:nth-child(2){
    //     flex: 2;
    // }
    >span:nth-child(3){
        flex: 1;
    }    
    >span:nth-child(4){
        flex: 1;
    }      
    .cpy-container {
      display: flex;
      justify-content: space-between;
      margin: 10px 0px;
      .label {
        margin-right: 20px;
        display: flex;
            align-items: center;
        .cpyicon{
    height: 28px;
    // width: 28px;
            // background: url(~assets///cpy_shf.png)
            // 0 center no-repeat transparent;            
        }
      }
    }
    .check-icon {
    // display: inline-block;
    height: 16px;
    width: 16px;
    // line-height: 28px;
    // margin: 8px 0;
    // text-indent: 26px;
    // text-align: left;
    cursor: pointer;
    margin-right: 5px;

      &.uncheck {
        background: url(~assets//tomail_icon_uncheck.png)
          0 center no-repeat transparent;
      }

      &.check {
        background: url(~assets//tomail_icon_check.png)
          0 center no-repeat transparent;
      }

      &:first-of-type {
        margin-left: 0px;
      }
    }
  }
  .addressBox {
    margin: 10px 40px;
    display: flex;
    border-bottom: 1px dashed #e2e2e2;
    padding-bottom: 10px;
    .leftSide {
flex: 0 0 70px;
    display: flex;
    justify-content: center;
      .icon{
          margin: 0px auto;
         width: 36px;
        height: 36px;      
        background:    url(~assets///icon_sender.png)
          0 center no-repeat transparent;
      }
      .icon2{
         width: 36px;
        height: 36px;      
        background:    url(~assets///icon_receiver.png)
          0 center no-repeat transparent;
      }      
    //   .icon {
    //     width: 30px;
    //     height: 30px;
    //     background-color: red;
    //     border-radius: 50%;
    //     /* margin-left: -30px; */
    //     -webkit-border-radius: 50%;
    //     display: inline-block;
    //     color: white;
    //     vertical-align: top;
    //     font-size: 20px;
    //     margin: 5px 0px;
    //     line-height: 30px;
    //     text-indent: 0;
    //     text-align: center;
    //   }
    //   .icon2 {
    //     background-color: rgb(37, 203, 103);
    //   }
      .utag {
          font-size: 12px;
        color: #478aee;
        border-bottom: 1px dashed #478aee;
      }
      .leftbox{
          width: 50px;
      }
    }
    .rightSide {
      width: 100%;
    }


  }
  .boxbtn {
    margin-bottom: 30px;
    display: flex;
    justify-content: space-evenly;
    .clickbtn {
      padding: 5px 25px;
      border: 1px solid #e2e2e2;
      border-radius: 2px;
      color: white;
    }
    .cancel {
      background: #7f7f7f;
    }
    .confirm {
      background: #478aee;
    }
  }
  .setAdress {
    position: fixed;
    top: 30%;
    width: 400px;
    left: 40%;
    border: 1px solid #7f7f7f;
    border-radius: 2px;
    padding: 0px 20px;
    background: white;
  }
  .commonAdress {
    position: fixed;
    top: 30%;
    width: 400px;
    left: 40%;
    border: 1px solid #7f7f7f;
    border-radius: 2px;
    padding: 0px 20px;
    background: white;
  }
}
</style>
<style lang="less">
    #popTips {
  background: transparent;
  z-index: 209;
    }
    #popTipsBg{
        position: fixed;
        left: 0px;
        top: 0px;
        bottom: 0px;
        background-color: #ffffff;
        width: 100%;
        /*宽度设置为100%，这样才能使隐藏背景层覆盖原页面*/
        height: 100%;
        filter: alpha(opacity=60);
        /*设置透明度为60%*/
        opacity: 0.6;
        /*非IE浏览器下设置透明度为60%*/
        z-index: 210;
    }
      #popTipsrightSide {
        // margin-left: 12px;
    position: fixed;
    _position: absolute;
    cursor: pointer;
    z-index: 211;
      top: 50%;
      left: 42%;
    //   display: -webkit-box;
    //   display: -webkit-flex;
    //   display: flex;
    background-color: white;
      background: url(~assets///tips_bg.png)
          0 center no-repeat white;
        .closeBtnRightSide {
          background: url(~assets//icon_close_simple.png) no-repeat
            right transparent;
          height: 20px;
          margin: 10px 10px 0 0;
          background-size: contain;
        }
        .text {
          padding: 10px 20px;
        }
        .ok {
          color: #478aee;
        //   border-bottom: 1px dashed #478aee;
          text-align: right;
          margin-right: 20px;
          margin-bottom: 20px;
        }        
      }   
      #popTipsrightSide2 {
        // margin-left: 12px;
    position: fixed;
    _position: absolute;
    cursor: pointer;
    z-index: 211;
      top: 33%;
      left: 42%;
        background-color: white;
      background: url(~assets///tips_bg.png)
          0 center no-repeat white;
        .closeBtnRightSide2 {
          background: url(~assets//icon_close_simple.png) no-repeat
            right transparent;
          height: 20px;
          margin: 10px 10px 0 0;
          background-size: contain;
        }
        .text {
          padding: 10px 20px;
        }

        .btns {
          display: flex;
          justify-content: flex-end;
                    margin-right: 20px;
          margin-bottom: 20px;
          .btn {
            color: #478aee;
            border-bottom: 1px dashed #478aee;
            margin-left: 10px;
          }
          .btn1{
            background: #478aee;
            color: white;
            padding: 0px 5px;      
            margin-left: 10px;   
          }
        }
      }           
</style>




