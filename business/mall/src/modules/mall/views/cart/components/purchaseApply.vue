<!-- 提交订单页面-->
<template>
<div class="purchaseApply">
	<AddressTitle :showTitle='true' @closePopup='closePopup' title='确认收货地址与发票信息' :showBottomBorder='true'></AddressTitle>
    <!-- 地址选择模块 -->
    <div class="purchaseApplyAddress-part">
       <addressDetail :addressItem="addressItem" @chooseAddress="chooseAddress"></addressDetail>
    </div>
    <!-- 发票部分 -->
    <div class="invoice-part cell">
        <span class="title">发票</span>
        <div class="content" @click="showBillDetailModelApply = true">
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
    <div class="bottom-btns">
        <p @click="closePopup" class="clear-btn red-btn">取消</p>
        <p @click="createOrder('applyPurchase')" class="confirm-btn normal-btn" :class="{disable: disabledOperate}">确定</p>
    </div>

    <!-- 选择开票详细信息弹窗部分 -->
    <div v-transfer-dom>
        <popup class="invoice-popup" v-model="showBillDetailModelApply"  :height='invoicePopHeight' :popup-style={zIndex:1001}>
            <billDetail 
                ref="billDetailCompCopy"
                :invoiceReceiver="invoiceReceiver"
                :orderInvoice="orderInvoice"
                :showBillDetailModel="showBillDetailModelApply"
                :invoiceDetail="invoiceDetail"
                @closeInvoicePopup='closeInvoicePopup' 
                @getBillDetail='getBillDetail'
                @showInvoicePop="showInvoicePop"
                @changeHeight="changeInvoicePopHeight"
            ></billDetail>
        </popup>
    </div>


    <!-- 选择发票抬头列表弹窗部分 -->
    <div v-transfer-dom>
        <popup class="invoice-choose-popup" v-model="showInvoiceChoose" height='80%' :popup-style="{zIndex: 1010, background:'#F6F9FD'}">
            <invoiceCard 
                ref="invoiceComp" 
                :showCheck="true"
                :isAllScreen="false"
                v-model="invoiceDetail"
                @closeInvoiceList="closeInvoiceList"
                @changeTitle="changeTitle"
            >
                <div slot="title" class="title-box">
                    <AddressTitle :title="popTitle" @closePopup='closeInvoiceAddOrEdit' :showBottomBorder='true'></AddressTitle>
                </div>
            </invoiceCard>
        </popup>
    </div>



    <!-- 选择地址信息弹窗部分 -->
    <div v-transfer-dom>
        <popup v-model="showAddressChooseApply" class="editAddress" height='100%' width="100%" position="right" :popup-style={zIndex:1001}>
            <addressComp ref="addressComp" v-model="addressItem" :showCheck="true" usePlace="apply" addressType="purchaseApply" @saveSuccess='saveSuccess' @closeAddressList="closeAddressList"></addressComp>
        </popup>
    </div>

    <!-- 下单时错误码报商品下架、缺货、变价的弹窗 -->
    <div v-transfer-dom>
        <confirm 
            class="productChange productChangeCart"
            v-model="showProductChange"
            ref="productChangeConfirm"
            title="抱歉，您本单购买的以下商品有变动！"
            confirm-text="确定"
            :show-confirm-button='false'
            cancel-text="返回购物车"
            @on-cancel="onCancelProductChange"
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
                <!-- <div class="tips">点击确定将移除下架、无货商品并更新变价商品价格</div> -->
            </div>
        </confirm>
    </div>
</div>
</template>

