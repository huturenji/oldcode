<template>
<view class="invoice_list" :class="!loading && invoiceList.length == 0?'invoice_list invoice_listempty':'invoice_list'">
        <w-loading ref="loading"></w-loading>
        <view v-if="!loading && invoiceList.length == 0" class="container_empty">
            <view class="empty">
                <view class="img"></view>
                <view class="empty_text">暂无数据</view>
            </view>
        </view>
        <view v-else class="container">
            <view v-if="!loading && invoiceList.length > 0" class="invoice_wrap">
                    <!-- <movable-area>
                        <movable-view direction="horizontal">
                                <view @click="chooseInvoice(item)" class="invoice_wrap_box" :class="{InvoiceShowChecked: showCheck}">
                                    <view v-if="showCheck" class="invoice_choose">
                                        <view v-if="checkSelect(item)" class="selected"></view>
                                        <img v-else :src="radioImage" > 
                                    </view>
                                    <view class="invoice_item">
                                        <view class="invoice_left">
                                            <view class="invoice_name">
                                                <text v-if="item.defaultFlag" class="icon_default">默认</text>
                                                <text class="name">{{item.name}}</text>
                                            </view>
                                            <view v-if="!!item.tax" class="invoice_tax">税号：{{item.tax}}</view>
                                        </view>
                                        <view @click.stop="editInvoice(item)" class="invoice_right">
                                            <text class="iconfont icon_edit"></text>
                                        </view>
                                    </view>  
                                </view>
                                <view class="rightBtn">
                                    <view v-if="!item.defaultFlag" @click.stop="setDefault(item)" class="slot-button setdefault_btn"><text class="slot-button-text">设为默认</text></view>
                                    <view @click.stop="deleteInvoice(item)" class="slot-button"><text class="slot-button-text">删除</text></view>
                                </view>

                        </movable-view>
                    </movable-area> -->

                <uni-swipe-action>
                    <view class="invoice_wrap_item" v-for="(item, index) in invoiceList" :key="index">
                        <uni-swipe-action-item>
                            <view @click="chooseInvoice(item)" class="invoice_wrap_box" :class="{InvoiceShowChecked: showCheck}">
                                <view v-if="showCheck" class="invoice_choose">
                                    <view v-if="checkSelect(item)" class="selected"></view>
                                    <img v-else :src="radioImage" > 
                                </view>
                                <view class="invoice_item">
                                    <view class="invoice_left">
                                        <view class="invoice_name">
                                            <text v-if="item.defaultFlag" class="icon_default">默认</text>
                                            <text class="name">{{item.name}}</text>
                                        </view>
                                        <view v-if="!!item.tax" class="invoice_tax">税号：{{item.tax}}</view>
                                    </view>
                                    <view @click.stop="editInvoice(item)" class="invoice_right">
                                        <text class="iconfont icon_edit"></text>
                                    </view>
                                </view>  
                            </view>
                            <view slot="right" class="rightBtn">
                                <view v-if="!item.defaultFlag" @click.stop="setDefault(item)" class="slot-button setdefault_btn"><text class="slot-button-text">设为默认</text></view>
                                <view @click.stop="deleteInvoice(item)" class="slot-button"><text class="slot-button-text">删除</text></view>
                            </view>
                        </uni-swipe-action-item>
                    </view>
                </uni-swipe-action>
            </view>
        </view>        

        <template v-if="loadImportUrl">
            <view v-if="showImportBtn" class="footer_import centered_around" >
                <view @click="gotoImportInvoice()" class="imortInvoice">导入企业发票抬头</view>
                <view @click="showAddPopup" class="addInvoice">新增发票抬头</view>
            </view>
            <view v-else class="footer_add">
                <view @click="showAddPopup" class="add">新增发票抬头</view>
            </view>
        </template>


        <!-- 新增和编辑的弹窗 -->
        <bottomPopup ref="popup" type="bottom" :showTitle="false" height="60vh">
            <scroll-view scroll-y="true"  class="add_content">
                <view class="input_wrap">
                    <!-- 发票类型 -->
                    <view class="add_item">
                        <view class="left_title">发票类型</view>
                        <view class="right_content">
                            <view @click="changeType(1)" class="choose_type">
                                <view v-if="isPersonal" class="secleted"></view>
                                <view v-if="isEnterprise" class="norSelected"></view>
                                <text>个人及政府事业单位</text>
                            </view>
                            <view @click="changeType(2)" class="choose_type last">
                                <view v-if="isEnterprise" class="secleted"></view>
                                <view v-if="isPersonal" class="norSelected"></view>
                                <text>企业</text>
                            </view>
                        </view>
                    </view>

                    <!-- 发票抬头 -->
                    <view class="add_item">
                        <view class="left_title">发票抬头</view>
                        <view class="right_content">
                            <input v-model="invoiceItem.name" maxlength="49" placeholder="请输入抬头名称" />
                        </view>
                    </view>

                    <!-- 只有企业才显示如下 -->
                    <template v-if="isEnterprise">
                        <!-- 税号 -->
                        <view class="add_item">
                            <view class="left_title">税号</view>
                            <view class="right_content">
                                <input v-model="invoiceItem.tax" placeholder="请输入纳税人识别号" maxlength="20"/>
                            </view>
                        </view>

                        <!-- 公司地址 -->
                        <view class="add_item">
                            <view class="left_title noRequired">公司地址</view>
                            <view class="right_content">
                                <input v-model="invoiceItem.address" placeholder="请输入公司地址" maxlength="39"/>
                            </view>
                        </view>

                        <!-- 电话号码 -->
                        <view class="add_item">
                            <view class="left_title noRequired">电话号码</view>
                            <view class="right_content">
                                <input v-model="invoiceItem.phone" placeholder="请输入电话号码" maxlength="19"/>
                            </view>
                        </view>

                        <!-- 开户银行 -->
                        <view class="add_item">
                            <view class="left_title noRequired">开户银行</view>
                            <view class="right_content">
                                <input v-model="invoiceItem.bank" placeholder="请输入开户银行" maxlength="30"/>
                            </view>
                        </view>
                        
                        <!-- 银行账号 -->
                        <view class="add_item">
                            <view class="left_title noRequired">银行账号</view>
                            <view class="right_content">
                                <input v-model="invoiceItem.account" placeholder="请输入银行账号" maxlength="30"/>
                            </view>
                        </view>
                        
                    </template>

                    <!-- 设为默认 -->
                    <view class="add_item no_border">
                        <view class="left_title noRequired">设为默认</view>
                        <view class="right_content switch">
                            <switch :checked="invoiceItem.defaultFlag" @change="invoiceItem.defaultFlag=!invoiceItem.defaultFlag" style="transform:scale(0.7)"/>
                        </view>
                    </view>
                </view>
            </scroll-view>

            <view class="btn_wrap">
                <view @click="saveInvoice" class="addBtn">保存</view>
            </view>
        </bottomPopup>

        <!-- 确认删除发票提示 -->
        <uni-popup ref="deletePopup" type="dialog">
            <uni-popup-dialog type="input" title ="提示" content="确认删除?" :duration="2000"  @confirm="confirmDelete()"></uni-popup-dialog>
        </uni-popup>
