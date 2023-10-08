<template>
    <div ref='root' class="page-index">
        <div v-show="activeFooterBar.type == 'home'" class="scroll-view" :class="{footerBar:showFooter}">
            <div @click="toShihuiPage" class="top_banner"></div>
            <div class='entry' ref='entry'>
                <div class="content">
                    <div class="top">
                        <nav>
                            <div class="tab-button cursorp" :class="{active:0==type}" @click="gotoPage(0)">
                                机票
                            </div>
                            <div class="tab-button cursorp" :class="{active:1==type}" @click="gotoPage(1)">
                                酒店
                            </div>
                            <div v-if="!inwxmini" class="tab-button cursorp" :class="{active:2==type}" @click="gotoPage(2)">
                                火车票
                            </div>
                        </nav>
                    </div>
                    <div class="bottom">
                        <div class="content">
                            <transition mode="out-in" :name="transitionName">
                                <!-- <keep-alive> 保活会导致多个服务提醒组件的初始化有问题-->
                                    <component class="child-component" v-bind:is='currentView' :currentView='currentView' ref="currentView" 
                                    @changeSearchData='changeSearchData' @popup='onPopupWindow'>
                                    </component>
                                <!-- </keep-alive> -->
                            </transition>
                        </div>
                    </div>
                </div>
            </div>
            <Trip>
                <div slot="title" class='trip-content'>
                    <div class="title">
                        <div>最近行程</div>
                        <div class='btn' @click="goTrip">更多</div>
                    </div>
                </div>
            </Trip>
            <HotelHistory v-show='type==1' ref="history" :inDate="hotelTripJson.inDate" :outDate="hotelTripJson.outDate" :lat="parseFloat(hotelTripJson.cLat)" :lng="parseFloat(hotelTripJson.cLng)" @clickActive="goHotelDetail"></HotelHistory>
        </div>
        <div v-transfer-dom>
            <div v-if='showFooter' class="footer fixed-dom-part">
                <div class="item"
                    @click="changeFooterBar(item, index)"
                    v-for="(item, index) in footerOptions" :key="index">
                    <div class="icon-box">
                        <div class="iconItem" :style="{backgroundImage: 'url(' + (activeFooterBar.type==item.type?item.activeIconUrl:item.iconUrl)||'' + ')'}"></div>
                    </div>
                    <p :class="{active:activeFooterBar.type==item.type}">{{item.name}}</p>
                </div>
            </div>
        </div> 
        <iframe class="pageFrame bpFrame" :src='activeFooterBar.path' v-if='activeFooterBar.path'></iframe>
    </div>
</template>
<script>
import extendUtils from 'custCommon/extend.js';
import Bus from 'custCommon/bus.js';
import { TransferDom } from 'vux';
import Trip from 'custComp/trip/index.vue';
import requestHandler from 'custCommon/requestHandler';
const Flight = () => import('custComp/flight/index.vue');
const Hotel = () => import('custComp/hotel/index.vue');
const Train = () => import('custComp/train/index.vue');
const HotelHistory = ()=>import('custComp/hotel/history.vue');
const footerBar = ()=>import('components/footerBar/footerBar.vue');
let viewMap = {
    '0': 'Flight',
    '1': 'Hotel',
    '2': 'Train'
};
const footerOptions = [{ 
    name:'出行',
    type:'home',
    iconUrl: require('../../../../themes/default/img/index/btn_tab_chuxing_nor.png'),
    activeIconUrl:require('../../../../themes/default/img/index/btn_tab_chuxing_sel.png')
},
{ 
    name:'我的',
    type:'personal',
    iconUrl: require('../../../../themes/default/img/index/btn_tab_my_nor.png'),
    activeIconUrl:require('../../../../themes/default/img/index/btn_tab_my_sel.png'),
    path: location.origin + '/' + extendUtils.OPENPAGE_MAP['personal/index.html'] + 'personal/index.html#/?t='+new Date().getTime()
}]

let navigatorData = SnUtils.getAppVersion();
var titleBarHeight = 0;
//在weboa下需要显示title


if (navigatorData){
    let titleHeight = window.titleHeight = (navigatorData.titleBarHeight / window.devicePixelRatio) || 0;
    let statusBarHeight = window.statusBarHeight = (navigatorData.statusBarHeight / window.devicePixelRatio) || 0;
    titleBarHeight = window.titleBarHeight = titleHeight + statusBarHeight;
}
document.body.style.setProperty('--titleBarHeight', titleBarHeight + 'px');

