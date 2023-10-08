<template>
    <div class="mine-wrap">
        
        <div>
            <div class="bgbox">
                <div v-if="showTab()" class="tab">
                    <div @click="clickItem(item, index)" class="item" :class="{active: item == supplierId}" v-for="(item, index) in supplierIdList" :key="index">{{supplierMap[item].name}}</div>
                </div>
                <section class="warp-item-section" :class="{btm1: showTab}">
                    <div v-for="(item, index) in orderStateList" :key="index" class="item-content" @click="gotoPage(item.link)">
                        <div class="icon-box">
                            <Icon :type='item.icon' size='.56'></Icon>
                            <numThumb v-if="item.num>0" :number="Number(item.num)"/>
                        </div>
                        <span class="item-content-text">
                            {{item.name}}
                        </span>
                        
                    </div>
                    <div class="item-content more-flex" @click="gotoPage('/order/list/all')">
                        <div class="left-shadow">
                            <Icon type='icon_mall_dingdan' size='.56'></Icon>
                            <span class="item-content-text">我的订单</span>
                        </div>
                        <span class="item-content-text-small">查看电子发票</span>
                    </div>
                </section>
            </div>
            <section class="section-mine">
                <div class="mine-item">
                    <Icon type='icon_mall_address' size='.44'></Icon>
                    <p @click="gotoPage('/address')" class="bt1px">
                        <span>地址管理</span>
                        <Icon type='icon_common_rightarrow' size='.24'></Icon>
                        </p>
                </div>
                <div class="mine-item">
                    <Icon type='icon_mall_collect_active' size='.44'></Icon>
                    <p @click="gotoPage('/favorite')" class="bt1px">
                        <span>我的收藏</span>
                        <Icon type='icon_common_rightarrow' size='.24'></Icon>
                    </p>
                </div>
                <div class="mine-item">
                    <Icon type='icon_mall_fapiaozhushou' size='.44'></Icon>
                    <p @click="gotoPage('/invoiceAssist')" class="bt1px">
                        <span>发票助手</span>
                        <Icon type='icon_common_rightarrow' size='.24'></Icon>
                    </p>
                </div>
                <div class="mine-item">
                    <Icon type='con_mall_service' size='.44'></Icon>
                    <p @click="gotoCustomerService">
                        <span>我的客服</span>
                        <Icon type='icon_common_rightarrow' size='.24'></Icon>
                    </p>
                </div>
            </section>
        </div>
    </div>
