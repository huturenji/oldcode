<template>
    <div class="endorse-container">
        <div class="newMain cursorp" @click='showFlightDetail=true'>
            <div class="desc-container">
                <airlogo class="logo" :airCode="flightDetail.airCompanyCode"/>
                <div class='no-wrap desc'>
                    {{startDate}}
                    {{flightDetail.departTime}}
                    {{flightDetail.departAirportName}}{{flightDetail.departAirportTerminal}} -
                    {{flightDetail.arriveAirportName}}{{flightDetail.arriveAirportTerminal}}
                </div>
            </div>
            <div class="icon-arrow"></div>
        </div>

        <div class="newPrice">
            <div class="carbin"><span class="label">{{flightDetail.cabin.cabinName}}</span><span
                    class="price">￥{{flightDetail.cabin.fare}}</span>
            </div>
            <div class="detail"><span class="label">机建+燃油</span><span
                    class="price">￥{{flightDetail.tax+flightDetail.oil}}</span>
            </div>
        </div>

        <div class="customerList">
            <div class="customer" v-for="(psg,index) in endorseObj.psgArr" :key="index">
                <div class="customerDetail">
                    <div class="name">
                        <span>{{psg.psgName}}</span>
                    </div>
                    <div class="card">
                        {{psg.cardType | getCardTypeName}}：{{cardIdCopy[index].cardNo}}
                    </div>
                </div>
                <div class="customerInsuranceWrap">
                    <div class="Insuranceleft cursorp" @click="showInsuranceOptionPop = true">已购保险
                        <Icon type="icon_common_prompt" class="icon icon-btn" size='.3' />
                    </div>
                    <div class="Insuranceright" v-if="!!psg.insuranceOrders && 0 < psg.insuranceOrders.length">
                        <div class="customerInsuranceLine rightBut lineBorderB cursorp"
                            v-for="(insurance,index) in psg.insuranceOrders" :key="index"
                            @click="showInsuranceOrder(insurance)">
                            <div class="Insurancetext">{{insurance.insuranceProduct.productShortName}}</div>
                            <div v-if="'ALREADY_REFUND'==insurance.insuranceChildOrder.status" class="Insurancetips">已退保</div>
                            <div v-else-if="isUpCabin && insuranceStatus[insurance.insuranceChildOrder.status].canCancel" class="Insurancetips">可正常使用</div>
                            <div v-else-if="insuranceStatus[insurance.insuranceChildOrder.status].canCancel" class="Insurancetips red">改签成功后系统将自动退保</div>
                            <div @click.stop="callPhone()" v-else-if="insuranceStatus[insurance.insuranceChildOrder.status].endorseAbnormal" class="Insurancetips red">保险未正常出单，请联系客服<span>{{BIS_CUSTOMER_SERVICE_PHONE}}</span></div>
                        </div>
                    </div>
                    <div class="Insuranceright" v-else>
                        <div class="customerInsuranceLine lineBorderB">
                            <div class="Insurancetext">无</div>
                            <div class="Insurancetips"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <LoadingX tipsText="保险数据加载中" v-if="insuranceLoading" />
        <div v-else>
            <flightInsurances v-model="choosedInsurance" :insuranceList="insuranceList"
                :customerList="customerList"
                :unableChooseList="unableChooseList" @shooseInsurance="handleTotalPrice"
                @showInsuranceDo="showInsurance" @chooseInsuranceUser="chooseInsuranceUser"></flightInsurances>
        </div>
        <div class="ticket">
            <div class="ticketLeft">改签原因 </div>
            <div class="ticketRight">
                <Icon class="icon-check" size='.38' :type="ticketData.volunteer==true? 'btn_common_checkbox_sel' : 'btn_common_checkbox_nor'"  @click="ticketChange('volunteer')"/><div class="text">个人原因</div>
                <Icon class="icon-check" size='.38' :type="ticketData.involunteer==true ? 'btn_common_checkbox_sel' : 'btn_common_checkbox_nor'" @click="ticketChange('involunteer')"/><div class="text">非个人原因</div>
            </div>
            
        </div>
        <div class="tips-content">
            <div class="row title">温馨提示：</div>
            <div class="row">
                1.每张机票只支持一次网络改签，已改签的机票如需再次改签，需前往航司值机柜台现场办理。
            </div>
            <div class="row">
                2.由于机票价格变动频繁，根据航司规定，如改签票价高于原票价，需在审核通过后补足差额，如改签票价低于原票价，差额将不予退还。
            </div>
            <div class="row">
                3.个人原因变更客票，是指旅客因其自身原因要求变更客票。
            </div>
            <div class="row">
                4.非个人原因变更客票，指因航班取消、延误、提交、航程改变、舱位等级变更或者承运人无法运行原航班等情形，导致旅客变更客票的情形。
            </div>
        </div>
        <div v-transfer-dom>
            <div class="btn-endorse normal-btn cursorp" @click="endorseConfirm">
                立即改签
            </div>
        </div>
        <div v-transfer-dom class="show-endorse-detail" v-show="showFlightDetail">
            <div class="endorseDetailMask" @click="showFlightDetail=!showFlightDetail"></div>
            <div class="endorseDetailDialog">
                <div class="flightDetail">
                    <div class="header">
                        <div class="date" style="margin-bottom: .2rem"><span>{{startDate}}</span></div>
                    </div>
                    <div class="content">
                        <div class="info">
                            <div class="plane">
                                <airlogo class="logo" :airCode="flightDetail.airCompanyCode"/>
                                <span>{{flightDetail.airCompanyName}}{{flightDetail.flightNo}}</span>&nbsp;
                                <span class="split"></span>&nbsp;
                                <span>{{flightDetail.cabin.cabinName}}{{flightDetail.cabin.cabinCode}}</span>
                            </div>
                            <div v-if='flightDetail.share' class="share-flight">
                                <span>实际承运&nbsp;{{flightDetail.shareAirlineName}}{{flightDetail.shareFlightNo}}</span>
                            </div>
                        </div>
                        <div class="trip">
                            <div class="station">
                                <span class="time">{{flightDetail.departTime}}</span>
                                <span class="airport">{{flightDetail.departAirportName}}{{flightDetail.departAirportTerminal}}</span>
                            </div>
                            <div class="arrow">
                                <div>
                                    <span class="goDate">约{{flightDetail.duration}}</span>
                                </div>
                                <span class="icon"></span>
                                <div class="through" v-if='flightDetail.stopNum>0'>
                                    <div class="detail">经停
                                        {{flightDetail.stopItems[0].stopCityName}}{{flightDetail.stopItems.length>1?(','+flightDetail.stopItems[1].stopCityName):''}}
                                    </div>
                                </div>
                            </div>
                            <div class="station">
                                <span class="time">{{flightDetail.arriveTime}}</span>
                                <span class="airport">{{flightDetail.arriveAirportName}}{{flightDetail.arriveAirportTerminal}}</span>
                            </div>
                        </div>
                        <div class="plane-type">
                            <span>{{flightDetail.planeType}}</span>
                            <span class="split">|</span>
                            <span style="font-size: 600">{{flightDetail.hasMeal ? '有餐饮' : '无餐饮'}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 支付状态进度 -->
        <div v-transfer-dom class="progressDia">
            <orderProcess v-model="showOrderProcess" :flightDetail="flightDetail" :processPrecent="processPrecent" :psgList="psgNameArr" @closeProcess="closeProcess"/>
        </div>
        <!-- 保险详情 -->
        <div v-transfer-dom>
            <popup v-model="showInsurancePop" height="100%" width="100%" position="right" class=insurancePopWrap>
                <flightInsuranceDetail v-model="showInsurancePop" :haveOrderInfo="haveOrderInfo"
                    :insuranceDetail="insuranceDetail"></flightInsuranceDetail>
            </popup>
        </div>
        <!-- 改签保险说明 -->
        <div v-transfer-dom>
            <popup v-model="showInsuranceOptionPop" height="100%" width="100%" position="right" class=insurancePopWrap>
                <flightInsuranceOption v-model="showInsuranceOptionPop"></flightInsuranceOption>
            </popup>
        </div>
        <!--选择保险购买人员-->
        <div v-transfer-dom>
            <popup v-model="showInsurancesUser" is-transparent>
                <flightInsurancesUser v-model="insurancesUser" @input="setInsuranceUser" :unableChooseList="unableChooseList" @cloose="showInsurancesUser=false" :customerList="customerList" :showInsurancesUser="showInsurancesUser" :insurance="insuranceList[indexOfArr(editInsurancesUseProductNo, insuranceList,'productNo')]"></flightInsurancesUser>
            </popup>
        </div> 
    </div>
</template>
<script>
import orderProcess from 'flightComp/orderProcess/orderProcess.vue';
import extendUtils from 'flightCommon/extend.js';
import { getCardTypeName } from 'flightCommon/enum/custInfoEnum.js';
import flightInsurances from 'flightComp/flightInsurances.vue';
import flightInsuranceDetail from 'flightComp/flightInsuranceDetail.vue';
import flightInsuranceOption from 'flightComp/flightInsuranceOption.vue';
import flightInsurancesUser from 'flightComp/flightInsurancesUser.vue';
import LoadingX from "components/loading/LoadingX.vue";
import { TransferDom, Popup } from 'vux';
import requestHandler from 'flightCommon/requestHandler.js';
    
import airlogo from 'components/airlogo/airlogo.vue'
import { insuranceStatus } from 'flightCommon/enum/orderStatusEnum.js'
import Icon from 'components/icon';
export default {
    directives: {
        TransferDom
    },
    components: {
        orderProcess,
        Icon,
        LoadingX,
        flightInsurances,
        flightInsuranceDetail,
        flightInsuranceOption,
        flightInsurancesUser,
        Popup,
        airlogo
    },
    data: function () {
        let managerData = this.setData();
        return Object.assign(managerData, {
            endorseObj: {},
            flightDetail: {cabin:{}},
            processPrecent: 0,
            startDate: null,
            showFlightDetail: false,
            showOrderProcess: false,
            insurancePrice: 0,
            insuranceDetail: {},//保险详情字段
            insuranceList: [],//保险列表
            choosedInsurance: [],//所选保险
            unableChooseList: [],//已选中并无法取消的列表
            insuranceLoading: false,//保险数据加载中
            haveOrderInfo: false,//保险详情是否显示保险订单信息
            isUpCabin: false,//是否是升舱
            isStartDay: false,//是否是起飞当天
            changeType: 1,//改签类型改签类型 申请改期 = 1,申请升舱 = 2,其他变更= 3既改期又升舱填1。 改证件号/改名字/取消机位填3
            insuranceStatus:insuranceStatus,//保险订单状态
            editInsurancesUseProductNo:'',//编辑保险乘客的保险产品id
            insurancesUser:[],//选择的保险乘客数据
            customerList:[],//乘客数据
            BIS_CUSTOMER_SERVICE_PHONE:extendUtils.BIS_CUSTOMER_SERVICE_PHONE,//客服电话
            //默认自愿改签
            ticketData:{
                volunteer:false,
                involunteer:false
            }
        });
    },
    computed: {
        psgNameArr(){
            let result = [];
            this.endorseObj.psgArr && this.endorseObj.psgArr.forEach(psg => {
                result.push(psg.psgName)
            })
            return result;
        },
        cardIdCopy(){
            let result = [];
            this.endorseObj.psgArr && this.endorseObj.psgArr.forEach((psg,index) => {
                result.push(psg)
                if (SnTravel.functional.ISDECORATE){
                    result[index].cardNo = SnUtils.DataMasking.maskingText(SnUtils.DataMasking.MASKING_TYPE.IDCARD,result[index].cardNo);
                }
            })
            return result;
        }
    },
    filters: {
        /**
             * 根据cardType获取相应的证件名称
             */
        getCardTypeName: function (value) {
            return getCardTypeName(value);
        }
    },
    activated(){
        this.setData();
        // this.registerEvent();
    },
    created: async function () {
        let that = this;
        await extendUtils.authInterceptor();
        this.endorseObj = JSON.parse(extendUtils.getStorage(requestHandler.primaryKey + 'endorseObj'));//暂时只处理单程的
        that.customerList = that.getInsCustomerList(that.endorseObj.psgArr);
        this.flightDetail = this.endorseObj.changerAirLines[0];
        this.startDate = new Date(this.flightDetail.departDate).format('MM月dd日') + "  " +
                extendUtils.indexToWeek(new Date(this.flightDetail.departDate).getDay());
        //判断是否升舱、是否是起飞当天
        that.getEndorseType();
        //获取保险数据
        that.getFlightBookPara();
        //注册并监听t信返回事件
        // that.registerEvent();
    },
    mounted() {

    },
    methods: {
        //是否自愿改签
        ticketChange(ticketType){
            if (ticketType == "volunteer"){
                this.ticketData.volunteer = !this.ticketData.volunteer
                this.ticketData.involunteer = !this.ticketData.volunteer
            } else {
                this.ticketData.involunteer = !this.ticketData.involunteer
                this.ticketData.volunteer = !this.ticketData.involunteer
            }
        },
        setData(){
            return extendUtils.stateManager.setData([
                {
                    name: 'showInsurancePop',//保险详情
                    show: {
                        title: '保险详情'
                    },
                    hide: {
                        title: '申请改签'
                    }
                },
                {
                    name: 'showInsuranceOptionPop',//改签保险说明
                    show: {
                        title: '说明'
                    },
                    hide: {
                        title: '申请改签'
                    }
                },
                {
                    name: 'showInsurancesUser'
                }
            ], this);
        },
        // registerEvent(){
        //     let that = this;
        //     extendUtils.appBack(function (data) {//点击app返回事件
        //         extendUtils.stateManager.closeTopPop(() => {
        //             that.$router.back();
        //         });
        //     }.bind(this));
        //     extendUtils.reFreshPage(() => {
        //         requestHandler.reloadWithNoCache()
        //     });
        // },
        goBackFun(){
            let that = this;
            that.$router.back();
        },
        /**
             * 重置支付进度条
             */
        closeProcess() {
            const _this = this;
            _this.processPrecent = 0;
            _this.showOrderProcess = false;
        },
        /**
             * 确认改签
             */
        endorseConfirm() {
            const _this = this;
            if (_this.ticketData.volunteer==false && _this.ticketData.involunteer==false){
                extendUtils.showToast('请选择改签原因');
                return
            }
            _this.showOrderProcess = true;
            let insurances = [];
            if (_this.choosedInsurance.length > 0) {
                insurances = _this.getInsurances();
            }
            let obj = {
                "orderNo": _this.endorseObj.orderNo,
                "psgIDs": _this.endorseObj.psgIDs,
                "psgNames": _this.endorseObj.psgNames,
                "changeType": _this.changeType,
                "changerAirLines": [{
                    "productId": _this.flightDetail.cabin.productId,
                    "flightNo": _this.flightDetail.flightNo,
                    "airLineCode": _this.flightDetail.airCompanyCode,
                    "sAirportCode": _this.flightDetail.departAirportCode,
                    "eAirportCode": _this.flightDetail.arriveAirportCode,
                    "cabin": _this.flightDetail.cabin.cabinCode,
                    "cabinName": _this.flightDetail.cabin.cabinName,
                    "cabinRank": _this.flightDetail.cabin.cabinRank,
                    "sTerminal": _this.flightDetail.departAirportTerminal,
                    "eTerminal": _this.flightDetail.arriveAirportTerminal,
                    "fromDateTime": _this.flightDetail.departDate + " " + _this.flightDetail.departTime,
                    "arriveDateTime": _this.flightDetail.arriveDate + " " + _this.flightDetail.arriveTime,
                    "planeType": _this.flightDetail.planeType,
                    "fare": _this.flightDetail.cabin.fare,
                    "oil": _this.flightDetail.oil,
                    "tax": _this.flightDetail.tax,
                    "discount": _this.flightDetail.cabin.discount,
                    "cabId": _this.flightDetail.cabin.cabId,
                    "serialNumber": _this.flightDetail.cabin.serialNumber
                }],
                "airLinesIDs": _this.endorseObj.airLinesIDs,
                "remark": _this.ticketData.volunteer==true?'自愿改签' : '非自愿改签',
                "ticketChangeType":_this.ticketData.volunteer==true?0:1,
                "insurances": insurances
            };
            requestHandler.applyFlightChange(obj).then(() => {
                _this.closeProcess();
                setTimeout(()=>{
                    extendUtils.closePage('', 1, JSON.stringify({refresh: true}))
                }, 1000);
            }).catch(err => {
                _this.closeProcess();
                if (!err){
                    return;
                }
                if (requestHandler.ERROR_CODE.PRICE_CHANGE == err.resultCode){
                    if (!!err.resultMessage){
                        var newFareList = JSON.parse(err.resultMessage);
                        let isCanBooking = true;
                        let flightDetail = _this.flightDetail;
                        let cabin = _this.flightDetail.cabin;
                        let oldFare = cabin.fare;
                        for (let i = 0; i < newFareList.length; i++) {
                            if (!newFareList[i].canBook) {
                                isCanBooking = false;
                                break;
                            }
                            if (!!flightDetail && (flightDetail.flightNo == newFareList[i].flightNo)) {
                                cabin.fare = newFareList[i].newFare;
                            }
                        }
                        if (isCanBooking) {
                            extendUtils.showConfirm('航班实时价格已更新（'+cabin.cabinName+'原价<span class="rmb">'+oldFare+'</span>，现价<span class="rmb">'+cabin.fare+'</span>）, 是否继续提交订单', function () {
                                _this.endorseConfirm();
                            }, 2, '取消', '继续提交', null, null, true);
                        } else {
                            _this.cabinNoEnough(newFareList, flightDetail.flightNo);
                        }
                    } else {
                        extendUtils.showToast(extendUtils.ErrorCodeMap[err.resultCode].text);
                    }
                } else if (requestHandler.ERROR_CODE.NO_CABIN == err.resultCode){
                    if (!!err.resultMessage){
                        _this.cabinNoEnough(JSON.parse(err.resultMessage), _this.flightDetail.flightNo);
                    } else {
                        extendUtils.showToast(extendUtils.ErrorCodeMap[err.resultCode].text);
                    }
                } else {
                    extendUtils.showToast('无可用舱位')
                }
            });
        },
        /**
             * 舱位不足提示
             */
        cabinNoEnough(flightList, flightNo){
            let that = this;
            let list = flightList.filter(flight => {
                return flight.flightNo = flightNo;
            });
            let flight = list[0];
            if (!flight.canBook){
                let cabinNum = flight.cabinNum;
                let cabinNumStr = !!cabinNum ? `该航班舱位不足(剩余${cabinNum}个)，请调整出行乘客。` : `您预订的舱位已经售罄，请重新选择其他舱位或航班。`;
                extendUtils.showConfirm(cabinNumStr, function () {
                    !!cabinNum ? extendUtils.closePage('', 1, JSON.stringify({showPsgPop: true})) : that.$router.back()//剩余舱位不为0时，回到订单详情
                }, 1, null, null, null, function () {}, true);
            }
        },
        /**
             * 获取保险数据
             */
        getFlightBookPara() {
            const that = this;
            that.insuranceLoading = true;
            requestHandler.getFlightInsProducts().then((res) => {
                that.insuranceLoading = false;
                if (!!res.result) {
                    that.insuranceList = res.result;
                    that.getBuyInsuranceList();
                }
            }).catch((err) => {
                console.log(err)
            });
        },
        /**
             * 获取购买保险的乘客数据
             */
        getInsCustomerList(psgArr){
            let tempCustomerList = [];   
            let arrlength = psgArr.length;     
            for (let i=0;i<arrlength;i++){
                tempCustomerList.push({
                    "cardType": psgArr[i].cardType,
                    "cardNo": psgArr[i].cardNo,
                    "name": psgArr[i].psgName,
                    "gender": psgArr[i].gender,
                    "phone": psgArr[i].mobile,
                    "birthday": psgArr[i].birthday,
                    'passengerId': psgArr[i].psgId
                });                   
            }     
            return tempCustomerList;
        },
        /**
             * 获取保险需传递的参数json
             */
        getInsurances() {
            const _this = this;
            let insurances = [];
            _this.choosedInsurance.forEach(function (value) {
                let tempJson = {productNo:value.productNo,providerType:_this.insuranceList[_this.indexOfArr(value.productNo, _this.insuranceList,'productNo')].providerType,insuredInfos:[]}
                value.insuredInfos.forEach(function(item){
                    tempJson.insuredInfos.push(_this.getInsurancesUser(item))
                })
                insurances.push(tempJson);
            });
            return insurances;
        },
        /**
             * 获取保险乘客证件信息
             */
        getInsurancesUser(item){
            let gender = null;
            if (!!item.gender && item.gender != 0 && item.gender != '') {
                gender = item.gender
            } else if (item.iDCode == 0 && item.iDNum != 0 && item.iDNum != '') {
                gender = extendUtils.getSexForCard(parseInt(item.iDCode));
            }
            return {
                "cardType": item.cardType,
                "cardNo": item.cardNo,
                "name": item.name,
                "gender": gender,
                "phone": item.phone,
                "birthday": item.birthday
                // "PsgType": 1,
                // 'userId': item.userId,
            }
        },            
        /**
             * 打开保险详情
             */
        showInsurance(item) {
            const that = this;
            that.insuranceDetail = item;
            that.haveOrderInfo = false;
            that.showInsurancePop = true;
        },
        /**
             * 打开保险详情
             */
        showInsuranceOrder(item) {
            const that = this;
            that.insuranceDetail = item;
            that.haveOrderInfo = true;
            that.showInsurancePop = true;
        },
        /**
             * 获取是否升舱、改期、是否起飞当天
             */
        getEndorseType() {
            let _this = this;
            let endorseOrderObj = _this.endorseObj.endorseOrderObj;
            //航班号相同，航班id相同,出发日期、时间相同
            if (endorseOrderObj.airLineID == _this.endorseObj.airLinesIDs &&
                    endorseOrderObj.flightNo == _this.flightDetail.flightNo &&
                    endorseOrderObj.beginDate == _this.flightDetail.departDate &&
                    endorseOrderObj.beginTime == _this.flightDetail.departTime) {
                _this.isUpCabin = true;
            }
            let nowdate = new Date(new Date().getTime()).format('yyyy/MM/dd')
            if (endorseOrderObj.beginDate == nowdate) {
                _this.isStartDay = true;
            }
            if (_this.isUpCabin) {
                _this.changeType = 2;
            } else {
                _this.changeType = 1;
            }
        },
        /**
             * 获取已购保险数据以及无法购买的数据
             */
        getBuyInsuranceList() {
            // 1.机票退票时，保险自动退保；
            // 2.机票改签升舱时，原保险不用退保继续生效（默认勾选并且不可取消勾选），同时可以选择购买新的保险；
            // 3.机票改签非升舱时，原单保险自动退保，用户手动选择购买新单保险，机票补款时支付机票和保险费用；平价机票不需要补款的，在机票改签成功后进行保险支付（非平价机票改签和机票一起支付，平价改签单独支付保险费用）；
            // 4.保险退保异常，进入运营管理异常订单客服介入处理（保险退保异常的本迭代发布）；
            // 5.机票订单详情界面去除用户手动退保功能；
            let _this = this;
            let psgArr = _this.endorseObj.psgArr;
            let psgArrLen = psgArr.length;

            for (let i = 0; i < psgArrLen; i++) {
                let insOrders = psgArr[i].insuranceOrders || [];
                let insOrdersLen = insOrders.length;
                let tempPsg = {
                    "cardType": psgArr[i].cardType,
                    "cardNo": psgArr[i].cardNo,
                    "name": psgArr[i].psgName,
                    "gender": psgArr[i].gender,
                    "phone": psgArr[i].mobile,
                    "birthday": psgArr[i].birthday,
                    'userId': psgArr[i].psgId
                }
                if (0 < insOrdersLen){
                    for (let j = 0; j < insOrdersLen; j++) {
                            
                        if (_this.isUpCabin && _this.insuranceStatus[insOrders[j].status].canCancel) { //升舱，不分日期，已购保险不需重新购买，且不可重新购买
                            _this.unableChooseList.push({productNo:insOrders[j].insuranceProduct.productNo,passengerId:tempPsg.userId});
                        } else { //改期，原保险自动退出，并可自由购买
                            // if (_this.arrhaveitem(insOrders[j].insuranceProduct.productNo, _this.choosedInsurance,'productNo')) {
                            //     let choosedIndex = _this.indexOfArr(insOrders[j].insuranceProduct.productNo, _this.choosedInsurance,'productNo');
                            //     _this.choosedInsurance[choosedIndex].insuredInfos.push(tempPsg);
                            // }else{
                            //     let choosedIndex = _this.indexOfArr(insOrders[j].insuranceProduct.productNo, _this.choosedInsurance,'productNo');
                            //     _this.choosedInsurance.push({productNo:insOrders[j].insuranceProduct.productNo,insuredInfos:[tempPsg]});
                            // } 
                        }
                    }
                }
            }
        },
        /**
             * 获取保险在保险列表中的索引
             */
        getBuyInsuranceIndex(productNo) {
            let _this = this;
            let insurances = _this.insuranceList;
            let insuranceListLength = _this.insuranceList.length;
            let index = -1;
            for (let i = 0; i < insuranceListLength; i++) {
                if (productNo == insurances[i].productNo) {
                    index = i;
                }
            }
            return index;

        },
        /**
             * 证件号码加密中间显示星号
             */
        getCardIdShow(item) {
            let str = item + '';
            let StrLength = str.length;
            let tempstr = '';
            for (let i = 0; i < StrLength; i++) {
                if (i == 0 || i == StrLength - 1) {
                    tempstr += str.slice(i, i + 1)
                } else {
                    tempstr += '*';
                }

            }
            return tempstr;
        },
        /**
            * 维数组是否包含元素
            */
        arrhaveitem(item, arr, key) {
            var isInArr = false;
            var len = arr.length;
            for (var i = 0; i < len; i++) {
                if (!!key ? arr[i][key] == item : arr[i] == item) {
                    isInArr = true;
                    break;
                }
            }
            return isInArr;
        },
        /**
            * 元素在数组中的索引
            */
        indexOfArr(val, arr, key) {
            for (var i = 0; i < arr.length; i++) {
                if (!!key ? arr[i][key] == val : arr[i] == val) {
                    return i;
                }
            }
            return -1;
        },
        /**
             * 打开编辑保险乘客组件
             */
        chooseInsuranceUser(item){
            let _this = this;
            _this.editInsurancesUseProductNo = item.productNo;
            _this.insurancesUser = item.insuredInfos;
            _this.showInsurancesUser = true;
        },
        /**
             * 编辑保险乘客组件
             */
        setInsuranceUser(value){
            let _this = this;
            let index = _this.indexOfArr(_this.editInsurancesUseProductNo, _this.choosedInsurance,'productNo');
            let len = value.length;
            if (-1==index){
                if (0 != len){
                    _this.choosedInsurance.push({productNo:_this.editInsurancesUseProductNo,insuredInfos:value})
                }
            } else if (0 != len){
                _this.choosedInsurance[index].insuredInfos = value;
            } else {
                _this.choosedInsurance.splice(index, 1);
            }
        },
        /**
             * 联系客服打电话
             */
        callPhone() {
            sinosdk.sino.callTel(extendUtils.BIS_CUSTOMER_SERVICE_PHONE);
        }        
    }
};
</script>
<style scoped lang="less">
    @import '~themes/default/styles/common/index.less';

    .newMain {
        display: flex;
        align-items: center;
        text-align: left;
        background: #ffffff;
        height: .92rem;
        padding: 0 .3rem;
        font-size: .3rem;
        color: @text-color;

        .desc-container{
            display: flex;
            align-items: center;
            width: calc(~"100% - .26rem");
            .desc{
                width: calc(~"100% - .3rem - 17px");
            }
        }

        .logo {
            margin-right: .1rem;
        }

        .icon-arrow {
            width: .16rem;
            height: .24rem;
            background: url(~assets/img/common/icon_right.png) no-repeat 0 center;
            background-size: contain;
            margin: .33rem 0 .33rem .1rem;
            float: right;
        }

    }

    .newPrice {
        padding: .15rem .3rem 0;
        height: 1.1rem;
        background: #ffffff;
        margin: .2rem 0;

        .label {
            min-width: 1.4rem;
            display: inline-block;
        }

        .carbin {
            color: @text-color;
            font-size: 0.32rem;
            margin-bottom: .05rem;

            .price {
                color: #f83939;
            }

        }

        .detail {
            font-size: 0.26rem;
            color: @third-text-color;
        }

    }

    .show-endorse-detail{
        position:absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        .endorseDetailMask{
            position: fixed;
            top: 0;
            right: 0;
            left: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            z-index: 502;
        }
        .endorseDetailDialog{
            width: 80%;
            max-width: 300px;
            border-radius: 16px;
            z-index: 502;
            pointer-events:all;
            display: block;
            position: initial;
            border-radius: 0.2rem;
            background-color: #FFFFFF;
            overflow: hidden;
            text-align: center;
        }
    } 


    .flightDetail {
        margin: 0.2rem;
        text-align: center;
        background: #ffffff;
        border-radius: 0.1rem;

        .header {
            margin: 0.1rem;
            border-bottom: 1px dashed #cacaca;

            .date {
                text-align: center;
                font-size: 0.32rem;
                color: #111111;
            }

        }
        .content {
            border-radius: .1rem;
            padding: 0;

            .date {
                text-align: left;
                font-size: .28rem;
                color: @third-text-color;
                margin-left: .2rem;
            }

            .info{
                .plane{
                    height: .7rem;
                    color: @text-color;
                    display: flex;
                    font-size: .24rem;
                    align-items: center;
                    .logo {
                        margin: .1rem;
                        display: inline-block;
                    }
                    .split{
                        border: .01rem solid rgba(0, 0, 0, 0.2);
                        height: .15rem;
                        margin: 0 .1rem;
                    }
                    span {
                        line-height: .4rem;
                        display: inline-block;
                        vertical-align: super;
                    }
                }
                .share-flight{
                    background: url(~assets/img/flightList/travelBy-gray.png) left center no-repeat;
                    background-size: .32rem;
                    font-size: .24rem;
                    text-align: left;
                    text-indent: .49rem;
                    margin-left:  calc(~'0.1rem + 29px');
                    margin-bottom: .15rem;
                    margin-top: -.2rem;
                }
            }
            .plane-type {
                font-size: .24rem;
                text-align: center;
                padding: .1rem 0 0;
                margin: .1rem 0 0;

                .split {
                    margin: 0 .19rem;
                }
            }
            .trip {
                display: flex;
                justify-content: space-between;
                margin: .2rem 0;

                .station {
                    font-size: .30rem;

                    span {
                        text-align: center;
                        display: inline-block;
                    }

                    .airport {
                        font-size: .24rem;
                    }

                    .time {
                        font-weight: 600;
                        text-align: center;
                        font-size: .44rem;
                        font-weight: 600;
                        color: #191919;
                        display: block;

                        .plus {
                            color: @danger-color
                        }
                    }
                }

                .arrow {
                    flex: auto;
                    text-align: center;
                    font-size: .2rem;
                    color: @secondary-text-color;

                    .icon{
                        height: .5rem;
                        background: url(~themes/default/img/common/icon_plane_jingting@2x.svg) no-repeat center;
                        background-size: contain;
                    }

                    span {
                        display: block
                    }
                }
            }
        }

        .price {
            background: #feedd7;
            border-radius: 0.1rem;
            padding: 0.2rem;

            .No {
                color: @warning-color;
            }

            div {
                display: inline-block;
                width: 32%;
                text-align: center;

                span {
                    color: @text-color;
                }

            }
        }
    }

    .tips {
        background: #ffffff;
        padding: 0.2rem;
        margin-bottom: 0.1rem;
        margin-top: 0;
        display: -ms-flexbox;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        justify-content: space-between;

        img {
            vertical-align: middle;
            width: 0.3rem;
            color: @third-text-color;
        }

        span {
            vertical-align: middle;
        }

        .button {
            color: @theme-color;
        }

    }

    .vux-popup-dialog.payType {
        width: auto;
        right: 0;
    }

    .payType {
        background-color: rgba(0, 0, 0, 0) !important;
        padding: 0.3rem;
        z-index: 555;

        .content {
            position: relative;
            z-index: 555;
            width: auto;
            padding: 0;
            background: #ffffff;
            border-radius: 0.1rem;
            text-align: center;

            .weui-cell {
                padding: 0;
            }

            div {
                color: @theme-color;
                font-size: 0.32rem;
                line-height: 0.99rem;
            }

            .textCenter {
                text-align: center;
            }

            .payTypeWrap {

                .weui-cell__ft {
                    display: none;
                }

                .weui-cell__bd {
                    text-align: center;
                }

                .weui-cell:before {
                    left: 0;
                }

            }

            .lineBorderB:last-child:after {
                display: none;
            }

        }

        .footer {
            position: relative;
            z-index: 555;
            width: auto;
            font-size: 0.32rem;
            line-height: 0.9rem;
            margin-top: 0.3rem;
            border-radius: 0.1rem;
            background: #ffffff;
            text-align: center;
        }

    }

    .customerList {

        .customer {
            padding: 0 0.3rem;
            background: #ffffff;
            margin-bottom: 0.2rem;

            .customerDetail{
                display: flex;
                padding: .24rem 0;
                font-size: .32rem;

                .name {
                    width: 2rem;
                    color: @text-color;
                }

                .card {
                    flex: 1;
                    color: @text-color;
                }

            }

            .customerInsuranceWrap {
                display: flex;
                justify-content: space-between;
                padding-bottom: 0.05rem;

                .Insuranceleft {
                    width: 2rem;
                    font-size: .28rem;
                    color: @text-color;
                    padding-top: 0.2rem;

                    .icon {
                        vertical-align: middle;
                        fill: @theme-color;
                        padding-left: inherit;
                        margin-left: .1rem;
                    }

                }

                .Insuranceright {
                    font-size: .28rem;
                    color: @text-color;
                    flex: 1;

                    .customerInsuranceLine {
                        padding: 0.2rem 0.28rem 0.2rem 0;

                        .Insurancetext {}

                        .Insurancetips {
                            padding-top: 0.08rem;
                            color: @success-color;
                            font-size: .26rem;

                            &.red {
                                color: @danger-color-light;
                            }

                        }

                        &:last-child:after {
                            display: none;
                        }

                        &.rightBut {
                            background: url(~assets/img/common/icon_right.png) no-repeat right;
                            background-size: 0.13rem 0.22rem;
                        }

                    }
                }

            }
        }
    }
    .ticket{
        padding: .24rem 0.3rem;
        background: #ffffff;
        margin-bottom: 0.2rem;
        display: flex;
        font-size: .32rem;
        color: var(--textColor);
        .ticketLeft{
            width: 2rem;
        }
        .ticketRight{
            display: flex;
            align-items: center;
            flex: 1;
            color: var(--textColor);
        }
        .icon-check{
            fill: @base-theme-color;
            margin-right:.15rem;
            display: block;
        }
        .text{
            margin-right:.3rem;
        }
    }
    .tips-content {
        color: @third-text-color;
        font-size: .26rem;
        padding: 0 .3rem;
        padding-bottom: 2rem;
        margin-top: .3rem;

        .row {
            margin-bottom: .12rem;

            .title {
                maring-bottom: .24rem;
                font-size: .28rem;
                font-weight: bold;
            }

        }
    }

    .btn-endorse {
        position: fixed;
        bottom: 0;
        left: 0;
        height: .92rem;
        line-height: .92rem;
        color: @theme-color;
        background: #fff;
        text-align: center;
        font-size: .32rem;
        width: 100%;
    }

</style>
