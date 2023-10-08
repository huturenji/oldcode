<template>
    <div class="abnormalOrderListFlight">
        <div class="headTitle">异常机票</div>
        <orderListPage
            orderType="AbnormalFlight"
            :tabList="tabList"
            :pageData="pageData"
            :orderList="orderList"
            :isLoadData="isLoadData"
            :totalRecord="totalRecord"
            :filterParam="filterParam"
            :mailPreData="mailPreData"
            @turnPage="turnPage"
            @refreshPage="refreshPage"
            @onQueryClick="onQueryClick"
            @onTabSelected="onTabSelected"
            @getSenderInfos="getSenderInfos"
        ></orderListPage>
    </div>
</template>

<script>
const orderListPage = () => import("biscomponents/orderlist/listpage.vue");
import utils from "bislibs/utils";
import  * as travelfun from "bislibs/traveloperationfun.js";
import tmHandler from "bislibs/requesthandler/traveloperationhandler.js";

export default {
    props: ["menuIndex"],
    directives: {},
    components: {
        orderListPage
    },
    data() {
        let pageSizeDefind = 20;
        return {
            isLoadData: true, //是否显示列表的加载框
            pageData: {
                pageDataSize: pageSizeDefind, //分页的每页数据量，由 调用者 指定
                pageDataCount: 1, //分页的总页数，由 调用者 指定
                pageDataIndex: 1 //分页-页码
            },
            formDataBase: {
                //接口请求body
                hasException: 1, //B+平台订单是否有异常，1=有，0=没有。
                bpProductType: 1, //写死，标识 机票
                pageIndex: 1, //分页-页码
                pageSize: pageSizeDefind //分页-数据量
            },
            formDataFilter: null, //筛选组件的输出参数
            formDataFull: null, //全量的参数
            orderList: [], //订单列表
            totalRecord: 0, //订单总数
            mailPreData: {
                expressCompanies: [], //快递公司列表
                proviceCityCounty: [], //省市区列表
                senderAddressList: [] //常用地址列表
            }, //邮寄前置数据
            oncreateGoing: false, //在keep-alive为true的时候，解决activated偶尔不被触发的问题
            filterParam: null, //顶部的条件筛选区，跳转过来带参数的数据
            isNeedMailData:false,//是否需要邮寄相关数据
        };
    },
    computed: {
        //中部tab选择组件
        tabList: function() {
            return [
                // {
                //     name: "全部",
                //     showPop: false
                // },
                // {
                //     name: "待支付",
                //     showPop: false
                // },
                // {
                //     name: "待出行",
                //     showPop: false
                // },
                // {
                //     name: "退款/售后",
                //     showPop: false
                // },
                // {
                //     name: "已取消",
                //     showPop: false
                // },
                // {
                //     name: "已开报销凭证",
                //     showPop: true
                // }
            ];
        }
    },
    created() {
        // console.info("orderlist.created.oncreateGoing=" + this.oncreateGoing);
        //给选择器参数添加默认值
        this.initPageData();
    },
    mounted() {
        //console.info("orderlist.mounted.oncreateGoing=" + this.oncreateGoing);
        this.refreshOrdersHasQuery();
    },
    deactivated() {
        // console.info(
        //     "orderlist.deactivated.oncreateGoing=" + this.oncreateGoing
        // );
        this.oncreateGoing = false;
    },
    activated() {
        // console.info("orderlist.activated.oncreateGoing=" + this.oncreateGoing);
        if (!this.oncreateGoing && utils.getStorage("notUpdateList") != 1) {
            this.refreshOrdersHasQuery();
        } else {
            this.oncreateGoing = false;
        }
    },
    watch: {
        orderList: {
            handler(val) {
                //当列表数据发生变化的时候，向父组件上报数据的size，用于菜单栏的红点显示
                if (this.orderList.length > 0) {
                    this.$emit(
                        "emitData",
                        this.menuIndex,
                        this.orderList.length
                    );
                }
            },
            deep: true
        },
        formDataBase: {
            handler(val) {
                let that = this;
                // console.log(
                //     "watch.formDataBase..val=" +
                //         JSON.stringify(val) +
                //         ",formDataFilter=" +
                //         JSON.stringify(that.formDataFilter)
                // );
                that.pageData.pageDataIndex = val.pageIndex;

                that.formDataFull = Object.assign({}, val, that.formDataFilter);
            },
            deep: true
        },
        formDataFilter: {
            handler(val) {
                let that = this;
                // console.log(
                //     "watch.formDataFilter..val=" +
                //         JSON.stringify(val) +
                //         ",formDataBase=" +
                //         JSON.stringify(that.formDataBase)
                // );
                that.formDataFull = Object.assign({}, val, that.formDataBase);
                // console.log(
                //     "watch.formDataFilter..formDataFilter=" +
                //         JSON.stringify(that.formDataFilter)
                // );
            },
            deep: true
        },
        formDataFull: {
            handler(val) {
                let that = this;
                // console.log(
                //     "watch.formDataFull..val=" +
                //         JSON.stringify(val) +
                //         ",formDataBase=" +
                //         JSON.stringify(that.formDataBase) +
                //         ",formDataFilter=" +
                //         JSON.stringify(that.formDataFilter)
                // );
                that.getListData();
            },
            deep: true
        }
    },
    beforeRouteEnter(to, from, next) {
        //从订单详情返回的，不刷新列表数据
        // console.info("beforeRouteEnter.notUpdateList=");
        if (from.path == "/order/orderDetail") {
            //标记是否刷新列表页面，用于keep-alive为true的时候，activated被触发但不需要数据刷新的时候
            utils.setStorage("notUpdateList", 1);
        } else {
            utils.setStorage("notUpdateList", 0);
        }
        next();
    },

    methods: {
        refreshOrdersHasQuery() {
            this.filterParam = {
                orderBeginTime: this.$route.query.orderBeginTime,
                orderEndTime: this.$route.query.orderEndTime,
                useType: this.$route.query.useType,
                companyId: this.$route.query.companyId,
                channelId: this.$route.query.channelId
            };
        },
        initPageData() {
            this.oncreateGoing = true;
            if(this.isNeedMailData){
                //查询省市区
                this.getProvinceCityCounty();
                //获取快递公司列表
                this.getExpressCpyList();
            }
        },
        /**
         * 切换订单状态标签
         * @param tabIndex
         */
        onTabSelected(tabIndex) {
            let that = this;
            // "";
            let result;
            switch (tabIndex) {
                case 1:
                    result = travelfun.getStatusByCategoryUniq("t21");
                    break;
                case 2:
                    result = travelfun.getStatusByCategoryUniq("t22");
                    break;
                case 3:
                    result = travelfun.getStatusByCategoryUniq("t23");
                    break;
                case 4:
                    result = travelfun.getStatusByCategoryUniq("t24");
                    break;
                case 5:
                    result = travelfun.getStatusByCategoryUniq("t25");
                    break;
                case 0:
                default:
                    result = undefined;
                    break;
            }
            //给请求体 赋值 订单状态
            that.formDataBase.orderStatus = result;
            that.formDataBase.pageIndex = 1;
            //重新查询
            // console.info("onTabSelected.getListData");
        },

        /**
         * 设置订单的产品类别
         * 注意：动态组件的名字使用typeCode匹配的，所以typeCode值的首字母需要大写（拼接的时候没有做大小写转换）
         * @param arr 订单列表
         * @param typeCode 产品名字
         * @param typeName 产品Code
         * @returns {*}
         */
        setOrderType(arr, typeCode, typeName) {
            if (!arr) {
                return arr;
            }
            for (let i in arr) {
                arr[i].type = typeName;
                arr[i].typeCode = typeCode;
                arr[i].isAbnormal = true;
            }
            return arr;
        },
        //分页获取数据
        getListData() {
            let that = this;
            // if (that.isLoadData) {
            //     // console.info("isLoadData");
            //     return;
            // }

            let resquestBody = JSON.parse(JSON.stringify(that.formDataFull));
            that.isLoadData = true;
            tmHandler.getBpOrderForPlatforms(resquestBody).then(
                function(res) {
                    if (0 == res.resultCode) {
                        //每次查询，都要调用常用地址
                        // ""
                        if(that.isNeedMailData){
                            that.getSenderInfos();
                        }

                        let data = res.result;
                        that.totalRecord = res.result.totalRecord;
                        that.pageData.pageDataCount = res.result.totalPageCount;

                        let flightOrders =
                            that.setOrderType(
                                data.flightOrders,
                                utils.getBusinessType(0).typeCode,
                                utils.getBusinessType(0).typeName
                            ) || []; //机票订单 注意Flight首字母大写
                        let trainOrders =
                            that.setOrderType(
                                data.trainOrders,
                                utils.getBusinessType(1).typeCode,
                                utils.getBusinessType(1).typeName
                            ) || []; //火车票订单 注意Train首字母大写
                        let hotelOrders =
                            that.setOrderType(
                                data.hotelOrders,
                                utils.getBusinessType(2).typeCode,
                                utils.getBusinessType(2).typeName
                            ) || []; //酒店订单 注意Hotel首字母大写
                        //所有产品的订单合并，并按下单时间倒序
                        let orderArr = flightOrders
                            .concat(trainOrders)
                            .concat(hotelOrders);
                        // console.log('orderArr.length =' + orderArr.length);
                        orderArr &&
                            orderArr.sort(function(order1, order2) {
                                let time1 = order1 && order1.orderTime;
                                let time2 = order2 && order2.orderTime;
                                if (!time1 || !time2) {
                                    return 0;
                                }
                                if (time1 < time2) {
                                    return 1;
                                } else if (time1 > time2) {
                                    return -1;
                                } else {
                                    return 0;
                                }
                            });
                        that.orderList = orderArr;
                        that.isLoadData = false;
                    } else {
                        console.info(res);
                        that.orderList && that.orderList.splice(0);
                        that.isLoadData = false;
                    }
                },
                function(error) {
                    console.info(error);
                    that.orderList && that.orderList.splice(0);
                    that.isLoadData = false;
                }
            );
        },

        /**
         * 查询快递公司
         */
        getExpressCpyList() {
            let that = this;
            travelfun.getExpressCpyList4Net().then(
                function(res) {
                    if (0 == res.resultCode) {
                        that.mailPreData.expressCompanies =
                            res.result.expressCompanies;
                    }
                },
                function(error) {
                    console.info(error);
                }
            );
        },

        /**
         * 列表上操作某一条Item后，刷新页面
         * @param pageObj 页码
         */
        refreshPage(pageObj) {
            let that = this;
            console.info("refreshPage.getListData");
            that.getListData();
        },

        /**
         * 指定页码翻页跳转
         * @param pageObj 页码
         */
        turnPage(pageObj) {
            let that = this;
            // console.info("turnPage.getListData");
            that.formDataBase.pageIndex = pageObj && pageObj.currPage;
        },
        /**
         * 点击 查询 筛选区
         */
        onQueryClick(outData) {
            let that = this;
            if (!!outData) {
                // "";
                that.formDataBase.pageIndex = 1;
                that.formDataFilter = outData;
                //重新查询
                // console.info("onQueryClick.getListData");
            } else {
                console.log("onQueryClick get error");
            }
        },
        /**
         * 查询全国省市区
         */
        getProvinceCityCounty() {
            let that = this;
            travelfun.getProvinceCityCounty4Net().then(
                function(res) {
                    if (0 == res.resultCode) {
                        that.mailPreData.proviceCityCounty =
                            res.result.proviceCityCounty;
                    }
                },
                function(error) {
                    console.info(error);
                }
            );
        },
        /**
         * 查询寄件人地址信息列表
         */
        getSenderInfos() {
            
            let that = this;
            let request = {
                // orderNo: orderNo
                channelId:'1'
            };

            tmHandler.getSenderInfos(request).then(
                function(res) {
                    if (0 == res.resultCode && !!res.result.senderInfos) {
                        that.mailPreData.senderAddressList =
                            res.result.senderInfos || [];
                    } else {
                        console.info(res);
                        // utils.showToast("获取失败");
                    }
                },
                function(error) {
                    console.info(error);
                }
            );
        }
    }
};
</script>
<style scoped lang="less">
.abnormalOrderListFlight {
    background: white;
    .headTitle {
        color: #191919;
        font-weight: bold;
        font-size: 18px;
        padding: 15px 0 0 30px;
    }
}
</style>

