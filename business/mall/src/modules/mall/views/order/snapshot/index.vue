<!--
    商品缩略图及相应的各个状态
-->
<template>
    <div class="order-detail-container">
        <loadingComp v-if="loading">数据加载中...</loadingComp>
        <!-- 审批过程中修改订单审批状态失败时不提示操作失败，只提示审批结果 -->
        <!-- <template v-else-if="operationFailed">
            <emptyPage emptyImg='DATA_FAIL' tips='操作失败，请'><a @click='refresh' class='refresh normal-btn'>重试</a></emptyPage>
        </template> -->
		<approveInfo :status="flowStatus" :isCanceled="isCanceled" @goBackFunction="goBackFun" v-else-if="!!flowStatus"></approveInfo>
        <template v-else-if='orderDetail'>
            <div class='content'>
                <div class='bottom-content'>
                    <div class='sub-content'>
                        <section class='goods-block' v-for='product in orderDetail.products' :key='product.sku'>
                            <!-- TODO 单类商品价格展示 productTotal字段  暂时用  数量*单价 -->
                            <thumb05 
                                :img='product.imageUrl' 
                                :goodsDesc='dealSpecificationKeys(product.specification)' 
                                :price='product.unitPrice' 
                                :productType='product.productType' 
                                :count='product.quantity' 
                                :title='product.name' 
                            >
                                <btnFactory type='afterSale' :product="product" :orderInfo='orderDetail.order'/>
                            </thumb05>
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
                                总金额：
                                <span class='amount'>
                                    <priceLabel :amount='orderDetail.order.paymentAmount' toFixed='2' :camelCase='false'/>
                                </span>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </template>
        <template v-else>
            <emptyPage emptyImg='DATA_FAIL' tips='查询订单详情失败，请'><a @click='reFresh' class='refresh normal-btn'>刷新</a></emptyPage>
        </template>


    </div>
