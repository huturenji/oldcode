<template>
    <!--二维码-->
    <div class="qrCode-container" v-show='showQrCode'>
        <payMask v-model="showQrCode"></payMask>
        <div class="qrCode" :style='{zIndex: zIndex(1)}'>
            <template v-if="showQrCode">
                <div class="qrCode-title" order="1">{{currPayType.name}}
                    <div class="qrCode-close-btn cursorp"
                         @click="closeQrCode"></div>
                </div>
                <div class="qrCode-content" order="1">支付金额：<span class="qrCode-amount">￥{{amount}}</span></div>
                <div class="qrCode-limit-time" order="1" v-if="!!limitTime">
                    <span class="icon-time"></span>
                    {{limitTime | limitTimeFormat}}
                </div>
                <qrcode-vue order="2"
                            v-if="!!qrCodePara.value"
                            :value="qrCodePara.value" :size="qrCodePara.size"
                            :level="qrCodePara.level"></qrcode-vue>
                <div class="qrCode-scan" order="3"><span class="icon-scan"></span>
                    打开微信扫一扫
                </div>
            </template>
        </div>
    </div>
</template>

<script>
    import payMask from '../components/mask';
    import store from '../store'
    import {qrCodePara} from '../constant'
    import mixin from './mixin';
    import QrcodeVue from 'qrcode.vue';
    import h5PayUtil from '../h5Pay'

    export default {
        mixins: [mixin],
        components: {
            QrcodeVue, payMask
        },
        data() {
            return {
                qrCodePara: qrCodePara,
                showQrCode: false,
            };
        },
        watch: {
            limitTime(newValue, oldValue) {
                if (this.limitStop(newValue)) {
                    //二维码支付超时处理:关闭二维码，并触发关闭回调
                    if (this.showQrCode) {
                        this.showQrCode = false;
                    }
                }
            },
        },
        created: function () {
            this.payTypeCase = this.payType.WECHAT;
            //激活时立即创建预付单
            this.notifyCreatePay();
        },
        mounted() {
        },
        activated(){
        },
        methods: {
            afterCreateOrder(data){
                this.lockPage(false);
                if(this.snutils.isPC()){
                    this.useQRCode(true);
                    this.operationWaiting();
                    this.pagePay(data.content);
                }else{
                    this.beforeH5Pay(true);
                    if(this.h5Pay(data.content)){
                        this.h5PayOperaEnd()
                    }
                }
            },

            /**
             * 二维码支付
             */
            pagePay(thirdPayResult){
                this.qrCodePara.value = thirdPayResult;
                this.showQrCode = true;
            },

            /**
             * APP支付
             */
            h5Pay(thirdPayResult){
                return h5PayUtil.urlRedirect(thirdPayResult)
            },

            closeQrCode(){
                this.showQrCode = false;
                this.payUnknown();
            }
        },
    }

</script>
<style lang="less">
    .qrCode-container{
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        height: 100%;
        width: 100%;
    }
    .qrCode {
        width: 400px;
        height: 400px;
        position: fixed;
        left: 50%;
        top: 50%;
        margin-left: -200px;
        margin-top: -200px;
        background: #fff;
        text-align: center;
        border-radius: 4px;
        flex-direction: column;
        display: flex;
        justify-content: space-between;

        [order='1'] {
            order: 1
        }

        [order='2'] {
            order: 2;
            display: flex;
            justify-content: center;
        }

        [order='3'] {
            order: 3
        }

        .qrCode-title {
            height: 40px;
            line-height: 40px;
            font-size: 16px;
            color: #1b1b1b;
            border-bottom: 1px solid #C2C2C2;
            position: relative;

            .qrCode-close-btn {
                position: absolute;
                right: 10px;
                top: 10px;
                height: 20px;
                width: 20px;
                cursor: pointer;
                background: url(~assets/icon_close_nor.png) no-repeat center center transparent;
                background-size: 20px;

                &:active {
                    background: url(~assets/icon_close_pre.png) no-repeat center;
                    background-size: contain;
                }
            }
        }

        .qrCode-content {
            margin: 30px 0 22px;
            padding-left: 138px;
            color: #7f7f7f;
            font-size: 14px;
            text-align: left;

            .qrCode-amount {
                font-size: 28px;
                color: #f83939;
            }
        }

        .qrCode-limit-time {
            font-size: 14px;
            color: #191919;
            margin-bottom: 13px;

            .icon-time {
                display: inline-block;
                height: 15px;
                width: 15px;
                background: url(~assets/icon_time.png) no-repeat left center transparent;
                background-size: contain;
                vertical-align: middle;
                margin-right: 8px;
            }
        }

        .qrCode-scan {
            font-size: 14px;
            color: #1b1b1b;
            margin: 20px 8px 20px;

            .icon-scan {
                display: inline-block;
                height: 15px;
                width: 15px;
                background: url(~assets/icon_scan.png) no-repeat left center transparent;
                background-size: contain;
                vertical-align: middle;
                margin-right: 8px;
            }
        }
    }
</style>
