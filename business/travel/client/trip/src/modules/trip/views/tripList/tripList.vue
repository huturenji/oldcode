<template>
    <div class="content" :class="{footerBar:showFooter}">
        <div v-if="showLoading">
            <div class="mescroll-upwarp mescroll-hardware" style="visibility: visible; display: block;">
                <p class="upwarp-progress mescroll-rotate"></p>
                <p class="upwarp-tip" style="font-size: .3rem;">正在加载中...</p>
            </div>
        </div>
        <!-- 生成行程失败的显示模板 -->
        <template v-if="operationFailed">
            <operationFail @operationFailConfirm="goBack"></operationFail>
        </template> 
        <template v-else>
            <template v-if="!showLoading">
            <!-- 只有在显示列表的时候才展示服务提醒 -->
            <Platform v-if="showList" name="serviceReminders"></Platform> 
            <!-- 审批过来显示的页面 -->
                <div v-if="!showList" class="approve-box">
                    <div class="approve-content">
                        <img v-if="status=='apply'" src="~assets/img/trip/icon_work_pendingtrial.svg">
                        <img v-else-if="status=='approved'" src="~assets/img/trip/icon_work_pass.svg">
                        <img v-else-if="status=='cancel'" src="~assets/img/trip/icon_work_refuse.svg">
                        <img v-else-if="status=='undo'" src="~assets/img/trip/icon_work_repeal.svg">
                        <p class="tips" :class="{colorYellow:status=='apply',colorGreen:status=='approved',colorRed:status=='cancel',colorGray:status=='undo'}">{{transferStatus()}}</p>
                        <p class="des">{{transferName()}}</p>
                    </div> 
                    <!-- 确定按钮 -->
                    <!-- todo 此处需要改目前兼容华兴银行临时改的方案 -->
                    <div @click="goBack" class="confirmBtn" :class="{huaxingStyle:judgeHuaxingStyle()}">
                        确定
                    </div>
                </div>
            </template>  
                
            <template v-if="showList">
                <mescrollVue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
                    <!-- 正常的显示行程列表的页面 -->
                    <div class="trip-container" v-if="!loading">
                        <div class="hisHead" >
                            <div @click='openHis' class="history cursorp">
                                <icon type="icon_time" size=".28" />
                                <span>历史行程</span>
                            </div>
                        </div>
                        <EmptyX v-if='!loading && noFlag' :tipsText='emptyTxt' />
                        <div v-else class="trip-list-container">
                            <div ref="li" class="tripList" v-for='(trip, index) in tripList' :key='index'>
                                <div v-if='trip.cause' class="title">
                                    <!-- 左侧的title -->
                                    <div  class="title_content">
                                        <span v-if='trip.cause'>{{trip.cause}}</span>
                                        <span v-if="trip.tripStatusEnum == 'APPLY'" class="applying">[审批中]</span>
                                    </div> 
                                    <!-- 右侧的删除 -->
                                    <div @click="confirmDeleteTrip(trip)" class="delete_trip">
                                        <icon type="icon_mall_delete" size=".34"/>
                                    </div>
                                </div>
                                <div class="position" :class="{flowId: trip.flowId}">
                                    <!-- 此时说明是用车不是出差申请过来的 因私的商务用车 -->
                                    <div v-if="(trip.orderDetailList.length > 0) && (trip.orderDetailList[0].orderType == '6') && (trip.departCityName == trip.arriveCityName)">
                                        <span v-if="!!trip.departCityName">{{trip.departCityName}}</span> 
                                    </div> 
                                    <div v-else>
                                        <template v-if="!!trip.departCityName || !!trip.arriveCityName">
                                            <span v-if="trip.flowId" class="position-title">地点：</span>    
                                            <span v-if="!!trip.departCityName">{{trip.departCityName}}</span>
                                            <span v-if="!trip.flowId">前往</span>
                                            <span v-else-if="!!trip.departCityName && !!trip.arriveCityName && !!trip.flowId">-</span>
                                            <span v-if='!!trip.arriveCityName'>{{trip.arriveCityName}}</span>
                                            <span v-if="trip.flowId && ENABLE_USE_TYPE" class="for-public">因公</span>
                                        </template>
                                    </div> 
                                </div>

                            
                                <div class="date" v-if="!!trip.departTime && !!trip.arriveTime && trip.flowId">
                                    <span class="date-title">时间：</span>{{handleDate(trip.departTime)}}<span class="split">-</span>{{handleDate(trip.arriveTime)}}
                                </div>

                                <!-- 该行程由谁帮您预订dom -->
                                <div v-if='!trip.isSelf && (trip.founderInfo||{}).founderName' class="is_self">
                                    <span class='clr_red'>
                                        <i><icon type="icon_common_prompt" size=".28"/></i>
                                        该行程由<span class="name">{{(trip.founderInfo||{}).founderName}}</span>为您预订
                                    </span>
                                </div>

                                <div  v-if="!!trip.flowId" class="orderList">
                                    <!-- :class="isTripInValid(trip)?'textDisabled':''" -->
                                    <div class="order orderFlight cursorp" @click="toOrder('flight',trip,'0')">
                                        <div class="order-flight">订机票</div>
                                    </div>
                                    <div class="order orderTrain cursorp" @click="toOrder('train',trip,'1')">
                                        <div class="order-train">订火车票</div>
                                    </div>
                                    <div class="order orderHotel cursorp" @click="toOrder('hotel',trip,'2')">
                                        <div class="order-hotel">订酒店</div>
                                    </div>
                                </div>

                                <div v-if='trip.orderDetailList.length>0' class="trip-card-list">
                                    <div v-for='(orderInfo, indexOrder) in trip.orderDetailList' :key='indexOrder'>
                                        <order :orderInfo="orderInfo" :trip="trip"></order>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </mescrollVue>
            </template>

        </template>
         
        
        <!-- loading -->
        <div v-transfer-dom>
            <div v-if="popLoading">
                <loading :show="popLoading" text="删除中"></loading>
            </div>
        </div>
        <div v-transfer-dom>
            <footerBar v-if='showFooter' :activeType="'trip'"/>
        </div>  
    </div>
