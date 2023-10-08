<template>
    <div class="passengerList">
        
        <div v-if="addPsgFlag" class="addbutWrap cursorp" >
            <span @click='addPsg' class="addBut"><icon type="btn_common_addnew" size='.3' />{{psgAddText}}</span>
        </div>
        <div class="content-wrap"  :class="{addperson: addPsgFlag}">
            <div v-if="loading" class="loading-wrap">
                <LoadingX :tip="psgNamePrex + '信息加载中，请稍候...'" :spinning="true" :turn="true"/>
            </div>
            <EmptyX v-else-if="!loading && passengerArray.length == '0'" :tipsText="'暂无'+ psgNamePrex + '信息'" />
            <div v-else class="outWrap popupDebit">
                <div class="lineWrap">
                    <div class="line cursorp" 
                        :class="{disabledError:checkUnAvailableIDCode(item)}" 
                        v-for="(item,index) in passengerArray" 
                        :key="index" 
                        @click="onChecked(item)">
                        <swipeout>
                            <swipeout-item :disabled="UAId == item.thirdUserId" :auto-close-on-button-click='false' ref="swipeoutItem">
                                <div slot="right-menu">
                                    <swipeout-button class="swipe_out" v-show="showDeleteBtn" @click.native.stop="delPsg(item,index)" background-color="#FF4E3A">删除</swipeout-button>
                                </div>
                                <div slot="content">
                                    <psgItem 
                                        :hasCheck='addPsgFlag' 
                                        :ischecked='arrhaveitem(item,choosedArr)' 
                                        :ID='showIDStr(item)'
                                        @editPsg='editPsg' 
                                        :item='item'>
                                    </psgItem>
                                </div>
                            </swipeout-item>
                        </swipeout>
                        <div v-if="checkErrorMsg(item)" class="errorTips">
                            <i>{{item.errorMsg}}</i>
                            <icon v-show="checkTips(item)" @click.native.stop="showVerifyTipsFun" type="icon_common_prompt" size='.28' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        

        <!-- 底部按钮 -->
        <div v-transfer-dom>
            <div v-if="addPsgFlag && showPsgFlag && !showEditFlag" class="bottomWrapUserList">
                <div class="left">已选择<span><i>{{choosedArr.length}}</i>/{{maxLength}}</span>人</div>
                <div class="right blue-btn cursorp" @click="confirm">确定</div>
            </div>
            <div v-if="!addPsgFlag" class="add_btn_wrap">
                <div @click='addPsg' class="btn">新增{{psgNamePrex}}</div>
            </div>
        </div>

        <!-- 编辑乘客的弹窗 -->
        <div v-transfer-dom>
            <popup v-model="showEditFlag" class="edit-psg" height="100%" width="100%" position="right" style="z-index:999" :show-mask="false">
                <div v-if="showEditFlag">
                    <swp-psg-edit 
                        :Passenger='psgInfo' 
                        ref='edit' 
                        usePlace='list'
                        :psgType='psgType'
                        @deledPsg="deledPsgFun" 
                        @editedPsg="editedPsgFun" 
                        :errorIDCodeList="errorIDCodeList"
                        :HasPickFApp4Prod="hasPickFApp4ProdData"
                    ></swp-psg-edit>
                    <!-- <EditPsg 
                        :Passenger='psgInfo' 
                        ref='edit' 
                        usePlace='list'
                        :psgType='psgType'
                        @deledPsg="deledPsgFun" 
                        @editedPsg="editedPsgFun"
                        :errorIDCodeList="errorIDCodeList" 
                        :HasPickFApp4Prod="hasPickFApp4ProdData"
                    ></EditPsg> -->
                </div>
            </popup>
        </div>

        <!-- 身份核验说明的弹窗 -->
        <div v-transfer-dom>
            <popup v-model="showVerifyTips" height="100%"  width="100%" position="right" style="z-index:1999; background:#fff" :show-mask="false">
                <identityVerifyTips />
            </popup>
        </div>
    </div>
</template>

<script>
/* 人员管理中需要有自己的主键passengerId  */
import icon from "components/icon/index.vue"
import passengerHandler from './passengerHandler.js';
import {TransferDom,Popup,Swipeout,SwipeoutItem,SwipeoutButton} from 'vux';
// import EditPsg from './edit.vue';
import identityVerifyTips from './identityVerifyTips.vue';
import psgItem from './psgitem.vue';
import LoadingX from "components/loading/index";
import EmptyX from "components/empty/EmptyX.vue";
import mixins from './mixins';

