<!--
    商品缩略图及相应的各个状态
-->
<template>
    <div class="order-detail-container">
        <template v-if='orderDetail'>
            <div class='content'>
                <div class='statu-area' :class='{"ms-size": showPayBtn}'>
                    <i class='icon' :class='getOrderStatus(orderDetail.order.orderState).classLabel'/>
                    <div class='label'>{{orderStateText}}</div>
                    <!-- 待付款的订单倒计时部分 -->
                    <template v-if='showPayBtn'>
                        <div class='pay-info'>
                            <div>需付款：<priceLabel class='amount' toFixed='2' :amount='orderDetail.order.paymentAmount'/></div>
                            <div v-if="limitTime && limitTime > 0">剩余：<span class='bold'>{{limitTime | payTimeFilter}}</span></div>
                        </div>
                        <btnFactory :singleton="true" type='pay' class="pay-btn" :orderInfo='orderDetail.order'/>
                    </template>

                    <!-- 待审批的订单倒计时部分 -->
                    <template v-if='showApprovalBtn'>
                        <div class='approval-info'>
                            <div v-if="limitTime && limitTime > 0" class="tips">请在<span class='bold'>{{limitTime | payTimeFilter}}</span>内完成审批并支付</div>
                        </div>
                    </template>
                </div>


                <div class='bottom-content'>

                    <!-- 退款明细部分 -->
                    <div v-if="showRefund" class="refund_part">
                        <div class="amount">
                            <span>退款金额</span>    
                            <span class="content">
                                <priceLabel :amount="orderDetail.order.refundAmount" toFixed='2' :camelCase="false"></priceLabel>
                            </span>    
                        </div>
                        <div class="status">已退款</div>
                    </div>


                    <!-- 包括快递部分 -->
                    <template>
                        <!-- 多个包裹显示的dom -->
                        <template v-if="packageListLength > 1"> 
                            <div class='express-content cursorp' @click="gotoPackageInfor()">
                                <p class="icon_box"><i class='icon express'/></p>
                                <div class='content'>
                                    <div>
                                        您的订单被拆分为{{packageListLength}}个包裹
                                    </div>
                                </div>
                                <div class='right-arrow'/>
                            </div>
                        </template>
                        <!-- 一个包裹显示的dom -->
                        <template v-else>
                            <div class='express-content cursorp' @click="gotoExpressTrack()" v-if='showExpressComputed'>
                                <p class="icon_box"><i class='icon express'/></p>
                                <div class='content'>
                                    <div>
                                        <span v-html="formatedDomStr(expressRouteTips, expressPhone)"></span>
                                        <!-- 已与UE沟通暂时屏蔽掉联系人姓名和电话 -->
                                        <!-- <span class='person-info' v-show="remarkAndTimeComputed.name && remarkAndTimeComputed.phone">
                                            {{remarkAndTimeComputed.name}}
                                            电话:{{remarkAndTimeComputed.phone}}
                                        </span> -->
                                    </div>
                                </div>
                                <div class='right-arrow'/>
                            </div>
                        </template>
                    </template>
                    
                    <!-- 收货地址的dom -->
                    <div class='express-content' v-if='orderDetail.receiverInfo'>
                        <p class="icon_box"><i class='icon position'/></p>
                        <div class='content' >
                            <div class='person-info'>{{orderDetail.receiverInfo.name}} {{dealxing(orderDetail.receiverInfo.phone || '')}}</div>
                            <div class='sub-info'>地址：
                                {{orderDetail.receiverInfo.province}}{{orderDetail.receiverInfo.city}}{{orderDetail.receiverInfo.district}}{{!!orderDetail.receiverInfo.town?orderDetail.receiverInfo.town:""}}{{orderDetail.receiverInfo.address}}
                            </div>
                        </div>
                    </div>

                    <div class='sub-content'>
                        <section @click="gotoGoodDetail(product)" class='goods-block' v-for='product in orderDetail.products' :key='product.sku'>
                            <!-- TODO 单类商品价格展示 productTotal字段  暂时用  数量*单价 -->
                            <thumb05 
                                :img='product.imageUrl' 
                                :goodsDesc='dealSpecificationKeys(product.specification)' 
                                :price='product.unitPrice' 
                                :productType='product.productType'  
                                :count='product.quantity' 
                                :title='product.name' 
                            >   
                                <div class="btn_wrap">
                                    <btnFactory type='afterSale' :product="product" :orderInfo='Object.assign({},orderDetail.order,{receiverInfo:orderDetail.receiverInfo})'/>
                                    <btnFactory v-if="product.productType==0" type='addCart' @setIntoCart="setIntoCart" :product="product" :orderInfo='orderDetail.order'/>
                                </div>
                            </thumb05>
                        </section>
                        <!-- 与取消的订单不显示发票的dom -->
                        <section class='invoice-content content-block' v-if='(!!orderDetail.orderInvoice && [OrderState.CANCELED.code].indexOf(orderDetail.order.orderState)==-1 && !!orderDetail.orderInvoice.invoiceTitle) && orderDetail.order.orderSource == 0'>
                            <ul>
                                <li>
                                    <span class='title'>发票类型：</span>
                                    <!-- orderDetail.orderInvoice.invoiceCategory
                                        2 = 增值税专用发票
                                        3 = 电子发票
                                        一期不支持专用发票
                                      -->
                                    <span class='content'>{{orderDetail.orderInvoice.invoiceCategory == 2?'增值税专用发票':'电子发票'}}</span>
                                    <btnFactory selfClass='self-width' type='invoiceDetail' :orderInfo='orderDetail.order'/>
                                </li>
                                <li>
                                    <span class='title'>发票抬头：</span>
                                    <span class='content'>{{orderDetail.orderInvoice.invoiceTitle}}</span>
                                </li>
                                <li>
                                    <span class='title'>发票内容：</span>
                                    <span class='content'>{{orderDetail.orderInvoice.invoiceContent}}</span>
                                </li>
                            </ul>
                            <div class='tips'>
                                <Icon type='icon-clamation-circle' class='icon' size='.24'/>
                                <span>电子发票与纸质发票具有同等法律效力，可作为用户维权、保修的有效凭证</span>
                            </div>
                        </section>
                        <section class='invoice-content content-block no-marginbottom' v-if="(!!orderDetail.orderInvoice && [OrderState.CANCELED.code].indexOf(orderDetail.order.orderState)==-1 && !orderDetail.orderInvoice.invoiceTitle) && orderDetail.order.orderSource == 0">
                                <ul>
                                    <li>
                                        <span class='title'>发票类型：</span>
                                        <span class='content'>不开发票</span>
                                    </li>
                                </ul>
                        </section>
                        <section class='payment-content content-block'>
                            <ul>
                                <li>
                                    <span class='title'>订单编号：</span>
                                    <span class='content can-select'>{{orderDetail.order.orderNo}}</span>
                                </li>
                                <li>
                                    <span class='title'>下单时间：</span>
                                    <span class='content'>{{orderDetail.order.createTime}}</span>
                                </li>
                            </ul>
                            <ul class='top-line' v-if='orderDetail.order.paymentTypeName || orderDetail.order.paymentTypeText'>
                                <li v-if='orderDetail.order.paymentTypeName || orderDetail.order.paymentTypeText'>
                                    <span class='title'>支付方式：</span>
                                    <span class='content'>{{orderDetail.order.paymentTypeName || orderDetail.order.paymentTypeText}}</span>
                                </li>
                                <li v-if='orderDetail.order.paymentFlowNo'>
                                    <span class='title'>流水号：</span>
                                    <span class='content'>{{orderDetail.order.paymentFlowNo}}</span>
                                </li>
                                <li v-if='orderDetail.order.paymentTime'>
                                    <span class='title'>支付时间：</span>
                                    <span class='content'>{{orderDetail.order.paymentTime}}</span>
                                </li>
                            </ul>
                        </section>


                        <!-- 配送时间 -->
                        <section v-if="productPromiseCalendars.length>0" class='date-content content-block'>
                                <ul>
                                    <li>
                                        <span class='title'>配送时间：</span>
                                        <span class='content'>
                                            <template v-if="judgeDeliveryCanlendar">
                                                <div class="dateRange" v-for="(item, index) in productPromiseCalendars" :key="index">  
                                                    <p v-if="item.supportDelivery"><i v-if="multiDate || item.supportInstall">{{item.showNameKey}}: </i>{{item.delivertyTimeStr}} </p>
                                                    <p v-else><i v-if="multiDate">{{item.showNameKey}}: </i>{{factoryDateTips}}</p>
                                                    <p v-if="item.supportInstall"><i v-if="multiDate">{{item.showNameKey}}</i>安装: {{item.installTimeStr}} </p>
                                                </div>
                                            </template>
                                            <template v-else>
                                                <div class="dateRange">  
                                                    <p>{{factoryDateTips}}</p>
                                                </div>
                                            </template>
                                        </span>
                                    </li>
                                </ul>
                        </section>


                        <section class='content-block'>
                            <ul class='space-between'>
                                <li>
                                    <div class='title'>商品金额</div>
                                    <div class='content number'>
                                        <priceLabel :amount='orderDetail.order.productTotal' toFixed='2' :camelCase='false'/>
                                    </div>
                                </li>
                                <li v-if='orderDetail.order'>
                                    <div class='title'>运费
                                        <span v-if="!!orderDetail.order.weightAmount" class='sub-title'>
                                            (总重:{{orderDetail.order.weightAmount}}kg)
                                        </span>
                                    </div>
                                    <div class='content number plus'>
                                        <priceLabel :amount='orderDetail.order.freightAmount' toFixed='2' :camelCase='false'/>
                                    </div>
                                </li>
                            </ul>
                            <div class='totalPrice'>
                                {{priceText}}：
                                <span class='amount'>
                                    <priceLabel :amount='orderDetail.order.paymentAmount' toFixed='2' :camelCase='false'/>
                                </span>
                            </div>
                            
                            <!-- 联系客服 跳转到客服系统 -->
                            <!-- <div class='contact-customer' @click="gotoCustomerService">
                                <Icon type='service' size='.3'/>
                                <btnFactory type='contactCustomer' :orderInfo='orderDetail.order'/>
                            </div> -->

                            <!-- 联系客服 跳转到客服系统 -->
                            <div class='contact-customer zhiCustomBtn' @click="gotoCustomerService">
                                <Icon type='kefu1' size='.32'/>
                                <div>
                                    <div class="order-btn normal-btn cursorp order-btn-contactCustomer customerService">
                                       <span>联系客服</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                       
                       
                    </div>

                  
                </div>
            </div>

            <div v-transfer-dom>
                <div class='btn-group' v-if='pageActive && orderDetail'>
                    <btnGroup 
                        ref="btnGroup"
                        @deleteOrderCompleted="deleteOrderCompleted()" 
                        @cancelOrderCompleted="getOrderDetail" 
                        @confirmReceiptCompleted="getOrderDetail" 
                        @updateLimitTime="updateLimitTime" 
                        :orderInfo='orderDetail.order'/>
                </div>
            </div>
              <!-- 定位底部的购物车按钮 -->
            <div v-transfer-dom>
                <cartThumb v-if="showCart" ref='cartThumb' class="cartpart" @clickCartThumb="clickCartThumb"></cartThumb>
            </div>
        </template>
        <template v-else-if='!$loading.isShow'>
            <emptyPage emptyImg='DATA_FAIL' tips='查询订单详情失败，请'><a @click='reFresh' class='refresh'>刷新</a></emptyPage>
        </template>

        
    </div>
