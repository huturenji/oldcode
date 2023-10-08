<template>
    <div class="order">
        <div class="addressWrap">
            <div class="order_textWrap bbpxs cursorp" @click="showAddress('send')">
                <div class="textLeft sender">寄</div>
                <div class="textMid">
                    <div class="textInput" v-if="senderInfo.name == ''">从哪里寄？</div>
                    <template v-else>
                        <div class="textInput">{{senderInfo.name+' '+senderInfo.phone}}</div>
                        <div class="textTips">{{senderInfo.area+senderInfo.address}}</div>
                    </template>
                </div>
                <div class="textRight">
                    <div class="textRightBut arrow"></div>
                </div>
            </div>
            <div class="order_textWrap cursorp" @click="showAddress('addressee')">
                <div class="textLeft addressee">收</div>
                <div class="textMid">
                    <div class="textInput" v-if="receiverInfo.name == ''">寄到哪里？</div>
                    <template v-else>
                        <div class="textInput">{{receiverInfo.name+' '+receiverInfo.phone}}</div>
                        <div class="textTips">{{receiverInfo.area+receiverInfo.address}}</div>
                    </template>
                </div>
                <div class="textRight">
                    <div class="textRightBut arrow"></div>
                </div>
            </div>
        </div>
        <div class="contectWrap">
            <TextX
                class="bbpxslz"
                :label="'物品信息'"
                :isMustFill="true"
                :isRightAlign="true"
                :readonly="true"
                :lineClick="true"
                :value="cargoInfo.name==''?'':(cargoInfo.name+'/'+cargoInfo.weight+'公斤')"
                :noLeftPadding="true"
                :placeholder="'请选择物品信息'"
                :rightButType="'arrow'"
                @click.native="showCargoInfo = true"
            ></TextX>
            <TextX
                class="bbpxslz"
                :label="'快递选择'"
                :isMustFill="true"
                :isRightAlign="true"
                :readonly="true"
                :lineClick="true"
                :value="expressCompany.expressCompanyCode==''?'':expressCompany.expressCompanyName"
                :noLeftPadding="true"
                :placeholder="'请选择快递公司'"
                :rightButType="'arrow'"
                @click.native="showCompanyInfo = true"
            ></TextX>
            <TextX
                class="bbpxslz"
                :label="'上门时间'"
                :isMustFill="true"
                :isRightAlign="true"
                :readonly="true"
                :lineClick="true"
                :value="getSendTime('text')"
                :noLeftPadding="true"
                :placeholder="'请选择上门时间'"
                :rightButType="'arrow'"
                @click.native="showSendTimeInfo=true"
            ></TextX>
            <TextX
                :label="'给快递员留言'"
                :labelWidth="'2rem'"
                v-model="remark"
                :isRightAlign="true"
                :noLeftPadding="true"
                :placeholder="'请输入（选填）'"
            ></TextX>
        </div>
        <div class="choosedWrap">点击提交订单表示您已阅读并同意<span class="cursorp" @click.stop="showServiceAgreementFun()">《寄件服务协议》</span></div>
        <!--价格明细-->
        <div v-transfer-dom>
            <popup v-model="showDetailDom" position="bottom" class="popBox2 hotelPriceDetail" is-transparent>
                <div class="detailWrap">
                    <div class="tabWrap">
                        <div class="lineWrap">
                            <div class="left">1公斤首重</div>
                            <div class="right ">{{expressOrderPrice.primaryOrderPrice}}</div>
                        </div>
                        <div class="lineWrap">
                            <div class="left">续重</div>
                            <div class="right">¥ {{expressOrderPrice.secondaryOrderPricePerKg+'/公斤X'+(cargoInfo.weight-1)+' = ¥ '+expressOrderPrice.secondaryOrderPrice}}</div>
                        </div>
                        <div class="tabTipsWrap">保价、包装费用请与快递员现场确认，不在预计运费中</div>		
                    </div>
                </div>
            </popup>
        </div>
        <!--提价以及明细按钮-->
        <div v-transfer-dom v-show="isOriginHei">
            <div class="orderBottomButWrap buttWrap">
                <div class="left">
                    <div class="leftText">
                        <div class="leftTit">预估运费:<span class="rmb">￥</span><span class="pricenum num-font">{{expressOrderPrice.roughExpressOrderPrice}}</span></div>
                        <div class="detailBut normal-btn" @click="showDetailDom=!showDetailDom"><span :class="{active:showDetailDom}">明细</span></div>
                    </div>
                    <div class="leftTps">根据收寄件地址和物品信息估算费用</div>
                </div>
                <div class="right">
                    <div class="bottombuttonWrap">
                        <div class="subButton normal-btn" @click="createOrder">提交订单</div>
                    </div>
                </div>
            </div>
        </div>
        <!--编辑地址-->
        <div v-transfer-dom>
            <popup v-model="showAddressEdit" height="100%">
                <swp-address v-if="showAddressComp" v-model="addressInfo" @closeAddressList="closeAddressList" :nameTitle="addressLable" :firstToDefault="true" :usedPerAddInfo="usedPerAddInfo" :perAddAddressInfo="perAddAddressInfo" ref='addressCard'></swp-address>
                <!-- <AddressCard v-model="addressInfo" @closeAddressList="closeAddressList" ref='addressCard'></AddressCard> -->
            </popup>
        </div>
        <!--选择物品类型和重量-->
		<div v-transfer-dom>
		    <popup v-model="showCargoInfo" is-transparent>
                <cargoInfo v-model="cargoInfo" @cloose="showCargoInfo=false" :showCargoInfo="showCargoInfo" @input='getRoughExpressOrderPrice'></cargoInfo>
		    </popup>
		</div>  
        <!--选择快递公司-->
		<div v-transfer-dom>
		    <popup v-model="showCompanyInfo" is-transparent>
                <companyInfo v-model="expressCompany" :expressCompanyList="expressCompanyList" @cloose="showCompanyInfo=false" @input='getRoughExpressOrderPrice' :showCompanyInfo="showCompanyInfo"></companyInfo>
		    </popup>
		</div>  
        <!--选择上门时间-->
		<div v-transfer-dom>
		    <popup v-model="showSendTimeInfo" is-transparent>
                <sendTime v-model="sendTimeId" @cloose="showSendTimeInfo=false" :showSendTimeInfo="showSendTimeInfo"></sendTime>
		    </popup>
		</div>   
        <!--服务协议-->
		<div v-transfer-dom>
		    <popup v-model="showServiceAgreement"  height="100%" is-transparent>
                <serviceAgreement></serviceAgreement>
		    </popup>
		</div> 
        <div v-transfer-dom>
            <Loading :show="createing" text='下单中...'/>
        </div>     
    </div>
