<template>
	<div class='queryExpress'>
        <div @click="showMask=false;expressNumber='';isJudgeEnd=false" v-show="showMask" class="mask"></div>
        <div class="topWrap">
            <div class="inputWrap">
                <input ref="inputSearch" class="expressNum" @keyup.enter="getExpressDetailManual" v-model="expressNumber" @input="changeExpressNum" @focus="searchFocus" type="text" :placeholder="inputTipsText" maxlength="30">
                <!-- 关闭按钮 -->
                <div v-show="showMask" @click="closeInput" class="icon_close"></div>
                <!-- 搜索按钮 -->
                <div v-show="showMask && isCanQuery" @click="getExpressDetailManual" class="icon_serach"></div>
                <!-- 扫一扫按钮 -->
                <div v-if="!isPC && !showMask" class="sysBut cursorp" @click="getNoFromQrcode"></div>
            </div>
            <div v-show="showMask" class="topTextWrap">
                <div v-if="queryCompanying" class="textTips" ><LoadingX tipsText='正在识别快递公司'/></div>
                <template v-else-if="expressCompanies.length > 0">
                    <div class="textTips cursorp"  v-for="(item,index) in expressCompanies" :key="index" @click="getExpressDetailForCpyList(item)">
                        <div class="iconWrap">
                            <div class="iconInwrap" v-bind:style="{backgroundImage: 'url(https://cdn.kuaidi100.com/images/all/56/' + item.expressCompanyNameEn + '.png)'}"></div>
                            <div class="nameText">{{outExpressCompanyMap[item.expressCompanyNameEn||'']||''}}</div>
                        </div>
                    </div>
                </template>
                <div class="textTips" v-else>自动识别快递公司</div>
            </div>
        </div>
        <div v-transfer-dom>
            <Loading :show="querying" text='查询中，请稍后...'/>
        </div> 
        <div v-transfer-dom>
            <popup v-model="showVerifyPhone" class="verifyWrap" height="100%" @on-hide="resetVerifyPhone" is-transparent>
                <div class="realContentWrap" :class="{marginTop:(!isPC && isShowKeboard)}">
                    <div class="realContent">
                        <div class="closeWrap">
                            <div class="close cursorp" @click="showVerifyPhone=false"></div>
                        </div>
                        <div class="titleWrap">
                            <span class='title'>用户验证</span>
                        </div>
                        <div class='tipsWrap'>为保护顺丰用户隐私，请输入收/寄件人联系电话后四位进行验证</div>
                        <div class="inputListWrap">
                            <div class="verifyInputWrap">
                                <input ref="verifyInput" @focus="isShowKeboard=true" @blur="isShowKeboard=false" class="inputItem" v-model="verifyPhoneNo" @input="getVerifyPhoneNoNew()" type="tel" maxlength="4"/>
                                <div class="phone_num_line" :class="'phone_num_line_' + n" v-for="n in 4" :key="n"></div>
                            </div>
                        </div>
                    </div>
                </div>    
            </popup>
        </div>
   	</div>
