<template>
    <div class="pay-container">
        <div v-transfer-dom>
            <popup v-model="showAbnormalPrompt" @on-cancel="showAbnormalPrompt=false" height="100%" width="100%" position="right" :popup-style="{zIndex: 955}">
                <component ref="travelAbnormalComponent" :is="travelAbnormalComponent" 
                    :abnormalObj="payExceptionHandler.abnormalPrompt" :actiontext="actiontext" :amount='amount' :exceedStandard="exceedStandard(payExceptionHandler.abnormalPrompt)">
                    <slot name="abnormalProductInfo"/>
                </component>
            </popup>
        </div>
        <div v-transfer-dom>
            <popup v-model="showNoApply" class='show-no-apply' @on-cancel="showNoApply=false" height="100%" width="100%" position="right" :popup-style="{zIndex: 955}">
                <component ref="noApplyComponent" :is="noApplyComponent" :tips="'抱歉，未发现有效出差申请'" :havePersonalPay='false'></component>
            </popup>
        </div>
        <div v-transfer-dom>
            <loading :show="popLoading" :text="popLoadingStatu.text && popLoadingStatu.text()"></loading>
        </div>
    </div>
</template>

<script>
import extendUtils from './extend.js';
import payExceptionHandler from './payExceptionHandler.js'
import {
    TransferDom,
    Popup,
    Loading
} from 'vux';
const Bus = extendUtils.Bus;
    
const originalTitle = document.title;

export default {
    name:'swp-travelAbnormal',
    directives: {
        TransferDom
    },
    components: {
        TransferDom,
        Popup,
        Loading
    },
    props: {
        amount: {
            default: ''
        },
        orderNo: {//绑定v-model，用于打开/关闭支付方式列表
            type: String,
            default: null
        },
        verifyTravel: {//开始验证是否行程超标或异常。绑定v-model
            type: Boolean,
            default: false
        },
        useType: {
            type: String,
            default: extendUtils.USE_TYPE_ENUM.PRIVATE.name
        },
        beforeOrderParam:{//非支付类差标校验传参
            type:Object,
            default:()=>{ return {} }
        },
        actiontext: {
            type: String,
            default: '支付'
        }
    },
    model: {//绑定v-model
        prop: 'verifyTravel',
        event: 'checkTravelAbnormal'
    },
    data() {
        let managerData = extendUtils.stateManager.setData([
            {//超标、行程异常
                name: 'showAbnormalPrompt',
                type: 'page',
                parent: '$refs.travelAbnormal',
                show: {
                    callback: function () {
                        document.body.classList.add('body-noscroll');
                    }
                },
                hide: {
                    title: originalTitle,
                    callback: function () {
                        document.body.classList.remove('body-noscroll');
                    }
                }
            },
            {//无申请单
                name: 'showNoApply',
                type: 'page',
                parent: '$refs.travelAbnormal',
                show: {
                    callback: function () {
                        document.body.classList.add('body-noscroll');
                    }
                },
                hide: {
                    title: originalTitle,
                    callback: function () {
                        document.body.classList.remove('body-noscroll');
                    }
                }
            }
        ])
        return Object.assign(managerData, {
            travelAbnormalComponent: null,//行程异常&超标异常的动态异步组件
            noApplyComponent: null,//无申请单的动态异步组件
            payExceptionHandler: {},//支付异常处理对象
            popLoading: false,
            popLoadingStatu: {}
        })
    },
    created: function () {
        Bus.$on('payAbnormal', this.payAbnormal);//弹出异常组件
        Bus.$on('submitAbnormalForm', this.submitAbnormalForm)//提交异常原因表单
        Bus.$on('lockPage', this.lockPage);//锁住页面
        Bus.$on('unlockPage', this.unlockPage);//解锁页面
    },
    mounted() {
    },
    beforeDestroy(){
        //移除所有EventBus，否则在同一个html中，当组件再次加载时，会被重复注册
        Bus.$off();
    },
    methods: {
        /**
             * 校验差旅异常
             */
        async checkTravelAbnormal(param){
            // if(this.useType == 'PRIVATE'){
            //     return null;
            // }
            let data = await payExceptionHandler.checkOrderAbnormal(param);
            this.$emit('checkFinished', data);
            return data;
        },
        /**
             * 提交异常原因表单
             */
        submitAbnormalForm(verified){
            this.showAbnormalPrompt = false;
            let obj = {orderNo: this.orderNo};
            if ('beforeOrder'==this.orderNo){
                obj = this.beforeOrderParam;
            }
            this.payExceptionHandler.checkOrderAbnormal(obj, verified);
        },
        /**
             * 行程异常、超标、无审批单等异常
             */
        payAbnormal(type){
            this.payExceptionHandler = payExceptionHandler;
            switch (type) {
            case 'showAbnormalPrompt':
                this.renderTravelAbnormal();
                break;
            case 'showNoApply':
                this.renderNoApply();
                break;
            default:
                break;
            }

            this[type] = true;//打开对应的窗口
            this.payExceptionHandler.abnormalPrompt.title && (document.title = this.payExceptionHandler.abnormalPrompt.title);
        },

        /**
             * 行程、差标异常
             * @param type
             */
        renderTravelAbnormal() {
            this.travelAbnormalComponent = () => ({
                component: import('./travelAbnormal.vue'),
                delay: 0,
                timeout: 10000
            });
        },

        /**
             * 无申请单
             * @param type
             */
        renderNoApply() {
            this.noApplyComponent = () => ({
                component: import('./gotoApplyTravel'),
                delay: 0,
                timeout: 10000
            });
        },

        /**
             * 是否超标
             * @param abnormalObj
             * @return {*|boolean|*}
             */
        exceedStandard(abnormalObj){
            return payExceptionHandler.exceedStandard(abnormalObj);
        },

        /**
             * 锁住页面
             */
        lockPage(statu){
            this.popLoading = true;
            this.popLoadingStatu = statu;
        },

        /**
             * 解锁页面
             */
        unlockPage(){
            this.popLoading = false;
        }
    }
}

</script>
<style scoped lang='less'>
@import '~styles/core/common.less';
.show-no-apply{
    background: @background-color;
}
</style>