<template>
    <div class="psg-card-container">
        <div>
            <div class="title">
                请选择需要{{popState == 0 ? '改签' : '退票'}}的乘机人
                <Icon type="icon_common_close" class="close icon-btn cursorp" size='.4' @click.native="close"/>
            </div>
            <div class="psg-list">
                <div v-for="(psg,index) in psgList" :for="`checkbox_${index}`" class="psgLable"
                    :class="{disable: disablePsg(psg.status,psg), selected: currentValue && currentValue.indexOf(psg.psgId)>-1}" :key="index">
                    <div>
                        <div>
                            <div class="psg-name">
                                {{psg.psgName}} 
                                <span class='statu' :style="{color: getPsgStatusColor(psg.status)}">{{psg | psgStatusFilter}}</span>
                            </div>
                            <div class="info-label">{{strCardType(psg.cardType)}}<span
                                    class="cardNo">{{psg.cardNo | formateID}}</span></div>
                        </div>
                        <!--<div v-if="orderType=='flight'">-->
                        <!--<div>{{psg.carbinType}}</div>-->
                        <!--<div>{{psg.carbinNo}}</div>-->
                        <!--</div>-->
                        <div v-if="orderType=='train'">
                            <div class="info-label">{{psg.seatType}}</div>
                        </div>
                    </div>
                    <div class="cursorp" @click="selectedItem($event, psg.psgId,psg)">
                        <Icon :id="`checkbox_${index}_icon`" :psgId="psg.psgId" class="icon-check" size='.44'
                            :class="{checked: currentValue && currentValue.indexOf(psg.psgId)>-1}"
                            :type="currentValue && currentValue.indexOf(psg.psgId)>-1 ? 'checkbox' : 'checkbox-empty'"/>
                    </div>
                </div>
            </div>
        </div>
        <div class='btn-group'>
            <div class="btn cancel-btn cursorp" @click="close">取消</div>
            <div class="btn normal-btn cursorp" @click="toEndorse">确定</div>
        </div>
    </div>
</template>

