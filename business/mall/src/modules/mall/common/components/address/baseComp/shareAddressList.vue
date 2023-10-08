<template>
  <div class="share-address">
    <mescrollVue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
      <div id="shareAddressContainer" :class="{'empty-page': shareList.length<=0 && !loading, address_container:!loading}">
        <div @click="selectItem(item)" class="address-item" v-for='(item, index) in shareList' :key="index">
          <swipeout>
            <swipeout-item :disabled='isPC' :sensitivity="10" :ref='"swipeoutItem" + index' @on-open="handleSwipeoutOpen(index)">
              <!-- 移动端展示的操作按钮部分 -->
              <div slot="right-menu">
                <swipeout-button class="delete_swipe" @click.native.stop="deleteAddress(item, index)">
                  <p><Icon type='icon_mall_delete2' size=".4"/></p>
                  <span>删除</span>
                </swipeout-button>
              </div>
                <div slot="content">
                  <div class="item">
                      <div class="main">
                        <span class='title cursorp'>{{item.area | formateArea}}{{item.address}}</span>
                      </div>
                      <!-- pc端展示的操作按钮部分 -->
                      <div class="remain buttonGroup cursorp" v-if='isPC' @click='stopProp'>
                        <span @click='editItem(item)'>编辑</span>
                        <span @click='deleteAddress(item, index)'>删除</span>
                      </div>

                      <div class="remain edit cursorp" v-else>
                        <Icon @click.native.stop="editItem(item)" type="btn_common_edit" size=".3"/>
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
              <span>新增公司共享地址</span>
            </div>
        </div>
	  </div>


    <!-- 新增和编辑共享地址弹窗页面-->
    <div v-transfer-dom>
        <popup v-model="showAddShareAddress" height="100%" width="100%" position="right" class="editSharePop">
            <editShareAddress 
              v-if="showAddShareAddress"
              ref="editShareAddressComp"
              :useType="useType"
              :shareAddressItem="shareAddressItem"
              @saveShareAddress="saveShareAddress"
            />
        </popup>
    </div>
  
  </div>
