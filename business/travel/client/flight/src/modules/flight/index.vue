<template>
    <div>
        <router-view class="child-view" v-if="!$route.meta.keepAlive && !$route.meta.needAnimation"></router-view>
        <transition :name="transitionName">
            <router-view class="child-view" v-if="!$route.meta.keepAlive && $route.meta.needAnimation"></router-view>
        </transition>
        <keep-alive>
            <router-view class="child-view" v-if="$route.meta.keepAlive && !$route.meta.needAnimation"></router-view>
        </keep-alive>
        <transition :name="transitionName">
            <keep-alive>
                <router-view class="child-view" v-if="$route.meta.keepAlive && $route.meta.needAnimation"></router-view>
            </keep-alive>
        </transition>
    </div>
</template>

<script>
import extendUtils from 'flightCommon/extend.js';
export default {
    name: 'flight',
    data() {
        return {
            transitionName: 'slide-left'
        }
    },
    components: {},
    created: function () {
    },
    methods: {
    },
    watch: {
        '$route'() {
            if (extendUtils.getSession('nextDirection') == 'forward') { //前进
                this.transitionName = 'slide-left';
            } else if (extendUtils.getSession('nextDirection') == 'back') {
                this.transitionName = 'slide-right';
            }
        }
    }
}
</script>

<style lang="less">
    @import '~styles/core/common.less';
</style>
