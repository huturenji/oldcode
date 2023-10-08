

<template>
 <!---------------------------地址管理编辑和新增弹窗页面组件 -------------------------->
<div class="addEdit addEdit-address">

  <!-- 收件人姓名cell -->
  <x-input 
    v-model="addressContentCopy.name"
    :max="15" 
    :show-clear="false" 
    text-align="left" 
    label-width="2rem" 
    title="收件人"
    class="hasStar" 
    placeholder="请输入收件人姓名"
  >
    <!-- 右侧的从T信选人的插槽 -->
    <div slot="right" @click="addTchatUser" class="choose-Tchat-person">
      <div class="icon">
        <Icon type="btn_conmmon_phone" size=".4"/>    
      </div>
    </div>
  </x-input>

  <!-- 手机号cell -->
  <x-input 
    v-model="addressContentCopy.phone"
    :max="11" 
    :show-clear="false" 
    text-align="left" 
    label-width="2rem" 
    title="手机号" 
    class="hasStar" 
    type="tel"
    placeholder="请输入手机号码"
  ></x-input>

  <!-- 您可以一键导入公司共享地址 -->
  <div v-if="hasShareAddress" class="import-adddress">
    <span>您可以一键导入公司共享地址</span>
    <span @click="showShareList=true" class="btn">导入地址</span>
  </div>



  <!-- 选择省市区的模块 -->
  <div class="chooseArea weui-cell hasStar cursorp">
    <!-- 此处三级联动的 areaCode 只能用京东的jdAreaCode，因为服务端三级联动的id只认京东的-->
    <div class='content' @click="chooseAreaShowFun(addressContentCopy.jdAreaCode || addressContentCopy.areaCode)">
        <div class="title">所在地区</div>
        <div class="option" :class="{placeholderStyle: !addressContentCopy.area}">
            <span class="address-text">{{addressContentCopy.area || '请选择省/市/区'}}</span>
        </div>
    </div>
    <div class='icon-text' @click='openMap' v-if='showMapComp'>
        <Icon type="icon_clock" size='.44'/>
        <div class='text'>定位</div>
    </div>
  </div>

   <!-- 详细地址的cell -->
   <div class="address-deteal-box">
       <x-textarea 
        v-model="addressContentCopy.address"
        :max="80" 
        :show-counter="false" 
        :rows="rows"
        text-align="left" 
        title="详细地址"
        class="hasStar" 
        :autosize="true"
        placeholder="请输入详细地址"
      ></x-textarea>
      <div class='tips' v-if='showAddTips'>记得完善门牌号哦!<span class='close-icon normal-btn cursorp' @click='showAddTips=false'><Icon type='btn_common_close' size='.24'/></span></div>
   </div>


  <!-- TODO后续地址管理的标签模块需要抽成组件 -->
  <!-- 标签模块 -->
  <div>
    <tagsCom ref="tagsComp" :tagObj="tagObj" @tagTransfer="tagTransfer" />
  </div>

  <!-- 共享到公司共享地址 -->
  <div v-if="showShareAddressTips && hasShareAddress" class="share-address-tips">
    <div @click="addCompanyShareList=!addCompanyShareList" class="icon"><Icon :type="addCompanyShareList?'btn_common_checkbox_sel':'btn_common_checkbox_nor'" size=".4"/></div>
    <div class="content">
      <p class="title">共享到公司共享地址</p>
      <p class="tips">公司所有同事都可使用该地址</p>
    </div>
  </div>


  <div>

  </div>

  <!-- 设为默认地址模块 -->
  <group class="group">
      <SnListItem title="设为默认地址" :border="false">
        <SnSwitch slot="right-icon" v-model="addressContentCopy.defaultFlag" />
      </SnListItem>
  </group>

  <div class='addressAnalyse' v-if='showAnalyseAddress'>
      <div class='title'>智能填写</div>
    <addressAnalyse ref='addressAnalyse' @analyse='onAddressAnalyse'></addressAnalyse>
  </div>

  <!-- 删除的按钮 -->
  <!-- <div class="del cursorp" v-if='!!addressContentCopy.id && !isPC' @click='deleteAddress()'>删除</div> -->

  <!-- 保存按钮 -->
  <div v-transfer-dom>
    <div v-if="showAddAddress" class="save-wrap fixed-dom-part">
      <div class='save cursorp normal-btn' @click='saveAddress'>{{btnText}}</div>
    </div>
  </div>
  

  <!-- 选择地址的三级选择的弹窗 -->
  <div v-transfer-dom>
    <popup v-model="chooseAreaShow" :popup-style="{zIndex: 1560}" height="60%" :is-transparent="true">
        <addressComp
          ref="addressCompChoose"
          :showTitle="true"
          @selectAddress="selectAddress"
          @closePop="closePopFun"
        ></addressComp>
    </popup>
  </div>

  <!-- mask自定义遮罩层 -->
  <div v-transfer-dom>
      <div v-if="showMask" class="mask" @click="closePopFun"></div>
  </div>

    <!-- 地图选点 -->
    <div v-transfer-dom>
        <popup v-model="showMap" height="100%" width="100%" position="right" class="addressMap">
            <addressMap ref='addressMap' v-if='showMap' @onHitResult='getAddressFromMap'/>
        </popup>
    </div>

    <!-- 共享公司地址列表 -->
    <div v-transfer-dom>
        <popup v-model="showShareList" height="100%" width="100%" position="right" class="shareAddressListPop">
           <shareAddressList 
            v-if="showShareList"
            ref='shareListComp' 
            :useType="useType" 
            v-model="shareAddressObj"
            @closeShareList="showShareList=false"
          />
        </popup>
    </div>
