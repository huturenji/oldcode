<template>
    <div class="expressWrap">
        <div class='express'>
            <Platform name="serviceReminders"></Platform>
            <div class="topWrap">
                <div class="inputWrap cursorp">
                    <!-- <input @click="gotoPage('/query')" class="expressNum cursorp" type="text" readonly placeholder="输入或扫一扫快递单号">
                    <div v-if="!isPc" @click="getNoFromQrcode" class="sysBut"></div> -->
                    <!-- 搜索查询引入vue组件 -->
                    <queryExpress ref="queryExpress"/> 
                </div>
            </div>
            <div class="expressListOutWrap">
                <div class="expressListWrap" v-if="expressList.length > 0">                
                    <div class="expressItem icon-btn" v-for="(item,index) in expressList" v-bind:style="{backgroundImage: 'url(' + item.src + ')'}" @click="openBusiness(item)" :key="index" >
                        <div class="textWrap" >{{item.name}}</div> 
                        <div class="textTips">{{item.tips}}</div>  
                    </div>
                </div>
            </div>
            <!-- <div class="adOutWrap">
                <div class="adWrap"></div>
            </div> -->
            <div class="navWrap">
                <tab class="navWrapTab" :line-width="2" custom-bar-width="0.8rem" bar-active-color="#262DD9" active-color="#262DD9" >
                    <tab-item class="cursorp" selected @on-item-click="changeNav">搜索历史</tab-item>
                    <tab-item class="cursorp" @on-item-click="changeNav">我收的</tab-item>
                    <tab-item class="cursorp" @on-item-click="changeNav">我寄的</tab-item>
                </tab>
            </div>
            <div class="listOutWrap">
                <div class="bigListWrap" :style="leftStyle">
                    <!-- 最多显示10条搜索历史前端缓存没有分页 -->
                    <div ref="searchHistoryListWrap" class="listWrap">
                        <div ref="searchHistoryListIn">
                            <expressListSearchHistory :expressOrder="item" :isPc="isPc" v-for="(item,index) in listObj['searchHistory'].expressOrders" :key="index" @click.native="openDetail('searchHistory',item)" @delete="deleteOrder(item, 'searchHistory')"></expressListSearchHistory>
                            <LoadingX v-if="listObj['searchHistory'].loading" tipsText='数据加载中'/>
                            <EmptyX v-else-if="listObj['searchHistory'].empty" tipsText='暂无搜索历史'/>
                        </div>
                    </div>
                    <div ref="accessListWrap" class="listWrap" @scroll="loadMore('access')">
                        <div ref="accessListIn">
                            <expressList :expressOrder="item" :isPc="isPc" :showInvoice="true" v-for="(item,index) in listObj['access'].expressOrders" :key="index" @click.native="openDetail('access',item)" @delete="deleteOrder(item, 'access')"></expressList>
                            <LoadingX v-if="listObj['access'].loading" tipsText='数据加载中'/>
                            <EmptyX v-else-if="listObj['access'].empty" tipsText='暂无快递信息'/>
                            <div class="nomore" v-else-if="listObj['access'].nomore  && listObj['access'].expressOrders.length > 5" >已显示近半年快递记录</div>
                        </div>
                    </div>
                    <div ref="sendListWrap" class="listWrap" @scroll="loadMore('send')">
                        <div ref="sendListIn">
                            <expressList :expressOrder="item" :isPc="isPc" :showInvoice="false" v-for="(item,index) in listObj['send'].expressOrders" :key="index" @click.native="openDetail('send',item)" @delete="deleteOrder(item, 'send')"></expressList>
                            <LoadingX v-if="listObj['send'].loading" tipsText='数据加载中'/>
                            <EmptyX v-else-if="listObj['send'].empty" tipsText='暂无快递订单信息'/>
                            <div class="nomore" v-else-if="listObj['send'].nomore && listObj['send'].expressOrders.length > 5">已显示近半年快递记录</div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import LoadingX from "components/loading/LoadingX.vue";
    import EmptyX from "components/empty/EmptyX.vue";
    import {expressListData} from './enum/expressEnum.js';
    const expressList = ()=>import('./comp/expressList.vue');
    const expressListSearchHistory = ()=>import('./comp/expressListSearchHistory.vue');
    const Platform = ()=>import('components/announcement/index.vue');
    import queryExpress from "./queryExpress.vue";
    import expressHandler from './js/expressHandler.js';
    import { Tab, TabItem} from 'vux';
    export default {
        mixins: [expressHandler.mixin.tChatEventMixin],
		components:{
            Tab,
            TabItem,
            LoadingX,
            EmptyX,
            expressList,
            Platform,
            queryExpress,
            expressListSearchHistory
		},
        data() {
            let that = this;
            let managerData = expressHandler.stateManager.setData([
            ], this);
            return Object.assign(managerData, {
                expressList:expressListData,//入口文件配置
                showItemIndex:0,//我收的我寄的和搜索历史位置切换
                listObj:{//列表参数
                    'send':{//我寄的
                        pageIndex:1,
                        pageSize:20,
                        expressOrders:[],
                        loading:false,
                        empty:false,
                        nomore:false,
                        type:'1',
                        canAddpage:true,//滚动加载节流控制
                        actionListScrollTop:0,//列表加载时滚动的距离，控制向下滚动才加载
                        maxIndex:1,//列表已经加载了多少页，用于返回刷新时使用
                    },
                    'access':{//我收的
                        pageIndex:1,
                        pageSize:20,
                        expressOrders:[],
                        loading:false,
                        empty:false,
                        nomore:false,
                        type:'0',
                        canAddpage:true,//滚动加载节流控制
                        actionListScrollTop:0,//列表加载时滚动的距离，控制向下滚动才加载
                        maxIndex:1,//列表已经加载了多少页，用于返回刷新时使用
                    },
                    'searchHistory':{//我收的
                        pageIndex:1,
                        pageSize:20,
                        expressOrders:[],
                        loading:false,
                        empty:false,
                        nomore:false,
                        type:'2',
                        canAddpage:true,//滚动加载节流控制
                        actionListScrollTop:0,//列表加载时滚动的距离，控制向下滚动才加载
                        maxIndex:1,//列表已经加载了多少页，用于返回刷新时使用
                    }
                },
                pageIsInit:true,//页面初始化
                isPc:false,//是否PC                
            });
        },
        created(){
            let _this = this;
            if(expressHandler.isPC()){
                _this.isPc = true;
            }
        },
        activated(){
            let _this = this;
            _this.initAllpageData();
        },
		mounted(){
        },
        computed:{
            leftStyle(){
              return {
                  left: '-' + this.showItemIndex*100 + '%'
              }
            }
        },
        methods: { 	 			        	
			/**
			 * 页面初始化
			 */	
            initData(){
                let _this = this;
                //搜索历史
                _this.listObj['searchHistory'].pageIndex = 1;
                _this.listObj['searchHistory'].expressOrders = [];
                _this.listObj['searchHistory'].nomore = false;
                _this.listObj['searchHistory'].empty = false;
                _this.listObj['searchHistory'].actionListScrollTop = 0;
                _this.listObj['searchHistory'].maxIndex = 1;
                _this.getExpressOrders('searchHistory');
                //我收的
                _this.listObj['access'].pageIndex = 1;
                _this.listObj['access'].expressOrders = [];
                _this.listObj['access'].nomore = false;
                _this.listObj['access'].empty = false;
                _this.listObj['access'].actionListScrollTop = 0;
                _this.listObj['access'].maxIndex = 1;
                _this.getExpressOrders('access');
                //我寄的
                _this.listObj['send'].pageIndex = 1;
                _this.listObj['send'].expressOrders = [];
                _this.listObj['send'].nomore = false;
                _this.listObj['send'].empty = false;
                _this.listObj['send'].actionListScrollTop = 0;
                _this.listObj['send'].maxIndex = 1;
                _this.getExpressOrders('send');
                _this.pageIsInit = false;
            },	 			        	
			/**
			 * 页面保活，返回后刷新所有数据
			 */	
            initAllpageData(){
                let _this = this;
                if(_this.pageIsInit){
                    _this.initData();
                }else{
                    _this.getExpressOrders('send',true);
                    _this.getExpressOrders('access',true);
                    _this.getExpressOrders('searchHistory',true);
                }
            },
            /**
            * T信回退事件的注册回调 必须是goBackFun
            */
            goBackFun(){
                expressHandler.stateManager.closeTopPop(()=>{
                    //当前在首页时要关闭窗口到控制台，传入的参数在整个系统的url中不能存在，否则会跳转到那个url去；只有APP在所有url中找不到这个参数，才会回到工作台
                    expressHandler.closePage();
                });        
            },	        	
			/**
			 * 根据我的差标信息设置酒店筛选价格
			 */	
			searchdo(){
                let _this = this;
                let tempNum = _this.number;
                _this.nu = tempNum;
            },
            changeNav(index){
                this.showItemIndex = index;
            },
            /**
             * 翻页加载
             */
            loadMore(type) {
                let _this = this;
                if(_this.listObj[type].loading) {
                    return;
                }
                let refListWrapName = type+'ListWrap';
                let refListInName = type+'ListIn';
                let scrollBoxHeight = _this.$refs[refListInName].offsetHeight;
                let windowHeight = _this.$refs[refListWrapName].offsetHeight;
                let scrollTop = _this.$refs[refListWrapName].scrollTop;
                if (scrollTop >= _this.listObj[type].actionListScrollTop && windowHeight + scrollTop + 5 >= scrollBoxHeight && _this.listObj[type].canAddpage) {
                    _this.listObj[type].canAddpage = false;//限制多次触发
                    _this.listObj[type].actionListScrollTop = scrollTop;
                    setTimeout(function () {
                        _this.listObj[type].canAddpage = true;
                    }, 500)
                    _this.getExpressOrders(type);
                } 
            },
			/**
			 * 获取列表数据 
             * @type  'send' or 'access' or searchHistory
             * @isAllPageInit   是否刷新所有页数
			 */
            getExpressOrders(type,isAllPageInit){
                let _this = this;
                let allPageInit = isAllPageInit || false;
                let parma = {
                    expressOrderType:_this.listObj[type].type,
                    pageIndex:allPageInit?1:_this.listObj[type].pageIndex,
                    pageSize:allPageInit?_this.listObj[type].pageSize*_this.listObj[type].pageIndex:_this.listObj[type].pageSize
                }   
                if((_this.listObj[type].loading || _this.listObj[type].nomore) && !allPageInit){
                    return;
                }
                _this.listObj[type].loading = true;    
                
                //首先处理搜索历史的tab(前端存缓存，最多展示最新的10条)
                if(type == 'searchHistory'){
                    _this.listObj[type].expressOrders = JSON.parse(expressHandler.getStorage('expressHistoryListNew')) || [];
                    _this.listObj[type].loading = false;   
                    if( _this.listObj[type].expressOrders.length <= 0 ){
                        _this.listObj[type].empty = true;
                    }else{
                        _this.listObj[type].empty = false;
                    }
                    return;
                }
                
                expressHandler.getExpressOrders(parma).then((res) => {
                    //记住列表已经加载的页数，用于返回时刷新数据
                    _this.listObj[type].maxIndex = _this.listObj[type].pageIndex;
                    _this.listObj[type].loading = false;  
                    if (!!res.result.expressOrders) {
                        if(allPageInit){
                            _this.$set(_this.listObj[type],'expressOrders',res.result.expressOrders)
                            // _this.listObj[type].expressOrders = res.result.expressOrders;

                        }else{
                            _this.listObj[type].expressOrders = _this.listObj[type].expressOrders.concat(res.result.expressOrders);
                            if(res.result.expressOrders.length < _this.listObj[type].pageSize){
                                _this.listObj[type].nomore = true;
                            }else{
                                _this.listObj[type].pageIndex++;
                            }
                        }
                        if(_this.listObj[type].expressOrders.length == 0){
                            _this.listObj[type].empty = true;
                        }else{
                            _this.listObj[type].empty = false;
                        }
                    }
                }).catch((err) => {
                    _this.listObj[type].loading = false;
                    console.log(err);
                });                
            },
			/**
			 * 跳转业务入口
			 */	
            openBusiness(item){
                let _this = this;
                if(item.type == 'route'){
                    if(item.isOpen){
                        _this.gotoPage(item.url)
                    }else{
                        expressHandler.showToast('程序小哥努力开发中，敬请期待...');
                    }
                }
            },	 	
			/**
			 * 跳转详情页面
             * 
			 */	
            openDetail(type,item){
                let _this = this;
                if('send' == type){//我寄的
                    _this.gotoPage('/detail/order',{'expressOrderNo':item.expressOrderNo})
                }else if('access' == type){//我收的
                    _this.gotoPage('/detail/express',{'outerExpressOrderNo':item.outerExpressOrderNo || item.orderNoForExpress,'expressCompanyNo':item.expressCompanyInfo.expressCompanyNo,'expressCompanyCode':item.expressCompanyInfo.expressCompanyCode,phoneNo:item.senderInfo.phone,'pageFrom':'express'})
                }else{//搜索历史
                    _this.gotoPage('/detail/express',{'outerExpressOrderNo':item.outerExpressOrderNo,'expressCompanyNo':item.expressCompanyInfo.expressCompanyNo,'expressCompanyCode':item.expressCompanyInfo.expressCompanyCode,phoneNo:item.phone,'pageFrom':'express'})
                }
            },	 	
			/**
			 * 跳转页面
             * 
			 */	        
            gotoPage(url,queryData){
                let _this = this;
                _this.$router.push({
                    path: url, 
                    query: queryData || {}
                })                 
            },	 	
			/**
			 * 删除订单
             * 
			 */	        
            deleteOrder(item, type){
                let _this = this;
                expressHandler.showConfirm('确认删除该条快递记录？', function(){
                   _this.deleteOrderFun(item, type)
                }, 2, '取消', '确认', null, null, true);
            },
            //删除订单的方法
            deleteOrderFun(item, type){
                let _this = this;
                if(!item || !type){ return };
                if(type == 'searchHistory'){//删除缓存里面的数据                
                    let expressHistoryListNew = JSON.parse(expressHandler.getStorage('expressHistoryListNew')) || [];
                    let index = expressHistoryListNew.findIndex((temp)=>{
                        return item.outerExpressOrderNo == temp.outerExpressOrderNo;
                    });
                    expressHistoryListNew.splice(index, 1);
                    //存入缓存
                    expressHandler.setStorage('expressHistoryListNew', JSON.stringify(expressHistoryListNew));
                    expressHandler.showToast('删除成功')
                    _this.initData();
                }else{
                    let parma = {
                        expressOrderNo:item.expressOrderNo,
                    }              
                    expressHandler.deleteExpressOrder(parma).then((res) => {
                        if (0 == res.resultCode) {
                            expressHandler.showToast('删除成功')
                            _this.initData();
                        }
                    }).catch((err) => {
                        console.log(err);
                    });
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
                    _this.gotoPage('/query',{
                        indexCode:scanContent
                    });
                })
            },
        }
    }
</script>
<style scoped lang="less">
    @import '~themes/default/styles/expressServer/express.less';
</style>

