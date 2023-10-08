<template>
  <div class="edit">

     <!-- 顶部的top提示 -->
    <div v-if="phoneCheckedNo" class="toptips add">
      <div class="box">
        <p>应疫情防控需求，请您及时补全乘客联系方式并完成核验，手机号有误或填写他人手机号会导致购票失败，未成年人/老人等重点旅客可填写亲友手机号。</p>
      </div> 
    </div>

    <div v-if="isTrainEditWait" class="toptips edit">
      <div class="box">
        <p class="status">核验状态：<i>待核验</i></p>
        <p>身份信息未经核验，需持2代居民身份证原件到车站售票窗口办理核验</p>
      </div>
    </div>

    <div v-if="isTrainEditApproved" class="toptips edit approved">
      <div class="box">
        <p class="status">核验状态：<i>已通过</i></p>
        <p>该乘客已通过核验，姓名及证件类型不可在线编辑</p>
      </div>
    </div>

    <!-- 编辑乘客的相关项 -->
    <group>
      <!-- 姓名 -->
      <div class="lineForm lineBorderB" v-if='!$options.filters.showSurname(idCode)'>
        <span class="label">姓名</span>
        <div class="form_input text nameWrap">
          <SnTextarea :readonly="isTrainEditApproved" type="text" class='Name' maxlength="30" v-model='psgInfo.name' placeholder="请填写真实姓名" style="padding:0.33rem 0;text-align:left;"/>
        </div>
        <div @click="addTchatUser" class='T_addr_div cursorp' v-if="HasPickFApp4Prod">
          <icon type="btn_conmmon_phone" size='.4' />
        </div>
      </div>

      <!-- 英文姓名护照等 -->
      <div class="lineForm lineBorderB" v-if='$options.filters.showSurname(idCode)'>
        <span class="label long-label">
          <span>姓(英文)</span>
          <span>Surname</span>
        </span>
        <div class="form_input text"><input :readonly="isTrainEditApproved" type="text" ref='FirstName' maxlength="12" v-model='psgInfo.firstName'
            placeholder="如：ZHANG" />
        </div>
      </div>
      <div class="lineForm lineBorderB" v-if='$options.filters.showSurname(idCode)'>
        <span class="label long-label">
          <span>名(英文)</span>
          <span>Given name</span>
        </span>
        <div class="form_input text"><input :readonly="isTrainEditApproved" type="text" maxlength="12" v-model='psgInfo.lastName' placeholder="如：MIN" />
        </div>
      </div>
      <div class="lineIdDes">
        <span class='gray_clr'>{{nameRuleMap[idCode].rdetail}}</span><span class='blue_clr cursorp'
          @click="showNameRule">{{nameRuleMap[idCode].title}}</span>
      </div>

      <!-- 性别 -->
      <div class="lineForm lineBorderB" v-if='idCode!=0'>
        <span class="label">性别</span>
        <div class="text">
          <span class="chooseBut" :class="{choosed:psgInfo.gender==1}" @click="psgInfo.gender=1">男</span>
          <span class="chooseBut" :class="{choosed:psgInfo.gender==2}" @click="psgInfo.gender=2">女</span>
        </div>
      </div>

      <!-- 出生日期 -->
      <div class="lineTextWrap lineBorderB" v-if='idCode!=0'>
        <datetime v-model="psgInfo.birthday" placeholder="请选择出生日期" title="出生日期" format='YYYY/MM/DD' start-date='1900-01-01'></datetime>
      </div>

      <!-- 国家地区 -->
      <div class="lineTextWrap lineBorderB">
        <div class="label">国家地区</div>
        <div class="text rightBut cursorp" @click="showNationality(1)">
          <div>
            <span v-if="!psgInfo.nationality" class="cursorp empty-contry">请选择国家地区</span>
            <span v-else class="cursorp">{{psgInfo.nationality}}</span>
          </div>
        </div>
      </div>

      <!-- 国家地区 -->
      <div class="lineTextWrap lineBorderB" v-if='idCode!=0'>
        <div class="label">发证国家</div>
        <div class="text rightBut cursorp" @click="showNationality(2)">
          <div>
            <span v-if="!psgInfo.issueCountryName" class="cursorp empty-contry">请选择发证国家</span>
            <span v-else class="cursorp">{{psgInfo.issueCountryName}}</span>
          </div>
        </div>
      </div>     

      <!-- 证件类型  -->
      <div class="lineTextWrap lineBorderB">
        <div class="label">证件类型</div>
        <div class="text rightBut cursorp" @click="showIDTypePopFun">
          <span class="cursorp" :class="$options.filters.showIDTips(idCode)? 'IDTips' : ''">{{IDTypeListMap[idCode]}}</span>
            <icon @click.native.stop="showIDTips" type="icon_common_prompt" v-show='$options.filters.showIDTips(idCode)' size='.36' />
        </div>
      </div>

      <!-- 证件号码 -->
      <div class="lineForm lineBorderB">
        <span class="label">证件号码</span>
        <div class="form_input text"><SnTextarea :readonly="isTrainEditApproved" type="text" maxlength="18" @focus="changeData('idNum')" v-model='idNum' placeholder="请填写证件号码" style="padding:0.33rem 0;text-align:left;"/>
        </div>
      </div>   

      <!-- 证件有效期截止日期 -->
      <div class="lineTextWrap lineBorderB" v-if='0!=idCode'>
        <datetime v-model="psgInfo.term" placeholder="请设置证件有效期截止日期" title="证件有效期截止日期" format='YYYY/MM/DD' :start-date='termStartDate'></datetime>
      </div>   
    
      <!-- 手机号码 -->
      <div class="lineForm lineBorderB">
        <span class="label">手机号码</span>
        <div class="form_input text phone-text">
          <input type="text" maxlength="11"  @focus="changeData('phone')" v-model='psgInfo.phone' placeholder="请填写手机号码" />
          <span class="checkPhoneTipsYes" v-if="phoneCheckedNo">待核验</span>
          <span class="checkPhoneTipsYes checkPhoneTipsNo" v-else-if="phoneCheckedYes">已通过</span>
        </div>
      </div>

      <!--证件类型选择-->
      <popup v-model="showIDTypePop" class="payType pcDialog" position='bottom' :show-mask="false" height="100%" width="100%">
        <div class="bg cursorp" @click.stop="showIDTypePop=false"></div>
        <div class="textcontent content">
          <div @click="chooseIdType(addType.key, addType.index)" v-for="(addType,index) in addIdTypeList" :key="index"
            class="cursorp">
            {{addType.value}}
          </div>
        </div>
        <div class="footerCancle cursorp" @click="showIDTypePop=false">取消</div>
      </popup>

      <!--国家地区选择-->
      <popup v-model="showNationalityPop" class="NationalityType pcDialog" position='right' :show-mask="false" height="100%" width="100%">
        <div class="NationalityContent">
          <div 
            @click="chooseCountry(item)" 
            v-for="(item,index) in countryNames" 
            :key="index"
            class="lineBorderB cursorp NationalityItem">
            {{item.fullName}}
          </div>
        </div>
      </popup>   

      <!--证件类型样例-->
      <popup v-model="showIDTipsPop" class="payTypeIDTips pcDialog" position='bottom' :show-mask="false" height="100%" width="100%">
        <div class="bg cursorp" @click.stop="showIDTipsPop=false"></div>
        <div class="textcontent IDTips">
          <!--<div>
            {{(IDRuleMap[idCode]||{}).title}}
          </div>-->
          <div class='IDRule'>
            <img :src='(IDRuleMap[idCode]||{}).img'>
          </div>
          <div class="footer cursorp" @click="showIDTipsPop=false">
            <img class="white_close" src='./img/icon_close.png'/>
            <img class="gray_close" src='./img/icon_close_g9.png'/>
          </div>
        </div>
      </popup>
      

      <!--名称说明-->
      <popup v-model="showNameRulePop" class="nameRuleClass pcDialog" position='bottom' :show-mask="true" height="100%" width="100%">
        <div class="textcontent">
          <div class='title'>{{nameRuleMap[idCode].title}}</div>
          <div class='desc' v-html="fomateText(nameRuleMap[idCode].desc)"></div>
          <div class="footer cursorp" @click="showNameRulePop=false">我知道了</div>
        </div>
      </popup>
    </group>


    <div class="buttonWrap">
      <!-- 此处删除按钮的判断条件为如果当前证件为本人的话，此时是不能删除的，只能编辑 -->
      <div v-if="!isAddPsg && (UAId != Passenger.thirdUserId)" @click='delPsg' class="delete cursorp">删除</div>
      <div @click="confirm" class="save cursorp" :class="{onlyOneBtn:isAddPsg || (UAId == Passenger.thirdUserId)}">{{btnText}}</div>
    </div>

    <!-- 底部的针对火车票购票tips提示 -->
    <div v-if="isTrain" class="bottomtips">
      <p>根据铁路要求，为加强新冠肺炎疫情防控工作，自2月1日起，购票人需提供每一名乘客使用的手机号码：</p>
      <p class="top">1、未成年人、老人以及无手机的旅客，可提供监护人或能及时联系的亲友手机号码；</p>
      <p class="top">2、中国港澳台、外籍旅客如无境内手机号，可到 12306 app 中添加电子邮箱后再来购票。</p>
      <p class="top">
        <i>身份核验须知</i>
        <icon @click.native.stop="showVerifyTips=true" type="icon_common_prompt" size='.28' />
      </p>
      
    </div>

    <!--身份核验说明-->
    <div v-transfer-dom>
      <popup v-model="showVerifyTips" height="100%"  width="100%" position="right" style="z-index:1999; background:#fff" :show-mask="false">
          <identityVerifyTips />
      </popup>
    </div>

    <!--手机号核验发短信操作流程-->
    <div v-transfer-dom>
      <popup v-model="showPhoneVerify" height="100%"  width="100%" position="right" style="z-index:2000; background:#fff" :show-mask="false">
        <phoneVerify v-if="showPhoneVerify" ref="phoneVerify" :psgInfo="psgInfo" :checkNum="checkNum" @checkSucess="checkSucess"/>
      </popup>
    </div>

    <div v-transfer-dom>
      <loading :show="showCheckLoading" text="核验中..."></loading>
    </div>
  </div>
