<template>
    <view class="container container_binjia">
        <home-deco ref="homeDecoComp" :offsetTop="offsetTop" :moreTabOffsetTop="moreTabOffsetTop" :showMoreTabFixed="showMoreTabFixed" :deco_info="deco_data" :specialPadding="true" :showCate="true" :topic_name="topic_name" :is_from_found="false" :isDecoReady="isDecoReady" :isPageShowCart="true" :isPageShowTop="true"></home-deco>
    </view>
</template>
<script>
import indexMixin from "@/common/mixin/indexMixin.vue";
import {disableIosBounce} from "@/common/mixin/bounceMixin";
import homeDeco from '@/components/decorate';
import {resetTileText} from '@/utils/common';

export default {
    mixins: [indexMixin, disableIosBounce],
    data() {
        return {
            topic_id:null, //专题id
            topicKey:'famouseId',//页面key
            decoInfoSetStorage:true,//页面数据是否存缓存
            scrollTop: 0, //页面滚动的距离
            handle: null,
            moreTabOffsetTop: 0,
            showMoreTabFixed: false //是否展示首页的more_tab置顶的功能
        };
    },
    components: {
        homeDeco
    },
    mounted() {
        // #ifdef H5
        // 监听页面的滚动事件
        this.addScrollEvent();
        this.childWindowClose();
        // #endif

    },
    methods: {

        childWindowClose(){
            let that = this;
            try {
                sinosdk.sino.onChildWindowClose(function(){ //注册推送
                    that.updateCartNum();
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
            padding: 30rpx 0 40rpx 0;
        }
    }
}
</style>
