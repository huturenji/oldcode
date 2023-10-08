<template>
<div>
	<div v-if="isLoadData" class="loading-container">
		<span>数据加载中...</span>
	</div>
	<div v-else class="orderItemFly">	
		<!--订单信息模块-->
		<OrderBaseDetail :orderDetail="orderDetail" orderType="Insurance" @refreshPage="getInsuranceOrderDetail"/>
		
		<!-- 保险详情 -->
		<div class="Insurance_box">
			<div class="flight_top clearfix">
				<img :src="require('assets//airlogo/'+ getAirLogo(orderDetail.airLineBriefInfo.airLineCode)+'.png')"/>
				<div>{{orderDetail.airLineBriefInfo.airCompanyName}}{{orderDetail.airLineBriefInfo.flightNo}}</div>
				<div class="city">
					<span v-if="!!orderDetail.airLineBriefInfo.departCityName">{{orderDetail.airLineBriefInfo.departCityName}}</span>
					<span v-if="!!orderDetail.airLineBriefInfo.arriveCityName">—</span>
					<span v-if="!!orderDetail.airLineBriefInfo.arriveCityName">{{orderDetail.airLineBriefInfo.arriveCityName}}</span>
				</div>
				<div v-if="!!orderDetail.airLineBriefInfo.departTime" class="date">{{orderDetail.airLineBriefInfo.departTime}}</div>
			</div>
			<div class="insurance_detals">
				<div class="title">
					<span class="name">{{orderDetail.insuranceProduct.productShortName || orderDetail.orderBase.productShortName}}</span>
					<span class="shot_name">{{orderDetail.insuranceProduct.shortDescription}}</span>
				</div>
				<div v-if="orderDetail.insuredInfos && orderDetail.insuredInfos.length>0" class="insurance_psg">
					<div v-for="(item, index) in childInsureList" :key="index" class="psg_item">
						<div class="tableLine" :class="{'darkBg':index==0,'noTitleSize':index!=0}">
						<span>{{item.name}}</span>
						<span class="span2">{{item.cardType}}</span>
						<span class="span4">{{item.cardNo}}</span>
						<span>{{item.gender}}</span>
						<span class="span">{{item.birthDay}}</span>
						<span class="span2">{{item.phone}}</span>
						<span class="span2">{{item.ticketNum}}</span>
						<span class="span2">{{item.statusMsg}}</span>
						<span class="span2">{{item.policyNo}}</span>
						<span>{{item.insuranceNum}}</span>
						<span>{{item.premium}}</span>
						</div>
						<!-- <div v-if="item.excetpionOrder" class="errorBox">
							<div class="imgDiv"/>
							<div>{{item.statusMsg}}</div>
							<div class="errmsg">{{item.errorMessage}}</div>
						</div> -->
					</div>
				</div>
				<div class="details">
					<div class="top">
						<span v-if="!!orderDetail.insuranceProduct.companyName">本产品由{{orderDetail.insuranceProduct.companyName}}承保</span>
					</div>
					<div class="title_new">
						保险详情
					</div>
					<div v-if="!!orderDetail.insuranceProduct.detailDescription" v-html="orderDetail.insuranceProduct.detailDescription"></div>
				</div>	
			</div>
		</div>

		<!--底部标签-->
		<!-- <div class="bottomDiv">
		<InfoLabel :infoName="'本产品由'+orderDetail.orderBase.providerShortName+'提供服务，联系电话'" :infoValue="orderDetail.orderBase.providerPhone"
			classForName="infoLabel31" classForValue="infoLabel7">
		</InfoLabel>
		</div> -->


		
	</div>
</div>	
</template>

<script>
  
    const OrderBaseDetail = () => import("./commoninfo.vue");
    const InfoLabel = () => import("biscomponents/infolabel/msglabel.vue");
    import utils from "bislibs/utils";
