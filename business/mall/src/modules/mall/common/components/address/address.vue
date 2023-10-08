<template>
  <div class="editDetail" :class="{isscroll:addressList.length==0}">
    <mescrollVue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
      <div :id="addressType" class="showReceiptList">
        <div class="receiptList" v-for='(item, index) in addressList' :key="index">
          <swipeout>
            <swipeout-item :disabled='isPC' :sensitivity="10" :ref='"swipeoutItem" + index' @on-open="handleSwipeoutOpen(index)" :class='{openedClass: index==openedIndex}' @on-close="openedIndex=-1">
              <!-- 移动端展示的操作按钮部分 -->
              <div slot="right-menu">
                <swipeout-button v-if="!item.defaultFlag" class="default_swipe" @click.native="editItem(item, 'defaultFlag')">
                  <p><Icon type='icon_moren' size=".4"/></p>
                  <span>设为默认</span>
                </swipeout-button>
                <swipeout-button class="delete_swipe" @click.native="deleteAddress(item, index)">
                  <p><Icon type='icon_mall_delete2' size=".4"/></p>
                  <span>删除</span>
                  </swipeout-button>
              </div>
                <div slot="content" class="detail" :class="{paddingleft: showCheck}" @click="chooseItem(item, index)">

                  <div v-if="showCheck" class="checker cursorp">
                    <Icon :type="!!checkChoose(item)?'icon_mall_checkbox_sel':'icon_mall_checkbox_nor'" size=".44"/>
                  </div>

                  <div class='list'>
                    <div class="item">
                      <div class="main" :class="{noPC: !isPC}">
                        <span class='title cursorp' :title="item.name">{{item.name}}</span>
                        <span class='content cursorp'>{{item.phone}} </span>
                        <symbolComp v-if='item.defaultFlag' symbol="默认" class='default'></symbolComp>
                        <symbolComp v-if='!!item.tags' :symbol="item.tags" class='symbol-item'></symbolComp>
                      </div>

                      <!-- pc端展示的操作按钮部分 -->
                      <div class="buttonGroup cursorp" v-if='isPC' @click='stopProp'>
                        <span @click='editItem(item, "address")'>编辑</span>
                        <span @click='deleteAddress(item, index)'>删除</span>
                        <span v-if='!item.defaultFlag' @click="editItem(item, 'defaultFlag')">设为默认</span>
                        <span v-else class="disable">默认地址</span>
                      </div>

                      <div class="edit" v-else>
                        <Icon @click.native.stop="editItem(item, 'address')" type="btn_common_edit" size=".3"/>
                      </div>
                    </div>

                    <div class="item address-box cursorp">
                      <div class="icon_address">
                        <Icon type="icon_clock" size=".28"/>
                      </div>
                      <span class="address">{{item.fullAddress2}}</span>
                    </div>

                  </div>
                </div>
              
            </swipeout-item>
          </swipeout>
        </div>
      </div>
    </mescrollVue>

    <!-- 底部的新增地址的按钮 -->
    <div class="addNewWrap fixed-dom-part noPadding">
        <div class="addNewWrapIn">
            <div class='addNew cursorp normal-btn' @click='showReceipt'>
              <span class="plus">+</span>
              <span>新增收货地址</span>
            </div>
        </div>
	  </div>


    <!-- 新增和编辑地址管理的弹窗页面 -->
    <div v-transfer-dom>
        <popup v-model="showAddAddress" height="100%" width="100%" position="right" class="popEditBox" >
            <editComp ref="editComp" :addAddressContent="addAddressContent" :showAddAddress="showAddAddress" @saveAddress="saveAddress" @deleteAddress="deleteAddress"></editComp>
        </popup>
    </div>
  
  </div>
