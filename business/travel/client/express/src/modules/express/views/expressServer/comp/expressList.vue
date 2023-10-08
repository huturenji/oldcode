<template>
    <div class="expressListPWrap">
        <div class="expressListWrap">
            <swipeout>
                <swipeout-item transition-mode="follow" :disabled="isPc">
                    <div class="lineWrap normal-btn" :class="{grayList:((expressOrder.expressStatusAndTime[0]||{}).status || '')=='CANCELLED',sign:((expressOrder.expressStatusAndTime[0]||{}).status || '')=='SIGNED'}" slot="content">
                        <div class="titWrap bbpxs">
                            <div class="titLeftGroup">
                                <span class="iconWrap" v-bind:style="{backgroundImage: 'url(' + (expressCompanyMap[expressOrder.expressCompanyInfo.expressCompanyCode || ''] || {}).src || '' + ')'}"></span>
                                <span class="itemLeft">{{expressOrder.expressCompanyInfo.expressCompanyName}}</span>
                                <span class="itemRight">运单号：{{expressOrder.outerExpressOrderNo || '---'}}</span>
                            </div>
                            <span class="pcDelete normal-btn" v-if="isPc" @click.stop="$emit('delete',expressOrder)">删除</span>
                        </div>
                        <div class="contectWrap" :class="{bbpxs:!(expressOrder.expressStatusAndTime[0]||{}).status || ''=='CANCELLED'}">
                            <div class="leftContect">
                                <div class="cityName">{{getCityByAddress(expressOrder.senderInfo.area)}}</div>
                                <div class="name">{{expressOrder.senderInfo.name}}</div>
                            </div>
                            <div class="middleContect">
                                <div class="typeName" v-if="showInvoice">发票报销凭证</div>
                                <div class="arrow"></div>
                                <div class="expresstype" :class="(orderTypeData[(expressOrder.expressStatusAndTime[0]||{}).status || ''] || {}).listClass || ''">{{(orderTypeData[(expressOrder.expressStatusAndTime[0]||{}).status || ''] || {}).text || ''}}</div>
                            </div>
                            <div class="rightContect">
                                <div class="cityName">{{getCityByAddress(expressOrder.receiverInfo.area)}}</div>
                                <div class="name">{{expressOrder.receiverInfo.name}}</div>
                            </div>
                        </div>
                        <div class="expressInfoWrap" v-if="((orderTypeData[(expressOrder.expressStatusAndTime[0]||{}).status || ''] || {}).expressListShow && expressOrder.expressDetails.length > 0) || false">
                            <div class="expressInfoTit" v-if="!expressListIsShow">
                                <div class="leftIconWrap" :class="(expressTypeData[(expressOrder.expressDetails[0]||{}).expressStatus || ''] || {}).typeClass || ''"></div>
                                <div class="text no-wrap">{{expressOrder.expressDetails[0].expressLocationDesc}}</div>
                                <div class="but" @click.stop="expressListIsShow = true"></div>
                            </div>
                            <div class="expressInfoList" v-else>
                                <div class="timeLineWrap">
                                    <div class="timeLine" :class="(expressTypeData[item.expressStatus] || {}).typeClass || ''" v-for="(item,index) in expressOrder.expressDetails" :key="index">
                                        <div class="timeLineTextWrap">
                                            <div class="timeLineText" v-html="getTimeLineText(item.expressLocationDesc)"></div>
                                            <div class="timeLineTips">{{item.expressLocationTime}}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="rightButWrap" @click.stop="expressListIsShow = false"></div>
                            </div>
                        </div>
                    </div>
                    <div slot="right-menu">
                        <swipeout-button @click.native.stop="$emit('delete',expressOrder)" type="warn" >删除</swipeout-button>
                    </div>
                </swipeout-item>
            </swipeout>
        </div>
    </div>

</template>
<script>
import { Swipeout, SwipeoutItem, SwipeoutButton } from "vux";
import {orderTypeMap,expressCompanyData,expressTypeMap} from '../enum/expressEnum.js';
export default {
    components: {
        Swipeout,
        SwipeoutItem,
        SwipeoutButton
    },
    props:{
        expressOrder: {//快递列表数据
            type: Object,
            default:{}
        },	
        showInvoice:{
            type: Boolean,
            default:false
        },
        isPc:{
            type: Boolean,
            default:false
        },
    },
    data() {
        return {
            expressListIsShow:false,//物流详情list是否显示
            orderTypeData:orderTypeMap,//订单类型配置数据
            expressTypeData:expressTypeMap,//物流状态配置信息Map
            expressCompanyMap:expressCompanyData,//快递公司配置
            expressCompanyNo:this.expressOrder.expressCompanyInfo.expressCompanyNo || '',//快递公司ID
            expressCompanyCode:this.expressOrder.expressCompanyInfo.expressCompanyCode || '',//快递公司Code
        };
    },
    methods: {
        /**
         * 格式化快递时间线文本
         */
        getTimeLineText(str){
            let operateMessage = str;
            let phone = '';
            let html = str;
            let reg=/(1[3456789]\d{9})|(\d{10})|(0\d{2,3}-\d{7,8})|(\d{3}-\d{3}-\d{4})/g;
            let telList=operateMessage.match(reg) || [];
            if(telList.length > 0){
                phone = telList[0];
                let msgList = operateMessage.split(phone);
                html =  msgList[0]+'<span class="phone">'+phone+'</span>'+(msgList[1] || '');
            }
            return html;
        },
        /**
         * 格式化快递时间线文本
         */
        getCityByAddress(address){
            let list = address.split('/');
            return list.length == 2?list[0]:list[1];
        }
    }
};
</script>
<style scoped lang="less">
@import '~themes/default/styles/expressServer/comp/expressList.less';
</style>
