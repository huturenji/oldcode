<template>
    <div class="insurancePopWrap">
        <div class="insurancePop">
            <div class='insurance-title'>
                <Icon type='icon_plane_bao' class='icon' size='.32'/>{{(insuranceDetail.insuranceProduct||{}).productShortName}}
            </div>
            <div class="insuranceDetailWrap" v-if="haveOrderInfo">
                <template v-if="!!insuranceDetail.insuranceChildOrder">
                    <div class="insuranceDetail" v-if="!!insuranceDetail.insuranceChildOrder && !!insuranceDetail.insuranceChildOrder.policyNo && insuranceDetail.insuranceChildOrder.policyNo!=''">
                        <div class="left">保单编号</div>
                        <div class="right">{{insuranceDetail.insuranceChildOrder.policyNo}}</div>
                    </div>
                    <div class="insuranceDetail">
                        <div class="left">保单状态</div>
                        <div class="right" :style="{color: insuranceStatus[insuranceDetail.insuranceChildOrder.status].color}">{{insuranceStatus[insuranceDetail.insuranceChildOrder.status].text}}</div>
                    </div>
                    <div class="insuranceDetail">
                        <div class="left">被保险人</div>
                        <div class="right">{{insuranceDetail.insuranceChildOrder.name}}</div>
                    </div>
                    <div class="insuranceDetail">
                        <div class="left">航程信息</div>
                        <div class="right">
                            <div class="logoTextWrap">
                            <airlogo class='logo' :airCode="insuranceDetail.airLineBriefInfo.airLineCode"/>
                            {{insuranceDetail.airLineBriefInfo.airCompanyName + insuranceDetail.airLineBriefInfo.flightNo}}
                            </div>
                            <div>{{formatTime(insuranceDetail.airLineBriefInfo.departTime)+insuranceDetail.airLineBriefInfo.departCityName+'-'+insuranceDetail.airLineBriefInfo.arriveCityName}}</div>
                        </div>
                    </div>
                </template>
            </div>
            <div class="insurance-title">
                <Icon type='icon_common_prompt' class='icon' size='.32'/>保险详情
            </div>
            <div class="insuranceTit">1. 保险费用</div>
            <div class="insuranceText">{{(insuranceDetail.insuranceProduct || insuranceDetail).farePrice}}元/份</div>
            <div class="insuranceTit">2. 保险详情</div>
            <div class="insuranceText" v-html="(insuranceDetail.insuranceProduct || insuranceDetail).detailDescription"></div>
        </div>
        <!-- 屏蔽手动退保功能机票改签退票会自动退保 -->
        <div class="searchBottomButtonWrap" v-if="false && selfOrder && (insuranceStatus[(insuranceDetail.insuranceChildOrder||{}).status || '']||{}).canCancel || false">
            <div class="searchButton cursorp" @click="quitInsOrder">退保</div>
        </div>
        <!-- loading -->
        <div v-transfer-dom>
            <Loading :show="quiting" :text='"取消中"'/>
        </div>         
    </div>
