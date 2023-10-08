<template>

  <div class="editDetail">      
    <div class="showReceiptList" :class="{isAssist: isAssist}">
      <div v-if="isLoading" class="loading-container">
        <snLoading tip='数据加载中...' :spinning="true" :turn="true"/>
      </div>
      <EmptyX v-else-if='receiptList.length == 0 && !isLoading' tipsText='暂无发票抬头' />
      <div v-else class="receiptList" v-for='(item, index) in receiptList' :key="index">
        <swipeout>
          <swipeout-item :ref='"swipeoutItem"+index' @on-open="handleSwipeoutOpen(index)"  @on-close="openedIndex = -1" :disabled='isPC' :class="{openedClass:index==openedIndex}">
            <div slot="right-menu">
              <swipeout-button v-if='!item.defaultFlag' class="cursorp default_swipe" @click.native="editItem(index,'default')" background-color="#262DD9">设为默认</swipeout-button>
              <!-- 设为默认的置灰 -->
              <swipeout-button v-else class="cursorp default_swipe" background-color="#d3d3d3">设为默认</swipeout-button>
              <swipeout-button class="cursorp delete_swipe" @click.native="deleteCompany(index)" background-color="#FF4E3A">删除</swipeout-button>
            </div>

            <div slot="content" class='main cursorp' @click="chooseItem(index)">
              <div v-if='showCheck' class="checker cursorp">
                <icon :type="item.checked?'btn_common_checkbox_sel':'btn_common_checkbox_nor'" size='.4' />
              </div>
              <div class="detail">
                <div class='list'>
                  <div class="item">
                    <div class='content'>
                      <i class="can-select">{{item.name}}</i>   
                      <icon v-if='item.defaultFlag' type="icon_bill_default" size='.6' />                    
                    </div>

                    <div class="buttonGroup cursorp" v-if='isPC' @click=stopProp>
                      <span @click='editItem(index,"cpy")'>编辑</span>
                      <span @click='deleteCompany(index)'>删除</span>
                      <span v-if='!item.defaultFlag' @click="editItem(index,'default')">设为默认</span>
                      <span v-else class="disable">设为默认</span>
                    </div>

                    <div class="edit" v-else>
                      <div>
                        <icon @click.native.stop="editItem(index, 'cpy')" type="icon_common_edit" size='.28' />
                      </div>
                    </div>
                  </div>
                  <div class="item tax-info cursorp" v-if="item.tax">
                    <div class='tax-info-title'>税号：</div>
                    <div class='tax-info-content can-select'>{{item.tax}}</div>
                  </div>
                </div>
              </div>
            </div>
          </swipeout-item>
        </swipeout>
      </div>
    </div>

    <!-- 显示发票抬头详情dom -->
    <div v-transfer-dom>
      <popup v-model="showInvoiceDom" height="100%" width="100%" position="bottom" class="popBox" :hide-on-blur="true"
          style='z-index: 520;' :show-mask="true">
          <div class="invoiceDetail">
            <div class="invoiceCard">
                <div class="table canSelect">
                <div class="cell titleCell">
                    <div class="title">
                      <span class="can-select">
                          {{addTaxContent.name}}
                      </span>
                      <icon v-if='addTaxContent.defaultFlag' type="icon_bill_default" size='.6' />                    
                    </div>
                </div>
                <div v-if="chooseCompanyType" class="cell">
                    <div class="tableLine">
                    <div class="name">税号</div>
                    <div class="content">
                        <p class="can-select"> {{addTaxContent.tax}}</p>
                    </div>
                    </div>
                    <div class="tableLine">
                    <div class="name">公司地址</div>
                    <div class="content can-select">{{addTaxContent.address}}</div>
                    </div>
                    <div class="tableLine">
                    <div class="name">电话号码</div>
                    <div class="content can-select">{{addTaxContent.phone}}</div>
                    </div>
                    <div class="tableLine">
                    <div class="name">开户银行</div>
                    <div class="content can-select">{{addTaxContent.bank}}</div>
                    </div>
                    <div class="tableLine">
                    <div class="name">银行账号</div>
                    <div class="content can-select">{{addTaxContent.account}}</div>
                    </div>
                </div>
                </div>
            </div>
            <div class="cell buttonGroup">
                <div class="button cursorp del" @click="deleteCompany(index4Del)">删除</div>
                <div class="button cursorp edit" @click="editItem(index4Del,'cpy')">编辑</div>
            </div>
            
          </div>
      </popup>
    </div>  


    <!-- 新增和编辑企业发票抬头的弹窗 -->
    <div v-transfer-dom>
      <popup  v-model="showAddInvoice" height="100%" width="100%" position="bottom" class="popBox addEditWrap pcDialog" :hide-on-blur="true"
          style='background: #F6F9FD; z-index: 990;' :show-mask="false">
         <template v-if="showAddInvoice">
          <div class="addEdit">
            <div class="option line-border">
              <div class="label">
                发票类型
              </div>
              <div class="right_part">
                <div class="cursorp" @click='chooseCompanyType=!chooseCompanyType'>
                  <icon :type="chooseCompanyType?'btn_common_radio_sel':'btn_common_radio_nor'" size='.36' />   
                  <span>企业</span>
                </div>
                <div class="cursorp" @click='chooseCompanyType=!chooseCompanyType'>
                  <icon :type="!chooseCompanyType?'btn_common_radio_sel':'btn_common_radio_nor'" size='.36' />
                  <span>个人及政府事业单位</span>
                </div>
              </div>
            </div>

            <!-- 发票抬头 -->
            <div class="line_item">
              <div class="left_title hasStar">发票抬头</div>
              <div class="right_content">
                <SnTextarea type="text" maxlength="49" v-model="addTaxContent.name"  placeholder="请输入抬头名称" />
              </div>
            </div>

            <template v-if="chooseCompanyType">

              <div class="line_item no_border">
                <div class="left_title hasStar">税号</div>
                <div class="right_content">
                  <SnTextarea type="text" maxlength="20" @blur="trimFun(addTaxContent.tax, 'tax')" v-model="addTaxContent.tax"  placeholder="请输入纳税人识别号"/>
                </div>
              </div>

              <div class="line_division"></div>

              <!-- <x-textarea class="line-border" title="公司地址"
                  :max="39"
                  v-model="addTaxContent.address"
                  label-width="2rem" 
                  :autosize='true'
                  :rows="2"
                  placeholder="请输入公司地址"  
                  :show-counter="false" 
                  :show-clear="false"
                >
              </x-textarea> -->
              
              <!-- 公司地址 -->
              <div class="line_item">
                <div class="left_title">公司地址</div>
                <div class="right_content">
                  <SnTextarea type="text" @blur="trimFun(addTaxContent.address, 'address')" maxlength="39" v-model="addTaxContent.address"  placeholder="请输入公司地址"/>
                </div>
              </div>

              <!-- 电话号码 -->
              <div class="line_item">
                <div class="left_title">电话号码</div>
                <div class="right_content">
                  <SnTextarea type="text" @blur="trimFun(addTaxContent.phone, 'phone')" maxlength="19" v-model="addTaxContent.phone"  placeholder="请输入电话号码"/>
                </div>
              </div>

              <!-- 开户银行 -->
              <div class="line_item">
                <div class="left_title">开户银行</div>
                <div class="right_content">
                  <SnTextarea type="text" maxlength="30" v-model="addTaxContent.bank"  placeholder="请输入开户银行"/>
                </div>
              </div>

              <!-- 银行账号 -->
              <div class="line_item no_border">
                <div class="left_title">银行账号</div>
                <div class="right_content">
                  <SnTextarea type="text" @blur="trimFun(addTaxContent.account, 'account')" maxlength="30" v-model="addTaxContent.account"  placeholder="请输入银行账号"/>
                </div>
              </div>
              
            </template>

            <div class="line_division"></div>    
            <div class="setDefault">
              <SnListItem title="设为默认" :border="false">
                <SnSwitch slot="right-icon" v-model="addTaxContent.defaultFlag" />
              </SnListItem>
            </div>
          
          </div>
          <div class='save cursorp' v-if='showAddInvoice' @click.stop='save'>保存</div>
         </template>
      </popup>
    </div>
    <div class="addNewWrap" :class="{singleBtn: !isBizMate()}">
      <div v-if="isBizMate() && showImportBtn" class="import" @click="gotoImportInvoice">
        导入企业发票抬头
      </div>   
      <div class='addNew' @click='showReceipt' :class="{importBtn:!showImportBtn}">
        新增发票抬头
      </div>
        
    </div>
  </div>
