<template>
  <div>
        <div class="jumpLoading" v-if="NeedJump === 2">
            <img src="~assets/img/trip/loading _2.gif" alt="">
        </div>
        <div v-if="loading && NeedJump !== 2">
            <LoadingX tip='数据加载中...' :spinning="true" :turn="true" />
        </div>
        <div v-if="!loading && NeedJump !== 2" class="infoBox">
              <img src="~assets/img/trip/top_line.png" class="topline">
            <div class="bookInfoBox">
                <div class="title">预订信息</div>
                <div v-if="roundTripFlag">
                    <div class="infoItem">
                        <span class="infoKey">行程</span>
                        <span class="infoValue">{{orderInfo[0].startCity}}<i class="iconRoundTrip"></i>{{orderInfo[0].endCity}}（往返）</span>
                    </div>
                    <div class="infoItem">
                        <span class="infoKey">航班</span>
                        <div class="infoValue">
                            <div>{{orderInfo[0].airLine[0]}}（去程）</div>
                            <div>{{orderInfo[0].airLine[1]}}（返程）</div>
                        </div>
                    </div>
                    <div class="infoItem">
                        <span class="infoKey">舱位</span>
                        <span class="infoValue">{{orderInfo[0].CabinType}}</span>
                    </div>
                    <div class="infoItem">
                        <span class="infoKey">出发时间</span>
                        <div class="infoValue">
                            <div>{{orderInfo[0].startTime[0]}}（去程）</div>
                            <div>{{orderInfo[0].startTime[1]}}（返程）</div>
                        </div>
                    </div>
                    <div class="infoItem">
                        <span class="infoKey">乘客</span>
                        <span class="infoValue">{{orderInfo[0].passengers}}</span>
                    </div>
                    <div class="infoItem">
                        <span class="infoKey">消费金额</span>
                        <span class="infoValue">{{orderInfo[0].totalAmount}}</span>
                    </div>
                </div>
                <div v-if="!roundTripFlag">
                    <div class="infoItem" v-if="orderInfo[0].startStation && (orderType  === 'train')">
                        <span class="infoKey">行程</span>
                        <span class="infoValue">{{orderInfo[0].startStation}}<i class="iconOneWay"></i>{{orderInfo[0].endStation}}</span>
                    </div>
                    <div class="infoItem" v-if="orderInfo[0].startCity && (orderType  === 'flight')">
                        <span class="infoKey">行程</span>
                        <span class="infoValue">{{orderInfo[0].startCity}}<i class="iconOneWay"></i>{{orderInfo[0].endCity}}</span>
                    </div>
                    <div class="infoItem" v-if="orderInfo[0].CityName && orderType  === 'car' ">
                        <span class="infoKey">用车城市</span>
                        <span class="infoValue">{{orderInfo[0].CityName}}</span>
                    </div>
                    <div class="infoItem" v-if="orderInfo[0].CityName && orderType  === 'car' ">
                        <span class="infoKey">行程</span>
                        <span class="infoValue">{{orderInfo[0].StartName}}<i class="iconOneWay"></i>{{orderInfo[0].EndName}}</span>
                    </div>
                    <div class="infoItem" v-if="orderInfo[0].CarType && orderType  === 'car' ">
                        <span class="infoKey">车型</span>
                        <span class="infoValue">{{carTypeData[orderInfo[0].CarType].name}}</span>
                    </div>
                    <div class="infoItem" v-if="orderInfo[0].DepartureTime && orderType  === 'car' ">
                        <span class="infoKey">用车时间</span>
                        <span class="infoValue">{{orderInfo[0].DepartureTime}}</span>
                    </div>
                    <div class="infoItem" v-if="orderInfo[0].TotalPrice && orderType  === 'car' ">
                        <span class="infoKey">消费金额</span>
                        <span class="infoValue">￥{{orderInfo[0].TotalPrice}}</span>
                    </div>
                    <div v-for="(count, i1) in orderInfo" :key="i1">
                        <div v-for="(item, i2) in infoKey" :key="i1 +'-' + i2">
                            <div class="infoItem" v-if="orderInfo[i1][item.key]">
                                <span class="infoKey">{{item.name}}</span>
                                <span class="infoValue">{{orderInfo[i1][item.key]}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="excesssInfoBox">
                <div class="title">{{title[0]}}</div>
                <div v-if="abnormalFlag === 'excess' && orderType  === 'car'" class="excesssInfo">{{excessText.text+carTypeData[orderInfo[0].CarType].name+'，费用为'+orderInfo[0].TotalPrice}}，已超出<a href="javascript:;" @click="goCriterion">差旅标准</a></div>
                <div v-if="abnormalFlag === 'excess' && orderType  != 'car'" class="excesssInfo">{{excessText.text}}<span v-for="(count, i1) in orderInfo" :key="i1">{{orderInfo[i1][excessText.key]}} </span>，已超出<a href="javascript:;" @click="goCriterion">差旅标准</a></div>
                <div v-if="abnormalFlag !== 'excess'" class="excesssInfo">{{abnormalText}}</div>
                <div class="infoItem">
                    <span class="infoKey">{{title[1]}}</span>
                    <span v-if="abnormalFlag === 'excess' && orderType  === 'car'" class="infoValue">{{criterionText}}</span>
                    <span v-if="abnormalFlag === 'excess' && orderType  != 'car'" class="infoValue">{{businessCriteria}}</span>
                    <span v-if="abnormalFlag !== 'excess'" class="infoValue">{{abnormalTrip}}</span>
                </div>
            </div>
            <div class="excesssReasonBox">
                <div class="title">{{title[2]}}</div>
                <div class="excesssReason">{{excessData.abnormalReason}}</div>
            </div>
            <img src="~assets/img/trip/bottom_line.png" class="bottomline">
        </div>
        <div v-if="!loading && NeedJump !== 2" class="booker clear">
            <span class="userAvatar"  :style="{backgroundImage: 'url(' + userIconUrl + ')'}"></span>
            <div class="userInfo">
                <span class="userName">{{UserName}}</span>
                <i class="iconChat" @click="openChat({UAId: TChatUaId, UAName: UserName})"></i>
                <span class="fr">预订人</span>
            </div>
            <div class="createTime">{{excessData.orderCreateTime}}</div>
        </div>
  </div>
</template>

<script>

import { getTitle, getInfoKey, getExcessText, getAbnormalText,getOrderType,carTypeData,criterionCarTypeData,CarlimitTypeData,defaultImg} from '../enum/excessEnum.js'
import tripHandler from '../tripHandler.js';

import LoadingX from "components/loading/index";

let urlParams = tripHandler.getUrlParams()


export default {
    mixins: [tripHandler.mixin.tChatEventMixin],
    name: 'tripExcess',
    components: {
        LoadingX
    },
    data () {
        return {
            appId:'',
            whereMsgFrom:'',
            loading:true,
            abnormalFlag: 'excess',
            abnormalFlagText:'超标',
            orderType: 'flight',
            roundTripFlag: false,
            title: [],
            infoKey: [],
            excessText: {},
            abnormalText: '',
            // UaId: '',
            ProdId: '',
            orderNo: '',
            tripNo: '',
            Flag: 0,
            UserName: 0,
            TChatUaId: 0,
            excessData: {},
            orderInfo: [],
            businessCriteria: '',
            abnormalTrip: '',
            orderCreateTime: '',
            NeedJump: '',
            founderUaId: '',
            founderCpyId: '',
            appletUAId: '',
            carTypeData:carTypeData,//用车车型配置
            criterionText:'',//差标解析文字
            criterionCarTypeMap:criterionCarTypeData,//商务用车差标车型数据
            CarlimitTypeMap:CarlimitTypeData,//商务用车差标限额车型数据
            userIconUrl:defaultImg.src,//默认头像图片
            uaIdType:'long' //UAId的数据类型，默认是long
        }
    },
    created () {
        let that = this
        // this.UaId = parseInt(urlParams.BTPUaId);
        this.ProdId = parseInt(urlParams.ProdId);
        this.orderNo = urlParams.OrderNo
        this.tripNo = urlParams.TripNo
        this.Flag = parseInt(urlParams.Flag)
        this.UserName = decodeURI(decodeURI(urlParams.UserName))
        this.dealTChatUaId();//用该方法确认UAId是long数据类型还是string数据类型
        this.appletUAId = parseInt(urlParams.appletUAId)
        this.appId = parseInt(urlParams.AppId)
        this.getAppid()
        let orderType = parseInt(urlParams.OrderType)
        this.orderType = getOrderType(orderType)
        this.NeedJump = parseInt(urlParams.NeedJump) 
        that.init();

        // NeedJump===2  代表是点击去询问按钮进来的  直接跳聊天上下文
        if (this.NeedJump === 2) {
            that.openChat({UAId: this.TChatUaId, UAName: this.UserName})
            
        }
    },
    computed:{

    },
    methods: {
        /**
        * T信回退事件的注册回调 必须是goBackFun
        */
        goBackFun(){
            tripHandler.closePage();         
        },
        init () {
            this.getUserIcon();
            // 46091006 超标 之前是46100002为了兼容老的超标的错误码
            // 46091004 行程异常
            console.log('init start')  
            this.abnormalFlag = (this.Flag === 46091006 || this.Flag === 46100002) ? 'excess' : 'abnormal'
            this.abnormalFlagText = (this.Flag === 46091006 || this.Flag === 46100002) ? '超标' : '异常'
            this.title = getTitle(this.abnormalFlag)
            this.infoKey = getInfoKey(this.orderType)
            this.excessText = getExcessText(this.orderType)
            this.abnormalText = getAbnormalText(this.orderType)
            document.title = this.UserName + (!!this.UserName&&this.UserName!=''?'的行程':'行程') + this.abnormalFlagText
            this.getExcessData();
        },
        dealTChatUaId(){
            this.TChatUaId = decodeURIComponent(urlParams.TChatUaId);
            let reg = /^[0-9]*$/;
            if (reg.test(this.TChatUaId)){
                this.TChatUaId = parseInt(urlParams.TChatUaId);
                this.uaIdType = 'long';
            } else {
                this.uaIdType = 'string';
            }
        },
        /**
         * 获取用户头像
         */
        getUserIcon(){
            let _this = this;
            sinosdk.sino.userProfile({ uaid: this.TChatUaId }).then((data) => {
                if (data && data.iconData) {
                    let base64 = data.iconData.replaceAll("\n", "");
                    base64 = base64.replaceAll("\r", "");
                    _this.userIconUrl = `data:image/jpg;base64,${base64}`
                } else {
                    _this.userIconUrl = `../communication_icon/${this.TChatUaId}`;
                }
            }).catch(()=>{
                _this.userIconUrl = `../communication_icon/${this.TChatUaId}`;
            })
        },   

        // 获取超标异常信息及格式化数据
        getExcessData () {
            let param = {
                orderNo: this.orderNo,
                tripNo: this.tripNo,
                flag: this.abnormalFlagText == '超标' ? 46091006 : 46091004
            }
            tripHandler.getExcessData(param).then((data) => {
                this.excessData = data.result;
                this.founderUaId = this.excessData.founderUaId
                this.founderCpyId = this.excessData.founderCpyId
                switch (this.orderType) {
                case 'flight':
                    this.orderInfo = this.excessData.specialPermissionFlight;
                    this.roundTripFlag = this.excessData.specialPermissionFlight.length === 2
                    break
                case 'train':
                    this.orderInfo = this.excessData.specialPermissionTrain
                    break
                case 'hotel':
                    this.orderInfo = this.excessData.specialPermissionHotel
                    if (this.abnormalFlag === 'excess') {
                        this.orderInfo[0].averagePrice = '￥' + this.orderInfo[0].averagePrice + '/晚'
                        this.excessData.businessCriteria[0] = this.excessData.businessCriteria[0] ? '￥' + this.excessData.businessCriteria[0] + '/晚' : ''
                    }
                    break
                case 'car':
                    this.orderInfo = this.excessData.specialPermissionCar
                    break
                default:
                    return
                }
                if (this.abnormalFlag === 'abnormal') {
                    this.abnormalTrip = this.excessData.abnormalTrip.departCity + '--' + this.excessData.abnormalTrip.arrivalCity 
                                        + ' ' + this.excessData.abnormalTrip.beginTime + '-' + this.excessData.abnormalTrip.endTime
                } else if (this.abnormalFlag === 'excess') {
                    this.businessCriteria = this.excessData.businessCriteria.join('、')
                }
                if (this.roundTripFlag) {
                    this.orderInfo = []
                    this.orderInfo[0] = Object.assign({}, this.excessData.specialPermissionFlight[0])
                    this.orderInfo[0].airLine = [this.excessData.specialPermissionFlight[0].airLine, this.excessData.specialPermissionFlight[1].airLine]
                    this.orderInfo[0].startTime = [this.excessData.specialPermissionFlight[0].startTime, this.excessData.specialPermissionFlight[1].startTime]
                    this.orderInfo[0].totalAmount = '￥' + (this.excessData.specialPermissionFlight[0].totalAmount + this.excessData.specialPermissionFlight[1].totalAmount)
                } else {
                    this.orderInfo.forEach((el) => {
                        el.totalAmount = '￥' + el.totalAmount
                    })
                }
                this.getcriterionText(data);
                this.loading = false;
                console.log('init end')
            })
        },
        // 跳转到差标页面
        goCriterion () {
            let url = 'criterion?FounderUaId=' + this.founderUaId + '&FounderCpyId=' + this.founderCpyId + '&name=' + (this.UserName || '') + '&uaId=' + (!!this.$route.query.UAId?this.$route.query.UAId:this.$route.query.uaId);
            tripHandler.goCriterion('criterion',url);
        },

        //获取聊天上下文前面显示的图标
        getIconImgName(){
            let iconImgName = 'hotel.png';
            switch (this.orderType) {
            case 'train':
                iconImgName = 'train.png'
                break;
            case 'flight':
                iconImgName = 'flight.png'
                break;
            case 'hotel':
                iconImgName = 'hotel.png'
                break;
            default:
                iconImgName = 'hotel.png'
                break;
            }
            return iconImgName;
        },

        // 打开预订人的聊天窗口并发送聊天上下文
        openChat (item) {
            var _this = this;
            var location = window.location
            let iconImgName = this.getIconImgName();
            var appIconPath = location.origin + location.pathname.split('modules/trip.html')[0] + 'assets/img/tripList/' + iconImgName;
            var pcIconPath = location.origin + location.pathname.split('modules/trip.html')[0] + 'assets/img/tripList/' + iconImgName;
            var date = this.excessData.orderCreateTime || new Date().format('yyyy-MM-dd hh:mm');
            date = date.substring(0,10);    
            date = date.replace(/-/g,'/'); 
            var timestamp = new Date(date).getTime() / 1000;

            //pageType=businessTrip
            //todo 以上参数是为了兼容app的商旅链接判断的，后续需要app端进行修改。
            var flowUrl = location.origin + location.pathname + "#/excess?pageType=businessTrip" + "&OrderType=" + parseInt(urlParams.OrderType)
                         + "&OrderNo=" + this.orderNo + "&TripNo=" + this.tripNo + "&appletUAId=" + this.appletUAId
                        + '&Flag=' + parseInt(this.Flag) + "&UserName="+encodeURI(encodeURI(this.UserName)) + "&TChatUaId=" + this.TChatUaId + "&appId=" + parseInt(this.appId)+ "&ProdId=" + this.ProdId;
            var flowInfor = {
                "flowUrl":flowUrl,//从聊天上下文跳转回来的url
                "flowId":0,
                "flowName":'行程' + this.abnormalFlagText,//模版名
                "applyId": item.UAId,//申请人Id
                "applyName": item.UAName,//申请人名字 
                "approveId":item.UAId,//审批人Id
                "approveName":item.UAName,//审批人名字
                "flowStatus":-1,//表单状态，目前无实际作用
                "flowCreateTime": timestamp,//审批历史时间
                "iconId": 0,
                "toChatuName":item.UAName,//发起聊天人名字
                "toChatUAId":item.UAId,//发起聊天人id
                "appIconPath": appIconPath,//聊天上下文图标调用web资源——app
                "pcIconPath": pcIconPath,//聊天上下文图标调用web资源——pc
                "appId": this.appId,
                "whereMsgFrom": this.abnormalFlagText + '通知',
                "content":"新消息"
            };
            let openJson = {
                action  : 'IntentAction_SSChatActivity',// OpenActionFunction 聊天上下文action
                dataList: [{key: 'EXTRA_CONV_ID', value: item.UAId, type: _this.uaIdType},// 会话ID  值是long型 toChatUAId
                    {key: 'EXTRA_IS_GROUP', value: false, type: "bool"},// 是否群组  值是布尔型 false
                    {key: 'EXTRA_CONVER_NAME', value: item.UAName, type: "string"},// 会话名称   值是String型 toChatuName
                    {key: 'EXTRA_CONV_UNREAD_NUMBER', value: 0, type: "int"},// 消息未读数  值是int型 0
                    {key: 'EXTRA_MSG_TYPE', value: 'OA', type: "string"},//OA消息类型   值是String型 “OA”
                    {key: 'EXTRA_OAFORM_CONTEXTKEY', value: JSON.stringify(flowInfor), type: "string"}]//OA内容   值是String型
            }
            setTimeout(()=>{
                sinosdk.sino.getUserInfo({"UAId":item.UAId}).then(function(uaData){
                    if (1 == uaData.isActive && undefined != uaData.uName && "" != uaData.uName){ //用户存在
                        _this.toOpenChat(openJson).then(function(){
                            //调用成功
                        })
                                                
                        if (_this.NeedJump === 2 && tripHandler.isPC()) {
                            console.log('关闭页面')
                            tripHandler.closePage('sswbv_go_home')
                        }
                    } else {
                        tripHandler.showToast('该用户已被删除，无法聊天', 'middle');
                    }
                })
            },1000)
        },
        /**
         * openChat聊天上下文新方法
         */
        toOpenChat (str) {
            return sinosdk.sino.execAction(JSON.stringify(str));
        },
        getAppid () {
            var _this = this
            console.log('getAppid start')
            if (!!this.appId){
                
            } else {
                sinosdk.sino.getAppInfo({'key':'msgSource'}).then(function(Data){
                    if (!!Data){ //用户存在
                        var jsonData = JSON.parse(Data.value);
                        _this.appId = jsonData.appId || 0
                        
                    } else {
                        _this.appId = 0;
                    }
                    console.log('getAppid end')
                })
            }
        },
        getcriterionText(res){
            var _this = this
            let data = (res.result.businessCriteria || [])[0] || {};
            //商务用车标准
            let carTypes = data.vehicleType || [];
            let typeStr = '';
            let limitStr = '';
            if (0<carTypes.length){
                typeStr+='';
                typeStr += carTypes.map(ele => {
                    return _this.criterionCarTypeMap[ele]
                }).join('、');
                typeStr += '';
            }
            
            if (!!data.vehicleLimitPrice && 0 < data.vehicleLimitPrice.length){
                let tempArr = data.vehicleLimitPrice;
                let len = tempArr.length;
                for (let i = 0; i < len; i++) {
                    let type = tempArr[i].limitPriceType;
                    if (i == 0){
                        if (typeStr == ''){
                            limitStr+=('您的'+_this.CarlimitTypeMap[type]+'为'+tempArr[i].limitPrice/100+'元');
                        } else {
                            limitStr+=('，'+_this.CarlimitTypeMap[type]+tempArr[i].limitPrice/100+'元');
                        }
                    } else {
                        limitStr+=('，'+_this.CarlimitTypeMap[type]+tempArr[i].limitPrice/100+'元');
                    }
                }
            } 
            _this.criterionText = typeStr+limitStr;

        }
    }
}
</script>

<style lang='less' scoped>
@import '~styles/core/common.less';
@import '~styles/mixins/mixinsStyle.less';

.infoBox {
    position: relative;
    margin: .3rem;
    padding: 0 .3rem .3rem;
    background-color: @sub-background-color;
    font-size: .32rem;
    .topline {
        position: absolute;
        top: 0;
        left: -2%;
        width: 104%;
        transform: translateY(-50%);
        z-index: -1;
    }
    .bookInfoBox, .excesssInfoBox {
        border-bottom: 1px dashed @border-color-base;
    }
    .excesssInfo {
        color: @warning-color-light;
        font-size: .32rem;
        a {
            color: @theme-color;
        }
    }
    .bottomline {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        transform: translateY(99%)
    }
    
}
.title {
    padding-top: .3rem;
    padding-bottom: .12rem;
    font-size: .34rem;
    font-weight: bold;
}
.infoItem {
    display: flex;
    padding: .12rem 0;
    font-size: .32rem;
    .infoKey {
        width: 1.8rem;
        color: @third-text-color;
        padding-right: .1rem;
        line-height: 1.4em;
    }
    .infoValue {
        flex: 1;
        line-height: 1.4em;
    }
}
.booker {
    margin: .8rem;
    padding: .22rem .2rem .22rem .22rem;
    border-radius: .12rem;
    background-color: @sub-background-color;
    font-size: .34rem;
    line-height: 0.76rem;
    .userAvatar {
        float: left;
        width: .76rem;
        height: .76rem;
        margin-right: .2rem;
        font-size: 0px;
        background-image: url(~assets/img/trip/user_default.png);
        background-size: 100%;
    }
    .userInfo {
        height: .38rem;
        line-height: 0.38rem;
        .userName {
            margin-right: .3rem;
            float: left;
        }
        .iconChat {
            float: left;
            width: .38rem;
            height: .38rem;
            background: url(~assets/img/trip/icon_chat.png) no-repeat center;
            background-size: 100%;
            cursor: pointer;
        }
    }
    .createTime {
        font-size: .3rem;
        color: @third-text-color;
        height: .38rem;
        line-height: 0.38rem;
    }
}
.iconRoundTrip, .iconOneWay {
    display: inline-block;
    width: 1.46em;
    height: 1.46em;
    margin: 0 .16rem;
    background: url(~assets/img/trip/icon_round_trip.png) no-repeat center;
    background-size: 100%;
    vertical-align: bottom;
}
.iconOneWay {
    background: url(~assets/img/trip/icon_one_way.png) no-repeat center;
    background-size: 100%;
}

.jumpLoading {
    width: 100%;
    height: 100%;
    text-align: center;
    background-color: @sub-background-color;
    img {
        width: 1rem;
        height: 1rem;
        margin-top: 1rem;
    }
}
@media screen and (min-width: @screen-sm) {
    .booker {
        margin-top: 60px;
    }
}
@media screen and (min-width: @screen-md) {
    .booker {
        margin-top: 80px;
    }
}
@media screen and (min-width: @screen-lg) {
    .booker {
        margin-top: 100px;
    }
}
</style>