export default {
    name:'swp-psg-list',
    directives: {
        TransferDom
    },
    mixins:[mixins],
    components: {
        // TransferDom,
        Popup,
        // EditPsg,
        Swipeout,
        SwipeoutItem,
        SwipeoutButton,
        psgItem,
        EmptyX,
        LoadingX,
        identityVerifyTips,
        icon
    },
    props: {
        hasPickFApp4Prod:{//从APP选人功能
            type:Boolean,
            default:true
        },        
        responseKey:{//数据返回的key
            type:String,
            default:'passengerList'
        },
        maxLength:{//最大选择人员数
            type:Number,
            default:10
        },
        value:{//选中人员
            type:Array,
            default:() => [{}]
        },
        addPsgFlag:{//乘客添加标识，默认为false
            type:Boolean,
            default:false
        },
        errorMsg:{
            type:String,
            default:'当前行程不支持使用该证件，请更换证件'
        },
        errorIDCodeList:{
            type:Array,
            default:() => []
        },
        //区别购买火车票/飞机票还是酒店
        psgType:{
            type:String
        },      
        //外层控制该组件的显隐
        showPsgFlag:{
            type:Boolean,
            default:false
        }        
    },
    data() {
        let that = this;
        // let title = document.title;
        let managerData = passengerHandler.stateManager.setData([
            //人员编辑界面
            {
                name: 'showEditFlag',
                parent:'$refs.psg',
                type:'page',
                hide:{
                    //关闭人员证件选择框
                    callback:function(){
                        document.title = !!that.addPsgFlag? `添加${that.psgNamePrex}`:'乘客管理';
                        if (that.$refs.edit.showIDTypePop){
                            that.$refs.edit.showIDTypePop = false;
                        }
                        //关闭弹窗的时候刷新数据
                        that.editedPsgFun(that.$refs.edit.psgInfo);
                    }
                }
            },
            {
                name: 'showVerifyTips', //显示身份核验的弹框
                parent:'$refs.psg',
                hide:{
                    title: '新增乘客'
                },
                show:{
                    title: '身份核验'
                }
            }
        ]);
        return Object.assign(managerData,{
            choosedArr: JSON.parse(JSON.stringify(this.value)),//接收从父组件传递过来的值
            psgInfo: {},//单个旅客信息
            passengerArray: [],//非分组数据下的界面显示数据
            showDeleteBtn: false, //是否显示删除swiper按钮
            loading: true,
            hasPickFApp4ProdData: this.hasPickFApp4Prod, //TODO 该变量用来控制 编辑的时候不显示从T信拉取人员的功能
            newErrorMsg: that.errorMsg,
            UAId:'', //T信的UAId
            userName:'', //当前登录人的姓名
            addOrEdit: 1//用来确定是新增乘客还是编辑乘客。目前暂时的用处为用来显示title的 1=新增 2=编辑
        });
    },
    beforeCreate(){},
    created() {
        let that = this;
        //初始化列表数据
        that.initData();
        //兼容ios刷新显示删除的问题
        //获取T信的UAId
        that.getTChatUaId();
    },
    mounted() {},
    watch:{
        errorIDCodeList(newVal){
            newVal.length > 0 && this.initData(true);
        },
        //监听组件的显隐
        showPsgFlag(newVal){
            if (!!newVal){
                this.choosedArr = JSON.parse(JSON.stringify(this.value));
                //筛选出有UserId的有效数据 目前兼容酒店可以手输乘客的问题
                this.choosedArr = this.choosedArr.filter(item=>{
                    return !!item.passengerId;
                })
            }
        } 
        
    },
    computed: {
        isTrain(){
            return this.psgType == 'train';
        },
        isFlight(){
            return this.psgType == 'flight';
        },
        isHotel(){
            return this.psgType == 'hotel';
        },
        psgAddText(){
            let str = '新增' + this.psgNamePrex;
            return str;
        },
        titleStrPrex(){
            let str = ''
            if (this.addOrEdit == 1){
                str = '新增'
            } else {
                str = '编辑'
            }
            return str;
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
        /**
         * 初始化常旅列表
         */
        initData(noDeal=false){
            let that = this;
            that.loading = true;
            let param = {};
            //获取旅客列表
            return new Promise((resolve, reject)=>{
                passengerHandler.queryPassenger(param).then(async function(res){
                    if (0 == res.resultCode && res.result){
                        that.loading = false
                        if ('passengerList' == that.responseKey){ //乘客管理
                            let psgList = res.result[that.responseKey];
                        

                            //todo 如果当前人员第一次进入商旅，此时将用户的姓名即name字段更新。为了解决当用户第一次进入的时候，如果用户没设置姓名，会显示手机号的问题
                            that.passengerArray = await that.updateLoginUserName(psgList)


                            resolve(that.passengerArray);

                            //处理登录人员信息
                            if (that.passengerArray.length >= 0 && !noDeal){
                                await that.getTChatUaId();
                                that.dealLoginUser(that.passengerArray);
                            }
                            //剔除不符合购票的证件
                            let newArr = that.passengerArray.filter(item => {
                                return !that.checkUnAvailableIDCode(item)
                            })

                            that.$emit('psgFunc', newArr)
                        }
                        if (that.passengerArray.length > 0){
                            that.showDeleteBtn = true
                        }
            
                    }
                }).catch(e=>{
                    reject(false)
                    console.log(e);
                    that.loading = false;
                });
            })
        },

        //更新当前登陆人将手机号换成姓名
        async updateLoginUserName(list){
            let that = this;
            if (!!!list || list.length <= 0){ return [] }
            let newList = JSON.parse(JSON.stringify(list));
            await that.getTChatUaId();
            await that.getTChatUsername();
            for (let i = 0; i < newList.length; i++){
                if (this.UAId == newList[i].thirdUserId && !!!newList[i].idNum && !!this.userName){ //如果没有证件号码
                    newList[i].name = this.userName;
                }
            }
            return newList;
        },

        //获取T信的UAId
        getTChatUaId(){
            return new Promise((resolve, reject) => {
                passengerHandler.getTChatUaId().then(res=>{
                    this.UAId = res || '';
                    resolve(res)
                }).catch(e=>{
                    console.log(e)
                    reject('获取UAId失败');
                })
            })
        },


        //获取T信的用户姓名
        getTChatUsername(){
            return new Promise((resolve, reject) => {
                passengerHandler.getTChatUsername().then(res=>{
                    this.userName = res || '';
                    resolve(res)
                }).catch(e=>{
                    console.log(e)
                    reject('获取userName失败');
                })
            })
        },

        /**
         * 处理登录人信息
         */
        dealLoginUser(){
            let that = this;
            //获取当前T信登录人的信息获取手机号
            that.getTchatLoginUserInfo();

            // 获取当前商旅通登录人的信息显示
            
            that.getSLloginInfo(that.passengerArray);
            
        },

        //获取当前T信登录人的信息
        getTchatLoginUserInfo(){
            let that = this;
            sinosdk.sino.getUserInfo().then(function(uaData){
                let data = JSON.parse(JSON.stringify(uaData))
                data.phone = uaData.uPhone
                data.name = uaData.uName
                that.$emit('TchatLoginUserInfo', data)
            }).catch(()=>{
                console.log('GetUserInfoFunction。error')
                //没有jSbridge接口，我们从URL上获取用户信息UserPhone
                if (!!passengerHandler.getUserPara("UserPhone")){
                    let data = {}                
                    data.phone = passengerHandler.getUserPara("UserPhone")
                    data.name = data.phone
                    that.$emit('TchatLoginUserInfo', data)                
                }
            })
        },


        //获取当前商旅通登录人的信息(不带筛选功能)  就是代表是当前的商旅通登录人
        getSLloginInfo(passengerArray){
            let that = this;
            for (let j=0;j<passengerArray.length;j++){
                const psgItemf = passengerArray[j];
                if (psgItemf.thirdUserId && that.UAId && psgItemf.thirdUserId==that.UAId){
                    that.$emit('SLloginUserInfo',psgItemf);
                    that.choosedArr[0] = psgItemf;//解决第一个人员选中问题
                    that.$forceUpdate();
                    break;
                }
            }
        },
        
        //查看证件信息的提示语
        checkErrorMsg(item){
            let that = this;
            if (!!that.isTrain && !this.checkUnAvailableIDCode(item)){
                return that.checkVerification(item)
            }
            return this.checkUnAvailableIDCode(item);
            
        }, 
    
        //核验手机号和身份证件信息是否被核验
        checkVerification(item){
            let flag = false;
            if (!item.mobileVerifyComplete){
                let newErrorMsg = '乘客联系方式待核验';
                this.$set(item, 'errorMsg', newErrorMsg)
                flag = true;
            } else if (!item.identityCardVerifyComplete){
                let newErrorMsg = '乘客身份信息待核验';
                this.$set(item, 'errorMsg', newErrorMsg)
                flag = true;
            }
            return flag;
        },

        //显示身份核验tips的弹窗
        showVerifyTipsFun(){
            this.showVerifyTips = true;
        },

        //身份校验的弹窗说明 
        checkTips(item){
            let flag = false;
            if (item.errorMsg == '乘客身份信息待核验'){
                flag = true;
            }
            return flag;
        },
        

        /**
         * 显示乘客证件信息
         * 新增脱敏功能 ISDECORATE 脱敏开关 位于 platform
         * @param {Object} psg  乘客信息
         */
        showIDStr(psg){
            let MASKING = SnUtils.DataMasking;
            let ISDECORATE = SnTravel.functional.ISDECORATE;
            if (!psg.idNum){
                return '请完善身份信息';
            } else if (ISDECORATE){
                return psg.idType+ ' '+ MASKING.maskingText(MASKING.MASKING_TYPE.IDCARD,psg.idNum);
            }
            return psg.idType+ ' '+ psg.idNum;
            
        },
        /**
         * 证件隐藏
         * @param {Object} No  证件号
         */
        hiddenNo(No) {
            let str = '';
            str = No.substr(0, 2) + '*************' + No.substr(16)
            return str
        },
        /**
         * 新增乘客
         */
        addPsg:function(){
            let that = this;
            //此处针对金贝等类似的产品做的适配
            if (that.hasPickFApp4Prod){
                that.hasPickFApp4ProdData = true;
            }
            that.psgInfo = {idCode:0, idType:'身份证', idNum:'', gender:1, userType:2};
            that.addOrEdit = 1;
            document.title = `${that.titleStrPrex}${that.psgNamePrex}`;
            that.showEditFlag = true;
        },
        /**
         * 编辑列表中的数据
         * @param {Object} psg
         */
        editPsg:function(psg){
            let that = this;
            that.hasPickFApp4ProdData = false;
            that.psgInfo = psg;
            that.addOrEdit = 2;
            document.title = `${that.titleStrPrex}${that.psgNamePrex}`;
            that.showEditFlag = true;
        },
        /**
         * 人员删除
         * @param {Object} psg
         */
        delPsg:function(psg, index){
            let that = this;
            let textStr = `确定删除该条${that.psgNamePrex}信息?`
            passengerHandler.showConfirm(textStr, function(){
                passengerHandler.deletePassengers({
                    idList:[psg.passengerId]
                }).then(function(res){
                    if (0 == res.resultCode) {
                        that.closeSwipe(index);
                        passengerHandler.showToast('删除成功');
                        //延迟300毫秒
                        setTimeout(function(){
                            that.deledPsgFun(psg);
                        },300);
                    } else {
                        passengerHandler.showToast('删除失败');
                    }
                });
            }, 2, '取消', '确定', null, null, true);
        },

        //编辑乘客信息页面删除乘客
        deledPsgFun(data){
            let that = this;
            that.showEditFlag = false;
            that.initData(true);
            //处理编辑选中人员信息，将选中人员信息更新到最新
            that.choosedArr = that.choosedArr.filter((item)=>{
                return item.passengerId != data.passengerId
            });

        },

        //编辑乘客页面编辑乘客点击保存
        async editedPsgFun(data){
            let that = this;
            //关闭编辑乘客的弹窗
            
            that.showEditFlag = false;
            
            //重新拉取乘客数据列表
            let list = await that.initData(true);
            if (!!data.passengerId){ //只有编辑的时候需要更新
                let newData = list.find(item=>{
                    return data.passengerId == item.passengerId
                })
                
                //处理编辑选中人员信息，将选中人员信息更新到最新 同时排除不符合条件的人员选中
                if (that.choosedArr.length > 0){
                    for (let i=0;i<that.choosedArr.length;i++){
                        let item = that.choosedArr[i];
                        if (item.passengerId == newData.passengerId){
                            if (that.checkUnAvailableIDCode(newData)){
                                that.choosedArr.splice(i,1);
                                break;
                            }
                            that.choosedArr.splice(i, 1, newData);

                            break;
                        }
                    }
                }
            }
        },

        /**
         * 选中元素
         * @param {Object} psg   旅客信息
         */
        async onChecked(psg) {
            let that = this;

            //没有选中功能直接返回
            if (!that.addPsgFlag){
                return;
            }
              
            //判断选择的是否是合理的IDCode
            if (that.checkUnAvailableIDCode(psg)){
                return;
            }
            
            
            //处理使用_处理数据产生的check显示异常
            var tempList = JSON.parse(JSON.stringify(that.choosedArr))
            let index = that.findIndex(tempList,{passengerId:psg.passengerId});
            if (-1 < index){ //元素已经被选中，则删除
                tempList.splice(index,1);
                //条件为了兼容人员中只有UserUaId没有UserId的情况，后续应该统一为UserId  暂时使用UserType==1和UserUaId判断内部人员不传递UserId的情况
            } else {

                //当选择乘客的时候如果是火车票场景的话，需要核验乘客的状态
                if (!!that.isTrain){
                    //如果乘客手机号核验，此时弹窗提示不能选择
                    if (!psg.mobileVerifyComplete){
                        that.showNoCheckConfirm(psg);
                        return
                    }
                    //此时需要重新核验手机
                    let resultData = await that.identityVerification(psg); //identityVerification方法在mixins.js里面
                    // console.log('resultData', resultData)
                    if (!!resultData && !!resultData.result.captcha){ //此时说明未核验
                        that.showNoCheckConfirm(psg);
                        return
                    } else if (resultData == false){
                        console.log('核验身份的接口报错');
                    }


                    //如果火车票乘客未经过身份核验，此时弹窗提示不能选择
                    if (!psg.identityCardVerifyComplete){
                        passengerHandler.showConfirm('身份信息未经核验，需持证件原件到车站售票窗口办理核验', function(){}, 1, '我知道了', null, '温馨提示', null, true);
                        return
                    } 
                }


                //选择人数达到最大值，则不增加
                if (tempList.length == that.maxLength){
                    let str = '最多只能选择' + that.maxLength + '位' + that.psgNamePrex;
                    passengerHandler.showToast(str);
                    return;
                }
                //证件号码不能重复
                for (let i = 0; i < tempList.length; i++){
                    if (tempList[i].idNum === psg.idNum){
                        let str = `${that.psgNamePrex}“${psg.name ? psg.name : (psg.FirstName + psg.LastName)}”与“${tempList[i].name ? tempList[i].name:(tempList[i].FirstName + tempList[i].LastName)}”的证件号码重复，请核对修改`;
                        passengerHandler.showConfirm(str, null, 1, null, null, null, null, true);
                        return
                    }
                }
                tempList.push(psg);
            }
            //处理使用_处理数据产生的check显示异常
            that.choosedArr = JSON.parse(JSON.stringify(tempList))
            //Vue 实例重新渲染
            that.$forceUpdate();
        },
          
        //显示未核验的弹窗
        showNoCheckConfirm(psg){
            let that = this;
            let text = '根据铁路局规定，乘车人需进行手机号核验后才可购票，请编辑乘客并核验手机号';
            passengerHandler.showConfirm(text, function(){
                that.psgInfo = psg;
                that.showEditFlag = true;
            }, 2, '忽略', '编辑乘客', '温馨提示', null, true);
        },

        /**
        * 判断元素是否存在，如果是内部人员，则只要UserUaId相同就可以判断
        * @param {Object} item    人员信息
        * @param {Object} arr     人员列表
        */
        arrhaveitem(item,arr){
            let flag = this.findIndex(arr,{passengerId:item.passengerId}) > -1
            return flag;
        },
        /**
         * 确认按钮
         */
        confirm(){
            let that = this;
            // if(0 == that.choosedArr.length){//没有选择人员
            //passengerHandler.simpleShowConfirm('您没有选择人员，确定离开吗',function(){
            ////回传给界面数据
            //that.$emit('input', JSON.parse(JSON.stringify(that.choosedArr)));
            //that.$emit('closePsgList');
            //});
            //return;
            // }
            if (that.maxLength < that.choosedArr.length){ //选择人员超过最大数据
                passengerHandler.showToast('选择人员数超过最大限制，请重新选择');
                  
            } else {
                //回传给界面数据
                that.$emit('input', JSON.parse(JSON.stringify(that.choosedArr)));
                that.$emit('closePsgList');
            }
        },
        /**
         * 关闭swipe按钮
         */
        closeSwipe(index){
            let that = this;
            that.$refs.swipeoutItem[index].close();
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
                    return false
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
                return false
            })
            return _index;
        }
    }
}
</script>
<style lang="less">
@import '~themes/default/styles/list.less';
</style>

