<template>
    <div class="insurancesListWrap">
        <div class="insurancesDetailOutWrap" v-if="0 < insuranceOrders.length">
            <div class="insurancesDetailWrap" v-for="(insurance,index) in insuranceOrders" :key="index">
                <div class="insurancesOrder"
                    v-if="!!insurance.orderNo && '' != insurance.orderNo">保险订单号
                    {{insurance.orderNo}}</div>
                <div class="insurancesItem">
                    <div class="insurancesName">
                        <Icon type='icon_plane_bao' class='icon' size='.35'/>
                        {{insurance.insuranceProduct.productShortName}}(￥{{insurance.insuranceProduct.farePrice}}/份)</div>
                    <div class="insurancesText"><airlogoList class='logo' :airCode="insurance.airLineBriefInfo.airLineCode"/>{{insurance.airLineBriefInfo.airCompanyName+insurance.airLineBriefInfo.flightNo}} {{formatTime(insurance.airLineBriefInfo.departTime)}}</div>
                    <div class="insurancesDetailTit">
                        <div class="left">被保险人</div>
                        <div class="right">保单状态</div>
                    </div>
                    <div class="insurancesDetailText cursorp" @click="showInsuranceDetail(insurance,item,index,ind)" v-for="(item,ind) in insurance.insuredInfos"
                        :key="ind">
                        <div class="left">{{item.name}}</div>
                        <div class="rightText" v-if="!quitInsOrdering">
                            <div class="text" :style="{color: insuranceStatus[item.status].color}">
                                {{insuranceStatus[item.status].text}}</div>
                            <div class="tips" v-if="insuranceStatus[item.status].showRefundInfo || 1">
                                退款将在1-7个工作日内原路退回</div>
                        </div>
                        <div class="rightText uncheck" :class="{active:arrhaveitem(item.insuredId,(quitInsOrders[indexOfArr(insurance.orderNo,quitInsOrders,'orderNo')] || {}).refundinsuredIds||[]),unable:!insuranceStatus[item.status].canCancel}" v-else>
                            <div class="text" :style="{color: insuranceStatus[item.status].color}">
                                {{insuranceStatus[item.status].text}}</div>
                            <div class="tips" v-if="insuranceStatus[item.status].showRefundInfo">
                                退款将在1-7个工作日内原路退回</div>
                        </div>
                        <Icon type='right' class='icon' size='.24'/>
                    </div>
                </div>
            </div>
        </div>
        <!-- 屏蔽手动退保功能机票改签退票会自动退保 -->
        <div class="searchBottomButtonWrap" v-if="false && selfOrder">
            <div class="searchButton cursorp" v-if="!quitInsOrdering" @click="quitInsOrdering = true">批量退保</div>
            <div class="searchButton littleButton cursorp" v-if="quitInsOrdering" @click="quitInsOrdering = false;quitInsOrders = [];">退出</div>
            <div class="searchButton cursorp" :class="{undo:0==quitInsOrders.length}" v-if="quitInsOrdering" @click="quitInsOrdersFun">退保</div>
        </div>
        <!-- 保险说明 -->
        <div v-transfer-dom>
            <popup v-model="showInsurancePop" height="100%" width="100%" position="right" class=insurancePopWrap>
                <flightInsuranceDetail v-model="showInsurancePop" :insuranceDetail="insuranceDetail"
                    :haveOrderInfo="true" :orderNo='insuranceOrders[outIndex].orderNo' @quitInsOrder='quitInsOrder'></flightInsuranceDetail>
            </popup>
        </div>
        <!-- loading -->
        <div v-transfer-dom>
            <Loading :show="quiting" :text='"取消中"'/>
        </div> 
    </div>
</template>