</template>
<script>
import {insuranceStatus} from 'orderCommon/enum/orderStatusEnum.js'
import requestHandler from 'orderCommon/requestHandler.js';
import extendUtils from 'orderCommon/extend.js';
import {TransferDom,Loading} from 'vux';
import airlogo from 'components/airlogo/airlogo.vue';
const Icon = ()=>import('components/icon');
export default {
    directives: {
        TransferDom
    },
    components: {
        Loading,
        airlogo,
        Icon
    },
    props:{
        value:{
            type:Boolean,
            default:false
        },
        haveOrderInfo:{
            type:Boolean,
            default:false
        },
        insuranceDetail:{
            type:Object,
            default(){
                return {InsuranceChildOrder:{policyNo:''}}
            }
        },
        orderNo:{
            type:String,
            default:''
        }
    },
    data() {
        return {
            insuranceStatus: insuranceStatus,//保单状态
            quiting:false,//退保中
            selfOrder:true//true自己定
        }
    },
    mounted() {
        let _this = this;
        if (_this.$route.query.selfOrder=='false'){
            _this.selfOrder = false;
        } else if (!_this.$route.query.selfOrder){
            _this.selfOrder = false;
        }
    },
    methods: {
        /**
             * 计算保险订单航班详情
             */
        getAirLineBriefInfo(item){
            let _this = this;
            let text = '';
            text = _this.formatTime(item.departTime)+item.departCityName+'-'+item.arriveCityName+'</br>'+item.airCompanyName + item.flightNo;
            return text;
        },
        /**
            * 确定退保
            */
        quitInsOrder(){
            let _this = this;
            if (_this.quiting){
                return;
            }
            extendUtils.showConfirm('确定要退保？', ()=>{
                let obj = {
                    quitInsOrders:[{orderNo:this.orderNo,refundInsuredIds:[this.insuranceDetail.insuranceChildOrder.insuredId]}]
                }
                _this.quiting = true;
                requestHandler.quitInsOrders(obj).then(function (res) {
                    _this.quiting = false;
                    if (res.resultCode == 0){
                        let status = res.result.insuredInfos[_this.orderNo][0].status;
                        _this.insuranceDetail.insuranceChildOrder.status = status;
                        _this.$emit('quitInsOrder',status);
                        extendUtils.showToast('退保成功');
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
            * 格式化时间
            */
        formatTime(time){
            return new Date(time.replace(/-/g,'/')).format('MM月dd日');
        }
    },
    watch:{
    }
}
</script>
<style scoped lang="less">
    @import '~themes/default/styles/common/index.less';
    @import '~styles/mixins/mixinsStyle.less';
    .insurancePopWrap{
        .insurancePop{    
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            padding: 0.3rem;
            font-size: 0.28rem;
            line-height: 0.52rem;
            overflow-y: auto;
            background: #fff;
            .insurance-title{
                font-size: 0.3rem;
                font-weight: bold;
                text-align: left;
                color: @info-color;
                display: flex;
                align-items: center;
                .icon_plane_bao{
                    fill: @success-color;
                    margin-right: .1rem;
                }
                .icon_common_prompt{
                    fill: @info-color;
                    margin-right: .1rem;
                }
            }
            .insuranceBigTit{
                font-weight: bold;
                padding:0.05rem 0;
            }
            .insuranceText{
                padding-left: 0.3rem;
                white-space: pre-wrap;
            }
            .redText{
                color: @danger-color-light;  
            }
            .insuranceTit{
                color: @info-color;
                margin-top: .3rem;
            }
            .insuranceDetailWrap{
                .bbpx(1px, @border-color-base, 0, 0, dashed);
                padding-bottom: 0.2rem;
                margin-bottom:0.3rem;
                .insuranceDetail{
                    display: flex;
                    margin: .2rem 0;
                    .left{
                        width: 1.6rem;
                        color: @third-text-color ;
                    }
                    .right{
                        flex:1;
                        .logoTextWrap{
                            .flex-box();
                            .align-items(center);
                            .logo{
                                margin-right: 0.07rem;
                            }
                        }
                    }
                }
            }
        }
        .closeWrap{
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: #fff;
            padding:0.15rem 0;
            box-shadow: 0px -0.04rem 0.1rem 0px rgba(6, 27, 70, 0.06);
            .closeBut{
                width: .62rem;
                height: .62rem;
                display: block;
                background: url(~assets/img/compment/icon_close_nor.png) no-repeat center;
                background-size: contain;
                margin: 0 auto;
                &:active{
                    background: url(~assets/img/compment/icon_close_pre.png) no-repeat center;
                    background-size: contain;
                }

            }
        }  
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
                    background: @secondary-text-color;
                    border: 1px solid @secondary-text-color;
                }
            } 
            .littleButton{
                margin-right: 0.32rem;
                border: 1px solid @theme-color;
                background: #fff;
                color: @theme-color ;
            }           
        }
    }
</style>