</template>
<script>
    import extendUtils from 'common/lib/utils';
    import customerService from 'common/lib/customer-service/index.js'; //客服系统
    import {getOrderStatus, OrderState, zcOrderStateMap, skuClassifyMap, factoryDateTips} from 'common/lib/enum/orderStatusEnum';
    import orderHandler from 'common/lib/requestHandler/orderHandler'
    import tChatEventMixin from 'common/lib/mixin/tChatEventMixin';
    import orderMixin from '../orderCommon/mixin';
    const cartThumb = ()=>import('commonComp/cartThumb/cartThumb.vue');
    const priceLabel = ()=>import('common/components/base/priceLabel');
    const thumb05 = ()=>import('common/components/goodsThumb/thumb05');
    const btnGroup = ()=>import('common/components/orderBtn/btnGroup.vue');
    const btnFactory = ()=>import('common/components/orderBtn/btnFactory.vue');
    const emptyPage = ()=>import('common/components/base/emptyPage');
    import AddCartAnimation from 'common/lib/animation/addCart.js';
    import Icon from 'commonComp/base/Icon';
    export default {
        mixins: [tChatEventMixin, orderMixin],
        components: {thumb05, Icon,priceLabel, btnFactory,btnGroup,emptyPage,cartThumb},
        data(){
            return Object.assign(extendUtils.stateManager.setData([
            ], this), {
                OrderState: OrderState,
                orderDetail: null,
                pageActive: true,//当前页面是否是激活态（保活时用到）
                limitTime: 0, //剩余的支付时间,用于展示 
                showCart: false, //是否显示右下角定位的购物车 只有点击加购物车按钮的时候才显示
                expressRouteTips:'', //物流信息显示文字
                showExpress:false,   // 是否显示物流信息
                expressRouteInfos:[], //当前包裹的快递信息
                orderNo: this.$route.params.orderNo, //订单号
                expressPhone:'',//快递员的电话号码
                productPromiseCalendars: [], //配送日期和安装日期数组
                factoryDateTips: factoryDateTips
            })
        },
        created(){
            this.getOrderDetail();
        },
        beforeRouteEnter (to, from, next) { 
            next(vm => {
                //如果页面是前进过来的，则重新加载；否则保活
                if(extendUtils.getSession('nextDirection') == 'forward'){
                    // vm.orderDetail = null;
                    // vm.getOrderDetail();
                }
            })
        },
        activated(){
            //标识页面被激活
            this.pageActive = true;
        },
        deactivated(){
            //标识页面已离开
            this.pageActive = false;
        },
        computed: {
            /**
             * 是否显示物流
             */
            remarkAndTimeComputed(){
                try{
                    return this.expressRouteInfos[0].remarkAndTime[0]
                }catch(e){
                    return {}
                }
                
            },
            /**
             * 是否显示支付按钮 只有待支付状态可用
             */
            showPayBtn(){
                return [OrderState.UNPAID.code].indexOf(this.getOrderStatus(this.orderDetail.order.orderState).state) > -1
            },

            /**
             * 是否显示审批倒计时 只有待审批状态可用
             */
            showApprovalBtn(){
                return [OrderState.UNAPPROVAL.code].indexOf(this.getOrderStatus(this.orderDetail.order.orderState).state) > -1
            },
            
            /**
             * 订单状态的文字显示
             */
            orderStateText(){
                return getOrderStatus(this.orderDetail.order.orderState, {paymentType: this.orderDetail.order.paymentType}).name;
            },

            /**
             * 是否显示物流实时信息
             */
            showOrderExpress(){
                return [OrderState.UNRECEIVED.code, OrderState.COMPLETE.code].indexOf(this.getOrderStatus(this.orderDetail.order.orderState).state) > -1
            },

            /**
             * 如果是订单已经是支付过后的（也就是待收货、已完成显示‘实付款’），如果是支付之前的应该显示‘需付款’
             */
            priceText(){
                let flag = [OrderState.UNRECEIVED.code, OrderState.COMPLETE.code].indexOf(this.getOrderStatus(this.orderDetail.order.orderState).state) > -1;
                if(!!flag){
                    return '实付款';
                }else{
                    return '需付款';
                }
            },

            /**
             * 是否显示物流信息
             */
            showExpressComputed(){
                return this.showExpress;
            },

            /**
             * 包裹的数量
             */
            packageListLength(){
                return this.orderDetail.packageList.length; 
            },

            /**
             * 是否显示退款明细部分
             */
            showRefund(){
                //订单状态为已取消并且有退款状态（已退款）的时候，才会显示退款明细的部分
                let orderFlag = [OrderState.CANCELED.code].indexOf(this.orderDetail.order.orderState) > -1;
                let refundStateFlag = !!this.orderDetail.order.refundState && this.orderDetail.order.refundState == 'REFUNDED'; //只有已退款的才展示
                return orderFlag && refundStateFlag;
            },

            //是否是多个商品 有多个配送时间 true=是 false=否
            multiDate(){
                return this.productPromiseCalendars.length > 1;
            },

            //判断是否均没有配送时间 返回false=每一个信息都没有配送时间 还是 true=有商品有配送时间
            judgeDeliveryCanlendar(){
                let flag = this.productPromiseCalendars.some(item=>{
                    return !!item.supportDelivery;
                })
                return flag;
            },
            

            /********
             * 整合在线客服需要拼接的参数（用的在线客服事智齿科技）
             */
            zcConfig(){
                let status = this.orderDetail.order.orderState;
                let order = this.orderDetail.order;
                let products = this.orderDetail.products;
                let order_status = zcOrderStateMap[status];
                let goods = []; //商品详情数组
                
                // 此处只显示第一个商品的缩略图即可
                goods.push({
                    name: encodeURIComponent(products[0].name), //商品名称
                    pictureUrl: encodeURIComponent(products[0].imageUrl), //商品图片链接（建议使用encodeURIComponent转义一下，防止链接中带有特殊符号导致参数获取失败）
                })
                
                return {
                    order_status: order_status, //订单状态，1: '待付款',2: '待发货',3: '运输中', 4: '派送中',5: '已完成', 6: '待评价',7: '已取消',
                    create_time: new Date(order.createTime.replace(/\-/g, '/')).getTime(), //创建时间（毫秒）此处需特别注意，ios时间格式如果是-的话转换有兼容性问题，应该转为/
                    order_code: order.orderNo, //	订单编号
                    order_url: encodeURIComponent(extendUtils.assignUrlParam('pageFrom', 'customerService')), //订单链接（建议使用encodeURIComponent转义一下，防止链接中带有特殊符号导致参数获取失败）
                    goods_count: products.length, //商品数量 
                    total_fee: order.paymentAmount*100, //订单金额（以分为单位，total_fee=1000相当与total_fee=10.00元，不支持小数）
                    goods: JSON.stringify(goods),
                }
            },

            


        },
        watch:{
            //监听订单状态的变化,由于订单列表做了保活，目前为了实现，订单详情更改了订单状态，返回列表由于订单列表做了保活，如果订单详情的状态变了，前端会将订单列表该orderItem数据响应式刷新
            'orderDetail.order.orderState':{
                handler(val){
                    window.orderItemContainer = JSON.parse(JSON.stringify(this.orderDetail.order));
                    
                },
                deep: true
            }
        },
        filters: {
            /**
             * 支付剩余时间格式化
             */
            payTimeFilter(val){
                let days = parseInt(val / (1000 * 60 * 60 * 24));
                let hours = parseInt((val % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                let minutes = parseInt((val % (1000 * 60 * 60)) / (1000 * 60));
                let seconds = parseInt(parseInt((val % (1000 * 60)) / 1000));
                let text = '';
                days && (text += `${days}天`);
                hours && (text += `${hours}小时`);
                minutes && (text += `${minutes}分`);
                !days && (text += `${seconds}秒`);
                return text || 0;
            },
        },
        methods: {
            //跳转到客服系统
            async gotoCustomerService(){  
                let url = await customerService.run(1, this.zcConfig, 'order').catch(e=>{
                    console.log(e)
                });
                window.open(url);
                // extendUtils.openApplet({
                //     appId: this.BMallConfig.SUPPLIER_Map[goodsHandler.supplierId].appId,
                //     url,
                // });
            },


            callPhone(){
               extendUtils.callNativeTel(this.BMallConfig.BIS_CUSTOMER_SERVICE_PHONE)
            },
            
            /**
             * 页面刷新入口
             */
            reFresh(){
                this.getOrderDetail();
            },
            /**
             * 代理函数：获取订单状态对象
             */
            getOrderStatus(code){
                return getOrderStatus(code)
            },
            /**
             * 获取订单详情
             */
            async getOrderDetail(){
                let that = this;
                this.$loading.show();
                try{
                    let param = {
                        orderNo: this.$route.params.orderNo
                    }
                    let data = await orderHandler.getOrderDetail(param);
                    this.orderDetail = data.result;

                    this.dealProductPromiseCalendars(this.orderDetail.productPromiseCalendars); //处理配送时间和安装时间
                    this.orderDetail.order.products = data.result.products; //再次购买功能需要把商品带过去
                    this.orderDetail.order.orderInvoice = data.result.orderInvoice;
                    if(this.showOrderExpress){
                        let packageList = this.orderDetail.packageList;  
                        //将packageList塞到order里面
                        that.orderDetail.order = Object.assign({}, that.orderDetail.order, {
                            packageList
                        })
                        this.showExpress = true;
                        if(packageList.length == 1){//如果只有一个包裹的情况
                            let expressInfo = await orderHandler.getOrderExpressRouteInfos(param); 
                            let packageItem = expressInfo.result.packageList[0];
                            that.expressRouteInfos = packageItem.deliveryInfo.routeInfos;
                            if(!!that.expressRouteInfos && that.expressRouteInfos.length > 0){
                                this.expressRouteTips = that.expressRouteInfos[0].remarkAndTime[0].remark;
                                this.expressPhone = that.expressRouteInfos[0].remarkAndTime[0].phone || '';
                            }else{
                                this.expressRouteTips = '暂无物流信息';
                            }
                            
                        }else{ //此时还没有物流信息，此时展示order.remark
                            if(!!that.orderDetail.order.remark){
                                this.expressRouteTips = that.orderDetail.order.remark;
                            }else{
                                this.expressRouteTips = '暂无物流信息';
                            }
                        }                        
                    }
                }catch(e){
                    console.error(e);
                }finally{
                    this.$loading.hide();
                }
            },

            /**
             * 处理送货时间和配送时间数据
             */
            dealProductPromiseCalendars(list){
                if(!!!list || list.length <= 0){return};
                this.productPromiseCalendars = list.map((item, index)=>{
                    if(item.calendarDay && Object.keys(item.calendarDay).length > 0){ //说明有送货时间
                        let dateStr = this.formateDateTime(item.calendarDay.dateStr);
                        let timeStr = ''
                        if(!!item.calendarDay.timeRangeList && item.calendarDay.timeRangeList.length > 0){
                            timeStr = item.calendarDay.timeRangeList[0].timeRange
                        }
                        this.$set(item, 'delivertyTimeStr', `${dateStr} ${timeStr}`);
                    }
                    if(item.installDay && Object.keys(item.installDay).length > 0 && !!item.supportInstall){ //说明有安装时间
                        let dateStr = this.formateDateTime(item.installDay.dateStr);
                        this.$set(item, 'installTimeStr', `${dateStr}`);
                    }
                    if(!!!item.skuClassify){
                        item.skuClassify = 100;
                    }
                    let showNameKey = item.skuClassify == 100 ?`${skuClassifyMap[item.skuClassify]}${++index}` : skuClassifyMap[item.skuClassify];
                    this.$set(item, 'showNameKey', showNameKey);


                    return item;
                })
            },

            //格式化送货时间安装的日期
            formateDateTime(date){  
                let startDate = new Date(date.replace(/\-/g, '/'));
                let dateStrFor = startDate.format("MM月dd日");
                let week = extendUtils.indexToWeek(startDate.getDay());
                return `${dateStrFor} (${week})`;
            },
            

            /**
             * 跳转：物流跟踪
             */
            gotoExpressTrack(){
                this.$router.push({
                    path: '/expressTrack',
                    query: {
                        orderNo: this.orderDetail.order.orderNo,
                        needRequest: true //是否需要请求接口获取物流详情
                    }
                })
            },
            /**
             * 跳转：多个包裹的信息页面
             */
            gotoPackageInfor(){
                this.$router.push({
                    path: '/packageInfor',
                    query: {
                        orderNo: this.orderDetail.order.orderNo
                    }
                })
            },
            /**
             * 跳转：发票详情
             */
            gotoInvoiceDetail(){
                this.$router.push({
                    path: '/invoice',
                    query:{
                        item:JSON.stringify(this.orderDetail.order)
                    }
                })
            },

            /**
             *更新倒计时时间 
             */
            updateLimitTime(time){
                this.limitTime = time;
            },
             /**
             * T信回退事件的注册回调 必须是goBackFun
             */
            goBackFun(backSteps){
                let pageFrom = this.$route.query.pageFrom || ""
                if(backSteps == 'home'){//表示回到首页
                    this.$router.push({
                        path: '/home'
                    })
                }else if(!!pageFrom && ('approval'==pageFrom || 'push'==pageFrom || 'customerService'==pageFrom)){//审批跳转过来的回退
                    extendUtils.goBackPage('');
                }else if(pageFrom.indexOf('/order/confirm') > -1){//下单后直接支付，支付流程中选择“查看订单详情”到本页面，本页面回退到订单列表
                    this.$router.replace({
                        path:'/order/list/all',
                        query:{
                            backSteps: 'home'
                        }
                    })
                }else{
                    this.$router.go(-backSteps);
                }
            },

            /**
             * 点击商品跳转到商品详情
             */
            gotoGoodDetail(item){
                if(item.productType!=0){return} //目前只有主商品才能跳转到详情页面，赠品和附件暂时不支持
                this.$router.push({
                    path: '/product/detail',
                    query:{
                        sku: item.sku,
                        supplierId:item.supplierId
                    }
                })
            },

             /**
             * 跳转到购物车页面
             */
            clickCartThumb(){
                this.$router.push({
                    path: "/cart"
                })
            },

            /**
             * 加入购物车，同时添加加入购物车的动画效果
             * @param product 需要加购物车的商品信息 
             */
            async setIntoCart($event, goods){
                let that = this;
                that.showCart = true;
                that.$nextTick(()=>{
                     //加入购物车的方法在全局混入里面globalMixin.js
                    that.setIntoShopCar(goods).then(flag => {
                        if(!!flag){ //加入购物车接口返回成功后，再执行动画
                            that.$nextTick(async ()=>{
                                let dom = await that.createGoodThumb($event, goods[0].imageUrl);
                                //延迟开始动画
                                let cartDom = that.$refs.cartThumb.$el;
                                let config = {target: dom, clone: false, zoomType:'linear'};
                                //创建动画对象
                                let animation = new AddCartAnimation(cartDom);
                                //1.闪烁
                                await animation.twinkleAnimation(dom);
                                //2. 抛物线运动
                                await animation.start($event, config);
                                //3. 购物车抖动
                                await animation.shakeAnimation(cartDom);
                                //4. +1动画
                                let text = `+${goods[0].quantity}`
                                await animation.addNumShow(cartDom, text);
                            })
                        }
                    }).catch(e => {
                        console.error('加入购物车失败====',e);
                    });
                })
                
            },

              /**
             * 创建一个用于动画的dom
             */
            createGoodThumb($event, url){
                return new Promise(resolve=>{
                    let clickDom = $event.target;
                    let copyDom = clickDom.parentNode.parentNode.parentNode.previousElementSibling;
                    let style = extendUtils.getStyle(copyDom);
                    let rect = copyDom.getBoundingClientRect();
                    let dom = document.createElement('img');
                    dom.src = url;
                    dom.style.width = parseFloat(style.width) * .6 + 'px';
                    dom.style.height = parseFloat(style.height) * .6 + 'px';
                    dom.style.borderRadius = dom.style.width;
                    dom.style.position = 'fixed';
                    dom.style.left = rect.left + parseFloat(style.width) * .2 + 'px';
                    dom.style.top = rect.top + parseFloat(style.height) * .2 + 'px';
                    dom.style.backgroundColor = '#fff';
                    dom.style.zIndex = '999';

                    function complete(){
                        document.body.appendChild(dom)
                        resolve(dom);
                    }

                    dom.onload = function(){
                        complete();
                    }
                    dom.onerror = function(){
                        complete();
                    }
                })
            },

            /**
             * 电话号码显示的脱敏处理
             * @param str 完整的电话号码字符串
             */
            dealxing(str){
                return extendUtils.sensitiveHide(str);
            },
            /**
             * 订单删除后处理列表数据
             * todu目前所有的订单详情都是从列表进入，如果后续流程有修改这里要适配
             */            
            deleteOrderCompleted(){
                if(!!this.$route.query.pageFrom && 'approval'==this.$route.query.pageFrom){//审批跳转过来的回退
                    extendUtils.goBackPage('');
                }else{//列表进入的回退
                    //保存已删除的订单号用于列表页删除对应数据
                    window.detletedOrder = this.orderDetail.order.orderNo;
                    this.$router.go(-1);
                }
            },
        }
    }

</script>

<style scoped lang="less">
  @import '~themes/default/styles/order/orderDetail/orderDetail.less';
</style>