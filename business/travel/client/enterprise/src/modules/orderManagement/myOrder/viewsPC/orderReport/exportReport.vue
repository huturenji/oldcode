<template>
    <div class="export-report-list">
        <div class="exportOrders">
            <div class="conditions">
                <div class="detail">
                    <span>{{scheduledTime}}</span>
                    <!-- <span>部门：{{!!travelDept?travelDept:"全部"}}</span> -->
                </div>
            </div>
            <LoadingX v-if="isLoading" class="loading-container" />
            <div v-else class="content-result">
                <div class="empty-message" v-if="!orderList || orderList.length==0">
                    <i class="icon"></i>
                    未找到符合要求订单，请退回上一页
                </div>
                <div class="no-empty-content" v-else-if="orderList && orderList.length>0">
                    <table class="orderList">
                        <tr class="listLine">
                            <td>{{tableArray[0]}}</td>
                            <td>{{tableArray[1]}}</td>
                            <td>{{tableArray[2]}}</td>
                            <td>{{tableArray[3]}}</td>
                            <td>{{tableArray[4]}}</td>
                            <td>{{tableArray[5]}}</td>
                            <td>{{tableArray[6]}}</td>
                            <td>{{tableArray[7]}}</td>
                            <td>{{tableArray[8]}}</td>
                            <td>{{tableArray[9]}}</td>
                            <td>{{tableArray[10]}}</td>
                        </tr>
                        <tr class="listLine" v-for="(orderItem, index) in orderList" :key="orderItem.orderNo">
                            <td>{{index+1}}</td>
                            <td>
                                <div class="wraper">
                                    <span>{{getOrderNo(orderItem)}}</span>
                                    <span class="dialog">{{getOrderNo(orderItem)}}</span>
                                </div>
                            </td>
                            <td>
                                <div class="wraper">
                                    <span>{{getScheduledPersonName(orderItem)}}</span>
                                    <span class="dialog">{{getScheduledPersonName(orderItem)}}</span>
                                </div>
                            </td>
                            <td>
                                <div class="wraper">
                                    <span>{{getOrgName(orderItem)}}</span>
                                    <span class="dialog">{{getOrgName(orderItem)}}</span>
                                </div>
                            </td>
                            <td>
                                <div class="wraper">
                                    <span>{{getOrderTime(orderItem)}}</span>
                                    <span class="dialog">{{getOrderTimeDialog(orderItem)}}</span>
                                </div>
                            </td>
                            <td>
                                <div class="wraper">
                                    <span>{{getDepartTime(orderItem)}}</span>
                                    <span class="dialog">{{getDepartTimeDialog(orderItem)}}</span>
                                </div>
                            </td>
                            <td>
                                <div class="wraper">
                                    <span>{{getOrderPeople(orderItem)}}</span>
                                    <span class="dialog">{{getOrderPeople(orderItem)}}</span>
                                </div>
                            </td>
                            <td>
                                <div class="wraper">
                                    <span>{{getOrderType(orderItem)}}</span>
                                    <span class="dialog">{{getOrderType(orderItem)}}</span>
                                </div>
                            </td>
                            <td>
                                <div class="wraper">
                                    <span>{{getOrderFT(orderItem)}}</span>
                                    <span class="dialog">{{getOrderFT(orderItem)}}</span>
                                </div>
                            </td>
                            <td>
                                <div class="wraper">
                                    <span>{{getPayAmount(orderItem)}}</span>
                                    <span class="dialog">{{getPayAmount(orderItem)}}</span>
                                </div>
                            </td>
                            <td>
                                <div class="wraper">
                                    <span>{{getPayType(orderItem)}}</span>
                                    <span class="dialog">{{getPayType(orderItem)}}</span>
                                </div>
                            </td>
                        </tr>
                    </table>
                    <page :page="page" @turnPage="turnPage" class="exportPage"></page>
                </div>
            </div>
            <div class="action actionNormal" v-if="orderListToExport && orderListToExport.length>0">
                <a :href="exportUrl" :download="'导出订单列表'+new Date().format('yyyy/MM/dd HH:mm:ss')+'.xlsx'">导出至Excel</a>
            </div>
        </div>
    </div>