</template>

<script>
import icon from "components/icon/index.vue"
import identityVerifyTips from './identityVerifyTips.vue';
import phoneVerify from './phoneVerify.vue';
import mixins from './mixins';
import passengerHandler from './passengerHandler.js';
import {SnTextarea} from "sinosun-ui";
import {
    Group,
    Popup,
    Datetime,
    TransferDom,
    Loading
} from 'vux';
import {
    IDTypeArr,
    IDTypeMap,
    showSurname,
    nameRuleMap,
    /* eslint-disable */
    showIDTips,
    /* eslint-disable */
    IDRuleMap,
    isName,
    isSurname
} from './IDInfos.js';
let MASKING = SnUtils.DataMasking;
let ISDECORATE = SnTravel.functional.ISDECORATE;

export default {
    name:'swp-psg-edit',
    directives: {
        TransferDom
    },
    mixins:[mixins],
    components: {
        Group,
        Popup,
        Datetime,
        identityVerifyTips,
        phoneVerify,
        Loading,
        icon,
        SnTextarea
    },
    props: {
        Passenger: { //父组件传递进来的乘客信息
            type: Object,
            default:() => {
                return {
                    idCode: 0,
                    idType: '身份证',
                    idNum: ''
                }
            }
        },
        HasPickFApp4Prod:{//父组件传递过来的 是否显示从APP获取乘客功能
            type: Boolean,
            default:false
        },
        psgType:{//区别购买火车票/飞机票还是酒店
            type: String
        },
        usePlace:{//区别是在乘客列表引用的 还是直接在下单页面引用的 默认是orderConfirm（下单页面引用的）
            type: String,
            default: 'orderConfirm'
        },
        errorIDCodeList:{
            type:Array,
            default:() => []
        }
    },
    data() {
        let that = this;
        let title = document.title;
        let managerData = passengerHandler.stateManager.setData([
            {
                name: 'showNationalityPop',//国家地区选择弹框
                parent: this.usePlace == 'orderConfirm' ? '$refs.EditPsgItem' : '$refs.psg.$refs.edit',
                show:{
                    title: '设置国家地区'
                },
                hide:{
                    title
                }
            },
            {
                name: 'showIDTipsPop',//证件类型样例
                parent: this.usePlace == 'orderConfirm' ? '$refs.EditPsgItem' : '$refs.psg.$refs.edit'
            },
            {
                name: 'showIDTypePop',//证件类型弹框
                parent: this.usePlace == 'orderConfirm' ? '$refs.EditPsgItem' : '$refs.psg.$refs.edit'
            },
            {
                name: 'showTermPop',//证件有效期截止日期设置弹框
                parent: this.usePlace == 'orderConfirm' ? '$refs.EditPsgItem' : '$refs.psg.$refs.edit'
            },
            {
                name: 'showNameRulePop', //名称说明弹窗
                parent: this.usePlace == 'orderConfirm' ? '$refs.EditPsgItem' : '$refs.psg.$refs.edit'
            },
            {
                name: 'showVerifyTips',//身份核验相关说明
                type: 'page',
                parent: this.usePlace == 'orderConfirm' ? '$refs.EditPsgItem' : '$refs.psg.$refs.edit',
                show:{
                    title: '身份核验'
                },
                hide:{
                    title
                }
            },
            {
                name: 'showPhoneVerify',//手机号核验弹窗页面
                type: 'page',
                parent: this.usePlace == 'orderConfirm' ? '$refs.EditPsgItem' : '$refs.psg.$refs.edit',
                show:{
                    title: '联系方式核验'
                },
                hide:{
                    title,
                    callback(){
                        that.$refs.phoneVerify.clearinterval(); //取消定时器
                    }
                }
            }
        ]);
        return Object.assign(managerData, {
            idCode: 0,
            idType: '身份证',
            idNum: '',
            //在旅客中存储七种证件类型，最后编辑的证件类型放到常旅信息证件类型数组的第一个元素中
            addIdTypeList: IDTypeArr,
            IDTypeListMap: IDTypeMap,
            psgInfo: {},
            copyPsgInfo:{//复制值
                idNum:'',
                phone:''
            },
            isChange: {
                idNum: 1,
                phone: 1
            },
            nameRuleMap: nameRuleMap,
            IDRuleMap: IDRuleMap,
            isAddPsg: true, //是否是新增乘客 还是编辑乘客 新增乘客代表true
            countryNames:[],//国家地区数据
            termStartDate:new Date().format('yyyy/MM/dd'),
            UAId:'', //T信的UAId
            checkNum:'', //手机号校验的
            showCheckLoading: false, //是否显示核验的loading
            countryType: 1, // 选择国家的type 1=国家地址 2=发证国家
        })
    },
    beforeCreate() {},
    created() {
        //获取T信的UAId
        this.getTChatUaId();
    },
    mounted() {
        let that = this;
        //初始化新增或者要编辑的乘客信息
        that.initData()
        //获取国家地区数据
        that.getCountryNames();
    },
    watch: {
        'Passenger.passengerId': {
            handler(newVal) {
                if (newVal){
                    this.isAddPsg = false;
                } else {
                    this.isAddPsg = true;
                }
            },
            immediate: true
        }
                    
    },
    computed: {
        btnText(){
            if (!this.isTrain){
                return "保存"
            }
            if (!!this.isTrainAdd){
                return "保存"
            }
            if (!!this.phoneCheckedYes){
                return "保存"
            }
            return "下一步"
                    
        
        },
        //判断是火车票的新增乘客还是编辑乘客
        isTrainAdd(){
            return !!this.isTrain && !this.psgInfo.passengerId;
        },
        isTrainEdit(){
            return !!this.isTrain && !!this.psgInfo.passengerId;
        },
        isTrainEditWait(){
            return !!this.isTrainEdit && !this.psgInfo.identityCardVerifyComplete && this.phoneCheckedYes;
        },
        isTrainEditApproved(){
            return !!this.isTrainEdit && !!this.psgInfo.identityCardVerifyComplete && this.phoneCheckedYes;
        },
        phoneCheckedYes(){ //火车票手机号核验通过
            return !!this.isTrainEdit && !!this.psgInfo.mobileVerifyComplete;
        },
        phoneCheckedNo(){ //火车票手机号核验未核验或未通过
            return !!this.isTrainEdit && !this.psgInfo.mobileVerifyComplete;
        },
        isTrain(){
            return this.psgType == 'train';
        },
        isFlight(){
            return this.psgType == 'flight';
        },
        isHotel(){
            return this.psgType == 'hotel';
        },
        psgNamePrex(){
            let str = '乘客';
            if (this.isHotel){
                str = '入住人';
            }
            return str;
        }
    },
    methods: {
        changeData(e){
        //编辑状态下进行核验
            if (!this.isAddPsg){
                if (e == 'idNum'){
                    if (this.isChange.idNum == 1){
                        this.idNum = "";
                    }
                    this.isChange.idNum++;
                } else {
                    if (this.isChange.phone == 1){
                        this.psgInfo.phone = "";
                    }
                    this.isChange.phone++;
                }
            }
        },
        /**
      * 初始化新增或者要编辑的乘客信息
      */
        initData(){
            let that = this;
            that.idNum = (that.Passenger || {}).idNum || '';
            that.idCode = (that.Passenger || {}).idCode || 0;
            that.idType = (that.Passenger || {}).idType || '身份证';
            //本页面乘客信息
            that.psgInfo = { 
                passengerId: (that.Passenger || {}).passengerId || '',
                userType: (that.Passenger || {}).userType || 2,
                thirdUserId: (that.Passenger || {}).thirdUserId,
                birthday: (that.Passenger || {}).birthday ? new Date((that.Passenger || {}).birthday).format('yyyy/MM/dd') : '', //出生年月
                name: (that.Passenger || {}).name, //中文名称
                phone: (that.Passenger || {}).phone, //电话
                firstName: (that.Passenger || {}).firstName, //名
                lastName: (that.Passenger || {}).lastName, //姓
                idNum: (that.Passenger || {}).idNum, //证件号码
                idCode: (that.Passenger || {}).idCode || 0, //证件编码
                idType: (that.Passenger || {}).idType,//证件类型
                gender: (that.Passenger || {}).gender || 1,
                term:(that.Passenger || {}).term || '',//证件有效期截止日期
                nationality:(that.Passenger || {}).nationality || '',//国家地区
                abbreviation:(that.Passenger || {}).abbreviation || '',//国家地区简写
                issueCountry:(that.Passenger || {}).issueCountry || '',//发证国家简写
                issueCountryName:(that.Passenger || {}).issueCountryName || '',//发证国家
                identityCardVerifyComplete:(that.Passenger || {}).identityCardVerifyComplete || false,//身份信息是否核验
                mobileVerifyComplete:(that.Passenger || {}).mobileVerifyComplete || false//手机号码是否核验
            }
            //编辑操作
            if (ISDECORATE && !this.isAddPsg){
                //备份数据
                that.copyPsgInfo.idNum = that.psgInfo.idNum;
                that.copyPsgInfo.phone = that.psgInfo.phone;
                that.idNum = MASKING.maskingText(MASKING.MASKING_TYPE.IDCARD,that.idNum)
                that.psgInfo.phone = MASKING.maskingText(MASKING.MASKING_TYPE.TEL,that.psgInfo.phone)

            }
        },
        //获取T信的UAId
        getTChatUaId(){
            passengerHandler.getTChatUaId().then(res=>{
                console.log(res)
                this.UAId = res || '';
            }).catch((e)=>{
                console.log(e)
            })
        },
        disabledDate(current) {
            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth();
            const day = date.getDate();
            return (
                current < new Date(year, month, day).getTime()
            );
        },

        showIDTypePopFun(){
            if (!this.isTrainEditApproved){ //身份核验通过后，证件类型不能点击
                this.showIDTypePop = true;
            }
        },
        /**
     * 保存编辑数据
     */
        getCountryNames() {
            let that = this;
            passengerHandler.selectCountry({}).then(function (res) {
                if (0 == res.resultCode) {
                    that.countryNames = res.result.countryNameList || [];
                }
            }).catch(err=>{
                console.log(err);
            });
        },
        /**
       * 显示证件类型实例
       */
        showIDTips: function () {
            let that = this;
            that.showIDTypePop = false;
            that.showIDTipsPop = true;
        },
        /**
       * 显示姓名规则
       */
        showNameRule: function () {
            let that = this;
            that.showNameRulePop = true;
        },
        /**
       * 添加T信用户
       * @param {Object} sIdArr  已经选择用户Id集合
       * @param {Object} sModel  选择模式 0-单选 1-多选
       * @param {Object} sKey    from_key  默认为9
       */
        addTchatUser: function () {
            let that = this;
            let Ids = [];
            sinosdk.sino.contacts(Ids, 0).then((data) => {
                if (0 < data.length) {
                    try {
                        let selectUser = data[0];
                        that.psgInfo = {
                            userType: 1, //用户类型，1=通讯录添加， 2=手动添加
                            phone: selectUser.uPhone,
                            thirdUserId: selectUser.UAId,
                            name: selectUser.uName,
                            gender: (selectUser || {}).gender || 1,
                            birthday: (selectUser || {}).birthday ? new Date((selectUser || {}).birthday).format('yyyy/MM/dd') : '',
                            term:'',//证件有效期截止日期
                            nationality:'',//国家地区
                            abbreviation:'',//国家地区简写
                            issueCountryName:'',//发证国家
                            issueCountry:''//发证国家简写
                        };
                        that.idCode = 0;
                        that.idType = '身份证';
                        that.idNum = '';
                    } catch (e) {
                        console.log('从T信通讯录中获取人员信息失败')
                    }
                }
            });
        },
        /**
       * 选择证件类型
       * @param {Object} key
       */
        chooseIdType(key) {
            let that = this;
            that.idCode = key;
            that.idType = that.IDTypeListMap[key];
            that.idNum = '';
            that.showIDTypePop = false;
        },

        showNationality(type){
            let that = this;
            this.countryType = type
            that.showNationalityPop = true;
        },
        /**
       * 选择国家地区
       * @param {String} Country
       */
        chooseCountry(Country){
            let that = this;
            if(this.countryType == 1){ // 国家地区【国籍】
                that.psgInfo.nationality = Country.fullName;
                that.psgInfo.abbreviation = Country.abbreviation;
            }else if(this.countryType == 2){ // 发证国家
                that.psgInfo.issueCountryName = Country.fullName;
                that.psgInfo.issueCountry = Country.abbreviation;
            }
            that.showNationalityPop = false;
        },
        /**
       * 选择有效期截止日期
       * @param {String} date
       */
        dateChange(date){
            let that = this;
            that.psgInfo.term = date;
            that.showTermPop = false;
        },
       

        //查验成功的回调
        checkSucess(mobileVerifyComplete, identityCardVerifyComplete){
            this.psgInfo = Object.assign({}, this.psgInfo, {
                mobileVerifyComplete,
                identityCardVerifyComplete
            });
            this.showPhoneVerify = false;
        },

        /**
       * 确认按钮
       */
        confirm() {
            let that = this;
            if (!that.validate()) {
                return;
            }
            passengerHandler.throttle(async function () {
                if (that.btnText == '下一步'){
                    //先更新乘客信息
                    let flag = await that.save(true);
                    if (!!flag){
                        //在核验身份
                        let resultData = await that.identityVerification(that.psgInfo); //identityVerification方法在mixins.js里面
                        if (!!resultData && !!resultData.result.captcha){
                            that.checkNum = resultData.result.captcha;
                            that.showPhoneVerify = true;
                        } else if (!!resultData && !resultData.result.captcha){ //如果没有核验码默认更新数据，默认是核验通过的
                            that.showPhoneVerify = false;
                            passengerHandler.showToast('核验成功');
                            that.$set(that.psgInfo, 'mobileVerifyComplete', true);
                            that.$set(that.psgInfo, 'identityCardVerifyComplete', true);
                            that.$emit('editedPsg', JSON.parse(JSON.stringify(that.psgInfo)), null, true); //核验成功更新外层的数据
                        }
                    }

                } else if (that.btnText == '保存'){
                    that.save();
                }
            }, this);
        },
      
        /**
       * 保存编辑数据
       */
        save(isCheck=false) {
            let that = this;
       
            let obj = JSON.parse(JSON.stringify(that.psgInfo));
            if (0 == that.idCode) { //身份证
                obj.birthday = that.getBirthDayFromIdCard(that.idNum);
                obj.gender = passengerHandler.getSexForCard(that.idNum);
                delete obj.term;
            }
            obj.idNum = that.idNum;//证件号码
            obj.idCode = that.idCode;//证件编号
            obj.idType = that.idType;//证件类型
            if (!showSurname(that.idCode)){ //护照的情况下清空 FirstName  LastName
                delete obj.firstName
                delete obj.lastName
            } else {
                delete obj.name
            }
        
            if (ISDECORATE && !that.isAddPsg && that.isChange.idNum == 1){
                obj.idNum = that.copyPsgInfo.idNum
                if (0 == that.idCode){
                    obj.birthday = that.getBirthDayFromIdCard(obj.idNum);
                }
            }
            if (ISDECORATE && !that.isAddPsg && that.isChange.phone == 1){
                obj.phone = that.copyPsgInfo.phone
            }
            //如果数据没有改动，则直接返回
            // if (!that.hasEdit(that.Passenger, obj)) {
            //   that.$emit('editedPsg', JSON.parse(JSON.stringify(that.Passenger)));
            //   return;
            // }

            //数据库入库
            // let errTips = '编辑失败';
            let sucTips = '编辑成功';
            let addFlag = !(obj || {}).passengerId;
            if (addFlag) {
                // errTips = '添加失败';
                sucTips = '添加成功';
            }
            return new Promise((resolve) => {
                passengerHandler.updatePassengers({
                    people: [obj]
                }).then(function (res) {
                    if (0 == res.resultCode) {
                        resolve(true);
                        if (!isCheck){
                            let wrongIdTypeFlag = that.checkUnAvailableIDCode(obj);//获取证件修改后，知否满足购票的需求
                            passengerHandler.showToast(sucTips);
                            setTimeout(function () {
                                that.$emit('editedPsg', JSON.parse(JSON.stringify(obj)), wrongIdTypeFlag);
                            }, 300);
                            //回传给界面数据
                        }
                    }
                }).catch(err=>{
                    resolve(false)
                    console.log(err);
                });
            })
        },
        /**
       * 参数校验
       */
        validate() {
            let that = this;
            let newid = that.idNum
            let newphone = that.psgInfo.phone

            if (ISDECORATE && !that.isAddPsg && that.isChange.idNum == 1){
                newid = that.copyPsgInfo.idNum
            }
            if (ISDECORATE && !that.isAddPsg && that.isChange.phone == 1){
                newphone = that.copyPsgInfo.phone
            }

            if (!showSurname(that.idCode) && !that.psgInfo.name) {
                passengerHandler.showToast('姓名不能为空');
                return false;
            }
        
            if (!showSurname(that.idCode) && !isName(that.psgInfo.name)) {
                passengerHandler.showToast('姓名格式错误，请参照姓名填写规范重新填写');
                return false;
            }
            if (showSurname(that.idCode) && !that.psgInfo.firstName) {
                passengerHandler.showToast('姓不能为空');
                return false;
            }
       
            if (showSurname(that.idCode) && !isSurname(that.psgInfo.firstName)) {
                passengerHandler.showToast('姓格式错误，请参照护照填写规范重新填写');
                return false;
            }
            if (showSurname(that.idCode) && !that.psgInfo.lastName) {
                passengerHandler.showToast('名不能为空');
                return false;
            }
            if (showSurname(that.idCode) && !isSurname(that.psgInfo.lastName)) {
                passengerHandler.showToast('名格式错误，请参照护照填写规范重新填写');
                return false;
            }
            if (!that.psgInfo.birthday && 0 != that.idCode) {
                passengerHandler.showToast('出生日期不能为空');
                return false;
            }
            if (!that.psgInfo.issueCountry && 0 != that.idCode) {
                passengerHandler.showToast('发证国家不能为空');
                return false;
            }
            if (!that.psgInfo.nationality) {
                passengerHandler.showToast('国家地区不能为空');
                return false;
            }       
            if (!newid) {
                passengerHandler.showToast('证件号码不能为空');
                return false;
            }
            if (0 == that.idCode && !passengerHandler.isCardNo(newid)) {
                passengerHandler.showToast('请填写正确身份证号码');
                return false;
            }

            if (0 != that.idCode &&!that.psgInfo.term) {
                passengerHandler.showToast('证件有效期截止日期不能为空');
                return false;
            } 

            if (!newphone) {
                passengerHandler.showToast('手机号码不能为空');
                return false;
            }
            if (!passengerHandler.isMobile(newphone)) {
                passengerHandler.showToast('请填写正确手机号码');
                return false;
            }
            return true;
        },
        /**
       * 删除人员
       */
        delPsg() {
            let that = this;
            let textStr = `确定删除该条${that.psgNamePrex}信息?`;
            passengerHandler.showConfirm(textStr, function(){
                passengerHandler.deletePassengers({
                    idList: [that.psgInfo.passengerId]
                }).then(function (res) {
                    if (0 == res.resultCode) {
                        passengerHandler.showToast('删除成功');
                        //延迟300毫秒
                        setTimeout(function () {
                            that.$emit('deledPsg', JSON.parse(JSON.stringify(that.psgInfo)));
                        }, 300);
                    } else {
                        passengerHandler.showToast('删除失败');
                    }
                });
            }, 2, '取消', '确定', null, null, true);
        },
        /**
       * 根据身份证获取出生日期
       * @param {Object} idCard
       */
        getBirthDayFromIdCard(idCard) {
            let birthday = "";
            if (idCard != null && idCard != "") {
                idCard = idCard + '';
                if (idCard.length == 15) {
                    birthday = "19" + idCard.substr(6, 6);
                } else if (idCard.length == 18) {
                    birthday = idCard.substr(6, 8);
                }
                birthday = birthday.replace(/(.{4})(.{2})/, "$1/$2/");
            }
            return birthday;
        },
        /**
       * 判断是否编辑了界面的数据，默认为true
       * @param {Object} psg  旅客信息
       */
        hasEdit(psg,obj) {
        //psg通过props传递过来的 即 passenger
            let editPsg = JSON.parse(JSON.stringify(obj));
            let tempPsg = JSON.parse(JSON.stringify(psg));
            let flag = passengerHandler.isEqual(tempPsg, editPsg);
            return !flag;
        },
        /**
       * 格式化dom文本
       */
        fomateText: function (str) {
            var text = '';
            text = str;
            text = text.replace(/lt;brgt;/g, "</p><p>");
            text = text.replace(/\n/g, "</p><p>");
            text = text.replace(/<br>/g, "</p><p>");
            text = text.replace(/。/g, "</p><p>");
            if ('' == text) {
                text = '无';
            }
            return '<p>' + text + '</p>';
        }
    }
}

