<template>
    <div class="root">
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive" class="child-view"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive" class="child-view"></router-view>
    </div>
</template>

<script>
export default {
    name: "index"
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
    position: inherit;
    margin: auto;
    width: 1280px;
    height: 720px;
    max-width: auto;
    background: url('@/themes/default/img/home/logo.png') left 13.5px top 10px no-repeat, url('@/themes/default/img/home/bg.png') 0% 0% no-repeat,;
    background-size: 179px 34px,cover;
    transition: all 0.3s;
    -moz-transition: all 0.3s;
    -webkit-transition: all 0.3s;
    -o-transition: all 0.3s;
    backface-visibility: hidden;
    perspective: 1000;
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