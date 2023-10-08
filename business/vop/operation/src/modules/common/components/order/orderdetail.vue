<template>
    <div class="order-detail">
        <order-status 
            ref="orderStatus" 
            @on-confirm="confirmModify" 
            :order-state="orderStatusInfo"
        >
        </order-status>
        <order-box title="订单信息">
            <div class="order-info">
                <span
                    class="info-text"
                    v-for="(info,index) in orderInfo.orderList"
                    :key="index"
                >
                    <span class="info-title">{{ info.key }}: </span>
                    <span>{{ info.value }}</span>
                </span>
                <div
                    v-if="orderSplittedType == 'child'"
                    class="parent-order-info"
                >
                    <label>父订单信息</label>
                    <span
                        class="info-text"
                        v-for="(info,index) in orderInfo.parentOrderList"
                        :key="index"
                    >
                        <span class="info-title">{{ info.key }}: </span>
                        <span
                            :class="{'active':index===0}"
                            @click="index===0?showDetail(info.value):''"
                        >{{ info.value }}</span>
                    </span>
                </div>
            </div>
        </order-box>
        <order-table
            :type="type"
            :dataList="dataList"
            :amount-info-list="amountInfoList"
        ></order-table>
        <order-box
            v-if="ordertypes!='SALE'"
            title="物流信息"
        >
            <template>
                <!-- <el-tabs 
                    class="express-tabs" 
                    v-if="expressList.length" 
                    v-model="tabActive" 
                    @tab-click="tabChange">
                    <el-tab-pane 
                        v-for="(parcelList,index) in expressList" 
                        :key="index" 
                        :label="'包裹' + convertDigitToChinaNum(index+ 1)" 
                        :name="'tab'+ (index+ 1)">
                        <time-line v-if="parcelList.length" :express-list="parcelList"></time-line>
                        <div v-else class="no-express">
                            <i class="no-express-icon"></i>
                            <span>暂无物流信息</span>
                        </div>                    
                    </el-tab-pane>
                </el-tabs> -->
                <time-line
                    v-if="parcelList&&parcelList.length>0"
                    :express-list="parcelList"
                ></time-line>
                <div
                    v-else
                    class="no-express"
                >
                    <i class="no-express-icon"></i>
                    <span>暂无物流信息</span>
                </div>          
            </template>           
        </order-box>
        <!-- <order-box 
            v-if="orderType=='SALE'&&orderSource == 'NORMAL'"
            :type="type"
            title="发票信息" 
            :invoice-url="invoiceUrl['now'].length?invoiceUrl['now']:invoiceUrl['former']" 
            :invoice-state="invoiceState['now']" 
            btn-title="发票详情">
            <div class="invoice-info" :class="{'clear-top':invoiceState['now']!='RE_INVOICING'&&invoiceState['now']!='RE_INVOICED'}">
                <div class="now-info">
                    <span class="info-title" v-if="invoiceState['now']=='RE_INVOICING'||invoiceState['now']=='RE_INVOICED'">现开票信息</span> 
                    <div class="info-text" v-for="(info,index) in invoiceInfo['now']" :key="index">
                        <span class="info-title">{{ info.key }}: </span>
                        <span :class="info.key=='发票状态'?invoiceState['now']:''">{{ info.value }}</span>
                    </div>   
                </div>
                <div class="pre-info" v-if="invoiceInfo['former'].length">
                    <span class="info-title">原开票信息</span>
                    <div class="info-text" v-for="(info,index) in invoiceInfo['former']" :key="index">
                        <span class="info-title">{{ info.key }}: </span>
                        <span :class="info.key=='发票状态'?invoiceState['former']:''">{{ info.value }}</span>
                    </div>
                </div>
            </div>    
        </order-box>      -->
        <!-- <order-note 
            v-if="orderType=='SALE'?showSaleLogAuth:showPurchaseLogAuth" 
            ref="operateNote" 
            title="操作备注" 
            @on-confirm="confirmOperate"></order-note> -->
        <!-- <order-box title="订单日志" >
            <el-table 
                class="op-table"
                stripe
                :header-cell-style="{background:'#f2f2f2'}"
                :data="noteList">
                <el-table-column 
                    v-for="(header,index) in noteHeaders" 
                    :key="index"
                    :prop="header.key"
                    :label="header.title"
                    :align="header.align"
                    :width="header.width">
                    <template slot-scope="scope">
                        <div v-if="scope.column.property == 'logTime'">
                            <span>{{ logTime(scope.row.logTime) }}</span>
                        </div>
                        <div v-if="scope.column.property == 'actorName'">
                            <span>{{ scope.row.actorName }}</span>
                        </div>
                        <div v-if="scope.column.property == 'logRemark'">
                            <span :title="logRemark(scope.row.logRemark)">{{ logRemark(scope.row.logRemark) }}</span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>                
        </order-box> -->
    </div>
