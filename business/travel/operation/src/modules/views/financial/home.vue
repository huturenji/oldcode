<template>
    <div class="financialStatements">
        <div class="mailTopBox">
            <div class="mailTopTitle">
                <div>财务报表</div>
            </div>
            <div class="mailTopDesc">
                <div class="leftContent">小贴士</div>
                <div class="content">
                    {{topTips[0]}}
                    <Br />
                    {{topTips[1]}}
                    <Br />
                    {{topTips[2]}}
                </div>
            </div>
        </div>
        <div class="contionDiv">
            <div class="condition">
                <div>
                    <label class="condition-item">交易日期：</label>
                    <DatePicker
                        type="date"
                        :options="startTimeOptions"
                        id="PayBeginTimeID"
                        :clearable="false"
                        v-model="dateStart"
                        placement="bottom-end"
                        :placeholder="DatePlaceholder"
                        class="date-picker"
                        :transfer="true"
                    ></DatePicker>
                    <span class="date-split">至</span>
                    <DatePicker
                        type="date"
                        id="PayEndTimeID"
                        v-model="dateEnd"
                        :clearable="false"
                        :options="endTimeOptions"
                        placement="bottom-end"
                        :placeholder="DatePlaceholder"
                        class="date-picker"
                        :transfer="true"
                    ></DatePicker>
                </div>
                <div class="conditionP">
                    <label class="condition-item custlabel1">分销渠道：</label>
                    <Cascader
                        class="inCascader"
                        :data="productTypeArr"
                        v-model="requestParam.prodIdACompanyId"
                        :render-format="formatResultProd"
                        :load-data="loadData"
                        :clearable="false"
                    ></Cascader>
                </div>
                <div v-if="userTypeFlag" class="conditionP">
                    <label class="condition-item">出行类型（因公/因私）：</label>
                    <select v-model="requestParam.useType">
                        <option
                            v-for="type in useTypeList"
                            :key="type.value"
                            :value="type.value"
                        >{{type.text}}</option>
                    </select>
                </div>
            </div>
            <div class="condition">
                <div class="conditionP">
                    <label class="condition-item custlabel1">订单类型：</label>
                    <select v-model="requestParam.orderType">
                        <option
                            v-for="type in orderTypeList"
                            :key="type.value"
                            :value="type.value"
                        >{{type.text}}</option>
                    </select>
                </div>
                <div class="conditionP">
                    <label class="condition-item">供应商：</label>
                    <select v-model="requestParam.providerType">
                        <option
                            v-for="type in providerTypeList"
                            :key="type.value"
                            :value="type.value"
                        >{{type.text}}</option>
                    </select>
                </div>
                <div class="conditionP conditionPay">
                    <label class="condition-item">支付方式：</label>
                    <!-- <Cascader
                        class="CascaderClass"
                        :data="payTypeList"
                        v-model="requestParam.payTypes"
                        :render-format="formatResultPay"
                        :clearable="false"
                    ></Cascader> -->
                    <Select 
                        class="CascaderClass" 
                        v-model="requestParam.payTypes" 
                        multiple 
                        :max-tag-count="3">
							<Option 
                                v-for="type in payTypeList" 
                                :key="type.value" 
                                :value="type.value"
                            >
                            <div class="labelOption">{{type.label}}</div>
                            </Option>
                    </Select>                    
                </div>
                <div class="conditionP">
                    <label class="condition-item">状态：</label>
                    <select v-model="requestParam.orderState" class="selectType">
                        <option
                            v-for="type in orderStatusList"
                            :key="type.value"
                            :value="type.text"
                        >{{type.text}}</option>
                    </select>
                </div>
            </div>
            <div class="condition">
                <div class="btn-container conditionP">
                    <div class="clearButton cursorp" @click="clearAllParam">
                        <span>清空查询条件</span>
                    </div>
                    <div class="button cursorp" @click="searchOrder">查询</div>
                </div>
            </div>
        </div>

        <!-- 报表统计模块 -->
        <fshAmountStatistics :AmountStatisticsData="AmountStatisticsData"></fshAmountStatistics>
        <!-- 报表项目配置 -->
        <fshStatisticsListConfig
            :Conditions="Conditions"
            :CachedConditions="cachedConditions"
            :listCount="pageData.totalRecord"
            :exporting="isExportingExcel"
            @onSelected="changeListDisplay"
            @onExportClick="exportExcelFile"
        ></fshStatisticsListConfig>
        <!-- 报表列表数据 -->
        <div v-if="isLoadData" class="loading-container">
            <span>数据加载中...</span>
        </div>
        <div v-else class="content-result">
            <div class="empty-message" v-if="!finStatisticsList || finStatisticsList.length==0 || !selectedColumns || selectedColumns.length==0">
                <i class="icon"></i>
                {{(!finStatisticsList || finStatisticsList.length==0) ? pageTips:pageTipSelect}}
            </div>
            <div
                class="table"
                v-if="finStatisticsList && finStatisticsList.length>0 && !!selectedColumns && selectedColumns.length > 0"
            >
                <!-- 报表列表头部 -->
                <fshStatisticsListItem
                    :headerItemData="Conditions"
                    :selectedColumns="selectedColumns"
                    v-if="finStatisticsList && finStatisticsList.length>0"
                ></fshStatisticsListItem>
                <fshStatisticsListItem
                    v-for="(Item,index) in finStatisticsList"
                    :key="Item.orderState+Item.orderNo"
                    :itemData="Item"
                    :headerItemData="Conditions"
                    :lineNum="(index+1) + ((pageData.currPage-1) * pageData.pageSize)"
                    :selectedColumns="selectedColumns"
                    :orderTypeList="orderTypeList"
                ></fshStatisticsListItem>
            </div>
        </div>
        <div
            v-if="finStatisticsList && finStatisticsList.length>0 && !!selectedColumns && selectedColumns.length > 0"
            class="pageDiv"
        >
            <page :page="pageData" @turnPage="turnPage" class="myPage"></page>
        </div>
    </div>
