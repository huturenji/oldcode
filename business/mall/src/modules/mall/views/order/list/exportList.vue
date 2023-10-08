<!--
    商品缩略图及相应的各个状态
-->
<template>
    <div class="order-list-container">
        <div class="search-container">
            <div class='condition'>
                <div class='search-block icon-btn'>
                    <div class="search-container">
                        <div class="search-box">
                                <div class="input-part">
                                    <Icon type='icon_search' class="icon-search" size='.32'></Icon>
                                    <form action="javascript:true">
                                        <input type="text" placeholder="商品名称/商品编号/订单号" ref="searchInputDom" @keyup.13="search()" @focus ="showSearchBtn=true" @blur="blurFun()" v-model="keyword">
                                    </form>
                                    <span class="icon-close" @click="keyword=''" v-show="keyword!='' && !!keyword">
                                        <Icon type='search_close' size=".32"  />
                                    </span>
                                </div>
                            <div v-if="keyword!='' && !!keyword && showSearchBtn" @click="searchAction" class="search-btn">搜索</div>
                            <div v-if="!(keyword!='' && !!keyword) && showSearchBtn" @click="cancelAction" class="cancle-btn">取消</div>
                        </div>
                    </div>
                </div>
                <div class="filter icon-btn cursorp" @click="showFilterBlock=!showFilterBlock" v-show="!showSearchBtn">
                    <span class="filter-content">{{filterName}}</span>
                    <Icon :type="showFilterBlock?'icon_common_uparrow':'icon_common_downarrow'" class="icon" size='.24'/>
                </div>
            </div>
        </div>     
        <div class="filter-selectWrap">
            <div class="search-mask" v-show='showFilterBlock' @click='showFilterBlock = false'></div>
            <div class="filter-select" v-if="showFilterBlock">
                <div class="header">
                    <Icon type="filter" class="icon" size='.3'/>
                    <span class="filter-content">全部</span>
                </div>
                <div class="itemsWrap">
                    <div class="item normal-btn" :class='{"selected": supplierIdChecked(item.key)}' v-for="(item, index) in supplierIdListMap" :key="index" @click="choosedItem(item)">
                        <span class="itemName">{{item.name}}</span>
                        <Icon class="filterActive" type='icon_mall_select' size='.36' v-if="supplierIdChecked(item.key)"/>
                    </div>
                </div>
            </div>  
        </div>
        <div class='list'>
            <mescrollVue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
                <div id='orderList'>
                    <div class='item cursorp normal-btn' 
                        v-if='order.products && order.products.length>0'
                        v-for='(order, index) in orderList' 
                        :key='index'  
                    >   
                        <multiDel @click.native="clickCheckItem(order)">
                            <multiDelItem>
                                <thumb09 :order='order'></thumb09>
                                <!-- 左侧的选择checkbox -->
                                <template slot="left-check">
                                    <checkButton :isChecked="checkOrderChoosed(order.orderNo)"></checkButton>
                               </template>
                            </multiDelItem>
                        </multiDel>
                    </div>
                </div>
            </mescrollVue>
        </div>
        <div class="choosedListWrap" v-if="showChoosed">
            <div class="choosedTit">已选择要导入的费用明细</div>
            <div class="closeBut normal-btn" @click="showChoosed=false"><Icon type="btn_common_close" class="icon" size='.22'/></div>
            <div class="choosedDataList">
                <div class='orderList'>
                    <emptyPage tips="未选择费用明细" v-if="choosedOrder.length <= 0"></emptyPage>
                    <div class='item cursorp normal-btn' 
                        v-for='(order, index) in choosedOrder' 
                        :key='index'  
                    >   
                        <multiDel>
                            <multiDelItem :showCheck="false" :showDel="true">
                                <thumb09 :order='order'></thumb09>
                                <!-- 删除del -->
                                <template slot="right-del" >
                                    <Icon type="icon_common_close" @click.native="delOrder(order.orderNo)" class="icon" size='.42'/>
                                </template>
                            </multiDelItem>
                        </multiDel>
                    </div>
                </div>
            </div>
        </div>
        <div class='foot-bar'>
            <div class="sumWrap" @click="showChoosed=!showChoosed">
                <span class="rightText">已选择:{{choosedOrder.length || 0}}笔</span>
                <Icon :type="showChoosed?'icon_common_downarrow':'icon_common_uparrow'" class="icon" size='.24'/>
            </div>
            <div class='price'>
                <div class="sumText">总计:</div>
                <priceLabel :class="{sizeL:totalPrice>9999999}" class='price-label' :amount='totalPrice'/>
            </div>
            <div class='btn cursorp normal-btn' @click='confirm'>确定</div>
        </div>
    </div>