</script>
<style lang="less">
@import '~themes/default/styles/edit.less';
@import '~styles/core/common.less';
@import '~styles/mixins/mixinsStyle.less';
  .nameRuleClass.vux-popup-dialog{
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .edit-psg.vux-popup-dialog{
    background: @background-color;
  }
  .dp-container .dp-header .vux-datetime-confirm.dp-right{
    color: @theme-color;
  }
    // pc端
  @media screen and (min-width: @screen-sm) { 
    .dp-container{
      width: 100%;    
      left: 0 !important;
    }
  }
  @media screen and (min-width: @screen-lg) {
    .dp-container{
      width: @screen-lg !important;    
      left: calc(~'(100vw - 960px) / 2') !important;
    }
  }
  .edit {
    .lineTextWrap {
      .vux-datetime-value {
        text-align: left;
        .vux-cell-placeholder{
          color: @placeholder-color;
        }
      }

      .empty-contry{
        color: @placeholder-color;
      }
    }
  }

  .vux-datetime {
    padding: 0;
    width: 100%;
    
  }
  .vux-datetime.weui-cell_access .weui-cell__ft{
    background: url(~themes/default/img/icon_common_rightarrow.svg) no-repeat center right;
    background-size: 0.24rem 0.24rem;
  }
  .vux-datetime.weui-cell_access .weui-cell__ft:after{
    display: none;
  }

  .vux-datetime p {
    display: inline-block;
    width: 1.75rem;
    font-size: .32rem;
    color: @secondary-text-color;
  }

  .vux-datetime .vux-cell-value {
    color: #333;
  }
  .weui-cells:before{
    display: none;
  }
</style>
