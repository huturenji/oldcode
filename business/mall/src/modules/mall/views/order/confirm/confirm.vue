<!-- 提交订单页面-->
<template>
<div class="order-confirm-container">
    <!-- 地址选择模块 -->
    <div class="address-part">
       <addressDetail :addressItem="addressItem" @chooseAddress="chooseAddress"></addressDetail>
    </div>

    <!-- 商品详情页面 -->
    <div class="goods-list-part">
        <div class="goods-item box-shadow" v-for="(item, index) in productList" :key="index">
            <thumb06
                :img='item.imagePath'
                :title='item.name'
                :price='realPrice(item)'
                :status ='judgeProductStatus(item)'
                :noPriceTips="''"
            >
                <!-- 商品规格插槽 -->
                <template v-if="!!item.productSpec" slot="sub-text">
                    <div class="goods-format">{{dealSpecificationKeys(item.productSpec)}}</div>
                </template>

                <!-- 商品数量加减的插槽 -->
                <template slot="action">
                    <counter :value="!!item.remainNum && item.remainNum < item.num && item.remainNum > 0  ? item.remainNum : item.num" :showLable="false" @input="setNum(item, $event)" :max="!!item.remainNum && item.remainNum>0?item.remainNum:BMallConfig.GOODS.MAX_COUNT"></counter>
                </template>
            </thumb06>


            <!-- 对应商品的赠品的展示 -->
            <div class="gift_part" v-if="showDiscount(item)">
                <div class="left_part"></div> 
                <div class="right_part">
                    <template v-if="showGiftList(item)">
                        <div class="list_item" v-for="(giftItem, i) in item.giftList" :key="i">
                            <span class="symbol"><symbolGift name="赠品" color="#999"/></span>
                            <span class="name">{{giftItem.name}}</span>
                            <span class="num">x{{giftItem.num}}</span>
                        </div> 
                    </template>
                    <template v-if="showAttachmentList(item)">
                        <div class="list_item" v-for="(attachmentItem, j) in item.attachmentList" :key="j">
                            <span class="symbol"><symbolGift name="附件" color="#999"/></span>
                            <span class="name">{{attachmentItem.name}}</span>
                            <span class="num">x{{attachmentItem.num}}</span>
                        </div> 
                    </template>
                </div> 
            </div> 


            <!-- 当该商品有货的时候，每个商品均显示该商品单个的库存信息 -->
            <div v-if="item.hasStock" class="stock_item">
                <span class="title"><symbolGift name="配货信息" color="#F49939"/></span>
                <span class="content">{{item.stockText}} </span>
            </div>
        </div>
    </div>

    <!-- 预计送达时间部分（因为新增了配送时间，故预计送达时间不需要了） -->
    <!-- <div v-if="!!promiseTime" class="express-part box-shadow">
        <div v-if="!!promiseTime" class="cell">
            <span class="title">预计送达时间</span>
            <div class="content">
                <span class="time" v-html="promiseTime"></span>
            </div>
        </div> -->
        <!-- <p v-if="showStockText" class="stock_tips">{{stockText}}</p> -->
    <!-- </div> -->

    <!-- 配送时间 -->
    <div v-if="!!dateLoaded" class="express-part box-shadow">
        <div class="cell">
            <span class="title">配送时间</span>
            <div v-if="showFactoryDateTips" class="content">
                <div>{{factoryDateTips}}</div>
            </div>
            <div v-else class="content">
                <div>
                    <p v-if="!!deliveryTimeStr" class="time calendar-time" @click="showDatePop(1)"><span v-if="!!installTimeStr"><i v-show="showKeyBig">大件</i>送货：</span><span class="str" v-html="deliveryTimeStr"></span></p>
                    <p v-if="!!installTimeStr" @click="showDatePop(2)" class="time calendar-time"><i v-show="showKeyBig">大件</i>安装：<span class="str" v-html="installTimeStr"></span></p>
                </div>
                <Icon type='icon_common_rightarrow' size=".24"/>
            </div>
            
        </div>
    </div>


    <!-- 发票部分 -->
    <div class="invoice-part box-shadow cell">
        <span class="title">发票</span>
        <div class="content" @click="showBillDetailModel = true">
            <template v-if="isInvoice">
                <div v-if="!!orderInvoice.invoiceContent && !!invoiceDetail.name && !!invoiceReceiver.phone" class="content-item">
                    <p>
                        <span>{{orderInvoice.invoiceCategory == 3 ? '电子' : '增值税专用发票'}}</span>
                        <span>({{orderInvoice.invoiceContent == 1 ? '商品明细 -' : '商品类别 -'}}</span>
                        <span>{{invoiceDetail.name}}</span>
                    </p>
                    <span>)</span>
                </div>
                <div v-else class="palceholder">请填写发票信息</div>
            </template>
            <div v-else>不开发票</div>
            <Icon type='icon_common_rightarrow' size=".24"/>
        </div>
    </div>

    <!-- 金额部分 -->
    <div class="price-part box-shadow">
        <div class="goods-price price-cell">
            <span class="title-name">商品金额</span>
            <span class="content-details num-font one">
                <priceLabel :amount="productTotal" toFixed='2' :camelCase="false"></priceLabel>
            </span>
        </div>
        <div class="goods-express price-cell">
            <p class="title-name">
                <span>运费</span>
                <span v-if="!!totalWeight && totalWeight > 0" class="weight">(总重:{{totalWeight}}kg)</span>
            </p>
            <p class="content-details num-font">
                +<priceLabel class="pay" :amount="expressPrice" toFixed='2' :camelCase="false"></priceLabel>
            </p>
        </div>
    </div>

    <!-- 底部的提交订单的按钮部分 -->
    <div v-transfer-dom>
        <div class="submit-order-btn fixed-dom-part">
            <div class="totle-price num-font">
                <span class="totle-title">合计:</span>
                <priceLabel v-if="paymentAmount>0" class="pay" :class="{font44:BIGNUMFONT<=paymentAmount}" :amount="paymentAmount" toFixed='2'></priceLabel>
                <span class="no-price" v-else>---</span>    
            </div>
            <!-- 屏蔽掉申请采购的按钮 -->
            <div v-if="false" @click="!disabledOperate && createOrder('applyPurchase')" class="confirm-order confirm-order-apply normal-btn" :class="{disable: disabledOperate}">申请采购</div>
            <div @click="!disabledOperate && createOrder()" class="confirm-order linear-gra-mall-btn normal-btn" :class="{disable: disabledOperate}">提交订单</div>
        </div>
    </div>

    <!-- 选择开票详细信息弹窗部分 -->
    <div v-transfer-dom>
        <popup class="radius10" v-model="showBillDetailModel"  :height='invoicePopHeight' :popup-style="{zIndex: 501}">
            <billDetail 
                ref="billDetailComp"
                :isInvoice="isInvoice"
                :invoiceReceiver="invoiceReceiver"
                :orderInvoice="orderInvoice"
                :showBillDetailModel="showBillDetailModel"
                :invoiceDetail="invoiceDetail"
                :showImportInvoice="showImportInvoice"
                @closeInvoicePopup='closeInvoicePopup' 
                @getBillDetail='getBillDetail'
                @showInvoicePop="showInvoicePop"
                @changeHeight="changeInvoicePopHeight"
                @import="importInvoiceFun"
            ></billDetail>
        </popup>
    </div>
    
   

    <!-- 选择配送时间弹窗部分 -->
    <div v-transfer-dom>
        <popup class="radius10" v-model="showDeliveryDetailPop"  height='75%' :popup-style="{zIndex: 501}">
            <deliveryDetailPop 
                v-if="showDeliveryDetailPop"
                ref="deliveryDetailComp"
                :productPromiseCalendars="productPromiseCalendars"
                :productList="productList"
                :show="showDeliveryDetailPop"
                @input="updatePromiseDateList"
                @showCalendarPop="showDateCalendarPop"
                @showCalendarInstallPop="showCalendarInstallPop"
                @closeDetailDatePopup="showDeliveryDetailPop = false"
            ></deliveryDetailPop>
        </popup>
    </div>

    <!-- 选择配送时间具体的时间日历弹窗部分 -->
    <div v-transfer-dom>
        <popup class="radius10" v-model="showCalendarDate"  height='75%' :popup-style="{zIndex: 501}">
            <calendarDate 
                v-if="showCalendarDate"
                ref="calendarDateComp"
                v-model="calendarList"
                @input="updatePromiseCalendar"
                @closeCalendarDatePopup="closeCalendarDatePopup"
            ></calendarDate>
        </popup>
    </div>

    <!-- 选择安装时间具体的时间日历弹窗部分 -->
    <div v-transfer-dom>
        <popup class="radius10" v-model="showCalendarInstallDate" height='75%' :popup-style="{zIndex: 501}">
            <calendarInstallDate
                v-if="showCalendarInstallDate"
                ref="calendarInstallDateComp"
                v-model="calendarInstallList"
                @input="updatePromiseInstallCalendar"
                @closeCalendarInstallDatePopup="closeCalendarInstallDatePopup"
            ></calendarInstallDate>
        </popup>
    </div>
    
    <!-- 选择发票抬头列表弹窗部分 -->
    <div v-transfer-dom>
        <popup class="radius10" v-model="showInvoiceChoose" height='80%' :popup-style="{zIndex: 530, background:'#F6F9FD'}">
            <invoiceCard 
                ref="invoiceComp" 
                :showCheck="true"
                :isAllScreen="false"
                v-model="invoiceDetail"
                @closeInvoiceList="closeInvoiceList"
                @changeTitle="changeTitle"
                @showImportInvoiceFun="checkImportInvoiceBtn"
            >
                <div slot="title" class="title-box">
                    <AddressTitle :title="popTitle" @closePopup='closeInvoiceAddOrEdit' :showBottomBorder='true'></AddressTitle>
                </div>
            </invoiceCard>
        </popup>
    </div>


    <!-- 选择地址信息弹窗部分 -->
    <div v-transfer-dom>
        <popup v-model="showAddressChoose" class="editAddress" height='100%' width="100%" position="right">
            <addressComp :showComp="showAddressChoose" ref="addressComp" v-model="addressItem" :showCheck="true" addressType="orderConfirm" @closeAddressList="closeAddressList" @saveSuccess='saveSuccess'></addressComp>
        </popup>
    </div>


    <!-- 下单时错误码报商品下架、缺货、变价的弹窗 -->
    <div v-transfer-dom>
        <confirm 
            class="productChange"
            v-model="showProductChange"
            ref="productChangeConfirm"
            title="抱歉，您本单购买的以下商品有变动！"
            confirm-text="确定"
            :show-confirm-button='showProductChangeConfirm'
            cancel-text="返回购物车"
            @on-cancel="onCancelProductChange"
            @on-confirm="onConfirmProductChange"
        >  
            <div v-if="showProductChange">
                <div class="goods-item-change" v-for="(item, index) in productChangeList" :key="index">
                    <thumb07
                        :img='item.imagePath'
                        :title='item.name'
                        :price='item.unitPrice'
                        :oldPrice='item.oldUnitPrice'
                        :status ='judgeChangeProductStatus(item)'
                    >
                    </thumb07>
                </div>
                <div v-if="showProductChangeConfirm" class="tips">点击确定将移除下架、限售、无货商品并更新变价商品价格</div>
            </div>
        </confirm>
    </div>

