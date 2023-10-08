<template>
	<div class="order-item">
		<orderItemSummary :orderItem="orderItem"></orderItemSummary>
		<div class="order-detail">
			<div class="order-detail-block">
				<div>
					<div>
						<span>{{orderItem.departCityName}}</span>
						<span v-if="orderItem.arriveCityName">——</span>
						<span>{{orderItem.arriveCityName}}</span>
					</div>
					<span class="seat" v-if="orderItem.airLineName">{{orderItem.airLineName}}</span>
					<span class="seat" v-if="orderItem.flightNo">{{orderItem.flightNo}}</span>
					<span class="seat" v-if="orderItem.cabinType">【{{cabinType}}】</span>
				</div>
				<div class="travel-info">
					<label class="pos-label pos-label-start">起</label>
					<span v-if="orderItem.sAirportName">{{orderItem.sAirportName}}</span>
					<span v-if="orderItem.departTime">
                    	{{new Date(orderItem.departTime).format("yyyy/MM/dd HH:mm").replace(/\//g,'-')}}
                    </span>
				</div>
				<div class="travel-info">
					<label class="pos-label pos-label-end">降</label>
					<span v-if="orderItem.eAirportName">{{orderItem.eAirportName}}</span>
					<span v-if="orderItem.arriveTime">
                    	{{new Date(orderItem.arriveTime).format("yyyy/MM/dd HH:mm").replace(/\//g,'-')}}
                    </span>
				</div>
			</div>

			<div class="order-detail-block">
				<div class="sub-label">乘机人</div>
				<div class="single-text travel-person" :class="{'muti-person':customersArr.length>2,'double-person':customersArr.length==2}">
					<div v-for="cust of customersArr" v-show="cust" :key="cust">
						{{cust}}
					</div>
				</div>
			</div>
			<div class="order-detail-block">
				<div class="sub-label">金额</div>
				<div class="single-text red-font">
					￥{{orderItem.payAmount}}
				</div>
			</div>
			<div class="order-detail-block">
				<div class="sub-label">订单状态</div>
				<div class="single-text" :class="['payStatus-'+orderItem.payStatus,{'part-status-margin':orderItem.partStatus}]"
					:style="{color:orderStatusColor}"
				>
					{{orderStatus + partStatus}}
				</div>
			</div>
			<div class="order-detail-block">
				<div class="sub-label">支付方式</div>
				<div class="single-text single-text1">
					{{payType}}
				</div>
				<div v-if="userTypeFlag" class="userTypeDiv" :class="'diff-'+orderItem.useType">
					{{userType}}
				</div>
			</div>
			<div class="order-detail-block centerBlock lastBlock">
				<div v-show="hasInvoice" class="invoiceShowButtonWrap">
					<div class="showButton1" v-if="hasDelivery">{{InvoiceStatus}}</div>
					<div class="showButton cursorp" v-else @click="openMailBox">{{InvoiceStatus}}</div>					
				</div>
				<div v-show="hasDelivery" class="showButtonWrap">
				    <div class="showButton cursorp">
				    	<span>快递</span>
						<div class="sign" v-show="isSign"></div>
				    </div>											
					<div class="dialogShow cursorp">
						<div class="lineInfo">
							<div class="logoBg">
								<img :src="expressLogo" />
							</div>
							<InfoLabel style="align-items: baseline" infoName="运单号" :infoValue='!!orderItem.expressInfo ? orderItem.expressInfo.expressOrderNo:""'>
							</InfoLabel>
                            <div class="hasReceived" v-if="showReceivedIcon">
                                <img/>
                            </div>
						</div>
						<div class="lineExpress" v-if="!!orderItem.expressInfo && !!orderItem.expressInfo.expressDetails && orderItem.expressInfo.expressDetails.length>0">
				        	<!-- <iframe :src="'http://m.kuaidi100.com/result.jsp?nu=' + (!!orderItem.expressInfo ? orderItem.expressInfo.expressOrderNo:'1124707207690')">
        					</iframe>			 -->
							<ExpressDetailItem v-for="item in expressList" :key="item.expressLocationTime" v-bind:expressItem='item' />
						</div>
						<div class="lineExpressEmpty" v-else>
                            <div><img src="~assets///icon_no_express.png"/></div>
                            <div>待快递人员上门揽件，暂无物流信息</div>
                        </div>
					</div>		
				</div>
				<div v-if="!orderItem.isAbnormal" class="button primary cursorp" @click.stop="goDetail(orderItem.typeName,orderItem.typeCode, orderItem.orderNo)">
					订单详情
				</div>
                <!-- 领取和补录UI -->
                <manualBookingFlight v-if="orderItem.isAbnormal && !(typeof orderItem.bpProductExceptionProcessedStatus == 'undefined' || orderItem.bpProductExceptionProcessedStatus + '' == 'null')" 
                    :exceptionProcessedStatus="orderItem.bpProductExceptionProcessedStatus" :handlerId="orderItem.customeServiceStaffId"
                    :handlerName="orderItem.customeServiceStaff" :proFailReason="orderItem.processFailReason" :orderItem="orderItem" @refreshPage="mbfRefreshPage" />
			</div>
		</div>
        <div v-transfer-dom v-show="showMailBox">
            <mailPop  :ifShowTips = "ifShowTips" :orderItem = "orderItem" :title = "InvoiceStatus" :itineraries="simpleInfo" 
            :expressCpy="expressArr" :proviceCityCounty="mailPreData.proviceCityCounty" :senderAddressList="mailPreData.senderAddressList" :showComp="showComp"
            @closeBox="closeBox" @submitMail="addExpressInfo" @getSenderInfos = "getSenderInfos"></mailPop>
        </div>
         <div v-transfer-dom v-show="showMailSucessBox">
             <mailSucessBox @closeSucBox="closeSucBox" :mailResponse="mailResponse"></mailSucessBox>
         </div>
        <div v-transfer-dom :show="isLoading">        
            <Loading :show="isLoading" :text="loadingText" class="couponLoading"></Loading>       
        </div>  
	</div>
</template>

<script>
    const orderItemSummary = () => import("./listitemheader.vue");
    const InfoLabel = () => import("biscomponents/infolabel/msglabel.vue");
    const ExpressDetailItem = () => import("biscomponents/express/listitem.vue");
    const mailPop = () => import("biscomponents/mail/index/index.vue");
    const mailSucessBox = () => import("biscomponents/mail/sucess/sucess.vue");
    const manualBookingFlight = () => import("biscomponents/abnormal-order/flight/flight.vue");    
    import tmHandler from 'bislibs/requesthandler/traveloperationhandler.js';           
	import  * as travelfun from "bislibs/traveloperationfun.js";  
	import utils from "bislibs/utils";
	
	export default {
		props: {
			orderItem: {//订单列表数据
				type: Object,
                required: true,
			},
            mailPreData:{//邮寄报销凭证必要的数据
				type: Object,
                default:{
                    proviceCityCounty:{},//省市区数据
                    senderAddressList:[],//发件人数据
                    expressCompanies:[],//快递公司数据
                },                
            },     
		},            
		// props: ['orderItem','expressCompanies','proviceCityCounty',"senderAddressList"],
		directives: {
		},
		components: {
			InfoLabel,
			ExpressDetailItem,
            orderItemSummary,
            mailPop,
            mailSucessBox,
            manualBookingFlight,
		},		
		data() {
			return {				
				expressList: [],//物流信息列表				
				selectExpressCpy:null,//选择的物流公司				
				expressArr:[],//物流公司列表				
				expressNo:null,//快递单号
				InvoiceStatusName1:"邮寄报销凭证",//按钮提示语
                InvoiceStatusName2:"已寄送报销凭证",//按钮提示语
                showMailBox:false,//显示邮寄弹框
                showComp:false,//是否显示省市区组件
                showMailSucessBox:false,//显示邮寄成功
                mailResponse:"",//邮寄成功的快递信息
                isLoading: false,//是否显示提交加载框
                loadingText:"正在生成运单号...",//提交加载框提示语
				ifShowTips:false,//首次进入的提示弹框
				userTypeFlag: utils.userTypeSwitch,
                isSign:true//快递是否签收
			}
		},
		computed: {
			//快递公司logo
			expressLogo:function(){
				//类似于飞机票的logo，拼接成本地的图片
				return travelfun.getExpressLogo(this.orderItem.expressInfo);		
			},
			//订单状态
			orderStatus: function() {
				return utils.getFlightOrderStatus(this.orderItem.orderStatus);
			},
			customersArr: function() {
				return this.orderItem.passengers ? this.orderItem.passengers.split(',') : [];
			},
			cabinType: function() {
				return travelfun.getCabinTypeName(this.orderItem.cabinType);
			},
			//订单的退改状态
			partStatus:function(){
				if(utils.showFlightSubStatus(this.orderItem.orderStatus)){
					return utils.getFlightPartStatus(this.orderItem)
				}
				return ""
			},
            orderStatusColor: function() {   
                return utils.getFlightOrderStatusColor(this.orderItem.orderStatus);
            },			
			//支付方式
			payType: function() {
				return this.orderItem.payTypeName || this.orderItem.paymentPlatform 
					&& this.orderItem.paymentPlatform.payTypeName|| travelfun.getDefaultName();
			},
			payStatus: function() {
				return travelfun.getPayStatus(this.orderItem.payStatus);
			},
			userType: function() {
				return travelfun.getUserType(this.orderItem.useType);
			},
			hasInvoice: function() {
				//是否可以邮寄ExpressFlag==1。 加一个条件， 物流公司信息不为空，才能邮寄。否则不显示
                 if((!!this.orderItem.expressFlag && this.orderItem.expressFlag == 1 
                    || !!this.orderItem.expressInfo && !!this.orderItem.expressInfo.expressOrderNo) 
				 	&& !!this.expressArr && !!this.expressArr.length > 0 ){                        
					return true;
				}else{
					return false;
				}
			},
			hasDelivery: function() {
				//是否已经邮寄,快递信息不为空
				let isDelivery = !!this.orderItem.expressInfo && !!this.orderItem.expressInfo.expressOrderNo;
				return isDelivery;
			},
			InvoiceStatus: function() {
				//需要报销凭证，并且没有邮寄,目前没有这样的数据
				let isDelivery = !!this.orderItem.expressInfo && !!this.orderItem.expressInfo.expressOrderNo;
				if(isDelivery) {
					return this.InvoiceStatusName2;
				} else {
					return this.InvoiceStatusName1;
				}
            },
            /**
             * 行程单信息
             */
            simpleInfo:function(){
               let customersArr = this.orderItem.passengers ? this.orderItem.passengers.split(',') : [];
                let result="";
                for(let i=0;i<this.customersArr.length;i++){
                    result+=this.customersArr[i];
                    if(i != this.customersArr.length-1){
                        result+="、";
                    }else{
                        result+=";"
                    }
                }
                result+=this.orderItem.departCityName+"--"+this.orderItem.arriveCityName+";"
                result+=this.orderItem.airLineName+this.orderItem.flightNo;
                
                return result;
            },
            /**
             * 快递已签收标记
             */
            showReceivedIcon:function(){
				let result =false; 
				let that =this;
                if(!!this.orderItem.expressInfo && !!this.orderItem.expressInfo.expressStatusAndTime){
                    for(let i=0;i<this.orderItem.expressInfo.expressStatusAndTime.length;i++){
                        if(this.orderItem.expressInfo.expressStatusAndTime[i].status=='已签收'){
							that.isSign = false;
                            result = true;
                            break;
                        }
                    }
                }
                return result;
            }                 
        },
        watch:{
            'mailPreData': {
                handler(val, oldVal) {
                    let that = this;
                    if (val != oldVal && !!val) {
                        //快递公司数据列表
                        that.expressArr = !!that.mailPreData.expressCompanies ? that.mailPreData.expressCompanies : that.expressArr;
                    }
                },
                immediate: true,
                deep:true,
            }
        },
		created() {
			//快递公司数据列表
			// this.expressArr = !!this.mailPreData.expressCompanies ? this.mailPreData.expressCompanies : this.expressArr;
			//物流列表信息
			this.expressList = !!this.orderItem.expressInfo && !!this.orderItem.expressInfo.expressDetails 
				&& this.orderItem.expressInfo.expressDetails.length > 0 ? this.orderItem.expressInfo.expressDetails 
				: this.expressList;
			for(let i=0;i<this.expressList.length;i++){
				if(i==0){
					this.expressList[i].isLastPoint = true;
				}else if(i==(this.expressList.length - 1)){
					this.expressList[i].isFirstPoint = true;
				}
            }		
            let that = this;
            // document.body.addEventListener('click', function(e){
            //     if (e.target.className.indexOf('showButton') < 0) {
            //         that.showDialogWuliu = false;
            //     }
            // }, true)            	
        },	
        beforeDestroy () {
            let that = this;
            // document.body.removeEventListener("click", function(e){
            //     if (e.target.className.indexOf('showButton') < 0) {
            //         that.showDialogWuliu = false;
            //     }
            // }, true)
        },        	
		methods: {
            /**
             * 刷新常用任列表
             */
            getSenderInfos(){
                //每次寄件人地址有更新，新建或者更新，重新刷新常用联系人数据
                this.$emit("getSenderInfos");               
            },
            /**
             * 关闭邮寄凭证弹框
             */
            closeBox(){
                this.showMailBox = false;
                this.showComp = false;
            },
            /**
             * 弹出下单成功框
             */
            openSucBox(){
                this.showMailSucessBox = true;
            },
            /**
             * 关闭下单成功框
             */
            closeSucBox(){
                this.showMailSucessBox = false;
                //提交成功，刷新列表数据
				this.$emit('refreshPage');
            },
			/**
			 * 跳转到订单详情
			 * @param typeName
			 * @param typeCode
			 */
			goDetail(typeName, typeCode, orderNo) {
				this.$router.push({
					path: "/order/orderDetail",
					query: {
						typeName: typeName,
						typeCode: typeCode,
						orderNo: orderNo,
						isAbnormal:this.orderItem.isAbnormal
					}
                });   
				// this.$emit('goDetail', typeName, typeCode, orderNo);
			},
			/**
			 * 提交快递信息
			 */
			addExpressInfo(inData){
				let _this = this;
				
				let copyinData = JSON.parse(JSON.stringify(inData))
				delete copyinData.senderAddress["addressId"]
				delete copyinData.senderAddress["areaArray"]
				delete copyinData.receiverAddress["areaArray"]

				copyinData.receiverAddress.orderNo = _this.orderItem.orderNo

				console.log('addExpressInfo');
                let request={
                    expressCompanyNo:copyinData.selectCpys[0].expressCompanyNo,
                    senderInfo:copyinData.senderAddress,
					orderNoAndReceiverInfo:[copyinData.receiverAddress],
				};
				

                _this.isLoading = true;
                tmHandler.addPatchExpressInfos(request)
                .then(function(res) {
                    _this.isLoading = false;
                    if(0 == res.resultCode ) {
                        _this.closeBox();
                        _this.mailResponse = copyinData.selectCpys[0].expressCompanyName;
                        _this.openSucBox();
					} else {
						console.info(res);
						utils.showToast("提交失败");
					}
				}, function(error) {
					console.info(error);
				});				
            },    
            /**
             * 弹出邮寄页面
             */
            openMailBox(){
                //是否显示提示框，是有首次进入才会提示
               this.ifShowTips = !!utils.getStorage("mailBoxPopTips1") && parseInt(utils.getStorage("mailBoxPopTips1")) == 0? false: true;
               //显示里面的地址选择框
               this.showComp = true;
               this.showMailBox=true;
            }, 
            /**
             * 领取、补录功能结果
             */
            mbfRefreshPage(){
                //补录成功，刷新列表数据
                this.$emit('refreshPage');
            }
		},
	}
</script>
<style lang="less">
    @import './listitem.less';
  .couponLoading{
      width: 150px;
      .weui-toast{
          width: 150px;
      }    
    }
	.sign{
		position: absolute;
		top: 3px;
		right: -5px;
		width: 6px;
		height: 6px;
		background-color: #f00;
		border-radius: 50%;
	}	
</style>