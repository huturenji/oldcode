<template>
    <div class="qrCode-container" v-show='showQrCode'>
        <payMask v-model="showQrCode"></payMask>
        <!--二维码-->
        <div class="qrCode" :style='{zIndex: zIndex(1)}'>
            <template v-if="showQrCode">
                <div class="qrCode-title" order="1">{{currPayType.name}}
                    <div class="qrCode-close-btn cursorp" @click="closeQrCode"></div>
                </div>
                <div class="qrCode-content" order="1">支付金额：<span class="qrCode-amount">￥{{amount}}</span></div>
                <div class="qrCode-limit-time" order="1" v-if="!!limitTime">
                    <span class="icon-time"></span>
                    {{limitTime | limitTimeFormat}}
                </div>
                <div class="qrCode-scan" order="3"><span class="icon-scan"></span>
                    打开支付宝扫一扫
                </div>
            </template>
            <div class="alipayLoading" order="2">正在加载支付宝二维码...</div>
            <div class="alipayFrameContainer" order="2" ></div>
        </div>
    </div>
</template>

<script>
    import payMask from '../components/mask';
    import store from '../store';
    import {qrCodePara} from '../constant';
    import mixin from './mixin';
    import $ from 'jquery';

    export default {
        mixins: [mixin],
        components: {payMask},
        data() {
            return {
                autoCloseQrCode: false,
                showQrCode: false,
            };
        },
        created: function () {
            this.payTypeCase = this.payType.ALI_PAY;
            //激活时立即创建预付单
            this.notifyCreatePay();
        },
        mounted() {
        },
        activated(){
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
        filters: {
        },
        methods: {
            afterCreateOrder(data){
                this.lockPage(false);
                if(this.snutils.isPC()){
                    this.useQRCode(true);
                    this.operationWaiting();
                    this.pagePay(data.content);
                }else{
                    this.appPay(data.content)
                }
            },

            /**
             * 二维码支付
             */
            pagePay(thirdPayResult){
                //去掉支付宝返回的自动执行js脚本，改为本系统自己控制提交时机
                let scriptIndex = thirdPayResult.indexOf('<script>');
                let aipayHtml = scriptIndex == -1 ? thirdPayResult : thirdPayResult.substring(0, scriptIndex);
                let $form = $(aipayHtml);
                //拿到form里面的action，并截取charset的值
                //保持与支付宝默认编码格式一致，如果不一致将会出现：调试错误，请回到请求来源地，重新发起请求，错误代码 invalid-signature 错误原因: 验签出错，建议检查签名字符串或签名私钥与应用公钥是否匹配
                let action = $form.attr("action");
                let charsetIndex = action.indexOf('charset=');
                let symbolIndex = action.indexOf("&", charsetIndex);
                let charset = action.substring(charsetIndex + 8, symbolIndex > -1 ? symbolIndex : action.length); //8是'charset='的长度
                $form.attr('acceptCharset', charset).attr('target', '_self');

                let alipayLoadingDom = document.querySelector('.alipayLoading')
                alipayLoadingDom.style.display = 'block';
                //1. 这里必须每次都生成一个新的iframe，否则第二次弹出时会因为支付宝的网页跨域问题无法跳转
                //原因详解：第二次操作iframe时，iframe里面的域已经是支付宝的了，因此下面的js无法再获取到iframe的document
                //2. 新生成的dom元素无法和vue绑定，vue的@load事件绑定不上去，所以只能用原生的方式绑定事件和回调函数;
                //3. 获取不到contentDocument的时候说明已经不是一个域了，此时已经是支付宝的页面了。IE下获取contentDocument会抛异常，chrome会得到null，所以兼容写法
                let script =
                    "try{if(!this.contentDocument) throw Error()}catch(e){document.querySelector('.alipayLoading').style.display='none'}";
                $(".alipayFrameContainer").html('<iframe class="alipayFrame" name="alipayFrame" sandbox="allow-forms allow-same-origin allow-scripts"></iframe>');
                let $frameBody = $(window.frames['alipayFrame'].document.body)
                $frameBody.html($form);
                // //提交表单，并显示支付宝的iframe
                $('form', $frameBody).submit();
                $('.alipayFrame').css({
                    'width': qrCodePara.size+10, //防止iframe滚动条
                    'height': qrCodePara.size+10,
                    'border': 'none',
                    'margin': 'auto',
                })
                this.showQrCode = true;
            },

            /**
             * APP支付
             */
            async appPay(thirdPayResult){
                //todo 海峡临时方案
                let channelId = await sinosdk.sino.getChannelId();
                if(['5248005','3150853','2102277','5125'].some(id=>id==channelId)){
                    this.operationWaiting()
                    this.toThreePayDo(this.currPayType.appFuncName, thirdPayResult)
                    return;
                }
                //todo end
                this.toThreePayDo(this.currPayType.appFuncName, thirdPayResult).then(()=>{
                    this.operationWaiting()
                })
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
    .alipayFrameContainer {
        z-index: 2;
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
            order: 2
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

        .alipayLoading {
            display: none;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1;
            width: 100%;
        }
    }
</style>
