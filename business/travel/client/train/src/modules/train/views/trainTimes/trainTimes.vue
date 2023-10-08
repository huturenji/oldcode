<template>
	<div class="container">
		<!-- 顶部的背景蓝色 -->
		<div class="top"></div>
		<div class="data-wrap">
			<header>
				<div class="start-time">
					<div class="date">{{startDateStr+" "+startWeekStr}}</div>
					<div class="time num-font">{{trainDetail.goTime}}</div>
					<div class="station">{{trainDetail.startStation}}</div>
				</div>
				<div class="time-info cursorp" @click="getTrainLineByTrainNo(trainDetail.trainCode, trainDetail)">
					<div class="train-no">{{trainDetail.trainCode}}</div>
					<div class="iconWrap"></div>
					<!-- 列车停运的时候不显示 saleFlag=1代表列车运行图调整，暂停发售  saleFlag=4代表列车停运-->
					<div class="duration" v-if="trainDetail.saleFlag != 1 && trainDetail.saleFlag != 4 ">{{trainDetail.runTimeFormat}}</div>
				</div>
				<div class="end-time">
					<div class="date">{{endDataDtr+" "+endWeekStr}}</div>
					<div class="time num-font">{{trainDetail.endTime}}</div>
					<div class="station">{{trainDetail.toStation}}</div>
				</div>	
			</header>

			<div class="notice-tips">
				<div class="notice-info" v-if="checkIsNearGo(trainDetail)">
					<i>提示：</i>该车次离发车时间不足半小时，已停止网络售票；提示：车站售票窗口在发车前10分钟仍可售
				</div>

				<div class="notice-info" v-else-if="0 < parseInt(trainDetail.saleFlag)">
					<template v-if="2 == parseInt(trainDetail.saleFlag)">{{trainDetail.saleDateTime}}</template>
					<i>提示：</i>{{SaleFlagMap[trainDetail.saleFlag]}}
					<template v-if="3 == parseInt(trainDetail.saleFlag)">{{trainDetail.saleDateTime}}</template>
				</div>
			</div>
			
		</div>


		<div class="seat-wrap">
			<!-- 日历 -->
			<div class="calendar_new">
				<div class="pre-btn cursorp" @click="getTrainDataFromNet('preDay')"><icon type='icon_common_leftarrow' size='.24' />前一天</div>
				<div class="calendar-component-wrap">
					<span class="calendar-component cursorp" @click="showCalendar=true"><icon type='calendar' size='.32'/>{{startDateStr+" "+startWeekStr}}</span>
				</div>
				<div class="next-btn cursorp" @click="getTrainDataFromNet('nextDay')">后一天<icon type='icon_common_rightarrow' size='.24' /></div>
			</div>

			<!-- 出差列表 -->
			<MyTripList v-if="isNotEndorse" ref="MyTripList" v-model="myTripModelData" :departDate='departDate' :initTripNo="initTripNo"></MyTripList>
			<LoadingX v-if="loading" tip='获取车次详情中，请稍候...' :spinning="true" :turn="true" />
			<!-- 坐席列表 -->
			<div class="seats" v-else-if="!!trainDetail.canBook">
				<div v-if="!!trainDetail.banningList && trainDetail.banningList.length > 0">
					<ul v-for="(banning,index) in trainDetail.banningList" :key="index">
						<li v-show="banning.price > 0">
							<div>{{banning.name}}</div>
							<div class="price num-font">
								<span><i>￥</i>{{banning.price}}</span>
								<span class="coupon-label" v-if="!!banning.couponList && banning.couponList.length > 0">
									{{getBestCoupon(banning.couponList)}}
								</span>
							</div>
							<div class="leave">
								<span v-if="banning.leave==0 || parseInt(trainDetail.saleFlag)>0" class="gray">无票</span>
								<span v-else-if="banning.leave>0 && banning.leave<=20" :class="{red:banning.leave>0 && banning.leave<10}">{{banning.leave}}张</span>
								<span v-else-if="banning.leave>20">有票</span> 
							</div>
							<!-- 列车停运的时候不显示 saleFlag=1代表列车运行图调整，暂停发售  saleFlag=4代表列车停运-->
							<span v-if="checkIsNearGo(trainDetail) || parseInt(trainDetail.saleFlag)>0" class="btnWrap">
								<span class="btn linear-gra-disable">停售</span>
							</span>
							<div v-else-if='!!useTypeConfig' class="last">
                                <span class="btnWrap" v-if="useTypeConfig.isPublic(myTripModelData.hotelUseType) && !myTripModelData.haveAuth && myTripModelData.tripListLength == 0 && isNotEndorse  && !myTripModelData.getAuthing">
                                    <span class="btn cursorp noauth linear-gra-waring" @click="toConfirm(trainDetail, banning)">出差申请</span>
								</span>
								<span class="btnWrap" v-else-if="banning.leave>0 && (!myTripModelData.getAuthing || !isNotEndorse || useTypeConfig.isPrivate(myTripModelData.hotelUseType))">
                                    <span class="btn cursorp linear-gra-waring" @click="toConfirm(trainDetail, banning)">{{fromChange=='changeTickets'?'改签':'预订'}}</span>
								</span>
								<span class="btnWrap" v-else-if="!myTripModelData.getAuthing || !isNotEndorse || useTypeConfig.isPrivate(myTripModelData.hotelUseType)">
                                    <span class="btn linear-gra-disable">{{fromChange=='changeTickets'?'改签':'预订'}}</span>
								</span>
							</div>
						</li>
						
					</ul>
				</div>
			</div>
			<div v-else>
				<EmptyX tipsText='本车次没有可预订的坐席' />
			</div>
		</div>
			
		<!--弹出框车站列表组件-->
		<div v-transfer-dom>
			<popup v-model="showTravelByPop" height="100%" width="100%" position="right" class="travelList">
				<scroll-lock :bodyLock="showTravelByPop" class="scrollLockWrap">
					<div class="title">
						<span>车站名称</span>
						<span>到站时间</span>
						<span>发车时间</span>
						<span>停留</span>
					</div>
					<div v-for="(item,index) in tavelList" :key="index" class="list">
						<span>{{item.stationName}}</span>
						<span>{{item.arriveTime}}</span>
						<span>{{item.startTime}}</span>
						<span>{{item.stopoverTime > 0 ? (item.stopoverTime + '分钟') : '----'}}</span>
					</div>
				</scroll-lock>
			</popup>
		</div>

		<!--弹出框日历组件-->
		<div v-transfer-dom>
			<popup v-model="showCalendar" position="bottom" :show-mask="true" hide-on-blur style="min-height: 10rem;background: @sub-background-colorfff ">
				<div class="calendar">
					<CalendarNewX ref="calendar" @changeDate="choseDayChange" :futureDayHide="new Date(new Date().format('yyyy/MM/dd')).getTime()+29*24*3600000" :agoDayHide="new Date(new Date().format('yyyy/MM/dd')).getTime()" :displayMode=2></CalendarNewX>
				</div>
			</popup>
		</div>


		<!--底部的12306登录部分-->
		<div v-transfer-dom>
			<div v-if="false" class="login_12306">
				<div class="icon"><icon type='icon_train_12306' size='.72' /></div>
				<div class="text">登录12306账号，出票更快</div>
				<div @click="goLogin()" class="login_btn">登录</div>
			</div>
		</div>

	</div>