</template>
<script>
    import extendUtils from 'common/lib/utils';
    import {getOrderStatus, OrderState} from 'common/lib/enum/orderStatusEnum';
    import {SnIcon} from 'sinosun-ui';
    const thumb05 = ()=>import('common/components/goodsThumb/thumb05');
    const btnFactory = ()=>import('common/components/orderBtn/btnFactory.vue');
    import priceLabel from 'common/components/base/priceLabel';
    import orderHandler from 'common/lib/requestHandler/orderHandler';
    import cartHandler from 'common/lib/requestHandler/cartHandler';
	import approveInfo from './components/approveInfo.vue';
    import tChatEventMixin from 'common/lib/mixin/tChatEventMixin';
    const emptyPage = ()=>import('common/components/base/emptyPage');
    const loadingComp = ()=>import('commonComp/base/LoadingComp.vue');
    import {FlowStatus} from 'common/lib/enum/orderStatusEnum';
    export default {
		mixins: [tChatEventMixin],
        components: {thumb05, SnIcon,priceLabel,btnFactory,approveInfo,emptyPage,loadingComp},
        data(){
            return Object.assign(extendUtils.stateManager.setData([
            ], this), {
				flowStatus:this.$route.query.flowStatus || null,//审批跳转过来的审批状态
                flowId:this.$route.query.flowId || null,//审批跳转过来携带的flowId
                applyPage:this.$route.query.applyPage || null,//购物车页面申请的采购还是提交订单页面提交的申请采购 applyPage == confirm 说明是从提交订单页面去申请采购的 applyPage == cart 说明是从购物车页面去申请采购的
                FlowStatusMap:FlowStatus,//审批状态枚举配置
                loading:false,//loading中
                orderDetail: null,//订单详情
                isCanceled:false,//订单是否已经取消
                operationFailed:false,//操作失败，展示缺省页
                applayData:{},//通过传递的参数key，用于通过app缓存读取数据以及传递信息
                isComplete:false,//页面是否完成了所有操作
                isSamePerson: false, //操作该审批单的人和申请审批单的人是否为同一人
            })
        },
        created(){
			//页面初始化
			this.initPage();
        },
        computed: {
  
        },
        filters: {
        },
        methods: {
		  /**
		   * 页面初始化
		   */
			initPage(){
                let that = this;
                //是否操作失败初始化
                that.operationFailed = false;
                //解析applayData数据
                if(!!that.$route.query.applayData && ''!=that.$route.query.applayData){
                   that.applayData =JSON.parse(Base64.decode(that.$route.query.applayData));
                }
                that.loading = true;
                //重定向后重新获取url上用户信息，审批人需要使用申请人的身份去访问
                // orderHandler.getBaseParams();
                //有审批状态，处理审批订单状态
                if(!!that.flowStatus && that.flowId){
                    that.changeOrderStatus(that.flowStatus,that.flowId)
                }else{//无审批状态，未查看订单详情
                    //获取订单状态
                    that.getOrderDetail();
                    document.title = "订单详情";
                }
            },
            /**
             * 获取订单详情
             */
            getOrderDetail(){
                let that = this;
                let param = {
                    orderNo: this.$route.params.orderNo,
                    userId: extendUtils.getUserPara('userId'),
                    companyId: extendUtils.getUserPara('companyId'),
                    channelId: extendUtils.getUserPara('channelId'),
                }
                that.loading = true;
                orderHandler.getOrderDetail(param, {notAssignUserParam: true}).then(function(res){
                    that.orderDetail = res.result;
                    that.orderDetail.order.products = that.orderDetail.products; 
                    that.loading = false;
                }).catch((e)=>{
                    that.loading = false;
                    console.error(e);
                })
            },
			/**
            * 根据审批进度修改订单状态
            *@param flowStatus 表单状态，0：审批中，1：审批通过 ， 2：审批不通过  ，3：撤销，
            *@param flowId 表单id
            */
			async changeOrderStatus(flowStatus,flowId){
                let that = this;

                let obj = await extendUtils.authInterceptor({userId: null});
                //通过userId判断是否操作人是否为同一人 同时必须是申请通过，因为还有可能是申请人撤销申请采购单
                if(obj.userId == that.applayData.applyUserId){
                    that.isSamePerson = true;
                }else{
                    that.isSamePerson = false;
                }

                if(that.getIsComplete() || false){
                    //页面已经完成所有操作
                    that.loading = false;
                    return;
                }
                
                if(1==flowStatus && obj.userId == that.applayData.applyUserId){//审批通过且是自审自批
                    //更新flowId
                    that.updateOrderDetail(flowStatus,flowId,true);
                    //申请通过后删除购物车对应商品
                    that.beforeDeleteGoods();
                }else if( 'UPDATA' == that.FlowStatusMap[flowStatus].actionType){//申请通过
                    //更新flowId
                    that.updateOrderDetail(flowStatus,flowId,false);
                    //申请通过后删除购物车对应商品
                    that.beforeDeleteGoods();
                }else{//他人审批通过、拒绝或撤销
                    //修改订单审批状态
                    that.updateOrderApproveState(flowStatus,flowId);
                }
                
            },
            /**
             * 更新订单存入flowId
             *@param flowStatus 表单状态
             *@param flowId
             *@param isNeedUpOrderStatu 是否需要更新订单状态
             */
            updateOrderDetail(flowStatus,flowId,isNeedUpOrderStatu){
                let that = this;
                let param = {
                    applyUserId:that.applayData.applyUserId,
                    orderNo:that.$route.params.orderNo,
                    flowId:flowId,
                }
                orderHandler.updateOrderDetail(param).then((res)=>{
                    if(!!isNeedUpOrderStatu){
                        //修改订单审批状态
                        that.updateOrderApproveState(flowStatus,flowId);
                    }else{
                        that.loading = false;
                    }
                }).catch((err)=>{
                    that.operationFailed = true;
                    that.loading = false;
                    console.log(err)
                    //操作失败也继续往后走，触发推送日志告知用户操作失败
                    if(!!isNeedUpOrderStatu){
                        //修改订单审批状态
                        that.updateOrderApproveState(flowStatus,flowId);
                    }
                });
            },
			/**
            * 修改审批订单状态
            *@param flowStatus 表单状态
            *@param flowId 表单id
			*/
            updateOrderApproveState(flowStatus,flowId){
                let that = this;
                //flowStatus 表单的状态，0：审批中，1：审批通过 ， 2：审批不通过  ，3：撤销，
                if('UPDATEAPPROVESTATE' == that.FlowStatusMap[flowStatus].actionType){//审批通过、不通过、撤销
                    let content = JSON.stringify({"flowStatus":parseInt(flowStatus),"flowId":parseInt(flowId)});
                    let param = {
                        applyUserId:that.applayData.applyUserId,
                        orderNo:that.$route.params.orderNo,
                        formState:that.FlowStatusMap[flowStatus].formState,
                        formNo:flowId,
                        signData:that.$route.query.signData,
                        content:content
                    }
                    //更新审批订单状态
                    orderHandler.updateOrderApproveState(param).then((res)=>{
                        that.loading = false;
                        //存储页面操作完成
                        that.setIsComplete();
                    }).catch((err)=>{
                        that.operationFailed = true;
                        that.loading = false;
                        console.log(err)
                    });
                }
            },
            /**
             * 从购物车列表删除商品
             */
            beforeDeleteGoods(){
                let that = this;
                //获取缓存的商品数据
                let obj = {
                    "type":"string",//存储数据类型
                    "key":this.$route.query.applayData,//存储的key
                    // "fileName":that.BMallConfig.APPSTORAGE_FILENAME,//文件名
                    // "defValue":''
                }
                extendUtils.getPropertyFunction(obj).then((res)=>{
                    let data = JSON.parse(res.value);
                    //删除购物车对应的商品
                    that.deleteGoodsFromCartList(data.products);
                }).catch((err)=>{
                    console.log(err)
                })
            },  
            /**
             * 从购物车列表删除商品
             * @param {*} param 参数
             */
            deleteGoodsFromCartList(products){
                let that = this;
                //审批成功后删除购物车对应的商品
                let deleteList = [];
                products.forEach(item => {
                    deleteList.push(
                        {
                            "sku": item.sku,
                            "supplierId": item.supplierId
                        }
                    )
                })
                let param = {
                    "userId": that.applayData.applyUserId,
                    "companyId": that.applayData.companyId,
                    "channelId": that.applayData.channelId,
                    "delAll":false,
                    "goods":deleteList,
                    "supplierId":cartHandler.supplierId
                }
                cartHandler.deleteGoodsFromCartList(param).then(data=>{
                    if(data.resultCode == 0){
                        console.log('删除成功')
                    }
                }).catch(rej => {
                    console.log('rej === ', rej);
                });
            },
            /**
             * 存储操作完成数据
             */
            setIsComplete(){
                let that = this;
                let key = that.$route.params.orderNo+'_'+that.flowStatus+'_isComplete';
                extendUtils.setSession(key,'isComplete')
            }, 
            /**
             * 获取操作完成数据
             */  
            getIsComplete(){
                let that = this;
                let key = that.$route.params.orderNo+'_'+that.flowStatus+'_isComplete';
                return 'isComplete' == extendUtils.getSession(key)
            },        
            /**
             * 代理函数：获取订单状态对象
             */
            getOrderStatus(code){
                return getOrderStatus(code)
            },      
            /**
             * 页面刷新入口函数 mescroll刷新回调
             */
            reFresh(){
                this.initPage();
            },
            /**
             * T信回退事件的注册回调 必须是goBackFun
             */
            goBackFun(){
                //被注释掉的是原采购申请逻辑。 现在这个页面给公款转账使用，仅需关闭当前页面即可。

                // //提交订单页面申请采购过来的话，只需要判断参数applyPage == 'confirm'和审批人和申请人是否为同一个人（this.isSamePerson==true）即可，其他情况均需要会退两步
                // if(!!this.applyPage && this.applyPage == 'confirm' && !!this.isSamePerson){ //提交订单页面的申请采购
                //     this.$router.push({
                //         path: '/order/list/all',
                //         query: {
                //             middlePage: true, //该参数只用来表示从商城页面出发，有中间页面，在回到商城页面。此时统一关闭浏览器‘sswbv_close_browser’
                //             t: new Date().getTime()//增加时间戳，保证session中的判断都是forward
                //         }
                //     })
                // }else{ //购物车页面的申请采购
                //     let loadData = 'tripReturn';
                //     extendUtils.goBackPage(null, 2, loadData);
                // }               
                    extendUtils.goBackPage();
            },            
        }
    }
</script>
<style scoped lang="less">
  @import '~themes/default/styles/order/orderDetail/orderDetail.less';
</style>