import  * as travelfun from "bislibs/traveloperationfun.js";	
	import tmHandler from 'bislibs/requesthandler/traveloperationhandler.js';   

	export default {
		directives: {
		},        
		components: {
			InfoLabel,
			OrderBaseDetail,
		},
		props: {
			orderNo:{
				type:String,
				required: true,
			},
		},
		computed: {       
			
		},
		data() {
			return {
				orderDetail:{
					orderBase:{},
					airLineBriefInfo:{},
					insuranceProduct:{},
					airLines:[],
				},
		      headerLine: [
				"姓名",
				"证件类型",
				"证件号码",
				"性别",
				"出生日期",
				"手机号码",
				"票号",
				"保单状态",
				"保单编号",
				"份数",
				"单价"
				], //表头		
      			childInsureList: [], //保单列表				
				showDialogluggage:false,//是否弹框显示行李额
				popDes:'',//弹框显示内容 
				isLoadData: true,//数据loading标识                 
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
			this.getInsuranceOrderDetail();
			// 监听body点击事件,判断点击元素如果为className不为explain,则让弹框隐藏
			let that = this;
            document.body.addEventListener('click', function(e){
                if (e.target.className.indexOf('explain') < 0) {
                    that.showDialogluggage = false;
                }
            }, true)
		},
		beforeDestroy () {
            let that = this;
            document.body.removeEventListener("click", function(e){
                if (e.target.className.indexOf('explain') < 0) {
                    that.showDialogluggage = false;
                }
            }, true)
        },
		mounted() {},
		methods: {                 
			/**
			 * 获取订单详情
			 */
			getInsuranceOrderDetail(){
				let _this = this;
				let data = {
					"orderNo":_this.orderNo,
				};
				_this.isLoadData = true;
                tmHandler.getInsuranceOrderDetail(data)
                .then(function(res) {
					if(0 == res.resultCode) {
						_this.isLoadData = false;
                        let response = res.result.insuranceOrder;
						response.orderBase = response.orderBase
						response.orderBase.type = '保险';
						_this.orderDetail = response;
						_this.getChildOrders(_this.orderDetail)

					}else{
						_this.isLoadData = false;
						// console.info(error);
						utils.showToast(res.resultMessage||"接口调用失败")						
					}
					}, function(error) {
						_this.isLoadData = false;
						console.info(error);
						utils.showToast("接口调用失败")
					});				
			},	
			orderStatusDes(item) {
				return utils.getInsuranceOrderStatus(item.status)||"---";
			},
			/**
             * 动态获取航司Logo
             */
            getAirLogo(airCode){
                return utils.getAirCpyLogo(airCode);
            },
		    getChildOrders(val){
				let that = this;
				// 动态赋值页面数据
				if (val && val.insuredInfos && val.insuredInfos.length > 0) {
					let result = [];
					let tabline = {
					name: that.headerLine[0],
					cardType: that.headerLine[1],
					cardNo: that.headerLine[2],
					gender: that.headerLine[3],
					birthDay: that.headerLine[4],
					phone: that.headerLine[5],
					ticketNum: that.headerLine[6],
					statusMsg: that.headerLine[7],
					policyNo: that.headerLine[8],
					insuranceNum: that.headerLine[9],
					premium: that.headerLine[10]
					};
					result.push(tabline);
					for (let i = 0; i < val.insuredInfos.length; i++) {
					let insure = val.insuredInfos[i];
					tabline = {
						name: insure.name,
						cardType: that.parseCardType(insure.cardType),
						cardNo: that.parseCardNO(insure.cardNo),
						gender: that.parseGender(insure.gender),
						birthDay: insure.birthDay ? new Date(insure.birthDay).format("yyyyMMdd"):"---",
						phone: insure.phone||"---",
						ticketNum: insure.ticketNum||"---",
						statusMsg: that.orderStatusDes(insure),
						policyNo: insure.policyNo||"---",
						insuranceNum: insure.insuranceNum + "份",
						premium: "￥" + insure.premium,
						excetpionOrder: insure.exceptionStatus!=0 || !!insure.errorMessage,
						errorMessage: "原因：" + insure.errorMessage
					};
					result.push(tabline);
					}
					that.childInsureList = result;
				}			   
		    },
			/**
			 * 解析证件的展示
			 */
			parseCardType(cardType) {
				return utils.getCardTypeName(parseInt(cardType));
			},
			/**
			 * 解析性别
			 */
			parseGender(param) {
				return utils.getGenderName(parseInt(param));
			},		
			parseCardNO(param){
				//身份证15或18位，正则匹配，否则源码输出。
				// var reg = new RegExp("(\\d{1})(\\d{13,16})(\\d{1})");
				// return param.replace(reg, "$1****************$3");
				return utils.getFormatCardNo(param)
			},          
		},
	}
</script>
<style scoped lang="less">
	*{
		box-sizing: border-box;
	}
	.loading-container {
		text-align: center;
		height: 80vh;
		font-size: 20px;
		line-height: 30px;
		padding-bottom: 160px;

		span {
			margin-top: 34px;
			height: 30px;
			text-align: center;
			padding-left: 35px;
			color: #7f7f7f;
			display: inline-block;
			background: url(~assets//loading.gif) no-repeat left;
			background-size: contain;
		}
	}
	.clearfix:after {
		visibility: hidden;
		display: block;
		font-size: 0;
		content: " ";
		clear: both;
		height: 0;
	}
	.orderItemFly {	
		.bottomDiv {
			font-size: 10px;
			display: flex;
			justify-content: center;
			margin-bottom: 50px;
		}
		
	}
	.Insurance_box{
		.flight_top{
			padding: 0 40px;
			background: #478aee;
			height: 50px;
			line-height: 50px;
			color: #fff;
			&>div{
				float: left;
			}
			.city{
				margin-left: 30px;
			}
			.date{
				margin-left: 30px;
			}
			img{
				float: left;
				margin-top: 5px;
				margin-left: -15px;
				margin-right: 10px;
				width: 40px;
				height: auto;
			}
		}
		.insurance_detals{
			padding: 30px 40px;
			background: #fff;
			.title{
				.name{
					font-size: 16px;
					font-weight: bold;
				}
				border-bottom: 1px solid #ddd;
				padding-bottom: 10px;
				margin-bottom: 20px;
			}
			.insurance_psg {
				.psg_item {
				margin-bottom: 10px;
				// border-bottom: 1px solid #e2e2e2;
				.tableLine {
					display: flex;
					justify-content: space-between;
					background: #ffffff;
					padding: 5px 0;
					font-size: 14px;
				}
				.noTitleSize{
					font-size: 12px;
				}
				.darkBg {
					background: #e2e2e2;
				}
				span {
					text-align: center;
					// margin-right: 30px;
					width: 60px;
					word-break: break-all;
				}
				.span2 {
					width: 90px;
				}
				.span3 {
					width: 110px;
				}
				.span4 {
					width: 140px;
				}          
				.errorBox {
					font-size: 14px;
					padding: 0 10px;
					color: red;
					display: flex;
					.imgDiv {
					margin-right: 5px;
					height: 16px;
					width: 16px;
					background: url(~assets//icon_mail_alert.png)  no-repeat;
					background-size: 16px;
					}
					.errmsg{
					margin-left: 10px;
					word-break: break-all;
					}
				}
				}
			}
			.details{
				margin-top: 30px;
				.top{
					margin-bottom: 10px;
				}
				.title_new{
					font-weight: bold;
					margin-bottom: 10px;
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