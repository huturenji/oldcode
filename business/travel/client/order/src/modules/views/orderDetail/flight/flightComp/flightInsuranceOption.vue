<template>
    <div>
        <div class="insurancePop">
            <div class="insuranceName">机票退票后保险如何处理</div>
            <div class="insuranceTit"></div>
            <div class="insuranceText">
                1、保险和机票一起购买，并在我司申请的机票自愿改签（改期），若此时保险并未生效，为保证保险能够顺利退保重出，您需先支付改签航班保险费用，待改签成功后，原航班保险费用将按原路退回至您的支付账户；若改签时保险已生效，则无法办理退保，您可根据需要再次购买新的保险。若机票改签仅为升舱，则保险可以正常使用，无需变更。
            </div>
            <div class="insuranceText">2、保险和机票一起购买，但您在航司或机场操作改签时，保险无法自动更改，请您联系客服协助处理。</div>
            <div class="insuranceText">3、如您单独购买的保险，请您联系出保方核实处理。</div>
            <div class="insuranceText">4、保险和机票一起购买，并在我司申请的机票自愿退票，如已购买保险服务并且还未生效，保险费用将自动退还。</div>
        </div>
        <div class="closeWrap">
            <div class="closeBut cursorp" @click="$emit('input',false)"></div>
        </div>
    </div>
</template>
<script>
// import { insuranceStatus } from 'orderCommon/enum/orderStatusEnum.js'
export default {
    components: {

    },
    props: {
        value: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
        }
    },
    mounted() {
        // let _this = this;
    },
    methods: {
    },
    watch: {
    }
}
</script>
<style scoped lang="less">
    @import '~~themes/default/styles/common/index.less';
    @import '~styles/mixins/mixinsStyle.less';

    .insurancePop {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0.92rem;
        padding: 0.3rem;
        font-size: 0.3rem;
        line-height: 0.52rem;
        color: @text-color;
        overflow-y: auto;
        background: #fff;

        .insuranceName {
            font-size: 0.34rem;
            font-weight: bold;
            text-align: center;
        }

        .insuranceBigTit {
            font-weight: bold;
            padding: 0.05rem 0;
        }

        .insuranceTit {}

        .insuranceText {
            padding-left: 0.3rem;
        }

        .redText {
            color: @danger-color-light;
        }

        .insuranceDetailWrap {
            padding: 0.15rem 0;
            margin-bottom: 0.15rem;
            border-bottom: 1px dashed @placeholder-color;

            .insuranceDetail {
                display: flex;

                .left {
                    width: 1.6rem;
                    color: @third-text-color ;
                }

                .right {
                    flex: 1;
                }
            }
        }
    }

    .closeWrap {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: #fff;
        padding: 0.15rem 0;
        box-shadow: 0px -0.04rem 0.1rem 0px rgba(6, 27, 70, 0.06);
        .closeBut {
            width: .62rem;
            height: .62rem;
            display: block;
            background: url(~assets/img/compment/icon_close_nor.png) no-repeat center;
            background-size: contain;
            margin: 0 auto;

            &:active {
                background: url(~assets/img/compment/icon_close_pre.png) no-repeat center;
                background-size: contain;
            }

        }
    }
</style>