</template>
<script>
  import Icon from 'common/components/base/Icon';
  import editShareAddress from './editShareAddress';
  import mescrollMixin from 'common/lib/mixin/mescrollMixin'
  import requestHandler from 'common/lib/requestHandler/addressHandler.js';
  import extendUtils from 'common/lib/utils';
  import Bus from 'common/lib/bus/bus.js';
  import { SnModal } from "sinosun-ui";
  import {
    TransferDom,
    Popup,
    Swipeout,
    SwipeoutItem,
    SwipeoutButton
  } from 'vux';

  export default {
    name:'swp-share-address',
    mixins: [mescrollMixin],
    directives: {
      TransferDom
    },
    
    props: {
      value: {
        type: Object,
        default(){
          return {}
        }
      },
      useType:{//用来标识哪里是否是单独引用的编辑地址的组件，用来解决回退的问题
        type: String
      }
    },
    computed:{
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
      Icon,
      editShareAddress,
    },
    data: function () {
        let that = this;
        let baseTitle = document.title
        let managerData = extendUtils.stateManager.setData([
            {
                name: 'showAddShareAddress',
                parent: that.useType && that.useType == 'single' ? '$refs.addressCompEdit.$refs.shareListComp':'$refs.addressComp.$refs.editComp.$refs.shareListComp', //todo 目前涉及到多级弹窗回退的问题，后续有时间优化处理
                show: {
                    callback: function () {
                      let titleStr = that.addOrEdit == 'add'?'新增公司共享地址':'编辑公司共享地址'
                      document.title = titleStr;
                    }
                        
                },
                hide: {
                    callback: function () {
                      document.title = baseTitle;
                    },
                }
            },
        ]);
        let data = {
            loading: true, //页面进入时加载效果
            isPC: extendUtils.isPC(),
            shareList: [], //共享的地址列表数据
            titleType: 'add', //用来区别是新增还是编辑的
            mescrollDown: {//自定义下拉刷新的配置
              use: false
            },
            mescrollUp: {
              htmlNodata: '', //不显示‘没有更多了’
              empty: {
                warpId: 'shareAddressContainer',
                icon: require('themes/default/img/defaultPage/img_defpage_noaddress@2x.png'),
                tip: '您的公司暂无共享地址，赶紧为您的公司添加一个共享地址吧'
              }
            },
            shareAddressItem:{},// 编辑和新增的对象
            addOrEdit: 'add', //用来确定是新增还是编辑共享地址的
        }
        data = Object.assign(managerData, data)
        return data
    },
    filters:{
      //过滤掉三级联动字符串里面的"/"
      formateArea(value){
        try {
          value = value.replace(/\//ig,'');
        } catch (error) {
          
        }
        return value;
      }
    },
    created: function () {
      
    },
    
    beforeDestroy () {},
    mounted: function () {},
    watch: {
  
    },
    methods: {
      /**
       * 初始化分页数据
       */
      initList(){
        this.shareList = [];
        this.mescroll.resetUpScroll();
      },

      /**
       * 页面刷新入口函数 mescroll刷新回调
       * @param mescroll对象
       */
      re_fresh(mescroll){
          mescroll.resetUpScroll();
      },

      /***
       * 处理s实现一个swiperout打开其他的会关闭
       * @param chooseIndex 被操作的swipe
       */
      handleSwipeoutOpen(chooseIndex) {
        const that = this;
        if (chooseIndex > -1) {
          that.shareList.forEach((val, index) => {
            if (index != chooseIndex && that.$refs['swipeoutItem' + index][0].isOpen == true) {
              that.$refs['swipeoutItem' + index][0].close();
            }
          })
        }
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
       * 点击新增共享地址的按钮
       */
      showReceipt() {
        this.addOrEdit = 'add';
        this.shareAddressItem = {
          area:'',
          areaCode:'',
          address:'',
        };
        this.showAddShareAddress = true;
      },

      /***
       * 更新新增或编辑的地址对象都为空或初始值
       */
      clearObj(obj) {
        for (let item in obj) {
          obj[item] = ''
        }
        return obj;
      },

      /***编辑地址 
      *@param 
      */
      editItem(item) {
        this.addOrEdit = 'edit';
        this.shareAddressItem = item;
        this.showAddShareAddress = true;
      },

      //选中某个地址
      selectItem(item){
        let obj = {
          area: item.area,
          areaCode: item.areaCode,
          address: item.address,
        }
        this.$emit('input', obj);
        this.$emit('closeShareList');
      },

      /***
       * 删除地址的回调confirm
       */
      deleteAddress(item, index) {
        let that = this;
        SnModal({
            message: '确定要删除该共享地址吗？',
            showCancelButton: true,
        }).then(res => {
            that.deleteAddressFun(item);
        }).catch(rej => {
            console.log('rej === ', rej);
        });
      },


      /***
       * 真正的删除地址confirm的回调
       */
      deleteAddressFun(item){
        let that = this;
        let param = {
          userId: requestHandler.userId,
          companyId: requestHandler.companyId,
          channelId: requestHandler.channelId,
          supplierId: requestHandler.supplierId,
          project: 'MALL',
          commonAddressIds: [item.commonAddressId]
        };
        that.$loading.show();
        requestHandler.deleteCommonAddress(param).then((res) => {
          if (res.resultCode == 0) {
            extendUtils.showToast('删除成功');
            that.initList();
            that.$loading.hide();
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
            let data = await this.getShareAddressList();
            that.shareList = data;
            mescroll.endSuccess(that.shareList.length, false);
        }catch(e){
            console.error(e);
            mescroll.endErr();
        }
      },



      /**
       * 获取地址列表的数据 
       */
      getShareAddressList(){
        const that = this;
        let param = {
          userId: requestHandler.userId,
          companyId: requestHandler.companyId,
          channelId: requestHandler.channelId,
          supplierId: requestHandler.supplierId,
          project: 'MALL'
        }
        that.loading = true;
        return new Promise((resolve, reject) => {
            requestHandler.getShareAddressList(param).then(res=>{
              that.loading = false;
              if(res.resultCode == 0 && !!res.result.list && res.result.list.length >= 0){
                  resolve(res.result.list);
              }else{
                  resolve([]);
              }
            }).catch(e=>{ 
              that.loading = false;
              console.log(e);
              resolve([]);
            })
        })
      },


      /******
       * 保存共享地址
       * item 共享地址的相关信息
       * type 是来自编辑共享地址的页面 type="share"; 还是来自编辑地址列表的页面type="address"
       */
      saveShareAddress(item, type){
        const that = this;
        let param = {
          userId: requestHandler.userId,
          companyId: requestHandler.companyId,
          channelId: requestHandler.channelId,
          supplierId: requestHandler.supplierId,
          area: item.area,
          address: item.address,
          areaCode: item.areaCode,
          project: 'MALL'
        }

        let flag = !!item.commonAddressId; //代表是新增还是编辑 true代表编辑，false代表新增
        if(!!flag){ //如果是编辑的话，此时需要将commonAddressId加进去
          param = Object.assign({}, param, {commonAddressId: item.commonAddressId})
        }

        let apiType = !!flag ? 'updateCommonAddress' : 'addCommonAddress';
        
        requestHandler[apiType](param).then(res=>{
          if(res.resultCode == 0){
            let str = !!flag?'编辑成功':'新增成功';
            extendUtils.showToast(str);
            this.initList();
            this.showAddShareAddress = false;
          }
        }).catch(e=>{ 
          console.log(e);
        })
        
      },
     
    }
  }

</script>
<style lang='less'>
  @import '~themes/default/styles/components/mescroll.less';
</style>
<style scoped lang="less">
  @import '~themes/default/styles/common/variable.less';
  @import '~mallStyles/mixins/mixinsStyle.less';
  .editSharePop{
    background: @background-color;
    z-index: 2000;
  }
  .share-address{
    height: 100%;
    /deep/ .delete_swipe{
      border-radius:0 .2rem .2rem 0;
      border-left: none;
      font-size: 0.24rem;
      background-color: @btn-danger-bg-color;
    }
    .address_container{
      &.empty-page{
        margin-top: 2.5rem;
      }
      padding: .2rem .3rem 1rem;
      .address-item{
        background: #fff;
        box-shadow: 0px .04rem .16rem -.04rem rgba(125,155,250,0.1);
        border-radius: .2rem;
        margin-bottom: .2rem;
        /deep/ .vux-swipeout{
          border-radius: .2rem;
        }
        .item{
          padding: .48rem .5rem;
          border-radius: .2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .main{
            padding-right: .1rem;
            flex: 1;
          }
          .remain{
            width: 2rem;
            text-align: right;
          }
          .buttonGroup{
            span{
              margin-left: .3rem;
              &:active{
                opacity: .8;
              }
            }
          }
        }
      }
    }
    
  }



.addNewWrap{
  .addNewWrapIn{
      padding: 0.3rem;
      background: @background-color;
  }
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  &.noPadding{
      padding: 0;
  }
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
  .plus {
    display: inline-block;
    height: .88rem;
    line-height: .88rem;
    font-size: .46rem;
    margin-right: .1rem;
    margin-top: -0.1rem;
  }
}

</style>
