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

    <div class="setSeatWrap cursorp">
      <div class="seatInfo">
        <div>{{seatLevel}}<span class="num-font"><i>￥</i>{{banningPrice}}</span></div>
        <!-- AcceptNoSeat 是否接受无座参数，0=不接受，1=接受-->
        <div v-if="seatLevel=='硬座' || seatLevel=='二等座'" @click="AcceptNoSeat = !AcceptNoSeat" class="accept_no_seat"><i>接受无座</i><icon :type="AcceptNoSeat?'btn_common_checkbox_sel':'btn_common_checkbox_nor'" size='.4' /></div>
      </div>

      <div class="seatInfoWrap">
        <div class="left">购票手续费<span>￥{{OutTicketPoundage + '.0'}} / 张</span></div>
        <div class="right cursorp" @click="gotoTuiGaiRules()"><span><icon type="icon_common_prompt" size='.26' /><i>取票、退票、改签说明</i></span></div>
      </div>
      <div v-if="shieldWo(seatLevel)" class="seatInfoWrap_tips">
        <i>温馨提示：</i>卧铺上/中/下铺位随机出票，预订先按下铺票价收取，出票后按实际票价退还差额到您的支付账户
      </div>
     
    </div>


    <!-- 12306登录部分 -->
    <div v-if="false" class="login_12306">
      <div class="icon"><icon type='icon_train_12306' size='.72' /></div>
      <div class="text">登录12306账号，出票更快</div>
      <div @click="goLogin()" class="login_btn">登录</div>
    </div>


    <div class="customerList">
        <div class="inline-loading lineBorderB" v-if='userLoading'>
            <LoadingX v-if="userLoading" tip='正在获取用户数据' :spinning="true" :turn="true" />
        </div>
        <template v-else>
           <!-- 选择乘客box组件开始 -->
            <swp-psg-choose v-if="showPsgCom" title="请选择乘车人" :psgList="psgList" :customerList="customerList" @addCustomer='addCustomer' @cliPsgItem='cliPsgItem'></swp-psg-choose>

            <!-- 渲染下侧的乘客列表 -->
            <div class="customer lineBorderB-psg" v-for="(customer,index) in customerList" :key='index'>
              <div class="customerLineWrap">
                <div class="delBut cursorp" @click="deleteCustomer(customer, index)"><icon type="icon_common_delete" size='.44' /></div>
                <div class="textLineWrap cursorp" @click="editCustomer(customer, index)">
                  <!--判断第一个证件类型需要显示的名称，现阶段只有护照需要显示FirstName与LastName，其他均为Name-->
                  <div class="textName" v-if='showSurnameFun(customer.idCode)'>
                    {{customer.firstName}} {{customer.lastName}}
                  </div>
                  <div class="textName" v-else>{{customer.name}}</div>
                  <div class="textTips" v-if="judgeEmpty(customer)">用户信息不完善，请补充</div>
                  <!-- 火车票要核验手机号和身份信息 -->
                  <div class="textTips" v-else-if="judgeCheck(customer)">{{customer.errorMsg}}</div> 
                  <div class="textIdWrap" v-else>{{customer.idType}} {{desensitization(customer.idNum)}}</div>
                </div>
                <icon type="icon_common_rightarrow" size='.24' />
              </div>
            </div>
        </template>
    </div>
    <div class="connector">
      <span class="label">联系电话：</span>
      <span class="beforeNum">+86</span>
      <input class="contactNum" type="text" maxlength="13" placeholder="请填写联系人手机" v-model="contactNum" onclick="return false" />
      <span class='tel-book cursorp' @click="changeConnector"><icon type="btn_conmmon_phone" size='.36' /></span>
    </div>

    <!-- 在线选座开始 -->
    <selectSeat v-if="customerList.length" :seatLevel="seatLevel" :customerList="customerList" @chooseFun='chooseFun'></selectSeat>
    <!-- 在线选座结束 -->

    <div class="reimburse">
      <div class="switch">
        <div class="label">
            <span>报销凭证</span>
            <div class="tip" v-if='showReim'>支付成功后，可在订单详情中查看</div>
            <div class="tip" v-else>购票手续费发票（下单后30天内可进入订单详情补开）</div>
        </div>
        <SnSwitch class='cursorp' slot="right-icon" v-model="showReim" />
      </div>      
      
      <div v-show='showReim' class='reimDetail'>
        <div class="list">
          <div class="title">发票类型</div>
          <div class="content text">
            <div> 增值税普通发票（电子）</div>
          </div>
        </div>
        <div class="list">
          <div class="title">发票内容</div>
          <div class="content text">
            <div> *现代服务*服务费</span></div>
          </div>
        </div>
        <div class="list">
          <div class="title">发票抬头</div>
          <div class="content cursorp" @click='showInvoice()'>
            <div class="invoice_content">
              <div v-if="invoiceDetail.name">
                <p class="text"> {{invoiceDetail.name}}</p>
                <!-- <p class="text tax"> {{invoiceDetail.tax}}</p> -->
              </div>
              <span v-else class="text placeholder">选择或添加发票抬头</span>
              <!-- 定位的导入企业发票抬头的icon图标 -->
              <div v-if="isBizMate() && showImportInvoice"  @click.stop="importInvoiceFun" class="importInvoice"><icon type="svg_icon_invoice_import" size='.4' /></div>
            </div>
            <div class="right"><icon type="icon_common_rightarrow" size='.24' /></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户下单协议的dom部分 -->
    <div class="protocols_part">
      <protocols ref="protocolComp" @initAppBackFun="initAppBackFun" />
    </div>

    <!-- todo目前屏蔽掉优惠券的相关功能 -->
    <!-- <CouponItem ref='couponItem' v-if="customerList.length>0" :productType='3' :couponList='(BanningData || {}).couponList?(BanningData || {}).couponList:null' @setCoupon='setCoupon'/> -->
    <!--编辑发票抬头-->
    <div v-transfer-dom>
      <popup v-model="showReceiptEdit" class="ReceiptEditPop" height="100%" :popup-style="{zIndex: 888}">
        <swp-invoice-card v-if="showInvoiceComp" v-model="invoiceDetail" ref='invoiceCard' @closeInvoiceList="showReceiptEdit=false" @showImportInvoiceFun="checkImportInvoiceBtn"></swp-invoice-card>
      </popup>
    </div>

    <!-- 底部的价格 -->
    <div v-transfer-dom v-show="isOriginHei || isPc">
      <div class="bottomButWrap">
        <div class="buttWrap">
          <div class="left">
            <span class="leftText num-font">
              <i class="title">总额:</i><span><i class="symbol">￥</i><i class="money">{{FareAmount}}</i></span>
              <span class="leftTps">共<span>{{customerList.length}}</span>人</span>
            </span>
            
          </div>
          <div class="middle cursorp" @click="showDetailDom=!showDetailDom">
            <span>明细<icon :type="showDetailDom?'icon_common_uparrow':'icon_common_downarrow'" size='.2' /></span>
          </div>
          <div class="right blue-btn cursorp" @click="confirmOrder()">提交订单</div>
        </div>
      </div>
    </div>


    <!-- 价格明细 -->
    <div v-transfer-dom class="trainPriceDetail">
      <popup v-model="showDetailDom" position="bottom" class="popBox2" is-transparent>
        <div class="priceDetail" v-if="showDetailDom">
          <div class="detailList">
            <span class="name">{{seatLevel}}</span>
            <span class="price">
              <span class="num-font">￥{{banningPrice}}</span> x {{customerList.length}}</span>
          </div>
          <div class="detailList">
            <span class="name">手续费</span>
            <span class="price">
              <span class="num-font">￥{{OutTicketPoundage}}</span> x {{customerList.length}}</span>
          </div>
          <!-- <div class="detailList" v-if="currCoupon && customerList.length>0">
            <span class="name">优惠券</span>
            <span class="price">
              <span class="coupon-price">-￥ {{currCoupon.CouponValue}}</span>
              </span>
          </div> -->
        </div>
      </popup>
    </div>
    <!-- 列车时刻 -->
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
    <!--添加旅客信息-->
    <div v-transfer-dom>
      <popup v-model="showPsg" height="100%" width="100%" position="right" :show-mask="true" hide-on-blur style="background: #f2f3f5 ">
        <div>
          <!--showFlag 用来控制Passenger内部的popup显示隐藏-->
          <swp-psg-list 
            v-if="showPsgCom" 
            ref='psg' 
            psgType="train" 
            :showPsgFlag="showPsg"
            v-model='customerList' 
            :maxLength='maxLengthPsg' 
            :addPsgFlag='true' 
            :errorMsg="errorMsg" 
            :errorIDCodeList="errorIDCodeList"
            @psgFunc="psgFunc" 
            @SLloginUserInfo="SLloginUserInfoFun"
            @TchatLoginUserInfo="TchatLoginUserInfoFun"
            @closePsgList="closePsgListFun"
            :hasPickFApp4Prod="hasPickFApp4Prod">
          </swp-psg-list>
          <!-- <Passenger 
            ref='psg' 
            psgType="train" 
            :showPsgFlag="showPsg"
            v-model='customerList' 
            :maxLength='maxLengthPsg' 
            :addPsgFlag='true' 
            :errorMsg="errorMsg" 
            :errorIDCodeList="errorIDCodeList"
            @psgFunc="psgFunc" 
            @SLloginUserInfo="SLloginUserInfoFun"
            @TchatLoginUserInfo="TchatLoginUserInfoFun"
            @closePsgList="closePsgListFun"
            :hasPickFApp4Prod="hasPickFApp4Prod">
          </Passenger> -->
        </div>
      </popup>
    </div>
    <!--编辑旅客信息-->
    <div v-transfer-dom>
      <popup v-model="showEditPsg" height="100%" width="100%" position="right" :show-mask="true" hide-on-blur style="background: #f2f3f5 ">
        <div v-if="showEditPsg">
          <swp-psg-edit 
            v-if="showPsgCom" 
            ref="EditPsgItem" 
            psgType="train" 
            :Passenger='psgInfo' 
            @deledPsg="deledPsgFun"
            @editedPsg="editedPsgFun"
            :HasPickFApp4Prod="hasPickFApp4Prod">
          </swp-psg-edit>
          <!-- <EditPsg 
            ref="EditPsgItem" 
            psgType="train" 
            :Passenger='psgInfo' 
            @deledPsg="deledPsgFun"
            @editedPsg="editedPsgFun"
            :HasPickFApp4Prod="hasPickFApp4Prod">
          </EditPsg> -->
        </div>
      </popup>
    </div>

    <!--无审批单-->
    <div v-transfer-dom>
      <popup v-model="showNoApply" @on-cancel="showNoApply=false" height="100%" width="100%" position="right" class="confirmPay">
        <gotoApplyTravel></gotoApplyTravel>
      </popup>
    </div>
    <!-- loading -->
    <div v-transfer-dom>
      <loading :show="popLoading" text="加载中"></loading>
    </div>
    <!-- 退改规则 -->
    <div v-transfer-dom>
      <popup v-model="showTuiGaiRule" height="90%" width="100%" position="bottom" class="trainticketrule-des">
        <Description v-if="showTuiGaiRule" @closeDesc="showTuiGaiRule = false" />
      </popup>
    </div>
    <!-- 联系电话（159 1234 5678）非当前乘客电话号码，确认继续下单？ -->
    <div v-transfer-dom>
      <confirm v-model="showTelTips" cancel-text="取消" confirm-text="确定"  @on-cancel="flagNum = 0" @on-confirm="confirmOrder">
        <div class="overTimePop">
          <div class="title">联系电话（{{contactNum}}）非当前乘客电话号码，确认继续下单？</div>
        </div>
      </confirm>
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
                <span v-if='showSurnameFun(customer.idCode)'>{{(customer || {}).firstName}} {{(customer || {}).lastName}}</span>
                <span v-else>{{customer.name}}</span>
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
  </div>
