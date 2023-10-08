<template>
<div class="shop-car-container" :class="{needBottom: !!fromIndex, noTop: cartList.length<=0}">
    <mescrollVue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
      <div id='cartWrapperList' class="shop-car-box" :class="{noFooter: !fromIndex && cartList.length>0}">
        <swipeout>
          <swipeout-item v-for="(item, index) in cartList" :key="index">
            <div slot="content" class="item-wrap">
              <div class="item">
                <!-- 不可选中操作的部分 当商品缺货或下架并且非编辑情况下才不可操作 -->
                <div @click="clickDisableChoose(item)" v-if="disableChoose(item) && !editCart" class="left-choose-icon">
                  <Icon type="btn_common_radio_dis1" size=".4"/>
                </div>

                <!-- 可选中操作的部分 -->
                <div v-else @click="choosedItem(item,index)" class="left-choose-icon">
                  <Icon :type="item.checked?'icon_mall_checkbox_sel':'icon_mall_checkbox_nor'" size=".4"/>
                </div>

                <div @click="gotoDetail(item)" class="right-goods">
                  <thumb06
                    :img='item.imageUrl || item.imagePath'
                    :title='item.name'
                    :price='realPrice(item)'
                    :status='judgeProductStatus(item)'
                    :noPriceTips="''"
                  >
                    <!-- 商品规格插槽 -->
                    <template slot="sub-text">
                        <!-- dealSpecification在全局混入里面globalMixin.js -->
                        <div class="goods-format">{{dealSpecification(item.specification)}}</div>
                    </template>

                    <!-- 商品数量加减的插槽 -->
                    <template slot="action">
                        <counter @click.native.stop="stopProp" :value="!!item.remainNum && item.remainNum < item.quantity && item.remainNum > 0  ? item.remainNum : item.quantity" :max="!!item.remainNum && item.remainNum>0?item.remainNum:BMallConfig.GOODS.MAX_COUNT" @input="setCartNum(item, $event)" :showLable="false"></counter>
                    </template>

                    <!-- 尽在进行中的活动价 -->
                    <template v-if="item.isGoingOn" slot="activityLabel">
                        <div class="price_lable cartPage">活动价</div>
                    </template>

                    <!-- 距活动开始还剩倒计时  -->
                    <template v-if="item.isPreheat" slot="cutDown">
                        <div class="cut_wrap cartPage">
                            <div class="cut_content">
                                <div class="text">距活动开始还剩</div>
                                <cutDown :deadline="item.marketingStartTime"  @cutDownEnded="initList"/> 
                            </div>
                        </div>
                    </template>
                  </thumb06>
                </div>
              </div>


              <!-- 相关商品对应的赠品何附件相关的产品信息 -->
              <template v-if="showDiscount(item)">
                <div class="gift_part" v-if="showGiftList(item)">
                  <div class="left"><symbolGift name="赠品"/></div> 
                  <div class="right">
                    <div class="list_item" v-show="i<viewMoreNumGift" v-for="(giftItem, i) in item.giftList" :key="i">
                      <span class="name">{{giftItem.name}}</span>
                      <span class="num">x{{giftItem.num}}</span>
                      <!-- <span class="icon_right"><Icon type='icon_common_rightarrow' size='.2'></Icon></span> -->
                    </div> 
                    <div @click="viewMoreFun('gift', item)" v-show="item.giftList.length>viewMoreNumGift" class="view_more">
                      <span>展开查看更多赠品</span>
                      <Icon type='icon_common_downarrow' size='.2'></Icon>
                    </div>
                  </div> 
                </div>

                <div class="gift_part attachment_part" v-if="showAttachmentList(item)">
                  <div class="left"><symbolGift name="附件"/></div> 
                  <div class="right">
                    <div class="list_item" v-show="j<viewMoreNumAttachment" v-for="(attachmentItem, j) in item.attachmentList" :key="j">
                      <span class="name">{{attachmentItem.name}}</span>
                      <span class="num">x{{attachmentItem.num}}</span>
                      <!-- <span class="icon_right"><Icon type='icon_common_rightarrow' size='.2'></Icon></span> -->
                    </div>  
                    <div @click="viewMoreFun('attachment', item)" v-show="item.attachmentList.length>viewMoreNumAttachment" class="view_more">
                      <span>展开查看更多附件</span>
                      <Icon type='icon_common_downarrow' size='.2'></Icon>
                    </div>
                  </div> 
                </div>
              </template>
            </div> 

            <!-- 左滑出来的操作按钮 -->
            <div slot="right-menu" class='right-menu'>
              <swipeout-button @click.native="addCollectionFun(item)" class="addFavorite">
                <p><Icon type='icon_mall_collect2' size=".4"/></p>
                <span>移入收藏</span>
              </swipeout-button>
              <swipeout-button @click.native="deleteGoodsCar(item)" class='delete' :style="{borderRadius:'0 0.16rem 0.16rem 0'}">
                <p><Icon type='icon_mall_delete2' size=".4"/></p>
                <span>删除</span>
              </swipeout-button>
            </div>
          </swipeout-item>
        </swipeout>
      </div>
    </mescrollVue>
  <!-- 购物车底部的全选模块 -->
  <div v-transfer-dom>
    <div v-if="cartList.length > 0" class="totle-option-car fixed-dom-part" :class="{noFooter: !fromIndex}">

      <!-- 全选部分 -->
      <div @click="chooseAllFun()" class="choose-all">
         <Icon :type="chooseAll?'icon_mall_checkbox_sel':'icon_mall_checkbox_nor'" size=".44"/>
         <span class="text">全选</span>
      </div>

      <!-- 合计和去结算部分 -->
      <div v-if="!editCart" class="totle-and-topay">
        <div class="middle-part">
          <div>
            
            <p class="totle-price-title">
              <span class="text">总计</span><span class="price"><priceLabel class="price-lable" :amount='totlePrice/100 || 0'/></span>
            </p>
            <p v-if="totlePromotionalPrice > 0" class="promotionalPrice">
              <span class="text">优惠</span><span class="price"><priceLabel class="price-lable" :amount='totlePromotionalPrice/100 || 0'/></span>
            </p>
          </div> 
        </div>
        <div class="btn-box">
          <!-- 屏蔽掉申请采购的按钮 -->
          <div v-if="false" class="btn gotoBuy red-btn">
            <span @click="gotoPurchaseApply">申请采购</span>
          </div>
          <div @click="gotoOrderConfirm" class="btn gotopay linear-gra-mall-btn normal-btn">
            <span>去结算</span><span class="types">({{totleTypes || 0}})</span>
          </div>
        </div>
      </div>
      <!-- 移入收藏和删除部分 -->
      <div v-else class="addCollection-and-delete">
        <div @click="addCollectionTogether" class="red-btn">移入收藏</div>
        <div @click="deleteTogether" class="delete-btn red-btn">删除</div>
      </div>
    </div>
  </div>

    <!-- title栏 -->
    <addressTitle ref='titleBarContainer'></addressTitle>

  <!-- 购物车底部的头 -->
  <div v-transfer-dom>
    <cartHeader v-if="cartList.length>0" @dealCart="dealCart" :allTypesNum="cartList.length" :addressDefault="choosedAddress.address ? ('配送至: '+ choosedAddress.address) : choosedAddress.address " @changeAddress="changeAddress" @shareCart="shareCart"></cartHeader>
  </div>

  <!-- 购物车选择地址弹窗 -->
  <div v-transfer-dom class="purchaseApplyBox">
    <popup v-model="showAddressChooseModel" height='60%' :popup-style={zIndex:1000}>
        <AddressChooseComp
            v-model="choosedAddress"
            ref='AddressChooseComp'
            @selectAddress = 'selectAddress'
            @closePopup = 'closeAddressChooseModel'
            @addAddress = 'gotoAddress'
        ></AddressChooseComp>
    </popup>
  </div>

  <!-- 选择地址信息弹窗部分 -->
  <div v-transfer-dom class="addressPopupBox">
      <popup v-model="showAddressChoosePopup" class="editAddress" height='60%' width="100%"  :popup-style={zIndex:1001}>
          <addressComp ref="addressComp" v-model="choosedAddress" :showCheck="true" addressType="cart" @closeAddressList="closeAddressList" @saveSuccess='saveSuccess'></addressComp>
      </popup>
  </div>

   <!-- 新增地址弹窗部分 -->
  <div v-transfer-dom>
      <popup v-model="showAddressEditPopup" class="editAddress" height='100%' width="100%" position="right" :popup-style={zIndex:1010}>
          <addressCompEdit v-if="showAddressEditPopup" ref="addressCompEdit" useType='single' :showAddAddress='showAddAddress' :btnText='btnText' @saveAddress='saveAddress'></addressCompEdit>
      </popup>
  </div>


  <!-- 申请采购界面 -->
  <div v-transfer-dom class="purchaseApplyBox">
    <popup v-model="showPurchaseApply" height='auto' :popup-style={zIndex:1000}>
        <purchaseApply
            v-if='showPurchaseApply'
            ref="purchaseApplyComp"
            @closePopup = 'showPurchaseApply = false'
            @refreshCartList = 'initList'
			      :purchaseApplyGoods = 'purchaseApplyGoods'
            @keepAddress = 'keepAddress'
        ></purchaseApply>
    </popup>
  </div>

  <!--分享-->
  <div v-transfer-dom>
      <popup v-model="showSharePopup" position="bottom" height="auto" width="100%" class="radiusTop">
          <share @close="showSharePopup=false" :shareOptions="shareOptions"></share>
      </popup>
  </div>  