</template>
<script>
    import expressHandler from './js/expressHandler.js';
    import {expressCompanyData,outExpressCompanyData} from './enum/expressEnum.js';
    import LoadingX  from "components/loading/LoadingX.vue";
    import EmptyX from "components/empty/EmptyX.vue";
    import {TransferDom,Loading,Popup} from 'vux';
    export default {
        directives:{
            TransferDom,
        },
		components:{
            LoadingX,
            Loading,
            Popup
        },     
        watch:{
            //主动获取焦点
            showVerifyPhone(val){
                if(val){
                    this.$nextTick(()=>{
                        this.$refs.inputSearch.blur(); 
                        this.$refs.verifyInput.focus();
                        this.isShowKeboard = true; 
                    })
                }else{
                    this.verifyPhoneNo = '';
                }
            },
        },
        data() {
            let that = this;
            let managerData = expressHandler.stateManager.setData([
                //顺丰快递填写手机号界面是否显示
                {
                    name: 'showVerifyPhone',
                    parent:'$refs.queryExpress',
                    type: 'page',
                    hide: {
                        callback: function () {},
                        title: '快递服务'
                    }
                },
            ])
            return Object.assign(managerData, {
                expressCompanyMap:expressCompanyData,//快递公司本地配置，logo地址等
                outExpressCompanyMap:outExpressCompanyData,//快递公司名称数据
                isCanQuery:false,//是否能查询，即快递单号是否符合规则
                isJudgeEnd: false,//是否是支持内部查询的快递单号
                expressCompany:{expressCompanyNo:'',expressCompanyCode:'',expressCompanyName:'',expressCompanyPhone:''},//快递单号所属快递公司
                expressCompanyList:[],//快递公司列表
                expressNumber:'',//快递单号
                querying:false,//查询快递详情中
                checking:false,//查询快递所属快递公司中
                isPC:false,//是否是pc客户端
                queryInterval:1000,//查询单号所属快递公司的时间间隔
                inputTipsText:'输入或扫一扫快递单号',//输入框提示信息
                verifyPhoneNo:'',//顺丰快递需要填写寄件人或收件人手机号后四位
                verifyPhoneList:['','','',''],//验证手机号后四位的长度
                requestId:0,//查询快递单号所属快递公司的查询id，用来处理并发查询时序问题
                queryCompanying:false,//是否在查询快递单号所属快递公司
                showMask:false, //是否显示遮罩层
                isShowKeboard: true, //是否键盘
                expressCompanies:[],//快递单号所属快递公司列表
            })
        },
        created(){
            let _this = this;
            if(expressHandler.isPC()){
                _this.isPC = true;
                _this.inputTipsText = '输入快递单号';
            }
            _this.initData();   
            _this.registerAppfun();                             
		},
		mounted(){
            let _this = this;
            //判断是否是首页点击扫一扫icon过来的
            // _this.judgeIndexQuery();            
        },
        activated(){
            let _this = this;
            //保活页面进入时清空输入的快递数据
            let forceDirection = expressHandler.getSession('nextDirection') || 'forward';
            if(forceDirection == 'forward'){
                _this.expressNumber = '';
                _this.isJudgeEnd = false;
                _this.isCanQuery = false;
                // _this.judgeIndexCode(); 
                _this.expressCompany = {expressCompanyNo:'',expressCompanyCode:'',expressCompanyName:'',expressCompanyPhone:''}

            }
        },
        methods: { 	
			/**
			 * 页面初始化
			 */		
            initData(){
                let _this = this;
            },
            /**
             * 注册app返回刷新等事件
             */	
            registerAppfun(){
                let _this = this;
                //注册ios异步跳转事件
                sinosdk.sino.overwriteWindowopen();
            },	
            /**
             * 首页进来的带过来的index参数
             */	
            judgeIndexQuery(){
                let _this = this;
                let query = _this.$route.query.index;
                if(query && query == 'indexScan'){
                    _this.getNoFromQrcode();
                    setTimeout(()=>{
                        document.title = '查快递';
                    },1000);
                }else if(query && query == 'indexInput'){
                    _this.$nextTick(()=>{
                        _this.$refs.inputSearch.focus();
                        document.title = '查快递';
                    })
                }
                
            },
            /**
             * 首页进来的带过来的indexCode参数
             */	
            judgeIndexCode(){
                let _this = this;
                let query = _this.$route.query.indexCode;
                if(query){
                   _this.judgeCode(query);
                }
            },
			/**
			 * 调取T信扫一扫的功能
			 */	
            getNoFromQrcode(){        
                let _this = this;
                let Json = {
                    action: 'action_common_qrcode_scan',
                    responseKeyList: [{
                        key: 'qrcode',
                        value: '',
                        type: 'string'
                    }]
                };
                sinosdk.sino.execAction(Json).then(res=>{ 
                    //扫描到的内容
                    let scanContent = res[0].value;
                    scanContent = scanContent.replace(/\s*/g,"");
                    if(_this.checkExpressNumber(scanContent)){
                        _this.judgeCode(scanContent);
                    }else{
                        expressHandler.showToast('未识别到有效快递单号');
                    }
                })
            },
            /**
			 * 判断code
			 */		
            judgeCode(scanContent){
                let _this = this;
                _this.isCanQuery = _this.checkExpressNumber(scanContent);
                if(_this.isCanQuery){
                    _this.expressNumber = scanContent;
                    _this.changeExpressNum('scan');
            

                }else{
                    expressHandler.showToast('未识别到有效快递单号');
                }
            },
			/**
			 * 校验订单号是否符合规则
			 */	
            checkExpressNumber(num){
                let res = /^[a-zA-Z0-9/]{4,30}$/.test(num) || false;
                return res;
            }, 
            	
			/**
			 * 校验订单号是否符合规则
			 */	
            checkVerifyPhoneNo(num){
                let res = /^[0-9/]{4}$/.test(num) || false;
                return res;
            },                 
			/**
			 * 快递单号变化
			 */	
            changeExpressNum(type){
                let _this = this;
                _this.queryExpressCompany(type);
            },       
			/**
			 * 查询快递单号所属快递公司
			 */	
            queryExpressCompany(type){
                let _this = this;
                _this.isCanQuery = _this.checkExpressNumber(_this.expressNumber) || false;
                if(_this.isCanQuery){
                    _this.requestId++;
                    let parma = {
                        outerExpressOrderNo:_this.expressNumber,
                        requestId:_this.requestId
                    }
                    _this.queryCompanying = true;
                    expressHandler.queryExpressCompany(parma).then((res) => {
                        _this.queryCompanying = false;
                        if(!!res.result.expressCompanies && res.result.requestId == _this.requestId){
                            _this.expressCompanies = res.result.expressCompanies || [];
                            //如果是通过扫一扫过来的并且只匹配到一家快递公司则要主动的调获取快递详情的接口
                            if(res.result.expressCompanies.length == 1 && type && type == 'scan'){
                                _this.getExpressDetailForCpyList(res.result.expressCompanies[0])
                            }
                        }else{
                            _this.isJudgeEnd = false;
                            _this.expressCompany = {expressCompanyNo:'',expressCompanyCode:'',expressCompanyName:'',expressCompanyPhone:''}
                        }
                    }).catch((err) => {
                        console.log(err);
                        _this.isJudgeEnd = false;
                        _this.queryCompanying = false;
                    }); 
                }else{
                    _this.expressCompany = {expressCompanyNo:'',expressCompanyCode:'',expressCompanyName:'',expressCompanyPhone:''};
                    _this.expressCompanies = [];
                    _this.isJudgeEnd = false;
                }
            }, 
			/**
			 * 手动点击查询快递按钮，默认用快递公司列表第一个进行查询
			 */	

            getExpressDetailManual(){
                let _this = this;
                if(!_this.isCanQuery){
                    expressHandler.showToast('快递单号格式错误')
                    return;
                }
                if(_this.queryCompanying){
                    expressHandler.showToast('正在查询所属快递公司')
                    return;
                }
                if(0 < _this.expressCompanies.length){
                    _this.getExpressDetailForCpyList(_this.expressCompanies[0]);
                }else{
                    expressHandler.showToast('查询所属快递公司失败')
                    return;
                }
            },
			/**
			 * 多家快递公司选择一家进行查询
			 */	
            getExpressDetailForCpyList(company){
                let _this = this;
                _this.expressCompany = company;
                _this.isJudgeEnd = true;
                _this.getExpressDetail();
            },	
			/**
			 * 获取手机号验证信息 新的改为一个input实现的方式
			 */	
            getVerifyPhoneNoNew(){
                let _this = this;
                if(_this.checkVerifyPhoneNo(_this.verifyPhoneNo)){
                    _this.blurInputFun();
                    _this.getExpressDetail();
                    _this.showVerifyPhone = false;
                }
            },		
			/**
			 * 获取手机号验证信息 4个input的时候老的 暂时不用
			 */	
            getVerifyPhoneNo(index){
                let _this = this;
                let tempVerify = '';
                if(index < 3 && _this.verifyPhoneList[index] != ''){
                    //右侧剩余的格子数
                    let surplusLength = _this.verifyPhoneList.length - index-1;
                    for(let i=1;i<=surplusLength;i++){
                        if(_this.verifyPhoneList[index+i] == ''){
                            _this.$refs['verifyInput'][index+i].focus();
                            break;
                        }
                    }
                }
                tempVerify = _this.verifyPhoneList.join('');
                if(_this.checkVerifyPhoneNo(tempVerify)){
                    _this.verifyPhoneNo = tempVerify;
                    console.log(_this.verifyPhoneNo);
                    _this.getExpressDetail();
                    _this.showVerifyPhone = false;
                }
            },		
			/**
			 * 删除手机号验证信息
			 */
            deleteInput(index){
                let _this = this;
                if(index > 0 && _this.verifyPhoneList[index] == ''){
                    _this.$refs['verifyInput'][index-1].focus();
                }
            },		
			/**
			 * 初始化手机号验证信息
			 */
            resetVerifyPhone(){
                let _this = this;
                _this.verifyPhoneList = ['','','',''];
            },
			/**
			 * 查询物流详情
			 */	
            getExpressDetail(){
                let _this = this;
                if(!_this.isCanQuery){
                    return;
                }
                if(_this.queryCompanying){
                    expressHandler.showToast('正在查询所属快递公司');
                    return;
                }
                if(!_this.isJudgeEnd){
                    _this.gotoPage('/third',{'nu':_this.expressNumber});
                }else{
                    if(_this.querying){
                        return;
                    }
                    let parma = {
                        outerExpressOrderNo:_this.expressNumber,
                        expressCompanyNo:_this.expressCompany.expressCompanyNo,
                    }
                    if(_this.expressCompanyMap[_this.expressCompany.expressCompanyCode].needVerifyPhoneNo){
                        if(_this.checkVerifyPhoneNo(_this.verifyPhoneNo)){
                            parma['verifyPhoneNo'] = _this.verifyPhoneNo;
                        }else{
                            _this.showVerifyPhone = true;
                            return;
                        }
                    }
                    _this.verifyPhoneNo = '';
                    _this.verifyPhoneList = ['','','',''];
                    _this.querying = true;
                    expressHandler.getExpressDetail(parma).then((res) => {
                        _this.querying = false;
                        _this.blurInputFun();
                        if (res.resultCode == 0) {
                            //将查出来的结果存储缓存 因为首页有一个搜索历史的功能
                            _this.setStorageFun(res.result.expressOrderDetail, parma['verifyPhoneNo']);
                            expressHandler.setSession('expressOrderDetail',JSON.stringify(res.result.expressOrderDetail || {}));
                            _this.gotoPage('/detail/express',{pageFrom:'queryExpress',outerExpressOrderNo:_this.expressNumber,expressCompanyNo:_this.expressCompany.expressCompanyNo,expressCompanyCode:_this.expressCompany.expressCompanyCode});
                            _this.clearData();
                        }else if(res.resultCode == 46060014){
                            _this.gotoPage('/third',{'nu':_this.expressNumber});
                            _this.clearData();
                        }
                    }).catch((err) => {
                        _this.querying = false;
                        _this.blurInputFun();
                        console.log(err);
                    }); 
                }
            }, 	 
            blurInputFun(){
                this.$refs.inputSearch.blur(); 
                this.$refs.verifyInput.blur();
            },
            clearData(){
                this.showMask=false;
                this.isJudgeEnd=false;
            },
            //将查出来的结果存缓存，最多存10条，多余的切除，同时要去重
            setStorageFun(data ,phone){
                if(!data){ return };
                let obj = {
                    outerExpressOrderNo: data.outerExpressOrderNo || '---',
                    expressDetails: data.expressDetails[0] || [],
                    expressStatus: ((data.expressDetails[0] || {}).expressStatus) || '',
                    expressCompanyInfo: data.expressCompanyInfo || {},
                    phone: phone || '',
                };
                let expressHistoryList = JSON.parse(expressHandler.getStorage('expressHistoryListNew')) || [];
                //移入数组
                expressHistoryList.unshift(obj);
                //数组去重
                let objRepeat = {}
                expressHistoryList = expressHistoryList.reduce((cur,next) => {
                  objRepeat[next.outerExpressOrderNo] ? "" : objRepeat[next.outerExpressOrderNo] = true && cur.push(next);
                    return cur
                },[])
                //最多10条
                expressHistoryList = expressHistoryList.slice(0,10);
                //存入缓存
                expressHandler.setStorage('expressHistoryListNew', JSON.stringify(expressHistoryList));
            },
			/**
			 * 跳转页面
             * 
			 */	        
            gotoPage(url,queryData){
                let _this = this;
                _this.$router.push({
                    path: url, 
                    query: queryData
                })                 
            },
            //点击清空输入内容关闭的按钮
            closeInput(){
                this.expressNumber = '';
                this.isJudgeEnd = false;
                this.isCanQuery = false;
                this.$refs.inputSearch.focus();
            },
            searchFocus(){
                let that = this;
                that.showMask = true;
                that.changeExpressNum();
            }
        }
    }
</script>
<style scoped lang="less">
@import '~themes/default/styles/expressServer/queryExpress.less';
</style>



  