</template>

<script>
	import {getBestCoupon} from 'components/coupon/js/requestHandler.js';
	import ScrollLock from 'trainComponents/scrollLock/vue-scroll-lock.vue';
	import EmptyX from "components/empty/EmptyX.vue";
	import CalendarNewX from "components/calendarNew/CalendarNewX.vue";
	import icon from "components/icon/index.vue"
	import {
		TransferDom,
		Popup,
	} from 'vux';
	import LoadingX from "components/loading/index.js";
	import trainHandler from 'trainHandler/common/lib/trainHandler.js';
    import mixin from 'trainHandler/common/lib/trainMixin.js';
    import MyTripList from 'components/trip/MyTripList.vue';
	export default {
        mixins: [trainHandler.mixin.tChatEventMixin,mixin],
		name: '',
		directives: {
			TransferDom
		},
		components: {
			Popup,
			CalendarNewX,
			EmptyX,
			LoadingX,
            ScrollLock,
			MyTripList,
			icon
		},
		// mixins: [mixin],
		data() {
			return Object.assign(this.setData(),{
				trainDetail: {}, //车次详情对象
				searchDate: '', //车次的日期
				startDateStr: '', //订票的日期，用于显示
				startWeekStr: '', //订票的星期，用于显示
				endDataDtr: '', //订票的日期，用于显示
				endWeekStr: '', //订票的星期，用于显示
				showTravelByPop: false, //显示火车经停车站列表的指示变量
				tavelList: [], //查询车次列表结果集
				showCalendar: false, ////日历组件的指示变量
				canBuyWz:true,
                SaleFlagMap:null,
                loading:true,//数据请求中
                fromChange: this.$route.query.fromChange,
                isNotEndorse:false,//是否是正常流程不是改签
                departDate:'',//出发日期
                initTripNo:this.$route.query.tripNo || '',//页面初始化携带的TripNo
                myTripModelData:{
                    'choosedTrip':'',
                    'haveAuth':false,
                    'tripListLength':0,
                    'hotelUseType': trainHandler.USE_TYPE_ENUM.PUBLIC.name,
                    'getAuthing':true
                },
                USE_TYPE_ENUM: trainHandler.USE_TYPE_ENUM,
				useTypeConfig: null,
			})
		},
		//调用
		mounted() {

		},
		beforeRouteLeave(to, from, next) {
			const that = this;
			that.checkPops() ? next() : next(false);
		},
		beforeRouteEnter(to, from, next) {
			next()
		},
		async created() {
			const that = this;
            //判断是否改签
            if(!(!!that.$route.query.fromChange && that.$route.query.fromChange=='changeTickets')){
                that.isNotEndorse = true;
			}
			this.setData();
            // that.registerEvent();
			that.initData();
			that.setShowDate();
			this.getTrainDataFromNet();
            this.useTypeConfig = await trainHandler.useTypeConfig();
        },
        activated(){
			this.setData();
            // this.registerEvent();
			this.initData();//每次激活页面重新刷新数据
			this.setShowDate();
			this.getTrainDataFromNet();
        },
		methods: {
            /**
             * 注册T信监听事件
             */ 
            // registerEvent(){
            //     const that = this;
			// 	//注册并监听t信返回事件
			// 	sinosdk.sino.onBack(function(){
			// 		trainHandler.throttle(function() {
			// 			trainHandler.stateManager.closeTopPop(()=>{
			// 				that.$router.back();
			// 			})
			// 		}.bind(this));
			// 	},that);
			// 	trainHandler.reFreshPage(()=>{
            //         trainHandler.reloadWithNoCache()
            //     })
            // },
            goBackFun(){
                const that = this;
                that.$router.back();
            },
            /**
             * 初始化数据
             */ 
            initData(){
                let that = this;
                this.trainDetail = JSON.parse(trainHandler.getStorage('trainDetail'));//init时先从缓存里面取该车次详情
				this.searchDate = trainHandler.getStorage('startDate'); //车次的日期
				this.startDateStr =''; //订票的日期，用于显示
				this.startWeekStr =''; //订票的星期，用于显示
				this.endDataDtr =''; //订票的日期，用于显示
				this.endWeekStr =''; //订票的星期，用于显示
				this.showTravelByPop =false; //显示火车经停车站列表的指示变量
				this.tavelList =[]; //查询车次列表结果集
				this.showCalendar =false; ////日历组件的指示变量
				this.canBuyWz = true;
                this.SaleFlagMap = {//异常状态的车次描述
                    "0":'正常车次',
                    "1":'列车运行图调整，暂停发售',
                    "2":'起售',
                    "3":'暂售至',
                    "4":'列车停运',
                },
                this.loading = false;//数据请求中
                //获取因公因私
                if(!!this.$route.query.useType){
                    that.myTripModelData.hotelUseType = this.$route.query.useType;
                }
                //获取出发时间
                that.departDate = this.searchDate;
                //获取行程id
                if(trainHandler.getSession('nextDirection')=='forward'){
                    that.myTripModelData.choosedTrip = this.$route.query.tripNo || '';
				} 
			},
			setData(){
				return  trainHandler.stateManager.setData([
					'showCalendar',
					{
						name:'showTravelByPop',
						hide:{
							callback(){
								document.title = '车次详情';
							}
						}
					}
				], this);
			},

			//跳转到12306登录页面
			goLogin(){
				this.$router.push({
					path: '/login/12306'
				})
			},
            /**
             * 获取最优惠的优惠券价格
             */  
            getBestCoupon(cabin){
                let that = this;
                if(!!cabin&&cabin.length>0){
                    let couponBox=cabin
                    let sendBox={}
                    sendBox.CanUseCoupon=couponBox
                        return getBestCoupon(sendBox, function(bestCoupon){
                        that.$set(couponBox, 'bestCoupon',bestCoupon);
                    });
                }else{
                    return  
                }
                
            },
			/**
			 * 设置日期和日历有关的变量。用于UI显示
			 * @param {Object} 
			 */
			setShowDate() {
				const that = this;
				that.startDateStr = new Date(that.searchDate).format('MM月dd日');
				that.startWeekStr = trainHandler.indexToWeek(new Date(that.searchDate).getDay(), 1);
				setTimeout(() => {
					that.$refs.calendar.setDate(new Date(that.searchDate).getTime() / 1000);
				}, 0);
				var endData = new Date(that.searchDate); //获取当前时间
				endData.setDate(endData.getDate() + that.trainDetail.runDays); //设置天数 -1 天
				that.endDataDtr = endData.format('MM月dd日');
				that.endWeekStr = trainHandler.indexToWeek(new Date(endData).getDay(), 1);
			},
			/**
			 * 获取网络请求的车次详情数据
			 * @param {Object} type 前一天后一天
			 */
			getTrainDataFromNet(type) {
				const that = this;
				let startDate = that.searchDate;
				if (!!type) {
					if (type == 'preDay') {
						startDate = new Date(new Date(startDate).getTime() - 24 * 3600000).format("yyyy/MM/dd");
					} else if (type == 'nextDay') {
						startDate = new Date(new Date(startDate).getTime() + 24 * 3600000).format("yyyy/MM/dd");
					}
				}
				if (new Date(startDate).getTime() < new Date(new Date().format("yyyy/MM/dd")).getTime()) {
					trainHandler.showToast('请选择大于等于当前的日期')
				} else if (new Date(startDate).getTime() - new Date(new Date().format("yyyy/MM/dd")).getTime() >= 30 * 24 * 3600000) {
					trainHandler.showToast('火车票预售期为三十天，请注意时间范围')
				} else {
					that.trainList = [];
                    that.searchDate = startDate;
                    that.departDate = that.searchDate;
					trainHandler.setStorage('startDate', startDate);
					that.setShowDate();
					const obj = {
						"fromStation": trainHandler.getStorage('fromCity'),
						"toStation": trainHandler.getStorage('toCity'),
						"fromDate": startDate,
						"trainType": parseInt(trainHandler.getStorage('trainType')),
						"trainCode": that.trainDetail.trainCode,
					};
                    that.loading = true;
					trainHandler.getTrainQuery(obj).then((res) => {
                        that.loading = false;
						if (!!res.result) {
							let list = res.result.trainList;                          
							//从车次详情解析出坐席列表用于UI展示
							for (var i = 0; i < list.length; i++) {
								if (list[i].trainCode == that.trainDetail.trainCode && list[i].startStation == that.trainDetail.startStation && list[i].toStation == that.trainDetail.toStation) { //匹配车次 出发站 和目的地都一样
                                    list[i].banningList = that.handleTrainBanning2List(list[i]);
									that.trainDetail = list[i];
									break;
								}
							}
							//更新如下缓存对象
							trainHandler.setStorage('trainPolicy', res.result.policy);
							trainHandler.setStorage('queryKey', res.result.queryKey);
							
							//判断是否可买无座
							that.getWzType();
						}	
					}).catch((err) => {
						console.log(err);
					});
				}
			},
			/**
			 * 获取网络请求的车次经停车站列表，用于UI展示
			 * @param {Object} trainNo 前一天后一天
			 */
			getTrainLineByTrainNo(trainNo,trainDetail) {
				if(parseInt(trainDetail.saleFlag)>0){
					trainHandler.showToast('未查询到车站数据，请重试');
					return;
				}
				const that = this;
				const obj = {
                    "trainCode": trainNo,
                    "fromStation": trainHandler.getStorage('fromCity'),
                    "toStation": trainHandler.getStorage('toCity'),
                    "queryDate": that.searchDate,
				};
				trainHandler.getTrainLineByTrainNo(obj).then((res) => {
					that.showTravel();
					if (!!res.result) {
						that.tavelList = res.result.siteList;
					} else {
						console.log('getTrainLineByTrainNo .error');
					}
				}).catch((err) => {
					console.log(err);
				});
			},
			/**
			 * 显示列车时刻表
			 * @param {Object} 
			 */
			showTravel() {
				const that = this;
				that.showTravelByPop = true;
				document.title = '列车时刻';
			},
			/**
			 * 关闭列车时刻表
			 * @param {Object} 
			 */
			checkPops() {
				const that = this;
				let checker = false;
				if (that.showTravelByPop) {
					that.showTravelByPop = false;
				} else {
					checker = true;
					document.title = '车次详情';
				}
				return checker;
			},
			/**
			 * 日历组件的回调函数，返回选择的日期
			 * @param {Object} date 返回选择的日期
			 */
			choseDayChange(date) {
				const that = this;
				if (that.showCalendar) {
					that.searchDate = new Date(date * 1000).format("yyyy/MM/dd");
					that.setShowDate();
					that.$forceUpdate();
					that.getTrainDataFromNet();
				}
				that.showCalendar = false;
			},
			/**
			 * 跳转到下单页面
			 * @param {Object} train
			 * @param {Object} banning
			 */
			toConfirm(train, banning) {
                const that = this;
				let myTripData = that.myTripModelData;
		
                if((that.useTypeConfig.isPublic(myTripData.hotelUseType) && that.isNotEndorse  && !myTripData.getAuthing)){//因公且不为改签且已经获取权限数据
                    if(myTripData.haveAuth){//有特殊授权
                        if(myTripData.tripListLength == 0){//无合法行程
                        }else if(myTripData.tripListLength > 0 && myTripData.choosedTrip == ''){//有行程且未选择
                            trainHandler.showToast('请先选择出差行程');
                            return;
                        }                       
                    }else{//无特殊授权
                        if(myTripData.tripListLength == 0){//无合法行程
                            that.toTravelReq();
                            return;
                        }else if(myTripData.tripListLength > 0 && myTripData.choosedTrip == ''){//有行程且未选择
                            trainHandler.showToast('请先选择出差行程');
                            return;
                        }
                    }
 
                }

                let text = '铁路网上购票系统将在23:00-次日06:00进行系统维护，期间暂停服务；如您需办理购票、改签或退票，请到铁路车站窗口办理，谢谢';
                if(that.checkHour()){
                    trainHandler.showConfirm(text, null, 1, null, null, '温馨提示', null, true);
					return;
                }
                // if(that.checkIsNearGo(train)){
				// 	trainHandler.showToast('该车次离发车时间不足30分钟，已停止网络售票；车站售票窗口在发车前10分钟仍可售');
				// 	return;
				// }
				if(banning.name == '无座' && !that.canBuyWz){
					trainHandler.showToast('相同价格的有座席位还有剩余，请勿预订无座席位');
					return;
				}
				//更新缓存内的车次详情和座席名称
				trainHandler.setStorage('trainDetail', JSON.stringify(that.trainDetail));
				trainHandler.setStorage('Banning', banning.name);
				trainHandler.setStorage('BanningData', JSON.stringify(banning));

				if(!!that.fromChange && that.fromChange=='changeTickets'){
					that.$router.push('/endorse/confirm');
				}else {
					let query = {
						useType: this.$route.query.useType //因公因私
					};
					if(that.myTripModelData.choosedTrip != ''){
						query = Object.assign({}, query, {
							tripNo: that.myTripModelData.choosedTrip
						})
					};
					that.$router.push({
						path: '/order/confirm',
						query
					});
				}
            },
             /**
             * 打开审批申请页面
             */		      
            toTravelReq(){
                let that = this;
                let appplyAddress = '';
				sinosdk.sino.overwriteWindowopen();
				let param = {
					channelId: trainHandler.channelId
				}
                trainHandler.getApplyTravelUrl(param).then((res) => {
                    if (!!res.result.approveTravelUrl) {
                        appplyAddress = res.result.approveTravelUrl;
                    }
                    if(!!appplyAddress && '' != appplyAddress){
                        trainHandler.openPageLib(appplyAddress);
                    }else{
                        trainHandler.showToast('还未设置出差申请地址，请前往运营后台设置');
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },           
			/**
			 * 判断是否是在23:00-6:00是否可购票
			 */
            checkHour(){
                let res = false;
                let myDate = new Date();
                let hour = myDate.getHours();
                if(22 < hour || hour < 6){
                    res = true;
                }
                return res;
            },
		
			/**
			 * 判断无座是否可购买
			 */
			getWzType(){
                const that = this;
                that.canBuyWz = true;
				let setInfos = that.trainDetail;
				let wzPrice = 'wzPrice';
				if(!!!setInfos[wzPrice] || Object.keys(setInfos).length <= 0){
					return;
				}

				//获取选中车次的相关的座席名称（name）/ 剩余数量（leave）/ 座席价格（price ） 
				let arr = that.handleTrainBanning2List(setInfos);  //该方法在trainMixin.js里面
				for (let index = 0; index < arr.length; index++) {
					const element = arr[index];
					if (element.leave > 0 && element.price == setInfos[wzPrice] && element.letter != 'wz'){
						that.canBuyWz = false;
						return; 
					}
				}
			}
		},
	}
</script>
<style scoped lang="less" rel="stylesheet/less">
@import '~themes/default/styles/trainTimes.less';
</style>