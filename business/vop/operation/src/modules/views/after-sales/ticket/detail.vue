<template>
    <div class="service-details">
        <div class="sever-info">
            <service-track
                :showOperate="false"
                :mall-steps="trackInfo['MALL']"
                :sp-steps="trackInfo['SP']"
                :supplier-info="supplierInfo"
                :order-info="orderInfo"
                :is-makeup="isMakeup"
                :data-list="serverDetail['MALL']"
                :customerTab="customerTab"
                :taskId="taskId"
            ></service-track>
        </div>
        <div class="sever-info">
            <service-info
                title="供应商服务信息"
                :data-list="serverDetail['SP']"
            ></service-info>
            <service-info
                class="old-info"
                title="VOP服务信息"
                :data-list="serverDetail['MALL']"
            ></service-info>
        </div>
        <order-info
            title="订单信息"
            :order-info="orderInfo"
            :supplier-info="supplierInfo"
        ></order-info>
        <service-remark
            :systemLogs="systemLogs"
            :totals="totals"
            :changePageSize="changePageSize"
            :onPageChange="onPageChange"
        ></service-remark>
    </div>
</template>

<script>
import ServiceTrack from "biscomponents/after-sales/servicetrack";
import ServiceInfo from "biscomponents/after-sales/serviceinfo";
import orderInfo from "biscomponents/after-sales/orderinfo";
import ServiceRemark from "biscomponents/after-sales/serviceremark";
import { mapGetters,mapMutations } from "vuex";
import BaseDetail from "biscomponents/after-sales/basedetail";
import customerservicehandler from "bislibs/requestHandler/customerservicehandler";
export default {
    extends: BaseDetail,
    components: {
        ServiceTrack,
        ServiceInfo,
        orderInfo,
        ServiceRemark
    },
    computed: {
        ...mapGetters(["serviceId"])
    },
    methods: {
        ...mapMutations({
            setLoading: "SET_LOADING",
            setHomeRefresh: "SET_HOMEREFRESH"
        }),
        /**
         * 更新服务单状态
         */
        updateServiceRequestStatus(data) {
            let param = {
                serviceId: this.serviceId,
                title: data.operateResult,
                context: data.operateContent,
                userId: customerservicehandler.userInfo.userId,
                userName: customerservicehandler.userInfo.mgrName,
                operateDesc: data.operateDesc,
                needMoreInfo: data.needMore ? 1 : 2,
                moreInfo: data.needMore ? 1 : null
            };
            this.requestServer("updateServiceRequestStatus", param);
        },

        /**
         * 请求服务器数据
         */
        requestServer(url, data) {
            this.setLoading(true);
            let promise
            switch (url) {
            case 'updateServiceRequestStatus':
                promise = customerservicehandler.updateServiceRequestStatus(data)
                break;
            case 'refund':
                promise = customerservicehandler.refund(data)
                break;
            case 'replaceProducts':
                promise = customerservicehandler.replaceProducts(data)
                break;
            case 'submitRequestToSupplier':
                promise = customerservicehandler.submitRequestToSupplier(data)
                break;
            case 'rejectServiceRequest':
                promise = customerservicehandler.rejectServiceRequest(data)
                break;
            default:
                break;
            }
            
            promise.then(
                res => {
                    this.setLoading(false);
                    if (res.resultCode === 0) {
                        this.setHomeRefresh(true);
                        this.$router.replace({ path: "/custservice/seat" });
                    }
                },
                () => {
                    this.setLoading(false);
                }
            );
        },
        /**
         * 退款
         */
        refund(data) {
            let param = {
                serviceId: this.serviceId,
                userId: customerservicehandler.userInfo.userId,
                userName: customerservicehandler.userInfo.mgrName,
                operateResult: data.operateResult,
                operateContext: data.operateContent,
                refundableAmount: data.refundableAmount,
                operateDesc: data.operateDesc
            };
            this.requestServer("refund", param);
        },
        /**
         * 换货
         */
        replaceProducts(data) {
            let param = {
                serviceId: this.serviceId,
                userId: customerservicehandler.userInfo.userId,
                userName: customerservicehandler.userInfo.mgrName,
                operateResult: data.operateResult,
                operateContext: data.operateContent,
                supplierId: this.supplierInfo.supplierId,
                spOrderId: data.spOrderId,
                operateDesc: data.operateDesc
            };
            this.requestServer("replaceProducts", param);
        },
        /**
         * 转交供应商
         */
        submitRequestToSupplier(data) {
            let param = {
                serviceId: this.serviceId,
                userId: customerservicehandler.userInfo.userId,
                userName: customerservicehandler.userInfo.mgrName,
                applyReasonType: data.applyReasonType,
                questionDesc: data.questionDesc,
                customerContactName: data.customerContactName,
                customerTel: data.customerMobilePhone,
                customerMobilePhone: data.customerMobilePhone,
                operateDesc: data.operateDesc
            };
            this.requestServer("submitRequestToSupplier", param);
        },
        /**
         * 审批不通过
         */
        rejectServiceRequest(data) {
            let param = {
                serviceId: this.serviceId,
                operateResult: data.operateResult,
                operateReason: data.operateReason,
                operateDesc: data.operateDesc,
                userId: customerservicehandler.userInfo.userId,
                userName: customerservicehandler.userInfo.mgrName
            };
            this.requestServer("rejectServiceRequest", param);
        },
        /**
         * 取消
         */
        onCancel() {
            let param = {
                userId: customerservicehandler.userInfo.userId,
                userName: customerservicehandler.userInfo.mgrName
            };
            this.setLoading(true);
            customerservicehandler.reSubmitServiceRequest(param).then(
                res => {
                    this.setLoading(false);
                    if (res.resultCode === 0) {
                        this.$router.replace({ path: "/custservice/seat" });
                    }
                },
                () => {
                    this.setLoading(false);
                }
            );
        }
    }
};
</script>

<style scoped lang="less">
.service-details {
    .service-edit {
        text-align: right;
        margin: 0 56px 16px 0;
        .el-button {
            padding: 8px 19px;
        }
    }
    .sever-info {
        padding: 16px 0 32px 0;
        display: flex;
        border-radius: 8px;
        background-color: #fff;
        .old-info {
            border-left: 1px solid #eee;
        }
    }
}
</style>
<style lang="less">
@import '~styles/cusomer.less';
.deal-dialog {
    .el-dialog {
        width: 500px;
    }
}
.el-dialog__body {
    text-align: center !important;
}
</style>