</div>
</template>
<script>
  import {SnListItem,SnSwitch} from 'sinosun-ui';
  import requestHandler from 'common/lib/requestHandler/addressHandler.js';
  import Icon from 'common/components/base/Icon';
  import addressComp from 'common/components/base/AddressComp'; //三级联动的组件
  import tagsCom from './tags.vue'; //地址标签组件
  import Bus from 'common/lib/bus/bus.js';
  import config from 'common/lib/config.js';
  import addressAnalyse from 'common/components/addressAnalyse'
  import addressMap from 'common/components/addressMap'
  import shareAddressList from './shareAddressList'
  import {
    XSwitch,
    XInput,
    XTextarea,
    Group,
    TransferDom,
    Popup
  } from 'vux';
  import extendUtils from 'common/lib/utils';
  export default {
    name:'swp-address-edit',
    directives: {
      TransferDom
    },
    props: {
      //新增的地址对象
      addAddressContent:{
        type:Object,
        default(){
          return {
            name: '',
            phone: '',
            area: '',
            address: '',
            tags: '',
            defaultFlag: false
          }
        }
      },

      //显示新增和编辑的变量
      showAddAddress:{
        type:Boolean,
        default:false
      },

      btnText:{
        type:String,
        default:'保存'
      },

      useType:{//用来标识哪里是否是单独引用的该组件，用来解决回退的问题
        type: String
      }
    },
    components: {
      XSwitch,
      XInput,
      XTextarea,
      Group,
      addressComp,
      Popup,
      Icon,
      tagsCom,
      SnSwitch,
      SnListItem,
      addressAnalyse,
      addressMap,
      shareAddressList
    },
    data () {
        let baseTitle = document.title
        let that = this;
        let managerData = extendUtils.stateManager.setData([
          {
            name:'chooseAreaShow', //控制地址选择三级联动的变量
            type: 'page',
            parent: this.useType && this.useType == 'single' ? '$refs.addressCompEdit' : '$refs.addressComp.$refs.editComp',
            hide:{
              callback: function () {
                that.showMask = false;//关闭mask遮罩层
              },
            }
          },
          {
            name:'showMap', //控制地址选择三级联动的变量
            type: 'page',
            parent: this.useType && this.useType == 'single' ? '$refs.addressCompEdit' : '$refs.addressComp.$refs.editComp',
            show:{
                callback(){
                    baseTitle = document.title
                    document.title = '定位地址';
                }
            },
            hide: {
                callback(){
                    document.title = baseTitle;
                }
            }
          },
          {
            name:'showShareList', //控制显示共享地址列表弹窗的变量
            parent: this.useType && this.useType == 'single' ? '$refs.addressCompEdit' :  '$refs.addressComp.$refs.editComp',
            show:{
                callback(){
                    baseTitle = document.title
                    document.title = '公司共享地址';
                }
            },
            hide: {
                callback(){
                    document.title = baseTitle;
                }
            }
          }
        ]);
        let data = {
          isPC: extendUtils.isPC(), //pc端还是移动端
          addressContentCopy: JSON.parse(JSON.stringify(this.addAddressContent)), //深拷贝props传递进来的地址数据
          tagObj: {}, //标签的对象
          saveTagObj: {}, //保存标签的对象
          showMask: false,//是否显示三级联动的遮罩层
          domHeight: document.documentElement.clientHeight,  //默认屏幕高度
          showHeight: document.documentElement.clientHeight,   //实时屏幕高度
          unanalyseAddress: '',//待识别的地址
          showAnalyseAddress: config.SUPPLIER_Map[requestHandler.supplierId].analyseAddress,
          showMapComp: config.SUPPLIER_Map[requestHandler.supplierId].showMap,
          showAddTips: false,
          showShareAddressTips: false, //显示共享公司地址的tips
          addCompanyShareList: false,
          shareAddressObj:{}, //共享地址的三级联动和详细地址
        }
        data = Object.assign(managerData, data)
        return data;
    },
    computed:{
      hasShareAddress(){
        return this.BMallConfig.SUPPLIER_Map[requestHandler.supplierId].hasShareAddress;
      },
      rows(){
        let row = 2;//默认展示两行
        if(this.addressContentCopy.address.length >= 40 && !this.isPC){
          row = 4;
        }
        return row;
      }
    },
    created: function () {
      window.onresize = () => {
          return (() => {
              this.showHeight = document.documentElement.clientHeight;//这里需要注意一下可视区高度。
          })();
      };      
    },
    mounted: function () {
     
    },
    watch: {
      showAddAddress(val){
        this.$refs.addressAnalyse && this.$refs.addressAnalyse.clear();  
        //深拷贝props传递进来的地址数据
        this.addressContentCopy = JSON.parse(JSON.stringify(this.addAddressContent));
        //更新tagObj对象
        this.updateTagObj(this.addressContentCopy);

        //当新增和编辑弹窗出现的时候初始化三级联动的数据展示
        !!val && this.$refs.addressCompChoose.initData();
      },
      'addressContentCopy.name':function(val){
        if(!!val && val.includes(' ')){
           extendUtils.showToast('姓名只能输入英文或汉字，空格请用"/"替代');
           this.addressContentCopy.name = this.addressContentCopy.name.replace(/\s+/g,"");
        }
      },
      saveTagObj: {
        handler(val){
          this.addCompanyShareList = false;
          if(val && Object.keys(val).length > 0 && val.code && val.code == 'company'){
            this.showShareAddressTips = true;
          }else{
            this.showShareAddressTips = false;
          }
        },
        deep: true
      },
      shareAddressObj(val){
        this.$set(this.addressContentCopy, 'area', val.area);
        this.$set(this.addressContentCopy, 'areaCode', val.areaCode);
        this.$set(this.addressContentCopy, 'address', val.address);
      }
    },
    methods: {
      /**
       * 更新tagObj对象
       */
      updateTagObj(item){
        this.tagObj = this.saveTagObj = Object.assign({}, {
            name: item.tags || '',
        })
      },

      /**
       * token里面获取用户的姓名和手机号相关的信息
       */
      getUserInfoFromToken(){
        let obj = {
          name: '',
          phone:''
        }
        try {
          let userToken = requestHandler.getUserToken();//授权组件提供的token数据
          let parseToken = !!userToken ? window.authorization.decodeToken(userToken): {};
          console.log('userInfoInToken', parseToken)
        } catch (error) {
          return obj
        }
      },



      /**
       * 选择tag后更新tags对象
       */
      tagTransfer(value){
        this.saveTagObj =JSON.parse(JSON.stringify(value));
      },

      /**
       * 删除地址的回调
       */
      deleteAddress(){
        this.$emit('deleteAddress', this.addressContentCopy);
      },

      /**
       * 保存地址的回调
       */
      saveAddress(){
        let that = this;
        if(!this.addressContentCopy.area){
          extendUtils.showToast('请先填写完整相关信息');
          return 
        }
        extendUtils.throttle(function() {
          that.addressContentCopy.tags = that.saveTagObj.name || '';
          //保存地址后，清空省市选择组件中记住的省市id
          this.$refs.addressCompChoose.lastCode = '';
          
          //获取是否共享地址的标识
          let isShare = false; //默认是false
          if(this.showShareAddressTips && this.hasShareAddress && this.addCompanyShareList){isShare = true};
          that.$emit('saveAddress', that.addressContentCopy, isShare);
        }.bind(that));
      },



      /**
       * 显示三级联动的弹窗
       */
      chooseAreaShowFun(code){
        
        Bus.$emit('AUTO_SELECT_CITYS', code);
        this.chooseAreaShow = true;
        this.showMask = true;
      },
 
      /**
       * 关闭三级联动的弹窗
       */
      closePopFun(){
        this.chooseAreaShow = false;
        this.showMask = false;
      },

      /**
       * 接受三级联动返回的数据
       */
      selectAddress(addressIdList, addressNameList){
        if(addressNameList.length > 0 && addressIdList.length > 0){
          this.addressContentCopy.area = addressNameList.join('/');
          this.addressContentCopy.areaCode = addressIdList.join('/');
          this.closePopFun(); //关闭三级联动的弹窗
        }else{
          console.log('地址三级联动选择有误！')
        }
      },    
      openMap(){
          this.showMap = true;
      },
      getAddressFromMap(mapAddress){
        let fullAddress = mapAddress.district + mapAddress.address + mapAddress.name
        requestHandler.addressAnalyse({addressInfo: fullAddress, supplierId: requestHandler.supplierId}).then(res=>{
            this.onAddressAnalyse((res||{}).result)
            this.addressContentCopy.address = mapAddress.name;
            this.showMap = false;
            this.showAddTips = true;
        })
      },
       /**
       * 添加T信用户
       * @param {Object} sIdArr  已经选择用户Id集合
       * @param {Object} sModel  选择模式 0-单选 1-多选
       * @param {Object} sKey    from_key  默认为9
       */
      addTchatUser(){
        let that = this;
        let Ids = [];
        extendUtils.selectContact(Ids, 0).then((data) => {
          if (0 < data.length) {
            try {
              let selectUser = data[0];
              that.addressContentCopy.name = selectUser.uName;
              that.addressContentCopy.phone = selectUser.uPhone;
            } catch (e) {
              console.log('从通讯录中获取人员信息失败')
            }
          }
        });
      },

      onAddressAnalyse(result){
        if(result){//四大皆空发说句话发神经的叫法是基督教开发商
            this.addressContentCopy.area = '';
            this.addressContentCopy.areaCode = '';

            if(!extendUtils.isStrictEmpty(result.province) && !extendUtils.isStrictEmpty(result.provinceCode)){
                this.addressContentCopy.area += `${result.province}/`;
                this.addressContentCopy.areaCode += `${result.provinceCode}/`
            }
            if(!extendUtils.isStrictEmpty(result.city) && !extendUtils.isStrictEmpty(result.cityCode)){
                this.addressContentCopy.area += `${result.city}/`;
                this.addressContentCopy.areaCode += `${result.cityCode}/`
            }
            if(!extendUtils.isStrictEmpty(result.county) && !extendUtils.isStrictEmpty(result.countyCode)){
                this.addressContentCopy.area += `${result.county}/`;
                this.addressContentCopy.areaCode += `${result.countyCode}/`
            }
            if(!extendUtils.isStrictEmpty(result.town) && !extendUtils.isStrictEmpty(result.townCode)){
                this.addressContentCopy.area += `${result.town}/`;
                this.addressContentCopy.areaCode += `${result.townCode}/`
            }

            if(this.addressContentCopy.area.lastIndexOf('/') == this.addressContentCopy.area.length-1){
                this.addressContentCopy.area = this.addressContentCopy.area.substring(0, this.addressContentCopy.area.length-1)
            }

            if(this.addressContentCopy.areaCode.lastIndexOf('/') == this.addressContentCopy.areaCode.length-1){
                this.addressContentCopy.areaCode = this.addressContentCopy.areaCode.substring(0, this.addressContentCopy.areaCode.length-1)
            }
            
            if(!extendUtils.isEmpty(result.name)){
                this.addressContentCopy.name = result.name;
            }
            if(!extendUtils.isEmpty(result.phone)){
                this.addressContentCopy.phone = result.phone;
            }
            this.addressContentCopy.address = result.exactAddress;
        }
      }
    }
  }

