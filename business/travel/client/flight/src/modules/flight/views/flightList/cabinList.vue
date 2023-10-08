<template>
    <div class='page-cabin-list'>
        <SnLoading class="loading" :spinning="loading" :turn="true" tip="获取航班中，请稍候..." />
        <template v-if="!loading">
            <div class="top"></div>
            <div class="bottom">
                <div class="content">
                    <div class="flight-info-card">
                        <div class="main-info">
                            <template v-if="Object.keys(flightDetail).length!=0">
                                <div class="plane">
                                    <airlogo class="logo" :airCode="flightDetail.airCompanyCode" />
                                    <span>{{flightDetail.airCompanyName}}{{flightDetail.flightNo}}</span>&nbsp;
                                    <span class="time">{{startDateStr}} {{startWeekStr}}</span>
                                </div>
                                <div v-if='flightDetail.share' class="share-flight">
                                    <div class="angle-line"></div>
                                    [实际承运] {{flightDetail.shareAirlineName}}{{flightDetail.shareFlightNo}}
                                </div>
                                <div class="air-info">
                                    <div class="time num-font">
                                        <div>{{flightDetail.departTime}}</div>
                                        <div>{{flightDetail.arriveTime}}</div>
                                    </div>
                                    <div class="airport">
                                        <div>{{flightDetail.departAirportName}}{{flightDetail.departAirportTerminal}}
                                        </div>
                                        <div>{{flightDetail.arriveAirportName}}{{flightDetail.arriveAirportTerminal}}
                                        </div>
                                    </div>
                                    <div class="arrow">
                                        <div>约{{flightDetail.duration}}</div>
                                        <div class="icon"></div>
                                        <div v-if='flightDetail.stopNum>0'>
                                            经停{{flightDetail.stopItems[0].stopCityName}}{{flightDetail.stopItems.length>1?(','+flightDetail.stopItems[1].stopCityName):''}}
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>
                        <div class="split-line">
                            <div class="circle left"></div>
                            <div class="circle right"></div>
                        </div>
                        <div class="sub-info">
                            <template v-if="Object.keys(flightDetail).length!=0">
                                <span>{{flightDetail.planeType}}</span>
                                <span class="split"></span>
                                <span>{{flightDetail.hasMeal ? '有餐饮' : '无餐饮'}}</span>
                            </template>
                        </div>
                        <div class="notice" v-show='noticeCount>0'>
                            <p class="notice-info" :class="{'list-item': noticeCount>1}" v-if="isEndorse()">
                                <span>由于机票价格变动频繁，根据航司规定，如改签票价高于原票价，需补足差额；如改签票价低于原票价，差额不予退还。</span>
                            </p>
                            <p class="notice-info" :class="{'list-item': noticeCount>1}" v-if="approachDepartTime">
                                <span>此航班临近起飞，请确保您有足够时间完成值机托运、安检及登机后再预订</span>
                            </p>
                            <div class="notice-info" :class="{'list-item': noticeCount>1}"
                                v-if="flightDetail.share">
                                [共享航班]请在实际乘坐的航空公司柜台办理值机手续
                            </div>
                        </div>
                    </div>
                </div>
                <MyTripList class="myTripList" v-if="!isEndorse()" ref="MyTripList" v-model="myTripModelData"
                    :departDate='flightDetail.departDate' :initTripNo="initTripNo"></MyTripList>
                <div class="cabin-list">
                    <div v-for="(cabin, index) in flightDetail.cabins" :key="index" class="cabin-item">
                        <div class="cabin">
                            <div class="content">
                                <div class="price">
                                    <div class="num-font"><span class="rmb">&yen;</span><span>{{cabin.fare}}</span></div>
                                    <div @click="toShihuiPage" v-if='cabin.priceKind && cabin.priceKind == 1' class="price_kind">实惠</div>
                                    <div v-if='cabin.directSale'>
                                        <div class="directSale">
                                            <div class="company">
                                                <airlogo class="logo" :airCode="flightDetail.airCompanyCode" />
                                                {{flightDetail.airCompanyName}}
                                            </div>
                                            <div class="tip">
                                                <div></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!--SnButton class="coupon-label" ghost size="small" type="warning" v-if="!isEndorse() && !!cabin.CanUseCoupon && !!cabin.CanUseCoupon.length>0">
                                    {{getBestCoupon(cabin)}}
                                </SnButton-->
                                <div class='cabin-info'>
                                    <span>{{cabin.cabinName}}</span>
                                    <span class="split"></span>
                                    <span>
                                        <template v-if="cabin.discount<100 && cabin.discount>0">
                                            {{cabin.discount / 10}}折
                                        </template>
                                        <template v-else-if="cabin.discount>=100">
                                            全价
                                        </template>
                                    </span>
                                    <span class="split"></span>
                                    <span class="guest-rule cursorp" @click="showPopOver(cabin)">
                                        <template v-if="!!cabin.guestRulePrice">
                                            <template v-if="isNaN(cabin.guestRulePrice)">
                                                {{cabin.guestRulePrice}}
                                            </template>
                                            <template v-else>
                                                退改<span class="rmb">&yen;</span>{{cabin.guestRulePrice}}起
                                            </template>
                                        </template>
                                        <template v-else>
                                            退改规则
                                        </template>
                                        <Icon type="icon_common_rightarrow" class="icon icon-btn" size='.2' />
                                    </span>
                                    <span v-if='!!cabin.showProvider'>【{{cabin.providerShortName}}】</span>
                                </div>
                                <div class="order-btn normal-btn linear-gra-waring cursorp" v-if='showOrderBtn || showApplyBtn'
                                    @click="toConfirm(flightDetail,cabin)">
                                    <div class="toOrder" :class="{'sm-font': cabin.ticketCount<=9 && showOrderBtn}">
                                        <template v-if='showOrderBtn'>
                                            {{isEndorse() ? '改签' : '预订'}}
                                        </template>
                                        <template v-else-if="showApplyBtn">
                                            出差申请
                                        </template>
                                    </div>
                                    <div class="leave" v-if="cabin.ticketCount<=9 && showOrderBtn">剩{{cabin.ticketCount}}张
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-transferDom>
                    <Popup v-model="showDescription" class='guest-rule-pop' position="bottom" height="80%" width="100%">
                        <description v-if="showDescription" type="order" @closeDesc="showDescription=false"
                            @toOrder="toConfirm(flightDetail,selectedCabin)" :cabinRules="cabinRules"
                            :cabin="selectedCabin" :providerName="selectedCabin.providerShortName"
                            :bodyLock="showDescription"></description>
                    </Popup>
                </div>
             </div>   
        </template>
    </div>
