<template>
  <div class="invoice-assist">
      
    <!-- 抬头标题插槽slot部分 -->
    <slot name="title"></slot>

    <!-- 抬头列表部分 -->
    <div class="invoice-list">
        <mescrollVue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
            <div id="invoiceAssist" class="showReceiptList">
                <div class="receiptList" v-for='(item, index) in invoiceList' :key="index">
                    <swipeout>

                        <swipeout-item :disabled='isPC' :sensitivity="10" :ref='"swipeoutItem" + index' :class="{openedClass: index==openedIndex}" @on-open="handleSwipeoutOpen(index)" @on-close="openedIndex = -1" >

                            <!-- 移动端展示的操作按钮部分 -->
                            <div slot="right-menu">
                                <swipeout-button @click.native.stop="editDefault(item, index)" v-if="!item.defaultFlag" class="default_swipe">
                                    <p><Icon type='icon_moren' size=".4"/></p>
                                    <span>设为默认</span>
                                </swipeout-button>
                                <swipeout-button @click.native.stop="deleteItem(item, index)" class="delete_swipe">
                                    <p><Icon type='icon_mall_delete2' size=".4"/></p>
                                    <span>删除</span>
                                </swipeout-button>
                            </div>

                            <!-- 主体内容 -->
                            <div @click="chooseItem(item, index)" slot="content" class="detail">
                                <div v-if="showCheck" class="checker cursorp">
                                    <Icon :type="item.checked ? 'icon_mall_checkbox_sel' : 'icon_mall_checkbox_nor'" size=".44"/>
                                </div>

                                <div class='list'>
                                    <div class="item">
                                        <div class="main" :class="{noPC: !isPC}">
                                            <symbolComp v-if='item.type == 2' symbol="公司" class='symbol-company'></symbolComp>
                                            <symbolComp v-if='item.defaultFlag' symbol="默认" class='symbol-default'></symbolComp>
                                            <span class='title cursorp can-select' :class="{noDefaultAndNoCompany: !item.defaultFlag && item.type == 1}">{{item.name}}</span>
                                        </div>

                                        <!-- pc端展示的操作按钮部分 -->
                                        <div class="buttonGroup cursorp" v-if='isPC'>
                                            <span @click.stop="editItem(item, index)">编辑</span>
                                            <span @click.stop="deleteItem(item, index)">删除</span>
                                            <span @click.stop="editDefault(item, index)" v-if='!item.defaultFlag'>设为默认</span>
                                            <span v-else class="disable">默认地址</span>
                                        </div>

                                        <div @click.stop="editItem(item, index)" class="edit" v-else>
                                            <Icon type="btn_common_edit" size=".3"/>
                                        </div>
                                    </div>

                                    <div v-if="item.type == 2" class="item tax-box cursorp">
                                        <span class="tax">税号：<span class="can-select">{{item.tax}}</span></span>
                                    </div>

                                </div>
                            </div>
                        </swipeout-item>
                    </swipeout>
                </div>
            </div>
        </mescrollVue>
    </div>

    <!-- 底部的新增发票抬头的按钮 -->
    <div v-if="isShowBtn" class="invoice-btn fixed-dom-part">
        <div class="import" @click="gotoImportInvoice"  v-if="!!isImportInvoiceBtn">
            导入企业发票抬头
        </div>
        <div class='addNew' :class="{'radius':!isImportInvoiceBtn}" @click="showAddInvoiceFun">
            新增发票抬头
        </div>
    </div>
    


    <!-- 新增和编辑地址管理的弹窗页面 -->
    <div v-transfer-dom>
        <popup v-model="showAddInvoice" :height="isAllScreen?'100%':'72%'" width="100%" class="editInvoice" :popup-style="{zIndex: 1560, background:'#F6F9FD'}">
            <editComp
                :editObj="editObj"
                @closeEditPop="closeEditPop"
            ></editComp>
        </popup>
    </div>
  
  </div>
