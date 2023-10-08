<template>
	<!-- 所有产品公用本vue页面，只有产品独有的信息抽出来做了动态组件，根据typeCode判断使用哪个组件 -->
	<div class="order-detail">
		<!--顶部标题栏-->
		<div class="header">
			<navigationbar :websitename="sitename" :userinfo="userinfo" @acceptevent="actionopen"/>
		</div>
		<div class="orderDetailContent">
			<!--顶部导航栏-->
			<div class="topNavigation">
				<div class="topNavLeft cursorp" @click="$router.go(-1);">
					<div class="topNavBackBtn"></div>
				</div>
				<div class="topNavMiddle">订单详情</div>
				<div class="topNavRight"></div>
			</div>
            <component v-bind:is="currTravelerTypeInfo" :orderNo="orderNo"></component>    
		</div>
	</div>
</template>

<script>
	import  * as travelfun from "bislibs/traveloperationfun.js";
	import tmHandler from "bislibs/requesthandler/traveloperationhandler.js";
	//公共模板
	import navigationbar from 'components/navigationbar/navigationbar';
	//不同产品的出行人信息
	import orderDetailFlight from './templet/flight';
	import orderDetailTrain from './templet/train';
    import orderDetailHotel from './templet/hotel';
	import orderDetailExpress from './templet/express';    
	import orderDetailInsurance from './templet/insurance';    

	export default {
		components: {
			navigationbar,
			orderDetailFlight,
			orderDetailTrain,
            orderDetailHotel,
			orderDetailExpress,
			orderDetailInsurance
		},
		computed: {
			currTravelerTypeInfo() {
				const that = this;
				//详情组件动态加载之前，需要检验一下是否支持，不支持的业务将给出提示并且返回上一页。
				let installedType =["Flight","Train","Hotel","Insurance"];
				if(installedType.indexOf(this.typeCode) == -1){
					let title = "提示"
					let content = "详情不支持此业务，敬请期待！"
			        travelfun.showConfirm(content, function () {
			            //确定            
			            that.$router.go(-1)
			        }, 1,"取消","确定",title, function () {
			        },true);     			
				}
				return "orderDetail" + this.typeCode;
			}
		},
		data() {
			return {
				typeName: this.$route.query.typeName,
				//注意：这里的typeCode和travelerInfoTemplet文件夹下文件的首单词是一致的(首字母大写)
				typeCode: this.$route.query.typeCode,
				orderNo: this.$route.query.orderNo,
				isAbnormal: this.$route.query.isAbnormal,
				sitename:"B+商旅运营平台",
				userinfo:null,    				
			}
		},
		watch:{
			/**
			 * router.push相同的路由，比如从详情跳转到详情，vue会复用当前路由，不会重新走Oncreate。
			 * 通过监听路由的query参数变化，动态获取参数，到达刷新页面的效果。
			 */
			$route:{
				handler(val){
					this.typeCode = val.query.typeCode;
					this.orderNo = val.query.orderNo;
					this.typeName = val.query.typeName;
					this.isAbnormal = val.query.isAbnormal;
				},
				immediate: true
			}
		},
		created() {
		},
		mounted() {
			this.getHeaderInfo()
		},
		methods: {
			actionopen(theEvent){
				if(theEvent.name == "quit"){
					tmHandler.logOut();
				}
			},
			getHeaderInfo(){
				this.userinfo = {
					username:(tmHandler.userInfo && tmHandler.userInfo.mgrName) || "",
					userID:(tmHandler.userInfo && tmHandler.userInfo.userId) ||"",
				}                
			},   			
		},
	}
</script>
<style scoped lang="less">
	@import 'detail.less';
</style>