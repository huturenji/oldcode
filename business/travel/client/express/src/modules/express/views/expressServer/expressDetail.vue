<template>
    <div class="expressDetail">
        <LoadingX v-if="querying" tipsText='数据加载中'/>
        <template v-else>
            <EmptyX v-if="!(!!expressOrderDetail && !!expressOrderDetail.expressCompanyInfo)" tipsText='暂无快递物流信息'/>
            <template v-else>
                <div class="expressDetailInWrap">
                    <div class="topOutWrap">
                        <div class="iconTypeWrap" v-if="3==expressOrderDetail.expressCompanyInfo.expressCompanyCode">
                            <div class="icon" v-bind:style="{backgroundImage: 'url(https://cdn.kuaidi100.com/images/all/56/' + expressOrderDetail.expressCompanyInfo.expressCompanyNameEn + '.png)'}"></div>
                            <div class="text" >{{outExpressCompanyMap[expressOrderDetail.expressCompanyInfo.expressCompanyNameEn]}}</div>
                        </div>
                        <div class="iconTypeWrap" v-else>
                            <div class="icon" v-bind:style="{backgroundImage: 'url(' + expressCompanyMap[expressOrderDetail.expressCompanyInfo.expressCompanyCode].src + ')'}"></div>
                            <div class="text">{{expressOrderDetail.expressCompanyInfo.expressCompanyName}}</div>
                        </div>
                        <div class="textWrap">
                            <span>运单号</span>
                            <span class="expressNum">{{expressOrderDetail.outerExpressOrderNo}}</span>
                            <span class="copy normal-btn" @click="copyExpressNo">复制</span>
                        </div>
                        <div class="bottomTextWrap cursorp" @click="goReimburseDetail" v-if="'express' == pageFrom && !!flightOrderNo">
                            <div class="bottomText normal-btn">机票报销凭证</div>
                        </div>
                    </div>
                    <div class="contectWrap">
                        <div class="expressTypeWrap">
                            <div class="linebg"></div>
                            <div class="typeNameWrap">
                                <div class="typeName" :class="{active:item.type == status}" v-for="(item,index) in expressTypeList" :key="index">
                                    <div class="typeitem" :class="item.iconClass">{{item.text}}</div>
                                </div>
                            </div>
                        </div>
                        <div class="buttonGroup">
                            <div class="courierItem normal-btn" :class="{active:(expressTypeData[status] || {}).canContact || false}" @click="callNativeTel(expressOrderDetail.expressContactPhone || '','courier')">联系快递员</div>
                            <div class="phoneItem normal-btn" @click="callNativeTel(expressOrderDetail.expressCompanyInfo.expressCompanyPhone || '','company')">联系快递客服</div>
                        </div>
                        <div class="timeLineWrap">
                            <EmptyX v-if="expressOrderDetail.expressDetails.length == 0" tipsText='暂无物流信息'/>
                            <div class="timeLine" :class="(expressTypeData[item.expressStatus]|| {}).typeClass || ''" v-for="(item,index) in expressOrderDetail.expressDetails" :key="index">
                                <div class="timeLineTextWrap">
                                    <div class="timeLineText" v-html="getTimeLineText(item.expressLocationDesc)"></div>
                                    <div class="timeLineTips">{{item.expressLocationTime}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </template>
    </div>
</template>
<script>
import LoadingX from "components/loading/LoadingX.vue";
import EmptyX from "components/empty/EmptyX.vue";
import expressHandler from './js/expressHandler.js';
import {expressTypeList,expressCompanyData,expressTypeMap,outExpressCompanyData} from './enum/expressEnum.js';
export default {
    mixins: [expressHandler.mixin.tChatEventMixin],
    components: {
        LoadingX,
        EmptyX
    },
    data() {
        return {
            expressCompanyMap:expressCompanyData,//快递公司本地配置，logo地址等
            outExpressCompanyMap:outExpressCompanyData,//快递100所属快递公司本地配置，logo地址等
            expressTypeList: expressTypeList,//物流状态配置信息
            expressTypeData:expressTypeMap,//物流状态配置信息Map
            pageFrom: this.$route.query.pageFrom || '',//页面跳转来源
            outerExpressOrderNo:this.$route.query.outerExpressOrderNo || '',//物流单号
            expressCompanyNo:this.$route.query.expressCompanyNo || '',//物流公司ID
            expressCompanyCode:this.$route.query.expressCompanyCode || '',//物流公司Code
            expressOrderDetail: {},//物流详情
            querying:false,//数据加载中
            flightOrderNo:'',//报销凭证订单号
            phoneNo:this.$route.query.phoneNo || '',//寄件人手机号
            status:'',//物流状态
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
         * 页面数据初始化
         */
        initData() {
            let _this = this;
            if(_this.querying){
                return;
            }
            _this.querying = true;
            if('queryExpress' == _this.pageFrom){
                _this.querying = false;
                _this.expressOrderDetail = JSON.parse(expressHandler.getSession('expressOrderDetail'));
                _this.status = (_this.expressOrderDetail.expressDetails[0] || {}).expressStatus || '';
            }else{
                _this.getExpressDetail();
            }
        },
        /**
        * T信回退事件的注册回调 必须是goBackFun
        */
        goBackFun(){
            this.$router.back();            
        },
        /**
         * 查询物流详情
         */	
        getExpressDetail(){
            let _this = this;
            let parma = {
                outerExpressOrderNo:_this.outerExpressOrderNo,
                expressCompanyNo:_this.expressCompanyNo,
            }
            if(_this.expressCompanyCode == 1){
                parma['verifyPhoneNo'] = _this.phoneNo.substr(-4);
            }
            expressHandler.getExpressDetail(parma).then((res) => {
                _this.querying = false;
                if (res.resultCode == 0) {
                    _this.expressOrderDetail = res.result.expressOrderDetail;
                    _this.status = (_this.expressOrderDetail.expressDetails[0] || {}).expressStatus || '';
                    if('express' == _this.pageFrom){
                        _this.flightOrderNo = res.result.expressOrderDetail.flightOrderNo || '';
                    }
                }else{
                    expressHandler.showConfirm('暂未查到与您单号相关的物流信息，请稍后再尝试查询', function(){}, 1, null, '确定', null, null, true);
                }
            }).catch((err) => {
                _this.querying = false;
                console.log(err);
            }); 
        }, 	 	
        /**
         * 跳转页面
         * 
         */	        
        gotoPage(url,queryData){
            let _this = this;
            _this.$router.push({
                path: url, 
                query: queryData
            })                 
        }, 
        /**
         * 拨打电话
         */
        callNativeTel(tel,type){
            let _this = this;
            if('courier'==type && !((_this.expressTypeData[_this.status] || {}).canContact)){//联系快递员
                return;
            }
            if('' == tel){
                expressHandler.showToast('电话号码为空');
                return;
            }
            sinosdk.sino.calltel(tel);
        },
        /**
         * 查看报销凭证详情
         */
        goReimburseDetail() {
            let _this = this;
            _this.gotoPage('/invoice/flight',{'orderNo':_this.flightOrderNo,'pageFrom':'expressDetail'})
        },
        /**
         * 复制运单号
         */
        copyExpressNo () {
            let _this = this;
    　　　　 var save = function (e){
    　　　　    e.clipboardData.setData('text/plain',_this.expressOrderDetail.outerExpressOrderNo);//下面会说到clipboardData对象
    　　　　　　e.preventDefault();//阻止默认行为
    　　　　 }
    　　　　 document.addEventListener('copy',save);
    　　　　 document.execCommand("copy");//使文档处于可编辑状态，否则无效
            expressHandler.showToast('复制成功');
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
    }
};
</script>
<style scoped lang="less">
    @import '~themes/default/styles/expressServer/expressDetail.less';
</style>