</template>
<script>
  import editComp from './baseComp/edit';
  import Icon from 'common/components/base/Icon';
  import symbolComp from 'common/components/base/symbol';
  import mescrollMixin from 'common/lib/mixin/mescrollMixin'
  import invoiceHandler from 'common/lib/requestHandler/invoiceHandler.js';
  import extendUtils from 'common/lib/utils';
  import { SnIcon, SnModal } from "sinosun-ui";
  import {
    TransferDom,
    Popup,
    Swipeout,
    SwipeoutItem,
    SwipeoutButton
  } from 'vux';

  export default {
    name:'invoice-assist',
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
      isAllScreen: { //是否全屏显示弹窗
        type: Boolean,
        default: true
      },     
      usePlace: { //该组件用到的地方
        type: String,
        default: 'default'
      },     
    },
    computed:{
        //用来控制企业发票抬头按钮的显隐
        isImportInvoiceBtn(){
            return !!this.importInvoiceUrl;
        }
    },
    components: {
      Swipeout,
      SwipeoutItem,
      SwipeoutButton,
      Popup,
      SnIcon,
      Icon,
      symbolComp,
      editComp,
      SnModal,
    },
    data: function () {
        let that = this;
        let title = document.title;
        let managerData = extendUtils.stateManager.setData([
            {
                name: 'showAddInvoice',
                parent: '$refs.invoiceComp',
                show: {
                    callback: function () { 
                        document.title = !that.isAllScreen ? title : (that.titleType == 'add' ? '新增发票抬头' : '编辑发票抬头') //变更页面的title
                        !!that.titleType && that.$emit('changeTitle', that.titleType)  //变更弹窗的title 
                    }
                },
                hide: {
                    callback: function () {
                        if(that.usePlace == 'personal'){ //如果是个人中心的发票助手用到的该组件，页面弹窗关闭的时候，此时需要将tilte显示为发票助手
                            document.title = '发票助手'
                        }else{
                            document.title = !that.isAllScreen ? title : '发票抬头'  
                        }
                        that.$emit('changeTitle', 'choose')  
                    },
                }
            },
        ]);
        return Object.assign(managerData, {
            isPC: extendUtils.isPC(),
            invoiceList: [],
            mescrollUp: {
              htmlNodata: '', //不显示‘没有更多了’
              empty: {
                warpId: 'invoiceAssist'
              }
            },
            editObj:{},//新增和编辑的对象
            titleType: '', //用来区别是新增还是编辑的
            showMore: false,
            importInvoiceUrl:'', //配置的企业发票抬头的地址
            isShowBtn: false, 
            openedIndex: -1
        })
    },
    created: function () {
        this.initImportInvoiceUrl();
    },
    beforeDestroy () {},
    mounted: function () {},
    watch: {
        
    },
    methods: {

        /**
         * 初始化分页数据
         */
        initPages(){
            this.invoiceList = [];
            this.mescroll.resetUpScroll();
        },
        
        /****
         * 初始化导入企业发票抬头的地址url
         */
        async initImportInvoiceUrl(){
            this.isShowBtn = false;
            this.importInvoiceUrl = await this.getImportInvoiceUrl();
            this.$emit('showImportInvoiceFun', !!this.importInvoiceUrl) //获取企业发票抬头地址后，需要将是否显示导入发票抬头按钮的变量抛出来。
            this.isShowBtn = true;
        },

        /***
         * 处理s实现一个swiperout打开其他的会关闭
         * @param chooseIndex 被操作的swipe
         */
        handleSwipeoutOpen(chooseIndex) {
            const that = this;
            that.openedIndex = chooseIndex;
            if (chooseIndex > -1) {
                that.invoiceList.forEach((val, index) => {
                    if (index != chooseIndex && that.$refs['swipeoutItem' + index][0].isOpen == true) {
                        that.$refs['swipeoutItem' + index][0].close();
                    }
                })
            }


        },


        /***
         * 获取地址列表 getListData 
         * @param page 分页对象，由mescroll提供
         * @param mescroll mescroll对象
         */
        async getListData(page, mescroll) {
            const that = this;
            try{
                let data = await this.getInvoiceList();
                
                let list = data.content;
                this.invoiceList = list;
                
                
                this.invoiceList = this.invoiceList.map(item => {
                    if((!!that.value.titleId && that.value.titleId == item.titleId) || (!!that.value.name && that.value.name == item.name)){
                        that.$set(item, 'checked', true);
                        this.$emit('input', item);//编辑的时候把最新的选中的信息emit出去
                    }else{
                        that.$set(item, 'checked', false);
                    }
                    return item;
                })

                let index = this.invoiceList.findIndex(item => {
                    return !!item.checked;
                })
         
                if(index == -1 && that.invoiceList.length > 0 && Object.keys(that.value).length <= 0){ //都为false的话，默认emit出第一个，同时将第一个的checked属性值更正为 true
                    that.checkFirstItem();
                }else if(this.invoiceList.length <= 0 && !!that.value.name && !!that.value.titleId){ //如果外层已经选择的话，则emit空对象
                    this.$emit('input', {});
                }
                // console.log('that.invoiceList', that.invoiceList)

                mescroll.endSuccess(list.length, false);
                
                this.showAddInvoice = false; //关闭新增和编辑的弹窗
            }catch(e){
                console.error(e);
                mescroll.endErr();
            }
        },

        //默认选中列表的第一个
        checkFirstItem(){
            const that = this;
            this.$emit('input', this.invoiceList[0]);
            this.invoiceList.forEach((temp) => {this.$set(temp, 'checked', false)})
            that.$set(this.invoiceList, 0, {
                ...this.invoiceList[0],
                checked: true
            });
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
            this.initPages();
        },

        /**
         * 获取发票列表的数据 
         */
        getInvoiceList(){
            const that = this;
            let param = {
                userId: invoiceHandler.userId,
                companyId: invoiceHandler.companyId,
                channelId: invoiceHandler.channelId,
            }
            return new Promise((resolve, reject) => {
                invoiceHandler.getInvoiceList(param).then(res => {
                    if(res.resultCode == 0 && !!res.result){
                        resolve(res.result);
                    }else{
                        resolve([]);
                    }
                }).catch(e=>{ 
                    console.log(e);
                    resolve([]);
                })
            })
        },

        /** 
        * 编辑发票抬头
        */
        editItem(item, index){
            this.titleType = 'edit';
            this.editObj = JSON.parse(JSON.stringify(item));
            this.showAddInvoice = true;
            
        },

        /** 
         * 删除发票抬头确认弹窗
        */
        deleteItem(item, index){
            let that = this;
            SnModal({
                message: '确定删除该抬头？',
                showCancelButton: true,
            }).then(res => {
                that.deleteInvoiceFun(item);
            }).catch(rej => {
                console.log('rej === ', rej);
            });
        },

        /** 
         * 删除发票抬头调取API
        */
        deleteInvoiceFun(item){
            
            let param = {
                userId: invoiceHandler.userId,
                companyId: invoiceHandler.companyId,
                channelId: invoiceHandler.channelId,
                titleIds: [item.titleId]
            }   
            invoiceHandler.deleteInvoice(param).then(res=>{
                if(res.resultCode == 0){
                    this.initPages();
                }else{
                    extendUtils.showToast('删除失败');
                }
            }).catch(e=>{
                console.log(e);
            })
        },

         /***
         * 选中地址
         */
        chooseItem(item, index) {
            this.$emit('input', item);
            this.$emit('closeInvoiceList');
            this.invoiceList.forEach((temp, one) => {
                if(index == one){
                    this.$set(temp, 'checked', true)
                }else{
                    this.$set(temp, 'checked', false)
                }
            })
        },

        /** 
        * 显示新增或者编辑发票抬头的弹窗
        */
        showAddInvoiceFun(){
            this.titleType = 'add';
            this.showAddInvoice = true;
            //新增的话初始化相关的信息
            this.editObj = {
                type: 1,
                name: '',
                tax: '',
                phone: '',
                address: '',
                account:'',
                bank:'',
                defaultFlag: false
            }
        },

        /** 
        * 关闭新增或者编辑的弹窗
        */
        closeEditPop(type){
            if(!!type && type == 'init'){//重新拉取列表
                this.initPages(); //初始化下拉列表
            }
        },

        /** 
         *设为默认 
        */
        editDefault(item, index){
            let param = JSON.parse(JSON.stringify(item));
            param.defaultFlag = true;
            param = Object.assign({}, param, {
                userId: invoiceHandler.userId,
                companyId: invoiceHandler.companyId,
                channelId: invoiceHandler.channelId,
            })
            invoiceHandler.updateInvoice(param).then(res=>{
                if(res.resultCode == 0){
                    this.initPages();
                }else{
                    extendUtils.showToast('设为默认失败');
                }
            }).catch(e=>{
                console.log(e);
            })
        },

        /**
         * 获取运维平台配置的伴正事企业发票抬头地址url
         */
        getImportInvoiceUrl(){
            let that = this;
            return new Promise((resolve, rej) => {
                invoiceHandler.getImportInvoiceUrl({channelId: invoiceHandler.channelId}).then(res => {
                    if(res.resultCode == 0 && !!res.result && !!res.result.channelAccessConfigs && res.result.channelAccessConfigs.length > 0){
                        let channelAccessConfigs = res.result.channelAccessConfigs;
                        const key = 'companyInvoiceTitleUrl'; //该key为运营配置的时候定义的key，不能随便变更，运营如果变更，务必知会此处进行对应修改
                        let arr = channelAccessConfigs.filter(item => {
                            return item.configKey == key;
                        })
                        if(arr && arr.length > 0 && !!arr[0].configValue){
                           resolve(arr[0].configValue)
                        }else{
                           resolve(null);
                        }
                    }else{
                        resolve(null);
                    }
                }).catch(e => {
                    console.log(e);
                    resolve(null)
                })
            })     
        },


        /****
         * 跳转到伴正事的导入发票抬头的页面
         * @param chooseType single=单选 multi=多选 支持多选还是单选
         * @param ids demo: ids=['2321313','432424324'] 用来默认选中的功能
         */
        async gotoImportInvoice(chooseType='multi', ids=[]){   
            let that = this; 
            try {                
                let url = that.importInvoiceUrl;
                if(!!url && url.startsWith('http')){
                    let appId = this.BMallConfig.ENTERPRISE_INVOICE_APPID;
                    let param = {
                        appId,
                        url: `${url}?uniqueId=jumpToImportInvoice&chooseType=${chooseType}&ids=${JSON.stringify(ids)}`,
                    }
                    let data = await extendUtils.openApplet(param);
                    if(data.ret == 0){
                        let responseData = JSON.parse(data.responseData || '{}');
                        let list = responseData.data;
                        let isExist = !!list && await that.checkTitleExists(list);
                        let flag;
                        if(!!isExist){ //此时说明当前发票抬头已存在，需要弹窗提示
                            SnModal({
                                message: '当前发票抬头已存在，您要替换它吗？',
                                showCancelButton: true,
                            }).then(async res => {
                                flag = !!list && await that.saveInvoice(list, chooseType);
                            }).catch(rej => {
                                console.log('rej === ', rej);
                            });
                        }else{
                            flag = !!list && await that.saveInvoice(list, chooseType);
                        }
                        return flag;
                    }else{
                        console.log('openAppletFunction,app响应格式错误')
                    }
                }else{
                    extendUtils.showToast('该企业下暂无企业发票抬头')
                }
            } catch (error) {
                console.log(error);
                extendUtils.showToast('获取导入企业发票抬头的地址失败')
            }
        },

        /****
         * 导入发票的时候校验，发票抬头是否已经存在，如果存在弹窗展示，如果不存在，则直接导入
         */
        checkTitleExists(list){
            const that = this;
             return new Promise((resolve, reject) => {
                if(!!!list || list.length<=0){ resolve(false) };
                let requests = list.map(item=>{
                    return {
                        userId: invoiceHandler.userId,
                        companyId: invoiceHandler.companyId,
                        channelId: invoiceHandler.channelId,
                        type: 2, //此处添加的都是企业发票抬头企业
                        name: item.name,
                        tax: item.tax,
                        address: item.address,
                        phone: item.phone,
                        account: item.account,
                        bank: item.bank,
                        defaultFlag: false, //默认均为false
                    }
                })
                let param = {
                    userId: invoiceHandler.userId,
                    companyId: invoiceHandler.companyId,
                    channelId: invoiceHandler.channelId,
                    requests: requests,  
                }
                this.$loading.show();
                invoiceHandler.checkTitleExists(param).then(async res => {
                    this.$loading.hide();
                    if(res.resultCode == 0){
                        resolve(res.result);
                    }else{
                        resolve(false);
                    }
                }).catch(e=>{
                    this.$loading.hide();
                    resolve(false);
                    console.log(e)
                })
            })
        },

        //将导入的企业发票抬头相关数据保存到个人的发票列表 此处均为新增
        saveInvoice(list, chooseType){
            const that = this;
            return new Promise((resolve, reject) => {
                if(!!!list || list.length<=0){ resolve(false) };
                let requests = list.map(item=>{
                    return {
                        userId: invoiceHandler.userId,
                        companyId: invoiceHandler.companyId,
                        channelId: invoiceHandler.channelId,
                        type: 2, //此处添加的都是企业发票抬头企业
                        name: item.name.substring(0, 49),
                        tax: item.tax.substring(0, 20),
                        address: item.address.substring(0, 39),
                        phone: item.phone.substring(0, 19),
                        account: item.account.substring(0, 30),
                        bank: item.bank.substring(0, 30),
                        defaultFlag: false, //默认均为false
                    }
                })
                let param = {
                    userId: invoiceHandler.userId,
                    companyId: invoiceHandler.companyId,
                    channelId: invoiceHandler.channelId,
                    requests: requests,  
                }
                this.$loading.show();
                invoiceHandler.addInvoices(param).then(async res => {
                    this.$loading.hide();
                    if(res.resultCode == 0){
                        extendUtils.showToast('导入成功');
                        resolve(true);
                        if(!!chooseType && chooseType == 'single'){//如果是单选的话，默认把当前导入的项emit出去，并选中
                            let data = await this.getInvoiceList(); //获取发票助手的列表
                            this.invoiceList = data.content;
                            let item = list[0];
                            this.invoiceList = this.invoiceList.map(temp => {
                                that.$set(temp, 'checked', false);
                                if(temp.name == item.name && temp.tax == item.tax){
                                    that.$set(temp, 'checked', true);
                                    that.$emit('input', temp);
                                }
                                return temp;
                            });
                        }else{// 多选
                            that.initPages();
                        }
                    }else{
                        resolve(false);
                        extendUtils.showToast('导入失败');
                    }
                }).catch(e=>{
                    this.$loading.hide();
                    resolve(false);
                    console.log(e)
                })
            })
            
        },
    }
  }

</script>
<style scoped lang="less">
@import "./invoice.less";
</style>
<style lang='less'>
@import '~themes/default/styles/components/mescroll.less';
</style>
