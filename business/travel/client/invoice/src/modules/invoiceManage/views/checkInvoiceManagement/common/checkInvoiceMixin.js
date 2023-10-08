/*
 * 发票查验的混入 minxin.js
 */
import invoiceHandler from 'modules/invoiceManage/views/common/lib/invoiceHandler.js';

var checkInvoiceMixin = {
    data(){
        return {
           
        }
    },
    methods:{
        //调取发票验证的接口
        verInvoiceFun(){
            let that = this;
            that.showLoading = true;
            //调取接口开始
            let param = {
                userId: invoiceHandler.userId,
                companyId: invoiceHandler.companyId,
                channelId: invoiceHandler.channelId,
                invoiceCode: that.invoiceCode,
                invoiceNumber: that.invoiceNumber,
                billingDate: that.billingDate,
                totalAmount: that.totalAmount,
                checkCode: that.checkCode,
                orderNo:that.orderNo,
                salesTaxNo:that.salesTaxNo
            }
            invoiceHandler.verInvoice(param).then(res=>{
                that.showLoading = false;
                if (res.resultCode==0 && res.result){
                    let status = res.result.message.status;
                    if (status == 2){ //查验成功发票一致
                        let verRecordId = res.result.verRecordId;
                        that.$router.push({
                            path: '/check/result',
                            query: {verRecordId:verRecordId, showBtn:'yes'}//showBtn是否显示继续查验的按钮
                        });
                    } else {
                        invoiceHandler.showToast('查验失败')
                    }
                } 
            }).catch(e=>{
                console.log(e);
                that.showLoading = false;
            })
        },

        /**
         * 将发票类型转换为数字用于展示
         * @param {Object} InvoiceType
         */
        transferInvoiceTypeToText(InvoiceType){
            let InvoiceTypeText = '';
            if (InvoiceType == 'VAT_EXCLUSIVE_INVOICE'){
                InvoiceTypeText = '增值税专用发票'
            } else if (InvoiceType == 'VEHICLE_UNIFORM_INVOICE'){
                InvoiceTypeText = '机动车销售统一发票'
            } else if (InvoiceType == 'VAT_COMMON_INVOICE'){
                InvoiceTypeText = '增值税普通发票'
            } else if (InvoiceType == 'VAT_COMMON_INVOICE_ELECTRONICS'){
                InvoiceTypeText = '增值税普通发票（电子）'
            } else if (InvoiceType == 'VAT_COMMON_INVOICE_SPIRAL'){
                InvoiceTypeText = '增值税普通发票（卷式）'
            } else if (InvoiceType == 'VAT_COMMON_INVOICE_TOLL'){
                InvoiceTypeText = '增值税普通发票（通行费）'
            } else if (InvoiceType == 'FREIGHT_TRANSPORT_VAT_EXCLUSIVE_INVOICE'){
                InvoiceTypeText = '货运运输业增值税专用发票'
            } else if (InvoiceType == 'ELECTRONIC_INVOICE_SPEC'){
                InvoiceTypeText = '电子发票（增值税专用发票）'
            } else if (InvoiceType == 'ELECTRONIC_INVOICE_NORMAL'){
                InvoiceTypeText = '电子发票（普通发票）'
            } else if (InvoiceType == 'VAT_EXCLUSIVE_INVOICE_ELE'){
                InvoiceTypeText = '增值税专用发票（电子）'
            } else if (InvoiceType == 'SECOND_HAND_CAR'){
                InvoiceTypeText = '二手车销售统一发票'
            } else if (InvoiceType == 'BLOCK'){
                InvoiceTypeText = '区块链发票'
            } else if (InvoiceType == 'COMMON_ELE'){
                InvoiceTypeText = '通用电子发票'
            } else if (InvoiceType == 'ALL_ELE_PAPER_SPEC'){
                InvoiceTypeText = '全电纸票（增值税专用发票）'
            } else if (InvoiceType == 'ALL_ELE_PAPER'){
                InvoiceTypeText = '全电纸票（普票）'
            }
            return InvoiceTypeText;
        }
    }
}
export default checkInvoiceMixin;