</view>
</template>

<script>
import uniPopup from '@/common/components/uni-popup/uni-popup.vue';
import uniPopupDialog from '@/common/components/uni-popup/uni-popup-dialog.vue';
import invoiceHandler from '@/views/components/invoice/handler';
import bottomPopup from '@/common/components/uni-popup/uni-popup-bottom.vue';
import uniSwipeAction from '@/views/components/uni-swipe-action/uni-swipe-action.vue';
import uniSwipeActionItem from '@/views/components/uni-swipe-action-item/uni-swipe-action-item.vue';
import { getStorageSync, removeStorageSync } from '@/utils/common.js'

// import Request from "./request";
 
export default {
    components:{
        uniPopup,
        uniPopupDialog,
        bottomPopup,
        uniSwipeAction,
        uniSwipeActionItem
    },
    props: {
        showCheck:{
            type: Boolean,
            default: false
        },
        choosedTitleId:{
            type: String
        }
    },
    data() {
        return {
            radioImage: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_radio_nor.svg',
             
            invoiceList: [],
            loading: true,
            invoiceItem: {}, //新增和编辑的时候发票对象
            deleteId: '', // 要删除的id
            importInvoiceUrl:'', //发票抬头URL
            loadImportUrl: false,
            followId: '',
        };
    },
    computed:{
        // 是否是企业
        isEnterprise(){
            return this.invoiceItem.type == 2;
        },
        // 是否是个人
        isPersonal(){
            return this.invoiceItem.type == 1;
        },
        // 是否配置有企业发票抬头地址
        showImportBtn(){
            return !!this.importInvoiceUrl;
        },
    },
    created(){
        this.initImportInvoiceUrl();
    },
    mounted(){
        this.initInvoiceItem();
        this.getInvoiceList();
    },
    methods: {
        //获取发票抬头地址决定是否显示导入按钮
        async initImportInvoiceUrl(){
            // this.loadImportUrl = false;
            // try {
            //     //获取渠道配置信息
            //     let sensorConfig = await window.channelOptions;
            //     if (!!sensorConfig.companyInvoiceTitleUrl){
            //         this.importInvoiceUrl = sensorConfig.companyInvoiceTitleUrl;
            //     }
            // } catch (error) {
            //     console.log(error);
            // }
            this.$nextTick(()=>{
                this.loadImportUrl = true;
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
                    //伴正事企业发票抬头小应用的小应用id，用来做导入企业发票抬头功能
                    let appId = '268435731';
                    let param = {
                        appId,
                        url: `${url}?uniqueId=jumpToImportInvoice&chooseType=${chooseType}&ids=${JSON.stringify(ids)}`
                    }
                    let data = await sinosdk.sino.openApplet(param);
                    if (data.ret == 0){
                        let responseData = JSON.parse(data.responseData || '{}');
                        let list = responseData.data;
                        let isExist = !!list && await that.checkTitleExists(list);
                        if (!!isExist){
                            uni.showModal({
                                confirmColor: '#f30300',
                                cancelColor: '#999',
                                title: '提示',
                                content: '当前发票抬头已存在，您要替换它吗？',
                                success(res) {
                                    if (res.confirm) {
                                        console.log("ok")
                                        that.saveImportInvoice(list, chooseType);
                                    } else {
                                        console.log("no")
                                    }
                                }
                            });
                        } else {
                            await that.saveImportInvoice(list, chooseType);
                        }
                    } else {
                        console.log('openAppletFunction,app响应格式错误')
                    }
                } else {
                    uni.showToast({
                        title: '该企业下暂无企业发票抬头',
                        icon: 'none'
                    });
                }
            } catch (error) {
                console.log(error);
                uni.showToast({
                    title: '获取导入企业发票抬头的地址失败',
                    icon: 'none'
                });
                    
            }
        },
            
        //将导入的企业发票抬头相关数据保存到个人的发票列表
        saveImportInvoice(list){
            let userParams = getApp().globalData.userParams;
            return new Promise((resolve) => {
                if (!!!list || list.length<=0){ resolve(false) }  
                    
                let requests = list.map(item=>{
                    return {
                        userId: userParams.userId,
                        companyId: userParams.companyId,
                        channelId: userParams.channelId,
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
                    requests: requests  
                }
                this.isLoading = true;

                invoiceHandler.addInvoices(param).then(res => {
                    if (res.state == 200){
                        // 重新获取发票列表
                        this.getInvoiceList();
                        this.closePop(); //关闭弹窗
                    } else {
                        this.$api.msg(res.msg);
                    }
                }).catch(e => {
                    console.log(e)
                })
                   
            })
                
        },

        /****
             * 导入发票的时候校验，发票抬头是否已经存在，如果存在弹窗展示，如果不存在，则直接导入
             */
        checkTitleExists(list){
            let userParams = getApp().globalData.userParams;
            return new Promise((resolve) => {
                if (!!!list || list.length<=0){ resolve(false) }  
                let requests = list.map(item=>{
                    return {
                        userId: userParams.userId,
                        companyId: userParams.companyId,
                        channelId: userParams.channelId,
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
                    requests: requests  
                }
                this.isLoading = true;
                invoiceHandler.checkTitleExists(param).then(async res => {
                    this.isLoading = false;
                    if (res.state == 200){
                        resolve(res.data);
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


        // 打开新增和编辑的弹窗
        showPopup(){
            this.$refs.popup.open();
        },

        // 打开企业发票抬头的弹窗
        showEnListPopup(){
            this.$refs.enterList.open();
        },

        // 切换个人和企业
        changeType(type){
            this.invoiceItem = {...this.invoiceItem, type}
        },

        // 检测选中与否
        checkSelect(item){
            return item.titleId == this.choosedTitleId;
        },

        //初始化invoiceItem对象
        initInvoiceItem(){
            this.invoiceItem = {
                type: 1, //1=个人或事业单位 2=企业
                name: '', 
                tax: '',
                address: '',
                phone: '',
                account: '',
                bank: '',
                defaultFlag: false
            }
        },

        // 删除
        deleteInvoice(item){
            this.deleteId = item.titleId;
            this.$refs.deletePopup.open(); // 打开确认删除的弹框
        },

        // 确认删除的接口
        confirmDelete(){
            let param = {titleIds: [this.deleteId]}
            this.$refs?.loading?.open();               
            invoiceHandler.deleteInvoice(param).then(res => {
                if (res.state == 200){
                    // 重新获取发票列表
                    this.getInvoiceList();
                    this.$refs.deletePopup.close(); // 关闭确认删除的弹框

                    // 如果删除的是缓存当中的数据，此时清除选择发票抬头的缓存
                    this.checkDelete(this.deleteId)


                } else {
                    this.$api.msg(res.msg);
                }
            }).catch(e => {
                console.log(e)
            }).finally(()=>{
                this.$refs?.loading?.close();
            })
        },

        // 如果删除的是缓存当中的数据，此时清除选择发票抬头的缓存
        checkDelete(deleteId){
            let choosedInvoice = getStorageSync('choosedInvoice'); //取缓存中的存入的选择的发票
            let invoiceInfo = getStorageSync('invoice_info'); //取缓存中的存入的选择的发票
            if (deleteId == choosedInvoice.titleId || deleteId == invoiceInfo.titleId ){
                removeStorageSync('choosedInvoice');
                removeStorageSync('invoice_info');
            }
        },

        // 点击首页的设为默认的按钮
        setDefault(item){
            let param = JSON.parse(JSON.stringify(item));
            param.defaultFlag = true;

            this.$refs?.loading?.open();                 
            invoiceHandler.updateInvoice(param).then(res => {
                if (res.state == 200){
                    // 重新获取发票列表
                    this.getInvoiceList();
                } else {
                    this.$api.msg(res.msg);
                }
            }).catch(e => {
                console.log(e)
            }).finally(()=>{
                this.$refs?.loading?.close();
            })
        },

        //导入企业发票抬头
        showEenterpriseListPopup(){
            this.showEnListPopup();
        },
        // 新增发票
        showAddPopup(){
            this.initInvoiceItem();
            this.showPopup();
            
        },

        // 编辑发票
        editInvoice(item){
            this.invoiceItem = JSON.parse(JSON.stringify(item)); //此处为深拷贝
            this.showPopup();
        },

        // 新增和编辑发票
        saveInvoice(){
            if (this.checkParam()){ //校验相关发票参数
                let userParams = getApp().globalData.userParams;
                let param = {
                    userId: userParams.userId,
                    companyId: userParams.companyId,
                    channelId: userParams.channelId,
                    type: this.invoiceItem.type,
                    name: this.invoiceItem.name,
                    defaultFlag: this.invoiceItem.defaultFlag
                        
                };
                if (this.isEnterprise){ //如果是企业
                    param = {
                        ...param, 
                        tax: this.invoiceItem.tax,
                        address: this.invoiceItem.address,
                        phone: this.invoiceItem.phone,
                        account: this.invoiceItem.account,
                        bank: this.invoiceItem.bank
                    }
                }
                let requestType = 'addInvoices';
                let requstObj = {
                    requests: [param]
                }; 
                if (!!this.invoiceItem.titleId){ //说明是编辑
                    requestType = 'updateInvoice';
                    param = Object.assign({}, param, {
                        titleId: this.invoiceItem.titleId
                    })
                    requstObj = param;
                }

                //新增的时候是批量的，所以此处理成数组
                this.$refs?.loading?.open();                   
                invoiceHandler[requestType](requstObj).then(res => {
                    if (res.state == 200){
                        // 重新获取发票列表
                        this.getInvoiceList();
                        this.closePop(); //关闭弹窗
                    } else {
                        this.$api.msg(res.msg);
                    }
                }).catch(e => {
                    console.log(e)
                }).finally(()=>{
                    this.$refs?.loading?.close();
                })
            }
        },

        //去除字符串内所有的空格
        strTrim(str){
            if (!str){
                return ''
            }
            return str.replace(/\s*/g,"");
        },

        // 校验相关接口
        checkParam(){
            let that = this;
            let regTax = /^[0-9A-Z]{6,20}$/;
            let phoneReg = /^[0-9-]{1,19}$/;
            let acountReg = /^[0-9 ]{1,30}$/;
            let flag = true;
            for (var i in that.invoiceItem){
                if (!!that.invoiceItem[i] && (typeof that.invoiceItem[i] == 'string')){
                    that.invoiceItem[i] = that.invoiceItem[i].trim(); //去除首尾的空格
                }
            }

            if (!that.strTrim(that.invoiceItem.name)){
                uni.showToast({
                    title: '请输入发票抬头',
                    icon: 'none',
                    duration: 700
                })
                return false;
            }
            if (this.isEnterprise){ //企业
                if (!that.strTrim(that.invoiceItem.tax)){
                    uni.showToast({
                        title: '请输入纳税人识别号',
                        icon: 'none',
                        duration: 700
                    })
                    return false;
                }
                
                if (!regTax.test(that.invoiceItem.tax)){
                    uni.showToast({
                        title: '税号至少6位，必须是由数字或大写字母和数字组成',
                        icon: 'none',
                        duration: 700
                    })
                    return false;
                }
                
                // if(!that.strTrim(that.invoiceItem.address)){
                //     uni.showToast({
                //         title: '请输入公司地址',
                //         icon: 'none',
                //         duration: 700
                //     })
                // return false;
                // }
                // if(!that.strTrim(that.invoiceItem.phone)){
                //     uni.showToast({
                //         title: '请输入电话号码',
                //         icon: 'none',
                //         duration: 700
                //     })
                // return false;
                // }

                //如果电话号码输入了 就必须校验格式
                if (!!that.strTrim(that.invoiceItem.phone) && !phoneReg.test(that.invoiceItem.phone)){
                    uni.showToast({
                        title: '电话号码格式错误',
                        icon: 'none',
                        duration: 700
                    })
                    return false;
                }

                // if(!that.strTrim(that.invoiceItem.bank)){
                //     uni.showToast({
                //         title: '请输入开户银行',
                //         icon: 'none',
                //         duration: 700
                //     })
                //     return false;
                // }

                // if(!that.strTrim(that.invoiceItem.account)){
                //     uni.showToast({
                //         title: '请输入银行账号',
                //         icon: 'none',
                //         duration: 700
                //     })
                //     return false;
                // }

                //如果银行账号输入了 就必须校验格式
                if (!!that.strTrim(that.invoiceItem.account) && !acountReg.test(that.invoiceItem.account)){
                    uni.showToast({
                        title: '银行账号格式错误',
                        icon: 'none',
                        duration: 700
                    })
                    return false;
                }
            }
            return flag;
        },

        //获取发票列表
        getInvoiceList(){
            this.$refs?.loading?.open();
            this.loading = true;
            invoiceHandler.getInvoiceList().then(res => {
                if (res.state == 200 && res.data.content && res.data.content.length >= 0){
                    this.invoiceList = res.data.content;
                }
                   
            }).catch( e=> {
                console.log(e)
            }).finally(()=>{
                this.$refs?.loading?.close();
                this.loading = false;
            })
        },

        // 关闭弹窗
        closePop(){
            this.$refs.popup.close()
        },

        // 选择发票
        chooseInvoice(item){
            if (!this.showCheck){ return }
            this.$emit('choose', item)
        }
    }
}
</script>

<style lang="scss">
.invoice_list{
    height: 100vh;
    display: flex;
    flex-direction: column;
    &.invoice_listempty{
        background-color: #fff;
    }
    .container_empty{
        flex: 1;
        display: flex;
        justify-content: center;
        .empty{
            padding-top: calc((100vh - 0px) * 0.32 - 128rpx);
            .img{
                width: 256rpx;
                height: 256rpx;
                background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/empty/icon_defpage_zwshdz.png') center no-repeat;
                background-size: 100% 100%;
                text-align: center;
                color:#999;
            }
            .empty_text{
                width: 100%;
                text-align: center;
                font-size: 28rpx;
                color: $main-third-color;
            }
        }
    }
    .container{
        flex: 1;
        overflow-x: hidden;
        overflow-y: auto; 
       
    }
    .footer_import{
        width: 750rpx;
        display: flex;
        position: fixed;
        bottom: 0;
        .imortInvoice{
                flex: 1;
                height: 80rpx;
                line-height: 80rpx;
                text-align: center;
                background-color: #fff;
                color: #f30300;
                font-size: 30rpx;
            }
            .addInvoice{
                flex: 1;
                height: 80rpx;
                line-height: 80rpx;
                text-align: center;
                background-color: #E82B29;
                color: #fff;
                font-size: 30rpx;
            }
    }
    .footer_add{
         height: 140rpx;
        padding: 30rpx;
        .add{
            width: 100%;
            height: 80rpx;
            line-height: 80rpx;
            text-align: center;
            background-color: #e82b29;
            color: #fff;
            border-radius: 40rpx;
            font-size: 30rpx;
        }

       
    }

    .invoice_wrap::v-deep {
        margin-bottom: 100rpx;
        padding:20rpx 30rpx 0 30rpx;
    }

    .invoice_wrap_item::v-deep{
        width: 100%;
        margin-bottom: 20rpx;
        background: #fff;
        border-radius: 20rpx;
        overflow: hidden;
        
        // movable-area {
        //     width: 100% !important;
        //     height: 180rpx;
        //     movable-view {
        //         width: 936rpx !important;
        //         height: 180rpx;
        //         display: flex;

                .rightBtn {
                    display: flex;
                    height: 100%;
                }
            // }
        // }


       .slot-button{
            width: 120rpx;
            height: 100%;
            background: #f30300;
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 0 20rpx 20rpx 0;
            &.setdefault_btn{
                border-radius: 0;
                background-color: #c2c2c2;
            }
        }
    }
    .invoice_wrap_box.InvoiceShowChecked{
        padding-left: 30rpx;
    }

    .invoice_wrap_box {
        width: 100%;
        box-shadow: 0rpx 4rpx 16rpx -4rpx rgba(125,155,250,0.10); 
        padding: 36rpx 50rpx;
        display: flex;
        align-items: center;
        .invoice_choose{
            width: 70rpx;
            .selected {
                width: 44rpx;
                height: 44rpx;
                background-image:url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/icon_setp_sel3_red.svg');
                background-size: 100% 100%;
            }
            img{
                width: 44rpx;
                height: 44rpx;
            }
        }

        
    }
    .invoice_item{
        flex: 1;
        
        display: flex;
        .invoice_right{
            width: 60rpx;
            text-align: right;
            margin-top: 8rpx;
            img{
                font-size: 28rpx;
                color: #999;
            }
        }
        .invoice_left{
            flex: 1;
            .invoice_name{
                width: 100%;
                font-size: 30rpx;
                font-weight: 400;
                display: flex;
                align-items: flex-start;
                word-break: break-all;
                .icon_default{
                    width: 50rpx;
                    height: 30rpx;
                    margin-right: 10rpx;
                    margin-top: 8rpx;
                    line-height:26rpx;
                    text-align: center;
                    font-weight: 400;
                    box-sizing: border-box;
                    font-size: 18rpx;
                    border-radius: 14rpx 0 14rpx 0;
                    color:#fff;
                    border: 1px solid #f30300;
                    background: #f30300;
                }
                .name {
                    flex: 1;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    display: -webkit-box;
                    word-break: break-all;
                }
            }
            .invoice_tax{
                color: #a4acb2;
                font-size: 26rpx;
                margin-top: 30rpx;
            }
        }
    }
}


// 新增和编辑的弹窗
.add_content{
    background: #fff;
    height: 100%;
    display: flex;
    padding-top: 30rpx;
    box-sizing: border-box;
    flex-direction: column;
    .add_item{
        padding: 0 30rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 28rpx;
        height: 100rpx;
        position: relative;
        overflow: hidden;
        text{
            white-space: nowrap;
        }
        &::after{
            content: "";
            left: 30rpx;
            right: 0;
            position: absolute;
            width: 100%;
            height: 1px;
            background: #E8E8E8;
            bottom: 0;
        }
        &.no_border::after{
            display: none;
        }
        .left_title{
            &.noRequired::after{
                display: none;
            }
            width: 170rpx;
            color: #666;
            &::after{
                content: "*";
                color: #f30300;
            }
        }
        .right_content{
            &.switch{
                display: flex;
                justify-content: flex-end;
            }
            ::v-deep .uni-switch-input-checked{
                background-color: #f30300 !important;
                border-color: #f30300 !important;
            }
            flex: 1;
            display: flex;
            input{
                width: 100%;
            }
            .input-placeholder{
                color: #C2C2C2; 
                font-size: 28rpx;
            }
            .choose_type{
                display: flex;
                align-items: center;
                &.last{
                    margin-left: 40rpx;
                }
                .secleted {
                    width: 36rpx;
                    height: 36rpx;
                    border-radius: 50%;
                    margin-right: 8rpx;
                    background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/icon_setp_sel3_red.svg') center no-repeat;
                    background-size: 100% 100%;
                }
                .norSelected {
                    width: 36rpx;
                    height: 36rpx;
                    border-radius: 50%;
                    margin-right: 8rpx;
                    background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_radio_nor.svg') center no-repeat; 
                    background-size: 100% 100%;
                }
                img{
                    width: 36rpx;
                    height: 36rpx;
                    margin-right: 8rpx;
                }
            }
        }
    }

    .input_wrap{
        flex: 1;
        padding-bottom: 140rpx;
    }


}
.btn_wrap{
    height: 120rpx;
    padding: 0 30rpx;
    display: flex;
    align-items: center;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
    padding-bottom: 10rpx;
    z-index: 100;
    .addBtn{
        width: 100%;
        height: 80rpx;
        line-height: 80rpx;
        text-align: center;
        background-color: #E82B29;
        color: #fff;
        border-radius: 40rpx;
        font-size: 30rpx;
        font-weight: 600;
    }
}

</style>