</template>
<script>
import OrderStatus from "./orderstatus";
import OrderTable from "./ordertable";
import OrderBox from "./orderbox";
// import OrderNote from "./ordernote";
import TimeLine from "./TimeLine";
import orderhandler from "bislibs/requestHandler/orderhandler";
import utils from "bislibs/utils";
import { mapGetters, mapMutations } from "vuex";
import accounting from "accounting";
export default {
    props: {
        ordertypes: {//父订单和子订单的标识
            type: String,
            default: ""
        }
    },
    components: {
        OrderStatus,
        OrderTable,
        OrderBox,
        // OrderNote,
        TimeLine
    },
    data() {
        return {
            type: "",
            orderSource: "NORMAL",
            showPurchaseLogAuth: utils.hasAuth('showPurchaseLogAuth'),
            showSaleLogAuth: utils.hasAuth('showSaleLogAuth'),
            loading: false,
            dataList: [],
            orderStatusInfo: {},
            orderSplittedType: "",
            orderInfo: { orderList: [], parentOrderList: [] },
            invoiceInfo: { former: [], now: [] },
            tabActive: "tab1", //el-tabl的name必须是String，否则会有问题
            expressList: [],
            invoiceUrl: { former: [], now: [] },
            invoiceState: { former: "", now: "" },
            noteList: [],
            amountInfoList: [],
            noteHeaders: [
                {
                    title: "时间",
                    key: "logTime",
                    width: 240
                },
                {
                    title: "操作人",
                    key: "actorName",
                    width: 240
                },
                {
                    title: "内容",
                    key: "logRemark"
                }
            ]
        };
    },
    computed: {
        ...mapGetters(["orderNo", "orderType","subOrderNo"]),
        logTime() {
            return time => {
                return this.$moment(time).format("YYYY-MM-DD HH:mm:ss");
            };
        },
        logRemark() {
            return remark => {
                let remarkObj = JSON.parse(remark) || {};
                if (remarkObj.updateType == "ORDER_STATE") {
                    return `由${utils.orderStateMap[remarkObj.oldValue]}状态改为${
                        utils.orderStateMap[remarkObj.newValue]
                    }状态${remarkObj.remark ? "，" : ""}${
                        remarkObj.remark ? remarkObj.remark : ""
                    }`;
                } else if (remarkObj.updateType == "DISCOUNT_AMOUNT") {
                    return `由原金额${accounting.formatMoney(
                        remarkObj.oldValue,
                        "",
                        2,
                        ","
                    )}元改为${accounting.formatMoney(
                        remarkObj.newValue,
                        "",
                        2,
                        ","
                    )}元${remarkObj.remark ? "，" : ""}${
                        remarkObj.remark ? remarkObj.remark : ""
                    }`;
                } 
                return remarkObj.remark;
                
            };
        }
    },
    mounted() {
        this.getOrderDetail();
    },
    methods: {
        ...mapMutations({
            setHomeRefresh: "SET_ORDERHOMEREFRESH",
            setOrderNo: "SET_ORDERNO",
            setsubOrderNo: "SET_SUBORDERNO",
            setOrderType: "SET_ORDERTYPE"
        }),
        /**
         * 获取请求url
         */
        getRequestUrl(url) {
            return this.orderType == "SALE"
                ? { url, prefix: "/order/v1/" }
                : url;
        },
        /**
         * 查询订单详情
         */
        getOrderDetail() {
            // let param = {
            //     orderNo: this.orderNo
            //     // orderType: this.orderType
            // };
            this.$iLoading.show();
            const promise = this.ordertypes == "SALE" ? orderhandler.getDetailByOperation({orderNo: this.orderNo}) : orderhandler.getSubDetailByOperation({subOrderNo : this.subOrderNo})
            promise.then(res => {
                this.$iLoading.hide();
                if (res.resultCode === 0) {
                    this.formatOrderData(res.result);
                }
            }).catch(() => {
                this.$iLoading.hide();
            });
        },
        /**
         * 格式化订单详情数据
         */
        formatOrderData(data) {
            //订单状态数据
            this.type = this.ordertypes == "SALE" ? "parent" : "child";
            this.orderStatusInfo = {
                orderState: data.showState,
                updateTime:data.updateTime
            };
            //订单信息数据
            this.orderInfo.orderList = [];
            this.orderInfo.parentOrderList = [];
            this.orderSplittedType = this.type;
            if (this.orderSplittedType == "child") {
                this.orderInfo.parentOrderList.push({
                    key: "平台(父)订单号",
                    value: data.orderNo || ""
                });
                this.orderInfo.parentOrderList.push({
                    key: "渠道订单号",
                    value: data.thirdOrderNo || ""
                });
                this.orderInfo.parentOrderList.push({
                    key: "收货人",
                    value: `${data.name || ""}(${data
                        .mobile || ""})`
                });
                this.orderInfo.parentOrderList.push({
                    key: "收件地址",
                    value: `${data.province || ""}${data
                        .city || ""}${data.district || ""}${data.town ||""}${
                        data.address || ""}`
                });

                this.orderInfo.orderList.push({
                    key: "平台(子)订单号",
                    value: data.subOrderNo || ""
                });
                this.orderInfo.orderList.push({
                    key: "供应商订单号",
                    value: data.supplierOrderNo || ""
                });
                this.orderInfo.orderList.push({
                    key: "所属渠道",
                    value: data.channelName || data.channelId || ""
                });
                this.orderInfo.orderList.push({
                    key: "供应商",
                    value: this.supplierTypeFormat(data.supplierType) || ""
                });
            } else if (this.orderSplittedType == "parent"){
                this.orderInfo.orderList.push({
                    key: "平台(父)订单号",
                    value: data.orderNo || ""
                });
                this.orderInfo.orderList.push({
                    key: "渠道订单号",
                    value: data.thirdOrderNo || ""
                });
                this.orderInfo.orderList.push({
                    key: "所属渠道",
                    value: data.channelName || data.channelId || ""
                });
                this.orderInfo.orderList.push({
                    key: "收货人",
                    value: `${data.name || ""}(${data
                        .mobile || ""})`
                });
                this.orderInfo.orderList.push({
                    key: "收件地址",
                    value: `${data.province || ""}${data
                        .city || ""}${data.district || ""}${data.town ||""}${
                        data.address || ""}`
                });
                //父订单商品信息数据
                let parentSkuList = data.subOrderList
                parentSkuList.forEach(function(item) {
                    item.sku = item.subOrderNo
                })
                this.dataList = parentSkuList
            }
            
            //子订单商品信息数据
            
            (this.orderSplittedType != "parent" &&(this.dataList = data.skuList));
            this.amountInfoList = [];
            this.amountInfoList.push({
                key: "供应商结算价总计",
                value: data.supplierOrderSettlePrice
            });
            this.amountInfoList.push({
                key: "渠道价总计",
                value: data.orderSettlePrice
            });
            this.amountInfoList.push({ key: this.ordertypes == "SALE" ? "总运费":"运费", value: data.freight });
            
            this.orderSource = data.orderSource || "NORMAL";
            //发票信息数据
            if (data.invoiceInfos) {
                if (data.invoiceInfos.length === 1) {
                    this.formatInvoiceData("now", data.invoiceInfos[0]);
                } else if (data.invoiceInfos.length > 1) {
                    data.invoiceInfos.forEach(info => {
                        if (
                            info.invoiceState == "RE_INVOICING" ||
                            info.invoiceState == "RE_INVOICED"
                        ) {
                            this.formatInvoiceData("now", info);
                        } else {
                            this.formatInvoiceData("former", info);
                        }
                    });
                }
            }

            //物流信息
            // this.formatExpressData(data.logisticsTrack);
            this.parcelList = data.logisticsTrack;
            //订单日志数据
            this.noteList = data.orderLog;
        },
        /**
         * 格式化发票信息
         */
        formatInvoiceData(type, data) {
            this.invoiceInfo[type] = [];
            this.invoiceUrl[type] = data.invoiceUrl;
            this.invoiceState[type] = data.invoiceState;
            this.type == "child" &&
                this.invoiceInfo[type].push({
                    key: "发票状态",
                    value: utils.invoiceStateMap[data.invoiceState] || ""
                });
            this.invoiceInfo[type].push({
                key: "发票类型",
                value: utils.invoiceTypeMap[data.invoiceCategory] || ""
            });
            this.invoiceInfo[type].push({
                key: "发票内容",
                value: data.invoiceContent || ""
            });
            this.invoiceInfo[type].push({
                key: "发票抬头",
                value: data.invoiceTitle || ""
            });
            this.type == "child" &&
                this.invoiceInfo[type].push({
                    key: "收票地址",
                    value: `${data.receiverInfo.province || ""}${data
                        .receiverInfo.city || ""}${data.receiverInfo.district ||
                        ""}${data.receiverInfo.town ||""}${data.receiverInfo.address || ""}  ${data
                        .receiverInfo.name || data.receiverInfo.email||""}(收)  ${data.receiverInfo
                        .phone || ""}`
                });
        },
        /**
         * 格式化物流信息
         */
        formatExpressData(data) {
            let parcelsExpressList=[]
            //物流存在分包业务，调整为兼容性代码。expressInfo之前是object，应该修改为array。
            if (Array.isArray(data)){
                parcelsExpressList = data
            } else {
                parcelsExpressList.push(data)
            }
            parcelsExpressList.forEach(element => {
                let routeMap = {};
                if (element && element.description){
                    let parcelList = [];
                    element.deliveryInfo.routeInfos.map(route => {
                        let routeInfosTemp = []
                        if (!routeMap[route.state] && route.remarkAndTime) {
                            routeInfosTemp = route.remarkAndTime.map(item=>{
                                item.showState = true;   
                                item.state = route.state
                                return item
                            })                         
                            routeMap[route.state] = route;
                        }
                        parcelList = parcelList.concat(routeInfosTemp)
                        return routeInfosTemp;
                    })
                    this.expressList.push(parcelList)                
                }           
            });
        },
        /**
         * 确定修改操作
         */
        confirmModify(data) {
            let param = {
                orderNo: this.orderNo,
                recordType: this.ordertypes,
                actorId: orderhandler.userInfo.userId || "",
                actorName: orderhandler.userInfo.mgrName || "",
                updateItems: [
                    {
                        key: data.type,
                        value: data.value,
                        remark: data.remark
                    }
                ],
                showLoading: false
            };
            this.$refs.orderStatus.loading = true;
            const promise = this.ordertypes == "SALE" ? orderhandler.updateByOperation(param) : orderhandler.updateByOperation1(param)
            promise.then(
                res => {
                    this.$refs.orderStatus.loading = false;
                    if (res.resultCode === 0) {
                        this.setHomeRefresh(true);
                        this.$refs.orderStatus.close();
                        this.getOrderDetail();
                    }
                },
                () => {
                    this.$refs.orderStatus.loading = false;
                    // console.log(rej)
                }
            );
        },
        /**
         * 确定提交操作日志
         */
        confirmOperate(data) {
            let param = {
                orderNo: this.orderNo,
                actorId: orderhandler.userInfo.userId || "",
                actorName: orderhandler.userInfo.mgrName || "",
                remark: data.value,
                recordType: this.ordertypes,
                showLoading: false
            };
            const promise = this.ordertypes == "SALE" ? orderhandler.logAction(param) : orderhandler.logAction1(param)
            promise.then(res => {
                if (res.resultCode === 0) {
                    this.getOrderDetail();
                    this.$refs.operateNote.reset();
                }
            });
        },
        /**
         * 查看订单详情
         */
        showDetail(orderNo) {
            this.setOrderNo(orderNo);
            this.setOrderType("SALE");
            this.$router.push({
                name: 'saleparent'
            });
        },
        /**
         * 阿拉伯数字转为中文数字
         */
        convertDigitToChinaNum(num){
            return utils.convertToChinaNum(num)
        },
        /**
         * 切换tab
         */
        tabChange(tab) {
            this.tabActive = tab.name;
        },   
        /**
         * 格式化供应商
         */
        supplierTypeFormat(val) {
            let mapSupplierType = {
                'JD':'京东',
                'EHSY':'西域'
            }
            if (val&&mapSupplierType[val]){
                return mapSupplierType[val]
            }
            
        }     
    }
};
</script>
<style lang="less">
.active {
    color: #478aee;
    cursor: pointer;
}
.order-detail {
    .title {
        color: black;
        font-size: 14px;
        font-weight: bold;
    }
    .order-info {
        padding: 12px 56px 0 56px;
        .info-text {
            display: inline-block;
            min-width: 356px;
            padding: 12px 32px 0 0;
        }
    }
    .parent-order-info {
        margin-top: 16px;
        border-top: 1px dashed #ebeef5;
        label {
            display: block;
            padding-top: 16px;
        }
    }
    .express-tabs{
        margin: 0 24px;
    }
    .no-express {
        display: flex;
        padding-top: 16px;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #999;
        .no-express-icon {
            display: inline-block;
            width: 120px;
            height: 121px;
            background: url("~assets/img_dafpage_no_express.png")
                no-repeat center;
        }
    }
    .invoice-info {
        padding-top: 16px;
        display: flex;
        .pre-info,
        .now-info {
            padding: 12px 0 0 56px;
            flex: 1;
        }
        .info-text {
            padding-top: 12px;
        }
        .RE_INVOICING,
        .UN_INVOICED {
            color: #f8a339;
        }
        .INVOICED,
        .RE_INVOICED {
            color: #23b45d;
        }
    }
    .info-title {
        color: #999;
        margin-right: 10px;
    }
    .clear-top {
        padding-top: 0;
    }
    .op-table {
        margin: 24px 24px 0 24px;
        width: inherit;
    }
}
</style>