<script>
import AddressTitle from 'common/components/base/AddressTitle.vue';
import cartHandler from 'common/lib/requestHandler/cartHandler.js';
import goodsHandler from 'common/lib/requestHandler/goodsHandler.js';
import orderHandler from 'common/lib/requestHandler/orderHandler.js';
import confirmMixin from '../../order/confirm/components/confirmMixin.vue';
import extendUtils from 'common/lib/utils';
export default {
    extends: confirmMixin,
    components: {
		AddressTitle,
    },
    props: {
		purchaseApplyGoods:{
			type:Array,
			default:()=>[]
		}
    },
    data(){
        return Object.assign(extendUtils.stateManager.setData([
                {
                    name: 'showAddressChooseApply', //选择地址的弹窗控制变量
                    parent: '$refs.purchaseApplyComp',
                    show:{
                        callback(){
                            document.title = '收货地址'
                        }
                    },
                    hide:{
                        callback(){
                            document.title = '购物车'
                        }
                    }
                },
                {
                    name:'showBillDetailModelApply',//发票弹窗控制变量
                    parent: '$refs.purchaseApplyComp',
                },
                {
                    name:'showInvoiceChoose',//发票抬头选择弹窗控制
                    parent: '$refs.purchaseApplyComp',
                }
            ]),{
                orderLock: false,//申请采购按钮锁
                isPC: extendUtils.isPC(),
            })
    },
    watch:{
 
        addressItem(val){
            this.$emit('keepAddress', val);
        }
    },
    created(){
        
    },
    methods: {
   
        //关闭父级弹窗组件
        closePopup(){
            this.$emit('closePopup');
        },
        /*****
         * 关闭发票信息弹窗
         */
        closeInvoicePopup(){
            this.showBillDetailModelApply = false;
        },
        /*****
         * 关闭地址选择信息弹窗
         */
        closeAddressPopup(){
            this.showAddressChooseApply = false;
        },
        /*****
         * 选择地址的显示弹窗
         */
        chooseAddress(){
            this.showAddressChooseApply = true;
        },
		/*****
		* 选择完地址关闭弹窗
		*/
        closeAddressList(){
            this.closeAddressPopup();
        },

        /**
         * 初始化数据，重写下单页面方法
         */
        initData(){
            let that = this;
            //初始化以下两个变量
            that.productSkuList = this.purchaseApplyGoods.map(function(item){
                return {
                    sku: item.sku, //商品sku编号
                    num: item.quantity,  //商品数量
                    productSpec: item.specification, //商品规格参数
                    supplierId: item.supplierId, //供应商id
                }
            })
            let skuList = [];
            if(that.productSkuList.length > 0){
                that.productSkuList.forEach(item => {
                    !!item.sku && skuList.push(item.sku);
                    !!item.sku && (item.skuId = item.sku);//新增skuId字段用来获取预计到达时间、大小件查询、运费三个接口的入参
                });
                //通过sku获取订单详情
                //通过sku获取商品详情
                that.productPromise = that.getProductDetail(skuList).then(list => {
                    return that.getlistUnitPrice(list);
                });
            }  
        },


        /** 
        * 选择是否开发票的按钮，控制弹窗的高度变化
        */
        changeInvoicePopHeight(isInvoice){
            //兼容pc端的弹窗
            let height = 'auto';
            if(this.isPC){
                height = '63%';
            }else{
                height = '53%';
            }
            this.invoicePopHeight = isInvoice ? "80%" : height;
        },

        /**
         * 提交订单接口
         */
        createOrder(type){
            if(!!this.disabledOperate){ //该变量在继承的confirmMixin.vue组件里面
                extendUtils.showToast('该地址下选择的商品下架/区域限售/无货，请重新选择')
                return
            }
             //下单锁
            if(!!this.orderLock){
                return;
            }
            if(!!this.checkParam()){
                this.apiPromiseAll(type); //该方法在下单mixin里面
            }
        }, 

        /** 
        * 定义从审批跳转回来的url新增参数
        * （applyPage == confirm 说明是从提交订单页面去申请采购的）
        * （applyPage == cart 说明是从购物车页面去申请采购的）
        */
        setQuery(url){
            return url + '&applyPage=cart';
        },

        /**
         * 读取app缓存信息，调试用
         * @param {*} param 参数
         */
        getPropertyFunction(parma){
            let that = this;
            let obj = {
                "type":"string",//存储数据类型
                "key":parma.key+'',//存储的key
                // "fileName":that.BMallConfig.APPSTORAGE_FILENAME,//文件名
                // "defValue":''
            }
            extendUtils.getPropertyFunction(obj).then((res)=>{
                extendUtils.showToast((res.value));
                let data = res.value;
                console.log(data)
            }).catch((err)=>{
                console.log(err)
            })
        },

        /*****
        * 获取前往审批申请采购的商品信息
        */
		getPurchaseApplyInfo(){
			let that = this;
			let tempArr = [];
			//总金额分
			let totlePrice = 0;
			//总商品件数
			let psum = 0;
			//总list长度
			let plength = this.purchaseApplyGoods.length;
			for(let i = 0; i < plength; i++){
                const item = this.purchaseApplyGoods[i];
                let price = this.dealNum(item.unitPrice);
                tempArr.push({
                    pName: item.name,
                    price: price,
                    num: item.quantity,
                    sum: price * item.quantity
                })
				psum += item.quantity;
				totlePrice += (price * item.quantity);
			}
			return {
				pList: tempArr,
				pSum: psum,
                totalPrice: totlePrice+that.dealNum(that.expressPrice),
                freight: that.dealNum(that.expressPrice),
                
			};
        },

        /**
         * 处理金额计算 小数点失真的问题
         */
        dealNum(num=0){
            return Math.round(parseFloat(num).toFixed(2)*100);
        },

        /**
         * 点击取消按钮 即返回购物车的按钮
         */
        onCancelProductChange(){
            this.$emit('closePopup');
            this.$emit('refreshCartList');
        }
    }
};
</script>

<style scoped lang="less">
@import '~themes/default/styles/cart/components/purchaseApply.less';
@import '~themes/default/styles/order/confirm/confirmMixin.less';
</style>