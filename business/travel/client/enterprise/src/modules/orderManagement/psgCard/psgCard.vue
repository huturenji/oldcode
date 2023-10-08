<template>
    <div class="psg-card-container">
        <div>
            <div class="title">
                请选择需要{{popState == 0 ? '改签' : '退票'}}的乘机人
                <span class="close cursorp" @click="$emit('onClose')"></span>
            </div>
            <div class="psg-list">
                <div v-for="(psg,index) in psgList" :for="`checkbox_${index}`" class="psgLable" :key="index"
                    :class="{disable: disablePsg(psg.status), selected: currentValue && currentValue.indexOf(psg.psgID)>-1}">
                    <div>
                        <div>
                            <div class="psg-name">{{psg | psgStatusFilter}}</div>
                            <div class="info-label">{{strCardType(psg.cardType)}}<span
                                    class="cardNo">{{psg.cardNo}}</span></div>
                        </div>
                        <!--<div v-if="orderType=='flight'">-->
                        <!--<div>{{psg.carbinType}}</div>-->
                        <!--<div>{{psg.carbinNo}}</div>-->
                        <!--</div>-->
                        <div v-if="orderType=='train'">
                            <div class="info-label">{{psg.seatType}}</div>
                        </div>
                    </div>
                    <div class="cursorp" @click="selectedItem($event, psg.psgID)">
                        <i :id="`checkbox_${index}_icon`" :psgId="psg.psgID" class="icon-check"
                            :class="{checked: currentValue && currentValue.indexOf(psg.psgID)>-1}"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="btn cursorp" @click="toEndorse">确定</div>
    </div>
</template>

<script>
import { getFlightPsgStatusObj, StateStyle } from 'orderCommon/enum/psgStatusEnum.js'
import { getCardTypeName } from 'orderCommon/enum/custInfoEnum.js';
import extendUtils from 'orderCommon/extend.js';
export default {
    name: 'psgCard',
    components: {},
    props: {
        popState: Number,
        orderType: String,
        airline: {},
        psgList: {
            type: Array,
            default: function() {
                return []
            }
        },
        defaultPsgId: '' // eslint-disable-line
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
            let psgName = value.psgName;
            let psgStatusObj = getFlightPsgStatusObj(value.status);
            if (psgStatusObj.state == StateStyle.SUCCESS || psgStatusObj.state == StateStyle.INPROCESS) {
                return psgName += "（" + psgStatusObj.name[2] + "）";
            } 
            return psgName;
                
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
                    let psg = that.psgList[extendUtils.findIndex(that.psgList, { 'PsgID': value })];
                    that.choosedPsgList.push(psg);
                });
            }
        }
    },
    methods: {
        /**
             * 选中默认的乘机人，即点击改签的那个乘机人
             */
        setDefaultPsgId(defaultPsgId) {
            if (defaultPsgId) {
                this.initList();
                let $icon = $("i.icon-check[psgId='" + defaultPsgId + "']");
                //程序健壮性判断：如果默认乘机人的状态不是disable的，才能默认选中
                if (!$icon.closest(".psgLable").hasClass("disable")) {
                    this.currentValue.push(defaultPsgId);
                    this.choosedPsgList.push(this.psgList[extendUtils.findIndex(this.psgList, { 'PsgID': defaultPsgId })])
                    $("i.icon-check[psgId='" + defaultPsgId + "']").addClass("checked");
                }
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
        disablePsg(status) {
            //正常、不能退票、不能改签、改签撤销、退票撤销这些状态是可以改签的，其他状态不能改签
            let statusObj = getFlightPsgStatusObj(status);
            let statusState = statusObj.state;
            let statusType = statusObj.type;
            //非改签航班的成功和进行时状态都不可选；改签航班只有进行时不可选，因为改签成功时的status是16（即成功状态）
            return (!this.airline.isGaiOrder && statusState == StateStyle.SUCCESS)
                    || statusState == StateStyle.INPROCESS || (statusType == 0 && statusState == StateStyle.SUCCESS);
        },
        /**
             * 初始化数据
             */
        initList() {
            const that = this;
            // let nodeList = $('.icon-check').removeClass("checked");
            that.currentValue = [];
        },
        /**
             * 选中乘机人时改变样式
             * @param event
             */
        selectedItem(event, id) {
            // const divNode = event.currentTarget;
            let index = this.currentValue.indexOf(id);
            index > -1 ? this.currentValue.splice(index, 1) : this.currentValue.push(id);
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
    @import '~themes/default/styles/common/index.less';
    @import '~styles/mixins/mixinsStyle.less';

    * {
        box-sizing: border-box;
    }

    .psg-card-container {
        max-height: 8.1rem;
        overflow-y: hidden;
        background: #ffffff;
        padding-bottom: 1.16rem;
        position: relative;

        .psg-list {
            max-height: 6rem;
            overflow-y: auto;
        }

        .psgLable {
            display: flex;
            border-bottom: 1px solid #e5e5e5;
            height: 1.2rem;
            margin-left: .62rem;
            font-size: .32rem;
            justify-content: space-between;

            &.selected {
                color: @theme-color;

                .info-label,
                .psg-name {
                    color: @theme-color;
                }
            }

            &.disable {
                .icon-check {
                    background: url(~assets/img/compment/uncheck_disable.png) center no-repeat;
                    background-size: contain;
                }

                .info-label,
                .psg-name {
                    color: #C2C2C2;
                }
            }

            .psg-name {
                margin: .15rem 0 .05rem;
                color: @text-color;
            }

            .info-label {
                font-size: .28rem;
                color: @third-text-color;

                .cardNo {
                    margin-left: .2rem;
                }
            }

            .icon-check {
                height: .6rem;
                width: .6rem;
                margin: .3rem .62rem .3rem .3rem;
                display: block;
                background: url(~assets/img/compment/unCheck.png) center no-repeat;
                background-size: contain;
            }

            .checked {
                background: url(~assets/img/compment/check.png) center no-repeat;
                background-size: contain;
            }
        }

        .title {
            font-size: .32rem;
            height: .92rem;
            line-height: .92rem;
            padding: 0 .3rem;
            color: @text-color;
            border-bottom: 1px solid #e5e5e5;

            .close {
                background: url(~assets/img/compment/icon_close_simple.png) center;
                background-size: contain;
                height: .6rem;
                width: .6rem;
                margin: .16rem 0;
                float: right;

                &:active {
                    background: url(~assets/img/compment/icon_close_simple_pre.png) center;
                    background-size: contain;
                }
            }
        }

        .btn {
            width: calc(~"100% - .6rem");
            height: .76rem;
            line-height: .76rem;
            font-size: .32rem;
            border-radius: .08rem;
            background: @theme-color;
            color: #fff;
            position: absolute;
            bottom: .2rem;
            left: .3rem;
            z-index: 505;

            &:active {
                background-color: @theme-color-active;
            }

        }
    }
</style>
