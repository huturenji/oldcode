<template>
  <div class="invoice-edit">
    <div class="line_item">
        <div class="left_title">发票类型</div>
        <div class="right_content">
          <SnRadioGroup v-model="editObj.type">
              <SnRadio :name="1" shape="check">个人或事业单位</SnRadio>
              <SnRadio :name="2" shape="check">企业</SnRadio>
          </SnRadioGroup>
        </div>
    </div>

    <!-- 发票抬头 -->
    <div class="line_item" :class="{'no_border': editObj.type==1}">
      <div class="left_title hasStar">发票抬头</div>
      <div class="right_content">
        <input type="text" maxlength="49" v-model="editObj.name"  placeholder="请输入抬头名称"/>
      </div>
    </div>

    <div v-if="editObj.type==2" class="company">
      <!-- 税号 -->
      <div class="line_item mg20 no_border">
        <div class="left_title hasStar">税号</div>
        <div class="right_content">
          <input type="text" maxlength="20" @input="trimFun($event, 'tax')" v-model="editObj.tax"  placeholder="请输入纳税人识别号"/>
        </div>
      </div>



      <!-- 公司地址 -->
      <div class="line_item">
        <div class="left_title">公司地址</div>
        <div class="right_content">
          <input type="text" maxlength="39" v-model="editObj.address"  placeholder="请输入公司地址"/>
        </div>
      </div>

      <!-- 电话号码 -->
      <div class="line_item">
        <div class="left_title">电话号码</div>
        <div class="right_content">
          <input type="text" @input="trimFun($event, 'phone')" maxlength="19" v-model="editObj.phone"  placeholder="请输入电话号码"/>
        </div>
      </div>

      <!-- 开户银行 -->
      <div class="line_item">
        <div class="left_title">开户银行</div>
        <div class="right_content">
          <input type="text" maxlength="30" v-model="editObj.bank"  placeholder="请输入开户银行"/>
        </div>
      </div>

      <!-- 银行账号 -->
      <div class="line_item no_border">
        <div class="left_title">银行账号</div>
        <div class="right_content">
          <input type="text" @input="trimFun($event, 'account')" maxlength="30" v-model="editObj.account"  placeholder="请输入银行账号"/>
        </div>
      </div>
    </div>

     <!-- 设为默认地址模块 -->
    <div class="setDefault">
      <SnListItem title="设为默认" :border="false">
        <SnSwitch slot="right-icon" v-model="editObj.defaultFlag" />
      </SnListItem>
    </div>
    

    <!-- 底部的保存发票抬头的按钮 -->
    <div class="addNewWrap fixed-dom-part">
        <div class="addNewWrapIn">
            <div class='addNew cursorp normal-btn' @click="saveFun">
              <span>确定</span>
            </div>
        </div>
	  </div>
  </div>
