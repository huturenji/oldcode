<template>
    <div class="expressListPWrap">
        <div class="expressListWrap">
            <swipeout>
                <swipeout-item transition-mode="follow" :disabled="isPc">
                    <div class="lineWrap normal-btn" :class="{grayList:(expressOrder.expressStatus || '')=='CANCELLED'}" slot="content">
                        <div class="titWrap bbpxs">
                            <div class="titLeftGroup">																																								
								<span v-if="3==expressOrder.expressCompanyInfo.expressCompanyCode" class="iconWrap" v-bind:style="{backgroundImage: 'url(https://cdn.kuaidi100.com/images/all/56/' + expressOrder.expressCompanyInfo.expressCompanyNameEn + '.png)'}"></span>
                                <span v-else class="iconWrap" v-bind:style="{backgroundImage: 'url(' + expressCompanyMap[expressOrder.expressCompanyInfo.expressCompanyCode].src + ')'}"></span>
								<span class="left">{{showSearchExpressName(expressOrder)}}</span>
                                <span class="itemRight">运单号：{{expressOrder.outerExpressOrderNo || '---'}}</span>
                            </div>
                            <span class="pcDelete normal-btn" v-if="isPc" @click.stop="$emit('delete',expressOrder)">删除</span>
                        </div>
                        <div class="details">
                            <span v-if="!!orderTypeData[expressOrder.expressDetails.expressStatus]" class="status">{{(orderTypeData[expressOrder.expressDetails.expressStatus].text) || ''}}</span>
                            <span v-if="!!expressOrder.expressDetails.expressLocationDesc" class="des">{{expressOrder.expressDetails.expressLocationDesc || ''}}</span>
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
import {orderTypeMap,expressCompanyData,outExpressCompanyData} from '../enum/expressEnum.js';
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
            orderTypeData:orderTypeMap,//订单类型配置数据
            expressCompanyMap:expressCompanyData,//快递公司配置
            outExpressCompanyMap:outExpressCompanyData,//快递100所属快递公司本地配置，logo地址等
        };
    },
    methods: {
        showSearchExpressName(expressOrder){
            if(expressOrder.expressCompanyInfo.expressCompanyCode == 3){
                return this.outExpressCompanyMap[expressOrder.expressCompanyInfo.expressCompanyNameEn] || '';
            }else{  
                return expressOrder.expressCompanyInfo.expressCompanyName || '';
            }
        }
    }
};
</script>
<style scoped lang="less">
@import '~themes/default/styles/expressServer/comp/expressListSearchHistory.less';
</style>
