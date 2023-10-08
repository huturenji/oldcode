<template>
    <div class="choose_list_wrap">          
        <div class="choose_list_box">
            <!--mescroll滚动区域的基本结构-->
            <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
                <div id='dataList'>
                    <!-- 飞机订单列表 -->
                    <div v-if="tripType=='flight'" class="content_item">
                        <div class="tripList cursorp" v-for='trip in tripList' :key="trip.orderNo" @click='chooseItem(trip)'>
                            <div class="checker">
                                <icon :type="judgeCheck(trip)?'btn_common_checkbox_sel':'btn_common_checkbox_nor'" size=".4"/>
                            </div>
                            <div class="content">
                                <div class="main">
                                    <div class="detail">
                                        <div class="trip">
                                            <i><icon type="icon_plane_plane" size=".32"/></i>
                                            <span> {{trip.departCityName}} — {{trip.arriveCityName}}</span>
                                        </div>
                                        <div class="No">{{trip.sAirportName}}&nbsp;{{trip.flightNo}}</div>
                                        <div class="date">
                                            <span>{{handle2Date(trip.departTime)}}</span> &nbsp;
                                            {{handleTime(trip.departTime)}}-{{handleTime(trip.arriveTime)}}
                                        </div>
                                    </div>
                                    <div class="price">
                                        <div class="fee num-font"><span class="biao">￥</span>{{trip.charge || '暂无价格'}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 酒店订单列表 -->
                    <div v-if='tripType=="hotel"' class="content_item">
                        <div class="tripList cursorp" v-for='orderItem in tripList' :key="orderItem.orderNo" @click='chooseItem(orderItem)'>
                            <div class="checker">
                                <icon :type="judgeCheck(orderItem)?'btn_common_checkbox_sel':'btn_common_checkbox_nor'" size=".4"/>
                            </div>
                            <div class="content">
                                <div class="main">
                                    <div class="detail">
                                    <div class="trip"> 
                                        <i><icon type="icon_hotel_hotel" size=".32"/></i>
                                        <span>{{orderItem.hotelName}}</span>
                                    </div>
                                    <div class="No"> {{(orderItem.roomTypeName || '')+" "+orderItem.roomCount+"间"}}</div>
                                    <div class="date">
                                        {{handleDate(orderItem.arriveDate)+"至"+handleDate(orderItem.departDate)}}</div>
                                    </div>
                                    <div class="price">
                                        <div class="fee num-font"><span class="biao">￥</span>{{orderItem.charge || '暂无价格'}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 火车订单列表 -->
                    <div v-if="tripType=='train'" class="content_item">
                        <div class="tripList cursorp" v-for='trip in tripList' :key="trip.orderNo" @click='chooseItem(trip)'>
                            <div class="checker">
                                <icon :type="judgeCheck(trip)?'btn_common_checkbox_sel':'btn_common_checkbox_nor'" size=".4"/>
                            </div>
                            <div class="content">
                                <div class="main">
                                    <div class="detail">
                                        <div class="trip">
                                            <i><icon type="icon_train_train" size=".32"/></i>
                                            <span>{{trip.startStation}} — {{trip.endStation}}</span>
                                        </div>
                                        <div class="No">车次{{trip.trainNo}}</div>
                                        <div class="date">
                                            <span>{{handle2Date(trip.startTime)}}</span> &nbsp;
                                            {{handleTime(trip.startTime)}}-{{handleTime(trip.endTime)}}
                                        </div>
                                    </div>
                                    <div class="price">
                                        <div class="fee num-font"><span class="biao">￥</span>{{trip.charge || '暂无价格'}}</div>
                                        <div class="trian_tips">购票手续费</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </mescroll-vue>
        </div>      
        <div v-transfer-dom>
            <div class="bottomBar" v-if="tripList.length > 0">
                <div class="detail">
                    <div class="chooseAll cursorp" @click='chooseAll'>
                        <div class="checker">
                            <icon :type="hasChooseAll?'btn_common_checkbox_sel':'btn_common_checkbox_nor'" size=".4"/>
                        </div>
                        <div class="text">全选</div>
                    </div>
                    <div class="priceT">
                        <div class="totalPerson">共 <span class="num">{{checkedNum}}</span> 单</div>
                    </div>
                </div>
                <div class="submit cursorp" @click="submit()">
                    <span>下一步</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import icon from 'components/icon/index';
import {
    TransferDom
} from 'vux';
import invoiceHandler from 'modules/invoiceManage/views/common/lib/invoiceHandler.js';


import {
    isReopen
} from "./isReopen.js";
// 引入mescroll的vue组件
import MescrollVue from 'mescroll.js/mescroll.vue'
export default {
    mixins: [invoiceHandler.mixin.tChatEventMixin],
    name: 'chooseOrder',
    directives: {
        TransferDom
    },
    components: {  
        icon,
        MescrollVue
    },
    computed: {
        checkedNum () {
            return this.choosedList.length;
        }
    },
    data () {
        let managerData = invoiceHandler.stateManager.setData([], this)
        let data = {
            isPC: invoiceHandler.isPC(),
            payType: null, // 因公 因私
            tripType: '', // 订单类型
            tripList: [], // 订单列表数据
            choosedList: [], //选中的订单列表的订单号       
            hasChooseAll: false, //全选标识
            mescroll: null,
            //下拉刷新的配置.
            mescrollDown: { 
                use: false
            }, 
            mescrollUp: { // 上拉加载的配置.
                auto: false,
                scrollbar: false,
                callback: this.getTripList,
                noMoreSize: 0,
                loadFull: {
                    use : false,
                    timeout: 10 //连续翻页n秒后停止该功能
                },
                page: {
                    num: 0,
                    size: 20
                },
                htmlNodata: '<p class="mescroll-upwarp-nodata">没有更多了</p>',
                empty: {
                    warpId: 'dataList',
                    icon: require('themes/default/img/defaultPage/img_defpage_nocontent@2x.png'),
                    tip: '暂无可开发票'
                },
                htmlLoading: '<p class="upwarp-progress mescroll-rotate"></p><p class="upwarp-tip">正在加载中...</p>'
            }
        }
        data = Object.assign(managerData, data);
        return data
    },
    async created () {
        this.useTypeConfig = await invoiceHandler.useTypeConfig();//获取因公,因私的配置对象
        this.payType = this.useTypeConfig.default();
        
        /**
         * 获取可开发票的订单列表，选择需要开发票的订单，然后跳转到开票确认页面
         */
        // let that = this
        let urlParams = invoiceHandler.getUrlParams();
        this.tripType = urlParams.tripType;
        
        //根据tripType判断title的显示
        this.changeTitle(); 

        // 初始化上拉刷新
        this.initData();
        
    },
 
    methods: {
        //注册并监听t信返回事件
        goBackFun(){
            let that = this
            that.$router.back()
        },
        //根据tripType判断title的显示
        changeTitle(){
            if (this.tripType == 'flight') {
                document.title = '机票订单'
            } else if (this.tripType == 'hotel') {
                document.title = '酒店订单'
            } else if (this.tripType == 'train') {
                document.title = '火车票订单'
            } else if (this.tripType == 'car') {
                document.title = '商务用车订单'
            }
        },

        /**
         * 全选方法, 选择方法
         */
        chooseAll () {
            // const that = this;
            this.hasChooseAll = !this.hasChooseAll;
            if (this.hasChooseAll){
                this.choosedList = this.tripList.map(item=>{
                    return item.orderNo;
                })
            } else {
                this.choosedList = [];
            }
            
        },

        /****
         * 判断是否选中
         */
        judgeCheck(item){
            let index = this.choosedList.findIndex(temp => {
                return temp == item.orderNo;
            })
            return index > -1;
        },

        //单选
        chooseItem(item) {
            const that = this;   
            let index = this.choosedList.findIndex(temp => {
                return temp == item.orderNo
            })   
            
            if (index > -1){ //说明此时是移除选中效果
                this.choosedList.splice(index, 1);
            } else { //说明此时是新增选中效果
                this.choosedList.push(item.orderNo);
            }
            

            that.hasChooseAll = that.choosedList.length == that.tripList.length;
        },

        /**
         * 格式化时间
         */
        handleDate(date) {
            // const that = this;
            return new Date(date).format('yyyy-MM-dd')
        },

        handle2Date(date) {
            if (!date){ return '' }
            // const that = this;
            date = date.replace(/\-/g, "/");
            return new Date(date).format('yyyy-MM-dd') + ''
        },

        handleTime(date) {
            if (!date){ return '' }
            // const that = this;
            date = date.replace(/\-/g, "/");
            const minute = new Date(date).getMinutes() < 10 ? ('0' + new Date(date).getMinutes()) : new Date(date).getMinutes();
            const hours = new Date(date).getHours() < 10 ? ('0' + new Date(date).getHours()) : new Date(date).getHours();
            const time = hours + ':' + minute;
            return time
        },

        //获取星期几
        handle2Week(date){
            if (!date){ return '' }
            date = date.replace(/\-/g, "/");
            let time = new Date(date);
            return invoiceHandler.indexToWeek(time.getDay())
        },

        //获取orderType查询未开发票的订单类型
        getOrderType(){
            let that = this;
            if (!that.tripType){ return }
            let obj = {};
            switch (that.tripType){
            case 'train':
                obj.orderType = 3;
                obj.orderListKey = 'trainOrders';
                break

            case 'flight':
                obj.orderType = 1;
                obj.orderListKey = 'flightOrders';
                break

            case 'hotel':
                obj.orderType = 2;
                obj.orderListKey = 'hotelOrders';
                break

            default: 
                break;
            }
            return obj;
        },


        /**
         * 获取订单列表
         */
        getTripList(page, mescroll) {
            const that = this;           
            let obj = {
                pageSize: page.size,
                pageIndex: page.num,
                orderType: that.getOrderType().orderType, //订单类型，1. 机票订单 2. 酒店订单 3.火车票订单
                invoiceFlag: 1, //1=可开票
                queryType: 1 //我的订单列表
            };
            invoiceHandler.getOrderWithoutInvoice(obj).then((res) => {
                if (res.resultCode == 0) {
                    let orderListKey = that.getOrderType().orderListKey;
                    that.tripList = [...that.tripList, ...res.result[orderListKey]];
                    that.hasChooseAll = false; //接请求完成后 取消全选功能
                    mescroll.endByPage(that.tripList.length, res.result.totalPageCount); //隐藏下拉刷新和上拉加载的状态, 在联网获取数据成功后调用
                }
            }).catch((err) => {
                mescroll.endErr()
                console.error(err);
            });
        },

        // 给每一项塞一个IsCheck属性，用来选中
        setCheckedKey(list, key, value){
            if (!!!list || list.length <= 0){ return [] }
            return list.map(item => {
                return {
                    ...item,
                    [key]: value
                }
            })
        },


        /**
         *  下一步提交
         */
        submit () {
            const that = this;
            if (that.checkedNum > 0) {
                let checker = true
                //此步骤为了处理30天之后，不再支持补开报销凭证
                for (let i = 0; i < that.tripList.length; i++) {
                    const list = that.tripList[i]
                    if (that.choosedList.indexOf(list.orderNo) > -1) {
                        let errorText = isReopen(that.tripType, list);
                        if (errorText) {
                            invoiceHandler.showToast(errorText)
                            checker = false
                            break
                        }
                    }
                }
                if (checker) {
                    invoiceHandler.setSession('orderChoosenList', JSON.stringify(that.choosedList))
                    that.$router.push({path: '/confirm', query: {tripType: that.tripType,checkedNum: that.checkedNum,payType: that.payType}})
                }
            } else {
                invoiceHandler.showToast('请先选择订单')
            }
        }, 

        initData(){
            this.mescroll.resetUpScroll();
        },
        // 初始化 mescroll 组件
        mescrollInit(mescroll){
            this.mescroll = mescroll
        }

    }
}
</script>

<style lang='less' scoped>
@import '~themes/default/styles/chooseOrder.less';
</style>