</template>
<script>
  import Icon from 'common/components/base/Icon';
  import invoiceHandler from 'common/lib/requestHandler/invoiceHandler.js';
  import extendUtils from 'common/lib/utils';
  import { SnRadio, SnRadioGroup, SnListItem, SnSwitch} from "sinosun-ui";

  export default {
    name:'invoice-edit',    
    props: {
       //新增或编辑的发票对象
      editObj:{
        type:Object,
        default(){
          return {
            type: 1,
            name: '',
            tax: '',
            phone: '',
            address: '',
            account:'',
            bank:'',
            defaultFlag: false
          }
        }
      },
    },
    computed:{},
    components: {
      Icon,
      SnRadio,
      SnRadioGroup,
      SnListItem,
      SnSwitch
    },
    data: function () {
        let that = this;
        let managerData = extendUtils.stateManager.setData([]);
        return Object.assign(managerData, {
            isPC: extendUtils.isPC(),
        })
    },
    created: function () {
      
    },
    mounted: function () {},
    watch: {},
    methods: {
      /** 
      * 保存发票抬头
      */
      saveFun(){
        let that = this;
        extendUtils.throttle(function () {
          that.save();
        }, that);
      },

      //去除字符串内所有的空格
      strTrim(str){
        if(!str){
          return ''
        }
        return str.replace(/\s*/g,"");
      },

      /** 
      * 校验相关的字段
      */
      checkAvailable(){
        let that = this;
        let regTax = /^[0-9A-Z]{6,20}$/;
        let phoneReg = /^[0-9-]{1,19}$/;
        let acountReg = /^[0-9 ]{1,30}$/;
        let flag = true;
        
        for(var i in that.editObj){
          if(!!that.editObj[i] && (typeof that.editObj[i] == 'string')){
            that.editObj[i] =  that.editObj[i].trim(); //去除首尾的空格
          }
        }

        if(!that.strTrim(that.editObj.name)){
          extendUtils.showToast('请输入发票抬头');
          return false;
        }
        if(this.editObj.type == 2){ //企业
          if(!that.strTrim(that.editObj.tax)){
            extendUtils.showToast('请输入纳税人识别号');
            return false;
          }
          
          if(!regTax.test(that.editObj.tax)){
            extendUtils.showToast('税号至少6位，必须是由数字或大写字母和数字组成');
            return false;
          }
          
          // if(!that.strTrim(that.editObj.address)){
          //   extendUtils.showToast('请输入公司地址');
          //   return false;
          // }
          // if(!that.strTrim(that.editObj.phone)){
          //   extendUtils.showToast('请输入电话号码');
          //   return false;
          // }

          //如果电话号码输入了 就必须校验格式
          if(!!that.strTrim(that.editObj.phone) && !phoneReg.test(that.editObj.phone)){
            extendUtils.showToast('电话号码格式错误');
            return false;
          }

          // if(!that.strTrim(that.editObj.bank)){
          //   extendUtils.showToast('请输入开户银行');
          //   return false;
          // }
          // if(!that.strTrim(that.editObj.account)){
          //   extendUtils.showToast('请输入银行账号');
          //   return false;
          // }

          //如果银行账号输入了 就必须校验格式
          if(!!that.strTrim(that.editObj.account) && !acountReg.test(that.editObj.account)){
            extendUtils.showToast('银行账号格式错误');
            return false;
          }
        }
        return flag;
      },

      /****
       * input oninput的时候自动去掉输入或者粘贴的空格
       */
      trimFun($event, type){
        let newVal = $event.target.value;
        this.$set(this.editObj, type, this.strTrim(newVal));
      },
  

      //保存发票抬头调服务端接口
      save(){
        if(this.checkAvailable()){
          let param = {
            userId: invoiceHandler.userId,
            companyId: invoiceHandler.companyId,
            channelId: invoiceHandler.channelId,
            type: this.editObj.type,
            name: this.editObj.name,
            defaultFlag: this.editObj.defaultFlag,
          }
          if(this.editObj.type == 2){ //企业
            param = Object.assign({}, param, {
              tax: this.editObj.tax,
              address: this.editObj.address,
              phone: this.editObj.phone,
              account: this.strTrim(this.editObj.account), //当银行账号保存的时候去除空格,
              bank: this.editObj.bank,
            })
          }
          let type = 'addInvoices';
          let requstObj = {
            requests: [param]
          }; //新增的时候是批量的，所以此处理成数组
          if(!!this.editObj.titleId){ //说明是编辑
            type = 'updateInvoice'
            param = Object.assign({}, param, {
              titleId: this.editObj.titleId
            })
            requstObj = param;
          }

          invoiceHandler[type](requstObj).then(res=>{
            if(res.resultCode == 0){
              extendUtils.showToast('保存成功');
              this.$emit('closeEditPop', 'init'); //关闭弹窗
            }else{
              extendUtils.showToast('保存失败');
            }
          }).catch(e=>{
            console.log(e)
          })
        }
      }
    }
  }

</script>
<style>

</style>
<style scoped lang="less">
.editInvoice.vux-popup-dialog{
  background-color: @background-color;
}
@import '~themes/default/styles/common/variable.less';
@import '~mallStyles/mixins/mixinsStyle.less';

.invoice-edit{
  background-color: @background-color;
  overflow: hidden;
  /deep/ .sn-radio-icon.sn-radio-icon-checked .sn-icon{
      color: @theme-color;
  }
  .setDefault{
    margin-top: 0.2rem;
    margin-bottom: 1.5rem;
    /deep/ .sn-list-item{
      font-size: 0.28rem;
      color: @secondary-text-color;
    }
  }
}

// 底部新增按钮
.addNewWrap{
  background-color: @background-color;
  .addNewWrapIn{
      padding: 0.3rem;
  }
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  z-index: 1000;
}

.addNew {
  border-radius: .44rem;
  background: @theme-color;
  color: #fff;
  height: .88rem;
  line-height: .88rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: .3rem;
}
.mg20{
  margin-bottom: .2rem;
}

.line_item{
  padding: 0 .32rem;
  background: #fff;
  display: flex;
  align-items: center;
  .bbpx();
  &:after{
    left: .32rem;
  }
  &.no_border::after{
    display: none;
  }
  
  line-height: 1rem;
  min-height: 1rem;
  display: flex;
  width: 100%;
  .left_title{
    width: 2rem;
    color: @secondary-text-color;
    font-size: .28rem;
    &.hasStar:after {
      content: '*';
      color: @theme-color;
      font-size: .32rem;
    }
  }
  .right_content{
    flex: 1;
    /deep/ .sn-radio{
      font-size: 0.28rem;
    }
    /deep/ .sn-icon{
      font-size: 0.32rem;
    }
  }
}

</style>

