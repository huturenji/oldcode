

<template>
 <!---------------------------地址管理编辑和新增弹窗页面组件 -------------------------->
<div class="share-addEdit share-addEdit-address">
  <!-- 选择省市区的模块 -->
  <div class="chooseArea weui-cell hasStar cursorp">
    <div class='content' @click="chooseAreaShowFun(shareAddressContent.areaCode || '')">
        <div class="title">所在地区</div>
        <div class="option" :class="{placeholderStyle: !shareAddressContent.area}">
            <span class="address-text">{{shareAddressContent.area || '请选择省/市/区'}}</span>
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
        v-model="shareAddressContent.address"
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

  <!-- 保存按钮 -->
  <div v-transfer-dom>
    <div class='save cursorp normal-btn' @click='saveShareAddress'>保存</div>
  </div>
  

  <!-- 选择地址的三级选择的弹窗 -->
  <div v-transfer-dom>
    <popup v-model="chooseAreaShow" :popup-style="{zIndex: 3560}" height="60%" :is-transparent="true">
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
      <popup v-model="showMap" height="100%" width="100%" position="right" class="addressShareMap">
        <addressMap ref='addressMap' v-if='showMap' @onHitResult='getAddressFromMap'/>
      </popup>
  </div>

</div>
</template>
<script>
  import {SnListItem, SnSwitch} from 'sinosun-ui';
  import requestHandler from 'common/lib/requestHandler/addressHandler.js';
  import Icon from 'common/components/base/Icon';
  import addressComp from 'common/components/base/AddressComp'; //三级联动的组件
  import Bus from 'common/lib/bus/bus.js';
  import config from 'common/lib/config.js';
  import addressMap from 'common/components/addressMap'
  import {
    XTextarea,
    TransferDom,
    Popup
  } from 'vux';
  import extendUtils from 'common/lib/utils';
  export default {
    name:'swp-shareAddress-edit',
    directives: {
      TransferDom
    },
    props: {
      //新增的地址对象
      shareAddressItem:{
        type:Object,
        default(){
          return {
            area:'',
            areaCode:'',
            address:'',
          }
        }
      },
      useType:{//用来标识哪里是否是单独引用的该组件，用来解决回退的问题
        type: String
      }
    },
    components: {
      XTextarea,
      addressComp,
      Popup,
      Icon,
      SnSwitch,
      SnListItem,
      addressMap,
    },
    data () {
        let baseTitle = document.title
        let that = this;
        let managerData = extendUtils.stateManager.setData([
          {
            name:'chooseAreaShow', //控制地址选择三级联动的变量
            parent: this.useType && this.useType == 'single' ? '$refs.addressCompEdit.$refs.shareListComp.$refs.editShareAddressComp':'$refs.addressComp.$refs.editComp.$refs.shareListComp.$refs.editShareAddressComp', //todo 目前涉及到多级弹窗回退的问题，后续有时间优化处理
            hide:{
              callback: function () {
                that.showMask = false;//关闭mask遮罩层
              },
            }
          },
          {
            name:'showMap', //控制地图定位的变量
            parent: this.useType && this.useType == 'single' ? '$refs.addressCompEdit.$refs.shareListComp.$refs.editShareAddressComp':'$refs.addressComp.$refs.editComp.$refs.shareListComp.$refs.editShareAddressComp',
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
        ]);
        let data = {
          isPC: extendUtils.isPC(), //pc端还是移动端
          showMask: false,//是否显示三级联动的遮罩层
          unanalyseAddress: '',//待识别的地址
          showMapComp: config.SUPPLIER_Map[requestHandler.supplierId].showMap,
          showAddTips: false,
          shareAddressContent: {}, //编辑和新增的地址对象
        }
        data = Object.assign(managerData, data)
        return data;
    },
    computed:{
      rows(){
        let row = 2;//默认展示两行
        if(this.shareAddressContent.address.length >= 40 && !this.isPC){
          row = 4;
        }
        return row;
      }
    },
    created: function () {
        
    },
    mounted: function () {
      this.$nextTick(()=>{
        this.shareAddressContent = JSON.parse(JSON.stringify(this.shareAddressItem));
        this.$refs.addressCompChoose.initData();
      })
    },
    watch: {
    
    },
    methods: {
 

      /**
       * 保存地址的回调
       */
      saveShareAddress(){
        let that = this;
        if(!this.shareAddressContent.area || !this.shareAddressContent.address){
          extendUtils.showToast('请先填写完整相关信息');
          return 
        }
        extendUtils.throttle(function() {
          //保存地址后，清空省市选择组件中记住的省市id
          this.$refs.addressCompChoose.lastCode = '';
          that.$emit('saveShareAddress', that.shareAddressContent);
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
          this.shareAddressContent.area = addressNameList.join('/');
          this.shareAddressContent.areaCode = addressIdList.join('/');
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
            this.shareAddressContent.address = mapAddress.name;
            this.showMap = false;
            this.showAddTips = true;
        })
      },


      onAddressAnalyse(result){
        if(result){
            this.shareAddressContent.area = '';
            this.shareAddressContent.areaCode = '';

            if(!extendUtils.isStrictEmpty(result.province) && !extendUtils.isStrictEmpty(result.provinceCode)){
                this.shareAddressContent.area += `${result.province}/`;
                this.shareAddressContent.areaCode += `${result.provinceCode}/`
            }
            if(!extendUtils.isStrictEmpty(result.city) && !extendUtils.isStrictEmpty(result.cityCode)){
                this.shareAddressContent.area += `${result.city}/`;
                this.shareAddressContent.areaCode += `${result.cityCode}/`
            }
            if(!extendUtils.isStrictEmpty(result.county) && !extendUtils.isStrictEmpty(result.countyCode)){
                this.shareAddressContent.area += `${result.county}/`;
                this.shareAddressContent.areaCode += `${result.countyCode}/`
            }
            if(!extendUtils.isStrictEmpty(result.town) && !extendUtils.isStrictEmpty(result.townCode)){
                this.shareAddressContent.area += `${result.town}/`;
                this.shareAddressContent.areaCode += `${result.townCode}/`
            }

            if(this.shareAddressContent.area.lastIndexOf('/') == this.shareAddressContent.area.length-1){
                this.shareAddressContent.area = this.shareAddressContent.area.substring(0, this.shareAddressContent.area.length-1)
            }

            if(this.shareAddressContent.areaCode.lastIndexOf('/') == this.shareAddressContent.areaCode.length-1){
                this.shareAddressContent.areaCode = this.shareAddressContent.areaCode.substring(0, this.shareAddressContent.areaCode.length-1)
            }
            
            if(!extendUtils.isEmpty(result.name)){
                this.shareAddressContent.name = result.name;
            }
            if(!extendUtils.isEmpty(result.phone)){
                this.shareAddressContent.phone = result.phone;
            }
            this.shareAddressContent.address = result.exactAddress;
        }
      }
    }
  }

</script>
<style scoped lang="less">
@import '~themes/default/styles/common/variable.less';
@import '~mallStyles/mixins/mixinsStyle.less';
.share-addEdit.share-addEdit-address {
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



// 底部的保存按钮
.save {
  position: absolute;
  bottom: 0.6rem;
  left: 0.3rem;
  right: 0.3rem;
  height: .88rem;
  line-height: .88rem;
  text-align: center;
  color: #fff;
  font-size: .32rem;
  border-radius: 0.44rem;
  background-color: @theme-color;
  z-index: 2100;
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
    z-index: 3555;
}


@media screen and (min-width: @screen-sm) {
    .save{
      bottom: 0.3rem;
    }
}

.addressShareMap{
    z-index: 2500;
}





</style>
