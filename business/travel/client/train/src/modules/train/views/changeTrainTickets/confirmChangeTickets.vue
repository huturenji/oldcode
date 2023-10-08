<template>
  <div class="trainOrderWrap">
    <div class="data-wrap">
      <header>
         <div class="start-time">
          <div class="date">{{startDate}}</div>
          <div class="time num-font">{{trainDetail.goTime}}</div>
          <div class="station">{{trainDetail.startStation}}</div>
        </div>
        <div class="time-info cursorp" @click="getTrainLineByTrainNo(trainDetail.trainCode)">
          <div class="train-no">{{trainDetail.trainCode}}</div>
          <div class="iconWrap"></div>
          <div class="duration">{{trainDetail.runTimeFormat}}</div>
        </div>
        <div class="end-time">
          <div class="date">{{endDate}}</div>
          <div class="time num-font">{{trainDetail.endTime}}</div>
          <div class="station">{{trainDetail.toStation}}</div>
        </div>
      </header>
    </div>
    <div class="setSeatWrap">
      <div class="seatInfo">{{seatLevel}}<span class="num-font"><span class="symbol">￥</span>{{+ banningPrice}}</span></div>
      <div class="right cursorp" @click="gotoTuiGaiRules()"><span><icon type="icon_common_prompt" size=".28"/>取票、退票、改签说明</span></div>
    </div>
    <div class="customerList">
      <div class="title">乘车人</div>
      <div class="customer">
          <div class="textName">{{changeTrainTicketsPerson.psgName}}</div>
          <div class="textIdWrap">{{changeTrainTicketsPerson.cardType}} {{desensitization(changeTrainTicketsPerson.cardNo)}}</div>
      </div>
        
    </div>
    <!-- 温馨提示 -->
    <div class="warm-tips">
      <div>温馨提示：</div>
      <p>1.每张车票只能改签一次，已改签车票不能再次改签。</p>
      <p>2.根据铁路部门规定，改签可能产生改签手续费。</p>
    </div>
    <div v-transfer-dom v-show="isOriginHei || isPc">
      <div class="bottomButWrap">
        <div class="buttWrap" @click="applyChangTik">
          <div class="nowchange cursorp">立即改签</div>
        </div>
      </div>
    </div>
    <!-- 退改规则 -->
    <div v-transfer-dom>
      <popup v-model="showTuiGaiRule" height="90%" width="100%" position="bottom" class="trainticketrule-des">
        <Description v-if="showTuiGaiRule" @closeDesc="showTuiGaiRule = false" />
      </popup>
    </div>
    <!-- 列车时刻 点击时刻表显示的信息火车路过所有站点的信息 -->
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
    <!-- 下单进度条 -->
    <div v-transfer-dom class="progressDia">
      <x-dialog v-model="showOrderProcess">
        <div class="orderProgress">
          <div class="header"></div>
          <div class="main">
            <div class="flightDetailNew">
                <div class="trip">
                  <div class="station">
                    <span class="time num-font">{{trainDetail.goTime}}</span>
                    <span class="airport">{{trainDetail.startStation}}</span>
                  </div>
                  <div class="arrow">
                    <div>
                      <span>{{startDate}}{{trainDetail.trainCode}}</span>
                    </div>
                    <img src="~themes/default/img/icon_plane_xuxianarrow@2x.svg" />
                    <span class="goDate">{{trainDetail.runTimeFormat}}</span>
                  </div>
                  <div class="station right">
                    <span class="time num-font">{{trainDetail.endTime}}</span>
                    <span class="airport">{{trainDetail.toStation}}</span>
                  </div>
                </div>
            </div>
            <div class="passenger">
              <i>乘车人：</i>
              <span class="names" v-for='(customer,index) in customerList' :key="index">
                <span>{{customer.psgName}}</span>
              </span>
            </div>
          </div>
          <div class="bottom">
            <div class="bottom_tips"><i>正在预订席位，请稍候... </i>{{processPrecent}}%</div>
            <div class='progress' ref='progress'></div>
          </div>
        </div>
      </x-dialog>
    </div>
    
    <!-- 当前网速较慢，商旅通正在为您加速占座，请耐心等待  弹窗 -->
    <div v-transfer-dom>
      <confirm class="confirmnet" v-model="showConfirmNet" @on-confirm="toPageDetail" :show-cancel-button="false">
        <p style="text-align:center;">当前网速较慢，商旅通正在为您加速占座，请耐心等待</p>
      </confirm>
    </div>
    <!-- 改签车次余票不足，占座失败，请选择其他车次重试  弹窗 -->
    <div v-transfer-dom>
      <confirm v-model="showConfirmLoseSeat" @on-confirm="loseGetSeat" :show-cancel-button="false">
        <p style="text-align:center;">改签占座失败，请选择其他车次重试</p>
      </confirm>
    </div>
    <!-- 网络异常，占座失败，请检查网络设置后重试  弹窗 -->
    <div v-transfer-dom>
      <confirm v-model="showConfirmNetError" @on-confirm="applyChangTik()" confirm-text="重试">
        <p style="text-align:center;">网络异常，占座失败，请检查网络设置后重试</p>
      </confirm>
    </div>
    <!-- 点击立即改签按钮，先调一边乘客状态接口，如果乘客状态不为UNCHANGED 未改签 显示跳详情弹窗 -->
    <div v-transfer-dom>
      <confirm v-model="showGoToDetail" @on-confirm="toPageDetail" confirm-text="确定" :show-cancel-button="false">
        <p style="text-align:center;">您已申请改签，请到订单详情页面查看改签进度</p>
      </confirm>
    </div>
    <!-- loading -->
     <div v-transfer-dom>
      <loading :show="ifShowLoading" text="加载中"></loading>
    </div>

    <Pay ref="payComp" 
        tradeType='2'
        :limitTime="limitTime"
        :orderNoList="[ChangeStatusObj.newOrderNo]" 
        :amount="ChangeStatusObj.seatPrice"
        :goodsDesc="getGoodsDesc"
        :defaultResultPage='true'
        @closePay='paySucToDetail'
        @closePayType='paySucToDetail'
        @payComplete='payComplete'
    >
        <div slot='result' slot-scope="{closePay}">
            <payResult v-if='applyChangeOrderDetail && trainDetail'
                :orderNo = 'applyChangeOrderDetail.orderNo'
                :endCity = 'applyChangeOrderDetail.endCity || ""'
                :arriveTime = 'endTime+(24*3600*1000)'
                :departTime = 'endTime'
                :useType = 'applyChangeOrderDetail.useType'
                pageFrom='order'
                @toOrderDetail='closePay'/>
        </div>
    </Pay>
    <travelAbnormal v-if="!!ChangeStatusObj" ref="travelAbnormal" :orderNo="ChangeStatusObj.newOrderNo" :useType="ChangeStatusObj.useType" :amount="ChangeStatusObj.seatPrice">
      <trainInfo slot="abnormalProductInfo" slot-scope="{exceedStandard}" :exceedStandard="exceedStandard" :train="Object.assign({},
              {
                startDate: searchDate,
                startTime: trainDetail.goTime,
                startStation: trainDetail.startStation,
                endTime: trainDetail.endTime,
                endStation: trainDetail.toStation,
                trainNo: trainDetail.trainCode,
                runTime: trainDetail.runTime || 0,
              },{seatType: !!ChangeStatusObj.seatType ? ChangeStatusObj.seatType : ''})"/>
    </travelAbnormal>
     <!--占座成功显示改签票价-->
    <div v-transfer-dom>
      <confirm v-model="takeSeatYes"  class="takeSeatYes" :class="{priceDiffNeedPaying:ChangeStatusObj.priceDiffNeedPaying>0, PriceDiffNeedchangePoundge:(ChangeStatusObj.priceDiffNeedPaying<0 && ChangeStatusObj.changePoundage>0)}" :show-cancel-button="false" :show-confirm-button="false">
        <div class="takeSeatYes_box">
          <div class="takeSeatYes_close">
            <span></span>  
            <span class="img_close" @click="toPageDetail"></span>  
          </div>
          
          <div class="takeSeatYes_price">
            <span v-if="ChangeStatusObj.priceDiffNeedPaying==0" class="price_0"><i class="money">￥</i>{{Math.abs(ChangeStatusObj.priceDiffNeedPaying)}}</span>
            <span v-if="ChangeStatusObj.priceDiffNeedPaying<0" class="price_fu"><i class="money">￥</i>{{Math.abs(ChangeStatusObj.priceDiffNeedPaying)}}</span>
            <span v-if="ChangeStatusObj.priceDiffNeedPaying>0" class="price_zheng"><i class="money">￥</i>{{Math.abs(ChangeStatusObj.seatPrice)}}</span>
          </div>
          
          <div class="takeSeatYes_suc">
            <span v-if="ChangeStatusObj.priceDiffNeedPaying==0" class="differ_0"> 占座成功，<i>支付</i>改签票价</span>
            <span v-if="ChangeStatusObj.priceDiffNeedPaying<0" class="differ_fu"> 占座成功，<i>退还</i>改签差额</span>
            <span v-if="ChangeStatusObj.priceDiffNeedPaying>0" class="differ_zheng"> 占座成功，<i>支付</i>改签票价</span>
            <p v-if="ChangeStatusObj.priceDiffNeedPaying>0" class="takeSeatYes_tips">原票价<i>￥{{ChangeStatusObj.oldSeatPrice}}</i>将原路退回支付账户</p>
          </div> 
         
          <div class="takeSeatYes_detail">
            <span class="takeSeatYes_psg">{{ChangeStatusObj.psgName}}</span>
            <span class="takeSeatYes_seat">{{ChangeStatusObj.seatType + ChangeStatusObj.seatNo}}</span>
            <span class="takeSeatYes_total">￥{{ChangeStatusObj.seatPrice}}</span>
          </div>

          <!-- 只有高改低的时候才会收取改签手续费 -->
          <div v-if="ChangeStatusObj.priceDiffNeedPaying < 0 && ChangeStatusObj.changePoundage > 0" class="takeSeatYes_ChangePoundage">
            <span>手续费</span>
            <span>￥<i class="num-font">{{ChangeStatusObj.changePoundage}}</i></span>
          </div>
          <!-- 直接调改签接口 -->
          <div class="takeSeatYes_confirmbtn" v-if="ChangeStatusObj.priceDiffNeedPaying<=0" @click="confirmChange">
            确认改签<span v-if="limitTime>0" class="time_cut">({{limitTime | limitTimeFilter}})</span>
          </div>
          <!-- 走支付流程 -->
          <div class="takeSeatYes_confirmbtn" v-if="ChangeStatusObj.priceDiffNeedPaying>0" @click="orderPay">
            确认改签<span v-if="limitTime>0" class="time_cut">({{limitTime | limitTimeFilter}})</span>
          </div>
        </div>
      </confirm>
    </div>
  </div>
