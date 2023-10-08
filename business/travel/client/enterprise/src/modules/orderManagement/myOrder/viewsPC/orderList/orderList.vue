<template>
    <div class="order-list-content">
        <div :class="{list_content:fullScreen,list_content_full_screen:fullScreen,list_content_pc:!fullScreen}">
            <div>
                <Icon type='icon_common_prompt'/>
                <span class="title-tip">
                    以下数据来源于{{ENABLE_USE_TYPE ? '因公出行' : '企业支付'}}的已交易订单
                </span>
            </div>
            <div>
                <div class="ReserveDate">
                    <label class="condition-item">交易日期</label>
                    <ul>
                        <li class="cursorp">
                            <SnDatetimePicker v-model="scheduledBeginTime" :disabled-date="disabledDate" @change='checkScheduledBeginTime'/>
                            <img src="~assets/img/company/company_icon_calendar.png" alt>
                            <img src="~assets/img/company/company_icon_calendar_hov.png" alt>
                        </li>
                        <li>—</li>
                        <li class="cursorp">
                            <SnDatetimePicker v-model="scheduleEndTime" :disabled-date="disabledDate" @change='checkScheduledEndTime'/>        
                            <img src="~assets/img/company/company_icon_calendar.png" alt>
                            <img src="~assets/img/company/company_icon_calendar_hov.png" alt>
                        </li>
                    </ul>    
                </div>
                <div class="condition relative" v-show="moreSearchCondition">
                    <div class="ReserveDate">
                        <label class="condition-item">出行日期</label>
                        <ul>
                            <li class='cursorp' @click='$refs.departBeginPicker.onClick()'>
                                <div class='time-label'>{{departBeginTime}}</div>
                                <SnDatetimePicker v-show='false' ref='departBeginPicker' v-model="departBeginTime" :disabled-date="disabledDate" @change='checkDepartBeginTime'/>
                                <img src="~assets/img/company/company_icon_calendar.png" alt>
                                <img src="~assets/img/company/company_icon_calendar_hov.png" alt>
                            </li>
                            <li>—</li>
                            <li class='cursorp' @click='$refs.departEndPicker.onClick()'>
                                 <div class='time-label'>{{deparEndTime}}</div>
                                <SnDatetimePicker v-show='false' ref='departEndPicker'  v-model="deparEndTime" :disabled-date="disabledDate" @change='checkDepartEndTime'/>
                                <img src="~assets/img/company/company_icon_calendar.png" alt>
                                <img src="~assets/img/company/company_icon_calendar_hov.png" alt>
                            </li>
                        </ul>
                        <label class="condition-item pc_label_item">类型</label>
                        <select v-model="orderType">
                            <option value=''>全部</option>
                            <option v-for="type in orderTypeArr" :key="type.value" :value="type.value">{{type.text}}
                            </option>
                        </select>
                    </div>
                    <div v-if="fullScreen">
                        <label class="condition-item full_screen_label-item">订单号</label>
                        <input type="text" v-model="orderNo" class="condition-item" placeholder="请输入订单号" />
                        <label class="condition-item full_screen_label-item">乘客/预订人</label>
                        <input type="text" v-model="personName" class="condition-item" placeholder="请输入中文名/英文名" />
                    </div>
                </div>
                <div class="condition" v-show="moreSearchCondition" v-if="!fullScreen">
                    <label class="condition-item">订单号</label>
                    <input type="text" v-model="orderNo" class="condition-item" placeholder="请输入订单号" />
                    <label class="condition-item pc_label_item">乘客/预订人</label>
                    <input type="text" v-model="personName" class="condition-item" placeholder="请输入中文名/英文名" />
                </div>
                <div class="condition condition-btn-container"
                    :class="{condition_full_Screen:fullScreen,condition_pc:!fullScreen}">
                    <div class="btn-container cursorp" @click="getMoreCondition">
                        <span class="condition-buton icon-btn" v-if="!moreSearchCondition">更多查询条件</span>
                        <Icon v-if="!moreSearchCondition" type='down'/>
                        <span class="condition-buton icon-btn" v-if="moreSearchCondition">精简查询条件</span>
                        <Icon v-if="moreSearchCondition" type='up'/>
                    </div>
                    <div class="btn-container">
                        <div class="button icon-btnsearch-btn cursorp" @click="getData">
                            查询
                        </div>
                        <div class="link-btn icon-btn" @click="clearCondition">
                            清空查询条件
                        </div>
                    </div>
                </div>
                <div class="classify-menu">
                    <ul class="clearfix" :class="{full_screen_clearfix:fullScreen,pc_clearfix:!fullScreen}">
                        <li class="cursorp normal-btn" :class="payStatus==0 && 'selected'" @click="switchPayStatus(0)">全部</li>
                        <li class="cursorp normal-btn" :class="payStatus==1 && 'selected'" @click="switchPayStatus(1)">待出行</li>
                        <li class="cursorp normal-btn" :class="payStatus==2 && 'selected'" @click="switchPayStatus(2)">退款/售后</li>
                    </ul>
                    <div class="order-count-label" v-if="orderList && orderList.length>0"><span
                            class="result-tip">查询结果:</span><span
                            class="result-num">共<span>{{page.totalRecord}}</span>条订单</span>
                        <a @click="toExportOrders()" class='icon-btn'>导出订单列表</a>
                    </div>
                </div>
            </div>
            <LoadingX v-if="isLoading" class="loading-container" />
            <div v-else class="content-result">
                <div class="empty-message" v-if="!orderList || orderList.length==0">
                    <i class="icon"></i>
                    未找到符合要求订单，请修改条件重新查询
                </div>
                <!-- 这里其实是个动态组件的接口，根据typeCode区分用哪个产品的组件 -->
                <orderItem v-for="orderItem in orderList" :key="orderItem.orderNo" :orderItem="orderItem" :isPc='isPC'
                    :isFullScreen='fullScreen' :showPers='showPersion' :showOrg='showOrgnization' @goPage="goPage">
                </orderItem>
                <page :page="page" @turnPage="turnPage" v-if="orderList && orderList.length>0"></page>
            </div>
            <div class="message-modal" v-if="showAlertModal">
                <i class="icon"></i>
                <div class="content">为保护用户隐私，订单中心只记录{{ENABLE_USE_TYPE ? '“因公”出行' : '企业支付'}}的订单</div>
                <div class="check-box">
                    <Checkbox v-model="noShowAlert"></Checkbox>
                    <span>不再提醒</span>
                </div>
                <div class="button icon-btncursorp" @click="closeAlertModal">知道了</div>
            </div>
            <!--<div v-if="showDeptTree">-->
            <!--<Tree :data="deptList"></Tree>-->
            <!--</div>-->
        </div>
    </div>