</template>

<script>
import extendUtils from 'flightCommon/extend.js';
import requestHandler from 'flightCommon/requestHandler.js';
import {
    TransferDom
    , Popup 
} from 'vux';
// import { getBestCoupon } from 'components/coupon/js/requestHandler.js';
import description from 'components/flightticketrule/description';

import airlogo from 'components/airlogo/airlogo.vue'
import MyTripList from 'components/trip/MyTripList.vue';
import Icon from 'components/icon';
import SnLoading from "components/loading";
export default {
    mixins: [extendUtils.mixin.tChatEventMixin],
    directives: {
        TransferDom
    },
    components: {
        description, Popup, airlogo, MyTripList, SnLoading,Icon
    },
    data: function () {
        return Object.assign(this.setData(), {
            endorseMsg: null,
            flightDetail: {},
            startDateStr: null,
            startWeekStr: null,
            guestRules: {},
            selectedCabin: {},
            initTripNo: this.$route.query.tripNo || '',//页面初始化携带的TripNo
            loading: false,
            cabinFilter: null,
            myTripModelData: {
                'choosedTrip': '',
                'haveAuth': false,
                'tripListLength': 0,
                'hotelUseType': extendUtils.USE_TYPE_ENUM.PUBLIC.name,
                'getAuthing': true
            },
            noticeCount: 0,//提示个数
            useTypeConfig: null
        })
    },
    activated: function () {
        this.registerEvent();
        this.setData();
        this.initData();//每次激活页面重新刷新数据
        this.cabinFilter = JSON.parse(this.$route.query.cabinFilter || '[]');
    },
    created: async function () {
        let that = this;
        that.registerEvent();
        that.useTypeConfig = await extendUtils.useTypeConfig()
    },

    mounted: function () {
        this.isMutliNoticeFunc();
    },
    computed: {
        /**
             * 是否显示“出差申请”按钮（已获取完行程和特殊授权后）
             */ 
        showApplyBtn(){
            return !this.myTripModelData.getAuthing && !this.myTripModelData.haveAuth && this.myTripModelData.tripListLength == 0;
        },
        /**
             * 是否展示预订/改签按钮
             */ 
        showOrderBtn(){
            if (this.isEndorse()){ //改签直接显示按钮
                return true;
            } else if (this.useTypeConfig && this.useTypeConfig.isPrivate(this.myTripModelData.hotelUseType)){ //因私直接显示按钮
                return true;
            }//因公正常预订的场景
            if (this.myTripModelData.getAuthing){ //如果正在获取行程，则不显示
                return false;
            }//获取行程数据完成后，如果有特殊授权或有行程，则显示
            return !this.showApplyBtn;
                    
                
        },
        /**
             * 返回null表示没有数据，返回{}表示正在获取数据中,-1表示出错
             */
        cabinRules: function () {
            if (this.guestRules === null || this.guestRules == undefined) {
                return null;
            }
            if (this.guestRules.constructor == Number) {
                return 0;
            }
            if (Object.keys(this.guestRules).length == 0) {
                return {};
            }
            let rule = this.guestRules[this.selectedCabin.cabinCode];
            return !!rule && Object.keys(rule).length > 0 ? rule : null;
        },
        approachDepartTime() {
            if (!this.flightDetail || Object.keys(this.flightDetail)==0) {
                return false;
            }
            try {
                let today = new Date().getTime();
                let flightTime = new Date(this.flightDetail.departDate + ' ' + this.flightDetail.departTime).getTime();
                let diff = flightTime - today;
                if (diff < 60 * 60 * 1000) {
                    return true;
                }
            } catch (e) {
                console.error(e)
            }
            return false;
        },
        /**
             * 是否显示横幅上的圆点
             */
        showListPoint() {
            return (this.isEndorse() && this.approachDepartTime) || 1
        }
    },
    methods: {
        isMutliNoticeFunc(){
            this.noticeCount = document.getElementsByClassName('notice-info').length;
        },
        isEndorse(){
            return this.$route.query && this.$route.query.type=='endorse';
        },
        setData() {
            return extendUtils.stateManager.setData({
                name: 'showDescription',
                type: 'page'
            }, this);
        },
        /**
             * 注册T信监听事件
             */
        registerEvent() {
            const that = this;
            document.title = that.$route.query.title;
            //注册并监听t信返回事件
            // extendUtils.appBack(function (data) { //点击app返回事件
            //     extendUtils.stateManager.closeTopPop(() => {
            //         that.$router.back();
            //     })
            // }.bind(this));
            /*
                页面刷新时激发
                */
            // extendUtils.reFreshPage(() => {
            //     alert(45666)
            // })
        },
        goBackFun(){
            const that = this;
            that.$router.back();
        },
        /**
             * 初始化数据
             */
        initData() {
            let that = this;
            this.endorseMsg = null;
            this.flightNo = this.$route.query.flightNo;
            this.flightDetail = {};//清空原数据
            this.queryFlightDetail();
            if (!!this.$route.query.useType) {
                that.myTripModelData.hotelUseType = this.$route.query.useType;
            }
            //获取行程id
            if (extendUtils.getSession('nextDirection') == 'forward' && !!this.$route.query.tripNo) {
                that.myTripModelData.choosedTrip = this.$route.query.tripNo;
            }
            this.startDateStr = this.$route.query.startDateStr;
            this.startWeekStr = this.$route.query.startWeekStr;
        },
        queryFlightDetail() {
            let flightQueryParam = JSON.parse(this.$route.query.flightQueryParam);
            flightQueryParam.flightNo = this.flightNo;
            this.loading = true;
            requestHandler.queryCabins(flightQueryParam).then((res) => {
                this.loading = false;
                let flightList = res.result.flights && res.result.flights.length > 0 && res.result.flights.filter(flight => {
                    return flight.flightNo = this.flightNo;
                });
                this.$nextTick(()=>{
                    this.isMutliNoticeFunc();
                })
                if (!!flightList && flightList.length > 0) {
                    this.flightDetail = flightList[0];
                    this.queryGuestRule();//查询客规
                    if (this.cabinFilter && this.cabinFilter.length > 0) { //判断舱位
                        //同时要过滤掉不符合条件的舱位数据
                        this.flightDetail.cabins = this.flightDetail.cabins.filter((cabin) => {
                            return this.cabinFilter.some(cabinFilter => {
                                return cabinFilter.value.indexOf(cabin.cabinRank) > -1;
                            });
                        })
                    }
                    if (this.flightDetail.cabins.length > 0) {
                        return;
                    }
                }

                extendUtils.showConfirm('该航班暂无可订舱位，请返回重新选择', () => {
                    this.$router.back();
                }, 1, null, '确定', null, null, true);

            }).catch(e=>{
                this.loading = false;
                console.error(e);
            })
        },
        /**
             * 查询航班客规
             * @param param
             * @return {*}
             */
        queryGuestRule() {
            if (!this.flightDetail) {
                return false;
            }
            let that = this;
            let param = {
                departDate: this.flightDetail.departDate + ' ' + this.flightDetail.departTime,
                departAirportCode: this.flightDetail.departAirportCode,
                arriveAirportCode: this.flightDetail.arriveAirportCode,
                airLineCode: this.flightDetail.airCompanyCode,
                flightNo: this.flightDetail.flightNo
            };
            requestHandler.queryGuestRule(param).then(data => {
                if (!!data.result.guestRules && Object.keys(data.result.guestRules).length > 0) {
                    let guestRules = {};
                    data.result.guestRules.forEach(rule => {
                        guestRules[rule.cabinCode] = rule;
                    })
                    that.guestRules = guestRules;

                    //判断退改规则是否在当前时间之后
                    function enableRule(rules) {
                        let result = []
                        rules && rules.length > 0 && rules.forEach(rule => {
                            let ruleTime = Date.parse(rule.title.replace('年', '/').replace('月', '/').replace('日', '').replace('前', '').replace('后', ''))
                            if (ruleTime >= new Date().getTime()) {
                                result.push(rule);
                            }
                        })
                        return result;
                    }

                    for (let i = 0; i < that.flightDetail.cabins.length; i++) {
                        try {
                            let cabin = that.flightDetail.cabins[i];
                            let guestRule = that.guestRules[cabin.cabinCode];

                            let rules = guestRule && guestRule.passengerRules && guestRule.passengerRules.length > 0 ? guestRule.passengerRules[0] : null;
                            if (!!rules) {
                                let minPirce = 0;
                                let refundRules = enableRule(rules.refundDescriptions);
                                if (!!refundRules && refundRules.length > 0) {
                                    refundRules = refundRules[0];//取第一个判断（数组按价格升序排列）
                                    if (refundRules.description.indexOf('免费') > -1) {
                                        that.$set(cabin, 'guestRulePrice', '提前退票免费');
                                        continue;//优先展示退票免费字样
                                    } else {
                                        //获取退票费最低价
                                        let price = refundRules.description.replace(/[^0-9]/ig, "")
                                        if (price != '') {
                                            minPirce = parseFloat(price);
                                        }
                                    }
                                }

                                let changeRules = enableRule(rules.changeDescriptions);
                                if (!!changeRules && changeRules.length > 0) {
                                    changeRules = changeRules[0];//取第一个判断（数组按价格升序排列）
                                    if (changeRules.description.indexOf('免费') > -1) {
                                        that.$set(cabin, 'guestRulePrice', '提前改签免费');
                                        continue;//优先展示退票免费字样
                                    } else {
                                        let price = changeRules.description.replace(/[^0-9]/ig, "")
                                        price = !!price ? parseFloat(price) : 0;
                                        minPirce = price > minPirce ? minPirce : price;//比较退改费哪个更低
                                        if (minPirce != 0) {
                                            that.$set(cabin, 'guestRulePrice', price);
                                        }
                                    }
                                }
                            }
                        } catch (e) {
                            console.error(e);
                        }
                    }
                } else {
                    that.guestRules = null;
                }
            }).catch((e) => {
                console.error(e)
                that.guestRules = 0;
            })
        },
        showPopOver(cabin) {
            this.showDescription = true;
            this.selectedCabin = cabin;
        },
        /**
             * 获取最优惠的优惠券价格
             */
        // getBestCoupon(cabin) {
        //     let that = this;
        //     return getBestCoupon(cabin, function (bestCoupon) {
        //         that.$set(cabin, 'bestCoupon', bestCoupon);
        //     });
        // },
        /**
             * 去下单
             * @航班数据
             * @舱位数据
             * */
        toConfirm(flight, cabins) {
            const that = this;
            extendUtils.authHandler.moduleGate(async ()=>{
                //365在0-7点不可购票
                let date = new Date();
                let hours = date.getHours();
                if (cabins.providerType == 0 && 0 <= hours && 7 > hours) {
                    extendUtils.showConfirm('此航班由365提供，其在00:00~7:00间进行系统维护将无法购票，如需购票，请选择其他航班', () => { }, 1, null, '确定', null, null, true);
                    return;
                }
    
                let myTripData = that.myTripModelData;
                if ((await extendUtils.useTypeConfig(extendUtils.USE_TYPE_SCENE.TO_ORDER)).isPublic(myTripData.hotelUseType)
                        && !that.isEndorse() && !myTripData.getAuthing){ //因公且不为改签
                    if (myTripData.haveAuth) { //有特殊授权
                        if (myTripData.tripListLength == 0) { //无合法行程
                        } else if (myTripData.tripListLength > 0 && myTripData.choosedTrip == '') { //有行程且未选择
                            extendUtils.showToast('请先选择出差行程');
                            return;
                        }
                    } else if (myTripData.tripListLength == 0){ //无特殊授权
                    //无合法行程
                        that.toTravelReq();
                        return;
                    } else if (myTripData.tripListLength > 0 && myTripData.choosedTrip == '') { //有行程且未选择
                        extendUtils.showToast('请先选择出差行程');
                        return;
                    }

    
                }
                that.flightDetail = flight;
                extendUtils.setStorage('flightDetail', JSON.stringify(that.flightDetail));
                extendUtils.setStorage('cabins', JSON.stringify(cabins));
                flight.cabin = cabins;
                if (that.isEndorse()) {
                    let endorseMsg = that.endorseMsg = JSON.parse(extendUtils.getStorage(requestHandler.primaryKey + 'endorseMsg'));
                    let obj = {
                        "orderNo": endorseMsg.orderNo,
                        "psgArr": endorseMsg.psgArr,
                        "psgIDs": endorseMsg.psgIDs,
                        "psgNames": endorseMsg.psgNames,
                        "changeType": 2,
                        "changerAirLines": [flight],
                        "airLinesIDs": endorseMsg.airLineIDs,
                        "remark": "申请改签"
                    };
                    if (endorseMsg.airLineIDs.split(',').length > 1) {
                        obj.changerAirLines.push(that.changerAirLine);
                        obj.changerAirLines.reverse();
                    }
                    //改签页面判断升舱和改期所需的参数
                    obj.endorseOrderObj = endorseMsg.endorseOrderObj;
                    //修改为通过缓存传递参数
                    extendUtils.setStorage(requestHandler.primaryKey + 'endorseObj', JSON.stringify(obj));
                    that.$router.push({
                        path: '/endorse',
                        query: {
                            useType: that.$route.query.useType,
                            // endorseObj: JSON.stringify(obj),//修改为通过缓存传递参数
                            title: document.title,
                            cabinGuestRules: that.guestRules && JSON.stringify(that.guestRules[cabins.cabinCode])
                        }
                    });
                } else {
                    that.$router.push({
                        path: '/order/confirm',
                        query: {
                            useType: that.$route.query.useType,
                            tripNo: that.myTripModelData.choosedTrip,
                            title: document.title,
                            cabinGuestRules: that.guestRules && JSON.stringify(that.guestRules[cabins.cabinCode])
                        }
                    })
                }
            })
        },

        /**
         * 跳转到实惠说明页面
         */
        toShihuiPage(){
            let url = 'flight/index.html#/shihui'
            requestHandler.openPage(url)
        },

        /**
             * 打开审批申请页面
             */
        toTravelReq() {
            let appplyAddress = '';
            sinosdk.sino.overwriteWindowopen();
            requestHandler.getApplyTravelUrl({}).then((res) => {
                if (!!res.result.approveTravelUrl) {
                    appplyAddress = res.result.approveTravelUrl;
                }
                if (!!appplyAddress && '' != appplyAddress) {
                    requestHandler.openPage(appplyAddress);
                } else {
                    extendUtils.showToast('还未设置出差申请地址，请前往运营后台设置');
                }
            }).catch((err) => {
                console.error(err);
            });
        }

    }
}

</script>
<style scoped lang="less">
    @import '~themes/default/styles/flightList/cabinList.less';
</style>