</template>
<script>
import LoadingX from "components/loading/LoadingX.vue";
import TextX from "components/text/TextX.vue";
import expressHandler from './js/expressHandler.js';
// import AddressCard from 'components/address/addressCard.vue';
import {expressCargoData} from './enum/expressEnum.js';
const cargoInfo = ()=>import('./comp/cargoInfo.vue');
const companyInfo = ()=>import('./comp/companyInfo.vue');
const sendTime = ()=>import('./comp/sendTime.vue');
const serviceAgreement = ()=>import('./comp/serviceAgreement.vue');
import {TransferDom,Popup,Loading} from 'vux';
export default {
    mixins: [expressHandler.mixin.tChatEventMixin],
    directives: {
        TransferDom
    },
    components: {
        TextX,
        Popup,
        cargoInfo,
        companyInfo,
        sendTime,
        serviceAgreement,
        Loading,
        // AddressCard
    },
    data() {
        let that = this;
        let managerData = expressHandler.stateManager.setData([
            //是否显示地址选择组件
            {
                name: 'showAddressEdit',
                type: 'page',
                hide: {
                    callback: function () {},
                    title: '寄件'
                }
            },
            //是否显示服务协议
            {
                name: 'showServiceAgreement',
                type: 'page',
                hide: {
                    callback: function () {},
                    title: '寄件'
                }
            },
            //价格明细是否显示
            {
                name: 'showDetailDom',
                type: 'page',
                hide: {
                    callback: function () {},
                    title: '寄件'
                }
            },
            //价格明细是否显示
            {
                name: 'showDetailDom',
                type: 'page',
                hide: {
                    callback: function () {},
                    title: '寄件'
                }
            },
            //是否显示选择物品界面
            {
                name: 'showCargoInfo',
                type: 'page',
                hide: {
                    callback: function () {},
                    title: '寄件'
                }
            },
            //是否选择公司选择界面
            {
                name: 'showCompanyInfo',
                type: 'page',
                hide: {
                    callback: function () {},
                    title: '寄件'
                }
            },
            //是否显示上门时间选择界面
            {
                name: 'showSendTimeInfo',
                type: 'page',
                hide: {
                    callback: function () {},
                    title: '寄件'
                }
            }
        ], this);
        return Object.assign(managerData, {
            expressCargoMap: expressCargoData,//物品类型
            choosedProtocol: true,//是否勾选了用户协议，默认勾选
            isOriginHei: true, //是否显示底部按钮栏
            screenHeight: document.documentElement.clientHeight, //屏幕初始高度
            originHeight: document.documentElement.clientHeight, //屏幕高度
            addressFocusType: 'send',//地址类型控制，收件地址和寄送地址
            expressCompanyList:[],//快递公司列表
            expressCompany:{
                expressCompanyNo: '',//快递公司ID
                expressCompanyCode:'',//快递公司Code
                expressCompanyName: '',
                expressCompanyPhone: ''
            },
            sendTimeId:0,//上门时间选项id
            senderInfo: {name:'',phone:'',area:'',address:''},//寄件人信息
            receiverInfo: {name:'',phone:'',area:'',address:''},//收件人信息
            cargoInfo: {name:'',weight:'1'},//物品信息
            remark: '',//备注
            createing:false,//下单中
            expressOrderPrice:{
                roughExpressOrderPrice:0,
                primaryOrderPrice:0,
                secondaryOrderPrice:0,
                secondaryOrderPricePerKg:0
            },//预估运费
            pageFrom: this.$route.query.pageFrom || '',//页面跳转来源
            showAddressComp: false, //加载地址的js
            addressInfo: {},//地址信息
            addressLable:'寄件人',//地址组件显示的label名字
            perAddAddressInfo:{},//预新增地址信息
            usedPerAddInfo:false,//新增时是否传入当前登录人信息
        })
    },
    watch: {
        screenHeight: function (newValue) {
        let that = this;
            if (that.originHeight > newValue + 150) { //150是为了兼容虚拟返回栏
                that.isOriginHei = false;
            } else {
                that.isOriginHei = true;
            }
        },
        addressInfo:{
            handler(newVal){
                let _this = this;
                if(!!this.addressInfo.name && this.addressFocusType == 'send'){
                        this.senderInfo = this.addressInfo;
                        this.judgeSameAddress();
                }else if(!!this.addressInfo.name && this.addressFocusType == 'addressee'){
                        this.receiverInfo = this.addressInfo;
                        this.judgeSameAddress();
                }
                _this.getRoughExpressOrderPrice();
            },
            deep:true,
            immediate:true
        }
    },
    created() {
        let _this = this;
        _this.initData();
        _this.registerAppfun();
    },
    mounted() {
        //动态加载js
        this.dynamicLoadingJs();
        //控制键盘弹出时隐藏底部按钮
        window.onresize = function () {
            return (function () {
                this.screenHeight = document.documentElement.clientHeight;
            })()
        }
    },
    methods: {
         /**
         * 页面初始化
         */	
        initData(){
            let _this = this;
            if('orderDetail' == _this.pageFrom){
                let createOrderDetail = JSON.parse(expressHandler.getSession('createOrderDetail'));
                _this.expressCompany = createOrderDetail.expressCompanyInfo;
                _this.senderInfo = createOrderDetail.senderInfo;
                _this.receiverInfo = createOrderDetail.receiverInfo;
                _this.cargoInfo = createOrderDetail.cargoInfo;
                _this.remark = createOrderDetail.remark;
                _this.getRoughExpressOrderPrice();
            }
            _this.getExpressCompanies();
        },
         /**
         * 注册app事件
         */	
        registerAppfun(){
            let _this = this;
            //注册ios异步跳转事件
            sinosdk.sino.overwriteWindowopen();
        },
        /**
        * T信回退事件的注册回调 必须是goBackFun
        */
        goBackFun(){
            this.$router.back();            
        },
         /**
         * 查询所有快递公司
         */	
        getExpressCompanies(){
            let _this = this;
            let parma = {
                pageIndex:1,
                pageSize:20
            }
            expressHandler.getExpressCompanies(parma).then((res) => {
                if (!!res.result.expressCompanies) {
                        _this.expressCompanyList = res.result.expressCompanies;
                    }
            }).catch((err) => {
                console.log(err);
            }); 
        },
         /**
         * 打开服务协议
         */	
        showServiceAgreementFun(){
            let _this = this;
            _this.showServiceAgreement = true;
            document.title='寄件服务协议';
        },
        closeAddressList(){
            this.showAddressEdit = false;
            document.title = '寄件';
        },
         /**
         * 判断寄件人地址和收件人地址是否相同
         */	
        judgeSameAddress(){
            let _this = this;
            if (_this.senderInfo.address == _this.receiverInfo.address && _this.senderInfo.area == _this.receiverInfo.area) {
                expressHandler.showToast('寄件人地址不能和收件人地址相同');
                return false;
            }
        },
         /**
         * 地址组件接收地址数据
         */	
        showAddress(type){
            let _this = this;
            if('send' == type){
                _this.addressInfo = JSON.parse(JSON.stringify(_this.senderInfo));
                document.title = '寄件人地址';
                _this.addressLable = '寄件人';
                try {
                    if(_this.senderInfo.name == ''){
                        _this.perAddAddressInfo.name = expressHandler.userName || '';
                        _this.usedPerAddInfo = true;
                    }else{
                        _this.perAddAddressInfo.name = '';
                        _this.usedPerAddInfo = false;
                    }
                    if(_this.senderInfo.phone == ''){
                        _this.perAddAddressInfo.phone = expressHandler.userPhone || '';
                    }else{
                        _this.perAddAddressInfo.phone = '';
                    }
                } catch (error) {
                }
            }else if('addressee' == type){
                _this.addressInfo = JSON.parse(JSON.stringify(_this.receiverInfo));
                document.title = '收件人地址';
                _this.addressLable = '收件人';
                _this.usedPerAddInfo = false;
            }
            _this.addressFocusType = type;
            _this.showAddressEdit = true;
            console.log(_this.perAddAddressInfo)
        },

        /**
         * 快递下单
         */	
        createOrder(){
            let _this = this;
            if(_this.createing){
                return;
            }
            if(_this.validate()){
                let parma = {
                    expressCompanyNo:_this.expressCompany.expressCompanyNo,
                    senderInfo:_this.senderInfo,
                    receiverInfo:_this.receiverInfo,
                    cargoInfo:_this.cargoInfo,
                    sendStartTime:_this.getSendTime('start'),
                    sendEndTime:_this.getSendTime('end'),
                    remark:_this.remark
                }         
                _this.createing = true;    
                expressHandler.createExpressOrder(parma).then((res) => {
                    _this.createing = false; 
                    if (res.resultCode == 0) {
                        expressHandler.showToast('下单成功')
                        setTimeout(() => {
                            _this.gotoPage('/detail/order',{'expressOrderNo':res.result.expressOrderNo})
                        }, 1000);
                    }
                }).catch((err) => {
                    _this.createing = false; 
                    console.log(err);
                });
            }
        },
        /**
         * 获取上门取件时间
         * type start&end
         */
        getSendTime(type){
            let _this = this;
            let time = '';
            let text = '';
            if(-1 == _this.sendTimeId){//今天最近两小时
                time = 'start' == type?new Date(new Date().getTime()).format('yyyy/MM/dd HH:mm:ss'):new Date(new Date().getTime()+2*3600*1000).format('yyyy/MM/dd HH:mm:ss');
                text = '今天 '+new Date(new Date().getTime()).format('HH:mm')+' - '+new Date(new Date().getTime()+2*3600*1000).format('HH:mm');
            }else if(0 == _this.sendTimeId){//未选择上门时间

            }else{//今天明天后天的时间段
                let dayMap = {0:'今天',1:'明天',2:'后天'};
                let dayIndex = parseInt(_this.sendTimeId/100);
                let hourIndex = _this.sendTimeId-(dayIndex*100);
                let todayTime = new Date(new Date().getTime()).format('yyyy/MM/dd');
                time = 'start' == type?new Date(new Date(todayTime).getTime()+(24*dayIndex+hourIndex)*3600*1000).format('yyyy/MM/dd HH:mm:ss'):new Date(new Date(todayTime).getTime()+(24*dayIndex+hourIndex+2)*3600*1000).format('yyyy/MM/dd HH:mm:ss');
                text = dayMap[dayIndex]+' '+new Date(new Date(todayTime).getTime()+(24*dayIndex+hourIndex)*3600*1000).format('HH:mm')+' - '+new Date(new Date(todayTime).getTime()+(24*dayIndex+hourIndex+2)*3600*1000).format('HH:mm');
            }
            if('text' == type){
                return text;
            }else{
                return time;
            }
        },
        /**
         * 数据校验
         */	 
        validate: function () {
            let _this = this;
            if (_this.senderInfo.name == '') {
                expressHandler.showToast('请选择寄件人地址');
                return false;
            }
            if (_this.receiverInfo.name == '') {
                expressHandler.showToast('请选择收件人地址');
                return false;
            }
            if (_this.senderInfo.address == _this.receiverInfo.address && _this.senderInfo.area == _this.receiverInfo.area) {
                expressHandler.showToast('寄件人地址不能和收件人地址相同');
                return false;
            }
            if (_this.cargoInfo.name=='') {
                expressHandler.showToast('请选择物品信息');
                return false;
            }
            if (_this.expressCompany.expressCompanyNo=='') {
                expressHandler.showToast('请选择快递公司');
                return false;
            }
            if (_this.sendTimeId == 0) {
                expressHandler.showToast('请选择上门时间');
                return false;
            }
            if (!_this.choosedProtocol) {
                expressHandler.showToast('请同意寄件服务协议');
                return false;
            }
            return true;
        },       	
        /**
         * 获取预估快递费用
         */	
        getRoughExpressOrderPrice(){
            let _this = this;
            if (_this.receiverInfo.name == '') {
                return false;
            }
            if (_this.cargoInfo.name=='') {
                return false;
            }
            if (_this.expressCompany.expressCompanyNo=='') {
                return false;
            }
            if (_this.senderInfo.address == _this.receiverInfo.address && _this.senderInfo.area == _this.receiverInfo.area) {
                return false;
            }
            let parma = {
                expressCompanyNo:_this.expressCompany.expressCompanyNo,
                receiverInfo:_this.receiverInfo,
                weight:_this.cargoInfo.weight
            }         
            expressHandler.getRoughExpressOrderPrice(parma).then((res) => {
                if (res.resultCode == 0) {
                    _this.expressOrderPrice = res.result;
                }
            }).catch((err) => {
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
                query: queryData || {}
            })                 
        },    
        //动态加载js（地址管理）
        dynamicLoadingJs(){
            let that = this;
            //动态加载发票的js组件
            that.loadAddressComp();
        }, 
        //动态加载发票的js组件
        loadAddressComp(){
            let that = this;
            expressHandler.loadJs('swpAddress','address',()=>{
                that.showAddressComp = true;
            })
        },
    }
};
</script>
<style scoped lang="less">
@import '~themes/default/styles/expressServer/order.less';
</style>

