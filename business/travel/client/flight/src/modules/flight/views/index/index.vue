<template>
    <div class="page-index" :class="{footerBar:showFooter}">
        <Platform name="serviceReminders"></Platform>
        <div @click="toShihuiPage" class="top_banner"></div>
        <div class="top">
            <nav>
                <div class="tab-button cursorp" :class="{active:0==type}" @click="gotoPage(0)" @touchend="gotoPage(0)">
                    国内机票
                </div>
                <div class='split'></div>
                <div class="tab-button cursorp" :class="{active:1==type}" @click="gotoPage(1)" @touchend="gotoPage(1)">
                    国际/中国港澳台
                </div>
            </nav>
        </div>
        <div class="bottom">
            <div class="content">
                <transition mode="out-in" :name="transitionName">
                    <keep-alive>
                        <component class="child-component" v-bind:is='currentView' :type='type' ref="currentView">
                            <!-- 企业商旅服务热线 -->
                            <template slot="hotPhone">
                                <div class="hot_phone"><i class="left_line">-</i>企业商旅服务热线：<span @click="callPhone">{{hotPhone}}<i class="right_line">-</i></span></div>
                            </template>   
                        </component>
                    </keep-alive>
                </transition>
            </div>
            
        </div>
        <div v-transfer-dom>
            <footerBar v-if='showFooter' :activeType="'home'" :indexPage="'flight'"/>
        </div>          
    </div>
</template>
<script>
import extendUtils from 'flightCommon/extend.js';
import requestHandler from 'flightCommon/requestHandler.js';
import { TransferDom } from 'vux';
const Platform = () => import('components/announcement/index');
const RedPocket = () => import('components/coupon/redPocket.vue');
const Domestic = () => import('./domestic.vue');
const International = () => import('./international.vue');
const footerBar = ()=>import('components/footerBar/footerBar.vue');
let viewMap = {
    '0': 'Domestic',
    '1': 'International'
};
export default {
    directives: {
        TransferDom
    },
    components: {
        Domestic, International, RedPocket, Platform,footerBar
    },
    data: function () {
        let type = (extendUtils.getUrlParams() || {}).TEntry || '0'
        extendUtils.stateManager.setData(null, this);
        return {
            currentView: viewMap[type],
            transitionName: 'slide-left',
            type: type,
            showFooter:true//是否展示底部导航栏首页默认展示底部导航栏
        }
    },
    created: function () {
        extendUtils.setStorage('homePageType', 'mini');
    },
    computed:{
        //热线电话，从platform的常量里面取
        hotPhone(){
            return extendUtils.BIS_CUSTOMER_SERVICE_PHONE;
        }
    },
    methods: {
        /**
         * 页面跳转
         * @view view
         */
        gotoPage(type) {
            if (this.type == 1) {
                this.transitionName = 'slide-left';
            } else {
                this.transitionName = 'slide-right';
            }
            this.type = type;
            this.currentView = viewMap[type];
        },

        /**
        * 联系客服打电话
        */
        callPhone() {
            sinosdk.sino.callTel(this.hotPhone);
        },

        /**
         * 跳转到实惠说明页面
         */
        toShihuiPage(){
            let url = 'flight/index.html#/shihui'
            requestHandler.openPage(url)
        }
    }
}
</script>

<style lang="less" scoped type="text/less">
    @import '~themes/default/styles/index/index.less';
</style>