</template>
<script>
    import priceLabel from 'common/components/base/priceLabel'
    import extendUtils from 'common/lib/utils';
    import orderHandler from 'common/lib/requestHandler/orderHandler.js';
    import {getOrderStates, OrderState} from 'common/lib/enum/orderStatusEnum';
    import tChatEventMixin from 'common/lib/mixin/tChatEventMixin';
    import mescrollMixin from 'common/lib/mixin/mescrollMixin';
    import thumb09 from 'common/components/goodsThumb/thumb09.vue';
    import {multiDel, multiDelItem, checkButton } from 'common/components/multiDel'; //批量选择的组件
    const Icon = ()=>import('common/components/base/Icon.vue');
    const emptyPage = ()=>import('commonComp/base/emptyPage.vue');
    export default {
        mixins: [mescrollMixin,tChatEventMixin],
        components: {thumb09, multiDel, multiDelItem, checkButton, priceLabel,Icon,emptyPage},
        data(){
            let orderNos = extendUtils.getUserPara('orderNos');
            let checkedOrderArr = [];
            if(!!orderNos){
                checkedOrderArr = orderNos.split('|');
            }
            return Object.assign(extendUtils.stateManager.setData([
            ], this), {
                mescrollUp: {
                    empty: {
                        warpId: 'orderList'
                    },
                    page: {
                        num: 0,
                        size: 10 //订单这里的分页是每页显示10条
                    },
                },
                orderList: [],//订单列表
                checkedOrderArr: checkedOrderArr,//已选择的订单
                showFilterBlock: false,//是否显示筛选框
                keyword:null,//搜索关键字
                supplierIdListMap:[],//供应商列表
                choosedSupplierId:[null],//选中的供应商id列表
                choosedSupplierIdParam:[],//参与数据请求的参数列表
                choosedOrder:[],//选中的数据
                showChoosed:false,//展示选中的数据
                isinit:true,//页面初始化
                showSearchBtn:false,//搜索框是否显示文字按钮
                filterName:'全部',//筛选按钮名字
                maxNum:50,//最多选择50条
            })
        },
        computed: {
            totalPrice(){
                let totalPrice = 0;
                this.choosedOrder.forEach(order=>{
                    totalPrice += order.paymentAmount * 100;
                })
                return totalPrice / 100;
            },
        },
        created(){
                this.supplierIdListMap = this.BMallConfig.supplierIdMap.supplierIdList.map((item)=>{
                    return {key:item,name:this.BMallConfig.SUPPLIER_Map[item].name}
                });
                this.supplierIdListMap.unshift({key:null,name:'全部'})
        },     
        methods: {
            /**
             * 初始化分页数据
             */
            initOrderPage(){
                this.orderList = [];
                this.mescroll.resetUpScroll();
            },
            /**
             * 搜索
             */
            search(){
                this.initOrderPage();
            }, 
            /**
             * 搜索动作
             */
            searchAction(){
                this.search()
            },  
            /**
             * 取消动作
             */
            cancelAction(){
                this.showSearchBtn = false;
                this.search();
            },   
            /**
             * 失去焦点动作
             */ 
            blurFun(){
                let that = this;
                //blur事件会第一时间执行，添加延迟为保证优先触发搜索、取消、删除等操作
                setTimeout(() => {
                    that.showSearchBtn = false;
                }, 150);
            },        
            /**
             * 根据商品分类id查询B+平台商品列表和详情 mescroll回调
             * @param page 分页对象，由mescroll提供
             * @param mescroll mescroll对象
             */
            async getListData(page, mescroll){
                let that = this;
                try{
                    let userId = extendUtils.getUserPara('userId');
                    await extendUtils.authInterceptor();
                    let tchatUserInfo = authorization.getTchatUserInfo();
                    //如果银企通传过来的userId不是当前用户，则不显示订单
                    if(!!userId && decodeURIComponent(userId)!=tchatUserInfo.uaId){
                        mescroll.endByPage(0, 0);
                        return;
                    }
                    try {
                        if(that.isinit && that.checkedOrderArr.length >0){
                            that.choosedOrder = await that.searchOrderListByOrderNoList(that.checkedOrderArr);
                        }
                    } catch (error) {
                        
                    }
                    let data = await this.searchOrderList(page);
                    let list = data.result.orders;
                    this.orderList.push(...list);
                    mescroll.endByPage(list.length, data.result.pages);
                }catch(e){
                    console.error(e);
                    mescroll.endErr();
                }
            },

             /**
             * 获取订单列表的数据
             * @param page 分页的对象
             */
            searchOrderList(page){
                let that = this;
                return new Promise((resolve, reject) => {
                    let param = {
                        channelId: orderHandler.channelId,
                        companyId: orderHandler.companyId,
                        userId: orderHandler.userId,
                        queryExt: {
                            ext: that.keyword,
                            orderState: 5,
                        },
                        sortType:1,//表示按支付时间倒序
                        pageNum: page.num,
                        pageSize: page.size,
                    }
                    if(that.supplierIdChecked(null) || 0 == that.choosedSupplierId.length){//全选供应商
                        param = Object.assign({},param,{supplierIds:that.BMallConfig.supplierIdMap.supplierIdList})
                    }else{
                        param = Object.assign({},param,{supplierIds:that.choosedSupplierId})
                    }
                    orderHandler.getOrderList(param).then(res=>{
                        resolve(res);
                    }).catch(e=>{ 
                        console.log(e);
                        reject();
                    })
                })
            },
             /**
             * 获取订单列表的数据
             * @param page 分页的对象
             */
            searchOrderListByOrderNoList(orderNoList){
                let that = this;
                that.isinit = false;
                return new Promise((resolve, reject) => {
                    let param = {
                        channelId: orderHandler.channelId,
                        companyId: orderHandler.companyId,
                        userId: orderHandler.userId,
                        // supplierId:orderHandler.supplierId,
                        queryExt: {
                            ext: '',
                            orderState: 5,
                        },
                        orderNoList:orderNoList,
                        sortType:1,//表示按支付时间倒序
                        pageNum: 1,
                        pageSize: 999,
                    }
                    orderHandler.getOrderList(param).then(res=>{
                        let tempList = [];
                        if(!!res.result){
                            res.result.orders.forEach((item)=>{
                                let index = orderNoList.findIndex(temp => {
                                    return temp == item.orderNo;
                                })
                                if(index>-1){
                                    tempList.push(item);
                                }
                            })
                        }
                        resolve(tempList);
                    }).catch(e=>{ 
                        console.log(e);
                        reject([]);
                    })
                })
            },
            /** 
            * 当为编辑状态的时候此时只操作选中与否
            */
            clickCheckItem(item){
                let that = this;
                let index = that.choosedOrder.findIndex(temp => {
                    return temp.orderNo == item.orderNo;
                })
                if(index>-1){
                    that.choosedOrder.splice(index, 1);
                }else{
                    if(that.choosedOrder.length >= that.maxNum){
                        extendUtils.showToast('最多选择'+that.maxNum+'条');
                        return;
                    }
                    that.choosedOrder.push(item);
                }
            },
            /**
             * 删除订单
             */ 
            delOrder(orderNo){
                let that = this;
                let index = this.choosedOrder.findIndex(temp => {
                    return temp.orderNo == orderNo;
                })
                that.choosedOrder.splice(index, 1);
            },
            /**
             * 订单是否被选中
             */  
            checkOrderChoosed(orderNo){
                let res = false;
                let index = this.choosedOrder.findIndex(temp => {
                    return temp.orderNo == orderNo;
                })
                if(index>-1){
                    res = true;
                }else{
                    res = false;
                }
                return res;
            },
            /**
             * 保存
             */             
            confirm(){
                let result = [];
                this.choosedOrder.map(order=>{
                    result.push({
                        orderNo: order.orderNo, //订单号
                        orderTime: order.createTime, //下单时间
                        pName: order.products ? order.products.map(p=>{
                            return p.name;
                        }) : [], //商品名称
                        orderMoney: order.paymentAmount * 100, //订单金额（单位：分）
                        payNo: order.paymentFlowNo, //支付单号
                        payMethod: order.paymentType //订单支付方式 如 1.老板付 2.微信 3.支付宝 等等
                    })
                })
                let loadData = {
                    orderList: result,
                    uniqueId: extendUtils.getUserPara('uniqueId')
                };
                loadData = JSON.stringify(loadData);
                extendUtils.goBackPage('', 1, loadData);  
            },
            /**
             * 判断订单类型是否被选中
             */
            supplierIdChecked(supplierId){
                return this.choosedSupplierId.indexOf(supplierId)>-1
            },
            /**
             * 选中筛选中的供应商类型
             */
            choosedItem(item){
                this.choosedSupplierId = [item.key];
                this.filterName = item.name;
                this.filter();
            }, 
            filter(){
                this.showFilterBlock = false;
                this.initSearch();
            },  
            /**
             * 筛选
             */  
            initSearch(){
                this.orderList = []
                this.mescroll.resetUpScroll();
            },                          
             /**
             * 页面刷新入口函数 mescroll刷新回调
             * @param mescroll对象
             */
            re_fresh(mescroll){
                //mescroll在刷新时，会显示上拉分页的loading，这里隐藏掉
                try{
                    let loadingDom = document.getElementsByClassName('mescroll-upwarp');
                    if(loadingDom && loadingDom.length>0){
                        loadingDom = loadingDom[0];
                        loadingDom.style.visibility='hidden';
                    }
                }catch(e){
                    console.error(e);
                }
                this.initOrderPage();
            },
            /**
             * T信回退事件的注册回调 必须是goBackFun
             */
            goBackFun(backSteps){
                extendUtils.goBackPage();
            },
        }
    }

</script>
<style scoped lang="less">
  @import '~themes/default/styles/order/orderList/exportList.less';
</style>
<style lang='less'>
  @import '~themes/default/styles/components/mescroll.less';
</style>