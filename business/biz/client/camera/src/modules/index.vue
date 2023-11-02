<template>
    <div class="root">
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive" class="child-view"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive" class="child-view"></router-view>
    </div>
</template>

<script>
import nativeHandler from 'utils/nativeHandler.js'
export default {
    name: "index",
    data() {
        return {
            PREVIEW_OPTIONS:[260,81,560,420]//预览窗口参数x,y,width,height
        };
    },
    mounted() {
        this.getAppEnv();
    },
    methods: {
        /**
         * 获取主进程传递的app信息
        */
        getAppEnv(){
            nativeHandler.communication('getAppEnv').then((res)=>{
                sessionStorage.setItem('appEnv', JSON.stringify(res));
            })
        },
    }
};
</script>

<style lang="less">
@import '../themes/default/styles/common/common.less';
html {
    height: 100%;
}

body {
    margin: 0px;
    padding: 0px;
    height: 100%;
    background-size: cover;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
        Microsoft YaHei, SimSun, sans-serif;
    font-size: 14px;
    -webkit-font-smoothing: antialiased;
    touch-action: none;
}

.root {
    height: 100%;
}

.child-view {
    position: fixed;
    width: 100%;
    height: 100%;
    transition: all 0.3s;
    -moz-transition: all 0.3s;
    -webkit-transition: all 0.3s;
    -o-transition: all 0.3s;
    backface-visibility: hidden;
    perspective: 1000;
    background: #f2f3f5;
    max-width: auto;
}
/*定义滚动条宽高及背景，宽高分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar{
    width: 7px;
    height: 7px;
    border-radius: 10px;
}
/*定义滚动条的轨道，内阴影及圆角*/
::-webkit-scrollbar-track{
    background-color: #fff;
}
/*定义滑块，内阴影及圆角*/
::-webkit-scrollbar-thumb{
    width: 7px;
    height: 7px;
    border-radius: 10px;
    background-color: #cccccc;
}
::-webkit-scrollbar-thumb:hover{
    background-color: #969696;
}
</style>