<script>
import requestHandler from 'orderCommon/requestHandler.js';
import extendUtils from 'orderCommon/extend.js';
import { insuranceStatus } from 'orderCommon/enum/orderStatusEnum.js';
import flightInsuranceDetail from 'flightComp/flightInsuranceDetail.vue';
import airlogoList from 'components/airlogo/airlogo.vue';
import {TransferDom,Popup,Loading} from 'vux';
const Icon = ()=>import('components/icon');
export default {
    directives: {
        TransferDom
    },
    mixins: [requestHandler.mixin.tChatEventMixin],
    components: {
        Icon,
        Popup,
        Loading,
        flightInsuranceDetail,
        airlogoList
    },
    data() {
        // let that = this;
        let managerData = extendUtils.stateManager.setData([
            {
                name: 'showInsurancePop',
                hide: {
                    title: '出行保险'
                },
                show: {
                    title: '保险详情'
                }
            }

        ], this);
        return Object.assign(managerData, {
            insuranceOrders: [],//保险订单列表
            insuranceDetail: {},//保险详情
            insuranceStatus: insuranceStatus,//保单状态
            quitInsOrdering:false,//批量退保选择状态
            quitInsOrders:[],//选中的待退保险
            quiting:false,//操作中
            outIndex:0,//保险订单索引
            inIndex:0,//保单索引
            selfOrder:true//true自己定fasle，他人定
        });
    },
    created: function () {
        let _this = this;
        _this.initData();
        // _this.registerAppfun();
    },
    mounted: function () { },
    watch: {},
    methods: {
        /**
             * 页面初始化
             */ 
        initData(){
            let _this = this;
            if (_this.$route.query.selfOrder=='false'){
                _this.selfOrder = false;
            } else if (!_this.$route.query.selfOrder){
                _this.selfOrder = false;
            }
            _this.insuranceOrders = JSON.parse(extendUtils.getStorage('insuranceOrders'));
        },
        /**
             * 注册app返回刷新等事件
             */
        // registerAppfun(){
        //     let _this = this;
        //     //注册并监听t信返回事件
        //     extendUtils.appBack(function(data){//点击app返回事件
        //         extendUtils.throttle(function(){
        //             _this.closeTopPop();
        //         }, this);                
        //     });
        //     //注册刷新事件
        //     extendUtils.reFreshPage(()=>{
        //         _this.initData();
        //     });
        // },
        goBackFun(){
            this.$router.back();
        },  
        /**
             * T信点击返回的事件处理
             */
        // closeTopPop() {
        //     let _this = this;
        //     extendUtils.stateManager.closeTopPop(() => {
        //         _this.$router.back();
        //     });
        // },          
        /**
             * 显示保险详情或选择退保人员
             */
        showInsuranceDetail(insurance, item,index,ind) {
            let _this = this;
            //是否是选择保险准备退保
            if (_this.quitInsOrdering){
                //无法退保的状态处理
                if (!_this.insuranceStatus[item.status].canCancel){
                    return;
                }
                let index = _this.indexOfArr(insurance.orderNo,_this.quitInsOrders,'orderNo'); // eslint-disable-line
                //有列表
                if (0 <= index) {
                    //列表有数据
                    if (_this.arrhaveitem(item.insuredId,_this.quitInsOrders[index].refundinsuredIds)){
                        _this.quitInsOrders[index].refundinsuredIds.splice(_this.indexOfArr(item.insuredId, _this.quitInsOrders[index].refundinsuredIds), 1);
                        if (0 == _this.quitInsOrders[index].refundinsuredIds.length){
                            _this.quitInsOrders.splice(index,1);
                        }
                        //列表无数据
                    } else {
                        _this.quitInsOrders[index].refundinsuredIds.push(item.insuredId);
                    }
                    //无列表 
                } else {
                    _this.quitInsOrders.push({orderNo:insurance.orderNo,refundinsuredIds:[item.insuredId]})
                } 
            } else {
                _this.outIndex = index;
                _this.inIndex = ind;
                _this.insuranceDetail = insurance;
                _this.$set(_this.insuranceDetail, 'insuranceChildOrder', item);
                _this.showInsurancePop = true;
            }
        },
        /**
            * 确定退保
            */
        quitInsOrdersFun(){
            let _this = this;
            if (_this.quiting || 0==_this.quitInsOrders.length){
                return;
            }
            extendUtils.showConfirm('确定要退保？', ()=>{
                let obj = {
                    quitInsOrders:_this.quitInsOrders
                }
                _this.quiting = true;
                requestHandler.quitInsOrders(obj).then(function (res) {
                    _this.quiting = false;
                    if (res.resultCode == 0){
                        //成功后重置选中的待退保单
                        _this.quitInsOrders = [];
                        _this.setInsOrderStart(res.result.insuredInfos);
                        extendUtils.showToast('退保成功');
                        _this.quitInsOrdering = false;
                    } else {
                        extendUtils.showToast('退保失败');
                    }
                }).catch((e) => {
                    _this.quiting = false;
                    console.log(e);
                });
            })
        },
        /**
            * 刷新保单状态
            */
        setInsOrderStart(insuredInfos){
            let _this = this;
            for (let key in insuredInfos) {
                let userinsuredInfos = insuredInfos[key];
                let outIndex = _this.indexOfArr(key,_this.insuranceOrders,'orderNo');
                for (let i=0;i<userinsuredInfos.length;i++){
                    let userIndex = _this.indexOfArr(userinsuredInfos[i].insuredId,_this.insuranceOrders[outIndex].insuredInfos,'insuredId');
                    _this.insuranceOrders[outIndex].insuredInfos[userIndex].status = userinsuredInfos[i].status;
                }
            }
            extendUtils.setStorage('insuranceOrders', JSON.stringify(_this.insuranceOrders));
        },
        /**
            * 刷新单个保单状态
            */
        quitInsOrder(status){
            let _this = this;
            _this.insuranceOrders[_this.outIndex].insuredInfos[_this.inIndex].status = status;
            extendUtils.setStorage('insuranceOrders', JSON.stringify(_this.insuranceOrders));
        },
        /**
            * 维数组是否包含元素
            */
        arrhaveitem(item, arr, key) {
            // let _this = this;
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
            * 格式化时间
            */
        formatTime(time){
            return new Date(time.replace(/-/g,'/')).format('MM月dd日');
        }         
    }
}
</script>
<style scoped lang="less">
    @import '~themes/default/styles/common/index.less';
    @import '~styles/mixins/hairLine.less';
    @import '~styles/mixins/mixinsStyle.less';
    .insurancesListWrap {
        .searchBottomButtonWrap{
            padding: 0.4rem 0.3rem;
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            background: #fff ;
            z-index: 1;
            box-shadow:0px -0.04rem 0.1rem 0px rgba(6,27,70,0.06);
            .flex-box();
            .justify-content(space-between);
            .searchButton {
                .flex(1);
                line-height: 0.84rem;
                background: @theme-color;
                color: #fff ;
                font-size: 0.32rem;
                border-radius: 0.08rem;
                text-align: center;
                border: 1px solid @theme-color;
                &.undo{
                    background: @info-color;
                    border: 1px solid @info-color;
                }
            } 
            .littleButton{
                margin-right: 0.32rem;
                border: 1px solid @theme-color;
                background: #fff;
                color: @theme-color ;
            }           
        }
        .insurancesDetailOutWrap{
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            padding: 0.4rem 0.3rem;
            font-size: 0.3rem;
            color: @text-color;
            overflow-y: auto;
            background: @background-color;
        }
        .insurancesDetailWrap {
            margin-bottom: 0.4rem;

            .insurancesOrder {
                padding-left: .42rem;
                margin-bottom: .12rem;
                font-size: 0.26rem;
                color: @third-text-color;
            }

            .insurancesItem {
                padding: 0.5rem 0.3rem;
                background: #fff;
                border-radius: @border-radius-base;
                box-shadow: 0px .04rem .3rem -.4rem rgba(125, 155, 250, 0.22);

                .insurancesName {
                    margin-bottom: 0.16rem;
                    font-size: 0.34rem;
                    color: @secondary-text-color;
                    font-weight: bold;
                    position: relative;
                    padding-left: .4rem;
                    .icon{
                        fill: @warning-color-light;
                        margin-right: .14rem;
                        position: absolute;
                        top: 50%;
                        left: 0;
                        transform: translateY(-50%);
                    }
                }
                .insurancesText {
                    .btpx();
                    margin-top: 0.16rem;
                    padding-top: .16rem;
                    font-size: 0.24rem;
                    color: @third-text-color;
                    .flex-box();
                    .align-items(center);
                    .logo {
                        margin-right: 0.07rem;
                    }
                }

                .insurancesDetailTit {
                    margin: 0.12rem 0;
                    font-size: 0.26rem;
                    color: @placeholder-color;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    .left {
                        flex: none;
                    }
                }

                .insurancesDetailText {
                    position: relative;
                    font-size: 0.3rem;
                    height: 0.88rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    .tips{
                        font-size: .24rem;
                        color: @info-color;
                    }
                    .icon{
                        flex: none;
                        fill: @info-color;
                        position: absolute;
                        top: 50%;
                        right: 0;
                        transform: translateY(-50%);
                    }
                    .left {
                        flex: none;
                    }
                    .rightText {
                        color: @warning-color;
                        text-align: right;
                        margin-right: .36rem;
                        flex: auto;
                        &.uncheck{
                            padding-right: 0.63rem;
                            background: url(~assets/img/compment/unCheck.png) no-repeat right;
                            background-size: 0.48rem 0.48rem;
                        }
                        &.active{
                            padding-right: 0.63rem;
                            background: url(~assets/img/compment/check.png) no-repeat right;
                            background-size: 0.48rem 0.48rem;
                        }
                        &.unable{
                            padding-right: 0.63rem;
                            background: url(~assets/img/compment/uncheck_disable.png) no-repeat right;
                            background-size: 0.48rem 0.48rem;
                        }
                    }
                }
            }
        }
    }   


</style>