</template>
<script>
import snLoading from "components/loading/index";
import EmptyX from "components/empty/EmptyX.vue";
import icon from "components/icon/index";
import invoiceCompHandler from './js/invoiceCompHandler.js';
import {
    Popup,
    Swipeout,
    SwipeoutItem,
    SwipeoutButton,
    TransferDom
} from 'vux';
import {SnListItem, SnSwitch,SnTextarea} from "sinosun-ui";
let titleType = 'add'
export default {
    name:'swp-invoice-card',
    directives: {
        TransferDom
    },
    props: {
        showCheck: {
            type: Boolean,
            default: true
        },
        isAssist: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        },
        value:{
            type: Object,
            default: ()=>{}
        }
    },
    components: {
        Popup,
        EmptyX,
        snLoading,
        Swipeout,
        SwipeoutItem,
        SwipeoutButton,
        icon,
        SnListItem,
        SnSwitch,
        SnTextarea
    },
    data: function () {
        // let that = this
        let managerData = this.setData();
        let data = {
            numOrChar: function (obj) {
                var re = /^[A-Z0-9]{6,20}$/; //判断字符串是否为数字 //判断正整数 /^[1-9]+[0-9]*]*$/ 
                // let that = this
                return {
                    valid: re.test(obj),
                    msg: '税号必须是由数字或大写英文字母组成'
                };
            },
            isPC: invoiceCompHandler.isPC(),
            index4Edit: -1, //用于发票编辑索引 -1代表新增 非-1代表编辑
            index4Del: -1, //用于发票删除索引
            addTaxContent: {
                name: '',
                tax: '',
                address: '',
                phone: '',
                bank: '',
                account: '',
                defaultFlag: false
            },
            receiptList: [],
            chooseCompanyType: true,
            isLoading: true,
            importInvoiceUrl:'',
            openedIndex: -1 //用于判断当前滑动状态
        }
        data = Object.assign(managerData, data)
        return data
    },
    created: function () {
        this.initImportInvoiceUrl();

    },
    activated(){},
    beforeRouteLeave () {
        // const that = this;
    },
    computed:{
        showImportBtn(){
            return !!this.importInvoiceUrl;
        }
    },
    mounted: function () {
        const that = this;
        that.getListData()
    },
    watch: {
        showAddInvoice() {
            // !!val && invoiceCompHandler.toggleReturnBtn(val);    
        },
        showInvoiceDom() {
            // !!val && invoiceCompHandler.toggleReturnBtn(val); 
        }
    },
    methods: {
        //判断是否是伴正事，是伴正事的才有导入发票的功能
        isBizMate(){
            return !!(invoiceCompHandler.getBizMateVersion()) || !!this.isPC;
        },
        //判断发票抬头决定是否显示导入按钮
        async initImportInvoiceUrl(){
            this.importInvoiceUrl = await this.getImportInvoiceUrl();
            this.$emit('showImportInvoiceFun', !!this.importInvoiceUrl) //获取企业发票抬头地址后，需要将是否显示导入发票抬头按钮的变量抛出来。
        },
        setData(){
            let that = this;
            return invoiceCompHandler.stateManager.setData([
                {
                    name: 'showInvoiceDom',
                    parent: '$refs.invoiceCard',
                    show: {
                        title: '发票抬头'
                    },
                    hide: {
                        callback: function () {
                            document.title = that.title ? that.title : '发票抬头'
                        }
                    }
                },
                {
                    name: 'showAddInvoice',
                    parent: '$refs.invoiceCard',
                    show: {
                        callback: function () {
                            if (titleType === 'add') {
                                document.title = '新增发票抬头'
                            } else {
                                document.title = '编辑'
                            }
                        }
                    },
                    hide: {
                        callback: function () {
                            //解决部分ios键盘弹起后，当关闭弹窗时，ios键盘没有收起的问题
                            let blurArr = ['input', 'textarea'];
                            for (let i = 0; i < blurArr.length; i++){
                                let domList = document.getElementsByTagName(blurArr[i]);
                                for (let index = 0; index < domList.length; index++) {
                                    const element = domList[index];
                                    element.blur()
                                }
                            }
                            document.title = that.title ? that.title : '发票抬头'
                        }
                    }
                }
            ])
        },
     
        //处理s实现一个swiperout打开其他的会关闭
        /*
      @chooseIndex被操作的swipe
      */
        handleSwipeoutOpen(chooseIndex) {
            const that = this;
            that.openedIndex = chooseIndex;
            if (chooseIndex > -1) {
                that.receiptList.forEach((val, index) => {
                    if (index != chooseIndex && that.$refs['swipeoutItem' + index][0].isOpen == true) {
                        that.$refs['swipeoutItem' + index][0].close();
                    }
                })
            }
        },
        //阻止冒泡导致滑动出发点击
        stopProp(event) {
            // const that = this;
            event.stopPropagation();
            event.preventDefault();
        },

        /**
       * 获取运维平台配置的伴正事企业发票抬头地址url
       */
        getImportInvoiceUrl(){
            return new Promise((resolve) => {
                invoiceCompHandler.getChannelInfo({channelId: invoiceCompHandler.channelId}).then(res => {
                    if (res.resultCode == 0 && !!res.result && !!res.result.companyInvoiceTitleUrl){
                        resolve(res.result.companyInvoiceTitleUrl || '');
                    } else {
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
                if (!!url && url.startsWith('http')){
                    let appId = invoiceCompHandler.ENTERPRISE_INVOICE_APPID;
                    let param = {
                        appId,
                        url: `${url}?uniqueId=jumpToImportInvoice&chooseType=${chooseType}&ids=${JSON.stringify(ids)}`
                    }
                    let data = await sinosdk.sino.openApplet(param);
                    // console.log('data', data)
                    if (data.ret == 0){
                        let responseData = JSON.parse(data.responseData || '{}');
                        let list = responseData.data;
                        let isExist = !!list && await that.checkTitleExists(list);
                        let flag;
                        if (!!isExist){ //此时说明当前发票抬头已存在，需要弹窗提示
                            invoiceCompHandler.showConfirm( '当前发票抬头已存在，您要替换它吗？', async function(){
                                flag = !!list && await that.saveInvoice(list, chooseType);
                            }, 2, '取消', '确定', null, null, true);
                        } else {
                            flag = !!list && await that.saveInvoice(list, chooseType);
                        }
                        return flag;
                    // eslint-disable-next-line
                    } else {
                        console.log('openAppletFunction,app响应格式错误')
                    }
                } else {
                    invoiceCompHandler.showToast('该企业下暂无企业发票抬头')
                }
            } catch (error) {
                console.log(error);
                invoiceCompHandler.showToast('获取导入企业发票抬头的地址失败')
            }
        },

        /****
       * 导入发票的时候校验，发票抬头是否已经存在，如果存在弹窗展示，如果不存在，则直接导入
       */
        checkTitleExists(list){
            return new Promise((resolve) => {
                if (!!!list || list.length<=0){ resolve(false) }
                let requests = list.map(item=>{
                    return {
                        userId: invoiceCompHandler.userId,
                        companyId: invoiceCompHandler.companyId,
                        channelId: invoiceCompHandler.channelId,
                        type: 2, //此处添加的都是企业发票抬头企业
                        name: item.name,
                        tax: item.tax,
                        address: item.address,
                        phone: item.phone,
                        account: item.account,
                        bank: item.bank,
                        defaultFlag: false //默认均为false
                    }
                })
                let param = {
                    userId: invoiceCompHandler.userId,
                    companyId: invoiceCompHandler.companyId,
                    channelId: invoiceCompHandler.channelId,
                    requests: requests
                }
                this.isLoading = true;
                invoiceCompHandler.checkTitleExists(param).then(async res => {
                    this.isLoading = false;
                    if (res.resultCode == 0){
                        resolve(res.result);
                    } else {
                        resolve(false);
                    }
                }).catch(e=>{
                    this.isLoading = false;
                    resolve(false);
                    console.log(e)
                })
            })
        },

        //将导入的企业发票抬头相关数据保存到个人的发票列表 此处均为新增
        saveInvoice(list, chooseType){
            const that = this;
            return new Promise((resolve) => {
                if (!!!list || list.length<=0){ resolve(false) } 
                let requests = list.map(item=>{
                    return {
                        userId: invoiceCompHandler.userId,
                        companyId: invoiceCompHandler.companyId,
                        channelId: invoiceCompHandler.channelId,
                        type: 2, //此处添加的都是企业发票抬头企业
                        name: item.name.substring(0, 49),
                        tax: item.tax.substring(0, 20),
                        address: item.address.substring(0, 39),
                        phone: item.phone.substring(0, 19),
                        account: item.account.substring(0, 30),
                        bank: item.bank.substring(0, 30),
                        defaultFlag: false //默认均为false
                    }
                })
                let param = {
                    userId: invoiceCompHandler.userId,
                    companyId: invoiceCompHandler.companyId,
                    channelId: invoiceCompHandler.channelId,
                    requests: requests 
                }
                this.isLoading = true;
                invoiceCompHandler.addInvoiceInfos(param).then(async res => {
                    this.isLoading = false;
                    if (res.resultCode == 0){
                        invoiceCompHandler.showToast('导入成功');
                        resolve(true);
                        this.receiptList = await this.getInvoiceList('import'); //获取发票助手的列表
                        if (!!chooseType && chooseType == 'single'){ //如果是单选的话，默认把当前导入的项emit出去，并选中
                            let item = list[0];
                            this.receiptList = this.receiptList.map(temp => {
                                that.$set(temp, 'checked', false);
                                if (temp.name == item.name && temp.tax == item.tax){
                                    that.$set(temp, 'checked', true);
                                    that.$emit('input', temp);
                                }
                                return temp;
                            });
                        }
                        
                    } else {
                        resolve(false);
                        invoiceCompHandler.showToast('导入失败');
                    }
                }).catch(e=>{
                    this.isLoading = false;
                    resolve(false);
                    console.log(e)
                })
            })
            
        },

        showReceipt() {
            const that = this;
            that.index4Del = '-1';
            titleType = 'add'
            that.showAddInvoice = true;
            that.chooseCompanyType = true;
            that.addTaxContent.tax = '';
            that.addTaxContent.account = '';
            that.addTaxContent.phone = '';
            that.addTaxContent.address = '';
            that.addTaxContent.bank = '';
            that.addTaxContent.defaultFlag = false;
            that.index4Edit = -1;
            that.addTaxContent.name = '';
        },
        clearObj(obj) {
            for (let item in obj) {
                obj[item] = ''
            }
            return obj;
        },
        editItem(index, type, isCheckDetail) {
            const that = this;
            that.chooseCompanyType = that.receiptList[index].type == 2;
            that.addTaxContent.name = that.receiptList[index].name;
            that.addTaxContent.tax = that.receiptList[index].tax;
            that.addTaxContent.account = that.receiptList[index].account;
            that.addTaxContent.phone = that.receiptList[index].phone;
            that.addTaxContent.address = that.receiptList[index].address;
            that.addTaxContent.bank = that.receiptList[index].bank;
            that.addTaxContent.defaultFlag = that.receiptList[index].defaultFlag;        
            that.index4Edit = that.receiptList[index].titleId;
            that.index4Del = index;
            if (type == 'cpy') {
                if (that.chooseCompanyType) {
                    if (isCheckDetail) {
                        that.showInvoiceDom = true;
                        document.title = '发票抬头';
                    } else {
                        document.title = '编辑';
                        titleType = 'edit'
                        that.showAddInvoice = true;       
                    }
                
                } else {
                    // eslint-disable-next-line
                    if (isCheckDetail) {
                        that.showInvoiceDom = true;
                        document.title = '发票抬头';
                    } else {
                        document.title = '编辑';
                        titleType = 'edit'
                        that.showAddInvoice = true;
                    }
                }
            } else {
                that.addTaxContent.defaultFlag = true;
                that.saveCompany();
            }

        },
        chooseItem(index) {
            const that = this;
            that.receiptList.forEach(val => {
                val.checked = false;
            });
            that.receiptList[index].checked = true;
            if (!that.showCheck) {
                that.editItem(index, 'cpy', true);
            } else {
                that.$emit('input', that.receiptList[index]);
                this.$emit('closeInvoiceList');
            }
        },


        deleteCompany(index) {
            let that = this;
            invoiceCompHandler.showConfirm( '确定删除该条发票抬头？', function(){
                that.doDel(index);
            }, 2, '取消', '确定', null, null, true);
        },

        /****
       * input oninput的时候自动去掉输入或者粘贴的空格
       */
        trimFun(newVal, type){
            this.$set(this.addTaxContent, type, this.strTrim(newVal));
        },

        /**
       * 删除发票抬头
       */
        doDel(index) {
            const that = this;
            let type = "deleteInvoiceInfo";
            let obj = Object.assign({}, {
                titleIds: [that.receiptList[index].titleId]
            }) 
            invoiceCompHandler[type](obj).then((res) => {
                if (res.resultCode == '0') {
                    invoiceCompHandler.showToast('删除发票抬头成功');
                    that.index4Del = -1;
                    that.showInvoiceDom = false;
                    that.showAddInvoice = false;
                    that.getListData();
                } else {
                    invoiceCompHandler.showToast('删除发票抬头失败');
                }
            }).catch((err) => {
                invoiceCompHandler.showToast('删除发票抬头失败');
                console.log(err);
            });
        },


        /**
       * where来自哪里调用
       */
        async getListData() {
            const that = this;
            // let obj = {};
            that.isLoading = true;
            let datalist = await that.getInvoiceList(); 
            that.isLoading = false;          
            //列表加载完毕，发消息通知骨架图关闭
            that.$emit('showOff', true);
            that.receiptList = datalist.map((val) => {
                val.checked = false;
                if (val.defaultFlag) {
                    val.checked = true;
                    if (that.showCheck){
                        that.$emit('input', val);
                    }
                }
                return val
            });

            let index = this.receiptList.findIndex(item => {
                return !!item.checked;
            })
    
            if (index == -1 && that.receiptList.length > 0){ //都为false的话，默认emit出第一个，同时将第一个的checked属性值更正为 true
                that.checkFirstItem();
            }        
        },
      
        /**
       * 获取发票列表的数据 
       */
        getInvoiceList(type){
            const that = this;
            let param = {
                userId: invoiceCompHandler.userId,
                companyId: invoiceCompHandler.companyId,
                channelId: invoiceCompHandler.channelId
            }
            return new Promise((resolve) => {
                invoiceCompHandler.getInvoiceInfo(param).then(res => {
                    if (res.resultCode == 0 && !!res.result && res.result.content && res.result.content.length >= 0){
                        let list = res.result.content;
                        if (type && type == 'import' && that.showCheck){ //如果是导入发票处，并且有选发票功能的话，此时需要新增checked字段
                            list = list.map((item, index) => {
                                index == 0 && that.$emit('input', item);
                                return {
                                    ...item,
                                    checked: index == 0 ? true : false
                                }
                            })
                        }
                        resolve(list);
                    } else {
                        resolve([]);
                    }
                }).catch(e=>{ 
                    resolve([]);
                    console.log(e);
                })
            })
        },

        //默认选中列表的第一个
        checkFirstItem(){
            const that = this;
            this.$emit('input', this.receiptList[0]);
            this.receiptList.forEach((temp) => { this.$set(temp, 'checked', false) })
            that.$set(this.receiptList, 0, {
                ...this.receiptList[0],
                checked: true
            });
        },

        //去除字符串内所有的空格
        strTrim(str){
            if (!str){
                return str
            }
            return str.replace(/\s*/g,"");
        },

        save () {
            invoiceCompHandler.throttle(this.saveCompany, this)
        },
        saveCompany() {
            const that = this;
          
            if (that.chooseCompanyType) {
                let reg = /^[0-9A-Z]{6,20}$/;
                let telReg = /^[0-9- ]{1,19}$/;
                let countReg = /^[0-9 ]{1,30}$/;

                //此代码块代表企业 都要验证必填
                
                if (!that.strTrim(that.addTaxContent.name)){
                    invoiceCompHandler.showToast('请输入发票抬头');
                    return;
                }
                if (!that.strTrim(that.addTaxContent.tax)){
                    invoiceCompHandler.showToast('请输入纳税人识别号');
                    return;
                }
                if (!reg.test(that.addTaxContent.tax)){
                    invoiceCompHandler.showToast('税号至少6位，必须是由数字或大写字母和数字组成');
                    return;
                }
   
                //电话号码如果填写，必须验证格式
                if (that.strTrim(that.addTaxContent.phone)){
                    if (!telReg.test(that.addTaxContent.phone)){
                        invoiceCompHandler.showToast('电话号码格式错误');
                        return;
                    }
                }
                //银行账号号码如果填写，必须验证格式
                if (that.strTrim(that.addTaxContent.account)){
                    if (!countReg.test(that.addTaxContent.account)){
                        invoiceCompHandler.showToast('银行账号格式错误');
                        return;
                    }
                }
            }
            //此代码块代表个人及政府事业单位
            if (!that.strTrim(that.addTaxContent.name)){
                invoiceCompHandler.showToast('请输入发票抬头');
                return;
            }
            if (that.index4Edit != -1) {
                //修改
                let type = "modifyInvoiceInfo";
                let obj = {};
                if (that.chooseCompanyType) {
                    obj= {
                        titleId: that.index4Edit,
                        type: 2,
                        name: that.addTaxContent.name,
                        tax: that.addTaxContent.tax,
                        address: that.addTaxContent.address,
                        phone: that.strTrim(that.addTaxContent.phone), //电话号码保存和编辑的时候要去除空格,
                        bank: that.addTaxContent.bank,
                        account: that.strTrim(that.addTaxContent.account), //银行账号保存和编辑的时候要去除空格
                        defaultFlag: that.addTaxContent.defaultFlag
                    };
                } else {
                    obj = {
                        titleId: that.index4Edit,
                        type: 1,
                        name: that.addTaxContent.name,
                        defaultFlag: that.addTaxContent.defaultFlag
                    }
                }
              
                invoiceCompHandler[type](obj).then((res) => {
                    if (res.resultCode == '0') {
                        invoiceCompHandler.showToast('修改抬头成功');
                        that.showAddInvoice = false;
                        that.getListData();
                    } else {
                        invoiceCompHandler.showToast('修改抬头失败');
                    }
                }).catch((err) => {
                    console.log(err);
                });   
            } else { //新增
                let type = "addInvoiceInfos";
                let obj = {};
                if (that.chooseCompanyType) {
                    obj = {
                        type: 2,
                        name: that.addTaxContent.name,
                        tax: that.addTaxContent.tax,
                        address: that.addTaxContent.address,
                        phone: that.strTrim(that.addTaxContent.phone),//电话号码保存和编辑的时候要去除空格
                        bank: that.addTaxContent.bank,
                        account: that.strTrim(that.addTaxContent.account), //银行账号保存和编辑的时候要去除空格
                        defaultFlag: that.addTaxContent.defaultFlag
                    }
                } else {
                    obj = {
                        type: 1,
                        name: that.addTaxContent.name,
                        defaultFlag: that.addTaxContent.defaultFlag
                    }
                }
                obj = Object.assign({}, obj, {
                    userId: invoiceCompHandler.userId,
                    companyId: invoiceCompHandler.companyId,
                    channelId: invoiceCompHandler.channelId
                })
                let param = {
                    userId: invoiceCompHandler.userId,
                    companyId: invoiceCompHandler.companyId,
                    channelId: invoiceCompHandler.channelId,
                    requests: [obj]
                }
              
                invoiceCompHandler[type](param).then((res) => {
                    if (res.resultCode == '0') {
                        invoiceCompHandler.showToast('保存成功');
                        that.showAddInvoice = false;
                        that.addTaxContent = that.clearObj(that.addTaxContent);
                        that.getListData();
                    } else {
                        invoiceCompHandler.showToast('保存失败');
                    }
                }).catch((err) => {
                    console.log(err);
                });
            }
        }
    }
}

</script>
<style scoped lang="less">
@import '~themes/default/styles/invoiceCard.less';
</style>
<style lang="less">
  @import '~themes/default/styles/common/index.less';
  @import '~styles/mixins/mixinsStyle.less';
  input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
    color: @placeholder-color;
  }

  input:-moz-placeholder, textarea:-moz-placeholder {
    color: @placeholder-color;
  }

  input::-moz-placeholder, textarea::-moz-placeholder {
    color: @placeholder-color;
  }

  input:-ms-input-placeholder, textarea:-ms-input-placeholder {
    color: @placeholder-color;
  }

  textarea:disabled {
    background: #ffffff;
    color: #999;
  }

  textarea {
    text-align: end;
    color: #999;
  }


  .addEdit .weui-textarea {
    text-align: left;
  }

  .addEdit .weui-textarea[disabled] {
    opacity: .5 !important;
  }

  .showReceiptList {
    .vux-swipeout-button-box {
      padding-right: 1px;
    }
    /deep/ .emptyCompWrap{
      margin-top: 2rem;
    }
  }

  /*
     处理IOS会有红线的情况
    */
  .vux-swipeout-button {
    height: 96% !important;
    margin-top: 2px;
    margin-bottom: 2px;
  }
</style>