</template>

<script>
// import CouponItem from 'components/coupon/couponItem.vue';
import ScrollLock from 'trainComponents/scrollLock/vue-scroll-lock.vue';
import selectSeat from 'trainComponents/trainComp/selectSeat.vue'
import protocols from 'components/protocols/comp/protocols.vue'
import Description from 'components/trainticketrule/description.vue';
import trainHandler from 'trainHandler/common/lib/trainHandler.js';
import icon from "components/icon/index.vue"
const BisType = trainHandler.BisType;
import mixin from 'trainHandler/common/lib/trainMixin.js';
import {
  TransferDom,
  Popup,
  Confirm,
  Loading,
  XDialog 
} from 'vux';
  import gotoApplyTravel from 'components/apply/gotoApplyTravel.vue';
  // import Passenger from 'components/Passenger/list.vue';
  // import EditPsg from 'components/Passenger/edit.vue';
  import {IDTypeArr, showSurname} from '../common/lib/IDInfos.js'; //根据IDCode判断是否显示英文名
  import LoadingX from "components/loading/index";
  import SnSwitch from "components/switch";
  import {getAPPCustomConfigs} from 'feature/customFunctionConfigs.js';  

  export default {
    directives: {
      TransferDom
    },
    mixins: [trainHandler.mixin.tChatEventMixin,mixin],
    beforeRouteLeave(to, from, next) {
      console.log(' beforeRouteLeave !')
      let that = this;
      trainHandler.stateManager.closeTopPop(()=>{
        if (that.showReceiptEdit) {
          if (that.$refs.invoiceCard.showAddInvoice) {//二级处理
            that.$refs.invoiceCard.showAddInvoice = false;
          } else {
            that.showReceiptEdit = false;
          }
        }else{
          next();
        }
      });
    },
    beforeRouteEnter(to, from, next) {
      next()
    },
    components: {
      // CouponItem,
      Popup,
      Confirm,
      Description,
      LoadingX,
      ScrollLock,
      selectSeat,
      gotoApplyTravel,
      Loading,
      XDialog,
      icon,
      SnSwitch,
      protocols
      // Passenger,
      // EditPsg
    },
    data: function () {
      let that = this;
      let managerData = trainHandler.stateManager.setData([
        //人员编辑界面
        {
          name: 'showEditPsg',
          hide:{
            title: '编辑订单',
            callback(){
              that.$refs.EditPsgItem.idCode = 0;
              that.hasPickFApp4Prod = true;
            }
          },
          show:{
            title: '编辑乘客'
          }
        },
        //人员添加界面
        {
          name: 'showPsg',
          show:{
            callback(){}
          },
          hide:{
              title:'编辑订单',
              callback(){}
          }
        },
        //没有审批单
        {
          name: 'showNoApply',
          hide: {
            title: '编辑订单'
          },
        },
        //发票抬头
        {
          name: 'showReceiptEdit',
          hide: {
            title: '编辑订单',
            callback(){}
          },
        },
        //列车时刻
        {
          name: 'showTravelByPop',
          hide: {
            title: '编辑订单'
          },
        },
        //退改规则 
        {
          name: 'showTuiGaiRule',
          hide: {
            title: '编辑订单'
          },
        },
      ], that);
      return Object.assign(managerData,{
        currCoupon: null,//当前选择的优惠券
        userLoading: true,
        showReim: false,
        showEditPsg: false,
        isSubmiting: false,
        totalPrice: 0,
        FareAmount:0,// 默认总价
        psgInfo: {},
        invoiceDetail: {}, //发票的相关信息
        tavelList: [],
        trainDetail: {},
        banningPrice: 0, //当前的坐席价钱
        contactNum: '',
        contactName: '',
        customerList: [],
        seatLevel: '',//座席名称
        BanningData: {}, //座席详情 leave/price/name
        showDetailDom: false,
        startDate: '',
        endDate: '',
        showNoApply: false,
        orderNo: 0, //订单号
        productChannel: 99, //渠道号
        OutTicketPoundage: 5, //手续费
        showOrderProcess: false,
        processPrecent: 0,
        isOriginHei: true,
        screenHeight: document.documentElement.clientHeight,
        originHeight: document.documentElement.clientHeight,
        specialPermissionInfos:[],//免审批信息
        errorMsg:'当前行程不支持使用该证件，请更换证件',
        errorIDCodeList:[],//不能选择的IDType
        IDTypeArr:IDTypeArr,//所有的证件类型arr
        searchDate: trainHandler.getStorage('startDate'), //车次的日期
        showTelTips:false, //联系电话（159 1234 5678）非当前乘客电话号码，确认继续下单？
        flagNum:0,//用来是否过过滤掉showTelTips弹窗的
        ChooseSeats:[],//选座最后传递的字符串
        psgList:[],//请选择乘机人的乘客列表，最多显示5个
        AppConfigs:null,//定制功能配置表
        hasCoupon4Prod:true,//是否支持 优惠券 功能，默认支持
        hasPickFApp4Prod:true,//是否支持 从T信选人 功能，默认支持
        hasReimburse4Prod:true,//是否支持 报销凭证 功能，默认支持
        maxLengthPsg:5, //最多可购票的乘客数量
        isPc:false,//是否是pc端
        AcceptNoSeat:false, //是否接受无座参数，0=不接受，1=接受
        showInvoiceComp:false, //是否显示invoice组件js
        showPsgCom:false, //是否显示passenger组件js
        popLoading: false,
        useTypeConfig: null,
        showImportInvoice: false, //是否显示导入企业发票抬头的按钮 变量 true=显示 false=不显示 默认是false
      });
    },
    created: async function () {
      const that = this;
      if(trainHandler.isPC()){
          that.isPc = true;
      }
      await trainHandler.authInterceptor();

      that.initAppBackFun();
     
      that.getMyCustomConfigs();
      

      that.$emit('showOff', true);

      //缓存里面取车次详情
      that.trainDetail = !!trainHandler.getStorage('trainDetail') ? JSON.parse(trainHandler.getStorage('trainDetail')) : {};
      //缓存里面取座席详情
      that.BanningData = !!trainHandler.getStorage('BanningData') ? JSON.parse(trainHandler.getStorage('BanningData')) : {};
      that.banningPrice = that.BanningData.price || 0;//座席价格
      that.seatLevel = that.BanningData.name || '';//座席名称

      that.startDate = new Date(trainHandler.getStorage('startDate')).format('MM月dd日') + "  " + trainHandler.indexToWeek(new Date(trainHandler.getStorage(
        'startDate')).getDay());
      const endDate = new Date(trainHandler.getStorage('startDate')).getTime() + that.trainDetail.runDays * 24 * 3600000;
      that.endDate = new Date(endDate).format('MM月dd日') + "  " + trainHandler.indexToWeek(new Date(endDate).getDay());     
      this.useTypeConfig = await trainHandler.useTypeConfig();
      this.showReim = trainHandler.getStorage(trainHandler.primaryKey + 'trainIsShowReim') == 'true'; //报销凭证 需求是默认记住上次的报销凭证选择的结果
      if(this.useTypeConfig.isPublic(this.$route.query.useType)){
        that.GetSpecial();
      }

    },
    mounted: function () {
      const that = this;
      //获取当前供应商支持的火车票购票的证件类型
      that.getTrainCanBookCertificateType();
      //动态加载js
      that.dynamicLoadingJs();
      that.autoCloseLoading();
      //首先更新一遍价格
      that.handleTotalPrice();

      
      document.title = '编辑订单';
      window.onresize = function () {
        return (function () {
          that.screenHeight = document.documentElement.clientHeight;
        })()
      } 
    },
    updated: function () {},
    beforeDestory: function () {},
    watch: {
      contactNum:{
        handler(newVal){
          this.flagNum = 0;
          let value = newVal.replace(/\D/g, '').substr(0, 11) // 不允许输入非数字字符，超过11位数字截取前11位
          let len = value.length 
          if (len > 3 && len < 8) {                  
            value = value.replace(/^(\d{3})/g, '$1 ')               
          } 
          else if (len >= 8) {
            value = value.replace(/^(\d{3})(\d{4})/g, '$1 $2 ')
          }
          this.contactNum = value
        },
        deep:true
      },
      customerList: {
        handler(val,old) {
          let that=this;          
          //hasCoupon4Prod决定是否调用优惠券接口。因为hasCoupon4Prod是异步请求获取的，会存在时序问题，
          //异步获取hasCoupon4Prod后会做优惠券的数据置空处理，参看getMyCustomConfigs方法。
          // if(that.hasCoupon4Prod){ //todo 暂时屏蔽掉优惠券的相关代码
          //   that.getUserValidCoupon();
          // }
          this.handleTotalPrice()
        },
        deep: true
      },
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

        initAppBackFun(){
          const that = this;
          //注册并监听t信返回事件
        //   sinosdk.sino.onBack(function(){
        //     trainHandler.throttle(function() {
        //       trainHandler.stateManager.closeTopPop(()=>{
        //         let text = '订单还没有提交，确定要离开这个页面吗？';
        //         trainHandler.showConfirm(text, function(){
        //           that.$router.back();
        //         }, 2, '继续预订', '离开', null, null, true);
        //       });
        //     }.bind(that));
        //   },that)
        //   trainHandler.reFreshPage(() => {
        //     that.handleTotalPrice()
        //   });
          sinosdk.sino.overwriteWindowopen();
        },
        //注册并监听t信返回事件
        goBackFun(){
            const that = this;
            let text = '订单还没有提交，确定要离开这个页面吗？';
            trainHandler.showConfirm(text, function(){
                that.$router.back();
            }, 2, '继续预订', '离开', null, null, true);
        },
        //动态加载js（包括发票/乘客）
        dynamicLoadingJs(){
          let that = this;
          //动态加载发票的js组件
          that.loadInvoiceComp();
          //动态记载乘客的js组件
          that.loadPsgComp();
        },


        //根据运维后台是否配置了企业发票抬头的地址url来判断，导入企业发票抬头按钮是否显示 
        checkImportInvoiceBtn(flag){
            this.showImportInvoice = flag;
        },
        //动态加载发票的js组件
        loadInvoiceComp(){
          let that = this;
          trainHandler.loadJs('swpInvoice','invoice',()=>{
            that.showInvoiceComp = true;
          })
        },
        //动态加载发票的js组件
        loadPsgComp(){
          let that = this;
          trainHandler.loadJs('swpPsg','passenger',()=>{
            that.showPsgCom = true;
          })
        },
        //判断乘客的证件是否为护照，用来显示firstName和lastName
        showSurnameFun(idCode){
          return showSurname(idCode);
        },
        //获取T信登录信息的回调
        TchatLoginUserInfoFun(data){
          this.userLoading = false;
          this.setContactInfo(data);
        },

        //获取商旅登录人的信息 用来选中自己
        SLloginUserInfoFun(data){
          let that = this;
          that.userLoading = false;          
          that.customerList.push(data);
        },

        //跳转到12306登录页面
        goLogin(){
          this.$router.push({
            path: '/login/12306'
          })
        },

        //关闭乘客列表的组件
        closePsgListFun(){
          this.showPsg = false;
          document.title = '编辑订单';
        },
        //编辑乘客组件点击删除按钮
        deledPsgFun(data){
          let that = this;
          that.showEditPsg = false;
          //重新拉取乘客数据列表
          that.$refs.psg.initData(true);
          //处理编辑选中人员信息，将选中人员信息更新到最新
          that.customerList = that.customerList.filter((item) => {
            return item.passengerId != data.passengerId
          });
        },
        //编辑乘客组件点击编辑保存按钮
        async editedPsgFun(data, wrongIdTypeFlag, flag){
          let that = this;
          //重新拉取乘客数据列表
          let list = await that.$refs.psg.initData(true);
          let newData = list.find(item=>{
            return data.passengerId == item.passengerId
          })
            
          if(!!wrongIdTypeFlag){//说明此时编辑后的已选中的证件信息是不支持购买火车票的，此时需要移除选中
              that.customerList = that.customerList.filter((item) => {
                  return item.passengerId != newData.passengerId;
              });
          }else{ //处理编辑选中人员信息，将选中人员信息更新到最新
              that.customerList = that.customerList.map((item) => {
                if (item.passengerId == newData.passengerId) {
                  item = newData;
                }
                return item;
              });
          }
         
          
          //关闭编辑乘客的弹窗
          if(!flag){
            that.showEditPsg = false;
          }
        },
        //获取当前供应商支持的火车票购票的证件类型 IDTypeArr 接口获取的是当前可用的证件类型，传给参数的是不可用的证件类型 需要处理一下
        getTrainCanBookCertificateType(){
          let that = this;
          that.errorIDCodeList = [];
          let allType = [];
          that.IDTypeArr.forEach(item=>{
            allType.push(item.key);
          })
          let param = {
          }
          trainHandler.getTrainCanBookCertificateType(param).then(res=>{
            let availableIdType = [];
            res.result.typeList.forEach(item=>{
              availableIdType.push(item.code);
            })
            allType.forEach(item=>{
              if(availableIdType.indexOf(item)==-1){
                that.errorIDCodeList.push(item);
              }
            });
          }).catch(e=>{
            console.log(e)
          })
        },

       
        /**
         * 每次进入页面，自动拉取一次 定制业务的配置数据，用于 不同的渠道， 
         * 控制定制业务的显示与否
         */
        getMyCustomConfigs(){
            let that = this;
            //每次进入页面，自动拉取配置数据
            getAPPCustomConfigs().then(response=>{
                that.AppConfigs = response;
                //红包优惠券 定制功能 取值
                that.hasCoupon4Prod = response && response.RedPocket ? response.RedPocket.DisPlay : true;
                if(!that.hasCoupon4Prod){
                    //如果优惠券的配置为false，为了排除getUserValidCoupon()的时序问题，手动将优惠券数据置空。
                    that.$set(that.BanningData, 'couponList', null);
                    that.setCoupon(null);
                }
                //报销凭证 定制功能 取值
                that.hasReimburse4Prod = response && response.Reimburse ? response.Reimburse.DisPlay : true;
                //从T信选人 定制功能 取值
                that.hasPickFApp4Prod = response && response.TchatAddress ? response.TchatAddress.DisPlay : true;                                
            }).catch(error=>{
                console.log(error);
            })                
        },  

      
      //显示未核验的弹窗
      showNoCheckConfirm(psgItem){
        let that = this;
        let text = '根据铁路局规定，乘车人需进行手机号核验后才可购票，请编辑乘客并核验手机号';
        trainHandler.showConfirm(text, function(){
          that.psgInfo = psgItem;
          //隐藏编辑乘客从t信选人的图标
          that.hasPickFApp4Prod = false;
          that.showEditPsg = true;
        }, 2, '忽略', '编辑乘客', '温馨提示', null, true);
      },

      //点击乘客方块
      async cliPsgItem(psgItem){
        let that = this;

        if(that.handlePsg(psgItem, that.customerList)){//说明已经选中了
          for(let i=0;i<that.customerList.length;i++){
            if(that.customerList[i].passengerId == psgItem.passengerId){
              that.customerList.splice(i,1);
              break;
            }
          }
        }else{//如果是选择新增乘客
          
          //如果乘客手机号核验，此时弹窗提示不能选择
          if(!psgItem.mobileVerifyComplete){
            that.showNoCheckConfirm(psgItem);
            return
          }else{//如果乘客的mobileVerifyComplete字段为true,此时需要重新核验一下乘客的身份，（此处需要重新核验的原因是：同程供应商身份核验只支持30分钟，30分钟内不需要核验，30分钟后均需要核验）
            //此时需要重新核验手机
            let resultData = await that.$refs.psg.identityVerification(psgItem);
            // console.log('resultData', resultData)
            if(!!resultData && !!resultData.result.captcha){ //此时说明未核验
              that.showNoCheckConfirm(psgItem);
              return
            }else if(resultData == false){
              console.log('核验身份的接口报错');
            }
          } 


          //如果火车票乘客未经过身份核验，此时弹窗提示不能选择
          if(!psgItem.identityCardVerifyComplete){
            trainHandler.showConfirm('身份信息未经核验，需持证件原件到车站售票窗口办理核验', function(){}, 1, '我知道了', null, '温馨提示', null, true);
            return
          } 


          if(that.customerList.length > that.maxLengthPsg-1){
            let str = '您最多只能给' + that.maxLengthPsg + '名乘客订票！';
            trainHandler.showToast(str);
          }else{
            //往乘客列表推送乘客的时候，首先判断是否存在，解决连续点击乘客item框，下面出现多个乘客的问题
            if(!that.handlePsg(psgItem, that.customerList)){
              that.customerList.push(psgItem);
            }
          }
        }

      },

      // pagItem是否在customerList存在  返回true or false
      handlePsg(pagItem, customerList){
        let flag = false;
        for(let i=0;i<customerList.length;i++){
          if(customerList[i].passengerId == pagItem.passengerId){
            flag = true;
            break;
          }
        }
        return flag;
      },
      // 处理乘客list
      psgFunc(val){
        this.psgList = val;
      },
      chooseFun(data){
        let that = this;
        that.ChooseSeats = JSON.parse(data);
      },
        /**
       * loading超时自动关闭
       */ 
      autoCloseLoading(){
        setTimeout(()=>{
            this.userLoading = false;
        },15000);
      },
      
      /**
       * 设置下单联系人信
       */ 
      setContactInfo(data){
        let that = this;
        if(!that.contactNum){
            that.contactNum = data.phone;
        }
        if(!that.contactName){
            that.contactName = data.name;
        }
      },

      /**
       * 打开发票
       */
      showInvoice(item) {
        const that = this;
        if(!that.showInvoiceComp){
            that.popLoading = true;
            setTimeout(()=>{
                that.showInvoice();
            },100);
            return;
        }
        that.popLoading = false;
        that.showReceiptEdit = true;
        document.title = '发票抬头';
      },
      /**
       * 根据当前条件重新获取优惠券
       */ 
      getUserValidCoupon(){
        let that = this;
        let param = {
            UnitPrice: Number(that.BanningData.price),
            PassengerCount: that.customerList.length,
            ProductType: 3,
        }
        trainHandler.findPersonalCoupon(param).then((res) => {
            if (res.resultCode == 0 && !!res.result && res.result.CanUseCoupon.length>0) {
                that.$set(that.BanningData, 'couponList', res.result.CanUseCoupon);
                that.setCoupon(res.result.CanUseCoupon[0]);
            }else{
                that.$set(that.BanningData, 'couponList', null);
                that.setCoupon(null);
            }
        }).catch((err) => {
            that.$set(that.BanningData, 'couponList', null);
            that.setCoupon(null);
        });
      },
      /**
       * 设置当前的优惠券
       */ 
      setCoupon(coupon){
        if(!coupon || Object.keys(coupon).length==0){
            this.currCoupon = null;
        }else{
            if(Number(this.totalPrice) > coupon.CouponValue){
                this.FareAmount = Number(this.totalPrice) - coupon.CouponValue;
            }
            this.currCoupon = coupon;//设置默认优惠券
        }
        this.handleTotalPrice();
      },


      //火车票需要核验身份信息和手机号信息
      judgeCheck(val){
        const that = this;
        let res = false;
        if ((!!val && !val.identityCardVerifyComplete) || (!!val && !val.mobileVerifyComplete) ) {
          res = true;
        }
        return res;
      },


      judgeEmpty(val) {
        const that = this;
        let res = true;
        if (!!val && !!val.idNum && (val || {}).idNum.length > 0) {
          res = false;
        }
        //身份证只需要国家地区
        if(0==val.idCode){
            if(!!!val.abbreviation){
                res = true
            }
        }else{//其他证件需要国家地区和有效期截止日期
            if(!!!val.abbreviation){
                res = true
            }
            if(!!!val.term){
                res = true
            }
        }
        return res;
      },
      goBack() {
        const that = this;
        that.$router.go(-2)
      },
      /**
       * 编辑旅客
       */
      editCustomer(val, index) {
        const that = this;
        //隐藏编辑乘客从t信选人的图标
        that.hasPickFApp4Prod = false;
        console.log('editCustomer start')
        that.psgInfo = val;
        that.showEditPsg = true;
        document.title = '编辑常用乘客';
      },
      /**
       * 添加旅客
       */
      addCustomer() {
        const that = this;
        document.title = '添加乘客';
        //跳转到人员添加页面
        that.showPsg = true;
      },
      /**
       * 设置登录的人员信息作为默认乘客
       */
      toPage() {
        const that = this;
        setTimeout(() => {
          trainHandler.openPageLib('order/index.html#/detail/train?orderNo='+that.orderNo+'&pageFrom=pay');
        }, 500)
      },
      showTravel() {
        const that = this;
        that.showTravelByPop = true;
        document.title = '列车时刻';
      },
      /**
       * 从T信获取联系人作为下单联系人
       */
      changeConnector() {
        let that = this;
        sinosdk.sino.contacts([], 0).then((data)=>{
          if(0<data.length){
              that.contactNum = data[0].uPhone;
          }
        });
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
       * 删除旅客
       */
      deleteCustomer(customer, index) {
        const that = this;
        that.customerList.splice(index,1);
      },
      handleTotalPrice() {
        const that = this;
        const length = that.customerList.length;
        that.totalPrice = 0;
        if (!!that.banningPrice) {
          that.totalPrice = Number(that.banningPrice);
        }
        that.totalPrice = length * (that.totalPrice + (that.OutTicketPoundage * 1));
        if(!!that.currCoupon){
            if(that.totalPrice >= that.currCoupon.CouponValue){
                that.FareAmount = that.totalPrice - that.currCoupon.CouponValue
            }
        }else{
            that.FareAmount = that.totalPrice
        }
      },

      /**
       * 下单前的数据有效性检查
       */
      validate() {
        const that = this;
        let res = true;
        if (that.customerList.length <= 0) {
          trainHandler.showToast('请先选择购票乘客');
          res = false;
          return;
        }else{
          for(let i=0;i < that.customerList.length; i++){
            let item = that.customerList[i];
            if(!item.idNum){
              trainHandler.showToast('请先完善乘客信息');
              res = false;
              return;
            }
            //验证乘客国家地区信息
            if(!!!item.abbreviation){
              res = false;
              trainHandler.showToast('请先完善乘客国家地区信息');
              return;
            }
            //非身份证需要乘客证件有效期截止日期
            if(0 != item.idCode){
              if(!!!item.term){
                res = false;
                trainHandler.showToast('请先完善乘客证件有效期截止日期');
                return;
              }
            }
          }
        }
        if (that.BanningData.leave < that.customerList.length) {
          trainHandler.showToast('当前订票超出余票总数，请修改');
          res = false;
          return;
        }
        if (!that.contactNum ) {
          trainHandler.showToast('请完善联系人手机号');
          res = false;
          return;
        }
         
        if (that.showReim) {
          if (!(!!that.invoiceDetail.titleId)) {
            trainHandler.showToast('当前报销凭证信息不完整，请修改');
            res = false;
            return;
          }
        }

        //手机号未核验不能下单
        let findIndex = that.findIndex(that.customerList, item=>{
            return !item.mobileVerifyComplete; 
        })             
        if( findIndex > -1 ){//说明存在
          trainHandler.showToast('当前选择的乘客手机号未核验，请核验');
          res = false;
          return;
        }

        return res;
      },

      /**
       * 确认下单操作
       */
      confirmOrder() {
        const that = this;
        if (that.validate()) {
           //常客管理里面年龄小于12岁的乘客必须与大人一起
          let yearFlag = false;
          for(let i = 0; i<that.customerList.length; i++){
            let ageYear = that.customerList[i].birthday.split('/')[0];
            let nowYear = new Date().getFullYear();
            if(nowYear - ageYear >= 12){
              yearFlag = true;
              break;
            }
          }
          if(!yearFlag){
            trainHandler.showConfirm('儿童不能单独旅行，请与成人票一同购买。', function(){}, 1, '确定', null, '温馨提示', null, true);
            return
          }
          
          //验证坐席选择是否一致和乘车人数量
          if(that.ChooseSeats.length>0&&that.ChooseSeats.length!=that.customerList.length){
            trainHandler.showToast('请按照乘车人个数选择对应的席位！');
            return
          }
          // 校验输入的联系电话的格式校验
          //先去除空格
          let newContactNum = that.contactNum.replace(/\s*/g,"");
          if(!trainHandler.isMobile(newContactNum)){
            trainHandler.showToast('联系电话格式错误')
            return
          }
  
          //联系电话（159 1234 5678）非当前乘客电话号码，确认继续下单？
          if(that.customerList.length>0 && that.flagNum == 0){
             let findIndex = that.findIndex(that.customerList, item=>{
               return item.phone == newContactNum; 
             })             
            if( findIndex == -1 ){//说明不存在,显示弹窗
              that.flagNum = 1;
              that.showTelTips = true;
              return 
            }
          }

          //获取差标相关的信息
          // that.GetSpecial();

          that.showDetailDom = false;
          const seatType = that.selectSeatType2Code();//code坐席中文名的映射mapCode
          const orderInfo = {
            "orderAmount": that.totalPrice,
            "channelId": trainHandler.channelId,
             // 'FareAmount':that.FareAmount,
            "ticketFare": Number(that.banningPrice),
            "startStation": that.trainDetail.startStation,
            "endStation": that.trainDetail.toStation,
            "startCity": trainHandler.getStorage('fromCity'),
            "endCity": trainHandler.getStorage('toCity'),
            "startDate": new Date(trainHandler.getStorage('startDate')).format('yyyy/MM/dd'),
            "trainNo": that.trainDetail.trainCode,
            "runTime": that.trainDetail.runTime,
            "startTime": that.trainDetail.goTime,
            "endTime": that.trainDetail.endTime,
            "contactName": that.contactName || newContactNum,//如果当前联系人姓名没有 填写电话
            "contactPhone": newContactNum,
            "queryKey": trainHandler.getStorage('queryKey'),
            "fromStationCode":that.trainDetail.startStationCode,
            "toStationCode":that.trainDetail.toStationCode,
            "trainClass":that.trainDetail.trainClass,
            "acceptNoSeat":that.AcceptNoSeat?1:0,//是否接受无座，0=不接受，1=接受
          };
          if(that.ChooseSeats.length>0){
            orderInfo.chooseSeats = that.ChooseSeats.join('');
          }
          let orderPsgList = [];
          that.customerList.forEach((item) => {
            let objcustomerObj = {
                "psgName": showSurname(item.idCode) ? (item.firstName + "/" + item.lastName) : item.name,
                "ticketType": 0,
                "seatType": seatType,
                "cardType": (item || {}).idCode || 0,
                "cardNo": (item || {}).idNum,
                "phone": item.phone,
                'psgId': item.passengerId,
                'nationCode':item.abbreviation,
                'birthday':item.birthday, 
                'gender':item.gender, 
            }
            //非身份证类型需要证件有效期截止日期
            if(0 != item.idCode){
                objcustomerObj['cardExp'] = item.term
            }
            if(!!item.passengerUserId){
                objcustomerObj['userId'] = item.passengerUserId
            }
            if(!!item.thirdUserId){
                objcustomerObj['thirdUserId'] = item.thirdUserId
            }
            orderPsgList.push(objcustomerObj)
          });
          let obj = {
            "companyId": trainHandler.companyId,
            "userId": trainHandler.userId,
            "orderInfo": orderInfo,
            "orderPsgList": orderPsgList,
            "specialPermissionInfos":that.specialPermissionInfos || [],
          };

          //获取founderInfo的相关信息，从token里面去取
          let founderInfo = {
            companyName: trainHandler.companyName || '',
            companyId: trainHandler.companyId,
            userName: trainHandler.userName || '',
            userId: trainHandler.userId,
            channelName: trainHandler.channelName || '',
            channelId: trainHandler.channelId,
          }
          obj = Object.assign({}, obj, {
            founderInfo: founderInfo
          })


          //todo 暂时屏蔽掉优惠券的相关功能
          // if(!!that.currCoupon&&that.currCoupon.CouponId){
          //     let Coupons=[] // 优惠券id列表
          //     Coupons.push(that.currCoupon.CouponId)
          //     obj.Coupons=Coupons
          // }

          //下单拼接因公因私的参数
          obj.useType = this.$route.query.useType || that.useTypeConfig.default();
          
          if (!!that.$route.query.tripNo && that.useTypeConfig.isPublic(that.$route.query.useType, 1)) { 
            obj.tripNo = that.$route.query.tripNo
          }

          //整合下单发票相关的参数
          if (that.showReim) {
            obj.title = that.invoiceDetail;
            obj.invoiceContent = '*现代服务*服务费';
            obj.invoiceFlag = 1; //是否需要保险凭证, 0不需要, 1需要
          }else{
            obj.invoiceFlag = 0; //是否需要保险凭证, 0不需要, 1需要
          }

          //记住此次是打开了报销凭证
          trainHandler.setStorage(trainHandler.primaryKey + 'trainIsShowReim', that.showReim);

          if (!that.isSubmiting) {
            that.isSubmiting = true;
            that.showOrderProcess = true;
            setTimeout(() => {
              that.handleProcess()
            }, 500)
            trainHandler.createOrder(obj).then((res) => {
              that.closeProcess();
              that.isSubmiting = false;
              if (res.resultCode == 0) {
                that.orderNo = res.result.orderNo;
                that.toPage();
              } else if (46100001 == res.resultCode) { //没有审批单
                that.showNoApply = true;
                document.title = '提示';
              } else {
                trainHandler.showToast(res.rdesc)
              }
            }).catch((err) => {
                console.log(err);
                that.isSubmiting = false;
                that.closeProcess();
            });
          } else {
            trainHandler.showToast('订单正在生成中，请勿重复提交')
          }
        }
      },
   
      /**
       * 产品定制需求，金贝取消T信选择
       */
      productChannelProcess() {
        const that = this;
        that.productChannel = trainHandler.getStorage('productChannel');
        if (that.productChannel == 10000) {
          that.changeOption = ['手动添加', '常用旅客'];
        }
      },
      /**
       * 显示退改签规则页面
       */
      gotoTuiGaiRules() {
        const that = this;
        that.showTuiGaiRule = true;
      },

      //判断是否是伴正事，是伴正事的才有导入发票的功能
      isBizMate(){
        return !!(trainHandler.getBizMateVersion())||!!trainHandler.isPC();
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
       * 获取免审批信息
       */ 
      GetSpecial(){
        let _this = this;
        // return new Promise((resolve, reject) => {
          // trainHandler.GetSpecialFunction({uaid:0, cpyId:0}).then(function (data) {     
          //   if(data.ret == 0){
          //     _this.specialPermissionInfos = data.responseData.specialPermissionInfos;
          //     resolve(_this.specialPermissionInfos);
          //   }
          // }).catch(e=>{
          //   reject('获取差标信息错误');
          // }); 
        // })
      },
      findIndex(array, value) {
          let _index = -1;
          if (!array || array.length == 0) {
              return _index;
          }
          let _value = value;
          let _key = null; 

          //value是函数，则直接用函数匹配
          if (value.constructor === Function) {
              array.some((obj, index) => {
                  if (value(obj)) {
                      _index = index;
                      return true;
                  }
              })
              return _index;
          }

          //value是对象，则取第一个key进行过滤
          //其他情况，直接用value匹配过滤
          if (value.constructor === Object) {
              let keys = Object.keys(value);
              if (keys.length == 0) {
                  return _index;
              }
              _key = keys[0];
              _value = value[_key];
          }
          array.some((obj, index) => {
              if (!!_key && obj.constructor === Object) {
                  obj = obj[_key];
              }
              if (obj == _value) {
                  _index = index;
                  return true;
              }
          })
          return _index;
      },

      //导入企业发票抬头
      async importInvoiceFun(){
          let flag = await this.$refs.invoiceCard.gotoImportInvoice('single');
      }  
    }
  }

</script>
<style scoped lang="less">
@import '~themes/default/styles/orderConfirm.less';
</style>
<style lang="less" scope>
@import '~styles/core/common.less';
   .progressDia {
    .weui-dialog {
      width: 86%;
      max-width: 6.3rem;
      border-radius: .2rem; 
    }
  }


  .ReceiptEditPop {
    z-index: 999;
    height: 100%;
    background: @background-color;
  }
  .trainticketrule-des.vux-popup-dialog{
    border-radius: .2rem .2rem 0 0;
    background: @sub-background-color;
    overflow: hidden;
  }

</style>
