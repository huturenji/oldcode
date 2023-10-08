<template>
    <div class="carOrderDetail">
        <div class="mapWrap" id="container"></div>
        <!--呼叫中-->
        <div class="carTypePositionWrap">
            <div class="carTypeOutWrap">
                <!-- 分享进来的查看详情 -->
                <div v-if="isShare && ''!=orderStatus" class="driveTypeWrap">
                    <div class="driverWrap lineDashedB">
                        <div class="driveInfoWrap">
                            <div class="leftWrap">
                                <div class="photoWrap" v-bind:style="{backgroundImage: 'url(' + (driverInfo || {}).avatar||'' + ')'}">

                                </div>
                                <div class="left">
                                    <div class="name">{{driverInfo.name || ''}}</div>
                                    <div class="score" v-if="!!driverInfo.levels">{{driverInfo.levels}}<span>{{leaveMap[parseInt(driverInfo.levels)]}}</span></div>
                                    <div class="cpy" v-bind:style="{backgroundImage: 'url(' + (carCpyMap[orderInfo.providerType] || {}).src + ')'}">{{(carCpyMap[orderInfo.providerType] || {}).name}}</div>
                                </div>
                            </div>
                            <div class="rightWrap">
                                <div class="right">
                                    <div class="carNo">{{(driverInfo.card.slice(0,2)+' '+driverInfo.card.slice(2)) || ''}}</div>
                                    <div class="carType">{{driverInfo.color || ''}}·{{driverInfo.carType || ''}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="optionWrap">
                        <div class="option cursorp police" @click="callPhone('110')">一键报警</div>
                        <div class="option cursorp sevice" @click="callPhone('server')">联系客服</div>
                        <div class="option cursorp phone" @click="callPhone(driverInfo.phone)">联系司机</div>
                    </div>
                </div>
                <div v-else>
                    <!-- 呼叫中的订单详情 -->
                    <div class="carTypeWrap" v-if="carOrderNameMap.CREATED==orderStatus">
                        <div class="orderContectWrap lineDashedB">
                            <div class="title">{{callWaitTime | limitTimeFilter}}</div>
                            <div class="tips">正在呼叫 1 种车型,请耐心等待...</div>
                        </div>
                        <div class="listWrap" v-if="!!orderInfo.providerType">
                            <div class="listLine">
                                <div class="left" v-bind:style="{backgroundImage: 'url(' + (carCpyMap[orderInfo.providerType] || {}).src + ')'}">{{(carCpyMap[orderInfo.providerType] || {}).name}}-{{(carTypeMap[orderInfo.carType || ''] || {}).name}}</div>
                                <div class="meddile">约<span>{{parseInt(orderInfo.estimatePrice) || ''}}</span>元</div>
                                <div class="right">呼叫中...</div>
                            </div>
                        </div>
                        <div class="buttonWrap">
                            <div class="button cursorp" @click="cancelCall">取消呼叫</div>
                        </div>
                    </div>
                    <!-- 行程中的订单详情 -->
                    <div class="driveTypeWrap" v-if="carOrderNameMap.dISPATCHED==orderStatus || carOrderNameMap.dRIVERARRIVED==orderStatus || carOrderNameMap.aRRIVING==orderStatus">
                        <div class="driverWrap lineDashedB">
                            <div class="driveInfoWrap">
                                <div class="leftWrap">
                                    <div class="photoWrap" v-bind:style="{backgroundImage: 'url(' + (driverInfo || {}).avatar||'' + ')'}">

                                    </div>
                                    <div class="left">
                                        <div class="name">{{driverInfo.name || ''}}</div>
                                        <div class="score" v-if="!!driverInfo.levels">{{driverInfo.levels}}<span>{{leaveMap[parseInt(driverInfo.levels)]}}</span></div>
                                        <div class="cpy" v-bind:style="{backgroundImage: 'url(' + (carCpyMap[orderInfo.providerType] || {}).src + ')'}">{{(carCpyMap[orderInfo.providerType] || {}).name}}</div>
                                    </div>
                                </div>
                                <div class="rightWrap">
                                    <div class="right">
                                        <div class="carNo">{{(driverInfo.card.slice(0,2)+' '+driverInfo.card.slice(2)) || ''}}</div>
                                        <div class="carType">{{driverInfo.color || ''}}·{{driverInfo.carType || ''}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="optionWrap">
                            <div class="option cursorp police" @click="callPhone('110')">一键报警</div>
                            <div class="option cursorp share" @click="shareTrip">行程分享</div>
                            <div class="option cursorp cancel" v-if="carOrderNameMap.dISPATCHED==orderStatus || carOrderNameMap.dRIVERARRIVED==orderStatus" @click="showCancelDetail=true">取消行程</div>
                            <div class="option cursorp phone" @click="callPhone(driverInfo.phone)">联系司机</div>
                        </div>
                    </div>
                    <!-- 待支付的订单详情 -->
                    <div class="priceDataWrap" v-if="carOrderNameMap.uNPAID==orderStatus">
                        <div class="driverWrap lineDashedB">
                            <div class="driveInfoWrap">
                                <div class="leftWrap">
                                    <div class="photoWrap" v-bind:style="{backgroundImage: 'url(' + (driverInfo || {}).avatar||'' + ')'}">

                                    </div>
                                    <div class="left">
                                        <div class="name">{{driverInfo.name || ''}}</div>
                                        <div class="carNo">{{(driverInfo.card.slice(0,2)+' '+driverInfo.card.slice(2)) || ''}}</div>
                                        <div class="score" v-if="!!driverInfo.levels">{{driverInfo.levels}}<span>{{leaveMap[parseInt(driverInfo.levels)]}}</span></div>
                                    </div>
                                </div>
                                <div class="rightWrap">
                                    <div class="right">
                                        <div class="carName">{{(carTypeMap[orderInfo.carType || ''] || {}).name}}</div>
                                        <div class="carType">{{driverInfo.color || ''}}·{{driverInfo.carType || ''}}</div>
                                        <div class="cpy" v-bind:style="{backgroundImage: 'url(' + (carCpyMap[orderInfo.providerType] || {}).src + ')'}">{{(carCpyMap[orderInfo.providerType] || {}).name}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="optionWrap lineDashedB">
                            <div class="optionInwrap">
                                <span class="option cursorp police" @click="callPhone('110')">一键报警</span>
                            </div>
                            <div class="optionInwrap">
                                <span class="option cursorp share" @click="shareTrip">行程分享</span>
                            </div>
                            <div class="optionInwrap">
                                <span class="option cursorp phone" @click="callPhone(driverInfo.phone)">联系司机</span>
                            </div>
                        </div>
                        <div class="priceWrap">
                            <div class="pricetitle">共<span>{{orderInfo.totalPrice || ''}}</span>元</div>
                            <div class="priceListWrap">
                                <template v-if="!!orderInfo.detailFees && orderInfo.detailFees.length > 0">
                                    <div class="priceLine" v-for="(item,index) in orderInfo.detailFees" :key="index">
                                        <div class="left">{{item.chargeDesc}}</div>
                                        <div class="right">{{item.amount/100}}元</div>
                                    </div>
                                </template>
                                <div class="priceLine" v-else>
                                    <div class="left">车费</div>
                                    <div class="right">{{orderInfo.totalPrice || ''}}元</div>
                                </div>
                            </div>
                            <div class="buttonWrap">
                                <div class="button cursorp" @click="openPay">支付</div>
                            </div>
                        </div>
                    </div>
                    <!-- 取消行程的订单详情 -->
                    <div class="cancelDataWrap" v-if="carOrderNameMap.CANCELED==orderStatus">
                        <div class="cancelWrap lineDashedB">
                            <div class="line time">{{orderInfo.departureTime}}</div>
                            <div class="line start">{{orderInfo.startName}}</div>
                            <div class="line end">{{orderInfo.endName}}</div>
                        </div>
                        <div class="optionWrap lineDashedB">
                            <div class="optionInwrap">
                                <span class="option cursorp police" @click="callPhone('110')">一键报警</span>
                            </div>
                            <!-- <div class="optionInwrap">
                                <span class="option cursorp share" @click="shareTrip">行程分享</span>
                            </div> -->
                            <div class="optionInwrap">
                                <span class="option cursorp phone" @click="callPhone('server')">联系客服</span>
                            </div>
                        </div>
                        <div class="cancelInfoWrap">
                            <div class="canceltitle">订单已被取消</div>
                        </div>
                    </div>
                    <!-- 已完成的订单详情 -->
                    <div class="completedWrap" v-if="carOrderNameMap.PAID==orderStatus || carOrderNameMap.COMPLETED==orderStatus">
                        <div class="driverWrap lineDashedB">
                            <div class="driveInfoWrap">
                                <div class="leftWrap">
                                    <div class="photoWrap" v-bind:style="{backgroundImage: 'url(' + (driverInfo || {}).avatar||'' + ')'}">
                                    </div>
                                </div>
                                <div class="rightWrap">
                                    <div class="rightInWrapOne">
                                        <div class="left">
                                            <div class="name">{{driverInfo.name || ''}}<span>{{(carTypeMap[orderInfo.carType || ''] || {}).name}}</span></div>
                                        </div>
                                        <div class="right">
                                            <div class="price"><span>{{orderInfo.totalPrice || ''}}</span>元</div>
                                        </div>
                                    </div>
                                    <div class="rightInWrapTwo">
                                        <div class="left">
                                            <div class="cpy" v-bind:style="{backgroundImage: 'url(' + (carCpyMap[orderInfo.providerType] || {}).src + ')'}">{{(carCpyMap[orderInfo.providerType] || {}).name}}<span class="score">{{driverInfo.levels}}<span>{{leaveMap[parseInt(driverInfo.levels)]}}</span></span></div>
                                        </div>
                                        <div class="right">
                                            <div class="tips cursorp" @click="showPriceDetail = true">详情</div>
                                        </div>
                                    </div>
                                    <div class="rightInWrapThree">
                                        <span class="left">{{(driverInfo.card.slice(0,2)+' '+driverInfo.card.slice(2)) || ''}}</span>
                                        <span class="right">{{driverInfo.color || ''}}<span> · </span>{{driverInfo.carType || ''}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="optionWrap">
                            <div class="option cursorp police" @click="callPhone('110')">一键报警</div>
                            <div class="option cursorp share" @click="shareTrip">行程分享</div>
                            <div class="option cursorp sevice" @click="callPhone('server')">联系客服</div>
                            <div class="option cursorp invoice" @click="toReimburse">{{invoiceFlag=='1'?'已开发票':'开发票'}}</div>
                        </div>
                    </div>
                </div>

            </div>
        </div> 
        <!-- 取消行程确认界面 -->
        <div v-transfer-dom>
            <popup v-model="showCancelDetail" height="100%">
                <div class="cancelDetail">
                    <div class="cancelContect">
                        <div class="bg"></div>
                        <!-- <div class="title">司机距上车点只有500米，预计16：59到达，您确定要取消行程吗?</div>
                        <div class="tips">5分钟内取消行程，不需要付费补偿司机</div> -->
                        <div class="title">司机距上车点很近了，您确定要取消行程吗?</div>
                        <div class="tips">取消行程，不需要付费补偿司机</div>
                        <div class="buttonsWrap">
                            <div class="button cursorp empty" @click="showCancelDetail=false">暂不取消</div>
                            <div class="button cursorp" @click="showCancelReason=true;showCancelDetail=false">确认取消</div>
                        </div>
                    </div>
                </div>
            </popup>
        </div> 
        <!-- 选择取消原因 -->
        <div v-transfer-dom>
            <popup v-model="showCancelReason" height="100%">
                <div class="cancelReason">
                    <div class="listWrap">
                        <div class="tips">请选择取消原因</div>
                        <div class="lineWrap cursorp" @click="choosedReasonId=item.code" v-for="(item,index) in cancelReasonListData" :key="index">
                            <div class="line lineBorderB" :class="{active:choosedReasonId==item.code}" >{{item.text}}</div>
                        </div>
                        <div class="texteareWrap" v-if="choosedReasonId==7">
                            <textarea class="reason" maxlength="50" v-model="choosedReason"></textarea>
                        </div>
                    </div>
                    <div class="buttonWrap pcDialog">
                        <div class="button cursorp" @click="cancelTrip">确认提交</div>
                    </div>
                </div>
            </popup>
        </div>    
        <!-- 费用明细 -->
        <div v-transfer-dom>
            <popup v-model="showPriceDetail">
                <div class="PriceDetail">
                    <div class="titleWrap lineBorderB">
                        <div class="left"></div>
                        <div class="meddile">费用详情</div>
                        <div class="right cursorp" @click="showPriceDetail=false">确定</div>
                    </div>
                    <div class="priceWrap">
                        <div class="pricetitle">共<span>{{orderInfo.totalPrice || ''}}</span>元</div>
                        <div class="priceListWrap">
                            <template v-if="!!orderInfo.detailFees && orderInfo.detailFees.length > 0">
                                <div class="priceLine" v-for="(item,index) in orderInfo.detailFees" :key="index">
                                    <div class="left">{{item.chargeDesc}}</div>
                                    <div class="right">{{item.amount/100}}元</div>
                                </div>
                            </template>
                            <div class="priceLine" v-else>
                                <div class="left">车费</div>
                                <div class="right">{{orderInfo.totalPrice || ''}}元</div>
                            </div>
                        </div>
                    </div>
                </div>
            </popup>
        </div> 
        <!-- 支付组件 -->
        <swp-pay v-if="swpPayLoad" v-model="showPayTypes"
            ref="payComp" :useType="orderInfo.useType" :amount="orderInfo.totalPrice"
            :orderNo="orderInfo.orderNo" :goodsDesc="getGoodsDesc"  :servicePhone='servicePhone'
            productType="car" @paySuccCallback="paySuccCallback">
        </swp-pay>
        <!-- loading -->
        <div v-transfer-dom>
            <Loading :show="loading" :text='loadingText'/>
        </div> 
    </div>
</template>

<script>
import requestHandler from 'orderCommon/requestHandler.js';
import {Loading,TransferDom,Popup} from 'vux';
import extendUtils from 'orderCommon/extend.js';
import { carOrderStatus,carOrderNameData } from 'orderCommon/enum/orderStatusEnum.js'
import { carCpyData ,carTypeData,cancelReasonList,leaveData,markerData} from 'orderCommon/enum/carInfoEnum.js'
// import LoadingX from "components/loading/LoadingX.vue";
const OrderClass = requestHandler.getOrderObj('car');
export default {
    directives: {
        TransferDom
    },
    mixins: [extendUtils.mixin.tChatEventMixin],
    components: {
        // LoadingX,
        // Confirm,
        Popup,
        Loading
    },
    data () {
        let _this = this;
        let managerData = extendUtils.stateManager.setData([
            'showPriceDetail',//费用明细
            {
                name: 'showCancelDetail',//确认取消
                show: {
                    title: '取消行程'
                },
                hide: {
                    title: '等待接驾'
                }
            },
            {
                name: 'showCancelReason',//取消原因
                show: {
                    title: '取消原因'
                },
                hide: {
                    callback: function () {
                        _this.showCancelDetail = false;
                        document.title = '等待接驾';
                    }
                }
            }
        ], this);
        return Object.assign(managerData, {
            loading: true,//页面加载中
            loadingText:'查询中，请稍后...',//loading文本
            limitTime: 0,//呼叫倒计时
            outTime:3000,//轮询订单详情间隔
            positionOutTime:1000,//轮询位置间隔
            timeInterval: null,//轮询订单定时器
            positionInterval: null,//轮询司机位置定时器
            callTimeInterval:null,//呼叫倒计时定时器
            pageFrom: '',//页面来源
            invoiceInfo: {},//报销凭证相关参数
            invoiceContent: '',//报销凭证相关参数
            // invoiceRemarks: '',//报销凭证相关参数
            invoiceFlag:0,//是否已开票0未开，1已开
            carCpyMap:carCpyData,//用车渠道商配置数据
            carTypeMap:carTypeData,//车型配置
            cancelReasonListData:cancelReasonList,//取消原因列表
            carOrderStatusMap:carOrderStatus,//订单状态
            markerMap:markerData,//标记点配置
            leaveMap:leaveData,//评分配置
            carOrderNameMap:carOrderNameData,//订单状态名称配置
            orderNo: 0,//订单号
            choosedReasonId:null,//选中的取消原因id
            choosedReason:'',//其他原因，输入的原因
            position:{lat:0,lng:0,address:'',city:'',citycode:''},//定位位置
            map:{},//高德地图对象
            markers:[],//地图标记点数组
            driving:{},//路径规划对象
            orderInfo: {},//订单详情
            driverInfo:{},//司机详情
            orderStatus:'',//订单状态
            initMapEnd:false,//地图是否渲染完成
            callWaitTime:120,//呼叫等待时长120秒
            callTimeing:false,//呼叫等到倒计时中
            isfirstDrive:true,//是否是第一次渲染路径
            driveindex:0,//累计渲染轨迹次数
            appId:'',//appid聊天上下文用
            prodId: this.$route.query.prodId,//渠道id
            isShare:false,//是否是分享进来的
            uName:'',//T信登录用户名
            appletUAId:'268435612',//appletUAId
            swpPayLoad: false,//支付组件加载完成flag
            showPayTypes: false,//弹出支付列表
            lasttimeLngLat:[0,0],//上一次的司机位置，用来计算小汽车图片的方向
            servicePhone: extendUtils.BIS_CUSTOMER_SERVICE_PHONE//客服电话
        })
    },
    computed:{
        getGoodsDesc(){
            return OrderClass.getGoodsDesc();
        }
    },
    filters:{
        limitTimeFilter: function (value) {
            if (value && value >= 1) {
                return new Date(value * 1000).format('mm:ss');
            }
            return '';
        }
    },
    created(){
        var _this = this;
        //注册并监听t信返回事件
        // extendUtils.appBack(function (data) {//点击app返回事件
        //     extendUtils.throttle(function () {
        //         _this.closeTopPop();
        //     }, this);
        // }.bind(this));
        _this.$emit('showOff', true);
        // extendUtils.reFreshPage(() => {
        //     clearInterval(_this.timeInterval);
        //     _this.getOrderDetail();
        //     extendUtils.reloadWithNoCache()
        // });

        //新页面关闭回到本页面时，本页面自动刷新的事件
        sinosdk.sino.onChildWindowClose(function () {
            _this.getOrderDetail();
        }.bind(this));
        if (!!this.$route.query.pageFrom) {
            _this.pageFrom = this.$route.query.pageFrom;
        }
        if ('share' == _this.pageFrom){
            _this.isShare = true;
        }
        _this.orderNo = this.$route.query.orderNo;
        _this.initData();
        //获取appid
        _this.getAppid();
    },
    mounted(){
        var _this = this;
        _this.initMap();
    },
    /**
         * 页面初始化
         */
    methods: {
        initData(){
            var _this = this;
            _this.getOrderDetail();
        },
        /**
             * T信点击返回的事件处理
             */
        // closeTopPop(callback) {
        //     let that = this;
        //     return extendUtils.stateManager.closeTopPop(() => {
        //         if (!callback) {
        //             let loadData = {
        //                 orderNo: that.orderInfo.orderNo,
        //                 orderStatus: that.orderInfo.orderStatus,
        //             };
        //             loadData = JSON.stringify(loadData);
        //             //预付或者orderSuc页面过来的，都要返回两个step才能到首页
        //             // push是推送过来的，必须返回2次，否则安卓有问题
        //             if(that.pageFrom=='advance' || that.pageFrom=='push' || that.pageFrom=='cash'){
        //                 extendUtils.goBackPage('', 2, loadData);
        //             }else if(that.pageFrom=='orderListPc'){
        //                 that.$router.go(-1)
        //             }else{
        //                 extendUtils.goBackPage('', 1, loadData);
        //             }
        //         } else {
        //             callback();
        //         }
        //     });
        // },

        goBackFun(callback){
            let that = this;
            if (!callback) {
                let loadData = {
                    orderNo: that.orderInfo.orderNo,
                    orderStatus: that.orderInfo.orderStatus
                };
                loadData = JSON.stringify(loadData);
                //预付或者orderSuc页面过来的，都要返回两个step才能到首页
                // push是推送过来的，必须返回2次，否则安卓有问题
                if (that.pageFrom=='advance' || that.pageFrom=='push' || that.pageFrom=='cash'){
                    extendUtils.closePage('', 2, loadData);
                } else if (that.pageFrom=='orderListPc'){
                    that.$router.go(-1)
                } else {
                    extendUtils.closePage('', 1, loadData);
                }
            } else {
                callback();
            }
        },
        /**
             * 查询订单详情
             */
        getOrderDetail(){
            let _this = this;
            OrderClass.getOrderDetail(_this.orderNo).then(function (res) {
                _this.loading = false;
                _this.orderInfo = res.result.basicOrder;
                _this.invoiceFlag = res.result.invoiceFlag;
                _this.invoiceContent = res.result.invoiceContent || {};
                _this.invoiceInfo = res.result.invoiceInfo || {};
                _this.orderStatus = res.result.basicOrder.orderStatus;
                _this.driverInfo = res.result.driverInfo;
                _this.afterGetDetail();
            }).catch((e) => {
                _this.loading = false;
                console.log(e);
            });
        },
        /**
             * 解析详情数据
             */
        afterGetDetail(){
            let _this = this;
            //呼叫等待中控制呼叫倒计时
            if (_this.carOrderNameMap.CREATED==_this.orderStatus){
                if (!_this.callTimeing){
                    _this.callTimeIFun();
                }
            } else {
                clearInterval(_this.callTimeInterval);
                _this.callTimeing = false;
            }
            //添加开始结束标记点
            _this.addMarkers(_this.orderInfo.fromLongitude,_this.orderInfo.fromLatitude,'','start',false);
            _this.addMarkers(_this.orderInfo.fromLongitude,_this.orderInfo.fromLatitude,_this.getMarkerContect(_this.orderInfo.startName,'startContent'),'startContent',true);
            _this.addMarkers(_this.orderInfo.toLongitude,_this.orderInfo.toLatitude,'','end',false);
            _this.addMarkers(_this.orderInfo.toLongitude,_this.orderInfo.toLatitude,_this.getMarkerContect(_this.orderInfo.endName,'endContent'),'endContent',true);
            //各阶段地图渲染处理
            if (_this.isShare){
                //添加行车路线出发地-目的地
                _this.getDriving(_this.orderInfo.fromLongitude, _this.orderInfo.fromLatitude,_this.orderInfo.toLongitude, _this.orderInfo.toLatitude,'share',false);
                _this.removeMarker('car');
                _this.removeMarker('carContent');
            } else if (_this.orderInfo.orderType == 1 && (_this.carOrderNameMap.dISPATCHED==_this.orderStatus || _this.carOrderNameMap.dRIVERARRIVED==_this.orderStatus)){ //等待接驾并且是实时单
                _this.getDrivePosition('waitTrip');
                _this.removeMarker('startContent');
                _this.removeMarker('endContent');
            } else if (_this.carOrderNameMap.aRRIVING==_this.orderStatus){ //行程中
                _this.getDrivePosition('triping');
                _this.removeMarker('startContent');
                _this.removeMarker('endContent');
            } else { //其他情况
                //添加行车路线出发地-目的地
                _this.getDriving(_this.orderInfo.fromLongitude, _this.orderInfo.fromLatitude,_this.orderInfo.toLongitude, _this.orderInfo.toLatitude,_this.orderStatus,false);
                _this.removeMarker('car');
                _this.removeMarker('carContent');
            }
            //待支付状态动态加载支付组件
            if (_this.carOrderNameMap.uNPAID==_this.orderStatus){
                _this.loadPayComp();
            }
            //设置title
            document.title = _this.isShare?'行程分享':_this.carOrderStatusMap[_this.orderStatus].title;
            //轮询订单详情
            if (_this.carOrderStatusMap[_this.orderStatus].loopDetail && !_this.isShare){
                _this.timeInterval = setTimeout(() => {
                    _this.getOrderDetail();
                    _this.initMapEnd = true;
                }, _this.outTime);
            }
        },
        /**
             * 获取地图marker点contect内容
             */
        getMarkerContect(text,type){
            let _this = this;
            let domOrText = '';
            if ('startContent' == type || 'endContent' == type){
                domOrText = "<div class='markerTypeBox'><div class='markerType'><div class='markerArrowLine'>"+text+"</div><div class='markerArrow'></div></div></div>"
            } else if ('waitTrip' == type){
                let distanceObj = _this.formatDistance(text[0]);
                let timeObj = _this.formatTime(text[1]);
                let str = '';
                if (timeObj.haveHour){
                    str = '距离上车点'+'<span>'+distanceObj.value+'</span>'+distanceObj.unit+'<span>'+timeObj.value[0]+'</span>小时'+'<span>'+timeObj.value[1]+'</span>分';
                } else {
                    str = '距离上车点'+'<span>'+distanceObj.value+'</span>'+distanceObj.unit+'<span>'+timeObj.value+'</span>'+timeObj.unit;
                }
                domOrText = "<div class='markerTypeBox waitTrip'><div class='markerType'><div class='markerArrowLine'>"+str+"</div><div class='markerArrow'></div></div></div>"
                
            } else if ('triping' == type){
                let distanceObj = _this.formatDistance(text[0]);
                let timeObj = _this.formatTime(text[1]);
                let str = '';
                if (timeObj.haveHour){
                    str = '<div class="tripLine">距离目的地'+'<span> '+distanceObj.value+distanceObj.unit+'</span>'+'</div><div class="tripLine">预计行驶<span> '+timeObj.value[0]+'小时'+timeObj.value[1]+'分</span></div>';
                } else {
                    str = '<div class="tripLine">距离目的地'+'<span> '+distanceObj.value+distanceObj.unit+'</span>'+'</div><div class="tripLine">预计行驶<span> '+timeObj.value+timeObj.unit+'</span>'+'</div>';
                }
                domOrText = "<div class='markerTypeBox triping'><div class='markerType'><div class='markerArrowLine'>"+str+"</div><div class='markerArrow'></div></div></div>"
            }
            return domOrText;
        },
        /**
             * 获取司机位置
             */
        getDrivePosition(type){
            let _this = this;
            let obj = {
                orderNo:_this.orderNo
            }
            requestHandler.queryDriverLocationByOrderId(obj).then(function (res) {
                if (res.code == 0){
                    //添加司机位置
                    _this.addMarkers(res.result.longitude,res.result.latitude,'','car',false);
                    if ('waitTrip'==type){
                        //添加司机位置-出发点路径
                        _this.getDriving(res.result.longitude,res.result.latitude,_this.orderInfo.fromLongitude, _this.orderInfo.fromLatitude,type,true);
                    } else if ('triping'==type){
                        //添加司机位置-目的点路径
                        _this.getDriving(res.result.longitude,res.result.latitude,_this.orderInfo.toLongitude,_this.orderInfo.toLatitude,type,true);
                    }
                }
            }).catch((e) => {
                console.log(e);
            });

        },
        /**
             * 呼叫倒计时定时器
             */
        callTimeIFun(){
            let _this = this;
            let nowTime = new Date().getTime();
            //todo需要调整时间格式为/不能用-
            let orderTime = new Date(_this.orderInfo.orderTime.replace(/-/g,'/')).getTime();
            _this.callWaitTime = _this.callWaitTime-parseInt((nowTime-orderTime)/1000);
            _this.callTimeing = true;
            _this.callTimeInterval = setInterval(() => {
                _this.callWaitTime--;
                if (_this.callWaitTime <= 0){
                    _this.callWaitTime = 0;
                    _this.callTimeing = false;
                    clearInterval(_this.callTimeInterval);
                }
            }, 1000);
        },            
        /**
             * 初始化地图
             */
        initMap(){
            let _this = this;
            _this.map = new AMap.Map('container', {
                resizeEnable: true
            });
            AMap.plugin('AMap.Geolocation', function() {
                var geolocation = new AMap.Geolocation({
                    enableHighAccuracy: true,//是否使用高精度定位，默认:true
                    timeout: 10000, //超过10秒后停止定位，默认：无穷大
                    maximumAge: 0, //定位结果缓存0毫秒，默认：0
                    convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                    showButton: false, //显示定位按钮，默认：true
                    showMarker: false, //定位成功后在定位到的位置显示点标记，默认：true
                    showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
                    panToLocation: false, //定位成功后将定位到的位置作为地图中心点，默认：true
                    zoomToAccuracy:false //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                });
                _this.map.addControl(geolocation);
                geolocation.getCurrentPosition(function(status,result){
                    if (status=='complete'){
                        _this.onComplete(result)
                    } else {
                        _this.onError(result)
                    }
                });
            });
        }, 
        //定位结果
        onComplete(data) {
            // let _this = this;
            console.log(data)
        },
        //定位错误信息
        onError() {
        },       
        /**
             * 计算小汽车图标旋转角度
             * @tolng 目的地经度
             * @tolat 目的地纬度
             * @fromlng 出发地经度
             * @fromlat 出发地纬度
             */
        getCarIconAngle(tolng,tolat,fromlng,fromlat){
            if (fromlng == 0){
                return -90;
            }
            var diff_x = tolng - fromlng,diff_y = tolat - fromlat;
            // let slope = (parseFloat(tolat) - parseFloat(fromlat))/(parseFloat(tolng) - parseFloat(fromlng));
            // let deg = Math.atan2(Math.atan(slope)) 
            let deg = 360*Math.atan2(diff_y, diff_x)/(2*Math.pI)-90;
            console.log('angle:'+deg)
            return deg;
        },      
        /**
         * 创建地图覆盖物
         */
        addMarkers(lng,lat,text,name,isContent){
            let _this = this;
            let haveMarker = false
            for (var i = 0; i < _this.markers.length; i++){
                // 获取存在每个 extData 中的 id
                var id = _this.markers[i].getExtData().id;
                if (id === name){
                    let targetMarker = _this.markers[i];
                    haveMarker = true;
                    console.log(name+'位置更新')
                    targetMarker.setPosition([lng,lat])
                    if (isContent){
                        targetMarker.setContent(text);
                    }
                    if ('car' == name){
                        targetMarker.setAngle(_this.getCarIconAngle(lng,lat,_this.lasttimeLngLat[0],_this.lasttimeLngLat[1]))
                    }
                    break;
                }
            }
            if (!haveMarker){
                if (!isContent){
                    // 创建地图Icon对象
                    var startIcon = new AMap.Icon({
                        size: new AMap.Size(_this.markerMap[name].sizeX, _this.markerMap[name].sizeY),// 图标尺寸
                        image: _this.markerMap[name].src,// 图标的取图地址
                        imageSize: new AMap.Size(_this.markerMap[name].sizeX, _this.markerMap[name].sizeY)// 图标所用图片大小
                    });
                        // 创建标记点对象
                    var marker = new AMap.Marker({
                        position: new AMap.LngLat(lng,lat),
                        icon: startIcon,
                        offset: new AMap.Pixel(_this.markerMap[name].positionX, _this.markerMap[name].positionY),
                        extData:{id: name},
                        angle:'car'==name?_this.getCarIconAngle(lng,lat,_this.lasttimeLngLat[0],_this.lasttimeLngLat[1]):0
                    });
                    _this.map.add(marker);
                    _this.markers.push(marker);
                } else {
                    //出发和目的地添加文本描述
                    var markerText = new AMap.Marker({
                        position: new AMap.LngLat(lng,lat),
                        offset: new AMap.Pixel(_this.markerMap[name].positionX, _this.markerMap[name].positionY),
                        content:text,
                        extData:{id: name}
                    });
                    _this.map.add(markerText);
                    _this.markers.push(markerText);
                }
            }
            //地图自适应尺寸的位置
            if (_this.carOrderStatusMap[_this.orderStatus].autoMarker){
                _this.map.setFitView();
                console.log('setFitView')
            }
            _this.lasttimeLngLat = [lng,lat];
        },
        /**
             * 获取驾车路线
             */
        removeMarker(type){
            let _this = this;
            for (var i = 0; i < _this.markers.length; i++){
                // 获取存在每个 extData 中的 id
                var id = _this.markers[i].getExtData().id;
                if (id === type){
                    let targetMarker = _this.markers[i];
                    _this.map.remove(targetMarker);
                }
            }
        },
        /**
             * 获取驾车路线
             */
        getDriving(fromLng,fromLat,toLng,toLat,type){
            let _this = this;
            if (_this.isfirstDrive){
                //构造路线导航类
                _this.driving = new AMap.driving({
                    map: _this.map,
                    hideMarkers:true
                    // showTraffic:false
                }); 
            }

            _this.isfirstDrive = false;
            _this.driveindex++;
            if (_this.driveindex%2 == 0 || _this.driveindex < 3 ){ //两次查询渲染一次驾车路线和汽车位置  
                // 根据起终点经纬度规划驾车导航路线
                _this.driving.search(new AMap.LngLat(fromLng, fromLat), new AMap.LngLat(toLng, toLat), function(status, result) {
                    // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
                    if (status === 'complete') {
                        //添加司机位置concent信息
                        if ('waitTrip'==type){
                            _this.addMarkers(fromLng,fromLat,_this.getMarkerContect([result.routes[0].distance,result.routes[0].time],'waitTrip'),'carContent',true);
                        } else if ('triping'==type){
                            _this.addMarkers(fromLng,fromLat,_this.getMarkerContect([result.routes[0].distance,result.routes[0].time],'triping'),'carContent',true);
                        }
                        console.log('距离'+result.routes[0].distance+'时间'+result.routes[0].time)
                        //地图自适应尺寸的位置
                        if (_this.carOrderStatusMap[_this.orderStatus].autoMarker){
                            _this.map.setFitView();
                            console.log('setFitView')
                        } else {
                            _this.map.setCenter([fromLng, fromLat]);
                        }
                        console.log('绘制驾车路线完成:')
                    } else {
                        console.log('获取驾车数据失败:' + JSON.stringify(result))
                    }
                });
            }  
        },
        /**
             * 取消呼叫
             */
        cancelCall(){
            let _this = this;
            extendUtils.showConfirm('正在努力为您呼叫司机，确认要取消吗？', function(){
                _this.cancelOrderCar('call');
            }, 2, '暂不取消', '确认取消', null, function () {}, true)            
        },
        /**
             * 司机已接单乘客主动取消行程
             */
        cancelTrip(){
            let _this = this;
            if (!!!_this.choosedReasonId){
                extendUtils.showToast('请选择取消原因');
                return;
            } else if (_this.choosedReasonId == 7 && _this.choosedReason == ''){
                extendUtils.showToast('请输入取消原因');
                return;
            }
            _this.showCancelReason = false;
            _this.cancelOrderCar('trip');
        },
        /**
             * 取消订单的操作
             */
        cancelOrderCar(type){
            let _this = this;
            let obj = {
                orderNo:_this.orderNo
            }
            if ('call' == type){ //取消呼叫
                obj['cancelCode'] = 1;
            } else if ('trip' == type){ //取消行程
                obj['cancelCode'] = _this.choosedReasonId;
            }
            if (_this.choosedReasonId == 7){
                obj['cancelReason'] = _this.choosedReason;
            }
            _this.loadingText = '取消中';
            _this.loading = true;
            requestHandler.cancelOrderCar(obj).then(function (res) {
                _this.loading = false;
                if (res.code == 0){
                    if (res.result.success == true){
                        extendUtils.showToast('取消成功');
                        if ('call' == type){
                            let loadData = JSON.stringify({refresh:true});
                            extendUtils.closePage('', 1, loadData);
                        } else if ('trip' == type){ //取消行程
                            _this.initData();
                        }
                    } else {
                        extendUtils.showToast('取消失败');
                    }
                } else {
                    extendUtils.showToast('取消失败');
                }
            }).catch((e) => {
                _this.loading = false;
                console.log(e);
            });
        },
        /**
             * 支付超时后的操作
             */
        payTimeout(){
            let that = this;
            if (that.orderStatus != that.carOrderNameMap.uNPAID){
                return;
            }
            //pc端不主动查询状态，而是弹出确认框，用户确认后再查询
            if (extendUtils.isPC()){
                let msg = '抱歉，您的订单由于超时未支付已取消，请重新预订';
                extendUtils.showConfirm(msg, function(){
                    that.getOrderDetail();
                    // that.orderAgain();
                }, 1, null, '确定', null, null, true)
            } else {
                that.getOrderDetail(); //倒计时完成，再拉取一次订单详情
            }
        },
        /**
             * 支付成功回调
             */
        paySuccCallback() {
            this.timeInterval && clearInterval(this.timeInterval);
            let param = OrderClass.toSuccessParam();
            param.query.pageFrom = 'order';
            this.$router.push(param);
        },
        /**
             * 打电话
             */
        callPhone(typeOrNo) {
            // const _this = this;
            if ('server'==typeOrNo){
                sinosdk.sino.callTel(extendUtils.BIS_CUSTOMER_SERVICE_PHONE);
            } else {
                sinosdk.sino.callTel(typeOrNo);
            }
        },
        /**
             * 开发中
             */
        codeing(){
            extendUtils.showToast('程序小哥努力开发中，敬请期待...')
        },
        /**
             * 格式化显示时长
             */
        formatTime(item){
            if (item && item >= 1) {
                if (item>=3600){
                    return {value:[parseInt(new Date(item * 1000).format('HH')),parseInt(new Date(item * 1000).format('mm'))],haveHour:true};
                } if (item>=60){
                    return {value:parseInt(new Date(item * 1000).format('mm')),unit:'分钟',haveHour:false};
                } else if (item<60){
                    return {value:parseInt(new Date(item * 1000).format('ss')),unit:'秒',haveHour:false};
                        
                }
            }
            return '';
        },
        /**
             * 距离格式化
             */
        formatDistance(item){
            if (item && item >= 500) {
                return {value:parseInt(item/100)/10,unit:'公里'};
            }
            return {value:item,unit:'米'};
                
            // return '';
        },
        /**
             * 分享行程
             */
        shareTrip(){
            var _this = this;
            sinosdk.sino.contacts([], '1').then((data) => {
                if (0 < data.length) {
                    try {
                        let userListLength = data.length;
                        for (let i=0;i<userListLength;i++){
                            _this.openChat({UAId: data[i].uAId, UAName: data[i].uName})
                        }
                    } catch (e) {
                        console.log('从T信通讯录中获取人员信息失败')
                    }
                }
            });
        },
            
        /**
             * 发送聊天上下文
             */
        openChat (item) {
            var _this = this;
            var location = window.location
            var appIconPath = location.origin + location.pathname.split('order/index.html')[0] + 'assets/img/car/icon_car.png'
            var pcIconPath = location.origin + location.pathname.split('order/index.html')[0] + 'assets/img/car/icon_car.png'
            var date = _this.orderInfo.orderTime || new Date().format('yyyy/MM/dd hh:mm');
            date = date.substring(0,10);    
            date = date.replace(/-/g,'/'); 
            var timestamp = new Date(date).getTime() / 1000;
            //pageType=businessTrip
            //todo 以上参数是为了兼容app的商旅链接判断的，后续需要app端进行修改。
            var flowUrl = location.origin + location.pathname + "#/detail/car?ProdId="+_this.prodId+"&pageType=businessTrip&pageFrom=share&orderNo=" + _this.orderNo+ "&appletUAId=" + _this.appletUAId;
            var flowInfor = {
                "flowUrl":flowUrl,//从聊天上下文跳转回来的url
                "flowId":0,
                "flowName":'用车行程分享',//模版名
                "applyId": _this.$route.query.uaId,//申请人Id
                "applyName": _this.uName,//申请人名字 
                "approveId":item.uAId,//审批人Id
                "approveName":item.uAName,//审批人名字
                "flowStatus":-1,//表单状态，目前无实际作用
                "flowCreateTime": timestamp,//审批历史时间
                "iconId": 0,
                "toChatuName":'UAName',//发起聊天人名字
                "toChatUAId":_this.$route.query.uaId,//发起聊天人id
                "appIconPath": appIconPath,//聊天上下文图标调用web资源——app
                "pcIconPath": pcIconPath,//聊天上下文图标调用web资源——pc
                "appId": _this.appId,
                "whereMsgFrom": '通知',
                "content":"新消息"
            };
            let openJson = {
                action  : 'IntentAction_SSChatActivity',// OpenActionFunction 聊天上下文action
                dataList: [{key: 'EXTRA_CONV_ID', value: item.uAId, type: "long"},// 会话ID  值是long型 toChatUAId
                    {key: 'EXTRA_IS_GROUP', value: false, type: "bool"},// 是否群组  值是布尔型 false
                    {key: 'EXTRA_CONVER_NAME', value: item.uAName, type: "string"},// 会话名称   值是String型 toChatuName
                    {key: 'EXTRA_CONV_UNREAD_NUMBER', value: 0, type: "int"},// 消息未读数  值是int型 0
                    {key: 'EXTRA_MSG_TYPE', value: 'OA', type: "string"},//OA消息类型   值是String型 “OA”
                    {key: 'EXTRA_OAFORM_CONTEXTKEY', value: JSON.stringify(flowInfor), type: "string"}]//OA内容   值是String型
            }
            sinosdk.sino.getUserInfo({"UAId":item.uAId}).then(function(uaData){
                if (1 == uaData.isActive && undefined != uaData.uName && "" != uaData.uName){ //用户存在
                    _this.toOpenChat(openJson).then(function(){
                        //调用成功
                    })
                } else {
                    // extendUtils.showToast(item.uAName+'已被删除，无法分享', 'middle');
                }
            })
        },
        /**
             * openChat聊天上下文新方法
             */
        toOpenChat (str) {
            return sinosdk.sino.execAction(JSON.stringify(str));
        },
        /**
             * 获取appid和用户名字
             */
        getAppid () {
            var _this = this
            sinosdk.sino.getUserInfo({"UAId":parseInt(_this.$route.query.uaId)}).then(function(uaData){
                _this.uName = uaData.uName;   
            })
            if (!!this.appId){
                    
            } else {
                sinosdk.sino.getAppInfo({'key':'msgSource'}).then(function(Data){
                    if (!!Data){ //用户存在
                        var jsonData = JSON.parse(Data.value);
                        _this.appId = jsonData.appId || 0
                    } else {
                        _this.appId = 0;
                    }
                })
            }
        },
        /**
             * 补开报销
             */
        toReimburse() {
            let _this = this;
            if (_this.invoiceFlag=='1'){
                OrderClass.toViewInvoiceDetail();
            } else {
                OrderClass.toReimburse();
            }
                
        },
        /**
             * 动态加载支付组件
             */
        loadPayComp(){
            //动态加载支付组件
            requestHandler.dynamicLoadPay(()=>{
                this.swpPayLoad = true;
            })
        },

        /**
             * 异步调起支付组件
             */
        openPay(){
            if (!this.swpPayLoad){
                this.popLoading = true;
                setTimeout(()=>{
                    this.openPay();
                },100);
                return;
            }
            this.popLoading = false;
            this.showPayTypes = true;
        }
    }
}
</script>
<style lang="less">
    @import './orderDetail.less';
</style>
