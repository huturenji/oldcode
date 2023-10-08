<template>
    <div class="abnormal-container" v-if="!!abnormalObj">
        <div class="content">
            <div class="tips" v-if="!!abnormalObj.tip">
                <Icon type='icon_common_warning' size='1.16'/>
                <div class='tip-text'>{{abnormalObj.tip}}</div>
                <div v-if='!!abnormalObj.primeTrip' class='travel-info'>
                    出差行程：{{abnormalObj.primeTrip.departCityName}}-{{abnormalObj.primeTrip.arriveCityName}}
                    {{new Date(abnormalObj.primeTrip.departTime).format('MM月dd日')}}-{{new Date(abnormalObj.primeTrip.arriveTime).format('MM月dd日')}}
                </div>
                <div class='payment'>
                    <div class='amount'>
                        <span class='unit rmb'>&yen;</span>{{amount}}
                        <Icon type='icon_plane_chaobiaocompany@2x' v-if='exceedStandard' class='exceedStandard'></Icon>
                    </div>
                </div>
            </div>
            <div class='travel-slot'>
                <slot></slot>
            </div>
            <div class="lineForm mt30">
                <span class="label">原因</span>
                <div class="form_input text">
                    <textarea rows='2' maxlength="20" ref='abnormalReason' id="abnormalReason" :placeholder="abnormalObj.placeholder"></textarea>
                </div>
            </div>
        </div>
        <div class='btn-group'>
            <div class="overTips">{{actiontext}}成功后将发送{{abnormalObj.tipsLabel}}至您的上级，是否继续？</div>
            <SnButton class="btn-submit normal-btn cursorp" type="primary" @click="pay">
                继续{{actiontext}}
            </SnButton>
        </div>
    </div>
</template>
<script>
import extendUtils from './extend.js';
const Bus = extendUtils.Bus;
const Icon = ()=>import('components/icon');
const SnButton = ()=>import('components/button');
export default {
    components: {Icon, SnButton},
    props: {
        abnormalObj: {
            type: Object,
            default: ()=>{ return {} }
        },
        actiontext: {
            type: String,
            default: '支付'
        },
        amount: {
            default: ''
        },
        exceedStandard: {//是否超标
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
        }
    },
    created: function () {
        let that = this;
        Bus.$on('checkTravelAbnormal', this.checkTravelAbnormal)
        document.body.onclick = event => {
            let abnormalReasonDom = that.$refs.abnormalReason;
            if (!!abnormalReasonDom){
                if (event.target != abnormalReasonDom){
                    abnormalReasonDom.blur();
                }
            }
        }
    },
    mounted() {
        if (this.abnormalObj.abnormalReason){
            document.getElementById('abnormalReason').value=this.abnormalObj.abnormalReason
        }
    },
    methods: {
        pay(){
            //防止没取到绑定的值（小概率bug）
            let abnormalReason = (document.getElementById('abnormalReason') || {}).value
            if (!abnormalReason) {
                extendUtils.showToast(this.abnormalObj.errorMsg)
                return;
            }
            if (abnormalReason.length > 20) {
                extendUtils.showToast('原因不能超过20个字');
                return;
            }
            this.abnormalObj.abnormalReason = abnormalReason;
            Bus.$emit('submitAbnormalForm', true);
        }
    }
}

</script>
<style scoped lang="less">
    @import '~styles/core/common.less';
    @import '~styles/mixins/hairLine.less';

    .abnormal-container {
        background: @background-color;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 100%;

        .button {
            display: block;
            color: #ffffff;
            font-size: .34rem;
            line-height: .9rem;
            margin: .3rem;
            border-radius: .1rem;
            background: @theme-color;
            text-align: center;
        }

        .content {
            text-align: left;

            .tips {
                .bbpx(1px, dashed, .3rem, .3rem, @disable-color);
                background: #fff;
                padding: 0.4rem 0;
                display: flex;
                align-items: center;
                flex-direction: column;

                .icon_common_warning{
                    fill: @warning-color-light;
                }

                .tip-text{
                    font-size: .3rem;
                    margin: .2rem 0;
                }

                .travel-info{
                    font-size: .28rem;
                    background-color: rgba(244, 153, 57, .1);
                    padding: 0 .24rem;
                    height: .4rem;
                    line-height: .4rem;
                    border-radius: .4rem;
                    color: @warning-color;
                }

                .payment{
                    margin-top: .4rem;
                    width: 100%;
                    text-align: center;
                    .amount{
                        color: @danger-color-light;
                        font-size: .56rem;
                        font-weight: bold;
                        .unit{
                            font-size: .36rem;
                        }
                        .exceedStandard{
                            width: .62rem;
                            height: .34rem;
                        }
                    }
                    .icon{
                        fill: @danger-color-light;
                    }
                }
            }

            .travel-slot{
                height: 2.72rem;
            }


            .mt30 {
                margin-top: 0.2rem;
                textarea{
                    height: 1.06rem;
                    line-height: .54rem;
                }
                textarea::-webkit-input-placeholder{
                    color: @placeholder-color;
                }
                textarea::-moz-placeholder{  
                    color: @placeholder-color;        
                }
                textarea:-ms-input-placeholder{ 
                    color: @placeholder-color;        
                }
            }

            .lineForm {
                display: flex;
                height: 1.48rem;
                padding: 0.3rem;
                background: #fff;

                .label {
                    display: inline-block;
                    font-size: 0.32rem;
                    color: @secondary-text-color;
                    margin-right: 1.22rem;
                }

                .text {
                    flex: 1;
                    font-size: 0.32rem;
                    color: @text-color;
                }
            }
        }
        .btn-group{
            padding: .3rem;
            width: 100%;
            margin-bottom: .6rem;

            .overTips {
                font-size: 0.26rem;
                color: @danger-color-light;
                margin: 0 0 0.3rem;
                text-align: center;
            }
        }
    }
</style>
