<template>
    <div class="orderDetail">
        <LoadingX v-if="querying" tipsText='数据加载中'/>
        <template v-else>
            <EmptyX v-if="expressOrderDetail == {}" tipsText='暂无快递订单信息'/>
            <template v-else>
                <div class="orderDetailWrap">
                    <div class="topWrap">
                        <div class="topTit">
                            <div class="leftImg" v-bind:style="{backgroundImage: 'url(' + expressCompanyMap[expressOrderDetail.expressCompanyInfo.expressCompanyCode].src + ')'}"></div>
                            <div class="rightText">{{expressOrderDetail.expressCompanyInfo.expressCompanyName}}</div>
                        </div>
                        <div class="orderTypeWrap">
                            <div class="topOrderType" :class="orderTypeData[status].orderTypeClass">{{orderTypeData[status].detailText}}</div>
                            <div class="orderTypeInfo" v-if="'waitToAccept' == orderTypeData[status].detailType">正在为您联系附近的快递小哥，请稍等</div>
                            <div class="orderTypeInfo" v-if="'accept' == orderTypeData[status].detailType" v-html="getAcceptText()"></div>
                            <div class="orderTypeInfo cursorp" v-if="'tranSporting' == orderTypeData[status].detailType" @click="openDetail">
                                <div class="order_textWrap">
                                    <div class="textLeft" :class="(expressTypeData[expressDetail.expressStatus || ''] || {}).typeClass || ''"></div>
                                    <div class="textMid">
                                        <div class="textInput" v-html="getTimeLineText(expressDetail.expressLocationDesc)"></div>
                                    </div>
                                    <div class="textRight">
                                        <div class="textRightBut cursorp arrow"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="orderTypeInfo" v-if="'cancel' == orderTypeData[status].detailType">取消时间：{{expressOrderDetail.expressStatusAndTime[0].time}}</div>
                        </div>
                        <div class="cancelOrderButWrap">
                            <span class="cancelOrderBut normal-btn" v-if="orderTypeData[status].showCancel" @click="cancelExpressOrder">取消订单</span>
                            <span class="reOrderBut normal-btn" v-if="orderTypeData[status].showReBut"  @click="reCreateOrder">重新下单</span>
                        </div>
                    </div>
                    <div class="contectWrap">
                        <div class="contectTit">订单信息</div>
                        <div class="contectGroup lineDashedB pb15">
                            <textDetail :label="'寄件地址'" :text="expressOrderDetail.senderInfo.name+' '+expressOrderDetail.senderInfo.phone" :tips="expressOrderDetail.senderInfo.area+expressOrderDetail.senderInfo.address"></textDetail>
                            <textDetail :label="'收件地址'" :text="expressOrderDetail.receiverInfo.name+' '+expressOrderDetail.receiverInfo.phone" :tips="expressOrderDetail.receiverInfo.area+expressOrderDetail.receiverInfo.address"></textDetail>
                        </div>
                        <div class="contectGroup lineDashedB pt15 pb15">
                            <textDetail :label="'物品信息'" :text="expressOrderDetail.cargoInfo.name+'/'+expressOrderDetail.cargoInfo.weight+'公斤'"></textDetail>
                            <textDetail :label="'快递'" :text="expressOrderDetail.expressCompanyInfo.expressCompanyName"></textDetail>
                            <textDetail :label="'上门时间'" :text="getStartAndEndTime()"></textDetail>
                            <textDetail :label="'留言'" :text="expressOrderDetail.remark"></textDetail>
                        </div>  
                        <div class="contectGroup pt15">
                            <textDetail :label="'订单编号'" :text="expressOrderDetail.expressOrderNo"></textDetail>
                            <textDetail :label="'下单时间'" :text="expressOrderDetail.expressOrderTime"></textDetail>
                        </div>                               
                    </div>
                </div>
            </template>
        </template>                
    </div>
