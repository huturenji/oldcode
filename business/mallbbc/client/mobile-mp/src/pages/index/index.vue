<template>
    <view class="container" :class="{'container_binjia_ios': isIos}">  
        <w-loading ref="loading"></w-loading>

        <!-- 顶部导航栏组件 -->
        <navbar-comp 
            :parentScrollTop="parentScrollTop"
            :title="title"
            :decoItem="navbarDeco"
        />

        <home-deco
            ref="homeDecoComp"
            :deco_info="deco_data"
            :parentScrollTop="parentScrollTop"
            :requestDone="requestDone"
            @initNavbar="initNavbar"
            :showSearchBar="!showTimeLineMask"
        />

        <!-- 首页开屏框 start -->
        <SpreadDialog v-if="spreadDialogData && showSpread" :openScreenData="spreadDialogData"></SpreadDialog>
        <!-- 开屏框 end -->


        <!-- 登录弹窗 start-->
        <UniPopup ref="authPopup" type="bottom">
            <AuthComp @confirm="confirm" @cancel="cancel" />
        </UniPopup>
        <!-- 登录弹窗 end -->

        <TimelineMask v-if="showTimeLineMask"/>


    </view>
</template>
<script>
import SpreadDialog from '@/common/components/spread-dialog/spread-dialog.vue';
import homeDeco from '@/common/components/decorate';
import decorateHandler from '@/common/components/decorate/handler';
import navbarComp from '@/common/components/decorate/navbar/index';
import shareMixin from '@/common/mixin/share';
import systemMixin from '@/common/mixin/system';
import UniPopup from '@/common/components/uni-popup/uni-popup.vue'; // 底部弹出层
import { isIos, judgeSceneTimeLine } from '@/utils/common'
import AuthComp from '@/common/components/auth/auth-comp';
import TimelineMask from '@/common/components/timeline-mask/index';
import { authProxyHandler } from '@/utils/auth/auth.js';

export default {
    mixins: [shareMixin, systemMixin],
    data() {
        return {
            authKey: 'authed-index',
            deco_data: null, // 装修数据
            title: '',
            parentScrollTop: 0, // 页面滚动高度
            navbarDeco: {} , //titlebar装修数据 
            spreadDialogData:null,
            showSpread: false,
            requestDone: false, // 获取装修数据接口是否请求完成
        };
    },
    components: {
        homeDeco,
        UniPopup,
        AuthComp,
        navbarComp,
        SpreadDialog,
        TimelineMask,
    },
    computed: {
        isIos(){ 
            return isIos();
        },
        showTimeLineMask() {
            return judgeSceneTimeLine();
        }
    },
    mounted() {
        this.authProxyHandler();
        this.getDecoInfo();
    },
    onShow() {
        this.setTabBarIndex(0);
        this.updateCartNum();
        this.$statEvent({
            behaviorType: 'pv',
            pageUrl: this.$Route.path,
            referrerPageUrl: '',
        })
	},
    onHide(){
        // 页面隐藏，关闭授权弹窗
        this.$refs?.authPopup?.close();
    },
    //页面滚动事件
    onPageScroll({ scrollTop }) {
        this.parentScrollTop = scrollTop
    },
    onReachBottom(){
        uni.$emit('decoReachBottom')
    },
    onShareTimeline() {},
    methods: {
        confirm(flag){
            uni.$emit(this.authKey, flag);
            this.$refs.authPopup.close();
        },
        cancel(){
            uni.$emit(this.authKey, false);
            this.$refs.authPopup.close();
        },
        // 当前页面请求授权
        authProxyHandler(){
            if(!judgeSceneTimeLine()){
                authProxyHandler(this, this.authKey);
            }
        },
        updateCartNum(){
            uni.$emit('updateCartNum')
        },
       
        getDecoInfoRequest() {
            return new Promise((resolve)=>{
                
                this.client = 'weixinXcx'
                let param = {
                    os: this.client
                }
                let config = {}
                this.$refs?.loading?.open();
                this.requestDone = false;
                decorateHandler.getIndexDeco(param, config).then(async res => {
                    if (res.state == 200 && res.data.data) {
                        // 开屏图
                        this.spreadDialogData = res.data.showTip;
                        if (this.spreadDialogData) {
                            
                            let tempshowTip = JSON.parse(this.spreadDialogData)
                            // 判断是否处在开屏图的有效期内
                            const currentDate = new Date().getTime(); // '2023-01-05 00:52:00'
                            if (tempshowTip[0].deadline && tempshowTip[0].deadline.length > 0 && (new Date(tempshowTip[0].deadline[0]).getTime() > currentDate || new Date(tempshowTip[0].deadline[1]).getTime() < currentDate)) {
                                
                                this.showSpread = false
                            } else {
                                this.showSpread = true
                            }
                        } else {
                            this.showSpread = true
                        }
                        resolve(res.data)
                    } else {
                        resolve({})
                    }
                }).catch(()=>{
                    resolve({})
                }).finally(()=>{
                    this.$refs?.loading?.close();
                    this.requestDone = true;
                })
            })
        },
        //获取装修数据
        async getDecoInfo(){
            let that = this;
            let data = await that.getDecoInfoRequest();
            // 更新title
            if(!!data.name){
                that.title = data.name
            }
            if (!!data && data.data) {
                let decoList = JSON.parse(data.data)
                if(!!decoList){
                    this.deco_data = decoList;
                }
            } else {
                that.deco_data = [];
            }
        },

        //根据装修数据 初始化顶部的导航栏相关的配置
        initNavbar(config){
            this.navbarDeco = config;
        }
    },
    watch: {
        '$store.state.cartNum'(val) {
            this.setCartNum(val || 0)
        }
    }
}
</script>

<style lang="scss" scoped>
.container{
    padding-bottom: $tabbar-height-android
}

.container_binjia_ios{
    padding-bottom: $tabbar-height-ios
}

.preview{
    position: fixed;
	top: 216rpx;
	right: 0px;
    width: 164rpx;
    height: 64rpx;
    image{
        width: 164rpx;
        height: 64rpx;
    }
}

// 修复导航组件[navigation]自带下侧paddingbottom的问题
::v-deep .u-scroll-list{
    padding-bottom: 0 !important;
    font-size: 0;
}

::v-deep .u-tabs__wrapper__nav__item{
    padding: 0 12rpx !important;
}

::v-deep .tabbar .u-tabbar-item__text{
    margin-top: -3px!important;
}

::v-deep .floatingWindow {
    .cart-thumb {
        margin-top: 20rpx;
        position: relative;
        bottom: unset; 
        right: unset;   
        z-index: unset;
        pointer-events: auto;
    }

    .backTop {
        margin-top: 20rpx;
        position: relative;
        bottom: unset; 
        right: unset;   
        z-index: unset;
        pointer-events: auto;
    }
}

.container{
    ::v-deep .empty_container{
        margin-top: 300rpx;
    } 
}
</style>
