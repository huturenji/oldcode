<template>
    <view class="feather_wrapper" :class="{padt: !!showBtn}">
        <!-- 用来占位顶部title栏的 -->
        <view class="zhanwei" :style="{opacity: 1}"></view>
        <image class="img" mode="widthFix" src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/mallbbc/img/bg_emq_yingdao.png"></image>
        <view v-if="!!showBtn" class="btn_wrap">
            <view @click="goToFeatherConfirm" class="btn">立即送礼</view>
        </view>
    </view>
</template>

<script>
import { setStorageSync } from '@/utils/common.js'
export default {
    data() {
        return {
            hasPreviewCacheKey: 'hasPreviewedFeather', // 是否用户点击过了解鹅毛情的缓存key
            imgUrl: getApp().globalData.imgUrl,
            opacity: 0 //为了做沉浸式加的占位图的透明度
        };
    },
    computed: {
        //是否显示立即送礼的按钮控制变量
        showBtn(){
            return this.$Route.query.showFeatherConfirmBtn == 1
        }
    },

    components: {},
    props: {},
        

    mounted(){
        // 初始化该页面的时候,此时说明用户已经预览并了解了鹅毛情, 缓存中置为truea
        setStorageSync(this.hasPreviewCacheKey, true)
    },
    onLoad() {
        
    },
    onPageScroll(e){
        if (e.scrollTop >= 0 && e.scrollTop <= window.titleBarHeight){
            this.opacity = e.scrollTop / window.titleBarHeight;
        } else {
            this.opacity = 1;
        }
    },

    methods: {
        // 跳转到鹅毛情的下单页面 
        goToFeatherConfirm(){
            this.$Router.push({
                path: '/views/order/confirm/gift',
                query:  this.$Route.query
            })
        }       
    }
};
</script>

<style lang="scss" scoped>
.feather_wrapper{
    width: 100%;
    display: flex;
    &.padt{
        padding-bottom: calc(120rpx + var(--safe-area-inset-bottom));
    }
    .img{
        flex: 1;
        height: auto;
    }
}
.btn_wrap{
    position: fixed;
    bottom: 0;
    z-index: 10;
    width: 750rpx;
    background-color: #000;
    height: calc(120rpx + var(--safe-area-inset-bottom));
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 68rpx var(--safe-area-inset-bottom);
    .btn{
        flex: 1;
        height: 80rpx;
        line-height: 80rpx;
        text-align: center;
        color: #fff;
        font-size: 30rpx;
        background-color: #F30300;
        border-radius: 40rpx;
        cursor: pointer;
    }
}
.zhanwei{
    width: 750rpx;
    height: var(--titleBarHeight);
    position: fixed;
    top: 0;
    z-index: 1000;
    background: #020202;
    opacity: 1;
}
</style>