</template>

<script>
import requestHandler from 'orderCommon/requestHandler.js';
import page from '../orderList/page';
import LoadingX from "components/loading/LoadingX.vue";
// import { getStatusByCategory } from 'orderCommon/enum/orderStatusEnum.js';

export default {
    components: {
        page, LoadingX
    },
    mixins: [requestHandler.mixin.tChatEventMixin],
    props: ['isPc', 'isFullScreen'],
    data() {
        return {
            isLoading: false,
            queryParam: {},//传过来的查询条件
            page: {
                pageSize: 5,
                currPage: 1,
                pageCount: 1,
                totalRecord: 0
            },
            travelDept: this.$route.query.deptName || null,
            orderList: [],//页面上显示的订单，有翻页
            orderListToExport: [],//要导出的订单，不需要展示
            exportUrl: "",//导出Excel的下载地址
            tableArray: ['序号', '订单号', '预订人', '部门', '预订时间', '出行时间',
                '乘客/入住人/被保人', '产品', '订单', '金额', '支付方式']
        }
    },
    computed: {
        scheduledTime: function () {
            let _this = this;
            return (!!_this.queryParam.scheduledBeginTime && !!_this.queryParam.scheduledEndTime) ? (_this.queryParam.scheduledBeginTime + " 至 " + _this.queryParam.scheduledEndTime) : "";
        }
    },
    activated() {
        let _this = this;
        //注册并监听t信返回事件，解决T信上返回事件不正确的问题，改用vue的路由来回退

        // requestHandler.appBack(function (data) {//点击app返回事件
        //     requestHandler.throttle(function () {
        //         // goBackPage('');
        //         _this.$router.back();
        //     }, this);
        // }.bind(this));
        _this.$emit('showOff', true);
        //重写T信上的页面刷新，只初始化数据，不重新加载页面（否则在某些情况下会出现问题）
        // requestHandler.reFreshPage(() => {
        //     _this.requestHandler.reFreshPage();
        // });
    },
    created() {
        // document.getElementsByTagName('html')[0].style.setProperty('font-size', '100px', 'important');//PC端样式要统一放大
        // $('html').css('font-size','100px !important');
        let _this = this;
        document.title = '订单明细';
        //从缓存获取上一页的参数数据
        _this.queryParam = JSON.parse(requestHandler.getStorage("exportParam"));
        _this.getExportDatas();
        _this.getData();
        //注册并监听t信返回事件，解决T信上返回事件不正确的问题，改用vue的路由来回退

        // requestHandler.appBack(function (data) {//点击app返回事件
        //     requestHandler.throttle(function () {
        //         _this.$router.back();
        //         // goBackPage('');
        //     }, this);
        // }.bind(this));
        _this.$emit('showOff', true);
        //重写T信上的页面刷新，只初始化数据，不重新加载页面（否则在某些情况下会出现问题）
        // requestHandler.reFreshPage(() => {
        //     _this.requestHandler.reFreshPage();
        // });
    },
    mounted() {
    },
    watch: {},
    methods: {
        goBackFun(){
            this.$router.back();
        },
        /**
             * 指定页码翻页跳转
             * @param newPageNum 页码
             */
        turnPage(newPageNum) {
            let _this = this;
            console.info(newPageNum);
            _this.page.currPage = newPageNum;
            _this.getData();
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
            }
            return arr;
        },
        //获取导出的数据，需要一次性把所有的数据拉下来
        getExportDatas() {
            let _this = this;
            //把每一页的大小改成上一页的总数量
            let exportParams = JSON.parse(JSON.stringify(_this.queryParam));
            exportParams.pageSize = _this.$route.query.queryPageSize;
            exportParams.pageIndex = 1;
            // delete exportParams.payStatus
            requestHandler.getOrderOfAllTypes(exportParams).then(function (res) {
                let data = res.result;
                let flightOrders = _this.setOrderType(data.flightOrders, 'Flight', '机票') || [];//机票订单 注意Flight首字母大写
                let trainOrders = _this.setOrderType(data.trainOrders, 'Train', '火车票') || [];//火车票订单 注意Train首字母大写
                let hotelOrders = _this.setOrderType(data.hotelOrders, 'Hotel', '酒店') || [];//酒店订单 注意Hotel首字母大写
                let insuranceOrders = _this.setOrderType(data.insuranceOrders, 'Insurance', '保险') || [];//保险订单
                //所有产品的订单合并，并按下单时间倒序
                let orderArr = flightOrders.concat(trainOrders).concat(hotelOrders).concat(insuranceOrders);
                orderArr && orderArr.sort(function (order1, order2) {
                    let time1 = order1 && order1.orderTime;
                    let time2 = order2 && order2.orderTime;
                    if (!time1 || !time2) {
                        return 0;
                    }
                    if (time1 < time2) {
                        return 1;
                    } else if (time1 > time2) {
                        return -1;
                    } 
                    return 0;
                        
                });
                _this.orderListToExport = orderArr;
                setTimeout(() => {
                    _this.toExportOrdersForArray();
                }, 500);
            }).catch(() => {
                _this.isLoading = false;
                _this.orderListToExport && _this.orderListToExport.splice(0);
            });
        },
        //分页获取数据
        getData() {
            let _this = this;
            //把每一页的大小改成上一页的总数量
            _this.queryParam.pageSize = _this.page.pageSize;
            _this.queryParam.pageIndex = _this.page.currPage;

            _this.isLoading = true;
            // delete _this.queryParam.payStatus
            requestHandler.getOrderOfAllTypes(_this.queryParam).then(function (res) {
                _this.isLoading = false;
                let data = res.result;
                let flightOrders = _this.setOrderType(data.flightOrders, 'Flight', '机票') || [];//机票订单 注意Flight首字母大写
                let trainOrders = _this.setOrderType(data.trainOrders, 'Train', '火车票') || [];//火车票订单 注意Train首字母大写
                let hotelOrders = _this.setOrderType(data.hotelOrders, 'Hotel', '酒店') || [];//酒店订单 注意Hotel首字母大写
                let insuranceOrders = _this.setOrderType(data.insuranceOrders, 'Insurance', '保险') || [];//保险订单
                //所有产品的订单合并，并按下单时间倒序
                let orderArr = flightOrders.concat(trainOrders).concat(hotelOrders).concat(insuranceOrders);
                orderArr && orderArr.sort(function (order1, order2) {
                    let time1 = order1 && order1.orderTime;
                    let time2 = order2 && order2.orderTime;
                    if (!time1 || !time2) {
                        return 0;
                    }
                    if (time1 < time2) {
                        return 1;
                    } else if (time1 > time2) {
                        return -1;
                    } 
                    return 0;
                        
                });

                _this.orderList = orderArr;
                _this.page.totalRecord = data.totalRecord;
                _this.page.pageCount = data.totalPageCount;
            }).catch(() => {
                _this.isLoading = false;
                _this.orderList && _this.orderList.splice(0);
            });
        },
        /**
             * 导出列表弹框
             */
        toExportOrdersForArray() {
            let _this = this;
            //拼接二维数组对象，作为Excel表格的输入
            var exportArray = [
                _this.tableArray
            ];

            // console.log(new Date().format('yyyy/MM/dd HH:mm:ss'));
            for (let i = 0; i < _this.orderListToExport.length; i++) {
                let orderItem = _this.orderListToExport[i];
                //这里的数据要跟上面table的值保持一致
                let item = [
                    i + 1,
                    _this.getOrderNo(orderItem),
                    _this.getScheduledPersonName(orderItem),
                    _this.getOrgName(orderItem),
                    _this.getOrderTimeDialog(orderItem),
                    _this.getDepartTimeDialog(orderItem),
                    _this.getOrderPeople(orderItem),
                    _this.getOrderType(orderItem),
                    _this.getOrderFT(orderItem),
                    _this.getPayAmount(orderItem),
                    _this.getPayType(orderItem)
                ];
                exportArray.push(item);
            }
            // console.log(new Date().format('yyyy/MM/dd HH:mm:ss'));                   
            var sheet = XLSX.utils.aoa_to_sheet(exportArray);
            // console.log("sheet="+sheet);
            var xlsBlob = this.sheet2blob(sheet);
            this.exportUrl = window.URL.createObjectURL(xlsBlob); // 创建blob地址    
        },
        /**
             * 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
             * @param url 下载地址，也可以是一个blob对象，必选
             * @param saveName 保存文件名，可选
             */
        sheet2blob(sheet, sheetName) {
            sheetName = sheetName || 'sheet1';
            var workbook = {
                SheetNames: [sheetName],
                Sheets: {}
            };
            workbook.Sheets[sheetName] = sheet;
            // 生成excel的配置项
            var wopts = {
                bookType: 'xlsx', // 要生成的文件类型
                bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
                type: 'binary'
            };
            var wbout = XLSX.write(workbook, wopts);
            var blob = new Blob([this.StringToBuffer(wbout)], { type: "application/octet-stream" });

            return blob;
        },
        // 字符串转ArrayBuffer
        StringToBuffer(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i = 0; i != s.length; ++i) { view[i] = s.charCodeAt(i) & 0xFF; }
            return buf;
        },
        getOrderNo(order) {
            return order.orderNo;
        },
        getScheduledPersonName(order) {
            return order.scheduledPersonName
        },
        getOrgName(orderItem) {
            return orderItem.departmentName || orderItem.orgName || ""
        },
        getOrderTime(orderItem) {
            return new Date(orderItem.orderTime).format('yyyy/MM/dd')
        },
        getOrderTimeDialog(orderItem) {
            return orderItem.orderTime
        },
        getDepartTime(order) {
            let time;
            if (order.typeCode == "Flight") {
                time = order.departTime;
            } else if (order.typeCode == "Train") {
                time = order.startTime;
            } else if (order.typeCode == "Hotel") {
                time = order.arriveDate;
            } else if (order.typeCode == "Insurance") {
                time = order.departTime;
            }
            return time ? new Date(time).format('yyyy/MM/dd') : "";
        },
        getDepartTimeDialog(order) {
            let time;
            if (order.typeCode == "Flight") {
                time = order.departTime;
            } else if (order.typeCode == "Train") {
                time = order.startTime;
            } else if (order.typeCode == "Hotel") {
                time = order.arriveDate;
            } else if (order.typeCode == "Insurance") {
                time = order.departTime;
            }
            return time;
        },
        getOrderPeople(order) {
            var customerNames = '';
            var customerNameValue = '';
            var customerArr;
            if (order.typeCode == "Flight") {
                customerArr = order.passengers ? order.passengers.split(',') : [];
            } else if (order.typeCode == "Train") {
                customerArr = order.passengers ? order.passengers.split(',') : [];
            } else if (order.typeCode == "Hotel") {
                customerArr = order.customers ? order.customers.split(',') : [];
            } else if (order.typeCode == "Insurance") {
                customerArr = order.passengers ? order.passengers.split(',') : [];
            }
            if (!!customerArr) {
                for (let i = 0; i < customerArr.length; i++) {
                    if (i < 1) {
                        customerNames += customerArr[i] + ' ';
                    }
                    customerNameValue += customerArr[i] + ' ';
                }
                if (customerArr.length >= 2) {
                    customerNames += '...'; // eslint-disable-line
                }
            }
            return customerNameValue;
        },
        getOrderType(order) {
            if (order.typeCode == "Flight") {
                return "机票";
            } else if (order.typeCode == "Train") {
                return "火车票";
            } else if (order.typeCode == "Hotel") {
                return "酒店";
            } else if (order.typeCode == "Insurance") {
                return "保险";
            }
            return "";
        },
        getOrderFT(order) {
            if (order.typeCode == "Flight") {
                return order.sAirportName + "-" + order.eAirportName;
            } else if (order.typeCode == "Train") {
                return order.startCity + "-" + order.endCity;
            } else if (order.typeCode == "Hotel") {
                return order.hotelName;
            } else if (order.typeCode == "Insurance") {
                return order.productShortName;
            }
            return "";
        },
        getPayType(order) {
            if (order.roomType == 0) {
                return '到店付';
            } 
            return order.alias || order.payTypeName;
                
        },
        getPayAmount(order) {
            return '￥' + (order.payAmount||order.amount);
        }
    }
}
</script>
<style scoped lang="less">
    @import 'exportReport.less';
</style>