</template>
<script>
  import Icon from 'common/components/base/Icon';
  import symbolComp from 'common/components/base/symbol';
  import editComp from "./baseComp/edit.vue";
  import mescrollMixin from 'common/lib/mixin/mescrollMixin'
  import requestHandler from 'common/lib/requestHandler/addressHandler.js';
  import cityIdHandler from 'common/lib/city/cityIdHandler'; //加载cityCodeHandler组件,当地址变更的时候更新cityCode
  import extendUtils from 'common/lib/utils';
  import Bus from 'common/lib/bus/bus.js';
  import { SnModal } from "sinosun-ui";
  import {
    TransferDom,
    Popup,
    Picker,
    Swipeout,
    SwipeoutItem,
    SwipeoutButton
  } from 'vux';

  export default {
    name:'swp-address',
    mixins: [mescrollMixin],
    directives: {
      TransferDom
    },
    
    props: {
      showCheck: {
        type: Boolean,
        default: false
      },
      value: {
        type: Object,
        default(){
          return {}
        }
      },

      addressType:{//用来标识哪里用的该组件 目前用来显示地址组件的空白页empty id唯一 和 Bus绑定事件名称的唯一性
        type: String,
        default: 'normal'
      },

      showComp:{ //该组件的显隐控制变量用来控制title回退的显示。目前只有在提交订单页面，没有设置地址的时候，直接显示设置地址的弹窗，此时直接略过该组件直接调用的编辑地址的组件，此时的shoComp是false,其余场景目前均未true
        type: Boolean,
        default: true
      }
    },
    computed:{
      BusName(){
        return 'BUS_INIT_ADDRESS_LIST' + this.addressType
      },
      BusNameCart(){
        return 'BUS_INIT_ADDRESS_LISTcart'
      },
      isIOS(){
        const u = navigator.userAgent;
        const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        return isiOS;
      }
    },
    components: {
      Swipeout,
      SwipeoutItem,
      SwipeoutButton,
      Popup,
      Picker,
      editComp,
      Icon,
      symbolComp,
    },
    data: function () {
        let that = this;
        let title = document.title;
        let managerData = extendUtils.stateManager.setData([
          {
            name: 'showAddAddress',
            parent: '$refs.addressComp',
            type:'page',
            show: {
                callback: function () {
                  if (that.titleType === 'add') {
                      document.title = '新增地址'
                      that.addAddressContent = {
                          name: '',
                          phone: '',
                          area: '',
                          address: '',
                          tags:'',
                          defaultFlag: false
                      }
                  } else {
                      document.title = '编辑地址'
                  }
                  that.$refs.editComp.showAddTips = false
                }
            },
            hide: {
              callback: function () {
                document.title = that.showComp ? '地址管理' : title;
              }
            }
          },
        ]);
        let data = {
            loading: true, //页面进入时加载效果
            isPC: extendUtils.isPC(),
            addAddressContent: {
                name: '',
                phone: '',
                area: '',
                address: '',
                tags:'',
                defaultFlag: false
            },
            addressList: [],
            titleType: 'add', //用来区别是新增还是编辑的
            openedIndex:-1,
            mescrollUp: {
              htmlNodata: '', //不显示‘没有更多了’
              empty: {
                warpId: this.addressType
              }
            }
        }
        data = Object.assign(managerData, data)
        return data;
    },
    created: function () {
      Bus.$on(this.BusName, () => {
        this.initAddressList();
      })
      this.resetView();
    },
    
    /** 
    * 将Bus事件绑定解绑
    */
    beforeDestroy () {
      Bus.$off(this.BusName);
    },
    mounted: function () {},
    watch: {
      showAddAddress: function (newVal) {
        let that = this;
        if (!newVal) {
          that.clearObj(that.addAddressContent);
        }
      },
      addressList:{//监听地址列表的变化，同时更新缓存
        async handler(){
          await extendUtils.authInterceptor();
          cityIdHandler.initCityId();
        },
        deep: true
      }
    },
    methods: {
      //ios顶起视图不自动复原的bug  下面代码手动复原视图
      resetView(){
        if(this.isIOS){
          let flag = false;
          let pageBackNormFunc;
          // 聚焦后，键盘弹起
          document.body.addEventListener('focusin', () => {
              flag = true;
              pageBackNormFunc && clearTimeout(pageBackNormFunc)
          });
          // 失焦后，键盘关闭
          document.body.addEventListener('focusout', () => {
              if (flag) {
                  // 页面滚动回原来的位置
                  pageBackNormFunc = setTimeout(() => {
                      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
                  }, 200);
              }
              flag = false;
          });
        }
      },

      /**
       * 初始化分页数据
       */
      initAddressList(){
        this.addressList = [];
        this.mescroll.resetUpScroll();
      },

      /**
       * 页面刷新入口函数 mescroll刷新回调
       * @param mescroll对象
       */
      re_fresh(mescroll){
          //mescroll在刷新时，会显示上拉分页的loading，这里隐藏掉
          try{
              let loadingDom = document.getElementsByClassName('mescroll-upwarp');
              if(loadingDom && loadingDom.length>0){
                  loadingDom = loadingDom[0];
                  loadingDom.style.visibility='hidden';
              }
          }catch(e){
              console.error(e);
          }
          mescroll.resetUpScroll();
      },

      /***
       * 处理s实现一个swiperout打开其他的会关闭
       * @param chooseIndex 被操作的swipe
       */
      handleSwipeoutOpen(chooseIndex) {
        const that = this;
        that.openedIndex = chooseIndex;
        if (chooseIndex > -1) {
          that.addressList.forEach((val, index) => {
            if (index != chooseIndex && that.$refs['swipeoutItem' + index][0].isOpen == true) {
              that.$refs['swipeoutItem' + index][0].close();
            }
          })
        }
      },

      /**
       * 默认是否选中该地址
       * @param item 单个的地址项
       */
      checkChoose(item){
        return item.id == this.value.id;
      },

      /***
       * 阻止冒泡导致滑动出发点击
       */
      stopProp(event) {
        const that = this;
        event.stopPropagation();
        event.preventDefault();
      },

      /***
       * 点击新增地址的按钮
       */
      showReceipt() {
        if(15 <= this.addressList.length){
          extendUtils.showToast('地址已达到上限');
          return false;
        }
        const that = this;
        this.titleType = 'add';
        that.showAddAddress = true;
      },

      /***
       * 更新新增或编辑的地址对象都为空或初始值
       */
      clearObj(obj) {
        for (let item in obj) {
          obj[item] = ''
        }
        this.addAddressContent.defaultFlag = false;
        return obj;
      },

      /***编辑地址 
      *@param  type address代表跳转编辑页面  default代表设为默认的功能
      */
      editItem(item, type) {
        const that = this;
        Bus.$emit('CLEAR_CODE');
        if (type == 'address') { //显示编辑弹窗
          this.titleType = 'edit';
          that.showAddAddress = true;
          //编辑页面是否为默认地址
          that.addAddressContent = JSON.parse(JSON.stringify(item));
        } else { //调编辑地址接口更新默认地址
          item.defaultFlag = true;
          that.saveAddress(item, false);
        }
      },

      /***
       * 删除地址的回调confirm
       */
      deleteAddress(item, index) {
        let that = this;
        SnModal({
            message: '确定要删除该地址吗？',
            showCancelButton: true,
        }).then(res => {
            that.deleteAddressFun(item);
        }).catch(rej => {
            console.log('rej === ', rej);
        });
      },

      /** 
       * 往外发射对应的绑定的事件
      */
      emitBus(){
        Bus.$emit(this.BusName);
        this.addressType == 'purchaseApply' && Bus.$emit(this.BusNameCart); //只有在申请采购的地方才会触发该事件
      },
      /***
       * 真正的删除地址confirm的回调
       */
      deleteAddressFun(item){
        let that = this;
        let param = {
          ids: [item.id]
        };
        that.$loading.show();
        requestHandler.deleteAddress(param).then((res) => {
          if (res.resultCode == 0) {
            this.keepSameAddress(item, true);
            that.$loading.hide();
            //关闭编辑弹窗
            that.showAddAddress = false;
            that.$emit('update', {type: 'delete', value: param})
            //同步弹窗地址选择组件 刷新数据 重新获取地址列表
            that.emitBus();
          }
        }).catch((err) => {
          console.log(err);
          extendUtils.showToast('删除失败');
          that.$loading.hide();
        });
      },

      /***
       * 获取地址列表 getListData 
       * @param page 分页对象，由mescroll提供
       * @param mescroll mescroll对象
       */
      async getListData(page, mescroll) {
        const that = this;
        try{
            let data = await this.getAddressList();
            that.addressList = data;
            that.addressChoose(that.addressList);
            //等待列表更新了再关闭编辑弹窗
            that.showAddAddress = false; 
            that.$nextTick(function () {
              that.$forceUpdate();
            })
            mescroll.endSuccess(that.addressList.length, false);
        }catch(e){
            console.error(e);
            mescroll.endErr();
        }
      },

         /**
         * 取地址优先级：
         * 1：上次选中的地址(临时缓存本次操作的 存的localStorage)
         * 2：默认地址
         * 3：地址列表第一条地址
         * 初始化处理地址选择逻辑 
         */
      addressChoose(addressList){
        let that = this;
        //从localStorage里面取上个页面选择的收货地址
        let addressSelected = !!extendUtils.getStorage(requestHandler.primaryKey + '_addressSelected') ? JSON.parse(extendUtils.getStorage(requestHandler.primaryKey + '_addressSelected')) : {}; 
        //判断缓存中的地址  是否存在于地址列表中
        let addressSelectedIndex = addressList.findIndex(item=>{
            return item.id == addressSelected.id;
        })
     
        if(Object.keys(addressSelected).length > 0 && !!addressSelected.id && addressSelectedIndex > -1){ //如果有从商品详情和购物车页面带过来商品列表存在的地址，则其为优先显示
          that.$emit('input', addressSelected);
        }else{
          let index = addressList.findIndex(item => {
            return !!item.defaultFlag;
          });
          if(index > -1){
            that.$emit('input', addressList[index]);//当default的值为true的时候， 默认代表该地址为默认地址
          }else{
            //如果前几个都没有，默认选择地址列表中的第一个
            if(addressList.length){
              that.$emit('input', addressList[0]);
            }else{
                //如果地址列表为空
              that.$emit('input', {});
            }
          }
        }
      },

      /**
       * 获取地址列表的数据 
       */
      getAddressList(){
        const that = this;
        let param = {
          userId: requestHandler.userId,
          companyId: requestHandler.companyId,
          channelId: requestHandler.channelId,
          supplierId: requestHandler.supplierId,
          project: 'MALL', //用来区分是商城的还是商旅的
        }
        return new Promise((resolve, reject) => {
            requestHandler.getAddressList(param).then(res=>{
              if(res.resultCode == 0 && !!res.result.list && res.result.list.length >= 0){
                  resolve(res.result.list);
              }else{
                  resolve([]);
              }
            }).catch(e=>{ 
                console.log(e);
                resolve([]);
            })
        })
      },

      /***
       * 选中地址
       */
      chooseItem(item, index) {
        extendUtils.setStorage(requestHandler.primaryKey + '_addressSelected', JSON.stringify(item));
        this.$emit('input', item);
        this.$emit('closeAddressList');
        
        //更新cityId的缓存 取cityId的城市code
        cityIdHandler.updateCityIdCache(item)
      },

      /***
       * 校验输入的字段必填项和格式是否正确 !!item.area.trim() &&
       */
      checkAddressMsg(item){
        if (!( !!item.phone.trim() && !!item.name.trim() && !!item.address.trim())) {
          extendUtils.showToast('请先填写完整相关信息');
          return false;
        }
         //含有中文并且不全是中文
        if(/.*[\u4e00-\u9fa5]+.*$/.test(item.name) && !(/^[\u4e00-\u9fa5]+$/.test(item.name))){
            extendUtils.showToast('中文姓名“'+item.name+'”中不能包含非中文字符');
            return false;
        }
        //英文姓名中不能包含特殊字符但可以包含/
        if(!(/.*[\u4e00-\u9fa5]+.*$/.test(item.name)) && !(/^[a-zA-Z/]+$/.test(item.name))){
            extendUtils.showToast('姓名“'+item.name+'”中不能包含数字、特殊字符');
            return false;
        }
        //验证手机号
        if (!extendUtils.isMobile(item.phone.trim())) {
          extendUtils.showToast('手机号码格式错误');
          return false;
        }
        return true
      },

      /***
       * 保存地址的回调  包括新增和编辑 根据AddressId的有无确定是新增还是编辑
       * @item 地址对象数据
       * @isShare 是否需要共享地址的标识
       */
      saveAddress(item, isShare) {
        const that = this;
        const content = JSON.parse(JSON.stringify(item));
        if (!!that.checkAddressMsg(content)) {
          let flag = !!content.id; //flag为true 代表编辑地址  flag为false 代表新增地址
          //todo参数
          let param = {
            "userId": requestHandler.userId,
            "companyId": requestHandler.companyId,
            "channelId": requestHandler.channelId,
            'supplierId': requestHandler.supplierId,
            'name': content.name.trim(),
            'phone': content.phone.trim(),
            'area': content.area.trim(),
            'address': content.address.trim(),
            'tags': content.tags.trim(),
            'defaultFlag': content.defaultFlag,  // true代表默认地址 false代表非默认的地址 只有一个默认地址
            'areaCode':content.areaCode,
            'project':'Mall',
            'share': isShare //是否分享到共享池 true-分享 false-不分享
          }

          if(flag){ //如果是编辑将id参数加入
            param = Object.assign({} ,param, {id: content.id});
          }

          that.$loading.show();          
          if (!flag) { //新增地址
            requestHandler.addAddress(param).then(async (res) => {
              if (res.resultCode == 0) {
                that.$loading.hide();
                extendUtils.showToast('新增成功');
                
                //提交订单页，检查到有选择省市区地址时触发以下逻辑   并添加id   fullAdddress2字段
                let addressItem = await this.getItemById(res.result.id)
                param = Object.assign({} ,param, {id: res.result.id+'',fullAddress2:param.area.split('/').join('')+param.address, areaCode: addressItem.areaCode});
                extendUtils.setStorage(requestHandler.primaryKey + '_addressSelected', JSON.stringify(param));
                that.$emit('saveSuccess', param);
                
                //同步弹窗地址选择组件 刷新数据
                that.emitBus();
                that.showAddAddress = false;
              } else {
                that.$loading.hide();
              }
            }).catch((err) => {
              console.log(err);
              that.$loading.hide();
            });

          } else { //编辑地址
            requestHandler.updateAddress(param).then((res) => {
              if (res.resultCode == 0) {
                that.$loading.hide(); 
                extendUtils.showToast('修改成功');
                that.keepSameAddress(param);
                //同步弹窗地址选择组件 刷新数据
                that.emitBus();
              } else {
                that.$loading.hide();
              }
            }).catch((err) => {
              console.log(err);
              that.$loading.hide();
            });
          }
        }
      },

      /****
       * 获取通过id获取当前地址的该项
       */
      async getItemById(id){
        let that = this;
        let dataList = await that.getAddressList();
        if(dataList && dataList.length > 0){
          let fiterArr = dataList.filter(item=>{
            return item.id == id
          })
          return fiterArr[0]
        }
      },

      //地址编辑或者删除时，同步缓存地址
      async keepSameAddress(address, isDelete = false){
        let addressSelected = !!extendUtils.getStorage(requestHandler.primaryKey+'_addressSelected') ? JSON.parse(extendUtils.getStorage(requestHandler.primaryKey+'_addressSelected')) : {}; //从sessionStorage里面取上个页面带过来的购买的商品选择的收货地址
        //判断编辑的地址是否是缓存中存的地址
        if(address.id == addressSelected.id){
          if(isDelete){
            extendUtils.removeStorage(requestHandler.primaryKey+'_addressSelected');
          }else{
            address.fullAddress2 = address.area.split('/').join('') + address.address;
            let addressItem = await this.getItemById(address.id)
            address = Object.assign({}, address, {areaCode: addressItem.areaCode})
            extendUtils.setStorage(requestHandler.primaryKey+'_addressSelected',JSON.stringify(address));
          }
        }
      }
    }
  }

</script>
<style scoped lang="less">
@import "./address.less";
</style>
<style lang='less'>
@import '~themes/default/styles/components/mescroll.less';
</style>
