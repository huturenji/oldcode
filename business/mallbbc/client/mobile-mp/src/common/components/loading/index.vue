<template>
    <view class="mask" v-if="show" :class= "[mask == 'true' || mask == true ? 'mask-show' : '']" @click="Mclose" @touchmove.stop.prevent="preventTouchMove">
        <!-- 加载动画开始 --> 
        <loading-template />
        <!-- 加载动画结束 -->
        <view v-if="!!text" :style="[textStyle]" class="title">{{text}}</view>
    </view>
    <!-- 遮罩层-->
  </template>
  
<script scoped="true">
    import LoadingTemplate from "./template.vue";
    export default {
        name: "w-loading",
        components:{LoadingTemplate},
        props:{
            text: {
                type: String,
                default: ''
            },
            mask: {
                type: Boolean | String,
                default: false
            },
            clickMask: {
                type: Boolean | String,
                default: false
            },
            textStyle: {
                type: Object | String,
                default: () => {
                    return {
                        color: '#222',
                        marginTop: '20rpx'
                    }
                }
            }
        },
        data() {
            return {
                show: false
            };
        },
        methods:{
            preventTouchMove(){
                return;
            },
            Mclose(){
                if(this.clickMask == 'true' || this.clickMask == true){
                    this.show = false
                }
            },
            open(){
                this.show = true
            },
            close(){
                this.show = false
            }
        }
    };
</script>
  
<style scoped lang="scss">
.mask {
    position: fixed;
    z-index: 99999;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction:column;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
}
.mask.mask-show{
    background: rgba(7, 17, 27, .3);
}
.title{
    color: #222;
    font-size: 28upx;
}
</style>
  