</script>
<style scoped lang="less">
@import '~themes/default/styles/common/variable.less';
@import '~mallStyles/mixins/mixinsStyle.less';
.addEdit.addEdit-address {
  margin-top: 0.2rem;
  margin-bottom: 2rem;
  ::-webkit-input-placeholder { /* WebKit browsers */
    color: @placeholder-color;
  }
  :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
      color: @placeholder-color;
  }
  ::-moz-placeholder { /* Mozilla Firefox 19+ */
      color: @placeholder-color;
  }
  :-ms-input-placeholder { /* Internet Explorer 10+ */
      color: @placeholder-color;
  }
    /deep/ .weui-cell:before, .vux-x-switch.weui-cell:after {
      border: none !important;
      display: none;
    }

    /deep/ .weui-cell{
      background-color: #fff;
      min-height: 1.1rem;
      line-height: 1.1rem;
      font-size: 0.28rem;
      padding: 0 .3rem !important;
      overflow: hidden;
      position: relative;
      &::after{
        content: "";
        position: absolute;
        width: 100%;
        border-top: 1px solid @border-color-base;
        left: 0.3rem;
        bottom: 0;
        transform: scaleY(0.5);
        -webkit-transform: scaleY(0.5);
      }
      .weui-label{
        width: 2rem !important;
        color: @secondary-text-color;
      }
    }
    .del {
        padding: 0.3rem .3rem 0 0;
        text-align: right;
        color: @third-text-color;
    }
   
    .placeholderStyle {
        color: @placeholder-color !important;
    }

    .chooseArea {
        padding: 10px 0;
        position: relative;
        .content{
            display: flex;
            align-items: center;
            width: 100%;
        }
        .title {
            width: 2rem;
            display: inline-block;
            color: @secondary-text-color;
        }

        .option {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            overflow: hidden;
            .address-text{
              flex: 1;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              margin-right: .5rem;
            }
        }
    }
    .icon-text{
        fill: @third-text-color;
        color: @third-text-color;
        font-size: .16rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        position: absolute;
        right: .3rem;
        top: 50%;
        transform: translateY(-50%);
        .text{
            flex: none;
            margin-top: .06rem;
            line-height: initial;
        }
    }
    .chooseArea:before {
        content: " ";
        position: absolute;
        left: 0;
        right: 0;
        height: 1px;
        color: #d9d9d9;
    }

    // 设为默认模块的样式
    /deep/ .group {
      background: #fff;
      margin-top: 0.2rem;
      .vux-x-switch {
        padding: 0
      }
      .sn-switch-on{
        color: @theme-color;
        background-color: @theme-color;
      }
      .weui-switch:checked {
        border-color: @theme-color;
        background-color: @theme-color;
        &:after{
          transform: translateX(22px);
        }
      }
      .weui-switch {
        width: 43px;
        height: 22px;
        &:before{
          background-color: transparent;
        }
      }
      .weui-switch::after {
        width: 18px;
        height: 18px;
        top:1px;
        left: 1px;
        box-shadow: none;
      }
      .weui-cells {
        margin: 0;
        padding: 0;
        .weui-cell__ft{
          display: flex;
          align-items: center;
        }
      }
      .weui-cells:before {
        border: 0 !important;
      }
      .weui-cells:after {
        border: 0 !important;
      }
    }

    
    // 必填项*号的样式
    /deep/ .hasStar label:after {
      content: '*';
      color: @theme-color !important;
      font-size: .32rem;
    }

    /deep/ .hasStar .title:after {
      content: '*';
      color: @theme-color !important;
      font-size: .32rem;
    }


    .address-deteal-box{
        position: relative;
      /deep/ .weui-cell{
        .weui-textarea{
          padding-top: 0.34rem;
          padding-bottom: 0.3rem;
          line-height: 0.44rem;
        }
      }
      .tips{
        position: absolute;
        left: 1.52rem;
        top: .9rem;
        background: #404040;
        border-radius: .12rem;
        padding: .26rem .24rem;
        padding-right: .1rem;
        white-space: nowrap;
        color: #fff;
        &:before{
            content: ' ';
            position: absolute;
            top: -.1rem;
            left: calc(50% + .2rem);
            display: block;
            width: .2rem;
            height: .2rem;
            border-radius: .04rem 0 0 0;
            background: #404040;
            transform: translateX(-.3rem) rotate(45deg) skew(10deg,10deg);
        }

        .close-icon{
            .blpx(2px, rgba(255,255,255,.2));
            height: .2rem;
            padding: 0 .14rem;
            margin-left: .16rem;

            .icon{
                fill: #fff;
            }
        }
      }
    }

    .addressAnalyse{
      background: #fff;
      margin-top: .2rem;
      padding: .3rem .3rem .38rem;

      .title{
          font-size: .3rem;
          color: @secondary-text-color;
          margin: 0 0 .2rem;
      }
    }
}


