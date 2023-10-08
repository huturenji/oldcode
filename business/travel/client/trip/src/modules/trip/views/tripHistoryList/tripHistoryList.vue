<template>
<div>
  <mescrollVue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
  <div class="his">
    <!-- loading -->
    <div v-if="loading">
      <!-- <LoadingX tip='获取历史行程中，请稍候...' :spinning="true" :turn="true" /> -->
    </div>
    <EmptyX v-else-if='!loading && noFlag' class="noContent" tipsText='您当前没有行程安排' />
    <div v-else class="his_list_container">
        <div class="tripList" :key="index" v-for='(trip,index) in tripList'>
            <div v-if='trip.cause' class="title">
                <!-- 左侧的title -->
                    <div class="title_content">
                        <span v-if='trip.cause'>{{trip.cause}}</span>
                        <span class="applying" v-if="trip.tripStatusEnum == 'APPLY'">[审批中]</span>
                    </div> 
                    <!-- 右侧的删除 -->
                    <div @click="confirmDeleteTrip(trip)" class="delete_trip">
                        <icon type="icon_mall_delete" size=".34"/>
                    </div>
            </div>
            <div class="position" :class="{flowId:trip.flowId}">
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
           

            <div v-if="!!trip.departTime && !!trip.arriveTime && trip.flowId" class="date">
              <span class="date-title">时间：</span>{{handleDate(trip.departTime)}}<span class="split">-</span>{{handleDate(trip.arriveTime)}}
            </div>

            <!-- 该行程由谁帮您预订dom  -->
            <div v-if='!trip.isSelf && (trip.founderInfo||{}).founderName' class="is_self">
                <span class='clr_red'>
                  <i><icon type="icon_common_prompt" size=".28"/></i>
                  该行程由<span class="name">{{(trip.founderInfo||{}).founderName}}</span>为您预订
                </span>
            </div>
          

            <div v-if='trip.orderDetailList.length>0' class="trip-card-list">
              <div :key="index" v-for='(orderInfo,index) in trip.orderDetailList'>
                  <order :orderInfo="orderInfo" :trip="trip" :isHis='isHis'></order> 
              </div>
            </div>
        </div>
    </div>

    <!--筛选组件 @clearInvoiceCode="clearInvoiceCode-->
    <div v-transfer-dom>
        <popup v-model="showFilter" class="filter_class" position="top" :hide-on-blur='true'>
            <tripHistoryListFilter ref="FilterCom" @confirmFilter="confirmFilter"></tripHistoryListFilter>
        </popup>
    </div>
    <div v-transfer-dom>
      <div @click="showFilter=!showFilter" class="filter-title" :class="{active:showFilter}">
        <p>
          <icon type="icon_filter_screen" size=".28"/>筛选
        </p>
      </div>
    </div>

  </div>
  <!-- loading -->
  <div v-transfer-dom>
    <div v-if="popLoading">
      <loading :show="popLoading" text="删除中"></loading>
    </div>
  </div>
  </mescrollVue>
</div> 
</template>

<script>
import icon from 'components/icon';
import EmptyX from "components/empty/EmptyX.vue";
import Bus from '../common/bus/bus.js';
import {
    TransferDom,
    Popup,
    Loading
} from 'vux';

import tripHandler from '../tripHandler.js';
import tripHistoryListFilter from '../comp/tripHistoryListFilter.vue';
import order from '../comp/order.vue';
import mixin from '../tripMixin.js';
import MescrollVue from 'mescroll.js/mescroll.vue'
export default {
    directives: {TransferDom},
    mixins: [mixin,tripHandler.mixin.tChatEventMixin],
    components: {
        EmptyX,
        order,
        Popup,
        Loading,
        tripHistoryListFilter,
        icon,
        MescrollVue
    },
    data: function () {
        return {
            tripList: [],
            tripListCopy:[],//深拷贝行程列表，每次筛选都用新的数据
            noFlag: false,
            loading: true, //数据加载
            isForwardLeave: false, //是否操作跳转离开页面
            showFilter: false, //控制筛选组件的显隐的变量
            selectedOptionCopy:[0],//筛选条件拷贝
            dateRangeCopy:[],//筛选日期拷贝
            isHis:true,//历史行程标识
            ENABLE_USE_TYPE: tripHandler.ENABLE_USE_TYPE !== false,//是否开启因公因私功能

            mescroll: null,
            mescrollDown: {//不使用下拉刷新    
                use: false
            }, //下拉刷新的配置.
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
        }
    },
    watch:{
        showFilter(val){
            if (val){
                this.$refs.FilterCom.selectedOption = JSON.parse(JSON.stringify(this.selectedOptionCopy));
                this.$refs.FilterCom.dataRange = JSON.parse(JSON.stringify(this.dateRangeCopy));
            }
        }
    },
    beforeCreated() {

    },
    created: function () {
        let that = this;
        that.initDate();
    },
    mounted: function () {
        const that = this;
        Bus.$on('reGetHisTripList', function () {
            that.getTripList('delete', true, null,that.mescroll);
        });
    },
    updated: function () {},
    beforeDestory: function () {
        Bus.$off('reGetHisTripList');
    },
    beforeRouteLeave(to, from, next) {
        next();
    },
    methods: {
        //时间注册
        mescrollInit(mescroll){
            this.mescroll = mescroll
        },
        getData(page,mescroll){
            let that = this;
            if (page.num == 1){
                console.log("go-his-init")
                that.getTripList('init', true, page ,mescroll ,that.selectedOptionCopy,that.dateRangeCopy);
            } else {
                console.log("go-his-init")
                that.getTripList('page', true, page ,mescroll ,that.selectedOptionCopy,that.dateRangeCopy);
            }
        },
        /**
        * T信回退事件的注册回调 必须是goBackFun
        */
        goBackFun(){
            let that = this;
            that.$router.back();           
        },
        //确认筛选条件
        confirmFilter(selectedOption,dateRange){  
            let that = this;
            that.showFilter = false;
            that.selectedOptionCopy = selectedOption;
            that.dateRangeCopy = dateRange;
            that.mescroll.resetUpScroll() //调用mescroll.resetUpScroll(),而resetUpScroll会将page.num=1,再触发up.getData
        // this.getTripList('init', true, null,that.mescroll,that.selectedOptionCopy, that.dateRangeCopy)
        },

        /**
       * 时间转换为年月
       * @param {Object} date  时间
       */
        handleDate(date) {
            return tripHandler.handleDate(date);
        },
        //初始化日期
        initDate(){
            let that = this;
            that.dateRangeCopy = [];
            var pre = new Date();
            pre.setFullYear(pre.getFullYear()-1); 
            that.dateRangeCopy.push(pre.format('yyyy-MM-dd'),new Date().format('yyyy-MM-dd'));
        },
        //删除行程
        confirmDeleteTrip(trip){
            tripHandler.confirmDeleteTrip(trip,this.isHis);
        }
    }
}
</script>

<style lang="less">
 @import '~themes/default/styles/tripList.less';
 @import '~themes/default/styles/tripHistoryList.less';
</style>