</template>

<script>
import icon from 'components/icon';
import EmptyX from "components/empty/EmptyX.vue";
import tripHandler from '../tripHandler.js'
import order from '../comp/order.vue'
import operationFail from '../comp/operationFail.vue'
import Bus from '../common/bus/bus.js';
import mixin from '../tripMixin.js';
import MescrollVue from 'mescroll.js/mescroll.vue'
import {
    TransferDom,
    Loading
} from 'vux';
const Platform = ()=>import('components/announcement/index');
const footerBar = ()=>import('components/footerBar/footerBar.vue');
export default {
    directives: {TransferDom},
    mixins: [mixin,tripHandler.mixin.tChatEventMixin],
    components: {
        EmptyX,
        order,
        Loading,
        Platform,
        operationFail,
        icon,
        footerBar,
        MescrollVue
    },
    data: function () {
        return Object.assign(tripHandler.stateManager.setData([], this), {
            emptyTxt:'您当前没有行程安排',
            tripList: [],
            noFlag: false,
            loading: true,//数据加载
            status: '',//代表审批的状态
            ApplyName:'',//申请人的姓名 
            ApprovalName:'',//审批人姓名
            showList: true, //显示列表还是显示审批状态 true代表显示列表
            operationFailed:false,//操作失败，展示缺省页
            ENABLE_USE_TYPE: tripHandler.ENABLE_USE_TYPE !== false,//是否开启因公因私功能
            showFooter:false,//是否展示底部导航栏
            mescroll: null,
            showLoading:true,
            
            mescrollDown: {
                use:false
            }, 
            //下拉刷新的配置.
            mescrollUp: { 
                textLoading:'',
                callback: this.getData,
                noMoreSize: 0,
                offset:10,//列表滚动到距离底部小于100px,即可触发上拉加载的回调
                loadFull: {
                    use : false,
                    timeout: 10,//连续翻页n秒后停止该功能
                    delay: 500 // 延时执行的毫秒数; 延时是为了保证列表数据或占位的图片都已初始化完成,且下拉刷新上拉加载中区域动画已执行完毕;
               
                },
                page: {
                    num: 0,
                    size: 10
                },
                // empty: {
                //         warpId: 'dataList',
                //         icon: require('themes/default/img/defaultPage/img_defpage_nocontent@2x.png'),
                //         tip: '暂无订单'
                // },
                htmlLoading: '<p class="upwarp-progress mescroll-rotate"></p><p class="upwarp-tip" style="font-size: .3rem;">正在加载中...</p>',
                htmlNodata: '<p class="upwarp-nodata" style="font-size: .3rem;">-没有更多行程记录了哦-</p>' // 无数据的布局
            }

        }) 
    },
    computed: {
    
        
    },
    beforeCreated() {

    },
    activated: function () {
        //注册刷新返回事件，入口页面强制刷新
    },
    created: function () {
        let that = this;
        sinosdk.sino.onChildWindowClose(function(){ //注册下一个页面返回到当前页面，如果是WEBOA，则重新设置title
            if(sinosdk.sino.getPlatform()==sinosdk.sino.constant.RUN_ENV.WEBOA){
                document.title = "我的行程";
            } 
        }.bind(this));

        if (!!this.$route.query.pageFrom && this.$route.query.pageFrom=='footBar'){
            that.showFooter = true;
        }
        var urlParams = tripHandler.getUrlParams();
        if (!urlParams.buyTicketParam){
            that.showLoading = false;
        } else {
            let p = tripHandler.getBuyTicketParam(urlParams.buyTicketParam);
            if (Object.prototype.hasOwnProperty.call(p,'status')){
                let applyName = decodeURIComponent(p.ApplyName)
                let applyId = decodeURIComponent(p.ApplyUaId)
                //审批完成状态才能领取代金券
                this.receiveCashCoupon(applyId, applyName);//领取代金券
            }
        }
    },  
 
    mounted: function () {
        const that = this;
        Bus.$on('reGetTripList', function () {
            that.getTripList('delete',false,null,that.mescroll);   
        //that.mescroll.resetUpScroll()
        });
    },
    updated: function () {

    },
    beforeDestory: function () {
        Bus.$off('reGetTripList');
    },
    beforeRouteLeave(to, from, next) {
        next();
    },
    methods: {
        /**
        * T信回退事件的注册回调 必须是goBackFun
        */
        goBackFun(){
            let that = this;
            tripHandler.stateManager.closeTopPop(() => {
                if (!that.showList){
                    that.goBack();//有审批状态的时候返回两步
                } else {
                    tripHandler.closePage();
                }
            });            
        },
        //初始化刷新注册事件
        mescrollInit(mescroll){
            this.mescroll = mescroll
        },
        /**
         * 领取代金券
         */
        async receiveCashCoupon(applyId, applyName){
            const cashCouponCodes = tripHandler.getUserPara('cashcouponId');
            if (tripHandler.isEmpty(cashCouponCodes)){
                return;
            }
            try {
                const appName = await sinosdk.sino.getAppName();
                const bizmateUserInfo = await sinosdk.sino.getUserInfo();
                const param = {
                    passwordList: cashCouponCodes.split('|'),
                    channelName: appName,
                    companyName: bizmateUserInfo.cpyName,
                    thirdUserId: applyId,
                    thirdUserName: applyName
                };
                tripHandler.receiveCashCoupon(param).then(res=>{
                    this.cacheReceivedPwd({cashCouponCodes, userId: applyId, cpyId: bizmateUserInfo.cpyId })
                }).catch(e=>{
                    if (e.resultCode == '460000002'){
                        tripHandler.showToast(e.resultMessage);
                    }
                })
            } catch (e){
                console.error('领取代金券失败！' + e)
            }
        },
        /**
         * 将已领取的券存储到app缓存中
         */
        cacheReceivedPwd(obj){
            sinosdk.sino.putNativeCache({
                type: 'string',
                key: `bplusReceivedPwd_${obj.cpyId}`,
                value: JSON.stringify(obj)
            });
        },
        /**
        * 初始化数据
        */
        async getData(page,mescroll){
            let that = this;
            //是否操作失败初始化
            that.operationFailed = false;
            var urlParams = tripHandler.getUrlParams();
            if (!!urlParams.buyTicketParam) { //两种情况 一种是：出差申请（包括申请，完结，撤销） 第二种是：审批完结后点击去预定按钮 或者推送 跳转过来的。
                let p = tripHandler.getBuyTicketParam(urlParams.buyTicketParam);
        
                let param = {};//创建行程需要的参数对象
                param.tripList = p.TripList.map((item) => {
                    let obj = {};
                    obj.departTime = new Date(item.DepartTime * 1000).format('yyyy/MM/dd');
                    obj.arriveTime = new Date(item.ArriveTime * 1000).format('yyyy/MM/dd');
                    // 此处事由截取的原因是审批那边的出差申请填写的事由限制是2000字符，商旅数据库限制是512字符，此时为了生成行程不报错进行字符串截取
                    obj.cause = !!item.traveNote ? decodeURIComponent(item.traveNote).substring(0, 512) : `${new Date(item.DepartTime * 1000).format('yyyy年MM月dd日')}行程`; //当没有事由的时候，此时用出发日期+行程 表示事由
                    obj.arriveCityName = decodeURIComponent(item.ArriveCityName);
                    obj.departCityName = decodeURIComponent(item.DepartCityName);
                    return obj;
                });
                //创建用户人的信息
                // let founderInfo = {
                //     founderName: tripHandler.userName || '',
                //     founderUserId: tripHandler.userId,
                //     founderCompanyId: tripHandler.companyId,
                // }        
                // param.founderInfo = founderInfo; //因为行程的创建人即applyUaId，所以此时创建行程的时候该字段没必要传可。
                param.approvalUaId = p.ApprovalUaId; //审批人的UaId
                param.applyUaId = p.ApplyUaId || tripHandler.uaId; //申请人的UaId 如果审批没有传递applyUaId字段的时候，默认直接取token里面的
                param.flowId = p.FlowId;
                

                //审批传过来的参数status
                //申请出差 申请人生成行程的状态status=apply  代表待审批
                //审批出差 审批人生成行程的状态status=approved  代表已通过
                //审批出差 审批人生成行程的状态status=cancel 代表已拒绝
                if (Object.prototype.hasOwnProperty.call(p,'status')){ //上面所说的第一种情况 -- 出差申请（包括申请，完结，撤销）
                    that.status = p.status;
                    param.status = that.status == 'undo' ? 'cancel' : that.status;
                   
                    that.showList = false;
                    //审批传过来的金额 需要除以100 用于行程推送
                    if (p.amount){
                        param.amount = (p.amount)/100;
                    }

                    //更新申请人姓名和出差人姓名
                    that.ApplyName = decodeURIComponent(p.ApplyName);
                    that.ApprovalName = decodeURIComponent(p.ApprovalName);
                    //转换页面的title
                    that.transferTitle();
                    tripHandler.createTrip(param).then((res) => {
                        console.log("设置审批携带行程数据：" + res);  
                    }).catch(e=>{
                        that.operationFailed = true;
                        console.log(e);
                        if (e.resultCode == '46070010'){
                            let msg = e.rdesc || e.resultMessage;
                            tripHandler.showToast(msg);
                        }
                    }).finally(()=> {
                        this.showLoading=false;
                    });
                } else { //上面所说第二种情况 审批完结后点击去预定按钮 或者推送 跳转过来的。
                    document.title = "我的行程"
                    this.showLoading=false;
                    
                    //此代码块为了兼容旧的版本（审批不升级）点击去预订 
                    //审批未传status参数
                    that.status = '';

                    //如果没有这个参数 这个从参数与后端约定的参数传 ‘old’;
                    param.status = 'old';
                    //显示行程列表
                    that.showList = true;

                    tripHandler.createTrip(param).then((res) => {
                        console.log("设置审批携带行程数据：" + res);  
                        that.getTripList('init', false,page,mescroll);
                    }).catch(e=>{
                        that.operationFailed = true;
                        console.log(e);
                        if (e.resultCode == '46070010'){
                            let msg = e.rdesc || e.resultMessage;
                            tripHandler.showToast(msg);
                        }
                    }).finally(()=> {
                        
                    }); 
                     
                }                
            } else { //获取行程列表
                document.title = "我的行程"
                that.showList = true;
                if (page.num == 1){
                    that.getTripList('init', false,page,mescroll);
                } else {
                    that.getTripList('page', false,page,mescroll);
                }
               
            }
        },
        /**
         * 判断行程是否合法
         */
        isTripInValid(trip){
            return tripHandler.isTripInValid(trip);
        },
        /**
       * 下单
       * @param {Object} entry  跳转链接url的类型
       * @param {Object} trip  行程信息
       */
        toOrder(entry, trip, index) {
            Bus.$off('reGetTripList'); //跳转之后删掉事件总线的监听
            let type;
            if (tripHandler.isChuXingEntry()){
                type = entry
                entry = 'mobile';
            }
            return tripHandler.toOrder(entry, trip, index, type);
        },
      
        /**
         * 打开历史行程
         */
        openHis(){
            let that = this;
            that.$router.push({
                path:'/his'
            });
        },
        /**
        * 审批状态转换
        */
        transferStatus(){
            let res = '';
            if (this.status == 'apply'){
                res = '待审批';
            } else if (this.status == 'approved'){
                res = '已通过';
            } else if (this.status == 'cancel'){
                res = '已拒绝';
            } else if (this.status == 'undo'){
                res = '已撤销';
            }
            return res;
        },
        /**
        * 审批姓名转换
        */
        transferName(){
            let res = '';
            if (this.status == 'apply'){
                res = `您的出差申请已提交给${this.ApprovalName}，待审批`;
            } else if (this.status == 'approved'){
                res = `您已同意${this.ApplyName?this.ApplyName:this.ApprovalName}的出差申请`; //此处的判断为兼容自审自批的情况 即没有审批人的情况
            } else if (this.status == 'cancel'){
                res = `您已拒绝${this.ApplyName}的出差申请`;
            } else if (this.status == 'undo'){
                res = `您的出差申请已撤销`;
            }
            return res;
        },
        /**
        * 审批页面title转换
        */
        transferTitle(){
            if (this.status == 'apply'){
                document.title = '出差申请';
            } else if (this.status == 'approved' || this.status == 'cancel' ){
                document.title = `${this.ApplyName}的出差`;
            }
            else if (this.status =="undo"){
                document.title = '出差申请'
            }
        },
        //审批情况下的返回 回退两步
        goBack(){
            let loadData = 'tripReturn';
            tripHandler.closePage(null, 2, loadData);
        },
        //删除行程
        confirmDeleteTrip(trip){
            tripHandler.confirmDeleteTrip(trip);
        },


        /**
         * 时间转换为年月
         * @param {Object} date  时间
         */
        handleDate(date) {
            return tripHandler.handleDate(date);
        },

        //todo 兼容华兴银行 华兴银行的ProdId是5890
        judgeHuaxingStyle(){
            let ProdId = this.$route.query.ProdId;
            if (ProdId == '5890'){
                return true
            }
            return false;
        }     
    }
}
</script>
<style lang='less'>
@import '~themes/default/styles/tripList.less';
</style>
<style>
/* 由于商旅小应用的菜单会遮挡行程列表的提示信息 通过全局方式将提示信息向上移动1rem 影响范围较大 */
.upwarp-nodata{
    margin-bottom: 1.4rem;
}
.upwarp-progress{
    margin-bottom: 1.4rem;
}
.upwarp-tip{
    margin-bottom: 1.4rem;
}
/* .mescroll-downwarp .downwarp-progress, .mescroll-upwarp .upwarp-progress {
    display: inline-block;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 1px solid gray;
    border-bottom-color: transparent;
    vertical-align: middle;
}
.upwarp-progress {
    margin-bottom: 1.4rem;
}
.mescroll-rotate {
    animation: mescrollRotate .6s linear infinite;
} */
/* .Loadding{

}
.isShow{
    margin:110px
} */
</style>