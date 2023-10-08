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

        <!-- loading -->
        <div v-transfer-dom>
            <Loading :show="quiting" :text='"取消中"'/>
        </div>         
    </div>
</template>
<script>
import {insuranceStatus } from 'flightCommon/enum/orderStatusEnum.js'
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
                return {insuranceChildOrder:{policyNo:''}}
            }
                
        }
    },
    data() {
        return {
            insuranceStatus: insuranceStatus//保单状态
        }
    },
    mounted() {
    },
    methods: {
        /**
             * 计算保险订单航班详情
             */
        getAirLineBriefInfo(item){
            let text = '';
            text = item.airCompanyName + item.flightNo+'</br>'+item.departTime+item.departCityName+'-'+item.arriveCityName;
            return text;
        }
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
                color: #999999;
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
    }
</style>