<template>
	<div>
		<LoadingX v-if="loading" tip='退改进度加载中' :spinning="true" :turn="true" />
        <div v-else class="regression_box">
			<div class="amount_all">
				<p class="amount_all_total">￥<span class="fs68">{{totalRefundAmount}}</span></p>
				<p>已退总额</p>
			</div>
			<!-- 卧铺预购有退款 -->
			<div v-if="!!ticketPriceDiffList[0]">
				<div class="item_box" v-for="(item,index) in ticketPriceDiffList" :key="index">
					<div class="item_box_title">购票差额</div>
					<div class="temp_box">
						<div class="temp_title">
							<div>
								<Icon type='svg_icon_my_shanglv_people' size='.36' class="icon" />
								<span>{{item.psgName}}</span>
							</div>
							<!-- <span>{{item.refundTime}}</span> -->
						</div>
						<div class="temp_content">
							<p class="temp_letters">
								退还购票差额 <span class="red">￥{{item.refundDiff}}</span>
								（预购{{item.expectSeatClass}}￥{{item.expectPrice}}，实购{{item.actualSeatClass}}￥{{item.actualPrice}}）退款将在1-7个工作日内原路退回
							</p>
							<p class="temp_time">{{item.refundTime}}</p>
						</div>
					</div>
				</div>

			</div>
			<!-- 改签进度，成功、取消、失败 -->
			<div v-if="!!changeProgressList[0]">
			<div class="item_box" v-for="(item,index) in changeProgressList" :key="index">
				<div class="item_box_title">改签</div>
				<div class="temp_box">
					<div class="temp_title">
						<div>
							<Icon type='svg_icon_my_shanglv_people' size='.36' class="icon" />
							<span>{{item.psgName}}</span>
						</div>
						<!-- <span>{{item.applyTime}}</span> -->
					</div>
					<div class="temp_content">
						<p class="temp_letters">
							退还改签差额<span class="red">￥{{item.changeDiff}}</span>
							（改签票价￥{{item.newTicketPrice}}，原票价￥{{item.ticketPrice}}）
							<span v-if="item.changeStatus=='CHANGE_SUCCESS'&&!!item.changeDiff">退款将在1-7个工作日内原路退回</span>
							
						</p>
						<div class="temp_option">
							<ul>
								<li>
									<div class="img_icon img_icon_first"><img class="img_dashed" src="~assets/img/trainList/radio_sel2.png"/></div>
									<div class="state">申请改签</div>
									<div class="time">{{item.applyTime}}</div>
								</li>

								<li>
									<div class="img_icon "><img :src="trainPsgStatusEmum[item.changeStatus].imgurl"/></div>
									<div class="state" :class="trainPsgStatusEmum[item.changeStatus].color">{{trainPsgStatusEmum[item.changeStatus].name[0]}}</div>
									<div class="time">{{item.changeTime}}</div>
								</li>
							</ul>
						</div>
						
						<!-- 按钮组、乘客状态 -->
						<p v-if="item.changeStatus=='CHANGE_CANCELLED'" class="state_msg">{{trainPsgStatusEmum[item.cancelReasonType].failedreason||item.failedReason }}</p>
						<p v-else-if="item.changeStatus!='CHANGING'&&item.changeStatus!='CHANGE_SUCCESS'" class="state_msg">{{trainPsgStatusEmum[item.changeStatus].failedreason||item.failedReason }}</p>
						<!-- {{trainPsgStatusEmum[item.changeStatus].failedreason}} -->
					</div>
				</div>
			</div>

			</div>
			<!-- 退款进度，成功、失败 -->
			<div v-if="!!refundProgressList[0]">
			<div class="item_box" v-for="(item,index) in refundProgressList" :key="index">
				<div class="item_box_title">退票</div>
				<div class="temp_box">
					<div class="temp_title">
						<div>
						<Icon type='svg_icon_my_shanglv_people' size='.36' class="icon" />
						<span>{{item.psgName}}</span>
						</div>
						<!-- <span>{{item.applyTime}}</span> -->
					</div>
					<div class="temp_content">
						<p class="temp_letters">退还金额
							<span class="red">￥{{item.refTicketAmount}}</span>
							（车票票款￥{{item.ticketPrice}}，手续费￥{{item.refPoundage}}）
							<span v-if="item.refundStatus=='REFUND_SUCCESS'&&!!item.refTicketAmount">退款将在1-7个工作日内原路退回</span>
							</p>
						<div class="temp_option">
							<ul>
								<li>
									<div class="img_icon img_icon_first"><img class="img_dashed" src="~assets/img/trainList/radio_sel2.png"/></div>
									<div class="state">申请退票</div>
									<div class="time">{{item.applyTime}}</div>
								</li>
								<li>
									<div class="img_icon "><img :src="trainPsgStatusEmum[item.refundStatus].imgurl"/></div>
									<div class="state" :class="trainPsgStatusEmum[item.refundStatus].color">{{trainPsgStatusEmum[item.refundStatus].name[0]}}</div>
									<div class="time">{{item.refundTime}}</div>
								</li>

							</ul>
						</div>

						<!-- 按钮组、乘客状态 -->
						<p v-if="item.refundStatus=='REFUND_FAILED'" class="state_msg">{{trainPsgStatusEmum[item.refundStatus].failedreason||item.failedReason}}</p>
					</div>
				</div>
			</div>

			</div>
        </div>    
	</div>
</template>

<script>
	import trainHandler from 'trainHandler/common/lib/trainHandler.js';
    import LoadingX from "components/loading/index";
	import { trainPsgStatusEmum } from './psgStatusEnum.js'
	const Icon = ()=>import('components/icon');	
	export default {
		directives: {
		},
		components: {
            LoadingX,Icon
		},
		data: function() {
			trainHandler.stateManager.setData(null,this);
			return {
                loading :true,
				totalRefundAmount:'',
				ticketPriceDiffList:[],
				changeProgressList:[],
				refundProgressList:[],
				trainPsgStatusEmum,
			}
		},
		beforeRouteLeave(to, from, next) {
            let that = this;
			trainHandler.stateManager.closeTopPop(()=>{
				next();
			});
	    },
		created: function() {
			let that = this;
			//注册并监听t信返回事件
			sinosdk.sino.onBack(function(){
				trainHandler.stateManager.closeTopPop(()=>{
                    sinosdk.sino.back('');
                });
			},that)

		},
		mounted: function() {
			// console.log(this.$route.query)
			trainHandler.getChangeAndRefundProgress(this.$route.query).then((res) => {
				if (res.result){
					this.changeProgressList = res.result.changeProgressList
					this.refundProgressList = res.result.refundProgressList
					this.totalRefundAmount = res.result.totalRefundAmount
					this.ticketPriceDiffList = res.result.ticketPriceDiffList
					this.loading = false
				}else{
					console.error(res.resultMessage)
				}
			}).catch((e) => {
				console.error(e);
			})
			
		},
		methods: {}
	}
</script>

<style scoped lang="less">
@import './regressionComp.less';
</style>