</template>

<script>
import extendUtils from 'orderCommon/extend.js';
import requestHandler from 'orderCommon/requestHandler.js';
import orderItem from '../../views/orderItem/orderItem';
import page from '../orderList/page';
import { SnDatetimePicker } from "sinosun-ui";
import LoadingX from "components/loading/LoadingX.vue";
import { getStatusByCategory, excludeInCompanyOrder } from 'orderCommon/enum/orderStatusEnum.js';
// import { debug } from 'util';
// import { setTimeout } from 'timers';
import Icon from "components/icon";
export default {
    components: {
        orderItem, page, LoadingX,Icon,SnDatetimePicker
    },
    mixins: [requestHandler.mixin.tChatEventMixin],
    props: ['isPc', 'isFullScreen', 'showOrg', 'showPers'],
    data() {
        return {
            noShowAlert: false,//显示提示框的checkbox
            isLoading: false,
            showAlertModal: false,//是否显示默认提示框
            showDeptTree: true,//是否显示部门菜单
            //查询条件 start
            orderNo: null,//订单号
            orderType: '',//订单类型，1. 酒店订单 2. 机票订单 3.火车票订单
            companyId: null,//预订人所在公司ID
            departmentId: null,//预订人所在部门ID
            personName: null,//预订人姓名
            scheduledBeginTime: this.$route.query.queryStartDate || null,//预订日期从，格式yyyy-MM-dd
            scheduleEndTime: this.$route.query.queryEndDate || null,//预订日期到，格式yyyy-MM-dd
            departBeginTime: null,//出发日期从，格式yyyy-MM-dd
            deparEndTime: null,//出发日期到，格式yyyy-MM-dd
            payStatus: 0,//未支付 = 0 已支付 = 1 已退款 =2
            OrderStatus: null,//JSONArray 不填表示全部订单；待支付 = UNPAID；待出行、退款单为 机票、火车票等状态集合
            //查询条件 end
            page: {
                pageSize: 20,
                currPage: 1,
                pageCount: 1,
                totalRecord: 0
            },
            deptList: [],
            orderList: [],
            orderTypeArr: [
                {
                    value: '1',
                    text: '机票'
                },
                {
                    value: '3',
                    text: '火车票'
                },
                {
                    value: '2',
                    text: '酒店'
                }
                // {
                //     value: "4",
                //     text: '快递',
                // },
                // {
                //     value: "5",
                //     text: '保险',
                // },
                // {
                //     value: "6",
                //     text: '商务用车',
                // }
            ],
            travelDept: this.$route.query.departmentId ? this.$route.query.departmentId : '',
            travelDeptArr: [],
            isPC: this.isPc,
            fullScreen: this.isFullScreen,
            moreSearchCondition: false,//加载更多查询条件
            showPersion: this.showPers,
            showOrgnization: this.showOrg,
            today: new Date(new Date().format('yyyy/MM/dd')),
            ENABLE_USE_TYPE: requestHandler.ENABLE_USE_TYPE,
            showScheduledBeginTime: false,
            showScheduleEndTime: false
        }
    },
    activated() {
        let _this = this;
        //注册并监听t信返回事件，解决T信上返回事件不正确的问题，改用vue的路由来回退

        // requestHandler.appBack(function (data) {//点击app返回事件
        //     requestHandler.throttle(function () {
        //         requestHandler.goBackPage('');
        //     }, this);
        // }.bind(this));
        _this.$emit('showOff', true);
        //重写T信上的页面刷新，只初始化数据，不重新加载页面（否则在某些情况下会出现问题）
        // requestHandler.reFreshPage(() => {
        //     _this.requestHandler.reFreshPage();
        // });
    },
    async created() {
        // document.getElementsByTagName('html')[0].style.setProperty('font-size', '100px', 'important');//PC端样式要统一放大
        // $('html').css('font-size','100px !important');
        let _this = this;
        _this.fullScreen = this.isFullScreen;
        _this.initData();
        document.title = '订单列表';
            
        //注册并监听t信返回事件，解决T信上返回事件不正确的问题，改用vue的路由来回退
            
        // requestHandler.appBack(function (data) {//点击app返回事件
        //     requestHandler.throttle(function () {
        //         requestHandler.goBackPage('');
        //     }, this);
        // }.bind(this));
        _this.$emit('showOff', true);
        //重写T信上的页面刷新，只初始化数据，不重新加载页面（否则在某些情况下会出现问题）
        // requestHandler.reFreshPage(() => {
        //     _this.requestHandler.reFreshPage();
        // });
            
        requestHandler.authInterceptor().then(()=>{
            let showAlertModalInStorage = requestHandler.getStorage(requestHandler.primaryKey + "orderManage_list_public_message");
            this.showAlertModal = showAlertModalInStorage == null || showAlertModalInStorage == 'true' ? true : false;
        });
    },
    mounted() {
    },
    watch: {
        travelDept(val) {
            var _this = this;
            console.log(val)
            _this.getData()
        },
        isFullScreen(val) {
            var _this = this;
            _this.fullScreen = val;
        },
        showPers(val) {
            var _this = this;
            _this.showPersion = val;
        },
        showOrg(val) {
            var _this = this;
            _this.showOrgnization = val;
        }
    },
    methods: {
        goBackFun(){
            extendUtils.closePage('');
        },
        checkScheduledBeginTime(val){
            let that = this;
            let timestamp1 = new Date(val)
            let timestamp2 = new Date(that.scheduleEndTime)
            if (timestamp1 <= timestamp2) {
                that.scheduledBeginTime = new Date(val).format('yyyy/MM/dd')
            } else {
                requestHandler.showToast('交易日期查询条件开始时间不能晚于结束时间')
            }
        },
        checkScheduledEndTime(val){
            let that = this;
            let timestamp1 = new Date(that.scheduledBeginTime)
            let timestamp2 = new Date(val)
            if (timestamp1 <= timestamp2) {
                that.scheduleEndTime = new Date(val).format('yyyy/MM/dd')
            } else {
                requestHandler.showToast('预定日期查询条件开始时间不能晚于结束时间')
            }
        },
        checkDepartBeginTime(val){
            let that = this;
            let timestamp1 = new Date(val)
            let timestamp2 = that.deparEndTime ? new Date(that.deparEndTime) : null
            if (!timestamp2 || timestamp1 <= timestamp2) {
                that.departBeginTime = new Date(val).format('yyyy/MM/dd')
            } else {
                requestHandler.showToast('交易日期查询条件开始时间不能晚于结束时间')
            }
        },
        checkDepartEndTime(val){
            let that = this;
            let timestamp1 = that.departBeginTime ? new Date(that.departBeginTime) : null
            let timestamp2 = new Date(val)
            if (!timestamp1 || timestamp1 <= timestamp2) {
                that.deparEndTime = new Date(val).format('yyyy/MM/dd')
            } else {
                requestHandler.showToast('预定日期查询条件开始时间不能晚于结束时间')
            }
        },
        /*
                不可选时间段
            */
        disabledDate(current) {
            return current > this.today.getTime();
        },
        /**
             * 页面数据初始化
             */
        initData() {
            let _this = this;
            //获取登录人员信息
            _this.downloadCpyOrganization();
            _this.getData();

        },
        /**
             * 切换订单状态标签
             * @param payStatus
             */
        switchPayStatus(payStatus) {
            this.payStatus = payStatus;
            switch (payStatus) {
            case 0:
                this.orderStatus = undefined;
                break;
            case 1:
                this.orderStatus = ["UNPAID", "WAIT_FOR_PAY"];
                break;
            case 2:
                this.orderStatus = ["ALREADY_REFUND", "FAILED_OUT_TICKET", "REFUNDING"];
                break;
            default:
                this.orderStatus = undefined;
                break;
            }
            this.getData();
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
             * 关闭弹框提示
             */
        closeAlertModal() {
            if (this.noShowAlert) {
                requestHandler.setStorage(requestHandler.primaryKey + "orderManage_list_public_message", false);
            }
            this.showAlertModal = false;
        },
        /**
             * 跳转到订单详情（由Item子组件触发）
             * @param pageName 路由名字
             * @param typeName 产品类别名字
             * @param typeCode 产品类别Code
             */
        goPage(pageName, typeName, typeCode) {
            requestHandler.openPageLib(pageName+'&typeName='+typeName+'&typeCode='+typeCode+'&pageFrom=orderListPc')
            // this.$router.push({
            //     path: "/" + pageName,
            //     query: {
            //         typeName: typeName,
            //         typeCode: typeCode,
            //         pageFrom:'orderListPc'
            //     }
            // });
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
        //分页获取数据
        getData() {
            let _this = this;
            let param = {
                pageSize: _this.page.pageSize,
                pageIndex: _this.page.currPage,
                productionId: _this.$route.query.prodId||undefined
            };
            param.useType = requestHandler.ENABLE_USE_TYPE ? requestHandler.USE_TYPE_ENUM.PUBLIC.code : requestHandler.USE_TYPE_ENUM.PRIVATE.code
            let orderStatus = [];
            let exclude = excludeInCompanyOrder()
            //将各个产品的状态码传给服务器，服务器针对这些状态进行过滤
            if (_this.payStatus == '0') { //全部
                orderStatus = orderStatus.concat(getStatusByCategory(1, 0, exclude), getStatusByCategory(2, 0, exclude), ['ALREADY_CANCEL_HAS_REFUND']);
            } else if (_this.payStatus == '1') { //带出行
                orderStatus = orderStatus.concat(getStatusByCategory(1, 0, exclude));
                param.isPrepareTravel = true;
                param.queryContentType = 1;//此参数 = 1时，服务端会根据系统时间对订单进行过滤
            } else if (_this.payStatus == '2') { //退款单
                param.postSaleOrder = true;//查询退款中和已退款的订单
                param.hasRefundOrder = true;
            }
            let scheduledBeginTime = !!_this.scheduledBeginTime ? new Date(_this.scheduledBeginTime).format('yyyy/MM/dd').replace(/\//g, '-') : null;
            let scheduleEndTime = !!_this.scheduleEndTime ? new Date(_this.scheduleEndTime).format('yyyy/MM/dd').replace(/\//g, '-') : null;
            let departBeginTime = !!_this.departBeginTime ? new Date(_this.departBeginTime).format('yyyy/MM/dd').replace(/\//g, '-') : null;
            let deparEndTime = !!_this.deparEndTime ? new Date(_this.deparEndTime).format('yyyy/MM/dd').replace(/\//g, '-') : null;
            if (!!_this.scheduledBeginTime && !!_this.scheduleEndTime && new Date(_this.scheduleEndTime) < new Date(_this.scheduledBeginTime)) {
                requestHandler.showToast("预定日期查询条件的开始时间不能晚于结束时间");
                return;
            }
            if (!!_this.departBeginTime && !!_this.deparEndTime && new Date(_this.deparEndTime) < new Date(_this.departBeginTime)) {
                requestHandler.showToast("出行日期查询条件的开始时间不能晚于结束时间");
                return;
            }
            !!_this.orderNo && (param.orderNo = _this.orderNo);
            !!_this.travelDept && (param.departmentId = _this.travelDept);
            !!_this.personName && (param.personName = _this.personName);
            // !!_this.orderType && (param.orderType = _this.orderType);
            !!_this.orderType ? (param.orderType = _this.orderType) : param.orderTypes = [1,2,3];
            !!_this.scheduledBeginTime && (param.payBeginTime = scheduledBeginTime);
            !!_this.scheduleEndTime && (param.payEndTime = scheduleEndTime);
            !!_this.departBeginTime && (param.departBeginTime = departBeginTime);
            !!_this.deparEndTime && (param.deparEndTime = deparEndTime);
            orderStatus.length > 0 && (param.orderStatus = requestHandler.removeDuplicatedItem(orderStatus));
            _this.isLoading = true;
            requestHandler.getOrderOfAllTypes(param).then(function (res) {
                _this.isLoading = false;
                requestHandler.setStorage("exportParam", JSON.stringify(param));
                let data = res.result;
                let flightOrders = _this.setOrderType(data.flightOrders, 'Flight', '机票') || [];//机票订单 注意Flight首字母大写
                let trainOrders = _this.setOrderType(data.trainOrders, 'Train', '火车票') || [];//火车票订单 注意Train首字母大写
                let hotelOrders = _this.setOrderType(data.hotelOrders, 'Hotel', '酒店') || [];//酒店订单 注意Hotel首字母大写
                let insuranceOrders = _this.setOrderType(data.insuranceOrders, 'Insurance', '保险') || [];//保险订单
                //所有产品的订单合并，并按下单时间倒序
                let orderArr = flightOrders.concat(trainOrders).concat(hotelOrders).concat(insuranceOrders);
                orderArr && orderArr.sort(function (order1, order2) {
                    //退款售后单并且时间不相等的情况下用退款售后操作时间排序，否则用下单时间排序
                    let time1 = (_this.payStatus == '2' && order1.postSaleLastApplyTime!=order2.postSaleLastApplyTime)?order1 && order1.postSaleLastApplyTime:order1 && order1.orderTime;
                    let time2 = (_this.payStatus == '2' && order1.postSaleLastApplyTime!=order2.postSaleLastApplyTime)?order2 && order2.postSaleLastApplyTime:order2 && order2.orderTime;
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
        downloadCpyOrganization() {
        },
        getMoreCondition: function () {
            let _this = this;
            _this.moreSearchCondition = !_this.moreSearchCondition;
        },
        /**
             * 清空查询条件
             */
        clearCondition() {
            this.orderNo = null;//订单号
            this.orderType = '';//订单类型，1. 酒店订单 2. 机票订单 3.火车票订单
            this.companyId = null;//预订人所在公司ID
            this.departmentId = null;//预订人所在部门ID
            this.personName = null;//预订人姓名
            this.scheduledBeginTime = null;//预订日期从，格式yyyy-MM-dd
            this.scheduleEndTime = null;//预订日期到，格式yyyy-MM-dd
            this.departBeginTime = null;//出发日期从，格式yyyy-MM-dd
            this.deparEndTime = null;//出发日期到，格式yyyy-MM-dd
            this.payStatus = 0;//未支付 = 0 已支付 = 1 已退款 =2
            this.orderStatus = null;//JSONArray 不填表示全部订单；待支付 = UNPAID；待出行、退款单为 机票、火车票等状态集合
        },
        /**
             * 跳转 导出列表页面
             */
        toExportOrders() {
            let _this = this;
            let deptName = !!_this.travelDept ? _this.travelDept : "全部";
            for (let i = 0; i < _this.travelDeptArr.length; i++) {
                if (_this.travelDeptArr[i].orgId == _this.travelDept) {
                    deptName = _this.travelDeptArr[i].orgName;
                    break;
                }
            }
            _this.$router.push({
                path: "/order/export",
                query: {
                    deptName: deptName,
                    queryPageSize: _this.page.totalRecord
                }
            });
        }
    }
}
</script>
<style scoped lang="less">
    @import 'orderList.less';
    @import "~themes/default/styles/common/index.less";
    @import "~styles/mixins/mixinsStyle.less";

    .ReserveDate {
        display: flex;
        align-items: center;
        ul {
            display: flex;
            justify-content: space-between;
            align-items: center;
            li {
                position: relative;
                height: 28px;
                line-height: 28px;
                cursor: pointer;
                margin-left: 12px;
                .sn-datetime-picker, .time-label{
                    width: 100%;
                    height: 100%;
                    z-index: 1;
                    padding-right: 28px;
                    text-align: center;
                }
                &:hover img {
                    display: none;
                }
                &:hover img:last-child {
                    display: block;
                }

                &:first-child {
                    border: 1px solid #d2d2d2;
                    width: 126px;
                    border-radius: 4px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                &:last-child {
                    border: 1px solid #d2d2d2;
                    width: 126px;
                    border-radius: 4px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                p {
                    padding-left: 10px;
                }

                img {
                    width: 28px;
                    height: 26px;
                    position: absolute;
                    right: 0;
                    top: 0;
                    &:last-child {
                        display: none;
                    }
                }
            }
        }
    }
</style>
<style>
    /* @import '~thirdparty/iview/styles/iview.css'; */

    .order-list-content{
        overflow-y: auto;
    }

    .order-list-content .info_none_text_warp {
        background: #fff;
        text-align: center;
        height: 41px;
    }

    .order-list-content .info_none_text {
        margin-top: 8px !important;
        height: 23px !important;
        text-align: center !important;
        line-height: 23px !important;
        padding-left: 32px !important;
        font-size: 15px !important;
        color: #7f7f7f !important;
        display: inline-block !important;
    }

    .date-picker .ivu-input {
        -webkit-transition: none;
        -moz-transition: none;
        -ms-transition: none;
        -o-transition: none;
        transition: none;
        font-size: 0.12rem * 2;
        font-family: inherit;
    }

    .date-picker .ivu-input:hover {
        border-color: #d2d2d8;
    }

    .date-picker .ivu-input:focus {
        box-shadow: none;
        border-color: #d2d2d8;
    }

    .date-picker .ivu-input-icon {
        width: 0.32rem * 2;
        height: 0.27rem * 2;
        line-height: 0.32rem * 2;
        font-size: 0.16rem * 2;
        background: url('~assets/imagesPc/icon_date_picker_nor.png') no-repeat 0 0;
        background-size: 0.32rem * 2;
    }

    .date-picker:hover .ivu-input-icon,
    .date-picker.selected .ivu-input-icon {
        background: url('~assets/imagesPc/icon_date_picker_hov.png') no-repeat 0 0;
        background-size: 0.32rem * 2;
    }

    .date-picker .ivu-input-icon:before {
        content: none;
    }

    .ivu-input {
        height: 0.28rem * 2;
    }
</style>