</template>

<script>
import tmHandler from "bislibs/requesthandler/traveloperationhandler.js";
const fshAmountStatistics = () => import("./comp/amountstatistics.vue");
const fshStatisticsListItem = () => import("./comp/listitem.vue");
const fshStatisticsListConfig = () => import("./comp/listconfig.vue");
import utils from "bislibs/utils";
import  * as travelfun from "bislibs/traveloperationfun.js";
import page from "components/page/page";

var defaultFullVaule = -1;

export default {
    props: ["menuIndex"],
    directives: {},
    components: {
        page,
        fshAmountStatistics,
        fshStatisticsListItem,
        fshStatisticsListConfig
    },
    data() {
        return {
            dateStart: new Date(new Date().format("yyyy/MM") + "/01"),
            dateEnd: new Date(),
            requestParam: {
                payBeginTime: null, //预订日期从，格式yyyy-MM-dd
                payEndTime: null, //预订日期到，格式yyyy-MM-dd
                prodIdACompanyId: null, //分销渠道及连体
                channelId: defaultFullVaule, //分销渠道
                companyId: defaultFullVaule, //企业ID
                providerType: null, //供应商ID
                orderType: null, //订单类型，1. 机票订单 2. 酒店订单 3.火车票订单
                payTypes: null, //支付方式 微信支付=1，支付宝支付=2，企业支付=3，现付=6
                useType: null, //因公PUBLIC = 0 因私PRIVATE = 1
                orderState: null //JSONArray 不填表示全部订单；待支付 = UNPAID；待出行、退款单为 机票、火车票等状态集合
            },
            startTimeOptions: {
                // 起始日期禁用值
                disabledDate: date => {
                    let month12 = Date.now() - 31536000 * 1000;
                    // "";
                    return (
                        (date &&
                            this.dateEnd &&
                            date.valueOf() > this.dateEnd.getTime()) ||
                        date.valueOf() < month12
                    );
                }
            },
            endTimeOptions: {
                // 终止日期禁用值
                disabledDate: date => {
                    return (
                        (date &&
                            this.dateStart &&
                            date.valueOf() < this.dateStart.getTime()) ||
                        date.valueOf() > Date.now()
                    );
                }
            },
            //查询条件 end
            pageData: {
                pageSize: 10,
                currPage: 1,
                pageCount: 1,
                totalRecord: 0
            },
            orderStatusList: [
                //页面显示的订单状态
                {
                    value: defaultFullVaule,
                    text: "全部"
                }
            ],
            ticketFlyStatusList: [],
            ticketTraStatusList: [],            
            hotelStatusList: [],
            insStatusList: [],
            carStatusList: [],
            orderTypeList: [
                {
                    value: defaultFullVaule,
                    text: "全部"
                },
                {
                    // value: "1",
                    value:"ORDER_TYPE_FLIGHT",
                    text: "机票"
                },
                {
                    // value: "2",
                    value:"ORDER_TYPE_HOTEL",
                    text: "酒店"
                },
                {
                    // value: "3",
                    value:"ORDER_TYPE_TRAIN",
                    text: "火车票"
                },
                {
                    // value: "5",
                    value:"ORDER_TYPE_INSURANCE",
                    text: "保险"
                },
                {
                    // value: "6",
                    value:"ORDER_TYPE_CAR",
                    text: "打车"
                }
            ],
            useTypeList: [
                {
                    value: defaultFullVaule,
                    text: "全部"
                },
                {
                    // value: 0,
                    value: "PUBLIC",
                    text: "因公"
                },
                {
                    // value: 1,
                    value: "PRIVATE",
                    text: "因私"
                }
            ],
            payTypeList: [
                // {
                //     label: "全部",
                //     value: defaultFullVaule
                // }
            ],
            payTypeOffLine: {
                label: "到店付",
                value: "PAY_IN_CASH"
            },
            providerTypeList: [
                {
                    value: defaultFullVaule,
                    text: "全部"
                }
            ],
            productTypeArr: [
                {
                    value: defaultFullVaule,
                    label: "全部"
                }
            ],
            emptyCpy: {
                value: -2,
                label: "无企业"
            },
            DatePlaceholder: "请选择日期",
            pageTips: "未找到符合要求的数据，请修改条件重新查询", //页面的提示语
            pageTipSelect: "请选择您需要查看的项目类型", //页面的提示语 
            isLoadData: false, //是否是显示加载框
            // oncreateGoing: false, //在keep-alive为true的时候，解决activated偶尔不被触发的问题
            topTips: [
                "1、财务报表展示的是实时的数据；",
                "2、财务报表的数据展示所有发生交易的订单，不管取消失败与否；",
                "3、酒店到店付订单将在用户“已结账”后计入；"
            ], //顶部的提示小贴士
            AmountStatisticsData: {
                // TotalAmountReceivable: 15000,
                // AmountReceivableY2Y: 15,
                // AmountReceivableM2M: -6,
                // TotalAmountPayable: 15000,
                // AmountPayableY2Y: 15,
                // AmountPayableM2M: -6,
                // TotalProfit: 1000,
                // ProfitY2Y: 15,
                // ProfitM2M: -6
            },
            cachedConditionsKey: "conditionsKey",
            cachedConditions: [], //缓存的筛选条件
            Conditions: [], //筛选条件
            finStatisticsList: [],
            selectedColumns: [], //项目配置选中的数组
            isExportingExcel: false, //是否正常导出Excel
            userTypeFlag: utils.userTypeSwitch,
        };
    },
    created() {
        // console.info("finStatisticsList.created.oncreateGoing="+this.oncreateGoing);
        this.firstInitConditions();
        //给选择器参数添加默认值
        this.initPageData(1);
    },
    mounted() {
        // console.info("finStatisticsList.mounted.oncreateGoing="+this.oncreateGoing);
        this.firstInGetData();
    },
    deactivated() {},
    activated() {},
    watch: {
        "requestParam.orderType": function(val, oldVal) {
            let that = this; //选择了不同订单类型，状态也要跟着修改
            if (val != oldVal && !!val) {
                that.getOrderTypeList(val);
            }
        },
        "requestParam.prodIdACompanyId": {
            handler(val, oldVal) {
                // "";
                if (
                    (!!val && !!oldVal && val[0] != oldVal[0]) ||
                    (oldVal == null && !!val && val.length > 0)
                ) {
                    if (oldVal != null) {
                        //渠道ID切换之后，除了首次默认赋值“全部”选项，需要重新拉取支付方式,
                        this.getPaymentPlatformList(val[0]);
                    }
                    //渠道ID切换之后,清空除了当前选择的渠道之外的 所有的企业数据，企业数据需要重新拉取。
                    for (var i = 0; i < this.productTypeArr.length; i++) {
                        if (this.productTypeArr[i].value != val[0]) {
                            this.productTypeArr[i].children = [];
                        }
                    }
                }
            },
            deep: true
        }
    },
    methods: {
        /**
         * 点击导出Excel文件
         */
        exportExcelFile() {
            const that = this;
            let request = that.checkRequestFormData();
            that.isExportingExcel = true;
            tmHandler
                .exportFinancialStatements(request)
                .then(response => {
                    if (!!response.result && !!response.result.downloadUrl) {
                        let durl = response.result.downloadUrl
                        that.downloadExcelFile(durl, "商旅结算汇总报表.xlsx"); 
                    } else {
                        utils.showToast("导出文件失败");
                        that.isExportingExcel = false;
                    }
                })
                .catch(error => {
                    utils.showToast("导出文件失败");
                    that.isExportingExcel = true;
                });
        },
        /**
         * 下载Excel
         * @param url 下载地址，也可以是一个blob对象，必选
         * @param saveName 保存文件名，可选
         */
        downloadExcelFile(url, saveName) {
            const that = this
            var x = new XMLHttpRequest();
            x.open("GET", url, true);
            x.responseType = 'blob';
            x.onload = function (e) {
                that.isExportingExcel = false;
                
                var url = window.URL.createObjectURL(x.response)
                var a = document.createElement('a');
                a.href = url
                a.download = saveName;
                a.click()
                
            }
            x.send();            
        },
        /**
         * 修改了已选择的字段列表
         */
        changeListDisplay(selectArr) {
            this.selectedColumns = selectArr;
            utils.setStorage(
                this.cachedConditionsKey,
                JSON.stringify(this.selectedColumns)
            );
        },
        initPageData(whereFrom) {
            const that = this;
            //给选择器参数添加默认值
            that.requestParam.useType = that.useTypeList[0].value;
            that.requestParam.orderType = that.orderTypeList[0].value;
            that.requestParam.payTypes = [];
            //  that.requestParam.payTypes = [that.payTypeList[0].value];
            that.requestParam.providerType = that.providerTypeList[0].value;
            that.requestParam.orderState = that.orderStatusList[0].text;
            that.requestParam.prodIdACompanyId = [that.productTypeArr[0].value];
            that.requestParam.prodIdACompanyId = [that.productTypeArr[0].value];
            that.dateStart = new Date(new Date().format("yyyy/MM") + "/01"),
            that.dateEnd = new Date(),
            //日期控件选中样式监听
            $(".ivu-date-picker")
                .on("focus", ".ivu-input", function(event) {
                    let $icon = $(event.currentTarget).siblings(
                        ".ivu-input-icon"
                    );
                    $icon.addClass("selected");
                })
                .on("blur", ".ivu-input", function(event) {
                    let $icon = $(event.currentTarget).siblings(
                        ".ivu-input-icon"
                    );
                    $icon.removeClass("selected");
                });

            //为日期控件加上placeholder（自带的不生效）
            $(".ivu-date-picker .ivu-input").attr(
                "placeholder",
                that.DatePlaceholder
            );
        },
        /**
         * 获取筛选配置数据
         */
        firstInitConditions() {
            const that = this;
            if (!(that.Conditions && that.Conditions.length > 0)) {
                //默认拉取配置
                that.Conditions = utils.getConditionNames();
            }
            //首次进入页面，先获取一下缓存
            that.cachedConditions = JSON.parse(
                utils.getStorage(this.cachedConditionsKey)
            );
        },
        firstInGetData() {
            //获取所有的订单状态
            this.getFSOrderStatus();
            //获取分销商列表
            this.getOrderProdIds();
            //获取查询供应商列表
            this.getProviderInfos();
            //获取全部的支付方式
            this.getPaymentPlatformList();
            //默认进入首页，拉取一次全部的数据
            this.getData();
        },
        /**
         * 指定页码翻页跳转
         * @param newPageNum 页码
         */
        turnPage(newPageNum) {
            // console.info(newPageNum);
            this.pageData.currPage = parseInt(newPageNum);
            this.getStatisticsList();
        },
        /**
         * 对页面的查询请求参数做特殊处理
         */
        checkRequestFormData() {
            const that = this;
            //iview的DatePicker在这里使用有点问题，如果用v-model的话会出现很怪异的现象，其他的事件也使用不正常
            //所以暂用这种笨方式获取时间
            that.requestParam.payBeginTime = $(
                "#PayBeginTimeID .ivu-input"
            ).val();
            that.requestParam.payEndTime = $("#PayEndTimeID .ivu-input").val();

            let request = JSON.parse(JSON.stringify(that.requestParam));
            //级联操作，赋值渠道ID和公司ID
            if (
                request.prodIdACompanyId[0] == defaultFullVaule ||
                request.prodIdACompanyId == null
            ) {
                delete request["prodIdACompanyId"];
            } else {
                request.channelId = request.prodIdACompanyId[0];
                let companyId =
                    request.prodIdACompanyId[
                        request.prodIdACompanyId.length - 1
                    ];
                if (
                    !(
                        companyId == null ||
                        companyId == defaultFullVaule ||
                        companyId < 0
                    )
                ) {
                    request.companyId = companyId;
                }
                delete request["prodIdACompanyId"];
            }
            //支付方式是数组，需要特殊处理，
            if (request.payTypes.length > 0) {
                // request.payType = request.payTypes[request.payTypes.length - 1];
            }else{
                delete request["payTypes"];
            }
            //去掉所以值为-1的字段，
            for (var key in request) {
                if (
                    request[key] == defaultFullVaule ||
                    request[key] == "全部"
                ) {
                    delete request[key];
                }
            }
            if(request.providerType){
                request.providerType =  request.providerType+""
            }
            return request;
        },
        getData() {
            this.getAmountStatistics();
            this.getStatisticsList();
        },
        /**
         * 金额数据统计
         */
        getAmountStatistics() {
            const that = this;
            let request = that.checkRequestFormData();

            tmHandler.getAmountStatistics(request).then(response => {
                if (!!response.result) {
                    that.AmountStatisticsData = response.result;
                }
            });
        },
        //分页获取数据
        getStatisticsList() {
            let that = this;
            let request = that.checkRequestFormData();
            request.pageSize = that.pageData.pageSize;
            request.pageNum = that.pageData.currPage;

            //页面查询的时候，提示正在加载中
            that.isLoadData = true;
            tmHandler.getFinancialStatementsList(request).then(
                function(res) {
                    that.isLoadData = false;
                    if (0 == res.resultCode) {
                        that.pageData.totalRecord = res.result.total;
                        that.pageData.pageCount = res.result.pages;

                        if (
                            !!res.result.financialStatementList &&
                            res.result.financialStatementList.length > 0
                        ) {
                            let data = res.result.financialStatementList;
                            that.finStatisticsList = data;
                        } else {
                            console.info(res);
                            that.finStatisticsList &&
                                that.finStatisticsList.splice(0);
                        }
                    } else {
                        console.info(res);
                        that.finStatisticsList &&
                            that.finStatisticsList.splice(0);
                    }
                },
                function(error) {
                    that.isLoadData = false;
                    console.info(error);
                    that.finStatisticsList && that.finStatisticsList.splice(0);
                }
            );
        },        
        /**
         * 获取所有的订单状态
         */
        getFSOrderStatus() {
            let that = this;
            let request = {}
            tmHandler.getFSOrderStatus(request).then(
                function(res) {
                    if (0 == res.resultCode && res.result.orderStatusOfAllType) {  
                        res.result.orderStatusOfAllType.forEach((item)=>{
                            let key = item.key
                            let statusArr = item.value;
 
                            if(key=="ORDER_TYPE_FLIGHT"){
                                that.putOrderStatusArr(that.ticketFlyStatusList, statusArr, key)
                            }else if(key=="ORDER_TYPE_HOTEL"){
                                that.putOrderStatusArr(that.hotelStatusList, statusArr, key)
                            }else if(key=="ORDER_TYPE_TRAIN"){
                                that.putOrderStatusArr(that.ticketTraStatusList, statusArr, key)
                            }else if(key=="ORDER_TYPE_INSURANCE"){
                                that.putOrderStatusArr(that.insStatusList, statusArr, key)
                            }else if(key=="ORDER_TYPE_CAR"){
                                that.putOrderStatusArr(that.carStatusList, statusArr, key)
                            }else{
                                console.info("data error");
                            }
                        })
                    } else {
                        console.info(res);
                    }
                },
                function(error) {
                     console.info(error);
                }
            );
        }, 
        /**
         * 给订单状态赋值
         */
        putOrderStatusArr(arrayTo,arrayFrom,key){
            if(!arrayTo || !arrayFrom){
                return;
            }
            for(let i=0;i<arrayFrom.length;i++){
                let temp = {
                    value:key+i,
                    text:arrayFrom[i]
                }
                arrayTo.push(temp)
            }
        },       
        /**
         * 查询分销商渠道
         */
        getOrderProdIds() {
            let that = this;
            travelfun.getAllChannels().then(
                function(res) {
                    if (0 == res.resultCode && !!res.result.channelInfos) {
                        that.productTypeArr = that.productTypeArr.concat(
                            travelfun.getCascaderList(res.result.channelInfos)
                        );
                    }
                },
                function(error) {
                    console.info(error);
                }
            );
        },

        /**
         * 查询供应商渠道
         */
        getProviderInfos() {
            let that = this;
            travelfun.getProviderInfos4Net().then(
                function(res) {
                    if (0 == res.resultCode && !!res.result.providerInfos) {
                        let providerList = res.result.providerInfos;
                        providerList.forEach(provider => {
                            let item = {
                                value: provider.providerEnName,
                                text: provider.providerShortName
                            };
                            that.providerTypeList.push(item);
                        });
                    }
                },
                function(error) {
                    console.info(error);
                }
            );
        },
        /**
         * 查询支付方式
         */
        getPaymentPlatformList(productionChannelId) {
            let that = this;
            let request = {
                productionChannelId:
                    !!productionChannelId && parseInt(productionChannelId) > 0
                        ? productionChannelId
                        : undefined
            };
            tmHandler.getPaymentPlatforms(request).then(
                function(res) {
                    //先清除列表，添加默认的 全部 选项卡
                    that.payTypeList.splice(0, that.payTypeList.length);
                    // let defaultFull = {
                    //     label: "全部",
                    //     value: defaultFullVaule
                    // };
                    // that.payTypeList.push(defaultFull);
                    //默认赋值
                    // that.payType = [that.payTypeList[0].value];
                    that.payTypes = [];

                    if (0 == res.resultCode && !!res.result) {
                        let paymentList = res.result.payTypes;

                        for (let i = 0; i < paymentList.length; i++) {
                            var payment = paymentList[i];
                            //现付、也就是 信用卡支付，过滤掉
                            if (payment.payType == 6) {
                                continue;
                            }
                            //1=开启才是有效的
                            let arrItem = {};
                            arrItem.label = payment.payTypeName;
                            arrItem.value = payment.payType;
                            that.payTypeList.push(arrItem);
                        }
                        //没有获取到渠道的支付方式，不添加 到店付 选择
                        if (that.payTypeList.length > 1) {
                            that.payTypeList.push(that.payTypeOffLine);
                        }
                    }
                },
                function(error) {
                    console.info(error);
                }
            );
        },
        /**
         * 设置状态数组
         */
        getOrderTypeList(key) {
            if (key=="ORDER_TYPE_FLIGHT") {
                this.orderStatusList.splice(1, this.orderStatusList.length - 1);
                this.orderStatusList = this.orderStatusList.concat(
                    this.ticketFlyStatusList
                );
            } else if (key=="ORDER_TYPE_HOTEL") {
                this.orderStatusList.splice(1, this.orderStatusList.length - 1);
                this.orderStatusList = this.orderStatusList.concat(
                    this.hotelStatusList
                );
            }else if (key=="ORDER_TYPE_TRAIN") {
                this.orderStatusList.splice(1, this.orderStatusList.length - 1);
                this.orderStatusList = this.orderStatusList.concat(
                    this.ticketTraStatusList
                );
            } else if (key=="ORDER_TYPE_INSURANCE") {
                this.orderStatusList.splice(1, this.orderStatusList.length - 1);
                this.orderStatusList = this.orderStatusList.concat(
                    this.insStatusList
                );
            } else if (key=="ORDER_TYPE_CAR") {
                this.orderStatusList.splice(1, this.orderStatusList.length - 1);
                this.orderStatusList = this.orderStatusList.concat(
                    this.carStatusList
                );
            } else {
                this.orderStatusList.splice(1, this.orderStatusList.length - 1);
                console.info("getOrderTypeList.." + key);
            }
            this.requestParam.orderState = this.orderStatusList[0].text;
        },
        /**
         * 清空查询条件
         */
        clearAllParam() {
            let that = this;
            that.initPageData(2);
        },
        /**
         * 点击查询按钮
         */
        searchOrder() {
            let that = this;
            //每次点击按妞查询，需要翻页重置
            that.pageData.currPage = 1;

            that.getData();
        },
        /**
         * 级联操作的选择结果显示内容和方式
         */
        formatResultPay(labels, selectedData) {
            let result = "";
            for (let i = 0; i < labels.length; i++) {
                result += labels[i] + "";
            }
            return result;
        },
        formatResultProd(labels, selectedData) {
            let result = "";
            for (let i = 0; i < labels.length; i++) {
                result += (i > 0 ? "--" : "") + labels[i];
            }
            return result;
        },
        /**
         * 异步加载数据
         */
        loadData(item, callback) {
            const that = this;
            if (!!callback) {
                item.loading = true;
            }
            var itemChild = [{ value: defaultFullVaule, label: "全部企业" }];
            travelfun.getOrderCompanyList4Net(item.value).then(
                function(res) {
                    if (0 == res.resultCode && !!res.result.companyNames) {
                        if (res.result.companyNames.length == 0) {
                            itemChild.splice(0, 1, that.emptyCpy);
                        } else {
                            itemChild = itemChild.concat(
                                travelfun.getCascaderList(res.result.companyNames, false)
                            );
                        }
                    }
                    item.children = itemChild;
                    if (!!callback) {
                        item.loading = false;
                        callback();
                    }
                },
                function(error) {
                    console.info(error);
                    item.children = itemChild;
                    if (!!callback) {
                        item.loading = false;
                        callback();
                    }
                }
            );
        }
    }
};
</script>
<style scoped lang="less">
@import "home.less";
</style>
<style>
@import "~styles/myiview.less";
</style>