</template>
<script>
import extendUtils from 'common/lib/utils'
const Icon = ()=>import('common/components/base/Icon.vue');
import {getOrderStates, OrderState} from 'common/lib/enum/orderStatusEnum';
import afterSaleHandler from 'common/lib/requestHandler/afterSaleHandler';
import orderHandler from 'common/lib/requestHandler/orderHandler';
import numThumb from 'common/components/cartThumb/numThumb';
import tChatEventMixin from 'common/lib/mixin/tChatEventMixin';
import {authorize} from 'common/lib/requestHandler/authHandler';
import customerService from 'common/lib/customer-service/index.js'; //客服系统
export default {
    mixins: [tChatEventMixin],
    components:{
        Icon,
        numThumb
    },
    data() {
        return {
            orderStateList: [], 
            supplierId: '', //供应商id
            supplierIdList: [], // 供应商id的list 
            supplierMap: {}, // 供应商配置信息 在lib的config下
        };
    },
    // async created(){
    //     await extendUtils.authInterceptor(); //等待授权完成
    //     this.initData();
    // },
    async activated(){
        this.initData();
    },
    computed:{
       
    },

    methods: {
        /**
         * 初始换相关数据
         */
        async initData(){
            this.orderStateList = [
                // {
                //     name: OrderState.UNAPPROVAL.name,
                //     code: OrderState.UNAPPROVAL.code,
                //     icon: 'icon_mall_daishenpi',
                //     link: '/order/list/unapproval',
                //     num: 0,
                // },
                {
                    name: OrderState.UNPAID.name,
                    code: OrderState.UNPAID.code,
                    icon: 'icon_mall_daifukuai',
                    link: '/order/list/unpaid',
                    num: 0,
                },
                {
                    name: OrderState.UNRECEIVED.name,
                    code: OrderState.UNRECEIVED.code,
                    icon: 'icon_mall_daishouhuo',
                    link: '/order/list/unreceived',
                    num: 0,
                },
                {
                    name: '退换/售后',
                    code: 'change', //TODO退还售后暂用 change
                    icon: 'icon_mall_tuihuaishouhou',
                    link: '/order/afterSale/list',
                    num: 0,
                },
            ];
            //处理dealSupplierId
            this.dealSupplierId();
            //弹出授权的弹窗
            await this.initAuthorize();
            this.initEventAppBack(); //重新注册回退和刷新事件，因为授权会有自己的事件
            this.initApiFun();
        },

        // 是否显示tab
        showTab(){
            return this.supplierIdList.length >= 2;
        },

        // 点击供应商的每一项
        async clickItem(item, index){
            this.supplierId = item;
            let replaceUrl = `index.html#/mine?supplierId=${this.supplierId}&supplierIdList=${extendUtils.getUserPara('supplierIdList')}&t=${new Date().getTime()}`
            window.history.replaceState(null, '', replaceUrl);

            //弹出授权的弹窗
            await this.initAuthorize();
            this.initEventAppBack();
            this.initApiFun();
        },

        /****
         * 重新注册刷新回退事件 
         */
        initEventAppBack(){
            this.tChatEventAppBack(); //该方法在tChatEventMixin里面
            this.tChatEventRefresh(); //该方法在tChatEventMixin里面
        },

        // 通过接口获取订单数量
        initApiFun(){
            //获取订单服务订单个数统计
            this.getOrderStatistics();
            //查询售后服务正在处理的订单个数
            this.getMyServiceStatistics();
        },

        dealSupplierId(){
            this.supplierId = this.$route.query.supplierId;
            //通过url获取供应商id
            this.supplierIdList = [];
            let supplierIdQuery = extendUtils.getUserPara('supplierIdList');
            if(!!supplierIdQuery){ //如果该参数有值 说明是从商云我的商城条转过来的
                supplierIdQuery = decodeURIComponent(supplierIdQuery);
                document.title = '我的商城'; //更新title
                // this.$nextTick(()=>{ //将底部的footerdisplay none掉
                //     document.getElementsByClassName('footer')[0].style.display = 'none';
                // })
                this.supplierIdList = supplierIdQuery.split('|');
                this.supplierMap = this.BMallConfig.SUPPLIER_Map;
            }else{
                document.title = '我的'; //更新title
                this.supplierId = orderHandler.supplierId;
            }; 
        },

        // 初始化授权的弹窗
        initAuthorize(){
            return authorize({
                enableAgreement: true
            });
        },

        // 下路打刷新的回调
        // refresh(){
        //     this.initApiFun();
        // },

        /**
         * 获取订单服务订单个数统计
         */
        getOrderStatistics(){
            orderHandler.getOrderStatistics({
                supplierId: this.supplierId,
                userId: orderHandler.userId,
                companyId: orderHandler.companyId,
                channelId: orderHandler.channelId,
            }).then(res=>{
                if(res.resultCode == 0 && res.result && res.result.orderStatistics.length > 0){
                    let orderStatistics = res.result.orderStatistics;
                    this.orderStateList = this.orderStateList.map(item => {
                        let index = orderStatistics.findIndex(temp => {
                            return item.code == temp.orderState;
                        })
                        if(index > -1){
                            item = Object.assign({}, item, {num: orderStatistics[index].count})
                        }
                        return item
                    })
                }
            }).catch(e=>{
                console.log(e)    
            })
        },

        /**
         * 查询售后服务正在处理的订单个数
         */
        getMyServiceStatistics(){
            let param = {
                supplierId: this.supplierId,
                userId: orderHandler.userId,
                companyId: orderHandler.companyId,
                channelId: orderHandler.channelId,
                serviceStatus: 1, //1-待处理，2-已完成，3-全部  此处只查待处理的
            }
            afterSaleHandler.getMyServiceStatistics(param).then(res=>{
                if(res.resultCode == 0){
                    this.orderStateList.forEach(item => {
                        if(item.code == 'change'){//说明是'退换/售后'的接口数量
                            item.num = res.result.number;
                        }
                    })
                }
            }).catch(e=>{
                console.log(e)    
            })
        },



       
        //根据路由参数跳转对应路由页面
        gotoPage(path){
            this.$router.push({
                path: path,
                query: {
                    t: new Date().getTime(), //增加时间戳，保证session中的判断都是forward
                    supplierId: this.supplierId
                }
            })
        },

        /**
         * T信回退事件的注册回调 必须是goBackFun
         */
        goBackFun(){
            let supplierIdQuery = extendUtils.getUserPara('supplierIdList');
            if(!!supplierIdQuery){ //如果该参数有值 说明是从商云我的商城条转过来的
                extendUtils.goBackPage(null, 1);
            }else{
                this.$router.push({
                    path: "/index"
                });
            }
                               
        },

        //跳转到客服系统
        async gotoCustomerService(){  
            let url = await customerService.run(1).catch(e=>{
                console.log(e)
            });
            window.open(url);
            // extendUtils.openApplet({
            //     appId: this.BMallConfig.SUPPLIER_Map[goodsHandler.supplierId].appId,
            //     url,
            // });
        },
    }
};
</script>
<style scoped lang="less">
@import "~themes/default/styles/personal/personal.less";
</style>