</template>

<script>
import icon from "components/icon/index.vue";
import Description from 'components/trainticketrule/description.vue';
import trainInfo from 'trainComponents/travelAbnormal/trainInfo.vue';
import ScrollLock from 'trainComponents/scrollLock/vue-scroll-lock.vue';
import trainHandler from 'trainHandler/common/lib/trainHandler.js';
import mixin from 'trainHandler/common/lib/trainMixin.js';
const Pay = ()=>import('components/pay')
const payResult = ()=>import('../orderSuc/orderSuc');
import {
  XDialog,
  TransferDom,
  Popup,
  Confirm,
  Loading
} from 'vux';


import travelAbnormal from 'components/travelAbnormal/index.vue';
  export default {
    directives: {
      TransferDom
    },
    mixins: [mixin,trainHandler.mixin.tChatEventMixin],
    beforeRouteEnter(to, from, next) {
      next()
    },
    components: {
      travelAbnormal,
      Popup,
      Confirm,
      XDialog,
      Description,
      ScrollLock,
      Loading,
      trainInfo,
      icon,
      Pay,
      payResult
    },
    filters:{
      getWeekDay(value) {
        if (!value) {
            return '';
        }
        let date = new Date(value);
        return trainHandler.indexToWeek(date.getDay(), 3);
      },
      limitTimeFilter: function (value) {
        if (value && value >= 1) {
            return new Date(value * 1000).format('mm:ss');
        }
        return '';
      },
    },
    data: function () {
      let that = this;
      let managerData = trainHandler.stateManager.setData([
        {
          name: 'showTravelByPop',
          hide:{
              title:'申请改签',
              callback(){}
          }
        },
        {
          name: 'showTuiGaiRule',
          hide:{
              title:'申请改签',
              callback(){}
          }
        },
      ], this);
      return  Object.assign(managerData,{
        tavelList: [],
        trainDetail: '',
        banningPrice: 0,
        seatLevel: '', //座席名称
        BanningData: {},
        startDate: '',
        endDate: '',
        endTime: null,
        showLoading: false,
        showOrderProcess: false,
        processPrecent: 0,
        introducIndex: 0,
        isOriginHei: true,
        screenHeight: document.documentElement.clientHeight,
        originHeight: document.documentElement.clientHeight,
        searchDate: trainHandler.getStorage('startDate'), //车次的日期
        changeTrainTicketsPerson:null,//改签人的信息
        showConfirmNet:false,//立即改签请求超过30s的弹窗
        showConfirmLoseSeat:false, //占座失败的弹窗
        showConfirmNetError:false, //占座网络异常显示的弹窗
        takeSeatYes:false,//占座成功显示支付差额的弹窗
        newOrderNo:'',//改签的新订单编
        breakLoop: false,//中断轮询
        applyChangeOrderDetail: JSON.parse(trainHandler.getStorage('applyChangeOrderDetail')),//改签的订单
        changeStatus: '',//改签的乘客的状态
        ChangeStatusObj: {},//乘客的改签状态对象
        ifShowLoading: false,//是否显示loading
        timer: null, //30s延时器
        abnormalObj: {}, //支付异常类型
        showGoToDetail: false, //已申请改签，跳转详情查看改签进度弹窗
        limitTime: 0, //支付限时
        timeInterval:null, //支付倒计时
        isPc:false,//是否是pc端
        loadPay: false,
        checkSign: null,
        customerList: [], //进度条显示改签的的乘客姓名
        servicePhone: trainHandler.BIS_CUSTOMER_SERVICE_PHONE, //商旅联系电话
      })
    },
    created: function () {
      const that = this;
      if(trainHandler.isPC()){
          that.isPc = true;
      }
    //   //注册并监听t信返回事件
    //   sinosdk.sino.onBack(function(){
    //     trainHandler.stateManager.closeTopPop(()=>{ 
    //       that.$router.back();
    //     })
    //   },that);
    //   trainHandler.reFreshPage(() => {
    //     location.reload()
    //   });
      // 兼容ios异步window.open
      sinosdk.sino.overwriteWindowopen();
      that.trainDetail = !!trainHandler.getStorage('trainDetail') ? JSON.parse(trainHandler.getStorage('trainDetail')) : '';
      that.startDate = new Date(trainHandler.getStorage('startDate')).format('MM月dd') + "  " + trainHandler.indexToWeek(new Date(trainHandler.getStorage(
        'startDate')).getDay());
      const endDate = new Date(trainHandler.getStorage('startDate')).getTime() + that.trainDetail.runDays * 24 * 3600000;
      that.endDate = new Date(endDate).format('MM月dd') + "  " + trainHandler.indexToWeek(new Date(endDate).getDay());
      that.endTime = new Date(new Date(endDate).format('yyyy-MM-dd') + ' ' + that.trainDetail.endTime).getTime()

      //获取改签人的信息,并更新customerList
      that.changeTrainTicketsPerson = JSON.parse(trainHandler.getStorage('changeTrainTicketsPerson'));
      that.customerList.push(that.changeTrainTicketsPerson);
      
    },
    computed:{
      getGoodsDesc(){
        const date = new Date(trainHandler.getStorage('startDate')).format('MM月dd日') 
        return date + ' ' + this.trainDetail.startStation + '-' + this.trainDetail.toStation;
      },
    },
    mounted: function () {
      const that = this;
      //解析坐席及价格等信息
      that.initBanningData();
      window.onresize = function () {
        return (function () {
          that.screenHeight = document.documentElement.clientHeight;
        })()
      }
    },
    updated: function () {
    },
    beforeDestory: function () {

    },
    watch: {
     
      screenHeight: function (newValue) {
        let _this = this;
        if (_this.originHeight > newValue + 150) { //150是为了兼容虚拟返回栏
          _this.isOriginHei = false;
        } else {
          _this.isOriginHei = true;
        }
      }
    },
    methods: {
        
        //注册并监听t信返回事件
        goBackFun(){
            const that = this;
            that.$router.back();
        },
      //改签占座失败
      loseGetSeat(){
        let that = this;
        that.showConfirmLoseSeat=false;
        that.$router.go(-2);
      },

     
      toPageDetail() {//取消跳转到订单详情
        const that = this;
        that.breakLoop = true;
        if(that.timer){
          clearTimeout(that.timer)
        }
        //退回到订单
        let loadData = JSON.stringify({refresh:true});
        sinosdk.sino.back('', 1, loadData);
      },
      showTravel() {
        const that = this;
        that.showTravelByPop = true;
        document.title = '列车时刻';
      },
      /**
       * 解析出坐席列表
       */
      initBanningData() {
        const that = this;
        //缓存里面取座席详情
        that.BanningData = !!trainHandler.getStorage('BanningData') ? JSON.parse(trainHandler.getStorage('BanningData')) : {};
        that.banningPrice = that.BanningData.price || 0;//座席价格
        that.seatLevel = that.BanningData.name || '';//座席名称
      },
      /**
       * 获取车次时刻表
       * @param {Object} trainNo
       */
      getTrainLineByTrainNo(trainNo) {
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
          } else {}
        }).catch((err) => {
          console.log(err);
        });
      },

      /**
     * 打开支付类型选择
     */
      async orderPay() {
        var core = ()=>{
            this.$refs.payComp.getPayTypeList();
        }

        //先校验差标，再打开支付列表
        if((await trainHandler.useTypeConfig()).isPublic()){
          this.$refs.travelAbnormal.checkTravelAbnormal({orderNo: this.ChangeStatusObj.newOrderNo}).then(res=>{
            this.checkSign = res;//保存校验成功的签名
            core();
          })
        }else{
          core();
        }
       
      },
      //倒计时方法
      timeCutDown(){
        let that = this;
        if (that.limitTime > 0) {
            that.timeInterval && clearInterval(that.timeInterval);
            that.timeInterval = setInterval(function () {
                if (that.limitTime) {
                    if (that.limitTime <= 1) {
                        that.limitTime = null;
                        clearInterval(that.timeInterval);
                        that.payTimeout();
                    } else {
                        that.limitTime = that.limitTime - 1;
                    }
                } else {
                    that.timeInterval && clearInterval(that.timeInterval);
                }
            }, 1000);
        } else {
            that.limitTime = null;
            clearInterval(that.timeInterval);
        }
      },  
      /**
     * 支付超时后的操作
     */
      payTimeout(){
          let that = this;
          that.toPageDetail();

          //暂时不用弹窗直接跳转
          // let msg = '抱歉，您的改签超时已取消改签';
          // trainHandler.showConfirm(msg, function(){
          //     that.toPageDetail();
          // }, 1, null, '确定', null, null, true);
      },
      /**
      * 确认改签操作
      */
      confirmChange(){
        const that = this;
        let param = {
          orderNo: that.ChangeStatusObj.newOrderNo
        }
        trainHandler.confirmChange(param).then((res) => {
          if(0 == res.resultCode && res.result && res.result.success){
            let loadData = JSON.stringify({refresh:true});
            sinosdk.sino.back( '', 1, loadData);
          }
        }).catch((err) => {
            console.log(err); 
        });
      },
     
      /**
       * 申请改签操作 循环拉取订单信息，判断是否占座
       */
      applyChangTik(){
        const that = this;
        that.ifShowLoading = true;
        //先去调用乘客状态接口，如果状态不是UNCHANGED 未改签则显示弹窗
        that.applyChangeTickets();  
      },
      /**
      *申请改签接口调取
      */
      applyChangeTickets(){
        const that = this;
        if(!that.showGoToDetail){
          const endDate = new Date(trainHandler.getStorage('startDate')).getTime() + that.trainDetail.runDays * 24 * 3600000;
          let orderNo = that.applyChangeOrderDetail.orderNo;
          let queryKey = trainHandler.getStorage('queryKey');
          let trainNo = that.trainDetail.trainCode;
          let trainClass = that.trainDetail.trainClass;
          let fromStation = that.trainDetail.startStation;
          let toStation = that.trainDetail.toStation;
          let fromStationCode = that.trainDetail.startStationCode;
          let toStationCode = that.trainDetail.toStationCode;
          let trainBeginDate =new Date(trainHandler.getStorage('startDate')).format('yyyy/MM/dd') + ' ' + that.trainDetail.goTime + ':00';
          let trainEndDate = new Date(endDate).format('yyyy/MM/dd') + ' ' +  that.trainDetail.endTime + ':00';
          let seatType = that.selectSeatType2Code();
          let ticketPrice = that.banningPrice;
          let passengerId = that.changeTrainTicketsPerson.psgId;
          let param = {
              queryKey,
              orderNo,
              trainNo,
              trainClass,
              fromStation,
              toStation,
              fromStationCode,
              toStationCode,
              trainBeginDate,
              trainEndDate,
              seatType,
              ticketPrice,
              passengerId
          }
          trainHandler.applyChange(param).then((res) => {
              that.ifShowLoading = false;
              if (0 == res.resultCode && res.result && res.result.success) {
                that.getChangeStatusOfPassenger();
              }
          }).catch((err) => {
            that.ifShowLoading = false;
            console.log(err); 
            if(err.resultCode=='46020021'){
              that.showGoToDetail = true;
            }else if(err.resultCode=='46000008'){
              trainHandler.showToast('获取坐席信息失败');
            }else if(err.resultCode=='46020038'){ //不符合改签条件
              trainHandler.showConfirm('开车前48小时（不含）以上，可改签预售期内的其他列车。开车前48小时内，可改签开车前的其他列车，也可改签开车后至票面日期当日24:00之间的其他列车，不办理票面日期次日及以后的改签。', function () {
            
              }, 1, '知道了', null, '改签失败', function () {}, true);
            }
          });
          
        }
      },
      /**
      *轮询乘客的改签状态 
      */
      getChangeStatusOfPassenger(delay = 0){
        const that = this;
        setTimeout(function(){
          //中断轮询
          if(that.breakLoop){
              return;
          }
          let nextExecDelay = 2*1000; //递归查询方法间隔，2秒一次
         
          //启动占座进度条
          if(!that.showOrderProcess){    
            that.showOrderProcess = true;
            setTimeout(() => {
              that.handleProcess()
            }, 500)
          }
  
          //当加载超过30s后显示当前网速较慢，商旅通正在为您加速占座，请耐心等待 showConfirmNet  弹窗
          if(delay <= 0){
            that.timer = setTimeout(()=>{
              that.showConfirmNet = true;
              that.takeSeatYes = false;
              that.breakLoop = true;
            }, 30000)
          }

          let param = {
            orderNo: that.applyChangeOrderDetail.orderNo,
            passengerId: that.changeTrainTicketsPerson.psgId
          }
          trainHandler.getChangeStatusOfPassenger(param).then((res) => {
            if(!!res.result){
              that.changeStatus = res.result.changeStatus;
              that.ChangeStatusObj = {
                changeStatus: res.result.changeStatus,
                psgId: res.result.psgId,
                psgName: res.result.psgName,
                seatType: res.result.seatType,
                seatNo: res.result.seatNo,
                seatPrice: res.result.seatPrice,
                oldSeatPrice: res.result.oldSeatPrice,
                priceDiffNeedPaying: res.result.priceDiffNeedPaying,
                newOrderNo: res.result.newOrderNo,
                useType: res.result.useType,
              }
              if(that.changeStatus){
                if(that.changeStatus=='SEAT_TAKEN_FAILED'){//如果是改签占座失败
                  that.closeProcess();
                  clearTimeout(that.timer)
                  that.breakLoop = true;
                  that.showConfirmLoseSeat = true;
                }else if(that.changeStatus=='SEAT_TAKEN_SUCCESS'){//如果是改签占座成功

                  // 高改低的时候新增改签手续费(判断条件是： 存在改签手续费/改签手续费必须大于0/必须是高改低的情况下才有改签手续费)
                  if(!!res.result.changePoundage && res.result.changePoundage > 0 && res.result.priceDiffNeedPaying < 0){
                      that.ChangeStatusObj = Object.assign({}, that.ChangeStatusObj, {'changePoundage': res.result.changePoundage});
                  }
                  that.closeProcess();
                  clearTimeout(that.timer);
                  that.breakLoop = true;
                  that.showConfirmNet = false;
                  that.takeSeatYes = true;
                  
                  //占座成功后更新确认改签倒计时
                  that.limitTime = res.result.remainPayTime;
                  that.timeCutDown();


                  //占座成功并且是低改高 的情况下需要动态加载支付js
                  if(that.ChangeStatusObj.priceDiffNeedPaying > 0 ){
                    that.loadPay = true;
                  }
                }else{
                  that.getChangeStatusOfPassenger(nextExecDelay);
                }
              }
            }
          }).catch((err) => {
              console.log(err); 
              that.closeProcess();
              clearTimeout(that.timer)
          });
        }, delay)
      },
      /**
       * 显示退改签规则页面
       */
      gotoTuiGaiRules() {
        const that = this;
        that.showTuiGaiRule = true;
      },
      /**
       * 重置下单进度条
       */
      closeProcess() {
        const that = this;
        that.processPrecent = 0;
        that.$refs.progress.style.width = that.processPrecent + '%';
        that.showOrderProcess = false;
      },
      /**
       * 启动或停止下单进度条
       */
      handleProcess() {
        const that = this;
        let interval = setInterval(() => {
          if (that.processPrecent < 99) {
            that.processPrecent++;
            that.$refs.progress.style.width = that.processPrecent + '%';
          } else {
            clearInterval(interval);
          }
        }, 100)
      },

        /**
         * 支付成功页面点击“查看订单”
         */
        paySucToDetail(){
            this.timeInterval && clearInterval(this.timeInterval);
            let loadData = JSON.stringify({refresh:true});
            sinosdk.sino.back('', 1, loadData);  
        },
        /**
        * 支付完成时停止倒计时
        */
        payComplete(){
            this.timeInterval && clearInterval(this.timeInterval);
        }
    }
  }