</div>
</template>

<script>
  import addressComp from 'commonComp/address/address.vue';
  import AddressChooseComp from 'commonComp/base/AddressChooseComp.vue';
  import addressCompEdit from 'commonComp/address/baseComp/edit.vue';
  import thumb06 from 'commonComp/goodsThumb/thumb06.vue';
  const cartHeader = ()=>import('./components/cartHeader');
  import purchaseApply from './components/purchaseApply.vue';
  const counter = ()=>import('commonComp/base/counter.vue');
  const Icon = ()=>import('common/components/base/Icon.vue');
  const priceLabel = ()=>import('common/components/base/priceLabel.vue');
  import symbolGift from 'common/components/base/symbolGift.vue';
  import cutDown from 'common/components/base/cutDown.vue';
  import { Popup, Swipeout, SwipeoutItem, SwipeoutButton } from 'vux';
  import {ProductActivityStatus} from 'common/lib/enum/productStatusEnum';
  import { SnModal } from 'sinosun-ui';
  import extendUtils from 'common/lib/utils';
  import mescrollMixin from 'common/lib/mixin/mescrollMixin';
  import tChatEventMixin from 'common/lib/mixin/tChatEventMixin';
  import cartHandler from 'common/lib/requestHandler/cartHandler.js';
  import shareHandler from 'common/lib/requestHandler/shareHandler.js';
  import goodsHandler from 'common/lib/requestHandler/goodsHandler.js';
  import activityHandler from 'common/lib/requestHandler/activityHandler.js';
  import orderHandler from 'common/lib/requestHandler/orderHandler.js';
  import {ProductStockStatus, ProductStatus} from 'common/lib/enum/productStatusEnum';
  const share = ()=>import('common/components/share')
  export default {
    mixins: [mescrollMixin, tChatEventMixin],
    data() {
        let that = this;
        return Object.assign(extendUtils.stateManager.setData([
                {
                    name: 'showAddressChoosePopup', //选择地址的弹窗控制变量
                    show:{
                        callback(){
                            document.title = '地址管理'
                        }
                    },
                    hide:{
                        callback(){
                            that.setTitleBar()
                        }
                    }
                },
                {
                    name:'showAddressEditPopup',
                    show:{
                        callback(){
                            document.title = '新增地址'
                        }
                    },
                    hide:{
                        callback(){
                            that.setTitleBar()
                        }
                    }
                },
                {
                  name:'showPurchaseApply'  //显示申请采购界面
                },
                {
                  name:'showAddressChooseModel'
                },
                {
                  name:'showSharePopup'//分享购物清单
                }
        ], that), {
            mescrollUp:{
                htmlNodata:'', //暂时不显示没有更多了的提示
                empty: {
                  warpId: 'cartWrapperList',
                  icon: require('themes/default/img/defaultPage/icon_mall_gouwuchekong@3x.png'),
                  tip: '购物车是空的，赶紧去选购吧'
                },
                toTop:{
                  html:''
                }
            },
            cartList: [], //购物车商品列表
            totlePrice: 0, //选择的所有的金额
            totlePromotionalPrice: 0, //选择的所有的优惠金额
            totleTypes: 0, //已选择的所有商品的种类
            totleNumber: 0, //已选择的所有商品的件数
            chooseAll: false, //默认为不全部选中
            fromIndex: !!this.$route.query.fromIndex ? true : false, //是否为首页进入的购物车页面，该变量用来控制是否显示底部的footer导航部分
            editCart: false, //是否编辑购物车
            purchaseApplyGoods:[],//申请采购的商品列表
            choosedAddress: {},//显示的choosedAddress对象
            provinceCode: '', //省份编码
            cityCode: '', //城市编码
            districtCode: '', //县区编码
            townCode: '', //乡镇编码
            stockList: [], //商品的有货无货列表数据
            skuGiftAndAttachmentInfoList: [], //商品的赠品和附件列表数据
            skuAreaRestrictList: [], //商品的区域限售列表数据
            productStatusMap: ProductStatus,//商品上下架状态
            availableCartNum: '', //获取可用的购物车列表的数量
            showAddAddress:true,
            btnText:'保存并使用',
            goodsDetailList:[],//批量获取订单详情的列表数据
            viewMoreNumGift: 3, //赠品查看更多功能显示的数量限制
            viewMoreNumAttachment: 3, //附件查看更多功能显示的数量限制
            isPc: extendUtils.isPC(),
            titleBarHeight: 0,
            shareOptions:{},//分享所需的参数
        })
    },
    components: {
      Swipeout,
      SwipeoutItem,
      SwipeoutButton,
      priceLabel,
      cartHeader,
	    purchaseApply,
      Popup,
      Icon,
      thumb06,
      counter,
      addressComp,
      addressCompEdit,
      AddressChooseComp,
      symbolGift,
      share,
      cutDown
    },
    watch:{
      /**
       * 监听购物车列表的变换，更新总价/总种类/总商品数量相关的数据
       */
      cartList: {
        handler(val, oldVal){
          let cartGoodsNumber = 0;
          if(!!val){
            this.totlePrice = 0;
            this.totlePromotionalPrice = 0;
            this.totleTypes = 0;
            this.totleNumber = 0;
            for(let i = 0; i < val.length; i++){
              const temp = val[i];
              //如果当前购物车商品的数量大于库存，此时需要更新购物车里面的数量为库存数量
              if(!!temp.remainNum && !!temp.quantity && temp.remainNum > 0 && temp.quantity > temp.remainNum){
                this.setCartNum(temp, temp.remainNum)
              }

              cartGoodsNumber += temp.quantity;
              if(!!temp.checked){
                this.totlePrice += (this.dealNum(this.realPrice(temp)) * temp.quantity);
                this.totlePromotionalPrice += (this.calcDiscount(temp) * temp.quantity);
                this.totleNumber += (temp.quantity);
                this.totleTypes++;
              }
            }

            this.checkChooseAll();//检测是否全选
            if(!!val && val.length > 0 ){//后续更新将购物车列表存储缓存，方便后续更新选中状态 
              !!val[0].hasOwnProperty('checked') && extendUtils.setStorage(cartHandler.primaryKey + '_cartUpdatedList', JSON.stringify(val));
            }
          }
          this.setThirdShare();
        },
        deep: true,
        immediate: true
      },

      /**
       * 监听地址的变化，目前是为了更新库存的接口 获取商品的库存数量
       */
      choosedAddress:{
        handler(newVal, oldVal){
          if(!!newVal && Object.keys(newVal).length > 0){
            if(!!newVal.areaCode && newVal.areaCode.split('/').length > 0){
              let areaCodeArr = newVal.areaCode.split('/');
              this.provinceCode = areaCodeArr[0] || '',
              this.cityCode = areaCodeArr[1] || '',
              this.districtCode = areaCodeArr[2] || '',
              this.townCode = areaCodeArr[3] || ''
            
              //地址变化后查询该商品的相关信息
              this.updateAllMsg();
              //查询该商品是否区域限售
              this.checkAreaLimit(); 

              this.goodsDetailList.length > 0 && this.getlistUnitPrice(this.goodsDetailList); //监听地址的变化，重新更新商品的相关属性的变化(目前是苏宁的价格会变) 
            }
          }
        },
        deep: true
      },
    },
    created() {
      this.tChatEventAppBack(500);//注册T信回退事件
      //监听页面返回事件，从审批页面返回，需要取消订单
      extendUtils.winCloseCb(function(data){//注册推送
        this.initList();//重新拉取购物车的列表
        let backData = JSON.parse(JSON.parse(data).refreshData) || {};
        if(!!data && !!backData && 'approval'==backData.pageFrom){
            //此处的orderNo为通过url传递的加密信息，非直接的orderNo
            let applayData =JSON.parse(Base64.decode(backData.orderNo))
            this.cancelOrder(applayData.orderNo)
        }
      }.bind(this));
      this.resetView();
      
    },
    beforeRouteLeave(to,from,next){
        shareHandler.cancelBizmateShare();
        next()
    },
    computed:{
        isIOS(){
            const u = navigator.userAgent;
            const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
            return isiOS;
        }
    },
    mounted() {
        this.setTitleBar();
    },
    methods:{
        /**
         * 自定义H5titlebar的内容
         * 思路：每次都生成一次Vnode并传给titlebar，titlebar会将此dom append到title的位置上。如果其他地方再次更新title，则该dom被移除，下次设置本title时再重复此过程
         */ 
        setTitleBar(){
            if(extendUtils.isPC()){
                document.title = '购物车';
                return;
            }
            let that = this;
            Vue.component('addressTitle', {
                props: {'choosedAddress': {type: Object,default:()=>{}}},
                render: h=>{
                    return h('div', {
                        class: 'title-bar-container',
                        style: {
                            display: 'none'
                        },
                    }, [
                        h('div', [
                            h('div',{
                                style: {'font-size': '.34rem'},
                            }, ['购物车', 
                                h(Icon,{
                                    style: {'margin-left': '.1rem'},
                                    attrs: {
                                        type: 'icon_clockin_locatoion',
                                        size: '.28',
                                    },
                                    on: {
                                        click: this.changeAddress
                                    }
                                })
                            ]),
                            h('div',{
                                style: {'font-size': '.22rem','overflow': 'hidden','text-overflow': 'ellipsis','word-break': 'break-all','white-space': 'nowrap'},
                                on: {
                                    click: this.changeAddress
                                }
                            }, this.choosedAddress.address ? ('配送至: '+ this.choosedAddress.address) : '请选择收货地址')
                        ])
                    ])
                },
                mounted(){
                    window.loadTitleBar.then(titleBar=>{
                        that.$refs.titleBarContainer && titleBar.setTitle(that.$refs.titleBarContainer.$el.childNodes[0])
                    })
                }
            })
        },
        //当地址变更或者商品数量变更，的时候需要更新的相关数据 目前包括 库存/区域先手/赠品和附件相关
        updateAllMsg(item){
          let skuList = null;
          if(!!item && Object.keys(item).length>0){
            skuList = [
              {
                sku: item.sku,
                num: item.quantity
              }
            ];
          }
          //当时单个商品购买数量变化的时候，此时更新单个商品的有无货状态和赠品状态
          this.getlistStock(skuList); //查询该商品的库存
          this.getGoodsGift(skuList); //查询该商品赠品和附件相关的信息
        },

        //新增地址
        saveAddress(item){
            this.$refs['addressComp'].saveAddress(item,false);
        },
        //去新建地址
        gotoAddress(){
          this.showAddressEditPopup = true;
        },
        //新增地址成功回调
        saveSuccess(param){
            this.choosedAddress = param;
            this.$refs.AddressChooseComp && this.$refs.AddressChooseComp.getListData();
            this.showAddressEditPopup = false;
        },


        /*****
         * 选择完地址关闭弹窗
         */
        closeAddressList(){
            this.closeAddressPopup();
        },

        /*****
         * 关闭地址选择信息弹窗
         */
        closeAddressPopup(){
            this.showAddressChoosePopup = false;
        },

        

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
         * 显示地址选择弹窗
         */
        changeAddress(){
          this.showAddressChooseModel = true;
        },
        //保持购物车上面的地址组件与申请采购地址组件值保持一致
        keepAddress(obj){
          this.choosedAddress = obj;
        },
         /**
         * 处理金额计算 小数点失真的问题
         */
        dealNum(num = 0){
          return Math.round(parseFloat(num).toFixed(2)*100);
        },
        /**
         * 阻止事件冒泡的方法
         */
        stopProp(event) {
          const that = this;
          event.stopPropagation();
          event.preventDefault();
        },

        /**
         * 选择完地址的三级联动的回调
         */
        selectAddress(addressID,addressName){
          if(!!addressID && !!addressName){
              console.log(addressID)
              console.log(addressName);
              this.choosedAddress = Object.assign({}, {
                id: '',
                areaCode:addressID.join('/'),
                fullAddress2: addressName.join(''),
                fullAddress: addressName.join('/'),
              })
          }
          //将选择的省市区地址存入session缓存
          extendUtils.setSession(`${goodsHandler.primaryKey}_selectedCity`,JSON.stringify(this.choosedAddress));
          this.showAddressChooseModel = false;
        },


        /**
         * 关闭购物车选择地址的弹窗
         */
        closeAddressChooseModel(){
          this.showAddressChooseModel = false;
        },

        /**
         * 选中或取消购物车商品
         * @param {obj} item 商品对象
         */
        choosedItem(item){
            const that = this;
          item.checked = !item.checked;
        },

        /***
         * 获取收藏商品列表
         * @param page 分页对象，由mescroll提供
         * @param mescroll mescroll对象
         */
        async getListData(page, mescroll) {
          
          const that = this;
          try{
              let list = await this.getCartListFun(page);
              mescroll.endSuccess(list.length, false);
              if(list.length>0){
                  this.getGoodsDetail(list);
              }else{
                  //返回为空的情况直接return[]
                  this.cartList = [];
              }

              //先在缓存中获取购物车商品的价格列表，后续再更新价格
              let cartPriceList = !!extendUtils.getStorage(cartHandler.primaryKey+'_cartPriceList')?JSON.parse(extendUtils.getStorage(cartHandler.primaryKey+'_cartPriceList')):[];
              if(cartPriceList.length > 0){
                list = list.map(item => {
                  let index = cartPriceList.findIndex(temp => {
                    return temp.sku == item.sku;
                  })
                  if(index > -1){
                    item = Object.assign({}, item, {unitPrice: cartPriceList[index].unitPrice})
                  }
                  return item
                })
              }
              this.cartList = list;
              //删除商品或者下拉刷新和从审批回来后重新更新商品的相关信息
              //地址变化后查询该商品的相关信息
              this.updateAllMsg();
              //查询该商品是否区域限售
              this.checkAreaLimit(); 
              //重新查询购物车的数量
              this.$store.dispatch('getCartNum');
              
              
          }catch(e){
              console.error(e);
              mescroll.endErr();
          }
        },

         /**
         * 获取购物车的商品列表 
         */
        getCartListFun(){
            let that = this;
            let param = {
              "userId": cartHandler.userId,
              "companyId": cartHandler.companyId,
              "channelId": cartHandler.channelId,
              "supplierId": cartHandler.supplierId,
            };
            return new Promise((resolve, reject) => {
                cartHandler.getCartList(param).then(res=>{
                    if(res.resultCode == 0){
                        resolve(res.result.list);
                    }else{
                        resolve();
                    }
                }).catch(e=>{ 
                    console.log(e);
                    reject();
                })
            })
        },

        /**
         * 初始化数据
         */
        initList(type){
          this.mescroll.resetUpScroll();
        },

        /**
        * 获取购物车商品信息
        * @param {arr} goodsList商品列表
        */
		    getGoodsDetail(tempCartList){
          if(!!tempCartList && tempCartList.length<=0){return }
          const that = this;
          let ids = tempCartList.map(function(value){
          　　return value.sku
          })            
          let param = {
              sku: ids,
              supplierId: goodsHandler.supplierId,
              channelId: goodsHandler.channelId,
          }
          goodsHandler.getProductSimpleDetail(param).then(res=>{
            if(res.resultCode == 0 && res.result){
              //根据商品id查询商品价格
              if(res.result.detail.length>0){
                let detailList = res.result.detail;
                that.goodsDetailList = res.result.detail;
                that.getlistUnitPrice(that.goodsDetailList);
                //将categoryId1、categoryId2、categoryId3字段插入单个的购物车商品item上
                //将state (状态.0=下架,1=上架)字段插入单个的购物车商品item上
                this.insertData(this.cartList, detailList, 'notInPool');//该商品是否在商品池 true=不在商品池 false=在商品池
                this.insertData(this.cartList, detailList, 'categoryId1');
                this.insertData(this.cartList, detailList, 'categoryId2');
                this.insertData(this.cartList, detailList, 'categoryId3');
                this.insertData(this.cartList, detailList, 'state');
                //更新购物车的选中状态
                this.insertChecked(this.cartList); 
              }
            }
          }).catch(e=>{
            console.log(e);
          })
        },    

        /**
         * 根据商品编号去查询商品的价格
         * @param {arr} detailList 商品详情列表
         */
        getlistUnitPrice(detailList){
          if(!!detailList && detailList.length<=0){return}
          const that = this;           
          let ids = detailList.map(function(value){
        　　return {
              categoryId1:value.categoryId1,
              categoryId2:value.categoryId2,
              categoryId3:value.categoryId3,
              sku:value.sku
            }
          })
          let param = {
            spId: goodsHandler.supplierId,
            businessType:'COMMODITY',
            productInfos: ids,
          }
          goodsHandler.getlistUnitPrice(param).then(res=>{
            if(res.resultCode == 0 && res.result){
              let resCartList = res.result.productPrice;
              //将批量获取的购物车商品的价格存入前端缓存
              extendUtils.setStorage(cartHandler.primaryKey + '_cartPriceList', JSON.stringify(resCartList));
              //将unitPrice字段插入到cartList对应的每一项中
              this.insertData(this.cartList, resCartList, 'unitPrice');

              //获取商品的活动价 并更新购物车商品的相关字段
              this.listProductMarketing();
            }
          }).catch(e=>{
            console.log(e);
          })
        },   

        // 真正的展示价格 此处是处理当商品正在参加活动的时候，购物车列表展示的商品价格应该是活动价
        realPrice(item){
          if(!!item.promotionalPrice && item.promotionalPrice>0 && item.unitPrice && item.unitPrice>0){
            return item.promotionalPrice;
          }
          return item.unitPrice;
        },

        // 计算单个商品的优惠的金额
        calcDiscount(item){
          if(!!item.promotionalPrice && item.promotionalPrice>0 && item.unitPrice && item.unitPrice>0){
            // 计算优惠金额
            let differPrice =  this.dealNum(item.unitPrice) - this.dealNum(item.promotionalPrice);
            if(differPrice > 0){
              return differPrice;
            }else{
              return 0
            }
          }
          return 0; //没有优惠金额的话返回0即可
        },
        
        /**
         * 根据商品编号和channelId批量获取商品的活动信息
         */
        listProductMarketing(){
          
          const that = this;
          if(!this.cartList || 0 == this.cartList.length){
            return;
          }
          let skuList = this.cartList.map(function(value){
          　　return value.sku
          })
          let param = {
              channelId: activityHandler.channelId,
              skuList: skuList
          }
          activityHandler.listProductMarketing(param).then(res=>{
              if(res.resultCode == 0 && res.result && res.result.list && res.result.list.length>0){
                  let tempList = res.result.list;
                  for (let i = 0; i < this.cartList.length; i++) {
                    const element = this.cartList[i];
                    let index = tempList.findIndex(item=>{
                      return item.sku == element.sku
                    })
                    if(index > -1){
                      this.$set(element, 'isPreheat', ProductActivityStatus[tempList[index].marketingState].isPreheat);
                      this.$set(element, 'isGoingOn', ProductActivityStatus[tempList[index].marketingState].isGoingOn);
                      this.$set(element, 'isEnded', ProductActivityStatus[tempList[index].marketingState].isEnded)
                      this.$set(element, 'marketingStartTime', tempList[index].marketingStartTime);
                      // 只有当活动进行中的时候，才更新活动价格
                      if(!!ProductActivityStatus[tempList[index].marketingState].isGoingOn){
                        this.$set(element, 'promotionalPrice', tempList[index].promotionalPrice);
                      }
                    }
                  }
              }
          }).catch(e=>{
              console.log(e);
          })
          
        }, 

        /**
         * 给购物车列表新增checked字段 用来确认选中与否的
         */
        insertChecked(cartList){
          //返回为空的情况直接return[]
          if(0 == cartList.length){
              return cartList;
          }    
         
          //初始化更新availableCartNum的值
          this.availableCartNum = 0;
          if(!!this.editCart){ //如果是编辑购物车页面 则可选的为全部的
            this.availableCartNum = cartList.length;
            cartList.forEach(item => {
              this.checkItem(item);
            })
          }else{
            cartList.forEach(item => {
              //判断该商品是否为不能选择即是否为下架和缺货状态 
              if(!!this.disableChoose(item)){ //是下架和缺货状态此时设置checked统一为false
                this.$set(item, 'checked', false)
              }else{//非缺货和下架状态
                this.availableCartNum++;
                this.checkItem(item);
              }
            })
          }
          //检测是否全选
          this.checkChooseAll();
        },

        /** 
         * 判断单个购物车项是否选中的
        */
        checkItem(item){
          let cartUpdatedList = !!extendUtils.getStorage(cartHandler.primaryKey +'_cartUpdatedList')?JSON.parse(extendUtils.getStorage(cartHandler.primaryKey +'_cartUpdatedList')):[];
          let index = cartUpdatedList.findIndex(temp => {
            return temp.sku == item.sku;
          })
          if(index > -1){
            this.$set(item, 'checked', !!cartUpdatedList[index].hasOwnProperty('checked') ? cartUpdatedList[index].checked : true);
          }else{
            this.$set(item, 'checked', true)
          }            
        },

        /**
         * 检测是否都被选中
         */
        checkChooseAll(){
           this.chooseAll = (this.availableCartNum != 0) && (this.availableCartNum == this.totleTypes); //如果availableCartNum为0的话this.chooseAll为false
        },

        /**
         * toggle全选与取消全选的功能
         * @type 是否设定为全选
         */
        chooseAllFun(type){
            let that = this;
          this.chooseAll = !this.chooseAll;
          if(this.cartList.length > 0){
            this.cartList.forEach(item => {
              if(!!this.editCart){ //为了判断编辑功能加入收藏的全选
                this.$set(item, 'checked', this.chooseAll);
              }else{
                //全选功能只针对上架和有货的
                if(!this.disableChoose(item)){ 
                  this.$set(item, 'checked', this.chooseAll);
                }else{
                  this.$set(item, 'checked', false);
                }
              }
            })
          }
        },

        /**
         * 删除购物车里面的商品
         * @item 删除的商品单个信息
         */
        deleteGoodsCar(item){
          let that = this;
          SnModal({
            message: '确认要删除这1种商品？',
            showCancelButton: true,
          }).then(res => {
            that.deleteGoodsFromCartList([{sku: item.sku, supplierId: item.supplierId}]);
          }).catch(rej => {
            console.log('rej === ', rej);
          });
        },

        /**
         * 从购物车列表删除商品
         * @item 删除的商品单个信息
         * @flag 判断是否是删除还是移入收藏
         */
        deleteGoodsFromCartList(deleteList, flag = true){
          let that = this;
          let param = {
              "userId": cartHandler.userId,
              "companyId": cartHandler.companyId,
              "channelId": cartHandler.channelId,
              "delAll":false,
              "goods":deleteList,
              "supplierId":cartHandler.supplierId
          }
          cartHandler.deleteGoodsFromCartList(param).then(data=>{
              if(data.resultCode == 0){
                  //触发购物车全局数量的变化
                  this.$store.dispatch('getCartNum');
                  //重新拉取数据
                  that.initList();
              }
          }).catch(rej => {
              console.log('rej === ', rej);
          });
        },

        /**
         * 设置购物车里面的商品数量
         * @item 商品信息
         * @param {int} num 数量
         */
        setCartNum(item, num){
          //更新商品的数量
          this.$set(item, 'quantity', num)
          let that = this;
          //触发购物车数量的变化
          let param = {
            "userId": cartHandler.userId,
            "companyId": cartHandler.companyId,
            "channelId": cartHandler.channelId,
            "sku":item.sku,
            "quantity":num,
            "supplierId":item.supplierId
          }
          cartHandler.setCartNum(param).then(data=>{
              if(data.resultCode == 0){
                  //触发购物车全局数量的变化
                  this.$store.dispatch('getCartNum');
                  // 商品数量变化触发相关接口
                  this.updateAllMsg(item)
              }
          }).catch(e=>{
              console.log('rej === ', e);
          });
        },

        /** 
        * 是否展示赠品和附件
        */
        showDiscount(item){
          return (!!item.attachmentList && item.attachmentList.length > 0) || (!!item.giftList && item.giftList.length > 0);
        },
        /** 
        * 是否展示赠品
        */
        showGiftList(item){
            return (!!item.giftList && item.giftList.length > 0);
        },
        /** 
        * 是否展示附件
        */
        showAttachmentList(item){
            return (!!item.attachmentList && item.attachmentList.length > 0) ;
        },
        /** 
        * 点击赠品和附件的查看更多的按钮
        */
        viewMoreFun(type, item){
          if(type == 'gift'){
            this.viewMoreNumGift = item.giftList.length;
          }else if(type == 'attachment'){
            this.viewMoreNumAttachment = item.attachmentList.length;
          }
        },

        /**
         * 点击购物车右上角的编辑功能
         * @flag true 代表编辑 false代表完成
         */
        dealCart(flag){
          this.editCart = !flag;
          this.insertChecked(this.cartList)
        },

        /**
         * 左滑移入收藏的功能
         * @item 删除的商品单个信息
         */
        addCollectionFun(item){
          let skus = [];
          if(item instanceof Array){//批量移入收藏
            skus = item;
          }else{//单个移入收藏
            skus = [{
              sku: item.sku,
              supplierId: item.supplierId,
            }];
          }
          this.addFavorite(skus).then(flag=>{
            if(flag){
              //商品移入收藏之后 就把购物车列表该项删除
              this.deleteGoodsFromCartList(skus, false);
            }
          }); //该方法在全局混入里面            
        },
        /**
         * 批量商品移入收藏
         */
        addCollectionTogether(){
          let that = this;
          //获取选中的购物车列表
          let selectedGoodsList = this.getSelectedCartGoods();
          if(selectedGoodsList.length <= 0){
            extendUtils.showToast('请选择需要收藏的商品');
          }else{
            let str = `商品移入收藏夹将不在购物车显示`;
            let title = `确认${selectedGoodsList.length}种商品移入收藏夹`;

            SnModal({
                title: title,
                message: str,
                showCancelButton: true,
            }).then(res => {
                let list = [];
                selectedGoodsList.forEach(item => {
                    list.push({
                        sku: item.sku, 
                        supplierId: item.supplierId,
                    })
                })
                that.addCollectionFun(list);
            }).catch(rej => {
                console.log('rej === ', rej);
            });
          }
        },

        /**
         * 获取选中的购物车列表
         * return 返回选中商品列表
         */
        getSelectedCartGoods(){
          return this.cartList.filter(item => {
            return !!item.checked;
          })
        },

        /**
         * 批量删除购物车的商品
         */
        deleteTogether(){
          let that = this;
          let selectedGoodsList = this.getSelectedCartGoods();
          if(selectedGoodsList.length <= 0){
              extendUtils.showToast('请选择需要删除的商品');
          }else{
              let str = `确认要删除这${selectedGoodsList.length}种商品？`;
              SnModal({
                  message: str,
                  showCancelButton: true,
              }).then(res => {
                  let deleteList = [];
                  selectedGoodsList.forEach(item => {
                      deleteList.push(
                          {
                              "sku": item.sku,
                              "supplierId": item.supplierId
                          }
                      )
                      
                  })
                  that.deleteGoodsFromCartList(deleteList);
              }).catch(rej => {
                  console.log('rej === ', rej);
              });
          }
        },

        /**
         * 跳转到提交订单页面
         */
        gotoOrderConfirm(){
          let that = this;
          // if(!this.judgeAddress()){ return };
          if(!!that.judgeStateFromSelectedCartList('请选择需要结算的商品')){
            //首先将选中的购物车商品列表存入缓存，以便在提交订单页面展示 目前暂时先用存缓存的方式

            let productList = this.getSelectedCartGoods().map(function(item){
                return {
                    sku: item.sku, //商品sku编号
                    num: item.quantity,  //商品数量
                    productSpec: item.specification, //商品规格参数,此处就是序列化后的
                    supplierId: item.supplierId, //供应商id
                }
            })
            //将要购买的商品list和选择的地址存储到 sessionStorage
            extendUtils.setSession('productSkuList', JSON.stringify(productList));
            extendUtils.setStorage(cartHandler.primaryKey + '_addressSelected', JSON.stringify(this.choosedAddress));
            this.$router.push({
                path: '/order/confirm',
                query: { 
                  from: 'cart', //用来判断是从购物车页面跳转的提交订单页面
                }
            })
            
          }
        },

        /**
         * 跳转到商品详情
         */
        gotoDetail(item){
          this.$router.push(
            {
                path: '/product/detail',
                query:{
                    sku: item.sku,
                    supplierId: item.supplierId
                }
            }
          )
        },

        /**
         * 分享购物车（跳转到分享购物车的页面 第一版的时候是这样的）
         */
        shareCartOld(){
          let that = this;
          if(!!that.judgeStateFromSelectedCartList('请选择需要分享的商品')){
            let selectedCartGoods = this.getSelectedCartGoods();
            extendUtils.setStorage(cartHandler.primaryKey +'_shareGoods', JSON.stringify(selectedCartGoods));
            //跳转到分享购物车页面
            that.gotoShare();
          }
        },

        /**
         * 分享购物车（最新版，直接弹分享的弹窗）
         */
        shareCart(){
          let that = this;
          if(!!that.judgeStateFromSelectedCartList('请选择需要分享的商品')){
            let selectedCartGoods = this.getSelectedCartGoods();
            that.getShareInfo(selectedCartGoods);
          }
        },
        /**
         * 判断是否选择了收货地址
         */
        judgeAddress(){
          let flag = true;
          if(!this.choosedAddress.areaCode){
            SnModal({
              message: '您还没有收货地址，赶快去设置一个吧',
              showCancelButton: true,
              confirmButtonText:'去设置',
            }).then(res => {
                this.gotoAddress();
            }).catch(rej => {
                console.log('rej === ', rej);
            });
            flag = false;
          }
          return flag;
        },


        /**
         * 申请采购操作
         */
        gotoPurchaseApply(){
            let that = this;
            if(!this.judgeAddress()){ return };
            //获取选中的购物车列表
            if(!!that.judgeStateFromSelectedCartList('请选择需要申请采购的商品')){
              //显示申请采购界面
              that.purchaseApplyGoods = this.getSelectedCartGoods();
              that.showPurchaseApply = true;
            }
            
        },

        /**
         * 跳转到分享购物车页面
         */
        gotoShare(){
            let that = this;
            that.$router.push({
              path: '/share',
              query:{
                bisType: 'shareCart'
              }
            })
        },
        /**
         * 取消订单调取接口
         * @param orderNo
         */
        cancelOrder(orderNo){
            let that = this;
            orderHandler.cancelOrder({orderNo: orderNo}).then(res=>{
                if(res.resultCode == 0){
                    console.log('取消成功')
                }
            }).catch(e=>{
                console.log(e);
            })
        },
        /**
         * 页面刷新入口函数 mescroll刷新回调
         * @param mescroll对象
         */
        re_fresh(mescroll){
          this.initList();
        },

        /**
         * T信回退事件的注册回调 必须是goBackFun
         */
        goBackFun(){
          this.$router.back();
        },

        /**
         * 判断选中的购物车数据是否有已下架的商品，如果有showToast提示
         * @param str String
         * @param hideToast Boolen
         */
        judgeStateFromSelectedCartList(str,hideToast=false){
          let flag = true;
          let selectedGoodsList = this.getSelectedCartGoods();
          if(selectedGoodsList.length <= 0){
            hideToast?'':extendUtils.showToast(str);
            return false;
          }
          let list = selectedGoodsList.filter(item=>{
            return item.state == 0;
          })
          if(!!list && list.length > 0){
            hideToast?'':extendUtils.showToast('选择的商品中有已下架商品，请重新选择');
            flag = false;
          }
          return flag;
        },



        /**
         * 查询该商品的库存数量
         */
        getlistStock(skuList){
          let that = this;
          //如果购物车列表为空直接return
          if(this.cartList.length <= 0){return}
          if(!this.provinceCode){ //如果没有地址的情况下，默认每一项都是有库存的
            this.cartList.forEach(item => {
              this.$set(item, 'hasStock', true)
            })
            //更新购物车的选中状态
            this.insertChecked(this.cartList); 
          }else{//有地址的话直接调取查询库存的接口
            let ids = [];
            if(!!skuList){ //如果是改变单个商品的数量，此时只更新单个商品的库存即可
              ids = skuList;
            }else{
              ids = this.cartList.map(item => {
                return {
                  sku: item.sku,
                  num: item.quantity,
                }
              })
            }
            let param = {
                stockRequire:ids,
                areaId1: this.provinceCode,
                areaId2: this.cityCode || '',
                areaId3: this.districtCode || '',
                areaId4: this.townCode || '',
                supplierId: goodsHandler.supplierId,
            }
            goodsHandler.getlistStock(param).then(res=>{
                that.$loading.hide();
                if(res.resultCode == 0 && !!res.result && res.result.stock.length > 0){
                    this.stockList = res.result.stock.map(item => {
                      item = Object.assign({}, item, {hasStock: ProductStockStatus[item.stockState].hasStocks});
                      return item;
                    });
         
                    //将hasStock和remainNum插入到购物车列表的每一项里面 及标识该商品是否有库存和剩余商品数量
                    this.insertData(this.cartList, this.stockList, 'hasStock');
                    this.insertData(this.cartList, this.stockList, 'remainNum');
                    
        

                    //更新购物车的选中状态
                    this.insertChecked(this.cartList); 
                }
            }).catch(e=>{ 
                console.log(e);
            })			
          }
        },
        /**
         * 查询该商品的赠品和附件
         */
        getGoodsGift(skuList){
          let that = this;
          //如果购物车列表为空直接return
          if(this.cartList.length <= 0){return}
          if(!this.provinceCode){ //如果没有地址的情况下，不请求接口
            return
          }
          let ids = [];
          if(!!skuList){ //如果是改变单个商品的数量，此时只更新单个商品的库存即可
            ids = skuList;
          }else{
            ids = this.cartList.map(item => {
              return {
                sku: item.sku,
                num: item.quantity,
              }
            })
          }
          let param = {
              skuIds:ids,
              areaId1: this.provinceCode,
              areaId2: this.cityCode || '',
              areaId3: this.districtCode || '',
              areaId4: this.townCode || '',
              supplierId: goodsHandler.supplierId,
              show: false, //购买量不足时是否展示赠品，true-展示 false-不展示
          }
          goodsHandler.getGoodsGift(param).then(res=>{
            if(res.resultCode == 0 && !!res.result && !!res.result.skuGiftAndAttachmentInfoList && res.result.skuGiftAndAttachmentInfoList.length > 0){
                this.skuGiftAndAttachmentInfoList = res.result.skuGiftAndAttachmentInfoList.map(item => {
                  item = Object.assign({}, item, {sku: item.primirySku})
                  return item;
                });
      
                //将giftList和attachmentList插入到购物车列表的每一项里面 及标识该商品的赠品和附件详情
                this.insertData(this.cartList, this.skuGiftAndAttachmentInfoList, 'giftList');
                this.insertData(this.cartList, this.skuGiftAndAttachmentInfoList, 'attachmentList'); 
            }
          }).catch(e=>{ 
              console.log(e);
          })			
          
        },
        /**
         * 查询该商品的是否区域限售
         */
        checkAreaLimit(isShowLoading=true){
          let that = this;
          //如果购物车列表为空直接return
          if(this.cartList.length <= 0){return}
          if(!this.provinceCode){ //如果没有地址的情况下，默认每一项都是非区域限售的
            this.cartList.forEach(item => {
              this.$set(item, 'areaRestrict', false)
            })
            //更新购物车的选中状态
            this.insertChecked(this.cartList); 
          }else{//有地址的话直接调取查询库存的接口

            let ids = this.cartList.map(item => {
              return  item.sku
            })
            let param = {
                skuIds: ids,
                areaId1: this.provinceCode,
                areaId2: this.cityCode || '',
                areaId3: this.districtCode || '',
                areaId4: this.townCode || '',
                supplierId: goodsHandler.supplierId,
            }
            !!isShowLoading && that.$loading.show();
            goodsHandler.checkAreaLimit(param).then(res=>{
                !!isShowLoading && that.$loading.hide();
                if(res.resultCode == 0 && !!res.result && res.result.skuAreaRestrictList.length > 0){
                    this.skuAreaRestrictList = res.result.skuAreaRestrictList;
         
                    //将areaRestrict插入到购物车列表的每一项里面 及标识该商品是否有库存和剩余商品数量
                    this.insertData(this.cartList, this.skuAreaRestrictList, 'areaRestrict');
                    
                    //更新购物车的选中状态
                    this.insertChecked(this.cartList); 
                }
            }).catch(e=>{ 
                that.$loading.hide();
                console.log(e);
            })			
          }
        },

        /**
         * 判断单个商品的上下架和库存状态
         * @param item 单个的商品item
         */
        judgeProductStatus(item){
          if(!item || Object.keys(item).length <= 0){  return {} };
          let statusObj = {};
          if(item.hasOwnProperty('state')){
            if(!!this.productStatusMap[item.state].stopSales){ //state为0表示已下架
                statusObj = {
                  noSale: true, //下架
                }
            }else{ //表示已上架
                statusObj = {
                  noSale: false, //上架
                  noStock: !!item.hasOwnProperty('hasStock') ? !item.hasStock : false,
                }
            }
          }else if(item.hasOwnProperty('notInPool') && !!item.notInPool){ //不在商品池表示已下架
            statusObj = {
              noSale: true, //下架
            }
          }else{
            statusObj = {
              noSale: false, //上架
              noStock: !!item.hasOwnProperty('hasStock') ? !item.hasStock : false,
            }
          }
          statusObj = Object.assign({}, statusObj, {remainNum: item.remainNum, areaRestrict: item.areaRestrict});
          return statusObj;
        },

        /**
         * 判断该条目是否能被选中 true代表不能 false代表可以
         */
        disableChoose(item){
          let statusObj = this.judgeProductStatus(item);
          return !!statusObj.noSale || !!statusObj.noStock || !!statusObj.areaRestrict;
        },


        /**
         * @param list 需要插入字段的list
         * @param dataList 提供插入字段的list
         * @param key 要插入的key
         */
        insertData(list, dataList, key){
            for(let i = 0; i < dataList.length; i++){
                const item = dataList[i];
                let index = list.findIndex(temp=>{
                    return item.sku == temp.sku;
                })
                if(index > -1){
                    if(item.hasOwnProperty(key)){
                        let obj = Object.assign({}, list[index], {[key]: item[key]});
                        list.splice(index, 1, obj)
                    }
                }
            }
            return list;
        },

        /**
         * 点击不可选择的购物车选项，showToast 提示
         * @param item 购物车商品的单个信息
         */
        clickDisableChoose(item){
          let statusObj = this.judgeProductStatus(item);
          if(!!statusObj.noSale){
            extendUtils.showToast('该商品已下架，不可选');
          }else if(!!statusObj.areaRestrict){
            extendUtils.showToast('该商品在该区域限售，不可选');
          }else{
            !!statusObj.noStock &&  extendUtils.showToast('该商品无货，不可选，请切换地址');
          }
        },
		/**
         * setThirdShare
         */
        async setThirdShare(){
            let that = this;
            if(!!that.judgeStateFromSelectedCartList('请选择需要分享的商品',true)){
                let selectedGoods = that.getSelectedCartGoods();
                if(selectedGoods.length <= 0){
                    shareHandler.cancelBizmateShare();
                }else{
                    let uData = await shareHandler.getUserInfo();
                    let skus = selectedGoods.map(function(value,index,array){
                    　　return value.sku
                    })
                    let uName = uData.uName || '';
                    //设置第三方（微信、朋友圈等）分享信息
                    let location = window.location;
                    let appName = that.BMallConfig.SUPPLIER_Map[goodsHandler.supplierId].name+'企业购';
                    let callBackUrl = window.location.origin + location.pathname + "#/share?channelId="+(goodsHandler.channelId||'')+"&bisType=shareMenu&shareName="+encodeURIComponent(uName || '')+"&skus="+encodeURI(skus.join('|'))+"&supplierId="+selectedGoods[0].supplierId;
                    let shareInfo = {
                        title:uName+'的购物清单', // 分享标题 
                        desc:'这是'+uName+'的购物清单，点击请查看', // 分享描述   
                        link:callBackUrl, // 分享链接  
                        imgUrl:selectedGoods[0].imageUrl || '', // 分享图标,图片绝对地址 
                    }
                    //设置二次分享
                    shareHandler.setThirdShareInfo(shareInfo);
                }
            }else{
                shareHandler.cancelBizmateShare();
            }
        },        
        /**
        * 获取分享所需参数
        *@param {Array} selectedGoods 所选中的列表
        */
        async getShareInfo(selectedGoods){
          let that = this;
          let location = window.location;
          let uData = await shareHandler.getUserInfo();
          let appInfo = {};
          try {
              appInfo = await shareHandler.getAppConfig();
          } catch (error) {
          }
          let appId = appInfo.appId || 0;
          let skus = selectedGoods.map(function(value,index,array){
          　　return value.sku
          })
          let uName = uData.uName || '';
          let appName = that.BMallConfig.SUPPLIER_Map[goodsHandler.supplierId].name+'企业购';
          //todo pageType参数是为了兼容app的商旅链接判断的，后续需要app端进行修改。
          let callBackUrl = location.origin + location.pathname + "#/share?channelId="+(goodsHandler.channelId||'')+"&bisType=shareMenu&shareName="+encodeURIComponent(uData.uName || '')+"&skus="+encodeURI(skus.join('|'))+"&supplierId="+selectedGoods[0].supplierId;
          let shareData = {
              title : uName+'的购物清单', // 分享标题          
              desc : '这是'+uName+'的购物清单，点击请查看', // 分享描述           
              link : callBackUrl, // 分享链接          
              imgUrl : selectedGoods[0].imageUrl || '', // 分享图标,图片绝对地址  
              appId: appId+'',//小应用Id
              appName: appInfo.appName || appName || '企业购',//小应用名字,无合法appId时使用appName
              contentType : 'link', // 分享类型,music、video或link，不填默认为link
          }
          that.shareOptions = shareData;
          that.showSharePopup = true;
        },
    },
  }
</script>
<style scoped lang="less">
@import '~themes/default/styles/cart/cart.less';
</style>
<style lang='less'>
@import '~themes/default/styles/components/mescroll.less';
.radiusTop.vux-popup-dialog{
  z-index: 1000;
}
.cut_wrap.cartPage{
    display: flex;
    margin-top: .35rem;
    .cut_content{
        .text{
            margin-right: .1rem;
        }
        padding: .04rem .2rem;
        background: rgba(232,43,41,.05);
        border-radius: .22rem;
        display: flex;
        align-items: center;
        line-height: .32rem;
        font-size: .22rem;
        color: @theme-color;
    }
}

.price_lable.cartPage{
    background: linear-gradient(90deg,#e82b29, #ff6c58);
    font-size: .2rem;
    border-radius: .06rem;
    padding: .02rem .1rem;
    width: .8rem;
    height: .32rem;
    color: #fff;
    line-height: .28rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: .1rem;
    margin-top: .2rem;
}
</style>
