<template>
    <view class="container container_binjia">  
        <home-deco
            ref="homeDecoComp"
            :moreTabOffsetTop="moreTabOffsetTop"
            :showMoreTabFixed="showMoreTabFixed"
            :deco_info="deco_data"
            :specialPadding="true"
            :showCate="true"
            :topic_name="topic_name"
            :is_from_found="false"
            :isDecoReady="isDecoReady"
            :spreadDialogData="showTip"
            :showSpread="showSpread"
            :isPageShowCart="true"
            :isPageShowTop="true"
        />

    </view>
</template>
<script>
import indexMixin from "@/common/mixin/indexMixin.vue";
import {disableIosBounce} from "@/common/mixin/bounceMixin";
import homeDeco from '@/components/decorate';
import { setSession, getSession, handleBpParam, inMiniprogram,resetTileText} from '@/utils/common'
import DB from '@/utils/indexDB'
import decorateHandler from '@/components/decorate/handler';
import {guideInstall} from '@/components/guide';

export default {
    mixins: [indexMixin, disableIosBounce],
    data() {
        return {
            deco_data: null,
            imgUrl: getApp().globalData.imgUrl,
            topic_id: null, //专题id
            topicKey: 'famouseId',//页面key
            decoInfoSetStorage: true,//页面数据是否存缓存
            scrollTop: 0, //页面滚动的距离
            handle: null,
            moreTabOffsetTop: 0,
            showMoreTabFixed: false, //是否展示首页的more_tab置顶的功能
            channelId: '',
            showTopThumb: false,
            cartData:{},//购物车的装修数据
            showSpread:true //是否展示开屏图
        };
    },
    components: {
        homeDeco
    },
    computed: {
    },
    mounted() {
        // #ifdef H5
        this.addScrollEvent();
        this.childWindowClose();
        // #endif
        // 暂时屏蔽首页引导
        if(!inMiniprogram()){ //非微信小程序 才加载首页的引导页
            guideInstall();
        }
    },
    onShow(){
        this.$store.dispatch('getCartNum');
    },
    activated(){
        // #ifdef H5
        // 监听页面的滚动事件
        this.addScrollEvent();
        // #endif
       
    },
    deactivated(){
        // #ifdef H5
        this.removeListener()
        // #endif
    },

    //页面滚动事件
    onPageScroll(res) {
        //判断页面是否在滚动的状态
        this.judgePageScrollState(res);
    },
    methods: {

        // 判断页面是否在滚动的状态 
        judgePageScrollState(res){
            let timerFunc = setTimeout(() => {
                if (this.scrollTop == res.scrollTop) {
                    this.scrollTop = res.scrollTop;
                    clearTimeout(timerFunc)
                }
            }, 900)
        },

        // 该方法在indexMixin.js里面
        initPage() {
            // #ifdef H5
            //url上是否携带渠道id，存储缓存并从缓存取，兼容页面返回时的场景
            if (handleBpParam(this)?.channelId) {
                setSession(this.sessionChannelKey, handleBpParam(this).channelId);
            }
            if (!!getSession(this.sessionChannelKey)){
                this.channelId = getSession(this.sessionChannelKey);
            } else {
                this.channelId = undefined
            }
            // #endif

            this.getDecoInfo();
        },
        getDecoInfoRequest(refreshPage = false) {
            let that = this;
            let requestDecoIndex = ++that.requestDecoIndex;
            return new Promise(async (resolve)=>{
                this.loading = true;
                uni.showLoading();
                // #ifdef H5
                this.client = 'h5'
                // #endif
                    
                // #ifdef APP-PLUS
                switch (uni.getSystemInfoSync().platform) {
                case 'android':
                    this.client = 'android'
                    break;
                case 'ios':
                    this.client = 'ios'
                    break;
                default:
                    break;
                }
                // #endif
                    
                // #ifdef MP
                this.client = 'weixinXcx'
                // #endif
                let param = {
                    os: this.client
                }
                let config = {};
                if (this.channelId) {
                    param.channelId = this.channelId
                }
                decorateHandler.getIndexDeco(param,config).then(async res => {
                    this.loading = false;
                    uni.hideLoading();
                    if (res.state == 200 && res.data.data) {
                        that.showTip = res.data.showTip;
                        if (that.showTip) {
                            
                            let tempshowTip = JSON.parse(that.showTip)
                            // 判断是否处在开屏图的有效期内
                            const currentDate = new Date().getTime(); // '2023-01-05 00:52:00'
                            let time1 = tempshowTip[0].deadline[0].replaceAll('-','/')
                            let time2 = tempshowTip[0].deadline[1].replaceAll('-','/')
                            if (tempshowTip[0].deadline && tempshowTip[0].deadline.length > 0 && (new Date(time1).getTime() > currentDate || new Date(time2).getTime() < currentDate)) {
                                
                                this.showSpread = false
                            } else {
                                this.showSpread = true
                            }
                        } else {
                            this.showSpread = true
                        }

                        //最后一次请求才刷新数据
                        if (requestDecoIndex == that.requestDecoIndex){
                            res.data.DecoName = 'bbcDecoInfoplus_home'
                            if (await DB.getOne('DecoInfo', 'bbcDecoInfoplus_home', this.userKey)) {
                                DB.put('DecoInfo', res.data, this.userKey)
                            } else {
                                DB.add('DecoInfo', res.data, this.userKey)
                            }
                        }
                        //需要刷新数据的时候才刷新
                        if (!!refreshPage && requestDecoIndex == that.requestDecoIndex) {
                            that.afterGetDecoInfo(res.data, true);
                        }
                        
                        resolve(res.data)
                    } else {
                        resolve({})
                    }
                }).catch(()=>{
                    uni.hideLoading();
                    resolve({})
                })
            })
        },
        //获取装修数据
        async getDecoInfo(){
            let that = this;
            let tempData = {};
            uni.showLoading(); //取indexDB是异步的此时会导致页面白屏，新增loading优化 后续装修数据接口请求回来后 调用hideloading
            if (that.decoInfoSetStorage && !!await DB.getOne('DecoInfo', 'bbcDecoInfoplus_home', this.userKey)) {
                tempData = await DB.getOne('DecoInfo', 'bbcDecoInfoplus_home', this.userKey);
                let decoList = JSON.parse(tempData.data || "[]")
                // 判断缓存有数据并且数据为重构后的数据结构, 才进行数据渲染
                if (decoList.length > 0 && !Object.prototype.hasOwnProperty.call(decoList[0], 'is_show')) {
                    that.afterGetDecoInfo(tempData);
                }

                // 重新请求接口装修数据
                that.getDecoInfoRequest(true);
            } else {
                let data = await that.getDecoInfoRequest();
                if (!!data && data.data) {
                    tempData = data;
                } else {
                    that.deco_data = [];
                }
                that.afterGetDecoInfo(tempData, true);
            }
        },


        childWindowClose(){
            let that = this;
            try {
                sinosdk.sino.onChildWindowClose(function(){ //注册推送
                    that.updateCartNum();
                    // sinosdk.sino.message.broadcastEventToFrame('appBack')
                    //向iframe广播回退事件，让iframe内的页面修改页面 当前页面直接重置title也可以 todo
                    //WEBOA下监听页面返回事件，并且重置title
                    if(that.$route.path=='/pages/tabbar/services'||that.$route.path=='/pages/tabbar/personalcenter'){
                        resetTileText();//兼容贵阳银行页面回退事件被该地方监听，重置title
                    }
                }.bind(that));
            } catch (error) {
                    
            }
        },

        updateCartNum(){
            this.$store.dispatch('getCartNum'); //全局刷新购物车数量
        },
        addScrollEvent(){
            let that = this;
            this.removeListener();
            document.addEventListener('scroll', that.handle = function handler(){
                that.eventListenerHanler(event);
            }, true);
        },

        removeListener(){
            let that = this;
            document.removeEventListener('scroll', that.handle, true);
        },

        async eventListenerHanler(){    
            this.scrollTop = document.body.scrollTop || document.documentElement.scrollTop; //兼容个不同浏览器的滚动距离
        }
    }
}
</script>

<style lang="scss">
//document不可滚动，至少从装修容器这一级才可滚动
page{
    height: 100%;
    overflow: hidden;
}
.container_binjia{
    height: 100%;
    ::v-deep .nav_wrap{
        .u-scroll-list{
            padding: 30rpx 0 0rpx 0;
        }
    }
}
</style>