</div>
</template>
<script>
import extendUtils from 'common/lib/utils';
import confirmMixin from "./components/confirmMixin.vue";
import tChatEventMixin from 'common/lib/mixin/tChatEventMixin.js';
import goodsHandler from 'common/lib/requestHandler/goodsHandler.js';

import { SnModal } from 'sinosun-ui';
export default {
    extends: confirmMixin,
    mixins: [tChatEventMixin],
    data(){
          return Object.assign(extendUtils.stateManager.setData([
                {
                    name: 'showAddressChoose', //选择地址的弹窗控制变量
                    show:{
                        callback(){
                            document.title = '地址管理'
                        }
                    },
                    hide:{
                        callback(){
                            document.title = '填写订单'
                        }
                    }
                },
                {
                    name:'showBillDetailModel',//发票弹窗控制变量
                },
                {
                    name:'showCalendarInstallDate',//选择安装日期时间弹窗控制变量
                },
                {
                    name:'showCalendarDate',//选择配送日期时间弹窗控制变量
                },
                {
                    name:'showDeliveryDetailPop',//选择配送日期时间详情弹窗的控制变量
                },
                {
                    name:'showInvoiceChoose',//发票抬头选择弹窗控制
                }
            ], this),{
                BIGNUMFONT:1000000,//超大金额使用小字号的阀值    
                btnText:'保存并使用',  
            })
    },
    watch:{
        invoiceDetail: {
            handler(val){
                if(Object.keys(val).length > 0){
                    extendUtils.setSession('choosedInvoiceDetail', JSON.stringify(val))
                }
            },
            deep: true
        }
    },
    created(){
        //监听页面返回事件，从审批页面返回，需要取消订单
        extendUtils.winCloseCb(function(data){//注册推送
            let backData = JSON.parse(JSON.parse(data).refreshData) || {};
            if(!!data && !!backData && 'approval'==backData.pageFrom){ //从审批不提交，直接返回的场景
                this.orderLock = false;//打开订单锁 
                //此处的orderNo为通过url传递的加密信息，非直接的orderNo
                let applayData =JSON.parse(Base64.decode(backData.orderNo));
                this.cancelOrder(applayData.orderNo);
                this.orderNo = ''; //取消订单后，清空orderNo，否则会造成提交订单页面申请采购调谐表单页面直接返回，页面卡死
            }
        }.bind(this));
    },
    mounted(){
        this.invoiceDetail = !!extendUtils.getSession('choosedInvoiceDetail') ? JSON.parse(extendUtils.getSession('choosedInvoiceDetail')) : {};
    },
    methods: {
         /**
         * T信回退事件的注册回调 必须是goBackFun
         */
        goBackFun(){
            let that = this;
            if(!!that.orderNo){ //如果是已经生成了订单，并且支付列表已经弹出，点击返回直接跳转到订单列表（待支付状态的）
               that.$payComp.closePayPop();
               that.$router.push({
                    path:'/order/list/all',
                    query:{
                        backSteps: 2
                    }
                })
            }else{
                that.$router.back();
            }
        },  
        
        //去新建地址
        gotoAddress(){
          this.$refs.addressComp.showReceipt();
        },

        //新增地址成功回调
        saveSuccess(param){
            this.addressItem = param;
        },

       

    }
   
};
</script>
<style scoped lang="less">
@import '~themes/default/styles/order/confirm/confirm.less';
@import '~themes/default/styles/order/confirm/confirmMixin.less';
</style>