</template>
<script>
import LoadingX  from "components/loading/LoadingX.vue";
import EmptyX from "components/empty/EmptyX.vue";
import expressHandler from './js/expressHandler.js';
const textDetail = ()=>import('./comp/textDetail.vue');
import {expressCompanyData,orderTypeMap,expressTypeMap} from './enum/expressEnum.js';
export default {
    mixins: [expressHandler.mixin.tChatEventMixin],
    components: {
        textDetail,
        LoadingX,
        EmptyX
    },
    data() {
        return {
            expressCompanyMap:expressCompanyData,//快递公司本地配置，logo地址等
            orderTypeData:orderTypeMap,//订单类型配置数据
            expressTypeData:expressTypeMap,//物流状态配置信息Map
            querying:false,//数据加载中
            expressOrderNo:this.$route.query.expressOrderNo || '',//物流快递ID
            expressOrderDetail:{},//快递订单数据
            expressDetail:{},//最新快递动态
            status:'',//订单状态
            expressCompanyNo:'',//快递公司ID
            expressCompanyCode:'',//快递公司Code
        };
    },

    created() {
        let _this = this;
        _this.initData();
    },
    mounted() {
    },
    methods: {
        /**
         * 页面初始化
         */	
        initData(){
            let _this = this;
            _this.getExpressOrderDetail();
        },
        /**
        * T信回退事件的注册回调 必须是goBackFun
        */
        goBackFun(){
            this.$router.back();            
        },
        /**
         * 查询订单详情
         */	
        getExpressOrderDetail(){
            let _this = this;
            let parma = {
                expressOrderNo:_this.expressOrderNo,
            }
            _this.querying = true;
            expressHandler.getExpressOrderDetail(parma).then((res) => {
                _this.querying = false;
                if (res.resultCode == 0) {
                    _this.expressOrderDetail = res.result.expressOrderDetail;
                    _this.expressDetail = res.result.expressOrderDetail.expressDetails[0] || {};
                    _this.status = (_this.expressOrderDetail.expressStatusAndTime[0] || {}).status || '';
                    _this.expressCompanyNo = _this.expressOrderDetail.expressCompanyInfo.expressCompanyNo;
                    _this.expressCompanyCode = _this.expressOrderDetail.expressCompanyInfo.expressCompanyCode;
                    console.log(res.result.expressOrderDetail)
                }else{
                    expressHandler.showConfirm('暂未查到与您单号相关的物流信息，请稍后再尝试查询', function(){}, 1, null, '确定', null, null, true);
                }
            }).catch((err) => {
                _this.querying = false;
                console.log(err);
            }); 
        },
        /**
         * 获取已接单待揽件文字描述
         */
        getAcceptText(){
            let _this = this;
            let res = '快递员 ';
            let dayName = _this.getDayName(_this.expressOrderDetail.sendStartTime) || '';
            if(!!_this.expressOrderDetail.expressContactPhone && '' != _this.expressOrderDetail.expressContactPhone){
                res+='(<span class="phone">联系电话：'+_this.expressOrderDetail.expressContactPhone+'</span>)';
            }
            res+=' 将在 '+dayName+new Date(new Date(_this.expressOrderDetail.sendStartTime).getTime()).format('HH:mm')+'-'+new Date(new Date(_this.expressOrderDetail.sendEndTime).getTime()).format('HH:mm')+' 前来揽件';
            return res;
        },
        /**
         * 获取日期文字描述，今天、明天、后天
         */
        getDayName(val){
            var val = new Date(val).getTime();
            var time = new Date(val);
            if(new Date(val).toDateString() == new Date().toDateString()){
                return '今天'
            }
            if(new Date(val).toDateString() == new Date(new Date().getTime()+24*60*60*1000).toDateString()){
                return '明天'
            }
            if(new Date(val).toDateString() == new Date(new Date().getTime()+24*60*60*1000*2).toDateString()){
                return '后天'
            }
        },
        getStartAndEndTime(){
            let _this = this;
            let res = '';
            res = new Date(new Date(_this.expressOrderDetail.sendStartTime).getTime()).format('MM月dd日 HH:mm')+'-'+new Date(new Date(_this.expressOrderDetail.sendEndTime).getTime()).format('HH:mm')
            return res;
        },
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
         * 取消订单
         * 
         */	        
        cancelExpressOrder(item){
            let _this = this;
            expressHandler.showConfirm('确认取消快递订单吗？', function(){
                let parma = {
                    expressOrderNo:_this.expressOrderNo,
                }              
                expressHandler.cancelExpressOrder(parma).then((res) => {
                    if (res.resultCode == 0) {
                        expressHandler.showToast('取消成功')
                        _this.initData();
                    }
                }).catch((err) => {
                    console.log(err);
                });
            }, 2, '取消', '确认', null, null, true);
        }, 	 	
        /**
         * 重新下单
         * 
         */	
        reCreateOrder(){
            let _this = this;
            let createOrderDetail = {
                'expressCompanyInfo':_this.expressOrderDetail.expressCompanyInfo,
                'senderInfo':_this.expressOrderDetail.senderInfo,
                'receiverInfo':_this.expressOrderDetail.receiverInfo,
                'cargoInfo':_this.expressOrderDetail.cargoInfo,
                'remark':_this.expressOrderDetail.remark
            }
            expressHandler.setSession('createOrderDetail',JSON.stringify(createOrderDetail))
            _this.gotoPage('/order/confirm',{'pageFrom':'orderDetail'})
        },	
        /**
         * 跳转物流详情页面
         * 
         */	
        openDetail(){
            let _this = this;
            _this.gotoPage('/detail/express',{'outerExpressOrderNo':_this.expressOrderDetail.outerExpressOrderNo,'expressCompanyNo':_this.expressCompanyNo,'expressCompanyCode':_this.expressCompanyCode,phoneNo:_this.expressOrderDetail.senderInfo.phone})
        
        },         	
        /**
         * 跳转页面
         * 
         */	        
        gotoPage(url,queryData){
            let _this = this;
            _this.$router.push({
                path: url, 
                query: queryData || {}
            })                 
        },     
    }
};
</script>
<style scoped lang="less">
@import '~themes/default/styles/expressServer/orderDetail.less';
</style>