/* 标签模块的样式 */
.address-tags{
  background: #fff;
  padding: 0.3rem;
  display: flex;
  .tags-title{
    width: 2rem;
    font-size: 0.28rem;
    color: @secondary-text-color;
  }
  .tags-details{
    flex: 1; 
    .custom-tag-wrapper{
      &.active{
        .custom-input{
          background: @address-color;
          color: #fff;
        }
        .btn{
          background:linear-gradient(140deg,rgba(95,116,255,1) 0%,rgba(41,66,232,1) 100%);
        }
      }
      height: 0.48rem;
      line-height: 0.48rem;
      font-size: 0.26rem;
      display: flex;
      .custom-input{
        padding-left: 0.24rem;
        height: 100%;
        width: 1.7rem;
        background: #F6F9FD;
        border-radius: 0.24rem 0 0 0.24rem;
        padding-left: 0.24rem;
        transition: all 0.3s;
      }
      .btn{
        margin-left: 1px;
        width: 0.8rem;
        height: 100%;
        border-radius:0 0.24rem 0.24rem 0;
        background:linear-gradient(140deg,rgba(153,153,153,1) 0%,rgba(102,102,102,1) 100%);
        text-align: center;
        color: #fff;
      }
    }
    ul{
      .clear();
    }
    .li-item{
      width: 1.2rem;
      height: 0.48rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: .24rem;
      border: 1px solid @border-color-base;
      font-size: 0.26rem;
      color: @secondary-text-color;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      float: left;
      margin-right: 0.2rem;
      margin-bottom: 0.24rem;
      &.add{
        margin-bottom: 0rem;
        float: none;
      }
      &.active{
        color: #fff;
        background: @address-color;
        border-color: @address-color;
      }    
    }
  }
  .edit-tag-box{
    position: relative;
    width: 4.46rem;
    height: 0.48rem;
    line-height: 0.48rem;
    display: flex;
    font-size: 0.26rem;
    .input-tag{
      flex: 1;
      height: 100%;
      background: #F6F9FD;
      border-radius: 0.24rem 0 0 0.24rem;
      padding-left: 0.24rem;
    }
    .confirm-tag-btn{
      width: 0.8rem;
      height: 100%;
      border-radius:0 0.24rem 0.24rem 0;
      background-color: #DDE3E9;
      text-align: center;
      color: #fff;
    }
  }
}

