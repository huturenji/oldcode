<template>
    <div class="header">
        自定义title
    </div>
</template>
<script>
// import {ipcRenderer} from 'electron';

export default {
    name:'title',
    methods:{
        toMin(){
            // ipcRenderer.send('min-app');
        },
        toClose(){
            // ipcRenderer.send('close-app');
        }
    }
}
</script>
<style lang="less">
.header {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  -webkit-app-region: drag;  // 设置可拖动
}
</style>
