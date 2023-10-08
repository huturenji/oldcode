<template>
    <div>
        <LoadingX tipsText="数据加载中..." v-if="loading" />
        <div v-else>
            <div class="statusCol">
                <div class="statusItem">
                    <div class="icon" :class="{application: expressStatus >= 0}"></div>
                    <div class="text">已申请</div>
                    <div class="time" v-if="expressStatus >= 0">{{ expressInfo.expressStatusAndTime && expressInfo.expressStatusAndTime.length>0 && expressInfo.expressStatusAndTime[0].time.substring(5)}}</div>
                </div>
                <div class="statusItem">
                    <div class="icon" :class="{mailing: expressStatus >= 1}"></div>
                    <div class="text" v-if="expressStatus >= 1">已邮寄</div>
                    <div class="text" v-else>待邮寄</div>
                    <div class="time" v-if="expressStatus >= 1">{{ expressInfo.expressStatusAndTime && expressInfo.expressStatusAndTime.length>0 && expressInfo.expressStatusAndTime[1].time.substring(5)}}</div>
                </div>
                <div class="statusItem">
                    <div class="icon" :class="{signing: expressStatus >= 2}"></div>
                    <div class="text" v-if="expressStatus >= 2">已签收</div>
                    <div class="text" v-else>待签收</div>
                    <div class="time" v-if="expressStatus >= 2">{{expressInfo.expressStatusAndTime && expressInfo.expressStatusAndTime.length>0 && expressInfo.expressStatusAndTime[2].time.substring(5)}}</div>
                </div>
            </div>
            <div class="noMail" v-if="expressStatus < 1">
                <i class="iconRedTip"></i>我们将在行程结束后为您寄送报销凭证
            </div>
            <div class="expressInfoCol" v-else>
                <div class="expressInfoItem">
                    <span class="infoKey">快递费发票</span>
                    <span class="infoValue">增值税普通发票（电子）</span>
                    <span class="invoiceDetail cursorp" @click="showInvoiceCompFun"></span>
                </div>
                <div class="expressInfoItem">
                    <span class="infoKey">快递公司</span>
                    <span class="infoValue">{{expressInfo.expressCompanyInfo.expressCompanyName}}</span>
                </div>
                <div class="expressInfoItem">
                    <span class="infoKey">运单号</span>
                    <span class="infoValue" id="expressNo">{{expressInfo.expressNo}}</span>
                    <span class="copyNum normal-btn" @click="copyExpressNo">复制运单号</span>
                </div>
                <div class="logisticsInfo">
                    <div v-show="moreLogisticsInfo || i === 0" class="logisticsItem" :class="{noLine: !moreLogisticsInfo}" v-for="(item, i) in expressInfo.expressDetails" :key="i">
                        <span class="circle"></span>
                        <div class="textInfo">
                            <div class="logisticsText">{{item.expressLocationDesc}}</div>
                            <div class="logisticsTime">{{item.expressLocationTime}}</div>
                        </div>
                        <div v-if="i === 0" class="downArrow cursorp" @click="moreLogisticsInfo = !moreLogisticsInfo"></div>
                    </div>
                </div>
            </div>
            <div class="invoiceInfoCol">
                <div class="invoiceInfoItem">
                    <span class="infoKey">凭证类型</span>
                    <span class="infoValue">行程单、保险发票、退票手续费收据将一并快递邮寄；快递费用将开具电子发票，请在订单详情中查看</span>
                </div>
                <div class="invoiceInfoItem">
                    <span class="infoKey">配送方式</span>
                    <span class="infoValue">快递 ￥{{expressFee}}</span>
                </div>
                <div class="invoiceInfoItem">
                    <span class="infoKey">发票抬头</span>
                    <div class="infoValues">
                        <div class="infoValues1">{{invoiceInfo.name}}</div>
                        <div class="infoValues2">{{invoiceInfo.tax}}</div>
                    </div>
                </div>
                <div class="invoiceInfoItem">
                    <span class="infoKey">配送地址</span>
                    <div class="infoValues">
                        <div class="infoValues1">{{deliveryAddress.name}} {{maskAddressPhone(deliveryAddress.phone)}}</div>
                        <div class="infoValues2">{{deliveryAddress.area}}{{deliveryAddress.address}}</div>
                    </div>
                </div>
            </div>
            <div class="reimburseInfoCol">
                <div class="title">订单凭证明细<span class="demo cursorp" @click="openDemo">样例</span></div>
                <div class="reimburseInfo">
                    <div class="reimburseInfoCol1 clear">
                        <div class="trip">{{airLines[0].sCityName}} <i class="tripIcon"></i> {{airLines[0].eCityName}}</div>
                        <div class="pay">￥{{orderBase.amount}}</div>
                    </div>
                    <div class="reimburseInfoCol2 clear">
                        <div class="time">{{airLines[0].beginDate}} {{airLines[0].beginTime}}</div>
                        <div class="airLine">{{airLines[0].airLineName}}{{airLines[0].flightNo}}</div>
                    </div>
                    <div class="reimburseInfoCol3">凭证：行程单、保险发票、退票手续费收据</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    Popup,
    TransferDom,
    Loading
} from 'vux';
// import InvoiceDetailIndex from 'components/invoice/InvoiceDetailIndex.vue'
import expressHandler from '../expressServer/js/expressHandler.js'
import LoadingX  from "components/loading/LoadingX.vue";
let MASKING = SnUtils.DataMasking
export default {
    mixins: [expressHandler.mixin.tChatEventMixin],
    name: 'reimburseDetail',
    directives: {
        TransferDom
    },
    components: {
        // InvoiceDetailIndex,
        LoadingX,
        Popup,
        Loading
    },
    data () {
        let managerData = expressHandler.stateManager.setData([], this);
        let data = {
            checkPopStatus: false,
            loading: true,
            moreLogisticsInfo: false,
            orderNo: this.$route.query.orderNo || '',
            // 配送信息
            deliveryAddress: {},
            // 发票抬头信息
            invoiceInfo: {},
            // 快递物流信息
            expressInfo: {
                expressStatusAndTime: [],
                expressCompanyInfo: {}
            },
            // 订单基础信息
            orderBase: {},
            // 航段信息列表
            airLines: [{}],            
            expressStatus: null,
            expressStatusArray: ['已申请', '已邮寄', '已签收'],
            expressFee: '',
            pageFrom: this.$route.query.pageFrom || '',//页面跳转来源
        }
        data = Object.assign(managerData, data)
        return data
    },
    beforeRouteLeave (to, from, next) {
        const that = this;
        that.checkPopStatus ? '' : that.closeTopPop();
        that.checkPopStatus ? next() : next(false);
    },
    created () {
        let that = this
        this.init()
    },
    methods: {
        init () {
            this.getOrderDetail()
        },
        /**
         * 发票收件人手机号脱敏显示
        */
        maskAddressPhone(phone){
            let res = phone;
            try {
                if (SnTravel.functional.ISDECORATE){
                    res = MASKING.maskingText(MASKING.MASKING_TYPE.TEL,phone);
                }
            } catch (error) {
                console.log(error)
            }
            return res
        },
        /**
        * T信回退事件的注册回调 必须是goBackFun
        */
        goBackFun(){
            this.closeTopPop();
        },        
        // 获取订单详情数据
        getOrderDetail () {
            let that = this;
            let param = {
                orderNo: this.orderNo
            }
            expressHandler.getOrderDetail(param).then((res) => {
                if (!!res.result) {
                    this.expressFee = res.result.expressFee || '';
                    this.deliveryAddress = res.result.address || {};
                    this.invoiceInfo = res.result.title;
                    this.expressInfo = res.result.expressInfo
                    this.orderBase = res.result.orderBase
                    this.airLines = res.result.airLines
                    //2019年7月23日15:30:59不需要改变顺序xiaowe
                    // !!this.expressInfo.expressDetails && this.expressInfo.expressDetails.reverse()
                    if (!!this.expressInfo.expressStatusAndTime) {
                        this.expressStatus = this.expressStatusArray.indexOf(this.expressInfo.expressStatusAndTime[this.expressInfo.expressStatusAndTime.length - 1].status)
                    }
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                console.error(err)
            });


         
        },
         /**
         * 打开发票
         */
        showInvoiceCompFun() {
            const that = this;
            let url = 'invoiceManage.html#/InvoiceDetailIndex?orderNo=' + that.orderNo + '&type=express';
            expressHandler.handlerOpenPage(url) 
        },
        closeTopPop () {
            const that = this;
            expressHandler.stateManager.closeTopPop(() => {
                that.checkPopStatus = true
                if('expressDetail'==that.pageFrom){
                    that.$router.back();
                }else{
                    expressHandler.closePage('')
                }
                
            });
        },
        openDemo () {
            let url = 'express/index.html#/sample';
            expressHandler.handlerOpenPage(url);
        },
        // 复制运单号
        copyExpressNo () {
            let expressNo=document.getElementById("expressNo").innerText
    　　　　 var save = function (e){
    　　　　    e.clipboardData.setData('text/plain',expressNo);//下面会说到clipboardData对象
    　　　　　　e.preventDefault();//阻止默认行为
    　　　　 }
    　　　　 document.addEventListener('copy',save);
    　　　　 document.execCommand("copy");//使文档处于可编辑状态，否则无效
            expressHandler.showToast('复制成功');
        }
    }
}
</script>

<style lang='less' scoped>
@import '~themes/default/styles/reimburse/reimburseDetail.less';
</style>