export default {
    mixins: [extendUtils.mixin.tChatEventMixin],
    directives: {
        TransferDom
    },
    components: {
        Flight, Hotel, Train, Trip, HotelHistory, footerBar
    },
    data: function () {
        let showFooter = (extendUtils.getUrlParams() || {}).showFooter;//是否显示footer
        //获取当期显示的产品
        let type = (extendUtils.getUrlParams() || {}).type || '0'//默认显示的产品。 值对应viewMap的key
        let currType = viewMap[type]
        //兼容字符串的写法
        if (extendUtils.isEmpty(currType)){
            let _type;
            Object.keys(viewMap).find(key => {
                if (viewMap[key].toLowerCase() == type.toLowerCase()){
                    _type = key;
                    return true;
                }
                return false;
            })
            if (extendUtils.isNotEmpty(_type)){
                currType = viewMap[_type]
                type = _type;
            }
        }
        return Object.assign(extendUtils.stateManager.setData(null, this), {
            currentView: currType,
            transitionName: '',
            type: type,
            showFooter: showFooter != 'false',//是否展示底部导航栏首页默认展示底部导航栏
            hotelTripJson: {},//酒店历史记录（数据中转）
            activeFooterBar: footerOptions[0],
            footerOptions: footerOptions,
            inwxmini:extendUtils.MINIPROGRAM_CONFIG.IN_MINIPROGRAM//是否展示火车票入口
        })
    },
    mounted(){
        this.emitScrollEvent();
        this.onFrameBack();
    },
    methods: {
        /**
         * iframe回退事件
         * WEBOA下 iframe嵌入的页面再次打开页面，是重新开了一个顶层iframe，而不是在同级iframe下打开一个新的iframe
         * WEBOA-> iframe 打开  bbc-mobile -> iframe 打开 travel-mobile 在travel-mobile中打开页面，此时打开了一个与bbc-mobile同级的iframe
         */
        onFrameBack(){
            let that = this;
            sinosdk.sino.message.addEventListener('closePage', () => {
                that.activeFooterBar = footerOptions[0];
                that.initAppEvent();
            })
        },
        /**
         * 向父iframe（如果有）发出消息，传递scrollTop值
         */
        emitScrollEvent(){
            // weboa直接返回 避免出现滑动后导致title没有的bug
            let that = this;
            this.isInFrame() && this.$refs.root.addEventListener('scroll', () => {
                sinosdk.sino.message.broadcastEvent(window.parent, 'childFrameScroll', {scrollTop: that.$refs.root.scrollTop})
            })
        },
        /**
         * 更新酒店历史的参数
         */
        changeSearchData(data){
            this.hotelTripJson = data;
        },
        /**
         * 点击酒店历史打开酒店详情
         */
        goHotelDetail(data){
            Bus.$emit('goHotelDetail', data)
        },
        /**
         * 页面跳转
         * @view view
         */
        gotoPage(type) {
            if (this.type < type) {
                this.transitionName = 'slide-left';
            } else {
                this.transitionName = 'slide-right';
            }
            this.type = type;
            this.currentView = viewMap[type];
        },
        /**
         * 打开行程
         */
        goTrip(){
            requestHandler.openPage('trip/index.html#/')
        },
        changeFooterBar(item){
            //点击当前页面按钮无响应
            if (this.activeFooterBar==item.type){
                return;
            }
            document.title = item.name;
            this.activeFooterBar = item;
        },
        isInFrame(){
            return window.top && window.top != window.self;
        },
        goBackFun(){
            //先返回到第一个tabbar页面
            if (this.activeFooterBar.type != footerOptions[0].type){
                //先向iframe发出返回事件
                if (sinosdk.sino.message.broadcastEventToFrame('appBack')){
                    return;
                }
                this.activeFooterBar = footerOptions[0];
                return;
            }
            extendUtils.closePage()
        },
        toShihuiPage(){
            let url = 'flight/index.html#/shihui';
            requestHandler.openPage(url)
        }
    }
}
</script>

<style lang="less" scoped type="text/less">
    @import '~themes/default/styles/index/index.less';
</style>
<style lang='less'>
body{
    background-color: #eff2f5;
}
.reminderList, .reminderDetail {
    top: var(--titleBarHeight) !important;
    height: calc(100% - var(--titleBarHeight)) !important;
    nav{
        border-radius: .2rem;
    }
}
</style>