</script>
<style scoped lang="less">
@import '~themes/default/styles/confirmChangeTickets.less';
</style>
<style lang="less">
  @import '~styles/core/common.less';
  .progressDia {
    .weui-dialog {
      width: 86%;
      max-width: 6.3rem;
      border-radius: .2rem; 
    }
  }
  // 占座成功显示改签票价开始
  .takeSeatYes.priceDiffNeedPaying{
    .weui-dialog{
      height: 5.2rem;
    }
  }
  .takeSeatYes.PriceDiffNeedchangePoundge{
    .weui-dialog{
      height: 5.5rem;
    }
  }
  .takeSeatYes{
    i{
      font-style:normal;
    }
    .weui-mask{
      z-index: 800;
    }
    .weui-dialog{
      border-radius:0.3rem;
      display: block;
      height: 5rem;
      z-index: 810;
    }
    .weui-dialog__ft{
      display: none;
    }
    font-size: 0.32rem;
    .weui-dialog__bd{
      padding: 0!important;
      border-bottom: @sub-background-color !important;
    }
    .takeSeatYes_box{
      box-sizing: border-box;
      padding: 0.4rem;
      padding-bottom: 0;
      padding-top:0;
      position:relative;
    }
    .takeSeatYes_close{
      position:absolute;
      top:0;
      right:0;
      width:100%;
      height: 0.52rem;
      display: flex;
      justify-content: space-between;
      .img_close{
        cursor: pointer;
        background-image: url(~assets/img/trainList/icon_close.png);
        height: .54rem;
        width: .54rem;
        background-size: 100%;
      }
      .img_close:active{
        cursor: pointer;
        background-image: url(~assets/img/trainList/icon_active_close.png);
        height: .54rem;
        width: .54rem;
        background-size: 100%;
      }
    }
    .takeSeatYes_suc{
      text-align: center;
      font-size: 0.28rem;
      padding-top:0.25rem;
      padding-bottom:0.5rem;
      border-bottom:1px dashed @placeholder-color;
      .differ_0{
        i{
          color:@third-text-color;
        }
      }
      .differ_fu{
        i{
          color:@success-color;
        }
      }
      .differ_zheng{
        i{
          color:@price-color;
        }
      }
    }
    .takeSeatYes_price{
      text-align: center;
      font-size: 0.32rem;
      color: @price-color;
      padding-top:0.7rem;
      padding-bottom:0.2 rem;
      .price_0{
        color:@text-color;
        font-size:0.5rem;
        .money{
          font-size:0.4rem;
        }
      }
      .price_fu{
        color:@success-color;
        font-size:0.5rem;
        .money{
          font-size:0.4rem;
        }
      }
      .price_zheng{
        color:@price-color;
        font-size:0.5rem;
        .money{
          font-size:0.4rem;
        }
      }

    }
    .takeSeatYes_tips{
      text-align: center;
      font-size: 0.28rem;
      color: @third-text-color;
      font-weight: normal;
      padding: 0.1rem 0;
      padding-bottom: 0;
      i{
        color:@text-color;
      }
    }
    .takeSeatYes_ChangePoundage{
      width: 100%;
      font-size:0.3rem;
      color:@secondary-text-color;
      overflow:hidden;
      padding-bottom: 0.3rem;
      display: flex;
      justify-content: space-between;
    }
    .takeSeatYes_detail{
      width: 100%;
      font-size:0.3rem;
      color:@secondary-text-color;
      overflow:hidden;
      padding: 0.3rem 0;
      display: flex;
      justify-content: space-between;
      span.takeSeatYes_psg{ 
        width: 30%;
        text-align: left;
      }
      span.takeSeatYes_seat{
        width: 30%;
        text-align: center;
      }
      span.takeSeatYes_total{
        width: 30%;
        text-align: right;
      }
      span{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        position:relative;       
      }
      span.takeSeatYes_psg:after{
        content:'';
        width:0.02rem;
        height:0.22rem;
        background:@placeholder-color;
        position:absolute;
        top:0.08rem;
        right:0rem;
      }
      span.takeSeatYes_total:before{
        content:'';
        width:0.02rem;
        height:0.22rem;
        background:@placeholder-color;
        position:absolute;
        top:0.08rem;
        left:0rem;
      }
    }
    .takeSeatYes_confirmbtn{
      width: 100%;
      height: 0.8rem;
      color: @sub-background-color;
      line-height: 0.8rem;
      background-color: @theme-color;
      border-radius: 0.08rem;
      margin-top: 0.15rem;
      cursor: pointer;
      font-size:0.32rem;
    }
    .takeSeatYes_confirmbtn:active{
      opacity: .8;
    }
  }

  .confirmnet .weui-dialog{
    z-index: 10001;
  }
  .confirmnet .weui-mask{
    z-index: 10000;
  }


  .ReceiptEditPop {
    z-index: 999;
    height: 100%;
    background: @background-color;
  }

</style>