// 底部的保存按钮
.save-wrap{
  padding: .3rem;
  position: absolute;
  width: 100%;
  bottom: 0rem;
  z-index: 1551;
  .save {
    width: 100%;
    height: .88rem;
    line-height: .88rem;
    text-align: center;
    color: #fff;
    font-size: .32rem;
    border-radius: 0.44rem;
    background-color: @theme-color;
  }
}


//从T信选人的样式
.choose-Tchat-person{
  cursor: pointer;
  height: 0.88rem;
  // width: 1.2rem;
  display: flex;
  flex-direction:column; 
  justify-content: center;
  text-align: center;
  align-items: center;
  // padding-top: 0.2rem;
  /deep/.icon-container{
    font-size: inherit;
  }
  .icon{
    width: 0.36rem;
    height: 0.36rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .lable{
    font-size: 0.16rem;
    line-height: 0.22rem;
    color: @third-text-color;
  }
}
@keyframes fade {
   from {opacity:0;}
   to {opacity:1;}
}
.mask{
    animation:fade 0.5s ease-in-out 0s 1 alternate forwards;;
    background: rgba(0, 0, 0, 0.5);
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    bottom:0;
    right:0;
    left:0;
    z-index: 1555;
}




.addressMap{
    z-index: 1650;
}
.shareAddressListPop{
  background: @background-color;
  z-index: 1600;
}

.import-adddress{
  padding: .22rem .3rem;
  font-size: .28rem;
  color: @third-text-color;
  display: flex;
  align-items: center;
  .btn{
    display: inline-block;
    padding: .12rem .24rem;
    .bpx(1px, .32rem, @theme-color);
    cursor: pointer;
    color: @theme-color;
    margin-left: .11rem;
    font-size: .28rem;
    &:active{
      opacity: .8;
    }
  }
}

.share-address-tips{
  padding: .16rem .3rem;
  display: flex;
  align-items: center;
  background: #f5f5f5;
  .icon{
    cursor: pointer;
    .btn_common_checkbox_sel{
      fill: @theme-color;
    }
  }
  .content{
    margin-left: .16rem;
    .title{
      font-size: .28rem;
      color: @text-color;
      line-height: .4rem;
    }
    .tips{
      font-size: .24rem;
      color: @third-text-color;
      line-height: .34rem;
    }
  }
}
</style>
