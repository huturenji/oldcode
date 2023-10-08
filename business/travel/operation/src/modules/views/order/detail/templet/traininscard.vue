<template>
	<div class="trainInsurance" v-if="!!insuranceList && insuranceList.length>0">
		<div class="title">出行保险</div>
		<div class="content">
			<div class="top">乘意险 共{{cardNumber}}张保单</div>
			<div class="middle" v-for="(item,index) in insuranceArray" :key="item.no">
				<div class="numberTip">
					<span>{{index+1}}</span>
				</div>
				<div class="main-content">
					<div class="line1">
						<div>{{getInsuranceStatus(item.isEffect)}}</div>
						<div>由{{item.companyName}}承保</div>
						<div>咨询电话：{{item.supplierPhone}}</div>
					</div>
					<div class="line2">
						<div class="left">
							<div class="close"  v-if="item.isClosed">
								<div>被保险人：{{item.passenger.psgName}}</div>
								<div>{{orderBase.trainNo}}</div>
							</div>
							<div class="open" v-else>
								保险服务信息
							</div>
						</div>
						<div class="cursorp" :class="item.isClosed ? 'showItemIcon' : 'showItemIconUp'" @click.stop="openCloseDiv(item)">
                            <div class="imgDiv" />
						</div>
					</div>
					<div v-show="!item.isClosed">
						<div class="line3">
							<div>被保险人：{{item.passenger.psgName}}</div>
							<div>身份证号：{{getCardNo(item.passenger.cardNo)}}</div>
						</div>
						<div class="line3">
							<div>保单编号：{{item.productCode}}</div>
							<div>数量（份）：1</div>
							<div>保费：￥{{item.farePrice}}</div>
						</div>
						<div class="line4">
							商品相关信息
						</div>
						<div class="line3">
							<div>{{orderBase.trainNo}}</div>
							<div>{{orderBase.startStation}}-{{orderBase.endStation}}</div>
						</div>
						<div class="line3">
							<div>预计出发时间：{{orderBase.startTime}}</div>
							<div>预计到达时间：{{orderBase.endTime}}</div>
						</div>
					</div>
				</div>
			</div>
			<div class="bottom">{{insurancedesc}}</div>
		</div>
	</div>
</template>

<script>
    import utils from "bislibs/utils";
import  * as travelfun from "bislibs/traveloperationfun.js";		
	export default {
		props: {
			insuranceList: {
				type: Array,
				required: true,
			},
		    orderBase:{
		      type: Object,
		      required: true,      	
		    },
		},
		computed: {
			insurancedesc: function() {
				return "理赔说明：因乘车意外伤害导致的身故、伤残累计赔偿额度360万人民币/份，因乘车意外伤害导致的医疗费累计赔偿额度2万人民币/份。";
			},
			//动态的title拼接
			cardNumber: function() {
				return this.insuranceList.length;
			},
			insuranceArray:function(){
				let myList = JSON.parse(JSON.stringify(this.insuranceList));
				for(let i=0;i<myList.length;i++){
					myList[i].isClosed = true;
				}
				return myList
			},
		},
		data() {
			return {
				listSwitch: false, //控制 伸缩和展开的按钮
				showTips: false, //
			}
		},
		created() {
		},
		mounted() {},
		methods: {
			/**
			 * 通过OrderType获取明细的名字
			 */
			openCloseDiv(item) {
				item.isClosed = !item.isClosed
				//需要强制刷新
				this.$forceUpdate();						
			},
			/**
			 * 通过IsEffect获取保险单的有效状态
			 */			
			getInsuranceStatus(isEffect){
				return isEffect?"已出单":"未出单";
			},
			getCardNo(cardNo){
				return utils.getFormatCardNo(cardNo)
			},
		},
	}
</script>

<style lang="less">
	.trainInsurance {
		background: white;
		margin-bottom: 40px;
		.title {
			font-size: 20px;
			color: black;
			background: #F4F4F4;
			padding: 5px 10px;
		}
		.content {
			padding: 20px;
			font-size: 16px;
			.top {
				display: flex;
			}
			.middle {
				display: flex;
				margin:20px 10px;
				width: 100%;
				.numberTip {
					margin-right: 10px;
					span {
						width: 15px;
						height: 15px;
						background-color: gray;
						border-radius: 50%;
						margin-left: -5px;
						-webkit-border-radius: 50%;
						display: inline-block;
						color: white;
						vertical-align: top;
						font-size: 10px;
						margin-top: 5px;
						line-height: 15px;
						text-indent: 0;
						text-align: center
					}
				}
				.main-content {
					border-bottom: 1px dashed #333333;
					padding-bottom: 20px;
					width: 100%;
					.line1 {
						display: flex;
						div {
							margin-right: 30px;
						}
						div:nth-child(0){
							color: black;
			    			font-size: 18px;			
						}
					}
					.line2 {
						display: flex;
						justify-content: space-between;
						margin-top: 10px;
						.left {
								height: 20px;
							    line-height: 20px;
							.close {
								display: flex;
								color: #333333;
								div{
									margin-right: 30px;
								}
							}
							.open {
								color: dodgerblue;
							    font-size: 16px;								
							}
						}
						.showItemIcon {
							flex: 0 0 7%;
							text-align: center;
                            .imgDiv{
                                margin: 15px 0 0 15px;
                                height: 9px;
                                width: 13px;
                                background: url(~assets//icon_more_search.png);
                            }                            
						}
						.showItemIconUp {
							flex: 0 0 7%;
							text-align: center;
                            .imgDiv{
                                margin: 15px 0 0 15px;
                                height: 9px;
                                width: 13px;
                                background: url(~assets//icon_more_less.png);
                            }                                 
						}
					}
					.line3 {
						display: flex;
						margin: 10px 0px;
						div {
							margin-right: 30px;;
						}
					}
					.line4 {
						color: dodgerblue;
						font-size: 16px;
					}
				}
			}
			.bottom {
				color: #333333;
				margin: 20px;
			}
		}
	}
</style>