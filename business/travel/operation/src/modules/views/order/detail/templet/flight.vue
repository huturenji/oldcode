<template>
  <div class="orderItemFly">
    <!--退改签标记 -->
    <div class="tuigaiDiv showButtonWrap">
      <div class="img" />
      <span class="explain cursorp" @click="luggagePop">退改签 行李额</span>
      <div class="dialogShow" v-show="showDialogluggage">
        <Description class="lineContent" @closeDesc="closeluggagePop" :cabinRules="tuiGaiDetail" 
          :providerName="orderDetail.orderBase.providerShortName" />
      </div>
    </div>  	
    <!--订单信息模块-->
    <OrderBaseDetail :orderDetail="orderDetail" orderType="Flight" @refreshPage="getFlightOrderDetail"/>
    <flightTuiCard v-bind:orderBase="orderDetail.orderBase" v-bind:tuiList="orderDetail.tuiOrderList || []" v-bind:airLines="orderDetail.airLines || []"
    	@startRefMoney="startRefMoney" v-show="orderHasManualRefund" v-bind:hasMaiInvoice="orderDetail.orderBase && !!orderDetail.expressInfo"/>
    <div v-for="airlineItem in orderAllAirLines" :key="airlineItem.flightNo" class="airlineItemSpan">
      <!--航班信息-->
      <div class="aireLineinfoAll">
        <div class="aireLineinfo">
          <div class="leftDiv">
            <div class="aireLineName">
            	<img :src="require('assets//airlogo/'+ getAirLogo(airlineItem.airLineCode)+'.png')"/>
              <span class="name">{{airlineItem.airLineName +airlineItem.flightNo}}</span>
            </div>
            <div class="aireLineStation">
              <div class="station">
              	<div>{{airlineItem.sCityName}}-{{airlineItem.eCityName}}</div>
              	<div class="time">{{airlineItem.beginDate +" "+ airlineItem.beginTime}}</div>
              </div>
              <div>
                <span>{{airlineItem.cabinName + airlineItem.cabin}}</span>
              </div>
            </div>
          </div>
          <div class="rightDiv">
          	<div class="rightTop">
	            <div class="startT">
	              <div class="startName">{{airlineItem.beginTime}}</div>
	              <div>{{airlineItem.sAirportName + airlineItem.sTerminal}}</div>
	            </div>
	            <div class="airelineTime">
	              <div class="timeLong">
	                <div class="allTime">{{!!airlineItem.duration ? '经'+airlineItem.duration : ''}}</div>
	                <div class="lineDiv"></div>
	                <div class="stops" v-if="airlineItem.stopNum > 0">
	                  <div>经停/</div>
	                  <div v-for="item in airlineItem.stopItems" :key="item.stopCityName">{{item.stopCityName}}</div>
	                </div>
	              </div>
	              <div class="airlogo">
	              </div>
	            </div>
	            <div class="startT">
	              <div class="startName">{{airlineItem.arriveTime}}</div>
	              <div>{{airlineItem.eAirportName + airlineItem.eTerminal}}</div>
	            </div>
          	</div>
          	<div class="rightBottom">
          		<div>{{airlineItem.planeType}}</div>
          		<div>{{airlineItem.isHasMeal?'有餐饮':'无餐饮'}}</div>
          		<div>准点率{{!!airlineItem.onTimeRate ? airlineItem.onTimeRate + '%': '：无'}}</div>
          	</div>
          </div>
        </div>
        <div class="iconBack" v-if="airlineItem.isGaiOrder">
          <div class="iconCss"></div>
        </div>
      </div>
      <!--乘客信息-->
      <FlightPassenger v-for="itemP in airlineItem.passengers" :key="itemP.psgId" v-bind:passenger="itemP || {}"
        v-bind:ticketInfo="airlineItem" v-bind:orderBase="orderDetail.orderBase || {}" v-bind:tuiOrderList="orderDetail.tuiOrderList || []"
		v-bind:insuranceList="insProductList" @refreshPage="getFlightOrderDetail"
         />
    </div>
    <!--出行保险-->
    <flightInsuranceCard v-bind:insuranceList="insProductList"></flightInsuranceCard>
    <!--报销信息-->
    <div v-if="orderDetail.orderBase" class="baoxiaoDiv">
    	<div class="baseInfoTop">
	      <div class="baseInfo">
	        <div class="titleDiv">报销凭证</div>
	        <InfoLabel infoName="报销凭证" infoValue="行程单、保险发票、退票手续费收据将一并快递邮寄；快递费用将开具电子发票，请在订单详情中查看" classForName="infoLabel5" classForValue="infoLabel7"></InfoLabel>
	        <div class="baoxiao">
	          <span class="spanL">配送方式：</span>
	          <span class="spanM">快递</span>
	          <span class="spanR" v-if="orderDetail.orderBase && orderDetail.orderBase.expressFareAmount">￥{{orderDetail.orderBase.expressFareAmount}}</span>
	        </div>
	        <InfoLabel infoName="发票抬头" v-if="orderDetail.invoiceDetail && orderDetail.invoiceDetail.purchaserName" :infoValue="orderDetail.invoiceDetail.purchaserName + (orderDetail.invoiceDetail.taxNumber ? '('+(orderDetail.invoiceDetail.taxNumber||'')+')':'')"
	          classForName="infoLabel5" classForValue="infoLabel7"></InfoLabel>
	        <InfoLabel style="marginTop:10px" v-if="orderDetail.expressInfo && orderDetail.expressInfo.receiverInfo" infoName="配送地址" :infoValue="orderDetail.expressInfo.receiverInfo.area +' ' + '*****'+'  '+orderDetail.expressInfo.receiverInfo.name
						+' (收)   联系电话  '+orderDetail.expressInfo.receiverInfo.phone"
	          classForName="infoLabel5" classForValue="infoLabel7"></InfoLabel>
	      </div>
    	</div>
      <div class="wuliuInfo" v-if="orderDetail.orderBase && !!orderDetail.expressInfo && !!orderDetail.expressInfo.orderNoForExpress">
        <div>
          <div class="wuliuShop">       
              <img :src="logoUrl" />
			  <div class="cpyName">{{!!orderDetail.expressInfo && !!orderDetail.expressInfo.expressCompanyInfo ? orderDetail.expressInfo.expressCompanyInfo.expressCompanyName:''}}</div>
          </div>
		  <div class="wuliuShop">
              <InfoLabel infoName="运单号" :infoValue="!!orderDetail.expressInfo ? orderDetail.expressInfo.outerExpressOrderNo||orderDetail.expressInfo.orderNoForExpress:''">
              </InfoLabel>
				<div class="showButtonWrapExpress" v-if="showUpdataeIcon">
					<div class="wuliuInfoImg">
					<span class="cursorp" @click="showDialogExpress=!showDialogExpress">编辑</span>
					</div>
					<div class="dialogShow" style="left:0;height: 170px;" v-show="showDialogExpress">
					<div class="title">
						<span>编辑运单号</span>
					</div>
					<div class="line2">
						<span>请准确填写快递单号，以便向用户推送物流信息</span>
					</div>	          
					<div class="line4">
						<span>物流单号</span>
						<input type="text" v-model.trim="expressNo" placeholder="请填写物流单号" />
					</div>
								<div class="line3" v-if="false">
									<span>快递公司</span>
									<select v-model="selectExpressCpy">
										<option v-for="type in expressArr" :key="type.expressCompanyNo" :value="type.expressCompanyNo">{{type.expressCompanyName}}</option>
									</select>						
								</div>	          
					<div class="line5">
						<span class="cursorp" @click="showDialogExpress=false">取消</span>
						<span class="cursorp" @click="updateExpress">确定</span>
					</div>              
					</div>
				</div>
		  </div>
		  <div class="wuliuShop">
              <InfoLabel infoName="快递费发票" :infoValue="'￥' + (!!orderDetail.expressInfo && orderDetail.expressInfo.expressFee)">
              </InfoLabel>		
			  <div class="showButtonWrapExpress" v-if="!!orderDetail.invoiceDetail && !!orderDetail.invoiceDetail.invoicePdfUrl && orderDetail.invoiceDetail.invoicePdfUrl.length>0">
				<div class="wuliuInfoImg">
					<span class="cursorp" @click="downPDf(orderDetail.invoiceDetail.invoicePdfUrl)">下载PDF</span>
				</div>
			</div>		
		  </div>
        </div>
        <div class="wuliuDetail" v-if="orderDetail.orderBase && !!orderDetail.expressInfo && !!orderDetail.expressInfo.expressDetails
			&& orderDetail.expressInfo.expressDetails.length>0">
          <div class="statusList">
			  <div v-for="(eItem,pos) in expressStatuslist" :key="pos">
				  <div v-if="pos==0">
				  	<div class="statusLine" :class="{'lastOk':eItem.isLastOk}">{{eItem.name}}</div>
					<div class="onepoint"></div>
				  </div>
				  <div v-else-if="eItem.isOk" class="statusLine">
					  <div class="oneline"></div>
					  <div>
						<div :class="{'lastOk':eItem.isLastOk}">{{eItem.name}}</div>
						<div class="onepoint"></div>
					  </div>
				  </div>
				  <div v-else class="statusLine1">
					  <div class="onelinegray"></div>
					  <div>
						<div class="textgray">{{eItem.name}}</div>
						<div class="onepointgray"></div>
					  </div>
				  </div>
			  </div>
		  </div>
		  <div class="wuliuphones">
			  <InfoLabel infoName="联系快递员" :infoValue="'￥' + !!orderDetail.expressInfo && orderDetail.expressInfo.expressContactPhone">
              </InfoLabel>
			  <div class="spaceLine"></div>
			  <InfoLabel infoName="联系快递客服" :infoValue="!!orderDetail.expressInfo && orderDetail.expressInfo.expressCompanyInfo 
			  	&& orderDetail.expressInfo.expressCompanyInfo.expressCompanyPhone">
              </InfoLabel>
		  </div>
		  <ExpressDetailItem v-for="item in expresslist" :key="item.expressLocationTime" v-bind:expressItem='item' />
        </div>
        <div class="lineExpressEmpty" v-else>
            <div><img src="~assets///icon_no_express.png"/></div>
            <div>待快递人员上门揽件，暂无物流信息</div> 
        </div>
      </div>
		<div v-else class="mailDiv">
			<div class="mailDivName">
				<span v-if="mailStatus == 1">航班已起飞，请及时邮寄报销凭证</span>
				<span v-else-if="mailStatus == 2">请在航班起飞后邮寄报销凭证</span>
			</div>
			<div class="showButtonWrapExpress">
			<div :class="mailStatus == 1 ? 'wuliuInfoImg':'wuliuInfoImg2'">
				<span class="cursorp" v-if="mailStatus == 1" @click="openMailBox">邮寄报销凭证</span>
				<span v-else>邮寄报销凭证</span>
			</div>
			</div>      	
		</div>    		
    </div>

    <!--底部标签-->
    <div class="bottomDiv">
      <InfoLabel :infoName="'本产品由'+orderDetail.orderBase.providerShortName+'提供服务，联系电话'" :infoValue="orderDetail.orderBase.providerPhone"
        classForName="infoLabel31" classForValue="infoLabel7">
      </InfoLabel>
    </div>

    <div v-transfer-dom v-show="showMailBox">
        <mailPop  :ifShowTips = "ifShowTips" :orderItem = "orderDetail.orderBase" title="邮寄报销凭证" :itineraries="simpleInfo" 
        :expressCpy="expressArr" :proviceCityCounty="proviceCityCounty" :senderAddressList="senderAddressList" :showComp="showComp"
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
	const Description = () => import("./flightregulations/description.vue");
    const OrderBaseDetail = () => import("./commoninfo.vue");
    const FlightPassenger = () => import("./flightpassenger.vue");
    const flightTuiCard = () => import("./flightrefundcard.vue");
    const flightInsuranceCard = () => import("./flightinscard.vue");
    const InfoLabel = () => import("biscomponents/infolabel/msglabel.vue");
    const ExpressDetailItem = () => import("biscomponents/express/listitem.vue");
    const mailPop = () => import("biscomponents/mail/index/index.vue");
    const mailSucessBox = () => import("biscomponents/mail/sucess/sucess.vue");  

	import utils from "bislibs/utils";
	import  * as travelfun from "bislibs/traveloperationfun.js";
    import tmHandler from 'bislibs/requesthandler/traveloperationhandler.js';   
	export default {
		directives: {
		},        
		components: {
			flightInsuranceCard,
			flightTuiCard,
			InfoLabel,
			FlightPassenger,
			ExpressDetailItem,
			OrderBaseDetail,
            Description,
            mailPop,
            mailSucessBox,
		},
		props: {
			orderNo:{
				type:String,
				required: true,
			}
		},
		computed: {       
            showUpdataeIcon:function(){
                let result =true; 
				//GOT=已揽件，TRANSPORTING=运输中，SENT_SCAN=派件中，SIGNED=已签收 ACCEPT=已下单，你可以不用展示
                if(!!this.orderDetail.expressInfo && !!this.orderDetail.expressInfo.expressStatusAndTime){
                    for(let i=0;i<this.orderDetail.expressInfo.expressStatusAndTime.length;i++){
                        //已签收,已邮寄
                        if(this.orderDetail.expressInfo.expressStatusAndTime[i].status=='已签收' 
							|| this.orderDetail.expressInfo.expressStatusAndTime[i].status=='SIGNED'){
                            result = false;
                            break;
                        }
                    }
                }
                return result;
            },            
			logoUrl:function(){
				return travelfun.getExpressLogo(this.orderDetail.expressInfo);				
			},
			expresslist:function(){
				let list = this.orderDetail.expressInfo.expressDetails;
				if(!!list){
					for(let i=0;i<list.length;i++){
						if(i==0){
							list[i].isLastPoint = true;
							}else if(i==(list.length - 1)){
							list[i].isFirstPoint = true;
						}
					}
				}
				return list||[];
			},
			expressStatuslist:function(){
				let result = []
				const maxLength = 4;
				const statusObj = {GOT:{name:'已揽件',index:3},TRANSPORTING:{name:'运输中',index:4},SENT_SCAN:{name:'运输中',index:5}
					,SIGNED:{name:'已签收',index:6},ACCEPT:{name:'已下单',index:2},WAIT_TO_ACCEPT:{name:'待接单',index:1}};
				if(!!this.orderDetail.expressInfo && !!this.orderDetail.expressInfo.expressStatusAndTime){
                    for(let i=0;i<this.orderDetail.expressInfo.expressStatusAndTime.length;i++){
						let sItemap = this.orderDetail.expressInfo.expressStatusAndTime[i].status
						if( sItemap== 'ACCEPT' || sItemap== 'WAIT_TO_ACCEPT' ){
							continue
						}
						let item = {
							name:statusObj[sItemap].name,
							index:statusObj[sItemap].index,
							isOk:1
						}
						result.push(item)
                    }
                }
				//排序列表，
				if(result.length > 0){
					result.sort((item1,item2)=>{
						return item1.index - item2.index
					})
					result[result.length-1].isLastOk=1
				}
				//补充状态
				let nowLenght = result.length
				const array = ['已揽件','运输中','派件中','已签收']
				if(nowLenght >0 && nowLenght < maxLength){
					for(let i=nowLenght;i<maxLength;i++){
						let item = {
							name:array[i],
							isOk:0
						}
						result.push(item)
					}
				}
				return result;
			},
			//所有的航班，包括改签航班
			orderAllAirLines:function(){
				let result = [];
				//从改签单里面取出 非改签失败的单子
				if(!!this.orderDetail.gaiOrderList && this.orderDetail.gaiOrderList.length > 0){
					for(let i=0;i<this.orderDetail.gaiOrderList.length;i++){
						//只要不是改签失败，永远显示改签单
						if(this.orderDetail.gaiOrderList[i].chaStatus != 3 && this.orderDetail.gaiOrderList[i].chaStatus != 9){
							let gaiOrder = JSON.parse(JSON.stringify(this.orderDetail.gaiOrderList[i]));
							let airline = JSON.parse(JSON.stringify(this.orderDetail.gaiOrderList[i].chaFlightInfo));
							//改签航班需要加上改签信息
							delete gaiOrder.chaFlightInfo
							airline.gaiOrder = gaiOrder;
							//标记位改签单
							airline.isGaiOrder = true;
							//改签单的Passengers不是空数组，需要从原来的航班里面把人的status强制改为已改签16
							if(airline.passengers && airline.passengers.length > 0){
								for(let j=0;j<this.orderDetail.airLines.length;j++){
									if(this.orderDetail.gaiOrderList[i].oldAirlineIds.indexOf(this.orderDetail.airLines[j].airLineID) != -1){
										for(let k=0;k< this.orderDetail.airLines[j].passengers.length;k++){

											//可能多个人一起改签，都要加上
											if(this.orderDetail.gaiOrderList[i].psgIDs.indexOf(this.orderDetail.airLines[j].passengers[k].psgId) != -1){
												//如果改签单找到了原订单，并且改签单已经成功，那么将原订单的状态强制改为改签成功 												
												if(this.orderDetail.gaiOrderList[i].chaStatus == 4){
													this.orderDetail.airLines[j].passengers[k].status = 16;
												}
											}
										}
										//改签单的航班号 跟 原航班号 肯定是一一对应的，只要找到原航班号，后面的就不需要遍历了
										j = this.orderDetail.airLines.length;
									}
								}
							}else{
							//改签单的Passengers为空数组，需要从原来的航班里面把人的信息拿过来	
								airline.passengers=[]	
								for(let j=0;j<this.orderDetail.airLines.length;j++){
									if(this.orderDetail.gaiOrderList[i].oldAirlineIds.indexOf(this.orderDetail.airLines[j].airLineID) != -1){
										for(let k=0;k< this.orderDetail.airLines[j].passengers.length;k++){
											//可能多个人一起改签，都要加上
											if(this.orderDetail.gaiOrderList[i].psgIDs.indexOf(this.orderDetail.airLines[j].passengers[k].psgId) != -1){
												let persion = JSON.parse(JSON.stringify(this.orderDetail.airLines[j].passengers[k]));
												airline.passengers.push(persion);
												//如果改签单找到了原订单，并且改签单已经成功，那么将原订单的状态强制改为改签成功 
												if(this.orderDetail.gaiOrderList[i].chaStatus == 4){
													this.orderDetail.airLines[j].passengers[k].status = 16;
												}
											}
										}
										//改签单的航班号 跟 原航班号 肯定是一一对应的，只要找到原航班号，后面的就不需要遍历了
										j = this.orderDetail.airLines.length;
									}
								}
							}
							result.push(airline);
						}
					}
				}
				result = result.concat(this.orderDetail.airLines);
				return result;
			},
			//该机票订单时候需要显示 手动退款 业务
			orderHasManualRefund:function(){
				//退款单，无论什么支付方式，必须等待供应商操作后才显示在页面上。
				//如果是 企业代付，需要手动介入，直接就是退款成功；如果是第三方支付，需要显示发起退款功能。
				if(!!this.orderDetail.tuiOrderList){
					for(let i=0;i<this.orderDetail.tuiOrderList.length;i++){
						//必须是OutterRefStatus有值，表示供应商退款成功了，才显示
						if(this.orderDetail.tuiOrderList[i].outterRefStatus >= 0){
							return true;
						}
					}
				}
				return false; 
			},
			expressArr:function(){
				//快递公司数据列表
				let cpyList = !!utils.getStorage("expressCompanies") ? JSON.parse(utils.getStorage("expressCompanies")) : []
				return cpyList;
            },
            proviceCityCounty:function(){
				//省市区列表
				let proviceCityCountyList = !!utils.getStorage("proviceCityCounty") ? JSON.parse(utils.getStorage("proviceCityCounty")) : []
				return proviceCityCountyList;
            },
			/**
			 * 1 是可以邮寄，2、3 不可以，2是航班未起飞，3是其他原因退票等
			 */
			mailStatus:function(){
                let result = 0;
                 if(!!this.orderDetail.expressInfo && !!this.orderDetail.expressInfo.expressFlag==1 && !!this.expressArr && !!this.expressArr.length > 0){
                    result =1;
                 }else{
                    result =2;
                 }
                 return result;
			},		
			tuiGaiDetail:function(){
				return (!!this.orderDetail.airLines && this.orderDetail.airLines.length > 0) ? this.orderDetail.airLines[0].guestRule : undefined;
			},
			//机票保险列表。某人的某个行程 是唯一标识。
			insProductList:function(){
                let result = JSON.parse(JSON.stringify(this.orderDetail.insuranceOrders || []));
                if(this.orderDetail.orderBase.flightType==1){
                    //往返程 需要区分 航班是 去程 还是 返程
                    for(let i=0;i<result.length;i++){
                        for(let j=0;i<this.orderAllAirLines.length;j++){
                            if(result[i].airLineBriefInfo.airLineID == this.orderAllAirLines[j].airLineID){
                                result[i].airLineBriefInfo.specificVoyage =  this.orderAllAirLines[j].specificVoyage;
                                break;
                            }
                        }
                    }
                }
                return result;
                // return [];
            },
            simpleInfo:function(){
                let result="";
                if(this.orderDetail.airLines.length > 0){
                    let airLine = this.orderDetail.airLines[0];
                    let customersArr = airLine.passengers;
                    for(let i=0;i<customersArr.length;i++){
                        result+=customersArr[i].psgName;
                        if(i != customersArr.length-1){
                            result+="、";
                        }else{
                            result+=";"
                        }
                    }
                    result+=airLine.sCityName+"--"+airLine.eCityName+";"
                    result+=airLine.airLineName+airLine.flightNo;
                }
                
                return result;
            },                
		},
		data() {
			return {
				orderDetail:{
					orderBase:{},
					airLines:[],
					tuiOrderList:[],
					changeOrderList:[],
					invoiceInfo:{},
					expressInfo:{},
				},
				showDialogluggage:false,//是否弹框显示行李额
				showDialogExpress:false,//是否弹框显示编辑运单号
				expressNo:null,//输入的运单号
				popDes:'',//弹框显示内容
                selectExpressCpy:null,//选择的物流公司
                showMailBox:false,//显示邮寄弹框
                showMailSucessBox:false,//显示邮寄成功        
                mailResponse:"",//邮寄成功的快递信息
                isLoading: false,
                loadingText:"正在生成运单号...",
                ifShowTips:false,//首次进入的提示弹框         
                senderAddressList:[],//常用地址列表        
                showComp:false,//是否显示省市区组件       
			}
		},
		watch:{
            showDialogluggage: {
                handler(val) {
                	if(this.showDialogluggage){
                		this.popDes ="行李额"
                	}
                },
                deep: true
            },	            
		},
		created() {
			// console.log("机票订单详情:orderNo="+this.orderNo);
			this.getFlightOrderDetail();
			// 监听body点击事件,判断点击元素如果为className不为explain,则让弹框隐藏
			let that = this;
            // document.body.addEventListener('click', function(e){
            //     if (e.target.className.indexOf('explain') < 0) {
            //         that.showDialogluggage = false;
            //     }
            // }, true)
		},
		beforeDestroy () {
            let that = this;
            // document.body.removeEventListener("click", function(e){
            //     if (e.target.className.indexOf('explain') < 0) {
            //         that.showDialogluggage = false;
            //     }
            // }, true)
        },
		mounted() {},
		methods: {
            /**
             * 动态获取航司Logo
             */
            getAirLogo(airCode){
                return utils.getAirCpyLogo(airCode);
            },
            /**
             * 查询寄件人地址信息列表
             */
            getSenderInfos() {
                let _this = this;
                let request = {
					channelId:'1'
				};
                tmHandler.getSenderInfos(request)
                .then(
                    function(res) {
                        if (0 == res.resultCode && !!res.result.senderInfos) {
                            _this.senderAddressList = res.result.senderInfos || [];
                        } else {
                            console.info(res);
                            _this.senderAddressList = [];
                        }
                    },
                    function(error) {
                        console.info(error);
                        _this.senderAddressList = [];
                    }
                );
            },                    
			/**
			 * 获取订单详情
			 */
			getFlightOrderDetail(){
				let _this = this;
				let data = {
					"orderNo":_this.orderNo,
				};
                tmHandler.getFlightOrderDetail(data)
                .then(function(res) {
					if(0 == res.resultCode) {
						let response = res.result;
						if(response.expressInfo){
							response.orderBase.expressFlag = response.expressInfo.expressFlag
						}
						_this.orderDetail = response;
					}else{
						utils.showToast(res.resultMessage||"接口调用失败")		
					}
					}, function(error) {
						console.info(error);
					});				
			},	
			/**
			 * 发起退款
			 */			
			startRefMoney(tuiOrder) {
				let _this = this;
				let data = {
					"orderNo":_this.orderNo,
					"refundNo":tuiOrder.refOrderNo,
					"refundAmount":(Number(tuiOrder.partialRefundAmount)||0),
                };
                tmHandler.refund(data)
                 .then(function(res) {
						if(0 == res.resultCode) {
							utils.showToast('发起退款成功');
							//理论上发起退款之后，需要重新刷新当前页面的数据
							_this.getFlightOrderDetail();
						}else{
							utils.showToast(res.resultMessage || '发起退款失败');
						}
					}, function(error) {
						console.info(error);
					});						
			},			
			luggagePop(){
				this.showDialogluggage= true;
			},	
			closeluggagePop(){
				this.showDialogluggage=false;				
			},
			/**
			 * 提交快递信息
			 */
			updateExpress(){
				let _this = this;
				//参数校验
				if(!_this.expressNo){
					utils.showToast("请输入正确数据");
					return;
				}				
				let data = {
					expressOrderNo: !!_this.orderDetail.expressInfo ? _this.orderDetail.expressInfo.orderNoForExpress:'',
					expressCompanyNo: !!_this.orderDetail.expressInfo?_this.orderDetail.expressInfo.expressCompanyInfo.expressCompanyNo:'',
					orderNo: _this.orderDetail.orderBase.orderNo,
				};
				!!_this.expressNo && (data.outerExpressOrderNo = _this.expressNo);
				tmHandler.modifyExpressInfo(data)
                .then(function(res) {
					if(0 == res.resultCode) {
						utils.showToast("编辑成功");
						_this.showDialogExpress=false;
						//提交成功，刷新列表数据
						_this.getFlightOrderDetail();						
					} else {
						console.info(res);
						utils.showToast("编辑失败");
					}
				}, function(error) {
					console.info(error);
				});				
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
                this.getFlightOrderDetail();
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
				copyinData.receiverAddress.orderNo = _this.orderDetail.orderBase.orderNo

				console.log('addExpressInfo');
				//参数校验
                let request={
                    expressCompanyNo:copyinData.selectCpys[0].expressCompanyNo,
                    senderInfo:copyinData.senderAddress,
					orderNoAndReceiverInfo:[copyinData.receiverAddress],
                };

                _this.isLoading = true;
                tmHandler.addPatchExpressInfos(request)
                .then(function(res) {
                    _this.isLoading = false;
                    if(0 == res.resultCode) {
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
                //只有弹出邮寄页面，才调用常用联系人地址
               this.getSenderInfos();
               this.ifShowTips = !!utils.getStorage("mailBoxPopTips1") && parseInt(utils.getStorage("mailBoxPopTips1")) == 0? false: true;
               this.showComp = true;
               this.showMailBox=true;
            },   
			//
			downPDf(pdfs){
				pdfs && pdfs.forEach(element => {
					window.open(element)
				});
			}                         
		},
	}
</script>
<style scoped lang="less">
	.orderItemFly {
		.airlineItemSpan {
			margin-bottom: 20px;
			.aireLineinfoAll {
				background: #478aee;
				position: relative;
				.aireLineinfo {
					display: flex;
					align-content: space-between;
					padding: 20px 40px;
					.leftDiv {
						flex: 3;
						color: white;
						.aireLineName {
							display: flex;
							align-content: flex-start;
							margin-bottom: 40px;
							align-items: center;
							img {
								height: 25px;
								width: 25px;
                                margin-right: 5px;
                                background: white;
							}
							.name {
								font-size: 16px;
								margin-right: 20px;
							}
						}
						.aireLineStation {
							display: flex;
							justify-content: flex-start;
							align-items: baseline;
							.station {
								font-size: 28px;
								margin-right: 135px;
								.time {
									font-size: 16px;
									margin-top: 10px;
								}
							}
							span {
								font-size: 16px;
								align-self: center;
								color: white;
							}
						}
					}
					.rightDiv {
						flex: 2;
						margin-top: 20px;
						color: white;
						.rightBottom {
							margin-top: 10px;
							display: flex;
							justify-content: center;
							div {
								padding: 0 20px;
								border-right: 1px solid #FFFFFF;
							}
							div:nth-child(3) {
								border-right: 1px solid transparent;
							}
						}
						.rightTop {
							display: flex;
							justify-content: flex-start;
							.startT {
								font-size: 28px;
								.startName {
									margin-bottom: 40px;
								}
							}
							.airelineTime {
								display: flex;
								align-content: flex-start;
								font-size: 14px;
								align-items: center;
								img {
									height: 22px;
									width: 22px;
								}
								.timeLong {
									margin: 0px 4px 0px 10px;
									.allTime {
										text-align: center;
										height: 20px;
									}
									.lineDiv {
										margin: 6px 0px;
										height: 11px;
										width: 162px;
										background: url(~assets//icon_train_arrorow.png) no-repeat;
									}
									.stops {
										text-align: center;
										display: flex;
										justify-content: center;
									}
								}
								.airlogo {
									display: none;
									height: 15px;
									width: 22px;
									margin-right: 10px;
									background: url(~assets//icon_flight.png) no-repeat;
								}
							}
						}
					}
				}
				.iconBack {
					position: absolute;
					background: transparent;
					top: 0;
					/*right: 0;*/
					.iconCss {
						height: 60px;
						width: 60px;
						right: 0px;
						top: 0px;
						background: url(~assets//gai.png) no-repeat;
						background-size: contain;
					}
				}
			}
		}
		.tuigaiDiv {
			height: auto;
			display: flex;
			justify-content: flex-end;
			background: #F4F4F4;
			color: #478aee;
			font-size: 16px;
			align-items: flex-end;
			margin-bottom: 10px;
			span {
				margin-right: 60px;
				margin-left: 5px;
			}
			.img {
				height: 22px;
				width: 22px;
				background: url(~assets//icon_mail_alert.png) no-repeat;
			}
		}
		.baoxiaoDiv {
			/*报销*/
			padding: 60px 40px;
			margin-bottom: 50px;
			background: white;
			.baseInfoTop {
				display: flex;
				justify-content: space-between;
				border-bottom: 1px dashed #7F7F7F;
				.baseInfo {
					padding-bottom: 30px;
					font-size: 16px;
					.titleDiv {
						color: #333333;
						font-size: 18px;
						margin-bottom: 30px;
						InfoLabel {
							margin-bottom: 20px;
						}
					}
					.baoxiao {
						margin: 10px 0px;
						display: flex;
						justify-content: flex-start;
						.spanL {
							color: #7F7F7F;
						}
						.spanM {
							color: #333333;
						}
						.spanR {
							color: #F83939;
						}
					}
				}
			}
            .mailDiv {
                padding-bottom: 10px;
                align-self: flex-end;
                font-size: 16px;
                display: flex;
                justify-content: flex-end;
                margin-top: 10px;    
                .mailDivName {
                    height: 32px;
                    line-height: 32px;
                    margin-right: 10px;
                }
            }
			.wuliuInfo {
				display: flex;
				justify-content: flex-start;
				padding-top: 30px;
				align-items: center;
				.wuliuShop {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					margin-bottom: 10px;
					margin-right: 30px;
					img {
						// width: 75px;
						height: 56px;
					}
					.baseinfo {
						font-size: 16px;
						margin-left: 20px;
						color: #191919;
					}
					.cpyName{
					   margin-left: 20px;
    					font-size: large;						
					}
				}
				.wuliuDetail {
					width: 480px;
					overflow: scroll;
					border-left: 1px solid #f4f4f4;
					padding: 25px;
					font-size: 12px;
					height: 220px;
					iframe {
						width: 100%;
					}
					.statusList{
						display: flex;
						flex-wrap: wrap;
						.onepoint{
							width: 10px;      
							height: 10px;     
							background-color:#478aee;      
							border-radius: 50%;      
							-moz-border-radius: 50%;      
							-webkit-border-radius: 50%;
							margin: auto;
						}
						.onepointgray{
							width: 10px;      
							height: 10px;     
							background-color:#7F7F7F;      
							border-radius: 50%;      
							-moz-border-radius: 50%;      
							-webkit-border-radius: 50%;
							margin: auto;
						}
						.oneline{
							height: 2px;
							width: 40px;
							background: #478aee;
							margin-bottom: 4px;
						}
						.onelinegray{
							height: 2px;
							width: 40px;
							background: #7F7F7F;
							margin-bottom: 4px;
						}
						.statusLine{
							color: #478aee;
							display: flex;
							align-items: flex-end;
						}
						.statusLine1{
							color: #7F7F7F;
							display: flex;
							align-items: flex-end;
						}
						.lastOk{
							border: 1px solid #478aee;
							color: #FFFFFF;
							border-radius: 3px;
							background: #478aee;
							margin: 1px 0px;
							padding: 2px;
						}		
						.textgray{
							margin: 4px 0;
						}				
					}
					.wuliuphones{
						display: flex;
						.spaceLine{
							width: 1px;
							height: 15px;
							border-right: 1px dashed #000000;
							margin: 0 15px;
						}
					}
                }
                .lineExpressEmpty{
                    width: 480px;
                    height: 220px;
                    padding: 25px;
                    border-left: 1px solid #f4f4f4;
                    text-align: center;
                    img{
                    width: 54px;
                    height: 54px;
                    // background: url(~assets///icon_no_express.png) no-repeat center;                    
                }                
                }                
			}
			.showButtonWrapExpress {
				position: relative;
				.wuliuInfoImg {
					line-height: 32px;
					height: 32px;
					// width: 160px;
					padding: 0 10px;
					background: #478aee;
					text-align: center;
                    border-radius: 5px;
                    margin: 0 10px;
					// float: right;
					span {
						color: white;
						align-self: center;
					}
				}
				.wuliuInfoImg2 {
					line-height: 32px;
					height: 32px;
					width: 160px;
					background: gray;
					text-align: center;
					border-radius: 5px;
					margin: 0 auto;
					span {
						color: white;
						align-self: center;
					}
				}
				.dialogShow {
					position: absolute;
					bottom: 40px;
					right: 0;
					height: 200px;
					width: 360px;
					padding: 15px;
					box-shadow: 0px 2px 10px rgba(0, 0, 0, .5);
					background: #fff;
					z-index: 1;
					border-radius: 5px;
					.title {
						text-align: center;
						font-size: 18px;
						color: #333333;
					}
					.line2 {
						text-align: center;
						font-size: 14px;
						color: #666666;
						margin: 10px 0;
					}
					.line3 {
						display: flex;
						margin: 10px auto;
						justify-content: center;
						width: auto;
						color: #333333;
						font-size: 14px;
						span {
							margin-right: 20px;
						}
						select {
							width: 230px;
							border: 1px solid #C2C2C2;
						}
					}
					.line4 {
						display: flex;
						margin: 10px auto;
    				justify-content: center;	
						width: auto;
						color: #333333;
						font-size: 14px;
						span {
							margin-right: 20px;
						}
						input {
							width: 230px;
							border: 1px solid #C2C2C2;
						}
					}
					.line5 {
						display: flex;
						justify-content: space-around;
						border-top: 1px solid #c2c2c2;
						padding-top: 10px;
						span {
							padding: 5px 35px;
							font-size: 14px;
							background: #C2C2C2;
							color: #333333;
						}
						span:nth-child(2) {
							color: white;
							background: #478aee;
						}
					}
				}
			}
		}
		.bottomDiv {
			font-size: 10px;
			display: flex;
			justify-content: center;
			margin-bottom: 50px;
		}
		.showButtonWrap {
			position: relative;
			.dialogShow {
				position: absolute;
				right: 30px;
				top: 30px;
				height: 290px;
				width: 480px;
				padding: 20px;
				box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.5);
				background: #fff;
				z-index: 1;
				border-radius: 5px;
				overflow: auto;
				.lineContent {
					font-size: small;
					color: #333333;
					text-align: center;
					/*width: 80%;*/
					margin: 0 auto;
					overflow-y: scroll;
				}
				.lineCancel {
					text-align: center;
				}
			}
		}
	}
</style>
<style lang="less">
  .couponLoading{
      width: 150px;
      .weui-toast{
          width: 150px;
      }    
    }
</style>