<template>
	<div class="app-wrapper">
        <transition :name="transitionName">
            <router-view class="child-view" :key='key' v-if="!$route.meta.keepAlive"></router-view>			
        </transition>	
        <transition :name="transitionName" >
            <keep-alive>
                <router-view class="child-view" :key='key' v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
        </transition>
	</div>
</template>
<script>
import extendUtils from 'common/lib/utils'
// import dataPointUploadHandler from 'common/lib/requestHandler/dataPointUploadHandler';//暂时不启用
export default {
    name: 'news',
    data() {
        return {
            transitionName: 'slide-left'
        }
    },
    components: {},
    created: function () {
        //数据埋点全局监听事件暂时不启用
        // dataPointUploadHandler.dataPointUploadEventListener();
        //进入页面数据埋点暂时不启用
        // dataPointUploadHandler.dataPointUpload('enter','load','')
    },
    beforeDestroyed:function(){
        //退出页面数据埋点暂时不启用
        // dataPointUploadHandler.dataPointUpload('exit','unload','')
    },
    computed: {
        key() {
            return this.$route.path.replace(/\//g, '_')
        }
    },
    methods: {
    },
    watch: {
        '$route'(to, from) {
            //没有定义动画则返回
            if(!this.$route.meta.needAnimation){
                this.transitionName = ''
                return;
            }
            //如果配置了index，则根据index来判断左右。否则根据路由的前进后退来判断
            if(!!to.meta.index){
                this.transitionName = to.meta.index > from.meta.index ? 'slide-left' : 'slide-right';
            }else if (extendUtils.getSession('nextDirection') == 'forward') { //前进
                this.transitionName = 'slide-left';
            } else if (extendUtils.getSession('nextDirection') == 'back') {
                this.transitionName = 'slide-right';
            }
        }
    }
}
</script>

<style lang="less">
	@import '~newsStyles/core/common.less';	
</style>