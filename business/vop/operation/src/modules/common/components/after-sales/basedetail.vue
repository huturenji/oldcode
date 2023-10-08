<script>
import customerservicehandler from "bislibs/requestHandler/customerservicehandler";
import utils from "bislibs/utils";
import { mapMutations, mapGetters } from "vuex";
export default {
    data() {
        return {
            serviceState: { MALL: 0, SP: 0 },
            typeMap: utils.typeMap,
            stepMap :utils.stepMap,
            pickwareTypeMap: utils.pickwareTypeMap,
            orderInfo: {},
            isMakeup:false,//是否是系统补单（补单场景下的客服确认操作步骤需要隐藏）
            supplierInfo: {},
            systemLogs: [],
            serverDetail: { MALL: [], SP: [] },
            trackInfo: { MALL: [], SP: [] },
            showReactivateAuth: utils.hasAuth("showServiceListAuth"),
            showReactivate: false,
            loading: false,
            // expressInfoList:[],
            totals: 0,
            pageSize: 10,
            currentPage: 1,
            refundAmount:100
        };
    },
    computed: {
        ...mapGetters(["serviceStatus","serviceId"])
    },
    created() {
        let _this = this;
        _this.customerTab = this.$route.query.customerTab;
        _this.taskId = this.$route.query.taskId;   
    },
    mounted() {
        this.getServiceDetail();
        // this.getExpressList();
    },
    methods: {
        ...mapMutations({
            setHomeRefresh: "SET_HOMEREFRESH"
        }),
        /**
         * 查询服务单详情
         */
        getServiceDetail() {
            let param = {
                postSaleNo: this.serviceId
                // postSaleNo:'P269090702819328'
            };
            let loadingInstance = this.$loading({
                lock: true,
                text: "加载中..."
                // target: document.querySelector(".loading-area") //设置加载动画区域
            });
            customerservicehandler.getPostSaleDetail(param).then(
                (res) => {
                    loadingInstance.close();
                    if (res.resultCode === 0 && res.result) {
                        this.orderInfo = res.result.postSaleDetailInfo;
                        this.trackInfo["MALL"] =
                            res.result.postSaleDetailInfo ? res.result.postSaleDetailInfo.postSaleTrackInfoList : [];
                        this.trackInfo["SP"] =
                            res.result.supplierPostSaleDetailInfo ? res.result.supplierPostSaleDetailInfo.postSaleTrackInfoList : [];
                        //supplierPostSaleDetailInfo可能为空
                        if (!res.result.supplierPostSaleDetailInfo){
                            res.result.supplierPostSaleDetailInfo = {};
                        }
                        //有些数据SP没有，直接使用vop的
                        res.result.supplierPostSaleDetailInfo.applyReason = res.result.postSaleDetailInfo.applyReason; 
                        res.result.supplierPostSaleDetailInfo.pickwareType = res.result.postSaleDetailInfo.pickwareType; 
                        this.formatServiceDetail(
                            res.result.postSaleDetailInfo,
                            "MALL"
                        );
                        this.formatServiceDetail(
                            res.result.supplierPostSaleDetailInfo,
                            "SP"
                        );
                        this.systemLogs = res.result.postSaleDetailInfo.behaviorRecordInfoList;//操作日志
                        this.isMakeup = (res.result.postSaleDetailInfo.approveNotes == "系统自动受理补单操作"&&this.serviceStatus == "1")//是否是系统补单并且客服确认
                    }
                },
                () => {
                    loadingInstance.close();
                }
            );
        },
        /**
         * 格式化服务单详情数据
         */
        formatServiceDetail(data = {}, type) {
            this.serverDetail[type] = [];
            if (data){ this.serviceState[type] = data.state || 0; } else { return }
            
            this.serverDetail[type].push({
                title: type == "MALL" ? "服务单号" : "供应商服务单号",
                key: "postSaleNo",
                value: data.postSaleNo
            });
            this.serverDetail[type].push({
                title: "服务类型",
                key: "postSaleType",
                value: this.typeMap[data.postSaleType]
            });
            this.serverDetail[type].push({
                title: "售后环节",
                key: "stepName",
                value: this.stepMap[data.postSaleStep]
            });
            this.serverDetail[type].push({
                title: "申请原因",
                key: "applyReason",
                value: data.applyReason
            });
            this.serverDetail[type].push({
                title: "原因描述",
                key: "questionDesc",
                value: data.questionDesc
            });
            this.serverDetail[type].push({
                title: "凭证",
                key: "questionPic",
                value: data.questionPic ? data.questionPic.split(",") : []
            });
            this.serverDetail[type].push({
                title: "商品返回方式",
                key: "pickwareType",
                value: this.pickwareTypeMap[data.pickwareType]
            });
            // this.transmitInfo[type].returnwareAddress = data.returnwareAddress;
            // data.pickwareType == 4 &&
            //     this.serverDetail[type].push({
            //         title: "取件地址",
            //         key: "pickwareAddress",
            //         value: data.pickwareAddress,
            //     });

            if (type == "MALL"){
                this.serverDetail[type].push({
                    title: "联系信息",
                    key: "customer",
                    value: `${(data.postSaleAddressInfo && data.postSaleAddressInfo.linkMan) || ""}    ${
                        (data.postSaleAddressInfo && data.postSaleAddressInfo.telephone) || ""
                    }`
                });
            } else if (type == "SP"){
                this.serverDetail[type].push({
                    title: "联系信息",
                    key: "customer",
                    value: `${(data.serviceCustomerInfo && data.serviceCustomerInfo.contactName) || ""}    ${
                        (data.serviceCustomerInfo && data.serviceCustomerInfo.mobilePhone) || ""
                    }`
                });
            }

            if (type == "MALL"){
                if (data.pickwareType == 4){
                    this.serverDetail[type].push({
                        title: "取件地址",
                        key: "address",
                        value: (data.postSaleAddressInfo && data.postSaleAddressInfo.address) ||''
                    });
                } else {
                    this.serverDetail[type].push({
                        title: "收货地址",
                        key: "address",
                        value: (data.postSaleAddressInfo && data.postSaleAddressInfo.address) || ''
                    });                    
                }
            } else if (type == "SP"){
                // approvedResultName
                this.serverDetail[type].push({
                    title: "审核结果",
                    key: "approvedResultName",
                    value: data.approvedResultName
                });
            }
        },
        /**
         * 格式化供应商信息
         */
        formatSupplierInfo(data = {}) {
            this.$set(this.supplierInfo, "simpleName", data.supplierName);
            this.$set(this.supplierInfo, "logo", data.logo);
            this.$set(this.supplierInfo, "supplierId", data.supplierId);
            data.contacts &&
                data.contacts.forEach((contact) => {
                    if (contact.type === 2) {
                        this.$set(
                            this.supplierInfo,
                            "contactNumber",
                            contact.contactNumber
                        ); //客服办公电话
                    }
                });
        },
        /**
         * 查询服务单日志
        //  */
        // getServiceRemark(loadingInstance) {
        //     let param = {
        //         serviceId: this.serviceId,
        //         pageSize: this.pageSize,
        //         pageNum: this.currentPage,
        //     };
        //     customerservicehandler.getServiceLogs(param).then(
        //         (res) => {
        //             loadingInstance && loadingInstance.close();
        //             if (res.resultCode === 0) {
        //                 this.systemLogs = [];
        //                 this.totals = res.result.total; //总条数
        //                 this.systemLogs = this.systemLogs.concat(
        //                     res.result.systemLogs
        //                 );
        //             }
        //         },
        //         (rej) => {
        //             loadingInstance && loadingInstance.close();
        //         }
        //     );
        // },
        /**
         * 打开重新激活提示框
         */
        confirm() {
            this.showReactivate = true;
        },
        /**
         * 重新激活服务单
         */
        // reactivate() {
        //     let param = {
        //         serviceId: this.serviceId,
        //         userId: customerservicehandler.userInfo.userId,
        //         userName: customerservicehandler.userInfo.mgrName,
        //     };
        //     this.loading = true;
        //     customerservicehandler.reactivateServiceRequest(param).then(
        //         (res) => {
        //             this.loading = false;
        //             if (res.resultCode === 0) {
        //                 this.setHomeRefresh(true);
        //                 window.history.go(-1);
        //             }
        //         },
        //         (rej) => {
        //             this.loading = false;
        //         }
        //     );
        // },
        /**
         * 切换页码
         */
        // onPageChange(currentPage) {
        //     let _this = this;
        //     _this.currentPage = currentPage;
        //     let loadingInstance = this.$loading({
        //         lock: true,
        //         text: "加载中...",
        //         target: document.querySelector(".loading-area"), //设置加载动画区域
        //     });
        //     _this.getServiceRemark(loadingInstance);
        // },
        /**
         * 改变每页展示数量
         */
        // changePageSize(pageSize) {
        //     let _this = this;
        //     let loadingInstance = this.$loading({
        //         lock: true,
        //         text: "加载中...",
        //         target: document.querySelector(".loading-area"), //设置加载动画区域
        //     });
        //     _this.pageSize = pageSize;
        //     _this.getServiceRemark(loadingInstance);
        // },
        /**
         * 查询快递公司列表
         */
        getExpressList() {
            let param = {
                expressName: "",
                firstLetter: ""
            };
            customerservicehandler.getExpressList(param).then(
                (res) => {
                    if (res.resultCode === 0) {
                        this.expressInfoList = res.result.expressInfoList;
                    }
                },
                () => {
                }
            );
        }
    }
};
</script>