<script>
import { getFlightPsgStatusColor, getFlightPsgStatusObj, StateStyle } from 'orderCommon/enum/psgStatusEnum.js'
import { getCardTypeName } from 'orderCommon/enum/custInfoEnum.js';
// import scrollLockMixin from 'orderCommon/scrollLockMixin'
import extendUtils from 'orderCommon/extend.js';
const Icon = ()=>import('components/icon');
// const SnButton = ()=>import('components/button');
const ISDECORATE = extendUtils.ISDECORATE;
const MASKING_TYPE = SnUtils.DataMasking.MASKING_TYPE;
const maskingText = SnUtils.DataMasking.maskingText;
export default {
    name: 'psgCard',
    components: {
        Icon
        // SnButton
    },
    props: {
        popState: {
            type:Number,
            default:0
        },
        orderType: {
            type:String,
            default:""
        },
        airline: {},
        psgList: {
            type: Array,
            default(){
                return []
            }
        },
        defaultPsgId: {
            type:String,
            default:""
        }
    },
    data() {
        return {
            currentValue: [],
            checkboxValue: [],
            currentOptions: this.options,
            choosedPsgList: []
        }
    },
    created() {

    },
    mounted() {
    },
    filters: {
        /**
             * 改签中或改签成功的名字后面要加上状态文字
             */
        psgStatusFilter: function (value) {
            let psgStatusObj = getFlightPsgStatusObj(value.status);
            if (psgStatusObj.state == StateStyle.SUCCESS || psgStatusObj.state == StateStyle.INPROCESS) {
                return "[" + psgStatusObj.name[2] + "]";
            } 
            return '';
                
        },
        //身份证号脱敏
        formateID(value){
            try {
                value = ISDECORATE?maskingText(MASKING_TYPE.TEL,value):value;
            } catch (error) {
                
            }
            return value;
        }
    },
    watch: {
        /**
             * 选中乘机人时，存储选中的乘机人
             * @param val
             */
        currentValue(val) {
            const that = this;
            that.choosedPsgList = [];
            if (val.length > 0) {
                val.forEach((value) => {
                    let psg = that.psgList[extendUtils.findIndex(that.psgList, { 'psgId': value })];
                    that.choosedPsgList.push(psg);
                });
            }
        }
    },
    methods: {
        getPsgStatusColor(status){
            return getFlightPsgStatusColor(status, 2);
        },
        close(){
            this.$emit('onClose');
        },
        /**
             * 选中默认的乘机人，即点击改签的那个乘机人
             */
        setDefaultPsgId(defaultPsgId) {
            if (defaultPsgId) {
                this.initList();
                // let iconDom;
                Array.prototype.forEach.call(document.getElementsByClassName('psgLable'),dom=>{
                    if (!dom.classList.contains('disable')){
                        let icomDom = dom.getElementsByClassName('icon-check')
                        icomDom = icomDom && icomDom.length>0 ? icomDom[0] : null
                        if (icomDom && icomDom.getAttribute('psgId')==defaultPsgId){
                            this.currentValue.push(defaultPsgId);
                            this.choosedPsgList.push(this.psgList[extendUtils.findIndex(this.psgList, { 'psgId': defaultPsgId })])
                            icomDom.classList.add("checked");
                        }
                    }
                })
            }
        },
        /**
             * 跳转到确认改签信息页面
             */
        toEndorse() {
            if (!this.choosedPsgList || this.choosedPsgList.length == 0) {
                extendUtils.showToast("请选择乘机人");
                return;
            }
            this.$emit('onConfirm', this.choosedPsgList);
        },
        /**
             * 判断乘机人是否不可选择
             * @param status 乘机人状态
             * @returns {boolean}
             */
        disablePsg(status,psg) {
            //正常、不能退票、不能改签、改签撤销、退票撤销这些状态是可以改签的，其他状态不能改签
            let statusObj = getFlightPsgStatusObj(status);
            let statusState = statusObj.state;
            let statusType = statusObj.type;
            //非改签航班的成功和进行时状态都不可选；改签航班只有进行时不可选，因为改签成功时的status是16（即成功状态）
            // return (!this.airline.isGaiOrder && statusState == StateStyle.SUCCESS)
            //         || statusState == StateStyle.INPROCESS || (statusType == 0 && statusState == StateStyle.SUCCESS);
            return (this.popState == 0 && statusType == 1 && statusState == StateStyle.SUCCESS) || statusState == StateStyle.INPROCESS || 
            (statusType == 0 && statusState == StateStyle.SUCCESS) || (this.popState == 1 && psg.tuiOrderList.length>0 && statusState == StateStyle.SUCCESS);
        },
        /**
             * 初始化数据
             */
        initList() {
            const that = this;
            Array.prototype.forEach.call(document.getElementsByClassName('icon-check'),dom=>{
                dom.classList.remove("checked");
            })
            that.currentValue = [];
        },
        /**
             * 选中乘机人时改变样式
             * @param event
             */
        selectedItem(event, id,psg) {
            // const divNode = event.currentTarget;
            if (!this.disablePsg(psg.status,psg)){
                let index = this.currentValue.indexOf(id);
                index > -1 ? this.currentValue.splice(index, 1) : this.currentValue.push(id);
            }
        },
        // hiddenNo(No) {
        //   const that = this;
        //   let str = '';
        //   str = No.substr(0, 2) + '*************' + No.substr(16)
        //   return str
        // },
        /**
             * 证件名称的枚举
             * @param type
             * @returns {string}
             */
        strCardType(type) {
            return getCardTypeName(type);
        }
    }
}
</script>
<style scoped lang="less">
    @import '~themes/default/styles/orderDetail/flight/psgCard.less';
</style>
